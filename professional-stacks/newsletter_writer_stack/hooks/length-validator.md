# Hook: Length Validator

## What It Does

Validates newsletter dimensions: body word count (300–800, optimal 500–600), subject line (<50 chars), preview text (40–80 chars), and identifies oversized or undersized sections.

## Settings.json Entry

```json
{
  "hooks": {
    "newsletter-length-validator": {
      "event": "PostToolUse",
      "trigger": {
        "tools": ["write", "edit"]
      },
      "scriptPath": "hooks/length-validator.sh"
    }
  }
}
```

## Setup Instructions

1. Add the JSON entry above to your `.claude/settings.json` under `hooks`
2. Place the hook script at `.claude/hooks/length-validator.sh`
3. Restart Claude Code session
4. Hook will auto-trigger when you write or edit newsletter content

## What Gets Validated

### Body Word Count

- **Optimal:** 500–600 words
- **Acceptable range:** 300–800 words
- **Flag if:** <300 (too thin) or >800 (too long)

**Output:** Total word count + breakdown by section

### Subject Line Length

- **Limit:** 50 characters max
- **Recommended:** 30–45 characters (leaves room in inbox preview)
- **Flag if:** >50 characters

**Output:** Character count + preview of how it appears in inbox

### Preview Text

- **Optimal:** 40–80 characters
- **Purpose:** Supports subject line to drive opens
- **Flag if:** <40 or >80 characters

**Output:** Character count + preview

### Section-by-Section Analysis

- **Hook:** Should be 1–2 sentences (10–30 words)
- **Context:** Should be 100–150 words
- **Insights 1–3:** Should be 100–150 words each
- **Takeaway:** Should be 50–100 words
- **CTA:** Should be 1 sentence (10–20 words)

**Output:** Word count for each section + flags for outliers

---

## Example Output

```
📏 LENGTH VALIDATOR REPORT

**FILE:** Newsletter draft — "5 AI Trends"

---

### BODY WORD COUNT

**Total:** 487 words
**Range:** 300–800 (✓ Within acceptable)
**Optimal:** 500–600 (⚠ 13 words below optimal)

**Recommendation:** Content is lean but engaging. No expansion required. If adding, target +10–50 words in Insight sections.

---

### SECTION BREAKDOWN

| Section | Word Count | Status |
|---|---|---|
| **Hook** | 18 words | ✓ Good (1–2 sentences) |
| **Context** | 124 words | ✓ Optimal (100–150) |
| **Insight 1** | 98 words | ⚠ Slightly short (100–150) |
| **Insight 2** | 112 words | ✓ Good |
| **Takeaway** | 76 words | ✓ Good (50–100) |
| **CTA** | 18 words | ✓ Good (1 sentence) |
| **Footer** | 41 words | ✓ Standard |

**Finding:** Insight 1 is 2 words short of optimal. Consider expanding with 1–2 more data points or expert context.

---

### SUBJECT LINE

**Line:** "5 AI Trends Reshaping Enterprise Tech (Q2 2026)"
**Characters:** 48
**Status:** ✓ Good (under 50 limit)
**Preview (inbox):** "5 AI Trends Reshaping Enterprise Tech (Q2..." [45 chars visible]

---

### PREVIEW TEXT

**Text:** "From agentic workflows to model consolidation—here's what's actually moving the needle."
**Characters:** 89
**Status:** ⚠ Slightly long (optimal 40–80)

**Issue:** Preview text will be cut off in some email clients. Current length = 89 chars; limit is typically 80–100 depending on device.

**Recommendation:** Trim to 80 chars max:
"Here's what's actually moving the needle in enterprise AI deployment in Q2 2026." [80 chars exactly]

---

### SUMMARY

**Pass/Flag:** Flag — Preview text is 9 chars over optimal. Fix before send.

**Total Fixes Needed:** 1 (preview text trim)

**Estimated Time:** 2 minutes

---

### CHECKLIST

- [x] Body word count: 300–800 words
- [x] Subject line: <50 characters
- [ ] Preview text: 40–80 characters (currently 89; trim to 80)
- [x] Hook: 1–2 sentences
- [x] Context: 100–150 words
- [x] Insights: 100–150 words each
- [x] Takeaway: 50–100 words
- [x] CTA: Single sentence

**Status:** Fix preview text, then READY TO SEND.
```

---

## How the Hook Works

1. **Trigger:** You write or edit newsletter content
2. **Count:** Hook measures word counts, character counts, and section lengths
3. **Compare:** Dimensions are checked against limits and optimal ranges
4. **Flag:** Issues are reported with specific counts and recommendations
5. **Validate:** Checklist shows which dimensions pass/fail

---

## Customization

To adjust word count ranges or character limits:

1. Edit `.claude/hooks/length-validator.sh`
2. Modify these variables:

```bash
BODY_MIN=300
BODY_MAX=800
BODY_OPTIMAL_MIN=500
BODY_OPTIMAL_MAX=600
SUBJECT_MAX=50
PREVIEW_MIN=40
PREVIEW_MAX=80
```

3. Restart Claude Code

---

## Tips

- **Run before review:** Length validation should happen before `/review-draft` to catch sizing issues early
- **Preview text matters:** This is real estate in the inbox. Don't waste it; craft it as a second hook
- **Optimal is not required:** 300–800 is acceptable. Optimal (500–600) is a target, not a mandate
- **Re-run after edits:** If you trim the preview text, re-run length validator to confirm new count

---
