# Claude pour les Fondateurs et PDG

Tout ce dont un fondateur de startup a besoin pour piloter les opérations de l'entreprise augmentées par l'IA — mises à jour investisseurs, préparation du conseil, revues OKR, décisions de recrutement, modélisation financière, veille concurrentielle et le rythme hebdomadaire qui maintient une entreprise en mouvement.

---

## À qui s'adresse ce guide

Vous êtes fondateur ou PDG d'une startup financée par du capital-risque, du pré-seed à la Série B. Vous faites 15 jobs à la fois : stratégie, levée de fonds, management d'équipe, décisions produit, appels clients et relations investisseurs. Claude Code réduit de 5 à 20 fois le coût en temps de chacun.

**Avant Claude Code :** 3 heures pour rédiger un support de conseil. 45 minutes par mise à jour investisseurs. Une demi-journée pour construire un modèle financier. Une recherche approfondie sur un concurrent prenant une semaine de changements de contexte.

**Après :** Support de conseil structuré en 30 minutes, rempli en 2 heures. Mise à jour investisseurs en 10-15 minutes. Modèle financier construit itérativement dans une session. Analyse d'un concurrent en une heure.

---

## Installation en 30 secondes

```bash
# Installer le pack fondateur complet
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/board-deck-builder
npx claudient add skill gtm/revenue-operations
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill finance/dcf-model
npx claudient add agents advisors/ceo-advisor
npx claudient add agents advisors/cfo-advisor
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Votre stack Claude Code pour fondateurs

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/founder-weekly-review` | Santé de l'entreprise, bilan OKR, pouls de l'équipe, priorités PDG pour la semaine suivante | Chaque dimanche ou lundi matin |
| `/investor-update` | E-mail mensuel aux investisseurs : MRR, consommation de trésorerie, points forts, points faibles, demande | Première semaine de chaque mois |
| `/board-deck-builder` | Support trimestriel du conseil : métriques, récit, mauvaises nouvelles, levée de fonds | 2 semaines avant la réunion du conseil |
| `/revenue-operations` | Santé du pipeline, métriques de vente, précision des prévisions, leviers GTM | Hebdomadaire avec votre CRO/Responsable commercial |
| `/commercial-forecaster` | Prévision de revenus : ascendante et descendante, modélisation de scénarios | Mensuel ou avant une levée de fonds |
| `/pitch-deck` | Récit du pitch investisseurs pour la levée d'un nouveau tour | Préparation Série A / B |
| `/financial-plan` | Modèle opérationnel, plan d'effectifs, planification de scénarios, gestion de trésorerie | Trimestriel ou avant une levée |
| `/dcf-model` | Valorisation par actualisation des flux de trésorerie, analyse comparative, modélisation de table de capitalisation | M&A, secondaire, levée de fonds |

### Agents

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `ceo-advisor` | Opus | Décisions stratégiques, conception organisationnelle, stratégie de levée, décisions difficiles |
| `cfo-advisor` | Sonnet | Modélisation financière, analyse de la consommation, table de capitalisation, term sheets |
| `cto-advisor` | Sonnet | Décisions de dette technique, niveau de recrutement, build vs. buy, risque architectural |
| `chief-of-staff` | Sonnet | Coordination transversale, préparation du conseil, assemblées générales, suivi OKR |

---

## Flux de travail quotidien

### Pouls matinal de l'entreprise (15 minutes)

```
/founder-weekly-review

Bilan matinal — [DATE] :
- Quelles sont les 3 choses les plus importantes qui se passent dans l'entreprise aujourd'hui ?
- Des incendies pendant la nuit (escalade client, problème d'équipe, presse) ?
- Quel est mon usage du temps le plus précieux aujourd'hui ?

Données disponibles : [coller résumé Slack / mouvement MRR / mises à jour nocturnes]
```

### Communications investisseurs et conseil (selon les besoins)

```
/investor-update

Rédiger ma [mise à jour mensuelle / note à mi-parcours / mise à jour ad hoc] :
Mois : [MOIS]
Mouvement de la métrique clé : [variation MRR ou ARR]
Actualités de la période : [victoires, défis, départ du CTO, nouvelle embauche, etc.]
Demande : [ce dont j'ai besoin des investisseurs ce mois]
```

### Revue financière (hebdomadaire, 30 minutes)

```
/financial-plan

Bilan financier hebdomadaire :
- Trésorerie : [$X] | Consommation : [$X/mois] | Piste : [X mois]
- MRR cette semaine : [$X] | vs. semaine dernière : [$X]
- Des coûts inattendus cette semaine ?

À quoi ressemblent les 90 prochains jours sur la trajectoire actuelle ?
Que faudrait-il pour prolonger la piste de 2 mois sans lever de fonds ?
```

### Planification hebdomadaire (vendredi PM ou dimanche)

