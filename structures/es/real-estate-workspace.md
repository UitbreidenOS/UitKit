# Espacio de Trabajo del Agente Inmobiliario — Estructura del Proyecto

> Para un agente inmobiliario residencial o comercial que gestiona listados, compradores, vendedores, ofertas y canales de cierre de forma integral — desde el primer contacto hasta el cierre del trato — con Follow Up Boss, DocuSign, MLS/RPR y Google Workspace como pila operativa.

## Stack

- **Follow Up Boss** o **Wise Agent** — CRM, enrutamiento de prospectos, etapas del pipeline, campañas de goteo, automatización de tareas
- **Zillow Premier Agent** / **Realtor.com** — Portales de listados, captura de prospectos, solicitudes de visualización, visibilidad de mercado
- **DocuSign** — Acuerdos de compra, acuerdos de listado, enrutamiento de anexos, auditoría de firma electrónica
- **Google Workspace** — Gmail (hilos de correo del cliente), Google Drive (almacenamiento de archivos), Google Calendar (visualizaciones)
- **RPR (Realtors Property Resource)** o **MLS** — Datos de mercado, comparables, CMAs, estadísticas de vecindario
- **BombBomb** — Correo de video para anuncios de listados, recapitulaciones de giras de compradores, seguimiento de presentación de ofertas
- **Canva** — Volantes de listados recientes, gráficos de redes sociales, presentaciones de compradores, folletos de listados
- **Claude Code** — Copia de listados, narrativa de CMA, borradores de ofertas, correos de seguimiento de clientes, resúmenes de visualización

## Árbol de directorios

