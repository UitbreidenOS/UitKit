---
description: Generate or update an OpenAPI 3.1 spec from existing routes or a description
argument-hint: "[source-file-or-description]"
---
Generate or update an OpenAPI 3.1 specification based on: $ARGUMENTS

If $ARGUMENTS is a file path, read the route definitions from that file. If it is a description, scaffold a spec from scratch. If empty, scan the codebase for all route definitions and generate a complete spec.

Requirements:
- Use OpenAPI 3.1.0 (not 3.0.x — use `type: "null"` not `nullable: true`)
- Every path must have: summary, operationId (camelCase, unique), tags, parameters, requestBody (if applicable), and responses
- Define all schemas under `components/schemas` — inline schemas in path items are forbidden
- Use `$ref` for any schema referenced more than once
- Document every possible response status code the code actually returns — do not invent extra ones
- Required fields must be in `required` arrays — no silent optionals
- Enum values must match what the code enforces
- Include security scheme definitions if the API uses auth (Bearer JWT, API key, OAuth2, etc.)
- Add `description` fields on all non-obvious properties
- Mark deprecated endpoints with `deprecated: true` if found

Format rules:
- YAML output, 2-space indent
- Keep `paths` sorted alphabetically by route
- Keep `components/schemas` sorted alphabetically

Output the full `openapi.yaml` file. If updating an existing spec, show only the changed sections with enough context to place them, then write the complete updated file.

If route source is ambiguous or framework-specific decorators are unrecognized, list which routes were skipped and why.
