# Incident Management Integration

## Supported Systems
- PagerDuty
- Opsgenie
- Squadcast
- FireHydrant

## Configuration

### PagerDuty
```json
{
  "mcp": {
    "pagerduty": {
      "enabled": true,
      "api_key": "${PAGERDUTY_API_KEY}",
      "api_url": "https://api.pagerduty.com"
    }
  }
}
```

## Available Commands
- List on-call engineers
- Trigger incidents with severity and service
- Acknowledge and resolve incidents
- Fetch incident history and post-mortems

## Setup
1. Generate API key from incident system dashboard
2. Store in `.env`
3. Add to settings.json
4. Test with `/incident-check` command
