# Operaciones de Organizaciones sin Fines de Lucro — Estructura del Proyecto

> Para una organización sin fines de lucro que gestiona programas, recaudación de fondos, relaciones con donantes, redacción de subvenciones y cumplimiento normativo, optimizando el ciclo completo desde investigación de prospectos y solicitudes de subvenciones hasta entrega de programas, administración de donantes e informes IRS 990.

## Stack

- **Salesforce Nonprofit Success Pack (NPSP)** — CRM de donantes, seguimiento de obsequios, gestión de relaciones, informes de campañas
- **Bloomerang** — CRM de donantes alternativo; puntuación de retención, segmentación de donantes inactivos, línea de tiempo de compromiso
- **Mailchimp** o **Constant Contact** — boletines de correo electrónico, campañas de segmentación de donantes, invitaciones a eventos, secuencias de administración automatizadas
- **QuickBooks Nonprofit** — contabilidad de fondos, seguimiento de ingresos restringidos/sin restricciones, informes de gastos de subvenciones, exportaciones de preparación 990
- **Google Workspace** (Gmail, Docs, Drive, Sheets, Calendar) — comunicaciones internas, documentos de junta directiva, almacenamiento de archivos compartidos
- **Canva** — informes de impacto, gráficos de redes sociales, portadas de solicitudes de subvenciones, materiales de eventos, diseño de informe anual
- **Zoom** — reuniones de junta directiva, eventos de cultivo de donantes, entrega de programas (virtual), reuniones de personal
- **DonorSearch** o **iWave** — investigación de prospectos, análisis de riqueza, puntuación de capacidad filantrópica, calificaciones de afinidad
- **Submittable** o **Fluxx** — portal de envío y gestión de solicitudes de subvenciones
- **Claude Code** — redacción de narrativas de subvenciones, cartas de reconocimiento de donantes, redacción de informes de junta directiva, generación de historias de impacto, asistencia de preparación 990

## Árbol de directorios

