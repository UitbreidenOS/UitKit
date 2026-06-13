# Claude Cowork — IA agente GUI para equipos no técnicos

Claude Cowork es la versión basada en GUI de las capacidades agentes de Claude — sin terminal, sin código, sin configuración requerida. Está construido para PMs, especialistas en marketing, equipos de finanzas y propietarios de pequeños negocios que necesitan asistencia de IA autónoma sin configuración de desarrollador. Donde Claude Code opera en una terminal, Cowork opera a través de una interfaz de escritorio y web point-and-click respaldada por la misma capacidad de agente subyacente.

---

## Qué es Cowork vs. Claude Code

| Característica | Claude Cowork | Claude Code |
|---------|--------------|-------------|
| Interfaz | GUI web + escritorio | CLI de terminal |
| Requisito técnico | Ninguno | Cómodo con terminal |
| Acceso a archivos | Carpeta seleccionada por usuario (selector GUI) | Árbol del directorio actual |
| Conectores | Google Drive, Gmail, Docusign, FactSet | Servidores MCP (configuración manual) |
| Comandos de barra diagonal | Formularios estructurados (completa campos) | Comandos de texto sin formato |
| Automatización | Flujos de trabajo click-to-configure | Hooks + settings.json |
| Audiencia | Equipos no técnicos | Desarrolladores |
| Delegación de agentes | Tarjetas de agentes visuales | Subagentes vía CLAUDE.md |

Ambos utilizan los mismos modelos de Claude. Cowork es la experiencia del operador; Claude Code es la experiencia del desarrollador.

---

## Configuración de conectores

Cowork se conecta a herramientas externas mediante conectores — integraciones basadas en OAuth configuradas una sola vez desde el panel de configuración de Cowork. Sin claves API, sin archivos de configuración.

| Conector | Qué puede hacer Claude |
|-----------|-------------------|
| Google Drive | Leer/escribir archivos y carpetas, buscar por contenido |
| Gmail | Leer correos electrónicos, redactar respuestas, enviar con aprobación |
| Google Calendar | Ver y crear eventos, encontrar disponibilidad |
| Google Sheets | Leer y actualizar datos de hojas de cálculo |
| Docusign | Enviar documentos para firma, rastrear estado |
| FactSet | Consultas de datos financieros, recuperación de datos de mercado |
| Slack (plugin) | Publicar mensajes, leer canales, buscar historial |
| Linear (plugin) | Crear problemas, actualizar estado, leer tableros de proyecto |

Cada conector requiere autorización OAuth de una sola vez. Claude solo lee o escribe cuando un flujo de trabajo dispara explícitamente esa acción — no consulta conectores en segundo plano.

---

## Comandos de barra diagonal con formularios estructurados

A diferencia de los comandos de texto libre de Claude Code, los comandos de barra diagonal de Cowork abren formularios estructurados que evitan errores y hacen que la automatización sea accesible sin conocimiento de ingeniería de prompts.

```
/generate-report
  ├── Report type:   [Weekly Summary] [Monthly P&L] [Custom]
  ├── Date range:    [from ____] [to ____]
  ├── Include:       [x] Charts  [x] Raw data  [ ] Executive summary
  └── Output format: [PDF] [Google Slides] [Email]

/email-triage
  ├── Inbox:         [Primary] [All labels] [Specific label: ____]
  ├── Action:        [Summarize] [Draft replies] [Categorize + tag]
  └── Approval:      [Auto-send] [Review before send]

/meeting-prep
  ├── Meeting:       [pull from calendar ▼]
  ├── Context docs:  [attach from Drive]
  └── Output:        [Briefing doc] [Talking points] [Both]
```

Los comandos personalizados se pueden guardar como flujos de trabajo nombrados y compartir con compañeros de equipo.

---

## Flujos de trabajo comunes de Cowork

### Generación de reportes semanales
Extrae datos de Google Drive y FactSet, genera un PDF formateado y envíalo por correo a una lista de distribución — programado o activado manualmente.

### Triaje de correo electrónico
Lee la bandeja de entrada, categoriza por tema o urgencia, redacta respuestas para hilos de alta prioridad y preséntalo para aprobación de un clic antes de enviar.

### Flujos de trabajo de documentos
Lee contratos en Google Drive, extrae cláusulas clave y fechas, marca anomalías y envía a Docusign para firma con campos completados previamente.

### Preparación de reuniones
Lee el calendario del próximo día, extrae documentos relevantes para cada reunión de Drive y genera un one-pager de resumen que cubra contexto, asistentes y elementos abiertos.

### Resúmenes de standup
Lee la actividad de Slack y actualizaciones de tickets de Linear de las últimas 24 horas, genera un resumen de standup por miembro del equipo y publica en el canal de standup.

### Foto financiera
Consulta FactSet para datos de cartera, extrae valores reales de una hoja de Google y produce una comparación P&L de una página como un deck de Google Slides.

---

## Plugins

Cowork admite plugins — paquetes de flujos de trabajo instalables que agregan nuevos comandos de barra diagonal y conectores. Explora plugins disponibles en la galería de plugins de Cowork.

Instalación de un plugin:
1. Abre configuración de Cowork → Plugins
2. Busca la galería o pega una URL de plugin
3. Autoriza cualquier conector nuevo que el plugin requiera
4. Los nuevos comandos de barra diagonal aparecen inmediatamente en la paleta de comandos

Los plugins tienen alcance en el espacio de trabajo — instalar para tu cuenta no afecta a compañeros de equipo a menos que instalen por separado o un administrador envíe al espacio de trabajo completo.

---

## Automatización: Click-to-Configure vs. Hooks

La automatización de Cowork se configura a través de un constructor de flujos de trabajo visual — sin `settings.json`, sin scripts de shell.

| Tipo de disparador | Cowork | Equivalente de Claude Code |
|-------------|--------|----------------------|
| Programado (cron) | Selector de tiempo en constructor de flujos de trabajo | Trabajo cron que llama `claude` |
| Cambio de archivo | Selector de carpeta de observación | Hook `PostToolUse` en Write |
| Correo electrónico recibido | Disparador del conector de Gmail | Sin equivalente directo |
| Envío de formulario | Entrada de webhook | Herramienta MCP personalizada |
| Manual | Botón Ejecutar | Invocación de CLI directa |

Para equipos que desean que la automatización de Cowork se ejecute junto con la automatización de Claude Code: los flujos de trabajo de Cowork pueden llamar URLs de webhook, lo que hace posible activar tuberías de Claude Code desde eventos de Cowork.

---

## Cuándo usar Cowork vs. Claude Code

**Usa Cowork para:**
- Flujos de trabajo intensivos en documentos (contratos, reportes, decks)
- Automatización de correo electrónico y calendario
- Miembros del equipo no técnicos que necesitan asistencia de IA autónoma
- Trabajo de operaciones comerciales que vive en Google Workspace y SaaS similar
- Automatización sin código que de otro modo requeriría Zapier o Make

**Usa Claude Code para:**
- Escribir, editar o depurar código
- Comandos de terminal y scripts de shell
- Tareas técnicas complejas de múltiples pasos con lógica condicional
- Automatización personalizada que requiere hooks y control granular
- Trabajar dentro de un repositorio git

---
