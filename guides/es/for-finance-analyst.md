# Claude para Analistas Financieros y CFOs

Todo lo que un Analista Financiero, Gerente de FP&A o CFO necesita para ejecutar modelado financiero, informes, preparación de paquetes para el consejo y comunicación con inversores asistidos por IA en Claude Code.

---

## Para quién es esto

Eres un profesional de finanzas — analista de FP&A, gerente de finanzas, VP de Finanzas o CFO — cuyo trabajo es convertir números en decisiones. Construyes modelos, cierras los libros, explicas varianzas, preparas materiales para el consejo y gestionas inversores. Estás ahogado en hojas de cálculo y pasas demasiado tiempo en formato en lugar de análisis.

**Antes de Claude Code:** 3 horas para construir un DCF de primer borrador. Medio día para escribir el comentario de gestión del paquete del consejo. Un día completo para producir una presentación de presupuesto vs. reales con explicaciones de varianzas. Noches sin dormir antes de las reuniones del consejo.

**Después:** Marco de DCF en 20 minutos. Narrativa del paquete del consejo en 45 minutos. Comentario de varianza BvA en 15 minutos. Análisis de escenarios en cualquier modelo en menos de 10 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar la pila financiera completa
npx claudient add skills finance
npx claudient add skills gtm/commercial-forecaster
npx claudient add skills gtm/revenue-operations
npx claudient add agents advisors/cfo-advisor
npx claudient add agents roles/quant-analyst

# O seleccionar individualmente:
npx claudient add skill finance/dcf-model
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/financial-plan
npx claudient add skill finance/ic-memo
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/budget-vs-actual
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/revenue-operations
```

---

## Tu pila de Claude Code para finanzas

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/board-pack-builder` | Paquete completo del consejo: financieros, KPIs, iniciativas estratégicas, riesgos, solicitudes | Reuniones del consejo mensuales/trimestrales |
| `/budget-vs-actual` | Análisis BvA: tablas de varianzas, comentarios, tendencia, reprevisión | Cierre mensual |
| `/dcf-model` | Valoración DCF: WACC, proyecciones de FCF, valor terminal, sensibilidad | Trabajo de valoración, operaciones |
| `/3-statement-model` | Modelo integrado de PyG, balance y flujo de caja | Planificación financiera, recaudación de fondos |
| `/financial-plan` | Plan operativo anual: plantilla, ingresos, construcción de gastos, escenarios | Ciclo de planificación anual |
| `/ic-memo` | Memorándum del Comité de Inversión: las 9 secciones completas, análisis de rendimientos | Documentación de operaciones PE / VC |
| `/pitch-deck` | Presentación de recaudación de fondos: estructura, narrativa, métricas, historia | Recaudación de fondos para inversores |
| `/gl-reconciler` | Conciliación del libro mayor: análisis de cuentas, seguimiento de varianzas, verificación de asientos | Cierre de fin de mes |
| `/commercial-forecaster` | Previsión de ingresos: impulsada por pipeline, análisis de cohortes, escenarios | Planificación conjunta de ventas y finanzas |
| `/revenue-operations` | Análisis de RevOps: cascada de ARR, descomposición de NRR, atribución de abandono | Negocios SaaS / suscripción |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `cfo-advisor` | Opus | Preguntas financieras estratégicas, narrativa de inversores, posicionamiento de recaudación de fondos |
| `quant-analyst` | Sonnet | Análisis estadístico, modelado financiero, investigación cuantitativa |

---

## Flujo de trabajo diario

### Mañana — Extracción de datos financieros (15-30 minutos)

**1. Pulso financiero diario**
```
/budget-vs-actual

Extrae el snapshot de esta mañana:
- Posición de efectivo vs. ayer
- Cualquier pago o cobro por encima de $[umbral] procesado durante la noche
- Ingresos del mes hasta la fecha vs. presupuesto (si está disponible en el sistema)
- Cualquier varianza que necesite una explicación antes del standup de las 9am

Dame un briefing matutino de 5 puntos.
```

**2. Actualizaciones del modelo**
```
/commercial-forecaster

Actualiza mi previsión de ingresos con los reales de ayer:
- Nuevas reservas: $[X]
- MRR cancelado: $[X]
- Expansión: $[X]

¿Seguimiento del mes actual vs. presupuesto? ¿Alguna tendencia que necesite una reprevisión?
```

---

### Trabajo de modelos (variable — 1-4 horas)

