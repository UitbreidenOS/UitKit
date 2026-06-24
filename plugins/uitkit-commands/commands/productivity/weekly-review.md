---
description: Produce a weekly review from git history, notes, or freeform input
argument-hint: "[week context, notes, or leave blank for git]"
---
Generate a weekly review based on: $ARGUMENTS

If $ARGUMENTS is empty or minimal, run `git log --since="7 days ago" --oneline --author=$(git config user.email)` to derive accomplishments from commits.

Produce these sections:

**Shipped / Completed**  
Bulleted list. Each item is a concrete deliverable or milestone, not a task. Group related commits into one item. No more than 8 bullets.

**In Progress**  
Bulleted list. What is actively underway and expected to close in the next 1–2 weeks. Include rough completion percentage if inferable.

**Blocked / At Risk**  
Bulleted list. Each item: what is blocked, why, and who/what unblocks it. Omit if nothing is blocked.

**Learnings**  
2–4 bullets. Observations about process, tooling, approach, or domain knowledge gained this week. Not a summary of what was done — insight only.

**Next Week Focus**  
3–5 bullets. Concrete priorities for the coming week, ordered by importance.

Rules:
- Write in first person.
- Calibrate detail to signal-to-noise: skip trivial chores and dependency bumps unless they were painful.
- Do not include time estimates for next week unless the input provided them.
- If git history shows only automated commits (bots, CI), note this and ask for manual input.
- Keep each bullet to one sentence unless a second sentence adds essential context.
- Total output should be scannable in under 2 minutes.

Output only the weekly review.
