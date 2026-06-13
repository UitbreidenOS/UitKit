# MCP: PagerDuty

Conecta Claude Code a PagerDuty para gestión de incidentes — enumera incidentes activos, verifica programas de on-call, reconoce y resuelve alertas, y crea nuevos incidentes sin salir de tu terminal.

## Por qué lo necesitas

Durante un incidente, cambiar a la IU de PagerDuty rompe el enfoque. El MCP de PagerDuty permite a Claude consultar estado de incidente en vivo, identificar quién está on-call y tomar acciones de reconocer/resolver directamente — manteniéndote en tu editor mientras trabajas el problema.

## Requisitos previos

- Cuenta de PagerDuty (cualquier plan con acceso a API REST)
- Una **Clave API REST** — encontrada bajo **Configuración de Usuario → Claves de Acceso a API** (token de usuario) o **Integraciones → Claves de Acceso a API** (token a nivel de cuenta; requiere Admin)
- Tu dirección de email asociada con la cuenta de PagerDuty (requerida para operaciones de escritura)

## Instalación

El servidor MCP de PagerDuty está disponible como paquete npx. No se requiere instalación global.

```bash
npx @pagerduty/mcp --version
```

Alternativamente, PagerDuty soporta un punto final remoto SSE para equipos que prefieren no ejecutar un proceso local. Ver Configuración a continuación para ambas opciones.

## Configuración

**Opción A — npx (recomendado para uso local):**

```json
{
  "mcpServers": {
    "pagerduty": {
      "command": "npx",
      "args": ["-y", "@pagerduty/mcp"],
      "env": {
        "PD_API_TOKEN": "YOUR_PAGERDUTY_REST_API_KEY",
        "PD_USER_EMAIL": "you@yourcompany.com"
      }
    }
  }
}
```

**Opción B — punto final remoto SSE:**

```json
{
  "mcpServers": {
    "pagerduty": {
      "transport": "sse",
      "url": "https://mcp.pagerduty.com/sse",
      "headers": {
        "Authorization": "Token token=YOUR_PAGERDUTY_REST_API_KEY"
      }
    }
  }
}
```

Usa la Opción B si tu equipo quiere una conexión compartida y gestionada centralmente sin distribuir tokens de API a máquinas de desarrollador individuales.

## Herramientas clave

| Herramienta | Descripción | Parámetros clave |
|---|---|---|
| `list_incidents` | Enumera incidentes con filtros de estado y urgencia | `status` (`triggered`, `acknowledged`, `resolved`), `urgency` (`high`, `low`), `service_ids`, `limit` |
| `get_incident` | Obtén detalles completos para un único incidente | `incident_id` |
| `acknowledge_incident` | Reconoce un incidente (detiene escalada) | `incident_id` |
| `resolve_incident` | Resuelve un incidente | `incident_id`, `resolution_note` |
| `list_services` | Enumera todos los servicios de PagerDuty en la cuenta | `query` (filtro de nombre) |
| `get_on_call` | Obtén el usuario(s) on-call actual para una programación o política de escalada | `schedule_ids`, `escalation_policy_ids`, `since`, `until` |
| `create_incident` | Abre un nuevo incidente en un servicio | `title`, `service_id`, `urgency`, `body` |

## Ejemplos de uso

```
¿Quién está on-call ahora mismo para el servicio de pagos?

Enumera todos los incidentes abiertos P1 en toda la organización

Reconoce incidente INC-123456 y deja una nota de que estoy investigando

Resuelve INC-789012 con nota de resolución "Revierte despliegue v2.4.1"

Crea un incidente de alta urgencia en el servicio de checkout titulado "Grupo de conexión de base de datos agotado"
```

## Autenticación

**Token de API de usuario (lectura + escritura para tu propio usuario):**
1. Inicia sesión en PagerDuty y ve a **Icono de Usuario → Mi Perfil → Configuración de Usuario → Crear Token de Usuario de API**
2. Copia el valor de token — se muestra solo una vez
3. Pega en `PD_API_TOKEN` en tu settings.json

**Token de API a nivel de cuenta (acceso completo a cuenta, requiere rol Admin):**
1. Ve a **Integraciones → Claves de Acceso a API → Crear Nueva Clave API**
2. Etiquétalo claramente (p. ej., `claude-code-mcp`) y copia el valor

Las operaciones de reconocimiento y resolución requieren que `PD_USER_EMAIL` esté configurado al email del usuario asociado con el token. Las operaciones de escritura realizadas a través de un token a nivel de cuenta también requieren el campo de email para atribución del registro de auditoría.

## Consejos

- `list_incidents` con `status:triggered` te da todos los incidentes disparados no reconocidos — la forma más rápida de evaluar radio de explosión durante una interrupción.
- `get_on_call` acepta una ventana de tiempo (`since`, `until`) para que puedas verificar rotaciones de on-call futuras, no solo el momento actual.
- Los IDs de incidente de PagerDuty en la API son numéricos (p. ej., `P1234AB`) — puedes encontrarlos en la URL de cualquier página de detalle de incidente.
- `create_incident` requiere un `service_id` válido. Usa `list_services` primero si no tienes el ID memorizado.
- Resolver incidentes a través de MCP aún dispara el flujo de notificación post-incidente normal de PagerDuty — las partes interesadas serán notificadas según se configura.
- Para cuentas en el plan AIOps o Event Intelligence de PagerDuty, fusión de incidente y datos de correlación de alerta están disponibles a través de herramientas adicionales no listadas aquí — verifica el changelog del paquete para herramientas recientemente agregadas.

## Notas de costo

El MCP de PagerDuty usa API REST v2 de PagerDuty, que se incluye en todos los planes pagados. No hay tarifas por llamada. Los límites de velocidad se aplican a 960 solicitudes/minuto por token de API para la mayoría de puntos finales — bien por encima de uso interactivo, pero relevante para flujos de trabajo automatizados.

---
