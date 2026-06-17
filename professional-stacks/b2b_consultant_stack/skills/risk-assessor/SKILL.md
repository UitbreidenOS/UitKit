---
name: risk-assessor
description: Identifies, rates, and mitigates key execution risks for strategic recommendations, organizational changes, or deal structures. Produces risk register with impact/probability matrix, mitigation strategies, contingency triggers, and escalation paths. Output: 1–2 page risk assessment document with prioritized risk list and response plan.
allowed-tools: Read, Write
effort: medium
---

# Risk Assessor

## When to activate
Before recommending any major strategic initiative, roadmap phase, or commercial term. Use to validate that risks are understood and mitigated, not to block execution. Run before presenting to client's leadership team.

## When NOT to use
Skip for low-risk recommendations (minor process changes, tactical optimizations). Skip if risk assessment was already completed and approved by leadership.

## Instructions

### Step 1: Identify Risk Categories

Map risks across 5 domains (Org / Execution / Market / Financial / Technology):

**Organizational Risks**
- Executive alignment: CEO, CFO, board buy-in; competing priorities
- Culture & talent: Resistance to change; key person departures
- Incentives: Compensation models don't align with strategy
- Decision velocity: Org slow to make decisions; decision-making unclear

**Execution Risks**
- Scope creep: Deliverables balloon; timeline extends
- Resource constraints: Team too small; competing priorities
- Vendor / partner dependencies: Third-party delays; capacity issues
- Change management: Team untrained or unwilling to adopt new process

**Market Risks**
- Demand validation: Uncertain market appetite for opportunity
- Competitive response: Competitor launches faster; market shifts
- Regulatory: Compliance requirements change; legal complications
- Customer concentration: Loss of key customer; contract non-renewal

**Financial Risks**
- Budget approval: CFO blocks investment; insufficient capital
- Cost overruns: Build costs exceed plan; unexpected expenses
- ROI realization: Revenue / savings materialize slower than expected
- Funding: Runway concerns if opportunity takes longer than planned

**Technology Risks**
- System integration: Legacy systems don't integrate; unexpected build complexity
- Scalability: Technology doesn't scale to production load
- Data quality: Insufficient data to execute on plan
- Technical debt: Foundation issues delay feature development

### Step 2: Rate Risk Impact & Probability

For each identified risk, score on 5-point scale:

**Impact (Business Consequence)**
- 5 = Catastrophic (threatens company viability; deal dies; >$10M loss)
- 4 = Critical (major delay; revenue impact $1–10M)
- 3 = High (moderate delay; revenue impact $100K–1M)
- 2 = Medium (minor delay; revenue impact <$100K)
- 1 = Low (negligible impact; process slowdown only)

**Probability (Likelihood of Occurrence)**
- 5 = Almost Certain (>80% chance; happens if no mitigation)
- 4 = Likely (50–80%)
- 3 = Medium (30–50%)
- 2 = Unlikely (10–30%)
- 1 = Remote (<10%)

**Risk Score = Impact × Probability** (1–25 scale)

**Risk Tier:**
- Red (≥16): Critical; requires escalation and active mitigation
- Yellow (8–15): High; requires mitigation plan and monitoring
- Green (≤7): Low; monitor but not blocking

### Step 3: Develop Mitigation Strategies

For each Red or Yellow risk, build 2–3 mitigation tactics:

**Mitigation Types:**
1. **Prevent:** Eliminate root cause (best case)
2. **Reduce:** Lower probability or impact through proactive action
3. **Transfer:** Shift risk to third party (insurance, vendor contract)
4. **Accept:** Acknowledge risk; plan contingency if it occurs

### Step 4: Define Contingency Triggers

For high-impact risks, define the "circuit breaker" — what signal triggers the backup plan:

```
If [specific metric or event] occurs by [date],
then execute [contingency plan].
```

Example:
```
If Opp 1 (sales playbook) shows <80% adoption by week 8,
then pause rollout and investigate training gaps.
```

### Step 5: Assign Owners & Escalation Paths

For each Red risk:
- **Owner:** Who monitors the risk and triggers mitigation?
- **Escalation:** Who decides if contingency plan executes?
- **Frequency:** How often is risk reviewed (weekly / bi-weekly / monthly)?

---

## Output Format

