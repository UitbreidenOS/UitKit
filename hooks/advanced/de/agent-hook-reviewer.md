# Hook: Agent Reviewer — Spawnen eines Code-Review-Subagenten beim Sitzungsende

Demonstriert den `"type": "agent"`-Hook, der einen vollständigen Subagenten spawnt, wenn ein Ereignis ausgelöst wird. Der Subagent läuft asynchron mit eigenem Zugriff auf Werkzeuge ab, liest die Änderungen der Sitzung und erstellt eine strukturierte Bewertung – ohne die Hauptsitzung zu blockieren oder eine manuelle Aufrufen zu erfordern.

## Was macht es

Wenn die Hauptsitzung von Claude Code endet (Ereignis `Stop`), spawnt der Harness einen Subagenten, der durch den `agent`-Block des Hooks konfiguriert wird. Der Subagent:

1. Empfängt die `stop_reason`, `session_id` und `project_dir` der Sitzung in seinem Systemkontext.
2. Liest den Git-Diff der während der Sitzung vorgenommenen Änderungen (`git diff HEAD~1` oder `git diff --staged`).
3. Wertet den Diff auf Korrektheitsbugs, Sicherheitsprobleme und Stilmängel aus.
4. Schreibt eine strukturierte Bewertung nach `.claude/reviews/<session_id>-review.md`.
5. Falls es Fehler mit Severität `error` findet, hängt es auch eine Zusammenfassung an `.claude/reviews/open-issues.log` an, damit der Entwickler diese in der nächsten Sitzung adressiert.

Der gespawnte Agent hat einen begrenzten Werkzeugsatz – nur `Bash` (Read-Only-Git-Befehle), `Read` und `Write` zum Verzeichnis `.claude/reviews/`. Er hat keine Berechtigung, Projektdateien zu bearbeiten, Commits zu erstellen oder externe APIs aufzurufen.

Beispiel-Review-Ausgabe bei `.claude/reviews/abc123-review.md`:

```markdown
# Code Review — Sitzung abc123 (2026-06-03T11:00:00Z)

## Zusammenfassung
3 Dateien geändert, 120 Einfügungen, 14 Löschungen

## Erkenntnisse

### ERROR — src/auth/token.py:47
Hartcodiertes Fallback-Secret `"dev-secret-do-not-use"` erreichbar in der Produktion, falls
die Umgebungsvariable `SECRET_KEY` nicht gesetzt ist. Muss durch einen Hard Failure ersetzt werden.

### WARNING — src/api/users.py:112
N+1 Query in `list_users()` — `get_user_permissions()` wird in einer Schleife aufgerufen.
Erwägen Sie einen Bulk Fetch vor der Schleife.

### INFO — tests/test_auth.py
Gut: neue Token-Ablauf-Tests decken sowohl den Happy Path als auch die abgelaufen-Token-Verzweigung ab.
```

## Wann wird es ausgelöst

`Stop` – wird ausgelöst, wenn die Hauptsitzung endet, entweder weil der Benutzer `/exit` eingab, die Aufgabe abgeschlossen wurde oder die Sitzung ein Timeout hatte. Der Subagent läuft nach dem Beenden der Sitzung; er verzögert nicht die Möglichkeit des Benutzers, das Terminal zu schließen.

Andere nützliche Kombinationen für den Hook-Typ `agent`:

| Ereignis | Zweck des Subagenten |
|---|---|
| `Stop` | Post-Sitzungs-Code-Review, Kostenübersicht, Changelog-Eintrag |
| `SubagentStop` | Validieren Sie die Subagent-Ausgabe, bevor sie an den Hauptagenten weitergeleitet wird |
| `PostToolUse` (Write) | Einen Dokumentations-Update-Agenten auslösen, wenn Quelldateien geändert werden |