```
real-estate-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones del espacio de trabajo (pega la plantilla abajo)
│   ├── settings.json                          # Servidores MCP, ganchos, permisos
│   └── commands/
│       ├── listing-create.md                  # /listing-create — descripción lista para MLS + copia de marketing de detalles de la propiedad
│       ├── cma-report.md                      # /cma-report — narrativa de análisis comparable + recomendación de precio
│       ├── offer-draft.md                     # /offer-draft — correo de portada del acuerdo de compra + resumen de estrategia de oferta
│       ├── client-followup.md                 # /client-followup — correo de seguimiento personalizado a partir de notas de CRM
│       ├── showing-notes.md                   # /showing-notes — comentarios de visualización estructurados a partir de notas sin procesar
│       ├── market-update.md                   # /market-update — instantánea de mercado del vecindario para nutrición de clientes
│       └── buyer-package.md                   # /buyer-package — esquema de presentación de compradores + documento de criterios de búsqueda
├── listings/
│   ├── active/
│   │   ├── _template/                         # Carpeta de listado en blanco — copia cuando un nuevo listado entra en vigor
│   │   │   ├── mls-data.md                    # Hoja de entrada de MLS: dormitorios, baños, pies cuadrados, lote, año de construcción, características
│   │   │   ├── marketing-copy.md              # Titular, descripción de MLS, subtítulo social, variantes de línea de asunto de correo
│   │   │   ├── showing-feedback/              # Carpeta para archivos de comentarios por visualización
│   │   │   │   └── .gitkeep
│   │   │   ├── photos/                        # Índice de archivos de foto y subtítulos (nombres de archivo, no binarios)
│   │   │   │   └── photo-index.md
│   │   │   └── price-history.md               # Lista de precios, fecha de cambio, razón del cambio
│   │   ├── 42-maple-st-springfield/
│   │   │   ├── mls-data.md
│   │   │   ├── marketing-copy.md
│   │   │   ├── price-history.md               # $489K → $475K el 2026-05-10 (días en el mercado: 21)
│   │   │   ├── listing-agreement.md           # Fecha de acuerdo, vencimiento, división de comisión, cláusula de agencia dual
│   │   │   ├── showing-feedback/
│   │   │   │   ├── 2026-05-03-showing.md      # Agente comprador, reacción del comprador, objeciones, nivel de interés
│   │   │   │   ├── 2026-05-07-showing.md
│   │   │   │   └── 2026-05-14-showing.md
│   │   │   └── photos/
│   │   │       └── photo-index.md
│   │   └── 110-river-rd-unit-4b/
│   │       ├── mls-data.md
│   │       ├── marketing-copy.md
│   │       ├── price-history.md
│   │       ├── listing-agreement.md
│   │       └── showing-feedback/
│   │           └── .gitkeep
│   └── past/
│       ├── 2025-closed/
│       │   ├── 78-elm-ave-westfield/
│       │   │   ├── mls-data.md
│       │   │   ├── final-sale-price.md        # Precio de listado, precio de venta, días en el mercado, concesiones otorgadas
│       │   │   └── closing-notes.md           # Compañía de títulos, fecha de cierre, neto del vendedor, lecciones
│       │   └── 203-birch-ln-lakewood/
│       │       ├── mls-data.md
│       │       ├── final-sale-price.md
│       │       └── closing-notes.md
│       └── 2024-closed/
│           └── .gitkeep
├── buyers/
│   ├── _template/
│   │   ├── buyer-profile.md                   # Nombres, información de contacto, prestamista, monto de preaprobación, cronograma
│   │   ├── search-criteria.md                 # Dormitorios, baños, rango de precios, vecindarios, imprescindibles, factores decisivos
│   │   ├── showing-history.md                 # Registro de hogares mostrados: dirección, fecha, reacción, clasificación
│   │   └── offer-history.md                   # Ofertas presentadas: dirección, monto, términos, resultado
│   ├── chen-family/
│   │   ├── buyer-profile.md                   # Preaprobado $620K, convencional, 20% de enganche, prestamista: First National
│   │   ├── search-criteria.md                 # 3+ dormitorios Northside/Eastbrook, prioridad de distrito escolar, garaje requerido
│   │   ├── showing-history.md
│   │   │   # 2026-05-01 — 42 Maple St: les gustó el diseño, objeción al tamaño del patio
│   │   │   # 2026-05-09 — 18 Oak Ct: gran interés, preocupación por HOA
│   │   └── offer-history.md
│   │       # 2026-05-12 — 18 Oak Ct: $598K, inspección de 10 días, rechazada por el vendedor
│   ├── rodriguez-patricia/
│   │   ├── buyer-profile.md
│   │   ├── search-criteria.md
│   │   ├── showing-history.md
│   │   └── offer-history.md
│   └── kim-david/
│       ├── buyer-profile.md
│       ├── search-criteria.md
│       ├── showing-history.md
│       └── offer-history.md
├── sellers/
│   ├── _template/
│   │   ├── seller-profile.md                  # Nombres, información de contacto, motivación para vender, cronograma, estimación de capital
│   │   ├── cma.md                             # Análisis comparable: activos, pendientes, vendidos + recomendación de precio
│   │   ├── listing-agreement.md               # Términos de acuerdo, vencimiento, exclusiones, divulgación de agencia dual
│   │   └── price-change-history.md            # Registro de reducciones de precio de listado con fechas y justificación
│   ├── johnson-mark-and-linda/
│   │   ├── seller-profile.md                  # 42 Maple St — reubicación, debe cerrar antes del 1 de agosto
│   │   ├── cma.md                             # Ejecución de CMA 2026-04-20, recomendado $489K–$499K
│   │   ├── listing-agreement.md
│   │   └── price-change-history.md
│   └── torres-carlos/
│       ├── seller-profile.md
│       ├── cma.md
│       ├── listing-agreement.md
│       └── price-change-history.md
├── templates/
│   ├── listing-description-template.md        # Fórmula de titular + cuerpo para MLS, Zillow y redes sociales
│   ├── buyer-offer-letter-template.md         # Carta de oferta personal del comprador — construye conexión emocional
│   ├── neighborhood-summary-template.md       # Resumen de servicios caminables, calificaciones escolares, desplazamiento, instantánea de tendencia de mercado
│   ├── market-update-template.md              # Correo mensual: nuevos listados, DOM promedio, relación de listado a venta, pronóstico
│   ├── showing-feedback-request-template.md   # Correo al agente del comprador solicitando comentarios específicos después de la visualización
│   ├── price-reduction-announcement.md        # Copia de correo + redes sociales para notificación de reducción de precio de listado
│   └── open-house-followup-template.md        # Seguimiento del mismo día a los asistentes de la jornada de puertas abiertas con CTA
├── contracts/
│   ├── purchase-agreements/
│   │   ├── residential-purchase-agreement-ca.md    # RPA de California — campos clave, valores predeterminados de contingencia, cronograma
│   │   ├── residential-purchase-agreement-tx.md    # Texas TREC Familia de Una a Cuatro — campos clave
│   │   └── commercial-purchase-agreement.md        # Flujo de LOI a PSA, valores predeterminados del período de diligencia
│   ├── addenda/
│   │   ├── inspection-contingency-removal.md       # Tiempo de eliminación de contingencia y lenguaje predeterminado
│   │   ├── loan-contingency-addendum.md            # Tipo de préstamo, LTV, tasa máxima, plazo de eliminación
│   │   ├── seller-rent-back-addendum.md            # Términos de arrendamiento, tarifa diaria, depósito de seguridad
│   │   └── as-is-addendum.md                       # Divulgación tal cual, lenguaje de aceptación del comprador
│   └── disclosure-packets/
│       ├── seller-property-questionnaire.md        # Secciones clave de SPQ para revisar con el vendedor antes del listado
│       └── transfer-disclosure-statement.md        # Campos de TDS, lista de verificación de banderas rojas para agentes
├── marketing/
│   ├── email-templates/
│   │   ├── just-listed-announcement.md        # A esfera + clientes anteriores — anuncio de nuevo listado
│   │   ├── under-contract-social-proof.md     # Anuncio a la esfera generando impulso
│   │   ├── just-sold-case-study.md            # Correo posterior al cierre con precio de venta, DOM, lecciones
│   │   └── quarterly-market-report-email.md   # Estadísticas de mercado de Q[X] + resumen de producción
│   ├── social-posts/
│   │   ├── listing-launch-post.md             # Subtítulo de Instagram/Facebook para nuevo listado
│   │   ├── sold-announcement-post.md          # Publicación de prueba social con estadísticas del agente
│   │   └── market-tip-series.md              # Serie de publicaciones educativas de 5 partes para nutrición
│   └── video-scripts/
│       ├── listing-tour-intro.md              # Script de BombBomb — introducción de propiedad para prospectos de compradores
│       ├── offer-presentation-script.md       # Video para el vendedor presentando términos de oferta y recomendación
│       └── buyer-check-in-script.md           # Punto de contacto de video semanal para clientes compradores activos
├── reports/
│   ├── monthly-production-report.md           # Volumen cerrado, listados activos, clientes compradores, DOM promedio, comisión
│   ├── pipeline-tracker.md                    # Todos los compradores + listados activos por etapa: activo, bajo contrato, pendiente
│   ├── lead-source-tracker.md                 # Prospectos por fuente (Zillow, referencia, jornada de puertas abiertas) y tasa de conversión
│   └── quarterly-review.md                    # Objetivos vs. resultados de Q[X], mayores victorias, ajustes para el próximo trimestre
└── scratch/
    ├── weekly-priorities.md                   # Borrador de lunes: los 3 principales listados, los 3 principales compradores, seguimientos vencidos
    └── call-notes-staging.md                  # Notas sin procesar posteriores a la llamada antes de presentar a la carpeta de comprador o vendedor
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/listing-create.md` | Comando de barra que toma detalles de propiedad sin procesar (dormitorios, baños, características, puntos de venta) y devuelve descripción lista para MLS, variantes de titular y subtítulos sociales en una sola pasada |
| `.claude/commands/cma-report.md` | Comando de barra que toma comparables de RPR o MLS y devuelve una narrativa de CMA estructurada con recomendación de precio y nivel de confianza |
| `.claude/commands/offer-draft.md` | Comando de barra que toma perfil del comprador, propiedad objetivo y términos de oferta y devuelve un correo de portada, carta de oferta personal y mensaje de agente a agente para presentación |
| `.claude/commands/client-followup.md` | Comando de barra que toma nombre de comprador o vendedor, última interacción y siguiente paso, luego redacta un correo de seguimiento personalizado en la voz del agente |
| `.claude/commands/showing-notes.md` | Comando de barra que convierte notas posteriores a la visualización sin procesar en un archivo de comentarios estructurado con reacción del comprador, objeciones, puntuación de interés y siguiente paso recomendado |
| `listings/active/_template/` | Estructura de carpeta canónica para copiar cuando un nuevo listado se activa — garantiza que cada listado tenga datos de MLS, copia de marketing, comentarios de visualización e historial de precios en un solo lugar |
| `sellers/<name>/cma.md` | Ejecución de CMA para cada cliente vendedor — almacena selección de comparables, lógica de rango de precios y recomendación final; se actualiza si las condiciones del mercado cambian antes de la decisión de precios |
| `reports/pipeline-tracker.md` | Fuente única de verdad para todos los tratos activos por etapa — revisada cada lunes por la mañana para priorizar seguimientos y señalar tratos en riesgo de caer |

