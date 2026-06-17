# Sales Operations Stack

> Autonomous sales operations execution engine — pipeline analytics, territory management, sales forecasting, quota tracking, deal velocity analysis, and revenue intelligence for high-performance sales teams.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Configure your CRM** — Add Salesforce or HubSpot credentials to `settings.json` (see `mcp/connections.md`).
3. **Review your CLAUDE.md** — Customize sales operations domains and constraints for your business.
4. **Run `/analyze-pipeline`** — Get a real-time pipeline health snapshot with deal aging, conversion rates, and at-risk deals.
5. **Run `/optimize-territory`** — Analyze territory balance, quota fairness, and account distribution. Identify gaps.
6. **Run `/build-forecast`** — Generate 13-month rolling forecast with commit/best-case/upside scenarios.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, sales targets, quota methodology, velocity benchmarks, and performance guardrails. Start here. |
| `session-log.md` | Log | Auto-updated with every action: forecasts generated, velocity analysis, territory changes, quota adjustments, coaching flags. |
| `skills/` | Directory | 8 reusable skills for pipeline management, quota planning, forecasting, and performance analysis. |
| `commands/` | Directory | 3 slash commands for common sales ops workflows. |
| `hooks/` | Directory | 4 automated hooks for real-time alerts and compliance. |
| `mcp/` | Directory | Salesforce and HubSpot configurations. |

---

## Skills (8)

