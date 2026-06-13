# Claude Code Statusline Scripting — Mid-2026

A statusline is a single-line text output displayed in Claude Code's UI during a session. It updates in real-time as context, cost, and model state change. This guide covers everything needed to write statusline scripts: configuration, JSON schema, environment variables, ANSI styling, and production-ready patterns.

---

## What Is a Statusline?

A statusline script runs periodically (typically every 100ms) and receives a JSON object on stdin containing the current session state. The script writes a single line to stdout — ANSI-escaped text with colors, progress bars, and hyperlinks. Claude Code displays this line in the UI.

**Why write statuslines?**
- Track session cost/tokens in real-time without switching windows
- Monitor rate limit pressure or context window saturation
- Show git state, model name, or deployment status inline
- Custom domain-specific metrics (lines of code changed, test count, etc.)

**Lifecycle:**
1. Claude Code starts a session
2. Settings configure a statusline script path
3. Every 100ms (or on state change), Claude Code reads session state
4. Session state is serialized to JSON and piped to the script's stdin
5. Script parses JSON, computes output, writes a line to stdout
6. Claude Code displays that line until the next update

---

## Settings.json Configuration

### Basic Structure

```json
{
  "statusline": {
    "command": "bash",
    "args": ["/path/to/statusline.sh"],
    "timeout": 50,
    "cache": 100
  }
}
```

| Field | Required | Type | Default | Notes |
|-------|----------|------|---------|-------|
| `command` | Yes | string | — | Executable to run (e.g., `"bash"`, `"python3"`, `"node"`) |
| `args` | Yes | array | — | Arguments passed to the command. Final element should be script path or `-c` with inline code |
| `timeout` | No | number | 50 | Timeout in milliseconds. If script exceeds this, output is dropped and next cycle proceeds |
| `cache` | No | number | 100 | Time in milliseconds to cache the previous output; useful for scripts that rarely change |
| `env` | No | object | {} | Environment variables passed to the script process |
| `killTimeout` | No | number | 5000 | Time in milliseconds to wait for graceful shutdown before killing the process |

### Real-World Examples

**Bash script with explicit path:**
```json
{
  "statusline": {
    "command": "bash",
    "args": ["$HOME/.claude/statuslines/my-statusline.sh"],
    "timeout": 50,
    "cache": 100
  }
}
```

**Python script inline (small scripts):**
```json
{
  "statusline": {
    "command": "python3",
    "args": ["-c", "import json, sys; data = json.load(sys.stdin); print(f\"Cost: ${data['cost']['total_cost_usd']:.2f}\")"],
    "timeout": 40,
    "cache": 500
  }
}
```

**Node.js with custom environment:**
```json
{
  "statusline": {
    "command": "node",
    "args": ["/opt/statuslines/tracker.js"],
    "timeout": 60,
    "env": {
      "NODE_ENV": "production",
      "STATUSLINE_DEBUG": "0"
    }
  }
}
```

**Multiple project configs (project-level .claude/settings.json):**
```json
{
  "statusline": {
    "command": "bash",
    "args": ["${CLAUDE_PROJECT_DIR}/.claude/statuslines/project-tracker.sh"],
    "timeout": 50,
    "cache": 100
  }
}
```

---

## Complete stdin JSON Schema

Every time the statusline script runs, Claude Code pipes a complete JSON object on stdin. Understanding every field enables data-driven styling.

### Full Structure (All Fields)

```json
{
  "session_id": "sess-abc123def456",
  "timestamp": 1718222400000,
  "model": {
    "id": "claude-opus-4-20250514",
    "display_name": "Claude Opus",
    "family": "opus",
    "input_price_per_mtok": 0.015,
    "output_price_per_mtok": 0.045
  },
  "context_window": {
    "max_tokens": 200000,
    "context_window_size": 200000,
    "used_tokens": 142500,
    "used_percentage": 71.25,
    "input_tokens_in_session": 145000,
    "output_tokens_in_session": 85000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "thinking_tokens": 0
  },
  "cost": {
    "total_cost_usd": 2.847,
    "session_input_cost": 2.175,
    "session_output_cost": 3.825,
    "total_lines_added": 342,
    "total_lines_removed": 78,
    "total_lines_modified": 87,
    "api_errors": 0,
    "successful_calls": 145
  },
  "rate_limits": {
    "five_hour": {
      "limit": 40000,
      "used": 28500,
      "used_percentage": 71.25,
      "remaining": 11500,
      "reset_at": 1718225600000
    },
    "per_minute": {
      "limit": 100000,
      "used": 14250,
      "used_percentage": 14.25,
      "remaining": 85750,
      "reset_at": 1718222460000
    },
    "requests_per_minute": {
      "limit": 500,
      "used": 78,
      "used_percentage": 15.6,
      "remaining": 422,
      "reset_at": 1718222460000
    }
  },
  "workspace": {
    "repo": {
      "name": "my-project",
      "path": "/Users/alice/code/my-project",
      "branch": null
    },
    "git_worktree": "feature/dashboard-redesign",
    "git_status": {
      "modified": 14,
      "added": 8,
      "deleted": 2,
      "untracked": 21
    },
    "current_dir": "/Users/alice/code/my-project/src/components",
    "current_user": "alice"
  },
  "effort": {
    "level": "extended",
    "thinking_enabled": true,
    "thinking_budget_tokens": 15000,
    "thinking_spent_tokens": 8500
  },
  "mcp_servers": {
    "count": 3,
    "active": ["github", "filesystem", "custom-api"],
    "connected": 3,
    "disconnected": 0
  },
  "tools": {
    "total_available": 47,
    "called_in_session": 12,
    "successful": 11,
    "failed": 1,
    "last_call": "bash_execute"
  },
  "ui_state": {
    "theme": "dark",
    "font_size": 13,
    "columns": 180,
    "lines": 50
  }
}
```