## Andamiaje rápido

```bash
# Crear la raíz del espacio de trabajo
mkdir -p real-estate-workspace

# Crear estructura .claude con comandos
mkdir -p real-estate-workspace/.claude/commands

# Crear estructura de listados
mkdir -p real-estate-workspace/listings/active/_template/showing-feedback
mkdir -p real-estate-workspace/listings/active/_template/photos
mkdir -p real-estate-workspace/listings/active/42-maple-st-springfield/showing-feedback
mkdir -p real-estate-workspace/listings/active/42-maple-st-springfield/photos
mkdir -p real-estate-workspace/listings/active/110-river-rd-unit-4b/showing-feedback
mkdir -p real-estate-workspace/listings/past/2025-closed/78-elm-ave-westfield
mkdir -p real-estate-workspace/listings/past/2025-closed/203-birch-ln-lakewood
mkdir -p real-estate-workspace/listings/past/2024-closed

# Crear estructura de compradores
mkdir -p real-estate-workspace/buyers/_template
mkdir -p real-estate-workspace/buyers/chen-family
mkdir -p real-estate-workspace/buyers/rodriguez-patricia
mkdir -p real-estate-workspace/buyers/kim-david

# Crear estructura de vendedores
mkdir -p real-estate-workspace/sellers/_template
mkdir -p real-estate-workspace/sellers/johnson-mark-and-linda
mkdir -p real-estate-workspace/sellers/torres-carlos

# Crear plantillas, contratos, marketing, reportes, borrador
mkdir -p real-estate-workspace/templates
mkdir -p real-estate-workspace/contracts/purchase-agreements
mkdir -p real-estate-workspace/contracts/addenda
mkdir -p real-estate-workspace/contracts/disclosure-packets
mkdir -p real-estate-workspace/marketing/email-templates
mkdir -p real-estate-workspace/marketing/social-posts
mkdir -p real-estate-workspace/marketing/video-scripts
mkdir -p real-estate-workspace/reports
mkdir -p real-estate-workspace/scratch

# Semilla marcadores de posición .gitkeep
touch real-estate-workspace/listings/active/_template/showing-feedback/.gitkeep
touch real-estate-workspace/listings/past/2024-closed/.gitkeep
touch real-estate-workspace/buyers/_template/.gitkeep
touch real-estate-workspace/sellers/_template/.gitkeep

# Instalar habilidades inmobiliarias
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer
npx claudient add skill marketing/email-sequence
npx claudient add skill gtm/crm-hygiene

# Copiar talones de comando en .claude/commands/
npx claudient add skill small-business/real-estate-listing --output real-estate-workspace/.claude/commands/listing-create.md
npx claudient add skill small-business/cma-report --output real-estate-workspace/.claude/commands/cma-report.md
npx claudient add skill small-business/buyer-offer-writer --output real-estate-workspace/.claude/commands/offer-draft.md
npx claudient add skill marketing/email-sequence --output real-estate-workspace/.claude/commands/client-followup.md
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo del Agente Inmobiliario — Instrucciones de Claude Code

## Qué es esto

Este es el directorio de trabajo para un agente inmobiliario que gestiona listados activos, clientes compradores,
clientes vendedores, contratos y marketing. Los listados viven en listings/, archivos de comprador en buyers/,
archivos de vendedor en sellers/, y activos reutilizables en templates/ y contracts/.
Todas las copias de listados, CMAs, borradores de ofertas, seguimientos de clientes y actualizaciones de mercado se ejecutan a través de habilidades de Claude Code.

## Stack

- Follow Up Boss — CRM de registro (prospectos, etapas del pipeline, campañas de goteo, tareas)
- DocuSign — Enrutamiento de contratos; rastrear IDs de sobre en la carpeta de listado o comprador relevante
- RPR / MLS — Datos de mercado; pegar tablas de comparables en el cma.md relevante antes de ejecutar /cma-report
- Google Drive — Archivo de largo plazo; sincronizar carpetas de tratos cerrados después de la financiación
- BombBomb — Correo de video; los scripts viven en marketing/video-scripts/
- Canva — Gráficos de marketing; nombres de diseño de referencia en marketing/social-posts/
- Zillow / Realtor.com — Portales de listados; anotar IDs de portal en mls-data.md para cada listado

## Tareas comunes y comandos exactos

### Crear una nueva descripción de listado
```
/listing-create

