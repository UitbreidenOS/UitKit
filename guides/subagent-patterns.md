# Subagent Design Patterns

How to structure multi-agent Claude Code tasks for parallelism, correctness, and cost efficiency. Each pattern below has a use case profile, a textual diagram, implementation guidance, and common mistakes to avoid.

---

## Understanding subagents in Claude Code

When Claude Code spawns a subagent, it uses the `Agent` tool to launch a separate Claude instance with its own context window. The parent agent continues running (or waits, depending on the pattern). Subagents can use tools, read files, write files, and return results to the parent.

Key constraints:
- Each subagent has its own token budget — fan-out multiplies cost linearly
- Subagents cannot share memory directly — they communicate through files or return values
- Spawning is asynchronous by default; the parent can wait for results or continue
- Tool permissions apply to each subagent independently

---

## Pattern 1: Fan-Out

**Dispatch N agents simultaneously, aggregate results.**

```
Parent
  ├── Agent A (handles shard 1)
  ├── Agent B (handles shard 2)
  ├── Agent C (handles shard 3)
  └── [wait for all]
        └── Parent aggregates results
```

**When to use:**
- Independent work units that do not share state
- Processing a list (files, repos, endpoints, test cases) where each item is self-contained
- Any task where sequential execution would take N× longer for no quality benefit

**When NOT to use:**
- Tasks with shared mutable state (concurrent file writes cause conflicts)
- When shard results depend on each other
- When token cost is a concern and quality-per-token matters more than speed

**Implementation:**
```
Spawn 4 agents in parallel. Each agent handles one service directory:
  - Agent 1: audit /services/auth/
  - Agent 2: audit /services/payments/
  - Agent 3: audit /services/notifications/
  - Agent 4: audit /services/reporting/

Each agent writes its findings to /tmp/audit-[service].json.
After all 4 complete, read all four files and produce a consolidated report.
```

