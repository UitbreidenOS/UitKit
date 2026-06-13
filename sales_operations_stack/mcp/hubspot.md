# HubSpot MCP Configuration

## What This Does

Integrates HubSpot CRM as MCP server for Claude Code. Enables direct pipeline queries, deal reads/writes, and quota tracking from within Claude sessions.

## When to Use

- Running `/pipeline-review` — query pipeline directly from HubSpot
- Running `/deal-deep-dive [deal-id]` — fetch deal details from HubSpot
- Logging approvals/actions — write activities to deal records
- Running quota-tracker and territory-optimizer — aggregate deals by owner/team from CRM

## Setup Steps

### 1. Get HubSpot API Key

1. Log into your HubSpot account
2. Go to **Settings** → **Integrations** → **Private Apps**
3. Create new private app: "Claude Code Sales Ops"
4. Scopes needed:
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `crm.objects.contacts.read`
   - `crm.objects.accounts.read`
   - `crm.objects.companies.read`
5. Copy **Private App Access Token**

### 2. Configure settings.json

Add to `.claude/settings.json`:

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
```

### 3. Test Connection

Restart Claude Code. Test with:
```
/pipeline-review
```

If HubSpot tools appear in tool list, connection is working.

---

## Available Tools

Once configured, you can:

**Read Deals:**
- Query deals by owner, stage, amount range, create date
- Fetch single deal details (owner, company, contacts, amount, stage, close date)
- Extract custom properties (ICP score, risk level, etc.)

**Read Contacts/Companies:**
- Look up company names, industry, employee count, revenue
- Find contacts by company

**Write Activities:**
- Create task on deal
- Log call/email activity
- Update deal properties (stage, amount, close date)
- Add notes to deal

**Query Lists/Filters:**
- Get deals by custom HubSpot filter/list
- Run HubSpot reports via API

---

## Example Queries in Claude

**Query pipeline for specific owner:**
```
Use HubSpot MCP to fetch all deals owned by "Sarah K" 
where stage is not "Closed Won" and not "Closed Lost".
Return: deal name, amount, stage, close date, last modified date.
```

**Write activity to deal:**
```
Log to HubSpot deal "Apex Industries Platform" (ID: 123456789):
Create task: "VP approved deal 2026-06-12. Risk score: 64/100. Follow up on contract signature."
```

---

## Alternative: Salesforce MCP

If your CRM is Salesforce instead:
- Configuration is similar; use Salesforce instance URL + OAuth credentials
- Query structure remains the same (opportunities, accounts, contacts)
- See `salesforce.md` in this directory

---
