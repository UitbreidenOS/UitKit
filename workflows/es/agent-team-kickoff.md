# Flujo de trabajo de inicio de equipo agente

Inicializa equipo multi-agente definiendo roles, particionando alcance de tarea y estableciendo contratos de coordinación entre agentes antes de ejecución.

---

## Cuándo usar

- Iniciando nuevo workflow multi-agente con 3+ agentes
- Incorporación de nuevos agentes en equipo existente
- Escalando workflow para manejar tareas más grandes y complejas
- Asegurando límites de rol claros para prevenir conflictos de agentes
- Estableciendo protocolos de comunicación antes de liberar agentes

No usar para tareas single-agente o workflows donde roles de agentes ya están claramente definidos y en producción.

---

## Asignación de roles

Cada agente recibe tarjeta de rol definiendo qué posee, de qué depende y qué no debe hacer:

```json
{
  "role_id": "role_researcher",
  "agent_name": "researcher",
  "model": "claude-opus-4-20250514",
  "domain": "Information gathering and source validation",
  "responsibilities": [
    "Search for credible sources on the given topic",
    "Validate source credibility (author, publication, recency)",
    "Summarize findings without interpretation",
    "Flag uncertain or conflicting information"
  ],
  "boundaries": {
    "do_not": [
      "Perform analysis or synthesis",
      "Make recommendations",
      "Synthesize conclusions from multiple sources",
      "Reach beyond research to speculate"
    ],
    "tool_access": ["web_search", "fetch_url", "validate_source"],
    "data_access": ["topic", "source_whitelist"],
    "output_format": {
      "type": "object",
      "properties": {
        "sources": {"type": "array", "items": "object"},
        "summary": {"type": "string"},
        "conflicts": {"type": "array"},
        "confidence": {"type": "number", "minimum": 0, "maximum": 1}
      },
      "required": ["sources", "summary", "confidence"]
    }
  },
  "dependencies": {
    "blocks": ["analyst", "writer"],
    "blocked_by": []
  },
  "sla": {
    "max_latency_ms": 120000,
    "expected_cost_cents": 45,
    "output_quality_gate": "confidence >= 0.8"
  }
}
```

**Reglas de tarjeta de rol:**
- Un rol por agente (agentes no tienen múltiples roles)
- Los límites son estrictos — agentes deben rechazar trabajo fuera de su dominio
- Las dependencias definen relaciones de secuenciación y bloqueo
- SLA define contrato para desempeño aceptable

---

## Partición de alcance

Divida tarea general en subtareas no-superpuestas asignadas a agentes específicos:

```json
{
  "workflow": "research_and_report",
  "overall_goal": "Write a comprehensive report on Quantum Computing in 2026",
  "scope_partition": [
    {
      "subtask_id": "st_1",
      "task_description": "Research quantum computing developments in 2026",
      "assigned_to": "researcher",
      "scope": {
        "topic": "Quantum computing",
        "year": 2026,
        "aspects": ["hardware", "software", "applications"],
        "max_sources": 15
      },
      "acceptance_criteria": [
        "10+ credible sources found",
        "Sources span all three aspects",
        "Confidence score >= 0.8"
      ],
      "output": {
        "sources": [...],
        "summary": "..."
      }
    },
    {
      "subtask_id": "st_2",
      "task_description": "Analyze research findings and identify themes",
      "assigned_to": "analyst",
      "scope": {
        "input_dependency": "st_1",
        "analysis_style": "academic",
        "min_themes": 3,
        "max_themes": 8
      },
      "acceptance_criteria": [
        "Themes are mutually exclusive",
        "Each theme backed by sources",
        "Analysis is objective, not speculative"
      ],
      "output": {
        "themes": [...],
        "analysis": "..."
      }
    },
    {
      "subtask_id": "st_3",
      "task_description": "Synthesize analysis into a polished report",
      "assigned_to": "writer",
      "scope": {
        "input_dependency": ["st_1", "st_2"],
        "target_length": "2000-3000 words",
        "tone": "professional",
        "audience": "technical audience"
      },
      "acceptance_criteria": [
        "Word count in target range",
        "All sources cited",
        "Flows logically from researcher → analyst work"
      ],
      "output": {
        "report": "...",
        "citations": [...]
      }
    }
  ],
  "scope_ownership": {
    "researcher": "st_1",
    "analyst": "st_2",
    "writer": "st_3"
  },
  "overlaps": [],
  "gaps": []
}
```

