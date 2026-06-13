# Servidores MCP Remotos — Transporte, Autenticación y Operaciones en Producción

Cómo conectar Claude Code a servidores MCP remotos: selección de transporte, patrones de autenticación, descubrimiento de herramientas diferido, alojamiento y endurecimiento para producción.

---

## Qué hace que un MCP sea "Remoto"

Los servidores MCP locales se ejecutan como un proceso secundario en la misma máquina que Claude Code. Los servidores MCP remotos se ejecutan en otro lugar — en un host en la nube, un servicio interno compartido o infraestructura de un proveedor — y Claude Code se conecta a ellos a través de una red.

La distinción importa para:
- **Autenticación:** Los procesos locales heredan variables de entorno; los servidores remotos requieren paso de credenciales explícito
- **Costo de inicio:** Los servidores locales comienzan con Claude Code; los servidores remotos tienen latencia de ida y vuelta en cada llamada de herramienta
- **Compartir:** Un MCP remoto puede servir a múltiples desarrolladores y entornos desde una implementación
- **Mantenimiento:** Los binarios del servidor local necesitan ser instalados y actualizados en todas partes; los servidores remotos se actualizan centralmente

---

## Tipos de Transporte

La especificación MCP 2025-11 define tres tipos de transporte. Entender cuál usa un servidor determina cómo lo configuras y qué características de latencia esperar.

### stdio — Proceso Local (campo command)

El transporte MCP original. Claude Code genera el servidor como un subproceso y se comunica sobre tuberías stdin/stdout.

```json
{
  "mcpServers": {
    "my-local-server": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Características:**
- Latencia cero de red — comunicación por tubería IPC
- El proceso del servidor es propiedad de Claude Code — ciclo de vida vinculado a la sesión
- Autenticación a través de variables de entorno pasadas en el campo `env`
- No compartible en máquinas o usuarios
- Los bloqueos del subproceso terminan la conexión MCP silenciosamente

**Cuándo usar stdio:** herramientas de desarrollo local (sistema de archivos, git, base de datos local), herramientas que necesitan acceso a archivos o procesos de la máquina local, flujos de trabajo de un solo desarrollador.

---

### SSE — Transmisión HTTP (remoto heredado)

Server-Sent Events sobre HTTP. El cliente mantiene una conexión HTTP persistente abierta; el servidor empuja eventos hacia abajo. SSE fue el primer transporte MCP remoto y sigue siendo el más ampliamente soportado a partir de mediados de 2026.

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SENTRY_TOKEN"
      }
    }
  }
}
```

**Características:**
- Compatible con HTTP/1.1 — funciona a través de la mayoría de proxies y firewalls
- Conexión persistente — el servidor puede empujar resultados de herramientas incrementalmente
- Los encabezados se envían con la solicitud de conexión inicial
- El comportamiento de reconexión es automático en Claude Code (con backoff exponencial)
- Las conexiones SSE son unidireccionales del servidor al cliente — las invocaciones de herramientas regresan a través de un canal POST separado

**Perfil de latencia:** 50–300ms latencia adicional por llamada de herramienta vs stdio, dependiendo de la geografía del servidor y la reutilización de conexión.

---

### Streamable-HTTP — Nuevo Predeterminado (MCP 2025-11)

La especificación MCP 2025-11 introdujo streamable-HTTP como el transporte remoto preferido. Usa solicitudes HTTP POST estándar con cuerpos de respuesta de transmisión, eliminando el patrón SSE dual-canal incómodo.

```json
{
  "mcpServers": {
    "my-server": {
      "transport": "http",
      "url": "https://mcp.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN"
      }
    }
  }
}
```

**Características:**
- Cada llamada de herramienta es una única solicitud POST con un cuerpo de respuesta de transmisión
- No se requiere conexión persistente — funciona bien detrás de balanceadores de carga HTTP/2
- Implementación de servidor más simple que SSE (sin gestión de canal dual)
- Sin estado desde la perspectiva de la infraestructura — fácil de escalar horizontalmente
- Soporta tokens de sesión a través del encabezado de respuesta `Mcp-Session-Id` para servidores con estado que lo necesitan

