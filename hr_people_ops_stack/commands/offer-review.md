---
description: Audits a draft offer for market competitiveness, equity fairness, legal compliance, and negotiation risk. Returns PASS/FAIL verdict with fixes if needed.
---

# /offer-review

## What This Does

Runs the offer-reviewer skill to audit a draft offer before sending to candidate. Reviews salary competitiveness, equity fairness, sign-on bonus, benefits package, legal compliance, and negotiation risk. Returns verdict (PASS/FAIL) with specific recommendations for fixes.

## Steps Claude Follows

1. Ask for: candidate name, role, draft offer details (salary, equity, sign-on, benefits)
2. Ask for: salary band, equity grant framework, candidate's stated expectations
3. Run offer-reviewer skill — audit across all 6 dimensions
4. Return audit verdict with specific flags and fixes
5. Log to session-log.md (if applicable)

## Next Action Logic

- **PASS:** "Ready to send. Hiring manager reviews and approves, then send to candidate."
- **FAIL:** "Address these issues before sending: [specific fixes]. Resubmit after changes."

## Output Format

### Offer Audit

```
## Offer Audit: [Candidate Name] for [Role]

**Overall Result:** [PASS / FAIL]

---

### Dimension Audit

**1. Salary Competitiveness:** [PASS / FAIL]
[Assessment and reasoning]

**2. Equity Fairness:** [PASS / FAIL]
[Assessment and reasoning]

**3. Sign-On Bonus:** [PASS / FAIL]
[Assessment and reasoning]

**4. Benefits Package:** [PASS / FAIL]
[Assessment and reasoning]

**5. Legal Compliance:** [PASS / FAIL]
[Assessment and reasoning]

**6. Negotiation Risk:** [PASS / FAIL]
[Assessment and reasoning]

---

### Summary
[1–2 sentences: reason for PASS or FAIL]

### Action Items (if FAIL)
- [ ] [Fix 1]
- [ ] [Fix 2]
- [ ] Resubmit for audit

### Next Steps (if PASS)
- [ ] Hiring manager approves
- [ ] Send to candidate
- [ ] Track acceptance deadline
```

---
