# Pensamiento Extendido / Modo de Razonamiento

Cómo usar las capacidades de cadena de pensamiento interno de Claude — cuándo habilitarlo, cómo controlar el presupuesto de tokens y cómo evitar pagar por tiempo de pensamiento que no necesitas.

---

## Qué es el pensamiento extendido

El pensamiento extendido le da a Claude un área de borrador que usa antes de producir una respuesta. El contenido de pensamiento es una cadena de pensamiento — Claude trabaja a través del problema paso a paso antes de comprometerse con una respuesta. Ves la salida de pensamiento en la respuesta (como un bloque de `thinking`), y la respuesta final refleja ese razonamiento.

Esto es estructuralmente diferente de la generación estándar. En modo estándar, Claude produce tokens de izquierda a derecha, y cada token se confirma a medida que se genera. En modo de pensamiento, Claude primero asigna un presupuesto de tokens internos para razonar a través del problema, luego sintetiza una respuesta final desde ese razonamiento. La respuesta final tiende a ser más precisa, más completa y menos propensa a tomar un paso inicial obvio que luego refuerza.

Las compensaciones clave:

| Propiedad | Modo estándar | Pensamiento extendido |
|---|---|---|
| Latencia | Baja (primer token rápido) | Más alta (pensamiento ejecutado primero) |
| Costo | Solo tokens de salida | Tokens de pensamiento + tokens de salida |
| Precisión en tareas complejas | Línea base | Significativamente mejor |
| Precisión en tareas simples | Línea base | Marginalmente mejor, raramente vale la pena |
| Coherencia de respuesta | Buena | Mejor en tareas de múltiples pasos |
| Transmisión | Inmediata | Los bloques de pensamiento se transmiten por separado |

El pensamiento extendido no es una mejora mágica — cambia costo y latencia por precisión en tareas que requieren razonamiento deliberado. Úsalo cuando la complejidad del razonamiento justifique el cambio.

---

## Compatibilidad de modelos

El pensamiento extendido está disponible en:

| Modelo | Soporte de pensamiento | Notas |
|---|---|---|
| Claude Opus 4.7 | Soporte completo | Razonamiento de más alta calidad; costo más alto |
| Claude Sonnet 4.6 | Soporte completo | Mejor relación costo/desempeño para la mayoría de tareas |
| Claude Haiku 3.5 | No soportado | Usar para tareas rápidas y de bajo costo sin pensamiento |
| Modelos anteriores | No soportado | Opus 4 e inferior no soportan `thinking` |

Para la mayoría de los casos de uso en producción, Sonnet 4.6 con pensamiento habilitado supera a Opus 4 con menor costo. Reserva Opus 4.7 con presupuesto de pensamiento máximo para los problemas más difíciles — diseño de arquitectura bajo restricciones complejas, verificación de pruebas, corrección algorítmica en casos extremos.

---

## Habilitación del pensamiento extendido

### Claude Code: comando `/effort`

En una sesión de Claude Code, el parámetro `/effort` controla el modo de pensamiento:

```
/effort low       # Modo estándar — sin pensamiento extendido
/effort medium    # Pensamiento ligero; adecuado para tareas moderadamente complejas
/effort high      # Pensamiento completo habilitado; ~16K presupuesto de tokens de pensamiento
/effort max       # Presupuesto de pensamiento máximo; usar para los problemas más difíciles
```

`/effort` está limitado por sesión. Configurarlo una vez se aplica a todos los turnos posteriores hasta que lo cambies o inicies una nueva sesión.

**Comportamiento en cada nivel:**

| Nivel | Pensamiento habilitado | Presupuesto de tokens aproximado | Caso de uso |
|---|---|---|---|
| `low` | No | 0 | Boilerplate, ediciones simples, búsquedas |
| `medium` | A veces | ~4,000 | Revisión de código, refactores moderados |
| `high` | Sí | ~16,000 | Lógica compleja, decisiones arquitectónicas |
| `max` | Sí | ~32,000+ | Problemas de grado de investigación, pruebas, diseño profundo |

En la práctica, `high` cubre la mayoría de tareas donde el pensamiento agrega valor. `max` es para problemas donde genuinamente necesitas que Claude explore múltiples estrategias de solución antes de comprometerse.

