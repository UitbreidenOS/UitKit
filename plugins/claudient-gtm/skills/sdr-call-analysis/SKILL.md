---
name: "sdr-call-analysis"
description: "Post-call transcript analysis for SDRs: extract outcome, next steps, objections raised, coaching feedback, and auto-draft CRM notes + follow-up email from a call recording or transcript"
---

# SDR Call Analysis Skill

## When to activate
- You just finished a cold call or discovery call and need to log it fast
- You have a call transcript or recording and want coaching feedback
- Your team records calls (Gong, Aircall, Fireflies, Otter) and you want AI analysis
- You want to extract CRM notes, objections, and next steps from a call automatically
- SDR manager reviewing call quality across the team

## When NOT to use
- Pre-call preparation — use `/sdr-call-prep` for that
- Customer success calls or QBRs — different structure and goals
- Internal team meetings — not relevant
- Calls with no transcript — you need text input (use a transcription tool first)

## Instructions

### Full call analysis prompt

```
Analyse this sales call transcript and extract structured outputs.

[PASTE TRANSCRIPT]

Context:
- Rep: [name]
- Prospect: [name, title, company]
- Call type: [cold call / discovery / follow-up / demo / closing]
- Call goal: [what the rep was trying to achieve]

Extract:

## 1. Call outcome
- Result: [meeting_booked | positive_followup | objection_unresolved | not_interested | voicemail | gatekeeper | no_answer]
- Outcome confidence: [0-100]
- Next step agreed: [exactly what was agreed — date, time, format]

## 2. CRM note (ready to paste)
Date: [date]
Duration: [minutes]
Outcome: [result]
Summary: [2-3 sentences covering what was discussed and agreed]
Next step: [exact next action + owner + date]
Objections raised: [list]
Prospect sentiment: [positive / neutral / negative]

## 3. Objections raised + how they were handled
For each objection:
- Objection: [verbatim or paraphrased]
- How rep handled it: [what they said]
- Effectiveness: [good / could be improved / missed opportunity]
- Suggested handling: [alternative approach if improvement needed]

## 4. Discovery quality score (0-100)
- Did rep understand the prospect's pain? [yes/partial/no]
- Did rep identify the decision-maker? [yes/no]
- Did rep understand the timeline? [yes/no]
- Did rep understand the budget situation? [yes/no]
- Questions asked vs. statements made ratio: [X:Y — should be >2:1]
- Score: [0-100]

## 5. Follow-up email (ready to send)
Subject: [personalised — not "Following up from our call"]
Body: [4-6 sentence follow-up referencing specific things discussed]

## 6. Coaching feedback (3 things)
- What worked well: [1 thing]
- What to improve: [1-2 things with specific alternative language]
- Suggested drill: [specific practice exercise]
```

### Quick CRM note extraction (< 1 minute)

```
Extract a CRM note from this call transcript.

[PASTE TRANSCRIPT]

Output format:
Date: [today]
Outcome: [1 word — booked/no/voicemail/objection/positive]
Key quote from prospect: "[verbatim — most revealing thing they said]"
Next step: [exactly what happens next — who does what by when]
Summary: [2 sentences]
Tags: [objection_price | objection_competitor | champion | not_icp | hot | nurture]
```

### Objection extraction and coaching

```
Extract every objection from this call transcript and score how well the rep handled each one.

[PASTE TRANSCRIPT]

For each objection:
1. Objection (verbatim or paraphrased)
2. Rep's response (verbatim)
3. Score: [A/B/C/D]
   - A: Acknowledged, reframed, got to next step
   - B: Acknowledged but didn't advance
   - C: Got defensive or over-explained
   - D: Ignored or fumbled
4. Better response: [alternative language if B/C/D]

Summary: 
- Total objections: [X]
- Average score: [X]
- Biggest gap: [which objection type needs most work]
- Drill recommendation: [specific practice exercise]
```

### Gong / Aircall integration pattern

```typescript
// Webhook receiver — fires when a call recording is ready
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

### Batch call review (manager view)

```
You are a sales manager reviewing calls from your SDR team this week.

Here are [N] call transcripts. For each:
1. Score the call (0-100)
2. Identify the biggest coaching opportunity (1 sentence)
3. Flag if the call reveals an ICP mismatch
4. Flag any hot prospects that need immediate AE attention

Then give me:
- Team average score
- Most common objection this week
- Rep who needs most coaching (and why)
- Top performer and what they're doing differently

[PASTE TRANSCRIPTS]
```

### Follow-up email templates by outcome

```
OUTCOME: Meeting booked
Subject: "[TOPIC WE DISCUSSED] — confirmed for [DAY TIME]"
Body:
"[NAME], great speaking with you. Looking forward to [DAY] at [TIME].

I'll come prepared with [what you discussed preparing].

Quick agenda:
- [10 min] Your current setup with [X]
- [10 min] How we approach [their problem]
- [10 min] Q&A + fit assessment

Calendar invite coming from [Calendly/Google Calendar].

[Signature]"

---

OUTCOME: Positive but no meeting booked yet
Subject: "[One thing you discussed]"
Body:
"[NAME], appreciate the time today.

As I mentioned, [brief recap of their pain point in their words].

I'll send over [what you promised — case study, data, demo clip].

[Attached resource / link]

Worth a proper 20 minutes to walk through how this applies to [their company]?
I've got [DAY] at [TIME] or [DAY] at [TIME] — either work?

[Signature]"

---

OUTCOME: Left voicemail / no answer
Subject: "Following up — [specific trigger or reason]"
Body:
"[NAME], tried you earlier — hope the timing was just off.

I'm reaching out because [one-sentence trigger — why now].

[One-sentence what we do + relevant outcome].

Happy to keep it to 15 minutes — [Calendly link] if easier than phone.

[Signature]"
```

## Example

**User:** Analyse this 4-minute call. Marcus said "not the right time" but seemed interested. What should I do next?

**Transcript excerpt:**
> Rep: "...based on your hiring, it seems like you're scaling the sales team."
> Marcus: "Yeah, we are, but honestly it's not the right time — we're in the middle of a reorg."
> Rep: "Totally understand. When do you think would be better?"
> Marcus: "Probably Q4 — August/September maybe."
> Rep: "Perfect — I'll reach out then."

**Analysis output:**

```
Outcome: not_now (positive — expressed future interest)
Next step: Follow up mid-August (schedule for Aug 12)

CRM Note:
Call with Marcus Chen, 4 min, Jun 2. Currently in reorg — "not the right time."
Expressed openness to revisit Q4 (Aug/Sep). High ICP fit confirmed (scaling sales team).
Schedule: follow-up call Aug 12.

Objection: "Not the right time — we're in a reorg"
Rep handling: B — acknowledged, got a timeframe, but missed the opportunity to 
stay warm in the interim.
Better response: "Makes sense — reorgs are hectic. Would it be useful if I sent you 
one thing in the meantime so when Q4 comes you're already familiar? 
Takes 2 minutes to read."
→ This keeps you top of mind without pushing.

Discovery score: 52/100
- Got the timeline? Yes (Q4)
- Understood the pain? Partial (scaling, but didn't probe what's breaking)
- Identified decision-maker? No — didn't confirm if Marcus is the buyer
- Missing: "Who else would be involved in this kind of decision?"

Follow-up email drafted ✓
Coaching note sent to Slack ✓
CRM updated: lifecycle = nurture, follow-up task = Aug 12 ✓
```

---
