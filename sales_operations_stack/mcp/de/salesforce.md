# Salesforce MCP-Konfiguration

## Zweck

Verbindet Salesforce CRM für die Echtzeit-Pipeline-Datenextraktion, Deal-Abfragen und Opportunity-Management innerhalb von Claude Code.

## Wann zu verwenden

- Beim Ausführen von `/analyze-pipeline` — aktuelle Opportunities und Staging-Verlauf abfragen
- Beim Ausführen von Quota- und Gebiet-Analysen — Aggregation nach Vertreter, Gebiet und Konto
- Beim Protokollieren von Aktivitäten in der Sitzung — Aktivitäten und Notizen in Salesforce-Datensätze schreiben

## Setup-Schritte

### 1. Salesforce-API-Anmeldedaten abrufen

1. Melden Sie sich bei Ihrer Salesforce-Organisation an
2. Gehen Sie zu **Setup** → **Apps** → **App Manager**
3. Erstellen Sie eine neue **Connected App**:
   - Name: "Claude Code Sales Ops"
   - OAuth 2.0-Einstellungen aktivieren
   - Callback URL: `http://localhost:8000` (lokale Entwicklung)
   - Scopes: `api`, `refresh_token`, `offline_access`
4. Kopieren Sie **Consumer Key** und **Consumer Secret**
5. Generieren Sie **Security Token** (Setup → Personal Setup → Security → Reset Security Token)

### 2. settings.json konfigurieren

Fügen Sie zu `.claude/settings.json` hinzu:

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