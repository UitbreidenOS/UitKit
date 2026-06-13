---
name: vitest
description: "Vitest testing framework: unit tests, integration tests, mocking, coverage, snapshot testing, and CI setup for Vite and Node.js projects"
updated: 2026-06-13
---

# Vitest Skill

## When to activate
- Setting up Vitest in a new project (Next.js, Vite, Node.js)
- Writing unit or integration tests with Vitest
- Mocking modules, APIs, or time with Vitest's built-in utilities
- Setting up test coverage reporting
- Migrating from Jest to Vitest
- Debugging flaky or slow tests

## When NOT to use
- E2E browser tests — use the playwright-pro skill
- API integration tests with supertest — those use Vitest as the runner but the api-test-builder skill has the patterns
- Load testing — use the performance-profiler skill

## Instructions

### Setup

```
Set up Vitest for [project type].

Project: [Next.js / Vite / Node.js / monorepo]
TypeScript: [yes / no]

Install:
npm install -D vitest @vitest/coverage-v8

// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',      // or 'jsdom' for browser-like tests
    
    // Global setup
    globals: true,            // use describe/it/expect without imports
    setupFiles: ['./tests/setup.ts'],
    
    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules', 'tests', '**/*.config.*'],
      thresholds: {
        lines: 80,
        functions: 80,
      },
    },
    
    // Performance
    pool: 'threads',          // faster than forks for CPU-bound tests
    maxConcurrency: 10,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})

// package.json scripts
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"   // visual test runner
  }
}

For Next.js (separate config from next.config):
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
})
```

### Writing tests

```
Write Vitest tests for [module/function].

Module: [describe what you're testing]
Test types: [unit / integration / component]

Basic test structure:
// tests/users.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createUser, getUser, deleteUser } from '@/services/users'

describe('User service', () => {
  describe('createUser', () => {
    it('creates a user with valid data', async () => {
      const user = await createUser({ name: 'Alice', email: 'alice@example.com' })
      expect(user).toMatchObject({
        id: expect.any(String),
        name: 'Alice',
        email: 'alice@example.com',
      })
    })

    it('throws ValidationError for invalid email', async () => {
      await expect(
        createUser({ name: 'Alice', email: 'not-an-email' })
      ).rejects.toThrow('Invalid email')
    })

    it('throws ConflictError for duplicate email', async () => {
      await createUser({ name: 'Alice', email: 'alice@example.com' })
      await expect(
        createUser({ name: 'Alice', email: 'alice@example.com' })
      ).rejects.toMatchObject({ code: 'conflict' })
    })
  })

  describe('getUser', () => {
    it('returns null for non-existent user', async () => {
      const result = await getUser('nonexistent-id')
      expect(result).toBeNull()
    })
  })
})

Test organisation tips:
- Group by function/method, then by scenario
- Test names should read as documentation: "creates a user with valid data"
- Test edge cases: empty, null, max values, duplicates
- Test error cases: invalid input, not found, permission denied

Generate tests for my module.
```

### Mocking

```
Set up mocks in Vitest for [dependency].

Dependency type: [module / API / database / time / environment]

MODULE MOCK (auto-mock or manual):
// Mock an entire module
vi.mock('@/services/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}))

// Mock specific function on existing module
import * as emailService from '@/services/email'
vi.spyOn(emailService, 'sendEmail').mockResolvedValue({ success: true })

// Restore after each test (if needed)
afterEach(() => vi.restoreAllMocks())

DATABASE MOCK (intercept at the DB client level):
// Instead of mocking the ORM, mock the database client
vi.mock('@/lib/db', () => ({
  db: {
    query: vi.fn(),
    execute: vi.fn(),
  },
}))

// In test:
import { db } from '@/lib/db'
vi.mocked(db.query).mockResolvedValueOnce({ rows: [{ id: '1', name: 'Alice' }] })

FETCH/HTTP MOCK:
// Mock global fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'response' }),
  status: 200,
})

// Or use MSW (Mock Service Worker) for more realistic API mocking:
// npm install msw --save-dev
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.get('https://api.example.com/users', () =>
    HttpResponse.json({ users: [] })
  )
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

TIME MOCK:
// Mock Date and timers
vi.useFakeTimers()
vi.setSystemTime(new Date('2026-01-01'))

// Advance timers
await vi.advanceTimersByTimeAsync(5000)  // advance 5 seconds

// Restore real timers
afterEach(() => vi.useRealTimers())

ENVIRONMENT VARIABLES:
// In test setup or specific test
vi.stubEnv('DATABASE_URL', 'postgres://test')
afterEach(() => vi.unstubAllEnvs())

Generate mocks for my specific dependency.
```

### Coverage and CI

```
Set up test coverage and CI integration for [project].

Coverage target: [X]% lines
CI: [GitHub Actions / GitLab CI]

Coverage configuration:
// vitest.config.ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'lcov', 'json-summary'],
  include: ['src/**/*.ts'],
  exclude: [
    'src/**/*.d.ts',
    'src/**/*.config.*',
    'src/types/**',
    'src/migrations/**',
  ],
  thresholds: {
    global: {
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80,
    },
  },
}

GitHub Actions workflow:
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: coverage/lcov.info

PR status check — block merge if coverage drops:
# In vitest.config.ts thresholds
thresholds: {
  global: { lines: 80 },
  // Also configure per-file thresholds for critical files:
  perFile: true,
}
```

## Example

**User:** Migrating from Jest to Vitest. Our tests use `jest.fn()`, `jest.mock()`, and `jest.spyOn()`. What changes?

**Claude's migration guide:**

Vitest is designed to be Jest-compatible — most tests need only a package swap, not a rewrite.

**Step 1 — Replace imports:**
```typescript
// Jest (no import needed — globals)
// Vitest (add import or enable globals: true in config)
import { describe, it, expect, vi, beforeEach } from 'vitest'
```

**Step 2 — Replace `jest.*` with `vi.*`:**
```typescript
// Jest → Vitest
jest.fn()              → vi.fn()
jest.mock()            → vi.mock()
jest.spyOn()           → vi.spyOn()
jest.clearAllMocks()   → vi.clearAllMocks()
jest.resetAllMocks()   → vi.resetAllMocks()
jest.useFakeTimers()   → vi.useFakeTimers()
jest.advanceTimersByTime() → vi.advanceTimersByTime()
```

**Step 3 — Update config:**
```typescript
// jest.config.js → vitest.config.ts
// Most options map directly; key differences:
// - testEnvironment: 'jsdom' → environment: 'jsdom'
// - moduleNameMapper → resolve.alias
// - setupFilesAfterFramework → setupFiles
```

**Step 4 — Run and fix outliers:**
```bash
npx vitest run 2>&1 | grep FAIL
```

99% of Jest tests pass with just the `vi.*` substitution. The remaining 1% are usually timer or module resolution edge cases.

---
