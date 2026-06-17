# MCP: CRM Integration

Connector for Salesforce, HubSpot, or Pipedrive.

## Supported Operations

- `get_account(name)` — Fetch account record
- `get_contacts(account_id)` — List contacts
- `log_activity(account_id, type, notes)` — Record interaction
- `update_renewal_date(account_id, date)` — Set renewal expectation
- `get_opportunities(account_id)` — List open deals

## Configuration

```json
{
  "mcp": {
    "crm": {
      "provider": "salesforce|hubspot|pipedrive",
      "api_key": "YOUR_API_KEY",
      "org_id": "YOUR_ORG"
    }
  }
}
```

## Status

Stub — awaiting API documentation
