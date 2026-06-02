# Claude pour les CTO et Tech Leads

Tout ce dont un CTO, un VP Engineering ou un Tech Lead a besoin pour piloter avec l'IA le leadership technique — décisions d'architecture, stratégie d'ingénierie, recrutement technique, topologie des équipes, priorisation de la dette technique et reporting au conseil d'administration.

---

## À qui s'adresse ce guide

Vous êtes un CTO, un VP Engineering, un Principal Engineer ou un Tech Lead dont le travail est de définir la direction technique d'une entreprise ou d'une organisation d'ingénierie. Vous faites le lien entre la stratégie business et l'exécution technique. Vous prenez des décisions build vs. buy, définissez la topologie des équipes, menez des revues post-incident, évaluez les compromis d'architecture et rendez compte au conseil — souvent dans la même semaine.

**Avant Claude Code :** ADR : 90 minutes. Document de stratégie d'ingénierie : une semaine de soirées. Kit d'entretien pour un nouveau recrutement senior : 3 heures. Rapport technique pour le conseil sur la santé du système : une demi-journée.

**Après :** ADR en 20 minutes. Plan de stratégie d'ingénierie en 45 minutes. Kit d'entretien en 30 minutes. Rapport technique pour le conseil en 25 minutes.

---

## Installation en 30 secondes

```bash
# Installer la stack complète CTO / tech lead
npx claudient add skills productivity/adr-writer
npx claudient add skills productivity/tech-debt-tracker
npx claudient add skills devops-infra/platform-engineering
npx claudient add skills productivity/vertical-slice-planner
npx claudient add skills productivity/spec-driven-workflow
npx claudient add skills productivity/engineering-strategy
npx claudient add skills productivity/tech-interview-kit
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/vpe-advisor
npx claudient add agents core/architect
```

---

## Votre stack CTO avec Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/engineering-strategy` | Document de stratégie d'ingénierie : vision technique, build vs. buy, topologie des équipes, roadmap sur 12 mois | Planification annuelle/semestrielle, préparation du conseil, nouveau poste de CTO |
| `/adr-writer` | Architecture Decision Record — documente la décision, le contexte, les compromis, les conséquences | Après chaque décision architecturale significative |
| `/tech-interview-kit` | Défis de codage, prompts de conception système, grilles d'évaluation, modèles de débriefing | Avant tout cycle de recrutement technique |
| `/tech-debt-tracker` | Inventaire de la dette, cadre de priorisation, proposition d'investissement pour la direction | Revues trimestrielles de la dette technique |
| `/vertical-slice-planner` | Découpe les epics en tranches verticales livrables avec des critères d'acceptation clairs | Planification de sprint et de release |
| `/spec-driven-workflow` | Rédaction de spécification technique — énoncé du problème, exigences, options de conception | Avant de construire des fonctionnalités complexes |
| `/platform-engineering` | Stratégie de plateforme, expérience développeur, CI/CD, outillage interne | Travail des équipes plateforme/infra |

### Agents

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `cto-advisor` | Opus | Décisions stratégiques à fort enjeu — conception org, build vs. buy, paris technologiques |
| `vpe-advisor` | Sonnet | Exécution et santé des équipes — vélocité, recrutement, excellence opérationnelle |
| `architect` | Opus | Conception de systèmes complexes — systèmes distribués, architecture de données, scalabilité |

---

## Flux de travail quotidien

### Bilan de santé de l'ingénierie matinal (15 minutes)

```
Bilan de santé rapide de l'organisation d'ingénierie pour [DATE] :

Métriques d'hier :
- Déploiements en production : [X] (cible : [N par jour])
- Déploiements échoués / rollbacks : [X]
- Incidents ouverts : [X] / Incidents P1 ces 7 derniers jours : [X]
- Temps de réponse P1 (dernier incident) : [X minutes] (cible : < 30 min)
- Pull requests fusionnées : [X] / ouvertes depuis > 5 jours : [X] (PRs longue durée = risque de merge)
- Escalades on-call : [X]

Pouls de l'équipe :
- Un ingénieur bloqué depuis > 1 jour ? [oui/non + qui]
- Une équipe en dessous de 70% de son engagement de sprint ? [oui/non]
- Des échéances critiques dans les 14 prochains jours ? [liste]

Signalez : ce qui nécessite mon attention aujourd'hui (classé par urgence × impact) ?
```

