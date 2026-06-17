---
name: api-test-generator
description: Generate comprehensive API test suites — contract tests, integration tests, and load tests from OpenAPI specs
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Generating test suites from OpenAPI specifications
- Creating contract tests to validate API responses against schemas
- Building integration tests for endpoint workflows
- Setting up load tests for performance benchmarks
- Automating regression tests for API changes

## When NOT to use

- For unit testing business logic (use language-specific test tools)
- For E2E frontend testing
- For database migration testing

## Instructions

1. **Parse OpenAPI spec.** Extract all paths, methods, request bodies, response schemas, and auth requirements.
2. **Generate contract tests.** For each endpoint, validate response status codes, headers, and JSON schema conformance.
3. **Build integration tests.** Chain related endpoints (create → read → update → delete) with data assertions.
4. **Create edge case tests.** Missing fields, invalid types, boundary values, unauthorized access, rate limit triggers.
5. **Set up test fixtures.** Seed data, auth tokens, and environment configs for test isolation.
6. **Generate load tests.** k6 or Artillery scripts targeting critical endpoints with ramp-up scenarios.
7. **Output test report.** Pass/fail summary, coverage %, uncovered endpoints, and performance metrics.

## Example

```javascript
// Contract test — GET /users/{id}
describe('GET /users/{id}', () => {
  it('returns 200 with valid user schema', async () => {
    const res = await request.get('/users/123', { headers: authHeader });
    expect(res.status).toBe(200);
    expect(res.body).toMatchSchema(userSchema);
    expect(res.headers['content-type']).toContain('application/json');
  });

  it('returns 404 for non-existent user', async () => {
    const res = await request.get('/users/000000', { headers: authHeader });
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('USER_NOT_FOUND');
  });
});
```
