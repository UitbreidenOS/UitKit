---
description: Genereer een ER-diagram in Mermaid of PlantUML op basis van het databaseschema van het project
argument-hint: "[schemabestand, tabelnamen of directory]"
---
Genereer een entity-relationship diagram voor: $ARGUMENTS

Als $ARGUMENTS een bestandspad is, lees het dan. Als het een tabelnaam of kommagescheiden lijst is, zoek hun definities in migraties, ORM-modellen of schemabestanden. Als het een directory is, scan deze op alle schemadefinities erin.

Stappen:

1. Extracteer schemagegevens:
   - Tabelnamen en hun kolommen (naam, type, nullability, standaard).
   - Primaire sleutels (enkel en samengesteld).
   - Buitenlandse sleutels en de relaties die ze vertegenwoordigen (één-op-één, één-op-veel, veel-op-veel via knooppunttabellen).
   - Unieke beperkingen die cardinaliteit impliceren.

2. Detecteer de voorkeur van het diagramformat:
   - Als het project al `.mmd`, `mermaid` of PlantUML-bestanden bevat, match dat format.
   - Standaard naar Mermaid `erDiagram` syntaxis (wordt weergegeven in GitHub, Notion, meeste documenttools).
   - Indien de gebruiker PlantUML heeft opgegeven, gebruik `@startuml` / `@enduml` met entiteitsblokken.

3. Produceer het diagram:
   - Voeg alle kolommen met hun types in de entiteitsblokken toe.
   - Toon relatielijnen met correcte Mermaid cardinaliteitsnotatie:
     - `||--o{` één-op-veel
     - `||--||` één-op-één
     - `}o--o{` veel-op-veel
   - Label elke relatielijn met de buitenlandse sleutelnaam of een korte semantische label.
   - Gruppeer knooppunt-/associatietabellen visueel onderscheiden indien mogelijk via opmerkingen.

4. Indien het schema groot is (>15 tabellen), produceer twee diagrammen:
   - Een overzicht op hoog niveau met alleen tabellen en relaties (geen kolomdetails).
   - Een gedetailleerd diagram voor de subset van tabellen in $ARGUMENTS of de kerndomein-tabellen.

5. Na het diagram, voer uit:
   - Een korte legenda waarin niet-voor-de-hand-liggende afkortingen in kolomtypen worden verklaard.
   - Een lijst van impliciete relaties gevonden in de code maar niet gedeclareerd als FK-beperkingen.
   - Alle knooppunttabellen die domeinconcepten vertegenwoordigen die het waard zijn om duidelijkheid te hernoemen.

Voer het diagram uit in een omheind codeblok met de juiste taaltag (`mermaid` of `plantuml`).
