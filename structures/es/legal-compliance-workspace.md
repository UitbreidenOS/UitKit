# Espacio de Trabajo Legal y Cumplimiento Normativo — Estructura de Proyecto

> Para abogados internos u oficiales de cumplimiento normativo que gestionan revisión de contratos, seguimiento regulatorio, cumplimiento GDPR/privacidad, diligencia debida de proveedores y redacción de políticas a través de Clio, Ironclad, Westlaw, DocuSign y Microsoft 365.

## Stack

- **Clio** o **Ironclad** — Gestión de asuntos, ciclo de vida de contratos, seguimiento de redlines, enrutamiento de firmas
- **Westlaw** o **LexisNexis** — Investigación legal primaria, recuperación de jurisprudencia, orientación regulatoria
- **DocuSign** — Enrutamiento de eSignature, seguimiento de sobres, almacenamiento de acuerdos ejecutados
- **Microsoft 365** — Word (redlines), Outlook (abogados externos), Teams (canal legal), SharePoint (gestión de documentos)
- **Notion** — Documentación de políticas, calendarios de cumplimiento, wiki legal interno
- **Slack** — Ingesta de solicitudes legales internas, colaboración de equipos de negociación, alertas de cumplimiento
- **Claude Code** — Revisión de contratos, redlining de NDA, análisis de brechas GDPR, diligencia debida de proveedores, redacción de políticas, memos de investigación legal

## Árbol de directorios

