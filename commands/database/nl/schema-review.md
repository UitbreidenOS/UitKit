---
description: Een databaseschema beoordelen op ontwerpfouten, normalisatieproblemen en productiegereedheid
argument-hint: "[schema file or table name(s)]"
---
Je voert een beoordeling van de productiegereedheid uit van een databaseschema. Beoordelingsdoel: $ARGUMENTS

Als $ARGUMENTS een bestandspad is, lees het bestand. Als het een tabelnaam of lijst met namen is, zoek naar schemadefinities in de codebase (migraties, ORM-modellen, schema.sql, schema.rb, prisma.schema, enz.).

Beoordeel het schema op deze aspecten:

**Normalisatie en gegevensintegriteit**
- Identificeer schendingen van 1NF, 2NF, 3NF. Noteer denormalisaties die opzettelijk zijn (voor leesperformance) versus onopzettelijk.
- Detecteer kolommen die meerdere waarden opslaan (kommagescheiden lijsten, JSON-arrays gebruikt als relaties).
- Controleer dat elke tabel een duidelijke primaire sleutel heeft.
- Verifieer dat buitenlandse sleutels zijn gedeclareerd en niet alleen impliciet via naamgevingsconventie.
- Controleer op ontbrekende UNIQUE-beperkingen op kolommen die uniek moeten zijn.
- Detecteer kolommen die NULL kunnen zijn maar gegeven de bedrijfssemantiek NOT NULL zouden moeten zijn.

**Typeigningsgeschiktheid**
- Markeer tekenreekskolommen die e-mailadressen, UUID's, IP-adressen, JSON, geldbedragen of datetimes opslaan — stel geschikte typen voor.
- Markeer INT gebruikt voor boolean (gebruik BOOLEAN), of FLOAT gebruikt voor valuta (gebruik DECIMAL/NUMERIC).
- Controleer tijdzoneverwerking: TIMESTAMP vs TIMESTAMPTZ (PostgreSQL), DATETIME vs TIMESTAMP (MySQL).

**Naamgeving en consistentie**
- Controleer op consistente naamgevingsconventies (snake_case vs camelCase, plural vs singular tabelnamen).
- Identificeer inconsistente kolomnaampatronen voor veelvoorkomende velden (created_at vs createdAt vs create_time).

**Schaalbaarheidsoverwegingen**
- Tabellen waarop een index ontbreekt op buitenlandse sleutelkolommen.
- Tabellen zonder duidelijke partitioneringsstrategie die waarschijnlijk 10 miljoen rijen zullen overschrijden.
- Ontbrekend soft-delete-patroon waar hard deletes auditvereisten zouden schenden.
- VARCHAR zonder redelijke lengtebeperking op kolommen die waarschijnlijk worden geïndexeerd.

**Beveiliging**
- Kolommen die gevoelige gegevens lijken op te slaan (password, ssn, card_number, secret) zonder een naamgevingsconventie die aangeeft dat deze zijn gehashed/versleuteld.

Voer een gestructureerd rapport uit met ernstniveaus (CRITICAL / WARNING / SUGGESTION) voor elk bevinding, en een concrete oplossing voor elk.
