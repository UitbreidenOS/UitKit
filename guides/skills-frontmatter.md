# Skills Frontmatter Reference

Complete reference for all YAML frontmatter fields in Claude Code skill files. Frontmatter controls activation matching, auto-invocation, effort defaults, and whether the skill triggers a model call at all.

---

## Required Fields

### `name`

**Type:** `string` (kebab-case)
**Required:** Yes

The identifier that becomes the slash command. `name: fastapi-crud` → `/fastapi-crud`.

```yaml
name: fastapi-crud
```

Rules:
- Must be unique across all skill files in scope (project + global)
- Kebab-case only — no underscores, no dots
- Keep it short enough to type without autocomplete friction

---

### `description`

**Type:** `string`
**Required:** Yes
**Character cap:** Counts toward the shared 1,536-character limit with `when_to_use`

The primary signal Claude uses for semantic matching — both for auto-invocation and for responding to user slash commands. Write this as an explicit activation condition, not a capability summary.

```yaml
description: "FastAPI endpoint authoring with Pydantic validation, async route handlers, and dependency injection. Activate for new API routes, request model definitions, or background task setup."
```

Bad: `"A skill for FastAPI."` — too vague, poor matching signal.
Good: the example above — technology + task type + specific sub-tasks.

---

## Optional Fields

### `when_to_use`

**Type:** `string`
**Character cap:** Shared 1,536-character limit with `description`

Additional activation context appended to `description` in the skill listing. Use for trigger conditions that are too verbose for the description but improve matching precision.

```yaml
when_to_use: "Activate when the user mentions FastAPI, async Python API, Pydantic models, or is working in a project that has main.py with app = FastAPI() defined."
```

Treat `description` as the headline and `when_to_use` as the extended matching context. Both count toward the same 1,536-character cap — budget accordingly.

---

### `paths`

**Type:** `array` of glob strings
**Default:** None (skill is never auto-activated by file context)

Auto-activates the skill when Claude touches a file matching any listed pattern. Useful for test utilities, config file helpers, and schema tools that should silently load when Claude opens specific files.

```yaml
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "tests/**"
  - "**/jest.config.*"
```

Notes:
- Matching is against the file path Claude is currently reading or editing, not the working directory
- Skills with `paths:` activate silently — the user does not see a slash command invocation
- Multiple skills can activate via `paths:` simultaneously — there is no conflict resolution; all activated skills are loaded

---

### `effort`

**Type:** `string` — `"low"` | `"medium"` | `"high"` | `"xhigh"`
**Default:** Inherits from the session's active effort setting

Overrides the effort level for sessions where this skill is active. Use `"xhigh"` for skills that involve security analysis, architecture decisions, or any task where missing a subtle constraint has real consequences.

```yaml
effort: xhigh
```

| Value | Appropriate for |
|---|---|
| `"low"` | Reformatting, renaming, boilerplate generation, simple classification |
| `"medium"` | Routine feature implementation, straightforward refactors |
| `"high"` | Complex feature work, multi-file changes with dependencies |
| `"xhigh"` | Security review, architecture decisions, debugging deep issues |

---

### `shell`

**Type:** `string`
**Default:** `"bash"`

Overrides the shell interpreter for script blocks within the skill. Only relevant for Windows-specific skills where PowerShell is required.

```yaml
shell: powershell
```

Leave this unset for any skill targeting macOS, Linux, or cross-platform environments.

---

### `disable-model-invocation`

**Type:** `boolean`
**Default:** `false`

When `true`, activating the skill does not trigger a model response. The skill body is loaded into context as a directive, and the model applies it to subsequent interactions rather than generating an immediate response.

```yaml
disable-model-invocation: true
```

Use for:
- Skills that configure behavior without needing to "respond" (e.g., `always-use-typescript` style directives)
- Skills that inject context passively (e.g., a skill that loads project conventions into context without acting on them immediately)

---

## Character Budget

The skill listing used for auto-invocation matching has a hard cap:

| Field | Budget |
|---|---|
| `description` + `when_to_use` combined | 1,536 characters |
| Full skill body (loaded on match) | ~15,000 characters |

**Strategy:** Put dense, keyword-rich activation triggers in `description` and `when_to_use`. Put detailed instructions, code examples, and patterns in the skill body. The body is only loaded after the match is made — it does not affect matching performance.

---

## Monorepo Discovery

Skills do **not** walk up the directory tree. This is the most common source of confusion when migrating from CLAUDE.md patterns.

| Feature | Walks up the tree? |
|---|---|
| `CLAUDE.md` | Yes — walks from current file to repo root |
| `.claude/rules/` | No — uses `paths:` frontmatter matching |
| `.claude/skills/` | No — only the skills in the nearest `.claude/skills/` are active |
| `~/.claude/skills/` | Always active regardless of directory |

In a monorepo:
- Global skills (`~/.claude/skills/`) are available everywhere
- Root-level `.claude/skills/` skills are available only from the repo root
- Package-level `.claude/skills/` directories are needed for package-specific skills

---

## Complete Frontmatter Example

```yaml
---
name: drizzle-orm
description: "Drizzle ORM schema definition, query building, and Neon Postgres integration in TypeScript. Activate for database schema work, ORM query patterns, or migration authoring."
when_to_use: "Use when working with drizzle.config.ts, schema.ts files, db/ directory, or when the user mentions Drizzle, Neon, or database migrations in a TypeScript project."
paths:
  - "**/schema.ts"
  - "**/drizzle.config.ts"
  - "db/**"
  - "**/migrations/**"
effort: high
---

# Drizzle ORM

## When to activate
...
```

---

## Field Compatibility Summary

| Field | Required | Auto-invocation effect | Manual invocation effect |
|---|---|---|---|
| `name` | Yes | Slash command name | Primary identifier |
| `description` | Yes | Primary matching signal | Shown in skill listing |
| `when_to_use` | No | Secondary matching signal | Shown in skill listing |
| `paths` | No | File-based auto-activation | No effect |
| `effort` | No | Sets effort when skill activates | Sets effort when skill activates |
| `shell` | No | No effect on matching | Changes script interpreter |
| `disable-model-invocation` | No | No response generated | No response generated |

---
