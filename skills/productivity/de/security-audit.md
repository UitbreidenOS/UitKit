---
name: security-audit
description: "Security audit for code: OWASP Top 10, injection, auth flaws, secrets, dependency vulnerabilities — with severity and fix for each finding"
---

> 🇩🇪 Deutsche Version. [Englische Version](../security-audit.md).

# Skill: Sicherheits-Audit

## Wann aktivieren
- Sicherheitsüberprüfung vor dem Start eines neuen Features oder Endpunkts
- Audit einer Codebasis vor der Open-Source-Veröffentlichung
- Code-Review-Feedback fordert eine Sicherheitsanalyse an
- Nach dem Hinzufügen von Authentifizierung, Autorisierung oder Zahlungsverarbeitung
- Vor einem Penetrationstest — zuerst die offensichtlichen Probleme finden

## Wann NICHT verwenden
- Abhängigkeitsscans — stattdessen `npm audit`, `pip-audit` oder Snyk verwenden (Claude kann keine CVE-Datenbanken lesen)
- Live-Penetrationstests gegen Produktionssysteme
- Compliance-Zertifizierung (SOC2, PCI-DSS) — diese erfordern menschliche Prüfer und spezielle Tools
- Binärer/kompilierter Code — Claude benötigt Quellcode

## Anweisungen

### Den Audit aufrufen

```
/security-audit

Scope: {Datei, Verzeichnis oder den Bereich beschreiben}
Focus: {all / auth / input validation / secrets / API endpoints}
```

Oder gezielt:
```
/security-audit

Review the user authentication flow in src/auth/.
Pay special attention to: session management, password reset, and JWT validation.
```

### OWASP Top 10 Checkliste, die Claude durcharbeitet

**A01 — Fehlerhafte Zugriffskontrolle**
- [ ] Autorisierung auf jeder Route/jedem Endpunkt geprüft (nicht nur Authentifizierung)
- [ ] Horizontale Rechteausweitung: Kann Benutzer A auf Daten von Benutzer B zugreifen?
- [ ] IDOR (Unsichere direkte Objektreferenz): Werden IDs gegen den authentifizierten Benutzer validiert?
- [ ] Nur-Admin-Endpunkte gegen normale Benutzer geschützt

**A02 — Kryptografische Fehler**
- [ ] Passwörter mit bcrypt/argon2/scrypt gehasht (nicht MD5, SHA1 oder reines SHA256)
- [ ] Sensible Daten im Ruhezustand verschlüsselt (PII, Zahlungsinformationen, Tokens)
- [ ] HTTPS erzwungen, keine sensiblen Daten in URLs oder Logs
- [ ] Secrets nicht hartcodiert oder in git eingecheckt

**A03 — Injection**
- [ ] SQL-Abfragen verwenden parametrisierte Abfragen / ORM (keine Zeichenkettenverkettung)
- [ ] NoSQL-Abfragen bereinigt
- [ ] Befehlsinjektion: `subprocess`, `exec`, `eval` mit Benutzereingabe
- [ ] LDAP-, XPath-, XML-Injection falls zutreffend

**A04 — Unsicheres Design**
- [ ] Rate-Limiting auf Auth-Endpunkten (Login, Passwort-Reset, OTP)
- [ ] Kontosperrung nach N fehlgeschlagenen Versuchen
- [ ] Sensible Vorgänge erfordern erneute Authentifizierung (Passwortänderung, Zahlung)

**A05 — Sicherheitsfehlkonfiguration**
- [ ] Debug-Modus in der Produktion deaktiviert
- [ ] Fehlermeldungen geben keine Stack-Traces oder interne Details an Benutzer preis
- [ ] Standard-Anmeldedaten geändert, Beispielkonten entfernt
- [ ] CORS restriktiv konfiguriert (nicht `*`)
- [ ] Sicherheits-Header vorhanden (HSTS, CSP, X-Frame-Options)

**A06 — Anfällige und veraltete Komponenten**
- [ ] Keine bekannt-anfälligen Abhängigkeiten (separat `npm audit` / `pip-audit` ausführen)
- [ ] Abhängigkeiten auf spezifische Versionen festgelegt
- [ ] Keine verlassenen Pakete mit offenen Sicherheitsproblemen

**A07 — Identifizierungs- und Authentifizierungsfehler**
- [ ] JWT ordnungsgemäß validiert (Algorithmus, Ablaufzeit, Signatur)
- [ ] Session-Tokens sind kryptografisch zufällig, ausreichende Entropie
- [ ] Sessions beim Abmelden ungültig gemacht (nicht nur clientseitig)
- [ ] "Angemeldet bleiben"-Tokens sicher gespeichert, bei Verwendung erneuert
- [ ] Passwort-Reset-Tokens einmalig und kurzlebig

