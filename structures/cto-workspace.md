# CTO / VP Engineering Workspace — Project Structure

> For a CTO or VP Engineering running an engineering org: architecture decisions, tech roadmap, hiring, team health, incident reviews, vendor evaluation, and board reporting — all driven from a single Claude Code workspace.

## Stack

- Linear — issues, project tracking, quarterly roadmap
- GitHub — code, PRs, engineering metrics via GitHub Insights
- Datadog — observability, SLOs, incident monitoring, dashboards
- PagerDuty — on-call schedules, incident alerting, postmortem triggers
- Notion — strategy docs, team wikis, decision logs
- Lattice or Leapsome — performance reviews, 1:1 notes, engagement surveys
- Greenhouse — job postings, candidate pipelines, interview scorecards
- Slack — async communication, incident war rooms, standups

## Directory tree

```
cto-workspace/
├── .claude/
│   ├── CLAUDE.md                        # Workspace instructions for Claude Code
│   ├── settings.json                    # Permissions, hooks, MCP config
│   └── commands/
│       ├── arch-review.md               # Architecture review — trade-off analysis, risks, ADR draft
│       ├── hiring-plan.md               # Headcount plan — role definition, timeline, budget estimate
│       ├── incident-review.md           # Postmortem template — timeline, root cause, action items
│       ├── team-health.md               # Team health snapshot — morale, velocity, attrition risk
│       ├── vendor-eval.md               # Vendor evaluation matrix — criteria scoring, recommendation
│       ├── eng-metrics.md               # Engineering metrics report — DORA, cycle time, coverage
│       ├── board-update.md              # Board update — tech health, risks, roadmap progress
│       └── build-vs-buy.md              # Build vs buy analysis — cost, risk, make-or-buy recommendation
├── decisions/                           # Architecture Decision Records (ADRs)
│   ├── README.md                        # ADR index and status legend
│   ├── adr-template.md                  # Canonical ADR template
│   ├── 0001-monorepo-vs-polyrepo.md     # Accepted — monorepo with Turborepo
│   ├── 0002-service-mesh-selection.md   # Accepted — Istio on GKE
│   ├── 0003-event-streaming-platform.md # Accepted — Kafka over SQS for ordering guarantees
│   ├── 0004-auth-provider.md            # Proposed — Auth0 vs Clerk comparison
│   └── 0005-data-warehouse.md           # Draft — BigQuery vs Snowflake
├── roadmap/
│   ├── q3-2025-tech-roadmap.md          # Quarterly roadmap — initiatives, owners, milestones
│   ├── q4-2025-tech-roadmap.md          # Next quarter draft
│   ├── 2025-annual-tech-plan.md         # Annual engineering strategy and investment areas
│   ├── tech-vision-2026.md              # 18-month forward-looking vision doc
│   └── initiative-tracker.md           # Active initiatives with status and blockers
├── hiring/
│   ├── headcount-plan-2025.md           # Approved headcount, budget, timeline by role
│   ├── job-descriptions/
│   │   ├── staff-engineer.md            # JD — Staff Software Engineer
│   │   ├── senior-sre.md                # JD — Senior Site Reliability Engineer
│   │   ├── em-platform.md              # JD — Engineering Manager, Platform
│   │   └── principal-architect.md       # JD — Principal Architect
│   ├── interview-rubrics/
│   │   ├── system-design-rubric.md      # Scoring guide for system design rounds
│   │   ├── coding-rubric.md             # Scoring guide for coding rounds
│   │   ├── leadership-rubric.md         # Scoring guide for EM/principal behaviorals
│   │   └── staff-calibration.md        # Calibration notes for staff-level bar
│   └── pipeline-notes/
│       ├── active-roles.md              # Current open roles and funnel metrics
│       └── offer-log.md                 # Offer history, comp bands, acceptance rates
├── incidents/
│   ├── postmortem-template.md           # Canonical postmortem template
│   ├── 2025-06-01-payments-outage.md    # P0 — payments service down 47 minutes
│   ├── 2025-05-14-data-pipeline-lag.md  # P1 — ingestion lag caused stale dashboard data
│   ├── 2025-04-22-cert-expiry.md        # P2 — TLS cert expired on staging proxy
│   └── action-items-tracker.md         # Open follow-ups from all postmortems
├── metrics/
│   ├── eng-kpis-dashboard.md            # DORA metrics, cycle time, deployment frequency
│   ├── reliability-scorecard.md         # SLO attainment per service, error budget burn
│   ├── on-call-burden.md               # Pages per engineer, false positive rate, MTTRS
│   ├── pr-health.md                     # PR review time, stale PRs, contributor distribution
│   └── quarterly-report-q2-2025.md     # Quarterly compiled metrics for board packet
├── org/
│   ├── team-structure.md                # Current org chart — teams, tech leads, EMs
│   ├── capacity-plan-q3.md              # Headcount vs work capacity analysis
│   ├── skill-matrix.md                  # Engineering competency map by team
│   ├── succession-plan.md               # Key-person risk and backup owners
│   └── team-health-surveys/
│       ├── q1-2025-results.md           # Lattice pulse results and themes
│       └── q2-2025-results.md           # Most recent survey summary
└── vendors/
    ├── evaluation-template.md           # Standard vendor scoring matrix
    ├── datadog-vs-grafana-cloud.md      # Completed eval — chose Datadog
    ├── launchdarkly-vs-flagsmith.md     # Completed eval — chose LaunchDarkly
    ├── okta-vs-auth0.md                 # In progress
    └── approved-vendor-list.md          # Current vendors, contract dates, renewal owners
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/arch-review.md` | Slash command that pulls context from `decisions/` and produces a structured trade-off analysis with an ADR draft ready to file |
| `.claude/commands/board-update.md` | Slash command that compiles `metrics/quarterly-report-*.md` and `roadmap/` into a board-ready tech health summary |
| `.claude/commands/incident-review.md` | Slash command that scaffolds a postmortem from a PagerDuty incident ID, filling timeline and pulling involved services |
| `decisions/adr-template.md` | Canonical ADR template: context, decision drivers, options considered, decision, consequences, status |
| `roadmap/q3-2025-tech-roadmap.md` | Living quarterly roadmap with initiative owners, milestones, dependencies, and risks — updated weekly |
| `metrics/eng-kpis-dashboard.md` | DORA metrics, cycle time, deployment frequency, and change failure rate compiled from GitHub + Datadog |
| `org/capacity-plan-q3.md` | Headcount-vs-delivery capacity model: team velocity, planned work, gap analysis, hiring asks |
| `incidents/postmortem-template.md` | Standard postmortem with severity, timeline, root cause, contributing factors, action items, and owner assignment |
| `vendors/evaluation-template.md` | Weighted scoring matrix for vendor evaluations: criteria, weights, per-vendor scores, recommendation section |
| `hiring/headcount-plan-2025.md` | Board-approved headcount plan with role, team, start quarter, loaded cost, and recruiting status per row |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p cto-workspace
cd cto-workspace

