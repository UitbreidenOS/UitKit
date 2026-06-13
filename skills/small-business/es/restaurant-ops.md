---
name: restaurant-ops
description: "Operaciones de restaurante: copia de menú, análisis de costos de alimentos, pronóstico de inventario, respuestas a críticas, especialidades de temporada, puestos de contratación y documentación de capacitación"
---

# Restaurant Operations

## When to activate
- Escribir o reescribir descripciones de menú, nombrar una nueva especialidad o lanzar un menú estacional
- Tu porcentaje de costo de alimentos es mayor de lo esperado y necesitas encontrar dónde fuga la ganancia
- Tienes un montón de críticas de Google o Yelp para responder y quieres que cada respuesta sea personal
- Contratar para una temporada ocupada y necesitas descripciones de puestos y un documento de capacitación

## When NOT to use
- Contabilidad completa o nómina — usa tu contador y procesador de nómina para eso
- Documentación de cumplimiento de código de salud — consulta directamente con tu autoridad sanitaria local
- Negociaciones de arrendamiento o revisión de contratos de proveedores — usa un abogado

## Instructions

### Menu engineering

Cuéntale a Claude: el nombre del plato, los ingredientes principales, el método de cocina, el punto de precio y el ambiente del restaurante — elegante, casual, rápido-casual, comedor de barrio o similar.

Claude escribe descripciones que venden. Específicas, sensoriales y precisas — no copia genérica que podría aplicarse a cualquier restaurante. « Pasta hecha en casa » se convierte en « rigatoni enrollado a mano terminado en mantequilla de chile calabresa de 30 minutos. » La descripción justifica el precio.

Para una reescritura completa del menú, pega tu texto de menú actual. Cuéntale a Claude la voz que quieres: cálida y accesible, sofisticada y minimalista, familias, o un restaurante de referencia que admires. Claude reescribe el menú completo en esa voz mientras mantiene cada descripción precisa del plato real.

Para especialidades de temporada: cuéntale a Claude el ingrediente héroe, la temporada y el punto de precio de tu menú. Claude nombra el plato, escribe la descripción y sugiere un punto de precio que se ajuste a tu arquitectura de menú existente.

---

### Food cost analysis

Para cada plato, dale a Claude tres números: el precio del menú, el costo de cada ingrediente en una porción (sé específico — incluye aceite, adornos, salsa y cualquier proteína exactamente), y cualquier costo variable por plato (contenedor de comida para llevar, servilletas si es relevante).

Claude calcula el porcentaje del costo de alimentos: costo dividido por precio del menú. Rango objetivo para la mayoría de categorías:
- Proteínas (carne, pescado): 28-35%
- Pasta, platos de granos: 18-25%
- Postres: 20-28%
- Bebidas (sin alcohol): 15-22%
- Cócteles: 18-24%

Claude marca cualquier plato por encima de tu umbral y sugiere tres opciones: aumentar el precio, reducir ligeramente la porción, reemplazar un ingrediente o eliminar el plato. Claude no sugiere los tres simultáneamente — clasifica qué enfoque se ajusta mejor al plato basado en su papel en el menú.

Para revisión de compras semanal: pega tus facturas de proveedores de las últimas dos semanas. Claude identifica qué costos de ingredientes han aumentado y qué platos están ahora por encima del umbral como resultado.

---

### Inventory forecasting

Cuéntale a Claude:
- Cubre servidas por día durante las últimas 4 semanas (o totales semanales)
- Qué platos se vendieron y en qué volumen (tu POS puede exportar esto)
- Reservaciones próximas o eventos esta semana
- Vacaciones o eventos locales que típicamente afecten tu volumen

Claude estima cuánto de cada ingrediente clave ordenar para la semana. Las estimaciones se basan en tu uso real por cubierta, no en puntos de referencia genéricos. También marca artículos que históricamente has sobre-ordenado (común con productos y pescado fresco) y sugiere ordenar un poco menos para reducir el desperdicio.

