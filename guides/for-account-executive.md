# Claude for Account Executives

Everything an Account Executive needs to run AI-augmented deal management — deal reviews, mutual success plans, champion development, RFP responses, competitive positioning, and forecast management.

---

## Who this is for

You are an Account Executive (AE) managing a pipeline of mid-market or enterprise deals. Your day is deal reviews, customer calls, champion management, proposal writing, negotiation, and forecast calls with your manager. You spend too much time on process administration — building slides for deal reviews, reformatting RFP responses, manually scoring MEDDPICC, and writing follow-up emails after calls. Claude Code handles the process so you can focus on the activity that actually closes deals: talking to buyers.

**Before Claude Code:** 45 minutes to prep a deal review slide. 2 hours to draft an RFP response section. 30 minutes to write a mutual success plan from scratch. Manual MEDDPICC scoring that's always out of date.

**After:** Deal review in 15 minutes with MEDDPICC scored and risk flags surfaced. RFP response section in 10 minutes. Mutual success plan draft in 20 minutes. Champion enablement package in 15 minutes.

---

## 30-second install

```bash
# Install all AE skills
npx claudient add skills gtm

# Or cherry-pick:
npx claudient add skill gtm/deal-review
npx claudient add skill gtm/champion-builder
npx claudient add skill gtm/mutual-success-plan
npx claudient add skill gtm/deal-desk
npx claudient add skill gtm/rfp-responder
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
npx claudient add skill gtm/revenue-operations
npx claudient add agents advisors/cro-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Your Claude Code AE stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/deal-review` | MEDDPICC scoring, risk flags, forecast category, next steps | Weekly pipeline review, before manager call |
| `/champion-builder` | Champion identification, enablement package, re-engagement scripts | When champion is weak or gone quiet |
| `/mutual-success-plan` | Joint close plan: milestones, stakeholders, mutual commitments | Late-stage deals (Evaluation → Negotiation) |
| `/deal-desk` | Deal structuring, discount approval, contract terms review | Complex terms, non-standard pricing |
| `/rfp-responder` | RFP/RFI response sections, compliance matrices, executive summaries | Any RFP/RFI received |
| `/commercial-forecaster` | Pipeline and forecast analysis, deal scoring, revenue projections | Weekly forecast calls |
| `/crm-hygiene` | Contact/deal cleanup, stale pipeline audit, dedup | Monthly CRM health |
| `/hubspot` | Direct HubSpot CRM read/write | Logging notes, updating deal stages |
| `/revenue-operations` | Pipeline metrics, stage conversion rates, ARR analysis | QBRs, territory planning |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `cro-advisor` | Opus | Complex multi-stakeholder deals, negotiation strategy, objection handling at exec level |
| `competitive-analyst` | Sonnet | Real-time competitive intelligence, positioning against named competitors |

---

## Daily workflow

### Morning — Pipeline review (15-30 minutes)

**1. Priority deal identification:**
```
/commercial-forecaster

Morning pipeline review. Show me:
- Which deals are in Commit this week?
- Which Commit deals have the highest risk (MEDDPICC gaps, slipped close date)?
- Which Best Case deals have moved forward or backward in the last 7 days?
- Any deals I haven't touched in 14+ days?

CRM data: [paste your open pipeline from HubSpot/Salesforce, or connect via MCP]
```

**2. Deal review for this week's manager call:**
```
/deal-review

MEDDPICC review for [deal name].

Company: [name]
Deal size: $[ACV]
Stage: [stage]
Close date: [date]

[paste your discovery notes, email threads, or meeting notes]

Score each MEDDPICC dimension, surface the top 3 risks, and recommend a forecast category.
```

---

### Active deal work (the bulk of your day)

**3. Champion development:**
```
/champion-builder

Assess [contact name] as a champion for [deal].

Interactions so far: [summary of meetings and emails]
Champion tests: [what evidence do you have for each of the 4 tests?]

Tell me:
- Is this person a strong champion, a passive contact, or a coach?
- What evidence supports the assessment?
- What specific action should I take today to strengthen or find a better champion?
```

**4. Mutual success plan (late-stage deals):**
```
/mutual-success-plan

Create a mutual success plan for [deal].

Buyer: [company], Champion: [name/title], Economic buyer: [name/title]
Deal size: $[ACV], Target close: [date]
Current stage: Evaluation → Negotiation transition
Remaining steps before signature: [what you know is left]

Produce a complete MSP document I can share with the champion today.
Include: success definition, milestone table, mutual commitments, risk register.
```

**5. RFP response:**
```
/rfp-responder

Respond to this RFP section.

RFP question: [paste the question]
Our product: [one paragraph description]
Our differentiators for this buyer: [specific to this account and their criteria]
Word limit: [if specified]

Write a response that answers directly, demonstrates fit, and doesn't use filler phrases.
```

---

### Post-call — Logging and follow-up (10-15 minutes)

**6. Call debrief and CRM update:**
```
I just got off a call with [name, title] at [company].

Key takeaways:
[bullet points of what was discussed — take 2 minutes of rough notes immediately after the call]

Produce:
1. A CRM note (3-4 paragraphs — what was discussed, what we learned, next steps agreed)
2. A follow-up email to send today
3. MEDDPICC update: which dimensions changed based on what I heard?
4. The single most important thing I need to do before the next call with this account

/hubspot — Log the CRM note to [contact name] at [company].
```

---

### End of week — Forecast and pipeline hygiene

**7. Forecast preparation:**
```
/commercial-forecaster

Prepare my weekly forecast.

My deals:
[paste your pipeline list with stage, ACV, close date, and current forecast category]

For each Commit deal: score confidence 1-10 with reasoning.
For each Best Case deal: what would need to happen to move to Commit this week?
For any deal I should remove from the forecast: flag it.

My weekly quota: $[X] in new ARR.
```

