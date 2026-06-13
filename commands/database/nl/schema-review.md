---
description: Beoordeel een databaseschema op ontwerpfouten, normalisatieproblemen en productiegereedheid
argument-hint: "[schemabestand of tabelnamen]"
---
U voert een productiegereedheid-beoordeling uit van een databaseschema. Beoordelingsdoel: $ARGUMENTS

Als $ARGUMENTS een bestandspad is, lees het bestand. Als het een tabelnaam of lijst met namen is, zoek naar schemadefinities in de codebase (migrations, ORM-modellen, schema.sql, schema.rb, prisma.schema, enz.).

Beoordeel het schema over deze dimensies:

**Normalisatie en Data-integriteit**
- Identificeer schendingen van 1NF, 2NF, 3NF. Noteer denormaliseringen die opzettelijk zijn (voor leesprestaties) versus accidenteel.
- Detecteer kolommen die meerdere waarden opslaan (kommagescheiden lijsten, JSON-arrays gebruikt als relaties).
- Controleer dat elke tabel een duidelijke primaire sleutel heeft.
- Verifieer dat buitenlandse sleutels zijn gedeclareerd en niet alleen geïmpliceerd door naamgevingsconventie.
- Controleer op ontbrekende UNIQUE-beperkingen op kolommen die uniek moeten zijn.
- Detecteer nullable-kolommen die NOT NULL zouden moeten zijn gezien de zakelijke semantiek.

**Type-geschiktheid**
- Markeer string-kolommen die worden gebruikt om e-mails, UUID's, IP-adressen, JSON, geldbedragen of datumtijden op te slaan — suggereer juiste typen.
- Markeer INT gebruikt voor booleaans (gebruik BOOLEAN), of FLOAT gebruikt voor valuta (gebruik DECIMAL/NUMERIC).
- Controleer timezoneverwerking: TIMESTAMP vs TIMESTAMPTZ (PostgreSQL), DATETIME vs TIMESTAMP (MySQL).

**Naamgeving en Consistentie**
- Controleer op consistente naamgevingsconventies (snake_case vs camelCase, meervoudige vs enkelvoudige tabelnamen).
- Identificeer inconsistente naamgevingspatronen voor veelvoorkomende velden (created_at vs createdAt vs create_time).

**Schaalbaarheidsaandachtspunten**
- Tabellen zonder een index op buitenlandse-sleutelkolommen.
- Tabellen zonder duidelijke partitiestrategie die waarschijnlijk meer dan 10 miljoen rijen zullen overschrijden.
- Ontbrekend soft-delete-patroon waarbij hard deletes auditvereisten zouden breken.
- VARCHAR zonder een redelijke lengtelimiet op kolommen die waarschijnlijk geïndexeerd zullen worden.

**Beveiliging**
- Kolommen die gevoelige gegevens lijken op te slaan (password, ssn, card_number, secret) zonder naamgevingsconventie die aangeeft dat ze zijn gehasht/versleuteld.

Voer een gestructureerd rapport uit met ernstniveaus (CRITICAL / WARNING / SUGGESTION) voor elke bevinding en een concrete oplossing voor elk.
