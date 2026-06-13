# MCP: Shopify AI Toolkit

Gestiona una tienda Shopify desde Claude Code — consulta productos, pedidos, clientes, análisis y metacampos sin abrir el panel.

## Por qué lo necesitas

Las operaciones de la tienda que normalmente requieren la interfaz de administrador de Shopify o scripts personalizados — actualizaciones de productos en lote, consultas de pedidos, extracciones de análisis, gestión de colecciones — se convierten en solicitudes conversacionales únicas. Claude puede leer datos reales de la tienda, actuar sobre ellos y encadenar operaciones: encontrar productos con inventario bajo → actualizar descripciones → agregar a una colección de venta, todo en una sesión.

## Instalación

```bash
npx -y @shopify/ai-toolkit-mcp
```

El paquete se ejecuta bajo demanda a través de `npx` — no se requiere instalación global.

## Configuración

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/ai-toolkit-mcp"],
      "env": {
        "SHOPIFY_STORE_URL": "your-store.myshopify.com",
        "SHOPIFY_ADMIN_TOKEN": "shpat_..."
      }
    }
  }
}
```

`SHOPIFY_STORE_URL` debe ser tu subdominio `.myshopify.com` — no un dominio personalizado. `SHOPIFY_ADMIN_TOKEN` es tu token de acceso de API de administrador de aplicación personalizada (ver Autenticación).

## Herramientas clave

| Herramienta | Qué hace |
|---|---|
| `list_products` | Consulta productos con filtros (estado, inventario, etiquetas, proveedor) |
| `get_product` | Detalle completo del producto incluyendo variantes, metacampos e imágenes |
| `create_product` | Crear un nuevo producto con variantes y precios |
| `update_product` | Actualizar título, descripción, precio, etiquetas o estado |
| `list_orders` | Consulta pedidos con filtros (rango de fechas, valor, estado de cumplimiento) |
| `get_order` | Detalle completo del pedido incluyendo elementos de línea, cliente y cumplimiento |
| `list_customers` | Consulta clientes por historial de compras, etiquetas o ubicación |
| `get_customer` | Perfil de cliente incluyendo historial de pedidos y valor de vida útil |
| `get_analytics` | Datos de ingresos, sesión y conversión por rango de fechas y desglose |
| `list_collections` | Listar todas las colecciones inteligentes y personalizadas |
| `add_to_collection` | Agregar uno o más productos a una colección |
| `list_metafields` | Listar metacampos en un producto, variante o cliente |
| `update_metafield` | Escribir un valor de metacampo |

## Ejemplos de uso

```
Lista todos los productos con inventario por debajo de 5 unidades

Muéstrame pedidos de los últimos 7 días sobre $200

Actualiza la descripción del SKU SHIRT-BLK-L

Agrega todos los productos etiquetados como 'summer-sale' a la Summer Collection

¿Cuáles fueron los ingresos por tipo de producto el mes pasado?

Encuentra clientes que compraron el Producto X pero no el Producto Y

Lista todos los códigos de descuento activos y sus conteos de uso
```

## Autenticación

1. En tu panel de administrador de Shopify ve a **Settings → Apps → Develop apps**
2. Haz clic en **Create an app** y dale un nombre (p. ej., `claude-mcp`)
3. Bajo **Configuration → Admin API integration**, habilita estos alcances de acceso:
   - `read_products`, `write_products`
   - `read_orders`
   - `read_customers`
   - `read_analytics`
4. Haz clic en **Install app** — Shopify genera el token de acceso de API de administrador
5. Copia el token (se muestra una sola vez) y úsalo como `SHOPIFY_ADMIN_TOKEN`

Para análisis y reportes de solo lectura, omite `write_products` de la lista de alcances.

## Consejos

- La URL de la tienda debe ser el dominio `.myshopify.com` — los dominios personalizados no se aceptan en el env var.
- Límite de tasa del plan estándar: 2 solicitudes/segundo. Shopify Plus: 4 solicitudes/segundo. Las operaciones en lote se manejan automáticamente por el toolkit.
- Los metacampos son la característica más subutilizada a través de MCP — Claude puede leer y escribir atributos personalizados en cualquier recurso, permitiendo gestión de datos tipo CMS sin un CMS headless.
- `get_analytics` devuelve datos en la misma estructura que la API de análisis de Shopify — especifica `date_preset` (`today`, `last_7_days`, `last_30_days`) o un rango de fechas explícito.
- Para catálogos de productos grandes, filtra `list_products` por `status=active` y `vendor` para mantener conjuntos de resultados manejables antes de encadenar operaciones.

---
