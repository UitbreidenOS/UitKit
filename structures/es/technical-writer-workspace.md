# Espacio de Trabajo del Escritor Técnico — Estructura del Proyecto

> Para un escritor técnico que produce documentación para desarrolladores, referencias de API, tutoriales y notas de lanzamiento utilizando un flujo de trabajo de documentación como código con GitHub, Mintlify/Docusaurus y Notion.

## Stack

- **Documentación como código:** GitHub (PRs, revisiones, protección de ramas en `main`)
- **Sitio de documentación:** Mintlify (preferido) o Docusaurus 3.x o GitBook — uno por espacio de trabajo
- **Planificación y resúmenes:** Notion (calendario de contenidos, notas de entrevistas SME, solicitudes de documentación)
- **Diagramas:** Figma con FigJam para diagramas de arquitectura y flujos
- **Pruebas de API:** Postman (valida ejemplos de solicitud/respuesta antes de publicar)
- **Tutoriales de video:** Loom (incrustado en tutoriales para flujos complejos)
- **Comunicación:** Slack (canales `#docs`, `#dev-rel`, `#product-feedback`)
- **Linting:** Vale (linting de prosa contra reglas de estilo personalizadas), markdownlint
- **Verificación de enlaces:** lychee (detección de enlaces rotos en CI)
- **Búsqueda:** Algolia DocSearch (Mintlify) o lunr.js local (Docusaurus)

## Árbol de directorios

