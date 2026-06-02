# Higiene de CRM

## Cuándo activar

Activa esta habilidad cuando:
- Un SDR completa cualquier toque de salida/entrada (llamada, email, mensaje en LinkedIn, buzón de voz)
- Antes de que un AE se una a una reunión con un prospecto
- Durante la revisión del pipeline para garantizar la integridad de los datos antes de la progresión del acuerdo
- Cuando los registros de CRM muestran registros de actividad incompletos o obsoletos (>2 horas desde el último toque)
- Al programar un traspaso entre el equipo de SDR y ventas
- Cuando un acuerdo se mueve entre fases del pipeline (requiere una puerta de finalización de campos)

## Cuándo NO usar

No invoques esta habilidad para:
- Actividades de soporte al cliente posterior a la venta (usa plantillas de CRM de éxito del cliente en su lugar)
- Reuniones internas del equipo o actividades administrativas
- Limpieza retrospectiva de registros antiguos (>90 días) sin un disparador de auditoría explícito
- Actividades sin contacto (por ejemplo, investigación, administración del equipo)
- Cuentas marcadas como DEAD que no tienen nueva señal en 6+ meses (archivar en su lugar)

---

## Instrucciones

### I. Plantilla de Nota Posterior a la Llamada

Toda llamada —de entrada o salida, exitosa o fallida— debe registrarse dentro de 2 horas con estos campos completados:

#### Campos Obligatorios

**Qué Sucedió**  
Disposición en exactamente una oración. Usa códigos estandarizados:
- `Connected` — una persona viva respondió, se llevó a cabo la conversación
- `Left VM` — buzón de voz depositado, especifica el saludo escuchado (genérico/personalizado)
- `No Answer` — marcó, sin respuesta
- `Bad Number` — número inválido, desconectado o se alcanzó a la persona equivocada
- `Gatekeeper` — filtrado por asistente/recepción, sin transferencia al objetivo

*Ejemplo:* "Conectado con Jennifer Martinez, CMO, durante 12 min. Ella respondió directamente a la pregunta sobre la iniciativa X."

**Dolor Clave Mencionado**  
Captura el lenguaje exacto del prospecto entre comillas. No parafrasear — las citas directas son oro para el manejo de objeciones y la personalización en futuros contactos.

*Ejemplo:* "Ella dijo: 'Estamos atrapados con [Sistema Heredado] y no podemos justificar el costo de cambiar. Nuestro CFO no aprobará nuevos gastos en herramientas hasta el próximo año fiscal.'"

**Estado de Calificación**  
Mapea a elementos de MEDDPICC confirmados hasta ahora:
- **Metrics**: ¿Se mencionó un número de impacto de ingresos? ¿Se asignó presupuesto?
- **Economic Buyer**: ¿Alcanzaste/identificaste a ellos? ¿Rol confirmado?
- **Decision Criteria**: ¿En qué están evaluando? ¿Velocidad, costo, integración?
- **Decision Process**: ¿Cronograma confirmado? ¿Capas de aprobación identificadas?
- **Pain**: ¿Reconocido y cuantificado?
- **Identified Champion**: ¿Hay un defensor interno?
- **Implications**: ¿Articularon la consecuencia empresarial?
- **Commitment**: ¿Cuál es el próximo paso al que se comprometieron?

Marca cada uno como `Confirmed`, `Partial`, o `Missing`. Esto determina la disponibilidad para el traspaso a AE.

*Ejemplo:*
```
Metrics: Confirmed (Se mencionó presupuesto anual de £2M)
Economic Buyer: Missing (Hablé con el usuario, no con CFO/VP Finance)
Decision Criteria: Partial (Velocidad mencionada, tolerancia de costo unclear)
Pain: Confirmed (Cita exacta capturada)
Champion: Missing
```

**Siguiente Paso**  
Acción específica y fechada con propietario. No vago. Incluye:
- Qué: acción exacta siguiente (llamada, email con recurso, reunión)
- Propietario: nombre del SDR o nombre del AE si se traspasa
- Fecha: fecha del calendario, no "la próxima semana"
- Contingencia: ¿qué sucede si no responden en 5 días?