Address: [dirección de calle]
Property type: [unifamiliar / condominio / multifamiliar / comercial]
Beds: [N] | Baths: [N] | Sqft: [N] | Lot: [N sqft o acres] | Year built: [AAAA]
Garage: [sí/no, N-car] | Pool: [sí/no] | HOA: [sí/no, $X/mo]
Upgrades: [enumerar renovaciones o características clave]
Selling points: [beneficio de ubicación, distrito escolar, desplazamiento, estilo de vida]
Price: $[X]
Tone: [lujo / familiar / inversión / casa de inicio]
```

### Ejecutar un CMA y obtener una recomendación de precio
```
/cma-report

Subject property: [dirección, dormitorios, baños, sqft, lote, año de construcción, condición]
Active comps: [enumerar 2-4 con dirección, precio de listado, dormitorios/baños/sqft, DOM]
Pending comps: [enumerar 1-3 con dirección, precio de listado, dormitorios/baños/sqft]
Sold comps (últimos 90 días): [enumerar 3-5 con dirección, precio de venta, fecha de cierre, dormitorios/baños/sqft, DOM]
Adjustments needed: [piscina, garaje, condición, tamaño de lote — notar diferencias]
Market trend: [apreciación / plano / debilitamiento — y por cuánto por mes]
```

### Redactar un paquete de envío de oferta
```
/offer-draft

