# Incident Logger Hook

## Purpose
Auto-log detected incidents and resolutions to session-log.md.

## settings.json Entry
```json
{
  "hooks": {
    "incident-logger": {
      "enabled": true,
      "event": "incident-detected"
    }
  }
}
```

## What it does
- Listens for incident detection from monitoring webhook
- Extracts severity, service, and timestamp
- Appends to "Incidents Detected" section in session-log.md
- Updates status on resolution

## Script Location
Place `incident-logger.sh` in `.claude/hooks/`

```bash
#!/bin/bash
# incident-logger.sh
# Triggered by incident webhook from monitoring system
# Appends incident to session-log.md
```
