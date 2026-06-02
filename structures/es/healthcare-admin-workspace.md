# Espacio de Trabajo de Administrador de Salud — Estructura de Proyecto

> Para un administrador de salud que gestiona operaciones clínicas, programación, autorizaciones previas, verificación de seguros, cumplimiento normativo y comunicaciones con pacientes — sin almacenamiento de PHI fuera del EHR.

## Stack

- **Epic** o **Athenahealth** — Sistema EHR/PM de referencia; todos los datos específicos del paciente viven aquí exclusivamente
- **Google Workspace** (Gmail, Docs, Drive, Calendar) — comunicaciones externas, almacenamiento de documentos, coordinación de programación
- **Microsoft Teams** o **Slack** — comunicaciones internas del personal, canales departamentales, solicitudes de cobertura de turnos
- **DocuSign** — enrutamiento de formularios de consentimiento, firma de contratos con proveedores, seguimiento de confirmación de políticas
- **Zoom** — coordinación de visitas de telesalud, sesiones de capacitación del personal, reuniones con proveedores
- **QuickBooks** — conciliación de facturación, contabilización de pagos de reclamaciones, seguimiento de denegaciones, gestión de facturas de proveedores
- **Claude Code** — redacción de autorización previa, listas de verificación de cumplimiento, generación de cartas a pacientes, escritura de POS, documentos de incorporación del personal

## Árbol de directorios

