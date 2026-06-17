# MCP Tool: Lineage Tools

Parses and traces data lineage from SQL DAGs and ETL frameworks.

## Available Commands

- `lineage-parse <file>` — Extract lineage from pipeline code
- `lineage-graph <source_table>` — Visualize upstream/downstream dependencies
- `lineage-validate` — Check for orphaned or circular dependencies

## Configuration

```json
{
  "mcp": {
    "lineage-tools": {
      "enabled": true,
      "frameworks": ["dbt", "airflow", "spark"]
    }
  }
}
```

## Example

```
/lineage-parse dags/sales_pipeline.py
```
