---
name: seo-audit
description: "Auditoría SEO: problemas técnicos, factores on-page, perfil de enlaces, Core Web Vitals, datos estructurados, lista de correcciones priorizada con impacto estimado en tráfico"
---

# Habilidad de Auditoría SEO

## Cuándo activar
- Realizar una auditoría SEO integral en un sitio web
- Investigar por qué el tráfico orgánico ha disminuido
- Identificar problemas técnicos de SEO que bloquean el rastreo o la indexación
- Auditar la estrategia SEO de un competidor
- Priorizar correcciones SEO por impacto estimado en tráfico

## Cuándo no usar
- Seguimiento de clasificaciones en tiempo real — usar Ahrefs, SEMrush o Google Search Console
- Ejecución de construcción de enlaces — requiere herramientas de alcance
- Búsqueda pagada (Google Ads) — canal completamente diferente

## Instrucciones

### Auditoría técnica de SEO

```
Ejecutar una auditoría técnica de SEO. Proporcionar:

URL del sitio: [URL]
Herramientas disponibles: [Google Search Console / Screaming Frog / Ahrefs / SEMrush / PageSpeed Insights]

Verificar estos factores técnicos:

RASTREO E INDEXACIÓN
- ¿Es el sitio indexable? Verificar robots.txt y etiquetas meta robots
- ¿Hay etiquetas noindex bloqueando páginas importantes?
- Sitemap XML: ¿presente, enviado a GSC, errores?
- ¿Errores de rastreo en Google Search Console?
- Etiquetas canónicas: ¿correctas, sin problemas de autorreferencia?

RENDIMIENTO TÉCNICO
- Core Web Vitals (LCP, FID/INP, CLS): ¿aprobado/reprobado?
- Velocidad de página: puntuaciones móvil y escritorio (PageSpeed Insights)
- Compatible con móvil: ¿aprueba la prueba de usabilidad móvil de Google?
- HTTPS: ¿todas las páginas, sin contenido mixto?

ESTRUCTURA DEL SITIO
- Estructura URL: ¿limpia, descriptiva, sin parámetros duplicados?
- Enlaces internos: ¿páginas huérfanas? ¿Páginas profundas (> 3 clics desde inicio)?
- Paginación: ¿rel prev/next o uso de canónica?
- Arquitectura del sitio: ¿categorías lógicas, migas de pan apropiadas?

Para cada problema encontrado:
- Gravedad: Crítico / Alto / Medio / Bajo
- Impacto estimado en tráfico
- Recomendación de corrección
- Esfuerzo de implementación: Fácil / Medio / Difícil
```

### Auditoría SEO on-page

```
Auditar SEO on-page para [URL o tipo de página]:

CONTENIDO
- Etiquetas title: únicas, menos de 60 caracteres, incluye palabra clave principal?
- Meta descripciones: atractivas, menos de 160 caracteres, únicas?
- H1: una por página, incluye palabra clave?
- Estructura de encabezados: jerarquía lógica H1→H2→H3?
- Profundidad del contenido: ¿cubre el tema exhaustivamente vs páginas clasificadas arriba?
- Uso de palabras clave: natural, sin relleno, ¿términos LSI incluidos?
- Frescura del contenido: fecha de actualización, contenido obsoleto?

MEDIOS
- Imágenes: ¿texto alt presente, descriptivo, no relleno de palabras clave?
- Tamaños de archivos de imagen: ¿comprimidos para rendimiento?
- Videos: ¿transcripciones, marcado de esquema?

DATOS ESTRUCTURADOS
- ¿Marcado de esquema presente? (Article, Product, FAQ, How-to, Review, LocalBusiness)
- ¿Válido según la prueba de Resultados Enriquecidos de Google?
- ¿Oportunidades de esquema faltantes?

Proporcionar lista de correcciones priorizada.
```

### Análisis SEO de competencia

```
Analizar [URL de competidor] vs mi sitio [mi URL]:

BRECHA DE PALABRAS CLAVE
- ¿Para qué palabras clave se clasifican y yo no?
- ¿Cuál es su tráfico orgánico estimado?
- ¿Cuáles de sus páginas principales generan más tráfico?

BRECHA DE CONTENIDO
- ¿Qué contenido tienen que yo no tengo?
- ¿Qué temas en nuestro espacio dominan?

BRECHA DE ENLACES
- Comparación de autoridad de dominio
- ¿Cuántos dominios de referencia tienen vs yo?
- Sus mejores fuentes de enlaces (para investigación de alcance)

Priorizar: ¿cuáles brechas puedo cerrar más realísticamente en los próximos 90 días?
```

### Prioridades de corrección de Core Web Vitals

```
Mis puntuaciones de Core Web Vitals:
- LCP (Largest Contentful Paint): [Xs] — objetivo < 2,5s
- INP (Interaction to Next Paint): [Xms] — objetivo < 200ms
- CLS (Cumulative Layout Shift): [X] — objetivo < 0,1

Stack tecnológico del sitio: [Next.js / WordPress / Shopify / otro]

Para cada métrica que falla:
1. ¿Cuál es la causa más probable en mi stack?
2. ¿Cuáles son las 3 principales correcciones para implementar primero?
3. ¿Mejora estimada de cada corrección?
```

### Informe de auditoría SEO

```
Generar un resumen de auditoría SEO para [sitio].

Hallazgos de auditoría: [pegar problemas clave encontrados]

Formato:
1. Puntuación general de salud SEO (1-10) con justificación
2. Problemas críticos (deben corregirse — bloquean tráfico o indexación)
3. Oportunidades de alta prioridad (mayores ganancias de tráfico estimadas)
4. Ganancias rápidas (fáciles de implementar, impacto inmediato)
5. Hoja de ruta SEO de 90 días con prioridades
```

## Ejemplo

**Usuario:** El tráfico de mi blog bajó 40% después de la actualización central de Google en marzo de 2026. Ejecuta una auditoría.

**Marco de auditoría de Claude:**
1. Verificar Google Search Console para acciones manuales o problemas de cobertura
2. Identificar qué páginas perdieron clasificaciones (informe de cambios de posición)
3. Verificar si las páginas perdidas tienen contenido delgado, señales E-E-A-T débiles o contenido duplicado
4. Analizar páginas con mejor rendimiento que sobrevivieron — ¿qué tienen que las páginas perdidas no?
5. Revisar en todo el sitio: ¿texto de anclaje sobre-optimizado? ¿Contenido afiliado delgado? ¿Contenido generado por IA sin señales de experiencia humana?
6. Generar lista de correcciones priorizada con cronograma de recuperación estimado por categoría de corrección

---