```
healthcare-admin-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones del espacio de trabajo — reglas PHI, comandos, convenciones
│   ├── settings.json                          # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── patient-intake.md                  # /patient-intake — generar lista de verificación del paquete de admisión y plantilla de carta de bienvenida
│       ├── prior-auth.md                      # /prior-auth — redactar carta de solicitud de autorización previa a partir de criterios clínicos
│       ├── insurance-verify.md                # /insurance-verify — lista de verificación de verificación de seguros y script de seguimiento
│       ├── compliance-check.md                # /compliance-check — ejecutar lista de verificación de cumplimiento HIPAA/CMS contra un proceso
│       ├── staff-schedule.md                  # /staff-schedule — generar plan de cobertura de turno o plantilla de rotación de guardia
│       ├── patient-letter.md                  # /patient-letter — redactar recordatorios de cita, instrucciones de alta o cartas de referencia
│       └── incident-report.md                 # /incident-report — plantilla de informe de incidente estructurada con campos de análisis de causa raíz
├── patients/
│   ├── README.md                              # CRÍTICO: política PHI — sin nombres de pacientes, DOB, MRN o diagnóstico almacenado aquí
│   ├── templates/
│   │   ├── welcome-letter-template.md         # Carta de bienvenida para nuevo paciente — solo marcador de posición [NOMBRE], sin datos reales de paciente
│   │   ├── appointment-reminder-template.md   # Recordatorio de cita — campos de fecha/hora/ubicación; fusionar desde Epic
│   │   ├── discharge-instructions-template.md # Instrucciones de alta post-visita — genéricas por categoría de condición
│   │   ├── referral-letter-template.md        # Carta de referencia a especialista — estructura de marcador de posición de resumen clínico
│   │   ├── no-show-follow-up-template.md      # Carta de seguimiento después de cita perdida
│   │   ├── payment-plan-letter-template.md    # Carta de oferta de plan de pago por dificultades financieras
│   │   └── prior-auth-denial-appeal.md        # Plantilla de carta de apelación para denegaciones de autorización previa de seguros
│   ├── intake/
│   │   ├── new-patient-checklist.md           # Lista de verificación administrativa: tarjeta de seguros, identificación con foto, formularios de consentimiento, datos demográficos
│   │   ├── insurance-verification-sop.md      # Proceso paso a paso de verificación de elegibilidad de seguros
│   │   ├── intake-packet-contents.md          # Lista de formularios en paquete de nuevo paciente — referencias de IDs de sobre DocuSign
│   │   └── intake-workflow-diagram.md         # Diagrama de flujo de pasos de admisión desde check-in hasta triaje
│   └── discharge/
│       ├── discharge-checklist.md             # Pasos administrativos al alta: resumen post-visita, programación de seguimiento, referencias
│       ├── referral-tracking-log.md           # Registro de referencias pendientes por fecha enviada — sin PHI; rastrear solo por número de caso
│       └── telehealth-discharge-sop.md        # Lista de verificación de envoltura de visita de telesalud en Zoom y script de soporte técnico
├── compliance/
│   ├── hipaa/
│   │   ├── hipaa-checklist-annual.md          # Lista de verificación anual de auditoría de regla de seguridad y privacidad HIPAA
│   │   ├── hipaa-checklist-new-hire.md        # Lista de verificación de verificación de capacitación HIPAA del nuevo empleado
│   │   ├── phi-access-log-template.md         # Plantilla para registro de solicitudes de acceso a PHI y divulgaciones (completar en EHR)
│   │   ├── breach-notification-sop.md         # Procedimiento paso a paso de notificación de incumplimiento — informes de HHS OCR, aviso a paciente
│   │   ├── minimum-necessary-policy.md        # Documento de política: estándar de mínimo necesario para uso y divulgación de PHI
│   │   └── business-associate-agreement-log.md # Rastreador de BAA activos — nombre del proveedor, fecha de firma, fecha de renovación
│   ├── cms/
│   │   ├── cms-conditions-of-participation.md # Lista de verificación de CoP de CMS para cumplimiento de atención ambulatoria
│   │   ├── meaningful-use-checklist.md        # Rastreador de requisito de presentación de informes MIPS/APM por trimestre
│   │   └── quality-measure-tracker.md         # Registro mensual de rendimiento de medida de calidad (solo agregado de-identificado)
│   ├── audits/
│   │   ├── audit-log.md                       # Registro en ejecución de auditorías internas y externas — fecha, alcance, hallazgos, estado
│   │   ├── corrective-action-plan-template.md # Plantilla CAP para hallazgos de auditoría — hallazgo, propietario, fecha de vencimiento, evidencia
│   │   └── mock-survey-checklist.md           # Preparación interna de encuesta simulada — preguntas, documentación requerida, propietario
│   └── policies/
│       ├── policy-index.md                    # Índice maestro de políticas activas — nombre, fecha efectiva, fecha de revisión, propietario
│       ├── privacy-policy-summary.md          # Resumen en lenguaje simple de Aviso de Prácticas de Privacidad
│       ├── security-incident-policy.md        # Política de respuesta a incidentes de seguridad y ruta de escalación
│       └── telehealth-consent-policy.md       # Requisitos de consentimiento informado de telesalud por estado
├── scheduling/
│   ├── shift-templates/
│   │   ├── weekday-shift-template.md          # Bloques de turno estándar L-V — MA, recepción, proveedor, facturación
│   │   ├── weekend-shift-template.md          # Plantilla de rotación de cobertura de fin de semana/feriados
│   │   ├── on-call-rotation-template.md       # Plantilla de programación de guardia — roles, jerarquía de contactos, escalación
│   │   └── coverage-request-template.md       # Formulario de solicitud de cobertura de turno — motivo, fechas, socio de intercambio preferido
│   ├── sops/
│   │   ├── scheduling-sop.md                  # POS de programación de citas — reglas de reserva, tipos de ranura, políticas de retención
│   │   ├── cancellation-sop.md                # Manejo de cancelación y no comparecencia — lista de espera, reprogramación, indicadores de facturación
│   │   ├── provider-template-sop.md           # Cómo crear y modificar plantillas de programación de proveedores en Epic/Athena
│   │   └── telehealth-scheduling-sop.md       # Programación de visita de telesalud — generación de enlace de Zoom, pasos de preparación del paciente
│   └── coverage-log.md                        # Registro en ejecución de turnos abiertos, cobertura confirmada y escalaciones
├── billing/
│   ├── claim-templates/
│   │   ├── clean-claim-checklist.md           # Lista de verificación previa a la presentación de reclamación limpia — campos requeridos por pagador
│   │   ├── secondary-claim-template.md        # Pasos de presentación de reclamación secundaria de coordinación de beneficios
│   │   └── superbill-review-checklist.md      # Lista de verificación de auditoría de superbill — diagnóstico, modificador, lugar de servicio
│   ├── denials/
│   │   ├── denial-appeal-sop.md               # Proceso paso a paso de apelación de denegación — cronogramas específicos del pagador, documentación requerida por código de denegación
│   │   ├── denial-code-reference.md           # Códigos de denegación comunes (CO-4, CO-97, PR-96, etc.) con pasos de resolución
│   │   ├── appeal-letter-library/
│   │   │   ├── medical-necessity-appeal.md    # Plantilla de apelación para denegaciones por falta de necesidad médica
│   │   │   ├── timely-filing-appeal.md        # Plantilla de apelación para denegaciones de presentación oportuna con prueba de presentación oportuna
│   │   │   ├── authorization-retro-appeal.md  # Plantilla de apelación de autorización retroactiva
│   │   │   └── duplicate-claim-appeal.md      # Apelación de reclamación duplicada con prueba de servicio distinto
│   │   └── denial-tracker.md                  # Registro de seguimiento de denegación — pagador, código de denegación, fecha, estado (sin PHI — solo número de caso)
│   ├── reconciliation/
│   │   ├── daily-reconciliation-sop.md        # Reconciliación de fin de día de efectivo, cheque y tarjeta con pasos de QuickBooks
│   │   ├── era-posting-sop.md                 # Flujo de trabajo de contabilización de Aviso Electrónico de Remitencia — ERA a QuickBooks
│   │   ├── monthly-close-checklist.md         # Lista de verificación de cierre de facturación de fin de mes — reclamaciones pendientes, cancelaciones, informes
│   │   └── payer-contract-rate-sheet.md       # Tasas contratadas por pagador y rango de código CPT (documento de referencia sin PHI)
│   └── payers/
│       ├── payer-contact-directory.md         # Contactos de pagador de seguros — relaciones de proveedores, estado de reclamación, líneas de autorización
│       └── payer-portal-login-sop.md          # Pasos de acceso del portal del pagador — no almacenar credenciales aquí; usar gestor de contraseñas
├── staff/
│   ├── onboarding/
│   │   ├── new-hire-checklist.md              # Lista de verificación de incorporación de 1-90 días — acceso de TI, credencial, capacitación, consentimiento HIPAA
│   │   ├── hipaa-training-checklist.md        # Rastreador de finalización de capacitación HIPAA — rol, fecha completada, certificación
│   │   ├── epic-access-request-sop.md         # Pasos paso a paso de solicitud de acceso basado en roles de Epic y aprovisionamiento
│   │   ├── athenahealth-access-request-sop.md # Pasos de configuración de usuario de Athenahealth y asignación de rol
│   │   └── welcome-email-template.md          # Plantilla de correo electrónico de bienvenida para nuevo empleado — logística del primer día
│   ├── training/
│   │   ├── training-calendar.md               # Sesiones de capacitación del personal programadas — tema, fecha, requerido frente a opcional
│   │   ├── competency-checklist-ma.md         # Lista de verificación de verificación de competencia del asistente médico
│   │   ├── competency-checklist-front-desk.md # Lista de verificación de competencia del personal de recepción — programación, registro, copago
│   │   └── in-service-log.md                  # Registro de sesiones de capacitación en servicio completadas y asistentes
│   └── performance/
│       ├── performance-review-template.md     # Plantilla de revisión de desempeño del personal semestral
│       └── corrective-action-template.md      # Plantilla de documentación de acción correctiva
├── vendors/
│   ├── vendor-contract-log.md                 # Contratos de proveedores activos — proveedor, servicio, plazo, fecha de renovación, ¿BAA requerido?
│   ├── vendor-contact-directory.md            # Contactos clave de proveedor — soporte Epic/Athena, DocuSign, Zoom, QuickBooks
│   ├── docusign-sop.md                        # Configuración de sobre DocuSign, enrutamiento de formularios de consentimiento, recuperación de pista de auditoría
│   └── zoom-telehealth-setup-sop.md           # Configuración de Zoom para Salud — BAA HIPAA, sala de espera, política de grabación
└── templates/
    ├── letters/
    │   ├── prior-auth-request-letter.md       # Carta de solicitud de autorización previa — estructura de marcador de posición de justificación clínica
    │   ├── prior-auth-appeal-letter.md        # Apelación de autorización previa — versiones de solicitud de revisión por pares y apelación escrita
    │   ├── insurance-verification-script.md   # Script telefónico para llamadas de verificación de elegibilidad de seguros
    │   ├── collections-letter-template.md     # Carta de cobro de saldo de paciente — primer aviso, segundo aviso
    │   └── provider-credentialing-letter.md   # Plantilla de carta de presentación para presentaciones de acreditación de pagador
    ├── forms/
    │   ├── consent-form-checklist.md          # Formularios de consentimiento requeridos por tipo de visita — enlaces a plantillas DocuSign
    │   └── release-of-information-log.md      # Registro de solicitud ROI — fecha, tipo de solicitante, estado (sin PHI — usar solo número de caso)
    └── sops/
        ├── sop-template.md                    # Plantilla POS maestra — propósito, alcance, pasos, propietario, fecha de revisión
        └── sop-index.md                       # Índice de todos los POS activos — nombre, propietario, última revisión, ubicación
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/prior-auth.md` | Comando de barra que redacta una carta de solicitud de autorización previa utilizando criterios clínicos — toma el nombre del pagador, procedimiento y justificación clínica como entrada; nunca incluye identificadores reales del paciente |
| `.claude/commands/compliance-check.md` | Comando de barra que ejecuta una lista de verificación de cumplimiento HIPAA o CMS contra un proceso descrito — devuelve aprobación/fallo por elemento y acciones correctivas recomendadas |
| `.claude/commands/incident-report.md` | Comando de barra que genera una plantilla de informe de incidente estructurada con campos de análisis de causa raíz, sección de cronología y andamiaje de plan de acción correctiva |
| `compliance/hipaa/breach-notification-sop.md` | Procedimiento paso a paso de respuesta a incumplimiento que cubre cronograma de informes de OCR de HHS (regla de 60 días), requisitos de notificación de paciente y documentación a retener |
| `billing/denials/denial-appeal-sop.md` | Proceso de apelación de denegación autorizado con cronogramas específicos del pagador, documentación requerida por categoría de código de denegación y ruta de escalación a revisión entre pares |
| `billing/denials/appeal-letter-library/` | Plantillas de cartas de apelación listas para usar para las cuatro categorías de denegación más comunes — reduce el tiempo de redacción de 30 minutos a menos de 5 minutos por apelación |
| `patients/README.md` | Aviso de aplicación de política PHI — el archivo más importante; establece la regla de que los datos específicos del paciente (nombre, DOB, MRN, diagnóstico) nunca se almacenan en este espacio de trabajo |
| `compliance/policies/policy-index.md` | Índice maestro de todas las políticas activas con fechas efectivas y fechas de revisión — utilizado durante auditorías y encuestas simuladas para confirmar la vigencia de la política |
| `scheduling/sops/scheduling-sop.md` | POS de programación canónico que cubre reglas de reserva, tipos de ranura de plantilla, políticas de retención y cancelación y escalación para adiciones urgentes del mismo día |
| `staff/onboarding/new-hire-checklist.md` | Lista de verificación de incorporación de 1-90 días que cubre aprovisionamiento de acceso de TI, consentimiento de capacitación HIPAA, acceso Epic/Athena, credencial y controles de 30/60/90 días |

