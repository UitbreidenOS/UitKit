# Claude para CTOs y Tech Leads

Todo lo que un CTO, VP de Ingeniería o Tech Lead necesita para ejercer el liderazgo de ingeniería potenciado por IA — decisiones de arquitectura, estrategia de ingeniería, contratación técnica, topología de equipo, priorización de deuda técnica e informes para el consejo.

---

## Para quién es esto

Eres un CTO, VP de Ingeniería, Principal Engineer o Tech Lead cuyo trabajo es dirigir la dirección técnica de una empresa u organización de ingeniería. Eres el puente entre la estrategia de negocio y la ejecución de ingeniería. Tomas decisiones de build vs. buy, defines la topología del equipo, realizas revisiones de incidentes, evalúas trade-offs de arquitectura e informas al consejo — a menudo en la misma semana.

**Antes de Claude Code:** ADR: 90 minutos. Documento de estrategia de ingeniería: una semana de tardes. Kit de entrevista para una nueva contratación senior: 3 horas. Informe de salud técnica para el consejo: media jornada.

**Después:** ADR en 20 minutos. Esquema de estrategia de ingeniería en 45 minutos. Kit de entrevista en 30 minutos. Informe técnico para el consejo en 25 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar el stack completo de CTO / tech lead
npx claudient add skills productivity/adr-writer
npx claudient add skills productivity/tech-debt-tracker
npx claudient add skills devops-infra/platform-engineering
npx claudient add skills productivity/vertical-slice-planner
npx claudient add skills productivity/spec-driven-workflow
npx claudient add skills productivity/engineering-strategy
npx claudient add skills productivity/tech-interview-kit
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/vpe-advisor
npx claudient add agents core/architect
```

---

## Tu stack de Claude Code para CTO

### Skills (comandos slash)

| Skill | Qué hace | Cuándo usarla |
|---|---|---|
| `/engineering-strategy` | Documento de estrategia de ingeniería: visión técnica, build vs. buy, topología de equipo, roadmap de 12 meses | Planificación anual/semestral, preparación para el consejo, nuevo rol de CTO |
| `/adr-writer` | Architecture Decision Record — documenta la decisión, el contexto, los trade-offs y las consecuencias | Tras cada decisión arquitectónica significativa |
| `/tech-interview-kit` | Retos de código, prompts de diseño de sistemas, rúbricas de evaluación, plantillas de debrief | Antes de cualquier ronda de contratación técnica |
| `/tech-debt-tracker` | Inventario de deuda, marco de priorización, propuesta de inversión para liderazgo | Revisiones trimestrales de deuda técnica |
| `/vertical-slice-planner` | Divide épicas en verticales entregables con criterios de aceptación claros | Planificación de sprints y releases |
| `/spec-driven-workflow` | Redacción de especificaciones técnicas — enunciado del problema, requisitos, opciones de diseño | Antes de construir funcionalidades complejas |
| `/platform-engineering` | Estrategia de plataforma, experiencia del desarrollador, CI/CD, herramientas internas | Trabajo del equipo de plataforma/infra |

### Agentes

| Agente | Modelo | Cuándo invocarlo |
|---|---|---|
| `cto-advisor` | Opus | Decisiones estratégicas de alto impacto — diseño organizacional, build vs. buy, apuestas tecnológicas |
| `vpe-advisor` | Sonnet | Ejecución y salud del equipo — velocidad, contratación, excelencia operativa |
| `architect` | Opus | Diseño de sistemas complejos — sistemas distribuidos, arquitectura de datos, escalabilidad |

---

## Flujo de trabajo diario

### Chequeo matutino de salud de ingeniería (15 minutos)

```
Chequeo rápido de salud de la organización de ingeniería para [FECHA]:

Métricas de ayer:
- Despliegues a producción: [X] (objetivo: [N por día])
- Despliegues fallidos / rollbacks: [X]
- Incidentes abiertos: [X] / Incidentes P1 en los últimos 7 días: [X]
- Tiempo de respuesta a P1 (último incidente): [X minutos] (objetivo: < 30 min)
- Pull requests fusionados: [X] / abiertos > 5 días: [X] (PRs de larga vida = riesgo de merge)
- Escalaciones de guardia: [X]

