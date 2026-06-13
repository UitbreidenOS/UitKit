# Claude para Administradores de Salud

Todo lo que un Administrador de Salud o Gerente de Consultorio necesita para ejecutar comunicaciones con pacientes, SOPs, seguimiento de cumplimiento normativo, programación de personal y administración de facturación aumentados por IA en Claude Code.

---

## Para quién es esta guía

Eres un gerente de consultorio, administrador de clínica o coordinador de consultorio médico. Tu trabajo consiste en mantener el consultorio en funcionamiento — programación de pacientes, asignación de personal, facturación, documentación de cumplimiento normativo, comunicaciones con proveedores — mientras el personal clínico se concentra en la atención. Tienes demasiados procesos abiertos y no suficientes horas.

**Antes de Claude Code:** 45 minutos para redactar una política de comunicación con pacientes. 30 minutos por actualización de SOP. Seguimiento manual de facturas pendientes. Listas de verificación de cumplimiento gestionadas en hojas de cálculo. Descripciones de puestos escritas desde cero en cada contratación.

**Después:** Plantillas de comunicación con pacientes en 2 minutos. Primeros borradores de SOP en 5 minutos. Correos electrónicos de seguimiento de facturación redactados en 30 segundos. Análisis de brechas de cumplimiento a partir de un documento de política en menos de un minuto. Descripciones de puestos con todas las divulgaciones requeridas en 3 minutos.

---

## Aviso importante — lee antes de comenzar

Claude Code asiste únicamente con **trabajo administrativo**.

- No uses Claude Code para tomar, informar o sugerir decisiones clínicas de ningún tipo
- No pegues datos identificables de pacientes en ningún prompt — nombres, fechas de nacimiento, números de NHS/seguro, direcciones, datos de contacto ni ninguna combinación que pueda identificar a una persona real
- Usa nombres de marcador de posición (p. ej., Paciente A, Sr. X) y referencias anonimizadas en todos los ejemplos
- Todos los resultados deben ser revisados por una persona calificada antes de enviarse a pacientes o usarse en procesos regulados
- Nada en esta guía constituye asesoramiento legal, clínico o regulatorio

Claude Code no es una entidad cubierta por HIPAA y no debe tratarse como parte de tu infraestructura de datos conforme a normativa. Si manejas datos sujetos a HIPAA, GDPR o marcos equivalentes, revisa la política de gobernanza de datos de tu organización antes de usar cualquier herramienta de IA. En caso de duda, consulta a tu Delegado de Protección de Datos o asesor legal.

---

## Instalación en 30 segundos

```bash
# Instalar todas las habilidades y agentes de administración sanitaria
npx claudient add skill ops/dental-practice
npx claudient add skill ops/sop-writer
npx claudient add skill hr/hiring-pipeline
npx claudient add skill hr/job-description
npx claudient add skill compliance/gdpr-expert
npx claudient add skill compliance/privacy-pia

# O instalar los paquetes completos de operaciones, cumplimiento y RRHH:
npx claudient add skills ops
npx claudient add skills compliance
npx claudient add skills hr
```

---

## Tu stack de administración sanitaria con Claude Code

