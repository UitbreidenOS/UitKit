# Feature Prioritization

## When to activate

You have a backlog of features and need to rank them by impact, effort, and confidence. Use this skill for sprint planning, roadmap backlog ordering, trade-off decisions, or quarterly prioritization cycles.

---

## When NOT to use

- For multi-quarter roadmap planning (use Roadmap Planning instead)
- For deciding whether to enter a market (use Market Research)
- For understanding what customers actually want (use User Research Synthesis first)
- For tactical bug/hotfix triage (not strategic prioritization)

---

## Instructions

### Step 1: Assemble the Backlog

**Gather all features/projects in the backlog:**

Sources:
- Roadmap ideas (from executives, board)
- Customer requests (from sales, support, users)
- Technical debt (from engineering)
- Competitive response (from competitive analysis)
- Team-generated ideas (from brainstorms)

**Template to organize:**

```markdown
## Feature Backlog (Assembled)

| ID | Feature Name | Source | Status | Notes |
|----|--------------|--------|--------|-------|
| 1 | Latency monitoring | Research | Backlog | Customer pain (5/7 interviews) |
| 2 | Cost tracking | Research | Backlog | Customer pain (4/7 interviews) |
| 3 | Model A/B testing | Research | Backlog | Customer request (3/7 interviews) |
| 4 | SOC 2 Type II | Compliance | Backlog | Need for enterprise deals |
| 5 | Custom model support | Competitive | Backlog | Datadog doesn't have; customer ask |
| 6 | Slack integration | Feature request | Backlog | Nice-to-have; 5 requests |
| 7 | Multi-region deployment | Technical debt | Backlog | Scaling requirement |
| 8 | Alert rule templates | Nice-to-have | Backlog | Would accelerate config |
| 9 | GraphQL API | Tech excellence | Backlog | Better than REST for this use case |
| 10 | Fine-tuning support | Customer request | Backlog | 2 customers asked |

Total: 10 items in backlog
```

### Step 2: Define Prioritization Framework

**Choose a framework** to score features consistently.

**Option A: RICE (Reach × Impact ÷ Confidence ÷ Effort)** ← Most Common

```
RICE Score = (Reach × Impact × Confidence) ÷ Effort

Where:
  Reach = # of people impacted per quarter (or # of revenue impact)
  Impact = How much does this help them? (1=minimal, 3=high, 10=game-changing)
  Confidence = % chance this achieves expected impact (0-100%)
  Effort = Person-months to build (1, 2, 3, 5, 8...)

Example: Latency monitoring
  Reach = 1,000 engineers using product (Q1 target)
  Impact = 10 (saves 10+ hours/month per engineer; mission-critical)
  Confidence = 85% (validated in research, clear use case)
  Effort = 3 person-months (complex feature)
  
  RICE = (1000 × 10 × 0.85) ÷ 3 = 8500 ÷ 3 = 2,833
```

