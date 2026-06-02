---
name: sdr-reply-classifier
description: "SDR inboxtriage: classificeer antwoordintentie (geïnteresseerd, niet nu, bezwaar, verwijzing, OOO), genereer contextbewuste reacties, werk CRM bij, en informeer Slack — antwoordcadans onder 5 minuten"
---

# SDR Antwoordclassificatie Skill

## Wanneer activeren
- Je ontvangt inkomende e-mailantwoorden van een koude outreachsequence
- Je moet een volledige inbox triëren en snel conceptreacties genereren
- Je wilt een geautomatiseerde antwoordverwerkingspipeline bouwen (n8n / Make / Zapier)
- Antwoordcadans onder 5 minuten is een doel (3x hogere boekingsratio dan 30 minuten handmatig)
- Je wilt antwoorden doorsturen naar de juiste actie zonder elke e-mail handmatig te lezen

## Wanneer NIET gebruiken
- Inkomende marketingleads — andere intentie, gebruik een specifieke inkomende routeringsflow
- Klantenserviceantwoorden — geen SDR-functie
- Interne e-mails — scope geldt alleen voor uitgaande sequences
- Nieuwsbrieven of massamail — geen antwoorden op outreach

## Instructies

### Intentclassificatieschema

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const ReplyIntent = z.enum([
  'interested',          // Positief — wil meer leren / een gesprek boeken
  'not_now',             // Positieve toekomst — verkeerde timing, probeer opnieuw over X maanden
  'not_interested',      // Hard nee — stop sequence onmiddellijk
  'objection_price',     // Prijszorg — heeft ROI-framing nodig
  'objection_competitor', // Gebruikt een concurrent — heeft differentiatie nodig
  'objection_timing',    // Budget/headcount-bevriezing, wervingspauze
  'objection_not_relevant', // Product niet relevant voor hun rol/bedrijf
  'question',            // Wil meer info voordat ze beslissen
  'referral',            // Doorverwijzen naar een betere interne contactpersoon
  'meeting_reschedule',  // Al geboekt, moet tijd verzetten
  'ooo',                 // Automatisch antwoord buiten kantoor — haal terugkeerdatum op
  'spam_filter',         // Antwoord is een bounce of bezorgbaarheidsmelding
  'unknown',             // Kan niet classificeren — doorsturen naar menselijke beoordeling
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
        returnDate: z.string().optional(),      // voor OOO-antwoorden
        referredContact: z.string().optional(), // voor verwijzingsantwoorden
        objectionText: z.string().optional(),   // woordelijk bezwaar
        requestedInfo: z.string().optional(),   // welke info ze hebben gevraagd
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

### Reactiegeneratie per intentie

```typescript
async function generateResponse(
  intent: z.infer<typeof ReplyIntent>,
  prospect: ProspectContext,
  reply: string,
  senderContext: SenderContext
): Promise<string | null> {

  // Deze intenties krijgen een onmiddellijke reactie
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

### Volledige triagepipeline

```typescript
async function triageInbox(replies: IncomingReply[]): Promise<TriageResult[]> {
  const results: TriageResult[] = []

  for (const reply of replies) {
    console.log(`\nTriaging reply from ${reply.from}...`)

    // 1. Classificeer intentie
    const classification = await classifyReply(
      reply.body,
      reply.originalEmail,
      await getProspectContext(reply.from)
    )

    console.log(`→ Intent: ${classification.intent} (${Math.round(classification.confidence * 100)}% confidence)`)

    // 2. Onderneem onmiddellijke actie op basis van intentie
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

    // 3. Werk CRM bij
    await updateCRMRecord(reply.from, {
      lastReplyIntent: classification.intent,
      lastReplyDate: new Date().toISOString(),
      note: `Reply classified: ${classification.intent}. Signals: ${classification.keySignals.join(', ')}`,
    })

    // 4. Stuur Slack-melding voor hete antwoorden
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

### Matrix voor bezwaarafhandeling

```
Voor elk bezwaar genereert Claude een reactie met:
1. Erkennen — valideer hun zorg (1 zin)
2. Herformuleren — verschuif het perspectief (1-2 zinnen)
3. Bewijs — bewijspunt of vraag (1 zin)
4. Volgende stap — zachte CTA (1 zin)

BEZWAAR: "We gebruiken al [Concurrent]"
KADER:
- Erkennen: "Begrijpelijk — [Concurrent] doet goed werk in [gebied]."
- Herformuleren: "De meeste teams die we spreken gebruiken [Concurrent] voor [X] maar vinden hiaten in [Y]."
- Bewijs: "Benieuwd — krijg je [specifiek resultaat] met hen vandaag?"
- Volgende stap: "15 minuten vergelijken? Ik kan je de hiaten specifiek laten zien."

BEZWAAR: "Nu geen budget"
KADER:
- Erkennen: "Volledig begrijpelijk — budgetten zijn krap."
- Herformuleren: "De teams die het meeste van ons profiteren starten doorgaans klein om ROI te bewijzen voordat ze uitbreiden."
- Bewijs: "[Klant] startte met een pilot en bespaarde [X uur/maand] in het eerste kwartaal."
- Volgende stap: "Zou een kleinere pilotomvang werken, of loont het de moeite om het in [maand] te herbekijken?"

BEZWAAR: "Niet relevant voor ons"
KADER:
- Erkennen: "Begrijpelijk — klinkt alsof de manier waarop ik het heb geformuleerd niet de juiste hoek was."
- Herformuleren: "Mag ik vragen — heb je überhaupt te maken met [specifieke pijn]?"
- Bewijs: [Zo ja] "Dat is eigenlijk precies waar wij bij helpen."
- Volgende stap: "Zo niet, verspil ik je tijd niet — maar benieuwd hoe [pijngebied] eruit ziet voor jou."

BEZWAAR: "Stuur me meer info"
RISICO: Dit is vaak een beleefde afwijzing. Stuur niet gewoon een 10 pagina's tellend PDF.
KADER:
- Verduidelijken: "Graag — welke specifieke vraag wil je dat de info beantwoordt?"
- Dan: Stuur gerichte antwoord, geen brochure
- Opvolgen: Bel 2 dagen na verzending (geen e-mail)
```

### Batch triageprompt (versie zonder code)

```
Je triëert antwoorden op een koude outreachsequence.

Geef per onderstaand antwoord:
1. Intentie: [interested | not_now | not_interested | objection_price | objection_competitor |
             objection_timing | question | referral | ooo | unknown]
2. Betrouwbaarheid: [0-100]
3. Aanbevolen actie: [book_meeting | send_resources | stop_sequence | nurture_90d | route_human]
4. Conceptreactie: [3-5 zinnen antwoord, of "geen reactie nodig"]

---
ANTWOORD 1 (van: jane@acme.com):
[plak antwoord]

ANTWOORD 2 (van: bob@startup.io):
[plak antwoord]
---

Formatteer uitvoer als een tabel.
```

## Voorbeeld

**Inbox:** 12 antwoorden van de outreachsequence van deze week. SDR heeft 20 minuten voor een gesprek.

**Uitvoer:**
| Van | Intentie | Betrouwbaarheid | Actie | Concept klaar |
|---|---|---|---|---|
| jane@acme.com | interested | 95% | book_meeting | Ja |
| bob@startup.io | objection_price | 87% | send_roi_framing | Ja |
| carol@corp.com | ooo | 99% | followup_15jun | Geen reactie nodig |
| dan@bigco.com | not_interested | 92% | stop_sequence | Geen reactie nodig |
| emma@tech.co | referral | 88% | get_intro | Ja |
| … | … | … | … | … |

Slack ontvangt melding van de 3 hete antwoorden. CRM automatisch bijgewerkt. SDR beoordeelt en verstuurt 3 conceptreacties in totaal 8 minuten.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
