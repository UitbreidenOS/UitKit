---
name: static-analysis
description: "Analyse statique : audits de sécurité et examens de qualité de code utilisant CodeQL et Semgrep pour détecter les vulnérabilités et les anti-patterns"
---

# Static Analysis

## Quand activer
Les examens de sécurité, les audits de qualité de code, ou quand l'utilisateur mentionne CodeQL, Semgrep ou trouver des modèles de vulnérabilité sur une base de code.

## Quand ne PAS utiliser
- Les tests de sécurité d'exécution (fuzzing, penetration testing, DAST) — l'analyse statique ne couvre que les chemins de code, pas l'exécution en direct
- Linting pour le style/formatage — utiliser ESLint, Prettier, Ruff ; ce ne sont pas des scanners de vulnérabilité
- Examen de code d'un seul fichier sans focus sur la vulnérabilité — utiliser la compétence `code-review` à la place

## Instructions

### Semgrep

**Exécuter contre un repo:**
```bash
# Utiliser l'ensemble de règles gérées (OWASP, CVEs, secrets)
semgrep --config auto .

# Exécuter un ensemble de règles spécifique
semgrep --config p/owasp-top-ten .

# Exécuter des règles personnalisées
semgrep --config ./rules/custom.yaml .

# Intégration CI — échouer sur erreur ou avertissement
semgrep --config auto --error .
```

**Syntaxe de modèle:**
- `$X` — metavariable, correspond à toute expression
- `...` — ellipsis, correspond à zéro ou plus instructions ou arguments
- `(int)$X` — metavariable typée (Java/C uniquement)

**Écrire une règle personnalisée:**
```yaml
rules:
  - id: sql-string-concat
    pattern: |
      $QUERY = "..." + $INPUT
      $DB.execute($QUERY)
    message: "Injection SQL possible: entrée utilisateur concaténée dans la requête"
    severity: ERROR
    languages: [python, javascript]
    metadata:
      cwe: "CWE-89"
```

**Modèles clés à écrire pour toute base de code:**
- SQL injection: entrée non approuvée atteignant `.execute()`, `.query()`, `db.raw()`
- Path traversal: `path.join()` avec entrée utilisateur, `fs.readFile()` avec chemins non vérifiés
- Command injection: `exec()`, `spawn()`, `subprocess.run()` avec interpolation de chaîne
- Deserialization: `pickle.loads()`, `JSON.parse()` sur données réseau passées à `eval()`
- Hardcoded secrets: modèles comme `password = "..."`, `api_key = "sk-..."`, `token = "..."`
- Reflected XSS: entrée utilisateur dans `innerHTML`, `document.write()`, `res.send()` sans assainissement

### CodeQL

**Flux de travail CLI:**
```bash
# Créer une base de données à partir de la source
codeql database create mydb --language=javascript --source-root=.

# Exécuter une requête
codeql query run queries/sql-injection.ql --database=mydb

# Exécuter une suite de requêtes intégrées
codeql database analyze mydb javascript-security-extended.qls --format=sarif-latest --output=results.sarif
```

**Structure de requête:**
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
Quand une vulnérabilité connue est trouvée (p.ex. une injection SQL), utiliser l'analyse de variante pour trouver tous les cas du même modèle :
1. Écrire une règle Semgrep ou CodeQL qui capture le modèle exact
2. L'exécuter sur la base de code entière, pas juste le fichier affecté
3. Trier chaque correspondance — vrai positif, faux positif ou nécessite examen
4. Documenter quelles instances sont corrigées par rapport au risque accepté

### Fix Verification
Après correction d'une vulnérabilité :
1. Réexécuter la règle originale qui l'a détectée — devrait produire zéro résultats
2. Vérifier le code adjacent pour le même modèle — la correction peut avoir manqué des puits liés
3. Ajouter la règle à CI pour que la régression soit automatiquement attrapée

### Stratégie d'intégration CI
```yaml
# Exécuter sur chaque PR, échouer sur sévérité élevée
semgrep --config auto --severity ERROR --error .

# Exécuter le scan complet sur la branche main une fois par semaine (plus lent, plus approfondi)
semgrep --config auto --severity WARNING --json --output results.json .
```

Ne pas faire échouer CI sur WARNING pour les larges ensembles de règles — le taux de faux positif bloquera le travail légitime. Ajuster le seuil de sévérité par projet.

## Exemple

Audit de sécurité d'une API Node.js Express :

```bash
# Étape 1: Scan auto large
semgrep --config auto . --json --output results.json
# Trouve 14 résultats : 3 ERROR, 8 WARNING, 3 INFO

# Étape 2: Écrire une règle personnalisée pour le constructeur de requêtes de l'app
cat > rules/knex-injection.yaml << 'EOF'
rules:
  - id: knex-raw-injection
    pattern: knex.raw($QUERY + $INPUT)
    message: "Unsanitized input in knex.raw()"
    severity: ERROR
    languages: [javascript, typescript]
EOF
semgrep --config rules/knex-injection.yaml .
# Trouve 2 vrais positifs supplémentaires manqués par le scan auto

# Étape 3: Corriger tous les deux, réexécuter pour confirmer zéro résultats
# Étape 4: Ajouter semgrep à CI avec le flag --error
```

---
