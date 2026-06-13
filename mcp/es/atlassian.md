# MCP: Atlassian

Conecta Claude Code con Jira y Confluence. Lee tickets, actualiza estados de problemas, escribe documentación, ejecuta consultas JQL y vincula commits a problemas, sin abrir un navegador ni salir de tu flujo de desarrollo.

## Por qué lo necesitas

La gestión de proyectos y la documentación viven en Atlassian, pero cambiar el contexto entre Jira, Confluence y tu editor mata la productividad. Con Atlassian MCP:
- La planificación de sprints, la clasificación de tickets y las actualizaciones de estado ocurren dentro de la misma sesión que los cambios de código
- Claude puede vincular lo que acaba de construir directamente al ticket de Jira que lo pidió
- La documentación de Confluence permanece sincronizada con la implementación porque Claude puede escribir ambas al mismo tiempo
- Las consultas JQL te permiten analizar datos de sprints, encontrar bloqueadores o auditar carga de trabajo sin cargar la interfaz del tablero
- Las notas de lanzamiento, resúmenes de retrospectivas y documentos de arquitectura se generan a partir de datos reales de tickets, no de memoria

## Instalación

Instala a través del paquete oficial de MCP de Atlassian desde el portal de desarrolladores de Atlassian o npm:

```bash
npm install -g @atlassian/mcp
```

Si el paquete está disponible a través de descarga directa desde el portal de desarrolladores de Atlassian, sigue el instalador específico de la plataforma y anota la ruta del binario para el bloque de configuración a continuación.

## Configuración

Agrega a `~/.claude.json` o `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@atlassian/mcp"],
      "env": {
        "ATLASSIAN_API_TOKEN": "your-atlassian-api-token",
        "ATLASSIAN_EMAIL": "you@yourcompany.com",
        "ATLASSIAN_BASE_URL": "https://your-org.atlassian.net"
      }
    }
  }
}
```

Reemplaza `your-org` con tu subdominio real de Atlassian.

## Herramientas clave

**Jira**

- `get_issue` — obtener un problema de Jira con detalles completos: descripción, comentarios, estado, asignado, problemas vinculados
- `create_issue` — crear un nuevo ticket con tipo, resumen, descripción, asignado, etiquetas y prioridad
- `update_issue` — actualizar cualquier campo en un problema existente
- `search_issues` — ejecutar una consulta JQL y devolver problemas coincidentes
- `get_project` — obtener metadatos de proyecto y configuración del tablero
- `add_comment` — agregar un comentario a cualquier problema
- `transition_issue` — mover un problema a través del flujo de trabajo (p. ej., To Do → In Progress → Done)
- `get_sprint` — obtener todos los problemas en el sprint actual o especificado

**Confluence**

- `get_page` — obtener una página de Confluence por ID o título con contenido completo del cuerpo
- `create_page` — crear una nueva página en un espacio especificado
- `update_page` — actualizar el contenido de una página existente
- `search_content` — búsqueda de texto completo en todos los espacios de Confluence

## Ejemplos de uso

```
Encuentra todos los tickets en el sprint actual asignados a mí y resume
qué queda por hacer, agrupado por estado.
```

```
Acabo de arreglar PROJ-123 — transiónalo a Done y agrega un comentario
con un enlace al PR #456 y un resumen de una línea de la corrección.
```

```
Busca en Confluence nuestra documentación de arquitectura de autenticación
y resume las decisiones de diseño clave y preguntas abiertas.
```

```
Busca en el código fuente todos los comentarios TODO, luego crea un ticket de Jira
para cada uno en el proyecto TECH, asignado a mí, con la ruta del archivo
y número de línea en la descripción.
```

```
Genera notas de lanzamiento de todos los tickets transicionados a Done en el
último sprint y crea una nueva página de Confluence en el espacio Engineering
titulada "Release Notes — Sprint 42".
```

## Autenticación

1. Inicia sesión en tu cuenta de Atlassian y ve a **Configuración de cuenta → Seguridad → Tokens de API**
2. Haz clic en **Crear token de API**, dale un nombre, y copia el valor inmediatamente (no se mostrará de nuevo)
3. Establece los tres env vars requeridos:
   - `ATLASSIAN_API_TOKEN` — el token que acabas de copiar
   - `ATLASSIAN_EMAIL` — la dirección de correo electrónico de tu cuenta de Atlassian
   - `ATLASSIAN_BASE_URL` — la URL de tu instancia, p. ej. `https://acme.atlassian.net`
4. El token utiliza autenticación HTTP Basic: correo electrónico como nombre de usuario, token como contraseña

**OAuth vs token de API:** Los tokens de API son más simples y suficientes para uso personal o de pequeños equipos. Usa OAuth 2.0 de Atlassian (de 3 patas) si estás construyendo una integración del lado del servidor que actúa en nombre de múltiples usuarios.

## Consejos

**Sintaxis JQL:** `search_issues` acepta cualquier JQL válido. Patrones útiles:
- Sprint actual: `sprint in openSprints() AND assignee = currentUser()`
- Bloqueadores: `issueType = Bug AND priority = Highest AND status != Done`
- Cambios recientes: `updated >= -7d AND project = PROJ ORDER BY updated DESC`

**Paginación:** Los conjuntos de resultados grandes de JQL están paginados. Si necesitas todos los resultados, indica a Claude que obtenga páginas posteriores usando el desplazamiento `startAt` hasta que se agote el total.

**IDs de páginas de Confluence:** El ID de la página aparece en la URL de Confluence como `/pages/123456789/`. Úsalo cuando llames a `get_page` o `update_page` para precisión — las búsquedas basadas en título pueden ser ambiguas en espacios grandes.

**Combinando Jira y Confluence:** Los flujos de trabajo más poderosos involucran ambos. Obtén tickets de sprint con `search_issues`, resume el trabajo, y escribe el resultado en una página de Confluence con `create_page` — todo en una sola solicitud.

**No confirmes credenciales:** Mantén `ATLASSIAN_API_TOKEN` en tu `~/.claude.json` global, no en `.claude/mcp.json` a nivel de proyecto que podría ser confirmado en control de versiones.

---
