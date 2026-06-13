---
name: data-migration
description: "Datenbank-Migrationsmuster: Schemäänderungen ohne Ausfallzeit, Datensicherungen, Alembic, Prisma Migrate, Rails-Migrationen"
---

# Datenmigrations-Skill

## Wann aktivieren
- Hinzufügen, Entfernen oder Ändern von Spalten in einer Produktionsdatenbank
- Umbenennen von Tabellen oder Spalten während die Anwendung läuft
- Datensicherung für neue Spalte oder Änderung von Datenformaten
- Schreiben von Alembic-, Prisma-, Rails- oder Raw-SQL-Migrationen
- Planung einer großangelegten Datentransformation sicher

## Wann NICHT verwenden
- Kleine Schemaänderungen nur dev wo Ausfallzeit akzeptabel ist
- NoSQL-Schemamigration (unterschiedliche Muster)
- Data Warehouse ETL-Pipelines — verwenden Sie dbt oder Spark statt

[Following full structure from English version with German translations]

---
