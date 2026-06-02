# Operaciones de Marca de Comercio Electrónico — Estructura del Proyecto

> Para equipos DTC que ejecutan Shopify Plus y necesitan que Claude gestione la gestión diaria de productos, campañas de correo electrónico y SMS, copia de anuncios pagados, reorden de inventario, escalada de servicio al cliente y análisis de rendimiento en un stack martech moderno.

## Stack

- Shopify Plus — storefront, catálogo de productos, inventario, metafields, B2B
- Klaviyo — flujos de correo electrónico, secuencias de SMS, segmentación, gestión de campañas
- Meta Ads Manager — prospección, retargeting, campañas DPA
- Google Performance Max — shopping, búsqueda, campañas unificadas de display
- Triple Whale o Northbeam — atribución multi-touch, MER, nCAC, ROAS combinado
- Gorgias — ticketing de soporte al cliente, macros, CSAT, reglas de automatización
- ShipBob — cumplimiento 3PL, WMS, portal de devoluciones, inventario distribuido
- Recharge Payments — planes de suscripción, lógica de facturación, gestión de churn
- Yotpo — reseñas, UGC, programas de lealtad y referencia
- QuickBooks Online — P&L, seguimiento de COGS, reconciliación de pagos de Shopify

---

## Árbol de directorios

