# Long-Context Optimization

Strategies for working effectively with Claude's 200K–1M token context windows — how to avoid context rot, maintain quality at scale, and know when to compact versus when to continue.

This guide is the companion to [context-budget.md](context-budget.md), which covers general token accounting and the mechanics of compaction. This guide focuses specifically on the 200K+ scale: what that window size means in practice, why quality degrades well before you hit the limit, and how to structure your sessions and tooling to stay in the quality zone across long workloads.

---

## Context window sizes in practice

| Model | Context window | Approximate word count | Approximate page count |
|---|---|---|---|
| Claude Haiku 4.5 | 200K tokens | ~150,000 words | ~500 pages |
| Claude Sonnet 4.6 | 200K tokens (standard) | ~150,000 words | ~500 pages |
| Claude Sonnet 4.6 | 1M tokens (extended) | ~750,000 words | ~2,500 pages |
| Claude Opus 4.7 | 200K tokens | ~150,000 words | ~500 pages |

**200K tokens in concrete terms:**

- A 200K context window fits approximately the complete works of Shakespeare — twice over
- A large monorepo with 300 TypeScript files at 200 lines each is ~60K tokens
- A single large log file with 10,000 lines is roughly 80–100K tokens
- A full Claude Code session with 50 turns of moderately verbose tool use averages 40–80K tokens

The numbers suggest you have ample room. The reality is different. The 200K limit is not your operating ceiling — it is the cliff. Your effective ceiling is roughly 60–70% of that figure, and for complex tasks closer to 40–50%.

---

## The 1M context window (Sonnet 4.6 extended)

Sonnet 4.6 can be accessed with an extended 1M token context window. This is not the default.

**When to use it:**
- Repository-wide analysis tasks where you need to hold multiple large files simultaneously
- Long-running autonomous loops where compaction would discard critical intermediate state
- Cross-file refactors where 30+ files must be in context at once for correctness
- Document analysis tasks (legal, research, codebase archaeology) where the corpus genuinely requires the window

**When not to use it:**
- General development work — the standard 200K model handles most sessions without issue
- Cost-sensitive workflows — the 1M window carries premium pricing per token
- Tasks where the extra capacity would fill with noise rather than signal

**Cost and latency implications:**

The 1M window affects pricing and response time. At full context, first-token latency increases measurably. Cache writes — incurred on the first turn of a session — scale linearly with context size. A 200K-token session costs 200K cache write tokens on turn one. A 1M session costs 1M. If you run 50 sessions daily and use the 1M window unnecessarily, that overhead compounds quickly.

Rule of thumb: use the standard 200K model unless you have a specific, concrete reason the task requires more. Most tasks that seem to require 1M can be restructured to fit within 200K with proper context hygiene.

---

## Context rot: why quality degrades before the limit

Context rot describes the quality degradation that occurs as a context window fills — well before the hard limit is reached. The mechanism is attention dilution.

Claude processes context via attention — a mechanism that weighs the relevance of each token to the current generation. As the window grows, the signal-to-noise ratio of the context decreases. Important constraints set early in the session compete with hundreds of thousands of tokens of tool outputs, intermediate reasoning, and file contents. The model's attention distributes across all of it.

**The empirically observed degradation curve:**

| Context fill level | Quality signature |
|---|---|
| 0–40% | Full quality; constraints and instructions reliably followed |
| 40–60% | Minor drift; early instructions occasionally missed; slight repetition |
| 60–70% | Noticeable degradation; key facts buried and retrieved inconsistently |
| 70–85% | Significant rot; decisions contradict earlier session constraints |
| 85%+ | Unreliable; effectively operating on recent context only |

These are empirical observations, not hard thresholds. The actual degradation curve varies by task type, context structure, and how front-loaded versus evenly distributed the signal is.

---

## Warning signs of context rot

Watch for these patterns. Any one of them in isolation may be noise; two or more occurring together indicates rot has set in.

