---
name: release-planning
description: Structures release scope, timeline, dependencies, and rollout strategy. Identifies critical path, risk mitigation, and communication checkpoints. Returns release checklist, timeline, and go/no-go criteria.
allowed-tools: Read, Write
effort: high
---

# Release Planning

## When to activate

2–4 weeks before a planned product release. You have a finalized feature list, team capacity, and a target launch date. Activation requires feature specs, engineering estimates, customer communication needs, and rollout strategy (phased vs. all-at-once).

## When NOT to use

Not for real-time incident response or hotfixes. Not without clear scope definition (use this when scope is locked). Not for ongoing product iteration (this is for discrete releases). Not for managing day-to-day engineering tasks. Not without customer communication planning.

## Release Planning Framework

**Core Components:**
1. **Scope lock:** List of features, fixes, improvements included
2. **Timeline:** Development, testing, approval, deployment windows
3. **Dependencies:** Features blocking other features, infrastructure readiness
4. **Testing strategy:** QA, user acceptance testing, staging validation
5. **Rollout plan:** Phased, canary, all-at-once, or feature flags
6. **Communication:** Customer communication, support prep, marketing alignment
7. **Risk mitigation:** Known risks, mitigation steps, rollback plan

**Go/No-Go Checklist:**
- Engineering: All features complete and tested
- Product: All requirements met, customer feedback positive
- QA: All critical bugs resolved, P1 blockers cleared
- Support/CS: Documentation ready, team trained
- Marketing/Sales: Launch messaging ready, customer comms scheduled
- Infrastructure: Deployment infrastructure validated, rollback tested
- Executive: Business approval, customer success sign-off

## Planning Checklist

1. **Define scope** — List features, fixes, improvements; confirm this is everything
2. **Estimate effort** — Get engineering time estimates per feature; flag dependencies
3. **Identify critical path** — Which features block others? Sequence accordingly
4. **Map timeline** — Dev complete date, QA window, staging validation, deployment window
5. **Define success metrics** — What indicates successful release? (uptime, adoption, performance)
6. **Plan communication** — When/how do customers learn about this? Beta? Announcement? Docs update?
7. **Document rollback plan** — If something breaks, how do we revert?
8. **Identify risks** — What could go wrong? Dependencies on external systems? Scaling risks?
9. **Plan testing strategy** — QA coverage, user acceptance testing, performance testing
10. **Create approval gates** — Who signs off at each stage? What's required for sign-off?

## Output Format

