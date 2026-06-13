---
name: requirements-discovery
description: Structures unstructured customer requirements into a prioritized, scoped discovery document. Identifies functional, non-functional, and technical constraints. Delivers a Requirements Matrix (MoSCoW prioritization) and gaps analysis.
allowed-tools: Read, Write
effort: medium
---

# Requirements Discovery

## When to activate

When a customer articulates initial business needs, pain points, or desired outcomes without formal structure. Triggers: kickoff meeting notes, discovery call transcript, customer RFP, whiteboard sketch, Slack thread of requirements, or email chain discussing what they want to build. Always run before architecture design or scope baseline.

## When NOT to use

Not for pre-sales qualification — this is post-sale, post-contract discovery. Not for vendor selection (that's procurement). Not when requirements are already formalized in a detailed RFP. Not for maintenance or bug-fix requests (use triage instead). Not if customer has zero understanding of their own needs (run customer business review first).

## Discovery Checklist

1. **Functional Requirements** — What must the system DO? (user actions, integrations, data flows, reporting)
2. **Non-Functional Requirements** — How must it PERFORM? (latency, uptime, scale, security, compliance)
3. **Technical Constraints** — What tech is fixed or forbidden? (legacy systems, cloud provider, language, database)
4. **Business Constraints** — Budget, timeline, team skill gaps, regulatory
5. **Success Criteria** — How will we know it works? (KPIs, metrics, acceptance tests)
6. **Stakeholder Map** — Who decides? Who uses? Who pays? (roles, approval chains)

## Output Format

### Requirements Matrix (MoSCoW)

```
| Priority | Requirement | Scope | Effort | Risk | Dependency |
|---|---|---|---|---|---|
| Must | [description] | [e.g., MVP] | [S/M/L] | [L/M/H] | [if any] |
| Should | [description] | [e.g., Phase 2] | [S/M/L] | [L/M/H] | [if any] |
| Could | [description] | [e.g., Phase 3+] | [S/M/L] | [L/M/H] | [if any] |
| Won't | [description] | [Out of scope] | — | — | — |
```

### Gaps & Questions

```
**Clarification Needed:**
- [ ] [Open question] — Impacts [requirement or timeline]
- [ ] [Open question] — Impacts [requirement or timeline]

**Assumed Constraints:**
- [Assumption 1 — validate with customer]
- [Assumption 2 — validate with customer]

**Risk Flags:**
- [Risk 1 — mitigation: ...]
- [Risk 2 — mitigation: ...]
```

## Interview Guide

1. **Business Context:** What problem are we solving? Who benefits?
2. **Current State:** What do they do today? What's broken?
3. **Desired Future State:** What would success look like in 6 months?
4. **Users:** Who are the personas? How will they interact with the solution?
5. **Scale:** How many users? How much data? Growth trajectory?
6. **Tech Stack:** What systems must we integrate with? Any hard constraints?
7. **Timeline:** When must it be live? Any hard deadlines?
8. **Budget:** Ballpark spend? Any budget constraints?
9. **Acceptance:** How will you approve this is done?

## Example

**Customer Input:** "We need to replace our legacy order management system. It's slow, doesn't talk to our ERP, and we can't get reports. We have 50 internal users and 200 customer-facing portal users. Timeline: 6 months. Budget: $200k."

**Structured Output:**

| Priority | Requirement | Scope | Effort | Risk | Dependency |
|---|---|---|---|---|---|
| Must | Internal order intake & routing | MVP | L | L | None |
| Must | Real-time ERP sync (inventory, pricing) | MVP | M | H | ERP API |
| Must | Role-based access control (50 internal users) | MVP | M | M | Identity mgmt |
| Should | Customer self-service portal (200 users) | Phase 2 | M | M | Payment gateway |
| Should | Order reporting dashboard | Phase 2 | M | L | Data warehouse |
| Could | Mobile app for field sales | Phase 3 | L | M | Push notifications |
| Won't | Legacy system data migration | Out of scope | — | — | — |

**Gaps:**
- [ ] ERP API documentation — does it support real-time sync or batch only?
- [ ] Current data volume — orders per day, average order size?

---
