---
name: sdr-objection-handler
description: "Dynamic objection response generator for SDRs: context-aware rebuttals for price, competitor, timing, relevance, and gatekeeper objections — voice and email variants"
updated: 2026-06-13
---

# SDR Objection Handler Skill

## When to activate
- You hit an objection on a call or in email and need an immediate response
- Building an objection handling playbook for your team or onboarding new SDRs
- Training sessions — generating objection drill scenarios
- You want to stress-test your pitch by generating the hardest objections a prospect could raise
- Reviewing past call transcripts for missed objection opportunities

## When NOT to use
- Reply triage at scale — use `/sdr-reply-classifier` for automated inbox triage
- AE-level objections during closing (legal, procurement, final pricing) — different skill set
- Customer objections in renewal calls — CS domain, not SDR

## Instructions

### Instant objection response generator

```
Generate a response to this objection.

Context:
- My product: [what you sell]
- Prospect: [title, company, industry]
- Channel: [cold call (voice) | email | LinkedIn]
- Stage: [cold outreach | follow-up | discovery | end of call]

Objection: "[exact words or paraphrase]"

Generate:
1. Acknowledge (1 sentence — validate without agreeing)
2. Reframe (1-2 sentences — shift the lens)
3. Proof/Question (1 sentence — evidence or discovery question)
4. Next step (1 sentence — advance the conversation)

Also provide:
- Tone: [confident / empathetic / curious]
- What NOT to say
- If this is likely a real objection or a brush-off
```

### Full objection playbook generator

```
Build an objection handling playbook for my product.

Product: [description]
ICP: [ideal customer — industry, size, role]
Top competitors: [1-3 main competitors]
Typical objections by category:

PRICE:
- "Too expensive"
- "Not in budget"
- "Competitor is cheaper"

COMPETITOR:
- "We use [Competitor]"
- "We built this internally"
- "We tried something similar before and it didn't work"

TIMING:
- "Now's not a good time"
- "We're in a freeze"
- "Ask me again next quarter"
- "We just signed a contract with someone else"

RELEVANCE:
- "This doesn't apply to us"
- "We're different from your other customers"
- "Our team handles this manually and it works fine"

TRUST:
- "I've never heard of your company"
- "I need to do more research"
- "Send me a case study first"
- "Let me talk to my team"

For each objection: generate a voice response (<30 seconds) and an email version (4-6 sentences).
```

### The LAER framework (best practice for objection handling)

```
L — LISTEN
Don't interrupt. Let them finish. Note the exact words — they matter.

A — ACKNOWLEDGE
"That makes sense." / "I hear you." / "Fair point."
Never: "Actually, that's not true" / "But..." / "I understand, however..."

E — EXPLORE
Ask a question before you answer. Objections have sub-objections.
"Can I ask — is that because [A] or more [B]?"
"Is the concern the price itself, or the ROI confidence?"

R — RESPOND
Now answer — but only after you understand what's really behind the objection.
Lead with: evidence, a question, or a reframe.
Never: a feature dump.

---
Most reps skip A and E and jump straight to R.
That's why objections don't resolve — prospects feel unheard.
```

### Objection scripts — full library

