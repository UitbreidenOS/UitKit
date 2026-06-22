---
name: swarm-sandbox
description: "Entorno de pruebas aislado y seguro para topologías de enjambres multi-agente antes del despliegue en producción"
updated: 2026-06-22
category: enterprise
---

# Simulador de Swarm Sandbox

## Cuándo activar
- Antes de desplegar enjambres multi-agente con council.js en producción
- Pruebas de patrones de interacción entre agentes, flujos de mensajes y manejo de errores
- Validación de configuraciones de topología de enjambres (2-agente, 5-agente, estilo council)
- Experimentación con nuevos protocolos de comunicación entre agentes
- Sandboxing de casos extremos y escenarios de fallo en entornos aislados
- Validación de guardianes de seguridad y límites de velocidad antes del despliegue en vivo

## Cuándo NO usar
- Operaciones de agente único sin comunicación inter-agente
- Despliegues en producción — utilizar esta herramienta solo para pruebas, luego migrar a producción
- Tuberías de agentes secuenciales simples — la habilidad de construcción de agentes estándar es suficiente
- Experimentos rápidos puntuales sin necesidades formales de validación
- Sistemas monolíticos heredados sin arquitectura basada en agentes

## Instrucciones

### Concepto central
Swarm Sandbox crea un entorno aislado de prueba en seco para validar topologías multi-agente. Valida:
1. **Estructura de topología** — cantidad de agentes, relaciones, flujo de mensajes
2. **Rutas de comunicación** — enrutamiento de solicitudes, manejo de respuestas, ciclos
3. **Guardianes de seguridad** — límites de velocidad, manejo de tiempos de espera, aislamiento de recursos
4. **Propagación de errores** — modos de fallo, estrategias de recuperación, disruptores de circuito
5. **Preparación de integración** — compatibilidad de entorno antes de producción

### Plantillas de topología de sandbox

#### Par de 2 Agentes (Solicitud-Respuesta Simple)
```javascript
// Entorno simulado para comunicación bilateral entre agentes
const sandbox2Agent = {
  agents: [
    {
      id: "agent-primary",
      role: "orchestrator",
      model: "claude-opus-4-20250514",
      capabilities: ["task_decomposition", "delegation", "synthesis"],
      timeout_ms: 30000,
      rate_limit: { requests_per_minute: 60 }
    },
    {
      id: "agent-specialist",
      role: "specialist",
      model: "claude-opus-4-20250514",
      capabilities: ["analysis", "execution"],
      timeout_ms: 30000,
      rate_limit: { requests_per_minute: 120 }
    }
  ],
  communication: {
    topology: "bilateral",
    message_protocol: "json-rpc",
    max_queue_depth: 1000,
    retry_policy: {
      max_attempts: 3,
      backoff_ms: [100, 250, 500],
      circuit_breaker: { threshold: 5, reset_ms: 60000 }
    }
  },
  isolation: {
    context_isolation: true,
    memory_limit_mb: 512,
    cpu_quota_percent: 50,
    network_restricted: true
  },
  monitoring: {
    log_level: "debug",
    trace_enabled: true,
    metrics: ["latency_ms", "error_rate", "queue_depth", "token_usage"]
  }
};

// Entorno de simulación simulado
const mock2AgentEnv = {
  // Agent-primary envía tarea a agent-specialist
  scenario_1: {
    name: "Standard delegation",
    steps: [
      {
        actor: "agent-primary",
        action: "message",
        target: "agent-specialist",
        payload: {
          type: "task",
          id: "task-001",
          instruction: "Analyze market sentiment for tech stocks",
          context: { data_url: "mock://data/sentiment.json" }
        },
        expected_latency_ms: [500, 3000]
      },
      {
        actor: "agent-specialist",
        action: "response",
        target: "agent-primary",
        payload: {
          task_id: "task-001",
          status: "completed",
          result: { sentiment_score: 0.72, confidence: 0.94 }
        },
        expected_latency_ms: [300, 2000]
      }
    ]
  },
  
  // Modo de fallo: agente especialista con tiempo de espera agotado
  scenario_2: {
    name: "Timeout recovery",
    steps: [
      {
        actor: "agent-primary",
        action: "message",
        target: "agent-specialist",
        payload: {
          type: "task",
          id: "task-002",
          instruction: "Process large dataset",
          timeout_override_ms: 5000
        }
      },
      {
        actor: "agent-specialist",
        action: "timeout",
        duration_ms: 6000,
        expected_behavior: "circuit_breaker_activates"
      },
      {
        actor: "agent-primary",
        action: "retry_with_backoff",
        target: "agent-specialist",
        backoff_attempt: 1,
        delay_ms: 100
      }
    ]
  },
  
  // Modo de fallo: agotamiento de recursos
  scenario_3: {
    name: "Rate limit enforcement",
    steps: [
      {
        actor: "agent-primary",
        action: "burst_messages",
        count: 150,
        target: "agent-specialist",
        rate_limit_quota: 120
      },
      {
        actor: "sandbox",
        action: "enforce_limit",
        expected_behavior: "reject_excess_requests",
        rejected_count: 30
      }
    ]
  }
};
```

