# Claude para Fundadores y CEOs

Todo lo que un fundador de startup necesita para gestionar las operaciones de la empresa aumentadas con IA — actualizaciones a inversores, preparación de reuniones de directorio, revisiones de OKRs, decisiones de contratación, modelado financiero, inteligencia competitiva y el ritmo semanal que mantiene a una empresa en movimiento.

---

## Para quién es esta guía

Eres fundador o CEO en una startup respaldada por capital de riesgo, desde pre-seed hasta Serie B. Estás haciendo 15 trabajos a la vez: estrategia, captación de fondos, gestión del equipo, decisiones de producto, llamadas con clientes y relaciones con inversores. Claude Code reduce el coste de tiempo de cada uno entre 5 y 20 veces.

**Antes de Claude Code:** 3 horas para escribir un deck de directorio. 45 minutos por actualización a inversores. Medio día para construir un modelo financiero. La investigación profunda sobre un competidor llevando una semana de cambios de contexto.

**Después:** Deck de directorio estructurado en 30 minutos, completado a lo largo de 2 horas. Actualización a inversores en 10-15 minutos. Modelo financiero construido iterativamente en una sesión. Análisis de competidor en una hora.

---

## Instalación en 30 segundos

```bash
# Instalar el pack completo de fundador
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/board-deck-builder
npx claudient add skill gtm/revenue-operations
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill finance/dcf-model
npx claudient add agents advisors/ceo-advisor
npx claudient add agents advisors/cfo-advisor
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Tu stack de fundador en Claude Code

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/founder-weekly-review` | Salud de la empresa, verificación de OKRs, pulso del equipo, prioridades del CEO para la semana siguiente | Cada domingo o lunes por la mañana |
| `/investor-update` | Email mensual a inversores: MRR, burn, logros, dificultades, solicitud | Primera semana de cada mes |
| `/board-deck-builder` | Deck trimestral de directorio: métricas, narrativa, malas noticias, captación de fondos | 2 semanas antes de la reunión de directorio |
| `/revenue-operations` | Salud del pipeline, métricas de ventas, precisión de previsiones, palancas de GTM | Semanalmente con tu CRO/Jefe de Ventas |
| `/commercial-forecaster` | Previsión de ingresos: de abajo a arriba y de arriba a abajo, modelado de escenarios | Mensualmente o antes de captación de fondos |
| `/pitch-deck` | Narrativa de presentación a inversores para una nueva ronda de captación de fondos | Preparación para Serie A / B |
| `/financial-plan` | Modelo operativo, plan de plantilla, planificación de escenarios, gestión de caja | Trimestralmente o antes de captar fondos |
| `/dcf-model` | Valoración por flujo de caja descontado, análisis de comparables, modelado de tabla de capitalización | M&A, secundario, captación de fondos |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `ceo-advisor` | Opus | Decisiones estratégicas, diseño organizativo, estrategia de captación de fondos, decisiones difíciles |
| `cfo-advisor` | Sonnet | Modelado financiero, análisis de burn, tabla de capitalización, hojas de términos |
| `cto-advisor` | Sonnet | Decisiones de deuda técnica, nivel de contratación, construir vs. comprar, riesgo de arquitectura |
| `chief-of-staff` | Sonnet | Coordinación interfuncional, preparación del directorio, all-hands, seguimiento de OKRs |

---

## Flujo de trabajo diario

### Pulso matutino de la empresa (15 minutos)

```
/founder-weekly-review

Control de pulso matutino — [FECHA]:
- ¿Cuáles son las 3 cosas más importantes que ocurren en la empresa hoy?
- ¿Algún problema urgente de la noche anterior (escalada de cliente, problema de equipo, prensa)?
- ¿Cuál es mi uso más valioso del tiempo hoy?

Datos disponibles: [pega el resumen de Slack / movimiento de MRR / cualquier actualización de la noche]
```

### Comunicaciones con inversores y directorio (según sea necesario)

```
/investor-update

Redacta mi [actualización mensual / nota a mitad del período / actualización ad hoc]:
Mes: [MES]
Movimiento clave de métricas: [cambio en MRR o ARR]
Noticias de este período: [logros, dificultades, salida del CTO, nueva contratación, etc.]
Solicitud: [qué necesito de los inversores este mes]
```

### Revisión financiera (semanal, 30 minutos)

```
/financial-plan

Control financiero semanal:
- Caja: [$X] | Burn: [$X/mes] | Pista: [X meses]
- MRR esta semana: [$X] | vs. semana anterior: [$X]
- ¿Algún coste inesperado esta semana?

¿Cómo se ven los próximos 90 días con la trayectoria actual?
¿Qué se necesitaría para extender la pista 2 meses sin captar fondos?
```

### Planificación semanal (viernes tarde o domingo)