**Cuándo usar streamable-HTTP sobre SSE:**
- Alojamiento detrás de Cloudflare Workers o cualquier tiempo de ejecución de borde (las conexiones SSE persistentes son problemáticas allí)
- Implementaciones multi-inquilino de alta concurrencia
- Cualquier servidor nuevo que estés escribiendo tú mismo — prefiere streamable-HTTP

**Nota de compatibilidad:** Claude Code soporta tanto `"transport": "sse"` como `"transport": "http"`. Los servidores más antiguos que solo hablan SSE continuarán funcionando. Los nuevos MCPs de proveedores lanzados después de la especificación 2025-11 están usando cada vez más streamable-HTTP.

---

## Configuración de MCP Remoto en settings.json

El campo `"url"` señala una conexión remota. El campo `"command"` señala un proceso stdio local. Nunca uses ambos en la misma entrada de servidor.

**Ubicación de settings.json:**
- Nivel de proyecto: `.claude/settings.json` (verificado en repo — evita incrustar tokens aquí)
- Nivel de usuario: `~/.claude/settings.json` (máquina-local — seguro para tokens personales)
- Nivel del sistema: `/etc/claude/settings.json` (administrado por administradores para entornos compartidos)

**Estructura de configuración de servidor remoto completa:**
```json
{
  "mcpServers": {
    "server-name": {
      "transport": "sse",
      "url": "https://hostname/path",
      "headers": {
        "HeaderName": "value"
      },
      "timeout": 30000,
      "connectionTimeout": 10000
    }
  }
}
```

| Campo | Requerido | Propósito |
|---|---|---|
| `transport` | No (por defecto `"sse"`) | `"sse"` o `"http"` |
| `url` | Sí | URL completa al punto final MCP |
| `headers` | No | Encabezados HTTP enviados con cada solicitud |
| `timeout` | No | Tiempo de espera de llamada de herramienta en milisegundos (por defecto 30000) |
| `connectionTimeout` | No | Tiempo de espera de conexión inicial en milisegundos |

---

## Patrones de Autenticación

### Tokens Bearer de OAuth 2.0

El patrón de autenticación estándar para MCPs remotos operados por proveedores. Obtienes un token del flujo OAuth del servicio o página de clave API, luego lo pasas como encabezado Authorization.

```json
{
  "mcpServers": {
    "github-copilot": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ghp_YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

**Origen del token:** Nunca codifiques tokens en `.claude/settings.json` si el archivo está bajo control de versión. Usa interpolación de variable de entorno en su lugar:

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

Claude Code expande `${VAR_NAME}` desde el entorno del proceso antes de hacer la conexión. Establece la variable en tu perfil de shell o en la sección `env` de tu configuración de nivel de usuario.

**Flujo OAuth 2.0 PKCE (autenticación basada en navegador):** Algunos MCPs remotos (Supabase remoto, GitHub MCP) soportan OAuth basado en navegador. Cuando se configura con `"auth": "oauth"` y sin token explícito, Claude Code abre una ventana del navegador para el flujo OAuth y almacena el token resultante en el llavero del sistema.

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "auth": "oauth"
    }
  }
}
```

---

### Clave API en Encabezado Personalizado

Algunos servicios usan un nombre de encabezado personalizado en lugar de `Authorization`. Cloudflare, Vercel y varios MCPs internos de empresas siguen este patrón.

```json
{
  "mcpServers": {
    "cloudflare": {
      "transport": "http",
      "url": "https://mcp.cloudflare.com/mcp",
      "headers": {
        "X-Auth-Key": "${CLOUDFLARE_API_KEY}",
        "X-Auth-Email": "${CLOUDFLARE_EMAIL}"
      }
    }
  }
}
```

Para MCPs internos, es común también enviar un identificador de servicio o etiqueta de entorno:

```json
{
  "mcpServers": {
    "internal-api": {
      "transport": "http",
      "url": "https://mcp.internal.company.com/mcp",
      "headers": {
        "X-Api-Key": "${INTERNAL_MCP_KEY}",
        "X-Environment": "production",
        "X-Client": "claude-code"
      }
    }
  }
}
```

---

### TLS Mutuo (mTLS)

Para entornos empresariales donde el servidor necesita verificar la identidad del cliente además del cliente verificar el servidor. mTLS se configura fuera de los encabezados — requiere que Claude Code se lance con variables de entorno de certificado configuradas.

```bash
export MCP_CLIENT_CERT=/path/to/client.crt
export MCP_CLIENT_KEY=/path/to/client.key
export MCP_CA_CERT=/path/to/ca.crt
```

```json
{
  "mcpServers": {
    "enterprise-mcp": {
      "transport": "http",
      "url": "https://secure-mcp.corp.example.com/mcp",
      "headers": {
        "X-Client-Id": "claude-code-workstation"
      }
    }
  }
}
```

El apretón de manos TLS usa los certificados del entorno; el encabezado es identificación de cliente a nivel de aplicación en la parte superior.

**Cuándo vale la pena la complejidad de configuración de mTLS:** industrias reguladas (fintech, sanidad, defensa) donde se requiere autenticación a nivel de red por política de cumplimiento, o MCPs internos que solo deben ser alcanzables desde máquinas emitidas por corporación con certificados inscritos.

---

## Descubrimiento de Herramientas Diferido

Por defecto, cuando Claude Code se conecta a un servidor MCP, inmediatamente obtiene el esquema de herramientas completo — nombres, descripciones y JSON Schema para cada parámetro de entrada — para cada servidor registrado. En startup con 10+ servidores, esto puede agregar 2–5 segundos y una ráfaga de solicitudes de red.

El descubrimiento de herramientas diferido cambia esto: la conexión del servidor se establece, pero los esquemas de herramientas no se obtienen hasta que Claude Code realmente necesita usar una herramienta de ese servidor. Una entrada "usa este servidor" stub aparece en el contexto de Claude inmediatamente; el esquema completo se carga en el primer acceso.

**Habilitalo:**
```bash
CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY=1 claude
```

O establécelo permanentemente en tu configuración de nivel de usuario:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY": "1"
  }
}
```

**Cómo funciona:**
1. Al inicio de la sesión, Claude Code abre conexiones a todos los servidores MCP configurados (apretón de manos TCP + autenticación)
2. No llama a `tools/list` en ningún servidor
3. El contexto de Claude contiene el nombre del servidor y un marcador de posición — Claude sabe que el servidor existe pero no qué herramientas expone
4. Cuando Claude decide usar una herramienta de ese servidor (basado en el nombre del servidor o conocimiento anterior de la sesión), activa una llamada `tools/list` para obtener el esquema
5. El esquema se almacena en caché para el resto de la sesión

**Implicaciones de latencia de carga perezosa:**
- El primer uso de cualquier herramienta de un servidor incurre en una ida y vuelta `tools/list` antes de la llamada de herramienta real
- En un servidor remoto con latencia de 100 ms, esto agrega ~200 ms al primer uso de herramienta (solicitud + respuesta para `tools/list`)
- Los usos posteriores en la misma sesión usan el esquema almacenado en caché — sin sobrecarga
- Para servidores que usas una vez por sesión (p. ej., una herramienta de despliegue), el sobrecargo es irrelevante
- Para servidores que usas repetidamente (p. ej., un MCP de base de datos), el costo único se amortiza inmediatamente

**Cuándo habilitarlo:**
- Tienes 5+ servidores MCP configurados
- La mayoría de sesiones usan solo 2–3 de ellos
- La latencia de inicio es notable o estás usando Claude Code en un contexto de CI/automatización donde el tiempo de inicio de sesión importa

**Cuándo mantenerlo deshabilitado:**
- Dependes de Claude sugiriendo proactivamente herramientas de servidores que no ha usado aún en la sesión
- Tienes solo 2–3 servidores — el costo de inicio es negligible

---

## Ejecutando tu Propio MCP Remoto

### Cloudflare Workers

Mejor para: herramientas a las que se accede globalmente, necesitan baja latencia en todo el mundo, tienen lógica sin estado simple. Los Workers se ejecutan en el borde — las solicitudes se manejan en la región más cercana al cliente.

**Restricciones:**
- Límite de memoria de 128 MB por solicitud
- Límite de tiempo CPU de 30 segundos (el tiempo real es hasta 30s con colocación inteligente, pero puede extenderse)
- Sin estado persistente en memoria entre solicitudes — usa Durable Objects o KV para estado
- Las conexiones SSE persistentes son incómodas en Workers — usa transporte streamable-HTTP en su lugar

**Scaffold MCP mínimo de Workers:**
```typescript
// worker.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

