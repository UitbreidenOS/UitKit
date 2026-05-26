# Optimizador de Precios

## Cuándo activar
- Estás considerando aumentar precios y quieres un marco estructurado en lugar de adivinar
- No has revisado precios en 18+ meses y la inflación sola ha erosionado tus precios reales
- Estás lanzando un nuevo producto o servicio y necesitas un precio defendible en lugar de "lo que se siente bien"
- Tus servicios tienen precios diferentes para diferentes clientes sin una lógica clara — sospechas que estás subvalorando a tus mejores clientes
- Un competidor aumentó o bajó sus precios y necesitas decidir cómo responder

## Cuándo NO usar
- Estás en un mercado de commodities donde el precio lo establece el mercado, no tú — la dinámica de carrera hacia el fondo anula la estrategia de precios
- Tienes un CFO o analista de precios que ya ejecuta revisiones de precios estructuradas
- Estás pre-product-market-fit — primero llega a PMF, luego optimiza precios

## Instrucciones

### Paso 1: Establece tu contexto de precios

Di:

"Dirijo un [tipo de negocio] que vende [producto/servicio]. Mi precio actual es [lista cada tier o producto con su precio]. Mi LTV promedio de cliente es [$X]. Mi margen bruto es [Y%]. Mi cliente típico es [persona]. Mis principales competidores tienen precios en [lista — nombre y punto de precio aproximado]. He cambiado precios [Z] veces en los últimos 2 años."

### Paso 2: Auditoría de precios

Pídele a Claude que audite tu estructura de precios actual.

Di:

"Audita mi estructura de precios actual. Señala: (1) cualquier tier que esté valorado demasiado cerca de otro tier (baja diferenciación), (2) cualquier tier que esté valorado demasiado lejos de otro tier (brecha en la escalera de valor), (3) cualquier tier que esté subvaluado en el mercado según el precio de competencia que proporcioné, (4) cualquier tier donde el precio es redondo (a menudo una señal de que fue establecido por adivinanza, no por análisis), (5) cualquier servicio o producto que no se adapte limpiamente a la escalera de precios."

Lee la auditoría cuidadosamente. Claude a veces señalará un "número redondo" como un problema cuando el número redondo es la decisión correcta — los números redondos reducen la fricción de decisión en los tiers inferiores. Usa la auditoría como punto de partida.

### Paso 3: Marco de decisión de aumento de precio

Cuando consideres un aumento de precio:

Di:

"Estoy considerando aumentar precios en [tier/producto] de [$X] a [$Y] — un aumento de [Z%]. Mis clientes actuales en este tier son [N]. El último aumento fue [fecha]. Construye el caso a favor y en contra: (1) cuál es el abandono esperado de clientes existentes, (2) cuál es el impacto en la demanda de nuevos clientes, (3) cuál es el impacto en el posicionamiento de marca, (4) cuál es el costo operativo de manejar dos tiers de precio durante la transición, (5) cuál es el riesgo de tiempo (cualquier evento en los próximos 6 meses que haría que el aumento se vea mal)?"

Obtendrás una evaluación estructurada de pros/contras. El resultado es una herramienta de apoyo a la decisión, no la decisión en sí.

### Paso 4: Reestructuración de tiers

Si tu auditoría de precios reveló la necesidad de reestructurar tiers:

Di:

"Propón 3 estructuras de precios alternativas para mi negocio: (1) una escalera de valor de 3 tiers, (2) una estructura por asiento o por unidad si es aplicable, (3) una estructura basada en resultados o híbrida. Para cada una, muestra: precios por tier, el diferencial de valor entre tiers, el cliente objetivo para cada tier, el plan de migración para clientes existentes, el impacto de ingresos proyectado en el año 1."

Examina las tres. A menudo la respuesta "obvia" (más tiers) es incorrecta, y la respuesta correcta es menos tiers, más diferenciados.

### Paso 5: Plan de migración de cliente existente

Cuando aumentes precios para clientes existentes:

Di:

"Estoy aumentando precios en [tier] de [$X] a [$Y] efectivo [fecha]. Tengo [N] clientes existentes en este tier con antigüedad promedio de [Z] meses. Redacta: (1) el correo de anuncio — claro, respetuoso, liderando con el motivo y valor en lugar del precio, (2) una oferta de bloqueo de precio para clientes de largo plazo que bloqueen a 12 meses a la tasa actual, (3) la plantilla de respuesta para clientes que se resisten, (4) la plantilla de respuesta para clientes que eligen cancelar."

