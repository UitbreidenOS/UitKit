# Claude pour les Product Managers

Tout ce dont un chef de produit a besoin pour mener une découverte augmentée par l'IA, planifier une feuille de route, piloter la livraison des sprints, aligner les parties prenantes et prendre des décisions basées sur les données — avec Claude Code.

---

## À qui s'adresse ce guide

Vous êtes PM dans une startup ou une scale-up, gérant un produit avec de vrais clients, une équipe d'ingénierie qui dépend de vous pour des spécifications claires, et des parties prenantes qui ont besoin d'alignement. Vous passez trop de temps à rédiger des documents, préparer des réunions et chasser des décisions. Claude Code réduit ces frais généraux pour que vous puissiez passer plus de temps avec les clients et réfléchir au produit.

**Avant Claude Code :** 4 heures pour rédiger un PRD. 2 heures pour préparer des entretiens de découverte. 1 heure pour rédiger des user stories de sprint. Une demi-journée pour construire une analyse concurrentielle.

**Après :** PRD rédigé en 45 minutes. Guide d'entretien en 10 minutes. Backlog de sprint affiné en 30 minutes. Analyse concurrentielle en une heure.

---

## Installation en 30 secondes

```bash
# Install the full PM stack
npx claudient add skill product/product-discovery
npx claudient add skill product/product-roadmap
npx claudient add skill product/experiment-designer
npx claudient add skill product/product-analytics
npx claudient add skill product/competitive-teardown
npx claudient add skill product/ux-researcher
npx claudient add skill product/code-to-prd
npx claudient add skill product/product-manager-toolkit
npx claudient add skill product/pm-sprint-review
npx claudient add skill product/user-story-writer
npx claudient add agents advisors/cpo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Votre stack PM Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/product-discovery` | Guides d'entretiens clients, analyse JTBD, notation des opportunités, briefs de problèmes | Avant de s'engager à construire quoi que ce soit |
| `/user-story-writer` | Convertir des idées brutes en user stories structurées avec critères d'acceptation et cas limites | Grooming du backlog, planification de sprint |
| `/code-to-prd` | Rétro-concevoir un PRD à partir du code existant — ou générer un PRD à partir d'un brief | Documentation des fonctionnalités, alignement des parties prenantes |
| `/product-roadmap` | Construire et communiquer une feuille de route priorisée avec justification | Planification trimestrielle, revues des parties prenantes |
| `/pm-sprint-review` | Vélocité du sprint, livré vs planifié, rétro, priorités du prochain sprint | Fin de chaque sprint |
| `/experiment-designer` | Conception de tests A/B, cadrage d'hypothèses, taille d'échantillon, métriques de succès | Expériences de croissance, feature flags |
| `/product-analytics` | Analyse des entonnoirs, rétention par cohorte, schéma d'événements, interprétation des métriques | Revue hebdomadaire des données, post-lancement |
| `/ux-researcher` | Scripts de tests d'utilisabilité, synthèse d'entretiens, construction de personas | Validation du design |
| `/competitive-teardown` | Analyse complète des concurrents : positionnement, fonctionnalités, tarification, SWOT | Trimestriel, avant les cycles de planification |
| `/product-manager-toolkit` | Cadres de priorisation (RICE, ICE, MoSCoW), cartes des parties prenantes, documents de décision | Pratique quotidienne du PM |

### Agents

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `cpo-advisor` | Opus | Décisions produit stratégiques, arbitrages de feuille de route, conception organisationnelle |
| `competitive-analyst` | Sonnet | Intelligence concurrentielle détaillée, benchmarking des fonctionnalités |

---

## Flux de travail quotidien

### Préparation du standup du matin (10 minutes)

```
/pm-sprint-review

Résumé rapide du standup pour le Sprint [N] — Jour [X] :

Équipe : [N ingénieurs, N designers]
Objectif du sprint : [l'énoncer]

Mises à jour d'hier (extraire de Linear/Jira) :
- [Ticket] complété par [personne]
- [Ticket] en revue
- [Ticket] bloqué — [raison]

Plan d'aujourd'hui :
- [Ticket] — [nom de l'ingénieur]
- [Ticket] — [nom du designer]

Blocages nécessitant l'attention du PM :
- [Blocage 1 — que dois-je résoudre aujourd'hui ?]

Résumez en un briefing de 2 minutes que je peux lire à voix haute ou poster dans Slack.
```

### Grooming du backlog (selon les besoins)

```
/user-story-writer

Groomer ces éléments bruts du backlog :

1. "[Idée brute ou demande de partie prenante]"
   Contexte : [tout détail supplémentaire disponible]

2. "[Idée brute]"
   Contexte : [...]

Pour chacun : rédiger une user story complète avec AC, cas limites, définition de terminé et estimation en points. Signalez si l'un d'eux nécessite plus de discovery avant d'être rédigé.
```

### Communication avec les parties prenantes