```
ecommerce-brand/
├── .claude/
│   ├── settings.json                          # MCP servers, hooks, permissions
│   └── commands/
│       ├── product-launch.md                  # End-to-end new SKU launch checklist driver
│       ├── listing-optimizer.md               # Rewrite title, description, SEO meta by SKU
│       ├── campaign-brief.md                  # Generate Klaviyo or paid ad campaign brief
│       ├── email-copy.md                      # Draft campaign or flow email with subject variants
│       ├── sms-copy.md                        # Draft Klaviyo SMS with opt-out and character count
│       ├── ad-copy-meta.md                    # 5 primary text hooks + 5 headlines for Meta
│       ├── ad-copy-pmax.md                    # Headlines, descriptions, and assets for PMax
│       ├── inventory-check.md                 # Flag SKUs below reorder threshold by supplier
│       ├── reorder-draft.md                   # Draft PO or supplier email from reorder-tracker
│       ├── cs-macro.md                        # Generate Gorgias macro from ticket type + policy
│       ├── escalation-handler.md              # Triage ticket and apply escalation path
│       ├── subscription-retention.md          # Draft retention offer for Recharge cancel intent
│       ├── review-response.md                 # Draft Yotpo public reply for 1–3 star reviews
│       └── weekly-report.md                   # Narrative report from Triple Whale/Northbeam export
├── CLAUDE.md                                  # Workspace instructions (see template below)
├── products/
│   ├── sku-overview.csv                       # Master: handle, title, variant, price, cost, status, supplier
│   ├── listings/
│   │   ├── _brand-voice.md                    # Tone guide, banned words, style rules for all copy
│   │   ├── _pdp-template.md                   # Standard PDP structure: hook, benefits, specs, CTA
│   │   ├── cotton-canvas-tote-natural.md      # Example: one file per active SKU
│   │   ├── merino-crewneck-charcoal.md
│   │   └── stainless-tumbler-matte-black.md
│   ├── seo/
│   │   ├── meta-titles.csv                    # handle, current_title, proposed_title, char_count
│   │   ├── meta-descriptions.csv              # handle, current_desc, proposed_desc, char_count
│   │   ├── keyword-map.md                     # Primary + secondary keywords by collection
│   │   └── collection-page-copy.md            # SEO-optimized collection page descriptions
│   ├── drafts/
│   │   ├── new-product-brief-template.md      # Pre-launch form: concept, pricing, supplier, launch date
│   │   ├── 2026-q3-canvas-crossbody.md        # In-progress brief for upcoming launch
│   │   └── 2026-q4-holiday-bundle.md
│   └── archived/
│       └── discontinued-skus.csv              # Retired SKUs with discontinuation date and reason
├── marketing/
│   ├── email-sms/
│   │   ├── sequences/
│   │   │   ├── welcome-series.md              # Emails 1–3: onboarding flow copy + timing notes
│   │   │   ├── abandoned-cart.md              # Emails 1–2 + SMS 1: cart recovery sequence
│   │   │   ├── post-purchase.md               # Emails 1–2: review request + cross-sell
│   │   │   ├── win-back-90d.md                # 3-touch win-back for 90-day lapsed buyers
│   │   │   ├── subscription-churn.md          # Recharge cancel-intent: offer + save copy
│   │   │   └── loyalty-milestone.md           # Yotpo points milestone triggered email
│   │   └── campaigns/
│   │       ├── _campaign-brief-template.md    # Audience, goal, offer, CTA, Klaviyo segment, send date
│   │       ├── 2026-q2-mothers-day.md         # Finalized brief + copy for May campaign
│   │       ├── 2026-q3-back-to-school.md
│   │       ├── 2026-q4-bfcm-email.md          # Black Friday / Cyber Monday campaign file
│   │       └── klaviyo-campaign-log.csv       # Campaign name, send date, list size, OR, CTR, revenue
│   └── paid-ads/
│       ├── copy/
│       │   ├── meta-primary-text.md           # Hook variants (5+) per offer for Meta primary text
│       │   ├── meta-headlines.md              # 5+ headline variants for Meta ad sets
│       │   ├── pmax-headlines.md              # 15 headlines (≤30 chars) for Google PMax asset group
│       │   ├── pmax-descriptions.md           # 4 descriptions (≤90 chars) for PMax
│       │   └── dpa-catalog-copy.md            # Dynamic product ad overlay copy rules
│       └── creative-briefs/
│           ├── _ad-brief-template.md          # Offer, hook angle, audience, platform, budget, format
│           ├── 2026-q2-prospecting-meta.md    # Brief for Q2 cold traffic Meta campaigns
│           ├── 2026-q2-retargeting-meta.md
│           ├── 2026-q2-branded-pmax.md        # Branded search PMax campaign brief
│           └── 2026-q3-ugc-creative-meta.md
│   └── social/
│       ├── content-calendar.md                # Monthly post schedule with format and hook
│       └── caption-library.md                 # Reusable captions organized by product/theme
├── operations/
│   ├── inventory-sops/
│   │   ├── reorder-triggers.md                # Reorder threshold rules by SKU velocity and lead time
│   │   ├── reorder-tracker.csv                # SKU, supplier, last_po_date, next_reorder_date, qty
│   │   ├── low-stock-alert-process.md         # Step-by-step: detect → draft PO → confirm → log
│   │   └── dead-stock-review.md               # Quarterly process for slow-moving inventory decisions
│   ├── fulfillment-sops/
│   │   ├── shipbob-receiving-checklist.md     # Steps for logging inbound shipments in ShipBob WMS
│   │   ├── returns-processing.md              # ShipBob returns portal → grade → restock or write-off
│   │   ├── shipbob-exception-handler.md       # Lost, damaged, or delayed shipment resolution steps
│   │   └── distributed-inventory-rules.md    # Which SKUs live in which ShipBob warehouse and why
│   └── cs-playbooks/
│       ├── escalation-matrix.md               # Ticket type → tier 1 / tier 2 / founder escalation map
│       ├── wismo-playbook.md                  # WISMO: check ShipBob → Gorgias macro → follow-up SLA
│       ├── damaged-item-playbook.md           # Damaged goods: photo required → replacement or refund
│       ├── wrong-item-playbook.md             # Wrong item: prepaid label → reship → log in Gorgias
│       ├── subscription-cancel-playbook.md    # Recharge cancel intent → retention offer → log churn
│       └── chargeback-playbook.md             # Evidence collection, Shopify response, dispute timeline
├── analytics/
│   ├── weekly-dashboard.md                    # Template: MER, blended ROAS, nCAC, AOV, top SKUs, action
│   ├── channel-benchmarks.md                  # Platform-level KPI benchmarks by month and quarter
│   ├── cohort-analysis.md                     # LTV cohort table: 30/60/90/180-day repurchase by month
│   ├── triple-whale-export-notes.md           # How to read TW exports, known discrepancies, overrides
│   └── northbeam-attribution-log.md           # Model change log and weekly anomaly notes
├── finance/
│   ├── p-and-l-template.md                    # Monthly P&L: revenue, COGS, gross margin, ad spend, net
│   ├── unit-economics.md                      # CAC, LTV, payback period, contribution margin by SKU
│   ├── quickbooks-reconciliation-sop.md       # Shopify payouts → QB income account → COGS entry
│   └── end-of-month-close.md                  # Checklist: QB reconcile, payout match, margin review
└── vendors/
    ├── supplier-directory.md                  # Name, contact, MOQ, lead time, payment terms, currency
    ├── po-template.md                          # Standard purchase order with all required fields
    └── [supplier-name]/
        ├── po-history.md                       # All POs with dates, quantities, confirmations
        └── quality-notes.md                    # Defect rates, inspection results, unresolved issues
```