### Field Reference by Category

#### Model (`model` object)

| Field | Type | Null conditions | Example |
|-------|------|-----------------|---------|
| `model.id` | string | Never | `"claude-opus-4-20250514"` |
| `model.display_name` | string | Never | `"Claude Opus"` |
| `model.family` | string | `null` if unknown | `"opus"`, `"sonnet"`, `"haiku"` |
| `model.input_price_per_mtok` | number | `0` if price unavailable | `0.015` |
| `model.output_price_per_mtok` | number | `0` if price unavailable | `0.045` |

**Usage:** Display model name, derive cost multipliers for pricing calculations, detect model upgrades.

#### Context Window (`context_window` object)

| Field | Type | Null conditions | Notes |
|-------|------|-----------------|-------|
| `context_window.max_tokens` | number | Never | Maximum allowable in requests |
| `context_window.context_window_size` | number | Never | Total capacity (e.g., 200000) |
| `context_window.used_tokens` | number | ≥0 | Sum of input+output so far |
| `context_window.used_percentage` | number | 0–100 | Calculated as (used_tokens / context_window_size) * 100 |
| `context_window.input_tokens_in_session` | number | ≥0 | Total input tokens sent to API |
| `context_window.output_tokens_in_session` | number | ≥0 | Total output tokens received |
| `context_window.cache_creation_input_tokens` | number | ≥0 | Tokens used to create prompt cache entries |
| `context_window.cache_read_input_tokens` | number | ≥0 | Tokens charged at reduced rate for cache hits |
| `context_window.thinking_tokens` | number | ≥0 | Tokens spent on extended thinking (if enabled) |

**Usage:** Progress bars, warnings at 80%+ saturation, alerts when >90%, token accounting.

#### Cost (`cost` object)

| Field | Type | Null conditions | Notes |
|-------|------|-----------------|-------|
| `cost.total_cost_usd` | number | ≥0 | Sum of input+output cost this session |
| `cost.session_input_cost` | number | ≥0 | Input tokens × input_price_per_mtok / 1M |
| `cost.session_output_cost` | number | ≥0 | Output tokens × output_price_per_mtok / 1M |
| `cost.total_lines_added` | number | ≥0 | Lines added across all file edits |
| `cost.total_lines_removed` | number | ≥0 | Lines deleted across all file edits |
| `cost.total_lines_modified` | number | ≥0 | Lines changed (including both add+remove) |
| `cost.api_errors` | number | ≥0 | Count of failed API calls |
| `cost.successful_calls` | number | ≥0 | Count of successful tool/API invocations |

**Usage:** Cost display, per-line cost calculations, error tracking, productivity metrics.

#### Rate Limits (`rate_limits` object)

Three nested limit structures: `five_hour`, `per_minute`, `requests_per_minute`. Each has:

| Field | Type | Null conditions | Notes |
|-------|------|-----------------|-------|
| `*.limit` | number | Never | Maximum allowed in the window |
| `*.used` | number | ≥0 | Consumed so far |
| `*.used_percentage` | number | 0–100 | (used / limit) × 100 |
| `*.remaining` | number | ≥0 | limit - used |
| `*.reset_at` | number | Timestamp | Epoch milliseconds when window resets |

**Usage:** Rate limit progress bars, warnings at 70%+ saturation, countdown to reset.

#### Workspace (`workspace` object)

| Field | Type | Null conditions | Notes |
|-------|------|-----------------|-------|
| `workspace.repo.name` | string | `null` if not in repo | Repository name (directory name or from `.git/config`) |
| `workspace.repo.path` | string | `null` if not in repo | Absolute path to repo root |
| `workspace.repo.branch` | string | `null` always (deprecated) | Use `git_worktree` instead |
| `workspace.git_worktree` | string | `null` if not in repo or no worktree | Current branch or worktree name |
| `workspace.git_status.modified` | number | ≥0 | Files with unstaged changes |
| `workspace.git_status.added` | number | ≥0 | Staged files |
| `workspace.git_status.deleted` | number | ≥0 | Deleted files |
| `workspace.git_status.untracked` | number | ≥0 | Untracked files (not in .gitignore) |
| `workspace.current_dir` | string | `null` if unknown | Absolute path to working directory |
| `workspace.current_user` | string | `null` if unknown | Current logged-in user (from `whoami` or env) |

**Usage:** Display repo name and branch, show git status summary, path labels.

#### Effort (`effort` object)

| Field | Type | Null conditions | Notes |
|-------|------|-----------------|-------|
| `effort.level` | string | `null` if not set | `"normal"`, `"extended"`, etc. |
| `effort.thinking_enabled` | boolean | `false` if N/A | Whether extended thinking is active |
| `effort.thinking_budget_tokens` | number | ≥0 | Max tokens allocated for thinking |
| `effort.thinking_spent_tokens` | number | ≥0 | Tokens spent on thinking so far |

**Usage:** Show effort level indicator, thinking token progress bar.

#### MCP Servers (`mcp_servers` object)

