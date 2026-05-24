# Context-Budget-Management

Wie man die Token-Nutzung in einer Claude Code-Sitzung nachverfolgt, plant und optimiert — für Senior Developer, die große Sitzungen, Agent-Pipelines und autonome Arbeitsschleifen betreiben.

---

## Warum Context-Budget wichtig ist

Claude Code-Sitzungen arbeiten innerhalb eines endlichen Kontextfensters. Während eine Sitzung wächst, sammelt sich jeder Tool-Aufruf, jede Datei-Leseoperation, jede Bash-Ausgabe und jede Assistant-Runde an. Wenn das Fenster sich füllt:

- Die Qualität von Claudes Antworten sinkt merklich vor der harten Grenze (empirisch, etwa 300–400k Tokens beim 1M-Modell)
- Sie werden gezwungen, `/compact` zu verwenden (verlustbehaftete Zusammenfassung) oder eine neue Sitzung zu starten
- Die Kosten skalieren mit der Kontextgröße — ein überladenes Fenster kostet pro Runde mehr

Der Fehlermodus ist nicht, die harte Grenze zu treffen — es ist, den größten Teil Ihres Budgets mit Rauschen zu verschwenden, bevor Ihre Aufgabe halb fertig ist. Lange Log-Ausgaben, die nicht gekürzt werden, ganze Dateien, die gelesen werden, wenn nur 30 Zeilen nötig waren, wiederholtes Neueinlesen derselben Datei, Kind-Agent-Aufrufe, die volles Parent-Kontext tragen: Das sind die Muster, die ein Budget zusammenbrechen lassen.

Dieser Leitfaden behandelt, was Budget verbraucht, wie man es misst und wie man die Kontrolle über den gesamten Lebenszyklus der Sitzung beibehält.

---

## Was Kontext verbraucht

| Quelle | Typische Kosten | Anmerkungen |
|---|---|---|
| System-Prompt / CLAUDE.md | 500–5 000 Tokens | Wird beim Start jeder Sitzung geladen |
| Jeder Tool-Aufruf + Ergebnis | 200–2 000 Tokens | Hängt völlig von der Ausgabe-Verbosität ab |
| Datei-Lesevorgänge | ~1 Token pro 4 Zeichen | Eine Datei mit 1 000 Zeilen ist ungefähr 10K Tokens |
| Bash-Ausgabe | Unbegrenzt | Lange Log-Ausgabe ist der häufigste Budget-Killer |
| MCP-Tool-Definitionen (10 Server) | ~25 000–35 000 Tokens | Wird beim Sitzungsstart geladen, vor der ersten Nachricht |
| Kind-Agent-Aufrufe | Voller Sub-Kontext | Jeder gespawnte Agent initialisiert sein eigenes Kontextfenster |
| Bilder / Screenshots | 1 500–3 000 Tokens | Pro Bild, unabhängig von der Inhaltskomplexität |
| Gesprächsverlauf | Wächst jede Runde | Benutzer- und Assistant-Runden sammeln sich beide an |

Die zwei Quellen, die die meisten Developer unterschätzen, sind **Bash-Ausgabe** und **MCP-Tool-Definitionen**. Ein einzelnes `npm install` mit ausführlicher Protokollierung kann 3–5K Tokens hinzufügen. Zehn aktivierte MCP-Server mit jeweils acht Tools sind ~30K Tokens Overhead, die vor der ersten Benutzer-Nachricht geladen werden.

---

## Der `/compact`-Befehl

`/compact` fasst den Gesprächsverlauf in eine komprimierte Darstellung zusammen und ersetzt ihn im Kontext. Dies ist verlustbehaftet — die Zusammenfassung behält Entscheidungen und Ergebnisse, wirft aber exakte Details weg.

**Was die Kompaktifizierung übersteht :**
- Entscheidungen auf hoher Ebene und Begründung
- Der aktuelle Dateizustand (was geschrieben wurde)
- Wichtige, explizit besprochene Fakten

**Was die Kompaktifizierung nicht übersteht :**
- Genaue Fehlermeldungen und Stack Traces
- Spezifische Code-Snippets, die gelesen, aber nicht geschrieben wurden
- Schrittweise Debugging-Ketten
- Dateiinhalte, die gelesen, aber nicht modifiziert wurden

**Wann kompaktifizieren :**
- Bei 50–60% Kontextnutzung, nicht bei 90%. Kompaktifizierung bei 50% erzeugt eine Zusammenfassung höherer Qualität, weil mehr Signal noch im Fenster relativ zu Rauschen ist.
- Nach Abschluss einer großen Unter-Aufgabe, bevor die nächste beginnt
- Vor einer Aufgabe, die das Lesen vieler großer Dateien erfordert
- Nach einer langen Debugging-Sitzung, bei der fehlgeschlagene Versuche den Kontext verschmutzen

