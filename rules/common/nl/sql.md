# SQL-regels

Pas deze regels toe bij het schrijven van query's, schema's of opgeslagen procedures.

## Query-hygiëne

- Gebruik altijd geparametriseerde query's — nooit gebruikersinvoer via string-interpolatie in SQL invoegen
- Kwalificeer kolomnamen bij het verbinden van meerdere tabellen: `u.id` niet `id`
- Vermijd `SELECT *` in production query's; noem elke kolom die je nodig hebt
- Gebruik `EXPLAIN ANALYZE` voordat je een query merged die grote tabellen aanraakt
- Houd query's leesbaar: één clause per regel voor alles wat verder gaat dan een eenvoudige SELECT

## Indexering

- Elke buitenlandse sleutel moet een index hebben — de database voegt dit niet automatisch toe
- Index kolommen die voorkomen in `WHERE`, `JOIN ON`, of `ORDER BY` op hot paths
- Samengestelde indexen: kolomomvolgorde is van belang — zet het hoogste-cardinaliteit of equality-filter eerst
- Indexeer niet te veel op schrijf-zware tabellen; elke index vertraagt `INSERT`/`UPDATE`/`DELETE`
- Gebruik gedeeltelijke indexen voor gefilterde query's: `CREATE INDEX … WHERE deleted_at IS NULL`

## Schema-ontwerp

- Gebruik `NOT NULL` standaard; nullable alleen wanneer afwezigheid een aparte betekenis heeft van nul/leeg
- Sla timestamps op als `TIMESTAMPTZ` (UTC) — nooit `TIMESTAMP WITHOUT TIME ZONE`
- Gebruik `BIGINT` of `UUID` voor primaire sleutels; `SERIAL`/`INT` raakt uitgeput bij tabellen met hoog volume
- Soft-delete met `deleted_at TIMESTAMPTZ` wanneer rijhistorie van belang is; hard-delete anders
- Geld: opslaan als geheeltallige cents (`BIGINT`) of `NUMERIC(19,4)` — nooit `FLOAT`/`DOUBLE`

## Transacties

- Verpak multi-statement mutaties in een transactie; laat nooit gedeeltelijke schrijfbewerkingen toe
- Houd transacties kort — gehouden lock = latentie voor elke concurrerende schrijver
- Gebruik `SELECT … FOR UPDATE` om rijen die je gaat wijzigen vast te zetten, niet achteraf
- Vermijd transacties die een HTTP-request-response-cyclus omspannen

## Migraties

- Migraties zijn alleen-toevoegen; bewerk nooit een migratie die in een environment is uitgevoerd
- Geef de voorkeur aan additieve wijzigingen (kolom toevoegen, tabel toevoegen) voordat je oude kolommen verwijdert
- Voeg nieuwe kolommen die niet nullable zijn toe met een `DEFAULT` of in twee stappen: voeg nullable toe → vul terug → voeg beperking toe
- Test rollback: elke migratie moet een omkeerbare `down`-stap hebben

## Anti-patronen

- Geen logica in toepassingsquery's die in constraints hoort: gebruik `CHECK`, `UNIQUE`, `FK`
- Geen `NOT IN (subquery)` met nullable kolommen — het retourneert stilletjes nul rijen bij NULL
- Geen gerelateerde subquery's in lussen — batch of gebruik een `JOIN`/`CTE` in plaats daarvan
- Geen `OFFSET`-paginering op grote tabellen — gebruik cursor-gebaseerd (`WHERE id > :cursor`)
