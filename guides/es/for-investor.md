# Claude para Inversores y Analistas de Capital de Riesgo

Todo lo que un analista, asociado o socio de capital de riesgo necesita para ejecutar selección de operaciones, diligencia debida, modelado financiero, seguimiento de cartera y preparación de comités de inversión potenciados por IA en Claude Code.

---

## Para quién es esto

Eres analista, asociado, socio o inversor ángel independiente de capital de riesgo. Tu trabajo es ver cada operación relevante, filtrar rápidamente, realizar diligencia debida en las mejores y tomar buenas decisiones de inversión. Estás inundado de solicitudes entrantes, pasas el 40% de tu tiempo escribiendo memorandos e informes, y nunca tienes suficientes horas para investigar en profundidad cada empresa que lo merece. Claude Code cambia esa proporción.

**Antes de Claude Code:** 6 horas para escribir un memorando de primera revisión. Media jornada para prepararse para una reunión de directorio. 3 horas para compilar un informe trimestral de LP entre 15 empresas.

**Después:** Memorando de primera revisión en 45 minutos. Preparación para reunión de directorio en 20 minutos. Sección de cartera del informe de LP en 30 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar todas las habilidades para inversores
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/dcf-model
npx claudient add skill finance/diligence-review
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/earnings-analysis

# Instalar agentes relevantes
npx claudient add agent advisors/cfo-advisor
npx claudient add agent roles/quant-analyst
npx claudient add agent roles/scientific-researcher
```

---

## Tu stack de Claude Code para inversores

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/deal-screening` | Filtro inicial: mercado, ventaja competitiva, gestión, finanzas, ajuste — veredicto pasar/continuar | Primera revisión de cualquier nueva operación |
| `/deal-memo` | Memorando completo: tesis, equipo, mercado, finanzas, riesgos, lista de diligencia, recomendación | Después de reunión con fundadores |
| `/ic-memo` | Memorando para el Comité de Inversión (formato PE/crecimiento de 9 secciones) | Antes de la presentación al CI |
| `/dcf-model` | Modelo financiero DCF: supuestos, proyecciones, valor terminal, sensibilidad — en formato Python o Excel | Cualquier trabajo de valoración |
| `/diligence-review` | Estructurar y ejecutar diligencia: llamadas con clientes, revisión técnica, llamadas de referencia, lista de verificación de auditoría financiera | Diligencia post-term-sheet |
| `/comps-analysis` | Análisis de empresas y transacciones comparables: EV/Ingresos, EV/EBITDA, múltiplos ajustados por crecimiento | Benchmarking de valoración |
| `/portfolio-monitor` | Síntesis de actualización del directorio, seguimiento de KPI, disparadores de inversión adicional, señales de alerta, secciones del informe de LP | Revisión mensual/trimestral de cartera |
| `/earnings-analysis` | Análisis de llamadas de resultados de empresas públicas — lectura transversal para comparables del mercado privado | Investigación competitiva |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `cfo-advisor` | Opus | Revisión del modelo financiero, análisis de economía unitaria |
| `quant-analyst` | Opus | Dimensionamiento cuantitativo del mercado, tesis basada en datos |
| `scientific-researcher` | Opus | Investigación sectorial profunda, literatura académica para tecnología profunda |

---

## Flujo de trabajo diario

### Mañana (30-45 minutos)

**1. Revisión del flujo de operaciones — filtrar entradas de la noche**
```
/deal-screening

Filtra rápidamente estas operaciones entrantes. Dame un veredicto pasar/continuar para cada una.

[Operación 1 — nombre de empresa, sector, etapa, ARR/ingresos, crecimiento, valoración solicitada, breve descripción]
[Operación 2]
[Operación 3]

Tesis de mi fondo: [describe tu mandato — etapa, sector, tamaño del cheque]
Omite los casos claramente fuera de perfil. Señala el que merece un análisis más profundo.
```

**2. Revisión de cartera — actualizaciones de directorio recibidas**
```
/portfolio-monitor

Recibí una actualización mensual de [empresa]. Sintetízala y señala cualquier cosa que requiera mi atención esta semana.

[Pegar actualización del directorio o métricas clave]
```

