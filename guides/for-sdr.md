# Claude for SDRs

Everything a Sales Development Representative needs to run AI-augmented prospecting, outreach, reply handling, and pipeline management in Claude Code.

---

## Who this is for

You are an SDR, BDR, or sales rep whose job is to generate qualified pipeline — finding the right accounts, reaching out, booking meetings, and handing off to AEs. You spend too much time on research, email writing, and inbox triage. Claude Code cuts that by 30-40x.

**Before Claude Code:** 20 minutes per account researched. 15 minutes per personalised email. 2-4 hours a day in inbox. Manual CRM updates after every call.

**After:** Full account brief in 30 seconds. Personalised email in 30 seconds. Inbox triaged and responses drafted in 8 minutes. CRM updated automatically from call transcripts.

---

## 30-second install

```bash
# Install all SDR skills, agents, and workflows
npx claudient add skills gtm
npx claudient add agents roles/sdr-agent

# Or cherry-pick what you need:
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/sdr-agent
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
```

---

## Your Claude Code SDR stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/sdr-research-brief` | 30-second account dossier with triggers, ICP score, stakeholder map | Before any outreach |
| `/sdr-agent` | End-to-end SDR workflow — research → draft → approve → send → log | Full pipeline sessions |
| `/sdr-reply-classifier` | Triage inbox: classify intent, draft response, update CRM | Twice a day inbox check |
| `/sdr-call-prep` | Talk tracks, objection scripts, discovery questions for any call | 30 min before calling |
| `/sdr-call-analysis` | Post-call transcript → CRM note + coaching feedback + follow-up | After every call |
| `/sdr-objection-handler` | Dynamic objection rebuttal for price, competitor, timing, trust | On demand, any channel |
| `/sdr-territory-mapper` | Whitespace analysis, priority accounts, territory plan | Weekly/quarterly planning |
| `/sdr-lead-scorer` | ICP fit scoring 0-100 with tier and recommended action | Prioritising lead lists |
| `/email-automation` | Multi-step sequence design, deliverability, reply routing | Building new sequences |
| `/lead-enrichment` | Apollo/Clearbit/Firecrawl pipeline to enrich and score leads | Bulk enrichment |
| `/crm-hygiene` | HubSpot/Salesforce cleanup, dedup, stale contacts, ownership | Monthly CRM health |
| `/hubspot` | Native HubSpot CRM access — read/write contacts, deals, notes | Direct CRM work |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `sdr-agent` | Opus (research) / Sonnet (drafts) | Full research-to-outreach sessions |
| `market-researcher` | Sonnet | Deep account or market research |
| `competitive-analyst` | Sonnet | Competitor intelligence for objection prep |

---

## Daily workflow

### Morning (30-60 minutes)

**1. Territory brief — what to focus on today**
```
/sdr-territory-mapper

Show me today's priority accounts:
- Which A-tier accounts haven't been contacted yet?
- Any new trigger signals on accounts in my pipeline?
- Which sequences are on Day 3 or Day 7 (need follow-up today)?
```

**2. Lead scoring — new leads from overnight**
```
/sdr-lead-scorer

[Paste any new inbound leads, event signups, or Apollo exports]

Score against ICP and give me the A-tier list to call today.
```

**3. Outreach batch — research + draft for today's targets**
```
/sdr-agent

Research and draft personalised outreach for:
1. [Company 1] — contact: [Name, Title]
2. [Company 2] — contact: [Name, Title]
3. [Company 3] — contact: [Name, Title]

My product: [one line]
My ICP: [definition]
Show me all drafts for review before scheduling.
```

---

### Midday (15-20 minutes)

**4. Inbox triage — reply classification**
```
/sdr-reply-classifier

Here are my replies from this morning:

Reply 1 (from: name@company.com):
[paste reply]

Reply 2 (from: name@company.com):
[paste reply]

Classify each, draft responses for interested/objection replies,
update CRM, notify me of any hot leads.
```

---

### Pre-call (2-5 minutes)

**5. Call prep — any call in the next hour**
```
/sdr-call-prep

Name: [prospect name]
Title: [title]
Company: [company]
Call type: [cold / follow-up / discovery]
Goal: [book 20-min discovery]
My product: [one line]
Recent trigger: [what you know about them]

Give me: opening script, talk track, top 3 objections + responses, voicemail.
```

---

### Post-call (2-5 minutes)

**6. Call analysis — log and learn**
```
/sdr-call-analysis

[Paste call transcript or notes]

Prospect: [name, title, company]
Call type: cold call
Goal: book discovery meeting
Outcome: [what happened]

Extract: CRM note, next step, objections raised, coaching feedback, follow-up email draft.
```