```
nonprofit-operations/
├── .claude/
│   ├── CLAUDE.md                                    # Instrucciones del espacio de trabajo — confidencialidad de donantes, plazos de subvenciones, cronograma 990
│   ├── settings.json                                # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── grant-narrative.md                       # /grant-narrative — redactar sección de propuesta de subvención desde resumen de financiador y datos de programa
│       ├── donor-acknowledgment.md                  # /donor-acknowledgment — generar carta de reconocimiento de obsequio compatible con IRS
│       ├── impact-story.md                          # /impact-story — escribir una historia de impacto del participante desde notas de entrevista de personal
│       ├── board-report.md                          # /board-report — reunir informe mensual/trimestral de junta directiva desde datos de programa y finanzas
│       ├── prospect-profile.md                      # /prospect-profile — sintetizar un perfil de prospecto de regalo principal desde entradas de investigación
│       ├── grant-report.md                          # /grant-report — redactar un informe de progreso o final del financiador desde datos de resultados del programa
│       └── donor-segment.md                         # /donor-segment — generar un mensaje de apelación o administración segmentado para un nivel de donante
├── programs/
│   ├── README.md                                    # Descripción general de programas — lista de programas activos, directores, años fiscales
│   ├── youth-workforce-development/                 # Carpeta de programa de ejemplo — una carpeta por programa activo
│   │   ├── logic-model.md                           # Teoría del cambio: insumos, actividades, productos, resultados, impacto
│   │   ├── activities.md                            # Calendario de actividades, planes de sesión, esquema de plan de estudios, asignaciones de facilitadores
│   │   ├── outcomes-tracking.md                     # Indicadores de resultado, métodos de medición, cronograma de recopilación de datos, objetivos versus reales
│   │   ├── participant-data-sop.md                  # Procedimiento operativo estándar para recopilar, almacenar y proteger PII de participantes — formularios de consentimiento, entrada de Salesforce, cronograma de retención
│   │   └── program-budget.md                        # Presupuesto a nivel de programa por categoría de gasto — vínculos a restricciones de subvenciones
│   ├── senior-food-assistance/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   ├── financial-literacy-education/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   └── evaluation/
│       ├── evaluation-framework.md                  # Enfoque de evaluación en toda la organización — indicadores comunes, estándares de datos
│       ├── data-collection-tools.md                 # Plantillas de encuestas, formularios de admisión, evaluaciones previas/posteriores — sin datos reales de participantes
│       └── annual-outcomes-report-template.md       # Plantilla para compilar resultados entre programas en informe anual orientado a financiador
├── fundraising/
│   ├── donor-segments.md                            # Definiciones de segmentos — donantes principales ($10K+), nivel medio ($1K–$9.999), fondo anual (<$1K), inactivos, nuevos
│   ├── major-gift-prospects.md                      # Top 25 prospectos de regalo principal — calificación de capacidad, afinidad, propietario de relación, próximo paso, monto solicitado
│   ├── event-calendar.md                            # Calendario de eventos de recaudación de fondos — gala, torneo de golf, Martes de donaciones, campañas entre pares
│   ├── annual-fund-plan.md                          # Estrategia de fondo anual — cronograma de apelación, mezcla de canales, objetivos de regalos coincidentes, objetivos de retención
│   ├── planned-giving.md                            # Programa de legados — lenguaje de legados, recursos de planificación patrimonial, plan de administración de miembros
│   ├── major-gifts/
│   │   ├── cultivation-moves-template.md            # Plantilla de gestión de movimientos — pasos de descubrimiento, cultivo, solicitud, administración
│   │   ├── gift-agreement-template.md               # Plantilla de acuerdo de regalo principal — monto, propósito, reconocimiento, obligaciones de informes
│   │   ├── solicitation-letter-template.md          # Plantilla de carta de solicitud de regalo principal — campos de personalización, narrativa de caso de apoyo
│   │   └── stewardship-calendar.md                  # Calendario de puntos de contacto anuales para donantes principales — llamadas, visitas al sitio, informes, reconocimiento
│   ├── annual-fund/
│   │   ├── direct-mail-appeal-template.md           # Plantilla de carta de apelación de correo directo — versiones de otoño, fin de año, primavera
│   │   ├── email-appeal-template.md                 # Plantilla de apelación por correo electrónico — variantes de línea de asunto, estructura de prueba A/B
│   │   ├── matching-gift-tracker.md                 # Oportunidades de regalos de empresas coincidentes — empleador, relación de coincidencia, plazo, estado
│   │   └── retention-report-template.md             # Plantilla de análisis de retención de donantes — nuevos, retenidos, inactivos, recuentos reactivados por año
│   └── prospect-research/
│       ├── prospect-research-sop.md                 # Procedimiento operativo estándar para detección DonorSearch/iWave — cuándo ejecutar, cómo registrar resultados en Salesforce/Bloomerang
│       ├── wealth-screen-criteria.md                # Criterios de puntuación de capacidad y afinidad — bienes raíces, presentaciones SEC, donaciones anteriores, historial filantrópico
│       └── prospect-briefing-template.md            # Plantilla de resumen de prospectos de una página — biografía, historial de donaciones, conexiones, solicitud sugerida
├── grants/
│   ├── grant-calendar.md                            # Calendario maestro de plazos de subvenciones — financiador, monto, plazo, escritor asignado, estado, informe vencido
│   ├── funder-research/
│   │   ├── funder-research-sop.md                   # Procedimiento operativo estándar para investigar nuevos financiadores — análisis 990, prioridades, beneficiarios anteriores, evaluación de ajuste
│   │   ├── funder-profiles/
│   │   │   ├── smith-family-foundation.md           # Perfil del financiador: prioridades, elegibilidad, tamaño promedio de subvención, subvenciones anteriores a la organización, contacto
│   │   │   ├── city-arts-council.md
│   │   │   └── federal-cdbg-program.md
│   │   └── prospect-funders.md                      # Financiadores bajo investigación — nombre, calificación de ajuste, próxima acción, personal asignado
│   ├── active-grants/
│   │   ├── README.md                                # Inventario de subvenciones activas — financiador, monto del premio, período, propósito restringido, fechas de informe
│   │   ├── smith-family-foundation-fy2025/
│   │   │   ├── grant-agreement.md                   # Monto del premio, restricciones, requisitos de informes, información de contacto
│   │   │   ├── budget-narrative.md                  # Presupuesto aprobado con narrativa de partida — coincide con código de subvención de QuickBooks
│   │   │   ├── progress-report-q1.md                # Informe de progreso narrativo Q1 — actividades, resultados, gastos
│   │   │   └── final-report-draft.md                # Borrador de informe final — narrativa, finanzas, lecciones aprendidas
│   │   └── federal-workforce-grant-fy2025/
│   │       ├── grant-agreement.md
│   │       ├── budget-narrative.md
│   │       ├── subrecipient-monitoring-log.md       # Registro de monitoreo de subbeneficiarios — visitas al sitio, revisiones de escritorio, hallazgos (requerido para premios federales)
│   │       └── sam-registration-renewal.md          # Lista de verificación de renovación de registro SAM.gov y fecha de vencimiento
│   ├── reporting-templates/
│   │   ├── progress-report-template.md              # Plantilla de informe de progreso provisional estándar — actividades, productos, resultados, resumen financiero
│   │   ├── final-report-template.md                 # Informe de subvención final — narrativa, resultados versus objetivos, contabilidad financiera, lecciones
│   │   └── budget-variance-report-template.md       # Plantilla de explicación de informe de varianza presupuestaria para financiadores
│   └── past-applications/
│       ├── README.md                                 # Índice de solicitudes anteriores — financiador, año, resultado, secciones narrativas reutilizables
│       ├── youth-workforce-development-narrative.md  # Narrativa de programa reutilizable para solicitudes de subvenciones de fuerza laboral juvenil
│       └── organizational-capacity-narrative.md     # Sección de capacidad organizacional reutilizable y antecedentes comprobados
├── communications/
│   ├── social-calendar.md                           # Calendario de contenido de redes sociales — plataforma, fecha de publicación, tema de contenido, campaña, activo gráfico
│   ├── annual-report.md                             # Esquema de informe anual y lista de verificación de producción — secciones de contenido, plantilla de Canva, plan de distribución
│   ├── newsletter-templates/
│   │   ├── monthly-newsletter-template.md           # Boletín mensual de donantes — secciones: historia de impacto, actualización de programa, próximos eventos, solicitud
│   │   ├── event-invitation-template.md             # Correo electrónico de invitación a evento — línea de asunto, marcador de posición de enlace RSVP, logística
│   │   └── year-end-appeal-email-series.md          # Serie de correos electrónicos de apelación de fin de año — secuencia de 4 correos, líneas de asunto, cronograma, llamadas a la acción
│   └── impact-stories/
│       ├── impact-story-sop.md                      # Procedimiento operativo estándar para recopilar, revisar y publicar historias de participantes — consentimiento requerido, directrices de privacidad
│       ├── story-interview-guide.md                 # Guía de personal para realizar entrevistas de historias de participantes — preguntas abiertas, formulario de liberación
│       └── published-stories/
│           ├── 2025-maria-workforce-story.md        # Historia de impacto publicada — anonimizada o consentida, resultado del programa ilustrado
│           └── 2025-james-food-assistance-story.md
├── finance/
│   ├── budget-template.md                           # Plantilla de presupuesto operativo anual — por programa, restringido versus sin restricciones, reales del año anterior
│   ├── 990-prep-checklist.md                        # Lista de verificación de preparación del Formulario IRS 990 — fechas de vencimiento, cronogramas requeridos, datos a extraer de QuickBooks
│   ├── audit-prep.md                                # Lista de verificación de preparación de auditoría anual — solicitudes de documentos, conciliaciones bancarias, confirmaciones de deducción de subvenciones
│   ├── grant-expense-tracking.md                    # Procedimiento operativo estándar de seguimiento de gastos de subvenciones — códigos de subvención de QuickBooks, asignaciones, reglas de fondos restringidos
│   ├── fund-accounting-sop.md                       # Procedimiento operativo estándar de contabilidad de fondos — restringido versus sin restricciones, liberación temporalmente restringida, FASB ASC 958
│   └── financial-reports/
│       ├── monthly-financial-report-template.md     # Informe financiero mensual listo para junta directiva — presupuesto versus real, YTD, resumen narrativo
│       └── grant-financial-report-template.md       # Plantilla de informe financiero del financiador — gastos por línea presupuestaria, saldo restante
├── board/
│   ├── board-roster.md                              # Roster de miembros de la junta directiva — nombre, término, comité, contacto, empleador, estado de donación
│   ├── meeting-agendas/
│   │   ├── agenda-template.md                       # Plantilla de agenda de reunión de junta directiva estándar — agenda de consentimiento, informes de comités, elementos de acción
│   │   ├── 2025-01-board-agenda.md
│   │   ├── 2025-03-board-agenda.md
│   │   └── 2025-06-board-agenda.md
│   ├── resolutions/
│   │   ├── resolution-template.md                   # Plantilla de resolución de junta directiva — formato CONSIDERANDOS/RESUELTO, registro de votación
│   │   ├── 2025-01-banking-resolution.md
│   │   └── 2025-03-executive-compensation-resolution.md
│   └── committee-charters/
│       ├── finance-committee-charter.md             # Alcance del comité de finanzas, membresía, frecuencia de reuniones, responsabilidades
│       ├── executive-committee-charter.md
│       ├── fundraising-committee-charter.md
│       └── program-committee-charter.md
└── compliance/
    ├── state-registration-tracker.md               # Rastreador de registro de solicitud de caridad por estado — fechas de vencimiento, tarifas de archivo, contactos de agentes registrados
    ├── conflict-of-interest-log.md                 # Registro anual de divulgación de conflicto de intereses — personal de junta directiva y clave, por Apéndice L del IRS 990
    ├── document-retention-policy.md                # Cronograma de retención de documentos compatible con IRS — categorías, períodos de retención, registro de destrucción
    ├── whistleblower-policy.md                     # Política de denunciante y anti-represalia — requerida para divulgación IRS 990 Parte VI
    └── 990-schedule-checklist/
        ├── schedule-a-checklist.md                 # Prueba de apoyo público — lista de verificación de cálculo 509(a)(1) o (a)(2)
        ├── schedule-b-checklist.md                 # Cronograma de colaboradores B — umbral, reglas de anonimización, requisitos de divulgación estatal
        ├── schedule-d-checklist.md                 # Cronograma D estados financieros complementarios — dotación, fondos restringidos
        └── schedule-o-checklist.md                 # Información complementaria del Cronograma O — políticas de gobernanza, explicación de compensación
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `grants/grant-calendar.md` | Calendario maestro de plazos de subvenciones que cubren todos los financiadores activos y potenciales — el archivo más crítico para operaciones de subvenciones; incluye nombre del financiador, monto del premio, plazo de solicitud, escritor asignado, estado de envío y fechas de informe vencido |
| `.claude/commands/grant-narrative.md` | Comando de barra oblicua que redacta una sección de propuesta de subvención (declaración de necesidad, descripción del programa, plan de evaluación o sostenibilidad) desde un resumen del financiador y datos de resultado del programa — reduce el tiempo de primer borrador de 4+ horas a menos de 30 minutos |
| `fundraising/major-gift-prospects.md` | Lista de los 25 principales prospectos de regalo principal con calificaciones de capacidad DonorSearch/iWave, propietario de relación, fecha del último contacto, próximo paso de cultivo y monto objetivo solicitado — tratado como confidencial; nunca compartido fuera de la organización |
| `finance/990-prep-checklist.md` | Lista de verificación de preparación del Formulario IRS 990 con plazo de vencimiento (4,5 meses después del cierre del año fiscal, u 11/15 para contribuyentes de año calendario), cronogramas requeridos por perfil de organización, informes de QuickBooks a ejecutar e lista de verificación de entrega de CPA |
| `grants/active-grants/README.md` | Inventario de todas las subvenciones activas con financiador, monto del premio, período de subvención, propósito restringido, código de subvención de QuickBooks y próximas fechas de informe — utilizado en informes financieros y de junta directiva mensuales |
| `programs/[program]/participant-data-sop.md` | Procedimiento operativo estándar por programa para recopilar y proteger información de identificación personal (PII) de participantes — define requisitos de consentimiento, procedimientos de entrada de datos de Salesforce, controles de acceso y cronograma de retención/destrucción |
| `board/board-roster.md` | Roster de junta directiva actual con vencimiento de término, asignaciones de comités, estado de donación anual y empleador para detección de regalo coincidente — actualizado después de cada reunión de junta directiva |
| `fundraising/prospect-research/prospect-briefing-template.md` | Plantilla de resumen de prospecto de regalo principal de una página completada desde DonorSearch/iWave — biografía, historial filantrópico, conexión a la organización, rango de solicitud sugerido y estrategia de cultivo |
| `communications/impact-stories/impact-story-sop.md` | Rige la recopilación y publicación de historias de participantes — requisitos de formulario de consentimiento, reglas de anonimización, flujo de trabajo de aprobación y pasos de producción de activos de Canva |
| `compliance/state-registration-tracker.md` | Rastreador de registro de solicitud de caridad para todos los estados donde la organización solicita — fechas de vencimiento, tarifas de renovación, contactos de agentes registrados y fechas de vencimiento de archivo anual |

## Andamiaje rápido

```bash
# Crear la raíz del espacio de trabajo
mkdir -p nonprofit-operations

