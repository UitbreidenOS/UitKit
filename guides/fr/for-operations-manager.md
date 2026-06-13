# Claude pour les Responsables des Opérations et les COO

Tout ce dont un Responsable des Opérations ou un COO a besoin pour mener des opérations augmentées par l'IA — documentation des processus, gestion des fournisseurs, suivi des OKR, coordination des équipes et reporting hebdomadaire — dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes Responsable des Opérations, VP des Opérations ou COO dont le travail est de faire fonctionner l'entreprise. Vous possédez les processus, les outils, la coordination transfonctionnelle et les métriques opérationnelles. Vous passez trop de temps dans des réunions qui ne produisent aucune décision, sur des documents qui deviennent obsolètes au moment où vous les publiez, et sur des revues de fournisseurs qui n'aboutissent jamais à une recommandation claire.

**Avant Claude Code :** 4 heures pour rédiger une procédure opérationnelle standard (SOP) de zéro. Une demi-journée pour construire une comparaison de fournisseurs. Un après-midi entier pour transformer des notes de réunion en actions. Le reporting hebdomadaire prend toute la matinée du lundi.

**Après :** SOPs rédigées en 30 minutes. Matrices de fournisseurs construites à partir de notes en 20 minutes. Notes de réunion transformées en tickets Jira en 5 minutes. Bilan hebdomadaire prêt avant que le café refroidisse.

---

## Installation en 30 secondes

```bash
# Install the full operations stack
npx claudient add skills small-business/sop-writer
npx claudient add skills small-business/weekly-pulse
npx claudient add skills small-business/meeting-to-action
npx claudient add skills gtm/revenue-operations
npx claudient add skills productivity/scrum-master
npx claudient add skills productivity/process-mapper
npx claudient add skills productivity/vendor-evaluator
npx claudient add agents advisors/coo-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Votre stack opérationnel Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/sop-writer` | Rédiger, formater et versionner les SOPs avec tableaux RACI et de décision | Chaque fois qu'un processus doit être documenté |
| `/process-mapper` | Cartographier les processus existants : organigramme, RACI, analyse des goulots d'étranglement, recommandations d'amélioration | Audits de processus, préparation à l'automatisation, transferts entre équipes |
| `/vendor-evaluator` | Modèles d'appels d'offres, grille de notation, matrice de comparaison, mémo de recommandation | Toute décision fournisseur > 10 000 €/an |
| `/weekly-pulse` | Bilan hebdomadaire des OKR, tableau de bord des métriques, résumé des blocages | Chaque lundi matin |
| `/meeting-to-action` | Transformer les notes de réunion ou les transcriptions en actions structurées avec propriétaires | Après chaque réunion significative |
| `/revenue-operations` | Reporting RevOps, santé du pipeline, précision des prévisions | Travaux GTM/RevOps |
| `/scrum-master` | Cérémonies de sprint, rétrospectives, coaching de vélocité | Rythme opérationnel de l'équipe |

### Agents

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `coo-advisor` | Sonnet | Décisions opérationnelles stratégiques, questions de conception organisationnelle |
| `chief-of-staff` | Sonnet | Coordination transfonctionnelle, communication avec les parties prenantes, priorisation |

---

## Flux de travail quotidien

### Bilan OKR du matin (15 minutes)

**Commencez chaque journée en sachant où vous en êtes sur vos métriques clés.**

```
/weekly-pulse

Today's date: [date]
Week: [W of Q]

OKR status:
Objective 1: [name] → Key Result: [metric, current value vs. target]
Objective 2: [name] → Key Result: [metric, current value vs. target]

Yesterday's notable events: [key decisions made, blockers surfaced, milestones hit or missed]

What I need from this check-in:
- Red flags requiring my attention today
- Any OKR that is drifting (amber) and needs intervention this week
- One operational lever I can pull today to move the needle
```

---

### Documentation des processus (30-60 minutes par processus)

```
/process-mapper

Process: [name — e.g., Customer Onboarding, Vendor Procurement]
Trigger: [what starts this process]
End state: [what done looks like]
Participants: [roles involved]
Tools: [systems used]
Current pain: [what you already know is broken]

Produce: step-by-step map, RACI matrix, bottleneck analysis, top 3 improvement recommendations.
```

