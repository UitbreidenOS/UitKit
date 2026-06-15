# Workflow für Agent-Speicherfreigabe

Implementiert das Blackboard-Muster für gemeinsamen Zustand zwischen mehreren Agenten — definiert Übergabeprotokolle, Speicherschemata und Konsistenzgarantien für kollaborative Multi-Agent-Workflows.

---

## Wann verwenden

- Multi-Agent-Workflows, bei denen Agenten gemeinsamen Zustand referenzieren oder ändern müssen (nicht nur sequenzielle Übergabe)
- Komplexe Systeme, bei denen Agenten überlappende Domänen mit gegenseitiger Sichtbarkeit haben
- Workflows, bei denen die Ausgabe eines Agenten unmittelbar für mehrere Agenten sichtbar sein muss
- Szenarien, die Speicherabstimmung oder Konfliktlösung zwischen Agenten erfordern

Nicht verwenden für rein sequenzielle Workflows, Single-Agent-Systeme oder Workflows, bei denen Agenten nie auf gemeinsamen Zustand zugreifen.

---

## Blackboard-Muster

Das Blackboard ist eine gemeinsame, veränderbare Datenstruktur, auf die alle Agenten zugreifen können. Es dient als einzige Wahrheitsquelle für den Aufgabenzustand:

```json
{
  "session_id": "sess_xyz789",
  "blackboard": {
    "task_id": "research_and_synthesize",
    "status": "running",
    "created_at": "2026-06-15T14:00:00Z",
    "agents_participating": ["researcher", "analyst", "writer"],
    "shared_state": {
      "research_phase": {
        "topic": "Quantum Computing in 2026",
        "started_by": "researcher",
        "status": "completed",
        "sources": [
          {"title": "...", "url": "...", "agent_notes": "credible"}
        ],
        "research_summary": "...",
        "completed_at": "2026-06-15T14:15:00Z"
      },
      "analysis_phase": {
        "started_by": "analyst",
        "status": "in_progress",
        "analysis_findings": [
          {"topic": "Hardware", "finding": "..."},
          {"topic": "Software", "finding": "..."}
        ],
        "current_agent": "analyst"
      },
      "synthesis_phase": {
        "status": "pending",
        "estimated_start": "2026-06-15T14:30:00Z"
      },
      "metadata": {
        "iteration": 1,
        "conflicts_resolved": 0,
        "last_modified_by": "analyst",
        "last_modified_at": "2026-06-15T14:20:15Z"
      }
    }
  }
}
```

**Blackboard-Verantwortlichkeiten:**
- Einzige Wahrheitsquelle für Multi-Agent-Workflows
- Agent-Lesevorgänge erfolgen *vor* Schreibvorgängen (aktuellen Zustand prüfen, dann aktualisieren)
- Zeitgestempelte Schreibvorgänge für Audit-Trail
- Das Feld "Owner" verfolgt, welcher Agent zuletzt in jedem Bereich geschrieben hat
- Agenten setzen nie Konsistenz voraus — immer vor dem Handeln lesen

---

## Übergabeprotokoll

Wenn ein Agent an einen anderen übergibt, muss er:

1. **Seine Arbeit abschließen:**
   ```json
   {
     "agent": "researcher",
     "action": "finalize_phase",
     "phase": "research_phase",
     "data": {
       "sources": [...],
       "summary": "...",
       "status": "completed"
     },
     "next_agent": "analyst",
     "handoff_timestamp": "2026-06-15T14:15:30Z"
   }
   ```

2. **Mit Konfliktprüfung in Blackboard schreiben:**
   - Aktuellen Blackboard-Zustand lesen
   - Konflikte erkennen (hat ein anderer Agent diesen Bereich seit Beginn geändert?)
   - Bei Konflikt: zur Überwachung eskalieren, nicht überschreiben
   - Kein Konflikt: mit Zeitstempel und Agent-Name schreiben

3. **Verfügbarkeit signalisieren:**
   ```json
   {
     "phase_name": "research_phase",
     "status": "completed",
     "ready_for": "analyst",
     "blocking_issues": []
   }
   ```

4. **Bestätigung empfangen:**
   Warten, bis der nächste Agent die Übergabe liest, bevor Sie beenden. Zeitüberschreitung nach 30 Sekunden.

---

## Zustandsschema

Das Blackboard verwendet ein striktes Schema für jede Phase:

```typescript
interface PhaseState {
  name: string;           // phase identifier
  status: "pending" | "in_progress" | "completed" | "failed";
  started_by: string;     // agent name
  started_at: ISO8601;
  completed_at?: ISO8601;
  owner: string;          // current owner agent
  data: object;           // phase-specific payload
  version: number;        // increment on each write
  conflicts?: Conflict[]; // unresolved conflicts
}

interface Conflict {
  detected_at: ISO8601;
  type: "write_conflict" | "data_inconsistency" | "state_mismatch";
  details: string;
  resolver_agent?: string;
  resolution?: string;
}
```

**Regeln:**
- Jeder Schreibvorgang erhöht `version`
- Agenten müssen vor dem Schreiben die Version prüfen (Vergleich zur Startversion)
- Wenn Version geändert hat, vor dem Schreiben neu lesen
- Konflikte werden nie stillschweigend überschrieben