# Create .claude structure
mkdir -p .claude/commands

# Create workspace directories
mkdir -p decisions
mkdir -p roadmap
mkdir -p hiring/job-descriptions
mkdir -p hiring/interview-rubrics
mkdir -p hiring/pipeline-notes
mkdir -p incidents
mkdir -p metrics
mkdir -p org/team-health-surveys
mkdir -p vendors

# Seed key files
touch decisions/README.md decisions/adr-template.md
touch roadmap/initiative-tracker.md
touch hiring/headcount-plan-2025.md
touch incidents/postmortem-template.md incidents/action-items-tracker.md
touch metrics/eng-kpis-dashboard.md metrics/reliability-scorecard.md
touch org/team-structure.md org/capacity-plan-q3.md org/skill-matrix.md
touch vendors/evaluation-template.md vendors/approved-vendor-list.md

# Install Claude Code skills
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/tech-debt-tracker
npx claudient add skill productivity/build-optimization
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill devops-infra/platform-engineering
npx claudient add skill devops-infra/monorepo

# Install slash commands
npx claudient add command arch-review
npx claudient add command hiring-plan
npx claudient add command incident-review
npx claudient add command team-health
npx claudient add command vendor-eval
npx claudient add command eng-metrics
npx claudient add command board-update
npx claudient add command build-vs-buy
```

## CLAUDE.md template

```markdown
# CTO / VP Engineering Workspace

This workspace supports engineering leadership work: architecture decisions, technical roadmap,
hiring, team health, incident reviews, vendor evaluation, and board reporting.

---

## What this is

