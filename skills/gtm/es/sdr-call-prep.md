---
name: sdr-call-prep
description: "Preparación previa a la llamada para SDRs: resumen de cuenta, guiones de conversación personalizados, respuestas a objeciones, preguntas de descubrimiento y estructura de llamada — generados en menos de 2 minutos"
---

# Habilidad de Preparación de Llamadas para SDR

## Cuándo activar
- Tienes una llamada en frío o de descubrimiento en los próximos 30-60 minutos
- Quieres un guión estructurado adaptado al contexto específico de un prospecto
- Necesitas scripts de manejo de objeciones listos antes de marcar
- Preparándote para una cuenta de alta prioridad y necesitas investigación + ángulos rápido
- Construyendo una plantilla de preparación de llamadas reutilizable para tu equipo de SDR

## Cuándo NO usar
- Post-llamada — usa `/sdr-call-analysis` para seguimiento y coaching
- Scripts genéricos de llamadas en frío sin contexto del prospecto — no funcionarán
- Llamadas internas o check-ins de éxito del cliente — marcos distintos
- Cuando tienes menos de 5 minutos — usa el formato de resumen rápido que se muestra abajo

## Instrucciones

### Prompt completo de preparación de llamada

```
Prepárame para una llamada en frío con [NOMBRE], [CARGO] en [EMPRESA].

Mi producto: [lo que vendes en una línea]
Señales de ajuste al ICP para esta cuenta: [por qué esta empresa es un buen ajuste]
Desencadenante reciente: [financiación, contratación ejecutiva, lanzamiento de producto, pico de contratación — o "ninguno identificado"]
Objetivo de la llamada: [agendar un descubrimiento de 20 minutos / calificar para demo / reactivar prospecto frío]

Genera:

## 1. Resumen previo a la llamada (lee esto antes de marcar)
- Qué hace [EMPRESA] (1 oración)
- Qué le importa a [NOMBRE] en su rol
- LA UNA razón para llamarles hoy (desencadenante o momento oportuno)
- El resultado más probable: [contestará / contestará asistente / correo de voz]

## 2. Apertura (primeros 15 segundos)
Versión de correo de voz (si no contesta):
Versión de llamada en vivo (si contestan):

Reglas:
- Di nombre + empresa en la primera oración
- Apertura basada en permiso: "¿Te cogí en mal momento?"
- Referencia al desencadenante en los primeros 10 segundos
- NO digas "¿Cómo estás?" — pierde tiempo y suena scripted

## 3. Guión de conversación (si se quedan en la línea)
Gancho: [razón personalizada para llamar — referencia el desencadenante]
Puente: [conecta su mundo con tu producto — 2 oraciones]
Preguntas de descubrimiento: [3 preguntas abiertas para entender su situación]
Transición a reunión: [cómo agendar el siguiente paso]

## 4. Manejo de objeciones (las 4 principales para este prospecto)
Basado en su rol y empresa:
[Objeción 1]: [Respuesta]
[Objeción 2]: [Respuesta]
[Objeción 3]: [Respuesta]
[Objeción 4]: [Respuesta]

## 5. Preguntas de descubrimiento (si se abren)
Objetivo: entender dolor, cronograma, partes interesadas, autoridad presupuestaria
[5 preguntas abiertas — no orientadas al producto, orientadas al dolor]

## 6. Cierre de reunión
Cómo transicionar de una llamada positiva a una reunión agendada:
[Lenguaje exacto a usar — franjas horarias específicas, no "cuando sea conveniente"]

## 7. Script de correo de voz (30 segundos máximo)
[Correo de voz completo — nombre, gancho, solicitud de devolución de llamada]
```

### Formato de resumen rápido (menos de 2 minutos, usar cuando el tiempo es limitado)

```
Preparación rápida de llamada para [NOMBRE] en [EMPRESA].

Dame:
1. Qué hacen (10 palabras)
2. Por qué llamarles hoy (1 desencadenante)
3. Línea de apertura (scripted, no genérica)
4. Su objeción #1 más probable + respuesta en 1 oración
5. Cierre: palabras exactas para agendar la reunión
```

### Estructura del guión de conversación (el marco A-B-C)

```
A — ANCLA (por qué les estás llamando específicamente)
"Llamo porque noté [desencadenante específico] — eso suele ocurrir cuando empresas como la tuya están [dolor relevante]."

B — PUENTE (conecta su mundo con tu producto)
"Ayudamos a [su tipo de empresa] a resolver [dolor específico] — [resultado en números si es posible]."

C — CONFIRMA (llega al sí/no rápido)
"¿Es algo en lo que estás pensando? / ¿Vale la pena 20 minutos para ver si hay ajuste?"

---

AVANZADO: Añade el apertura LOOP para llamadas en frío
"Oye [NOMBRE], [TU NOMBRE] de [EMPRESA]. Sé que llamo de la nada — 
¿tienes 27 segundos para que te explique por qué llamo, y si no tiene sentido 
puedes colgar de inmediato?"
→ Esta apertura desarmante tiene una tasa de respuesta del 60%+ frente a aperturas tradicionales
```

### Banco de preguntas de descubrimiento (por categoría de dolor)