#### Consejo de 5 Agentes (Hub-and-Spoke)
```javascript
// Topología del consejo con orquestador central
const sandbox5AgentCouncil = {
  agents: [
    {
      id: "council-orchestrator",
      role: "orchestrator",
      model: "claude-opus-4-20250514",
      responsibilities: ["task_routing", "synthesis", "final_decision"]
    },
    {
      id: "researcher-agent",
      role: "researcher",
      model: "claude-opus-4-20250514",
      responsibilities: ["data_gathering", "fact_checking", "source_validation"]
    },
    {
      id: "analyst-agent",
      role: "analyst",
      model: "claude-opus-4-20250514",
      responsibilities: ["pattern_detection", "trend_analysis", "anomaly_detection"]
    },
    {
      id: "risk-agent",
      role: "risk_assessor",
      model: "claude-opus-4-20250514",
      responsibilities: ["risk_evaluation", "mitigation_planning", "compliance_check"]
    },
    {
      id: "writer-agent",
      role: "writer",
      model: "claude-opus-4-20250514",
      responsibilities: ["report_generation", "communication_formatting", "audience_adaptation"]
    }
  ],
  topology: {
    pattern: "hub-and-spoke",
    hub: "council-orchestrator",
    spokes: ["researcher-agent", "analyst-agent", "risk-agent", "writer-agent"],
    broadcast_enabled: false,
    direct_peer_communication: false
  },
  coordination: {
    phase_1: {
      name: "parallel_research",
      duration_target_ms: 5000,
      participants: ["researcher-agent"],
      synchronization: "gather_all_results"
    },
    phase_2: {
      name: "parallel_analysis",
      duration_target_ms: 3000,
      participants: ["analyst-agent"],
      depends_on: ["phase_1"]
    },
    phase_3: {
      name: "risk_assessment",
      duration_target_ms: 2000,
      participants: ["risk-agent"],
      depends_on: ["phase_1", "phase_2"]
    },
    phase_4: {
      name: "synthesis_and_write",
      duration_target_ms: 2000,
      participants: ["writer-agent"],
      depends_on: ["phase_2", "phase_3"]
    }
  },
  validation_checkpoints: {
    after_phase_1: { check: "validate_data_quality", failure_action: "retry" },
    after_phase_2: { check: "validate_analysis_completeness", failure_action: "retry" },
    after_phase_3: { check: "validate_risk_coverage", failure_action: "escalate" },
    after_phase_4: { check: "validate_output_format", failure_action: "reject" }
  }
};

// Escenarios de ejecución en seco para consejo de 5 agentes
const mock5AgentScenarios = {
  scenario_healthy: {
    name: "All agents operational",
    expected_flow: [
      "orchestrator → researcher",
      "orchestrator → analyst",
      "orchestrator → risk",
      "researcher → orchestrator (complete)",
      "analyst → orchestrator (complete)",
      "risk → orchestrator (complete)",
      "orchestrator → writer",
      "writer → orchestrator (complete)",
      "orchestrator → user"
    ],
    expected_time_ms: 12000,
    expected_status: "success"
  },
  
  scenario_one_agent_slow: {
    name: "Analyst agent slow response",
    delays: { "analyst-agent": 8000 },
    expected_behavior: "orchestrator_waits_then_retries",
    expected_time_ms: 15000,
    expected_status: "degraded_success"
  },
  
  scenario_one_agent_failed: {
    name: "Risk agent unreachable",
    failures: { "risk-agent": "connection_timeout" },
    expected_behavior: "orchestrator_detects_failure_and_branches_to_fallback",
    fallback_path: "skip_phase_3_warn_in_output",
    expected_status: "partial_success"
  },
  
  scenario_orchestrator_overload: {
    name: "Orchestrator under message load",
    concurrent_tasks: 25,
    queue_depth: 500,
    expected_behavior: "enforce_rate_limits_and_queue_backpressure",
    expected_rejected_tasks: 5,
    expected_status: "rate_limited"
  }
};
```