Property: [dirección]
Buyer: [nombres para carta personal]
Offer price: $[X] | List price: $[Y]
Down payment: [%] | Loan type: [convencional / FHA / VA / efectivo]
Earnest money: $[X]
Inspection contingency: [sí/no, N días]
Loan contingency: [sí/no, N días]
Appraisal contingency: [sí/no]
Close of escrow: [fecha o N días]
Seller rent-back: [sí/no, N días a $X/día]
Personal letter angle: [algo real sobre el comprador y por qué aman este hogar]
Competing offers: [sí/no — ajustar urgencia en consecuencia]
```

### Escribir un correo de seguimiento de cliente
```
/client-followup

Client: [nombre(s)]
Client type: [comprador / vendedor]
Last interaction: [fecha y qué sucedió — visualización, llamada telefónica, oferta presentada, etc.]
Their current status: [búsqueda activa / bajo contrato / preparación de listado / esperando oferta]
Next step needed: [qué necesitas que hagan o qué quieres que sepan]
Tone: [reconfortante / emocionante / informativo / urgente]
```

### Registrar y estructurar notas de visualización
```
/showing-notes

Property shown: [dirección]
Buyer: [nombre]
Date: [AAAA-MM-DD]
Raw notes: [pegar tu transcripción de memo de voz o notas viñeta verbatim]
Buyer's agent feedback (si se recibe): [pegar o resumir]
```

### Redactar una actualización de mercado para nutrición de clientes
```
/market-update

