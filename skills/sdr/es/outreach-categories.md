# Categorías de Alcance

## Cuándo activar

Cuando necesites determinar qué estrategia de mensajería desplegar para un prospecto o cohorte de leads dados. Usa este marco para:
- Clasificar fuentes de leads inbound, postbound, bridgebound u outbound
- Establecer expectativas de tasa de respuesta antes del lanzamiento de una campaña
- Planificar la duración de la secuencia y el número de contactos basándose en la fortaleza de la señal de intención
- Ajustar el tono del mensajería y la profundidad de personalización en consecuencia
- Asignar etiquetas en el CRM para reportería y lógica de seguimiento

Activa esta habilidad en el momento en que estés a punto de escribir tu primer mensaje de alcance o planificar una secuencia de múltiples contactos.

## Cuándo NO usar

No uses este marco para:
- Justificar mensajería genérica que ignora las diferencias de categoría (ej. usando copia outbound fría para leads inbound)
- Anular la preferencia expresada por un prospecto o señal de opt-out con secuencias más agresivas
- Saltar la verificación de asignación de categoría (ej. asumir que una "descarga de contacto" es inbound sin verificar la fuente)
- Aplicar puntos de referencia a secuencias que carecen de calidad de lista adecuada o seguimiento de landing page
- Mezclar categorías en una sola secuencia sin resegmentación

## Instrucciones

### El Marco ColdIQ: Cuatro Categorías de Fuente de Leads

#### 1. INBOUND — Señal de intención activa

**Definición:** Contacto iniciado por el prospecto. Rellenó un formulario (solicitud de demostración, inscripción a prueba, descarga de contenido cerrado), programó una llamada o se comunicó directamente.

**Características:**
- Intención más alta
- Se autoseleccionó en tu embudo
- Tienes contexto claro para su solicitud (ej. puesto de trabajo, tamaño de empresa, interés en características)
- No se necesita introducción fría

**Expectativas de tasa de respuesta:** 25–40%

**Estrategia de mensajería:**
- Reconoce su acción: "Gracias por inscribirte a la prueba" o "Vi que te registraste para la demostración"
- Confirma su dolor o caso de uso: "Supongo que estás buscando [problema específico que probablemente tengan]"
- Propón un siguiente paso (llamada, incorporación, configuración de producto): "Quiero asegurarme de que aproveches al máximo esto. ¿Podemos hacer una llamada de 15 minutos el martes?"
- Tono: cálido, receptivo, asertivo (están listos)

**Duración de la secuencia:** máximo 2 contactos
- Contacto 1: Dentro de 5 minutos (automatización o humano)
- Contacto 2: 24–48 horas si no hay respuesta (reenganche ligero, no pitch de ventas)

**Convención de etiquetado en CRM:**
```
Source: Inbound | Category: {Demo Request | Trial Signup | Content Download | Referral (inbound)}
Intent Level: High
Response SLA: 5 minutes
```

**Nota ATL vs. BTL:** Los leads inbound se ganan a través de inversión en el tope del embudo (contenido, anuncios pagados, SEO orgánico, marca). Una vez que llegan, el seguimiento BTL (1 a 1) es apropiado y esperado. Presupuesta en consecuencia: el alto gasto en ATL justifica respuesta de ventas de alto contacto.

---

#### 2. POSTBOUND — Comprometido con tu contenido

**Definición:** El prospecto demostró compromiso con tus medios propios o campañas sin solicitar contacto directamente. Vio un webinar, leyó una entrada de blog, hizo clic en un enlace rastreado en un correo electrónico, descargó un informe o asistió a tu evento.

**Características:**
- Señal tibia, pero aún no una solicitud de contacto
- Sabes qué contenido desencadenó el compromiso
- Ha mostrado interés en un tema específico o área de dolor
- Intención más baja que inbound, pero mucho más alta que outbound frío

**Expectativas de tasa de respuesta:** 8–15%

