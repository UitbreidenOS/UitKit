---
description: Generate a standup update from recent git activity or freeform notes
argument-hint: "[context or notes]"
---
Generate a concise standup update based on: $ARGUMENTS

If $ARGUMENTS is empty, inspect the git log for the past 24 hours (`git log --since="24 hours ago" --oneline --author=$(git config user.email)`) and derive yesterday/today from commits. If the repo has staged or unstaged changes, note what is in progress.

Structure the output as three plain sections — no headers, no bullets unless natural:

Yesterday: what was completed or meaningfully advanced.
Today: what is planned or actively in progress.
Blockers: anything blocking progress. If none, omit this line entirely.

Rules:
- Keep each section to 1–3 sentences maximum.
- Write in first person, past/present tense.
- Strip implementation details — write at the level of task/feature, not function names.
- Do not mention file paths, line numbers, or commit SHAs.
- Do not add pleasantries, sign-offs, or filler phrases like "Hope everyone's doing well."
- If $ARGUMENTS contains explicit notes, prefer them over git history.
- If git history is ambiguous (merge commits, chores only), ask one clarifying question before generating.

Output only the standup text. No preamble, no "Here is your standup:" wrapper.
