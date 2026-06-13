---
name: "Static Analysis"
description: "Security reviews, code quality audits, or when the user mentions CodeQL, Semgrep, or finding vulnerability patterns across a codebase."
---

# Static Analysis

## When to activate
Security reviews, code quality audits, or when the user mentions CodeQL, Semgrep, or finding vulnerability patterns across a codebase.

## When NOT to use
- Runtime security testing (fuzzing, penetration testing, DAST) — static analysis only covers code paths, not live execution
- Linting for style/formatting — use ESLint, Prettier, Ruff; those are not vulnerability scanners
- Single-file code review without a vulnerability focus — use the `code-review` skill instead

## Instructions

### Semgrep

**Running against a repo:**
```bash
# Use managed ruleset (OWASP, CVEs, secrets)
semgrep --config auto .

# Run a specific ruleset
semgrep --config p/owasp-top-ten .

# Run custom rules
semgrep --config ./rules/custom.yaml .

# CI integration — fail on error or warning
semgrep --config auto --error .
```

**Pattern syntax:**
- `$X` — metavariable, matches any expression
- `...` — ellipsis, matches zero or more statements or arguments
- `(int)$X` — typed metavariable (Java/C only)

**Writing a custom rule:**
```yaml
rules:
  - id: sql-string-concat
    pattern: |
      $QUERY = "..." + $INPUT
      $DB.execute($QUERY)
    message: "Possible SQL injection: user input concatenated into query"
    severity: ERROR
    languages: [python, javascript]
    metadata:
      cwe: "CWE-89"
```

**Key patterns to write for any codebase:**
- SQL injection: untrusted input reaching `.execute()`, `.query()`, `db.raw()`
- Path traversal: `path.join()` with user input, `fs.readFile()` with unchecked paths
- Command injection: `exec()`, `spawn()`, `subprocess.run()` with string interpolation
- Deserialization: `pickle.loads()`, `JSON.parse()` on network data passed to `eval()`
- Hardcoded secrets: patterns like `password = "..."`, `api_key = "sk-..."`, `token = "..."`
- Reflected XSS: user input into `innerHTML`, `document.write()`, `res.send()` without sanitization

### CodeQL

**CLI workflow:**
```bash
# Create database from source
codeql database create mydb --language=javascript --source-root=.

# Run a query
codeql query run queries/sql-injection.ql --database=mydb

# Run a built-in query suite
codeql database analyze mydb javascript-security-extended.qls --format=sarif-latest --output=results.sarif
```

**Query structure:**
```ql
import javascript

from DataFlow::PathNode source, DataFlow::PathNode sink, TaintTracking::Configuration cfg
where cfg.hasFlowPath(source, sink)
select sink, source, sink, "Tainted data from $@ reaches SQL query.", source, "user input"
```

**GitHub Actions — Code Scanning:**
```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: javascript, python

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v3
  with:
    category: "/language:javascript"
```

### Variant Analysis
When a known vulnerability is found (e.g., one SQL injection), use variant analysis to find all instances of the same pattern:
1. Write a Semgrep or CodeQL rule that captures the exact pattern
2. Run it across the full codebase, not just the affected file
3. Triage each match — true positive, false positive, or needs review
4. Document which instances are fixed vs. accepted risk

### Fix Verification
After patching a vulnerability:
1. Re-run the original rule that detected it — should produce zero findings
2. Check adjacent code for the same pattern — the fix may have missed related sinks
3. Add the rule to CI so regression is caught automatically

### CI Integration Strategy
```yaml
# Run on every PR, fail on high severity
semgrep --config auto --severity ERROR --error .

# Run full scan on main branch weekly (slower, more thorough)
semgrep --config auto --severity WARNING --json --output results.json .
```

Do not fail CI on WARNING for broad rulesets — the false positive rate will block legitimate work. Tune the severity threshold per project.

## Example

Security audit of a Node.js Express API:

```bash
# Step 1: Broad auto-scan
semgrep --config auto . --json --output results.json
# Finds 14 findings: 3 ERROR, 8 WARNING, 3 INFO

# Step 2: Write custom rule for the app's query builder
cat > rules/knex-injection.yaml << 'EOF'
rules:
  - id: knex-raw-injection
    pattern: knex.raw($QUERY + $INPUT)
    message: "Unsanitized input in knex.raw()"
    severity: ERROR
    languages: [javascript, typescript]
EOF
semgrep --config rules/knex-injection.yaml .
# Finds 2 additional true positives missed by auto-scan

# Step 3: Patch both, re-run to confirm zero findings
# Step 4: Add semgrep to CI with --error flag
```

---