---

### Travail d'architecture et de conception

**Pour toute décision technique significative :**

```
/adr-writer

Décision : [que décidons-nous ?]
Contexte : [pourquoi cette décision est-elle nécessaire maintenant ? Quel est le facteur business ou technique ?]
Options envisagées :
1. [Nom option A] : [brève description]
2. [Nom option B] : [brève description]
3. [Nom option C ou "ne rien faire"]

Contraintes : [budget, délais, dépendances de la stack existante, expertise de l'équipe]
Critères d'évaluation : [ce qui compte le plus — performance / maintenabilité / coût / rapidité de livraison]

Rédigez un ADR complet avec : statut, contexte, décision, conséquences et compromis.
```

**Pour de nouvelles fonctionnalités complexes :**

```
/spec-driven-workflow

Fonctionnalité : [nom]
Objectif business : [quel résultat cela sert]
Énoncé du problème : [quel problème utilisateur ou système nous résolvons]
Contraintes : [techniques, délais, capacité de l'équipe]

Produisez : spécification technique avec énoncé du problème, exigences (fonctionnelles + non fonctionnelles), options de conception avec analyse des compromis, approche recommandée, et questions ouvertes à résoudre avant le début des travaux.
```

---

### Entretiens individuels et coaching

Utilisez l'agent `vpe-advisor` pour préparer des conversations difficiles de management d'ingénierie :

```
@vpe-advisor

J'ai un entretien individuel demain avec [rôle, niveau de séniorité].
Contexte : [ce qui se passe — performance, développement de carrière, friction d'équipe, question de périmètre]

Aidez-moi à :
- Cadrer la conversation de manière productive (pas comme une plainte ou un avertissement de performance)
- Poser des questions qui m'apportent de vraies informations
- Préparer une réponse si la personne soulève [préoccupation spécifique]
- Définir un résultat concret pour la conversation
```

---

### Reporting au conseil et à la direction

```
/engineering-strategy

Rédigez la section ingénierie du deck pour le conseil de [TRIMESTRE/MOIS].

Audience : conseil et C-suite (non technique, focalisé sur le risque et le ROI)
Métriques clés à rapporter :
- Fréquence de déploiement : [actuel vs. trimestre dernier vs. cible]
- Fiabilité (disponibilité) : [actuel vs. cible]
- Sécurité : [incidents, vulnérabilités corrigées]
- Vélocité d'ingénierie : [vue d'ensemble : accélérons-nous ou décélèrons-nous ?]
- Effectifs : [actuels / recrutements planifiés / attrition]
- Investissement dette technique : [% de la capacité de sprint dédié ce trimestre]

Points saillants : [ce que nous avons livré de majeur]
Risques : [ce qui pourrait dérailler l'ingénierie dans les 90 prochains jours]
Demandes : [ce dont vous avez besoin du conseil — budget, décisions, soutien]

Format : contenu équivalent à 3-5 slides (résumé exécutif + détails). Langage clair, sans jargon.
```

---

### Priorisation de la dette technique