A structured Claude Code workspace for a CTO or VP Engineering. Every directory maps to a
distinct leadership responsibility. Claude Code reads context from these files to produce
accurate, org-specific outputs — not generic advice.

---

## Stack

- Linear — issues and quarterly roadmap (MCP: linear)
- GitHub — code, PRs, org metrics (MCP: github)
- Datadog — SLOs, observability, on-call data
- PagerDuty — incident alerting and postmortem triggers
- Notion — strategy documents and team wikis
- Lattice / Leapsome — performance reviews and engagement surveys
- Greenhouse — recruiting pipeline and interview scorecards
- Slack — async comms and incident war rooms (MCP: slack)

---

## Directory conventions

- `decisions/` — All ADRs live here. Use sequential IDs (0001, 0002). Status: Proposed | Accepted | Deprecated | Superseded.
- `roadmap/` — One file per quarter. Archive after the quarter closes. `initiative-tracker.md` stays current.
- `hiring/` — Job descriptions go in `job-descriptions/`, interview rubrics in `interview-rubrics/`. Never put candidate PII here.
- `incidents/` — One file per incident. Filename format: `YYYY-MM-DD-short-description.md`. Always file action items in `action-items-tracker.md`.
- `metrics/` — Raw metric snapshots and compiled reports. Quarterly reports feed directly into board updates.
- `org/` — Team structure, capacity plans, skill matrix. Update `team-structure.md` whenever reporting lines change.
- `vendors/` — One evaluation file per decision. Archive completed evals; keep `approved-vendor-list.md` current.

---

## Common tasks — exact commands

### Architecture decisions
```
/arch-review — Paste the decision context. Claude drafts a trade-off analysis and an ADR ready to file in decisions/.
/adr-writer  — Draft an ADR from scratch. Prompts for context, options, and consequences.
```

### Hiring
```
/hiring-plan    — Produces a role definition, interview structure, and headcount justification for a new position.
/tech-interview-kit — Generates coding challenges, system design prompts, and evaluation rubrics for a specific role.
```

### Incidents
```
/incident-review — Paste PagerDuty incident ID or timeline. Generates postmortem draft with root cause and action items.
```

### Team health
```
/team-health — Summarises survey results, attrition signals, and morale indicators into a leadership action plan.
```

### Vendors
```
/vendor-eval   — Structured vendor evaluation against weighted criteria. Produces a recommendation memo.
/build-vs-buy  — Make-or-buy analysis: cost, risk, strategic fit, time-to-value, recommendation.
```

### Metrics and reporting
```
/eng-metrics   — Compiles DORA metrics, cycle time, and SLO data into an engineering health report.
/board-update  — Assembles quarterly tech health summary, roadmap progress, and risk register for the board.
```

---

## Conventions Claude must follow

- When drafting ADRs, always use the template at `decisions/adr-template.md` — do not invent structure.
- When referencing metrics, pull from `metrics/` files first. Do not fabricate numbers.
- Postmortems are blameless. Never assign fault to an individual in `incidents/`.
- Headcount and compensation data in `hiring/headcount-plan-2025.md` is confidential — do not include in board updates unless explicitly asked.
- Roadmap milestones in `roadmap/` are the source of truth — do not contradict them in summaries.
- All vendor evaluations must include a weighted score table before a recommendation.
```

## MCP servers

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/you/cto-workspace"
      ]
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"decisions/\"; then echo \"[ADR hook] New decision filed — update decisions/README.md index\"; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"incidents/\" && ! echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"postmortem-template\"; then echo \"[Incident hook] Filing incident — ensure action items are added to incidents/action-items-tracker.md\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] If you drafted an ADR or postmortem, confirm it has been filed and linked from the relevant index file.\"'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/tech-debt-tracker
npx claudient add skill productivity/build-optimization
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill productivity/exec-briefing
npx claudient add skill devops-infra/platform-engineering
npx claudient add skill devops-infra/monorepo
npx claudient add skill devops-infra/oncall-runbook
npx claudient add skill devops-infra/capacity-planner
```

## Related

- [Guide: Claude for CTOs and Tech Leads](../guides/for-cto.md)
- [Workflow: CTO Weekly](../workflows/cto-weekly.md)
- [Workflow: Incident Response](../workflows/incident-response.md)
- [Workflow: Recruiting Pipeline](../workflows/recruiting-pipeline.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
