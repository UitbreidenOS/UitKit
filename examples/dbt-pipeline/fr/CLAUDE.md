> 🇫🇷 Version française. [English version](../CLAUDE.md).

# CLAUDE.md — Pipeline de données dbt

Un projet dbt de production pour transformer les données brutes en tables prêtes pour l'analytique. Suit l'architecture en médaillon (raw → staging → marts) avec une couverture de tests complète et une intégration CI.

---

## Stack technique

| Couche | Technologie |
|-------|-----------|
| Transformation | dbt Core |
| Entrepôt | Snowflake (ou BigQuery / DuckDB en local) |
| Orchestration | Airflow / Dagster / dbt Cloud |
| Tests | dbt tests + Great Expectations |
| Documentation | dbt docs |
| CI | GitHub Actions + SQLFluff |

---

## Commandes principales

```bash
dbt debug                        # Tester la connexion
dbt run                          # Exécuter tous les modèles
dbt run --select staging.*       # Exécuter une couche
dbt run --select +orders         # Exécuter orders et tous les modèles en amont
dbt run --select orders+         # Exécuter orders et tous les modèles en aval
dbt test                         # Lancer tous les tests
dbt test --select orders         # Tester un modèle
dbt build                        # run + test ensemble (recommandé en CI)
dbt docs generate && dbt docs serve   # Générer et afficher la documentation
dbt source freshness             # Vérifier la fraîcheur des données sources
sqlfluff lint models/            # Linter le SQL
```

---

## Structure du projet

```
dbt_project/
├── dbt_project.yml              # Configuration du projet, configs des modèles par chemin
├── profiles.yml                 # Profils de connexion (gitignored — utiliser les variables d'env)
├── packages.yml                 # Packages dbt Hub
├── models/
│   ├── staging/                 # 1:1 avec les tables sources, nettoyage léger uniquement
│   │   ├── _sources.yml         # Définitions des sources + vérifications de fraîcheur
│   │   ├── _staging.yml         # Documentation + tests des modèles staging
│   │   ├── stg_orders.sql
│   │   └── stg_customers.sql
│   ├── intermediate/            # Optionnel : jointures/pivots complexes avant les marts
│   │   └── int_order_items.sql
│   └── marts/
│       ├── _marts.yml           # Documentation + tests des marts
│       ├── core/
│       │   ├── dim_customers.sql
│       │   └── fct_orders.sql
│       └── finance/
│           └── fct_revenue.sql
├── tests/                       # Tests singuliers personnalisés (fichiers SQL)
├── macros/                      # Macros Jinja réutilisables
├── seeds/                       # Tables de référence CSV statiques
├── snapshots/                   # Snapshots SCD de type 2
└── analyses/                    # Requêtes d'analyse ad-hoc (non matérialisées)
```

---

## Conventions des modèles

### Modèles staging — nettoyage léger uniquement
```sql
-- models/staging/stg_orders.sql
-- Staging : renommage des colonnes, cast des types, pas de jointures, pas de logique métier

with source as (
    select * from {{ source('raw', 'orders') }}
),

renamed as (
    select
        order_id::varchar       as order_id,
        customer_id::varchar    as customer_id,
        created_at::timestamp   as created_at,
        status::varchar         as status,
        amount_cents::integer   as amount_cents,
        amount_cents / 100.0    as amount_usd,

        -- Métadonnées
        _fivetran_synced        as _loaded_at

    from source
    where order_id is not null     -- Ne filtrer que les lignes manifestement invalides en staging
)

select * from renamed
```

### Table de faits — la logique métier va ici
```sql
-- models/marts/core/fct_orders.sql
{{
    config(
        materialized='incremental',
        unique_key='order_id',
        on_schema_change='sync_all_columns'
    )
}}

with orders as (
    select * from {{ ref('stg_orders') }}
),

customers as (
    select * from {{ ref('dim_customers') }}
),

final as (
    select
        orders.order_id,
        orders.customer_id,
        customers.customer_segment,
        orders.created_at,
        orders.status,
        orders.amount_usd,
        case
            when orders.status = 'complete' then orders.amount_usd
            else 0
        end as completed_revenue_usd
    from orders
    left join customers using (customer_id)

    {% if is_incremental() %}
        where orders.created_at > (select max(created_at) from {{ this }})
    {% endif %}
)

select * from final
```

