# Espacio de Trabajo del Ingeniero de Software — Estructura de Proyecto

> Para un ingeniero de software realizando desarrollo diario de características, revisión de código, depuración, decisiones de arquitectura y documentación — optimizando el ciclo completo desde el ticket hasta el PR fusionado.

## Stack

- **Control de versiones:** GitHub (alojamiento de código, PRs, Actions CI)
- **Seguimiento de problemas:** Linear o Jira (gestión de tickets, planificación de sprints)
- **IDE:** VS Code o Cursor con extensión Claude Code
- **Containerización:** Docker 25+ con Docker Compose para entornos de desarrollo local
- **Observabilidad:** Datadog (APM, logs, traces) o Sentry (rastreo de errores, reproducción de sesión)
- **Documentación:** Notion o Confluence (wiki del equipo, runbooks, incorporación)
- **Comunicación:** Slack (comms asincrónico, integraciones GitHub/Linear)
- **Runtime:** Node.js 20+ / Python 3.12+ / Go 1.22+ dependiendo del servicio
- **Testing:** Jest / pytest / Go test con reportes de cobertura
- **Linting/formatting:** ESLint + Prettier / Ruff / gofmt forzado en pre-commit

## Árbol de directorios

```
software-engineer-workspace/
├── .claude/
│   ├── CLAUDE.md                           # Instrucciones de espacio de trabajo para Claude Code
│   ├── settings.json                       # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── spec-to-code.md                 # /spec-to-code — toma una especificación/ticket, crea un plan de implementación
│       ├── code-review.md                  # /code-review — revisa el diff actual para bugs y limpiezas
│       ├── debug.md                        # /debug — toma un mensaje de error o comportamiento inesperado, rastrea la causa raíz
│       ├── test-write.md                   # /test-write — genera pruebas unitarias e integración para código cambiado
│       ├── pr-description.md               # /pr-description — redacta título de PR, resumen, plan de prueba desde git diff
│       ├── refactor.md                     # /refactor — identifica y aplica refactores seguros sin cambio de comportamiento
│       └── arch-sketch.md                  # /arch-sketch — produce borrador de ADR o esquema de diseño del sistema
├── specs/
│   ├── _template.md                        # Formato de especificación canónico: objetivo, no-objetivos, forma de API, casos extremos
│   ├── 2025-06-user-notifications/
│   │   ├── spec.md                         # Especificación de característica antes de comenzar a codificar
│   │   ├── api-contract.md                 # Borrador de esquema OpenAPI o GraphQL
│   │   └── edge-cases.md                  # Casos extremos identificados y modos de fallo
│   ├── 2025-05-search-refactor/
│   │   ├── spec.md
│   │   └── migration-plan.md               # Migración paso a paso con estrategia de reversión
│   └── 2025-04-rate-limiting/
│       └── spec.md
├── decisions/
│   ├── _template.md                        # Formato ADR: contexto, decisión, consecuencias, alternativas
│   ├── 001-database-choice.md              # ADR: por qué PostgreSQL sobre MongoDB
│   ├── 002-api-versioning-strategy.md      # ADR: versionado de URL vs versionado de header
│   ├── 003-caching-layer.md                # ADR: Redis vs caché en proceso
│   ├── 004-auth-mechanism.md               # ADR: JWT vs tokens opacos, estrategia de actualización
│   └── 005-monorepo-vs-polyrepo.md         # ADR: justificación de estrategia de repositorio actual
├── debugging/
│   ├── _template.md                        # Formato de sesión de depuración: síntoma, hipótesis, hallazgos, corrección
│   ├── 2025-06-01-memory-leak-api.md       # Sesión de bug complejo: crecimiento de heap en Node.js en /api/search
│   ├── 2025-05-14-slow-query-orders.md     # Sesión: consulta N+1 rastreada a través de APM Datadog
│   └── 2025-04-22-race-condition-jobs.md   # Sesión: deduplicación de trabajos bajo carga
├── learning/
│   ├── postgres-jsonb-indexing.md          # Notas: rendimiento del índice GIN vs GiST para consultas JSONB
│   ├── react-query-v5-migration.md         # Notas: cambios disruptivos y patrones nuevos de v4→v5
│   ├── opentelemetry-setup.md              # Notas: patrones de instrumentación manual con OTEL SDK
│   ├── redis-lua-scripting.md              # Resultados de experimentos: operaciones atómicas con Lua vs transacciones
│   └── zod-schema-composition.md          # Notas de patrón: uniones discriminadas, tipos de marca
├── reviews/
│   ├── checklist-backend.md                # Lista de verificación de revisión: seguridad, manejo de errores, observabilidad
│   ├── checklist-frontend.md               # Lista de verificación de revisión: accesibilidad, tamaño de bundle, estados de error
│   ├── checklist-database.md               # Lista de verificación de revisión: migraciones, índices, planes de consulta
│   ├── standards.md                        # Estándares de codificación del equipo y convenciones de nomenclatura
│   └── common-feedback.md                  # Patrones de comentarios recurentes en PR a observar
├── docs/
│   ├── onboarding.md                       # Configuración del nuevo ingeniero: clon de repo, configuración de env, primer PR
│   ├── local-dev-setup.md                  # Servicios Docker Compose, datos de semilla, variables de env
│   ├── runbooks/
│   │   ├── deploy-process.md               # Cómo desplegar: rama, CI, fusión, monitoreo
│   │   ├── rollback.md                     # Cómo revertir un despliegue fallido de forma segura
│   │   └── database-migrations.md          # Cómo escribir, probar y aplicar migraciones de forma segura
│   └── system-diagrams/
│       ├── service-map.md                  # Servicios, dependencias, integraciones externas
│       └── data-flow.md                    # Ciclo de vida de solicitud: cliente → API → DB → caché
├── .github/
│   └── workflows/
│       ├── ci.yml                          # Verificaciones de PR: lint, type-check, test, puerta de cobertura
│       ├── deploy-staging.yml              # Auto-desplegar a staging al fusionarse con main
│       └── codeql.yml                      # Escaneo de seguridad GitHub CodeQL en PRs
├── docker-compose.yml                      # Dev local: postgres, redis, kafka, localstack
├── docker-compose.override.yml            # Anulaciones locales: montajes de volumen, puertos de depuración
└── .env.example                            # Todas las variables de env requeridas con descripciones, sin valores reales
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/spec-to-code.md` | Lee el archivo de especificación de la rama de características actual, genera un plan de implementación con stubs de archivo, firmas de función y anclajes de prueba antes de escribir código |
| `.claude/commands/debug.md` | Toma un error pegado, stack trace o descripción de comportamiento inesperado; rastrea a través de logs, rutas de código y diffs recientes para aislar la causa raíz y proponer una corrección dirigida |
| `.claude/commands/arch-sketch.md` | Produce un borrador de ADR o diseño del sistema ligero — expone trade-offs, enfoques alternativos y preguntas abiertas para revisión asincrónica antes de comprometerse con un enfoque |
| `specs/_template.md` | Formato de especificación canónico: declaración del problema, criterios de éxito, forma de API, casos extremos, no-objetivos, preguntas abiertas — asegura que las especificaciones sean completas antes de comenzar a codificar |
| `decisions/_template.md` | Formato ADR siguiendo el estilo Nygard: contexto, decisión tomada, estado, consecuencias y alternativas rechazadas con justificación |
| `reviews/checklist-backend.md` | Lista de verificación de PR backend que cubre: validación de entrada, aplicación de auth, forma de respuesta de error, eficiencia de consulta de DB, hooks de observabilidad y seguridad de migración |
| `debugging/_template.md` | Formato de sesión: síntoma, detalles del entorno, pasos de reproducción, hipótesis intentadas, causa raíz, corrección aplicada y nota de prevención — base de conocimiento persistente para bugs complejos |
| `docs/runbooks/database-migrations.md` | Flujo de trabajo de migración: cambios de esquema solo compatibles hacia atrás, conciencia de despliegue azul-verde, SQL de reversión, evaluación del impacto del rendimiento en tablas grandes |

