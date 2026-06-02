# Claude pour les Designers UX et les Chercheurs

Tout ce dont un Designer UX ou un Chercheur a besoin pour exécuter la synthèse de recherche, l'analyse d'utilisabilité, la création de personas et la critique de design augmentées par l'IA dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes designer UX, chercheur UX ou designer produit dont le travail couvre la synthèse de recherche utilisateur, les tests d'utilisabilité, la création de personas, la cartographie du parcours, les critiques de design, les revues d'accessibilité et la communication avec les parties prenantes. Vous passez trop de temps à formater les résultats de recherche, à rédiger des rapports que personne ne lit et à recréer des personas de zéro. Claude Code réduit cette charge pour que vous puissiez consacrer du temps à ce qui nécessite réellement le jugement humain : parler aux utilisateurs, prendre des décisions de design et influencer le produit.

**Avant Claude Code :** 3-4 heures pour rédiger un rapport d'utilisabilité. 2 heures pour construire un persona à partir de notes d'entretiens. Une demi-journée pour produire un audit UX pour une remise de fonctionnalité.

**Après :** Rapport d'utilisabilité complet en 30 minutes. Persona en 10 minutes à partir de notes brutes. Audit UX en 45 minutes, priorisé par sévérité et effort.

---

## Installation en 30 secondes

```bash
# Installer toutes les compétences Designer UX
npx claudient add skills product

# Ou choisir à la carte :
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/ux-audit
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add agents roles/hypothesis-tester
```

---

## Votre stack UX Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/ux-researcher` | Personas utilisateur, cartes de parcours, plans de test d'utilisabilité, synthèse de recherche | Travail de recherche principal |
| `/usability-report` | Rapport d'utilisabilité complet : résumés de sessions, évaluations de sévérité, recommandations | Après chaque série de tests d'utilisabilité |
| `/persona-builder` | Personas utilisateur basés sur des données : objectifs, frustrations, comportements, citations | Après la synthèse de recherche |
| `/ux-audit` | Évaluation heuristique selon les 10 heuristiques de Nielsen, résultats priorisés | Avant le lancement, remises de fonctionnalités |
| `/product-discovery` | Cadres de discovery : définition du problème, cartographie des hypothèses, dimensionnement des opportunités | Discovery en phase initiale |
| `/experiment-designer` | Conception de tests A/B, formulation d'hypothèses, sélection de métriques, taille d'échantillon | Validation des décisions de design avec des données |

### Agents

| Agent | Modèle | Quand l'invoquer |
|---|---|---|
| `hypothesis-tester` | Sonnet | Validation des hypothèses de design avec des données de recherche ou d'analytics |

---

## Workflow quotidien

### Matin — Sessions de synthèse de recherche

**Transformer des notes brutes en insights :**
```
/ux-researcher

Synthétisez les résultats de recherche utilisateur à partir de ces 5 notes d'entretiens.

Type de recherche : entretiens utilisateur
Nombre de sessions : 5
Résultats bruts : [collez vos notes d'entretiens, une par session]

J'ai besoin de : thèmes regroupés, insights priorisés au format "Quand X, les utilisateurs Y — cela signifie Z",
et recommandations P1/P2/P3.
```

**Construire un persona à partir de la synthèse :**
```
/persona-builder

Construisez des personas utilisateur à partir de ces données de recherche.

Sources de données : entretiens utilisateur (5), tickets de support (3 mois), verbatims NPS
Produit : [nom]
Base d'utilisateurs : [qui utilise ce produit]

[collez les résultats synthétisés ci-dessus]

J'ai besoin de 2 personas pour un sprint de design la semaine prochaine. Utilisation principale : décisions de design et discussions de périmètre.
```

---

### Après un test d'utilisabilité — rédaction du rapport

**Transformer les notes de session en rapport priorisé :**
```
/usability-report

Rédigez un rapport de test d'utilisabilité pour [nom de la fonctionnalité].

Produit : [nom]
Fonctionnalité testée : [flux spécifique]
Format de test : modéré à distance
Participants : 6 — [critères de recrutement]
Sessions effectuées : [plage de dates]
Questions de recherche :
1. [Question principale]
2. [Question secondaire]

Résultats bruts :
[Collez les notes d'observateurs, citations, enregistrements de complétion de tâches]
```

---

### Avant le lancement — Audit UX

