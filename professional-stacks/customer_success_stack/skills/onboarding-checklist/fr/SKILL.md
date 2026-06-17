# Skill: Liste de contrôle d'intégration

## Quand activer

Nouvelle inscription client ou mise à niveau vers un nouveau niveau de plan.

## Quand NE PAS utiliser

Ne pas appliquer aux clients existants en cours de contrat (utiliser le plan de succès à la place).

## Instructions

1. Générer une liste de contrôle basée sur les rôles (administrateur, utilisateur, intégrateur)
2. Suivre l'achèvement via des cases à cocher automatisées ou manuelles
3. Alerter sur les blocages (intégration manquante, facture impayée)
4. Mesurer le délai de rentabilisation (jours jusqu'à la première utilisation)

## Exemple

```
/onboard-checklist --customer=startup-xyz --plan=pro
→ 12 éléments; 8 terminés, 4 en attente
→ Blocage : Authentification de l'intégration Salesforce
```
