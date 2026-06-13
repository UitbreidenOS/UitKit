# Claude para Pequeños Negocios — Guía de Productos

Claude for Small Business es una capa de producto específica dentro de Claude Cowork, lanzada el 13 de mayo de 2026. No es el chatbot genérico de Claude.ai, y no es Claude Code. Es un conjunto de 15 flujos de trabajo preconstruidos y activables con un solo clic, diseñados para propietarios de negocios que desean que la IA funcione dentro de las herramientas que ya utilizan — QuickBooks, HubSpot, PayPal, Google Workspace y más — sin escribir indicaciones, configurar servidores ni contratar un desarrollador.

Esta guía cubre qué es el producto, qué hace cada flujo de trabajo, cómo configurarlo, qué requiere de cada herramienta conectada y qué esperar en los primeros 90 días.

---

## Qué es y qué no es

**Qué es:** Una capa estructurada dentro de Claude Cowork (la versión basada en GUI, sin terminal, de las capacidades agentic de Claude) que se entrega con 15 flujos de trabajo especializados diseñados para operaciones de pequeños negocios. Cada flujo de trabajo se conecta a una o más herramientas comerciales que ya utiliza, lee datos, produce borradores y presenta todo para su revisión antes de que nada se envíe o cambie.

**Qué no es:**

- No es el chatbot de Claude.ai. Puede preguntarle a Claude.ai cualquier cosa en una conversación, pero no tiene conexión con su QuickBooks, no tiene acceso a su canalización de HubSpot y produce resultados genéricos sin contexto comercial. Claude for Small Business es específico e integrado.
- No es Claude Code. Claude Code es una herramienta de desarrollador basada en terminal. Claude for Small Business es un producto de apuntar y hacer clic para propietarios y operadores que no deberían tener que abrir un terminal para obtener valor de la IA.
- No es un reemplazo para su software existente. QuickBooks sigue ejecutando su contabilidad. HubSpot sigue almacenando su CRM. Claude lee lo que esas herramientas saben, agrega razonamiento y output de borrador y le devuelve el control.
- No es autónomo. Nada envía, publica, paga, elimina o publica sin su aprobación explícita para cada acción individual.

**Para quién es:** Propietarios de pequeños negocios — operadores individuales, asociaciones, negocios con 2-50 empleados — que pasan 8-15 horas por semana en tareas que son principalmente mecánicas: redactar correos de seguimiento, preparar informes de efectivo, revisar qué leads priorizar, conciliar datos bancarios. La promesa del producto es reducir ese tiempo mecánico a 1-2 horas por semana sin requerir que aprenda a usar IA.

---

## Precios y acceso

Claude for Small Business requiere una suscripción de Claude Pro de $20/mes o un plan de Claude Team de $30/puesto/mes. Ambos planes incluyen acceso a Claude Cowork y a los 15 flujos de trabajo. No hay cargos adicionales por flujo de trabajo.

Para equipos con mayor uso — ejecutando 8 o más flujos de trabajo diarios o trabajando con grandes conjuntos de datos financieros — hay planes de Claude Max disponibles a $100/mes (límite de uso 5x) o $200/mes (límite de uso 20x).

El producto se entrega dentro de Claude Cowork. No descarga una aplicación separada.

---

## Principios de diseño

Entender el diseño evita tener expectativas incorrectas.

**Iniciado por el propietario, basado en aprobación.** Cada flujo de trabajo se ejecuta cuando usted decide ejecutarlo. Nada sondea sus cuentas en el fondo ni actúa en su nombre. Cuando un flujo de trabajo se completa, presenta un output estructurado — correos borrador, resúmenes de puntuación, banderas de conciliación — y espera su aprobación para cada acción individualmente.

**El acceso a datos coincide con su rol.** Cada integración se conecta a través de OAuth usando sus credenciales. Claude puede leer y escribir exactamente lo que puede — nada más. Una integración de QuickBooks autorizada con sus credenciales de propietario da a Claude el mismo acceso que usted. No crea una cuenta de servicio separada y elevada.

**Los outputs son borradores, no decisiones.** Las puntuaciones de leads son recomendaciones, no reglas. Los correos de facturas son borradores, no mensajes enviados. Las banderas de contratos son anotaciones, no opiniones legales. Los flujos de trabajo están diseñados para comprimir el tiempo que pasa en la recopilación de información y la redacción de primer borrador, mientras lo mantiene a usted a cargo de las decisiones.

**El contexto es suyo.** Anthropic no usa sus datos comerciales conectados para entrenar a Claude. Los datos que sus integraciones exponen — registros de clientes, montos de facturas, etapas de canalización — se procesan en el momento de la consulta y no se retienen para el entrenamiento del modelo.

---

## Los 15 flujos de trabajo

Los flujos de trabajo se organizan aquí por ahorros de tiempo semanal típico, de mayor a menor. Sus ahorros específicos dependerán del tamaño de su negocio, con qué consistencia ejecuta los flujos de trabajo y qué tan bien ha configurado su contexto comercial en Claude.

---