El impacto de retención de cómo manejes el aumento de precio a menudo importa más que el aumento de precio en sí. Un correo torpe crea abandono evitable.

### Paso 6: Prueba A/B de precio

Si el volumen de tu negocio lo apoya:

Di:

"Diseña una prueba de precio para mi [producto/servicio]. Precio actual [$X]. Variantes de prueba: [$Y] y [$Z]. Mi volumen mensual de tráfico/leads es [N]. Diseño: (1) la estructura de la prueba (qué clientes ven qué precio), (2) el tamaño de muestra necesario para significancia estadística, (3) los criterios de decisión (tasa de conversión, ingresos totales, implicaciones de LTV), (4) la duración de la prueba, (5) el plan de retroceso si la prueba revela una caída inesperada."

La mayoría de pequeños negocios no tienen el volumen para pruebas A/B de precio limpias. El análisis estructurado te dice si lo haces.

### Paso 7: Respuesta del competidor

Cuando un competidor cambia su precio:

Di:

"El competidor [nombre] acaba de cambiar su precio de [$X] a [$Y]. Mi precio actual es [$Z]. Su posicionamiento es [premium / mercado medio / descuento]. Mi posicionamiento es [igual / diferente]. Analiza: (1) la intención estratégica probable de su movimiento, (2) el impacto en mi tubería si no respondo, (3) tres opciones de respuesta (igualar, mantener y diferenciar, aumentar para ampliar la brecha), (4) la respuesta recomendada con justificación."

No iguales automáticamente los movimientos de competidores. El análisis estructurado a menudo revela que mantener es la decisión correcta.

## Ejemplo

Diriges un pequeño SaaS B2B para equipos de ventas a $99/mes para el tier Pro. Tienes 340 clientes Pro — $34K MRR en este tier. No has aumentado precios en 28 meses. La inflación sola ha reducido tu precio real en aproximadamente 12% en este período.

Configuras la auditoría de precios. Claude señala:
- El tier Pro ($99) está demasiado cerca del tier Team ($149) — solo un diferencial de 51% para una brecha de capacidad significativa
- El tier Pro está muy por debajo del mercado — las ofertas de competidores de rango medio van de $129 a $199
- Tu tier Empresarial ($499) tiene una brecha demasiado amplia desde Team ($149)

Decides aumentar Pro de $99 a $129 — un aumento de 30%, pero aún por debajo del mercado.

Ejecutas el flujo de trabajo del plan de migración. Claude redacta:

**Correo de anuncio (340 clientes):**
> Hace dos años, cuando lanzamos el tier Pro a $99, nuestro producto tenía [lista 3 características específicas al lanzamiento]. Hoy, el mismo tier incluye [lista 6 características agregadas desde]. A partir del [fecha 60 días], el tier Pro será $129. Si deseas bloquear la tasa actual de $99 durante los próximos 12 meses cambiando a facturación anual, puedes hacerlo aquí: [enlace]. Este es el primer cambio de precio que hemos hecho en Pro. Esperamos que sea el último durante al menos 24 meses.

**Oferta de bloqueo:** Facturación anual a $99/mes equivalente, bloqueada hasta [fecha 12 meses].

**Respuesta a la resistencia:** Reconoce inquietudes, referencias la oferta de bloqueo, no intenta vender más.

**Respuesta de cancelación:** Reconoce, ofrece un período de gracia de 30 días, pide retroalimentación.

Envías. Durante los próximos 30 días:
- 110 de 340 clientes (32%) aceptan la oferta de bloqueo anual — bloqueados a $99 durante 12 meses
- 12 clientes (3,5%) cancelan — dentro del rango de abandono esperado del modelo
- 218 clientes permanecen mensuales al nuevo precio de $129

Impacto MRR neto: $34K → $40,2K después de que se completa la migración. Eso es $74K de ingresos incremental anualizados. Los 12 clientes cancelados representan $14K en ARR perdido, que habrías perdido de todos modos con el tiempo.

Programas un recordatorio de calendario de 24 meses para revisar los precios de Pro. El mismo flujo de trabajo maneja el siguiente ajuste.
