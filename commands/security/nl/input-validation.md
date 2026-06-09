---
description: Controleer inputvalidatie en sanitatie over alle vertrouwensgrenzen
argument-hint: "[file, route, or module]"
---
Controleer inputvalidatie en sanitatie in `$ARGUMENTS` (standaard: alle request handlers en data-invoerpunten) op injectievulnerabiliteiten, type-verwarring en ontbrekende grenshandhaving.

**1. Plaats alle vertrouwensgrenzen**

Vind elke plaats waar externe gegevens in de toepassing binnenkomen:
- HTTP request handlers (body, query params, path params, headers, cookies)
- Bestand uploads en multipart form data
- WebSocket message handlers
- Background job payloads (queues, cron inputs)
- Externe API-reacties die als vertrouwd worden behandeld
- Omgevingsvariabelen die in code logica worden gebruikt

**2. SQL injection**

- Vind alle database queries. Zijn ze geparametriseerd/prepared statements, of string-geconcateneerd?
- Controleer ORM-gebruik — zijn er raw query escape hatches (`.raw()`, `query()`, `execute()`) met niet-gesaniteerde input?
- Zoek naar second-order injection: gebruikersinvoer opgeslagen in DB en later gebruikt in een raw query.

**3. Command injection**

- Vind alle uses van `exec`, `spawn`, `system`, `popen`, `subprocess`, `child_process`, `os.system` en equivalenten.
- Wordt gebruiker-geleverde input geïnterpoleerd in shell commando's? Zelfs met escaping, geef de voorkeur aan argument arrays boven shell strings.

**4. Template injection (SSTI)**

- Identificeer server-side template engines in gebruik (Jinja2, Twig, Handlebars, Pebble, Velocity).
- Worden gebruiker-controlled data weergegeven in template expressions (`{{ }}`, `<%= %>`)?

**5. Path traversal**

- Vind alle bestand lees-/schrijfbewerkingen met gebruiker-geleverde bestandsnamen of paden.
- Wordt het opgeloste pad gevalideerd tegen een toegestane basisdirectory (bijv. `os.path.abspath` + prefix check)?

**6. Type en schema validatie**

- Wordt elk inkomend object gevalideerd tegen een strikte schema voordat het wordt gebruikt?
- Zijn numerieke invoeren grenzen-gecontroleerd? Worden enums gevalideerd tegen een allowlist?
- Is er prototype pollution risico (Node.js `Object.assign`, `merge` met niet-vertrouwde input)?

**7. Output**

Voor elke bevinding:
```
[SEVERITY] [file:line] — vulnerability type
Input source: where the untrusted data originates
Sink: where it's used unsafely
PoC: minimal payload or request that demonstrates the issue
Fix: specific remediation (parameterize, allowlist, validate schema, etc.)
```

Probeer bevindingen niet uit te buiten — beschrijf alleen de aanvalsvector en oplossing.
