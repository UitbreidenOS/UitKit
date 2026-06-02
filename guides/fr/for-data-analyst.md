# Claude pour les Analystes de Données et Analystes BI

Tout ce dont un analyste de données ou un analyste BI a besoin pour piloter avec l'IA le travail SQL, l'interprétation des tableaux de bord, le reporting aux parties prenantes, les audits de qualité des données et les analyses ad-hoc dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes un analyste de données ou un analyste BI intégré dans une équipe business, produit ou marketing. Vous recevez 15 demandes ad-hoc par semaine, maintenez 8 tableaux de bord, rédigez un rapport hebdomadaire pour la direction et êtes toujours à un changement de schéma d'un pipeline cassé. Claude Code devient votre pair programmer pour les requêtes, votre éditeur pour les rapports et votre contrôleur qualité pour tout ce que vous livrez.

**Avant Claude Code :** 2 heures pour écrire une requête SQL complexe de zéro. 1 heure pour rédiger le rapport mensuel aux parties prenantes à partir de métriques brutes. 3 heures pour investiguer un problème de qualité des données sur 10 tables.

**Après :** Requête complexe en 15 minutes. Rapport aux parties prenantes en 20 minutes. Audit de qualité des données en 30 minutes avec le SQL de remédiation inclus.

---

## Installation en 30 secondes

```bash
# Installer les compétences analyste de données
npx claudient add skill data-ml/sql
npx claudient add skill data-ml/pandas-polars
npx claudient add skill data-ml/dbt-data-pipelines
npx claudient add skill data-ml/dashboard-narrator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill data-ml/data-quality-checker
npx claudient add skill product/product-analytics
npx claudient add skill marketing/analytics-tracking

# Installer les agents pertinents
npx claudient add agent roles/data-pipeline-architect
npx claudient add agent roles/quant-analyst
```

---

## Votre stack data avec Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/sql` | Écrire, optimiser et déboguer du SQL complexe — CTEs, fonctions fenêtre, plans de requête | Tout travail SQL |
| `/pandas-polars` | Manipulation de données Python — nettoyage, transformation, agrégation, exports | Analyse ad-hoc en Python |
| `/dbt-data-pipelines` | Conception de modèles dbt, modèles incrémentaux, tests, documentation | Travail sur les pipelines et transformations |
| `/dashboard-narrator` | Traduit les données de tableau de bord en narratif prêt pour les dirigeants — insights, anomalies, recommandations | Reporting hebdomadaire et ad-hoc |
| `/stakeholder-report` | Rapport hebdomadaire/mensuel : métriques phares, cause racine, actions | Cadences de reporting régulières |
| `/data-quality-checker` | Audit de qualité des données : nulls, doublons, valeurs aberrantes, dérive de schéma, SQL de remédiation | Toute nouvelle source de données ou investigation d'anomalie |
| `/product-analytics` | Analyse d'entonnoir, rétention, cohortes, tests A/B — métriques de croissance produit | Analyse pour l'équipe produit |
| `/analytics-tracking` | Conception du schéma de tracking d'événements, plans de tracking, audits de tags | Implémentation du tracking |

### Agents

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `data-pipeline-architect` | Opus | Conception de pipelines complexes, décisions d'architecture |
| `quant-analyst` | Opus | Analyse statistique, méthodologie de tests A/B, prévisions |

---

## Flux de travail quotidien

### Matin (15-20 minutes)

**1. Bilan de santé des données — vérifiez les données de production avant que les parties prenantes posent des questions**
```
/data-quality-checker

Bilan de santé rapide de nos tables de production avant le début de la journée business.

Effectuez ces vérifications sur les tables suivantes :
- [table_1] : vérifiez les nulls sur [colonnes clés], doublons de [clé primaire]
- [table_2] : vérifiez les dates futures dans [colonne de date], valeurs négatives dans [colonne montant]

[Collez les comptages de lignes d'hier ou les anomalies si vous en avez]

Signalez tout ce qui semble anormal. Générez les requêtes SQL à exécuter pour confirmer.
```

**2. Triage des demandes ad-hoc de la nuit**
Copiez-collez la demande dans Claude → obtenez un brouillon SQL ou un plan d'analyse avant de commencer à travailler.

---

### Analyse ad-hoc (à la demande)

