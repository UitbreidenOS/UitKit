# Compétence : Prévision de Renouvellement

## Quand l'activer

Examens trimestriels ou à la demande du pipeline de renouvellement ; signaler les comptes dans la fenêtre de 90 jours.

## Quand NE PAS l'utiliser

Ne pas utiliser pour les contrats pluriannuels ou les comptes confirmés (utiliser directement les métadonnées de renouvellement).

## Instructions

1. Interroger les dates de renouvellement par cohorte
2. Référencer de manière croisée avec le score de santé
3. Prédire la probabilité de renouvellement en fonction de l'engagement
4. Générer une liste d'actions (risque faible, moyen, risque élevé)

## Exemple

```
/renewal-forecast --cohort=2024-q3 --window=90d
→ 12 renouvellements dans la fenêtre ; 8 vert, 3 jaune, 1 rouge
```
