# MCP: Datadog

Conecta Claude Code a Datadog para observabilidad en tiempo real — consulta métricas, busca registros, inspecciona trazas APM y gestiona monitores sin salir de tu terminal.

## Por qué lo necesitas

Depurar un pico de latencia o incidente en producción significa saltar entre paneles de Datadog, copiar consultas de métrica, pegar resultados en Claude y perder impulso. El MCP de Datadog elimina ese cambio de contexto — Claude consulta tus métricas en vivo, registros y trazas in-context y te ayuda a diagnosticar y actuar inmediatamente.

## Requisitos previos

- Cuenta de Datadog con acceso a API (cualquier plan pagado)
- Una **Clave API** — encontrada bajo **Configuración de Organización → Claves API**
- Una **Clave de Aplicación** — encontrada bajo **Configuración de Organización → Claves de Aplicación** (las claves de aplicación están limitadas a usuario; usa una cuenta de servicio para uso compartido)
- Para despliegues de EU o GovCloud, tu valor `DD_SITE` (ver Configuración a continuación)

## Instalación

Instala el servidor MCP oficial de Datadog a través de npx — no requiere instalación global.

```bash
npx @datadog/mcp-datadog --version
```

Si el paquete se resuelve sin error, estás listo para configurar.

## Configuración

Agrega lo siguiente a tu `~/.claude/settings.json` (nivel de usuario) o `.claude/settings.json` (nivel de proyecto):

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["-y", "@datadog/mcp-datadog"],
      "env": {
        "DD_API_KEY": "YOUR_DD_API_KEY",
        "DD_APP_KEY": "YOUR_DD_APP_KEY",
        "DD_SITE": "datadoghq.com"
      }
    }
  }
}
```

**Valores de `DD_SITE` por región:**

| Región | Valor |
|---|---|
| US1 (predeterminado) | `datadoghq.com` |
| US3 | `us3.datadoghq.com` |
| US5 | `us5.datadoghq.com` |
| EU1 | `datadoghq.eu` |
| GovCloud | `ddog-gov.com` |

Deja `DD_SITE` sin configurar si estás en la región US1 predeterminada.

## Herramientas clave

| Herramienta | Descripción | Parámetros clave |
|---|---|---|
| `query_metrics` | Ejecuta una consulta de métricas de Datadog en una ventana de tiempo | `query` (cadena de consulta DDog), `from`, `to` |
| `search_logs` | Busca eventos de registro con sintaxis de filtro | `query`, `from`, `to`, `limit` |
| `list_dashboards` | Enumera todos los paneles en la org | `filter_name` |
| `get_monitors` | Recupera monitores con filtro de estado opcional | `status` (`Alert`, `Warn`, `OK`, `No Data`), `tags` |
| `create_incident` | Abre un nuevo incidente en Gestión de Incidentes de Datadog | `title`, `severity`, `customer_impacted` |
| `query_apm_traces` | Busca trazas APM por servicio, operación o recurso | `service`, `operation`, `resource`, `from`, `to`, `limit` |

## Ejemplos de uso

```
Muestra latencia p99 para /api/checkout durante la última 1 hora

Encuentra todas las entradas de registro a nivel ERROR en payment-service de los últimos 30 minutos

Enumera todos los monitores actualmente en estado ALERT

¿Cuáles son las trazas APM más lentas para el servicio de órdenes en los últimos 15 minutos?

Crea un incidente Sev-2 titulado "Tasa de error elevada en servicio de checkout"
```

## Autenticación

1. Inicia sesión en Datadog y ve a **Configuración de Organización → Claves API**
2. Crea una nueva clave API — nota el valor de clave (mostrado solo una vez)
3. Ve a **Configuración de Organización → Claves de Aplicación**
4. Crea una clave de aplicación limitada a tu usuario o una cuenta de servicio
5. Agrega ambos valores al bloque `env` en tu settings.json como se muestra arriba

Permisos mínimos para la clave de aplicación: `metrics_read`, `logs_read`, `monitors_read`, `apm_read`. Agrega `incidents_write` si quieres que `create_incident` funcione.

## Consejos

- Las consultas de métricas de Datadog usan la misma sintaxis que el Explorador de Métricas: `avg:system.cpu.user{service:checkout}`. Copia directamente desde la IU.
- Los parámetros `from` y `to` aceptan marcas de tiempo Unix o cadenas relativas como `now-1h`.
- `search_logs` usa sintaxis de consulta de registro de Datadog — filtros de faceta como `service:payment-service @http.status_code:500` funcionan como se espera.
- `get_monitors` con `status:Alert` es la forma más rápida de obtener una instantánea de condiciones de disparo activas durante un incidente.
- Para consultas APM de alta cardinalidad, configura un `limit` (predeterminado generalmente 100) para evitar respuestas lentas.
- Las claves de aplicación están limitadas a usuario por defecto — si múltiples miembros del equipo usan este MCP, crea una clave de aplicación de cuenta de servicio compartida para evitar desvío de permisos cuando alguien se va.
- Lanzado en marzo 2026 como parte del programa MCP oficial de Datadog.

## Notas de costo

Todas las llamadas MCP consumen cuota de API de Datadog. Las consultas de métricas y búsquedas de registro cuentan contra los límites de velocidad de API de tu plan. Evita ejecutar consultas automatizadas de alta frecuencia (p. ej., a través de hooks) sin revisar los límites de tu plan — Datadog aplica límites por segundo y por hora a nivel de organización.

---
