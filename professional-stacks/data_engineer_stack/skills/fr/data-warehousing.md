# Entreposage de Données

## Quand activer

Conception de schémas en étoile, tableaux OLAP, stratégies de partitionnement ou optimisation des coûts.

## Quand NE PAS utiliser

Non adapté pour la conception OLTP ; concentrez-vous sur les charges de travail analytiques.

## Instructions

1. Concevoir les tables de dimension et de faits
2. Planifier le partitionnement (date, région, client)
3. Estimer le stockage et les coûts
4. Documenter la cadence d'actualisation

## Exemple

**Scénario :** Conception d'un data warehouse pour l'analyse de ventes multi-régions.

```sql
-- Table de faits : ventes quotidiennes
CREATE TABLE fact_sales (
    sale_key BIGINT PRIMARY KEY,
    date_key INT,
    customer_key INT,
    product_key INT,
    region_key INT,
    amount_sold DECIMAL(15,2),
    quantity INT
)
PARTITION BY RANGE (date_key)
CLUSTER BY (region_key, customer_key);

-- Tables de dimensions
CREATE TABLE dim_customer (
    customer_key INT,
    customer_id VARCHAR,
    region VARCHAR,
    segment VARCHAR,
    inactive_date DATE
);

CREATE TABLE dim_date (
    date_key INT,
    date DATE,
    month INT,
    quarter INT,
    year INT
);
```

**Coût estimé :** 500 GB/an; partitions par mois; actualisation quotidienne nocturne.
