# Debugging Session Workflow

Systematic workflow for diagnosing and fixing bugs with Claude Code — without chasing symptoms.

---

## When to use this workflow
- A bug that isn't immediately obvious from reading the code
- A failing test where the cause isn't clear
- Production error you can't reproduce locally
- Intermittent failures

---

## Step 1 — Build a feedback loop first

Before investigating, create a way to reliably reproduce the bug. Do not skip this.

**Prompt Claude:**
```
I have a bug: [describe the symptom exactly — error message, unexpected behavior, what you expected]

Before we investigate, help me build a reliable way to reproduce it.

Options to consider:
- A failing test that captures the bug
- A curl command or script that triggers it
- A minimal code snippet that demonstrates it
- Steps to reproduce via the UI

Which is most appropriate here, and write it now.
```

**Do not proceed until you have a reliable reproduction.** Debugging without a reproduction is guessing.

---

## Step 2 — Isolate the blast radius

Understand where the bug can possibly live before reading any code.

**Prompt Claude:**
```
Here is the reproduction: [paste the reproduction from Step 1]

Without looking at code yet, answer:
1. What is the earliest point in the call stack where this could go wrong?
2. What external systems are involved (DB, cache, third-party API, queue)?
3. What changed recently that could have introduced this? (check git log)
4. What is the smallest unit of code that, if wrong, would cause this symptom?

List the files most likely to contain the bug, ranked by probability.
```

---

## Step 3 — Generate hypotheses

**Prompt Claude:**
```
Based on the reproduction and the candidate files, generate 3–5 falsifiable hypotheses.

For each hypothesis:
- State it as a specific claim: "The bug occurs because [X] when [Y]"
- Describe how to test it: what would we observe if this hypothesis is true?
- Describe how to disprove it: what would we observe if it's false?

Do not start testing yet. List all hypotheses first.
```

Review the hypotheses. Add any you thought of that Claude missed. Rank them by probability.

---

## Step 4 — Test hypotheses, highest probability first

**For each hypothesis:**
```
Test hypothesis [N]: "[paste the hypothesis]"

Add the minimal instrumentation needed to confirm or rule this out:
- A log statement at the right point
- A debug assertion
- A targeted test with a specific input

Do not add instrumentation for other hypotheses yet.
```

After each test:
- If confirmed: move to Step 5
- If ruled out: move to the next hypothesis
- If inconclusive: refine the hypothesis and re-test

---

## Step 5 — Fix and verify

Once the root cause is confirmed:

**Prompt Claude:**
```
Root cause confirmed: [describe what you found]

Now:
1. Apply the minimal fix — change only what's needed to fix this specific bug
2. Do not refactor surrounding code
3. Update the reproduction from Step 1 to be a regression test
4. Run the full test suite — confirm nothing else broke

Explain in one sentence why this fix works.
```

---

## Step 6 — Post-mortem (for serious bugs)

For bugs that caused user impact, data loss, or took more than 2 hours to find:

**Prompt Claude:**
```
Write a brief post-mortem for this bug:

1. What was the bug? (one sentence)
2. What was the root cause?
3. How long did it take to find and why?
4. What would have caught this earlier? (missing test, missing monitoring, code review gap)
5. What should we add/change to prevent this class of bug?

Keep it under 200 words. No blame, no fluff.
```

---

## Anti-patterns to avoid

- **Fixing the symptom, not the cause** — if you don't understand why, you haven't fixed it
- **Changing multiple things at once** — you won't know which change fixed it
- **Debugging without a reproduction** — you're guessing
- **Adding instrumentation everywhere** — target specific hypotheses
- **Skipping the regression test** — the bug will come back

---