**Option B: MoSCoW (Must, Should, Could, Won't)**

```
Must: Required for product viability / deal-closing (gate features)
Should: High-value; ship if capacity (revenue drivers)
Could: Nice-to-have; ship if extra capacity
Won't: Defer to future quarter (deprioritized)

Example:
  Must: Latency monitoring, cost tracking (core product)
  Should: A/B testing, SOC 2 (high-value additions)
  Could: Slack integration, fine-tuning (nice-to-have)
  Won't: GraphQL API, alert templates (technical, not customer-facing)
```

**Option C: Value vs. Effort (2D Matrix)**

```
          High Impact
              ↑
              |    [Quick wins]   [Major projects]
              | Must    ↑           Should
        Medium│       ↑               ↓
              |         ↓         Won't
              |        Could       ↑
              |         ↓
         Low Impact
              └────────────────────→
                  Low Effort      High Effort

Quadrants:
  Quick wins (high impact, low effort) → Do first
  Major projects (high impact, high effort) → Do second (requires resources)
  Could haves (low impact, low effort) → Do if capacity
  Time sinks (low impact, high effort) → Don't do
```

**Recommendation: Use RICE if possible** (quantifies trade-offs better than MoSCoW).

### Step 3: Score Each Feature

**Fill in RICE scores for every backlog item.**

**Template:**

```markdown
## RICE Scoring

| ID | Feature | Reach | Impact | Conf % | Effort | RICE Score | Rank |
|----|---------|-------|--------|--------|--------|------------|------|
| 1 | Latency monitoring | 1000 | 10 | 85% | 3 | 2,833 | 1 |
| 2 | Cost tracking | 800 | 8 | 80% | 2 | 2,560 | 2 |
| 3 | Model A/B testing | 400 | 9 | 70% | 4 | 1,260 | 3 |
| 4 | SOC 2 Type II | 50 | 10 | 100% | 5 | 1,000 | 4 |
| 5 | Custom model support | 200 | 8 | 75% | 3 | 400 | 5 |
| 6 | Slack integration | 100 | 3 | 80% | 1 | 240 | 6 |
| 7 | Multi-region deploy | 800 | 5 | 50% | 6 | 333 | 7 |
| 8 | Alert templates | 300 | 4 | 60% | 1 | 720 | 8 |
| 9 | GraphQL API | 100 | 3 | 40% | 3 | 40 | 9 |
| 10 | Fine-tuning support | 30 | 7 | 50% | 4 | 263 | 10 |

Interpretation:
- Top 3 features (latency, cost, A/B testing) have RICE > 1,000
- These should be in Q2 roadmap
- SOC 2 and custom models are important but lower RICE (smaller reach)
```

**How to estimate each dimension:**

**Reach:** Who is impacted?
```
Reach quantification:
  Option 1: # of users/customers (multiply by attachment rate if not everyone)
    Example: 1,000 engineers × 100% = 1,000 reach
  Option 2: Revenue impact ($ affected)
    Example: Latency feature enables 50 new customers × $100K ACV = $5M reach
  Option 3: % of user base (convert to # affected)
    Example: 30% of 1,000 users = 300 reach

Guidance: Use customer count if B2B SaaS; use revenue if high variance in value
```

**Impact:** How much does it help them?
```
Impact scoring (1-10 scale):
  10 = Game-changing (mission-critical, major workflow improvement)
  7 = Significant (high-value, addresses important pain)
  3 = Moderate (nice-to-have, incremental improvement)
  1 = Minimal (extremely niche, low-value)

Examples:
  Latency monitoring = 10 (mission-critical; saves 10+ hours/month)
  Cost tracking = 8 (high-value; enables optimization)
  Slack integration = 3 (nice-to-have; convenience, not core workflow)
  Alert templates = 4 (moderate; accelerates configuration)
```

**Confidence:** How sure are we this will work?
```
Confidence estimation:
  100% = Validated feature; customer signed; use case proven
  80-90% = Strong signal from research; likely to achieve impact
  50-70% = Hypothesis validated; some unknowns; will likely work
  <50% = Speculative; high risk of not hitting projected impact

Examples:
  Latency monitoring = 85% (validated in 5/7 customer interviews; clear use case)
  SOC 2 compliance = 100% (explicit requirement; customers will pay for it)
  GraphQL API = 40% (technical preference; unclear if customers care)
  Fine-tuning = 50% (2 customers asked; may not represent market)
```

**Effort:** How long will it take?
```
Effort estimation (in person-months):
  1 month = One engineer, 1 sprint
  2 months = One engineer, 2 sprints or two engineers, 1 sprint
  3 months = One engineer, 3 sprints
  5 months = Major feature; multiple engineers; multiple sprints
  8 months = Very large feature; team commitment for full quarter

How to estimate:
  1. Break feature into components (API, UI, infrastructure, testing)
  2. Estimate each component (small = 1 week, medium = 2-3 weeks, large = 1 month)
  3. Sum components; add 20-30% buffer for unknowns
  4. Divide by # of engineers assigned

Examples:
  Latency monitoring = 3 months (API 1mo + UI 1mo + infrastructure 1mo)
  Cost tracking = 2 months (API 1mo + UI 1mo)
  A/B testing = 4 months (framework 2mo + UI 1mo + analytics 1mo)
```

### Step 4: Validate Scores with Team

**RICE is as good as your estimates.** Review with engineering, product, leadership.

**Workshop agenda (1 hour):**
```
1. Present top 5 features + their RICE scores (10 min)
2. Open discussion on estimates (especially controversial scores)
   - "Is latency really a 10/10 impact?" (no → revise)
   - "Is A/B testing really 4 person-months?" (no → revise)
   - "Are we confident about custom model reach?" (no → lower confidence)
3. Finalize revised scores (20 min)
4. Agree on committed features for next quarter (20 min)
5. Document assumptions (10 min)
```

**Common scoring disagreements:**

| Disagreement | How to Resolve |
|---|---|
| Impact of feature X overstated | Run small customer conversations to validate |
| Effort is 3mo not 5mo | Engineering leads spike; build prototype; validate |
| Reach estimate is too high | Look at TAM; customer interviews; sales data |
| Confidence is 100% but risky | Lower to 60-70%; accept lower RICE |

### Step 5: Set Capacity Constraint

**How many RICE points can we ship this quarter?**

**Calculation:**

```
Team capacity: 3 engineers
Velocity: 9 story points/sprint (your team's historical rate)
Sprints per quarter: 3
Total points: 3 engineers × 9 points/sprint × 3 sprints = 81 points

Buffer for bugs/unplanned work: 20%
Net capacity: 81 × 0.8 = 65 points/quarter

BUT: RICE uses effort in person-months, not story points.
Convert: 1 person-month ≈ 9 story points (1 sprint)
So: 65 points = ~7 person-months capacity
```

**Alternative calculation (simpler):**

```
Team size: 3 engineers
Sprints: 3/quarter
Effort units: person-months per feature
Available capacity: 3 engineers × 3 months = 9 person-months/quarter
Buffer (20%): -1.8 person-months
Net capacity: 7.2 person-months (round to 7)
```

### Step 6: Select Features Against Capacity

**Allocate RICE-ranked features to quarters, respecting capacity.**

**Algorithm:**

```
1. Sort features by RICE score (highest first)
2. For each quarter, select features starting from top:
   a. Add feature to backlog IF total effort ≤ capacity
   b. If effort > capacity, skip to next (don't overcommit)
   c. If reaching end of backlog AND capacity not full, add High Confidence items
3. Document why features were deferred (capacity, dependencies, strategic reasons)
```

**Worked example:**

```
Capacity: 7 person-months/quarter
Team: 3 engineers

Q2 Allocation:
✓ Latency monitoring (RICE 2,833; effort 3mo) → 3/7 committed
✓ Cost tracking (RICE 2,560; effort 2mo) → 5/7 committed
✗ Model A/B testing (RICE 1,260; effort 4mo) → Would be 9/7; SKIP
✓ SOC 2 Type II (RICE 1,000; effort 5mo) → Can we fit? 10/7; OVER CAPACITY

Conflict: We can't fit both A/B testing and SOC 2 in Q2.
Decision: Prioritize Latency + Cost + A/B testing (9mo; over capacity by 2mo)
           OR: Latency + Cost + SOC 2 (10mo; over by 3mo)

Resolution: Engineering estimates effort; PM decides priority
  Scenario A (Latency + Cost + A/B): Core product features, revenue-driving
  Scenario B (Latency + Cost + SOC 2): Core product + compliance (enables enterprise deals)

Decision: Scenario B (Latency + Cost + SOC 2)
Reason: SOC 2 is gate for 3-5 enterprise customers; enables $500K+ ARR
Impact: A/B testing deferred to Q3

Q2 Final Roadmap:
  Latency monitoring (3mo) → Committed
  Cost tracking (2mo) → Committed
  SOC 2 Type II (5mo) → Committed
  Total: 10/7 (143% → OVERLOADED)

Problem: We're over capacity. Options:
  A) Hire 1 engineer (ramp Q1, productive Q2 end)
  B) Reduce scope (e.g., SOC 2 compliance partial: basic audit logging, defer full compliance)
  C) Extend timeline (push 1 feature to Q3)
  D) Accept 10 month sprint (likely to slip)

Decision: Option B (reduce SOC 2 scope to 2 person-months)
  SOC 2 Phase 1: Audit logging, basic data encryption (2mo)
  SOC 2 Phase 2: Full compliance testing (3mo, Q3)

Final Q2: 7/7 (100% capacity)
  Latency monitoring (3mo)
  Cost tracking (2mo)
  SOC 2 Phase 1 (2mo)
```

### Step 7: Create Prioritization Deliverable

**Format: Quarterly Prioritization Report (4-6 pages)**

```markdown
# Feature Prioritization: Q2 2026

## Executive Summary

**Method:** RICE scoring (Reach × Impact ÷ Confidence ÷ Effort)

**Team capacity:** 3 engineers × 3 months = 9 person-months available

**Result:** 3 features prioritized for Q2:
1. Latency monitoring (RICE 2,833)
2. Cost tracking (RICE 2,560)
3. SOC 2 Phase 1 (RICE 1,000, scoped)

**Deferred to Q3:** Model A/B testing (RICE 1,260; would overload Q2)

**Confidence:** High (top 2 features validated in customer research; SOC 2 is gate)

---

## Prioritization Scoring

### RICE Methodology

RICE Score = (Reach × Impact) ÷ (Confidence × Effort)

Where:
- **Reach:** # customers impacted per quarter
- **Impact:** How much it helps them (1-10 scale)
- **Confidence:** % chance it achieves expected impact
- **Effort:** Person-months to build

### Full Backlog Scored

| Rank | Feature | Reach | Impact | Conf % | Effort (mo) | RICE | Q2? |
|------|---------|-------|--------|--------|-------------|------|-----|
| 1 | Latency monitoring | 1,000 | 10 | 85% | 3 | 2,833 | ✓ |
| 2 | Cost tracking | 800 | 8 | 80% | 2 | 2,560 | ✓ |
| 3 | Model A/B testing | 400 | 9 | 70% | 4 | 1,260 | ✗ |
| 4 | SOC 2 Type II | 50 | 10 | 100% | 5 | 1,000 | ✓ (scoped) |
| 5 | Custom models | 200 | 8 | 75% | 3 | 400 | ✗ |
| 6 | Slack integration | 100 | 3 | 80% | 1 | 240 | ✗ |
| 7 | Multi-region | 800 | 5 | 50% | 6 | 333 | ✗ |
| 8 | Alert templates | 300 | 4 | 60% | 1 | 720 | ✗ |
| 9 | GraphQL API | 100 | 3 | 40% | 3 | 40 | ✗ |
| 10 | Fine-tuning | 30 | 7 | 50% | 4 | 263 | ✗ |

---

## Q2 Committed Features

### Feature 1: Latency Monitoring

**RICE Score:** 2,833 (Rank #1)

**Metrics:**
- Reach: 1,000 customers
- Impact: 10/10 (mission-critical; saves 10+ hours/month per engineer)
- Confidence: 85% (validated in 5/7 customer interviews)
- Effort: 3 person-months

**Business case:**
- Enables core value prop: real-time visibility into model performance
- Accelerates time-to-first-value (critical for product-led growth)
- Differentiates vs. general observability tools (Datadog)

**Success metrics:**
- Latency detection <5 minutes (vs. 2-3 hours today)
- Adoption: 80% of paying customers use feature within 30 days
- NPS driver: Latency monitoring should be top-3 reason customers chose us

---

### Feature 2: Cost Tracking

**RICE Score:** 2,560 (Rank #2)

**Metrics:**
- Reach: 800 customers
- Impact: 8/10 (high-value; enables cost optimization workflow)
- Confidence: 80% (validated in 4/7 customer interviews)
- Effort: 2 person-months

**Business case:**
- Answers "Which models are expensive?" (blocking question today)
- Enables upsell: cost optimization becomes premium feature
- Finance alignment: proves ROI of AI inference to CFOs

**Success metrics:**
- Cost visibility: 80% of customers can see cost by model (vs. 0% today)
- Upsell: 20% of customers upgrade to premium tier for cost optimization
- NPS driver: Cost transparency mentioned as reason for selection

---

### Feature 3: SOC 2 Type II (Partial)

**RICE Score:** 1,000 (Rank #4, scoped)

**Metrics:**
- Reach: 50 customers (enterprise deals)
- Impact: 10/10 (gate for enterprise contracts)
- Confidence: 100% (explicit customer requirement)
- Effort: 2 person-months (Phase 1 only; not full compliance)

**Business case:**
- Required for enterprise deals (5+ customers waiting)
- Estimated revenue: 5 customers × $200K ACV = $1M ARR
- Competitive parity: Datadog has SOC 2; we don't yet

**Scope (Phase 1 only):**
- Audit logging (track data access, changes)
- Encryption at rest (basic; not full compliance)
- Data retention policies (basic)
- **Not included:** Full compliance testing, penetration testing (Phase 2, Q3)

**Success metrics:**
- Audit logging production-ready by EOQ2
- Enterprise customers can use data for their SOC 2 audits
- Phase 1 paves way for full SOC 2 in Q3

---

## Q3 Candidate Features (Deferred from Q2)

### Model A/B Testing (Deferred to Q3)

**RICE Score:** 1,260 (Rank #3)

**Why deferred:**
- Effort: 4 person-months
- Q2 capacity: 9 person-months
- Q2 committed: 3 + 2 + 2 = 7 person-months
- Remaining capacity: 2 person-months (insufficient)

**Decision rationale:**
- SOC 2 Phase 1 (2mo) provides more value per effort (enterprise gate)
- A/B testing is important but less urgent (no customers blocked yet)
- Can ship in Q3 if engineering is productive in Q2

**Q3 plan:**
- If team hits Q2 velocity targets → Fast-track A/B testing to Q3 Week 1
- If team misses Q2 → A/B testing slips to Q3 Week 2-3

---

## Capacity Analysis

### Team Capacity
```
Team: 3 engineers (assumed constant, no hiring in Q2)
Sprints/quarter: 3
Velocity: 9 points/sprint
Total capacity: 3 × 3 × 9 = 81 story points

Convert to person-months: 81 points ÷ 9 points/mo = 9 person-months

Buffer for bugs/interrupts: 20%
Net capacity: 9 × 0.8 = 7.2 person-months
```

### Q2 Allocation

| Feature | Effort | % of Capacity | Status |
|---------|--------|---------------|--------|
| Latency monitoring | 3 mo | 43% | Committed |
| Cost tracking | 2 mo | 29% | Committed |
| SOC 2 Phase 1 | 2 mo | 28% | Committed |
| **Total** | **7 mo** | **100%** | **Locked** |

**Utilization:** Exactly at capacity (no slack; high risk of slip)

**Contingency:**
- If any feature faces technical blocker, immediately pull Alert Templates (1mo) from backlog
- Weekly burndown monitoring; escalate if >1 week behind

---

## Why These Features vs. Alternatives

### Why Latency > A/B Testing?
```
Latency monitoring:  RICE 2,833 (mission-critical pain from 5 customers)
Model A/B testing:   RICE 1,260 (nice-to-have from 3 customers)

Rationale: Latency is blocking current customers. A/B testing is enabling 
future data scientists. Latency is prerequisite.
```

### Why SOC 2 Phase 1 > Custom Models?
```
SOC 2 Phase 1 (2mo):    RICE 1,000 (gates 5 enterprise deals, $1M ARR)
Custom models (3mo):    RICE 400 (nice-to-have from 2 customers)

Rationale: SOC 2 has clearer business case (revenue gates). Custom models 
can wait; customers can use cloud models in interim.
```

### Why not overcommit to 10-12 months?
```
Risk of overcommit:
- Q2 already tight (exactly 100% capacity)
- No buffer for bugs, customer escalations, unknowns
- Historical velocity may slip due to external factors
- Demoralization (team sees deadline slip)

Better approach: Lock 7 months; celebrate if we ship bonus feature
```

---

## Risk Register (Effort Estimates)

| Feature | Risk | Probability | Mitigation |
|---------|------|-------------|-----------|
| **Latency monitoring** | Effort underestimated (4mo vs. 3mo) | Medium | Spike first sprint; architecture review with CTO |
| **Cost tracking** | Accuracy of cost model (hard to calculate) | Medium | Work with finance; validate with 3 customers early |
| **SOC 2 Phase 1** | Compliance scope creep (customer asks for more) | High | Document Phase 1 scope clearly; defer Phase 2 to Q3 |
| **General** | Velocity drops due to bugs/tech debt | Medium | Weekly standups; prioritize bugs over features |

---

## Measurement & Trade-off Rules

### Success Metrics for Q2
```
Primary: Ship latency + cost on schedule (by end-May)
Secondary: Enterprise deals closed with SOC 2 commitment (by end-Q2)
Tertiary: NPS increase (latency/cost features mentioned as drivers)
```

### Escalation Triggers (If Hit, Rethink)
```
- Any committed feature >20% behind schedule (escalate to CTO)
- Any customer escalation requiring team >5 hours/week (pause features)
- Any bug requiring >2 days to fix (evaluate tech debt)
- Velocity drops >20% (reassess capacity)
```

### Trade-off Framework (If We Must Reprioritize)
```
If latency feature gets blocked → Reduce cost tracking scope, keep SOC 2
If cost tracking gets blocked → Reduce SOC 2 Phase 1, keep latency
If SOC 2 gets blocked → Fast-track A/B testing, defer compliance to Q3

Rationale: Latency + cost are core product; SOC 2 is enterprise unlocking.
A/B testing is optional (not customer-blocking).
```

---

## How This Connects to Roadmap

**Roadmap (from Roadmap Planning skill):**
- Q2 theme: Conversational AI Foundations
- Q2 features: Multi-turn + RAG integration

**Prioritization (this document):**
- Q2 features: Latency + Cost + SOC 2 Phase 1

**Reconciliation:**
```
Wait, these are different features! Why?

Answer: This prioritization doc is for a different product (AI Ops platform).
In a real scenario, you'd reconcile:
  Roadmap: What we promised to customers/board
  Prioritization: How we sequence engineering work

If mismatch: Roadmap drives prioritization. Escalate if Roadmap can't
fit in available capacity.
```

---

## Appendix: Backlog Beyond Q2

### Q3 Priorities (Tentative)
1. Model A/B testing (RICE 1,260; 4 months)
2. SOC 2 Phase 2 (RICE 900; 3 months)
3. Custom model support (RICE 400; 3 months)

### Q4 Priorities (Tentative)
1. Multi-region deployment (RICE 333; 6 months) — long-running
2. Slack integration (RICE 240; 1 month)
3. Alert templates (RICE 720; 1 month)
4. Fine-tuning support (RICE 263; 4 months)

### Features in "Won't" Category (Deferring >12 months)
- GraphQL API (RICE 40; low value; REST API sufficient)
- Other technical debt (lower priority than customer-facing)

---

**Report prepared:** June 15, 2026  
**Prioritization method:** RICE  
**Confidence:** High (based on customer research + engineering estimates)  
**Review cadence:** Monthly (reprioritize if conditions change)  
**Next gate:** Mid-July (Q2 progress review; adjust Q3 if needed)
```

---

## Example

AI Ops platform feature prioritization (Q2 2026):
- **Method:** RICE scoring
- **Top 3 features:** Latency (RICE 2,833) → Cost (2,560) → A/B testing (1,260)
- **Committed to Q2:** Latency + Cost + SOC 2 Phase 1 (exactly 7mo capacity)
- **Deferred to Q3:** A/B testing (would overflow capacity)
- **Decision rationale:** Latency/cost are core product (customer-validated); A/B testing is enabling but lower urgency
- **Risk:** At 100% capacity; any slip cascades to other features

---

## Tools & Templates

**RICE scoring template:**
```markdown
| Feature | Reach | Impact | Confidence | Effort | RICE | Rank |
|---------|-------|--------|------------|--------|------|------|
| [Name] | [#] | [1-10] | [%] | [mo] | = | [Rank] |
```

**Capacity calculation template:**
```
Team size: [X engineers]
Sprints/quarter: [3]
Velocity: [Y points/sprint]
Total capacity: X × 3 × Y = [Z points]
Buffer (20%): -[Z×0.2]
Net capacity: [Z×0.8] person-months
```

**Trade-off template:**
```
Option A: [Features + effort]
  Business case: [Why this wins]
  Risk: [What could go wrong]

Option B: [Features + effort]
  Business case: [Why this wins]
  Risk: [What could go wrong]

Decision: [Choose A or B]
Rationale: [Why we chose this option]
```

