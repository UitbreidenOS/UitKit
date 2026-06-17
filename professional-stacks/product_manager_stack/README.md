# Product Manager Stack

> PRD-to-roadmap pipeline that enforces clear acceptance criteria and stakeholder alignment.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace.
2. **Add MCP servers** — Configure Firecrawl and Exa in `settings.json` for competitive research and market signal detection.
3. **Run `/write-prd`** — Write a complete PRD from a feature brief with acceptance criteria and success metrics.
4. **Run `/analyze-competitors`** — Research competitor features and positioning.
5. **Run `/prioritize-roadmap`** — Score features with RICE and build the quarterly roadmap.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, RICE matrix, tone guidelines, approval gate, and SOPs. Start here. |
| `session-log.md` | Log | Auto-updated: PRDs written, roadmaps prioritized, stakeholder summaries distributed. |
| `skills/` | Directory | 8 reusable product skills — PRD writing, competitive research, prioritization, validation. |
| `commands/` | Directory | 3 slash commands for the core product workflow. |
| `hooks/` | Directory | 3 hooks enforcing quality gates on acceptance criteria and stakeholder alignment. |
| `mcp/` | Directory | Firecrawl and Exa MCP server configs for competitive intelligence. |

---

## Skills (8)

| Skill | Trigger | Tools | Purpose |
|---|---|---|---|
| `prd-outliner` | /write-prd | Read, Write, WebSearch, WebFetch | Complete PRD: problem, solution, personas, use cases, acceptance criteria, success metrics |
| `user-story-generator` | From PRD | Read, Write | Convert PRD into acceptance-criteria-driven user stories with complexity estimates |
| `competitive-mapper` | /analyze-competitors | WebSearch, WebFetch, Read, Write | Research 3–5 competitors; feature gap matrix; positioning recommendations |
| `roadmap-prioritizer` | /prioritize-roadmap | Read, Write | Score features with RICE; return ranked backlog with quarterly queue |
| `requirements-analyzer` | PRD review | Read | Flag vague acceptance criteria; suggest testable alternatives |
| `success-metrics-definer` | PRD review | Read, Write | Add baseline, target, and measurement plan to each success metric |
| `feature-spec-writer` | Post-PRD approval | Read, Write | Convert PRD → technical spec with API contracts, schema, edge cases, rollout plan |
| `stakeholder-summarizer` | 2 weeks pre-launch | Read, Write | Generate one-page summaries for eng, sales, support, and exec stakeholder groups |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/write-prd` | Write a complete PRD from a feature brief — problem, solution, acceptance criteria, success metrics, dependencies, risks |
| `/analyze-competitors` | Research 3–5 competitors; return feature gap matrix and positioning recommendations |
| `/prioritize-roadmap` | Score a feature list with RICE; return ranked quarterly backlog with business justification |

---

## Hooks (3)

| Hook | Event | What It Enforces |
|---|---|---|
| `ambiguity-detector` | PostToolUse | Flags vague acceptance criteria; prevents untestable criteria from reaching eng |
| `acceptance-criteria-validator` | PostToolUse | Ensures criteria are outcome-focused, not effort-focused (e.g., "can do X" not "refactor Y") |
| `stakeholder-sync-reminder` | Stop | Reminds PM to distribute stakeholder summaries 2 weeks before launch |

---

## MCP Setup

### Firecrawl (Competitor Research)

Get your key at [firecrawl.dev](https://www.firecrawl.dev/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "your-key-here" }
    }
  }
}
```

### Exa (Market Signals)

Get your key at [exa.ai](https://exa.ai/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": { "EXA_API_KEY": "your-key-here" }
    }
  }
}
```

---

## How It Works

### 1. Start with the Problem
Run `/write-prd` from a feature brief. The PRD outliner forces you to articulate the problem before proposing a solution. Problem definition is 50% of the work.

### 2. Research Competitors
Run `/analyze-competitors` to understand what competitors do and where you're different. This informs your positioning and feature prioritization.

### 3. Define Success
Every feature must have acceptance criteria (testable) and success metrics (measurable). These are approved by engineering and executives before work starts.

### 4. Prioritize with RICE
Run `/prioritize-roadmap` to score all feature candidates. RICE = (Reach × Impact × Confidence) ÷ Effort. Highest RICE score builds first.

### 5. Prepare Stakeholders
Run `/stakeholder-summarizer` 2 weeks before launch. Create one-page summaries tailored to engineering, sales, support, and executive audiences. No surprises on launch day.

---

## Key Principles

- **Problem-first:** Every feature starts with a clear problem statement, not a solution.
- **Acceptance-criteria-first:** PRDs must include testable criteria. If you can't write a test for it, it's not a criterion.
- **Success-metrics-first:** Every feature has 3–5 measurable outcomes with baselines and targets. Impact is measured post-launch, not assumed.
- **Competitive context is required:** Know what competitors do and why yours is different.
- **Stakeholder alignment is non-negotiable:** No feature ships without buy-in from engineering, design, sales, support, and executives.

---

## RICE Scoring Matrix

| Dimension | High (20 pts) | Medium (10 pts) | Low (3 pts) |
|---|---|---|---|
| **Reach** | 10k+ users/month | 1k–10k users | <1k users |
| **Impact** | 50%+ behavior change | 10–50% change | <10% change |
| **Confidence** | 90%+ confidence | 50–90% confidence | <50% confidence |
| **Effort** | <2 weeks | 2–6 weeks | 6+ weeks |

**RICE Score = (Reach × Impact × Confidence) ÷ Effort**
- **>100:** Build now
- **50–100:** Build this quarter
- **<50:** Defer or kill

---

## Success Metrics

Track and report on:
- **PRD quality:** % of PRDs shipping without major scope changes (target >90%)
- **Feature ROI:** Actual impact vs. predicted RICE estimate (calibrate estimates over time)
- **Stakeholder alignment:** % of features shipped with zero surprises (target 100%)
- **Roadmap adherence:** % of features completed on schedule (target >80%)

---

**8 skills · 3 commands · 3 hooks · 2 MCP servers · Quarterly roadmap**

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudients/Claudient) · [Claude Code](https://claude.com/claude-code)
