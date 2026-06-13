# Live Artifacts — gegevensverbonden interactieve outputs

Live artifacts zijn Claude-outputs die verbinding maken met live gegevensbronnen en automatisch vernieuwd worden wanneer ze worden geopend. In tegenstelling tot statische artifacts — die eenmaal worden gegenereerd en bevroren — halen live artifacts uit API's, MCP-servers, databases en spreadsheets op het moment van weergave om huidige gegevens te tonen.

---

## Wat maakt een artifact live

Een live artifact verschilt van een statisch artifact op één fundamenteel manier: het haalt gegevens op het moment van openen op, niet op het moment van maken.

- **Maakt verbinding op open**: elke keer dat de artifact-URL wordt geopend, vraagt het de geconfigureerde gegevensbronnen op
- **Auto-vernieuwt op weergave**: gegevens zijn actueel op het moment dat het artifact wordt weergegeven — niet wanneer het voor het eerst werd gegenereerd
- **Blijft in Cowork-zijbalk**: live artifacts worden opgeslagen en vermeld naast andere artifacts; statische zijn efemeer tenzij vastgemaakt
- **Deelbare URL**: elk live artifact krijgt een stabiele URL; toegangscontrole wordt per artifact ingesteld
- **iframe insluitbaar**: plak het insluitfragment in Notion, Confluence of elk hulpmiddel dat iframes accepteert

---

## Gegevensbrontypen

| Brontype | Hoe Claude verbinding maakt | Voorbeeld |
|-------------|--------------------|---------| 
| MCP server | Elk verbonden MCP-hulpmiddel is beschikbaar als gegevensbron | Postgres MCP → live queryresultaten |
| REST API | Beschrijf het eindpunt; Claude genereert de fetch-oproep | GitHub API → aantal open PR's |
| Database (via MCP) | SQL-query ingebed in het artifact | Supabase → gebruikersmaten |
| Google Sheets / CSV | Voeg toe via Google Drive-connector (Cowork) | Budget tracker → live grafiek |
| GitHub | Repository data via GitHub API of MCP | Commit activity, issue counts |

De gegevensbron moet toegankelijk blijven om het artifact te vernieuwen. Als een MCP-server offline gaat of een API-sleutel verloopt, toont het artifact het laatste gecachete resultaat met een waarschuwing voor verouderde gegevens.

---

## Een Live Artifact maken

Beschrijf de gewenste uitvoer en refereer expliciet naar de gegevensbron in uw prompt. Claude genereert het artifact en bedraat de gegevensverbinding.

**Voorbeeld van één bron:**

```
"Create a live artifact showing the current open issue count by label 
from our GitHub repo (owner: acme, repo: api-service). 
Show as a bar chart, refresh on every open."
```

**Dashboard voorbeeld met meerdere bronnen:**

```
"Create a live dashboard artifact with three panels:
1. Open PR count from GitHub (acme/api-service)
2. Current row count from the 'users' table via the Postgres MCP
3. Last 7 days of signups from the Google Sheet at [URL]

Refresh all three panels on open. Layout: horizontal, equal-width panels."
```

Claude genereert het artifact, bedt de gegevens-ophaallogica in en registreert de gegevensbronverbindingen. Het artifact wordt onmiddellijk in uw zijbalk weergegeven.

---

## Delen en insluiten

**Deellink:**

Elk live artifact heeft een deelknop. Als u erop klikt, genereert dit een openbare URL (of een werkruimte-beperkte URL voor persoonlijke artifacts). Iedereen met de link ziet het artifact met live gegevens wanneer zij het openen — geen Claude-account vereist voor openbare artifacts.

**Iframe-insluiting:**

```html
<!-- Plak in Notion, Confluence, Linear of elk iframe-geschikt hulpmiddel -->
<iframe
  src="https://claude.ai/artifacts/live/a1b2c3d4"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

**Toegangscontrole:**

| Toegangsniveau | Wie kan bekijken | Plan vereist |
|-------------|-------------|---------------|
| Openbaar | Iedereen met de link | Pro+ |
| Werkruimte | Leden van uw Claude-team | Team of Enterprise |
| Privé | Alleen u | Pro+ |

---

## Live Artifact versus statisch artifact

| Eigenschap | Live artifact | Statisch artifact |
|----------|--------------|-----------------|
| Versheid van gegevens | Actueel op open moment | Snapshot op moment van maken |
| Persistentie | Opgeslagen in zijbalk | Efemeer tenzij vastgemaakt |
| Delen | Stabiele URL, deelbaar | Alleen kopie/plak inhoud |
| Gegevensbronnen | API's, MCP, databases, sheets | Geen — alleen gegenereerde inhoud |
| Plan vereist | Pro+ (live-verbindingen) | Alle abonnementen |
| Vernieuwingstrigger | Op open (+ optioneel interval) | N/A |

---

## Beperkingen

- De onderliggende gegevensbron moet toegankelijk blijven — artifacts slaan geen volledige gegevenscache op tussen weergaven
- Complexe multi-bron dashboards met veel live query's laden langzamer dan single-bron artifacts
- Live gegevensverbindingen vereisen een Pro of hoger abonnement; gratis tier artifacts zijn altijd statisch
- Geen vervanging voor BI-hulpmiddelen — geen drill-downs, opgeslagen filters of toegangscontrole per gegevensveld
- Iframe-insluiting vereist dat het host-hulpmiddel iframes van derden toestaat (Notion en Confluence doen dit; sommige bedrijfsintranet-netwerken blokkeren dit)
- Google Sheets-gegevensbron vereist dat de Google Drive-connector in Cowork is gemachtigd

---