**Avant qu'une fonctionnalité soit livrée :**
```
/ux-audit

Effectuez un audit UX de [fonctionnalité/flux].

Produit : [nom]
Périmètre : [écrans ou flux à auditer]
Plateforme : web
Type d'utilisateur : [nom du persona]

[Décrivez l'UI — collez des liens de captures d'écran, des liens Figma, ou décrivez l'interface]

Donnez-moi : scores heuristiques Nielsen, tous les problèmes avec leurs évaluations de sévérité, et une liste de corrections priorisée
triée par impact × effort.
```

---

### Facilitation de critique de design

**Critique structurée pour votre propre travail ou une revue de design :**
```
/ux-researcher

Effectuez une critique de design structurée de ce design.

Design : [décrivez ou partagez un lien Figma]
Objectif de l'utilisateur : [ce que l'utilisateur essaie d'accomplir]
Contexte : [où cela apparaît dans le flux]
Contraintes : [contraintes techniques, cas limites à considérer]

Critiquez selon :
1. Atteint-il l'objectif de l'utilisateur sans formation ?
2. Y a-t-il des violations heuristiques (Nielsen) ?
3. Quelle est l'erreur utilisateur la plus probable ?
4. Qu'est-ce qui ferait échouer cela pour les utilisateurs en cas limite ?
5. À quoi ressemblerait une version 10x meilleure (pour remettre en question les hypothèses) ?

Résultat : feedback structuré avec évaluations de sévérité et suggestions de redesign spécifiques.
```

---

### Communication avec les parties prenantes

**Traduire la recherche en brief de décision :**
```
/usability-report

Convertissez ce rapport d'utilisabilité en brief de décision pour les parties prenantes.

Public : VP Produit et responsable ingénierie — lecture maximale de 10 minutes
Objectif : obtenir l'approbation de prioriser 3 corrections critiques avant le lancement

[collez les résultats du rapport d'utilisabilité]

Format : résumé exécutif → 3 problèmes critiques → impact business → action recommandée → estimation d'effort.
N'incluez pas les détails méthodologiques — ils sont en annexe.
```

---

### Hebdomadaire — Cartographie du parcours

**Cartographier l'expérience actuelle :**
```
/ux-researcher

Créez une carte de parcours client pour [expérience].

Expérience : [expérience de bout en bout à cartographier]
Persona utilisateur : [quel persona]
Points de contact : [canaux à couvrir — email, produit, support, site web]

Utilisez le format en 5 phases. Pour chaque phase : actions utilisateur, points de contact, pensées, sentiments (score 1-5),
points de douleur (🔴 critique / 🟡 notable), et opportunités.

Incluez une courbe d'expérience globale représentant le sentiment à travers les phases.
Point de sentiment le plus bas = opportunité de design la plus prioritaire.

Base factuelle : [données de recherche disponibles — entretiens / analytics / tickets de support / hypothèse]
```

---

## Plan d'intégration sur 30 jours (nouvelles recrues UX ou reconversions)

### Semaine 1 — Installation et outils de recherche
- Installer toutes les compétences produit : `npx claudient add skills product`
- Exécuter `/persona-builder` sur les données de recherche utilisateur existantes — se familiariser avec la compréhension actuelle des utilisateurs
- Exécuter `/ux-audit` sur le flux le plus utilisé du produit — évaluation heuristique de référence
- Revoir les rapports de test d'utilisabilité existants avec `/usability-report` comme référence de formatage

### Semaine 2 — Pratique de la recherche
- Conduire vos premiers entretiens utilisateur — prendre des notes brutes
- Utiliser `/ux-researcher` pour synthétiser immédiatement après chaque session (ne laissez pas les notes refroidir)
- Rédiger un rapport de synthèse de recherche et le partager avec l'équipe
- Pratiquer `/ux-audit` sur 3 produits concurrents — développer votre instinct d'évaluation heuristique

### Semaine 3 — Rapport et communication
- Effectuer un test d'utilisabilité complet sur une fonctionnalité actuelle
- Rédiger le rapport avec `/usability-report` — partager avec le PM et l'ingénierie
- Convertir les résultats en brief pour les parties prenantes en utilisant le format ci-dessus
- Suivre quelles recommandations sont acceptées versus déprioritisées — et pourquoi

