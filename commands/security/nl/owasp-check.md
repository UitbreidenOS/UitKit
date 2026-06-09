---
description: Voer een systematische OWASP Top 10 review uit tegen de codebase of een specifiek component
argument-hint: "[component or file]"
---
Voer een gestructureerde OWASP Top 10 (2021) review uit van `$ARGUMENTS` (standaard: volledige codebase). Voor elke categorie bepaalt u de toepasselijkheid, localiseert u relevante code en rapporteert u bevindingen met ernst en herstelrichtlijnen.

Werk door elke categorie in volgorde:

**A01 — Broken Access Control**
- Zijn autorisatiecontroles consistent toegepast op alle routes en codepaden naar dezelfde resource?
- Zijn IDOR-kwetsbaarheden aanwezig (objectzoekopdrachten zonder eigendomsverificatie)?
- Kunnen gebruikers de gegevens van andere gebruikers openen door ID's of parameters te manipuleren?

**A02 — Cryptographic Failures**
- Worden gevoelige gegevens (PII, betalingsinformatie, referenties) verzonden via ongecodeerde kanalen?
- Worden zwakke algoritmen gebruikt (MD5, SHA1 voor wachtwoorden, DES/RC4 voor codering)?
- Worden geheimen opgeslagen in code, configuratiebestanden of omgevingsblootgestelde locaties?
- Zijn TLS-certificaatvalidaties ergens uitgeschakeld?

**A03 — Injection**
- SQL-, NoSQL-, OS-opdracht-, LDAP-, XPath-injectievectoren — zijn query's geparametriseerd?
- Wordt gebruikersinvoer ooit geïnterpoleerd in querytekenreeksen of shell-opdrachten?

**A04 — Insecure Design**
- Ontbreken er snelheidslimieten op auth-eindpunten (brute-force, credential stuffing)?
- Is er een gebrek aan invoervalidatie op de domeinmodellaag?
- Zijn veiligheidsvereisten gedocumenteerd en getest, of volledig afwezig?

**A05 — Security Misconfiguration**
- Worden standaardreferenties, poorten of admin-interfaces ingeschakeld?
- Worden uitgebreide foutmeldingen of stack traces blootgesteld aan clients?
- Worden onnodige functies, eindpunten of services ingeschakeld?
- Zijn HTTP-beveiligingsheaders ingesteld (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)?

**A06 — Vulnerable and Outdated Components**
- Zijn afhankelijkheden vastgezet op versies met bekende CVE's?
- Zijn er ongepatchte OS- of runtimecomponenten in Dockerfile of implementatieconfigs?

**A07 — Identification and Authentication Failures**
- Worden wachtwoorden opgeslagen met een sterke adaptieve hash (bcrypt, argon2, scrypt)?
- Zijn sessietokens voldoende willekeurig en ongeldig gemaakt bij afmelding?
- Is MFA beschikbaar voor bevoorrechte accounts?
- Zijn accountenumeratievectoren aanwezig (verschillende antwoorden voor geldige versus ongeldige gebruikersnamen)?

**A08 — Software and Data Integrity Failures**
- Zijn CI/CD-pijplijnen beschermd tegen kwaadwillende commits of afhankelijkheidvervanging?
- Worden deserialisatiebewerkingen uitgevoerd op niet-vertrouwde gegevens zonder typeverificatie?

**A09 — Security Logging and Monitoring Failures**
- Worden authenticatiefouten, schendingen van toegangsbeheer en invoervalidatiefouten geregistreerd?
- Worden logboeken opgeslagen op een plaats waar een aanvaller die de app compromitteert deze niet kan wissen?
- Bevatten logboekinvoeren voldoende context (gebruiker, IP, tijdstempel, actie) om incidenten te onderzoeken?

**A10 — Server-Side Request Forgery (SSRF)**
- Haalt de applicatie URL's op of voert deze outbound-verzoeken uit op basis van door de gebruiker geleverde invoer?
- Wordt de bestemming gevalideerd tegen een allowlist van domeinen/IP's?
- Kunnen interne metadata-eindpunten (169.254.169.254, localhost) via SSRF worden bereikt?

**Output format**:
```
## OWASP Top 10 Review

### [A0X] Category Name — PASS / FINDING / NOT APPLICABLE
Finding: [file:line] description
Severity: Critical / High / Medium / Low
Fix: specific remediation
```

Vat samen met een risicotabel aan het einde: categorie, status, aantal bevindingen, hoogste ernst.