## Andamiaje rápido

```bash
# Crear la raíz del espacio de trabajo
mkdir -p healthcare-admin-workspace

# Crear estructura .claude
mkdir -p healthcare-admin-workspace/.claude/commands

# Crear directorios de plantilla de paciente (SIN PHI — solo plantillas)
mkdir -p healthcare-admin-workspace/patients/templates
mkdir -p healthcare-admin-workspace/patients/intake
mkdir -p healthcare-admin-workspace/patients/discharge

# Crear directorios de cumplimiento
mkdir -p healthcare-admin-workspace/compliance/hipaa
mkdir -p healthcare-admin-workspace/compliance/cms
mkdir -p healthcare-admin-workspace/compliance/audits
mkdir -p healthcare-admin-workspace/compliance/policies

# Crear directorios de programación
mkdir -p healthcare-admin-workspace/scheduling/shift-templates
mkdir -p healthcare-admin-workspace/scheduling/sops

# Crear directorios de facturación
mkdir -p healthcare-admin-workspace/billing/claim-templates
mkdir -p healthcare-admin-workspace/billing/denials/appeal-letter-library
mkdir -p healthcare-admin-workspace/billing/reconciliation
mkdir -p healthcare-admin-workspace/billing/payers

# Crear directorios de personal
mkdir -p healthcare-admin-workspace/staff/onboarding
mkdir -p healthcare-admin-workspace/staff/training
mkdir -p healthcare-admin-workspace/staff/performance

# Crear directorios de proveedores y plantillas
mkdir -p healthcare-admin-workspace/vendors
mkdir -p healthcare-admin-workspace/templates/letters
mkdir -p healthcare-admin-workspace/templates/forms
mkdir -p healthcare-admin-workspace/templates/sops

# Sembrar el README de política PHI
cat > healthcare-admin-workspace/patients/README.md << 'EOF'
# CRÍTICO: POLÍTICA DE PHI

Este directorio contiene SOLO ARCHIVOS DE PLANTILLA.

NO ALMACENAR ninguno de los siguientes en este espacio de trabajo:
- Nombres de pacientes
- Fechas de nacimiento (DOB)
- Números de registro médico (MRN)
- Números de Seguro Social
- Diagnósticos o códigos de procedimiento vinculados a un individuo
- IDs de miembro de seguros vinculados a un individuo
- Cualquier información que pueda identificar a un paciente específico

Todo el trabajo específico del paciente debe realizarse y almacenarse en Epic o Athenahealth.
Las plantillas aquí utilizan campos de marcador de posición (p. ej., [NOMBRE DEL PACIENTE], [FECHA]) solamente.
La violación de esta política es un riesgo de incumplimiento de HIPAA. Escale preguntas al Oficial de Privacidad.
EOF

# Instalar habilidades de administrador de salud
npx claudient add skill legal/compliance-tracker
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/sop-writer
npx claudient add skill productivity/team-onboarding

# Copiar comandos de existencia en .claude/commands/
npx claudient add skill legal/compliance-tracker --output healthcare-admin-workspace/.claude/commands/compliance-check.md
npx claudient add skill productivity/sop-writer --output healthcare-admin-workspace/.claude/commands/prior-auth.md
npx claudient add skill productivity/process-mapper --output healthcare-admin-workspace/.claude/commands/patient-intake.md
npx claudient add skill productivity/team-onboarding --output healthcare-admin-workspace/.claude/commands/staff-schedule.md
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo de Administrador de Salud — Instrucciones de Claude Code

## Qué es esto

Este es el directorio de trabajo para un administrador de salud que gestiona operaciones clínicas,
programación, autorizaciones previas, verificación de seguros, cumplimiento normativo y comunicaciones con pacientes.

REGLA CRÍTICA: NO se almacena PHI de pacientes (nombres, DOB, MRN, diagnóstico, ID de miembro de seguros, SSN)
en este espacio de trabajo. Todo el trabajo específico del paciente debe permanecer en Epic o Athenahealth.
Este espacio de trabajo contiene solo plantillas, POS, listas de verificación de cumplimiento y documentación del personal.
Si se le pide que escriba o almacene datos específicos del paciente aquí, rechace y redirija al EHR.

## Stack

- Epic o Athenahealth — Sistema EHR/PM de referencia; fuente de todos los datos específicos del paciente
- Google Workspace — Gmail, Docs, Drive para comunicaciones externas y almacenamiento de documentos
- Microsoft Teams o Slack — comunicaciones internas del personal y coordinación de cobertura de turnos
- DocuSign — enrutamiento de formularios de consentimiento, contratos de proveedores, sobres de confirmación de política
- Zoom para Salud — visitas de telesalud (BAA HIPAA en vigor); ver vendors/zoom-telehealth-setup-sop.md
- QuickBooks — conciliación de facturación y seguimiento de pagos de denegación

## Tareas comunes y comandos exactos

### Redactar una carta de solicitud de autorización previa
```
/prior-auth

