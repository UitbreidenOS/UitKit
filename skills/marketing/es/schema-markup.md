---
name: schema-markup
description: "Datos estructurados de Schema.org: generar JSON-LD para resultados enriquecidos, validar marcado, elegir el tipo de esquema correcto, implementar en tipos de página comunes"
---

# Habilidad de Marcado de Esquema

## Cuándo activar
- Agregar datos estructurados para mejorar resultados enriquecidos en Google Search
- Generar JSON-LD para artículos, productos, FAQ, how-tos, reviews, negocios locales
- Validar marcado de esquema antes del despliegue
- Elegir el tipo de esquema correcto para una página
- Depurar por qué no aparecen resultados enriquecidos

## Cuándo no usar
- El esquema solo no te clasificará — mejora el contenido existente
- Reseñas falsas o datos engañosos — Google penalizará
- Para cada página en tu sitio — prioriza las páginas de alto valor primero

## Instrucciones

### Elige el tipo de esquema correcto

```
¿Qué marcado de esquema debo usar para esta página?

Tipo de página/contenido: [describe qué contiene la página]
Objetivo: [fragmentos enriquecidos / panel de conocimiento / paquete local / búsqueda por voz]

Tipos de esquema comunes:
- Article / BlogPosting: noticias, publicaciones de blog, contenido editorial
- Product: páginas de productos de comercio electrónico con precio, disponibilidad, reseñas
- LocalBusiness: ubicaciones físicas (incluye horario, dirección)
- FAQPage: páginas con secciones de Q&A (aparece como expandible en SERP)
- HowTo: instrucciones paso a paso
- Recipe: contenido culinario con ingredientes, pasos, nutrición
- Event: conferencias, conciertos, seminarios web
- JobPosting: ofertas de trabajo
- Course: contenido de aprendizaje en línea
- SoftwareApplication: aplicaciones y herramientas de software
- Review / AggregateRating: reseñas de usuarios o expertos
- BreadcrumbList: jerarquía de navegación del sitio
- Organization: información de la empresa, perfiles sociales
- Person: autor, orador, perfiles profesionales

¿Qué tipos aplican? ¿Se pueden combinar varios tipos?
```

### Genera JSON-LD (listo para pegar)

**Artículo / Publicación de Blog:**
```
Generar esquema de artículo para:
Título: [título]
Autor: [nombre, URL]
Publicado: [fecha]
Modificado: [fecha]
Imagen: [URL]
Publicador: [nombre de la empresa, URL del logo]
URL: [URL de la página]
Descripción: [metadescripción]
```

**LocalBusiness:**
```
Generar esquema LocalBusiness para:
Nombre del negocio: [nombre]
Tipo: [Restaurante / ClinicaMédica / ServicioLegal / Tienda / etc.]
Dirección: [dirección completa]
Teléfono: [número]
Sitio web: [URL]
Horario: [lun-vie 9-17, sáb 10-15, etc.]
Rango de precio: [$ / $$ / $$$]
Latitud/Longitud: [si se conoce]
```

**FAQPage:**
```
Generar esquema FAQPage para estas preguntas frecuentes:
P1: [pregunta]
R1: [respuesta]
P2: [pregunta]
R2: [respuesta]
[agregar según sea necesario — 5-10 es ideal]
URL de la página: [URL]
```

**Product:**
```
Generar esquema de producto para:
Nombre: [nombre del producto]
Descripción: [descripción]
Imagen: [URL]
Marca: [nombre de marca]
SKU: [SKU si está disponible]
Precio: [cantidad]
Moneda: [USD/GBP/EUR]
Disponibilidad: InStock / OutOfStock / PreOrder
Calificación: [puntuación promedio] de [cantidad] reseñas
```

**HowTo:**
```
Generar esquema HowTo para este tutorial:
Título: [título how-to]
Descripción: [qué enseña esto]
Tiempo total: [PT30M = 30 minutos]
Pasos:
1. [nombre del paso] — [descripción del paso]
2. [nombre del paso] — [descripción del paso]
[continuar para todos los pasos]
```

### Valida y depura

```
Valida este marcado de esquema:

[pega código JSON-LD]

Verificar:
1. ¿Sintaxis JSON válida?
2. ¿Campos requeridos presentes para este tipo de esquema?
3. ¿Campos recomendados faltantes (que permitirían resultados enriquecidos)?
4. ¿Propiedades desaprobadas?
5. URL de prueba: https://search.google.com/test/rich-results

También verificar: ¿es este tipo de esquema apto para resultados enriquecidos?
(No todos los tipos de esquema generan mejoras visuales — algunos solo ayudan a entender)
```

### Implementación en tipos de página

```
Crear un plan de implementación de marcado de esquema para mi sitio.

Tipo de sitio: [blog / e-commerce / negocio local / SaaS / mercado]
Tipos de página principales: [lista: página de inicio, páginas de producto, entradas de blog, páginas de categoría, etc.]

Para cada tipo de página:
1. Tipo(s) de esquema recomendado(s)
2. Campos de datos a incluir
3. Qué campos son dinámicos (CMS/DB) vs. estáticos
4. Prioridad: [alta — apta para resultados enriquecidos / media / baja]
5. Método de implementación: [encabezado HTML / complemento CMS / vía GTM / server-rendered]

Resultado: lista de verificación de implementación ordenada por prioridad.
```

## Ejemplo

**Usuario:** Tengo un blog de revisión de SaaS. Cada publicación reseña una herramienta. Quiero fragmentos enriquecidos en Google.

**Claude genera:**

Para una publicación de revisión, combinar `SoftwareApplication` + `Review`:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Notion",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web, iOS, Android, macOS, Windows",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "1",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Your Name" },
    "datePublished": "2026-05-20",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.6",
      "bestRating": "5"
    },
    "reviewBody": "First sentence of your review summary..."
  }
}
```

Aptitud de resultados enriquecidos: ✅ Fragmentos enriquecidos de producto (calificaciones de estrella en SERP)

---