```
legal-compliance-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones de espacio de trabajo (pega la plantilla a continuación)
│   ├── settings.json                          # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── contract-review.md                 # /contract-review [type] — redline, banderas de riesgo, cláusulas faltantes
│       ├── nda-review.md                      # /nda-review — análisis de redlines de NDA mutua vs. unidireccional
│       ├── gdpr-check.md                      # /gdpr-check — análisis de brechas GDPR/CCPA en documentos o procesos
│       ├── vendor-diligence.md                # /vendor-diligence — revisión de contrato de proveedor + cuestionario de seguridad
│       ├── policy-draft.md                    # /policy-draft — borrador o actualización de política de la empresa
│       ├── legal-research.md                  # /legal-research — producción de memo legal a partir de fuentes de Westlaw
│       └── compliance-audit.md                # /compliance-audit — ejecución de lista de verificación de auditoría estructurada (SOC2, ISO, GDPR)
├── contracts/
│   ├── templates/
│   │   ├── nda/
│   │   │   ├── mutual-nda-template.docx       # NDA mutua estándar — papel de la empresa, términos preferidos
│   │   │   ├── one-way-nda-template.docx      # NDA unidireccional para proveedores que divulgan a la empresa
│   │   │   └── nda-fallback-positions.md      # Posiciones de fallback de redline: qué conceder y qué mantener
│   │   ├── msa/
│   │   │   ├── msa-customer-paper.docx        # Acuerdo de Servicios Maestros — empresa como cliente
│   │   │   ├── msa-vendor-paper.docx          # MSA — empresa como proveedor/suministrador
│   │   │   └── msa-redline-guide.md           # Estrategia de redline por cláusula y posiciones de fallback
│   │   ├── sow/
│   │   │   ├── sow-template.docx              # Declaración de Trabajo — servicios, entregables, hitos, honorarios
│   │   │   └── sow-fixed-fee-template.docx    # Variante SOW de tarifa fija
│   │   ├── employment/
│   │   │   ├── offer-letter-template.docx     # Carta de oferta estándar — a voluntad, patrimonio, beneficios
│   │   │   ├── contractor-agreement.docx      # Acuerdo de contratista independiente — asignación de IP, CIIA
│   │   │   └── severance-template.docx        # Acuerdo de indemnización y liberación
│   │   └── vendor/
│   │       ├── vendor-dpa-template.docx       # Acuerdo de Procesamiento de Datos — compatible con Artículo 28 GDPR
│   │       ├── vendor-msa-template.docx       # MSA de proveedor con indemnidad, límite de responsabilidad, rescisión
│   │       └── vendor-security-addendum.docx  # Apéndice de seguridad y privacidad para proveedores que comparten datos
│   └── executed/
│       ├── ndas/
│       │   └── .gitkeep                       # NDAs ejecutadas por nombre de contraparte + fecha
│       ├── msas/
│       │   └── .gitkeep                       # MSAs ejecutadas — cliente y proveedor
│       └── dpas/
│           └── .gitkeep                       # DPAs ejecutadas — una por proveedor de procesamiento de datos
├── active-matters/
│   ├── _template/
│   │   ├── matter-summary.md                  # Nombre del asunto, tipo, fecha de apertura, abogado responsable, estado
│   │   ├── timeline.md                        # Registro de eventos cronológicos — fechas, acciones, partes
│   │   ├── docs/
│   │   │   └── .gitkeep                       # Documentos del asunto — demandas, correspondencia, evidencia
│   │   └── research/
│   │       └── .gitkeep                       # Memos de investigación específicos a este asunto
│   ├── employment-dispute-2026/
│   │   ├── matter-summary.md
│   │   ├── timeline.md
│   │   ├── docs/
│   │   │   ├── demand-letter-2026-03-15.pdf
│   │   │   ├── company-response-2026-03-28.pdf
│   │   │   └── mediation-brief-2026-05-01.docx
│   │   └── research/
│   │       ├── wrongful-termination-memo.md
│   │       └── at-will-exceptions-analysis.md
│   └── ip-ownership-review/
│       ├── matter-summary.md
│       ├── timeline.md
│       ├── docs/
│       │   └── contractor-ciia-review.docx
│       └── research/
│           └── work-for-hire-doctrine.md
├── compliance/
│   ├── regulatory-calendar.md                 # Todos los plazos regulatorios — GDPR, CCPA, SOC2, ISO — con propietarios
│   ├── gdpr/
│   │   ├── ropa.md                            # Registro de Actividades de Procesamiento — registro Artículo 30
│   │   ├── data-subjects-register.md          # Registro de sujetos de datos activos y registro de respuesta (plazos de 30 días seguidos)
│   │   ├── dpia-log.md                        # Evaluaciones de Impacto de Protección de Datos — una fila por proyecto
│   │   ├── breach-register.md                 # Registro de incidentes — fecha, alcance, estado de notificación de DPA
│   │   ├── transfer-mechanisms.md             # SCCs, decisiones de adecuación, BCRs en uso por ruta de transferencia
│   │   └── consent-records/
│   │       └── .gitkeep                       # Registros de captura de consentimiento por característica de producto
│   ├── soc2/
│   │   ├── evidence-tracker.md                # Mapa de evidencia SOC2 Tipo II — control, propietario, evidencia, estado
│   │   ├── controls-matrix.md                 # Conjunto completo de controles CC/A/P/C/PI con notas de implementación
│   │   ├── audit-log.md                       # Interacciones de auditor, muestras solicitadas, respuestas enviadas
│   │   └── evidence/
│   │       ├── access-reviews/
│   │       │   └── .gitkeep                   # Exportaciones trimestrales de revisión de acceso
│   │       └── vendor-reviews/
│   │           └── .gitkeep                   # Informes anuales de revisión de seguridad del proveedor
│   └── iso27001/
│       ├── isms-scope.md                      # Declaración de alcance ISMS y aplicabilidad
│       ├── risk-register.md                   # Registro de riesgo de seguridad de la información — riesgo, calificación, tratamiento
│       └── statement-of-applicability.md      # SOA — control, en alcance, estado de implementación
├── policies/
│   ├── data-classification-policy.md          # Tiers de clasificación de datos — público, interno, confidencial, restringido
│   ├── privacy-policy.md                      # Política de privacidad orientada al exterior — compatible con GDPR/CCPA
│   ├── acceptable-use-policy.md               # AUP — uso por empleados de sistemas de empresa y datos
│   ├── information-security-policy.md         # ISP — controles, respuesta a incidentes, gestión de acceso
│   ├── ai-use-policy.md                       # Herramientas IA aprobadas, usos prohibidos, reglas de manejo de datos
│   ├── ethics-code.md                         # Código de conducta — conflictos de interés, regalos, denunciante
│   ├── records-retention-policy.md            # Cronograma de retención por tipo de registro — procedimiento de retención legal
│   └── changelog.md                           # Historial de revisión de políticas — versión, fecha, autor, resumen de cambios
├── research/
│   ├── _template-memo.md                      # Formato de memo legal estándar — cuestión, regla, análisis, conclusión
│   ├── regulatory-guidance/
│   │   ├── gdpr-enforcement-tracker.md        # Acciones de ejecución de DPA y multas — registro continuo
│   │   ├── ccpa-amendments-summary.md         # Enmiendas CPRA y CCPA subsecuentes y fechas de vigencia
│   │   └── ai-regulation-watch.md             # EU AI Act, US EO on AI, NIST AI RMF — rastreador de estado
│   └── memos/
│       ├── 2026-05-open-source-license-risk.md
│       └── 2026-04-employee-monitoring-limits.md
└── ip/
    ├── trademark/
    │   ├── trademark-register.md              # Todas las marcas — palabra, logo, clases, jurisdicción, fechas de renovación
    │   └── filings/
    │       └── .gitkeep                       # Recibos de presentación de USPTO/EUIPO y acciones de oficina
    ├── patents/
    │   ├── patent-register.md                 # Cartera de patentes — # de solicitud, estado, jurisdicción, vencimiento
    │   └── .gitkeep
    └── oss-license-log.md                     # Inventario de componentes de código abierto — tipo de licencia, obligaciones, calificación de riesgo
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/contract-review.md` | Comando slash que toma un tipo de contrato (NDA, MSA, SOW, DPA, empleo) y texto del contrato, luego devuelve redlines marcados por riesgo, cláusulas estándar faltantes y un resumen de riesgo organizado por severidad |
| `.claude/commands/gdpr-check.md` | Comando slash que ejecuta un análisis de brechas GDPR/CCPA estructurado en un documento, descripción de proceso o característica de producto — genera brechas mapeadas a artículos específicos con remediación recomendada |
| `.claude/commands/vendor-diligence.md` | Comando slash para revisión de contrato de proveedor — verifica adecuación de DPA, límites de responsabilidad, indemnidad, eliminación de datos, derechos de auditoría y divulgación de subprocesador contra estándares internos |
| `.claude/commands/compliance-audit.md` | Comando slash que ejecuta una auditoría de lista de verificación estructurada (SOC2 CC, GDPR Capítulo IV, ISO 27001 Anexo A) y genera un informe de brechas con propietarios de control y requisitos de evidencia |
| `compliance/gdpr/ropa.md` | Registro de Actividades de Procesamiento Artículo 30 — requerido bajo GDPR — rastrea cada actividad de procesamiento, propósito, base legal, categorías de datos, destinatarios y período de retención |
| `compliance/soc2/evidence-tracker.md` | Mapea cada control SOC2 al artefacto de evidencia, propietario, frecuencia de recopilación y estado de auditoría — el rastreador maestro utilizado durante el trabajo de campo de auditoría Tipo II |
| `contracts/templates/vendor/vendor-dpa-template.docx` | DPA de papel de empresa para usar con todos los proveedores de procesamiento de datos — compatible con Artículo 28 GDPR, incluye SCCs como anexo para transferencias transfronterizas |
| `policies/changelog.md` | Historial de revisión para todas las políticas en policies/ — requerido para control de documentos ISO 27001 y revisión de política SOC2 |