**Repetition:** Claude explains something it already explained two pages back, verbatim or near-verbatim. This is the most common early signal — the model is generating from recent context without recalling the earlier derivation.

**Constraint forgetting:** You established early in the session that the project uses ESLint with strict settings, or that a specific API is deprecated, or that tests must not use `describe.only`. Claude starts violating these constraints. The instruction is still in context but is no longer reliably attended to.

**Inconsistent decisions:** You established an architectural approach — say, all database access through a repository layer. Claude starts writing direct database calls in a service. Asked to explain, it produces reasoning that contradicts earlier decisions without acknowledging the contradiction.

**Re-asking for information:** Claude asks you for information it retrieved or you provided earlier in the session. The fact is in context; the model is not retrieving it.

**Vague responses on specific topics:** Early in the session, Claude produced precise, specific answers. Later in the same session, on similar questions, responses become hedged, generic, or reference the wrong part of the codebase. This reflects flattened attention across a large context rather than focused retrieval.

**The fix is not always to correct:** Correcting in-session after rot sets in adds more tokens and compounds the problem. The right response is to compact or start a fresh session.

---

## 7 optimization strategies

### 1. Front-loading: primacy and recency

Attention is not uniform across the context window. Claude reliably attends to the beginning and end of the context more strongly than the middle — this is the primacy and recency effect. Structure your context to exploit this.

**Front-load critical constraints:**

```
# Good session opening — constraints stated before any tool use
You are working on the payments service in this monorepo. 
Key constraints for this session:
- All database calls go through src/db/repositories/ — never directly to Prisma
- The PaymentService class must remain stateless — no instance variables that hold state
- Error handling must use the AppError class from src/errors/
- Never modify the migrations directory — schema changes are out of scope

Now let's start by reviewing the current PaymentService implementation.
```

If you open a session with tool use immediately — file reads, bash commands — these constraints get pushed down. By the time context fills, they are buried in the middle of the window.

**Repeat critical constraints at the end of long inputs:**

For very long user messages or structured prompts, restate the single most important constraint at the end:

```
[... 500 tokens of context ...]

Remember: all database access must go through the repository layer.
```

The recency signal ensures the constraint is in Claude's immediate attention when it begins generating.

**Do not front-load noise:** Apply the same logic inversely. Verbose background information that isn't decision-relevant should not occupy the primacy slot. Lead with constraints and objectives, not project history.

---

### 2. Structured summaries: compact timing

The `/compact` command is covered in detail in [context-budget.md](context-budget.md). The timing question is specific to long-context sessions.

**Compact at 40–50% fill, not 80%.**

At 50% fill, the compaction summarizer has high-quality signal to work from. The conversation is long enough to have produced meaningful decisions and outcomes, but short enough that the summarizer can still distinguish signal from noise. The resulting summary is accurate and complete.

At 80% fill, the summarizer is working with a context that is already partially degraded. The summary it produces reflects the degraded state — important early decisions may be underrepresented or missing.

**Use directed compaction:**

```
/compact focus on the auth refactor — retain the decision to use RS256 and the JWT shape, drop the debugging context for the expired token issue
```

Without a directive, the summarizer makes autonomous choices about what matters. A specific directive anchors it to your current working thread.

**Compact between major phases, not mid-task:**

Compact after completing a bounded sub-task, before starting the next one. Compacting mid-task risks losing the intermediate state you need to continue. The pattern:

```
Phase 1: exploration and analysis → complete → /compact "retain findings on payment module architecture"
Phase 2: implementation → ... → complete → /compact "retain all changes made, file paths, design decisions"
Phase 3: testing → ...
```

---

### 3. Targeted reads: offset and limit

Every file read enters context in full unless you constrain it. For long-context sessions, this is the primary source of avoidable bloat.

**Use `offset` and `limit` on the Read tool:**

```
# 2,000-line file: ~20K tokens — reads entire file
Read /path/to/service.ts

# Targeted read of lines 400–450: ~500 tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

**Grep before you read.** Use Grep to locate the relevant section, then read only that section:

```bash
# Step 1: find the relevant function
grep -n "processPayment" /path/to/payments.service.ts