*Ejemplo:* "SDR (Sarah) enviará video de descripción general de 3 minutos antes del 2026-06-05. Si no hay respuesta antes del 2026-06-10, escalar a seguimiento de AE."

**Objeciones Planteadas**  
Registra cada objeción textualmente. Agrega tu respuesta si se proporcionó. No asumeas que estas son obstáculos para el acuerdo — son datos para la preparación del AE.

*Ejemplo:*
```
Objeción: "Tenemos un competidor y estamos bloqueados hasta Q3 2027."
Respuesta Proporcionada: "Entendido. Cuando se aproxime Q3, ¿tendría sentido evaluar opciones 90 días antes?"
Bandera de Seguimiento: Sí — revisar el 2026-04-01 cuando se acerque la renovación del contrato.
```

---

### II. Estándares de Registro de Actividades

**Sincronización**: Registra cada actividad dentro de 2 horas de su finalización. Sin agrupar a fin de día.

**Cobertura**: Registra cada toque, incluyendo:
- Llamadas telefónicas (entrada/salida)
- Buzones de voz depositados
- Emails enviados (incluir fragmento de línea de asunto)
- Mensajes de LinkedIn, solicitudes de conexión, vistas de perfil en cuentas activas
- Demostraciones, asistencia a seminarios web, descargas de contenido
- Finalizaciones de tareas (seguimiento programado, recurso enviado)

**Códigos de Disposición (Estandarizados)**

| Tipo de Actividad | Código | Definición |
|---|---|---|
| Llamada | Connected | Conversación viva con el objetivo |
| Llamada | Left VM | Buzón de voz depositado; registra el estilo de saludo |
| Llamada | No Answer | Marcó, sin respuesta, sin buzón; intentar de nuevo |
| Llamada | Bad Number | Inválido, persona equivocada o rechazo del portero |
| Email | Sent | Marca de tiempo cuando se implementó; registra asunto |
| Email | Opened | Rastrear vía píxel o suposición de respuesta |
| Email | Replied | Nota el sentimiento de la respuesta (positivo/neutral/negativo) |
| Email | Bounced | No entregable; marcar para re-búsqueda |
| LinkedIn | Message Sent | Nota el nivel de personalización |
| LinkedIn | Profile View | Registra solo si la cuenta es de nivel ACTIVE (ver etiquetado) |
| Otro | Task Completed | Recurso enviado, llamada programada, seguimiento registrado |

---

### III. Taxonomía de Etiquetado del Pipeline

**Cada registro de prospecto debe tener las cuatro capas de etiqueta.** Usa estas etiquetas exactas; no inventes variantes.

#### Etiqueta de Fuente de Prospecto (Una Requerida)
- `INBOUND` — consulta de entrada, envío de formulario, referencia, asistente de evento
- `POSTBOUND` — nurture posterior a evento, asistente a seminario web, descargador de blog
- `BRIDGEBOUND` — introducción cálida, referencia de conexión mutua
- `OUTBOUND` — contacto frío, mensaje en LinkedIn, compra de lista de email

#### Etiqueta de Señal (Qué Desencadenó el Contacto)
Captura la razón específica del contacto:
- `Hiring_Spree` — LinkedIn muestra nuevo recuento de personal (página de contratación, publicaciones de trabajo)
- `Funding_Event` — cierre de Serie A/B, mención de prensa, señal de Crunchbase
- `Leadership_Change` — nuevo CMO, CFO, VP Engineering contratado (LinkedIn)
- `Integration_Partnership` — asociación anunciada con ecosistema de herramientas
- `Compliance_Change` — nueva regulación afectando su industria (SOC 2, HIPAA, GDPR)
- `Earnings_Call` — transcripción de ganancias de empresa pública menciona punto de dolor
- `RFP_Issued` — prospecto emitió RFP (a veces visible en foros de adquisiciones)
- `Contract_Renewal` — fecha estimada de renovación para enfoque de competidor (basado en investigación)
- `Dormant_Account` — contacto anterior inactivo 12+ meses, nueva señal llegó
- `Generic_Outreach` — sin disparador específico; prospección general

