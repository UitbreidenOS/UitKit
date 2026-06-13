# Top 100 servidores MCP para constructores independientes

Los servidores MCP más útiles en 2026 — con comandos de instalación, qué hace cada uno y bundles de inicio curados. Basado en volumen de búsqueda mensual (170K+ combinados), estrellas de GitHub y uso real en producción.

**Comienza aquí:** Obtén el 80% del valor de 5 servidores. Para constructores independientes: **GitHub + Memory + Playwright + PostgreSQL/Supabase + Stripe**. Todo lo demás es aditivo.

---

## Cómo instalar cualquier servidor MCP

Añade a `~/.claude.json` (global) o `.claude/mcp.json` (proyecto):

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@scope/package-name@latest"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

Para servidores Python usa: `"command": "uvx"` o `"command": "python"` con el argumento `"-m"`.
Reinicia Claude Code después de añadir servidores.

---

## 🏆 TIER 1 — Esencial (Todo constructor independiente)

### 1. GitHub (82K búsquedas mensuales · Oficial)
Lee PR, busca código, crea problemas, gestiona ramas, revisa diffs.

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
}
```
Token: github.com/settings/tokens → ámbitos `repo, read:org`

---

### 2. Memory (Persistencia del gráfico de conocimiento)
Recuerda hechos, decisiones y contexto entre sesiones de Claude Code. Capacidad más solicitada.

```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"],
  "env": {
    "MEMORY_FILE_PATH": "/Users/you/.claude/memory/knowledge.json"
  }
}
```

---

### 3. Playwright (82K búsquedas · Oficial Microsoft)
Controla un navegador real — navega, haz clic, rellena formularios, captura pantallas, raspa páginas renderizadas por JS. Usa árbol de accesibilidad para automatización confiable.

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest"],
  "env": { "BROWSER": "chromium" }
}
```

---

### 4. PostgreSQL (Oficial)
Ejecuta consultas SQL, explora esquemas, responde preguntas de negocio sin exportar datos.

```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
}
```
Usa una cadena de conexión de solo lectura para seguridad.

---

### 5. Stripe (Oficial)
Búsqueda de clientes, consultas de pago, gestión de suscripciones, generación de facturas.

```json
"stripe": {
  "command": "npx",
  "args": ["-y", "@stripe/agent-toolkit"],
  "env": { "STRIPE_SECRET_KEY": "sk_test_..." }
}
```
docs.stripe.com/mcp para configuración completa.

---

### 6. Filesystem (Oficial)
Lee, escribe y busca archivos fuera del directorio del proyecto actual.

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
}
```

---

### 7. Fetch (Oficial)
Realiza solicitudes HTTP a cualquier URL, obtiene páginas web, llama APIs REST.

```json
"fetch": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"]
}
```

---

## 💻 TIER 2 — Pila de desarrollador

### 8. Context7 (32K búsquedas)
Obtiene documentación de bibliotecas actual y específica de versión. Previene que Claude use APIs obsoletas.

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp@latest"]
}
```

---

### 9. Supabase (26K búsquedas · Oficial)
Control completo de Supabase — base de datos, autenticación, almacenamiento, funciones edge, políticas RLS.

```json
"supabase": {
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase@latest"],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "sbp_...",
    "SUPABASE_PROJECT_REF": "your-project-ref"
  }
}
```

---

### 10. Git (Oficial)
Acceso local al repositorio — ramas, commits, diffs, log, blame.

```json
"git": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "."]
}
```

---

### 11. GitLab (Oficial)
MR, problemas, pipelines, gestión de CI/CD.

```json
"gitlab": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gitlab"],
  "env": {
    "GITLAB_PERSONAL_ACCESS_TOKEN": "glpat-...",
    "GITLAB_API_URL": "https://gitlab.com/api/v4"
  }
}
```

---

### 12. Sentry (4.7K búsquedas · Oficial)
Consulta errores, crea problemas, ve trazas de pila y datos de rendimiento.

