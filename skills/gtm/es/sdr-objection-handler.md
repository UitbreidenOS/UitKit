---
name: sdr-objection-handler
description: "Generador dinámico de respuestas a objeciones para SDRs: réplicas contextuales para objeciones de precio, competidor, momento, relevancia y guardián — variantes para voz y email"
---

# Habilidad de Manejo de Objeciones para SDR

## Cuándo activar
- Acabas de recibir una objeción en una llamada o por email y necesitas una respuesta inmediata
- Construyendo un manual de manejo de objeciones para tu equipo u onboarding de nuevos SDRs
- Sesiones de entrenamiento — generando escenarios de práctica de objeciones
- Quieres poner a prueba tu pitch generando las objeciones más difíciles que podría plantear un prospecto
- Revisando transcripciones de llamadas pasadas para identificar oportunidades perdidas ante objeciones

## Cuándo NO usar
- Clasificación de respuestas a escala — usa `/sdr-reply-classifier` para la clasificación automatizada del buzón
- Objeciones de nivel AE durante el cierre (legal, compras, precio final) — conjunto de habilidades diferente
- Objeciones de clientes en llamadas de renovación — dominio de CS, no SDR

## Instrucciones

### Generador instantáneo de respuestas a objeciones

```
Genera una respuesta a esta objeción.

Contexto:
- Mi producto: [lo que vendes]
- Prospecto: [cargo, empresa, industria]
- Canal: [llamada en frío (voz) | email | LinkedIn]
- Etapa: [contacto en frío | seguimiento | descubrimiento | fin de llamada]

Objeción: "[palabras exactas o paráfrasis]"

Genera:
1. Reconocer (1 oración — valida sin estar de acuerdo)
2. Reencuadrar (1-2 oraciones — cambia la perspectiva)
3. Prueba/Pregunta (1 oración — evidencia o pregunta de descubrimiento)
4. Próximo paso (1 oración — avanza la conversación)

También proporciona:
- Tono: [seguro / empático / curioso]
- Qué NO decir
- Si es probable que sea una objeción real o una evasiva
```

### Generador de manual completo de objeciones

```
Construye un manual de manejo de objeciones para mi producto.

Producto: [descripción]
ICP: [cliente ideal — industria, tamaño, rol]
Principales competidores: [1-3 competidores principales]
Objeciones típicas por categoría:

PRECIO:
- "Es demasiado caro"
- "No está en el presupuesto"
- "El competidor es más barato"

COMPETIDOR:
- "Usamos [Competidor]"
- "Lo construimos internamente"
- "Probamos algo similar antes y no funcionó"

MOMENTO:
- "Ahora no es buen momento"
- "Estamos congelados"
- "Pregúntame el próximo trimestre"
- "Acabamos de firmar un contrato con alguien más"

RELEVANCIA:
- "Esto no aplica para nosotros"
- "Somos diferentes a tus otros clientes"
- "Nuestro equipo maneja esto manualmente y funciona bien"

CONFIANZA:
- "Nunca he oído hablar de tu empresa"
- "Necesito investigar más"
- "Envíame un caso de estudio primero"
- "Déjame hablar con mi equipo"

Por cada objeción: genera una respuesta de voz (<30 segundos) y una versión por email (4-6 oraciones).
```

### El marco LAER (mejores prácticas para el manejo de objeciones)

```
L — LISTEN (ESCUCHA)
No interrumpas. Deja que terminen. Nota las palabras exactas — importan.

A — ACKNOWLEDGE (RECONOCE)
"Tiene sentido." / "Te escucho." / "Buen punto."
Nunca: "En realidad, eso no es cierto" / "Pero..." / "Entiendo, sin embargo..."

E — EXPLORE (EXPLORA)
Haz una pregunta antes de responder. Las objeciones tienen sub-objeciones.
"¿Puedo preguntar — es porque [A] o más bien [B]?"
"¿La preocupación es el precio en sí, o la confianza en el ROI?"

R — RESPOND (RESPONDE)
Ahora responde — pero solo después de entender qué hay realmente detrás de la objeción.
Empieza con: evidencia, una pregunta o un reencuadre.
Nunca: un volcado de características.

---
La mayoría de los reps omiten A y E y saltan directamente a R.
Por eso las objeciones no se resuelven — los prospectos se sienten ignorados.
```

