---
name: qbr-builder
description: "Constructor de Revisión Trimestral de Negocio: resumen de salud del cliente, ROI entregado, objetivos para el próximo trimestre, marco de discusión de renovación y expansión"
---

# Habilidad QBR Builder

## Cuándo activar
- Tienes una QBR programada en las próximas 2 semanas y necesitas construir la presentación y los puntos de conversación
- Necesitas cuantificar el ROI entregado a un cliente antes de una conversación de renovación
- Preparándote para una revisión a nivel ejecutivo con el equipo directivo de un cliente
- Construyendo una plantilla de QBR que todo tu equipo de CS puede usar de forma consistente
- Recuperando una relación antes de una QBR — sabes que el cliente no está contento y necesitas una estrategia

## Cuándo NO usar
- Llamadas de incorporación o seguimientos mensuales — esos tienen estructuras diferentes, usa `/customer-success`
- Presentaciones de ventas para prospectos — herramienta diferente, objetivo diferente
- Revisiones de negocio internas (no orientadas al cliente) — usa un flujo de trabajo diferente
- QBRs donde no tienes datos de uso ni resultados que presentar — recopila datos primero

## Instrucciones

### Prompt completo del constructor de QBR

```
Construye una QBR completa para mi cliente.

Cliente: [Nombre de la empresa]
Nivel: [Estratégico / Enterprise / Crecimiento / Estándar]
ARR: $[X]
Fecha de renovación: [fecha — ¿cuántos meses faltan?]
CSM: [nombre]
Contactos del cliente que asisten: [cargo del patrocinador ejecutivo, cargo del defensor, otros]
Mis contactos que asisten: [CSM, AE, VP de CS si es estratégico]
Duración: [30 / 45 / 60 / 90 minutos]
Objetivo principal de esta QBR: [retener / expandir / caso de estudio / restablecer la relación]

Contexto de su negocio:
- ¿En qué industria están? [X]
- ¿Cuáles fueron sus criterios de éxito declarados al inicio del contrato? [X, Y, Z]
- ¿Ha habido algún cambio en su negocio? [cambio de liderazgo / fusión / personal / presupuesto]
- ¿Cuál es su caso de uso principal de nuestro producto? [X]

Contexto de nuestro producto:
- Datos de uso: [inicios de sesión, usuarios activos, uso de funciones principales — describe lo que tienes]
- Cambios de producto este trimestre relevantes para ellos: [funciones lanzadas, errores corregidos]
- Tickets de soporte abiertos o problemas sin resolver: [describe]
- ¿Participaron en alguna función beta o solicitudes? [sí/no]

Contexto comercial:
- MRR/ARR actual: $[X]
- Oportunidad de expansión: [asientos adicionales / complementos / nivel superior] — $[X] potencial
- Amenaza competitiva: [¿tienes conocimiento de alguna evaluación competitiva?]
- Salud de la renovación: [verde / amarillo / rojo — y por qué]

Produce:

## AGENDA DE QBR (para sesión de 60 minutos)

[5 min] Apertura y revisión de la relación
[15 min] Su negocio — qué ha cambiado desde el trimestre pasado
[20 min] Valor entregado — qué lograron con nuestro producto
[10 min] Hoja de ruta — qué viene que les importa
[10 min] Objetivos del próximo trimestre y criterios de éxito

## PUNTOS DE CONVERSACIÓN PARA CADA SECCIÓN

Para cada sección de la agenda:
- 2-3 preguntas para hacer (escucha antes de hablar)
- Datos clave para compartir
- Qué observar (señales: positivo = expansión; negativo = riesgo de cancelación)
- Cómo manejarlo si no están contentos

## DIAPOSITIVA DE ROI (la diapositiva más importante en cualquier QBR)
- Resultado 1: [resultado específico vinculado a sus criterios de éxito declarados]
- Resultado 2: [resultado específico]
- Resultado 3: [resultado específico]
- Si el ROI concreto no está disponible: usa indicadores adelantados (tiempo ahorrado, errores reducidos, tasa de adopción)
- Nunca digas "te ayudamos" — di "lograste X, y aquí está cómo nuestro producto lo hizo posible"

## DISCUSIÓN DE RENOVACIÓN Y EXPANSIÓN
- Cuándo plantear: no hasta que hayas entregado la sección de valor
- Cómo enmarcar: "Basándome en lo que has logrado, aquí está lo que recomendaríamos para el próximo trimestre..."
- Narrativa de expansión: [específica a su situación y señales de uso]
- Manejo de objeciones: [probables objeciones dado su estado de salud actual]

## LISTA DE VERIFICACIÓN PREVIA A LA QBR
□ Envié la agenda con 5 días de anticipación
□ Confirmé la asistencia del patrocinador ejecutivo
□ Extraje todos los datos de uso de los análisis del producto
□ Revisé todos los tickets de soporte de los últimos 90 días
□ Preparé la cuantificación del ROI
□ Informé al AE o VP sobre la situación comercial
□ Conozco la única cosa que podría salir mal y tengo un plan
```