| Field | Type | Null conditions | Notes |
|-------|------|-----------------|-------|
| `mcp_servers.count` | number | ≥0 | Total configured servers |
| `mcp_servers.active` | array | `[]` if none | Server names currently connected |
| `mcp_servers.connected` | number | ≥0 | Number of active connections |
| `mcp_servers.disconnected` | number | ≥0 | Number that failed to connect |

**Usage:** Show server health, warn on disconnections, display active server count.

#### Tools (`tools` object)

| Field | Type | Null conditions | Notes |
|-------|------|-----------------|-------|
| `tools.total_available` | number | ≥0 | Tools across all MCP servers + built-ins |
| `tools.called_in_session` | number | ≥0 | Tools invoked at least once |
| `tools.successful` | number | ≥0 | Successful invocations |
| `tools.failed` | number | ≥0 | Failed invocations |
| `tools.last_call` | string | `null` if none invoked | Name of most recent tool called |

**Usage:** Tool usage telemetry, error rate display, activity indicator.

#### UI State (`ui_state` object)

| Field | Type | Null conditions | Notes |
|-------|------|-----------------|-------|
| `ui_state.theme` | string | `"dark"` default | `"dark"` or `"light"` |
| `ui_state.font_size` | number | 11–18 | Current font size in points |
| `ui_state.columns` | number | ≥40 | Terminal width in characters |
| `ui_state.lines` | number | ≥10 | Terminal height in lines |

**Usage:** Responsive layouts, theme-aware color choices, adaptive progress bar widths.

---

## Environment Variables ($COLUMNS and $LINES)

Claude Code automatically sets two environment variables before executing the statusline script:

### $COLUMNS

The width of the terminal/statusline area in **characters**.

**Set automatically:** Before the script runs, `export COLUMNS=<width>`

**Usage patterns:**
```bash
# Responsive progress bar width
COLUMNS=${COLUMNS:-80}
bar_width=$(( (COLUMNS - 40) / 2 ))  # Use remaining space for bar
```

**Typical range:** 60–200, depending on user's terminal width.

### $LINES

The height of the display area in **lines**. Usually **1** for statusline scripts (since they output a single line).

**Set automatically:** Before the script runs, `export LINES=1` (almost always)

**Usage:** Rarely used in statuslines; useful for debugging or graceful degradation in multi-line outputs (not standard statusline behavior).

**Example:**
```bash
# Degrade output on narrow terminals
if [ "$COLUMNS" -lt 80 ]; then
  echo "Status"  # Minimal output
else
  echo "Detailed status with more fields"
fi
```

---

## Trigger Events and Execution Model

Statusline scripts are **not event-driven**. They execute on a schedule:

### Execution Triggers

1. **Polling interval (default 100ms):** Script runs every 100ms if `cache` is 0 or expired
2. **State change:** If significant state changes (cost, context %), script may run immediately (before cache expires)
3. **Manual refresh:** User can refresh manually in the UI
4. **Session lifecycle:** Script runs once at session start, once at session end (with final state)

### Performance Implications

- **Timeout exceeded:** If script doesn't output within `timeout` ms, the previous line is displayed and execution is killed
- **Long-running scripts:** Avoid blocking I/O; precompute any expensive operations
- **Cache strategy:** Set `cache` to 500–1000 ms to reduce CPU usage; trade real-time for responsiveness

### Example: Polling Without Blocking

```bash
#!/bin/bash
# Fast exit if nothing changed
input=$(cat)
if ! command -v jq &>/dev/null; then 
  echo "jq missing"; 
  exit 0; 
fi

# Extract only what you need (not the entire JSON)
ctx_pct=$(echo "$input" | jq -r '.context_window.used_percentage // 0')
cost=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# Compute and output
printf "CTX: %.0f%% | Cost: \$%.2f\n" "$ctx_pct" "$cost"
```

---

## ANSI Color Codes and Styling

Statuslines use standard ANSI escape codes for text colors, backgrounds, and decorations.

### Color Reference

| Color | Code | Bash Variable | Hex | Use Case |
|-------|------|---------------|-----|----------|
| Reset | `\033[0m` | `$RESET` | — | End of colored section |
| **Bold** | `\033[1m` | `$BOLD` | — | Headers, labels |
| Black | `\033[0;30m` | `$BLACK` | #000000 | Not recommended |
| Red | `\033[0;31m` | `$RED` | #FF0000 | Errors, high saturation (80%+) |
| Green | `\033[0;32m` | `$GREEN` | #00AA00 | Healthy, low saturation (<50%) |
| Yellow | `\033[0;33m` | `$YELLOW` | #FFAA00 | Warnings, medium saturation (50–80%) |
| Blue | `\033[0;34m` | `$BLUE` | #0055FF | Informational |
| Cyan | `\033[0;36m` | `$CYAN` | #00AAFF | Highlights, labels |
| Magenta | `\033[0;35m` | `$MAGENTA` | #FF00FF | Special metrics |
| White | `\033[0;37m` | `$WHITE` | #FFFFFF | Text (light theme issue) |

### Initialization in Bash

```bash
#!/bin/bash
RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
BLUE=$'\033[0;34m'
CYAN=$'\033[0;36m'
MAGENTA=$'\033[0;35m'
BOLD=$'\033[1m'
RESET=$'\033[0m'

# Output
printf "%s%s%s\n" "$RED" "Error message" "$RESET"
```

### Brightness Variants (256-Color Mode)

