# Hook: post-incident

## Trigger

Fires after an incident is resolved (manual invocation or automated).

## Config Entry

```json
{
  "hooks": {
    "post-incident": {
      "script": "hooks/post-incident.sh"
    }
  }
}
```

## Actions

- Collect incident timeline from logs
- Gather metrics and traces
- Template postmortem document
- Notify team and escalation contacts

## Output

Postmortem.md with timeline, impact, root cause, and action items.