```
/product-manager-toolkit

Rédigez une mise à jour pour les parties prenantes de [audience — équipe dirigeante / PDG / ventes / succès client] :

Résultat du Sprint [N] : [livré / manqué / partiel]
Livrable clé : [ce qui a été livré et qui les intéresse]
Impact : [ce que cela permet — valeur client ou métrique métier]
Prochaine étape : [priorité du Sprint N+1]
Risques ou décisions dont ils ont besoin : [liste]

Gardez ça à un message Slack ou un court email. Pas de soupe de puces.
```

---

## Flux de travail clés par scénario

### Nouvelle demande de fonctionnalité d'un client ou d'une partie prenante

```
Étape 1 : Est-ce réel ?
/product-discovery

Demande client : "[coller la demande ou la feature ask]"
Source : [client enterprise / 15 tickets de support séparés / PDG / un power user]

Analyser :
- Est-ce un symptôme ou le vrai travail à accomplir ?
- Combien de clients ont ce problème ?
- Que font-ils aujourd'hui comme solution de contournement ?
- Résoudre ceci s'aligne-t-il avec notre thèse produit ?
- Que faudrait-il croire pour que ce soit dans les 5 premières priorités ?

Étape 2 : Si réel — écrire la story
/user-story-writer

Brief de la fonctionnalité : [coller ce que vous avez appris à l'étape 1]
Rédigez la user story prête pour la planification du sprint.

Étape 3 : Dimensionner et prioriser
/product-manager-toolkit

Ajoutez cette story à ma matrice de priorisation.
Candidats actuels : [lister les éléments du backlog existant]
Scores RICE : [Portée, Impact, Confiance, Effort]
Où cette nouvelle story se place-t-elle dans l'ordre de priorité ?
```

### PRD pour une fonctionnalité significative

```
/code-to-prd

Rédigez un PRD pour : [NOM DE LA FONCTIONNALITÉ]

Problème : [quel problème cela résout et pour qui]
Preuves : [recherche client, données de support, analytics montrant l'écart]
Périmètre : [ce qui est inclus et ce qui est explicitement hors de cette version]
Métrique de succès : [la seule métrique qui prouve que cette fonctionnalité a réussi]
Calendrier : [sprint ou date cible]
Dépendances : [autres équipes, APIs, travail de design nécessaire]

Générez le PRD complet : énoncé du problème, objectifs et non-objectifs, user stories, métriques de succès, questions ouvertes, hors périmètre.
```

### Planification trimestrielle de la roadmap

```
/product-roadmap

Construisez la roadmap produit pour [TRIMESTRE/ANNÉE].

Thèmes principaux (issus de la recherche client, des objectifs métier, de la dette technique) :
Thème 1 : [description] — importance stratégique : [pourquoi c'est important maintenant]
Thème 2 : [description]
Thème 3 : [description]

Contraintes :
- Capacité d'ingénierie : [N semaines-ingénieur]
- Capacité de design : [N semaines-designer]
- Échéances fixes : [engagements déjà pris]
- Non-négociables : [tout ce qui doit être livré indépendamment de la priorisation]

Produire : une roadmap MAINTENANT / ENSUITE / PLUS TARD avec justification par élément, dépendances et risques.
```

### Analyse post-lancement

```
/product-analytics

Analysez la performance de [FONCTIONNALITÉ] lancée le [DATE].

Métriques disponibles :
- Adoption : [X% des utilisateurs ont utilisé la fonctionnalité dans les 2 premières semaines]
- Impact sur la rétention : [rétention J14 pour les utilisateurs de la fonctionnalité vs. contrôle : X% vs. Y%]
- Funnel : [X utilisateurs l'ont vue, Y ont activé, Z ont complété le flux principal]
- Tickets de support : [N tickets liés à cette fonctionnalité depuis le lancement]
- Commentaires NPS la mentionnant : [coller les commentaires pertinents]

Dites-moi :
1. Cette fonctionnalité fonctionne-t-elle ? (signal fort / signal faible / trop tôt pour dire)
2. Que suggèrent les données que nous fassions ensuite ? (itérer, étendre, retirer, ou attendre)
3. Quelle est la seule métrique que je devrais suivre hebdomadairement pour savoir si elle s'améliore ?
```

---

## Plan de montée en compétence sur 30 jours (PM rejoignant une nouvelle équipe ou un nouveau produit)

### Semaine 1 — Contexte et découverte
- Installer toutes les compétences PM via les commandes ci-dessus
- Exécuter `/product-discovery` sur les 3 principales douleurs clients que vous avez entendues
- Parler à 5 clients — utiliser le guide d'entretien de `/product-discovery`
- Cartographier le produit existant avec `/competitive-teardown` (votre propre produit, pas un concurrent) — comprendre ce que vous avez

### Semaine 2 — Backlog et rythme de sprint
- Exécuter `/pm-sprint-review` sur les 3 derniers sprints — comprendre la vélocité et les blocages récurrents
- Parcourir les 20 premiers éléments du backlog avec `/user-story-writer` — évaluer la qualité et affiner les moins bonnes user stories
- Assister à tous les rituels de sprint — ne pas les animer encore, juste observer

