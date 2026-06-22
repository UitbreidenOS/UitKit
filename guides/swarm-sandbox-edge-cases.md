# Swarm Sandbox Edge Cases

## When to activate
When designing multi-agent swarms for Claude Code, deploying workers at scale, debugging resource exhaustion or timeout issues, or hardening sandbox isolation in production environments.

## When NOT to use
For single-agent workflows, exploratory development, or tasks where sandbox behavior is not a constraint (local-only, no networking).

## Overview
The Swarm Sandbox is Claude Code's execution environment for multi-agent orchestration. It provides process isolation, resource limits, and network controls. However, scaling to many agents, concurrent operations, and edge-case failures requires understanding the sandbox's boundaries and failure modes.

---

## 1. Resource Limits

### Memory and CPU Constraints
- **Per-agent baseline**: 1 GiB RAM, 5 GiB disk, 1 CPU
- **Growth factor**: Memory usage scales with session length and tool activity (git operations, file I/O, large search results)
- **Binding constraint**: Context window, not disk or CPU
  - Haiku: ~200K tokens
  - Sonnet/Opus: ~200K–1M tokens
  - Swarm leader + workers share the same context window
  - Each worker receives only its task prompt; it never sees the leader's full conversation history

### Context Window Exhaustion
**Symptom**: Agents report "context window exceeded" mid-task despite available disk/RAM.

**Root cause**: Multi-agent swarms accumulate context across:
- Leader's full conversation and reasoning
- Worker task descriptions and completion logs
- Nested tool outputs (git status, test results, search queries)

**Mitigation**:
- Isolate worker conversations; do not include leader reasoning in worker prompts
- Truncate tool outputs (summarize diffs, show only failed tests)
- Use separate Claude sessions for long-running swarms (e.g., daily cleanup jobs)
- Monitor context usage with `claud messages list` or token counting APIs

### Memory Leak Prevention
**Symptom**: Swarm slows down or crashes after many sequential agent spawns.

**Root causes**:
- Sandbox state accumulates across workers (npm node_modules, docker images, git refs)
- Session persistence (~/.claude/projects/) grows unbounded
- Process handles not released after worker completion

**Mitigation**:
- Enable ephemeral mode for automated workflows: disable session persistence
- Manually call `rm -rf ~/.claude/projects/<session-id>` after long swarms
- Use `git worktree remove` and `git gc` to clean repository state
- Restart the Claude Code daemon after 100+ sequential workers: `claude daemon restart`

---

## 2. Timeout Handling

### Worker Timeout Defaults
- **Per-tool timeout**: 120 seconds (bash, file operations, web search)
- **Per-worker timeout**: No hard limit; workers inherit the leader's session timeout
- **Speculation timeout**: If BASH_CLASSIFIER is enabled, tool execution is preempted at 1s for classification; high-confidence classifications skip the user prompt

### Timeout Escalation Chain
When a tool times out:
1. Bash tool speculates on safety (BashTool + BASH_CLASSIFIER enabled)
2. If classification returns high confidence, execution continues without approval
3. If classification times out (>1s), escalation prompts the leader
4. Leader responds within 30s or the worker thread orphans

**Mitigation**:
- Set explicit timeouts for long operations: `timeout 60 git clone --depth 1 ...`
- Break large tasks into smaller stages with checkpoint commits
- Use async tool patterns (fire-and-forget with polling) for network-heavy operations
- Catch timeout exceptions and retry with backoff:
  ```bash
  for i in {1..3}; do
    timeout 30 curl -s "https://api.example.com/data" && break
    sleep $((2 ** i))
  done
  ```

### Timeout Mismatches
**Problem**: Worker waits for network I/O that times out at 120s, but the leader assumes 30s.

**Root cause**: Timeout expectations are not synchronized across the swarm.

**Fix**:
- Document expected timeout for each worker task in the initial prompt
- Use explicit `timeout` commands (bash) or `signal.alarm()` (Python)
- Set socket timeouts in HTTP clients: `requests.get(..., timeout=15)`
- Test timeout paths in swarm simulation before production deployment

---

## 3. Network Isolation Failures

### Sandbox Egress Control
The sandbox allows network access to allowlisted hosts (npm.org, github.com, api.anthropic.com). Attempts to reach non-allowlisted hosts escalate:
1. Worker's code attempts socket connection to host
2. Sandbox intercepts the request
3. Escalation message sent to leader: `"network_request_to_host: example.com"`
4. Leader approves or rejects within 30s
5. If rejected or timeout, worker gets connection refused

**Failure mode**: Leader offline or slow → worker hangs → swarm backs up

**Mitigation**:
- Pre-approve required hosts in `.claude/settings.json`:
  ```json
  {
    "network": {
      "allowlist": ["api.example.com", "cdn.example.com"]
    }
  }
  ```
