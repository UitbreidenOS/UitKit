---
name: sdr-call-analysis
description: "Análisis post-llamada de transcripciones para SDRs: extrae resultado, próximos pasos, objeciones planteadas, retroalimentación de coaching, y genera automáticamente notas de CRM y email de seguimiento a partir de una grabación o transcripción de llamada"
---

# Habilidad de Análisis de Llamadas para SDR

## Cuándo activar
- Acabas de terminar una llamada en frío o de descubrimiento y necesitas registrarla rápidamente
- Tienes una transcripción o grabación de llamada y quieres retroalimentación de coaching
- Tu equipo graba llamadas (Gong, Aircall, Fireflies, Otter) y quieres análisis con IA
- Quieres extraer notas de CRM, objeciones y próximos pasos de una llamada de forma automática
- Gerente de SDR revisando la calidad de llamadas del equipo

## Cuándo NO usar
- Preparación previa a la llamada — usa `/sdr-call-prep` para eso
- Llamadas de éxito del cliente o QBRs — tienen estructura y objetivos distintos
- Reuniones internas del equipo — no es relevante
- Llamadas sin transcripción — necesitas texto de entrada (usa primero una herramienta de transcripción)

## Instrucciones

### Prompt de análisis completo de llamada

```
Analiza esta transcripción de llamada de ventas y extrae resultados estructurados.

[PEGAR TRANSCRIPCIÓN]

Contexto:
- Rep: [nombre]
- Prospecto: [nombre, cargo, empresa]
- Tipo de llamada: [llamada en frío / descubrimiento / seguimiento / demo / cierre]
- Objetivo de la llamada: [qué intentaba lograr el rep]

Extrae:

## 1. Resultado de la llamada
- Resultado: [meeting_booked | positive_followup | objection_unresolved | not_interested | voicemail | gatekeeper | no_answer]
- Confianza en el resultado: [0-100]
- Próximo paso acordado: [exactamente lo que se acordó — fecha, hora, formato]

## 2. Nota de CRM (lista para pegar)
Fecha: [fecha]
Duración: [minutos]
Resultado: [resultado]
Resumen: [2-3 oraciones sobre lo que se discutió y acordó]
Próximo paso: [acción exacta + responsable + fecha]
Objeciones planteadas: [lista]
Sentimiento del prospecto: [positivo / neutral / negativo]

## 3. Objeciones planteadas + cómo se manejaron
Por cada objeción:
- Objeción: [textual o parafraseada]
- Cómo la manejó el rep: [lo que dijo]
- Efectividad: [bien / podría mejorar / oportunidad perdida]
- Manejo sugerido: [enfoque alternativo si se necesita mejora]

## 4. Puntuación de calidad de descubrimiento (0-100)
- ¿Entendió el rep el dolor del prospecto? [sí/parcial/no]
- ¿Identificó el rep al tomador de decisiones? [sí/no]
- ¿Entendió el rep el cronograma? [sí/no]
- ¿Entendió el rep la situación presupuestaria? [sí/no]
- Proporción preguntas formuladas vs. afirmaciones realizadas: [X:Y — debe ser >2:1]
- Puntuación: [0-100]

## 5. Email de seguimiento (listo para enviar)
Asunto: [personalizado — no "Seguimiento de nuestra llamada"]
Cuerpo: [seguimiento de 4-6 oraciones referenciando cosas específicas discutidas]

## 6. Retroalimentación de coaching (3 puntos)
- Qué funcionó bien: [1 punto]
- Qué mejorar: [1-2 puntos con lenguaje alternativo específico]
- Ejercicio sugerido: [ejercicio de práctica específico]
```

### Extracción rápida de nota de CRM (menos de 1 minuto)

```
Extrae una nota de CRM de esta transcripción de llamada.

[PEGAR TRANSCRIPCIÓN]

Formato de salida:
Fecha: [hoy]
Resultado: [1 palabra — booked/no/voicemail/objection/positive]
Cita clave del prospecto: "[textual — lo más revelador que dijeron]"
Próximo paso: [exactamente qué sucede después — quién hace qué y cuándo]
Resumen: [2 oraciones]
Etiquetas: [objection_price | objection_competitor | champion | not_icp | hot | nurture]
```

