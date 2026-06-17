# Command: /logs-search

## Purpose

Query logs across all services for incident investigation and debugging.

## Usage

```
/logs-search <query> [--service] [--time-range] [--format]
```

## Steps

1. Build Elasticsearch/Kibana query
2. Execute search across all log indices
3. Aggregate by service/level/error type
4. Return results with timeline

## Example

```
/logs-search "error rate" --service=api-gateway --time-range=15m
```
