# Flujo de Trabajo Semanal del Operador de Comercio Electrónico

Un flujo de trabajo semanal repetible para un operador de comercio electrónico potenciado por IA — que cubre el seguimiento de ventas, la optimización de listados, el servicio al cliente, el email marketing, el rendimiento publicitario y la gestión de inventario.

---

## Resumen

**Inversión de tiempo:** ~2-3 horas de sesiones estructuradas de Claude Code por semana (reemplaza 10-12 horas de trabajo manual).

**Lo que cubre este flujo de trabajo:**
- Cada mañana: panel de ventas + triaje de clientes (20 minutos)
- Lunes: planificación semanal + lanzamiento de campaña de email
- Martes-miércoles: trabajo de listados y SEO
- Jueves: rendimiento publicitario y marketing de pago
- Viernes: informe semanal + planificación de inventario

**Requisitos previos:** Como mínimo `/ecommerce-seller`, `/product-listing-optimizer` y `/review-response` instalados.

---

## Diario — Rutina matutina (20 minutos, cada día)

### Revisión del panel de ventas

```
/ecommerce-seller

Revisión diaria — [FECHA]:

Rendimiento de ayer:
- Ingresos: [$X] vs. [$X mismo día la semana pasada] vs. [$X objetivo diario]
- Pedidos: [X] / AOV: [$X]
- Producto principal por unidades: [nombre, X unidades]
- Tasa de abandono del carrito: [X%]

Servicio al cliente:
- Nuevas consultas: [X] — ¿alguna urgente/escalada?
- Solicitudes de devolución: [X]
- Nuevas reseñas: [positivas: X / neutras: X / negativas: X]

Alertas de inventario:
- Cualquier SKU con < 14 días de suministro a la velocidad actual: [lista o ninguno]
- ¿Algún pedido de reabastecimiento que debería haberse realizado y no se ha hecho?

Marketing:
- Gasto publicitario de ayer: [$X] / Ingresos atribuidos: [$X] / ROAS: [X]
- Rendimiento de la campaña de email activa: [tasa de apertura, tasa de clics si se envió]

Marcar: ¿qué requiere atención hoy (clasificado por urgencia)?
```

---

### Triaje del servicio al cliente (15 minutos)

**Respuesta a reseñas:**

```
/review-response

[Pegar cualquier nueva reseña de la noche — con calificación de estrellas y plataforma]

Para reseñas negativas (1-3 estrellas): escribir respuesta profesional que aborde la queja específica.
Para reseñas positivas: agradecer brevemente (opcional, ayuda en Amazon).
Para reseñas neutras con una preocupación enterrada: tratar como negativa.

Menos de 100 palabras por respuesta. Nunca a la defensiva.
```

**Solicitudes de devolución y reembolso:**

```
/returns-handler

Nuevas solicitudes de devolución:
1. [Describir la solicitud — producto, queja, fecha del pedido, valor]
2. [etc.]

Para cada una: ¿dentro de la política? [sí/no] → escribir respuesta apropiada + nota interna.
```

---

## Lunes — Planificación semanal y lanzamiento de email

### 9:00-9:30am — Planificación semanal

```
/ecommerce-seller

Planificación semanal para [RANGO DE FECHAS]:

Rendimiento de la semana pasada:
- Ingresos: [$X] vs. [$X objetivo]
- Mejor rendimiento: [SKU + ingresos]
- Peor rendimiento: [SKU]
- Carga de servicio al cliente: [X tickets, X devoluciones]

Esta semana:
- ¿Hay algún evento de ventas o promoción próxima? [sí/no + detalles]
- ¿Palabras clave estacionales que deberían alcanzar su pico esta semana? [p. ej., "regalos para el Día del Padre"]
- Productos a priorizar para el trabajo de listados esta semana: [lista]
- Anuncios a revisar: [campañas que necesitan actualización creativa o ajuste de puja]

Top 3 prioridades de esta semana: ¿qué moverá más los ingresos?
```

### 9:30-10:30am — Lanzamiento de campaña de email