#### Etapa de Secuencia (Una Requerida)
- `ACTIVE` — en cadencia activa, se espera toque en los próximos 7 días
- `PAUSED` — en pausa (esperando respuesta, fuera de la oficina, timing incorrecto); fecha de reanudación establecida
- `COMPLETED` — cadencia finalizada; sin más toques a menos que haya nueva señal
- `CONVERTED` — movido a oportunidad, ahora propiedad de AE
- `DEAD` — no calificado, sin respuesta, o explícitamente descalificado; sin más contacto

#### Etiqueta de Nivel (Una Requerida)
- `T1` — comprador económico confirmado, MEDDPICC 80%+ completo, acuerdo inminente (propiedad de AE)
- `T2` — influenciador o usuario identificado, dolor confirmado, 60%+ completo, necesita más calificación
- `T3` — prospecto en etapa temprana, dolor de nivel superficial, 30%+ completo, grupo de prospección de alto volumen

---

### IV. Resumen de Traspaso Previo a la Reunión (SDR → AE)

Crea este documento en Slack, Notion o CRM al transferir una reunión a AE. Tiempo de lectura estimado: 2 minutos. Usa esta estructura exacta:

#### 1. Contexto de la Cuenta (2 Oraciones Máximo)
- Tamaño de la empresa, industria, rango de ingresos
- Qué hacen; por qué creemos que son un buen ajuste

*Ejemplo:* "Revolve es un proveedor de SaaS de nivel medio de £180M en HR vertical. Acaban de recaudar Series C y están escalando de 3 a 8 soluciones en el portafolio de productos."

#### 2. Perfil de Contacto (Rol, Antigüedad, Dolor)
- Título y rol exacto (usa título de LinkedIn si está disponible)
- Antigüedad en la empresa (nivel de influencia)
- Su punto de dolor específico y cita

*Ejemplo:* "Jennifer Martinez, CMO, antigüedad de 2.4 años. A cargo de la pila de tecnología de marketing y personalización. Dolor: 'Estamos atrapados con MarTech heredado y perdiendo paridad de características vs. competidores. Cada nueva herramienta que compramos necesita 4 semanas de trabajo de integración.'"

#### 3. Puntuación y Brechas de MEDDPICC
- Puntuación general (0–100%); desglose por elemento
- Brechas críticas que AE debe abordar en esta reunión

*Ejemplo:*
```
Calificación General: 68%
- Metrics: 75% (se mencionó presupuesto)
- Economic Buyer: 40% (hablé con CMO, no CFO)
- Decision Criteria: 80% (velocidad + profundidad de integración)
- Pain: 85% (cita capturada)
- Champion: 0% (necesito identificar)

Brecha Crítica: Debe determinar comprador económico e implicación de CFO al final de la reunión.
```

#### 4. Mensajería de Secuencia (Qué Se Dijo)
- Ganchos de personalización utilizados (investigación de empresa, anuncio, nombre de referencia)
- Objeciones planteadas (no las repitas; marcarlas)
- Tono de la conversación (receptivo, escéptico, distraído)

*Ejemplo:* "Usé su anuncio de Series C para abrir. Fue receptivo al ángulo de velocidad/integración pero escéptico sobre el costo. Menciona ROI en los primeros 90 días; ella lo pedirá."

#### 5. Por Qué Acordaron Una Reunión
- Qué específicamente resonó; qué los movió de 'no' a 'sí'
- Qué quieren aprender en esta llamada

*Ejemplo:* "Ella accedió cuando dije 'Haríamos una caminata a través de un plan de implementación de 60 días adaptado a su pila.' Ella quiere ver si podemos coincidir con sus requisitos de velocidad sin integraciones de 4 semanas."

---

### V. Reglas de Desduplicación

**Antes de registrar cualquier contacto nuevo en CRM, verifica:**

