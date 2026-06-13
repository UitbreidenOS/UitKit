# Flux de travail — Rapports de données

Un processus reproductible permettant aux analystes de données de passer des métriques brutes à des rapports publiés pour les parties prenantes — cadences hebdomadaires et mensuelles — en utilisant les compétences Claude Code à chaque étape.

---

## Vue d'ensemble

Ce flux de travail couvre deux cadences de reporting :
- **Rapport hebdomadaire :** processus de 45 minutes de l'extraction des données à la distribution
- **Rapport mensuel :** processus de 2 heures de l'extraction des données au rapport prêt pour la direction

Les deux suivent la même structure : données → contrôle qualité → analyse → récit → révision → publication.

---

## Flux de travail du rapport hebdomadaire (chaque lundi matin)

**Durée cible :** 45 minutes au total

---

### Étape 1 : Extraire les données de la semaine passée (10 minutes)

Exécutez votre extraction de données standard depuis votre outil BI ou votre entrepôt de données.

Métriques requises pour la plupart des rapports hebdomadaires d'entreprise :
```sql
-- Modèle : Extraction des métriques hebdomadaires
-- À exécuter chaque lundi pour la semaine précédente (lun-dim)

WITH week_current AS (
    SELECT
        DATE_TRUNC('week', created_at) AS week,
        COUNT(DISTINCT user_id) AS weekly_active_users,
        SUM(revenue) AS revenue,
        COUNT(DISTINCT order_id) AS transactions,
        SUM(revenue) / COUNT(DISTINCT order_id) AS avg_order_value
    FROM events
    WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '7 days')
      AND created_at <  DATE_TRUNC('week', CURRENT_DATE)
    GROUP BY 1
),
week_prior AS (
    -- Same query for the week before
    SELECT ... FROM events WHERE ...
)
SELECT
    c.*,
    ROUND(100.0 * (c.revenue - p.revenue) / NULLIF(p.revenue, 0), 2) AS revenue_wow_pct,
    ROUND(100.0 * (c.weekly_active_users - p.weekly_active_users) / NULLIF(p.weekly_active_users, 0), 2) AS wau_wow_pct
FROM week_current c
CROSS JOIN week_prior p;
```

Enregistrez les résultats dans une ligne de feuille de calcul ou dans la table de métriques de votre pipeline.

---

### Étape 2 : Vérification rapide de la qualité des données (5 minutes)

Avant d'écrire un seul mot, vérifiez que les chiffres sont fiables :

```
/data-quality-checker

Vérification rapide des métriques de cette semaine avant de rédiger le rapport.

Cette semaine vs. la semaine dernière :
- WAU : [X] vs [X] ([+/-X%])
- Chiffre d'affaires : $[X] vs $[X] ([+/-X%])
- [Autres métriques]

Points à vérifier :
- Toute métrique qui évolue de plus de 25 % d'une semaine à l'autre de façon inattendue
- Le calcul du chiffre d'affaires est-il cohérent ? (transactions × valeur moyenne de commande ≈ chiffre d'affaires total)
- Quelque chose qui ne passe pas le test du « est-ce que ça a du sens » ?

Contexte : [tout événement connu — panne, campagne, jour férié, changement de pipeline de données]
```

Si les données sont correctes, poursuivez. Si quelque chose semble erroné, examinez avant de rédiger.

---

### Étape 3 : Recueillir le contexte (5 minutes)

Les données vous indiquent ce qui s'est passé. Vous devez savoir pourquoi. Avant de rédiger :

- Consultez Slack pour les annonces de l'équipe produit, marketing ou technique de la semaine dernière
- Notez toute sortie de produit (vérifiez les notes de version ou Jira)
- Notez les campagnes marketing ou promotions qui ont été menées
- Notez les incidents ou pannes
- Vérifiez s'il y a eu un effet saisonnier connu

Ce contexte fait la différence entre « le chiffre d'affaires a baissé de 8 % » (inutile) et « le chiffre d'affaires a baissé de 8 % lors de la première semaine suivant la fin de la campagne Q3 — retour attendu à la normale, désormais de retour à la tendance de référence » (utile).

---

### Étape 4 : Rédiger le rapport hebdomadaire (15 minutes)

```
/stakeholder-report

Rédigez le rapport de données hebdomadaire pour [nom de l'équipe].

SEMAINE DU : [plage de dates]
AUDIENCE : [équipe de direction / responsables de département]

MÉTRIQUES (collez vos données avec les variations hebdomadaires et vs. objectif si applicable) :
- WAU : [X] ([+/-X%] WoW, objectif [X])
- Chiffre d'affaires : $[X] ([+/-X%] WoW, objectif $[X])
- Taux de conversion : [X]% ([+/-X]pp WoW)
- [Autres métriques]

ÉVÉNEMENTS DE CETTE SEMAINE :
- [Événement 1 — ex. : nouveau flux d'intégration lancé mardi]
- [Événement 2]

CE QUE JE SAIS SUR LES ÉVOLUTIONS :
- [Baisse du chiffre d'affaires probablement due à la fin de la campagne]
- [WAU en hausse grâce à la nouvelle cohorte d'utilisateurs de [source]]
- [Variation du taux de conversion inexpliquée — nécessite une investigation]

Générez : résumé en titre, succès, préoccupations, anomalies, actions recommandées, liste de surveillance pour la semaine prochaine.
```