#### Estilo Council (Colaboración Peer con Router)
```javascript
// Punto a punto con enrutador de mensajes central
const sandboxPeerCouncil = {
  agents: [
    {
      id: "peer-1-sdr",
      role: "sales_development",
      model: "claude-opus-4-20250514",
      peer_topics: ["lead_qualification", "outreach_strategy"]
    },
    {
      id: "peer-2-marketing",
      role: "marketing_specialist",
      model: "claude-opus-4-20250514",
      peer_topics: ["campaign_analysis", "content_strategy"]
    },
    {
      id: "peer-3-product",
      role: "product_owner",
      model: "claude-opus-4-20250514",
      peer_topics: ["feature_analysis", "roadmap_planning"]
    }
  ],
  router: {
    type: "message_router",
    routing_rules: [
      { topic: "lead_qualification", route_to: "peer-1-sdr" },
      { topic: "campaign_analysis", route_to: "peer-2-marketing" },
      { topic: "feature_analysis", route_to: "peer-3-product" },
      { topic: "cross_functional_review", route_to: "all" }
    ],
    message_queue: { max_size: 5000, ttl_ms: 300000 },
    deduplication: true
  },
  peer_communication: {
    allowed_patterns: [
      { from: "peer-1-sdr", to: "peer-2-marketing", topic: "lead_context" },
      { from: "peer-2-marketing", to: "peer-3-product", topic: "feature_request" },
      { from: "peer-3-product", to: "peer-1-sdr", topic: "capability_update" }
    ],
    cycle_detection: {
      enabled: true,
      max_hops: 4,
      detection_action: "break_cycle"
    }
  }
};
```

### Variables de entorno simulado y banderas de ejecución en seco

```bash
# Archivo de configuración de sandbox: .swarm-sandbox.env
SWARM_MODE=sandbox
SANDBOX_ISOLATION_LEVEL=strict          # strict | moderate | permissive
SANDBOX_NETWORK_ACCESS=none             # none | local_only | restricted_urls
SANDBOX_TIMEOUT_OVERRIDE_MS=10000       # Override all agent timeouts for testing
SANDBOX_RATE_LIMIT_MULTIPLIER=0.5       # Reduce rate limits for stress testing

# Configuración del modelo
SANDBOX_MODEL_PRIMARY=claude-opus-4-20250514
SANDBOX_MODEL_FALLBACK=claude-sonnet-4-20250514
SANDBOX_TOKEN_LIMIT_OVERRIDE=50000      # Dry-run token budget

# Inyección de fallo (ingeniería del caos)
SANDBOX_INJECT_FAILURES=false           # Enable chaos mode
SANDBOX_FAILURE_RATE_PERCENT=10         # Random failure injection rate
SANDBOX_FAILURE_MODES=timeout,malformed_response,no_route  # Which failures to inject

# Monitoreo y validación
SANDBOX_TRACE_ENABLED=true
SANDBOX_VALIDATE_SCHEMA=true
SANDBOX_COLLECT_METRICS=true
SANDBOX_METRICS_OUTPUT=./sandbox-metrics.json

# Guardianes de seguridad
SANDBOX_MAX_CONCURRENT_AGENTS=10
SANDBOX_MAX_MESSAGE_SIZE_BYTES=1048576  # 1MB
SANDBOX_MAX_TOTAL_REQUESTS_PER_RUN=5000
SANDBOX_CIRCUIT_BREAKER_THRESHOLD=5
SANDBOX_CIRCUIT_BREAKER_RESET_MS=60000
```