**8. Pipeline hygiene:**
```
/crm-hygiene

Audit my pipeline for stale and inaccurate data.

My open pipeline: [paste deal list with last activity date, stage, close date]

Flag:
- Deals with close date in the past that aren't Closed Won or Lost
- Deals with no activity in 30+ days (per stage norms: Discovery >30 days, Evaluation >45 days)
- Deals where stage doesn't match MEDDPICC score
- Duplicate contact or company records

For each stale deal: recommend action — update / deactivate / investigate.
```

---

## 30-day ramp plan (new AEs or joining a new segment)

### Week 1 — Setup and deal inventory
- Install all GTM skills: `npx claudient add skills gtm`
- Connect HubSpot via MCP (see tool integrations below)
- Run `/deal-review` on every deal in your inherited pipeline — get a baseline MEDDPICC score
- Run `/commercial-forecaster` on your full pipeline — identify which deals are real vs. stale

### Week 2 — Discovery and champion development
- Run `/champion-builder` assessment on your top 3 deals — who is your actual champion?
- Use `/cro-advisor` agent for your highest-value deal — get a strategy for each MEDDPICC gap
- Shadow or review RFP responses for your product using `/rfp-responder` for practice
- Set up your deal review template so prep before manager calls takes under 15 minutes

### Week 3 — Late-stage and close mechanics
- Use `/mutual-success-plan` for every deal in Evaluation or later — create a close plan
- Run `/deal-desk` on any deal with non-standard terms — understand your discount authority
- Practice `/competitive-analyst` for your top 2-3 named competitors — know how to win the comparison
- Review your forecast accuracy from weeks 1-2 vs. actual outcomes

### Week 4 — Optimisation and reporting
- QBR prep: use `/revenue-operations` to pull your pipeline metrics and conversion rates
- Identify your weakest MEDDPICC dimension across all deals — which one kills your deals most often?
- Use `/crm-hygiene` to clean up the pipeline you've inherited — remove dead deals, update stages
- Run a champion assessment on every active deal — map where you're exposed

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

With HubSpot MCP connected:
- Log call notes directly: `Claude, log this call note to [contact] at [company] in HubSpot`
- Update deal stage: `Move [deal name] to Negotiation in HubSpot`
- Pull open pipeline: `Get all my open deals in HubSpot, include stage, ACV, and close date`
- Create follow-up task: `Create a HubSpot task for me to follow up with [contact] on [date]`

### Gong / Chorus (call recording)

Paste call transcripts into Claude Code for:
- Post-call MEDDPICC update
- Follow-up email drafting
- Champion assessment update based on what you heard
- CRM note generation

```
Here is the transcript from my call with [contact] at [company]:
[paste Gong transcript]

Extract:
1. What MEDDPICC dimensions were confirmed or updated
2. Any red flags I should flag to my manager
3. The follow-up email to send today
4. The CRM note to log
```

### Salesforce

Paste Salesforce opportunity data into any `/deal-review` or `/commercial-forecaster` prompt. For direct Salesforce integration, configure the Salesforce MCP server if available in your stack.

### DocuSign / PandaDoc (contract management)

Use `/deal-desk` to review commercial terms before sending to legal. Paste the key clauses into `/deal-desk` for a risk assessment before the final sign-off.

### Slack (deal room channels)

For large deals, maintain a `#deal-[company]` Slack channel. Paste updates from that channel into `/deal-review` for a rapid deal health check before a manager call.

---

## Metrics to track

Pull these from HubSpot or Salesforce weekly using `/revenue-operations`:

| Metric | Target (ramping AE) | Target (full quota) |
|---|---|---|
| Deals with complete MEDDPICC | >80% of active pipeline | 100% |
| MSP in place for late-stage deals | >90% of Evaluation+ | 100% |
| Forecast accuracy (Commit → Won) | >60% | >80% |
| Average deal cycle time | Track vs. team average | At or below team average |
| Close rate (Evaluation → Won) | Track vs. cohort | At or above cohort |
| Activity per deal per week | 2+ meaningful touches | 2+ meaningful touches |
| Pipeline coverage (vs. quota) | 3x | 4x |
| CRM update rate (notes logged) | 90% within 24h | 100% |

---

## Common mistakes (and how Claude Code helps avoid them)

**Mistake 1: Advancing deals without a confirmed economic buyer**
`/deal-review` flags a missing economic buyer as a Critical MEDDPICC gap. It won't let you call a deal Commit without it.

**Mistake 2: Treating a passive contact as a champion**
`/champion-builder` runs the four champion tests. A contact who hasn't given you access to the economic buyer is a coach, not a champion. The skill tells you this explicitly.

**Mistake 3: Building a mutual success plan the buyer never sees**
An MSP only works if both parties agree to it. The skill includes an email template to send it to your champion for review before the economic buyer sees it.

**Mistake 4: Letting stale deals sit in Commit**
`/commercial-forecaster` flags deals with last activity >14 days. Commit deals with no activity are forecast inflation, not pipeline.

**Mistake 5: RFP responses that don't answer the actual question**
`/rfp-responder` answers the specific RFP question first, then supports with evidence — it doesn't bury the answer in a marketing paragraph.

---

## Resources

- [Getting started with Claude Code](../getting-started.md)
- [AE deal cycle workflow](../workflows/ae-deal-cycle.md)
- [Deal desk skill](../skills/gtm/deal-desk.md)
- [RFP responder skill](../skills/gtm/rfp-responder.md)
- [CRO Advisor agent](../agents/advisors/cro-advisor.md)
- [Competitive analyst agent](../agents/roles/competitive-analyst.md)

---
