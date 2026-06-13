# Hook: HTTP Webhook — Pipe Events to External Endpoints

Demonstrates the `"type": "http"` hook, which POSTs structured event data directly to an HTTP endpoint without requiring a shell script. Use this to stream Claude Code events into a dashboard, Slack channel, observability platform, or any webhook-capable service.

## What it does

When configured, the harness serialises the full hook payload as JSON and POSTs it to the configured URL. No script is needed — the harness handles the HTTP call. The endpoint receives a JSON body describing the event, the tool involved (for tool-use events), the session ID, and the project directory.

Typical payload shape (varies by event type):

```json
{
  "event": "PostToolUse",
  "session_id": "abc123",
  "project_dir": "/Users/you/myproject",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm run build"
  },
  "tool_response": {
    "output": "Build succeeded in 4.2s",
    "exit_code": 0
  },
  "timestamp": "2026-06-03T10:45:00Z"
}
```

For lifecycle events (`Stop`, `Start`, `PreCompact`) the `tool_name` / `tool_input` / `tool_response` fields are absent; instead the payload carries event-specific metadata such as `stop_reason` or `compact_summary`.

The endpoint must respond with HTTP 2xx within the configured timeout; any other status code is treated as a hook failure and surfaced to Claude as a tool error. The harness does not retry failed HTTP hooks.

## When it fires

Configurable per event. Common pairings:

| Event | Typical use |
|---|---|
| `PostToolUse` | Log every tool call to an audit trail or observability backend |
| `Stop` | Notify a Slack channel that a session ended and summarise the last action |
| `PreToolUse` | Stream commands to a real-time activity dashboard |
| `SubagentStop` | Record subagent completions in a workflow tracker |

## settings.json entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "http",
            "url": "https://hooks.slack.com/services/T00000/B00000/XXXXXXXXXXXX",
            "timeout": 10,
            "headers": {
              "Content-Type": "application/json",
              "X-Claude-Project": "${CLAUDE_PROJECT_DIR}"
            }
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "http",
            "url": "https://your-dashboard.example.com/api/claude-events",
            "timeout": 15,
            "headers": {
              "Authorization": "Bearer ${CLAUDE_DASHBOARD_TOKEN}",
              "Content-Type": "application/json"
            }
          }
        ]
      }
    ]
  }
}
```

Environment variables in `headers` values are expanded by the harness at call time. Store secrets in your shell environment or a `.env` file sourced by your shell profile — do not hard-code tokens in settings.json.

## Notes

- **No script required.** The harness sends the POST directly; there is no shell process to maintain or make executable.
- **Payload is the full hook context.** The harness serialises everything it would pass to a command hook's stdin as the POST body. Shape is stable within a major Claude Code version; treat fields beyond `event`, `session_id`, and `tool_name` as advisory.
- **Slack incoming webhooks** expect a specific `{"text": "..."}` shape — they will return 400 for a raw Claude payload. Use a lightweight adapter (e.g., a Cloudflare Worker or AWS Lambda) to transform the payload before forwarding to Slack.
- **Observability platforms** (Datadog, Honeycomb, Grafana) typically accept arbitrary JSON on a custom endpoint; map `tool_name` to a span name and `tool_response.exit_code` to a status code.
- **Timeout** defaults to 10 seconds if omitted. For dashboards on slow networks, raise to 30. The session does not block on the HTTP call beyond the configured timeout — the harness times out and logs a warning rather than hanging.
- **TLS verification** is performed by default. Self-signed certificates require a proxy or a `ca_bundle` field (see harness documentation for the full field list).

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
