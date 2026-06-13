---
name: "sdr-agent"
description: "AI SDR agent patterns: prospect research, personalised outreach, multi-step sequences, reply handling, meeting booking — with safety limits"
---

# SDR Agent Skill

## When to activate
- Building an AI-powered sales development workflow
- Automating prospect research and outreach message generation
- Setting up multi-touch email/LinkedIn sequences with Claude
- Personalising outreach at scale (not template swapping — actual context)
- Adding safety limits and human approval gates to outreach automation

## When NOT to use
- Spam campaigns — volume without personalisation kills deliverability and reputation
- LinkedIn automation without understanding connection limits (100-200/week max)
- Replacing human relationship-building on strategic accounts
- Regulated industries with strict communication compliance requirements

## Instructions

### The SDR agent loop

```
Step 1: RESEARCH     — gather company/contact context
Step 2: QUALIFY      — score against ICP (Ideal Customer Profile)  
Step 3: PERSONALISE  — generate message with genuine context
Step 4: HUMAN GATE   — show draft, get approval (for first outreach)
Step 5: SEND         — deliver via email/LinkedIn
Step 6: TRACK        — log activity, handle replies
Step 7: FOLLOW UP    — sequence next touch if no reply
```

### Prospect research (before writing a single word)

```typescript
interface ProspectContext {
  name: string
  title: string
  company: string
  recentNews: string[]       // funding, product launches, exec hires
  linkedInActivity: string[] // recent posts, comments
  techStack: string[]        // from BuiltWith, LinkedIn job posts
  painPoints: string[]       // inferred from context
  icpScore: number           // 0-100
}

async function researchProspect(email: string): Promise<ProspectContext> {
  const [contact, company, news] = await Promise.all([
    enrichContactFromEmail(email),          // Clearbit/Apollo/Hunter
    enrichCompanyFromDomain(getDomain(email)),
    searchRecentNews(company.name),         // funding, hires, product news
  ])

  const icpScore = scoreICP(contact, company)
  const painPoints = await inferPainPoints(company, contact.title)

  return { ...contact, ...company, recentNews: news, icpScore, painPoints }
}
```

### ICP scoring

```typescript
interface ICPCriteria {
  companySize: [number, number]  // [min, max] employees
  industries: string[]
  titles: string[]               // decision-maker roles
  techStack: string[]            // tools they use
  geographies: string[]
}

function scoreICP(contact: Contact, company: Company, criteria: ICPCriteria): number {
  let score = 0

  // Company size (30 points)
  const [min, max] = criteria.companySize
  if (company.employees >= min && company.employees <= max) score += 30

  // Industry match (25 points)
  if (criteria.industries.some(i => company.industry.toLowerCase().includes(i))) score += 25

  // Title/seniority (25 points)
  if (criteria.titles.some(t => contact.title.toLowerCase().includes(t))) score += 25

  // Tech stack overlap (20 points)
  const overlap = criteria.techStack.filter(t => company.techStack.includes(t))
  score += Math.min(20, overlap.length * 5)

  return score
}
```

### Personalised message generation

The key difference between AI spam and genuine personalisation is **specificity**. Claude generates messages that reference exactly what makes this prospect relevant right now.

```typescript
async function generateOutreachMessage(
  prospect: ProspectContext,
  sender: SenderContext,
  template: MessageTemplate
): Promise<string> {
  const prompt = `Write a cold outreach email from ${sender.name} at ${sender.company} to ${prospect.name}.

Context about ${prospect.name}:
- Title: ${prospect.title} at ${prospect.company}
- Recent company news: ${prospect.recentNews.slice(0, 2).join('; ')}
- Their likely pain points: ${prospect.painPoints.join(', ')}
- Why we're relevant: ${template.valueProposition}

Rules:
- Reference ONE specific recent event or achievement (not generic flattery)
- State the value in 1 sentence — what specific outcome we deliver
- Clear, low-friction CTA: "15-minute call this week?" not "I'd love to connect"
- Total length: 5-7 sentences MAX
- No buzzwords: no "synergies", "leverage", "circle back", "reach out"
- First line must NOT start with "I" or "My name is"
- Do not mention competitors

Output: just the email body, no subject line.`

  const { text } = await generateText({ model: anthropic('claude-opus-4-7'), prompt })
  return text
}
```

