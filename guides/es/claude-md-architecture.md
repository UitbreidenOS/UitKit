> 🇪🇸 Versión en español. [Versión en inglés](../claude-md-architecture.md).

# Guía de arquitectura CLAUDE.md

Cómo estructurar `CLAUDE.md` para proyectos de cualquier tamaño — desde repositorios en solitario hasta grandes monorepos con múltiples equipos.

---

## Para qué sirve CLAUDE.md

`CLAUDE.md` es la memoria de proyecto de Claude Code. Se carga automáticamente en cada sesión y le indica a Claude:
- Qué es esta base de código y cómo está estructurada
- Cómo ejecutarla, probarla y desplegarla
- Reglas y convenciones que siempre deben aplicarse
- Qué NO hacer

Un buen `CLAUDE.md` elimina las instrucciones repetidas. Uno malo se ignora, es demasiado largo o contradice lo que Claude ya sabe.

---

## Los tres niveles

Claude Code lee tres archivos CLAUDE.md, fusionados en orden (el posterior anula el anterior):

```
~/.claude/CLAUDE.md           # User-level: your personal preferences across all projects
{project-root}/CLAUDE.md      # Project-level: checked into the repo, applies to everyone
{project-root}/.claude/       # Local-level (gitignored): your overrides for this project
```

**Nivel de usuario** — tus reglas personales: estilo de respuesta preferido, herramientas que siempre quieres, preferencias de formato. No versionado.

**Nivel de proyecto** — las reglas compartidas del equipo: cómo ejecutar el proyecto, convenciones de código, áreas prohibidas. Versionado en git.

**Nivel local** — tus anulaciones personales para este proyecto específico: claves API personales, instrucciones en progreso, cosas no listas para compartir con el equipo.

---

## Plantilla CLAUDE.md

Esta es la estructura que funciona para la mayoría de los proyectos. Copia y rellena tus detalles.

```markdown
# {Project Name}

{One sentence describing what this project does and who it's for.}

---

## Architecture

{Describe the high-level architecture in 3–5 sentences. What are the main components? How do they interact?}

### Directory structure
{Show the important directories and what lives there. Skip boilerplate.}

---

## Key commands

{The commands developers run every day. Be exact — copy-paste ready.}

\`\`\`bash
{dev-start}   # Start development server
{test}        # Run the test suite
{lint}        # Run linter
{build}       # Production build
\`\`\`

---

## Conventions

### Code style
{Describe the style conventions that aren't enforced by the linter — naming patterns, file organisation, patterns to follow.}

### Patterns to use
{Describe the architectural patterns in use. E.g., "Use the repository pattern for all data access" or "Server Components by default, Client Components only when interactive."}

### Patterns to avoid
{Describe common mistakes or anti-patterns that apply to this specific codebase. E.g., "Never call the DB from a route handler — use a service layer."}

---

## What not to touch

{List files, directories, or systems Claude should not modify without explicit instruction.}

- `migrations/` — never edit migration files; create new ones with the migration CLI
- `public/vendor/` — third-party files, don't edit

---

## Testing

{Describe how tests are organised and what kind of coverage is expected.}

\`\`\`bash
{test-unit}          # Run unit tests
{test-integration}   # Run integration tests
{test-e2e}           # Run end-to-end tests
\`\`\`

Test files live next to source files: `foo.ts` → `foo.test.ts`.

---

## Environment

{List required env vars and how to get them.}

\`\`\`bash
DATABASE_URL=...   # PostgreSQL connection string — see 1Password > {vault name}
API_KEY=...        # {service name} API key — see .env.example
\`\`\`

Start local services: \`docker compose up -d\`
```

---

## Guía de dimensionamiento

| Tamaño del proyecto | Tamaño de CLAUDE.md | Qué incluir |
|---|---|---|
| Solo, simple | 20–50 líneas | Comandos clave, convenciones principales, lista "no tocar" |
| Equipo, servicio único | 50–150 líneas | Plantilla completa arriba |
| Multi-servicio | 150–300 líneas | Resumen de arquitectura + punteros por servicio |
| Monorepo | 100–200 líneas en root + CLAUDE.md por paquete | Root = reglas globales, paquetes = reglas locales |

