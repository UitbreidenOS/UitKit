# MCP: Vercel

Gestiona despliegues de Vercel, proyectos, dominios y variables de entorno desde dentro de Claude Code — sin abrir el panel ni copiar-pegar registros de despliegue.

## Por qué lo necesitas

La depuración de despliegue normalmente significa: abre el panel de Vercel, encuentra el despliegue fallido, desplázate a través de registros de construcción, copia el error, pega en tu editor. El MCP de Vercel colapsa esto en una sola solicitud. Claude extrae los registros, lee el error, lo rastrea hasta el archivo fuente y sugiere la corrección — todo en contexto.

## Instalación

```bash
npm install -g @vercel/mcp-server
```

## Configuración

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": {
        "VERCEL_TOKEN": "YOUR_VERCEL_TOKEN",
        "VERCEL_TEAM_ID": "YOUR_TEAM_ID"
      }
    }
  }
}
```

`VERCEL_TEAM_ID` se requiere solo para despliegues de equipo u organización. Los proyectos personales funcionan con el token solo.

## Herramientas clave

| Herramienta | Qué hace |
|---|---|
| `list_deployments` | Lista despliegues recientes para un proyecto con estado |
| `get_deployment` | Detalle completo de despliegue incluyendo metadatos de construcción |
| `create_deployment` | Desencadena un nuevo despliegue desde una rama o commit |
| `list_projects` | Lista todos los proyectos en la cuenta o equipo |
| `get_project` | Configuración de proyecto y configuración de framework |
| `list_domains` | Todos los dominios personalizados conectados a un proyecto |
| `add_domain` | Conecta un nuevo dominio personalizado |
| `list_env_vars` | Lista variables de entorno (valores enmascarados por defecto) |
| `upsert_env_var` | Agrega o actualiza una variable de entorno (insertar o sobrescribir) |
| `delete_env_var` | Elimina una variable de entorno |
| `get_deployment_logs` | Fluye registros de construcción y tiempo de ejecución para un despliegue |
| `rollback_deployment` | Revierte instantáneamente al despliegue anterior de producción |

## Ejemplos de uso

```
Muéstrame los últimos 5 despliegues para my-app y su estado

¿Qué errores aparecieron en el último despliegue fallido del servicio de checkout?

Agrega la variable de entorno STRIPE_SECRET_KEY a producción — el valor es sk_live_xxx

Revierte producción al despliegue anterior inmediatamente

Lista todos los dominios personalizados conectados al proyecto storefront

¿Por qué falló la construcción hace 20 minutos? Muéstrame los registros completos.
```

## Autenticación

1. Ve a [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Haz clic en **Crear Token** — nómbralo algo identificable (p. ej., `claude-mcp`)
3. Establece el alcance a **Full Account** para proyectos personales, o selecciona un equipo específico
4. Copia el token — se muestra una sola vez
5. Para despliegues de equipo: encuentra tu Team ID bajo **Team Settings → General**

## Consejos

- `get_deployment_logs` es la razón principal para instalar este MCP — canalizar registros en vivo al contexto de Claude es más rápido que cualquier flujo de trabajo de depuración manual.
- `rollback_deployment` no re-ejecuta la construcción — promociona el despliegue inmutable anterior a producción instantáneamente. Cero tiempo de inactividad.
- Combina con GitHub MCP para construir un bucle completo: PR se fusiona → despliegue se desencadena → registros confirman éxito → listo.
- Las variables de entorno agregadas a través de `upsert_env_var` toman efecto en el próximo despliegue — no se recargan en caliente.
- Usa `list_env_vars` para auditar qué env vars existen antes de hacer upsert; `upsert_env_var` silenciosamente sobrescribe valores existentes.
- Los despliegues de vista previa (de PRs) y los despliegues de producción son separados — especifica el entorno objetivo cuando ejecutes operaciones de env var.

---
