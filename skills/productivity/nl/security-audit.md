---
name: security-audit
description: "Security audit for code: OWASP Top 10, injection, auth flaws, secrets, dependency vulnerabilities — with severity and fix for each finding"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../security-audit.md).

# Vaardigheid: Beveiligingsaudit

## Wanneer activeren
- Beveiligingscontrole vóór de lancering van een nieuwe functie of endpoint
- Audit van een codebase vóór open-source publicatie
- Code review feedback vraagt om beveiligingsanalyse
- Na het toevoegen van authenticatie, autorisatie of betalingsverwerking
- Vóór een penetratietest — eerst de voor de hand liggende problemen vinden

## Wanneer NIET gebruiken
- Afhankelijkheidsscanning — gebruik in plaats daarvan `npm audit`, `pip-audit` of Snyk (Claude kan geen CVE-databases lezen)
- Live penetratietesten tegen productiesystemen
- Compliance-certificering (SOC2, PCI-DSS) — deze vereisen menselijke auditors en specifieke tools
- Binaire/gecompileerde code — Claude heeft broncode nodig

## Instructies

### De audit aanroepen

```
/security-audit

Scope: {bestand, map of beschrijf het gebied}
Focus: {all / auth / input validation / secrets / API endpoints}
```

Of gericht:
```
/security-audit

Review the user authentication flow in src/auth/.
Pay special attention to: session management, password reset, and JWT validation.
```

### OWASP Top 10 checklist die Claude doorloopt

**A01 — Gebroken toegangscontrole**
- [ ] Autorisatie gecontroleerd op elke route/endpoint (niet alleen authenticatie)
- [ ] Horizontale privilege-escalatie: kan gebruiker A de gegevens van gebruiker B benaderen?
- [ ] IDOR (Onveilige directe objectreferentie): worden ID's gevalideerd tegen de geauthenticeerde gebruiker?
- [ ] Alleen-admin endpoints beschermd tegen gewone gebruikers

**A02 — Cryptografische fouten**
- [ ] Wachtwoorden gehasht met bcrypt/argon2/scrypt (niet MD5, SHA1 of puur SHA256)
- [ ] Gevoelige gegevens versleuteld in rust (PII, betalingsinformatie, tokens)
- [ ] HTTPS afgedwongen, geen gevoelige gegevens in URL's of logs
- [ ] Secrets niet hard-gecodeerd of gecommit naar git

**A03 — Injectie**
- [ ] SQL-queries gebruiken geparametriseerde queries / ORM (geen stringconcatenatie)
- [ ] NoSQL-queries gesanitiseerd
- [ ] Commando-injectie: `subprocess`, `exec`, `eval` met gebruikersinvoer
- [ ] LDAP-, XPath-, XML-injectie indien van toepassing

**A04 — Onveilig ontwerp**
- [ ] Rate-limiting op auth-endpoints (inloggen, wachtwoord reset, OTP)
- [ ] Account vergrendeling na N mislukte pogingen
- [ ] Gevoelige bewerkingen vereisen herautenticatie (wachtwoordwijziging, betaling)

**A05 — Beveiligingsfoutconfiguratie**
- [ ] Debugmodus uitgeschakeld in productie
- [ ] Foutmeldingen lekken geen stack-traces of interne details naar gebruikers
- [ ] Standaardgegevens gewijzigd, voorbeeldaccounts verwijderd
- [ ] CORS restrictief geconfigureerd (niet `*`)
- [ ] Beveiligingsheaders aanwezig (HSTS, CSP, X-Frame-Options)

**A06 — Kwetsbare en verouderde componenten**
- [ ] Geen bekende kwetsbare afhankelijkheden (afzonderlijk `npm audit` / `pip-audit` uitvoeren)
- [ ] Afhankelijkheden vastgezet op specifieke versies
- [ ] Geen verlaten pakketten met open beveiligingsproblemen

**A07 — Identificatie- en authenticatiefouten**
- [ ] JWT correct gevalideerd (algoritme, vervaldatum, handtekening)
- [ ] Sessietokens zijn cryptografisch willekeurig, voldoende entropie
- [ ] Sessies ongeldig gemaakt bij uitloggen (niet alleen clientzijdig)
- [ ] "Onthoud mij"-tokens veilig opgeslagen, vernieuwd bij gebruik
- [ ] Wachtwoord-reset-tokens eenmalig en kortlevend