Neighborhood: [nombre]
Date range: [p. ej., mayo de 2026]
New listings: [N a $X promedio]
Sold: [N a $X promedio, DOM Y días promedio]
List-to-sale ratio: [X%]
Inventory level: [N meses de suministro]
Trend: [mercado de compradores / equilibrado / mercado de vendedores]
Audience: [clientes anteriores / compradores activos / esfera de influencia]
```

### Crear un paquete de presentación de comprador
```
/buyer-package

Buyer names: [nombres]
Pre-approval: $[X] | Lender: [nombre]
Target neighborhoods: [enumerar]
Search criteria: [dormitorios, baños, imprescindibles, factores decisivos]
Timeline: [cuándo quieren estar dentro]
First-time buyer: [sí/no]
```

## Convenciones a seguir

- Cada listado activo debe tener mls-data.md y marketing-copy.md antes de entrar en vigor en MLS
- Cada visualización obtiene un archivo de comentarios en listings/active/<address>/showing-feedback/ nombrado AAAA-MM-DD-showing.md
- Cada cliente comprador debe tener buyer-profile.md, search-criteria.md, showing-history.md y offer-history.md
- Los archivos CMA viven en sellers/<name>/cma.md — añadir una nueva sección si es necesaria una re-ejecución; no sobrescribir
- Los cambios de precio de listado se registran en listings/active/<address>/price-history.md con fecha y razón
- Los tratos cerrados se mueven de listings/active/ a listings/past/AAAA-closed/ dentro de 5 días de la financiación
- Los envíos de oferta se registran en buyers/<name>/offer-history.md — incluir dirección, monto, términos y resultado
- pipeline-tracker.md se revisa cada lunes y se actualiza con la etapa actual para cada archivo activo
- Todos los anexos de contrato se almacenan en contracts/addenda/ y se hace referencia por nombre en la carpeta de trato relevante
```

## Servidores MCP

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-gdrive"],
      "env": {
        "GDRIVE_CLIENT_ID": "tu-google-oauth-client-id",
        "GDRIVE_CLIENT_SECRET": "tu-google-oauth-client-secret",
        "GDRIVE_REFRESH_TOKEN": "tu-google-refresh-token"
      }
    },
    "gmail": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-gmail"],
      "env": {
        "GMAIL_CLIENT_ID": "tu-google-oauth-client-id",
        "GMAIL_CLIENT_SECRET": "tu-google-oauth-client-secret",
        "GMAIL_REFRESH_TOKEN": "tu-google-refresh-token"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/tu-nombre-de-usuario/real-estate-workspace"
      ]
    }
  }
}
```

## Ganchos recomendados

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"showing-feedback\"; then echo \"[hook] Notas de visualización guardadas — recuerda registrar la reacción del comprador en buyers/<name>/showing-history.md y hacer seguimiento dentro de 24 horas\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"offer-history\"; then echo \"[hook] Oferta registrada — actualizar etapa de pipeline-tracker.md y establecer una tarea de seguimiento en Follow Up Boss\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Monday\" ]; then echo \"[reminder] Lunes — revisar reports/pipeline-tracker.md y actualizar cada listado activo y comprador a la etapa actual\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
# Habilidades inmobiliarias centrales
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer

# Habilidades de marketing y nutrición
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/social-content-writer
npx claudient add skill marketing/video-script-writer

# Habilidades de CRM y operaciones
npx claudient add skill gtm/crm-hygiene
npx claudient add skill productivity/client-followup
npx claudient add skill productivity/weekly-review
```

## Relacionado

- [Guía del agente inmobiliario](../guides/for-real-estate-agent.md)
- [Flujo de trabajo de lanzamiento de listado](../workflows/listing-launch.md)
- [Flujo de trabajo del ciclo de gira de compradores](../workflows/buyer-tour-cycle.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