```
── PRICE OBJECTIONS ────────────────────────────────────────────────────────

"Too expensive"
VOICE: "Totally fair — can I ask, is the concern the absolute cost, or whether the ROI makes sense?
        Because teams at your scale typically save [X hours/month]. Worth seeing the math?"
EMAIL: "The pricing concern is fair — I should have led with outcomes.
        [Similar company] saves [X hours/week] with us, which works out to [$ saved] at your hourly rate.
        Happy to walk through the ROI calc on a quick call — would that be useful?"

"Not in budget"
VOICE: "Is this a 'we don't have budget for anything right now' situation, or more that this
        category doesn't have budget allocated? Because sometimes we can work with [smaller entry point]."
EMAIL: "Understood on budget — is this a Q3/Q4 conversation, or not on the radar until [year]?
        We can sometimes structure a limited pilot that fits a different budget bucket.
        Either way, worth keeping in touch?"

"Your competitor is cheaper"
VOICE: "They probably are. Can I ask — are you getting [specific outcome] with them today?
        Most teams that switch to us do it because [1 concrete difference], not price."
EMAIL: "You're right that [Competitor] is priced differently.
        The teams that move to us usually do it because [specific gap in competitor].
        Is [gap] something you're dealing with? If not, they might genuinely be the better fit for you."

── COMPETITOR OBJECTIONS ───────────────────────────────────────────────────

"We already use [Competitor]"
VOICE: "Good to know — are you happy with how it's working, or is there anything you wish it did better?"
EMAIL: "Makes sense — [Competitor] does solid work in [area]. Most teams that add us use both
        because [Competitor] handles [X] but doesn't cover [Y]. Is [Y] something you're dealing with?"

"We built this internally"
VOICE: "Impressive — what did you build? I'm curious whether you're covering [specific gap]."
EMAIL: "Interesting — internal tools are often a great fit for the core use case.
        The reason teams like yours still talk to us is usually around [maintenance burden / scale / new use cases].
        Is any of that relevant, or are you fully covered?"

"We tried something similar and it didn't work"
VOICE: "That's good context — what happened? Because that shapes whether we're actually different 
        or just another version of the same problem."
EMAIL: "That's useful to know — failed implementations usually come down to [setup / adoption / wrong use case].
        Can I ask what broke? Because if it's the same root issue, I'd rather tell you now than waste your time."

── TIMING OBJECTIONS ───────────────────────────────────────────────────────

"Not a good time — we're busy"
VOICE: "Totally understand. When's realistic — next week, or is this more of a next-quarter conversation?"
       (Give them two options — open-ended "whenever" never gets scheduled)
EMAIL: "Understood — timing matters. Would [specific month] be worth revisiting,
        or should I check back later in the year? Happy to do whichever is more useful."

"We're in a budget freeze"
VOICE: "Got it — when does the freeze lift? And is this something you'd want to look at when it does?"
EMAIL: "Budget freezes are real — when does the window open up?
        I can set a reminder for [specific month] and reach out then, rather than clogging your inbox now."

"We just signed with someone else"
VOICE: "Congrats — that's a big decision. Out of curiosity, what sold you on them?
        And what would need to change for you to reconsider in 12 months?"
        (Gather competitive intel. Plant a seed. Move on.)
EMAIL: No email — accept gracefully and set a CRM reminder for contract renewal date.

── RELEVANCE OBJECTIONS ────────────────────────────────────────────────────

"We're different / this doesn't apply"
VOICE: "Fair — how do you handle [specific use case] today? Because sometimes it looks different on
        the surface but the underlying problem is similar."
EMAIL: "You may well be right — can I ask: how does your team currently handle [specific process]?
        If you've got it solved, I won't waste your time. If there's a gap, worth 15 minutes."

"We do this manually and it works"
VOICE: "How long does it take per week? Because if it's genuinely fast, we're probably not a fit.
        But if it's taking [X hours], that's usually where the conversation gets interesting."
EMAIL: "Manual works until it doesn't — what's the volume today and where's the ceiling?
        Most teams talk to us when they hit a scale or accuracy problem. 
        If you're nowhere near that, we're probably not relevant yet."

── TRUST OBJECTIONS ────────────────────────────────────────────────────────

"Never heard of you"
VOICE: "Fair — we're [stage: early-stage / growing fast / 3 years old].
        You might know [well-known customer] — they use us for [X].
        Worth 15 minutes to see if what they're doing translates to your situation?"
EMAIL: "Totally understandable — we're newer to [their world].
        [Customer name] and [Customer name] use us for [outcome]. I can share a brief case study.
        If it resonates, worth a call — if not, I'll stop bothering you."

"I need to do more research first"
VOICE: "What would the research uncover that would help you decide?
        Because I can usually answer that faster on a call than a Google search."
EMAIL: "Makes sense — what specifically are you trying to understand?
        I can send a pointed answer to that question rather than a generic overview deck."

"Send me a case study first"
VOICE: "Happy to — what would make the case study useful? So I send the right one —
        are you more interested in [outcome A] or [outcome B]?"
EMAIL: "Sending now — here's the most relevant one for [their industry/size]:
        [Link]. One thing worth noting: [specific insight that applies to them].
        Happy to unpack it on a call once you've had a chance to read."

── GATEKEEPER OBJECTIONS ───────────────────────────────────────────────────

"What is this regarding?"
VOICE: "I'm reaching out about [specific topic] for [decision-maker's name].
        It's related to [their trigger — e.g. the Series D they just announced].
        Is [name] the right person to speak with about that?"
(Never say "sales call" — say "a specific question about [topic]")

"They don't take cold calls"
VOICE: "I understand. Is there a better way to get their attention — 
        email or someone on their team I should speak with first?"
(The goal: get an email address or a warm intro, not push past the gatekeeper)

"Leave a voicemail"
VOICE: Accept it gracefully. Leave a tight 20-second voicemail.
Do not try to argue your way past.
```

### Stress-test your pitch (red-team mode)

```
Play devil's advocate. You are a sceptical VP at [COMPANY] who has heard 100 pitches this year.

My pitch: "[paste your current pitch or value prop]"

Generate:
1. The 5 hardest objections this VP would raise — in their words (not generic)
2. For each: what a weak response sounds like (what most SDRs say)
3. What a strong response sounds like

This is for training — be brutally honest.
```

### Objection pattern analysis (from call transcripts)

```
Analyse these [N] call transcripts and identify objection patterns.

[PASTE TRANSCRIPTS]

Output:
1. Top 5 most common objections (ranked by frequency)
2. For each: how the team is currently handling it (A/B/C/D grade average)
3. The one objection where the team is consistently losing deals
4. Recommended: objection drill script for next team training session
5. "Win pattern": what do reps say when they overcome the objection successfully?
```

## Example

**User:** I just hit "We already use Salesforce and it does everything we need." I sell a sales engagement platform.

**Output:**

**Intent:** Competitor objection with embedded "relevance" layer — they think Salesforce replaces you, not complements you. This is a very common misalignment.

**Voice response (27 seconds):**
"Salesforce is great — love that you're already in it. We actually sit on top of Salesforce, not alongside it. What we do is the sequencing and engagement layer Salesforce doesn't have natively — automating the outreach cadence, tracking opens and replies, and routing hot leads back into Salesforce automatically. Curious — how are your reps managing their outreach sequences today? In Salesforce directly, or something else?"

**What NOT to say:**
- "Salesforce is actually not as good as people think for engagement" (defensive)
- "Oh, but do you know all the features we have?" (feature dump)
- "We're completely different from Salesforce" (confusing — they just said Salesforce does it all)

**Email version:**
> "Salesforce as the CRM backbone makes total sense — we actually live inside Salesforce, not alongside it.
>
> What we add is the engagement and sequencing layer it doesn't do natively: automated multi-step cadences, reply detection, and lead routing triggered by engagement signals — all writing back to Salesforce automatically.
>
> Most teams that talk to us are using Salesforce + either Outreach or a manual process. Curious which camp you're in — worth 15 minutes to show you what teams your size do with the combination?"

---