## settings.json-Eintrag

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "agent",
            "agent": {
              "prompt": "You are a code reviewer. A Claude Code session has just ended. Your job is to review the changes made during this session and write a structured report.\n\nSteps:\n1. Run `git diff HEAD~1 --stat` to see which files changed.\n2. Run `git diff HEAD~1` to read the full diff.\n3. Analyse the diff for: correctness bugs, security issues (hardcoded secrets, injection vectors, missing auth checks), performance problems (N+1 queries, unbounded loops), and missing test coverage.\n4. Write your findings to `.claude/reviews/${CLAUDE_SESSION_ID}-review.md` using this format:\n   - A Summary section (files changed, lines added/removed)\n   - A Findings section with severity labels: ERROR / WARNING / INFO\n   - Each finding: severity, file:line, one-sentence description, one-sentence recommendation\n5. If any ERROR-severity findings exist, append a one-line summary to `.claude/reviews/open-issues.log`.\n6. If there are no changes (clean working tree), write a one-line note and exit.\n\nBe concise. Findings should be actionable. Do not restate the diff — diagnose and recommend.",
              "model": "claude-sonnet-4-5",
              "tools": ["Bash", "Read", "Write"],
              "tool_permissions": {
                "Bash": {
                  "allow": ["git diff*", "git log*", "git show*", "git status*"],
                  "deny": ["git commit*", "git push*", "git reset*", "rm *", "curl *"]
                },
                "Write": {
                  "allow": [".claude/reviews/*"]
                }
              },
              "max_turns": 10,
              "timeout": 120
            }
          }
        ]
      }
    ]
  }
}
```

## Die Werkzeuge und Ausgabe des gespawnten Agenten

**Werkzeuge verfügbar für den Subagenten:**

| Werkzeug | Umfang |
|---|---|
| `Bash` | Nur Read-Only-Git-Befehle (`git diff`, `git log`, `git show`, `git status`). Schreibbefehle werden durch die `tool_permissions`-Deny-Liste blockiert. |
| `Read` | Unbegrenzt – kann alle Dateien im Projekt lesen, um den Kontext um einen Diff-Hunk zu verstehen. |
| `Write` | Beschränkt auf `.claude/reviews/` – kann Projektdateien nicht ändern. |

**Ausgabeartefakte:**

- `.claude/reviews/<session_id>-review.md` – die vollständige strukturierte Bewertung für diese Sitzung.
- `.claude/reviews/open-issues.log` – Append-Only-Log der ERROR-Severität-Erkenntnisse über Sitzungen hinweg. Überprüfen Sie diese Datei am Anfang einer neuen Sitzung, um ungelöste Probleme aufzugreifen.

**Subagent-Lebenszyklus:**

Der Subagent wird asynchron nach `Stop` gespawnt. Er läuft in einem separaten Prozess; das Terminal ist sofort frei. Der Harness schreibt den Exit-Status des Subagenten nach `.claude/reviews/<session_id>-agent.log`. Falls der Subagent das `timeout` (120 Sekunden) überschreitet, tötet der Harness ihn und schreibt eine teilweise Bewertung mit einer Timeout-Benachrichtigung.

## Hinweise

- Setzen Sie `"model": "claude-sonnet-4-5"` für die Reviewer. Haiku erzeugt oberflächliche Erkenntnisse bei komplexen Diffs; Opus ist für strukturiertes Pattern Matching nicht notwendig. Sonnet trifft das richtige Gleichgewicht zwischen Qualität und Kosten.
- `max_turns: 10` ist für die meisten Diffs ausreichend. Falls Ihre Sitzungen routinemäßig mehr als 20 Dateien ändern, erhöhen Sie auf 20 und erhöhen Sie `timeout` entsprechend.
- Fügen Sie `.claude/reviews/` zu `.gitignore` hinzu, außer wenn Sie Bewertungen zusammen mit Code committen möchten. Bewertungen enthalten Sitzungsmetadaten, die in der Versionierungshistorie nicht nützlich sind.
- Die Allow/Deny-Listen in `tool_permissions` verwenden Glob-Muster. Verschärfen oder lockern Sie sie nach Bedarf – zum Beispiel, fügen Sie `"git stash*"` zur Allow-Liste hinzu, falls Ihr Arbeitsablauf Stashes verwendet.
- Um Bewertungen in der nächsten Sitzung automatisch zu oberflächlich, fügen Sie einen `Start`-Lifecycle-Hook hinzu, der `open-issues.log` liest und die ungelösten Erkenntnisse Claudes initialem Kontext voranstellt.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
