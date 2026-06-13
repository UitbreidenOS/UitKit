# Uso Avanzado de Herramientas

## Cuándo activar
El usuario quiere optimizar patrones de uso de herramientas en aplicaciones de Claude API, reducir tokens de definiciones o gastos de llamadas de herramientas, mejorar la precisión en parámetros de herramientas complejos, o construir flujos de trabajo sofisticados con llamadas a herramientas.

## Cuándo NO usar
- Flujos de trabajo simples con una única herramienta donde la optimización de gastos generales es irrelevante
- Aplicaciones usando la Messages API estándar con menos de 5 herramientas y sin llamadas repetidas
- Depuración de una definición de herramienta rota — primero arregla la corrección, luego optimiza

## Instrucciones

### Patrón 1: Llamadas Programáticas de Herramientas (PTC)
Claude escribe código de orquestación Python en lugar de llamar a herramientas una por una. Reduce viajes redondos y tokens.

**Reducción de tokens: ~37% para flujos de trabajo multi-herramientas.**

Habilitar por herramienta:
```python
{
    "name": "read_file",
    "description": "Read a file",
    "input_schema": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]},
    "allowed_callers": ["code_execution_20250825"],
}
```

Cuando está habilitado, Claude puede elegir escribir un bucle Python llamando a esta herramienta N veces en lugar de hacer N bloques tool_use separados. Usar para: patrones repetidos de lectura/búsqueda, tuberías de transformación de datos, cualquier herramienta llamada >3 veces por turno.

No habilitar para herramientas con efectos secundarios (escribir, eliminar, desplegar) o herramientas que requieran autorización por llamada.

---

### Patrón 2: Filtrado Dinámico para Herramientas Web
Nuevos tipos de herramientas integrados para búsqueda web y búsqueda que filtran resultados antes de que entren en contexto.

**Encabezado beta requerido:** `anthropic-beta: code-execution-web-tools-2026-02-09`

**Reducción de tokens: ~24% menos tokens de entrada. Mejora de precisión: +13–16 puntos porcentuales.**

```python
import anthropic

client = anthropic.Anthropic(default_headers={"anthropic-beta": "code-execution-web-tools-2026-02-09"})

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=2048,
    tools=[
        {"type": "web_search_20260209", "name": "web_search"},
        {"type": "web_fetch_20260209", "name": "web_fetch"},
    ],
    messages=[{"role": "user", "content": "What is the current price of NVDA stock?"}],
)
```

Con estos tipos de herramientas, Claude escribe código de filtrado que extrae solo los datos relevantes de los resultados de búsqueda o páginas obtenidas antes de que el contenido entre en la ventana de contexto. Una página web completa que es 50,000 tokens se convierte en una extracción de 200 tokens.

---

### Patrón 3: Búsqueda de Herramientas / Carga Diferida
Para catálogos grandes de herramientas, diferir las herramientas que se usan poco frecuentemente para que no se carguen en contexto a menos que sea necesario.

**Reducción de tokens: ~85% para catálogos con muchas herramientas.**

Habilitar mediante variable de entorno:
```
ENABLE_TOOL_SEARCH=auto:N
```
Donde N es el umbral — herramientas más allá del top N más relevantes se difieren.

Marcar herramientas individuales como deferibles:
```python
{
    "name": "advanced_analytics",
    "description": "Run complex analytics queries",
    "input_schema": {...},
    "defer_loading": True,  # Only load when Claude needs this tool
}
```

Las herramientas diferidas se descubren a demanda por Claude a través de MCPSearch cuando determina que necesita una capacidad que no está en el contexto cargado actualmente. Usar para: catálogos grandes de herramientas MCP, APIs empresariales con cientos de puntos finales, sistemas de complementos donde la mayoría de las herramientas se usan raramente.

No diferir herramientas que se llaman en casi todas las conversaciones — el gasto de descubrimiento elimina los ahorros.

---

### Patrón 4: Ejemplos de Uso de Herramientas (`input_examples`)
Agregar ejemplos de llamadas concretas a las definiciones de herramientas más allá del esquema JSON.

**Mejora de precisión: ~72% → ~90% en parámetros complejos.**

```python
{
    "name": "query_database",
    "description": "Run a SQL query against the analytics database",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "SQL query to execute"},
            "timeout_seconds": {"type": "integer", "description": "Max execution time"},
            "read_only": {"type": "boolean", "description": "Enforce read-only mode"},
        },
        "required": ["query"],
    },
    "input_examples": [
        {
            "query": "SELECT user_id, count(*) as orders FROM orders WHERE created_at > NOW() - INTERVAL '7 days' GROUP BY user_id ORDER BY orders DESC LIMIT 10",
            "timeout_seconds": 30,
            "read_only": True,
        },
        {
            "query": "SELECT AVG(order_value) FROM orders WHERE status = 'completed'",
            "read_only": True,
        },
    ],
}
```

`input_examples` es más valioso para:
- Herramientas con combinaciones de parámetros no obvias
- Esquemas anidados complejos
- Parámetros donde el formato importa más que el tipo (cadenas SQL, regex, rutas JSON)
- Herramientas donde Claude consistentemente comete el mismo error de parámetro sin ejemplos

---

### Combinación de Patrones

Stack de máxima eficiencia para un catálogo grande de herramientas:

```python
tools = [
    # Frequently used tools — loaded always, PTC enabled, with examples
    {
        "name": "read_file",
        "allowed_callers": ["code_execution_20250825"],
        "input_examples": [{"path": "/src/api/users.ts"}],
        ...
    },
    # Infrequently used tools — deferred
    {
        "name": "run_migration",
        "defer_loading": True,
        ...
    },
    # Last frequent tool — cache everything up to here
    {
        "name": "list_files",
        "cache_control": {"type": "ephemeral"},
        ...
    },
]
```

Usar tipos de herramientas web cuando la búsqueda/obtención web esté en alcance:
```python
tools += [
    {"type": "web_search_20260209", "name": "web_search"},
    {"type": "web_fetch_20260209", "name": "web_fetch"},
]
```

## Ejemplo

Un agente con 120 herramientas (superficie completa de API de una plataforma SaaS):

Sin optimización: 120 definiciones de herramientas × ~150 tokens cada una = ~18,000 tokens por llamada, solo para definiciones de herramientas. La mayoría de herramientas nunca se llaman.

Con carga diferida (`ENABLE_TOOL_SEARCH=auto:10`): solo las 10 herramientas más probables se cargan. El costo de tokens para definiciones de herramientas cae de 18,000 a ~1,500 — reducción del 85%. Cuando Claude necesita una herramienta raramente usada, la busca y carga a demanda, agregando ~200 tokens solo para ese turno.

Agregar `input_examples` a las 10 herramientas siempre cargadas aumenta la precisión de parámetros del 72% al 90% en las herramientas que importan más.

---
