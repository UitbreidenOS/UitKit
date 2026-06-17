# Product Operations Stack

> The complete Claude Code workspace for product strategy and execution — roadmap prioritization, customer feedback synthesis, metrics analysis, stakeholder alignment, and release planning. Execute data-driven product decisions with transparency, rigor, and confidence.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Configure MCP servers** (optional) — Add Firecrawl and Exa in `settings.json` for enhanced research and web scraping capabilities.
3. **Review your strategic OKRs** — Open `claude.md`, customize the strategic priorities section, and define ICP (Ideal Customer Profile).
4. **Run `/analyze-roadmap [backlog]`** — Pass your feature backlog, customer feedback, and OKRs. Get back a ranked priority list with rationale.
5. **Synthesize customer feedback** — Run `/synthesize-feedback` with customer interviews, surveys, support tickets. Get top 5 requests and segment breakdown.
6. **Log your work** — Session-log.md auto-updates with all product ops decisions; build a searchable history.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `claude.md` | Config | Workspace rules, available skills, commands, hooks, standard operating procedures |
| `session-log.md` | Log | Auto-updated with every analysis: roadmap decisions, feedback synthesis, stakeholder mappings, metrics findings, releases planned |
| `skills/` | Directory | 6 reusable skills for roadmap analysis, metrics interpretation, stakeholder mapping, feedback synthesis, release planning, and user research |
| `commands/` | Directory | 3 slash commands: `/analyze-roadmap`, `/synthesize-feedback`, `/plan-release` |
| `hooks/` | Directory | 4 automated validations: roadmap completeness, metrics accuracy, stakeholder coverage, auto-logging |
| `mcp/` | Directory | MCP server recommendations (Firecrawl, Exa, Open Interpreter) for enhanced analysis |

---

## Skills (6)

| Skill | Trigger | Tools Used | Purpose |
|---|---|---|---|
| `roadmap-prioritizer` | `/analyze-roadmap` | Read, Write, WebSearch | Analyze feature backlog with 5-dimension scoring (impact, effort, alignment, revenue, tech debt). Return ranked list with GO/HIGH/MEDIUM/LOW tiers |
| `metrics-analyzer` | Ad-hoc | Read, Write, WebSearch | Analyze product health metrics (retention, activation, churn, NRR, adoption). Identify trends, anomalies, business risks, segment breakdowns |
| `stakeholder-mapper` | Before decisions | Read, Write | Map decision-makers, approval paths, RACI matrix. Identify conflicts, flag missing stakeholders, clarify authority |
| `customer-feedback-synthesizer` | `/synthesize-feedback` | Read, Write, WebSearch | Aggregate feedback from interviews, surveys, support, reviews. Extract themes, top 5 requests, sentiment, segment analysis |
| `release-planning` | `/plan-release` | Read, Write | Structure release: scope, timeline, dependencies, testing, communication, rollout, go/no-go criteria. Create deployment checklist |
| `user-research-synthesizer` | Ad-hoc | Read, Write | Synthesize user research (interviews, tests, observation). Map JTBD, mental models, friction, personas, design implications |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/analyze-roadmap` | Score feature backlog against impact, effort, alignment, revenue, tech debt. Return ranked list with rationale for each tier. Identifies critical path and dependencies. |
| `/synthesize-feedback` | Aggregate customer feedback from 2+ sources (interviews, surveys, support, reviews). Extract top 5 requests, pain points, sentiment drivers, segment breakdown. |
| `/plan-release` | Structure product release: scope lockdown, timeline, dependencies, testing strategy, communication plan, rollout approach, deployment readiness checklist. |

---

## Hooks (4)

| Hook | Event | What It Protects Against |
|---|---|---|
| `roadmap-validator` | PostToolUse (Write/Edit) | Flags roadmap documents lacking OKR alignment, clear rationale, or dependency mapping |
| `metrics-accuracy` | PostToolUse (Write/Edit) | Validates data freshness (recent?), baseline comparisons (context?), risk justification (why CRITICAL?) |
| `stakeholder-validation` | PostToolUse (Write/Edit) | Ensures all critical roles present (Product, Eng, CS, Legal), approval authority defined, conflicts documented |
| `session-auto-log` | Stop | Auto-logs all product ops work (roadmap analyses, feedback synthesis, stakeholder decisions, releases) to session-log.md |

---

## MCP Setup (Optional)

### Firecrawl (Web Scraping for Competitive Research)
Get your API key at [firecrawl.dev](https://www.firecrawl.dev/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["@firecrawl/mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Exa (Real-Time Web Search)
Get your API key at [exa.ai](https://exa.ai/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["@exa/mcp"],
      "env": {
        "EXA_API_KEY": "your-key-here"
      }
    }
  }
}
```