### Nivel 1 — Alta frecuencia, altos ahorros (5-10+ horas/semana)

**Invoice Chasing**

Se conecta a QuickBooks. Lee el informe de antigüedad de cuentas por cobrar, identifica facturas vencidas por 7, 14, 30 y 60+ días, y redacta un correo de seguimiento personalizado para cada cliente. Los borradores hacen referencia al número de factura específico, al monto adeudado, a la fecha de vencimiento original y a un enlace de pago si PayPal también está conectado. El tono se ajusta con la antigüedad — un mensaje de 7 días de retraso es diferente de uno de 60 días.

Revisa el lote de borradores, edita correos individuales según sea necesario y envía los que aprueba. El flujo de trabajo rastrea qué facturas tuvieron seguimientos enviados e indica cuándo se compensan los pagos para que no envíe un recordatorio a alguien que pagó ayer.

Ahorro de tiempo: 4-6 horas por semana para negocios con 10+ cuentas por cobrar activas. Los ahorros provienen de eliminar el ciclo manual de extracción y redacción, no de automatizar los envíos.

Requisitos de integración: QuickBooks Online (cualquier nivel de suscripción). PayPal Business (opcional — permite la inclusión de enlaces de pago en correos).

**Lead Triager**

Se conecta a HubSpot. Lee contactos nuevos y recientemente actualizados, los califica según sus criterios de Perfil de Cliente Ideal (ICP), enriquece registros donde hay datos públicos disponibles y marca los leads de mayor prioridad para seguimiento inmediato. Los criterios de calificación se establecen en lenguaje natural: "trabajamos mejor con empresas SaaS en América del Norte con 10-200 empleados, donde el contacto es un fundador o VP de Operaciones".

El output es una lista priorizada con una línea de justificación por lead, ordenada por puntuación de ajuste. Los contactos que debería llamar hoy aparecen primero. Los contactos que no se ajustan a su ICP se etiquetan y se mueven a una cola de menor prioridad en lugar de descartarse.

Revisa la lista clasificada, confirma o anula la puntuación en cualquier lead donde esté en desacuerdo, y Claude actualiza los registros de HubSpot para reflejar las decisiones.

Ahorro de tiempo: 3-5 horas por semana para negocios con 20+ leads nuevos por semana. Los ahorros provienen de eliminar la revisión manual de contactos y la carga mental de decidir a quién llamar después.

Requisitos de integración: HubSpot (el nivel gratuito es suficiente para lectura y actualización de registros).

**Business Pulse**

Se conecta a QuickBooks, PayPal, HubSpot y Google Workspace o Microsoft 365. Se ejecuta como un resumen de lunes por la mañana — una descripción general estructurada de la salud del negocio en todos los sistemas conectados.

El output cubre: posición de efectivo y resumen de cuentas por cobrar de QuickBooks; totales de liquidación y reembolso de PayPal para la semana anterior; movimientos de canalización de HubSpot (deals que avanzaron, deals que se enfriaron, nuevos deals agregados); y compromisos de calendario para la próxima semana de Google Calendar u Outlook.

Esto está diseñado para reemplazar los 45-90 minutos que la mayoría de propietarios pasan los lunes por la mañana navegando por cuatro pestañas para hacerse una idea de dónde se encuentran. Business Pulse comprime eso en un único informe estructurado que puede leer en 5 minutos.

No se requiere aprobación porque no se realiza ninguna acción — el flujo de trabajo solo lee e informa.

Ahorro de tiempo: 3-5 horas por semana cuando se usa como un verdadero ritual del lunes por la mañana que reemplaza la revisión manual del panel. Menos si lo usa solo ocasionalmente.

Requisitos de integración: Como mínimo una integración financiera (QuickBooks o PayPal). Las integraciones adicionales (HubSpot, Google Workspace o Microsoft 365) amplían la cobertura pero no son requeridas.

---

### Nivel 2 — Frecuencia media, altos ahorros (3-5 horas/semana)

**Month-End Close**

Se conecta a QuickBooks y PayPal. Compara registros de ingresos de QuickBooks con informes de liquidación de PayPal del mes calendario, identifica transacciones que aparecen en un sistema pero no en el otro, marca discrepancias de monto donde la misma transacción se registra de manera diferente y redacta un resumen de conciliación.

El output es una tabla estructurada: transacciones conciliadas, transacciones no conciliadas, discrepancias de monto y un borrador de P&L en lenguaje natural que su contador o CPA puede usar como punto de partida.

Esto no reemplaza a su CPA. Reduce el tiempo que su CPA pasa (y le cobra por) extraer datos de transacciones sin procesar e identificar discrepancias obvias, porque ese trabajo llega preorganizado.

Ahorro de tiempo: 3-4 horas por mes, comprimidas en una sesión de revisión de 30-45 minutos en lugar de medio día de conciliación.

Requisitos de integración: QuickBooks Online, PayPal Business. Ambos son necesarios para conciliación completa — solo con QuickBooks, el flujo de trabajo aún produce un resumen de transacciones pero no puede realizar la conciliación entre sistemas.

**Payroll Planning**