```
/tech-debt-tracker

Inventaire actuel de la dette technique :
[Listez ou décrivez vos éléments de dette connus — ou collez depuis un doc/Jira]

Pour chaque élément : nom, ce qu'il ralentit, coût estimé de correction, risque si non traité

Cadre de priorisation :
Scorez chaque élément :
- Impact business si NON corrigé : 1-5 (5 = risque existentiel)
- Taxe sur la vélocité des développeurs : 1-5 (5 = l'équipe passe > 20% du temps à le contourner)
- Effort de correction : 1-5 (1 = correction rapide, 5 = effort multi-sprint)

Score de priorité = (impact business + taxe vélocité) / effort

Produisez :
- Liste classée avec les scores
- Top 3 des éléments à traiter le trimestre prochain avec justification business pour chacun
- Allocation de capacité proposée (% de la capacité de sprint pour la dette technique)
- Résumé pour la direction : "Voici ce que notre dette technique nous coûte et ce que sa correction débloque"
```

---

## Rythme hebdomadaire

### Lundi — Alignement stratégie d'ingénierie

```
/engineering-strategy

Bilan d'alignement hebdomadaire :
- Exécutons-nous conformément à la stratégie sur 12 mois ? Qu'est-ce qui dérive ?
- Quels OKR sont à risque ce trimestre ?
- La topologie des équipes fonctionne-t-elle ? Des ruptures de coordination à adresser ?
- Décisions clés à prendre cette semaine : [liste]

Donnez-moi un mémo de focus hebdomadaire en 5 points que je peux partager avec mes team leads.
```

### Mercredi — Revue du recrutement technique

Utilisez `/tech-interview-kit` quand un recrutement est en cours :

```
/tech-interview-kit

J'ai un processus d'entretien en cours pour un [NIVEAU] [RÔLE].
Intervieweurs : [liste + quelle étape chacun prend en charge]

Aidez-moi à :
- Réviser les étapes d'entretien pour détecter les lacunes (testons-nous les bonnes choses pour ce niveau ?)
- Préparer le modèle de débriefing pour vendredi
- Calibrer ce que "le niveau requis" signifie pour ce rôle spécifique vs. le référentiel général

[Si un exercice à emporter a été soumis : collez la soumission et demandez un cadre d'évaluation]
```

### Vendredi — Revue build vs. buy et communication avec les parties prenantes

```
@cto-advisor

Décision build vs. buy sur laquelle je me bats : [décrivez la capacité, les options, le délai, le coût]

Mes contraintes :
- Bande passante d'ingénierie : [utilisation actuelle — sommes-nous à capacité ?]
- Budget : [disponible pour outillage/services]
- Délai : [quand nous avons besoin de cette capacité]
- Expertise de notre équipe dans ce domaine : [forte / faible / nulle]
- Importance stratégique : [est-ce un différenciateur ou une commodité ?]

Donnez-moi une recommandation avec vos 3 raisons les plus solides, et ce qui changerait votre avis.
```

---

## Plan de montée en compétence sur 30 jours (nouveau CTO)

### Semaine 1 — Écouter et diagnostiquer

- Installez toutes les compétences CTO et configurez votre outillage
- Exécutez `/engineering-strategy` en mode audit : "Décrivez l'état actuel de l'ingénierie ici. Qu'est-ce qui fonctionne ? Qu'est-ce qui est cassé ? Quels sont les risques clés ?"
- Identifiez les 3 principaux points douloureux techniques de l'équipe (demandez, ne supposez pas)
- Cartographiez la topologie actuelle des équipes — qui possède quoi, où les transferts sont lents
- Lisez les 12 derniers mois d'ADRs (s'ils existent) pour comprendre les décisions antérieures

### Semaine 2 — Documenter les décisions déjà prises

