---
description: Generate a fully typed REST endpoint with validation, error handling, and tests
argument-hint: "[method] [path] [description]"
---
Generate a production-ready REST API endpoint from the specification: $ARGUMENTS

Parse the input as: HTTP method, path, and a short description of the resource operation.

Rules:
- Infer the framework from the existing codebase (Express, FastAPI, Gin, Rails, etc.)
- Match the project's existing file structure, naming conventions, and import style
- Define request/response types using the project's type system (TypeScript interfaces, Pydantic models, Go structs, etc.)
- Validate all inputs at the boundary — reject malformed requests before business logic runs
- Return standard HTTP status codes: 200/201 success, 400 bad request, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 422 unprocessable, 500 internal
- Never expose stack traces or internal error details in response bodies
- Extract business logic into a service layer, keep the controller thin
- Add authentication/authorization checks if the project uses middleware guards
- Write at least three tests: happy path, validation failure, not-found case
- Follow RESTful resource conventions — use nouns in paths, not verbs

Output:
1. Route/controller file (or addition to existing router)
2. Request/response type definitions
3. Service function stub (or implementation if the logic is simple)
4. Test file with the three required cases
5. Any migration or schema change if the endpoint touches the DB

If $ARGUMENTS is empty, ask: method, path, and what the endpoint does.
