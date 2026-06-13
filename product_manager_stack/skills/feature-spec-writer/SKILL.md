---
name: feature-spec-writer
description: Converts a finalized PRD into a detailed technical specification for engineering. Includes: API contracts, database schema changes, edge cases, error handling, rollout plan, rollback procedures, and testing strategy. Returns a spec that an engineer can code from with high confidence.
allowed-tools: Read, Write
effort: high
---

# Feature Spec Writer

## When to activate
After the PRD is final and approved. Use this to create the spec that engineers will code from.

## When NOT to use
Do not use before PRD approval — the PRD is the source of truth. Do not use for bug fixes or small refinements.

## Instructions

1. Read the approved PRD. Extract: acceptance criteria, success metrics, edge cases, and non-scope.
2. Define API contracts:
   - New endpoints (if applicable): path, method, request/response schema, error codes.
   - Modified endpoints: what changed, backward compatibility, migration plan.
3. Define data model changes:
   - New tables/collections: schema with field types, constraints, indexing.
   - Migrations: data migration logic for existing production data.
4. Define edge cases and error handling:
   - What if [condition]? How should the system respond?
   - Error codes and messages for each failure mode.
5. Define rollout and rollback:
   - Feature flag strategy: gradual rollout percentage.
   - Rollback procedure: if something breaks, how do we revert?
   - Deployment order: if this touches multiple services, which order?
6. Testing strategy:
   - Unit tests: what functions/methods need coverage.
   - Integration tests: what systems need to talk to each other?
   - Load tests: is there a performance concern?
   - User acceptance test (UAT) checklist from acceptance criteria.

## Output Format

```
# Technical Specification — [Feature Name]

## API Changes

### New Endpoint: POST /api/[resource]
```json
Request: {
  "field1": "type",
  "field2": "type"
}

Response (201): {
  "id": "uuid",
  "field1": "value"
}

Error (400): {"error": "field1 is required"}
```

### Modified Endpoint: GET /api/[existing]
**Breaking change:** Added required parameter [X]
**Migration:** Old clients still work; return both [old_field] and [new_field] for 2 weeks.

---

## Data Model Changes

### New Table: [table_name]
```sql
CREATE TABLE [table] (
  id UUID PRIMARY KEY,
  field1 VARCHAR(255) NOT NULL,
  field2 INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_field1 ON [table](field1);
```

### Migration Logic
[SQL or migration script for backfilling existing data]

---

## Edge Cases & Error Handling
- If [condition], return [error code] with message "[human message]"
- Rate limit: [X requests] per [period]
- Concurrency: [what happens if two users modify the same thing]

---

## Rollout Plan
- Feature flag: [flag_name]; gradual rollout 10% → 50% → 100% over 3 days
- Monitoring: Watch [metric1] and [metric2] during rollout
- Rollback: Disable flag; no data cleanup needed (data is backward-compatible)

---

## Testing Checklist
- [ ] Unit: [function] handles [edge case]
- [ ] Integration: [Service A] calls [Service B] correctly
- [ ] Load: [endpoint] sustains [X qps] with <500ms p95
- [ ] UAT: All acceptance criteria verified in staging

---

## Deployment Order
1. Deploy database migration (if any)
2. Deploy service [X]
3. Enable feature flag at 10%
4. Monitor for [period]
5. Increase to 100% if healthy
```

---