1. **Coincidencia de email**: Busca por dominio de email de trabajo + nombre/apellido. Si se encuentra, fusiona registros; no crear duplicado.
2. **Coincidencia de URL de LinkedIn**: Si dos registros tienen la misma URL de perfil de LinkedIn, son la misma persona.
3. **Coincidencia de número de teléfono**: Coincidencia exacta de teléfono O misma empresa + mismo nombre = misma persona. Fusionar.
4. **Dedup a nivel de cuenta**: Si el contacto ya está registrado bajo la cuenta de empresa correcta, usa el registro existente en lugar de orfandad.

**Protocolo de fusión:**
- Preservar todo el historial de actividad de ambos registros
- Mantener fecha de contacto original
- Combinar notas (anteponer con marca de tiempo)
- Archivar registro duplicado con nota de fusión

---

### VI. Puertas de Calidad de Datos (Antes de Registrar la Reunión)

**Una reunión no puede registrarse como "programada" hasta que todas las puertas pasen:**

1. **Finalización del campo de contacto**:
   - Nombre: requerido
   - Apellido: requerido
   - Email de trabajo: requerido
   - URL de perfil de LinkedIn: requerido
   - Título de trabajo: requerido

2. **Finalización del campo de cuenta**:
   - Nombre de la empresa: requerido (entidad legal exacta, no apodo)
   - Industria: requerido
   - Tamaño de la empresa (recuento de empleados): requerido
   - Ingresos anuales o etapa de financiación: requerido

3. **Puerta de calificación**:
   - Nivel de prospecto asignado (T1, T2, T3)
   - Al menos un elemento de MEDDPICC confirmado
   - Declaración de dolor capturada (mínimo una oración)

4. **Puerta de rastro de actividad**:
   - Al menos una actividad registrada (llamada, email, mensaje de LinkedIn) en los últimos 30 días
   - Siguiente paso documentado
   - Sin contactos huérfanos (debe vincularse a la cuenta correcta de la empresa)

**Consecuencia**: Si las puertas fallan, la reunión se marca como "aprobación pendiente" en CRM. AE no puede avanzar el acuerdo hasta que SDR remedie los datos.

---

### VII. Lista de Verificación de Finalización de Campos de CRM

**Campos mínimos requeridos por etapa:**

**Etapa de Prospecto (prospecto identificado, no calificado)**
- Contacto: nombre, apellido, email, teléfono, título, empresa, URL de LinkedIn
- Cuenta: nombre de la empresa, industria, tamaño, ingresos, ubicación
- Actividad: disposición de llamada o email enviado (últimos 30 días)
- Etiquetado: fuente de prospecto, disparador de señal, etapa de secuencia (ACTIVE/PAUSED)

**Prospecto Calificado (MEDDPICC 50%+, dolor confirmado)**
- Todos los campos anteriores, más:
- Desglose de MEDDPICC (una oración por elemento)
- Declaración de dolor (cita exacta, si es posible)
- Siguiente paso (fechado, con propietario)
- Objeciones de contacto (si las hay)
- Etiqueta de nivel asignada (T1/T2/T3)

**Reunión Programada (confirmada con prospecto)**
- Todos los campos anteriores, más:
- Fecha/hora/asistentes de la reunión (confirmado)
- Agenda de la reunión (resumen de una línea)
- Resumen de traspaso previo a la reunión (documento de 5 puntos)
- Asignación de AE confirmada
- Tarea de seguimiento creada para el día después de la reunión

**Oportunidad (propiedad de AE, acuerdo en ciclo)**
- Todos los campos anteriores, más:
- Valor del acuerdo (ARR/tarifa única)
- Fecha de cierre (realista)
- Tomador de decisión primario confirmado
- Comprador económico confirmado
- Cadena de aprobación identificada (CEO, CFO, VP, etc.)

---

## Ejemplo

**Escenario**: Sarah (SDR) completa una llamada en frío a Marcus Chen, VP de Producto en una startup de fintech de nivel medio. Él responde, escucha el pitch, pero dice que están bloqueados con su proveedor actual. Sarah documenta la llamada e intercambia información con su AE, James.

**Nota Posterior a la Llamada (Sarah registra dentro de 45 min)**

