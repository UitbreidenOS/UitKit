# Claude para Growth Marketers

Todo lo que un Growth Hacker o Performance Marketer necesita para ejecutar experimentos asistidos por IA, optimizar la adquisición de pago, analizar embudos e informar sobre el crecimiento — sin esperar a los equipos de datos o los sprints de ingeniería.

---

## Para quién es esto

Eres un growth marketer, performance marketer o growth hacker responsable de mover métricas: registros, tasas de activación, CAC de pago, tasas de conversión, crecimiento de MRR. Ejecutas experimentos constantemente, vives en hojas de cálculo y dashboards, y siempre estás con falta de tiempo.

**Antes de Claude Code:** 3 horas para escribir un brief de experimento y el cálculo del tamaño de muestra. 2 horas para construir un informe de crecimiento semanal. 45 minutos por documentación de prueba A/B. Análisis manual de embudos a partir de exportaciones de datos sin procesar.

**Después:** Briefs de experimentos en 5 minutos. Narrativa de crecimiento semanal escrita y estructurada en 10 minutos. Cálculos del tamaño de muestra instantáneos. Análisis de embudos estructurado e interpretado a partir de tus números en bruto. Tú te enfocas en las decisiones, Claude maneja la síntesis.

---

## Instalación en 30 segundos

```bash
# Instalar la pila completa para growth marketers
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/analytics-tracking
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy
npx claudient add skill product/experiment-designer
npx claudient add agent advisors/cmo-advisor
npx claudient add agent advisors/cro-advisor
```

---

## Tu pila de Claude Code para growth

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/experiment-tracker` | Redacción de hipótesis, calculadora de tamaño de muestra, análisis de resultados, significancia estadística | Cada prueba A/B — antes, durante y después |
| `/growth-dashboard` | Dashboard AARRR semanal con análisis de tendencias y comentarios | Revisión de métricas del lunes por la mañana |
| `/paid-ads` | Estructura de campañas de Google, Meta, LinkedIn, brief creativo, optimización de ROAS | Cualquier trabajo de canal de pago |
| `/onboarding-cro` | Análisis del embudo de activación, optimización de la secuencia de incorporación | Cuando la tasa de activación es el cuello de botella |
| `/page-cro` | Optimización de la página de destino y la tasa de conversión — texto, maquetación, prueba de CTA | Trabajo de conversión a nivel de página |
| `/analytics-tracking` | Configuración y análisis de embudos de GA4, Mixpanel, Amplitude, PostHog | Instrumentación de análisis |
| `/referral-program` | Mecánicas de referidos, estructura de incentivos, modelado del coeficiente viral | Construir o mejorar los referidos |
| `/pricing-strategy` | Estrategia de página de precios, posicionamiento de planes, pruebas de precios | Experimentos de precios |
| `/experiment-designer` | Diseño de experimentos de extremo a extremo: hipótesis, metodología, métricas de éxito | Experimentos multivariados complejos |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `cmo-advisor` | Opus | Combinación estratégica de canales, asignación de presupuesto, decisiones de estrategia de crecimiento |
| `cro-advisor` | Sonnet | Problemas específicos de tasa de conversión — qué probar y por qué |

---

## Flujo de trabajo diario

### Mañana (30-45 minutos)

**1. Dashboard de crecimiento semanal — solo lunes**
```
/growth-dashboard

Métricas de crecimiento semanales — semana del [FECHA]:

Adquisición:
- Nuevos registros: [N] (vs [N] la semana pasada)
- Gasto de pago: $[X]
- CAC por canal: Google $[X] | Meta $[X] | Orgánico $[X]

Activación:
- Tasa de activación: [X%] (vs [X%] la semana pasada)
- Tiempo hasta el momento aha (mediana): [X días]

Retención:
- Retención de 7 días: [X%]
- Retención de 30 días: [X%]
- DAU/MAU: [X%]

Ingresos:
- MRR: $[X] (+$[X] semana a semana)
- MRR cancelado: $[X]
- LTV:CAC: [X:1]

Experimentos en ejecución:
- [Nombre de la prueba]: Día [X], aumento [+/-X%], significancia [X%]

Escríbeme el dashboard con comentarios, estado de semáforo y acciones recomendadas.
```

**2. Verificación diaria de experimentos — toma 5 minutos**
```
/experiment-tracker

Mis pruebas en vivo:
1. [Nombre de prueba]: control [X%] vs variante [X%], [N] visitantes cada uno, ejecutando [X días]
2. [Nombre de prueba]: control [X] vs variante [X], [N] visitantes cada uno, ejecutando [X días]