Puis utiliser `/sop-writer` pour transformer la carte en une SOP formatée avec historique des versions :

```
/sop-writer

Process name: [name]
Version: 1.0
Owner: [role]
Last updated: [date]
Review frequency: [quarterly]

Based on this process map: [paste the process-mapper output]

Write a full SOP in our standard format including:
- Purpose and scope
- Roles and responsibilities (RACI)
- Step-by-step instructions
- Decision rules (when to escalate)
- Metrics and success criteria
- Change log
```

---

### Gestion des fournisseurs

**Avant toute décision fournisseur significative :**

```
/vendor-evaluator

I need to evaluate vendors for: [category]
Budget: [$X]
Timeline: [when we need to decide]
Vendors I'm considering: [names]
Must-haves: [list]
Nice-to-haves: [list]

Produce: scoring rubric, RFP questions, comparison matrix template.
```

**Après collecte des propositions :**

```
/vendor-evaluator

Build a comparison matrix from these proposals.

Vendor A notes: [paste your notes]
Vendor B notes: [paste your notes]
Vendor C notes: [paste your notes]

Scoring criteria we agreed on: [from the rubric]

Produce: weighted comparison table, 3-year TCO estimate, risk register, recommendation memo for the leadership team.
```

---

### Gestion des réunions

**Après chaque réunion significative :**

```
/meeting-to-action

[Paste meeting notes or transcript]

Meeting type: [decision / brainstorm / status / escalation]
Attendees: [list with roles]
Date: [date]
Context: [what this meeting was trying to accomplish]

Extract:
- Decisions made (list each with who owns it)
- Action items (owner, due date, deliverable — one line each)
- Open questions needing follow-up
- Commitments made that others are depending on
- Parking lot items (raised but not resolved)

Format output as a Slack-ready summary and a separate Jira/Linear task list.
```

---

### Coordination transfonctionnelle

Utiliser l'agent `chief-of-staff` pour les coordinations complexes :

```
@chief-of-staff

I need to coordinate [initiative] across [teams].

Stakeholders:
- [Team/Person 1]: [what they own, what they need from others]
- [Team/Person 2]: [what they own, what they need from others]

Current blockers: [list]
Timeline: [key milestones]

Help me: [draft the coordination plan / write the stakeholder update / identify the critical path]
```

---

## Rythme hebdomadaire

### Lundi — Bilan OKR et planification de la semaine

```
/weekly-pulse

Week: [W of Q]
OKR status for each key result: [current value / target / trend]
Top 3 priorities this week: [list]
Dependencies on other teams this week: [list]
Meetings this week that need prep: [list]

Output: one-page weekly brief I can share with my CEO at the Monday check-in.
```

### Mercredi — Point de mi-semaine

```
Quick mid-week check:
- Which priorities are on track?
- What's at risk of slipping this week?
- What decisions are pending that are blocking progress?
- Do I need to escalate anything?

Give me a 5-bullet Slack message to send to my direct reports.
```

### Vendredi — Rapport opérationnel hebdomadaire

```
/weekly-pulse

Weekly ops report for: [week ending date]

Metrics update:
[Paste data from your dashboards — or describe metrics and their values]

This week's wins: [list]
This week's misses: [list + root cause for each]
Next week's priorities: [top 3]
Decisions needed from leadership before Monday: [list]

Format: executive summary (3 bullet points) + detailed section for operations team.
```

---

## Plan de montée en compétence sur 30 jours

### Semaine 1 — Audit et base de référence

- Installer toutes les compétences opérationnelles et configurer vos outils principaux (Jira/Linear MCP si utilisé)
- Exécuter `/process-mapper` sur vos 3 processus les plus douloureux
- Documenter quels processus n'ont pas de SOP (ce sont vos zones de risque)
- Configurer votre modèle de suivi des OKR dans `/weekly-pulse`
- Identifier vos 2 principales décisions fournisseurs dans les 90 prochains jours

### Semaine 2 — Sprint de documentation