```
/founder-weekly-review

Bilan de fin de semaine pour la semaine du [DATE].

[Coller : MRR, mises à jour pipeline, actualités équipe, bilan OKR, incidents éventuels]

Produire : feu tricolore de santé de l'entreprise, statut OKR, 3 victoires, 2 points faibles, priorités PDG pour la semaine suivante, la décision que je dois prendre.
```

---

## Workflows clés par scénario

### Levée de fonds

```
1. Étudier le tour :
/dcf-model + /financial-plan
Quels ARR et métriques ai-je besoin d'atteindre pour lever à [valorisation cible] ?

2. Construire le récit :
/pitch-deck
Récit Série [X] — ARR actuel, taux de croissance, utilisation des fonds, thèse de marché.

3. Préparer les réunions investisseurs :
/ceo-advisor (agent)
Aide-moi à anticiper les 10 questions les plus difficiles qu'un [VC de premier plan] posera.

4. Suivre et clôturer :
/commercial-forecaster
Modéliser mon pipeline de levée : [N investisseurs à quelle étape] → date de clôture estimée.
```

### Recruter un dirigeant clé

```
/ceo-advisor

Je recrute un [VP Sales / CTO / DAF]. Aide-moi à :
1. Définir le profil (indispensables vs. souhaitables pour notre stade)
2. Rédiger la fiche d'évaluation (5-7 dimensions, chacune avec une rubrique)
3. Structurer le processus d'entretien (qui interroge, dans quel ordre, ce que chacun évalue)
4. Identifier 3 signaux d'alarme à filtrer
5. Rédiger le cadrage de la proposition (philosophie de rémunération, equity, attentes)

Contexte entreprise : [stade, ARR, taille de l'équipe, défi principal que cette embauche résout]
```

### Veille concurrentielle

```
/ceo-advisor

Analyse concurrentielle approfondie sur [concurrent] :
- En quoi sont-ils vraiment bons ? Qu'est-ce que les clients apprécient chez eux ?
- Où sont-ils faibles ? Que disent leurs clients churned ?
- Comment sont-ils positionnés vs. nous — prix, ICP, GTM ?
- Que feraient-ils si nous lancions [fonctionnalité/mouvement] ?
- Quelle est la chose dont nous devrions être le plus préoccupés ?

Sources à vérifier : avis G2, offres d'emploi, leur blog, dernière levée de fonds, recrutements LinkedIn.
```

### Préparation du conseil

```
/board-deck-builder

Réunion trimestrielle du conseil — [TRIMESTRE] :

Métriques : [ARR, croissance, NRR, consommation de trésorerie, effectifs]
Sujets spéciaux : [tout ce qui est inhabituel — pivot, départ clé, levée, victoire majeure]
Décisions nécessaires du conseil : [lister tout ce qui nécessite une approbation ou un avis]

Construire la structure du support. Je remplirai le récit de chaque section.
```

---

## Plan de montée en compétence sur 30 jours (fondateur découvrant Claude Code)

### Semaine 1 — Fondations
- Installer toutes les compétences fondateur via les commandes ci-dessus
- Lancer `/founder-weekly-review` pour cette semaine — se familiariser avec le format
- Lancer `/financial-plan` avec vos réalisés actuels — construire votre modèle opérationnel de base
- Lancer `/investor-update` pour le mois dernier — l'envoyer à vos investisseurs

### Semaine 2 — Rythme
- Utiliser `/founder-weekly-review` comme rituel du lundi matin (30 minutes)
- Utiliser `/ceo-advisor` pour une décision stratégique que vous remettez à plus tard
- Construire votre modèle de suivi OKR — le lancer hebdomadairement désormais

### Semaine 3 — Levée de fonds et communications
- Lancer `/pitch-deck` ou `/board-deck-builder` pour votre prochain événement à venir
- Définir un `CLAUDE.md` à la racine avec votre contexte entreprise (stade, ARR, équipe, investisseurs) pour que Claude ait toujours le contexte
- Lancer une session `/commercial-forecaster` pour comprendre votre trajectoire de revenus

### Semaine 4 — Intégration complète
- Chaque mise à jour investisseurs rédigée avec `/investor-update`
- Chaque réunion du conseil préparée avec `/board-deck-builder`
- Chaque recrutement important passé par `/ceo-advisor` pour la conception de la fiche d'évaluation
- Chaque semaine revue avec `/founder-weekly-review`

---

## CLAUDE.md pour les fondateurs

Créez un `CLAUDE.md` dans votre répertoire personnel ou à la racine du projet pour que Claude connaisse toujours le contexte de votre entreprise :

