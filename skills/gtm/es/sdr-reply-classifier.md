---
name: sdr-reply-classifier
description: "Clasificación del buzón de SDR: clasifica la intención de respuesta (interesado, ahora no, objeción, referido, fuera de oficina), genera respuestas contextuales, actualiza el CRM y notifica a Slack — cadencia de respuesta en menos de 5 minutos"
---

# Habilidad de Clasificación de Respuestas para SDR

## Cuándo activar
- Recibes respuestas de email de una secuencia de contacto en frío
- Necesitas clasificar un buzón completo y generar borradores de respuesta rápidamente
- Quieres construir un pipeline automatizado de manejo de respuestas (n8n / Make / Zapier)
- El objetivo es una cadencia de respuesta en menos de 5 minutos (tasa de reserva 3x mayor que la manual de 30 minutos)
- Quieres enrutar respuestas a la acción correcta sin leer cada email manualmente

## Cuándo NO usar
- Leads de marketing entrantes — intención diferente, usa un flujo de enrutamiento inbound dedicado
- Respuestas de soporte al cliente — no es función SDR
- Emails internos — scope solo para secuencias outbound
- Boletines o correo masivo — no son respuestas a contacto

## Instrucciones

### Esquema de clasificación de intención

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const ReplyIntent = z.enum([
  'interested',          // Positivo — quiere saber más / agendar una llamada
  'not_now',             // Futuro positivo — momento incorrecto, intentar en X meses
  'not_interested',      // No definitivo — detener la secuencia inmediatamente
  'objection_price',     // Preocupación de precio — necesita encuadre de ROI
  'objection_competitor', // Usa un competidor — necesita diferenciación
  'objection_timing',    // Congelación de presupuesto/headcount, pausa de contratación
  'objection_not_relevant', // Producto no relevante para su rol/empresa
  'question',            // Quiere más información antes de decidir
  'referral',            // Redirige a un mejor contacto internamente
  'meeting_reschedule',  // Ya agendado, necesita cambiar la hora
  'ooo',                 // Respuesta automática de fuera de oficina — extraer fecha de regreso
  'spam_filter',         // La respuesta es un rebote o aviso de entregabilidad
  'unknown',             // No se puede clasificar — enrutar a revisión humana
])

