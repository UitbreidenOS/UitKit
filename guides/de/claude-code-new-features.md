# Claude Code Leitfaden für neue Funktionen (2026)

Der definitive Leitfaden zu Claudes neuesten Fähigkeiten — basierend auf dem offiziellen Changelog und der What's New-Dokumentation. Behandelt Agent View, /goal, /ultrareview, Auto Mode, Opus 4.7, Computer Use, Ultraplan und den neu gestalteten Desktop.

---

## Schnellreferenz — Alle neuen Befehle

| Befehl | Was es tut | Seit |
|---|---|---|
| `claude agents` | Dashboard für alle parallelen Sitzungen | v2.1.139 |
| `/goal [condition]` | Claude arbeitet autonom bis Bedingung erfüllt ist | v2.1.139 |
| `/ultrareview` | Flotte von Cloud-Agenten überprüft Ihren Code | v2.1.111 |
| `claude ultrareview [target]` | Nicht-interaktive Cloud-Überprüfung für CI | v2.1.120 |
| `/effort` | Interaktiver Schieberegler zum Einstellen der Intelligenzstufe | v2.1.111 |
| `/loop [interval]` | Führen Sie einen Befehl nach einem wiederkehrenden Plan aus | v2.1.95 |
| `/goal` | Autonome Aufgabenvollendung | v2.1.139 |
| `/autofix-pr` | Auto-Fix-PRs von Ihrem Terminal | v2.1.100 |
| `/team-onboarding` | Verpacken Sie Ihre Einrichtung als wiederholbaren Leitfaden | v2.1.100 |
| `claude project purge` | Löschen Sie den gesamten lokalen Zustand für ein Projekt | v2.1.126 |
| `--plugin-url <url>` | Laden Sie das Plugin von einer URL für die aktuelle Sitzung | v2.1.129 |
| `--plugin-dir <path.zip>` | Plugin aus einem .zip-Archiv laden | v2.1.128 |

---

## Agent View — Alle Sitzungen in einem Dashboard

`claude agents` (am 11. Mai 2026 gestartet — Research Preview) gibt Ihnen einen Bildschirm für jede Claude Code-Sitzung: was läuft, was blockiert auf Ihre Eingabe wartet, was erledigt ist.

```bash
# Agent View öffnen
claude agents

# Agent View mit spezifischen Einstellungen
claude agents --model claude-opus-4-7 --effort xhigh

# Sitzungen als JSON auflisten (zum Scripting, Statusleisten, tmux)
claude agents --json

# Auf ein bestimmtes Verzeichnis beschränken
claude agents --cwd /path/to/project
```

**Was Sie sehen:**
- Jede laufende Sitzung mit ihrer aktuellen Aufgabe und Ihrem Status
- Sitzungen, die auf Ihre Eingabe warten (hervorgehoben)
- Abgeschlossene Sitzungen mit ihrer Laufzeit
- Echtzeitkosten pro Sitzung

**Antwort ohne Kontextverlust:**
Sie können auf jede wartende Sitzung direkt von Agent View aus antworten, ohne Terminalfenster zu wechseln.

**Registerkartentext zeigt Warteanzahl:**
Der Terminalregistertitel wird aktualisiert, um anzuzeigen, wie viele Sitzungen auf Ihre Eingabe warten — auf einen Blick sichtbar ohne Agent View zu öffnen.

**Best Practice — parallele Worktree-Sitzungen:**
```bash
# Erstellen Sie isolierte Worktrees für jede Aufgabe
git worktree add ../myapp-auth feature/auth
git worktree add ../myapp-payments fix/payment-timeout
git worktree add ../myapp-docs docs/api-reference

# Starten Sie Claude in jedem (Hintergrundmodus)
cd ../myapp-auth     && claude --bg "implement OAuth with Better Auth"
cd ../myapp-payments && claude --bg "fix the Stripe webhook signature verification"
cd ../myapp-docs     && claude --bg "write API documentation for all routes"

# Überwachen Sie alle drei von einem Bildschirm
claude agents
```

---

## /goal — Autonome Aufgabenvollendung

Legen Sie eine messbare Erfüllungsbedingung fest. Claude iteriert — schreibt Code, führt Tests aus, behebt Fehler — bis die Bedingung erfüllt ist.

```bash
# Im interaktiven Modus
/goal all tests pass for the auth module

# Mit einer spezifischen messbaren Bedingung
/goal the /api/users endpoint returns 201 with valid input and 422 with invalid email

# Mit einem Zeitbudget
/goal migrate the database schema and verify all existing tests still pass

# Läuft auch im nicht-interaktiven Modus (-p-Flag)
claude -p "..." --goal "all TypeScript errors resolved"
```