**Estrategia de mensajería:**
- Referencia el contenido específico con el que se comprometieron: "Noté que viste nuestro webinar 'Escalando Sales Ops' la semana pasada"
- Conecta su compromiso a su situación probable: "La mayoría de personas en tu rol ven eso porque [razón común]. ¿Eres tú?"
- CTA suave, no un pitch de demostración: "¿Valdría la pena 15 minutos para explorar qué estamos viendo en tu industria?"
- Tono: informado, conversacional, basado en permiso (no eres frío; estás haciendo seguimiento a una señal)

**Duración de la secuencia:** 3 contactos
- Contacto 1: Dentro de 48 horas de detección de compromiso (mientras esté fresco)
- Contacto 2: 5–7 días después (ángulo alternativo o contenido nuevo)
- Contacto 3: 10–14 días (verificación final "sin presión")

**Convención de etiquetado en CRM:**
```
Source: Postbound | Category: {Webinar | Blog | Email Click | Event | Report Download}
Engagement Date: {timestamp}
Content Consumed: {title}
Intent Level: Medium
```

**Nota ATL vs. BTL:** Los leads postbound son resultados de campañas de generación de demanda. Ya has invertido en el activo de contenido; la secuencia de seguimiento es de menor costo que outbound frío pero aún debe ser específica y respetuosa con el tiempo.

---

#### 3. BRIDGEBOUND — Señal de terceros

**Definición:** Un tercero neutral (ni el prospecto, ni tú directamente) creó un punto de conexión. Ejemplos: visitante del sitio de reseña G2, referencia de cliente actual o socio, revisor de producto competidor, lista de asistentes a conferencia, conexión de LinkedIn, red mutua.

**Características:**
- Intención media: la señal existe, pero el prospecto no se autoseleccionó en tu embudo
- Puedes nombrar el puente explícitamente, creando credibilidad
- La relevancia debe establecerse, no asumirse
- Potencial de prueba social fuerte

**Expectativas de tasa de respuesta:** 5–12%

**Estrategia de mensajería:**
- Nombra el puente explícitamente en tu primera línea: "Noté que dejaste una reseña en G2 para [competidor]" o "Sarah Chen te refirió conmigo" o "Te vi en la lista de asistentes para SaaS North"
- Establece relevancia sin excederte en ventas: "Porque estás evaluando [categoría de producto], pensé que tenía sentido comunicarme"
- Propón un intercambio de valor específico y de bajo roce: "He trabajado con [X empresa similar], y enfrentaron [obstáculo específico]. Feliz de compartir qué funcionó"
- Tono: creíble, específico, basado en valor (no agresivo)

**Duración de la secuencia:** 3 contactos
- Contacto 1: Dentro de 24 horas (el puente es más fresco)
- Contacto 2: 6–8 días después (nuevo ángulo o perspectiva de la industria)
- Contacto 3: 12–15 días (verificación suave final)

**Convención de etiquetado en CRM:**
```
Source: Bridgebound | Category: {G2 Reviewer | Referral | Competitor's Customer | Conference | LinkedIn}
Bridge Source: {name or company}
Credibility Level: {name of mutual connection or third party}
Intent Level: Medium
```

**Nota ATL vs. BTL:** Los leads bridgebound a menudo provienen sin gasto pagado (referencias, reseñas orgánicas, conferencias ya presupuestadas). El seguimiento es ROI alto porque estás aprovechando la prueba social existente. Invierte en personalización aquí.

---

#### 4. OUTBOUND — Puramente proactivo, sin señal previa

**Definición:** Iniciaste contacto sin compromiso, señal o referencia previa. Correo frío, llamada fría, mensaje frío de LinkedIn.

**Características:**
- Intención más baja: el prospecto no tenía razón para esperar o desear tu mensaje
- Fricción más alta que superar
- Requiere personalización basada en desencadenante o encuadre basado en dolor
- Tasas de respuesta más bajas; esfuerzo más alto por respuesta

**Expectativas de tasa de respuesta:** 2–5%

**Estrategia de mensajería:**
- Lidera con desencadenante o dolor, no con tu producto: "Noté que acabas de lanzar un producto en [categoría]. Eso generalmente significa [punto de dolor]" o "Desencadenante basado en rol: la mayoría de contrataciones de Director de Ventas enfrentan [obstáculo específico de 30 días]"
- Evita aperturas genéricas ("Me topé con tu perfil"); usa especificidad: "Recientemente [acción específica de empresa], lo cual me dice que probablemente…"
- Propón un micro-valor primero, no una demostración: "Armé un desglose de 2 minutos de cómo [empresa similar] resolvió [tu obstáculo]. ¿Quieres verlo?"
- Tono: directo, relevante, humilde sobre la naturaleza fría ("Sé que esto es de la nada, pero…")