**A08 — Software- en gegevensintegriteitsfouten**
- [ ] Deserialisatie van gebruikersinvoer gecontroleerd op gevaarlijke typen
- [ ] Bestandsuploads: type gevalideerd aan serverzijde, opgeslagen buiten de webroot
- [ ] CI/CD-pipeline-integriteit (geen niet-vertrouwde code in de build-keten)

**A09 — Logboek- en monitoringfouten**
- [ ] Auth-fouten gelogd met IP, tijdstempel, gebruikersidentificator
- [ ] Gevoelige waarden (wachtwoorden, tokens) niet gelogd
- [ ] Logs manipulatiebestendig (alleen toevoegen, verzonden naar extern systeem)

**A10 — SSRF (Server-Side Request Forgery)**
- [ ] Door gebruiker opgegeven URL's gevalideerd tegen een toegestane lijst
- [ ] Interne metadata-endpoints geblokkeerd (169.254.169.254, etc.)
- [ ] Uitgaande verzoeken gebruiken een proxy met egress-filtering

### Uitvoerformaat

Claude rapporteert elke bevinding met:

```
[ERNST] {titel}
Location: {bestand:regel of gebied}
Issue: {wat de kwetsbaarheid is}
Risk: {wat een aanvaller zou kunnen doen}
Fix:
  {codewijziging of configuratiestap}
```

**Ernstniveaus:**
- 🔴 **KRITIEK** — nu uitbuitbaar, datalek of accountovername mogelijk
- 🟠 **HOOG** — uitbuitbaar met bepaalde voorwaarden, significante impact
- 🟡 **MEDIUM** — uitbuitbaar in specifieke scenario's, matige impact
- 🟢 **LAAG** — defense-in-depth probleem, lage waarschijnlijkheid of impact
- ℹ️ **INFO** — best practice niet gevolgd, geen directe uitbuitbaarheid

### Veelvoorkomende bevindingen en oplossingen

**SQL-injectie:**
```python
# Kwetsbaar
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# Opgelost
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
```

**Hard-gecodeerd secret:**
```python
# Kwetsbaar
API_KEY = "sk-prod-abc123..."

# Opgelost
API_KEY = os.environ["API_KEY"]  # nooit in de broncode
```

**Ontbrekende autorisatie:**
```python
# Kwetsbaar — controleert alleen authenticatie
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    return db.query(Order).get(order_id)

# Opgelost — controleert of de bestelling bij deze gebruiker hoort
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id   # ← autorisatiecontrole
    ).first()
    if not order:
        raise HTTPException(status_code=404)
    return order
```

**Zwakke JWT-validatie:**
```python
# Kwetsbaar — accepteert elk algoritme (algoritme-verwarringsaanval)
payload = jwt.decode(token, key, algorithms=["none"])

# Opgelost
payload = jwt.decode(token, key, algorithms=["HS256"])  # expliciete toegestane lijst
```

**Te permissief CORS:**
```python
# Kwetsbaar
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)

# Opgelost — credentials vereisen expliciete oorsprong
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.yourdomain.com"],
    allow_credentials=True,
)
```

## Voorbeeld

**Bereik:** `src/auth/` in een FastAPI-applicatie

**Verwachte bevindingen:**
```
🔴 KRITIEK — Geen rate-limiting op /auth/login
Location: src/auth/routes.py:24
Issue: Het login-endpoint accepteert onbeperkte verzoeken zonder beperking.
Risk: Brute-force of credential-stuffing-aanvallen kunnen geldige accounts enumereren.
Fix: slowapi rate-limiter toevoegen: @limiter.limit("5/minute") op de login-route.

🟠 HOOG — Wachtwoord-reset-token niet ongeldig gemaakt na gebruik
Location: src/auth/password_reset.py:67
Issue: reset_password() werkt het wachtwoord bij maar verwijdert het reset-token niet.
Risk: Als een token wordt onderschept, kan het opnieuw worden gebruikt om het wachtwoord te resetten.
Fix: Token onmiddellijk na wachtwoordupdate verwijderen of markeren als gebruikt.

🟡 MEDIUM — JWT-algoritme niet expliciet opgegeven
Location: src/auth/jwt.py:12
Issue: jwt.decode() gebruikt automatische algoritmedetectie.
Risk: Algoritme-verwarringsaanval als de server het algoritme 'none' accepteert.
Fix: algorithms=["HS256"] expliciet doorgeven aan jwt.decode().

ℹ️ INFO — Mislukte loginpogingen niet gelogd
Location: src/auth/routes.py:38
Issue: Authenticatiefouten worden stilzwijgend genegeerd.
Fix: Mislukte pogingen loggen met tijdstempel, IP en gebruikersnaam voor monitoring.
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen samen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