# Crear estructura .claude
mkdir -p nonprofit-operations/.claude/commands

# Crear directorios de programas
mkdir -p nonprofit-operations/programs/youth-workforce-development
mkdir -p nonprofit-operations/programs/senior-food-assistance
mkdir -p nonprofit-operations/programs/financial-literacy-education
mkdir -p nonprofit-operations/programs/evaluation

# Crear directorios de recaudación de fondos
mkdir -p nonprofit-operations/fundraising/major-gifts
mkdir -p nonprofit-operations/fundraising/annual-fund
mkdir -p nonprofit-operations/fundraising/prospect-research

# Crear directorios de subvenciones
mkdir -p nonprofit-operations/grants/funder-research/funder-profiles
mkdir -p nonprofit-operations/grants/active-grants
mkdir -p nonprofit-operations/grants/reporting-templates
mkdir -p nonprofit-operations/grants/past-applications

# Crear directorios de comunicaciones
mkdir -p nonprofit-operations/communications/newsletter-templates
mkdir -p nonprofit-operations/communications/impact-stories/published-stories

# Crear directorios de finanzas
mkdir -p nonprofit-operations/finance/financial-reports

# Crear directorios de junta directiva
mkdir -p nonprofit-operations/board/meeting-agendas
mkdir -p nonprofit-operations/board/resolutions
mkdir -p nonprofit-operations/board/committee-charters

