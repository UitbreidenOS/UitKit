# MCP: Task Master

AI-powered task management with context isolation — break down large features into tracked subtasks, maintain progress across sessions, and coordinate multi-agent work from a structured task graph.

## Why you need this

Long features span multiple sessions and often involve parallel workstreams. Without persistent task tracking, Claude starts each session without knowing what's done, what's next, or what's blocked. Task Master solves this:
- A PRD or feature description becomes a structured, dependency-ordered task list in one prompt
- Progress persists in your repository — every session picks up exactly where the last one stopped
- Dependency ordering means `next_task` always returns the right thing to work on, not a guess
- Complex tasks can be expanded into subtasks and handed to parallel agents, each with isolated context
- Complexity analysis surfaces high-risk tasks before they become schedule problems

## Installation

```bash
npm install -g task-master-ai
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your-anthropic-api-key-here",
        "PERPLEXITY_API_KEY": "your-perplexity-api-key-here"
      }
    }
  }
}
```

`ANTHROPIC_API_KEY` is required — Task Master calls Claude internally to parse PRDs and analyze tasks. `PERPLEXITY_API_KEY` is optional; it enables research-enhanced task breakdowns that pull in current best practices.

## Key tools / What it does

- `initialize_project` — set up Task Master in the current project, creating the `.taskmaster/` directory
- `parse_prd` — read a PRD or feature description and auto-generate a structured task list with dependencies and priorities
- `get_tasks` — list all tasks with status, priority, and dependency summary
- `get_task` — get full details on a single task including description, subtasks, and notes
- `create_task` — manually create a task with title, description, priority, and dependencies
- `update_task` — update a task's title, description, priority, or dependencies
- `set_task_status` — mark a task as `pending`, `in-progress`, `done`, or `blocked`
- `next_task` — return the highest-priority unblocked task ready to work on, respecting dependency order
- `expand_task` — break a task into subtasks for parallel execution or finer tracking
- `add_subtask` — manually add a subtask to an existing task
- `analyze_project_complexity` — score all tasks by complexity and flag high-risk items with reasoning
- `generate_task_files` — write individual markdown files per task to `.taskmaster/tasks/` for agent context

## Usage examples

```
Initialize Task Master for this project, then parse the PRD at docs/prd.md
and generate the full task list. Show me the dependency graph.
```

```
What's the next task I should work on? Respect dependency order
and show me the task description and any subtasks.
```

```
I finished task 5. Mark it done, then show me what tasks just
became unblocked and which one has the highest priority.
```

```
Expand task 8 into subtasks detailed enough for parallel agent execution.
Each subtask should be independently completable in under 2 hours.
```

```
Analyze the complexity of all remaining tasks. Flag anything above
a complexity score of 7, explain why it's complex, and suggest
how to reduce it before we start.
```

## Authentication

**Required:** `ANTHROPIC_API_KEY` — obtain from console.anthropic.com. Task Master uses Claude to parse PRDs, analyze complexity, and expand tasks. The key is called internally by the MCP server, not by Claude Code's session directly.

**Optional:** `PERPLEXITY_API_KEY` — obtain from perplexity.ai/api. Enables Task Master to augment task breakdowns with current library versions, known migration issues, and relevant community patterns. Useful for tasks involving unfamiliar technology stacks.

## Tips

**Commit `.taskmaster/` to git:** Task data lives in `.taskmaster/tasks.json`. Committing it means your entire team sees the same task state, progress is auditable in history, and sessions resume with full context after any gap.

**Always use `next_task` instead of picking manually:** Task Master builds a dependency graph when it parses the PRD. `next_task` traverses this graph to surface what's actually unblocked and highest priority. Manual picking bypasses this logic and risks starting tasks whose dependencies aren't done.

**`expand_task` before parallel agent work:** When handing off to multiple agents via worktrees, expand the relevant task first. Each subtask becomes an isolated unit of work with its own context — agents don't step on each other.

**`generate_task_files` for agent context:** Writing individual task files to `.taskmaster/tasks/` gives each agent a clean, focused context file with just what it needs for one task. Agents don't need to parse the full task list.

**`analyze_project_complexity` early:** Run complexity analysis right after `parse_prd`, before starting work. Tasks flagged as high-complexity are where schedule risk lives. Address ambiguity or break them down further before committing to a timeline.

**Blocked tasks need explicit unblocking:** If a task is marked `blocked`, Task Master won't surface it via `next_task` until its status is updated. When a blocker is resolved, set the blocked task back to `pending` and add a note explaining what changed.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
