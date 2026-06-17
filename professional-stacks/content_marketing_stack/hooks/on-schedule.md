# on-schedule Hook

Triggered at scheduled campaign publish time to deploy content batch.

## Event

`campaign.scheduled`

## settings.json Entry

```json
{
  "hooks": {
    "on-schedule": {
      "trigger": "campaign.scheduled",
      "script": "hooks/on-schedule.sh",
      "timeout": 300
    }
  }
}
```

## Behavior

- Validates all campaign content before deploy
- Deploys across registered channels
- Sends deployment notifications

## Setup

Configure timeout and notification targets.