export default {
  async fetch(request: Request): Promise<Response> {
    const server = new McpServer({ name: 'my-tool', version: '1.0.0' })

    server.tool('do_thing', { input: z.string() }, async ({ input }) => ({
      content: [{ type: 'text', text: `Result: ${input}` }]
    }))

    const transport = new StreamableHTTPServerTransport(request)
    await server.connect(transport)
    return transport.response
  }
}
```

**Precios:** La capa gratuita de Workers cubre 100K solicitudes/día. Para una herramienta de desarrollador usada por una persona, esto es efectivamente gratuito.

---

### Railway

Mejor para: servidores que necesitan conexiones persistentes, estado en memoria o trabajadores en segundo plano. Railway ejecuta contenedores Docker estándar con procesos persistentes.

**Pros:**
- Procesos verdaderamente de larga duración — las conexiones SSE funcionan normalmente
- Acceso del sistema de archivos para herramientas que lo necesitan
- Variables de entorno gestionadas a través del panel de Railway
- Despliegue `railway link` + `railway up` en menos de 60 segundos
- Reinicio automático en bloqueo

**Contras:**
- Mínimo de $5/mes para servicio siempre activo (plan Hobby)
- Inicios en frío si el servicio duerme (en capa gratuita)
- Una sola región por defecto — sin borde global

**Recomendado para:** MCPs de equipo interno, MCPs con conexiones de base de datos que necesitan agrupamiento de conexiones, cualquier MCP donde necesites depurar con registros reales.

**Patrón de settings.json de Railway:**
```json
{
  "mcpServers": {
    "team-tools": {
      "transport": "sse",
      "url": "https://team-tools.up.railway.app/sse",
      "headers": {
        "Authorization": "Bearer ${TEAM_MCP_TOKEN}"
      }
    }
  }
}
```

---

### Fly.io

Mejor para: MCPs que necesitan distribución global con procesos persistentes (a diferencia de Workers, Fly ejecuta máquinas virtuales reales). Fly puede colocar tu aplicación en 30+ regiones y enrutar solicitudes a la instancia más cercana.

**Pros:**
- VMs persistentes — sin límites de tiempo CPU
- Multi-región con enrutamiento anycast incorporado
- La capa gratuita cubre instancias pequeñas (256 MB RAM, CPU compartida)
- VPN WireGuard nativa para acceso a red privada

**Contras:**
- Configuración más compleja que Railway (requiere `fly.toml`)
- Las máquinas de capa gratuita duermen después de 15 minutos de inactividad — se aplican inicios en frío
- El estado multi-región requiere coordinación cuidadosa (Fly Volumes son en una sola región)

**Cuándo elegir Fly sobre Railway:** Tus usuarios están en múltiples continentes y la latencia del MCP importa, o necesitas colocar el MCP en la misma región que una base de datos específica.

**Patrón de settings.json de Fly.io:**
```json
{
  "mcpServers": {
    "global-search": {
      "transport": "http",
      "url": "https://my-mcp.fly.dev/mcp",
      "headers": {
        "Authorization": "Bearer ${SEARCH_MCP_TOKEN}"
      },
      "timeout": 45000
    }
  }
}
```

---

## MCPs Remotos Oficiales (2026)

Estos son MCPs remotos operados por proveedores con SLAs de producción, sin dependencia local y soporte oficial.

### MCP Remoto de Supabase

Proporciona acceso a la base de datos Postgres, Auth, Storage y Edge Functions de tu proyecto Supabase.

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

Obtén tu token de acceso en `supabase.com/dashboard/account/tokens`. El token es un token de acceso personal limitado a tu cuenta de Supabase — puede acceder a todos tus proyectos.

### MCP Remoto de Sentry

Acceso a problemas, seguimientos de pila, salud de versión y datos de desempeño.

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    }
  }
}
```