**Gerichtete Kompaktifizierung** bewahrt den wichtigsten Thread:

```
/compact focus on the auth refactor — drop the test debugging context
```

Ohne einen Hinweis trifft der Zusammenfasser seine eigenen Entscheidungen darüber, was wichtig ist. Ein spezifischer Hinweis verankert die Zusammenfassung.

**Nicht auf den automatischen Schwellenwert warten.** Das Standard-Auto-Compact feuert bei ~95% Kapazität. Zu diesem Zeitpunkt hat sich die Qualität bereits erheblich verschlechtert und die Zusammenfassung hat weniger Signal, mit dem man arbeiten kann.

---

## Context-Budget-Strategien

### a. Nur lesen, was Sie brauchen

Verwenden Sie die Parameter `limit` und `offset` auf dem Read-Tool. Eine 2 000-Zeilen-Datei, die vollständig gelesen wird, beträgt ~20K Tokens. Wenn Sie die Zeilen 400–450 brauchen, sind das ~500 Tokens.

```
# Vollständige Datei: ~20K Tokens
Read /path/to/service.ts

# Gezieltes Lesen: ~500 Tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

Verwenden Sie Grep statt Dateien zu lesen, wenn Sie ein Muster suchen. Grep gibt passende Zeilen und einen kleinen Kontext zurück — nicht die ganze Datei. Für eine 5 000-Zeilen-Codebasis ist dies der Unterschied zwischen 50K Tokens und 500.

Lesen Sie nie vollständige Log-Dateien. Pipen Sie zu `head` und suchen Sie zuerst den relevanten Abschnitt.

### b. Bash-Ausgabe trimmen

Unkontrollierte Bash-Ausgabe ist die häufigste Quelle für unkontrollierte Kontextverbrauch. Wenden Sie dies systematisch an:

```bash
# Ausgabevolumen begrenzen
npm install 2>/dev/null | tail -5
docker logs mycontainer --tail 100
git log --oneline -20

# Fortschrittsrauschen unterdrücken
curl -s https://api.example.com/endpoint
rsync -a --quiet src/ dst/

# Stderr umleiten, wenn nicht relevant
make build 2>/dev/null

# Zusammenfassen vor Rückgabe
./run-tests.sh | grep -E "PASS|FAIL|ERROR" | tail -30
```

Für jeden Befehl, der Multi-Screen-Ausgabe erzeugt, fügen Sie `| head -N` oder `| tail -N` als Standard-Disziplin hinzu. Die genaue N ist weniger wichtig als die Gewohnheit.

### c. Nutzen Sie PostToolUse-Ausgabe-Kompression

Ab Claude Code v2.1.121+ kann ein `PostToolUse`-Hook die Ausgabe des Tools vor der Verarbeitung durch Claude ersetzen. Dies ermöglicht es Ihnen, verbose Tool-Ergebnisse automatisch zu komprimieren, zu redigieren oder zusammenzufassen — ohne den Tool-Aufruf selbst zu ändern.

**settings.json :**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/compress-output.sh"
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/compress-output.sh` :**
```bash
#!/usr/bin/env bash
# Liest Tool-Ausgabe aus stdin (JSON), komprimiert wenn über Schwellenwert, schreibt zu stdout.
# Claude erhält die Hook-Ausgabe als Tool-Ergebnis.

set -euo pipefail

input=$(cat)
output=$(echo "$input" | jq -r '.output // ""')
line_count=$(echo "$output" | wc -l | tr -d ' ')

if [ "$line_count" -gt 150 ]; then
  # Kürzen und kommentieren — Claude sieht eine gekürzte Version
  trimmed=$(echo "$output" | head -100)
  tail_section=$(echo "$output" | tail -20)
  echo "$input" | jq --arg trimmed "$trimmed" --arg tail "$tail_section" \
    '.output = "[Output truncated from '"$line_count"' lines]\n\nFirst 100 lines:\n" + $trimmed + "\n\n[...]\n\nLast 20 lines:\n" + $tail'
else
  echo "$input"
fi
```

Dies wird bei jedem Bash-Aufruf ausgeführt. Wenn die Ausgabe unter 150 Zeilen liegt, geht sie unverändert durch. Über 150 Zeilen ersetzt es das Ergebnis durch eine gekürzte Version mit dem Zeilenzähler. Der Kontext von Claude erhält das komprimierte Ergebnis — die vollständige Ausgabe betritt nie das Fenster.

