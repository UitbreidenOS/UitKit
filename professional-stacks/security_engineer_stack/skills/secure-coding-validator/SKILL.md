# Secure Coding Validator

## When to activate

Use this skill when:
- Reviewing code for common OWASP Top 10 vulnerabilities (injection, XSS, broken auth, sensitive data exposure)
- Validating third-party or untrusted code contributions before merge
- Checking a PR for compliance with secure coding standards (input validation, parameterized queries, secret hygiene)
- Auditing specific security-sensitive subsystems (auth handlers, payment processing, database layers)
- Verifying CORS configurations, API authentication, or secret management patterns

## When NOT to use

- For full penetration testing or runtime security validation—this skill reviews code patterns, not behavior
- When you need architectural threat modeling—escalate to `/security-review` or a threat modeling specialist
- For compliance audits requiring signed attestation or formal reporting
- To debug active security incidents—focus on containment first, then code review
- When analyzing obfuscated, compiled, or binary code (no source available)

## Instructions

### 1. Input Validation Patterns

Scan for:
- **Unvalidated user input** — Check for direct use of `request.args`, `request.form`, `query params`, or `body` without sanitization
  - Look for missing length checks, type validation, whitelist constraints
  - Flag regex patterns that are too permissive or use user input in regex (`eval`, `sprintf` into regex)
  
- **Type coercion issues** — Verify types are explicitly checked, not coerced silently
  - Python: `int(user_input)` without try/except
  - JavaScript: loose equality (`==`) instead of strict (`===`)
  - SQL: numeric fields that accept string concatenation

- **Boundary conditions** — Check for off-by-one errors, negative inputs, null handling
  - Array index validation before access
  - File path traversal (`../../../etc/passwd` patterns)

**Fix pattern:**
```python
# Bad
@app.route('/user/<user_id>')
def get_user(user_id):
    return db.query(f"SELECT * FROM users WHERE id = {user_id}")

# Good
@app.route('/user/<user_id>')
def get_user(user_id):
    try:
        user_id = int(user_id)
        if user_id <= 0:
            return error(400)
        return db.query("SELECT * FROM users WHERE id = ?", (user_id,))
    except ValueError:
        return error(400)
```

### 2. Output Encoding

Scan for:
- **HTML/XML context escaping** — Check templates and string concatenation for unescaped user data
  - Python: Jinja2 `autoescape=True`, Flask `markupsafe.escape()`
  - JavaScript: textContent vs innerHTML; DOMPurify for user-generated HTML
  - Flag direct `+` concatenation of user input into HTML
  
- **URL encoding** — Verify query params and path components are percent-encoded
  - Flag bare string interpolation in redirects
  
- **JSON context** — Ensure JSON is properly escaped if rendered in HTML context
  - Flag `<script>` tags containing unescaped JSON

- **CSV/Excel injection** — Flag rows starting with `=`, `+`, `@`, `-` without escaping

**Fix pattern:**
```javascript
// Bad
document.getElementById('user-name').innerHTML = userInput;

// Good
document.getElementById('user-name').textContent = userInput;
// OR if HTML is intentional, sanitize:
import DOMPurify from 'dompurify';
document.getElementById('user-name').innerHTML = DOMPurify.sanitize(userInput);
```

### 3. SQL Injection Prevention

Scan for:
- **String concatenation in queries** — Flag f-strings, format(), or `+` operators in SQL
  - Exception: DDL that genuinely requires dynamic table/column names (requires allowlist + escape)
  
- **Missing parameterization** — Verify all user input uses `?`, `:param`, or ORM equivalents
  - SQL: `cursor.execute("... WHERE id = ?", (user_id,))`
  - ORM: SQLAlchemy `session.query().filter_by()`, Django `Model.objects.filter()`
  
- **Stored procedure/callable injection** — Check if stored proc parameters are user-controlled

**Fix pattern:**
```python
# Bad
query = f"SELECT * FROM orders WHERE user_id = {user_id}"
cursor.execute(query)

# Good
cursor.execute("SELECT * FROM orders WHERE user_id = ?", (user_id,))
```

### 4. CORS and Cross-Origin Policy

Scan for:
- **Overly permissive CORS** — Flag `Access-Control-Allow-Origin: *` with credentials
  - Should use explicit origin whitelist
  
- **Missing CORS headers** — For APIs, check `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`
  
- **Wildcard in allowlist** — Flag `*.example.com` if it includes subdomains you don't control

**Fix pattern:**
```python
# Bad
@app.after_request
def set_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Good
ALLOWED_ORIGINS = ['https://app.example.com', 'https://admin.example.com']

@app.after_request
def set_cors(response):
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
    return response
```

