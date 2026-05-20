# Feature Launch Workflow

End-to-end process for launching a product feature — from final development through communication and monitoring.

## When to use

Use this workflow for any feature launch that affects:
- More than 10% of your user base
- Payment flows, authentication, or core product functionality
- External integrations or APIs that other services depend on
- Anything with a marketing announcement attached

## Phase 1: Launch Readiness (1 week before)

**Engineering checklist:**
- [ ] All acceptance criteria from the spec are met
- [ ] Code reviewed and approved
- [ ] Unit and integration tests passing
- [ ] E2E tests passing on staging
- [ ] Performance tested: no regression in p99 latency
- [ ] Feature flag configured for gradual rollout
- [ ] Analytics events instrumented and verified
- [ ] Rollback plan documented and tested
- [ ] Monitoring alerts set up for new code paths

**Product checklist:**
- [ ] Feature tested by PM on staging against acceptance criteria
- [ ] Edge cases tested (empty state, error state, mobile)
- [ ] Help documentation written or updated
- [ ] In-app tooltips or onboarding for new UI (if applicable)
- [ ] Success metrics defined and baseline captured

**Design checklist:**
- [ ] Final implementation matches approved designs
- [ ] Responsive on mobile (if web)
- [ ] Accessibility: keyboard navigation, screen reader, colour contrast
- [ ] Loading and error states implemented

## Phase 2: Communication Prep (3-5 days before)

**Internal communication:**
- [ ] Engineering team briefed on what's launching and when
- [ ] Customer success team briefed (what's new, expected customer questions)
- [ ] Sales team briefed if it affects what they can demo or sell
- [ ] Support team has documentation to handle common questions

**External communication (if customer-facing):**
- [ ] Changelog entry written
- [ ] In-app announcement drafted (if needed)
- [ ] Email to affected users drafted (if needed)
- [ ] Blog post or social media prepared (if significant)
- [ ] Press / PR coordinated (if major launch)

## Phase 3: Launch Execution

**Day of launch:**

```
1. Confirm all pre-launch checklist items complete
2. Notify team in Slack: "Launching [Feature] at [time]"
3. Enable feature flag at [X]% of users (start small: 5-10%)
4. Monitor for 30 minutes:
   - Error rate on new code paths
   - p99 latency unchanged
   - Core business metrics not regressing
5. If healthy: ramp to 50%, wait 30 min
6. If healthy: ramp to 100%
7. Announce in Slack: "Feature is live for 100% of users ✅"
8. Publish changelog entry / blog post if prepared
```

**Rollback trigger:** If error rate increases > 2x baseline or user-facing errors spike → immediately disable the feature flag and investigate.

## Phase 4: Post-Launch Monitoring (24-72 hours)

**Track for 48 hours after launch:**
- [ ] Error rate back to normal
- [ ] p99 latency back to normal  
- [ ] Primary success metric moving in the right direction
- [ ] Support ticket volume: no spike related to the feature
- [ ] User feedback (if applicable): NPS, in-app reactions

**Address quickly:**
- Bugs that users report in the first 24 hours (customers are most forgiving right after launch)
- Confusing UI patterns flagged by support
- Edge cases that made it past testing

## Phase 5: Review (1 week after)

**Feature retrospective (15-minute async or sync):**
1. Did the feature hit the success metrics we defined?
2. What user feedback did we receive?
3. What went well in the launch process?
4. What would we do differently next time?
5. Any follow-up work identified (bugs, improvements, v2 ideas)?

**Update the roadmap:**
- Archive the feature spec with actual outcome vs. predicted outcome
- Add any follow-up items to the backlog
- Publish internal learnings (especially if something surprising happened)

## Launch types and the right process for each

| Type | Audience | Rollout | Communication | Monitoring |
|---|---|---|---|---|
| **Major** | All users, core flow | Feature flag, 5→50→100% | Email + in-app + blog | 72h active monitoring |
| **Moderate** | Specific segment | Gradual | In-app or email | 48h active monitoring |
| **Minor** | All users, non-core | Direct to 100% | Changelog only | 24h passive |
| **Internal** | Team only | Direct | Slack | Standard monitoring |
| **Beta** | Opt-in users | Invite-only | Invite email | Weekly check |

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
