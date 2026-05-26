# Using Claudient Skills in Cursor, Windsurf, Copilot, and Codex

Claudient skills are plain Markdown files. Nothing in their format is Claude Code-specific — no binary, no proprietary syntax, no API calls. That makes them portable to every major AI coding tool with a rule or context injection mechanism.

This guide covers the mechanics of transplanting a Claudient skill into Cursor, Windsurf, GitHub Copilot, and OpenAI Codex CLI — what works, what doesn't, and where to draw the line.

---

## Why It Works

A Claudient skill is four Markdown sections: `When to activate`, `When NOT to use`, `Instructions`, and `Example`. The model reads this as plain text and adjusts its behavior accordingly.

That is exactly what every AI coding tool does when you put text in its rules or instructions file — the text becomes part of the system prompt before your request is processed. The skill format is already optimized for this:

- `When to activate` and `When NOT to use` give the model scoping constraints that prevent over-application
- `Instructions` contains directive language ("always do X", "never do Y") rather than documentation language
- `Example` grounds the model in the expected output structure

Any model that accepts a system prompt or custom instructions file can consume a Claudient skill without modification. You lose Claude Code-specific features (slash command invocation, hook triggers, subagent delegation) but the core behavioral guidance transfers completely.

---

## Quick Reference

| Tool | Where to place the skill |
|---|---|
| Claude Code | `.claude/skills/<skill>.md` (slash command) or import via `CLAUDE.md` |
| Cursor | `.cursor/rules/<skill>.mdc` (auto-loaded) or `.cursorrules` (legacy) |
| Windsurf | `.windsurfrules` in project root |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenAI Codex CLI | `AGENTS.md` in project root, or pass with `--context` flag |
| Zed | Project rules file (`.zed/settings.json` → `"system_prompt"` key) |
| Continue.dev | `~/.continue/config.json` → `"systemMessage"` field, or `@Rules` block |

---

## Cursor

Cursor is the most common alternative to Claude Code for teams already using VS Code. It supports granular per-project rules with scoping controls.

### Rule file location

Cursor loads rules from `.cursor/rules/` automatically. Each file must use the `.mdc` extension. Cursor reads all `.mdc` files in this directory at startup — you do not need to reference them manually.

```
your-project/
├── .cursor/
│   └── rules/
│       ├── fastapi.mdc
│       ├── db-migrations.mdc
│       └── test-coverage.mdc
└── src/
```

### Converting a Claudient skill to a Cursor rule

1. Copy the `.md` file from `skills/` into `.cursor/rules/`
2. Rename the extension from `.md` to `.mdc`
3. Add an MDC frontmatter block at the top to control scoping:

```
---
description: FastAPI endpoint patterns — activate when building or modifying FastAPI routes
globs: ["**/*.py", "**/routers/**"]
alwaysApply: false
---

# FastAPI CRUD

## When to activate
...
```

The `globs` field tells Cursor to attach this rule only when files matching those patterns are open in context. The `description` field is used by Cursor's rule matching logic — copy the content of the skill's `When to activate` section as a concise trigger phrase.

Setting `alwaysApply: true` injects the rule into every request regardless of open file. Use this only for project-wide coding standards, never for task-specific skills — it wastes context and degrades response quality on unrelated tasks.

### Legacy `.cursorrules`

`.cursorrules` is a single file at the project root. It is loaded for every request without scoping. Paste the full skill content here only if:

- The project has a single dominant technology stack
- You want the skill active regardless of which file is open
- You are not yet using the `.cursor/rules/` directory structure

For projects with multiple skills, `.cursor/rules/` with separate `.mdc` files is strictly better — each skill loads only when relevant.

### Cursor-specific limitation

Cursor does not support slash command invocation of individual skills the way Claude Code does. All `.mdc` files that match the current context are loaded simultaneously. If you have five skills installed and all five match (e.g., all have `alwaysApply: true`), Cursor injects all five into the system prompt. Keep scoping tight via `globs` and precise `description` values to avoid this.

---

## Windsurf

