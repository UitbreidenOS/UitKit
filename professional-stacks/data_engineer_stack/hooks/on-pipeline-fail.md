# Hook: on-pipeline-fail

Triggered when a data pipeline fails.

## settings.json

```json
{
  "hooks": {
    "on-pipeline-fail": {
      "script": "hooks/on-pipeline-fail.sh",
      "condition": "pipeline_status == 'FAILED'"
    }
  }
}
```

## Behavior

Captures error logs, notifies stakeholders, and triggers debugging workflow.

## Implementation

(Script stub — adds failure event to session log)
