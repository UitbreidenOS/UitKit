# RIPER — Structured Agentic Coding Framework

RIPER is a 5-phase framework for complex feature development: Research, Innovate, Plan, Execute, Review. Each phase has a strict mode, defined inputs and outputs, and an explicit boundary that cannot be crossed until the phase is complete.

---

## Why RIPER

Scope creep is the primary failure mode for agentic coding. Without explicit phase boundaries, Claude jumps from reading one file to proposing a full refactor to starting implementation — all in one message. The result looks like progress but produces code that doesn't match requirements, contains unreviewed architectural decisions, and is hard to course-correct because the reasoning happened implicitly.

RIPER forces explicit phase declarations. Each phase has exactly one job. Violating a phase boundary is a protocol error — not a style preference.

---

## Mode Declaration

Every phase begins with an explicit mode declaration:

```
I am now in RESEARCH mode.
```

This declaration is not ceremonial. It is a commitment: in this mode, I do exactly what this phase requires and nothing else. Mode declarations make phase transitions visible in the conversation and force the question "am I actually done with the previous phase?"

---

## Phase 1: Research

**One job:** gather context. No solutions, no proposals, no opinions.

### What to gather

- Codebase structure: relevant files, existing patterns, entry points
- Constraints: existing interfaces that must be preserved, performance requirements, security boundaries
- Dependencies: what this feature depends on; what depends on it
- Prior art: similar features already built; patterns used elsewhere in the codebase

### Output

A **context summary document** containing:
- List of relevant files with one-line descriptions
- Key patterns in use (naming conventions, error handling, data flow)
- Constraints identified
- Open questions (things that cannot be answered from the codebase alone)

### Anti-pattern

Proposing solutions during Research. The moment a thought begins with "we could..." or "the best approach would be...", Research mode has been broken. Log the thought as an open question and continue gathering.

**Wrong:**
```
I see the payment module uses Stripe. We could add a webhook handler at /api/webhooks/stripe
that validates the signature and routes events to the appropriate handler.
```

**Right:**
```
Payment module location: src/payments/
Stripe SDK present: yes (package.json line 23)
Existing webhook infrastructure: none found
Open question: where does the codebase register API routes?
```

---

## Phase 2: Innovate

**One job:** generate options. No implementation, no deep commitment to one approach.

### Format

A numbered list of approaches, each with:
- One-sentence description
- Key trade-offs (2–3 bullet points)
- Rough complexity estimate

```markdown
## Options

**1. Webhook handler as a dedicated route**
Single endpoint that receives Stripe events, validates signature, and dispatches to handlers.
- Pro: simple to implement, follows existing route patterns
- Con: all event types share one endpoint — grows complex over time
- Complexity: low

**2. Event bus with typed handlers**
Webhook endpoint publishes to an internal bus; each event type has a registered handler.
- Pro: separation of concerns, easy to add new event types
- Con: over-engineered for <5 event types
- Complexity: medium

**3. Queue-based processing**
Webhook endpoint enqueues raw event; worker processes asynchronously.
- Pro: decoupled, survives downstream failures
- Con: adds operational complexity (queue infrastructure required)
- Complexity: high
```

### Output

An **options document** with all viable approaches listed.

### Anti-pattern

Going too deep on one option during Innovate. If one approach is getting a full implementation sketch, Innovate mode has broken into Plan mode prematurely. List the option at the trade-off level and move on.

---

## Phase 3: Plan

**One job:** select one option and produce a numbered checklist of actions.

### Output

A **numbered plan** where every item is an action, not a description. Each step should be executable in isolation.

```markdown
## Plan: Webhook handler as a dedicated route

**Selected from:** Innovate options, option 1
**Rationale:** Matches existing route patterns; event volume does not justify a bus.

1. Add `StripeWebhookPayload` type to `src/types/payments.ts`
2. Create `src/payments/webhook-handler.ts` — validates Stripe signature, parses event type
3. Add route `POST /api/webhooks/stripe` in `src/api/routes/payments.ts`
4. Register route in `src/api/router.ts`
5. Add `STRIPE_WEBHOOK_SECRET` to env schema in `src/config/env.ts`
6. Write unit tests for signature validation in `tests/payments/webhook-handler.test.ts`
7. Write integration test for route registration in `tests/api/routes/payments.test.ts`
```

Every step is specific enough that another engineer could execute it without asking questions.

### Gate

The plan must be reviewed before Execute begins. This is the last point to catch scope issues, missing steps, or architecture problems without paying implementation cost. Claude reviews it; a human reviews it for high-stakes changes.

### Anti-pattern

Writing plan steps as descriptions instead of actions.