**Verificación del nivel de esfuerzo actual:**

```bash
# El nivel /effort actual se muestra en la barra de estado de la sesión.
# Para reestablecer el valor predeterminado (modo estándar):
/effort low
```

### API: parámetro `thinking`

Cuando llamas a la API directamente, pasa un bloque `thinking` en la solicitud:

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 16000,
  "thinking": {
    "type": "thinking",
    "budget_tokens": 10000
  },
  "messages": [
    {
      "role": "user",
      "content": "Design a distributed rate limiter that handles 1M RPS with sub-millisecond p99 latency. Consider Redis, token buckets, sliding windows, and gossip protocols. Justify every tradeoff."
    }
  ]
}
```

**Reglas para `budget_tokens`:**

- Mínimo: `1024` — cualquier cosa inferior es rechazada
- Rango típico: `8,000–16,000` para la mayoría de tareas complejas
- Rango de alta complejidad: `16,000–32,000`
- Límite máximo: depende del modelo; Opus 4.7 soporta hasta `32,000+`; consulta los documentos del modelo para los límites actuales
- `budget_tokens` debe ser menor que `max_tokens`

Claude puede usar menos tokens que el presupuesto. El presupuesto es un techo, no una garantía.

---

## La respuesta de la API: bloques de pensamiento

Cuando el pensamiento está habilitado, la respuesta contiene un bloque `thinking` antes del bloque de texto:

```json
{
  "id": "msg_01XFDUDYJgAACTu2zCjM9e64",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me work through the rate limiter design systematically. The core constraint is 1M RPS at sub-millisecond p99...\n\nOption 1: Redis with token bucket...\nPros: Simple, widely understood\nCons: Redis becomes a bottleneck at 1M RPS — single-threaded command execution, network RTT adds latency...\n\nOption 2: In-process sliding window with gossip sync...\n[Claude continues reasoning across options, then synthesises]\n\nConclusion: Hybrid approach — in-process counters with async gossip for cross-node coordination..."
    },
    {
      "type": "text",
      "text": "## Distributed Rate Limiter Design\n\nFor 1M RPS at sub-millisecond p99, Redis alone is insufficient as the primary counter store..."
    }
  ],
  "usage": {
    "input_tokens": 147,
    "output_tokens": 2341,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0
  }
}
```

El campo `thinking` es el contenido del área de borrador sin procesar. Es legible por humanos pero no la respuesta pulida — espera lenguaje exploratorio, callejones sin salida que Claude abandona, y conclusiones tentativas revisadas a mitad del pensamiento. El bloque final `text` es la respuesta real.

---

## Modelo de costo

Los tokens de pensamiento se facturan a la misma tasa que los tokens de salida. No están descuentos.

```
Costo total = (input_tokens × input_rate) + (thinking_tokens × output_rate) + (output_tokens × output_rate)
```

**Ejemplo a precios de Sonnet 4.6 (ilustrativo, verifica tasas actuales en anthropic.com):**

| Componente | Tokens | Tasa (por 1M) | Costo |
|---|---|---|---|
| Entrada | 500 | $3.00 | $0.0015 |
| Pensamiento | 8,000 | $15.00 | $0.12 |
| Salida | 800 | $15.00 | $0.012 |
| **Total** | | | **$0.1335** |

Sin pensamiento:

| Componente | Tokens | Tasa (por 1M) | Costo |
|---|---|---|---|
| Entrada | 500 | $3.00 | $0.0015 |
| Salida | 800 | $15.00 | $0.012 |
| **Total** | | | **$0.0135** |

El pensamiento extendido es aproximadamente 10 veces más caro en esta tarea de ejemplo. Ese multiplicador es el orden de magnitud correcto para uso típico. Cuando estás resolviendo un problema difícil una vez, ese costo es trivial. Cuando lo llamas en bucle sobre miles de entradas que no requieren razonamiento, es una regresión significativa.

**Los tokens de pensamiento no se benefician del almacenamiento en caché de indicaciones.** Los tokens de entrada antes del bloque de pensamiento pueden ser almacenados en caché, pero la salida del pensamiento en sí no. Estructura las solicitudes para que las indicaciones del sistema estable y el contexto se posicionen para beneficiarse del almacenamiento en caché antes del bloque `thinking`.

---

## Transmisión con pensamiento

Cuando transmites una respuesta habilitada para pensamiento, los bloques `thinking` y `text` se transmiten por separado. El bloque de pensamiento se completa antes de que comience el bloque de texto en la mayoría de los clientes.

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "thinking",
        "budget_tokens": 8000
    },
    messages=[{"role": "user", "content": "..."}]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if event.content_block.type == "thinking":
                print("[Thinking started]")
            elif event.content_block.type == "text":
                print("[Response started]")
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                # Raw thinking tokens streaming
                pass  # Suppress if you don't want to display it
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

En productos orientados al usuario, puedes ocultar completamente el bloque de pensamiento y transmitir solo el bloque `text`. La latencia del primer token de texto es mayor con pensamiento habilitado — calibra tus estados de carga UX en consecuencia.

---

## Modo estándar vs modo de pensamiento: misma indicación, diferentes salidas

**Indicación:** "Una función se ejecuta en O(n log n) caso promedio. Necesitas procesar 10M elementos en menos de 2 segundos en una máquina con 8 núcleos. ¿Es esto factible? ¿Cuáles son los modos de fallo?"

**Respuesta en modo estándar (abreviada):**

> O(n log n) en 10M elementos es aproximadamente 10M × 23 ≈ 230M operaciones. A 1 billón de operaciones/segundo por núcleo, eso es 0.23 segundos en un solo hilo. Con 8 núcleos estás bien dentro de 2 segundos. Modos de fallo principales: ancho de banda de memoria, fallos de caché y sobrecarga de sincronización de hilos.

Correcto a nivel superficial. Pierde varios modos de fallo significativos.

**Respuesta en modo de pensamiento (abreviada, desde bloque de pensamiento actual):**

*Pensamiento:* "Déjame ser cuidadoso aquí. O(n log n) caso promedio — ¿cuál es el peor caso? No se especifica. ¿Cuál es el factor constante? No se especifica. ¿Patrón de acceso a memoria? No se especifica. 'Función' — ¿es esto una ordenación basada en comparación? ¿Algoritmo de gráfico? El encuadre es ambiguo..."

*Respuesta:*

> La viabilidad depende de factores que la pregunta deja abiertos. Aquí hay lo que necesitas clavar antes de comprometerte con este diseño:
>
> **Las matemáticas a valor nominal:** 10M × log₂(10M) ≈ 230M operaciones. A IPC realista en hardware moderno (~2–4 ops/ciclo efectivos a 3GHz), tienes aproximadamente 6–12 billones de "espacios de operación" por segundo por núcleo. De un solo hilo, esto es trivialmente rápido. Pero este cálculo oculta los riesgos reales.
>
> **Modos de fallo que realmente te morderán:**
>
> 1. **Factor constante:** O(n log n) con un factor constante grande (p. ej., acceso a memoria desfavorable para caché) puede ser 10–100 veces más lento que el límite inferior teórico. Una ordenación con buena localidad de caché vence a un algoritmo teóricamente equivalente con seguimiento de punteros cada vez.
>
> 2. **Degeneración de peor caso:** Si el caso promedio es O(n log n) pero el peor caso es O(n²) (p. ej., quicksort ingenuo en entrada adversarial), los datos de producción finalmente lo alcanzarán.
>
> 3. **Sobrecarga de paralelización:** Dividir 10M elementos en 8 núcleos introduce sincronización en puntos de fusión. Para algoritmos donde el paso de fusión es O(n), puedes perder la mayoría de tu ganancia de paralelización.
>
> 4. **Techo de ancho de banda de memoria:** A 10M elementos × 8 bytes cada uno = 80MB. Eso encaja en L3 en la mayoría de chips de servidor, pero apenas. Si el conjunto de trabajo no encaja, el ancho de banda de memoria (no computación) se convierte en el cuello de botella, y el recuento de núcleos deja de ayudar.
>
> 5. **El presupuesto de 2 segundos es la métrica incorrecta:** latencia p99 o p999 es por lo que te despertarán. Si el promedio es 1.8 segundos pero p99 es 4.1 segundos, estás fuera de presupuesto cuando importa.

La respuesta en modo de pensamiento expone lo que la pregunta realmente preguntaba — no solo un cálculo, sino un análisis de viabilidad completo. Este es el patrón donde el pensamiento extendido se amortiza: problemas donde una respuesta superficial es técnicamente correcta pero operacionalmente inútil.

---

## Cuándo usar el pensamiento extendido

Usa pensamiento extendido cuando la tarea tiene una o más de estas propiedades:

**Cadenas de dependencia de múltiples pasos.** La corrección de cada paso depende de un paso anterior. Un error en el paso 2 se propaga y corrompe los pasos 3–10. La generación lineal es frágil aquí; el modo de pensamiento permite que Claude verifique pasos intermedios antes de comprometerse.

**Requisitos ambiguos o subespecificados.** Cuando la pregunta contiene supuestos ocultos o múltiples interpretaciones válidas, el modo de pensamiento permite que Claude enumere interpretaciones y elija deliberadamente en lugar de comprometerse con la primera lectura plausible.

**Corrección matemática o lógica.** Verificación de pruebas, análisis de corrección de algoritmos, límites de complejidad. Estos requieren verificar múltiples casos y restricciones de seguimiento — la generación lineal tiende a omitir casos extremos.

**Decisiones arquitectónicas con compensaciones no obvias.** Diseño de sistemas, opciones de modelo de datos, diseño de contrato de API. La respuesta correcta depende de restricciones que interactúan de formas no obvias. El modo de pensamiento hace el análisis de restricciones explícito.

**Depuración de interacciones complejas del sistema.** Cuando la causa raíz de un bug abarca múltiples sistemas y requiere razonamiento sobre tiempo, estado y efectos secundarios simultáneamente.

**Lógica sensible a la seguridad.** Flujos de autenticación, modelos de permiso, implementación de protocolo criptográfico. El costo de un error es alto; la latencia adicional y el costo del pensamiento son baratos en comparación.

---

## Cuándo NO usar el pensamiento extendido

El pensamiento extendido desperdicia dinero y agrega latencia sin beneficio de calidad en:

**CRUD simple y boilerplate.** Generación de un punto final REST, escritura de una clase de modelo, scaffolding de un componente. Estas tareas tienen una estructura única y obvia. El pensamiento no las mejora.

**Traducción y localización.** Convertir contenido a otro idioma. La tarea es mapeo token por token, no razonamiento. El modo de pensamiento en traducción está quemando presupuesto de tokens de salida sin ganancia.

**Búsquedas y resumen.** "¿Qué hace esta función?" o "Resume este archivo." La respuesta está en la entrada. No se requiere razonamiento.

**Bucles de alto volumen.** Si estás llamando a la API en un lote sobre miles de entradas similares, el modo de pensamiento multiplica tu costo por 5–15 veces. Reserva el pensamiento para la fase de planificación; usa modo estándar para la ejecución.

**Flujos interactivos sensibles al tiempo.** Autocompletación, sugerencias en línea, respuestas de chat donde el usuario espera una respuesta en menos de un segundo. La latencia de pensamiento se sentirá rota.

**Redacción iterativa.** Generación de primer borrador, lluvia de ideas, exploración especulativa. Quieres volumen y variedad, no rigor. Usa modo estándar e itera.

---

## Integración de Claude Code: `/effort` en la práctica

Cuando configuras `/effort high` o `/effort max` en una sesión de Claude Code, varios comportamientos cambian:

- **La planificación de llamadas de herramientas mejora.** Antes de emitir una secuencia de lecturas, ediciones y llamadas de bash, Claude razonará internamente a través del plan completo en lugar de comprometerse con la primera acción plausible. Esto reduce el backtracking a mitad de secuencia.

- **Las operaciones de múltiples archivos son más coherentes.** Cuando una tarea requiere cambios en varios archivos que deben permanecer consistentes, el modo de pensamiento ayuda a Claude a mantener todas las restricciones en el alcance simultáneamente.

- **La descomposición de tareas ambiguas mejora.** Si tu descripción de tarea no está completamente especificada, Claude es más probable que exponga la ambigüedad y pregunte, en lugar de adivinar y proceder incorrectamente.

- **La recuperación de errores es mejor.** Cuando una llamada de herramienta devuelve un resultado inesperado, el modo de pensamiento hace que Claude sea más probable que razone a través de lo que salió mal en lugar de reintentar la misma acción.

**Patrón de sesión recomendado:**

```
# Inicio de tarea compleja
/effort high

