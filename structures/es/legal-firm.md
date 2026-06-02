# Operaciones de Firma Jurídica / Práctica Legal — Estructura del Proyecto

> Para abogados y personal legal en una firma jurídica pequeña a mediana que gestiona captación de asuntos, investigación legal, redacción de documentos, facturación, comunicación con clientes, seguimiento de plazos y cumplimiento normativo — con el secreto profesional abogado-cliente aplicado en cada capa.

## Stack

- **Clio** — Gestión de asuntos, base de datos de contactos, seguimiento de tiempo, facturación, contabilidad fiduciaria, portal de cliente
- **Westlaw** o **LexisNexis** — Investigación legal primaria, recuperación de jurisprudencia, interpretación estatutaria, verificación KeyCite/Shepard's
- **Microsoft 365** — Word (redacción de documentos, control de cambios), Outlook (comunicaciones con clientes y abogados adversarios), Teams (colaboración interna)
- **NetDocuments** o **iManage** — Sistema de gestión de documentos (DMS); todos los archivos de asuntos y documentos privilegiados viven aquí exclusivamente
- **DocuSign** — Enrutamiento de firmas electrónicas para acuerdos ejecutados, cartas de compromiso, documentos de acuerdo
- **QuickBooks** — Contabilidad de la firma, reconciliación de cuenta operativa, cuentas por pagar, nómina
- **Claude Code** — Redacción de documentos, plantillas de memorandos de investigación, generación de listas de verificación, documentación de procedimientos de facturación, automatización de flujos de trabajo no privilegiados

## Árbol de directorios