For more granular control, use 256-color palette:
```bash
# Bright/light variant of a color
BRIGHT_RED=$'\033[0;91m'    # Bright red
BRIGHT_GREEN=$'\033[0;92m'  # Bright green

# Full 256-color palette
COLOR_208=$'\033[38;5;208m' # Orange
COLOR_135=$'\033[38;5;135m' # Purple
```

### Conditional Coloring Based on Thresholds

```bash
color_for_percentage() {
  local pct=$1
  if [ "$pct" -ge 80 ]; then
    echo -n "$RED"
  elif [ "$pct" -ge 50 ]; then
    echo -n "$YELLOW"
  else
    echo -n "$GREEN"
  fi
}

# Usage
ctx_pct=75
color=$(color_for_percentage "$ctx_pct")
printf "%s%d%%%s\n" "$color" "$ctx_pct" "$RESET"
```

### Light Theme Considerations

If the UI reports `"theme": "light"`, adjust color choices to ensure contrast on white backgrounds:

```bash
# Read theme from input
theme=$(echo "$input" | jq -r '.ui_state.theme // "dark"')

if [ "$theme" = "light" ]; then
  TEXT_COLOR="$BLACK"      # Black text on light background
  ACCENT_COLOR="$BLUE"     # Blue for links/highlights
else
  TEXT_COLOR="$WHITE"      # White on dark background
  ACCENT_COLOR="$CYAN"     # Cyan works on dark
fi
```

---

## OSC 8 Hyperlinks

OpenDocument System (OSC) 8 sequences allow embedding clickable hyperlinks in terminal output. Claude Code supports these for direct action links (open editor, show logs, run commands).

### OSC 8 Syntax

```
\033]8;id;URI\033\\text\033]8;;\033\\
```

Breaking it down:
- `\033]8;` — OSC 8 hyperlink escape sequence start
- `id` — Optional unique identifier (often empty)
- `URI` — URL or special action URI
- `\033\\` — String terminator (Bell)
- `text` — Visible link text
- `\033]8;;\033\\` — Hyperlink close

### Bash Implementation

```bash
#!/bin/bash
make_link() {
  local text=$1 uri=$2
  printf '\033]8;;%s\033\\%s\033]8;;\033\\\n' "$uri" "$text"
}

# Usage
make_link "View logs" "file:///var/log/app.log"
```

### Example: URI Schemes

| Scheme | Purpose | Example |
|--------|---------|---------|
| `file://` | Open file in editor | `file:///Users/alice/project/src/main.ts` |
| `http://` / `https://` | Open URL in browser | `https://docs.example.com` |
| `claude://` | Claude-specific actions (internal) | `claude://open-file?path=/Users/alice/file.ts` |

### Real-World Statusline with Links

```bash
#!/bin/bash
CYAN=$'\033[0;36m'
RESET=$'\033[0m'

input=$(cat)
repo_path=$(echo "$input" | jq -r '.workspace.repo.path // ""')
repo_name=$(echo "$input" | jq -r '.workspace.repo.name // "."')

# Make the repo name clickable
if [ -n "$repo_path" ]; then
  link=$'\033]8;;file://'"${repo_path}"$'\033\\'"${repo_name}"$'\033]8;;\033\\'
  printf "%s%s%s\n" "$CYAN" "$link" "$RESET"
else
  printf "%s\n" "$repo_name"
fi
```

---

## The 6 Claudient Statusline Scripts Explained

Claudient ships with 6 reference implementations demonstrating different styles and use cases. Use these as templates.

### 1. Minimal — Bare Essentials

**File:** `statuslines/minimal.sh`

**Output:** `[claude] my-project feature/branch`

**Purpose:** Fast, under 50ms, minimal parsing. Shows only model and location.

**Key techniques:**
- Extract only 3 fields from JSON (model, repo, branch)
- Short color setup (3 colors)
- No arithmetic (no progress bars)
- Direct `jq` extraction without intermediate variables

**When to use:** Distraction-free coding, slow machines, bandwidth-constrained environments.

```bash
model=$(echo "$input" | jq -r '.model.display_name // "claude"')
short_model=$(echo "$model" | sed 's/^claude-//' | cut -c1-16)
```

---

### 2. Cost-Watch — Finance-Focused

**File:** `statuslines/cost-watch.sh`

**Output:** `$2.85 | +342/-78 lines | CTX 71%`

**Purpose:** Track spend per session, monitor code changes, watch context.

**Key techniques:**
- Calculate cost from input/output rates
- Show line diffs (useful for refactoring sessions)
- Color context by threshold (green <50%, yellow 50–80%, red 80%+)
- Use simple arithmetic in shell for percentage math

**When to use:** Monitoring session budgets, tracking productivity metrics, refactoring work.

```bash
if [ "$ctx_int" -ge 80 ]; then
  ctx_color="$RED"
elif [ "$ctx_int" -ge 50 ]; then
  ctx_color="$YELLOW"
else
  ctx_color="$GREEN"
fi
```

---

### 3. Context-Budget — Token Accounting

**File:** `statuslines/context-budget.sh`

**Output:** `CTX [▓▓▓▓░░░░░░] 41% | 82K/200K tokens | effort:extended`

**Purpose:** Detailed token breakdown with visual progress bar.

**Key techniques:**
- Implement progress bar from scratch (▓ filled, ░ empty)
- Convert tokens to human-readable units (K, M)
- Show effort level if extended thinking is enabled
- Scale bar width based on $COLUMNS (responsive)

