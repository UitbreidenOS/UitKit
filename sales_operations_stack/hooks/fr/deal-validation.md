# Hook de Validation des Deals

## Objectif

Vérifications pré-clôture. Applique une documentation minimale (plan d'account, approbation des parties prenantes, notes de découverte), empêche la réservation prématurée de deals qui manquent d'approbation ou de données requises.

## Entrée Settings.json

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