# Espacio de Trabajo de Analista Financiero / CFO — Estructura del Proyecto

> Para un analista financiero o CFO que gestiona modelado financiero, cierre mensual, creación de paquetes para juntas directivas, planificación de escenarios e informes a inversores — todo impulsado desde un único espacio de trabajo de Claude Code.

## Stack

- Excel / Google Sheets — modelos de 3 estados financieros, DCF, presupuesto vs real, modelos de escenarios
- QuickBooks, Xero o NetSuite — libro mayor general, AP/AR, asientos contables, balance de prueba
- Notion o Confluence — políticas contables, listas de verificación de cierre, documentación del equipo
- Carta — tabla de capitalización, reserva de opciones, modelado de dilución, datos 409A
- Slack — coordinación del proceso de cierre, comunicación de preparación de juntas, preguntas de inversores
- PowerPoint o Google Slides — presentaciones para juntas, actualizaciones a inversores, informes de gestión

## Árbol de directorios

```
finance-analyst-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones del espacio de trabajo para Claude Code
│   ├── settings.json                          # Permisos, hooks, configuración MCP
│   └── commands/
│       ├── variance-analysis.md               # Informe de varianza de período — presupuesto vs real con comentario
│       ├── model-update.md                    # Actualizar modelo de 3 estados con datos reales más recientes
│       ├── board-pack.md                      # Compilar presentación para junta — financieros, KPIs, narrativa
│       ├── close-checklist.md                 # Lista de tareas de cierre de fin de mes con seguimiento de estado
│       ├── scenario-model.md                  # Planificación de escenarios — casos base / alcista / bajista
│       ├── investor-update.md                 # Carta de actualización a inversores — métricas, narrativa, solicitudes
│       └── budget-reforecast.md               # Revisión trimestral — vista acumulada de 4 trimestres con supuestos
├── models/
│   ├── 3-statement/
│   │   ├── 3-statement-model-2025.xlsx        # Modelo integrado de P&L, balance y flujo de caja
│   │   ├── 3-statement-model-2024.xlsx        # Modelo del año anterior — referencia archivada
│   │   ├── assumptions-log.md                 # Supuestos clave y cambios históricos
│   │   └── monthly-actuals-feed.csv           # Exportación de QuickBooks/Xero para actualizaciones de modelo
│   ├── dcf/
│   │   ├── dcf-model-current.xlsx             # Flujo de caja descontado — WACC, valor terminal, TIR
│   │   ├── wacc-calculation.xlsx              # Cálculo WACC — costo de capital, costo de deuda, beta
│   │   ├── sensitivity-table.xlsx             # Salida de tabla de sensibilidad de crecimiento de ingresos vs margen EBITDA
│   │   └── dcf-assumptions.md                 # Narrativa detrás de insumos DCF — crecimiento, márgenes, WACC
│   ├── budget-vs-actual/
│   │   ├── bva-2025-ytd.xlsx                  # Presupuesto vs real YTD por centro de costo y línea
│   │   ├── bva-template.xlsx                  # Plantilla BvA en blanco para nuevos períodos
│   │   ├── variance-commentary-jan-2025.md    # Narrativa de varianza — paquete de gestión enero 2025
│   │   ├── variance-commentary-feb-2025.md    # Narrativa de varianza — paquete de gestión febrero 2025
│   │   ├── variance-commentary-mar-2025.md    # Narrativa de varianza — paquete de gestión marzo 2025
│   │   └── variance-threshold-policy.md       # Política: qué % de varianza desencadena comentario obligatorio
│   └── scenario/
│       ├── scenario-model-q2-2025.xlsx        # Modelo de escenario base / alcista / bajista — Q2 2025
│       ├── scenario-model-q3-2025.xlsx        # Modelo de escenario Q3 2025 — actualizado tras cierre
│       ├── macro-assumptions.md               # Supuestos externos: tasas, FX, condiciones de mercado
│       └── scenario-summary-template.xlsx     # Resumen de escenario de una página para juntas e inversores
├── reports/
│   ├── board-packs/
│   │   ├── board-pack-q1-2025.pptx            # Paquete para junta Q1 2025 — financieros + KPIs + narrativa
│   │   ├── board-pack-q2-2025.pptx            # Paquete para junta Q2 2025
│   │   ├── board-pack-template.pptx           # Plantilla maestra — diseño aprobado y marca
│   │   └── board-pack-data-q2-2025.xlsx       # Archivo de datos de soporte para gráficos de paquete Q2
│   ├── investor-updates/
│   │   ├── investor-update-may-2025.md        # Carta de actualización mensual a inversores — mayo 2025
│   │   ├── investor-update-jun-2025.md        # Carta de actualización mensual a inversores — junio 2025
│   │   ├── investor-update-template.md        # Plantilla estándar de carta de actualización a inversores
│   │   └── investor-list.md                   # Registro actual de inversores — nombres, % de participación, contacto
│   └── management-reporting/
│       ├── management-package-jan-2025.xlsx   # Paquete de gestión mensual enero 2025
│       ├── management-package-feb-2025.xlsx   # Paquete de gestión mensual febrero 2025
│       ├── management-package-mar-2025.xlsx   # Paquete de gestión mensual marzo 2025
│       └── management-package-template.xlsx   # Plantilla estándar de paquete de gestión
├── close/
│   ├── month-end-close-checklist.md           # Lista maestra de tareas de cierre de fin de mes con propietarios
│   ├── close-calendar-2025.md                 # Fechas de cierre duro, fechas de cierre suave, fechas de juntas
│   ├── journal-entries/
│   │   ├── je-template.csv                    # Formato estándar de carga JE para QuickBooks/Xero
│   │   ├── accruals-jan-2025.csv              # Asientos contables de provisión para enero 2025
│   │   ├── accruals-feb-2025.csv              # Asientos contables de provisión para febrero 2025
│   │   ├── accruals-mar-2025.csv              # Asientos contables de provisión para marzo 2025
│   │   └── prepaid-amortization-schedule.xlsx # Plan de gastos pagados por adelantado con amortización mensual
│   ├── reconciliations/
│   │   ├── bank-recon-jan-2025.xlsx           # Conciliación bancaria — enero 2025
│   │   ├── bank-recon-feb-2025.xlsx           # Conciliación bancaria — febrero 2025
│   │   ├── ar-aging-jan-2025.xlsx             # Informe de antigüedad de CxC — enero 2025
│   │   ├── ar-aging-feb-2025.xlsx             # Informe de antigüedad de CxC — febrero 2025
│   │   ├── intercompany-recon.xlsx            # Eliminaciones intercompañía — si aplica
│   │   └── gl-recon-checklist.md              # Lista de verificación de conciliación de cuenta GL y confirmaciones
│   └── trial-balance/
│       ├── tb-jan-2025.csv                    # Balance de prueba exportado — enero 2025
│       ├── tb-feb-2025.csv                    # Balance de prueba exportado — febrero 2025
│       └── tb-mapping.xlsx                    # Asignación del catálogo de cuentas a estados financieros
├── budgets/
│   ├── annual/
│   │   ├── budget-2025.xlsx                   # Presupuesto operativo aprobado por junta — FY2025
│   │   ├── budget-2025-assumptions.md         # Narrativa detrás de líneas del presupuesto FY2025
│   │   ├── budget-2026-draft.xlsx             # Presupuesto FY2026 borrador — en progreso
│   │   └── budget-approval-log.md             # Fechas de aprobación de junta, historial de revisiones, firmantes
│   └── reforecasts/
│       ├── reforecast-q1-2025.xlsx            # Revisión Q1 2025 — vista acumulada de 4 trimestres
│       ├── reforecast-q2-2025.xlsx            # Revisión Q2 2025
│       ├── reforecast-q3-2025.xlsx            # Revisión Q3 2025
│       └── reforecast-assumptions.md          # Registro actualizado de cambios de supuestos en revisiones
├── compliance/
│   ├── audit/
│   │   ├── audit-prep-checklist.md            # Preparación para auditoría de fin de año — lista PBC y estado
│   │   ├── pbc-2024.xlsx                      # Horario preparado por cliente — auditoría FY2024
│   │   ├── audit-adjustments-2024.xlsx        # Ajustes propuestos por auditor y respuestas de gestión
│   │   └── auditor-contact.md                 # Nombre del auditor, equipo de compromiso, detalles de contacto
│   ├── tax/
│   │   ├── tax-calendar-2025.md               # Fechas de presentación federal y estatal — FY2025
│   │   ├── r-and-d-credit-analysis.xlsx       # Análisis de calificación de crédito fiscal I+D
│   │   ├── state-nexus-tracker.md             # Estados con nexo — estado de registro y presentación
│   │   └── 83b-elections-log.md               # Registro de elecciones 83(b) presentadas por fundadores/empleados
│   └── regulatory/
│       ├── 409a-valuation-current.pdf         # Informe de valuación 409A actual
│       ├── 409a-history.md                    # Historial de valuación 409A — fechas, proveedores, FMVs
│       └── irs-correspondence/                # Avisos del IRS y respuestas — un archivo por aviso
├── docs/
│   ├── accounting-policies.md                 # Políticas contables formales — reconocimiento de ingresos, capex, etc.
│   ├── chart-of-accounts.xlsx                 # COA completo con códigos de cuenta, tipos, descripciones
│   ├── revenue-recognition-policy.md          # Documento de política de reconocimiento de ingresos ASC 606
│   ├── expense-policy.md                      # Política de gastos y reembolsos de empleados
│   ├── equity-compensation-summary.md         # Resumen de compensación en acciones — planes de opciones, concesiones, calendarios de consolidación, resumen Carta
│   └── glossary.md                            # Glosario del equipo financiero — abreviaturas y definiciones
└── cap-table/
    ├── cap-table-current.xlsx                 # Tabla de capitalización actual completamente diluida — sincronizada desde Carta
    ├── option-pool-analysis.xlsx              # Análisis de suficiencia y renovación de reserva de opciones
    ├── dilution-scenarios.xlsx                # Modelado de dilución — Series A, B, conversiones SAFE
    └── 409a-strike-price-log.md              # Historial de precio de ejercicio por fecha de concesión
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/variance-analysis.md` | Comando slash que toma un argumento de período (ej. `may-2025`), lee el archivo BvA correspondiente de `models/budget-vs-actual/`, y genera comentario de varianza ejecutivo con explicaciones de línea |
| `.claude/commands/board-pack.md` | Comando slash que compila los financieros del trimestre actual, tendencias de KPI y resumen de escenario en narrativa y notas de presentador lista para junta |
| `.claude/commands/close-checklist.md` | Comando slash que genera una lista de tareas de cierre de fin de mes prepoblada con propietarios, fechas de vencimiento e items que se llevan adelante del cierre anterior |
| `models/3-statement/3-statement-model-2025.xlsx` | Modelo financiero integrado maestro — las actualizaciones a datos reales fluyen a través de P&L hacia balance hacia flujo de caja; fuente de verdad para todos los informes |
| `close/month-end-close-checklist.md` | Lista de cierre activa con propietario de tarea, estado (abierto/completo/bloqueado), y fecha de vencimiento por paso; actualizada cada ciclo de cierre |
| `budgets/annual/budget-2025.xlsx` | Presupuesto operativo aprobado por junta; nunca se modifica post-aprobación — las varianzas se explican contra esta línea base |
| `compliance/audit/audit-prep-checklist.md` | Lista de verificación PBC (preparado por cliente) para auditoría de fin de año; rastrea estado de documentos y confirmación de recepción por auditor |
| `reports/investor-updates/investor-update-template.md` | Formato estándar de carta a inversores: métricas principales, narrativa, hitos clave, solicitudes — utilizado en cada actualización mensual |
| `docs/chart-of-accounts.xlsx` | COA canónico — cualquier nueva cuenta añadida a QuickBooks/Xero/NetSuite debe reflejarse aquí con asignación correcta a estado financiero |
| `cap-table/cap-table-current.xlsx` | Tabla de capitalización completamente diluida exportada desde Carta; sustenta modelado de dilución, insumos 409A e informes a juntas |

