# Deal Validatie Hook

## Doel

Controles voorafgaand aan sluiting. Dwingt minimale documentatie af (accountplan, goedkeuring belanghebbenden, kennismaakingsnotities), voorkomt voortijdige boeking van deals zonder goedkeuring of vereiste gegevens.

## Settings.json Invoering

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "WebFetch.*CRM|Write.*close|Write.*won",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/deal-validation.sh" }
        ]
      }
    ]
  }
}