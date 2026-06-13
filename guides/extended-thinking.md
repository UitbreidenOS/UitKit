# Extended Thinking / Reasoning Mode

How to use Claude's internal chain-of-thought capabilities — when to enable it, how to control the token budget, and how to avoid paying for thinking time you don't need.

---

## What extended thinking is

Extended thinking gives Claude a scratchpad it uses before producing a response. The thinking content is a chain-of-thought — Claude works through the problem step by step before committing to an answer. You see the thinking output in the response (as a `thinking` block), and the final answer reflects that reasoning.

This is structurally different from standard generation. In standard mode, Claude produces tokens left-to-right, and each token is committed as it's generated. In thinking mode, Claude first allocates a budget of internal tokens to reason through the problem, then synthesises a final answer from that reasoning. The final answer tends to be more accurate, more complete, and less likely to take an obviously wrong early step it then doubles down on.

The key tradeoffs:

| Property | Standard mode | Extended thinking |
|---|---|---|
| Latency | Low (first token fast) | Higher (thinking runs first) |
| Cost | Output tokens only | Thinking tokens + output tokens |
| Accuracy on complex tasks | Baseline | Significantly better |
| Accuracy on simple tasks | Baseline | Marginally better, rarely worth it |
| Response coherence | Good | Better on multi-step tasks |
| Streaming | Immediate | Thinking blocks stream separately |

Extended thinking is not a magic improvement — it trades cost and latency for accuracy on tasks that require deliberate reasoning. Use it when the reasoning complexity justifies the tradeoff.

---

## Model support

Extended thinking is available on:

| Model | Thinking support | Notes |
|---|---|---|
| Claude Opus 4.7 | Full support | Highest quality reasoning; highest cost |
| Claude Sonnet 4.6 | Full support | Best cost/performance ratio for most tasks |
| Claude Haiku 3.5 | Not supported | Use for fast, low-cost tasks without thinking |
| Earlier models | Not supported | Opus 4 and below do not support `thinking` |

For most production use cases, Sonnet 4.6 with thinking enabled outperforms Opus 4 at lower cost. Reserve Opus 4.7 with maximum thinking budget for the hardest tasks — architecture design under complex constraints, proof verification, algorithmic correctness across edge cases.

---

## Enabling extended thinking

### Claude Code: `/effort` command

In a Claude Code session, the `/effort` parameter controls thinking mode:

```
/effort low       # Standard mode — no extended thinking
/effort medium    # Light thinking; suitable for moderately complex tasks
/effort high      # Full thinking enabled; ~16K thinking token budget
/effort max       # Maximum thinking budget; use for the hardest problems
```

`/effort` is session-scoped. Setting it once applies to all subsequent turns until you change it or start a new session.

**Behaviour at each level:**

| Level | Thinking enabled | Approximate token budget | Use case |
|---|---|---|---|
| `low` | No | 0 | Boilerplate, simple edits, lookups |
| `medium` | Sometimes | ~4,000 | Code review, moderate refactors |
| `high` | Yes | ~16,000 | Complex logic, architectural decisions |
| `max` | Yes | ~32,000+ | Research-grade problems, proofs, deep design |

In practice, `high` covers the majority of tasks where thinking adds value. `max` is for problems where you genuinely need Claude to explore multiple solution strategies before committing.

**Checking current effort level:**

```bash
# The current /effort level is displayed in the session status bar.
# To reset to default (standard mode):
/effort low
```

### API: `thinking` parameter