### Extracción de objeciones y coaching

```
Extrae cada objeción de esta transcripción de llamada y puntúa qué tan bien la manejó el rep.

[PEGAR TRANSCRIPCIÓN]

Por cada objeción:
1. Objeción (textual o parafraseada)
2. Respuesta del rep (textual)
3. Puntuación: [A/B/C/D]
   - A: Reconoció, reencuadró, avanzó al siguiente paso
   - B: Reconoció pero no avanzó
   - C: Se puso a la defensiva o sobreexplicó
   - D: Ignoró o falló
4. Mejor respuesta: [lenguaje alternativo si es B/C/D]

Resumen: 
- Total de objeciones: [X]
- Puntuación promedio: [X]
- Mayor brecha: [qué tipo de objeción necesita más trabajo]
- Recomendación de ejercicio: [ejercicio de práctica específico]
```

### Patrón de integración con Gong / Aircall

```typescript
// Receptor de webhook — se activa cuando una grabación de llamada está lista
app.post('/webhooks/call-completed', async (req, res) => {
  const { callId, recordingUrl, repEmail, prospectEmail, durationSeconds } = req.body

  // 1. Fetch transcript from your transcription provider
  const transcript = await getTranscript(callId) // Gong, Fireflies, Otter API

  // 2. Get prospect context from CRM
  const prospect = await hubspot.findContactByEmail(prospectEmail)

  // 3. Run Claude analysis
  const analysis = await analyseCall({
    transcript,
    rep: await getRepByEmail(repEmail),
    prospect,
    callType: inferCallType(durationSeconds, prospect.lifecyclestage),
  })

  // 4. Update CRM
  await hubspot.crm.contacts.basicApi.update(prospect.id, {
    properties: {
      last_call_outcome: analysis.outcome,
      last_call_date: new Date().toISOString(),
      last_call_summary: analysis.crmNote,
      last_call_next_step: analysis.nextStep,
    },
  })

  // 5. Create note in CRM
  await hubspot.crm.notes.basicApi.create({
    properties: {
      hs_note_body: analysis.crmNote,
      hs_timestamp: Date.now(),
    },
    associations: [{ to: { id: prospect.id }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] }],
  })

  // 6. Post coaching feedback to Slack if score < 70
  if (analysis.discoveryScore < 70) {
    await postSlackCoachingAlert({
      channel: `#coaching-${repEmail.split('@')[0]}`,
      rep: repEmail,
      callId,
      score: analysis.discoveryScore,
      feedback: analysis.coachingFeedback,
    })
  }

  // 7. If meeting booked — notify AE for warm handoff
  if (analysis.outcome === 'meeting_booked') {
    await notifyAE(analysis.nextStep)
  }

  res.json({ ok: true, analysisId: analysis.id })
})

async function analyseCall(params: CallAnalysisParams) {
  const { object } = await generateObject({
    model: anthropic('claude-sonnet-4-6'),
    schema: CallAnalysisSchema,
    system: `You are a sales coach analysing a B2B cold outreach call.
Be specific and actionable. Reference exact quotes from the transcript.
Score based on: did the rep understand pain, identify stakeholders, agree on next steps?`,
    prompt: `Analyse this call:

REP: ${params.rep.name}
PROSPECT: ${params.prospect.name}, ${params.prospect.title} at ${params.prospect.company}
TRANSCRIPT:
${params.transcript}`,
  })
  return object
}
```

### Revisión por lotes de llamadas (vista del gerente)

```
Eres un gerente de ventas revisando las llamadas de tu equipo de SDR esta semana.

Aquí tienes [N] transcripciones de llamadas. Por cada una:
1. Puntúa la llamada (0-100)
2. Identifica la mayor oportunidad de coaching (1 oración)
3. Señala si la llamada revela una discrepancia con el ICP
4. Señala cualquier prospecto caliente que necesite atención inmediata del AE

Luego dame:
- Puntuación promedio del equipo
- Objeción más común esta semana
- Rep que más necesita coaching (y por qué)
- Mejor desempeño y qué está haciendo diferente

