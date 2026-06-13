# Aplicación del Presupuesto de Error

Flujo de trabajo SRE de presupuesto de error — rastrea el consumo de presupuesto contra ventanas de SLO e implementa congelación de funciones y requisitos post-mortem cuando se cruzan umbrales.

---

## Cuándo usar

- Equipos con SLOs definidos que necesitan implementación automatizada más allá de monitoreo manual
- Servicios donde los deployments continúan sin control incluso cuando la confiabilidad se degrada
- Revisiones post-incidente donde "no sabíamos que el presupuesto estaba agotado" es un tema recurrente
- Plataformas que despliegan múltiples veces por día donde las verificaciones manuales de presupuesto son impracticas

---

## Fases / Pasos

### Fórmula de Presupuesto de Error

```
presupuesto_error_restante = (1 - objetivo_slo) × segundos_ventana - segundos_error_observados
tasa_consumo = tasa_error_actual / tasa_error_agota_presupuesto_en_ventana
```

Para un SLO de 99,9% en una ventana de 30 días:
- Presupuesto de error permitido = 0,1% × 2.592.000s = **2.592 segundos** (~43 minutos)
- Si la tasa de error actual es 1%: tasa_consumo = 1% / 0,1% = **10×** (agotará presupuesto en 3 días, no 30)

**Interpretación de tasa de consumo:**

| Tasa de consumo | Tiempo de agotamiento (presupuesto de 30d) | Urgencia |
|-----------|------------------------------|---------|
| 1× | 30 días | Normal |
| 2× | 15 días | Vigilancia |
| 6× | 5 días | Alerta |
| 14,4× | ~2 días | Página |
| 36× | 20 horas | Inmediato |

---

### Alertas de Tasa de Consumo Multi-Ventana

Las tasas de consumo de ventana única producen falsos positivos (picos cortos) o falsos negativos (fugas lentas). Usa confirmación de dos ventanas:

**Consumo rápido — pagina inmediatamente:**
```
tasa_consumo(1h) > 14,4 AND tasa_consumo(6h) > 6
```
Significado: quemar >2% del presupuesto mensual en 1 hora, confirmado en 6 horas. Este es un incidente en producción.

**Consumo lento — crear ticket:**
```
tasa_consumo(72h) > 3 AND tasa_consumo(24h) > 3
```
Significado: quemar >10% del presupuesto mensual en 3 días, confirmado en 1 día. Necesita investigación antes del próximo deploy.

**Justificación de dos ventanas:** la ventana corta captura picos rápidos; la ventana larga filtra ruido transitorio. Ambos deben ser verdaderos para desencadenar — eliminando la mayoría de falsas alertas de anomalías breves.

---

### Ejemplos PromQL

**Presupuesto de error restante (ratio, ventana de 30d):**
```promql
(
  1 - (
    sum(increase(http_requests_total{status=~"5.."}[30d]))
    /
    sum(increase(http_requests_total[30d]))
  )
) / (1 - 0.999)
```
Devuelve 1,0 cuando presupuesto completo resta, 0,0 cuando agotado, negativo cuando excedido.

**Tasa de consumo en una ventana:**
```promql
# 1h tasa de consumo
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
  /
  sum(rate(http_requests_total[1h]))
) / (1 - 0.999)

# Reemplaza [1h] con [6h], [24h], [72h] para otras ventanas
```

**Regla de alerta de consumo rápido:**
```yaml
- alert: ErrorBudgetFastBurn
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[1h]))
      / sum(rate(http_requests_total[1h]))
    ) / (1 - 0.999) > 14.4
    and
    (
      sum(rate(http_requests_total{status=~"5.."}[6h]))
      / sum(rate(http_requests_total[6h]))
    ) / (1 - 0.999) > 6
  for: 2m
  labels:
    severity: page
  annotations:
    summary: "Consumo rápido de presupuesto de error — {{ $value }}× tasa de consumo"
```

