# Claude Code CLI Referenz

Vollständige Referenz für alle Claude Code CLI-Flags, Startbefehle, Session-Management, Slash-Befehle und Umgebungsvariablen.

---

## Starten von Claude Code

```bash
claude                          # interactive session
claude "do X"                   # non-interactive, single prompt
claude -p "do X"                # print mode (no interactive fallback)
claude -p "do X" --bare         # skip CLAUDE.md + MCP discovery (10x faster SDK startup)
claude --add-dir ../other-repo  # give Claude access to another directory
claude -r <session-id>          # resume a previous session
claude --resume <id> --fork-session  # fork at current point, keep original intact
```

`--bare` ist die wichtigste Flag für SDK-Anwendungsfälle. Es umgeht das Laden von CLAUDE.md, die Einstellungserkennung und die MCP-Verbindung — und reduziert die Startup-Latenz um eine Größenordnung, wenn Sie keinen Projektkontext benötigen.

---

## Session-Management-Befehle

```bash
claude agents                   # list all running sessions
claude agents --json            # machine-readable JSON array
claude agents --cwd .           # filter sessions by current directory
claude rm <session-id>          # remove session from agent view
claude respawn <session-id>     # restart session with history intact
claude respawn --all            # restart all running sessions
claude daemon status            # show supervisor process state
```

Session-IDs sind UUIDs, die in der Agentenliste angezeigt werden. Übergeben Sie sie an `--resume` oder `--fork-session`, um die Arbeit fortzusetzen oder zu verzweigen.

---

## Projektbefehle

```bash
claude project purge            # delete all local state for this project
claude plugin details <name>    # show plugin component inventory + token cost
```

`project purge` löscht gecachte Session-Daten, Plugins-Zustand und lokale Einstellungen, die unter `.claude/` gespeichert sind. Es berührt nicht `.claude/settings.json` oder begangene Dateien.

---

## Wichtige Slash-Befehle (in Session)

| Befehl | Beschreibung | Hinzugefügt |
|---|---|---|
| `/goal` | Legen Sie das aktuelle Session-Ziel fest oder sehen Sie es an — heftet Absicht oben an Kontext | 2024 |
| `/btw` | Fügen Sie dem Kontext eine Hintergrundbemerkung hinzu, ohne eine Antwort auszulösen | 2024 |
| `/voice` | Aktivieren Sie den Voice-Diktatmodus | 2025 |
| `/compact` | Manuell Kontextverdichtung triggern | 2024 |
| `/rewind` | Gehen Sie zurück zu einem früheren Zug in der aktuellen Sitzung | 2025 |
| `/branch` | Erstellen Sie eine neue Session-Gabel aus dem aktuellen Zustand | 2025 |
| `/diff` | Zeigen Sie ein einheitliches Diff aller Änderungen in der Session | 2024 |
| `/code-review` | Starten Sie die integrierte Code-Review-Fertigkeit | 2024 |
| `/focus` | Richten Sie Claudes Aufmerksamkeit auf eine bestimmte Datei oder ein Verzeichnis | 2025 |
| `/batch` | Führen Sie eine Liste von Aufgaben parallel über Subagenten aus | 2025 |
| `/teleport` | Springen Sie in ein anderes Verzeichnis, ohne die Session zu beenden | 2025 |
| `/remote-control` | Ermögliche externe Steuerung der Session via API | 2025 |
| `/loop` | Führen Sie eine Eingabeaufforderung oder einen Befehl nach einem wiederkehrenden Intervall aus | 2025 |
| `/powerup` | Modellstufe für eine einzelne Antwort vorübergehend erhöhen | 2025 |
| `/fast` | Aktuelle Session zu Haiku für Geschwindigkeit wechseln | 2025 |
| `/effort` | Legen Sie das Aufwandsniveau für die Session fest (`low` / `medium` / `high` / `xhigh`) | 2025 |
| `/cost` | Token-Nutzung und geschätzte Kosten für die Session anzeigen | 2024 |
| `/extra-usage` | Aufschlüsselung der Token-Verbrauch durch Tool-Aufrufe anzeigen | 2025 |
| `/scroll-speed` | Passen Sie die Ausgabe-Streaming-Geschwindigkeit im Terminal an | 2025 |
| `/recap` | Erstellen Sie eine strukturierte Zusammenfassung der bisherigen Session | 2025 |
| `/team-onboarding` | Generieren Sie einen Einarbeitungsleitfaden für ein neues Teamkollege aus dem Projektkontext | 2025 |

---

## Umgebungsvariablen

| Variable | Zweck |
|---|---|
| `ANTHROPIC_API_KEY` | API-Schlüssel — erforderlich für alle nicht-interaktiven Anwendungen |
| `ANTHROPIC_BASE_URL` | API-Endpunkt überschreiben (benutzerdefinierte Proxys, interne Gateways) |
| `CLAUDE_CODE_TASK_LIST_ID` | Freigegebene Task-List-ID — ermöglicht Task-Koordination zwischen Sessions |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | Setzen auf `1`, um die Agent-Teams-Funktionalität zu aktivieren |
| `ENABLE_PROMPT_CACHING_1H` | Setzen auf `1`, um die 1-Stunden-Cache-TTL-Ebene zu verwenden |
| `ENABLE_TOOL_SEARCH` | Schwellenwert, bei dem das verzögerte Tool-Laden aktiviert wird |
| `CLAUDE_EFFORT` | Standard-Aufwandsniveau für neue Sessions (`low` / `medium` / `high` / `xhigh`) |
| `CLAUDE_AGENT_NAME` | Identitätsstrang für diesen Agenten — verwendet in Hook-Umgebungsvariablen |
| `OUTPUT_SIZE_WARN_THRESHOLD` | Byte-Schwellenwert, der Hook-Ausgabegrößenwarnungen auslöst |

Variablen, die in der Shell gesetzt werden, überschreiben Projekteinstellungen. Variablen, die in `.env` am Projektstamm gesetzt sind, werden automatisch geladen.

---

## `additionalDirectories` Einstellung

Dauerhafte Alternative zu `--add-dir`. Konfiguriert in `.claude/settings.json` oder `~/.claude/settings.json`:

```json
{
  "additionalDirectories": ["../shared-lib", "../design-system"]
}
```

Pfade werden relativ zum Projektstamm aufgelöst. Verwenden Sie dies, wenn mehrere Repos an einem einzelnen Produkt zusammenarbeiten und Claude in jeder Session lesenden Zugriff auf mehrere Repos benötigt, ohne das Flag zu wiederholen.

---

## Flag-Referenz Zusammenfassung

| Flag | Kurz | Beschreibung |
|---|---|---|
| `--print` | `-p` | Nicht-interaktiver Druckmodus |
| `--bare` | | Überspringen Sie CLAUDE.md, Einstellungen und MCP-Erkennung |
| `--add-dir <path>` | | Fügen Sie Claudes Arbeitssatz ein Verzeichnis hinzu |
| `--resume <id>` | `-r` | Setzen Sie eine vorherige Session nach ID fort |
| `--fork-session` | | Gabel statt Fortsetzen bei Verwendung mit `--resume` |
| `--json` | | Sesion-Liste als JSON ausgeben (mit `agents` verwendet) |
| `--cwd <path>` | | Agenten nach Arbeitsverzeichnis filtern |
| `--all` | | Befehl auf alle Sessions anwenden (mit `respawn` verwendet) |

---