## Andamiaje rápido

```bash
# Crear la estructura completa del espacio de trabajo del ingeniero de software
mkdir -p software-engineer-workspace
cd software-engineer-workspace

# Configuración de Claude Code
mkdir -p .claude/commands

# Directorios de especificación (añadir subdirs por característica según sea necesario)
mkdir -p specs

# Decisiones de arquitectura
mkdir -p decisions

# Sesiones de depuración
mkdir -p debugging

# Notas de aprendizaje
mkdir -p learning

# Materiales de revisión
mkdir -p reviews

# Documentación
mkdir -p docs/runbooks docs/system-diagrams

# GitHub Actions
mkdir -p .github/workflows

# Archivos de plantilla de andamiaje
touch specs/_template.md
touch decisions/_template.md
touch debugging/_template.md
touch reviews/checklist-backend.md
touch reviews/checklist-frontend.md
touch reviews/checklist-database.md
touch reviews/standards.md
touch docs/onboarding.md
touch docs/local-dev-setup.md
touch docs/runbooks/deploy-process.md
touch docs/runbooks/rollback.md
touch docs/runbooks/database-migrations.md
touch docs/system-diagrams/service-map.md
touch .env.example

# Docker Compose para servicios de dev locales
cat > docker-compose.yml << 'EOF'
version: "3.9"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: app_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
EOF

# Instalar skills
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
npx claudient add skill productivity/security-audit
npx claudient add skill productivity/spec-driven-workflow
npx claudient add skill productivity/tech-debt-tracker

# Copiar skills instalados como comandos de espacio de trabajo
cp ~/.claude/skills/productivity/code-review.md .claude/commands/code-review.md
cp ~/.claude/skills/productivity/debug.md .claude/commands/debug.md
cp ~/.claude/skills/productivity/refactor.md .claude/commands/refactor.md
cp ~/.claude/skills/productivity/test-generator.md .claude/commands/test-write.md
cp ~/.claude/skills/git/pr-description.md .claude/commands/pr-description.md
cp ~/.claude/skills/productivity/spec-driven-workflow.md .claude/commands/spec-to-code.md

echo "Espacio de trabajo del ingeniero de software andamiado."
```

