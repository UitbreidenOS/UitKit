# Agent Frontmatter Reference

Every Claude Code agent file begins with a YAML frontmatter block. This block controls identity, routing, model selection, execution behaviour, tool access, and display. This reference covers every supported field with types, defaults, and usage guidance.

---

## Required Fields

### `name`

**Type:** `string` (kebab-case)
**Required:** Yes

The identifier used to spawn this agent programmatically. Must be unique across all agent files in the project.

```yaml
name: security-auditor
```

Used in:
```python
Agent(subagent_type="security-auditor", prompt="...")
```

Keep names short, descriptive, and hyphenated. Avoid version numbers or environment suffixes in the name — use separate files instead.

---

### `description`

**Type:** `string`
**Required:** Yes
**Max recommended length:** 200 characters

One-line description of the agent's domain and purpose. Used by Claude's router for auto-delegation decisions — this is the primary signal that determines when this agent gets selected.

```yaml
description: "Audits code for OWASP Top 10 vulnerabilities, secret exposure, and injection risks. Activate for security reviews before any PR."
```

Write this as if explaining to Claude when to delegate here. Specific trigger conditions outperform generic capability descriptions. Bad: `"A security agent."` Good: `"Activate when reviewing authentication code, API endpoints, or before merging any PR that touches secrets, sessions, or user input handling."`

---

## Model Fields

### `model`

**Type:** `string` — one of `"haiku"`, `"sonnet"`, `"opus"`
**Default:** Inherits from the parent session's active model

Overrides the model used for this agent's context window. Does not affect the parent session.

```yaml
model: opus
```

| Value | When to use |
|-------|-------------|
| `"haiku"` | Mechanical tasks: reformatting, renaming, simple classification, boilerplate generation. ~60% cost reduction vs Sonnet. |
| `"sonnet"` | Standard development work. Good balance of speed and reasoning. |
| `"opus"` | Complex reasoning: security analysis, architecture decisions, ambiguous requirements, multi-file refactors with subtle constraints. |

Never use `"haiku"` for tasks requiring judgment — security analysis, architecture decisions, or anything where a wrong answer has downstream consequences.

---

## Execution Fields

### `background`

**Type:** `boolean`
**Default:** `false`

When `true`, the agent always runs as a non-blocking background task. The parent session continues immediately without waiting for the agent to complete.

```yaml
background: true
```

Use when:
- The agent's output is not needed before the parent's next step
- You are parallelising multiple specialist agents
- The task is observability/logging (audit logs, metrics writes) rather than decision-making

Avoid when:
- The parent needs the agent's findings to determine its next action
- The agent writes files the parent will immediately read

---

### `isolation`

**Type:** `string` — `"worktree"` or absent
**Default:** None (agent runs in the current working directory)

When set to `"worktree"`, Claude Code creates a temporary git worktree for the agent. The agent operates on an isolated copy of the repository. If the agent makes no changes, the worktree is cleaned up automatically on completion.

```yaml
isolation: worktree
```

Use when:
- The agent will make exploratory edits that should not affect the working tree unless explicitly merged
- Multiple agents are running in parallel and must not conflict on the same files
- You want a clean rollback path if the agent's changes are unsatisfactory

**Caveat:** Requires a git repository. In non-git directories, worktree creation fails silently and the agent runs against the working copy.

---

## Prompt Fields

### `initialPrompt`

**Type:** `string`
**Default:** None

A string automatically submitted as the first user turn when the agent runs as a standalone session (not as a subagent). Has no effect when the agent is spawned via `Agent(subagent_type="...")`.

```yaml
initialPrompt: "You are starting a security audit session. Begin by listing all files in /src/auth/ and identifying entry points that accept external input."
```

Use for agents that serve as project entry points or interactive assistants that users launch directly rather than through a parent orchestrator.

---

## Display Fields

### `color`

**Type:** `string` — CSS color name or hex value
**Default:** None (uses terminal default)

Sets the display color for this agent's output in the CLI. Purely cosmetic — has no effect on behaviour.

```yaml
color: "#ff4444"
```

Useful when running multiple agents in parallel and you need to visually distinguish their output streams. Accepts standard CSS color names (`"red"`, `"dodgerblue"`) or hex strings (`"#ff4444"`).

---

## Hook Fields

### `hooks`

**Type:** `object`
**Default:** None

Defines hooks scoped exclusively to this agent. Same structure as session-level hooks in `settings.json`. Hooks defined here fire only when this agent is active — they do not affect the parent session or other agents.

```yaml
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-changes.sh"
```

