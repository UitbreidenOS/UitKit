---
description: Genera un arnés de prueba para evaluar un prompt o cadena de LLM contra un conjunto de datos
argument-hint: "[archivo de prompt o descripción de la tarea que se está evaluando]"
---
Estás construyendo un arnés de evaluación LLM para la tarea descrita en $ARGUMENTS.

Lee cualquier ruta de archivo proporcionada. Si se proporciona una descripción simple, infiere la tarea.

**Paso 1 — Identificar requisitos de evaluación**

Determina:
- Tipo de tarea: clasificación, extracción, generación, RAG, uso de herramientas, multi-turno u otro
- Qué se ve "correcto": coincidencia exacta, coincidencia semántica, puntuación de rúbrica, validación de esquema estructurado o participación humana en el proceso
- Modos de fallo que vale la pena capturar: alucinación, rechazo, violación de formato, latencia, desbordamiento de tokens

**Paso 2 — Diseñar el esquema del conjunto de datos de prueba**

Genera un esquema JSONL para casos de prueba. Cada registro debe incluir:
- `id`: cadena única
- `input`: el mensaje del usuario o contexto de prompt completo (incluye el prompt del sistema si es relevante)
- `expected`: verdad fundamental o rúbrica (adapta la forma al tipo de tarea)
- `tags`: matriz de cadenas para filtrado (p. ej. `["edge-case", "language:fr"]`)

Muestra 3–5 registros de ejemplo representativos que cubran: camino feliz, caso límite, entrada adversarial.

**Paso 3 — Generar el script del arnés**

Escribe un script Python independiente utilizando el SDK de Anthropic (`anthropic` package). Requisitos:
- Cargar casos de prueba de `evals.jsonl`
- Llamar al modelo para cada caso (predeterminado: `claude-sonnet-4-6`, personalizable vía `--model`)
- Puntuar cada resultado usando el evaluador apropiado:
  - Coincidencia exacta/regex para salidas estructuradas
  - Similitud de coseno de incrustación para tareas semánticas (usa `sentence-transformers` si está disponible, si no, omite)
  - Puntuación de rúbrica de LLM-como-juez para generación abierta (independiente, usa `claude-haiku-4-5-20251001`)
- Generar un JSONL de resultados y una tabla de resumen en stdout
- Soportar la bandera `--sample N` para ejecutar en N casos aleatorios
- Usar `asyncio` + `AsyncAnthropic` para ejecución paralela con un límite de concurrencia configurable

**Paso 4 — Fragmento de integración CI**

Muestra un paso de GitHub Actions que:
- Ejecute el arnés en cada PR
- Falle la comprobación si la tasa de aprobación cae por debajo de un umbral configurable (predeterminado 90%)
- Publique un comentario de resumen con desgloses por etiqueta

**Formato de salida:**
1. Esquema de conjunto de datos + registros de ejemplo (JSONL)
2. Arnés Python completo (`eval_harness.py`)
3. Fragmento YAML de GitHub Actions
4. Bloque de uso `README` de una sola línea

Sin comentarios de marcador de posición. Cada función debe ser implementada.
