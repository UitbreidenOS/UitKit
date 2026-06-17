---
description: Run ICP scoring matrix on a single prospect. Returns GO/CAUTION/NO-GO with dimensional breakdown and a one-line decision rationale before any research begins.
---

# /score-lead

## What This Does
Runs the lead-scorer skill on a named prospect. Scores 0–100 across four dimensions (seniority, company size, industry fit, tech stack signals) and returns a decision before any research time is spent.

## Steps Claude Follows
1. Ask for: prospect name, title, company name, approximate employee count, and any known tech stack signals.
2. If company URL is provided, fetch firmographic data from the website first.
3. Run lead-scorer skill — score each dimension, sum to 100.
4. Return score block with GO/CAUTION/NO-GO and dimensional breakdown.
5. If NO-GO: stop and ask if human wants to override with written justification.
6. If GO or CAUTION: suggest next step (`/prospect-batch` or start account research).

## Output Format

```
LEAD SCORE: [X]/100 — [GO / CAUTION / NO-GO]

Seniority:  [X/25] — [title] ([note])
Size:       [X/25] — [employees] ([note])
Industry:   [X/25] — [industry] ([note])
Tech Stack: [X/25] — [signals summary]

DECISION: [Proceed / Proceed with caution (gaps: X) / Stop — reasons]
Next: [suggested action]
```

## Notes
- This command costs almost nothing in research time — run it first, always.
- A CAUTION score (40–59) is not a rejection; it's a flag. The human decides whether to proceed.
- If you override a NO-GO, log the justification in session-log.md.
