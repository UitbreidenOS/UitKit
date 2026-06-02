# Fondo de Inversión / Operaciones de VC — Estructura de Proyecto

> Para un fondo de capital de riesgo u oficina familiar que gestiona la generación de oportunidades hasta reportes a LP, con etapas de pipeline estructuradas, salas de diligencia por empresa, seguimiento de KPI de cartera y administración del fondo.

## Stack

- **Notion** o **Airtable** — CRM de transacciones, kanban de pipeline, base de datos de empresas de cartera, registro de LP
- **Carta** — Gestión de tabla de capitalización, administración del fondo, emisión de acciones, seguimiento de pro-rata
- **Visible** o **Synaptic** — Portal de informes para LP, paneles de desempeño del fondo, agregación de métricas de cartera
- **Pitchbook** o **Crunchbase** — Datos de mercado, conjuntos de empresas comparables, puntos de referencia de valoración, mapeo de sectores
- **QuickBooks** — Contabilidad del fondo, facturación de honorarios de gestión, contabilidad de llamadas de capital, modelado de cascada
- **DocuSign** — Ejecución de hojas de términos, acuerdos de suscripción, cartas secundarias de LP, consentimientos de junta
- **Google Workspace** — Drive compartido para salas de datos, Sheets para rastreadores de KPI, Docs para memorandos colaborativos
- **Claude Code** — Evaluación de transacciones, redacción de memorandos de IC, síntesis de diligencia, generación de reportes de LP, investigación de tesis

## Árbol de directorios