```
technical-writer-workspace/
├── .claude/
│   ├── CLAUDE.md                           # Instrucciones del espacio de trabajo para Claude Code
│   ├── settings.json                       # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── api-doc.md                      # /api-doc — generar documentación de punto final desde especificación OpenAPI
│       ├── tutorial-draft.md               # /tutorial-draft — armar tutorial paso a paso
│       ├── changelog-entry.md              # /changelog-entry — escribir entrada de nota de lanzamiento versionada
│       ├── doc-audit.md                    # /doc-audit — auditar página de documentación para precisión y actualización
│       ├── onboarding-guide.md             # /onboarding-guide — generar documentación de incorporación de desarrollador
│       ├── release-notes.md                # /release-notes — compilar notas de lanzamiento desde entradas de changelog
│       └── style-check.md                  # /style-check — linting de prosa contra reglas de guía de estilo
├── api-reference/
│   ├── _template.md                        # Formato de documentación de punto final canónico (fuente de verdad)
│   ├── authentication.md                   # Descripción general de autenticación: claves de API, OAuth 2.0, alcances de token
│   ├── errors.md                           # Códigos de error, códigos de estado, orientación de reintentos
│   ├── rate-limits.md                      # Niveles de límite de tasa, encabezados, estrategia de retroceso
│   ├── pagination.md                       # Paginación de cursor vs compensación, límites de tamaño de página
│   ├── versioning.md                       # Política de versionado de API, línea de tiempo de desuso
│   ├── users/
│   │   ├── list-users.md                   # GET /users — parámetros, esquema de respuesta, ejemplos
│   │   ├── get-user.md                     # GET /users/{id}
│   │   ├── create-user.md                  # POST /users — cuerpo de solicitud, reglas de validación
│   │   ├── update-user.md                  # PATCH /users/{id}
│   │   └── delete-user.md                  # DELETE /users/{id} — comportamiento de eliminación suave
│   ├── auth/
│   │   ├── token-exchange.md               # POST /auth/token
│   │   ├── refresh-token.md                # POST /auth/refresh
│   │   └── revoke-token.md                 # POST /auth/revoke
│   ├── webhooks/
│   │   ├── overview.md                     # Entrega de webhook, reintentos, verificación de firma
│   │   ├── event-types.md                  # Todos los esquemas de eventos con cargas de ejemplo
│   │   └── register-endpoint.md            # POST /webhooks — registro y validación
│   └── sdks/
│       ├── node.md                         # SDK de Node.js: instalar, iniciar, ejemplos de código por punto final
│       ├── python.md                       # SDK de Python
│       └── go.md                           # SDK de Go
├── guides/
│   ├── _template.md                        # Formato de guía conceptual: descripción general, por qué, cómo, próximos pasos
│   ├── getting-started.md                  # Primera integración: autenticación → primera llamada API → respuesta
│   ├── authentication.md                   # Análisis profundo: elegir método de autenticación, ciclo de vida del token
│   ├── error-handling.md                   # Patrones de codificación defensiva, lógica de reintento, retroceso exponencial
│   ├── security-best-practices.md          # Rotación de claves, minimización de alcance, almacenamiento de secretos
│   ├── migrating-from-v1.md               # Migración v1 → v2: cambios disruptivos, codemods
│   ├── idempotency.md                      # Claves de idempotencia: cuándo, por qué, implementación
│   └── testing-your-integration.md         # Entorno sandbox, datos de prueba, enlace de colección de Postman
├── tutorials/
│   ├── _template.md                        # Formato de tutorial: objetivo, requisitos previos, pasos, verificación, siguiente
│   ├── quickstart-5-minutes.md             # De principio a fin: clave de API → primera llamada exitosa
│   ├── build-a-webhook-receiver.md         # Servidor express de Node.js que maneja eventos
│   ├── sync-users-from-csv.md              # Flujo de importación por lotes con manejo de errores
│   ├── oauth-integration-nextjs.md         # Flujo OAuth 2.0 PKCE en una aplicación Next.js
│   ├── automate-user-provisioning.md       # Tutorial de aprovisionamiento SCIM 2.0
│   └── postman-collection-walkthrough.md   # Importar colección, establecer variables, ejecutar todas las llamadas
├── changelogs/
│   ├── _template.md                        # Formato de entrada de changelog: fecha, versión, secciones
│   ├── 2025-06-02-v3.1.0.md               # Última: agregado, cambiado, obsoleto, arreglado, eliminado
│   ├── 2025-04-15-v3.0.0.md               # Versión principal: cambios disruptivos prominentes primero
│   ├── 2025-02-10-v2.9.5.md
│   ├── 2025-01-08-v2.9.0.md
│   └── archive/
│       ├── 2024-changelogs.md              # Archivo consolidado para versiones anteriores
│       └── 2023-changelogs.md
├── architecture/
│   ├── system-overview.md                  # Diagrama de sistema de alto nivel, responsabilidades de componentes
│   ├── data-flow.md                        # Ciclo de vida de solicitud: cliente → puerta de enlace API → servicio → DB
│   ├── authentication-flow.md              # Diagrama de secuencia OAuth 2.0 con Mermaid
│   ├── webhook-delivery.md                 # Canalización de webhook: evento → cola → entrega → reintento
│   ├── decisions/
│   │   ├── _template.md                    # Formato ADR: estado, contexto, decisión, consecuencias
│   │   ├── adr-001-api-versioning.md       # Registro de decisión: versionado de URL sobre versionado de encabezado
│   │   ├── adr-002-pagination-strategy.md  # Paginación de cursor elegida sobre compensación
│   │   └── adr-003-webhook-retry-policy.md # Retroceso exponencial con ventana de 72 horas
│   └── openapi/
│       ├── openapi.yaml                    # Especificación OpenAPI 3.1 canónica (fuente de verdad)
│       └── postman-collection.json         # Colección de Postman exportada (generada desde especificación)
├── style-guide/
│   ├── voice-and-tone.md                   # Reglas de voz activa, segunda persona, tiempo presente
│   ├── terminology.md                      # Lista de términos aprobados/prohibidos: clave de API vs token de acceso, etc.
│   ├── code-examples.md                    # Estándares de lenguaje, longitud de línea, reglas de comentarios
│   ├── formatting.md                       # Jerarquía de encabezados, admoniciones, uso de tablas
│   ├── screenshots.md                      # Cuándo usar, requisitos de texto alternativo, convención de nomenclatura
│   ├── .vale.ini                           # Configuración de linter de prosa Vale: paquetes de reglas habilitados
│   └── vale-rules/
│       ├── Headings.yml                    # Regla de Vale personalizada: solo mayúsculas de oración
│       ├── AvoidPassive.yml                # Marcar construcciones de voz pasiva
│       └── BannedTerms.yml                 # Aplicar terminology.md a través de Vale
├── reviews/
│   ├── doc-review-checklist.md             # Lista de verificación previa a la publicación: precisión, enlaces, ejemplos
│   ├── sme-interview-template.md           # Marco de preguntas para entrevistas SME
│   ├── sme-feedback/
│   │   ├── 2025-05-auth-review.md          # Sesión de retroalimentación SME: documentación de autenticación con equipo de ingeniería
│   │   └── 2025-04-webhooks-review.md
│   └── audits/
│       ├── 2025-q2-api-reference-audit.md  # Auditoría de precisión trimestral: puntos finales obsoletos, ejemplos rotos
│       └── 2025-q1-tutorial-audit.md
├── .vale.ini                               # Configuración de Vale raíz (se aplica a todos los archivos .md)
├── .markdownlint.json                      # Reglas de markdownlint: longitud de línea, estilo de encabezado
├── .lychee.toml                            # Verificador de enlaces lychee: tiempo de espera, dominios excluidos
├── mint.json                               # Configuración de sitio Mintlify: navegación, colores, anclajes, análisis
└── .github/
    └── workflows/
        ├── vale-lint.yml                   # PR: ejecutar Vale en archivos .md modificados, publicar anotaciones
        ├── markdownlint.yml                # PR: verificación de markdownlint
        ├── link-check.yml                  # PR + calendario semanal: detección de enlaces rotos con lychee
        └── openapi-diff.yml               # PR: detectar cambios disruptivos en openapi.yaml
```

