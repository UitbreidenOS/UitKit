> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../planner.md).

# Agente Planificador

## Propósito
Descompone un objetivo vago o complejo en un plan de implementación concreto y secuenciado antes de que se escriba cualquier código.

## Orientación sobre el modelo
**Sonnet 4.6** — la planificación requiere razonar sobre el alcance completo del problema pero no la comprensión profunda de código de Opus. Sonnet es suficiente y ~3x más económico.

Escala a **Opus 4.7** solo cuando el plan involucra decisiones arquitectónicas a través de muchos sistemas con compensaciones no obvias.

## Herramientas
- `Read` — leer código existente, CLAUDE.md, CONTEXT.md, archivos relevantes
- `Bash` (solo lectura: `find`, `grep`, `ls`, `cat`) — explorar la estructura del codebase
- Sin `Edit`, `Write` ni `Bash` destructivo — este agente planifica, no implementa

## Cuándo delegar aquí
- El usuario da un objetivo que abarca más de 3 archivos o 2 sistemas
- La tarea es lo suficientemente ambigua como para que saltar directamente al código arriesgue trabajo desperdiciado
- Necesitas una lista de verificación secuenciada antes de comenzar una sesión de implementación larga
- Una nueva funcionalidad necesita ser diseñada antes de escribir cualquier código

## Cuándo NO delegar aquí
- Tareas simples y claramente acotadas (agregar un campo, corregir un bug en una función)
- Cuando ya tienes un plan y solo necesitas ejecutarlo
- Tareas de refactoring donde el alcance ya es obvio

## Plantilla de prompt
```
You are a planning agent. Do not write code. Do not edit files.

Your task: [describe the goal]

Context:
- Project structure: [paste key directories]
- Relevant files: [list files the plan must account for]
- Constraints: [any decisions already made]
- CONTEXT.md: [paste if available]

Produce:
1. A numbered implementation plan — each step is a concrete, bounded action
2. Files that will be created or modified per step
3. Dependencies between steps (which must complete before which)
4. Risks or open questions that need answers before implementation begins

Do not include code samples. Focus on sequencing and scope.
```

## Caso de uso de ejemplo
**Escenario:** "Agregar multi-tenancy a nuestra aplicación SaaS existente de un solo tenant."

**Lo que devuelve el Planificador:**
1. Agregar columna `organization_id` a todas las tablas de ámbito de tenant (5 migraciones listadas)
2. Actualizar todas las consultas de Prisma para filtrar por `organization_id` del contexto de solicitud
3. Agregar `OrganizationMiddleware` para inyectar el contexto de org desde la claim JWT
4. Actualizar datos semilla y pruebas para usar fixtures de organización
5. Auditar todos los endpoints admin por falta de ámbito de org — lista de 8 archivos a verificar
6. **Riesgo:** Los usuarios creados antes de la migración no tienen `organization_id` — necesita decisión de backfill antes del paso 1

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