# Output: line 847
# Step 2: read only that section
Read /path/to/payments.service.ts, offset: 840, limit: 60
```

This pattern — grep first, targeted read second — consistently reduces context consumption by 80–95% for navigation tasks.

**Summarise before reading large files:**

For very large files where you need a high-level understanding before deciding what to read:

```bash
wc -l /path/to/large-file.ts && grep -n "^export\|^class\|^function\|^const.*=.*function" /path/to/large-file.ts | head -40
```

This gives you the file's exports and structure in ~40 lines (~400 tokens) rather than reading 2,000+ lines to understand it.

---

### 4. Bash output trimming

Uncontrolled Bash output is the most common cause of sudden context fill in long sessions. A single `npm install`, `docker build`, or `pytest -v` can add 5–20K tokens in one tool call.

**Apply these patterns systematically:**

```bash
# Limit log volume
docker logs my-container --tail 50
npm test 2>&1 | tail -30
./run-suite.sh | grep -E "PASS|FAIL|ERROR|WARN" | head -50

# Suppress noise at source
curl -s https://api.example.com/v1/status         # -s suppresses progress
rsync -a --quiet src/ dst/
npm install --silent

# Redirect stderr when not relevant
make build 2>/dev/null
python setup.py install 2>/dev/null

# Extract signal before it enters context
git log --oneline -20
git diff --stat HEAD~5 HEAD
find . -name "*.ts" -newer src/auth.ts | head -20
```

**Pipe-and-filter as a default discipline:**

```bash
# Instead of: node scripts/analyze.js
# Use: node scripts/analyze.js | grep -v "^DEBUG:" | head -100
```

The exact line count matters less than the habit. Any Bash command with potentially unbounded output should have a truncation pipe before it enters context.

---

### 5. Subagent isolation for large read tasks

When a task requires reading many files — a codebase survey, a dependency analysis, a security scan across 50 modules — doing it in the main context fills the window with intermediate data that is only useful for producing a conclusion.

**The subagent pattern:**

```
# What NOT to do (main context reads 40 files):
"Read all files in src/auth/ and tell me what they do"
[Claude reads 40 files into main context — ~80K tokens]
"Now summarise the architecture"

# What to do (subagent reads, returns summary):
Spawn a subagent with:
  Task: Survey all files in src/auth/. 
  Return: A structured summary covering (1) what each file exports,
  (2) the dependency graph between them, (3) any files that contain
  security-sensitive logic like token validation or permission checks.
  Do not return file contents — return a structured analysis only.

[Subagent reads 40 files in its own context — main context receives ~1K tokens of structured findings]
```

The main context receives conclusions, not the raw intermediate data. The subagent's context is discarded after the task.

**When to use subagent isolation:**
- The task involves reading more than 10 files for discovery purposes
- The intermediate read outputs (file contents) won't be needed again after the conclusion
- The task is bounded and has a clear deliverable format

**When not to use it:**
- You will need to directly edit the files being surveyed — the parent context needs to see them
- The task is simple enough that the overhead of spawning isn't worthwhile

---

### 6. CLAUDE.md scoping

`CLAUDE.md` loads at every session start and occupies primacy — it is the first content in context. Every token in it is a fixed cost paid on every session.

**Rules for long-context sessions:**

Keep project `CLAUDE.md` under 2,000 tokens. This is not an aesthetic preference — it is a budget decision. A 3,000-token `CLAUDE.md` costs an extra 1,000 tokens of primacy-position context on every single session you run. Across 50 sessions per day, this is 50,000 extra tokens daily, compounding into cache write costs.

**What belongs in CLAUDE.md (stays forever):**
- Project description: 3–5 sentences
- Key directories and their purpose
- Non-obvious conventions Claude must follow
- Build, test, lint commands
- Things not to modify without explicit instruction

**What does not belong (load on demand):**
- API reference documentation — load via a targeted Read when working in that area
- Historical decisions — maintain a separate `decisions.md`, load it only when working in the relevant domain
- Long examples — reference by file path, read on demand
- Rules for subsystems you're not currently working in

**Domain-scoped CLAUDE.md files:**

For large monorepos, use directory-level `CLAUDE.md` files:

```
/repo/
  CLAUDE.md                    # global conventions — under 1,000 tokens
  src/
    payments/
      CLAUDE.md                # payments-specific rules — loaded only when Claude is in this directory
    auth/
      CLAUDE.md                # auth-specific rules
