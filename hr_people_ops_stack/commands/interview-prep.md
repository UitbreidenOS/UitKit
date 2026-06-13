---
description: Generates interview guide, scoring rubric, behavioral questions, and red-flag signals for a candidate. Prepares hiring manager for structured conversation. Ready for use in 48h.
---

# /interview-prep

## What This Does

Runs the interview-prep skill to build a complete interview guide for a candidate. Generates interview structure (opening, background, behavioral, role-specific, culture fit sections), provides scoring rubric, suggests key questions, and flags red-flag signals.

## Steps Claude Follows

1. Ask for: candidate name, role, interview date/time, interviewer name
2. Ask for: candidate's background summary (from resume) and role description
3. Run interview-prep skill — build interview guide, scoring rubric, behavioral questions
4. Create pre-interview checklist (prep tasks for interviewer)
5. Provide red-flag signals to watch for during interview
6. Return ready-to-use interview guide

## Next Action Logic

- **Day 0:** Generate interview guide
- **Day 1–2:** Interviewer prepares (reads guide, reviews candidate profile, arranges quiet space)
- **Interview day:** Interviewer uses guide, takes notes, scores after interview
- **Post-interview:** Score and surface red flags if any

## Output Format

### Interview Guide

```
## Interview Guide: [Candidate Name] for [Role]

**Date:** [Interview date]
**Interviewer:** [Interviewer name]
**Duration:** 50 minutes
**Format:** Phone / Video / In-person

---

### Pre-Interview Prep
- [ ] Review candidate resume
- [ ] Review role description and CLAUDE.md hiring criteria
- [ ] Prepare 2–3 behavioral questions
- [ ] Prepare role-specific mini work sample
- [ ] Quiet space, no interruptions

---

### Interview Structure
[5 sections: Opening (5m), Background (10m), Behavioral (15m), Role-Specific (10m), Culture Fit (5m), Candidate Questions (5m)]

---

### Scoring Rubric
[0–5 scale per dimension: Skills, Communication, Problem-Solving, Culture Fit, Leadership]

---

### Red Flags to Watch
[List of specific red flags to surface if observed]

---

### Post-Interview Actions
- [ ] Complete scoring rubric within 2h
- [ ] Surface any red flags
- [ ] Decide: advance, hold, or reject
```

---