```
investment-fund/
├── .claude/
│   ├── CLAUDE.md                                      # Instrucciones de Claude Code del fondo (pegar plantilla debajo)
│   ├── settings.json                                  # Servidores MCP, hooks, permisos de herramientas
│   └── commands/
│       ├── deal-screen.md                             # /deal-screen — triaje de transacción entrante desde URL o resumen de presentación
│       ├── first-look.md                              # /first-look — resumen de una página después de primera reunión con fundador
│       ├── diligence-brief.md                         # /diligence-brief — síntesis de elementos de diligencia abiertos listos para IC
│       ├── ic-memo.md                                 # /ic-memo — memorando completo del Comité de Inversiones desde notas de diligencia
│       ├── pass-memo.md                               # /pass-memo — justificación documentada para pasar en pipeline/passed/
│       ├── portfolio-update.md                        # /portfolio-update — narrativa mensual de KPI desde actualización de fundador
│       ├── board-prep.md                              # /board-prep — esquema de presentación de junta, preguntas de agenda, elementos de acción
│       ├── lp-report.md                               # /lp-report — carta trimestral de LP con desempeño del fondo y destacados de cartera
│       ├── capital-call.md                            # /capital-call — borrador de notificación de llamada de capital con instrucciones de transferencia
│       ├── market-thesis.md                           # /market-thesis — documento de tesis de sector desde insumos de investigación brutos
│       └── exit-analysis.md                          # /exit-analysis — modelado de escenarios de salida y narrativa de tesis de salida
├── pipeline/
│   ├── sourcing/                                      # Todos los contactos entrantes y salientes no revisados aún
│   │   ├── deal-tracker.md                            # Registro maestro: empresa, etapa, fuente, fecha, ajuste de tesis, estado
│   │   ├── thesis-signals.md                         # Patrones emergentes — temas, sectores, perfiles de fundador dignos de seguimiento
│   │   └── _template/
│   │       └── initial-screen.md                     # Formulario de evaluación en blanco: empresa, etapa, solicitud, fuente, ajuste de tesis, banderas rojas
│   ├── first-look/                                    # Evaluado como aceptado — resumen de una página escrito, primera reunión programada o realizada
│   │   ├── _template/
│   │   │   └── one-pager.md                          # Plantilla de una página: negocio, equipo, mercado, tracción, solicitud, ajuste
│   │   ├── acme-ai/
│   │   │   └── one-pager.md                          # Resumen de primera observación: problema, solución, equipo, tracción, solicitud
│   │   ├── brightpath-health/
│   │   │   └── one-pager.md
│   │   └── circuitworks-infra/
│   │       └── one-pager.md
│   ├── diligence/                                     # Diligencia profunda activa — memorando de IC en progreso
│   │   ├── _template/
│   │   │   ├── market-research.md                    # Dimensionamiento de mercado, panorama competitivo, tesis de temporización
│   │   │   ├── team-check.md                         # Antecedentes de fundador, referencias, historial de desempeño, banderas rojas
│   │   │   ├── financial-model.md                    # Revisión de modelo de ingresos, economía unitaria, quema, pista, sensibilidad
│   │   │   ├── tech-diligence.md                     # Arquitectura, escalabilidad, seguridad, evaluación de deuda técnica
│   │   │   ├── legal-diligence.md                   # Propiedad intelectual, contratos de empleo, limpieza de tabla de capitalización, litigio
│   │   │   └── diligence-tracker.md                  # Elementos abiertos por flujo de trabajo — propietario, fecha límite, estado, bloqueadores
│   │   ├── dawnrise-climate/
│   │   │   ├── market-research.md
│   │   │   ├── team-check.md
│   │   │   ├── financial-model.md
│   │   │   ├── tech-diligence.md
│   │   │   ├── legal-diligence.md
│   │   │   ├── diligence-tracker.md
│   │   │   └── reference-checks/
│   │   │       ├── ref-ceo-former-manager.md         # Referencias estructuradas: capacidades, debilidades, estilo de trabajo
│   │   │       ├── ref-cto-cofounder.md
│   │   │       └── ref-customer-series-b-lead.md
│   │   └── edgewise-fintech/
│   │       ├── market-research.md
│   │       ├── team-check.md
│   │       ├── financial-model.md
│   │       ├── tech-diligence.md
│   │       ├── legal-diligence.md
│   │       ├── diligence-tracker.md
│   │       └── reference-checks/
│   │           └── ref-angel-lead.md
│   ├── ic/                                            # Memorando de IC presentado — pendiente de votación del Comité de Inversiones
│   │   └── foundry-robotics/
│   │       ├── ic-memo.md                            # Memorando de IC final: tesis, mercado, equipo, finanzas, riesgos, términos, recomendación
│   │       ├── comps-analysis.md                     # Empresas públicas y privadas comparables con múltiplos de entrada y valoración implícita
│   │       ├── financial-model.md
│   │       └── diligence-tracker.md                  # Elementos cerrados con notas de resultado
│   ├── closed/                                        # Hoja de términos firmada o transferencia enviada — promovido a portfolio/
│   │   └── greenmark-saas/
│   │       ├── ic-memo.md
│   │       ├── term-sheet.md                         # Hoja de términos ejecutada: valoración, pro-rata, asiento en junta, disposiciones de protección
│   │       ├── closing-checklist.md                  # Transferencia confirmada, Carta actualizada, DocuSign completo, pro-rata registrado
│   │       └── post-close-intro.md                  # Correo de introducción a recursos de cartera — legal, talento, GTM
│   └── passed/                                        # Transacciones rechazadas — documentadas con justificación del rechazo
│       ├── _template/
│       │   └── pass-rationale.md                    # Por qué pasamos: categoría, razón central, señales que podrían cambiar nuestra opinión
│       ├── halcyon-crypto/
│       │   ├── one-pager.md
│       │   └── pass-rationale.md
│       └── inkdrop-hr-tech/
│           ├── one-pager.md
│           └── pass-rationale.md
├── memos/                                             # Todos los memorandos de IC y memorandos de rechazo en una ubicación buscable
│   ├── investment-memos/
│   │   ├── 2026-05-greenmark-saas.md               # Memorando de IC archivado después del cierre
│   │   ├── 2026-03-foundry-robotics.md
│   │   └── 2025-11-apex-data.md
│   └── pass-memos/
│       ├── 2026-04-halcyon-crypto.md
│       └── 2026-02-inkdrop-hr-tech.md
├── portfolio/                                         # Una carpeta por cada empresa activa de cartera
│   ├── _template/                                    # Copiar cuando se cierra una nueva inversión
│   │   ├── memo.md                                  # Memorando de IC (copiado desde pipeline/closed/)
│   │   ├── cap-table.md                             # Porcentaje de propiedad, acciones, fondo de opciones, términos de ronda
│   │   ├── board-deck-notes/
│   │   │   └── .gitkeep                             # Preparación de junta y notas posteriores a la reunión por trimestre
│   │   ├── kpis/
│   │   │   └── kpi-log.md                          # Tabla mensual de KPI: ARR, crecimiento MoM, quema, pista, recuento de empleados, NRR
│   │   ├── capital-plan/
│   │   │   └── capital-plan.md                     # Cronograma de próxima ronda, recaudación esperada, asignación pro-rata, modelo de reserva
│   │   └── exit-thesis/
│   │       └── exit-thesis.md                      # Caminos de salida: adquirentes, preparación para IPO, marco de mantener vs. vender
│   ├── greenmark-saas/
│   │   ├── memo.md
│   │   ├── cap-table.md
│   │   ├── board-deck-notes/
│   │   │   ├── 2026-q1-board-prep.md               # Preparación de junta Q1: agenda, preguntas, elementos de acción a rastrear
│   │   │   ├── 2026-q1-board-notes.md              # Post-junta: decisiones, elementos de acción, seguimientos
│   │   │   └── 2026-q2-board-prep.md
│   │   ├── kpis/
│   │   │   └── kpi-log.md                          # Tabla de KPI en ejecución con filas mensuales
│   │   ├── capital-plan/
│   │   │   └── capital-plan.md
│   │   └── exit-thesis/
│   │       └── exit-thesis.md
│   └── apex-data/
│       ├── memo.md
│       ├── cap-table.md
│       ├── board-deck-notes/
│       │   └── 2026-q1-board-notes.md
│       ├── kpis/
│       │   └── kpi-log.md
│       ├── capital-plan/
│       │   └── capital-plan.md
│       └── exit-thesis/
│           └── exit-thesis.md
├── lp-relations/                                      # Todos los materiales dirigidos a LP, comunicaciones y desempeño del fondo
│   ├── lp-roster.md                                  # Lista de LP: nombre, entidad, compromiso, instrucciones de transferencia, contacto
│   ├── quarterly-updates/
│   │   ├── 2026-q1-lp-update.md                    # Carta de LP de Q1 2026: NAV, nuevas inversiones, destacados de cartera
│   │   ├── 2025-q4-lp-update.md
│   │   └── 2025-q3-lp-update.md
│   ├── annual-reports/
│   │   └── 2025-annual-report.md                   # Resumen anual: TIR, DPI, RVPI, mejores desempeños, progreso de tesis
│   └── capital-call-notices/
│       ├── _template/
│       │   └── capital-call-notice.md              # Notificación estándar con cantidad de llamada, instrucciones de transferencia, fecha límite
│       ├── 2026-04-capital-call-2.md               # Llamada de Capital #2 — Inversión en Greenmark
│       └── 2025-10-capital-call-1.md               # Llamada de Capital #1 — Inversión en Apex Data
├── thesis/                                            # Investigación de sectores y tesis de inversión
│   ├── sector-theses/
│   │   ├── ai-infrastructure.md                    # Tesis completa del sector: mapa, temporización, perfil objetivo, riesgos
│   │   ├── climate-tech.md
│   │   ├── fintech-infrastructure.md
│   │   └── vertical-saas.md
│   └── market-maps/
│       ├── ai-infra-market-map.md                  # Panorama por capa: computación, entrenamiento, inferencia, herramientas, aplicaciones
│       ├── climate-market-map.md
│       └── fintech-rails-market-map.md
├── fund-admin/                                        # Administración a nivel de fondo y cumplimiento legal
│   ├── cap-table-summary.md                         # Tabla de capitalización a nivel de fondo: todas las empresas de cartera, porcentaje de propiedad, base de costos
│   ├── waterfall-model.md                           # Cascada de interés llevado: tasa de obstáculo, recuperación, división de carry, división LP/GP
│   ├── compliance-calendar.md                       # Fechas límite de presentación: K-1s, FBAR, registros estatales, presentaciones de RIA
│   ├── management-fee-tracker.md                   # Cronograma de honorarios de gestión, pagos recibidos, conciliación con QuickBooks
│   └── reserve-model.md                            # Modelo de reserva de seguimiento: derechos pro-rata por empresa, objetivos de asignación
└── scratch/
    ├── weekly-deal-notes.md                         # Área de preparación para notas de transacciones brutas antes de presentarlas al pipeline
    └── research-clips.md                            # Datos de mercado brutos y recortes de prensa antes de formatear en documentos de tesis
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `pipeline/sourcing/deal-tracker.md` | Registro de abastecimiento maestro con cada contacto entrante y saliente — empresa, etapa, fuente, puntuación de ajuste de tesis (1-5), propietario, fecha de primer avistamiento, estado actual; nunca elimine entradas, solo actualice el estado |
| `pipeline/diligence/_template/diligence-tracker.md` | Rastreador por empresa para todos los elementos abiertos en cinco flujos de trabajo (mercado, equipo, finanzas, técnica, legal) — propietario, fecha límite, estado, bandera de bloqueo de IC; permanece abierto hasta que se presenta el memorando de IC |
| `pipeline/diligence/_template/financial-model.md` | Archivo de diligencia financiera estandarizado que cubre revisión de modelo de ingresos, tabla de economía unitaria, cálculo de quema y pista, suposiciones de sensibilidad, y banderas rojas; se alimenta directamente en la sección de finanzas del memorando de IC |
| `memos/investment-memos/` | Archivo canónico de todos los memorandos de IC aprobados archivados como `AAAA-MM-<empresa>.md` después de la votación de IC — buscable para valoraciones de comparables, evolución de tesis y coincidencia de patrones |
| `portfolio/_template/kpis/kpi-log.md` | Plantilla de tabla de KPI mensual con columnas para ARR, crecimiento de ingresos MoM, margen bruto, tasa de quema, pista (meses), recuento de empleados, NRR, y relación de cobertura de pipeline — adjuntada mensualmente, nunca sobrescrita |
| `lp-relations/lp-roster.md` | Lista maestra de LP con nombre de entidad legal, monto de compromiso, capital llamado hasta la fecha, compromiso no llamado, instrucciones de transferencia, banderas de cartas secundarias, y contacto principal — fuente de verdad para notificaciones de llamada de capital |
| `lp-relations/capital-call-notices/` | Notificaciones de llamada de capital ejecutadas almacenadas por fecha — `AAAA-MM-capital-call-N.md` — utilizado para conciliación de LP y entradas de cuenta de capital de QuickBooks |
| `fund-admin/waterfall-model.md` | Cascada de interés llevado con tasa de obstáculo, retorno preferido, disposición de recuperación, y división de GP/LP — actualizada en cada evento de salida o realización |
| `fund-admin/compliance-calendar.md` | Calendario de cumplimiento anual con fechas límite de entrega de K-1, presentaciones de cielo azul estatal, fechas de enmienda anual de RIA, FBAR si aplica, y cronograma de auditoría |

## Andamiaje rápido

```bash
# Crear raíz del espacio de trabajo
mkdir -p investment-fund

