# MCP Connections

## Overview

This Solutions Architect Stack uses specialized MCP (Model Context Protocol) servers for web research, API documentation, and system design tools.

---

## Web Search & Scraping

### Web Search (Built-in)

Used for: Competitor research, technology benchmarking, industry trends, real-time news about target companies.

**When to use:**
- Researching emerging technologies for architecture decisions
- Understanding competitor approaches to similar problems
- Finding latest performance benchmarks or best practices
- Gathering compliance/regulatory information

**Example:**
```
Search: "microservices scalability patterns 2026"
Result: Latest articles on service mesh, containerization, cloud-native design
```

### Firecrawl (Recommended for Setup)

Get API key: [firecrawl.dev](https://firecrawl.dev/)

**What it does:** Deep web scraping for technical documentation, architecture patterns, API specifications from competitor products.

**settings.json:**
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["@firecrawl/mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-key-here"
      }
    }
  }
}
```

**When to use:**
- Analyzing competitor product architecture (what tech stack do they use?)
- Extracting API documentation from live websites
- Scraping technical blogs for design patterns
- Gathering integration documentation for third-party systems

---

## System Design & Diagramming

### No Direct MCP Required

System architecture diagrams are created using ASCII art or Mermaid syntax (embedded in markdown). These work offline and don't require external tools.

**Mermaid example:**
```
graph TD
    A[API Gateway] --> B[Service 1]
    A --> C[Service 2]
    B --> D[Database]
    C --> D
```

**To render Mermaid diagrams:**
- Use [mermaid.live](https://mermaid.live) to preview
- Most markdown editors and GitHub support Mermaid natively

---

## Documentation & Knowledge

### No Direct MCP Required

API contract documentation is written in OpenAPI 3.0 or GraphQL SDL format (text-based, no external tools needed).

**OpenAPI tools** (optional, for validation):
- [Swagger Editor](https://swagger.io/tools/swagger-editor/) — validate and visualize OpenAPI specs
- [Spectacle](https://sourcey.com/spectacle) — convert OpenAPI to beautiful HTML docs

---

## Optional Enhancements

### Exa (Real-Time Web Search)

Get API key: [exa.ai](https://exa.ai/)

**Use case:** Research the latest technology trends, find academic papers on system design, discover new tools/frameworks for architecture.

**settings.json:**
```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["@exa/mcp"],
      "env": {
        "EXA_API_KEY": "your-key-here"
      }
    }
  }
}
```

---

## GitHub API (for Competitor/Reference Analysis)

If researching open-source architectures:

**Use the `gh` CLI** (built-in):
```bash
gh api repos/owner/repo
gh search repos --language=go --stars=">10000" --sort=stars
```

**Example workflow:**
```bash
# Find popular microservices frameworks
gh search repos --language=go --topic=microservices --stars=">5000" --sort=stars
```

---

## Recommended Setup Order

1. ✅ **Web Search** (built-in, no setup needed)
2. 📝 **Firecrawl** (install first for competitor/documentation research)
3. 🔍 **Exa** (optional, for deeper trend research)
4. 🐙 **GitHub CLI** (already installed, use for open-source analysis)

---

## No Setup Needed

- ASCII/Mermaid diagrams (works offline)
- OpenAPI/GraphQL specs (text-based)
- Markdown documents (no external dependencies)
- Load testing tools (typically run locally: k6, JMeter, custom scripts)

---