Das gleiche Muster funktioniert zum Redigieren von Geheimnissen: Entfernen Sie Zeilen, die `API_KEY|SECRET|TOKEN|PASSWORD` entsprechen, bevor Claude sie verarbeitet.

### d. CLAUDE.md aggressiv begrenzen

Project-level `CLAUDE.md` wird beim Start jeder Sitzung geladen. Jedes Token darin ist eine feste Kosten, die sich über jede von Ihnen ausgeführte Sitzung summiert.

**Ziel :** Halten Sie Ihr Project `CLAUDE.md` unter 2 000 Tokens (~300–400 Zeilen einfache Prosa). Der User-Level `~/.claude/CLAUDE.md` kommt obendrauf — behandeln Sie die kombinierte Summe als Ihre Basis-Overhead.

**Was in CLAUDE.md zu halten ist :**
- Projektbeschreibung (3–5 Sätze)
- Schlüsselverzeichnisse und deren Zweck
- Nicht offensichtliche Konventionen, die Claude folgen muss
- Befehle für Build, Test, Lint
- Dinge, die nicht ohne Rückfrage modifiziert werden dürfen

**Was zu verschieben ist :**
- Referenzdokumentation (API-Formen, Schema-Beschreibungen) — lesen Sie diese bei Bedarf, nur wenn relevant
- Lange Beispiele — referenzieren Sie diese nach Dateipfad und lesen Sie bei Bedarf
- Historische Entscheidungen — halten Sie ein separates `decisions.md` und laden Sie es nur, wenn Sie in diesem Bereich arbeiten

Ein `CLAUDE.md`, das über Monate organisch gewachsen ist, enthält oft Regeln für Probleme, die nicht mehr existieren. Überprüfen Sie es und entfernen Sie tote Regeln. Jede entfernte Regel spart Tokens bei jeder Sitzung für immer.

### e. Zusammenfassen vor dem Spawnen von Agents

Wenn Sie einen Sub-Agent spawnen, erhält er sein eigenes Kontextfenster. Die Art und Weise, wie Sie Informationen übergeben, bestimmt, ob Sie Signal oder Rauschen übergeben.

**Leiten Sie nicht die rohe Tool-Historie weiter.** Wenn Sie gerade 20 Datei-Lesevorgänge und 10 Bash-Aufrufe im Parent-Kontext gemacht haben, diese Konversation verbatim an einen Sub-Agent weiterzuleiten, verschwendet Budget und verschlechtert den Fokus des Sub-Agents.

Fassen Sie stattdessen die Ergebnisse vor dem Spawnen in ein strukturiertes Briefing zusammen:

```
# Schlechter Ansatz:
Spawn agent with: full parent conversation history

# Besserer Ansatz:
Before spawning, construct a briefing:
  "The auth module is in src/auth/. The issue is in jwt.ts line 84 —
  the expiry check compares against Date.now() but tokens use seconds, not
  milliseconds. The fix is to multiply exp by 1000 before comparing.
  Relevant files: jwt.ts, middleware/auth.ts, tests/auth.test.ts.
  Task: fix the comparison and update the test."

Spawn agent with: the briefing only
```

Der Sub-Agent erhält genau das, was er braucht. Der Parent-Kontext erhält die Schlussfolgerungen des Sub-Agents zurück, ohne dass die vollständige Tool-Historie des Sub-Agents reingefordert wird.

### f. LLMS.txt-Bewusstsein

Wenn Sie externe Dokumentation einziehen — eine Bibliotheks-API-Referenz, einen Framework-Konfigurationsleitfaden — überprüfen Sie, ob das Projekt eine `llms.txt`-Datei veröffentlicht.

`llms.txt` ist ein komprimiertes Dokumentationsformat, das speziell für LLM-Verbrauch entwickelt wurde. Es ist normalerweise 5–10x kleiner als der gleichwertige Docs-Website-Inhalt. Das Abrufen von `https://docs.example.com/llms.txt` statt das Scrapen mehrerer Seiten kann 50–200K Tokens bei dokumentationsintensiven Aufgaben sparen.

Überprüfen Sie es vor dem Lesen von Raw-Docs:
```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
```

Wenn es existiert, verwenden Sie es als primäre Quelle. Wenn nicht, abrufen Sie nur die spezifische Seite, die Sie brauchen, statt Links zu folgen.

### g. Batch-Operationen verwenden

