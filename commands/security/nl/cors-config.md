---
description: Controleer CORS-configuratie op te permissieve oorsprongen, misbruik van referenties en preflight-hiaten
argument-hint: "[server file or framework config]"
---
Controleer de CORS-configuratie (Cross-Origin Resource Sharing) in `$ARGUMENTS` (standaard: scan alle server-ingangspunten, middleware-bestanden en framework-configs) op misconfiguraties die cross-origin-aanvallen mogelijk maken.

**1. Zoek CORS-configuratie**

Zoek alle plaatsen waar CORS-headers worden ingesteld:
- Express/Node: `cors()` middleware, handmatig `res.setHeader('Access-Control-Allow-Origin', ...)`
- Django: `CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_ALL_ORIGINS`, `django-cors-headers` instellingen
- FastAPI/Starlette: `CORSMiddleware` parameters
- Spring: `@CrossOrigin`, `WebMvcConfigurer.addCorsMappings`
- Nginx/Apache: `add_header Access-Control-Allow-Origin` richtlijnen
- CDN of API Gateway laagconfiguraties

**2. Controleer op jokerteken-oorsprong met referenties**

De meest kritieke misconfiguratie:
- Is `Access-Control-Allow-Origin: *` gecombineerd met `Access-Control-Allow-Credentials: true`?
- Browsers blokkeren deze combinatie, maar sommige frameworks configureren deze per ongeluk onjuist — controleer de daadwerkelijke response-headers wanneer referenties aanwezig zijn.

**3. Controleer op oorsprongreflectie**

- Weerkaatst de server de `Origin` request-header rechtstreeks in `Access-Control-Allow-Origin` zonder validatie?
- Patroon om te zoeken: code die `request.headers.origin` of `$_SERVER['HTTP_ORIGIN']` leest en deze in de response-header weerspiegelt.
- Dit maakt elke oorsprong vertrouwd — equivalent aan `*` maar omzeilt de credential-beperking.

**4. Valideer de lijst met toegestane oorsprongen**

- Is de liste van toegestane oorsprongen een exacte overeenkomst (stringvergelijking) of een regex/voorvoegsel-match?
- Zwak voorvoegsel-match: `origin.startsWith('https://example.com')` staat `https://example.com.attacker.com` toe
- Zwak achtervoegsel-match: `origin.endsWith('example.com')` staat `https://attackerexample.com` toe
- Zijn `null` oorsprongen toegestaan? (geactiveerd door sandbox-iframes en `file://` — bijna nooit gepast)

**5. Controleer preflight-verwerking**

- Worden `OPTIONS` preflight-verzoeken verwerkt en retourneren zij correct `Access-Control-Allow-Methods` en `Access-Control-Allow-Headers`?
- Zijn gevoelige eindpunten (statuswijzigend, geverifieerd) beveiligd, zelfs als preflight wordt omzeild (bijv. eenvoudige verzoeken met `Content-Type: text/plain`)?

**6. Controleer belichte headers**

- Bevat `Access-Control-Expose-Headers` headers die gevoelige informatie lekken (bijv. interne servicenamen, sessietokens, gebruikers-ID's)?

**7. Controleer per-route vs globale config**

- Is er een globale permissieve config die per route moet worden aangescherpt, maar de per-route-overrides ontbreken op gevoelige eindpunten?

**Output format**:
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