---

### Post-reunión con fundadores (45-90 minutos)

**3. Memorando de operación — primera impresión al papel**
```
/deal-memo

Empresa: [nombre]
Lo que aprendí en la reunión: [tus notas — pegar o resumir]
Mi intuición: [visión preliminar]

Completa la estructura del memorando. Marca cualquier cosa que no haya aprendido como [NECESITA VERIFICACIÓN].
```

---

### Fase de diligencia (continua)

**4. Preparación de llamada de referencia con clientes**
```
/diligence-review

Mañana llamo al cliente de referencia de [empresa] [nombre, título, empresa].

Tesis de inversión: [en qué creemos sobre la empresa]
Riesgos clave a validar: [qué podría estar mal]

Genera 12 preguntas de llamada de referencia que examinen:
- Cómo usan el producto y qué tan integrado está
- Qué les haría cancelar
- Cómo se compara el producto con las alternativas que han evaluado
- Cualquier preocupación sobre la empresa o el equipo
```

**5. Análisis de comparables**
```
/comps-analysis

Realiza un análisis de empresas comparables para [empresa] en [sector].

Métricas de nuestra empresa: ARR $[X]M, [X]% de crecimiento, [X]% de margen bruto, [X]x NRR
Ronda: $[X]M a $[X]M pre-money

Encuentra comparables públicos y comparables de transacciones privadas recientes. ¿Qué múltiplo estamos pagando frente al mercado?
```

---

### Preparación para el CI

**6. Memorando para CI — presentación completa al comité de inversión**
```
/ic-memo

Convierte mi memorando de operación en un memorando completo para el CI de [empresa].

Memorando de operación (pegar o resumir): [...]
Hallazgos de diligencia: [qué verificamos, qué no pudimos]
Recomendación actualizada: [invertir / pasar / condicional]

Genera las 9 secciones con marcadores [VERIFICAR] en cualquier dato no confirmado.
```

---

### Apoyo de cartera (días de reunión de directorio)

**7. Preparación para reunión de directorio**
```
/portfolio-monitor

La reunión del directorio con [empresa] es mañana. Prepárame.

Última reunión del directorio: [resumen]
Paquete actual del directorio: [pegar]
Mis preocupaciones: [lista]
Lo que quiero impulsar: [temas]

Dame: síntesis de lectura previa, preguntas difíciles, mi agenda, posibles solicitudes del equipo.
```

---

### Semanal (viernes — 30 minutos)

**8. Resumen semanal del flujo de operaciones**
```
/deal-screening

Resume el flujo de operaciones de esta semana:
- Operaciones filtradas: [N]
- Pasadas: [N] — [breve razón por cada pase importante]
- En pipeline: [N] — [estado de cada una]
- Avanzando al CI: [N]

¿En qué debería priorizar la próxima semana?
```

---

## Plan de incorporación de 30 días (nuevo analista de VC)

### Semana 1 — Dominio del filtrado de operaciones
- Instalar todas las habilidades para inversores: `npx claudient add skill finance/[nombre]`
- Ejecutar `/deal-screening` en 20 operaciones recientes del archivo de tu fondo — compara tu resultado con lo que los socios decidieron
- Entiende el ICP de tu fondo: etapa, sector, tamaño del cheque, estrategia de inversión adicional
- Lee la habilidad `/comps-analysis` — entiende cómo funcionan los múltiplos en tus sectores

### Semana 2 — Práctica de memorandos de operación
- Acompaña 3 reuniones de socios → escribe memorandos de operación por tu cuenta → compara con la versión del analista senior
- Ejecuta `/dcf-model` en una empresa de la cartera — entiende los supuestos y sensibilidades
- Comienza a construir tu base de datos de comparables sectoriales — `/comps-analysis` ayuda a estructurarla