### Scripts de objeciones — biblioteca completa

```
── OBJECIONES DE PRECIO ─────────────────────────────────────────────────────

"Es demasiado caro"
VOZ: "Totalmente válido — ¿puedo preguntar, la preocupación es el costo absoluto, o si el ROI tiene sentido?
      Porque los equipos de tu escala típicamente ahorran [X horas/mes]. ¿Vale la pena ver los números?"
EMAIL: "La preocupación de precio es válida — debí haber empezado con los resultados.
        [Empresa similar] ahorra [X horas/semana] con nosotros, lo que equivale a [$] a tu tarifa por hora.
        Puedo explicar el cálculo del ROI en una llamada rápida — ¿sería útil?"

"No está en el presupuesto"
VOZ: "¿Es una situación de 'no tenemos presupuesto para nada ahora mismo', o más que esta
      categoría no tiene presupuesto asignado? Porque a veces podemos trabajar con [punto de entrada menor]."
EMAIL: "Entendido sobre el presupuesto — ¿es una conversación para Q3/Q4, o no está en el radar hasta [año]?
        A veces podemos estructurar un piloto limitado que cabe en un presupuesto diferente.
        De todas formas, ¿vale la pena mantenerse en contacto?"

"Tu competidor es más barato"
VOZ: "Probablemente sí. ¿Puedo preguntar — ¿están obteniendo [resultado específico] con ellos hoy?
      La mayoría de los equipos que cambian a nosotros lo hacen porque [1 diferencia concreta], no por el precio."
EMAIL: "Tienes razón en que [Competidor] tiene precios diferentes.
        Los equipos que se pasan a nosotros suelen hacerlo porque [brecha específica del competidor].
        ¿Es [brecha] algo con lo que estás lidiando? Si no, puede que ellos sean genuinamente la mejor opción para ti."

── OBJECIONES DE COMPETIDOR ─────────────────────────────────────────────────

"Ya usamos [Competidor]"
VOZ: "Bueno saberlo — ¿estás contento con cómo está funcionando, o hay algo que desearías que hiciera mejor?"
EMAIL: "Tiene sentido — [Competidor] hace buen trabajo en [área]. La mayoría de los equipos que nos añaden usan ambos
        porque [Competidor] cubre [X] pero no cubre [Y]. ¿Es [Y] algo con lo que estás lidiando?"

"Lo construimos internamente"
VOZ: "Impresionante — ¿qué construyeron? Me pregunto si están cubriendo [brecha específica]."
EMAIL: "Interesante — las herramientas internas suelen ser una gran solución para el caso de uso principal.
        La razón por la que equipos como el tuyo aún hablan con nosotros suele ser [carga de mantenimiento / escala / nuevos casos de uso].
        ¿Algo de eso es relevante, o están completamente cubiertos?"

"Probamos algo similar y no funcionó"
VOZ: "Eso es útil saberlo — ¿qué pasó? Porque eso determina si realmente somos diferentes
      o solo otra versión del mismo problema."
EMAIL: "Es útil saberlo — las implementaciones fallidas suelen deberse a [configuración / adopción / caso de uso incorrecto].
        ¿Puedo preguntar qué falló? Porque si es el mismo problema de raíz, prefiero decírtelo ahora que desperdiciar tu tiempo."

── OBJECIONES DE MOMENTO ────────────────────────────────────────────────────

"No es buen momento — estamos ocupados"
VOZ: "Totalmente entendido. ¿Cuándo es realista — la próxima semana, o es más una conversación para el próximo trimestre?"
       (Dales dos opciones — el "cuando sea" abierto nunca se agenda)
EMAIL: "Entendido — el momento importa. ¿Vale la pena retomar en [mes específico],
        o debería volver más adelante en el año? Puedo hacer lo que sea más útil."

"Estamos en una congelación de presupuesto"
VOZ: "Entendido — ¿cuándo se levanta la congelación? ¿Y es algo que querrías ver cuando lo haga?"
EMAIL: "Las congelaciones de presupuesto son reales — ¿cuándo se abre la ventana?
        Puedo programar un recordatorio para [mes específico] y contactarte entonces, en lugar de saturar tu bandeja ahora."

"Acabamos de firmar con alguien más"
VOZ: "Felicidades — es una gran decisión. Por curiosidad, ¿qué te convenció de ellos?
      ¿Y qué tendría que cambiar para que reconsideraras en 12 meses?"
       (Obtén inteligencia competitiva. Siembra una semilla. Avanza.)
EMAIL: Sin email — acepta con elegancia y programa un recordatorio de CRM para la fecha de renovación del contrato.

── OBJECIONES DE RELEVANCIA ─────────────────────────────────────────────────

"Somos diferentes / esto no aplica"
VOZ: "Válido — ¿cómo manejan [caso de uso específico] hoy? Porque a veces parece diferente en
      la superficie pero el problema subyacente es similar."
EMAIL: "Puede que tengas razón — ¿puedo preguntar: cómo maneja tu equipo actualmente [proceso específico]?
        Si lo tienen resuelto, no desperdiciaré tu tiempo. Si hay una brecha, vale 15 minutos."

"Lo hacemos manualmente y funciona"
VOZ: "¿Cuánto tiempo les toma a la semana? Porque si genuinamente es rápido, probablemente no somos un buen ajuste.
      Pero si les está tomando [X horas], eso suele ser donde la conversación se pone interesante."
EMAIL: "Lo manual funciona hasta que no funciona — ¿cuál es el volumen hoy y cuál es el techo?
        La mayoría de los equipos hablan con nosotros cuando tienen un problema de escala o precisión. 
        Si están muy lejos de eso, probablemente no somos relevantes aún."

── OBJECIONES DE CONFIANZA ──────────────────────────────────────────────────

"Nunca he oído hablar de ustedes"
VOZ: "Válido — somos [etapa: early-stage / creciendo rápido / 3 años en el mercado].
      Puede que conozcas a [cliente conocido] — nos usan para [X].
      ¿Vale 15 minutos para ver si lo que hacen se traduce a tu situación?"
EMAIL: "Totalmente comprensible — somos más nuevos en [su mundo].
        [Nombre de cliente] y [Nombre de cliente] nos usan para [resultado]. Puedo compartir un breve caso de estudio.
        Si resuena, vale una llamada — si no, dejo de molestarte."

"Necesito investigar más primero"
VOZ: "¿Qué descubriría la investigación que te ayudaría a decidir?
      Porque generalmente puedo responder eso más rápido en una llamada que en una búsqueda en Google."
EMAIL: "Tiene sentido — ¿qué específicamente estás intentando entender?
        Puedo enviarte una respuesta directa a esa pregunta en lugar de un deck genérico de resumen."

"Envíame un caso de estudio primero"
VOZ: "Con gusto — ¿qué haría útil el caso de estudio? Para enviarte el correcto —
      ¿te interesa más [resultado A] o [resultado B]?"
EMAIL: "Enviando ahora — aquí está el más relevante para [su industria/tamaño]:
        [Enlace]. Una cosa que vale la pena notar: [insight específico que aplica a ellos].
        Puedo explicarlo en una llamada una vez que hayas tenido oportunidad de leerlo."

── OBJECIONES DEL GUARDIÁN ──────────────────────────────────────────────────

"¿De qué se trata?"
VOZ: "Estoy contactando sobre [tema específico] para [nombre del tomador de decisiones].
      Está relacionado con [su desencadenante — p.ej. la Serie D que acaban de anunciar].
      ¿Es [nombre] la persona correcta para hablar sobre eso?"
(Nunca digas "llamada de ventas" — di "una pregunta específica sobre [tema]")

"No acepta llamadas en frío"
VOZ: "Entiendo. ¿Hay una mejor manera de captar su atención — 
      email o alguien en su equipo con quien debería hablar primero?"
(El objetivo: conseguir una dirección de email o una presentación cálida, no pasar al guardián a la fuerza)

"Deja un mensaje de voz"
VOZ: Acéptalo con elegancia. Deja un correo de voz conciso de 20 segundos.
No intentes argumentar para pasar.
```

