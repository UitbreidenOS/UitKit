# MCP Connections & Integration Guide

## Overview

Sales Operations Stack integrates with multiple MCPs for real-time pipeline data, analytics, and reporting.

---

## Quick Start

### Option 1: Salesforce

Your Salesforce org is your single source of truth for pipeline.

**Setup:** Follow `salesforce.md` in this directory.

**What you get:**
- Real-time opportunity queries
- Automatic activity logging to opportunities
- Deal data in `/pipeline-review`, `/deal-deep-dive`, `/territory-analysis`
- Quota tracking directly from CRM

### Option 2: HubSpot

Your HubSpot account is your single source of truth for deals.

**Setup:** Follow `hubspot.md` in this directory.

**What you get:**
- Real-time deal queries
- Automatic activity logging to deals
- Deal data in `/pipeline-review`, `/deal-deep-dive`, `/territory-analysis`
- Quota tracking directly from CRM

---

## Which Should You Choose?

| Factor | Salesforce | HubSpot |
|--------|-----------|---------|
| **Enterprise orgs** | ✓ (standard choice) | ✓ (growing option) |
| **Mid-market** | ✓ (common) | ✓ (very common) |
| **Setup complexity** | Medium (OAuth) | Low (API key) |
| **Custom fields** | Highly customizable | Customizable |
| **Reports** | Advanced reporting engine | Good reporting |
| **Pricing** | Usually higher | Usually lower |

**Decision:** Ask your sales/rev-ops team which CRM you use. Configure that one.

---

## Setup Checklist

- [ ] **Choose CRM:** Salesforce or HubSpot?
- [ ] **Get credentials:** API key or OAuth (depends on CRM)
- [ ] **Add to settings.json:** Copy config from appropriate .md file
- [ ] **Restart Claude Code:** For MCP server to activate
- [ ] **Test connection:** Run `/pipeline-review` (should show CRM tools in list)
- [ ] **Validate data:** Export small pipeline sample and verify queries work

---

## Data Permissions

### Salesforce

Ensure your API user has:
- Read access to Opportunity object
- Read access to Account object
- Read access to Contact object (if using for buying committee mapping)
- Write access to Task object (for activity logging)

### HubSpot

Ensure your private app has scopes:
- `crm.objects.deals.read`
- `crm.objects.deals.write`
- `crm.objects.contacts.read`
- `crm.objects.companies.read`

---

## Optional: Dual CRM Setup

If you use both Salesforce and HubSpot (e.g., Salesforce for enterprise, HubSpot for SMB pipeline):

```json
{
  "mcpServers": {
    "salesforce": { ... },
    "hubspot": { ... }
  }
}
```

Claude will route queries to both and you can specify which CRM to prioritize per command.

---

## Troubleshooting

**"Salesforce tools not appearing in tool list"**
- Check API credentials in settings.json
- Verify network access to Salesforce instance
- Check security token is correct (reset in Setup if unsure)
- Restart Claude Code

**"HubSpot connection failed"**
- Verify API key is valid (check in HubSpot → Settings)
- Ensure private app has required scopes
- Check network access to HubSpot API
- Restart Claude Code

**"Queries returning empty results"**
- Verify CRM has data in specified fields
- Check user permissions (read access to objects)
- Use CRM's native search/report to confirm data exists

---

## Next Steps

1. **Configure your CRM:** Follow `salesforce.md` or `hubspot.md`
2. **Test with `/pipeline-review`:** Provide sample pipeline CSV; Claude will fetch and validate CRM data
3. **Integrate into weekly workflow:** Run `/pipeline-review` every Friday before exec updates

---
