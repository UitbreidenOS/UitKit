# Claudient — Context Map

This file defines shared terminology for the Claudient repository. When Claude Code works inside this repo, it uses these definitions as ground truth.

---

## Language

**skill** — A Markdown file in `skills/` that defines a slash command for Claude Code. Activated by the user via `/skill-name`. Contains when to activate, when not to, instructions, and an example. Skills are scoped to a domain (backend, devops, data, etc.).

**agent** — A Markdown file in `agents/` that defines a subagent: a separate Claude instance spawned by the orchestrator to handle a bounded task. Agents have a specific tool subset and model recommendation.

**hook** — A shell script or Python script in `hooks/` that Claude Code executes automatically in response to events: `PreToolUse`, `PostToolUse`, `PreCompact`, `Notification`. Hooks are configured in `settings.json`.

**rule** — A Markdown file in `rules/` that describes always-on behavioral guidelines. Rules are included in CLAUDE.md and apply to all sessions in the project.

**workflow** — A Markdown file in `workflows/` that documents a multi-step end-to-end process (e.g., feature development, debugging session). Workflows are reference documents, not slash commands.

**prompt** — A Markdown file in `prompts/` containing a reusable prompt template. Includes system prompts, project starters, and task-specific prompts.

**guide** — A Markdown file in `guides/` that documents a Claude Code concept in depth. Guides are human-readable documentation translated into all 5 languages.

**MCP (Model Context Protocol)** — A protocol that allows Claude Code to connect to external servers, exposing additional tools (database access, web search, browser automation). Each MCP server adds tools and consumes context window tokens.

**slash command** — A `/command-name` invocation in Claude Code that activates a skill. The skill file is loaded from `.claude/commands/` or `~/.claude/commands/`.

**Claude Code** — Anthropic's CLI and IDE extension for using Claude as an interactive coding assistant. Not to be confused with the Claude API or Claude.ai chat interface.

**subagent** — A Claude instance spawned by the parent session via the `Agent` tool. Gets a fresh context window, specific tool subset, and model selection. Returns one result to the parent.

**tool** — A function Claude can call during a session (Read, Write, Bash, Agent, WebFetch, etc.). In MCP contexts, also refers to functions exposed by MCP servers.

**context window** — The total token limit for a Claude session: ~200k tokens for Sonnet/Opus. Includes system prompt, conversation history, tool descriptions, and MCP tool schemas.

**CLAUDE.md** — The project instructions file read by Claude Code at session start. Can exist at project, user, or workspace level. Governs Claude's behavior for that context.

---

## Relationships

- A **skill** is to Claude Code what a VS Code extension command is to VS Code — a named, activatable behavior
- A **rule** is always applied; a **skill** is explicitly invoked
- An **agent** is a subagent spawned by the parent; a **skill** is activated within the current session
- A **hook** is automatic (event-driven); a **skill** is manual (slash command)
- A **workflow** describes what to do step by step; a **skill** tells Claude how to do one specific thing
- A **prompt** is a reusable template; a **guide** is explanatory documentation

---

## Flagged Ambiguities

**"skill" vs "command"** — In Claude Code, the underlying files are called "slash commands" or "commands". Claudient uses "skill" to describe the same files when they encode reusable domain expertise. Functionally identical.

**"agent" vs "subagent"** — In Claudient's `agents/` directory, files define subagent specifications. In general Claude Code usage, "agent" often means the primary session. Here, "agent" always means a subagent spawned via the `Agent` tool.

**"hook" vs "rule"** — Hooks run code; rules set behavioral guidelines. A hook is executable; a rule is instructional.

**"workflow" vs "skill"** — A workflow is a multi-step reference document you read before starting a task. A skill is invoked mid-task via slash command to get domain-specific guidance.
