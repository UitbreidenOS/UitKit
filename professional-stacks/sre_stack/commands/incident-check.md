# /incident-check

## Purpose
Quickly check current incident status across all monitored services.

## Usage
```
/incident-check
/incident-check [service-name]
```

## What it does
- Queries monitoring system for active incidents
- Returns severity, affected services, and time since alert
- Shows running runbooks and escalation status
- Displays on-call engineer for critical incidents

## Example
```
/incident-check api-service
```

Returns: "API service: 0 active incidents. Last alert 2h ago (resolved). Status: operational."
