# Claude for Founders and CEOs

Everything a startup founder needs to run AI-augmented company operations — investor updates, board prep, OKR reviews, hiring decisions, financial modeling, competitive intelligence, and the weekly rhythm that keeps a company moving.

---

## Who this is for

You are a founder or CEO at a venture-backed startup, from pre-seed through Series B. You are doing 15 jobs at once: strategy, fundraising, team management, product decisions, customer calls, and investor relations. Claude Code cuts the time cost of each by 5-20x.

**Before Claude Code:** 3 hours to write a board deck. 45 minutes per investor update. Half a day to build a financial model. Deep research on a competitor taking a week of context-switching.

**After:** Board deck structured in 30 minutes, filled in over 2 hours. Investor update in 10-15 minutes. Financial model built iteratively in a session. Competitor teardown in an hour.

---

## 30-second install

```bash
# Install the full founder pack
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/board-deck-builder
npx claudient add skill gtm/revenue-operations
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill finance/dcf-model
npx claudient add agents advisors/ceo-advisor
npx claudient add agents advisors/cfo-advisor
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Your Claude Code founder stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/founder-weekly-review` | Company health, OKR check, team pulse, CEO priorities for next week | Every Sunday or Monday morning |
| `/investor-update` | Monthly investor email: MRR, burn, highlights, lowlights, ask | First week of each month |
| `/board-deck-builder` | Quarterly board deck: metrics, narrative, bad news, fundraise | 2 weeks before board meeting |
| `/revenue-operations` | Pipeline health, sales metrics, forecast accuracy, GTM levers | Weekly with your CRO/Head of Sales |
| `/commercial-forecaster` | Revenue forecast: bottoms-up and tops-down, scenario modeling | Monthly or pre-fundraise |
| `/pitch-deck` | Investor pitch narrative for new-round fundraising | Series A / B raise prep |
| `/financial-plan` | Operating model, headcount plan, scenario planning, cash management | Quarterly or pre-raise |
| `/dcf-model` | Discounted cash flow valuation, comparable analysis, cap table modeling | M&A, secondary, fundraise |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `ceo-advisor` | Opus | Strategic decisions, org design, fundraise strategy, hard calls |
| `cfo-advisor` | Sonnet | Financial modeling, burn analysis, cap table, term sheets |
| `cto-advisor` | Sonnet | Technical debt decisions, hiring bar, build vs. buy, architecture risk |
| `chief-of-staff` | Sonnet | Cross-functional coordination, board prep, all-hands, OKR tracking |

---

## Daily workflow

### Morning company pulse (15 minutes)

```
/founder-weekly-review

Morning pulse check — [DATE]:
- What are the 3 most important things happening in the company today?
- Any fires from overnight (customer escalation, team issue, press)?
- What is my single most valuable use of time today?

Data available: [paste Slack summary / MRR movement / any overnight updates]
```

### Investor and board comms (as needed)

```
/investor-update

Draft my [monthly update / midpoint note / ad-hoc update]:
Month: [MONTH]
Key metric move: [MRR or ARR change]
News this period: [wins, challenges, CTO departure, new hire, etc.]
Ask: [what I need from investors this month]
```

### Financial review (weekly, 30 minutes)

```
/financial-plan

Weekly financial check:
- Cash: [$X] | Burn: [$X/month] | Runway: [X months]
- MRR this week: [$X] | vs. last week: [$X]
- Any unexpected costs this week?

What does the next 90 days look like on current trajectory?
What would it take to extend runway by 2 months without raising?
```

### Weekly planning (Friday PM or Sunday)

```
/founder-weekly-review

End-of-week review for week of [DATE].

[Paste: MRR, pipeline updates, team news, OKR check, any fires]

Produce: company health traffic light, OKR status, 3 wins, 2 lowlights, CEO priorities for next week, the one decision I need to make.
```

---

## Key workflows by scenario

### Fundraising

```
1. Research the round:
/dcf-model + /financial-plan
What ARR and metrics do I need to raise at [target valuation]?

2. Build the narrative:
/pitch-deck
Series [X] narrative — current ARR, growth rate, use of funds, market thesis.

3. Prep investor meetings:
/ceo-advisor (agent)
Help me anticipate the 10 hardest questions a [tier-1 VC] will ask.

4. Track and close:
/commercial-forecaster
Model my fundraise pipeline: [N investors at what stage] → expected close date.
```

### Hiring a key executive

```
/ceo-advisor

I'm hiring a [VP Sales / CTO / CFO]. Help me:
1. Define the profile (must-haves vs. nice-to-haves for our stage)
2. Write the scorecard (5-7 dimensions, each with a rubric)
3. Structure the interview process (who interviews, in what order, what each person assesses)
4. Identify 3 red flags to screen for
5. Draft the offer letter framing (comp philosophy, equity, expectations)

Company context: [stage, ARR, team size, biggest challenge this hire solves]
```

### Competitive intelligence

```
/ceo-advisor

Deep competitive analysis on [competitor]:
- What are they really good at? What do customers love about them?
- Where are they weak? What do their churned customers say?
- How are they positioned vs. us — price, ICP, GTM?
- What would they do if we launched [feature/move]?
- What's the one thing we should be most worried about?

Sources to check: G2 reviews, job posts, their blog, recent funding, LinkedIn hires.
```

### Board prep