```json
"sentry": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sentry"],
  "env": {
    "SENTRY_AUTH_TOKEN": "sntrys_...",
    "SENTRY_ORGANIZATION": "your-org-slug"
  }
}
```

---

### 13. Desktop Commander
Acceso a terminal, gestión de procesos, control del sistema de archivos, búsqueda ripgrep.

```json
"desktop-commander": {
  "command": "npx",
  "args": ["-y", "@wonderwhy-er/desktop-commander"]
}
```

---

### 14. Docker (10.3K búsquedas)
Gestiona contenedores, imágenes, volúmenes, redes.

```json
"docker": {
  "command": "npx",
  "args": ["-y", "mcp-server-docker"]
}
```

---

### 15. MySQL (4.2K búsquedas)
Consulta bases de datos MySQL, exploración de esquemas, ejecución SQL.

```json
"mysql": {
  "command": "npx",
  "args": ["-y", "@benborla29/mcp-server-mysql"],
  "env": {
    "MYSQL_HOST": "localhost",
    "MYSQL_PORT": "3306",
    "MYSQL_USER": "root",
    "MYSQL_PASSWORD": "password",
    "MYSQL_DATABASE": "mydb"
  }
}
```

---

### 16. Redis (1.4K búsquedas)
Lee/escribe claves Redis, inspecciona datos, gestiona caché.

```json
"redis": {
  "command": "npx",
  "args": ["-y", "mcp-server-redis"],
  "env": { "REDIS_URL": "redis://localhost:6379" }
}
```

---

### 17. Prisma (Oficial)
Consulta Prisma Postgres, gestiona migraciones de esquemas.

```json
"prisma": {
  "command": "npx",
  "args": ["prisma", "mcp"]
}
```

---

### 18. MongoDB
Acceso a datos de documentos, inspección de esquemas, consulta JSON.

```json
"mongodb": {
  "command": "npx",
  "args": ["-y", "@mongodb-js/mongodb-mcp-server"],
  "env": { "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017" }
}
```

---