```
/email-campaign

Email de esta semana:
- Segmento: [nombre del segmento, tamaño — o lista completa]
- Objetivo: [generar ingresos / re-involucrar inactivos / anunciar nuevo producto]
- Oferta: [% de descuento / nueva llegada / pieza de contenido / gancho estacional]
- Día y hora de envío: [recomendación basada en el segmento]

Producir:
- Línea de asunto (variantes A/B)
- Texto de previsualización
- Borrador del email (breve pero completo — hero, cuerpo, CTA)
- Parámetros UTM para el seguimiento

Tras la aprobación, programar en [Klaviyo / Mailchimp / su plataforma].
```

---

## Martes — Optimización de listados

### 9:00-11:00am — Trabajo de listados

**Priorizar por:** tasa de conversión más baja entre sus 20 principales SKUs por ingresos.

**Listado nuevo o con bajo rendimiento:**

```
/product-listing-optimizer

Mercado: [Amazon / Shopify / Etsy]
Producto: [nombre]
Rendimiento actual: [tasa de conversión X%, posición de clasificación para la palabra clave principal]
Cliente objetivo: [quién compra esto]
Características clave: [lista]
Competidores: [nombrar 2-3]

Modo: [Optimización completa / Solo auditoría]

Producir: investigación de palabras clave, título optimizado, viñetas, descripción, briefing de imagen.
```

**Actualización estacional (si aplica):**

```
/product-listing-optimizer

Modo de actualización estacional.

Producto: [nombre]
Temporada/evento: [T4 / Prime Day / Día de la Madre / etc.]
Título + viñetas actuales: [pegar]

Añadir enfoque estacional sin hacer cambios permanentes. Marcar qué ediciones revertir después del evento.
```

**Registre lo que cambió:**
Después de cada actualización del listado, anote: fecha, qué cambió, tasa de conversión actual. Revisar en 14 días.

---

## Miércoles — SEO y revisión de competencia

### 10:00-11:00am — Revisión de competidores y palabras clave

Ejecutar mensualmente, no semanalmente. Pero use los miércoles para cuando llegue el momento:

```
/product-listing-optimizer

Análisis de brecha de competidores para: [categoría de producto]

Mi principal SKU: [nombre]
Competidores: [nombrar 2-3 + sus URLs o ASINs]

Encontrar:
- Palabras clave por las que clasifican los competidores que yo no
- Quejas en las reseñas de competidores que mi producto resuelve
- Brechas visuales en su listado (imágenes que les faltan)

Producir: lista de brechas de palabras clave + ángulos de diferenciación que debería enfatizar en mi próxima actualización de listado.
```

---

## Jueves — Anuncios de pago y rendimiento de marketing

### 10:00-11:00am — Revisión del rendimiento publicitario

```
/paid-ads

Plataforma: [Meta Ads / Google Ads / Amazon PPC]

Rendimiento de los últimos 7 días:
- Gasto total: [$X]
- Ingresos atribuidos: [$X] / ROAS: [X]
- CTR: [X%] / Tasa de conversión: [X%]

Por campaña:
[Listar cada campaña activa: nombre, gasto, ROAS, CTR]

Analizar:
1. ¿Qué campañas están por debajo del ROAS objetivo ($[X] objetivo)?
   → Recomendación: pausar / reducir pujas / nuevo creativo
2. ¿Qué campañas están por encima del objetivo?
   → Recomendación: escalar el gasto
3. ¿Algún conjunto de anuncios con CTR > 2% pero conversión < 1%?
   → Probablemente un problema de la página de destino, no del anuncio
4. ¿Alguna audiencia que esté saturando? (CTR cayendo semana tras semana)
   → Momento para nuevo creativo o expansión de audiencia

Producir: cambios específicos a realizar hoy + briefing creativo para cualquier anuncio que necesite actualización.
```

### 11:00-11:30am — Producción de creativos (si es necesario)