In Agent-Pipelines und SDK-Workflows sammeln Sie Ergebnisse in Batch-Aufrufen statt einzelnen interaktiven Runden. `agent_sdk.batch()` führt mehrere Sub-Tasks aus und gibt ihre Ergebnisse zurück, ohne dass jede Sub-Task die interaktive Konversation des Parents mit zwischengelagerter Tool-Historie füllt.

Dies ist das programmatische Äquivalent der Sub-Agent-Zusammenfassungs-Strategie oben — strukturieren Sie die Arbeit so, dass Zwischenschritte nicht im Hauptkontext verbleiben.

---

## Der `/usage`-Befehl

`/usage` zeigt eine Nach-Kategorie-Token-Aufschlüsselung für die aktuelle Sitzung an. Verfügbar in Claude Code (überprüfen Sie `claude --version` für Verfügbarkeit in Ihrem Build).

**Angezeigte Kategorien :**
- System-Prompt (CLAUDE.md + eingebautes Systemkontext)
- MCP-Tool-Definitionen
- Gesprächsverlauf (Benutzer + Assistant-Runden)
- Tool-Ergebnisse (Datei-Lesevorgänge, Bash-Ausgaben, MCP-Antworten)
- Kind-Agent-Aufrufe

**Wie man es effektiv nutzt :**

Führen Sie `/usage` beim Sitzungsstart aus, unmittelbar nach dem Laden von Claude. Dies gibt Ihnen eine Basis — die feste Overhead Ihres CLAUDE.md, MCP-Tools und System-Prompts, bevor Sie Arbeit geleistet haben. Diese Zahl ist Ihr Boden; jede Sitzung kostet mindestens diesen Betrag.

Wenn die Session-Start-Basis über 30–40K Tokens liegt, haben Sie ein Konfigurationsproblem:
- Zu viele MCP-Server aktiviert
- CLAUDE.md ist zu groß
- Beides

Führen Sie `/usage` erneut aus, nachdem Sie eine große Task-Phase abgeschlossen haben (z.B. nach Abschluss der Dateierkundung, vor Beginn der Implementierung). Dies zeigt, wie viel Budget jede Phase verbraucht hat, was Entscheidungen über die Kompaktifizierung informiert.

---

## Context-Budget in autonomen / Agent-Schleifen

Autonome Schleifen (`/loop`, geplante Agents, CI-Pipelines) sammeln Kontext anders als interaktive Sitzungen. Jede Iteration einer Schleife addiert sich zum gleichen Kontext, wenn Sie ihn nicht aktiv verwalten.

**Schlüsselmuster :**

**Zwischen Iterationen zusammenfassen.** Am Ende jeder Loop-Iteration schreiben Sie eine strukturierte Zusammenfassung in eine Datei. Die nächste Iteration liest die Zusammenfassungsdatei statt die vollständige Tool-Historie der vorherigen Iteration zu tragen.

```bash
# Ende jeder Loop-Iteration — Zustand auf Festplatte schreiben
cat > /tmp/loop-state.json <<EOF
{
  "iteration": 3,
  "completed": ["auth module", "user service"],
  "current": "payment service",
  "blockers": [],
  "next": "review payment integration tests"
}
EOF
```

**Verwenden Sie ScheduleWakeup zum Zurücksetzen des Kontexts.** Das `ScheduleWakeup`-Tool beendet das aktuelle Kontextfenster und nimmt am nächsten geplanten Tick in einem frischen Fenster wieder auf. Bei langen autonomen Aufgaben ist dies vorzuziehen, um Kontext über Dutzende von Iterationen zu sammeln. Der Kompromiss ist ein Cache-Miss (>5 Minuten Verzögerung) — akzeptabel, wenn die Iterations-Arbeit mehr als wenige Minuten dauert.

**Schreiben Sie Session-Zusammenfassungen im Stop-Hook.** Wenn Claude einen Runde in einer autonomen Sitzung beendet, wird der Stop-Hook ausgeführt. Verwenden Sie ihn, um eine Session-Zusammenfassung auf die Festplatte zu schreiben, bevor sich Kontext weiter ansammelt.

**`.claude/hooks/stop-summary.sh` :**
```bash
#!/usr/bin/env bash
# Wird bei Stop-Ereignis ausgeführt. Fügt eine Session-Zusammenfassung an ein persistentes Log an.

set -euo pipefail

timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
last_commit=$(git log -1 --oneline 2>/dev/null || echo "no commits")

cat >> "${CLAUDE_PROJECT_DIR}/.claude/session-log.md" <<EOF

## Session ended: ${timestamp}
Branch: ${branch}
Last commit: ${last_commit}

EOF
```

