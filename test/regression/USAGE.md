# Backward-Compatibility Test Suite — Quick Start Guide

## TL;DR

```bash
# Run all regression tests
npm run test:regression

# Run all tests (CLI smoke + regression)
npm run test:all

# Direct execution
node test/regression/backward-compatibility.test.js
```

## What Are Backward-Compatibility Tests?

These tests verify that **existing features still work exactly as before**. They catch:

- Broken CLI commands
- Removed directories or files
- Changed behavior in flags/options
- Installation/removal logic failures
- Error handling regressions

## Expected Output

### All Tests Pass (100%)
```
Results: 50 passed, 0 failed (100.0% pass rate)
✓ All backward-compatibility tests passed!
```
Exit code: **0**

### Some Tests Fail
```
Results: 48 passed, 2 failed (96.0% pass rate)

Failures:
  ✗ test name 1
    Error: Specific error message
  ✗ test name 2
    Error: Specific error message
```
Exit code: **1**

## How to Read Results

### Green (✓) = PASS
Test executed successfully, feature works as expected.

### Red (✗) = FAIL
Test failed, feature is broken or behavior changed unexpectedly.

### Yellow (~) = WARNING
Test completed but found a non-critical issue or missing optional content.

## Common Test Scenarios

### Scenario 1: After Updating CLI
```bash
# Update cli.js code
npm run test:regression
# Verifies all commands still work
```

### Scenario 2: Before Release to npm
```bash
npm run test:all  # Runs both smoke + regression tests
# Ensures no breaking changes
```

### Scenario 3: During Development
```bash
# After making changes to skills structure
npm run test:regression
# Catches file structure regressions immediately
```

### Scenario 4: CI/CD Pipeline
```yaml
# In .github/workflows/test.yml
- name: Regression Tests
  run: npm run test:regression
```

## Test Failure Examples

### Example 1: Missing Skill Category
```
✗ Skill category "backend" exists with 14 items
  Error: Required directory missing: backend
```
**Fix**: Restore `skills/backend/` directory

### Example 2: CLI Command Broken
```
✗ search "react" finds results
  Error: Output missing "react"
```
**Fix**: Check search implementation in `scripts/cli.js`

### Example 3: package.json Misconfigured
```
✗ bin.claudient points to ./scripts/cli.js
  Error: Missing or invalid
```
**Fix**: Verify `package.json` has correct `bin` field

## Running Specific Test Categories

To focus on specific areas, edit the test file and comment out unwanted sections, or create a filtered run:

```bash
# Run and grep for specific test
npm run test:regression 2>&1 | grep "List Commands"

# Run and see only failures
npm run test:regression 2>&1 | grep "✗"

# Run and see only warnings
npm run test:regression 2>&1 | grep "~"
```

## Integration with CI

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test:regression
```

### Pre-commit Hook Example

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run test:regression || exit 1
```

## Troubleshooting

### Test Hangs/Timeout
```bash
# Tests have 30-second timeout. If hanging:
# 1. Check if command works manually
node scripts/cli.js help

# 2. Increase timeout in test file if needed
# Look for: timeout: 30000
```

### All Tests Fail Immediately
```bash
# Check if CLI runs at all
node scripts/cli.js help

# Check Node version
node --version  # Should be >= 18
```

### Intermittent Failures
Some tests may be flaky if they depend on external state. Re-run:
```bash
npm run test:regression
```

## Interpreting Test Categories

| Category | Purpose | Critical? |
|----------|---------|-----------|
| Help & Usage | Basic CLI working | Yes |
| List Commands | Catalog intact | Yes |
| Search | Feature works | Yes |
| CLI Flags | Options parsed correctly | Yes |
| Error Handling | Invalid input rejected | Yes |
| File Structure | Repo layout stable | Yes |
| Module Dependencies | Scripts export correctly | Yes |
| Skill Categories | Core skills present | Yes |
| Language Support | Translations available | No |
| Package Metadata | npm packaging correct | Yes |
| Build Scripts | Validators runnable | Yes |
| Output Consistency | Formats unchanged | Yes |
| Index Catalog | Pre-built index valid | No |
| Version Compatibility | API stable | Yes |
| Documentation | Help text complete | No |

**Critical tests** must pass. **Non-critical** warnings are informational.

## Performance

| Test Suite | Duration |
|-----------|----------|
| Smoke tests (`test-cli.js`) | ~15-20s |
| Regression tests (`backward-compatibility.test.js`) | ~25-35s |
| All tests (`test:all`) | ~40-50s |

## Next Steps After Tests Pass

1. **Local verification**: Manually test key commands
2. **Documentation**: Update CHANGELOG if behavior changed
3. **CI**: Push to trigger full test suite
4. **Release**: Only release after all tests pass

## Modifying Tests

To add a new backward-compatibility test:

```javascript
logSection('REGRESSION: New Feature Category');

run('test description', 'cli command args', {
  expectContains: 'text to find',
  expectOutput: true,
  shouldFail: false,
  timeout: 30000
});
```

Examples:

```javascript
// Test that a command works
run('my feature works', 'my-command --flag', {
  expectContains: 'expected output'
});

// Test that a command properly fails
run('invalid input rejected', 'bad-command invalid', {
  shouldFail: true
});

// Test output format
run('output is JSON', 'command --json', {
  expectContains: '{',
  expectOutput: true
});
```

## Performance Optimization

If tests are slow:

1. Reduce timeout values for faster fail feedback
2. Skip optional language tests if not needed
3. Mock expensive operations (requires code changes)
4. Run in parallel (requires refactoring)

## Maintenance Schedule

- **After every commit**: Run locally during development
- **Before PR**: `npm run test:all`
- **Before release**: Full test suite + manual verification
- **Monthly**: Review and update test expectations
- **Yearly**: Audit coverage against new features

## Support

For test failures:

1. Check the error message
2. Run command manually to reproduce
3. Check recent git history for breaking changes
4. Review CHANGELOG for documented breaking changes
5. Report in issue tracker

---

**Test Suite Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Production Ready
