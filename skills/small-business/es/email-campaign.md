---
name: email-campaign
description: "Marketing de correo electrónico para pequeños negocios: estructura de campaña, líneas de asunto, variantes de copia por segmento, configuración de prueba A/B, secuencias de reenganche y análisis de rendimiento"
---

# Email Campaign

## When to activate
- Planificar una campaña promocional y necesitas llegar a diferentes segmentos de clientes con diferentes mensajes
- Tus tasas de apertura de correo electrónico están por debajo del 20% y quieres entender por qué y reparar
- Tienes una lista de suscriptores inactivos y necesitas una secuencia de reenganche antes de tu próxima campaña
- Quieres configurar una prueba A/B pero no estás seguro de qué probar o cómo leer los resultados

## When NOT to use
- Configuración de plataforma de correo electrónico, configuración de automatización o diseño de plantilla — usa tu documentación de ESP (Klaviyo, Mailchimp, ActiveCampaign) para eso
- Estrategia de crecimiento de lista — esta habilidad maneja qué enviar, no cómo crecer la lista
- Correos electrónicos transaccionales (confirmaciones de pedido, restablecimientos de contraseña) — estos tienen diferentes requisitos de cumplimiento y pertenecen al generador de flujo de tu plataforma

## Instructions

### Campaign planning

Antes de escribir una sola palabra, define la estructura de la campaña. Cuéntale a Claude:
- La oferta o noticia que quieres comunicar (sé específico — « 20% de descuento en todos los zapatos este fin de semana » es utilizable; « tenemos una venta » no)
- Los segmentos de tu lista (nuevos suscriptores, compradores recientes, clientes dormidos, VIP, etc.)
- El objetivo de la campaña — un objetivo, no tres (impulsar compras, reservar citas, obtener RSVP, anunciar noticias)
- Tu cronograma (fecha de lanzamiento, fecha de finalización si es una venta)
- Cuántos correos electrónicos estás dispuesto a enviar para esta campaña (la mayoría de campañas de pequeños negocios son 2-3 correos)

Claude construye el mapa de campaña: qué correos van a qué segmentos, cuál es el trabajo de cada correo, horarios de envío sugeridos según tipo de audiencia, y la lógica de secuencia (p. ej., « el correo 2 va solo a abrientes del correo 1, o a todos? »).

---

### Subject lines

Las líneas de asunto determinan la tasa de apertura más que cualquier otro factor. Cuéntale a Claude:
- El contenido del correo electrónico
- El segmento de audiencia
- El objetivo de la campaña
- Tu tono de marca (juguetón, directo, cálido, profesional)

Claude genera 8 opciones de línea de asunto en cuatro estilos:
- 2 directos: declaración simple de la oferta o noticia
- 2 impulsados por curiosidad: abra un bucle que cierre el correo
- 2 basados en urgencia: plazo o encuadre de escasez (usa estos solo si la urgencia es real)
- 2 enfocados en beneficios: lidera con lo que el lector gana

Claude marca cuáles dos probar A/B. Usualmente la opción directa más simple versus la opción de curiosidad o beneficio más fuerte. No pruebes dos estilos similares — prueba enfoques genuinamente diferentes para aprender algo útil.

Puntos de referencia: las tasas de apertura por encima del 20% son saludables para la mayoría de pequeños negocios. Por encima del 28% es fuerte. Por debajo del 15% significa que tus líneas de asunto o reputación del remitente necesita trabajo. Si tu lista no se ha limpiado en más de 12 meses, las bajas tasas de apertura pueden ser un problema de entregabilidad, no un problema de copia.

---

### Email copy

Un correo, un trabajo. Cuéntale a Claude:
- La línea de asunto que elegiste
- El segmento de audiencia y qué saben de ti
- La oferta o mensaje
- El único llamado a la acción (un link o botón, no tres)

Claude escribe tres secciones:

**Gancho** — las primeras 1-2 oraciones del cuerpo del correo. Esto es lo que aparece en el panel de vista previa junto a la línea de asunto. Tiene que ganar el clic. Claude lo escribe para continuar el impulso de la línea de asunto, no repetirlo.

**Cuerpo** — 3-4 párrafos cortos. La mayoría de los correos de pequeños negocios se leen en menos de 30 segundos. Claude escribe para escaneadores: párrafos cortos, lenguaje concreto, sin relleno.

**CTA** — una acción clara con texto de botón o link específico. « Compra la venta » es mejor que « Haz clic aquí. » « Reserva tu llamada gratuita » es mejor que « Aprende más. »

Variantes de segmento: los clientes leales obtienen encuadre de apreciación (« Estás con nosotros desde el principio, así que obtienes acceso anticipado... »). Los nuevos suscriptores obtienen encuadre de beneficio (« Aquí está lo que prometimos cuando te suscribiste... »). Los clientes dormidos obtienen encuadre honesto de reenganche (« Ha pasado un tiempo. Aquí está lo que cambió. »).

---

### A/B test setup

Cuéntale a Claude qué quieres probar. Una variable por prueba — probar línea de asunto versus CTA en la misma prueba no te dice nada.