```
PRODUCTIVIDAD / TIEMPO:
- "Cuéntame cómo maneja tu equipo actualmente [X] — ¿dónde se ralentiza?"
- "Si pudieras eliminar una tarea manual que hace tu equipo cada semana, ¿cuál sería?"

CRECIMIENTO / INGRESOS:
- "¿Qué está impidiendo [objetivo] ahora mismo?"
- "¿Cuántos [leads / tratos / clientes] estás dejando sobre la mesa por [brecha en el proceso]?"

EQUIPO / ESCALA:
- "¿Cómo está estructurado el equipo para manejar [función] hoy?"
- "¿Cuándo fue la última vez que este proceso falló a escala?"

COMPETITIVO:
- "¿Qué estás usando hoy para [X] — qué te gusta y qué le falta?"
- "¿Has evaluado alternativas en los últimos 6 meses?"

CRONOGRAMA / URGENCIA:
- "¿Es [problema] algo que necesitas resolver este trimestre, o es más una prioridad para 2027?"
- "¿Qué tendría que ser verdad para avanzar en los próximos 60 días?"

PARTES INTERESADAS:
- "¿Quién más estaría involucrado en evaluar algo como esto?"
- "Si esto tuviera sentido para ti, ¿cómo se suele tomar una decisión de este tipo?"
```

### Scripts de manejo de objeciones (optimizados para voz — más cortos que por email)

```
OBJECIÓN: "No me interesa"
→ "Totalmente válido — ¿puedo preguntar, es que esto no es relevante, o simplemente no es el momento adecuado?"
   (Si no es relevante: aclara. Si es el momento: "¿Cuándo sería mejor?")

OBJECIÓN: "Ya tenemos una solución"
→ "Bueno saberlo. ¿Estás contento con ella o hay algo que desearías que hiciera mejor?"
   (Abre una grieta. No presiones — deja que respondan.)

OBJECIÓN: "Envíame un email"
→ "Con gusto — para enviarte lo correcto, ¿qué específicamente quisieras que cubriera?"
   (Convierte una evasiva en compromiso. Luego: "¿Puedo hacer seguimiento con una llamada rápida el jueves?")

OBJECIÓN: "Ahora no es buen momento"
→ "Sin problema — ¿cuándo sería mejor? Puedo llamar en 5 minutos o la próxima semana — 
   lo que te venga mejor."
   (Ofrece alternativas específicas, no "cuando quieras")

OBJECIÓN: "No tenemos presupuesto"
→ "Tiene sentido — ¿es un problema de momento, o el problema no tiene presupuesto asignado?
   A veces podemos estructurar pilotos de manera que salga de un presupuesto diferente."

OBJECIÓN: "¿Quién eres?"
→ "Perdona — [NOMBRE] de [EMPRESA]. Hacemos [lo que haces en 10 palabras]. Llamo porque 
   [desencadenante]. ¿Suena como algo que valdría 20 minutos?"
```

### Fórmula de correo de voz (máximo 27 segundos)

```
"Oye [NOMBRE], [TU NOMBRE] de [EMPRESA].

Llamo porque [desencadenante específico — p.ej. "vi que tu equipo acaba de contratar a un nuevo VP de Ventas"].

Ayudamos a [su tipo de empresa] a [resultado — p.ej. "agendar un 40% más de reuniones sin añadir headcount"].

Lo intento de nuevo [día/hora específicos — p.ej. "el jueves a las 2pm"], 
o puedes reservar tiempo aquí: [enlace corto de Calendly].

Que tengas un buen [día/semana], [NOMBRE]."

---

Reglas:
- 27 segundos o menos — los correos de voz más largos tienen <5% de tasa de devolución
- Usa el nombre dos veces — al principio y al final
- Dale un siguiente paso específico (no llamarán de vuelta sin motivo)
- NUNCA digas "llámame cuando puedas"
```

### Matriz de llamadas con múltiples partes interesadas

```
Si estás llamando a una empresa con múltiples contactos, prepárate para cada uno:

| Contacto | Rol | Su prioridad | Mejor apertura | Objeción clave |
|---|---|---|---|---|
| [Campeón] | Usa el producto | Eficiencia / funciones | Referencia de par | "Nuestro equipo ya probó X" |
| [Comprador económico] | CFO/VP | ROI / riesgo | Datos de resultado de negocio | "No está en el presupuesto" |
| [Evaluador técnico] | CTO/IT | Seguridad / integración | Ajuste de arquitectura | "Nuestro stack es diferente" |
| [Guardián] | Asistente/recepcionista | Proteger el tiempo del jefe | Cálido, directo | "¿De qué se trata?" |
```

## Ejemplo

**Usuario:** Preparación de llamada para Marcus Chen, VP de Ventas en Lattice. Vendo una plataforma de coaching de ventas. Acaban de anunciar una Serie D ($175M).

**Resultado:**

**Resumen previo a la llamada:**
Lattice es una plataforma de RRHH y gestión del desempeño para equipos de personas. Marcus Chen dirige un equipo de ventas en crecimiento que acaba de recibir una importante inyección de financiación — escalarán reps rápidamente. Su prioridad: velocidad de incorporación y desempeño consistente en un equipo más grande.

**Apertura (llamada en vivo):**
"Oye Marcus, [Nombre] de [Empresa]. Sé que llamo de la nada — ¿tienes 30 segundos? Vi que Lattice cerró la Serie D — felicidades. Escalar un equipo de ventas rápido generalmente significa que la consistencia del coaching se convierte en un problema real. Eso es exactamente lo que resolvemos. ¿Vale la pena 20 minutos?"

**Las 3 principales objeciones + respuestas:**
1. "Usamos Gong" → "Nos integramos con Gong — nos situamos encima de él para flujos de trabajo de coaching estructurados. ¿Estás contento con cómo están incorporándose los reps hoy?"
2. "No está en el presupuesto" → "Entendido — ¿es esto una prioridad del Q3, o no está en el radar hasta el próximo año?"
3. "Envíame información" → "Con gusto — ¿qué sería más útil: datos de ROI o un clip de demo rápido? Puedo enviarte cualquiera en los próximos 5 minutos."

**Cierre de reunión:**
"Si algo de esto resuena, tengo el jueves a las 2pm o el viernes a las 10am — ¿cuál te funciona mejor?"

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
