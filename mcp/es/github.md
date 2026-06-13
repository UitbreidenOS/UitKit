# MCP: GitHub

Interactúa con GitHub directamente desde Claude Code. Lee problemas, PRs abiertos, revisa código, busca repositorios y gestiona lanzamientos — todo sin salir de la terminal o cambiar a un navegador.

## Por qué lo necesitas

La CLI `gh` cubre la mayoría de operaciones git locales, pero la superficie de API de GitHub es mucho más grande. Con GitHub MCP:
- Claude puede buscar código en toda tu organización, no solo en el repositorio actual
- La clasificación de problemas, etiquetado y comentarios ocurren dentro de la misma sesión que tus cambios de código
- La creación y revisión de PR es parte del flujo de trabajo, no una tarea de navegador separada
- Los metadatos del repositorio, el historial de commits y los contenidos de archivos de cualquier rama son consultables
- Las tareas entre repositorios (auditorías de dependencias, búsquedas en toda la organización) se convierten en solicitudes únicas

## Instalación

```bash
npm install -g @modelcontextprotocol/server-github
```

## Configuración

Agrega a `~/.claude.json` o `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-pat-here"
      }
    }
  }
}
```

## Herramientas clave

- `create_or_update_file` — crear o actualizar un archivo en un repositorio
- `search_repositories` — buscar en GitHub repositorios por palabra clave o tema
- `create_repository` — crear un nuevo repositorio en tu cuenta u organización
- `get_file_contents` — leer un archivo desde cualquier rama de cualquier repositorio accesible
- `push_files` — empujar múltiples cambios de archivo como un solo commit
- `create_issue` — abrir un nuevo problema con título, cuerpo, etiquetas y asignados
- `create_pull_request` — abrir un PR con título, cuerpo, rama base y rama head
- `fork_repository` — bifurcar un repositorio a tu cuenta
- `create_branch` — crear una nueva rama desde cualquier ref
- `list_commits` — obtener el historial de commits para una rama o ruta de archivo
- `list_issues` / `get_issue` — consultar problemas por estado, etiqueta, asignado o hito
- `add_issue_comment` — agregar un comentario a cualquier problema o PR
- `search_code` — buscar código en GitHub usando la sintaxis de búsqueda de código
- `search_issues` — buscar problemas y PRs con la sintaxis de consulta completa de GitHub

## Ejemplos de uso

```
Lista todos los problemas abiertos en este repositorio etiquetados con 'bug',
ordenados por número de comentarios, y dame un resumen ordenado por prioridad
de lo que necesita arreglarse primero.
```

```
Lee la descripción del PR #123 y escribe un comentario detallado de revisión de código
en los cambios de autenticación — enfócate en seguridad y casos límite.
```

```
Busca todos los comentarios TODO y FIXME en todo el código base usando search_code,
luego crea un problema de GitHub para cada uno en el proyecto TECH,
asignado a mí con la etiqueta 'tech-debt'.
```

```
Crea una rama de lanzamiento llamada release/2.4.0 desde main, luego abre un PR
de vuelta a main con el changelog para todo lo fusionado en las últimas dos semanas.
```

```
Busca en todos los repositorios de nuestra organización archivos package.json que dependan
de lodash versión 4.17.20 o anterior y lista los repositorios afectados.
```

## Autenticación

1. Ve a **GitHub → Settings → Developer settings → Personal access tokens**
2. Elige **Fine-grained tokens** (recomendado) o **Tokens (classic)**
3. Para tokens clásicos, selecciona estos alcances: `repo`, `read:org`, `read:user`
4. Para tokens de grano fino, otorga permisos de **Contents**, **Issues**, **Pull requests** y **Metadata** en los repositorios que necesitas
5. Copia el token y establécelo como `GITHUB_PERSONAL_ACCESS_TOKEN` en el bloque de configuración anterior

## Consejos

**Usa tokens de grano fino:** Limita el token a repositorios específicos en lugar de tu cuenta completa. Si el token se filtra, el radio de explosión está contenido.

**Límites de tasa:** La API de GitHub permite 5.000 solicitudes por hora para solicitudes autenticadas. Las búsquedas de código en toda la organización se cuentan contra un límite de tasa de búsqueda separado (30 solicitudes por minuto) — almacena en caché los resultados cuando ejecutes operaciones en lote.

**Combinando con git local:** GitHub MCP maneja la superficie de API remota; usa tus comandos `git` locales para staged, commit y push. Los dos se complementan en la misma sesión.

**Sintaxis de búsqueda de código:** `search_code` soporta la sintaxis de consulta completa de GitHub — `language:typescript repo:myorg/myrepo "TODO"` funciona exactamente como en la interfaz de GitHub. Úsalo para consultas dirigidas en lugar de obtener archivos completos.

**Calidad del cuerpo de PR:** Cuando uses `create_pull_request`, dale a Claude el diff y el contexto del problema e pidele que redacte el cuerpo del PR. El resultado será más útil que un placeholder rellenado con plantilla.

---
