# MCP: Supabase

Proporcione a Claude Code acceso directo a su proyecto de Supabase — consulte tablas Postgres, inspeccione políticas RLS, administre usuarios de autenticación, invoque Edge Functions y trabaje con Storage — todo sin pegar esquemas o URL de API en cada sesión.

## Por qué necesita esto

Sin MCP, trabajar con Supabase significa copiar definiciones de tablas, buscar URL de API y restablecer el contexto en cada sesión. Con el Supabase MCP:
- Claude consulta su base de datos Postgres directamente — sin copiar-pegar esquema
- Las estructuras de tabla, tipos de columna y claves foráneas se introspeccionen en tiempo real
- Las políticas RLS son legibles y auditables dentro de la misma sesión que su código
- Los usuarios de autenticación y los registros de autenticación se pueden consultar para depuración y cumplimiento
- Las Edge Functions se pueden listar, inspeccionar e invocar con una carga útil
- Los depósitos de Storage son accesibles para operaciones de lectura y escritura
- El ramificación de base de datos permite iteración de esquema segura sin tocar la producción

## Instalación

No se requiere npm install para la variante remota. La variante `npx` local extrae el paquete en la primera ejecución.

## Configuración

**Local (npx — recomendado para la mayoría de configuraciones):**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://YOUR_PROJECT_REF.supabase.co",
        "--supabase-service-role-key", "YOUR_SERVICE_ROLE_KEY"
      ]
    }
  }
}
```

Reemplace `YOUR_PROJECT_REF` con su referencia de proyecto (el subdominio en su URL de Supabase) y `YOUR_SERVICE_ROLE_KEY` con la clave de rol de servicio del panel.

**Remoto (transporte SSE — sin dependencia local):**

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SUPABASE_ACCESS_TOKEN"
      }
    }
  }
}
```

La variante remota utiliza un token de acceso personal de Supabase en lugar de una clave de rol de servicio. Genere uno en **Account Settings → Access Tokens**.

Agregue cualquiera de los dos bloques a `~/.claude.json` (global) o `.claude/mcp.json` (por proyecto).

## Encontrar sus credenciales

- **URL del proyecto y clave de rol de servicio:** Panel de Supabase → su proyecto → **Settings → API**
- La clave de rol de servicio tiene la etiqueta `service_role` en **Project API keys**
- La clave `anon` no es suficiente — respeta RLS y bloqueará muchas operaciones de herramientas
- Para la variante SSE remota: **supabase.com → Account → Access Tokens → Generate new token**

## Herramientas clave

| Herramienta | Qué hace |
|---|---|
| `query_table` | Ejecutar un SELECT de SQL contra cualquier tabla en cualquier esquema |
| `list_tables` | Enumere tablas con columnas, tipos, nulabilidad y claves foráneas |
| `get_rls_policies` | Mostrar todas las políticas de Row-Level Security para una tabla |
| `list_functions` | Enumere todas las Edge Functions con estado de implementación |
| `invoke_function` | Llame a una Edge Function con una carga útil JSON |
| `list_buckets` | Mostrar depósitos de Storage y sus configuraciones de acceso |
| `upload_file` | Cargar un archivo en un depósito de Storage |
| `list_auth_users` | Consultar auth.users — correo electrónico, proveedor, estado de confirmación, metadatos |
| `get_auth_logs` | Recuperar eventos de autenticación para auditoría o depuración |

## Ejemplos de uso

```
Show me all tables in the public schema with their column types and RLS policies
```

```
Find all users who signed up in the last 7 days but never confirmed their email
```

```
Generate a TypeScript type definition for the profiles table based on the actual schema
```

```
Write a migration to add a soft-delete column (deleted_at timestamptz) to the posts table
```

```
Check every table in the public schema — flag any that have no RLS policies enabled
```

```
Show all Edge Functions, their last deployed version, and invocation counts for this week
```

```
List all auth.users where the provider is 'email' and email_confirmed_at is null
```

```
Upload the file at ./exports/report.pdf to the reports Storage bucket
```

## Ramificación de base de datos

La ramificación de Supabase crea una copia aislada de su base de datos para trabajo de desarrollo y vista previa. Cada rama obtiene su propia URL y clave de rol de servicio, por lo que las migraciones se pueden probar sin riesgo para la producción.

Cree una rama a través de la CLI de Supabase:

```bash
supabase branches create dev
```

Apunte MCP a la URL de rama para iteración de esquema segura:

```json
{
  "mcpServers": {
    "supabase-dev": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://YOUR_BRANCH_REF.supabase.co",
        "--supabase-service-role-key", "YOUR_BRANCH_SERVICE_ROLE_KEY"
      ]
    }
  }
}
```

Ejecute múltiples entradas MCP con nombre — una para producción, una para la rama — e intercambie referenciando el nombre del servidor en sus prompts. Claude puede aplicar una migración a la rama, validar el esquema y confirmar la corrección antes de promover a main.

## Combinado con GitHub MCP

Supabase MCP y GitHub MCP juntos permiten que Claude cierre el ciclo en migraciones de esquema:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://YOUR_PROJECT_REF.supabase.co",
        "--supabase-service-role-key", "YOUR_SERVICE_ROLE_KEY"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT"
      }
    }
  }
}
```

Con ambos servidores activos, Claude puede leer un PR, extraer todo el SQL del directorio migrations/, compararlo con el esquema actual usando `list_tables` e indicar cualquier conflicto antes de que el PR se fusione.

Ejemplo de prompt:

```
Read PR #47, extract all SQL from the migrations/ directory, compare it against
the current public schema, and flag any column renames or drops that could
break existing queries.
```

## Seguridad

La clave de rol de servicio omite Row-Level Security por completo. Trátela como una credencial raíz.

- Para desarrollo en solitario en un proyecto local o dev: la clave de rol de servicio en la configuración de MCP es aceptable.
- Para entornos de equipo compartido: cree un rol de Postgres de solo lectura con una cadena de conexión directa en lugar de usar la clave de rol de servicio. Otorgue solo los esquemas que Claude necesita leer.
- Nunca confirme su clave de rol de servicio en git. Agréguela a `.gitignore` si usa un archivo `.env` y nunca la inserte en un proyecto `.claude/mcp.json` que está marcado como verificado.
- Rote la clave de rol de servicio inmediatamente si alguna vez se expone en un repositorio público.

---

> **Trabaje con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