---

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `products/sku-overview.csv` | Registro maestro de SKU — proporciona este archivo a Claude antes de cualquier tarea de listado, inventario o proveedor para que el contexto sea preciso |
| `products/listings/_brand-voice.md` | Guía de tono que Claude aplica a cada reescritura de listado, borrador de campaña y macro de CS — edita primero cuando la voz de marca cambia |
| `operations/cs-playbooks/escalation-matrix.md` | Árbol de decisiones que Claude sigue al ejecutar `/escalation-handler` — asigna el tipo de ticket a respuesta de Nivel 1, Nivel 2 o fundador |
| `operations/inventory-sops/reorder-tracker.csv` | Fuente de verdad para cuándo reabastecer — Claude lee esto al ejecutar `/inventory-check` o `/reorder-draft` |
| `marketing/email-sms/campaigns/_campaign-brief-template.md` | Formato de brief requerido antes de que Claude redacte cualquier copia de campaña Klaviyo — refuerza campos de audiencia, segmento, oferta y CTA |
| `analytics/weekly-dashboard.md` | Plantilla estructurada que Claude completa cada lunes a partir de una exportación de Triple Whale o Northbeam pegada |
| `finance/unit-economics.md` | CAC, LTV y margen de contribución por SKU — Claude consulta esto para cualquier recomendación de presupuesto o canal |
| `vendors/supplier-directory.md` | Contactos de proveedores, MOQs y tiempos de entrega — Claude extrae de aquí antes de redactar cualquier PO o correo de proveedor |

---

## Andamiaje rápido

