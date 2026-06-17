# AI Product Manager Stack — CLAUDE.md

This stack equips AI product managers with **research tools, prioritization frameworks, competitive intelligence, and user synthesis** for data-driven product decisions in the AI/ML space.

---

## Identity & Domain

**Role:** AI Product Manager — Strategic decision-maker balancing user needs, market dynamics, and technical feasibility.

**Domain:** AI/ML product strategy, competitive positioning, user research synthesis, roadmap planning, feature prioritization.

**Core Competencies:**
- Market research & competitive intelligence for AI products
- User research synthesis & persona development
- Feature prioritization under resource constraints
- Roadmap planning with stakeholder alignment
- Risk assessment & mitigation strategies

---

## Persona

An AI PM operates at the intersection of:
- **User empathy** — deep understanding of pain points, workflows, and adoption barriers
- **Market awareness** — competitive landscapes, emerging trends, regulatory shifts
- **Technical literacy** — enough to evaluate feasibility, not enough to build
- **Business acumen** — shipping velocity, unit economics, retention metrics
- **Data-driven thinking** — hypothesis-driven experiments, quantified trade-offs

This stack supports rapid iteration from raw research to actionable strategy.

---

## Architecture Overview

```
ai_product_manager_stack/
├── CLAUDE.md                          # This file
├── README.md                          # Quick start & glossary
├── session-log.md                     # Session tracking template
├── skills/                            # Five domain-specific skills
│   ├── roadmap-planning/SKILL.md
│   ├── market-research/SKILL.md
│   ├── competitive-analysis/SKILL.md
│   ├── user-research-synthesis/SKILL.md
│   └── feature-prioritization/SKILL.md
├── commands/                          # CLI-like commands for workflows
│   ├── market-sizing.sh
│   ├── ux-audit.py
│   └── roadmap-generator.sh
├── hooks/                             # Event-driven automations
│   ├── competitive-monitoring.sh
│   └── user-feedback-digest.sh
└── mcp/                               # AI model connections
    ├── connections.md
    └── gpt4-research-connector.md
```

---

## Skills Table

| Skill | Purpose | When to Use | Output | Time |
|-------|---------|------------|--------|------|
| **Roadmap Planning** | Multi-quarter planning with dependencies & capacity | Quarterly planning, aligning executives | Gantt, dependency graph, capacity model | 2-4h |
| **Market Research** | TAM analysis, trend mapping, segment definition | New market entry, positioning | TAM report, trend matrix, segment profiles | 3-6h |
| **Competitive Analysis** | Competitor feature matrix, positioning map, win/loss | Launch prep, positioning work | Competitive grid, positioning story | 2-3h |
| **User Research Synthesis** | Converting research into personas, jobs, use cases | Feature scoping, design handoff | Personas, jobs-to-be-done, use case map | 2h |
| **Feature Prioritization** | RICE/MoSCoW/value-vs-effort scoring | Sprint planning, roadmap backlog ordering | Priority matrix, business case | 1-2h |

---

## Commands

Three executable workflows for rapid iteration:

### 1. `market-sizing.sh`
```bash
./commands/market-sizing.sh --segment "enterprise-ai-ops" --region "na" --confidence "80"
```
Outputs TAM/SAM/SOM quantification with sensitivity analysis.

### 2. `ux-audit.py`
```bash
python commands/ux-audit.py --product "our-ai-tool" --competitor "openai-api" --dimension "onboarding"
```
Runs side-by-side UX comparison, reports friction points.

### 3. `roadmap-generator.sh`
```bash
./commands/roadmap-generator.sh --themes "rag,agentic" --quarters 4 --team-velocity 13
```
Generates capacity-constrained roadmap with risk flagging.

---

## Hooks

Event-triggered automations for continuous intelligence:

### `competitive-monitoring.sh`
- **When:** Weekly on Monday 9 AM
- **Action:** Scans competitor announcements (HN, Twitter, press), flags material changes
- **Output:** Slack notification + markdown report
- **Config:** `settings.json` → `hooks.monitoring.competitor`

### `user-feedback-digest.sh`
- **When:** Daily at 3 PM
- **Action:** Aggregates support tickets, survey responses, Slack #feedback
- **Output:** Digest email with sentiment & theme clusters
- **Config:** `settings.json` → `hooks.digest.user-feedback`

---

## Domain Framework

### Product Strategy Layers

```
Market → Segment → Use Case → Feature → Technical Spec
  ↓        ↓          ↓          ↓            ↓
 TAM    ICP Job   Pain→Solution Priority Design
```

Each layer has a skill & associated output:
1. **Market** — Market Research skill (TAM, serviceable market)
2. **Segment** — Competitive Analysis skill (positioning, differentiation)
3. **Use Case** — User Research Synthesis skill (jobs, personas)
4. **Feature** — Feature Prioritization skill (RICE scoring)
5. **Technical** — Roadmap Planning skill (engineering capacity, dependencies)

### RICE Scoring Model