### Semana 3 — Diligencia y cartera
- Ejecuta `/diligence-review` en una operación activa — lidera el proceso de llamadas de referencia con clientes
- Usa `/portfolio-monitor` para sintetizar actualizaciones del T1 de 5 empresas de la cartera
- Prepárate para una reunión del directorio usando el modo de preparación de `/portfolio-monitor`

### Semana 4 — Presentación al CI
- Escribe un memorando completo para el CI con `/ic-memo` en una operación que hayas trabajado
- Presenta a los socios — usa el resultado de Claude como tu estructura, no como tu guión
- Rastrea: ¿cuántas de tus preguntas previas a la reunión surgieron en el CI? (referencia: >60% indica buena calidad de preguntas)

---

## Integraciones de herramientas

### Notion (seguimiento de operaciones)
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-token-here"
      }
    }
  }
}
```

Con Notion conectado: Claude puede leer tu base de datos de pipeline de operaciones, extraer notas de empresas y escribir borradores de memorandos directamente en tus páginas de operaciones.

### Airtable / pipeline de operaciones
Exporta el pipeline de operaciones como CSV → pega en `/deal-screening` → obtén veredictos clasificados de pasar/continuar. Para integración en vivo, usa el MCP de Airtable.

### Modelos financieros
Claude genera Python o tablas estructuradas listas para Excel para trabajo de DCF y comparables. Para modelos complejos, genera la estructura y supuestos en Claude → construye en Excel/Google Sheets → pega los resultados de vuelta para la narrativa.

### Gong / grabación de llamadas
Pega la transcripción de la llamada con el fundador en `/deal-memo` → Claude extrae afirmaciones clave, señala declaraciones no verificadas y estructura en formato de memorando de operación.

---

## Métricas a rastrear

| Actividad | Tiempo manual | Con Claude |
|---|---|---|
| Filtro inicial por operación | 45 min | 8 min |
| Borrador de memorando de operación | 6 horas | 45 min |
| Memorando para el CI | 8 horas | 2 horas |
| Preparación para reunión de directorio | 2 horas | 20 min |
| Informe trimestral de LP (sección de cartera) | 4 horas | 45 min |
| Preparación de llamada de referencia | 30 min | 10 min |
| Análisis de comparables | 3 horas | 30 min |

Objetivo: 3x más operaciones revisadas con el mismo número de analistas. El nivel de calidad aumenta porque Claude estructura tu pensamiento, no solo ahorra tiempo.

---

## Errores comunes (y cómo Claude Code los previene)

**Error 1: Anclarse en la narrativa del fundador**
`/deal-memo` te solicita marcar cada afirmación proporcionada por el fundador como `[NO VERIFICADO]`. Fuerza la honestidad intelectual antes de enamorarte de una historia.

**Error 2: Pasar por alto señales de alerta en actualizaciones del directorio**
`/portfolio-monitor` ejecuta una lista de verificación estructurada de señales de alerta en cada actualización del directorio. No pasarás por alto "el gasto aumentó 40% mientras los ingresos se mantuvieron planos" enterrado en la diapositiva 12.

**Error 3: Escribir memorandos que abogan en vez de analizar**
La sección de riesgos de Claude está estructurada para forzar un análisis equilibrado. Los miembros del CI que reciben memorandos con exceso de abogacía los descuentan.

**Error 4: Omitir llamadas de referencia**
`/diligence-review` genera preguntas de llamada de referencia que van más allá de las preguntas suaves que los fundadores entrenan a los clientes a responder.

**Error 5: Pagar la valoración incorrecta**
`/comps-analysis` ancla cada operación a los comparables del mercado antes de que te entusiasmes con la empresa.

---

## Recursos

- [Primeros pasos con Claude Code](getting-started.md)
- [Habilidad de filtrado de operaciones](../skills/finance/deal-screening.md)
- [Habilidad de memorando de operación](../skills/finance/deal-memo.md)
- [Habilidad de memorando para el CI](../skills/finance/ic-memo.md)
- [Habilidad de monitoreo de cartera](../skills/finance/portfolio-monitor.md)
- [Flujo de trabajo de filtrado de operaciones](../workflows/deal-screening.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
