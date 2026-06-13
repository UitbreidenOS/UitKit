# Chaos Engineering Game Day

Ejercicio estructurado de inyección de fallos que traslada la ingeniería del caos de experimentos ad-hoc a una práctica repetible en todo el equipo con fases definidas, controles de radio de explosión y una retrospectiva sin culpa.

---

## Cuándo usar

- Antes de un lanzamiento importante para probar modos de fallos desconocidos
- Después de un incidente que revela un camino de dependencia no probado
- Trimestralmente para mantener nítidas las habilidades de recuperación de fallos
- Cuando los requisitos de confiabilidad aumentan (nuevo SLO, nuevo nivel de cliente)

No ejecute en producción sin un camino de reversión probado. No ejecute durante el tráfico máximo a menos que la hipótesis lo requiera específicamente.

---

## Fases / Pasos

### Descripción general de fases

```
Pre-Game → Inject → Observe → Rollback → Retrospective
```

Cada fase tiene una puerta de entrada definida y un artefacto de salida. No omita fases incluso cuando el experimento se vea "seguro".

---

### Fase 1: Pre-Game

**Puerta:** El game day no comienza hasta que todos estos sean verdaderos.

- [ ] Congelación de cambios activa — no hay implementaciones durante la ventana de ejercicio
- [ ] Todos los participantes informados sobre la hipótesis y su rol de observación
- [ ] Procedimiento de reversión probado y documentado (disparador automatizado definido)
- [ ] Línea de base de métricas capturada (tasa de error, latencia p50/p99, rendimiento) para los 30 minutos anteriores a la inyección
- [ ] Ubicación del runbook compartida en canal de equipo

**Plantilla de briefing:**

```
Game Day: [experiment name]
Date/time: [ISO timestamp]
Facilitator: [name]
Observers: [names + what they're watching]

Hypothesis: [see template below]
Blast radius start: [1 instance / 1% traffic / etc.]
Rollback trigger: error rate > X% for Y minutes OR manual call
Duration limit: [max minutes before mandatory rollback]
```

---

### Plantilla de hipótesis

Cada game day se ejecuta contra exactamente una hipótesis. Sin sesiones multi-hipótesis — contaminan observaciones.

```
Steady state:  [what normal looks like — metric + value]
Failure type:  [what you're injecting — network latency / pod kill / CPU stress / etc.]
Expected impact: [what you predict will happen — "p99 latency increases to ~800ms, no errors"]
Success criteria: [what a passing result looks like — "system recovers within 60s of rollback with no data loss"]
```

**Ejemplo:**
```
Steady state:  API p99 < 200ms, error rate < 0.1%
Failure type:  Add 500ms of network latency between API and database (Toxiproxy)
Expected impact: p99 rises to ~700ms; error rate stays < 0.5% due to connection pool buffering
Success criteria: Removing the proxy restores p99 < 200ms within 30 seconds
```

Si el impacto esperado coincide con el comportamiento observado: el sistema es resiliente como se diseñó.
Si el comportamiento diverge: ha encontrado una dependencia oculta o un modelo mental incorrecto — ambos son hallazgos valiosos.

---

### Fase 2: Inject

Comience con el radio de explosión más pequeño. Escale solo si el sistema maneja el radio actual sin violar disparadores de reversión.

**Etapas de radio de explosión:**

| Etapa | Alcance | Espere antes de escalar |
|-------|--------|------------------------|
| 1 | 1 instancia (1-5% de la flota) | 5 minutos |
| 2 | 5% del tráfico (cambio de tráfico o bandera de función) | 10 minutos |
| 3 | 25% del tráfico | 15 minutos |
| 4 | Tráfico completo / todas las instancias | Decisión del facilitador |

Nunca omita de la etapa 1 a la etapa 4. Las etapas intermedias revelan si el fallo es localizado o sistémico.

**Comandos de herramientas:**

```bash
# AWS FIS — start experiment
aws fis start-experiment --experiment-template-id EXTabc123

# Toxiproxy — add latency between app and DB
toxiproxy-cli toxic add -t latency -a latency=500 -a jitter=50 db_connection

# tc netem — packet loss on a network interface (requires root)
tc qdisc add dev eth0 root netem loss 5%

# Remove tc netem
tc qdisc del dev eth0 root
```

---

### Fase 3: Observe

**No intervenga durante la observación.** El punto es ver cómo se comporta realmente el sistema, no cómo se comporta cuando un ingeniero lo está cuidando activamente. Los ingenieros solo deben ver métricas y registros.

Asignaciones de observador:
- Una persona vigila las métricas de tasa de error y latencia
- Una persona observa registros para tipos de error inesperados
- Una persona vigila servicios dependientes (impacto descendente)
- Facilitador rastrea tiempo y documenta observaciones en tiempo real

**Formato del registro de observación (adjuntar a runbook):**
```
[14:32:15] Blast radius: stage 1 (1 instance)
[14:32:15] Metrics: error_rate=0.08%, p99=210ms — within baseline
[14:37:00] Escalate to stage 2 (5% traffic)
[14:37:30] Metrics: error_rate=0.12%, p99=650ms — above baseline, below rollback trigger
[14:42:00] Escalate to stage 3 (25% traffic)
[14:42:15] Metrics: error_rate=1.8% — approaching rollback trigger (2%)
[14:43:30] error_rate=2.3% — rollback trigger hit
```