---

## How It Works

### 1. Roadmap Prioritization
You have a feature backlog (15–50 items) and need to decide what to build first. `/analyze-roadmap` applies a transparent scoring framework (customer impact, effort, revenue potential, strategic alignment, technical debt reduction). Returns a ranked list with GO (schedule first), HIGH (if capacity), MEDIUM (defer), and LOW (backlog) tiers. Every item shows its score and rationale, so stakeholders understand why decisions were made.

### 2. Customer Feedback Synthesis
You've collected feedback from interviews, NPS surveys, support tickets, and review sites (100+ data points). `/synthesize-feedback` extracts themes, counts frequency, identifies top 5 requests by intensity and customer segment, and flags customer pain points. Includes direct quotes and business impact assessment.

### 3. Stakeholder Alignment
Before a major decision (pricing change, feature launch, timeline shift), map stakeholders: Product, Engineering, Customer Success, Finance, Legal. `stakeholder-mapper` creates RACI matrix, identifies approval paths, flags competing priorities, and documents conflict resolution. Ensures decision-making is transparent and all voices are heard.

### 4. Metrics Analysis
Every month, run `metrics-analyzer` on your core product health metrics: retention, activation, churn, feature adoption, NRR. Identifies trends, anomalies, and business risks. Flags which segments are healthy vs. at-risk. Provides early warning signals before churn becomes critical.

### 5. Release Planning
2–4 weeks before launch, `/plan-release` structures the entire release: scope lock, timeline, dependencies, testing strategy, communication plan, rollout approach (phased vs. all-at-once), go/no-go criteria. Returns a deployment checklist and identifies the critical path.

### 6. User Research Synthesis
After conducting user interviews, usability tests, or observation studies, `user-research-synthesizer` extracts JTBD (jobs to be done), mental models, friction points, and validates personas. Translates research findings into design implications.

### 7. Session Logging
Every roadmap analysis, feedback synthesis, stakeholder decision, metrics finding, and release planning work is automatically logged to `session-log.md`. Creates an audit trail—you can look back and see what decisions were made, what data supported them, and what happened next.

---

## Tone & Output Rules

- **Data-driven:** All prioritization, decisions, and recommendations grounded in customer signals, metrics, or business context. No speculation without data flags.
- **Transparent:** Show your work. Share scoring logic, prioritization reasoning, stakeholder mapping, and conflict resolution explicitly.
- **Collaborative:** Stakeholder input is weighted; competing priorities are surfaced and resolved, not ignored.
- **Clear communication:** Write for senior stakeholders (VP, C-suite). Assume they know the business; focus on insights and implications.
- **Actionable:** Every analysis ends with "next steps" — clear, prioritized actions that move decisions forward.

---

## Human Approval Gate

**All major product decisions require stakeholder review and approval.**

- Claude synthesizes feedback, analyzes metrics, scores roadmaps, maps stakeholders, and plans releases.
- Human (Product Lead, VP Product, CEO) reviews outputs, requests changes, or approves.
- Only after approval does the decision move to execution (engineering, marketing, support).
- Approval is logged: `[APPROVED] Tiered Pricing Launch — June 15, 2026 14:35`

---

## Success Metrics

Track and report on:
- **Roadmap accuracy:** % of planned features completed in sprint; % of unplanned work (indicates planning rigor)
- **Customer alignment:** % of shipped features based on user feedback vs. internal assumptions
- **Metric health:** Retention, activation, NRR trending up; churn trending down
- **Stakeholder satisfaction:** % of stakeholders report feeling heard in roadmap decisions
- **Release velocity:** Time from planning to deployment; % of releases hitting go/no-go criteria
- **Decision velocity:** Time from feedback collection to roadmap prioritization decision

---

## Key Constraints

- **Data-first:** Don't recommend prioritization without customer signals. If data is missing, flag it.
- **Transparency:** Always explain your reasoning. Competing views among stakeholders should be surfaced explicitly.
- **Compliance aware:** Flag decisions with legal, privacy, or security implications; escalate to appropriate teams.
- **Customer obsessed:** Listen to what customers actually do (behavior) over what they say (stated preferences).

---

## Stats

**6 skills** · **3 commands** · **4 hooks** · **2–3 MCP servers** (optional) · **Full audit trail** via session logging

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudient/Claudient) · [Claude Code](https://claude.com/claude-code)
