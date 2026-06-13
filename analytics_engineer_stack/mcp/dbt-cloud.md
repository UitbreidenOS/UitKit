# dbt Cloud

MCP integration for dbt Cloud — run dbt commands, check job status, view logs, and trigger production runs without leaving Claude Code.

## When to Use vs Local dbt

| Use dbt Cloud MCP | Use Local dbt |
|---|---|
| Production job status | Local development / testing |
| Trigger scheduled runs | Debug model SQL |
| View Cloud logs | Iterative development |
| Check project metadata | Ad-hoc transformations |

## Tool Call

```
mcp__dbt_cloud__run_job({ "job_id": "12345", "cause": "Manual trigger from Claude Code" })
mcp__dbt_cloud__get_job_status({ "job_id": "12345" })
mcp__dbt_cloud__get_logs({ "run_id": "67890" })
```

## Analytics Use Cases

1. **Check dbt job status** — Is the scheduled 6 AM run complete? Any failures?
2. **Trigger manual re-run** — If data freshness SLA is breached, re-run production job
3. **View failure logs** — Diagnose why mart_daily_metrics failed; see exact error
4. **Monitor CI/CD** — Check dbt test results before approving PR merge
5. **Production runs** — Trigger full-refresh runs for incremental models

## Setup

Get dbt Cloud API token from [cloud.getdbt.com](https://cloud.getdbt.com) → Account settings → API tokens.

Add to `settings.json`:

```json
{
  "mcpServers": {
    "dbt_cloud": {
      "command": "npx",
      "args": ["@dbt-labs/mcp"],
      "env": {
        "DBT_CLOUD_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

## Example

**Check if daily dbt run completed:**
```
mcp__dbt_cloud__get_job_status({ "job_id": "123", "account_id": "456" })
```

**View failure logs:**
```
mcp__dbt_cloud__get_logs({ "run_id": "789", "step": "dbt test" })
```

---
