---
description: Führen Sie eine systematische OWASP Top 10 Überprüfung gegen die Codebase oder eine bestimmte Komponente durch
argument-hint: "[component or file]"
---
Führen Sie eine strukturierte OWASP Top 10 (2021) Überprüfung von `$ARGUMENTS` (Standard: gesamte Codebase) durch. Bestimmen Sie für jede Kategorie die Anwendbarkeit, lokalisieren Sie relevanten Code und melden Sie Ergebnisse mit Schweregrad und Behebungsleitlinien.

Gehen Sie jede Kategorie der Reihe nach durch:

**A01 — Broken Access Control**
- Werden Autorisierungsprüfungen konsistent auf alle Routen und Code-Pfade zur gleichen Ressource angewendet?
- Sind IDOR-Anfälligkeiten vorhanden (Objekt-Suchen ohne Eigentumsverifizierung)?
- Können Benutzer auf Daten anderer Benutzer zugreifen, indem sie IDs oder Parameter manipulieren?

**A02 — Cryptographic Failures**
- Werden sensible Daten (PII, Zahlungsinformationen, Anmeldeinformationen) über unverschlüsselte Kanäle übertragen?
- Werden schwache Algorithmen verwendet (MD5, SHA1 für Passwörter, DES/RC4 für Verschlüsselung)?
- Werden Geheimnisse im Code, in Config-Dateien oder umgebungsbelasteten Orten gespeichert?
- Wird die TLS-Zertifikatvalidierung irgendwo deaktiviert?

**A03 — Injection**
- SQL-, NoSQL-, OS-Befehls-, LDAP-, XPath-Injektions-Vektoren — werden Abfragen parametrisiert?
- Wird Benutzereingabe jemals in Abfragezeichenketten oder Shell-Befehle interpoliert?

**A04 — Insecure Design**
- Sind Ratenbegrenzungen bei Auth-Endpoints fehlend (Brute-Force, Credential Stuffing)?
- Gibt es fehlende Eingabevalidierung auf der Domain-Modell-Ebene?
- Werden Sicherheitsanforderungen dokumentiert und getestet, oder völlig ignoriert?

**A05 — Security Misconfiguration**
- Sind Standardanmeldeinformationen, Ports oder Admin-Interfaces aktiviert gelassen?
- Werden detaillierte Fehlermeldungen oder Stack-Traces an Clients offengelegt?
- Sind unnötige Features, Endpoints oder Services aktiviert?
- Sind HTTP-Sicherheits-Header gesetzt (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)?

**A06 — Vulnerable and Outdated Components**
- Sind Abhängigkeiten auf Versionen mit bekannten CVEs gepinnt?
- Gibt es nicht gepatchte Betriebssystem- oder Runtime-Komponenten in Dockerfile oder Deployment-Configs?

**A07 — Identification and Authentication Failures**
- Werden Passwörter mit einem starken adaptiven Hash gespeichert (bcrypt, argon2, scrypt)?
- Sind Session-Token ausreichend zufällig und werden bei Abmeldung ungültig?
- Ist MFA für privilegierte Konten verfügbar?
- Sind Account-Enumeration-Vektoren vorhanden (unterschiedliche Antworten für gültige vs. ungültige Benutzernamen)?

**A08 — Software and Data Integrity Failures**
- Sind CI/CD-Pipelines gegen bösartige Commits oder Dependency-Substitution geschützt?
- Werden Deserialisierungsvorgänge bei nicht vertrauenswürdigen Daten ohne Typ-Validierung durchgeführt?

**A09 — Security Logging and Monitoring Failures**
- Werden Authentifizierungsfehler, Zugriffskontrollverletzungen und Eingabevalidierungsfehler protokolliert?
- Werden Logs an Orten gespeichert, wo ein Angreifer, der die App kompromittiert, sie nicht löschen kann?
- Enthalten Log-Einträge genügend Kontext (Benutzer, IP, Zeitstempel, Aktion), um Vorfälle zu untersuchen?

**A10 — Server-Side Request Forgery (SSRF)**
- Ruft die Anwendung URLs auf oder macht ausgehende Anfragen basierend auf vom Benutzer bereitgestelltem Input?
- Wird das Ziel gegen eine Allowlist von Domains/IPs validiert?
- Können interne Metadaten-Endpoints (169.254.169.254, localhost) über SSRF erreicht werden?

**Output format**:
```
## OWASP Top 10 Review

### [A0X] Category Name — PASS / FINDING / NOT APPLICABLE
Finding: [file:line] description
Severity: Critical / High / Medium / Low
Fix: specific remediation
```

Fassen Sie zusammen mit einer Risikotabelle am Ende: Kategorie, Status, Findinganzahl, höchster Schweregrad.
