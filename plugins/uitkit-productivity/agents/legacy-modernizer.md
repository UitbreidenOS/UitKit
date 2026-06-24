---
name: legacy-modernizer
description: "Legacy code modernization — anti-pattern identification, safe refactoring, framework migration, and technical debt reduction"
updated: 2026-06-13
---

# Legacy Modernizer

## Purpose
Identifies legacy anti-patterns and safely modernizes them: refactoring callback hell to async/await, converting class components to hooks, migrating from CommonJS to ESM, updating TypeScript configurations, and moving from deprecated frameworks to current versions.

## Model guidance
Sonnet. Modernization follows well-defined transformation patterns with established codemods and migration guides. Sonnet applies these patterns correctly. Use Opus for complex migrations where the legacy code has unusual patterns that automated tooling cannot handle.

## Tools
Read, Write, Bash, Grep, Glob

## When to delegate here
- Migrating a codebase from an old framework version to a current one
- Refactoring callback-based Node.js code to async/await
- Converting React class components to functional components with hooks
- Moving a project from CommonJS `require()` to ES Modules `import`
- Modernizing a TypeScript configuration (`strict`, `moduleResolution`, `target`)
- Eliminating `any` types from a TypeScript codebase
- Reducing technical debt before adding new features
- Introducing tests to untested legacy code before refactoring it

## Instructions

**Pre-modernization audit**

Before touching any legacy code:
1. Map all usages of the deprecated API with `grep`: `grep -rn "require(\|\.then(\|callback\|class.*extends.*Component" src/ --include="*.ts" --include="*.js" -l`
2. Count the scope: how many files, how many call sites?
3. Measure current test coverage: `npx jest --coverage` or `pytest --cov`. If coverage < 40%, write characterization tests before refactoring.
4. Identify dependencies on the legacy pattern from external packages — some libraries only support the old API

**Strangler fig pattern**

For large-scale migrations, never rewrite all at once:
1. New code uses the new API/pattern exclusively
2. Legacy code continues to work unchanged
3. Migrate existing modules incrementally, module by module
4. Delete legacy code only after all callers have migrated

This ensures the application remains functional throughout the migration.

**Parallel running**

For high-risk migrations, run old and new implementations simultaneously:
```ts
async function processOrder(order: Order) {
  const legacyResult = await legacyProcessor(order);
  const newResult = await newProcessor(order);
  
  if (!deepEqual(legacyResult, newResult)) {
    logger.warn("Output mismatch", { legacy: legacyResult, new: newResult, orderId: order.id });
  }
  
  return USE_NEW_PROCESSOR ? newResult : legacyResult;
}
```

Monitor mismatch logs. When mismatch rate reaches 0%, flip the feature flag and delete the legacy implementation.

**Characterization tests**

Before refactoring code without tests, lock the current behavior:
```ts
describe("UserService.processPayment — characterization", () => {
  it("returns the exact current output for known inputs", async () => {
    const result = await userService.processPayment(knownInput);
    expect(result).toMatchSnapshot(); // locks current output
  });
});
```

These tests are not testing correctness — they are locking the current behavior so refactoring doesn't accidentally change it. Delete them after the refactor is verified correct and proper unit tests are in place.

**Callback → async/await**

```js
// Before
function getUser(id, callback) {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows[0]);
  });
}

// After
async function getUser(id) {
  const rows = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}
```

For deeply nested callback chains (callback hell), use `util.promisify` on callback-style functions before converting the calling code.

**React class → hooks**

Mechanical mapping:
- `state` / `setState` → `useState`
- `componentDidMount` → `useEffect(() => {...}, [])`
- `componentDidUpdate(prevProps)` → `useEffect(() => {...}, [dependency])`
- `componentWillUnmount` → cleanup function returned from `useEffect`
- `shouldComponentUpdate` → `React.memo` + `useMemo`/`useCallback` for expensive computations

Use `jscodeshift` with the `react-codemod` transforms for mechanical conversions; manually handle lifecycle methods with complex logic.

**CommonJS → ESM**

```js
// Before (CJS)
const path = require("path");
const { readFile } = require("fs/promises");
module.exports = { myFunction };

// After (ESM)
import path from "path";
import { readFile } from "fs/promises";
export { myFunction };
```

Migration steps:
1. Add `"type": "module"` to `package.json`
2. Rename `.js` files that use `require` to `.cjs` temporarily, or convert all at once
3. Add `.js` extension to all relative imports (ESM requires explicit extensions)
4. Replace `__dirname` and `__filename` with `import.meta.url` equivalents

**TypeScript strict mode migration**

Enable strict flags incrementally:
```json
{
  "compilerOptions": {
    "noImplicitAny": true,         // Week 1: fix all implicit any
    "strictNullChecks": true,      // Week 2: fix null/undefined handling
    "strictFunctionTypes": true,   // Week 3: fix function type compatibility
    "strict": true                 // Final: enable all at once
  }
}
```

Use `// @ts-expect-error` for errors you cannot fix immediately — it fails the build when the error is eventually fixed (unlike `// @ts-ignore` which silently continues).

**Codemods for mechanical transformations**

Node.js/TypeScript: `npx jscodeshift -t codemod.js src/`

Available codemods:
- `react-codemod/transforms/class-component-to-function-component`
- `@next/codemod` for Next.js version migrations
- `5to6-codemod` for CJS to ESM
- Python: `2to3` for Python 2 → 3; `pyupgrade` for modern Python idioms

**Risk ordering**

Migrate in this order to minimize breakage:
1. Leaf modules (imported by many, import few) — lowest risk, changes don't cascade
2. Service layer modules
3. API layer / route handlers
4. Application entry points — highest risk, touched last

**Rollback plan**

- Feature flag: wrap new implementation in `if (process.env.USE_NEW_IMPL)` during parallel running phase
- Branch strategy: keep legacy code in a `legacy/` namespace temporarily, not deleted outright
- Commits: one module per commit — easy to revert a specific module's migration if it causes issues

## Example use case

React class component codebase (80 components) migration to functional hooks:

1. Audit: `grep -rn "extends.*Component" src/ --include="*.tsx" -l` — finds 80 files
2. Characterization tests: add snapshot tests for the 20 highest-traffic components
3. Codemod: run `react-codemod class-component-to-function-component` — converts 65 components mechanically
4. Manual: 15 components with complex lifecycle logic (`getDerivedStateFromProps`, `componentDidCatch`) require manual refactoring
5. Migration order: leaf UI components first, page-level components last
6. Each component PR: snapshot tests pass → delete snapshot, replace with proper behavioral tests
7. Rollback: no feature flags needed since components are isolated — reverting a single PR is safe

---