# Crear comandos de .claude
mkdir -p investment-fund/.claude/commands

# Crear directorios de etapa de pipeline
mkdir -p investment-fund/pipeline/sourcing/_template
mkdir -p investment-fund/pipeline/first-look/_template
mkdir -p investment-fund/pipeline/diligence/_template/reference-checks
mkdir -p investment-fund/pipeline/ic
mkdir -p investment-fund/pipeline/closed
mkdir -p investment-fund/pipeline/passed/_template

# Crear archivo de memorandos
mkdir -p investment-fund/memos/investment-memos
mkdir -p investment-fund/memos/pass-memos

# Crear plantilla de cartera
mkdir -p investment-fund/portfolio/_template/board-deck-notes
mkdir -p investment-fund/portfolio/_template/kpis
mkdir -p investment-fund/portfolio/_template/capital-plan
mkdir -p investment-fund/portfolio/_template/exit-thesis

# Crear directorios de relaciones de LP
mkdir -p investment-fund/lp-relations/quarterly-updates
mkdir -p investment-fund/lp-relations/annual-reports
mkdir -p investment-fund/lp-relations/capital-call-notices/_template

# Crear directorios de tesis
mkdir -p investment-fund/thesis/sector-theses
mkdir -p investment-fund/thesis/market-maps

