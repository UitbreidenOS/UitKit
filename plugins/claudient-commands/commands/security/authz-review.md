---
description: Review authorization logic for privilege escalation, broken access control, and IDOR flaws
argument-hint: "[file or module]"
---
Review the authorization and access control implementation in `$ARGUMENTS` (default: entire codebase) for broken access control, privilege escalation paths, and IDOR vulnerabilities.

**1. Map the permission model**

Identify and document:
- Authentication mechanism (session, JWT, API key, OAuth)
- Role/permission definitions — where they're stored and how they're loaded
- Middleware or decorators that enforce authz (e.g., `@require_permission`, `isAdmin` guards)
- Resources that are protected vs. those that are not

**2. Check for broken access control (OWASP A01)**

- Are authorization checks applied consistently, or only in some code paths leading to the same resource?
- Can a lower-privilege user reach higher-privilege endpoints by manipulating the request (method override, parameter tampering, path traversal)?
- Are there any admin-only routes that rely solely on a boolean flag in user-controlled input (e.g., `?admin=true`)?
- Does the frontend hide UI elements for unauthorized users but fail to enforce the same rules server-side?

**3. Check for IDOR (Insecure Direct Object Reference)**

- Find every endpoint that accepts a user-supplied ID (path param, query param, body field) and fetches a record.
- Verify that each lookup includes an ownership or membership check — not just that the record exists.
- Flag patterns like: `GET /invoices/:id` where the query is `SELECT * FROM invoices WHERE id = ?` without `AND user_id = current_user`.

**4. Check for privilege escalation**

- Can a regular user modify their own role/permissions through an API endpoint?
- Are there mass-assignment vulnerabilities where a `PATCH /users/:id` accepts a `role` field?
- Is there a user creation or invite flow where the caller can set arbitrary roles on the new account?

**5. JWT / session-specific checks** (if applicable)

- Is the algorithm validated server-side? (`alg: none` attack, algorithm confusion RS256→HS256)
- Are JWTs verified for expiry, issuer, and audience on every protected route?
- Are session tokens invalidated on logout and password change?

**6. Output**

For each finding:
```
[SEVERITY] [file:line] — description
Attack scenario: one sentence explaining how an attacker exploits this
Fix: specific code change or pattern to apply
```

Severity: Critical (direct data breach or account takeover), High (privilege escalation), Medium (info disclosure), Low (defense in depth gap).