### 19. Neon (Postgres sin servidor)
PostgreSQL sin servidor de Neon con branching — gestiona directamente tu proyecto Neon.

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon"],
  "env": { "NEON_API_KEY": "..." }
}
```

---

### 20. E2B (Ejecución de código en sandbox)
Entorno seguro en la nube para ejecutar Python/JS, ejecuta comandos shell de forma segura.

```json
"e2b": {
  "command": "npx",
  "args": ["-y", "@e2b/mcp-server"],
  "env": { "E2B_API_KEY": "e2b_..." }
}
```

---

### 21. Semgrep
Análisis estático para vulnerabilidades de seguridad y calidad de código.

```json
"semgrep": {
  "command": "semgrep",
  "args": ["mcp"]
}
```

---

## 🔍 TIER 3 — Búsqueda e investigación

### 22. Brave Search (4.3K búsquedas)
Búsqueda web sin rastreo. Tier gratis: 2.000 consultas/mes.

```json
"brave-search": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": { "BRAVE_API_KEY": "BSA..." }
}
```

---

### 23. Firecrawl (7.2K búsquedas)
Convierte cualquier URL a Markdown limpio — maneja páginas renderizadas por JS.

```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": { "FIRECRAWL_API_KEY": "fc-..." }
}
```

---

### 24. Exa (3.5K búsquedas)
Búsqueda semántica neural a través de la web.

```json
"exa": {
  "command": "npx",
  "args": ["-y", "exa-mcp-server"],
  "env": { "EXA_API_KEY": "..." }
}
```

---

### 25. Tavily (2.9K búsquedas)
Búsqueda optimizada por IA para RAG y agentes de IA.

```json
"tavily": {
  "command": "npx",
  "args": ["-y", "tavily-mcp"],
  "env": { "TAVILY_API_KEY": "tvly-..." }
}
```

---

### 26. Jina Reader
Convierte URLs a Markdown limpio — excelente para raspado de documentación.

```json
"jina": {
  "command": "npx",
  "args": ["-y", "@jina-ai/mcp-server-jina-reader"],
  "env": { "JINA_API_KEY": "jina_..." }
}
```

---

### 27. Perplexity
Búsqueda semántica + investigación web en tiempo real con citas.

```json
"perplexity": {
  "command": "npx",
  "args": ["-y", "mcp-server-perplexity"],
  "env": { "PERPLEXITY_API_KEY": "pplx-..." }
}
```

---

### 28. GPT Researcher
Agente de investigación profunda que planifica, ejecuta y escribe informes respaldados por citas.

```json
"gpt-researcher": {
  "command": "uvx",
  "args": ["gptr-mcp"],
  "env": { "OPENAI_API_KEY": "sk-..." }
}
```

---

## 📊 TIER 4 — Análisis y monitoreo

### 29. Grafana (6.1K búsquedas)
Consulta métricas, explora dashboards, investiga alertas.

```json
"grafana": {
  "command": "npx",
  "args": ["-y", "@grafana/mcp-grafana"],
  "env": {
    "GRAFANA_URL": "http://localhost:3000",
    "GRAFANA_API_KEY": "glsa_..."
  }
}
```

---

### 30. Datadog (6.9K búsquedas · Oficial)
Consulta métricas, logs, trazas para diagnósticos.

```json
"datadog": {
  "command": "npx",
  "args": ["-y", "@datadog/mcp-server"],
  "env": {
    "DD_API_KEY": "...",
    "DD_APP_KEY": "...",
    "DD_SITE": "datadoghq.com"
  }
}
```

---

### 31. PostHog
Análisis de productos, banderas de características, grabaciones de sesiones.

```json
"posthog": {
  "command": "npx",
  "args": ["-y", "posthog-mcp-server"],
  "env": {
    "POSTHOG_API_KEY": "phx_...",
    "POSTHOG_HOST": "https://app.posthog.com"
  }
}
```

---

## 📋 TIER 5 — Gestión de proyectos

### 32. Linear (10.6K búsquedas · Oficial)
Crea problemas, actualiza estado, consulta proyectos, gestiona ciclos.

```json
"linear": {
  "command": "npx",
  "args": ["-y", "@linear/mcp-server"],
  "env": { "LINEAR_API_KEY": "lin_api_..." }
}
```

---

### 33. Notion (23K búsquedas)
Lee/escribe páginas, consulta bases de datos, busca en el espacio de trabajo.

```json
"notion": {
  "command": "npx",
  "args": ["-y", "@notionhq/notion-mcp-server"],
  "env": { "NOTION_API_KEY": "secret_..." }
}
```

---

### 34. Jira / Atlassian (40K búsquedas · Oficial)
Problemas, sprints, documentos Confluence.

```json
"atlassian": {
  "command": "npx",
  "args": ["-y", "@sooperset/mcp-atlassian"],
  "env": {
    "JIRA_URL": "https://your-domain.atlassian.net",
    "JIRA_USERNAME": "you@email.com",
    "JIRA_API_TOKEN": "...",
    "CONFLUENCE_URL": "https://your-domain.atlassian.net/wiki",
    "CONFLUENCE_USERNAME": "you@email.com",
    "CONFLUENCE_API_TOKEN": "..."
  }
}
```

---

### 35. Asana (2.8K búsquedas)
Gestión de tareas, proyectos y equipos.

```json
"asana": {
  "command": "npx",
  "args": ["-y", "asana-mcp-server"],
  "env": { "ASANA_ACCESS_TOKEN": "..." }
}
```

---

### 36. Task Master
Transforma PRD en listas de tareas estructuradas con dependencias.

```json
"taskmaster": {
  "command": "npx",
  "args": ["-y", "task-master-ai"],
  "env": { "ANTHROPIC_API_KEY": "sk-ant-..." }
}
```

---

## 💬 TIER 6 — Comunicación

### 37. Slack (17.7K búsquedas · Oficial)
Lee canales, busca mensajes, publica actualizaciones.

```json
"slack": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_BOT_TOKEN": "xoxb-...",
    "SLACK_TEAM_ID": "T..."
  }
}
```

---

### 38. Gmail (5.6K búsquedas)
Busca, lee, envía y responde correos electrónicos.

```json
"gmail": {
  "command": "npx",
  "args": ["-y", "gmail-mcp-server"],
  "env": {
    "GMAIL_CLIENT_ID": "...",
    "GMAIL_CLIENT_SECRET": "...",
    "GMAIL_REFRESH_TOKEN": "..."
  }
}
```

---

## ☁️ TIER 7 — Nube e infraestructura

### 39. AWS (16K búsquedas · Oficial)
Consulta y gestiona servicios AWS — suite completa.

```json
"aws": {
  "command": "npx",
  "args": ["-y", "@aws/aws-mcp-server"],
  "env": {
    "AWS_ACCESS_KEY_ID": "AKIA...",
    "AWS_SECRET_ACCESS_KEY": "...",
    "AWS_DEFAULT_REGION": "us-east-1"
  }
}
```

---

### 40. Azure (13K búsquedas · Oficial)
Gestión de recursos Azure.

```json
"azure": {
  "command": "npx",
  "args": ["-y", "@azure/mcp"],
  "env": {
    "AZURE_SUBSCRIPTION_ID": "...",
    "AZURE_TENANT_ID": "...",
    "AZURE_CLIENT_ID": "...",
    "AZURE_CLIENT_SECRET": "..."
  }
}
```

---

### 41. Cloudflare (2.3K búsquedas · Oficial)
Gestión de Workers, KV, D1, R2, DNS, Pages.

```json
"cloudflare": {
  "command": "npx",
  "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
  "env": { "CLOUDFLARE_API_TOKEN": "..." }
}
```

---

### 42. Vercel (3.1K búsquedas · Oficial)
Implementa, gestiona dominios, ve logs, controla entornos.

```json
"vercel": {
  "command": "npx",
  "args": ["-y", "@vercel/mcp"],
  "env": { "VERCEL_TOKEN": "..." }
}
```

---

### 43. Netlify (Oficial)
Gestión de sitios, hooks de construcción, variables de entorno.

```json
"netlify": {
  "command": "npx",
  "args": ["-y", "@netlify/mcp"],
  "env": { "NETLIFY_AUTH_TOKEN": "..." }
}
```

---

### 44. Kubernetes (2.1K búsquedas)
Gestiona pods, deployments, servicios, namespaces.

```json
"kubernetes": {
  "command": "npx",
  "args": ["-y", "mcp-server-kubernetes"]
}
```
Usa tu `~/.kube/config`.

---

### 45. Terraform (3.2K búsquedas)
Ejecuta planes, aplica, gestiona estado.

```json
"terraform": {
  "command": "npx",
  "args": ["-y", "terraform-mcp-server"]
}
```

---

## 🛒 TIER 8 — Comercio electrónico y pagos

### 46. Shopify (5.4K búsquedas · Oficial)
Productos, pedidos, inventario, clientes.

```json
"shopify": {
  "command": "npx",
  "args": ["-y", "@shopify/dev-mcp"],
  "env": {
    "SHOPIFY_ACCESS_TOKEN": "shpat_...",
    "MYSHOPIFY_DOMAIN": "your-store.myshopify.com"
  }
}
```

---

## 📁 TIER 9 — Productividad y contenido

### 47. Google Drive (5.9K búsquedas · Oficial)
Busca, lee, crea archivos de Google Drive.

```json
"gdrive": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gdrive"],
  "env": { "GDRIVE_CREDENTIALS_PATH": "/path/to/credentials.json" }
}
```

---

### 48. Google Sheets (2.1K búsquedas)
Lee/escribe Sheets — reportes, pipelines de datos.

```json
"gsheets": {
  "command": "npx",
  "args": ["-y", "google-sheets-mcp"],
  "env": { "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/creds.json" }
}
```

---

### 49. Google Calendar (3.5K búsquedas)
Lee y crea eventos de calendario.

```json
"gcal": {
  "command": "npx",
  "args": ["-y", "google-calendar-mcp"],
  "env": { "GOOGLE_CREDENTIALS": "/path/to/credentials.json" }
}
```

---

### 50. Airtable (2.2K búsquedas)
Lee/escribe Airtable — base de datos ligera o CMS.

```json
"airtable": {
  "command": "npx",
  "args": ["-y", "airtable-mcp-server"],
  "env": { "AIRTABLE_API_KEY": "pat..." }
}
```

---

### 51. Obsidian (8.1K búsquedas)
Lee y escribe tus notas de bóveda Obsidian.

```json
"obsidian": {
  "command": "npx",
  "args": ["-y", "mcp-obsidian"],
  "env": { "OBSIDIAN_VAULT_PATH": "/path/to/vault" }
}
```

---

### 52. WordPress (3.5K búsquedas)
Crea publicaciones, gestiona páginas, gestiona media.

```json
"wordpress": {
  "command": "npx",
  "args": ["-y", "wordpress-mcp"],
  "env": {
    "WORDPRESS_URL": "https://yoursite.com",
    "WORDPRESS_USERNAME": "admin",
    "WORDPRESS_APP_PASSWORD": "..."
  }
}
```

---

## 🎨 TIER 10 — Diseño

### 53. Figma (74K búsquedas · Modo de desarrollador oficial)
Estructura de diseño en vivo, capas, variantes para generación de código.

```json
"figma": {
  "command": "npx",
  "args": ["-y", "figma-developer-mcp"],
  "env": { "FIGMA_API_KEY": "figd_..." }
}
```
Requiere Figma Dev Mode (plan de pago).

---

### 54. Magic UI
Biblioteca de componentes React + Tailwind para generación de UI asistida por IA.

```json
"magicui": {
  "command": "npx",
  "args": ["-y", "@magicui/mcp"]
}
```

---

## 🔔 TIER 11 — Notificaciones y automatización

### 55. ntfy (Push móvil)
Notificaciones push de teléfono desde flujos de agentes.

```json
"ntfy": {
  "command": "npx",
  "args": ["-y", "ntfy-mcp-server"],
  "env": {
    "NTFY_TOPIC": "your-unique-topic",
    "NTFY_SERVER": "https://ntfy.sh"
  }
}
```

---

### 56. Zapier (10.8K búsquedas)
Dispara 7.000+ automatizaciones desde Claude Code.

```json
"zapier": {
  "command": "npx",
  "args": ["-y", "@zapier/mcp"],
  "env": { "ZAPIER_MCP_API_KEY": "..." }
}
```

---

### 57. n8n
Automatización de flujo de trabajo multietapa low-code.

```json
"n8n": {
  "command": "npx",
  "args": ["-y", "n8n-mcp-server"],
  "env": {
    "N8N_BASE_URL": "http://localhost:5678",
    "N8N_API_KEY": "..."
  }
}
```

---

### 58. Pipedream
Dispara código sin servidor a través de 2.500 APIs.

```json
"pipedream": {
  "command": "npx",
  "args": ["-y", "@pipedream/mcp"],
  "env": { "PIPEDREAM_ACCESS_TOKEN": "..." }
}
```

---

## 🧠 TIER 12 — IA y memoria

### 59. Sequential Thinking (13K búsquedas)
Fuerza pensamiento explícito paso a paso antes de responder.

```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

