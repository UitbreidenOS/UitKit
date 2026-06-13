---
name: chaos-engineering
description: "Chaos engineering: diseñe experimentos de inyección de fallas, identifique radio de explosión, defina estado estable, use Chaos Monkey / Gremlin / Litmus — cree resiliencia"
---

# Habilidad Chaos Engineering

## Cuándo activar
- Validar resiliencia del sistema antes del gran lanzamiento
- Probar si los circuit breakers y fallbacks realmente funcionan
- Identificar dependencias desconocidas y puntos únicos de fallo
- Configurar práctica de chaos engineering desde cero
- Diseñar experimento específico de inyección de falla

## Cuándo NO usar
- Sistemas de producción sin observabilidad existente
- Sistemas sin capacidad de reversión
- Entornos regulados sin aprobación explícita
- Como reemplazo de pruebas de carga

## Instrucciones

### Diseño de experimento chaos

```
Diseñe experimento de chaos engineering para [sistema/servicio].

Sistema: [describir arquitectura]
Hipótesis: [qué cree que sucederá si X falla?]
Objetivo: [qué componente romper]
Estado Estable: [cómo mide "el sistema está saludable"?]

Plantilla de experimento chaos:

1. Hipótesis: "Cuando [componente X] falla, [el sistema responderá con Y] porque [tenemos circuit breaker Z]."

2. Definición de estado estable (medir ANTES de inyectar falla):
   - Métrica 1: [ej. latencia p99 API < 200ms]
   - Métrica 2: [ej. tasa de error < 0.1%]
   - Métrica 3: [ej. todos los health checks verdes]

3. Falla a inyectar:
   - Qué: [matar proceso / agregar latencia / perder paquetes / llenar disco]
   - Dónde: [pod específico / host / AZ / dependencia]
   - Radio de explosión: [instancia única / todas en 1 AZ / servicio completo]

4. Período de observación: [5 minutos para empezar]

5. Activador de reversión:
   - Detener si: [métrica X excede umbral Y]
   - Método de reversión: [comando exacto o acción]

6. Análisis:
   - ¿Alcanzó el sistema estado estable nuevamente en [X minutos]?
   - ¿Fueron impactados los usuarios? ¿Por cuánto tiempo?
   - ¿Se disparó la alerta? ¿Era la alerta correcta?

7. Acción si hipótesis fue incorrecta:
   - [reparar la brecha — agregar circuit breaker, mejorar fallback, agregar redundancia]

Diseñe experimento específico para mi sistema.
```

### Escenarios de falla comunes

Fallas de red, recursos, dependencias, Kubernetes-específicas. LitmusChaos, Chaos Mesh, AWS FIS, Gremlin.

### Evaluación de radio de explosión

Análisis de consumidores directos/indirectos, impacto externo, ruta de recuperación, evaluación de riesgo.

### Planificación de game day

Agenda de game day para [equipo], preparación, ejercicios de ejecución, debriefing.

---
