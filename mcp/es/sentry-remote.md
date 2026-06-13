# MCP: Sentry Remote

Conecta Claude Code directamente a Sentry para rastreo de errores, clasificación de problemas y monitoreo de salud de versión — no se requiere npm install, se ejecuta como MCP remoto sobre HTTP.

## Por qué lo necesitas

Depurar errores en producción significa cambiar al panel de Sentry, copiar trazas de pila, pegar en Claude y perder contexto. El MCP remoto de Sentry elimina ese viaje de ida y vuelta — Claude lee tus problemas reales, trazas de pila completas y datos de versión en contexto y te ayuda a actuar sobre ellos inmediatamente.

## Instalación

No se requiere instalación. El MCP remoto de Sentry se conecta a través del transporte SSE. No hay paquete npm para instalar o mantener.

## Configuración

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SENTRY_AUTH_TOKEN"
      }
    }
  }
}
```

Reemplaza `YOUR_SENTRY_AUTH_TOKEN` con tu token (ver Autenticación a continuación).

## Herramientas clave

| Herramienta | Qué hace |
|---|---|
| `list_issues` | Consultar problemas abiertos con filtros (proyecto, prioridad, env, rango de fechas) |
| `get_issue` | Obtener detalle completo del problema incluyendo traza de pila y metadatos |
| `resolve_issue` | Marcar un problema como resuelto |
| `list_events` | Listar todos los eventos asociados con un problema |
| `get_event` | Recuperar una carga útil de evento específica |
| `list_releases` | Listar versiones para un proyecto |
| `get_release` | Detalle de versión incluyendo tasa de error, adopción y regresiones |
| `list_projects` | Listar todos los proyectos en tu organización |
| `create_comment` | Agregar un comentario a un problema |
| `assign_issue` | Asignar un problema a un miembro del equipo |

## Ejemplos de uso

```
Lista todos los problemas P0 no resueltos de las últimas 24 horas

Muestra la traza de pila completa para el problema PROJ-1234

Resuelve todos los problemas etiquetados como duplicado en el proyecto auth

¿Cuál es la tendencia de tasa de error para la versión v2.1.0?

Encuentra todos los TypeErrors en producción esta semana y agrupa por archivo

¿Qué problemas tienen el mayor impacto en el usuario en producción ahora mismo?
```

## Autenticación

1. Inicia sesión en Sentry y ve a **Configuración de usuario → Tokens de API**
2. Crea un nuevo token con los siguientes alcances:
   - `project:read`
   - `issue:read`
   - `issue:write` (requerido para acciones de resolver y comentar)
3. Copia el valor del token — se muestra solo una vez
4. Pégalo en el encabezado `Authorization` en el bloque de configuración anterior

Los tokens a nivel de organización (para organizaciones multi-proyecto) funcionan de la misma manera — créalos bajo **Organization Settings → API Tokens**.

## Consejos

- Los MCPs remotos usan `transport: "sse"` y una URL — sin campos de `command` o `args`. Si ves errores de inicio, verifica que la configuración no esté usando el formato de estilo npx.
- El MCP remoto de Sentry se lanzó en febrero de 2026 como parte del programa MCP oficial de Sentry.
- Siempre filtra por `environment` (producción vs staging) cuando consultes problemas — mezclar entornos en clasificación desperdicia tiempo.
- `search_errors` soporta la sintaxis de consulta de Sentry: `is:unresolved level:error user.email:*` — la misma sintaxis usada en la interfaz de Sentry.
- `get_release` es la forma más rápida de verificar si un nuevo despliegue introdujo una regresión antes de que se dispare tu alerta de monitoreo.
- Canaliza la salida de `get_issue` a una solicitud de corrección de código — Claude tiene el contexto completo necesario para escribir un parche dirigido.

---