# Crear directorio de administración del fondo
mkdir -p investment-fund/fund-admin

# Crear rayador
mkdir -p investment-fund/scratch

# Archivos de marcador de posición de semilla
touch investment-fund/pipeline/sourcing/deal-tracker.md
touch investment-fund/pipeline/sourcing/thesis-signals.md
touch investment-fund/fund-admin/cap-table-summary.md
touch investment-fund/fund-admin/waterfall-model.md
touch investment-fund/fund-admin/compliance-calendar.md
touch investment-fund/fund-admin/management-fee-tracker.md
touch investment-fund/fund-admin/reserve-model.md
touch investment-fund/lp-relations/lp-roster.md
touch investment-fund/scratch/weekly-deal-notes.md
touch investment-fund/scratch/research-clips.md

# Marcadores de posición de semilla .gitkeep en directorios de plantilla vacíos
touch investment-fund/portfolio/_template/board-deck-notes/.gitkeep
touch investment-fund/portfolio/_template/kpis/.gitkeep
touch investment-fund/portfolio/_template/capital-plan/.gitkeep
touch investment-fund/portfolio/_template/exit-thesis/.gitkeep

# Instalar habilidades de operaciones del fondo
npx claudient add skill finance/deal-screening
npx claudient add skill finance/ic-memo
npx claudient add skill finance/diligence-synthesis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/lp-reporting
npx claudient add skill finance/cap-table-analysis
npx claudient add skill finance/market-sizing
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/exit-modeling
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
```

## Plantilla de CLAUDE.md

```markdown
# Fondo de Inversión — Instrucciones de Claude Code

