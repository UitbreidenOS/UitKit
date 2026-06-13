# MCP: Merge (Bulk Data Integration)

## What This MCP Does
Integrates bulk employee data, compensation benchmarks, and organizational records from spreadsheets and databases. Ingests data in CSV/JSON format; validates schema; enables HR-wide queries.

## When to Use

- **Headcount import:** Bulk import current org from ATS, HRIS, or spreadsheet
- **Compensation benchmarking:** Load market salary data (Radford, Mercer, Levels.fyi)
- **Performance history:** Import prior review cycles for trend analysis and calibration
- **Termination/exit data:** Bulk analysis of separations by cohort, department, reason

## Setup

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "merge": {
      "command": "npx",
      "args": ["@merge/mcp"],
      "env": {
        "MERGE_API_KEY": "your-merge-api-key"
      }
    }
  }
}
```

Get your API key at [merge.dev](https://merge.dev/). Free tier supports up to 5,000 records.

## Typical Workflows

**Headcount Import:**
```
1. Export current org from HRIS or ATS (CSV format)
2. Use Merge to load into Claude session
3. Query headcount by department, level, location
4. Validate against budget forecasts
5. Identify missing records or inconsistencies
```

**Compensation Benchmarking:**
```
1. Download market salary data from survey tool
2. Use Merge to load benchmark data
3. Compare internal salaries to market data
4. Identify pay gaps by role and level
5. Recommend merit increases or market adjustments
```

**Separation Analysis:**
```
1. Export termination records (date, reason, department, manager)
2. Use Merge to load historical data
3. Analyze turnover by cohort, manager, reason
4. Identify patterns (high-risk periods, managers with turnover)
5. Recommend retention interventions
```

---
