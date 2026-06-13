# Claude pour les Growth Marketers

Tout ce dont un Growth Hacker ou un Performance Marketer a besoin pour mener des expériences augmentées par l'IA, optimiser l'acquisition payante, analyser les entonnoirs et produire des rapports de croissance — sans attendre les équipes data ou les sprints d'ingénierie.

---

## À qui s'adresse ce guide

Vous êtes growth marketer, performance marketer ou growth hacker, responsable du déplacement des métriques : inscriptions, taux d'activation, CAC payant, taux de conversion, croissance du MRR. Vous menez des expériences en permanence, vous vivez dans des tableurs et des tableaux de bord, et vous manquez toujours de temps.

**Avant Claude Code :** 3 heures pour rédiger un brief d'expérience et calculer la taille d'échantillon. 2 heures pour construire un rapport de croissance hebdomadaire. 45 minutes par documentation de test A/B. Analyse manuelle des entonnoirs à partir d'exports de données brutes.

**Après :** Des briefs d'expérience en 5 minutes. Le récit de croissance hebdomadaire rédigé et structuré en 10 minutes. Calculs de taille d'échantillon instantanés. Analyse d'entonnoir structurée et interprétée à partir de vos chiffres bruts. Vous vous concentrez sur les décisions, Claude gère la synthèse.

---

## Installation en 30 secondes

```bash
# Install the full growth marketer stack
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/analytics-tracking
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy
npx claudient add skill product/experiment-designer
npx claudient add agent advisors/cmo-advisor
npx claudient add agent advisors/cro-advisor
```

---

## Votre stack de croissance Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/experiment-tracker` | Rédaction d'hypothèses, calculateur de taille d'échantillon, analyse des résultats, signification statistique | Chaque test A/B — avant, pendant et après |
| `/growth-dashboard` | Tableau de bord AARRR hebdomadaire avec analyse des tendances et commentaires | Revue des métriques du lundi matin |
| `/paid-ads` | Structure de campagne Google, Meta, LinkedIn, brief créatif, optimisation du ROAS | Tout travail sur les canaux payants |
| `/onboarding-cro` | Analyse de l'entonnoir d'activation, optimisation de la séquence d'onboarding | Quand le taux d'activation est le goulot d'étranglement |
| `/page-cro` | Optimisation du taux de conversion des pages d'atterrissage — texte, mise en page, test de CTA | Travail de conversion au niveau de la page |
| `/analytics-tracking` | Configuration de GA4, Mixpanel, Amplitude, PostHog et analyse des entonnoirs | Instrumentation analytique |
| `/referral-program` | Mécanique de parrainage, structure des incitations, modélisation du coefficient viral | Création ou amélioration du parrainage |
| `/pricing-strategy` | Stratégie de page de tarification, positionnement des plans, test de prix | Expériences de tarification |
| `/experiment-designer` | Conception d'expérience de bout en bout : hypothèse, méthodologie, métriques de succès | Expériences multivariées complexes |

### Agents

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `cmo-advisor` | Opus | Mix de canaux stratégiques, allocation budgétaire, décisions de stratégie de croissance |
| `cro-advisor` | Sonnet | Problèmes spécifiques de taux de conversion — quoi tester et pourquoi |

---

## Flux de travail quotidien

### Matin (30-45 minutes)

**1. Tableau de bord de croissance hebdomadaire — lundi uniquement**
```
/growth-dashboard

Weekly growth metrics — week of [DATE]:

Acquisition:
- New signups: [N] (vs [N] last week)
- Paid spend: $[X]
- CAC by channel: Google $[X] | Meta $[X] | Organic $[X]

Activation:
- Activation rate: [X%] (vs [X%] last week)
- Time to aha moment (median): [X days]

Retention:
- 7-day retention: [X%]
- 30-day retention: [X%]
- DAU/MAU: [X%]

Revenue:
- MRR: $[X] (+$[X] WoW)
- Churned MRR: $[X]
- LTV:CAC: [X:1]

Experiments running:
- [Test name]: Day [X], lift [+/-X%], significance [X%]

Write me the dashboard with commentary, traffic light status, and recommended actions.
```

**2. Vérification quotidienne des expériences — 5 minutes**
```
/experiment-tracker

My live tests:
1. [Test name]: control [X%] vs variant [X%], [N] visitors each, running [X days]
2. [Test name]: control [X] vs variant [X], [N] visitors each, running [X days]

For each test:
- Have we reached statistical significance yet?
- Are we on track to conclude by [target date]?
- Any guardrail metrics showing concern?
- Should I extend, stop, or keep running?
```