Para cada prueba:
- ¿Hemos alcanzado la significancia estadística?
- ¿Estamos en camino de concluir para [fecha objetivo]?
- ¿Hay métricas de guardia que muestren preocupación?
- ¿Debería extender, detener o seguir ejecutando?
```

---

### Mediodía — trabajo de campaña y experimentos

**3. Optimización de adquisición de pago**
```
/paid-ads

Canal: [Google / Meta / LinkedIn]
ROAS actual: [X] (objetivo: [X])
CPA actual: $[X] (objetivo: $[X])
Gasto mensual: $[X]

Problemas de esta semana:
- [Describe qué está teniendo bajo rendimiento y cualquier cambio realizado]

Diagnostica el problema y dame 3 acciones para mejorar el ROAS esta semana.
```

**4. CRO — página de destino o embudo**
```
/page-cro

Página: [URL o describe]
Tasa de conversión actual: [X%]
Fuente de tráfico: [pago / orgánico / correo]
Objetivo: [registro / compra / solicitud de demo]
Puntos de fricción principales que sospecho: [describe]

Audita la página y dame los 3 mejores experimentos a ejecutar clasificados por impacto esperado.
```

---

### Lista de verificación de lanzamiento de experimento

**Antes de lanzar cualquier prueba A/B:**
```
/experiment-tracker

Estoy a punto de lanzar esta prueba. Ejecuta la lista de verificación previa al lanzamiento.

Prueba: [describe el cambio]
Métrica principal: [tasa de conversión / tasa de clics / ingresos por visitante]
Línea de base: [X%]
MDE: [X% mejora relativa que necesito detectar]
Tráfico: [X visitantes por día para esta página/flujo]
Herramienta: [Optimizely / VWO / GrowthBook / LaunchDarkly]

Confirma:
1. Tamaño de muestra requerido (por variante)
2. Duración esperada de la prueba
3. Lista de verificación previa al lanzamiento (seguimiento, exclusión mutua, plan de reversión)
4. Cualquier riesgo que deba conocer
```

---

### Viernes — revisión semanal de experimentos

**5. Revisión del portafolio de experimentos**
```
/experiment-tracker

Revisa mi portafolio de experimentos esta semana.

Pruebas concluidas:
[Nombre de prueba]: control [X%] vs variante [X%], [N] por variante, p-valor [X], ejecutó [X días]
Decisión que tomé: [enviado / eliminado]

Pruebas en ejecución:
[continúa para cada prueba activa]

Backlog (sin iniciar):
1. [Idea 1] — impacto estimado [alto/medio/bajo], esfuerzo [alto/medio/bajo]
2. [Idea 2]