**Common mistakes:**
- Not giving each agent a unique output path (they overwrite each other)
- Spawning more agents than there are meaningful work units (a 3-line file doesn't need its own agent)
- Aggregating before all agents finish (check for all output files before consolidating)

---

## Pattern 2: Validation Chain

**Agent A → gate → Agent B → gate → Agent C. Each agent can block progression.**

```
Input → Agent A → [GATE: pass/fail?] → Agent B → [GATE: pass/fail?] → Agent C → Output
                        │                               │
                      STOP                            STOP
                  (fix required)                 (fix required)
```

**When to use:**
- Quality enforcement pipelines (write → review → approve)
- Security-sensitive workflows where an unchecked step is worse than no step
- When each stage produces a transformed artifact that the next stage needs
- The `workflows/pre-human-review.md` workflow uses this pattern

**When NOT to use:**
- When stages are independent and could run in parallel (use fan-out instead)
- When all agents are likely to pass (three agents reviewing a two-line change is over-engineering)
- When the cost of the full chain exceeds the cost of a single careful agent

**Implementation:**
```
Chain: simplifier → security reviewer → code reviewer

After each agent, check its output for a PASS/FAIL signal before spawning the next.
If any agent returns FAIL, halt the chain and surface the issues.
Only spawn the next agent after explicit PASS.

Never batch the chain into a single agent call — the gate logic must be enforced by the parent.
```

**Common mistakes:**
- Defining gates too loosely (every agent passes, the chain provides no value)
- Defining gates too strictly (one minor warning halts everything)
- Letting agents know what comes after them (they should evaluate independently, not calibrate to the next stage)

---

## Pattern 3: Specialist Routing

**Classify the task, route to the right expert agent.**

```
Input → Classifier → router decision
                          ├── [type: security] → Security Specialist
                          ├── [type: database] → DB Specialist
                          ├── [type: frontend] → UI Specialist
                          └── [type: unknown]  → General Agent
```

**When to use:**
- A heterogeneous queue of tasks that require different expertise
- Avoiding a general-purpose agent that is mediocre at everything
- When specialist agents carry domain-specific instructions the general agent shouldn't be burdened with

**When NOT to use:**
- Tasks that are clearly one type — no need to classify what you already know
- When the classifier itself is expensive (classifying a one-line bug fix with a Sonnet call wastes tokens)

**Implementation:**
```
Step 1 — Classify (use Haiku for cost):
  "Read this task description and return one word: security | database | frontend | backend | unknown"

Step 2 — Route based on classification:
  if security → spawn agents/security-reviewer.md
  if database → spawn agents/db-specialist.md
  if frontend → spawn agents/ui-reviewer.md
  else        → spawn general agent

Step 3 — Return specialist's result to the user.
```

**Common mistakes:**
- Using Sonnet or Opus for classification — Haiku classifies just as accurately for a fraction of the cost
- Routing to a specialist but not giving it the full context from the classifier
- Over-segmenting (10 specialist agents for an app that only ever needs 2 of them)

---

## Pattern 4: Watchdog

**A monitor agent observes and can intervene on a long-running worker agent.**

```
Worker Agent ──── progress updates ───→ Watchdog Agent
     │                                        │
     │                                  [monitors for]
     │                                  - stuck loops
     └── [watchdog can signal halt] ←── - dangerous actions
                                        - quality degradation
```

**When to use:**
- Long autonomous sessions where going off-rails is costly
- When the worker agent is using tools with real-world side effects (file writes, API calls, deploys)
- Overnight or unattended runs where you need a circuit breaker

**When NOT to use:**
- Short tasks (< 5 minutes) — the watchdog overhead isn't worth it
- Read-only exploration tasks where the worst outcome is a wrong answer

**Implementation:**
```
Spawn watchdog with these triggers:
  HALT if: worker attempts to write to /etc/, run rm -rf, or access .env files
  WARN if: worker has made the same tool call 3+ times without progress
  WARN if: worker output size exceeds 50k tokens (likely looping)
  REPORT at: task completion or halt

Watchdog cannot override the worker directly — it signals the parent, which decides whether to halt.
```

**Common mistakes:**
- Making the watchdog too sensitive (it halts on the first retry, defeating the purpose)
- Making the watchdog too permissive (it never fires, providing false safety)
- Watchdog running at the same model as the worker (use Haiku for the watchdog — it is observing, not reasoning)

---

## Pattern 5: Parallel Investigation

**Multiple agents test different hypotheses simultaneously; first correct result wins (or all results are compared).**

```
Hypothesis 1 → Agent A ─────┐
Hypothesis 2 → Agent B ─────┼──→ Parent compares results → best answer
Hypothesis 3 → Agent C ─────┘
```

**When to use:**
- Debugging where the root cause is unclear and multiple theories are plausible
- Research tasks where different search strategies might yield different findings
- Any task where the best approach is genuinely uncertain upfront

**When NOT to use:**
- Tasks where there is one obviously correct approach
- Cost-sensitive situations — this pattern is the most expensive per correct answer
- When hypotheses are not independent (Agent A's result changes whether Hypothesis B is valid)

**Implementation:**
```
Spawn 3 agents with different hypotheses for why the database is slow:
  - Agent A: investigate query plans and missing indexes
  - Agent B: investigate connection pool exhaustion
  - Agent C: investigate lock contention

Each agent writes its findings and confidence level to /tmp/hypothesis-[A/B/C].md.
After all complete, compare findings and return the most likely root cause with evidence.
```

**Common mistakes:**
- Framing hypotheses so similarly that agents produce near-identical results
- Not including a confidence score — without it, you can't choose between conflicting findings
- Running too many hypotheses (3-4 is usually right; beyond that, cost outpaces the marginal benefit of another theory)

---

## Token cost comparison

| Pattern | Relative cost | Best cost efficiency |
|---|---|---|
| Fan-out (N agents) | N × single agent | When N tasks are fully parallelizable |
| Validation chain (3 agents) | 3× if all pass, less if early halt | When early-halt is common |
| Specialist routing | ~1× (classifier is Haiku) | Almost always cheaper than general + post-hoc fix |
| Watchdog | ~1.05–1.1× (Haiku watchdog) | Long autonomous sessions |
| Parallel investigation | N× with no early termination | Only when uncertainty is high and mistakes are costly |

**Cost guidance:**
- Use Haiku for: classifiers, watchdogs, translation agents, any agent doing mechanical transformation
- Use Sonnet for: specialists, reviewers, agents that need judgment
- Use Opus for: high-stakes decisions, complex architecture analysis — not for supporting roles

---
