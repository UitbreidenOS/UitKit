# Command: profile-query

Profiles SQL query execution and identifies bottlenecks.

## Usage

```
/profile-query <sql_file> [--db postgres|bigquery|snowflake]
```

## Options

- `--db`: Target database (default: postgres)

## Example

```
/profile-query sales_agg.sql --db snowflake
```