---

### Midi — travail sur les campagnes et les expériences

**3. Optimisation de l'acquisition payante**
```
/paid-ads

Channel: [Google / Meta / LinkedIn]
Current ROAS: [X] (target: [X])
Current CPA: $[X] (target: $[X])
Monthly spend: $[X]

This week's issues:
- [Describe what's underperforming and any changes made]

Diagnose the issue and give me 3 actions to improve ROAS this week.
```

**4. CRO — page d'atterrissage ou entonnoir**
```
/page-cro

Page: [URL or describe]
Current conversion rate: [X%]
Traffic source: [paid / organic / email]
Goal: [signup / purchase / demo request]
Top friction points I suspect: [describe]

Audit the page and give me the top 3 experiments to run ranked by expected impact.
```

---

### Liste de contrôle pour le lancement d'une expérience

**Avant de lancer tout test A/B :**
```
/experiment-tracker

I'm about to launch this test. Run the pre-launch checklist.

Test: [describe the change]
Primary metric: [conversion rate / click rate / revenue per visitor]
Baseline: [X%]
MDE: [X% relative improvement I need to detect]
Traffic: [X visitors per day to this page/flow]
Tool: [Optimizely / VWO / GrowthBook / LaunchDarkly]

Confirm:
1. Sample size required (per variant)
2. Expected test duration
3. Pre-launch checklist (tracking, mutual exclusivity, rollback plan)
4. Any risks I should know about
```

---

### Vendredi — revue hebdomadaire des expériences

**5. Revue du portefeuille d'expériences**
```
/experiment-tracker

Review my experiment portfolio this week.

Concluded tests:
[Test name]: control [X%] vs variant [X%], [N] per variant, p-value [X], ran [X days]
Decision I made: [shipped / killed]

Running tests:
[continue for each active test]

Backlog (unstarted):
1. [Idea 1] — estimated impact [high/med/low], effort [high/med/low]
2. [Idea 2]

Give me: ICE scores for the backlog, whether my concluded tests are documented correctly,
and what I should run next quarter.
```

---

## Plan de montée en compétence sur 30 jours (nouveaux growth marketers)

### Semaine 1 — Mesure de la base de référence
- Installer toutes les compétences via les commandes d'installation ci-dessus
- Connecter votre outil d'analyse (GA4, Mixpanel, Amplitude ou PostHog)
- Exécuter `/analytics-tracking` pour auditer votre suivi actuel — trouver ce qui est cassé ou manquant
- Exécuter `/growth-dashboard` avec des données historiques — établir vos chiffres de référence
- Cartographier votre entonnoir complet : de la source de trafic au client payant — chaque étape

### Semaine 2 — Backlog d'hypothèses
- Exécuter `/experiment-designer` et `/experiment-tracker` pour évaluer votre backlog d'hypothèses
- Utiliser le score ICE pour classer les 5 meilleures expériences à mener ce trimestre
- Pour chaque hypothèse : rédiger une hypothèse formelle, calculer la taille d'échantillon et définir les critères de succès avant de toucher au moindre code
- Ne pas lancer quoi que ce soit en semaine 2 — comprendre la base de référence d'abord

### Semaine 3 — Premières expériences
- Lancer vos 2 meilleures expériences du backlog
- Utiliser `/paid-ads` pour auditer la configuration actuelle de l'acquisition payante — trouver les dépenses gaspillées
- Mener un audit CRO avec `/page-cro` sur votre page de conversion à trafic le plus élevé
- Mesurer : combien de temps faut-il pour rédiger un brief d'expérience ? Suivez cela chaque semaine — cela devrait passer sous les 10 minutes à la semaine 4

### Semaine 4 — Vélocité et reporting
- Exécuter votre premier tableau de bord de croissance hebdomadaire complet de zéro
- Établir votre vélocité d'expérimentation : combien de tests votre équipe peut-elle mener par mois ?
- Présenter à la direction : quels sont les 3 principaux leviers de croissance et qu'est-ce que vous testez pour chacun ?
- Identifier vos lacunes analytiques — que ne pouvez-vous pas mesurer et dont vous avez besoin ?

---

## Intégrations d'outils

### Amplitude / Mixpanel / PostHog

Ce sont vos principales sources de données pour chaque session Claude. Connectez-les via MCP pour un accès aux données en direct :

