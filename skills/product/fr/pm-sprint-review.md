---
name: pm-sprint-review
description: "Revue de sprint : vélocité, livré vs prévu, blocages, apprentissages, priorités du prochain sprint"
---

# Compétence Revue de Sprint PM

## Quand l'activer
- Conduite de la revue et rétrospective de fin de sprint
- Préparation du deck de revue de sprint ou du compte-rendu async pour les parties prenantes
- Calcul de la vélocité et comparaison du périmètre livré vs prévu
- Extraction des blocages et causes racines d'un sprint qui a mal tourné
- Définition des priorités du prochain sprint en fonction de ce que vous avez appris
- Rédaction du résumé de sprint pour la direction ou les mises à jour investisseurs

## Quand NE PAS utiliser
- Grooming du backlog — utiliser `/user-story-writer` pour la création de user stories
- Planification de la roadmap trimestrielle — utiliser `/product-roadmap`
- Recherche utilisateur post-lancement — utiliser `/product-analytics` ou `/ux-researcher`
- Tri de bugs — c'est un outil rythmique, pas un framework de débogage

## Instructions

### Prompt principal de revue de sprint

```
Exécuter une revue de sprint pour [NOM DE L'ÉQUIPE] — Sprint [N], [DATES].

Objectif du sprint : [quel était l'objectif déclaré pour ce sprint]
Durée du sprint : [1 / 2 semaines]
Équipe : [N ingénieurs, N designers, N QA]
Contexte de vélocité : vélocité moyenne des 3 derniers sprints : [N story points]

Données du sprint (coller la liste de tickets ou le résumé) :
Tickets prévus : [liste avec story points et statut : terminé / partiel / non démarré / bloqué]
Travail non prévu ajouté en cours de sprint : [liste]
Total points prévus : [X] | Total livré : [X] | Vélocité ce sprint : [X]

Produire :

## 1. Résultat de l'objectif du sprint
L'objectif du sprint a-t-il été atteint ? [Oui / Partiel / Non]
Verdict en une phrase : ce qui a été accompli en langage courant.

## 2. Livré vs prévu (tableau)
| Fonctionnalité / User story | Points | Statut | Notes |
|---|---|---|---|
| [ticket] | [X] | Terminé / Partiel / Glissé | [toute note] |

## 3. Ce qui a glissé et pourquoi
Pour chaque élément inachevé : pourquoi ? (sous-estimé / bloqué / périmètre expansé / déprioritisé en cours de sprint)
Pattern de cause racine : y a-t-il un thème unique ? (ex. "3 des 4 glissements étaient bloqués par des changements d'API externe")

## 4. Analyse du travail non prévu
Quelle quantité de travail non prévu a été ajoutée ? Était-ce justifié ?
Règle : travail non prévu > 20% de la capacité du sprint indique un problème de planification ou de communication.

## 5. Tendance de vélocité
Tendance de vélocité sur 3 sprints : [Sprint N-2 : X] [Sprint N-1 : X] [Sprint N : X]
La vélocité s'améliore-t-elle, est-elle stable ou en baisse ? Qu'est-ce qui la conduit ?

## 6. Points saillants de la rétrospective
Ce qui a bien fonctionné (top 2) : spécifique, pas générique
Ce qui n'a pas fonctionné (top 2 avec cause racine) : honnête, avec responsable
Une action pour le prochain sprint : un seul changement de processus concret

## 7. Priorités du prochain sprint
Sur la base de ce qui a glissé et de ce qui est encore dans la file — top 5 des éléments recommandés pour le prochain sprint.
```

### Analyse de vélocité

```
Analyser la vélocité de [ÉQUIPE] sur les [N] derniers sprints.

Données de sprint :
Sprint 1 : prévu [X] pts, livré [X] pts, objectif du sprint : [atteint/manqué]
Sprint 2 : prévu [X] pts, livré [X] pts, objectif du sprint : [atteint/manqué]
Sprint 3 : prévu [X] pts, livré [X] pts, objectif du sprint : [atteint/manqué]
[...]

Diagnostiquer :
1. Vélocité moyenne : [X pts]
2. Prévisibilité : quel est l'écart-type ? Forte déviation = problème de planification
3. Pattern : l'équipe sur-engage-t-elle systématiquement ? Sous-livre-t-elle sur des types de travail spécifiques ?
4. Taux d'atteinte de l'objectif de sprint : [X / N sprints] — si en dessous de 70%, le processus de planification doit être revu
5. Capacité recommandée pour le prochain sprint basée sur la moyenne des 3 derniers sprints (pas le meilleur résultat optimiste)

Règle : utiliser 80% de la vélocité moyenne des 3 derniers sprints comme capacité réaliste du prochain sprint. Garder 20% pour le travail non prévu, les bugs et les réunions.

Recommandation : faut-il ajuster la durée du sprint, la taille de l'équipe ou le processus de planification ?
```

