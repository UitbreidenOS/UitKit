# SRE Stack

> Site Reliability Engineering automation — monitoring, incident response, runbooks, and infrastructure health.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project root.
2. **Add monitoring integrations** — Configure Prometheus, Datadog, or PagerDuty in `settings.json`.
3. **Add hooks** — Copy each hook from `hooks/` into `.claude/hooks/` and enable in settings.json.
4. **Run `/incident-check`** — Verify current system health and active incidents.
5. **Run `/runbook [name]`** — Execute an automated runbook for common issues.
6. **Run `/slo-status`** — Check error budget and SLI trends.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | SRE identity, incident response workflow, SLO definition, key metrics. |
| `session-log.md` | Log | Auto-updated: incidents detected, runbooks executed, metrics tracked, post-mortems. |
| `skills/` | Directory | SRE skills — incident triage, runbook execution, metric analysis, alert tuning. |
| `commands/` | Directory | Slash commands — incident check, runbook runner, SLO dashboard. |
| `hooks/` | Directory | Automation hooks — incident alerting, log aggregation, metric collection. |
| `mcp/` | Directory | MCP server configs for monitoring and incident management systems. |

---

## Directory Structure

```
sre_stack/
├── CLAUDE.md              # SRE rules, workflows, metrics
├── README.md              # This file
├── session-log.md         # Activity log
├── skills/                # SRE task skills
├── commands/              # Slash commands
├── hooks/                 # Event automation
└── mcp/                   # Monitoring integrations
```

---

## Getting Started

- **New to SRE?** Start with the incident response workflow in CLAUDE.md.
- **Ready to automate?** Check `commands/` for quick-start slash commands.
- **Need a runbook?** Browse `skills/` for pre-built operational procedures.

---

_Last updated: 2026-06-13_