**When to use:** Extended thinking workflows, deep research, large context windows (200K+).

```bash
make_bar() {
  local pct=${1:-0} width=${2:-10}
  local filled=$(( pct * width / 100 ))
  for ((i=0; i<filled; i++)); do bar="${bar}▓"; done
  for ((i=0; i<empty; i++)); do bar="${bar}░"; done
  echo "$bar"
}
```

---

### 4. Full — Everything Dashboard

**File:** `statuslines/full.sh`

**Output:** `[opus] my-project:feature | $2.85 | +342/-78 | [▓▓▓▓▓░░░░░] 51%`

**Purpose:** Complete session overview in one line.

**Key techniques:**
- Balance information density with readability
- Use brackets and pipes for structure
- Color each section independently (model, location, cost, changes, context)
- Abbreviate model names (claude-opus-4 → opus)

**When to use:** General-purpose development, session overviews, maximizing info in minimal space.

```bash
short_model=$(echo "$model" | sed 's/^claude-//' | sed 's/-[0-9][0-9]*-[0-9][0-9]*//')
```

---

### 5. Rate-Limit — API Quota Monitor

**File:** `statuslines/rate-limit.sh`

**Output:** `5h:[▓▓░░░] 71% | [opus] $2.85`

**Purpose:** Watch API rate limits during heavy sessions.

**Key techniques:**
- Extract rate limit data from `.rate_limits.five_hour`
- Small progress bar (5 chars) to save space
- Place most urgent info first (rate limit status)
- Warn at 70% and above

**When to use:** Running many tool calls, chatbots, batch workflows.

```bash
rl_5h=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // 0')
rl_int=$(printf "%.0f" "$rl_5h" 2>/dev/null || echo "0")
```

---

### 6. Git-Focused — Version Control Centric

**File:** `statuslines/git-focused.sh`

**Output:** `main ▲3 | feature/api +8/-2 | $1.23`

**Purpose:** Real-time git status, branch indication, change tracking.

**Key techniques:**
- Show current branch prominently
- Display unstaged/staged/deleted counts compactly
- Optional branch symbol (▲ for main, ◀ for feature)
- Cost as a trailing metric (secondary)

**When to use:** Refactoring, API development, multi-branch work.

**Note:** This script is reference code demonstrating git integration; implement using `.workspace.git_status`.

---

## Writing Statusline Scripts from Scratch

A step-by-step walkthrough of building a custom statusline.

### Step 1: Choose Your Language and Template

Bash is recommended for CLI tools (fast, no deps), but Python/Node.js work if jq is unavailable.

**Bash template:**
```bash
#!/bin/bash
set -euo pipefail

input=$(cat)
if ! command -v jq &>/dev/null; then 
  echo "[jq missing]"; 
  exit 0; 
fi

# Parse JSON
field=$(echo "$input" | jq -r '.path.to.field // default_value')

# Output
printf "%s\n" "$field"
```

**Python template:**
```python
#!/usr/bin/env python3
import json, sys

try:
    data = json.load(sys.stdin)
except json.JSONDecodeError:
    print("[parse error]")
    sys.exit(0)

field = data.get('path', {}).get('to', {}).get('field', 'default')
print(field)
```

### Step 2: Plan Your Information Hierarchy

Statusline space is precious (~180 chars on typical terminals). Prioritize ruthlessly.

**Example plan:**
1. Primary (leftmost): Most urgent info (errors, limits)
2. Secondary (middle): Context/state (current task, model)
3. Tertiary (right): Metrics (cost, time)

```
[ Status ] Model Context | Cost | Metrics
  ^^^^^^   ^^^^^^^^^^^^^   ^^^^   ^^^^^^^
Priority 1    Pri 2        Pri 3  Pri 3
```

### Step 3: Define Color Thresholds

Colors should follow the same mental model:
- Green: Healthy/good
- Yellow: Caution/warning
- Red: Critical/action needed

```bash
apply_color() {
  local value=$1 type=$2
  
  if [ "$type" = "context" ]; then
    # Context window pressure
    if [ "$value" -ge 90 ]; then echo "$RED"
    elif [ "$value" -ge 75 ]; then echo "$YELLOW"
    else echo "$GREEN"; fi
  elif [ "$type" = "rate_limit" ]; then
    # API quota pressure
    if [ "$value" -ge 85 ]; then echo "$RED"
    elif [ "$value" -ge 70 ]; then echo "$YELLOW"
    else echo "$GREEN"; fi
  fi
}
```

### Step 4: Build the Output String

Use `printf` for precise formatting and variable substitution.

```bash
#!/bin/bash
RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
CYAN=$'\033[0;36m'
RESET=$'\033[0m'

input=$(cat)
if ! command -v jq &>/dev/null; then echo "[no jq]"; exit 0; fi

# Extract
model=$(echo "$input" | jq -r '.model.display_name // "claude"')
ctx_pct=$(echo "$input" | jq -r '.context_window.used_percentage // 0')
cost=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# Format
short_model=$(echo "$model" | sed 's/^claude-//' | cut -c1-6)
ctx_int=$(printf "%.0f" "$ctx_pct")
cost_fmt=$(printf "\$%.2f" "$cost")

# Color
if [ "$ctx_int" -ge 80 ]; then color="$RED"; else color="$GREEN"; fi

# Output
printf "%s[%s]%s | %s%d%%%s | %s%s%s\n" \
  "$CYAN" "$short_model" "$RESET" \
  "$color" "$ctx_int" "$RESET" \
  "$GREEN" "$cost_fmt" "$RESET"
```