Pagador: [nombre del pagador, p. ej., Aetna, UnitedHealthcare]
Procedimiento: [código CPT y descripción]
Justificación clínica: [pegar criterios clínicos de-identificados — sin nombre de paciente o MRN]
Urgencia: [rutina / urgente / emergente]
```

### Ejecutar una lista de verificación de cumplimiento en un proceso
```
/compliance-check

Proceso: [describe el flujo de trabajo a auditar, p. ej., "registro de nuevo paciente y verificación de seguros"]
Regulación: [Regla de Privacidad HIPAA / Regla de Seguridad HIPAA / Condiciones de Participación de CMS / MIPS]
Brechas conocidas: [cualquier problema ya identificado, o "ninguno"]
```

### Generar un horario de personal o plan de cobertura
```
/staff-schedule

Rol: [MA / recepción / facturación / proveedor]
Fechas: [rango de fechas o semana de]
Restricciones: [cualquier personal fuera, requisitos de certificación, superposición necesaria]
Plantilla: [día de semana / fin de semana / guardia]
```

### Redactar una carta de correspondencia con el paciente (solo plantilla — sin PHI)
```
/patient-letter

Tipo de carta: [recordatorio de cita / instrucciones de alta / referencia / seguimiento de no comparecencia / plan de pago]
Categoría de condición: [p. ej., post-quirúrgico, gestión de condición crónica, atención preventiva — solo genérica]
Instrucciones especiales: [cualquier contexto sin PHI sobre tono, divulgaciones requeridas o nivel de lectura]
```

### Redactar una carta de apelación de denegación de autorización previa
```
/prior-auth