**Duración de la secuencia:** 4 contactos (las secuencias frías requieren más repetición)
- Contacto 1: Hook inicial (Día 1)
- Contacto 2: Ángulo alternativo o prueba social (Día 4–5)
- Contacto 3: Formato diferente o perspectiva nueva (Día 8–10)
- Contacto 4: CTA final "sin presión" + alternativa (Día 14–16)
- Multiplicador de esfuerzo: 3x más esfuerzo por mensaje que inbound (espera gastar 10–15 min por mensaje outbound vs. 3–5 min para inbound)

**Convención de etiquetado en CRM:**
```
Source: Outbound | Category: {Cold Email | Cold Call | LinkedIn Outreach}
Trigger Used: {specific trigger or pain point}
Sequence: {1 of 4, 2 of 4, etc.}
Intent Level: Low
```

**Nota ATL vs. BTL:** Outbound es BTL puro. No estás aprovechando ningún gasto ATL ni atracción inbound. Esto significa:
- El ROI depende de la calidad de la lista, precisión del desencadenante y habilidad de copia
- La escala está limitada por tu capacidad de personalizar y mantener la capacidad de entrega
- Considera volumen solo después de probar que mantiene 3–5% tasa de respuesta en un segmento de 100 personas
- El costo promedio por dólar de tubería a menudo supera inbound o postbound; usa estratégicamente

---

### Árbol de Decisión: Clasificando tu Lead

```
¿El prospecto tiene una solicitud o acción clara vinculada a tu marca?
├─ SÍ → ¿Es una solicitud directa (formulario, llamada, mensaje)?
│  ├─ SÍ → INBOUND [25-40% reply rate, 2-touch, 5 min SLA]
│  └─ NO → ¿Se comprometieron con tu contenido primero?
│     └─ SÍ → POSTBOUND [8-15% reply rate, 3-touch, 48 hr follow-up]
└─ NO → ¿Un tercero lo refirió o creó un punto de conexión?
   ├─ SÍ → ¿Puedes nombrar el puente de manera creíble?
   │  └─ SÍ → BRIDGEBOUND [5-12% reply rate, 3-touch, 24 hr follow-up]
   └─ NO → OUTBOUND [2-5% reply rate, 4-touch, trigger-based]
```

---

### Convención de Etiquetado en CRM (Unificada)

Para análisis y enrutamiento de secuencia, usa esta estructura:

**Etiqueta primaria:** `Source: {Inbound | Postbound | Bridgebound | Outbound}`

**Etiquetas secundarias (subtipo de categoría):**
- Inbound: `Demo Request` | `Trial Signup` | `Content Download (gated)` | `Inbound Referral`
- Postbound: `Webinar` | `Blog` | `Email Click` | `Event` | `Report Download` | `Product Trial`
- Bridgebound: `G2 Reviewer` | `Paid Referral` | `Organic Referral` | `Competitor's Customer` | `Conference` | `LinkedIn` | `Industry List`
- Outbound: `Cold Email` | `Cold Call` | `LinkedIn Outreach` | `Paid List` | `Account-based Outreach`

**Etiqueta terciaria (nivel de intención):**
- `Intent: High` (Inbound)
- `Intent: Medium` (Postbound, Bridgebound)
- `Intent: Low` (Outbound)

**Etiqueta de etapa de secuencia:**
- `Sequence: 1 of {2|3|4}` (para rastrear conteo de contactos y enrutamiento de automatización)

---

### Evaluación Comparativa de tu Campaña

Antes de lanzar, establece expectativas:

