# Espacio de Trabajo del Operador de Comercio Electrónico — Estructura del Proyecto

> Para operadores de marcas DTC que ejecutan un escaparate Shopify y necesitan que Claude maneje la optimización diaria de listados, redacción de campañas, plantillas de servicio al cliente, comunicación con proveedores e informes de rendimiento en toda la pila de tecnología.

## Stack

- Shopify (escaparate, inventario, pedidos, metafields)
- Klaviyo (flujos de correo electrónico y SMS, segmentos, campañas)
- Meta Ads Manager + Google Ads (adquisición pagada)
- Triple Whale o Northbeam (atribución multi-toque, MER, nCAC)
- Gorgias (tickets de soporte, macros, CSAT)
- ShipBob o Flexport (cumplimiento 3PL, seguimiento, devoluciones)
- QuickBooks Online (P&L, COGS, reconciliación)
- Slack (comunicaciones de equipo, enrutamiento de alertas)

---

## Árbol de directorios

```
ecommerce-workspace/
├── .claude/
│   ├── settings.json                    # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── listing-optimizer.md         # Reescribe título del producto + descripción + metadatos SEO
│       ├── email-campaign.md            # Redacta copia de campaña Klaviyo con variantes de asunto
│       ├── ad-copy.md                   # Genera conjuntos de copia publicitaria para Meta y Google
│       ├── returns-policy.md            # Redacta o actualiza idioma de política de devoluciones
│       ├── supplier-update.md           # Genera seguimiento de PO de proveedor o correo de reorden
│       ├── weekly-performance.md        # Resume ROAS de canal, CAC y SKUs principales
│       └── inventory-alert.md           # Marca SKUs por debajo del umbral de reorden
├── CLAUDE.md                            # Instrucciones del espacio de trabajo (ver plantilla a continuación)
├── products/
│   ├── active/
│   │   ├── sku-overview.csv             # Lista maestra de SKU con handle, título, precio, costo, estado
│   │   ├── descriptions/
│   │   │   ├── product-copy-template.md # Voz de marca + estructura para todos los PDP
│   │   │   ├── seasonal-refresh-log.md  # Qué se actualizó y cuándo, por SKU
│   │   │   └── [slug].md                # Un archivo por producto (p. ej., cotton-tote-natural.md)
│   │   └── seo/
│   │       ├── meta-titles.csv          # Etiqueta de título actual y variantes propuestas por producto
│   │       ├── meta-descriptions.csv    # Metadescripciones de 155 caracteres por producto
│   │       └── keyword-targets.md       # Mapa de palabras clave primarias y secundarias por colección
│   ├── drafts/
│   │   └── new-product-brief-template.md # Lista de verificación previa al lanzamiento para nuevos SKU
│   └── archived/
│       └── discontinued-skus.csv        # Productos descontinuados con razón de discontinuación
├── campaigns/
│   ├── email/
│   │   ├── briefs/
│   │   │   ├── campaign-brief-template.md   # Audiencia, objetivo, oferta, CTA, fecha de envío
│   │   │   ├── 2026-q2-mothers-day.md
│   │   │   └── 2026-q3-back-to-school.md
│   │   ├── copy/
│   │   │   ├── welcome-series.md            # Copia de flujo de incorporación de 3 correos
│   │   │   ├── abandoned-cart.md            # Secuencia de carrito abandonado de 2 toques
│   │   │   ├── post-purchase.md             # Flujo de solicitud de revisión + venta cruzada
│   │   │   └── win-back-90d.md              # Flujo de recuperación para compradores inactivos de 90 días
│   │   └── results/
│   │       └── klaviyo-campaign-log.csv     # Nombre de campaña, fecha de envío, OR, CTR, ingresos
│   └── paid-ads/
│       ├── briefs/
│       │   ├── ad-brief-template.md         # Oferta, audiencia, gancho, CTA, presupuesto, plataforma
│       │   ├── 2026-q2-prospecting-meta.md
│       │   └── 2026-q2-branded-search-gads.md
│       ├── copy/
│       │   ├── meta-primary-text.md         # Variantes de gancho (5+) para texto principal de Meta
│       │   ├── meta-headlines.md            # Variantes de titulares para Meta
│       │   ├── google-rsa-headlines.md      # 15 titulares para Google RSA
│       │   └── google-rsa-descriptions.md   # 4 descripciones para Google RSA
│       └── results/
│           └── attribution-notes.md         # Anomalías de Triple Whale / Northbeam y decisiones
├── customer-service/
│   ├── templates/
│   │   ├── response-library.md          # 20+ borradores de macros por tipo de ticket
│   │   ├── where-is-my-order.md         # Macro WISMO con marcador de posición de enlace de seguimiento
│   │   ├── damaged-item.md              # Respuesta de bienes dañados + flujo de reemplazo
│   │   ├── wrong-item.md                # Artículo incorrecto recibido — plantilla de resolución
│   │   └── subscription-cancel.md       # Oferta de retención + reconocimiento de cancelación
│   ├── policies/
│   │   ├── returns-policy.md            # Política de devoluciones actual de cara al cliente
│   │   ├── shipping-policy.md           # SLA de transportista, reglas internacionales, límites
│   │   └── refund-matrix.md             # Árbol de decisión interno para casos límite
│   └── gorgias/
│       └── macro-import-template.csv    # CSV formato Gorgias para carga masiva de macros
├── suppliers/
│   ├── vendor-directory.md              # Nombre de proveedor, contacto, tiempo de entrega, MOQ, términos
│   ├── po-template.md                   # Plantilla de orden de compra con todos los campos requeridos
│   ├── reorder-tracker.csv              # SKU, proveedor, última fecha de PO, fecha de próximo reorden
│   └── comms/
│       ├── supplier-update-template.md  # Plantilla de correo electrónico de seguimiento estándar
│       └── [supplier-name]/
│           └── po-history.md            # Hilo de PO y confirmaciones por proveedor
├── reports/
│   ├── weekly/
│   │   ├── weekly-performance-template.md   # ROAS combinado, CAC, AOV, CR, SKUs principales
│   │   └── 2026-w22-performance.md
│   ├── monthly/
│   │   ├── monthly-pl-template.md           # Ingresos, COGS, margen bruto, gasto publicitario, neto
│   │   ├── channel-performance-template.md  # Shopify vs. venta mayorista vs. Amazon por mes
│   │   └── 2026-05-monthly.md
│   └── attribution/
│       └── triple-whale-export-notes.md     # Cómo leer las exportaciones, discrepancias conocidas
└── sops/
    ├── new-product-launch.md            # Lista de verificación de extremo a extremo: brief → listado → anuncios → correo
    ├── inventory-reorder.md             # Condiciones de activación, contacto del proveedor, búfer de tiempo de entrega
    ├── returns-processing.md            # Flujo de devoluciones ShipBob → restock o cancelación
    ├── ad-account-audit.md              # Lista de verificación de revisión de medios pagados semanal
    ├── klaviyo-health-check.md          # Cadencia de auditoría de higiene de lista, capacidad de entrega, flujo
    └── end-of-month-close.md            # Reconciliación de QuickBooks con pagos de Shopify
```

