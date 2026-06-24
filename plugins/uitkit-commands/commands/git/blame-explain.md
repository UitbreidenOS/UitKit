---
description: Explain the history and intent behind a file or specific lines using git blame and log
argument-hint: "<file> [start-line:end-line]"
---
Parse $ARGUMENTS:
- First token is the file path (required).
- Optional second token is a line range in the format `start:end` (e.g., `42:67`).

If no file is provided, ask the user to supply one and stop.

Run the following, substituting the parsed values:
- `git blame -w -M -C --line-porcelain <file>` (or `-L <start>,<end>` if a range was given)
- `git log --follow --oneline -- <file>` to get the full rename/move history
- For the top 5 most-cited commits in the blame output: `git show <sha> --stat --format="%H %ae %ad %s%n%b"` to fetch their full context

Produce an explanation organized as:

**File overview**
One paragraph: what the file does, how old it is, how many authors have touched it, and the rough shape of its history (stable vs. frequently changed).

**Line-by-line (or hunk-by-hunk) attribution**
For each distinct commit that owns lines in the blame range:
- Commit SHA (short), author, date
- Lines owned (range or count)
- What that commit changed and *why* (infer from the commit message and diff context)
- Whether the change was part of a larger refactor, a bug fix, a feature, or a revert

**Key insight**
Two to four sentences: what the history reveals about the design intent or constraints behind the current code — e.g., a workaround for a known bug, an API contract that can't change, a performance constraint documented only in commit history.

**Risky lines**
Flag any lines that:
- Were last touched more than 2 years ago by an author no longer in recent commits
- Have been changed 4 or more times (high churn)
- Were introduced by a commit message containing "hack", "workaround", "tmp", "fixme", or "revert"

Do not modify any files. Do not run `git checkout` or any write operations.
