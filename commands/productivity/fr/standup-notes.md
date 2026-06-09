---
description: Générer une mise à jour de standup basée sur l'activité git récente ou des notes libres
argument-hint: "[context or notes]"
---
Générer une mise à jour de standup concise basée sur : $ARGUMENTS

Si $ARGUMENTS est vide, inspecter l'historique git des 24 dernières heures (`git log --since="24 hours ago" --oneline --author=$(git config user.email)`) et déduire hier/aujourd'hui à partir des commits. Si le référentiel contient des modifications en attente ou non validées, noter ce qui est en cours.

Structurer la sortie en trois sections simples — pas d'en-têtes, pas de puces sauf si naturel :

Hier : ce qui a été complété ou significativement avancé.
Aujourd'hui : ce qui est planifié ou actuellement en cours.
Blocages : tout ce qui bloque la progression. Si rien, omettre cette ligne entièrement.

Règles :
- Garder chaque section à 1–3 phrases maximum.
- Écrire à la première personne, temps passé/présent.
- Éliminer les détails d'implémentation — écrire au niveau de la tâche/fonctionnalité, pas les noms de fonctions.
- Ne pas mentionner les chemins de fichier, les numéros de ligne ou les SHA de commit.
- Ne pas ajouter de formules de politesse, de signatures ou de phrases de remplissage comme « J'espère que tout le monde va bien ».
- Si $ARGUMENTS contient des notes explicites, les préférer à l'historique git.
- Si l'historique git est ambigu (commits de fusion, tâches seulement), poser une question de clarification avant la génération.

Afficher uniquement le texte du standup. Pas de préambule, pas d'emballage « Voici votre standup : ».
