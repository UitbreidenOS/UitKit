# Team Onboarding

## Cuándo activar

- El usuario ejecuta `/team-onboarding`
- El usuario solicita generar un documento de incorporación para un nuevo miembro del equipo o contratista
- El usuario quiere capturar el contexto del proyecto para un desarrollador que se une al proyecto
- El usuario quiere un documento "comience aquí" que cubra desde la configuración hasta el primer despliegue
- Configurar incorporación asistida por IA para un equipo donde los nuevos miembros usan Claude Code

## Cuándo no usar

- El proyecto ya tiene un `ONBOARDING.md` o equivalente actualizado — actualizar el documento existente en lugar de regenerar
- La solicitud es para incorporación general de RRHH de la empresa — esta habilidad solo cubre incorporación de proyecto técnico
- El usuario quiere un README — un README es público ; los documentos de incorporación son internos, expresan opiniones, y asumen que el lector tiene acceso al repositorio

## Instrucciones

### Qué generar

El documento de incorporación cubre todo lo que un desarrollador necesita saber para ir de cero al primer commit. Secciones:

1. **Descripción general del proyecto** — Qué hace, quién lo usa y por qué existe (máximo 2–4 oraciones)
2. **Tech Stack** — Framework, idioma, runtime, base de datos, caché, cola — con números de versión exactos extraídos de `package.json`, `pyproject.toml`, `go.mod` o equivalente
3. **Configuración local** — Comandos paso a paso para clonar, instalar, configurar env, hacer seed de datos y ejecutar el servidor dev ; cada comando debe ser copiar-pegable
4. **Ubicaciones de archivos clave** — Dónde viven las cosas importantes: puntos de entrada, configuración, rutas, esquema db, pruebas, configuración CI
5. **Pruebas** — Cómo ejecutar pruebas (unidad, integración, e2e), cuál es el umbral de cobertura, cómo ejecutar un archivo de prueba único
6. **Despliegue** — Cómo funcionan los despliegues de staging y producción, quién puede desencadenarlos, cuál es el procedimiento de reversión
7. **Convenciones de equipo** — Nomenclatura de ramas, formato de commit, proceso de PR, quién revisa qué, aplicación de estilo de código
8. **Configuración de Claude Code** — Qué habilidades están activas en `.claude/skills/`, qué agentes están disponibles, qué servidores MCP están configurados, comandos slash útiles para este proyecto

### Cómo obtener información

Leer estos archivos antes de generar:

```
README.md                  — descripción del proyecto, inicio rápido
package.json / pyproject.toml / go.mod / Cargo.toml — versiones, scripts, dependencias
CLAUDE.md                  — convenciones de equipo, configuración de Claude
Makefile                   — comandos disponibles
docker-compose.yml         — servicios, puertos, ambiente
.env.example               — variables de entorno requeridas
.github/workflows/         — pipeline de CI/CD, comandos de prueba, disparadores de despliegue
src/ o app/                — puntos de entrada, estructura de nivel superior
```

No inventar información. Si el archivo fuente de una sección no existe o no contiene la información relevante, escribir un marcador de posición como `[TODO: agregar proceso de despliegue]` en lugar de adivinar.

### Formato de salida

Salida: un documento Markdown único. Sin HTML, sin front matter.

Estructura:
```markdown
# Nombre del proyecto — Incorporación de desarrolladores

> Descripción en una oración de lo que hace el proyecto.

## Requisitos previos
## Configuración local
## Tech Stack
## Ubicaciones de archivos clave
## Ejecutar pruebas
## Despliegue
## Convenciones de equipo
## Configuración de Claude Code
## Obtener ayuda
```

Mantener escaneable. Usar bloques de código para cada comando. Usar tablas para tech stack y ubicaciones de archivos. Duración objetivo: 2–4 páginas al imprimir.

### Dónde guardar

Verificar en este orden:
1. Si existe el directorio `docs/` → guardar en `docs/onboarding.md`
2. Si ya existe `ONBOARDING.md` → actualizar en su lugar
3. Por defecto → guardar en `ONBOARDING.md` en la raíz del proyecto

Después de guardar, decirle al usuario la ruta del archivo y sugerir que lo agregue a la lista de verificación de nuevas contrataciones o a un enlace de Slack/Notion fijado.

### Rellenar la sección Configuración de Claude Code

Leer `.claude/` para completar esta sección:

```bash
ls .claude/skills/     # enumerar habilidades activas → documentar comandos slash
ls .claude/agents/     # enumerar agentes → documentar cuándo usar cada uno
cat .claude/settings.json  # servidores MCP, hooks, aprobaciones automáticas
```

Formatear como tabla de referencia rápida:

| Comando slash | Qué hace |
|---|---|
| `/graphql-client` | Configurar Apollo Client con codegen |
| `/db-specialist` | Delegar optimización de consultas compleja al agente DB |
| `/pr-review` | Ejecutar revisión de PR automatizada antes de fusionar |

## Ejemplo

Ejecutar `/team-onboarding` en un proyecto Next.js + Drizzle + Vercel.

Claude lee: `package.json` (Next.js 15, Drizzle ORM 0.30, TypeScript 5.4), `docker-compose.yml` (PostgreSQL 16 en puerto 5432), `.env.example` (DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY), `Makefile` (objetivos dev, test, migrate, seed), `.github/workflows/deploy.yml` (vista previa de Vercel en PR, producción al fusionar a main), `CLAUDE.md` (política de fusión squash, commits convencionales, PR requiere 1 aprobación).

`docs/onboarding.md` generado incluye:

```markdown
# Acme App — Incorporación de desarrolladores

> SaaS B2B para gestión de facturas — frontend Next.js 15, backend Drizzle ORM + PostgreSQL, desplegado en Vercel.

## Requisitos previos
- Node.js 20+
- Docker Desktop (para PostgreSQL local)
- Vercel CLI: `npm i -g vercel`

## Configuración local
\`\`\`bash
git clone git@github.com:org/acme-app.git
cd acme-app
npm install
cp .env.example .env.local        # rellenar DATABASE_URL y NEXTAUTH_SECRET
docker compose up -d               # inicia PostgreSQL en localhost:5432
npm run db:migrate                 # aplicar todas las migraciones
npm run db:seed                    # cargar fixtures de dev
npm run dev                        # http://localhost:3000
\`\`\`

## Tech Stack
| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 15.1.0 |
| Idioma | TypeScript | 5.4.5 |
| ORM | Drizzle ORM | 0.30.9 |
| Base de datos | PostgreSQL | 16 |
| Auth | NextAuth.js | 5.0.0-beta |
| Email | Resend | 3.2.0 |
| Despliegue | Vercel | — |

...
```

El documento completo se ejecuta en aproximadamente 3 páginas y cubre todo desde el primer clon hasta el primer PR fusionado.

---