## Andamio rápido

```bash
# Crear la raíz del espacio de trabajo
mkdir -p finance-analyst-workspace
cd finance-analyst-workspace

# Crear estructura .claude
mkdir -p .claude/commands

# Crear directorios del espacio de trabajo
mkdir -p models/3-statement
mkdir -p models/dcf
mkdir -p models/budget-vs-actual
mkdir -p models/scenario
mkdir -p reports/board-packs
mkdir -p reports/investor-updates
mkdir -p reports/management-reporting
mkdir -p close/journal-entries
mkdir -p close/reconciliations
mkdir -p close/trial-balance
mkdir -p budgets/annual
mkdir -p budgets/reforecasts
mkdir -p compliance/audit
mkdir -p compliance/tax
mkdir -p compliance/regulatory/irs-correspondence
mkdir -p docs
mkdir -p cap-table

# Sembrar archivos clave
touch models/3-statement/assumptions-log.md
touch models/budget-vs-actual/variance-threshold-policy.md
touch close/month-end-close-checklist.md
touch close/close-calendar-2025.md
touch close/gl-recon-checklist.md
touch close/reconciliations/gl-recon-checklist.md
touch budgets/annual/budget-2025-assumptions.md
touch budgets/annual/budget-approval-log.md
touch budgets/reforecasts/reforecast-assumptions.md
touch compliance/audit/audit-prep-checklist.md
touch compliance/tax/tax-calendar-2025.md
touch compliance/tax/state-nexus-tracker.md
touch docs/accounting-policies.md
touch docs/revenue-recognition-policy.md
touch docs/expense-policy.md
touch docs/equity-compensation-summary.md
touch docs/glossary.md
touch cap-table/409a-strike-price-log.md
touch reports/investor-updates/investor-update-template.md

# Sembrar .claude/commands
touch .claude/commands/variance-analysis.md
touch .claude/commands/model-update.md
touch .claude/commands/board-pack.md
touch .claude/commands/close-checklist.md
touch .claude/commands/scenario-model.md
touch .claude/commands/investor-update.md
touch .claude/commands/budget-reforecast.md

# Instalar habilidades de Claude Code
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/dcf-model
npx claudient add skill finance/budget-vs-actual
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/financial-plan
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/comps-analysis
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo de Analista Financiero / CFO

Este espacio de trabajo soporta operaciones financieras: actualizaciones de modelo, cierre mensual, creación de paquetes para juntas,
planificación de escenarios, informes a inversores y preparación de auditoría — todo impulsado por archivos estructurados y comandos slash.

---

## Qué es esto

Un espacio de trabajo de Claude Code estructurado para un analista financiero o CFO. Cada directorio se asigna a una
función financiera distinta. Claude Code lee datos reales, presupuestos y archivos de política para producir
resultados precisos y específicos de la organización — no asesoramiento financiero genérico.

---

## Stack

- Excel / Google Sheets — modelos financieros, BvA, escenarios (archivos viven en models/)
- QuickBooks / Xero / NetSuite — GL, AP/AR, balance de prueba (exportaciones viven en close/trial-balance/)
- Notion / Confluence — políticas contables, documentos de cierre (docs/)
- Carta — datos de tabla de capitalización y equidad (cap-table/)
- Slack — coordinación de cierre, preguntas a inversores (MCP: slack)
- PowerPoint / Google Slides — presentaciones para juntas, actualizaciones a inversores (reports/)

---

## Convenciones de directorios

- `models/` — Todos los modelos financieros. No almacenar aquí exportaciones solo de datos reales; esos van en close/.
- `close/` — Artefactos de cierre de fin de mes. Un subdirectorio por área de proceso: journal-entries/, reconciliations/, trial-balance/.
- `budgets/` — Presupuesto aprobado por junta en budgets/annual/. Revisiones en budgets/reforecasts/. Nunca sobrescribir el archivo de presupuesto aprobado.
- `reports/` — Salidas. Paquetes para juntas en board-packs/, cartas a inversores en investor-updates/, paquetes de gestión en management-reporting/.
- `compliance/` — Auditoría PBC, presentaciones de impuestos, documentos regulatorios. No almacenar aquí a menos que sea final o casi final.
- `docs/` — Documentos de política y material de referencia. Mantener accounting-policies.md y chart-of-accounts.xlsx actuales.
- `cap-table/` — Exportaciones de Carta y modelado de equidad. Refrescar cap-table-current.xlsx después de cada concesión o evento de financiamiento.

---

## Tareas comunes — comandos exactos

### Informes de varianza y cierre
```
/variance-analysis may-2025   — Lee models/budget-vs-actual/bva-2025-ytd.xlsx, genera
                                comentario de varianza de línea para el período dado
