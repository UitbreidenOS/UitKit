# /build-forecast

**Disparador:** Ejecutar semanalmente antes de la sincronización de liderazgo, o mensualmente para actualizaciones de la junta. Siempre ejecutar 2+ semanas antes del cierre trimestral.

**Propósito:** Generar pronóstico rodante de 13 meses con 3 escenarios (caso óptimo, compromiso, ventaja). Mostrar tendencias y varianza vs. plan.

**Qué hace:**
1. Obtiene instantánea actual de la tubería (todas las oportunidades abiertas con probabilidad de cierre y valor esperado)
2. Aplica tres umbrales de probabilidad:
   - **Compromiso (60%):** Solo oportunidades >50% de probabilidad → Estimación conservadora
   - **Caso Óptimo (90%):** Oportunidades >30% de probabilidad → Ventaja probable
   - **Ventaja:** Oportunidades >10% de probabilidad → Escenario de esfuerzo
3. Segmenta por mes (próximos 13 meses) y representante
4. Calcula varianza vs. objetivos mensuales
5. Compara pronóstico actual vs. semana/mes anterior (tendencias de velocidad)
6. Compara precisión de pronóstico: pronóstico del mes anterior vs. cierre real
7. Identifica brechas de confianza: % del pronóstico <50% de probabilidad, riesgo de concentración
8. Genera resumen de 13 meses + desglose por representante + análisis de varianza
9. Guarda en `reports/forecast-{YYYY-MM-DD}.md`
10. Registra en `session-log.md`

**Entradas:** Tubería actual de CRM con estimaciones de probabilidad de oportunidad

**Salida:** `reports/forecast-{date}.md` — Pronóstico rodante de 13 meses (los 3 escenarios), desgloses mensuales, tendencias de varianza, evaluación de riesgos

**Propietario:** Líder de Finanzas + Liderazgo de Ventas | **Frecuencia:** Semanal + preparación mensual de junta

**Ejemplo:**

```bash
/build-forecast