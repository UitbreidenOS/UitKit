---
description: Aanbeveel indexen voor een tabel of query-werkbelasting op basis van schema en toegangspatronen
argument-hint: "[tabelnaam, query of schemabestand]"
---
Analyseer het databaseschema en de toegangspatronen voor: $ARGUMENTS

Als $ARGUMENTS een tabelnaam is, zoek het schema in migraties, ORM-modellen of schemabestanden. Als het een query is, analyseer de toegangspatronen van die query. Als het een bestandspad is, lees het.

Voer deze analyse uit:

1. Toewijzing van huidige indexen:
   - Vermeld alle bestaande indexen (primaire sleutel, uniek, samengesteld, partieel, op expressies gebaseerd).
   - Identificeer welke indexen overbodig zijn (voorvoegsel-gedekt door een ander index).
   - Identificeer ongebruikte of laag-selectieve indexen (bijv. booleaanse kolommen, laag-cardinaliteit enums).

2. Analyseer de query-werkbelasting:
   - Als queries beschikbaar zijn of in de codebase kunnen worden gevonden (ORM-querycalls, ruwe SQL), extraheer hun WHERE-, JOIN-, ORDER BY- en GROUP BY-patronen.
   - Identificeer kolommen die herhaaldelijk voorkomen in filterpredicaten.
   - Noteer alle bereikquery's die baat hebben bij B-tree-indexen versus alleen gelijkheidsvergelijkingenquery's.

3. Aanbevelingen voor nieuwe indexen:
   - Voor elke aanbeveling, geef aan:
     a. De exacte CREATE INDEX-statement (gebruik CONCURRENTLY voor PostgreSQL indien passend).
     b. Welke queries of toegangspatronen het afdekt.
     c. Geschatte selectiviteitsimpact (hoog/gemiddeld/laag cardinaliteit).
     d. Schrijfoverhead-kosten — indexen die INSERT/UPDATE-doorvoer schaden moeten worden gemarkeerd.
   - Geef de voorkeur aan samengestelde indexen boven meerdere enkelvoudige kolomindexen wanneer het querypatroon dit rechtvaardigt.
   - Overweeg partiële indexen (WHERE-clausule) voor zeldzame voorwaarden (bijv. soft-delete-patronen, statusfilters met dominante nul-/inactieve waarden).
   - Overweeg coveringindexen (INCLUDE-kolommen) om heapfetches voor hete leespaden te elimineren.

4. Vlag indexen om uit te voeren:
   - Dubbele indexen.
   - Indexen op kolommen die nooit in filters of joins worden gebruikt.
   - Indexen die worden vervangen door een samengestelde index.

5. Zet een prioritair actieplan uit: HOOG (onmiddellijke winst, laag risico) / GEMIDDELD (nuttig, geringe schrijfoverhead) / LAAG (marginaal, evalueer onder belasting).

Geef de aangenomen database-engine aan op basis van syntaxis- of configuratiecontext.
