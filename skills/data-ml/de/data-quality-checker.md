---
name: data-quality-checker
description: "Datenqualitätsprüfung: Nullwerte, Duplikate, Ausreißer, Schema-Drift und Typ-Abweichungen identifizieren — Datenqualitätsbericht und Sanierungs-SQL generieren"
---

# Skill: Datenqualitätsprüfung

## Wann aktivieren
- Eine neue Datenquelle wurde aufgenommen und benötigt eine Qualitäts-Baseline
- Stakeholder stellen eine Metrik in Frage und Datenqualität als Ursache muss ausgeschlossen werden
- Durchführung eines monatlichen Datenqualitäts-Audits auf Produktionstabellen
- Vor der Veröffentlichung eines Dashboards oder Berichts — zuerst die Basisdaten verifizieren
- Nach einer Schema-Änderung oder Pipeline-Migration zur Prüfung auf Regressionen
- Untersuchung eines plötzlichen Metrikanstiegs oder -rückgangs, der Datenqualität statt echtem Signal sein könnte

## Wann NICHT verwenden
- Formelle Datenaudits mit rechtlichen oder Compliance-Implikationen — einen Datenauditor einbeziehen
- Echtzeit-Datenqualitätsüberwachung — Great Expectations, dbt-Tests oder Soda für kontinuierliche Überwachung einrichten
- Tiefes statistisches Sampling auf Milliarden von Zeilen — den Audit-Umfang angemessen begrenzen

## Anweisungen

### Vollständiger Tabellen-Qualitätsaudit

```python
# Diese Python-Vorlage einfügen und Tabelle/DataFrame ausfüllen

import pandas as pd
import numpy as np

def audit_dataframe(df: pd.DataFrame, table_name: str, primary_key: str = None) -> dict:
    """
    Vollständiger Datenqualitätsaudit. Gibt ein Report-Dict zurück.
    df ersetzen durch: pd.read_csv('your_file.csv') oder das Ergebnis einer Datenbankabfrage.
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

    # 2. DUPLIKAT-ANALYSE
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

    # 3. AUSREISSER-ERKENNUNG (numerische Spalten)
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

    # 4. KARDINALITÄTSPRÜFUNG (kategoriale Spalten)
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

    # 5. DATUMSBEREICHSVALIDIERUNG
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

### SQL-Qualitätsaudit-Abfragen

Diese im Data Warehouse verwenden (PostgreSQL, BigQuery, Snowflake, Redshift):

```sql
-- 1. NULL-RATE PRO SPALTE
-- Für jede zu prüfende Spalte ausführen
SELECT
    COUNT(*) AS total_rows,
    COUNT(column_name) AS non_null_count,
    COUNT(*) - COUNT(column_name) AS null_count,
    ROUND(100.0 * (COUNT(*) - COUNT(column_name)) / COUNT(*), 2) AS null_pct
FROM your_table;

-- 2. DUPLIKAT-PRIMÄRSCHLÜSSEL-PRÜFUNG
SELECT
    primary_key_column,
    COUNT(*) AS occurrence_count
FROM your_table
GROUP BY primary_key_column
HAVING COUNT(*) > 1
ORDER BY occurrence_count DESC;

-- 3. DUPLIKAT-VOLLZEILEN-PRÜFUNG
SELECT *, COUNT(*) AS occurrences
FROM your_table
GROUP BY ALL
HAVING COUNT(*) > 1;

-- 4. AUSREISSER-ERKENNUNG (Z-Score-Methode)
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

-- 5. REFERENTIELLE INTEGRITÄTSPRÜFUNG
-- Verwaiste Fremdschlüssel finden
SELECT t1.foreign_key_col
FROM child_table t1
LEFT JOIN parent_table t2 ON t1.foreign_key_col = t2.id
WHERE t2.id IS NULL;

-- 6. DATUMSBEREICH-PLAUSIBILITÄTSPRÜFUNG
SELECT
    MIN(created_at) AS earliest_record,
    MAX(created_at) AS latest_record,
    COUNT(*) FILTER (WHERE created_at > CURRENT_TIMESTAMP) AS future_dates,
    COUNT(*) FILTER (WHERE created_at < '2000-01-01') AS suspiciously_old
FROM your_table;

-- 7. ENUM/KATEGORIALE KONSISTENZ
-- Alle eindeutigen Werte und Anzahlen anzeigen — unerwartete Werte kennzeichnen
SELECT
    status_column,
    COUNT(*) AS count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS pct
FROM your_table
GROUP BY 1
ORDER BY 2 DESC;

-- 8. WERTEBEREICHSPRÜFUNG
-- Werte außerhalb des erwarteten Geschäftsbereichs kennzeichnen
SELECT
    COUNT(*) FILTER (WHERE price < 0) AS negative_prices,
    COUNT(*) FILTER (WHERE price > 1000000) AS suspiciously_high,
    COUNT(*) FILTER (WHERE quantity = 0) AS zero_quantity,
    MIN(price) AS min_price,
    MAX(price) AS max_price
