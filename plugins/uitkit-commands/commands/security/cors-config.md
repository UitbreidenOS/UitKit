---
description: Audit CORS configuration for overly permissive origins, credential misuse, and preflight gaps
argument-hint: "[server file or framework config]"
---
Audit the CORS (Cross-Origin Resource Sharing) configuration in `$ARGUMENTS` (default: scan all server entrypoints, middleware files, and framework configs) for misconfigurations that enable cross-origin attacks.

**1. Locate CORS configuration**

Find all places CORS headers are set:
- Express/Node: `cors()` middleware, manual `res.setHeader('Access-Control-Allow-Origin', ...)`
- Django: `CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_ALL_ORIGINS`, `django-cors-headers` settings
- FastAPI/Starlette: `CORSMiddleware` parameters
- Spring: `@CrossOrigin`, `WebMvcConfigurer.addCorsMappings`
- Nginx/Apache: `add_header Access-Control-Allow-Origin` directives
- CDN or API Gateway layer configs

**2. Check for wildcard origin with credentials**

The most critical misconfiguration:
- Is `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true`?
- Browsers block this combination, but some frameworks silently misconfigure it — verify the actual response headers when credentials are present.

**3. Check for origin reflection**

- Does the server reflect the `Origin` request header directly into `Access-Control-Allow-Origin` without validation?
- Pattern to find: code that reads `request.headers.origin` or `$_SERVER['HTTP_ORIGIN']` and echoes it into the response header.
- This makes every origin trusted — equivalent to `*` but bypasses the credentials restriction.

**4. Validate the allowed origins list**

- Is the allowed-origins list an exact match (string comparison) or a regex/prefix match?
- Weak prefix match: `origin.startsWith('https://example.com')` allows `https://example.com.attacker.com`
- Weak suffix match: `origin.endsWith('example.com')` allows `https://attackerexample.com`
- Are `null` origins permitted? (triggered by sandboxed iframes and `file://` — almost never appropriate)

**5. Check preflight handling**

- Are `OPTIONS` preflight requests handled and returning correct `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`?
- Are sensitive endpoints (state-changing, authenticated) protected even if preflight is bypassed (e.g., simple requests with `Content-Type: text/plain`)?

**6. Check exposed headers**

- Does `Access-Control-Expose-Headers` include headers that leak sensitive info (e.g., internal service names, session tokens, user IDs)?

**7. Check per-route vs global config**

- Is there a global permissive config that's supposed to be tightened per-route, but the per-route overrides are missing on sensitive endpoints?

**Output format**:
```
## CORS Audit

### Findings
[SEVERITY] [file:line or config key] — description
Attack scenario: what an attacker can do from a malicious origin
Fix: exact configuration change

### Current Allowed Origins
[List each configured origin and whether it's appropriate]

### Recommended Configuration
[Paste a corrected config snippet for the framework in use]
```

Severity: Critical (origin reflection or wildcard+credentials), High (overly broad regex), Medium (null origin, excess exposed headers), Low (preflight gaps on non-sensitive routes).
