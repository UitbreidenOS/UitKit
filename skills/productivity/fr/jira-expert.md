---
name: jira-expert
description: "Gestion de projet Jira : configuration du tableau, hiérarchie des problèmes, conception du flux de travail, requêtes JQL, planification du sprint, rapports et meilleures pratiques Jira pour les équipes d'ingénierie"
---

# Compétence Jira Expert

## Quand l'activer
- Configurer un nouveau projet Jira ou restructurer un existant
- Écrire des requêtes JQL pour trouver des problèmes spécifiques
- Concevoir un flux de travail qui correspond à votre processus de développement
- Configurer des sprints, des épics et une hiérarchie d'histoires
- Construire des rapports et tableaux de bord Jira
- Déboguer pourquoi les tableaux ou automatisations Jira ne fonctionnent pas comme prévu

## Quand NE PAS l'utiliser
- Planification de la feuille de route produit — c'est une conversation sur la compétence product-roadmap
- Rétrospectives de sprint — utiliser un vrai processus de facilitation d'équipe
- Migration loin de Jira — évaluer les outils d'abord, puis migrer

## Instructions

### Configuration du projet

```
Configurer un projet Jira pour [équipe/produit].

Équipe : [X ingénieurs, Scrum / Kanban / mixte]
Méthodologie : [Scrum (sprints limités dans le temps) / Kanban (flux continu) / Scrumban]
Type de projet : [Logiciel / Entreprise / Gestion de services]
Besoins d'intégration : [GitHub / GitLab / Confluence / Slack]

Configuration recommandée :

Type de projet : [Logiciel] — vous donne les sprints, le carnet de commandes et le reporting de vélocité

Hiérarchie des problèmes :
Epic → Historique → Sous-tâche (standard)
ou
Initiative → Epic → Historique → Sous-tâche (pour les grands programmes)

Conception du flux de travail :
Simple (recommandé pour la plupart des équipes) :
  À faire → En cours → En révision → Terminé

Avec plus de granularité :
  Carnet de commandes → Sélectionné pour Dev → En cours → En révision → En QA → Terminé

Statuts à éviter :
- « En attente » sans clarté sur qui attend quoi
- Trop de statuts — chaque statut est un transfert qui a besoin d'un rituel

Points d'histoire vs. estimations de temps :
- Utiliser les points d'histoire pour l'estimation relative de la complexité (Fibonacci : 1,2,3,5,8,13)
- Ne jamais utiliser les heures — fausse précision qui prend du temps de discussion

Composants : utiliser pour regrouper par domaine technique (Frontend, Backend, Infrastructure, Mobile)
Étiquettes : utiliser pour les préoccupations transversales (performance, sécurité, dette)

Configurer ce projet et configurer le tableau initial.
```

### Requêtes JQL

```
Écrire des requêtes JQL pour [cas d'usage].

J'ai besoin de trouver : [décrivez ce que vous cherchez]
Projet : [clé de projet — par ex. ENG, BACKEND]

Modèles JQL courants :

Tous les problèmes ouverts m'étant attribués :
  assignee = currentUser() AND resolution = Unresolved

Problèmes ajoutés au sprint actuel après son début (scope creep) :
  sprint = "Sprint 23" AND created > startOfSprint()

Tous les bugs prioritaires ouverts depuis plus de 7 jours :
  issuetype = Bug AND priority in (High, Critical) AND created <= -7d AND resolution = Unresolved

Problèmes en révision sans commentaires depuis 2+ jours (PRs obsolètes) :
  status = "In Review" AND updated <= -2d AND issuetype = Story

Tous les problèmes dans une épique :
  "Epic Link" = ENG-123
  ou (Prochaine génération) : parentEpic = ENG-123

Bloqueurs de vélocité (en cours depuis plus que la moyenne du sprint) :
  status = "In Progress" AND updated <= -5d AND sprint in openSprints()

Problèmes terminés cette semaine (pour standup / notes de publication) :
  status = Done AND resolved >= startOfWeek()

Tous les problèmes sans assignataire dans le carnet de commandes :
  assignee is EMPTY AND status = "To Do" AND sprint is EMPTY

Écrire une requête JQL pour mon cas d'usage spécifique. Inclure une description de ce qu'elle retourne.
```

