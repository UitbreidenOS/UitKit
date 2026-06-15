---
name: multi-agent-memory
description: "Erstellen Sie gemeinsame, versionierte Speichersysteme für Multi-Agent-Teams mit Blackboard-Muster, Konfliktlösung und eventueller Konsistenz"
updated: 2026-06-15
---

# Multi-Agent Memory Fähigkeit

## Wann aktivieren

- Erstellen von Multi-Agent-Systemen, bei denen Agenten gemeinsamen Zustand zugreifen und ändern müssen
- Implementieren von Blackboard-Muster-Architekturen für kollaborative Workflows
- Umgang mit Speicherkonflikten, wenn mehrere Agenten gleichzeitig die gleichen Daten aktualisieren
- Entwerfen von Agent-Speicher, der über mehrere Workflow-Ausführungen hinweg persistiert
- Implementieren von Agent-Team-Speicher (episodisches und semantisches Wissen, das zwischen Agenten geteilt wird)

## Wann NICHT verwenden

- Single-Agent-Workflows mit privatem Speicher (Verwendung von Speicher im Kontext)
- Nur-Lese-Workflows ohne gemeinsamen veränderbaren Zustand
- Workflows, bei denen Agenten niemals auf die Daten des anderen zugreifen

## Anleitung

### Blackboard-Datenstruktur

Das Blackboard ist das zentrale Repository für den gesamten gemeinsamen Zustand:

```json
{
  "session_id": "sess_abc123",
  "created_at": "2026-06-15T14:00:00Z",
  "phases": {
    "phase_1": {
      "name": "research",
      "status": "completed",
      "owner": "researcher",
      "version": 5,
      "data": {
        "sources": [...],
        "summary": "..."
      },
      "locked_by": null,
      "locked_until": null
    },
    "phase_2": {
      "name": "analysis",
      "status": "in_progress",
      "owner": "analyst",
      "version": 2,
      "data": {
        "themes": [...],
        "findings": [...]
      },
      "locked_by": "analyst",
      "locked_until": "2026-06-15T14:45:00Z"
    }
  },
  "conflicts": [],
  "audit_log": ".claude/blackboard-audit.jsonl"
}
```

**Regeln:**
- Jede Phase hat einen einzigen Eigentümer (den derzeit daran arbeitenden Agenten)
- Phasen werden versioniert (bei jedem Schreiben inkrementieren)
- Agenten müssen vor dem Schreiben eine Sperre erwerben
- Sperren haben Timeouts (Standard 30 Minuten)

### Lesen aus dem Blackboard

```python
def read_blackboard(phase_name, blackboard_file='.claude/blackboard.json'):
    """
    Lesen Sie eine Phase aus dem Blackboard.
    Gibt die Daten und Versionsnummer zurück.
    """
    import json
    
    with open(blackboard_file, 'r') as f:
        blackboard = json.load(f)
    
    if phase_name not in blackboard['phases']:
        raise KeyError(f"Phase '{phase_name}' not found in blackboard")
    
    phase = blackboard['phases'][phase_name]
    return {
        'data': phase['data'],
        'version': phase['version'],
        'status': phase['status']
    }
```

### Schreiben ins Blackboard

Folgen Sie immer dieser Reihenfolge:

```python
def write_blackboard(phase_name, new_data, agent_name, blackboard_file='.claude/blackboard.json'):
    """
    Schreiben Sie in eine Phase des Blackboards.
    
    Schritte:
    1. Sperre erwerben
    2. Version überprüfen (stellen Sie sicher, dass niemand anders sie geändert hat)
    3. Änderungen zusammenführen (nicht blind überschreiben)
    4. Schreiben
    5. Sperre freigeben
    """
    import json
    from datetime import datetime, timedelta
    
    with open(blackboard_file, 'r') as f:
        blackboard = json.load(f)
    
    phase = blackboard['phases'][phase_name]
    
    # Schritt 1: Überprüfen Sie, ob ein anderer Agent gesperrt ist
    if phase['locked_by'] and phase['locked_by'] != agent_name:
        lock_expired = datetime.fromisoformat(phase['locked_until']) < datetime.now()
        if not lock_expired:
            raise RuntimeError(f"Phase locked by {phase['locked_by']} until {phase['locked_until']}")
    
    # Schritt 2: Sperre erwerben
    phase['locked_by'] = agent_name
    phase['locked_until'] = (datetime.now() + timedelta(minutes=30)).isoformat()
    
    # Schritt 3: Änderungen zusammenführen (für nicht konfliktuare Aktualisierungen)
    merged_data = {**phase['data'], **new_data}
    
    # Schritt 4: Schreiben
    phase['data'] = merged_data
    phase['version'] += 1
    phase['owner'] = agent_name
    
    # In Audit-Protokoll protokollieren
    log_to_audit(blackboard_file, {
        'timestamp': datetime.now().isoformat(),
        'agent': agent_name,
        'phase': phase_name,
        'version': phase['version'],
        'action': 'write'
    })
    
    # Schritt 5: Sperre freigeben
    phase['locked_by'] = None
    phase['locked_until'] = None
    
    with open(blackboard_file, 'w') as f:
        json.dump(blackboard, f)
```