---

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/listing-optimizer.md` | Comando barra: toma un identificador de producto o información sin procesar y genera título reescrito, descripción y etiquetas meta en voz de marca |
| `.claude/commands/weekly-performance.md` | Comando barra: acepta resumen pegado de Triple Whale o Northbeam y produce narrativa estructurada para partes interesadas |
| `products/active/sku-overview.csv` | Fuente de verdad para todos los SKU activos — alimenta esto a Claude al ejecutar tareas de listado o inventario |
| `campaigns/email/copy/welcome-series.md` | Flujo de bienvenida de 3 correos redactado — edita aquí, luego pega en el editor de flujo Klaviyo |
| `customer-service/policies/refund-matrix.md` | Árbol de decisión interno que Claude usa al generar respuestas de macro para casos límite |
| `suppliers/vendor-directory.md` | Contactos y términos del proveedor — Claude lee esto antes de redactar cualquier comunicación con proveedores |
| `reports/weekly/weekly-performance-template.md` | Plantilla estructurada que Claude completa cada lunes desde exportaciones de plataforma pegadas |
| `sops/new-product-launch.md` | Lista de verificación que Claude sigue cuando un nuevo SKU va de brief a activo |

---

## Andamio rápido

```bash
# Crear el espacio de trabajo de nivel superior y todos los subdirectorios
mkdir -p ecommerce-workspace/.claude/commands
mkdir -p ecommerce-workspace/products/active/descriptions
mkdir -p ecommerce-workspace/products/active/seo
mkdir -p ecommerce-workspace/products/drafts
mkdir -p ecommerce-workspace/products/archived
mkdir -p ecommerce-workspace/campaigns/email/briefs
mkdir -p ecommerce-workspace/campaigns/email/copy
mkdir -p ecommerce-workspace/campaigns/email/results
mkdir -p ecommerce-workspace/campaigns/paid-ads/briefs
mkdir -p ecommerce-workspace/campaigns/paid-ads/copy
mkdir -p ecommerce-workspace/campaigns/paid-ads/results
mkdir -p ecommerce-workspace/customer-service/templates
mkdir -p ecommerce-workspace/customer-service/policies
mkdir -p ecommerce-workspace/customer-service/gorgias
mkdir -p ecommerce-workspace/suppliers/comms
mkdir -p ecommerce-workspace/reports/weekly
mkdir -p ecommerce-workspace/reports/monthly
mkdir -p ecommerce-workspace/reports/attribution
mkdir -p ecommerce-workspace/sops