Token desde: `sentry.io` > Configuración > Tokens de Autenticación > Crear Nuevo Token. Alcances requeridos: `project:read`, `org:read`, `event:read`.

### MCP Remoto de Neon

Ramificación de base de datos, ejecución SQL, introspección de esquema y gestión de cadena de conexión.

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

Token desde: `console.neon.tech` > Configuración de Cuenta > Claves API.

### MCPs de Extensión de GitHub Copilot

La capa MCP de GitHub expone datos de repositorio, solicitudes de extracción, problemas, búsqueda de código y Acciones — la misma superficie de datos que Copilot, accesible desde Claude Code.

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```

Token desde: GitHub > Configuración > Configuración de Desarrollador > Tokens de acceso personal > Grano fino. Los alcances requeridos dependen de las herramientas usadas — como mínimo `repo:read` e `issues:read`.

---

## Seguridad: Modelo de Confianza y Qué Pueden Acceder los MCPs Remotos

### Qué puede hacer un MCP remoto

Un servidor MCP remoto tiene acceso a todo lo que le des a través de:
1. **Encabezados que configures** — tokens, claves API, credenciales
2. **Argumentos de llamada de herramienta** — lo que Claude pasa a una invocación de herramienta
3. **Fuga de contexto** — si una herramienta devuelve datos a Claude, esos datos son visibles en el contexto de Claude y pueden ser referenciados en turnos futuros

Un MCP remoto NO puede acceder a:
- Tu sistema de archivos local (a menos que una herramienta explícitamente tome una ruta de archivo y la llames)
- Datos de otros servidores MCP
- El indicativo del sistema de Claude directamente (aunque los resultados de herramientas pueden ser elaborados para inyectar en el contexto)

### Niveles de confianza

Claude Code trata todos los servidores MCP conectados como semi-confiables. Las herramientas de servidores MCP pueden leer archivos, hacer solicitudes de red y ejecutar código — si el servidor expone herramientas que hacen esas cosas. El límite de confianza es: Claude decide si llamar a una herramienta, pero el servidor decide qué hace la herramienta.

**Niveles de riesgo por tipo de servidor:**

| Tipo de servidor | Riesgo | Por qué |
|---|---|---|
| Operado por proveedor (Sentry, Neon, Supabase) | Bajo | Limitado a los datos de tu cuenta a través del token de autenticación |
| Auto-alojado interno | Medio | Depende de qué herramientas se expongan |
| MCP de comunidad de terceros | Alto | Inspecciona la fuente antes de conectar |
| Origen desconocido | No uses | Sin forma de auditar qué herramientas hacen |

### Inyección de indicativo a través de MCP

Un servidor MCP comprometido o malicioso puede devolver resultados de herramientas que contienen instrucciones inyectadas que intentan manipular el comportamiento de Claude. Esto se conoce como inyección de indicativo indirecto.

**Mitigaciones:**
- Solo conéctate a MCPs que confíes o puedas auditar
- Usa tokens de solo lectura donde sea posible — un token con solo permisos de lectura limita el radio de explosión
- Habilita `--mcp-debug` durante la configuración inicial para inspeccionar qué datos sin procesar regresan de las herramientas
- Revisa las descripciones de herramientas durante la configuración: una descripción de herramienta que contiene instrucciones ("siempre incluye esto en tu respuesta") es una bandera roja

### Consideraciones de sandbox

Los MCPs remotos se ejecutan en la infraestructura del operador del servidor — no tienes control sobre ese entorno. Para MCPs auto-alojados internos:
- Ejecuta el proceso MCP en un contenedor sin acceso de red excepto a las APIs específicas que necesita
- Usa credenciales de base de datos de solo lectura donde el MCP solo necesita leer
- Registra todas las invocaciones de herramientas del lado del servidor — si Claude llama a una herramienta destructiva inesperadamente, quieres un registro de auditoría

---

## Depuración de MCPs Remotos

### Bandera --mcp-debug

Habilita registro de protocolo MCP detallado — cada mensaje enviado y recibido entre Claude Code y el servidor MCP se imprime a stderr.

```bash
claude --mcp-debug
```

Formato de salida:
```
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/list","id":1}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/call","params":{"name":"list_issues",...},"id":2}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":2,"result":{"content":[...]}}
```

Usa esto para diagnosticar:
- Fallos de autenticación (el servidor devuelve un error en `tools/list`)
- Desajustes de esquema (llamada de herramienta rechazada debido a forma de entrada incorrecta)
- Salida de herramienta inesperada (ve exactamente qué vino antes de que Claude lo procesara)

### Errores de conexión comunes

**`ECONNREFUSED` / `Connection refused`:**
El servidor no se está ejecutando o la URL es incorrecta. Verifica la URL con curl:
```bash
curl -I https://your-mcp-server.com/sse
```

**`401 Unauthorized`:**
Falta el encabezado de autenticación o el token no es válido. Verifica que la variable de entorno esté configurada:
```bash
echo $YOUR_MCP_TOKEN
```

**`Connection timeout`:**
El servidor es alcanzable pero lento para responder. Aumenta `connectionTimeout` en configuración:
```json
{
  "mcpServers": {
    "slow-server": {
      "url": "https://...",
      "connectionTimeout": 20000
    }
  }
}
```

**`tools/list returned 0 tools`:**
El servidor se conectó pero no hay herramientas registradas. Generalmente indica que el servidor se inició pero falló al inicializar su registro de herramientas — verifica los registros del servidor.

**`Tool call timeout`:**
La herramienta se ejecutó pero no devolvió dentro de la ventana de tiempo de espera. Aumenta `timeout` (el predeterminado es 30000 ms):
```json
{
  "mcpServers": {
    "slow-db": {
      "url": "https://...",
      "timeout": 120000
    }
  }
}
```

### Pruebas sin Claude Code

Usa `curl` o `npx @modelcontextprotocol/inspector` para verificar un servidor MCP remoto de forma independiente:

```bash
# Probar conexión SSE
curl -N -H "Authorization: Bearer $TOKEN" https://mcp.example.com/sse

