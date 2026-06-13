# MCP: Auth0

Conecta Claude Code a Auth0 para gestión de identidad y acceso — consulta usuarios, gestiona roles, inspecciona registros de inicio de sesión, y toma acciones de remediación sin salir de tu terminal.

## Por qué lo necesitas

Los problemas de acceso de usuarios — cuentas bloqueadas, patrones de inicio de sesión sospechosos, desajustes de roles — requieren cambio constante de contexto entre tu código y el Panel de Gestión de Auth0. El MCP de Auth0 trae esos datos a Claude, para que puedas investigar un incidente, bloquear una cuenta comprometida o auditar asignaciones de roles en una conversación.

## Requisitos previos

- Cuenta de Auth0 (cualquier plan; el acceso a API de Gestión está disponible en todos los planes incluyendo gratuito)
- Una **aplicación de Máquina-a-Máquina (M2M)** registrada en tu inquilino de Auth0, autorizada para llamar a la API de Gestión de Auth0
- Los **ID de Cliente** y **Secreto de Cliente** de la aplicación M2M
- Tu **dominio** de Auth0 (p. ej., `your-tenant.us.auth0.com`)

## Instalación

Instala el servidor MCP oficial de Auth0 a través de npx — no se requiere instalación global.

```bash
npx @auth0/auth0-mcp-server --version
```

## Configuración

Agrega lo siguiente a tu `~/.claude/settings.json` (nivel de usuario) o `.claude/settings.json` (nivel de proyecto):

```json
{
  "mcpServers": {
    "auth0": {
      "command": "npx",
      "args": ["-y", "@auth0/auth0-mcp-server"],
      "env": {
        "AUTH0_DOMAIN": "your-tenant.us.auth0.com",
        "AUTH0_CLIENT_ID": "YOUR_M2M_CLIENT_ID",
        "AUTH0_CLIENT_SECRET": "YOUR_M2M_CLIENT_SECRET"
      }
    }
  }
}
```

Reemplaza `your-tenant.us.auth0.com` con tu dominio actual de Auth0 — visible en el Panel de Auth0 bajo **Aplicaciones → tu aplicación M2M → Dominio**.

## Herramientas clave

| Herramienta | Descripción | Parámetros clave |
|---|---|---|
| `list_users` | Busca y enumera usuarios en el inquilino | `q` (consulta Lucene), `per_page`, `page`, `sort` |
| `get_user` | Obtén perfil completo para un único usuario | `id` (ID de usuario de Auth0, p. ej., `auth0|abc123`) |
| `create_user` | Crea un nuevo usuario en una conexión de base de datos | `email`, `password`, `connection`, `name` |
| `assign_roles` | Asigna uno o más roles a un usuario | `id`, `roles` (matriz de IDs de rol) |
| `list_applications` | Enumera todas las aplicaciones registradas en el inquilino | `per_page`, `page` |
| `get_logs` | Recupera eventos de registro de inquilino con soporte de filtro | `q` (tipo de evento, usuario, IP), `per_page`, `from`, `take` |
| `block_user` | Bloquea una cuenta de usuario (previene inicio de sesión) | `id` |

## Ejemplos de uso

```
Enumera todos los usuarios que se registraron en los últimos 7 días

Bloquea la cuenta para user email@example.com inmediatamente

Muestra todos los intentos de inicio de sesión fallidos de las últimas 24 horas

Asigna el rol "admin" al usuario auth0|64a1f2b3c4d5e6f7a8b9c0d1

Enumera todas las aplicaciones registradas en este inquilino de Auth0
```

## Autenticación — creando la aplicación M2M

1. Inicia sesión en el Panel de Auth0 y ve a **Aplicaciones → Crear Aplicación**
2. Elige **Aplicaciones de Máquina a Máquina** y ponle nombre (p. ej., `claude-code-mcp`)
3. En la siguiente pantalla, selecciona **API de Gestión de Auth0** como la API autorizada
4. Otorga los alcances que tu caso de uso requiere (ver Alcances a continuación) y haz clic en **Autorizar**
5. Ve a la pestaña **Configuración** de tu nueva aplicación M2M y copia el **Dominio**, **ID de Cliente** y **Secreto de Cliente**
6. Pega los tres en el bloque `env` en settings.json

**Alcances requeridos mínimos por operación:**

| Operación | Alcance requerido |
|---|---|
| Leer usuarios | `read:users` |
| Crear usuarios | `create:users` |
| Bloquear/desbloquear usuarios | `update:users` |
| Asignar roles | `update:users`, `read:roles` |
| Leer registros | `read:logs` |
| Listar aplicaciones | `read:clients` |

Otorga solo los alcances que necesites. Evita `read:client_keys` — expone secretos de cliente para todas las aplicaciones.

## Consejos

- Los IDs de usuario de Auth0 siguen el formato `provider|id` — para conexiones de base de datos es `auth0|hex_id`. Usa `list_users` con `q:email:user@example.com` para encontrar el ID antes de ejecutar operaciones de usuario único.
- `get_logs` soporta códigos de tipo de evento de Auth0 en la consulta: `q=type:f` devuelve todos los inicios de sesión fallidos; `q=type:s` devuelve éxitos. La referencia completa de tipo de evento está en los documentos de Auth0 bajo Códigos de Tipo de Evento de Registro.
- `block_user` es reversible — usa `update_user` con `blocked: false` (o la herramienta MCP equivalente si se expone) para desbloquear. El bloqueo no invalida sesiones existentes — emparejar con una llamada para revocar sesiones activas si requieren bloqueo inmediato.
- La API de Gestión tiene límite de velocidad de 2 solicitudes/segundo por inquilino en planes gratuitos, y límites superiores en planes pagados. Evita bucles de llamadas `get_user` en secuencias ajustadas.
- Los tokens M2M emitidos por Auth0 expiran después de 24 horas por defecto. El servidor MCP maneja la actualización de token automáticamente — no se requiere rotación manual.
- Para arquitecturas multi-inquilino (un inquilino de Auth0 por cliente), necesitarás una configuración MCP separada por inquilino. Considera usar settings.json a nivel de proyecto limitado a cada proyecto.

## Notas de costo

Las llamadas a API de Gestión de Auth0 se incluyen en todos los planes de Auth0 — no hay tarifas por llamada. Sin embargo, los planes gratuitos están limitados a 1,000 usuarios activos e imponen límites de velocidad de API de Gestión. Los inquilinos de producción en planes pagados tienen límites de velocidad más altos y capacidad de usuario. Verifica tu cuota de API de Gestión bajo **Configuración → Configuración de Inquilino** en el Panel de Auth0.

---
