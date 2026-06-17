# Compensatie Audit Hook

## Doel

Registreert alle commissiewijzigingen met tijdstempel, auteur, motivering en oude/nieuwe waarden. Handhaaft volledig audittrail voor geschillenbeslechting en compliance.

## Settings.json Vermelding

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