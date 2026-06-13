# Hook: Prompt Guard — LLM-Based Pre-Tool Evaluation Gate

Demonstrates the `"type": "prompt"` hook, which uses an LLM evaluation step as a gate before Claude executes a tool. The hook prompt receives the tool context and returns a structured verdict that the harness uses to allow or block the action — no script required.

## What it does

When a matching tool call is about to execute, the harness:

1. Serialises the tool name and input into a context block.
2. Calls the configured evaluation prompt (via the internal LLM) with that context appended.
3. Parses the LLM's response for a verdict field.
4. If the verdict is `"allow"` — the tool call proceeds unmodified.
5. If the verdict is `"block"` — the harness cancels the tool call and injects the `reason` field from the LLM response as a tool error, which Claude sees and responds to (e.g., by proposing a safer alternative).
6. If the verdict is `"warn"` — the tool call proceeds but the reason is appended to Claude's context so it can acknowledge the risk.

The evaluation LLM runs inside the harness process and does not create a visible subagent. It is fast (Haiku-class) and does not consume the session's context window.

Example: a `PreToolUse` guard on `Bash` that blocks commands touching production infrastructure:

Incoming tool input:
```json
{
  "tool_name": "Bash",
  "tool_input": { "command": "kubectl delete deployment api-server --namespace=production" }
}
```

Evaluator output:
```json
{
  "verdict": "block",
  "reason": "Command targets the production namespace and deletes a running deployment. This is a destructive, irreversible operation outside the approved scope of this session."
}
```

Claude receives the reason as a tool error and typically responds: "I've been blocked from running that command. The guard flagged it as a destructive production action. Should I draft a rollback plan instead?"

## When it fires

`PreToolUse` with a `matcher` targeting the tools you want to guard. Common guards:

| Matcher | Guard purpose |
|---|---|
| `Bash` | Block shell commands that touch production, delete data, or match dangerous patterns |
| `Write` | Block writes to sensitive paths (`/etc/`, `~/.ssh/`, `.env`) |
| `mcp__*` | Block MCP tool calls that would make irreversible external API mutations |

## settings.json entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are a security gate for a developer's AI coding assistant. You will receive the name and input of a shell command that the assistant is about to run.\n\nEvaluate the command against these rules:\n- BLOCK if the command targets a production environment (production, prod, live namespaces or hostnames)\n- BLOCK if the command is irreversibly destructive (drop table, delete deployment, rm -rf on non-temp paths, format disk)\n- BLOCK if the command exfiltrates credentials or secrets (curl with Authorization headers to external hosts, cat ~/.ssh, printenv | curl)\n- WARN if the command modifies system configuration outside the project directory\n- ALLOW everything else\n\nRespond ONLY with valid JSON in this exact shape:\n{\"verdict\": \"allow\" | \"warn\" | \"block\", \"reason\": \"<one sentence explanation>\"}\n\nDo not add any text outside the JSON object.",
            "model": "claude-haiku-4-5",
            "timeout": 8
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are a file-write security gate. Evaluate the file path and content about to be written.\n\nBLOCK if the path is:\n- /etc/ or any system config directory\n- ~/.ssh/ or any SSH key directory\n- Any file named .env, .env.local, .env.production, secrets.json, credentials.json\n- /usr/, /bin/, /sbin/\n\nWARN if the file contains what appears to be a hardcoded secret (token, password, private key PEM block).\n\nALLOW everything else.\n\nRespond ONLY with valid JSON: {\"verdict\": \"allow\" | \"warn\" | \"block\", \"reason\": \"<one sentence>\"}",
            "model": "claude-haiku-4-5",
            "timeout": 8
          }
        ]
      }
    ]
  }
}
```

## How the LLM verdict allows or blocks the action

The harness expects the evaluation prompt to return a JSON object with at minimum a `"verdict"` key. The verdict values have the following effects:

| Verdict | Effect |
|---|---|
| `"allow"` | Tool call proceeds. The reason (if present) is discarded. |
| `"warn"` | Tool call proceeds. The reason is appended to Claude's next context turn as an advisory note. Claude may acknowledge it and continue, or propose changes. |
| `"block"` | Tool call is cancelled before execution. The harness injects the reason as a tool error. Claude receives the error and must decide how to proceed — it cannot retry the same call without user confirmation. |

If the evaluation LLM returns malformed JSON or times out, the harness defaults to `"allow"` and logs a warning. To default to `"block"` on evaluation failure, set `"fail_open": false` in the hook config.

## Notes

- Use `"model": "claude-haiku-4-5"` for the evaluator. Haiku is fast enough to evaluate most commands in under 2 seconds and keeps guard latency imperceptible. Sonnet is overkill for pattern matching.
- Keep the evaluation prompt focused and rule-based. Open-ended prompts ("is this safe?") produce inconsistent verdicts. Specific named patterns produce reliable allow/block decisions.
- The evaluator does not have access to the filesystem or session history — only the tool name and input fields for the current call. For context-aware guards (e.g., "block if this is the third destructive command in a row"), use a `"command"` hook with a stateful script instead.
- Chain multiple hooks under a single matcher: list a `"prompt"` hook first and a `"command"` hook second. The command hook only runs if the prompt hook allows the action.
- Test guards in `"warn"` mode before switching to `"block"` to calibrate false-positive rates.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