### Lista de verificación de validación de aislamiento

```markdown
## Lista de Verificación Previa al Despliegue

### Topología y Estructura
- [ ] Todos los IDs de agente son únicos y no conflictivos
- [ ] Las asignaciones de rol de agente se alinean con las responsabilidades
- [ ] La topología de comunicación coincide con el diseño documentado (hub-spoke, peer, lineal)
- [ ] No hay dependencias circulares en la secuencia de fases (si es aplicable)
- [ ] Todos los agentes tienen puntos finales alcanzables en el mock de sandbox

### Comunicación y Mensajería
- [ ] Protocolo de mensaje definido y validado (JSON-RPC, gRPC, etc.)
- [ ] Serialización/deserialización probada para todos los tipos de mensajes
- [ ] Límites de tamaño máximo de mensaje aplicados
- [ ] Reglas de enrutamiento probadas para todos los pares de agentes
- [ ] Detección de ciclos funcionando para topologías punto a punto
- [ ] Mecanismos de encolamiento de mensajes y contrapresión validados

### Seguridad y Guardianes
- [ ] Límites de velocidad aplicados por agente y globalmente
- [ ] Manejo de tiempo de espera probado (degradación elegante vs. fallo)
- [ ] Disruptores de circuito se activan después de N fallos consecutivos
- [ ] Aislamiento de memoria por agente aislado
- [ ] Límites de recursos (CPU, memoria, presupuesto de tokens) aplicados
- [ ] Acceso de red restringido solo a puntos finales locales/simulados

### Manejo de Errores y Recuperación
- [ ] Lógica de reintento probada con retroceso (exponencial, jitter)
- [ ] Rutas de alternativa existen y se validan para fallos críticos
- [ ] Escenarios de fallo parcial manejados (p. ej., 1 de 5 agentes falla)
- [ ] Mensajes de error registrados con suficiente contexto
- [ ] Sin datos sensibles en salidas de error

### Rendimiento y Escala
- [ ] Latencia de línea base medida para cada agente
- [ ] Prueba de carga: validar comportamiento en 2x tareas concurrentes esperadas
- [ ] Prueba de carga: validar comportamiento en 5x tasa de mensajes esperada
- [ ] La profundidad de la cola se mantiene dentro de los límites bajo estrés
- [ ] Sin fugas de memoria observadas en ejecuciones extendidas

### Preparación de Integración
- [ ] Todas las dependencias externas simuladas (APIs, bases de datos, sistemas de archivos)
- [ ] Variables de entorno de producción documentadas
- [ ] Gestión de secretos (claves API, tokens de autenticación) no incrustada en configuraciones
- [ ] Mecanismo de descubrimiento de agente (si es dinámico) probado en sandbox
- [ ] Secuencia de cierre elegante verificada

### Cumplimiento y Auditoría
- [ ] Todas las acciones del agente registradas para registro de auditoría
- [ ] Datos sensibles (IDs de usuario, PII) enmascarados en registros
- [ ] Política de retención de auditoría definida e implementada
- [ ] Violaciones de cumplimiento detectadas e informadas
- [ ] Reportes de ejecución de sandbox generados automáticamente
```

### Guardianes de seguridad y pasos de validación

