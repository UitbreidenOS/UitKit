# Command vs. Agent vs. Skill — When to Use Each

Claude Code has three primitives for extending its behaviour: skills, agents, and slash commands. They overlap in surface area, which is why this is the most common source of confusion when building a Claude Code knowledge system. This guide cuts through the ambiguity with a precise decision framework.

---

## The Three Primitives

### Skill (auto-invoked)

- Lives in `.claude/skills/` as a `.md` file with YAML frontmatter
- Claude loads it automatically when the current task semantically matches the skill description — no user typing required
- Runs inline inside the current conversation — no separate context window is created
- The lightest-weight primitive: shares the full conversation history, immediate context, and all open files
- Best for: domain expertise, recurring patterns, coding conventions, style guides, API idioms, project-specific knowledge
- Avoid for: tasks that need isolation, long multi-step processes, anything that should be consciously triggered

A skill is essentially persistent expertise injected into Claude's reasoning at the moment it's needed. When Claude sees you working on a FastAPI route, the `fastapi-crud` skill loads automatically and shapes the output. No invocation required.

### Agent (spawned subagent)

- Lives in `agents/` as a `.md` file with YAML frontmatter
- Explicitly spawned by the parent Claude session via `Agent(subagent_type="name", prompt="...")`
- Runs in a separate context window — fully isolated from the parent conversation
- Can run in parallel — multiple agents execute simultaneously while the parent waits or continues
- Has its own tool restrictions, model selection, and effort level
- Best for: specialist work needing isolation, parallel execution, tasks where intermediate noise should not pollute the main context, long-running analysis
- Avoid for: tasks that need the parent conversation's full history (agents receive only the prompt you pass them)

An agent is a contractor: you hand them a brief and they work independently. They cannot read your conversation history unless you explicitly include it in the prompt.

### Slash Command (explicitly invoked)

- Lives in `.claude/commands/` as a `.md` file
- User types `/command-name` to invoke — never auto-invoked
- Runs inline in the current conversation, like a skill, but requires explicit trigger
- Can encode complex multi-step workflows as structured prompts
- Best for: defined workflows users consciously trigger — `/code-review`, `/deploy`, `/db-migrate`, `/release-notes`
- Avoid for: capabilities that should activate automatically; anything users will forget to invoke

A slash command is a macro: a predefined workflow you can call by name when you need it. The user is always in control.

---

## Decision Tree

Work through these questions in order. Stop at the first match.

```
1. Should it activate automatically without the user typing anything?
   YES → Skill

2. Does it need isolation from the parent context, or should it run in parallel
   with other work?
   YES → Agent

3. Does it need a different model (Haiku for cost, Opus for reasoning depth)
   or restricted tool access?
   YES → Agent

4. Is it a defined workflow the user consciously triggers by name?
   YES → Slash Command

5. Is it pure expertise or a pattern (no execution, no isolation needed)?
   YES → Skill (inline)

STILL UNSURE → default to Skill, escalate to Slash Command, escalate to Agent
               only when isolation is genuinely required
```

---

## Auto-Invocation Rules

### How skills get activated

Claude reads skill frontmatter at session startup. The `description` field (up to ~1,536 characters) is always in memory. When a task semantically matches, Claude loads the full skill body.

```yaml
---
description: "Use for FastAPI route handlers, dependency injection, and Pydantic model definitions. Activates when writing Python web API code."
paths:
  - "**/*.py"
when_to_use: "Python web API development with FastAPI"
---
```

- `description` — primary matching signal; keep it specific, not generic
- `paths` — file-glob filter; skill only activates when matching files are in context
- `when_to_use` — secondary matching hint for the router

Skills with generic descriptions (`"Use this for Python"`) match too broadly and load unnecessarily. Be precise.

### How agents get invoked

Agents are always explicitly spawned. The parent session calls them.

```python
# Basic invocation
Agent(
  subagent_type="security-auditor",
  description="Audit the authentication module for OWASP Top 10 issues",
  prompt="Review /src/auth/ for injection risks, session fixation, and token exposure. Report findings."
)

# With model override
Agent(
  subagent_type="doc-formatter",
  model="haiku",
  prompt="Reformat all docstrings in /src/utils/ to Google style."
)
```

Pass `background: true` in frontmatter (or set it at call time) to run the agent without blocking the parent session.

---

## Context Isolation Rules

| Primitive | Sees parent conversation? | Has own context window? | Can run in parallel? |
|-----------|--------------------------|------------------------|---------------------|
| Skill | Yes — full history | No | No |
| Agent | No — prompt only | Yes | Yes |
| Slash Command | Yes — full history | No | No |

The isolation column is the critical differentiator. If your task needs access to the full conversation history, use a skill or slash command. If it should not be contaminated by the parent context (or should run alongside other tasks), use an agent.

---

## Lightest-Weight Resolution Order

When you are uncertain, default to the lightest option:

**Skill → Slash Command → Agent**

Start with a skill. If the capability cannot be auto-invoked reliably (too context-dependent, too explicit), move to a slash command. Only escalate to an agent when isolation or parallelism genuinely matters. Agents cost an extra context window and require passing context explicitly — they are more expensive in both tokens and complexity.

---

## Practical Examples

### Example 1: REST API naming conventions

> "I want Claude to always follow our internal REST endpoint naming standards when writing routes."

**Answer: Skill**

This is pure expertise. It should activate automatically whenever Claude writes route handlers. No user trigger needed, no isolation needed. Create `.claude/skills/rest-conventions.md` with your naming rules and file glob `paths: ["**/*.py", "**/*.ts"]`.

### Example 2: Parallel security audit during development

> "I want to run a full security audit of the auth module while I keep working on the feature."

**Answer: Agent**

The audit is a specialist, long-running task. It should not generate noise in the main conversation. It can run in parallel while the developer continues. Set `background: true` and `model: opus` in the agent frontmatter. Pass the audit scope in the prompt.

### Example 3: Deployment workflow

> "I want a command that runs tests, builds the Docker image, and pushes to the registry."

**Answer: Slash Command**

This is a deliberate, consciously triggered workflow. The developer wants to type `/deploy` when they are ready — not have it auto-trigger. Create `.claude/commands/deploy.md` with the full multi-step workflow encoded as structured instructions.

---

## Token Cost Comparison

Understanding startup cost helps you decide whether to use a skill aggressively or sparingly.

| Primitive | Startup cost | On-match cost | Notes |
|-----------|-------------|---------------|-------|
| Skill description | ~50–100 tokens | Always in context | Keep descriptions short and specific |
| Skill full body | ~200–2,000 tokens | Loaded on semantic match | Only loads when needed |
| Agent | 0 at startup | Paid when spawned | Separate context window |
| Slash command | 0 at startup | Paid when invoked | Loaded on `/command` |

Skills incur a small but constant startup cost for every session. If you have 40 skills with 100-token descriptions, that is 4,000 tokens of overhead before the first user message. Audit your skill descriptions and keep them tight. Agents and slash commands cost nothing until explicitly used.

---
