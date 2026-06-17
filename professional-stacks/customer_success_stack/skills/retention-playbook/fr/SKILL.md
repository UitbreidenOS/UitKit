# Skill: Playbook de Rétention

## Quand activer

Santé du compte <50 ou drapeau explicite de risque provenant de la détection de churn.

## Quand ne pas utiliser

Ne pas appliquer aux nouveaux comptes dans les 30 premiers jours (utiliser l'intégration à la place).

## Instructions

1. Identifier la raison du risque (faible engagement, problème de facturation, retard du support, lacune de fonctionnalité)
2. Sélectionner le playbook (cadence de réengagement, réunion avec cadre, offre de migration, etc.)
3. Planifier la sensibilisation avec messages modèles
4. Suivre l'achèvement et la réponse du sentiment

## Exemple

```
/retention-playbook --account=startup-xyz --risk=engagement
→ Playbook: série de réengagement de 3 semaines
→ Début: Demain, 14h00 PT
```