## Qué es esto

Este es el directorio de trabajo para un fondo de capital de riesgo que gestiona flujo de transacciones de extremo a extremo,
seguimiento de cartera, reportes de LP y administración del fondo. Las etapas del pipeline viven en
pipeline/ (abastecimiento → primera observación → diligencia → ic → cerrado o pasado), inversiones activas
en portfolio/ (una carpeta por empresa), memorandos de IC y memorandos de rechazo en memos/, materiales de LP en
lp-relations/, investigación de sectores en thesis/, y operaciones del fondo en fund-admin/.

Toda la evaluación de transacciones, redacción de memorandos de IC, síntesis de diligencia, reportes de LP y preparación de junta
se ejecutan a través de comandos de barra inclinada de Claude Code en .claude/commands/.

## Stack

- Notion / Airtable — CRM de transacciones y base de datos de cartera; kanban de pipeline por etapa; registro de LP
- Carta — Tabla de capitalización de registro; exportar resúmenes a portfolio/<empresa>/cap-table.md
- Visible / Synaptic — Portal de informes para LP; actualizaciones trimestrales redactadas en lp-relations/quarterly-updates/
- Pitchbook / Crunchbase — Datos de mercado y comparables; exportaciones van a thesis/ y archivos de diligencia
- QuickBooks — Contabilidad del fondo; llamadas de capital, honorarios de gestión, distribuciones reconciliadas aquí
- DocuSign — Hojas de términos, acuerdos de suscripción, cartas secundarias de LP; copias ejecutadas en fund-admin/
- Google Workspace — Espejo de Drive compartido a pipeline/diligence/<empresa>/data-room/ para referencia sin conexión

## Tareas comunes y comandos exactos

### Evaluar una transacción entrante
```
/deal-screen

Empresa: [nombre]
URL: [sitio web o perfil de Crunchbase/Pitchbook]
Etapa: [pre-semilla / semilla / Serie A / Serie B]
Sector: [categoría]
Solicitud: $[cantidad] a valoración de $[pre-dinero o post-dinero]
Fuente: [entrante / introducción cálida de X / conferencia / salida en frío]
Presentación o métricas clave: [pegar o describir — ARR, tasa de crecimiento, antecedentes del equipo]
Comprobación de ajuste de tesis: [¿a qué tesis de sector se asigna esto?]
```

### Escribir un resumen de una página de primera observación
```
/first-look

Empresa: [nombre], Etapa: [ronda], Sector: [categoría]
Notas de la reunión: [pegar notas brutas de la primera reunión]
Destacados de presentación: [pegar diapositivas clave o describir]
Antecedentes del equipo: [biografías de CEO y CTO y experiencia anterior]
Tracción: [ARR, crecimiento MoM, recuento de clientes, NRR si está disponible]
Solicitud: $[cantidad] a $[valoración], cierre: [fecha o abierto]
Ajuste de tesis inicial: [por qué esto se ajusta o estira nuestra tesis]
Preguntas abiertas antes de diligencia: [qué necesita ser verdad para proceder]
```