Se conecta a QuickBooks. Construye una proyección de efectivo de 30 días, calcula la pista de nómina en función de las cuentas por cobrar actuales y las liquidaciones esperadas, clasifica facturas vencidas por tamaño y antigüedad (para que sepa cuáles perseguir más duramente antes de nómina) y produce una lista de verificación de preparación de nómina.

Esto no es un procesador de nómina. No ejecuta nómina, no toca cuentas de empleados y no se integra con Gusto, ADP u plataformas similares. Le da la claridad de efectivo que necesita para decidir si ejecutar nómina según lo programado, si necesita acelerar cobros o si necesita una conversación de línea de crédito con su banco.

Ahorro de tiempo: 2-3 horas por ciclo de nómina. La mayoría de propietarios gastan este tiempo construyendo manualmente la misma imagen de efectivo en una hoja de cálculo.

Requisitos de integración: QuickBooks Online.

**Campaign Manager**

Se conecta a HubSpot y Canva. Lee datos de rendimiento de campaña de HubSpot — tasas de apertura de correo, tasas de clic, envíos de formularios, atribución de deals — analiza qué funcionó y qué no, construye una estrategia de promoción para el próximo período de campaña y genera creatividad de marca en Canva basada en sus plantillas de marca existentes.

El output cubre un resumen de campaña escrito, recomendaciones de segmentación de audiencia y un conjunto de diseños de Canva (gráficos sociales, encabezados de correo o creatividad publicitaria según lo que especifique) dimensionados para los canales que identifica.

Revisa la estrategia y los activos creativos, solicita revisiones en elementos específicos y exporta los diseños aprobados para usar en sus plataformas de campaña.

Ahorro de tiempo: 3-5 horas por ciclo de campaña. Los ahorros son mayores en el lado del diseño para equipos sin diseñador gráfico dedicado.

Requisitos de integración: HubSpot (cualquier nivel de pago para análisis — el nivel gratuito carece de los datos de rendimiento de campaña necesarios para análisis). Canva (gratuito o Pro — Pro se necesita para acceso a kit de marca, que mejora significativamente la calidad del output).

---

### Nivel 3 — Uso periódico, ahorros sustanciales (2-4 horas/semana)

**Cash-Flow Forecasting**

Se conecta a QuickBooks y PayPal. Construye una proyección de efectivo de rodillo de 13 semanas usando cuentas por cobrar reales, histórico de tiempos de pago por cliente, gastos programados próximos y patrones de liquidación de PayPal recientes.

El output es una tabla semana por semana mostrando posición de efectivo proyectada, semanas de riesgo de déficit marcadas (donde el efectivo proyectado cae por debajo de un umbral que establece) y las cuentas por cobrar más críticas para cobrar antes de cada semana de riesgo.

Ejecute esto semanalmente o quincenalmente para adelantarse a sorpresas de efectivo. La primera ejecución toma 10-15 minutos para revisar. Las ejecuciones posteriores toman 3-5 minutos porque ya entiende el formato.

Ahorro de tiempo: 2-3 horas por semana en comparación con mantener una hoja de cálculo manual de flujo de efectivo.

Requisitos de integración: QuickBooks Online. PayPal Business (opcional — mejora la precisión del tiempo de liquidación).

**Content Strategist**

Se conecta a HubSpot y Canva, con acceso opcional a Google Drive para activos de contenido existentes. Extrae datos de rendimiento de campaña, revisa contenido existente en Drive si está conectado, identifica brechas de contenido contra su audiencia objetivo y redacta un calendario de contenido para las próximas 4-8 semanas.

El output del calendario incluye temas, formatos recomendados, cadencia de publicación sugerida por canal y texto de borrador para 2-3 piezas como ejemplos. Los activos de Canva se generan para el primer lote de posts.

Esto es muy útil para negocios que tienen contenido como parte de su estrategia de adquisición de clientes — empresas de servicios con blog, marcas de comercio electrónico con canales sociales, consultores con boletín.

Ahorro de tiempo: 2-4 horas por ciclo de planificación para negocios que actualmente construyen calendarios de contenido manualmente.

Requisitos de integración: HubSpot (datos de rendimiento de campaña), Canva (generación de activos). Google Drive (opcional, para inventario de contenido).

**Tax Organizer**

Se conecta a QuickBooks y Google Drive. Recopila todas las transacciones relacionadas con impuestos para el período — gastos categorizados, totales de ingresos, pagos a contratistas, compras de equipos — recupera recibos y documentación de apoyo de Google Drive donde los nombres de archivo y fechas coincidan y redacta un paquete de CPA.

El paquete de CPA es un documento estructurado: ingresos por categoría, gastos deducibles por categoría, recibos adjuntos e indexados, candidatos 1099 de contratistas y una lista de artículos donde la documentación falta o es incierta.

Esto no prepara su declaración de impuestos. Prepara la entrada organizada que su CPA necesita, reduciendo las horas facturables que pasa en reuniones de preparación de impuestos y solicitudes de seguimiento.