## Explicación de archivos clave

| Ruta | Propósito |
|---|---|
| `.claude/commands/api-doc.md` | Comando de barra que toma una ruta de punto final OpenAPI, obtiene la especificación y genera una página de documentación de punto final completa siguiendo convenciones `api-reference/_template.md` |
| `.claude/commands/doc-audit.md` | Audita una página de documentación contra la API activa: verifica que los ejemplos de solicitud/respuesta coincidan con la especificación actual, marca parámetros obsoletos e identifica códigos de error faltantes |
| `api-reference/_template.md` | Formato de documentación de punto final canónico: descripción, URL base, nota de autenticación, parámetros de ruta/consulta/cuerpo, esquema de respuesta, ejemplos de código en tres idiomas, tabla de errores |
| `architecture/openapi/openapi.yaml` | Especificación OpenAPI 3.1 única como fuente de verdad — todos los documentos de referencia de API y la colección de Postman se derivan de este archivo; nunca edite documentos de punto final sin verificar primero la especificación |
| `style-guide/terminology.md` | Lista de términos aprobados y prohibidos utilizada por la regla `BannedTerms.yml` de Vale — la autoridad única sobre vocabulario específico del producto |
| `changelogs/_template.md` | Formato de changelog aplicado: fecha, semver y cuatro secciones (Agregado, Cambiado, Obsoleto, Arreglado) siguiendo convenciones de Mantener un Changelog |
| `reviews/doc-review-checklist.md` | Puerta de control previa a la publicación: precisión verificada con Postman, todos los ejemplos de código probados, todos los enlaces pasando lychee, Vale y markdownlint limpios, aprobación SME anotada |
| `style-guide/.vale.ini` | Configuración de Vale: habilita paquete de estilo de Google para calidad de prosa, estilo de Microsoft para terminología y reglas locales personalizadas en `vale-rules/` |

## Andamiaje rápido

