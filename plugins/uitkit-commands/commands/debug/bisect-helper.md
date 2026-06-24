---
description: Run a structured git bisect to find the commit that introduced a regression
argument-hint: "[failing test, command, or behavior description]"
---
Find the commit that introduced this regression: $ARGUMENTS

You are running a binary search over git history. Be methodical.

1. **Establish the test oracle** — before touching git, define exactly how to determine good vs bad:
   - Prefer a single command that exits 0 on good and non-zero on bad
   - Examples: `pytest tests/test_foo.py::test_bar`, `cargo test`, `node test.js`, `./check.sh`
   - If the regression is visual or behavioral (not a test), write a script that checks the observable symptom
   - The oracle must be fast (< 30s ideally) and deterministic

2. **Identify the known-good and known-bad commits**
   - Known-bad: usually HEAD or the first commit where the regression was noticed
   - Known-good: a commit or tag where the behavior was correct (recent release tag, last deploy, etc.)
   - Confirm both by running the oracle against each before starting bisect

3. **Run the bisect**
   ```
   git bisect start
   git bisect bad <bad-commit>
   git bisect good <good-commit>
   ```
   Then for each checkout, run the oracle and mark:
   ```
   git bisect good   # if oracle passes
   git bisect bad    # if oracle fails
   ```
   Or automate it: `git bisect run <oracle-command>`

4. **Interpret the result** — when bisect finishes, git points to the first bad commit. Read:
   - The commit message and diff (`git show <sha>`)
   - The specific lines changed that relate to the failing oracle
   - The author and any linked issue/PR for context

5. **Confirm the finding** — check out the commit just before the bad one, run the oracle,
   confirm it passes. Check out the bad commit, confirm it fails. This rules out a flaky oracle.

6. **Clean up**
   ```
   git bisect reset
   ```

7. **Report** — summarize:
   - The offending commit SHA and message
   - The specific diff hunk that introduced the regression
   - Whether the change was intentional (the fix is a revert or a follow-up patch)

If the test suite doesn't exist yet, step 1 is to write the oracle first, then proceed.
Do not skip the confirmation step — a wrong bisect result wastes more time than it saves.