Ahorro de tiempo: 6-8 horas por año fiscal en tiempo de preparación de CPA (distribuido en dos o tres sesiones), más una reducción significativa en la factura de CPA si su firma cobra por hora.

Requisitos de integración: QuickBooks Online, Google Drive (para recuperación de recibos).

---

### Nivel 4 — Uso situacional (1-2 horas por uso)

**Margin Analysis**

Se conecta a QuickBooks. Desglose el margen bruto por línea de producto, segmento de cliente y canal de ventas según los datos de ingresos y costos en QuickBooks. Marca qué productos, clientes o canales diluyen el margen versus lo acrecientan.

Ejecute esto cuando esté tomando decisiones de precios, considerando dejar caer una línea de producto o evaluando si un cliente grande es realmente rentable después de contabilizar los costos de servicio.

Requisitos de integración: QuickBooks Online. Requiere que su plan de cuentas de QuickBooks distinga ingresos y COGS por línea de producto — si registra todos los ingresos como un único artículo, el output será limitado.

**Contract Reviewer**

Se conecta a Google Drive o Microsoft 365 (SharePoint/OneDrive). Lee contratos entrantes, los compara contra un conjunto de términos estándar que define (términos de pago, límites de responsabilidad, propiedad de IP, requisitos de aviso de terminación), destaca desviaciones y produce un resumen tachado mostrando qué se desvía de su estándar.

Esto no es asesoramiento legal. Es una revisión de primer paso que le dice qué cláusulas se desvían de su estándar y por cuánto — para que cuando envíe el documento a su abogado, pague por su opinión sobre los puntos marcados, no por que ellos encuentren los puntos en primer lugar.

Requisitos de integración: Google Drive o Microsoft 365 (para acceso a documentos). Debe definir sus términos de contrato estándar en lenguaje natural durante la configuración inicial — generalmente una sesión única de 30 minutos.

**Business Monitoring**

Se conecta a todas las integraciones activas. Se ejecuta en un cronograma que define e marca anomalías: un cliente que normalmente paga en 20 días pero ahora está en 35; una etapa de deal que no ha avanzado en 21 días; un total de ingresos semanal más de 25% por debajo del promedio de 4 semanas; una disputa de PayPal abierta que no se ha resuelto.

El monitoreo es pasivo — lee en sus sistemas y destaca las desviaciones que merecen su atención, sin tomar medidas. Recibe una lista de alertas estructurada y decide qué investigar.

Requisitos de integración: Como mínimo dos integraciones activas. El monitoreo es más útil cuantas más integraciones tenga conectadas, porque el valor está en la imagen entre sistemas.

**Cold Outreach**

Se conecta a HubSpot. Dado una empresa o contacto objetivo, redacta un correo de primer contacto personalizado basado en la industria del prospecto, rol y cualquier señal pública que especifique. Después de una reunión o llamada, produce un resumen de llamada estructurado y redacta un correo de seguimiento. Para prospectos en una secuencia de múltiples toques, genera el próximo seguimiento basado en dónde están en la secuencia y cómo se han comprometido hasta ahora.

Ahorro de tiempo: 20-30 minutos por prospecto versus redacción manual, lo que se acumula significativamente en una lista de outreach completa.

Requisitos de integración: HubSpot (para registros de contacto y seguimiento de secuencia).

**Meeting to Action**

Acepta una transcripción de reunión (pegada o cargada desde Google Drive). Produce un resumen de reunión estructurado con decisiones tomadas, preguntas abiertas y elementos de acción con propietarios. Redacta correos de seguimiento para cada participante. Registra notas CRM clave en contactos o deals relevantes de HubSpot.

Ejecute esto inmediatamente después de cualquier reunión donde el seguimiento sea importante: llamadas de ventas, revisiones de clientes, negociaciones de proveedores, standups de equipo.

Requisitos de integración: Google Drive (opcional, para carga de transcripción). HubSpot (opcional, para registro de notas CRM).

**Email Campaign**

Se conecta a HubSpot. Segmenta su lista de contactos según criterios que especifica, genera 2-3 variantes de línea de asunto por correo, redacta texto del cuerpo para cada variante y configura parámetros de prueba A/B en HubSpot. Todo el texto se redacta en su voz de marca y se revisa antes de que se active cualquier campaña.

Requisitos de integración: HubSpot (Marketing Hub Starter o superior — el nivel gratuito no incluye pruebas A/B o funcionalidad de envío de campaña).

---

## Cómo configurarlo

La configuración lleva 2-3 horas en total. Distribúyala en dos sesiones en lugar de apresurarse en una.

**Paso 1: Suscríbase a Claude Pro o Team**

Claude Pro cuesta $20/mes y es suficiente para un propietario ejecutando la mayoría de los flujos de trabajo. Si varios miembros del equipo usarán el sistema simultáneamente, Claude Team a $30/puesto/mes es el plan correcto. Ambos planes incluyen los 15 flujos de trabajo — no hay suscripción separada de Small Business.

**Paso 2: Acceder a Claude Cowork**

