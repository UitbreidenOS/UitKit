# Salesforce MCP-configuratie

## Doel

Verbindt Salesforce CRM voor real-time extraction van pipelinegegevens, dealquery's en opportuniteitsbeheer vanuit Claude Code.

## Wanneer te gebruiken

- `/analyze-pipeline` uitvoeren — actuele opportunities en stageverloop opvragen
- Quota- en territoriumanalyses uitvoeren — aggregeren per vertegenwoordiger, territorium en account
- Acties in sessie registreren — activiteiten en notities naar Salesforce-records schrijven

## Installatiestappen

### 1. Salesforce API-referenties ophalen

1. Meld u aan bij uw Salesforce-organisatie
2. Ga naar **Setup** → **Apps** → **App Manager**
3. Maak een nieuwe **Connected App** aan:
   - Naam: "Claude Code Sales Ops"
   - OAuth 2.0-instellingen inschakelen
   - Callback URL: `http://localhost:8000` (lokale ontwikkeling)
   - Scopes: `api`, `refresh_token`, `offline_access`
4. Kopieer **Consumer Key** en **Consumer Secret**
5. Genereer **Security Token** (Setup → Personal Setup → Security → Reset Security Token)

### 2. settings.json configureren

Voeg toe aan `.claude/settings.json`:

```json
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-salesforce"],
      "env": {
        "SALESFORCE_INSTANCE_URL": "https://yourorg.salesforce.com",
        "SALESFORCE_CLIENT_ID": "your-consumer-key",
        "SALESFORCE_CLIENT_SECRET": "your-consumer-secret",
        "SALESFORCE_USERNAME": "your-username@yourorg.com",
        "SALESFORCE_PASSWORD": "your-password",
        "SALESFORCE_SECURITY_TOKEN": "your-security-token"
      }
    }
  }
}