```
Tipo de Actividad: Llamada Telefónica
Contacto: Marcus Chen
Empresa: PaymentFlow (£80M ingresos, fintech)
Fecha: 2026-06-02, 10:15 AM
Duración: 7 min

QUÉ SUCEDIÓ
Conectado con Marcus Chen, VP de Producto, durante 7 minutos. Él respondió directamente y se enganchó durante todo el pitch.

DOLOR CLAVE MENCIONADO
"Nuestro proveedor actual es sólido pero sigue agregando exceso. Cada actualización tiene características que no necesitamos. Pasamos el 20% del tiempo de ingeniería integrando su basura."

ESTADO DE CALIFICACIÓN
Metrics: Partial (ingresos mencionados, presupuesto no)
Economic Buyer: Missing (hablé con usuario, necesito CFO)
Decision Criteria: Confirmed (exceso de proveedor, carga de integración)
Pain: Confirmed (cita exacta capturada)
Champion: Partial (Marcus es defensor internamente, aún no confirmado)
Timeline: Missing
Implications: Partial (costo de tiempo mencionado, impacto empresarial poco claro)
Commitment: None yet (postura de escucha solo)

SIGUIENTE PASO
Sarah enviará video de demostración de 4 minutos (ejemplos de integración) antes del 2026-06-04.
Si se ve, programar análisis técnico profundo de 30 minutos con Marcus + 1 ingeniero antes del 2026-06-08.
Si no hay respuesta antes del 2026-06-08, pausar secuencia y revisitar Q4 2026 (ciclo de renovación de contrato).

OBJECIONES PLANTEADAS
Objeción: "Estamos bloqueados con nuestro competidor hasta finales de 2027."
Respuesta Proporcionada: "Entendido. Típicamente construimos un caso de negocio para presentar al renovar. ¿Tendría sentido charlar de nuevo alrededor de abril de 2027, 9 meses antes?"
Su Respuesta: "Quizás. Envíame algo primero."
Bandera de Seguimiento: SÍ — agregar a secuencia de renovación de contrato, ciclo 2027-04-01.

ETIQUETAS ASIGNADAS
Lead Source: OUTBOUND
Signal Trigger: Earnings_Call (anuncio reciente de ronda de financiación fintech)
Sequence Stage: ACTIVE (video de demostración pendiente)
Tier: T2 (influenciador, dolor confirmado, presupuesto/timeline faltantes)

TRASPASO A AE (No es necesario aún; se creará antes de que se programe la reunión.)
```

---

**Resumen de Traspaso Previo a la Reunión (Creado 3 días después cuando Marcus acepta la reunión)**

```
PARA: James (AE) | DE: Sarah (SDR) | FECHA: 2026-06-05
REUNIÓN: Marcus Chen, PaymentFlow | PROGRAMADO: 2026-06-09, 2:00 PM

1. CONTEXTO DE LA CUENTA
PaymentFlow es una plataforma fintech de nivel medio de £80M que sirve a SMBs. Recientemente cerraron financiación y están escalando ingeniería para apoyar una velocidad de características más rápida. La sobrecarga de integración es un punto de fricción creciente.

2. PERFIL DE CONTACTO
Marcus Chen, VP de Producto, antigüedad de 2.3 años. Influencia directa sobre la pila de proveedores. Dolor (textualmente): "Cada actualización tiene características que no necesitamos. Pasamos el 20% del tiempo de ingeniería integrando su basura."

3. PUNTUACIÓN DE MEDDPICC
General: 58%
- Metrics: Partial (ingresos conocidos, presupuesto no; estimación necesaria)
- Economic Buyer: Missing (solo hablé con usuario; CFO no contactado aún)
- Decision Criteria: Confirmed (simplicidad + baja carga de integración)
- Pain: Confirmed (exceso de proveedor, sumidero de tiempo)
- Champion: Partial (Marcus será defensor, pero necesito confirmación de par)
- Implications: Missing (impacto empresarial del exceso no cuantificado)
- Commitment: None yet

Brecha Crítica: Debe identificar comprador económico (¿CFO?) y cuantificar costo de sobrecarga de integración en £/horas.

4. MENSAJERÍA DE SECUENCIA
Gancho de apertura: Referenciado su ronda de financiación fintech e narrativa de escalado de ingeniería (de Crunchbase).
Él se enganchó fuertemente en el ángulo de "carga de integración".
Vacilación: Bloqueo de competidor hasta finales de 2027. Posicionó la conversación de renovación como ventana de 9 meses.

5. POR QUÉ ACORDARON
Punto de resonancia: "Haríamos una caminata a través de cómo otras plataformas fintech redujeron la sobrecarga de integración en un 60%."
Él quiere ver: Prueba de empresas similares; ejemplos de integración de bajo contacto.

---

PRÓXIMOS PASOS PARA JAMES:
- Encabezar con comparación de competidores (caso de uso fintech similar).
- Preguntar sobre el tamaño del equipo de integración; cuantificar el costo actual.
- Pregunta de identificación del comprador económico: "¿Quién firma cambios de proveedores aquí?"
- Establecer expectativa: Involucrar a CEO/CFO de Marcus si el acuerdo avanza.
```

