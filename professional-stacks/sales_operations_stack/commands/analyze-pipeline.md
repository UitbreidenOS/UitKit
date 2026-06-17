# /analyze-pipeline

**Trigger:** Run weekly (every Monday) before leadership sync, or on-demand for pipeline visibility.

**Purpose:** Generate real-time pipeline health snapshot: deal count by stage, average age per stage, forecast health, stage-wise conversion rates, and at-risk deal identification.

**What it does:**
1. Pulls current CRM export (Salesforce, HubSpot, or Pipedrive)
2. Validates data freshness (warns if >24 hours old)
3. Segments deals by stage, tier (Enterprise/Mid/Commercial), and rep
4. Calculates key metrics: pipeline value, stage aging, conversion rates, forecast accuracy
5. Identifies deals at risk (>30 days in stage, <50% probability)
6. Generates summary dashboard: top risks, quota pacing, recommended actions
7. Saves report to `reports/pipeline-snapshot-{YYYY-MM-DD}.md`
8. Logs summary to `session-log.md`

**Inputs:** CRM connection (requires API credentials or export file)

**Output:** `reports/pipeline-snapshot-{date}.md` — Full health report with metrics, at-risk deals, conversion trending, and actions

**Owner:** Sales Ops Lead | **Frequency:** Weekly + on-demand

**Example:**

```bash
/analyze-pipeline
```

Output:
- Pipeline coverage: 3.8:1 (target 3.5–4.5:1) ✓ Green
- Forecast accuracy: 92% vs. submitted 95% — Monitor
- At-risk deals: 7 (>30 days in stage or <50% probability) — Escalate to managers
- Quota pacing: -14% vs. pro-rata target — Intervention needed

Next step: Review at-risk deals; schedule deal reviews with affected reps.

---