# MCP Inspector — interfaz gráfica interactiva para probar servidores MCP
npx @modelcontextprotocol/inspector https://mcp.example.com/sse
```

El Inspector te permite examinar herramientas, invocarlas con argumentos personalizados y ver mensajes de protocolo sin procesar — esencial para depuración de un servidor que estás construyendo.

---

## MCPs Multi-Inquilino: Tokens Por Usuario e Aislamiento

Cuando aloja un MCP para un equipo, cada usuario debe estar aislado de los datos de otros. Dos patrones:

### Aislamiento de token por usuario (recomendado)

Cada desarrollador genera su propio token del servicio ascendente (p. ej., su propio token de autenticación de Sentry). El servidor MCP usa ese token para hacer llamadas ascendentes en su nombre — el acceso es lo que permiten los propios permisos del usuario.

**Configuración:** cada desarrollador agrega el MCP a su `~/.claude/settings.json` de nivel de usuario con su propio token. El `.claude/settings.json` de nivel de proyecto define la URL del MCP sin un token.

Configuración de proyecto (compartida, en repo):
```json
{
  "mcpServers": {
    "internal-api": {
      "transport": "http",
      "url": "https://mcp.company.com/mcp"
    }
  }
}
```

Configuración de usuario (local, no en repo):
```json
{
  "mcpServers": {
    "internal-api": {
      "headers": {
        "Authorization": "Bearer ${MY_PERSONAL_API_TOKEN}"
      }
    }
  }
}
```

Claude Code fusiona estas — la URL viene de la configuración de proyecto, el encabezado de autenticación viene de la configuración de usuario.

### Aislamiento de sesión del lado del servidor

Para MCPs que gestionar estado compartido, el servidor debe aislar datos por usuario autenticado. El patrón:

1. El cliente envía un token de identificación de usuario (clave API o JWT) en el encabezado `Authorization`
2. El servidor valida el token y extrae un ID de usuario o ID de inquilino
3. Todas las operaciones de herramientas están limitadas a los datos de ese inquilino
4. El registro de auditoría del lado del servidor registra `(user_id, tool_name, timestamp, args_hash)` para cada llamada

```typescript
// Pseudocódigo — aislamiento del lado del servidor
async function handleToolCall(request: Request, toolName: string, args: unknown) {
  const userId = await authenticateRequest(request)  // lanza en autenticación inválida
  const userDb = getDbForTenant(userId)              // conexión/esquema aislado
  return await tools[toolName](userDb, args)
}
```

Nunca dejes que un cliente pase su propio ID de inquilino como argumento de herramienta — derívalo del lado del servidor desde el token de autenticación. Un cliente pasando `tenant_id: "other-company"` debe resultar en un 403, no en exposición de datos.

---

## Patrón MCP Proxy

Un único MCP remoto que agrega múltiples herramientas ascendentes. Útil para:
- Reducir el número de conexiones MCP que Claude Code gestiona
- Centralizar la gestión de autenticación para un equipo
- Agregar una capa de registro/auditoría entre todas las llamadas de herramientas
- Límite de velocidad o almacenamiento en caché de llamadas a API ascendentes

**Arquitectura:**
```
Claude Code
    |
    v