## Andamiaje rápido

```bash
# Crear raíz de espacio de trabajo
mkdir -p legal-compliance-workspace

# Crear estructura .claude
mkdir -p legal-compliance-workspace/.claude/commands

# Crear árbol de directorios de contratos
mkdir -p legal-compliance-workspace/contracts/templates/nda
mkdir -p legal-compliance-workspace/contracts/templates/msa
mkdir -p legal-compliance-workspace/contracts/templates/sow
mkdir -p legal-compliance-workspace/contracts/templates/employment
mkdir -p legal-compliance-workspace/contracts/templates/vendor
mkdir -p legal-compliance-workspace/contracts/executed/ndas
mkdir -p legal-compliance-workspace/contracts/executed/msas
mkdir -p legal-compliance-workspace/contracts/executed/dpas

# Crear plantilla de asuntos activos
mkdir -p legal-compliance-workspace/active-matters/_template/docs
mkdir -p legal-compliance-workspace/active-matters/_template/research

# Crear directorios de cumplimiento
mkdir -p legal-compliance-workspace/compliance/gdpr/consent-records
mkdir -p legal-compliance-workspace/compliance/soc2/evidence/access-reviews
mkdir -p legal-compliance-workspace/compliance/soc2/evidence/vendor-reviews
mkdir -p legal-compliance-workspace/compliance/iso27001

# Crear directorios de políticas, investigación e IP
mkdir -p legal-compliance-workspace/policies
mkdir -p legal-compliance-workspace/research/regulatory-guidance
mkdir -p legal-compliance-workspace/research/memos
mkdir -p legal-compliance-workspace/ip/trademark/filings
mkdir -p legal-compliance-workspace/ip/patents

# Sembradores de marcadores de posición .gitkeep
touch legal-compliance-workspace/contracts/executed/ndas/.gitkeep
touch legal-compliance-workspace/contracts/executed/msas/.gitkeep
touch legal-compliance-workspace/contracts/executed/dpas/.gitkeep
touch legal-compliance-workspace/active-matters/_template/docs/.gitkeep
touch legal-compliance-workspace/active-matters/_template/research/.gitkeep
touch legal-compliance-workspace/compliance/gdpr/consent-records/.gitkeep
touch legal-compliance-workspace/compliance/soc2/evidence/access-reviews/.gitkeep
touch legal-compliance-workspace/compliance/soc2/evidence/vendor-reviews/.gitkeep
touch legal-compliance-workspace/ip/trademark/filings/.gitkeep
touch legal-compliance-workspace/ip/patents/.gitkeep

# Instalar habilidades legales
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/vendor-contract-review
npx claudient add skill legal/brief-section-drafter
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/legal-research

# Copiar stubs de comando en .claude/commands/
npx claudient add skill legal/contract-review --output legal-compliance-workspace/.claude/commands/contract-review.md
npx claudient add skill legal/nda-review --output legal-compliance-workspace/.claude/commands/nda-review.md
npx claudient add skill legal/gdpr-expert --output legal-compliance-workspace/.claude/commands/gdpr-check.md
npx claudient add skill legal/vendor-contract-review --output legal-compliance-workspace/.claude/commands/vendor-diligence.md
npx claudient add skill legal/soc2-compliance --output legal-compliance-workspace/.claude/commands/compliance-audit.md
npx claudient add skill legal/legal-research --output legal-compliance-workspace/.claude/commands/legal-research.md
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo Legal y Cumplimiento Normativo — Instrucciones de Claude Code

## Qué es esto

Este espacio de trabajo es el directorio de trabajo para abogados internos y oficiales de cumplimiento normativo.
Los contratos se organizan por tipo en contracts/, asuntos legales activos en active-matters/,
registros de cumplimiento regulatorio en compliance/, políticas de empresa en policies/ e investigación legal
memos en research/. Toda revisión de contratos, análisis GDPR, diligencia debida de proveedores y
redacción de políticas ocurre a través de habilidades de Claude Code.

## Stack

- Clio / Ironclad — Gestión de asuntos y ciclo de vida de contratos (sincronizar exportaciones a active-matters/)
- Westlaw / LexisNexis — Investigación legal primaria; citar fuentes en research/memos/ usando citas completas
- DocuSign — Enrutamiento de eSignature; registrar IDs de sobres en la carpeta de contrato correspondiente
- Microsoft 365 Word — Redlines y cambios rastreados; guardar versiones finales como .docx en contracts/
- Notion — Wiki de política; mantener policies/ sincronizado con Notion como fuente autoritaria
- Slack — Ingesta de solicitudes legales internas a través del canal #legal-requests

## Tareas comunes y comandos exactos

### Revisar un contrato entrante
```
/contract-review [type: NDA | MSA | SOW | DPA | employment | vendor]

