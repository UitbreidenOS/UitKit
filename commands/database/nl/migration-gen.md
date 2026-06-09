---
description: Genereer een databasemigratiebestand op basis van een schemaverschilbeschrijving of diff
argument-hint: "[description of schema change]"
---
Je genereert een databasemigratie. De gebruiker heeft het volgende verstrekt: $ARGUMENTS

Bepaal het doelmigratieframework uit het project (Alembic, Flyway, Liquibase, Django migrations, Rails ActiveRecord, Prisma, Knex, TypeORM, Sequelize, of raw SQL). Controleer indien nodig config-bestanden of bestaande migratiebestanden in de repo voordat u vragen stelt.

Stappen:
1. Onderzoek bestaande migraties om de naamgevingsconventie, tijdstempelindeling en bestandsstructuur te bepalen.
2. Bepaal de huidige schemastatus aan de hand van bestaande migraties of schemabestanden.
3. Genereer de migratie met:
   - Een `up`-pad (voorwaartse migratie) dat waar mogelijk idempotent is (gebruik IF NOT EXISTS, IF EXISTS guards).
   - Een `down`-pad (terugkeren) dat het `up`-pad volledig omkeert.
   - Expliciete transactiegrenzen als het framework transactionele DDL ondersteunt.
   - Kolombeperkingen (NOT NULL, DEFAULT, CHECK) die overeenkomen met wat is aangevraagd.
   - Index-aanmaak naast eventuele nieuwe foreign keys.
4. Als de wijziging het hernoemen van een kolom of tabel omvat, genereer een tweetrapts migratie: add new, backfill, drop old — tenzij de gebruiker expliciet een eenstaps hernoaming aanvraagt.
5. Markeer eventuele destructieve bewerkingen (DROP COLUMN, DROP TABLE, type narrowing) met een opmerking blok dat begint met `-- DESTRUCTIVE:` en beveel een overeenkomende implementatiestrategie aan (feature flag, dual-write, enzovoort).
6. Geef de inhoud van het migratiebestand uit met de juiste bestandsnaam volgens bestaande conventies.
7. Markeer voor grote tabellen bewerkingen die ACCESS EXCLUSIVE locks vereisen (ALTER TABLE op PostgreSQL) en stel CONCURRENTLY alternatieven voor waar beschikbaar.

Genereer geen ORM-modelwijzigingen tenzij hierom wordt gevraagd. Focus uitsluitend op het migratieproject.