### Marco de cuantificación del ROI

```
Cuantifica el ROI que este cliente ha recibido de nuestro producto este trimestre.

Cliente: [Empresa]
Producto: [describe qué hace]
Su caso de uso: [flujo de trabajo específico para el que lo usan]
Valor del contrato: $[X] ARR

Marco de ROI — usa las dimensiones que apliquen:

AHORRO DE TIEMPO
- Proceso antes de nuestro producto: [describe los pasos manuales]
- Tiempo ahorrado por tarea: [X horas]
- Frecuencia: [X veces por semana/mes]
- Tamaño del equipo que realiza esta tarea: [N personas]
- Horas anuales ahorradas: [X horas/semana × N personas × 52 semanas]
- Valor a $[X]/hora costo completamente cargado: $[X] valor anual
- Múltiplo de ROI: $[X valor] / $[X ARR] = [X:1] ROI

REDUCCIÓN DE ERRORES / CALIDAD
- Tasa de error antes: [X%] errores por [tarea]
- Tasa de error ahora: [X%]
- Costo por error (retrabajo, impacto al cliente, reputación): $[X]
- Ahorros anuales por reducción de errores: $[X]

IMPACTO EN INGRESOS
- ¿Nuestro producto les ayudó a cerrar más tratos, retener clientes o aumentar ingresos?
- Ingresos influenciados o protegidos: $[X]
- Atribución: [¿cómo sabes que nuestro producto impulsó esto?]

PERSONAL EVITADO
- ¿Habrían necesitado contratar [N] personas adicionales sin nuestro producto?
- Salario + beneficios por contratación: $[X]
- Costo de personal evitado: $[X]

VELOCIDAD DE LANZAMIENTO AL MERCADO
- ¿Con qué rapidez lanzan / completan el trabajo?
- Antes: [X días] → Después: [X días]
- Valor competitivo de moverse más rápido: [cualitativo o cuantitativo]

VALOR TOTAL ENTREGADO ESTE TRIMESTRE: $[X]
COSTO DEL CONTRATO ESTE TRIMESTRE: $[X ARR / 4] = $[X]
MÚLTIPLO DE ROI: [X:1]

Si no tienes datos concretos: usa las propias palabras del cliente de tickets de soporte, encuestas NPS o conversaciones anteriores. "Nos dijiste en tu último seguimiento que [X]" es mejor que ninguna evidencia.

Presenta esto como EL LOGRO DE ELLOS, no el tuyo.
```

### Conversación de alineación ejecutiva

```
Prepárame para la parte ejecutiva de una QBR.

Ejecutivo del cliente: [cargo, lo que sabes sobre sus prioridades]
Nivel de riesgo: [cuenta estratégica en riesgo / saludable y en expansión / desconocido]
Mi solicitud de esta conversación: [firma de renovación / discusión de expansión / caso de estudio / referencia]

Marco de conversación ejecutiva:

NO empieces con el producto. Empieza con su negocio.

Preguntas de apertura (elige 2):
- "¿Cuáles son tus 3 prioridades principales para [empresa] en los próximos 12 meses?"
- "¿Cómo se ve el éxito para tu equipo a fin de año?"
- "¿Cuál es el mayor obstáculo entre donde estás ahora y donde quieres estar?"
- "¿Qué te haría estar seguro de que estás invirtiendo en las herramientas correctas para el próximo año?"

Puente desde sus prioridades a tu producto:
"Basándome en lo que has descrito — [su prioridad] — aquí está cómo [tu producto] está apoyando directamente eso..."
Luego entrega tu declaración de ROI en una oración.

Manejo del desenganche ejecutivo:
- Si revisan su teléfono: haz una pregunta directa inmediatamente — "¿Hay algo específico que le gustaría que abordáramos en la sesión de hoy?"
- Si no son el verdadero tomador de decisiones: "¿Quién más debería ser parte de esta conversación para la planificación del próximo trimestre?"

Manejo de la insatisfacción ejecutiva:
- No te pongas a la defensiva. Reconoce y pregunta.
- "Gracias por ser directo — eso es lo que necesito escuchar. ¿Puedes ayudarme a entender cuál es la cosa más importante que necesitamos arreglar?"
- Luego escucha completamente antes de responder.
- Haz un seguimiento el mismo día con un resumen escrito de lo que escuchaste y un plan de acción concreto.

Puente de expansión (usa solo si la relación es sólida y el valor está establecido):
"Dado lo que has logrado este trimestre y lo que me has contado sobre [su prioridad], me gustaría mostrarte qué es posible si extendemos nuestro trabajo juntos hacia [nuevo caso de uso / asientos adicionales / siguiente nivel]."

NUNCA: presenta una expansión antes de haber establecido el valor. El orden importa.

Produce puntos de conversación adaptados a mi ejecutivo y situación específicos.
```

### Plan de recuperación de QBR (cliente en riesgo)