### Step 5: Test Against Real Data

Get a sample from a running Claude Code session by enabling debug output, then replay:

```bash
# Dump a real input (internal debugging only, normally not exposed)
# For testing, create a sample JSON:

sample='{"model":{"display_name":"Claude Opus"},"context_window":{"used_percentage":45},"cost":{"total_cost_usd":1.23}}'

echo "$sample" | bash /path/to/statusline.sh
```

### Step 6: Handle Timeout and Error Cases

Always exit cleanly; broken scripts break the UI.

```bash
#!/bin/bash
set -euo pipefail  # Exit on error

input=$(cat)
if ! command -v jq &>/dev/null; then 
  echo "[jq required]"
  exit 0  # Don't fail the entire session
fi

# Timeout guards
timeout 0.04 jq '.context_window.used_percentage' <<< "$input" || {
  echo "[timeout]"
  exit 0
}
```

---

## Progress Bar Patterns (▓░ Math)

Progress bars visualize percentages in fixed width. Understanding the math prevents off-by-one errors and uneven bars.

### Basic Bar Formula

```
filled = (percentage × width) / 100
empty = width - filled
bar = "▓" × filled + "░" × empty
```

### Bash Implementation

```bash
make_bar() {
  local pct=$1 width=${2:-10}
  
  # Cap at 100% to prevent overflow
  [ "$pct" -gt 100 ] && pct=100
  
  # Integer division: filled percent of width
  local filled=$(( (pct * width) / 100 ))
  local empty=$(( width - filled ))
  
  local bar="" i
  for ((i=0; i<filled; i++)); do bar="${bar}▓"; done
  for ((i=0; i<empty; i++)); do bar="${bar}░"; done
  
  echo "$bar"
}

# Usage
bar=$(make_bar 71 10)  # Output: ▓▓▓▓▓▓▓░░░ (7 filled + 3 empty = 10)
```

### Responsive Width (Terminal-Aware)

Adjust bar width based on available columns:

```bash
# Available columns minus labels
available=$((COLUMNS - 40))
bar_width=$(( available > 5 ? available : 5 ))  # Min 5 chars

bar=$(make_bar "$ctx_pct" "$bar_width")
printf "[%s] %3d%%\n" "$bar" "$ctx_pct"
```

### Sub-Percentage Precision

For smooth transitions, use fractional percentages:

```bash
# E.g., 45.7% with width 10 → 4.57 filled → round to 5
make_bar_precise() {
  local pct=$1 width=${2:-10}
  
  # Use awk for floating-point math
  awk -v p="$pct" -v w="$width" 'BEGIN {
    filled = int((p * w / 100) + 0.5)
    empty = w - filled
    for (i=0; i<filled; i++) printf "▓"
    for (i=0; i<empty; i++) printf "░"
  }'
}
```

### Dual-Bar Patterns

Show two related metrics side-by-side:

```bash
# Input and output token ratio
input_pct=40
output_pct=35
width=8

input_bar=$(make_bar "$input_pct" "$width")
output_bar=$(make_bar "$output_pct" "$width")

printf "In:[%s] Out:[%s]\n" "$input_bar" "$output_bar"
# Output: In:[▓▓▓░░░░░] Out:[▓▓▓░░░░░]
```

---

## Color Thresholds and Decision Trees

Consistent color logic prevents decision fatigue. Build a threshold table once, reuse everywhere.

### Recommended Thresholds

| Metric | Green | Yellow | Red | Trigger |
|--------|-------|--------|-----|---------|
| Context % | 0–50% | 50–80% | 80–100% | Supply exhaustion |
| Rate limit % | 0–60% | 60–80% | 80–100% | API quota pressure |
| Cost ($) | $0–$1 | $1–$5 | $5+ | Budget overage |
| Error rate | 0–2% | 2–10% | 10%+ | Tool reliability |
| Cache hit % | 90–100% | 75–90% | 0–75% | Cache effectiveness |

### Decision Tree in Bash

```bash
color_for_metric() {
  local metric=$1 value=$2
  
  case "$metric" in
    context)
      [ "$value" -ge 80 ] && echo "$RED" || \
      [ "$value" -ge 50 ] && echo "$YELLOW" || echo "$GREEN"
      ;;
    rate_limit)
      [ "$value" -ge 80 ] && echo "$RED" || \
      [ "$value" -ge 60 ] && echo "$YELLOW" || echo "$GREEN"
      ;;
    cost)
      [ "$value" -ge 5 ] && echo "$RED" || \
      [ "$value" -ge 1 ] && echo "$YELLOW" || echo "$GREEN"
      ;;
  esac
}

ctx_color=$(color_for_metric "context" 75)
printf "%s%d%%%s\n" "$ctx_color" 75 "$RESET"
```

---

## Performance Tips: <50ms Constraint

Statuslines must execute and output in <50ms (often <30ms to feel responsive). Every millisecond counts.

### 1. Minimize JSON Parsing (Most Expensive)

**Bad — parses full JSON 5 times:**
```bash
a=$(echo "$input" | jq '.a')
b=$(echo "$input" | jq '.b')
c=$(echo "$input" | jq '.c')
d=$(echo "$input" | jq '.d')
e=$(echo "$input" | jq '.e')
```