**Kompakten Kontext beim SessionStart injizieren.** Statt Kontext durch wiederholte Datei-Lesevorgänge beim Start jeder autonomen Sitzung wiederherzustellen, verwenden Sie einen `SessionStart`-Hook, um die von dem Stop-Hook der vorherigen Sitzung geschriebene Zusammenfassung zu injizieren. Dies gibt dem neuen Kontextfenster sofort strukturierte Orientierung.

**`.claude/hooks/session-start.sh` :**
```bash
#!/usr/bin/env bash
# Wird beim SessionStart ausgeführt. Gibt eine kompakte Zusammenfassung aus, die Claude beim Öffnen der Sitzung liest.

set -euo pipefail

summary_file="${CLAUDE_PROJECT_DIR}/.claude/session-log.md"

if [ -f "$summary_file" ]; then
  echo "=== SESSION CONTEXT (from previous session) ==="
  tail -50 "$summary_file"
  echo "=== END SESSION CONTEXT ==="
fi
```

---

## Pre-Compact-Hook-Muster

Wenn `/compact` feuert, generiert Claude eine Zusammenfassung der Konversation. Der `PreCompact`-Hook wird vor dieser Zusammenfassung ausgeführt — gibt Ihnen ein Fenster, um strukturierten Zustand zu injizieren, der die Zusammenfassung anreichert.

Ohne PreCompact-Hook wird die Zusammenfassung rein aus der Konversation generiert. Mit einem PreCompact-Hook, der aktuelle Branch, offene Tasks, aktuelle Commits und wichtige Entscheidungen injiziert, trägt die Kompaktifizierungs-Zusammenfassung erheblich mehr operativen Kontext in das nächste Fenster.

**settings.json :**
```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/pre-compact.sh` :**
```bash
#!/usr/bin/env bash
# Wird vor /compact ausgeführt. Gibt strukturierten Zustand aus, der die Kompaktifizierungs-Zusammenfassung anreichert.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --stat 2>/dev/null || echo "none")
unstaged=$(git diff --stat 2>/dev/null || echo "none")

cat <<EOF
=== PRE-COMPACT STATE INJECTION ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: ${branch}

Recent commits:
${recent_commits}

Staged changes:
${staged}

Unstaged changes:
${unstaged}
=== END STATE INJECTION ===
EOF
```

Die injizierte Ausgabe erscheint im Kontext unmittelbar vor der Zusammenfassungs-Generierung. Claude integriert diesen Zustand beim Schreiben der Zusammenfassung. Die resultierende Zusammenfassung — die zur Öffnung des neuen Kontextfensters wird — enthält Branch, aktuelle Commit-Historie und Änderungsstatus, ohne dass Sie diese Fakten nach der Kompaktifizierung manuell wiederherstellen müssen.

Erweitern Sie dieses Muster, um offene Tasks (aus einer Task-Datei), architektonische Entscheidungen, die während der Sitzung getroffen wurden (aus einem Decisions-Log), oder andere strukturierte Zustände einzubeziehen.

---

## Schnellreferenz — Context-Hygiene-Checkliste

- [ ] Project CLAUDE.md unter 2 000 Tokens; User CLAUDE.md ist schlank
- [ ] Nur benötigte MCP-Server für diese Sitzung sind aktiviert
- [ ] Bash-Befehle pipen zu `| head -N` oder `| tail -N`, wo Ausgabe unbegrenzt ist
- [ ] PostToolUse-Kompression Hook für verbose Tools installiert (Bash, Log-produzierende MCPs)
- [ ] Große Datei-Lesevorgänge verwenden `limit` und `offset` — keine vollständigen Lesevorgänge von Dateien über 200 Zeilen, außer wenn der vollständige Inhalt benötigt wird
- [ ] `/compact` bei 50–60% Kontextnutzung ausgelöst, nicht bei 90%+
- [ ] Sub-Agents erhalten ein strukturiertes Briefing, nicht die rohe Parent-Gesprächs-Historie
- [ ] Externe Dokumentation über `llms.txt` geladen, wenn verfügbar
- [ ] Autonome Loop-Iterationen schreiben Zustand auf die Festplatte; nächste Iteration liest von der Festplatte
- [ ] PreCompact-Hook installiert, um Kompaktifizierungs-Zusammenfassungen zu anreichern
- [ ] Stop-Hook schreibt Session-Zusammenfassung für den Kontext-Loader der nächsten Sitzung
- [ ] `/usage` beim Sitzungsstart überprüft, um zu bestätigen, dass die Basis-Overhead akzeptabel ist

---

> **Arbeiten Sie mit uns :** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen AI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
