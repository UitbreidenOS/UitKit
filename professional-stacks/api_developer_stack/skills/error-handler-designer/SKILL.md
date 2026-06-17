---
name: error-handler-designer
description: Design consistent, actionable error response schemas with proper HTTP status codes and error categorization
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Designing error response format for new APIs
- Standardizing error codes across microservices
- Creating error documentation for API consumers
- Implementing global error handling middleware
- Mapping domain errors to HTTP status codes

## When NOT to use

- For client-side error display/UI
- For logging and observability setup
- For exception tracking tool integration

## Instructions

1. **Define error schema.** Standard format: `{ error: { code, message, details, requestId, docsUrl } }`.
2. **Map HTTP status codes.** 400=validation, 401=auth, 403=permission, 404=not found, 409=conflict, 422=unprocessable, 429=rate limit, 500=server error.
3. **Create error code catalog.** Machine-readable codes: `VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`, `RATE_LIMIT_EXCEEDED`, etc.
4. **Design validation errors.** Return field-level errors: `{ field: "email", message: "must be valid email", code: "INVALID_FORMAT" }`.
5. **Add request context.** Include `requestId` for debugging, `timestamp`, and `path` in every error response.
6. **Link to documentation.** Include `docsUrl` pointing to relevant API docs for self-service resolution.
7. **Implement middleware.** Global error handler that catches exceptions and formats to standard schema.

## Example

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body failed validation",
    "details": [
      { "field": "email", "message": "must be a valid email address", "code": "INVALID_FORMAT" },
      { "field": "age", "message": "must be between 18 and 120", "code": "OUT_OF_RANGE" }
    ],
    "requestId": "req_abc123",
    "docsUrl": "https://api.example.com/docs/errors#VALIDATION_ERROR"
  }
}
```
