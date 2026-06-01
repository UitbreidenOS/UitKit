---
name: sdr-reply-classifier
description: "SDR inbox triage: classify reply intent (interested, not now, objection, referral, OOO), generate context-aware responses, update CRM, and notify Slack — sub-5-minute reply cadence"
---

# SDR Reply Classifier Skill

## When to activate
- You have incoming email replies from a cold outreach sequence
- You need to triage a full inbox and generate draft responses quickly
- You want to build an automated reply-handling pipeline (n8n / Make / Zapier)
- Sub-5-minute reply cadence is a goal (3x higher booking rate than 30-minute manual)
- You want to route replies to the right action without reading every email manually

## When NOT to use
- Inbound marketing leads — different intent, use a dedicated inbound routing flow
- Customer support replies — not an SDR function
- Internal emails — scope only outbound sequences
- Newsletters or mass mail — not replies to outreach

## Instructions

### Intent classification schema

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const ReplyIntent = z.enum([
  'interested',          // Positive — wants to learn more / book a call
  'not_now',             // Positive future — wrong timing, try again in X months
  'not_interested',      // Hard no — stop sequence immediately
  'objection_price',     // Price concern — needs ROI framing
  'objection_competitor', // Using a competitor — needs differentiation
  'objection_timing',    // Budget/headcount freeze, hiring pause
  'objection_not_relevant', // Product not relevant to their role/company
  'question',            // Wants more info before deciding
  'referral',            // Redirecting to a better contact internally
  'meeting_reschedule',  // Already booked, needs to move time
  'ooo',                 // Out of office auto-reply — extract return date
  'spam_filter',         // Reply is a bounce or deliverability notice
  'unknown',             // Can't classify — route to human review
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

### Response generation by intent

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

### Full triage pipeline

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

### Objection handling matrix

```
For each objection, Claude generates a response using:
1. Acknowledge — validate their concern (1 sentence)
2. Reframe — shift the lens (1-2 sentences)
3. Evidence — proof point or question (1 sentence)
4. Next step — soft CTA (1 sentence)

OBJECTION: "We already use [Competitor]"
FRAMEWORK:
- Acknowledge: "Makes sense — [Competitor] does solid work in [area]."
- Reframe: "Most teams we talk to use [Competitor] for [X] but find gaps in [Y]."
- Evidence: "Curious — are you getting [specific outcome] with them today?"
- Next step: "Worth a 15-minute compare? I can show you the gaps specifically."

OBJECTION: "Not in budget right now"
FRAMEWORK:
- Acknowledge: "Totally understand — budgets are tight."
- Reframe: "The teams that get the most from us usually start small to prove ROI before expanding."
- Evidence: "[Customer] started with a pilot and saved [X hours/month] in the first quarter."
- Next step: "Would a smaller pilot scope work, or is it worth revisiting in [month]?"

OBJECTION: "Not relevant to us"
FRAMEWORK:
- Acknowledge: "Fair — sounds like the way I framed it wasn't the right angle."
- Reframe: "Can I ask — are you dealing with [specific pain] at all?"
- Evidence: [If yes] "That's actually exactly where we help."
- Next step: "If not, I won't waste your time — but curious what [pain area] looks like for you."

OBJECTION: "Send me more info"
RISK: This is often a polite no. Don't just send a 10-page PDF.
FRAMEWORK:
- Clarify: "Happy to — what specific question would you like the info to answer?"
- Then: Send targeted answer, not a brochure
- Follow up: Call 2 days after sending (not email)
```

### Batch triage prompt (no-code version)

```
You are triaging replies to a cold outreach sequence.

For each reply below, output:
1. Intent: [interested | not_now | not_interested | objection_price | objection_competitor | 
            objection_timing | question | referral | ooo | unknown]
2. Confidence: [0-100]
3. Recommended action: [book_meeting | send_resources | stop_sequence | nurture_90d | route_human]
4. Draft response: [3-5 sentence reply, or "no response needed"]

---
REPLY 1 (from: jane@acme.com):
[paste reply]

REPLY 2 (from: bob@startup.io):
[paste reply]
---

Format output as a table.
```

## Example

**Inbox:** 12 replies from this week's outreach sequence. SDR has 20 minutes before a call.

**Output:**
| From | Intent | Confidence | Action | Draft Ready |
|---|---|---|---|---|
| jane@acme.com | interested | 95% | book_meeting | Yes |
| bob@startup.io | objection_price | 87% | send_roi_framing | Yes |
| carol@corp.com | ooo | 99% | followup_Jun15 | No response needed |
| dan@bigco.com | not_interested | 92% | stop_sequence | No response needed |
| emma@tech.co | referral | 88% | get_intro | Yes |
| … | … | … | … | … |

Slack gets notified of the 3 hot replies. CRM updated automatically. SDR reviews and sends 3 draft responses in 8 minutes total.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