```
/board-deck-builder

Quarterly board meeting — [QUARTER]:

Metrics: [ARR, growth, NRR, burn, headcount]
Special topics: [anything unusual — pivot, key departure, fundraise, major win]
Decisions needed from board: [list anything requiring approval or input]

Build the deck structure. I'll fill in the narrative for each section.
```

---

## 30-day ramp plan (founder using Claude Code for the first time)

### Week 1 — Foundation
- Install all founder skills via the commands above
- Run `/founder-weekly-review` for this week — get comfortable with the format
- Run `/financial-plan` with your current actuals — build your base operating model
- Run `/investor-update` for last month — send to your investors

### Week 2 — Rhythm
- Use `/founder-weekly-review` as your Monday morning ritual (30 minutes)
- Use `/ceo-advisor` for one strategic decision you've been putting off
- Build your OKR tracking template — run it weekly from now on

### Week 3 — Fundraise and comms
- Run `/pitch-deck` or `/board-deck-builder` for your next upcoming event
- Set a `CLAUDE.md` in your root with your company context (stage, ARR, team, investors) so Claude always has context
- Run one `/commercial-forecaster` session to understand your revenue trajectory

### Week 4 — Full integration
- Every investor update drafted with `/investor-update`
- Every board meeting prepped with `/board-deck-builder`
- Every major hire run through `/ceo-advisor` for scorecard design
- Every week reviewed with `/founder-weekly-review`

---

## CLAUDE.md for founders

Create a `CLAUDE.md` in your home directory or project root so Claude always knows your company context:

```markdown
# Company Context

Company: [NAME]
Stage: [Seed / Series A / Series B]
ARR: [$X]
MRR growth rate: [X% MoM]
Burn rate: [$X/month]
Runway: [X months]
Headcount: [N]
Key investors: [list]
Fundraise status: [not raising / preparing / in market / closed]

## Top 3 priorities this quarter
1. [Priority 1 — e.g., close Series A]
2. [Priority 2 — e.g., hit $1.2M ARR]
3. [Priority 3 — e.g., hire Head of Sales]

## Team
CEO: [name]
CTO: [name]
Head of Product: [name]
Head of Sales: [name]

## Key metrics to know
NRR: [X%]
Gross margin: [X%]
CAC payback: [X months]
Churn: [X% monthly]

## ICP
[2 sentences describing ideal customer — size, vertical, role, pain]
```

With this in place, every Claude session has full context without re-explaining.

---

## Tool integrations

### Notion (for OKRs and board docs)

```json
// Add to ~/.claude/settings.json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-notion"],
      "env": {
        "NOTION_API_TOKEN": "your-token"
      }
    }
  }
}
```

With this connected, Claude can read and update your OKR tracker, board prep docs, and investor pipeline.

### Linear (for engineering OKRs)

Connect Linear via MCP to pull sprint data directly into your weekly review. Claude can tell you what shipped, what slipped, and what's at risk — without asking your CTO to compile a report.

### QuickBooks / Xero

Export your P&L and cash flow as CSV. Paste into `/financial-plan` for burn analysis and scenario modeling. For founders with a real-time connection, the QuickBooks MCP gives Claude live financial data.

---

## Metrics to obsess over (by stage)

### Seed

| Metric | Target | Why |
|---|---|---|
| Time to first paying customer | <90 days | Validates willingness to pay |
| Week-2 retention | >30% | PMF signal |
| NPS | >40 | Signal of product love |
| Burn multiple | <5x | Early-stage capital efficiency |
| Founder: customer calls per week | 5+ | Staying close to the customer |

### Series A

| Metric | Target | Why |
|---|---|---|
| MoM ARR growth | >15% | Demonstrable velocity |
| NRR | >110% | Land and expand working |
| CAC payback | <18 months | Unit economics viable |
| Burn multiple | <3x | Efficient growth |
| Pipeline coverage | >3x target | Predictable revenue |
| Time to quota (sales reps) | <4 months | GTM is repeatable |

### Series B

| Metric | Target | Why |
|---|---|---|
| YoY ARR growth | >100% | Rule of 40 component |
| Gross margin | >70% | Software-level margin |
| NRR | >120% | Expansion-driven growth |
| Burn multiple | <2x | Capital efficiency |
| CAC payback | <12 months | Proven unit economics |

---

## Common founder mistakes Claude Code helps avoid

**Mistake 1: Letting investor updates slip**
Set a monthly reminder. `/investor-update` reduces the time cost to 10-15 minutes. Consistent updates build trust even when the numbers are hard.

**Mistake 2: Surprises in board meetings**
Use `/board-deck-builder`'s bad-news framework. Call each board member individually before the meeting if delivering difficult news. Never let the deck be the first time they hear something hard.

**Mistake 3: OKRs set in January, reviewed in December**
`/founder-weekly-review` includes OKR check every week. Off-track KRs get caught in Week 5, not Week 13.

**Mistake 4: Hiring on intuition, not scorecard**
Use `/ceo-advisor` to build a scorecard before every senior hire. Document the rubric. Debrief every panel against the rubric.

**Mistake 5: Financial model only for fundraising**
Your operating model should be a live document. Use `/financial-plan` monthly. Know your runway within 2 weeks, not within 2 months.

---

## Resources

- [Getting started with Claude Code](getting-started.md)
- [Founder weekly workflow](../workflows/founder-weekly.md)
- [Board deck builder skill](../skills/productivity/board-deck-builder.md)
- [Investor update skill](../skills/productivity/investor-update.md)
- [Financial plan skill](../skills/finance/financial-plan.md)
- [CEO advisor agent](../agents/advisors/ceo-advisor.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