### Pon a prueba tu pitch (modo red team)

```
Actúa como abogado del diablo. Eres un VP escéptico en [EMPRESA] que ha escuchado 100 pitches este año.

Mi pitch: "[pega tu pitch actual o propuesta de valor]"

Genera:
1. Las 5 objeciones más difíciles que plantearía este VP — en sus palabras (no genéricas)
2. Por cada una: cómo suena una respuesta débil (lo que dicen la mayoría de los SDRs)
3. Cómo suena una respuesta sólida

Esto es para entrenamiento — sé brutalmente honesto.
```

### Análisis de patrones de objeciones (desde transcripciones de llamadas)

```
Analiza estas [N] transcripciones de llamadas e identifica patrones de objeciones.

[PEGAR TRANSCRIPCIONES]

Resultado:
1. Las 5 objeciones más comunes (ordenadas por frecuencia)
2. Por cada una: cómo las está manejando el equipo actualmente (calificación promedio A/B/C/D)
3. La objeción en la que el equipo está perdiendo tratos consistentemente
4. Recomendado: script de práctica de objeciones para la próxima sesión de entrenamiento del equipo
5. "Patrón de victoria": ¿qué dicen los reps cuando superan la objeción exitosamente?
```

## Ejemplo

**Usuario:** Acabo de recibir "Ya usamos Salesforce y hace todo lo que necesitamos." Vendo una plataforma de engagement de ventas.

