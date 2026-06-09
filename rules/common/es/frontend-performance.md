# Reglas de Rendimiento Frontend

Aplicar al construir o revisar UI entregada en el navegador.

## Carga

- Servir HTML desde el edge o CDN — eliminar viajes de ida y vuelta al origen para el documento inicial
- Usar `<link rel="preload">` para fuentes críticas e imágenes above-the-fold; usar `<link rel="prefetch">` para activos de la siguiente página
- Dividir bundles en límites de ruta; lazy-load todo lo que no sea necesario para el primer paint
- Inline critical CSS (< 14 KB) en `<head>`; cargar el resto asincronamente
- Establecer `Cache-Control: immutable` far-future en activos estáticos hasheados; `no-cache` en HTML

## Imágenes

- Usar formatos modernos: WebP con fallback JPEG/PNG; AVIF donde sea compatible
- Siempre especificar atributos `width` y `height` para prevenir layout shift (CLS)
- Usar `loading="lazy"` para imágenes below-the-fold; nunca para above-the-fold
- Servir imágenes en el tamaño renderizado — no entregar una imagen de 2000 px para un slot de 200 px
- Usar un servicio de transformación de imágenes CDN en lugar de redimensionar en tiempo de compilación

## JavaScript

- Cada byte de JS se parsea y se ejecuta — enviar solo lo que la ruta actual necesita
- Evitar long tasks síncronos (> 50 ms) en el hilo principal; mover trabajo pesado a un Web Worker
- Debounce input handlers; throttle scroll y resize listeners
- Remover event listeners y cancelar timers al desmontar componentes para prevenir memory leaks
- Tree-shake dependencias: importar named exports, no librerías completas

## Renderizado

- Medir Core Web Vitals (LCP, INP, CLS) en real user monitoring — no solo en Lighthouse
- Objetivo LCP: < 2.5 s; objetivo INP: < 200 ms; objetivo CLS: < 0.1
- Evitar forced synchronous layouts: no leer propiedades de layout inmediatamente después de escribirlas
- Usar `content-visibility: auto` en secciones off-screen de páginas largas
- Virtualizar listas largas — nunca renderizar miles de nodos DOM

## Fuentes

- Subset fuentes a los conjuntos de caracteres que uses; no cargar rangos Unicode completos para contenido solo Latino
- Usar `font-display: swap` para texto del cuerpo; `font-display: optional` para fuentes decorativas
- Preconectar a CDNs de fuentes: `<link rel="preconnect" href="https://fonts.googleapis.com">`
- Auto-hospedar fuentes cuando la latencia a un CDN de terceros es medible

## Medición

- Establecer un performance budget y fallar CI cuando se exceda (tamaño de bundle, LCP, puntuación de Lighthouse)
- Perfilar con dispositivos reales en conexiones throttled — máquinas de desarrolladores no son representativas
- Usar `PerformanceObserver` para recopilar field data (métricas de usuario real), no solo tests sintéticos