| Skill | Trigger | Tools Used | Purpose |
|---|---|---|---|
| `pipeline-forecaster` | `/forecast-pipeline` | Salesforce API, WebSearch | Generate quarterly forecast, stage-by-stage confidence, bottleneck detection, risk scoring |
| `deal-velocity-analyzer` | `/analyze-velocity` | Salesforce API, Exa | Track deal cycle time by rep/vertical, identify stalled deals, benchmark against industry |
| `quota-planner` | `/plan-quota` | Salesforce API, Read | Allocate quota top-down by territory/vertical, adjust for attainment, plan ramp for new hires |
| `sales-cycle-analyzer` | Diagnostic | Salesforce API, WebSearch | Analyze average deal size, cycle length, close rate by vertical/region; generate trend report |
| `territory-optimizer` | Strategic | Salesforce API, Read | Map accounts to reps by region/vertical, calculate coverage, flag unassigned high-value targets |
| `performance-auditor` | Compliance | Salesforce API, Exa | Audit forecast accuracy, quota attainment, pipeline health, flag misforecasts and quota leakage |
| `revenue-intelligence` | Strategic | Salesforce API, WebSearch, Exa | Surface competitive wins/losses, customer expansion patterns, churn risk, market shifts |
| `commission-modeler` | `/model-commission` | Salesforce API, Read | Model commission payouts, plan incentive alignment, calculate impact of quota changes |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/forecast-pipeline` | Generate quarterly forecast from live pipeline data. Confidence by stage, bottleneck alerts, forecast methodology. Output to session log. |
| `/analyze-velocity` | Track deal cycle time, cycle time per rep, stalled deals, velocity vs. historical benchmark. Generate report. |
| `/optimize-territory` | Map high-value accounts to available sales capacity. Flag coverage gaps and overallocation. Recommend territory realignment. |

---

## Hooks (4)

| Hook | Event | What It Protects Against |
|---|---|---|
| `quota-alert` | PostToolUse | Flags when rep forecast drops >20% week-over-week or falls below quota threshold without justification |
| `velocity-warning` | PostToolUse | Alerts when deal is stalled (no activity >30 days) or cycle time exceeds 90th percentile |
| `forecast-sync` | PostToolUse | Auto-validates forecast totals against CRM pipeline, flags discrepancies >$5K |
| `session-summary` | Stop | Auto-logs to `session-log.md` at session end: forecasts generated, velocity reports, territory changes, coaching flags |

---

## MCP Setup

### Salesforce (Recommended for Enterprise)

Get your instance URL, client ID, and security token. Add to `settings.json`:

```json
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-salesforce"],
      "env": {
        "SALESFORCE_INSTANCE_URL": "https://yourorg.salesforce.com",
        "SALESFORCE_CLIENT_ID": "your-consumer-key",
        "SALESFORCE_CLIENT_SECRET": "your-consumer-secret",
        "SALESFORCE_USERNAME": "your-username@yourorg.com",
        "SALESFORCE_PASSWORD": "your-password",
        "SALESFORCE_SECURITY_TOKEN": "your-security-token"
      }
    }
  }
}
```

Details: See `mcp/salesforce.md`

### HubSpot (Recommended for Mid-Market/SMB)

Get your private app API key. Add to `settings.json`:

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-hubspot"],
      "env": {
        "HUBSPOT_API_KEY": "pat-na1-xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

Details: See `mcp/hubspot.md`

---

## How It Works

### 1. Pipeline Health Scoring

Every Friday (or on-demand), run `/pipeline-review`. The pipeline-health-scorer skill evaluates your pipeline across 10 dimensions:

- **Coverage Ratio** (pipeline / quota) — Target 3.5x–4.5x
- **Win Rate** by stage — Identify where deals are stalling
- **Sales Cycle Velocity** — Is it elongating? Red flag for market saturation
- **Deal Size Distribution** — Avoid composition creep
- **Forecast Accuracy** — Are reps optimistic or conservative?
- **Stage Distribution** — Ensure healthy flow through funnel
- **Quota Attainment Trajectory** — Project quarter-end outcome
- **Win Rate Trending** — Is it declining? Signal of process or market issues
- **Deal Age** — Flag stalled deals (>30 days unchanged)
- **Territory Quota Balance** — Are quotas fairly distributed?

Result: Overall health score (0–100) with color-coded risk matrix and priority recovery actions.

### 2. Deal Risk Analysis

Before closing any significant deal, run `/deal-deep-dive [deal-name]`. The deal-risk-analyzer scores 8 dimensions:

- Buyer persona fit
- Buying committee health (champion + economic buyer aligned?)
- Competitive threats
- Deal momentum (engaged or stalled?)
- Contract/legal status
- Financial approval
- Technical fit
- Timeline alignment

Result: Close probability forecast + bottleneck identification + recovery strategy. Recommendation: GO (>65%) / CAUTION (50–65%) / NO-GO (<50%).

### 3. Quota Tracking & Coaching

Monthly (or when a rep trends toward miss), run `/quota-tracker`. Decomposes quota shortfalls into root causes:

- **Activity gap:** Is rep making enough calls/meetings?
- **Win rate:** Is rep closing deals at expected rate?
- **Deal size:** Is rep chasing small deals instead of strategic ones?
- **Business mix:** New business vs. expansion ratio healthy?

Result: Rep-by-rep status + specific coaching actions + expected recovery value. Flags reps for intervention early (not at quarter-end).

### 4. Territory Rebalancing

Quarterly (or after headcount changes), run `/territory-analysis`. Assesses:

- Quota fairness vs. territory potential
- Account distribution (concentration risk, coverage gaps)
- New business vs. expansion pipeline by territory
- Realignment recommendations with implementation timeline

Result: Territory scorecard + specific account move recommendations + expected impact.

### 5. Session Logging

Every key action is logged to `session-log.md`:
- Pipelines reviewed (date, key findings, recommendations)
- Deals deep-dived (deal name, risk score, recommendation)
- Territories analyzed (changes recommended, expected impact)
- Approvals logged (deal ID, authority, timestamp)

Build a searchable audit trail of your sales operations decisions.

---

## Sales Operations Hierarchy

Define clear account tiers and sales process:

### Account Tiers (Customize)

| Tier | ARR Range | Buying Committee | Sales Cycle | Territory Size |
|---|---|---|---|---|
| **Enterprise** | $50K–$500K+ | 5–15 people; C-suite | 6–12 months | 5–10 accounts |
| **Mid-Market** | $10K–$50K | 3–5 people; VP level | 3–6 months | 15–25 accounts |
| **Commercial** | <$10K | 1–2 people | 1–3 months | 50–100 accounts |

### Standard Sales Stages

- **Prospecting** → **Discovery** → **Qualification** → **Proposal** → **Negotiation** → **Contract** → **Closed-Won**

Each stage has entry/exit criteria and expected timeline.

---

## Success Metrics

Track and report on:

- **Pipeline Coverage Ratio:** Total open pipeline / annual quota target. Target: **3.5x–4.5x**
- **Quota Attainment Rate:** % of sales team hitting >90% quota. Target: **>80%**
- **Forecast Accuracy:** Actual close vs. 90-day forecast. Target: **±15%**
- **Average Sales Cycle:** Days from open to close. Track trending; red flag if elongating >10% YoY.
- **Win Rate:** Closed-Won / (Closed-Won + Closed-Lost). Set internal benchmark; track by stage.
- **Deal Size Trending:** ACV vs. quota assumption. Red flag if <90% of target.
- **Territory Quota Balance:** Standard deviation of quota per rep. Target: **<15% variance**

---

## Human Approval Gates

**Deal Governance:**

- Deals <$25K: Rep authority
- Deals $25K–$100K: Manager approval required
- Deals $100K–$250K: Director approval required
- Deals >$250K: VP or C-suite approval required

**Forecast Lockdown:** 5 days before quarter-end, forecast becomes locked. No new deal adds without SVP approval.

---

## Key Constraints

- **Data accuracy:** All analysis depends on CRM data quality. Flag rogue deal entry, stale records, stage inflation.
- **Confidentiality:** Pipeline data contains sensitive deal information. Restrict distribution to sales leadership and finance.
- **Regulatory:** GDPR/privacy respect when storing customer/prospect information.
- **Rate limiting:** CRM API queries should respect rate limits (typically 1000 requests/hour for Salesforce, 100 for HubSpot).

---

## Stats

**8 skills** · **3 commands** · **4 hooks** · **2 CRM integrations** (Salesforce + HubSpot) · **Full audit trail** via session logging

---

## Typical Weekly Workflow

1. **Monday 9am:** `quota-miss-alert` hook runs. Check for reps trending toward miss.
2. **Monday 10am:** `forecast-reconciliation` hook runs. Validate reps' forecasts vs. pipeline.
3. **Wednesday-Thursday:** Address any reps flagged by hooks (coaching, activity focus, etc.).
4. **Friday 9am:** Run `/pipeline-review` before executive standup. Share health score + top risks + recovery actions with leadership.
5. **Friday EOD:** Log session to `session-log.md`. Identify top priorities for next week.

---

## Typical Monthly Workflow

1. **Month-start:** Run `/quota-tracker` — decompose any shortfalls, identify coaching needs.
2. **Mid-month:** If deals are stalling, run `/deal-deep-dive` on 2–3 high-risk deals.
3. **Month-end:** Run `/pipeline-review` with fresh pipeline data. Forecast quarter-end outcome.
4. **Month-end (if needed):** Emergency quarter-end push — identify 5 deals to accelerate close on.

---

## Typical Quarterly Workflow

1. **Month 1:** Run `/territory-analysis` — assess fairness, identify any rebalancing needs.
2. **Month 1:** Run `/sales-compensation-auditor` — validate Q comp, forecast Q+1 costs, identify plan issues.
3. **Month 2:** Run `/sales-process-auditor` — review deal progression, identify bottleneck stages, coach reps on playbook compliance.
4. **Month 3:** Run `/forecast-confidence-analyzer` — assess forecast accuracy by rep, identify bias patterns, calibrate for next quarter.

---

## Workspace Structure

```
sales_operations_stack/
├── CLAUDE.md                            (workspace rules, tiers, ICP, skills)
├── session-log.md                       (auto-updated decision log)
├── README.md                            (this file)
├── skills/
│   ├── pipeline-health-scorer.md        (10-dimension scoring framework)
│   ├── deal-risk-analyzer.md            (8-dimension risk assessment)
│   ├── quota-tracker.md                 (rep-by-rep quota status + root cause analysis)
│   ├── territory-optimizer.md           (territory fairness + rebalancing)
│   ├── sales-compensation-auditor.md    (comp validation + forecasting)
│   ├── deal-governance-enforcer.md      (approval gates + compliance checks)
│   ├── forecast-confidence-analyzer.md  (forecast accuracy + bias patterns)
│   └── sales-process-auditor.md         (deal progression + bottleneck detection)
├── commands/
│   ├── pipeline-review.md               (/pipeline-review)
│   ├── deal-deep-dive.md                (/deal-deep-dive [deal-id])
│   └── territory-analysis.md            (/territory-analysis)
├── hooks/
│   ├── deal-approval-gate.md            (blocks >$50K deals without approval)
│   ├── quota-miss-alert.md              (daily: flags reps >20% below quota)
│   ├── forecast-reconciliation.md       (weekly: reconciles forecast vs. pipeline)
│   └── deal-stall-detector.md           (daily: flags deals >30 days unchanged)
└── mcp/
    ├── salesforce.md                    (Salesforce integration guide)
    ├── hubspot.md                       (HubSpot integration guide)
    └── connections.md                   (MCP setup overview)
