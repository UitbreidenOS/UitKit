---
name: openapi-spec-writer
description: Generate comprehensive OpenAPI 3.1 specifications from API design requirements and existing endpoints
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Creating OpenAPI specs for new APIs
- Documenting existing APIs from code
- Updating specs when adding new endpoints
- Generating specs from database models or route definitions
- Creating API contracts for frontend/backend alignment

## When NOT to use

- For GraphQL schema design (use GraphQL SDL)
- For gRPC protobuf definitions
- For WebSocket API documentation

## Instructions

1. **Gather API requirements.** Resources, relationships, actions, and data models.
2. **Define info block.** Title, version, description, contact, license, and servers (dev/staging/prod).
3. **Model schemas.** Create reusable components for request/response bodies with proper types, enums, and validation rules.
4. **Define paths.** Each endpoint: summary, description, parameters, request body, responses (200, 400, 401, 404, 500).
5. **Add security definitions.** Auth schemes and required scopes per endpoint.
6. **Include examples.** Request and response examples for every endpoint — critical for developer experience.
7. **Validate spec.** Run through OpenAPI validators (spectral, swagger-cli) and fix all warnings.

## Example

```yaml
openapi: 3.1.0
info:
  title: Users API
  version: 1.2.0
  description: User management and authentication service
servers:
  - url: https://api.example.com/v1
    description: Production
paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: Paginated user list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
```
