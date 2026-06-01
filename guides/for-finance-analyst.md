# Claude for Finance Analysts and CFOs

Everything a Finance Analyst, FP&A Manager, or CFO needs to run AI-augmented financial modelling, reporting, board pack preparation, and investor communication in Claude Code.

---

## Who this is for

You are a finance professional — FP&A analyst, finance manager, VP Finance, or CFO — whose job is to turn numbers into decisions. You build models, close the books, explain variances, prepare board materials, and manage investors. You are drowning in spreadsheets and spend too much time on formatting rather than analysis.

**Before Claude Code:** 3 hours to build a first-pass DCF. Half a day to write the management commentary for the board pack. A full day to produce a budget-vs-actuals deck with variance explanations. All-nighters before board meetings.

**After:** DCF framework in 20 minutes. Board pack narrative in 45 minutes. BvA variance commentary in 15 minutes. Scenario analysis on any model in under 10 minutes.

---

## 30-second install

```bash
# Install the full finance stack
npx claudient add skills finance
npx claudient add skills gtm/commercial-forecaster
npx claudient add skills gtm/revenue-operations
npx claudient add agents advisors/cfo-advisor
npx claudient add agents roles/quant-analyst

# Or cherry-pick:
npx claudient add skill finance/dcf-model
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/financial-plan
npx claudient add skill finance/ic-memo
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/budget-vs-actual
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/revenue-operations
```

---

## Your Claude Code finance stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/board-pack-builder` | Full board pack: financials, KPIs, strategic initiatives, risks, asks | Monthly/quarterly board meetings |
| `/budget-vs-actual` | BvA analysis: variance tables, commentary, trend, reforecast | Monthly close |
| `/dcf-model` | DCF valuation: WACC, FCF projections, terminal value, sensitivity | Valuation work, deals |
| `/3-statement-model` | Integrated P&L, balance sheet, cash flow model | Financial planning, fundraising |
| `/financial-plan` | Annual operating plan: headcount, revenue, expense build, scenarios | Annual planning cycle |
| `/ic-memo` | Investment Committee memo: all 9 sections, returns analysis | PE / VC deal documentation |
| `/pitch-deck` | Fundraising pitch deck: structure, narrative, metrics, story | Investor fundraising |
| `/gl-reconciler` | GL reconciliation: account analysis, variance tracing, journal entry checks | Month-end close |
| `/commercial-forecaster` | Revenue forecast: pipeline-driven, cohort analysis, scenarios | Sales + finance joint planning |
| `/revenue-operations` | RevOps analysis: ARR waterfall, NRR decomposition, churn attribution | SaaS / subscription businesses |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `cfo-advisor` | Opus | Strategic finance questions, investor narrative, fundraising positioning |
| `quant-analyst` | Sonnet | Statistical analysis, financial modelling, quantitative research |

---

## Daily workflow

### Morning — Financial data pull (15-30 minutes)

**1. Daily financial pulse**
```
/budget-vs-actual

Pull this morning's snapshot:
- Cash position vs. yesterday
- Any payments or receipts above $[threshold] processed overnight
- MTD revenue vs. budget (if available from system)
- Any variance that needs an explanation before the 9am standup

Give me a 5-bullet morning briefing.
```

**2. Model updates**
```
/commercial-forecaster

Update my revenue forecast with yesterday's actuals:
- New bookings: $[X]
- Churned MRR: $[X]
- Expansion: $[X]

Current month tracking vs. budget? Any trend that needs a reforecast?
```

---

### Model work (variable — 1-4 hours)

**3. Build or update a financial model**
```
/3-statement-model

Build a 3-statement model for [company].

Historical data (last 3 years or paste what you have):
[P&L, balance sheet, cash flow data]

Key assumptions for projection:
- Revenue growth rate: [X]% per year
- Gross margin: [X]%
- OpEx as % of revenue: [X]%
- CapEx: [X]% of revenue
- Working capital changes: [brief]

Project 3 years forward. Build base / upside / downside scenarios.
```

**4. Variance analysis**
```
/budget-vs-actual

Run the monthly BvA for [MONTH].

[Paste actual vs. budget data for each P&L line]

Context:
- Why revenue missed: [brief]
- Why S&M underspent: [hiring slower than planned]
- Any one-time items: [describe]

Produce: variance table, management commentary, reforecast implication.
```

---

### Reporting and stakeholder communication (variable)

**5. Board pack preparation**
```
/board-pack-builder

Build this month's board pack for [company].

[Provide all 7 input sections: financial data, KPIs, strategic updates, risks, asks]

Board composition: [investors + independents]
Last board meeting: [date, key items discussed]
Main narrative this month: [what's the story — on track / ahead / behind and why]
```

**6. Investor update**
```
/cfo-advisor

Draft the monthly investor update email for [company].

Audience: [VC investors / angels / strategic investors]
Key metrics to cover: [ARR, growth, burn, runway, key milestones]
What went well: [list]
What didn't: [list + brief explanation]
What we need from investors: [intros / advice / approvals]

Tone: Transparent, confident, brief. No spin — investors value candour.
```

---

### Weekly and monthly cycle

**7. Month-end close checklist**
See the full workflow at [workflows/finance-month-end.md](../workflows/finance-month-end.md).

**8. Reforecast**
```
/budget-vs-actual

[After monthly close] Run full-year reforecast.

YTD actuals (paste):
[data]

Key assumption changes from original budget:
- Revenue: [what changed and why]
- Headcount: [actual vs. planned]
- One-time items: [list]

Produce: revised full-year forecast, 3 scenarios (base/upside/downside),
revised cash runway at each scenario.
```

