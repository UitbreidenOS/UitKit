# Flux de travail de partage de mémoire agent

Implémente le pattern blackboard pour l'état partagé entre plusieurs agents — définit les protocoles de transmission, les schémas de mémoire et les garanties de cohérence pour les workflows multi-agents collaboratifs.

---

## Quand utiliser

- Workflows multi-agents où les agents doivent référencer ou modifier l'état partagé (pas seulement transmission séquentielle)
- Systèmes complexes où les agents ont des domaines qui se chevauchent nécessitant une visibilité du travail de chacun
- Workflows où la sortie d'un agent doit être immédiatement visible à plusieurs agents
- Scénarios nécessitant la réconciliation de mémoire ou la résolution de conflits entre agents

Ne pas utiliser pour les workflows purement séquentiels, les systèmes single-agent, ou les workflows où les agents n'accèdent jamais à l'état partagé.

---

## Pattern Blackboard

Le blackboard est une structure de données partagée et mutable accessible à tous les agents. Il sert de source unique de vérité pour l'état des tâches :

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

**Responsabilités du blackboard :**
- Source unique de vérité pour les workflows multi-agents
- Les lectures d'agent se produisent *avant* les écritures (vérifier l'état actuel, puis mettre à jour)
- Écritures horodatées pour la piste d'audit
- Le champ propriétaire suit quel agent a effectué la dernière écriture dans chaque section
- Les agents ne supposent jamais la cohérence — lisez toujours avant d'agir

---

## Protocole de transmission

Quand un agent transmet à un autre, il doit :

1. **Finaliser son travail :**
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

2. **Écrire au blackboard avec vérification de conflit :**
   - Lire l'état blackboard actuel
   - Détecter les conflits (un autre agent a-t-il modifié cette section depuis le début ?)
   - En cas de conflit : escalader au superviseur, ne pas écraser
   - Pas de conflit : écrire avec horodatage et nom d'agent

3. **Signaler la disponibilité :**
   ```json
   {
     "phase_name": "research_phase",
     "status": "completed",
     "ready_for": "analyst",
     "blocking_issues": []
   }
   ```

4. **Recevoir l'accusé réception :**
   Attendez que le prochain agent lise la transmission avant de quitter. Expiration après 30 secondes.

---

## Schéma d'état

Le blackboard utilise un schéma strict pour chaque phase :

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

**Règles :**
- Chaque écriture incrémente `version`
- Les agents doivent vérifier la version avant d'écrire (comparer à la version lue au démarrage)
- Si la version a changé, relire avant d'écrire
- Les conflits ne sont jamais silencieusement écrasés

---

## Réconciliation de mémoire

Quand les agents ne s'accordent pas sur l'état partagé :

1. **Détecter :** L'agent détecte une non-correspondance de version ou une incohérence de données
   ```
   J'ai lu sources = [A, B, C] à la version 5
   La version actuelle est 7 (l'analyste a ajouté [D, E])
   ```

2. **Signaler au superviseur :**
   ```json
   {
     "conflict_type": "write_conflict",
     "phase": "research_phase",
     "agent_view": {"sources": [A, B, C], "version": 5},
     "blackboard_view": {"sources": [A, B, C, D, E], "version": 7},
     "resolution": "merge_sources"
   }
   ```

3. **Le superviseur décide :**
   - Accepter la version blackboard (ignorer les changements locaux)
   - Fusionner les changements (ajouter les nouvelles sources à ma liste)
   - Escalader (révision humaine requise)
   - Annuler (revenir à la version précédente du blackboard)

4. **Mettre à jour la mémoire :**
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

## Schéma de paquet de transmission

Quand un agent transmet le travail à un autre :

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

**Accusé réception du prochain agent :**
```json
{
  "handoff_id": "hof_abc789",
  "acknowledged_by": "analyst",
  "timestamp": "2026-06-15T14:15:45Z",
  "ready_to_proceed": true
}
```

---

## Garanties de cohérence

Le blackboard fournit **cohérence finale** :

- **Au sein d'une phase :** Toutes les lectures voient la dernière écriture par le propriétaire de la phase actuelle
- **Entre phases :** L'agent lisant les données de phase d'un autre agent voit la dernière version finalisée
- **Résolution de conflit :** Tous les agents finissent par s'accorder sur l'état fusionné (pas d'écrasements silencieux)
- **Pas de lectures sales :** Les agents ne lisent jamais le travail en cours d'autres agents (seulement les phases terminées)

Pour réaliser ceci :
1. Finalisez chaque phase avant de transmettre
2. Utilisez les numéros de version pour détecter les lectures obsolètes
3. Escaladez les conflits à un superviseur
4. Enregistrez toutes les lectures/écritures dans la piste d'audit (`.claude/blackboard-audit.jsonl`)

---

## Exemple

**Flux de travail Recherche + Analyse + Synthèse :**

```
Chercheur              Analyste               Rédacteur
   |                      |                      |
   |-- lire blackboard     |                      |
   |   (vide)              |                      |
   |                       |                      |
   |-- rechercher sources  |                      |
   |                       |                      |
   |-- écrire au           |                      |
   |   blackboard :        |                      |
   |   sources[1..12]      |                      |
   |   status: completed   |                      |
   |                       |                      |
   |-- signaler done ----> |                      |
   |                       |                      |
   |                       |-- lire blackboard    |
   |                       |   (sources présentes)|
   |                       |                      |
   |                       |-- analyser résultats|
   |                       |                      |
   |                       |-- écrire au          |
   |                       |   blackboard :       |
   |                       |   analysis[A,B,C]   |
   |                       |   status: completed |
   |                       |                      |
   |                       |-- signaler done ---> |
   |                       |                      |
   |                       |                      |-- lire blackboard
   |                       |                      |   (sources + analyse)
   |                       |                      |
   |                       |                      |-- synthétiser rapport
   |                       |                      |
   |                       |                      |-- écrire au blackboard:
   |                       |                      |   report, status: done
```

**Scénario de conflit :** L'analyste ajoute des sources pendant que le chercheur ajoute toujours des sources.

```
Chercheur:  version=5, sources=[A,B,C]
Analyste:   version=7, sources=[A,B,C,D,E]

Le chercheur détecte une non-correspondance.
Escalade au superviseur.

Le superviseur décide : FUSIONNER
Résultat : sources=[A,B,C,D,E] (additions de l'analyste conservées)
```

---
