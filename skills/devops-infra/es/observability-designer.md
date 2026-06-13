---
name: observability-designer
description: "Estrategia de observabilidad: diseñe los tres pilares (logs, métricas, trazas), instrumente servicios, elija herramientas, defina filosofía de alerta, pase de reactivo a proactivo"
---

# Habilidad Diseñador de Observabilidad

## Cuándo activar
- Diseñar una estrategia de observabilidad desde cero
- Pasar de solo logs a observabilidad completa de tres pilares
- Decidir entre herramientas de observabilidad (Datadog, Grafana, Honeycomb, New Relic)
- Instrumentar un servicio con OpenTelemetry
- Configurar logging estructurado a escala
- Definir en qué alertar (y en qué no)

## Cuándo NO usar
- Diseño de SLO — usar habilidad slo-architect primero
- Escritura de runbook — usar habilidad runbook-generator
- Monitoreo de seguridad (SIEM) — herramientas y modelo de amenaza diferentes
- Análisis empresarial / métricas de producto — usar habilidad analytics-tracking

## Instrucciones

### Diseño de observabilidad de tres pilares

Los tres pilares:
1. LOGS — Qué sucedió (eventos)
2. METRICS — Cuánto / qué tan rápido (agregaciones)
3. TRACES — Por qué sucedió (causalidad)

**Logging estructurado:** Cada línea de log = JSON válido con timestamp, level, service, trace_id, message, campos de contexto.

**Métricas clave:** Counters, Gauges, Histograms. Método USE: Utilisation, Saturation, Errors. Método RED: Rate, Errors, Duration.

**Instrumentación de trazas:** Inbound HTTP, outbound calls, consultas de base de datos, colas de mensajes, APIs externas.

Diseñe estrategia de tres pilares para mi sistema con recomendaciones de herramientas específicas.

### Selección de herramientas

```
Elegir herramientas de observabilidad para [equipo/presupuesto].

Administrado: Datadog (todo-en-uno), Honeycomb (trazas), New Relic (tier gratuito generoso), Grafana Cloud (económico)

Auto-hospedado: Prometheus + Grafana + Loki + Tempo (costos de infraestructura ~$50-200/mes, mejor para presupuesto > $5K/mes)

Recomendación: siempre instrumente con OpenTelemetry — permite cambiar backend sin modificaciones de código.

Recomendación para mis limitaciones: [pila de herramientas + justificación + costo mensual estimado]
```

### Implementación de logging estructurado

```
Implementar logging estructurado para [servicio].

Lenguaje/marco: [Node.js/Express / Python/FastAPI / Go / Java/Spring]
Destino: [CloudWatch / Datadog / Elasticsearch / stdout (para k8s)]

Estándares:
- JSON válido en salida
- Timestamp ISO 8601
- Niveles: DEBUG/INFO/WARN/ERROR
- Contexto: user_id, request_id, duration_ms, error_code
- Correlación: trace_id para vincular logs, métricas y trazas

Implementar logging estructurado con mejores prácticas para mi lenguaje/marco.
```

### Filosofía de alertas

```
Definir filosofía de alertas para [sistema].

Sobre qué alertar:
- Fallos reales afectando usuarios
- Degradación de rendimiento medible (p99 latency, error rate)
- Agotamiento de recursos (disco, memoria, conexiones DB)

No alertar sobre:
- Advertencias de log (poco útil a escala)
- Métricas sin acción (alertas de espectador)
- Umbrales teóricos sin impacto real del usuario

Reglas para buenas alertas:
- Accionable: alerta indica exactamente qué hacer
- Basada en síntomas, no en causas (alertar sobre latencia, no CPU)
- Pocos falsos positivos: on-call cansado = alertas ignoradas

Diseñe conjunto de alertas para mi sistema.
```

---