```

Claude reads the directory-level `CLAUDE.md` when it navigates into that directory. This means context loads incrementally as work moves across domains, rather than loading all subsystem rules at session start.

---

### 7. llms.txt: external documentation without pasting

When a task requires external documentation — a library's API, a framework's configuration reference, a service's integration guide — the default instinct is to paste the relevant sections into the conversation. For long-context sessions, this is expensive and often unnecessary.

**Check for llms.txt first:**

```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
curl -s https://docs.example.com/llms.txt | head -50
```

`llms.txt` is a compressed documentation format designed for LLM consumption. Libraries and frameworks that publish it provide 5–10x smaller representations of their documentation compared to equivalent docs-site content. If it exists, use it as the primary reference.

**Fetch only the specific page you need:**

```bash
# Instead of: paste the entire React hooks documentation
# Use: fetch the specific hook's page
curl -s "https://react.dev/reference/react/useCallback" | \
  python3 -c "import sys; from html.parser import HTMLParser; \
  class P(HTMLParser):
    def handle_data(self, d): print(d, end='')
  p = P(); p.feed(sys.stdin.read())" | \
  grep -v "^$" | head -100
```

Or fetch via the WebFetch tool with a targeted URL rather than scraping multiple linked pages.

**Reference, don't paste:**

For well-known APIs that Claude already knows (standard library functions, major framework APIs), reference the concept and let Claude reason from training rather than pasting the documentation. Only paste documentation when you have a specific, unusual configuration or a known knowledge cutoff issue.

---

## The PreCompact hook

When `/compact` fires — either manually or automatically — Claude generates a summary of the conversation from its current context. The `PreCompact` hook fires before that summary is generated, giving you a window to inject structured state that the summarizer will incorporate.

This is the correct pattern for long-context sessions where losing operational context after compaction would force re-establishment work.

**settings.json:**

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/pre-compact.sh`:**

```bash
#!/usr/bin/env bash
# Fires before /compact. Injects structured session state into the compaction context.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --name-only 2>/dev/null | head -20 || echo "none")
unstaged=$(git diff --name-only 2>/dev/null | head -20 || echo "none")
open_files=$(git status --short 2>/dev/null | head -20 || echo "none")

# Read the open task list if you maintain one
tasks_file="${CLAUDE_PROJECT_DIR}/.claude/tasks.md"
tasks=""
if [ -f "$tasks_file" ]; then
  tasks=$(tail -30 "$tasks_file")
fi

cat <<EOF
=== PRE-COMPACT STATE INJECTION ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: ${branch}

Recent commits:
${recent_commits}

Staged files:
${staged}

Unstaged files:
${unstaged}

Working tree status:
${open_files}
EOF

if [ -n "$tasks" ]; then
cat <<EOF

Open tasks (from .claude/tasks.md):
${tasks}
EOF
fi

echo "=== END STATE INJECTION ==="
```

The injected content is present in context when the compaction summary is generated. The summary Claude writes will incorporate the branch, commit history, and file state — so post-compaction, this information is available without requiring you to re-establish it.

**Extending this pattern:**

Add any structured state that is expensive to re-derive after compaction:
- Architectural decisions made during the session (read from a decisions log)
- The output of a major analysis phase (write to a file mid-session, inject it at compact time)
- The current task queue if you maintain one

---

## Tracking context usage with `/usage`

The `/usage` command shows a per-category token breakdown for the current session.

**Run it at session start:**