Pulso del equipo:
- ¿Algún engineer bloqueado por > 1 día? [sí/no + quién]
- ¿Algún equipo por debajo del 70% de cumplimiento del sprint? [sí/no]
- ¿Algún deadline crítico en los próximos 14 días? [lista]

Marca: ¿qué requiere mi atención hoy (ordenado por urgencia × impacto)?
```

---

### Trabajo de arquitectura y diseño

**Para cualquier decisión técnica significativa:**

```
/adr-writer

Decisión: [¿qué estamos decidiendo?]
Contexto: [¿por qué se necesita esta decisión ahora? ¿Cuál es el driver de negocio o técnico?]
Opciones consideradas:
1. [Nombre opción A]: [breve descripción]
2. [Nombre opción B]: [breve descripción]
3. [Nombre opción C o "no hacer nada"]

Restricciones: [presupuesto, plazo, dependencias del stack existente, experiencia del equipo]
Criterios de evaluación: [qué importa más — rendimiento / mantenibilidad / coste / velocidad de entrega]

Escribe un ADR completo con: estado, contexto, decisión, consecuencias y trade-offs.
```

**Para funcionalidades nuevas complejas:**

```
/spec-driven-workflow

Funcionalidad: [nombre]
Objetivo de negocio: [qué resultado busca]
Enunciado del problema: [qué problema de usuario o sistema resolvemos]
Restricciones: [técnicas, de plazo, de capacidad del equipo]

Produce: especificación técnica con enunciado del problema, requisitos (funcionales + no funcionales), opciones de diseño con análisis de trade-offs, enfoque recomendado y preguntas abiertas que deben resolverse antes de empezar el trabajo.
```

---

### 1:1s de equipo y coaching

Usa el agente `vpe-advisor` para preparar conversaciones difíciles de gestión de ingeniería:

```
@vpe-advisor

Tengo un 1:1 mañana con [rol, nivel de seniority].
Contexto: [qué ocurre — rendimiento, desarrollo profesional, fricción en el equipo, pregunta de alcance]

Ayúdame a:
- Enmarcar la conversación de forma productiva (no como queja o advertencia de rendimiento)
- Hacer preguntas que me den información real
- Preparar una respuesta si plantean [preocupación específica]
- Fijar un resultado concreto para la conversación
```

---

### Informes para el consejo y el liderazgo

```
/engineering-strategy

Escribe la sección de ingeniería del deck del consejo para [TRIMESTRE/MES].

Audiencia: consejo y C-suite (no técnicos, enfocados en riesgo y ROI)
Métricas clave a reportar:
- Frecuencia de despliegue: [actual vs. trimestre anterior vs. objetivo]
- Fiabilidad (uptime): [actual vs. objetivo]
- Seguridad: [incidentes, vulnerabilidades corregidas]
- Velocidad de ingeniería: [alto nivel: ¿aceleramos o desaceleramos?]
- Headcount: [actual / contrataciones planeadas / bajas]
- Inversión en deuda técnica: [% de capacidad de sprint dedicado este trimestre]

Highlights: [principales cosas que hemos entregado]
Riesgos: [qué podría descarrilar la ingeniería en los próximos 90 días]
Solicitudes: [qué necesitas del consejo — presupuesto, decisiones, apoyo]

Formato: contenido equivalente a 3-5 diapositivas (resumen ejecutivo + detalles). Lenguaje claro, sin jerga.
```

---

### Priorización de deuda técnica

```
/tech-debt-tracker

Inventario de deuda técnica actual:
[Lista o describe tus elementos de deuda conocidos — o pega desde un doc/Jira]

Para cada elemento: nombre, qué ralentiza, coste estimado de corrección, riesgo si no se aborda

