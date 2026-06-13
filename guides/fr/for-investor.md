# Claude pour les Investisseurs et les Analystes VC

Tout ce dont un analyste VC, un associé ou un partenaire a besoin pour mener une présélection de deals, une due diligence, une modélisation financière, un suivi de portefeuille et une préparation au Comité d'Investissement augmentés par l'IA dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes analyste en capital-risque, associé, partenaire ou business angel indépendant. Votre travail consiste à voir chaque deal pertinent, à présélectionner rapidement, à analyser en profondeur les meilleurs, et à prendre de bonnes décisions d'investissement. Vous êtes submergé par les flux entrants, vous passez 40 % de votre temps à rédiger des mémos et des rapports, et vous n'avez jamais assez d'heures pour effectuer des recherches approfondies sur chaque entreprise qui le mérite. Claude Code change ce ratio.

**Avant Claude Code :** 6 heures pour rédiger un mémo de première passe. Une demi-journée pour préparer une réunion de conseil d'administration. 3 heures pour compiler un rapport LP trimestriel pour 15 entreprises.

**Après :** Mémo de première passe en 45 minutes. Préparation de la réunion de conseil en 20 minutes. Section du rapport LP sur le portefeuille en 30 minutes.

---

## Installation en 30 secondes

```bash
# Install all investor skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/dcf-model
npx claudient add skill finance/diligence-review
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/earnings-analysis

# Install relevant agents
npx claudient add agent advisors/cfo-advisor
npx claudient add agent roles/quant-analyst
npx claudient add agent roles/scientific-researcher
```

---

## Votre stack investisseur Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/deal-screening` | Présélection initiale : marché, fossé concurrentiel, management, finances, adéquation — verdict passer/poursuivre | Premier regard sur tout nouveau deal |
| `/deal-memo` | Mémo de deal complet : thèse, équipe, marché, finances, risques, liste de due diligence, recommandation | Après la réunion avec le fondateur |
| `/ic-memo` | Mémo pour le Comité d'Investissement (format PE/croissance en 9 sections) | Avant la présentation au CI |
| `/dcf-model` | Modèle financier DCF : hypothèses, projections, valeur terminale, sensibilité — en format Python ou Excel | Tout travail de valorisation |
| `/diligence-review` | Structurer et mener la due diligence : appels clients, revue technique, appels de références, liste de contrôle d'audit financier | Due diligence post-term-sheet |
| `/comps-analysis` | Analyse de sociétés comparables et de transactions : EV/Chiffre d'affaires, EV/EBITDA, multiples ajustés à la croissance | Benchmarking de valorisation |
| `/portfolio-monitor` | Synthèse des mises à jour du conseil, suivi des KPI, déclencheurs de suivi, signaux d'alarme, sections du rapport LP | Revue mensuelle/trimestrielle du portefeuille |
| `/earnings-analysis` | Analyse des appels de résultats des sociétés cotées — lecture transversale pour les comparables du marché privé | Recherche concurrentielle |

### Agents

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `cfo-advisor` | Opus | Revue des modèles financiers, remise en question des économies unitaires |
| `quant-analyst` | Opus | Dimensionnement quantitatif du marché, thèse basée sur les données |
| `scientific-researcher` | Opus | Recherche sectorielle approfondie, littérature académique pour les deep tech |

---

## Flux de travail quotidien

### Matin (30-45 minutes)

**1. Revue du flux de deals — présélection des nouvelles entrées de la nuit**
```
/deal-screening

Screen these inbound deals quickly. Give me a pass/proceed verdict on each.

[Deal 1 — company name, sector, stage, ARR/revenue, growth, valuation ask, brief description]
[Deal 2]
[Deal 3]

My fund thesis: [describe your mandate — stage, sector, check size]
Skip obvious mismatches. Flag the one worth a deeper look.
```

**2. Vérification du portefeuille — mises à jour du conseil reçues**
```
/portfolio-monitor

I received a monthly update from [company]. Synthesize it and flag anything requiring my attention this week.

[Paste board update or key metrics]
```

---

### Après la réunion avec le fondateur (45-90 minutes)

**3. Mémo de deal — première impression sur papier**
```
/deal-memo

Company: [name]
What I learned in the meeting: [your notes — paste or summarize]
My gut: [preliminary view]

Fill in the deal memo structure. Mark anything I didn't learn as [NEED TO VERIFY].
```

---

### Phase de due diligence (en cours)

**4. Préparation des appels de références clients**
```
/diligence-review

I'm calling [company]'s reference customer [name, title, company] tomorrow.

Investment thesis: [what we believe about the company]
Key risks to validate: [what could be wrong]

Generate 12 reference call questions that probe:
- How they use the product and how embedded it is
- What would make them cancel
- How the product compares to alternatives they've evaluated
- Any concerns with the company or team
```

**5. Analyse des comparables**
```
/comps-analysis

Run a comparable company analysis for [company] in [sector].

Our company metrics: ARR $[X]M, [X]% growth, [X]% gross margin, [X]x NRR
Round: $[X]M at $[X]M pre-money

Find public comps and recent private transaction comps. What multiple are we paying vs. the market?
```

---

### Préparation au CI

**6. Mémo CI — présentation complète au Comité d'Investissement**
```
/ic-memo

Convert my deal memo into a full IC memo for [company].

Deal memo (paste or summarize): [...]
Diligence findings: [what we verified, what we couldn't]
Updated recommendation: [invest / pass / conditional]

Generate all 9 sections with [VERIFY] flags on any unconfirmed data.
```

---

### Support au portefeuille (jours de réunion de conseil)