# Crear directorios de cumplimiento
mkdir -p nonprofit-operations/compliance/990-schedule-checklist

# Semilla del calendario de subvenciones con encabezados de columna
cat > nonprofit-operations/grants/grant-calendar.md << 'EOF'
# Calendario de Plazos de Subvenciones

**Actualizado:** [fecha]
**Propietario:** [nombre del gestor de subvenciones]

| Financiador | Programa | Monto | Plazo de Solicitud | Escritor Asignado | Estado | Informe Vencido |
|---|---|---|---|---|---|---|
| Smith Family Foundation | Youth Workforce | $50,000 | 2025-09-15 | [nombre] | Redacción | 2026-06-30 |
| City Arts Council | Financial Literacy | $15,000 | 2025-10-01 | [nombre] | Investigación | 2026-03-31 |

## Próximamente (próximos 90 días)
- [auto-completar desde tabla anterior filtrado por plazo]

## Informe Vencido (próximos 90 días)
- [auto-completar desde tabla anterior filtrado por fecha de informe vencido]
EOF

# Semilla del README de subvenciones activas
cat > nonprofit-operations/grants/active-grants/README.md << 'EOF'
# Inventario de Subvenciones Activas

| Financiador | Monto del Premio | Período de Subvención | Propósito Restringido | Código de Subvención de QuickBooks | Próximo Informe Vencido |
|---|---|---|---|---|---|
| Smith Family Foundation | $50,000 | 7/1/2025–6/30/2026 | Estipendios de fuerza laboral juvenil y personal | GR-2025-001 | 2026-01-15 |