### Sintetizar diligencia en resumen listo para IC
```
/diligence-brief

Empresa: [nombre], Etapa: [ronda], Fecha objetivo de IC: [fecha]
Hallazgos de investigación de mercado: [pegar desde diligence/<empresa>/market-research.md]
Hallazgos de verificación de equipo: [pegar desde diligence/<empresa>/team-check.md]
Revisión del modelo financiero: [pegar desde diligence/<empresa>/financial-model.md]
Notas de diligencia técnica: [pegar desde diligence/<empresa>/tech-diligence.md]
Notas de diligencia legal: [pegar desde diligence/<empresa>/legal-diligence.md]
Elementos abiertos restantes: [pegar filas abiertas desde diligence-tracker.md]
Riesgos clave a abordar en memorando: [los 3 principales que IC desafiará]
```

### Redactar un memorando completo de IC
```
/ic-memo

Empresa: [nombre], Etapa: [ronda], Sector: [categoría]
Monto de inversión: $[cantidad], Valoración: $[post-dinero], Propiedad: [%]
Tesis de inversión: [1-2 oraciones — por qué esta empresa, por qué ahora, por qué nosotros]
Mercado: [TAM, SAM, tasa de crecimiento, vientos de cola estructurales, tesis de temporización]
Equipo: [antecedentes de fundadores, experiencia de dominio, resumen de referencias]
Producto: [cuña principal, diferenciación, foso, hoja de ruta]
Tracción: [ARR, crecimiento MoM, NRR, margen bruto, recuento de clientes, quema, pista]
Riesgos y mitigantes: [3-4 riesgos principales con mitigantes específicos propuestos]
Transacciones comparables: [3-5 comparables con etapa, valoración, múltiplo en salida si está disponible]
Términos: [líder, pro-rata, asiento en junta, disposiciones de protección, banderas de cartas secundarias]
Recomendación: [Invertir / Pasar / Se necesita más diligencia]
```

### Redactar un informe trimestral de LP
```
/lp-report

Trimestre: Q[X] [AÑO]
Fondo: [nombre del fondo y antigüedad]
Tamaño total del fondo: $[X]M, Desembolsado hasta la fecha: $[Y]M, No llamado: $[Z]M
NAV este trimestre: $[X]M (trimestre anterior: $[Y]M)
TIR Bruto: [%], TIR Neto: [%], DPI: [X]x, RVPI: [Y]x, TVPI: [Z]x
Nuevas inversiones este trimestre: [empresa, cantidad, etapa, sector]
Destacados de cartera: [2-3 hitos principales — rondas cerradas, crecimiento de ingresos, contrataciones clave, asociaciones]
Preocupaciones o depreciaciones: [marcas o desafíos de cartera a abordar]
Próximo: [cierres esperados, llamadas de capital, eventos de cartera el próximo trimestre]
Perspectiva de mercado: [contexto macroeconómico relevante para la tesis del fondo — 2-3 oraciones]
```

### Redactar una notificación de llamada de capital
```
/capital-call

Número de llamada: [#N]
Inversión desencadenante de llamada: [nombre de empresa], Monto invertido: $[X]
Monto de llamada por LP: [proporcional al compromiso o especificar]
Fecha límite de transferencia: [fecha]
Instrucciones de transferencia: [desde fund-admin/ o especificar]
Nota de propósito: [lenguaje estándar o nota de inversión específica]
Registro de LP: [pegar desde lp-relations/lp-roster.md o especificar recuento de LP]
```

### Generar preparación de junta para una empresa de cartera
```
/board-prep

Empresa: [nombre], Fecha de junta: [fecha]
Elementos de acción de última junta: [pegar desde archivo de notas de junta anterior]
KPI actual: [pegar desde portfolio/<empresa>/kpis/kpi-log.md]
Última actualización del fundador: [pegar actualización mensual más reciente]
Elementos de agenda: [finanzas / hoja de ruta de producto / contratación / recaudación de fondos / otro]
Preguntas clave a plantear: [preocupaciones específicas u oportunidades para explorar]
Decisiones a tomar: [concesiones de opciones, aprobaciones presupuestarias, giros estratégicos]
```

### Escribir una tesis de salida para una empresa de cartera
```
/exit-analysis

Empresa: [nombre], Fecha de inversión: [fecha], Base de costos: $[X]M, Propiedad actual: [%]
ARR actual: $[X]M, Tasa de crecimiento: [%], Margen bruto: [%]
Probables adquirentes: [list compradores estratégicos con justificación para cada uno]
Preparación para IPO: [escala de ingresos, perfil de crecimiento, condiciones de mercado necesarias]
Marco de mantener vs. vender: [qué métricas o eventos desencadenarían salida vs. mantener]
Salidas comparables: [M&A recientes o IPO en categoría con múltiplos]
Escenario de retorno objetivo: [escenarios 1x / 3x / 5x / 10x y valoración implícita]
```