```
/founder-weekly-review

Revisión de fin de semana para la semana del [FECHA].

[Pega: MRR, actualizaciones del pipeline, noticias del equipo, verificación de OKRs, cualquier problema urgente]

Produce: semáforo de salud de la empresa, estado de OKRs, 3 logros, 2 dificultades, prioridades del CEO para la semana siguiente, la única decisión que necesito tomar.
```

---

## Flujos de trabajo clave por escenario

### Captación de fondos

```
1. Investigar la ronda:
/dcf-model + /financial-plan
¿Qué ARR y métricas necesito para captar fondos a [valoración objetivo]?

2. Construir la narrativa:
/pitch-deck
Narrativa de la Serie [X] — ARR actual, tasa de crecimiento, uso de fondos, tesis de mercado.

3. Preparar reuniones con inversores:
/ceo-advisor (agente)
Ayúdame a anticipar las 10 preguntas más difíciles que hará un [VC de primer nivel].

4. Seguimiento y cierre:
/commercial-forecaster
Modela mi pipeline de captación de fondos: [N inversores en qué etapa] → fecha de cierre esperada.
```

### Contratar a un ejecutivo clave

```
/ceo-advisor

Estoy contratando a un [VP de Ventas / CTO / CFO]. Ayúdame a:
1. Definir el perfil (imprescindibles vs. deseables para nuestra etapa)
2. Escribir el scorecard (5-7 dimensiones, cada una con una rúbrica)
3. Estructurar el proceso de entrevistas (quién entrevista, en qué orden, qué evalúa cada persona)
4. Identificar 3 señales de alerta a filtrar
5. Redactar el marco de la oferta (filosofía de compensación, equity, expectativas)

Contexto de la empresa: [etapa, ARR, tamaño del equipo, mayor desafío que resuelve esta contratación]
```

### Inteligencia competitiva

```
/ceo-advisor

Análisis competitivo profundo de [competidor]:
- ¿En qué son realmente buenos? ¿Qué aman los clientes de ellos?
- ¿Dónde son débiles? ¿Qué dicen sus clientes que se fueron?
- ¿Cómo están posicionados versus nosotros — precio, ICP, GTM?
- ¿Qué harían si lanzáramos [funcionalidad/movimiento]?
- ¿Qué es lo único de lo que deberíamos preocuparnos más?

Fuentes a verificar: reseñas en G2, ofertas de trabajo, su blog, financiación reciente, contrataciones en LinkedIn.
```

### Preparación del directorio

```
/board-deck-builder

Reunión trimestral de directorio — [TRIMESTRE]:

Métricas: [ARR, crecimiento, NRR, burn, plantilla]
Temas especiales: [cualquier cosa inusual — pivote, salida clave, captación de fondos, gran logro]
Decisiones que necesita el directorio: [lista cualquier cosa que requiera aprobación o input]

Construye la estructura del deck. Yo completaré la narrativa para cada sección.
```

---

## Plan de 30 días (fundador usando Claude Code por primera vez)

### Semana 1 — Fundación
- Instala todas las habilidades de fundador mediante los comandos anteriores
- Ejecuta `/founder-weekly-review` para esta semana — familiarízate con el formato
- Ejecuta `/financial-plan` con tus datos actuales — construye tu modelo operativo base
- Ejecuta `/investor-update` para el mes pasado — envíaselo a tus inversores

### Semana 2 — Ritmo
- Usa `/founder-weekly-review` como tu ritual de los lunes por la mañana (30 minutos)
- Usa `/ceo-advisor` para una decisión estratégica que hayas estado aplazando
- Construye tu plantilla de seguimiento de OKRs — ejecútala semanalmente a partir de ahora

### Semana 3 — Captación de fondos y comunicaciones
- Ejecuta `/pitch-deck` o `/board-deck-builder` para tu próximo evento
- Configura un `CLAUDE.md` en tu raíz con el contexto de tu empresa (etapa, ARR, equipo, inversores) para que Claude siempre tenga contexto
- Ejecuta una sesión de `/commercial-forecaster` para entender tu trayectoria de ingresos

### Semana 4 — Integración completa
- Cada actualización a inversores redactada con `/investor-update`
- Cada reunión de directorio preparada con `/board-deck-builder`
- Cada contratación importante evaluada con `/ceo-advisor` para el diseño del scorecard
- Cada semana revisada con `/founder-weekly-review`

---

## CLAUDE.md para fundadores

Crea un `CLAUDE.md` en tu directorio raíz o directorio de inicio para que Claude siempre conozca el contexto de tu empresa:

```markdown
# Contexto de la empresa

Empresa: [NOMBRE]
Etapa: [Seed / Serie A / Serie B]
ARR: [$X]
Tasa de crecimiento del MRR: [X% MoM]
Tasa de burn: [$X/mes]
Pista: [X meses]
Plantilla: [N]
Inversores clave: [lista]
Estado de captación de fondos: [no captando / preparando / en mercado / cerrado]

## Top 3 prioridades este trimestre
1. [Prioridad 1 — p. ej., cerrar la Serie A]
2. [Prioridad 2 — p. ej., alcanzar $1.2M de ARR]
3. [Prioridad 3 — p. ej., contratar al Jefe de Ventas]

## Equipo
CEO: [nombre]
CTO: [nombre]
Jefe de Producto: [nombre]
Jefe de Ventas: [nombre]

## Métricas clave a conocer
NRR: [X%]
Margen bruto: [X%]
Payback del CAC: [X meses]
Churn: [X% mensual]

## ICP
[2 frases describiendo al cliente ideal — tamaño, sector, cargo, problema]
```

Con esto configurado, cada sesión de Claude tiene contexto completo sin necesidad de volver a explicarlo.

---

## Integraciones de herramientas

### Notion (para OKRs y documentos del directorio)

```json
// Añadir a ~/.claude/settings.json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-notion"],
      "env": {
        "NOTION_API_TOKEN": "your-token"
      }
    }
  }
}
```

Con esto conectado, Claude puede leer y actualizar tu rastreador de OKRs, documentos de preparación del directorio y pipeline de inversores.

### Linear (para OKRs de ingeniería)

Conecta Linear mediante MCP para extraer datos de sprints directamente en tu revisión semanal. Claude puede decirte qué se entregó, qué se retrasó y qué está en riesgo — sin pedir a tu CTO que compile un informe.

### QuickBooks / Xero

Exporta tu P&L y flujo de caja como CSV. Pégalos en `/financial-plan` para análisis de burn y modelado de escenarios. Para fundadores con una conexión en tiempo real, el MCP de QuickBooks proporciona a Claude datos financieros en vivo.

---

## Métricas clave por etapa

### Seed

| Métrica | Objetivo | Por qué |
|---|---|---|
| Tiempo hasta el primer cliente de pago | <90 días | Valida la disposición a pagar |
| Retención en la semana 2 | >30% | Señal de PMF |
| NPS | >40 | Señal de amor por el producto |
| Burn multiple | <5x | Eficiencia de capital en etapa inicial |
| Llamadas fundador-cliente por semana | 5+ | Mantenerse cerca del cliente |

### Serie A

| Métrica | Objetivo | Por qué |
|---|---|---|
| Crecimiento MoM del ARR | >15% | Velocidad demostrable |
| NRR | >110% | Land and expand funcionando |
| Payback del CAC | <18 meses | Economía unitaria viable |
| Burn multiple | <3x | Crecimiento eficiente |
| Cobertura del pipeline | >3x el objetivo | Ingresos predecibles |
| Tiempo hasta cuota (representantes de ventas) | <4 meses | GTM es repetible |

### Serie B

| Métrica | Objetivo | Por qué |
|---|---|---|
| Crecimiento YoY del ARR | >100% | Componente de la Regla de 40 |
| Margen bruto | >70% | Margen de nivel software |
| NRR | >120% | Crecimiento impulsado por expansión |
| Burn multiple | <2x | Eficiencia de capital |
| Payback del CAC | <12 meses | Economía unitaria probada |

---

## Errores comunes de fundadores que Claude Code ayuda a evitar

**Error 1: Dejar que las actualizaciones a inversores se retrasen**
Configura un recordatorio mensual. `/investor-update` reduce el coste de tiempo a 10-15 minutos. Las actualizaciones consistentes generan confianza incluso cuando los números son difíciles.

**Error 2: Sorpresas en las reuniones de directorio**
Usa el marco de malas noticias de `/board-deck-builder`. Llama a cada miembro del directorio individualmente antes de la reunión si vas a dar noticias difíciles. Nunca dejes que el deck sea la primera vez que escuchen algo difícil.

**Error 3: OKRs fijados en enero, revisados en diciembre**
`/founder-weekly-review` incluye la verificación de OKRs cada semana. Los KRs fuera de camino se detectan en la semana 5, no en la semana 13.

**Error 4: Contratar por intuición, no por scorecard**
Usa `/ceo-advisor` para construir un scorecard antes de cada contratación senior. Documenta la rúbrica. Haz el debriefing de cada panel contra la rúbrica.

**Error 5: Modelo financiero solo para captar fondos**
Tu modelo operativo debería ser un documento en vivo. Usa `/financial-plan` mensualmente. Conoce tu pista con 2 semanas de anticipación, no con 2 meses.

---

## Recursos

- [Comenzar con Claude Code](getting-started.md)
- [Flujo de trabajo semanal del fundador](../workflows/founder-weekly.md)
- [Habilidad de creación de deck del directorio](../skills/productivity/board-deck-builder.md)
- [Habilidad de actualización a inversores](../skills/productivity/investor-update.md)
- [Habilidad de plan financiero](../skills/finance/financial-plan.md)
- [Agente de asesor CEO](../agents/advisors/ceo-advisor.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