### Semaine 4 — Expérimentation et validation
- Utiliser `/experiment-designer` pour concevoir un test pour votre principale hypothèse de design
- Utiliser l'agent `/hypothesis-tester` pour valider les hypothèses par rapport aux analytics ou à la recherche existants
- Effectuer un parcours heuristique avec un ingénieur en utilisant votre sortie `/ux-audit` comme ordre du jour

---

## Intégrations d'outils

### Figma (outil de design)
Claude Code ne lit pas directement les fichiers Figma. Bonnes pratiques :
- Exportez les écrans clés sous forme d'images et référencez-les dans votre prompt d'audit
- Utilisez le lien Figma "Partager pour présentation" comme référence dans vos notes
- Décrivez l'UI en termes structurés si vous ne pouvez pas partager des captures d'écran

### Dovetail / Notion (référentiel de recherche)
Exportez les notes d'entretiens en texte brut → collez dans les prompts de synthèse `/ux-researcher`.
Pour les référentiels structurés, copiez les notes brutes ou les points saillants — pas la vue taguée/codée.

### Maze / UserTesting.com (tests non modérés)
Exportez les résumés de session et les métriques de complétion de tâches → collez dans `/usability-report`.
Incluez les métriques quantitatives (taux de complétion, temps sur tâche) et les points saillants qualitatifs.

### Miro / FigJam (ateliers collaboratifs)
Utilisez Claude pour générer le contenu de la carte d'affinité → exportez vers Miro pour le regroupement visuel.
L'étape de synthèse `/usability-report` produit des thèmes regroupés que vous pouvez traduire directement en notes autocollantes.

### Linear / Jira (suivi des problèmes)
Utilisez la liste de corrections priorisée de `/usability-report` et `/ux-audit` pour générer des tickets directement.

```bash
# Demandez à Claude de formater la liste de corrections comme des tickets Linear/Jira
"Formatez les résultats P1 et P2 comme des descriptions de tickets Linear avec :
- Titre (impératif)
- User story (en tant que [persona], je veux...)
- Critères d'acceptation (3-5 points)
- Labels : [ux] [bug] ou [ux] [improvement]"
```

---

## Métriques à suivre

Utilisez ces métriques pour démontrer l'impact de la recherche :

| Métrique | Cible |
|---|---|
| Délai entre recherche et recommandation | <2 jours entre la dernière session et le rapport partagé |
| Taux d'adoption des recommandations | >60% des résultats P1/P2 traités dans les 2 sprints |
| Amélioration du score SUS (après correction) | +5 points SUS par cycle majeur de correction heuristique |
| Délai de mise à jour des personas après la recherche | <1 semaine |
| Problèmes d'accessibilité détectés avant le lancement (vs. après) | 100% détectés avant le lancement |
| Livraison du rapport d'utilisabilité après la fin des tests | <48 heures |

---

## Erreurs courantes (et comment Claude Code aide à les éviter)

**Erreur 1 : Rédiger des rapports que personne ne lit**
Les parties prenantes ne lisent pas des rapports de 20 pages. Utilisez le format de résumé exécutif de `/usability-report` et la sortie de brief de décision. Une page, trois résultats, une recommandation et une estimation d'effort.

**Erreur 2 : Personas sans données derrière eux**
`/persona-builder` signale toute affirmation qui manque de preuves et refuse de fabriquer des citations. Alimentez-le avec de vraies données.

**Erreur 3 : Auditer tout de façon égale**
`/ux-audit` note par sévérité × fréquence et produit une liste classée par ordre de priorité. Ne traitez pas un problème cosmétique et un problème bloquant une tâche comme équivalents.

**Erreur 4 : Synthèse de recherche qui prend une semaine**
Exécutez `/ux-researcher` immédiatement après chaque session. Ne mettez pas en lot — synthétisez au fur et à mesure. Des notes vieilles de 3 jours perdent leur texture.

**Erreur 5 : Sauter la traduction "pourquoi c'est important"**
Les ingénieurs et les PMs ont besoin de comprendre l'impact business, pas seulement le problème UX. La sortie de `/usability-report` inclut toujours une section "pourquoi c'est important" pour chaque résultat — ne la sautez pas.

---

## Ressources

- [Prise en main de Claude Code](../getting-started.md)
- [Workflow de sprint de recherche UX](../workflows/ux-research-sprint.md)
- [Compétence conception d'expérimentation](../skills/product/experiment-designer.md)
- [Compétence discovery produit](../skills/product/product-discovery.md)
- [Agent testeur d'hypothèses](../agents/roles/hypothesis-tester.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
