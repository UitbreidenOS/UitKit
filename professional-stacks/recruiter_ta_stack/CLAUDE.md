# Recruiter/TA Stack — CLAUDE.md

This directory contains skills, agents, workflows, and hooks for talent acquisition and recruitment workflows.

---

## Stack Overview

The Recruiter/TA Stack provides Claude Code capabilities for:
- Job description generation and optimization
- Candidate sourcing and screening
- Interview preparation and scheduling
- Offer management and negotiation
- Candidate relationship management (CRM) workflows
- Hiring metrics and analytics

---

## File Structure

```
recruiter_ta_stack/
├── CLAUDE.md                 # This file
├── README.md                 # Stack documentation
├── skills/                   # Reusable TA skills
├── commands/                 # Custom slash commands
├── hooks/                    # Event-triggered automations
├── mcp/                      # MCP server configs
└── session-log.md            # Workflow session tracker
```

---

## Naming Conventions

- Skill files: `kebab-case.md` (e.g., `job-description-generator.md`)
- Commands: `kebab-case.sh` or `kebab-case.py`
- Hook scripts: `kebab-case.sh` or `kebab-case.py`
- Workflow files: `kebab-case.md`

---

## Integration

Skills in this stack can be:
- Called directly via `/skill-name` in Claude Code
- Referenced in workflows
- Bound to hooks for automation
- Exposed via MCP servers

Update `README.md` when adding new skills or commands.
