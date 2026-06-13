# MCP: Notion

Lees en schrijf Notion-pagina's, -databases en -blokken vanuit Claude Code — zoek je werkruimte, maak inhoud aan en werk deze bij, en query gestructureerde databases zonder de terminal te verlaten.

## Waarom je dit nodig hebt

Notion is waar veel productcontext leeft: specs, vergaderingsnotities, besluitingslogboeken, projectdatabases. Zonder MCP heeft Claude er geen toegang toe. Met Notion MCP:
- Claude kan je hele werkruimte doorzoeken en relevante context in elke codesessie trekken
- Database-queries brengen gestructureerde projectgegevens (taken, sprints, beslissingen) rechtstreeks in de workflow
- Het maken en bijwerken van pagina's vanuit Claude betekent dat documentatie in de sessie gebeurt, niet erna
- Cross-referencing van codewijzigingen tegen Notion-specs of ADR's wordt een eenmalige prompt

## Installatie

```bash
npm install -g @notionhq/notion-mcp-server
```

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer your-notion-integration-token\", \"Notion-Version\": \"2022-06-28\"}"
      }
    }
  }
}
```

## Sleuteltools / Wat het doet

- `search` — volledige tekstzoeken in alle pagina's en databases die de integratie kan openen
- `get_page` — haal een pagina op en zijn eigenschappen op via pagina-ID
- `create_page` — maak een nieuwe pagina in een bovenliggende pagina of database
- `update_page` — werk pagina-eigenschappen bij (titel, status, datums, keuzen, relaties)
- `get_database` — haal een databaseschema en -metagegevens op
- `query_database` — query een database met filters, sorts en paginering
- `create_database_item` — voeg een nieuw rij/item toe aan een database
- `update_database_item` — werk eigenschappen op een bestaande database-item bij
- `append_block_children` — voeg inhoudsblokken toe (alinea's, code, lijsten, callouts) aan een pagina

## Gebruiksvoorbeelden

```
Query mijn projectdatabase en lijst alle taken met status "In Progress",
gesorteerd op vervaldatum. Toon de assignee en prioriteit voor elk.
```

```
Maak een nieuwe pagina in mijn vergaderingsnotities-database met vandaag's datum als titel,
en voeg een agendagedeelte toe met deze drie onderwerpen: [lijst onderwerpen].
```

```
Zoek Notion naar onze API-ontwerpbeslissingen uit Q1 en vat
de belangrijkste keuzes samen die we hebben gemaakt rond authenticatie en versiebeheer.
```

```
Werk de status van taak "ENG-Implement OAuth flow" bij naar Done
en stel de voltooiingsdatum in op vandaag.
```

```
Voeg een samenvatting van deze codesessie toe aan mijn dev log-pagina —
voeg in wat we hebben gewijzigd, wat we hebben uitgesteld en openstaande vragen.
```

## Verificatie

1. Ga naar **notion.so/my-integrations** en klik op **Nieuwe integratie**
2. Geef het een naam, selecteer je werkruimte en stel de mogelijkheden in: **Inhoud lezen**, **Inhoud bijwerken**, **Inhoud invoegen**
3. Kopieer het **Internal Integration Token** — het begint met `secret_`
4. Stel het in als de `Authorization`-dragerwaarde in het configuratieblok hierboven
5. **Voor elke pagina of database die de integratie moet openen:** open het in Notion, klik op het menu met drie puntjes, ga naar **Verbindingen** en voeg je integratie op naam toe

De integratie ziet alleen pagina's die expliciet ermee worden gedeeld. Delen van een bovenliggende pagina deelt niet automatisch onderliggende pagina's — je moet elk deelen of een top-level pagina delen en **Onderliggende pagina's opnemen** aanvinken.

## Tips

**Pagina-ID's uit URL's vinden:** Notion-pagina-ID's zijn de 32 karakters lange hexreeks aan het einde van de URL. Gebruik `search` om pagina's op naam te ontdekken in plaats van ID's handmatig op te zoeken.

**Database-queries ondersteunen filters en sorts:** Gebruik de `filter`-parameter met samengestelde voorwaarden (en/of) om dezelfde weergaven te repliceren die je in de Notion-UI hebt. Het filterschema spiegelt exact Notion's filter-API.

**Tarieflimiet is 3 aanvragen per seconde:** Voor bulkbewerkingen (veel items maken, grote databases querying), voeg je vertragingen tussen aanroepen toe of batch-schrijf met `append_block_children` met meerdere blokken in één aanroep.

**Rich text versus platte tekst:** De meeste `create_page`- en `update_page`-velden verwachten Notion's rich text-array-format, geen gewone tekenreeksen. Wrap tekst als `[{"type": "text", "text": {"content": "your text"}}]` twijfelachtig.

**Gebruik search om bootstrap:** Wanneer je geen ID's hebt, start je altijd met `search` met een beschrijvende titel. Het retourneert pagina-ID's en database-ID's die je in volgende aanroepen kunt gebruiken.

---
