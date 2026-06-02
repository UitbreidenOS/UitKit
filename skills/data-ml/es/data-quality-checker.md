---
name: data-quality-checker
description: "Auditoría de calidad de datos: identificar nulos, duplicados, valores atípicos, deriva de esquema y discordancias de tipo — generar un informe de salud de datos y SQL de remediación"
---

# Habilidad: Verificador de Calidad de Datos

## Cuándo activar
- Se ha ingestado una nueva fuente de datos y se necesita una línea base de calidad
- Las partes interesadas cuestionan una métrica y se necesita descartar la calidad de los datos como causa
- Ejecutar una auditoría mensual de salud de datos en las tablas de producción
- Antes de publicar un panel o informe — verificar primero los datos subyacentes
- Después de un cambio de esquema o migración de pipeline para detectar regresiones
- Investigar un pico o caída repentina en una métrica que podría ser calidad de datos, no una señal real

## Cuándo NO usar
- Auditorías de datos formales con implicaciones legales o de cumplimiento — involucre a un auditor de datos
- Monitoreo de calidad de datos en tiempo real — configure Great Expectations, pruebas dbt o Soda para monitoreo continuo
- Muestreo estadístico profundo en miles de millones de filas — delimite la auditoría adecuadamente

## Instrucciones

### Auditoría completa de calidad de tabla

```python
# Paste this Python template and fill in your table/DataFrame

import pandas as pd
import numpy as np

def audit_dataframe(df: pd.DataFrame, table_name: str, primary_key: str = None) -> dict:
    """
    Full data quality audit. Returns a report dict.
    Replace df with: pd.read_csv('your_file.csv') or your database query result.
    """
    report = {
        "table": table_name,
        "rows": len(df),
        "columns": len(df.columns),
        "issues": []
    }

    # 1. NULL ANALYSIS
    null_counts = df.isnull().sum()
    null_pct = (null_counts / len(df) * 100).round(2)
    for col in df.columns:
        if null_counts[col] > 0:
            severity = "CRITICAL" if null_pct[col] > 10 else "WARNING" if null_pct[col] > 1 else "INFO"
            report["issues"].append({
                "type": "NULL",
                "column": col,
                "count": int(null_counts[col]),
                "pct": float(null_pct[col]),
                "severity": severity
            })

    # 2. DUPLICATE ANALYSIS
    if primary_key:
        dup_count = df.duplicated(subset=[primary_key]).sum()
        if dup_count > 0:
            report["issues"].append({
                "type": "DUPLICATE_PK",
                "column": primary_key,
                "count": int(dup_count),
                "severity": "CRITICAL"
            })

    full_dups = df.duplicated().sum()
    if full_dups > 0:
        report["issues"].append({
            "type": "DUPLICATE_ROWS",
            "count": int(full_dups),
            "severity": "WARNING"
        })

    # 3. OUTLIER DETECTION (numeric columns)
    for col in df.select_dtypes(include=[np.number]).columns:
        q1, q3 = df[col].quantile([0.25, 0.75])
        iqr = q3 - q1
        lower_fence = q1 - 3 * iqr
        upper_fence = q3 + 3 * iqr
        outliers = df[(df[col] < lower_fence) | (df[col] > upper_fence)]
        if len(outliers) > 0:
            report["issues"].append({
                "type": "OUTLIER",
                "column": col,
                "count": len(outliers),
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "p25": float(q1),
                "p75": float(q3),
                "upper_fence": float(upper_fence),
                "lower_fence": float(lower_fence),
                "severity": "WARNING"
            })

    # 4. CARDINALITY CHECK (categorical columns)
    for col in df.select_dtypes(include=['object']).columns:
        unique_count = df[col].nunique()
        total = len(df)
        if unique_count == total and total > 100:
            report["issues"].append({
                "type": "HIGH_CARDINALITY",
                "column": col,
                "unique_count": unique_count,
                "note": "All values unique — may be a free-text field or ID column, not a category",
                "severity": "INFO"
            })
        if unique_count == 1:
            report["issues"].append({
                "type": "SINGLE_VALUE",
                "column": col,
                "value": df[col].iloc[0],
                "severity": "WARNING"
            })

    # 5. DATE RANGE VALIDATION
    for col in df.select_dtypes(include=['datetime64']).columns:
        min_date = df[col].min()
        max_date = df[col].max()
        future_dates = (df[col] > pd.Timestamp.now()).sum()
        if future_dates > 0:
            report["issues"].append({
                "type": "FUTURE_DATE",
                "column": col,
                "count": int(future_dates),
                "severity": "WARNING"
            })

    return report
```

