---
description: Launches talent acquisition workflow for a new job opening. Returns job description, sourcing strategy, interview plan, candidate evaluation rubric, and 30-60-90 onboarding template. Saves plan for approval before posting.
---

# /hire [job-title]

## What This Does
Runs talent-acquisition-strategist skill to comprehensively plan a new hire workflow. Gathers role rationale, market data, sourcing channels, interview process, candidate rubric, and onboarding plan. Generates complete recruitment playbook for human approval.

## Steps Claude Follows
1. Ask for: job title, reporting manager, business rationale, start date target, compensation band
2. Run talent-acquisition-strategist skill — full hiring strategy
3. Include job description draft (title, responsibilities, requirements, EEO statement)
4. Build sourcing strategy (channels, timeline, diversity targets)
5. Create interview plan (5-step structured process, rubric)
6. Generate candidate evaluation rubric (5 dimensions, minimum score to advance)
7. Build 30-60-90 onboarding template (milestones per month)
8. Save hiring plan to hiring-plans/{role-slug}-plan.md
9. Display summary: job title, market comp band, timeline, sourcing channels, interview duration

## Next Action Logic
- **GO** (business case clear, budget approved): "Ready to post job description"
- **NEED CLARIFICATION**: "Define business rationale before posting"
- **MARKET RISK** (role hard-to-fill): "Consider agency recruiting; budget 20% placement fee"
- **TIMELINE PRESSURE** (30-day hire target): "Increase sourcing channels; consider internal transfer"

## Output Format

### Hiring Plan Summary
```
# Hiring Plan: [Job Title]

## Role Overview
- **Title:** [Job Title] — $[Min]–$[Max]K + equity range
- **Reporting to:** [Manager Name/Title]
- **Team:** [Department]
- **Start date target:** [Date; timeline: 60–90 days typical]
- **Business rationale:** [Why we're hiring; strategic fit; headcount impact]

## Job Description
[Full JD with responsibilities, requirements, benefits, EEO statement]

## Sourcing Strategy
[Channels, timeline, diversity targets (min 30% women/underrepresented minorities), agency decision]

## Interview Plan
[5-round process: screener, technical/functional, behavioral, manager, executive]
[Scoring rubric: 1–5 per round; minimum 18/25 to advance to offer]

## Candidate Evaluation Rubric
[5 dimensions: technical fit, cultural fit, growth potential, team dynamics, cost efficiency]

## Offer Strategy
[Salary band (50th percentile), equity grant range, sign-on bonus criteria, benefits]

## 30-60-90 Onboarding Plan
[Pre-start, Week 1, Month 1, Month 2, Month 3 milestones and success criteria]

## Success Metrics
[Time-to-hire target (8–12 weeks), offer acceptance rate (target 85%), quality-of-hire (6-month retention >95%)]

## Timeline
[Week 1: Post job | Week 2–4: Screening | Week 3–6: Interviews | Week 6: Offer | Week 8: Start]
```

### Approval Checkpoint
```
Ready to post? Confirm:
- [ ] Business rationale approved by manager
- [ ] Budget allocated (HR + recruiting costs)
- [ ] Compensation band reviewed by finance
- [ ] Job description reviewed by legal (EEO compliance)
- [ ] Manager available for interviews (calendar blocked)
- [ ] Sourcing channels activated
```

---
