# Claude for Investors and VC Analysts

Everything a VC analyst, associate, or partner needs to run AI-augmented deal screening, diligence, financial modelling, portfolio monitoring, and IC preparation in Claude Code.

---

## Who this is for

You are a venture capital analyst, associate, partner, or independent angel investor. Your job is to see every relevant deal, screen fast, diligence the best ones, and make good investment decisions. You are drowning in inbound, spending 40% of your time writing memos and reports, and never have enough hours to do deep research on every company that deserves it. Claude Code changes that ratio.

**Before Claude Code:** 6 hours to write a first-pass deal memo. Half a day to prep for a board meeting. 3 hours to compile a quarterly LP report across 15 companies.

**After:** First-pass deal memo in 45 minutes. Board meeting prep in 20 minutes. LP report portfolio section in 30 minutes.

---

## 30-second install

```bash
# Install all investor skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/dcf-model
npx claudient add skill finance/diligence-review
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/earnings-analysis

# Install relevant agents
npx claudient add agent advisors/cfo-advisor
npx claudient add agent roles/quant-analyst
npx claudient add agent roles/scientific-researcher
```

---

## Your Claude Code investor stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/deal-screening` | First-pass screen: market, moat, management, financials, fit — pass/proceed verdict | First look at any new deal |
| `/deal-memo` | Full deal memo: thesis, team, market, financials, risks, diligence list, recommendation | After founder meeting |
| `/ic-memo` | Investment Committee memo (9-section PE/growth format) | Before IC presentation |
| `/dcf-model` | DCF financial model: assumptions, projections, terminal value, sensitivity — in Python or Excel format | Any valuation work |
| `/diligence-review` | Structure and run diligence: customer calls, technical review, reference calls, financial audit checklist | Post-term-sheet diligence |
| `/comps-analysis` | Comparable company and transaction analysis: EV/Revenue, EV/EBITDA, growth-adjusted multiples | Valuation benchmarking |
| `/portfolio-monitor` | Board update synthesis, KPI tracking, follow-on triggers, red flags, LP report sections | Monthly/quarterly portfolio review |
| `/earnings-analysis` | Public company earnings call analysis — read-across for private market comps | Competitive research |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `cfo-advisor` | Opus | Financial model review, unit economics challenge |
| `quant-analyst` | Opus | Quantitative market sizing, data-driven thesis |
| `scientific-researcher` | Opus | Deep sector research, academic literature for deep tech |

---

## Daily workflow

### Morning (30-45 minutes)

**1. Deal flow review — screen inbound overnight**
```
/deal-screening

Screen these inbound deals quickly. Give me a pass/proceed verdict on each.

[Deal 1 — company name, sector, stage, ARR/revenue, growth, valuation ask, brief description]
[Deal 2]
[Deal 3]

My fund thesis: [describe your mandate — stage, sector, check size]
Skip obvious mismatches. Flag the one worth a deeper look.
```

**2. Portfolio check — any board updates received**
```
/portfolio-monitor

I received a monthly update from [company]. Synthesize it and flag anything requiring my attention this week.

[Paste board update or key metrics]
```

---

### Post-founder-meeting (45-90 minutes)

**3. Deal memo — first impression to paper**
```
/deal-memo

Company: [name]
What I learned in the meeting: [your notes — paste or summarize]
My gut: [preliminary view]

Fill in the deal memo structure. Mark anything I didn't learn as [NEED TO VERIFY].
```

---

### Diligence phase (ongoing)

**4. Customer reference call prep**
```
/diligence-review

I'm calling [company]'s reference customer [name, title, company] tomorrow.

Investment thesis: [what we believe about the company]
Key risks to validate: [what could be wrong]

Generate 12 reference call questions that probe:
- How they use the product and how embedded it is
- What would make them cancel
- How the product compares to alternatives they've evaluated
- Any concerns with the company or team
```

**5. Comps analysis**
```
/comps-analysis

Run a comparable company analysis for [company] in [sector].

Our company metrics: ARR $[X]M, [X]% growth, [X]% gross margin, [X]x NRR
Round: $[X]M at $[X]M pre-money

Find public comps and recent private transaction comps. What multiple are we paying vs. the market?
```

---

### IC prep

**6. IC memo — full investment committee presentation**
```
/ic-memo

Convert my deal memo into a full IC memo for [company].

Deal memo (paste or summarize): [...]
Diligence findings: [what we verified, what we couldn't]
Updated recommendation: [invest / pass / conditional]

Generate all 9 sections with [VERIFY] flags on any unconfirmed data.
```