### Planification du sprint

```
Aider à exécuter la planification du sprint pour [équipe].

Équipe : [X ingénieurs]
Longueur du sprint : [1 semaine / 2 semaines]
Vélocité d'équipe : [X points d'histoire en moyenne sur les 3 derniers sprints]
Objectif du sprint pour ce sprint : [ce que nous voulons accomplir]
État du carnet de commandes : [entretenu / nécessite un entretien]

Liste de contrôle de planification du sprint :

Pré-planification (jour avant) :
□ Carnet de commandes entretenu : top 20 éléments estimés et compris
□ Objectif du sprint rédigé (1 phrase — à quoi ressemble le succès)
□ Capacité confirmée : qui est absent ? (PTO, sur appel, entretiens)
□ Capacité ajustée : [vélocité d'équipe × disponibilité %]

Pendant la planification (session de 2 heures pour sprint de 2 semaines) :

Partie 1 — Alignement des objectifs (15 min) :
- PO présente l'objectif du sprint
- L'équipe confirme qu'il est réalisable et précieux
- Y a-t-il des obstacles au démarrage du sprint ?

Partie 2 — Affinage du carnet de commandes (45 min, si pas déjà fait) :
- Parcourir les meilleurs articles du carnet de commandes
- L'équipe pose des questions de clarification → ajouter des critères d'acceptation
- Re-estimer si la compréhension a changé

Partie 3 — Engagement (45 min) :
- L'équipe tire les histoires du haut du carnet de commandes jusqu'à ce que la vélocité soit atteinte
- Les ingénieurs divisent les histoires en sous-tâches (aide à révéler la complexité cachée)
- Appeler les dépendances entre les éléments
- Derniers 10 min : relire le sprint — tout le monde est d'accord ?

Partie 4 — Sprint commencé (15 min) :
- Commencer le sprint dans Jira
- Déplacer la première tâche de chaque personne vers « En cours »

JQL pour vérification de capacité :
  sprint = "Sprint [X]" AND assignee = [ingénieur] ORDER BY priority

Résultat : modèle d'agenda de planification du sprint + requêtes JQL pour la session.
```

### Reporting et tableaux de bord Jira

```
Construire un tableau de bord Jira pour [audience].

Audience : [équipe d'ingénierie / gestionnaire de produit / cadre]
Métriques nécessaires : [vélocité / taux de bug / santé du sprint / progrès OKR]

Gadgets de tableau de bord pour les équipes d'ingénierie :
- Santé du sprint : problèmes faits vs. engagés (burndown)
- Graphique de vélocité : derniers 6-8 sprints — tendance haut/bas/plat ?
- Créés vs. Résolus : résolvons-nous les bugs plus vite qu'ils ne sont créés ?
- Temps de cycle : temps moyen de « En cours » à « Terminé » par type de problème

Tableau de bord pour les gestionnaires de produit :
- Progrès des épiques : % complété pour chaque épique en vol
- Burndown de publication : points d'histoire restants vers la cible de publication
- Problèmes sans estimations : signaler les lacunes de planification
- Terminé ce sprint : ce qui a été expédié (utiliser dans l'examen hebdomadaire)

Tableau de bord exécutif :
- Santé OKR : [personnalisée — lier les épiques aux OKR via étiquettes ou champ personnalisé]
- Tendance de vélocité d'équipe : [devenons-nous plus rapides ou plus lents ?]
- Compte des bugs par gravité : [combien de bugs critiques/élevés ouverts ?]
- Cadence de publication : [dates des 5 dernières versions]

JQL pour les gadgets de tableau de bord commun :
Taux de bug (bugs créés les 30 derniers jours) :
  issuetype = Bug AND created >= -30d

Temps de cycle (résolu ce sprint) :
  status = Done AND sprint in closedSprints() ORDER BY resolved DESC

Carnet de commandes non estimé :
  story_points is EMPTY AND status = "To Do" AND sprint is EMPTY

Construire la configuration du gadget de tableau de bord pour mon audience.
```

