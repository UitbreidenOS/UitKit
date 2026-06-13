---
description: Genereer een databasemigratie-bestand op basis van een schemaveranderingsbeschrijving of diff
argument-hint: "[beschrijving van schemaverandering]"
---
Je genereert een databasemigratie. De gebruiker heeft het volgende gegeven: $ARGUMENTS

Bepaal het doelmigratieframework op basis van het project (Alembic, Flyway, Liquibase, Django migrations, Rails ActiveRecord, Prisma, Knex, TypeORM, Sequelize of ruwe SQL). Controleer, als het onduidelijk is, eerst configuratiebestanden of bestaande migratiebestanden in de repository voordat je iets vraagt.

Stappen:
1. Bekijk bestaande migraties om de naamgevingsconventie, timestampindeling en bestandsstructuur te bepalen.
2. Identificeer de huidige schemastatus uit bestaande migraties of schemabestanden.
3. Genereer de migratie met:
   - Een `up`-pad (verdergaande migratie) dat waar mogelijk idempotent is (gebruik IF NOT EXISTS, IF EXISTS guards).
   - Een `down`-pad (terugdraaien) dat het `up`-pad volledig omkeert.
   - Expliciete transactiegrenzen als het framework transactionele DDL ondersteunt.
   - Kolomconstraints (NOT NULL, DEFAULT, CHECK) die aansluiten bij wat werd aangevraagd.
   - Indexcreatie naast eventuele nieuwe buitenlandse sleutels.
4. Als de wijziging het hernoemen van een kolom of tabel betreft, genereer een tweeledige migratie: voeg toe, vul opnieuw in, verwijder oud — tenzij de gebruiker expliciet een eenstapsmigratiehernoemen aanvraagt.
5. Markeer alle destructieve bewerkingen (DROP COLUMN, DROP TABLE, typeversmalling) met een commentaarblok dat begint met `-- DESTRUCTIVE:` en beveel een corresponderende implementatiestrategie aan (feature flag, dual-write, enz.).
6. Voer de migratiebestandscontent uit met de juiste bestandsnaam volgens bestaande conventies.
7. Voor grote tabellen, markeer bewerkingen die ACCESS EXCLUSIVE-sloten vereisen (ALTER TABLE op PostgreSQL) en stel CONCURRENTLY-alternatieven voor waar beschikbaar.

Genereer geen ORM-modelwijzigingen tenzij er om gevraagd wordt. Concentreer je uitsluitend op het migratieartifact.
