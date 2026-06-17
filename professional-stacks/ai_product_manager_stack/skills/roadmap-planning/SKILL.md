# Roadmap Planning

## When to activate

You need to sequence features across 2+ quarters, align stakeholders on dependencies, or model team capacity constraints. Use this skill for quarterly planning cycles, major product strategy shifts, or when capacity allocation becomes contentious.

---

## When NOT to use

- For single-sprint backlog prioritization (use Feature Prioritization instead)
- When market direction is completely unclear (validate assumptions first with Market Research)
- If you lack engineering velocity estimates or team size (gather baseline data first)
- For tactical bug fixes or technical debt threads (roadmap is strategic, not tactical)

---

## Instructions

### Step 1: Gather Input Data

**Required:**
- Feature backlog (with estimated effort: S/M/L or story points)
- Team capacity (points per sprint, number of sprints per quarter)
- Strategic themes (OKRs, business priorities, competitive pressures)
- Known dependencies (feature A must ship before feature B)

**Optional but valuable:**
- Risk flags from technical team (what could delay us?)
- Customer commitments (contracts with timeline requirements)
- Competitive threat timeline (when do we need to respond?)
- Resource constraints (shared resources, hiring delays)

**Template to gather data:**
```markdown
## Roadmap Input

### Team Capacity
- Team size: [X engineers]
- Velocity: [Y points/sprint]
- Sprints per quarter: [Usually 3]
- Quarterly capacity: Y × 3 = [Z points/quarter]
- Buffer for bugs/debt: [20-30% typically]
- Net capacity: [Z × 0.7 to 0.8]

### Prioritized Backlog (Top 20 features)
| Feature | Theme | Points | RICE Score | Notes |
|---------|-------|--------|------------|-------|
| [Feature 1] | [Theme] | [Points] | [Score] | [Dependencies] |
| [Feature 2] | [Theme] | [Points] | [Score] | [Dependencies] |

### Strategic Themes (Next 4 quarters)
- Q2: [Theme] — rationale
- Q3: [Theme] — rationale
- Q4: [Theme] — rationale
- Q1 2027: [Theme] — rationale

### Known Dependencies
- Feature B ← Feature A (must complete first)
- Feature D ← Feature C (must complete first)

### Risk Flags
- [Risk] — Probability: [H/M/L], Mitigation: [how]
```

### Step 2: Build the Roadmap Framework

Create a **quarterly structure** using this model:

```
Q2 2026 (13 weeks × 3 = 39 work days available)
├─ Committed (75% capacity = 19 days)
├─ High Confidence (15% capacity = 3 days)  
└─ At-Risk (10% capacity = 2 days, watch closely)

Q3 2026
├─ Committed (75%)
├─ High Confidence (15%)
└─ At-Risk (10%)
```

**Why this structure?**
- **Committed:** Validated features, dependencies clear, team confident
- **High Confidence:** Likely to ship, some unknowns, good to communicate
- **At-Risk:** May slip to next quarter depending on Committed performance

### Step 3: Map Features to Quarters

**Algorithm:**
1. Sort backlog by RICE score (highest first)
2. Check for dependencies — if Feature B depends on A, A must go in earlier quarter
3. Allocate to Committed bucket first (respect capacity line)
4. Allocate overflow to High Confidence
5. Flag risks and mark as At-Risk
6. Flag anything that blocks dependent features

**Worked example:**

```
Backlog sorted by RICE:
1. Multi-turn conversations (9 pts) — no deps
2. RAG integration (11 pts) — no deps, but needed for #5
3. Model switching (5 pts) — no deps
4. Fine-tuning framework (6 pts) — no deps
5. Agentic workflows (8 pts) — depends on #2 (RAG)
6. Tool use framework (7 pts) — depends on #5 (agentic)

Capacity: 26 pts/quarter (20 available after safety buffer)

Q2 assignment:
✓ Multi-turn (9) — Committed (9/20)
✓ RAG (11) — Committed (20/20 FULL)
At capacity, must defer rest.

Q3 assignment:
✓ Model switching (5) — Committed (5/20)
✓ Fine-tuning (6) — Committed (11/20)
✓ Agentic workflows (8) — Committed (19/20, tight!)
✓ Tool use (7) — High Confidence (7 pts, but blocked by Q2 RAG)
```

### Step 4: Surface Dependencies as a Dependency Graph

```
Q2 ────────────────────────────────────────────
  ├─ Multi-turn conversations (9 pts) ✓
  └─ RAG integration (11 pts) ✓
        ↓ (must complete before Q3)

Q3 ────────────────────────────────────────────
  ├─ Model switching (5 pts) ✓
  ├─ Fine-tuning (6 pts) ✓
  ├─ Agentic workflows (8 pts) ✓ ← blocked on Q2 RAG
  └─ Tool use (7 pts) ⚠️ HIGH RISK ← blocked on Q3 Agentic

Risk flags:
  🚩 Agentic depends on Q2 RAG; if RAG slips, cascades to Q3
  🚩 Tool use is month 2 of Q3; high risk of overflow to Q4
```

