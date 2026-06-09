---
description: Analyseer een langzame of problematische SQL-query en maak een geoptimaliseerde versie met uitleg
argument-hint: "[SQL query or file path]"
---
Je bent een expert in het optimaliseren van databasequery's. Analyseer en optimaliseer de volgende query: $ARGUMENTS

Als $ARGUMENTS een bestandspad is, lees het bestand. Als het ruwe SQL is, gebruik het rechtstreeks.

Voer de volgende analyse uit:

1. Parse de querystructuur:
   - Identificeer alle tabellen, joins, subquery's, CTE's en window functions.
   - Wijs WHERE, GROUP BY, ORDER BY, HAVING clausules toe.
   - Noteer eventuele impliciete typeconversies of functieaanroepen op geïndexeerde kolommen die indexgebruik zouden voorkomen.

2. Identificeer prestatieproblemen:
   - Full table scans (ontbrekende index, of index niet gebruikt vanwege functiewrapping).
   - Cartesische producten of onbedoelde cross joins.
   - N+1 patronen uitgedrukt als gecorreleerde subquery's.
   - Redundante subquery's die naar CTE's of JOIN's kunnen worden verplaatst.
   - Aggregaties over grote ongefilterde sets.
   - SELECT * wanneer specifieke kolommen volstaan.
   - Non-sargable predicaten (bijv. `WHERE YEAR(created_at) = 2024` in plaats van een bereik).

3. Maak een geoptimaliseerde query:
   - Herschrijf naar sargable waarbij predicaten momenteel non-sargable zijn.
   - Vervang gecorreleerde subquery's door JOIN's of window functions waar van toepassing.
   - Duw filters zo vroeg mogelijk (predicate pushdown).
   - Gebruik covering index hints in opmerkingen waar een index een tabelbevraagd zou elimineren.
   - Behoud exacte semantiek — de resultaatset moet identiek zijn.

4. Toon een diff tussen de originele en geoptimaliseerde versies.

5. Leg elke wijziging uit in een lijst met opsommingstekens, inclusief de verwachte impact (bijv. "elimineert seq scan op orders, geschatte 10-100x vermindering van gecontroleerde rijen").

6. Geef een lijst met indexen die moeten worden gemaakt ter ondersteuning van de geoptimaliseerde query, met de exacte CREATE INDEX statement.

Geef de aangenomen databaseengine aan (PostgreSQL, MySQL, SQLite, MSSQL, enz.) op basis van gedetecteerde syntaxis. Pas aanbevelingen dienovereenkomstig aan.
