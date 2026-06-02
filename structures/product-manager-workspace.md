# Product Manager Workspace — Project Structure

> For a product manager owning discovery, roadmap, delivery, and launches — PRD writing, stakeholder alignment, sprint planning, user research synthesis, experiment design, and competitive analysis driven from a single Claude Code workspace.

## Stack

- Linear — roadmap management, sprint tracking, backlog grooming, milestone reporting
- Figma — design review, prototype links, design spec references (MCP: figma)
- Notion or Confluence — PRDs, product specs, team wikis, decision logs
- Amplitude or Mixpanel — product analytics, funnel analysis, feature adoption, north star tracking
- Dovetail — user research repository, interview notes, insight tagging, usability reports
- Jira — enterprise sprint boards, ticket management, release tracking (when org requires it)
- Slack — stakeholder async, launch coordination, cross-functional comms (MCP: slack)
- Loom — async demo recordings, feature walkthroughs, sprint review videos

## Directory tree

```
product-manager-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Workspace instructions for Claude Code
│   ├── settings.json                              # Permissions, hooks, MCP server config
│   └── commands/
│       ├── prd-draft.md                           # Draft PRD from feature idea — reads templates, outputs full spec
│       ├── user-story.md                          # Generate user stories from PRD or feature brief
│       ├── experiment-design.md                   # Design A/B or multivariate test — hypothesis, metrics, sample size
│       ├── launch-plan.md                         # Build launch checklist and comms plan from PRD
│       ├── competitive-teardown.md                # Teardown a competitor product — UX, pricing, positioning gaps
│       ├── sprint-review.md                       # Compile sprint review narrative from Linear tickets and metrics
│       └── discovery-interview.md                 # Generate interview guide from research objective
├── roadmap/
│   ├── quarterly-roadmap-q3-2025.md              # Q3 roadmap — initiatives, owners, milestones, status
│   ├── quarterly-roadmap-q4-2025.md              # Q4 roadmap (draft — not committed)
│   ├── annual-themes-2025.md                     # Annual product themes — strategic bets and rationale
│   ├── feature-backlog.md                        # Prioritized feature backlog — all in-scope ideas with scores
│   ├── prioritization-framework.md               # RICE or ICE scoring rules, weightings, decision criteria
│   ├── now-next-later.md                         # Now / Next / Later view — current horizon snapshot
│   └── deprioritized-log.md                      # Features deprioritized — reason, date, who decided
├── prds/
│   ├── _prd-template.md                          # Canonical PRD template — sections, owners, sign-off table
│   ├── active/
│   │   ├── prd-onboarding-revamp.md              # PRD — onboarding flow redesign (in development)
│   │   ├── prd-bulk-export.md                    # PRD — bulk data export feature (in spec review)
│   │   ├── prd-notification-center.md            # PRD — notification center v2 (in design)
│   │   └── prd-api-rate-limiting.md              # PRD — API rate limiting and quota management
│   ├── shipped/
│   │   ├── prd-search-v2.md                      # PRD — search v2 (shipped 2025-04)
│   │   ├── prd-team-permissions.md               # PRD — team-level permissions (shipped 2025-02)
│   │   └── prd-csv-import.md                     # PRD — CSV import (shipped 2025-01)
│   └── archived/
│       ├── prd-mobile-app-v1.md                  # PRD — mobile app v1 (cancelled — pivot to web-first)
│       └── prd-ai-assistant-spike.md             # PRD — AI assistant spike (merged into onboarding PRD)
├── research/
│   ├── _interview-guide-template.md              # Canonical user interview guide template
│   ├── interviews/
│   │   ├── 2025-05-onboarding-study/
│   │   │   ├── research-plan.md                  # Research objective, participant criteria, script
│   │   │   ├── participant-screener.md           # Screener questions for recruiting
│   │   │   ├── notes-p1-2025-05-12.md            # Interview notes — participant 1
│   │   │   ├── notes-p2-2025-05-13.md            # Interview notes — participant 2
│   │   │   ├── notes-p3-2025-05-14.md            # Interview notes — participant 3
│   │   │   ├── notes-p4-2025-05-15.md            # Interview notes — participant 4
│   │   │   ├── notes-p5-2025-05-16.md            # Interview notes — participant 5
│   │   │   └── synthesis-report.md               # Synthesized insights, themes, quotes, recommendations
│   │   └── 2025-03-churn-investigation/
│   │       ├── research-plan.md                  # Research plan — churn drivers study
│   │       ├── notes-p1-2025-03-04.md            # Interview notes
│   │       └── synthesis-report.md               # Synthesis — top 5 churn themes, severity matrix
│   ├── surveys/
│   │   ├── nps-q2-2025-results.md                # NPS survey results — score, verbatims, segment breakdown
│   │   ├── onboarding-csat-2025-05.md            # Onboarding CSAT survey results and themes
│   │   └── feature-prioritization-survey.md      # User-ranked feature priority survey (n=240)
│   ├── usability/
│   │   ├── usability-bulk-export-2025-05.md      # Usability test — bulk export flow (5 participants)
│   │   └── usability-onboarding-2025-04.md       # Usability test — new onboarding (7 participants)
│   └── personas/
│       ├── persona-power-user.md                 # Power user persona — goals, frustrations, context, quotes
│       ├── persona-occasional-user.md            # Occasional user persona
│       └── persona-admin.md                      # Admin/buyer persona — evaluation criteria, objections
├── experiments/
│   ├── _experiment-template.md                   # Canonical experiment doc — hypothesis, metrics, design, results
│   ├── active/
│   │   ├── exp-042-onboarding-checklist.md       # Active: onboarding checklist vs. empty state test
│   │   └── exp-043-pricing-page-cta.md           # Active: pricing page CTA copy test
│   ├── completed/
│   │   ├── exp-039-search-ranking.md             # Completed: search ranking algorithm test — +12% P1 click
│   │   ├── exp-040-email-nudge-timing.md         # Completed: email nudge timing test — no significant result
│   │   └── exp-041-trial-length.md               # Completed: 14 vs 30-day trial — 30-day wins (p=0.03)
│   └── hypothesis-backlog.md                     # Untested hypotheses — ranked by expected impact
├── launches/
│   ├── _launch-checklist-template.md             # Canonical launch checklist — engineering, design, comms, support
│   ├── active/
│   │   ├── launch-bulk-export/
│   │   │   ├── launch-plan.md                    # Full launch plan — timeline, owners, risks, rollout
│   │   │   ├── comms-plan.md                     # Comms plan — release notes, blog, in-app, email, Slack
│   │   │   ├── support-brief.md                  # Support brief — FAQs, edge cases, known limitations
│   │   │   └── go-nogo-checklist.md              # Go/no-go decision checklist for launch day
│   │   └── launch-notification-center/
│   │       ├── launch-plan.md                    # Launch plan — notification center v2
│   │       └── comms-plan.md                     # Comms plan — notification center v2
│   └── shipped/
│       ├── launch-search-v2-2025-04.md           # Search v2 launch retrospective and metrics 30 days post
│       └── launch-team-permissions-2025-02.md    # Team permissions launch retrospective
├── competitive/
│   ├── landscape-overview.md                     # Competitive landscape — positioning matrix, key differentiators
│   ├── competitor-profiles/
│   │   ├── competitor-acme-corp.md               # Competitor profile — Acme Corp (primary competitor)
│   │   ├── competitor-rival-io.md                # Competitor profile — Rival.io (emerging threat)
│   │   └── competitor-legacy-enterprise.md       # Competitor profile — Legacy Enterprise (incumbent)
│   ├── teardowns/
│   │   ├── teardown-acme-onboarding-2025-05.md   # UX teardown — Acme Corp onboarding flow
│   │   ├── teardown-rival-pricing-2025-04.md     # Pricing teardown — Rival.io pricing page and tiers
│   │   └── teardown-legacy-api-2025-03.md        # API teardown — Legacy Enterprise developer experience
│   └── battlecards/
│       ├── battlecard-acme-corp.md               # Sales battlecard — objections, differentiators, traps
│       └── battlecard-rival-io.md                # Sales battlecard — Rival.io
└── metrics/
    ├── north-star.md                             # North star metric — definition, current value, target, owner
    ├── product-health-dashboard.md               # Weekly product health snapshot — all core KPIs
    ├── feature-success-metrics/
    │   ├── metrics-onboarding-revamp.md          # Success metrics — onboarding revamp (activation rate, TTV)
    │   ├── metrics-bulk-export.md                # Success metrics — bulk export (adoption, usage frequency)
    │   └── metrics-notification-center.md        # Success metrics — notification center (open rate, CTR)
    ├── amplitude-queries/
    │   ├── query-activation-funnel.md            # Saved Amplitude query — activation funnel steps
    │   ├── query-feature-adoption.md             # Saved Amplitude query — feature adoption by cohort
    │   └── query-retention-by-segment.md         # Saved Amplitude query — D1/D7/D30 retention by segment
    └── retrospectives/
        ├── metrics-review-q2-2025.md             # Q2 metrics retrospective — wins, misses, learnings
        └── metrics-review-q1-2025.md             # Q1 metrics retrospective
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/prd-draft.md` | Slash command that takes a feature idea, reads `prds/_prd-template.md`, `roadmap/prioritization-framework.md`, and relevant persona files, then outputs a complete PRD with problem statement, goals, user stories, requirements, success metrics, and open questions |
| `.claude/commands/experiment-design.md` | Slash command that reads `experiments/_experiment-template.md` and the relevant PRD, then outputs a fully designed experiment with hypothesis, control/variant definition, primary and guardrail metrics, minimum detectable effect, and estimated sample size |
| `.claude/commands/launch-plan.md` | Slash command that reads the active PRD and `launches/_launch-checklist-template.md`, then generates a launch plan with timeline, cross-functional owners, comms plan, support brief, and go/no-go criteria |
| `roadmap/prioritization-framework.md` | Scoring rules and weightings for RICE or ICE — used by Claude when ranking backlog items or responding to "should we build this?" questions; keeps scoring consistent across quarters |
| `prds/active/` | One file per in-flight feature — PRDs here are live documents updated as decisions change; never delete, use `archived/` for cancelled features |
| `research/personas/persona-power-user.md` | Source-of-truth persona referenced in PRDs and experiment hypotheses — updated after each major research round |
| `experiments/hypothesis-backlog.md` | Untested hypotheses ranked by expected impact — Claude reads this when asked to prioritize experiment roadmap |
| `metrics/north-star.md` | Single authoritative definition of the north star metric — Claude reads this before any metrics analysis to ensure consistent framing |
| `competitive/landscape-overview.md` | Current positioning matrix — Claude reads this when drafting competitive teardowns or battlecards to avoid contradicting existing positioning |
| `launches/active/` | One subdirectory per in-flight launch, each containing launch plan, comms plan, support brief, and go/no-go checklist as separate files |