#### Mecanismos de seguridad integrados
```python
# Validador de seguridad para configuraciones de sandbox
class SwarmSandboxValidator:
    """Validar topología de enjambre antes del despliegue."""
    
    def __init__(self, topology_config: dict):
        self.config = topology_config
        self.errors = []
        self.warnings = []
    
    def validate_all(self) -> bool:
        """Ejecutar todas las pruebas de validación."""
        self.validate_topology_structure()
        self.validate_communication_graph()
        self.validate_resource_limits()
        self.validate_safety_guardrails()
        self.validate_error_handling()
        return len(self.errors) == 0
    
    def validate_topology_structure(self):
        """Verificar que los IDs de agente sean únicos, roles definidos, etc."""
        agent_ids = set()
        for agent in self.config.get("agents", []):
            if agent["id"] in agent_ids:
                self.errors.append(f"Duplicate agent ID: {agent['id']}")
            agent_ids.add(agent["id"])
            
            if not agent.get("role"):
                self.errors.append(f"Agent {agent['id']} missing role")
            if not agent.get("model"):
                self.warnings.append(f"Agent {agent['id']} using default model")
    
    def validate_communication_graph(self):
        """Comprobar ciclos, agentes inalcanzables, rutas mal formadas."""
        agents_map = {a["id"]: a for a in self.config.get("agents", [])}
        
        # Detección de ciclo (DFS)
        visited = set()
        rec_stack = set()
        
        def has_cycle(node, graph):
            visited.add(node)
            rec_stack.add(node)
            
            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    if has_cycle(neighbor, graph):
                        return True
                elif neighbor in rec_stack:
                    return True
            
            rec_stack.remove(node)
            return False
        
        # Construir lista de adyacencia a partir de topología
        graph = {}
        for agent_id in agents_map:
            graph[agent_id] = []
        
        # Agregar bordes basados en reglas de comunicación
        for rule in self.config.get("communication", {}).get("allowed_patterns", []):
            from_agent = rule.get("from")
            to_agent = rule.get("to")
            if from_agent in graph and to_agent in agents_map:
                graph[from_agent].append(to_agent)
        
        for agent_id in graph:
            if agent_id not in visited:
                if has_cycle(agent_id, graph):
                    self.errors.append(f"Cycle detected involving {agent_id}")
    
    def validate_resource_limits(self):
        """Verificar límites de velocidad, tiempos de espera, asignaciones de memoria."""
        for agent in self.config.get("agents", []):
            timeout = agent.get("timeout_ms", 30000)
            if timeout < 1000:
                self.errors.append(f"Agent {agent['id']} timeout too low: {timeout}ms")
            if timeout > 300000:
                self.warnings.append(f"Agent {agent['id']} timeout very high: {timeout}ms")
            
            memory = agent.get("memory_limit_mb", 512)
            if memory < 128:
                self.errors.append(f"Agent {agent['id']} insufficient memory: {memory}MB")
    
    def validate_safety_guardrails(self):
        """Comprobar disruptores de circuito, aislamiento, restricciones de red."""
        isolation = self.config.get("isolation", {})
        if not isolation.get("context_isolation"):
            self.warnings.append("Context isolation disabled — agents may see each other's internal state")
        if not isolation.get("network_restricted"):
            self.errors.append("Network access not restricted — only localhost/mock allowed in sandbox")
    
    def validate_error_handling(self):
        """Asegurar que la lógica de reintento, alternativas y registro de errores estén configurados."""
        comm = self.config.get("communication", {})
        retry = comm.get("retry_policy", {})
        
        if not retry:
            self.warnings.append("No retry policy defined")
        else:
            if not retry.get("circuit_breaker"):
                self.warnings.append("Circuit breaker not configured")
            
            max_attempts = retry.get("max_attempts", 0)
            if max_attempts < 1:
                self.errors.append("max_attempts must be >= 1")
    
    def report(self) -> str:
        """Generar informe de validación."""
        lines = []
        if self.errors:
            lines.append(f"ERRORS ({len(self.errors)}):")
            for err in self.errors:
                lines.append(f"  ✗ {err}")
        if self.warnings:
            lines.append(f"WARNINGS ({len(self.warnings)}):")
            for warn in self.warnings:
                lines.append(f"  ⚠ {warn}")
        if not self.errors and not self.warnings:
            lines.append("✓ All validation checks passed")
        return "\n".join(lines)
```

