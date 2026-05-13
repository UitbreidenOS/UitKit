> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../data-pipeline.md).

# CLAUDE.md Starter — Data Pipeline Projekt

Dies in die `CLAUDE.md` des Projekts einfügen und die Abschnitte in eckigen Klammern ausfüllen.

---

```markdown
# [Projektname] — Claude Code Anweisungen

## Was das ist
[Ein Absatz: welche Daten diese Pipeline verarbeitet, Quellsysteme, Ziel, geschäftlicher Zweck]

## Stack
- Orchestrator: [Airflow / Prefect / Dagster / dbt Cloud]
- Transformation: [dbt / PySpark / Pandas / Polars]
- Warehouse: [BigQuery / Snowflake / Redshift / DuckDB]
- Ingestion: [Fivetran / Airbyte / custom]
- Sprache: [Python / SQL]
- Infra: [Terraform auf AWS / GCP / Azure]

## Projektstruktur
dbt/ (falls dbt verwendet wird)
├── models/
│   ├── staging/      ← 1:1 mit Quelltabellen, nur leichte Bereinigung
│   ├── intermediate/ ← Business-Logik, Joins
│   └── marts/        ← Finale Business-Entitäten (fct_, dim_-Präfixe)
├── macros/           ← Wiederverwendbare SQL-Makros
├── seeds/            ← Statische Referenzdaten
└── tests/            ← Benutzerdefinierte singuläre Tests

pipelines/ (falls Airflow/Prefect/Dagster verwendet wird)
├── dags/ / flows/    ← Pipeline-Definitionen
├── operators/        ← Benutzerdefinierte Operatoren/Tasks
└── utils/            ← Gemeinsame Utilities

## Datenkonventionen
- Staging-Modelle: in snake_case umbenennen, Typen casten, keine Joins, keine Business-Logik
- Faktentabellen: fct_-Präfix, eine Zeile pro Ereignis/Transaktion
- Dimensionstabellen: dim_-Präfix, eine Zeile pro Entität
- Niemals SELECT * in Produktionsabfragen verwenden
- Alle Mart-Modelle müssen unique + not_null-Tests auf dem Primärschlüssel haben
- Frische-Prüfungen für alle Sources erforderlich

## Entscheidungen (nicht neu diskutieren)
- [Incremental vs. Full-Refresh-Strategie für Faktentabellen]
- [Zeitzone: alle Timestamps in UTC]
- [Granularität: was eine Zeile in jeder Mart-Tabelle repräsentiert]
- [Strategie zur Behandlung verspäteter Daten]

## Testanforderungen
- Jedes Staging-Modell: not_null auf Primärschlüssel
- Jedes Mart-Modell: unique + not_null auf Primärschlüssel, Beziehungen auf Fremdschlüssel
- Source-Frische: Warnung nach [X] Stunden, Fehler nach [Y] Stunden

## Performance-Regeln
- Große Tabellen nach Datum partitionieren — immer nach Partitionsspalte filtern
- Inkrementelle Modelle für Tabellen > [X] Zeilen verwenden
- Niemals vollständige Refreshes in der Produktion ohne Genehmigung ausführen
- Cluster/Sort-Keys: [angeben, wenn Snowflake/Redshift verwendet wird]

## Befehle
- dbt run --select staging — Staging-Layer ausführen
- dbt test — alle Tests ausführen
- dbt docs generate && dbt docs serve — Dokumentation vorschauen
- dbt source freshness — Frische der Quelldaten prüfen

## Niemals tun
- Niemals Business-Logik in Staging-Modellen
- Niemals Daten hardcoden — dbt-Variablen oder Makros verwenden
- Niemals echte Anmeldedaten committen — Umgebungsvariablen oder Secrets Manager verwenden
- Niemals dbt run in der Produktion ohne bestandenes dbt test ausführen
```

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
