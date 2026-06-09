---
description: Aanbeveling van indexen voor een tabel of query-werkbelasting gebaseerd op schema en toegangspatronen
argument-hint: "[table name, query, or schema file]"
---
Analyseer het databaseschema en toegangspatronen voor: $ARGUMENTS

Als $ARGUMENTS een tabelnaam is, zoek het schema in migraties, ORM-modellen of schemabestanden. Als het een query is, analyseer de toegangspatronen van die query. Als het een bestandspad is, lees het.

Voer deze analyse uit:

1. Kaart de huidige indexen:
   - Zet alle bestaande indexen op een lijst (primaire sleutel, unieke, samengestelde, partiële, op expressie gebaseerde).
   - Identificeer welke indexen redundant zijn (voorvoegsel-afgedekt door een andere index).
   - Identificeer ongebruikte of lage selectiviteitsindexen (bijv. booleaanse kolommen, laag-cardinaliteit enums).

2. Analyseer de query-werkbelasting:
   - Als queries aanwezig zijn of ontdekt kunnen worden in de codebase (ORM-querygesprekken, ruwe SQL), extraheer hun WHERE, JOIN, ORDER BY en GROUP BY patronen.
   - Identificeer kolommen die herhaaldelijk in filterpredicaten voorkomen.
   - Noteer alle bereikqueries die voordeel hebben van B-tree-indexen versus alleen-gelijkheid-queries.

3. Aanbevelingen voor nieuwe indexen:
   - Voor elke aanbeveling, staat:
     a. De exacte CREATE INDEX-instructie (gebruik CONCURRENTLY voor PostgreSQL indien van toepassing).
     b. Welke queries of toegangspatronen het afdekt.
     c. Geschatte selectiviteitsimpact (hoge/gemiddelde/lage cardinaliteit).
     d. Schrijfoverhead-kosten — indexen die INSERT/UPDATE doorvoer aantasten, moeten worden gemarkeerd.
   - Voorkeur voor samengestelde indexen boven meerdere indexen met één kolom wanneer het querypatroon dit rechtvaardigt.
   - Overweeg partiële indexen (WHERE-clausule) voor schaarse voorwaarden (bijv. soft-delete-patronen, statusfilters met dominante null/inactieve waarden).
   - Overweeg dekkende indexen (INCLUDE kolommen) om heap-ophalen voor hot-read-paden te elimineren.

4. Markeert indexen om neer te zetten:
   - Dubbele indexen.
   - Indexen op kolommen die nooit in filters of joins worden gebruikt.
   - Indexen die zijn vervangen door een samengestelde index.

5. Voer een geprioriteerd actieplan uit: HIGH (onmiddellijke winst, laag risico) / MEDIUM (nuttig, geringe schrijfoverhead) / LOW (marginaal, evalueer onder belasting).

Geef de aangenomen database-engine op basis van syntaxis of configuratiecontext aan.
