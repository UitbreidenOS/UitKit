---
name: agents-md
description: "Generar AGENTS.md para portabilidad multi-agente (Claude Code, Cursor, Codex, Gemini CLI). Documento de contexto de repositorio agnóstico a herramientas, distinto de CLAUDE.md."
---

# AGENTS.md Writer

## Cuándo activar

- El usuario desea que el repositorio funcione consistentemente en múltiples herramientas de codificación de IA (Claude Code, Cursor, Codex, Gemini CLI)
- Configurar un nuevo repositorio para desarrollo asistido por IA y necesitar un único documento de contexto compartido
- CLAUDE.md existe pero es específico de Claude Code y otras herramientas obtienen resultados inconsistentes
- El equipo se está estandarizando en una convención de contexto de IA agnóstica de herramientas
- Después de una auditoría CLAUDE.md cuando desea extraer el subconjunto agnóstico de herramientas

## Cuándo no usar

- El proyecto solo usa Claude Code — CLAUDE.md es el documento correcto, no AGENTS.md
- El repositorio tiene un AGENTS.md existente que solo necesita actualización (use el prompt de auditor de contexto para reducir CLAUDE.md y reflejar cambios)
- Configuraciones MCP, scripts de hooks o definiciones de comandos slash — estos son específicos de Claude Code y no pertenecen a AGENTS.md

## Instrucciones

### AGENTS.md vs CLAUDE.md

| CLAUDE.md | AGENTS.md |
|---|---|
| Específico de Claude Code | Funciona con cualquier herramienta de codificación de IA |
| Puede referenciar hooks, MCP, slash commands | Agnóstico de herramientas — sin características de Claude |
| Puede ser verboso (cargado una vez por sesión) | Debe ser conciso (<400 líneas) |
| Reglas de proyecto + comportamiento de Claude | Convenciones de proyecto + reglas de seguridad del agente |
| Propiedad de usuarios de Claude Code | Propiedad de cualquier equipo asistido por IA |

Los dos archivos pueden coexistir. AGENTS.md es el superconjunto de lo que todos los herramientas comparten; CLAUDE.md añade extensiones específicas de Claude Code encima.

### Estructura AGENTS.md

Cada AGENTS.md debe contener estas secciones en orden:

**1. Descripción general del proyecto**
Dos a cuatro oraciones. Qué hace el proyecto, a quién sirve, qué problema resuelve. Sin lenguaje de marketing.

**2. Stack de tecnología**
Lista con viñetas: lenguaje + versión, framework + versión, bibliotecas principales, base de datos, hospedaje/infraestructura.
Solo lo que está realmente en el repositorio — sin adiciones aspiracionales.

**3. Convenciones clave**
Las reglas que todo desarrollador (o agente de IA) debe seguir para producir código aceptable. Extraer de:
- CLAUDE.md existente si presente
- Configuración de linting (`.eslintrc`, `pyproject.toml`, `rubocop.yml`)
- README
- Patrones observados en la base de código existente

Incluir: convenciones de nomenclatura, organización de archivos, patrones a usar, patrones a evitar.

**4. Reglas de comportamiento del agente**
Instrucciones específicamente para agentes de IA:
- Comandos seguros para ejecutar sin preguntar: pruebas, linting, formateo, verificación de tipo
- Comandos que requieren confirmación humana: despliegue, migración, publicación, eliminar, truncar, reinicio
- Política de creación de archivos: preguntar antes de crear archivos nuevos vs. editar primero
- Política de commit: preguntar antes de confirmar vs. commits autónomos permitidos
- Disciplina de alcance: qué el agente NO debe hacer aunque parezca útil

**5. Mapa de seguridad de archivos**
Una tabla clasificando rutas por riesgo:

| Ruta / Patrón | Estado | Notas |
|---|---|---|
| `src/`, `lib/`, `app/` | SEGURO | Código de funcionalidad — edición normal |
| `tests/`, `spec/`, `__tests__/` | SEGURO | Pruebas — modificar libremente |
| `docs/` | SEGURO | Documentación |
| `prisma/migrations/`, `db/migrate/` | PRECAUCIÓN | Ejecutar solo con aprobación |
| `src/auth/`, `src/payments/` | PRECAUCIÓN | Sensible a seguridad — marcar antes de cambiar |
| `.env`, `*.secret`, `credentials.*` | PELIGROSO | Nunca leer o modificar |
| `Dockerfile`, `.github/workflows/` | PELIGROSO | Infraestructura — se requiere aprobación |
| `dist/`, `build/`, `.next/` | PELIGROSO | Generado — no editar directamente |

**6. Comandos de prueba**
Comandos exactos copiados de scripts `package.json`, Makefile o configuración de CI. Sin parafraseo.

```
Test:    npm test
Lint:    npm run lint
Typecheck: npm run typecheck
Format:  npm run format
```

### Qué excluir de AGENTS.md

- Hooks de Claude Code (`PreToolUse`, `PostToolUse`, `Stop`)
- Configuraciones de servidores MCP
- Definiciones de comandos slash de Claude
- Orientación del modelo (Haiku vs Sonnet vs Opus)
- Instrucciones que hacen referencia a características específicas de Claude (herramienta Agent, /compact, archivos de memoria)
- Nombres de equipos internos, números de tickets Jira, preferencias personales

Estos pertenecen solo a CLAUDE.md.

### Generar AGENTS.md

Use el prompt `prompts/task-specific/agents-md-generator.md` para un paso de generación completamente automatizado. La habilidad aquí cubre el formato; el prompt cubre la invocación.

## Ejemplo

**Proyecto:** Aplicación SaaS Next.js 14 con Prisma + PostgreSQL, desplegada en Vercel.

Fragmento AGENTS.md generado:

```markdown
# AGENTS.md

## Descripción general del proyecto
Un tablero SaaS multiinquilino para rastrear métricas de entrega de software.
Construido para equipos de ingeniería de 5–50 personas. Valor principal: responder
"qué tan rápido estamos enviando y dónde estamos atrapados" en menos de 30 segundos.

## Stack de tecnología
- TypeScript 5.4
- Next.js 14 (App Router)
- Prisma 5 + PostgreSQL 16
- Tailwind CSS 3.4
- Vercel (hospedaje + Funciones Edge)
- Vitest (unidad), Playwright (e2e)

## Convenciones clave
- Todos los componentes: PascalCase, un componente por archivo
- Todas las utilidades: funciones camelCase, nombres de archivo kebab-case
- Sin exportaciones barrel (sin re-exportes de index.ts)
- Server Components por defecto; agregue 'use client' solo cuando sea necesario
- Consultas de base de datos solo en `src/lib/db/` — nunca directamente en componentes o rutas de API
- Sin tipos `any` — use `unknown` + type guard si la forma es incierta

## Reglas de comportamiento del agente
Seguro ejecutar autónomamente: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format`
Requiere confirmación: `prisma migrate deploy`, `vercel --prod`, cualquier `DROP` SQL
Preguntar antes de crear nuevos archivos en: `src/lib/db/`, `prisma/migrations/`
No confirmar autónomamente — siempre presentar cambios para revisión primero

## Mapa de seguridad de archivos
| Ruta | Estado | Notas |
|---|---|---|
| `src/components/` | SEGURO | |
| `src/app/` | SEGURO | |
| `src/lib/` | PRECAUCIÓN | Lógica comercial principal |
| `prisma/migrations/` | PELIGROSO | Nunca modificar migraciones existentes |
| `.env*` | PELIGROSO | Nunca leer o escribir |
| `.github/` | PELIGROSO | CI/CD — se requiere aprobación |

## Comandos de prueba
pnpm test          # Pruebas unitarias Vitest
pnpm test:e2e      # Playwright end-to-end
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
```

---