---

### Consultas SQL de auditoría de calidad

Úselas en su almacén de datos (PostgreSQL, BigQuery, Snowflake, Redshift):

```sql
-- 1. NULL RATE PER COLUMN
-- Run for each column you want to check
SELECT
    COUNT(*) AS total_rows,
    COUNT(column_name) AS non_null_count,
    COUNT(*) - COUNT(column_name) AS null_count,
    ROUND(100.0 * (COUNT(*) - COUNT(column_name)) / COUNT(*), 2) AS null_pct
FROM your_table;

-- 2. DUPLICATE PRIMARY KEY CHECK
SELECT
    primary_key_column,
    COUNT(*) AS occurrence_count
FROM your_table
GROUP BY primary_key_column
HAVING COUNT(*) > 1
ORDER BY occurrence_count DESC;

-- 3. DUPLICATE FULL ROW CHECK
SELECT *, COUNT(*) AS occurrences
FROM your_table
GROUP BY ALL
HAVING COUNT(*) > 1;

-- 4. OUTLIER DETECTION (z-score method)
WITH stats AS (
    SELECT
        AVG(numeric_column) AS mean_val,
        STDDEV(numeric_column) AS std_val
    FROM your_table
)
SELECT
    id,
    numeric_column,
    ABS(numeric_column - stats.mean_val) / NULLIF(stats.std_val, 0) AS z_score
FROM your_table, stats
WHERE ABS(numeric_column - stats.mean_val) / NULLIF(stats.std_val, 0) > 3
ORDER BY z_score DESC;

-- 5. REFERENTIAL INTEGRITY CHECK
-- Find orphaned foreign keys
SELECT t1.foreign_key_col
FROM child_table t1
LEFT JOIN parent_table t2 ON t1.foreign_key_col = t2.id
WHERE t2.id IS NULL;

-- 6. DATE RANGE SANITY CHECK
SELECT
    MIN(created_at) AS earliest_record,
    MAX(created_at) AS latest_record,
    COUNT(*) FILTER (WHERE created_at > CURRENT_TIMESTAMP) AS future_dates,
    COUNT(*) FILTER (WHERE created_at < '2000-01-01') AS suspiciously_old
FROM your_table;

-- 7. ENUM/CATEGORICAL CONSISTENCY
-- See all distinct values and counts — flag unexpected values
SELECT
    status_column,
    COUNT(*) AS count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS pct
FROM your_table
GROUP BY 1
ORDER BY 2 DESC;

-- 8. VALUE RANGE CHECK
-- Flag values outside expected business range
SELECT
    COUNT(*) FILTER (WHERE price < 0) AS negative_prices,
    COUNT(*) FILTER (WHERE price > 1000000) AS suspiciously_high,
    COUNT(*) FILTER (WHERE quantity = 0) AS zero_quantity,
    MIN(price) AS min_price,
    MAX(price) AS max_price
FROM orders;
```

---

### Detección de deriva de esquema