| Categoría | Tasa de Respuesta | Tiempo Promedio de Respuesta | Duración de Secuencia | Costo por Respuesta | Notas |
|----------|------------|-------------------|-----------------|-------------------|-------|
| Inbound | 25–40% | <1 hora | 2 | $0–5 (fulfillment only) | Conversión más rápida, intención más alta |
| Postbound | 8–15% | 24–48 horas | 3 | $5–15 (content + follow-up) | Contenido ya pagado |
| Bridgebound | 5–12% | 24–72 horas | 3 | $10–20 (personalization + research) | Credibilidad del puente es clave |
| Outbound | 2–5% | 48–168 horas | 4 | $20–50 (high effort + list cost) | Requiere 3x más esfuerzo de personalización |

---

### Plantillas de Mensajería por Categoría

#### Plantilla inbound:
```
Escribe un mensaje de seguimiento a un prospecto que {acción específica: solicitud de demostración, inscripción a prueba, etc.}.
Contexto: {por qué probablemente solicitó esto, su puesto de trabajo, tamaño de empresa}.
Objetivo: Confirmar su dolor, proponer una llamada de 15 minutos.
Tono: cálido, receptivo, asertivo de que están listos para hablar.
Largo: máximo 2–3 oraciones.
```

#### Plantilla postbound:
```
Escribe un mensaje de alcance a un prospecto que {tipo de contenido consumido: vio webinar, leyó entrada de blog, etc.}.
Título del contenido: {title}.
Indicador de compromiso: {tiempo de visualización, descarga, clic de enlace}.
Objetivo: Conectar su compromiso a su situación probable; proponer una conversación.
Evita: Pitchear el producto. En su lugar, pregunta si el contenido resonó.
Tono: informado, conversacional, basado en permiso.
Largo: 4–5 oraciones.
```

#### Plantilla bridgebound:
```
Escribe un mensaje de alcance a un prospecto que encontraste vía {fuente del puente: reseña G2, referencia de X, asistente a conferencia}.
Cómo son relevantes: {razón específica por la que coinciden con tu ICP}.
El puente: {nombra el puente explícitamente en la primera oración}.
Objetivo: Establecer credibilidad, proponer una conversación de valor de 15 minutos.
Tono: creíble, específico, no agresivo.
Largo: 5–6 oraciones.
```

#### Plantilla outbound:
```
Escribe un mensaje de alcance frío a un prospecto en {empresa}.
Su desencadenante: {acción específica de empresa, dolor basado en rol o tendencia de industria}.
Tu ángulo único: {por qué tú, no un competidor}.
Objetivo: Lidera con dolor o desencadenante, propón un intercambio de micro-valor (1 min insight, desglose de 2 minutos, etc.).
Evita: "Me topé con tu perfil." Usa especificidad en su lugar.
Tono: directo, humilde sobre ser frío, basado en valor.
Largo: 6–8 oraciones. Esfuerzo: alta personalización requerida.
```

---

### Matriz de Ajuste: ATL (Above-the-Line) vs. BTL (Below-the-Line)

Usa esta matriz para asignar tu presupuesto de ventas y marketing:

| Categoría | Inversión ATL | Inversión BTL | Enfoque Mezclado |
|----------|---|---|---|
| **Inbound** | Alto (anuncios pagos, contenido, SEO) | Medio (seguimiento 1 a 1, apoyo de ventas) | Estrategia de atracción: invierte agresivamente en ATL, escala BTL para coincidir con volumen |
| **Postbound** | Medio (contenido propio, correo electrónico, eventos) | Medio (secuencias de seguimiento específicas) | Estrategia de nurture: usa generación de demanda para calentar leads, luego seguimiento ligero de ventas |
| **Bridgebound** | Bajo a Medio (socio, eventos, reseñas) | Medio (alcance personalizado, construcción de relaciones) | Estrategia de apalancamiento: puentes gratuitos u orgánicos obtienen esfuerzo de ventas de nivel medio |
| **Outbound** | Ninguno (puramente dirigido por ventas) | Alto (personalización, investigación, dialing) | Estrategia de empuje: toda inversión es tiempo de ventas y costo de lista |

---

## Ejemplo

### Escenario: Plataforma SaaS de Sales Ops B2B, Planificación de Campaña Trimestral

**Tu producto:** Plataforma de automatización de operaciones de ventas dirigida a VP/Directores de Ventas.

**Objetivo de campaña:** Generar 20 nuevas oportunidades en Q3.