/close-checklist              — Genera lista de tareas de cierre de fin de mes con propietarios y fechas de vencimiento
/model-update                 — Actualiza modelo de 3 estados con exportación de balance de prueba más reciente
```

### Informes a juntas e inversores
```
/board-pack                   — Compila financieros del trimestre actual, KPIs, resumen de escenario
                                en narrativa de presentación para junta y notas de presentador
/investor-update              — Redacta carta de actualización mensual a inversores desde métricas actuales
                                y progreso de hitos
```

### Presupuesto y planificación de escenarios
```
/budget-reforecast            — Construye revisión acumulada de 4 trimestres con registro de cambios de supuestos
/scenario-model               — Genera salidas de escenario base/alcista/bajista desde insumos de driver
```

---

## Convenciones que Claude debe seguir

- El archivo de presupuesto aprobado por junta (budgets/annual/budget-2025.xlsx) es de solo lectura. Nunca proponer ediciones.
- El comentario de varianza debe citar la línea específica, la cantidad en dólares y el porcentaje. Nunca escribir comentario vago como "superior a lo esperado."
- Cuando redacte actualizaciones a inversores, extraiga primero métricas de management-reporting/. No estimar números.
- Los asientos contables deben seguir el formato en close/journal-entries/je-template.csv antes de sugerir cargas.
- El catálogo de cuentas es la autoridad en códigos de cuenta. Si se necesita una nueva cuenta, notarlo explícitamente e identificarlo para que el controlador la agregue.
- Los precios de ejercicio 409A en cap-table/409a-strike-price-log.md son confidenciales — no incluir en paquetes para juntas a menos que se indique específicamente.
- Los documentos PBC de auditoría en compliance/audit/ son confidenciales. No referenciar contenidos de archivo en salidas dirigidas a inversores.
- Al actualizar modelos, siempre registrar cambios de supuestos en models/3-statement/assumptions-log.md con fecha y razón.
- Los archivos de revisión deben incluir una sección de registro de cambios. Nunca sobrescribir archivo de revisión anterior — crear archivo nuevo versionado.
- Todos los umbrales de varianza que desencadenan comentario obligatorio se definen en models/budget-vs-actual/variance-threshold-policy.md.
```

