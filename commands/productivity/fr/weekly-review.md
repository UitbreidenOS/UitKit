---
description: Produire une revue hebdomadaire à partir de l'historique git, des notes ou d'une saisie libre
argument-hint: "[contexte de la semaine, notes ou laisser vide pour git]"
---
Générez une revue hebdomadaire basée sur : $ARGUMENTS

Si $ARGUMENTS est vide ou minimal, exécutez `git log --since="7 days ago" --oneline --author=$(git config user.email)` pour dériver les réalisations des commits.

Produisez ces sections :

**Livré / Complété**  
Liste à puces. Chaque élément est un livrable ou jalon concret, pas une tâche. Groupez les commits associés en un seul élément. Maximum 8 puces.

**En cours**  
Liste à puces. Ce qui est activement en cours et devrait être clos dans 1-2 semaines. Incluez un pourcentage d'achèvement approximatif si déductible.

**Bloqué / À risque**  
Liste à puces. Pour chaque élément : ce qui est bloqué, pourquoi et qui/quoi le débloque. Omettez si rien n'est bloqué.

**Apprentissages**  
2-4 puces. Observations concernant le processus, l'outillage, l'approche ou les connaissances du domaine acquises cette semaine. Pas un résumé de ce qui a été fait — enseignements uniquement.

**Priorités de la semaine prochaine**  
3-5 puces. Priorités concrètes pour la semaine à venir, ordonnées par importance.

Règles :
- Écrivez à la première personne.
- Calibrez les détails sur le rapport signal/bruit : ignorez les tâches triviales et les mises à jour de dépendances sauf si elles ont été difficiles.
- N'incluez pas les estimations de temps pour la semaine prochaine sauf si l'entrée les a fournies.
- Si l'historique git ne montre que des commits automatisés (bots, CI), notez-le et demandez une saisie manuelle.
- Limitez chaque puce à une phrase sauf si une deuxième phrase ajoute du contexte essentiel.
- La sortie totale doit être scannable en moins de 2 minutes.

Ne produisez que la revue hebdomadaire.