**Resultado:**

**Intención:** Objeción de competidor con una capa de "relevancia" implícita — creen que Salesforce te reemplaza, no te complementa. Esta es una desalineación muy común.

**Respuesta de voz (27 segundos):**
"Salesforce es excelente — me alegra que ya lo estés usando. En realidad nos situamos encima de Salesforce, no al lado. Lo que hacemos es la capa de secuenciación y engagement que Salesforce no tiene de forma nativa — automatizando la cadencia de contacto, rastreando aperturas y respuestas, y enrutando leads calientes de vuelta a Salesforce automáticamente. Curioso — ¿cómo manejan los reps sus secuencias de contacto hoy? ¿Directamente en Salesforce o con otra herramienta?"

**Qué NO decir:**
- "Salesforce en realidad no es tan bueno como la gente cree para el engagement" (defensivo)
- "Oh, ¿pero conoces todas las funciones que tenemos?" (volcado de características)
- "Somos completamente diferentes a Salesforce" (confuso — acaban de decir que Salesforce lo hace todo)

**Versión por email:**
> "Salesforce como columna vertebral del CRM tiene todo el sentido — en realidad vivimos dentro de Salesforce, no al lado.
>
> Lo que añadimos es la capa de engagement y secuenciación que no hace de forma nativa: cadencias automatizadas de múltiples pasos, detección de respuestas y enrutamiento de leads activado por señales de engagement — todo escribiendo de vuelta a Salesforce automáticamente.
>
> La mayoría de los equipos que hablan con nosotros usan Salesforce + Outreach o un proceso manual. Curioso en qué campo estás — ¿vale 15 minutos para mostrarte lo que equipos de tu tamaño hacen con la combinación?"

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
