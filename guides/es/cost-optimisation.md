# Guía de optimización de costos

Estrategias prácticas para reducir los costos de la API de Claude y Claude Code sin sacrificar calidad.

## Comprender qué impulsa los costos

La tarificación de Claude se basa en **tokens** (entrada + salida). Costo = tokens × precio por token.

**Lo que aumenta el costo:**
- Prompts de sistema largos repetidos en cada llamada
- Contenidos de archivos grandes pasados como contexto
- Historiales de conversación largos
- Respuestas verbosas de múltiples párrafos
- Llamadas de herramientas repetidas que relees los mismos archivos
- Usar Opus cuando Sonnet sería suficiente

**Precios del modelo Claude (aproximado, mayo 2026):**
| Modelo | Entrada | Salida | Mejor para |
|---|---|---|---|
| Haiku 4.5 | más barato | más barato | Tareas simples, volumen alto |
| Sonnet 4.6 | medio | medio | La mayoría del trabajo — opción predeterminada |
| Opus 4.7 | más caro | más caro | Razonamiento complejo, tareas críticas |

**Regla de oro:** Use el modelo más barato que produzca calidad aceptable para su tarea.

## Almacenamiento en caché de prompts

Claude API admite almacenamiento en caché de prompts — almacene en caché su prompt del sistema y contexto estático para no pagar el precio completo en cada llamada.

```typescript
// Sin almacenamiento en caché: precio de entrada completo en cada llamada
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: longSystemPrompt,  // cobrado cada vez
  messages: [{ role: 'user', content: query }],
})

// Con almacenamiento en caché: prompt del sistema en caché después de la primera llamada (90% descuento en tokens en caché)
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: longSystemPrompt,
      cache_control: { type: 'ephemeral' }  // almacena en caché esto por hasta 5 minutos
    }
  ],
  messages: [{ role: 'user', content: query }],
})
```

**Cuándo usar almacenamiento en caché:**
- El mismo prompt del sistema se utiliza para múltiples solicitudes (chatbot, conversaciones multiturno)
- Documento grande que múltiples consultas hacen referencia
- Definiciones de herramientas que no cambian entre llamadas

**Ahorros:** 90% descuento en tokens de entrada en caché. TTL de 5 minutos (caché efímero).

## Tamaño de modelo adecuado

La mayoría del trabajo no necesita Opus. Una guía práctica:

| Tarea | Modelo recomendado |
|---|---|
| Traducciones | Haiku |
| Resumen | Haiku o Sonnet |
| Clasificación | Haiku |
| Generación de código (simple) | Sonnet |
| Revisión de código | Sonnet |
| Decisiones arquitectónicas | Sonnet u Opus |
| Razonamiento complejo | Opus |
| Depuración de problemas difíciles | Opus |
| Análisis de seguridad | Opus |

**Patrón de enrutamiento (usar en apps de IA en producción):**
```typescript
function selectModel(task: string, complexity: 'low' | 'medium' | 'high') {
  if (complexity === 'low') return 'claude-haiku-4-5-20251001'
  if (complexity === 'medium') return 'claude-sonnet-4-6'
  return 'claude-opus-4-7'
}
```

## Reducir contexto por llamada

**Recuperación fragmentada en lugar de documento completo:**
```typescript
// CARO: pasar documento completo en cada llamada
const response = await claude.generate({ context: fullDocument, query })

// MÁS BARATO: recuperar solo fragmentos relevantes (patrón RAG)
const relevantChunks = await vectorSearch(query, { topK: 5 })
const response = await claude.generate({ context: relevantChunks.join('\n'), query })
```

**Solicitar respuestas más cortas:**
```typescript
// Agregar al prompt del sistema:
"Sea conciso. Responda en 2-3 oraciones a menos que se solicite explícitamente más detalle."

// O establezca max_tokens:
max_tokens: 256  // limitar la longitud de respuesta para consultas simples
```

**Evite releer archivos sin cambios:**
En sesiones de Claude Code, no pida a Claude que relea un archivo que ya está en contexto. El contenido del archivo ya está ahí — releerlo duplica el costo de ese contexto.

## Procesamiento por lotes

Para tareas masivas (traducir 100 documentos, generar 500 descripciones), use la API de Batch:
```typescript
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()

// Crear un lote en lugar de 500 llamadas individuales
const batch = await client.beta.messages.batches.create({
  requests: documents.map((doc, i) => ({
    custom_id: `doc-${i}`,
    params: {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: `Translate: ${doc.text}` }],
    },
  })),
})

// Recuperar resultados
const results = await client.beta.messages.batches.retrieve(batch.id)
```

**Ahorros:** 50% descuento en precios de API de lotes vs. API en tiempo real.

## Costo de sesión de Claude Code

Claude Code factura por sesión. Reducir costo de sesión:

1. **Usar `/lean-claude`** — activa modo eficiente en tokens, respuestas más cortas
2. **Usar `/compact`** — comprime historial de conversación cuando se alarga
3. **Precargar contexto vía CLAUDE.md** — lectura única vs. exploración repetida
4. **Sesiones enfocadas** — una tarea por sesión, menos contexto irrelevante
5. **Selección de modelo** — Claude Code usa Sonnet por defecto; cambiar a Haiku para tareas simples con `/model haiku`

## Monitoreo de costos

```typescript
// Rastrear gastos en producción
const response = await claude.messages.create({ ... })

const cost = calculateCost(
  response.usage.input_tokens,
  response.usage.output_tokens,
  model
)

// Alerta si una única llamada excede presupuesto
if (cost > COST_ALERT_THRESHOLD) {
  logger.warn('high_cost_llm_call', { cost, tokens: response.usage })
}

// Seguimiento del presupuesto diario
await redis.incrbyfloat(`daily_llm_cost:${today}`, cost)
const dailyTotal = await redis.get(`daily_llm_cost:${today}`)
if (Number(dailyTotal) > DAILY_BUDGET) {
  alertOncall('Daily LLM budget exceeded')
}
```

## Puntos de referencia de costo típicos

| Caso de uso | Costo típico/solicitud | Potencial de optimización |
|---|---|---|
| Respuesta de chatbot simple | $0.001-0.01 | Alto (almacenar prompt del sistema en caché, usar Haiku) |
| Generación de código | $0.01-0.05 | Medio (tamaño de modelo apropiado) |
| Análisis de documentos | $0.05-0.50 | Alto (recuperación de fragmentos, documento en caché) |
| Razonamiento complejo | $0.10-1.00 | Bajo (Opus puede ser requerido) |
| Traducción por lotes | $0.0005/doc | Muy alto (API de lotes + Haiku) |

---
