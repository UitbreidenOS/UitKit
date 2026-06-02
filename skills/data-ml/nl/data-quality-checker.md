---
name: data-quality-checker
description: "Gegevenskwaliteitsaudit: identificeer nullwaarden, duplicaten, uitschieters, schemawijzigingen en typemismatches — genereer een gegevensgezondheidsrapport en herstel-SQL"
---

# Gegevenskwaliteitscontrole Vaardigheid

## Wanneer activeren
- Een nieuwe gegevensbron is ingesloten en heeft een kwaliteitsbasislijn nodig
- Belanghebbenden twijfelen aan een statistiek en u moet gegevenskwaliteit als oorzaak uitsluiten
- Bij een maandelijkse gegevensgezondheidaudit op uw productietabellen
- Vóór publicatie van een dashboard of rapport — verifieer eerst de onderliggende gegevens
- Na een schemawijziging of pipelinemigratie om regressies te controleren
- Bij onderzoek van een plotselinge statistiekpiek of -daling die gegevenskwaliteit kan zijn, geen echt signaal

## Wanneer NIET gebruiken
- Formele gegevensaudits met juridische of nalevingsimplicaties — betrek een gegevensauditor
- Realtime gegevenskwaliteitsmonitoring — stel Great Expectations, dbt-tests of Soda in voor continue monitoring
- Diepe statistische steekproeven op miljarden rijen — beperk de audit dienovereenkomstig

## Instructies

### Volledige tabelkwaliteitsaudit

```python
# Plak dit Python-sjabloon en vul uw tabel/DataFrame in

import pandas as pd
import numpy as np

def audit_dataframe(df: pd.DataFrame, table_name: str, primary_key: str = None) -> dict:
    """
    Volledige gegevenskwaliteitsaudit. Retourneert een rapport-dict.
    Vervang df door: pd.read_csv('uw_bestand.csv') of uw databasequery-resultaat.
    """
    report = {
        "table": table_name,
        "rows": len(df),
        "columns": len(df.columns),
        "issues": []
    }

    # 1. NULL-ANALYSE
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

    # 2. DUPLICAATANALYSE
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

    # 3. UITSCHIETDETECTIE (numerieke kolommen)
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

    # 4. KARDINALITEITSCONTROLE (categorische kolommen)
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

    # 5. DATUMBEREIKVALIDATIE
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

### SQL-kwaliteitsauditqueries

Gebruik deze in uw datawarehouse (PostgreSQL, BigQuery, Snowflake, Redshift):

```sql
-- 1. NULL-PERCENTAGE PER KOLOM
-- Voer uit voor elke kolom die u wilt controleren
SELECT
    COUNT(*) AS total_rows,
    COUNT(column_name) AS non_null_count,
    COUNT(*) - COUNT(column_name) AS null_count,
    ROUND(100.0 * (COUNT(*) - COUNT(column_name)) / COUNT(*), 2) AS null_pct
FROM your_table;

-- 2. DUPLICAAT-PRIMAIRE-SLEUTELCONTROLE
SELECT
    primary_key_column,
    COUNT(*) AS occurrence_count
FROM your_table
GROUP BY primary_key_column
HAVING COUNT(*) > 1
ORDER BY occurrence_count DESC;

-- 3. DUPLICAAT VOLLEDIGE RIJ CONTROLE
SELECT *, COUNT(*) AS occurrences
FROM your_table
GROUP BY ALL
HAVING COUNT(*) > 1;

-- 4. UITSCHIETDETECTIE (z-score methode)
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

-- 5. REFERENTIËLE INTEGRITEITSCONTROLE
-- Vind verweesde externe sleutels
SELECT t1.foreign_key_col
FROM child_table t1
LEFT JOIN parent_table t2 ON t1.foreign_key_col = t2.id
WHERE t2.id IS NULL;

-- 6. DATUMBEREIK GEZONDHEIDSCONTROLE
SELECT
    MIN(created_at) AS earliest_record,
    MAX(created_at) AS latest_record,
    COUNT(*) FILTER (WHERE created_at > CURRENT_TIMESTAMP) AS future_dates,
    COUNT(*) FILTER (WHERE created_at < '2000-01-01') AS suspiciously_old
FROM your_table;

-- 7. ENUM/CATEGORISCHE CONSISTENTIE
-- Bekijk alle afzonderlijke waarden en aantallen — markeer onverwachte waarden
SELECT
    status_column,
    COUNT(*) AS count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS pct
FROM your_table
GROUP BY 1
ORDER BY 2 DESC;

-- 8. WAARDEBEREIKCONTROLE
-- Markeer waarden buiten verwacht zakelijk bereik
SELECT
    COUNT(*) FILTER (WHERE price < 0) AS negative_prices,
    COUNT(*) FILTER (WHERE price > 1000000) AS suspiciously_high,
    COUNT(*) FILTER (WHERE quantity = 0) AS zero_quantity,
    MIN(price) AS min_price,
    MAX(price) AS max_price
