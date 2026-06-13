---
description: Scores a candidate 0–100 across hiring criteria. Returns ADVANCE/HOLD/REJECT with reasoning and recommended next action.
---

# /screen-candidate

## What This Does

Runs the candidate-screener skill to comprehensively score a candidate against your hiring matrix. Gathers resume/application, evaluates skills fit, experience level, culture alignment, and compensation expectations. Returns a scored decision (ADVANCE/HOLD/REJECT) with reasoning.

## Steps Claude Follows

1. Ask for: candidate name, role applied for, resume/application summary
2. Run candidate-screener skill — score across all 4 dimensions (skills fit, experience level, culture fit, compensation)
3. Compute overall score (0–100) and decision rule mapping
4. Return screening verdict with breakdown
5. Log to session-log.md (if applicable)

## Next Action Logic

- **ADVANCE (≥60)** + green flags: "Ready for /interview-prep 48h before scheduled call"
- **HOLD (40–59)**: "Request clarification on [gap]. Interview only if thin pipeline or senior role."
- **REJECT (<40)**: "Does not meet hiring criteria — [specific reason]. Politely decline."

## Output Format

### Screening Result

```
## [Candidate Name] — Screening Result

**Overall Score:** [X/100]
**Decision:** [ADVANCE / HOLD / REJECT]

### Score Breakdown
- Skills Fit: [X/25]
- Experience Level: [X/25]
- Culture Fit: [X/25]
- Compensation: [X/25]

### Summary
[1–2 sentences explaining the decision]

### Next Steps
[If ADVANCE: "Schedule phone screen"]
[If HOLD: "Clarify [gap], then decide"]
[If REJECT: "Send polite rejection email"]
```

---
