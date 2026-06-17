# MCP Tool: SQL Tools

Provides SQL query execution, explain plans, and schema introspection.

## Available Commands

- `sql-execute <query>` — Run query and return results
- `sql-explain <query>` — Get execution plan
- `sql-schema <table>` — Inspect table structure

## Configuration

```json
{
  "mcp": {
    "sql-tools": {
      "enabled": true,
      "databases": ["postgres", "snowflake", "bigquery"]
    }
  }
}
```

## Example

```
/sql-execute "SELECT COUNT(*) FROM orders WHERE created_at > '2026-01-01'"
```
