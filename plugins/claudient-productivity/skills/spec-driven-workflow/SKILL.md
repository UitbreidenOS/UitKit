---
name: "spec-driven-workflow"
description: "Spec-driven development: write the spec first, then tests, then implementation — reduces rework, clarifies requirements before coding, and produces better-documented systems"
---

# Spec-Driven Workflow Skill

## When to activate
- Starting a non-trivial feature where requirements are ambiguous
- Building an API or interface that other teams will depend on
- Reducing rework caused by building the wrong thing
- Practising test-driven development (TDD) at the feature level
- Wanting Claude to understand the spec before writing any code

## When NOT to use
- Tiny bug fixes — just fix them
- Exploratory prototypes where the goal is to learn, not ship
- Tasks where the spec is already perfectly clear and written
- Hotfixes that need to go out immediately

## Instructions

### Spec-first template

```
Write a spec for [feature].

Feature: [describe in plain English what you want to build]
Users: [who will use this feature]
Context: [where this fits in the system — which service, page, or API]
Constraints: [performance, security, backwards-compatibility, existing interfaces]

Spec template:

## Feature: [Name]

### Summary
[1-2 sentences — what this feature does and why]

### Background
[Why are we building this? What problem does it solve?]

### Scope
In scope:
- [Specific behaviour 1]
- [Specific behaviour 2]

Out of scope (explicit):
- [Thing we are NOT building]
- [Edge case we are deferring]

### Interface definition
[For an API: endpoints, inputs, outputs, status codes]
[For a UI: user journey, states, transitions]
[For a library: function signatures, types, return values]

Example (API):
POST /api/invoices
Request:
  { customer_id: string, items: [{sku: string, qty: int, price_cents: int}], due_date: string }
Response 201:
  { invoice_id: string, total_cents: int, pdf_url: string }
Response 400:
  { error: "invalid_customer" | "items_empty" | "invalid_date" }

### Acceptance criteria (testable)
Format: Given [context], when [action], then [observable result]

- GIVEN a valid customer and items, WHEN the endpoint is called, THEN a 201 response with invoice_id is returned
- GIVEN an invalid customer_id, WHEN the endpoint is called, THEN a 400 response with error: "invalid_customer" is returned
- GIVEN empty items array, WHEN the endpoint is called, THEN a 400 response is returned
- GIVEN items with negative price, WHEN the endpoint is called, THEN a 400 response is returned

### Open questions (resolve before building)
- [ ] [Question 1 — decision needed]
- [ ] [Question 2 — assumption to validate]

### Dependencies
- [External service or API this depends on]
- [Internal service or team dependency]

Write the full spec for my feature.
```

### Spec-to-test translation

```
Convert this spec into failing tests before implementation.

Spec: [paste spec from above]
Language/framework: [TypeScript/Jest / Python/pytest / Go/testing / Ruby/RSpec]

Rules for spec-to-test:
1. One test per acceptance criterion
2. Test the interface (inputs/outputs), not the implementation
3. Tests should be readable as documentation — someone should understand the feature by reading the tests
4. Unhappy paths are as important as happy paths

TypeScript/Jest example (from the invoice spec above):

describe('POST /api/invoices', () => {
  describe('success cases', () => {
    it('creates an invoice with valid inputs and returns 201 with invoice_id', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [{ sku: 'SKU-001', qty: 2, price_cents: 2999 }],
        due_date: '2026-12-31',
      });
      
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        invoice_id: expect.stringMatching(/^inv_/),
        total_cents: 5998,
        pdf_url: expect.stringContaining('https://'),
      });
    });
  });

  describe('validation errors', () => {
    it('returns 400 with invalid_customer when customer_id does not exist', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_nonexistent',
        items: [{ sku: 'SKU-001', qty: 1, price_cents: 1000 }],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid_customer');
    });

    it('returns 400 when items array is empty', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('items_empty');
    });
  });
});

Convert my spec into failing tests. Tests should fail until I implement the feature.
```

### Implementation from spec

