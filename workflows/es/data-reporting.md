# Flujo de Trabajo de Informes de Datos

Un proceso repetible para que los analistas de datos pasen de métricas brutas a informes publicados para partes interesadas — cadencias semanales y mensuales — utilizando las habilidades de Claude Code en cada paso.

---

## Resumen

Este flujo de trabajo cubre dos cadencias de informes:
- **Informe semanal:** proceso de 45 minutos desde la extracción de datos hasta la distribución
- **Informe mensual:** proceso de 2 horas desde la extracción de datos hasta el informe listo para ejecutivos

Ambos siguen la misma estructura: datos → verificación de calidad → análisis → narrativa → revisión → publicación.

---

## Flujo de Trabajo de Informes Semanales (todos los lunes por la mañana)

**Tiempo objetivo:** 45 minutos en total

---

### Paso 1: Extraer los datos de la semana anterior (10 minutos)

Ejecute su extracción estándar de datos desde su herramienta BI o almacén de datos.

Métricas requeridas para la mayoría de los informes semanales de negocio:
```sql
-- Plantilla: Extracción de métricas semanales
-- Ejecutar cada lunes para la semana anterior (lun-dom)

WITH week_current AS (
    SELECT
        DATE_TRUNC('week', created_at) AS week,
        COUNT(DISTINCT user_id) AS weekly_active_users,
        SUM(revenue) AS revenue,
        COUNT(DISTINCT order_id) AS transactions,
        SUM(revenue) / COUNT(DISTINCT order_id) AS avg_order_value
    FROM events
    WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '7 days')
      AND created_at <  DATE_TRUNC('week', CURRENT_DATE)
    GROUP BY 1
),
week_prior AS (
    -- Misma consulta para la semana anterior
    SELECT ... FROM events WHERE ...
)
SELECT
    c.*,
    ROUND(100.0 * (c.revenue - p.revenue) / NULLIF(p.revenue, 0), 2) AS revenue_wow_pct,
    ROUND(100.0 * (c.weekly_active_users - p.weekly_active_users) / NULLIF(p.weekly_active_users, 0), 2) AS wau_wow_pct
FROM week_current c
CROSS JOIN week_prior p;
```

Guarde los resultados en una fila de hoja de cálculo o en la tabla de métricas de su pipeline.

---

### Paso 2: Verificar la calidad de los datos (5 minutos)

Antes de escribir una sola palabra, verifique que los números sean reales:

```
/data-quality-checker

Verificación rápida de cordura en las métricas de esta semana antes de escribir el informe.

Esta semana vs. la semana pasada:
- WAU: [X] vs [X] ([+/-X%])
- Ingresos: $[X] vs $[X] ([+/-X%])
- [Otras métricas]

Señales de alerta a verificar:
- Cualquier métrica que se mueva más de un 25% de semana en semana de forma inesperada
- ¿El cálculo de ingresos es correcto? (transacciones × valor promedio de pedido ≈ ingresos totales)
- ¿Algo que no supere la prueba de "¿tiene esto sentido"?

Contexto: [cualquier evento conocido — interrupción, campaña, festivo, cambio en el pipeline de datos]
```

Si los datos son correctos, continúe. Si algo parece incorrecto, investigue antes de escribir.

---

### Paso 3: Recopilar contexto (5 minutos)

Los datos le dicen qué ocurrió. Necesita saber por qué. Antes de escribir:

- Revise Slack para ver anuncios de producto, marketing o ingeniería de la semana pasada
- Anote cualquier lanzamiento de producto (consulte las notas de versión o Jira)
- Anote cualquier campaña de marketing o promoción que se haya ejecutado
- Anote cualquier incidente o interrupción
- Compruebe si hubo un efecto estacional conocido

Este contexto es la diferencia entre "los ingresos cayeron un 8%" (inútil) y "los ingresos cayeron un 8% durante la primera semana después de que terminó la campaña del T3 — reversión esperada, ahora de vuelta a la tendencia de referencia" (útil).

---

### Paso 4: Escribir el informe semanal (15 minutos)

```
/stakeholder-report

Escribir el informe de datos semanal para [nombre del equipo].

SEMANA DEL: [rango de fechas]
AUDIENCIA: [equipo de liderazgo / jefes de departamento]

MÉTRICAS (pegue sus datos con cambios semana a semana y vs-objetivo si aplica):
- WAU: [X] ([+/-X%] WoW, objetivo [X])
- Ingresos: $[X] ([+/-X%] WoW, objetivo $[X])
- Tasa de conversión: [X]% ([+/-X] pp WoW)
- [Otras métricas]

EVENTOS ESTA SEMANA:
- [Evento 1 — p. ej., nuevo flujo de incorporación lanzado el martes]
- [Evento 2]

LO QUE SÉ SOBRE LOS MOVIMIENTOS:
- [La caída de ingresos probablemente se debe al fin de la campaña]
- [El aumento de WAU impulsado por la nueva cohorte de usuarios de [fuente]]
- [Cambio en la tasa de conversión sin explicación — requiere investigación]

Generar: resumen del titular, logros, preocupaciones, anomalías, acciones recomendadas, lista de seguimiento para la próxima semana.
```

