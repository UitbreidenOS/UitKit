---
description: Scaffold a multi-step Claude agent with tool use, memory, and a defined stopping condition
argument-hint: "[agent goal or task description]"
---
Scaffold a production Claude agent that accomplishes: $ARGUMENTS

**Step 1 — Agent design spec**

Before writing code, define:

- **Goal** — the terminal success condition (not a process, a state)
- **Inputs** — what the agent receives at launch (strings, file paths, structured data)
- **Outputs** — what it produces when done (files written, API calls made, structured result returned)
- **Tools needed** — enumerate each tool: name, purpose, input schema, return shape
- **Memory model** — choose one:
  - Stateless (context window only, suitable for <20 tool calls)
  - Summary memory (compress history with Haiku after each N steps)
  - External memory (write key facts to a scratchpad file or key-value store)
- **Stopping conditions** — what triggers the agent to return final output vs. continue looping:
  - Success: goal state reached
  - Failure: error count exceeded, contradictory state detected
  - Ceiling: max_iterations reached (always include this)

**Step 2 — Generate the agent**

Write `agent.py` using the Anthropic Python SDK. Requirements:

- Model: `claude-sonnet-4-6` (configurable via `AGENT_MODEL` env var)
- Implement the agentic loop:
  ```
  while not done and iterations < max_iterations:
      response = client.messages.create(tools=tools, messages=history)
      if response.stop_reason == "tool_use":
          results = execute_tools(response)
          history.append(assistant_turn)
          history.append(tool_results_turn)
      elif response.stop_reason == "end_turn":
          done = True
  ```
- Define each tool as a dict with `name`, `description`, `input_schema` (JSON Schema)
- Tool dispatch: a `dispatch(tool_name, tool_input)` function that routes to Python callables
- Use `cache_control: {"type": "ephemeral"}` on the system prompt message
- Structured final output: agent returns a typed dataclass, not raw text
- Log each iteration: tool called, input summary, result summary (not full content)

**Step 3 — Error handling**

- Wrap every tool call in try/except; return `{"error": str(e)}` as tool result — never raise into the loop
- On `max_iterations` exceeded: return partial results with a `status: "incomplete"` flag
- On API errors (`anthropic.APIStatusError`): retry up to 3 times with exponential backoff

**Step 4 — CLI entrypoint**

Expose via `argparse`:
- `--goal` (or positional): override the hardcoded goal
- `--max-iterations`: default 25
- `--dry-run`: print the plan (system prompt + tools) without executing

**Output:** `agent.py` with all tools implemented, no stubs. Include a usage example in a comment block at the top of the file.