- Rédigez des ADRs pour toute décision architecturale non documentée que vous découvrez
- Exécutez `/tech-debt-tracker` — obtenez un inventaire de référence, même incomplet
- Passez en revue le pipeline de recrutement — des postes ouverts et quel niveau a été défini ?
- Vérifiez les métriques DORA de référence (fréquence de déploiement, MTTR, taux d'échec des changements)

### Semaine 3 — Première communication stratégique

- Rédigez votre premier document de stratégie d'ingénierie avec `/engineering-strategy`
- Validez-le avec vos 2-3 ingénieurs les plus seniors avant de le publier
- Présentez au CEO ou à la direction : voici ce que je vois, voici mon plan pour 12 mois
- Menez votre premier entretien technique avec le nouveau kit de `/tech-interview-kit`

### Semaine 4 — Processus et rythme

- Établissez le bilan de santé de l'ingénierie comme rituel quotidien de 15 minutes
- Lancez une session de priorisation de la dette technique avec les team leads
- Définissez vos cibles de métriques DORA et publiez-les à l'équipe
- Livrez votre premier rapport d'ingénierie au conseil

---

## Intégrations d'outils

### GitHub (code et PRs)

```bash
# Claude Code dispose d'une intégration GitHub native via gh CLI
# Accédez directement aux revues de PRs, à la santé du code, au statut des déploiements

gh pr list --state open
gh run list --limit 10  # statut du pipeline CI/CD
```

### Linear / Jira (planification d'ingénierie)

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-api-key"
      }
    }
  }
}
```

Utilisation : planification de sprint avec `/vertical-slice-planner`, suivi de la dette technique, visibilité sur la roadmap.

### Datadog / Honeycomb (observabilité)

Exportez les données d'incident et les métriques DORA → collez dans le prompt de bilan de santé de l'ingénierie pour l'analyse des tendances.

### Notion / Confluence (documentation)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-token"
      }
    }
  }
}
```

Utilisation : documents de stratégie d'ingénierie, ADRs, topologie des équipes, backlog de dette technique.

---

## Métriques à suivre

| Métrique | Cible (phase de croissance) | Signal d'alarme |
|---|---|---|
| Fréquence de déploiement | Quotidienne ou plusieurs fois/semaine | < 1/semaine |
| Délai d'exécution des changements | < 1 jour | > 1 semaine |
| Taux d'échec des changements | < 10% | > 20% |
| MTTR (temps moyen de restauration) | < 1 heure | > 4 heures |
| Disponibilité de l'ingénierie (équipe) | > 85% | < 70% |
| % de dette technique par sprint | 15-20% | > 30% ou < 10% |
| Délai de recrutement (postes eng.) | < 45 jours | > 90 jours |
| Taux d'acceptation des offres | > 80% | < 60% |
| Temps avant première PR (nouvel ingénieur) | < 3 jours | > 1 semaine |

---

## Erreurs courantes et comment Claude Code aide à les éviter

**Erreur 1 : Décisions architecturales prises verbalement, jamais documentées**
`/adr-writer` prend 20 minutes par décision. Sans ADRs, la connaissance tribale devient de la dette technique.

**Erreur 2 : Recrutement sans référentiel calibré**
`/tech-interview-kit` force la calibration avant le premier candidat. Les intervieweurs qui ne s'accordent pas sur ce que "bon" signifie recruteront de manière incohérente.

**Erreur 3 : La dette technique traitée de manière réactive (seulement quand elle casse quelque chose)**
`/tech-debt-tracker` transforme la dette en un business case. La direction finance ce qui a un coût défini et un ROI.

**Erreur 4 : Une stratégie d'ingénierie qui existe uniquement sous forme de slide deck**
`/engineering-strategy` produit un document vivant avec des métriques. Revoyez-le chaque trimestre.

**Erreur 5 : Des rapports d'ingénierie au conseil qui semblent être en langue étrangère**
Utilisez `/engineering-strategy` pour écrire pour des audiences non techniques. Les métriques DORA nécessitent une phrase de traduction avant de signifier quoi que ce soit pour un conseil.

---

## Ressources

- [Guide Architecture Decision Records](./adr-writing.md)
- [Compétence Engineering Strategy](../skills/productivity/engineering-strategy.md)
- [Kit d'entretien technique](../skills/productivity/tech-interview-kit.md)
- [Suivi de la dette technique](../skills/productivity/tech-debt-tracker.md)
- [Workflow hebdomadaire du CTO](../workflows/cto-weekly.md)
- [Démarrer avec Claude Code](./getting-started.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