**Regla:** Cada subvención activa debe tener su propia subcarpeta nombrada [funder-kebab-case]-[fiscal-year].
La subcarpeta debe contener: grant-agreement.md, budget-narrative.md y un archivo por informe de progreso/final.
EOF

# Semilla del README de política de confidencialidad de donantes
cat > nonprofit-operations/fundraising/prospect-research/prospect-research-sop.md << 'EOF'
# Procedimiento Operativo Estándar de Investigación de Prospectos

## Política de confidencialidad
Los datos de investigación de prospectos (calificaciones de DonorSearch, puntuaciones de iWave, estimaciones de riqueza) son estrictamente confidenciales.
- NO compartir perfiles de prospectos fuera del departamento de desarrollo sin aprobación de VP
- NO almacenar datos de prospectos en carpetas compartidas de Google Drive accesibles para personal de programa o voluntarios
- Los registros de prospectos de Salesforce/Bloomerang son accesibles solo para personal de desarrollo — verificar permisos de función trimestralmente
- Los resúmenes de prospectos impresos deben ser recopilados y destruidos después de reuniones de junta directiva o comités

## Cuándo ejecutar un análisis
- Prospectos de nuevos miembros de junta directiva antes de votación del comité de nominación
- Prospectos de regalo principal con donación acumulada de $5.000+
- Asistentes a eventos antes de alcance personal en eventos de capacidad $10.000+
- Consultas de sociedad de donación planificada