```
legal-firm-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Avisos de privilegio, stack, comandos, convenciones
│   ├── settings.json                              # Servidores MCP, hooks, permisos de herramientas
│   └── commands/
│       ├── matter-intake.md                       # /matter-intake — generar lista de verificación de captación de nuevo asunto y solicitud de búsqueda de conflictos
│       ├── research-memo.md                       # /research-memo — crear estructura de memorándum de investigación legal con estructura IRAC
│       ├── draft-contract.md                      # /draft-contract [type] — borrador de primer paso de contrato a partir del tipo de asunto + términos clave
│       ├── redline-review.md                      # /redline-review — señalar cláusulas faltantes, términos unilaterales, disposiciones de riesgo
│       ├── billing-entry.md                       # /billing-entry — convertir notas a entradas de tiempo conforme a códigos de tareas ABA
│       ├── deadline-check.md                      # /deadline-check — superficie plazo de prescripción y plazos de docket de notas de asunto
│       ├── cite-check.md                          # /cite-check — señalar casos que requieren verificación KeyCite o Shepard's
│       └── client-update.md                       # /client-update — redactar carta de actualización de estado del cliente (sin hechos privilegiados en solicitud)
├── templates/
│   ├── contracts/
│   │   ├── nda-mutual.docx                        # NDA mutuo — confidencialidad bilateral, plazo estándar de 2 años
│   │   ├── nda-one-way.docx                       # NDA unilateral — parte reveladora favorecida
│   │   ├── services-agreement.docx                # Acuerdo maestro de servicios con anexo de declaración de trabajo
│   │   ├── independent-contractor.docx            # Acuerdo de contratista independiente con asignación de propiedad intelectual y no-solicitación
│   │   ├── asset-purchase.docx                    # Acuerdo de compra de activos con marcador de anexos
│   │   └── settlement-agreement.docx              # Acuerdo y liberación de responsabilidad — versiones general y conforme a ADEA
│   ├── litigation-docs/
│   │   ├── complaint-template.docx                # Demanda civil federal — encabezamiento, jurisdicción, acciones, petitorio
│   │   ├── answer-template.docx                   # Contestación con defensas afirmativas
│   │   ├── motion-to-dismiss.docx                 # Moción 12(b)(6) — secciones de argumentación etiquetadas
│   │   ├── summary-judgment-motion.docx           # Moción de sentencia sumaria con formato de declaración de hechos indisputados
│   │   ├── discovery-requests/
│   │   │   ├── interrogatories-plaintiff.docx     # Interrogatorios estándar del demandante, 25 solicitudes de admisión
│   │   │   ├── interrogatories-defendant.docx     # Interrogatorios estándar del demandado
│   │   │   ├── rfp-plaintiff.docx                 # Solicitudes de producción — conjunto demandante
│   │   │   └── rfp-defendant.docx                 # Solicitudes de producción — conjunto demandado
│   │   └── deposition-notice.docx                 # Aviso de deposición con anexo duces tecum
│   ├── corporate/
│   │   ├── articles-of-incorporation.docx         # Artículos de constitución de sociedad anónima Delaware shell
│   │   ├── bylaws-corporation.docx                # Estatutos corporativos — disposiciones estándar
│   │   ├── llc-operating-agreement.docx           # Variantes de acuerdo operativo LLC de un solo miembro y múltiples miembros
│   │   ├── board-consent.docx                     # Consentimiento escrito en lugar de reunión — acción de junta directiva
│   │   ├── shareholder-consent.docx               # Consentimiento escrito — acción de accionista
│   │   └── stock-purchase-agreement.docx          # Acuerdo de compra de acciones de series seed / ronda ángel con declaraciones
│   ├── employment/
│   │   ├── offer-letter-exempt.docx               # Carta de oferta exenta de FLSA con cláusula a voluntad
│   │   ├── offer-letter-nonexempt.docx            # Carta de oferta no exenta con aviso de tiempo extra
│   │   ├── separation-agreement.docx              # Acuerdo de liquidación y liberación de responsabilidad — período de consideración de 21 días
│   │   ├── noncompete-agreement.docx              # Acuerdo de no-competencia específico por jurisdicción (señalar jurisdicción)
│   │   └── employee-handbook-shell.docx           # Secciones de políticas: PTO, acoso, código de conducta
│   └── real-estate/
│       ├── purchase-agreement-residential.docx    # PSA residencial con párrafos de contingencia
│       ├── purchase-agreement-commercial.docx     # PSA comercial con período de diligencia debida
│       ├── lease-commercial.docx                  # Arrendamiento comercial NNN — favorable al propietario
│       ├── lease-residential.docx                 # Arrendamiento residencial — estructura agnóstica de jurisdicción
│       └── closing-checklist.docx                 # Lista de verificación de cierre de bienes raíces con pasos de título y depósito en garantía
├── research/
│   ├── memo-template.md                           # Formato de memorándum IRAC: Asunto, Regla, Análisis, Conclusión
│   ├── case-law-notes/
│   │   ├── _index.md                              # Índice actualizado de casos citados por tema
│   │   ├── contracts/                             # Resúmenes de casos de derecho contractual y conclusiones
│   │   ├── employment/                            # Notas de casos de derecho laboral
│   │   ├── corporate/                             # Derecho de gobierno corporativo
│   │   └── litigation/                            # Notas de casos procedimentales y de prueba
│   └── regulatory-summaries/
│       ├── state-noncompete-map.md                # Gráfico de aplicabilidad estado por estado (fecha de última actualización requerida)
│       ├── data-privacy-overview.md               # Panorama CCPA, legislación estatal — sin detalles específicos del cliente
│       └── bar-admission-rules.md                 # Requisitos pro hac vice por jurisdicción
├── checklists/
│   ├── matter-opening.md                          # Nuevo asunto: búsqueda de conflictos, carta de compromiso, retención, configuración de Clio
│   ├── conflicts-check.md                         # Protocolo de búsqueda de conflictos paso a paso en Clio + divulgaciones de contratación lateral
│   ├── due-diligence.md                           # Debida diligencia M&A / transaccional — organizacional, propiedad intelectual, litigio, contratos
│   ├── closing.md                                 # Lista de verificación de cierre de transacción — pre-cierre, día de cierre, post-cierre
│   ├── litigation-hold.md                         # Pasos de aviso de retención de litigio y requisitos de preservación de documentos
│   └── matter-closing.md                          # Cierre de archivo: facturación final, documentos ejecutados a DMS, aviso de retención de archivo
├── billing/
│   ├── time-entry-sops.md                         # Códigos de tareas ABA, códigos UTBMS, directrices narrativas, incrementos mínimos
│   ├── invoice-review-checklist.md                # Revisión previa a la facturación: cancelaciones, verificación de tarifa, calidad narrativa, fiduciario
│   ├── rate-schedule.md                           # Tarifas de cronometrador por función (socio, asociado, asistente legal, pasante)
│   └── trust-accounting-quick-ref.md              # Reglas de depósito/desembolso IOLTA, recordatorio de conciliación de tres vías
├── compliance/
│   ├── bar-requirements.md                        # Créditos CLE, plazos de inscripción anual por jurisdicción
│   ├── trust-accounting-sop.md                    # SOP completo IOLTA: reglas de depósito, desembolso, conciliación, pista de auditoría
│   ├── malpractice-checklist.md                   # Alcance del compromiso, diarios de plazos, conflictos, retención de archivos
│   ├── conflicts-policy.md                        # Política de conflictos de la firma: lateral, cliente prospectivo, descalificación imputada
│   └── data-security-policy.md                    # Política de contraseña, controles de acceso DMS, pasos de respuesta ante incidentes
└── marketing/
    ├── bio-templates.md                           # Formato de biografía de abogado: educación, admisiones al colegio de abogados, áreas de práctica, publicaciones
    ├── practice-area-descriptions.md              # Descripciones de área de práctica listas para web — revisar cumplimiento de reglas de publicidad
    └── client-alert-template.md                   # Formato de alerta legislativa/regulatoria para distribución a clientes
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/CLAUDE.md` | Aviso de privilegio, descripción general del stack, índice de comandos, reglas de confidencialidad — leer antes de cada sesión |
| `.claude/commands/matter-intake.md` | Genera la lista de verificación completa de nuevo asunto: pasos de búsqueda de conflictos, desencadenante de carta de compromiso, configuración de asunto en Clio, recopilación de retención |
| `.claude/commands/billing-entry.md` | Convierte notas de tiempo sin formato a narrativas conforme a códigos de tareas ABA; aplica incremento mínimo de la firma y reglas de calidad narrativa |
| `checklists/matter-opening.md` | Procedimiento autorizado paso a paso de apertura de asunto — conflictos, carta de compromiso, retención, creación de carpeta DMS |
| `checklists/conflicts-check.md` | Protocolo de búsqueda de conflictos estructurado que cubre base de datos Clio, partes adversarias, pantallas de contratación lateral |
| `billing/time-entry-sops.md` | Códigos de tareas UTBMS/ABA, incremento de facturación mínimo, narrativa de requisitos y prohibiciones — la guía de estilo de facturación |
| `compliance/trust-accounting-sop.md` | SOP IOLTA completo: qué va en fiduciario, controles de desembolso, conciliación de tres vías, preparación para auditoría del colegio de abogados |
| `research/memo-template.md` | Estructura de memorándum de investigación legal IRAC — aplica recordatorio de verificación de citas antes de finalizar |
| `templates/litigation-docs/complaint-template.docx` | Estructura de demanda civil federal con encabezamiento, alegaciones de jurisdicción, causas de acción y petitorio |
| `compliance/malpractice-checklist.md` | Controles de riesgo de negligencia previa y en curso: documentación de alcance, diarios de plazos, actualización de conflictos, retención de archivos |

