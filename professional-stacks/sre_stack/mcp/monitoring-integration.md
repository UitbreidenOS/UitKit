# Monitoring Integration

## Supported Systems
- Prometheus
- Datadog
- CloudWatch
- Grafana
- New Relic

## Configuration

### Prometheus
```json
{
  "mcp": {
    "prometheus": {
      "enabled": true,
      "url": "http://prometheus:9090",
      "api_key": "${PROMETHEUS_API_KEY}"
    }
  }
}
```

### Datadog
```json
{
  "mcp": {
    "datadog": {
      "enabled": true,
      "api_key": "${DATADOG_API_KEY}",
      "app_key": "${DATADOG_APP_KEY}",
      "api_url": "https://api.datadoghq.com"
    }
  }
}
```

## Available Commands
- Query metrics by name and time range
- Fetch alert status across services
- Retrieve SLO definitions and current status
- Create and update monitors

## Setup
1. Add API keys to `.env` or environment variables
2. Enable in settings.json
3. Test with `/incident-check` command
