# Refactor Safely Workflow

How to refactor code with Claude Code without breaking behavior — using tests as a safety net throughout.

---

## When to use this workflow
- Extracting functions from a large method
- Renaming and reorganizing modules
- Replacing a pattern with a better one across multiple files
- Reducing duplication across the codebase
- Improving a module's structure without changing its external behavior

---

## The golden rule

**Never refactor and change behavior in the same commit.** A refactor preserves external behavior. If tests break, you either changed behavior or the tests were testing implementation details (also a problem).

---

## Step 1 — Establish a test baseline

Before changing anything, confirm you have adequate test coverage.

**Prompt Claude:**
```
I want to refactor: [describe what you're refactoring and why]

First, assess the current test coverage:
1. Read the relevant files: [list files]
2. What behaviors are currently tested?
3. What behaviors are NOT tested that could break during refactoring?
4. Write any missing tests now, before we touch production code

Do not change production code yet. Tests only.
```

**Commit the test additions before refactoring.** This makes it clear which tests existed before vs. were added as part of the refactor.

---

## Step 2 — Define the refactor scope

**Prompt Claude:**
```
Here is what I want to refactor: [describe the goal]

Read the relevant files: [list files]

Define the scope:
1. What will change structurally? (function signatures, file locations, module boundaries)
2. What will NOT change? (external behavior, API contracts, database schema)
3. What are the riskiest parts of this refactor?
4. What is the smallest first step that makes progress without risk?

Do not start the refactor yet.
```

---

## Step 3 — Refactor in small, testable increments

Break the refactor into steps small enough that tests can verify each one.

**For each increment:**
```
Refactor step [N]: [describe the specific structural change]

Rules:
- Change only what's needed for this step
- Do not change any behavior
- After this change, all existing tests must still pass
- Tell me what to verify after this step
```

**After each increment:**
```bash
# Run tests — must be green before next step
npm test  # or pytest, go test, etc.
```

If tests fail after a pure structural change: stop, understand why, fix before continuing. A failing test after a refactor means either the refactor changed behavior or the test was testing implementation (both are problems to fix now).

---

## Step 4 — Verify external behavior unchanged

After all increments:

**Prompt Claude:**
```
The refactor is structurally complete. Verify that external behavior is unchanged:

1. Run the full test suite
2. Check that all public APIs/interfaces are identical to before (same inputs, same outputs)
3. Check that database queries produce identical results
4. Check that error cases still produce the same errors
5. If there are integration tests or end-to-end tests, run them

Report any behavioral differences — even small ones.
```

---

## Step 5 — Clean up

**Prompt Claude:**
```
Before committing, clean up:

1. Remove any debugging code or temporary comments added during refactoring
2. Remove any dead code that the refactor made unreachable
3. Update any documentation or comments that referenced the old structure
4. Check that import paths are clean (no unused imports)

Do not introduce new logic in this step.
```

---

## Step 6 — Commit with a clear message

Structure the refactor commit(s) to tell a clear story:

```
refactor: extract payment processing into PaymentService

Moves payment logic out of OrderController into a dedicated service.
No behavior change — all existing tests pass.
Motivation: OrderController was 600 lines; this makes both units testable in isolation.
```

Never mix a refactor commit with a feature or bug fix commit. Keep them separate.

---

## Refactoring anti-patterns

- **"While I'm in here..."** — doing a refactor and a feature at the same time. Stop. Finish the refactor first.
- **Refactoring without tests** — you will break something and not know it
- **Big-bang refactor** — changing everything at once. Do it incrementally.
- **Renaming as the last step** — rename first (mechanical, low risk), then restructure
- **Skipping the baseline** — assuming tests are adequate without checking first

---