Cosas buenas para probar en listas de correo de pequeños negocios:
- Línea de asunto (más impactante, afecta la tasa de apertura)
- Texto CTA (afecta la tasa de clic)
- Longitud de correo — corto (150 palabras) versus medio (350 palabras)
- Hora de envío — martes mañana versus jueves tarde

Claude escribe ambas variantes y te dice: cuál es la diferencia entre ellas, qué métrica observar, qué tamaño de muestra necesitas para ver un resultado significativo, y cuánto tiempo ejecutar la prueba antes de leerla.

Después de la prueba: pega tus resultados (tasa de apertura de Variante A X%, tasa de apertura de Variante B Y%, tamaño de envío Z). Claude te dice qué significan los resultados, si la diferencia es significativa o ruido, y qué hacer a continuación.

---

### Re-engagement sequences

Para suscriptores que no han abierto en 90 o más días.

Cuéntale a Claude: el tamaño de tu lista, cuántos están inactivos (90+ días sin abrir), qué les enviaste por última vez, y qué ofrece tu negocio ahora que vale la pena reconectar.

Claude escribe una secuencia de 3 correos:

**Correo 1 — « ¿Sigues ahí? »** Reconoce el silencio, ofrece algo genuinamente útil (un recurso gratuito, acceso anticipado, una actualización relevante). Sin culpa, sin manipulación.

**Correo 2 — Recordatorio de valor.** Por qué se suscribieron y por qué aún vale la pena estar en tu lista. Un punto de prueba concreto: un resultado de cliente reciente, un contenido popular, un producto que podrían haber perdido.

**Correo 3 — Oferta final de cancelación de suscripción.** Encuadre honesto: « Si esto ya no es relevante, sin problemas — cancela la suscripción a continuación. Si deseas quedarte, no necesitas hacer nada. » Este es el paso de puesta de sol.

Después de la secuencia: cuéntale a Claude cuántos se reengancharon (abrieron o hicieron clic en cualquiera de los 3 correos). Claude redacta el mensaje final para todos los que no — una confirmación de cancelación de suscripción limpia. Eliminar suscriptores inactivos mejora la entregabilidad para todos los demás.

---

### Performance analysis

Después de una campaña, pega tus estadísticas: tamaño de envío, tasa de apertura, tasa de clic, tasa de cancelación de suscripción, ingresos generados (si es rastreable). Cuéntale a Claude qué esperabas.

Claude te dice:
- Si cada métrica está por encima o por debajo de la línea de base para tu industria y tamaño de lista
- Qué significa el patrón (apertura alta, clic bajo = línea de asunto funcionando pero correo no entregando; apertura baja, clic alto entre abrientes = problema de línea de asunto, no problema de copia)
- Una cosa específica a cambiar en tu próxima campaña basada en los datos

---

### Prompt template — campaign

```
Por favor, planifica una campaña de [X] correos.

Oferta: [oferta específica, con fechas si aplica]
Objetivo: [un objetivo]
Segmentos:
- [Segmento 1]: [tamaño, relación con tu negocio]
- [Segmento 2]: [tamaño]

Cronograma: [fecha de lanzamiento] a [fecha de finalización]
Tono de marca: [juguetón/directo/cálido/profesional]

Por favor, dame:
1. Mapa de campaña (qué correo va a qué segmento, en qué orden)
2. 8 opciones de línea de asunto para el primer correo (2 directas, 2 curiosidad, 2 urgencia, 2 beneficio)
3. Marca cuál 2 probar A/B
4. Borrador del primer correo para [segmento principal]
```

## Example

Una boutique para mujeres ejecuta una venta de verano de 3 días. La propietaria le dice a Claude la oferta (25% de descuento en todos los vestidos de verano), la lista (2.400 total: 800 comprados en los últimos 60 días, 1.100 comprados 61-180 días, 500 inactivos 180+ días) y el objetivo (impulsar compras antes del fin de venta del domingo).

Claude construye:

Mapa de campaña: Correo 1 (jueves, lista completa) — anuncio de venta, todos los segmentos. Correo 2 (viernes, abrientes del correo 1 solo) — destacados de más vendidos con prueba social. Correo 3 (domingo por la mañana, no compradores que abrieron cualquier correo) — última oportunidad, urgencia de final del día.

Líneas de asunto para Correo 1 (directo): « 25% de descuento en vestidos de verano — este fin de semana solamente. » (Curiosidad): « Tu guardarropa se está perdiendo algo. » (Urgencia): « 3 días. 25% de descuento. Sin código necesario. » (Beneficio): « El vestido en el que has estado mirando acaba de hacerse más barato. »

Recomendación de prueba A/B: « 25% de descuento en vestidos de verano — este fin de semana solamente » versus « El vestido en el que has estado mirando acaba de hacerse más barato » — encuadre directo versus encuadre de beneficio.

Resultados después de ejecutar la campaña: tasa de apertura del 31% en Correo 1, tasa de clic del 8,2%, $4.100 en ingresos rastreados a la campaña. Las campañas anteriores promediaron 19% de apertura y 4,1% de clic. Análisis de Claude: la línea de asunto con encuadre de beneficio superó la versión directa por 4 puntos porcentuales en la tasa de apertura — usa encuadre de beneficio como predeterminado para campañas promocionales en adelante.

---
