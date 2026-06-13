# Claude para Customer Success Managers

Todo lo que un Customer Success Manager necesita para ejecutar monitoreo de salud, QBRs, prevención de churn y conversaciones de expansión potenciados por IA — sin pasar horas en preparación e informes.

---

## Para quién es esto

Eres un CSM responsable de un portfolio de cuentas — retenerlas, expandirlas y hacerlas exitosas. Te miden por la Net Revenue Retention y las tasas de renovación. Pasas demasiado tiempo en la preparación de QBRs, revisiones de health scores y redacción de emails de seguimiento, y no suficiente tiempo construyendo relaciones reales con los clientes.

**Antes de Claude Code:** 4-6 horas para preparar un QBR. 2 horas a la semana revisando manualmente la salud de las cuentas. 30 minutos escribiendo un email de seguimiento tras cada llamada. Sin un playbook de expansión consistente.

**Después:** QBR completamente preparado en 45 minutos. Revisión de salud completada en 15 minutos con recomendaciones estructuradas. Emails de seguimiento en 5 minutos. Oportunidades de expansión identificadas proactivamente, no de forma reactiva.

---

## Instalación en 30 segundos

```bash
# Instalar el stack completo de CS
npx claudient add skill gtm/customer-success
npx claudient add skill gtm/qbr-builder
npx claudient add skill gtm/health-score-analyzer
npx claudient add skill gtm/expansion-playbook
npx claudient add skill marketing/churn-prevention
npx claudient add skill small-business/customer-feedback-synthesizer
npx claudient add skill gtm/revenue-operations
npx claudient add agent advisors/cco-advisor
```

---

## Tu stack de Claude Code para CS

### Skills (comandos slash)

| Skill | Qué hace | Cuándo usarla |
|---|---|---|
| `/health-score-analyzer` | Puntúa las cuentas en señales de uso, relación y comerciales; clasificación de riesgo de churn | Revisión del portfolio los lunes |
| `/qbr-builder` | Preparación completa del QBR: agenda, puntos de conversación, cuantificación del ROI, discusión de expansión | 2 semanas antes de cualquier QBR |
| `/expansion-playbook` | Identifica señales de expansión, construye la narrativa de upsell, gestiona conversaciones de precios | Cuando una cuenta está lista para crecer |
| `/customer-success` | Diseño del modelo de health score, señales de churn, planes de onboarding | Construcción de procesos de CS |
| `/churn-prevention` | Análisis de clientes en riesgo y playbooks de rescate | Cuentas en ROJO que necesitan intervención |
| `/customer-feedback-synthesizer` | Sintetiza el feedback de encuestas, llamadas y tickets en temas | Voz del cliente trimestral |
| `/revenue-operations` | Cálculo de NRR, pipeline de renovaciones, métricas y previsiones de CS | Operaciones de CS e informes |

### Agentes

| Agente | Modelo | Cuándo invocarlo |
|---|---|---|
| `cco-advisor` | Opus | Decisiones estratégicas de CS: modelos de cobertura, estrategia de tiers, diseño organizacional |

---

## Flujo de trabajo diario

### Mañana (20-30 minutos)

**1. Revisión de salud del portfolio — ejecutar cada lunes**
```
/health-score-analyzer

Ejecuta la revisión de salud de mi portfolio para la semana del [FECHA].

Mis cuentas:
| Cuenta | ARR | Renovación | Último Login | Asientos Activos | Último Contacto | Problemas |
|---|---|---|---|---|---|---|
| [Empresa A] | $48K | 3 meses | Hace 5 días | 12/15 | Hace 7 días | Ninguno |
| [Empresa B] | $120K | 6 semanas | Hace 22 días | 4/20 | Hace 14 días | Ticket de soporte abierto |
| [Empresa C] | $24K | 8 meses | Hace 2 días | 8/8 | Hace 3 días | Preguntó sobre exportación |

Dame:
1. Health score y tier de riesgo para cada cuenta
2. Lista de prioridades de intervención para esta semana
3. Cualquier cuenta que muestre señales de churn que deba escalar
4. Renovaciones en los próximos 90 días y su estado de preparación
```

**2. Chequeo diario de riesgo — tarda 5 minutos**
```
/health-score-analyzer

Chequeo rápido: ¿han surgido nuevas señales de riesgo en las últimas 24-48 horas para mi portfolio?

Señales recientes:
- [Empresa X] no ha iniciado sesión en [X días]
- [Empresa Y] abrió un ticket de soporte sobre [tema]
- [Empresa Z] — el champion [nombre] acaba de cambiar de trabajo en LinkedIn

Evalúa el riesgo y dame la acción para cada una.
```

---

### Preparación del QBR (2 semanas antes)

