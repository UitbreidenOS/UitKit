# Settings Scope Reference — Global vs Project

Everything in Claude Code exists at either the **global** scope (`~/.claude/`) or the **project** scope (`.claude/`). Some features are global-only. This guide is the authoritative reference for where things live and how they interact.

---

## Scope Overview

| Feature | Global (`~/.claude/`) | Project (`.claude/`) | Notes |
|---|---|---|---|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | `CLAUDE.md` (repo root) | Both loaded; concatenated at startup |
| `settings.json` | `~/.claude/settings.json` | `.claude/settings.json` | Merged; project overrides global |
| `settings.local.json` | `~/.claude/settings.local.json` | `.claude/settings.local.json` | Personal overrides; gitignored |
| Skills | `~/.claude/skills/` | `.claude/skills/` | Both active simultaneously |
| Agents | `~/.claude/agents/` | `.claude/agents/` | Both active simultaneously |
| Hooks | `~/.claude/settings.json` | `.claude/settings.json` | Both fire; arrays are concatenated |
| Rules | `~/.claude/rules/` | `.claude/rules/` | Both active; matched by `paths:` frontmatter |
| MCP servers | `~/.claude.json` | `.claude/mcp.json` | Merged at startup |
| Tasks | `~/.claude/tasks/` | — | Global only |
| Agent Teams | `~/.claude/teams/` | — | Global only |
| Keybindings | `~/.claude/keybindings.json` | — | Global only |
| Memory files | `~/.claude/memory/` | — | Global only |
| Credentials / tokens | `~/.claude/` | — | Global only; never commit |

---

## `settings.local.json`

Both scopes support a `.local.json` variant for personal overrides:

- `~/.claude/settings.local.json` — personal global overrides (never committed)
- `.claude/settings.local.json` — personal project overrides (gitignored by default)

Use `.local.json` to override team-committed settings without touching the shared config. Common use cases: disabling a hook during debugging, setting a personal `ANTHROPIC_BASE_URL`, overriding the default model.

The load order within each scope is:

1. `settings.json` (base)
2. `settings.local.json` (overrides base)

---

## Merge Behavior

When the same key exists at both global and project scope:

| Key type | Behavior |
|---|---|
| Scalar (`model`, `effort`, string flags) | Project wins — global value is ignored |
| Arrays (`hooks`, `tools`, `permissions`) | Concatenated — both values are active |
| Nested objects | Merged recursively; project keys win on conflict |

**Critical:** hooks arrays are concatenated, not replaced. If you define a `Stop` hook globally and a `Stop` hook in the project, **both fire**. This is often the intended behavior (global hooks handle audit logging; project hooks handle project-specific validation), but it can cause duplicate execution if the same hook is defined in both scopes by accident.

---

## CLAUDE.md Loading Order

All of the following are loaded and concatenated into context at session start:

1. `~/.claude/CLAUDE.md` — global user instructions
2. `CLAUDE.md` at the repo root — project instructions
3. `CLAUDE.md` files in parent directories between the current file and the repo root (walked upward)
4. `.claude/rules/*.md` files whose `paths:` frontmatter matches the current file

Later entries do not override earlier ones — all content is active simultaneously. If entries conflict, project-level content takes practical precedence because it appears later in the concatenated prompt, but there is no explicit override mechanism between CLAUDE.md files.

**Token budget:** The combined CLAUDE.md content counts against the context window. If all sources exceed the budget, older or lower-priority sources are trimmed. Keep global CLAUDE.md concise — it loads for every project.

---

## Project Scope Directory Layout

A well-structured project scope looks like:

```
.claude/
  settings.json         # committed — team config
  settings.local.json   # gitignored — personal overrides
  mcp.json              # committed — project MCP servers
  skills/
    feature-name.md     # project-specific slash commands
  agents/
    specialist.md       # project-specific subagents
  rules/
    style.md            # always-active rules (no paths: = always on)
    tests.md            # paths: ["**/*.test.ts"] = auto-activates
  hooks/
    validate.sh         # hook scripts (referenced from settings.json)
  memory/               # session memory (gitignored)
```

---

## Global Scope Directory Layout

```
~/.claude/
  CLAUDE.md             # global instructions, loaded for every project
  settings.json         # global defaults
  settings.local.json   # personal global overrides
  skills/               # skills active in every project
  agents/               # agents available in every project
  rules/                # rules active in every project
  tasks/                # cross-session task lists
  teams/                # agent team definitions
  keybindings.json      # key remapping
  memory/               # persistent memory across projects
```

---

## Common Pitfalls

**Committing `.local.json` files.** They are gitignored by default, but if you force-add them you expose personal API keys or endpoint overrides to the team. Add `settings.local.json` to `.gitignore` explicitly if it is not already covered.

**Defining the same hook in both scopes.** The hook fires twice. This is especially disruptive for hooks that write audit logs — you get duplicate entries. Audit once globally; validate per-project.

**Putting everything in the global CLAUDE.md.** Global CLAUDE.md loads for every project. Bloating it with project-specific instructions wastes tokens on unrelated sessions. Put project-specific instructions in the project `CLAUDE.md`.

**Assuming skills walk up the directory tree.** They do not. CLAUDE.md files walk up; skills do not. A skill in `/workspace/project/.claude/skills/` is not visible when Claude is working inside `/workspace/project/packages/api/`. Each sub-package needs its own `.claude/skills/` for package-specific skills.

---