### Habilidades (comandos slash)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/dental-practice` | Plantillas de operaciones del consultorio — recordatorios de citas, cartas de recordatorio, lenguaje de formularios de consentimiento, guiones para el mostrador de recepción | Administración diaria de comunicación con pacientes |
| `/sop-writer` | Primeros borradores de SOPs a partir de puntos clave — formateados, con versiones, listos para revisión | Actualizar o crear procedimientos de administración clínica |
| `/hiring-pipeline` | Flujo de trabajo completo de contratación — publicación de empleo, selección, preguntas de entrevista, oferta | Contratación de personal administrativo, de recepción o de apoyo clínico |
| `/job-description` | Descripciones de puestos conformes a normativa con las divulgaciones requeridas para roles sanitarios | Cualquier requisición de nueva contratación |
| `/gdpr-expert` | Preguntas y respuestas sobre cumplimiento del GDPR, borradores de solicitudes de interesados, revisión del calendario de retención | Gobernanza de datos, solicitudes de datos de pacientes, revisión de políticas |
| `/privacy-pia` | Andamiaje de Evaluación de Impacto en la Privacidad para nuevos sistemas o cambios de procesos | Antes de incorporar cualquier software o flujo de datos nuevo |
| `/invoice-chaser` | Borradores de correos electrónicos de seguimiento de facturas vencidas con tono gradualmente más firme | Perseguir pagos pendientes de aseguradoras o proveedores |
| `/expense-audit` | Marcar anomalías, categorizar gastos, señalar excepciones de política | Revisión mensual de gastos y adquisiciones |
| `/customer-inquiry` | Plantillas de respuesta a consultas de pacientes — preguntas sobre citas, información de servicios, quejas | Redactar respuestas a consultas de pacientes (anonimizadas) |
| `/review-response` | Borradores de respuestas profesionales a reseñas de pacientes en línea | Gestión de reseñas en Google, NHS Choices o Trustpilot |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `roles/healthcare-admin` | Sonnet | Sesiones administrativas completas — programación, comunicaciones, coordinación de facturación |
| `advisors/general-counsel` | Opus | Preguntas de cumplimiento, lenguaje contractual, gobernanza de datos, interpretación regulatoria |
| `advisors/chro-advisor` | Sonnet | RRHH del personal — contratación, proceso disciplinario, contratos, gestión de ausencias |

---

## Flujo de trabajo diario

### Por la mañana — revisión del horario de pacientes (15-20 minutos)

**1. Preparación del día — qué necesita atención hoy**
```
/dental-practice

Prioridades administrativas de hoy:
- Tenemos [N] citas. Señala las que necesiten llamadas de confirmación previa a la cita.
- Redacta un mensaje de recordatorio del mismo día para las citas de la tarde (plantilla anonimizada).
- Cartas de recordatorio pendientes esta semana — redacta la plantilla para [tipo de recordatorio].

Usa nombres de marcador de posición de paciente en todo momento.
```

**2. Clasificación de consultas de pacientes**
```
/customer-inquiry

Redacta respuestas a los siguientes tipos de consultas recibidas esta mañana:
1. Paciente solicitando cambiar de cita — quiere el primer horario disponible
2. Paciente preguntando sobre [tipo de servicio] y costo
3. Queja de paciente sobre tiempos de espera en la última visita

Mantén todas las respuestas profesionales, cálidas y de menos de 150 palabras cada una.
No incluyas datos reales de pacientes — agregaré los nombres manualmente antes de enviar.
```

---

### A mediodía — facturación y administración (20-30 minutos)

**3. Seguimiento de facturas**
```
/invoice-chaser

Redacta correos electrónicos de seguimiento para las siguientes facturas pendientes:
- Factura [ref]: [nombre del Proveedor/Aseguradora], vencida hace [N] días, importe [X]
- Factura [ref]: [nombre del Proveedor/Aseguradora], vencida hace [N] días, importe [X]

Tono para 15 días de vencimiento: recordatorio cortés.
Tono para más de 30 días de vencimiento: firme, con referencia a los términos de pago.
No incluyas datos reales de pacientes en ninguna referencia de factura.
```

**4. Revisión de gastos**
```
/expense-audit

Aquí está el resumen de gastos de este mes por categoría:
[Pegar datos de gasto anonimizados — sin identificadores de pacientes]

Señala cualquier cosa que parezca inusual, que supere el presupuesto o que esté fuera de la política.
Resume para el informe mensual del gerente del consultorio.
```

---

### Por la tarde — cumplimiento normativo y documentación (20-30 minutos)