[MCP Proxy Server]  <-- una conexión, un token de autenticación desde la perspectiva de Claude
    |        |        |
    v        v        v
 Sentry   GitHub    API Interno
 (token)  (token)   (token)
```

El proxy contiene credenciales ascendentes del lado del servidor. Claude Code solo necesita credenciales para el proxy en sí. El proxy traduce llamadas de herramientas y las enruta al servicio ascendente apropiado.

**Cuándo construir un proxy:**
- El equipo tiene 8+ servicios MCP y el tiempo de inicio es notablemente lento
- Necesitas agregar middleware de autenticación (actualización de token, límite de velocidad) que los proveedores no proporcionan
- Quieres un único registro de auditoría para toda la actividad MCP en tu equipo
- Algunos servicios ascendentes no tienen servidores MCP oficiales y estás envolviendo sus APIs REST

**Cuándo no construir un proxy:**
- Tienes 2–4 servicios — el sobrecargo no vale la complejidad
- Necesitas actualizaciones activas de esquemas de herramientas — un proxy agrega una capa de almacenamiento en caché que puede quedar obsoleta
- Quieres aislamiento por usuario — un proxy hace que la gestión de tokens a nivel de usuario sea más difícil

---

## Desempeño: MCP en Producción a Escala

### Agrupamiento de conexiones

Los servidores MCP remotos deben mantener conexiones persistentes en lugar de establecer un nuevo apretón de manos TCP+TLS por llamada de herramienta. Para transporte SSE, la conexión es inherentemente persistente. Para streamable-HTTP, el agrupamiento de conexiones del lado del servidor a servicios ascendentes es responsabilidad de la implementación del servidor.

En el lado del servidor:
```typescript
// Reutilizar conexiones de base de datos entre solicitudes
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Usar pool en todos los manejadores de llamadas de herramientas
```

### Keep-Alive para SSE

Las conexiones SSE pueden ser silenciosamente descartadas por proxies intermedios que cierren conexiones inactivas. Envía un latido periódico comentario para mantener la conexión activa:

```typescript
// El servidor envía un comentario cada 30 segundos para evitar tiempo de espera del proxy
const keepAlive = setInterval(() => {
  res.write(': keepalive\n\n')
}, 30000)