**Wie /goal funktioniert:**
1. Claude versteht den aktuellen Zustand
2. Schreibt oder behebt Code in Richtung des Ziels
3. Führt Tests oder Überprüfungsbefehle aus
4. Liest die Ergebnisse, behebt Fehler
5. Wiederholt, bis die Zielbeingung erfüllt ist oder eine Sackgasse erreicht ist
6. Hält an und meldet das Ergebnis

**Gute Ziele (spezifisch, testbar):**
```
/goal npm test passes with zero failures
/goal the Lighthouse score for the homepage is above 90
/goal the Docker container builds and all health checks pass
/goal all TypeScript errors in src/ are resolved
/goal the migration runs cleanly on the staging database
```

**Vermeiden Sie vage Ziele:**
```
/goal make the app better           ← not testable
/goal fix all the bugs              ← too open-ended
/goal improve code quality          ← no clear signal
```

**Hinweis:** Der /goal-Evaluator wartet, bis alle laufenden Shells und Subagenten beendet sind, bevor er die Bedingung prüft.

---

## /ultrareview — Cloud Fleet-Codeüberprüfung

Eine Flotte spezialisierter Agenten wird in der Cloud ausgeführt, um Ihren Code zu überprüfen. Ergebnisse landen direkt in Ihrer CLI oder Ihrem Desktop.

```bash
# Überprüfen Sie den aktuellen Branch (interaktiv)
/ultrareview

# Überprüfen Sie einen spezifischen PR
/ultrareview PR#123

# Nicht-interaktiv (für CI/CD-Scripts)
claude ultrareview                    # review current branch
claude ultrareview --pr 123          # review specific PR
claude ultrareview --focus security  # focus on security only
```

**Was die Flotte prüft:**
- Sicherheitslücken (Injection, Auth-Bypass, exponierte Geheimnisse)
- Logische Fehler und Edge Cases in Tests verpasst
- Leistungsengpässe (N+1 Abfragen, Speicherlecks)
- Brechende API-Änderungen
- Testabdeckungslücken

**vs. /code-review (lokal):**
- `/code-review` — einzelner Agent, aktueller Sitzungskontext, schneller
- `/ultrareview` — mehrere spezialisierte Agenten parallel, breitere Abdeckung, beste vor Merge

---

## Auto Mode — Intelligente Berechtigungsverwaltung

Auto Mode klassifiziert Ihre Berechtigungsaufforderungen automatisch:
- **Sichere Operationen** (nur Lesen, Sandbox) → ohne Unterbrechung ausführen
- **Riskante Operationen** (destruktiv, Netzwerk, Credentials-Zugriff) → blockiert oder eskaliert

```bash
# Auto Mode aktivieren
claude --auto-mode

# Auto Mode ist jetzt ohne Flag für Max-Abonnenten verfügbar
# Auf Opus 4.7 mit Max-Abonnement: standardmäßig aktiviert

# Hard-Deny-Regeln (bedingungslos blockiert unabhängig von Ausnahmen zulassen)
# In .claude/settings.json:
{
  "autoMode": {
    "hard_deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)"
    ]
  }
}
```

**Auto Mode Spinner wird rot** wenn eine Berechtigungsprüfung stecken bleibt — visuelles Signal, dass etwas Ihre Aufmerksamkeit braucht.

---

## Claude Opus 4.7 + Aufwandsstufen

Opus 4.7 ist jetzt das Standardmodell für Max und Team Premium. Es führt die `xhigh`-Aufwandsstufe ein — die empfohlene Einstellung für komplexe Codierungsaufgaben.

```bash
# Aufwandsstufe interaktiv festlegen
/effort

# Verwenden Sie den Aufwandsschieberegler (Pfeiltasten, Enter zum Bestätigen)
# Stufen: low → medium → high → xhigh

# Über Kommandozeile setzen
claude --effort xhigh "debug this race condition"
claude --effort low   "rename this variable"

# Aufwandsstufe in Hooks über $CLAUDE_EFFORT prüfen
# Oder effort.level in Hook-JSON-Eingabe

# Schneller Modus verwendet jetzt standardmäßig Opus 4.7
# Zurück zu 4.6: CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1
```

**Wann Sie jede Aufwandsstufe verwenden:**