**5. Actualización de SOP**
```
/sop-writer

Necesito un primer borrador de un SOP para:
[Tema — p. ej., "gestión de solicitudes de acceso a datos de pacientes"]

Pasos clave que sé que debe cubrir:
- [Paso 1]
- [Paso 2]
- [Paso 3]

Formato: pasos numerados, responsable de cada paso, frecuencia de revisión, cuadro de versión en la parte superior.
Señala las brechas donde necesite consultar a nuestro DPO o equipo legal.
```

**6. Verificación de cumplimiento**
```
/gdpr-expert

Estamos planificando incorporar un nuevo [software/proceso] que manejará [tipo de datos].
Guíame a través de las preguntas que necesito responder antes de la aprobación:
- ¿Necesitamos una EIP?
- ¿Qué acuerdos de procesamiento de datos necesitamos?
- ¿Cómo debería ser el calendario de retención?

Sin datos reales de pacientes — este es un ejercicio de planificación.
```

---

### Coordinación del personal (según sea necesario)

**7. Contratación — nuevo puesto**
```
/job-description

Puesto: [título — p. ej., Recepcionista / Coordinador del Consultorio / Secretario Médico]
Entorno: [consulta de médico de cabecera / consultorio dental / clínica especializada]
Horas: [tiempo completo / tiempo parcial]
Responsabilidades principales: [lista de puntos]
Calificaciones requeridas: [lista]
Divulgaciones requeridas: se requiere verificación de antecedentes, verificación del derecho a trabajar

Redacta una descripción de puesto conforme a normativa y un breve anuncio de empleo para NHS Jobs / Indeed.
```

**8. Proceso de entrevista**
```
/hiring-pipeline

Estamos contratando a un [puesto]. Tenemos [N] candidatos en la etapa de selección.

Redacta:
1. Un conjunto de preguntas de entrevista estructuradas (8-10 preguntas, basadas en competencias)
2. Una rúbrica de puntuación para cada pregunta
3. Una plantilla estándar de correo electrónico de rechazo
4. Un esquema de carta de oferta (agregaré los términos específicos antes de enviar)
```

---

### Semanalmente — revisión e informes (viernes, 30 minutos)

**9. Respuesta a reseñas en línea**
```
/review-response

Recibimos la siguiente reseña en línea:
[Pegar la reseña — eliminar cualquier detalle que pueda identificar al paciente]

Redacta una respuesta profesional que:
- Agradezca al revisor
- Reconozca la preocupación sin admitir responsabilidad
- Invite al paciente a contactar directamente al consultorio
- No supere las 100 palabras
```

**10. Resumen administrativo semanal**
```
/dental-practice

Redacta un resumen administrativo semanal para el director del consultorio:
- Citas esta semana: [N]
- Quejas recibidas: [N]
- Facturas pendientes: [N], total [X]
- SOPs actualizados: [lista]
- Acciones de cumplimiento abiertas: [lista]
- Problemas de personal: [descripción]

Formato de una página. Señala los elementos que requieren la firma del director.
```

---

## Plan de incorporación de 30 días (administradores nuevos en Claude Code)

### Semana 1 — Configuración y orientación
- Instalar todas las habilidades mediante `npx claudient add skills ops compliance hr`
- Leer la sección de aviso en su totalidad — informar a tu equipo sobre qué no debe pegarse en los prompts
- Ejecutar `/sop-writer` en tus tres procedimientos más usados — familiarizarte con la calidad de la salida antes de depender de ella
- Usar `/gdpr-expert` para auditar un proceso de datos existente que te corresponda
- Redactar tu primera plantilla de comunicación con pacientes con `/dental-practice` — comparar con tus plantillas actuales
- Leer la política de gobernanza de datos de tu organización antes de usar Claude Code en cualquier tarea administrativa real

### Semana 2 — Comunicaciones y facturación
- Usar `/customer-inquiry` para crear una biblioteca de 10 plantillas estándar de respuesta a consultas de pacientes
- Redactar todos los seguimientos de facturas vencidas con `/invoice-chaser` — comparar la tasa de respuesta con el mes anterior
- Ejecutar `/expense-audit` en los gastos del mes pasado — presentar los hallazgos a tu gerente
- Comenzar a rastrear el tiempo dedicado a la administración de comunicaciones en comparación con tu línea de base antes de Claude Code

