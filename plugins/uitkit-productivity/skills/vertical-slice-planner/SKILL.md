---
name: "vertical-slice-planner"
description: "- Planning a new feature or project before building starts"
---

# Vertical Slice Planner

## When to activate

- Planning a new feature or project before building starts
- User wants to break down a feature into work units before writing code
- Claude defaulted to a sequential "database → API → frontend" phased plan and you want cross-layer slices instead
- You need to order work by risk or value rather than by technical layer
- Feature scope is unclear and needs decomposition into independently shippable increments

## When NOT to use

- Simple single-endpoint tasks or small bug fixes scoped to one layer
- Tasks that are already a single vertical unit (e.g., "add a new field to this form")
- Very small tasks under half a day of estimated work — merge them, don't slice them
- When the team has already committed to a specific phased delivery contract and cannot reorder work

## Instructions

**The problem with sequential phases:**

AI models default to: Phase 1 = database schema, Phase 2 = API endpoints, Phase 3 = frontend. This delays end-to-end integration feedback until the last phase, where architectural problems surface too late to fix cheaply. You don't see a working path through the system until phase 3 is done.

**Vertical slicing approach:**

Each slice is a thin cut across all layers — database + API + frontend + acceptance criteria — that delivers a working, testable end-to-end capability. Every slice ships independently. A slice is done when a user can interact with it, not when a layer is done.

---

**Step 1 — Identify the core user actions (not technical components)**

Ask: "What can the user actually *do*?" — not "What tables do we need?"

Bad decomposition: `users table → /users endpoint → UserList component`
Good decomposition: `user can search by name → user can filter by status → user can export results`

List each distinct user action. These become your slice candidates.

---

**Step 2 — Order slices by value and risk**

Rank slices:
- Highest business value first — what unblocks the most downstream work or user testing?
- Highest integration risk first — what has the most unknowns across layers?
- Tracer bullet first in execution — the thinnest possible path that validates the architecture before building content

---

**Step 3 — Define each slice**

Use this template for every slice:

```
Slice: [Name]
User action: [What the user does — written as a user action, not a technical task]
Layers:
  Database: [schema change, migration, or query involved]
  API:      [endpoint(s) — method, path, request/response shape]
  Frontend: [UI component(s) affected]
  Integration: [any external service calls, queues, or event emissions]
Acceptance criteria:
  - [Specific, testable condition — observable behavior, not implementation detail]
  - [Additional condition]
Definition of done: [How to verify this slice is fully complete and ready to merge]
Estimate: [days]
```

---

**Step 4 — Size each slice**

Target 1–3 days of work per slice. If a slice takes longer, split it. Signals a slice is too large:
- More than two API endpoints created in one slice
- Schema migration and business logic in the same slice
- Frontend and a new background job in the same slice

Slices shorter than half a day are too granular — merge them with an adjacent slice.

---

**Step 5 — Start with a tracer bullet**

The first slice to execute is the thinnest possible path across all layers — even if it returns empty results or stub data. This validates:
- The database can be queried from the API
- The API response reaches the frontend
- The frontend can render the shape of a real response

If the tracer bullet breaks, you've found your hardest problem on day one — when it's cheapest to fix.

Build content (real queries, real UI, real validation) in subsequent slices on top of a proven foundation.

---

**Output format:**

```
VERTICAL SLICE PLAN — [Feature Name]

User actions identified: [list]
Slice order rationale: [one sentence on why this order]

Slice 1 (Tracer): [name] — [one-line description]
Slice 2: [name] — [one-line description]
...

[Full slice definition for each slice using the template above]
```

## Example

**Input:** "Plan the search feature for our product catalog. Break it into vertical slices ordered by risk."

**Expected output:**

```
VERTICAL SLICE PLAN — Product Catalog Search

User actions identified: search by keyword, filter by category/price, sort results, paginate results
Slice order rationale: tracer bullet first to validate search infrastructure, core search next, filters last (highest implementation complexity)

Slice 1 (Tracer): Basic search endpoint returns empty results
Slice 2: Keyword search returns matching products
Slice 3: Filter by category and price range
Slice 4: Pagination

---

Slice 1 (Tracer): Basic search endpoint returns empty results
User action: User submits a search query and receives a response (empty is acceptable)
Layers:
  Database: Add products table with name, description, price, category columns; seed 10 records
  API:      GET /search?q= → returns { results: [], total: 0 }
  Frontend: Search box + results list renders an empty state message
  Integration: none
Acceptance criteria:
  - Submitting any query returns HTTP 200 with the correct response shape
  - Frontend renders without errors when results array is empty
Definition of done: End-to-end request from search box to database and back completes without errors
Estimate: 0.5 days

Slice 2: Keyword search returns matching products
User action: User searches by keyword and sees matching products
Layers:
  Database: Full-text index on name and description columns
  API:      GET /search?q= → returns { results: [{ id, name, price, category }], total: N }
  Frontend: Results list renders product cards with name and price
  Integration: none
Acceptance criteria:
  - Searching "laptop" returns products with "laptop" in name or description
  - Results are ordered by relevance (name match ranked above description match)
  - Empty query returns all products up to page size
Definition of done: Search returns accurate results for 10 test queries; result cards render correctly
Estimate: 2 days

Slice 3: Filter by category and price range
User action: User narrows results using category dropdown and price range inputs
Layers:
  Database: Query updated to accept category and price_min/price_max parameters
  API:      GET /search?q=&category=&price_min=&price_max=
  Frontend: Filter panel with category dropdown and price range inputs; results update on apply
  Integration: none
Acceptance criteria:
  - Applying a category filter returns only products in that category
  - Price range filter returns only products within the range
  - Filters combine correctly with keyword search
Definition of done: All filter combinations tested; filter state persists on page refresh
Estimate: 1.5 days

Slice 4: Pagination
User action: User navigates through multiple pages of results
Layers:
  Database: LIMIT/OFFSET applied to query
  API:      GET /search?q=&page=&page_size= → adds { page, total_pages } to response
  Frontend: Pagination controls render; page state updates URL
  Integration: none
Acceptance criteria:
  - Page 2 returns the correct offset of results
  - Total pages reflects actual result count
  - Navigating to a paginated URL directly returns the correct page
Definition of done: Pagination works across all filter and search combinations
Estimate: 1 day
```

---