---

### Portfolio support (board meeting days)

**7. Board meeting prep**
```
/portfolio-monitor

Board meeting with [company] is tomorrow. Prepare me.

Last board meeting: [summary]
Current board package: [paste]
My concerns going in: [list]
What I want to drive: [topics]

Give me: pre-read synthesis, hard questions, my agenda, potential asks from the team.
```

---

### Weekly (Friday — 30 minutes)

**8. Weekly deal flow summary**
```
/deal-screening

Summarize this week's deal flow:
- Deals screened: [N]
- Passed: [N] — [brief reason for each major pass]
- In pipeline: [N] — [status of each]
- Moving to IC: [N]

What should I prioritize next week?
```

---

## 30-day ramp plan (new VC analyst)

### Week 1 — Deal screening mastery
- Install all investor skills: `npx claudient add skill finance/[name]`
- Run `/deal-screening` on 20 recent deals from your fund's archive — compare your output to what partners decided
- Understand your fund's ICP: stage, sector, check size, follow-on strategy
- Read the `/comps-analysis` skill — understand how multiples work in your sectors

### Week 2 — Deal memo practice
- Shadow 3 partner meetings → write deal memos on your own → compare to senior analyst's version
- Run `/dcf-model` on one portfolio company — understand the assumptions and sensitivities
- Start building your sector comps database — `/comps-analysis` helps structure it

### Week 3 — Diligence and portfolio
- Run `/diligence-review` on an active deal — own the customer reference call process
- Use `/portfolio-monitor` to synthesize Q1 updates for 5 portfolio companies
- Prep for one board meeting using `/portfolio-monitor` board prep mode

### Week 4 — IC presentation
- Write a full IC memo with `/ic-memo` on a deal you've been working
- Present to the partners — use Claude's output as your structure, not your script
- Track: how many of your pre-meeting questions came up in IC? (benchmark: >60% shows good question quality)

---

## Tool integrations

### Notion (deal tracking)
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-token-here"
      }
    }
  }
}
```

With Notion connected: Claude can read your deal pipeline database, pull company notes, and write deal memo drafts directly into your deal pages.

### Airtable / deal pipeline
Export deal pipeline as CSV → paste into `/deal-screening` → get ranked pass/proceed verdicts. For live integration, use Airtable MCP.

### Financial models
Claude generates Python or structured Excel-ready tables for DCF and comps work. For complex models, generate the structure and assumptions in Claude → build in Excel/Google Sheets → paste results back for narrative.

### Gong / call recording
Paste founder call transcript into `/deal-memo` → Claude extracts key claims, flags unverified statements, and structures into deal memo format.

---

## Metrics to track

| Activity | Manual time | With Claude |
|---|---|---|
| First-pass screen per deal | 45 min | 8 min |
| Deal memo draft | 6 hours | 45 min |
| IC memo | 8 hours | 2 hours |
| Board meeting prep | 2 hours | 20 min |
| LP quarterly report (portfolio section) | 4 hours | 45 min |
| Reference call prep | 30 min | 10 min |
| Comps analysis | 3 hours | 30 min |

Target: 3x more deals reviewed with same analyst headcount. Quality floor rises because Claude structures your thinking, not just saves time.

---

## Common mistakes (and how Claude Code prevents them)

**Mistake 1: Anchoring on founder's narrative**
`/deal-memo` prompts you to mark every founder-provided claim as `[UNVERIFIED]`. Forces intellectual honesty before you fall in love with a story.

**Mistake 2: Missing red flags in board updates**
`/portfolio-monitor` runs a structured red flag checklist on every board update. You won't miss "burn increased 40% while revenue was flat" buried in slide 12.

**Mistake 3: Writing memos that advocate instead of analyze**
Claude's risk section is structured to force balanced analysis. IC members who receive advocacy-heavy memos discount them.

**Mistake 4: Skipping reference calls**
`/diligence-review` generates reference call questions that go beyond the softball questions founders coach customers to answer.

**Mistake 5: Paying the wrong valuation**
`/comps-analysis` anchors every deal to market comps before you get excited about the company.

---

## Resources

- [Getting started with Claude Code](getting-started.md)
- [Deal screening skill](../skills/finance/deal-screening.md)
- [Deal memo skill](../skills/finance/deal-memo.md)
- [IC memo skill](../skills/finance/ic-memo.md)
- [Portfolio monitor skill](../skills/finance/portfolio-monitor.md)
- [Deal screening workflow](../workflows/deal-screening.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