```
Implement [feature] according to this spec and tests.

Spec: [paste spec]
Tests: [paste failing tests]
Language/framework: [specify]
Existing code context: [paste relevant existing interfaces, types, or adjacent code]

Implementation rules:
1. Make the tests pass — nothing more, nothing less
2. Don't build features not in the spec (even if they seem obviously needed)
3. Don't optimise prematurely — simple and correct beats clever
4. Handle every error case in the spec's acceptance criteria
5. Ask if an acceptance criterion is ambiguous rather than assuming

Implementation order:
1. Define types / interfaces first (compiles to no output, documents the shape)
2. Happy path implementation (make the 201 test pass)
3. Validation and error handling (make the 400 tests pass)
4. Edge cases (if any remain in the spec)
5. Run all tests — confirm all pass before submitting

Code produced must:
- Not have TODOs or placeholder comments
- Have no commented-out code
- Compile and run without modification

Implement the feature.
```

### Spec review

```
Review this spec before we build it.

Spec: [paste]
Goal: catch ambiguities, missing edge cases, and misaligned assumptions before coding

Review checklist:

COMPLETENESS:
□ Are all inputs fully specified (types, formats, constraints)?
□ Are all outputs fully specified (success + error responses)?
□ Are all error states enumerated?
□ Are acceptance criteria specific and testable?
□ Are out-of-scope items explicitly stated?

AMBIGUITY:
□ Is any criterion open to multiple interpretations?
□ Are terms used consistently throughout?
□ Are assumptions implicit that should be explicit?
□ Does "due_date: string" need a format spec? (ISO 8601? YYYY-MM-DD? Timezone-aware?)

MISSING EDGE CASES:
□ What happens with empty inputs?
□ What happens with maximum-size inputs?
□ What happens if a dependency is unavailable?
□ What happens with concurrent requests?
□ What happens after rate limiting?

INTERFACE REVIEW:
□ Is the API consistent with existing endpoints?
□ Are naming conventions followed?
□ Is the response format consistent with other endpoints?
□ Are status codes used correctly (201 for create, 200 for update, 404 for not found)?

OPEN QUESTIONS:
□ Are all open questions resolved before we build?
□ Are any decisions being deferred that should be made now?

Produce: list of gaps and questions to resolve before implementation begins.
```

## Example

**User:** I want to build a feature where users can upload a CSV of contacts and bulk-import them. Help me spec it first.

**Claude's spec:**

---

## Feature: Bulk Contact Import via CSV

### Summary
Allow users to upload a CSV file containing contact data. The system validates each row, imports valid contacts, and returns a report showing successes and failures.

### Scope
In scope:
- CSV file upload via API endpoint
- Validation of each row (required fields, format)
- Import of valid rows as contacts
- Per-row error reporting (which rows failed and why)
- Duplicate detection (same email → skip or update, configurable)

Out of scope:
- UI file picker (API only for now)
- CSV template download
- Async processing for files > 10,000 rows (synchronous for v1)
- Contact deduplication across existing contacts (email match only)

### Interface definition

```
POST /api/contacts/import
Content-Type: multipart/form-data

Fields:
  file: CSV file (required)
  duplicate_strategy: "skip" | "update" (optional, default: "skip")

CSV format (header row required):
  email (required), first_name, last_name, phone, company

Response 200 (always 200, even if some rows failed):
{
  total_rows: 847,
  imported: 821,
  skipped: 14,        // duplicates
  failed: 12,          // validation errors
  errors: [
    { row: 3,  email: "bad-email", reason: "invalid_email_format" },
    { row: 17, email: null,       reason: "email_required" },
  ]
}

Response 400 (file-level errors before processing):
  { error: "no_file_attached" | "invalid_file_type" | "file_too_large" }
  Max file size: 10MB
```

### Acceptance criteria
- GIVEN a valid CSV with 100 rows, WHEN imported, THEN 200 is returned with imported: 100
- GIVEN a CSV with 1 invalid email, WHEN imported, THEN the row is in errors[], all others imported
- GIVEN no file attached, WHEN the endpoint is called, THEN 400 with no_file_attached
- GIVEN a .xlsx file, WHEN uploaded, THEN 400 with invalid_file_type
- GIVEN duplicate_strategy: "skip" and a duplicate email, WHEN imported, THEN duplicate is in skipped count
- GIVEN duplicate_strategy: "update" and a duplicate email, WHEN imported, THEN the existing contact is updated

### Open questions (resolve before building)
- [ ] What is the max number of rows per file? (proposed: 10,000 — need PM sign-off)
- [ ] What fields are required vs optional? (proposed: email only required)
- [ ] Is "company" a free-text string or linked to a Company record?
- [ ] Who can call this endpoint — all users or only admins?

---

Resolve the open questions first, then I'll generate the failing tests.

---