Para preparación de eventos: cuéntale a Claude el tipo de evento, cobertas esperadas y tu menú planeado. Claude produce una lista de recolección de ingredientes con cantidades.

---

### Review responses

Pega tus críticas — positivas y negativas juntas. Cuéntale a Claude el nombre de tu restaurante y tu voz general (cálida y personal, profesional, relajada y casual).

Para cada crítica, Claude redacta una respuesta. Las críticas negativas obtienen: reconocimiento del problema específico, sin deflexión o excusa, y una resolución concreta (« por favor, ponte en contacto directo — queremos arreglar esto »). El tono se mantiene calmado y profesional incluso para críticas injustas o hostiles.

Las críticas positivas obtienen respuestas cálidas y específicas. Claude lee lo que el crítico elogió y lo refleja — no un « ¡Gracias por visitarnos! » genérico copiado nueve veces. Cada respuesta hace referencia a algo específico de esa crítica.

Tú editas y personalizas antes de publicar. Claude maneja el primer borrador; tú añades el toque humano.

---

### Hiring posts

Cuéntale a Claude: el puesto, las principales responsabilidades diarias, qué hace de tu restaurante un buen lugar para trabajar (cultura, horario, dinámica del equipo, beneficios) y el rango salarial.

Claude escribe un anuncio de puesto que describe el trabajo real claramente y honestamente. No utiliza frases huecas como « apasionado por la hospitalidad » o « jugador de equipo » sin sustancia. Les dice a los candidatos exactamente qué se parecen sus días y por qué alguien bueno querría trabajar allí.

---

### Training documentation

Cuéntale a Claude: el puesto que estás capacitando (cocinero de línea, mesero, anfitrión, barista), la habilidad o proceso específico a documentar y cualquier estándar de la casa o preferencia.

Claude produce un documento de capacitación claro paso a paso escrito para alguien nuevo en tu operación — no genérico, sino específico para lo que le dices. Útil para incorporación y para estandarizar la ejecución en tu equipo.

---

### Prompt template — food cost

```
Por favor, analiza el costo de alimentos para mis platos.

Tipo de restaurante: [casual/elegante/rápido-casual]
Objetivo de costo de alimentos: [X]%

Plato 1: [nombre]
- Precio del menú: $[X]
- Costo de ingredientes por plato: $[Y] (desglose: proteína $X, vegetal $X, salsa $X, almidón $X, adorno $X)
- Cubiertas mensuales vendidas: [número]

Plato 2: [nombre]
- Precio del menú: $[X]
- Costo de ingredientes por plato: $[Y]

Para cada plato por encima de mi objetivo: sugiere el mejor único ajuste (precio, porción, reemplazo o eliminación).
```

## Example

Pegas 12 críticas de Google: 9 positivas y 3 negativas. Le dices a Claude que tu restaurante es un lugar italiano casual con una voz cálida de barrio.

Claude produce 12 borradores de respuesta.

Las 3 negativas obtienen cada una una respuesta específica y directa:
- Una queja sobre una espera de 40 minutos el sábado: « Los sábados por la noche han estado tomando más de lo que nos gustaría — lamentamos el tuyo. Hemos añadido una notificación por texto cuando tu mesa está lista. Si vuelves, pide a [nombre del gerente] y nos ocupamos de ti. »
- Una queja sobre un plato de pasta fría: « Eso no debería haber salido de la cocina de esa manera. Por favor, envíanos un correo directamente — nos gustaría enviarte correctamente. »
- Una queja sobre el ruido: « Sabemos que los viernes por la noche se ponen ruidosos — es la energía, pero te escuchamos. Hemos añadido paneles de sonido en la pared este esta mes y estamos curiosos si notas una diferencia. »

Las 9 positivas obtienen cada una una respuesta diferente, cada una reflejando algo específico que el crítico mencionó — el tiramisú, un mesero en particular, una cena de cumpleaños. Ninguna repite la misma línea de apertura.

---