Claude for Small Business vive en Claude Cowork — la interfaz GUI de las capacidades agentic de Claude. Abra Claude Cowork desde el panel de Claude. Verá un panel de Workflows en la barra lateral izquierda.

**Paso 3: Escriba su contexto comercial**

Antes de conectar nada, cree un documento de Business Context en Claude. Esto son 200-400 palabras describiendo: qué hace su negocio, quién es su cliente ideal (industria, tamaño de empresa, rol, geografía), su tono de comunicación (formal, amigable, directo), cualquier término o frase específica que use en su industria y cómo se ven los deals o transacciones típicas.

Este paso es la configuración de mayor apalancamiento. Cada flujo de trabajo lee su contexto comercial y lo usa para personalizar outputs. Omitirlo significa que Claude produce outputs técnicamente correctos pero genéricos — el mismo correo de seguimiento de factura que escribiría para cualquier negocio, no uno que parece que su equipo escribió.

**Paso 4: Conecte sus integraciones**

Desde el panel de configuración de Cowork, conecte cada herramienta a través de OAuth. Las conexiones son autorizaciones únicas — no necesitará reautorizarse en cada uso.

Conecte en este orden basado en los flujos de trabajo que desea usar primero:
- QuickBooks Online: requerido para Invoice Chasing, Month-End Close, Cash-Flow Forecasting, Payroll Planning, Margin Analysis, Tax Organizer
- HubSpot: requerido para Lead Triager, Campaign Manager, Content Strategist, Cold Outreach, Email Campaign
- PayPal Business: requerido para Business Pulse (vista financiera), Month-End Close (conciliación), Cash-Flow Forecasting (precisión de liquidación)
- Google Workspace o Microsoft 365: requerido para Business Pulse (calendario), Tax Organizer (recibos), Contract Reviewer, Meeting to Action
- Canva: requerido para Campaign Manager, Content Strategist
- DocuSign: usado por Contract Reviewer (para enrutamiento después de revisión), Tax Organizer (para entrega de paquete de CPA)
- Slack: usado por Business Monitoring (entrega de alerta)

No conecte todo en el día uno si no ha decidido qué flujos de trabajo activar primero. Conecte solo lo que necesita para su primer flujo de trabajo, verifique que funcione y luego agregue el próximo.

**Paso 5: Activar su primer flujo de trabajo**

Comience con un flujo de trabajo. La recomendación fuerte es Invoice Chasing — tiene el ROI más claro (sabe exactamente cuánto dinero está pendiente), el menor riesgo (revisa cada correo antes de que se envíe) y produce un resultado concreto en la primera sesión.

Activar el flujo de trabajo desde el panel de Workflows. Ejecútelo una vez manualmente. Lea el output cuidadosamente. Nota qué entendió Claude bien y qué habría entendido mal si no lo hubiera revisado. Esta primera ejecución es la forma más rápida de aprender a ajustar su contexto comercial para mejorar outputs futuros.

**Paso 6: Ampliar deliberadamente**

Agregue un flujo de trabajo por semana durante el primer mes. La restricción no es técnica — es su capacidad para revisar outputs reflexivamente. Activar los 15 flujos de trabajo en la primera semana produce 15 conjuntos de outputs, poco de los cuales se revisarán adecuadamente, y los flujos de trabajo que no se revisan son los que producirán errores que no detecta.

---

## Requisitos de integración en detalle

Cada integración tiene sus propios requisitos. Lo que necesita varía por flujo de trabajo.

**QuickBooks Online**

Cualquier suscripción activa de QuickBooks Online funciona. QuickBooks Desktop no se conecta — la integración OAuth es solo QuickBooks Online. Simple Start, Essentials, Plus y Advanced son todos compatibles.

Los flujos de trabajo Invoice Chasing, Month-End Close y Payroll Planning son más útiles con QuickBooks Plus o superior porque esos planes incluyen seguimiento de clase y ubicación, que permite al flujo de trabajo Margin Analysis desglosar la rentabilidad por línea de producto o ubicación. En Simple Start, Margin Analysis se limita a totales a nivel de empresa.

**PayPal Business**

Requiere una cuenta de PayPal Business (no Personal). La conexión API de cuenta comercial le da a Claude acceso a historial de transacciones, informes de liquidación, estado de disputas y datos de pagos. Claude no tiene acceso para iniciar transferencias, revertir transacciones o modificar configuraciones de cuenta.

Si su negocio procesa pagos a través de Stripe, Square u otro procesador en lugar de PayPal, esas integraciones no son compatibles actualmente en el conjunto de flujos de trabajo nativos. Los flujos de trabajo financieros aún pueden ejecutarse utilizando solo datos de QuickBooks, con precisión reducida en tiempos de liquidación.

**HubSpot**

El nivel gratuito de HubSpot es compatible con Lead Triager, Cold Outreach, Meeting to Action y administración de contactos básica. Campaign Manager y Email Campaign requieren Marketing Hub Starter ($45/mes o superior) para análisis de campaña y funcionalidad de envío A/B. Content Strategist usa datos de campaña de HubSpot si está disponible pero puede ejecutarse en nivel gratuito con profundidad analítica reducida.

