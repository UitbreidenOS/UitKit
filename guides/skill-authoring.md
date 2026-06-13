# Skill Authoring Guide

How to write a Claude Code skill that actually works — precise triggers, real patterns, no filler.

---

## What a Skill Is

A skill is a Markdown file placed in `.claude/skills/` that becomes a slash command in Claude Code. When you type `/skill-name`, Claude reads the file and uses its content to guide the session.

A skill is **not** a prompt template. It is a structured set of instructions that:
- Tells Claude when to activate and when to stay out of the way
- Provides domain-specific patterns Claude wouldn't apply by default
- Establishes constraints and anti-patterns for a specific task type

---

## File Location and Naming

| Scope | Path |
|---|---|
| Project-level | `.claude/skills/<skill-name>.md` |
| Personal (all projects) | `~/.claude/skills/<skill-name>.md` |

Naming rules:
- `kebab-case.md` only
- Name should match the slash command you want: `fastapi-crud.md` → `/fastapi-crud`
- Be specific: `django-migrations.md` is better than `django.md`

---

## The Required Structure

Every skill must have these four sections in this order:

```markdown
# Skill Name

## When to activate
[Specific trigger conditions]

## When NOT to use
[Anti-patterns — when this skill is the wrong tool]

## Instructions
[The skill content]

## Example
[At least one concrete example]
```

Do not add sections beyond this without a clear reason. Brevity is a feature.

---

## Writing "When to activate"

This is the most important section. It determines whether Claude applies the skill correctly or ignores it.

**Bad — too vague:**
```markdown
## When to activate
When working with Python APIs.
```

**Good — specific and actionable:**
```markdown
## When to activate
- Building a new FastAPI endpoint (GET, POST, PUT, DELETE)
- Adding request validation with Pydantic models
- Implementing dependency injection in FastAPI routes
- Writing async route handlers with background tasks
```

Rules:
- Use bullet points, one trigger per line
- Be concrete about the task, not the technology
- If it only applies to new code vs. existing code, say so explicitly

---

## Writing "When NOT to use"

This section prevents Claude from applying the skill in the wrong context. Skip it and the skill becomes noise.

**Example for a FastAPI skill:**
```markdown
## When NOT to use
- Existing Flask or Django projects — use the appropriate skill instead
- Simple scripts that don't need an API layer
- When the user has already defined their own router structure — follow it rather than imposing this pattern
- gRPC or GraphQL APIs — different paradigms, different skills
```

---

## Writing the Instructions

This is where the skill's value lives. Write it as direct instructions to Claude, not as documentation.

**Principles:**

1. **Be directive, not descriptive.** Tell Claude what to *do*, not what the technology *is*.

   Bad: "FastAPI uses Pydantic for validation."
   Good: "Always define a Pydantic model for request bodies. Never accept raw dicts."

2. **Encode decisions.** A skill should resolve ambiguity, not create it.

   Bad: "Use appropriate error handling."
   Good: "Raise `HTTPException` with status 422 for validation errors, 404 for not-found, 500 only for unexpected failures. Never let exceptions propagate to the response."

3. **Include the non-obvious.** If a pattern is obvious, Claude already knows it. Skills earn their value by encoding what's easy to get wrong.

4. **Reference real Claude Code capabilities.** A skill can instruct Claude to use specific tools, spawn subagents, or trigger hooks — use that.

5. **Keep it scannable.** Use headers, bullets, and code blocks. Claude reads the whole file but applies it better when structure is clear.

---

## Writing the Example

The example is not optional. It grounds the skill in reality and shows Claude the exact output quality expected.

A good example includes:
- The user prompt that would trigger the skill
- The expected output structure (not necessarily complete code — structure matters more)
- Any constraints the example demonstrates

```markdown
## Example

**User:** Add a POST endpoint to create a new user with email and password.

**Expected output structure:**
- Pydantic model `UserCreate` with email (EmailStr) and password (str, min 8 chars)
- Route at `POST /users` returning `UserResponse` (never return the password)
- Dependency-injected database session
- HTTPException 409 if email already exists
```

---

## Skill Length

| Skill type | Target length |
|---|---|
| Focused task skill | 50–150 lines |
| Domain skill (broad) | 150–300 lines |
| Workflow skill | 300–500 lines |

