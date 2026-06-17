# /optimize-territory

**Trigger:** Run monthly, after new hires, or after quota changes. On-demand when territory balance suspected unfair.

**Purpose:** Run territory balance analysis: account assignments, quota fairness score, overlap detection, headcount capacity plan, and realignment recommendations.

**What it does:**
1. Loads account master list: name, assigned rep, territory, revenue potential (ARR)
2. Calculates fairness metrics: quota variance, territory potential variance, account count variance
3. Identifies overlaps: accounts assigned to multiple reps
4. Identifies gaps: unassigned accounts, geographic underserved, tier imbalances
5. Analyzes concentration risk: % of territory revenue in top 5 accounts
6. Scores each territory 0–100 on balance dimension
7. Generates rebalancing recommendations with impact forecasts
8. Saves report to `reports/territory-analysis-{YYYY-MM-DD}.md`

**Inputs:** Account list with rep assignments, quotas, and revenue potential

**Output:** `reports/territory-analysis-{date}.md` — Fairness scorecard, gaps/overlaps, realignment plan with rollout timeline

**Owner:** VP Sales + Sales Ops | **Frequency:** Monthly post-hiring + on-demand

**Example:**

```bash
/optimize-territory
```

Output:
- Quota balance: 22% variance (Red — target <10%)
- Territory potential variance: 18% (Yellow — target <15%)
- Growth concentration: Sarah Chen 52% in top 3 (Red — target <40%)
- Recommended moves: 4 account transfers to rebalance

Next step: Brief VP Sales on realignment plan; implement week of {date}.

---