# Instalar habilidades de Claudient
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/ecommerce-seller
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill small-business/returns-handler
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro

# Instalar comandos barra de Claudient en .claude/commands/
npx claudient add command listing-optimizer
npx claudient add command email-campaign
npx claudient add command ad-copy
npx claudient add command returns-policy
npx claudient add command supplier-update
npx claudient add command weekly-performance
npx claudient add command inventory-alert

# Crear CLAUDE.md de marcador
touch ecommerce-workspace/CLAUDE.md

# Sembrar archivos CSV y plantilla clave
touch ecommerce-workspace/products/active/sku-overview.csv
touch ecommerce-workspace/suppliers/vendor-directory.md
touch ecommerce-workspace/suppliers/reorder-tracker.csv
```

---

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo del Operador de Comercio Electrónico

Este es un espacio de trabajo de Claude Code para operar una marca DTC en Shopify. Claude asiste con
optimización de listados de productos, copia de campañas, plantillas de servicio al cliente, comunicaciones con proveedores
e informes de rendimiento semanal. Todas las tareas son operacionales — no hay código de aplicación aquí.

---

## Stack

- Shopify — escaparate, inventario, pedidos
- Klaviyo — campañas y flujos de correo electrónico y SMS
- Meta Ads Manager + Google Ads — adquisición pagada
- Triple Whale (o Northbeam) — atribución, MER, ROAS combinado
- Gorgias — tickets de soporte al cliente y macros
- ShipBob (o Flexport) — cumplimiento 3PL y devoluciones
- QuickBooks Online — P&L, COGS, reconciliación

---

## Convenciones de directorios

- `products/active/` — todos los SKU activos; edita descripciones aquí antes de hacer push a Shopify
- `campaigns/` — los briefs van en `briefs/`, la copia finalizada va en `copy/`
- `customer-service/policies/` — fuente de verdad para todo el lenguaje de política de cara al cliente
- `suppliers/comms/[supplier-name]/` — una carpeta por proveedor para historial de PO
- `reports/weekly/` — un archivo por semana nombrado `YYYY-Www-performance.md`
- `sops/` — listas de verificación operacionales que Claude sigue paso a paso

---

## Tareas comunes — comandos exactos

### Reescribir un listado de producto
/listing-optimizer
Pega el título del producto Shopify actual, descripción, precio y palabras clave objetivo.
Claude devuelve un título reescrito (≤70 caracteres), descripción PDP (dirigida al beneficio, 150-200 palabras),
y título meta + metadescripción listos para pegar en Shopify.

### Redactar una campaña de correo electrónico
/email-campaign
Proporciona: objetivo de campaña, segmento Klaviyo objetivo, oferta u gancho, fecha de envío.
Claude devuelve 2 variantes de línea de asunto (A/B), texto de vista previa y copia de cuerpo completo.

### Generar copia publicitaria
/ad-copy
Proporciona: plataforma (Meta o Google), objetivo de campaña, producto u oferta, audiencia.
Salida Meta: 5 ganchos de texto principal + 5 titulares. Salida Google: 15 titulares RSA + 4 descripciones.

### Actualizar política de devoluciones
/returns-policy
Describe el cambio necesario (p. ej., "extender ventana de devolución de 30 a 45 días para pedidos de vacaciones").
Claude reescribe la sección afectada y marca cualquier impacto aguas abajo en la matriz de reembolso.

### Redactar un correo de proveedor
/supplier-update
Proporciona: nombre del proveedor, número de PO o producto, el problema o solicitud.
Claude extrae información de contacto de `suppliers/vendor-directory.md` y redacta un correo electrónico profesional.

### Generar informe de rendimiento semanal
/weekly-performance
Pega tu exportación de resumen semanal de Triple Whale o Northbeam.
Claude devuelve una narrativa estructurada cubriendo ROAS combinado, nCAC, MER, 5 SKU principales por ingresos,
y una acción recomendada.

### Activar una alerta de inventario
/inventory-alert
Pega la lista de SKU con niveles de stock actual.
Claude marca cualquier SKU por debajo del umbral de reorden en `suppliers/reorder-tracker.csv`
y redacta una recomendación de reorden.

---

## Convenciones

- La voz de marca es [INSERTAR TONO DE MARCA: p. ej., "directo, cálido, nunca insistente"]. Aplica a toda la copia.
- Las descripciones de productos comienzan con el beneficio del cliente, no la característica.
- Todos los valores monetarios en USD a menos que se indique lo contrario.
- Los correos de proveedores son profesionales y concisos — sin lenguaje de relleno.
- Los informes semanales siguen la plantilla en `reports/weekly/weekly-performance-template.md` exactamente.
- No edites `products/archived/` — SKU descontinuados son registros de solo lectura.
- Cuando un archivo de política cambia, anota la fecha y razón en la parte superior de ese archivo.
```