```python
# Compare two snapshots of a table schema to detect drift
import json

def detect_schema_drift(schema_before: dict, schema_after: dict) -> list:
    """
    schema format: {"column_name": "data_type"}
    Example: {"user_id": "int64", "email": "object", "created_at": "datetime64"}
    """
    issues = []

    cols_before = set(schema_before.keys())
    cols_after = set(schema_after.keys())

    # New columns added
    for col in cols_after - cols_before:
        issues.append({"type": "COLUMN_ADDED", "column": col, "new_type": schema_after[col]})

    # Columns removed
    for col in cols_before - cols_after:
        issues.append({"type": "COLUMN_REMOVED", "column": col, "old_type": schema_before[col], "severity": "CRITICAL"})

    # Type changes
    for col in cols_before & cols_after:
        if schema_before[col] != schema_after[col]:
            issues.append({
                "type": "TYPE_CHANGED",
                "column": col,
                "old_type": schema_before[col],
                "new_type": schema_after[col],
                "severity": "CRITICAL" if "int" in schema_before[col] and "object" in schema_after[col] else "WARNING"
            })

    return issues
```

---

### Prompt de informe de salud de datos

```
Generate a data health report based on this audit output.

AUDIT RESULTS:
[Paste the output from the Python audit or SQL checks above]

TABLE: [name]
ROWS: [N]
COLUMNS: [N]
AUDIT DATE: [date]

Generate a data health report with:

## Executive Summary
Overall health score: [calculate as % of columns with no issues, weighted by severity]
Status: [Green / Yellow / Red]
Critical issues requiring immediate action: [N]

## Issue Summary Table
| Issue Type | Column | Count | % of Rows | Severity | Recommended Action |
|---|---|---|---|---|---|

## Critical Issues (resolve before using data in reports)
[For each CRITICAL issue: what it is, why it matters, how to fix it]

## Warnings (resolve within 30 days)
[For each WARNING: what it is, the business risk if left unfixed, recommended fix]

## Remediation SQL
[For each issue, provide a SQL query to investigate further and/or a fix query]

## Monitoring Recommendations
[List 3-5 dbt tests or data quality checks to add to prevent recurrence]
```

---

### Recomendaciones de pruebas dbt

```
Based on this data quality audit, generate dbt YAML test definitions to catch these issues automatically.

TABLE: [name]
PRIMARY KEY: [column]
ISSUES FOUND:
- [list issues from audit]

Generate the `schema.yml` block with tests:

```yaml
version: 2

models:
  - name: [table_name]
    description: "[table description]"
    columns:
      - name: [primary_key]
        tests:
          - unique
          - not_null
      - name: [column_with_nulls]
        tests:
          - not_null:
              severity: warn
              config:
                where: "created_at > '2024-01-01'"  # if applicable
      - name: [categorical_column]
        tests:
          - accepted_values:
              values: ['value1', 'value2', 'value3']
      - name: [foreign_key_col]
        tests:
          - relationships:
              to: ref('parent_table')
              field: id
```
```

---

### Comprobaciones de calidad rápidas (triaje rápido)

```python
import pandas as pd

df = pd.read_csv('your_file.csv')  # or your query result

# Quick profile
print(df.describe(include='all'))          # Summary stats all columns
print(df.isnull().sum().sort_values(ascending=False))  # Null counts ranked
print(df.duplicated().sum())               # Duplicate row count
print(df.dtypes)                           # Data types — check for objects that should be numerics
print(df.nunique().sort_values())          # Cardinality — low = likely categorical, high = ID/free text
```

## Ejemplo

**Usuario:** Acabo de ingestar un CSV de 50.000 pedidos de nuestro sistema de comercio electrónico. Los nombres de las columnas son: order_id, user_id, product_id, quantity, price, created_at, status, shipping_address. Los números de ingresos parecen más altos de lo esperado esta semana. Ayúdame a auditar los datos.

**Resultado esperado:** Script de auditoría Python completado para esa tabla. Consultas SQL para: verificación de order_id duplicado (clave primaria), verificación de valores atípicos de precio (precios negativos, precios > 10.000 $), verificación de cantidad (cero o negativa), fechas futuras en created_at, valores distintos de la columna de estado (marcar valores inesperados), integridad referencial de user_id frente a una tabla de usuarios. Después de ejecutar: plantilla de informe de salud de datos. Tres pruebas dbt a agregar: unique/not_null en order_id, accepted_values en status, relationships en user_id. Comentario: si se encuentran valores atípicos de precio, eso explicaría los ingresos elevados — investiga si el pico es real o un problema de calidad de datos.

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
