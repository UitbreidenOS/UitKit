# Runbook Executor

## When to activate
Incident triage complete and runbook identified.

## When NOT to use
For new or unknown failure modes without approved runbook.

## Instructions
1. Load runbook for identified issue
2. Verify prerequisites (access, permissions)
3. Execute each step sequentially
4. Log actions and outputs
5. Monitor for side effects
6. Report outcome (resolved/escalated)

## Example
Incident: Memory leak in service X. Execute runbook: restart service, verify startup, check logs, monitor CPU for 5 minutes.