```markdown
# Release Plan: [Release Name / Version]

**Target Launch Date:** [Date]
**Release Manager:** [Name]
**Status:** [In Planning / In Development / In QA / Ready to Deploy]

---

## Scope Summary

**New Features:**
- [Feature 1] — [Brief description, engineering estimate]
- [Feature 2] — [Brief description, engineering estimate]

**Bug Fixes & Improvements:**
- [Fix 1] — [Brief description]
- [Improvement 1] — [Brief description]

**Total Scope:** [X features, Y fixes, Z improvements] · **Est. Effort:** [X engineer-weeks]

---

## Timeline

| Phase | Start Date | End Date | Owner | Status |
|---|---|---|---|---|
| Feature Development | [Date] | [Date] | Engineering | [IN PROGRESS / COMPLETE / BLOCKED] |
| Code Review & QA | [Date] | [Date] | Engineering + QA | [IN PROGRESS / COMPLETE / BLOCKED] |
| Staging Validation | [Date] | [Date] | QA + Product | [IN PROGRESS / COMPLETE / BLOCKED] |
| Documentation | [Date] | [Date] | Product + Tech Writer | [IN PROGRESS / COMPLETE / BLOCKED] |
| Customer Communication | [Date] | [Date] | Marketing + CS | [IN PROGRESS / COMPLETE / BLOCKED] |
| Final Approval Gate | [Date] | [Date] | Executive + Product Lead | [IN PROGRESS / PENDING / APPROVED] |
| Deployment | [Date] | [Date] | Engineering + DevOps | [SCHEDULED / IN PROGRESS / COMPLETE] |

**Critical Path:** [Which feature/phase is most time-sensitive?]

---

## Dependencies & Blocking Risks

| Dependency | Blocker? | Status | Mitigation |
|---|---|---|---|
| [Feature A depends on Feature B] | YES / NO | On track / At risk / Blocked | [Plan B if blocked] |
| [Infrastructure readiness] | YES / NO | Ready / In progress | [Fallback plan] |
| [Third-party API / service] | YES / NO | Validated / Pending | [Contingency] |

---

## Testing Strategy

**QA Coverage:**
- Functional testing: All new features + impacted existing features
- Regression testing: [Scope of regression tests]
- Performance testing: Load test on [X concurrent users], validate response times <[Xms]
- Mobile testing (if applicable): iOS + Android devices
- Accessibility testing (if applicable): WCAG 2.1 AA compliance

**User Acceptance Testing (UAT):**
- Beta customers: [List or count]
- Duration: [X days]
- Success criteria: [What indicates UAT passes?]

**Staging Validation:**
- Deployment to staging by [Date]
- Full environment testing [Date]
- Sign-off by Product + CS [Date]

---

## Rollout Strategy

**Type:** [Phased / Canary / All-at-once / Feature Flag]

### Phased Rollout (if applicable)
**Wave 1 (Day 0):** [X% of users / specific segment] — [Date/time]
**Wave 2 (Day X):** [X% of users / specific segment] — [Date/time]
**Wave 3 (Day X):** [100% of users] — [Date/time]

**Success criteria per wave:** [What % adoption/engagement signals "OK to proceed"?]

### Feature Flags (if applicable)
- Feature flag: [Enabled for X% / specific segment]
- Monitoring window: [X hours]
- Rollout pace: [Increase by X% every X hours]

---

## Communication Plan

**Internal (Team & Leadership):**
- Engineering + QA standup [Date, time]
- Stakeholder go/no-go meeting [Date, time]
- Post-launch retro [Date, time]

**Customer-Facing:**
- Email announcement to [segment]: [Date]
- In-app notification: [Date/time]
- Changelog entry: [Live date]
- Blog post (if major): [Published date]
- Support documentation updated: [Date]

**Support & CS Prep:**
- Training session for support team: [Date]
- FAQ / Known issues doc: [Link]
- Escalation plan for early issues: [Process]

---

## Deployment & Infrastructure

**Deployment Environment:** [AWS / GCP / Heroku / On-prem / Other]
**Database Migrations:** [If any; planned downtime?]
**CDN / Cache Invalidation:** [Strategy]
**Monitoring:** [Key metrics to watch post-deployment]
**Rollback Plan:** [How do we revert if critical issue emerges?]

---

## Go / No-Go Checklist

**24 Hours Before Deployment:**

- [ ] All feature development complete and code-reviewed
- [ ] QA: All P0 & P1 bugs resolved; P2 bugs triaged
- [ ] Staging validation passed; no critical issues
- [ ] Database migrations tested and reversible
- [ ] Documentation complete and reviewed
- [ ] Support team trained; FAQ/escalation plan ready
- [ ] Customer communication drafted and approved
- [ ] Rollback plan documented and tested
- [ ] Monitoring dashboards configured
- [ ] On-call support assigned for deployment window
- [ ] Product lead: Final feature sign-off
- [ ] Engineering lead: Technical readiness sign-off
- [ ] VP/Executive: Business approval to proceed

**Go/No-Go Decision:** [APPROVED TO DEPLOY / HOLD / BLOCKED BY: [reason]]

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Critical bug in new feature emerges post-launch] | [HIGH / MEDIUM / LOW] | [HIGH / MEDIUM / LOW] | [Test plan, feature flag to disable quickly] |
| [Database migration fails] | [MEDIUM] | [HIGH] | [Rollback tested, data backup taken] |
| [Performance degradation] | [MEDIUM] | [HIGH] | [Load test pre-launch, monitoring alarms] |

**Escalation Contact:** [Name, phone number for on-call during deployment]

---

## Success Metrics

**Technical:**
- Deployment time: <[X] minutes
- Zero data loss or corruption
- Uptime maintained >99.9%

**Adoption:**
- [Feature adoption rate]: Target [X]% of eligible users in first week
- [Feature engagement]: Target [X] uses per session

**Customer Sentiment:**
- Support ticket volume related to release: <[X] in first 48h
- Customer satisfaction score: >=[X]/10

---

## Post-Launch Checklist

- [ ] Monitor error logs & performance metrics for 48 hours
- [ ] Gather customer feedback & support tickets
- [ ] Triage any issues discovered; create follow-up bugs
- [ ] Publish launch report (metrics, learnings, next steps)
- [ ] Schedule retro meeting to capture lessons learned
- [ ] Plan follow-up features/improvements based on feedback

---
```

## Example

# Release Plan: Product Operations Stack v1.2

**Target Launch Date:** June 30, 2026
**Release Manager:** Alice (VP Product)
**Status:** In QA

---

## Scope Summary

**New Features:**
- Stakeholder mapper skill — [5 engineer-weeks]
- Metrics analyzer dashboard — [3 engineer-weeks]
- RACI template generator — [2 engineer-weeks]

**Bug Fixes:**
- Fix roadmap prioritizer sorting issue
- Improve session-log performance

**Total Scope:** 3 features · 2 bug fixes · **Est. Effort:** 10 engineer-weeks

---

## Timeline

| Phase | Start | End | Owner | Status |
|---|---|---|---|---|
| Feature Development | Jun 3 | Jun 17 | Engineering | COMPLETE |
| Code Review & QA | Jun 18 | Jun 24 | Engineering + QA | IN PROGRESS |
| Staging Validation | Jun 25 | Jun 28 | QA + Product | SCHEDULED |
| Documentation | Jun 20 | Jun 28 | Tech Writer | IN PROGRESS |
| Deployment | Jun 30 | Jun 30 | DevOps | SCHEDULED |

---

## Go/No-Go Checklist

**Status:** 9/12 items complete

- [x] Feature development complete
- [x] Code reviewed
- [ ] QA: All P0/P1 bugs resolved
- [x] Documentation draft complete
- [x] Support team trained
- [ ] Staging validation passed
- [x] Rollback plan documented
- [x] Monitoring configured
- [ ] Product lead sign-off (pending QA completion)
- [x] Engineering lead sign-off
- [ ] Executive approval (pending product sign-off)

---
