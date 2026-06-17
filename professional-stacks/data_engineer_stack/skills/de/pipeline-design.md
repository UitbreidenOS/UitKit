# Pipeline-Design

## Wann aktivieren

Entwerfen neuer Daten-Workflows oder Umstrukturierung bestehender DAGs.

## Wann NICHT verwenden

Kein Ersatz für Laufzeit-Debugging; nur für Architektur-Phase verwenden.

## Anweisungen

1. Datenquellen und Abhängigkeiten abbilden
2. Transformationsstufen definieren
3. Orchestrator wählen (Airflow, dbt, Spark)
4. Datenfluss und SLAs dokumentieren

## Beispiel

E-Commerce-Pipeline: PostgreSQL (Quellen) → dbt (Transformation) → Snowflake (Warehouse) → BI-Tool. Abhängigkeiten: raw_orders → model_orders → mart_sales. SLA: täglich 6:00 Uhr, <30 Min. Laufzeit.
