---
name: "bisect-bug"
description: "Claude Code time-travel debugger (git bisect integration): workflow guidelines, best practices, instructions, and integration examples"
---

# Time-Travel Debugger (Git Bisect Integration)

## When to activate
Activate when the user reports a regression ("this used to work, but now it's broken") and they don't know which commit caused the issue. Invoked via `/bisect-bug`.

## When NOT to use
Do not use for newly written, uncommitted code. Do not use if the user already knows exactly where the bug is.

## Instructions
1. **Understand the Bug:** Ask the user exactly what the bug is and how to reproduce it (e.g., "Run `npm test src/auth.js` and it fails" or "Curling `/api/users` returns 500").
2. **Identify the Good Commit:** Ask the user for a commit hash or branch name where they are *certain* the feature was still working (the "good" commit).
3. **Write the Test Script:**
   - Create a file named `bisect-test.sh` in the project root.
   - Write a deterministic bash script that tests for the bug. 
   - **Crucial:** The script must exit with code `0` if the code is GOOD (no bug), and exit with code `1` (or anything between 1 and 127) if the code is BAD (bug present).
   - Make the script executable: `chmod +x bisect-test.sh`
4. **Execute the Bisect:**
   - Use the `Bash` tool to run the following sequence:
     ```bash
     git bisect start
     git bisect bad HEAD
     git bisect good <GOOD_COMMIT_HASH>
     git bisect run ./bisect-test.sh
     ```
5. **Analyze the Result:** 
   - Git will autonomously jump through history, running your script, until it finds the exact offending commit.
   - Once it finishes, read the git output to identify the commit hash and author.
   - Run `git bisect reset` to return the user's branch to normal.
   - Read the offending commit's diff (`git show <OFFENDING_COMMIT>`).
6. **Provide the Fix:** Present the offending commit to the user, explain exactly *why* that specific change broke the code, and propose the fix. Delete `bisect-test.sh`.

## Example
User: `/bisect-bug The login endpoint is returning 500. It was definitely working in commit a1b2c3d.`
Claude: [Writes a `curl` script that exits 1 on HTTP 500]. 
[Runs `git bisect` autonomously in the bash terminal].
I found it! The bug was introduced 12 commits ago by Jane Doe in commit `f9e8d7c`. They removed the `await` keyword before the database call. I have reset your git tree. Shall I fix the missing `await`?