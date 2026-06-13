# Hook de Precisión de Pronóstico

## Propósito

Monitorea pronósticos semanales. Marca transacciones con antigüedad >30 días en el mismo etapa o varianza de pronóstico >10% para escalación al liderazgo de ventas.

## Entrada Settings.json

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "WebFetch.*forecast|Write.*forecast",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/forecast-accuracy.sh" }
        ]
      }
    ]
  }
}