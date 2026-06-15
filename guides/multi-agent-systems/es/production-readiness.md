# Sistemas Multi-Agentes: Lista de Verificación de Preparación para Producción

Lista de verificación completa para asegurar que un sistema multi-agentes esté listo para producción — cubriendo observabilidad, confiabilidad, control de costos y respuesta a incidentes.

---

## Lista de Verificación Previa al Despliegue

### Arquitectura

- [ ] Los agentes tienen roles que no se superponen (sin superposición de dominio)
- [ ] El acceso a herramientas sigue el principio de menor privilegio (cada agente solo tiene herramientas necesarias)
- [ ] La topología de orquestación está documentada (DAG, pizarra, supervisor, etc.)
- [ ] Las dependencias circulares se detectan y se rechazan
- [ ] Se definen políticas de tiempo de espera y reintento para todos los agentes
- [ ] Se define la estrategia de recuperación de fallos (reintentar, escalar, compensar)

### Pruebas

- [ ] Pruebas unitarias para cada agente (herramientas simuladas)
- [ ] Pruebas de integración para entregas de agentes (con comunicación inter-agentes real)
- [ ] Pruebas end-to-end para flujos de trabajo completos (50+ casos de prueba)
- [ ] Pruebas de caos: inyectar fallos de agentes, retrasos de red, tiempos de espera
- [ ] Pruebas de carga: verificar rendimiento con solicitudes concurrentes
- [ ] Simulación de costos: estimar tokens/costos para flujos de trabajo típicos

### Gestión de Estado

- [ ] El esquema de pizarra está definido y validado
- [ ] El mecanismo de persistencia de estado (archivo, BD) se ha probado
- [ ] Se han probado el seguimiento de versiones y la resolución de conflictos
- [ ] El mecanismo de bloqueo previene escrituras concurrentes
- [ ] Se ha probado la recuperación de fallos parciales

### Observabilidad

- [ ] El ID de correlación de seguimiento se propaga a través de todas las llamadas de agentes
- [ ] El registro cubre todos los caminos críticos (éxito, reintento, fallo, escalada)
- [ ] Las métricas se recopilan para latencia, tokens, costos
- [ ] La telemetría de llamadas de agentes se exporta (Datadog, Prometheus, etc.)
- [ ] La estrategia de muestreo está definida (seguimiento 100% o muestra?)

### Confiabilidad

- [ ] Se establecen tiempos de espera para todas las llamadas de agentes (con alertas de monitoreo)
- [ ] Lógica de reintento con retroceso exponencial (máx. 3 intentos)
- [ ] Cola de letras muertas para fallos irrecuperables
- [ ] SLO definido para disponibilidad y latencia
- [ ] Presupuesto de error calculado y monitoreado
- [ ] Se definen rutas de escalada (correo electrónico, Slack, PagerDuty)

### Control de Costos

- [ ] Presupuesto de tokens definido por agente y total
- [ ] Alertas de costo configuradas (advertir si > 80% del presupuesto, error si > 100%)
- [ ] Selección de modelo optimizada (use Haiku donde sea posible, Opus solo cuando sea necesario)
- [ ] Estrategia de almacenamiento en caché definida (reutilizar resultados para las mismas entradas)
- [ ] Auditoría de tokenización de entrada (no pasar contexto innecesario)

### Documentación

- [ ] README explica el flujo de orquestación con diagrama
- [ ] Los roles de los agentes están documentados (propósito, dominio, herramientas, SLA)
- [ ] Guía de solución de problemas para fallos comunes
- [ ] Runbook para respuesta a incidentes y escalada
- [ ] Guía de desarrolladores para agregar nuevos agentes o flujos de trabajo

---

## Monitoreo y Alertas

### Métricas Clave

**Disponibilidad:**
```
success_rate = (successful_runs / total_runs) × 100%
Objetivo: 99.5% (presupuesto de error 0.5%)
Umbral de alerta: < 95%
```

**Latencia:**
```
p50_latency_ms = percentil 50 de la duración de ejecución
p99_latency_ms = percentil 99 de la duración de ejecución
Objetivo: p99 < 5 minutos
Umbral de alerta: p99 > 4 minutos
```

**Costo:**
```
cost_per_run_cents = total_tokens × cost_per_token
Objetivo: < $1.00 por ejecución
Umbral de alerta: > $0.80 por ejecución
```

**Específico del agente:**
```
Para cada agente :
├─ call_count (total de llamadas realizadas)
├─ success_rate (% exitosas)
├─ avg_latency_ms
├─ p99_latency_ms
├─ avg_tokens
└─ cost_cents
```

### Reglas de Alerta

