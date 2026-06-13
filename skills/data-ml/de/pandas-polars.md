> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../pandas-polars.md).

# Pandas / Polars Skill

## Wann aktivieren
- Tabellarische Daten in Python bereinigen, transformieren oder aggregieren
- DataFrames zusammenführen, verknüpfen oder umstrukturieren
- Datenvalidierung oder Qualitätsprüfungen schreiben
- Zwischen Formaten konvertieren (CSV, Parquet, JSON, Excel)
- Ein neues Dataset profilieren oder erkunden
- Langsamen Pandas-Code für große Datensätze optimieren
- Pandas-Code nach Polars migrieren, um die Performance zu verbessern

## Wann NICHT verwenden
- SQL in einer Datenbank (Transformationen in die Datenbank auslagern, wenn die Daten bereits dort sind)
- Spark/verteiltes Computing (PySpark Skill für Datensätze > verfügbarer RAM verwenden)
- dbt-Modelle (SQL-basierte Transformationen in einem Warehouse)
- NumPy-Array-Operationen auf nicht-tabellarischen Daten

## Anweisungen

### Pandas — Performance-Regeln
```python
import pandas as pd
import numpy as np

# Niemals iterrows() verwenden — stattdessen vektorisieren
# Schlecht:
for idx, row in df.iterrows():
    df.at[idx, 'tax'] = row['price'] * 0.2

# Gut:
df['tax'] = df['price'] * 0.2

# .loc für labelbasierte Zugriffe, .iloc für positionsbasierte
# Niemals ohne Zuweisung verketten — verursacht SettingWithCopyWarning
df.loc[df['status'] == 'active', 'flag'] = True

# Kategorischer Datentyp für Zeichenkettenspalten mit geringer Kardinalität (große Speichereinsparung)
df['country'] = df['country'].astype('category')

# Numerische Typen für weniger Speicherverbrauch herunterstufen
df['quantity'] = pd.to_numeric(df['quantity'], downcast='integer')
df['price'] = pd.to_numeric(df['price'], downcast='float')
```

### Pandas — Aggregation und Groupby
```python
# Groupby mit mehreren Aggregationen
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

### Pandas — Zusammenführen
```python
# how= immer explizit angeben — niemals auf den Standard (inner) verlassen
result = pd.merge(
    orders,
    customers,
    on='customer_id',
    how='left',      # explizit
    validate='m:1',  # validiert Kardinalität — wirft Fehler bei Verletzung
    suffixes=('_order', '_customer')
)
```

### Polars — wann statt Pandas verwenden
Polars verwenden, wenn:
- Datensatz > 1M Zeilen (Polars ist für viele Operationen 5–100x schneller)
- Lazy Evaluation benötigt wird (Abfrageoptimierung vor der Ausführung)
- Parallelismus wichtig ist (Polars verwendet standardmäßig alle CPU-Kerne)

```python
import polars as pl

# Lazy API — Abfragen werden vor der Ausführung optimiert
result = (
    pl.scan_parquet("orders.parquet")   # Lazy Scan — noch keine Daten geladen
    .filter(pl.col("status") == "completed")
    .group_by(["region", "category"])
    .agg([
        pl.col("revenue").sum().alias("total_revenue"),
        pl.col("order_id").n_unique().alias("order_count"),
        pl.col("revenue").mean().alias("avg_order_value"),
    ])
    .sort("total_revenue", descending=True)
    .collect()   # Jetzt ausführen
)
```

### Polars — Ausdrücke (keine verkettete Indizierung)
```python
# Polars: kein SettingWithCopyWarning, keine verkettete Indizierung
df = df.with_columns([
    (pl.col("price") * 0.2).alias("tax"),
    pl.col("name").str.to_uppercase().alias("name_upper"),
    pl.when(pl.col("quantity") > 10)
      .then(pl.lit("bulk"))
      .otherwise(pl.lit("standard"))
      .alias("order_type"),
])
```

### Datenvalidierungsmuster
```python
def validate_orders(df: pd.DataFrame) -> None:
    assert df['order_id'].notna().all(), "order_id has nulls"
    assert df['order_id'].is_unique, "order_id has duplicates"
    assert (df['amount'] >= 0).all(), "amount has negative values"
    assert df['status'].isin(['pending', 'completed', 'cancelled']).all(), "invalid status values"
    assert pd.to_datetime(df['created_at'], errors='coerce').notna().all(), "created_at has invalid dates"
```

### Formatkonvertierung
```python
# Lesen
df = pd.read_parquet("data.parquet", columns=['id', 'name', 'amount'])  # Spaltenauswahl beim Lesen
df = pd.read_csv("data.csv", dtype={'id': str}, parse_dates=['created_at'])

# Schreiben — immer Parquet gegenüber CSV für große Datensätze bevorzugen
df.to_parquet("output.parquet", index=False, compression='snappy')
```

## Beispiel

**Benutzer:** Eine rohe Bestellungs-CSV bereinigen: Datentypen korrigieren, Duplikate entfernen, Nullwerte behandeln, abgeleitete Spalten hinzufügen (revenue_after_tax, order_size_bucket) und eine validierte Parquet-Datei ausgeben.

**Erwartete Ausgabe:**
- Lesen mit explizitem `dtype=` und `parse_dates=`
- Doppelte `order_id`-Zeilen löschen (letzte behalten)
- Nullwerte füllen: `quantity` → 0, `discount` → 0.0, Zeilen löschen, bei denen `customer_id` null ist
- Ableiten: `revenue_after_tax = price * quantity * (1 - discount) * 0.8`
- Einteilung: `order_size_bucket` = 'small'/<100, 'medium'/100–1000, 'large'/>1000
- Mit Assertions vor dem Schreiben validieren
- In Parquet mit Snappy-Komprimierung schreiben

---
