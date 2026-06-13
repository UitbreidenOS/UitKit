---
description: Führen Sie eine systematische OWASP Top 10-Überprüfung gegen die Codebasis oder eine spezifische Komponente durch
argument-hint: "[Komponente oder Datei]"
---
Führen Sie eine strukturierte OWASP Top 10 (2021)-Überprüfung von `$ARGUMENTS` (Standard: gesamte Codebasis) durch. Bestimmen Sie für jede Kategorie die Anwendbarkeit, lokalisieren Sie relevanten Code und melden Sie Findings mit Schweregrad und Reparaturanleitungen.

Gehen Sie nacheinander durch jede Kategorie:

**A01 — Defekte Zugriffskontrolle**
- Werden Autorisierungsprüfungen konsistent über alle Routen und Codepfade zur gleichen Ressource angewendet?
- Sind IDOR-Anfälligkeiten vorhanden (Objektsuchen ohne Eigentümerverifizierung)?
- Können Benutzer auf Daten anderer Benutzer zugreifen, indem sie IDs oder Parameter manipulieren?

**A02 — Kryptografische Fehler**
- Werden sensible Daten (PII, Zahlungsinformationen, Anmeldedaten) über unverschlüsselte Kanäle übertragen?
- Werden schwache Algorithmen verwendet (MD5, SHA1 für Passwörter, DES/RC4 für Verschlüsselung)?
- Werden Geheimnisse im Code, in Konfigurationsdateien oder an umgebungsexponierten Orten gespeichert?
- Sind TLS-Zertifikatsvalidierungen irgendwo deaktiviert?

**A03 — Injection**
- SQL-, NoSQL-, OS-Befehls-, LDAP-, XPath-Injection-Vektoren — sind Abfragen parametrisiert?
- Wird Benutzereingabe jemals in Abfragezeichenfolgen oder Shell-Befehle interpoliert?

**A04 — Unsicheres Design**
- Fehlen Ratenbegrenzungen auf Auth-Endpunkten (Brute-Force, Credential Stuffing)?
- Gibt es einen Mangel an Eingabevalidierung auf der Domain-Model-Ebene?
- Sind Sicherheitsanforderungen dokumentiert und getestet oder völlig fehlend?

**A05 — Sicherheitskonfigurationsfehler**
- Sind Standardanmeldedaten, Ports oder Admin-Schnittstellen aktiviert?
- Sind ausführliche Fehlermeldungen oder Stack-Traces für Clients verfügbar gemacht?
- Sind unnötige Funktionen, Endpunkte oder Dienste aktiviert?
- Sind HTTP-Sicherheits-Header gesetzt (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)?

**A06 — Anfällige und veraltete Komponenten**
- Sind Abhängigkeiten an Versionen mit bekannten CVEs festgelegt?
- Gibt es nicht gepatchte OS- oder Runtime-Komponenten in Dockerfile oder Deployment-Konfigurationen?

**A07 — Authentifizierungs- und Identifizierungsfehler**
- Werden Passwörter mit einem starken adaptiven Hash gespeichert (bcrypt, argon2, scrypt)?
- Sind Session-Token ausreichend zufällig und werden bei Abmeldung invalidiert?
- Ist MFA für privilegierte Konten verfügbar?
- Sind Kontenaufzählungsvektoren vorhanden (unterschiedliche Antworten für gültige vs ungültige Benutzernamen)?

**A08 — Software- und Datenintegritätsfehler**
- Sind CI/CD-Pipelines gegen böswillige Commits oder Abhängigkeitssubstitution geschützt?
- Werden Deserialisierungsvorgänge für nicht vertrauenswürdige Daten ohne Typvalidierung durchgeführt?

**A09 — Fehler bei Sicherheitsprotokollierung und -überwachung**
- Werden Authentifizierungsfehler, Zugriffskontrollverletzungen und Eingabevalidierungsfehler protokolliert?
- Werden Protokolle an einem Ort gespeichert, an dem ein Angreifer, der die App kompromittiert, sie nicht löschen kann?
- Enthalten Protokolleinträge ausreichend Kontext (Benutzer, IP, Zeitstempel, Aktion), um Vorfälle zu untersuchen?

**A10 — Server-Side Request Forgery (SSRF)**
- Ruft die Anwendung URLs auf oder stellt ausgehende Anfragen auf Basis von benutzerseitig bereitgestellter Eingabe?
- Wird das Ziel gegen eine Whitelist von Domänen/IPs validiert?
- Können interne Metadaten-Endpunkte (169.254.169.254, localhost) über SSRF erreicht werden?

**Ausgabeformat**:
```
## OWASP Top 10-Überprüfung

### [A0X] Kategoriename — BESTANDEN / FINDING / NICHT ANWENDBAR
Finding: [Datei:Zeile] Beschreibung
Schweregrad: Kritisch / Hoch / Mittel / Niedrig
Behebung: spezifische Abhilfe
```

Fassen Sie mit einer Risikotabelle am Ende zusammen: Kategorie, Status, Finding-Anzahl, höchster Schweregrad.
