# Ingeniería de Compuestos

Transformación de error a lección que hace que las futuras sesiones de Claude Code sean progresivamente más inteligentes. Cada error en una sesión se convierte en una entrada estructurada en `LESSONS.md`. Las futuras sesiones cargan este archivo y evitan los mismos errores sin que se les pida.

---

## Cuándo usar

- Cualquier proyecto a largo plazo con sesiones recurrentes de Claude Code
- Bases de código con convenciones no obvias o trampas que siempre hacen tropezar a Claude
- Equipos que usan Claude Code en un repositorio compartido — las lecciones escritas una vez se aplican a todos los colaboradores
- Cualquier situación en la que se encuentra corrigiendo la misma clase de error más de una vez

---

## Idea central

El conocimiento se mezcla. Un solo error, una vez documentado, nunca se repite. Diez sesiones después, Claude ingresa al código con conciencia de cada trampa que se descubrió en los nueve anteriores. El costo son segundos por lección; la recompensa es acumulativa.

---

## Estructura

### `LESSONS.md` — registro de solo adjunto

Vive en la raíz del proyecto (o donde sea que viva CLAUDE.md). Se hace referencia en CLAUDE.md para que se cargue al inicio de cada sesión:

```markdown
<!-- In CLAUDE.md -->
@LESSONS.md
```

### Formato de entrada de lección

```markdown
## [Date] — [Brief title]
**Mistake:** [What went wrong — specific, not "Claude made an error"]
**Root cause:** [Why it happened — missing context, wrong assumption, ambiguous convention]
**Correct approach:** [What to do instead — concrete and actionable]
**Context:** [Scope — is this codebase-specific, language-specific, or universal?]
```

---

## Flujo de trabajo

### Durante una sesión

Cuando Claude comete un error y lo corrige, escriba la lección inmediatamente:

```
"Update LESSONS.md: tried to import UserService from lib/users — correct path is services/users/UserService.ts (barrel exports not used in this project)."
```

Claude añade la entrada en formato estándar. La lección se activa para el resto de la sesión y todas las futuras sesiones.

### Al final de la sesión (opcional pero de alto valor)

Antes de cerrar una sesión larga, pídale a Claude que revise la sesión en busca de errores no documentados:

```
"Review this session for any mistakes that aren't yet in LESSONS.md and add entries for them."
```

Claude escanea la conversación, identifica correcciones y cambios de curso, y agrega entradas estructuradas para cada uno. Esto lleva 30–60 segundos y captura lecciones que se escaparon en el flujo de trabajo.

### Al inicio de la sesión

Debido a que CLAUDE.md hace referencia a `@LESSONS.md`, Claude lee el registro de lecciones completo antes de responder al primer mensaje. No se requiere carga manual.

---

## Ejemplo LESSONS.md

```markdown
# Lessons

## 2026-05-10 — Prisma schema location
**Mistake:** Looked for schema.prisma in the project root.
**Root cause:** Default Prisma assumption — project uses a non-standard layout.
**Correct approach:** Schema lives at infra/db/schema.prisma. Client config points there via prisma.schema in package.json.
**Context:** This project only.

## 2026-05-14 — API response envelope
**Mistake:** Returned { data: result } directly from route handlers.
**Root cause:** Generic REST convention assumed. This API uses { ok: true, payload: result }.
**Correct approach:** All route handlers must return the standard envelope. See src/lib/response.ts helpers.
**Context:** This project only.

## 2026-05-18 — Test database
**Mistake:** Tests were writing to the development database.
**Root cause:** DATABASE_URL not overridden in test setup.
**Correct approach:** vitest.setup.ts sets process.env.DATABASE_URL to TEST_DATABASE_URL. Check that TEST_DATABASE_URL is set before running tests.
**Context:** This project only.
```

---

## Reglas

- **Solo adjuntar.** No elimine ni sobrescriba entradas. Si una lección se reemplaza, agregue una nueva entrada anotando la corrección y la fecha.
- **Específico, no genérico.** "No hagas suposiciones" no es una lección. "Las respuestas de la API usan `{ ok, payload }` no `{ data }`" es una lección.
- **El alcance del contexto es obligatorio.** Marque si la lección se aplica a esta base de código, este idioma o universalmente. Esto previene el sobreajuste en las convenciones específicas del proyecto.
- **Escribe inmediatamente.** Las lecciones escritas en el momento de la corrección son más precisas que los resúmenes retrospectivos.

---
