---
name: real-estate-listing
description: "Kit de herramientas de agente de bienes raíces: descripciones de listados MLS, resúmenes de CMA, correos de seguimiento post-mostrador, secuencias de nutrición del comprador y posts de redes sociales — todos conformes con la Ley de Vivienda Justa"
---

# Real Estate Listing

## When to activate
- Una nueva propiedad llega al mercado y necesitas copias MLS más materiales de marketing
- Estás presentando una CMA a un vendedor y necesitas una narración escrita limpia para acompañar los números
- Ocurrió una muestra y necesitas un correo de seguimiento personalizado redactado rápidamente
- Un prospecto se ha callado y necesitas un mensaje de reenganche que no se sienta insistente

## When NOT to use
- Redacción de documentos contractuales o legales — usa tus formularios aprobados por el corredor y un abogado de bienes raíces
- Puntuación de prospectos automatizada o flujo de trabajo de CRM — usa las herramientas integradas de tu CRM
- Valoraciones de propiedades que representarás como tasaciones formales — solo tasadores con licencia pueden producirlas

## Instructions

### MLS listing descriptions

Dale a Claude:
- Dirección y datos básicos: dormitorios, baños, pies cuadrados, tamaño del lote, año construido, garaje
- Top 5 características para destacar (sé específico — « pisos de madera dura originales refinados en 2023 » vence « pisos agradables »)
- Contexto del barrio: qué hace que la ubicación sea valiosa sin hacer referencia a escuelas, datos demográficos o proximidad a instituciones religiosas
- Tu precio y perfil de comprador objetivo (describe en términos de estilo de vida o etapa de vida, no por características de clase protegida)
- Límite de caracteres para tu sistema MLS, si aplica

Claude escribe dos versiones: una descripción MLS limitada por caracteres (típicamente 250-500 caracteres o 150-250 palabras según tu MLS) y copia de marketing expandida para tu sitio web, correo electrónico y redes sociales.

Cumplimiento de Vivienda Justa: Claude no incluirá lenguaje que implique preferencia por o en contra de compradores o inquilinos basado en raza, color, origen nacional, religión, sexo, estado familiar o discapacidad. Esto incluye lenguaje indirecto — mencionar proximidad a instituciones religiosas específicas, describir datos demográficos del barrio, o usar nombres de escuelas de formas que señalen el perfil del comprador. Claude reemplazará cualquier lenguaje de ese tipo con alternativas conformes. Siempre eres responsable de la revisión final antes de publicar.

---

### CMA narrative

Pega tus datos de ventas comparables: para cada comp, incluye dirección (o anonimizada como « Comp 1 »), pies cuadrados, precio de venta, días en el mercado, precio de lista y fecha de venta.

Cuéntale a Claude:
- Los hechos clave de la propiedad del sujeto
- Cualquier ajuste que hayas hecho (condición, actualizaciones, premio de lote, etc.)
- Tu rango de precio de lista recomendado

Claude escribe una narración de CMA de 3 párrafos lista para presentar a un vendedor:
- Párrafo 1: Qué está sucediendo en el mercado ahora (tasa de absorción, tendencia de precios)
- Párrafo 2: Qué nos dicen las ventas comparables, con tu justificación de ajuste
- Párrafo 3: Tu rango de precio recomendado y el razonamiento

La narración es profesional y clara — diseñada para ser leída en voz alta o dejada con el vendedor como un documento para llevar.

---

### Showing follow-ups

Después de una muestra, cuéntale a Claude:
- Perfil de comprador: comprador por primera vez, comprador en ascenso, inversor o reducción de tamaño — y su cronología
- Lo que dijeron que les gustaba de la propiedad
- Lo que dijeron que les preocupaba o de lo que no estaban seguros
- Si han visto otras propiedades que compiten con ésta

Claude redacta un correo personalizado que:
- Se abre haciendo referencia a algo específico que dijeron durante la muestra
- Aborda directamente una de sus preocupaciones con un hecho o recurso
- Proporciona un contexto de mercado relevante (si es útil)
- Propone un próximo paso suave — no « ¿estás listo para hacer una oferta? » sino algo menos friccionante como « puedo extraer documentos de HOA si quieres revisarlos »