---

**Campos de CRM Completados (Salida equivalente a captura de pantalla)**

```
REGISTRO DE CONTACTO: Marcus Chen
Nombre: Marcus
Apellido: Chen
Email: marcus.chen@paymentflow.io
Teléfono: +44 20 XXXX XXXX
Título: VP de Producto
URL de LinkedIn: linkedin.com/in/marcuschen-fintech
Empresa: PaymentFlow

REGISTRO DE CUENTA: PaymentFlow
Nombre Legal: PaymentFlow Ltd.
Industria: Servicios Financieros / Fintech
Recuento de Empleados: 240
Ingresos Anuales: £80M (estimado de Crunchbase)
Etapa de Financiación: Series B/C (ronda reciente)
Sede: Londres, Reino Unido
Sitio Web: paymentflow.com

REGISTRO DE ACTIVIDAD: Últimos 30 Días
- 2026-06-02, 10:15 AM | Llamada Telefónica | Connected (7 min) | Sarah
- 2026-06-04, 2:30 PM | Email Enviado | Enlace de video de demostración | Sarah
- 2026-06-05, 11:00 AM | Email Abierto | Marcus abrió video de demostración
- 2026-06-05, 1:45 PM | Email Respondido | "Interesante. Hablemos." | Marcus
- 2026-06-09, 2:00 PM | Reunión Programada | James (AE) + Marcus + 1 ingeniero

ETIQUETADO
Lead Source: OUTBOUND
Signal Trigger: Earnings_Call / Fintech Expansion
Sequence Stage: CONVERTED (ahora en pipeline de AE)
Tier: T2

CALIFICACIÓN
Dolor (Cita Exacta): "Cada actualización tiene características que no necesitamos. Pasamos el 20% del tiempo de ingeniería integrando su basura."
General de MEDDPICC: 58% (comprador económico faltante, implicaciones faltantes)
Siguiente Paso: Reunión 2026-06-09; AE para identificar CFO/comprador económico
```

---

## Puntos de Referencia y Estándares

- **Tasa de registro objetivo**: 95%+ de actividades registradas dentro de 2 horas. Auditar semanalmente.
- **Calidad de traspaso**: AE nunca debe preguntar "¿Quién es esto?" o "¿Qué dijeron?" — todo el contexto en el resumen.
- **Tasa de dedup**: <2% registros duplicados por 100 nuevos prospectos. Fusionar mensualmente.
- **Tasa de aprobación de puerta de datos**: 90%+ de reuniones programadas cumplen todas las puertas de finalización de campos antes de registrarse como "confirmado".
- **Promedio de MEDDPICC en traspaso de T1**: 80%+ en seis elementos (excluyendo cronograma/implicaciones si aún no se han discutido).
- **SLA de registro de actividad**: 95% dentro de 2 horas; 99% dentro de 4 horas. Cero registros más antiguos que el cierre de jornada comercial.
