# BI Tool Connector

MCP integration for BI platforms (Looker, Tableau, Superset, Metabase) — fetch dashboard metadata, validate metrics, check data freshness, and audit BI assets without manual tool navigation.

## When to Use

| Use BI Connector | Use Manual Tool |
|---|---|
| Fetch dashboard metric definitions | Design new dashboards |
| Validate metric calculations | Publish content to stakeholders |
| Check data refresh status | Create visualizations |
| Audit BI asset lineage | Interact with BI UI |

## Tool Call Examples

### Looker

```
mcp__looker__get_dashboard({ "dashboard_id": "monthly_revenue" })
mcp__looker__get_metric({ "metric_name": "total_revenue" })
mcp__looker__get_data_freshness({ "view": "fct_orders" })
mcp__looker__validate_metric({ "metric": "monthly_recurring_revenue", "expected_value": 1800000 })
```

### Tableau

```
mcp__tableau__get_workbook({ "workbook_id": "sales_dashboard" })
mcp__tableau__get_datasource_metadata({ "datasource": "analytics_warehouse" })
mcp__tableau__validate_extract_freshness({ "datasource": "fact_orders" })
```

### Superset

```
mcp__superset__get_dashboard({ "dashboard_id": "123" })
mcp__superset__get_chart({ "chart_id": "456" })
mcp__superset__get_dataset_freshness({ "dataset": "fct_transactions" })
```

## Analytics Use Cases

1. **Fetch dashboard definition** — Get metric list, filters, and drill-down logic for QA audit
2. **Validate metric accuracy** — Compare dashboard value vs. source query result
3. **Check data freshness** — See when underlying datasets were last refreshed
4. **Audit lineage** — Trace dashboard → dataset → dbt model → source table
5. **Reconcile metric definitions** — Ensure Dashboard A and Dashboard B use same metric logic

## Setup

### Looker

```json
{
  "mcpServers": {
    "looker": {
      "command": "npx",
      "args": ["@anthropic-ai/looker-mcp"],
      "env": {
        "LOOKER_API_HOST": "https://your-instance.looker.com:19999",
        "LOOKER_CLIENT_ID": "your-client-id",
        "LOOKER_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

### Tableau

```json
{
  "mcpServers": {
    "tableau": {
      "command": "npx",
      "args": ["@anthropic-ai/tableau-mcp"],
      "env": {
        "TABLEAU_SERVER": "https://your-tableau.com",
        "TABLEAU_SITE": "your-site",
        "TABLEAU_USERNAME": "your-username",
        "TABLEAU_PASSWORD": "your-password"
      }
    }
  }
}
```

### Superset

```json
{
  "mcpServers": {
    "superset": {
      "command": "npx",
      "args": ["@anthropic-ai/superset-mcp"],
      "env": {
        "SUPERSET_URL": "https://your-superset.com",
        "SUPERSET_USERNAME": "your-username",
        "SUPERSET_PASSWORD": "your-password"
      }
    }
  }
}
```

## Example

**Fetch Looker dashboard metric definitions for QA audit:**
```
mcp__looker__get_dashboard({
  "dashboard_id": "monthly_revenue_report"
})
```

**Returns:**
```json
{
  "title": "Monthly Revenue Report",
  "metrics": [
    {
      "name": "Total Revenue",
      "definition": "SELECT SUM(order_amount) FROM orders WHERE status='completed'",
      "last_refreshed": "2026-06-12T06:00:00Z",
      "data_freshness_hours": 0.5
    }
  ]
}
```

**Validate metric accuracy:**
```
mcp__looker__validate_metric({
  "metric": "monthly_recurring_revenue",
  "expected_value": 1800000,
  "tolerance_percentage": 5
})
```

---
