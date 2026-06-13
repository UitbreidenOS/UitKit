# Sicherheitsüberprüfungs-Workflow

Strukturierter Prozess zur Durchführung einer Sicherheitsüberprüfung einer Codebasis, API oder eines Systems vor dem Start oder nach erheblichen Änderungen.

## Wann verwendet

Führen Sie diesen Workflow aus:
- Vor dem Start eines neuen Produkts oder einer großen Funktion
- Wenn ein neuer Ingenieur das Team beitritt und eine Codebasis erbt
- Nach einem Sicherheitsvorfall, um verwandte Schwachstellen zu finden
- Vierteljährlich für sicherheitskritische Code-Pfade (Zahlungen, Authentifizierung, PII-Handhabung)
- Beim Ändern von Authentifizierungs-, Autorisierungs- oder Datenzugriffsmuster

## Phase 1: Bedrohungsmodellierung (30-60 Minuten)

Bevor Sie den Code betrachten, definieren Sie, was Sie schützen:

**Zu schützende Vermögenswerte:**
- Personenbezogene Daten von Benutzern (Name, E-Mail, Adresse, Zahlungsinformationen)
- Authentifizierungsanmeldedaten (Passwörter, Token, API-Schlüssel)
- Geschäftsdaten (proprietär, Kundendaten)
- Systemzugriff (Admin-Fähigkeiten, Infrastruktur)

**Bedrohungsakteure:**
- Externe Angreifer (nicht authentifizierte Benutzer, automatisierte Bots)
- Authentifizierte Benutzer, die versuchen, auf Daten anderer Benutzer zuzugreifen
- Böswillige Insider mit legitimen Zugriffen
- Lieferkette (kompromittierte Abhängigkeiten)

**Angriffsflächen:**
- API-Endpunkte (öffentlich und authentifiziert)
- Datei-Upload und -Verarbeitung
- Authentifizierungs- und Sitzungsverwaltung
- Drittanbieter-Integrationen (OAuth, Webhooks)
- Admin-Schnittstellen

**Priorisieren Sie nach Auswirkung × Wahrscheinlichkeit.**

## Phase 2: Automatisierte Überprüfung (30 Minuten)

Führen Sie diese Tools zuerst aus — sie finden offensichtliche Probleme schnell:

```bash
# 1. Anfälligkeiten von Abhängigkeiten
npm audit --audit-level=high        # Node.js
pip-audit                           # Python
cargo audit                         # Rust

# 2. Geheimniserkennung im Code
gitleaks detect --source . --verbose

# 3. Statische Analyse (falls für Ihre Sprache verfügbar)
# Node.js:
npx eslint --ext .ts,.tsx . --rulesdir security-rules/
# Python:
bandit -r src/ -ll

# 4. OWASP-Abhängigkeitsprüfung
docker run --rm owasp/dependency-check \
  --scan /path/to/project \
  --format HTML --out /output

# 5. Container-Überprüfung (wenn Docker):
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image my-image:latest
```

## Phase 3: Manuelle Code-Überprüfung

Konzentrieren Sie sich auf die risikantesten Bereiche:

**Authentifizierung und Sitzungsverwaltung:**
- [ ] Login-Endpunkt hat Rate Limiting
- [ ] Passwörter mit bcrypt/argon2 gehasht (nicht MD5/SHA1)
- [ ] Sitzungs-Token sind kryptographisch zufällig (nicht sequenzielle IDs)
- [ ] Sitzung wird bei Abmeldung ungültig (serverseitig)
- [ ] JWT: Signatur verifiziert, Ablauf geprüft, Algorithmus angepinnt
- [ ] Passwort-Reset-Token verfallen (< 1 Stunde) und sind einmalig verwendbar

**Autorisierung:**
- [ ] Jeder API-Endpunkt prüft die Authentifizierung
- [ ] Ressourcenzugriffsprüfungen überprüfen die Eigenschaft (nicht nur "angemeldet")
- [ ] Admin-Funktionen erfordern explizite Admin-Rollenkontrolle
- [ ] Horizontale Privilegienerweiterung getestet: Kann Benutzer A auf Ressourcen von Benutzer B zugreifen?