Si usa Salesforce, Pipedrive u otro CRM, estos no se conectan a los flujos de trabajo de Small Business nativos en el lanzamiento de mayo de 2026.

**Canva**

El nivel gratuito se conecta y soporta generación de activos. Canva Pro ($15/mes o incluido en algunos planes de equipo) se recomienda fuertemente para Campaign Manager y Content Strategist porque las cuentas Pro incluyen kits de marca — sus fuentes exactas, colores y logo — que Claude usa para generar activos de marca. Sin un kit de marca, Claude genera activos visualmente limpios que podrían no coincidir con su identidad de marca.

**DocuSign**

Requiere DocuSign Business Pro o superior. El plan Personal estándar no incluye acceso a API. DocuSign se usa por Contract Reviewer (para enrutar contratos aprobados para firma) y opcionalmente por Tax Organizer (para enviar paquete de CPA para reconocimiento). La conexión de DocuSign es opcional — ambos flujos de trabajo producen sus outputs sin ella; la integración simplemente agrega un paso de envío a firma al final de la revisión.

**Google Workspace**

Cualquier plan de Google Workspace (Business Starter, Standard, Plus o Enterprise) funciona. La conexión requiere autorización OAuth de una cuenta de administrador si su workspace tiene políticas OAuth restringidas por administrador. Para operadores individuales que usan una cuenta personal de Google, la conexión es sencilla.

Gmail, Google Drive, Google Calendar y Google Sheets están todos cubiertos bajo la conexión única de Google Workspace. No autoriza cada servicio por separado.

**Microsoft 365**

Business Basic ($6/usuario/mes) o superior soporta la conexión. Las cuentas personales de Microsoft funcionan para operadores individuales. La conexión cubre Outlook (correo y calendario), OneDrive y SharePoint. La misma opción de Gmail-u-Outlook se aplica en todas partes — Business Pulse lee su Google Calendar o su Calendario de Outlook, no ambos simultáneamente.

**Slack**

Cualquier plan de Slack (Free, Pro, Business+, Enterprise) soporta la integración de Slack. Business Monitoring usa Slack para enviar mensajes de alerta a un canal que designa. La integración no lee historial de canal ni publica mensajes no solicitados — solo publica las alertas que ha configurado para enviar.

---

## Modelo de permisos de datos

Entender el modelo de datos previene tanto la confianza excesiva como el miedo innecesario.

**A qué accede Claude:** Solo lo que autoriza explícitamente a través de OAuth, y solo cuando un flujo de trabajo se ejecuta activamente. No hay recopilación de datos en segundo plano, no hay sondeo de conexión persistente de sus cuentas y no hay datos almacenados entre sesiones.

**Acceso de escritura:** El acceso de escritura se otorga por integración pero está limitado por el diseño del flujo de trabajo. Claude no crea ni modifica entradas de QuickBooks sin su aprobación. Claude no envía correos sin su aprobación. Claude no actualiza registros de HubSpot sin su confirmación. Los permisos de OAuth podrían permitir técnicamente acceso de escritura (porque esas integraciones lo requieren para acciones basadas en aprobación), pero los flujos de trabajo se construyen para presentar output para revisión antes de escribir cualquier cosa.

**Entrenamiento de datos:** Anthropic no usa datos comerciales accedidos a través de integraciones conectadas para entrenar a Claude. Sus nombres de clientes, montos de facturas, contenido de correos y registros de CRM no se retienen para la mejora del modelo.

**Opciones empresariales:** Los planes de Claude Team y Claude Enterprise incluyen controles de datos adicionales: opciones de residencia de datos (residencia de la UE para negocios con obligaciones GDPR), registros de auditoría que muestran qué flujos de trabajo accedieron a qué integraciones y cuándo y controles a nivel administrativo sobre qué flujos de trabajo pueden activar los miembros del equipo.

---

## Diseño de human-in-the-loop

El diseño basado en aprobación no es una limitación — es la arquitectura correcta para operaciones comerciales consecuentes.

Cada output que Claude produce es una recomendación de borrador. Las categorías son: correos redactados pero no enviados, documentos marcados pero no modificados, leads calificados pero no actuados, proyecciones de efectivo calculadas pero no publicadas, contratos tachados pero no devueltos. Nada se mueve del output de Claude a sus sistemas externos sin una acción humana deliberada.

Esto es importante por tres razones:

**Errores.** Claude comete errores. Lee mal una fecha de factura, identifica mal un patrón de pago de cliente o redacta un correo de seguimiento al nivel de urgencia incorrecto. Estos errores se detectan cuando revisa el output. Solo se convierten en problemas si omite la revisión.

**Contexto que Claude no tiene.** Sabe que el cliente marcado para cobro agresivo está pasando por una situación difícil y desea manejarlo personalmente. Sabe que el deal en HubSpot está estancado porque está esperando una llamada de referencia, no porque el prospecto se enfriara. Claude no puede saber lo que no le ha dicho. El paso de revisión es donde su buen juicio llena lo que los datos no pueden mostrar.

