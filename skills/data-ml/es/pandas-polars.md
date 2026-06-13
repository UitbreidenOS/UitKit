> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../pandas-polars.md).

# Skill de Pandas / Polars

## Cuándo activar
- Limpiar, transformar o agregar datos tabulares en Python
- Hacer merge, join o reshape de DataFrames
- Escribir validaciones de datos o verificaciones de calidad
- Convertir entre formatos (CSV, Parquet, JSON, Excel)
- Perfilar o explorar un nuevo conjunto de datos
- Optimizar código lento de Pandas para grandes conjuntos de datos
- Migrar código de Pandas a Polars por rendimiento

## Cuándo NO usar
- SQL en una base de datos (empujar las transformaciones a la base de datos cuando los datos ya están allí)
- Spark/computación distribuida (usar el skill de PySpark para conjuntos de datos > RAM disponible)
- Modelos dbt (transformaciones basadas en SQL en un warehouse)
- Operaciones de arrays NumPy sobre datos no tabulares

## Instrucciones

### Pandas — reglas de rendimiento
```python
import pandas as pd
import numpy as np

# Nunca uses iterrows() — vectoriza en su lugar
# Malo:
for idx, row in df.iterrows():
    df.at[idx, 'tax'] = row['price'] * 0.2

# Bueno:
df['tax'] = df['price'] * 0.2

# Usa .loc para acceso basado en etiquetas, .iloc para acceso basado en posición
# Nunca encadenes sin asignación — causa SettingWithCopyWarning
df.loc[df['status'] == 'active', 'flag'] = True

# Dtype categórico para columnas de cadenas de baja cardinalidad (ahorro masivo de memoria)
df['country'] = df['country'].astype('category')

# Reducir tipos numéricos para reducir memoria
df['quantity'] = pd.to_numeric(df['quantity'], downcast='integer')
df['price'] = pd.to_numeric(df['price'], downcast='float')
```

### Pandas — agregación y groupby
```python
# Groupby con múltiples agregaciones
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

### Pandas — merging
```python
# Siempre especifica how= explícitamente — nunca confíes en el valor por defecto (inner)
result = pd.merge(
    orders,
    customers,
    on='customer_id',
    how='left',      # explícito
    validate='m:1',  # valida la cardinalidad — lanza excepción si se viola
    suffixes=('_order', '_customer')
)
```

### Polars — cuándo usar en lugar de Pandas
Usa Polars cuando:
- El conjunto de datos tiene > 1M filas (Polars es 5–100x más rápido para muchas operaciones)
- Necesitas evaluación lazy (optimización de consultas antes de la ejecución)
- El paralelismo importa (Polars usa todos los núcleos de CPU por defecto)

```python
import polars as pl

# API Lazy — las consultas se optimizan antes de ejecutarse
result = (
    pl.scan_parquet("orders.parquet")   # Escaneo lazy — no se cargan datos aún
    .filter(pl.col("status") == "completed")
    .group_by(["region", "category"])
    .agg([
        pl.col("revenue").sum().alias("total_revenue"),
        pl.col("order_id").n_unique().alias("order_count"),
        pl.col("revenue").mean().alias("avg_order_value"),
    ])
    .sort("total_revenue", descending=True)
    .collect()   # Ejecutar ahora
)
```

### Polars — expresiones (sin indexación encadenada)
```python
# Polars: sin SettingWithCopyWarning, sin indexación encadenada
df = df.with_columns([
    (pl.col("price") * 0.2).alias("tax"),
    pl.col("name").str.to_uppercase().alias("name_upper"),
    pl.when(pl.col("quantity") > 10)
      .then(pl.lit("bulk"))
      .otherwise(pl.lit("standard"))
      .alias("order_type"),
])
```

### Patrón de validación de datos
```python
def validate_orders(df: pd.DataFrame) -> None:
    assert df['order_id'].notna().all(), "order_id has nulls"
    assert df['order_id'].is_unique, "order_id has duplicates"
    assert (df['amount'] >= 0).all(), "amount has negative values"
    assert df['status'].isin(['pending', 'completed', 'cancelled']).all(), "invalid status values"
    assert pd.to_datetime(df['created_at'], errors='coerce').notna().all(), "created_at has invalid dates"
```

### Conversión de formatos
```python
# Leer
df = pd.read_parquet("data.parquet", columns=['id', 'name', 'amount'])  # Selección de columnas al leer
df = pd.read_csv("data.csv", dtype={'id': str}, parse_dates=['created_at'])

# Escribir — siempre usa Parquet sobre CSV para grandes conjuntos de datos
df.to_parquet("output.parquet", index=False, compression='snappy')
```

## Ejemplo

**Usuario:** Limpiar un CSV de pedidos sin procesar: corregir dtypes, eliminar duplicados, manejar nulos, agregar columnas derivadas (revenue_after_tax, order_size_bucket) y generar un archivo Parquet validado.

**Salida esperada:**
- Leer con `dtype=` explícito y `parse_dates=`
- Eliminar filas duplicadas de `order_id` (mantener el último)
- Rellenar nulos: `quantity` → 0, `discount` → 0.0, eliminar filas donde `customer_id` es nulo
- Derivar: `revenue_after_tax = price * quantity * (1 - discount) * 0.8`
- Bucket: `order_size_bucket` = 'small'/<100, 'medium'/100–1000, 'large'/>1000
- Validar con aserciones antes de escribir
- Escribir en Parquet con compresión snappy

---