**3. Construir o actualizar un modelo financiero**
```
/3-statement-model

Construye un modelo de 3 estados para [empresa].

Datos históricos (últimos 3 años o pega lo que tengas):
[Datos de PyG, balance, flujo de caja]

Supuestos clave para la proyección:
- Tasa de crecimiento de ingresos: [X]% por año
- Margen bruto: [X]%
- OpEx como % de ingresos: [X]%
- CapEx: [X]% de ingresos
- Cambios en capital de trabajo: [breve]

Proyecta 3 años hacia adelante. Construye escenarios base / optimista / pesimista.
```

**4. Análisis de varianzas**
```
/budget-vs-actual

Ejecuta el BvA mensual para [MES].

[Pega los datos reales vs. presupuesto para cada línea del PyG]

Contexto:
- Por qué los ingresos no alcanzaron el objetivo: [breve]
- Por qué S&M gastó menos: [contratación más lenta de lo planificado]
- Cualquier elemento único: [describe]

Produce: tabla de varianzas, comentario de gestión, implicación de reprevisión.
```

---

### Informes y comunicación con partes interesadas (variable)

**5. Preparación del paquete del consejo**
```
/board-pack-builder

Construye el paquete del consejo de este mes para [empresa].

[Proporciona las 7 secciones de entrada: datos financieros, KPIs, actualizaciones estratégicas, riesgos, solicitudes]

Composición del consejo: [inversores + independientes]
Última reunión del consejo: [fecha, puntos clave discutidos]
Narrativa principal de este mes: [cuál es la historia — en camino / adelantado / atrasado y por qué]
```

**6. Actualización de inversores**
```
/cfo-advisor

Redacta el correo mensual de actualización de inversores para [empresa].

Audiencia: [inversores de VC / ángeles / inversores estratégicos]
Métricas clave a cubrir: [ARR, crecimiento, quema, pista, hitos clave]
Qué fue bien: [lista]
Qué no fue bien: [lista + breve explicación]
Qué necesitamos de los inversores: [presentaciones / asesoramiento / aprobaciones]

Tono: Transparente, confiado, breve. Sin manipulación — los inversores valoran la sinceridad.
```

---

### Ciclo semanal y mensual

**7. Lista de verificación del cierre de fin de mes**
Consulta el flujo de trabajo completo en [workflows/finance-month-end.md](../workflows/finance-month-end.md).

**8. Reprevisión**
```
/budget-vs-actual

[Después del cierre mensual] Ejecuta la reprevisión del año completo.

Reales hasta la fecha (pega):
[datos]

Cambios de supuestos clave desde el presupuesto original:
- Ingresos: [qué cambió y por qué]
- Plantilla: [real vs. planificado]
- Elementos únicos: [lista]

Produce: previsión revisada del año completo, 3 escenarios (base/optimista/pesimista),
pista de efectivo revisada en cada escenario.
```

---

## Plan de 30 días (nuevos analistas financieros)

### Semana 1 — Conocer el negocio
- Instala todas las habilidades financieras: `npx claudient add skills finance`
- Ejecuta `/gl-reconciler` en el cierre del mes pasado — comprende el plan de cuentas
- Ejecuta `/budget-vs-actual` en los últimos 3 meses de reales — identifica los patrones
- Lee los últimos 3 paquetes del consejo — comprende la narrativa que el CFO ha estado contando
- Mapea el modelo financiero: ¿de dónde vienen los ingresos? ¿Qué impulsa el margen bruto? ¿Qué es el OpEx discrecional?

### Semana 2 — Ser dueño del proceso de cierre
- Acompaña o ejecuta el cierre de fin de mes con `/gl-reconciler`
- Construye tu plantilla de comentarios de varianzas usando `/budget-vs-actual`
- Comprende el presupuesto: ¿cuáles fueron los supuestos? ¿Dónde estamos rastreando vs. el plan?
- Configura tu panel financiero en tu herramienta de BI preferida (Looker, Metabase, o incluso Google Sheets)

### Semana 3 — Construir el modelo
- Construye o revisa el modelo completo de 3 estados con `/3-statement-model`
- Ejecuta un DCF del negocio (incluso si aún no lo necesitas — entender los impulsores de valoración importa)
- Construye un análisis de sensibilidad: ¿qué variable única impacta más la pista de efectivo?
- Produce tu primer borrador de paquete del consejo usando `/board-pack-builder`

### Semana 4 — Impulsar decisiones
- Presenta tu primer BvA mensual al CEO o CFO
- Usa `/commercial-forecaster` para construir una previsión de ingresos vinculada al pipeline
- Identifica el riesgo financiero que no se está discutiendo — plantéalo
- Configura tu calendario de cierre de fin de mes: qué se cierra cuándo, quién es responsable

---

## Integraciones de herramientas

### QuickBooks / Xero / NetSuite