---

### Weekly (Friday — 30 minutes)

**7. Territory review and pipeline report**
```
/sdr-territory-mapper

Weekly review:
- Meetings booked this week: [N]
- Sequences launched: [N]
- Replies received: [N]
- Whitespace remaining: [N]

Show me: which accounts to prioritise next week, any triggers I missed,
and whether I'm on track for my monthly meeting quota.
```

---

## 30-day ramp plan (new SDRs)

### Week 1 — Setup and research mastery
- Install all SDR skills via `npx claudient add skills gtm`
- Configure HubSpot MCP (see `/hubspot` skill for setup)
- Run `/sdr-territory-mapper` on your initial account list
- Score 50+ accounts with `/sdr-lead-scorer` — get familiar with your ICP
- Read: `/sdr-objection-handler` full library before your first call

### Week 2 — Outreach launch
- Use `/sdr-research-brief` for every account before first contact
- Draft first 20 emails with `/sdr-agent` — review each one carefully
- Start tracking: time per email (target: under 5 minutes with Claude)
- Use `/sdr-call-prep` for every cold call — no winging it

### Week 3 — Reply handling and call analysis
- Run `/sdr-reply-classifier` on every reply — don't manually sort
- Record every call, run `/sdr-call-analysis` on the transcript
- Compare your objection handling to the playbook — identify the 1 objection you keep losing
- Use `/sdr-objection-handler` to drill the objections you're weakest on

### Week 4 — Optimisation
- Run your first territory planning session with `/sdr-territory-mapper`
- Review all call analyses — what patterns are emerging?
- Identify your best-performing email hooks (highest reply rate) and build variants
- Report to your manager with data from your CRM

---

## Tool integrations

### HubSpot (recommended CRM)

```json
// Add to ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

With this connected, Claude can:
- Read and write contacts, companies, deals, and notes
- Update lifecycle stages and owner assignments
- Create follow-up tasks from call analysis
- Run CRM hygiene on your territory

### Gmail / Outlook
Use Claude Code to draft emails → paste into your email client → send.
For automated sending, integrate via n8n or Make with the Gmail node.

### Apollo.io / Seamless.ai
Export leads as CSV → paste into `/sdr-lead-scorer` → get a prioritised list.
For real-time enrichment, use the `/lead-enrichment` skill with the Apollo API.

### Gong / Aircall / Fireflies
Get call transcript → paste into `/sdr-call-analysis` → extract CRM note, coaching, follow-up.
For automated post-call analysis, set up a webhook that triggers `/sdr-call-analysis` when a recording is ready.

### n8n (automation orchestration)
```
Automate the full loop:
- New inbound lead → /sdr-lead-scorer → route to SDR or nurture
- New reply received → /sdr-reply-classifier → draft + Slack alert
- Call completed → transcript → /sdr-call-analysis → HubSpot update
```

---

## Metrics to track

Use Claude Code to pull these from HubSpot weekly:

| Metric | Target (early stage) | Target (ramped SDR) |
|---|---|---|
| Accounts researched/day | 10 | 20 |
| Outreach emails sent/week | 50 | 150 |
| Reply rate | >5% | >8% |
| Positive reply rate | >1.5% | >3% |
| Meetings booked/week | 3-5 | 8-12 |
| Call-to-meeting rate | 5% | 10% |
| Time per account (research + draft) | <10 min | <5 min |
| CRM update rate | 90% | 100% |

---

## Common mistakes (and how Claude Code helps avoid them)

**Mistake 1: Sending generic outreach**
Claude Code forces you to research a trigger before drafting. No trigger = no email.

**Mistake 2: Not logging calls in CRM**
`/sdr-call-analysis` generates the CRM note for you — paste and you're done.

**Mistake 3: Bad objection handling**
`/sdr-objection-handler` has 20+ scripts. Run them before every call. Drill the ones you miss.

**Mistake 4: Contacting opted-out prospects**
`/crm-hygiene` keeps your CRM clean. Always check before adding to a sequence.

**Mistake 5: Focusing on the wrong accounts**
`/sdr-territory-mapper` and `/sdr-lead-scorer` prioritise for you. Work the A-tier first.

---

## Resources

- [Getting started with Claude Code](../getting-started.md)
- [HubSpot MCP setup](../mcp/hubspot.md)
- [SDR daily workflow](../workflows/sdr-daily.md)
- [Email sequences guide](../skills/gtm/email-automation.md)
- [Objection handling full library](../skills/gtm/sdr-objection-handler.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