## Proceso
1. Exportar lista de nombre y dirección desde Salesforce/Bloomerang en formato CSV
2. Cargar al portal de análisis por lotes de DonorSearch (Configuración > Carga por lotes)
3. Permitir 24–48 horas para resultados
4. Descargar resultados e importar calificaciones de nuevo en Salesforce usando la integración de DonorSearch o actualización de campo manual
5. Registrar fecha de análisis en el registro de prospecto
6. Marcar prospectos calificados principales (Calificación DS 5+) para que el oficial de regalos principales prepare un resumen
EOF

# Instalar habilidades sin fines de lucro
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report
```

## Plantilla CLAUDE.md

```markdown
# Operaciones de Organizaciones sin Fines de Lucro — Instrucciones de Claude Code

## Qué es esto

Este es el directorio de trabajo para una organización sin fines de lucro que gestiona programas, recaudación de fondos, relaciones con donantes, redacción y presentación de subvenciones, gobernanza de junta directiva y cumplimiento de IRS.

REGLA DE CONFIDENCIALIDAD DE DONANTES: Los registros de donantes, montos de donaciones, datos de investigación de prospectos (calificaciones de DonorSearch/iWave, estimaciones de riqueza, puntuaciones de capacidad) e intenciones de donaciones planificadas son estrictamente confidenciales. No incluir nombres específicos de donantes, montos de regalos o calificaciones de prospectos en ningún archivo que pudiera ser accedido por voluntarios, pasantes o personal de programa. Los archivos sensibles de desarrollo viven bajo fundraising/major-gift-prospects.md y fundraising/prospect-research/ — trate estos como restringidos.

REGLA DE PRIVACIDAD DE PARTICIPANTES: Los nombres de participantes del programa, información de contacto, datos demográficos y registros de resultados son información de identificación personal (PII). Estos datos viven en Salesforce NPSP o la base de datos del programa — no en este espacio de trabajo. Las plantillas solo usan marcadores de posición entre corchetes.

## Stack

- Salesforce Nonprofit Success Pack (NPSP) — CRM de donantes; todos los registros de donantes e historial de donaciones viven aquí
- Bloomerang — CRM alternativo si se usa; puntuación de retención, línea de tiempo de compromiso, informes de donantes inactivos
- Mailchimp / Constant Contact — campañas de correo electrónico, envíos de boletines, invitaciones a eventos, secuencias de apelación
- QuickBooks Nonprofit — contabilidad de fondos; códigos de gastos de subvenciones, seguimiento de fondos restringidos, exportaciones de preparación 990
- Google Workspace — Docs, Drive, Sheets, Calendar para colaboración interna y almacenamiento de documentos
- Canva — diseño de informe anual, gráficos de historias de impacto, activos de redes sociales, portadas de subvenciones
- Zoom — reuniones de junta directiva, eventos de cultivo de donantes, entrega de programa virtual
- DonorSearch / iWave — análisis de riqueza de prospectos y calificaciones de capacidad filantrópica (solo equipo de desarrollo)
- Submittable / Fluxx — portal de envío de solicitudes de subvenciones para fundaciones y financiadores gubernamentales

## Calendario de plazos de subvenciones

Ver grants/grant-calendar.md — esta es la única fuente confiable para todos los plazos de subvenciones.
Revisar y actualizar este archivo cada lunes por la mañana. Cuando se confirma una nueva oportunidad de subvención:
1. Agregar una fila a grant-calendar.md con financiador, monto, plazo, escritor asignado y fecha de informe vencido
2. Crear una subcarpeta bajo grants/active-grants/ usando la convención de nomenclatura [funder-kebab-case]-[fiscal-year]
3. Agregar la subvención a grants/active-grants/README.md con el código de subvención de QuickBooks
4. Bloquear la fecha de envío en Google Calendar 30 días y 7 días

Plazos clave:
- Formulario IRS 990: vencimiento 4,5 meses después del cierre del año fiscal (año calendario = 15 de mayo; con prórroga = 15 de noviembre)
- Registros de solicitud de caridad estatales: ver compliance/state-registration-tracker.md
- Auditoría anual: típicamente 3–4 meses después del cierre del año fiscal — ver finance/audit-prep.md

## Cronograma de preparación del IRS 990