---

### 60. Chroma (Vector DB)
Recuperación de documentos semánticos para RAG.

```json
"chroma": {
  "command": "uvx",
  "args": ["chroma-mcp"],
  "env": { "CHROMA_HOST": "localhost", "CHROMA_PORT": "8000" }
}
```

---

### 61. MindsDB (39K estrellas)
Motor de consulta federado a través de múltiples bases de datos y SaaS.

```json
"mindsdb": {
  "command": "npx",
  "args": ["-y", "@mindsdb/mcp-server-mindsdb"],
  "env": { "MINDSDB_HOST": "cloud.mindsdb.com", "MINDSDB_API_KEY": "..." }
}
```

---

## 📈 TIER 13 — Datos y análisis

### 62. HubSpot (3.8K búsquedas · Oficial)
Automatización CRM — contactos, empresas, deals, tickets.

```json
"hubspot": {
  "command": "npx",
  "args": ["-y", "@hubspot/mcp-server"],
  "env": { "HUBSPOT_ACCESS_TOKEN": "pat-..." }
}
```

---

### 63. Snowflake (3.6K búsquedas)
Consulta almacén de datos Snowflake.

```json
"snowflake": {
  "command": "npx",
  "args": ["-y", "snowflake-mcp"],
  "env": {
    "SNOWFLAKE_ACCOUNT": "your-account",
    "SNOWFLAKE_USER": "username",
    "SNOWFLAKE_PASSWORD": "password",
    "SNOWFLAKE_DATABASE": "MY_DB",
    "SNOWFLAKE_WAREHOUSE": "COMPUTE_WH"
  }
}
```