When calling the API directly, pass a `thinking` block in the request:

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 16000,
  "thinking": {
    "type": "thinking",
    "budget_tokens": 10000
  },
  "messages": [
    {
      "role": "user",
      "content": "Design a distributed rate limiter that handles 1M RPS with sub-millisecond p99 latency. Consider Redis, token buckets, sliding windows, and gossip protocols. Justify every tradeoff."
    }
  ]
}
```

**Rules for `budget_tokens`:**

- Minimum: `1024` — anything below is rejected
- Typical range: `8,000–16,000` for most complex tasks
- High-complexity range: `16,000–32,000`
- Hard cap: model-dependent; Opus 4.7 supports up to `32,000+`; check model docs for current limits
- `budget_tokens` must be less than `max_tokens`

Claude may use fewer tokens than the budget. The budget is a ceiling, not a guarantee.

---

## The API response: thinking blocks

When thinking is enabled, the response contains a `thinking` block before the text block:

```json
{
  "id": "msg_01XFDUDYJgAACTu2zCjM9e64",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me work through the rate limiter design systematically. The core constraint is 1M RPS at sub-millisecond p99...\n\nOption 1: Redis with token bucket...\nPros: Simple, widely understood\nCons: Redis becomes a bottleneck at 1M RPS — single-threaded command execution, network RTT adds latency...\n\nOption 2: In-process sliding window with gossip sync...\n[Claude continues reasoning across options, then synthesises]\n\nConclusion: Hybrid approach — in-process counters with async gossip for cross-node coordination..."
    },
    {
      "type": "text",
      "text": "## Distributed Rate Limiter Design\n\nFor 1M RPS at sub-millisecond p99, Redis alone is insufficient as the primary counter store..."
    }
  ],
  "usage": {
    "input_tokens": 147,
    "output_tokens": 2341,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0
  }
}
```

The `thinking` field is the raw scratchpad content. It's human-readable but not the polished answer — expect exploratory language, dead ends Claude abandons, and tentative conclusions revised mid-thought. The final `text` block is the actual response.

---

## Cost model

Thinking tokens are billed at the same rate as output tokens. They are not discounted.

```
Total cost = (input_tokens × input_rate) + (thinking_tokens × output_rate) + (output_tokens × output_rate)
```

**Example at Sonnet 4.6 pricing (illustrative, verify current rates at anthropic.com):**

| Component | Tokens | Rate (per 1M) | Cost |
|---|---|---|---|
| Input | 500 | $3.00 | $0.0015 |
| Thinking | 8,000 | $15.00 | $0.12 |
| Output | 800 | $15.00 | $0.012 |
| **Total** | | | **$0.1335** |

Without thinking:

| Component | Tokens | Rate (per 1M) | Cost |
|---|---|---|---|
| Input | 500 | $3.00 | $0.0015 |
| Output | 800 | $15.00 | $0.012 |
| **Total** | | | **$0.0135** |

Extended thinking is roughly 10× more expensive on this example task. That multiplier is the right order of magnitude for typical usage. When you're solving a hard problem once, that cost is trivial. When you're calling it in a loop over thousands of inputs that don't require reasoning, it's a significant regression.

**Thinking tokens do not benefit from prompt caching.** Input tokens before the thinking block can be cached, but the thinking output itself cannot. Structure requests so stable system prompts and context are positioned to benefit from caching before the `thinking` block.

---

## Streaming with thinking

When streaming a thinking-enabled response, `thinking` blocks and `text` blocks stream separately. The thinking block completes before the text block begins in most clients.

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "thinking",
        "budget_tokens": 8000
    },
    messages=[{"role": "user", "content": "..."}]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if event.content_block.type == "thinking":
                print("[Thinking started]")
            elif event.content_block.type == "text":
                print("[Response started]")
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                # Raw thinking tokens streaming
                pass  # Suppress if you don't want to display it
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

In user-facing products, you can hide the thinking block entirely and stream only the `text` block. The latency to first text token is higher with thinking enabled — calibrate your UX loading states accordingly.

---

## Standard vs thinking mode: same prompt, different outputs

**Prompt:** "A function runs in O(n log n) average case. You need to process 10M items in under 2 seconds on a machine with 8 cores. Is this feasible? What are the failure modes?"

**Standard mode response (abbreviated):**

> O(n log n) on 10M items is roughly 10M × 23 ≈ 230M operations. At 1 billion operations/second per core, that's 0.23 seconds single-threaded. With 8 cores you're well within 2 seconds. Main failure modes: memory bandwidth, cache misses, and thread synchronisation overhead.

Correct at a surface level. Misses several meaningful failure modes.

**Thinking mode response (abbreviated, from actual thinking block):**

*Thinking:* "Let me be careful here. O(n log n) average case — what's the worst case? Not specified. What's the constant factor? Not specified. Memory access pattern? Not specified. 'Function' — is this comparison-based sort? Graph algorithm? The framing is ambiguous..."

*Response:*

> Feasibility depends on factors the question leaves open. Here's what you need to nail down before committing to this design:
>
> **The maths at face value:** 10M × log₂(10M) ≈ 230M operations. At realistic IPC on modern hardware (~2–4 effective ops/cycle at 3GHz), you have roughly 6–12 billion "operation slots" per second per core. Single-threaded, this is trivially fast. But this calculation hides the real risks.
>
> **Failure modes that will actually bite you:**
>
> 1. **Constant factor:** O(n log n) with a large constant (e.g., cache-unfriendly memory access) can be 10–100× slower than the theoretical lower bound. A sort with good cache locality beats a theoretically equivalent algorithm with pointer chasing every time.
>
> 2. **Worst-case degeneracy:** If the average case is O(n log n) but worst case is O(n²) (e.g., naive quicksort on adversarial input), production data will eventually hit it.
>
> 3. **Parallelisation overhead:** Splitting 10M items across 8 cores introduces synchronisation at merge points. For algorithms where the merge step is O(n), you can lose most of your parallelisation gain.
>
> 4. **Memory bandwidth ceiling:** At 10M items × 8 bytes each = 80MB. That fits in L3 on most server chips, but only barely. If the working set doesn't fit, memory bandwidth (not compute) becomes the bottleneck, and core count stops helping.
>
> 5. **The 2-second budget is the wrong metric:** p99 or p999 latency is what you'll be paged for. If the average is 1.8 seconds but p99 is 4.1 seconds, you're over budget when it matters.

The thinking mode response surfaces what the question was actually asking — not just a calculation, but a complete feasibility analysis. This is the pattern where extended thinking pays off: problems where a shallow answer is technically correct but operationally useless.

---

## When to use extended thinking

Use extended thinking when the task has one or more of these properties:

**Multi-step dependency chains.** Each step's correctness depends on a previous step. An error in step 2 propagates and corrupts steps 3–10. Linear generation is brittle here; thinking mode allows Claude to verify intermediate steps before committing.

**Ambiguous or underspecified requirements.** When the question contains hidden assumptions or multiple valid interpretations, thinking mode lets Claude enumerate interpretations and choose deliberately rather than committing to the first plausible reading.

**Mathematical or logical correctness.** Proof verification, algorithm correctness analysis, complexity bounds. These require checking multiple cases and tracking constraints — linear generation tends to skip edge cases.

**Architectural decisions with non-obvious tradeoffs.** System design, data model choices, API contract design. The right answer depends on constraints that interact in non-obvious ways. Thinking mode makes the constraint analysis explicit.

**Debugging complex system interactions.** When a bug's root cause spans multiple systems and requires reasoning about timing, state, and side effects simultaneously.

**Security-sensitive logic.** Auth flows, permission models, cryptographic protocol implementation. The cost of a mistake is high; the additional latency and cost of thinking is cheap by comparison.

---

## When NOT to use extended thinking

Extended thinking wastes money and adds latency with no quality benefit on:

**Simple CRUD and boilerplate.** Generating a REST endpoint, writing a model class, scaffolding a component. These tasks have a single obvious structure. Thinking doesn't improve them.

**Translation and localisation.** Converting content to another language. The task is token-for-token mapping, not reasoning. Thinking mode on translation is burning output token budget for no gain.

**Lookups and summarisation.** "What does this function do?" or "Summarise this file." The answer is in the input. No reasoning required.

**High-volume loops.** If you're calling the API in a batch over thousands of similar inputs, thinking mode multiplies your cost by 5–15×. Reserve thinking for the planning phase; use standard mode for execution.

**Time-sensitive interactive flows.** Autocomplete, inline suggestions, chat responses where the user expects a sub-second reply. The thinking latency will feel broken.

**Iterative drafting.** First-draft generation, brainstorming, speculative exploration. You want volume and variety, not rigour. Use standard mode and iterate.

---

## Claude Code integration: `/effort` in practice

When you set `/effort high` or `/effort max` in a Claude Code session, several behaviours change:

- **Tool call planning improves.** Before issuing a sequence of reads, edits, and bash calls, Claude will internally reason through the full plan rather than committing to the first plausible action. This reduces mid-sequence backtracking.

- **Multi-file operations are more coherent.** When a task requires changes across several files that must stay consistent, thinking mode helps Claude hold all constraints in scope simultaneously.

- **Ambiguous task decomposition improves.** If your task description is underspecified, Claude is more likely to surface the ambiguity and ask, rather than guessing and proceeding incorrectly.

- **Error recovery is better.** When a tool call returns an unexpected result, thinking mode makes Claude more likely to reason through what went wrong rather than retrying the same action.

**Recommended session pattern:**

```
# Start of complex task
/effort high

