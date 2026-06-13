# Command: /review-draft

## What It Does

Audits a complete newsletter draft for engagement, clarity, tone, brand fit, sources, links, and length. Returns a pass/fail decision with specific recommendations for improvement.

## Usage

```
/review-draft [paste newsletter draft or reference current draft]
```

## Examples

```
/review-draft

/review-draft [pasted newsletter text]

/review-draft — check subject line variations too
```

## Output

The command returns a comprehensive review report containing:

1. **Pass/Fail decision** — Ready to send, or needs edits?
2. **Summary** — Overall quality and key findings
3. **Engagement & hook analysis** — Is the opening compelling?
4. **Clarity & readability audit** — Is every section clear?
5. **Tone & brand fit check** — Does it match your voice?
6. **Length & structure validation** — Word counts, character limits, CTA quality
7. **Sources & accuracy verification** — Are claims backed up?
8. **Links & CTAs audit** — Are all URLs working and CTAs clear?
9. **Issues found** — If any, with examples and suggested fixes
10. **Estimated performance** — Predicted open rate and click-through rate
11. **Recommendations** — What to do before sending

---

## How to Use This Output

1. **Check the Pass/Fail decision** — PASS = ready to send (after human approval). NEEDS EDITS = fix issues before proceeding.
2. **Review flagged issues** — Read through each finding and recommended fix.
3. **Apply edits** — Make changes to the newsletter based on feedback.
4. **Re-run review** (optional) — If you made major edits, run `/review-draft` again to confirm.
5. **Proceed to send** — After human approval of PASS status, send via your email platform.

---

## What Gets Checked

| Check | What It Looks For | Fail Criteria |
|---|---|---|
| **Hook** | Curiosity, specificity, engagement | Generic opening, unclear value |
| **Clarity** | One idea per section, no jargon, active voice | Unclear transitions, undefined terms, passive voice |
| **Tone** | Conversational, expert, no corporate jargon | Stiff, robotic, uses banned words |
| **Length** | Body 300–800 words (target 500–600), subject <50 chars | Too short/long, subject too wordy |
| **Brand fit** | Matches newsletter voice and values | Doesn't sound like you, inconsistent style |
| **Sources** | Data points and quotes have attribution | Unverified claims, missing sources |
| **Links** | All URLs work and are relevant | Broken links, generic "click here" |
| **CTA** | Single, clear, actionable | Multiple CTAs, vague, unclear next step |

---

## Quality Gate Checklist

The review will verify:

- [ ] Hook is curiosity-driven, not generic
- [ ] All claims are sourced or cited
- [ ] No banned words present
- [ ] Body is 300–800 words
- [ ] Subject line is <50 characters
- [ ] Preview text is 40–80 characters
- [ ] CTA is single and clear
- [ ] All links work
- [ ] Tone matches brand voice
- [ ] Structure follows formula (hook → context → insights → takeaway → CTA)

---

## Tips

- **Run early and often:** Don't wait until final version. Get early feedback on hooks and structure.
- **Fix issues immediately:** If the review flags tone slips or clarity issues, address them before human review.
- **Use as quality gate:** This review is your last chance to catch problems before send. Treat it seriously.
- **Predicted performance:** The report includes predicted open rate and CTR. Use this to compare against your historical performance and identify strong vs. weak editions.

---

## Next Steps

**If PASS:**
- Share with human approver
- Get explicit approval to send
- Send via your email platform
- Log to session-log.md with approval timestamp

**If NEEDS EDITS:**
- Apply recommended fixes
- Re-run `/review-draft` if you made major changes
- Repeat until PASS status achieved

---
