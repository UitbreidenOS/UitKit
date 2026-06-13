> 🇫🇷 This is the French translation. [English version](../data-pipeline.md).

# Starter CLAUDE.md — Projet de Pipeline de Données

Déposez ceci dans le `CLAUDE.md` de votre projet et remplissez les sections entre crochets.

---

```markdown
# [Nom du Projet] — Instructions Claude Code

## Ce que c'est
[Un paragraphe : quelles données ce pipeline traite, les systèmes sources, la destination, l'objectif métier]

## Stack
- Orchestrateur : [Airflow / Prefect / Dagster / dbt Cloud]
- Transformation : [dbt / PySpark / Pandas / Polars]
- Entrepôt : [BigQuery / Snowflake / Redshift / DuckDB]
- Ingestion : [Fivetran / Airbyte / personnalisé]
- Langage : [Python / SQL]
- Infra : [Terraform sur AWS / GCP / Azure]

## Structure du projet
dbt/ (si utilisant dbt)
├── models/
│   ├── staging/      ← 1:1 avec les tables sources, nettoyage léger seulement
│   ├── intermediate/ ← Logique métier, jointures
│   └── marts/        ← Entités métier finales (préfixes fct_, dim_)
├── macros/           ← Macros SQL réutilisables
├── seeds/            ← Données de référence statiques
└── tests/            ← Tests singuliers personnalisés

pipelines/ (si utilisant Airflow/Prefect/Dagster)
├── dags/ / flows/    ← Définitions de pipeline
├── operators/        ← Opérateurs/tâches personnalisés
└── utils/            ← Utilitaires partagés

## Conventions de données
- Modèles staging : renommer en snake_case, caster les types, pas de jointures, pas de logique métier
- Tables de faits : préfixe fct_, une ligne par événement/transaction
- Tables de dimensions : préfixe dim_, une ligne par entité
- Ne jamais utiliser SELECT * dans les requêtes de production
- Tous les modèles mart doivent avoir des tests unique + not_null sur la clé primaire
- Contrôles de fraîcheur de source requis sur toutes les sources

## Décisions (ne pas re-discuter)
- [Stratégie incrémentale vs. rafraîchissement complet pour les tables de faits]
- [Fuseau horaire : tous les timestamps en UTC]
- [Grain : ce que représente une ligne dans chaque table mart]
- [Stratégie de gestion des données en retard]

## Exigences de tests
- Chaque modèle staging : not_null sur la clé primaire
- Chaque modèle mart : unique + not_null sur la clé primaire, relationships sur les clés étrangères
- Fraîcheur des sources : avertir à [X] heures, erreur à [Y] heures

## Règles de performance
- Partitionner les grandes tables par date — toujours filtrer sur la colonne de partition
- Utiliser des modèles incrémentaux pour les tables > [X] lignes
- Ne jamais exécuter des rafraîchissements complets en production sans approbation
- Clés cluster/tri : [spécifier si utilisant Snowflake/Redshift]

## Commandes
- dbt run --select staging — exécuter la couche staging
- dbt test — exécuter tous les tests
- dbt docs generate && dbt docs serve — prévisualiser la documentation
- dbt source freshness — vérifier la fraîcheur des données sources

## Ne jamais faire
- Ne jamais mettre de logique métier dans les modèles staging
- Ne jamais coder en dur des dates — utiliser des variables ou des macros dbt
- Ne jamais committer de vrais credentials — utiliser des variables d'environnement ou un gestionnaire de secrets
- Ne jamais exécuter dbt run en production sans que dbt test passe d'abord
```

---
