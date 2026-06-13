# Hook: Tone Enforcement

## What It Does

Scans all newsletter drafts and flags non-brand tone, banned words, jargon, clarity issues, and corporate speak. Prevents tone slips from reaching approval.

## Settings.json Entry

```json
{
  "hooks": {
    "newsletter-tone-enforcement": {
      "event": "PostToolUse",
      "trigger": {
        "tools": ["write", "edit"]
      },
      "scriptPath": "hooks/tone-enforcement.sh"
    }
  }
}
```

## Setup Instructions

1. Add the JSON entry above to your `.claude/settings.json` under `hooks`
2. Place the hook script at `.claude/hooks/tone-enforcement.sh`
3. Restart Claude Code session
4. Hook will auto-trigger when you write or edit newsletter content

## What Gets Flagged

### Banned Words (15)

These words are never used in brand voice:

- synergy
- revolutionary
- game-changer
- delve
- robust
- leverage
- holistic
- ecosystem
- disruptive
- innovative
- paradigm
- seamlessly
- unlock value
- reach out
- per my last email

**Flag Action:** When detected, flag with line number and suggest alternative.

### Corporate Jargon

Words and phrases to replace:

- "touching base" → "checking in"
- "circle back" → "follow up"
- "at scale" → "widely" or "in production"
- "verticals" → "industries"
- "solution" (overuse) → specific product/feature
- "empower" → specific action
- "stakeholders" → specific roles

**Flag Action:** Highlight with context and suggest more specific alternatives.

### Tone Slips

Issues that break the conversational, expert voice:

- **Hedging:** "might," "perhaps," "seems," "arguably" (use when warranted, not reflexively)
- **Passive voice:** Identify and flag for rewrite to active
- **Generic statements:** "This is important" → flag as too vague; needs specific context
- **Overselling:** Claims without data backing (e.g., "game-changing," "revolutionary")

**Flag Action:** Highlight the phrase and note the specific tone issue.

---

## Example Output

```
🚨 TONE ENFORCEMENT REPORT

**FILE:** Newsletter draft — "5 AI Trends"

---

### BANNED WORDS DETECTED (1)

Line 45: "...synergy between teams and AI..."
→ Replace with "collaboration" or "interaction"

---

### CORPORATE JARGON (2)

Line 12: "...empower enterprises to make better decisions..."
→ Too vague. Be specific: "enable enterprises to reduce decision latency by 40%"

Line 88: "...unlock value in enterprise operations..."
→ Replace "unlock value" with concrete benefit (e.g., "reduce operational costs by 15%")

---

### TONE SLIPS (1)

Line 31: "Perhaps the most interesting trend is..."
→ Hedging. Remove "perhaps." State it directly: "The most interesting trend is..."

---

### PASSIVE VOICE (1)

Line 67: "The feature was implemented by leading enterprises..."
→ Rewrite active: "Leading enterprises implemented the feature..."

---

### SUMMARY

**Pass/Flag:** Flag — Fix 1 banned word, 2 jargon issues, 1 hedging phrase, 1 passive voice before approval.

**Estimated Time to Fix:** 5 minutes

**Next:** Apply fixes and re-submit.
```

---

## How the Hook Works

1. **Trigger:** You write or edit any content in the newsletter
2. **Scan:** Hook analyzes the text against banned words, jargon list, and tone patterns
3. **Flag:** Issues are reported with line numbers and context
4. **Suggest:** For each flag, a replacement or rewrite is suggested
5. **Pass/Fail:** Hook indicates if the draft passes tone gates or needs revision

---

## Customization

To add or remove words from the banned list:

1. Edit `.claude/hooks/tone-enforcement.sh`
2. Modify the `BANNED_WORDS` array
3. Restart Claude Code

Example:
```bash
BANNED_WORDS=(
  "synergy"
  "revolutionary"
  "game-changer"
  "your-word-here"
)
```

---

## Tips

- **Use frequently:** Run tone enforcement on every draft, not just final versions
- **Fix early:** Tone slips are easier to catch and fix in drafting phase
- **Learn your patterns:** If you consistently use certain jargon, add it to the banned list
- **Exception handling:** If you have a legitimate reason for a flagged word, add a comment: `<!-- exception: "robust" used deliberately -->` to suppress the flag

---