**Desglose de fuente de leads:**
- 40 leads inbound (solicitudes de demostración)
- 150 leads postbound (espectadores de webinar de tu serie de 3 partes "Scale Sales Ops")
- 30 leads bridgebound (revisores de G2 de tu competidor)
- 200 leads outbound (correo frío a Directores de Ventas en empresas financiadas en Serie A–C)

---

### Ejecución por Categoría:

**INBOUND (40 leads):**
- Respuestas esperadas: 40 × 30% (conservador) = **12 respuestas**
- Secuencia: 2 contactos
  - Contacto 1 (automatizado): Dentro de 5 minutos del envío del formulario. "Gracias por solicitar la demostración. Aquí está tu hora programada: [link]. Me guardaré un asiento."
  - Contacto 2 (humano, si no asiste): 24 horas antes de la llamada programada. "Con ganas de charlar mañana. Aquí hay un video rápido de 2 minutos sobre lo que cubriremos."
- Etiquetas CRM: `Source: Inbound | Category: Demo Request | Intent: High | Sequence: 1 of 2`
- Costo: $0 (solo trabajo de fulfillment, ~5 min por lead)
- Contribución de tubería: 12 conversaciones calificadas (camino de conversión más alto)

---

**POSTBOUND (150 leads):**
- Respuestas esperadas: 150 × 12% (rango medio) = **18 respuestas**
- Secuencia: 3 contactos, escalonados
  - Contacto 1 (Día 0): "Vi que viste la Parte 2 de nuestra serie 'Scale Sales Ops' sobre la automatización de pronósticos. Esa es la parte con la que luchan la mayoría de equipos de ops. ¿Deberíamos hacer una llamada rápida de 15 minutos para ver si [solución] se ajusta?"
  - Contacto 2 (Día 6): "Si aún estás pensando en esto, aquí hay un documento de 1 página sobre cómo [empresa similar] redujo su ciclo de pronóstico en 60%."
  - Contacto 3 (Día 13): "Última verificación — sin presión si este no es el momento correcto. Pero si quieres explorar, estoy disponible esta semana."
- Etiquetas CRM: `Source: Postbound | Category: Webinar | Content: Scale Sales Ops Pt. 2 | Sequence: 1 of 3`
- Costo: $5–10 por lead (contenido de webinar ya pagado; trabajo de seguimiento ~7 min por lead)
- Contribución de tubería: 18 conversaciones calificadas (camino cálido, alto ROI en gasto de contenido)

---

**BRIDGEBOUND (30 leads):**
- Respuestas esperadas: 30 × 8% (conservador) = **2–3 respuestas**
- Secuencia: 3 contactos, puente-primero
  - Contacto 1 (Día 0): "Noté que dejaste una reseña en G2 para [plataforma competidora]. Porque evaluaste ese espacio, pensé que querrías ver cómo [nuestra solución] es diferente. ¿Vale 15 minutos?"
  - Contacto 2 (Día 7): "Vi que [empresa similar, también revisora] se cambió a nosotros el mes pasado porque [característica específica]. ¿Curioso si [problema idéntico] está en tu radar?"
  - Contacto 3 (Día 14): "Una última cosa — tengo algunos datos de evaluación comparativa de tu industria que podrían ser útiles. Avísame si quieres verlos."
- Etiquetas CRM: `Source: Bridgebound | Category: G2 Reviewer | Credibility: G2 Review | Sequence: 1 of 3`
- Costo: $10–15 por lead (investigación + personalización, ~10 min por lead)
- Contribución de tubería: 2–3 conversaciones calificadas (camino creíble, buen ROI para esfuerzo)

---