Para compradores que dejan de responder: Claude redacta un mensaje de consulta que reconoce su cronología, ofrece algo útil y no presiona.

---

### Lead nurturing sequences

Para compradores que están a 3-6 meses de comprar, una secuencia de correo de 4 toques te mantiene relevante sin ser intrusivo.

Cuéntale a Claude: perfil de comprador, rango de precio, tipo de propiedad, área deseada y su cronología declarada.

Claude construye:
- Toque 1 (semana 1): una actualización de mercado relevante para su búsqueda específica — no un boletín genérico
- Toque 2 (semana 3): un listado nuevo relevante o propiedad vendida recientemente con una nota sobre qué les dice
- Toque 3 (semana 6): un artículo educativo — una cosa específica sobre el proceso de compra en tu mercado que afecta su situación
- Toque 4 (semana 10): un reenganche suave — « solo verificando tu cronología, sin presión » — con una información fresca

---

### Social media

Cuéntale a Claude: las 3 mejores características de la propiedad, estilo de vida del comprador objetivo, tu tono de marca personal (profesional, cálido, energético, experto local) y qué plataforma.

Claude escribe posts apropiados para la plataforma:
- Instagram: subtítulo visual-primero, ganchos en la primera línea, hashtags de ubicación, termina con una pregunta o CTA
- Facebook: un poco más largo, encuadre enfocado en la comunidad, funciona con o sin la presión de caracteres de Instagram
- LinkedIn: se usa para propiedades de inversión o listados comerciales — encuadre profesional y orientado al ROI

---

### Prompt template — MLS description

```
Por favor, escribe una descripción de listado MLS. Conforme con la Ley de Vivienda Justa.

Datos de la propiedad:
- Dirección: [ciudad y estado solamente, u omitir]
- Dormitorios/baños: [X] dormitorio / [X] baño
- Pies cuadrados: [X] sq ft, lote [X] sq ft
- Año construido: [X]
- Garaje: [sí/no, adosado/separado, espacios]

Top características a destacar:
1. [característica específica + cualquier detalle relevante]
2. [característica específica]
3. [característica específica]
4. [característica específica]
5. [característica específica]

Notas del barrio (sin escuelas, sin datos demográficos, sin instituciones religiosas):
[caminable, cerca de tiendas, calle tranquila, vistas montañosas, etc.]

Precio: $[X]
Estilo de vida del comprador objetivo: [describe en términos de estilo de vida — p. ej., « compradores que buscan una casa de bloqueo y salida cerca de restaurantes del centro »]
Límite de caracteres MLS: [X palabras o caracteres, o « sin límite »]

Por favor, escribe:
1. Descripción corta conforme con MLS ([X] palabras)
2. Copia de marketing expandida para sitio web (300-400 palabras)
```

## Example

Dices: « Casa de campo de estilo artesano 3BR/2BA en Oak Park, 1.850 pies cuadrados, cocina completamente actualizada con encimeras de cuarzo y electrodomésticos nuevos en 2024, detalles de carácter originales de 1928, garaje separado, barrio caminable con cafeterías y boutiques a dos cuadras, $485K, dirigido a compradores que quieren carácter y caminabilidad sobre un suburbio prefabricado. »

Claude escribe la descripción de MLS y la copia de marketing expandida. Incluye « a dos cuadras de cafeterías y boutiques locales » y « barrio caminable » y excluye cualquier mención de la escuela primaria cercana (que habías mencionado de paso). Claude lo señala en una nota: « Retiré la referencia de la escuela para cumplir con la Ley de Vivienda Justa — reemplazada por « barrio caminable con tiendas locales » para mantener el contexto del estilo de vida sin implicar el perfil del comprador. »

Descripción de MLS: 148 palabras. Versión expandida: 340 palabras con un titular, tres llamadas de característica-beneficio y un párrafo de barrio.

---
