---
name: llms-txt
description: "Estándar llms.txt: crear índices de documentación legibles por IA que reducen alucinaciones en 60%+ vs. relleno de contexto — para tus propios proyectos y librerías"
---

# Skill llms.txt

## Cuándo activar
- Crear documentación que los agentes de IA pueden navegar de manera eficiente
- Configurar Claude Code para usar la documentación más reciente de tu proyecto sin alucinar APIs
- Construir una librería o framework y querer hacerla legible por IA
- Reducir uso de ventana de contexto cuando se trabaja con grandes conjuntos de documentación
- Habilitar a Claude para recuperar solo la documentación específica que necesita para una tarea

## Cuándo NO usar
- Proyectos pequeños donde pegar los docs directamente está bien (< 5,000 tokens)
- Cuando no existe documentación aún — escribir los docs primero
- Herramientas internas privadas sin sitio de documentación externa

## Qué es llms.txt

El estándar `llms.txt` (llmstxt.org) es un archivo markdown simple en la raíz de un sitio de documentación que sirve como un índice legible por máquina. En lugar de rellenar cientos de miles de tokens de documentación raw en un prompt (lo que aumenta el riesgo de alucinación creando confusión de contexto), un agente lee el índice conciso, razona sobre qué páginas específicas necesita, y obtiene solo aquellas.

**Sin llms.txt:** agente lee todo → contexto inflado → APIs mezcladas → alucinaciones  
**Con llms.txt:** agente lee índice → razona → obtiene 3 páginas específicas → generación precisa

La investigación muestra reducción de 60%+ en errores de alucinación de API vs. relleno de contexto raw.

## Instrucciones

### Formato básico de llms.txt

```markdown
<!-- /llms.txt — colocar en raíz del sitio de docs -->
# Mi Librería

> Cliente HTTP de tipo-primero de TypeScript para la API Acme

## Docs

- [Comenzar](/docs/getting-started): Instalación, primera solicitud, configuración de autenticación
- [Referencia de API](/docs/api-reference): Firmas completas de método con parámetros y tipos de retorno
- [Autenticación](/docs/auth): Patrones de clave de API, OAuth2, token JWT y lógica de renovación
- [Manejo de Errores](/docs/errors): Códigos de error, lógica de reintentos, tipos de excepción
- [Paginación](/docs/pagination): Paginación por cursor y offset, iterando conjuntos de resultados grandes
- [Limitación de Velocidad](/docs/rate-limiting): Límites por nivel, estrategias de backoff, interpretación de encabezados
- [Webhooks](/docs/webhooks): Verificación de firma, tipos de evento, comportamiento de reintentos
- [Ejemplos](/docs/examples): Patrones comunes: CRUD, streaming, operaciones por lotes

## Opcionales

- [Guía de Migración](/docs/migration): Cambios de ruptura y rutas de actualización entre versiones principales
- [Registro de Cambios](/docs/changelog): Historial de versiones
```

**Reglas de formato:**
- `# Título` — nombre de librería (una línea)
- `> Descripción` — una oración sobre qué hace
- `## Docs` — páginas requeridas (agente obtiene estas cuando son relevantes)
- `## Opcionales` — páginas suplementarias (agente obtiene solo si las necesita)
- Cada línea: `- [Nombre de Página](URL): descripción de una oración`
- Las descripciones deben ser semánticas — el agente coincide estas con solicitudes del usuario

### Generar llms.txt para tu proyecto

```bash
# Usar CLI de llms-txt para generar desde docs existentes
npx llms-txt-generator --source ./docs --output ./public/llms.txt

# O generar desde un sitio de docs en vivo
npx llms-txt-generator --url https://docs.myproject.com --output ./llms.txt
```

### Escribir manualmente llms.txt para tu proyecto CLAUDE.md

Para proyectos que estás construyendo con Claude Code, agregar un `llms.txt` que apunte a la documentación externa que Claude debería usar:

```markdown
<!-- llms.txt para proyecto Next.js + Drizzle + Better Auth -->
# Pila de Tecnología del Proyecto

> Aplicación SaaS usando Next.js 16, Drizzle ORM, Neon Postgres, Better Auth, shadcn/ui

## Docs de Framework

- [Enrutador de Next.js App](https://nextjs.org/docs/app): Server Components, Server Actions, route handlers, middleware
- [Obtención de Datos de Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching): patrones de fetch, almacenamiento en caché, revalidación

## Base de Datos

- [Docs de Drizzle ORM](https://orm.drizzle.team/docs): Definición de esquema, consultas, migraciones, relaciones
- [Neon Serverless](https://neon.tech/docs): Ramificación, agrupación de conexión, pgvector

## Auth

- [Docs de Better Auth](https://www.better-auth.com/docs): Configuración, proveedores, sesión, plugins, 2FA

## UI

- [Componentes shadcn/ui](https://ui.shadcn.com/docs/components): Componentes disponibles, uso, tematización

## Opcionales

- [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview): Comandos CLI de migración
- [Neon pgvector](https://neon.tech/docs/extensions/pgvector): Configuración y consultas de búsqueda de vectores
```

