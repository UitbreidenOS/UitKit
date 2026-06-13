---
name: forecast-builder
description: Genera pronóstico rodante de 13 meses con tres escenarios (caso óptimo, comprometido, optimista). Rastra tendencias de varianza, ingresa tasas de conversión históricas y destaca brechas de confianza.
allowed-tools: Read, Write
effort: high
---

## Cuándo activar

Semanalmente antes de la sincronización con liderazgo, o mensualmente para actualizaciones de junta. Requiere snapshot actual del pipeline e historial de tasas de cierre por etapa y representante.

## Cuándo NO usar

No para planificación estratégica anual (usar proceso de presupuesto anual). No para entrenamiento de transacciones individuales. No sin actualización de datos del pipeline dentro de 24 horas.

## Metodología de Pronóstico

**Tres Escenarios:**
- **Comprometido (60% de confianza):** Pronóstico conservador; transacciones con >50% de probabilidad únicamente. La suma = valor de cierre esperado.
- **Caso Óptimo (90% de confianza):** Todas las transacciones >30% de probabilidad. Límite superior para el optimismo.
- **Optimista:** Todo >10% de probabilidad. Escenario de estiramiento para la mejor ejecución.

**Fórmula por escenario:**
- Para cada transacción abierta: valor estimado × probabilidad de cierre (por umbral de escenario) = valor ponderado
- Sumar en todas las transacciones por etapa y representante
- Comparar con objetivo mensual; calcular varianza

**Tendencias:**
- Comparar pronóstico actual vs. semana anterior (velocidad)
- Comparar vs. pronóstico del año a la fecha (precisión)
- Calcular varianza %: (Pronóstico comprometido - Cierre real del mes anterior) / Cierre real del mes anterior × 100

## Formato de Salida