# Hook de Auditoría de Compensación

## Propósito

Registra todos los cambios de comisiones con marca de tiempo, autor, justificación y valores antiguos/nuevos. Mantiene un registro de auditoría completo para la resolución de disputas y cumplimiento normativo.

## Entrada en Settings.json

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