## Quick scaffold

```bash
# Create workspace root
mkdir -p product-manager-workspace
cd product-manager-workspace

# Create .claude structure
mkdir -p .claude/commands

# Create all workspace directories
mkdir -p roadmap
mkdir -p prds/active
mkdir -p prds/shipped
mkdir -p prds/archived
mkdir -p research/interviews
mkdir -p research/surveys
mkdir -p research/usability
mkdir -p research/personas
mkdir -p experiments/active
mkdir -p experiments/completed
mkdir -p launches/active
mkdir -p launches/shipped
mkdir -p competitive/competitor-profiles
mkdir -p competitive/teardowns
mkdir -p competitive/battlecards
mkdir -p metrics/feature-success-metrics
mkdir -p metrics/amplitude-queries
mkdir -p metrics/retrospectives

# Seed key template and anchor files
touch prds/_prd-template.md
touch research/_interview-guide-template.md
touch experiments/_experiment-template.md
touch launches/_launch-checklist-template.md
touch roadmap/prioritization-framework.md
touch roadmap/feature-backlog.md
touch roadmap/now-next-later.md
touch roadmap/deprioritized-log.md
touch metrics/north-star.md
touch metrics/product-health-dashboard.md
touch competitive/landscape-overview.md

# Seed .claude command files
touch .claude/commands/prd-draft.md
touch .claude/commands/user-story.md
touch .claude/commands/experiment-design.md
touch .claude/commands/launch-plan.md
touch .claude/commands/competitive-teardown.md
touch .claude/commands/sprint-review.md
touch .claude/commands/discovery-interview.md

# Seed the CLAUDE.md
touch .claude/CLAUDE.md
touch .claude/settings.json

# Install Claude Code skills
npx claudient add skill product/product-roadmap
npx claudient add skill product/user-story-writer
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add skill product/competitive-teardown
npx claudient add skill product/persona-builder
npx claudient add skill product/product-analytics
npx claudient add skill product/product-strategist
```

