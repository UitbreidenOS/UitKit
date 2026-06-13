# Claude pour les Analystes Financiers et les DAF

Tout ce dont un Analyste Financier, un Responsable FP&A ou un DAF (Directeur Administratif et Financier) a besoin pour piloter la modélisation financière augmentée par l'IA, le reporting, la préparation des dossiers du conseil et la communication avec les investisseurs dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes un professionnel de la finance — analyste FP&A, responsable financier, VP Finance ou DAF — dont le travail consiste à transformer des chiffres en décisions. Vous construisez des modèles, clôturez les comptes, expliquez les écarts, préparez les supports pour le conseil et gérez les investisseurs. Vous êtes noyé dans les tableurs et passez trop de temps à la mise en forme plutôt qu'à l'analyse.

**Avant Claude Code :** 3 heures pour construire une première version d'une actualisation des flux de trésorerie (DCF). Une demi-journée pour rédiger le commentaire de gestion du dossier du conseil. Une journée entière pour produire un support budget vs. réalisé avec les explications d'écart. Des nuits blanches avant les réunions du conseil.

**Après :** Framework DCF en 20 minutes. Récit du dossier du conseil en 45 minutes. Commentaire d'écart BvA en 15 minutes. Analyse de scénarios sur tout modèle en moins de 10 minutes.

---

## Installation en 30 secondes

```bash
# Installer la stack financière complète
npx claudient add skills finance
npx claudient add skills gtm/commercial-forecaster
npx claudient add skills gtm/revenue-operations
npx claudient add agents advisors/cfo-advisor
npx claudient add agents roles/quant-analyst

# Ou choisir à la carte :
npx claudient add skill finance/dcf-model
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/financial-plan
npx claudient add skill finance/ic-memo
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/budget-vs-actual
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/revenue-operations
```

---

## Votre stack Claude Code pour la finance

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/board-pack-builder` | Dossier complet du conseil : états financiers, KPIs, initiatives stratégiques, risques, demandes | Réunions mensuelles/trimestrielles du conseil |
| `/budget-vs-actual` | Analyse BvA : tableaux d'écarts, commentaire, tendance, reprévision | Clôture mensuelle |
| `/dcf-model` | Valorisation DCF : WACC, projections FCF, valeur terminale, sensibilité | Travaux de valorisation, transactions |
| `/3-statement-model` | Modèle intégré compte de résultat, bilan, flux de trésorerie | Planification financière, levée de fonds |
| `/financial-plan` | Plan opérationnel annuel : effectifs, revenus, construction des charges, scénarios | Cycle de planification annuel |
| `/ic-memo` | Mémo pour Comité d'Investissement : 9 sections complètes, analyse des rendements | Documentation de deal PE / VC |
| `/pitch-deck` | Structure du pitch investisseurs pour une nouvelle levée : récit, métriques | Préparation d'une levée Série A / B |
| `/gl-reconciler` | Rapprochement du grand livre : analyse des comptes, traçage des écarts, vérification des écritures | Clôture de fin de mois |
| `/commercial-forecaster` | Prévision de revenus : fondée sur le pipeline, analyse de cohortes, scénarios | Planification conjointe ventes + finance |
| `/revenue-operations` | Analyse RevOps : cascade ARR, décomposition NRR, attribution du churn | Entreprises SaaS / abonnement |

### Agents

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `cfo-advisor` | Opus | Questions stratégiques de finance, récit investisseur, positionnement pour la levée de fonds |
| `quant-analyst` | Sonnet | Analyse statistique, modélisation financière, recherche quantitative |

---

## Flux de travail quotidien

### Matin — Extraction des données financières (15-30 minutes)

**1. Pouls financier quotidien**
```
/budget-vs-actual

Instantané du matin :
- Position de trésorerie vs. hier
- Paiements ou encaissements au-dessus de $[seuil] traités pendant la nuit
- Revenus cumulés du mois vs. budget (si disponible depuis le système)
- Tout écart nécessitant une explication avant le stand-up de 9h

Donnez-moi un briefing matinal en 5 points.
```

**2. Mises à jour du modèle**
```
/commercial-forecaster

Mettre à jour ma prévision de revenus avec les réalisations d'hier :
- Nouvelles réservations : $[X]
- MRR churné : $[X]
- Expansion : $[X]

Suivi du mois en cours vs. budget ? Une tendance qui nécessite une reprévision ?
```

---

### Travail sur les modèles (variable — 1-4 heures)

**3. Construire ou mettre à jour un modèle financier**
```
/3-statement-model

Construire un modèle à 3 états pour [entreprise].

Données historiques (3 dernières années ou coller ce que vous avez) :
[Données P&L, bilan, flux de trésorerie]