#### Validación en tiempo de ejecución durante ejecución en seco
```python
# Monitorear y validar el comportamiento del enjambre en tiempo real
class SwarmMonitor:
    """Rastrear métricas y validar la salud del enjambre durante la ejecución de sandbox."""
    
    def __init__(self, config):
        self.config = config
        self.metrics = {
            "agent_latencies": {},
            "message_counts": {},
            "error_counts": {},
            "queue_depths": {},
            "circuit_breaker_trips": {}
        }
        self.alerts = []
    
    def record_message(self, from_agent: str, to_agent: str, latency_ms: float):
        """Registrar entrega de mensaje."""
        if from_agent not in self.metrics["message_counts"]:
            self.metrics["message_counts"][from_agent] = 0
        self.metrics["message_counts"][from_agent] += 1
        
        if to_agent not in self.metrics["agent_latencies"]:
            self.metrics["agent_latencies"][to_agent] = []
        self.metrics["agent_latencies"][to_agent].append(latency_ms)
    
    def record_error(self, agent_id: str, error_type: str):
        """Rastrear errores por agente."""
        key = f"{agent_id}:{error_type}"
        self.metrics["error_counts"][key] = self.metrics["error_counts"].get(key, 0) + 1
    
    def validate_health(self) -> dict:
        """Verificación de salud continua durante la ejecución."""
        health = {"status": "healthy", "issues": []}
        
        # Comprobar SLAs de latencia
        for agent, latencies in self.metrics["agent_latencies"].items():
            if latencies:
                avg_latency = sum(latencies) / len(latencies)
                max_latency = max(latencies)
                
                expected_max = self.config.get("agents", [{}])[0].get("timeout_ms", 30000)
                if max_latency > expected_max * 0.8:
                    health["status"] = "degraded"
                    health["issues"].append(f"Agent {agent} latency high: {max_latency}ms")
        
        # Comprobar tasas de error
        total_errors = sum(self.metrics["error_counts"].values())
        total_messages = sum(self.metrics["message_counts"].values())
        if total_messages > 0:
            error_rate = total_errors / total_messages
            if error_rate > 0.05:  # > 5% errors
                health["status"] = "unhealthy"
                health["issues"].append(f"Error rate too high: {error_rate:.1%}")
        
        return health
```

## Ejemplo

### Configuración de sandbox completa y validación