# ... work through the complex design/architecture ...

# Switch back when moving to implementation
/effort low

# ... generate the boilerplate, write the tests, etc. ...

# Switch back for any hard debugging or cross-cutting concerns
/effort high
```

Do not leave `/effort high` for an entire long session. You're paying thinking token rates on every turn, including "ok, read this file" and "now run the tests" turns that gain nothing from reasoning.

---

## Real-world use cases

### 1. Database schema migration under constraints

**Prompt:**
```
We're migrating from a single-tenant Postgres schema (one DB per customer) to 
a multi-tenant schema (row-level isolation via tenant_id). We have 47 tables, 
several with cross-table foreign keys. We cannot afford downtime. We process 
8,000 write transactions/minute at peak. Design the migration strategy.
```

**Why thinking helps:** The migration must handle foreign key constraints, backfill ordering, index changes, and zero-downtime cutover simultaneously. These constraints interact — an ordering that satisfies foreign keys may conflict with backfill performance. Linear generation picks one constraint to solve first and then retrofits the others, often producing a plan with a silent failure mode. Thinking mode lets Claude enumerate constraint interactions before committing to a plan.

---

### 2. Compiler bug root cause analysis

**Prompt:**
```
Our Rust binary compiles cleanly but segfaults at runtime only when compiled 
with --release and only on ARM64. The crash is in a hot loop that processes 
byte arrays. No unsafe code in our codebase. Here's the relevant assembly diff 
between debug and release: [...]
```

**Why thinking helps:** The root cause involves the interaction of LLVM optimisation passes, alignment assumptions, and undefined behaviour in safe-looking Rust code. Diagnosing this requires holding multiple hypotheses simultaneously and reasoning about which assembly patterns correspond to which source-level constructs. This is a classic thinking-mode task.

---

### 3. API contract design for backwards compatibility

**Prompt:**
```
We need to add pagination to an API endpoint that currently returns all results. 
Our API has 200+ external consumers. We cannot break existing integrations. 
The current response schema is: { "results": [...] }. Design the versioning 
and migration path.
```

**Why thinking helps:** The design must satisfy new consumers (who need pagination), old consumers (who expect the flat array), and the transition period (where both exist). These constraints suggest different approaches that are mutually exclusive without careful design. Thinking mode maps the constraint space before proposing a structure.

---

### 4. Distributed systems correctness verification

**Prompt:**
```
This is our leader election algorithm. Identify all conditions under which 
two nodes could simultaneously believe they are the leader. 
[algorithm pseudocode follows]
```

**Why thinking helps:** Safety property violations in distributed algorithms require exhaustively checking all interleavings of concurrent events. Linear generation checks the obvious cases and stops. Thinking mode is more likely to construct the systematic case analysis that finds subtle races.

---

### 5. Security model review

**Prompt:**
```
Here is our permission model for a multi-tenant SaaS. Users belong to 
organisations. Organisations have roles. Resources belong to organisations. 
Users can share resources cross-organisation with explicit grants. 
Identify privilege escalation paths. [schema and permission check code follows]
```

**Why thinking helps:** Privilege escalation vulnerabilities live at the intersection of multiple permission rules. Finding them requires holding the full permission model in mind while reasoning about sequences of valid-looking operations that compose into an invalid state. This is exactly the kind of multi-constraint reasoning where thinking mode improves accuracy.

---

## Token budget sizing guide

Choosing the right `budget_tokens` value is not about maximising — it's about matching the complexity of the task.

| Task complexity | Recommended budget | Examples |
|---|---|---|
| Moderate | 4,000–6,000 | Code review, single-function debugging, data model questions |
| High | 8,000–12,000 | Architectural decisions, multi-file refactors, algorithm design |
| Very high | 16,000–24,000 | System design under hard constraints, security reviews |
| Maximum | 32,000+ | Compiler correctness, formal verification, proof analysis |

Start at 8,000 and increase only if you observe truncated reasoning. Signs that the budget is too small:

- The thinking block ends abruptly mid-analysis
- The final response misses constraints that were visible in the prompt
- The response hedges heavily where a decisive answer was possible

Signs the budget is too large:

- The thinking block is repetitive — Claude explores the same branch multiple times
- The final response doesn't meaningfully improve over what a 4,000-token budget produced
- Latency is high but the answer is a simple recommendation

---

## Extended thinking checklist

Use this before enabling thinking mode. If fewer than 3 items apply, use standard mode.

- [ ] The task has more than 2 sequential dependencies (step A must be correct before step B can proceed)
- [ ] The task contains explicit or hidden constraint conflicts that need resolution
- [ ] An incorrect answer would be expensive to find and fix (production bug, security issue, irreversible migration)
- [ ] The task involves a correctness property, not just a style or structure preference
- [ ] You have been disappointed by a standard-mode answer on a similar task before
- [ ] The prompt is ambiguous in a way that requires interpretation before answering
- [ ] The task requires enumerating cases (all error conditions, all interleavings, all edge cases)
- [ ] The task spans multiple systems or files that must remain mutually consistent
- [ ] The task is a one-off decision (not a high-volume batch operation)
- [ ] You have time for the latency — this is not a user-facing synchronous call

---

## Common mistakes

**Setting `/effort max` for an entire session.** The cost multiplier applies to every turn, including trivial ones. Use targeted effort elevation for the hard parts, drop back to `low` for execution.

**Using thinking mode on creative tasks.** Extended thinking does not improve prose, design brainstorming, or content generation. The quality improvement is specific to tasks requiring logical correctness.

**Ignoring the thinking block in debugging.** When thinking mode produces a wrong answer, read the thinking block first. It usually reveals exactly where the reasoning went wrong, which is the most direct path to fixing your prompt.

**Treating `budget_tokens` as a quality dial.** Doubling the budget does not reliably double the quality. Beyond a task-appropriate ceiling, additional budget produces repetitive reasoning without better conclusions. Start at 8,000 and validate before going higher.

**Enabling thinking on streaming endpoints with tight latency budgets.** Thinking mode delays the first text token by the full duration of the thinking phase. If your UI shows a typing indicator and users expect a response within 1–2 seconds, this will feel broken. Either hide the thinking phase behind a deliberate loading state or disable thinking on that endpoint.

---
