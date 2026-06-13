# MCP: Notion

Lee y escribe páginas, bases de datos y bloques de Notion desde Claude Code — busca en tu workspace, crea y actualiza contenido, y consulta bases de datos estructuradas sin salir de la terminal.

## Por qué lo necesitas

Notion es donde vive mucho del contexto del producto: especificaciones, notas de reuniones, registros de decisiones, bases de datos de proyectos. Sin MCP, Claude no tiene acceso a nada de eso. Con Notion MCP:
- Claude puede buscar en todo tu workspace y extraer contexto relevante a cualquier sesión de codificación
- Las consultas de base de datos traen datos de proyecto estructurados (tareas, sprints, decisiones) directamente al flujo de trabajo
- Crear y actualizar páginas desde Claude significa que la documentación ocurre dentro de la sesión, no después
- La referencia cruzada de cambios de código contra especificaciones de Notion o ADRs se convierte en una sola solicitud

## Instalación

```bash
npm install -g @notionhq/notion-mcp-server
```

## Configuración

Agrega a `~/.claude.json` o `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer your-notion-integration-token\", \"Notion-Version\": \"2022-06-28\"}"
      }
    }
  }
}
```

## Herramientas clave / Qué hacen

- `search` — búsqueda de texto completo en todas las páginas y bases de datos a las que la integración puede acceder
- `get_page` — recuperar una página y sus propiedades por ID de página
- `create_page` — crear una nueva página dentro de una página padre o base de datos
- `update_page` — actualizar propiedades de página (título, estado, fechas, selecciones, relaciones)
- `get_database` — recuperar un esquema de base de datos y metadatos
- `query_database` — consultar una base de datos con filtros, ordenamientos y paginación
- `create_database_item` — agregar una nueva fila/elemento a una base de datos
- `update_database_item` — actualizar propiedades en un elemento de base de datos existente
- `append_block_children` — agregar bloques de contenido (párrafos, código, listas, callouts) a cualquier página

## Ejemplos de uso

```
Consulta mi base de datos de proyectos y lista todas las tareas con estado "In Progress",
ordenadas por fecha de vencimiento. Muestra el asignado y prioridad para cada una.
```

```
Crea una nueva página en mi base de datos de notas de reuniones con la fecha de hoy como título,
y agrega una sección de agenda con estos tres temas: [lista de temas].
```

```
Busca en Notion nuestras decisiones de diseño de API del Q1 y resume
las elecciones clave que hicimos alrededor de autenticación y versionado.
```

```
Actualiza el estado de la tarea "ENG-Implement OAuth flow" a Done
y establece la fecha de finalización a hoy.
```

```
Agrega un resumen de esta sesión de codificación a mi página de dev log —
incluye qué cambiamos, qué diferimos y cualquier pregunta abierta.
```

## Autenticación

1. Ve a **notion.so/my-integrations** y haz clic en **Nueva integración**
2. Dale un nombre, selecciona tu workspace y establece las capacidades: **Leer contenido**, **Actualizar contenido**, **Insertar contenido**
3. Copia el **Token de integración interna** — comienza con `secret_`
4. Establécelo como el valor de portador de `Authorization` en el bloque de configuración anterior
5. **Para cada página o base de datos a la que la integración necesita acceder:** ábrela en Notion, haz clic en el menú de tres puntos, ve a **Conexiones** y agrega tu integración por nombre

La integración solo ve páginas explícitamente compartidas con ella. Compartir una página padre no comparte automáticamente páginas hijas — debes compartir cada una, o compartir una página de nivel superior y marcar **Incluir subpáginas**.

## Consejos

**Encontrar IDs de página desde URLs:** Los IDs de página de Notion son la cadena hex de 32 caracteres al final de la URL. Usa `search` para descubrir páginas por nombre en lugar de buscar manualmente los IDs.

**Las consultas de base de datos soportan filtros y ordenamientos:** Usa el parámetro `filter` con condiciones compuestas (y/o) para replicar las mismas vistas que tienes en la interfaz de Notion. El esquema de filtro refleja exactamente la API de filtro de Notion.

**El límite de tasa es 3 solicitudes por segundo:** Para operaciones en lote (crear muchos elementos, consultar bases de datos grandes), agrega retrasos entre llamadas o agrupa escrituras usando `append_block_children` con múltiples bloques en una llamada.

**Texto enriquecido vs texto plano:** La mayoría de campos de `create_page` y `update_page` esperan el formato de matriz de texto enriquecido de Notion, no cadenas planas. Cuando tengas duda, envuelve el texto como `[{"type": "text", "text": {"content": "tu texto"}}]`.

**Usa search para iniciar:** Cuando no tengas IDs, siempre comienza con `search` usando un título descriptivo. Devuelve IDs de página e IDs de base de datos que puedas usar en llamadas posteriores.

---
