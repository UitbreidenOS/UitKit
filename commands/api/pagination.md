---
description: Add cursor-based or offset pagination to a list endpoint with consistent response shape
argument-hint: "[endpoint-or-model]"
---
Add pagination to the endpoint or resource: $ARGUMENTS

If $ARGUMENTS is empty, find all list endpoints (those returning arrays) and apply pagination to each.

Choose the pagination strategy based on use case:
- Cursor-based (default for most feeds and large datasets): stable under concurrent writes, supports infinite scroll, cannot jump to arbitrary page
- Offset/page-based (only if the UI requires "go to page N"): simpler but inconsistent under writes

Cursor-based implementation:
- Cursor encodes the sort column value + primary key of the last seen row — base64-encode it, never expose raw DB values
- Default sort: descending by `created_at`, secondary sort by `id` for tie-breaking
- Accept `cursor` (opaque string) and `limit` (integer, 1–100, default 20) as query params
- Validate `limit` — reject < 1 or > 100 with 400
- Response shape:
  ```json
  {
    "data": [...],
    "pagination": {
      "next_cursor": "<opaque>",
      "has_more": true,
      "limit": 20
    }
  }
  ```
- `next_cursor` is null when there are no more pages
- Never leak total count unless explicitly required — it is expensive at scale

Offset-based implementation (only if requested):
- Accept `page` (1-indexed) and `per_page` (1–100, default 20)
- Include `total`, `page`, `per_page`, `total_pages` in the response envelope

Both strategies:
- Add a database index on the sort column if one does not exist
- The query must be a single DB call — no N+1 from fetching count separately unless offset pagination requires it
- Update the OpenAPI spec for the endpoint if one exists

Write tests: first page, second page via cursor, empty result, limit boundary validation.