**3. Requête SQL complexe — toute demande**
```
/sql

Rédigez une requête SQL pour répondre à cette question business :
"[Demande de la partie prenante dans ses propres mots]"

Notre schéma :
- [nom_table] : colonnes [liste], clé primaire [col], relations avec [autres tables]
- [nom_table] : [idem]

Base de données : [PostgreSQL / BigQuery / Snowflake / Redshift]
J'ai besoin : [décrivez la sortie — forme du tableau, niveau de granularité, filtres]
```

**4. Analyse d'entonnoir ou de cohorte**
```
/product-analytics

Construisez une analyse [entonnoir / rétention par cohorte / test A/B].

Table d'événements : [schéma]
Question : [ce que nous essayons de comprendre]
Période : [plage de dates]
Segmenter par : [type d'utilisateur / canal d'acquisition / tier du plan]

Résultat : [SQL + interprétation des résultats]
```

---

### Reporting (cadence hebdomadaire)

**5. Rapport hebdomadaire aux parties prenantes**
```
/stakeholder-report

Rédigez le rapport de données hebdomadaire pour [direction / équipe produit / marketing].

Semaine du : [dates]
Métriques de cette semaine :
[Collez vos métriques avec variations hebdomadaires et écarts par rapport au plan]

Événements clés : [sorties produit, campagnes, incidents]
```

**6. Narratif de tableau de bord — quand la direction demande "qu'est-ce que ça veut dire ?"**
```
/dashboard-narrator

Traduisez ces données de tableau de bord en une lecture de 5 minutes pour notre CEO.

Tableau de bord : [nom]
Période : [ce mois]
Audience : CEO + équipe dirigeante — pas technique

[Collez vos valeurs de métriques, variations et tout contexte que vous connaissez]
```

---

### Travail approfondi mensuel (première semaine du mois)

**7. Rapport mensuel**
```
/stakeholder-report

Rapport de données mensuel pour [audience].
Mois : [nom]
[Tableau complet des métriques — mois actuel, mois précédent, MoM%, année précédente, YoY%, vs plan]
Cause racine des plus grands changements : [vos notes]
Actions et responsables : [liste]
```

**8. Audit de qualité des données — audit mensuel de production**
```
/data-quality-checker

Audit mensuel de qualité des données sur nos [N] tables de production.

Pour chaque table :
- [table_1] : [nombre de lignes, clé primaire, colonnes business clés]
- [table_2] : [idem]

Générez le script d'audit Python à exécuter. Après que je colle les résultats, générez le rapport de santé et le SQL de remédiation.
```

---

### En continu (travail sur les pipelines)

**9. Conception de modèle dbt**
```
/dbt-data-pipelines

Je dois construire un modèle dbt pour [concept business — ex. : utilisateurs actifs hebdomadaires par cohorte].

Tables sources : [liste avec schémas]
Résultat souhaité : [granularité, colonnes, utilisation du modèle]
Matérialisation : [table / incrémentale / vue]

Générez : le SQL du modèle, le schema.yml avec les tests, et la documentation.
```

---

## Plan de montée en compétence sur 30 jours (nouvel analyste ou nouvelle stack)

### Semaine 1 — Maîtrise du SQL dans votre nouveau schéma
- Installez toutes les compétences data : `npx claudient add skill data-ml/[nom]`
- Documentez vos tables clés dans un CLAUDE.md dans votre dépôt analytics — Claude lit cela pour le contexte
- Utilisez `/sql` pour écrire 10 requêtes répondant aux questions business courantes — construisez votre bibliothèque de requêtes
- Exécutez `/data-quality-checker` sur vos 3 tables de production les plus importantes — comprenez votre référentiel de santé des données

### Semaine 2 — Workflows de reporting
- Utilisez `/dashboard-narrator` pour rédiger la revue business hebdomadaire — comparez à ce que vous auriez écrit manuellement
- Utilisez `/stakeholder-report` pour rédiger le rapport mensuel — partagez avec votre manager et obtenez un retour
- Identifiez quelles parties prenantes lisent vraiment les rapports et calibrez la longueur/format en conséquence

### Semaine 3 — Pipeline et tracking
- Utilisez `/dbt-data-pipelines` pour ajouter des tests à tout modèle non testé dans votre projet
- Utilisez `/analytics-tracking` pour auditer votre tracking d'événements — trouvez les lacunes avant qu'elles deviennent des problèmes de qualité des données
- Mettez en place les tests que Claude génère — faites tourner un monitoring automatique de la qualité