# ... trabaja a través del diseño/arquitectura compleja ...

# Cambiar cuando se mueve a implementación
/effort low

# ... genera el boilerplate, escribir las pruebas, etc. ...

# Cambiar nuevamente para cualquier depuración difícil o preocupaciones transversales
/effort high
```

No dejes `/effort high` para una sesión larga completa. Estás pagando tasas de tokens de pensamiento en cada turno, incluyendo turnos "ok, leer este archivo" y "ahora ejecutar las pruebas" que no ganan nada del razonamiento.

---

## Casos de uso del mundo real

### 1. Migración de esquema de base de datos bajo restricciones

**Indicación:**
```
We're migrating from a single-tenant Postgres schema (one DB per customer) to 
a multi-tenant schema (row-level isolation via tenant_id). We have 47 tables, 
several with cross-table foreign keys. We cannot afford downtime. We process 
8,000 write transactions/minute at peak. Design the migration strategy.
```

**Por qué el pensamiento ayuda:** La migración debe manejar restricciones de clave externa, ordenamiento de relleno, cambios de índice y cambio de corte de tiempo cero simultáneamente. Estas restricciones interactúan — un ordenamiento que satisface claves externas puede entrar en conflicto con desempeño de relleno. La generación lineal elige una restricción para resolver primero y luego ajusta los demás, a menudo produciendo un plan con un modo de fallo silencioso. El modo de pensamiento permite que Claude enumere las interacciones de restricciones antes de comprometerse con un plan.

---

### 2. Análisis de causa raíz de error del compilador

**Indicación:**
```
Our Rust binary compiles cleanly but segfaults at runtime only when compiled 
with --release and only on ARM64. The crash is in a hot loop that processes 
byte arrays. No unsafe code in our codebase. Here's the relevant assembly diff 
between debug and release: [...]
```

**Por qué el pensamiento ayuda:** La causa raíz implica la interacción de pasos de optimización LLVM, supuestos de alineación y comportamiento indefinido en código Rust seguro que se ve. Diagnosticar esto requiere sostener múltiples hipótesis simultáneamente y razonar sobre qué patrones de ensamblador corresponden a qué construcciones de nivel de origen. Este es un caso de uso clásico de modo de pensamiento.

---

### 3. Diseño de contrato de API para compatibilidad hacia atrás

**Indicación:**
```
We need to add pagination to an API endpoint that currently returns all results. 
Our API has 200+ external consumers. We cannot break existing integrations. 
The current response schema is: { "results": [...] }. Design the versioning 
and migration path.
```

**Por qué el pensamiento ayuda:** El diseño debe satisfacer nuevos consumidores (que necesitan paginación), consumidores antiguos (que esperan la matriz plana) y el período de transición (donde ambos existen). Estas restricciones sugieren diferentes enfoques que se excluyen mutuamente sin diseño cuidadoso. El modo de pensamiento mapea el espacio de restricciones antes de proponer una estructura.

---

### 4. Verificación de corrección de sistemas distribuidos

**Indicación:**
```
This is our leader election algorithm. Identify all conditions under which 
two nodes could simultaneously believe they are the leader. 
[algorithm pseudocode follows]
```

**Por qué el pensamiento ayuda:** Las violaciones de propiedad de seguridad en algoritmos distribuidos requieren verificar exhaustivamente todos los entrelazamientos de eventos concurrentes. La generación lineal verifica los casos obvios y se detiene. El modo de pensamiento es más probable que construya el análisis sistemático de casos que encuentra carreras sutiles.

---

### 5. Revisión del modelo de seguridad

**Indicación:**
```
Here is our permission model for a multi-tenant SaaS. Users belong to 
organisations. Organisations have roles. Resources belong to organisations. 
Users can share resources cross-organisation with explicit grants. 
Identify privilege escalation paths. [schema and permission check code follows]
```

**Por qué el pensamiento ayuda:** Las vulnerabilidades de escalada de privilegios viven en la intersección de múltiples reglas de permiso. Encontrarlas requiere mantener el modelo de permiso completo en mente mientras se razona sobre secuencias de operaciones que se ven válidas que se componen en un estado inválido. Este es exactamente el tipo de razonamiento de múltiples restricciones donde el modo de pensamiento mejora la precisión.

---

## Guía de tamaño de presupuesto de tokens

Elegir el valor correcto de `budget_tokens` no se trata de maximizar — se trata de coincider con la complejidad de la tarea.

| Complejidad de tarea | Presupuesto recomendado | Ejemplos |
|---|---|---|
| Moderada | 4,000–6,000 | Revisión de código, depuración de función única, preguntas de modelo de datos |
| Alta | 8,000–12,000 | Decisiones arquitectónicas, refactores de múltiples archivos, diseño de algoritmo |
| Muy alta | 16,000–24,000 | Diseño de sistema bajo restricciones duras, revisiones de seguridad |
| Máxima | 32,000+ | Corrección del compilador, verificación formal, análisis de prueba |

Comienza en 8,000 e incrementa solo si observas razonamiento truncado. Signos de que el presupuesto es demasiado pequeño:

- El bloque de pensamiento termina abruptamente a mitad del análisis
- La respuesta final pierde restricciones que eran visibles en la indicación
- La respuesta se cubre mucho donde una respuesta decisiva era posible

Signos de que el presupuesto es demasiado grande:

- El bloque de pensamiento es repetitivo — Claude explora la misma rama múltiples veces
- La respuesta final no mejora significativamente sobre lo que un presupuesto de 4,000 tokens produjo
- La latencia es alta pero la respuesta es una recomendación simple

---

## Lista de verificación del pensamiento extendido

Usa esto antes de habilitar el modo de pensamiento. Si se aplican menos de 3 elementos, usa modo estándar.

- [ ] La tarea tiene más de 2 dependencias secuenciales (el paso A debe ser correcto antes de que el paso B pueda proceder)
- [ ] La tarea contiene conflictos de restricción explícitos u ocultos que necesitan resolución
- [ ] Una respuesta incorrecta sería cara de encontrar y corregir (bug de producción, problema de seguridad, migración irreversible)
- [ ] La tarea implica una propiedad de corrección, no solo una preferencia de estilo o estructura
- [ ] Has estado decepcionado por una respuesta en modo estándar en una tarea similar antes
- [ ] La indicación es ambigua de una manera que requiere interpretación antes de responder
- [ ] La tarea requiere enumerar casos (todas las condiciones de error, todos los entrelazamientos, todos los casos extremos)
- [ ] La tarea abarca múltiples sistemas o archivos que deben permanecer mutuamente consistentes
- [ ] La tarea es una decisión única (no una operación de lote de alto volumen)
- [ ] Tienes tiempo para la latencia — esto no es una llamada síncrona orientada al usuario

---

## Errores comunes

**Configuración `/effort max` para una sesión completa.** El multiplicador de costo se aplica a cada turno, incluyendo los triviales. Usa elevación de esfuerzo dirigida para las partes difíciles, cae nuevamente a `low` para ejecución.

**Usar modo de pensamiento en tareas creativas.** El pensamiento extendido no mejora prosa, lluvia de ideas de diseño o generación de contenido. La mejora de calidad es específica para tareas que requieren corrección lógica.

**Ignorar el bloque de pensamiento en depuración.** Cuando el modo de pensamiento produce una respuesta incorrecta, lee el bloque de pensamiento primero. Generalmente revela exactamente dónde fue mal el razonamiento, que es el camino más directo para arreglar tu indicación.

**Tratar `budget_tokens` como un dial de calidad.** Duplicar el presupuesto no duplica confiablemente la calidad. Más allá de un techo apropiado para la tarea, presupuesto adicional produce razonamiento repetitivo sin conclusiones mejores. Comienza en 8,000 y valida antes de ir más alto.

**Habilitación de pensamiento en puntos finales de transmisión con presupuestos de latencia estrictos.** El modo de pensamiento retrasa el primer token de texto por la duración completa de la fase de pensamiento. Si tu interfaz muestra un indicador de escritura y los usuarios esperan una respuesta dentro de 1–2 segundos, esto se sentirá roto. Oculta la fase de pensamiento detrás de un estado de carga deliberado o desactiva el pensamiento en ese punto final.

---
