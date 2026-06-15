---
name: multi-agent-memory
description: "Construire des systèmes de mémoire partagée et versionnés pour les équipes multi-agents en utilisant le pattern blackboard, la résolution de conflits et la cohérence éventuelle"
updated: 2026-06-15
---

# Compétence Multi-Agent Memory

## Quand l'activer

- Construire des systèmes multi-agents où les agents doivent accéder et modifier l'état partagé
- Implémenter des architectures de pattern blackboard pour les workflows collaboratifs
- Gérer les conflits de mémoire quand plusieurs agents mettent à jour les mêmes données de façon concurrente
- Concevoir une mémoire d'agent qui persiste à travers plusieurs exécutions de workflow
- Implémenter une mémoire d'équipe d'agents (connaissance épisodique et sémantique partagée entre agents)

## Quand NE PAS l'utiliser

- Workflows mono-agents avec mémoire privée (utiliser la mémoire en contexte)
- Workflows en lecture seule sans état mutable partagé
- Workflows où les agents n'accèdent jamais aux données les uns des autres

## Instructions

### Structure de données Blackboard

Le blackboard est le référentiel central pour tout l'état partagé :

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

**Règles :**
- Chaque phase a un seul propriétaire (l'agent travaillant actuellement dessus)
- Les phases sont versionnées (incrémenter à chaque écriture)
- Les agents doivent acquérir un verrou avant d'écrire
- Les verrous ont des délais d'expiration (par défaut 30 minutes)

### Lecture depuis le Blackboard

```python
def read_blackboard(phase_name, blackboard_file='.claude/blackboard.json'):
    """
    Lire une phase du blackboard.
    Retourne les données et le numéro de version.
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

### Écriture sur le Blackboard

Toujours suivre cette séquence :

```python
def write_blackboard(phase_name, new_data, agent_name, blackboard_file='.claude/blackboard.json'):
    """
    Écrire dans une phase du blackboard.
    
    Étapes :
    1. Acquérir le verrou
    2. Vérifier la version (vérifier que personne d'autre ne l'a modifiée)
    3. Fusionner les modifications (ne pas écraser aveuglément)
    4. Écrire
    5. Libérer le verrou
    """
    import json
    from datetime import datetime, timedelta
    
    with open(blackboard_file, 'r') as f:
        blackboard = json.load(f)
    
    phase = blackboard['phases'][phase_name]
    
    # Étape 1 : Vérifier si verrouillé par un autre agent
    if phase['locked_by'] and phase['locked_by'] != agent_name:
        lock_expired = datetime.fromisoformat(phase['locked_until']) < datetime.now()
        if not lock_expired:
            raise RuntimeError(f"Phase locked by {phase['locked_by']} until {phase['locked_until']}")
    
    # Étape 2 : Acquérir le verrou
    phase['locked_by'] = agent_name
    phase['locked_until'] = (datetime.now() + timedelta(minutes=30)).isoformat()
    
    # Étape 3 : Fusionner les modifications (pour les mises à jour sans conflit)
    merged_data = {**phase['data'], **new_data}
    
    # Étape 4 : Écrire
    phase['data'] = merged_data
    phase['version'] += 1
    phase['owner'] = agent_name
    
    # Enregistrer dans l'audit
    log_to_audit(blackboard_file, {
        'timestamp': datetime.now().isoformat(),
        'agent': agent_name,
        'phase': phase_name,
        'version': phase['version'],
        'action': 'write'
    })
    
    # Étape 5 : Libérer le verrou
    phase['locked_by'] = None
    phase['locked_until'] = None
    
    with open(blackboard_file, 'w') as f:
        json.dump(blackboard, f)
```

### Résolution de conflits

Quand plusieurs agents tentent de modifier la même phase :

```python
def detect_write_conflict(phase_name, version_read, blackboard_file='.claude/blackboard.json'):
    """
    Vérifier si un autre agent a modifié la phase depuis que nous l'avons lue.
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
    Résoudre un conflit d'écriture.
    
    Stratégies :
    - 'merge': Combiner les modifications locales et distantes (pour les clés sans conflit)
    - 'local': Garder les modifications locales, rejeter les distantes
    - 'remote': Garder les modifications distantes, rejeter les locales
    - 'escalate': Demander au superviseur
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
    
    # Écrire les données fusionnées
    phase['data'] = merged
    phase['version'] += 1
    
    with open('.claude/blackboard.json', 'w') as f:
        json.dump(blackboard, f)
    
    return phase['version']
```

### Phases de mémoire

Définir les phases pour différents types de travail :

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

Les agents ne peuvent lire que les phases avec `status: completed`. Si une phase est `in_progress` par un autre agent, attendre sa complétion.

### Journal d'audit

Enregistrer toutes les opérations du blackboard pour le débogage :

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

Emplacement : `.claude/blackboard-audit.jsonl` (ajout seul).

### Exemple : Workflow de mémoire partagée

```python
# Agent 1 : Chercheur
def researcher_work():
    read_result = read_blackboard('research')
    if read_result['status'] != 'in_progress':
        # Commencer le travail sur la phase de recherche
        sources = search_web("quantum computing")
        summary = summarize(sources)
        
        # Écrire dans le blackboard
        write_blackboard('research', {
            'sources': sources,
            'summary': summary
        }, agent_name='researcher')
        
        print("Research phase completed. Version: 5")

# Agent 2 : Analyste (lit à partir de la recherche, écrit dans l'analyse)
def analyst_work():
    # Lire les résultats de la recherche
    research = read_blackboard('research')
    if research['status'] != 'completed':
        print("Waiting for research to complete...")
        return
    
    # Analyser
    themes = extract_themes(research['data']['sources'])
    findings = analyze(research['data'])
    
    # Vérifier les conflits
    conflict = detect_write_conflict('analysis', version_read=0)
    if conflict['conflict']:
        print(f"Conflict detected. Current version: {conflict['version_current']}")
        # Résoudre via fusion
        resolve_conflict('analysis', {
            'themes': themes,
            'findings': findings
        }, version_read=0, resolution_strategy='merge')
    else:
        # Pas de conflit, écrire normalement
        write_blackboard('analysis', {
            'themes': themes,
            'findings': findings
        }, agent_name='analyst')
        
        print("Analysis phase completed")
```

---
