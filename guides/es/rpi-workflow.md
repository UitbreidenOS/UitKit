# RPI — Research, Plan, Implement

El flujo de trabajo RPI es un proceso multi-agente de 3 fases para desarrollo de características. Cada fase tiene agentes definidos, un artefacto de salida concreto, y una puerta que debe pasar antes de que la siguiente fase comience. El objetivo es eliminar las dos causas más comunes de esfuerzo de ingeniería desperdiciado: construir la cosa equivocada (investigación saltada) y construirla equivocada (planificación saltada).

---

## Cuándo usar RPI vs solo comenzar a codificar

**Usa RPI para:**
- Nuevas características que tomarán más de 1 día
- Cambios que tocan múltiples sistemas o equipos
- Trabajo en una base de código desconocida
- Preocupaciones transversales (autenticación, almacenamiento en caché, observabilidad) donde acertar la arquitectura es costoso de arreglar

**Salta RPI para:**
- Hotfixes e respuesta de incidente
- Cambios de configuración sin impacto de lógica
- Tareas estimadas bajo 2 horas
- Refactores puros dentro de un archivo bien entendido

La sobrecarga de RPI es aproximadamente 20–30% del tiempo total. Para cualquier cosa bajo 2 horas, la sobrecarga excede el beneficio.

---

## Estructura de carpeta

```
rpi/
└── {feature-slug}/
    ├── RESEARCH.md        ← salida de Fase 1
    ├── plan/
    │   ├── pm.md          ← historias de usuario
    │   ├── ux.md          ← flujos de usuario
    │   └── eng.md         ← plan de implementación archivo-por-archivo
    ├── PLAN.md            ← resumen de Fase 2 (artefacto de puerta)
    └── IMPLEMENT.md       ← registro de decisión de Fase 3
```

Todos los artefactos RPI viven bajo `rpi/{feature-slug}/`. No disperses documentos de investigación y plan en la base de código.

---

## Fase 1: Research

### Agentes

- **requirement-parser**: extrae requisitos funcionales y no funcionales de la solicitud de característica, identifica ambigüedades y produce una lista de requisitos estructurada
- **codebase-explorer** (herramienta Explore): mapea las partes relevantes de la base de código — patrones existentes, puntos de entrada, dependencias, características similares ya implementadas
- **product-manager**: revisa la lista de requisitos y hallazgos de base de código, luego renderiza un veredicto GO/NO-GO

### Qué se produce

`rpi/{feature-slug}/RESEARCH.md` — documento estructurado contiene:

```markdown
# Research: {Feature Name}

## Requirements
### Functional
- [lista]
### Non-functional
- [latencia, seguridad, escala, etc.]

## Ambiguities
- [preguntas abiertas que necesitan respuestas antes de planificar]

## Codebase Findings
- [archivos relevantes, patrones, abstracciones existentes]
- [características similares y cómo fueron construidas]
- [puntos de conflicto potencial]

## GO / NO-GO
**Verdict:** GO | NO-GO
**Rationale:** [3–5 oraciones]
**Blockers (if NO-GO):** [qué debe resolverse antes de re-evaluar]
```

### Qué hace un buen GO/NO-GO

El agente PM evalúa cuatro dimensiones:

| Dimensión | Señal GO | Señal NO-GO |
|-----------|-----------|--------------|
| Necesidad de mercado | Necesidad de usuario clara, respaldada por datos o solicitud explícita | Necesidad vaga o asumida |
| Factibilidad técnica | Los patrones existentes la soportan; sin bloqueadores desconocidos | Requiere tecnología no aún validada |
| Claridad de alcance | Los requisitos son específicos y limitados | Alcance abierto o en expansión |
| Costo de recurso | Se ajusta a capacidad de sprint | Requiere más que capacidad disponible |

Un NO-GO no es un rechazo — es una pausa. La sección de bloqueadores define qué la resuelve.

---

## Fase 2: Plan

**Gate:** RESEARCH.md debe existir con veredicto GO. Nunca planifies sin investigación. Nunca implementes sin plan.

### Agentes

- **product-manager**: convierte requisitos en historias de usuario con criterios de aceptación (`plan/pm.md`)
- **ux-agent**: mapea flujos de usuario de punta a punta, identifica casos límite, define estados vacíos y estados de error (`plan/ux.md`)
- **engineering-agent**: produce plan de implementación archivo-por-archivo — cada archivo que será creado o modificado, en el orden que cambios deberían ocurrir, con descripción de cada cambio (`plan/eng.md`)
- **cto-advisor**: revisa el plan de ingeniería para calidad de arquitectura, preocupaciones de escalabilidad, alineación con patrones existentes — aprueba o solicita revisión

