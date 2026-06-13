# Claude Code CLI Reference

Complete reference for all Claude Code CLI flags, startup commands, session management, slash commands, and environment variables.

---

## Starting Claude Code

```bash
claude                          # interactive session
claude "do X"                   # non-interactive, single prompt
claude -p "do X"                # print mode (no interactive fallback)
claude -p "do X" --bare         # skip CLAUDE.md + MCP discovery (10x faster SDK startup)
claude --add-dir ../other-repo  # give Claude access to another directory
claude -r <session-id>          # resume a previous session
claude --resume <id> --fork-session  # fork at current point, keep original intact
```

`--bare` is the most important flag for SDK use cases. It bypasses CLAUDE.md loading, settings discovery, and MCP connection — cutting startup latency by an order of magnitude when you don't need project context.

---

## Session Management Commands

```bash
claude agents                   # list all running sessions
claude agents --json            # machine-readable JSON array
claude agents --cwd .           # filter sessions by current directory
claude rm <session-id>          # remove session from agent view
claude respawn <session-id>     # restart session with history intact
claude respawn --all            # restart all running sessions
claude daemon status            # show supervisor process state
```

Session IDs are UUIDs shown in the agent list. Pass them to `--resume` or `--fork-session` to continue or branch work.

---

## Project Commands

```bash
claude project purge            # delete all local state for this project
claude plugin details <name>    # show plugin component inventory + token cost
```

`project purge` clears cached session data, plugin state, and local settings stored under `.claude/`. It does not touch `.claude/settings.json` or any committed files.

---

## Key Slash Commands (In-Session)

| Command | Description | Added |
|---|---|---|
| `/goal` | Set or view the current session goal — pins intent at the top of context | 2024 |
| `/btw` | Add a background note to context without triggering a response | 2024 |
| `/voice` | Toggle voice dictation mode | 2025 |
| `/compact` | Manually trigger context compaction | 2024 |
| `/rewind` | Step back to a previous turn in the current session | 2025 |
| `/branch` | Create a new session fork from the current state | 2025 |
| `/diff` | Show a unified diff of all changes made in the session | 2024 |
| `/code-review` | Launch the built-in code review skill | 2024 |
| `/focus` | Narrow Claude's attention to a specific file or directory | 2025 |
| `/batch` | Execute a list of tasks in parallel across subagents | 2025 |
| `/teleport` | Jump to a different directory without ending the session | 2025 |
| `/remote-control` | Enable external control of the session via API | 2025 |
| `/loop` | Run a prompt or command on a recurring interval | 2025 |
| `/powerup` | Temporarily increase model tier for a single response | 2025 |
| `/fast` | Switch current session to Haiku for speed | 2025 |
| `/effort` | Set effort level for the session (`low` / `medium` / `high` / `xhigh`) | 2025 |
| `/cost` | Show token usage and estimated cost for the session | 2024 |
| `/extra-usage` | Show breakdown of tool call token consumption | 2025 |
| `/scroll-speed` | Adjust the output streaming speed in the terminal | 2025 |
| `/recap` | Generate a structured summary of the session so far | 2025 |
| `/team-onboarding` | Generate an onboarding guide for a new team member from project context | 2025 |

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | API key — required for all non-interactive use |
| `ANTHROPIC_BASE_URL` | Override the API endpoint (custom proxies, internal gateways) |
| `CLAUDE_CODE_TASK_LIST_ID` | Shared task list ID — enables cross-session task coordination |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | Set to `1` to enable agent teams feature |
| `ENABLE_PROMPT_CACHING_1H` | Set to `1` to use the 1-hour cache TTL tier |
| `ENABLE_TOOL_SEARCH` | Threshold at which deferred tool loading activates |
| `CLAUDE_EFFORT` | Default effort level for new sessions (`low` / `medium` / `high` / `xhigh`) |
| `CLAUDE_AGENT_NAME` | Identity string for this agent — used in hook environment variables |
| `OUTPUT_SIZE_WARN_THRESHOLD` | Byte threshold that triggers hook output size warnings |

Variables set in the shell override project settings. Variables set in `.env` at project root are loaded automatically.

---

## `additionalDirectories` Setting

Persistent alternative to `--add-dir`. Configured in `.claude/settings.json` or `~/.claude/settings.json`:

```json
{
  "additionalDirectories": ["../shared-lib", "../design-system"]
}
```

Paths are resolved relative to the project root. Use this when multiple repos collaborate on a single product and Claude needs cross-repo read access in every session without repeating the flag.

---

## Flag Reference Summary

| Flag | Short | Description |
|---|---|---|
| `--print` | `-p` | Non-interactive print mode |
| `--bare` | | Skip CLAUDE.md, settings, and MCP discovery |
| `--add-dir <path>` | | Add a directory to Claude's working set |
| `--resume <id>` | `-r` | Resume a previous session by ID |
| `--fork-session` | | Fork instead of resuming when used with `--resume` |
| `--json` | | Output session list as JSON (used with `agents`) |
| `--cwd <path>` | | Filter agents by working directory |
| `--all` | | Apply command to all sessions (used with `respawn`) |

---
