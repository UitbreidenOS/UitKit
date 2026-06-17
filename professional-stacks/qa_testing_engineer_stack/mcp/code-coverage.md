# Code Coverage Tools

MCP integration for analyzing test coverage metrics. Generates coverage reports by module, tracks trends, and identifies gaps.

## When to Use

- Analyzing code and test coverage distribution
- Identifying untested code paths
- Generating HTML coverage reports
- Tracking coverage trends over time
- Finding dead code

## Tool Calls

### Python Coverage (Coverage.py)

```
mcp__coverage__analyze({
  "language": "python",
  "source_dir": "app/",
  "report_format": "html"
})
```

### JavaScript Coverage (Istanbul / nyc)

```
mcp__coverage__analyze({
  "language": "javascript",
  "source_dir": "src/",
  "report_format": "lcov"
})
```

## Common Commands

### Python (coverage.py)

```bash
# Run tests with coverage
coverage run -m pytest
coverage report

# Generate HTML report
coverage html
# Open: htmlcov/index.html in browser

# Show missing lines
coverage report -m

# Coverage threshold
coverage report --fail-under=80
```

### JavaScript (Istanbul/nyc)

```bash
# Run tests with coverage
nyc jest

# Generate HTML report
nyc report --reporter=html
# Open: coverage/index.html in browser

# Show uncovered lines
nyc report --reporter=text-summary
```

## Coverage Report Interpretation

### Coverage Metrics

- **Line Coverage:** % of source code lines executed
- **Branch Coverage:** % of if/else and case branches taken
- **Function Coverage:** % of functions called
- **Statement Coverage:** % of statements executed

### Example Report

```
Module             Lines   Branches   Functions   Statements
auth/              92%     78%        95%         92%
payment/           45%     38%        52%         45%
user/              88%     71%        91%         88%
database/          76%     68%        82%         76%
---
Total             75%     63%        80%         75%
```

## Setup: Python

1. Install coverage tools:
   ```bash
   pip install coverage pytest-cov
   ```

2. Configure .coveragerc:
   ```ini
   [run]
   source = app
   omit = 
       */migrations/*
       */tests/*
       */venv/*

   [report]
   exclude_lines =
       pragma: no cover
       def __repr__
       raise AssertionError
       raise NotImplementedError
       if __name__ == .__main__.:
   ```

3. Run tests with coverage:
   ```bash
   pytest --cov=app --cov-report=html --cov-report=term-missing
   ```

## Setup: JavaScript

1. Install coverage tools:
   ```bash
   npm install --save-dev jest @babel/plugin-transform-modules-commonjs
   ```

2. Configure jest.config.js:
   ```javascript
   module.exports = {
     collectCoverageFrom: [
       'src/**/*.js',
       '!src/**/index.js',
       '!src/**/*.spec.js'
     ],
     coverageThreshold: {
       global: {
         lines: 80,
         functions: 80,
         branches: 60,
         statements: 80
       }
     }
   };
   ```

3. Run tests with coverage:
   ```bash
   jest --coverage
   ```

## Best Practices

1. **Target >80% line coverage** — sweet spot between coverage and effort
2. **Don't chase 100%** — diminishing returns after 85%
3. **Focus on critical code** — security, payments, data access should be >90%
4. **Ignore auto-generated code** — migrations, boilerplate
5. **Coverage is not quality** — high coverage does not mean high quality tests

## Integration: CI/CD

Fail build if coverage drops:

```bash
# Python
coverage report --fail-under=80

# JavaScript
jest --coverage --coverageReporters=text --coverage-threshold-lines=80
```

---