---

## Speicherabstimmung

Wenn Agenten sich nicht auf gemeinsamen Zustand einigen:

1. **Erkennen:** Agent erkennt Versionskonflikt oder Datensatzinkohärenz
   ```
   Ich las sources = [A, B, C] in Version 5
   Aktuelle Version ist 7 (Analyst hat [D, E] hinzugefügt)
   ```

2. **Dem Supervisor melden:**
   ```json
   {
     "conflict_type": "write_conflict",
     "phase": "research_phase",
     "agent_view": {"sources": [A, B, C], "version": 5},
     "blackboard_view": {"sources": [A, B, C, D, E], "version": 7},
     "resolution": "merge_sources"
   }
   ```

3. **Supervisor entscheidet:**
   - Blackboard-Version akzeptieren (lokale Änderungen ignorieren)
   - Änderungen zusammenführen (neue Quellen zu meiner Liste hinzufügen)
   - Eskalieren (menschliche Überprüfung erforderlich)
   - Zurückrollen (zu vorheriger Blackboard-Version zurück)

4. **Speicher aktualisieren:**
   ```json
   {
     "conflict_id": "conf_123",
     "resolution_type": "merge_sources",
     "merged_sources": [A, B, C, D, E],
     "resolver_agent": "supervisor",
     "resolved_at": "2026-06-15T14:22:00Z"
   }
   ```

---

## Übergabepaket-Schema

Wenn ein Agent Arbeit an einen anderen übergibt:

```json
{
  "handoff_id": "hof_abc789",
  "from_agent": "researcher",
  "to_agent": "analyst",
  "phase": "research_phase",
  "timestamp": "2026-06-15T14:15:30Z",
  "work_summary": "Collected 12 sources on quantum computing. Organized by topic.",
  "deliverables": {
    "sources": [...],
    "summary": "...",
    "open_questions": ["Q1", "Q2"]
  },
  "constraints_for_next_agent": [
    "Do not contradict findings from sources A, B, C",
    "Budget 15 minutes for analysis phase"
  ],
  "prerequisite_status": {
    "complete": true,
    "blockers": [],
    "assumptions": ["Internet connectivity available"]
  }
}
```

**Bestätigung vom nächsten Agent:**
```json
{
  "handoff_id": "hof_abc789",
  "acknowledged_by": "analyst",
  "timestamp": "2026-06-15T14:15:45Z",
  "ready_to_proceed": true
}
```

---

## Konsistenzgarantien

Das Blackboard bietet **eventuelle Konsistenz**:

- **Innerhalb einer Phase:** Alle Lesevorgänge sehen den letzten Schreibvorgang des aktuellen Phaseneigentümers
- **Phasenübergreifend:** Agent, der Phasendaten eines anderen Agenten liest, sieht die letzte finalisierte Version
- **Konfliktauflösung:** Alle Agenten einigen sich schließlich auf den zusammengeführten Zustand (keine stillen Überschreibungen)
- **Keine Dirty Reads:** Agenten lesen nie laufende Arbeiten anderer Agenten (nur abgeschlossene Phasen)

Um dies zu erreichen:
1. Finalisieren Sie jede Phase vor der Übergabe
2. Verwenden Sie Versionsnummern zur Erkennung veralteter Lesevorgänge
3. Eskalieren Sie Konflikte an einen Supervisor
4. Protokollieren Sie alle Lese-/Schreibvorgänge in Audit-Trail (`.claude/blackboard-audit.jsonl`)

---

## Beispiel

**Forschungs- + Analyse- + Synthesiseworkflow:**

```
Forscher              Analyst               Schriftsteller
   |                      |                      |
   |-- Blackboard lesen    |                      |
   |   (leer)              |                      |
   |                       |                      |
   |-- Quellen recherchieren|                     |
   |                       |                      |
   |-- In Blackboard       |                      |
   |   schreiben:          |                      |
   |   sources[1..12]      |                      |
   |   status: completed   |                      |
   |                       |                      |
   |-- Signale fertig ----> |                      |
   |                       |                      |
   |                       |-- Blackboard lesen   |
   |                       |   (Quellen vorhanden)|
   |                       |                      |
   |                       |-- Ergebnisse analysieren|
   |                       |                      |
   |                       |-- In Blackboard     |
   |                       |   schreiben:        |
   |                       |   analysis[A,B,C]   |
   |                       |   status: completed |
   |                       |                      |
   |                       |-- Signale fertig ---> |
   |                       |                      |
   |                       |                      |-- Blackboard lesen
   |                       |                      |   (Quellen + Analyse)
   |                       |                      |
   |                       |                      |-- Bericht synthetisieren
   |                       |                      |
   |                       |                      |-- In Blackboard:
   |                       |                      |   report, status: done
```

**Konflikt-Szenario:** Analyst fügt Quellen hinzu, während Forscher noch Quellen hinzufügt.

```
Forscher:   version=5, sources=[A,B,C]
Analyst:    version=7, sources=[A,B,C,D,E]

Forscher erkennt Versatzfehler.
Eskaliert zum Supervisor.

Supervisor entscheidet: MERGE
Ergebnis: sources=[A,B,C,D,E] (Analyst-Ergänzungen behalten)
```

---