---

## Servidores MCP

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/mcp-server"],
      "env": {
        "SHOPIFY_ACCESS_TOKEN": "${SHOPIFY_ACCESS_TOKEN}",
        "SHOPIFY_SHOP_DOMAIN": "${SHOPIFY_SHOP_DOMAIN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/path/to/ecommerce-workspace"
      ]
    }
  }
}
```

---

## Hooks recomendados

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_OUTPUT_PATH\" == */reports/weekly/* ]]; then echo \"[hook] Weekly report written: $CLAUDE_TOOL_OUTPUT_PATH\" >> .claude/report-log.txt; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_PATH\" == */customer-service/policies/* ]]; then cp \"$CLAUDE_TOOL_INPUT_PATH\" \"${CLAUDE_TOOL_INPUT_PATH}.bak\" 2>/dev/null; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"Session ended at $(date)\" >> .claude/session-log.txt'"
          }
        ]
      }
    ]
  }
}
```

---

## Habilidades a instalar

```bash
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/ecommerce-seller
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill small-business/returns-handler
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
```

---

## Relacionado

- [Guía: Claude para Operadores de Comercio Electrónico](../guides/for-ecommerce-operator.md)
- [Flujo de Trabajo: Lanzamiento de Nuevo Producto](../workflows/new-product-launch.md)
- [Flujo de Trabajo: Revisión de Rendimiento Semanal](../workflows/weekly-performance-review.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