## Convenciones a seguir

- Las etapas del pipeline son estrictamente ordenadas: abastecimiento → primera observación → diligencia → ic → cerrado o pasado
- Cada empresa que llega a primera observación obtiene un resumen de una página en pipeline/first-look/<empresa>/one-pager.md
- Las carpetas de diligencia utilizan cinco archivos estándar: market-research.md, team-check.md, financial-model.md, tech-diligence.md, legal-diligence.md — no los renombre
- Los memorandos de IC se archivan en memos/investment-memos/AAAA-MM-<empresa>.md después de la votación de IC independientemente del resultado
- Cuando una transacción se cierra, copie el memorando de IC a portfolio/<empresa>/memo.md y cree la carpeta de cartera completa desde _template/
- La justificación de rechazo siempre se escribe — archivar a pipeline/passed/<empresa>/pass-rationale.md y memos/pass-memos/AAAA-MM-<empresa>.md
- Los registros de KPI son de solo adjunta: agregue una nueva fila cada mes, nunca sobrescriba entradas anteriores
- Las notificaciones de llamada de capital se archivan en lp-relations/capital-call-notices/AAAA-MM-capital-call-N.md
- El registro de LP en lp-relations/lp-roster.md es la fuente de verdad para todas las notificaciones de llamada de capital y distribución
- El rastreador de NAV y el modelo de cascada en fund-admin/ se actualizan dentro de 5 días hábiles de cada evento de salida o realización
- El calendario de cumplimiento en fund-admin/compliance-calendar.md se revisa al inicio de cada trimestre
```

## Servidores MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/investment-fund"
      ]
    },
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp"],
      "env": {
        "NOTION_API_KEY": "secret_your-notion-integration-token"
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
    "airtable": {
      "command": "npx",
      "args": ["-y", "@airtable/mcp-server"],
      "env": {
        "AIRTABLE_API_KEY": "your-airtable-api-key",
        "AIRTABLE_BASE_ID": "appXXXXXXXXXXXXXX"
      }
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"ic-memo.md\" && echo \"$FILE\" | grep -q \"pipeline/ic/\"; then echo \"[hook] Memorando de IC escrito en pipeline/ic/ — recuerde archivar una copia a memos/investment-memos/AAAA-MM-<empresa>.md después de la votación de IC\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"pass-rationale.md\"; then echo \"[hook] Justificación de rechazo escrita — también archivar a memos/pass-memos/AAAA-MM-<empresa>.md y confirmar que la carpeta de empresa se mueve a pipeline/passed/\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"capital-call-notices/\" && ! echo \"$FILE\" | grep -q \"_template\"; then echo \"[hook] Notificación de llamada de capital escrita — verifique que los recuentos del registro de LP coincidan e instrucciones de transferencia sean actuales antes de distribuir\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DOM=$(date +%d); if [ \"$DOM\" -le \"05\" ]; then echo \"[reminder] Principios de mes — verifique entradas de portfolio/<empresa>/kpis/kpi-log.md para el mes pasado y revise compliance-calendar.md para próximos vencimientos\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
# Habilidades principales de operaciones del fondo
npx claudient add skill finance/deal-screening
npx claudient add skill finance/ic-memo
npx claudient add skill finance/diligence-synthesis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/lp-reporting
npx claudient add skill finance/cap-table-analysis
npx claudient add skill finance/market-sizing
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/exit-modeling
npx claudient add skill finance/waterfall-model

# Habilidades de productividad y comunicación de apoyo
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/investor-update
npx claudient add skill data-ml/stakeholder-report

# Instalar todas las habilidades de finanzas a la vez
npx claudient add skills finance
```

## Relacionado

- [Guía para inversores](../guides/for-investor.md)
- [Flujo de transacciones](../workflows/deal-flow.md)
- [Flujo del proceso de memorando de IC](../workflows/ic-memo-process.md)
- [Informe de LP](../workflows/lp-reporting.md)

---

🔗 **[Uitbreiden — construyendo productos de IA y herramientas B2B con comunidades de desarrolladores.](https://uitbreiden.com/)**
📺 **[Suscríbase a nuestro canal de YouTube para más análisis profundos](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