Dame: puntuaciones ICE para el backlog, si mis pruebas concluidas están documentadas correctamente,
y qué debería ejecutar el próximo trimestre.
```

---

## Plan de 30 días (nuevos growth marketers)

### Semana 1 — Medición de referencia
- Instala todas las habilidades mediante los comandos de instalación anteriores
- Conecta tu herramienta de análisis (GA4, Mixpanel, Amplitude o PostHog)
- Ejecuta `/analytics-tracking` para auditar tu seguimiento actual — encuentra qué está roto o falta
- Ejecuta `/growth-dashboard` con datos históricos — establece tus números de referencia
- Mapea tu embudo completo: desde la fuente de tráfico hasta el cliente de pago — cada paso

### Semana 2 — Backlog de hipótesis
- Ejecuta `/experiment-designer` y `/experiment-tracker` para puntuar tu backlog de hipótesis
- Usa la puntuación ICE para clasificar los 5 mejores experimentos a ejecutar este trimestre
- Para cada hipótesis: escribe una hipótesis formal, cálculo del tamaño de muestra y criterios de éxito antes de tocar ningún código
- No lances nada en la semana 2 — comprende primero la línea de base

### Semana 3 — Primeros experimentos
- Lanza tus 2 mejores experimentos del backlog
- Usa `/paid-ads` para auditar la configuración actual de adquisición de pago — encuentra gasto desperdiciado
- Ejecuta una auditoría CRO con `/page-cro` en tu página de conversión de mayor tráfico
- Rastrea: ¿cuánto tiempo lleva escribir un brief de experimento? Rastrea esto semanalmente — debe bajar a menos de 10 minutos para la semana 4

### Semana 4 — Velocidad e informes
- Ejecuta tu primer dashboard de crecimiento semanal completo desde cero
- Establece tu velocidad de experimentación: ¿cuántas pruebas puede ejecutar tu equipo por mes?
- Presenta al liderazgo: ¿cuáles son las 3 principales palancas de crecimiento y qué estás ejecutando contra cada una?
- Identifica tus brechas de análisis — ¿qué no puedes medir que necesitas?

---

## Integraciones de herramientas

### Amplitude / Mixpanel / PostHog

Estas son tus fuentes de datos primarias para cada sesión de Claude. Conéctalas vía MCP para acceso a datos en vivo:

```json
// Para PostHog — agregar a ~/.claude/settings.json
{
  "mcpServers": {
    "posthog": {
      "command": "npx",
      "args": ["-y", "@posthog/mcp-server"],
      "env": {
        "POSTHOG_API_KEY": "your-api-key",
        "POSTHOG_HOST": "https://app.posthog.com"
      }
    }
  }
}
```

Con acceso a análisis en vivo, Claude puede:
- Extraer datos de conversión del embudo por cohorte, segmento o ventana de tiempo
- Consultar recuentos de eventos y propiedades de usuario sin exportar a CSV
- Construir tablas de retención a demanda
- Identificar segmentos con comportamiento anómalo

### Google Ads y Meta Ads

Exporta los datos de rendimiento como CSV → pégalos en `/paid-ads` para análisis.
Para informes automatizados, conecta vía n8n o Make — extrae datos semanales de campaña a una página de Notion, luego ejecuta `/growth-dashboard` contra eso.

### GrowthBook / LaunchDarkly (plataformas de experimentos)

Exporta los resultados de experimentos → pégalos en `/experiment-tracker` para análisis estadístico y soporte en la toma de decisiones.
Claude no toma decisiones de enviar/eliminar — muestra el panorama estadístico y proporciona el marco. Tú tomas la decisión.

### Notion / Confluence (registro de experimentos)

Usa Claude para generar documentación de experimentos → pégala en el registro de experimentos de tu equipo después de cada prueba concluida. La documentación consistente es la cosa más importante que los equipos de growth no hacen.

---

## Métricas a rastrear

| Métrica | Definición | Verde | Amarillo | Rojo |
|---|---|---|---|---|
| Velocidad de experimentación semanal | Pruebas lanzadas por semana | ≥ 2 | 1 | 0 |
| Tasa de éxito | % de experimentos que muestran aumento positivo significativo | 25-35% | 15-25% | < 15% o > 40% |
| Tasa de activación | % de nuevos registros que completan el momento aha | > 40% | 20-40% | < 20% |
| Período de recuperación del CAC | Meses para recuperar el CAC del margen bruto de una cohorte | < 12 mo | 12-18 mo | > 18 mo |
| Ratio LTV:CAC | LTV del cliente dividido por CAC | > 3:1 | 2-3:1 | < 2:1 |
| Retención de ingresos netos | (MRR + expansión - abandono) / MRR inicial | > 100% | 90-100% | < 90% |
| Retención D30 | % de usuarios del Día 0 aún activos en el Día 30 | > 30% | 15-30% | < 15% |

---

## Errores comunes de growth (y cómo Claude Code ayuda a evitarlos)

**Error 1: Lanzar experimentos sin una hipótesis adecuada**
`/experiment-tracker` te obliga a escribir la hipótesis, el MDE y los criterios de éxito antes de tocar la herramienta de prueba. Sin hipótesis = sin lanzamiento.

**Error 2: Detener las pruebas ante la primera significancia**
La lista de verificación previa al lanzamiento bloquea una duración de la prueba y una fecha de finalización. Claude marcará si estás leyendo resultados antes de que se alcance el tamaño de muestra requerido.

**Error 3: Optimizar un embudo roto**
`/analytics-tracking` y `/page-cro` identifican brechas de seguimiento y fricción de UX antes de ejecutar experimentos CRO. Arreglar un flujo de incorporación roto no es una prueba — es una corrección de errores.

**Error 4: Informar métricas sin contexto**
`/growth-dashboard` genera comentarios narrativos con cada informe — no solo números. "Los registros cayeron un 18%" necesita una explicación y una acción, no solo un semáforo rojo.

**Error 5: Gastar en pago antes de que el embudo convierta**
`/onboarding-cro` y `/page-cro` identifican las mayores caídas de conversión. Arregla esas antes de escalar la adquisición de pago — de lo contrario estás llenando un cubo con agujeros.

---

## Recursos

- [Primeros pasos con Claude Code](./getting-started.md)
- [Habilidad rastreador de experimentos](../skills/marketing/experiment-tracker.md)
- [Habilidad dashboard de crecimiento](../skills/marketing/growth-dashboard.md)
- [Flujo de trabajo de experimentos de crecimiento](../workflows/growth-experiment.md)
- [Configuración de seguimiento de análisis](../skills/marketing/analytics-tracking.md)
- [Optimización de anuncios de pago](../skills/marketing/paid-ads.md)

---