```bash
# Crear la estructura completa del espacio de trabajo de Escritor Técnico
mkdir -p technical-writer-workspace
cd technical-writer-workspace

# Configuración de Claude Code
mkdir -p .claude/commands

# Directorios de contenido
mkdir -p api-reference/users api-reference/auth api-reference/webhooks api-reference/sdks
mkdir -p guides tutorials
mkdir -p changelogs/archive
mkdir -p architecture/decisions architecture/openapi
mkdir -p style-guide/vale-rules
mkdir -p reviews/sme-feedback reviews/audits
mkdir -p .github/workflows

# Andamiaje de archivos de plantilla
touch api-reference/_template.md
touch guides/_template.md
touch tutorials/_template.md
touch changelogs/_template.md
touch architecture/decisions/_template.md
touch reviews/doc-review-checklist.md reviews/sme-interview-template.md

# Andamiaje de archivos de guía de estilo
touch style-guide/voice-and-tone.md
touch style-guide/terminology.md
touch style-guide/code-examples.md
touch style-guide/formatting.md
touch style-guide/screenshots.md

# Configuración de Vale
cat > .vale.ini << 'EOF'
StylesPath = style-guide/vale-rules
MinAlertLevel = suggestion

[*.md]
BasedOnStyles = Vale
EOF

cat > style-guide/.vale.ini << 'EOF'
StylesPath = vale-rules
MinAlertLevel = warning

[*.md]
BasedOnStyles = Vale, Google, Microsoft
EOF

# Configuración de markdownlint
cat > .markdownlint.json << 'EOF'
{
  "default": true,
  "MD013": { "line_length": 120 },
  "MD033": false,
  "MD041": false
}
EOF

# Módulo de configuración de Mintlify
cat > mint.json << 'EOF'
{
  "name": "Product Docs",
  "logo": { "light": "/logo/light.svg", "dark": "/logo/dark.svg" },
  "favicon": "/favicon.svg",
  "colors": { "primary": "#0D9373" },
  "navigation": [
    { "group": "Get Started", "pages": ["guides/getting-started"] },
    { "group": "API Reference", "pages": ["api-reference/authentication"] }
  ],
  "analytics": { "posthog": { "apiKey": "" } }
}
EOF

# Configuración de lychee
cat > .lychee.toml << 'EOF'
timeout = 20
max_retries = 3
exclude = ["localhost", "127.0.0.1", "example.com"]
exclude_path = ["changelogs/archive"]
EOF

# Instalar habilidades
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/runbook-generator
npx claudient add skill git/changelog-generator
npx claudient add skill productivity/lit-review

# Copiar habilidades instaladas como comandos del espacio de trabajo
cp ~/.claude/skills/productivity/api-doc-writer.md .claude/commands/api-doc.md
cp ~/.claude/skills/git/changelog-generator.md .claude/commands/changelog-entry.md
cp ~/.claude/skills/productivity/doc-site-builder.md .claude/commands/onboarding-guide.md

echo "Espacio de trabajo de Escritor Técnico andamiado."
```

## Plantilla de CLAUDE.md