**La regla "no intervenga demasiado rápido":** el disparador de reversión se define por adelantado. No invierta manualmente antes de que se dispare el disparador a menos que haya una emergencia fuera del alcance de la hipótesis. Intervenir temprano invalida la observación.

---

### Fase 4: Rollback

**Disparador automatizado:**

```yaml
# Prometheus alerting rule that fires rollback
- alert: GameDayRollbackTrigger
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[2m]))
    / sum(rate(http_requests_total[2m])) > 0.02
  for: 2m
  labels:
    severity: game_day_rollback
  annotations:
    summary: "Game day rollback trigger — error rate {{ $value }}"
```

Cuando se dispara la alerta, se ejecuta el script de reversión automatizado:
```bash
#!/bin/bash
# .claude/game-day-rollback.sh
toxiproxy-cli toxic remove db_connection --toxicName latency || true
aws fis stop-experiment --id "$FIS_EXPERIMENT_ID" || true
tc qdisc del dev eth0 root 2>/dev/null || true
echo "Rollback complete at $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .claude/game-day-log.txt
```

**Reversión manual:** el facilitador llama a reversión si el disparador automatizado no se dispara pero la situación es claramente insegura (fallos en cascada que alcanzan servicios no alcanzados, impacto del cliente fuera del radio de explosión, etc.).

Después de la reversión: verifique que el sistema regrese al estado estable antes de finalizar el ejercicio. No declare éxito hasta que se restauren las métricas de línea de base.

---

### Fase 5: Retrospective

La retrospectiva ocurre dentro de 24 horas mientras las observaciones son frescas. Formato: sin culpa, enfocado en el comportamiento del sistema, no en acciones individuales.

**IMTD — Intent, Mistake, Trigger, Discovery:**
- **Intent:** lo que predijo la hipótesis
- **Mistake:** dónde el sistema o el modelo mental fue incorrecto
- **Trigger:** qué condición causó la desviación
- **Discovery:** lo que ahora sabemos que no sabíamos antes

No ejecute una retrospectiva orientada a la culpa. "El ingeniero no notó que la tasa de error estaba aumentando" no es un hallazgo de IMTD. "La alerta de tasa de error tiene una ventana de 5 minutos — demasiado lenta para atrapar este modo de fallo" es.

**Artefactos de salida retrospectiva:**
- Runbook actualizado con observaciones reales registradas
- Lista de hallazgos (cada uno como un ticket)
- Lista de experimentos posteriores si la hipótesis fue validada y el sistema se mantuvo
- Decisión: ¿se convertirá esto en un experimento recurrente? ¿Qué cadencia?

---

### Claude Code Game Day Assistant

Claude Code actúa como asistente en tiempo real durante el game day: lee el runbook, rastrea la hipótesis, registra observaciones con marca de tiempo y genera el informe retrospectivo.

**Setup:**

1. Colocar runbook en `.claude/game-day-runbook.md`
2. Iniciar sesión de Claude Code con:
```
Read .claude/game-day-runbook.md. You are the game day assistant for this session.
Track observations I give you with timestamps. When I say "retro", generate the IMTD retrospective report based on all observations.
```

**Durante el game day:**
- Proporcionar observaciones tal como registra: `"[14:42:15] error_rate hit 2.3%, rollback trigger fired"`
- Claude mantiene el registro corriente e indica si el tiempo de permanencia del radio de explosión no se ha alcanzado
- Al final: `"retro"` genera el informe retrospectivo completo con todas las observaciones registradas formateadas en la plantilla IMTD

---

## Ejemplo

**Servicio:** API de checkout  
**Hipótesis:** matar todas las instancias de Redis fuerza un retroceso a la base de datos sin errores visibles para el usuario

```
Steady state:  checkout success rate 99.8%, p99 < 300ms
Failure type:  Kill all Redis instances (docker stop redis)
Expected impact: p99 increases to ~800ms (DB fallback), success rate holds
Success criteria: No checkout failures; p99 recovers within 60s of Redis restart
```

**Game Day Log:**

```
[Pre-Game] Baseline captured: success=99.81%, p99=287ms
[10:05:00] Stage 1: killed 1 of 3 Redis instances
[10:10:00] Metrics: success=99.80%, p99=310ms — holding
[10:15:00] Stage 2: killed all 3 Redis instances
[10:15:30] Metrics: success=97.2%, p99=4200ms — UNEXPECTED
[10:17:00] Rollback trigger hit (error_rate > 2%)
[10:17:00] Automated rollback: Redis restarted
[10:18:45] Metrics returned to baseline
```

**Hallazgo:** la aplicación no tiene lógica de retroceso — lanza errores 500 en lugar de volver a la base de datos. El modelo mental era incorrecto. Ticket abierto para implementar retroceso. Hipótesis programada para volver a ejecutarse después de correcciones.

---
