# Regression & Backward-Compatibility Test Suite

## Overview

The regression test suite validates that **all legacy CLI commands continue to work correctly** and ensures **no breaking changes** are introduced between versions. These tests verify feature parity, CLI flag behavior, error handling, and file structure integrity.

## Purpose

### What We Test

- **CLI Command Stability**: All core commands (`list`, `search`, `add`, `remove`, etc.) work as before
- **Feature Parity**: Core features haven't been removed or broken
- **Skills/Agents/Hooks/Rules**: Installation and removal logic remains intact
- **File Structure**: Directory hierarchy and required files are present
- **Error Handling**: Invalid inputs are rejected properly
- **Package Metadata**: `package.json` structure supports the CLI
- **Cross-Version Compatibility**: API is stable and version-forward
- **Flag Parsing**: CLI flags like `--lang` work correctly
- **Output Consistency**: Command output format and content remain stable

## Running the Tests

### Run All Regression Tests

```bash
npm run test:regression
```

### Run All Tests (CLI + Regression)

```bash
npm run test:all
```

### Direct Execution

```bash
node test/regression/backward-compatibility.test.js
```

## Test Categories

### 1. Help & Usage Commands
Verifies that `help` command prints complete usage information with all required sections.

**Tests:**
- Help command prints usage
- Help shows skill categories
- Help shows examples
- Help shows all commands

### 2. List Commands (Catalog)
Ensures all `list` subcommands work: `skills`, `agents`, `rules`, `hooks`, `structures`.

**Tests:**
- `list` default output
- `list skills` shows categories
- `list agents` works
- `list rules` works
- `list hooks` works
- `list structures` works

### 3. Search Functionality
Validates search command returns expected results for common queries.

**Tests:**
- Search "react" finds results
- Search "docker" finds results
- Search "testing" finds results
- Search "backend" finds results
- Search "frontend" finds results
- Search "database" finds results

### 4. CLI Flag Parsing
Verifies flags like `--lang` are parsed correctly and gracefully handle edge cases.

**Tests:**
- Flag `--lang en` works
- Flag `--lang` gracefully handles missing value
- Multiple flags handled correctly

### 5. Error Handling
Ensures invalid commands and options are rejected with appropriate exit codes.

**Tests:**
- Unknown command rejected
- Unknown skill category rejected
- Invalid remove type rejected

### 6. File Structure & Content Integrity
Validates the repository structure remains stable across versions.

**Tests:**
- Repo structure: `skills/` directory
- Repo structure: `scripts/` directory
- Repo structure: `agents/` directory
- Repo structure: `hooks/` directory
- Repo structure: `rules/` directory

### 7. CLI Module Dependencies
Verifies required modules export expected functions.

**Tests:**
- `recommend.js` exports all required functions

### 8. Skill Installation Logic
Validates all core skill categories exist and have content.

**Tests:**
- Skill category "ai-engineering"
- Skill category "automation"
- Skill category "backend"
- Skill category "database"
- Skill category "devops-infra"
- Skill category "git"

### 9. Language Support
Checks for translated content in supported languages (en, fr, de, nl, es).

**Tests:**
- Language [en] support
- Language [fr] support
- Language [de] support
- Language [nl] support
- Language [es] support

### 10. Package Metadata
Ensures `package.json` is correctly configured for CLI distribution.

**Tests:**
- `bin.claudient` points to correct entry point
- `files` field includes all required paths
- Required npm scripts present
- Version is semantic format

### 11. Build & Validation Scripts
Validates that all required scripts exist and have content.

**Tests:**
- `cli.js` exists and has content
- `recommend.js` exists and has content
- `validate-frontmatter.js` exists and has content
- `validate-manifests.js` exists and has content

### 12. CLI Output Format Consistency
Ensures command output structure remains consistent.

**Tests:**
- `doctor` command output format
- `update` command handles version check

### 13. Index Catalog (if built)
Validates `index.json` structure for pre-built catalog data.

**Tests:**
- Index has correct skills array
- Index has correct agents array
- Index has correct hooks array
- Index has correct rules array
- Index version matches package.json

