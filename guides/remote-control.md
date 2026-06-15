# Remote Control — Headless Session Management

Remote Control lets you manage Claude Code sessions running on remote servers, CI runners, or cloud VMs. Start a session on one machine, control it from another, and resume from anywhere — even after disconnecting.

---

## When to Use

- Running Claude Code on a cloud VM or CI runner while controlling from your laptop
- Long-running sessions that outlive your terminal connection
- CI/CD pipelines where Claude Code runs as an autonomous step
- Starting a session at the office and resuming from home

## When NOT to Use

- Local interactive sessions where you're at the same machine
- Quick tasks where SSH + tmux is simpler
- UI work that needs real-time visual feedback

---

## Headless Sessions

### Start a Headless Session

```bash
# On the remote server
claude --headless \
  --session-id "overnight-refactor" \
  --workspace /home/deploy/project \
  --listen 0.0.0.0:8765 \
  --auth-token "$CLAUDE_AUTH_TOKEN"
```

The session runs in the background, accepts commands via HTTP, and auto-saves state every 30 seconds.

### Connect from Anywhere

```bash
# From your laptop
claude remote attach \
  --host dev-server.example.com:8765 \
  --auth-token "$CLAUDE_AUTH_TOKEN" \
  --session-id "overnight-refactor"

# Full context restored: conversation history, file state, tool results
```

### Detach and Reattach

```bash
# Detach (session keeps running)
# Press Ctrl+B then D, or:
claude remote detach

# Reattach from a different device
claude remote attach --session-id "overnight-refactor"
```

---

## Session Management

### List Running Sessions

```bash
claude remote list
# overnight-refactor     running   47m   dev-server:8765
# ci-review-abc123       idle      2h    ci-runner:8765
# data-pipeline          complete  12m   ml-server:8765
```

### Send Commands to a Headless Session

```bash
# Simple prompt
claude remote exec --session-id "overnight-refactor" \
  --prompt "Run the test suite and report failures"

# With file attachment
claude remote exec --session-id "overnight-refactor" \
  --prompt "Review this spec and implement it" \
  --attach spec.md

# With structured output
claude remote exec --session-id "overnight-refactor" \
  --prompt "List all TODO comments" \
  --output-format json
```

### Clean Up Completed Sessions

```bash
claude remote prune  # remove all completed sessions
```

---

## CI/CD Integration

### GitHub Actions

```yaml
jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropic/claude-code-action@v1
        with:
          prompt: |
            Review the changes in this PR. Focus on:
            1. Security vulnerabilities
            2. Performance regressions
            3. Test coverage gaps
            Post review as a PR comment.
          auth_token: ${{ secrets.CLAUDE_AUTH_TOKEN }}
```

### GitLab CI

```yaml
claude-analysis:
  stage: analyze
  script:
    - claude --headless --prompt "Analyze changes in $CI_MERGE_REQUEST_DIFF_BASE_SHA..HEAD"
      --output-format json > analysis.json
  artifacts:
    reports:
      codequality: analysis.json
```

---

## Multi-Machine Orchestration

Coordinate Claude Code instances across multiple machines:

```yaml
orchestration:
  machines:
    - host: "dev-server-1"
      session: "backend-refactor"
      task: "Refactor auth module to use JWT"
    - host: "dev-server-2"
      session: "frontend-update"
      task: "Update login flow for JWT API"
    - host: "test-runner"
      session: "integration-tests"
      task: "Run integration tests after both refactors complete"
      depends_on: ["backend-refactor", "frontend-update"]
  coordinator:
    on_all_complete: "Generate cross-machine change summary"
```

---

## Security

### Authentication

```yaml
remote_security:
  authentication:
    method: "token"          # or "ssh-key", "oauth"
    token_env: "CLAUDE_AUTH_TOKEN"
    rotation: "every-24h"
  network:
    bind: "127.0.0.1"       # localhost only (recommended)
    tls: true               # encrypt in transit
  authorization:
    allowed_tools: ["read", "grep", "bash"]
    blocked_paths: ["/etc", "/root"]
```

### Best Practices

- **Always use auth tokens** — never run headless without authentication
- **Bind to localhost** when possible — avoid exposing to the public network
- **Enable TLS** for any remote connection
- **Scope tool access** — give remote sessions minimum required permissions
- **Set idle timeout** — auto-suspend sessions that aren't receiving commands
- **Rotate tokens daily** — limit blast radius if a token is compromised

---

## Overnight Work Pattern

1. **Before leaving:** Start headless session with initial task
   ```bash
   claude --headless --session-id "overnight" --prompt "Refactor DB queries..."
   ```

2. **Session runs autonomously:** Refactors, tests, commits to branch

3. **Next morning:** Check status and review
   ```bash
   claude remote list
   # overnight    complete    8h    cloud-vm:8765
   
   claude remote attach --session-id "overnight"
   # → 47 files changed, 12 new tests, PR ready
   ```

---

## Related

- **Skills:** `remote-control-headless`, `dispatch-background-jobs`
- **Guides:** Auto Mode, Dispatch & Channels
- **Concepts:** Agent Teams, Session Handoff
