---
description: Voer een volledige statische beveiligingsscan uit op een bestand of map en rapporteer exploiteerbare kwetsbaarheden
argument-hint: "[path]"
---
Voer een grondige statische veiligheidsanalyse uit op `$ARGUMENTS`. Als geen pad wordt gegeven, scan de hele werkboom.

Stappen:

1. **Inventariseer het aanvalsoppervlak**: Geef alle ingangspoorten op — HTTP-handlers, CLI-argumenten, bestandlezingen, IPC, omgevingsvariabelen, deserialisatie.

2. **Scan naar kwetsbaarheidsklassen** — voor elke bevinding meldt u: bestand, regel, ernst (CRITICAL / HIGH / MEDIUM / LOW), CWE-ID en beschrijving in één regel:
   - Injection: SQL, NoSQL, LDAP, commando, template, header
   - Verbroken authenticatie: hard-coded referenties, zwakke tokenGeneratie, ontbrekende vervaldatum
   - Blootstelling van gevoelige gegevens: geheimen in bron, versleutelde opslag niet versleuteld, uitgebreide foutberichten
   - Onveilige deserialisatie: pickle, YAML load, eval-gebaseerde parsers
   - Verbroken toegangscontrole: ontbrekende authz-controles, IDOR-patronen, pad-traversal
   - Beveiligingsconfiguratie-onjuistheden: foutopsporingsvlaggen, permissieve CORS, mapoverzicht
   - XSS / CSRF: gereflecteerd, opgeslagen, op DOM gebaseerd; ontbrekende CSRF-tokens
   - Kwetsbare onderdelen: imports bekend als CVE-gevolgen (markeer voor dep-audit)
   - SSRF: door gebruiker beheerde URL's opgehaald aan serverzijde
   - XXE: XML-parsers met externe entiteiten ingeschakeld

3. **Triaging en rangschikking**: Sorteer alle bevindingen op ernst vervolgens exploiteerbaarheid. Markeer alles wat exploiteerbaar is zonder authenticatie als CRITICAL ongeacht CVSS-basis.

4. **Voor elke CRITICAL- en HIGH-bevinding**, geeft u op:
   - Minimale proof-of-concept exploitscenario (geen werkende exploitcode — beschrijf de vector)
   - Aanbevolen fix met gecorrigeerd codefragment

5. **Uitvoerformat**:
   ```
   ## Security Scan: <path>

   ### Summary
   CRITICAL: N | HIGH: N | MEDIUM: N | LOW: N

   ### Findings
   [severity] [CWE-XXX] file:line — description
   Fix: ...

   ### Deferred (MEDIUM/LOW)
   Bullet list only — no fix detail
   ```

Neem geen bevindingen op waarvan u onzeker bent. Geef de voorkeur aan precisie boven herinnering — één bevestigde kritieke overtreft tien speculatieve lage.