```
/usage
```

The session-start baseline shows your fixed overhead before any work: system prompt, CLAUDE.md, MCP tool definitions. If this number exceeds 30–40K tokens, you have a configuration problem — too many MCP servers, an overgrown CLAUDE.md, or both. Fix it before the session grows.

**Categories shown:**

| Category | What it reflects | Action if high |
|---|---|---|
| System prompt | Claude Code built-ins + CLAUDE.md | Trim CLAUDE.md; disable unused MCP servers |
| MCP tool definitions | One entry per tool across all enabled servers | Disable servers you're not using this session |
| Conversation history | Accumulated turns — both user and assistant | Compact if approaching 40% |
| Tool results | File reads, bash outputs, MCP responses | Review recent tool calls for verbose outputs |
| Agent sub-calls | Each spawned subagent's context contribution | Ensure subagents return summaries, not raw tool history |

**Use it to benchmark phases:**

Run `/usage` at the start of each major phase — after exploration, after planning, after implementation begins. This gives you a consumption map: how many tokens each phase costs. On a second or third similar project, you can predict where you'll hit the 40% threshold and plan compaction proactively.

---

## Autonomous loop patterns

Long-running autonomous sessions accumulate context differently from interactive sessions. Each loop iteration adds to the same window unless the session is structured to prevent it.

**Write state to disk between iterations:**

```bash
# At the end of each loop iteration, write structured state
cat > "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json" <<'EOF_TEMPLATE'
{
  "iteration": ${ITERATION},
  "completed": ${COMPLETED_JSON},
  "current_task": "${CURRENT_TASK}",
  "blockers": ${BLOCKERS_JSON},
  "next": "${NEXT_TASK}",
  "decisions": ${DECISIONS_JSON}
}
EOF_TEMPLATE
```

**Read state at the start of each iteration:**

```bash
# Start of next iteration — read the state file instead of carrying context
state=$(cat "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json")
echo "Resuming from state: $state"
```

The session carries only the state file's contents as its starting context for the new iteration. All intermediate tool history from previous iterations is absent.

**Use ScheduleWakeup for hard context resets:**

When a loop iteration will take significant wall time, use `ScheduleWakeup` to end the current context window and resume in a fresh one at the next tick. The tradeoff is a cache miss (delays of a few minutes or more for context initialization), which is acceptable when each iteration takes more than a few minutes and the accumulated context overhead is not worth carrying.

**SessionStart + Stop hooks for persistent state:**