```markdown
# Contexte de l'entreprise

Entreprise : [NOM]
Stade : [Seed / Série A / Série B]
ARR : [$X]
Taux de croissance MRR : [X% MoM]
Taux de consommation : [$X/mois]
Piste : [X mois]
Effectifs : [N]
Investisseurs clés : [liste]
Statut de la levée : [pas en cours de levée / en préparation / sur le marché / clôturé]

## 3 priorités principales ce trimestre
1. [Priorité 1 — ex. : clôturer la Série A]
2. [Priorité 2 — ex. : atteindre 1,2M$ d'ARR]
3. [Priorité 3 — ex. : recruter un Responsable Commercial]

## Équipe
PDG : [nom]
CTO : [nom]
Responsable Produit : [nom]
Responsable Commercial : [nom]

## Métriques clés à connaître
NRR : [X%]
Marge brute : [X%]
Remboursement CAC : [X mois]
Churn : [X% mensuel]

## ICP
[2 phrases décrivant le client idéal — taille, secteur, rôle, problème]
```

Avec cela en place, chaque session Claude dispose du contexte complet sans avoir à tout réexpliquer.

---

## Intégrations d'outils

### Notion (pour les OKRs et les documents du conseil)

```json
// Ajouter à ~/.claude/settings.json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-notion"],
      "env": {
        "NOTION_API_TOKEN": "your-token"
      }
    }
  }
}
```

Connecté ainsi, Claude peut lire et mettre à jour votre tracker OKR, les documents de préparation du conseil et votre pipeline d'investisseurs.

### Linear (pour les OKRs d'ingénierie)

Connectez Linear via MCP pour extraire les données de sprint directement dans votre revue hebdomadaire. Claude peut vous dire ce qui a été livré, ce qui a glissé et ce qui est à risque — sans demander à votre CTO de compiler un rapport.

### QuickBooks / Xero

Exportez votre P&L et flux de trésorerie en CSV. Collez dans `/financial-plan` pour l'analyse de consommation et la modélisation de scénarios. Pour les fondateurs avec une connexion en temps réel, le MCP QuickBooks donne à Claude des données financières en direct.

---

## Métriques à obsessionnaliser (par stade)

### Seed

| Indicateur | Cible | Pourquoi |
|---|---|---|
| Délai jusqu'au premier client payant | <90 jours | Valide la disposition à payer |
| Rétention à la semaine 2 | >30% | Signal de PMF |
| NPS | >40 | Signal d'amour du produit |
| Multiple de consommation | <5x | Efficacité du capital en phase initiale |
| Fondateur : appels clients par semaine | 5+ | Rester proche du client |

### Série A

| Indicateur | Cible | Pourquoi |
|---|---|---|
| Croissance ARR MoM | >15% | Vélocité démontrable |
| NRR | >110% | Land and expand fonctionne |
| Remboursement CAC | <18 mois | Économies unitaires viables |
| Multiple de consommation | <3x | Croissance efficiente |
| Couverture du pipeline | >3x l'objectif | Revenus prévisibles |
| Délai pour atteindre le quota (commerciaux) | <4 mois | GTM répétable |

### Série B

| Indicateur | Cible | Pourquoi |
|---|---|---|
| Croissance ARR YoY | >100% | Composante Rule of 40 |
| Marge brute | >70% | Marge niveau logiciel |
| NRR | >120% | Croissance portée par l'expansion |
| Multiple de consommation | <2x | Efficacité du capital |
| Remboursement CAC | <12 mois | Économies unitaires prouvées |

---

## Erreurs courantes de fondateurs que Claude Code aide à éviter

**Erreur 1 : Laisser les mises à jour investisseurs glisser**
Configurez un rappel mensuel. `/investor-update` réduit le coût en temps à 10-15 minutes. Des mises à jour cohérentes renforcent la confiance même quand les chiffres sont difficiles.

**Erreur 2 : Les surprises en réunion du conseil**
Utilisez le framework des mauvaises nouvelles de `/board-deck-builder`. Appelez chaque membre du conseil individuellement avant la réunion si vous annoncez de mauvaises nouvelles. Ne laissez jamais le support être la première fois qu'ils entendent quelque chose de difficile.

**Erreur 3 : OKRs fixés en janvier, revus en décembre**
`/founder-weekly-review` inclut un bilan OKR chaque semaine. Les KRs en retard sont détectés à la semaine 5, pas à la semaine 13.

**Erreur 4 : Recruter à l'intuition, pas à la fiche d'évaluation**
Utilisez `/ceo-advisor` pour construire une fiche d'évaluation avant chaque recrutement senior. Documentez la rubrique. Débriefez chaque panel par rapport à la rubrique.

**Erreur 5 : Modèle financier uniquement pour la levée de fonds**
Votre modèle opérationnel devrait être un document vivant. Utilisez `/financial-plan` mensuellement. Connaissez votre piste en moins de 2 semaines, pas en moins de 2 mois.

---

## Ressources

- [Démarrer avec Claude Code](getting-started.md)
- [Workflow hebdomadaire fondateur](../workflows/founder-weekly.md)
- [Compétence constructeur de support de conseil](../skills/productivity/board-deck-builder.md)
- [Compétence mise à jour investisseurs](../skills/productivity/investor-update.md)
- [Compétence plan financier](../skills/finance/financial-plan.md)
- [Agent conseiller PDG](../agents/advisors/ceo-advisor.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