| Stufe | Verwenden für | Token-Ausgaben |
|---|---|---|
| `low` | Variable Umbenennung, Formatierung, einfache Vervollständigungen | Minimal |
| `medium` | Standard-Feature-Arbeit, Debugging häufiger Fehler | Moderat |
| `high` | Refactorings, Architektur-Reviews, Test-Schreiben | Höher |
| `xhigh` | Sicherheitsaudits, Racebedingungen, komplexe Multi-Datei-Änderungen | Höchst |

**Früheren Kontext komprimieren:**
Das Rewind-Menü enthält jetzt "Summarize up to here" — komprimiert frühere Umdrehungen und behält dabei den neuesten Kontext. Reduziert Kosten ohne Schlüsselbeschaffungen zu verlieren.

---

## Computer Use — CLI-Kontrolle von GUI-Apps

Claude kann native Apps öffnen, in der Benutzeroberfläche klicken und Änderungen überprüfen, die nur eine GUI bestätigen kann.

```bash
# Computer Use aktivieren (Forschungsvorschau)
claude --computer-use

# Claude kann jetzt:
# - Native Apps auf Ihrem Desktop öffnen
# - Auf Schaltflächen klicken und Formulare ausfüllen
# - Screenshots machen und UI-Status überprüfen
# - End-to-End-Flows ausführen, die einen echten Browser oder eine App benötigen
```

**Beste Anwendungsfälle:**
- Überprüfen, dass eine UI-Änderung korrekt aussieht
- Automatisierung von Flows, die keine CLI haben (Legacy-Apps, komplexe Web-UIs)
- Schließen Sie die Schleife nach Code-Änderungen: "funktioniert das wirklich im Browser?"

**Auch in der Desktop-App verfügbar** — Computer Use funktioniert sowohl in CLI als auch in der neu gestalteten Desktop-Umgebung.

---

## Ultraplan — Cloud-Planung + Remote-Ausführung

Entwerfen Sie einen Plan in der Cloud, überprüfen und kommentieren Sie in einem Web-Editor, dann führen Sie ihn remote aus oder ziehen Sie ihn lokal zurück.

```bash
# Ultraplan starten (frühe Vorschau)
/ultraplan

# Claude erstellt einen strukturierten Plan
# → Sie erhalten eine URL zum Überprüfen und Kommentieren in einem Web-Editor
# → Kommentare zu Schritten, Teile genehmigen/ablehnen
# → Remote in einer Cloud-Umgebung ausführen
# → Oder lokal zurückziehen und dort ausführen

# Die erste Ausführung erstellt automatisch eine Cloud-Umgebung für Sie
```

**Ideal für:**
- Lange mehrtägige Aufgaben, die von einem strukturierten geschriebenen Plan vor der Ausführung profitieren
- Einen Plan mit Teamkollegen zur Überprüfung vor der Ausführung teilen
- Aufgaben, die in einer sauberen Cloud-Umgebung ausgeführt werden müssen (nicht Ihre lokale Maschine)

---

## Routinen — Geplante Cloud-Agenten

Auf Claude Code Web führen Routinen vorlagenfähige Cloud-Agenten nach einem Plan, einem GitHub-Ereignis oder einem API-Aufruf aus.

```
Beispiel-Routinen:
- "Every Monday: review open PRs and summarize what needs attention"
- "On push to main: run /ultrareview on the diff"
- "Daily at 9am: check for dependency security advisories"
- "On GitHub issue opened: triage and label it"
```

Konfigurieren Sie in der Claude Code Web-Schnittstelle → Routinen.

---

## Monitor Tool — Live-Log-Streaming

Das Monitor-Tool streamt Hintergrundevenemte in die Konversation — Claude kann Logs verfolgenn und in Echtzeit reagieren.

```bash
# Claude kann das Monitor-Tool automatisch bei der Überwachung von Prozessen verwenden
# Oder Sie können es explizit aufrufen:
/monitor <process or log source>

# Beispiel: Claude überwacht eine Bereitstellung und reagiert auf Fehler
"Deploy this to staging and monitor the logs — fix any errors that appear"
```

---

## Neu gestaltete Desktop-Erfahrung

Der Claude Code Desktop (Web) erhielt eine größere Umgestaltung mit:

**Paralleles Layout:**
- Mehrere Agenten gleichzeitig von einem Fenster aus sichtbar
- Side Chats ohne den Hauptthread zu verlieren
- Drag-and-Drop-Paneelvereinbarung
- Sitzungen-Seitenleiste zum Navigieren zwischen Projekten