## Plantilla de CLAUDE.md

```markdown
# Espacio de Trabajo del Ingeniero de Software

Este espacio de trabajo abarca el ciclo de vida completo del desarrollo de software — desde leer un ticket hasta
fusionar un PR revisado, probado y documentado. El trabajo aquí incluye implementación de características,
revisión de código, depuración de problemas en producción, decisiones de arquitectura y mantenimiento de documentación actual.

## Stack

- Runtime: Node.js 20 (TypeScript 5.4) — ajustar al lenguaje del servicio
- Database: PostgreSQL 16 con Drizzle ORM (migraciones en drizzle/migrations/)
- Cache: Redis 7 (cliente ioredis, espacio de claves: app:{env}:{resource}:{id})
- API: Express 4 con validación Zod en todos los cuerpos de solicitud y parámetros
- Testing: Jest 29, Supertest para integración, DB de prueba creada por suite
- CI: GitHub Actions — ci.yml se ejecuta en cada PR; deploy-staging.yml al fusionarse con main
- Observability: Datadog APM (instrumentación automática dd-trace) + Sentry para excepciones
- Containers: Docker Compose para dev local (postgres, redis); ver docker-compose.yml

## Convenciones de directorios

- `specs/` — un subdirectorio por característica, creado antes de comenzar a codificar; spec.md primero
- `decisions/` — ADRs numerados secuencialmente; nunca eliminar, marcar los superados [SUPERSEDED]
- `debugging/` — notas de sesión para cualquier bug que tarde más de 30 minutos en resolverse
- `learning/` — notas sobre patrones nuevos, actualizaciones de bibliotecas, resultados de experimentos
- `reviews/` — listas de verificación y estándares; actualizar cuando patrones de comentarios recurentes en PR emergen
- `docs/runbooks/` — documentación operacional para procedimientos de despliegue, reversión y migración

## Tareas comunes — usar estos comandos exactos

### Comenzar a implementar desde un ticket o especificación
/spec-to-code — pegar el ticket de Linear/Jira o apuntar a specs/<feature>/spec.md

### Revisar tu propio diff antes de abrir un PR
/code-review

### Depurar un error o comportamiento inesperado
/debug — pegar el stack trace, mensaje de error o describir el comportamiento inesperado

### Escribir pruebas para código cambiado
/test-write — se ejecuta contra el git diff actual

### Redactar una descripción de PR
/pr-description — lee git log y diff, genera título + resumen + plan de prueba

### Refactorizar sin cambiar el comportamiento
/refactor — apuntar a un archivo o función; produce limpieza segura e incremental

### Esbozar una arquitectura o escribir un ADR
/arch-sketch — describir el problema; genera opciones de diseño y borrador de ADR

## Flujo de trabajo de desarrollo de características

1. Extraer el ticket de Linear/Jira; leer los criterios de aceptación cuidadosamente
2. Crear specs/<feature-name>/spec.md antes de escribir código
3. Ejecutar /spec-to-code para generar un plan de implementación
4. Crear una rama de característica: git checkout -b feat/<linear-ticket-id>-short-description
5. Implementar incrementalmente; ejecutar pruebas después de cada bloque significativo
6. Ejecutar /code-review en tu propio diff antes de hacer push
7. Ejecutar /pr-description para generar la descripción del PR
8. Abrir PR; solicitar revisión; abordar comentarios el mismo día si es posible
9. Después de fusionar: verificar despliegue en staging, verificar en Datadog, cerrar ticket

## Convenciones de código

- Todas las funciones deben tener tipos de retorno explícitos (sin any implícito)
- Manejo de errores: nunca silenciar errores; siempre registrar con contexto (ID de solicitud, ID de usuario)
- Consultas de base de datos: siempre incluir LIMIT en puntos finales de lista; explain analyze para consultas nuevas
- Respuestas de API: forma consistente — { data, error, meta } — nunca objetos sin procesar
- Feature flags: nuevas características orientadas al usuario detrás de un flag hasta la firma de QA
- Migraciones: siempre compatibles hacia atrás; nunca eliminar columnas en el mismo PR que elimina el uso

## Convenciones de prueba

- Pruebas unitarias: colocadas en __tests__/ junto al archivo fuente
- Pruebas de integración: en tests/integration/; usar DB real a través de testcontainers o URL de DB de prueba
- Puerta de cobertura: cobertura de línea del 80% requerida; CI falla por debajo del umbral
- Nombres de prueba: describir el comportamiento, no la implementación ("retorna 404 cuando usuario no encontrado")
- Nunca simular la base de datos en pruebas de integración — probar contra consultas reales

## Convenciones de observabilidad

- Cada manejador de API: registrar en entrada y salida con ID de solicitud y duración
- Cada trabajo en background: registrar inicio, finalización y cantidad de elementos procesados
- Errores enviados a Sentry: incluir ID de usuario, ID de solicitud y contexto de entrada relevante
- Características nuevas: añadir una métrica personalizada Datadog o panel de dashboard antes de enviar

## Lo que no hacer

- No confirmar secretos o archivos .env — usar .env.example con valores de marcador de posición
- No abrir un PR sin una entrada de especificación si el cambio es más grande que una corrección de una línea
- No fusionar sin al menos una aprobación y CI verde
- No saltar escribir pruebas porque "es un cambio pequeño" — los cambios pequeños causan regresiones
- No añadir una nueva dependencia sin verificar el impacto del tamaño de bundle y la licencia
```

