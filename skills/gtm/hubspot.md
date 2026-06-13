---
name: hubspot
description: "HubSpot CRM automation: MCP server setup, contacts/deals/tickets via API, data enrichment pipelines, CRM workflows — the official Anthropic-HubSpot integration"
updated: 2026-06-13
---

# HubSpot Skill

## When to activate
- Setting up the official HubSpot MCP server for Claude Code
- Reading or writing HubSpot CRM data (contacts, companies, deals, tickets, notes)
- Building a lead enrichment pipeline that populates HubSpot records
- Automating deal stage updates based on external triggers
- Creating contacts and notes from research or meeting outputs
- Running CRM hygiene: deduplication, missing fields, stale records

## When NOT to use
- Salesforce CRM — different API and object model
- Simple Stripe/payment data — use the Stripe skill
- When you need real-time event webhooks from HubSpot — use a webhook receiver endpoint

## Instructions

### Setup — HubSpot MCP Server (official)

HubSpot has an official MCP server. There are three ways to connect:

**Option 1: OAuth connector (simplest — Claude.ai desktop)**
1. Claude.ai → Settings → Integrations → HubSpot → Connect
2. Authenticate with your HubSpot account
3. Claude can now read/write your CRM natively

**Option 2: MCP server (Claude Code — programmatic)**
```json
// ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "${HUBSPOT_ACCESS_TOKEN}"
      }
    }
  }
}
```

Get your access token: HubSpot → Settings → Integrations → Private Apps → Create a private app. Scopes needed: `crm.objects.contacts.read`, `crm.objects.contacts.write`, `crm.objects.companies.read`, `crm.objects.deals.read`, `crm.objects.deals.write`.

**Option 3: Direct HubSpot API (scripts/automations)**
```typescript
import { Client } from '@hubspot/api-client'

const hubspot = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN })
```

### Available MCP tools (via the MCP server)

| Tool | What it does |
|------|-------------|
| `search_contacts` | Search contacts by email, name, company, or properties |
| `get_contact` | Get full contact record by ID |
| `create_contact` | Create a new contact with properties |
| `update_contact` | Update contact properties |
| `search_companies` | Search companies by name, domain, industry |
| `create_company` | Create a new company |
| `get_deals` | List deals, filter by stage or owner |
| `create_deal` | Create a new deal with associations |
| `create_note` | Add a note to a contact, company, or deal |
| `create_ticket` | Create a support ticket |

### Common patterns

**Create or update a contact (upsert):**
```typescript
// Search first, create if not found
async function upsertContact(email: string, props: Partial<Contact>) {
  const existing = await hubspot.crm.contacts.searchApi.doSearch({
    filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
    properties: ['email', 'firstname', 'lastname', 'company'],
    limit: 1,
  })

  if (existing.results.length > 0) {
    return hubspot.crm.contacts.basicApi.update(existing.results[0].id, { properties: props })
  }

  return hubspot.crm.contacts.basicApi.create({ properties: { email, ...props } })
}
```

**Log a meeting note to a contact:**
```typescript
async function logMeetingNote(contactId: string, summary: string) {
  return hubspot.crm.objects.notes.basicApi.create({
    properties: {
      hs_note_body: summary,
      hs_timestamp: Date.now().toString(),
    },
    associations: [{
      to: { id: contactId },
      types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
    }],
  })
}
```

**Bulk enrich contacts from research:**
```typescript
async function enrichContactsFromResearch(leads: LeadData[]) {
  for (const lead of leads) {
    await upsertContact(lead.email, {
      firstname:     lead.firstName,
      lastname:      lead.lastName,
      company:       lead.company,
      jobtitle:      lead.title,
      phone:         lead.phone,
      hs_lead_status: 'NEW',
      lifecyclestage: 'lead',
    })
    await new Promise(r => setTimeout(r, 100)) // rate limit: 10 req/s
  }
}
```

**Update deal stage:**
```typescript
async function advanceDealStage(dealId: string, stage: string) {
  return hubspot.crm.deals.basicApi.update(dealId, {
    properties: { dealstage: stage },
  })
}

// Stage IDs (get yours from HubSpot → Sales → Deals → Edit pipeline)
// Common: 'appointmentscheduled', 'qualifiedtobuy', 'presentationscheduled',
//         'decisionmakerboughtin', 'contractsent', 'closedwon', 'closedlost'
```

**Search for stale contacts (CRM hygiene):**
```typescript
async function findStaleContacts(daysInactive = 90) {
  const cutoff = Date.now() - daysInactive * 24 * 60 * 60 * 1000

  const results = await hubspot.crm.contacts.searchApi.doSearch({
    filterGroups: [{
      filters: [
        { propertyName: 'hs_last_sales_activity_date', operator: 'LT', value: cutoff.toString() },
        { propertyName: 'lifecyclestage', operator: 'EQ', value: 'lead' },
      ],
    }],
    properties: ['email', 'firstname', 'lastname', 'hs_last_sales_activity_date'],
    limit: 100,
  })

  return results.results
}
```

### Rate limits

| API tier | Limit |
|---|---|
| Free/Starter | 100 requests/10 seconds |
| Professional/Enterprise | 150 requests/10 seconds |
| Burst | Up to 200 requests/second briefly |

Always add `await new Promise(r => setTimeout(r, 100))` between bulk operations.

### Via Claude Code (natural language with MCP)

Once the MCP server is connected, you can tell Claude:
```
Find all contacts at Acme Corp and add a note saying we discussed their Q3 expansion plans.
```
```
Create a new deal for alice@company.com at the Proposal stage, $25,000, closing next month.
```
```
Show me all deals in the negotiation stage that haven't been updated in 2 weeks.
```

## Example

**User:** Build a script that takes a list of CSV leads (name, email, company, LinkedIn URL) and creates/updates HubSpot contacts, logging a note with the source of each lead.

**Expected output:**
- `scripts/import-leads.ts` — reads CSV, calls `upsertContact()` for each row
- `upsertContact(email, props)` — search + create/update pattern
- `logNote(contactId, 'Imported from LinkedIn campaign — 2026-05-20')` after each upsert
- Rate limiting: 100ms delay between contacts
- Error handling: log failed rows to `failed-imports.csv` for retry

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
