---
name: auth-flow-designer
description: Design secure authentication and authorization flows — OAuth2, JWT, API keys, and RBAC for APIs
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Designing authentication for new API endpoints
- Implementing OAuth2 flows (authorization code, client credentials, PKCE)
- Setting up JWT token generation, validation, and refresh
- Designing role-based access control (RBAC) or ABAC policies
- Migrating from API keys to token-based auth

## When NOT to use

- For frontend session management (different concern)
- For SSO/SAML federation setup
- For password hashing implementation details

## Instructions

1. **Identify auth requirements.** Who are the consumers? (users, services, third-party apps). What data sensitivity?
2. **Select auth method.** API keys for server-to-server, OAuth2 + PKCE for user-facing apps, JWT for stateless microservices.
3. **Design token structure.** JWT claims: sub, iss, aud, exp, iat, scope. Keep payload minimal (<1KB).
4. **Define token lifecycle.** Access token: 15min expiry. Refresh token: 7-day rotation. Revocation: blacklist or token version.
5. **Map scopes to endpoints.** Document which scopes are required for each endpoint in OpenAPI spec security section.
6. **Design error responses.** 401 for missing/invalid token, 403 for insufficient scope, 429 for rate-limited auth attempts.
7. **Security review.** Verify: HTTPS only, no tokens in URLs, proper CORS, secure token storage recommendations.

## Example

```yaml
# OpenAPI security definition
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    apiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key

security:
  - bearerAuth: [read:users, write:users]
  - apiKeyAuth: []
```
