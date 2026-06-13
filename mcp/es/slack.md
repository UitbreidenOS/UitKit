# MCP: Slack

Lee canales de Slack, busca mensajes, publica actualizaciones y gestiona notificaciones — trae el contexto de tu equipo a Claude Code sin cambiar de pestaña ni perder productividad.

## Por qué lo necesitas

El conocimiento del equipo vive en Slack: decisiones de diseño, cronogramas de incidentes, retroalimentación de productos y discusiones asincrónicas que nunca llegan a los documentos. Sin MCP, Claude no puede ver nada de eso. Con Slack MCP:
- El historial de canales y la búsqueda dan a Claude el contexto completo del equipo detrás de cualquier característica o bug
- Publicar avisos de despliegue, resúmenes de PR o actualizaciones de estado ocurre dentro de la sesión de codificación
- Ponerse al día con discusiones perdidas (standups, hilos de retroalimentación, canales de incidentes) es una solicitud única
- Las publicaciones de estado automatizadas desde Claude pueden reemplazar actualizaciones manuales de Slack durante tareas largas

## Instalación

```bash
npm install -g @modelcontextprotocol/server-slack
```

## Configuración

Agrega a `~/.claude.json` o `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    }
  }
}
```

## Herramientas clave / Qué hacen

- `list_channels` — listar canales públicos en el workspace (nombre, ID, número de miembros, tema)
- `get_channel_history` — obtener mensajes recientes de un canal con un límite de mensajes configurable
- `search_messages` — búsqueda de texto completo en todos los canales a los que el bot tiene acceso, con filtros de fecha opcionales
- `post_message` — publicar un mensaje a un canal (soporta formato markdown de Slack)
- `reply_to_thread` — responder a un mensaje existente en un hilo usando la marca de tiempo del mensaje padre
- `get_thread_replies` — obtener todas las respuestas en un hilo por canal y marca de tiempo padre
- `list_users` — listar miembros del workspace con nombres de visualización e IDs de usuario
- `get_user_profile` — recuperar el perfil completo de un usuario (título, zona horaria, correo si está permitido)
- `upload_file` — cargar un archivo o fragmento a un canal
- `add_reaction` — agregar una reacción emoji a un mensaje

## Ejemplos de uso

```
Busca en Slack todas las menciones del bug de autenticación esta semana en todos
los canales en los que estoy. Resume lo que el equipo encontró y si hay una
corrección acordada o si todavía está abierto.
```

```
Publica una notificación de despliegue a #deployments:
La versión 2.4.1 está en vivo en producción. Cambios: [lista de cambios aquí].
Instrucciones de reversión: [enlace].
```

```
Obtén los últimos 30 mensajes de #product-feedback e identifica
las 3 solicitudes de características principales por frecuencia de mención.
Lista cualquier solicitud que aparezca más de una vez.
```

```
Responde al hilo en #engineering donde Sarah preguntó sobre
la migración de base de datos — cuéntale que la migración se ejecutó con éxito,
tomó 4 minutos y cero filas fueron afectadas inesperadamente.
```

```
Resume el canal #engineering de hoy. He estado enfocado
durante 6 horas — ¿qué decisiones se tomaron y qué necesito saber?
```

## Autenticación

1. Ve a **api.slack.com/apps** y haz clic en **Crear nueva aplicación** → **Desde cero**
2. Nombra la aplicación y selecciona tu workspace
3. Bajo **OAuth & Permissions → Bot Token Scopes**, agrega estos alcances:
   - `channels:read` — listar canales públicos
   - `channels:history` — leer mensajes de canales públicos
   - `groups:read` / `groups:history` — lo mismo para canales privados (si es necesario)
   - `search:read` — buscar mensajes en todo el workspace
   - `chat:write` — publicar mensajes
   - `users:read` — listar y buscar usuarios
   - `files:write` — cargar archivos (si es necesario)
   - `reactions:write` — agregar reacciones (si es necesario)
4. Haz clic en **Instalar en workspace** y aprueba los permisos
5. Copia el **Bot User OAuth Token** (comienza con `xoxb-`) y establécelo como `SLACK_BOT_TOKEN`
6. Encuentra tu **Team ID** bajo **Settings → Basic Information** y establécelo como `SLACK_TEAM_ID`
7. Invita al bot a cada canal que necesita leer con `/invite @your-bot-name`

## Consejos

**El bot debe ser invitado a canales:** El bot solo puede leer y publicar en canales a los que ha sido añadido. Para canales privados, esto requiere un `/invite @botname` explícito de un miembro del canal — el acceso de administrador no lo otorga automáticamente.

**`search:read` es un alcance separado:** El historial de canal y la búsqueda son permisos diferentes. `channels:history` solo lee un canal específico que especifiques. `search:read` habilita la búsqueda de mensajes en todo el workspace. Necesitas ambos para funcionalidad completa.

**Los límites de tasa varían por endpoint:** La mayoría de endpoints caen bajo Tier 3 de Slack (50+ solicitudes/minuto). La búsqueda es Tier 2 (20 solicitudes/minuto). Para operaciones de alto volumen, agrega breves retrasos entre llamadas para evitar errores 429.

**La publicación de mensajes directos requiere alcance extra:** Publicar en el DM de un usuario requiere el alcance `im:write` además de `chat:write`. Agrégalo a los alcances del bot y reinstala si necesitas esta capacidad.

**Markdown de Slack en mensajes:** `post_message` soporta el formato mrkdwn de Slack: `*negrita*`, `_cursiva_`, `` `código` ``, `>blockquote` y `<URL|texto de enlace>`. Usa esto cuando formatees avisos de despliegue o resúmenes estructurados.

**Las marcas de tiempo de hilos son precisas:** `reply_to_thread` requiere el valor exacto de `ts` (marca de tiempo) del mensaje padre, que se parece a `1716300000.000100`. Obtenlo de la salida de `get_channel_history` antes de responder.

---
