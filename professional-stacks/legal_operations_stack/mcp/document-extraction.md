# MCP: Document Extraction

Configure document parsing and extraction tools for contract analysis.

---

## Overview

Document extraction MCPs enable Claude to:
- Parse PDF, DOCX, and other legal document formats
- Extract text, tables, and structured data
- Identify contract sections and clauses
- Support contract compliance analysis and risk extraction

---

## Recommended MCP Servers

### Option 1: Firecrawl (for web-based documents)

For contracts hosted on web pages or accessible via URL.

**Setup:**

1. Get your Firecrawl API key at [firecrawl.dev](https://www.firecrawl.dev/)
2. Add to `settings.json`:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "your-key-here" }
    }
  }
}
```

**Use Case:** Extract text from web-based contracts, SaaS agreements, or HTML documents.

---

### Option 2: Local Document Processing

For local file-based contracts (PDFs, DOCX, TXT).

**Setup:**

Use Claude's built-in file reading capabilities:
- Read `.pdf` files via `/read` or Read tool
- Extract `.docx` as text via conversion tools
- Parse `.txt` directly

**Limitations:** 
- Large PDFs (>20 pages) may be slow
- Formatted documents lose some structure
- Tables may not parse perfectly

---

### Option 3: Anthropic Files API (Recommended)

For enterprise document handling with caching and efficient processing.

**Setup:**

Configure Files API in your application:

```json
{
  "mcp": {
    "anthropic-files": {
      "enabled": true,
      "caching": true,
      "maxFileSize": 100000000
    }
  }
}
```

**Use Case:** Upload contracts once, query multiple times with prompt caching for faster analysis.

---

## Implementation Guidelines

### 1. Contract Intake

When a new contract is received:

```bash
# Store contract locally or reference via URL
FILE_PATH="/path/to/contract.pdf"
# or
URL="https://example.com/contracts/agreement.pdf"

# Extract text using chosen MCP or Read tool
# Then run contract-reviewer skill
```

### 2. Text Extraction

For best results with PDFs:
- Use Firecrawl for web-hosted contracts
- Use local Read tool + text parsing for local PDFs
- Request HTML or DOCX version if available (better structure)

### 3. Contract Analysis

After extraction, pass text to:
- `contract-reviewer` — Full analysis
- `risk-extractor` — Risk-specific analysis
- `compliance-analyzer` — Regulatory validation

---

## Supported Document Types

| Format | Tool | Speed | Quality | Cost |
|---|---|---|---|---|
| PDF (web) | Firecrawl | Fast | High | API per request |
| PDF (local) | Local Read + parse | Slow | Medium | Free |
| DOCX | Local conversion | Medium | High | Free |
| HTML | Firecrawl | Fast | High | API per request |
| TXT | Local Read | Very fast | High | Free |
| DOC (legacy) | Manual conversion | Slow | Low | Paid tools |

---

## Workflow Example

```
1. Contract Received
   ↓
2. Extract via Firecrawl or Local Read
   ↓
3. Run /contract-review
   ├─ contract-reviewer analyzes text
   ├─ risk-extractor flags high-risk clauses
   └─ deadline-tracker extracts renewal dates
   ↓
4. Run /compliance-check [framework]
   ├─ compliance-analyzer validates against GDPR/SOC 2/ISO 27001
   └─ Returns compliance gaps
   ↓
5. Run /deadline-tracker
   ├─ Logs renewal dates
   └─ Sets alerts for 60/30/14 days
   ↓
6. Log all actions to session-log.md
```

---

## Configuration Tips

- **For web contracts:** Use Firecrawl + URL
- **For local contracts:** Use local Read tool
- **For large batches:** Use Files API with caching
- **For sensitive contracts:** Store locally, use local Read tool only

---

## Troubleshooting

**Problem:** PDF text extraction is garbled or incomplete
- **Solution:** Request HTML or DOCX version from counterparty
- **Fallback:** Use Firecrawl if document is web-hosted

**Problem:** Large contracts timeout during analysis
- **Solution:** Split contract into sections; analyze separately
- **Alternative:** Use Files API with caching for faster reuse

**Problem:** Table data from contracts is lost
- **Solution:** Request DOCX or spreadsheet version
- **Workaround:** Ask Claude to re-extract table structure from text

---

## Security & Privacy

- Never share contract URLs or documents in logs
- Keep sensitive contracts stored locally, not on cloud services
- Use Files API with encryption for sensitive documents
- Audit all document access via `document-audit-trail` hook

---

## Next Steps

1. Choose your MCP tool (Firecrawl for web, local Read for files, Files API for enterprise)
2. Configure in `settings.json`
3. Test with a non-sensitive contract
4. Run `/contract-review [test-contract]` to verify extraction
5. Deploy to production

---