- Mes 1 después del cierre del año fiscal: Ejecutar informes de QuickBooks; conciliar todos los códigos de subvención; confirmar saldos de fondos restringidos
- Mes 2: Completar finance/990-prep-checklist.md; recopilar datos de apoyo público del Cronograma A; registrar divulgaciones de conflicto de intereses
- Mes 3: Proporcionar paquete de datos de QuickBooks y documentos de apoyo a auditores/CPA
- Mes 4 (o mes 10 con prórroga): Presentar Formulario 990; publicar en GuideStar/Candid dentro de 30 días de la presentación

## Tareas comunes y comandos exactos

### Redactar una sección de propuesta de subvención
```
/grant-narrative

Financiador: [nombre de fundación]
Sección: [declaración de necesidad / descripción del programa / plan de evaluación / sostenibilidad / capacidad organizacional]
Programa: [nombre del programa]
Prioridades del financiador: [pegar desde directrices del financiador o perfil en grants/funder-research/funder-profiles/]
Datos de resultados: [pegar métricas de resultado relevantes desde programs/[program]/outcomes-tracking.md]
Límite de palabras: [número]
```

### Generar una carta de reconocimiento de donante
```
/donor-acknowledgment

Tipo de obsequio: [efectivo / stock / en especie / regalo coincidente / notificación de regalo planificado]
Monto del obsequio: $[monto] (dejar en blanco para regalos sin efectivo sin tasación)
Fondo/propósito: [sin restricciones / [nombre del programa] restringido]
Tipo de donante: [individual / pareja / fundación / corporativo]
Lenguaje IRS requerido: [sí — no se proporcionaron bienes o servicios / sí — el valor del boleto de evento fue de $X]
Notas de personalización: [cualquier contexto especial — por ejemplo, regalo conmemorativo, donante por primera vez, miembro de junta directiva]
```

### Escribir un informe de progreso o final del financiador
```
/grant-report

Financiador: [nombre de fundación]
Tipo de informe: [provisional / final]
Período de subvención: [fechas]
Propósito aprobado: [pegar desde grants/active-grants/[folder]/grant-agreement.md]
Actividades completadas: [pegar desde programs/[program]/activities.md]
Resultados alcanzados versus objetivos: [pegar desde programs/[program]/outcomes-tracking.md]
Resumen presupuestario: [gastos versus presupuesto aprobado — desde informe de gastos de subvención de QuickBooks]
Límite de palabras: [número]
```

### Crear un perfil de prospecto de regalo principal
```
/prospect-profile

Nombre del prospecto: [nombre]
Calificación de DonorSearch: [1–10] / Puntuación de iWave: [RFM o estimación de capacidad]
Donación anterior a la organización: [montos y años — desde Salesforce/Bloomerang]
Empleo: [empleador, título]
Conexiones de junta directiva o comunidad: [relaciones conocidas con miembros de junta directiva o personal]
Intereses filantrópicos: [donaciones conocidas a otras organizaciones — desde datos 990 o DonorSearch]
Rango de solicitud sugerido: [$X–$Y]
```

### Redactar una historia de impacto desde notas de entrevista de personal
```
/impact-story

Programa: [nombre del programa]
Fuente de historia: [pegar notas de entrevista de personal o citas clave — usar solo nombre o seudónimo del participante]
Estado de consentimiento: [liberación firmada en archivo / anonimizada — sin detalles identificadores]
Resultados a destacar: [qué resultados del programa ilustra esta historia]
Uso previsto: [informe anual / boletín / solicitud de subvención / redes sociales]
Recuento de palabras objetivo: [150–300 / 300–500 / 500–800]
```

### Reunir un informe de junta directiva
```
/board-report

Período de informe: [mes o trimestre]
Actualizaciones del programa: [pegar resaltados de directores de programa — actividades, resultados, inscripción]
Resumen financiero: [pegar presupuesto versus real desde informe mensual de QuickBooks]
Actualización de recaudación de fondos: [YTD recaudado versus objetivo, regalos principales cerrados, próximos eventos]
Tubería de subvenciones: [pegar desde grants/grant-calendar.md]
Elementos de acción necesarios: [decisiones o votaciones requeridas en esta reunión]
```

### Generar un mensaje de segmentación de donantes
```
/donor-segment

Segmento: [donantes principales $10K+ / nivel medio $1K–$9.999 / fondo anual / inactivos 13–24 meses / donantes nuevos]
Tipo de mensaje: [apelación de fin de año / campaña de primavera / invitación a evento / actualización de impacto / administración]
Tema de campaña: [descripción breve de la narrativa de campaña]
Solicitud específica: [sugerencia de monto de regalo, monto de mejora o RSVP de evento]
```