**OUTBOUND (200 leads):**
- Respuestas esperadas: 200 × 3.5% (rango medio para correo frío bien ejecutado) = **7 respuestas**
- Secuencia: 4 contactos, basados en desencadenante
  - Contacto 1 (Día 0): "Vi que [nombre de empresa] acaba de contratar un VP de Ventas el mes pasado. Eso generalmente significa que la gestión de pronósticos y pipeline son prioridades principales en los primeros 90 días. Ayudamos a equipos de ops a simplificar exactamente eso. ¿Vale 15 minutos para explorar?"
  - Contacto 2 (Día 5): "[Ángulo de prueba social] Directores de Ventas en [empresa similar] nos dijeron que su mayor desafío en los primeros 90 días era acertar en los pronósticos. ¿Está resonando?"
  - Contacto 3 (Día 10): "[Propuesta de valor alternativa] Ángulo diferente: la mayoría de contrataciones de VP heredan procesos de ops rotos. Aquí hay un desglose de 2 minutos de cómo [empresa] arreglaron los suyos en 30 días. ¿Relevante?"
  - Contacto 4 (Día 16): "[Cierre sin presión] Sé que esto es de la nada, pero tengo 15 min el jueves si es útil charlar. Si no, sin problemas."
- Etiquetas CRM: `Source: Outbound | Category: Cold Email | Trigger: VP Sales Hire | Sequence: 1 of 4`
- Costo: $15–25 por lead (investigación + lista + alto trabajo de personalización, ~15 min por lead)
- Contribución de tubería: 7 conversaciones calificadas (intención más baja, esfuerzo más alto)

---

### Resultados de Campaña Mezclada:

| Categoría | Leads | Tasa de Respuesta | Respuestas Esperadas | Esfuerzo (hrs) | Costo | Respuestas por Hora | Contribución de Tubería |
|----------|-------|------------|------------------|---|---|---|---|
| Inbound | 40 | 30% | 12 | 3 | $0 | 4.0 | 12 llamadas de alta intención |
| Postbound | 150 | 12% | 18 | 17.5 | $1,050 | 1.0 | 18 llamadas cálidas |
| Bridgebound | 30 | 8% | 2–3 | 5 | $375 | 0.5 | 2–3 llamadas creíbles |
| Outbound | 200 | 3.5% | 7 | 50 | $4,000 | 0.14 | 7 llamadas frías |
| **TOTAL** | **420** | — | **39–40** | **75.5** | **$5,425** | **0.52** | **39–40 tubería total**|

---

### Perspectivas Clave de Este Ejemplo:

1. **Inbound es tu ROI más alto por mucho.** 40 leads / 3 horas de trabajo = 4 respuestas por hora. Invierte agresivamente en ATL para generar más demanda inbound.

2. **Postbound escala gasto de generación de demanda.** El webinar ya estaba pagado; las secuencias de seguimiento son apalancamiento. A 1 respuesta por hora, sigue siendo ROI sólido.

3. **Bridgebound es apalancamiento de credibilidad.** Bajo volumen (30 leads), pero conversaciones de alta calidad. No ignores G2, referencias y listas de eventos.

4. **Outbound es tu jugada de volumen, no tu jugada de eficiencia.** A 0.14 respuestas por hora, es caro. Pero si tienes capacidad del equipo de ventas y necesitas llenar brechas de tubería, es necesario. Escala solo después de probar 3%+ tasa de respuesta en un piloto.

5. **La campaña mezclada entrega ~40 conversaciones de tubería de 420 leads en Q3.** Esa es una conversión de tubería de 9.5% desde alcance. Si tu tamaño de trato es $50K y tu tasa de cierre es 20%, estás viendo $400K en ingresos potenciales de 75.5 horas de esfuerzo combinado de ventas y fulfillment.

---

### Qué Cambió en la Mensajería Across Categorías:

**Misma empresa, mensaje diferente:**

- **Inbound:** "Gracias por inscribirte. Pongámonos en marcha para el éxito. ¿Estás libre el martes a las 2?"
- **Postbound:** "Vi que viste la Parte 2 de nuestro webinar sobre automatización de pronósticos. Ese es el obstáculo que estamos resolviendo. ¿Vale 15 minutos?"
- **Bridgebound:** "Noté que revisaste [competidor] en G2. Porque evaluaste ese espacio, pensé que querrías ver qué nos hace diferentes."
- **Outbound:** "Vi que [empresa] acaba de contratar un VP de Ventas. Los pronósticos generalmente se convierten en prioridad en los primeros 90 días. Ayudamos a equipos de ops a acertar en eso. ¿Vale una llamada rápida?"

Cada mensaje reconoce la señal específica de categoría y elimina fricción fría donde sea posible.

---

done:es/outreach-categories