FROM orders;
```

---

### Schema-Drift-Erkennung

```python
# Zwei Snapshots eines Tabellen-Schemas vergleichen, um Drift zu erkennen
import json

def detect_schema_drift(schema_before: dict, schema_after: dict) -> list:
    """
    Schema-Format: {"column_name": "data_type"}
    Beispiel: {"user_id": "int64", "email": "object", "created_at": "datetime64"}
    """
    issues = []

    cols_before = set(schema_before.keys())
    cols_after = set(schema_after.keys())

    # Neue Spalten hinzugefügt
    for col in cols_after - cols_before:
        issues.append({"type": "COLUMN_ADDED", "column": col, "new_type": schema_after[col]})

    # Spalten entfernt
    for col in cols_before - cols_after:
        issues.append({"type": "COLUMN_REMOVED", "column": col, "old_type": schema_before[col], "severity": "CRITICAL"})

    # Typänderungen
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

### Prompt für den Datenqualitätsbericht

```
Erstelle einen Datenqualitätsbericht basierend auf diesem Audit-Ergebnis.

AUDIT-ERGEBNISSE:
[Ausgabe des Python-Audits oder der SQL-Prüfungen oben einfügen]

TABELLE: [Name]
ZEILEN: [N]
SPALTEN: [N]
AUDIT-DATUM: [Datum]

Erstelle einen Datenqualitätsbericht mit:

## Zusammenfassung
Gesamt-Gesundheitsscore: [berechnen als % der Spalten ohne Probleme, gewichtet nach Schweregrad]
Status: [Grün / Gelb / Rot]
Kritische Probleme, die sofortiges Handeln erfordern: [N]

## Problem-Übersichtstabelle
| Problemtyp | Spalte | Anzahl | % der Zeilen | Schweregrad | Empfohlene Maßnahme |
|---|---|---|---|---|---|

## Kritische Probleme (vor Verwendung der Daten in Berichten beheben)
[Für jedes KRITISCHE Problem: was es ist, warum es wichtig ist, wie man es behebt]

## Warnungen (innerhalb von 30 Tagen beheben)
[Für jede WARNUNG: was es ist, das Geschäftsrisiko bei Nichtbehebung, empfohlene Lösung]

## Sanierungs-SQL
[Für jedes Problem eine SQL-Abfrage zur weiteren Untersuchung und/oder eine Korrekturabfrage bereitstellen]

## Überwachungsempfehlungen
[3–5 dbt-Tests oder Datenqualitätsprüfungen auflisten, um ein erneutes Auftreten zu verhindern]
```

---

### dbt-Test-Empfehlungen

```
Generiere basierend auf diesem Datenqualitätsaudit dbt-YAML-Testdefinitionen, um diese Probleme automatisch zu erkennen.

TABELLE: [Name]
PRIMÄRSCHLÜSSEL: [Spalte]
GEFUNDENE PROBLEME:
- [Probleme aus dem Audit auflisten]

Den `schema.yml`-Block mit Tests generieren:

```yaml
version: 2

models:
  - name: [table_name]
    description: "[Tabellenbeschreibung]"
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
                where: "created_at > '2024-01-01'"  # falls zutreffend
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

### Schnelle Qualitätsprüfungen (Schnelltriage)

```python
import pandas as pd

df = pd.read_csv('your_file.csv')  # oder das Abfrageergebnis

# Schnellprofil
print(df.describe(include='all'))          # Zusammenfassungsstatistiken alle Spalten
print(df.isnull().sum().sort_values(ascending=False))  # Null-Anzahlen geordnet
print(df.duplicated().sum())               # Anzahl duplizierter Zeilen
print(df.dtypes)                           # Datentypen — auf Objekte prüfen, die Zahlen sein sollten
print(df.nunique().sort_values())          # Kardinalität — niedrig = wahrscheinlich kategorial, hoch = ID/Freitext
```

## Beispiel

**Nutzer:** Ich habe gerade eine CSV mit 50.000 Bestellungen aus unserem E-Commerce-System aufgenommen. Die Spaltennamen sind: order_id, user_id, product_id, quantity, price, created_at, status, shipping_address. Die Umsatzzahlen sind diese Woche höher als erwartet. Hilf mir, die Daten zu prüfen.

**Erwartete Ausgabe:** Python-Audit-Skript, das für diese Tabelle befüllt wird. SQL-Abfragen für: Duplikat-order_id-Prüfung (Primärschlüssel), Ausreißer-Preischeck (negative Preise, Preise > 10.000 $), Mengenprüfung (null oder negativ), zukünftige Daten in created_at, eindeutige Werte in der status-Spalte (unerwartete Werte kennzeichnen), referentielle Integrität von user_id gegenüber einer users-Tabelle. Danach: Datenqualitätsbericht-Vorlage. Drei dbt-Tests hinzufügen: unique/not_null auf order_id, accepted_values auf status, relationships auf user_id. Kommentar: Falls Preisausreißer gefunden werden, würde das den Umsatzanstieg erklären — untersuchen, ob der Anstieg real oder ein Datenproblem ist.

---