```json
{
  "alerts": [
    {
      "name": "success_rate_low",
      "condition": "success_rate < 95%",
      "severity": "page",
      "window": "5 minutes"
    },
    {
      "name": "latency_spike",
      "condition": "p99_latency_ms > 4 minutes",
      "severity": "warning",
      "window": "5 minutes"
    },
    {
      "name": "cost_spike",
      "condition": "cost_per_run_cents > 80",
      "severity": "warning",
      "window": "1 hour"
    },
    {
      "name": "agent_timeout",
      "condition": "agent.latency_ms > timeout_ms × 0.9",
      "severity": "warning",
      "window": "5 minutes"
    },
    {
      "name": "error_budget_depleted",
      "condition": "error_budget_remaining < 0.1%",
      "severity": "critical",
      "window": "1 day"
    }
  ]
}
```

---

## Respuesta a Incidentes

### Definiciones de Severidad de Incidentes

**SEV1 : Interrupción Completa**
- Tasa de éxito < 90% O latencia > 10 minutos
- Impacto: Los usuarios no pueden completar flujos de trabajo
- Tiempo de respuesta: < 5 minutos
- Escalada: Alerte a todos los ingenieros en guardia

**SEV2 : Degradación Significativa**
- Tasa de éxito 90-95% O latencia > 5 minutos
- Impacto: Algunos usuarios afectados, funcionalidad parcial
- Tiempo de respuesta: < 15 minutos
- Escalada: Alerte al ingeniero en guardia

**SEV3 : Problemas Menores**
- Tasa de éxito > 95% Y latencia < 5 minutos
- Pico de costo (> 50% por encima de la línea de base)
- Impacto: Menor, hay una solución alternativa disponible
- Tiempo de respuesta: < 1 hora
- Escalada: Registre en Slack, maneje durante horas de oficina

### Runbook: Respuesta SEV1

```
1. DECLARAR INCIDENTE (1 min)
   └─ Alerte al ingeniero en guardia
   └─ Cree un hilo #incidents
   └─ Asigne un comandante de incidente (IC)

2. EVALUAR IMPACTO (5 min)
   └─ ¿Qué flujos de trabajo fallan? (% afectados)
   └─ ¿Qué agentes fallan?
   └─ ¿Cuánto tiempo lleva pasando?
   └─ ¿Impacto en ingresos?

3. INVESTIGAR (5-15 min)
   ├─ Verificar registros de agentes (llamadas recientes)
   ├─ Verificar estado de la pizarra (¿coherente?)
   ├─ Verificar infraestructura (disponibilidad, latencia)
   ├─ Verificar dependencias (APIs que llamamos)
   └─ Verificar disponibilidad del modelo (¿está disponible la API de Anthropic?)

4. MITIGAR (5-30 min, elige el más rápido)
   ├─ Opción A: Deshabilitar bandera de función (instantáneo)
   ├─ Opción B: Revertir agente (reversión desde main)
   ├─ Opción C: Escalar recursos (si es problema de capacidad)
   └─ Opción D: Corrección rápida (si es corrección de código simple)

5. VERIFICAR RECUPERACIÓN (5 min)
   ├─ Monitorear métricas durante 30 minutos
   ├─ Cuando success_rate > 99%, declarar recuperado
   └─ Si aún falla, volver a INVESTIGAR

6. COMUNICAR
   ├─ Actualizaciones internas cada 30 minutos
   └─ Actualización de página de estado para clientes
```

### Causas Comunes y Correcciones

**Tiempo de espera del agente (agente único lento) :**
```
Causa raíz: Aviso del sistema demasiado detallado, o modelo lento
Corrección:
  1. Verificar configuración de modelo/temperatura
  2. Recortar aviso del sistema (eliminar preámbulo detallado)
  3. Reducir tamaño de entrada (menos tokens de contexto)
  4. Disminuir umbral de tiempo de espera y fallar rápido
```

**Incoherencia de estado (pizarra corrupta) :**
```
Causa raíz: Conflicto de escritura concurrente no detectado
Corrección:
  1. Leer última instantánea de pizarra coherente
  2. Reversión a versión conocida como buena
  3. Reproducir tareas pendientes desde instantánea
  4. Investigar lógica de detección de conflictos
```

**Pico de costo (tokens excedieron presupuesto) :**
```
Causa raíz: Entradas más largas, tormentas de reintentos o cambio de modelo
Corrección:
  1. Añadir límite de tamaño de entrada (contexto de truncado)
  2. Añadir aplicación de presupuesto de tokens (fallar rápido si > 80%)
  3. Cambiar a modelo más barato (Haiku en lugar de Opus)
  4. Implementar almacenamiento en caché (reutilizar resultados para las mismas entradas)
```

**Interbloqueo de orquestación (agentes esperando indefinidamente) :**
```
Causa raíz: Dependencia circular o agente que no progresa
Corrección:
  1. Verificar DAG de orquestación para ciclos
  2. Verificar registros de agentes (¿está bloqueado o solo lento?)
  3. Forzar tiempo de espera y escalar
  4. Revisar gráfico de dependencias y eliminar ciclos
```

---

## Estrategia de Despliegue

### Despliegue Canario

