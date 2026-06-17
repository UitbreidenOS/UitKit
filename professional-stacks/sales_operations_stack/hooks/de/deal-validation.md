# Deal-Validierungs-Hook

## Zweck

Vorabschluss-Überprüfungen. Erzwingt minimale Dokumentation (Kontoplan, Stakeholder-Genehmigung, Ermittlungsnotizen) und verhindert vorzeitige Buchung von Deals, die keine Genehmigung oder erforderliche Daten haben.

## Settings.json-Eintrag

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