## Servidores MCP

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}",
        "SENTRY_ORG": "${SENTRY_ORG}",
        "SENTRY_PROJECT": "${SENTRY_PROJECT}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/software-engineer-workspace"
      ]
    }
  }
}
```

## Hooks recomendados

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'EXT=\"${CLAUDE_TOOL_INPUT_FILE_PATH##*.}\"; if [[ \"$EXT\" == \"ts\" || \"$EXT\" == \"tsx\" || \"$EXT\" == \"js\" ]]; then npx prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true; elif [[ \"$EXT\" == \"py\" ]]; then ruff format \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true; elif [[ \"$EXT\" == \"go\" ]]; then gofmt -w \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qE \"git (push|commit).*(main|master)\"; then echo \"[HOOK] Direct push/commit to main detected — use a feature branch and open a PR instead.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if git -C \"$PWD\" diff --name-only 2>/dev/null | grep -q .; then echo \"Reminder: uncommitted changes in working tree — stage, stash, or commit before ending session.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills a instalar

```bash
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
npx claudient add skill productivity/security-audit
npx claudient add skill productivity/spec-driven-workflow
npx claudient add skill productivity/tech-debt-tracker
```

## Relacionado

- [Guía del Ingeniero de Software](../guides/for-software-engineer.md)
- [Flujo de Trabajo de Desarrollo de Características](../workflows/feature-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