### Tests YAML et documentation
```yaml
# models/marts/_marts.yml
version: 2

models:
  - name: fct_orders
    description: Une ligne par commande. Source de vérité pour les métriques de commandes.
    columns:
      - name: order_id
        description: Identifiant unique de la commande
        data_tests:
          - unique
          - not_null
      - name: customer_id
        data_tests:
          - not_null
          - relationships:
              to: ref('dim_customers')
              field: customer_id
      - name: amount_usd
        data_tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 100000
      - name: status
        data_tests:
          - accepted_values:
              values: ['pending', 'complete', 'cancelled', 'refunded']
```

### Fraîcheur des sources
```yaml
# models/staging/_sources.yml
version: 2

sources:
  - name: raw
    database: raw_db
    schema: public
    freshness:
      warn_after: {count: 6, period: hour}
      error_after: {count: 24, period: hour}
    loaded_at_field: _fivetran_synced

    tables:
      - name: orders
        description: Commandes brutes issues de la base de données transactionnelle
      - name: customers
```

### Macros
```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name, precision=2) %}
    round({{ column_name }} / 100.0, {{ precision }})
{% endmacro %}

-- Utilisation dans un modèle :
-- {{ cents_to_dollars('amount_cents') }} as amount_usd
```

---

## Configuration dbt_project.yml

```yaml
name: 'dbt_project'
version: '1.0.0'
profile: 'default'

model-paths: ["models"]
test-paths: ["tests"]
macro-paths: ["macros"]
seed-paths: ["seeds"]
snapshot-paths: ["snapshots"]

models:
  dbt_project:
    staging:
      +materialized: view          # Staging = vues (économique, toujours à jour)
      +schema: staging
    intermediate:
      +materialized: ephemeral     # Intermediate = éphémère (aucune table créée)
    marts:
      +materialized: table         # Marts = tables (requêtes rapides)
      +schema: marts
      core:
        fct_orders:
          +materialized: incremental
```

---

## Anti-patterns — À ne PAS faire

- **Ne jamais mettre de logique métier dans les modèles staging** — le staging sert uniquement au renommage et au cast
- **Ne jamais utiliser `SELECT *` dans les marts** — toujours lister les colonnes explicitement
- **Ne jamais faire de jointures en staging** — le staging est toujours en 1:1 avec une table source
- **Ne jamais omettre les tests `unique` + `not_null` sur les clés primaires** — chaque modèle en a besoin au minimum
- **Ne jamais coder en dur des dates** — utiliser `current_date` ou les passer via des variables dbt : `{{ var('start_date') }}`
- **Ne jamais committer `profiles.yml`** — utiliser des variables d'environnement : `DBT_ENV_SECRET_SNOWFLAKE_PASSWORD`
- **Ne jamais utiliser `dbt run` en CI** — utiliser `dbt build` (run + tests ensemble, échec rapide)

---

## Pipeline CI (GitHub Actions)

```yaml
# .github/workflows/dbt.yml
- name: Run dbt build
  run: |
    dbt deps
    dbt source freshness
    dbt build --target ci --select state:modified+  # Uniquement les modèles modifiés + en aval
  env:
    DBT_ENV_SECRET_SNOWFLAKE_PASSWORD: ${{ secrets.SNOWFLAKE_PASSWORD }}
```

---

## Ajouter un nouveau modèle de mart

1. Créer `models/marts/<domaine>/fct_<nom>.sql` ou `dim_<nom>.sql`
2. Ajouter dans `models/marts/_marts.yml` avec la description + les tests de colonnes
3. Ajouter au minimum `unique` + `not_null` sur la clé primaire
4. Exécuter `dbt build --select fct_<nom>` pour tester en local
5. Exécuter `dbt docs generate` pour mettre à jour le site de documentation
