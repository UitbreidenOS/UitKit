# Ghost in the Machine (Shadow PRs)

## Purpose
A background routine that monitors your recent local edits and generates a "Shadow PR"—a hyper-refactored, perfectly documented, and test-backed version of your current work. It acts as a silent Staff Engineer mentor.

## When to run
Run as a background agent every 15-30 minutes during active development, or when invoked via `/shadow-pr`.

## Instructions
1. **Analyze Local Diff:** Use `git diff` to identify all files modified in the last 30 minutes that haven't been committed yet.
2. **The "Shadow" Implementation:** For every modified file:
   - Identify the core intent of the user's change.
   - Re-implement that same intent but apply "Staff Level" standards:
     - Apply strict SOLID principles.
     - Add missing error handling.
     - Add JSDoc/Docstrings for all new functions.
     - Generate a corresponding unit test file.
3. **Save to Shadow Folder:** Write these perfected files into a temporary `.claude/shadow-pr/` directory, maintaining the original file structure.
4. **The Comparison:** Create a `SHADOW_REVIEW.md` in that folder that explains:
   - "What you wrote" vs "What I proposed."
   - Why the refactored version is superior (e.g., "Extracted the database logic to a service to improve testability").
5. **Notification:** Quietly inform the user: "Staff Review complete. I've generated an 'ideal' version of your recent changes in `.claude/shadow-pr/` for your inspiration."

## Example
User: [Edits auth.js to add a basic login check]
Ghost: [Background] "I see your login logic. I've created a shadow version in `.claude/shadow-pr/auth.js` that adds rate limiting, Argon2 hashing, and 100% test coverage. Check `SHADOW_REVIEW.md` to see the architectural improvements."