### Estructura de salida

**`plan/pm.md`:**
```markdown
# User Stories

## Story 1: {title}
As a {role}, I want {capability} so that {benefit}.

**Acceptance criteria:**
- [ ] criterio 1
- [ ] criterio 2
```

**`plan/ux.md`:**
```markdown
# User Flows

## Happy path
[flujo paso-a-paso]

## Edge cases
- [estado vacío: qué ve el usuario]
- [estado de error: qué ve el usuario]
- [estado de carga]
```

**`plan/eng.md`:**
```markdown
# Engineering Plan

## Files to create
1. `src/features/payments/charge.ts` — nuevo manejador de carga implementando interfaz X
2. `src/api/routes/payments.ts` — nueva ruta, delega a manejador de carga

## Files to modify
3. `src/api/router.ts` — registra nueva ruta de pagos
4. `src/types/index.ts` — agrega tipos ChargeRequest y ChargeResponse

## Implementation order
Ejecuta en el orden listado. Archivo 4 (tipos) antes de archivos 1 y 2.

## Dependencies
- Requiere: SDK de Stripe ya instalado (verificar primero)
- Crea: sin nuevas dependencias externas
```

**`PLAN.md`** — resumen de una página consolidando los tres documentos de plan. La aprobación del asesor de CTO va aquí. Este es el artefacto de puerta.

### Regla de puerta

La implementación no comienza hasta que `PLAN.md` existe y el asesor de CTO lo ha aprobado. Si el asesor solicita cambios, revisa `plan/eng.md` y regenera `PLAN.md`. Sin excepciones — comenzar implementación antes que PLAN.md esté aprobado es la fuente primaria de rework en desarrollo agente.

---

## Fase 3: Implement

**Gate:** PLAN.md debe estar aprobado.

### Cómo seguir eng.md

Ejecuta cambios en el orden exacto listado en `plan/eng.md`. No reordenes basado en lo que parece conveniente — el orden refleja secuenciación de dependencia y estabilidad de compilación en cada paso.

Para cada archivo:
1. Lee la descripción en eng.md
2. Implementa el cambio
3. Ejecuta cualquier prueba relevante
4. Marca el archivo en eng.md (marca `[x]`)

### Gate de revisor de código

Después de completar 3–5 archivos (o en un límite natural como completar una capa), genera un agente code-reviewer para verificar el trabajo completado contra los criterios de aceptación en pm.md y el plan de ingeniería en eng.md. No esperes hasta implementación completa para revisar — encontrar problemas tarde es costoso.

El revisor produce un simple pass/fail con retroalimentación específica a nivel de línea. En fallo, arregla antes de continuar.

### Registro de decisión

`IMPLEMENT.md` captura decisiones tomadas durante implementación que se desvían del plan o resuelven ambigüedades no dirigidas en planificación:

```markdown
# Implementation Log: {Feature Name}

## Decisions

### [2026-05-23] Changed charge handler interface
Plan especificó interfaz X. Durante implementación encontrado X conflictos con middleware de sesión existente.
Decisión: usó interfaz Y en su lugar. Plan actualizado plan/eng.md para reflejar cambio.

### [2026-05-23] Added retry logic not in plan
Encontró SDK de Stripe lanza 503s intermitentes. Agregó backoff exponencial (3 reintentos).
Sin cambio de plan necesario — esto es aditivo y dentro de alcance.
```

Las decisiones que cambian el alcance o diseño deben señalarse de vuelta al agente de ingeniería para revisión de plan antes de implementar. Las decisiones que son puramente detalles de implementación van en IMPLEMENT.md sin requerir actualización de plan.

---

## Adaptación de RPI para Solo vs Equipo

| Fase | Solo | Equipo |
|-------|------|------|
| Research | Ejecuta requirement-parser + explorer; salta PM si característica es tuya | Todos los agentes; salida del agente PM revisada por PM humano |
| Plan | Salta agente UX para características solo backend | Todos los agentes; eng.md revisada por segundo ingeniero |
| Implement | Ingeniero único sigue eng.md | Asigna archivos a ingenieros por sección eng.md; agente revisor se ejecuta después de cada sección |

La regla central permanece igual en ambos casos: sin saltarse fases e sin implementación sin plan aprobado. Desarrollo solo no es razón para saltarse investigación — es la razón primaria para ser más disciplinado al respecto.

---