req.on('close', () => clearInterval(keepAlive))
```

Claude Code maneja la reconexión automáticamente, pero un latido previene el sobrecargo de reconexión innecesaria.

### Reintento con Backoff Exponencial

Claude Code reintenta llamadas MCP de herramientas fallidas, pero los reintentos del lado del servidor para dependencias ascendentes son tu responsabilidad. Implementa backoff para cualquier llamada de red que el MCP haga:

```typescript
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 200
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxAttempts) throw err
      const delay = baseDelayMs * Math.pow(2, attempt - 1)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('unreachable')
}
```

Aplica backoff a: llamadas a API ascendentes, consultas de base de datos (para errores de conexión transitorios) y operaciones de almacenamiento de objetos.

### Almacenamiento en Caché de Respuestas

Los resultados de herramientas que son costosos de computar y no cambian con frecuencia deben almacenarse en caché del lado del servidor. Esto es especialmente valioso para herramientas de introspección de esquema — un esquema de base de datos no cambia entre llamadas de herramientas.

```typescript
const cache = new Map<string, { value: unknown; expiresAt: number }>()

function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.value as T)

  return fn().then(value => {
    cache.set(key, { value, expiresAt: Date.now() + ttlMs })
    return value
  })
}

// Uso: almacenar esquema en caché por 5 minutos
const schema = await cached('db-schema', 5 * 60 * 1000, () => db.introspectSchema())
```

---

## Fragmentos Completos de settings.json

### 1 — Supabase + Sentry + Neon (solo remoto, nivel de usuario)

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    },
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    },
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

### 2 — MCP de equipo interno con mTLS y encabezados personalizados

```json
{
  "mcpServers": {
    "internal": {
      "transport": "http",
      "url": "https://mcp.corp.example.com/mcp",
      "headers": {
        "X-Api-Key": "${CORP_MCP_API_KEY}",
        "X-Team": "platform",
        "X-Environment": "production"
      },
      "timeout": 60000,
      "connectionTimeout": 15000
    }
  }
}
```

### 3 — GitHub + Cloudflare + Vercel (patrón de clave API)

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "cloudflare": {
      "transport": "http",
      "url": "https://mcp.cloudflare.com/mcp",
      "headers": {
        "X-Auth-Key": "${CLOUDFLARE_API_KEY}",
        "X-Auth-Email": "${CLOUDFLARE_EMAIL}"
      }
    },
    "vercel": {
      "transport": "sse",
      "url": "https://mcp.vercel.com/sse",
      "headers": {
        "Authorization": "Bearer ${VERCEL_TOKEN}"
      }
    }
  }
}
```

### 4 — Mixto local + remoto (nivel de proyecto, tokens desde entorno)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${CLAUDE_PROJECT_DIR}"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "${CLAUDE_PROJECT_DIR}"]
    },
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    },
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

### 5 — MCP proxy auto-alojado con descubrimiento diferido habilitado

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY": "1"
  },
  "mcpServers": {
    "proxy": {
      "transport": "http",
      "url": "https://mcp-proxy.your-company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${MCP_PROXY_TOKEN}",
        "X-User-Email": "${USER_EMAIL}"
      },
      "timeout": 90000,
      "connectionTimeout": 20000
    }
  }
}
```

El proxy agrega todas las herramientas ascendentes — Claude Code ve un servidor con muchas herramientas. El descubrimiento diferido es especialmente valioso aquí porque el proxy puede exponer 50+ herramientas y usas solo un puñado por sesión.

---

## Trabaja Con Nosotros
