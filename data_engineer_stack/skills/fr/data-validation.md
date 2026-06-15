# Validation des données

## Quand activer

Construction de contrôles de qualité, détection d'anomalies ou assertions de nullité/cardinalité.

## Quand NE PAS utiliser

Pas pour l'analyse exploratoire des données ; se concentrer sur les garde-fous opérationnels.

## Instructions

1. Définir les types d'assertions (schéma, cardinalité, plage, unicité)
2. Définir les seuils d'alerte
3. Créer des règles de validation réutilisables
4. Intégrer dans le pipeline

## Exemple

**Scénario :** Un pipeline ingère 10M de commandes clients quotidiennement.

```python
import pandas as pd
from great_expectations import dataset

# Assertions de schéma et qualité
validations = {
    'order_id': 'non-null et unique',
    'customer_id': 'non-null',
    'amount': 'positif, entre 0.01 et 999999',
    'created_at': 'date valide, pas dans le futur',
    'status': 'énumération : PENDING, SHIPPED, DELIVERED'
}

# Règles réutilisables
df.assert_column_values_are_not_null('order_id')
df.assert_column_values_are_unique('order_id')
df.assert_column_values_are_in_set('status', ['PENDING', 'SHIPPED', 'DELIVERED'])
```

**Résultat :** Seuil d'alerte fixé à 1% de lignes invalides; pipeline interrompt si dépassement.