### Konfliktauflösung

Wenn mehrere Agenten versuchen, die gleiche Phase zu ändern:

```python
def detect_write_conflict(phase_name, version_read, blackboard_file='.claude/blackboard.json'):
    """
    Überprüfen Sie, ob ein anderer Agent die Phase seit dem Lesen geändert hat.
    """
    import json
    
    with open(blackboard_file, 'r') as f:
        blackboard = json.load(f)
    
    phase = blackboard['phases'][phase_name]
    
    if phase['version'] > version_read:
        return {
            'conflict': True,
            'version_read': version_read,
            'version_current': phase['version'],
            'modified_by': phase['owner'],
            'action': 'merge' if is_mergeable(version_read, phase) else 'escalate'
        }
    
    return {'conflict': False}

def resolve_conflict(phase_name, local_data, version_read, resolution_strategy='merge'):
    """
    Lösen Sie einen Schreibkonflikt.
    
    Strategien:
    - 'merge': Kombinieren Sie lokale und Remote-Änderungen (für nicht konfliktuare Schlüssel)
    - 'local': Behalten Sie lokale Änderungen, verwerfen Sie Remote-Änderungen
    - 'remote': Behalten Sie Remote-Änderungen, verwerfen Sie lokale
    - 'escalate': Fragen Sie den Supervisor
    """
    import json
    
    with open('.claude/blackboard.json', 'r') as f:
        blackboard = json.load(f)
    
    phase = blackboard['phases'][phase_name]
    
    if resolution_strategy == 'merge':
        merged = {**phase['data'], **local_data}
    elif resolution_strategy == 'local':
        merged = local_data
    elif resolution_strategy == 'remote':
        merged = phase['data']
    elif resolution_strategy == 'escalate':
        raise ValueError("Conflict escalated to supervisor")
    
    # Zusammengeführte Daten schreiben
    phase['data'] = merged
    phase['version'] += 1
    
    with open('.claude/blackboard.json', 'w') as f:
        json.dump(blackboard, f)
    
    return phase['version']
```

### Speicherphasen

Definieren Sie Phasen für verschiedene Arten von Arbeiten:

```json
{
  "phases": {
    "research": {
      "name": "Information gathering",
      "dependencies": [],
      "expected_data": {
        "sources": {"type": "array"},
        "summary": {"type": "string"}
      }
    },
    "analysis": {
      "name": "Synthesizing findings",
      "dependencies": ["research"],
      "expected_data": {
        "themes": {"type": "array"},
        "findings": {"type": "array"}
      }
    },
    "synthesis": {
      "name": "Generating report",
      "dependencies": ["analysis"],
      "expected_data": {
        "report": {"type": "string"},
        "citations": {"type": "array"}
      }
    }
  }
}
```

Agenten können nur Phasen lesen, die `status: completed` haben. Wenn eine Phase `in_progress` von einem anderen Agenten ist, warten Sie, bis sie abgeschlossen ist.

### Audit-Protokoll

Protokollieren Sie alle Blackboard-Operationen zum Debuggen:

```json
{
  "timestamp": "2026-06-15T14:15:30Z",
  "agent": "researcher",
  "phase": "research",
  "operation": "write",
  "version_before": 4,
  "version_after": 5,
  "keys_modified": ["sources", "summary"],
  "conflict_detected": false,
  "status": "success"
}
```

Ort: `.claude/blackboard-audit.jsonl` (nur anhängen).

### Beispiel: Gemeinsamer Speicher-Workflow

```python
# Agent 1: Forscher
def researcher_work():
    read_result = read_blackboard('research')
    if read_result['status'] != 'in_progress':
        # Mit Forschungsphase beginnen
        sources = search_web("quantum computing")
        summary = summarize(sources)
        
        # In Blackboard schreiben
        write_blackboard('research', {
            'sources': sources,
            'summary': summary
        }, agent_name='researcher')
        
        print("Research phase completed. Version: 5")

# Agent 2: Analyst (liest aus research, schreibt in analysis)
def analyst_work():
    # Leseergebnisse
    research = read_blackboard('research')
    if research['status'] != 'completed':
        print("Waiting for research to complete...")
        return
    
    # Analysieren
    themes = extract_themes(research['data']['sources'])
    findings = analyze(research['data'])
    
    # Überprüfen auf Konflikte
    conflict = detect_write_conflict('analysis', version_read=0)
    if conflict['conflict']:
        print(f"Conflict detected. Current version: {conflict['version_current']}")
        # Per Zusammenführung auflösen
        resolve_conflict('analysis', {
            'themes': themes,
            'findings': findings
        }, version_read=0, resolution_strategy='merge')
    else:
        # Kein Konflikt, normal schreiben
        write_blackboard('analysis', {
            'themes': themes,
            'findings': findings
        }, agent_name='analyst')
        
        print("Analysis phase completed")
```

---
