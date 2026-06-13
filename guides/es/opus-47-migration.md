# Migración a Claude Opus 4.7

Claude Opus 4.7 introduce cambios incompatibles en la API de Mensajes junto con nuevas capacidades. Tres parámetros que anteriormente aceptaban valores no predeterminados ahora devuelven HTTP 400. Antes de actualizar su ID de modelo a `claude-opus-4-7`, audite su código existente para estos patrones.

---

## Cambios Incompatibles

### 1. Presupuesto de pensamiento extendido eliminado

Opus 4.7 ya no acepta `budget_tokens` en la configuración de pensamiento. El modelo gestiona su propio presupuesto de pensamiento de forma adaptativa.

**Antiguo (devuelve 400 en Opus 4.7) :**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 8000},
    messages=[{"role": "user", "content": "..."}]
)
```

**Nuevo :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}]
)
```

`effort` acepta `"low"`, `"medium"` o `"high"`. Use `"high"` para tareas complejas de razonamiento donde anteriormente establecía un gran `budget_tokens`. El modelo decide cuánto pensar — la sugerencia `effort` influye en esa decisión.

---

### 2. Parámetros de muestreo eliminados

`temperature`, `top_p` y `top_k` deben omitirse o dejarse en sus valores predeterminados. Pasar valores no predeterminados devuelve HTTP 400.

**Antiguo (devuelve 400 en Opus 4.7) :**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    temperature=0.7,
    top_p=0.9,
    messages=[{"role": "user", "content": "..."}]
)
```

**Nuevo — elimine los parámetros completamente :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}]
)
```

No hay solución alternativa para esto. Opus 4.7 no expone controles de muestreo. Si su caso de uso requiere control explícito de temperatura, quédese con Opus 4.6 o use un modelo diferente de la familia 4.7.

---

### 3. Contenido de pensamiento omitido por defecto

Los bloques de pensamiento aún se ejecutan y se transmiten, pero el campo `thinking` en la respuesta está vacío por defecto. Este es un cambio del comportamiento de Opus 4.6.

**Para ver resúmenes de pensamiento :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    messages=[{"role": "user", "content": "..."}]
)

for block in response.content:
    if block.type == "thinking":
        print("Thinking summary:", block.thinking)
    elif block.type == "text":
        print("Response:", block.text)
```

`"display": "full"` devuelve la salida de pensamiento completa. `"display": "summarized"` devuelve una versión condensada. `"display": "none"` (el predeterminado) la omite. Use `"summarized"` para depuración; use `"none"` en producción para reducir el tamaño de la respuesta.

---

## Nuevas Capacidades

### Pensamiento Adaptativo

El único modo de pensamiento admitido en Opus 4.7. Desactivado por defecto — actívelo para tareas que se benefician del razonamiento extendido:

```python
# Activar — dejar que el modelo decida cuánto pensar
thinking={"type": "adaptive"}

# Activar con sugerencia de esfuerzo
thinking={"type": "adaptive"}
output_config={"effort": "high"}

# Desactivado (predeterminado)
# Omita completamente el parámetro thinking
```

El pensamiento adaptativo se activa automáticamente en problemas complejos de múltiples pasos cuando está habilitado. En solicitudes sencillas, puede usar poco o ningún pensamiento extendido incluso con `effort: "high"` — el modelo se calibra a la tarea.

---

### Presupuestos de Tareas (beta)

Un presupuesto de fichas consultivo entre bucles. El modelo lo usa como una guía — no es una tapa dura, pero el modelo intentará completar la tarea dentro del presupuesto.

**Encabezado beta requerido :** `task-budgets-2026-03-13`

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=32000,
    output_config={
        "task_budget": {
            "type": "tokens",
            "total": 128000
        }
    },
    extra_headers={"anthropic-beta": "task-budgets-2026-03-13"},
    messages=[{"role": "user", "content": "..."}]
)
```

**Mínimo :** 20.000 fichas. Los presupuestos por debajo de 20k se rechazaron. El presupuesto es consultivo — si la tarea realmente requiere más fichas, el modelo puede excederlo en lugar de producir una respuesta incompleta.

Use presupuestos de tareas al orquestar agentes de múltiples pasos donde el consumo descontrolado de fichas es una preocupación. No los use como mecanismo de control de facturación — son una sugerencia conductual, no un límite de aplicación.

---

### Soporte de Imágenes de Alta Resolución