```
REACH (users impacted / quarter) × IMPACT (if implemented) × CONFIDENCE (%)
──────────────────────────────────────────────────────────────────────────
        EFFORT (person-months)
```

**Confidence levels:**
- High (100%): Previous feature, clear demand signals
- Medium (50-75%): Validated hypothesis, some unknowns
- Low (25%): Experimental, unproven assumption

---

## Decision Frameworks

### Market Entry Checklist
- [ ] TAM > $1B (or strategic fit)
- [ ] Addressable market segment identified
- [ ] 3+ potential customer conversations completed
- [ ] Competitive alternative mapped
- [ ] Technical feasibility pre-validated

### Feature Approval Criteria
- [ ] Job-to-be-done validated with 5+ users
- [ ] Business case: RICE ≥ 50 (relative to portfolio)
- [ ] Design specification complete
- [ ] No technical blockers (E ≤ 3 person-months)
- [ ] Alignment with roadmap themes (OKRs)

### Competitive Response Protocol
1. **Detection** — Hook flags announcement or acquisition
2. **Analysis** — Competitive Analysis skill: positioning impact?
3. **Triage** — Is this a threat, opportunity, or noise?
4. **Action** — Update roadmap, messaging, or customer comms

---

## Integration with Claude Code

### /slash-command Activation

```
/ai-pm-market-sizing [--segment=""] [--year=2026]
→ Activates Market Research skill, returns TAM report

/ai-pm-roadmap-plan [--quarters=4] [--capacity=3]
→ Activates Roadmap Planning skill, generates prioritized backlog

/ai-pm-competitive-grid [--competitors="gpt-4,claude,llama"]
→ Activates Competitive Analysis skill, creates feature matrix
```

### Hook Triggers

```json
{
  "hooks": {
    "monitoring": {
      "competitor": {
        "enabled": true,
        "schedule": "0 9 * * 1",
        "command": "./hooks/competitive-monitoring.sh"
      }
    },
    "digest": {
      "user-feedback": {
        "enabled": true,
        "schedule": "0 15 * * *",
        "command": "./hooks/user-feedback-digest.sh"
      }
    }
  }
}
```

---

## Best Practices

### Research Rigor
- Always quantify assumptions (TAM estimates, user counts, conversion rates)
- Validate with primary research (interviews, surveys) before prioritization
- Document data sources and confidence intervals
- Update forecasts quarterly with actual vs. expected

### Cross-Functional Communication
- Translate technical trade-offs into business impact
- Create "decision memos" (1 page: problem, options, recommendation, trade-offs)
- Share roadmap rationale, not just roadmap
- Use shared mental models (jobs-to-be-done, personas) across teams

### Feedback Loops
- Close the loop: shipped feature → usage metrics → research learning
- Conduct win/loss interviews post-launch
- Build quarterly learning cycles (assume → test → learn → adjust)

---

## Metrics & KPIs

**Portfolio Health:**
- % of backlog items with validated use cases (target: 80%+)
- Feature delivery velocity vs. committed capacity (track weekly)
- RICE score accuracy (post-launch actual vs. estimated impact)

**Market Intelligence:**
- Competitive response latency (flag to decision: <5 days)
- User research sample size per feature (target: 5+ interviews)
- TAM forecast accuracy (QoQ variance: <15%)

---

## Example Session Flow

```
1. Competitive Monitoring Hook fires → Flag: Competitor X launches RAG feature
2. PM runs /ai-pm-competitive-grid → Positions competitor relative to roadmap
3. PM runs /ai-pm-market-sizing --segment="rag-applications" → TAM impact
4. PM convenes working session: Roadmap Planning skill
   - Assess: Does this change market opportunity?
   - Decision: Accelerate RAG feature from Q3 → Q2?
5. Updated roadmap + decision memo shared with leadership
6. User Research Synthesis skill: Validate RAG jobs-to-be-done with customers
7. Roadmap committed; Feature Prioritization updates backlog
```

---

## Glossary & Definitions

- **TAM (Total Addressable Market):** Maximum annual revenue if product captures 100% of market
- **SAM (Serviceable Addressable Market):** Realistic capture given competition & channels
- **SOM (Serviceable Obtainable Market):** Year 1 target given capacity & go-to-market
- **ICP (Ideal Customer Profile):** Firmographic criteria for highest-value customer
- **Jobs-to-be-Done (JTBD):** Functional/emotional/social job customer is trying to accomplish
- **RICE:** Prioritization framework (Reach × Impact ÷ Confidence ÷ Effort)
- **Positioning:** Unique value promise relative to alternatives in customer's mind
- **Win/Loss:** Post-sale interview to understand why customer chose you or competitor

---

## Further Reading

- Clayton Christensen — *Jobs to Be Done*
- Reforge — *Product Strategy*, *Market Research*
- Shreyas Doshi — *Product Strategy* course
- Caitlin Kalinowski — *G3 Framework* (Go-to-market, Growth, Governance)
- Marty Cagan — *Inspired* (OKRs, product discovery)

---

**Last updated:** June 15, 2026 | **Maintainer:** Product Strategy | **Status:** Production
