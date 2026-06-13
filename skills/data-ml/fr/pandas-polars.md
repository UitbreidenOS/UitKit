> 🇫🇷 This is the French translation. [English version](../pandas-polars.md).

# Compétence Pandas / Polars

## Quand activer
- Nettoyer, transformer ou agréger des données tabulaires en Python
- Fusionner, joindre ou remodeler des DataFrames
- Rédiger des validations ou des contrôles de qualité de données
- Convertir entre des formats (CSV, Parquet, JSON, Excel)
- Profiler ou explorer un nouveau jeu de données
- Optimiser du code Pandas lent pour de grands jeux de données
- Migrer du code Pandas vers Polars pour les performances

## Quand NE PAS utiliser
- SQL dans une base de données (pousser les transformations vers la base quand les données y sont déjà)
- Spark/calcul distribué (utiliser la compétence PySpark pour les jeux de données > RAM disponible)
- Modèles dbt (transformations SQL dans un entrepôt de données)
- Opérations sur des tableaux NumPy pour des données non tabulaires

## Instructions

### Pandas — règles de performance
```python
import pandas as pd
import numpy as np

# Ne jamais utiliser iterrows() — vectoriser à la place
# Mauvais :
for idx, row in df.iterrows():
    df.at[idx, 'tax'] = row['price'] * 0.2

# Bon :
df['tax'] = df['price'] * 0.2

# Utiliser .loc pour l'accès par label, .iloc pour l'accès par position
# Ne jamais chaîner sans assignation — cause SettingWithCopyWarning
df.loc[df['status'] == 'active', 'flag'] = True

# Type catégoriel pour les colonnes de chaînes à faible cardinalité (énorme économie mémoire)
df['country'] = df['country'].astype('category')

# Réduire les types numériques pour économiser la mémoire
df['quantity'] = pd.to_numeric(df['quantity'], downcast='integer')
df['price'] = pd.to_numeric(df['price'], downcast='float')
```

### Pandas — agrégation et groupby
```python
# Groupby avec plusieurs agrégations
summary = (
    df.groupby(['region', 'category'])
    .agg(
        total_revenue=('revenue', 'sum'),
        order_count=('order_id', 'nunique'),
        avg_order_value=('revenue', 'mean'),
    )
    .reset_index()
    .sort_values('total_revenue', ascending=False)
)
```

### Pandas — fusion
```python
# Toujours spécifier how= explicitement — ne jamais se fier au défaut (inner)
result = pd.merge(
    orders,
    customers,
    on='customer_id',
    how='left',      # explicite
    validate='m:1',  # valide la cardinalité — lève une exception si violée
    suffixes=('_order', '_customer')
)
```

### Polars — quand l'utiliser à la place de Pandas
Utiliser Polars quand :
- Jeu de données > 1M lignes (Polars est 5–100x plus rapide pour de nombreuses opérations)
- Vous avez besoin d'évaluation paresseuse (optimisation des requêtes avant exécution)
- Le parallélisme est important (Polars utilise tous les cœurs CPU par défaut)

```python
import polars as pl

# API Lazy — les requêtes sont optimisées avant exécution
result = (
    pl.scan_parquet("orders.parquet")   # Scan paresseux — aucune donnée chargée encore
    .filter(pl.col("status") == "completed")
    .group_by(["region", "category"])
    .agg([
        pl.col("revenue").sum().alias("total_revenue"),
        pl.col("order_id").n_unique().alias("order_count"),
        pl.col("revenue").mean().alias("avg_order_value"),
    ])
    .sort("total_revenue", descending=True)
    .collect()   # Exécuter maintenant
)
```

### Polars — expressions (pas d'indexation chaînée)
```python
# Polars : pas de SettingWithCopyWarning, pas d'indexation chaînée
df = df.with_columns([
    (pl.col("price") * 0.2).alias("tax"),
    pl.col("name").str.to_uppercase().alias("name_upper"),
    pl.when(pl.col("quantity") > 10)
      .then(pl.lit("bulk"))
      .otherwise(pl.lit("standard"))
      .alias("order_type"),
])
```

### Pattern de validation des données
```python
def validate_orders(df: pd.DataFrame) -> None:
    assert df['order_id'].notna().all(), "order_id has nulls"
    assert df['order_id'].is_unique, "order_id has duplicates"
    assert (df['amount'] >= 0).all(), "amount has negative values"
    assert df['status'].isin(['pending', 'completed', 'cancelled']).all(), "invalid status values"
    assert pd.to_datetime(df['created_at'], errors='coerce').notna().all(), "created_at has invalid dates"
```

### Conversion de format
```python
# Lecture
df = pd.read_parquet("data.parquet", columns=['id', 'name', 'amount'])  # Sélection de colonnes à la lecture
df = pd.read_csv("data.csv", dtype={'id': str}, parse_dates=['created_at'])

# Écriture — toujours utiliser Parquet plutôt que CSV pour les grands jeux de données
df.to_parquet("output.parquet", index=False, compression='snappy')
```

## Exemple

**Utilisateur :** Nettoyer un CSV de commandes brutes : corriger les types, supprimer les doublons, gérer les valeurs nulles, ajouter des colonnes dérivées (revenue_after_tax, order_size_bucket) et produire un fichier Parquet validé.

**Sortie attendue :**
- Lecture avec `dtype=` et `parse_dates=` explicites
- Supprimer les lignes `order_id` en doublon (garder la dernière)
- Remplir les nulls : `quantity` → 0, `discount` → 0.0, supprimer les lignes où `customer_id` est null
- Dériver : `revenue_after_tax = price * quantity * (1 - discount) * 0.8`
- Bucket : `order_size_bucket` = 'small'/<100, 'medium'/100–1000, 'large'/>1000
- Valider avec des assertions avant l'écriture
- Écrire en Parquet avec compression snappy

---
