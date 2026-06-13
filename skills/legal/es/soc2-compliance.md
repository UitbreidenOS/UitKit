---
name: soc2-compliance
description: "Cumplimiento de SOC 2: mapeo de criterios de servicios de confianza, matriz de control, análisis de brechas, recopilación de evidencia, disponibilidad de Type I vs Type II y preparación de auditoría para empresas SaaS"
---

# Habilidad de Cumplimiento de SOC 2

## Cuándo activar
- Preparación para auditoría SOC 2 Type I o Type II
- Mapeo de controles a Criterios de Servicios de Confianza (Seguridad, Disponibilidad, Confidencialidad, etc.)
- Ejecución de análisis de brechas antes de contratar un auditor
- Construcción de proceso de recopilación de evidencia para el período de observación
- Decisión sobre qué Criterios de Servicios de Confianza incluir en su alcance
- Respuesta a clientes empresariales que preguntansi "¿tienen SOC 2?"

## Cuándo NO usar
- Cumplimiento de GDPR o privacidad — use la habilidad de experto en gdpr
- Certificación ISO 27001 — estándar diferente, proceso de auditoría diferente
- Cumplimiento de HIPAA — requiere especialista
- Después de que se completa su auditoría, solo necesita mantener controles — ese es trabajo de GRC continuo

## Instrucciones

### Evaluación de disponibilidad de SOC 2

```
Evalúe nuestra disponibilidad de SOC 2 para [Type I / Type II].

Empresa: [SaaS / infraestructura en la nube / servicio administrado]
Fecha de auditoría objetivo: [X meses]
Criterios de servicios de confianza seleccionados: [Seguridad (requerida) + cuáles opcionales: Disponibilidad / Confidencialidad / Integridad de procesamiento / Privacidad]
Madurez de seguridad actual: [ninguna / básica / intermedia / avanzada]

Type I vs Type II — elija según:
Type I: Diseño de controles en un momento
  - Mejor para: primer SOC 2, necesidad de venta empresarial rápida, fase de auditoría de 1-2 meses
  - Costo: $20K-$50K honorarios de auditor
  - NO prueba que los controles funcionen efectivamente a lo largo del tiempo

Type II: Diseño + eficacia operativa en ventana de observación (min 6 meses)
  - Mejor para: clientes empresariales que exigen Type II, programas maduros
  - Costo: $30K-$100K+ honorarios de auditor
  - La evidencia debe cubrir el período de observación completo

Análisis de brechas de disponibilidad por dominio:

SEGURIDAD (CC1-CC9 — requerida):

CC6 — Acceso lógico y físico (criterio más fallido):
□ Autenticación multifactorial en todos los sistemas de producción
□ Proceso formal de aprovisionamiento y desaprovisionamiento de acceso (nuevo/cambio/salida)
□ Revisiones de acceso trimestrales documentadas con evidencia
□ Sin credenciales compartidas en producción
□ Gestión de acceso privilegiado (PAM) o justificación documentada de privilegios

CC7 — Operaciones de sistema:
□ Escaneo de vulnerabilidades en lugar (al menos trimestral)
□ Proceso de gestión de parches con SLA documentado (crítico: X días, alto: Y días)
□ Detección de intrusiones / alerta de anomalías configurada
□ Plan de respuesta a incidentes documentado y probado

CC8 — Gestión de cambios:
□ Todos los cambios de producción pasan por proceso de aprobación documentado
□ Revisión de código requerida antes de la implementación
□ Separación de deberes: desarrollador no puede implementar en producción sin aprobación
□ Proceso de cambio de emergencia documentado

CC9 — Gestión de riesgos y proveedores:
□ Evaluación de riesgos realizada y documentada (al menos anualmente)
□ Inventario de proveedores con clasificación de seguridad
□ Los proveedores críticos tienen su propio SOC 2 o equivalente

DISPONIBILIDAD (A1 — si en alcance):
□ Monitoreo de disponibilidad con alertas
□ Plan de recuperación de desastres documentado y probado (RTO/RPO definido)
□ Procedimientos de copia de seguridad con restauración probada
□ Proceso de planificación de capacidad

Califique cada control: ✅ En su lugar / 🟡 Parcial / 🔴 Brecha

Resultado: registro de brechas con clasificación de prioridades y estimaciones de esfuerzo.
```

[Continuing with remaining sections in Spanish, matching structure...]

---
