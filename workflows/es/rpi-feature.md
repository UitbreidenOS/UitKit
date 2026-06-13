# Flujo de trabajo de característica RPI

Investigación, Plan, Implementación — un flujo de trabajo de tres fases y múltiples agentes para enviar características con control riguroso del alcance. Cada fase produce un artefacto concreto y debe completarse antes de que comience la siguiente.

---

## Cuándo usarlo

- Solicitudes de características donde el área de superficie es poco clara al inicio
- Trabajo que cruza múltiples archivos o servicios
- Cualquier tarea donde un plan incorrecto es más costoso que el tiempo dedicado a planificar
- Situaciones donde múltiples perspectivas (PM, UX, Ingeniería) deberían reconciliarse antes de una sola línea de código

---

## Fases

### Fase 1 — Investigación (`/rpi:research`)

**Entrada:** solicitud de característica bruta (una oración a un párrafo)

**Agentes:**
- **Agente Explorar** — lee el codebase existente para patrones relevantes a la solicitud: características similares, modelos de datos, formas de API, abstracciones existentes
- **Agente Investigación** — investiga cualquier dependencia externa: APIs de terceros, bibliotecas, documentación, cambios de ruptura
- **Agente Gerente de Producto** — sintetiza hallazgos de exploración e investigación en un documento de requisitos estructurado e emite una recomendación GO/NO-GO con justificación explícita

**Puerta:** La Fase 2 no puede comenzar hasta que el agente PM haya emitido una recomendación GO. Si se devuelve NO-GO, la salida explica por qué y sugiere una solicitud revisada.

**Salida:** `rpi/{feature-slug}/RESEARCH.md`

```markdown
# Investigación: {feature-slug}

## Requisitos
[Lista estructurada derivada de la solicitud bruta]

## Hallazgos de Codebase
[Patrones existentes relevantes, puntos de entrada, modelos]

## Hallazgos Externos
[APIs, bibliotecas, notas de compatibilidad]

## Recomendación
GO / NO-GO

## Justificación
[Por qué — específico, no genérico]
```

---

### Fase 2 — Plan (`/rpi:plan`)

**Precondición:** `rpi/{feature-slug}/RESEARCH.md` existe y contiene una recomendación GO.

**Agentes (se ejecutan en paralelo):**
- **Agente PM** — escribe historias de usuario y criterios de aceptación de los requisitos
- **Agente UX** — mapea el flujo de usuario, casos extremos, estados de error y consideraciones de accesibilidad
- **Agente Ingeniería** — produce un diseño técnico: archivos para crear o modificar, cambios del modelo de datos, contrato de API, estimación de complejidad

**Revisión:**
- **Agente Asesor CTO** — lee los tres artefactos y revisa las preocupaciones arquitectónicas, consistencia y preocupaciones transversales faltantes (autenticación, observabilidad, migraciones). Devuelve una lista de preocupaciones sin resolver si las hay; los agentes paralelos las abordan antes de que se finalice PLAN.md.

**Puerta:** La Fase 3 no puede comenzar hasta que PLAN.md esté escrito y el asesor CTO no haya devuelto preocupaciones sin resolver.

**Salida:**
- `rpi/{feature-slug}/plan/pm.md`
- `rpi/{feature-slug}/plan/ux.md`
- `rpi/{feature-slug}/plan/eng.md`
- `rpi/{feature-slug}/PLAN.md` (resumen consolidado, una página)

---

### Fase 3 — Implementar (`/rpi:implement`)

**Precondición:** `rpi/{feature-slug}/PLAN.md` existe.

**Proceso:**
1. Lea PLAN.md para extraer la lista ordenada de cambios de archivo del plan de ingeniería
2. Implemente un componente a la vez siguiendo la secuencia en `eng.md`
3. Después de cada componente principal (no cada archivo), delegue al **agente revisor de código** — verifica el componente contra los criterios de aceptación en `pm.md` y el diseño técnico en `eng.md`
4. El revisor aprueba el componente o devuelve solicitudes de cambio específicas; aborde todas las solicitudes de cambio antes de pasar al siguiente componente
5. Al completar, escriba el registro de decisiones

**Salida:** implementación funcional + `rpi/{feature-slug}/IMPLEMENT.md`

```markdown
# Registro de implementación: {feature-slug}

## Decisiones
[Lista de decisiones de implementación que se desviaron del plan, con justificación]

## Diferido
[Cualquier cosa explícitamente diferida a un seguimiento]

## Completado
[Lista de verificación de componente final con aprobación del revisor anotada]
```

---

## Diseño del directorio

```
rpi/
  {feature-slug}/
    RESEARCH.md
    PLAN.md
    IMPLEMENT.md
    plan/
      pm.md
      ux.md
      eng.md
```

---

## Ejemplo

```
Usuario: /rpi:research "agregar exportación CSV a la tabla de pedidos"

→ RESEARCH.md escrito, GO emitido

Usuario: /rpi:plan

→ plan/pm.md, ux.md, eng.md escritos; revisión CTO aprobada; PLAN.md escrito

Usuario: /rpi:implement

→ La implementación procede componente por componente con puertas de revisión de código
```

---