For multi-session autonomous work, pair a `Stop` hook (writes session summary to disk) with a `SessionStart` hook (injects the previous session's summary). See [context-budget.md](context-budget.md) for the full implementation. This gives each new context window structured orientation without requiring exploratory reads.

---

## When to compact versus start a new session

The choice between `/compact` and a fresh session depends on what you need to carry forward.

**Compact when:**
- You need to continue the current task — compaction preserves the working thread
- File edits have been made and you need Claude to remain aware of them
- You're mid-implementation and abandoning the session would require re-establishing context about changes already written
- The session is at 40–60% fill and the task has meaningful work remaining

**Start a fresh session when:**
- The current task is complete — there is nothing to carry forward
- The session has degraded significantly and compaction quality would be poor
- You're starting a completely unrelated task in the same codebase
- The session is past 70% fill and you haven't compacted — the accumulated rot makes the compaction summary unreliable

**The cost of waiting:**

Compacting at 80% costs more than compacting at 50% in two ways. First, the 80% session has already degraded — Claude has been operating at lower quality for 30% of the context window it didn't need to. Second, the compaction summary generated from a degraded 80% context is less accurate than one generated from a clear 50% context. You pay the degradation penalty and get a worse summary.

**Directed compact to preserve the critical thread:**

```
/compact focus on the payment integration refactor — specifically retain:
- The decision to use idempotency keys on all write operations
- The change to PaymentService.processCharge() on line 847
- The open issue with the webhook retry logic not yet resolved
```

Without this direction, the summarizer may not know which of the session's many threads is the one you're continuing.

---

## Cost implications of large context sessions

Context size directly affects cost in multiple ways that are not always immediately obvious.

**Cache write tokens on first turn:**

When a session starts, the entire context is written to the prompt cache. A 200K-token session incurs 200K cache write tokens on turn one. These are charged at the cache write rate, which is lower than input token rate but not zero. Running daily sessions at high context fill compounds this cost.

**Input tokens on cache miss:**

If a session does not hit the cache — first session, cold start, session older than the cache TTL — all context tokens are charged as input tokens at the full input rate. For a 200K context, this is a significant cost difference versus a cache hit.

**The 1M window premium:**

The extended 1M context window on Sonnet 4.6 carries a premium in both price and latency. Running a full 1M context session with 200K actual useful content and 800K noise wastes both. Use the extended window only when the task genuinely requires the capacity.

**Practical cost management for long-context sessions:**

- Keep sessions focused on single tasks — idle context doesn't save money
- Compact before starting expensive multi-file tasks to keep the baseline low
- Disable MCP servers not needed for the current session (MCP tool definitions load at session start and can't be removed mid-session)
- Use the standard 200K window for all tasks that don't demonstrably require more

---

## Pre-session checklist for long-context work

Before starting a session you expect to run for more than 50–100 turns or involve significant file reads, verify these 12 items.

- [ ] **Model selection confirmed** — using 1M context only if the task genuinely requires it
- [ ] **Only necessary MCP servers enabled** — disable servers not used in this session
- [ ] **CLAUDE.md is under 2,000 tokens** — audit it if it has grown organically
- [ ] **Critical constraints written out** — will be front-loaded in the opening message
- [ ] **File read strategy planned** — grep-then-targeted-read, not full file reads
- [ ] **Bash output pipes in place** — all commands with unbounded output have `| head -N` or `| grep pattern`
- [ ] **PostToolUse compression hook installed** — see [context-budget.md](context-budget.md) for implementation
- [ ] **PreCompact hook installed** — will inject git state and task list at compaction time
- [ ] **Compact threshold decided** — plan to compact at 40–50% fill, not at 80%+
- [ ] **Subagent plan ready** — tasks involving 10+ file reads will be delegated to subagents
- [ ] **State-to-disk pattern set up** — for autonomous loops, state file paths defined
- [ ] **`/usage` will be checked at session start** — baseline overhead confirmed before first task

These items are checkboxes, not aspirational goals. Missing the PostToolUse hook costs real money across every verbose bash command in the session. Missing the compact threshold decision means you'll compact reactively at 80% rather than proactively at 50%. Each item has a measurable impact on session quality and cost.

---

## Common failure patterns and their fixes

**Failure: session degrades at turn 30 despite being under 50% fill**

Cause: a verbose tool output early in the session (e.g., a 5,000-line log read in full) is occupying 40% of the window, leaving 10% for actual working context.

Fix: identify the large block via `/usage`, note that tool results category is high relative to conversation history. Going forward, add output trimming to the offending command.

**Failure: post-compaction Claude asks about things it should know**

Cause: the compaction summary lost key decisions because they were not front-loaded or reinforced. The summarizer deprioritized them.

Fix: use directed compact with explicit retention instructions. Install the PreCompact hook. After compaction, open with a brief restatement of the most critical constraints before continuing work.

**Failure: 1M context session is slow and expensive but not producing better results**

Cause: the task doesn't need 1M tokens. The extra capacity is filled with noise — verbose bash outputs, full file reads, repeated context.

Fix: switch to standard 200K. Apply context hygiene strategies to fit the session within the smaller window. If the task genuinely doesn't fit 200K with proper hygiene, revisit the 1M window.

**Failure: autonomous loop degraded across 20 iterations without compaction**

Cause: each iteration added 10K tokens of tool history to the same context without a reset mechanism.

Fix: implement the write-state-to-disk pattern. Consider ScheduleWakeup for a hard reset between long iterations.

---
