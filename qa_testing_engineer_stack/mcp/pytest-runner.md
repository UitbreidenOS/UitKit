# Pytest Runner

MCP integration for running Python test suites with Pytest framework. Enables direct test execution, coverage analysis, and test discovery.

## When to Use

- Running Python unit and integration tests
- Generating coverage reports
- Executing specific test files or test categories
- Debugging test failures

## Tool Call

```
mcp__pytest_runner__run_tests({
  "test_path": "tests/",
  "options": "--cov=app --cov-report=html -v",
  "framework": "pytest"
})
```

## Common Commands

```bash
# Run all tests with coverage
pytest --cov=app --cov-report=html --cov-report=term-missing -v

# Run specific test file
pytest tests/test_authentication.py -v

# Run tests with failure details
pytest -v --tb=long --failed-first

# Run tests by category (markers)
pytest -m "unit" -v
pytest -m "integration" -v
pytest -m "not slow" -v

# Run with detailed output
pytest -vv --tb=long

# Generate JUnit XML report (for CI/CD)
pytest --junit-xml=test-results.xml
```

## Configuration: pytest.ini

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short
markers =
    unit: Unit tests (fast)
    integration: Integration tests (medium speed)
    slow: Slow tests (>1 second)
    smoke: Smoke tests (critical paths)
```

## Setup Steps

1. Install Pytest and plugins:
   ```bash
   pip install pytest pytest-cov pytest-xdist pytest-timeout
   ```

2. Create pytest.ini in project root (see above)

3. Add to settings.json:
   ```json
   {
     "mcpServers": {
       "pytest_runner": {
         "command": "python",
         "args": ["-m", "pytest"]
       }
     }
   }
   ```

## Tips

- Use parametrized tests for multiple similar scenarios
- Run fast tests first: `pytest -m "not slow" -v`
- Parallel execution: `pytest -n auto` (requires pytest-xdist)
- Timeout for hanging tests: `pytest --timeout=30`
- Coverage threshold: `pytest --cov=app --cov-fail-under=80`

## Output Interpretation

```
test_authentication.py::test_user_login PASSED                      [ 25%]
test_authentication.py::test_invalid_email FAILED                   [ 50%]
test_authentication.py::test_token_refresh SKIPPED                  [ 75%]
test_authentication.py::test_logout PASSED                          [100%]

======================== 3 passed, 1 failed, 1 skipped =========================
```

- **PASSED:** Test succeeded
- **FAILED:** Test failed (bug found)
- **SKIPPED:** Test was skipped (mark with @pytest.mark.skip)
- **XPASS:** Expected failure but passed (mark with @pytest.mark.xfail)

---
