# AutoDream — Autonomous Goal Decomposition

AutoDream translates high-level objectives into concrete, executable plans and then self-directs task execution. Instead of giving Claude step-by-step instructions, you provide the end-state and AutoDream figures out the path.

---

## When to Use AutoDream

- You know **what** you want but not **how** to get there
- The objective is clear but the approach has multiple valid paths
- Multi-day projects that benefit from automatic task decomposition
- Autonomous overnight work where you can't provide step-by-step guidance

## When NOT to Use

- Tasks with explicit instructions already provided
- Simple, well-defined requests ("Add a login button")
- Tasks requiring human judgment at every decision point (hiring, legal)
- One-off bug fixes with obvious solutions

---

## How It Works

### Step 1: Objective → Decomposition

AutoDream breaks your objective into a hierarchy:

```
Objective: "Reduce API response time by 90%"
  ├── Goal 1: Profile current performance
  │   ├── Task 1.1: Add timing middleware
  │   ├── Task 1.2: Find top 10 slowest endpoints
  │   └── Task 1.3: Record baseline metrics
  ├── Goal 2: Optimize database layer
  │   ├── Task 2.1: Profile queries
  │   ├── Task 2.2: Fix N+1 queries
  │   └── Task 2.3: Add caching
  └── Goal 3: Validate improvement
      ├── Task 3.1: Run load test
      └── Task 3.2: Compare against baseline
```

### Step 2: Prioritization

Tasks are ranked by:
1. **Impact** — which tasks move the needle most?
2. **Effort** — which are quickest wins?
3. **Dependencies** — what must come first?
4. **Risk** — what could block each task?

### Step 3: Autonomous Execution

AutoDream executes tasks in priority order:
- After each task: measures progress toward the objective
- If improvement detected: continues to next task
- If regression detected: reverts and tries alternative
- If stuck: flags for human review and moves to next independent task

### Step 4: Iterative Re-planning

As AutoDream learns from execution, it updates the plan:

```
After profiling (Goal 1):
  Learning: "80% of latency is in 3 database queries"
  Plan update:
    - Expand Goal 2 (more DB optimization tasks)
    - Reduce Goal 3 (app-level optimization less impactful)
    - Revised estimate: 2 days (was 3 days)
```

---

## Usage Patterns

### Simple Objective

```
User: "Get our test coverage from 45% to 80%"

AutoDream:
  1. Analyze which modules have lowest coverage
  2. Rank by: lines of untested code × module importance
  3. Write tests for top modules first
  4. Measure coverage after each module
  5. Stop when 80% reached or all modules covered
```

### Complex Objective

```
User: "Prepare the codebase for SOC2 audit"

AutoDream decomposes into:
  Goal 1: Audit logging (add structured logs to all API endpoints)
  Goal 2: Access control (verify RBAC on all routes)
  Goal 3: Encryption (verify TLS config, at-rest encryption)
  Goal 4: Documentation (generate evidence for each control)
  Goal 5: Gap analysis (identify controls not yet implemented)
```

### Overnight Autonomous Work

```bash
claude --auto --effort xhigh "Refactor all database queries to use parameterized statements. Write tests for each. Create a PR when done."
```

AutoDream will:
1. Find all raw SQL queries in the codebase
2. Refactor each to parameterized statements
3. Write tests for the refactored queries
4. Run the test suite to verify nothing broke
5. Commit to a branch and create a PR

---

## Progress Reporting

AutoDream reports progress at each milestone:

```markdown
## Progress Report (Task 8 of 14)

**Objective:** Reduce API response time by 90%
**Baseline:** p99 = 2,400ms | **Current:** p99 = 380ms (84% improvement)

### Completed
- Profile endpoints (found 3 bottlenecks)
- Fix N+1 in /users (p99: 2400→1200ms)
- Add Redis cache (p99: 1200→600ms)
- Add indexes (p99: 600→380ms)

### Remaining
- Compress responses (expected 10-15% further improvement)
- Final load test validation
```

---

## Objective Templates

| Template | Decomposition Pattern |
|----------|----------------------|
| "Make X faster/cheaper/smaller" | Profile → Optimize hotspots → Validate → Benchmark |
| "Get project to quality standard" | Audit → Fix critical → Improve coverage → Certify |
| "Grow metric from X to Y" | Analyze funnel → Identify levers → Implement top 3 → Measure |
| "Migrate from X to Y" | Assess scope → Plan phases → Migrate incrementally → Validate parity |

---

## Tips

**Be specific about success:** "Make it faster" is vague; "Reduce p99 from 2.4s to 240ms" gives AutoDream a measurable target.

**Set a time budget:** "Spend up to 4 hours on this" prevents AutoDream from over-investing in diminishing returns.

**Provide constraints:** "Don't change the database schema" or "Keep backwards compatibility" narrows the solution space.

**Review the plan first:** For complex objectives, ask AutoDream to show the plan before executing: "Decompose this objective into a plan but don't execute yet — let me review first."

---

## Related

- **Skills:** `autodream-goal-decomposition`, `dispatch-background-jobs`
- **Guides:** Auto Mode, Dispatch & Channels, Remote Control
- **Concepts:** Extended Thinking, Agent Teams
