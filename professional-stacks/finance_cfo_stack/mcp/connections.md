# MCP Configuration — Data Connections

Finance/CFO Stack integrates with common data sources for real-time financial data access.

## Accounting Systems

### QuickBooks Online
- **What:** Real-time GL, balance sheet, income statement, cash flow statement.
- **Setup:** Add MCP server configuration with API token from QuickBooks developer console.
- **Use case:** Pull latest actual data for variance analysis and budget vs. actual reconciliation.

### Netsuite / Oracle NetSuite
- **What:** Multi-subsidiary GL, balance sheet, cash flow data.
- **Setup:** OAuth integration with Netsuite instance.
- **Use case:** Consolidated financial reporting, multi-entity balance sheet analysis.

### Xero
- **What:** GL, invoices, P&L, balance sheet.
- **Setup:** OAuth integration with Xero API.
- **Use case:** SMB financial data pulls for variance analysis and cash flow forecasting.

## Spreadsheet / Data Export

### CSV / Excel Upload
- **What:** Manual upload of budget files, GL exports, headcount data.
- **Setup:** File-based input (user uploads to session).
- **Use case:** Ad-hoc analysis when accounting system integration not available.

## Recommended Setup

Add to `settings.json`:

```json
{
  "mcpServers": {
    "quickbooks": {
      "command": "npx",
      "args": ["@quickbooks/mcp"],
      "env": {
        "QB_REALM_ID": "your-realm-id",
        "QB_API_KEY": "your-api-key"
      }
    }
  }
}
```

---

See `data-sources.md` for detailed integration guides.
