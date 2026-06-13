# /optimize-territory

**Activador:** Ejecutar mensualmente, después de nuevas contrataciones o cambios de cuota. Bajo demanda cuando se sospecha desequilibrio territorial injusto.

**Propósito:** Ejecutar análisis de equilibrio territorial: asignaciones de cuentas, puntuación de equidad de cuota, detección de superposiciones, plan de capacidad de personal y recomendaciones de realineamiento.

**Qué hace:**
1. Carga lista maestra de cuentas: nombre, representante asignado, territorio, potencial de ingresos (ARR)
2. Calcula métricas de equidad: varianza de cuota, varianza de potencial territorial, varianza de conteo de cuentas
3. Identifica superposiciones: cuentas asignadas a múltiples representantes
4. Identifica brechas: cuentas no asignadas, geografías desatendidas, desequilibrios de nivel
5. Analiza riesgo de concentración: % de ingresos territoriales en las 5 cuentas principales
6. Puntúa cada territorio 0–100 en dimensión de equilibrio
7. Genera recomendaciones de rebalanceo con pronósticos de impacto
8. Guarda reporte en `reports/territory-analysis-{YYYY-MM-DD}.md`

**Entradas:** Lista de cuentas con asignaciones de representantes, cuotas y potencial de ingresos

**Salida:** `reports/territory-analysis-{date}.md` — Tarjeta de equidad, brechas/superposiciones, plan de realineamiento con cronograma de implementación

**Propietario:** VP de Ventas + Operaciones de Ventas | **Frecuencia:** Mensual post-contratación + bajo demanda

**Ejemplo:**

```bash
/optimize-territory