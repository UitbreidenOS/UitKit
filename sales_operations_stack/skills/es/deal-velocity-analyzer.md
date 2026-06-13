Now I'll provide the Spanish translation of the deal-velocity-analyzer skill file:

```markdown
---
name: deal-velocity-analyzer
description: Analiza el tiempo de progresión de acuerdos por etapa, tendencias de ciclo de tiempo, identificación de cuellos de botella y patrones de ganado/perdido por etapa. Compara con bases históricas y estándares de la industria.
allowed-tools: Read, Write
effort: medium
---

## Cuándo activar

Semanalmente o mensualmente, o bajo demanda para investigar retrasos en el ciclo de tiempo. Requiere historial de acuerdos con marcas de tiempo de cambio de etapa.

## Cuándo NO usar

No para asesoramiento de acuerdos individuales (usar deal-risk-analyzer). No para precisión de pronósticos (usar forecast-builder). No para desempeño de representantes (usar quota-tracker).

## Marco de Análisis de Ciclo de Tiempo

**Tiempo promedio en etapa** = (Hoy - fecha de entrada en última etapa) para todos los acuerdos en etapa, promediado.

**Benchmarking:**
- Enterprise: Negociación 45+ días esperados; Propuesta 30–45 días.
- Mid-Market: Negociación 20–30 días; Propuesta 15–25 días.
- Commercial: Negociación 10–15 días; Propuesta 5–10 días.

**Identificación de cuellos de botella:**
- Cualquier etapa donde el tiempo promedio >30% por encima del benchmark = cuello de botella.
- Analizar: aprobación de stakeholder faltante, evaluación técnica, revisión legal, confirmación de presupuesto.

## Plantilla de Salida

```markdown
# Análisis de Velocidad de Acuerdos — {Fecha}

**Período de Análisis:** {Rango de fechas}

---

## Desglose de Tiempo en Etapa

| Etapa | Cantidad | Días Promedio | Benchmark | Varianza | Estado |
|---|---|---|---|---|---|
| Prospección | {N} | {D} | {D} | {+/-D} | {Color} |
| Negociación | {N} | {D} | {D} | {+/-D} | {Color} |

---

## Análisis de Cuellos de Botella y Acciones Recomendadas

**Etapa:** {Nombre}  
**Varianza:** +{%} vs. benchmark  
**Causas raíz:** [Lista]  
**Acciones:** [Lista con propietarios y fechas límite]

---

## Tendencia de Ciclo de Tiempo

Actual: {D} días vs. benchmark: {D} días | Tendencia: {+/- %}  
Estado: {Verde/Amarillo/Rojo}
```
