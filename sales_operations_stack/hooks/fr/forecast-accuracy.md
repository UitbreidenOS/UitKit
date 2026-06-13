Now I'll create the French translation, preserving the structure, terminology, and formatting:

```markdown
# Crochet Précision des Prévisions

## Objectif

Surveille les prévisions hebdomadaires. Signale les accords ayant une ancienneté >30 jours à la même étape ou une variance de prévision >10% pour escalade vers la direction des ventes.

## Entrée Settings.json

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
```

## Script Crochet (forecast-accuracy.sh)

```bash
#!/bin/bash
# Lit la sortie du rapport de prévisions et valide les seuils de précision des prévisions

FORECAST_FILE="${1:-.claude/forecast-latest.md}"

if [ ! -f "$FORECAST_FILE" ]; then
  echo "FORECAST-ACCURACY: Aucun fichier de prévisions trouvé. Validation ignorée." >&2
  exit 0
fi

# Vérifier le seuil de variance (variance >10% = alerte)
VARIANCE=$(grep -i "variance" "$FORECAST_FILE" | grep "%" | head -1 | grep -o "[+-][0-9]*%" | head -1)
if [[ ! -z "$VARIANCE" ]]; then
  VARIANCE_NUM=$(echo "$VARIANCE" | sed 's/[%+-]//g')
  if [ "$VARIANCE_NUM" -gt 10 ]; then
    echo "FORECAST-ALERT: La variance ${VARIANCE} dépasse le seuil de 10%. Escalader vers le VP Ventes." >&2
  fi
fi

# Vérifier les accords anciens (>30 jours à la même étape)
AGED_DEALS=$(grep -i "aged\|stalled" "$FORECAST_FILE" | wc -l)
if [ "$AGED_DEALS" -gt 0 ]; then
  echo "FORECAST-ALERT: ${AGED_DEALS} accords anciens ou figés trouvés. Nécessite un plan de réengagement." >&2
fi

echo "FORECAST-ACCURACY: Validation complète. Statut: $([ \"$VARIANCE_NUM\" -le 10 ] && echo 'RÉUSSI' || echo 'ALERTE')" >&2
exit 0
```

## Comportement

- **Variance >10% :** Imprime une alerte pour escalader la variance vers le VP Ventes
- **Accords anciens >30 jours :** Imprime une alerte avec le nombre d'accords figés
- **Réussi :** Enregistre le succès de la validation; aucune action requise

## Configuration

1. Enregistrez le script dans `.claude/hooks/forecast-accuracy.sh` et exécutez `chmod +x`
2. Ajoutez l'entrée settings.json
3. Le script s'exécute automatiquement lors de la génération du rapport de prévisions

Construit avec [Claudient](https://github.com/Claudient/Claudient) · [uitbreiden.com](https://uitbreiden.com/)