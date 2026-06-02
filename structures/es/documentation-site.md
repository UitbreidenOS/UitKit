# Sitio de Documentación (Astro + Starlight) — Estructura del Proyecto

> Para equipos de documentación de desarrolladores que envían documentos de referencia basados en MDX en Astro 4 + Starlight, optimizando el flujo de trabajo escribir-previsualizar-implementar con búsqueda de texto completo y verificación de enlaces automatizada.

## Stack

- **Framework:** Astro 4.x con Starlight 0.23+ (tema de documentación)
- **Lenguaje:** TypeScript 5.4+
- **Formato de contenido:** MDX (`.mdx`) con colecciones de contenido de Astro
- **Búsqueda:** Algolia DocSearch (basado en rastreador, gratuito para documentos públicos)
- **Gestor de paquetes:** npm 10+ (o pnpm 9+)
- **Implementación:** Vercel (salida de sitio estático, CDN perimetral)
- **CI/CD:** GitHub Actions (`build-check.yml`, `broken-links.yml`)
- **Verificación de enlaces:** Playwright 1.44+ (rastrear sitio renderizado para 404s)
- **Biblioteca de componentes:** Componentes MDX personalizados — `Callout`, `CodeTabs`, `Steps`, `ApiRef`
- **Resaltado de sintaxis:** Shiki (integrado en Starlight) con tema personalizado
- **Mapa del sitio:** `@astrojs/sitemap` (generado automáticamente, consumido por rastreador de Algolia)

## Árbol de directorios