### 5. Secret Management

Scan for:
- **Hardcoded secrets** — API keys, passwords, tokens in code, config files, or comments
  - Flag strings matching common secret patterns: `api_key=`, `password=`, `token=`, `secret=`
  
- **Secrets in environment** — Verify they use environment variables or secret manager, not `.env` in repo
  - Check `.gitignore` includes `.env`, `.env.local`, etc.
  
- **Secrets in logs** — Look for print statements, logging, or error messages that may leak credentials
  - Flag `logger.info(f"User logged in: {password}")` patterns
  
- **Overly permissive secret access** — Check IAM policies (AWS, GCP) for broad secret reader roles

**Fix pattern:**
```python
# Bad
DATABASE_URL = "postgresql://user:password123@localhost:5432/db"
API_KEY = "sk-12345abcde"

# Good
import os
DATABASE_URL = os.getenv('DATABASE_URL')
API_KEY = os.getenv('API_KEY')

# In .env (gitignored):
# DATABASE_URL=postgresql://user:password123@localhost:5432/db
# API_KEY=sk-12345abcde
```

### 6. Validation Checklist

For each code section:
- [ ] All user input is validated (type, length, format, range)
- [ ] All output is encoded for its context (HTML, URL, JSON, CSV)
- [ ] All database queries use parameterized statements
- [ ] CORS policies are explicitly configured, not wildcard
- [ ] No secrets are hardcoded; all use environment variables or secret manager
- [ ] Secrets are not logged, displayed in errors, or leaked in comments
- [ ] Exception handling doesn't expose internal details
- [ ] Authentication/authorization is checked before processing
- [ ] Sensitive data is encrypted at rest and in transit (TLS/HTTPS)
- [ ] Rate limiting and account lockout are in place for login/sensitive endpoints

## Example

### Before (Vulnerable Code)

```python
from flask import Flask, request
import sqlite3

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    # SQL injection
    conn = sqlite3.connect('users.db')
    query = f"SELECT id FROM users WHERE username = '{username}' AND password = '{password}'"
    result = conn.execute(query).fetchone()
    
    if result:
        response = f"Welcome {username}!"  # XSS if username contains HTML
        return response
    return "Invalid credentials"

@app.route('/api/user/<user_id>')
def get_user_api(user_id):
    # No CORS configuration
    return {"user_id": user_id}

# Hardcoded secrets
DB_PASSWORD = "super_secret_123"
API_KEY = "sk-live-12345abcde"
```

### After (Secure)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from markupsafe import escape
import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Explicit CORS configuration
CORS(app, origins=['https://app.example.com'], supports_credentials=True)

# Load secrets from environment
DB_PASSWORD = os.getenv('DB_PASSWORD')
API_KEY = os.getenv('API_KEY')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '').strip()
    
    # Input validation
    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400
    if len(username) > 100 or len(password) > 255:
        return jsonify({"error": "Invalid input"}), 400
    
    # Parameterized query (SQL injection prevention)
    try:
        conn = sqlite3.connect('users.db')
        query = "SELECT id FROM users WHERE username = ? AND password = ?"
        result = conn.execute(query, (username, password)).fetchone()
        conn.close()
    except sqlite3.Error as e:
        # Don't expose internal error; log separately
        app.logger.error(f"DB error (not shown to user): {e}")
        return jsonify({"error": "Authentication failed"}), 401
    
    if result:
        # Output encoding (escape HTML)
        safe_username = escape(username)
        response = jsonify({"message": f"Welcome {safe_username}!"})
        return response
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/user/<user_id>')
def get_user_api(user_id):
    # Input validation
    try:
        user_id = int(user_id)
        if user_id <= 0:
            return jsonify({"error": "Invalid user ID"}), 400
    except ValueError:
        return jsonify({"error": "Invalid user ID"}), 400
    
    # Parameterized query
    try:
        conn = sqlite3.connect('users.db')
        query = "SELECT id, name FROM users WHERE id = ?"
        result = conn.execute(query, (user_id,)).fetchone()
        conn.close()
    except sqlite3.Error:
        return jsonify({"error": "Error retrieving user"}), 500
    
    if not result:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"id": result[0], "name": result[1]})

if __name__ == '__main__':
    app.run(ssl_context='adhoc')  # Enforce HTTPS
```

**Key improvements:**
- SQL queries use parameterized statements (`?` placeholders)
- User input is validated for type, length, and format
- Output is escaped for HTML context (`escape()`)
- CORS is explicitly configured, not wildcard
- Secrets are loaded from environment (`os.getenv()`)
- Errors don't expose internal database details
- HTTPS is enforced (ssl_context)
