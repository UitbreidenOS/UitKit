# MCP: Vercel

Beheer Vercel-implementaties, -projecten, -domeinen en omgevingsvariabelen vanuit Claude Code — zonder het dashboard te openen of implementatielogboeken te copy-pasten.

## Waarom je dit nodig hebt

Implementatie-debugging betekent normaal gesproken: open Vercel-dashboard, zoek de mislukte implementatie, scroll door build-logboeken, kopieer de fout, plak in je editor. De Vercel MCP vouwt dit in één verzoek. Claude trekt de logboeken, leest de fout, volgt het naar het bronbestand en stelt de fix voor — alles in context.

## Installatie

```bash
npm install -g @vercel/mcp-server
```

## Configuratie

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": {
        "VERCEL_TOKEN": "YOUR_VERCEL_TOKEN",
        "VERCEL_TEAM_ID": "YOUR_TEAM_ID"
      }
    }
  }
}
```

`VERCEL_TEAM_ID` is alleen vereist voor team- of organisatie-implementaties. Persoonlijke projecten werken met alleen het token.

## Sleuteltools

| Tool | Wat het doet |
|---|---|
| `list_deployments` | Lijst recente implementaties voor een project met status |
| `get_deployment` | Volledige implementatiedetails inclusief build-metagegevens |
| `create_deployment` | Activeer een nieuwe implementatie vanuit een branch of commit |
| `list_projects` | Lijst alle projecten in het account of team |
| `get_project` | Projectconfiguratie en framework-instellingen |
| `list_domains` | Alle aangepaste domeinen die aan een project zijn gekoppeld |
| `add_domain` | Voeg een nieuw aangepast domein toe |
| `list_env_vars` | Lijst omgevingsvariabelen (waarden standaard gemaskeerd) |
| `upsert_env_var` | Voeg een omgevingsvariabele toe of werk deze bij (invoegen of overschrijven) |
| `delete_env_var` | Verwijder een omgevingsvariabele |
| `get_deployment_logs` | Stream build- en runtime-logboeken voor een implementatie |
| `rollback_deployment` | Draai onmiddellijk terug naar de vorige production-implementatie |

## Gebruiksvoorbeelden

```
Toon me de laatste 5 implementaties voor my-app en hun status

Welke fouten verschenen in de laatste mislukte implementatie van de checkout-service?

Voeg de STRIPE_SECRET_KEY-omgevingsvariabele toe aan production — waarde is sk_live_xxx

Draai production onmiddellijk terug naar de vorige implementatie

Lijst alle aangepaste domeinen die aan het storefront-project zijn gekoppeld

Waarom is de build 20 minuten geleden mislukt? Toon me de volledige logboeken.
```

## Verificatie

1. Ga naar [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Klik op **Create Token** — geef het een herkenbare naam (bijv. `claude-mcp`)
3. Stel bereik in op **Full Account** voor persoonlijke projecten of selecteer een specifiek team
4. Kopieer het token — het wordt eenmaal weergegeven
5. Voor teamimplementaties: zoek je Team-ID onder **Team Settings → General**

## Tips

- `get_deployment_logs` is de primaire reden om deze MCP te installeren — live-logboeken in Claude's context pipet is sneller dan een handmatige debug-workflow.
- `rollback_deployment` bouwt niet opnieuw — het promoot de vorige immutabele implementatie onmiddellijk naar production. Nul downtime.
- Combineer met de GitHub MCP om een volledige loop te bouwen: PR-samenvoegingen → implementatie-triggers → logboeken bevestigen succes → klaar.
- Omgevingsvariabelen die via `upsert_env_var` zijn toegevoegd, worden effectief bij de volgende implementatie — ze worden niet hot-reloaded.
- Gebruik `list_env_vars` om te controleren welke env-vars bestaan voordat je upsert; `upsert_env_var` overschrijft stille bestaande waarden.
- Preview-implementaties (van PR's) en production-implementaties zijn apart — geef de doel-omgeving op bij het uitvoeren van env-var-bewerkingen.

---
