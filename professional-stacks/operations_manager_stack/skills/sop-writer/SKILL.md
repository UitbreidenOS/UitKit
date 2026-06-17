---
name: sop-writer
description: Create standard operating procedures with step-by-step guides, roles, quality checks, and version control
allowed-tools: [Read, Write, Grep]
effort: low
---

## When to activate

- Documenting repeatable processes as SOPs
- Onboarding new team members who need process guidance
- Standardizing workflows across teams or locations
- Updating existing SOPs after process changes
- Creating compliance documentation

## When NOT to use

- For one-time project plans
- For strategic planning documents
- For technical API documentation

## Instructions

1. **Define SOP metadata.** Title, SOP number, version, effective date, owner, reviewers, approval authority.
2. **Write purpose and scope.** Why this SOP exists and what processes it covers (and doesn't cover).
3. **List prerequisites.** Tools, access, permissions, and materials needed before starting.
4. **Write step-by-step procedure.** Numbered steps with clear actions, responsible roles, and expected outputs.
5. **Add decision points.** If/then branches for common variations and exception handling.
6. **Define quality checks.** Inspection points, approval gates, and acceptance criteria.
7. **Include references.** Related SOPs, policies, forms, and escalation contacts.

## Example

```
SOP-OPS-003: Vendor Onboarding
Version: 2.1 | Effective: 2026-06-01 | Owner: Operations Manager

Purpose: Standardize the process for evaluating and onboarding new vendors.

Prerequisites:
- Vendor has submitted application form
- Budget approval obtained from department head

Procedure:
1. [Ops Coordinator] Receive and log vendor application in vendor tracker
2. [Ops Coordinator] Verify required documents: W-9, insurance certificate, references
   → If missing: Request within 48h or reject
3. [Ops Manager] Review vendor against evaluation criteria (quality, cost, SLA capability)
4. [Procurement] Negotiate terms and execute MSA
5. [Finance] Set up vendor in payment system
6. [Ops Coordinator] Schedule vendor kickoff meeting
```
