# CI/CD Integration Guide

## GitHub Actions Workflow Example

Create `.github/workflows/test-regression.yml`:

```yaml
name: Regression Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  regression:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Regression Tests
        run: npm run test:regression
        
      - name: Report Results
        if: always()
        run: |
          echo "Test Summary:"
          npm run test:regression 2>&1 | tail -20
```

## Pre-commit Hook Integration

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run regression tests before commit
npm run test:regression || {
  echo "Regression tests failed. Commit blocked."
  exit 1
}
```

Setup Husky if not already installed:

```bash
npx husky install
npx husky add .husky/pre-commit "npm run test:regression"
```

## Pre-push Hook Integration

Add to `.husky/pre-push`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run all tests before push
npm run test:all || {
  echo "Tests failed. Push blocked."
  exit 1
}
```

## Continuous Integration Best Practices

### 1. Run on Every PR

```yaml
on:
  pull_request:
    branches: [main]
```

Ensures no breaking changes are merged.

### 2. Run on Release

```yaml
on:
  release:
    types: [created]
```

Validate before publishing to npm.

### 3. Daily Scheduled Runs

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
```

Catch regressions from external dependencies.

## GitLab CI Integration

`.gitlab-ci.yml`:

```yaml
test:regression:
  image: node:18
  script:
    - npm ci
    - npm run test:regression
  only:
    - merge_requests
    - main
  allow_failure: false
```

## Jenkins Integration

`Jenkinsfile`:

```groovy
pipeline {
  agent any
  
  stages {
    stage('Setup') {
      steps {
        sh 'npm ci'
      }
    }
    
    stage('Regression Tests') {
      steps {
        sh 'npm run test:regression'
      }
    }
  }
  
  post {
    always {
      junit 'test-results.xml'
    }
    failure {
      mail to: 'team@example.com',
           subject: 'Regression tests failed',
           body: 'Tests failed. Check Jenkins for details.'
    }
  }
}
```

## CircleCI Integration

`.circleci/config.yml`:

```yaml
version: 2.1

jobs:
  test-regression:
    docker:
      - image: node:18
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: npm ci
      - run:
          name: Run regression tests
          command: npm run test:regression

workflows:
  test:
    jobs:
      - test-regression
```

## GitHub Actions Composite Action

Create `.github/actions/regression-test/action.yml`:

```yaml
name: 'Run Regression Tests'
description: 'Execute backward-compatibility test suite'

runs:
  using: 'composite'
  steps:
    - name: Install dependencies
      run: npm ci
      shell: bash
    
    - name: Run tests
      run: npm run test:regression
      shell: bash
```

Usage in workflow:

```yaml
- uses: ./.github/actions/regression-test
```

## Failure Handling

### Strict Mode (Fail on Any Failure)

Default behavior - any failed test blocks the pipeline.

### Warning Mode (Report but Don't Block)

Add to workflow:

```yaml
- name: Run Regression Tests
  run: npm run test:regression || true
```

Monitor warnings in logs but don't block deployment.

### Partial Failure (Fail on Critical Tests)

Modify test file to mark tests as critical/non-critical:

```javascript
const CRITICAL = true;
const OPTIONAL = false;

run('critical feature', 'command', { 
  isCritical: CRITICAL 
});
```

## Performance Optimization

### Parallel Testing

Split tests across multiple runners:

```yaml
strategy:
  matrix:
    test-group: [smoke, regression, validation]
    
steps:
  - run: npm run test:${{ matrix.test-group }}
```

### Caching Dependencies

```yaml
- uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm'
```

### Conditional Runs

Skip expensive tests in certain conditions:

```yaml
- name: Run Regression Tests
  if: github.event_name == 'pull_request'
  run: npm run test:regression
```

## Test Result Reporting

### JUnit XML Format

Modify test file to output JUnit:

```javascript
// At end of test suite
const junitXml = `<?xml version="1.0"?>
<testsuites>
  <testsuite name="Regression" tests="${totalTests}" failures="${failed}">
    <!-- Test results -->
  </testsuite>
</testsuites>`;

fs.writeFileSync('test-results.xml', junitXml);
```

### Test Report URLs

Archive results:

```yaml
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results.xml
```

### Slack Notifications

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Regression tests failed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Monitoring & Alerts

### Failed Test Alert

```yaml
- name: Alert on failure
  if: failure()
  run: |
    echo "::error::Regression tests failed"
    curl -X POST ${{ secrets.ALERT_WEBHOOK }} \
      -d '{"text": "Tests failed in ${{ github.ref }}"}'
```

### Success Notification

```yaml
- name: Notify success
  if: success()
  run: |
    echo "::notice::All regression tests passed"
```

## Local Pre-release Checklist

```bash
#!/bin/bash
# pre-release.sh

echo "Running pre-release checks..."

# 1. Smoke tests
npm run test || exit 1
echo "✓ Smoke tests passed"

# 2. Regression tests
npm run test:regression || exit 1
echo "✓ Regression tests passed"

# 3. All tests
npm run test:all || exit 1
echo "✓ All tests passed"

# 4. Build
npm run build-index || exit 1
npm run build-plugins || exit 1
echo "✓ Builds successful"

# 5. Validation
npm run validate || exit 1
echo "✓ Validation passed"

echo ""
echo "✅ Pre-release checks complete. Ready to release."
```

Run before releasing:
```bash
chmod +x pre-release.sh
./pre-release.sh
```

## Troubleshooting CI Failures

### Issue: Tests Pass Locally but Fail in CI

**Cause**: Environment differences (Node version, dependencies)
**Solution**: 
- Ensure CI Node version matches local: `node --version`
- Clear npm cache: `npm ci` instead of `npm install`
- Check for system-specific paths

### Issue: Flaky Tests

**Cause**: Tests depend on timing or external state
**Solution**:
- Add retry logic in CI
- Increase timeouts: `timeout: 60000`
- Mock external dependencies

### Issue: Timeout in CI

**Cause**: CI runners are slower than local machines
**Solution**:
- Increase timeout: `timeout: 60000`
- Reduce test complexity
- Run subset of tests in CI

## Example: Full CI Pipeline

```yaml
name: Full CI Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Smoke Tests
        run: npm run test
      
      - name: Regression Tests
        run: npm run test:regression
      
      - name: Validation
        run: npm run validate
      
      - name: Build Artifacts
        run: npm run build-index && npm run build-plugins
      
      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: test-results/
      
      - name: Report Status
        if: always()
        run: |
          echo "Pipeline Summary:"
          echo "- Tests: PASSED"
          echo "- Build: PASSED"
          echo "- Validation: PASSED"
```

---

**Status**: Ready to integrate
**Platforms Supported**: GitHub Actions, GitLab CI, Jenkins, CircleCI, and others
**Recommended**: GitHub Actions (most common for npm projects)
