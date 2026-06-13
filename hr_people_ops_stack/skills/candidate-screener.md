---
name: candidate-screener
description: Scores a candidate 0–100 across hiring criteria (skills fit, experience, culture alignment, compensation). Returns ADVANCE/HOLD/REJECT with reasoning and recommended interview depth.
allowed-tools: Read
effort: low
---

# Candidate Screener

## When to activate

Before scheduling any interview. Candidate resume or application has been submitted. You have access to the candidate's background, experience, stated compensation expectation, and company's hiring criteria matrix (defined in CLAUDE.md).

## When NOT to use

Not for internal transfer or promotion screening — use engagement-pulse skill for that. Not for rejected candidates (candidate-screener is forward-looking). Not without a complete resume or application showing education, work history, and stated salary expectations.

## Screening Dimensions

Score the candidate on each dimension below. Each dimension is out of 25 points. Total score is 0–100.

### 1. Skills Fit (0–25 points)

- **25 points:** 5+ core skills demonstrated in resume/work history; depth in 2+ areas; no major gaps for the role.
- **15 points:** 3–4 core skills present; some gaps but trainable within 3 months.
- **5 points:** <3 core skills; major gaps; significant ramp needed.

**Scoring tip:** Compare candidate's skills list to the job description's required + nice-to-have. Count "core" skills as those required for day-1 productivity.

### 2. Experience Level (0–25 points)

- **25 points:** 5+ years in this role or adjacent role; demonstrates progression; clear mastery.
- **15 points:** 2–4 years in this role or similar; competent, but not yet senior.
- **5 points:** <2 years (junior) or >10 years (overqualified); mismatch with role level.

**Scoring tip:** Overqualified is risk—high flight risk, boredom, salary expectations inflation. Junior is OK for junior roles; flag it if hiring for senior.

### 3. Culture Fit (0–25 points)

- **25 points:** 4+ company values evident in resume/cover letter; background suggests strong alignment.
- **15 points:** 2–3 company values evident; general alignment; some uncertainty.
- **5 points:** Values unclear or misaligned; red flags (e.g., "I need stability" for fast-paced startup).

**Scoring tip:** Look for evidence of autonomy, collaboration, learning, transparency. Red flags: inflexible requirements, complaints about prior managers/companies, role-hopping.

### 4. Compensation Expectation (0–25 points)

- **25 points:** Stated expectation within ±10% of salary band; no surprises expected.
- **15 points:** Stated expectation within ±20% of band; potentially negotiable.
- **5 points:** Expectation >20% above band or significantly below (signals inexperience or desperation).

**Scoring tip:** If no expectation stated, assume "to be discussed" and score 15. High expectations = harder to close; low expectations = potential quality risk.

## Decision Rule

- **ADVANCE (≥60):** Schedule interview. Candidate is qualified and likely aligned.
- **HOLD (40–59):** Possible fit; interview only if thin pipeline or senior role. Request clarification on gaps.
- **REJECT (<40):** Pass. Not a fit. Provide clear reason (missing skills, culture misalignment, compensation).

## Output Format

Return screening result in this format:

```
## [Candidate Name] — Screening Result

**Overall Score:** [X/100]
**Decision:** [ADVANCE / HOLD / REJECT]

### Score Breakdown
- Skills Fit: [X/25] — [Brief justification]
- Experience Level: [X/25] — [Brief justification]
- Culture Fit: [X/25] — [Brief justification]
- Compensation: [X/25] — [Brief justification]

### Summary
[1–2 sentences on why this candidate should ADVANCE, HOLD, or be REJECTED]

### Recommendation
[If ADVANCE] Suggest interview structure: phone screen, technical, or panel. Flag any skill areas to probe deeper.

[If HOLD] Ask hiring manager: is pipeline thin? If yes, interview but flag gaps. If no, pass.

[If REJECT] Clear reason: e.g., "Skills gap too large (missing DevOps experience); 2 years below seniority floor."

### Next Steps
- [ ] Schedule phone screen for [date]
- [ ] Request clarification on [gap, if applicable]
- [ ] Review compensation range with hiring manager
```

## Example

```
## Sarah Chen — Screening Result

**Overall Score:** 78/100
**Decision:** ADVANCE

### Score Breakdown
- Skills Fit: 25/25 — Python, React, PostgreSQL all present; 6 years full-stack experience.
- Experience Level: 20/25 — 4 years as Senior Engineer at previous company; demonstrates progression to IC4 level.
- Culture Fit: 20/25 — Background in high-agency startup; aligned with autonomy and shipping fast. Remote-first preference matches us.
- Compensation: 13/25 — Stated expectation $165k; our band is $140–160k. Likely needs negotiation.

### Summary
Strong technical fit with clear progression. Slight compensation mismatch requires discussion but likely negotiable given startup background and role interest. Culture alignment is strong.

### Recommendation
Schedule phone screen this week. In screening call, probe: (1) Willingness to relocate if needed (cover letter is vague). (2) Compensation flexibility below stated $165k, particularly if equity story resonates. (3) Why leaving current role (tenure signal).

### Next Steps
- [ ] Send phone screen invite for [date]
- [ ] Prepare phone screener on compensation conversation
- [ ] Flag to hiring manager: expect counteroffer negotiation
```

---