### Semaine 4 — Analyses avancées
- Utilisez `/product-analytics` pour effectuer une analyse d'entonnoir complète — identifiez le plus grand point de chute dans votre produit
- Utilisez l'agent `/quant-analyst` pour toute analyse de test A/B — maîtrisez la méthodologie avant de présenter les résultats
- Comparez votre temps : combien de minutes prend maintenant chaque demande courante vs. avant Claude ?

---

## Intégrations d'outils

### dbt Core / dbt Cloud

```bash
# Claude lit la structure de votre projet dbt
# Pointez Claude vers votre répertoire models/ et il comprend votre schéma
ls models/marts/ models/staging/  # montrez à Claude votre structure de dossiers
cat dbt_project.yml               # collez ceci pour le contexte du projet
```

### BigQuery / Snowflake / Redshift

```json
// Connectez votre entrepôt de données via MCP
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/bigquery-mcp"],
      "env": {
        "GOOGLE_PROJECT_ID": "your-project",
        "GOOGLE_CREDENTIALS": "/path/to/credentials.json"
      }
    }
  }
}
```

Avec votre entrepôt connecté : Claude peut lire directement les schémas de tables, exécuter des requêtes et valider le SQL avant que vous le fassiez.

### Looker / Tableau / Metabase
Exportez les données de tableau de bord en CSV ou collez les valeurs des métriques → `/dashboard-narrator` les convertit en narratif. Pour LookML : collez votre fichier de vue et Claude aide à rédiger ou refactoriser les définitions de dimensions/mesures.

### Notebooks Jupyter
Claude rédige le code d'analyse Python → collez dans le notebook → exécutez → collez le résultat pour interprétation. Utilisez `/pandas-polars` pour le code et `/dashboard-narrator` pour l'interprétation.

### Slack (livraison aux parties prenantes)
Collez le rapport hebdomadaire de Claude dans un message Slack. Configurez un rappel hebdomadaire → ouvrez Claude → exécutez `/stakeholder-report` → collez dans Slack. Temps total : 15 minutes des données à la livraison.

---

## Métriques à suivre

| Activité | Temps manuel | Avec Claude |
|---|---|---|
| Requête SQL complexe (3+ tables) | 2 heures | 20 min |
| Rapport hebdomadaire aux parties prenantes | 60 min | 15 min |
| Rapport mensuel aux parties prenantes | 3 heures | 30 min |
| Audit de qualité des données (5 tables) | 3 heures | 30 min |
| Modèle dbt + tests + docs | 2 heures | 25 min |
| Narratif de tableau de bord | 45 min | 8 min |
| Analyse de test A/B | 3 heures | 45 min |

---

## Erreurs courantes (et comment Claude Code les prévient)

**Erreur 1 : Livrer un rapport avec de mauvaises données**
Exécutez `/data-quality-checker` avant chaque rapport mensuel. Connaissez la santé de vos données avant que les parties prenantes les voient.

**Erreur 2 : Écrire du SQL correct mais illisible**
`/sql` génère des CTEs et des requêtes documentées par défaut. Vous futur remerciera vous présent.

**Erreur 3 : Des rapports aux parties prenantes qui sont des déversements de données**
`/stakeholder-report` impose un narratif : ce qui s'est passé, pourquoi, que faire. Pas juste un tableau de chiffres.

**Erreur 4 : Des anomalies dans les tableaux de bord sans explication**
`/dashboard-narrator` structure l'investigation des anomalies : quel est le signal, quelles sont les hypothèses, comment vérifier.

**Erreur 5 : Des modèles dbt sans tests**
`/dbt-data-pipelines` génère un schema.yml avec des tests dans chaque modèle. Les tests ne sont pas une réflexion après coup.

---

## Ressources

- [Démarrer avec Claude Code](getting-started.md)
- [Compétence SQL](../skills/data-ml/sql.md)
- [Compétence Dashboard Narrator](../skills/data-ml/dashboard-narrator.md)
- [Compétence Stakeholder Report](../skills/data-ml/stakeholder-report.md)
- [Compétence Data Quality Checker](../skills/data-ml/data-quality-checker.md)
- [Workflow de reporting de données](../workflows/data-reporting.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
