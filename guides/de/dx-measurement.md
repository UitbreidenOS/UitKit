# Anleitung zur Messung der Entwickler-Erfahrung

Die Messung der Entwickler-Erfahrung (DX) bei der Claude Code-Adoption erfordert systematische Erfassung, Aggregation und Analyse der Skill-Nutzung, Session-Muster und Feature-Effektivität. Diese Anleitung definiert das DX-Metriken-Framework und Instrumentierungsmuster.

---

## Warum DX messen

- **Adoptionsvalidierung**: Entdecken und rufen Benutzer veröffentlichte Skills wirklich auf?
- **Feature-ROI**: Welche Skills sparen Zeit, reduzieren Fehler oder entsperren Workflows?
- **Engpass-Erkennung**: Identifizieren Sie Reibungspunkte (langsame Skills, verwirrende Docs, fehlende Integrationen)
- **Iterative Verbesserung**: Quantifizieren Sie die Auswirkung von Skill-Updates, neuen Anleitungen oder Workflow-Änderungen
- **Business-Case-Unterstützung**: Demonstrieren Sie den Wert der Claude Code-Investition für Stakeholder

---

## Metriken-Schema

### Kern-Metriken

| Metrik | Definition | Einheit | Erfassung |
|---|---|---|---|
| `invocations` | Anzahl, wie oft ein Skill in einer Session/Periode aufgerufen wurde | count | PostToolUse Hook |
| `success_rate` | % der Skill-Aufrufe, die ohne Fehler abgeschlossen wurden | % (0–100) | PostToolUse + Tool-Exit-Code |
| `avg_duration_sec` | Durchschnittliche Ausführungszeit pro Skill-Aufruf | Sekunden | PostToolUse Zeitstempel-Paar |
| `time_saved_min` | Geschätzte Zeitersparnis vs. manuelle Ausführung (benutzergemeldet oder hergeleitet) | Minuten | Session-Metadaten + Heuristiken |
| `error_rate` | % der Aufrufe, die zu Fehler, Timeout oder Benutzer-Wiederholung führten | % (0–100) | PostToolUse-Exit-Status |
| `user_count` | Unterschiedliche Benutzer, die den Skill aufrufen | count | Session-ID-Aggregation |
| `adoption_tier` | Klassifizierung: `abandoned` (<5 Aufrufe), `low` (5–50), `active` (50–500), `core` (>500) | category | Aggregierte Aufrufe |

### Abgeleitete Metriken

| Metrik | Formel | Interpretation |
|---|---|---|
| **DX Score** | `(success_rate * 0.4) + (adoption_tier_score * 0.3) + (time_saved_relevance * 0.3)` | 0–100: allgemeine Gesundheit |
| **Productivity Multiplier** | `total_time_saved_per_user / avg_session_duration` | Stunden gespart pro Stunde Claude Code-Nutzung |
| **Friction Index** | `error_rate + (100 - success_rate)` | 0–200: niedriger ist besser |

### Session-Level-Attribute

Verfolgen Sie in `.claude/session-log.md` (erstellt bei Session-Start, mit Zusammenfassung am Ende hinzugefügt):

```markdown
## Session Summary — 2026-06-15T14:30:00Z

**Benutzer**: alice@company.com
**Dauer**: 47 Minuten
**Skills aufgerufen**: code-review, simplify, deep-research
**Gesamt-Tool-Aufrufe**: 18
**Fehler**: 1 (deep-research Timeout bei 3. Versuch, erfolgreich wiederholt)
**Zeitersparnis**: ~60 Minuten (code-review + simplify Auto-Fixes spart manuelle Refaktorierung)
**Blocker**: Keine
**Feedback**: "deep-research sollte Suchergebnisse über Wiederholungen cachen"
```

---

## Instrumentierungsmuster

### 1. PostToolUse Hook (Echtzeit-Protokollierung)

Jeder Tool-Aufruf protokolliert zu `.claude/usage-log.jsonl`:

```json
{
  "timestamp": "2026-06-15T14:32:15.234Z",
  "session_id": "sess_7f8a9b2c",
  "user_id": "alice@company.com",
  "skill_name": "code-review",
  "tool_called": "Bash",
  "invocation_num": 3,
  "duration_ms": 2847,
  "exit_code": 0,
  "success": true,
  "tool_output_length": 1247,
  "retry_count": 0
}
```