**Eingabevalidierung:**
- [ ] Alle Benutzereingaben vor der Verwendung validiert
- [ ] SQL-Abfragen parametrisiert (keine String-Interpolation)
- [ ] Datei-Uploads: Typvalidierung, Größenlimits, Inhaltsüberprüfung
- [ ] Path-Traversal-Schutz bei Dateioperationen
- [ ] HTML-Ausgabe maskiert (kein roher Benutzerinhalt als HTML gerendert)

**Sensible Daten:**
- [ ] Persönliche Daten nicht protokolliert (Logs nach E-Mail-, Telefon-, SSN-Mustern durchsuchen)
- [ ] Geheimnisse nicht in clientseitig lesbaren Umgebungsvariablen
- [ ] Keine Geheimnisse im Code, Kommentaren oder Test-Fixtures
- [ ] HTTPS erzwungen (kein HTTP-Fallback)
- [ ] Sensible Daten verschlüsselt im Ruhezustand (nicht nur gehasht)

**Drittanbieter-Integrationen:**
- [ ] Webhooks mit Signatur verifiziert (Stripe-Webhook-Geheimnis, etc.)
- [ ] OAuth-State-Parameter validiert (CSRF-Prävention)
- [ ] Umleitungs-URLs gegen Whitelist validiert
- [ ] API-Schlüssel von den Schlüsseln gedreht, die ablaufen oder bereits offengelegt wurden

## Phase 4: Penetrationstests (leicht)

Testen Sie die Anwendung direkt auf häufige Schwachstellen:

```bash
# SQL-Injection schneller Test (senden Sie diese in Form-Felder und URL-Parameter):
' OR '1'='1
1; DROP TABLE users; --

# XSS schneller Test:
<script>alert('xss')</script>
"><script>alert('xss')</script>

# Path Traversal:
../../../etc/passwd
%2e%2e%2f%2e%2e%2fetc%2fpasswd

# Authentifizierungsumgehung:
# Versuchen Sie, auf authentifizierte Endpunkte ohne Token zuzugreifen
# Versuchen Sie abgelaufene Token
# Versuchen Sie Token von einem anderen Benutzer
```

Verwenden Sie OWASP ZAP oder Burp Suite Community Edition für die automatisierte Überprüfung Ihrer laufenden Anwendung.

## Phase 5: Bericht und Behebung

**Schweregrad der Feststellungen:**
- **Kritisch**: ohne Authentifizierung exploitierbar, Dateneinfiltrationsergebnis → vor dem Start beheben
- **Hoch**: erfordert Authentifizierung, führt aber zu erheblichem Datenleck → innerhalb von 48h beheben
- **Mittel**: begrenzte Auswirkungen oder schwer exploitierbar → im Sprint beheben
- **Niedrig**: tiefgreifende Verteidigung, kleinere Probleme → im nächsten Wartungsfenster beheben

**Berichtsformat:**
```markdown
## Sicherheitsüberprüfung — [Datum]
Prüfer: [Name]
Umfang: [was wurde überprüft]

### Kritische Feststellungen
1. [Feststellung]: [Beschreibung, Standort, Proof of Concept, Behebung]

### Hohe Feststellungen
...

### Mittlere Feststellungen
...

### Behebungsplan
| Feststellung | Inhaber | Zieldatum | Status |
|---|---|---|---|
```

## Zugehöriger Inhalt

- `/skills/productivity/ship-gate` — Sicherheitsprüfliste vor der Bereitstellung
- `/prompts/system-prompts/security-auditor` — Claude-Sicherheitsüberprüfungs-Prompt
- `/rules/common/api-design` — Sicherheitsprinzipien für API-Design
- `/agents/roles/red-team` — Autorisierte Gegner-Simulation

---
