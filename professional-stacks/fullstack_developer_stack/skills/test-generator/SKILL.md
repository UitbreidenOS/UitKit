# Test Generator

## When to activate

- You have written a new function, component, or service and need test coverage
- An existing test suite is incomplete or missing tests for critical paths
- You're refactoring code and need to ensure parity with prior behavior via tests
- You need to verify edge cases and error handling paths

## When NOT to use

- Tests already exist and are passing — use `/code-review` to audit coverage instead
- You're writing integration tests that require external services — scaffold with this skill, then hand-configure environment setup
- The code under test has unstable APIs or incomplete contracts — define the interface first
- You're building a test harness or framework — this skill generates tests, not testing infrastructure

## Instructions

### Unit Tests

1. **Read the target function or component** — understand the public interface, arguments, return types, and documented behavior
2. **Identify test categories**: happy path, edge cases, error conditions, boundary values, type coercion
3. **Generate test cases** organized by category, each with:
   - Descriptive test name (what behavior is being verified)
   - Setup (mocks, fixtures, state)
   - Assertion (what should be true)
4. **Write in the project's test framework** (Jest, Pytest, Vitest, unittest, etc.)
5. **Use realistic test data** — not lorem ipsum or fake names, but data shapes that match production

### Component Tests

For UI components (React, Vue, Svelte):

1. **Test rendering** — does it render without crashing?
2. **Test props** — does each prop affect output correctly?
3. **Test interaction** — clicks, form submission, keyboard navigation
4. **Test slots/children** — if applicable, how does child content render?
5. **Test accessibility** — ARIA labels, semantic HTML, keyboard focus

### API Endpoint Tests

1. **Test each HTTP method** — GET, POST, PUT, DELETE (if applicable)
2. **Test request validation** — invalid schemas should fail gracefully
3. **Test response shape** — does output match the documented contract?
4. **Test status codes** — 200, 400, 401, 404, 500 as appropriate
5. **Test side effects** — if the endpoint modifies data, verify the mutation

### Coverage Focus

Prioritize tests for:
- **Critical paths** — happy path, must not break
- **Error handling** — what happens when input is malformed or service fails?
- **Boundary conditions** — empty arrays, null values, max/min values
- **Authentication/authorization** — if applicable
- **Data transformations** — input → output mapping

Defer or omit tests for:
- Obvious pass-throughs (e.g., a wrapper that just calls another function)
- Third-party library behavior (don't test the library, mock it)
- Trivial getters/setters with no logic

## Example

**Target code** (JavaScript function):

```javascript
export function parseQueryString(queryString) {
  if (!queryString) return {};
  return Object.fromEntries(
    queryString
      .split('&')
      .map(pair => pair.split('='))
      .map(([key, value]) => [
        decodeURIComponent(key),
        decodeURIComponent(value || '')
      ])
  );
}
```

**Generated test suite** (Jest):

```javascript
import { parseQueryString } from './query.js';

describe('parseQueryString', () => {
  describe('happy path', () => {
    it('parses single query parameter', () => {
      expect(parseQueryString('name=Alice')).toEqual({ name: 'Alice' });
    });

    it('parses multiple query parameters', () => {
      expect(parseQueryString('name=Alice&age=30&city=NYC')).toEqual({
        name: 'Alice',
        age: '30',
        city: 'NYC'
      });
    });
  });

  describe('edge cases', () => {
    it('returns empty object for null', () => {
      expect(parseQueryString(null)).toEqual({});
    });

    it('returns empty object for undefined', () => {
      expect(parseQueryString(undefined)).toEqual({});
    });

    it('returns empty object for empty string', () => {
      expect(parseQueryString('')).toEqual({});
    });

    it('handles parameters with no value', () => {
      expect(parseQueryString('flag')).toEqual({ flag: '' });
    });

    it('handles URL-encoded characters', () => {
      expect(parseQueryString('email=user%40example.com')).toEqual({
        email: 'user@example.com'
      });
    });

    it('handles duplicate keys (last wins)', () => {
      expect(parseQueryString('id=1&id=2')).toEqual({ id: '2' });
    });
  });

  describe('error handling', () => {
    it('ignores trailing ampersand', () => {
      expect(parseQueryString('a=1&')).toEqual({ a: '1' });
    });

    it('ignores empty pairs between ampersands', () => {
      expect(parseQueryString('a=1&&b=2')).toEqual({ a: '1', b: '' });
    });
  });
});
```

**Why this approach works:**
- Tests are independent (no shared state)
- Each test name describes the behavior, not the implementation
- Edge cases are explicit and grouped
- Error conditions are covered
- The suite can run in any order