```

---

## Customization Guide

### Define Your Account Tiers

Edit `CLAUDE.md` → "ICP & Account Segmentation" section. Set:
- ARR ranges per tier
- Expected buying committee size
- Average sales cycle length
- Territory account count targets

### Set Quota Targets

Define quarterly/annual quota per rep based on:
- Historical attainment
- Territory potential
- Individual rep track record
- Market conditions

### Customize Sales Stages

Edit `CLAUDE.md` → "Sales Operations Hierarchy" section. If your process is different (e.g., no "Qualification" stage, or custom stage), adjust stage names and exit criteria.

### Adjust Risk Thresholds

- `deal-risk-analyzer`: Close probability thresholds (default: GO >65%, CAUTION 50–65%, NO-GO <50%)
- `pipeline-health-scorer`: Coverage ratio target (default: 3.5x–4.5x)
- Deal approval gate: Approval dollar threshold (default: >$50K)

---

## Getting Help

**Question:** How do I interpret the pipeline health score?

**Answer:** See the `pipeline-health-scorer.md` skill file for detailed scoring rubric. 0–40 is critical, 40–60 is at-risk, 60–80 is adequate, 80–100 is healthy.

---

**Question:** What if my CRM is neither Salesforce nor HubSpot?

**Answer:** The skills in this stack are CRM-agnostic. You can export pipeline data as CSV and manually input it to `/pipeline-review`. For automated querying, work with your IT team to build a custom MCP server for your CRM.

---

**Question:** Can I use this without a CRM integration?

**Answer:** Yes. Export pipeline CSV monthly and manually input to commands. You lose real-time visibility but still get insights. Recommend implementing CRM integration for full value.

---

## Success Stories

_Your sales org here._ This stack is designed to be customized and integrated into your weekly/monthly workflow. Share how it helped you run a more data-driven sales operation.

---

## Stats Summary

- **Rep quota tracked:** 4+ (scale to 100+)
- **Deals analyzed weekly:** 10–50
- **Territory realignments:** 1–2 per year
- **Sales process improvements:** 2–3 per quarter
- **Early warning on quota miss:** 30–60 days advance notice

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudient/Claudient) · [Claude Code](https://claude.com/claude-code)