## CLAUDE.md template

```markdown
# Product Manager Workspace

This workspace supports a product manager owning discovery, roadmap, delivery, and launches.
Claude Code reads context from structured files here to produce accurate, product-specific
outputs — not generic PM advice. Always read the referenced source files before generating
any document.

---

## What this is

A Claude Code workspace for a PM. Each directory maps to a core PM workflow: roadmap
prioritization, PRD writing, user research synthesis, experiment design, launch coordination,
competitive analysis, and metrics tracking. Claude reads from these files and writes drafts,
analyses, and structured outputs back into the same structure.

---

## Stack

- Linear — roadmap and sprint tracking (MCP: linear)
- Figma — design review and spec references (MCP: figma)
- Notion or Confluence — PRDs and team docs
- Amplitude or Mixpanel — product analytics, funnels, retention
- Dovetail — user research repository and insight tagging
- Jira — enterprise sprint boards (when required by org)
- Slack — stakeholder comms and launch coordination (MCP: slack)
- Loom — async demo recordings and sprint reviews

---

## Directory conventions

- `roadmap/` — Roadmap files are named by quarter: `quarterly-roadmap-Q3-2025.md`.
  `prioritization-framework.md` is the source of truth for scoring decisions. Never remove
  deprioritized items — log them in `deprioritized-log.md` with reason and date.
- `prds/` — One file per feature. Active PRDs live in `active/`, shipped in `shipped/`,
  cancelled in `archived/`. Use `_prd-template.md` for every new PRD. Do not skip sections.
- `research/` — Interview notes go in `interviews/<study-name>/notes-p<n>-YYYY-MM-DD.md`.
  Every study needs a `research-plan.md` and a `synthesis-report.md` before closing.
- `experiments/` — Active experiments in `active/`, completed in `completed/`. Every
  experiment doc must include hypothesis, metrics, sample size rationale, and results.
  Null results are not failures — file them properly in `completed/`.
- `launches/` — Each launch gets its own subdirectory under `active/`. A launch directory
  must contain: `launch-plan.md`, `comms-plan.md`, `support-brief.md`, `go-nogo-checklist.md`.
  Move to `shipped/` with a retrospective note after launch.
- `competitive/` — `landscape-overview.md` is updated quarterly. Teardowns are point-in-time
  snapshots — name them `teardown-<competitor>-<area>-YYYY-MM.md`.
- `metrics/` — `north-star.md` defines the single north-star metric. Never contradict this
  definition in experiment docs or PRD success metrics sections.

---

## Common tasks — exact commands

### PRD and specs
```
/prd-draft                — Draft PRD from feature idea using canonical template
/user-story               — Generate user stories from PRD or brief
```

### Research
```
/discovery-interview      — Generate interview guide from research objective and persona
```

### Experiments
```
/experiment-design        — Design A/B or multivariate test with hypothesis and sample size
```

### Launches
```
/launch-plan              — Build launch checklist and comms plan from active PRD
```

### Competitive
```
/competitive-teardown     — Teardown a competitor product — UX, pricing, positioning gaps
```

### Sprint rhythm
```
/sprint-review            — Compile sprint review narrative from Linear tickets and metrics
```

---

## Conventions Claude must follow

- Always read `roadmap/prioritization-framework.md` before scoring or ranking any features.
  Do not invent a scoring methodology.
- Always read `metrics/north-star.md` before writing success metrics in any PRD or experiment.
  Success metrics must ladder to the north star.
- PRDs must follow `prds/_prd-template.md` exactly — do not skip the open questions section
  or the sign-off table.
- Experiment hypotheses must follow the format: "We believe [change] will [outcome] for
  [user segment], measured by [metric], because [rationale]."
- Research synthesis reports must distinguish direct quotes from inferred themes.
  Quotes use quotation marks and a participant ID (e.g., P3). Themes do not use quotes.
- Competitive teardowns must read `competitive/landscape-overview.md` first to avoid
  contradicting existing positioning.
- Persona files in `research/personas/` are the canonical user descriptions. Reference them
  by name in PRDs and experiment hypotheses — do not invent new personas inline.
- Never write a go-live recommendation without reading the `go-nogo-checklist.md` for that launch.
```

## MCP servers

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
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
        "/Users/you/product-manager-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"prds/active/\" && echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"prd-\"; then echo \"[PRD hook] PRD written — confirm sign-off table is populated and success metrics reference metrics/north-star.md.\"; fi'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"experiments/completed/\"; then echo \"[Experiment hook] Experiment filed as completed — confirm results section includes p-value or confidence interval and a ship/iterate/kill recommendation.\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] If you updated roadmap/feature-backlog.md or metrics/north-star.md, confirm changes align with the current quarter roadmap and stakeholders have been notified.\"'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill product/product-roadmap
npx claudient add skill product/user-story-writer
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add skill product/competitive-teardown
npx claudient add skill product/persona-builder
npx claudient add skill product/product-analytics
npx claudient add skill product/product-strategist
```

## Related

- [Guide: Claude for Product Managers](../guides/for-product-manager.md)
- [Workflow: PRD Writing](../workflows/prd-writing.md)
- [Workflow: Launch Coordination](../workflows/launch-coordination.md)
- [Workflow: User Research Synthesis](../workflows/user-research-synthesis.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