---

### 64. dbt (1.9K búsquedas)
Ejecuta modelos dbt, prueba, explora documentación.

```json
"dbt": {
  "command": "npx",
  "args": ["-y", "dbt-mcp"],
  "env": { "DBT_PROJECT_DIR": "/path/to/dbt/project" }
}
```

---

## 🧪 TIER 14 — Pruebas y QA

### 65. BrowserStack
Pruebas entre navegadores y dispositivos en la nube.

```json
"browserstack": {
  "command": "npx",
  "args": ["-y", "@browserstack/mcp-server"],
  "env": {
    "BROWSERSTACK_USERNAME": "...",
    "BROWSERSTACK_ACCESS_KEY": "..."
  }
}
```

---

### 66. Puppeteer (7.3K búsquedas · Oficial)
Alternativa de automatización de navegador a Playwright.

```json
"puppeteer": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
  "env": { "PUPPETEER_HEADLESS": "true" }
}
```

---

## 🎨 TIER 15 — Media y creativo

### 67. Excalidraw
Genera diagramas de arquitectura y bocetos.

```json
"excalidraw": {
  "command": "npx",
  "args": ["-y", "excalidraw-mcp-server"]
}
```

---

### 68. Spotify
Busca, cola y cambia listas de reproducción desde tu editor.