- Utiliser `/sop-writer` pour rédiger des SOPs pour les 3 processus cartographiés la semaine dernière
- Exécuter `/meeting-to-action` sur vos 5 notes de réunion les plus récentes (rétroactivement)
- Commencer à utiliser `/meeting-to-action` sur chaque réunion à partir de maintenant
- Mettre en place le bilan hebdomadaire comme rituel du lundi matin

### Semaine 3 — Travail sur les fournisseurs et la coordination transfonctionnelle

- Lancer votre première évaluation de fournisseur avec `/vendor-evaluator`
- Utiliser l'agent `chief-of-staff` pour rédiger votre premier plan de coordination transfonctionnelle
- Mener une rétrospective sur une équipe en utilisant `/scrum-master`
- Identifier votre OKR le plus à risque et concevoir une intervention

### Semaine 4 — Reporting et optimisation

- Produire votre premier rapport opérationnel hebdomadaire complet avec `/weekly-pulse`
- Revoir vos cartes de processus — quels goulots d'étranglement pouvez-vous éliminer ?
- Livrer le mémo de recommandation fournisseur de la semaine 3
- Suivre le temps économisé ce mois-ci par rapport à avant Claude Code (objectif : 8-12 heures/semaine)

---

## Intégrations d'outils

### Jira / Linear (suivi de projet)

```json
// Add to ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Avec cette connexion, `/meeting-to-action` peut créer des tâches directement dans votre tableau de projet.

### Notion (documentation)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-integration-token"
      }
    }
  }
}
```

À utiliser pour : SOPs, cartes de processus, matrices de comparaison des fournisseurs, rapports hebdomadaires.

### Slack (communication asynchrone)

Formater tous les outputs de `/weekly-pulse` et `/meeting-to-action` pour Slack en ajoutant :
"Format this as a Slack message — no markdown headers, use bullets and bold for emphasis."

### Google Sheets / Airtable (suivi des métriques)

Exporter les données OKR en CSV → coller dans `/weekly-pulse` pour l'analyse et le reporting des tendances.

---

## Métriques à suivre

Utiliser Claude Code pour analyser ces métriques mensuellement :

| Métrique | Objectif | Signal d'alarme |
|---|---|---|
| Taux de réalisation des OKR (trimestriel) | > 70% | < 50% |
| Couverture de la documentation des processus | > 80% des processus critiques | < 60% |
| Taux de complétion des actions issues des réunions | > 85% dans le délai imparti | < 70% |
| Délai de décision fournisseur | < 30 jours pour les décisions majeures | > 60 jours |
| Temps de rapport hebdomadaire (minutes) | < 30 minutes | > 90 minutes |
| Délai de résolution des blocages transfonctionnels | < 3 jours ouvrés | > 7 jours |

---

## Erreurs courantes et comment Claude Code aide à les éviter

**Erreur 1 : Des SOPs ignorées**
Claude Code produit des SOPs avec des propriétaires clairs, des règles de décision et des dates de révision. Sans celles-ci, les SOPs deviennent des documents d'étagère.

**Erreur 2 : Des décisions fournisseurs basées sur des démos, pas sur des données**
`/vendor-evaluator` impose une grille de notation avant la démo, pour ne pas comparer des pommes et des oranges à un argumentaire commercial.

**Erreur 3 : Des réunions qui produisent des conversations, pas des décisions**
`/meeting-to-action` est non négociable après toute réunion de décision. Exécutez-le dans les 30 minutes ou le contexte se dégrade.

**Erreur 4 : Des OKR suivis trimestriellement plutôt qu'hebdomadairement**
`/weekly-pulse` s'exécute le lundi matin. Les OKR qui dérivent chaque semaine meurent en fin de trimestre.

**Erreur 5 : Les processus non documentés = dépendances à des personnes clés**
Quand la personne qui « sait juste comment ça fonctionne » part, il n'y a plus de processus. `/process-mapper` est la façon d'éliminer les points de défaillance uniques.

---

## Ressources

- [Guide de documentation des processus](./sop-writing-guide.md)
- [Playbook d'évaluation des fournisseurs](../skills/productivity/vendor-evaluator.md)
- [Flux de travail OKR hebdomadaire](../workflows/ops-weekly.md)
- [Agent conseiller COO](../agents/advisors/coo-advisor.md)
- [Démarrer avec Claude Code](./getting-started.md)

---
