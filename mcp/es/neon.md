# MCP: Neon

Gestiona bases de datos Postgres de Neon directamente desde Claude Code — crea proyectos, ejecuta SQL, ramifica bases de datos para migraciones seguras y recupera cadenas de conexión sin salir de tu editor.

## Por qué lo necesitas

El trabajo de base de datos durante el desarrollo tiene dos modos de fallo: ejecutar migraciones directamente en producción (peligroso) y mantener una instancia separada de Postgres local (fricción). Neon resuelve ambos. Su modelo de ramificación te permite crear una copia aislada de cualquier base de datos en ~2 segundos. Con Neon MCP, Claude puede ramificar, migrar, validar y limpiar — todo en una conversación.

## Instalación

No se requiere instalación. Neon MCP es un servidor remoto accedido a través del transporte SSE.

## Configuración

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer YOUR_NEON_API_KEY"
      }
    }
  }
}
```

Reemplaza `YOUR_NEON_API_KEY` con tu clave (ver Autenticación a continuación).

## Herramientas clave

| Herramienta | Qué hace |
|---|---|
| `create_project` | Crear un nuevo proyecto de Neon |
| `list_projects` | Lista todos los proyectos en tu cuenta |
| `get_project` | Obtener detalle de proyecto incluyendo región, versión de Postgres y configuración |
| `execute_sql` | Ejecutar SQL arbitrario contra cualquier base de datos o rama |
| `create_branch` | Ramificar una base de datos desde main, una rama nombrada o una marca de tiempo |
| `list_branches` | Listar todas las ramas para un proyecto |
| `delete_branch` | Eliminar una rama cuando termines |
| `get_connection_string` | Devolver la cadena de conexión para un proyecto/rama, formateada para un ORM dado |
| `run_migration` | Aplicar un archivo de migración contra una rama especificada |
| `get_schema` | Introspeccionar el esquema completo para una base de datos o rama |

## Ejemplos de uso

```
Crear un nuevo proyecto de Neon llamado my-app con una base de datos llamada app_db

Ramifica la base de datos de producción para esta prueba de migración

Ejecuta esta migración SQL en la rama feature-auth y muéstrame el resultado

Compara el esquema entre la rama main y la rama feature-auth

Dame la cadena de conexión Prisma para la base de datos de staging

Elimina la rama feature-auth — la migración está fusionada
```

## Autenticación

1. Inicia sesión en [console.neon.tech](https://console.neon.tech)
2. Ve a **Account Settings → API Keys**
3. Genera una nueva clave de API — dale un nombre descriptivo (p. ej., `claude-mcp`)
4. Copia el valor de la clave inmediatamente — no se mostrará de nuevo
5. Agrégalo al encabezado `Authorization` en el bloque de configuración anterior

## Consejos

- La creación de rama toma aproximadamente 2 segundos independientemente del tamaño de la base de datos — usa una rama para cada ejecución de prueba de migración, no solo para las riesgosas.
- Neon Remote MCP se lanzó en febrero de 2026 como parte de las herramientas de desarrollador oficial de Neon.
- `get_connection_string` se autoformatea para Drizzle, Prisma y psycopg2 — especifica tu ORM en la solicitud.
- Las ramas son copia-en-escritura en la capa de almacenamiento, por lo que usan espacio mínimo en disco hasta que las escrituras divergen.
- Usa `create_branch` con un argumento de marca de tiempo para reproducir un bug que ocurrió en un punto específico en el tiempo.
- Después de validar una migración en una rama, usa `execute_sql` en main para aplicarla — o intégralo en un flujo de trabajo de despliegue con GitHub MCP.
- El nivel gratuito incluye 10 ramas por proyecto — más que suficiente para desarrollo activo.

---
