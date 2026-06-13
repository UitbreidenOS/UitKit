# Guía AGENTS.md

AGENTS.md es un compañero de CLAUDE.md — hace que sus instrucciones de proyecto sean portátiles en todos los asistentes de codificación de IA, no solo Claude Code.

## ¿Qué es AGENTS.md?

Mientras que `CLAUDE.md` es específico de Claude Code, `AGENTS.md` es una convención comunitaria para compatibilidad entre agentes. El mismo proyecto puede ser usado con:
- Claude Code (`CLAUDE.md`)
- Cursor (lee `AGENTS.md` o `cursor.md`)
- OpenAI Codex CLI
- Gemini CLI
- Cualquier agente que siga la convención AGENTS.md

## CLAUDE.md vs AGENTS.md

| | CLAUDE.md | AGENTS.md |
|---|---|---|
| **Lo lee** | Solo Claude Code | Claude Code + Cursor + Codex + otros |
| **Ubicación** | Raíz del proyecto | Raíz del proyecto |
| **Prioridad Claude Code** | Primaria | Secundaria (CLAUDE.md tiene precedencia) |
| **Formato** | Markdown | Markdown |
| **Propósito** | Contexto específico de Claude | Contexto de agente universal |

## Crear AGENTS.md

Manténgalo enfocado en lo que cualquier asistente de codificación de IA necesita para ser efectivo en su proyecto — no funciones específicas de Claude:

```markdown
# AGENTS.md

## Descripción general del proyecto
[2-3 oraciones: qué hace este proyecto, a quién sirve]

## Pila tecnológica
- Idioma: [TypeScript 5.4]
- Marco: [Next.js 15, App Router]
- Base de datos: [PostgreSQL vía Drizzle ORM]
- Auth: [Better Auth]
- Implementación: [Railway]

## Comandos
- Dev: `npm run dev`
- Pruebas: `npm test`
- Build: `npm run build`
- Lint: `npm run lint`
- Migración de DB: `npx drizzle-kit migrate`

## Directorios clave
- `src/app/` — páginas Next.js App Router
- `src/components/` — componentes UI compartidos
- `src/lib/` — utilidades y ayudantes
- `src/db/` — esquema de base de datos y consultas

## Convenciones de codificación
- Modo estricto de TypeScript — sin `any`
- Componentes del servidor de forma predeterminada; `use client` solo cuando sea necesario
- Commits convencionales: feat/fix/chore/docs/refactor
- Pruebas requeridas para la nueva lógica empresarial

## No modificar
- `src/db/schema.ts` — coordine los cambios de esquema con el equipo
- `.env.example` — actualizar al agregar nuevas variables env
- `src/middleware.ts` — coordine los cambios de autenticación

## Tareas comunes
- Agregar una ruta API: crear `src/app/api/[name]/route.ts`
- Agregar un componente: crear en `src/components/[name].tsx`
- Consulta de base de datos: agregar a `src/db/queries/[entity].ts`
```

## Qué incluir vs. excluir

**Incluir:**
- Comandos de compilación y prueba
- Estructura de directorios y propósito
- Convenciones de codificación que se aplican a todos los agentes
- Archivos que no deben modificarse sin coordinación

**Excluir:**
- Funciones específicas de Claude Code (hooks, agentes, `/skills`) → ponerlas en CLAUDE.md
- Secretos o credenciales → nunca en ningún archivo rastreado
- Cosas ya obvias en el código

## Generar automáticamente AGENTS.md

Pida a Claude Code que lo genere:

```
"Lee el proyecto y genera un archivo AGENTS.md.
Enfócate en: pila técnica, directorios clave, comandos, convenciones y qué no tocar.
Mantenlo bajo 80 líneas — lo suficientemente conciso para que cualquier agente lo lea completamente."
```

## Mantenerlo sincronizado

AGENTS.md debe actualizarse cuando:
- La pila tecnológica cambia (actualización de marco, nuevo servicio)
- Nuevos desarrolladores o agentes se unen al proyecto
- Los directorios clave se reestructuran
- Los comandos cambian (ejecutor de pruebas, proceso de compilación)

Agregue un recordatorio en su CLAUDE.md:
```markdown
## Mantenimiento
Cuando cambie la pila tecnológica o los comandos: actualice CLAUDE.md y AGENTS.md
```

## Relación con CLAUDE.md

Un proyecto típico tiene ambos:
- **AGENTS.md**: contexto universal (80 líneas, enfocado en lo que cualquier agente necesita)
- **CLAUDE.md**: adiciones específicas de Claude (hooks para cargar, agentes para usar, patrones específicos de Claude Code)

CLAUDE.md puede hacer referencia a AGENTS.md:
```markdown
# CLAUDE.md

Ver AGENTS.md para descripción general del proyecto, pila y comandos.

## Específico de Claude Code
- Cargar /skills/backend/nodejs/nextjs al inicio de sesión
- Ejecutar /ship-gate antes de cualquier implementación en producción
- Usar /agents/advisors/cto-advisor para preguntas de arquitectura
```

---