## Andamio rápido

```bash
# Crear raíz del espacio de trabajo
mkdir -p legal-firm-workspace && cd legal-firm-workspace

# Directorio .claude y comandos
mkdir -p .claude/commands

# Plantillas por tipo de asunto
mkdir -p templates/contracts
mkdir -p templates/litigation-docs/discovery-requests
mkdir -p templates/corporate
mkdir -p templates/employment
mkdir -p templates/real-estate

# Investigación
mkdir -p research/case-law-notes/contracts
mkdir -p research/case-law-notes/employment
mkdir -p research/case-law-notes/corporate
mkdir -p research/case-law-notes/litigation
mkdir -p research/regulatory-summaries

# Listas de verificación
mkdir -p checklists

# Facturación
mkdir -p billing

# Cumplimiento
mkdir -p compliance

# Marketing
mkdir -p marketing

# Archivos markdown de andamio clave
touch checklists/matter-opening.md
touch checklists/conflicts-check.md
touch checklists/due-diligence.md
touch checklists/closing.md
touch checklists/litigation-hold.md
touch checklists/matter-closing.md

touch billing/time-entry-sops.md
touch billing/invoice-review-checklist.md
touch billing/rate-schedule.md
touch billing/trust-accounting-quick-ref.md

touch compliance/bar-requirements.md
touch compliance/trust-accounting-sop.md
touch compliance/malpractice-checklist.md
touch compliance/conflicts-policy.md
touch compliance/data-security-policy.md

touch research/memo-template.md
touch research/case-law-notes/_index.md
touch research/regulatory-summaries/state-noncompete-map.md
touch research/regulatory-summaries/data-privacy-overview.md
touch research/regulatory-summaries/bar-admission-rules.md

touch marketing/bio-templates.md
touch marketing/practice-area-descriptions.md
touch marketing/client-alert-template.md

# Comandos .claude
touch .claude/commands/matter-intake.md
touch .claude/commands/research-memo.md
touch .claude/commands/draft-contract.md
touch .claude/commands/redline-review.md
touch .claude/commands/billing-entry.md
touch .claude/commands/deadline-check.md
touch .claude/commands/cite-check.md
touch .claude/commands/client-update.md

# Instalar habilidades Claudient relevantes
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator

echo "Andamio completado. Completa CLAUDE.md antes del primer uso."
```