If your skill exceeds 500 lines, split it into two focused skills. Long skills dilute Claude's attention.

---

## Testing Your Skill

Before submitting to Claudient:

1. Copy the skill into a real project's `.claude/skills/`
2. Open Claude Code and trigger it with the slash command
3. Give Claude a task that matches your "When to activate" conditions
4. Verify Claude applies the patterns from your Instructions section
5. Give Claude a task that matches your "When NOT to use" conditions
6. Verify Claude does NOT apply the skill's patterns

A skill that passes step 5 but fails step 6 needs a more specific trigger.

---

## Common Mistakes

**Describing the technology instead of guiding the behavior**
Skills that read like documentation don't help Claude. Claude already knows what FastAPI is. Tell it how *you* want it used.

**Triggers that are too broad**
`## When to activate: When writing Python` will fire on everything. Narrow it down.

**Missing anti-patterns**
Without "When NOT to use", Claude may apply your skill in contexts where it causes harm.

**No example**
Examples are the fastest way for Claude to calibrate to your expected output quality.

**Importing generic best practices**
A skill full of general coding advice (use type hints, write tests, handle errors) adds noise. Those belong in `rules/`, not skills.

---

## Advanced Frontmatter Fields

**`when_to_use`** — appended to the description in the skill listing. Counts toward the 1,536-character cap. Use for more precise auto-invocation matching beyond the description.

**`paths`** — array of glob patterns; skill auto-activates when Claude touches a matching file:
```yaml
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
```

**`effort`** — sets default effort level for this skill: `low`, `medium`, `high`, `xhigh`

**`shell`** — `powershell` for Windows-specific skills (changes how script blocks are interpreted)

**Character budget:** The description field has a ~1,536-character cap for the auto-invocation listing. The full skill content (loaded on match) can be up to ~15,000 characters. Put activation keywords in description; put detailed instructions in the body.

**Monorepo discovery:** Skills use `.claude/skills/` discovery — they do NOT walk up the directory tree like CLAUDE.md. In a monorepo, each sub-package needs its own `.claude/skills/` if package-specific skills are needed.

---

## Trigger-Based Descriptions

### Write descriptions as activation triggers, not summaries

The model uses the description to decide when to activate the skill. The question it answers is "When should I fire?" — not "What does this do?"

```
❌ Wrong: "This skill helps with FastAPI development and covers routing, middleware, and testing."
✅ Right: "Activate when building or debugging a FastAPI application, adding endpoints, configuring middleware, or setting up pytest for an async API."
```

Summaries describe content. Triggers describe conditions. Claude needs conditions.

### Embed runtime injection via `!command` syntax

Skill instructions can embed shell commands that execute at activation time and inject their output into context:

```markdown
Current branch: !git branch --show-current
Recent changes: !git log --oneline -5
Project type: !cat package.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('name','unknown'))"
```

Use to: avoid hardcoded paths, inject dynamic context (current git state, env vars, project name), reduce prompt length. The skill stays accurate across projects without manual edits.

### Document failure modes in the description

Add a `Gotchas:` section to skill descriptions noting observed failure modes — patterns where Claude consistently gets it wrong without guidance:

```
Gotchas: Claude may confuse ESM and CommonJS module syntax — explicitly state which format when asking for imports. This skill does not handle monorepo workspace setups; use the monorepo skill instead.
```

Gotchas are one of the highest-ROI additions to a mature skill. They encode failures you've already paid for.

### Skill character budget

| Field | Limit |
|---|---|
| Description + `when_to_use` combined | 1,536 characters (hard cap) |
| Full skill body (loaded on activation) | ~15,000 characters |
| Optimal description length | 150–300 characters |

150–300 characters is enough for precise matching and short enough to leave room for `when_to_use`. Descriptions that exceed this get truncated in the skill listing and may not match accurately.

---

## Work With Us





---

## Skill Template

```markdown
# [Skill Name]

## When to activate
- [Specific trigger 1]
- [Specific trigger 2]
- [Specific trigger 3]

## When NOT to use
- [Anti-pattern 1]
- [Anti-pattern 2]

## Instructions

### [Sub-topic 1]
[Directive instructions]

### [Sub-topic 2]
[Directive instructions]

## Example

**User:** [Example prompt]

**Expected output:**
[Expected structure or code]
```
