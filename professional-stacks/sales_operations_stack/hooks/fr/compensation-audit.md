# Crochet d'Audit de Rémunération

## Objectif

Enregistre tous les changements de commission avec horodatage, auteur, justification et anciennes/nouvelles valeurs. Maintient une piste d'audit complète pour la résolution des litiges et la conformité.

## Entrée Settings.json

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