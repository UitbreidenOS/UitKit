# Crochet de Suivi de Quota

## Objectif

Suivi de quota en temps réel. Alerte lorsqu'un individu ou une équipe est en retard de plus de 15% sur le rythme quotidien/hebdomadaire requis pour atteindre le quota à la fin du mois.

## Entrée Settings.json

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*quota",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/quota-pacing.sh" }
        ]
      }
    ]
  }
}