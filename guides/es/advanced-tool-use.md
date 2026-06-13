# Uso avanzado de herramientas en API de Claude

Cuatro patrones que reducen costos de token y mejoran precisión para aplicaciones de Claude API intensivas en herramientas. Cada patrón resuelve un problema específico; la tabla de decisión al final asigna el problema al patrón.

---

## Patrón 1: Llamada de herramienta programática (PTC)

**Qué es:** en lugar de que Claude llame herramientas una a una en un bucle, Claude escribe código de orquestación que llama múltiples herramientas en un único paso de inferencia.

Cuando necesitas leer 20 archivos y extraer un valor de cada uno, el enfoque estándar llama la herramienta `read_file` 20 veces — 20 viajes redondos, 20 mensajes de resultado de herramienta, 20 adiciones a contexto. Con PTC, Claude escribe un script Python que llama `read_file` en un bucle; el ejecutor de código lo ejecuta; obtienes un resultado.

**Ahorros de token:** aproximadamente 37% para flujos de trabajo de múltiples herramientas. Para una secuencia de 3 herramientas sin PTC, pagas por el mensaje de llamada de herramienta, resultado de herramienta y relectura de contexto acumulado en cada viaje redondo. PTC colapsa esto en un paso de inferencia.

### Configuración

Agrega `allowed_callers` a la definición de herramienta para permitir que la herramienta de ejecución de código la invoque:

```python
tools = [
    {
        "name": "read_file",
        "description": "Read a file from the codebase",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"}
            },
            "required": ["path"]
        },
        "allowed_callers": ["code_execution_20250825"]  # habilita PTC
    }
]
```

### Antes de PTC (20 viajes redondos)

```python
# Sin PTC — Claude llama read_file 20 veces
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools,
    messages=[{"role": "user", "content": "Extract the version from each of these 20 package.json files: [list]"}]
)
# Claude hace 20 llamadas de herramienta secuenciales. 20 viajes API redondos.
```

### Después de PTC (1 paso de inferencia)

```python
# Con PTC — Claude escribe código para lotes las lecturas
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools + [{"type": "code_execution_20250825"}],
    messages=[{"role": "user", "content": "Extract the version from each of these 20 package.json files: [list]"}]
)
# Claude escribe: results = [read_file(p) for p in paths]; return [json.loads(r)['version'] for r in results]
# Una ejecución de código. Un viaje redondo.
```

### Cuándo usar

- Patrones repetitivos de herramientas: leer N archivos, extraer X de cada uno, transformar Y
- Cualquier flujo de trabajo donde la misma herramienta se llama más de 3 veces con diferentes entradas
- Procesamiento de datos por lotes donde la lógica es directa

### Cuándo no usar

- Herramientas con efectos secundarios (escribir, eliminar, enviar) — la ejecución de código de herramientas con efectos secundarios es impredecible
- Herramientas que dependen de la salida de una llamada de herramienta anterior cuando la dependencia no se conoce de antemano
- Flujos de trabajo interactivos donde se requiere revisión humana entre pasos

---

## Patrón 2: Filtrado dinámico para herramientas web

**Qué es:** antes de que los resultados de búsqueda web o obtención entren en la ventana de contexto, Claude escribe código de filtrado que extrae solo el contenido relevante. Las páginas web sin procesar pueden ser 50,000–200,000 tokens; los resultados filtrados son típicamente 1,000–5,000 tokens.

**Ahorros de token:** aproximadamente 24% menos tokens de entrada en tareas típicas de recuperación. La precisión en tareas aumentada por recuperación mejora 13–16 puntos de porcentaje porque el modelo responde de un extracto limpio y relevante en lugar de escanear un documento ruidoso completo.

### Configuración