```markdown
# Risk Assessment — [Project / Engagement Name]

**Date:** YYYY-MM-DD  
**Project:** [Strategic Roadmap / Deal Structure / Org Change]  
**Sponsor:** [C-level executive]  
**Review Cadence:** Weekly (Weeks 1–4), Bi-weekly (Weeks 5–12)

---

## Executive Summary

[1–2 paragraphs: overall risk profile, critical path risks, confidence in mitigation plan]

**Risk Profile:** [Low / Moderate / High] — [Justification]
**Showstopper Risks:** [List any risks that could block execution; if none, state "None identified"]
**Contingency Budget Required:** $X (for risk response if triggered)

---

## Risk Matrix (Impact vs. Probability)

```
                HIGH IMPACT
                    |
        [Red]    |  [Red]  [Red]
        Risks    |  Risks  Risks
         |       |    |
LIKELY --|-------+----+-------- UNLIKELY
   |     |       |    |
  [Yellow|Yellow]|[Green][Green]
   Risks  |Risks |  Risks Risks
         |       |
              LOW IMPACT
```

---

## Risk Register (Prioritized by Score)

### Red Risks (Immediate Attention)

#### Risk 1: [Name] — Score [16–25]
- **Category:** [Org / Execution / Market / Financial / Technology]
- **Description:** [What could go wrong and why]
- **Impact:** [What happens if it occurs; business consequence]
- **Probability:** [Why is this likely; base rate or early signals]
- **Current Mitigation:** [What you're doing now to prevent it]
- **Additional Mitigation:** [3–4 specific actions to reduce probability or impact]
- **Contingency Plan:** [What you'll do if it happens anyway]
- **Contingency Trigger:** "If [specific metric] falls below [threshold] by [date], execute contingency"
- **Owner:** [Name, title]
- **Escalation:** [Name of decision-maker if contingency needed]
- **Review Frequency:** Weekly
- **Status:** [Green / Yellow / Red] (current status as of today)

#### Risk 2: [Name] — Score [16–25]
[Same structure]

---

### Yellow Risks (Monitor & Plan)

#### Risk 3: [Name] — Score [8–15]
- **Category:** [...]
- **Description:** [...]
- **Impact:** [...]
- **Probability:** [...]
- **Mitigation Plan:** [Specific actions]
- **Contingency Plan:** [If mitigation fails]
- **Owner:** [...]
- **Review Frequency:** Bi-weekly
- **Status:** [Green / Yellow / Red]

#### Risk 4: [Name] — Score [8–15]
[Same structure]

---

### Green Risks (Acknowledge & Monitor)

| Risk | Score | Mitigation | Owner | Review |
|---|---|---|---|---|
| [Risk 5] | [5–7] | [Brief mitigation] | [Owner] | Monthly |
| [Risk 6] | [5–7] | [Brief mitigation] | [Owner] | Monthly |

---

## Mitigation Plan by Phase

### Phase 1 (Weeks 1–4): Foundation & Governance

| Risk | Mitigation | Responsible | Due |
|---|---|---|---|
| Executive alignment | Weekly steering committee; CEO sets tone in kickoff | CEO | Week 1 |
| Scope creep | Document scope in writing; change request process established | PM | Week 1 |
| Resource conflicts | Secure executive air cover; carve out dedicated time | COO | Week 1 |

### Phase 2 (Weeks 5–8): Build & Pilot

| Risk | Mitigation | Responsible | Due |
|---|---|---|---|
| Low pilot adoption | Communication campaign; early wins celebrated | Sales VP | Week 5 |
| Technical blocker | Architecture review; contingency design option identified | CTO | Week 4 |
| Vendor delay | Identify backup vendor; SLA established with primary | Ops | Week 3 |

### Phase 3 (Weeks 9–12): Scale & Deliver

| Risk | Mitigation | Responsible | Due |
|---|---|---|---|
| Scale failure | Gradual rollout; monitor metrics closely | Operations | Week 9 |
| Market headwind | Pivot opportunity list; emphasize cost-saving vs. revenue | CMO | Week 8 |
| Customer churn | Dedicated retention playbook; customer success engagement | VP CS | Week 10 |

---

## Contingency Plans (Detailed)

### Contingency A: If Executive Alignment Breaks

**Trigger:** CEO or CFO signals public disagreement with strategy by Week 4

**Response:**
1. Immediately schedule 1:1 with sponsor and dissenting executive
2. Understand specific concerns; document objections
3. Modify roadmap to address concerns OR escalate to board
4. Do not proceed with Phase 2 until alignment restored

**Timeline:** Decision made within 3 business days

**Owner:** [Sponsor]

**Success Criteria:** Sponsor and CFO publicly endorse strategy before Week 5

---

### Contingency B: If Pilot Adoption Falls Below 50%

**Trigger:** <50% of pilot cohort actively using new playbook by Week 7

**Response:**
1. Pause full rollout
2. Conduct 5 1:1s with non-adopters; identify blockers
3. Modify playbook or training based on feedback
4. Re-launch pilot with revised approach
5. Reset timeline for Phase 3 scale

**Timeline:** Investigation by Day 2; revised pilot launch Week 8

**Owner:** [Sales VP]

**Success Criteria:** ≥75% adoption before Phase 3 scale (Week 9)

---

### Contingency C: If Core Market Validation Shows <20% Demand

**Trigger:** Market research (interview 10+ prospects) shows <20% willingness to buy

**Response:**
1. Pivot to adjacent market segment
2. OR revisit product positioning with Product team
3. Reduce revenue target for that opportunity
4. Reallocate engineering resources to higher-demand opportunity
5. Document learnings; adjust Opportunities 4–5 roadmap

**Timeline:** Pivot decision by Week 6; new strategy by Week 8

**Owner:** [CMO + Product]

**Success Criteria:** Revised opportunity validated with 50%+ prospect interest within 2 weeks

---

## Risk Scoring Summary

| Risk | Impact | Probability | Score | Tier | Owner | Status |
|---|---|---|---|---|---|---|
| [Risk 1] | 4 | 4 | 16 | Red | [Owner] | Green |
| [Risk 2] | 5 | 3 | 15 | Yellow | [Owner] | Yellow |
| [Risk 3] | 3 | 3 | 9 | Yellow | [Owner] | Green |
| [Risk 4] | 2 | 2 | 4 | Green | [Owner] | Green |

**Summary:**
- Red risks: [X] (all with mitigation plans)
- Yellow risks: [X] (all with contingency plans)
- Green risks: [X] (monitor only)
- **Overall Confidence:** [Moderate / High] — mitigation plans strong, contingency triggers clear

---

## Sign-Off

**Risk Assessment Reviewed By:**

Sponsor: _________________________ Date: _________

CFO: _________________________ Date: _________

CTO: _________________________ Date: _________

**Recommendation:**
- [ ] Proceed with engagement as planned (risks mitigated, contingencies ready)
- [ ] Proceed with modifications (specific contingencies prioritized)
- [ ] Escalate to board for risk review before proceeding
- [ ] Hold / do not proceed (specify rationale below)

---

## Post-Engagement Risk Tracking

Track actual vs. expected risk realization over 12 months:

| Risk | Expected | Occurred | Timing | Impact | Mitigation Used |
|---|---|---|---|---|---|
| [Risk 1] | Yes | No | N/A | Avoided | N/A |
| [Risk 2] | Yes | Yes | Week 8 | $X loss | Contingency A |
| [Risk 3] | Maybe | Yes | Month 4 | Moderate | Modified playbook |

**Lessons Learned:** [What surprised us? What would we do differently? Input for next engagement]
```

## Example

**Project:** $20M ARR SaaS — Sales Efficiency + Market Expansion (90 days)

**Red Risks (3):**
1. **Sales team resistance to new playbook** (Impact 5, Probability 3, Score 15)
   - Mitigation: Sales VP personally leads training; compensation aligned to adoption; early wins celebrated
   - Contingency: If <50% adoption by Week 7, pause and redesign training

2. **SMB market validation fails** (Impact 4, Probability 4, Score 16)
   - Mitigation: Interview 15+ SMB prospects weeks 1–3; validate willingness-to-pay
   - Contingency: If <20% show interest, pivot to mid-market expansion instead

3. **Product engineering capacity stretched** (Impact 3, Probability 4, Score 12)
   - Mitigation: Hire 2 contractors; prioritize roadmap ruthlessly
   - Contingency: If velocity drops >20%, extend roadmap by 4 weeks

**Yellow Risks (2):**
- Pricing change complexity (Score 12)
- Competitor launches faster (Score 10)

**Confidence Level:** Moderate-High (Red risks have clear contingencies; execution depends on team alignment)