Modo: apelación
Pagador: [nombre del pagador]
Código de denegación: [código y descripción, p. ej., "CO-197: falta de precertificación"]
Procedimiento: [código CPT y descripción]
Tipo de apelación: [apelación escrita / solicitud de revisión entre pares]
Fundamento clínico: [justificación clínica de-identificada — sin identificadores de paciente]
```

### Generar un script de verificación de seguros
```
/insurance-verify

Pagador: [nombre del pagador]
Tipo de visita: [nuevo paciente / paciente establecido / especialista / telesalud]
Campos clave a verificar: [elegibilidad, deducible, copago, coaseguro, ¿autorización requerida S/N?, ¿referencia requerida S/N?]
```

### Generar un informe de incidente
```
/incident-report

Tipo de incidente: [incidente de privacidad / evento de seguridad / error de facturación / falla de equipo / queja del personal]
Fecha del incidente: [fecha]
Ubicación: [departamento o área — sin nombres de pacientes]
Descripción: [qué pasó — de-identificado]
Acciones inmediatas tomadas: [lista]
```

### Generar una lista de verificación de admisión de pacientes
```
/patient-intake

Tipo de visita: [nuevo paciente / bienestar anual / consulta de especialista / telesalud]
Tipo de pagador: [comercial / Medicare / Medicaid / auto-pago]
Requisitos especiales: [p. ej., paciente menor, intérprete necesario, acomodación de discapacidad]
```

## Convenciones a seguir

- REGLA PHI: Nunca escriba nombres de pacientes, DOB, MRN, diagnósticos o IDs de seguros en ningún archivo en este espacio de trabajo
- Todas las cartas y formularios utilizan marcadores de posición entre corchetes ([NOMBRE DEL PACIENTE], [FECHA], [NOMBRE DEL PROVEEDOR]) — datos reales se fusionan desde Epic/Athena
- Los archivos POS siguen la plantilla en templates/sops/sop-template.md — cada POS tiene propósito, alcance, pasos, propietario y fecha de revisión
- Las cartas de apelación de denegación viven en billing/denials/appeal-letter-library/ — agregue nuevas plantillas cuando emerjan nuevos patrones de denegación
- Las listas de verificación de cumplimiento en compliance/ se revisan en un cronograma continuo documentado en compliance/policies/policy-index.md
- Los nuevos contratos de proveedores se registran en vendors/vendor-contract-log.md dentro de 48 horas de la firma, incluyendo estado de BAA
- Las tareas de incorporación del personal se rastrean en staff/onboarding/new-hire-checklist.md — no marque como completado hasta que se firme la certificación
- Las confirmaciones de cobertura de turno se registran en scheduling/coverage-log.md con la fecha y miembro del personal confirmador
- Todas las cartas de apelación incluyen el número de reclamación o caso — nunca la información de identificación del paciente — para que el pagador pueda ubicar la reclamación
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
        "/Users/your-username/healthcare-admin-workspace"
      ]
    }
  }
}
```