Usa los nuevos tipos de herramientas con encabezado beta requerido:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=[
        {"type": "web_search_20260209", "name": "web_search"},
        {"type": "web_fetch_20260209", "name": "web_fetch"}
    ],
    messages=[{"role": "user", "content": "What is the current Stripe API version?"}],
    betas=["code-execution-web-tools-2026-02-09"]
)
```

### Cómo funciona el filtrado

Con el encabezado beta activo, se permite a Claude escribir código de filtrado antes de que el contenido web entre en el contexto del mensaje. Para una búsqueda de "Stripe API version":

1. Claude emite `web_search("Stripe API version changelog")`
2. Antes de que los resultados entren en contexto, Claude escribe: `[r for r in results if 'api-version' in r['url']]`
3. Solo los resultados coincidentes (3 de 10) entran en contexto
4. Para cada URL coincidente, Claude emite `web_fetch(url)` con un script de extracción: `soup.find('h1', class_='version').text`
5. Solo la cadena extraída entra en contexto — no el HTML completo

Sin filtrado dinámico, los 10 resultados de búsqueda y HTML completo de cada página obtenida entrarían en la ventana de contexto en cada turno.

### Cuándo usar

- Cualquier aplicación que usa búsqueda web u obtención para responder preguntas
- Agentes de investigación que obtienen múltiples fuentes
- Agentes de monitoreo que sondean URLs para datos específicos

### Cuándo no usar

- Cuando necesitas el contenido completo del documento (resumen, análisis de página completa)
- Cuando el criterio de filtrado no se conoce hasta después de ver el contenido

---

## Patrón 3: Carga diferida de herramientas (búsqueda de herramientas)

**Qué es:** las herramientas se ocultan del contexto de Claude hasta que se necesiten. Claude descubre herramientas disponibles llamando una meta-herramienta (`MCPSearch` o equivalente), luego carga y llama la herramienta específica que necesita.

**Ahorros de token:** aproximadamente 85% para catálogos de herramientas grandes. Un catálogo de 50 herramientas agrega aproximadamente 15,000–25,000 tokens a cada mensaje en la conversación. Con carga diferida, solo 1–3 esquemas de herramientas se cargan por turno.

### Configuración

```python
tools = [
    {
        "name": "database_query",
        "description": "Query the production database",
        "input_schema": { ... },
        "defer_loading": True   # oculta esta herramienta hasta que se solicite
    },
    # ... 49 herramientas más con defer_loading: True
]

# Establece el número de herramientas auto-cargadas desde resultados de búsqueda
import os
os.environ["ENABLE_TOOL_SEARCH"] = "auto:3"  # auto-carga top 3 coincidencias
```

Con `ENABLE_TOOL_SEARCH=auto:3`, Claude recibe una meta-herramienta `tool_search`. Cuando necesita una capacidad, busca:

```json
{"type": "tool_use", "name": "tool_search", "input": {"query": "query database"}}
```

El arnés devuelve los 3 esquemas de herramientas coincidentes superiores. Claude luego llama la herramienta directamente.

### Cuándo usar

- 10 o más herramientas cargadas simultáneamente
- Servidores MCP con catálogos amplios donde solo 2–3 herramientas son relevantes por consulta
- Agentes con herramientas específicas del dominio usadas solo en situaciones específicas

### Cuándo no usar

- Herramientas que se usan en casi todos los turnos (búsqueda de archivos, lectura) — la sobrecarga de búsqueda excede el costo de carga
- Catálogos de herramientas pequeños (menos de 10 herramientas) donde el costo de token es manejable
- Aplicaciones sensibles a latencia donde el viaje redondo adicional de búsqueda de herramientas es inaceptable

---

## Patrón 4: Ejemplos de uso de herramientas

**Qué es:** ejemplos de uso concretos agregados directamente a la definición de herramienta, más allá del esquema JSON. El esquema describe estructura; los ejemplos demuestran intención.

**Mejora de precisión:** 72% → 90% en combinaciones de parámetros complejas en evaluaciones internas. La brecha es mayor para herramientas con parámetros anidados, combinaciones de enum o interacciones de campo no obvias.

### Formato

Agrega una matriz `input_examples` a la definición de herramienta:

```python
{
    "name": "create_alert",
    "description": "Create a monitoring alert with conditions and notification channels",
    "input_schema": {
        "type": "object",
        "properties": {
            "metric": {"type": "string"},
            "condition": {
                "type": "object",
                "properties": {
                    "operator": {"type": "string", "enum": ["gt", "lt", "eq"]},
                    "threshold": {"type": "number"},
                    "window_minutes": {"type": "integer"}
                }
            },
            "channels": {
                "type": "array",
                "items": {"type": "string", "enum": ["slack", "pagerduty", "email"]}
            },
            "severity": {"type": "string", "enum": ["info", "warning", "critical"]}
        }
    },
    "input_examples": [
        {
            "description": "Page on high error rate",
            "input": {
                "metric": "http_error_rate",
                "condition": {"operator": "gt", "threshold": 0.05, "window_minutes": 5},
                "channels": ["pagerduty", "slack"],
                "severity": "critical"
            }
        },
        {
            "description": "Ticket on slow p99 latency",
            "input": {
                "metric": "api_latency_p99_ms",
                "condition": {"operator": "gt", "threshold": 2000, "window_minutes": 15},
                "channels": ["slack"],
                "severity": "warning"
            }
        }
    ]
}
```

### Cuándo usar

- Herramientas con parámetros anidados complejos
- Herramientas con múltiples campos enum donde combinaciones válidas no son obvias
- Herramientas donde la descripción por sí sola no es suficiente para entender uso correcto
- Cualquier herramienta que ha sido llamada incorrectamente en pruebas

### Cuándo no usar

- Herramientas simples con parámetros planos y auto-documentables
- Herramientas donde agregar ejemplos inflaría contexto sin mejorar precisión (verifica: ¿el modelo ya usa esta herramienta correctamente?)

---

## Combinación de los cuatro patrones

Para máxima eficiencia de token en una aplicación agente de producción:

```python
import anthropic
import os

