# MCP: Free Law Project (CourtListener)

Het Free Law Project's CourtListener MCP geeft free, open-access US court opinions, docket data en judge profiles. Geen abonnement vereist. Coverage omvat federal district, circuit en Supreme Court opinions sourced van PACER en direct court feeds, evenals veel state courts. De database bevat momenteel meer dan 8,4 miljoen opinions en wordt continu bijgewerkt terwijl nieuwe decisies worden gepubliceerd.

## Waarom je dit nodig hebt

- 8,4 miljoen+ court opinions, vrij toegankelijk zonder per-document charge
- Federal district, circuit en Supreme Court opinions teruggaand naar decennia
- PACER docket data — volledige filing histories voor actieve en gesloten federal cases
- Judge profielen inclusief appointment history en recusal records
- Oral argument audio en transcripts voor cases waar beschikbaar
- Real-time feeds voor nieuwe filings en decisions

## Installatie

```bash
npm install -g @freelawproject/courtlistener-mcp
```

Of gebruik het remote SSE endpoint direct in je config — geen lokale install nodig (zie configuratie hieronder).

## Configuratie

**Lokaal (npx):**

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    }
  }
}
```

API key: gratis registratie op `courtlistener.com/sign-in/`. Anonieme toegang werkt maar is rate-limited. Een gratis account verhoogt de limit substantieel en is voldoende voor meeste research workflows.

## Wat het exposeert

| Tool | Wat het doet |
|---|---|
| `search_opinions` | Full-text search over alle court opinions met filters |
| `get_opinion` | Haal volledige opinion tekst op via ID of citation |
| `search_dockets` | Zoek PACER dockets naar case naam, nummer of court |
| `get_docket` | Volledige docket met alle filing entries en document links |
| `get_judge` | Judge profiel, appointment history en recusal record |
| `search_oral_arguments` | Zoek oral argument audio en transcripts |
| `get_court_info` | Court metadata en jurisdiction details |
| `cite_count` | Hoe vaak een case geciteerd is in volgende opinions |

## Voorbeeldprompts

```
"Find all Second Circuit opinions on fair use in software copyright from 2018–2026"

"Get the docket for Oracle v. Google in the Federal Circuit"

"Who are the current district court judges in SDNY and when were they appointed?"

"How many times has Campbell v. Acuff-Rose been cited in circuit court opinions?"

"Find recent EDVA opinions on preliminary injunctions in trade secret cases"
```

## Combineren met Westlaw

Voor ernstige juridische research, voer beide servers tezamen uit: CourtListener voor gratis breed zoeken en citation counting, Westlaw MCP voor full-text retrieval, shepardization, statutes en Practical Law documents. Gecombineerde config:

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    },
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

Workflow: gebruik `search_opinions` op CourtListener om relevante cases over een breed daterange gratis te identificeren, gebruik dan `get_case` en `shepardize` op Westlaw om volledige tekst op te halen en huidige validiteit te verifiëren voor de cases die ertoe doen.

## Privacygegevens

Alle data gediend door CourtListener is public record. Er zijn geen privilege concerns voor research queries. PACER docket data is openbaar, maar volledige document downloads voor items nog niet in CourtListener's cache incurren standaard PACER per-page fees (momenteel $0.10/page, gecapped op $3.00 per document). Opinions die CourtListener al heeft opgehaald en geïndexeerd zijn gratis gediend uit zijn eigen opslag.
