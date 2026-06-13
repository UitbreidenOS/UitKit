---
description: Runs the requirements-discovery skill to structure customer needs. Synthesizes unstructured input (kickoff notes, RFP, call transcript, slack thread) into prioritized Requirements Matrix (MoSCoW). Saves to requirements/{name}-matrix.md.
---

# /discover-requirements

## What This Does

Transforms unstructured customer input into a formal Requirements Matrix. Runs the requirements-discovery skill to: identify functional/non-functional/technical requirements, uncover hidden constraints, map stakeholders, assess feasibility, flag gaps, and prioritize using MoSCoW method (Must/Should/Could/Won't).

## Steps Claude Follows

1. Ask for: customer name, any existing requirements docs or notes
2. Conduct interview using discovery checklist (if no docs provided)
   - Business context: What problem are we solving?
   - Current state: What do they do today?
   - Desired future: What would success look like?
   - Users: Who uses it? How?
   - Scale: How many users? Data volume? Growth?
   - Tech constraints: Existing systems? Forbidden tech?
   - Timeline: When needed? Hard deadlines?
   - Budget: Ballpark spend?
   - Acceptance: How will you approve it's done?
3. Or parse customer's existing docs/notes/transcript for requirements
4. Extract functional requirements (what it must DO)
5. Extract non-functional requirements (how it must PERFORM)
6. Extract technical constraints (what tech is fixed or forbidden)
7. Extract business constraints (budget, timeline, team skill gaps, regulatory)
8. Identify success criteria (how we measure success)
9. Map stakeholder landscape (who decides, who uses, who pays)
10. Create Requirements Matrix with MoSCoW prioritization
11. Identify gaps and assumptions to validate
12. Flag risks (technical, schedule, budget)
13. Save matrix to requirements/{customer-name}-matrix.md
14. Display summary with next actions

## Output Format

```markdown
# [Customer] — Requirements Discovery

## Business Context
[Problem statement, objectives]

## Current State
[What they do today, pain points]

## Desired Future State
[Vision, success metrics]

## Stakeholder Map
[Roles, decision authority, usage patterns]

## Requirements Matrix (MoSCoW)
[Table: Priority, Requirement, Scope, Effort, Risk, Dependency]

## Functional Requirements
[What the system must DO]

## Non-Functional Requirements
[Performance, scale, reliability, security targets]

## Technical Constraints
[Fixed tech, integrations, legacy systems]

## Business Constraints
[Budget, timeline, team skills, regulatory]

## Success Criteria
[Metrics, KPIs, acceptance tests]

## Gaps & Clarifications
[Open questions, assumptions to validate]

## Risk Flags
[Potential issues and mitigation]

## Next Steps
[What happens now]
```

## Next Actions

- Confirm Requirements Matrix with customer (approval gate)
- Run `/design-system` to create architecture based on these requirements
- Run `/assess-capacity` to forecast resource needs

## Example Usage

```
/discover-requirements

You: We're kicking off a new project with Acme Corp. Can you help structure requirements?

Claude: Sure! Let me ask some questions about Acme's needs.

[Claude runs interview, or you paste meeting notes]

Claude: Here's the Requirements Matrix for Acme.

Must Have (MVP, 3 months):
- Internal order intake & routing
- Real-time ERP sync (inventory, pricing)
- Role-based access control

Should Have (Phase 2, 6 months):
- Customer self-service portal
- Reporting dashboard

Could Have (Phase 3+):
- Mobile app for field sales

Won't Have (out of scope):
- Legacy system migration

ICP Score: 95/100 (high-fit customer)
Timeline: 6 months, $200K budget
Risks: ERP integration complexity, change management

See: requirements/acme-matrix.md

Next steps:
1. Review with Acme stakeholders (marketing, product, IT)
2. Get sign-off on Must/Should/Could priorities
3. Then /design-system to create architecture
```