FROM orders;
```

---

### Schemawijzigingsdetectie

```python
# Vergelijk twee momentopnamen van een tabelschema om wijzigingen te detecteren
import json

def detect_schema_drift(schema_before: dict, schema_after: dict) -> list:
    """
    schemaformaat: {"kolomnaam": "gegevenstype"}
    Voorbeeld: {"user_id": "int64", "email": "object", "created_at": "datetime64"}
    """
    issues = []

    cols_before = set(schema_before.keys())
    cols_after = set(schema_after.keys())

    # Nieuwe kolommen toegevoegd
    for col in cols_after - cols_before:
        issues.append({"type": "COLUMN_ADDED", "column": col, "new_type": schema_after[col]})

    # Kolommen verwijderd
    for col in cols_before - cols_after:
        issues.append({"type": "COLUMN_REMOVED", "column": col, "old_type": schema_before[col], "severity": "CRITICAL"})

    # Typewijzigingen
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

### Prompt voor gegevensgezondheidsrapport

```
Genereer een gegevensgezondheidsrapport op basis van deze audituitvoer.

AUDITRESULTATEN:
[Plak de uitvoer van de Python-audit of SQL-controles hierboven]

TABEL: [naam]
RIJEN: [N]
KOLOMMEN: [N]
AUDITDATUM: [datum]

Genereer een gegevensgezondheidsrapport met:

## Samenvatting voor leidinggevenden
Algehele gezondheidsscore: [bereken als % van kolommen zonder problemen, gewogen op ernst]
Status: [Groen / Geel / Rood]
Kritieke problemen die onmiddellijke actie vereisen: [N]

## Probleemoverzichtstabel
| Probleemtype | Kolom | Aantal | % van rijen | Ernst | Aanbevolen actie |
|---|---|---|---|---|---|

## Kritieke problemen (oplossen vóór gebruik van gegevens in rapporten)
[Per KRITIEK probleem: wat het is, waarom het belangrijk is, hoe het te verhelpen]

## Waarschuwingen (binnen 30 dagen oplossen)
[Per WAARSCHUWING: wat het is, het zakelijke risico als onopgelost, aanbevolen herstel]

## Herstel-SQL
[Per probleem: een SQL-query om verder te onderzoeken en/of een herstelquery]

## Monitoringsaanbevelingen
[Vermeld 3-5 dbt-tests of gegevenskwaliteitscontroles om herhaling te voorkomen]
```

---

### dbt-testaanbevelingen

```
Genereer op basis van deze gegevenskwaliteitsaudit dbt YAML-testdefinities om deze problemen automatisch te onderscheppen.

TABEL: [naam]
PRIMAIRE SLEUTEL: [kolom]
GEVONDEN PROBLEMEN:
- [vermeld problemen uit audit]

Genereer het `schema.yml`-blok met tests:

```yaml
version: 2

models:
  - name: [table_name]
    description: "[tabelbeschrijving]"
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
                where: "created_at > '2024-01-01'"  # indien van toepassing
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

### Snelle kwaliteitscontroles met één regel (snelle triage)

```python
import pandas as pd

df = pd.read_csv('uw_bestand.csv')  # of uw queryresultaat

# Snel profiel
print(df.describe(include='all'))          # Samenvattende statistieken alle kolommen
print(df.isnull().sum().sort_values(ascending=False))  # Nulltellingen gerangschikt
print(df.duplicated().sum())               # Telling dubbele rijen
print(df.dtypes)                           # Gegevenstypen — controleer op objecten die numeriek zouden moeten zijn
print(df.nunique().sort_values())          # Kardinaliteit — laag = waarschijnlijk categorisch, hoog = ID/vrije tekst
```

## Voorbeeld

**Gebruiker:** Ik heb zojuist een CSV met 50.000 orders van ons e-commerce-systeem ingesloten. De kolomnamen zijn: order_id, user_id, product_id, quantity, price, created_at, status, shipping_address. Omzetcijfers zien er hoger uit dan verwacht deze week. Help me de gegevens te auditeren.

**Verwachte uitvoer:** Python-auditscript gevuld voor die tabel. SQL-queries voor: controle op dubbele order_id (primaire sleutel), uitschietcontrole voor price (negatieve prijzen, prijzen > $10K), kwantiteitscontrole (nul of negatief), toekomstige datums in created_at, afzonderlijke waarden in statuskolom (markeer onverwachte waarden), referentiële integriteit van user_id ten opzichte van een gebruikerstabel. Na uitvoering: sjabloon gegevensgezondheidsrapport. Drie toe te voegen dbt-tests: unique/not_null op order_id, accepted_values op status, relationships op user_id. Commentaar: als uitschieters voor price worden gevonden, zou dat de hogere omzet kunnen verklaren — onderzoekt of de piek echt is of een gegevensprobleem.

---

> **Werk met ons samen:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
