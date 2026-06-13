> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../pandas-polars.md).

# Pandas / Polars Skill

## Wanneer te activeren
- Tabelgegevens opschonen, transformeren of aggregeren in Python
- DataFrames samenvoegen, joinen of hervormen
- Datavalidatie of kwaliteitscontroles schrijven
- Converteren tussen formaten (CSV, Parquet, JSON, Excel)
- Een nieuw dataset profileren of verkennen
- Trage Pandas-code optimaliseren voor grote datasets
- Pandas-code migreren naar Polars voor betere prestaties

## Wanneer NIET te gebruiken
- SQL in een database (push transformaties naar de database als data er al is)
- Spark/gedistribueerd computing (gebruik PySpark skill voor datasets > beschikbaar RAM)
- dbt-modellen (SQL-gebaseerde transformaties in een warehouse)
- NumPy array-operaties op niet-tabelgegevens

## Instructies

### Pandas — prestatieregels
```python
import pandas as pd
import numpy as np

# Gebruik nooit iterrows() — vectoriseer in plaats daarvan
# Slecht:
for idx, row in df.iterrows():
    df.at[idx, 'tax'] = row['price'] * 0.2

# Goed:
df['tax'] = df['price'] * 0.2

# Gebruik .loc voor labelgebaseerde toegang, .iloc voor positiegebaseerde
# Ketting nooit zonder toewijzing — veroorzaakt SettingWithCopyWarning
df.loc[df['status'] == 'active', 'flag'] = True

# Categorisch dtype voor lage-cardinaliteit string-kolommen (enorm geheugenvoordeel)
df['country'] = df['country'].astype('category')

# Numerieke typen downcasten om geheugen te verminderen
df['quantity'] = pd.to_numeric(df['quantity'], downcast='integer')
df['price'] = pd.to_numeric(df['price'], downcast='float')
```

### Pandas — aggregatie en groupby
```python
# Groupby met meerdere aggregaties
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

### Pandas — samenvoegen
```python
# Geef altijd expliciet how= aan — vertrouw nooit op de standaard (inner)
result = pd.merge(
    orders,
    customers,
    on='customer_id',
    how='left',      # expliciet
    validate='m:1',  # valideert kardinaliteit — geeft fout als geschonden
    suffixes=('_order', '_customer')
)
```

### Polars — wanneer te gebruiken in plaats van Pandas
Gebruik Polars wanneer:
- Dataset > 1M rijen (Polars is 5–100x sneller voor veel operaties)
- Je luie evaluatie nodig hebt (query-optimalisatie vóór uitvoering)
- Parallellisme belangrijk is (Polars gebruikt standaard alle CPU-kernen)

```python
import polars as pl

# Lazy API — queries worden geoptimaliseerd vóór uitvoering
result = (
    pl.scan_parquet("orders.parquet")   # Luie scan — nog geen data geladen
    .filter(pl.col("status") == "completed")
    .group_by(["region", "category"])
    .agg([
        pl.col("revenue").sum().alias("total_revenue"),
        pl.col("order_id").n_unique().alias("order_count"),
        pl.col("revenue").mean().alias("avg_order_value"),
    ])
    .sort("total_revenue", descending=True)
    .collect()   # Nu uitvoeren
)
```

### Polars — expressies (geen geketend indexeren)
```python
# Polars: geen SettingWithCopyWarning, geen geketend indexeren
df = df.with_columns([
    (pl.col("price") * 0.2).alias("tax"),
    pl.col("name").str.to_uppercase().alias("name_upper"),
    pl.when(pl.col("quantity") > 10)
      .then(pl.lit("bulk"))
      .otherwise(pl.lit("standard"))
      .alias("order_type"),
])
```

### Datavalidatiepatroon
```python
def validate_orders(df: pd.DataFrame) -> None:
    assert df['order_id'].notna().all(), "order_id has nulls"
    assert df['order_id'].is_unique, "order_id has duplicates"
    assert (df['amount'] >= 0).all(), "amount has negative values"
    assert df['status'].isin(['pending', 'completed', 'cancelled']).all(), "invalid status values"
    assert pd.to_datetime(df['created_at'], errors='coerce').notna().all(), "created_at has invalid dates"
```

### Formaatconversie
```python
# Lezen
df = pd.read_parquet("data.parquet", columns=['id', 'name', 'amount'])  # Kolomselectie bij leestijd
df = pd.read_csv("data.csv", dtype={'id': str}, parse_dates=['created_at'])

# Schrijven — gebruik altijd Parquet boven CSV voor grote datasets
df.to_parquet("output.parquet", index=False, compression='snappy')
```

## Voorbeeld

**Gebruiker:** Schoon een ruwe orders-CSV op: herstel dtypes, verwijder duplicaten, behandel nulls, voeg afgeleide kolommen toe (revenue_after_tax, order_size_bucket) en output een gevalideerd Parquet-bestand.

**Verwachte output:**
- Lezen met expliciet `dtype=` en `parse_dates=`
- Verwijder dubbele `order_id`-rijen (behoud laatste)
- Vul nulls: `quantity` → 0, `discount` → 0.0, verwijder rijen waar `customer_id` null is
- Afgeleid: `revenue_after_tax = price * quantity * (1 - discount) * 0.8`
- Bucket: `order_size_bucket` = 'small'/<100, 'medium'/100–1000, 'large'/>1000
- Valideer met assertions vóór schrijven
- Schrijf naar Parquet met snappy-compressie

---
