# Ultrareview — Fleet-Based Adversarial Code Review

Ultrareview is Claude Code's multi-agent review system, released in public preview in April 2026. It replaces the single-reviewer model of `/code-review` with a coordinated fleet of specialized subagents that review the same diff independently, cross-check each other's findings, and produce a synthesized report verified for false positives. The key properties: adversarial (agents actively try to poke holes in each other's conclusions), parallel (agents run concurrently, not in sequence), and depth-scaled (the fleet size and effort level scale with diff size and complexity).

---

## How It Works

### The Fleet Architecture

Ultrareview spawns a fleet of reviewer subagents, each with a distinct role and a different read of the same diff. The composition of the fleet varies by diff characteristics, but a typical run on a mid-size PR includes:

| Agent | Focus |
|---|---|
| **Security Reviewer** | OWASP top 10, injection, auth bypass, data exposure, secrets in diffs |
| **Correctness Reviewer** | Logic errors, edge cases, race conditions, off-by-one, nulls |
| **Performance Reviewer** | N+1 queries, blocking I/O, algorithmic complexity, memory allocation patterns |
| **Architecture Reviewer** | Design consistency, coupling, pattern adherence, interface contracts |
| **Test Coverage Reviewer** | What's covered, what's not, whether tests actually test the behavior |
| **Adversarial Verifier** | Reviews the findings from all other agents — flags false positives, escalates missed issues |

The Adversarial Verifier is the distinguishing piece. It receives all findings from the specialist agents and its explicit job is to challenge them: determine whether each finding is real, a false positive, or a valid concern the original agent understated. This second-pass verification substantially reduces the noise in the final output.

### What Runs in Parallel vs. Sequentially

Phase 1 (parallel): All specialist agents review the diff concurrently. Each reads the same input — the diff, relevant context files, and any instructions you provided — but applies its own lens.

Phase 2 (sequential): The Adversarial Verifier receives all Phase 1 findings and produces the synthesis. This is intentionally sequential — the verifier needs the full picture.

Phase 3: The synthesized report is assembled, deduplicated, and returned to you.

End-to-end wall-clock time is typically 90–180 seconds for a mid-size PR, depending on diff size and the number of context files read. The parallelism means this is faster than running the same depth of review sequentially, despite using more total tokens.

### Context Resolution

Before handing off to the fleet, Ultrareview resolves the review context. It reads:

- The diff itself (changed lines only unless `--full-files` is set)
- The files adjacent to changed files (to understand surrounding patterns)
- Test files that cover the changed code
- Relevant configuration (linters, tsconfig, pyproject.toml) to understand what static analysis already covers
- `CLAUDE.md` if present — to apply repo-specific review rules to the fleet

This context resolution happens before the fleet spawns, so each agent receives a pre-assembled package, not raw repo access.

---

## Invocation

### Primary Invocation

```
/ultrareview
```

No arguments needed for the default case — Ultrareview picks up the current diff (staged + unstaged changes) and the branch diff against the default remote branch.

### With a Specific PR

```
/ultrareview 847
```

Pass a GitHub PR number. Ultrareview fetches the PR diff via the GitHub MCP or `gh` CLI. This is the most common invocation in practice — you point it at a PR, it reviews it.

### With a Focus Area

```
/ultrareview --focus security
/ultrareview --focus performance
/ultrareview --focus correctness
```

Focus hints bias the fleet composition. `--focus security` expands the security reviewer's effort and reduces the architecture reviewer's. The Adversarial Verifier always runs at full effort regardless of focus.

### With Effort Level

```
/ultrareview --effort high
/ultrareview --effort max
```

Effort scales the depth of each individual agent, not the number of agents. At `--effort max`, each agent uses extended thinking and reads a broader set of context files. Cost scales significantly — use `max` only for security-critical or architecture-defining changes.

### With Full File Context

```
/ultrareview --full-files
```

By default agents see only the changed lines plus surrounding context. `--full-files` gives agents the complete content of every changed file. Use this when the diff is small but the behavior depends heavily on the file's full structure (e.g., a class where one method change affects invariants throughout).

### Invoking from the CLI

```bash
claude --ultrareview 847
claude --ultrareview --focus security --effort high
```

CLI invocation is equivalent to the slash command. Useful for scripting Ultrareview into CI pipelines or pre-merge hooks.

---

## Pricing

Ultrareview is priced per run, not per token. The token cost is still incurred (and reflected in your seat billing or API usage), but the per-run charge covers the fleet orchestration infrastructure.

### Pricing Tiers (as of April 2026 public preview)

| Tier | Cost | Notes |
|---|---|---|
| First 3 runs | Free | Per account, resets never — one-time preview allocation |
| Standard run | $5 | Default effort, diffs up to ~500 lines changed |
| Large run | $10 | Diffs 500–2000 lines changed, or `--effort high` |
| Max run | $20 | `--effort max`, or diffs over 2000 lines changed |

The run is priced at the tier that matches your invocation *before* you confirm. You'll see a cost confirmation prompt before the fleet spawns:

```
Ultrareview: Large run — estimated $10
Diff: 847 lines changed across 23 files
Fleet: 6 agents + adversarial verifier
Proceed? [y/N]
```

Type `y` to proceed. If you decline, no charge is incurred.

### What the Free Runs Are Good For

Use your three free runs on your most complex or security-sensitive recent changes. Don't waste them on small PRs — `/code-review` covers those well at zero incremental cost. Save free runs for:

- Auth system changes
- Database migration PRs
- Billing / payment code
- First major feature on an unfamiliar codebase
- PRs that other reviewers have flagged concerns about but without specifics

### Cost vs. Engineering Time

A mid-level engineer's review hour costs $75–150 fully loaded. A $10 Ultrareview run that catches one blocking bug before it hits production is a 10x return on a single incident. The calculus shifts on small PRs where `/code-review` is sufficient — don't spend $5 to review a one-line config change.

---

## `/ultrareview` vs. `/code-review`

Understanding when to use each is the most important practical decision.

| Dimension | `/code-review` | `/ultrareview` |
|---|---|---|
| **Agents** | Single reviewer | Fleet of 5–7 specialists |
| **Cost** | $0 (token cost only) | $5–20 per run |
| **Time** | 15–30 seconds | 90–180 seconds |
| **False positive rate** | Moderate | Low (adversarial verification) |
| **Security depth** | Good | Thorough — dedicated agent + verifier |
| **Cross-file analysis** | Limited | Full — agents can read adjacent files |
| **Best for** | Day-to-day review, small PRs | High-stakes PRs, security review, complex changes |
| **Effort levels** | `low` / `medium` / `high` / `max` | `default` / `high` / `max` |
| **GitHub PR integration** | Manual diff paste | Native via PR number |

**Use `/code-review` when:**
- The PR is small and well-scoped (< 200 lines changed)
- You've already done a self-review and want a quick second pass
- You're reviewing non-critical application code on a tight timeline
- You want to iterate rapidly through a feature with frequent reviews

**Use `/ultrareview` when:**
- The change is security-sensitive (auth, payments, data access, secrets)
- The PR is large and touches multiple subsystems
- You're about to merge into main on a production system
- Another reviewer flagged something but couldn't articulate it precisely
- You want a written record of a thorough review (Ultrareview's output is artifact-quality)
- The codebase is unfamiliar and you don't trust your own review depth

There's no shame in running `/code-review` first and upgrading to `/ultrareview` when it surfaces something ambiguous. The cost of a `code-review` is near-zero, so use it freely; use Ultrareview deliberately.

---

## Reading the Output

Ultrareview produces a structured report. Understanding the format lets you triage faster.

### Report Structure

```
## Ultrareview Report
PR #847 · 23 files · 847 lines changed
Fleet: Security, Correctness, Performance, Architecture, Tests, Adversarial Verifier
Runtime: 142 seconds

---

### Critical Findings (must fix before merge)

🔴 [SECURITY] SQL injection in user search endpoint
Agent: Security Reviewer · Verified: Adversarial Verifier ✓
File: api/search.py:34
...

---

### Important Findings (should fix before merge)

🟠 [CORRECTNESS] Race condition in concurrent payment processing
Agent: Correctness Reviewer · Verified: Adversarial Verifier ✓
File: billing/processor.py:112
...

---

### Suggestions (worth discussing)

🟡 [ARCHITECTURE] Payment handler violates single-responsibility
Agent: Architecture Reviewer · Disputed: Adversarial Verifier — low confidence
...

---

### Dismissed Findings

ℹ️ 3 findings from specialist agents were dismissed by the Adversarial Verifier as false positives. See appendix.

---

### Summary
Critical: 1 · Important: 3 · Suggestions: 5 · Dismissed: 3
Recommendation: Request changes — critical finding must be resolved.
```

### The Verification Badge

Every finding carries a verification status from the Adversarial Verifier:

- **Verified ✓** — the Adversarial Verifier confirmed the finding is real and correctly described
- **Escalated ↑** — the Adversarial Verifier found the finding understated; severity may be raised
- **Disputed —** — the Adversarial Verifier disagrees; the finding is included but flagged as uncertain
- **Dismissed ✗** — the Adversarial Verifier concluded the finding is a false positive; moved to appendix

Don't skip Disputed findings. They're included because the Adversarial Verifier couldn't confidently dismiss them — meaning they're worth a human eye even if the original agent overstated the risk.

### The Dismissed Appendix

Always read the dismissed findings appendix, especially on security-sensitive PRs. The Adversarial Verifier is good but not infallible. A dismissed security finding that turns out to be real is worse than a false positive you briefly considered and rejected.

The appendix format:

```
### Appendix: Dismissed Findings

[Security Reviewer] Potential SSRF via user-supplied URL
Dismissed: The URL is validated against an allowlist on line 12; the finding assumes
no validation exists. Confirmed safe by Adversarial Verifier.

[Performance Reviewer] O(n²) sort in user listing
Dismissed: Input size is capped at 50 by the pagination limit on line 8.
Actual complexity is O(50 log 50) = effectively constant.
```

These dismissals are explanatory, not just yes/no. If the reasoning looks wrong, trust your judgment over the Adversarial Verifier.

### Agent Attribution

Every finding names the agent that raised it. This matters for two reasons:

1. **Calibration**: Some agents are more conservative than others. If you've seen the Performance Reviewer flag false positives on your codebase before, apply that prior.
2. **Asking follow-up questions**: You can reference the finding and ask Claude to dig deeper — "Expand on the race condition finding at billing/processor.py:112" — and it will pick up where the Correctness Reviewer left off.

---

## Practical Tips

### Tip 1: Review the dismissed findings before approving

The most actionable habit: before clicking approve, spend 60 seconds reading the dismissed findings appendix. You're looking for any case where the Adversarial Verifier's reasoning assumes something that isn't true of your specific codebase. It happens.

### Tip 2: Use `--focus security` on any PR that touches auth or payments

Even if you're confident in the change, the security-focused fleet composition catches things that broader reviews miss. The dedicated security agent reads the entire auth flow, not just the diff — it understands whether a change to a middleware function affects every authenticated route or just the one it's adjacent to.

```bash
claude --ultrareview 312 --focus security
```

### Tip 3: Don't ultrareview every PR — set a threshold

Teams that get the most value from Ultrareview define a threshold: any PR over X lines changed, or any PR touching Y directories, automatically goes through Ultrareview. Below that threshold, `/code-review` runs. Example threshold:

```
Ultrareview if:
  - diff > 300 lines changed, OR
  - any file in auth/, billing/, api/admin/ touched, OR
  - schema migration included
```

Document this in your `CLAUDE.md` so Claude Code applies it automatically during review.

### Tip 4: Run ultrareview on your own PRs before requesting human review

A common workflow: write the code, run `/code-review` for quick iteration, fix the obvious issues, then run `/ultrareview` before requesting a human reviewer. The human reviewer then sees a PR that's already been through adversarial analysis — their review can focus on design decisions and context rather than catching obvious bugs.

### Tip 5: Pipe the output to a file for async review

Ultrareview runs for 90–180 seconds. You don't need to watch it:

```bash
claude --ultrareview 847 > ultrareview-847.md
```

Then open the file when you're ready. The report is self-contained and doesn't require interactive follow-up unless you want to dig deeper.

### Tip 6: Use `--full-files` for class or module rewrites

When a PR restructures a class but the diff only shows changed methods, the agents can miss invariants that the unchanged methods assume. `--full-files` gives the fleet the full picture:

```bash
claude --ultrareview 512 --full-files --focus correctness
```

Costs more (more tokens per agent), but on a class-level refactor it's worth it.

### Tip 7: Ultrareview the PR, not the commit

Point Ultrareview at the full PR diff, not a single commit. Single-commit reviews miss the cumulative effect of multiple commits — a security fix in commit 2 that's partially reversed in commit 4, for example. The PR-level diff is always the right scope.

### Tip 8: If the Adversarial Verifier escalates a finding, treat it as critical

Escalations (↑) happen when the Adversarial Verifier thinks an original agent understated a finding. These are rare — under 5% of findings — but they're the cases most likely to be genuinely serious. An escalated finding means two agents independently agreed the risk is higher than initially flagged. Treat escalations with the same urgency as a 🔴 Critical, regardless of what severity the original agent assigned.

---

## Known Gotchas

### Context window limits on very large PRs

PRs over ~5000 lines changed can exceed the context that agents can read coherently. Ultrareview will warn you before running if the diff is near this limit. Options: split the PR, use `--focus` to narrow the agent scope, or accept that some cross-file analysis will be incomplete.

### Agent disagreement isn't a bug

Occasionally the Correctness Reviewer and the Architecture Reviewer will have contradictory recommendations — the correctness fix involves a pattern the architecture agent flags as inconsistent with the codebase. This is expected. The Adversarial Verifier notes the contradiction but doesn't always resolve it — that's a judgment call for you. Look for the contradiction explicitly in findings that are Disputed.

### The free tier doesn't carry over

Your three free Ultrareview runs are allocated at account creation and don't reset. If you're on a team, each team member gets their own allocation — they don't pool. A solo developer gets three free runs; a team of 10 gets 30 (10 × 3).

### `--effort max` on a large PR is expensive

A max-effort run on a 2000-line PR can cost $20 and take 4–6 minutes. The cost confirmation prompt will show you this before you commit. Don't use `--effort max` for routine review — reserve it for code that will touch production security boundaries.

### Ultrareview doesn't replace human review for architecture decisions

The Architecture Reviewer agent is strong on pattern consistency and coupling analysis, but it doesn't know your team's product strategy, your technical debt tolerance, or the constraints on your deployment model. Use Ultrareview findings as inputs to human architecture review, not as a replacement for it.

### The report is scoped to the diff, not the system

Ultrareview reviews the diff in context but it can't know about bugs in adjacent systems that your change will interact with. A change that's correct in isolation but breaks an assumption in an external service won't be caught. That's a system-level concern that requires human domain knowledge.

---

## Example End-to-End Workflow

**Scenario:** You've written a payment webhook handler for Stripe. The PR is 340 lines changed across 8 files. Before requesting review, you run Ultrareview.

```bash
# Create the PR first so you have a PR number
gh pr create --title "Add Stripe webhook handler" --draft

# Get the PR number
gh pr list --state open | head -5
# Output: 923  Add Stripe webhook handler  feat/stripe-webhooks

# Run ultrareview with security focus
claude --ultrareview 923 --focus security
```

Output prompt:
```
Ultrareview: Large run — estimated $10
Diff: 340 lines changed across 8 files
Fleet: Security (expanded), Correctness, Performance, Architecture, Tests, Adversarial Verifier
Focus: Security
Proceed? [y/N]
```

You type `y`. 147 seconds later:

```
## Ultrareview Report — PR #923
...

### Critical Findings

🔴 [SECURITY] Webhook signature not verified before processing payload
Agent: Security Reviewer · Verified: Adversarial Verifier ✓
File: webhooks/stripe.py:18
Issue: The handler processes the event payload without first verifying the
Stripe-Signature header. Any caller can send fake webhook events.
Fix:
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
  )
  # Raises stripe.error.SignatureVerificationError if invalid

🔴 [SECURITY] Replay attack possible — no timestamp validation
Agent: Security Reviewer · Escalated: Adversarial Verifier ↑
File: webhooks/stripe.py:18
Issue: Even with signature verification added, the timestamp in the Stripe-Signature
header must be validated to prevent replayed requests. Stripe recommends rejecting
events older than 300 seconds.
Fix:
  # stripe.Webhook.construct_event validates timestamp if you pass tolerance parameter
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET,
      tolerance=300
  )
```

Two critical findings caught before human review. You fix both, push, mark the PR ready for review, and note in the PR description that Ultrareview was run and findings addressed. Your reviewer spends their time on the business logic, not the security fundamentals.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
