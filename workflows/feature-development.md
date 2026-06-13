# Feature Development Workflow

End-to-end workflow for taking a feature from idea to merged PR using Claude Code.

---

## When to use this workflow
- Building a new feature that touches more than one file
- Implementing a spec or ticket that needs breaking down before coding
- Any feature where you want a structured, reviewable process

---

## Step 1 — Define and validate scope

Before writing code, establish exactly what you're building.

**Prompt Claude:**
```
I need to build: [describe the feature in one paragraph]

Read the relevant files first:
- [list key files: routes, models, services]
- CLAUDE.md and CONTEXT.md if present

Then tell me:
1. What files will need to change?
2. What new files will be created?
3. What are the edge cases I should handle?
4. What decisions do I need to make before we start?
5. Are there any risks or dependencies I'm missing?

Do not write code yet.
```

**What to look for in the response:**
- Files you hadn't considered
- Edge cases that would cause bugs if missed
- Decisions that should go in CLAUDE.md once made

---

## Step 2 — Plan the implementation

Once scope is clear, get a sequenced plan.

**Prompt Claude:**
```
Based on the scope we just defined, create a numbered implementation plan.

Each step must be:
- A concrete, bounded action (not "implement auth" — "add JWT validation middleware to src/middleware/auth.ts")
- Completable in a single session
- Independently testable

Include which files change in each step. Note dependencies between steps.
```

Review the plan. If a step is too large, ask Claude to break it down further. Lock in the plan before touching code.

---

## Step 3 — Implement step by step

Execute one plan step at a time. Do not skip ahead.

**For each step:**
```
Implement step [N]: [paste the step description]

Rules:
- Only change what's needed for this step
- Write or update tests for this step's behavior
- Do not refactor code outside the scope of this step
- Tell me when this step is complete and what to verify
```

**After each step:**
- Run tests: confirm green before moving to the next step
- Review the diff yourself: is this what you intended?
- If a step reveals new complexity, update the plan before continuing

---

## Step 4 — Integration check

Once all steps are complete, verify the full feature works end-to-end.

**Prompt Claude:**
```
All implementation steps are complete. Now:

1. Run the full test suite — report any failures
2. Check that all edge cases from Step 1 are handled — list each one and confirm
3. Check for any TODOs or incomplete error handling introduced during implementation
4. Verify the feature works with [specific test scenario relevant to this feature]
```

Fix any issues found before proceeding.

---

## Step 5 — Self-review

Before creating a PR, review your own changes.

**Prompt Claude:**
```
Review the changes on this branch against main.

Focus on:
1. CRITICAL issues (bugs, security, data loss risks)
2. Missing tests for changed behavior
3. Convention violations vs this project's CLAUDE.md
4. Anything that would confuse a reader in 6 months

Format: CRITICAL / SUGGESTED / NITPICK
```

Fix all CRITICAL issues. Use judgment on SUGGESTED items.

---

## Step 6 — PR description

**Prompt Claude:**
```
Write a PR description for these changes.

Include:
- What this PR does (one paragraph)
- Why it's needed (the problem it solves)
- How to test it (specific steps a reviewer can follow)
- Any decisions made and why (reference CLAUDE.md or ADRs if relevant)
- Screenshots or output if applicable

Do not include a list of files changed — the diff covers that.
```

---

## Checklist before merging

- [ ] All tests pass
- [ ] Self-review complete, no CRITICAL issues
- [ ] Edge cases from Step 1 are all handled
- [ ] PR description written
- [ ] CLAUDE.md updated if any new decisions were made
- [ ] CONTEXT.md updated if new domain terms were introduced

---