```python
#!/usr/bin/env python3
"""
Simulador de Swarm Sandbox: ejemplo de extremo a extremo.
Configurar un consejo de 5 agentes, validar topología, ejecutar escenario de ejecución en seco,
y generar informe de despliegue.
"""

import json
from pathlib import Path
from swarm_sandbox import (
    SwarmSandboxValidator,
    SwarmMonitor,
    DryRunSimulator,
    SandboxEnvironment
)

# 1. Definir topología de enjambre
COUNCIL_TOPOLOGY = {
    "name": "customer_analysis_council",
    "agents": [
        {
            "id": "orchestrator",
            "role": "orchestrator",
            "model": "claude-opus-4-20250514",
            "timeout_ms": 30000,
            "rate_limit": {"requests_per_minute": 60}
        },
        {
            "id": "researcher",
            "role": "researcher",
            "model": "claude-opus-4-20250514",
            "timeout_ms": 20000,
            "rate_limit": {"requests_per_minute": 120}
        },
        {
            "id": "analyst",
            "role": "analyst",
            "model": "claude-opus-4-20250514",
            "timeout_ms": 20000,
            "rate_limit": {"requests_per_minute": 120}
        },
        {
            "id": "risk_assessor",
            "role": "risk_assessor",
            "model": "claude-opus-4-20250514",
            "timeout_ms": 15000,
            "rate_limit": {"requests_per_minute": 80}
        },
        {
            "id": "writer",
            "role": "writer",
            "model": "claude-opus-4-20250514",
            "timeout_ms": 15000,
            "rate_limit": {"requests_per_minute": 60}
        }
    ],
    "communication": {
        "topology": "hub-and-spoke",
        "hub": "orchestrator",
        "retry_policy": {
            "max_attempts": 3,
            "backoff_ms": [100, 250, 500],
            "circuit_breaker": {"threshold": 5, "reset_ms": 60000}
        }
    },
    "isolation": {
        "context_isolation": True,
        "memory_limit_mb": 512,
        "network_restricted": True
    }
}

# 2. Validar topología
print("Step 1: Validating topology structure...")
validator = SwarmSandboxValidator(COUNCIL_TOPOLOGY)
if not validator.validate_all():
    print("\n❌ Validation FAILED:")
    print(validator.report())
    exit(1)
print("✓ Validation passed:")
print(validator.report())

# 3. Configurar entorno de sandbox
print("\nStep 2: Initializing sandbox environment...")
env = SandboxEnvironment(
    topology=COUNCIL_TOPOLOGY,
    isolation_level="strict",
    network_access="none"
)
print(f"✓ Sandbox environment ready (isolation: {env.isolation_level})")

# 4. Crear monitor para seguimiento en tiempo real
print("\nStep 3: Setting up monitoring and metrics...")
monitor = SwarmMonitor(COUNCIL_TOPOLOGY)
print("✓ Monitor initialized")

# 5. Ejecutar escenario de ejecución en seco
print("\nStep 4: Running dry-run scenario (healthy council)...")
simulator = DryRunSimulator(
    topology=COUNCIL_TOPOLOGY,
    monitor=monitor,
    sandbox_env=env
)

# Simular una ejecución exitosa
scenario = {
    "name": "analyze_customer_cohort",
    "objective": "Analyze Q2 customer churn patterns and recommend retention strategy",
    "expected_sequence": [
        {"actor": "orchestrator", "action": "route_task", "targets": ["researcher"]},
        {"actor": "researcher", "action": "complete", "latency_ms": 2500},
        {"actor": "orchestrator", "action": "route_task", "targets": ["analyst"]},
        {"actor": "analyst", "action": "complete", "latency_ms": 1800},
        {"actor": "orchestrator", "action": "route_task", "targets": ["risk_assessor"]},
        {"actor": "risk_assessor", "action": "complete", "latency_ms": 1200},
        {"actor": "orchestrator", "action": "route_task", "targets": ["writer"]},
        {"actor": "writer", "action": "complete", "latency_ms": 1500},
    ]
}

result = simulator.run_scenario(scenario)
health = monitor.validate_health()

print(f"\n📊 Dry-run Results:")
print(f"  Status: {health['status']}")
print(f"  Total latency: {result['total_latency_ms']}ms")
print(f"  Messages sent: {result['message_count']}")
print(f"  Errors: {result['error_count']}")

# 6. Generar informe de despliegue
print("\nStep 5: Generating deployment report...")
report = {
    "topology": COUNCIL_TOPOLOGY["name"],
    "validation": {
        "status": "passed",
        "errors": len(validator.errors),
        "warnings": len(validator.warnings)
    },
    "dry_run": {
        "scenario": scenario["name"],
        "status": health["status"],
        "total_latency_ms": result["total_latency_ms"],
        "message_count": result["message_count"],
        "error_rate": f"{(result['error_count'] / result['message_count'] * 100):.2f}%" if result['message_count'] > 0 else "0%"
    },
    "readiness": "green" if health["status"] == "healthy" else "yellow" if health["status"] == "degraded" else "red",
    "next_steps": [
        "1. Review this report and address any warnings",
        "2. Run production environment setup script",
        "3. Enable monitoring and logging in production",
        "4. Deploy council.js controller",
        "5. Start with single task, then scale concurrency"
    ]
}

report_path = Path(".swarm-sandbox-report.json")
report_path.write_text(json.dumps(report, indent=2))
print(f"✓ Report written to {report_path}")

print("\n" + "="*70)
print("DEPLOYMENT READINESS: " + report["readiness"].upper())
print("="*70)
print("\nNext steps:")
for step in report["next_steps"]:
    print(f"  {step}")
print()

# 7. Salir con código apropiado
exit(0 if report["readiness"] == "green" else 1)
```