```
docs-site/                                    # Raíz de documentación Astro + Starlight
├── .claude/
│   ├── CLAUDE.md                             # Instrucciones a nivel de repositorio para Claude Code
│   ├── settings.json                         # Servidores MCP, ganchos, permisos
│   └── commands/
│       ├── new-doc.md                        # /new-doc — estructura nueva página MDX con encabezado
│       ├── add-callout.md                    # /add-callout — inserta bloque de llamada escrito en cursor
│       ├── check-links.md                    # /check-links — ejecuta verificador de enlaces Playwright localmente
│       ├── rebuild-index.md                  # /rebuild-index — dispara rastreador de Algolia vía API
│       └── update-sidebar.md                 # /update-sidebar — añade entrada de navegación a astro.config.mjs
├── .github/
│   └── workflows/
│       ├── build-check.yml                   # Construye sitio Astro en cada PR; falla en errores TS
│       └── broken-links.yml                  # Rastreo de Playwright de URL de vista previa; bloquea fusión en 404s
├── src/
│   ├── content/
│   │   ├── config.ts                         # Definiciones de esquema de colección de contenido de Astro
│   │   └── docs/                             # Todas las páginas de documentación viven aquí
│   │       ├── getting-started/
│   │       │   ├── index.mdx                 # Página de inicio: qué es el producto + inicio rápido
│   │       │   ├── installation.mdx          # Pasos de instalación con CodeTabs para npm/pnpm/yarn
│   │       │   ├── authentication.mdx        # Configuración de autenticación — claves de API, OAuth, variables env
│   │       │   └── first-request.mdx         # Hola mundo de extremo a extremo con fragmento ejecutable
│   │       ├── guides/
│   │       │   ├── index.mdx                 # Página de inicio de guías con cuadrícula de tarjetas
│   │       │   ├── error-handling.mdx
│   │       │   ├── pagination.mdx
│   │       │   ├── rate-limiting.mdx
│   │       │   ├── webhooks.mdx
│   │       │   └── sdk-migration.mdx         # Actualización entre versiones principales de SDK
│   │       ├── api-reference/
│   │       │   ├── index.mdx                 # Descripción general de API: URL base, versionado, encabezado auth
│   │       │   ├── endpoints/
│   │       │   │   ├── users.mdx             # /users — operaciones CRUD con pestañas solicitud/respuesta
│   │       │   │   ├── organizations.mdx
│   │       │   │   ├── webhooks.mdx
│   │       │   │   └── events.mdx
│   │       │   ├── objects/
│   │       │   │   ├── user-object.mdx       # Referencia campo a campo completa con tipos
│   │       │   │   ├── error-object.mdx
│   │       │   │   └── pagination-object.mdx
│   │       │   └── errors.mdx                # Tabla de códigos de error HTTP completa
│   │       └── tutorials/
│   │           ├── index.mdx                 # Página de inicio de tutoriales
│   │           ├── build-a-dashboard.mdx     # Multi-paso con componente Steps
│   │           ├── sync-with-webhook.mdx
│   │           └── migrate-from-v1.mdx       # Guía de migración con bloques de código estilo diff
│   ├── components/
│   │   ├── Callout.astro                     # Bloque de llamada escrito: note | warning | danger | tip
│   │   ├── CodeTabs.astro                    # Bloque de código conmutador de idiomas (npm/pnpm/curl etc.)
│   │   ├── Steps.astro                       # Lista de pasos numerados con contador automático
│   │   ├── ApiRef.astro                      # Bloque de firma de extremo: distintivo de método + URL
│   │   ├── ParamTable.astro                  # Tabla de parámetros solicitud/respuesta con tipos
│   │   └── VersionBadge.astro                # Componente distintivo "Agregado en v2.3"
│   ├── assets/
│   │   ├── diagrams/
│   │   │   ├── auth-flow.svg                 # Diagrama de secuencia de autenticación (editable en Excalidraw)
│   │   │   ├── webhook-lifecycle.svg
│   │   │   └── data-model.svg
│   │   └── screenshots/
│   │       ├── dashboard-overview.png
│   │       └── api-key-screen.png
│   └── styles/
│       └── custom.css                        # Propiedades personalización CSS que anulan tema Starlight
├── public/
│   ├── favicon.svg
│   ├── robots.txt                            # Permitir todo; apunta a sitemap.xml
│   └── og-image.png                          # Imagen OpenGraph para compartir en redes sociales
├── tests/
│   └── links/
│       ├── broken-links.spec.ts              # Playwright: rastrear mapa del sitio, afirmar no 404/500
│       └── playwright.config.ts              # baseURL de variable env PLAYWRIGHT_BASE_URL
├── scripts/
│   └── trigger-algolia-crawl.ts             # Golpea API del Rastreador de Algolia para reindexar; ejecutar post-deploy
├── astro.config.mjs                          # Configuración Starlight: barra lateral, Algolia, enlaces sociales, i18n
├── tsconfig.json                             # TypeScript estricto; alias de ruta @components, @assets
├── package.json                              # Scripts: dev, build, preview, typecheck, test:links
├── .env.example                              # ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME
└── .env.local                                # Anulaciones locales (gitignored)
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `astro.config.mjs` | Fuente única de verdad para Starlight: árbol de barra lateral, claves de config DocSearch de Algolia, enlaces sociales, favicon, localidad predeterminada; las entradas de barra lateral deben coincidir con nombres de archivo en `src/content/docs/` |
| `src/content/config.ts` | Define el esquema de colección de contenido `docs` usando `docsSchema()` de `@astrojs/starlight/schema`; extender aquí para agregar campos de encabezado personalizados como `version`, `status`, o `apiMethod` |
| `src/components/Callout.astro` | Renderiza bloques de llamada estilizados; acepta prop `type` (`note` \| `warning` \| `danger` \| `tip`); utilizado en MDX como `<Callout type="warning">text</Callout>` |
| `src/components/CodeTabs.astro` | Bloque de código conmutador de pestañas; acepta matriz de objetos `{ label, lang, code }`; persiste selección de pestaña a localStorage vía atributo `data-persist-tab` |
| `src/components/Steps.astro` | Lista ordenada con reinicio de contador CSS; los elementos secundarios son contenido de ranura simple; evita numeración manual en MDX |
| `tests/links/broken-links.spec.ts` | Obtiene `sitemap.xml`, extrae todas las URLs `<loc>`, visita cada una con Playwright, afirma `response.status() < 400`; ejecutar contra URL de vista previa de Vercel en CI |
| `scripts/trigger-algolia-crawl.ts` | POSTs a `https://crawler.algolia.com/api/1/crawlers/{crawlerId}/reindex` con autenticación básica usando `ALGOLIA_APP_ID` + `ALGOLIA_API_KEY`; ejecutar después de cada implementación en producción |
| `.github/workflows/broken-links.yml` | Disparado en `pull_request`; implementa a Vercel vista previa vía `vercel deploy --prebuilt`, establece `PLAYWRIGHT_BASE_URL`, ejecuta `npm run test:links`; publica resultados como comprobación PR |

## Andamio rápido

