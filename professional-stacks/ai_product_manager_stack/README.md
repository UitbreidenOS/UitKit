# AI Product Manager Stack

Professional toolkit for AI product managers building in Claude Code. Ship data-driven product decisions with market research, competitive intelligence, user synthesis, and roadmap planning.

## Quick Start

1. **Load the stack:** In Claude Code, activate this stack by role or reference the skills directly.

2. **Five core skills:**
   - `roadmap-planning` — Multi-quarter planning, dependency management, capacity modeling
   - `market-research` — TAM analysis, trend mapping, segment definition
   - `competitive-analysis` — Feature matrix, positioning, win/loss analysis
   - `user-research-synthesis` — Personas, jobs-to-be-done, use case mapping
   - `feature-prioritization` — RICE scoring, business case development

3. **Run a command:**
   ```bash
   ./commands/market-sizing.sh --segment "enterprise-ai-ops"
   python commands/ux-audit.py --product "our-ai-tool" --competitor "openai-api"
   ./commands/roadmap-generator.sh --themes "rag,agentic" --quarters 4
   ```

4. **Enable hooks:**
   - `competitive-monitoring.sh` — Weekly competitor tracking
   - `user-feedback-digest.sh` — Daily feedback aggregation

## Directory Structure

```
ai_product_manager_stack/
├── CLAUDE.md                 # Stack identity, framework, domain rules
├── README.md                 # This file
├── session-log.md            # Session tracking (copy per use)
├── skills/                   # Five reusable product skills
│   ├── roadmap-planning/SKILL.md
│   ├── market-research/SKILL.md
│   ├── competitive-analysis/SKILL.md
│   ├── user-research-synthesis/SKILL.md
│   └── feature-prioritization/SKILL.md
├── commands/                 # Executable workflows
│   ├── market-sizing.sh
│   ├── ux-audit.py
│   └── roadmap-generator.sh
├── hooks/                    # Event-triggered automations
│   ├── competitive-monitoring.sh
│   └── user-feedback-digest.sh
└── mcp/                      # AI model connections
    ├── connections.md
    └── gpt4-research-connector.md
```

## Skill Reference

### Roadmap Planning
**When:** Quarterly planning, aligning teams on sequencing and capacity
```
Input: Prioritized features, team capacity, dependencies
Output: Phased roadmap, Gantt chart, risk flags, capacity model
Time: 2-4 hours
```

### Market Research
**When:** New market entry, TAM quantification, segment definition
```
Input: Target segment, geography, product category
Output: TAM/SAM/SOM estimates, trend analysis, competitor scan
Time: 3-6 hours
```

### Competitive Analysis
**When:** Launch positioning, competitive threats, win/loss learning
```
Input: Competitor list, feature set, positioning strategy
Output: Feature matrix, positioning map, differentiation story
Time: 2-3 hours
```

### User Research Synthesis
**When:** Feature scoping, design handoff, persona development
```
Input: Interview transcripts, survey data, usage logs
Output: Personas, jobs-to-be-done, use case map
Time: 2 hours
```

### Feature Prioritization
**When:** Sprint planning, roadmap backlog ordering, trade-off analysis
```
Input: Feature backlog, reach/impact/effort estimates
Output: Priority matrix, business case, sequencing recommendation
Time: 1-2 hours
```

## Commands

### `market-sizing.sh`
```bash
./commands/market-sizing.sh \
  --segment "enterprise-ai-ops" \
  --region "na" \
  --confidence "80"
```
Quantifies market opportunity (TAM/SAM/SOM) with sensitivity analysis.

**Output:**
```
Market Sizing Report: Enterprise AI Ops (North America)
═════════════════════════════════════════════════════
TAM (100% capture)     : $8.4B
SAM (addressable)      : $2.1B
SOM (year 1 target)    : $45M (2.1% SAM)
Confidence interval    : 70-90%
Key assumptions        : [listed]
Sensitivity analysis   : [scenario table]
```

### `ux-audit.py`
```bash
python commands/ux-audit.py \
  --product "our-ai-tool" \
  --competitor "openai-api" \
  --dimension "onboarding"
```
Side-by-side UX comparison, friction point analysis.

**Output:**
```
UX Audit: Onboarding Flow
═══════════════════════════════════════════════
Metric          | Our Tool    | Competitor    | Gap
─────────────────────────────────────────────
First API call  | 5 mins      | 8 mins        | 37% better
Auth setup      | 2 steps     | 3 steps       | Simpler
Docs quality    | Incomplete  | Extensive     | -30 points
Error handling  | Generic     | Contextual    | -2 stars
────────────────────────────────────────────────
Recommendation: Improve API docs, add context-aware errors
```