## Hooks recomendados

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -qE \"patients/\"; then python3 -c \"import sys,re; content=open(sys.argv[1]).read() if __import__(\\\"os\\\").path.exists(sys.argv[1]) else \\\"\\\"; phi_patterns=[r\\\"\\\\b\\\\d{4}-\\\\d{2}-\\\\d{2}\\\\b\\\",r\\\"\\\\bMRN[:\\\\s]\\\\s*\\\\d+\\\",r\\\"\\\\bDOB[:\\\\s]\\\",r\\\"\\\\bSSN[:\\\\s]\\\\s*\\\\d\\\"]; found=[p for p in phi_patterns if re.search(p,content)]; sys.exit(1) if found else sys.exit(0)\" \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || echo \"[PHI GUARD] Patrón PHI potencial detectado en archivo patients/ — revise antes de guardar. Todos los datos del paciente deben permanecer en el EHR.\"; fi'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"compliance/\"; then echo \"[compliance] Archivo actualizado: $FILE — compruebe compliance/policies/policy-index.md si se trata de una política nueva o revisada\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DOW=$(date +%u); if [ \"$DOW\" = \"5\" ]; then echo \"[reminder] Lista de verificación del viernes: confirme que las apelaciones de denegación de esta semana se registren en billing/denials/denial-tracker.md, la cobertura de turno abierto se confirme en scheduling/coverage-log.md y cualquier nuevo contrato de proveedor se ingrese en vendors/vendor-contract-log.md\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
# Habilidades principales de administrador de salud
npx claudient add skill legal/compliance-tracker
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/sop-writer
npx claudient add skill productivity/team-onboarding

# Habilidades de productividad de apoyo
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/exec-briefing
```

## Relacionado

- [Guía de Administrador de Salud](../guides/for-healthcare-admin.md)
- [Flujo de trabajo de autorización previa](../workflows/prior-auth-workflow.md)
- [Flujo de trabajo de auditoría de cumplimiento HIPAA](../workflows/hipaa-compliance-audit.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
