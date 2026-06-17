# B2B Consultant Stack

> Strategic advisory, deal structuring, and organizational transformation guidance for enterprise clients.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project root.
2. **Add MCP servers** — Configure Perplexity and File MCP in `settings.json` for research and document handling.
3. **Add hooks** — Copy each hook from `hooks/` into `.claude/hooks/`, make executable, and update settings.json entries.
4. **Run `/analyze-client [company name]`** — Profile the client and identify key opportunities.
5. **Run `/design-strategy`** — Build a 90-day advisory roadmap.
6. **Run `/structure-deal`** — Create commercial terms and risk analysis.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Client profiles, engagement templates, methodologies, and approval gates. Start here. |
| `session-log.md` | Log | Auto-updated: client notes, recommendations delivered, deal structures, outcomes. |
| `skills/` | Directory | 6 reusable consulting skills — analysis, strategy, deal structuring, risk assessment. |
| `commands/` | Directory | 3 slash commands for the core advisory workflow. |
| `hooks/` | Directory | 2 hooks for engagement logging and deliverable versioning. |
| `mcp/` | Directory | MCP server configs for research and document management. |

---

## Skills (6)

| Skill | Trigger | Tools | Purpose |
|---|---|---|---|
| `client-analyzer` | Start of engagement | WebSearch, WebFetch, Read | Profile company: financials, org structure, tech stack, competitive position, pain points |
| `opportunity-identifier` | After client analysis | Read, Write | List 5–7 specific opportunities ranked by impact and implementation ease |
| `strategy-designer` | /design-strategy | Read, Write | 90-day roadmap: 3 phases, milestones, resource needs, success metrics |
| `deal-structurer` | /structure-deal | Read, Write | Commercial terms: pricing model, payment schedule, SLAs, risk mitigation |
| `risk-assessor` | Before recommendation | Read, Write | Identify implementation risks, mitigation strategies, contingency plans |
| `engagement-logger` | After deliverables | Read, Write | Auto-log recommendations, client feedback, and next steps |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/analyze-client` | Profile company financials, structure, tech, competitive landscape, and pain points |
| `/design-strategy` | Build a 90-day advisory roadmap with phases, milestones, and metrics |
| `/structure-deal` | Create commercial terms, payment schedule, SLAs, and risk mitigation |

---

## Hooks (2)

| Hook | Trigger | Purpose |
|---|---|---|
| `engagement-logger` | After each deliverable | Auto-log recommendation to session-log.md with timestamp and client feedback |
| `version-control` | On strategy/deal update | Archive previous versions with timestamp; enable A/B comparison |

---

## MCP Integrations

| Server | Purpose |
|---|---|
| **Perplexity** | Real-time market research, competitive intelligence, industry trends |
| **File MCP** | Create, version, and manage deliverable documents (strategies, term sheets, decks) |

---

## Typical Workflow

```
1. Client Kick-off
   → /analyze-client [company]
   → Gather org chart, financials, tech stack, competitive position

2. Strategy Design
   → /design-strategy
   → Create 90-day roadmap with 3 phases and success metrics
   → Present to client and gather feedback

3. Deal Structuring (if applicable)
   → /structure-deal
   → Define pricing, payment, SLAs, risk mitigation
   → Get commercial terms approved

4. Delivery & Logging
   → Deliver recommendations
   → /log-engagement [feedback]
   → Auto-update session-log with outcomes
```

---

## Engagement Templates

### 1. Strategic Advisory (30–60 days)
- Diagnostic phase: org analysis, pain point mapping
- Strategy phase: opportunity identification, roadmap design
- Delivery: written strategy + 2 executive briefings

### 2. Deal Structuring (15–30 days)
- Commercial term design
- Risk assessment and mitigation
- Integration planning and SLAs

### 3. Organizational Transformation (60–90 days)
- Baseline assessment
- Change roadmap with milestones
- Stakeholder alignment and training

---

## Key Methodologies

- **MECE Framework**: Mutually exclusive, collectively exhaustive analysis for opportunity identification
- **Value Tree**: Decompose strategic objectives into measurable outcomes
- **Risk-Adjusted NPV**: Quantify impact accounting for implementation probability
- **Stakeholder Mapping**: Identify key influencers and resistance points

---

## Client Profiles

### Profile A: Scaling SaaS
- Revenue: $10M–$100M ARR
- Pain: Go-to-market scaling, product-market fit confirmation, fundraising readiness

### Profile B: Enterprise Software
- Revenue: $100M+ ARR
- Pain: Market expansion, organizational efficiency, M&A integration

### Profile C: Mid-Market Tech
- Revenue: $1M–$10M ARR
- Pain: Product differentiation, sales acceleration, operational scale