**Wrong (description):** "The webhook handler should validate the Stripe signature"  
**Right (action):** "Create `src/payments/webhook-handler.ts` with a `validateSignature(payload, secret)` function using Stripe's `constructEvent` method"

---

## Phase 4: Execute

**One job:** implement the plan exactly as written. Check off each step.

### The blocker protocol

The most important rule in Execute: if you encounter something unexpected that the plan does not account for, **stop immediately**.

Do not improvise. Do not make architectural decisions on the fly. Do not "just add one more thing."

The blocker protocol:
1. Stop executing
2. Note the blocker: what was found, why it blocks the current step
3. Return to Plan mode
4. Update the plan to account for the blocker
5. Resume Execute from the last completed step

```
[BLOCKER — returning to PLAN mode]
Found: `src/api/router.ts` uses a different route registration pattern than documented.
Routes are registered via a decorator, not a direct call.
Plan step 4 needs to be revised to match the decorator pattern.
```

### Step tracking

Mark each step as it completes:

```markdown
1. [x] Add `StripeWebhookPayload` type to `src/types/payments.ts`
2. [x] Create `src/payments/webhook-handler.ts`
3. [x] Add route `POST /api/webhooks/stripe`
4. [ ] Register route in `src/api/router.ts`   ← current step
```

### Anti-pattern

Improvising during Execute. Any change not in the plan — even a "small improvement" — is a scope change. Log it as a future task and keep executing the plan as written. Deviating from the plan breaks the guarantee that Execute produces exactly what Plan designed.

---

## Phase 5: Review

**One job:** compare the implementation against the plan and original requirements. Produce a deviation report.

### What to check

- Every plan step: implemented as specified? (check each `[x]`)
- Every acceptance criterion from Research: does the implementation satisfy it?
- Non-functional requirements: performance, security, error handling — are they present?
- Tests: do tests actually test the behavior described in requirements?

### Output

A **deviation report + requirements pass/fail**:

```markdown
## Review Report

### Plan completion
- Steps 1–6: complete as specified
- Step 7 (integration test): MISSING — not implemented

### Requirements pass/fail
- [x] Webhook receives and parses Stripe events
- [x] Invalid signatures return 400
- [ ] FAIL: Webhook does not handle `payment_intent.payment_failed` event — not in plan but present in requirements

### Deviations from plan
- Step 3: route registered at `/api/webhooks/stripe-v2` not `/api/webhooks/stripe` — naming inconsistency

### Recommended actions
1. Add integration test (step 7)
2. Add handler for `payment_intent.payment_failed` — return to Plan
3. Align route path with plan or update plan to reflect actual path
```

### What to do if deviations are found

Minor deviations (typos, naming): fix in place, note in deviation report.  
Missing steps: return to Execute for the specific missing item.  
Requirement failures: return to Plan — this is a scope issue that needs a plan update before re-executing.  
Architecture deviations: escalate. This is a signal that Execute improvised — determine what changed and whether it is acceptable.

---

## Anti-Patterns Table

| Phase | Anti-pattern | Consequence |
|-------|-------------|-------------|
| Research | Proposing solutions | Skips option evaluation; anchors on first idea |
| Research | Incomplete context gathering | Plan is built on wrong assumptions |
| Innovate | Committing to one option too early | Misses better approaches |
| Innovate | Skipping trade-off analysis | Options look equivalent; choice is arbitrary |
| Plan | Descriptive steps instead of actions | Execute becomes ambiguous; blocker rate increases |
| Plan | Skipping gate review | Architectural problems discovered during Execute |
| Execute | Improvising | Plan no longer matches implementation; Review has nothing to compare against |
| Execute | Continuing past a blocker | Plan becomes invalid; downstream steps may be wrong |
| Review | Skipping | Deviations go undetected; requirements failures ship |
| Review | Soft-pedalling findings | "Minor" deviations compound across features |

---

## When to use RIPER vs just coding

**Use RIPER for:**
- Features taking more than 3 days
- High-stakes changes (auth, payments, data migrations, public APIs)
- Unfamiliar codebases where architectural assumptions are unverified
- Work where incorrect implementation is expensive to fix post-deployment

**Skip RIPER for:**
- Hotfixes and incident response (go straight to Fix + Review)
- Tasks under 2 hours with a clear implementation path
- Additive changes with no architectural decisions (adding a config flag, updating a dependency)
- Work where all five phases would take longer than just coding it

RIPER has overhead. The overhead pays for itself on complex work; it does not pay for itself on small work. The rule of thumb: if you can hold the full implementation in your head without writing it down, RIPER is overkill.

---