```json
// For PostHog — add to ~/.claude/settings.json
{
  "mcpServers": {
    "posthog": {
      "command": "npx",
      "args": ["-y", "@posthog/mcp-server"],
      "env": {
        "POSTHOG_API_KEY": "your-api-key",
        "POSTHOG_HOST": "https://app.posthog.com"
      }
    }
  }
}
```

Avec l'accès aux analyses en direct, Claude peut :
- Extraire les données de conversion des entonnoirs par cohorte, segment ou fenêtre temporelle
- Interroger les comptes d'événements et les propriétés des utilisateurs sans exporter en CSV
- Construire des tableaux de rétention à la demande
- Identifier les segments ayant un comportement anormal

### Google Ads et Meta Ads

Exporter les données de performance en CSV → coller dans `/paid-ads` pour analyse.
Pour le reporting automatisé, connecter via n8n ou Make — extraire les données de campagne hebdomadaires dans une page Notion, puis exécuter `/growth-dashboard` dessus.

### GrowthBook / LaunchDarkly (plateformes d'expérimentation)

Exporter les résultats d'expérience → coller dans `/experiment-tracker` pour l'analyse statistique et l'aide à la décision.
Claude ne prend pas les décisions de déploiement ou d'arrêt — il expose la situation statistique et fournit le cadre. C'est vous qui décidez.

### Notion / Confluence (journal d'expériences)

Utiliser Claude pour générer la documentation des expériences → coller dans le journal d'expériences de votre équipe après chaque test conclu. Une documentation cohérente est la chose la plus importante que les équipes de croissance ne font pas.

---

## Métriques à suivre

| Métrique | Définition | Vert | Jaune | Rouge |
|---|---|---|---|---|
| Vélocité hebdomadaire des expériences | Tests lancés par semaine | ≥ 2 | 1 | 0 |
| Taux de succès | % d'expériences montrant un gain positif significatif | 25-35% | 15-25% | < 15% ou > 40% |
| Taux d'activation | % de nouvelles inscriptions ayant atteint le moment aha | > 40% | 20-40% | < 20% |
| Délai de récupération du CAC | Mois pour récupérer le CAC à partir de la marge brute d'une cohorte | < 12 mois | 12-18 mois | > 18 mois |
| Ratio LTV:CAC | LTV client divisée par le CAC | > 3:1 | 2-3:1 | < 2:1 |
| Rétention nette du chiffre d'affaires | (MRR + expansion - churn) / MRR de début de période | > 100% | 90-100% | < 90% |
| Rétention J30 | % des utilisateurs du Jour 0 encore actifs au Jour 30 | > 30% | 15-30% | < 15% |

---

## Erreurs courantes de croissance (et comment Claude Code aide à les éviter)

**Erreur 1 : Lancer des expériences sans hypothèse correcte**
`/experiment-tracker` vous oblige à rédiger l'hypothèse, le MDE et les critères de succès avant de toucher à l'outil de test. Pas d'hypothèse = pas de lancement.

**Erreur 2 : Arrêter les tests à la première signification**
La liste de contrôle pré-lancement fixe une durée de test et une date d'arrêt. Claude signalera si vous lisez les résultats avant que la taille d'échantillon requise soit atteinte.

**Erreur 3 : Optimiser un entonnoir cassé**
`/analytics-tracking` et `/page-cro` identifient les lacunes de suivi et les frictions UX avant que vous meniez des expériences CRO. Corriger un flux d'onboarding cassé n'est pas un test — c'est une correction de bug.

**Erreur 4 : Rapporter des métriques sans contexte**
`/growth-dashboard` génère un commentaire narratif avec chaque rapport — pas seulement des chiffres. « Les inscriptions ont chuté de 18% » nécessite une explication et une action, pas seulement un feu rouge.

**Erreur 5 : Dépenser en publicité payante avant que l'entonnoir convertisse**
`/onboarding-cro` et `/page-cro` identifient les plus grandes chutes de conversion. Corrigez-les avant de faire évoluer l'acquisition payante — sinon vous remplissez un seau percé.

---

## Ressources

- [Démarrer avec Claude Code](./getting-started.md)
- [Compétence experiment tracker](../skills/marketing/experiment-tracker.md)
- [Compétence growth dashboard](../skills/marketing/growth-dashboard.md)
- [Flux de travail des expériences de croissance](../workflows/growth-experiment.md)
- [Configuration du suivi analytique](../skills/marketing/analytics-tracking.md)
- [Optimisation des publicités payantes](../skills/marketing/paid-ads.md)

---