### 14. Cross-Version Compatibility
Ensures API versioning indicates stability.

**Tests:**
- Version indicates stable API (>= 1.0.0)

### 15. CLI Documentation
Validates help text completeness.

**Tests:**
- Help text is complete
- Scan documentation is accurate

## Output Format

### Success Output
```
✓ test name
```

### Failure Output
```
✗ test name
  Error: Details about what failed
```

### Warning Output
```
~ Optional test (warning)
  Warning: Non-critical issue
```

### Summary
```
Results: 50 passed, 0 failed (100.0% pass rate)
Total Tests: 50

✓ All backward-compatibility tests passed!
```

## Test Statistics

| Category | Test Count |
|----------|-----------|
| Help & Usage | 4 |
| List Commands | 6 |
| Search | 6 |
| CLI Flags | 3 |
| Error Handling | 3 |
| File Structure | 5 |
| Module Dependencies | 1 |
| Skill Categories | 6 |
| Language Support | 5 |
| Package Metadata | 4 |
| Build Scripts | 4 |
| Output Consistency | 2 |
| Index Catalog | 5 |
| Version Compatibility | 1 |
| Documentation | 2 |
| **Total** | **50** |

## Exit Codes

- **0**: All tests passed (success)
- **1**: One or more tests failed (failure)

## Integration with CI/CD

Add to GitHub Actions workflow:

```yaml
- name: Run Backward Compatibility Tests
  run: npm run test:regression
```

Add to package.json scripts to run all tests:

```bash
npm run test:all  # Runs both test-cli.js and backward-compatibility.test.js
```

## What Breaks Tests?

Tests will fail if:

1. **CLI commands no longer exist**: `search`, `list`, `add`, etc.
2. **Directory structure changes**: `skills/`, `agents/`, `hooks/` removed or moved
3. **Script files missing**: `cli.js`, `recommend.js`, validation scripts
4. **Package.json incorrectly configured**: `bin`, `files`, or `scripts` fields
5. **Skill categories removed**: Any of the core 6 categories gone
6. **Exit codes change**: Commands that should fail no longer do
7. **Output format changes**: Commands that should output text don't

## Common Issues & Solutions

### Test Timeout (30 seconds)
If a test times out, the command is taking too long or hanging:
```bash
# Run command manually to debug
node scripts/cli.js help
```

### Missing index.json
If index catalog tests fail, rebuild the index:
```bash
npm run build-index
```

### Language Files Not Found
Language test warnings are informational. Language files are optional unless you're publishing translated skills.

### Help Text Missing Sections
If documentation tests fail, ensure help text in CLI includes all expected sections.

## Extending the Tests

To add new backward-compatibility tests:

1. Open `test/regression/backward-compatibility.test.js`
2. Add a new test section with `logSection()` header
3. Use `run()` helper function with appropriate options:
   ```javascript
   run('test name', 'command args', {
     expectContains: 'expected text',
     shouldFail: false,
     timeout: 30000
   });
   ```
4. Run tests to verify: `npm run test:regression`

Example test:
```javascript
logSection('NEW FEATURE: Custom Command');

run('custom command works', 'custom-cmd --flag value', {
  expectContains: 'Success',
  expectOutput: true
});
```

## Maintenance

### Regular Checks
- Run after major version bumps
- Run before releasing to npm
- Run in CI on every PR
- Run locally during development

### Version-Specific Notes
- `1.10.1`: All tests passing, full backward compatibility
- Tests validate from v1.0.0 forward

## Related Tests

- **CLI Smoke Tests**: `scripts/test-cli.js` — Basic command execution
- **Validation Tests**: `scripts/validate-frontmatter.js` — Content validation
- **Manifest Tests**: `scripts/validate-manifests.js` — Structure validation

## Contact & Issues

If a test fails:
1. Check the error message in the failure section
2. Run the command manually to reproduce
3. Check recent commits for breaking changes
4. Report in issue tracker with test output

---

**Last Updated**: June 2026
**Test Suite Version**: 1.0
**Claudient Version**: 1.10.1+
