---
name: sdr-reply-classifier
description: "SDR-Posteingangs-Triage: Antwort-Absicht klassifizieren (interessiert, nicht jetzt, Einwand, Weiterleitung, Abwesenheit), kontextbewusste Antworten generieren, CRM aktualisieren und Slack benachrichtigen — unter 5 Minuten Antwortzeit"
---

# SDR-Antwort-Klassifizierer-Skill

## Wann aktivieren
- Du erhältst eingehende E-Mail-Antworten aus einer Kaltakquise-Sequenz
- Du musst einen vollen Posteingang triage und schnell Antwortentwürfe generieren
- Du möchtest eine automatisierte Antwort-Handling-Pipeline aufbauen (n8n / Make / Zapier)
- Unter-5-Minuten-Antwortzeit ist ein Ziel (3x höhere Buchungsrate als 30-minütiger manueller Prozess)
- Du möchtest Antworten zur richtigen Aktion weiterleiten, ohne jede E-Mail manuell zu lesen

## Wann NICHT verwenden
- Eingehende Marketing-Leads — andere Absicht, einen dedizierten Inbound-Routing-Flow verwenden
- Kundenservice-Antworten — keine SDR-Funktion
- Interne E-Mails — nur auf ausgehende Sequenzen beschränken
- Newsletter oder Massen-E-Mails — keine Antworten auf Outreach

## Anweisungen

