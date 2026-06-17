# Technical Writer Stack

> User-facing documentation pipeline that enforces clarity, consistency, and audience-appropriate language.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace.
2. **Run `/outline-docs`** — Generate a table of contents and outline for your doc set.
3. **Run `/define-audience`** — Analyze and document the audience profile before writing.
4. **Run `/audit-clarity`** — Scan finished docs for tone violations and clarity issues.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, tone guidelines, doc hierarchy, clarity checklist, and SOPs. Start here. |
| `session-log.md` | Log | Auto-updated: docs written, audits run, clarity scores, publish readiness. |
| `skills/` | Directory | 6 reusable documentation skills — outlines, audience mapping, clarity audit, SEO, structure validation. |
| `commands/` | Directory | 3 slash commands for core documentation workflow. |
| `hooks/` | Directory | 3 hooks enforcing clarity and audience consistency. |
| `mcp/` | Directory | Optional MCP server configs for SEO tooling and readability analysis. |

---

## Skills (6)

| Skill | Trigger | Tools | Purpose |
|---|---|---|---|
| `documentation-outliner` | /outline-docs | Read, Write | Generate table of contents and outline for full doc set |
| `audience-mapper` | /define-audience | Read, Write | Define audience profile: expertise level, goals, pain points |
| `style-guide-enforcer` | Doc review | Read | Flag tone, clarity, jargon, and style violations |
| `seo-optimizer` | Pre-publish | Read, Write | Optimize titles, headers, and meta descriptions for search |
| `content-structure-auditor` | Full doc audit | Read | Check information architecture, identify gaps and redundancy |
| `localization-prep` | Pre-translation | Read, Write | Mark translatable strings; flag context for translators |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/outline-docs` | Generate outline and table of contents for a doc set; include audience and reading level |
| `/define-audience` | Analyze feature scope and define audience profile: expertise, goals, prior knowledge |
| `/audit-clarity` | Scan a doc for tone violations, passive voice, jargon, and readability issues |

---

## Hooks (3)

| Hook | Trigger | Purpose |
|---|---|---|
| `clarity-checker` | PostToolUse | Flag passive voice, wordy phrases, and complex jargon |
| `audience-validator` | PostToolUse | Ensure audience definition matches writing level |
| `seo-audit` | Before publish | Validate page titles, headers, and meta descriptions |

---

## MCP Integrations

- **Readability Analysis** — Flesch Reading Ease scoring; recommend adjustments to hit target reading level
- **SEO Tools** — Title and header optimization; keyword density analysis

---

## Workflow

```
Feature Brief
    ↓
/define-audience → Audience Profile
    ↓
/outline-docs → Table of Contents + Outline
    ↓
Write Docs
    ↓
/audit-clarity → Clarity Report
    ↓
Revise
    ↓
Publish
```

---

## Core Principles

1. **Clarity > Completeness.** A 2,000-word guide that answers the user's question beats a 5,000-word guide that doesn't.
2. **One job per page.** Every page does one thing. If it covers multiple topics, split it and link.
3. **Audience first.** Define who you're writing for before you write the first sentence.
4. **Code examples must run.** Every code snippet is tested; none are aspirational.
5. **Link aggressively.** Build a web, not a list. Link to related guides, API reference, and conceptual docs.

---

## Example Docs

Included in `examples/`:
- API Reference template (with parameters, response, error codes, examples)
- Getting Started Guide template (prerequisites, step-by-step, troubleshooting)
- Conceptual Doc template (explain the "why"; link to guides and reference)

---

## Session Log

Track all documentation work in `session-log.md`:
- Docs written
- Audience analyses completed
- Clarity audits run with scores
- Publish-ready docs
- Localization prep work

---

## Customization

### Tone & Voice

Edit `CLAUDE.md` section "Tone & Output Rules" to match your brand voice. This example uses direct, neutral, expert-to-expert tone. Adjust for your audience.

### Readability Target

Change Flesch Reading Ease targets in the Readability Guidelines table. Defaults: 50–60 for technical, 60+ for user guides.

### Audience Profiles

Add common audience profiles to CLAUDE.md (e.g., "Data Engineers," "End Users," "DevOps Engineers"). Reference these in `/define-audience` for faster audience mapping.

---

Built with [Claudient](https://github.com/Claudients/Claudient) · [uitbreiden.com](https://uitbreiden.com/)