os.environ["ENABLE_TOOL_SEARCH"] = "auto:3"

client = anthropic.Anthropic()

# Catálogo de herramientas — todos diferidos excepto la meta-herramienta
tools = [
    # Herramientas siempre cargadas (usadas cada turno)
    {"type": "web_search_20260209", "name": "web_search"},
    {"type": "web_fetch_20260209", "name": "web_fetch"},

    # Herramientas diferidas (cargadas bajo demanda vía tool_search)
    {
        "name": "query_database",
        "description": "Run a read-only SQL query against the analytics database",
        "input_schema": {
            "type": "object",
            "properties": {"sql": {"type": "string"}},
            "required": ["sql"]
        },
        "defer_loading": True,
        "allowed_callers": ["code_execution_20250825"],  # PTC habilitado
        "input_examples": [
            {
                "description": "Count users by plan",
                "input": {"sql": "SELECT plan, COUNT(*) FROM users GROUP BY plan"}
            }
        ]
    },
    # ... más herramientas diferidas
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools + [{"type": "code_execution_20250825"}],
    messages=[{"role": "user", "content": "..."}],
    betas=["code-execution-web-tools-2026-02-09"]
)
```

Esta configuración aplica:
- **PTC**: `query_database` puede ser llamada en lote por el ejecutor de código
- **Filtrado dinámico**: herramientas web filtran antes de que resultados entren en contexto
- **Carga diferida**: `query_database` solo se carga cuando se busca
- **Ejemplos de entrada**: el uso correcto de parámetros se demuestra en la definición de herramienta

Ahorros combinados en un flujo de trabajo analítico de 10 consultas: aproximadamente 60% menos tokens vs. uso estándar de herramientas con el mismo catálogo.

---

## Tabla de decisión

| Problema | Patrón |
|---------|---------|
| Misma herramienta llamada 3+ veces en un flujo de trabajo | PTC (Patrón 1) |
| Contenido web inflando la ventana de contexto | Filtrado dinámico (Patrón 2) |
| Catálogo de herramientas > 10 herramientas; la mayoría raramente necesaria | Carga diferida (Patrón 3) |
| Herramienta llamada incorrectamente; parámetros anidados complejos | Ejemplos de entrada (Patrón 4) |
| Precisión de recuperación baja | Filtrado dinámico (Patrón 2) + Ejemplos de entrada (Patrón 4) |
| Catálogo grande Y herramientas complejas | Carga diferida (3) + Ejemplos de entrada (4) |
| Alto costo de token en cada turno | Los cuatro combinados |

---