**Reglas de particionamiento:**
- Sin superposición de tarea (cada tarea asignada a exactamente un agente)
- Sin brechas (unión de todas tareas = objetivo general)
- Dependencias explícitas (qué subtarea debe completarse antes de otra)
- Criterios de aceptación claros (cómo sabe próximo agente que trabajo está hecho?)

---

## Contrato de coordinación

Antes de ejecución, todos agentes acuerdan contrato de coordinación:

```json
{
  "contract_id": "contract_research_and_report",
  "participants": ["researcher", "analyst", "writer"],
  "created_at": "2026-06-15T13:00:00Z",
  "clauses": {
    "communication": {
      "protocol": "blackboard",
      "state_location": ".claude/blackboard.json",
      "handoff_format": "handoff_packet_v1",
      "escalation_to": "supervisor"
    },
    "sequencing": {
      "execution_order": ["researcher", "analyst", "writer"],
      "parallelism_allowed": false,
      "circular_calls_forbidden": true
    },
    "data_consistency": {
      "schema_enforcement": true,
      "version_tracking": true,
      "conflict_resolution": "supervisor_decides",
      "audit_log": ".claude/coordination-audit.jsonl"
    },
    "error_handling": {
      "timeout_ms": 300000,
      "max_retries": 2,
      "retry_backoff_ms": 5000,
      "dead_letter_queue": ".claude/coordination-dlq.jsonl"
    },
    "quality_gates": {
      "output_validation": "schema and content",
      "confidence_threshold": 0.8,
      "rejection_retry": true,
      "rejection_max_retries": 2
    },
    "resource_limits": {
      "max_tokens_per_agent": 5000,
      "max_latency_per_agent_ms": 300000,
      "budget_cents": 150
    }
  },
  "signed_by": {
    "researcher": "signed",
    "analyst": "signed",
    "writer": "signed",
    "supervisor": "signed"
  }
}
```

**Ejecución de contrato:**
- Todos agentes verifican términos de contrato existen antes de empezar
- Violaciones (p. ej. llamada circular) disparan escalada inmediata
- Supervisor aplica timeout, reintento y límites de recursos
- Log de auditoría registra todas verificaciones de contrato

---

## Lista de verificación pre-ejecución

Antes de liberar agentes:

```json
{
  "checklist": {
    "role_assignment": {
      "all_agents_have_roles": true,
      "roles_non_overlapping": true,
      "boundaries_clear": true,
      "signed_off": true
    },
    "scope_partition": {
      "all_tasks_assigned": true,
      "no_gaps": true,
      "no_overlaps": true,
      "acceptance_criteria_defined": true,
      "dependencies_acyclic": true
    },
    "coordination_contract": {
      "signed_by_all": true,
      "timeout_set": true,
      "escalation_path_defined": true,
      "audit_logging_enabled": true
    },
    "agent_readiness": {
      "agents_have_system_prompt": true,
      "agents_have_tool_access": true,
      "agents_can_reach_coordinator": true,
      "all_agents_tested": true
    },
    "infrastructure": {
      "blackboard_storage_ready": true,
      "audit_log_storage_ready": true,
      "dead_letter_queue_ready": true,
      "monitoring_and_alerting_ready": true
    }
  },
  "approved_by": "supervisor",
  "approved_at": "2026-06-15T13:45:00Z"
}
```

Solo proceda a ejecución si todos elementos de lista están verdaderos.

---

## Ejemplo

**Inicio de workflow Investigación + Análisis + Reporte:**

```
Team Configuration:
├─ Researcher (Opus)
│  └─ Domain: Information gathering
│  └─ Tools: [web_search, fetch_url, validate_source]
│  └─ Blocks: [Analyst, Writer]
│
├─ Analyst (Opus)
│  └─ Domain: Analysis and synthesis
│  └─ Tools: [blackboard_read]
│  └─ Depends on: Researcher
│  └─ Blocks: [Writer]
│
└─ Writer (Sonnet)
   └─ Domain: Report generation
   └─ Tools: [blackboard_read]
   └─ Depends on: [Researcher, Analyst]

Scope Partition:
├─ Research sources on Quantum Computing → Researcher
├─ Identify themes from sources → Analyst
└─ Write 2000-3000 word report → Writer

Coordination Contract:
├─ Protocol: Blackboard
├─ Sequence: Researcher → Analyst → Writer
├─ Max latency per agent: 5m
├─ Budget: $1.50
└─ Escalation: Page supervisor if any agent fails > 2 times

Checklist: ✓ APPROVED
Time to execution: 2026-06-15T14:00:00Z
```

---