### Multi-step sequence design

```typescript
const SEQUENCE: SequenceStep[] = [
  {
    day: 0,
    channel: 'email',
    type: 'initial',
    subject: '{{personalised_hook}}',
    waitForReply: true,
  },
  {
    day: 3,
    channel: 'linkedin',
    type: 'connection',
    message: 'Short note referencing the email — 2 sentences max',
    waitForReply: true,
  },
  {
    day: 7,
    channel: 'email',
    type: 'followup_1',
    subject: 'Re: {{original_subject}}',
    message: 'Add a new piece of value — case study, relevant data point',
    waitForReply: true,
  },
  {
    day: 14,
    channel: 'email',
    type: 'breakup',
    subject: 'Closing the loop',
    message: 'Acknowledge they\'re busy. Leave door open. No guilt.',
    waitForReply: false,
  },
]
```

### Safety limits and compliance

```typescript
const SAFETY_LIMITS = {
  linkedInConnectionsPerWeek: 100,    // LinkedIn's soft limit (SSI-score dependent)
  emailsPerDay: 50,                   // per domain, to avoid spam flagging
  minDelayBetweenMessages: 30_000,    // 30 seconds minimum
  maxFollowUps: 3,                    // never more than 4 total touches
  blacklistDomains: [                 // never contact
    'competitor.com',
    'investor.com',
  ],
  requireHumanApproval: true,         // show draft before first send
}

function checkSafetyLimits(prospect: ProspectContext): SafetyResult {
  if (SAFETY_LIMITS.blacklistDomains.includes(getDomain(prospect.email))) {
    return { allowed: false, reason: 'Domain blacklisted' }
  }
  // Check daily send count, weekly LinkedIn count, etc.
  return { allowed: true }
}
```

### Human approval gate

```typescript
async function requestApproval(draft: OutreachDraft): Promise<boolean> {
  console.log('\n=== OUTREACH DRAFT FOR APPROVAL ===')
  console.log(`To:      ${draft.prospect.name} <${draft.prospect.email}>`)
  console.log(`Company: ${draft.prospect.company}`)
  console.log(`Score:   ${draft.prospect.icpScore}/100`)
  console.log(`\nSubject: ${draft.subject}`)
  console.log(`\n${draft.body}`)
  console.log('\nApprove? (y/n/edit): ')

  // In a CLI context, prompt the user
  // In a web app, show in a review dashboard
  const response = await getUserInput()
  return response.toLowerCase() === 'y'
}
```

### Reply handling

```typescript
async function handleReply(reply: EmailReply): Promise<void> {
  const intent = await classifyReply(reply.body)

  switch (intent) {
    case 'interested':
      await bookMeeting(reply.from, reply.threadId)
      await updateCRM(reply.from, { status: 'meeting_booked' })
      break
    case 'not_now':
      await scheduleFutureFollowUp(reply.from, days: 90)
      break
    case 'not_interested':
      await markAsOptedOut(reply.from)
      break
    case 'referral':
      const referredContact = await extractReferral(reply.body)
      await addToSequence(referredContact)
      break
  }
}

async function classifyReply(body: string): Promise<ReplyIntent> {
  const { object } = await generateObject({
    model: anthropic('claude-opus-4-7'),
    schema: z.object({ intent: z.enum(['interested', 'not_now', 'not_interested', 'referral', 'question', 'other']) }),
    prompt: `Classify this email reply intent: "${body}"`,
  })
  return object.intent
}
```

## Example

**User:** Build an SDR agent that takes a list of startup founders (name + LinkedIn URL), researches each one, generates a personalised cold email about our product (a B2B analytics tool), and shows me the drafts for approval before sending.

**Expected output:**
- `src/sdr/research.ts` — `researchProspect()` pulling from LinkedIn, Clearbit
- `src/sdr/qualify.ts` — `scoreICP()` against startup founder criteria
- `src/sdr/generate.ts` — `generateOutreachEmail()` with Claude, referencing recent activity
- `src/sdr/approve.ts` — CLI approval loop showing draft + prospect context
- `src/sdr/send.ts` — sends via SendGrid/Resend on approval, logs to HubSpot
- Safety: checks blacklist, respects 50/day email limit, requires approval

---
