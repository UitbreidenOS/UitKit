# Migration de Schéma

## Quand activer

Ajout ou modification de colonnes, changement de types de données, ou gestion des changements de schéma avec rupture de compatibilité.

## Quand NE PAS utiliser

Non adapté pour les corrections de données ponctuelles ; concentrez-vous sur les changements structurels.

## Instructions

1. Planifier la fenêtre de compatibilité rétroactive
2. Écrire des tests de migration
3. Ajouter des feature flags pour les nouvelles colonnes
4. Documenter la procédure de restauration

## Exemple

**Scénario :** Ajouter une colonne « user_premium » à la table clients. Fenêtre : v1 (ancien code, ne lit pas) et v2 (nouveau code, ignore les colonnes manquantes) en parallèle pendant 2 semaines. Tests couvrent les cas NULL. Restauration : supprimer la colonne et restaurer le code.