[PEGAR TRANSCRIPCIONES]
```

### Plantillas de email de seguimiento por resultado

```
RESULTADO: Reunión agendada
Asunto: "[TEMA QUE DISCUTIMOS] — confirmado para [DÍA HORA]"
Cuerpo:
"[NOMBRE], fue un placer hablar contigo. Espero con ansias el [DÍA] a las [HORA].

Llegaré preparado con [lo que discutiste preparar].

Agenda rápida:
- [10 min] Tu configuración actual con [X]
- [10 min] Cómo abordamos [su problema]
- [10 min] Preguntas y valoración de ajuste

La invitación de calendario llega desde [Calendly/Google Calendar].

[Firma]"

---

RESULTADO: Positivo pero sin reunión agendada aún
Asunto: "[Una cosa que discutieron]"
Cuerpo:
"[NOMBRE], gracias por el tiempo de hoy.

Como mencioné, [breve resumen de su punto de dolor en sus palabras].

Te enviaré [lo que prometiste — caso de estudio, datos, clip de demo].

[Recurso adjunto / enlace]

¿Vale la pena dedicar 20 minutos para ver cómo esto aplica a [su empresa]?
Tengo disponible el [DÍA] a las [HORA] o el [DÍA] a las [HORA] — ¿alguno te funciona?

[Firma]"

---

RESULTADO: Dejé correo de voz / sin respuesta
Asunto: "Seguimiento — [desencadenante específico o razón]"
Cuerpo:
"[NOMBRE], intenté contactarte antes — espero que solo fuera mal momento.

Te escribo porque [desencadenante en una oración — por qué ahora].

[Una oración sobre qué hacemos + resultado relevante].

Con gusto lo mantenemos en 15 minutos — [enlace de Calendly] si es más fácil que llamar.

[Firma]"
```

## Ejemplo

**Usuario:** Analiza esta llamada de 4 minutos. Marcus dijo "no es el momento adecuado" pero parecía interesado. ¿Qué debo hacer a continuación?

**Extracto de transcripción:**
> Rep: "...basándome en tu contratación, parece que estás escalando el equipo de ventas."
> Marcus: "Sí, es así, pero honestamente no es el momento adecuado — estamos en medio de una reorganización."
> Rep: "Totalmente entendido. ¿Cuándo crees que sería mejor?"
> Marcus: "Probablemente en el cuarto trimestre — agosto/septiembre quizás."
> Rep: "Perfecto — te contactaré entonces."

**Resultado del análisis:**

```
Outcome: not_now (positivo — expresó interés futuro)
Next step: Seguimiento a mediados de agosto (programar para el 12 de ago)

CRM Note:
Llamada con Marcus Chen, 4 min, 2 de jun. Actualmente en reorganización — "no es el momento adecuado."
Expresó apertura a retomar en el cuarto trimestre (ago/sep). Alta compatibilidad con ICP confirmada (escalando equipo de ventas).
Programar: llamada de seguimiento el 12 de ago.

Objección: "No es el momento adecuado — estamos en una reorganización"
Manejo del rep: B — reconoció, obtuvo un plazo, pero perdió la oportunidad de
mantenerse presente en el ínterin.
Mejor respuesta: "Tiene sentido — las reorganizaciones son agitadas. ¿Sería útil si te enviara
algo mientras tanto para que cuando llegue el cuarto trimestre ya estés familiarizado?
Toma 2 minutos leerlo."
→ Esto te mantiene presente sin presionar.

Puntuación de descubrimiento: 52/100
- ¿Obtuvo el cronograma? Sí (cuarto trimestre)
- ¿Entendió el dolor? Parcial (escalando, pero no sondeó qué está fallando)
- ¿Identificó al tomador de decisiones? No — no confirmó si Marcus es el comprador
- Faltante: "¿Quién más estaría involucrado en este tipo de decisión?"

Email de seguimiento redactado ✓
Nota de coaching enviada a Slack ✓
CRM actualizado: lifecycle = nurture, tarea de seguimiento = 12 de ago ✓
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