**7. Préparation de la réunion de conseil**
```
/portfolio-monitor

Board meeting with [company] is tomorrow. Prepare me.

Last board meeting: [summary]
Current board package: [paste]
My concerns going in: [list]
What I want to drive: [topics]

Give me: pre-read synthesis, hard questions, my agenda, potential asks from the team.
```

---

### Hebdomadaire (vendredi — 30 minutes)

**8. Résumé hebdomadaire du flux de deals**
```
/deal-screening

Summarize this week's deal flow:
- Deals screened: [N]
- Passed: [N] — [brief reason for each major pass]
- In pipeline: [N] — [status of each]
- Moving to IC: [N]

What should I prioritize next week?
```

---

## Plan de montée en compétence sur 30 jours (nouvel analyste VC)

### Semaine 1 — Maîtrise de la présélection des deals
- Installer toutes les compétences investisseur : `npx claudient add skill finance/[name]`
- Exécuter `/deal-screening` sur 20 deals récents de l'archive de votre fonds — comparer votre output aux décisions des partenaires
- Comprendre l'ICP de votre fonds : stade, secteur, taille de chèque, stratégie de suivi
- Lire la compétence `/comps-analysis` — comprendre comment fonctionnent les multiples dans vos secteurs

### Semaine 2 — Pratique des mémos de deals
- Assister à 3 réunions partenaires → rédiger des mémos de deals par vous-même → comparer à la version de l'analyste senior
- Exécuter `/dcf-model` sur une entreprise du portefeuille — comprendre les hypothèses et les sensibilités
- Commencer à construire votre base de données de comparables sectoriels — `/comps-analysis` aide à la structurer

### Semaine 3 — Due diligence et portefeuille
- Exécuter `/diligence-review` sur un deal actif — prendre en charge le processus d'appels de références clients
- Utiliser `/portfolio-monitor` pour synthétiser les mises à jour du T1 pour 5 entreprises du portefeuille
- Préparer une réunion de conseil avec le mode de préparation de `/portfolio-monitor`

### Semaine 4 — Présentation au CI
- Rédiger un mémo CI complet avec `/ic-memo` sur un deal que vous avez travaillé
- Présenter aux partenaires — utiliser l'output de Claude comme structure, pas comme script
- Mesurer : combien de vos questions pré-réunion ont été soulevées au CI ? (repère : > 60% indique une bonne qualité de questions)

---

## Intégrations d'outils

### Notion (suivi des deals)
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-token-here"
      }
    }
  }
}
```

Avec Notion connecté : Claude peut lire votre base de données de pipeline de deals, extraire les notes sur les entreprises et rédiger des brouillons de mémos de deals directement dans vos pages de deals.

### Airtable / pipeline de deals
Exporter le pipeline de deals en CSV → coller dans `/deal-screening` → obtenir des verdicts passer/poursuivre classés. Pour une intégration en direct, utiliser l'Airtable MCP.

### Modèles financiers
Claude génère des tables Python ou Excel structurées pour les travaux DCF et de comparables. Pour les modèles complexes, générer la structure et les hypothèses dans Claude → construire dans Excel/Google Sheets → coller les résultats pour le récit.

### Gong / enregistrement des appels
Coller la transcription de l'appel avec le fondateur dans `/deal-memo` → Claude extrait les affirmations clés, signale les déclarations non vérifiées et structure au format mémo de deal.

---

## Métriques à suivre

| Activité | Temps manuel | Avec Claude |
|---|---|---|
| Présélection initiale par deal | 45 min | 8 min |
| Brouillon de mémo de deal | 6 heures | 45 min |
| Mémo CI | 8 heures | 2 heures |
| Préparation de réunion de conseil | 2 heures | 20 min |
| Rapport LP trimestriel (section portefeuille) | 4 heures | 45 min |
| Préparation d'appel de référence | 30 min | 10 min |
| Analyse des comparables | 3 heures | 30 min |

Objectif : 3x plus de deals examinés avec le même nombre d'analystes. Le niveau de qualité augmente car Claude structure votre réflexion, pas seulement du temps gagné.

---

## Erreurs courantes (et comment Claude Code les évite)

**Erreur 1 : S'ancrer sur le récit du fondateur**
`/deal-memo` vous invite à marquer chaque affirmation fournie par le fondateur comme `[UNVERIFIED]`. Force l'honnêteté intellectuelle avant de tomber amoureux d'une histoire.

**Erreur 2 : Manquer les signaux d'alarme dans les mises à jour du conseil**
`/portfolio-monitor` exécute une liste de contrôle structurée des signaux d'alarme sur chaque mise à jour du conseil. Vous ne manquerez pas « la consommation de trésorerie a augmenté de 40% pendant que le chiffre d'affaires était stable » enfoui dans la diapositive 12.

**Erreur 3 : Rédiger des mémos qui plaident plutôt qu'ils n'analysent**
La section des risques de Claude est structurée pour forcer une analyse équilibrée. Les membres du CI qui reçoivent des mémos à forte charge plaidoyer les dévaluent.

**Erreur 4 : Sauter les appels de références**
`/diligence-review` génère des questions d'appels de références qui vont au-delà des questions faciles que les fondateurs préparent les clients à répondre.

**Erreur 5 : Payer la mauvaise valorisation**
`/comps-analysis` ancre chaque deal sur les comparables du marché avant que vous vous embaliez pour l'entreprise.

---

## Ressources

- [Démarrer avec Claude Code](getting-started.md)
- [Compétence de présélection des deals](../skills/finance/deal-screening.md)
- [Compétence de mémo de deal](../skills/finance/deal-memo.md)
- [Compétence de mémo CI](../skills/finance/ic-memo.md)
- [Compétence de suivi de portefeuille](../skills/finance/portfolio-monitor.md)
- [Flux de travail de présélection des deals](../workflows/deal-screening.md)

---