**Regla de alerta de consumo lento:**
```yaml
- alert: ErrorBudgetSlowBurn
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[24h]))
      / sum(rate(http_requests_total[24h]))
    ) / (1 - 0.999) > 3
    and
    (
      sum(rate(http_requests_total{status=~"5.."}[72h]))
      / sum(rate(http_requests_total[72h]))
    ) / (1 - 0.999) > 3
  for: 15m
  labels:
    severity: ticket
  annotations:
    summary: "Consumo lento de presupuesto de error — {{ $value }}× tasa de consumo"
```

---

### Aplicación de Política de Presupuesto

| Presupuesto consumido | Política |
|-----------------|--------|
| < 50% | Sin restricciones |
| 50–100% | Congelar merges no críticos; se requiere aprobación de SRE en deploys |
| > 100% | Congelación dura en todo trabajo de características; se requiere post-mortem antes de descongelación |

**Definición de congelación:**
- Merges no críticos: cualquier PR no etiquetado `severity:critical` o `type:hotfix`
- Congelación dura: no merges en rama de producción independientemente de etiqueta — solo reverts permitidos
- Condiciones de descongelación: post-mortem publicado, acciones correctivas rastreadas, presupuesto restaurado por encima de 20%

---

### Flujo de Trabajo de Claude Code

Un agente cron semanal lee métricas de Prometheus, calcula tasas de consumo, publica informe de presupuesto en Slack, y abre ticket de congelación cuando se cruzan umbrales.

**Entrada de hook en `.claude/settings.json`:**
```json
{
  "hooks": {
    "schedule": [
      {
        "cron": "0 9 * * MON",
        "command": "claude -p 'Ejecuta el flujo de trabajo de presupuesto de error: obtén métricas, calcula tasas de consumo, publica informe Slack, crea ticket de congelación si >50% consumido.'",
        "description": "Informe de presupuesto de error semanal"
      }
    ]
  }
}
```

**Desglose de tareas del agente:**

1. **Obtener métricas** — consultar Prometheus para tasas de error de 1h, 6h, 24h, 72h, 30d
2. **Calcular tasas de consumo** — aplicar fórmula para cada ventana
3. **Determinar estado de política** — comparar consumido% contra umbrales
4. **Publicar informe Slack** — formatear resumen presupuestario con tabla de tasa de consumo y estado de política
5. **Crear ticket de congelación** — si >50% consumido, abrir problema Linear/GitHub con desglose presupuestario e instrucciones de congelación
6. **Registrar en archivo** — añadir resultado a `.claude/error-budget-log.jsonl` para rastreo de tendencias

**Formato de informe Slack:**
```
[Informe de Presupuesto de Error — semana del 2026-05-23]
Servicio: api-gateway  SLO: 99,9%  Ventana: 30d

Presupuesto consumido: 67% ⚠️  CONGELACIÓN ACTIVA
Restante: 855 segundos

Tasas de consumo:
  1h:  2,1×   6h:  1,8×
  24h: 3,4×   72h: 3,1×

Política: Merges no críticos CONGELADOS. Se requiere aprobación de SRE.
Ticket: LIN-2847
```

---

## Ejemplo

**Escenario:** API gateway se degrada después de un deploy de config fallido en el día 8 de una ventana de 30 días.

**Cronología:**

| Hora | Evento | Presupuesto consumido |
|------|-------|-----------------|
| Día 1–7 | Operación normal, tasa de error de 0,05% | 12% |
| Día 8, 14:00 | Deploy de config aumenta tasa de error a 2% | — |
| Día 8, 15:00 | 1h tasa de consumo = 20×; 6h tasa de consumo = 8× | — |
| Día 8, 15:02 | Alerta FastBurn dispara → página on-call | — |
| Día 8, 17:30 | Config retrocedida, tasa de error vuelve a 0,05% | 71% consumido |
| Día 8, 18:00 | Agente Claude lee métricas, publica informe Slack | — |
| Día 8, 18:00 | Presupuesto >50% → ticket de congelación abierto (LIN-2847) | — |
| Día 9 | SRE revisa. Consumo lento se despeja. Congelación levantada después de aprobación | — |
| Día 9 | Post-mortem programado (no requerido — presupuesto no >100%) | — |

**Sin este flujo de trabajo:** los ingenieros continuarían fusionando trabajo de características sin saber que el 71% del presupuesto de confiabilidad del mes fue consumido en una tarde.

---