Marco de priorización:
Puntúa cada elemento:
- Impacto en negocio si NO se corrige: 1-5 (5 = riesgo existencial)
- Impacto en velocidad del desarrollador: 1-5 (5 = el equipo gasta > 20% del tiempo trabajando alrededor de él)
- Esfuerzo para corregir: 1-5 (1 = corrección rápida, 5 = esfuerzo de varios sprints)

Puntuación de prioridad = (impacto en negocio + impacto en velocidad) / esfuerzo

Produce:
- Lista ordenada con puntuaciones
- Los 3 elementos principales a abordar el próximo trimestre con el caso de negocio para cada uno
- Asignación de capacidad propuesta (% de capacidad de sprint para deuda técnica)
- Resumen para directivos: "Esto es lo que nos está costando nuestra deuda técnica y qué se desbloquea al corregirla"
```

---

## Ritmo semanal

### Lunes — Alineación de estrategia de ingeniería

```
/engineering-strategy

Chequeo semanal de alineación:
- ¿Estamos ejecutando conforme a la estrategia de 12 meses? ¿Qué está derivando?
- ¿Qué OKRs están en riesgo este trimestre?
- ¿Funciona la topología del equipo? ¿Hay fallos de coordinación que deba abordar?
- Decisiones clave que debo tomar esta semana: [lista]

Dame un memo de enfoque semanal de 5 viñetas que pueda compartir con mis team leads.
```

### Miércoles — Revisión de contratación técnica

Usa `/tech-interview-kit` cuando haya una contratación en proceso:

```
/tech-interview-kit

Tengo un proceso de entrevista para [NIVEL] [ROL] en marcha.
Entrevistadores: [lista + qué etapa lidera cada uno]

Ayúdame a:
- Revisar las etapas de la entrevista en busca de brechas (¿estamos evaluando las cosas correctas para este nivel?)
- Preparar la plantilla de debrief para el viernes
- Calibrar qué significa "el estándar" para este rol específico vs. la rúbrica general

[Si se entregó una prueba técnica: pega la entrega y pide un marco de revisión]
```

### Viernes — Revisión de build vs. buy y comunicación con stakeholders

```
@cto-advisor

Decisión de build vs. buy con la que estoy lidiando: [describe la capacidad, opciones, plazo, coste]

Mis restricciones:
- Ancho de banda de ingeniería: [utilización actual — ¿estamos al límite?]
- Presupuesto: [disponible para herramientas/servicios]
- Plazo: [cuándo necesitamos esta capacidad]
- Experiencia de nuestro equipo en este dominio: [sólida / débil / ninguna]
- Importancia estratégica: [¿es un diferenciador o una commodity?]

Dame una recomendación con tus 3 razones más sólidas y qué cambiaría tu opinión.
```

---

## Plan de incorporación de 30 días (nuevo CTO)

### Semana 1 — Escuchar y diagnosticar

- Instala todas las skills de CTO y configura tu tooling
- Ejecuta `/engineering-strategy` en modo auditoría: "Describe el estado actual de la ingeniería aquí. ¿Qué funciona? ¿Qué está roto? ¿Cuáles son los riesgos clave?"
- Identifica los 3 principales puntos de dolor técnicos del equipo (pregunta, no asumas)
- Mapea la topología del equipo actual — quién es responsable de qué, dónde los traspasos son lentos
- Lee los últimos 12 meses de ADRs (si existen) para entender las decisiones previas

### Semana 2 — Documentar decisiones ya tomadas

- Escribe ADRs para cualquier decisión arquitectónica no documentada que descubras
- Ejecuta `/tech-debt-tracker` — obtén un inventario base, aunque sea incompleto
- Revisa el pipeline de contratación — ¿hay roles abiertos y qué nivel se ha fijado como estándar?
- Comprueba la línea base de métricas DORA (frecuencia de despliegue, MTTR, tasa de fallos de cambio)

### Semana 3 — Primera comunicación estratégica

- Redacta tu primer documento de estrategia de ingeniería usando `/engineering-strategy`
- Valídalo con tus 2-3 engineers más senior antes de publicarlo
- Preséntalo al CEO o al liderazgo: esto es lo que veo, este es mi plan para 12 meses
- Realiza tu primera entrevista técnica con el nuevo kit de `/tech-interview-kit`

### Semana 4 — Proceso y ritmo

- Establece el chequeo de salud de ingeniería como ritual diario de 15 minutos
- Lanza una sesión de priorización de deuda técnica con los team leads
- Fija tus objetivos de métricas DORA y publícalos al equipo
- Entrega el primer informe de ingeniería para el consejo

---

## Integraciones de herramientas

### GitHub (código y PRs)

```bash
# Claude Code tiene integración nativa con GitHub mediante gh CLI
# Accede a revisiones de PRs, salud del código, estado de despliegue directamente

