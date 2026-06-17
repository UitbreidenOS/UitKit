Details: Siehe `mcp/salesforce.md`

### HubSpot (Empfohlen für Mid-Market/SMB)

Hole deinen Private App API Key. Füge zu `settings.json` hinzu:

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-hubspot"],
      "env": {
        "HUBSPOT_API_KEY": "pat-na1-xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}