### Step 5: Create the Roadmap Artifact

**Format: Quarterly Roadmap Markdown**

```markdown
# Product Roadmap: Q2-Q4 2026

## Q2 2026: Conversational AI Foundations

### Committed (19/20 points)
- **Multi-turn conversations** (9 pts)
  - Context retention across exchanges
  - Session memory management
  - Ship: End of April
  - Success: 95%+ multi-turn retention rate

- **RAG integration** (11 pts)
  - Document ingestion pipeline
  - Vector store integration (Pinecone)
  - Relevance ranking & reranking
  - Ship: Mid-May
  - Success: 85%+ NDCG@10 on benchmark

### High Confidence (0/20 points)
- Capacity fully allocated this quarter

### At-Risk
- None flagged

---

## Q3 2026: Reasoning & Agents

### Committed (19/20 points)
- **Agentic workflows** (8 pts)
  - Tool invocation framework
  - Agent loop orchestration
  - Multi-step planning
  - Ship: End of August
  - Dependencies: RAG integration (Q2)
  - Success: Users create 5+ agent recipes

- **Model switching** (5 pts)
  - Multi-model support (GPT-4, Claude, Llama)
  - Cost routing logic
  - Ship: Mid-August
  - Success: 30% of users switch models

- **Fine-tuning framework** (6 pts)
  - User-provided training data support
  - Tuning parameter UI
  - Cost estimation
  - Ship: End-August
  - Success: 10+ customers run tuning jobs

### High Confidence (7/20 points)
- **Tool use framework** (7 pts)
  - Custom tool integration
  - Tool parameter extraction
  - Error handling & retry logic
  - Ship: Early September (may overflow)
  - Dependencies: Agentic workflows (Q3)
  - Risk: Blocked by Agentic delays

### At-Risk
- 🚩 Tool use framework may slip to Q4 due to Agentic dependencies

---

## Q4 2026: Enterprise Features

### Committed (18/20 points)
- **Fine-grained access controls** (6 pts)
  - RBAC framework
  - Org/team/resource permissions
  - Audit logging
  - Success: SOC 2 Type II ready

- **Custom model endpoint support** (8 pts)
  - Self-hosted model integration
  - vLLM, Ollama, SageMaker support
  - Success: 5+ customers deploy custom models

- **Advanced monitoring** (4 pts)
  - Latency/token/cost dashboards
  - Alerting rules
  - Success: Ops teams adopt monitoring

### High Confidence (8/20 points)
- **API rate limiting** (4 pts)
  - Tier-based limits
  - Burst allowance
  - Overage billing

- **Batch processing API** (4 pts)
  - Async job submission
  - Cost optimization for large jobs
  - Success: Cost per token drops 40%

### At-Risk
- None expected; this quarter has buffer

---

## Dependencies Summary

```
Q2 RAG integration
  ↓
Q3 Agentic workflows
  ↓
Q3 Tool use framework
  ↓
Q4 [unblocked]
```

---

## Capacity Utilization

| Quarter | Committed | High Conf | At-Risk | Total | % Capacity |
|---------|-----------|-----------|---------|-------|------------|
| Q2 2026 | 20/20 pts | 0/20 pts  | 0 pts   | 20 pts | 100% ✓ |
| Q3 2026 | 19/20 pts | 7/20 pts  | 2 pts   | 28 pts | 140% 🚩 |
| Q4 2026 | 18/20 pts | 8/20 pts  | 0 pts   | 26 pts | 130% 🚩 |

**Recommendation:** Q3-Q4 overloaded by 30-40%. Either increase capacity or defer High Confidence items.

---

## Risk Register

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| RAG integration delays | Medium | High | Spike engineering; reduce scope | [Eng Lead] |
| Agentic complexity underestimated | Medium | Medium | Prototype first; validate architecture | [Tech Lead] |
| Tool use blocked if Agentic slips | High | High | Parallelize where possible; reduce scope | [PM] |
| Q3-Q4 overload causes burnout | Medium | High | Hire 1 engineer by August or defer features | [Eng Manager] |

---

## Success Metrics (Per Theme)

**Q2: Foundations**
- Multi-turn adoption: >50% of new users in first week
- RAG NDCG: 85%+ on benchmark set
- System reliability: <0.1% user-facing errors

**Q3: Agents**
- Agent creation rate: >10 recipes/day
- Tool invocation success: >95%
- Model switching adoption: 30%+

**Q4: Enterprise**
- RBAC adoption: 40%+ of enterprise customers
- Custom model deployments: 5+
- Monitoring dashboard usage: 2 logins/day per customer

---

## How Roadmap May Shift

This roadmap is live and responsive to:
- Competitive moves (flag in competitive-monitoring.sh)
- Customer churn signals (NPS drops >5 points)
- Tech blockers (if architecture spike blocks 2+ features)
- Market TAM changes (>20% shift)
- Unplanned opportunities (partnership, acquisition)

Quarterly review cadence: Lock roadmap on the 1st of each quarter; allow repriorization within locked capacity.
```