```
Mi cliente de QBR no está contento. Ayúdame a preparar una QBR de recuperación.

Cliente: [Empresa]
Salud: ROJO
Queja principal: [lo que han dicho o señalado]
Causa raíz (tu evaluación): [brecha del producto / fallo en la incorporación / fallo en el soporte / defensor equivocado / vendido incorrectamente]
Renovación: [X meses de distancia]
Su alternativa: [cancelar / pasar a un competidor / reducir el alcance]

Marco de QBR de recuperación:

ANTES DE LA LLAMADA
- No esperes la QBR para reconocer el problema. Envía un correo 3 días antes:
  "Quiero que esta QBR sea la conversación más productiva que hayamos tenido. Sé que [problema específico] no ha estado donde necesita estar, y quiero dedicar tiempo real a abordarlo directamente."
- Trae a tu VP de CS o a un ejecutivo — señala que te lo tomas en serio
- Prepara un plan de acción escrito con anticipación — no improvises

APERTURA (primeros 5 minutos)
- No abras con tu agenda. Abre con reconocimiento:
  "Antes de repasar la agenda, quiero abordar [problema] directamente. No hemos cumplido con lo que nos comprometimos en [área], y quiero dedicar tiempo a cómo lo solucionamos."
- Pausa. Déjalos responder. Escucha completamente.

LA OFERTA DE RECUPERACIÓN
- ¿Qué cambiará específicamente? [lista 3 acciones concretas con responsables y fechas]
- ¿Qué puedes ofrecer como gesto? [soporte dedicado / ETA de corrección del producto / descuento / crédito de servicio]
- ¿Cómo se ve el éxito en 60 días? [defínelo juntos]
- "Si cumplimos con estas tres cosas antes de [fecha], ¿estarías dispuesto a comprometerte a renovar?"

QUÉ NO HACER
- No culpes a tu equipo de producto, equipo de soporte o colegas en la llamada
- No prometas funciones que no puedes lanzar
- No hagas que la llamada sea sobre salvar el contrato — hazla sobre hacerlos exitosos
- No minimices su queja con datos que contradicen su experiencia

POST-LLAMADA EN LAS PRÓXIMAS 24 HORAS
- Resumen escrito de los compromisos hechos
- Responsable nombrado para cada acción
- Fecha de próximo seguimiento dentro de 2 semanas (no el próximo trimestre)

Produce el plan específico de QBR de recuperación para mi cliente.
```

## Ejemplo

**Usuario:** Tengo una QBR con Acme Corp el próximo martes. Son $180K ARR, renuevan en 3 meses. Su CFO y Director de Ops estarán presentes. Tuvieron algunas quejas sobre respuestas de soporte lentas en el T2 pero el uso aumentó un 40% interanual. ¿Cómo estructuro esto?

**Plan de QBR de Claude:**

**Prioridad estratégica: Proteger la renovación de $180K, preparar la conversación de expansión.**

**Agenda para la QBR de Acme Corp — 60 minutos:**

- [0:00] Apertura: "Antes de entrar en nuestra agenda — quiero hacer un seguimiento directo. Tuvimos algunos momentos difíciles con el tiempo de respuesta de soporte en el T2. Quiero entender si eso está resuelto o si sigue siendo una preocupación." [Escuchar — esto saca el riesgo a la luz antes de que te tome por sorpresa]

- [0:10] Su negocio: "De cara al T4 y la planificación de la renovación — ¿cuáles son tus principales prioridades como líder de operaciones de cara al próximo año?" Pregúntale al CFO: "¿Dónde estás viendo más presión en costos o eficiencia ahora mismo?" [Déjalos hablar. Esto revela señales de expansión.]

- [0:20] Valor entregado: "Aquí está lo que logró tu equipo este trimestre..." Lidera con el crecimiento de uso del 40% como señal de salud de la adopción. Conviértelo en ROI: con un 40% más de uso, ¿qué trabajo están haciendo que no hacían antes? Cuantifica en horas o errores reducidos.

- [0:35] Reconocimiento de soporte: "Quiero ser directo sobre el soporte del T2. Los tiempos de respuesta promediaron 36 horas frente a nuestro SLA de 12 horas. Eso no es aceptable. Aquí está lo que cambiamos: [corrección específica]. Aquí está nuestro promedio actual: [datos actuales]. Te enviaré un informe mensual de SLA."

- [0:45] Hoja de ruta: Muestra 2 funciones específicamente relevantes para Ops — sin presentación masiva de producto.

- [0:55] Próximos pasos: "Basándome en tus prioridades para el próximo año — [lo que dijeron] — me gustaría proponer que discutamos [caso de uso de expansión] como parte de tu renovación. ¿Podemos programar 30 minutos con [tu AE] antes de fin de mes?"

**Riesgo clave:** Si el CFO plantea la calidad del soporte como una condición de renovación, ten un crédito de servicio listo para ofrecer — no lo ofrezcas voluntariamente, pero tenlo listo si presionan.

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