### `roadmap-generator.sh`
```bash
./commands/roadmap-generator.sh \
  --themes "rag,agentic" \
  --quarters 4 \
  --team-velocity 13
```
Capacity-constrained multi-quarter roadmap with risk flagging.

**Output:**
```
4-Quarter Roadmap (Velocity: 13 points/sprint)
═════════════════════════════════════════════════════
Q2 2026 (Committed)
├─ RAG foundations           [7 points] [Complete]
├─ Vector DB integration     [6 points] [On track]
└─ Capacity: 13/13 (100%)

Q3 2026 (Planned)
├─ Agentic workflows         [9 points] [Some risk]
├─ Tool use framework        [5 points] [Blocked: RAG]
└─ Capacity: 14/13 (🚩 OVER)

Dependencies:
  Agentic Workflows ← RAG foundations (Q2)
  Tool use framework ← Agentic workflows (Q3)

Risk flags:
  🚩 Q3 overloaded (14/13 points)
  🚩 Tool use framework at risk due to RAG delays
```

## Hooks

### `competitive-monitoring.sh`
- **Schedule:** Weekly, Monday 9 AM
- **Action:** Scans competitor announcements, press releases, social media
- **Output:** Slack notification + markdown report in `logs/competitive-monitor.md`
- **Enable:** Add to settings.json hooks configuration

### `user-feedback-digest.sh`
- **Schedule:** Daily, 3 PM
- **Action:** Aggregates support tickets, survey responses, feedback channels
- **Output:** Email digest + theme analysis
- **Enable:** Add to settings.json hooks configuration

## MCP Connections

### GPT-4 Research Connector
Integrates OpenAI API for:
- Market trend analysis
- Competitive intelligence summarization
- Research synthesis at scale

**Configuration:**
```json
{
  "mcp": {
    "gpt4-research": {
      "type": "openai-api",
      "model": "gpt-4-turbo",
      "api_key": "sk-...",
      "max_tokens": 4096
    }
  }
}
```

## Best Practices

### Research Quality
1. Quantify all assumptions (TAM estimates, user counts, conversion rates)
2. Always validate with primary research (interviews, surveys)
3. Document data sources and confidence intervals
4. Update forecasts monthly with actual vs. expected

### Cross-Functional Communication
- Create decision memos (problem → options → recommendation → trade-offs)
- Share roadmap rationale, not just timeline
- Use shared mental models (personas, JTBD, ICP)

### Feedback Loops
- Close the loop: shipped feature → metrics → research learning
- Conduct win/loss interviews post-launch
- Build quarterly learning cycles

## Example Workflow

**Scenario:** Competitor launches RAG feature. What's our move?

```
1. Competitive monitoring hook fires
   → Flags: Competitor X launches retrieval-augmented generation

2. Run competitive-analysis skill
   /ai-pm-competitive-grid --competitors="gpt-4,claude,llama"
   → Feature matrix shows RAG gap

3. Run market-research skill
   ./commands/market-sizing.sh --segment="rag-applications"
   → TAM shifted by 40% toward RAG solutions

4. Update roadmap
   ./commands/roadmap-generator.sh --reorder="rag"
   → Pulls RAG feature from Q3 → Q2, flags capacity risk

5. Validate with users
   /ai-pm-user-research-synthesis --topic="rag-jobs"
   → 7 interviews confirm RAG is top JTBD

6. Share decision memo
   → "Why we're accelerating RAG: market signal + customer demand + revenue impact"

7. Close feedback loop
   → After shipping: measure adoption, conduct win/loss, update TAM model
```

## Glossary

- **RICE:** Reach × Impact ÷ Confidence ÷ Effort (prioritization model)
- **TAM/SAM/SOM:** Total/Serviceable/Serviceable Obtainable Market
- **ICP:** Ideal Customer Profile (firmographic criteria)
- **JTBD:** Jobs-to-be-Done (functional/emotional job customer wants done)
- **Positioning:** Unique value promise relative to alternatives
- **Win/Loss:** Post-sale interview on decision logic
- **OKR:** Objectives & Key Results (goal-setting framework)

## Support & Contribution

This stack is maintained as part of the Claudient knowledge system. Contributions welcome—update CLAUDE.md identity or add new skills following the SKILL.md format in `skills/`.

**Last updated:** June 15, 2026 | **Status:** Production | **Model:** Haiku/Sonnet
