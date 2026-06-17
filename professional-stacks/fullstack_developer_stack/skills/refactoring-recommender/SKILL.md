# Refactoring Recommender

## When to activate

- Review a diff or changed code for simplification, performance, or maintainability improvements
- Refactor legacy code to apply modern patterns or framework idioms
- Reduce cyclomatic complexity, eliminate duplication, or improve testability
- Modernize API surface, consolidate utility functions, or standardize naming conventions
- Assess code quality after feature development or merge conflicts

## When NOT to use

- For security vulnerability detection — use `/security-review` instead
- For automated bug detection — use `/code-review` instead
- For minor style fixes or linting — use standard formatters (Prettier, Black, gofmt)
- For architectural design decisions spanning multiple files — start with `/deep-research` to gather requirements first
- When the codebase has explicit anti-refactoring policies or immutability constraints

## Instructions

1. **Scope the changeset**: Read all modified files. Understand the git diff context or entire file if no diff exists. Identify hotspots: deep nesting, long functions, repeated conditionals, overlapping abstractions.

2. **Apply the refactoring ladder** (in order):
   - **Naming**: Rename variables, functions, classes to clarify intent — `response.d` → `response.duration_ms`
   - **Extract**: Pull repeated logic, deeply nested blocks, or single-responsibility violations into dedicated functions or classes
   - **Consolidate**: Merge similar functions differing only in type or parameter order; use generics or polymorphism
   - **Eliminate**: Remove dead code, redundant null checks after type narrowing, unused parameters
   - **Patterns**: Apply established patterns (Builder for complex objects, Strategy for conditional logic, Dependency Injection for testability)

3. **Prioritize by ROI**: Recommend high-impact changes first (reducing complexity, unblocking tests, improving readability for critical paths). Lower priority: stylistic improvements or micro-optimizations.

4. **Preserve intent**: Refactoring must not alter observable behavior. If uncertain, propose as a suggestion with caveats.

5. **Provide concrete diffs**: Show before/after code snippets for each recommendation. For large refactors, offer a staged approach.

6. **Test impact**: If tests exist, confirm the refactoring doesn't break them. Flag edge cases that the refactoring exposes.

## Example

Given a TypeScript utility file with overlapping functions:

```typescript
function parseJSON(input: string) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
}

function parseCSV(input: string) {
  try {
    const lines = input.split('\n');
    return lines.map(line => line.split(','));
  } catch (e) {
    return null;
  }
}

function parseXML(input: string) {
  try {
    return new DOMParser().parseFromString(input, 'text/xml');
  } catch (e) {
    return null;
  }
}
```

**Recommendation**: Extract error handling into a higher-order function, apply Strategy pattern for parsers:

```typescript
const safelyParse = <T>(parser: (input: string) => T) => (input: string): T | null => {
  try {
    return parser(input);
  } catch {
    return null;
  }
};

const parsers = {
  json: safelyParse(input => JSON.parse(input)),
  csv: safelyParse(input => input.split('\n').map(line => line.split(','))),
  xml: safelyParse(input => new DOMParser().parseFromString(input, 'text/xml')),
};
```

**Impact**: Eliminates three duplicate try-catch blocks, centralizes error handling, enables easy addition of new parsers, improves testability of parsers in isolation.