All standard hook events are supported: `SessionStart`, `PreToolUse`, `PostToolUse`, `PreCompact`, `PostCompact`, `Stop`, `Notification`.

Use to:
- Log agent completion to audit files
- Validate files the agent writes before the parent session reads them
- Send notifications when a long-running agent finishes

---

## Tool Restriction Fields

### `tools`

**Type:** `array` of `string`
**Default:** All tools available (inherits from session permissions)

Restricts the agent to only the listed tools. Any tool call not in this list is blocked.

```yaml
tools:
  - Read
  - Grep
  - Glob
  - Bash
```

Tool restriction is a security and focus mechanism. A read-only research agent should not have Write or Edit. A formatting agent does not need WebSearch.

**Important caveat:** Tool restrictions apply to this agent's own calls. They do not prevent the agent from instructing a subagent it spawns to use unrestricted tools. If you are restricting an agent for security reasons, restrict its sub-subagents separately.

Common read-only set: `["Read", "Grep", "Glob"]`
Common analysis set: `["Read", "Grep", "Glob", "Bash"]`
Full development set: `["Read", "Write", "Edit", "Bash", "Grep", "Glob"]`

---

## Effort Fields

### `effort`

**Type:** `string` — one of `"low"`, `"medium"`, `"high"`, `"xhigh"`
**Default:** Inherits from the parent session's effort setting

Sets the default effort level for this agent's context window. Overrides the session default for this agent only.

```yaml
effort: xhigh
```

| Value | When to use |
|-------|-------------|
| `"low"` | Simple formatters, classifiers, mechanical transformations |
| `"medium"` | Routine development tasks, straightforward refactors |
| `"high"` | Complex feature implementation, multi-file changes |
| `"xhigh"` | Architecture decisions, security audits, debugging deep issues, anything where missing a detail has real consequences |

Effort level affects how much the model "thinks" before responding. Higher effort = more tokens, more latency, more thorough output. Use `"low"` for cost-sensitive mechanical agents and `"xhigh"` when thoroughness matters more than speed.

---

## Complete Example

A fully annotated agent combining multiple fields:

```yaml
---
name: security-auditor
description: "Audits code for OWASP Top 10 vulnerabilities, secret exposure, and injection risks. Activate for security reviews before any PR."
model: opus
background: false
isolation: worktree
effort: xhigh
tools:
  - Read
  - Grep
  - Glob
  - Bash
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
color: "#ff4444"
---

# Security Auditor

## Purpose
Performs a structured security review against OWASP Top 10, secret exposure patterns,
and injection risk surfaces. Runs in an isolated worktree so exploratory file reads
do not affect the working tree.

## Instructions
...
```

---

## Field Compatibility Table

| Field | Subagent use | Standalone session | Notes |
|-------|-------------|-------------------|-------|
| `name` | Required | Required | Used in `Agent(subagent_type="name")` |
| `description` | Required | Required | Primary routing signal |
| `model` | Yes | Yes | Overrides parent model for this context |
| `background` | Yes | No | Only meaningful when spawned as subagent |
| `isolation` | Yes | Yes | Requires git repo |
| `initialPrompt` | No | Yes | Only fires in standalone sessions |
| `color` | Yes | Yes | Cosmetic only |
| `hooks` | Yes | Yes | Scoped to this agent's session only |
| `tools` | Yes | Yes | Allowlist; blocks all unlisted tools |
| `effort` | Yes | Yes | Overrides session effort for this context |

---

## Caveats

**`isolation: "worktree"` requires git.** In a non-git directory, worktree creation fails silently and the agent runs against the working copy with no isolation. Verify your project is a git repository before relying on this field for safety.

**`background: true` agents are fire-and-forget from the parent's perspective.** The parent continues immediately. If you need the agent's output to make a decision, do not use `background: true`. Use it only for tasks where the result is consumed asynchronously (logs, notifications, side effects).

**`model: "haiku"` is a cost optimisation, not a capability downgrade for simple tasks.** For mechanical work — reformatting, simple renaming, boilerplate generation — Haiku performs equivalently to Sonnet at ~60% lower cost. Do not use Haiku for security analysis, architecture decisions, or any task where subtle errors compound. The cost difference is not worth the quality risk.

**Tool restrictions are not a sandbox.** They block the agent's direct tool calls. An agent instructed to spawn sub-subagents can pass unrestricted tool access to those subagents unless you also restrict them. For genuine security boundaries, restrict every layer of the agent tree separately.

**`description` is the most important field after `name`.** The router uses it to decide when to delegate here. A vague or generic description causes mis-routing — either the agent fires when it should not, or it is never selected. Write the description as an explicit trigger condition, not a capability summary.

---