## Servidores MCP

```json
{
  "mcpServers": {
    "quickbooks": {
      "command": "npx",
      "args": ["-y", "@intuit/mcp-server-quickbooks"],
      "env": {
        "QB_CLIENT_ID": "${QB_CLIENT_ID}",
        "QB_CLIENT_SECRET": "${QB_CLIENT_SECRET}",
        "QB_REALM_ID": "${QB_REALM_ID}",
        "QB_ACCESS_TOKEN": "${QB_ACCESS_TOKEN}"
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
        "/Users/you/finance-analyst-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"models/budget-vs-actual/\"; then echo \"[BvA hook] Archivo de varianza actualizado — confirmar que variance-threshold-policy.md ha sido verificado para requisitos de comentario obligatorio.\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"budgets/annual/budget-2025\"; then echo \"[Budget guard] ALTO — el archivo de presupuesto anual aprobado es de solo lectura. Escribir en budgets/reforecasts/ en su lugar.\"; exit 1; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] Si actualizó un modelo, confirmar que cambios de supuestos estén registrados en models/3-statement/assumptions-log.md. Si redactó un documento de cierre, confirmar que está vinculado en close/month-end-close-checklist.md.\"'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/dcf-model
npx claudient add skill finance/budget-vs-actual
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/financial-plan
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/comps-analysis
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
```

## Relacionado

- [Guía: Claude para Analistas Financieros y CFOs](../guides/for-finance-analyst.md)
- [Flujo de Trabajo: Cierre de Fin de Mes](../workflows/month-end-close.md)
- [Flujo de Trabajo: Preparación de Paquete para Junta](../workflows/board-pack-prep.md)
- [Flujo de Trabajo: Presupuesto Anual](../workflows/annual-budgeting.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