```markdown
# Espacio de Trabajo del Escritor Técnico

Este espacio de trabajo gestiona toda la documentación orientada al desarrollador: referencia de API, guías conceptuales,
tutoriales y notas de lanzamiento. El contenido vive en el control de versiones y se publica en Mintlify.
La precisión e integridad son las métricas de calidad principales — cada ejemplo de código debe probarse
contra la API activa antes de la publicación.

## Stack

- Sitio de documentación: Mintlify (configuración: mint.json)
- Especificación de API: OpenAPI 3.1 (architecture/openapi/openapi.yaml — fuente de verdad)
- Linting de prosa: Vale + reglas personalizadas en style-guide/vale-rules/
- Linting de Markdown: markdownlint (.markdownlint.json)
- Verificación de enlaces: lychee (.lychee.toml)
- Pruebas de API: Postman (valida todos los ejemplos antes de publicar)
- Planificación: Notion (solicitudes de documentación, calendario de contenidos, notas de entrevistas SME)
- Video: Loom (incrustar tutoriales de caminata en tutoriales complejos)

## Convenciones de directorios

- `api-reference/` — un archivo por punto final; seguir exactamente api-reference/_template.md
- `guides/` — profundidad conceptual; no paso a paso (eso pertenece a tutorials/)
- `tutorials/` — pasos numerados; debe incluir una sección "Verificar que funciona" antes de "Próximos pasos"
- `changelogs/` — un archivo por lanzamiento; seguir changelogs/_template.md y Mantener un Changelog
- `architecture/decisions/` — un ADR por decisión significativa del sistema de documentación
- `style-guide/` — fuente única de verdad para voz, terminología y formato
- `reviews/` — nunca eliminar retroalimentación SME; es el rastro de auditoría de precisión

## Tareas comunes — usar exactamente estos comandos

### Generar documentación de punto final API desde especificación
/api-doc — pegar el objeto de ruta OpenAPI o URL de punto final

### Redactar un nuevo tutorial
/tutorial-draft — describir el objetivo del usuario y el persona de desarrollador objetivo

### Escribir una entrada de changelog para un lanzamiento
/changelog-entry — pegar la lista de PR o notas de lanzamiento de Jira

### Auditar una página de documentación para precisión
/doc-audit — pegar la ruta de la página de documentación y la sección OpenAPI relevante

### Generar una guía de incorporación de desarrollador
/onboarding-guide — proporcionar el área del producto y el rol objetivo

### Compilar notas de lanzamiento desde entradas de changelog
/release-notes — proporcionar el rango de versión (ej. v3.0.0 a v3.1.0)

### Verificar prosa contra la guía de estilo
/style-check — pegar o referenciar el archivo de documentación para linting

## Convenciones de referencia de API

- Cada documentación de punto final debe incluir: un ejemplo de cURL, un ejemplo de Python, un ejemplo de Node.js
- Los ejemplos de respuesta deben mostrar la respuesta real de Postman — nunca inventar JSON
- La tabla de errores debe enumerar todos los códigos de estado HTTP que el punto final realmente devuelve (verificar la especificación)
- Tabla de parámetros: marcar obligatorio vs opcional; incluir tipo, formato y valores válidos/rango
- Enlazar a la guía relevante para contexto conceptual — no explicar conceptos en línea

## Convenciones de Changelog

- Usar formato Mantener un Changelog: Agregado, Cambiado, Obsoleto, Arreglado, Eliminado, Seguridad
- Los cambios disruptivos van en la parte superior bajo un encabezado "Disruptivo" antes de todas las otras secciones
- Cada entrada debe referenciar el nombre de punto final de API o característica — sin "mejoras" vagas
- Los elementos obsoletos deben incluir la versión de eliminación objetivo y ruta de migración

## Reglas de estilo (forma breve — ver style-guide/ para reglas completas)

- Voz activa: "La API devuelve un token" no "Un token es devuelto por la API"
- Segunda persona: "Puede autenticarse usando..." no "Los usuarios pueden autenticarse usando..."
- Tiempo presente para comportamiento: "Devuelve 404" no "Devolverá 404"
- Mayúsculas de oración para todos los encabezados: "Crear un usuario" no "Crear Un Usuario"
- Términos aprobados: clave de API, token de acceso, punto final, carga útil, evento de webhook
- Términos prohibidos: simplemente, apenas, fácil, directo — marcar con /style-check

## Lista de verificación previa a la publicación

Antes de abrir un PR, verifique todos los elementos en reviews/doc-review-checklist.md:
1. Todos los ejemplos de código probados en Postman contra el entorno sandbox actual
2. Vale pasa con cero errores (advertencias aceptables con justificación)
3. markdownlint pasa con cero errores
4. lychee no muestra enlaces rotos
5. SME ha revisado precisión para cualquier afirmación arquitectónica o de comportamiento
6. Navegación mint.json actualizada si se agrega una página nueva

## Qué no hacer

- No inventar comportamiento de API — siempre verificar contra openapi.yaml o probar en Postman
- No editar openapi.yaml directamente — ese archivo es mantenido por el equipo de ingeniería
- No fusionar PRs de documentación sin Vale pasando — la verificación de CI es obligatoria
- No escribir tutoriales en el directorio guides/ o contenido conceptual en tutorials/
- No usar voz pasiva o condicionales de segundo orden ("sería", "podría potencialmente")
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
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_TOKEN": "${NOTION_API_TOKEN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == *.md ]]; then npx markdownlint \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>&1 | head -20 || true; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == *api-reference/* ]] && ! grep -q \"## Parameters\" \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null; then echo \"[HOOK] API reference file is missing a Parameters section — check api-reference/_template.md\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'changed=$(git -C \"$PWD\" diff --name-only 2>/dev/null | grep \"\\.md$\" | wc -l | tr -d \" \"); if [ \"$changed\" -gt 0 ]; then echo \"Reminder: $changed unsaved .md file(s) changed — run Vale and markdownlint before opening a PR.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades para instalar

```bash
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/runbook-generator
npx claudient add skill git/changelog-generator
npx claudient add skill productivity/lit-review
```

## Relacionado

- [Guía de Escritor Técnico](../guides/for-technical-writer.md)
- [Flujo de Trabajo de Escritura de Changelog](../workflows/changelog-writing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
