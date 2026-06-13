---
description: Eingabevalidierung und Sanitization über alle Vertrauensgrenzen hinweg prüfen
argument-hint: "[Datei, Route oder Modul]"
---
Prüfen Sie die Eingabevalidierung und Sanitization in `$ARGUMENTS` (Standard: alle Request-Handler und Dateneingabepunkte) auf Injektionsschwachstellen, Typverwechslung und fehlende Grenzendurchsetzung.

**1. Alle Vertrauensgrenzen lokalisieren**

Finden Sie jeden Ort, an dem externe Daten in die Anwendung eindringen:
- HTTP-Request-Handler (Body, Query-Parameter, Pfad-Parameter, Header, Cookies)
- Datei-Uploads und Multipart-Form-Daten
- WebSocket-Message-Handler
- Background-Job-Payloads (Queues, Cron-Eingaben)
- Externe API-Antworten, die als vertrauenswürdig behandelt werden
- Umgebungsvariablen, die in Code-Logik verwendet werden

**2. SQL-Injection**

- Finden Sie alle Datenbankabfragen. Verwenden Sie parametrisierte/vorbereitete Statements oder String-Verkettung?
- Überprüfen Sie ORM-Nutzung — gibt es Raw-Query-Escape-Hatches (`.raw()`, `query()`, `execute()`) mit unsanitized-Input?
- Achten Sie auf Second-Order-Injection: Benutzereingabe in DB gespeichert, später in einer Raw-Query verwendet.

**3. Command-Injection**

- Finden Sie alle Verwendungen von `exec`, `spawn`, `system`, `popen`, `subprocess`, `child_process`, `os.system` und Äquivalenten.
- Wird benutzerbereitgestellter Input in Shell-Befehle interpoliert? Auch mit Escaping ist ein Argument-Array gegenüber Shell-Strings vorzuziehen.

**4. Template-Injection (SSTI)**

- Identifizieren Sie die verwendeten Server-Side-Template-Engines (Jinja2, Twig, Handlebars, Pebble, Velocity).
- Werden benutzerkontrollierte Daten in Template-Ausdrücken gerendert (`{{ }}`, `<%= %>`)?

**5. Pfad-Traversal**

- Finden Sie alle Datei-Lese-/Schreib-Operationen mit benutzerbereitgestellten Dateinamen oder Pfaden.
- Wird der aufgelöste Pfad gegen ein erlaubtes Basis-Verzeichnis validiert (z. B. `os.path.abspath` + Präfix-Check)?

**6. Typ- und Schema-Validierung**

- Wird jedes eingehende Objekt vor der Verwendung gegen ein striktes Schema validiert?
- Sind numerische Eingaben auf Grenzen überprüft? Werden Enums gegen eine Allowlist validiert?
- Besteht Prototype-Pollution-Risiko (Node.js `Object.assign`, `merge` mit nicht vertrauenswürdigem Input)?

**7. Ausgabe**

Für jeden Fund:
```
[SEVERITY] [Datei:Zeile] — Schwachstellentyp
Input-Quelle: Herkunft der nicht vertrauenswürdigen Daten
Sink: Ort, wo sie unsicher verwendet wird
PoC: minimale Payload oder Request, die das Problem demonstriert
Fix: spezifische Behebung (parametrisieren, Allowlist, Schema validieren, etc.)
```

Versuchen Sie nicht, Schwachstellen auszunutzen — beschreiben Sie nur den Angriffsvektor und die Behebung.
