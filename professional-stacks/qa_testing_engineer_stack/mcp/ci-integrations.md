# CI/CD Integration

MCP configs for running QA testing workflows in continuous integration pipelines. Enables automated test execution, coverage validation, and regression detection on every commit.

## When to Use

- Running full test suite on every PR/commit
- Blocking merges if coverage drops or tests fail
- Generating test reports for visibility
- Detecting regressions in CI environment
- Enforcing quality gates before release

## Supported Platforms

- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI
- AWS CodePipeline
- Cloud Build

## GitHub Actions Example

File: `.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"
      
      - name: Install dependencies
        run: |
          pip install -r requirements-test.txt
      
      - name: Run unit tests
        run: |
          pytest tests/unit --cov=app --cov-report=xml --cov-report=html
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
          flags: unittests
          fail_ci_if_error: false
      
      - name: Check coverage threshold
        run: |
          coverage report --fail-under=80

  integration-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"
      
      - name: Install dependencies
        run: |
          pip install -r requirements-test.txt
      
      - name: Run integration tests
        run: |
          pytest tests/integration --cov=app --cov-report=xml
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start application
        run: npm start &
      
      - name: Wait for app
        run: npx wait-on http://localhost:3000
      
      - name: Run e2e tests
        run: npx playwright test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  coverage-gate:
    needs: [unit-tests, integration-tests]
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Check coverage gate
        run: |
          # Fail if coverage is below threshold
          # Coverage data from previous jobs should be aggregated
          if [ $COVERAGE -lt 80 ]; then
            echo "Coverage below 80%: $COVERAGE%"
            exit 1
          fi
```

## GitLab CI Example

File: `.gitlab-ci.yml`

```yaml
stages:
  - test
  - coverage
  - quality

unit_tests:
  stage: test
  image: python:3.11
  script:
    - pip install -r requirements-test.txt
    - pytest tests/unit --cov=app --cov-report=term-missing --cov-report=xml
  coverage: '/Line Coverage: (\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

integration_tests:
  stage: test
  image: python:3.11
  services:
    - postgres:15
  script:
    - pip install -r requirements-test.txt
    - pytest tests/integration --cov=app --cov-report=xml
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

coverage_gate:
  stage: coverage
  image: python:3.11
  script:
    - pip install coverage
    - coverage report --fail-under=80
  only:
    - merge_requests
```

## Test Result Parsing

Automatic detection of failures:

```bash
# Python pytest
- Test summary in stdout (PASSED/FAILED)
- Coverage data in coverage.xml
- Failure details in test report

# JavaScript Jest
- Test summary in stdout (PASS/FAIL)
- Coverage data in coverage/lcov-report/
- Failure details in test report

# Playwright
- HTML report in playwright-report/
- Test results in test-results.json
- Screenshots/videos for failed tests
```

## Quality Gates

Enforce standards before merge:

```yaml
quality_gate:
  stage: quality
  script:
    # All gates must pass
    - pytest --cov=app --cov-fail-under=80      # Coverage >80%
    - pytest --tb=short -x                       # No failing tests
    - coverage report --fail-under=80            # Line coverage >80%
  allow_failure: false
```

## Notifications

Alert on failures:

```yaml
# Slack notification
notify_failure:
  stage: quality
  script:
    - |
      curl -X POST $SLACK_WEBHOOK \
        -d '{"text": "Tests failed in CI. See: '$CI_PIPELINE_URL'"}'
  when: on_failure
```

## Best Practices

1. **Separate test stages:** Unit → Integration → E2E
2. **Use test parallelization:** Run multiple test jobs in parallel
3. **Cache dependencies:** Avoid re-downloading for each run
4. **Fast fail:** Mark critical tests as early stages
5. **Report coverage:** Track trends over time with coverage reporting
6. **Artifact retention:** Save test reports and screenshots
7. **Notifications:** Alert team on failures
8. **Environment parity:** Match CI environment to local dev environment

---
