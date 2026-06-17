# /build-forecast

**Trigger:** Run weekly before leadership sync, or monthly for board updates. Always run 2+ weeks before quarter-end.

**Purpose:** Generate 13-month rolling forecast with 3 scenarios (best-case, commit, upside). Show trending and variance vs. plan.

**What it does:**
1. Pulls current pipeline snapshot (all open deals with close probability and expected value)
2. Applies three probability thresholds:
   - **Commit (60%):** Deals >50% probability only → Conservative estimate
   - **Best-Case (90%):** Deals >30% probability → Likely upside
   - **Upside:** Deals >10% probability → Stretch scenario
3. Segments by month (next 13 months) and rep
4. Calculates variance vs. monthly targets
5. Compares current forecast vs. prior week/month (velocity trending)
6. Compares forecast accuracy: prior month forecast vs. actual close
7. Identifies confidence gaps: % of forecast <50% probability, concentration risk
8. Generates 13-month summary + rep-by-rep breakdown + variance analysis
9. Saves to `reports/forecast-{YYYY-MM-DD}.md`
10. Logs to `session-log.md`

**Inputs:** Current CRM pipeline with deal probability estimates

**Output:** `reports/forecast-{date}.md` — 13-month rolling forecast (all 3 scenarios), monthly breakdowns, variance trending, risk assessment

**Owner:** Finance Lead + Sales Leadership | **Frequency:** Weekly + monthly board prep

**Example:**

```bash
/build-forecast
```

Output:
- Month 1 Commit: $920K vs. target $1.1M (-16%)
- Best-Case: $1.1M (+19% above commit)
- Upside: $1.3M (+41% above commit)
- Confidence: 73% of forecast is >50% probability
- Variance trending: -3% to -4% vs. submitted forecast (conservative, good)

Next step: Flag month 1 shortfall risk; recommend deal-level re-engagement plan.

---