```
Fase 1: Desplegar en canario (5% de tráfico)
├─ Monitorear tasa de éxito, latencia, costos
├─ Objetivo: 1 hora
└─ Si métricas estables → pasar a fase 2

Fase 2: Desplegar al 25% de tráfico
├─ Monitorear durante 1 hora
└─ Si métricas estables → pasar a fase 3

Fase 3: Desplegar al 100% de tráfico
├─ Monitorear durante 4 horas
└─ Si métricas estables → marcar como GA
```

### Plan de Reversión

```
Si las métricas se degradan durante canario:
├─ Revertir a versión anterior de agente
├─ Revertir a configuración anterior de orquestación
└─ Si reversión tiene éxito, declarar seguro

Mantener últimas 5 versiones de agentes en producción (listas para reversión).
```

---

## Optimización de Costos

### Selección de Modelo por Agente

| Tipo de Agente | Propósito | Modelo Recomendado | Razón |
|-----------|---------|-------------------|--------|
| Clasificador | Etiquetar o categorizar entrada | Haiku | Rápido, económico, razonamiento bajo |
| Resumidor | Condensar texto | Sonnet | Velocidad/calidad equilibrada |
| Razonador | Análisis complejo | Opus | Razonamiento, síntesis |
| Recuperador | Búsqueda/búsqueda | Haiku | Razonamiento bajo |

### Estrategias de Reducción de Tokens

1. **Contexto de truncado:** Pasar solo los últimos N tokens (no historial completo)
2. **Historial resumido:** En lugar de contexto completo, pasar resumen + últimos 3 turnos
3. **Resultados de caché:** Reutilizar salidas de agentes para entradas idénticas
4. **Procesamiento por lotes:** Procesar múltiples solicitudes juntas (amortizar gastos generales)

### Ejemplo: Optimización de Costos

```
Antes:
├─ Promedio de tokens por ejecución: 12,000
├─ Costo por ejecución: $1.20
├─ Costo para 10,000 ejecuciones/mes: $12,000

Optimizaciones:
├─ Cambiar investigador Opus a Sonnet: -30% tokens
├─ Implementar caché (80% tasa de acierto de caché): -80% llamadas
├─ Truncar contexto a máx 500 tokens: -50% tokens

Después:
├─ Promedio de tokens por ejecución: 2,400 (80% ahorrado en 80% de llamadas)
├─ Costo por ejecución: $0.24
├─ Costo para 10,000 ejecuciones/mes: $2,400
└─ Ahorros: $9,600/mes (reducción de costos del 80%)
```

---

## Cumplimiento y Gobernanza

### Registro de Auditoría

Todas las decisiones de agentes y mutaciones de estado deben registrarse:

```json
{
  "timestamp": "2026-06-15T14:20:00Z",
  "request_id": "req_abc123",
  "agent": "decision_agent",
  "action": "approve_order",
  "input": {"order_id": "o_789", "amount": 299.99},
  "output": {"approved": true, "reason": "..."},
  "model": "claude-opus-4-20250514",
  "tokens_used": 450,
  "cost_cents": 12
}
```

Ubicación: `.claude/audit-log.jsonl` (solo añadir, hash a prueba de manipulación).

### Privacidad de Datos

- [ ] Los avisos de agentes no incluyen PII sin enmascaramiento
- [ ] Las salidas de agentes no filtran datos de usuarios
- [ ] El historial de conversación está cifrado en reposo
- [ ] Registros de acceso para quién consultó qué y cuándo
- [ ] Política de retención (eliminar rastros antiguos después de 90 días)

### Restricciones de Seguridad

- [ ] La salida del agente se valida contra defensas de seguridad
- [ ] Las acciones peligrosas (eliminar, modificar) requieren aprobación explícita
- [ ] Se detectan y registran intentos de jailbreak
- [ ] La limitación de velocidad previene abuso (máx N solicitudes por usuario por hora)

---

## Operaciones a Largo Plazo

### Mejora Continua

1. **Revisiones semanales:**
   - Verificar tendencias de tasa de error, latencia, costos
   - Revisar los 10 principales errores y fallos
   - Planificar optimizaciones para la próxima semana

2. **Revisiones mensuales:**
   - Analizar tasa de quemado de presupuesto de error
   - Revisar rendimiento del agente (¿qué agente contribuye más a latencia/costo?)
   - Planificar mejoras arquitectónicas

3. **Revisiones trimestrales:**
   - Comparar métricas con objetivos de SLO
   - Planificar actualizaciones de modelo (nuevas versiones de Claude)
   - Evaluar nuevos agentes o flujos de trabajo

### Actualizaciones de Runbook

Después de cada incidente SEV1 o SEV2:
1. Documentar causa raíz en RCA
2. Actualizar runbook con pasos de prevención/recuperación
3. Capacitar al equipo sobre nuevos procedimientos
4. Añadir caso de prueba de regresión

---
