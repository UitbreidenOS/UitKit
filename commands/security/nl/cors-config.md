---
description: Controleer CORS-configuratie op overmatig toegestane origins, misbruik van inloggegevens en preflight-hiaten
argument-hint: "[serverbestand of frameworkconfig]"
---
Controleer de CORS-configuratie (Cross-Origin Resource Sharing) in `$ARGUMENTS` (standaard: scan alle server-entrypoints, middleware-bestanden en frameworkconfigs) op onjuiste configuraties die cross-origin-aanvallen mogelijk maken.

**1. CORS-configuratie lokaliseren**

Zoek alle plaatsen waar CORS-headers worden ingesteld:
- Express/Node: `cors()` middleware, handmatig `res.setHeader('Access-Control-Allow-Origin', ...)`
- Django: `CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_ALL_ORIGINS`, `django-cors-headers` instellingen
- FastAPI/Starlette: `CORSMiddleware` parameters
- Spring: `@CrossOrigin`, `WebMvcConfigurer.addCorsMappings`
- Nginx/Apache: `add_header Access-Control-Allow-Origin` richtlijnen
- CDN- of API Gateway-laagconfigs

**2. Controleer op wildcard-origin met inloggegevens**

De meest kritieke onjuiste configuratie:
- Is `Access-Control-Allow-Origin: *` gecombineerd met `Access-Control-Allow-Credentials: true`?
- Browsers blokkeren deze combinatie, maar sommige frameworks configureren dit stiekem verkeerd — verifieer de werkelijke antwoordheaders wanneer inloggegevens aanwezig zijn.

**3. Controleer op origin-reflectie**

- Geeft de server de `Origin` request-header direct door in `Access-Control-Allow-Origin` zonder validatie?
- Patroon om naar te zoeken: code die `request.headers.origin` of `$_SERVER['HTTP_ORIGIN']` leest en het in de antwoordheader echoet.
- Dit maakt elke origin vertrouwd — gelijk aan `*` maar omzeilt de inloggegevenbeperking.

**4. Valideer de lijst met toegestane origins**

- Is de lijst met toegestane origins een exacte overeenkomst (stringvergelijking) of een regex/prefix-match?
- Zwakke prefix-match: `origin.startsWith('https://example.com')` staat `https://example.com.attacker.com` toe
- Zwakke suffix-match: `origin.endsWith('example.com')` staat `https://attackerexample.com` toe
- Zijn `null` origins toegestaan? (geactiveerd door sandboxed iframes en `file://` — bijna nooit geschikt)

**5. Controleer preflight-verwerking**

- Worden `OPTIONS` preflight-verzoeken verwerkt en geven zij correct `Access-Control-Allow-Methods` en `Access-Control-Allow-Headers` terug?
- Zijn gevoelige endpoints (statuswijzigend, geverifieerd) beveiligd zelfs als preflight wordt omzeild (bijv. eenvoudige verzoeken met `Content-Type: text/plain`)?

**6. Controleer geëxponeerde headers**

- Bevat `Access-Control-Expose-Headers` headers die gevoelige info lekken (bijv. interne servicenamen, sessietokens, gebruikers-ID's)?

**7. Controleer per-route versus globale config**

- Is er een globale vrijzinnige config die per-route aangescherpt zou moeten worden, maar ontbreken de per-route overrides op gevoelige endpoints?

**Uitvoerindeling**:
```
## CORS Audit

### Bevindingen
[ERNST] [bestand:regel of configsleutel] — beschrijving
Aanvalsscenario: wat een aanvaller kan doen vanuit een kwaadaardige origin
Fix: exacte configuratiewijziging

### Huidige toegestane Origins
[Vermeld elke geconfigureerde origin en of deze geschikt is]

### Aanbevolen configuratie
[Plak een gecorrigeerd configfragment voor het gebruikte framework]
```

Ernst: Kritiek (origin-reflectie of wildcard+inloggegevens), Hoog (overmatig brede regex), Gemiddeld (null origin, overmatige geëxponeerde headers), Laag (preflight-hiaten op niet-gevoelige routes).
