---
name: multi-agent-memory
description: "Build shared, versioned memory systems for multi-agent teams using blackboard pattern, conflict resolution, and eventual consistency"
updated: 2026-06-15
---

# Multi-Agent Memory Skill

## When to activate

- Building multi-agent systems where agents need to access and modify shared state
- Implementing blackboard-pattern architectures for collaborative workflows
- Handling memory conflicts when multiple agents update the same data concurrently
- Designing agent memory that persists across multiple workflow executions
- Implementing agent team memory (episodic and semantic knowledge shared among agents)

## When NOT to use

- Single-agent workflows with private memory (use in-context memory)
- Read-only workflows with no shared mutable state
- Workflows where agents never access each other's data

## Instructions

### Blackboard Data Structure

The blackboard is the central repository for all shared state:

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

**Rules:**
- Each phase has a single owner (the agent currently working on it)
- Phases are versioned (increment on every write)
- Agents must acquire a lock before writing
- Locks have timeouts (default 30 minutes)

### Reading from Blackboard

```python
def read_blackboard(phase_name, blackboard_file='.claude/blackboard.json'):
    """
    Read a phase from the blackboard.
    Returns the data and version number.
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

### Writing to Blackboard

Always follow this sequence:

```python
def write_blackboard(phase_name, new_data, agent_name, blackboard_file='.claude/blackboard.json'):
    """
    Write to a phase in the blackboard.
    
    Steps:
    1. Acquire lock
    2. Check version (ensure no one else modified it)
    3. Merge changes (do not overwrite blindly)
    4. Write
    5. Release lock
    """
    import json
    from datetime import datetime, timedelta
    
    with open(blackboard_file, 'r') as f:
        blackboard = json.load(f)
    
    phase = blackboard['phases'][phase_name]
    
    # Step 1: Check if locked by another agent
    if phase['locked_by'] and phase['locked_by'] != agent_name:
        lock_expired = datetime.fromisoformat(phase['locked_until']) < datetime.now()
        if not lock_expired:
            raise RuntimeError(f"Phase locked by {phase['locked_by']} until {phase['locked_until']}")
    
    # Step 2: Acquire lock
    phase['locked_by'] = agent_name
    phase['locked_until'] = (datetime.now() + timedelta(minutes=30)).isoformat()
    
    # Step 3: Merge changes (for non-conflicting updates)
    merged_data = {**phase['data'], **new_data}
    
    # Step 4: Write
    phase['data'] = merged_data
    phase['version'] += 1
    phase['owner'] = agent_name
    
    # Log to audit
    log_to_audit(blackboard_file, {
        'timestamp': datetime.now().isoformat(),
        'agent': agent_name,
        'phase': phase_name,
        'version': phase['version'],
        'action': 'write'
    })
    
    # Step 5: Release lock
    phase['locked_by'] = None
    phase['locked_until'] = None
    
    with open(blackboard_file, 'w') as f:
        json.dump(blackboard, f)
```

### Conflict Resolution

When multiple agents try to modify the same phase:

```python
def detect_write_conflict(phase_name, version_read, blackboard_file='.claude/blackboard.json'):
    """
    Check if another agent has modified the phase since we read it.
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
    Resolve a write conflict.
    
    Strategies:
    - 'merge': Combine local and remote changes (for non-conflicting keys)
    - 'local': Keep local changes, discard remote
    - 'remote': Keep remote changes, discard local
    - 'escalate': Ask supervisor
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
    
    # Write merged data
    phase['data'] = merged
    phase['version'] += 1
    
    with open('.claude/blackboard.json', 'w') as f:
        json.dump(blackboard, f)
    
    return phase['version']
```

### Memory Phases

Define phases for different types of work:

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

Agents can only read phases that have `status: completed`. If a phase is `in_progress` by another agent, wait for it to complete.

### Audit Log

Log all blackboard operations for debugging:

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

Location: `.claude/blackboard-audit.jsonl` (append-only).

## Example

```python
# Agent 1: Researcher
def researcher_work():
    read_result = read_blackboard('research')
    if read_result['status'] != 'in_progress':
        # Start work on research phase
        sources = search_web("quantum computing")
        summary = summarize(sources)
        
        # Write to blackboard
        write_blackboard('research', {
            'sources': sources,
            'summary': summary
        }, agent_name='researcher')
        
        print("Research phase completed. Version: 5")

# Agent 2: Analyst (reads from research, writes to analysis)
def analyst_work():
    # Read research results
    research = read_blackboard('research')
    if research['status'] != 'completed':
        print("Waiting for research to complete...")
        return
    
    # Analyze
    themes = extract_themes(research['data']['sources'])
    findings = analyze(research['data'])
    
    # Check for conflicts
    conflict = detect_write_conflict('analysis', version_read=0)
    if conflict['conflict']:
        print(f"Conflict detected. Current version: {conflict['version_current']}")
        # Resolve via merge
        resolve_conflict('analysis', {
            'themes': themes,
            'findings': findings
        }, version_read=0, resolution_strategy='merge')
    else:
        # No conflict, write normally
        write_blackboard('analysis', {
            'themes': themes,
            'findings': findings
        }, agent_name='analyst')
        
        print("Analysis phase completed")
```

---