## Convenciones a seguir

- El calendario de subvenciones (grants/grant-calendar.md) se actualiza todos los lunes; nunca dejar pasar un plazo sin una alerta de 30 días
- Cada subvención activa tiene una subcarpeta bajo grants/active-grants/ nombrada [funder-kebab-case]-[fiscal-year]
- Los códigos de subvención de QuickBooks siguen el formato GR-[AAAA]-[###] — asignar secuencialmente cada año fiscal
- Las cartas de reconocimiento de donantes deben incluir lenguaje IRS 501(c)(3): no se proporcionaron bienes o servicios a cambio (o indicar el valor justo de mercado de cualquier beneficio recibido)
- Las historias de impacto requieren un formulario de liberación de participante firmado antes de la publicación — referencia el archivo en communications/impact-stories/impact-story-sop.md
- Los materiales de reunión de junta directiva se cargan en la carpeta de Google Drive de junta directiva al menos 5 días antes de cada reunión
- Los resúmenes de investigación de prospectos se etiquetan CONFIDENCIAL y no se guardan en unidades compartidas accesibles para personal no de desarrollo
- Los nuevos perfiles de financiadores van en grants/funder-research/funder-profiles/ usando la convención de nomenclatura [funder-kebab-case].md
- La preparación del 990 comienza en el Mes 1 después del cierre del año fiscal — ver finance/990-prep-checklist.md para el cronograma completo
```

## Servidores MCP

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@salesforce/mcp-server"],
      "env": {
        "SF_LOGIN_URL": "https://login.salesforce.com",
        "SF_USERNAME": "your-salesforce-username",
        "SF_PASSWORD": "your-salesforce-password",
        "SF_SECURITY_TOKEN": "your-salesforce-security-token"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/nonprofit-operations"
      ]
    },
    "mailchimp": {
      "command": "npx",
      "args": ["-y", "@mailchimp/mcp-server"],
      "env": {
        "MAILCHIMP_API_KEY": "your-mailchimp-api-key",
        "MAILCHIMP_SERVER_PREFIX": "us1"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/grant-calendar\"; then echo \"[grants] grant-calendar.md actualizado — verificar que todos los plazos tengan eventos de Google Calendar 30 días y 7 días\"; fi'"
          },
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/active-grants\"; then echo \"[grants] Archivo de subvención activa actualizado — confirmar que el código de subvención de QuickBooks en grants/active-grants/README.md coincida con finance/grant-expense-tracking.md\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'python3 -c \"\nimport datetime, re\ntry:\n    with open(\\\"grants/grant-calendar.md\\\") as f:\n        content = f.read()\n    today = datetime.date.today()\n    lines = content.split(\\\"\\\\n\\\")\n    warnings = []\n    for line in lines:\n        dates = re.findall(r\\\"(\\\\d{4}-\\\\d{2}-\\\\d{2})\\\", line)\n        for d in dates:\n            delta = (datetime.date.fromisoformat(d) - today).days\n            if 0 < delta <= 30:\n                warnings.append(f\\\"PLAZO EN {delta} DÍAS: {line.strip()}\\\")\n    if warnings:\n        print(\\\"[grant-deadline-alert] \\\" + \\\"\\\\n\\\".join(warnings))\nexcept:\n    pass\n\" 2>/dev/null'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -qE \"fundraising/major-gift-prospects|prospect-research\"; then echo \"[confidencialidad] Escritura en un archivo confidencial de donantes. Confirmar que este archivo no está en una carpeta de Google Drive compartida con voluntarios o personal de programa antes de proceder.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
# Redacción de subvenciones e informes
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report

# Comunicaciones de donantes y recaudación de fondos
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/lesson-planner

# Junta directiva y gobernanza
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/doc-site-builder

# Gestión de programas y resultados
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/interview-scorecard
```

## Relacionado

- [Guía de operaciones sin fines de lucro](../guides/for-nonprofit-operations.md)
- [Flujo de trabajo de redacción de subvenciones](../workflows/grant-writing-workflow.md)
- [Flujo de trabajo de administración de donantes](../workflows/donor-stewardship-workflow.md)
- [Flujo de trabajo de preparación del IRS 990](../workflows/990-prep-workflow.md)

---

🔗 **[Uitbreiden — construyendo productos de IA y herramientas B2B con comunidades de desarrolladores.](https://uitbreiden.com/)**
📺 **[Suscríbase a nuestro canal de YouTube para más análisis profundos](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
