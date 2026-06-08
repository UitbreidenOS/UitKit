---
description: Review outdated or bloated snapshots and decide update vs. rewrite
argument-hint: "[snapshot file, test file, or directory]"
---
Review snapshots in: $ARGUMENTS

Steps:

1. Locate snapshot files. Common locations:
   - Jest: `__snapshots__/*.snap` adjacent to test files
   - Vitest: same pattern as Jest
   - Storybook: `*.stories.snap`
   - If the argument points to a test file, find its associated `.snap` file.

2. For each snapshot in scope, evaluate:

   **Size**
   - Count serialized lines. Flag any snapshot exceeding 50 lines as a candidate for replacement.
   - Large snapshots often obscure the real assertion — the intent is buried.

   **Stability**
   - Identify content that will change on every run: timestamps, generated IDs, memory addresses, random values, build hashes.
   - These make snapshots unreliable and should be masked or replaced.

   **Specificity**
   - Determine what the test is actually trying to verify. If a snapshot captures an entire rendered component but the test is named "renders the submit button", the snapshot is over-specified.

   **Duplication**
   - Flag snapshots across multiple tests that capture the same subtree with minor variation — they may be collapsible.

3. For each flagged snapshot, recommend one of:
   - **Update** — the snapshot is correct in structure but stale; run `--updateSnapshot`
   - **Replace** — swap the snapshot for targeted property assertions (show the replacement)
   - **Mask** — keep the snapshot but add serializer transforms or `expect.any()` to neutralize volatile values
   - **Delete** — the snapshot duplicates another test or provides no signal; remove it

4. Apply replacements and deletions that are unambiguous. Do not update stale snapshots automatically — flag them for the user to confirm with `--updateSnapshot`.

5. For each replacement, show:
   - The original snapshot (truncated if >10 lines)
   - The new assertion(s) that replace it
   - Why this is more maintainable

6. End with a summary: X snapshots reviewed, Y updated, Z replaced with assertions, W deleted, V flagged for manual review.