async function classifyReply(replyBody: string, originalEmail: string, prospectContext: string) {
  const { object } = await generateObject({
    model: anthropic('claude-sonnet-4-6'),
    schema: z.object({
      intent: ReplyIntent,
      confidence: z.number().min(0).max(1),
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      keySignals: z.array(z.string()).max(3),
      urgency: z.enum(['immediate', 'this_week', 'this_month', 'low']),
      extractedData: z.object({
        returnDate: z.string().optional(),      // for OOO replies
        referredContact: z.string().optional(), // for referral replies
        objectionText: z.string().optional(),   // verbatim objection
        requestedInfo: z.string().optional(),   // what info they asked for
      }),
      recommendedAction: z.enum([
        'book_meeting', 'send_resources', 'add_to_nurture',
        'mark_opted_out', 'follow_up_in_X_days', 'route_to_human',
        'update_contact_info', 'stop_sequence',
      ]),
      followUpDays: z.number().optional(),
    }),
    prompt: `Classify this email reply from a cold outreach sequence.

ORIGINAL OUTREACH:
${originalEmail}

PROSPECT CONTEXT:
${prospectContext}

REPLY:
${replyBody}

Classify the intent precisely. Extract any key data (return dates, referral names, specific objections).
Recommend the most appropriate next action.`,
  })

  return object
}
```

### Generación de respuestas por intención

```typescript
async function generateResponse(
  intent: z.infer<typeof ReplyIntent>,
  prospect: ProspectContext,
  reply: string,
  senderContext: SenderContext
): Promise<string | null> {

  // These intents get an immediate response
  const RESPOND_IMMEDIATELY = ['interested', 'question', 'objection_price',
    'objection_competitor', 'objection_timing', 'objection_not_relevant', 'referral']

  if (!RESPOND_IMMEDIATELY.includes(intent)) return null

  const prompts: Record<string, string> = {
    interested: `
      Write a reply to ${prospect.name}'s positive response.
      They seem interested. Next step: book a 15-minute discovery call.
      Their company: ${prospect.company}. Their role: ${prospect.title}.
      
      Rules:
      - Acknowledge their interest warmly but concisely (1 sentence)
      - Propose a specific day/time (or use Calendly link: ${senderContext.calendlyUrl})
      - Offer an alternative if that doesn't work
      - 4-5 sentences total, conversational
      - Don't oversell — they said yes, just confirm the meeting
    `,

    objection_price: `
      Write a reply to a price objection from ${prospect.name} at ${prospect.company}.
      Their objection: "${reply}"
      
      Rules:
      - Acknowledge the concern without being defensive
      - Reframe with ROI: time saved, revenue impact, or risk avoided
      - If possible, suggest a lower-commitment entry point (pilot, trial, smaller scope)
      - Offer to walk through the ROI calculation on a call
      - 4-6 sentences, confident not pushy
      - Don't apologise for pricing
    `,

    objection_competitor: `
      Write a reply to a competitor objection from ${prospect.name}.
      Their message: "${reply}"
      
      Rules:
      - Acknowledge they have a solution (don't dismiss it)
      - Ask 1 open question about what they're getting vs. what they're missing
      - Don't badmouth the competitor by name
      - Position as "different" not "better"
      - Offer to share a comparison or case study
      - 4-5 sentences
    `,

    question: `
      Write a reply to ${prospect.name}'s question.
      Their question: "${reply}"
      
      Rules:
      - Answer the question directly and concisely
      - Don't dump all product info — answer what they asked
      - End with a soft next step (call, demo, resource)
      - 4-6 sentences
    `,

    referral: `
      Write a reply thanking ${prospect.name} for the referral and asking for an intro.
      Their message: "${reply}"
      
      Rules:
      - Thank them briefly (1 sentence)
      - Ask if they can make a warm intro (easier for referred contact to respond)
      - Offer to draft the intro email if helpful
      - 3-4 sentences
    `,
  }

  const { text } = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    prompt: prompts[intent],
  })

  return text
}
```

### Pipeline completo de clasificación

```typescript
async function triageInbox(replies: IncomingReply[]): Promise<TriageResult[]> {
  const results: TriageResult[] = []

  for (const reply of replies) {
    console.log(`\nTriaging reply from ${reply.from}...`)

    // 1. Classify intent
    const classification = await classifyReply(
      reply.body,
      reply.originalEmail,
      await getProspectContext(reply.from)
    )

    console.log(`→ Intent: ${classification.intent} (${Math.round(classification.confidence * 100)}% confidence)`)

    // 2. Take immediate action based on intent
    let response: string | null = null
    let crmAction: string = ''

    switch (classification.intent) {
      case 'interested':
        response = await generateResponse('interested', reply.prospect, reply.body, SENDER)
        crmAction = 'update_stage:meeting_requested'
        break

      case 'not_interested':
        await markOptedOut(reply.from)
        crmAction = 'update_stage:closed_lost | add_note:hard_no'
        break

      case 'not_now':
        const days = classification.followUpDays ?? 90
        await scheduleFollowUp(reply.from, days)
        crmAction = `update_stage:nurture | schedule_followup:+${days}d`
        break

      case 'ooo':
        const returnDate = classification.extractedData.returnDate
        if (returnDate) await scheduleFollowUp(reply.from, returnDate)
        crmAction = `schedule_followup:${returnDate ?? '+14d'}`
        break

      case 'referral':
        const referred = classification.extractedData.referredContact
        if (referred) await addToSequence(referred, { referredBy: reply.from })
        response = await generateResponse('referral', reply.prospect, reply.body, SENDER)
        crmAction = `add_contact:${referred} | add_note:referral_from_${reply.from}`
        break

      default:
        response = await generateResponse(classification.intent, reply.prospect, reply.body, SENDER)
        crmAction = `add_note:${classification.intent} | route_to_human`
    }

    // 3. Update CRM
    await updateCRMRecord(reply.from, {
      lastReplyIntent: classification.intent,
      lastReplyDate: new Date().toISOString(),
      note: `Reply classified: ${classification.intent}. Signals: ${classification.keySignals.join(', ')}`,
    })

    // 4. Post Slack notification for hot replies
    if (['interested', 'referral', 'question'].includes(classification.intent)) {
      await postSlackAlert({
        channel: '#sdr-hot-replies',
        message: `🔥 Hot reply from ${reply.from} at ${reply.prospect.company}`,
        intent: classification.intent,
        draft: response,
      })
    }

    results.push({
      from: reply.from,
      intent: classification.intent,
      confidence: classification.confidence,
      draftResponse: response,
      crmAction,
    })
  }

  return results
}
```

### Matriz de manejo de objeciones

```
Por cada objeción, Claude genera una respuesta usando:
1. Reconocer — valida su preocupación (1 oración)
2. Reencuadrar — cambia la perspectiva (1-2 oraciones)
3. Evidencia — punto de prueba o pregunta (1 oración)
4. Próximo paso — CTA suave (1 oración)