Hypothèses clés pour la projection :
- Taux de croissance des revenus : [X]% par an
- Marge brute : [X]%
- OpEx en % des revenus : [X]%
- CapEx : [X]% des revenus
- Variations du besoin en fonds de roulement : [bref]

Projeter 3 ans en avant. Construire des scénarios de base / optimiste / pessimiste.
```

**4. Analyse d'écart**
```
/budget-vs-actual

Lancer le BvA mensuel pour [MOIS].

[Coller les données réalisé vs. budget pour chaque ligne du P&L]

Contexte :
- Pourquoi le chiffre d'affaires a manqué : [bref]
- Pourquoi les S&M sont en sous-dépense : [recrutement plus lent que prévu]
- Éléments exceptionnels : [décrire]

Produire : tableau d'écarts, commentaire de gestion, implication pour la reprévision.
```

---

### Reporting et communication avec les parties prenantes (variable)

**5. Préparation du dossier du conseil**
```
/board-pack-builder

Construire le dossier du conseil de ce mois pour [entreprise].

[Fournir les 7 sections d'entrée : données financières, KPIs, mises à jour stratégiques, risques, demandes]

Composition du conseil : [investisseurs + indépendants]
Dernière réunion du conseil : [date, points clés discutés]
Récit principal ce mois : [quelle est l'histoire — en ligne / en avance / en retard et pourquoi]
```

**6. Mise à jour investisseurs**
```
/cfo-advisor

Rédiger l'e-mail de mise à jour mensuelle des investisseurs pour [entreprise].

Public : [investisseurs VC / business angels / investisseurs stratégiques]
Métriques clés à couvrir : [ARR, croissance, consommation de trésorerie, piste, jalons clés]
Ce qui a bien marché : [liste]
Ce qui n'a pas marché : [liste + brève explication]
Ce dont nous avons besoin des investisseurs : [introductions / conseils / approbations]

Ton : Transparent, confiant, concis. Pas de spin — les investisseurs valorisent la franchise.
```

---

### Cycle hebdomadaire et mensuel

**7. Liste de contrôle de clôture de fin de mois**
Voir le workflow complet à [workflows/finance-month-end.md](../workflows/finance-month-end.md).

**8. Reprévision**
```
/budget-vs-actual

[Après la clôture mensuelle] Lancer la reprévision pour l'année complète.

Réalisés cumulés (coller) :
[données]

Changements d'hypothèses clés par rapport au budget initial :
- Revenus : [ce qui a changé et pourquoi]
- Effectifs : [réel vs. prévu]
- Éléments exceptionnels : [liste]

Produire : prévision révisée pour l'année complète, 3 scénarios (base/optimiste/pessimiste),
piste de trésorerie révisée pour chaque scénario.
```

---

## Plan de montée en compétence sur 30 jours (nouveaux analystes financiers)

### Semaine 1 — Connaître l'entreprise
- Installer toutes les compétences finance : `npx claudient add skills finance`
- Lancer `/gl-reconciler` sur la clôture du mois dernier — comprendre le plan comptable
- Lancer `/budget-vs-actual` sur les 3 derniers mois de réalisés — repérer les schémas
- Lire les 3 derniers dossiers du conseil — comprendre le récit que le DAF a présenté
- Cartographier le modèle financier : d'où viennent les revenus ? Qu'est-ce qui pilote la marge brute ? Qu'est-ce qui est discrétionnaire dans les OpEx ?

### Semaine 2 — S'approprier le processus de clôture
- Observer ou piloter la clôture de fin de mois avec `/gl-reconciler`
- Construire votre modèle de commentaire d'écart avec `/budget-vs-actual`
- Comprendre le budget : quelles étaient les hypothèses ? Où en sommes-nous par rapport au plan ?
- Mettre en place votre tableau de bord financier dans votre outil BI préféré (Looker, Metabase, ou même Google Sheets)

### Semaine 3 — Construire le modèle
- Construire ou réviser le modèle complet à 3 états avec `/3-statement-model`
- Lancer un DCF sur l'entreprise (même si vous n'en avez pas besoin encore — comprendre les moteurs de valorisation est important)
- Construire une analyse de sensibilité : quelle variable unique impacte le plus la piste de trésorerie ?
- Produire votre premier brouillon de dossier du conseil avec `/board-pack-builder`

### Semaine 4 — Piloter les décisions
- Présenter votre premier BvA mensuel au PDG ou au DAF
- Utiliser `/commercial-forecaster` pour construire une prévision de revenus liée au pipeline
- Identifier le risque financier qui n'est pas discuté — le soulever
- Mettre en place votre calendrier de clôture de fin de mois : ce qui clôture quand, qui est responsable

---

## Intégrations d'outils

### QuickBooks / Xero / NetSuite

```
Exporter la balance de vérification ou le P&L depuis votre système comptable en CSV ou Excel.
Coller dans Claude :

"/gl-reconciler — voici la balance de vérification pour [mois]. Identifier les comptes
avec des soldes inhabituels, de forts mouvements MoM, ou des éléments qui nécessitent un rapprochement."

"/budget-vs-actual — voici l'export du P&L de gestion. Produire un BvA contre
ce budget [coller le budget]. Rédiger le commentaire de gestion."
```

### Excel / Google Sheets

```python
# Pour les analystes utilisant Python — connecter Claude à vos données tableur
import anthropic
import pandas as pd

client = anthropic.Anthropic()

# Charger vos données financières
df = pd.read_excel('monthly_financials.xlsx')

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    system="You are a financial analyst. Analyse the provided financial data and identify variances, trends, and anomalies. All figures are in USD thousands. Mark any calculations that need verification with [VERIFY].",
    messages=[{
        "role": "user",
        "content": f"""Run a budget vs actuals analysis on this data:

{df.to_markdown()}

Produce: variance table, management commentary, reforecast recommendation."""
    }]
)
```

### Salesforce / HubSpot (prévision de revenus)

```json
// Connecter le CRM à Claude pour des prévisions fondées sur le pipeline
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@anthropic/salesforce-mcp"],
      "env": {
        "SF_USERNAME": "your-username",
        "SF_PASSWORD": "your-password",
        "SF_TOKEN": "your-security-token"
      }
    }
  }
}
```

Avec le CRM connecté :
- Extraire le pipeline par étape et demander à Claude une prévision de revenus ascendante
- Comparer la couverture du pipeline au quota : "avons-nous suffisamment de pipeline pour atteindre l'objectif ?"
- Identifier les deals à risque en fonction de la date de dernière activité

### Notion / Confluence (distribution du dossier du conseil)

```
Après avoir construit votre dossier du conseil avec /board-pack-builder :
1. Exporter en markdown
2. Coller dans Notion ou Confluence
3. Partager un lien en lecture seule avec les membres du conseil avant la réunion
4. Pendant la réunion, utiliser Claude pour répondre aux questions "et si" sur le modèle
```

---

## Repères à suivre

| Indicateur | Startup en phase initiale | Phase de croissance | Public / mature |
|---|---|---|---|
| Jours pour clôturer (fin de mois) | 10-15 | 5-7 | 3-5 |
| Dossier du conseil distribué avant la réunion | 48 heures | 72 heures | 5 jours |
| Précision des prévisions (revenus) | ±20% | ±10% | ±5% |
| Écart budgétaire expliqué (% des lignes du P&L) | 60% | 85% | 95% |
| Visibilité sur la piste de trésorerie | 3 mois | 6 mois | 12+ mois |
| Temps pour produire l'analyse BvA | 4 heures | 2 heures | 1 heure |
| Temps pour mettre à jour le modèle financier | 2 heures | 45 minutes | 30 minutes |

---

## Erreurs courantes (et comment Claude Code les prévient)

**Erreur 1 : Récits sans chiffres**
Les dossiers du conseil qui racontent une histoire sans citer des chiffres spécifiques perdent en crédibilité. `/board-pack-builder` construit d'abord les tableaux financiers, puis génère un récit lié à des chiffres spécifiques.

**Erreur 2 : Écarts non expliqués**
"Le chiffre d'affaires était en dessous du budget" n'est pas un commentaire. `/budget-vs-actual` structure l'analyse des causes profondes pour que vous expliquiez toujours *pourquoi*, pas seulement *quoi*.

**Erreur 3 : Prévisions à un seul scénario**
Chaque prévision devrait avoir trois scénarios. `/3-statement-model` et `/budget-vs-actual` intègrent l'analyse de scénarios par défaut.

**Erreur 4 : Trop promettre au conseil**
`/board-pack-builder` génère la section "demandes" — être clair et précis sur ce dont vous avez besoin du conseil, plutôt que d'enterrer les demandes dans les diapositives.

**Erreur 5 : Hypothèses non divulguées**
Toutes les sorties financières de Claude sont marquées `[VERIFY]`. Cette discipline vous oblige à revenir et confirmer chaque chiffre avant de publier — critique pour les supports du conseil.

---

## Ressources

- [Démarrer avec Claude Code](../getting-started.md)
- [Workflow de clôture mensuelle finance](../workflows/finance-month-end.md)
- [Compétence modèle DCF](../skills/finance/dcf-model.md)
- [Compétence constructeur de dossier du conseil](../skills/finance/board-pack-builder.md)
- [Compétence budget vs. réalisé](../skills/finance/budget-vs-actual.md)
- [Compétence modèle à 3 états](../skills/finance/3-statement-model.md)

---