### Facilitation de rétrospective

```
Faciliter une rétrospective de sprint pour le Sprint [N].

Format : [synchrone / async]
Équipe : [N personnes, rôles]
Résultat du sprint : [objectif atteint / partiel / manqué]
Sujets sensibles connus : [tensions ou problèmes récurrents à traiter]

Structure de rétrospective :

1. CE QUI A BIEN FONCTIONNÉ (10 min)
Prompt : "Que feriez-vous de la même façon au prochain sprint sans hésitation ?"
Bon signal : la spécificité. Si les gens disent "la communication était bonne", demander "donnez-moi un exemple concret où c'était spécifiquement bien."
Capturer : les 2-3 thèmes principaux avec des exemples.

2. CE QUI N'A PAS FONCTIONNÉ (10 min)
Prompt : "Qu'est-ce qui vous a ralenti, frustré, ou que vous changeriez si vous pouviez refaire le sprint ?"
Règles :
- Pas de blâme individuel — blâmer les processus et les systèmes
- "Le processus de faire X était lent" pas "Jane était lente à faire X"
- Chaque problème reçoit une sévérité : serait-bien-à-corriger vs. cela-cause-des-dommages-réels

3. ANALYSE DE CAUSE RACINE (10 min)
Pour les 2 principaux éléments "ce qui n'a pas fonctionné" : appliquer les 5 pourquoi
Exemple :
Problème : "3 tickets ont glissé parce que nous étions bloqués sur l'API backend"
Pourquoi ? → L'API n'était pas prête quand le frontend en avait besoin
Pourquoi ? → Le périmètre de l'API n'était pas convenu avant le début du sprint
Pourquoi ? → La découverte se faisait en parallèle de l'implémentation
Pourquoi ? → Nous n'avons pas de "définition de prêt" pour le travail dépendant du frontend
Cause racine : nous démarrons le travail frontend avant que le contrat backend soit finalisé
Correction : ajouter "contrat API approuvé" à la définition de prêt pour tous les tickets frontend

4. ACTIONS (10 min)
Règle : maximum 2 actions par rétro. Plus de 2 et aucune ne sera faite.
Format : [QUOI] sera fait par [QUI] avant [DATE]
Exemple : "Jordan va rédiger une checklist de définition de prêt et la partager sur Slack avant lundi prochain"

Générer la structure de rétro et faciliter chaque section avec les données que je fournis.
```

### Résumé de sprint pour les parties prenantes

```
Rédiger le résumé de sprint par email/doc pour [AUDIENCE].

Audience : [direction / investisseurs / autres équipes / toute l'entreprise]
Sprint : [N] | Dates : [début-fin]
Objectif du sprint : [l'énoncer]

Règles de ton :
- Direction / investisseurs : 3 paragraphes max, commencer par le résultat, fondé sur les données, sans jargon
- Toute l'entreprise : célébrer les victoires avec des noms, expliquer les glissements sans blâme, définir les attentes
- Autres équipes : ce qui a été livré et qui les affecte, ce qui arrive ensuite, les demandes éventuelles

Modèle pour le résumé direction :

Le Sprint [N] a livré [X story points] sur [Y prévus], [atteint / partiellement atteint / manqué] l'objectif du sprint de "[objectif]".

Livrables clés expédiés : [2-4 bullets — noms spécifiques de fonctionnalités, pas de descriptions génériques]
[Fonctionnalité] : [ce qu'elle fait, quels clients l'ont demandée ou ce qu'elle débloque]
[Fonctionnalité] : [...]

Ce qui a glissé : [1-2 phrases — quoi et pourquoi, sans spin]

Priorité du prochain sprint : [la chose la plus importante livrée dans le Sprint N+1 et pourquoi elle est importante]

Générer le résumé pour mon audience avec les données de mon sprint.
```

### Prompt de planification de sprint (entrée pour le prochain sprint)

