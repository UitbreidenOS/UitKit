# MCP: Cloudflare

Beheer de volledige Cloudflare-edge-stack — Workers, R2, D1, KV, DNS, Pages, AI en Zero Trust — vanuit Claude Code via een familie van 16 gespecialiseerde MCP-modules.

## Waarom je dit nodig hebt

Het Cloudflare-dashboard omvat tientallen productgebieden verdeeld over meerdere navigatielagen. Het Cloudflare MCP-ecosysteem verkleint dit tot directe tool-aanroepen: implementeer een Worker, werk een DNS-record bij, voer een D1 SQL-query uit of roep een Workers AI-model aan — alles uit één Claude Code-sessie. Elke module is onafhankelijk, dus je schakelt alleen in wat je project gebruikt.

## Installatie

```bash
npx -y @cloudflare/mcp-server-cloudflare <module>
```

Vervang `<module>` door de specifieke servicenaam (bijv. `workers`, `dns`, `d1`). Elke module wordt uitgevoerd als een afzonderlijk MCP-server-item.

## Configuratie

Elke module wordt als een afzonderlijke server geregistreerd, zodat je ze afzonderlijk kunt in- en uitschakelen:

```json
{
  "mcpServers": {
    "cloudflare-workers": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "workers"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    },
    "cloudflare-dns": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "dns"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    },
    "cloudflare-d1": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "d1"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

Voeg modules afzonderlijk aan je configuratie toe of verwijder ze.

## Sleuteltools

### workers
Implementeer, werk bij en verwijder Worker-scripts. Bekijk logboeken en volg realtime-uitvoer.

### r2
Maak buckets aan en verwijder ze. Upload, download en lijst objecten in R2-opslag.

### d1
Maak D1-databases aan. Voer SQL-queries uit. Voer schema-migraties uit.

### kv
Lees, schrijf en verwijder items in KV-naamruimten. Listsleutels met voorvoegselfilters.

### pages
Lijst en maak Pages-implementaties. Beheer aangepaste domeinen op Pages-projecten.

### dns
Voeg DNS-records toe, werk ze bij en verwijder ze (A, AAAA, CNAME, MX, TXT, SRV).

### ai
Voer Workers AI-modellen uit: tekstgeneratie, afbeeldingsgeneratie, spraak-naar-tekst en insluitingen.

### analytics
Query Web Analytics-ereignisgegevens. Toegang tot Zaraz-analyticsconfiguratie.

### zero-trust
Beheer Zero Trust-toegangsbeleid, tunnels en apparaathouding-regels.

## Gebruiksvoorbeelden

```
Implementeer mijn bijgewerkte worker-script naar productie-zone example.com

Voeg een CNAME-record toe voor api.example.com die verwijst naar my-load-balancer.com

Query de laatste 100 rijen van mijn D1-analyticsdatabase

Voer Workers AI llama-3 tekstgeneratie uit met deze prompt

Toon webanalytics voor de afgelopen 7 dagen verdeeld naar land

Upload dit JSON-bestand naar de my-app-assets R2-bucket

Schrijf een KV-item: key=feature_flags value={"dark_mode":true}

Lijst alle actieve Zero Trust-toegangsbeleid voor het beheerdersubdomein
```

## Verificatie

1. Ga naar [cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Klik op **Token maken** — gebruik **Aangepast token maken**
3. Stel machtigingen in op basis van de modules die je inschakelt:
   - DNS-module: `Zone → DNS → Bewerken`
   - Workers-module: `Account → Worker-scripts → Bewerken`
   - R2-module: `Account → R2-opslag → Bewerken`
   - D1-module: `Account → D1 → Bewerken`
   - Zero Trust-module: `Account → Access: Organizations, Identity Providers, and Groups → Bewerken`
4. Vind je account-ID in de Cloudflare-dashboardzijbalk (rechterkant van een zone-overzichtspagina)
5. Stel zowel `CLOUDFLARE_API_TOKEN` als `CLOUDFLARE_ACCOUNT_ID` in in het env-blok voor elke module

Één token kan meerdere machtigingssets dragen — je hebt niet één token per module nodig.

## Tips

- Registreer elke module als een afzonderlijke benoemde MCP-server (`cloudflare-workers`, `cloudflare-dns`, enz.) zodat je ongebruikte modules kunt uitcommentariëren zonder de anderen aan te raken.
- Workers AI (`ai`-module) geeft toegang tot Cloudflare-gehoste modellen — Llama 3, Mistral, Whisper, SDXL — zonder extra API-sleutelkosten buiten je Cloudflare-account.
- Zero Trust-module vereist machtiging `Access: Organizations, Identity Providers, and Groups` op je token — dit is gescheiden van de standaard zone/account-machtigingen.
- D1 `execute_sql` ondersteunt lezen en schrijven — gebruik het direct voor eenmalige queries of voeg het in in migratiewerkstromen naast het Neon MCP voor multi-databaseprojecten.
- `kv`-bewerkingen zijn uiteindelijk consistent op de Cloudflare-edge — leesbewerkingen kunnen tot 60 seconden achter schrijfbewerkingen liggen in verre regio's.
- De `dns`-module is de snelste manier om DNS-wijzigingen programmatisch te beheren — wijzigingen propageren binnen seconden op Cloudflare-beheerde zones.

---
