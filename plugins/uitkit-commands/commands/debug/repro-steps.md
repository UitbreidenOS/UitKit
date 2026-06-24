---
description: Generate a minimal reproduction case from a bug description or failing test
argument-hint: "[bug description or test name]"
---
Given: $ARGUMENTS

Your task is to produce a minimal, self-contained reproduction case for this bug.

Steps:

1. Identify the failure surface — is this a unit, integration, or runtime failure? What layer owns it?

2. Strip the reproduction to its smallest form:
   - Remove all unrelated setup, fixtures, and data
   - Eliminate network/filesystem calls where possible — mock or stub them
   - The repro must fail deterministically, not flakily

3. State the exact environment conditions required:
   - Runtime version, OS constraints if relevant
   - Required env vars or config values
   - Any seed data or preconditions

4. Write the repro as runnable code (test or script). Include:
   - Imports and setup
   - The minimal call sequence that triggers the bug
   - An assertion or error print that clearly marks failure

5. Add a comment block at the top:
   ```
   // BUG: <one-line description>
   // EXPECTED: <what should happen>
   // ACTUAL: <what actually happens>
   // SCOPE: <smallest known unit that reproduces it>
   ```

6. If the bug is non-deterministic, document the observed frequency and any conditions
   that increase reproducibility (e.g., concurrency level, data size, timing).

7. Verify the repro actually fails before presenting it. If you can run it, do so.

Output: the repro file contents ready to paste into a new file, followed by a one-sentence
summary of the root failure mechanism if you can identify it from the repro alone.