**Good — single jq pass with multiple outputs:**
```bash
read a b c d e < <(echo "$input" | jq -r '.a, .b, .c, .d, .e')
```

**Better — extract to temp object once:**
```bash
data=$(echo "$input" | jq '.model, .context_window, .cost')
a=$(echo "$data" | jq -s '.[0]')
b=$(echo "$data" | jq -s '.[1]')
```

**Best — jq does all arithmetic:**
```bash
echo "$input" | jq -r '[
  .model.display_name,
  .context_window.used_percentage,
  .cost.total_cost_usd
] | join("|")'
```

### 2. Avoid External Commands in Loops

**Bad — calls `printf` 10 times:**
```bash
for ((i=0; i<10; i++)); do
  printf "▓"
done
```

**Good — uses bash string multiplication (pseudo):**
```bash
bar=""
for ((i=0; i<10; i++)); do
  bar="${bar}▓"
done
```

**Best — use `awk` if Bash is slow:**
```bash
awk 'BEGIN { for (i=0; i<10; i++) printf "▓" }'
```

### 3. Cache Expensive Computations

If your script uses the same jq query across runs, use the `cache` setting in settings.json:

```json
{
  "statusline": {
    "command": "bash",
    "args": ["/path/to/statusline.sh"],
    "timeout": 40,
    "cache": 500
  }
}
```

This caches output for 500ms, skipping script execution if state hasn't changed significantly.

### 4. Early Exit on Missing Dependencies

Don't parse JSON if `jq` is missing; exit immediately:

```bash
if ! command -v jq &>/dev/null; then 
  echo "[jq required]"
  exit 0
fi
```

### 5. Avoid Pipelines When Possible

Each pipe spawns a subshell (overhead). Use bash string manipulation:

**Bad — 3 subshells:**
```bash
model=$(echo "$input" | jq -r '.model.display_name' | sed 's/^claude-//' | cut -c1-8)
```

**Good — 1 subshell + bash inside:**
```bash
model=$(echo "$input" | jq -r '.model.display_name')
model="${model#claude-}"  # Remove prefix
model="${model:0:8}"      # Truncate to 8 chars
```

### 6. Profile Your Script

Use `time` to measure:

```bash
time echo '{"model":{"display_name":"Claude Opus"}}' | bash statusline.sh
# real    0m0.025s  ✓ Good
# real    0m0.150s  ✗ Too slow
```

Aim for **25–40ms**, leaving 10ms buffer for system jitter.

### 7. Set Reasonable Timeouts

```json
{
  "statusline": {
    "timeout": 40,
    "cache": 100
  }
}
```

- `timeout: 40` — Kill script if >40ms
- `cache: 100` — Reuse output for 100ms unless state changes
- Combined: Script runs every 100ms max, but is allowed 40ms to execute

### 8. Defer Expensive Operations

If you need external tool calls (e.g., `git status`), do them once at session start and cache:

```bash
# NOT in the statusline loop — too slow
git status --porcelain | wc -l  # This is 50–200ms

# Instead, let Claude Code provide it via JSON
echo "$input" | jq '.workspace.git_status'  # Already in JSON, <1ms
```

---

## Real-World Composite Statusline

Combining all concepts: fast, responsive, informative.

```bash
#!/bin/bash
set -euo pipefail

input=$(cat)

# Graceful degradation
if ! command -v jq &>/dev/null; then 
  echo "[jq required]"
  exit 0
fi

# ANSI colors
RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
CYAN=$'\033[0;36m'
RESET=$'\033[0m'

# Function: progress bar
make_bar() {
  local pct=$1 width=${2:-10}
  [ "$pct" -gt 100 ] && pct=100
  local filled=$(( (pct * width) / 100 ))
  local empty=$(( width - filled ))
  local bar="" i
  for ((i=0; i<filled; i++)); do bar="${bar}▓"; done
  for ((i=0; i<empty; i++)); do bar="${bar}░"; done
  echo "$bar"
}

# Extract (single jq call)
read model ctx_pct cost repo branch rl_pct <<< "$(
  echo "$input" | jq -r '[
    .model.display_name,
    .context_window.used_percentage,
    .cost.total_cost_usd,
    .workspace.repo.name,
    .workspace.git_worktree,
    .rate_limits.five_hour.used_percentage
  ] | join(" ")
)"

# Defaults
model="${model:-claude}"
ctx_pct="${ctx_pct:-0}"
cost="${cost:-0}"
repo="${repo:-}"
branch="${branch:-}"
rl_pct="${rl_pct:-0}"

# Format
short_model=$(echo "$model" | sed 's/^claude-//' | cut -c1-8)
ctx_int=$(printf "%.0f" "$ctx_pct" 2>/dev/null || echo 0)
cost_fmt=$(printf "\$%.2f" "$cost" 2>/dev/null || echo "$cost")
rl_int=$(printf "%.0f" "$rl_pct" 2>/dev/null || echo 0)

# Color thresholds
ctx_color="$GREEN"
[ "$ctx_int" -ge 50 ] && ctx_color="$YELLOW"
[ "$ctx_int" -ge 80 ] && ctx_color="$RED"

rl_color="$GREEN"
[ "$rl_int" -ge 60 ] && rl_color="$YELLOW"
[ "$rl_int" -ge 80 ] && rl_color="$RED"

# Bars
ctx_bar=$(make_bar "$ctx_int" 8)
rl_bar=$(make_bar "$rl_int" 5)

# Location label
if [ -n "$branch" ]; then
  location="${repo}:${branch}"
elif [ -n "$repo" ]; then
  location="$repo"
else
  location="."
fi

# Output (all on one line)
printf "%s[%s]%s %s | 5h:%s%s%s | %s%s%s\n" \
  "$CYAN" "$short_model" "$RESET" \
  "$location" \
  "$rl_color" "$rl_bar" "$RESET" \
  "$ctx_color" "$ctx_bar" "$RESET"

# Result example:
# [opus] my-project:main | 5h:▓░░░░ | ▓▓▓░░░░░░
```

