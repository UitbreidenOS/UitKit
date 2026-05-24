# MCP: Thomson Reuters Westlaw & Practical Law

Thomson Reuters biedt een official MCP server die Claude Code directe toegang tot Westlaw geeft — de leidende US juridische research database — en Practical Law, die practice guides, standaard documenten en checklists dekt. Vereist een actief Westlaw abonnement. Eenmaal verbonden kan Claude huidige case law, statutes en regulations ophalen in plaats van vertrouwen op training data bevroren op zijn knowledge cutoff.

## Waarom je dit nodig hebt

Zonder TR MCP is Claude's juridische kennis statisch. Ermee:
- Zoek en haal huidige case law op naar jurisdictie, court en daterange
- Trek statutes en regulations op in hun huidige, in-force vorm
- Toegang tot Practical Law practice notes en standard document templates
- Shepardize / KeyCite cases om te bevestigen dat ze nog goed law zijn
- Generate citations in Bluebook format
- Beantwoord vragen zoals: "Is deze clausule nog afdwingbaar onder NY law vanaf 2026?"

## Vereisten

- Actief Westlaw abonnement (individueel, firm of enterprise)
- TR Developer API key — verkrijg van `developer.thomsonreuters.com`
- API toegang kan de legal.ai tier vereisen op je TR account; bevestig met je account representative voordat je setup doet

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    }
  }
}
```

Vervang `@thomsonreuters/westlaw-mcp@latest` met de exacte package naam vermeld op de TR Developer Portal — de naam hierboven is illustratief en kan verschillen van het gepubliceerde package.

## Wat het exposeert

| Tool | Wat het doet |
|---|---|
| `search_cases` | Full-text case law search met filters voor jurisdictie, court en date |
| `get_case` | Haal volledige case opinion op naar citation |
| `shepardize` | Controleer of een case nog goed law is via KeyCite |
| `search_statutes` | Zoek federal en state statutes naar onderwerp of citation |
| `get_statute` | Haal statute section op met annotations |
| `search_regulations` | Zoek de CFR en state administrative codes |
| `get_practical_law` | Haal Practical Law practice notes en document templates op |
| `search_secondary` | Zoek law reviews, treatises en practice guides |
| `format_citation` | Generate een Bluebook-geformateerde citation |

## Voorbeeldprompts

```
"Find Delaware Court of Chancery cases from 2022–2026 on director fiduciary duty in M&A transactions"

"Is the arbitration clause in this contract enforceable under 9 USC §2 and recent Second Circuit case law?"

"Get the Practical Law standard NDA for M&A with governing law set to New York"

"Shepardize Revlon v. MacAndrews and tell me if it is still good law"

"What are the current GDPR Article 17 obligations under EU regulation and has anything changed in 2025–2026?"
```

## Kosten

TR API calls tekenen van je Westlaw API quota, welke apart is van Claude token gebruik. Controleer consumptie op `developer.thomsonreuters.com/usage`. Enterprise contracten bevatten typisch een bundled API tier — bevestig je quota voordat je bulk research workflows uitvoert.

## Combineren met iManage

Thomson Reuters MCP koppelen met iManage DMS laat Claude precedent cases uit Westlaw ophalen en je firm's prior work product op dezelfde zaak ophalen van iManage, dan een memo schrijven die beide bronnen citeert. Gecombineerde config:

```json
{
  "mcpServers": {
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    },
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/mcp-server@latest"],
      "env": {
        "IMANAGE_SERVER": "https://your-firm.imanage.work",
        "IMANAGE_CLIENT_ID": "your-client-id",
        "IMANAGE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

Met beide servers actief, zal een prompt zoals "Draft a memo on enforceability of MNDA liquidated damages clauses under NY law, citing relevant cases and any prior firm memos on the topic" uit Westlaw voor huidige case law tekenen en iManage voor internal precedents gelijktijdig.
