---
description: Überprüfe Eingabevalidierung und -bereinigung über alle Vertrauensgrenzen hinweg
argument-hint: "[file, route, or module]"
---
Überprüfe Eingabevalidierung und -bereinigung in `$ARGUMENTS` (Standard: alle Request Handler und Dateneingabepunkte) auf Injection-Anfälligkeit, Typverwirrung und fehlende Grenzendurchsetzung.

**1. Alle Vertrauensgrenzen lokalisieren**

Finde jeden Ort, an dem externe Daten in die Anwendung gelangen:
- HTTP-Request Handler (Body, Query-Parameter, Path-Parameter, Header, Cookies)
- Datei-Uploads und Multipart-Formulardaten
- WebSocket-Message Handler
- Hintergrund-Job-Payloads (Warteschlangen, Cron-Eingaben)
- Externe API-Antworten, die als vertrauenswürdig behandelt werden
- Umgebungsvariablen, die in Code-Logik verwendet werden

**2. SQL-Injection**

- Finde alle Datenbankabfragen. Sind sie parametrisiert/vorbereitet oder String-verkettend?
- Überprüfe ORM-Nutzung — gibt es Raw-Query-Escape-Luken (`.raw()`, `query()`, `execute()`) mit nicht bereinigter Eingabe?
- Achte auf Second-Order-Injection: Benutzereingabe in DB gespeichert und später in Raw-Query verwendet.

**3. Command-Injection**

- Finde alle Verwendungen von `exec`, `spawn`, `system`, `popen`, `subprocess`, `child_process`, `os.system` und Entsprechungen.
- Wird nutzersupplierte Eingabe in Shell-Befehle interpoliert? Auch mit Escaping: bevorzuge Argument-Arrays über Shell-Strings.

**4. Template-Injection (SSTI)**

- Identifiziere Server-seitige Template-Engines in Verwendung (Jinja2, Twig, Handlebars, Pebble, Velocity).
- Werden nutzergesteuerte Daten in Template-Ausdrücken (`{{ }}`, `<%= %>`) gerendert?

**5. Path Traversal**

- Finde alle Datei-Lese-/Schreib-Operationen mit nutzersupplied Dateinamen oder Pfaden.
- Wird der aufgelöste Pfad gegen ein erlaubtes Basis-Verzeichnis validiert (z.B. `os.path.abspath` + Präfix-Prüfung)?

**6. Typ- und Schema-Validierung**

- Wird jedes eingehende Objekt gegen ein striktes Schema vor Verwendung validiert?
- Werden numerische Eingaben Grenzen-geprüft? Werden Enums gegen eine Allowlist validiert?
- Gibt es Prototype-Pollution-Risiko (Node.js `Object.assign`, `merge` mit nicht vertrauenswürdiger Eingabe)?

**7. Ausgabe**

Für jede Findings:
```
[SEVERITY] [file:line] — vulnerability type
Input source: where the untrusted data originates
Sink: where it's used unsafely
PoC: minimal payload or request that demonstrates the issue
Fix: specific remediation (parameterize, allowlist, validate schema, etc.)
```

Versuche nicht, Findings auszunutzen — beschreibe nur den Angriffsvektor und die Behebung.
