---
name: code-to-prd
description: "Reverse-engineer a PRD from existing code — extract what was built, infer the product decisions made, and generate a proper product requirements document for documentation or handoff"
---

# Code to PRD Skill

## When to activate
- Documenting what was built without a written spec (technical debt in documentation)
- Onboarding a new PM who inherits undocumented features
- Preparing for a product handoff or team transition
- Auditing what was actually built vs. what was originally intended
- Creating documentation from a prototype that shipped without specs

## When NOT to use
- Writing a new PRD before building — use the product-manager-toolkit skill
- Documenting an API for external consumers — use the README generator
- Creating user-facing documentation — different audience and format

## Instructions

### Full feature PRD extraction

```
Reverse-engineer a PRD from this codebase/feature.

Feature/codebase: [describe or point to relevant files]
Read: [list key files — routes, models, UI components, tests]

Extraction process:

STEP 1 — WHAT WAS BUILT (from code):
- What data does this feature create, read, update, or delete?
- What are the entry points? (API endpoints, UI pages, CLI commands)
- What are the outputs? (responses, emails, notifications, side effects)
- What validation rules exist? (from Zod schemas, guard clauses, or tests)
- What error states are handled?

STEP 2 — INFER THE PRODUCT DECISIONS:
- Who is this for? (infer from UX patterns, naming, test data)
- What problem does it solve? (infer from the feature's logic and context)
- What did they intentionally NOT include? (what's missing that you'd expect?)
- What are the implied constraints? (auth requirements, rate limits, data limits)

STEP 3 — GENERATE THE PRD:

## Feature: [Name]
**Built:** [date from git history]
**Author:** [from git log]
**Status:** Shipped

### Problem statement
[What problem this feature solves — inferred from the implementation]

### Users
[Who this is for — inferred from auth logic, UI patterns, test data]

### What was built
#### User journeys
[Describe the flows the code enables]

#### Data model
[Tables/collections affected + key fields]

#### API surface
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| [path] | [GET/POST/etc] | [yes/no/role] | [what it does] |

#### Business rules
[Validation logic, limits, permissions found in the code]

#### Error handling
[Error states implemented and their responses]

### What was NOT built (gaps)
[Things you'd expect but aren't present — missing validation, no pagination, no audit log, etc.]

### Open questions
[Things that couldn't be inferred from the code alone]

Generate the PRD for the feature I describe.
```

### Single-file analysis

```
Extract PRD elements from [file].

File: [paste file or path]

Analyse and extract:
1. PURPOSE: What is this file doing? (1-2 sentences)
2. INPUTS: What data comes in? (parameters, request body, env vars)
3. OUTPUTS: What does it return or produce?
4. BUSINESS RULES: What logic/validation/decisions are embedded?
5. DEPENDENCIES: What does it rely on? (services, DB, external APIs)
6. IMPLICIT REQUIREMENTS: What must be true for this to work? (auth, permissions, data shape)
7. EDGE CASES HANDLED: What failure modes are explicitly handled?
8. GAPS: What's missing that a production version would need?
```

### Git history analysis

```
Reconstruct product history from git log.

Repository: [current directory]
Feature branch or path: [e.g. src/payments/ or main branch]
Period: [last 6 months / since v1.0 / all time]

Run: git log --follow --stat -- [path]

From the commit history, extract:
1. TIMELINE: When was each major piece built?
2. ITERATIONS: What changed after initial build? (bugfixes, feature additions, removals)
3. DECISIONS VISIBLE IN CODE: What was refactored and why? (infer from commit messages)
4. WHAT WAS REMOVED: Any deleted functionality?

Output: a narrative product history for this feature/area.
```

## Example

**User:** We shipped an invoice feature 6 months ago with no spec. New PM is joining. Generate the PRD from the code.

**Claude reads:**
- `src/api/invoices/route.ts` (API endpoints)
- `db/schema.ts` (invoices table)
- `src/services/invoices.ts` (business logic)
- `src/emails/InvoicePaidEmail.tsx` (email template)
- `tests/invoices.test.ts` (test cases)

**Claude's PRD output:**

```markdown
## Feature: Invoice Management
**Built:** January 2026 (git log shows initial commit: Jan 8 2026)
**Status:** Shipped, in production

### Problem statement
Customers needed to send invoices to their clients and track payment status. Previously done manually via email with attached PDFs.

### Users
Primary: Business owners (inferred from auth middleware requiring `role: 'business'`)
Secondary: Their clients receive invoices (no account required to pay)

### What was built

#### User journeys
1. Create invoice → set client email, line items, due date
2. Send invoice → client receives email with payment link
3. Client pays → Stripe webhook marks as paid → owner notified
4. Owner views invoice list → filter by status (draft/sent/paid/overdue)

#### Data model
**invoices table:**
- id, userId (FK), clientEmail, clientName
- lineItems (JSONB), totalCents
- status: draft | sent | paid | overdue
- dueDate, sentAt, paidAt
- stripePaymentIntentId

#### API surface
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| /api/invoices | GET | user | List user's invoices |
| /api/invoices | POST | user | Create invoice |
| /api/invoices/:id | PATCH | user (owner) | Update draft invoice |
| /api/invoices/:id/send | POST | user (owner) | Send to client |
| /api/invoices/:id/pay | POST | none | Client payment page |

#### Business rules
- Only `draft` invoices can be edited (enforced in service layer)
- Total is calculated server-side from lineItems (client can't set total directly)
- Invoices with dueDate in the past and status=sent are marked overdue by a daily cron
- Payment creates a Stripe PaymentIntent; webhook confirms payment

### Gaps (not built)
- No PDF download for paid invoices
- No invoice numbering system (invoices have UUIDs, not INV-001 format)
- No partial payments
- No invoice templates
- No tax calculation
- Client-side: no payment retry if card declined (just redirects to error page)

### Open questions
- Are cancelled invoices tracked? (no cancel endpoint found — deletion is the only option)
- Is there a plan to add recurring invoices? (no evidence in code)
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