```json
"spotify": {
  "command": "npx",
  "args": ["-y", "spotify-mcp"],
  "env": {
    "SPOTIFY_CLIENT_ID": "...",
    "SPOTIFY_CLIENT_SECRET": "...",
    "SPOTIFY_REDIRECT_URI": "http://localhost:8080"
  }
}
```

---

## 🔐 TIER 16 — Seguridad y cumplimiento

### 69. Snyk
Escaneo CVE en tiempo real para dependencias.

```json
"snyk": {
  "command": "npx",
  "args": ["-y", "snyk-mcp"],
  "env": { "SNYK_TOKEN": "..." }
}
```

---

### 70. Salesforce (6.5K búsquedas)
CRM, oportunidades, leads, cuentas.

```json
"salesforce": {
  "command": "npx",
  "args": ["-y", "salesforce-mcp"],
  "env": {
    "SF_CLIENT_ID": "...",
    "SF_CLIENT_SECRET": "...",
    "SF_USERNAME": "...",
    "SF_PASSWORD": "..."
  }
}
```

---

## Servidores adicionales (71–100)

| # | Servidor | Instalar | Qué hace |
|---|---|---|---|
| 71 | **Google Maps** | `npx mcp-server-google-maps` | Datos de ubicación, POI |
| 72 | **Convex** | `npx convex-mcp` | BaaS de pila completa |
| 73 | **Milvus** | `npx mcp-server-milvus` | Vector DB |
| 74 | **SQLite** | `npx @modelcontextprotocol/server-sqlite` | SQL incrustado |
| 75 | **Serena** | `npx serena-mcp` | Comprensión simbólica de código (24K estrellas) |
| 76 | **Skyvern** | `pip install skyvern` | Automatización de navegador con visión por computadora |
| 77 | **Last9** | `npx last9-mcp-server` | Ingeniería de confiabilidad |
| 78 | **Weaviate** | `npx mcp-server-weaviate` | Búsqueda vectorial semántica |
| 79 | **Cognee** | `uvx cognee-mcp` | Conocimiento Graph-RAG |
| 80 | **Google Search Console** | `npx google-search-console-mcp` | Datos SEO orgánicos |
| 81 | **Ahrefs** | `npx ahrefs-mcp` | Investigación SEO |
| 82 | **Resend** | `npx resend-mcp` | API de correo transaccional |
| 83 | **Algolia** | `npx algolia-mcp` | Infraestructura de búsqueda |
| 84 | **Pinecone** | `npx pinecone-mcp` | Vector DB |
| 85 | **Upstash** | `npx upstash-mcp` | Redis sin servidor |
| 86 | **Liveblocks** | `npx liveblocks-mcp` | Colaboración en tiempo real |
| 87 | **Cloudinary** | `npx cloudinary-mcp` | Gestión de medios |
| 88 | **Webflow** | `npx webflow-mcp` | CMS de sitio web |
| 89 | **Framer** | `npx framer-mcp` | Diseño a código |
| 90 | **PlanetScale** | `npx planetscale-mcp` | BD compatible con MySQL |
| 91 | **Turso** | `npx turso-mcp` | SQLite Edge |
| 92 | **Supabase Realtime** | via Supabase MCP | Suscripciones en tiempo real |
| 93 | **Neon** | `npx @neondatabase/mcp-server-neon` | (ver #19) |
| 94 | **MindsDB** | (ver #61) | — |
| 95 | **BrowserStack** | (ver #65) | — |
| 96 | **Task Master** | (ver #36) | — |
| 97 | **Pipedream** | (ver #58) | — |
| 98 | **Chrome DevTools** | `npx chrome-devtools-mcp` | Consola, Red, Perf |
| 99 | **Magic UI** | (ver #54) | — |
| 100 | **Jina Reader** | (ver #26) | — |

---

## Bundles de inicio rápido

### Constructor SaaS independiente (Comienza aquí — 5 servidores)
```json
{
  "mcpServers": {
    "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."} },
    "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
    "postgres": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"] },
    "stripe": { "command": "npx", "args": ["-y", "@stripe/agent-toolkit"], "env": {"STRIPE_SECRET_KEY": "sk_test_..."} },
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp@latest"] }
  }
}
```

### Desarrollador Full-Stack (10 servidores)
Añadir a SaaS independiente: `playwright`, `sentry`, `linear`, `slack`, `sequential-thinking`

### Datos y análisis
`postgres` + `snowflake` + `grafana` + `firecrawl` + `fetch` + `dbt`

### Contenido y marketing
`notion` + `wordpress` + `gmail` + `google-sheets` + `brave-search` + `firecrawl`

### DevOps e infraestructura
`github` + `kubernetes` + `terraform` + `aws` + `datadog` + `docker`

### Investigación y conocimiento
`memory` + `context7` + `brave-search` + `firecrawl` + `sequential-thinking` + `obsidian`

---

## Prácticas recomendadas de seguridad

- Usa **conexiones de base de datos de solo lectura** a menos que se necesite explícitamente acceso de escritura
- Almacena claves API como variables de entorno, nunca hardcodes en archivos de configuración
- Usa `.claude/mcp.json` a nivel de proyecto para servidores específicos del proyecto
- Comienza con alcances mínimos de tokens de GitHub (`read:org`) — expande solo si es necesario
- Para bases de datos de producción: crea un usuario MCP dedicado de solo lectura

---