---

### Étape 5 : Révision et vérification des faits (5 minutes)

Avant de publier :

```
/stakeholder-report

Révisez ce brouillon de rapport hebdomadaire pour la qualité.

[Collez votre brouillon]

Vérifiez :
- Chaque affirmation est-elle quantifiée ? (pas de « significativement » sans chiffre)
- Les succès et les préoccupations sont-ils équilibrés ?
- L'action recommandée est-elle spécifique et attribuée à quelqu'un ?
- Quelque chose est-il présenté comme causal alors que ce n'est que corrélationnel ?
- Une personne qui ne connaît pas notre activité comprendrait-elle ce rapport ?
```

Corrigez tout problème signalé par Claude.

---

### Étape 6 : Distribution (5 minutes)

- Envoi par e-mail à votre liste de distribution, OU
- Publication sur Slack (#data-updates ou équivalent), OU
- Mise à jour du document partagé dans Notion/Confluence

Incluez une ligne « Des questions ? » — vous voulez que les parties prenantes s'engagent, pas seulement qu'elles lisent et classent.

---

## Flux de travail du rapport mensuel (premier lundi de chaque mois)

**Durée cible :** 2 heures au total

---

### Étape 1 : Extraire les données mensuelles (20 minutes)

Les rapports mensuels nécessitent plus de profondeur que les hebdomadaires. Extrayez :
- Métriques du mois complet avec comparaisons MoM et YoY
- Comparaison vs. plan/budget (si vous avez des objectifs)
- Ventilations par segment (par ligne de produit, zone géographique, canal)
- Données de cohortes (comment les nouveaux utilisateurs du mois dernier ont-ils été retenus ce mois-ci ?)
- Indicateurs avancés pour le mois prochain

```sql
-- Modèle de métriques mensuelles
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', created_at) AS month,
        [your key metrics]
    FROM [your tables]
    GROUP BY 1
),
with_changes AS (
    SELECT
        month,
        [metric],
        LAG([metric]) OVER (ORDER BY month) AS prior_month,
        [metric] - LAG([metric]) OVER (ORDER BY month) AS mom_change,
        ROUND(100.0 * ([metric] - LAG([metric]) OVER (ORDER BY month))
              / NULLIF(LAG([metric]) OVER (ORDER BY month), 0), 2) AS mom_pct_change
    FROM monthly
)
SELECT * FROM with_changes ORDER BY month DESC LIMIT 3;
```

---

### Étape 2 : Audit complet de la qualité des données (20 minutes)

Cadence mensuelle = audit mensuel. Exécutez le script d'audit complet :

```
/data-quality-checker

Audit mensuel de la qualité des données pour [mois en cours].

Exécutez un audit complet sur ces tables de production :
- [table_1] : clé primaire [col], métriques clés [cols]
- [table_2] : [idem]
- [table_3] : [idem]

Générez le script d'audit Python. Je l'exécuterai et collerai les résultats en retour.
```

Exécutez le script généré. Collez les résultats en retour à Claude. Obtenez le rapport de santé des données et le SQL de remédiation.

**Règle :** Ne publiez pas un rapport mensuel s'il y a des problèmes de qualité des données CRITIQUES. Corrigez-les d'abord.

---

### Étape 3 : Analyse des causes profondes — succès (20 minutes)

Pour chaque métrique qui a dépassé le plan de plus de 10 % :

```
/stakeholder-report

Rédigez une analyse des causes profondes pour [métrique] qui a surperformé de [X%] ce mois-ci.

Performance : [métrique] était [X] vs. plan [X] — [X]% au-dessus du plan.
Ventilation par segment : [comment cela se décompose-t-il par segments clés ?]
Chronologie : [quand la surperformance a-t-elle commencé ?]
Événements corrélés : [lancement de produit, campagne, changement de prix, etc.]

Hypothèses :
1. [cause la plus probable]
2. [deuxième hypothèse]
3. [troisième hypothèse]

Quelle hypothèse est la mieux étayée par les données ? Quelle est la répétabilité — s'agit-il d'un événement ponctuel ou d'une amélioration durable ?
```

---

### Étape 4 : Analyse des causes profondes — manques (20 minutes)

Pour chaque métrique qui a manqué le plan de plus de 10 % :

```
/stakeholder-report

Rédigez une analyse des causes profondes pour [métrique] qui a sous-performé de [X%] ce mois-ci.

[Même format que ci-dessus, mais pour le manque]

En plus : quel est le plan pour corriger le tir ? Qui en est responsable ? Quel est l'impact attendu et le délai ?
```

---

### Étape 5 : Rédiger le rapport mensuel complet (30 minutes)

```
/stakeholder-report

Rédigez le rapport de données mensuel pour [audience].

MOIS : [Mois Année]

RÉSUMÉ EXÉCUTIF : [Une phrase sur le mois — honnête]

TABLE DES MÉTRIQUES COMPLÈTE :
[Métrique] | [Ce mois] | [Mois dernier] | [MoM%] | [Année dernière] | [YoY%] | [vs. Plan]
[collez toutes les lignes]

CAUSE PROFONDE — SUCCÈS :
[Votre analyse de l'étape 3]

CAUSE PROFONDE — MANQUES :
[Votre analyse de l'étape 4]

INSIGHTS PAR COHORTE/SEGMENT :
[Collez toute analyse de cohorte ou de segment]

MISE À JOUR DES PRÉVISIONS :
[Prévisions trimestrielles/annuelles mises à jour si disponibles]

ACTIONS ET RESPONSABLES :
[Listez les actions, responsables, dates d'échéance]

Générez le rapport mensuel complet en format narratif. Incluez un tableau de métriques. Terminez par un tableau d'actions. Objectif total : 1 000 mots maximum.
```

---

### Étape 6 : Version diaporama (si nécessaire — 20 minutes)

Si le rapport mensuel est présenté lors d'une réunion du conseil d'administration ou de la direction sous forme de diapositives :

```
/stakeholder-report

Convertissez ce rapport mensuel en un plan de présentation exécutif de 5 diapositives.

[Collez votre rapport mensuel]

Structure des diapositives :
1. TITRE : [métrique unique ou verdict en une phrase]
2. TABLEAU DE BORD : [tableau des métriques clés vs. plan]
3. CE QUI A CONDUIT LA PERFORMANCE : [succès et manques, avec cause profonde]
4. ACTIONS ET RESPONSABLES : [tableau]
5. PERSPECTIVES : [points de surveillance clés du mois prochain, tout changement de prévision]

Pour chaque diapositive : titre, 3-5 points ou données clés, points de discussion pour le présentateur.
```

---

### Étape 7 : Révision et publication (10 minutes)

```
/stakeholder-report

Révision finale de ce rapport mensuel avant publication.

[Collez le rapport complet]

Vérifiez :
[ ] Chaque métrique a une comparaison (pas de chiffres orphelins sans contexte)
[ ] Chaque manque a une cause et un plan
[ ] Les actions ont des responsables et des dates d'échéance
[ ] Pas de jargon que le PDG ne comprendrait pas
[ ] Pas d'effet de style — est-ce honnête sur ce qui s'est mal passé ?
[ ] Références de dates cohérentes tout au long du rapport
```

Distribuez par e-mail, Notion, Confluence, ou document pour l'assemblée générale.

---

## Modèles de rapport par audience

### Pour le PDG (une page maximum)
```
Mois : [nom]
Statut : [Vert / Jaune / Rouge]

Les 3 choses les plus importantes à savoir :
1. [Découverte la plus importante]
2. [Deuxième découverte]
3. [Troisième découverte]

Ce que nous faisons face au manque : [1-2 phrases]
Principal point de surveillance du mois prochain : [1 phrase]
```

### Pour le conseil d'administration (section données du dossier du conseil)
```
[Tableau de performance vs. plan]
[3 points : ce qui a fonctionné, ce qui n'a pas fonctionné, ce que nous faisons]
[Prévisions révisées si modifiées]
```

### Pour l'équipe (rapport complet)
Récit mensuel complet avec toutes les sections — sans abréviation.

---

## Idées d'automatisation

### Automatisation de la comparaison semaine sur semaine

```python
# Run every Monday via cron or GitHub Actions
import pandas as pd
from datetime import datetime, timedelta

# Pull metrics (replace with your actual data source)
def pull_weekly_metrics(week_start: datetime) -> dict:
    """Pull metrics for the week starting on week_start."""
    # Your query here
    pass

current_week = pull_weekly_metrics(datetime.now() - timedelta(days=7))
prior_week = pull_weekly_metrics(datetime.now() - timedelta(days=14))

# Format for Claude prompt
metrics_text = "\n".join([
    f"- {k}: {current_week[k]} (WoW: {round(100*(current_week[k]-prior_week[k])/prior_week[k], 1)}%)"
    for k in current_week
])

# Pipe to Claude CLI
import subprocess
prompt = f"Write a weekly report for these metrics:\n{metrics_text}"
result = subprocess.run(['claude', '-p', prompt], capture_output=True, text=True)
print(result.stdout)
```

---