OBJECIÓN: "Ya usamos [Competidor]"
MARCO:
- Reconocer: "Tiene sentido — [Competidor] hace buen trabajo en [área]."
- Reencuadrar: "La mayoría de los equipos con los que hablamos usan [Competidor] para [X] pero encuentran brechas en [Y]."
- Evidencia: "Curioso — ¿están obteniendo [resultado específico] con ellos hoy?"
- Próximo paso: "¿Vale una comparación de 15 minutos? Puedo mostrarte las brechas específicamente."

OBJECIÓN: "No está en el presupuesto ahora"
MARCO:
- Reconocer: "Totalmente entendido — los presupuestos están ajustados."
- Reencuadrar: "Los equipos que más sacan de nosotros suelen empezar pequeño para demostrar el ROI antes de expandirse."
- Evidencia: "[Cliente] empezó con un piloto y ahorró [X horas/mes] en el primer trimestre."
- Próximo paso: "¿Funcionaría un alcance de piloto más pequeño, o vale la pena retomar en [mes]?"

OBJECIÓN: "No nos es relevante"
MARCO:
- Reconocer: "Válido — suena como que el ángulo con el que lo planteé no fue el correcto."
- Reencuadrar: "¿Puedo preguntar — ¿están lidiando con [dolor específico]?"
- Evidencia: [Si sí] "Eso es exactamente donde ayudamos."
- Próximo paso: "Si no, no desperdiciaré tu tiempo — pero curioso cómo se ve [área de dolor] para ustedes."

OBJECIÓN: "Envíame más información"
RIESGO: Esto suele ser un no educado. No envíes solo un PDF de 10 páginas.
MARCO:
- Clarificar: "Con gusto — ¿qué pregunta específica quisieras que la información responda?"
- Luego: Envía respuesta específica, no un folleto
- Seguimiento: Llama 2 días después de enviar (no por email)
```

### Prompt de clasificación por lotes (versión sin código)

```
Estás clasificando respuestas de una secuencia de contacto en frío.

Por cada respuesta, produce:
1. Intención: [interested | not_now | not_interested | objection_price | objection_competitor | 
               objection_timing | question | referral | ooo | unknown]
2. Confianza: [0-100]
3. Acción recomendada: [book_meeting | send_resources | stop_sequence | nurture_90d | route_human]
4. Borrador de respuesta: [respuesta de 3-5 oraciones, o "no se necesita respuesta"]

---
RESPUESTA 1 (de: jane@acme.com):
[pegar respuesta]

RESPUESTA 2 (de: bob@startup.io):
[pegar respuesta]
---

Formatea el resultado como una tabla.
```

## Ejemplo

**Buzón:** 12 respuestas de la secuencia de contacto de esta semana. El SDR tiene 20 minutos antes de una llamada.

**Resultado:**
| De | Intención | Confianza | Acción | Borrador listo |
|---|---|---|---|---|
| jane@acme.com | interested | 95% | book_meeting | Sí |
| bob@startup.io | objection_price | 87% | send_roi_framing | Sí |
| carol@corp.com | ooo | 99% | followup_Jun15 | No se necesita respuesta |
| dan@bigco.com | not_interested | 92% | stop_sequence | No se necesita respuesta |
| emma@tech.co | referral | 88% | get_intro | Sí |
| … | … | … | … | … |

Slack recibe notificación de las 3 respuestas calientes. CRM actualizado automáticamente. El SDR revisa y envía 3 borradores de respuesta en 8 minutos en total.

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
