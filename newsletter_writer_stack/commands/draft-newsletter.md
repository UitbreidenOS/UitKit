# Command: /draft-newsletter

## What It Does

Creates a complete, ready-to-review newsletter with hook, sections, CTA, subject line options, and estimated word count. Does not send—requires human approval before distribution.

## Usage

```
/draft-newsletter [optional: use research from prior /research-topic command]
```

## Examples

```
/draft-newsletter

/draft-newsletter using research on "AI regulation Q2 2026"

/draft-newsletter with focus on technical audience
```

## Output

The command returns a complete newsletter draft containing:

1. **Subject line** (primary + 2 alternatives)
2. **Preview text** (40–80 characters for email client)
3. **Hook** (1–2 sentences to grab attention)
4. **Context section** (why this topic matters now)
5. **2–3 insight sections** (data, analysis, expert commentary)
6. **Takeaway section** (actionable conclusion)
7. **CTA** (single clear call-to-action)
8. **Word count and metrics** (body count, subject line length, performance estimates)

---

## How to Use This Output

1. **Review the draft** — Read through completely. Does it match your voice and direction?
2. **Check for edits** — Note any sections that need refinement (call `/review-draft` for formal audit)
3. **Get human approval** — Share with editor, co-founder, or content lead if applicable
4. **Optimize subject line** — Run `/optimize-subject-line` if not already done (command tests 3 variations)
5. **Polish the copy** — Call `/editor` if you want tone refinement or tightening
6. **Send when ready** — After all approvals, you send via your email platform (Substack, Mailchimp, etc.)

---

## Expected Structure

All newsletters follow this proven formula:

```
SUBJECT LINE (max 50 chars)

PREVIEW TEXT (40–80 chars)

---

HOOK (1–2 sentences)

---

CONTEXT (100–150 words)

---

INSIGHT 1 (100–150 words)

---

INSIGHT 2–3 (100–150 words each)

---

TAKEAWAY (50–100 words)

---

CTA (1 sentence)

---

FOOTER (unsubscribe + social)
```

**Body word count target:** 500–600 words (acceptable range: 300–800)

---

## Tips

- **Always research first:** `/draft-newsletter` works best after running `/research-topic`. The research informs your hook, data points, and CTA.
- **Specify focus if needed:** If you want the draft to emphasize a particular angle or audience segment, mention it: "/draft-newsletter emphasizing technical decision-makers"
- **Review vs. Optimize:** `/review-draft` audits the newsletter for quality gates. `/optimize-subject-line` tests 3 subject variations. Use both before sending.
- **Iterate quickly:** If the draft doesn't feel right, request changes and re-draft—don't settle for mediocre hooks or thin insights.

---

## Command Chain

**Typical workflow:**

```
1. /research-topic [your topic]
   ↓
2. /draft-newsletter [using research from step 1]
   ↓
3. /review-draft [audit for quality]
   ↓
4. /optimize-subject-line [test subject variations]
   ↓
5. /editor [tighten and polish]
   ↓
6. Human approval → Send via your platform
```

---
