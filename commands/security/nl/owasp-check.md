---
description: Voer een systematische OWASP Top 10 beoordeling uit tegen de codebase of een specifiek component
argument-hint: "[component of bestand]"
---
Voer een gestructureerde OWASP Top 10 (2021) review uit van `$ARGUMENTS` (standaard: gehele codebase). Bepaal voor elke categorie de toepasbaarheid, localiseer relevante code en rapporteer bevindingen met ernst en fixbegeleiding.

Werk door elke categorie in volgorde:

**A01 — Broken Access Control**
- Zijn autorisatiecontroles consistent toegepast over alle routes en codepaden naar dezelfde bron?
- Zijn IDOR-kwetsbaarheden aanwezig (objectzoekopdrachten zonder eigenaarverificatie)?
- Kunnen gebruikers toegang krijgen tot gegevens van andere gebruikers door ID's of parameters te manipuleren?

**A02 — Cryptographic Failures**
- Worden gevoelige gegevens (PII, betalingsinformatie, referenties) verzonden via ongecodeerde kanalen?
- Worden zwakke algoritmen gebruikt (MD5, SHA1 voor wachtwoorden, DES/RC4 voor versleuteling)?
- Worden geheimen opgeslagen in code, configuratiebestanden of omgevingsblootgestelde locaties?
- Zijn TLS-certificaatvalidaties ergens uitgeschakeld?

**A03 — Injection**
- SQL, NoSQL, OS-commando, LDAP, XPath injectienvectoren — zijn query's geparametriseerd?
- Wordt gebruikersinvoer ooit geïnterpoleerd in queryreeksen of shell-commando's?

**A04 — Insecure Design**
- Ontbreken er snelheidslimieten op verificatie-eindpunten (brute-force, credential stuffing)?
- Is er een gebrek aan inputvalidatie op het domeinmodellaag?
- Zijn beveiligingsvereisten gedocumenteerd en getest, of volledig afwezig?

**A05 — Security Misconfiguration**
- Zijn standaardgegevens, poorten of beheerdersinterfaces ingeschakeld?
- Worden uitgebreide foutmeldingen of stacktraces blootgesteld aan clients?
- Zijn onnodige functies, eindpunten of services ingeschakeld?
- Zijn HTTP-beveiligingsheaders ingesteld (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)?

**A06 — Vulnerable and Outdated Components**
- Zijn afhankelijkheden vastgesteld op versies met bekende CVE's?
- Zijn er ongepatche OS- of runtimecomponenten in Dockerfile of implementatieconfiguraties?

**A07 — Identification and Authentication Failures**
- Worden wachtwoorden opgeslagen met een sterke adaptieve hash (bcrypt, argon2, scrypt)?
- Zijn sessietokens voldoende willekeurig en ongeldig gemaakt bij afmelden?
- Is MFA beschikbaar voor bevoorrechte accounts?
- Zijn accountopsommingsvectoren aanwezig (verschillende antwoorden voor geldige versus ongeldige gebruikersnamen)?

**A08 — Software and Data Integrity Failures**
- Zijn CI/CD-pijplijnen beveiligd tegen kwaadaardige commits of afhankelijkheidsvervangingen?
- Worden deserialisatiebewerkingen uitgevoerd op niet-vertrouwde gegevens zonder typevalidatie?

**A09 — Security Logging and Monitoring Failures**
- Worden verificatiefouten, schendingen van toegangscontrole en invoervalidatiefouten vastgelegd?
- Worden logboeken opgeslagen waar een aanvaller die de app compromitteert deze niet kan wissen?
- Bevatten logboekvermeldingen voldoende context (gebruiker, IP, timestamp, actie) om incidenten te onderzoeken?

**A10 — Server-Side Request Forgery (SSRF)**
- Haalt de applicatie URL's op of doet deze uitgaande verzoeken op basis van door gebruikers geleverde invoer?
- Is de bestemming gevalideerd tegen een whitelist van domeinen/IP's?
- Kunnen interne metadata-eindpunten (169.254.169.254, localhost) bereikt worden via SSRF?

**Uitvoerformaat**:
```
## OWASP Top 10 Review

### [A0X] Categorienaam — PASS / FINDING / NOT APPLICABLE
Finding: [bestand:regel] beschrijving
Severity: Critical / High / Medium / Low
Fix: specifieke remediatie
```

Vat samen met een risicotabel aan het eind: categorie, status, aantal bevindingen, hoogste ernst.
