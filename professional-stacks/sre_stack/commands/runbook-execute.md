# /runbook

## Purpose
Execute an automated runbook for a known issue.

## Usage
```
/runbook [runbook-name]
/runbook list
```

## What it does
- Lists available runbooks
- Loads and executes the specified runbook
- Steps through each action with confirmation
- Logs all actions and outputs
- Reports success or escalation need

## Example
```
/runbook restart-api-service
```

Executes: stop service, wait 5s, start service, verify health check, monitor logs.