### Semaine 3 — Feuille de route et parties prenantes
- Utiliser `/product-roadmap` pour cartographier ce qui existe et ce qui a été engagé
- Utiliser `/product-manager-toolkit` pour construire une carte des parties prenantes — qui a de l'influence sur les décisions de feuille de route ?
- Rédiger votre première mise à jour des parties prenantes avec `/product-manager-toolkit`

### Semaine 4 — Prendre en main
- Mener votre première revue de sprint complète avec `/pm-sprint-review`
- Rédiger vos premières user stories pour le prochain sprint avec `/user-story-writer`
- Partager votre thèse produit sur 30-60-90 jours avec le CPO — utiliser `/cpo-advisor` pour la mettre à l'épreuve

---

## Intégrations d'outils

### Linear (recommandé pour la gestion des sprints)

```json
// Add to ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

Avec Linear connecté, Claude peut lire le statut des sprints, les détails des tickets et l'historique des cycles — alimentant les revues de sprint sans copier-coller manuel.

### Notion (pour les PRDs et les feuilles de route)

Connecter le MCP Notion pour permettre à Claude de lire et mettre à jour votre base de données de PRDs, la vue de la feuille de route et les notes de découverte — maintenant la documentation synchronisée avec les décisions.

### Amplitude / Mixpanel

Exporter les données d'événements en CSV ou coller les résultats de requêtes dans `/product-analytics`. Pour une analyse en temps réel, l'API Amplitude peut être connectée via MCP pour des requêtes de métriques en direct pendant les sessions de planification.

### Figma

Pour la collaboration design-PM, Claude peut lire les liens Figma et référencer le contexte visuel lors de la rédaction des critères d'acceptation. Combiner avec `/user-story-writer` pour rédiger des critères d'acceptation qui font référence à des états de design spécifiques.

---

## Métriques à suivre

### Santé du sprint

| Métrique | Objectif | Signal d'alarme |
|---|---|---|
| Taux d'atteinte de l'objectif de sprint | > 70% | < 50% : problème de planification ou de périmètre |
| Prévisibilité de la vélocité | ± 20% de la moyenne | Variations importantes : problème d'estimation ou de travail non planifié |
| Travail non planifié | < 20% de la capacité du sprint | > 30% : équipe réactive, pas proactive |
| Précision des story points | ± 1 point en moyenne | Sur-estimations constantes : mise en place de tampons de sécurité |

### Santé du produit

| Métrique | Objectif (varie selon le produit) | Pourquoi c'est important |
|---|---|---|
| Adoption des fonctionnalités (J14) | > 30% des utilisateurs actifs | Est-ce que quelqu'un utilise ce que vous avez livré ? |
| Délai de valeur | En diminution | L'onboarding s'améliore-t-il ? |
| Taux de tickets de support par fonctionnalité | En diminution | La qualité s'améliore-t-elle ? |
| Impact NPS des nouvelles fonctionnalités | Neutre à positif | Construisez-vous des choses que les utilisateurs apprécient ? |
| Taux de succès des expériences | > 30% | Vos hypothèses sont-elles bien calibrées ? |

---

## Erreurs courantes que Claude Code aide à éviter

**Erreur 1 : Construire avant de valider**
`/product-discovery` vous oblige à cadrer le problème et à rassembler des preuves avant d'écrire un seul mot de spécification. Pas de découverte → pas de user story.

**Erreur 2 : Des user stories trop grandes pour être terminées en un sprint**
`/user-story-writer` inclut une vérification de taille et un guide de découpage. Tout ce qui est estimé à > 5 points est découpé avant d'aller en planification de sprint.

**Erreur 3 : Des critères d'acceptation impossibles à tester**
Le vérificateur de qualité des critères d'acceptation dans `/user-story-writer` signale les critères trop vagues pour qu'un ingénieur QA puisse les tester. Chaque critère d'acceptation doit être observable et spécifique.

**Erreur 4 : Des rétrospectives sans action**
`/pm-sprint-review` impose un maximum de 2 actions par sprint en rétrospective. Plus de 2 signifie qu'aucune ne sera réalisée.

**Erreur 5 : Une feuille de route sans justification**
`/product-roadmap` génère une justification pour chaque élément de la feuille de route. Si vous ne pouvez pas expliquer pourquoi quelque chose figure dans la feuille de route, cela ne devrait pas y être.

---

## Ressources

- [Démarrer avec Claude Code](getting-started.md)
- [Flux de travail de sprint PM](../workflows/pm-sprint.md)
- [Compétence de découverte produit](../skills/product/product-discovery.md)
- [Compétence de rédaction de user stories](../skills/product/user-story-writer.md)
- [Compétence de revue de sprint](../skills/product/pm-sprint-review.md)
- [Agent conseiller CPO](../agents/advisors/cpo-advisor.md)

---
