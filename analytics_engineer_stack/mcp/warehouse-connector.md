# Warehouse Connector

MCP integration for your data warehouse (Snowflake, BigQuery, PostgreSQL, Redshift) — run queries, fetch metadata, validate schemas, and profile data without leaving Claude Code.

## When to Use

| Use Warehouse MCP | Use Other Tools |
|---|---|
| Run ad-hoc SELECT queries | Bulk data loading (use dbt instead) |
| Fetch table schema / columns | Complex transformations (use dbt SQL models) |
| Profile data (row counts, nulls) | Scheduled recurring transformations (use dbt Cloud) |
| Validate data freshness | Real-time ingestion (use ETL tool) |

## Tool Call Examples

```
mcp__warehouse__query({ "sql": "SELECT COUNT(*) FROM fct_orders" })
mcp__warehouse__get_schema({ "table": "fct_orders" })
mcp__warehouse__get_row_count({ "table": "fct_orders", "schema": "analytics" })
mcp__warehouse__profile_column({ "table": "fct_orders", "column": "order_amount" })
```

## Analytics Use Cases

1. **Validate data freshness** — Check when fact_orders was last loaded
2. **Profile data quality** — Get NULL count, min/max values, cardinality for data audit
3. **Run ad-hoc queries** — Test SQL before committing to dbt models
4. **Verify row counts** — Compare source vs. warehouse row counts for reconciliation
5. **Check schema** — Confirm column names, data types match expectations

## Setup

### Snowflake

```json
{
  "mcpServers": {
    "warehouse_snowflake": {
      "command": "npx",
      "args": ["@anthropic-ai/warehouse-mcp", "--warehouse", "snowflake"],
      "env": {
        "SF_ACCOUNT": "ab12345.us-east-1",
        "SF_USER": "analytics_user",
        "SF_PASSWORD": "your-password",
        "SF_DATABASE": "analytics_db",
        "SF_SCHEMA": "analytics"
      }
    }
  }
}
```

### BigQuery

```json
{
  "mcpServers": {
    "warehouse_bigquery": {
      "command": "npx",
      "args": ["@anthropic-ai/warehouse-mcp", "--warehouse", "bigquery"],
      "env": {
        "GCP_PROJECT_ID": "your-project",
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/service-account-key.json"
      }
    }
  }
}
```

### PostgreSQL / Redshift

```json
{
  "mcpServers": {
    "warehouse_postgres": {
      "command": "npx",
      "args": ["@anthropic-ai/warehouse-mcp", "--warehouse", "postgres"],
      "env": {
        "DB_HOST": "analytics-db.c.us-east-1.rds.amazonaws.com",
        "DB_PORT": "5432",
        "DB_NAME": "analytics",
        "DB_USER": "analytics_user",
        "DB_PASSWORD": "your-password"
      }
    }
  }
}
```

## Example

**Check when fct_orders was last updated:**
```
mcp__warehouse__query({
  "sql": "SELECT MAX(updated_ts) FROM fct_orders"
})
```

**Profile transaction_amount column:**
```
mcp__warehouse__profile_column({
  "table": "fct_orders",
  "column": "transaction_amount",
  "schema": "analytics"
})
```

**Returns:**
```
{
  "column": "transaction_amount",
  "row_count": 50000000,
  "null_count": 0,
  "null_percentage": 0.0,
  "min": 0.01,
  "max": 125000,
  "mean": 1240,
  "median": 950,
  "cardinality": 2845612
}
```

---