### Recettes d'automatisation

```
Mettre en place l'automatisation Jira pour [flux de travail].

Cas d'usage : [décrivez ce que vous voulez automatiser]

Recettes d'automatisation Jira courantes :

Attribution automatique au changement de statut :
  Déclencheur : Le problème a transité vers « En révision »
  Condition : L'assignataire est [ingénieur]
  Action : Assigner à [examinateur] + Ajouter un commentaire « Prêt pour révision »

Fermeture automatique des bugs obsolètes :
  Déclencheur : Planifié (hebdomadaire)
  Condition : status = "To Do" AND updated <= -90d AND priority = Low
  Action : Transition vers « Won't Fix » + Commentaire « Auto-fermé après 90 jours d'inactivité »

Notifier Slack sur bug critique :
  Déclencheur : Problème créé
  Condition : issuetype = Bug AND priority = Critical
  Action : Envoyer un message Slack à #engineering-alerts avec lien vers le problème

Synchroniser les RP GitHub avec Jira :
  Déclencheur : RP GitHub ouvert (via intégration GitHub)
  Action : Transition du problème lié vers « En révision »

Transition automatique au fusionner les RP :
  Déclencheur : RP GitHub fusionné
  Action : Transition du problème Jira lié vers « Terminé »

Avertissement de vélocité du sprint :
  Déclencheur : Planifié (quotidien, pendant le sprint)
  Condition : Sprint % complété > 70% AND points faits / points engagés < 0.5
  Action : Notifier le PO via commentaire sur le tableau de sprint

Écrire les règles d'automatisation pour mon cas d'usage spécifique.
```

## Exemple

**Utilisateur :** Notre tableau Jira est un gâchis — 200+ problèmes dans le carnet de commandes, la moitié sans estimations, pas d'objectifs de sprint clairs, et la vélocité a chuté de 45 à 28 en 3 mois. Par où commencer ?

**Plan de récupération de Claude :**

Chute de vélocité de 45→28 en 3 mois = déclin de 38%. Ce n'est pas un problème Jira — Jira expose un problème d'équipe. Ne reconfigurez pas Jira sans comprendre la cause réelle.

**Étape 1 — Diagnostiquer avant de corriger (cette semaine) :**

JQL : qu'a-t-on terminé dans chacun des 3 derniers sprints ?
```
sprint in closedSprints() AND status = Done ORDER BY resolved DESC
```
Les mêmes types de problèmes réapparaissent-ils régulièrement ? Si oui : bugs récurrents ou dette technique non résolue mangeant la vélocité.

JQL : combien de bugs ont été créés au cours des 90 derniers jours ?
```
issuetype = Bug AND created >= -90d
```
Si le volume de bugs augmente, la baisse de vélocité est causée par du travail non planifié, pas une dysfonction de planification.

**Étape 2 — Chirurgie du carnet de commandes (1 session d'équipe, 90 min) :**
- Trier par « Last Updated » croissant
- Tout problème intact > 3 mois sans sprint assigné → archiver (ne fera pas ou ne fera pas)
- Ne les estimez pas — supprimez juste le bruit
- Cible : carnet de commandes sous 80 éléments avant le prochain sprint

**Étape 3 — Restaurer l'hygiène du sprint :**
- Objectif du sprint : une phrase, convenue avant le début du sprint
- Pas d'ajout d'éléments en cours de sprint sans en supprimer un de taille égale
- Rétrospective : exécuter un « qu'est-ce qui nous a ralentis ce sprint ? » à la fin de chaque sprint pendant 4 sprints

**Étape 4 — Suivre le temps de cycle, pas seulement la vélocité :**
Ajouter un gadget « Cycle Time » à votre tableau. Si le temps de cycle augmente (les histoires prennent plus de temps à compléter), le problème est la limite WIP — trop de choses en cours à la fois.

---
