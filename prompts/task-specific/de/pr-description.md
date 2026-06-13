> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../pr-description.md).

# Prompt: PR-Beschreibung generieren

Diesen Prompt verwenden, um eine qualitativ hochwertige Pull-Request-Beschreibung aus den eigenen Änderungen zu generieren.

---

## Prompt

```
Write a pull request description for the following changes.

Branch: [branch name]
Base: main

Changed files:
[paste: git diff --stat main...HEAD]

What this PR does:
[one sentence — the user should fill this in so Claude has intent, not just diff]

Write the PR description with these sections:

## Summary
[2–4 bullet points: what changed and why, from the reader's perspective]

## Motivation
[one short paragraph: what problem this solves or what improvement it makes]

## Changes
[bullet list of meaningful changes — not a file list, but behavioral/structural changes]

## Test plan
[bulleted checklist of how a reviewer can verify this works:
- specific steps to test
- edge cases to check
- what a successful result looks like]

## Notes
[anything a reviewer needs to know: breaking changes, migration steps, follow-up work, known limitations]

Rules:
- No generic filler ("this PR improves the codebase")
- No file lists (the diff already shows files)
- Specific and concrete — a reviewer should be able to test this without asking questions
- If there are no notes, omit the Notes section
```

---

## Schnellvariante (kleine PRs)

Für kleine, offensichtliche Änderungen:

```
Write a concise PR description for this change: [describe the change in one sentence]

Include:
- What: one sentence
- Why: one sentence  
- How to test: one or two specific steps

Keep it under 100 words total.
```

---