### Semana 3 — Cumplimiento normativo y documentación
- Ejecutar `/privacy-pia` en el próximo cambio de sistema o proceso en tu canal
- Usar `/gdpr-expert` para responder una pregunta de cumplimiento pendiente que tu equipo ha estado postergando
- Actualizar al menos dos SOPs usando `/sop-writer` — enviar ambos para revisión clínica o de gestión
- Identificar tu tarea administrativa recurrente de mayor volumen y crear una plantilla reutilizable para ella

### Semana 4 — Personal e informes
- Usar `/hiring-pipeline` y `/job-description` en tu próximo puesto vacante — medir el tiempo ahorrado en comparación con tu contratación anterior
- Ejecutar `/review-response` en tus últimas cinco reseñas en línea sin respuesta
- Producir tu informe administrativo mensual usando Claude Code — comparar el tiempo empleado con meses anteriores
- Presentar una mejora de proceso a tu director del consultorio, respaldada por datos de ahorro de tiempo

---

## Concienciación sobre HIPAA y manejo de datos

Si tu consultorio está sujeto a HIPAA (EE. UU.), GDPR (Reino Unido/UE) o marcos equivalentes, sigue estas reglas sin excepción:

- **Nunca pegues el nombre real de un paciente, fecha de nacimiento, dirección, número de teléfono, correo electrónico o número de seguro/NHS en ningún prompt**
- Usa marcadores de posición: "Paciente A", "Sr. X", "Fecha de nacimiento: [oculta]", "Ref. de reclamación: [ref]"
- Trata Claude Code como tratarías cualquier herramienta SaaS de terceros — no compartas datos que no compartirías con un proveedor externo sin un acuerdo de procesamiento de datos firmado
- Mantén un registro de los procesos administrativos para los que usas Claude Code — tu DPO puede necesitar esto para un registro de tratamiento
- Si recibes una solicitud de acceso del interesado (SAR), usa `/gdpr-expert` para redactar la lista de verificación del proceso, pero gestiona los datos reales del paciente completamente fuera de Claude Code

En caso de duda, construye y prueba tu plantilla usando un ejemplo ficticio, y luego aplícala manualmente a los datos reales en tu sistema de gestión del consultorio.

---

## Métricas de referencia

Rastrea estas métricas mensualmente para demostrar valor a tu director del consultorio:

| Métrica | Antes de Claude Code | Objetivo con Claude Code |
|---|---|---|
| Horas administrativas ahorradas por semana | Línea de base | 4-8 horas |
| Tiempo para redactar una plantilla de comunicación con pacientes | 30-45 min | Menos de 5 min |
| Tiempo para el primer borrador de un SOP | 45-60 min | Menos de 10 min |
| Tiempo de respuesta a consultas de pacientes | 24-48 horas | El mismo día |
| Tiempo de resolución de facturas pendientes | 14+ días | 7-10 días |
| Tiempo de redacción de descripciones de puestos | 60-90 min | Menos de 15 min |
| Tasa de respuesta a reseñas en línea | Variable | 100% en 5 días |
| Tareas de cumplimiento completadas a tiempo | Seguimiento manual | Mejorar en un 30% |

Realiza una medición de referencia en la Semana 1 antes de usar Claude Code a escala. Revisa a los 30 y 90 días.

---

## Recursos

- [Primeros pasos con Claude Code](../getting-started.md)
- [Habilidad de escritura de SOP](../skills/ops/sop-writer.md)
- [Habilidad de experto en GDPR](../skills/compliance/gdpr-expert.md)
- [Habilidad de PIA de privacidad](../skills/compliance/privacy-pia.md)
- [Habilidad de canal de contratación](../skills/hr/hiring-pipeline.md)
- [Habilidad de seguimiento de facturas](../skills/finance/invoice-chaser.md)

---
