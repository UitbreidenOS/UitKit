---
name: email-automation
description: "Multi-step outreach email sequences: personalised touchpoints, reply detection routing, follow-up cadence, meeting booking integration, deliverability patterns"
updated: 2026-06-13
---

# Email Automation Skill

## When to activate
- Designing a cold outreach sequence (3-5 touchpoints)
- Writing follow-up emails that feel personal, not automated
- Setting up reply detection logic (interested / not now / unsubscribe)
- Integrating email sequences with calendar booking (Calendly, Cal.com)
- Reviewing deliverability patterns (spam avoidance, domain warm-up)

## When NOT to use
- Mass newsletter sends — use Mailchimp/Klaviyo directly
- Transactional emails (receipts, confirmations) — handled by your platform
- Existing customers who didn't opt into outreach — GDPR/CAN-SPAM risk

## Instructions

### Design a 4-touch outreach sequence

```typescript
// Sequence design prompt:
// Day 0: Initial outreach (personal, specific)
// Day 3: Follow-up 1 (add value — resource, insight, data)
// Day 7: Follow-up 2 (different angle or channel)
// Day 14: Breakup email (respectful close, door open)

const sequence: EmailStep[] = [
  { day: 0,  subject: '{{personalised_hook}}',    type: 'initial' },
  { day: 3,  subject: 'Re: {{original_subject}}', type: 'followup_value' },
  { day: 7,  subject: 'Re: {{original_subject}}', type: 'followup_angle' },
  { day: 14, subject: 'Closing the loop',          type: 'breakup' },
]
```

### Writing each email type

**Initial (Day 0) — specific, short, human:**
```
Write the Day 0 email for a cold outreach sequence.
Sender: [name, company, what we do]
Prospect: [name, title, company, one specific thing about them]
Goal: book a 15-minute call
Max length: 5-6 sentences
Rules: reference something specific (recent news, post, role change), 
       state value in one sentence, soft CTA ("open to a quick call?")
```

**Follow-up 1 (Day 3) — add genuine value:**
```
Write the Day 3 follow-up.
Add value with: [a relevant case study / stat / resource / insight]
Reference: the original email (keep it brief)
CTA: same as Day 0, re-framed
Length: 4-5 sentences
```

**Breakup email (Day 14) — close gracefully:**
```
Write the Day 14 breakup email.
Tone: understanding, not passive-aggressive
Leave the door open: "if timing changes / relevant later"
No guilt, no "I've tried to reach you X times"
Length: 3 sentences max
```

### Reply handling logic

```typescript
async function handleReply(reply: EmailReply) {
  const intent = await classifyIntent(reply.body)
  // intent: 'interested' | 'not_now' | 'not_interested' | 'question' | 'referral'
  
  switch (intent) {
    case 'interested':
      return bookMeeting(reply.from, reply.threadId)
    case 'not_now':
      return scheduleFutureTouch(reply.from, daysFromNow: 90)
    case 'not_interested':
      return markOptedOut(reply.from)
    case 'referral':
      const referred = extractReferredContact(reply.body)
      return addToSequence(referred)
  }
}
```

### Meeting booking integration

```typescript
// Append to every CTA email — always use a direct booking link
const BOOKING_FOOTER = `
If a call sounds useful, here's my calendar: {{calendly_link}}
Or just reply and I'll send over a time that works.
`

// Cal.com API — check availability before sending
const slots = await cal.availability.get({
  username: 'your-username',
  dateFrom: addDays(new Date(), 1),
  dateTo: addDays(new Date(), 7),
})
```

### Deliverability rules

```typescript
const SENDING_RULES = {
  maxPerDay: 50,              // per sending domain
  minDelayBetweenEmails: 90,  // seconds — avoid bulk patterns
  warmUpNewDomain: true,      // start at 10/day, increase 10% daily
  spfDkimRequired: true,      // check before first send
  unsubscribeLink: true,      // required for CAN-SPAM/GDPR
  plainTextVersion: true,     // improves deliverability
  avoidSpamTriggers: [        // never use these in subject lines
    'free', 'guarantee', 'no risk', 'click here',
    'make money', 'earn cash', '!!!',
  ],
}
```

### Personalisation patterns that 3x reply rates

```
// Research before writing — find ONE specific thing:
// - Recent company news (funding, product launch, hiring)
// - Recent LinkedIn post or comment they made
// - Mutual connection or shared background
// - Role change in last 6 months
// - Competitor they just replaced or a tool they mentioned

// Bad (template swap): "I noticed you're the [Title] at [Company]"
// Good (genuine): "Saw your post about moving from Postgres to Neon — 
//                  the branching feature you mentioned is exactly why 
//                  we built [X]"
```

## Example

**Context:** B2B SaaS selling a project management tool. Prospect is a VP of Engineering who recently posted about struggling with cross-team visibility.

**Day 0:**
> Subject: Cross-team visibility on large projects
>
> Saw your LinkedIn post about the visibility problem across squads — we hear this a lot from VPs at your scale.
>
> We built [Product] specifically for that: one view of every team's progress without the status meeting overhead. [Company X] cut their weekly syncs from 4 to 1 after switching.
>
> Worth 15 minutes to show you how it works?

**Day 3:**
> Subject: Re: Cross-team visibility on large projects
>
> Attaching a 2-minute breakdown of how [Company X] (similar scale to yours) restructured their visibility layer — might be relevant given what you described.
>
> Still happy to walk through it live if useful — same link: [calendar]

---