**3. Constructor completo de QBR**
```
/qbr-builder

Construye mi QBR para [Nombre del Cliente].

Cliente: [Empresa]
ARR: $[X]
Renovación: [fecha]
Asistentes: [su cargo, su cargo] + [mi cargo, nombre del AE]
Duración: [60 minutos]
Objetivo: [retener y preparar la expansión / recuperación de la relación]

Contexto del cliente:
- Criterios de éxito del kickoff: [X, Y, Z]
- Caso de uso principal: [describe]
- Cambios en el negocio este trimestre: [cambios en su equipo, presupuesto, estrategia]
- Datos de uso: [resume — logins, asientos activos, funcionalidades principales usadas]
- Problemas abiertos: [tickets de soporte no resueltos o quejas]

Comercial:
- Salud: [VERDE / AMARILLO / ROJO]
- Oportunidad de expansión: [asientos / tier / add-on] — $[X] potencial
- Amenaza competitiva: [sí/no — describe si es sí]

Construye: agenda completa, puntos de conversación por sección, contenido de la diapositiva de ROI,
marco de conversación de expansión y 3 respuestas a objeciones.
```

---

### Conversaciones de expansión

**4. Identificación de señales de expansión y narrativa**
```
/expansion-playbook

Identifica la oportunidad de expansión para [Empresa].

Contrato actual: $[X] ARR, [N] asientos, [plan/tier]
Señales de uso:
- Utilización de asientos: [X de N asientos activos]
- Nuevo caso de uso observado: [describe]
- Señales de crecimiento: [su headcount subió X%, nuevo equipo mencionado, etc.]

Oportunidad de expansión: [asientos adicionales / upgrade de tier / add-on]
ARR adicional potencial: $[X]
Salud: [VERDE — requerido]

Construye:
1. Qué señales indican preparación (y cuáles son demasiado débiles para actuar ya)
2. La narrativa de expansión para mi próxima llamada
3. Marco de conversación de precios y 3 scripts de respuesta a objeciones
4. Si gestionar esto en CS o involucrar al AE
```

---

### Escalaciones de clientes

**5. Prevención de churn — cuentas en ROJO**
```
/churn-prevention

Este cliente tiene un riesgo serio de churn. Construye un plan de rescate.

Cliente: [Empresa]
ARR: $[X]
Renovación: [X semanas/meses]
Señales de riesgo: [descríbelas todas — uso, relación, comercial]
Hipótesis de causa raíz: [¿qué crees que está pasando realmente?]
Qué se ha intentado: [intentos de contacto previos y resultados]

Produce:
- Estructura del QBR de recuperación (a quién llevar, cómo abrirlo)
- Ofertas específicas a hacer o acciones a tomar
- Ruta de escalación si el rescate estándar no funciona
- Decisión go/no-go del rescate: ¿es esta cuenta salvable, o el churn es probable de todas formas?
```

---

### Síntesis de feedback de clientes (trimestral)

**6. Voz del cliente**
```
/customer-feedback-synthesizer

Sintetiza el feedback de clientes del último trimestre.

Fuentes:
- Encuestas NPS: [pega los resultados o resume los temas]
- Categorías de tickets de soporte: [describe los tipos de tickets más comunes y el volumen]
- Notas de QBR: [pega los temas clave de las conversaciones con clientes]
- Razones de churn: [¿por qué se fueron los clientes que se fueron?]

Resultado necesario:
- Los 3 principales puntos de dolor que experimentan los clientes
- Las 3 cosas principales que los clientes dicen que aman
- Brechas de producto mencionadas con mayor frecuencia
- Recomendaciones accionables para: equipo de producto, equipo de CS, liderazgo
- Tendencia del NPS y qué está impulsando a promotores vs. detractores
```

---

## Plan de incorporación de 30 días (nuevos CSMs)

### Semana 1 — Conocer tu portfolio
- Instala todas las skills de CS
- Ejecuta `/health-score-analyzer` en cada cuenta — establece tu mapa base de salud del portfolio
- Lee cada ticket de soporte abierto en tu portfolio — conoce lo que está ardiendo antes de reunirte con los clientes
- Programa llamadas de presentación con cada cuenta en tus primeros 30 días (incluso las saludables)

### Semana 2 — Primeras llamadas con clientes
- Usa `/qbr-builder` para preparar incluso las llamadas informales de check-in — las preguntas son las mismas
- Después de cada llamada: redacta el email de seguimiento y la nota del CRM con Claude en menos de 10 minutos
- Usa `/expansion-playbook` para mapear qué cuentas tienen potencial de expansión — aunque no vayas a actuar todavía
- Identifica tus 3 cuentas de mayor riesgo al final de la semana 2

### Semana 3 — Health score y proceso
- Usa `/health-score-analyzer` para puntuar formalmente cada cuenta — documenta en el CRM
- Establece tu ritmo de revisión semanal de salud
- Revisa el modelo de health score con tu manager de CS — alinea en los tiers y los pesos de puntuación
- Pasa tu primera cuenta en riesgo por `/churn-prevention` — aunque sea solo como ejercicio