### Absichtsklassifizierungsschema

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const ReplyIntent = z.enum([
  'interested',          // Positiv — möchte mehr erfahren / ein Gespräch buchen
  'not_now',             // Positiv zukünftig — falsches Timing, in X Monaten erneut versuchen
  'not_interested',      // Klares Nein — Sequenz sofort beenden
  'objection_price',     // Preisbedenken — benötigt ROI-Rahmung
  'objection_competitor', // Nutzt einen Wettbewerber — benötigt Differenzierung
  'objection_timing',    // Budget-/Personalfenster, Einstellungspause
  'objection_not_relevant', // Produkt nicht relevant für ihre Rolle/Unternehmen
  'question',            // Möchte mehr Infos vor der Entscheidung
  'referral',            // Weiterleitung zu einem besseren internen Kontakt
  'meeting_reschedule',  // Bereits gebucht, muss Zeit verschieben
  'ooo',                 // Abwesenheits-Auto-Antwort — Rückkehrdatum extrahieren
  'spam_filter',         // Antwort ist ein Bounce oder Zustellbarkeitshinweis
  'unknown',             // Kann nicht klassifiziert werden — zur menschlichen Überprüfung weiterleiten
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

### Antwortgenerierung nach Absicht

```typescript
async function generateResponse(
  intent: z.infer<typeof ReplyIntent>,
  prospect: ProspectContext,
  reply: string,
  senderContext: SenderContext
): Promise<string | null> {

  // Diese Absichten erhalten eine sofortige Antwort
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

### Vollständige Triage-Pipeline

```typescript
async function triageInbox(replies: IncomingReply[]): Promise<TriageResult[]> {
  const results: TriageResult[] = []

  for (const reply of replies) {
    console.log(`\nTriaging reply from ${reply.from}...`)

    // 1. Absicht klassifizieren
    const classification = await classifyReply(
      reply.body,
      reply.originalEmail,
      await getProspectContext(reply.from)
    )

    console.log(`→ Intent: ${classification.intent} (${Math.round(classification.confidence * 100)}% confidence)`)

    // 2. Sofortige Aktion basierend auf Absicht
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

    // 3. CRM aktualisieren
    await updateCRMRecord(reply.from, {
      lastReplyIntent: classification.intent,
      lastReplyDate: new Date().toISOString(),
      note: `Reply classified: ${classification.intent}. Signals: ${classification.keySignals.join(', ')}`,
    })

    // 4. Slack-Benachrichtigung für heiße Antworten
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

### Einwands-Handling-Matrix

```
Für jeden Einwand generiert Claude eine Antwort nach folgendem Schema:
1. Anerkennen — ihr Anliegen validieren (1 Satz)
2. Neurahmen — Perspektive wechseln (1-2 Sätze)
3. Beleg — Beweispunkt oder Frage (1 Satz)
4. Nächster Schritt — sanfter CTA (1 Satz)

EINWAND: "Wir nutzen bereits [Wettbewerber]"
FRAMEWORK:
- Anerkennen: "Macht Sinn — [Wettbewerber] macht solide Arbeit in [Bereich]."
- Neurahmen: "Die meisten Teams, mit denen wir sprechen, nutzen [Wettbewerber] für [X], finden aber Lücken in [Y]."
- Beleg: "Neugierig — erhalten Sie [spezifisches Ergebnis] mit ihnen heute?"
- Nächster Schritt: "15-minütiger Vergleich wert? Ich kann Ihnen die Lücken gezielt zeigen."

EINWAND: "Gerade nicht im Budget"
FRAMEWORK:
- Anerkennen: "Völlig verständlich — Budgets sind knapp."
- Neurahmen: "Die Teams, die am meisten von uns profitieren, starten klein, um ROI zu beweisen, bevor sie expandieren."
- Beleg: "[Kunde] startete mit einem Pilot und sparte im ersten Quartal [X Stunden/Monat]."
- Nächster Schritt: "Würde ein kleinerer Pilot-Umfang passen, oder ist es sinnvoller, im [Monat] wiederzukommen?"

EINWAND: "Nicht relevant für uns"
FRAMEWORK:
- Anerkennen: "Fair — es klingt, als hätte ich es nicht richtig gerahmt."
- Neurahmen: "Darf ich fragen — haben Sie überhaupt mit [spezifischem Schmerz] zu tun?"
- Beleg: [Wenn ja] "Das ist genau der Bereich, wo wir helfen."
- Nächster Schritt: "Falls nicht, werde ich Ihre Zeit nicht verschwenden — aber neugierig, wie [Schmerzbereich] bei Ihnen aussieht."

EINWAND: "Schicken Sie mir mehr Infos"
RISIKO: Das ist oft ein höfliches Nein. Kein 10-seitiges PDF einfach schicken.
FRAMEWORK:
- Klärung: "Gerne — welche spezifische Frage sollen die Infos beantworten?"
- Dann: Gezielte Antwort senden, keine Broschüre
- Follow-up: 2 Tage nach dem Senden anrufen (nicht per E-Mail)
```

### Massen-Triage-Eingabeaufforderung (No-Code-Version)

```
Du triage Antworten auf eine Kaltakquise-Sequenz.

Für jede Antwort unten ausgeben:
1. Absicht: [interested | not_now | not_interested | objection_price | objection_competitor | 
            objection_timing | question | referral | ooo | unknown]
2. Zuverlässigkeit: [0-100]
3. Empfohlene Aktion: [book_meeting | send_resources | stop_sequence | nurture_90d | route_human]
4. Antwortentwurf: [3-5 Satz Antwort oder "keine Antwort nötig"]

---
ANTWORT 1 (von: jane@acme.com):
[Antwort einfügen]

ANTWORT 2 (von: bob@startup.io):
[Antwort einfügen]
---

Ausgabe als Tabelle formatieren.
```

## Beispiel

**Posteingang:** 12 Antworten aus der Outreach-Sequenz dieser Woche. SDR hat 20 Minuten vor einem Gespräch.

**Ausgabe:**
| Von | Absicht | Zuverlässigkeit | Aktion | Entwurf bereit |
|---|---|---|---|---|
| jane@acme.com | interested | 95% | book_meeting | Ja |
| bob@startup.io | objection_price | 87% | send_roi_framing | Ja |
| carol@corp.com | ooo | 99% | followup_Jun15 | Keine Antwort nötig |
| dan@bigco.com | not_interested | 92% | stop_sequence | Keine Antwort nötig |
| emma@tech.co | referral | 88% | get_intro | Ja |
| … | … | … | … | … |

Slack wird über die 3 heißen Antworten benachrichtigt. CRM automatisch aktualisiert. SDR überprüft und sendet 3 Antwortentwürfe in insgesamt 8 Minuten.

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