**Límite absoluto:** Mantén CLAUDE.md por debajo de 500 líneas. Por encima de eso, se convierte en ruido. Las reglas que no se siguen no ayudan.

---

## Estructura monorepo

Para monorepos, usa múltiples archivos CLAUDE.md — uno en el root y uno en cada paquete que tenga sus propias convenciones.

```
repo/
├── CLAUDE.md                 # Global: shared conventions, monorepo tooling, workspace commands
├── packages/
│   ├── api/
│   │   └── CLAUDE.md         # API-specific: FastAPI patterns, DB access, auth
│   ├── web/
│   │   └── CLAUDE.md         # Frontend-specific: Next.js patterns, component rules
│   └── shared/
│       └── CLAUDE.md         # Shared lib: what this exports, how to add to it
└── infra/
    └── CLAUDE.md             # Infra-specific: Terraform conventions, cloud setup
```

**CLAUDE.md raíz** cubre:
- Qué contiene el monorepo y cómo se relacionan los paquetes
- Comandos de workspace (`npm run build --workspace=api`)
- Convenciones compartidas (formato de commit, nomenclatura de ramas, proceso de PR)
- Dependencias entre paquetes y qué está permitido

**CLAUDE.md por paquete** cubre:
- Solo lo que difiere del root
- Patrones y anti-patrones específicos del paquete
- Comandos locales y estrategia de pruebas

---

## Reglas que funcionan

### Escribe reglas como restricciones, no como peticiones
```markdown
# Bad (ignored)
Please try to use the service layer for database access.

# Good (followed)
Never call the database from a controller or route handler.
All DB access must go through a service in src/services/.
```

### Sé específico, no genérico
```markdown
# Bad (Claude already knows this)
Write clean, readable code.
Follow best practices.
Use meaningful variable names.

# Good (project-specific)
Use snake_case for Python, camelCase for TypeScript.
All public functions must have type annotations.
Never use `Any` — use `Unknown` or define the type.
```

### Explica el *por qué* para reglas no evidentes
```markdown
# Bad (mysterious)
Don't use the UserService from the AuthModule.

# Good (explains the constraint)
Don't import from AuthModule in other modules — it creates circular dependencies.
Use the shared UserRepository from @/shared/db instead.
```

### La lista "no tocar" es estructural
```markdown
## Do not modify
- `src/generated/` — auto-generated from the OpenAPI spec, run `npm run generate` to update
- `migrations/` — create new migrations with `npm run migration:create`, never edit existing ones
- `public/service-worker.js` — generated by the build, do not edit directly
```

---

## Anti-patrones

**Demasiado largo.** Si tu CLAUDE.md tiene 500+ líneas, Claude trata la mitad inferior como contexto de baja prioridad. Recorta sin piedad — cada línea debe ser estructural.

**Duplicar lo que el linter aplica.** No documentes reglas que ESLint o Prettier ya aplican. Si la herramienta lo captura, Claude no necesita saberlo.

**Consejo genérico.** "Escribe pruebas para todas las nuevas funcionalidades" — Claude ya sabe esto. Escribe reglas específicas para las convenciones de *tu* proyecto.

**Instrucciones desactualizadas.** Un CLAUDE.md desactualizado que describe cómo el proyecto *solía* funcionar es peor que ningún CLAUDE.md. Revísalo cuando hagas refactorizaciones importantes.

**Reglas contradictorias.** "Siempre usa TypeScript" en el CLAUDE.md raíz y "Python preferido" en el CLAUDE.md del servicio confundirá a Claude. Deja clara la jerarquía.

---

## Actualizar CLAUDE.md

**Después de una refactorización:** actualiza la sección de estructura de directorios y cualquier anti-patrón que haya cambiado.

**Después de incorporar a un nuevo miembro del equipo:** pregúntale qué le confundió. Sus puntos de confusión apuntan al contenido faltante en CLAUDE.md.

**Después de un error repetido:** si corriges a Claude por lo mismo dos veces, añade una regla. Si añades una regla y se viola de nuevo, hazla más fuerte — muévela al principio, conviértela en una restricción no en una preferencia.

**Revisión trimestral:** lee el archivo completo, elimina todo lo que esté desactualizado, añade todo lo que repites constantemente en sesiones recientes.

---