```
Exporta el balance de comprobación o PyG de tu sistema contable como CSV o Excel.
Pega en Claude:

"/gl-reconciler — aquí está el balance de comprobación para [mes]. Identifica cualquier cuenta
con saldos inusuales, grandes variaciones intermensales, o elementos que necesiten conciliación."

"/budget-vs-actual — aquí está la exportación del PyG de gestión. Produce un BvA contra
este presupuesto [pega presupuesto]. Escribe el comentario de gestión."
```

### Excel / Google Sheets

```python
# Para analistas basados en Python — conecta Claude a tus datos de hojas de cálculo
import anthropic
import pandas as pd

client = anthropic.Anthropic()

# Carga tus datos financieros
df = pd.read_excel('monthly_financials.xlsx')

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    system="You are a financial analyst. Analyse the provided financial data and identify variances, trends, and anomalies. All figures are in USD thousands. Mark any calculations that need verification with [VERIFY].",
    messages=[{
        "role": "user",
        "content": f"""Run a budget vs actuals analysis on this data:

{df.to_markdown()}

Produce: variance table, management commentary, reforecast recommendation."""
    }]
)
```

### Salesforce / HubSpot (previsión de ingresos)

```json
// Conecta CRM a Claude para previsión impulsada por pipeline
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@anthropic/salesforce-mcp"],
      "env": {
        "SF_USERNAME": "your-username",
        "SF_PASSWORD": "your-password",
        "SF_TOKEN": "your-security-token"
      }
    }
  }
}
```

Con CRM conectado:
- Extrae pipeline por etapa y pide a Claude una previsión de ingresos de abajo hacia arriba
- Compara la cobertura del pipeline con la cuota: "¿tenemos suficiente pipeline para alcanzar el número?"
- Identifica operaciones en riesgo basándose en la última fecha de actividad

### Notion / Confluence (distribución del paquete del consejo)

```
Después de construir tu paquete del consejo con /board-pack-builder:
1. Exporta como markdown
2. Pega en Notion o Confluence
3. Comparte el enlace de solo lectura con los miembros del consejo antes de la reunión
4. En la reunión, usa Claude para responder preguntas "qué pasa si" sobre el modelo
```

---

## Puntos de referencia a rastrear

| Métrica | Startup en etapa temprana | Etapa de crecimiento | Pública / madura |
|---|---|---|---|
| Días para cerrar (fin de mes) | 10-15 | 5-7 | 3-5 |
| Paquete del consejo distribuido antes de la reunión | 48 horas | 72 horas | 5 días |
| Precisión de previsión (ingresos) | ±20% | ±10% | ±5% |
| Varianza del presupuesto explicada (% de líneas del PyG) | 60% | 85% | 95% |
| Visibilidad de la pista de efectivo | 3 meses | 6 meses | 12+ meses |
| Tiempo para producir análisis BvA | 4 horas | 2 horas | 1 hora |
| Tiempo para actualizar el modelo financiero | 2 horas | 45 minutos | 30 minutos |

---

## Errores comunes (y cómo Claude Code los previene)

**Error 1: Narrativas sin números**
Los paquetes del consejo que cuentan una historia sin citar cifras específicas pierden credibilidad. `/board-pack-builder` construye las tablas financieras primero, luego genera narrativa vinculada a números específicos.

**Error 2: Varianzas no explicadas**
"Los ingresos estuvieron por debajo del presupuesto" no es un comentario. `/budget-vs-actual` estructura el análisis de causa raíz para que siempre expliques *por qué*, no solo *qué*.

**Error 3: Previsiones de un solo escenario**
Cada previsión debe tener tres escenarios. `/3-statement-model` y `/budget-vs-actual` incluyen análisis de escenarios por defecto.

**Error 4: Sobrepromesas al consejo**
`/board-pack-builder` genera la sección de "solicitudes" — siendo claro y específico sobre lo que necesitas del consejo, en lugar de enterrar las solicitudes en diapositivas.

**Error 5: Supuestos no divulgados**
Todos los resultados financieros de Claude están marcados con `[VERIFY]`. Esta disciplina te obliga a volver y confirmar cada cifra antes de publicar — fundamental para los materiales del consejo.

---

## Recursos

- [Primeros pasos con Claude Code](../getting-started.md)
- [Flujo de trabajo de cierre de fin de mes en finanzas](../workflows/finance-month-end.md)
- [Habilidad modelo DCF](../skills/finance/dcf-model.md)
- [Habilidad constructor de paquetes del consejo](../skills/finance/board-pack-builder.md)
- [Habilidad presupuesto vs. reales](../skills/finance/budget-vs-actual.md)
- [Habilidad modelo de 3 estados](../skills/finance/3-statement-model.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
