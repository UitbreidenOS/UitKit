# MCP: Cloudflare

Gestiona el stack completo de Cloudflare — Workers, R2, D1, KV, DNS, Pages, AI y Zero Trust — desde Claude Code a través de una familia de 16 módulos MCP especializados.

## Por qué lo necesitas

El panel de Cloudflare cubre docenas de áreas de productos en múltiples capas de navegación. El ecosistema MCP de Cloudflare colapsa eso en llamadas de herramientas directas: despliega un Worker, actualiza un registro DNS, ejecuta una consulta D1 SQL, o invoca un modelo de Workers AI — todo desde una sola sesión de Claude Code. Cada módulo es independiente, así que solo habilitas lo que tu proyecto usa.

## Instalación

```bash
npx -y @cloudflare/mcp-server-cloudflare <module>
```

Reemplaza `<module>` con el nombre de servicio específico (p. ej., `workers`, `dns`, `d1`). Cada módulo se ejecuta como una entrada de servidor MCP separada.

## Configuración

Cada módulo se registra como un servidor separado para que puedas habilitarlos y deshabilitarlos individualmente:

```json
{
  "mcpServers": {
    "cloudflare-workers": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "workers"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    },
    "cloudflare-dns": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "dns"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    },
    "cloudflare-d1": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "d1"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

Agrega o elimina módulos de tu configuración independientemente.

## Herramientas clave

### workers
Despliega, actualiza y elimina scripts de Workers. Ver registros y monitorea salida en tiempo real.

### r2
Crea y elimina buckets. Carga, descarga e lista objetos en almacenamiento R2.

### d1
Crea bases de datos D1. Ejecuta consultas SQL. Ejecuta migraciones de esquema.

### kv
Lee, escribe y elimina entradas en espacios de nombres KV. Lista claves con filtros de prefijo.

### pages
Lista y crea despliegues de Pages. Gestiona dominios personalizados en proyectos de Pages.

### dns
Agrega, actualiza y elimina registros DNS (A, AAAA, CNAME, MX, TXT, SRV).

### ai
Ejecuta modelos de Workers AI: generación de texto, generación de imágenes, conversión de voz a texto e incrustaciones.

### analytics
Consulta datos de eventos de Web Analytics. Accede a configuración de análisis de Zaraz.

### zero-trust
Gestiona políticas de acceso Zero Trust, túneles y reglas de postura de dispositivos.

## Ejemplos de uso

```
Despliega mi script de worker actualizado a la zona de producción example.com

Agrega un registro CNAME para api.example.com apuntando a my-load-balancer.com

Consulta las últimas 100 filas de mi base de datos D1 de análisis

Ejecuta generación de texto Workers AI llama-3 con este aviso

Muestra analíticas web de los últimos 7 días desglosadas por país

Carga este archivo JSON al bucket R2 my-app-assets

Escribe una entrada KV: clave=feature_flags valor={"dark_mode":true}

Lista todas las políticas de acceso Zero Trust activas para el subdominio admin
```

## Autenticación

1. Ve a [cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Haz clic en **Crear Token** — usa **Crear Token Personalizado**
3. Establece permisos basados en los módulos que estés habilitando:
   - Módulo DNS: `Zone → DNS → Edit`
   - Módulo Workers: `Account → Workers Scripts → Edit`
   - Módulo R2: `Account → R2 Storage → Edit`
   - Módulo D1: `Account → D1 → Edit`
   - Módulo Zero Trust: `Account → Access: Organizations, Identity Providers, and Groups → Edit`
4. Encuentra tu Account ID en la barra lateral del panel de Cloudflare (lado derecho de cualquier página de descripción general de zona)
5. Establece tanto `CLOUDFLARE_API_TOKEN` como `CLOUDFLARE_ACCOUNT_ID` en el bloque env para cada módulo

Un solo token puede tener múltiples conjuntos de permisos — no necesitas un token por módulo.

## Consejos

- Registra cada módulo como un servidor MCP nombrado separado (`cloudflare-workers`, `cloudflare-dns`, etc.) para que puedas comentar módulos no utilizados sin tocar los otros.
- Workers AI (módulo `ai`) proporciona acceso a modelos alojados de Cloudflare — Llama 3, Mistral, Whisper, SDXL — sin costo de clave de API adicional más allá de tu cuenta de Cloudflare.
- El módulo Zero Trust requiere permiso de `Access: Organizations, Identity Providers, and Groups` en tu token — esto es separado de los permisos estándar de zona/cuenta.
- D1 `execute_sql` soporta lectura y escritura — úsalo directamente para consultas únicas o intégralo en flujos de migración junto con Neon MCP para proyectos multi-base de datos.
- Las operaciones `kv` son eventualmente consistentes en el edge de Cloudflare — las lecturas pueden tener un retraso de hasta 60 segundos en regiones distantes.
- El módulo `dns` es la forma más rápida de gestionar cambios de DNS programáticamente — los cambios se propagan en segundos en zonas gestionadas por Cloudflare.

---
