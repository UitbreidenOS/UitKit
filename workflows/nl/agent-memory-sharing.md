# Agent geheugen delen workflow

Implementeert blackboard patroon voor gedeelde staat tussen meerdere agenten — definieert overdracht protocollen, geheugen schema's en consistentie garanties voor collaboratieve multi-agent workflows.

---

## Wanneer gebruiken

- Multi-agent workflows waarbij agenten gedeelde staat moeten refereren of wijzigen (niet alleen sequentiële overdracht)
- Complexe systemen waar agenten overlappende domeinen hebben die zichtbaarheid van elkaars werk vereisen
- Workflows waar output van één agent onmiddellijk zichtbaar moet zijn voor meerdere agenten
- Scenario's die geheugen reconciliatie of conflictbeslissing tussen agenten vereisen

Niet gebruiken voor puur sequentiële workflows, single-agent systemen, of workflows waar agenten nooit gedeelde staat benaderen.

---

## Blackboard patroon

De blackboard is een gedeelde, wijzigbare gegevensstructuur toegankelijk voor alle agenten. Het dient als enige bron van waarheid voor taakstaat:

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

**Blackboard verantwoordelijkheden:**
- Enige bron van waarheid voor multi-agent workflows
- Agent leesbewerkingen gebeuren *voor* schrijfbewerkingen (huidige staat controleren, dan bijwerken)
- Tijdstempel geschreven voor audittrail
- Eigenaarsveld volgt welke agent laatst in elke sectie schreef
- Agenten veronderstellen nooit consistentie — altijd lezen voor handelen

---

## Overdracht protocol

Wanneer een agent aan een ander overdraagt, moet deze:

1. **Zijn werk afmaken:**
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

2. **Naar blackboard schrijven met conflictcontrole:**
   - Huidige blackboard staat lezen
   - Conflicten detecteren (heeft andere agent deze sectie sinds start gewijzigd?)
   - Bij conflict: escaleer naar supervisor, niet overschrijven
   - Geen conflict: schrijf met timestamp en agent naam

3. **Gereedheid signaleren:**
   ```json
   {
     "phase_name": "research_phase",
     "status": "completed",
     "ready_for": "analyst",
     "blocking_issues": []
   }
   ```

4. **Bevestiging ontvangen:**
   Wacht totdat volgende agent de overdracht leest voor u afsluit. Time-out na 30 seconden.

---

## Staat schema

De blackboard gebruikt strikt schema voor elke fase:

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

**Regels:**
- Elke schrijfbewerking verhoogt `version`
- Agenten moeten versie controleren voor schrijven (vergelijken met versie gelezen bij start)
- Als versie gewijzigd, herlezen voor schrijven
- Conflicten worden nooit stil overschreven

---

## Geheugen reconciliatie

Wanneer agenten het niet eens zijn over gedeelde staat:

1. **Detecteren:** Agent detecteert versie mismatch of data inconsistentie
   ```
   Ik las sources = [A, B, C] op versie 5
   Huidige versie is 7 (analyst voegde [D, E] toe)
   ```

2. **Aan supervisor rapporteren:**
   ```json
   {
     "conflict_type": "write_conflict",
     "phase": "research_phase",
     "agent_view": {"sources": [A, B, C], "version": 5},
     "blackboard_view": {"sources": [A, B, C, D, E], "version": 7},
     "resolution": "merge_sources"
   }
   ```

3. **Supervisor beslist:**
   - Blackboard versie accepteren (lokale wijzigingen negeren)
   - Wijzigingen samenvoegen (nieuwe bronnen aan mijn lijst toevoegen)
   - Escaleren (menselijke review vereist)
   - Terugdraaien (teruggaan naar vorige blackboard versie)

4. **Geheugen bijwerken:**
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

## Overdracht pakket schema

Wanneer een agent werk aan ander overdraagt:

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

**Bevestiging van volgende agent:**
```json
{
  "handoff_id": "hof_abc789",
  "acknowledged_by": "analyst",
  "timestamp": "2026-06-15T14:15:45Z",
  "ready_to_proceed": true
}
```

---

## Consistentie garanties

De blackboard biedt **uiteindelijke consistentie**:

- **Binnen fase:** Alle leesbewerkingen zien laatste schrijfbewerking van huidige fase eigenaar
- **Fase-overschrijdend:** Agent die fase data van ander agent leest ziet laatst gefinaliseerde versie
- **Conflict oplosing:** Alle agenten komen uiteindelijk overeen op samengevoegde staat (geen stille overschrijvingen)
- **Geen vuile reads:** Agenten lezen nooit lopende werk van andere agenten (alleen gefinaliseerde fasen)

Om dit te bereiken:
1. Finaliseer elke fase voor overdracht
2. Gebruik versienummers om verouderde reads te detecteren
3. Escaleer conflicten naar supervisor
4. Registreer alle lees/schrijf bewerkingen in audittrail (`.claude/blackboard-audit.jsonl`)

---

## Voorbeeld

**Research + Analysis + Synthesis workflow:**

```
Onderzoeker             Analist                Schrijver
   |                      |                      |
   |-- lees blackboard     |                      |
   |   (leeg)              |                      |
   |                       |                      |
   |-- onderzoek bronnen   |                      |
   |                       |                      |
   |-- schrijf naar        |                      |
   |   blackboard :        |                      |
   |   sources[1..12]      |                      |
   |   status: completed   |                      |
   |                       |                      |
   |-- signaal klaar ----> |                      |
   |                       |                      |
   |                       |-- lees blackboard    |
   |                       |   (bronnen aanwezig) |
   |                       |                      |
   |                       |-- analyseer bevindingen|
   |                       |                      |
   |                       |-- schrijf naar      |
   |                       |   blackboard :       |
   |                       |   analysis[A,B,C]    |
   |                       |   status: completed |
   |                       |                      |
   |                       |-- signaal klaar ---> |
   |                       |                      |
   |                       |                      |-- lees blackboard
   |                       |                      |   (bronnen + analyse)
   |                       |                      |
   |                       |                      |-- syntheseer rapport
   |                       |                      |
   |                       |                      |-- schrijf naar blackboard:
   |                       |                      |   report, status: done
```

**Conflict scenario:** Analist voegt bronnen toe terwijl Onderzoeker nog bronnen toevoegt.

```
Onderzoeker: version=5, sources=[A,B,C]
Analist:     version=7, sources=[A,B,C,D,E]

Onderzoeker detecteert mismatch.
Escaleer naar Supervisor.

Supervisor beslist: MERGE
Resultaat: sources=[A,B,C,D,E] (Analist toevoegingen behouden)
```

---
