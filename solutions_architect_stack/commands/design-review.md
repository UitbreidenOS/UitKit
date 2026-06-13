---
description: Runs the design-review skill to validate an architecture document. Checks for completeness, correctness, feasibility, scalability, security, and operational readiness. Outputs structured review with critical findings, warnings, and recommendations. Saves to reviews/{name}-review.md.
---

# /design-review

## What This Does

Comprehensively reviews a system architecture document for gaps, risks, and best practices. Runs the design-review skill to assess: completeness of design (all sections present), correctness (requirements met, no contradictions), feasibility (tech stack viable, budget realistic), scalability (bottlenecks identified, mitigation clear), security (auth/authz in place, data protected), and operational readiness (monitoring, deployment automation, runbooks).

## Steps Claude Follows

1. Ask for: architecture document path or name
2. Read the architecture document
3. Run design-review skill — full review checklist
4. Assess completeness (all sections there?)
5. Assess correctness (does it solve the problem? any contradictions?)
6. Assess feasibility (realistic for team/timeline/budget?)
7. Assess scalability (bottlenecks clear? mitigation planned?)
8. Assess security (auth/authz/encryption in place? compliance checked?)
9. Assess operational readiness (monitoring planned? deployment automated? runbooks?)
10. Extract critical findings (must fix before code starts)
11. Extract warnings (important but not blocking)
12. Extract questions for clarification (impacts timeline or risk)
13. Extract best practice recommendations (nice-to-haves)
14. Save review to reviews/{system-name}-review.md
15. Display summary: APPROVED / APPROVED WITH CONDITIONS / NEEDS REVISION

## Output Format

```markdown
# [System Name] — Design Review

## Assessment
[APPROVED / APPROVED WITH CONDITIONS / NEEDS REVISION]

## Summary
- Overall health: [assessment]
- Key strengths: [2-3 things right]
- Critical gaps: [what must be fixed]
- Estimated extra effort: [weeks]

## Critical Findings
[Must fix before code starts]

## Warnings
[Important but not blocking]

## Questions
[Clarifications needed]

## Recommendations
[Nice-to-haves, best practices]

## Detailed Comments
[By section]
```

## Approval Criteria

**APPROVED:** Design is complete, correct, feasible, and ready for implementation.

**APPROVED WITH CONDITIONS:** Design is mostly good, but a few small gaps or clarifications needed. Can start implementation if conditions addressed in parallel.

**NEEDS REVISION:** Critical gaps found. Must revise before development begins. Re-run review after changes.

## Next Actions

- **If APPROVED:** Move to implementation planning. Run `/migrate-system` if replacing legacy.
- **If APPROVED WITH CONDITIONS:** Create tasks for condition items, start dev, track completion.
- **If NEEDS REVISION:** Discuss findings with architect and customer. Update architecture. Re-run review.

## Example Usage

```
/design-review

You: Can you review the architecture for our order management system?

Claude: I'll review designs/order-management-architecture.md

[Claude runs design-review skill]

Claude: Review complete.

ASSESSMENT: APPROVED WITH CONDITIONS

Critical Findings:
- No disaster recovery plan (must add before production)
- Monitoring strategy vague (clarify which metrics are critical alerts)

Warnings:
- Redis as single point of failure (should consider Redis Cluster)
- No load testing planned (should do before M6 launch)

Recommendations:
- Implement feature flags for safer deployments
- Add contract testing for API changes

See: reviews/order-management-review.md

Status: Ready to start development. Address critical findings in parallel.
```
