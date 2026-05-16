# Claudient — Context Map

This file points to the relevant CONTEXT.md for each part of the Claudient repository.
Useful for multi-context repos or when working on a specific area.

---

## Contexts

| Area | CONTEXT file | What it covers |
|---|---|---|
| **Root** | [CONTEXT.md](CONTEXT.md) | Core terminology: skill, agent, hook, rule, workflow, prompt, guide, MCP |
| **Website** | [web/CLAUDE.md](web/CLAUDE.md) → [web/AGENTS.md](web/AGENTS.md) | Next.js 16 App Router conventions, breaking changes |
| **CLI / Package** | [scripts/cli.js](scripts/cli.js) | Installation logic, command structure |
| **Architecture decisions** | [docs/adr/](docs/adr/) | Why we made hard-to-reverse decisions |
| **Scope boundaries** | [.out-of-scope/scope-rules.md](.out-of-scope/scope-rules.md) | What Claudient will not support |

---

## When to read which context

**Working on skills content** → read [CONTEXT.md](CONTEXT.md) for the definition of "skill" vs "rule" vs "workflow"

**Working on the website (`web/`)** → read [web/AGENTS.md](web/AGENTS.md) first — Next.js 16 has breaking changes from earlier versions

**Adding a new CLI command** → read [scripts/cli.js](scripts/cli.js) header + [CONTEXT.md](CONTEXT.md) for the install targets (`~/.claude/skills/`, `~/.claude/agents/`, `~/.claude/hooks/`)

**Evaluating a contribution** → read [.out-of-scope/scope-rules.md](.out-of-scope/scope-rules.md) to check if it fits scope, then [CONTRIBUTING.md](CONTRIBUTING.md) for the quality bar

**Making an architecture decision** → read [docs/adr/](docs/adr/) to understand prior decisions before adding a new one

---

## Adding a new context

If a new major subsystem is added (e.g. a `studio/` app, a `server/` backend), create:
1. A `CONTEXT.md` inside that directory with its domain glossary
2. A pointer row in this file's table above