Opus 4.7 acepta imágenes de hasta 2.576 px en el lado más largo, con un máximo de 3,75 megapíxeles. Esto es un aumento de 1.568 px / 1,15 MP en modelos anteriores.

```python
# Las tareas de uso informático se benefician de la resolución más alta
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": screenshot_b64
                }
            },
            {"type": "text", "text": "Click the 'Submit' button."}
        ]
    }]
)
```

El nuevo límite de tamaño permite coordenadas de píxeles 1:1 para tareas de uso informático — puede hacer referencia a posiciones exactas de la pantalla sin matemáticas de escala.

Si está pasando imágenes más grandes que 2.576 px, serán redimensionadas del lado del servidor. Redimensiónelas previamente en el cliente para evitar la sobrecarga.

---

### Nuevo Codificador de Fichas

Opus 4.7 usa un nuevo codificador de fichas que produce 1x–1,35x más fichas que Opus 4.6 para contenido equivalente. El mismo texto de entrada cuesta más fichas y la misma salida cuesta más fichas.

**Impacto en `max_tokens` :** Si su código existente establece `max_tokens` basándose en la longitud de salida esperada, aumente en 35% como punto de partida. Las respuestas que anteriormente cabían en 4.000 fichas pueden requerir ahora hasta 5.400.

```python
# Antiguo — puede truncar en 4.7 si la salida consume muchas fichas
max_tokens=4096

# Nuevo — añada ~35% de margen
max_tokens=5600
```

Ejecute su suite de evaluación en una muestra de indicaciones reales y compare los números de fichas de salida antes de actualizar todos sus valores `max_tokens`.

---

## Cambios de Comportamiento (No Incompatibles)

Estos no son errores de API, pero afectarán la calidad de salida si sus solicitudes dependían del comportamiento anterior.

**Seguimiento de instrucciones más literal.** Opus 4.7 interpreta las solicitudes más precisamente. Las instrucciones vagas que funcionaban anteriormente pueden producir resultados inesperados. Sea explícito: en lugar de "limpiar este código", escriba "elimine variables no utilizadas y agregue anotaciones de tipo a todas las firmas de función".

**Menos llamadas de herramientas y sumagentes por defecto.** El modelo es más conservador acerca de generar sumagentes y llamar herramientas. Si su flujo de trabajo depende de que el modelo use herramientas automáticamente, es posible que deba instruirlo explícitamente para hacerlo.

**La longitud de respuesta se calibra a la complejidad de la tarea.** Las preguntas cortas reciben respuestas cortas. Si requiere una respuesta detallada a una pregunta simple, instruya al modelo a ser exhaustivo en lugar de asumir que lo será.

---

## Lista de Verificación de Migración

- [ ] Elimine `budget_tokens` de todas las configuraciones `thinking` — reemplace con `thinking: {type: "adaptive"}`
- [ ] Elimine `temperature`, `top_p`, `top_k` si se establecen en valores no predeterminados
- [ ] Agregue `"display": "summarized"` a la configuración de pensamiento si lee bloques de pensamiento en su aplicación
- [ ] Aumente `max_tokens` en ~35% para tener en cuenta el nuevo codificador de fichas
- [ ] Pruebe entradas de imagen: verifique que las dimensiones estén dentro de 2.576 px / 3,75 MP, actualice todos los cálculos de coordenadas
- [ ] Actualice cadenas de ID de modelo: `claude-opus-4-7`
- [ ] Revise solicitudes para instrucciones vagas — Opus 4.7 es más literal
- [ ] Verifique cualquier orquestación que dependa del uso automático de herramientas — puede necesitar instrucción explícita

---

## Usuarios de Claude Code

Claude Code gestiona la capa API para usted. No hay cambios incompatibles a nivel de API para manejar — actualice el modelo en su configuración y Claude Code se encarga del resto.

Lo que puede requerir ajuste es su estilo de solicitud. La interpretación más literal de Opus 4.7 y el uso más conservador de herramientas pueden afectar sesiones complejas de múltiples pasos. Si las sesiones de Claude Code se vuelven menos autónomas después de la actualización del modelo, agregue instrucciones explícitas a su CLAUDE.md: especifique qué herramientas deben usarse de manera proactiva, defina qué significa "exhaustivo" para su base de código, y elimine cualquier instrucción permanente ambigua que dependiera del modelo deduciendo intención.

---