Siehe `hooks/usage-tracker.md` für die Implementierung.

### 2. Session Log (Ende-der-Session-Zusammenfassung)

Erstellen Sie `.claude/session-log.md` beim Session-Start, fügen Sie die Zusammenfassung am Ende an:

```bash
# Initialisieren Sie beim Session-Start
cat >> .claude/session-log.md << EOF
## Session Summary — $(date -u +"%Y-%m-%dT%H:%M:%SZ")

**User**: $USER
**Skills**: [wird am Ende aktualisiert]
**Duration**: [wird berechnet]
**Errors**: [wird gezählt]

---
EOF
```

Beim Session-Ende analysieren Sie `usage-log.jsonl` zum Aggregieren und Anhängen:

```json
{
  "session_id": "sess_7f8a9b2c",
  "user_id": "alice@company.com",
  "start_time": "2026-06-15T13:45:00Z",
  "end_time": "2026-06-15T14:32:47Z",
  "duration_minutes": 47,
  "skills_invoked": ["code-review", "simplify", "deep-research"],
  "total_invocations": 18,
  "total_errors": 1,
  "estimated_time_saved_min": 60,
  "sentiment": "positive"
}
```

### 3. Wöchentliche/monatliche Aggregation

Führen Sie `/dx-metrics aggregate` (oder `dx-analyst` Agent) aus, um `.claude/dx-scorecard.json` zu produzieren:

```json
{
  "period": "2026-06-08T00:00:00Z/2026-06-15T00:00:00Z",
  "metrics": {
    "code-review": {
      "invocations": 47,
      "success_rate": 97.9,
      "avg_duration_sec": 18.3,
      "error_rate": 2.1,
      "user_count": 12,
      "adoption_tier": "active",
      "time_saved_min": 891
    },
    "simplify": {
      "invocations": 31,
      "success_rate": 100,
      "avg_duration_sec": 12.1,
      "error_rate": 0,
      "user_count": 9,
      "adoption_tier": "active",
      "time_saved_min": 403
    },
    "deep-research": {
      "invocations": 8,
      "success_rate": 75.0,
      "avg_duration_sec": 45.7,
      "error_rate": 25.0,
      "user_count": 4,
      "adoption_tier": "low",
      "time_saved_min": 180
    }
  },
  "summary": {
    "total_users": 22,
    "avg_dx_score": 81.4,
    "total_time_saved_hours": 28.2,
    "friction_index": 12.3,
    "top_skill": "code-review",
    "lowest_adoption": "deep-research",
    "recommended_actions": [
      "Improve deep-research retry/caching to reduce 25% error rate",
      "Add session-log best practices guide (only 40% of sessions documented)"
    ]
  }
}
```

---

## Datenerfassungs-Architektur

### Generierte Dateien

| Datei | Zweck | Häufigkeit | Aufbewahrung |
|---|---|---|---|
| `.claude/usage-log.jsonl` | Rohe Hook-Protokolle (append-only) | Pro Tool-Aufruf | 90 Tage |
| `.claude/session-log.md` | Benutzer-sichtbare Zusammenfassung (eine pro Session) | Pro Session | 30 Tage (aufgerollt) |
| `.claude/dx-scorecard.json` | Aggregierter Metrik-Snapshot | Wöchentlich/monatlich | Unendlich |
| `.claude/dx-scorecard-history.jsonl` | Zeitreihe der Scorecards | Wöchentlich/monatlich | 2 Jahre |

### Erfassungsfluss

```
[Tool-Aufruf] 
    ↓
[PostToolUse Hook wird ausgelöst]
    ↓
[usage-tracker.sh fügt zu usage-log.jsonl hinzu]
    ↓
[Session endet]
    ↓
[Session-Log-Zusammenfassung generiert]
    ↓
[Wöchentlich: dx-analyst aggregiert in dx-scorecard.json]
    ↓
[Monatlich: Trends analysieren, Verbesserungen vorschlagen]
```

---

## Best Practices

### Für Benutzer (Session-Protokollierung)

1. **Aktivieren Sie Usage-Tracking** in Ihrem Projekt `.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PostToolUse": [{"type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/usage-tracker.sh"}]
     }
   }
   ```