Contract text:
[pega contrato completo o secciones clave]

Context:
- Counterparty: [nombre y rol — cliente, proveedor, socio, empleado]
- Our paper or their paper: [especifica]
- Deal size / risk level: [ARR aproximado o valor del contrato]
- Any known issues flagged by business: [opcional]
```

### Redlinar un NDA
```
/nda-review

NDA text:
[pega NDA completo]

Type: [mutual | one-way (we disclose) | one-way (they disclose)]
Counterparty: [nombre]
Purpose of disclosure: [qué se está compartiendo y por qué]
Any non-standard requests from counterparty: [opcional]
```

### Ejecutar un análisis de brechas GDPR/CCPA
```
/gdpr-check

Subject: [document | process | product feature | vendor]

Content:
[pega texto del documento, descripción de proceso o especificación de característica]

Jurisdiction focus: [GDPR | CCPA | both]
Data types involved: [categorías de datos personales — p. ej., salud, financiero, conductual]
```

### Revisar un contrato de proveedor y DPA
```
/vendor-diligence

Vendor: [nombre y descripción del servicio]
Contract type: [MSA | SaaS subscription | DPA | security addendum]

Contract text:
[pega contrato o secciones clave]

Vendor processes personal data: [yes | no]
Data categories: [lista si sí]
Sub-processors disclosed: [yes | no | unknown]
```

### Redactar o actualizar una política de empresa
```
/policy-draft