---

## Debugging Statusline Scripts

When statuslines fail silently, these techniques help diagnose the issue.

### 1. Log to a File (Not Stdout)

Stdout is captured for display. Use stderr or a file:

```bash
#!/bin/bash
input=$(cat)

# Debug to file
echo "Input: $(head -c 100 <<< "$input")" >> /tmp/statusline.log 2>&1

# Normal output
echo "Status: OK"
```

View with:
```bash
tail -f /tmp/statusline.log
```

### 2. Enable jq Errors

By default, failed jq queries return `null`. Show errors explicitly:

```bash
# Without error suppression
model=$(echo "$input" | jq '.model.display_name')
# If .model doesn't exist, model == "null" (string)

# With error feedback
model=$(echo "$input" | jq -r '.model.display_name // "ERROR"')
# If parsing fails, model == "ERROR"
```

### 3. Check Timing

```bash
#!/bin/bash
start=$(date +%s%N)

input=$(cat)
# ... script logic ...

end=$(date +%s%N)
elapsed_ms=$(( (end - start) / 1000000 ))
echo "Elapsed: ${elapsed_ms}ms"
```

### 4. Validate JSON Input

```bash
if ! echo "$input" | jq empty 2>/dev/null; then
  echo "[invalid JSON]"
  exit 0
fi
```

### 5. Test Locally

Create a sample JSON file and pipe it repeatedly:

```bash
cat > sample.json << 'EOF'
{
  "model": {"display_name": "Claude Opus"},
  "context_window": {"used_percentage": 45},
  "cost": {"total_cost_usd": 2.15}
}
EOF

# Test 100 times (measure consistency + avg time)
time for i in {1..100}; do
  cat sample.json | bash statusline.sh
done
```

---

## Common Pitfalls and Solutions

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| **jq parsing fails** | Statusline shows nothing | Check JSON structure with `jq .` on sample data |
| **Timeout too tight** | Output disappears intermittently | Increase `timeout` in settings (default 50ms) |
| **Subshell overhead** | Script runs in 100+ ms | Use bash string ops instead of pipes; profile with `time` |
| **Color codes break on paste** | Pasted output has escape artifacts | Normal — ANSI codes aren't meant to be pasted |
| **Off-by-one bar width** | Bar is 11 chars instead of 10 | Check `[ "$filled" -gt "$width" ] && filled=$width` |
| **null values in output** | Statusline shows "null" | Use `// default` in jq: `.field // 0` |
| **Light theme unreadable** | White text on white bg | Check `ui_state.theme` and adjust colors |
| **Performance degrades over time** | Script gets slower as session ages | Cache large jq queries; avoid re-parsing same JSON 10x |

---

## Implementation Checklist

Before shipping a statusline script:

- [ ] **Parsing:** Extract only needed fields; single jq call preferred
- [ ] **Timing:** Measure with `time`, ensure <40ms on typical hardware
- [ ] **Errors:** Handle jq missing, JSON invalid, timeouts gracefully
- [ ] **Colors:** Test on both dark and light themes
- [ ] **Width:** Responsive to `$COLUMNS`, degrade cleanly on narrow terminals
- [ ] **Characters:** Use UTF-8 progress bar chars (▓ U+2593, ░ U+2591)
- [ ] **Thresholds:** Document color meanings (green/yellow/red)
- [ ] **Null safety:** Every jq query has `// default` fallback
- [ ] **Output:** Single line, max 200 chars, no trailing newline unless needed
- [ ] **Testing:** Run 100 times with sample JSON; verify consistency

---

## Glossary

| Term | Definition |
|------|-----------|
| **Statusline** | Single-line text output updated in real-time during a Claude Code session |
| **Stdin** | Standard input pipe receiving session state as JSON |
| **Stdout** | Standard output (captured and displayed by Claude Code) |
| **ANSI escape code** | Sequence (e.g., `\033[0;31m`) controlling text color/style |
| **OSC 8** | Open Document System 8 hyperlink standard for clickable links in terminal |
| **Progress bar** | Visual representation of a percentage using filled (▓) and empty (░) characters |
| **Timeout** | Maximum time allowed for script to execute (default 50ms) |
| **Cache** | Reuse previous output without re-running script if state unchanged |
| **Threshold** | Percentage at which a metric changes color (e.g., 80% context → red) |
| **Responsive** | Script output adapts to terminal width via `$COLUMNS` env var |

---

## References and Further Reading

**Official Claude Code Documentation:** See `.claude/CLAUDE.md` in your workspace for session state schema updates.

**ANSI Escape Codes:** https://en.wikipedia.org/wiki/ANSI_escape_code (256-color palette reference)

**OSC Sequences:** https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h4-Operating-System-Commands

**Claudient Statusline Scripts:** See `statuslines/` directory for 6 complete reference implementations.

**Performance Tuning:** Use `time` and `/tmp/statusline.log` for debugging; aim for 25–40ms execution.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