**Integrierte Tools:**
- HTML- und PDF-Vorschauer (generierte Ausgabe inline anzeigen)
- In-App-Datei-Editor (Dateien bearbeiten ohne zur IDE zu wechseln)
- Umgestalteter Diff-Viewer (Änderungen überprüfen ohne ein anderes Tool)
- Benutzerdefinierte Themen (von `/theme` erstellen oder über Plugin)

**Auto-Archiv:**
Sitzungen werden automatisch archiviert, wenn ihr zugehöriger PR zusammengeführt wird — hält Ihren Arbeitsbereich sauber.

**Sitzungs-Zusammenfassung:**
Wenn Sie zu einer Sitzung zurückkehren, die im Hintergrund läuft, bietet Claude eine Zusammenfassung dessen, was während Ihrer Abwesenheit geschah.

---

## Plugins: .zip- und URL-Laden

```bash
# Ein Plugin aus einer .zip-Datei laden (für die aktuelle Sitzung)
claude --plugin-dir ./my-plugin.zip

# Von einer URL laden
claude --plugin-url https://example.com/my-plugin.zip

# Durchsuchen und im Marketplace installieren
/plugin

# Plugin-Details anzeigen (Komponenten, Token-Kosten)
claude plugin details <name>

# Plugin-Komponenten vor Installation auflisten
# /plugin zeigt jetzt Fertigkeiten, Hooks, Agenten, MCP-Server im Browserfenster
```

---

## Windows: Kein Git Bash erforderlich

Claude Code funktioniert jetzt nativ unter Windows mit PowerShell — Git für Windows ist keine Voraussetzung mehr.

```powershell
# Installieren Sie Claude Code unter Windows (kein Git Bash erforderlich)
winget install Anthropic.ClaudeCode

# Oder über npm
npm install -g @anthropic-ai/claude-code

# PowerShell ist jetzt die primäre Shell unter Windows
# Bash-Tool fällt automatisch auf PowerShell zurück
```

---

## Weitere bemerkenswerte Ergänzungen

**`/loop` Selbststeuerung:**
```bash
/loop 5m /check-deploy    # run every 5 minutes
/loop /monitor-tests      # self-pace (Claude decides interval)
```

**`/team-onboarding`:**
Verpacket Ihre Claude Code-Einrichtung (Hooks, Fertigkeiten, CLAUDE.md) in einen wiederholbaren Leitfaden für neue Teamkollegen.

**`/autofix-pr`:**
Aktiviert automatische PR-Fix-Vorschläge von Ihrem Terminal — Claude überwacht CI-Ergebnisse und schlägt Fixes vor.

**Voice Input Fixes:**
Voice Push-to-Talk funktioniert jetzt im Antwortsfeld der Agent View. Verbesserte Zuverlässigkeit auf macOS.

**Mobile Push-Benachrichtigungen:**
Wenn eine lange Aufgabe beendet ist oder Claude Ihre Eingabe benötigt, erhalten Sie eine Push-Benachrichtigung auf Ihrem Telefon (über Remote Control).
```bash
# Erfordert Claude Code Remote Control Setup
# Konfigurieren Sie in Desktop-Einstellungen → Benachrichtigungen → Mobil
```

---

## Zusätzliche CLI-Befehle

**`claude agents --json`** (v2.1.145+)
Maschinenlesbares Sitzungslisten — druckt alle Live-Sitzungen als JSON-Array aus und beendet:
```bash
claude agents --json | jq '.[] | select(.status == "running")'
```
Felder: `pid`, `cwd`, `kind`, `startedAt`, `sessionId`, `name`, `status`. Mit `--cwd` kombinieren, um nach Verzeichnis zu filtern.

**`claude respawn`**
Sitzung mit intaktem Gesprächsverlauf neu starten:
```bash
claude respawn <session-id>      # restart one session
claude respawn --all             # restart all running sessions
```

**`claude daemon status`**
Zeigen Sie den Supervisorprozessstatus und die Workeranzahl an. Nützlich zur Diagnose, warum Sitzungen nicht starten.

**`/scroll-speed`**
Tune der Scrollgeschwindigkeit mit der Maus in der CLI. `/scroll-speed 3` (Standard), `/scroll-speed 1` (langsam), `/scroll-speed 10` (schnell).

**`/code-review` (umbenannt von `/simplify`)**
Ab v2.1.146 wurde `/simplify` in `/code-review` umbenannt. Alter Name funktioniert immer noch als Alias. Akzeptiert jetzt eine optionale Aufwandsstufe:
```
/code-review
/code-review xhigh
```
Überprüft aktuelle Diffs auf Kompilierungsfehler, Logikfehler, Sicherheitslücken — nicht Stil oder Formatierung.

---