```bash
# Create all directories
mkdir -p ecommerce-brand/.claude/commands
mkdir -p ecommerce-brand/products/listings
mkdir -p ecommerce-brand/products/seo
mkdir -p ecommerce-brand/products/drafts
mkdir -p ecommerce-brand/products/archived
mkdir -p ecommerce-brand/marketing/email-sms/sequences
mkdir -p ecommerce-brand/marketing/email-sms/campaigns
mkdir -p ecommerce-brand/marketing/paid-ads/copy
mkdir -p ecommerce-brand/marketing/paid-ads/creative-briefs
mkdir -p ecommerce-brand/marketing/social
mkdir -p ecommerce-brand/operations/inventory-sops
mkdir -p ecommerce-brand/operations/fulfillment-sops
mkdir -p ecommerce-brand/operations/cs-playbooks
mkdir -p ecommerce-brand/analytics
mkdir -p ecommerce-brand/finance
mkdir -p ecommerce-brand/vendors

# Seed key stub files
touch ecommerce-brand/products/sku-overview.csv
touch ecommerce-brand/products/listings/_brand-voice.md
touch ecommerce-brand/products/listings/_pdp-template.md
touch ecommerce-brand/products/seo/meta-titles.csv
touch ecommerce-brand/products/seo/meta-descriptions.csv
touch ecommerce-brand/marketing/email-sms/campaigns/_campaign-brief-template.md
touch ecommerce-brand/marketing/email-sms/campaigns/klaviyo-campaign-log.csv
touch ecommerce-brand/marketing/paid-ads/creative-briefs/_ad-brief-template.md
touch ecommerce-brand/operations/inventory-sops/reorder-tracker.csv
touch ecommerce-brand/operations/cs-playbooks/escalation-matrix.md
touch ecommerce-brand/analytics/weekly-dashboard.md
touch ecommerce-brand/analytics/channel-benchmarks.md
touch ecommerce-brand/analytics/cohort-analysis.md
touch ecommerce-brand/finance/p-and-l-template.md
touch ecommerce-brand/finance/unit-economics.md
touch ecommerce-brand/vendors/supplier-directory.md
touch ecommerce-brand/vendors/po-template.md
touch ecommerce-brand/CLAUDE.md

# Install Claudient skills
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/klaviyo-campaign
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill operations/inventory-management
npx claudient add skill operations/customer-service-escalation
npx claudient add skill data-ml/weekly-performance-report

# Install slash commands
npx claudient add command product-launch
npx claudient add command listing-optimizer
npx claudient add command campaign-brief
npx claudient add command email-copy
npx claudient add command sms-copy
npx claudient add command ad-copy-meta
npx claudient add command ad-copy-pmax
npx claudient add command inventory-check
npx claudient add command reorder-draft
npx claudient add command cs-macro
npx claudient add command escalation-handler
npx claudient add command subscription-retention
npx claudient add command review-response
npx claudient add command weekly-report
```

---

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo de Operaciones de Marca de Comercio Electrónico

Este es un espacio de trabajo de Claude Code para operar una marca DTC Shopify Plus. Claude maneja
optimización de listados de productos, copia de campañas y flujos de Klaviyo, copia de anuncios Meta y Google PMax,
gestión de reorden de inventario, escalada de servicio al cliente, retención de suscripciones de Recharge,
respuestas de reseñas de Yotpo e informes de rendimiento semanales. No hay código de aplicación aquí.

---

## Stack

- Shopify Plus — storefront, catálogo, inventario, metafields
- Klaviyo — flujos de correo electrónico, secuencias de SMS, gestión de campañas
- Meta Ads Manager — prospección, retargeting, DPA
- Google Performance Max — shopping, búsqueda, display
- Triple Whale / Northbeam — atribución, MER, nCAC, ROAS combinado
- Gorgias — tickets de soporte, macros, CSAT, enrutamiento de escalada
- ShipBob — cumplimiento 3PL, WMS, portal de devoluciones
- Recharge Payments — suscripciones, facturación, flujos de intención de cancelación
- Yotpo — reseñas, UGC, lealtad y referencia
- QuickBooks Online — P&L, COGS, reconciliación de pagos de Shopify

---

## Convenciones de directorio

- `products/sku-overview.csv` — siempre proporciona este archivo al ejecutar tareas de listado o inventario
- `products/listings/_brand-voice.md` — aplica estas reglas de tono a cada pieza de copia
- `marketing/email-sms/campaigns/_campaign-brief-template.md` — requerido antes de redactar cualquier campaña
- `marketing/paid-ads/creative-briefs/_ad-brief-template.md` — requerido antes de redactar cualquier copia de anuncio
- `operations/cs-playbooks/escalation-matrix.md` — sigue esto al clasificar cualquier ticket de soporte
- `operations/inventory-sops/reorder-tracker.csv` — fuente de verdad para el tiempo de reorden
- `analytics/weekly-dashboard.md` — completa esta plantilla cada lunes a partir de exportaciones de plataforma
- `vendors/supplier-directory.md` — extrae contacto y términos de aquí antes de cualquier PO o correo de proveedor