```bash
# Requisitos previos: Node 20+, npm 10+

# Crear proyecto Astro + Starlight
npm create astro@latest docs-site -- --template starlight
cd docs-site

# Instalar Playwright para verificación de enlaces
npm install --save-dev @playwright/test
npx playwright install chromium

# Instalar búsqueda de Algolia (complemento Starlight)
npm install @astrojs/starlight

# Instalar integración de mapa del sitio (necesaria para rastreador de Algolia y Playwright)
npm install @astrojs/sitemap

# Crear estructura de directorio de contenido
mkdir -p src/content/docs/getting-started
mkdir -p src/content/docs/guides
mkdir -p src/content/docs/api-reference/endpoints
mkdir -p src/content/docs/api-reference/objects
mkdir -p src/content/docs/tutorials

# Crear archivos de componentes
mkdir -p src/components src/assets/diagrams src/assets/screenshots src/styles

touch src/components/Callout.astro
touch src/components/CodeTabs.astro
touch src/components/Steps.astro
touch src/components/ApiRef.astro
touch src/components/ParamTable.astro
touch src/components/VersionBadge.astro
touch src/styles/custom.css

# Crear estructura de prueba Playwright
mkdir -p tests/links
touch tests/links/broken-links.spec.ts
touch tests/links/playwright.config.ts

# Crear scripts post-deploy
mkdir -p scripts
touch scripts/trigger-algolia-crawl.ts

# Crear flujos de trabajo de GitHub Actions
mkdir -p .github/workflows
touch .github/workflows/build-check.yml
touch .github/workflows/broken-links.yml

# Crear activos públicos
touch public/robots.txt public/og-image.png

# Crear config de Claude Code
mkdir -p .claude/commands
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-doc.md
touch .claude/commands/add-callout.md
touch .claude/commands/check-links.md
touch .claude/commands/rebuild-index.md
touch .claude/commands/update-sidebar.md

# Crear archivos env
touch .env.example .env.local

# Instalar habilidades de Claudient
npx claudient add skill productivity/doc-site-builder
npx claudient add skill devops-infra/cicd
npx claudient add skill devops-infra/vercel

echo "Sitio de documentación Astro + Starlight construido. Ejecutar: npm run dev"
```

## Plantilla CLAUDE.md