Windsurf (Codeium's editor) uses a single rules file per project.

### Rule file location

Place a `.windsurfrules` file at the project root:

```
your-project/
├── .windsurfrules
├── src/
└── package.json
```

### Converting a Claudient skill

Paste the skill content directly into `.windsurfrules`. For multiple skills, concatenate them with a horizontal rule (`---`) as a separator:

```markdown
# FastAPI CRUD

## When to activate
- Building a new FastAPI endpoint (GET, POST, PUT, DELETE)
...

## Instructions
...

---

# Database Migrations

## When to activate
- Running Alembic migrations
...
```

Windsurf loads the entire `.windsurfrules` file for every request. There is no per-file scoping mechanism — the model must use the `When to activate` and `When NOT to use` sections to self-select. This works, but large files (beyond 3–4 skills) start diluting the model's attention. Keep `.windsurfrules` to the 2–3 skills most relevant to the current workstream and rotate as needed.

---

## GitHub Copilot

Copilot's custom instructions file applies to all Copilot interactions in a repository.

### Rule file location

```
your-project/
├── .github/
│   └── copilot-instructions.md
└── src/
```

The file name must be exactly `copilot-instructions.md`. Copilot reads it automatically for any repository where it is present.

### Converting a Claudient skill

Paste the skill content into `copilot-instructions.md`. The four-section format is understood by the GPT-4-class models powering Copilot — the `When NOT to use` section is particularly effective at preventing Copilot from applying patterns in the wrong context.

```markdown
# FastAPI CRUD

## When to activate
- Building a new FastAPI endpoint
- Adding Pydantic request/response models
- Implementing dependency injection in routes

## When NOT to use
- Existing Flask or Django projects
- Simple scripts without an API layer
- gRPC or GraphQL APIs

## Instructions

Always define a Pydantic model for request bodies. Never accept raw dicts.
Raise `HTTPException` with the correct status code — 422 for validation errors,
404 for not-found, 500 only for unexpected failures.

## Example

**User:** Add a POST endpoint to create a new user.

**Expected:**
- `UserCreate` Pydantic model with `email: EmailStr` and `password: str`
- Route at `POST /users` returning `UserResponse` (no password field)
- `HTTPException(409)` if email already exists
```

### Copilot character limits

As of mid-2025, Copilot applies a soft cap on `copilot-instructions.md` content loaded per request. Files beyond ~8,000 characters may be truncated. For multi-skill projects, prioritize the most frequently triggered skills and keep individual skill `Instructions` sections dense rather than exhaustive.

---

## OpenAI Codex CLI

Codex CLI (`codex` command) uses `AGENTS.md` for persistent context, equivalent to CLAUDE.md in Claude Code.

### Rule file location

Place `AGENTS.md` at the project root:

```
your-project/
├── AGENTS.md
└── src/
```

### Converting a Claudient skill

Paste the skill directly into `AGENTS.md`. Codex reads this file at session start and includes it in the system prompt for every request in that directory.

```markdown
# FastAPI CRUD

## When to activate
...

## Instructions
...
```

For one-off invocations without modifying `AGENTS.md`, pass the skill as a context file:

```bash
codex --context skills/backend/python/fastapi.md "Add a POST /users endpoint"
```

The `--context` flag accepts a file path and prepends its content to the system prompt for that invocation only. Useful for testing skills before committing them to `AGENTS.md`.

### Nesting

Like CLAUDE.md, `AGENTS.md` supports directory-level overrides. A file at `services/api/AGENTS.md` applies only when Codex operates within that subtree, allowing per-service skill assignment in a monorepo.

---

## Zed and Continue.dev

### Zed

Zed's AI context is configured in `.zed/settings.json`. Paste the skill content into the `"system_prompt"` field:

```json
{
  "assistant": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-5"
    },
    "system_prompt": "# FastAPI CRUD\n\n## When to activate\n..."
  }
}
```

For multi-skill setups, concatenate skills as a single string. Zed does not support file-based rule imports, so the entire context must live inline in `settings.json`.

### Continue.dev

Continue supports both global and project-level system message overrides. In `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Claude Sonnet",
      "provider": "anthropic",
      "model": "claude-sonnet-4-5",
      "systemMessage": "# FastAPI CRUD\n\n## When to activate\n..."
    }
  ]
}
```

For project-level rules, Continue supports `@Rules` blocks in `.continue/rules.md` (version 0.9+). Paste the skill content there — Continue injects it alongside the model's system prompt for requests made in that project.

---

## What Transfers Well

**The Instructions section** — directive language works identically across models. "Always define a Pydantic model for request bodies. Never accept raw dicts." is unambiguous to GPT-4o, Claude, Gemini, and any other model with instruction-following capability.

**The Example section** — few-shot grounding is model-agnostic. An example showing the expected output structure improves adherence on every model, not just Claude.

**The When NOT to use section** — negative constraints are underused in most rules files. This section is often the difference between a skill that helps and one that interferes with unrelated work.

**File-scoped rules (Cursor globs)** — the Cursor `.mdc` format with `globs` replicates Claude Code's `paths` frontmatter field. Skills that specify file patterns in their `When to activate` section translate naturally to Cursor's `globs` — automate the conversion.

---

## What Does Not Transfer

**Slash command invocation** — `/skill-name` is Claude Code-specific. Other tools load skills passively from their rules file; you cannot trigger a skill on demand mid-session in the same way.

**Hooks** — `.claude/settings.json` hooks (`PreToolUse`, `PostToolUse`, `Notification`, `Stop`) are Claude Code-only. Shell scripts triggered on tool events have no equivalent in Cursor, Windsurf, or Copilot. Do not attempt to translate hook files.

**Subagent delegation** — Skills that instruct Claude to spawn a subagent (`Task` tool, `subagent_type` references) will not execute in other tools. The model will read the instruction and do nothing meaningful with it, or attempt to simulate the behavior in a single context window.

**MCP tool references** — Instructions that reference specific MCP tools (`mcp__tool_name`) only work in Claude Code with the MCP server configured. Strip these from skills before using them in other tools, or replace with equivalent native tool instructions for the target platform.

**`!command` runtime injection** — The `!git branch --show-current` syntax for embedding shell output into skill context at activation time is Claude Code-specific. Other tools do not execute these inline commands. Replace them with static text or remove them entirely when porting.

---

## Practical Workflow for Porting a Skill

1. Open the skill file from `skills/`
2. Remove any `!command` inline injections
3. Remove or rewrite any sections that reference Claude Code agents, hooks, or MCP tools
4. Determine the target tool and destination file (see the table at the top)
5. For Cursor: add the MDC frontmatter block; extract `When to activate` content as the `description` value; map file patterns to `globs`
6. For single-file destinations (Windsurf, Copilot, Codex): paste as-is with a separator if concatenating multiple skills
7. Test with a task that matches `When to activate` — verify the model applies the Instructions patterns
8. Test with a task that matches `When NOT to use` — verify the model does not apply the patterns

The four-section structure was designed to be self-contained. A well-written Claudient skill should require fewer than 10 minutes to port to any of these tools.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
