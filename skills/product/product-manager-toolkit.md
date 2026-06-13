---
name: product-manager-toolkit
description: "Product manager toolkit: RICE prioritisation, PRD templates, feature spec writing, stakeholder alignment, go-to-market checklist, and discovery-to-delivery workflow"
updated: 2026-06-13
---

# Product Manager Toolkit Skill

## When to activate
- Prioritising a backlog of features with a structured framework
- Writing a PRD (Product Requirements Document) or feature spec
- Preparing a go-to-market plan for a new feature launch
- Running a stakeholder alignment session before building
- Synthesising customer discovery into actionable requirements
- Writing user stories with proper acceptance criteria

## When NOT to use
- Strategic product roadmap — use the product-roadmap skill
- User research and persona creation — use the ux-researcher skill
- A/B test design — use the experiment-designer skill
- Jira setup and sprint planning — use the jira-expert skill

## Instructions

### RICE prioritisation

```
Prioritise this feature backlog with RICE scoring.

Features to score: [list]
Team capacity: [X engineer-weeks per sprint]
Time horizon: [this quarter / this sprint / this month]

RICE formula:
Score = (Reach × Impact × Confidence) / Effort

REACH — users affected per quarter:
- Count the users who will actually use this feature in a 3-month window
- Not: "all users could theoretically benefit"
- Yes: "23% of our DAU who use the payments flow"
- Express as a number (e.g., 1,500 users)

IMPACT — impact per user (1-3 scale):
- 3: Massive — fundamentally changes how users work with the product
- 2: High — significant improvement to an important workflow
- 1: Medium — noticeable improvement
- 0.5: Low — minor convenience improvement
- 0.25: Minimal — cosmetic or edge-case only

CONFIDENCE — how certain are you (0-100%):
- 100%: Validated with data and research
- 80%: Some research, reasonable assumptions
- 50%: Gut feeling, no research yet
- 20%: Pure hypothesis, untested

EFFORT — engineer-weeks to build (including design, test, deploy):
- Be honest. Double your first estimate.
- Include: design, development, testing, docs, analytics instrumentation

Scoring table:
| Feature | Reach | Impact | Confidence | Effort | RICE Score | Notes |
|---|---|---|---|---|---|---|
| [Feature A] | 2500 | 2 | 80% | 3w | (2500×2×0.8)/3 = 1333 | |
| [Feature B] | 800 | 3 | 50% | 6w | (800×3×0.5)/6 = 200 | |

Output: ranked list + top 3 to build this sprint at [X] capacity.
```

### PRD template

```
Write a PRD for [feature].

Feature: [describe]
Problem it solves: [the user problem, not the feature description]
Who requested it: [customers / internal / data-driven]
Priority: [P0 critical / P1 high / P2 medium]
Target release: [sprint / quarter]

PRD structure:

## Overview
**Feature:** [Name]
**Author:** [PM name] | **Date:** [date] | **Status:** [Draft / Review / Approved]
**Engineering owner:** [name] | **Design owner:** [name]

## Problem statement
[2-3 sentences: who has this problem, what the problem costs them, and why solving it matters now. No solution language here.]

## Success metrics
Primary metric: [the one KPI that changes if this ships]
Secondary metrics: [1-2 supporting metrics]
Counter-metrics: [what we watch to make sure we're not breaking something else]

## User stories
Format: "As a [user type], I want to [action], so that [outcome]."

Happy path:
- As a [user], I want to [core action], so that [core value].

Edge cases:
- As a [user], when [edge condition], I want to [action], so that [outcome].

Error states:
- As a [user], when [error occurs], I want [feedback], so that [recovery action].

## Acceptance criteria
□ [Specific, testable condition — must be binary pass/fail]
□ [Another condition]
□ [Error handling condition]

## Scope

In scope:
- [Specific behaviour 1]
- [Specific behaviour 2]

Out of scope (explicit):
- [Thing we are NOT building in this version]
- [Edge case deferred to v2]

## Design and technical notes
[Link to Figma / design spec]
[Any technical constraints the PM is aware of]
[API or data model implications]

## Open questions
- [ ] [Question that needs resolution before build starts] — owner: [name] — due: [date]

## Launch plan
- [ ] Analytics instrumentation: [events to fire]
- [ ] Feature flag: [yes — rollout plan / no]
- [ ] Comms: [customer-facing? / internal only?]
- [ ] Docs update needed: [yes/no]

Generate the PRD for my feature using this structure.
```

### Feature specification

