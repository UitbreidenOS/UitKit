# Incremental Build with Confirmation Gates

Builds a feature step-by-step with mandatory human review between each phase. Claude commits to phase boundaries before starting and cannot expand scope mid-phase. Prevents scope creep, catches integration problems early, and keeps humans in control of the build direction.

---

## When to use

- Building any feature that touches more than three files or two subsystems
- High-stakes features where partial completion is worse than no completion (auth, billing, migrations)
- Collaborative builds where a non-engineer stakeholder needs to review each increment
- Any task where you've previously watched Claude build something correct but not what you wanted

---

## Phases

### Phase 0 — Phase definition (mandatory first step)

Before any code is written, Claude defines the complete phase plan. This is the contract.

```
I want to build: [describe the feature]

Before writing any code, produce a phase plan.

For each phase:
  - Phase name (e.g., "Phase 1: Data model")
  - Scope: exactly what will be created or changed (file names, not descriptions)
  - Output: what the user will see or be able to verify at the end of this phase
  - Success criteria: how we know this phase is done correctly (test command, manual check, etc.)
  - Rollback plan: how to undo this phase if we reject it (drop table, delete files, revert commit)
  - Explicit scope boundary: what is NOT included in this phase

Rules for the phase plan:
  - No phase should touch more than 5 files
  - Each phase must be independently reviewable without requiring the next phase
  - Phase boundaries must be at natural seams (data model, API, UI — not "half the API")
  - No phase may contain "and also" — if you're tempted to add scope, make it a new phase

Present the phase plan. Do not start coding until I approve it.
```

The user reviews and approves, rejects, or restructures the phase plan before any work begins. This is the only time to reshape scope.

---

### Phase 1–N — Execution pattern

Each phase follows the same structure. Replace `[N]` and `[phase name]` accordingly.

**Start of phase:**
```
Begin Phase [N]: [phase name].

Scope reminder: [paste the scope from the approved plan]
Scope boundary: [paste what is NOT included]

Implement only what is in scope. If you encounter something that seems necessary but is outside scope, STOP and tell me — do not add it unilaterally. I will decide whether to expand this phase or add a Phase [N+1].
```

**During phase:**
- Claude writes code and runs tests only for this phase's scope
- If Claude discovers a scope dependency (Phase 2 requires a thing from Phase 3), it stops and flags it rather than jumping ahead
- No commits until the user reviews

**End of phase prompt:**
```
Phase [N] is complete. Before I review:

1. List every file you created or modified
2. Show the output I should verify (test results, server response, UI screenshot request, etc.)
3. Confirm the success criteria from the plan: [paste criteria]
4. Flag any deviations from the approved scope (even small ones)

Do not begin Phase [N+1] until I explicitly say "proceed".
```

**Gate decision:**

| Decision | Action |
|---|---|
| "Proceed" | Claude begins Phase N+1 using the same execution pattern |
| "Redo phase [N]" | Claude reverts to the state before Phase N started (using the rollback plan) and retries |
| "Modify scope" | Pause — user and Claude renegotiate Phase N+1 scope before proceeding |
| "Stop here" | Workflow ends; Claude documents what is complete and what remains |

---

### Final phase — Integration check

After all phases are approved individually, run an integration check.

```
All phases are complete. Run the integration check:

1. Run the full test suite (not just the new tests)
2. List any test failures, warnings, or type errors introduced by this build
3. Check that the rollback plans for each phase are still valid (haven't been invalidated by later phases)
4. Produce a one-paragraph summary of what was built and what the user can now do

Do not fix integration failures unilaterally — report them and wait for instruction.
```

---

## Anti-scope-creep rules

These rules apply to Claude throughout the workflow. Paste them into CLAUDE.md if you want them enforced project-wide:

```
During incremental builds:
- Never add code outside the current phase's scope, even if it seems obviously necessary
- Never "while I'm in this file" additional changes
- Never create files not listed in the approved phase plan
- If something is missing from the plan but required, STOP and report — do not add it silently
- Commits happen at phase boundaries, not mid-phase
```

---

## Example

Feature: "Add email notification when an order ships"

Phase plan (output of Phase 0):
- **Phase 1: Email template** — Create `emails/order-shipped.html` and `emails/order-shipped.txt`. Success: template renders with test data. Rollback: delete the two files.
- **Phase 2: Email service integration** — Add `sendOrderShippedEmail(orderId)` to `services/email.ts`. No UI, no triggers. Success: `npm run test:email` passes. Rollback: revert `services/email.ts`.
- **Phase 3: Trigger on shipment** — Wire the service call into `handlers/shipment.ts` when status changes to `shipped`. Success: end-to-end test passes. Rollback: revert `handlers/shipment.ts`.

User approves plan. Claude executes Phase 1. User reviews template, says "proceed". Claude executes Phase 2. During Phase 2, Claude notices the email service needs an API key that isn't in the config — it stops and flags this rather than adding the config key unilaterally. User adds the key, says "proceed". Phase 3 completes. Integration check passes.

---
