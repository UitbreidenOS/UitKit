# Flujo de trabajo de compartición de memoria de agente

Implementa patrón pizarra para estado compartido entre múltiples agentes — define protocolos de entrega, esquemas de memoria y garantías de coherencia para workflows multi-agentes colaborativos.

---

## Cuándo usar

- Workflows multi-agentes donde los agentes deben referenciar o modificar estado compartido (no solo entrega secuencial)
- Sistemas complejos donde los agentes tienen dominios superpuestos que requieren visibilidad del trabajo de cada uno
- Workflows donde la salida de un agente debe ser inmediatamente visible a múltiples agentes
- Escenarios que requieren reconciliación de memoria o resolución de conflictos entre agentes

No usar para workflows puramente secuenciales, sistemas single-agente, o workflows donde los agentes nunca acceden a estado compartido.

---

## Patrón de pizarra

La pizarra es una estructura de datos compartida y mutable accesible a todos los agentes. Sirve como única fuente de verdad para estado de tarea:

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

**Responsabilidades de pizarra:**
- Única fuente de verdad para workflows multi-agentes
- Las lecturas de agente ocurren *antes* de escrituras (verificar estado actual, luego actualizar)
- Escrituras con marca de tiempo para auditoría
- Campo propietario rastrea qué agente realizó la última escritura en cada sección
- Los agentes nunca asumen coherencia — siempre leer antes de actuar

---

## Protocolo de entrega

Cuando un agente entrega a otro, debe:

1. **Finalizar su trabajo:**
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

2. **Escribir en pizarra con verificación de conflicto:**
   - Leer estado de pizarra actual
   - Detectar conflictos (¿ha modificado otro agente esta sección desde que empecé?)
   - Si conflicto: escalar a supervisor, no sobrescribir
   - Si no hay conflicto: escribir con marca de tiempo y nombre de agente

3. **Señalar disponibilidad:**
   ```json
   {
     "phase_name": "research_phase",
     "status": "completed",
     "ready_for": "analyst",
     "blocking_issues": []
   }
   ```

4. **Recibir confirmación:**
   Espere a que el próximo agente lea la entrega antes de salir. Espera agotada después de 30 segundos.

---

## Esquema de estado

La pizarra usa esquema estricto para cada fase:

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

**Reglas:**
- Cada escritura incrementa `version`
- Los agentes deben verificar versión antes de escribir (comparar a versión leída al inicio)
- Si versión ha cambiado, releer antes de escribir
- Los conflictos nunca se sobrescriben silenciosamente

---

## Reconciliación de memoria

Cuando los agentes no están de acuerdo en estado compartido:

1. **Detectar:** Agente detecta desajuste de versión o inconsistencia de datos
   ```
   Leí sources = [A, B, C] en versión 5
   Versión actual es 7 (analyst agregó [D, E])
   ```

2. **Reportar a supervisor:**
   ```json
   {
     "conflict_type": "write_conflict",
     "phase": "research_phase",
     "agent_view": {"sources": [A, B, C], "version": 5},
     "blackboard_view": {"sources": [A, B, C, D, E], "version": 7},
     "resolution": "merge_sources"
   }
   ```

3. **Supervisor decide:**
   - Aceptar versión de pizarra (ignorar cambios locales)
   - Fusionar cambios (agregar nuevas fuentes a mi lista)
   - Escalar (revisión humana requerida)
   - Revertir (devolver a versión anterior de pizarra)

4. **Actualizar memoria:**
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

## Esquema de paquete de entrega

Cuando un agente pasa trabajo a otro:

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

**Confirmación del próximo agente:**
```json
{
  "handoff_id": "hof_abc789",
  "acknowledged_by": "analyst",
  "timestamp": "2026-06-15T14:15:45Z",
  "ready_to_proceed": true
}
```

---

## Garantías de coherencia

La pizarra proporciona **coherencia eventual**:

- **Dentro de una fase:** Todas las lecturas ven la última escritura del propietario de fase actual
- **Fase cruzada:** Agente leyendo datos de fase de otro agente ve última versión finalizada
- **Resolución de conflicto:** Todos los agentes finalmente acuerdan estado fusionado (sin sobrescrituras silenciosas)
- **Sin lecturas sucias:** Los agentes nunca leen trabajo en progreso de otros agentes (solo fases completadas)

Para lograr esto:
1. Finalice cada fase antes de entregar
2. Use números de versión para detectar lecturas obsoletas
3. Escale conflictos a un supervisor
4. Registre todas las lecturas/escrituras en auditoría (`.claude/blackboard-audit.jsonl`)

---

## Ejemplo

**Workflow Investigación + Análisis + Síntesis:**

```
Investigador              Analista               Escritor
   |                      |                      |
   |-- leer pizarra       |                      |
   |   (vacío)            |                      |
   |                      |                      |
   |-- investigar fuentes |                      |
   |                      |                      |
   |-- escribir a         |                      |
   |   pizarra :          |                      |
   |   sources[1..12]     |                      |
   |   status: completed  |                      |
   |                      |                      |
   |-- señalar listo ----> |                      |
   |                      |                      |
   |                      |-- leer pizarra       |
   |                      |   (fuentes presentes)|
   |                      |                      |
   |                      |-- analizar hallazgos|
   |                      |                      |
   |                      |-- escribir a         |
   |                      |   pizarra :          |
   |                      |   analysis[A,B,C]    |
   |                      |   status: completed |
   |                      |                      |
   |                      |-- señalar listo ---> |
   |                      |                      |
   |                      |                      |-- leer pizarra
   |                      |                      |   (fuentes + análisis)
   |                      |                      |
   |                      |                      |-- sintetizar reporte
   |                      |                      |
   |                      |                      |-- escribir a pizarra:
   |                      |                      |   report, status: done
```

**Escenario de conflicto:** Analista agrega fuentes mientras Investigador aún agrega fuentes.

```
Investigador: version=5, sources=[A,B,C]
Analista:     version=7, sources=[A,B,C,D,E]

Investigador detecta desajuste.
Escalada a Supervisor.

Supervisor decide: FUSIONAR
Resultado: sources=[A,B,C,D,E] (adiciones de Analista preservadas)
```

---