**Exposición legal y financiera.** Un correo enviado incorrectamente a un cliente no puede ser no enviado. Una factura registrada en el monto incorrecto crea un problema de conciliación. Una cláusula de contrato que pasa por alto porque confió en la revisión demasiado rápido se convierte en un pasivo. El paso de revisión es su último puesto de control y ahorrar 2 minutos no es un comercio que valga la pena.

---

## Qué esperar en los primeros 90 días

**Días 1-7: Configuración y primera ejecución**

Planifique 2-3 horas para configuración en dos sesiones. La primera sesión cubre suscripción, contexto comercial e integración inicial. La segunda sesión cubre la primera ejecución del flujo de trabajo y revisión del output. Para el final de la semana uno, debería haber ejecutado Invoice Chasing o Business Pulse al menos una vez y entender cómo se ve el output.

**Días 8-21: Construir el hábito**

Ejecute su primer flujo de trabajo en su cadencia natural. Invoice Chasing se ejecuta semanalmente o cuando tiene un lote significativo de facturas vencidas. Business Pulse se ejecuta cada lunes. No agregue un segundo flujo de trabajo hasta que el primero sea parte de su rutina. La disciplina de revisar cuidadosamente el output de Claude — leer cada borrador de correo antes de aprobar, no estampar el lote — es un hábito que toma 2-3 semanas establecer.

**Días 22-30: Agregar el segundo flujo de trabajo**

Después de 3 semanas, agregue un flujo de trabajo más. El segundo flujo de trabajo recomendado depende de su tipo de negocio: Lead Triager para empresas de servicios y operadores B2B; Month-End Close para cualquier negocio con un problema de conciliación de QuickBooks; Campaign Manager para retail y comercio electrónico.

**Días 31-60: Tres a cuatro flujos de trabajo activos**

Para el final del mes dos, la mayoría de usuarios ejecutan 3-4 flujos de trabajo regularmente. El tiempo ahorrado es generalmente 6-10 horas por semana en este punto. La calidad de los outputs ha mejorado porque ha refinado su documento de contexto comercial basado en lo que Claude entendió mal consistentemente en el primer mes.

**Días 61-90: Establecer el ritmo completo**

A los 90 días, los usuarios que siguen el enfoque de expansión ejecutan 6-8 flujos de trabajo, ahorrando 8-12 horas por semana en el trabajo mecánico que estos flujos de trabajo cubren. Algunos propietarios en esta etapa amplían el sistema usando Claude Projects — creando prompts personalizados para flujos de trabajo que las 15 opciones preconstruidas no cubren — pero esto es opcional y requiere más participación con las capacidades subyacentes de Claude.

---

## Patrones de éxito de adoptadores tempranos

Los siguientes patrones surgieron de negocios que adoptaron Claude for Small Business en el primer trimestre después del lanzamiento de mayo de 2026.

**Comience con Invoice Chasing.** En todos los tipos de negocio, este fue el punto de inicio con el ROI más alto. La razón es especificidad: el flujo de trabajo lee datos de facturas reales y produce borradores específicos, personalizados. La diferencia de calidad de output entre Claude con acceso a QuickBooks y Claude sin él es inmediatamente evidente. Los usuarios de primera vez entienden la proposición de valor del producto dentro de la primera sesión.

**Integre Business Pulse en el lunes por la mañana.** Los propietarios que ejecutaron Business Pulse cada lunes durante las primeras cuatro semanas lo calificaron consistentemente como su flujo de trabajo de mayor valor después del período inicial — aunque ahorra menos tiempo por ejecución que Invoice Chasing. El valor es el ritmo semanal y la función de advertencia temprana. Los propietarios que saltaron los lunes y lo ejecutaron ocasionalmente obtuvieron menos de él.

**Agregar flujos de trabajo financieros después de 30 días.** Month-End Close y Payroll Planning producen outputs que se sienten de mayor relevancia que los seguimientos de facturas. Los propietarios que confiaron en estos flujos de trabajo desde el primer día ocasionalmente capturaron errores que no habrían capturado si hubieran sido menos cuidadosos. Esperar hasta estar confiado en el formato de output de Claude — y en su propia capacidad para detectar un error — reduce el riesgo de actuar sobre una conciliación mal interpretada.

**Adiciones específicas de la industria:** Las empresas de servicios (consultores, agencias, contratistas) calificaron consistentemente Lead Triager como el más alto después de Invoice Chasing. Los negocios de retail y comercio electrónico obtuvieron el mayor retorno de Campaign Manager y Content Strategist. Las firmas de servicios profesionales (derecho, contabilidad, arquitectura) encontraron que Contract Reviewer es el más diferenciado porque ahorró un tiempo significativo de revisión de abogados en acuerdos de proveedores entrantes.

---

## Modos de fracaso comunes

**Activar los 15 flujos de trabajo en semana uno.** Los outputs se acumulan más rápido de lo que puede revisarlos. Los outputs no revisados se quedan inactivos. Los flujos de trabajo que producen outputs que actúa se convierte en formación de hábitos en la dirección incorrecta — comienza a tratarlos como ruido en lugar de señal. Comience con uno.

