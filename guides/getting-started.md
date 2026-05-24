# Getting Started with Claudient

This guide gets you from zero to a working Claude Code environment with your first skill, agent, and hook — in under 10 minutes.

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed and authenticated
- A project directory you're actively working in

---

## Step 1 — Clone Claudient

```bash
git clone https://github.com/Claudient/Claudient.git ~/Claudient
```

You now have the full library locally. Nothing runs automatically — you pick what you want.

---

## Step 2 — Set Up Your Project's `.claude/` Directory

Claude Code looks for configuration in `.claude/` at your project root.

```bash
mkdir -p your-project/.claude/skills
mkdir -p your-project/.claude/hooks
```

Your project structure should look like:

```
your-project/
├── .claude/
│   ├── skills/        ← skills go here (modern)
│   ├── hooks/         ← hook scripts go here
│   └── settings.json  ← hook config goes here
├── CLAUDE.md          ← rules go here
└── src/
```

---

## Step 3 — Add Your First Skill

Skills are slash commands. Copy any `.md` file from `skills/` into `.claude/skills/`:

```bash
# Example: add the FastAPI skill
cp ~/Claudient/skills/backend/python/fastapi.md your-project/.claude/skills/
```

Now open Claude Code in your project and type `/fastapi` — the skill activates.

> **Note:** `.claude/commands/` still works (legacy path) but `.claude/skills/` is the current standard. When both exist, skills take precedence.

**How to choose a skill:**
- Browse `skills/` by category
- Read the "When to activate" section at the top of each file
- If it matches your current task, copy it in

---

## Step 4 — Add a Rule

Rules live in `CLAUDE.md` at your project root. Claude reads this file at the start of every session.

```bash
# Copy a common rule set into your project's CLAUDE.md
cat ~/Claudient/rules/common/coding-style.md >> your-project/CLAUDE.md
```

Or open `rules/common/` and manually copy the sections relevant to your project.

---

## Step 5 — Add Your First Hook

Hooks run automatically on Claude Code events. They live in `.claude/settings.json`.

Create or open `.claude/settings.json` in your project:

```json
{
  "hooks": {}
}
```

Copy a hook from `hooks/` — each hook file includes the exact JSON to paste in. For example, the cost-tracking lifecycle hook:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh"
          }
        ]
      }
    ]
  }
}
```

Then copy the accompanying script:

```bash
cp ~/Claudient/hooks/lifecycle/cost-tracker.sh your-project/.claude/hooks/
chmod +x your-project/.claude/hooks/cost-tracker.sh
```

---

## Step 6 — (Optional) Add an Agent

Agents are subagent definitions you reference in your Claude sessions. They don't require file copying — you call them by `subagent_type` in an Agent tool invocation.

Browse `agents/` to understand what's available. When you want Claude to delegate a task to a specialist (e.g., a security reviewer, a database specialist), reference the agent definition to understand what it expects and what it returns.

---

## What to Do Next

| Goal | Where to look |
|---|---|
| Write your own skill | [guides/skill-authoring.md](skill-authoring.md) |
| Reduce token costs | [guides/token-optimization.md](token-optimization.md) |
| Understand memory and session state | [guides/memory-management.md](memory-management.md) |
| Secure your Claude Code setup | [guides/security.md](security.md) |
| Build multi-step automated workflows | [guides/agent-orchestration.md](agent-orchestration.md) |
| Automate quality with hooks | [guides/hooks-cookbook.md](hooks-cookbook.md) |

---

## Advanced Features

**`/powerup` — interactive onboarding**
New in v2.1.90: `/powerup` launches a 10-lesson interactive tour with animated demos covering: @-file references, plan mode, /rewind, tasks, CLAUDE.md, MCP, skills/hooks, subagents, session mobility (/teleport), and the effort dial. Run it once to discover features you might have missed.

**Agent Teams (experimental)**
Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Requires tmux or iTerm2 for split-pane mode. Teams config lives in `~/.claude/teams/{team-name}/config.json`. Modes: in-process (default) or split-panes (visual).

**Shared task lists across sessions**
Set `CLAUDE_CODE_TASK_LIST_ID` to the same value in multiple terminal sessions — all sessions see task updates in real-time, enabling coordinated parallel workstreams from separate terminals.

---

## Troubleshooting

**Skill not showing up as a slash command**
— Check the file is in `.claude/skills/` (or `.claude/commands/` for legacy)
— Check the file extension is `.md`
— Restart Claude Code

**Hook not firing**
— Verify the `event` name matches exactly: `PreToolUse`, `PostToolUse`, `PreCompact`, `Notification`
— Check the script path is relative to the project root
— Check the script is executable (`chmod +x`)

**CLAUDE.md not being read**
— It must be at the project root (same level as `src/`, `package.json`, etc.)
— Restart the Claude Code session after editing it

---

## Permission Optimization

### Replace `--dangerously-skip-permissions` with wildcard allowlists

`--dangerously-skip-permissions` bypasses ALL permission checks. Use targeted allowlists instead — they auto-approve specific safe operations while still asking for risky ones:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git add *)",
      "Bash(git diff *)",
      "Edit(docs/**)",
      "Read(**)"
    ],
    "deny": []
  }
}
```

Pattern: `ToolName(glob-pattern)` — allows that tool only when the input matches the glob. Build your allowlist from the operations you approve every session and never worry about forgetting.

### Auto mode for permission handling

`/auto` (or `autoMode: true` in settings) uses a model-based classifier to auto-approve safe commands and pause on risky ones. Better than blanket skip because it still asks for destructive operations (file deletion, force push, env writes).

Toggle with Shift+Tab to cycle between modes: default → auto → manual. Use auto for active development, manual for production deployments or security-sensitive work.

### Sandbox mode

Running Claude Code in sandbox mode (file + network isolation) reduces permission prompts by ~84%. The tradeoff: some operations (git push, external API calls) need sandbox deactivated.

Recommended pattern:
- Sandbox **on** during exploration, initial development, and research tasks
- Sandbox **off** for deploy steps, external integrations, and repository operations

Configure sandbox in `.claude/settings.json`:
```json
{
  "sandbox": true
}
```

Or launch with `--sandbox` for a single session without changing project config.

---

## Work With Us

Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products with developer communities and deliver B2B AI solutions. If you're building something serious with Claude Code and want expert help, a technical partner, or just want to be part of the community — come find us.

**[uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)**
