---
description: Een ER-diagram in Mermaid of PlantUML genereren op basis van het databaseschema van het project
argument-hint: "[schema file, table names, or directory]"
---
Genereer een entity-relationship diagram voor: $ARGUMENTS

Als $ARGUMENTS een bestandspad is, lees het. Als het een tabelnaam of kommagescheiden lijst is, zoek hun definities in migraties, ORM-modellen of schemabestanden. Als het een directory is, scan op alle schemadefinities erin.

Stappen:

1. Schema-informatie extraheren:
   - Tabelnamen en hun kolommen (naam, type, optionaliteit, standaardwaarde).
   - Primaire sleutels (enkele en samengestelde).
   - Vreemde sleutels en de relaties die zij vertegenwoordigen (een-op-een, een-op-veel, veel-op-veel via junctiontabellen).
   - Unieke beperkingen die kardinaliteit impliceren.

2. Diagramformaatvoorkeur detecteren:
   - Als het project al `.mmd`, `mermaid` of PlantUML-bestanden bevat, match dat formaat.
   - Standaard naar Mermaid `erDiagram` syntax (wordt weergegeven in GitHub, Notion, meeste documentatiehulpmiddelen).
   - Als de gebruiker PlantUML heeft opgegeven, gebruik `@startuml` / `@enduml` met entiteitblokken.

3. Het diagram produceren:
   - Inclusief alle kolommen met hun types in de entiteitblokken.
   - Toon relatielijnen met correcte Mermaid-kardinaliteitsnotatie:
     - `||--o{` een-op-veel
     - `||--||` een-op-een
     - `}o--o{` veel-op-veel
   - Label elke relatielijm met de naam van de vreemde sleutel of een korte semantische label.
   - Groepeer junctie/associatietabellen visueel onderscheidend indien mogelijk via opmerkingen.

4. Als het schema groot is (>15 tabellen), produceer twee diagrammen:
   - Een overzicht op hoog niveau met alleen tabellen en relaties (geen kolomdetails).
   - Een gedetailleerd diagram voor de subset van tabellen in $ARGUMENTS of de kerndomteintabellen.

5. Na het diagram uitvoer:
   - Een korte legenda die eventuele niet-voor-de-handliggende afkortingen die in kolomtypes worden gebruikt, uitleg geeft.
   - Een lijst van eventuele impliciete relaties gevonden in de code maar niet gedeclareerd als FK-beperkingen.
   - Alle junctiontabellen die domeinconcepten vertegenwoordigen die waard zijn om duidelijkheid voor een herbenoeming.

Voer het diagram uit in een omheind codeblok met de correcte taaltag (`mermaid` of `plantuml`).
