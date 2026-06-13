> 🇫🇷 This is the French translation. [English version](../dbt-data-pipelines.md).

# Compétence dbt Data Pipelines

## Quand activer
- Rédiger des modèles dbt (couches staging, intermediate, mart)
- Configurer les sources, refs et dépendances dbt
- Rédiger des tests dbt (tests de schéma, tests singuliers, tests génériques personnalisés)
- Configurer la structure d'un projet dbt pour un nouvel entrepôt de données
- Rédiger des macros dbt pour de la logique SQL réutilisable
- Configurer la documentation et les contrôles de fraîcheur dbt
- Déboguer des erreurs de compilation dbt ou des runs de modèles en échec
- Configurer dbt avec BigQuery, Snowflake, Redshift, ou DuckDB

## Quand NE PAS utiliser
- Pipelines ETL bruts sans entrepôt (utiliser Airflow, Prefect, ou Dagster à la place)
- Données en streaming temps réel (dbt est uniquement batch)
- Transformations en mémoire Pandas/Polars (utiliser la compétence pandas-polars)
- Ingestion de données (dbt transforme, il n'ingère pas)

## Instructions

### Architecture en couches du projet
Toujours séparer les modèles en trois couches :
```
models/
├── staging/          ← 1:1 avec les tables sources. Nettoyage léger seulement. Pas de jointures.
│   ├── stg_orders.sql
│   └── stg_customers.sql
├── intermediate/     ← Logique métier. Jointures autorisées. Pas exposé aux outils BI.
│   └── int_orders_with_customers.sql
└── marts/            ← Entités métier finales. Exposées au BI. Les agrégations sont ici.
    ├── finance/
    │   └── fct_revenue.sql
    └── marketing/
        └── dim_customers.sql
```

**Règles pour le staging :**
- Renommer les colonnes selon les conventions du projet (snake_case)
- Caster les types explicitement
- Pas de logique métier — pas de jointures, pas d'agrégations
- Préfixer avec `stg_`

**Règles pour les marts :**
- Préfixe `fct_` pour les tables de faits (événements, transactions)
- Préfixe `dim_` pour les tables de dimensions (clients, produits)
- Toujours documenter dans schema.yml

### Configuration des modèles
```sql
-- models/marts/finance/fct_revenue.sql
{{
  config(
    materialized='incremental',
    unique_key='order_id',
    on_schema_change='fail'
  )
}}

with orders as (
    select * from {{ ref('int_orders_with_customers') }}
    {% if is_incremental() %}
    where created_at > (select max(created_at) from {{ this }})
    {% endif %}
)

select
    order_id,
    customer_id,
    amount,
    created_at
from orders
```

**Choix de matérialisation :**
- `view` : par défaut — bon pour les modèles staging et intermediate
- `table` : pour les requêtes coûteuses interrogées fréquemment
- `incremental` : pour les grandes tables de faits qui croissent au fil du temps
- `ephemeral` : CTEs, pas matérialisés — à utiliser pour les transformations simples appelées une seule fois

### Tests — requis sur chaque modèle mart
```yaml
# models/marts/finance/schema.yml
version: 2

models:
  - name: fct_revenue
    description: "Une ligne par commande complétée"
    columns:
      - name: order_id
        description: "Clé primaire"
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('dim_customers')
              field: customer_id
      - name: amount
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
```

Tests minimum sur chaque modèle mart : `unique` + `not_null` sur la clé primaire, `not_null` sur les clés étrangères critiques.

### Configuration des sources
```yaml
# models/staging/sources.yml
version: 2

sources:
  - name: raw_stripe
    database: raw
    schema: stripe
    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}
    loaded_at_field: _ingested_at
    tables:
      - name: charges
        description: "Charges Stripe brutes depuis Fivetran"
```

Toujours définir `freshness` sur les sources — les données sources périmées sont un échec silencieux.

### Macros pour la logique réutilisable
```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name) %}
    ({{ column_name }} / 100.0)::numeric(10, 2)
{% endmacro %}

-- Utilisation dans un modèle
select
    {{ cents_to_dollars('amount_cents') }} as amount_dollars
from orders
```

## Exemple

**Utilisateur :** Créer des modèles staging et mart pour les données de paiements Stripe (charges, remboursements) avec tests et contrôles de fraîcheur.

**Sortie attendue :**
- `models/staging/stripe/sources.yml` — source avec contrôle de fraîcheur sur `_ingested_at`
- `models/staging/stripe/stg_stripe_charges.sql` — renommer, caster, pas de jointures
- `models/staging/stripe/stg_stripe_refunds.sql` — même pattern
- `models/marts/finance/fct_payments.sql` — joindre charges + remboursements, montant net, matérialisation incrémentale
- `models/marts/finance/schema.yml` — `unique` + `not_null` sur `charge_id`, test de relation sur `customer_id`

---