```
Planifier le Sprint [N+1] sur la base de la revue de ce sprint.

Capacité :
- Équipe : [N ingénieurs, N designers]
- Jours de sprint : [10 / 5 jours ouvrés]
- Congés ou RTT : [lister les absences]
- Capacité prévue : [N% de la normale — ex. 80% en raison de 2 jours de congé]

Éléments de backlog à considérer :
[Coller les 10-15 meilleurs candidats avec des estimations en story points]

Contraintes :
- Glissements du Sprint N (à reporter impérativement) : [liste]
- Livrables engagés (dépendances externes, promesses clients) : [liste]
- Optionnel (peut être abandonné si capacité insuffisante) : [liste]

Candidats à l'objectif du sprint :
Option A : [objectif] — justification
Option B : [objectif] — justification
Option C : [objectif] — justification

En utilisant la vélocité des 3 derniers sprints de [X pts] et la règle de capacité à 80%, recommander :
1. L'objectif du sprint (quelle option, et pourquoi)
2. Exactement quels éléments engager dans ce sprint
3. Ce qu'il faut laisser dans le backlog
4. Risque : quels éléments de ce plan sont susceptibles de glisser, et pourquoi
```

## Exemple

**Utilisateur :** Sprint 23, sprint de 2 semaines. Objectif : "Lancer l'export CSV pour que les utilisateurs enterprise puissent télécharger leurs données." Équipe de 4 ingénieurs, 1 designer. Prévu 42 pts. Livré : export CSV (terminé, 13 pts), UI de sélection en masse (terminé, 8 pts), rate limiting API (partiel — 5/8 pts livrés), 3 corrections de bugs (terminé, 7 pts), nouveau flux d'onboarding (non démarré, 14 pts, raison : design non finalisé). Vélocité Sprint 22 : 38. Sprint 21 : 40.

**Résultat :**

```markdown
# Revue Sprint 23 — Semaine se terminant le 6 juin

## Résultat de l'objectif du sprint
PARTIEL — Nous avons livré la fonctionnalité phare (export CSV) mais le flux d'onboarding n'a pas démarré en raison du design non finalisé avant le début du sprint. L'objectif principal pour les clients enterprise a été atteint.

## Livré vs prévu
| Élément | Points | Statut | Notes |
|---|---|---|---|
| Export CSV | 13 | Terminé | Objectif du sprint atteint |
| UI sélection en masse | 8 | Terminé | Active l'UX d'export CSV |
| Rate limiting API | 8 | Partiel (5 livrés) | Gestion des cas limites encore ouverte |
| Corrections de bugs (3) | 7 | Terminé | |
| Nouveau flux d'onboarding | 14 | Non démarré | Design non finalisé au début du sprint |
| **Total** | **50** | **33 livrés** | **Taux de complétion : 66%** |

## Ce qui a glissé et pourquoi
Flux d'onboarding (14 pts) : le design n'était pas finalisé avant la planification du sprint. Ce n'est pas un problème d'exécution du sprint — c'est un problème de processus. L'équipe a pris des engagements sur du travail qui n'était pas prêt.
Cause racine : nous n'avons pas de "définition de prêt" — les tickets entraient dans la planification de sprint sans validation design.

Rate limiting API (3 pts restants) : cas limites sous-estimés. Pas un problème systémique.

## Travail non prévu
Aucun ajout en cours de sprint. Bonne discipline ce sprint.

## Tendance de vélocité
Sprint 21 : 40 pts | Sprint 22 : 38 pts | Sprint 23 : 33 pts
Vélocité en baisse. Les 14 pts de travail non démarré masquent un vrai problème de capacité —
l'équipe n'obtient pas la validation design en amont avant de s'engager.

## Points saillants de la rétrospective
Ce qui a bien fonctionné :
1. Export CSV livré dans les délais, sans rework — bon cadrage initial par le lead ingénierie.
2. Le lot de corrections de bugs a été efficace — 3 bugs fermés en une session concentrée.

Ce qui n'a pas fonctionné :
1. Flux d'onboarding engagé sans préparation du design. A gaspillé la discussion de planification du sprint.
   Action : Sarah va rédiger une checklist "définition de prêt" et l'ajouter à notre modèle de sprint d'ici lundi prochain.

2. Le rate limiting API a été sous-estimé. Nous n'évaluons pas correctement la complexité backend.
   Action : Les estimations backend incluront désormais +2 pts de marge pour les cas limites.

## Priorités du prochain sprint
1. Flux d'onboarding (14 pts) — s'engager uniquement une fois le design validé (définition de prêt)
2. Cas limites restants du rate limiting API (3 pts) — reporter, petite taille
3. [Éléments suivants du backlog selon les priorités de la roadmap]

Capacité recommandée Sprint 24 : 37 pts (80% de la moyenne 3 sprints de 39 pts)
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
