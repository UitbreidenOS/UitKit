---
description: Auditar código contra objetivos de rendimiento, accesibilidad y mejores prácticas de Lighthouse y aplicar correcciones
argument-hint: "[file-or-route] [target-score: 90|95|100]"
---
Optimiza $ARGUMENTS para pasar auditorías de Lighthouse con la puntuación objetivo especificada (predeterminado: 90).

Este comando realiza un análisis estático de código — no ejecuta un navegador. Aplica correcciones que aborden patrones de fallo conocidos de Lighthouse.

**Rendimiento — Core Web Vitals**

LCP (Largest Contentful Paint):
- Añade `fetchpriority="high"` a la imagen de héroe sobre el pliegue o al bloque de texto más grande
- Elimina `loading="lazy"` de cualquier imagen que probablemente esté sobre el pliegue
- Asegúrate de que el CSS crítico esté insertado en línea o cargado de forma síncrona; audita `<link rel="stylesheet">` que bloqueen el renderizado en `<head>`
- Reemplaza `<img src="...">` con `<Image>` (Next.js) o añade `width`/`height` explícitos para evitar cambios de diseño

CLS (Cumulative Layout Shift):
- Cada `<img>`, `<video>` e `<iframe>` debe tener atributos `width` y `height` explícitos o una propiedad CSS `aspect-ratio`
- Carga de fuentes: añade `font-display: swap` a todas las declaraciones `@font-face`
- Evita insertar contenido encima del contenido existente después de que se cargue la página (anuncios, banners, avisos de cookies)

INP / TBT (Interaction to Next Paint / Total Blocking Time):
- Mueve cálculos costosos fuera del hilo principal o envuelve en `startTransition`
- Divide componentes grandes con `React.lazy` + `Suspense` si están bajo el pliegue
- Debounce o throttle manejadores de eventos en scroll, resize e input

**Mejores Prácticas**
- Todos los objetivos `<a>` con `target="_blank"` deben tener `rel="noopener noreferrer"`
- Sin llamadas `console.log` / `console.error` en rutas de código de producción
- Sin atributos HTML obsoletos (`border`, `align`, `bgcolor` en elementos)
- `<meta name="viewport">` debe estar presente y no debe desactivar el escalado del usuario

**SEO**
- Cada página/ruta debe tener un `<title>` y `<meta name="description">` únicos
- La jerarquía de encabezados debe comenzar en `<h1>` sin saltar niveles
- Los enlaces deben tener texto descriptivo — marca anclas "click here" y "read more"

**Accesibilidad (subconjunto de Lighthouse)**
- Etiquetas de botones y enlaces: cada elemento interactivo debe tener un nombre accesible
- Texto alternativo de imagen: todas las imágenes no decorativas necesitan `alt` descriptivo
- Etiquetas de formulario: cada entrada tiene un `<label>` asociado o `aria-label`

**Salida**
Para cada problema encontrado, emite: `file:line | audit category | issue | fix applied`
Aplica todas las correcciones directamente. Si una corrección requiere un cambio en tiempo de ejecución (p. ej., división de bundle real), nota como una acción manual con el cambio exacto necesario.
