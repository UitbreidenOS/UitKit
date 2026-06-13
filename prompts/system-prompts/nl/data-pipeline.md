> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../data-pipeline.md).

# CLAUDE.md Starter — Data Pipeline Project

Zet dit in de `CLAUDE.md` van je project en vul de secties tussen haakjes in.

---

```markdown
# [Projectnaam] — Claude Code Instructies

## Wat dit is
[Eén alinea: welke data deze pipeline verwerkt, bronsystemen, bestemming, zakelijk doel]

## Stack
- Orchestrator: [Airflow / Prefect / Dagster / dbt Cloud]
- Transformatie: [dbt / PySpark / Pandas / Polars]
- Warehouse: [BigQuery / Snowflake / Redshift / DuckDB]
- Ingestie: [Fivetran / Airbyte / aangepast]
- Taal: [Python / SQL]
- Infra: [Terraform op AWS / GCP / Azure]

## Projectstructuur
dbt/ (bij gebruik van dbt)
├── models/
│   ├── staging/      ← 1:1 met brontabellen, alleen lichte opschoning
│   ├── intermediate/ ← Bedrijfslogica, joins
│   └── marts/        ← Definitieve bedrijfsentiteiten (fct_-, dim_-prefixen)
├── macros/           ← Herbruikbare SQL-macro's
├── seeds/            ← Statische referentiedata
└── tests/            ← Aangepaste enkelvoudige tests

pipelines/ (bij gebruik van Airflow/Prefect/Dagster)
├── dags/ / flows/    ← Pipeline-definities
├── operators/        ← Aangepaste operators/taken
└── utils/            ← Gedeelde hulpprogramma's

## Dataconventies
- Stagingmodellen: hernoem naar snake_case, cast typen, geen joins, geen bedrijfslogica
- Facttabellen: fct_-prefix, één rij per gebeurtenis/transactie
- Dimensietabellen: dim_-prefix, één rij per entiteit
- Gebruik nooit SELECT * in productiequery's
- Alle mart-modellen moeten unique + not_null tests hebben op primaire sleutel
- Versheidscontroles vereist op alle bronnen

## Beslissingen (niet opnieuw bespreken)
- [Incrementele vs. volledige-verversings-strategie voor facttabellen]
- [Tijdzone: alle tijdstempels in UTC]
- [Granulariteit: wat één rij in elke mart-tabel vertegenwoordigt]
- [Strategie voor laat-aankomende data]

## Testvereisten
- Elk stagingmodel: not_null op primaire sleutel
- Elk mart-model: unique + not_null op primaire sleutel, relaties op externe sleutels
- Bronversheid: waarschuwen bij [X] uur, fout bij [Y] uur

## Prestatieregels
- Partitioneer grote tabellen op datum — filter altijd op partitiekolom
- Gebruik incrementele modellen voor tabellen > [X] rijen
- Voer nooit volledige verversingen uit in productie zonder goedkeuring
- Cluster/sorteersleutels: [specificeer bij gebruik van Snowflake/Redshift]

## Commando's
- dbt run --select staging — staginglaag uitvoeren
- dbt test — alle tests uitvoeren
- dbt docs generate && dbt docs serve — documentatie voorbeelden bekijken
- dbt source freshness — versheid van brondata controleren

## Nooit doen
- Nooit bedrijfslogica in stagingmodellen plaatsen
- Nooit datums hardcoderen — gebruik dbt-variabelen of macro's
- Nooit echte credentials committen — gebruik omgevingsvariabelen of secrets manager
- Nooit dbt run uitvoeren in productie zonder dat dbt test slaagt
```

---
