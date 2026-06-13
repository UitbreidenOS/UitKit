# Reducción de costo de tokens del 30-50%

Estrategias prácticas para reducir el gasto de tokens de Claude Code y Claude API, cada una con el mecanismo, pasos de implementación e estimación de ahorros realista. Sin consejo especulativo — cada estrategia aquí tiene un efecto mensurable.

---

## Línea base: hacia dónde van los tokens

Antes de optimizar, sabe en qué estás pagando. El gasto de tokens en una sesión típica de Claude Code se desglosa aproximadamente como:

| Fuente | Participación aproximada |
|---|---|
| Prompt del sistema + CLAUDE.md (cada turno) | 10–30% |
| Historial de conversación (crece por turno) | 20–40% |
| Contenido de archivo leído en contexto | 20–40% |
| Tokens de salida | 10–20% |

Las estrategias de mayor impacto se enfocan en las categorías más grandes primero.

---

## Estrategia 1: Almacenamiento en caché de prompts

**Mecanismo:** Marca contenido estático (prompt del sistema, CLAUDE.md, documentos de referencia grandes) como cacheable. Claude almacena estos por 5 minutos (efímero) o 1 hora (extendido). Los aciertos de caché cuestan 0.1× el precio de entrada normal.

**Ahorros:** 60–90% en tokens almacenados en caché para llamadas repetidas. En la práctica, 20–40% del costo de sesión total.

**Implementación (API):**

```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: largeSystemPrompt,
      cache_control: { type: 'ephemeral' }  // TTL de 5 minutos
    }
  ],
  messages: conversationHistory
})
```

**Colocación de punto de ruptura de caché:**
- Coloca puntos de ruptura al final de contenido que permanece estático entre turnos
- Prompt del sistema → cacheable siempre
- Contenido de CLAUDE.md inyectado como contexto → cacheable
- Contenidos de archivo que no cambiarán esta sesión → cacheable
- Historial de conversación → NO cachea (cambia cada turno)

**Caché extendido (1 hora TTL):** Usa `{ type: 'ephemeral', ttl: 3600 }` para documentos referenciados entre múltiples sesiones (bases de código grandes, especificaciones largas).

**Gotchas:**
- Bloque cacheable mínimo es 1024 tokens (Haiku) o 2048 tokens (Sonnet/Opus)
- El caché es por modelo — cambiar modelos invalida el caché
- El contenido debe ser byte-idéntico para golpear el caché — incluso un cambio de espacio en blanco falla

---

## Estrategia 2: Haiku para tareas mecánicas

**Mecanismo:** Haiku cuesta aproximadamente 60% menos que Sonnet por token. Las tareas que requieren transformación mecánica (traducción, clasificación, extracción, formato) producen calidad equivalente en Haiku sin degradación significativa.

**Ahorros:** 50–65% en tipos de tarea abajo vs. ejecutarlos en Sonnet.

**Usa Haiku para:**
- Traducciones (localización de lenguaje — ver tubería de traducción de Claudient)
- Clasificar una tarea o enrutar a especialista
- Extraer datos estructurados de texto (JSON de contenido no estructurado)
- Reformateo simple (markdown → HTML, JSON → CSV)
- Agentes watchdog (observar, no razonar)
- Generar datos de prueba o archivos de fixture

**Usa Sonnet para:**
- Generación y revisión de código
- Razonamiento arquitectónico
- Depuración de bugs no triviales
- Cualquier tarea que requiere criterio sobre compensaciones

**Usa Opus para:**
- Decisiones de alto riesgo que son costosas de deshacer
- Razonamiento complejo de múltiples pasos en bases de código grandes
- Investigación que requiere síntesis profunda

**Implementación en Claude Code:**

Establece modelo por agente en tu flujo de trabajo:
```
Spawna agente de traducción usando claude-haiku-4-5:
  Traduce el siguiente archivo al español...
```

O configura en `settings.json` para comandos de barra diagonal específicos por defecto a Haiku.

---

## Estrategia 3: API de lotes

**Mecanismo:** La API de lotes de Anthropic procesa solicitudes asincrónicamente con un descuento del 50%. Las solicitudes se completan dentro de 24 horas (usualmente mucho más rápido).