---

## Flujo de trabajo de lanzamiento de nuevo producto

Cuando se te pida que lances un nuevo producto, trabaja a través de estos pasos en orden:
1. Confirma que existe un brief completado en `products/drafts/[product-slug].md`
2. Ejecuta `/listing-optimizer` para producir título, descripción de PDP, meta título, meta descripción
3. Verifica que el SKU se agregue a `products/sku-overview.csv` con COGS y proveedor correcto
4. Ejecuta `/campaign-brief` para el correo de lanzamiento — usa segmento Klaviyo: All Subscribers
5. Ejecuta `/email-copy` usando el brief aprobado
6. Ejecuta `/ad-copy-meta` y `/ad-copy-pmax` usando el brief de lanzamiento
7. Confirma que el umbral de reorden se configura en `operations/inventory-sops/reorder-tracker.csv`
8. Mueve el archivo borrador de `products/drafts/` a `products/listings/[slug].md`

---

## Proceso de briefing de campaña

Antes de escribir cualquier copia de campaña, debe existir un brief completado en la carpeta apropiada.
Para campañas de Klaviyo: `marketing/email-sms/campaigns/[campaign-slug].md`
Para anuncios pagados: `marketing/paid-ads/creative-briefs/[campaign-slug].md`

Un brief debe especificar: audiencia/segmento, objetivo (adquisición / retención / reactivación),
oferta o gancho, CTA, plataforma, fecha de envío o fecha de lanzamiento, y presupuesto (para pagados).
Claude no redactará copia sin un brief completo — solicita campos faltantes.

---

## Disparadores de reorden de inventario

Claude verifica `operations/inventory-sops/reorder-tracker.csv` y marca reorden cuando:
- Las unidades disponibles caen por debajo del umbral de reorden del SKU (columna: reorder_threshold)
- Los días de stock restantes (units_on_hand / avg_daily_velocity) < tiempo de entrega del proveedor + 7 días
En caso de disparo: ejecuta `/reorder-draft` con el SKU y nombre de proveedor extraído de supplier-directory.md.

---

## Rutas de escalada de servicio al cliente

Sigue `operations/cs-playbooks/escalation-matrix.md` para toda clasificación de tickets.
Nivel 1 (macro de Gorgias): WISMO, solicitudes estándar de devolución, preguntas de tamaño
Nivel 2 (revisión del líder de CS): bienes dañados, artículo incorrecto, disputas de contracargos, facturación de suscripción
Escalada del fundador: amenazas mediáticas, lenguaje legal, pedidos > $500, fallos repetidos

Al ejecutar `/escalation-handler`, siempre extrae la política actual de:
- `operations/cs-playbooks/[issue-type]-playbook.md` para resolución paso a paso
- `operations/fulfillment-sops/returns-processing.md` para cualquier devolución física
- Historial de tickets de Gorgias si el cliente ha contactado antes (nota si es contacto repetido)

---

## Tareas comunes — comandos exactos

### Optimizar un listado de producto
/listing-optimizer
Proporciona: handle o slug del producto, título actual, palabras clave objetivo (de `products/seo/keyword-map.md`).
Salida: título reescrito (≤70 caracteres), descripción de PDP (dirigida por beneficios, 150–200 palabras),
meta título (≤60 caracteres), meta descripción (≤155 caracteres).

### Redactar una campaña de correo electrónico de Klaviyo
/email-copy
Proporciona: enlace al brief completado en `marketing/email-sms/campaigns/`.
Salida: 2 variantes de línea de asunto (A/B), texto de vista previa, copia de cuerpo completo formateada para pegar en Klaviyo.

### Redactar un SMS de Klaviyo
/sms-copy
Proporciona: objetivo de campaña, oferta, segmento de Klaviyo, fecha de envío.
Salida: cuerpo de SMS (≤160 caracteres incluyendo exclusión), y alternativa de 2 partes si >160 caracteres.