### Step 6: Share & Align

**Deliverable format:**
1. **For executives:** One-pager with theme, capacity, risks
2. **For engineering:** Detailed roadmap with dependencies, effort, technical notes
3. **For sales/CS:** Customer-friendly version (benefits, not technical details)
4. **For investors:** Narrative (why these themes, market signals, competitive response)

**Alignment meeting agenda (1 hour):**
- 10 min: Theme rationale (why these features, why now)
- 15 min: Sequencing & dependencies (why this order)
- 15 min: Capacity & risks (what could go wrong)
- 15 min: Trade-offs (what we're deferring and why)
- 5 min: Next steps (owners, review cadence)

### Step 7: Maintain Through Quarter

**Weekly standup review:**
- Burndown: Are we tracking to committed?
- Blockers: Are dependencies on track?
- Scope creep: Any unplanned work sneaking in?

**Risk escalation triggers:**
- Any Committed feature >20% behind schedule
- Any dependency at risk of missing its window
- Any At-Risk item trending toward Committed
- New higher-priority item requiring reallocation

**Mid-quarter repriorization (if needed):**
- Did market conditions shift materially?
- Did a competitor make us react?
- Did customer churn signal a need to change?
- If yes: convene 30-min alignment, adjust High Confidence, communicate change

---

## Example: AI Ops Platform (Real-world)

```
Team: 4 engineers, 1 TPM
Velocity: 9 points/sprint, 3 sprints/quarter = 27 points
Buffer (30%): 8 points
Net capacity: 19 points/quarter

Q2 2026: RAG + Evaluation
- Backtested retrieval (8 pts) [Committed]
- Cost optimization (11 pts) [Committed, tight!]
- Total: 19 pts (100% of net capacity)

Q3 2026: Agentic + Scaling
- Tool integrations (7 pts) [Committed]
- Async execution (6 pts) [Committed]
- Model routing (5 pts) [High Confidence, at-risk]
- Total: 18 pts [Committed], 5 pts [High Confidence]
  → Q3 looks healthy; Q3 model routing can slip to Q4 if needed

Q4 2026: Enterprise + Reliability
- Fine-grained RBAC (8 pts) [Committed]
- Monitoring dashboards (6 pts) [Committed]
- SLA management (4 pts) [High Confidence]
- Total: 14 pts [Committed], 4 pts [High Confidence]
  → Light quarter; good for debt paydown

Risks:
- If RAG (Q2) slips by 2+ weeks, cascades to Tool integration (Q3)
- Agentic complexity may exceed 12 points (current split is 7+6)
  Mitigation: Spike first sprint of Q3; architecture review with CTO
```

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Roadmap ignores dependencies | Dependencies felt invisible in planning | Build dependency graph before assigning quarters |
| Over-committing (120%+ capacity) | Feature pressure, FOMO on competitive threats | Lock Committed at 75% capacity; use High Confidence as buffer |
| Features slip without consequence | No mechanism to escalate or reprioritize | Weekly burndown + risk register; mid-quarter repriorization trigger |
| Roadmap doesn't talk to technical feasibility | PM and Eng teams planning separately | Joint planning session; Eng estimates effort, not PM guessing |
| Roadmap disconnected from user research | Features picked by intuition, not validation | Each Committed feature tied to RICE score from User Research Synthesis |
| Roadmap never shipped | Scope creep + one-off requests | Lock Committed; redirect asks to High Confidence or next quarter |

---

## Tools & Templates

**Gantt chart template (Markdown):**
```markdown
## Q2 2026 Timeline

    Week    1   2   3   4   5   6   7   8   9  10  11  12  13
    Feat1:  [=======]
    Feat2:      [==============]
    Feat3:              [=====] (blocked on Feat2)
```

**Capacity model (spreadsheet CSV):**
```
Feature,Points,Q2,Q3,Q4,Dependencies,RICE
Multi-turn,9,✓,,,None,78
RAG,11,✓,,,None,85
Model switching,5,,✓,,None,52
Agentic,8,,✓,,RAG,68
Tool use,7,,✓,,Agentic,55
```

**Risk register template:**
```
| Feature | Risk | Prob | Impact | Mitigation | Status |
|---------|------|------|--------|------------|--------|
| RAG | Inference latency | M | H | Cache warm, optimize reranker | Monitoring |
```

---

## Example

See `/ai_product_manager_stack/README.md` — `roadmap-generator.sh` section for a worked example of generating a 4-quarter roadmap from scratch.

