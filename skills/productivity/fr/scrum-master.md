---
name: scrum-master
description: "Facilitation Scrum : cérémonies de sprint, formats rétrospectifs, suppression des obstacles, coaching de vélocité, mise à l'échelle de scrum sur plusieurs équipes — modèles pratiques de Scrum Master"
---

# Habilidad Scrum Master

## Quand l'activer
- Faciliter les cérémonies de sprint (planification, standup, revue, rétro)
- Diriger les rétrospectives qui soulèvent les vrais problèmes (pas seulement « ce qui s'est bien passé »)
- Aider une équipe qui lutte avec la vélocité, la portée ou l'engagement
- Passer de une équipe à plusieurs équipes (Scrum of Scrums, bases SAFe)
- Former une nouvelle équipe aux pratiques Scrum
- Rédiger des agendas pour les cérémonies de sprint

## Quand NE PAS l'utiliser
- Configuration Jira — utiliser la habilité jira-expert
- Décisions de feuille de route produit — c'est le domaine du PM
- Décisions techniques d'ingénierie — pas une préoccupation du Scrum Master
- Remplacer un vrai Scrum Master pour les équipes en conflit — une facilitation humaine est nécessaire

## Instructions

### Rétrospective de sprint

```
Concevoir une rétrospective pour [contexte d'équipe].

Taille d'équipe : [X personnes]
Longueur du sprint : [2 semaines]
Santé d'équipe : [saine / quelque tension / en difficulté]
Dernière rétro : [quel format / ce qui en est sorti]
Événement remarquable de ce sprint : [incident / pression de livraison / changement d'équipe / aucun]

Choisir un format rétrospectif basé sur le contexte :

1. Commencer / Arrêter / Continuer (par défaut, contextes d'équipe entière) :
   - Commencer : qu'avons-nous dû commencer ?
   - Arrêter : que devrions-nous cesser de faire ?
   - Continuer : qu'est-ce qui fonctionne que nous devrions protéger ?
   Durée : 60 min pour un sprint de 2 semaines

2. 4Ls (après un sprint difficile) :
   - Aimé : qu'avez-vous apprécié ?
   - Appris : qu'avez-vous découvert ?
   - Manqué : qu'est-ce qui manquait ?
   - Longtemps pour : qu'auriez-vous souhaité être différent ?

3. Voilier (pour les équipes se sentant sans direction) :
   - Vent (nous propulsant) : qu'est-ce qui nous aide à avancer ?
   - Ancres (nous ralentissant) : qu'est-ce qui nous retient ?
   - Roches (risques à venir) : qu'est-ce qui pourrait nous couler ?
   - Soleil (destination) : vers quoi navigons-nous ?

4. Chronologie (après des incidents ou des livraisons majeures) :
   - Mapper le sprint sur une chronologie
   - Marquer les points forts et faibles comme une équipe
   - Discuter de ce qui a causé chaque pic et vallée
   - Identifier les modèles

Guide de facilitation pour [format choisi] :
1. Préparer le terrain (5 min) : encadrement de la sécurité psychologique
2. Rassembler les données (15 min) : autocollants silencieux sur le tableau
3. Insights (20 min) : regrouper les autocollants en thèmes, discuter
4. Décider quoi faire (15 min) : voter sur les 2-3 meilleurs éléments d'action
5. Fermer (5 min) : confirmer les propriétaires et les dates d'échéance pour chaque action

Règle : aucune rétro ne se termine sans propriétaire nommé et date d'échéance pour chaque élément d'action. « L'équipe va... » = personne ne le fera.

Générer l'agenda complet pour mon contexte spécifique.
```

### Facilitation de Standup

```
Améliorer notre standup quotidien.

Standup actuel : [décrire — combien de temps, format, problèmes]
Taille d'équipe : [X personnes]
Distant / sur place / hybride : [spécifier]
Problèmes courants : [trop long / les gens ne sont pas présents / aucun obstacle partagé / rapport de statut au lieu de sync]

Formats de Standup :

3 questions classiques (par personne) :
1. Qu'ai-je fait hier ?
2. Que fais-je aujourd'hui ?
3. Y a-t-il des obstacles ?
Problème : devient un rapport de statut — les gens parlent AU Scrum Master, pas les uns aux autres.

Parcourir le tableau (mieux pour la focus en cours) :
- Regarder chaque élément « In Progress », pas chaque personne
- « Qui travaille sur ceci ? Y a-t-il des obstacles ? »
- Se concentre sur la finition, pas le démarrage
- Mieux pour les équipes adjacentes à Kanban

Modèle à deux questions (plus léger) :
1. Sur quoi je travaille ?
2. Ai-je besoin d'aide ?
Pas « hier » = réduit le standup à < 10 minutes avec < 10 personnes

Conseils pour standup distant :
- Utiliser un tableau partagé (Jira, Linear) à l'écran — empêche les rapports de statut abstraits
- Commencer à temps, se terminer à temps — les retardataires rejoignent sans récapitulatif
- Les obstacles vont dans Slack async ; le standup est pour la coordination, pas la résolution

Anti-motifs de standup courants à corriger :
- « Aucun obstacle » chaque jour → les obstacles existent ; les gens ne sont pas à l'aise de partager
  Corriger : demander « qu'est-ce qui vous ferait aller plus vite ? » à la place
- Une personne parle pendant 5+ minutes → utiliser un minuteur (2 min/personne)
- Personne ne déplace ses tickets après → les obstacles ou les tickets sont mauvais

Redesigner mon standup pour le contexte de mon équipe.
```

### Coaching de vélocité

```
Aider à améliorer la vélocité d'équipe.

Vélocité actuelle : [X points d'histoire / moyenne de sprint des 3 derniers sprints]
Longueur du sprint : [2 semaines]
Taille d'équipe : [X ingénieurs]
Problèmes connus : [scope creep / estimations irréalistes / interruptions / dette technique / histoires peu claires]

Cadre de diagnostic de vélocité :

Étape 1 — Distinguer les types de problèmes de vélocité :
a) Problème d'engagement : l'équipe s'engage à X, livre Y < X → la planification est cassée
b) Problème d'estimation : l'équipe livre X mais les histoires sont constamment ré-estimées plus haut en cours de sprint
c) Problème d'interruption : travail non planifié (bugs, incidents, demandes slack) mangeant la capacité
d) Problème de livraison : les histoires restent « In Progress » pendant la plupart du sprint

Étape 2 — Mesurer le vrai problème :
- Taux d'interruption : suivre le travail non planifié ajouté en cours de sprint pendant 3 sprints. Si > 20% du travail engagé, c'est le problème — pas l'estimation.
- Temps de cycle : si les histoires prennent en moyenne > 5 jours, la limite WIP est trop élevée
- Taux d'engagement : engagé / livré sur les 3 derniers sprints

Étape 3 — Interventions par type de problème :
a) Engagement : run sprint planning avec l'équipe, pas pour eux. Arrêtez de vous engager à des histoires non raffinées.
b) Estimation : run une session d'étalonnage de pointage (comparer les estimations passées à l'actual)
c) Interruptions : budgétisez pour les interruptions (réservez 20% de la vélocité pour le travail non planifié)
d) Temps de cycle : appliquer une limite WIP de 2 histoires maximum par ingénieur

Étape 4 — Ne pas optimiser la vélocité directement :
La vélocité est un outil de planification, pas une métrique de performance. Une équipe qui fait 40 points de travail significatif vaut mieux qu'une qui fait 60 points de travail de faible valeur.

Diagnostiquer le problème de vélocité de mon équipe et recommander le changement à plus grand effet de levier.
```

### Calendrier des cérémonies Scrum

```
Concevoir le calendrier des cérémonies de sprint pour [équipe].

Équipe : [X personnes — ingénieurs, PM, designer, QA]
Longueur du sprint : [2 semaines]
Fuseau horaire : [tous les mêmes / distribués]
Chevauchement des heures de travail : [X heures/jour de chevauchement]

Calendrier de cérémonie de sprint de deux semaines :

Lundi, Démarrage du Sprint :
- 10:00 — Planification du Sprint (2 heures)
  Qui : Équipe entière
  Objectif : carnet de commandes du sprint d'accord, objectif du sprint défini

Quotidien, lundi-vendredi :
- 09:30 — Standup quotidien (max 15 min)
  Qui : Équipe entière
  Format : Parcourir le tableau

Vendredi de la semaine 1 :
- 15:00 — Affinement du carnet de commandes (1 heure)
  Qui : PM + 2-3 ingénieurs (rotation)
  Objectif : 10 meilleurs éléments du carnet de commandes estimés et clarifiés

Jeudi de la semaine 2 (jour avant la fin du sprint) :
- 14:00 — Examen du Sprint (1 heure)
  Qui : Équipe entière + parties prenantes
  Objectif : Démontrer le travail terminé, rassembler les commentaires
- 15:30 — Rétrospective (1 heure)
  Qui : Équipe uniquement (pas de parties prenantes)
  Objectif : 2-3 améliorations actionnables pour le prochain sprint

Vendredi de la semaine 2 (Fin du Sprint) :
- L'équipe complète le travail restant
- PM ferme le sprint dans Jira, prépare le graphique de vélocité

Concevoir le calendrier pour la taille de mon équipe, le fuseau horaire et le style de travail.
```

## Exemple

**Utilisateur :** Nos rétrospectives se terminent toujours avec les mêmes 3 éléments d'action (« écrire de meilleurs tickets », « communiquer davantage », « réduire le scope creep ») et rien ne change jamais. Comment corriger cela ?

**Diagnostic de Claude :**

Ces 3 éléments d'action sont des platitudes de processus — ils nomment des symptômes sans aborder les causes, et ils n'ont pas de propriétaire. C'est pourquoi rien ne change. La rétro fait la bonne cérémonie, mais la mauvaise chose.

**Cause profonde de « écrire de meilleurs tickets » :**
Cela signifie : les tickets qui vont dans le sprint manquent de spécifications, causant du rework ou une mise en œuvre incorrecte.
Vraie question à poser : « Quel ticket des 3 derniers sprints a causé le plus de rework ? Pourquoi était-ce peu clair ? Qui l'a écrit ? Qu'est-ce qui manquait ? »
Action spécifique : « Avant la planification du prochain sprint, le PM examine tous les tickets avec l'ingénieur qui les possèdera — prend 30 min chaque jeudi. »

**Cause profonde de « communiquer davantage » :**
Ceci est habituellement un symptôme de propriété peu claire, pas un échec de communication.
Vraie question : « Au cours du dernier sprint, quand n'aviez-vous pas su quoi faire ensuite et aviez dû demander à quelqu'un ? Pourquoi ne vous avait-on pas dit plus tôt ? »
Action spécifique : « Ajouter un champ « dépendances » à chaque histoire > 3 points — qui d'autre doit être impliqué ? »

**Cause profonde de « réduire le scope creep » :**
Cela signifie : les éléments sont ajoutés en cours de sprint sans en supprimer d'autres.
Vraie question : « Qui a approuvé les ajouts en cours de sprint au cours des 3 derniers sprints ? Était-ce urgent ou évitable ? »
Action spécifique : « Nouvel élément ajouté en cours de sprint nécessite l'approbation explicite du PM + responsable technique ET la suppression de points équivalents. »

**Changement de format rétro :**
Arrêtez d'utiliser Commencer/Arrêter/Continuer. Passer à une rétrospective de chronologie — revenir à travers le dernier sprint jour après jour. Cela force les exemples spécifiques plutôt que les plaintes génériques, et les exemples spécifiques ont des causes spécifiques.

---