### Generar copia de anuncio Meta
/ad-copy-meta
Proporciona: enlace al brief en `marketing/paid-ads/creative-briefs/`.
Salida: 5 ganchos de texto principal, 5 titulares (≤40 caracteres cada uno), 2 variantes de descripción de enlace.

### Generar copia de grupo de activos de Google PMax
/ad-copy-pmax
Proporciona: enlace al brief en `marketing/paid-ads/creative-briefs/`.
Salida: 15 titulares (≤30 caracteres), 4 descripciones (≤90 caracteres), titular largo (≤90 caracteres).

### Verificar inventario y redactar reorden
/inventory-check — pega exportación de stock actual de ShipBob
/reorder-draft — proporciona nombre de SKU y proveedor después de que se dispare la alerta

### Clasificar un ticket de soporte
/escalation-handler
Proporciona: ID de ticket de Gorgias o pega el cuerpo del ticket.
Claude devuelve: asignación de nivel, libro de jugadas a seguir, macro a usar o borrador.

### Generar informe de rendimiento semanal
/weekly-report
Pega la exportación del resumen semanal de Triple Whale o Northbeam.
Salida: narrativa estructurada cubriendo MER, ROAS combinado, nCAC, AOV, top 5 SKUs, un elemento de acción.

---

## Convenciones

- Todos los valores monetarios en USD a menos que los términos de un proveedor especifiquen lo contrario.
- La copia del producto comienza con el beneficio del cliente, no la característica del producto.
- Los segmentos de Klaviyo están en mayúsculas exactamente como aparecen en la interfaz de usuario de Klaviyo.
- No edites `products/archived/` — los registros son de solo lectura.
- Al actualizar un archivo de política, prependa una nota de cambio fechada en la parte superior de ese archivo.
- Los archivos del panel semanal se nombran `YYYY-Www-performance.md` (p. ej., `2026-W22-performance.md`).
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
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "${KLAVIYO_API_KEY}"
      }
    },
    "gorgias": {
      "command": "npx",
      "args": ["-y", "@gorgias/mcp-server"],
      "env": {
        "GORGIAS_DOMAIN": "${GORGIAS_DOMAIN}",
        "GORGIAS_API_KEY": "${GORGIAS_API_KEY}",
        "GORGIAS_API_EMAIL": "${GORGIAS_API_EMAIL}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/path/to/ecommerce-brand"
      ]
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_PATH\"; if [[ \"$FILE\" == */analytics/weekly-dashboard* || \"$FILE\" == */analytics/*performance* ]]; then echo \"[$(date +%Y-%m-%d)] Report written: $FILE\" >> .claude/report-log.txt; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_PATH\"; if [[ \"$FILE\" == */marketing/paid-ads/copy/* || \"$FILE\" == */marketing/email-sms/campaigns/* ]]; then echo \"[$(date +%Y-%m-%d)] Campaign asset written: $FILE\" >> .claude/campaign-log.txt; fi'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_PATH\"; if [[ \"$FILE\" == */operations/cs-playbooks/* || \"$FILE\" == *escalation-matrix* ]]; then cp \"$FILE\" \"${FILE}.bak\" 2>/dev/null; echo \"[$(date +%Y-%m-%d)] Backup created: ${FILE}.bak\"; fi'"
          }
        ]
      }
    ]
  }
}
```

---

## Skills a instalar

```bash
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/klaviyo-campaign
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill operations/inventory-management
npx claudient add skill operations/customer-service-escalation
npx claudient add skill data-ml/weekly-performance-report
npx claudient add skill productivity/vendor-evaluator
```

---

## Relacionado

- [Guide: Claude for E-commerce Operators](../guides/for-ecommerce-operator.md)
- [Workflow: New Product Launch](../workflows/new-product-launch.md)
- [Workflow: Weekly Performance Review](../workflows/weekly-performance-review.md)
- [Workflow: Inventory Reorder](../workflows/inventory-reorder.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
