# Runbook Auditor Hook

## Purpose
Log all runbook executions and outcomes for post-incident review.

## settings.json Entry
```json
{
  "hooks": {
    "runbook-auditor": {
      "enabled": true,
      "event": "runbook-executed"
    }
  }
}
```

## What it does
- Captures runbook name, start time, and service affected
- Logs each step and command executed
- Records success/escalation outcome
- Appends to "Runbooks Executed" section in session-log.md
- Enables post-mortem traceability

## Script Location
Place `runbook-auditor.sh` in `.claude/hooks/`

```bash
#!/bin/bash
# runbook-auditor.sh
# Triggered after runbook execution
# Logs execution details for audit trail
```