- Test network paths before spawning workers
- Set short socket timeouts to fail fast:
  ```python
  socket.settimeout(5)  # Fail after 5s, don't wait for leader approval
  ```

### Network Isolation Bypass Vectors (2026)
**Vulnerability**: Path obfuscation can evade application-level sandboxing.

Example:
```bash
# Denylist blocks: /proc/self/root/usr/bin/npm
# But this path resolves to the same binary:
/proc/self/root/usr/bin/../bin/npm  # Bypasses pattern match
```

**Defense layers** (defense in depth):
1. **Application rules** (Claude Code denylist) — insufficient alone
2. **OS-level sandboxing** (bubblewrap, Seatbelt) — catches path tricks
3. **Infrastructure isolation** (VMs, network policies, SELinux) — required for production

**Best practice**: Deploy Claude Code agents in infrastructure-isolated containers (Kubernetes, Docker Swarm) with OS-level sandbox enabled, not just application rules.

---

## 4. State Cleanup Edge Cases

### Three Kinds of State
1. **Session state**: ~/.claude/projects/<session-id>/ (conversation history, resumable)
2. **Sandbox state**: /tmp, .git, node_modules (ephemeral by default, survives within one session)
3. **Container state**: Process handles, network connections (ephemeral, should be cleaned on worker exit)

### Cleanup Failures

#### Orphaned Worker Processes
**Symptom**: `ps aux | grep claude` shows zombie or unkillable workers.

**Root cause**: Leader dies before sending shutdown signal to worker, or worker ignores SIGTERM.

**Fix**:
```bash
# Immediate: Kill orphaned workers
pkill -9 -f "claude.*worker"

# Persistent: Enable auto-cleanup in settings
# .claude/settings.json
{
  "swarm": {
    "auto_cleanup": true,
    "cleanup_timeout_ms": 5000
  }
}
```

#### Stale Git Worktree Locks
**Symptom**: `git worktree list` shows locked worktrees; new workers cannot create worktrees.

**Root cause**: Worker crashed mid-operation, left worktree in locked state.

**Fix**:
```bash
# List locked worktrees
git worktree list --porcelain | grep locked

# Manually unlock and remove
git worktree remove --force <worktree-path>

# Prevention: Wrap critical sections
trap 'git worktree remove "$wt" 2>/dev/null' EXIT
wt=$(git worktree add --detach /tmp/wt-$RANDOM)
cd "$wt" && ... # worker task
```

#### Partial File Deletions
**Symptom**: Swarm state inconsistent; some files deleted by one worker, others not cleaned by another.

**Root cause**: Two workers concurrently modifying the same directory without serialization.

**Prevention**:
- Use file-level locking:
  ```bash
  # Acquire lock
  exec 200>.cleanup.lock
  flock 200
  # ... critical section ...
  rm -rf $dir
  # Release lock
  flock -u 200
  ```
- Delegate cleanup to a single cleanup worker, not each worker individually

#### Persistent Disk Usage
**Symptom**: Disk usage grows unboundedly; `du -sh ~/.claude` shows 50+ GB after a week.

**Root cause**: 
- Session history not pruned (each session is ~100 MB)
- npm node_modules cached across sessions (~500 MB per project)
- Docker images cached (~1-5 GB)

**Fix**:
```bash
# Clear sessions older than 7 days
find ~/.claude/projects -type d -mtime +7 -exec rm -rf {} \;

# Clear npm/Docker caches
npm cache clean --force
docker image prune -a --force

# Disable persistence for automated workflows
# .claude/settings.json
{
  "session": {
    "persistence": "ephemeral"
  }
}
```

---

## 5. Concurrent Swarm Conflicts

### Pane Layout Serialization
**Symptom**: Multi-agent swarm creates tmux panes with incorrect layout or missing agents.

**Root cause**: `tmux split-pane` calls race without serialization. tmux's internal state is not concurrent-safe.

**Architecture**: Pane creation uses promise-chaining locks (not mutex), serializing splits with:
- **Retry logic**: 10 retries, 5–100 ms exponential backoff
- **Capacity**: Sized for ~10 concurrent agents
- **Failure mode**: >10 concurrent agents → pane creation failures → visual glitches or agent startup failures

**Mitigation**:
- Limit concurrent agents to 8–10 per swarm
- For >10 agents, spawn multiple independent swarms and coordinate via git
- Increase backoff limits in custom builds (fork Claude Code, tune backoff parameters)

### Git Worktree Conflicts
**Symptom**: Multiple workers try to create worktrees on the same branch simultaneously.

**Root cause**: No distributed lock; workers use naive naming (e.g., `branch-name-worker`) without UUID.

**Prevention**:
```bash
# Use UUIDs to ensure uniqueness
wt="/tmp/wt-$(uuidgen)"
git worktree add --detach "$wt"

# Coordinate via git: push a "lock" ref
git update-ref refs/locks/swarm-$$ HEAD
# ... critical section ...
git update-ref -d refs/locks/swarm-$$
```