```
Write a detailed feature spec for [feature].

Feature: [name]
PRD: [link or paste key requirements]
Audience: [engineering team]

Spec structure (more technical than PRD):

## Feature: [Name]
**Version:** 1.0 | **Status:** Ready for development

## Functional requirements

### [Sub-feature or user flow name]
**Trigger:** [what initiates this flow]
**Actor:** [who performs this action]

Steps:
1. User [action] → System [response]
2. User [action] → System [response]

Data requirements:
- Input: [what data is needed]
- Output: [what data is returned/stored]
- Validation: [rules that govern valid input]

**Error states:**
| Condition | System response | User sees |
|---|---|---|
| [error condition] | [what happens] | [error message] |

## Non-functional requirements
- Performance: [response time target, e.g., < 200ms p99]
- Availability: [same SLA as rest of product]
- Data retention: [how long is this data kept?]
- Security: [any auth, permission, or PII considerations]

## API design (if applicable)
Endpoint: [METHOD /path]
Request body: [schema]
Response: [schema]
Error codes: [list]

## Analytics events to fire
| Event | When | Properties |
|---|---|---|
| [event_name] | [when it fires] | [key properties] |

## Rollout plan
- [ ] Feature flag key: [feature.flag.name]
- [ ] Internal test: [which team + when]
- [ ] Canary: [X% of users, starting when]
- [ ] Full release: [date or sprint]

Write the spec for my feature.
```

### Go-to-market checklist

```
Build a go-to-market checklist for [feature launch].

Feature: [describe]
Launch type: [major / minor / internal]
Audience: [all users / segment / new signups / B2B customers]
Launch date: [target]

Go-to-market checklist by role:

PRODUCT (owner):
□ Feature fully QA'd and bug-free on staging
□ Analytics events verified firing correctly (check in debug mode)
□ Feature flag configured with correct rollout %
□ Rollback plan documented (how to kill the flag if something goes wrong)
□ A/B test set up (if applicable)

ENGINEERING (lead):
□ All acceptance criteria met
□ Performance tested at expected load
□ Error monitoring set up for new code paths
□ Database migrations complete and tested
□ Feature flag kill switch tested

DESIGN:
□ Final designs implemented correctly (spot-check with designer)
□ Mobile responsive verified
□ Accessibility check passed
□ Empty and error states implemented

MARKETING (if customer-facing):
□ In-app announcement or tooltip written and reviewed
□ Email to affected users drafted (if needed)
□ Blog post or changelog entry ready to publish
□ Help docs updated or written
□ Sales team briefed on new capability

CUSTOMER SUCCESS (if enterprise):
□ CSMs briefed on the feature and key use cases
□ High-touch customers notified in advance
□ FAQs prepared for support team

LAUNCH DAY:
□ Feature flag enabled at [X]% (or 100% for minor)
□ Monitor: error rate on new endpoints for first 30 min
□ Monitor: p99 latency unchanged
□ Announcement published (in-app / email / blog)
□ Slack #launches update posted

POST-LAUNCH (1 week):
□ Primary metric: [X]% improvement vs. baseline
□ Error rate: back to normal
□ Support ticket volume: no spike on this feature
□ Qualitative: any user feedback on the feature?

Generate the checklist for my launch type and team structure.
```

## Example

**User:** PM at a SaaS company. Engineering is asking me to prioritise between: (A) CSV export, (B) Slack integration, (C) dark mode, (D) custom webhooks. We have 4 engineer-weeks next sprint. How do I decide?

**Claude's RICE analysis:**

I'll score these on your behalf with reasonable assumptions — you need to validate the numbers, but this structure will make the decision defensible.

**Assumptions I'm making (correct me if wrong):**
- You're B2B SaaS, ~500 MAU using the features in question
- No prior research or data on these specifically

| Feature | Reach | Impact | Confidence | Effort | RICE | Verdict |
|---|---|---|---|---|---|---|
| CSV export | 400 | 2 | 70% | 1w | 560 | **Build** |
| Slack integration | 200 | 3 | 60% | 3w | 120 | Maybe |
| Dark mode | 500 | 0.5 | 50% | 2w | 62 | Defer |
| Custom webhooks | 80 | 3 | 80% | 4w | 48 | Defer |

**Recommendation: CSV export this sprint, defer the rest.**

**Why CSV export wins:** Almost every user in a B2B product eventually needs to export data. High reach, quick to build, high confidence it's needed (if customers aren't asking for it yet, they will within 6 months of product maturity).

**Why Slack integration scores low:** The integration itself may take 3 weeks, but the Slack-to-value journey is long — users need to set it up, configure notifications, and change habits. Real reach is probably 30-40% of your estimate once adoption is factored in. Table it until you have customer validation.

**Why dark mode scores low:** It's a table-stakes feature that's almost never the reason someone buys or churns. Ship it eventually, but not at the cost of retention or acquisition features.

**Why custom webhooks scores low:** High impact per user, but only power users need it. The 80 users who need it are likely vocal but represent a small share of your growth leverage.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