**Ahorros:** Descuento plano del 50% en trabajo elegible para lotes.

**Cuándo usar:**
- Traducción en lote de muchos archivos
- Ejecutar el mismo prompt en muchas entradas (analizar 100 PRs, resumir 50 tickets)
- Extracción de datos no sensible al tiempo
- Generar fixtures de prueba o datos de semilla a escala

**Cuándo NO usar:**
- Sesiones interactivas (necesitas una respuesta ahora)
- Tareas donde la salida de una solicitud alimenta la siguiente
- Solicitudes únicas — la sobrecarga de lotes no vale la pena bajo ~10 solicitudes

**Implementación:**
```python
batch = anthropic.messages.batches.create(
  requests=[
    {
      "custom_id": f"translate-{filename}",
      "params": {
        "model": "claude-haiku-4-5",
        "max_tokens": 4096,
        "messages": [{"role": "user", "content": file_content}]
      }
    }
    for filename, file_content in files_to_translate.items()
  ]
)
# sondea batch.id hasta completo, luego recupera resultados
```

---

## Estrategia 4: Llamada de herramienta programática (PTC)

**Mecanismo:** Cuando un agente hace múltiples llamadas de herramienta secuenciales, cada viaje redondo incluye el historial de conversación completo. PTC (también llamado tool streaming o parallel tool calling) agrupa múltiples llamadas de herramienta en un turno, reduciendo el número de viajes redondos que llevan historial.

**Ahorros:** Hasta 37% menos tokens de entrada para flujos de trabajo intensivos en herramientas.

**Cuándo aplica:**
- Agentes que leen 3+ archivos antes de hacer algo
- Tareas de investigación que consultan múltiples fuentes de datos
- Cualquier flujo de trabajo con estructura "recolectar luego actuar"

**Implementación:**
```typescript
// En lugar de: leer archivo A → obtener resultado → leer archivo B → obtener resultado → leer archivo C
// Usa: solicita las tres lecturas en un turno
const tools = [readFileTool, readFileTool, readFileTool]
// Claude devuelve los tres en una sola respuesta; los procesas juntos
```

En Claude Code, esto se maneja automáticamente cuando instruyes a Claude leer múltiples archivos simultáneamente en lugar de uno a la vez:
```
Lee todos los siguientes archivos antes de responder: [lista archivos]
```

---

## Estrategia 5: Carga diferida de herramientas

**Mecanismo:** En lugar de cargar todos los esquemas de herramientas al inicio de una sesión, carga solo los esquemas necesarios para la tarea actual. Los esquemas de herramientas consumen tokens de entrada en cada turno.

**Ahorros:** Reducción del 85% en sobrecarga de tokens de esquema de herramientas para catálogos de herramientas grandes.

**Aplica cuando:** Tienes 10+ herramientas MCP registradas o un catálogo de herramientas personalizado grande.

**Implementación con ToolSearch:**
```
No cargues todas las herramientas al inicio de sesión.
Carga solo [herramientas específicas] para esta tarea.
Cuando la tarea cambie, carga [conjunto de herramientas diferente].
```

En la configuración MCP, evita registrar cada servidor globalmente — usa configuraciones MCP a nivel de proyecto para que solo herramientas relevantes estén activas por proyecto.

---

## Estrategia 6: Control de longitud de salida

**Mecanismo:** Los tokens de salida cuestan igual que tokens de entrada (o más en algunos modelos). Las respuestas verbosas desperdician dinero y ralentizan sesiones.

**Ahorros:** 15–30% en sesiones con mucha salida.

**Instrucciones de CLAUDE.md a agregar:**
```
Cuando me respondes:
- Dame la respuesta, no el razonamiento, a menos que pida razonamiento
- Sin preámbulo ("Seguro, te ayudaré con eso...")
- Sin resumen al final repitiendo lo que recién se hizo
- Bloques de código: sin prosa antes o después a menos que la prosa agregue información
- Listas: usa cuando hay 3+ elementos; prosa para 1-2
- Una oración es mejor que un párrafo cuando ambas comunican la misma información
```