### Context Window Contention
**Symptom**: Two workers both report high token usage; leader cannot respond to both.

**Root cause**: No token budget partitioning; leader and all workers share a single context window.

**Mitigation**:
- Measure token usage before spawning workers:
  ```bash
  token_budget=$(claude tokens remaining)
  if (( token_budget < 50000 )); then
    echo "Insufficient tokens; defer swarm to next session"
    exit 1
  fi
  ```
- Spawn workers sequentially instead of concurrently if context is tight
- Use smaller, specialized models (Haiku) for workers; Opus for leader

### File Descriptor Exhaustion
**Symptom**: Swarm suddenly fails with "too many open files" after 50+ workers.

**Root cause**: Each worker opens 10–20 file descriptors (git, npm, HTTP sockets); not all closed on exit.

**Fix**:
```bash
# Increase system limits
ulimit -n 4096  # Per-process limit

# Per daemon:
# .claude/settings.json
{
  "daemon": {
    "file_descriptor_limit": 4096
  }
}

# Verify cleanup on worker exit
# In worker cleanup code:
exec 200>&-  # Close FD 200
exec 201>&-  # Close FD 201
# ... all FDs
```

---

## 6. State Isolation: Leader vs. Workers

### Worker Context Isolation
**Design principle**: Workers must not see the leader's conversation history.

**Why**:
1. **Cognitive isolation**: Worker should not try to replicate leader's reasoning
2. **Token efficiency**: Leader's full history is often 10–100x larger than worker task
3. **Reproducibility**: Same task prompt should produce deterministic worker behavior

**Implementation**:
- Worker receives only the task description (1–2 sentences)
- Worker never receives leader's previous messages or context
- If task context is needed, pass it explicitly in the prompt, not via session history

**Failure mode**: If worker has access to leader history → worker performs redundant analysis → token waste and unpredictable behavior

### Session Resumption Asymmetry
**Issue**: Leader can resume a swarm session, but workers cannot.

**Why**: Workers are ephemeral by design. Each invocation starts fresh.

**If resumption is needed**:
- Have workers write checkpoints to a shared file or git branch
- Leader reads checkpoints on resumption
- Worker restarts from last checkpoint (idempotent design required)

---

## 7. Best Practices

### Before Deploying a Swarm
1. **Test at 3x intended scale**: If planning 5 agents, test with 15 sequentially
2. **Measure token usage**: `claude tokens remaining` before and after each worker
3. **Pre-approve required hosts**: Add network allowlist to .claude/settings.json
4. **Set explicit timeouts**: Use `timeout(duration)` or `signal.alarm()` in workers
5. **Enable ephemeral mode**: Disable session persistence for automated workflows

### Monitoring a Live Swarm
- Watch CPU and memory: `top -u <username>`
- Count open file descriptors: `lsof -p $(pgrep claude) | wc -l`
- Monitor git worktree count: `git worktree list | wc -l`
- Track context usage: `claude messages count` or `claude tokens remaining`
- Log worker completion: Write status to ~/.claude/swarm-log.json per worker

### Debugging Failure Modes
1. **Slow swarm**: Check context window (may be exhausted) and network timeouts (may be escalating to leader)
2. **Worker hangs**: Check for network escalation message; approve or adjust allowlist
3. **Orphaned workers**: Run `pkill -9 -f "claude.*worker"` and check logs
4. **Disk full**: Run cleanup script; check for unbounded session growth

### Production Hardening
- Run Claude Code in a container (Kubernetes, Docker) with resource limits
- Use OS-level sandboxing (bubblewrap on Linux, Seatbelt on macOS)
- Implement defense-in-depth: application rules + OS sandbox + infrastructure isolation
- Set ulimit and deploy file-descriptor monitoring
- Archive and rotate swarm logs daily
- Use separate Claude Code instances for high-concurrency swarms (>20 agents)

---

## Sources
- [Dive into Claude Code: The Design Space of Today's and Future AI Agent Systems](https://arxiv.org/html/2604.14228v1)
- [How Claude Code's Multi-Agent Swarm Actually Works](https://oldeucryptoboi.substack.com/p/how-the-multi-agent-swarm-actually)
- [Claude Code Sandboxing: Network Isolation, File System Controls, and Container Security](https://www.truefoundry.com/blog/claude-code-sandboxing)
- [Hosting the Agent SDK - Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/hosting)
- [Claude Code Sandbox Bypass, When Agent Egress Becomes the Exfil Path](https://www.penligent.ai/hackinglabs/claude-code-sandbox-bypass/)
- [GitHub - trailofbits/claude-code-config: Opinionated defaults, documentation, and workflows for Claude Code](https://github.com/trailofbits/claude-code-config)