```
/paid-ads

Escribir texto publicitario para: [nombre de la campaña y objetivo]
Producto: [nombre y características clave]
Audiencia objetivo: [datos demográficos + intereses + puntos de dolor]
Oferta: [si la hay — descuento, paquete, umbral de envío gratuito]
Formato: [imagen única / carrusel / guión de vídeo]

Escribir: variantes de titular (5), variantes de texto principal (3), opciones de CTA, y un briefing para el equipo creativo/diseñador.
```

---

## Viernes — Informe semanal y planificación de inventario

### 2:00-3:00pm — Planificación de inventario y reabastecimiento

```
/ecommerce-seller

Planificación de inventario para la semana que termina el [FECHA]:

Inventario actual por SKU:
[Pegar su CSV de inventario o los principales SKUs con: unidades disponibles, velocidad de ventas diaria de los últimos 14 días]

Tiempos de entrega:
- Proveedor A: [X días]
- Proveedor B: [X días]

Reglas de reabastecimiento:
- Punto de reabastecimiento: [X días de suministro restantes]
- Cantidad mínima de pedido: [X unidades por SKU]

Producir:
1. Lista de riesgo de agotamiento: SKUs que alcanzan el punto de reabastecimiento en < 14 días
2. Artículos con exceso de inventario: > 90 días de suministro — recomendar descuento, paquete o pausar el gasto publicitario
3. Recomendación de reabastecimiento: qué SKUs pedir ahora, cantidad y fecha de llegada esperada
4. Instrucciones al proveedor: dar formato a las solicitudes de reabastecimiento para cada proveedor
```

### 3:00-4:00pm — Informe de rendimiento semanal

```
/ecommerce-seller

Informe semanal para la semana que termina el [FECHA]:

Ingresos: [$X] vs. [$X semana anterior] vs. [$X objetivo]
Pedidos: [X] / AOV: [$X]
Unidades vendidas: [X]
Tasa de devolución esta semana: [X%]

Marketing:
- Email: enviado a [X] suscriptores, tasa de apertura [X%], tasa de clics [X%], ingresos $[X]
- Anuncios de pago: gasto $[X], ROAS [X], ingresos $[X]
- Orgánico: [cualquier actualización de SEO/listados realizada esta semana]

Servicio al cliente:
- Tickets: [X] / Tiempo de respuesta promedio: [X horas]
- Devoluciones: [X] / Valor total de reembolsos: [$X]
- Nuevas reseñas negativas: [X] / Todas respondidas: [sí/no]

Producto principal: [SKU, unidades, ingresos]
Peor producto: [SKU, unidades — marcar si está por debajo de lo esperado]

Listados actualizados esta semana: [lista]
Pruebas A/B en curso: [lista con estado actual]

Prioridades para la próxima semana: [top 3 basadas en los datos de esta semana]

Formato: resumen ejecutivo de 3 puntos + detalle completo para los registros.
```

---

## Ritmo mensual

### Primera semana del mes — Informe completo

```
/ecommerce-seller

Informe mensual de [MES]:

Ingresos: [$X] vs. [$X objetivo] vs. [$X mismo mes del año pasado]
Pedidos: [X] / AOV: [$X] / Unidades totales: [X]
Tasa de devolución: [X%] — tendencia vs. los últimos 3 meses: [subiendo/estable/bajando]

Top 5 SKUs por ingresos: [lista]
Bottom 5 SKUs por margen (si se conoce): [lista]

Programa de email:
- Total de envíos: [X]
- Tasa de apertura promedio: [X%] / tasa de clics: [X%]
- Ingresos atribuidos: [$X]

Anuncios de pago:
- Gasto total: [$X] / Ingresos atribuidos: [$X] / ROAS combinado: [X]

Listados e inventario:
- Agotamientos: [X incidentes, X días sin stock]
- Amortizaciones por exceso de inventario: [$X si las hay]

Servicio al cliente:
- Total de tickets: [X] / Tasa de devolución: [X%] / CSAT si se rastrea: [X]

¿Qué funcionó este mes?
¿Qué no funcionó?
¿Qué cambiar para el próximo mes?
```

