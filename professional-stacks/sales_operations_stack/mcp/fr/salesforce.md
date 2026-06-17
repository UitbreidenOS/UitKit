# Configuration MCP Salesforce

## Objectif

Connecte Salesforce CRM pour l'extraction en temps réel des données de pipeline, les requêtes de deals et la gestion des opportunités depuis Claude Code.

## Quand utiliser

- Exécuter `/analyze-pipeline` — interroger les opportunités actuelles et l'historique des étapes
- Exécuter les analyses de quota et de territoire — agréger par représentant, territoire et compte
- Enregistrer les actions dans la session — écrire les activités et les notes aux enregistrements Salesforce

## Étapes de configuration

### 1. Obtenir les identifiants d'API Salesforce

1. Connectez-vous à votre org Salesforce
2. Allez à **Setup** → **Apps** → **App Manager**
3. Créez une nouvelle **Connected App** :
   - Nom : "Claude Code Sales Ops"
   - Activez les paramètres OAuth 2.0
   - URL de rappel : `http://localhost:8000` (développement local)
   - Portées : `api`, `refresh_token`, `offline_access`
4. Copiez la **Clé de consommateur** et le **Secret de consommateur**
5. Générez un **Jeton de sécurité** (Setup → Personal Setup → Security → Reset Security Token)

### 2. Configurer settings.json

Ajoutez à `.claude/settings.json` :

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