### Semana 4 — QBR y expansión
- Ejecuta tu primer QBR usando `/qbr-builder` — pide a un CSM senior que haga shadowing o revise tu preparación
- Identifica 2-3 cuentas listas para una conversación de expansión — presenta el plan a tu manager primero
- Revisa la higiene de tu CRM: ¿están todas las cuentas actualizadas con health scores, fechas de último contacto y fechas de renovación?
- Reporta a tu manager: salud del portfolio, ARR en riesgo, principales oportunidades

---

## Integraciones de herramientas

### HubSpot CRM (recomendado)

```json
// Añadir a ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "tu-token-aquí"
      }
    }
  }
}
```

Con HubSpot conectado, Claude puede:
- Leer campos de salud de la cuenta, fechas de último contacto y fechas de renovación directamente
- Actualizar health scores de cuentas tras tu revisión del portfolio
- Crear tareas de seguimiento a partir de los action items del QBR
- Extraer informes del pipeline de renovaciones

### Gainsight / ChurnZero / Totango

Si tu equipo usa una plataforma dedicada de CS, exporta los datos de salud de las cuentas como CSV → pégalos en `/health-score-analyzer` para análisis y recomendaciones. Claude funciona con el output de cualquier plataforma de CS.

### Gong / Chorus (grabación de llamadas)

Obtén la transcripción de la llamada → pide a Claude que extraiga:
- Temas clave de la llamada con el cliente
- Action items con propietarios
- Señales de salud (menciones positivas y negativas)
- Nota del CRM y borrador del email de seguimiento

```
Aquí está la transcripción de mi llamada con [Cliente] hoy:
[pega la transcripción]

Extrae:
1. Nota de actualización del CRM (2-3 frases: qué se discutió, señales de salud, próximos pasos)
2. Email de seguimiento para enviar hoy
3. Action items: propietario + fecha límite para cada uno
4. Cualquier señal de churn o señal de expansión que deba marcar
```

### Notion / Confluence (plantillas de QBR)

Genera el esquema del deck del QBR con `/qbr-builder` → construye las diapositivas en Google Slides o Notion → usa Claude para refinar la narrativa durante la preparación.

---

## Métricas a seguir

| Métrica | Definición | Verde | Amarillo | Rojo |
|---|---|---|---|---|
| Net Revenue Retention | (MRR + expansión - churn) / MRR inicial | > 110% | 95-110% | < 95% |
| Gross Revenue Retention | Tasa de renovación excl. expansión | > 90% | 80-90% | < 80% |
| Health score promedio | Calificación de salud media del portfolio | > 70/100 | 55-70 | < 55 |
| ARR en riesgo | % del portfolio en salud ROJA | < 10% | 10-20% | > 20% |
| Tasa de completación de QBRs | % de cuentas elegibles con QBR completado en el trimestre | 100% | 75-99% | < 75% |
| Días desde el último contacto | Promedio del portfolio | < 30 días | 30-60 días | > 60 días |
| ARR de expansión generado por CS | Upsell y expansión sin intervención del AE | Seguimiento y crecimiento trimestral |

---

## Errores comunes de CS (y cómo Claude Code ayuda a evitarlos)

**Error 1: Sin monitoreo proactivo de salud**
`/health-score-analyzer` cada lunes fuerza una revisión estructurada del portfolio. Encuentras los problemas antes de que los clientes te los digan — no después de que hayan tomado la decisión de irse.

**Error 2: QBRs que son demos del producto**
`/qbr-builder` abre cada QBR con las prioridades de negocio del cliente, no con un recorrido por el producto. Los clientes no renuevan por una buena demo — renuevan porque les ayudaste a lograr algo.

**Error 3: Conversaciones de expansión que empiezan con el precio**
`/expansion-playbook` construye la narrativa de valor antes de cualquier discusión comercial. Hablar de precio antes de establecer la necesidad es la forma más rápida de recibir un no.

**Error 4: Gestión reactiva del churn**
El health score y la detección de señales en `/health-score-analyzer` identifican cuentas en riesgo 60-90 días antes de la renovación — cuando todavía tienes tiempo de intervenir. Esperar a que el cliente te diga que se va ya es demasiado tarde.

**Error 5: No cuantificar el ROI**
Cada QBR necesita una diapositiva de ROI. `/qbr-builder` te obliga a cuantificar lo que el cliente logró — no en funcionalidades del producto, sino en resultados de negocio. "Ahorraste 12 horas por semana por miembro del equipo" es un argumento de renovación. "Lanzamos 4 nuevas funcionalidades" no lo es.

---

## Recursos

- [Cómo empezar con Claude Code](./getting-started.md)
- [Skill de QBR builder](../skills/gtm/qbr-builder.md)
- [Skill de health score analyzer](../skills/gtm/health-score-analyzer.md)
- [Skill de expansion playbook](../skills/gtm/expansion-playbook.md)
- [Flujo de trabajo de preparación del QBR de CS](../workflows/cs-qbr-prep.md)
- [Skill de prevención de churn](../skills/marketing/churn-prevention.md)

---
