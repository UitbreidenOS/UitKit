---
description: Audit the API and produce a versioning strategy with migration paths for breaking changes
argument-hint: "[current-version] [target-version]"
---
Produce an API versioning plan for: $ARGUMENTS

Parse as: current version (e.g. v1) and target version (e.g. v2). If omitted, analyze the existing API and recommend whether versioning is needed at all.

Analysis phase — read the codebase and identify:
1. All public endpoints (path, method, request shape, response shape)
2. Which changes are breaking vs. non-breaking:
   - Breaking: removing a field, changing a field type, renaming a field, changing status code semantics, removing an endpoint, changing auth requirements
   - Non-breaking: adding an optional field, adding a new endpoint, adding a new enum value (with caution), relaxing validation
3. Any existing clients or SDK consumers that would be affected

Versioning strategy selection:
- URL path versioning (`/v2/`) — recommended default; explicit, cacheable, easy to route
- Header versioning (`API-Version: 2`) — cleaner URLs but harder to test in browsers; use only if the project already does this
- Query param versioning — avoid; not RESTful and breaks caching

Implementation plan:
- Define the version prefix in one place (router config, base URL constant) — not scattered in every route
- Old version routes must remain functional for a deprecation window (recommend: 6 months minimum for external APIs, 1 major release for internal)
- Add `Deprecation` and `Sunset` headers to v1 responses when v2 ships
- Version only the routes that have breaking changes — identical routes can share handlers across versions
- Define a migration guide document listing every breaking change with before/after examples

Output:
1. List of breaking changes found (or "none found" if clean)
2. Recommended versioning strategy with justification
3. Routing structure showing how v1 and v2 coexist
4. Code changes needed to implement the version split
5. Deprecation timeline recommendation
6. Migration guide skeleton for API consumers
