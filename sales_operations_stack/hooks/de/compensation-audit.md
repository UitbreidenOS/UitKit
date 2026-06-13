# Compensation-Audit-Hook

## Zweck

Protokolliert alle Provisionsänderungen mit Zeitstempel, Autor, Begründung und alten/neuen Werten. Führt eine vollständige Audit-Spur für Streitbeilegung und Compliance.

## Settings.json-Eintrag

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*commission|Write.*compensation|Write.*accrual",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/compensation-audit.sh" }
        ]
      }
    ]
  }
}