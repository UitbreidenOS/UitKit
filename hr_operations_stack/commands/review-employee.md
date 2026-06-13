---
description: Runs annual/mid-year performance review workflow. Synthesizes 360-feedback, sets SMART goals, calibrates ratings, and builds development plan. Ensures consistency and prevents bias.
---

# /review-employee [name]

## What This Does
Runs performance-reviewer skill to comprehensively evaluate an employee. Gathers goal achievement data, synthesizes 360-feedback, assigns performance rating, and builds next-year development plan. Generates review document for calibration and approval.

## Steps Claude Follows
1. Ask for: employee name, role, review type (annual or mid-year), manager name
2. Run performance-reviewer skill — goal review, 360-feedback synthesis, rating calibration
3. Compile prior year goals and achievement percentages
4. Synthesize 360-feedback from manager, peers, skip-level, direct reports (if applicable)
5. Assign performance rating (E=Exceeds, M=Meets, B=Below Expectations)
6. Review rating against peer group for bias/consistency (flag outliers)
7. Document development plan (top 2 growth areas, specific actions, resources)
8. Calculate merit increase recommendation (performance-based % increase)
9. Save review to reviews/[employee-name]-[year]-review.md
10. Display summary: rating, merit increase %, development priorities, next steps

## Next Action Logic
- **Exceeds Expectations (E):** 4–6% merit increase; consider promotion or expanded scope
- **Meets Expectations (M):** 2–3% merit increase; identify 1 growth area for development
- **Below Expectations (B):** 0–1% merit increase; recommend performance improvement plan (PIP); escalate to legal
- **Outlier rating:** Flag for panel calibration; require justification; prevent rating inflation

## Output Format

### Performance Review Summary
```
# Performance Review: [Employee Name]

## Employee Overview
- **Name:** [Full Name]
- **Role/Title:** [Current Title]
- **Reporting to:** [Manager Name]
- **Review Period:** [Year or half-year dates]
- **Review Type:** [Annual | Mid-year]

## Goal Achievement Summary
[List prior-year goals with achievement percentages; context for misses]
- Goal 1: [Goal description] — [Achievement %]
- Goal 2: [Goal description] — [Achievement %]
- Goal 3: [Goal description] — [Achievement %]

## 360-Feedback Synthesis
[Themes from manager, peers, skip-level, reports; strengths and growth areas]
- **Strengths:** [Top 2–3 themes from feedback]
- **Growth Areas:** [Top 2–3 feedback themes; development priorities]

## Performance Rating
[E/M/B; detailed justification; calibration notes]
- **Rating:** [Exceeds / Meets / Below Expectations]
- **Justification:** [Specific examples from goals and feedback; compare to role expectations]
- **Calibration Check:** [Peer group comparison; flag if outlier; prevent bias]

## Development Plan
- **Growth Area 1:** [Specific skill/behavior; action steps; resources; timeline]
- **Growth Area 2:** [Specific skill/behavior; action steps; resources; timeline]
- **Learning Resources:** [Courses, mentoring, stretch assignments, books]
- **Manager Check-ins:** [Cadence: bi-weekly or monthly; focus areas]

## Merit Increase Recommendation
- **Increase %:** [2–3% for M, 4–6% for E, 0–1% for B]
- **Effective Date:** [Typical: start of fiscal year or anniversary]
- **Equity Refresh:** [Annual refresh at 20–30% of new-hire grant]

## Career Trajectory
- **Next role/level:** [Readiness timeline; required skills/experience]
- **Promotion consideration:** [Ready now / Ready in 12 months / Develop over 2–3 years]
- **Internal mobility options:** [Alternative roles or expanded scope]

## Compensation Adjustment (if applicable)
- **Current Salary:** $[Amount]
- **Proposed Salary:** $[Amount]
- **Market Positioning:** [50th percentile, market data source]
- **Effective Date:** [Approval date + communication plan]

## Next Steps & Follow-ups
- [ ] Employee review discussion scheduled (manager + employee, 60 min)
- [ ] 360-feedback summary shared with employee (manager facilitation)
- [ ] Development plan review (manager + employee discussion; resources allocated)
- [ ] Equity refresh processed (finance team)
- [ ] Salary adjustment (if applicable) processed by payroll
- [ ] Next review date scheduled (12 months from this review)
```

### Calibration Checklist
```
Before finalizing rating:
- [ ] Rating aligned with peer group (no outliers without justification)
- [ ] No gender/race/age bias detected in rating or feedback
- [ ] Goal metrics were clear and measurable
- [ ] 360-feedback themes consistent with manager assessment
- [ ] Development plan actionable and resources confirmed
- [ ] Promotion readiness clear (not ambiguous)
- [ ] Compensation aligned with market data
```

---
