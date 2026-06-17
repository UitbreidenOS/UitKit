# Documentation Outliner

## When to activate
User runs `/outline-docs` or needs to generate table of contents and structure for a doc set.

## When NOT to use
Do not use for editing existing documentation; use this only for planning and structure.

## Instructions

1. Accept feature brief or existing feature description.
2. Generate hierarchical table of contents:
   - Guides (user-facing, step-by-step)
   - API Reference (endpoints, parameters, responses)
   - Conceptual Docs (explain the "why")
   - Troubleshooting (common problems and solutions)
3. Define audience and reading level for each doc type.
4. Link cross-references between related docs.
5. Provide word count estimate for each doc.
6. Return outline in markdown with clear hierarchy.

## Example

**Input:** "We're shipping a new webhook API for order events."

**Output:**
```
# Webhook Documentation Set

## Guides (2,000 words)
- Getting Started with Webhooks (prerequisites, first webhook setup)
- Managing Endpoints (CRUD, retries, testing)

## API Reference (1,500 words)
- Webhook Endpoints (POST, GET, DELETE)
- Event Payloads (order.created, order.updated, order.cancelled)
- Error Codes and Retries

## Conceptual (1,200 words)
- How Webhooks Work (event flow, delivery guarantees)
- Security (signing, validation)

## Troubleshooting (800 words)
- Common Issues (timeouts, 401 errors, payload validation)
- Debugging (logs, test events)

**Audience:** Backend developers familiar with REST APIs, unfamiliar with webhooks
**Reading Level:** College (Flesch 50–60)
**Total:** 5,500 words across 4 doc types
**Cross-links:** [webhook architecture diagram], [event types reference]
```