Policy: [data classification | acceptable use | privacy | AI use | records retention | ethics]
Action: [draft from scratch | update existing | add section]

Context:
[pega política existente si actualizas, o describe qué debe abordar la política]

Trigger: [qué requisito regulatorio o incidente provocó esta actualización]
```

### Escribir un memo de investigación legal
```
/legal-research

Issue: [pregunta legal precisa]
Jurisdiction: [US federal | California | EU | estado o país específico]
Context: [el escenario factico — 2-3 oraciones]
Urgency: [standard | expedited]
Output format: [IRAC memo | summary bullet points | regulation comparison table]
```

### Ejecutar una auditoría de cumplimiento estructurada
```
/compliance-audit

Framework: [SOC2 Type II | GDPR Chapter IV | ISO 27001 Annex A | CCPA]
Scope: [full | specific controls — lista IDs de control]
Evidence available: [describe qué registros, exportaciones y logs tienes disponibles]
Audit date or period: [fecha o rango de fechas]
```

## Convenciones a seguir

- Cada asunto activo debe tener matter-summary.md y timeline.md antes de agregar cualquier documento
- Todos los redlines se guardan como YYYY-MM-DD-counterparty-[type]-redline.docx en la carpeta de contratos
- El ropa.md de GDPR es el registro Artículo 30 — actualízalo cada vez que se aprueba una nueva actividad de procesamiento
- Los DSARs registrados en gdpr/data-subjects-register.md tienen un plazo de respuesta de 30 días — marca al recibir
- El evidence-tracker.md de SOC2 se actualiza al inicio de cada ciclo de trabajo de campo de auditoría — nunca sobrescribas el historial
- El changelog.md de política se actualiza cada vez que se revisa cualquier política en policies/ — versión + fecha requerida
- Los memos de investigación legal en research/memos/ siguen formato IRAC e incluyen citas completas de Westlaw/LexisNexis
- Los contratos ejecutados van en contracts/executed/ — nunca los dejes en active-matters/ de forma permanente
- Las fechas de renovación del registro de marca en IP trademark-register.md se revisan trimestralmente — marca renovaciones vencidas en 90 días
- Las obligaciones de licencia de OSS en ip/oss-license-log.md se revisan antes de que cualquier nuevo componente de código abierto se envíe
```

## Servidores MCP

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp-server"],
      "env": {
        "WESTLAW_API_KEY": "your-westlaw-api-key",
        "WESTLAW_CLIENT_ID": "your-client-id",
        "WESTLAW_BASE_URL": "https://api.westlaw.com/v1"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@slack/mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-slack-bot-token",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/legal-compliance-workspace"
      ]
    }
  }
}
```

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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"ropa.md\"; then echo \"[hook] ROPA updated — verify the new processing activity has a legal basis entry and a retention period before closing\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"policies/\"; then echo \"[hook] Policy file written — update policies/changelog.md with version, date, and summary of changes\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"breach-register.md\"; then echo \"[hook] CAUTION — writing to breach register. Confirm whether 72-hour DPA notification window applies before saving.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
# Habilidades legales principales
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/vendor-contract-review
npx claudient add skill legal/brief-section-drafter
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/legal-research

# Instalar todas las habilidades legales de una vez
npx claudient add skills legal
```

## Relacionado

- [Legal & Compliance guide](../guides/for-legal-compliance.md)
- [Contract review workflow](../workflows/contract-review-cycle.md)
- [GDPR compliance workflow](../workflows/gdpr-compliance.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