---

## 30-day ramp plan (new finance analysts)

### Week 1 — Know the business
- Install all finance skills: `npx claudient add skills finance`
- Run `/gl-reconciler` on last month's close — understand the chart of accounts
- Run `/budget-vs-actual` on last 3 months of actuals — spot the patterns
- Read the last 3 board packs — understand the narrative the CFO has been telling
- Map the financial model: where does revenue come from? What drives gross margin? What is discretionary OpEx?

### Week 2 — Own the close process
- Shadow or run the month-end close with `/gl-reconciler`
- Build your variance commentary template using `/budget-vs-actual`
- Understand the budget: what were the assumptions? Where are we tracking vs. plan?
- Set up your financial dashboard in your preferred BI tool (Looker, Metabase, or even Google Sheets)

### Week 3 — Build the model
- Build or review the full 3-statement model with `/3-statement-model`
- Run a DCF on the business (even if you don't need it yet — understanding valuation drivers matters)
- Build a sensitivity analysis: what single variable most impacts cash runway?
- Produce your first board pack draft using `/board-pack-builder`

### Week 4 — Drive decisions
- Present your first monthly BvA to the CEO or CFO
- Use `/commercial-forecaster` to build a pipeline-linked revenue forecast
- Identify the one financial risk that is not being discussed — raise it
- Set up your month-end close calendar: what closes when, who is responsible

---

## Tool integrations

### QuickBooks / Xero / NetSuite

```
Export trial balance or P&L from your accounting system as CSV or Excel.
Paste into Claude:

"/gl-reconciler — here is the trial balance for [month]. Identify any accounts
with unusual balances, large MoM swings, or items that need reconciliation."

"/budget-vs-actual — here is the management P&L export. Produce a BvA against
this budget [paste budget]. Write the management commentary."
```

### Excel / Google Sheets

```python
# For Python-based analysts — connect Claude to your spreadsheet data
import anthropic
import pandas as pd

client = anthropic.Anthropic()

# Load your financial data
df = pd.read_excel('monthly_financials.xlsx')

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    system="You are a financial analyst. Analyse the provided financial data and identify variances, trends, and anomalies. All figures are in USD thousands. Mark any calculations that need verification with [VERIFY].",
    messages=[{
        "role": "user",
        "content": f"""Run a budget vs actuals analysis on this data:

{df.to_markdown()}

Produce: variance table, management commentary, reforecast recommendation."""
    }]
)
```

### Salesforce / HubSpot (revenue forecast)

```json
// Connect CRM to Claude for pipeline-driven forecasting
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@anthropic/salesforce-mcp"],
      "env": {
        "SF_USERNAME": "your-username",
        "SF_PASSWORD": "your-password",
        "SF_TOKEN": "your-security-token"
      }
    }
  }
}
```

With CRM connected:
- Pull pipeline by stage and ask Claude for a bottoms-up revenue forecast
- Compare pipeline coverage to quota: "do we have enough pipeline to hit the number?"
- Identify deals at risk based on last activity date

### Notion / Confluence (board pack distribution)

```
After building your board pack with /board-pack-builder:
1. Export as markdown
2. Paste into Notion or Confluence
3. Share read-only link with board members before the meeting
4. In the meeting, use Claude to answer "what if" questions on the model
```

---

## Benchmarks to track

| Metric | Early stage startup | Growth stage | Public / mature |
|---|---|---|---|
| Days to close (month-end) | 10-15 | 5-7 | 3-5 |
| Board pack distributed before meeting | 48 hours | 72 hours | 5 days |
| Forecast accuracy (revenue) | ±20% | ±10% | ±5% |
| Budget variance explained (% of P&L lines) | 60% | 85% | 95% |
| Cash runway visibility | 3 months | 6 months | 12+ months |
| Time to produce BvA analysis | 4 hours | 2 hours | 1 hour |
| Time to update financial model | 2 hours | 45 minutes | 30 minutes |

---

## Common mistakes (and how Claude Code helps avoid them)

**Mistake 1: Narratives without numbers**
Board packs that tell a story without citing specific figures lose credibility. `/board-pack-builder` builds the financial tables first, then generates narrative tied to specific numbers.

**Mistake 2: Unexplained variances**
"Revenue was below budget" is not commentary. `/budget-vs-actual` structures the root cause analysis so you always explain *why*, not just *what*.

**Mistake 3: One-scenario forecasts**
Every forecast should have three scenarios. `/3-statement-model` and `/budget-vs-actual` build scenario analysis in by default.

**Mistake 4: Overpromising to the board**
`/board-pack-builder` generates the "asks" section — being clear and specific about what you need from the board, rather than burying asks in slides.

**Mistake 5: Assumptions not disclosed**
All Claude finance outputs are `[VERIFY]`-marked. This discipline forces you to go back and confirm every figure before you publish — critical for board materials.

---

## Resources

- [Getting started with Claude Code](../getting-started.md)
- [Finance month-end workflow](../workflows/finance-month-end.md)
- [DCF model skill](../skills/finance/dcf-model.md)
- [Board pack builder skill](../skills/finance/board-pack-builder.md)
- [Budget vs actuals skill](../skills/finance/budget-vs-actual.md)
- [3-statement model skill](../skills/finance/3-statement-model.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
