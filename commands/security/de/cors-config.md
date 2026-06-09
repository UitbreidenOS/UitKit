---
description: Überprüfen Sie die CORS-Konfiguration auf zu permissive Ursprünge, Missbrauch von Anmeldedaten und Preflight-Lücken
argument-hint: "[server file or framework config]"
---
Überprüfen Sie die CORS-Konfiguration (Cross-Origin Resource Sharing) in `$ARGUMENTS` (Standard: scannt alle Server-Einstiegspunkte, Middleware-Dateien und Framework-Konfigurationen) auf Fehlkonfigurationen, die Cross-Origin-Angriffe ermöglichen.

**1. CORS-Konfiguration lokalisieren**

Finden Sie alle Orte, an denen CORS-Header gesetzt werden:
- Express/Node: `cors()` Middleware, manuelles `res.setHeader('Access-Control-Allow-Origin', ...)`
- Django: `CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_ALL_ORIGINS`, `django-cors-headers` Einstellungen
- FastAPI/Starlette: `CORSMiddleware` Parameter
- Spring: `@CrossOrigin`, `WebMvcConfigurer.addCorsMappings`
- Nginx/Apache: `add_header Access-Control-Allow-Origin` Direktiven
- CDN oder API Gateway Layer Konfigurationen

**2. Überprüfen Sie Wildcard-Ursprung mit Anmeldedaten**

Die kritischste Fehlkonfiguration:
- Wird `Access-Control-Allow-Origin: *` mit `Access-Control-Allow-Credentials: true` kombiniert?
- Browser blockieren diese Kombination, aber einige Frameworks konfigurieren sie stumm falsch — überprüfen Sie die tatsächlichen Response-Header, wenn Anmeldedaten vorhanden sind.

**3. Überprüfen Sie die Ursprungsreflektion**

- Reflektiert der Server den `Origin` Request-Header direkt in `Access-Control-Allow-Origin` ohne Validierung?
- Muster zum Finden: Code, der `request.headers.origin` oder `$_SERVER['HTTP_ORIGIN']` liest und es in den Response-Header zurückgibt.
- Dies macht jeden Ursprung vertraut — gleichwertig mit `*`, umgeht aber die Anmeldedaten-Beschränkung.

**4. Überprüfen Sie die Liste der zulässigen Ursprünge**

- Ist die Allowlist eine exakte Übereinstimmung (String-Vergleich) oder ein Regex/Prefix-Vergleich?
- Schwacher Prefix-Vergleich: `origin.startsWith('https://example.com')` erlaubt `https://example.com.attacker.com`
- Schwacher Suffix-Vergleich: `origin.endsWith('example.com')` erlaubt `https://attackerexample.com`
- Sind `null` Ursprünge erlaubt? (ausgelöst durch Sandboxed iFrames und `file://` — fast nie angemessen)

**5. Überprüfen Sie die Preflight-Behandlung**

- Werden `OPTIONS` Preflight-Anfragen behandelt und geben die korrekten `Access-Control-Allow-Methods` und `Access-Control-Allow-Headers` zurück?
- Sind sensible Endpunkte (zustandsändernd, authentifiziert) auch geschützt, wenn Preflight umgangen wird (z. B. einfache Anfragen mit `Content-Type: text/plain`)?

**6. Überprüfen Sie verfügbar gemachte Header**

- Enthält `Access-Control-Expose-Headers` Header, die sensible Informationen lecken (z. B. interne Service-Namen, Session-Token, Benutzer-IDs)?

**7. Überprüfen Sie Pro-Route vs. globale Konfiguration**

- Gibt es eine globale zu permissive Konfiguration, die pro Route verschärft werden soll, aber die Pro-Route-Überschreibungen auf sensiblen Endpunkten fehlen?

**Ausgabeformat**:
```
## CORS Audit

### Findings
[SEVERITY] [file:line or config key] — description
Attack scenario: what an attacker can do from a malicious origin
Fix: exact configuration change

### Current Allowed Origins
[List each configured origin and whether it's appropriate]

### Recommended Configuration
[Paste a corrected config snippet for the framework in use]
```

Severity: Critical (origin reflection or wildcard+credentials), High (overly broad regex), Medium (null origin, excess exposed headers), Low (preflight gaps on non-sensitive routes).
