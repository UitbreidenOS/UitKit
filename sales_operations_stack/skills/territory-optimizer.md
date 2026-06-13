---
name: territory-optimizer
description: Analyzes territory design for account distribution balance, quota fairness, overlap detection, and capacity planning. Recommends realignment to maximize revenue potential and reduce rep burden.
allowed-tools: Read, Write, WebFetch
effort: high
---

## When to activate

Run monthly, after new hires, after quota changes, or on-demand when territory gaps or unfair allocations suspected. Requires account list with assigned rep, territory, revenue potential, and current quota.

## When NOT to use

Not for individual rep performance review—use quota-tracker. Not for one-off account assignments; use for systematic territory design. Not during forecast lock (final week of month).

## Territory Analysis Framework

### 1. Account Distribution Fairness

Map all assigned accounts to reps. Score on:
- **Account Count:** Should be balanced (±15% variance). Red flag if one rep has 40% of accounts.
- **Account Size Distribution:** Mix of enterprise, mid-market, commercial. Red flag: all top 10 accounts assigned to 1 rep.
- **Account Potential:** Territory revenue potential should be balanced to quota.

### 2. Quota Fairness

Analyze quota targets against territory potential:
- **Formula:** Territory revenue potential / Assigned quota
- **Healthy range:** 0.9x to 1.1x (territory potential = quota)
- **Red flag:** >1.3x (territory over-quota'd) or <0.7x (territory under-quota'd)

### 3. Coverage Gaps

Identify uncovered accounts or geographic gaps:
- Accounts without assigned rep
- Industries underserved
- Geographic regions with low penetration
- Potential expansion segments

### 4. Revenue Concentration Risk

Assess if territory revenue is too concentrated:
- **Healthy:** Top 5 accounts = <40% of territory revenue
- **At risk:** Top 5 accounts = 40–60% of territory revenue
- **Critical:** Top 5 accounts = >60% of territory revenue

### 5. New Business vs. Expansion Pipeline

Analyze pipeline mix by territory:
- Healthy: 50/50 new business to expansion ratio
- Track: Is territory weighted to new logos or expand-heavy?

---

## Territory Optimization Report

```markdown
# Territory Optimization Analysis — [Date]

**Scope:** [Sales team / region / segment]  

---

## Territory Balance Scorecard

| Territory | Assigned Quota | Revenue Potential | Balance | Account Count | Top 5 Concentration | Status |
|-----------|---------------|-------------------|---------|----------------|-------------------|--------|
| [Rep] | $[X] | $[X] | [%] | [X] | [%] | [Color] |

---

## Fairness Assessment

- **Quota Variance:** [X]% (target <15%)
- **Revenue Potential Variance:** [X]% (target <15%)
- **Account Count Variance:** [X]% (target <20%)

---

## Coverage Gaps

- Uncovered accounts: [List]
- Industries under-penetrated: [List]
- Geographic gaps: [List]
- Expansion opportunity: [List]

---

## Concentration Risk

| Territory | Top 5 Accounts $ | % of Territory Revenue | Risk Level |
|-----------|-----------------|----------------------|-----------|
| [Rep] | $[X] | [%] | [Green/Yellow/Red] |

---

## Rebalancing Recommendations

1. [Specific account move] — From: [Rep]. To: [Rep]. Rationale: [Reason]. Expected impact: [Impact].
2. [Account move] — From: [Rep]. To: [Rep]. Rationale. Expected impact.

---

## Implementation Timeline

- Week 1: Announce rebalancing to reps
- Week 2: Transition conversations + knowledge transfer
- Week 3: Account transitions live; pipeline adjustments
```

---

## Example

# Territory Optimization Analysis — 2026-06-12

**Scope:** Enterprise Sales Team (4 reps)

---

## Territory Balance Scorecard

| Territory | Assigned Quota | Revenue Potential | Balance | Account Count | Top 5 Concentration | Status |
|-----------|---------------|-------------------|---------|----------------|-------------------|--------|
| Sarah K | 300K | 340K | 113% | 24 | 38% | Green |
| Mike T | 300K | 210K | 70% | 18 | 62% | Red |
| David M | 300K | 295K | 98% | 26 | 41% | Green |
| Jennifer L | 300K | 355K | 118% | 28 | 35% | Green |

---

## Fairness Assessment

- **Quota Variance:** 21% (target <15%) — PROBLEM: Mike's territory severely under-resourced.
- **Revenue Potential Variance:** 40% (target <15%) — CRITICAL: Mike's territory has 70% of average potential; Jennifer's has 118%.
- **Account Count Variance:** 18% (target <20%) — Borderline; Mike has fewest accounts.

---

## Coverage Gaps

**Uncovered Accounts:** 7 high-potential accounts (>$200K ARR) unassigned across regions.

**Industries Under-Penetrated:**
- Manufacturing (2 accounts needed)
- Healthcare (3 accounts — only 1 rep touching)

**Geographic Gaps:** West Coast secondary markets (Denver, Phoenix, Portland) — no dedicated coverage.

---

## Concentration Risk

| Territory | Top 5 Accounts $ | % of Territory Revenue | Risk Level |
|-----------|-----------------|----------------------|-----------|
| Sarah K | $128K | 38% | Green |
| Mike T | $130K | 62% | Red |
| David M | $121K | 41% | Green |
| Jennifer L | $124K | 35% | Green |

**Mike's concentration is critical:** Losing top 2 accounts = −85% of territory attainment. High churn risk.

---

## Rebalancing Recommendations

1. **Move $250K potential accounts from Mike to Jennifer**
   - Transfer Acme Industries + Vertex Systems to Jennifer L
   - Rationale: Jennifer's territory is 118% of potential and she's outperforming. Mike's territory is 70% — critical under-resourcing.
   - Expected impact: Mike +$50K potential (raise to 87%), Jennifer +$250K (no quota change, more capacity).

2. **Hire new rep for West Coast expansion segment**
   - Assign: Seattle, Portland, Denver, Arizona markets
   - Rationale: Geographic coverage gap = missed 15+ accounts/year.
   - Expected impact: +$500K ARR pipeline within 18 months.

3. **Consolidate Healthcare vertical under David M**
   - Transfer 2 healthcare accounts from Jennifer to David
   - Rationale: David has industry expertise; consolidation enables depth over breadth.
   - Expected impact: Higher win rate + deeper expansion in healthcare vertical.

4. **Assign 3 uncovered high-potential accounts**
   - TechFlow ($250K): Jennifer (growth focus)
   - CloudInc ($180K): Sarah (existing relationships)
   - DataCorp ($200K): New hire (West Coast)

---

## Implementation Timeline

- **Week of June 17:** Announce rebalancing to team; 1:1 conversations with affected reps.
- **Week of June 24:** Transition conversations between reps + account handoff.
- **Week of July 1:** Accounts live in new territories; pipeline ownership transferred. Jennifer + David adjusted forecasts.
- **By July 15:** New hire ramped; West Coast territory live.

---
