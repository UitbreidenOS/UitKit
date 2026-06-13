---
description: Runs release planning skill to structure a product release. Takes scope, timeline, and rollout strategy. Returns release checklist, critical path, go/no-go criteria, and deployment plan.
---

# /plan-release

## What This Does

Structures a complete product release: scope lockdown, timeline, dependencies, testing strategy, communication plan, and rollout approach. Identifies the critical path, articulates go/no-go criteria, and surfaces risks early. Returns a release checklist and deployment readiness assessment.

## Steps Claude Follows

1. **Ask for:** Target launch date, feature list (with descriptions), engineering time estimates, customer communication needs, rollout strategy (phased vs. all-at-once)
2. **Run release-planning** — Build timeline, identify dependencies, create testing strategy, map communication plan
3. **Identify critical path** — Which features/tasks must complete first? What's blocking what?
4. **Build go/no-go checklist** — Define criteria for green-light to deploy; list all sign-offs needed
5. **Map risks and mitigations** — Document known risks and fallback plans
6. **Create deployment plan** — Infrastructure, rollback strategy, monitoring setup
7. **Return checklist** — Display timeline, critical path, risk matrix, and go/no-go status

## Output Format

### Release Plan Summary
```
# Release Plan: [Release Name / Version]

**Target Launch Date:** [Date]
**Current Status:** [In Planning / In Development / In QA / Ready to Deploy]

## Timeline at a Glance
[Gantt-style or table showing key phases and dates]

## Critical Path
[Which features/tasks are time-sensitive? What must complete first?]

## Go/No-Go Checklist
[24-hour pre-launch checklist; current status]

## Key Risks & Mitigations
[Known risks; how to handle if they emerge]

## Deployment Plan
[Infrastructure, rollback, monitoring, on-call setup]

## Success Metrics
[How will we know if launch is successful?]
```

## Next Actions

- **Lock scope** — Confirm feature list is final; no late additions
- **Validate timeline** — Review engineering estimates; flag any schedule risks
- **Prep team** — Schedule standups, training, and go/no-go approval meetings
- **Ready support** — Ensure support team is trained and documentation is ready
- **Monitor deployment** — Set up alerts, assign on-call, prepare rollback procedures

## Tips

- Lock scope as early as possible; every addition increases risk and timeline pressure
- Identify the critical path (longest sequence of dependent tasks) and focus on those first
- Over-communicate with support and CS; they're first to hear if something breaks
- Test rollback procedures before launch; don't assume rollback will work in a crisis
- Define success metrics early; you need something concrete to measure against post-launch

## Example Use Case

> "We're launching our new metrics dashboard in 4 weeks. We have 8 features, some engineering is still in progress, and we're not sure if we need a phased rollout or all-at-once."

Claude runs `/plan-release` with your scope and timeline. Returns:
- Detailed timeline with all phases (development, QA, staging, launch)
- Critical path showing which features block others
- Risk assessment (e.g., database migration complexity, performance concerns)
- Go/no-go checklist (9 criteria that must be met before launch)
- Rollout strategy recommendation (phased approach suggested if adoption is risky)
- Deployment checklist (what to do in the 24 hours before launch)

---
