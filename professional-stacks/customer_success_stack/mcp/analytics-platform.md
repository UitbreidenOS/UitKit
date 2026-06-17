# MCP: Analytics Platform

Connector for product analytics (Amplitude, Mixpanel, Segment).

## Supported Operations

- `get_user_events(user_id, date_range)` — Fetch event log
- `get_feature_adoption(feature_id)` — Adoption metrics
- `get_cohort_trends(cohort_tag)` — Trend analysis by segment
- `get_health_metrics(account_id)` — Engagement summary

## Configuration

```json
{
  "mcp": {
    "analytics": {
      "provider": "amplitude|mixpanel|segment",
      "api_key": "YOUR_API_KEY",
      "project_id": "YOUR_PROJECT"
    }
  }
}
```

## Status

Stub — awaiting analytics API keys