**A08 — Software- und Datenintegritätsfehler**
- [ ] Deserialisierung von Benutzereingaben auf gefährliche Typen geprüft
- [ ] Datei-Uploads: Typ serverseitig validiert, außerhalb des Web-Roots gespeichert
- [ ] CI/CD-Pipeline-Integrität (kein nicht vertrauenswürdiger Code in der Build-Kette)

**A09 — Protokollierungs- und Überwachungsfehler**
- [ ] Auth-Fehler mit IP, Zeitstempel, Benutzerkennung protokolliert
- [ ] Sensible Werte (Passwörter, Tokens) nicht protokolliert
- [ ] Logs manipulationssicher (nur anhängen, an externes System übertragen)

**A10 — SSRF (Server-Side Request Forgery)**
- [ ] Vom Benutzer bereitgestellte URLs gegen eine Zulassungsliste validiert
- [ ] Interne Metadaten-Endpunkte blockiert (169.254.169.254, etc.)
- [ ] Ausgehende Anfragen verwenden einen Proxy mit Ausgangsfilterung

### Ausgabeformat

Claude meldet jeden Fund mit:

```
[SCHWEREGRAD] {titel}
Location: {datei:zeile oder bereich}
Issue: {was die Schwachstelle ist}
Risk: {was ein Angreifer tun könnte}
Fix:
  {Code-Änderung oder Konfigurationsschritt}
```

**Schweregradsstufen:**
- 🔴 **KRITISCH** — jetzt ausnutzbar, Datenverletzung oder Kontoübernahme möglich
- 🟠 **HOCH** — mit einigen Bedingungen ausnutzbar, erhebliche Auswirkungen
- 🟡 **MITTEL** — in bestimmten Szenarien ausnutzbar, moderate Auswirkungen
- 🟢 **NIEDRIG** — Defense-in-Depth-Problem, geringe Wahrscheinlichkeit oder Auswirkung
- ℹ️ **INFO** — Best Practice nicht befolgt, keine direkte Ausnutzbarkeit

### Häufige Befunde und Korrekturen

**SQL-Injection:**
```python
# Anfällig
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# Behoben
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
```

**Hartcodiertes Secret:**
```python
# Anfällig
API_KEY = "sk-prod-abc123..."

# Behoben
API_KEY = os.environ["API_KEY"]  # niemals im Quellcode
```

**Fehlende Autorisierung:**
```python
# Anfällig — prüft nur die Authentifizierung
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    return db.query(Order).get(order_id)

# Behoben — prüft, ob die Bestellung diesem Benutzer gehört
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id   # ← Autorisierungsprüfung
    ).first()
    if not order:
        raise HTTPException(status_code=404)
    return order
```

**Schwache JWT-Validierung:**
```python
# Anfällig — akzeptiert jeden Algorithmus (Algorithmus-Verwechslungsangriff)
payload = jwt.decode(token, key, algorithms=["none"])

# Behoben
payload = jwt.decode(token, key, algorithms=["HS256"])  # explizite Zulassungsliste
```

**Zu permissives CORS:**
```python
# Anfällig
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)

# Behoben — Anmeldedaten erfordern explizite Herkunft
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.yourdomain.com"],
    allow_credentials=True,
)
```

## Beispiel

**Umfang:** `src/auth/` in einer FastAPI-Anwendung

**Erwartete Befunde:**
```
🔴 KRITISCH — Kein Rate-Limiting auf /auth/login
Location: src/auth/routes.py:24
Issue: Der Login-Endpunkt akzeptiert unbegrenzte Anfragen ohne Drosselung.
Risk: Brute-Force- oder Credential-Stuffing-Angriffe können gültige Konten aufzählen.
Fix: slowapi Rate-Limiter hinzufügen: @limiter.limit("5/minute") auf der Login-Route.

🟠 HOCH — Passwort-Reset-Token nach Verwendung nicht ungültig gemacht
Location: src/auth/password_reset.py:67
Issue: reset_password() aktualisiert das Passwort, löscht aber den Reset-Token nicht.
Risk: Wenn ein Token abgefangen wird, kann er erneut verwendet werden, um das Passwort zurückzusetzen.
Fix: Token sofort nach der Passwortaktualisierung löschen oder als verwendet markieren.

🟡 MITTEL — JWT-Algorithmus nicht explizit angegeben
Location: src/auth/jwt.py:12
Issue: jwt.decode() verwendet automatische Algorithmuserkennung.
Risk: Algorithmus-Verwechslungsangriff, wenn der Server den Algorithmus 'none' akzeptiert.
Fix: algorithms=["HS256"] explizit an jwt.decode() übergeben.

ℹ️ INFO — Fehlgeschlagene Login-Versuche nicht protokolliert
Location: src/auth/routes.py:38
Issue: Authentifizierungsfehler werden stillschweigend ignoriert.
Fix: Fehlgeschlagene Versuche mit Zeitstempel, IP und Benutzername zur Überwachung protokollieren.
```

---

> **Arbeiten Sie mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