## Plantilla CLAUDE.md

```markdown
# Operaciones de Firma Jurídica / Práctica Legal — Espacio de Trabajo

## AVISO DE SECRETO PROFESIONAL ABOGADO-CLIENTE Y CONFIDENCIALIDAD

**Este espacio de trabajo NO contiene detalles de asuntos de cliente, hechos de casos o comunicaciones privilegiadas.**

Todos los archivos de asuntos, documentos del cliente, correspondencia, memorandos de investigación vinculados a asuntos activos
y cualquier contenido protegido por secreto profesional abogado-cliente o doctrina de producto del trabajo se almacenan
exclusivamente en el Sistema de Gestión de Documentos (DMS) de la firma:
- NetDocuments: https://vault.netdocuments.com
- iManage: https://app.imanage.com

NO pegues nombres de clientes, números de asunto vinculados a casos reales, nombres de partes adversarias, hechos de casos,
cifras de acuerdos o cualquier contenido privilegiado en solicitudes de Claude Code. Este espacio de trabajo
es solo para plantillas, procedimientos operativos estándar, listas de verificación y contenido no específico de asunto.

Cuando tengas dudas: si aparecería en un registro de privilegios, no pertenece aquí.

---

## Qué Es Este Espacio de Trabajo

Un espacio de trabajo de operaciones no privilegiado para la firma. Abogados y personal lo utilizan para:
- Redactar y mantener plantillas de documentos (contratos, estructuras de litigio, formularios corporativos)
- Ejecutar flujos de trabajo de facturación y entrada de tiempo usando códigos de tareas ABA
- Gestionar plazos de cumplimiento (CLE, reconciliación IOLTA, lista de verificación de negligencia)
- Producir andamios de memorandos de investigación (estructura IRAC, recordatorios de verificación de citas)
- Mantener contenido de marketing de la firma (biografías, descripciones de áreas de práctica)

Todos los comandos operan en plantillas y procedimientos operativos estándar — nunca en datos de cliente en vivo.

---

## Stack

- **Clio** — Gestión de asuntos, seguimiento de tiempo, facturación, contabilidad fiduciaria, portal de cliente
- **Westlaw / LexisNexis** — Investigación legal; todos los casos citados deben ser KeyCitados o Shepardizados antes de usar
- **Microsoft 365** — Word (redacción/control de cambios), Outlook (comunicaciones del cliente), Teams (interno)
- **NetDocuments / iManage** — DMS; todos los archivos de asuntos privilegiados almacenados aquí
- **DocuSign** — Enrutamiento y almacenamiento de acuerdos ejecutados
- **QuickBooks** — Cuenta operativa de la firma, nómina, cuentas por pagar

---

## Comandos de Barra Inclinada

| Comando | Qué hace |
|---|---|
| `/matter-intake` | Genera lista de verificación de nuevo asunto: conflictos, carta de compromiso, retención, configuración de Clio |
| `/research-memo` | Crea andamio de memorándum IRAC con recordatorio de verificación de citas y marcador de fuente |
| `/draft-contract [type]` | Borrador de primer paso de contrato de tipo (NDA, MSA, OA, PSA) + términos clave |
| `/redline-review` | Revisa lenguaje de contrato pegado para cláusulas faltantes y términos unilaterales |
| `/billing-entry` | Convierte notas de tiempo sin formato a entradas narrativas conforme a ABA/UTBMS |
| `/deadline-check` | Superficie plazo de prescripción, plazos de respuesta y fechas de docket de notas |
| `/cite-check` | Señala casos en un memorándum que requieren verificación KeyCite o Shepard's |
| `/client-update` | Redacta carta de actualización de estado del cliente — sin hechos de asunto privilegiados en la solicitud |

---

## Requisito de Verificación de Citas

Cualquier memorándum de investigación legal o sección de escrito producida por Claude Code es SOLO UN BORRADOR.
Toda cita de caso debe verificarse en Westlaw KeyCite o LexisNexis Shepard's antes
de que el documento salga de la firma. Claude Code no tiene acceso en vivo a bases de datos de jurisprudencia
y no puede confirmar si un caso ha sido anulado, distinguido o limitado.

Agrega este pie de página a cada resultado de investigación: "BORRADOR — TODAS LAS CITAS REQUIEREN VERIFICACIÓN KEYCITE/SHEPARD'S ANTES DE USAR"

---

## Convenciones de Facturación

- Incremento de facturación mínimo: 0.1 horas (6 minutos)
- Usar códigos de tareas UTBMS: L100–L500 para litigio; A100–A300 para corporativo/transaccional
- Las narrativas de entrada de tiempo deben describir el trabajo realizado, no solo la categoría de tarea
- Las entradas de cuenta fiduciaria requieren número de asunto y referencia de autorización del cliente
- Revisión previa a la facturación: ejecuta la salida de `/billing-entry` a través de invoice-review-checklist.md antes de enviar

---

## Protocolo de Búsqueda de Conflictos

Antes de abrir cualquier nuevo asunto, ejecuta una búsqueda de conflictos contra:
1. Base de datos de contactos Clio (nombre del cliente, parte adversaria, entidades relacionadas)
2. Lista de divulgación de contratación lateral (mantenida por gerente de oficina)
3. Registro de entrada de cliente prospectivo

Documenta el resultado de la búsqueda de conflictos en Clio antes de que se envíe la carta de compromiso.
Consulta checklists/conflicts-check.md para el procedimiento completo.

---

## Retención de Archivos y Cierre de Asunto

Los archivos de asuntos cerrados se retienen según el cronograma de retención de la firma (ver compliance/malpractice-checklist.md).
Los archivos físicos y electrónicos se mueven a la carpeta de archivo DMS al cierre del asunto.
No almacenes documentos de asuntos cerrados en este espacio de trabajo.
```

