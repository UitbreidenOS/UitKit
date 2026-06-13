# MCP: Sequentieel denken

Een gestructureerde stap-voor-stap redeneringsserver die Claude dwingt om complexe problemen methodisch door te denken voordat hij antwoord geeft, waardoor fouten bij meerstapstaken aanzienlijk worden verminderd.

## Waarom je dit nodig hebt

Claudes standaardgedrag bij moeilijke problemen is onmiddellijk antwoorden, wat kan resulteren in zelfverzekerd klinkend maar onvolledig redeneren. Sequentieel denken verandert de mechanica:
- Elke redeneringsstap is expliciet, genummerd en voort voort op de vorige
- Het model kan eerdere stappen herzien als het een tegenspraak ontdekt — redenering is niet ingebouwd
- Complexe architectuurbeslissingen, debug-ketens en migratieplannen profiteren van deze beperking
- De gestructureerde output is controleerbaar — je kunt precies zien waar het redeneren ging en elke stap aanvechten

## Installatie

```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
```

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

Geen omgevingsvariabelen of API-sleutels vereist.

## Belangrijkste tools / Wat het doet

**`sequentialThinking`** — het enige hulpmiddel dat deze server blootstelt. Het drijft een gestructureerd gedachteketingproces aan.

Parameters:
- `thought` — de inhoud van de huidige redeneringsstap
- `nextThoughtNeeded` — boolean; `true` als meer stappen nodig zijn, `false` als de conclusie is bereikt
- `thoughtNumber` — de huidige stapindex (1-gebaseerd)
- `totalThoughts` — geschatte totale stappen (kan tijdens het proces worden herzien)
- `isRevision` — optionele boolean; markeert een stap als correctie van een eerdere stap
- `revisesThought` — optioneel; het stapnummer dat wordt herzien

De server beheert de keten en retourneert de opgehoopte redenering bij elke stap. Claude gebruikt het intern om problemen door te werken voordat een antwoord wordt gepresenteerd.

## Gebruiksvoorbeelden

```
Gebruik sequentieel denken om de migratie van ons verificatiesysteem
van JWT naar op sessie gebaseerde tokens te plannen. Overweeg rollback-strategie,
sessie-opslagopties en achterwaartse compatibiliteit.
```

```
Denk stap voor stap na: zou deze service een aparte microservice
of een module in het monoliet moeten zijn? Overweeg teamgrootte, implementatiefrequentie,
gegevenscoppeling en foutinisolatie.
```

```
Sequentieel denken: wat zijn alle grensgevallen die we moeten verwerken
voor de betalingswebhook-verwerkingsstroom? Neem retry-logica op,
idempotentie, gedeeltelijke fouten en klokafwijking.
```

```
Werk de debugstappen door voor deze onderbroken testfout
die alleen in CI verschijnt. Begin met wat we weten en redeneer
wat tussen lokale en CI-omgevingen zou kunnen verschillen.
```

```
Gebruik sequentieel denken om deze databaseschemawijziging te beoordelen
en elk downstream-systeem te identificeren dat moet worden bijgewerkt.
```

## Verificatie

Geen verificatie vereist. Sequentieel denken is een lokaal proces — het draait volledig op je machine en voert geen externe API-aanroepen uit. De enige netwerkactiviteit in je sessie zijn Claudes normale API-aanroepen.

## Tips

**Beste gebruikssituaties:** Architectuurbeslissingen, complex debuggen, migratieplannen, risicoanalyse en alle taken waarbij "wat mis ik?" een echte zorg is. De gestructureerde output maakt het gemakkelijk om hiaten op te sporen.

**Gekoppeld aan expliciete prompting:** Combineer met zinnen als "denk stap voor stap na voordat je antwoord geeft" of "overweeg alle grensgevallen" voor maximaal effect. De server dwingt structuur af; je prompt begeleidt wat je over na moet denken.

**Latentie-afweging:** Sequentieel denken voegt 2–5 seconden per redenerketen toe, afhankelijk van complexiteit. Reserveer het voor problemen waar juistheid meer uitmaakt dan snelheid — gebruik het niet voor eenvoudige opzoekingen of eenmalige taken.

**Herzieningsstappen zijn waardevol:** Wanneer Claude een stap als herziening markeert, let goed op. Het betekent dat het redeneren een fout of tegenspraak middenketens heeft ontdekt. Dit zijn vaak de belangrijkste inzichten.

**Leesbare output:** Vraag Claude om de uiteindelijke redenerketen als genummerde lijst na afloop van het gereedschap te presenteren. De ruwe tooluitvoer is gestructureerde JSON — de opnieuw opgestelde versie is gemakkelijker te controleren en te delen.

**Geen vervanging voor domeinkennis:** Sequentieel denken verbetert de structuur en volledigheid van redenering. Het voegt geen informatie toe die Claude niet heeft. Als het probleem actuele externe gegevens vereist, koppel het aan websearch of retrieval-tools.

---