**Omitir el paso de revisión.** Los primeros borradores de correos de factura de Claude son buenos pero no perfectos. En la primera ejecución, encontrará 2-3 que necesitan edición. En la décima ejecución, será 0-1. El proceso de edición es cómo refina la comprensión de Claude de su voz. Omitirlo para ahorrar tiempo a corto plazo significa que los outputs nunca mejoran y el primer error que pasa por alto que realmente llega a un cliente cuesta más que el tiempo que ahorró.

**Usar inputs vagos.** La calidad del output de Claude es directamente proporcional a la especificidad del contexto que proporciona. Un documento de contexto comercial que dice "somos una agencia de marketing que ayuda a pequeños negocios" produce outputs genéricos. Uno que dice "somos una agencia de marketing de rendimiento de 4 personas en Austin que sirve marcas de comercio electrónico con ingresos de $1-10M, enfocada en Meta y Google Ads, con un estilo de comunicación directo y orientado a resultados" produce outputs que se ven como si su equipo los escribiera.

**No actualizar el contexto comercial.** Si su ICP cambia, su precios cambian o su modelo comercial se desplaza, actualice su documento de contexto comercial. Claude usa el contexto de su actualización más reciente. El contexto obsoleto produce outputs calibrados a dónde estaba su negocio hace seis meses.

**Tratar Lead Triager como un reemplazo del juicio de ventas.** Las puntuaciones de leads son entradas a su proceso de ventas, no decisiones. Un lead calificado con 85/100 por Claude es un lead de alto ajuste basado en datos en HubSpot. No es una certeza de que debe soltar todo para llamarlos. Y un lead calificado con 40/100 por Claude podría ser su próximo mejor cliente si sabe algo sobre ellos que HubSpot no captura.

**Esperar que Contract Reviewer proporcione asesoramiento legal.** El flujo de trabajo lee contratos e marca desviaciones de sus términos estándar. No puede interpretar cláusulas ambiguas, evaluar riesgo en contexto o asesorar sobre si firmar. Es una herramienta de pre-revisión que reduce el tiempo de su abogado, no un reemplazo del abogado.

---

## No es para

**Decisiones financieras complejas que requieren criterio de CPA.** Month-End Close produce una conciliación estructurada. Tax Organizer produce un paquete de CPA organizado. Ni uno ni el otro produce estrategia fiscal, asesoramiento de estructuración de entidades o orientación sobre deducciones de área gris. Estas requieren criterio profesional que ningún flujo de trabajo de IA debe reemplazar.

**Interpretación legal.** Contract Reviewer marca desviaciones de su estándar. No puede decirle si una cláusula no estándar es aceptable dada su posición de negociación, su relación con la otra parte o la jurisdicción que rige el contrato.

**Operaciones completamente autónomas.** Si quiere que la IA se ejecute sin su participación — escaneo, decisión, envío, publicación, pago — Claude for Small Business es la herramienta incorrecta. El diseño basado en aprobación es intencional e innegociable. Toda acción consecuente requiere su confirmación explícita.

**Reemplazar su software comercial.** QuickBooks, HubSpot, Canva y las otras herramientas integradas permanecen como los sistemas de registro. Claude lee de ellos y asiste con la capa de razonamiento y escritura encima. Cancelar su suscripción de QuickBooks y esperar que Claude maneje su contabilidad no es un caso de uso admitido y lo dejaría sin un sistema de registro financiero.

**Negocios sin las integraciones admitidas.** Si su negocio se ejecuta en Salesforce, Xero, FreshBooks, Stripe, Square u otras plataformas no en la lista de integración actual, los flujos de trabajo preconstruidos no se conectarán. La plataforma Claude Cowork general aún puede asistir con trabajo de documentos y correos, pero las automaciones de flujo de trabajo integradas requieren las conexiones de herramientas específicas listadas anteriormente.

---

## Ir más allá de los 15 flujos de trabajo

Después de 60-90 días de uso regular, algunos propietarios encuentran que los flujos de trabajo preconstruidos no cubren ciertas tareas recurrentes específicas de su negocio. En este punto, Claude Projects se convierte en la extensión natural.

Un Claude Project es un entorno de contexto persistente donde puede definir flujos de trabajo personalizados usando prompts en lenguaje natural respaldados por las mismas conexiones de integración que ya ha autorizado. Construir un flujo de trabajo personalizado requiere más fluidez de Claude que activar uno preconstruido, pero los propietarios que han estado usando el sistema durante 90 días generalmente tienen esa fluidez.

Las extensiones personalizadas que los adoptadores tempranos construyeron en los primeros 90 días incluyen: plantillas de informes semanales personalizados específicas para su industria, secuencias de comunicación de incorporación de proveedores, listas de verificación de incorporación de clientes auto-completadas desde HubSpot y generadores de propuestas de precios que extraen de una Google Sheet de paquetes de servicios y tarifas.

Los 15 flujos de trabajo preconstruidos son la rampa de acceso. Claude Projects es la autopista.

---