**Control a nivel de API:**
```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,  // establece límite superior apropiado a la tarea
  system: "Sé conciso. Responde directamente. Sin preámbulo.",
  messages: [...]
})
```

---

## Estrategia 7: Poda de contexto

**Mecanismo:** El historial de conversación crece con cada turno. Después de una sesión larga, el historial puede dominar el recuento de tokens de entrada.

**Tácticas:**

`/compact` con una pista (Claude Code incorporado):
```
/compact Enfócate en los cambios de autenticación que hicimos — descarta todo sobre la discusión de UI
```

Aislamiento de subagente — spawna un subagente para una sub-tarea para que comience con una ventana de contexto fresca:
```
El agente padre pasa solo un resumen de un párrafo de la sesión al subagente,
no el historial completo. El subagente hace su trabajo y devuelve resultados al padre.
```

Descartes de contexto explícitos:
```
Olvida el análisis de archivo que hicimos en orders.ts — ya no es relevante. 
Procediendo enfoque solo en el módulo de pagos.
```

---

## Estrategia 8: Impacto de tamaño de CLAUDE.md

**Mecanismo:** CLAUDE.md se carga al inicio de cada sesión de Claude Code. Cada línea que agregues cuesta tokens en cada inicio de sesión, para cada usuario.

**Ahorros:** Varía con tamaño de archivo. Un CLAUDE.md de 300 líneas recortado a 150 líneas ahorra ~150 tokens × sesiones por mes.

**Objetivo:** Mantén CLAUDE.md bajo 2000 tokens (aproximadamente 150–180 líneas de prosa densa o 250 líneas de contenido mixto).

**Usa el prompt de auditor de contexto** (`prompts/task-specific/context-auditor.md`) para recortar tu CLAUDE.md sin perder orientación única.

**Reglas para economía de CLAUDE.md:**
- Una instrucción por línea donde sea posible
- Sin explicaciones de por qué existe una convención (solo la convención)
- Sin instrucciones que Claude sigue de forma predeterminada (sin "escribe código limpio")
- Usa enlaces a documentos externos en lugar de incrustarlos

---

## Referencia de calculadora de costo

Costos aproximados a precios de mayo de 2026. Verifica la página de precios de Anthropic para tarifas actuales.

| Modelo | Entrada ($/MTok) | Salida ($/MTok) | Golpe de caché ($/MTok) |
|---|---|---|---|
| Haiku 4.5 | ~$0.80 | ~$4.00 | ~$0.08 |
| Sonnet 4.6 | ~$3.00 | ~$15.00 | ~$0.30 |
| Opus 4.7 | ~$15.00 | ~$75.00 | ~$1.50 |

**Cálculo de costo de sesión de ejemplo:**

10 turnos, 5k tokens de entrada por turno (incluyendo 2k prompt del sistema almacenado en caché), 500 tokens de salida por turno, Sonnet:

- Sin almacenamiento en caché: 10 × 5000 × $0.000003 + 10 × 500 × $0.000015 = $0.15 + $0.075 = **$0.225**
- Con almacenamiento en caché (2k tokens almacenados en caché): 10 × 3000 × $0.000003 + 10 × 2000 × $0.0000003 + 10 × 500 × $0.000015 = $0.09 + $0.006 + $0.075 = **$0.171** — ahorro del 24%

**Impacto de estrategia combinada:**

| Estrategia | Ahorros | Complejidad |
|---|---|---|
| Almacenamiento en caché de prompts | 20–40% | Bajo |
| Haiku para tareas mecánicas | 50–65% en tareas elegibles | Bajo |
| API de lotes | 50% plano | Medio |
| PTC / llamadas de herramienta paralela | Hasta 37% en sesiones intensivas en herramientas | Bajo |
| Carga diferida de herramientas | Hasta 85% en sobrecarga de esquema | Medio |
| Control de longitud de salida | 15–30% | Bajo |
| Poda de contexto | 10–25% en sesiones largas | Bajo |
| Recorte de CLAUDE.md | 5–15% | Una sola vez |

Aplicar todas las estrategias de baja complejidad juntas típicamente logra 30–50% reducción de costo total sin cambiar la calidad de resultados.

---
