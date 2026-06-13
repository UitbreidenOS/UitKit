---
name: data-migration
description: "Patronen voor databasemigratie: schemwijzigingen zonder downtime, gegevensachtergronden, Alembic, Prisma Migrate, Rails-migraties"
---

# Gegevensmigratievaardigheden

## Wanneer activeren
- Toevoegen, verwijderen of wijzigen van kolommen in productiondatabase
- Hernoemen van tabellen of kolommen terwijl de toepassing actief is
- Gegevensachtergrond voor nieuwe kolom of wijziging van gegevensindelingen
- Schrijven van Alembic-, Prisma-, Rails- of raw SQL-migraties
- Planning grootschalige gegevenstransformatie veilig

## Wanneer NIET gebruiken
- Kleine schemawijzigingen alleen dev waar downtime acceptabel
- NoSQL-schemamigratiepatronen (andere patronen)
- Data warehouse ETL-pipelines — gebruik dbt of Spark in plaats

[Following full structure from English version with Dutch translations]

---