---

### Paso 5: Revisar y verificar datos (5 minutos)

Antes de publicar:

```
/stakeholder-report

Revisar este borrador de informe semanal para garantizar su calidad.

[Pegue su borrador]

Verificar:
- ¿Está cada afirmación cuantificada? (sin "significativamente" sin un número)
- ¿Están equilibrados los logros y las preocupaciones?
- ¿La acción recomendada es específica y tiene un responsable?
- ¿Hay algo formulado como causal que en realidad solo es correlacional?
- ¿Entendería esto alguien que no conoce nuestro negocio?
```

Corrija cualquier problema que señale Claude.

---

### Paso 6: Distribuir (5 minutos)

- Enviar por correo electrónico a su lista de distribución, O
- Publicar en Slack (#data-updates o equivalente), O
- Actualizar el documento compartido en Notion/Confluence

Incluya una línea de "¿Preguntas?" — quiere que las partes interesadas participen, no solo que lean y archiven.

---

## Flujo de Trabajo de Informes Mensuales (primer lunes de cada mes)

**Tiempo objetivo:** 2 horas en total

---

### Paso 1: Extraer datos mensuales (20 minutos)

Los informes mensuales necesitan mayor profundidad que los semanales. Extraiga:
- Métricas del mes completo con comparaciones mes a mes (MoM) y año a año (YoY)
- Comparación con plan/presupuesto (si tiene objetivos)
- Desgloses por segmento (por línea de producto, geografía, canal)
- Datos de cohortes (¿cómo retuvieron este mes los nuevos usuarios del mes pasado?)
- Indicadores adelantados para el próximo mes

```sql
-- Plantilla de métricas mensuales
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', created_at) AS month,
        [sus métricas clave]
    FROM [sus tablas]
    GROUP BY 1
),
with_changes AS (
    SELECT
        month,
        [metric],
        LAG([metric]) OVER (ORDER BY month) AS prior_month,
        [metric] - LAG([metric]) OVER (ORDER BY month) AS mom_change,
        ROUND(100.0 * ([metric] - LAG([metric]) OVER (ORDER BY month))
              / NULLIF(LAG([metric]) OVER (ORDER BY month), 0), 2) AS mom_pct_change
    FROM monthly
)
SELECT * FROM with_changes ORDER BY month DESC LIMIT 3;
```

---

### Paso 2: Auditoría completa de calidad de datos (20 minutos)

Cadencia mensual = auditoría mensual. Ejecute el script de auditoría completo:

```
/data-quality-checker

Auditoría mensual de calidad de datos para [mes actual].

Ejecutar una auditoría completa en estas tablas de producción:
- [table_1]: clave primaria [col], métricas clave [cols]
- [table_2]: [igual]
- [table_3]: [igual]

Generar el script de auditoría de Python. Lo ejecutaré y pegaré los resultados de vuelta.
```

Ejecute el script generado. Pegue los resultados de vuelta a Claude. Obtenga el informe de salud de datos y el SQL de corrección.

**Regla:** No publique un informe mensual si hay problemas CRÍTICOS de calidad de datos. Primero corríjalos.

---

### Paso 3: Análisis de causa raíz — logros (20 minutos)

Para cada métrica que superó el plan en más del 10%:

```
/stakeholder-report

Escribir un análisis de causa raíz para [métrica] que superó el rendimiento en [X%] este mes.

Rendimiento: [métrica] fue [X] vs. plan [X] — [X]% por encima del plan.
Desglose por segmento: [¿cómo se desglosa por segmentos clave?]
Cronología: [¿cuándo comenzó el sobrerendimiento?]
Eventos correlacionados: [lanzamiento de producto, campaña, cambio de precios, etc.]

Hipótesis:
1. [causa más probable]
2. [segunda hipótesis]
3. [tercera hipótesis]

¿Qué hipótesis está mejor respaldada por los datos? ¿Cuál es la repetibilidad — es esto un evento único o una mejora sostenible?
```

---

### Paso 4: Análisis de causa raíz — fallos (20 minutos)

Para cada métrica que no alcanzó el plan en más del 10%:

```
/stakeholder-report

Escribir un análisis de causa raíz para [métrica] que tuvo un rendimiento inferior en [X%] este mes.

[Mismo formato que el anterior, pero para el fallo]

Además: ¿Cuál es el plan para corregir el rumbo? ¿Quién es el responsable? ¿Cuál es el impacto esperado y el cronograma?
```

---

### Paso 5: Escribir el informe mensual completo (30 minutos)

```
/stakeholder-report

Escribir el informe de datos mensual para [audiencia].

MES: [Mes Año]

RESUMEN EJECUTIVO: [Una oración sobre el mes — honesta]

TABLA COMPLETA DE MÉTRICAS:
[Métrica] | [Este Mes] | [Mes Pasado] | [MoM%] | [Año Pasado] | [YoY%] | [vs. Plan]
[pegar todas las filas]

CAUSA RAÍZ — LOGROS:
[Su análisis del Paso 3]

CAUSA RAÍZ — FALLOS:
[Su análisis del Paso 4]

PERSPECTIVAS DE COHORTE/SEGMENTO:
[Pegue cualquier análisis de cohorte o segmento]

ACTUALIZACIÓN DE PREVISIÓN:
[Previsión actualizada trimestral/anual si la tiene]

ACCIONES Y RESPONSABLES:
[Lista de acciones, responsables, fechas límite]

Generar el informe mensual completo en formato narrativo. Incluir una tabla de métricas. Terminar con una tabla de acciones. Objetivo total: máximo 1.000 palabras.
```

---

### Paso 6: Versión en diapositivas (si es necesario — 20 minutos)

Si el informe mensual se presenta en una reunión de directivos o del consejo como diapositivas:

```
/stakeholder-report

Convertir este informe mensual en un esquema de presentación ejecutiva de 5 diapositivas.

[Pegue su informe mensual]

Estructura de diapositivas:
1. TITULAR: [única métrica o veredicto de una oración]
2. CUADRO DE MANDO: [tabla de métricas clave vs. plan]
3. QUÉ IMPULSÓ EL RENDIMIENTO: [logros y fallos, con causa raíz]
4. ACCIONES Y RESPONSABLES: [tabla]
5. PERSPECTIVA FUTURA: [elementos clave de seguimiento del próximo mes, cualquier cambio en la previsión]

Para cada diapositiva: título, 3-5 puntos clave o datos, puntos de conversación para el presentador.
```

---

### Paso 7: Revisar y publicar (10 minutos)

```
/stakeholder-report

Revisión final de este informe mensual antes de la publicación.

[Pegue el informe completo]

Verificar:
[ ] Cada métrica tiene una comparación (sin números huérfanos sin contexto)
[ ] Cada fallo tiene una causa y un plan
[ ] Las acciones tienen responsables y fechas límite
[ ] Sin jerga que el CEO no entendería
[ ] Sin maquillaje — ¿es honesto sobre lo que salió mal?
[ ] Referencias de fechas coherentes en todo el documento
```

Distribuya por correo electrónico, Notion, Confluence o documento de reunión general.

---

## Plantillas de informe por audiencia

### Para el CEO (máximo una página)
```
Mes: [nombre]
Estado: [Verde / Amarillo / Rojo]

Las 3 cosas más importantes que necesita saber:
1. [Hallazgo más importante]
2. [Segundo hallazgo]
3. [Tercer hallazgo]

Lo que estamos haciendo con respecto al fallo: [1-2 oraciones]
Elemento principal de seguimiento del próximo mes: [1 oración]
```

### Para el consejo (sección de datos del documento del consejo)
```
[Tabla de rendimiento vs. plan]
[3 puntos clave: qué funcionó, qué no, qué estamos haciendo]
[Previsión revisada si ha cambiado]
```

### Para el equipo (informe completo)
Narrativa mensual completa con todas las secciones — sin abreviaciones.

---

## Ideas de automatización

### Automatización de comparación semana a semana

```python
# Ejecutar cada lunes vía cron o GitHub Actions
import pandas as pd
from datetime import datetime, timedelta

# Extraer métricas (reemplazar con su fuente de datos real)
def pull_weekly_metrics(week_start: datetime) -> dict:
    """Pull metrics for the week starting on week_start."""
    # Your query here
    pass

current_week = pull_weekly_metrics(datetime.now() - timedelta(days=7))
prior_week = pull_weekly_metrics(datetime.now() - timedelta(days=14))

# Format for Claude prompt
metrics_text = "\n".join([
    f"- {k}: {current_week[k]} (WoW: {round(100*(current_week[k]-prior_week[k])/prior_week[k], 1)}%)"
    for k in current_week
])

# Pipe to Claude CLI
import subprocess
prompt = f"Write a weekly report for these metrics:\n{metrics_text}"
result = subprocess.run(['claude', '-p', prompt], capture_output=True, text=True)
print(result.stdout)
```

---