## Servidores MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/Users/shared/legal-firm-workspace"],
      "comment": "Con alcance solo a raíz del espacio de trabajo — sin acceso a puntos de montaje DMS o recursos compartidos de archivos de cliente"
    },
    "microsoft-365": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-msgraph"],
      "env": {
        "TENANT_ID": "${M365_TENANT_ID}",
        "CLIENT_ID": "${M365_CLIENT_ID}",
        "CLIENT_SECRET": "${M365_CLIENT_SECRET}"
      },
      "comment": "Acceso a canales de Teams, borradores de Outlook, biblioteca de plantillas SharePoint — con alcance a inquilino de firma"
    },
    "clio": {
      "command": "npx",
      "args": ["-y", "@clio/mcp-server"],
      "env": {
        "CLIO_CLIENT_ID": "${CLIO_CLIENT_ID}",
        "CLIO_CLIENT_SECRET": "${CLIO_CLIENT_SECRET}",
        "CLIO_REGION": "us"
      },
      "comment": "Acceso de solo lectura a lista de asuntos, base de datos de contactos y códigos de entrada de tiempo — sin acceso de escritura a cuentas fiduciarias"
    },
    "docusign": {
      "command": "npx",
      "args": ["-y", "@docusign/mcp-server"],
      "env": {
        "DOCUSIGN_ACCOUNT_ID": "${DOCUSIGN_ACCOUNT_ID}",
        "DOCUSIGN_INTEGRATION_KEY": "${DOCUSIGN_INTEGRATION_KEY}",
        "DOCUSIGN_BASE_URL": "https://na3.docusign.net/restapi"
      },
      "comment": "Búsqueda de estado de sobre y recuperación de plantilla solo — sin capacidad de envío desde Claude Code"
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
            "command": "grep -i 'privilege\\|confidential\\|attorney.client\\|work product' \"$CLAUDE_TOOL_OUTPUT_PATH\" && echo '[WARN] Contenido potencialmente privilegiado detectado en archivo escrito — revisar antes de guardar' || true",
            "comment": "Escanea cualquier archivo escrito por Claude Code para palabras clave de privilegio y muestra una advertencia"
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
            "command": "echo '[CHECK] Escribiendo en: '\"$CLAUDE_TOOL_INPUT_PATH\"' — confirma que esto es un archivo de plantilla o SOP, no un documento de asunto'",
            "comment": "Registra cada escritura de archivo con un recordatorio para confirmar que es contenido no privilegiado"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[REMINDER] Fin de sesión — cualquier memorándum de investigación redactado requiere verificación de citas en Westlaw KeyCite o LexisNexis Shepards antes de usar'",
            "comment": "Muestra el recordatorio de verificación de citas al final de cada sesión de Claude Code"
          }
        ]
      }
    ]
  }
}
```

## Habilidades para instalar

```bash
# Flujos de trabajo de documentos y procesos
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator

# Investigación y análisis
npx claudient add skill productivity/exec-briefing

# Desarrollo de clientes y negocios
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill productivity/investor-update

# Facturación y gestión del tiempo
npx claudient add skill productivity/engineering-strategy
```

## Relacionado

- [Guía de Espacio de Trabajo Legal y Cumplimiento](../structures/legal-compliance-workspace.md)
- [Espacio de Trabajo de Gerente de Operaciones](../structures/operations-manager-workspace.md)
- [Espacio de Trabajo de Analista de Finanzas](../structures/finance-analyst-workspace.md)

---

🔗 **[Uitbreiden — construcción de productos de IA y herramientas B2B con comunidades de desarrolladores.](https://uitbreiden.com/)**
📺 **[Suscríbete a nuestro Canal de YouTube para más análisis profundos](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