### Conectar llms.txt a Claude Code vía MCP

```json
// .claude/settings.json — agregar servidor MCP que carga URL
{
  "mcpServers": {
    "docs": {
      "command": "npx",
      "args": [
        "-y",
        "@llmstxt/mcp-server",
        "--llms-txt", "https://docs.myproject.com/llms.txt"
      ]
    }
  }
}
```

O usar el enfoque de fetch simple en un CLAUDE.md:

```markdown
<!-- CLAUDE.md — apuntar Claude a tu llms.txt -->
## Documentación

Cuando necesites referenciar docs de librería externa, primero obtén y lee:
https://docs.myproject.com/llms.txt

Luego usar los enlaces en ese archivo para obtener solo las páginas específicas relevantes a la tarea.
NO cargar el sitio de documentación completo — usar el índice para razonar sobre qué necesitas.
```

### llms.txt para una librería que estás publicando

Si estás publicando una librería y quieres que Claude (y otros agentes) la usen correctamente:

```markdown
<!-- public/llms.txt en tu sitio de docs -->
# acme-client

> SDK oficial de TypeScript para la API REST de Acme. Soporta Node.js 18+ y Edge Runtime.

## Docs

- [Instalación](https://docs.acme.com/sdk/install): npm install, configuración env, primera llamada
- [Autenticación](https://docs.acme.com/sdk/auth): Claves de API, OAuth, renovación de token
- [Clientes](https://docs.acme.com/sdk/customers): Operaciones CRUD, búsqueda, paginación
- [Pagos](https://docs.acme.com/sdk/payments): Cargar, reembolsar, gestión de suscripción
- [Webhooks](https://docs.acme.com/sdk/webhooks): Verificación de firma, tipos de evento
- [Manejo de Errores](https://docs.acme.com/sdk/errors): Clases de error, lógica de reintentos, códigos de estado HTTP
- [Tipos de TypeScript](https://docs.acme.com/sdk/types): Definiciones de tipo completas e interfaces

## Opcionales

- [Migración desde v1](https://docs.acme.com/sdk/migration): Cambios de ruptura en v2
- [Ejemplos](https://docs.acme.com/sdk/examples): Patrones y recetas comunes
- [Registro de Cambios](https://docs.acme.com/sdk/changelog): Historial de versiones
```

**Enviar tu llms.txt** al directorio en llmstxt.org para que Claude y otros agentes puedan descubrirlo.

### Escribir buenas descripciones de página

La descripción de una oración por enlace es crítica — es lo que el agente usa para decidir si obtener la página.

```markdown
# Descripciones malas (demasiado vagas — agente no puede razonar sobre relevancia)
- [Autenticación](/auth): Docs de auth
- [Referencia de API](/api): Referencia de API

# Buenas descripciones (semánticas — agente puede coincidir con solicitud del usuario)
- [Autenticación](/auth): Configuración de clave de API, flujo OAuth2 PKCE, renovación de token con lógica de reintentos
- [Referencia de API](/api): Firmas de método completas para todos los endpoints con tipos TypeScript, parámetros, tipos de retorno y códigos de error
```

### Verificar que tu llms.txt funciona

```bash
# Prueba: ¿obtiene Claude solo lo que necesita?
# Prompt: "Muéstrame cómo implementar paginación usando el patrón de cursor"

# Bueno: Claude obtiene solo /docs/pagination
# Malo: Claude obtiene las 20 páginas de documentación
```

## Ejemplo

**Usuario:** Crear un `llms.txt` para un proyecto usando Vercel AI SDK + Anthropic + Next.js para que Claude Code no alucinne nombres de métodos de SDK.

**Salida esperada:**
```markdown
# Aplicación de Chat de IA

> Next.js 16 + Vercel AI SDK + Anthropic Claude — chat con streaming con llamadas de herramienta

## Docs

- [Vercel AI SDK: useChat](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat): API Hook, formato de mensaje, streaming, invocaciones de herramienta
- [Vercel AI SDK: streamText](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text): Streaming del lado del servidor, definiciones de herramienta, maxSteps
- [Modelos Claude de Anthropic](https://platform.claude.com/docs/about-claude/models/overview.md): IDs de modelo actuales, ventanas de contexto, precios
- [Vercel AI SDK: generateObject](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object): Salida estructurada con esquemas Zod

## Opcionales

- [Vercel AI SDK: Proveedores](https://sdk.vercel.ai/docs/foundations/providers-and-models): Cambiar entre Claude, OpenAI, Gemini
- [Almacenamiento en Caché de Prompt de Anthropic](https://platform.claude.com/docs/build-with-claude/prompt-caching.md): configuración de cache_control, ahorros de tokens
```

---