### Ejecutar el validador de sandbox desde CLI

```bash
# Inicializar entorno de sandbox
source .swarm-sandbox.env
export SANDBOX_MODE=true

# Ejecutar validación de topología
python3 swarm_sandbox_validator.py \
  --topology ./council-topology.json \
  --isolation-level strict \
  --output ./validation-report.json

# Ejecutar escenario específico de ejecución en seco
python3 swarm_sandbox_simulator.py \
  --topology ./council-topology.json \
  --scenario healthy_council \
  --metrics-output ./metrics.json \
  --trace-enabled

# Ejecutar prueba de caos (inyección de fallo)
python3 swarm_sandbox_simulator.py \
  --topology ./council-topology.json \
  --chaos-mode true \
  --failure-rate-percent 10 \
  --failure-modes timeout,malformed_response \
  --output ./chaos-report.json

# Generar informe de preparación de despliegue
python3 swarm_sandbox_report.py \
  --validation ./validation-report.json \
  --metrics ./metrics.json \
  --output ./deployment-readiness.md
```

### Integración con council.js

Después de que la validación de sandbox sea exitosa, migrar a producción:

```javascript
// Integración del controlador de council.js
const council = require('council.js');
const sandboxReport = require('./.swarm-sandbox-report.json');

// Verificar validación de sandbox antes de desplegar
if (sandboxReport.readiness !== 'green') {
  throw new Error('Sandbox validation failed. Fix issues before deployment.');
}

// Cargar topología de producción (misma config que la validada en sandbox)
const productionTopology = require('./council-topology.json');

// Inicializar con guardianes de pruebas de sandbox
const swarmController = council.create({
  topology: productionTopology,
  
  // Aplicar límites de seguridad de sandbox
  rate_limits: productionTopology.agents.map(a => ({
    agent_id: a.id,
    requests_per_minute: a.rate_limit.requests_per_minute
  })),
  
  // Usar valores de tiempo de espera de sandbox
  timeouts: productionTopology.agents.map(a => ({
    agent_id: a.id,
    timeout_ms: a.timeout_ms
  })),
  
  // Configuración del disruptor de circuito desde sandbox
  circuit_breaker: productionTopology.communication.retry_policy.circuit_breaker,
  
  // Monitoreo de métricas de sandbox
  monitoring: {
    enabled: true,
    log_level: 'info',
    metrics_output: './production-metrics.json'
  }
});

// Desplegar enjambre
swarmController.start();
```

### Lista de verificación: De sandbox a producción

```markdown
## Lista de Verificación de Despliegue Previa a la Producción

- [ ] Informe de validación de sandbox muestra preparación "verde"
- [ ] Todos los errores de topología resueltos (0 errores en informe)
- [ ] Advertencias revisadas y aceptadas
- [ ] Escenario de ejecución en seco ejecutado exitosamente
- [ ] Prueba de caos (inyección de fallo) pasada con recuperación aceptable
- [ ] Prueba de carga: 2x concurrencia pasada
- [ ] Prueba de carga: 5x tasa de mensajes pasada
- [ ] Variables de entorno de producción configuradas
- [ ] Secretos (claves API) inyectados en tiempo de ejecución
- [ ] Base de datos de producción/servicios externos listos
- [ ] Paneles de monitoreo configurados
- [ ] Umbrales de alertas establecidos basados en métricas de sandbox
- [ ] Manual de procedimientos para escenarios de fallo común preparado
- [ ] Equipo capacitado en operación y depuración del consejo
- [ ] Plan de reversión documentado (alternativa a un solo agente)
- [ ] Inicio con canario: desplegar al 10% del tráfico primero
- [ ] Monitorear métricas de producción durante las primeras 24 horas
- [ ] Aumentar gradualmente carga al 100% durante 1 semana
```