```markdown
# Sitio de Documentación

Sitio de documentación de desarrolladores Astro 4 + Starlight. El contenido vive en src/content/docs/
como archivos MDX. La navegación de barra lateral se define en astro.config.mjs. La búsqueda está impulsada por
Algolia DocSearch (basado en rastreador). Implementado en Vercel desde la rama principal vía GitHub Actions.

## Stack

- Astro 4.x + Starlight 0.23+ (tema de documentación)
- TypeScript 5.4 (modo estricto)
- Contenido MDX con colecciones de contenido de Astro
- Componentes Astro personalizados: Callout, CodeTabs, Steps, ApiRef, ParamTable, VersionBadge
- Algolia DocSearch (índice reconstruido vía API rastreador post-deploy)
- Vercel (salida estática, implementaciones de vista previa por PR)
- GitHub Actions: build-check.yml (TS + construcción Astro), broken-links.yml (Playwright)
- Playwright 1.44+ para verificación de enlaces contra URLs de vista previa

## Agregar una nueva página de documentación — pasos exactos

1. Crear el archivo MDX en la carpeta de tema correcta bajo src/content/docs/:
   - Conceptos de introducción → getting-started/
   - Guías prácticas → guides/
   - Referencia de extremo y objeto → api-reference/endpoints/ o api-reference/objects/
   - Tutoriales paso a paso → tutorials/
2. Agregar encabezado requerido: title, description, sidebar.order (si el orden importa)
3. Agregar entrada de barra lateral en astro.config.mjs bajo starlight > sidebar > items
4. Usar comando de barra de corte /new-doc para estructura de encabezado y sección
5. Ejecutar npm run dev y verificar página se renderiza en la ruta URL esperada
6. Ejecutar npm run typecheck para captar cualquier error de TypeScript en componentes MDX

## Biblioteca de componentes MDX

Todos los componentes se importan en la parte superior del archivo MDX:
  import Callout from '@components/Callout.astro'
  import CodeTabs from '@components/CodeTabs.astro'
  import Steps from '@components/Steps.astro'

Tipos de Callout: note | warning | danger | tip
  <Callout type="warning">Esto se rompe en v2 — migrar antes de actualizar.</Callout>

CodeTabs — pestañas etiquetadas por idioma para fragmentos multiidioma:
  <CodeTabs tabs={[
    { label: "npm", lang: "bash", code: "npm install @acme/sdk" },
    { label: "pnpm", lang: "bash", code: "pnpm add @acme/sdk" },
    { label: "curl", lang: "bash", code: "curl https://api.acme.com/v1/users" }
  ]} />

Steps — lista ordenada numerada automáticamente:
  <Steps>
    <p>Instalar el SDK.</p>
    <p>Establecer tu clave de API en el entorno.</p>
    <p>Hacer tu primera solicitud.</p>
  </Steps>

ApiRef — encabezado de firma de extremo:
  <ApiRef method="POST" path="/v1/users" />

NO usar listas ordenadas HTML sin procesar para secuencias de pasos — usar Steps.
NO escribir <div class="callout"> manualmente — usar Callout.

## Configuración de navegación de barra lateral

La barra lateral se configura en astro.config.mjs dentro del complemento starlight():

  starlight({
    sidebar: [
      {
        label: 'Getting Started',
        items: [
          { label: 'Overview', link: '/getting-started/' },
          { label: 'Installation', link: '/getting-started/installation/' },
        ],
      },
      {
        label: 'API Reference',
        autogenerate: { directory: 'api-reference' },
      },
    ],
  })

Usar autogenerate para secciones grandes (api-reference, tutorials).
Usar explicit items[] para secciones donde importa el orden (getting-started, guides).
El campo de encabezado sidebar.order controla el orden de clasificación autogenerate.

## Ejecutar comandos

# Servidor dev local con recarga en vivo
npm run dev

# Compilación de producción completa (captura importaciones rotas y errores TS)
npm run build

# Vista previa de compilación de producción localmente
npm run preview

# Verificación de tipo sin compilar
npm run typecheck

# Ejecutar verificador de enlaces rotos Playwright contra vista previa local
PLAYWRIGHT_BASE_URL=http://localhost:4321 npm run test:links

# Disparar reindexado de Algolia (requiere ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_CRAWLER_ID)
npx tsx scripts/trigger-algolia-crawl.ts

## Reconstrucción del índice de Algolia

El índice DocSearch de Algolia se reconstruye vía la API del Rastreador de Algolia, no el cliente JavaScript.
Condiciones de disparo:
- Automáticamente: scripts/trigger-algolia-crawl.ts se ejecuta en broken-links.yml después de implementación de producción
- Manualmente: ejecutar comando de barra de corte /rebuild-index o invocar el script directamente
- NO empujar contenido directamente al índice de Algolia — dejar que el rastreador lo haga desde el sitio activo

Variables env requeridas para el script:
  ALGOLIA_APP_ID=xxx
  ALGOLIA_API_KEY=xxx          # Clave API del rastreador, NO la clave frontend de solo lectura
  ALGOLIA_CRAWLER_ID=xxx       # Encontrado en el panel de control del Rastreador de Algolia
  ALGOLIA_INDEX_NAME=docs

## Despliegue

- Cada empuje a main dispara implementación de producción de Vercel automáticamente
- Cada PR obtiene una URL de implementación de vista previa de Vercel
- broken-links.yml espera la implementación de vista previa, luego ejecuta Playwright contra ella
- No fusionar un PR si broken-links.yml está fallando
- La URL de producción se establece en PLAYWRIGHT_BASE_URL en el flujo de trabajo broken-links.yml

## Convenciones de encabezado

Cada página debe tener:
  ---
  title: "Título como aparece en barra lateral y <h1>"
  description: "Una oración — mostrada en resultados de búsqueda y OG meta"
  ---

Opcional:
  sidebar:
    order: 2                   # Controla posición en grupos autogenerate
    label: "Short Sidebar Name"  # Si es diferente del título
  version: "2.1"               # Versión de API que documentar esta página

## Qué no hacer

- No agregar entradas de barra lateral que no tienen archivo MDX coincidente — Starlight lanza en compilación
- No escribir tablas HTML sin procesar para documentos de parámetros — usar componente ParamTable
- No poner imágenes en src/content/ — ponerlas en src/assets/ e importarlas en MDX
- No comprometer .env.local o cualquier archivo que contenga claves reales de API de Algolia
- No editar manualmente el índice de Algolia — solo el rastreador debe escribir a él
```

## Servidores MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/docs-site/src"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

## Ganchos recomendados

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == *.mdx || \"$f\" == *.md ]]; then npx prettier --write --parser mdx \"$f\" 2>/dev/null || true; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */astro.config.mjs ]]; then echo \"[HOOK] astro.config.mjs changed — verify sidebar matches files in src/content/docs/ and run: npm run build\" >&2; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -q \"trigger-algolia-crawl\"; then echo \"[HOOK] Algolia reindex triggered — ensure the site is deployed and ALGOLIA_CRAWLER_ID is set\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades para instalar

```bash
npx claudient add skill productivity/doc-site-builder
npx claudient add skill devops-infra/cicd
npx claudient add skill devops-infra/vercel
npx claudient add skill testing/playwright
```

## Relacionado

- [Guía de Escritura Técnica](../guides/technical-writing.md)
- [Flujo de Trabajo de Documentación](../workflows/doc-publishing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
