# Static Analysis

## Wanneer activeren
Beveiligingsreviews, code quality audits, of wanneer de gebruiker CodeQL, Semgrep of het vinden van kwetsbaarheidspatronen over een codebase noemt.

## Wanneer NIET gebruiken
- Runtime security testen (fuzzing, penetration testing, DAST) — static analysis behandelt alleen codepaden, niet live execution
- Linting voor stijl/opmaak — gebruik ESLint, Prettier, Ruff; die zijn geen kwetsbaarheid scanners
- Single-file code review zonder kwetsbaarheid focus — gebruik de `code-review` skill in plaats daarvan

## Instructies

### Semgrep

**Uitvoering op een repo:**
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

**Patroon syntaxis:**
- `$X` — metavariable, matches any expression
- `...` — ellipsis, matches zero or more statements or arguments
- `(int)$X` — typed metavariable (Java/C only)

**Schrijf een custom rule:**
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

**Sleutelpatronen om voor elke codebase te schrijven:**
- SQL injection: onvertrouwde input bereikt `.execute()`, `.query()`, `db.raw()`
- Path traversal: `path.join()` met gebruikersinvoer, `fs.readFile()` met ongecontroleerde paden
- Command injection: `exec()`, `spawn()`, `subprocess.run()` met string interpolation
- Deserialization: `pickle.loads()`, `JSON.parse()` op netwerkgegevens doorgegeven aan `eval()`
- Hardcoded secrets: patronen als `password = "..."`, `api_key = "sk-..."`, `token = "..."`
- Reflected XSS: gebruikersinvoer in `innerHTML`, `document.write()`, `res.send()` zonder sanitization

### CodeQL

**CLI werkstroom:**
```bash
# Create database from source
codeql database create mydb --language=javascript --source-root=.

# Run a query
codeql query run queries/sql-injection.ql --database=mydb

# Run a built-in query suite
codeql database analyze mydb javascript-security-extended.qls --format=sarif-latest --output=results.sarif
```

**Query structuur:**
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
Wanneer een bekende kwetsbaarheid wordt gevonden (bijv. één SQL injection), gebruik variant analysis om alle instanties van hetzelfde patroon te vinden:
1. Schrijf een Semgrep of CodeQL rule die het exacte patroon vastlegt
2. Voer het uit over de volledige codebase, niet alleen het beïnvloede bestand
3. Sorteer elke match — true positive, false positive of behoeft review
4. Documenteer welke instanties zijn opgelost versus geaccepteerd risico

### Fix Verification
Na het patchen van een kwetsbaarheid:
1. Voer de originele rule opnieuw uit die het ontdekte — moet nul bevindingen produceren
2. Controleer aangrenzende code voor hetzelfde patroon — de fix kan verwante sinks hebben gemist
3. Voeg de rule toe aan CI zodat regressie automatisch wordt gevangen

### CI Integration Strategy
```yaml
# Run on every PR, fail on high severity
semgrep --config auto --severity ERROR --error .

# Run full scan on main branch weekly (slower, more thorough)
semgrep --config auto --severity WARNING --json --output results.json .
```

Laat CI niet mislukken op WARNING voor brede rulesets — de false positive rate zal legitiem werk blokkeren. Stem de severity threshold per project af.

## Voorbeeld

Beveiligingsaudit van een Node.js Express API:

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