2. **Hängen Sie Session-Feedback** am Ende jeder Session an:
   ```markdown
   ## Feedback

   - **Was funktioniert hat**: code-review fand 3 kritische Bugs im Login-Flow
   - **Was langsam war**: deep-research Timeout bei 3. Suche (benötigt Wiederholungs-Limit-Heuristik)
   - **Fehlend**: Kein Skill zum Validieren der SQL-Abfrage-Leistung
   - **Zeitersparnis**: ~2 Stunden bei Refaktorierung vs. manueller Code-Review
   ```

3. **Verwenden Sie konsistente Skill-Namen** in Abfragen (überprüfen Sie `/help` für exakte Namen)

### Für Skill-Autoren

1. **Benennen Sie Skills für Introspection**: Verwenden Sie klare, Single-Purpose-Namen (z. B. `code-review`, nicht `code-quality-plus`)
2. **Timing-Hinweise in der Ausgabe einschließen**: "Analysierte 412 Zeilen in 2.3 Sekunden"
3. **Erfolg/Fehler explizit berichten**: Exit-Code 0 = Erfolg; Nicht-Null = Fehler (Hook erfasst dies)
4. **Erwartete Dauer dokumentieren**: "Typische Laufzeit: 30–120 Sekunden" hilft Benutzern, ROI zu schätzen

### Für Organisations-DX-Leads

1. **Monatliche Überprüfungs-Cadence**: Aggregieren Sie Metriken am ersten Montag jedes Monats
2. **Benutzer-Feedback-Schleifen**: Befragen Sie Skill-Benutzer vierteljährlich zu Reibungspunkten
3. **Veröffentlichen Sie Metriken**: Teilen Sie `.claude/dx-scorecard.json` im Team-Dashboard oder Wiki
4. **Handeln Sie bei Engpässen**: Wenn error_rate > 10%, untersuchen Sie und schlagen Sie eine Reparatur innerhalb von 2 Wochen vor
5. **Feiern Sie Siege**: Teilen Sie Zeitersparnis-Summen und Adoptionswachstum in Team-Syncs

---

## Datenschutz und Governance

- **Benutzer-Anonymisierung**: Option zur Aggregation nach Rolle/Team anstelle von einzelnem E-Mail
- **Aufbewahrungsrichtlinie**: Löschen Sie Roh-Protokolle nach 90 Tagen; behalten Sie aggregierte Metriken unbegrenzt
- **Opt-Out**: Benutzer können `DX_TRACKING_DISABLED=1` setzen, um Hook-Protokollierung zu überspringen
- **Nur lokal standardmäßig**: `.claude/usage-log.jsonl` und `.claude/session-log.md` leben im Projektverzeichnis, werden nie hochgeladen, es sei denn, explizit konfiguriert

---

## Integrations-Beispiele

### Slack-Benachrichtigung (Wöchentliches Digest)

Hook in `.claude/settings.json` zum Posten der Scorecard zu Slack:

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL -d @.claude/dx-scorecard.json"
          }
        ]
      }
    ]
  }
}
```

### GitHub Issues (Engpass-Tracking)

Auto-erstellen Sie GitHub Issues für Skills mit error_rate > 15%:

```bash
jq '.metrics[] | select(.error_rate > 15)' .claude/dx-scorecard.json | \
  while read skill; do
    gh issue create --title "High error rate: $(echo $skill | jq .name)" \
      --label "dx-bottleneck" \
      --body "Error rate: $(echo $skill | jq .error_rate)%"
  done
```

### Grafana-Dashboard

Exportieren Sie Zeitreihen-Metriken zu Prometheus für Visualisierung:

```bash
jq '.metrics | to_entries[] | {name: .key, value: .value.success_rate}' \
  .claude/dx-scorecard-history.jsonl | prometheus_remote_write
```

---

## Meßcheck-liste

- [ ] Aktivieren Sie `usage-tracker` Hook in `.claude/settings.json`
- [ ] Erstellen Sie `.claude/session-log.md` Vorlage
- [ ] Planen Sie wöchentliche DX-Überprüfung (oder delegieren Sie an `dx-analyst` Agent)
- [ ] Dokumentieren Sie Skill-Namen und erwartete Dauern im Team-Wiki
- [ ] Legen Sie error_rate und adoption_tier Schwellen für Escalation fest
- [ ] Teilen Sie monatliche Scorecard mit dem Team
- [ ] Iterieren Sie: passen Sie Metriken basierend auf Feedback an

---
