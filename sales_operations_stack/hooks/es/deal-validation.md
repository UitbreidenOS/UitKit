# Hook de Validación de Acuerdos

## Propósito

Verificaciones previas al cierre. Aplica documentación mínima obligatoria (plan de cuenta, aprobación de partes interesadas, notas de descubrimiento), previene el registro prematuro de acuerdos que carecen de aprobación o datos requeridos.

## Entrada en Settings.json

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