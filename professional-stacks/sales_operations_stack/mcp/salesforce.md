# Salesforce MCP Configuration

## Purpose

Connects Salesforce CRM for real-time pipeline data extraction, deal queries, and opportunity management from within Claude Code.

## When to use

- Running `/analyze-pipeline` — query current opportunities and stage history
- Running quota and territory analyses — aggregate by rep, territory, and account
- Logging actions to session — write activities and notes to Salesforce records

## Setup Steps

### 1. Get Salesforce API Credentials

1. Log into your Salesforce org
2. Go to **Setup** → **Apps** → **App Manager**
3. Create new **Connected App**:
   - Name: "Claude Code Sales Ops"
   - Enable OAuth 2.0 settings
   - Callback URL: `http://localhost:8000` (local dev)
   - Scopes: `api`, `refresh_token`, `offline_access`
4. Copy **Consumer Key** and **Consumer Secret**
5. Generate **Security Token** (Setup → Personal Setup → Security → Reset Security Token)

### 2. Configure settings.json

Add to `.claude/settings.json`:

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
```

### 3. Test Connection

Restart Claude Code. Test with:
```
/pipeline-review
```

If Salesforce tools appear in tool list, connection is working.

---

## Available Tools

Once configured, you can:

**Read Opportunities:**
- Query opportunities by rep, stage, amount range
- Fetch single opportunity details (owner, contacts, amount, stage, close date)
- Extract custom fields (ICP score, risk level, etc.)

**Write Activities:**
- Log task/activity to opportunity record
- Update opportunity stage, amount, close date
- Add notes to opportunity

**Query Reports:**
- Run Salesforce reports via API (if configured)
- Get formatted pipeline data

**Contact/Account Queries:**
- Look up account names, industry, employee count
- Find contact roles by account

---

## Example Queries in Claude

**Query pipeline for specific rep:**
```
Use Salesforce MCP to fetch all opportunities for rep "Sarah K" 
where stage is not "Closed-Won" and not "Closed-Lost".
Return: deal name, value, stage, close date, last activity date.
```

**Write activity to opportunity:**
```
Log to Salesforce opportunity "Apex Industries" (ID: 0061...):
Activity: "VP approved deal 2026-06-12. Risk score: 64/100."
```

---

## Alternative: HubSpot MCP

If your CRM is HubSpot instead:
- Configuration is similar; swap `SALESFORCE_*` env vars for `HUBSPOT_API_KEY`
- Query structure remains the same (opportunities/deals, contacts, activities)
- See `hubspot.md` in this directory

---
