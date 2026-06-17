# Customer Success Stack — CLAUDE.md

## Principles

1. **Customer context first** — All tools and skills prioritize understanding customer state, history, and needs before action.
2. **Async-safe operations** — Commands and hooks must handle concurrent customer interactions without race conditions.
3. **Audit trail required** — Every customer-facing action logs to session-log.md with timestamp and actor.

## Workspace Structure

- `skills/` — CS-specific commands (health checks, escalations, renewal forecasts)
- `commands/` — Quick CLI commands for common CS tasks
- `hooks/` — Automations (renewal reminders, churn signals, satisfaction tracking)
- `mcp/` — Integrations with CRM systems and analytics tools