### Planificación estacional (90-60 días antes de los principales eventos)

```
@ecommerce-specialist

Preparar nuestro plan de [TEMPORADA / EVENTO].

Productos a destacar: [lista con niveles de inventario]
Probables movimientos de la competencia: [lo que sabe o espera]
Presupuesto: [$X para anuncios + promoción por email]
Fecha del evento: [fecha]
Fecha de hoy: [fecha]

Producir:
- Lista de verificación de 90/60/30 días
- Estrategia de precios y descuentos
- Plan de actualización de listados (qué SKUs necesitan actualización estacional)
- Calendario de email: [N emails, temas, fechas de envío]
- Asignación del presupuesto publicitario
- Reabastecimiento de inventario: cantidades a pedir y fecha límite de pedido según el tiempo de entrega
```

---

## Cuando las cosas van mal

### "El ROAS bajó un 30% esta semana"

```
/paid-ads

Diagnóstico de ROAS:
Plataforma: [especificar]
ROAS actual: [X] — promedio del mes pasado: [X]

Verificar:
1. ¿Aumentó el CPM (costo por 1000 impresiones)? → Saturación de audiencia o presión competitiva
2. ¿Cayó el CTR? → Fatiga creativa
3. ¿Cayó la tasa de conversión con CTR estable? → Problema de página de destino o listado
4. ¿Cayó el AOV? → Producto incorrecto siendo promocionado u oferta menos atractiva

Identificar la métrica que cambió primero. Ahí está el problema.
Diagnóstico recomendado: cambiar una variable a la vez.
```

### "Tengo una reseña negativa que se está volviendo viral"

```
/review-response

Situación de reseña escalada:
Plataforma: [Amazon / Google / Trustpilot / redes sociales]
Texto de la reseña: [pegar]
Calificación de estrellas: [1]
Participación: [X likes/compartidos — está ganando tracción]
Detalles del pedido: [lo que sabemos sobre este cliente y pedido]
¿Es la queja factualmente precisa? [sí / parcial / no]

Escribir:
1. Respuesta pública (menos de 100 palabras — tranquila, factual, enfocada en la solución)
2. Mensaje de contacto privado al reseñador
3. Nota interna: ¿qué problema sistémico expone esta reseña, si es que hay alguno?
```

### "Un producto clave está agotado y estoy perdiendo posicionamiento"

```
/ecommerce-seller

Plan de recuperación por agotamiento para: [nombre del producto]

Estado actual: 0 unidades / reabastecimiento estimado: [fecha]
Posicionamiento actual para la palabra clave principal: [posición — era [X] antes del agotamiento]
Impacto de ingresos diario: [$X por día]
Opciones de proveedor:
- Opción A: [tiempo de entrega, costo]
- Opción B (acelerado): [tiempo de entrega, costo mayor]

Recomendar:
1. Si acelerar o no (ROI del costo de aceleración vs. valor de recuperación del posicionamiento)
2. Cómo minimizar el daño al posicionamiento mientras está agotado (reducir el gasto publicitario, marcar como "temporalmente no disponible" vs. dejar activo)
3. Estrategia de relanzamiento una vez reabastecido (campaña de solicitud de reseñas, programa de aumento de anuncios)
```

---

## Referencias clave

| Métrica | Objetivo | Investigar si... |
|---|---|---|
| Tasa de conversión del producto | > 3% (Shopify) / > 15% (Amazon) | < 1,5% / < 8% |
| Tasa de devolución | < 10% | > 20% |
| Tasa de respuesta a reseñas negativas | 100% | Alguna sin respuesta |
| ROAS de email | > 10x | < 5x |
| ROAS de anuncios de pago | > 3x | < 2x |
| Tasa de agotamiento | < 2% de los SKUs | > 5% |
| Tiempo de respuesta al cliente | < 4 horas | > 24 horas |
| Cadencia de actualización de listados | Mensual para los 20 principales SKUs | Trimestral o menos |

---
