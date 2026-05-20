# MCP: Persistent Memory

Give Claude Code memory that persists across sessions. By default, Claude forgets everything when a session ends. This MCP server stores facts, decisions, and context in a local knowledge graph that Claude can query on any future session.

## Why you need this

Without memory, every Claude Code session starts from scratch. With persistent memory:
- Claude remembers your preferences, coding style, and past decisions
- No need to re-explain project context every session
- Claude can recall specific functions, bugs fixed, or architecture decisions from weeks ago
- Knowledge builds up over time instead of evaporating after every `/compact`

## Installation

```bash
# The most popular memory server
npm install -g @modelcontextprotocol/server-memory

# Or use the npx version (no install)
# Just reference it in your config below
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "/Users/your-name/.claude/memory/knowledge.json"
      }
    }
  }
}
```

## What it stores

The memory server uses a **knowledge graph** — entities and relationships:

```
Entity: "authentication system"
  → Relations: "uses JWT", "built in May 2026", "has refresh token issue"
  
Entity: "database schema"
  → Relations: "uses PostgreSQL", "has 3 tables", "users table has soft delete"
```

## Using memory in sessions

```
# Tell Claude to remember something
"Remember that we decided to use Zod for all API validation"

# Claude stores: entity("validation-decision") → uses("Zod")

# Next session — Claude retrieves this automatically when relevant
# Or ask directly:
"What validation library did we decide on for this project?"
```

## Automatic memory triggers

Claude will automatically:
- Store new architectural decisions when you make them
- Remember bugs and their fixes
- Track your coding preferences as they come up
- Remember external services and their configurations

## Storage location

Default: `~/.claude/memory/knowledge.json`
- Human-readable JSON — you can inspect and edit it
- Portable — back it up, sync across machines
- Lightweight — typically < 1MB even after months of use

## Privacy

All memory is stored locally. Nothing leaves your machine. The MCP server reads/writes a local JSON file only.

## Combine with CLAUDE.md

Memory MCP complements (doesn't replace) CLAUDE.md:
- **CLAUDE.md** — stable project context that's always loaded, version-controlled
- **Memory MCP** — dynamic, session-by-session knowledge that grows over time
