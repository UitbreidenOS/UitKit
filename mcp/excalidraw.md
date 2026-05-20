# MCP: Excalidraw Diagram Generator

Generate architecture diagrams, flowcharts, and system maps directly from Claude Code. Describe your system in plain English — Claude draws the diagram.

## Why you need this

Architecture diagrams are invaluable but slow to make manually. With the Excalidraw MCP server, Claude can:
- Convert a codebase description to a system architecture diagram
- Draw data flow diagrams from API endpoint descriptions
- Create sequence diagrams for complex workflows
- Update existing diagrams when the architecture changes

## Configuration

```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "npx",
      "args": ["-y", "excalidraw-mcp-server"]
    }
  }
}
```

## How to use

```
# Architecture diagram
"Draw a system architecture diagram for our app:
 - React frontend on Vercel
 - Express API on Railway
 - PostgreSQL on Neon
 - Redis cache on Upstash
 - Stripe for payments"

# Data flow
"Create a sequence diagram for the user authentication flow:
 login form → Express API → check database → generate JWT → return to client"

# Service map
"Draw a microservices map showing how these services communicate: [describe services]"
```

## Output formats

- **Excalidraw JSON** — open in excalidraw.com or VS Code extension
- **SVG** — embed in README or docs
- **PNG** — for presentations and Notion

## Saving diagrams

```
"Save the architecture diagram as docs/architecture.excalidraw"
```

Claude saves it directly to your project. Commit it — Excalidraw files are version-controlled JSON, so diffs are meaningful.

## Combine with the codebase-onboarding skill

Generate diagrams as part of onboarding documentation:
```
"Read the codebase structure and generate:
1. A system architecture diagram
2. A data model diagram from the Prisma schema
3. A deployment diagram based on the infrastructure config"
```