gh pr list --state open
gh run list --limit 10  # Estado del pipeline CI/CD
```

### Linear / Jira (planificación de ingeniería)

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "tu-api-key"
      }
    }
  }
}
```

Uso: planificación de sprints con `/vertical-slice-planner`, seguimiento de deuda técnica, visibilidad del roadmap.

### Datadog / Honeycomb (observabilidad)

Exporta datos de incidentes y métricas DORA → pégalos en el prompt de chequeo de salud de ingeniería para análisis de tendencias.

### Notion / Confluence (documentación)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "tu-token"
      }
    }
  }
}
```

Uso: documentos de estrategia de ingeniería, ADRs, topología de equipo, backlog de deuda técnica.

---

## Métricas a seguir

| Métrica | Objetivo (etapa de crecimiento) | Señal de alerta |
|---|---|---|
| Frecuencia de despliegue | Diario o varias veces/semana | < 1/semana |
| Lead time para cambios | < 1 día | > 1 semana |
| Tasa de fallos de cambio | < 10% | > 20% |
| MTTR (tiempo medio de recuperación) | < 1 hora | > 4 horas |
| Disponibilidad de ingeniería (equipo) | > 85% | < 70% |
| Deuda técnica % de capacidad de sprint | 15-20% | > 30% o < 10% |
| Tiempo de contratación (roles de eng) | < 45 días | > 90 días |
| Tasa de aceptación de ofertas | > 80% | < 60% |
| Tiempo hasta el primer PR de un nuevo engineer | < 3 días | > 1 semana |

---

## Errores comunes y cómo Claude Code ayuda a evitarlos

**Error 1: Decisiones arquitectónicas tomadas verbalmente, nunca documentadas**
`/adr-writer` tarda 20 minutos por decisión. Sin ADRs, el conocimiento tribal se convierte en deuda técnica.

**Error 2: Contratar sin una rúbrica calibrada**
`/tech-interview-kit` fuerza la calibración antes del primer candidato. Los entrevistadores que no se ponen de acuerdo en qué significa "bueno" contratarán de forma inconsistente.

**Error 3: Deuda técnica abordada de forma reactiva (solo cuando algo falla)**
`/tech-debt-tracker` convierte la deuda en un caso de negocio. El liderazgo financia lo que tiene un coste definido y un ROI.

**Error 4: Estrategia de ingeniería que existe solo como un deck de diapositivas**
`/engineering-strategy` produce un documento vivo con métricas. Revísalo trimestralmente.

**Error 5: Informes de ingeniería para el consejo que parecen en un idioma extranjero**
Usa `/engineering-strategy` para escribir para audiencias no técnicas. Las métricas DORA necesitan una frase de traducción antes de significar algo para un consejo.

---

## Recursos

- [Guía de Architecture Decision Records](./adr-writing.md)
- [Skill de estrategia de ingeniería](../skills/productivity/engineering-strategy.md)
- [Kit de entrevista técnica](../skills/productivity/tech-interview-kit.md)
- [Tracker de deuda técnica](../skills/productivity/tech-debt-tracker.md)
- [Flujo de trabajo semanal del CTO](../workflows/cto-weekly.md)
- [Cómo empezar con Claude Code](./getting-started.md)

---
