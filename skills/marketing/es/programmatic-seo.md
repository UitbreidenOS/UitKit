---
name: programmatic-seo
description: "SEO programático: construye plantillas de landing pages a escala, identifica fuentes de datos, diseña estructuras de URL, evita sanciones por contenido delgado"
---

# Habilidad de SEO Programático

## Cuándo activar
- Crear cientos o miles de páginas de ubicación/categoría/comparación
- Construcción de una estrategia de contenido impulsada por base de datos (por ejemplo, páginas "[Ciudad] + [Servicio]")
- Escalar la producción de contenido con plantillas y flujos de datos
- Auditar páginas de SEO programático existentes para problemas de calidad
- Planificación de una estrategia de SEO programático antes de la implementación

## Cuándo no usar
- Sitios con menos de 100 páginas potenciales — el SEO manual es mejor
- Cuando no tiene una fuente de datos real — el spam de plantilla puro es penalizado
- Cuando la intención del usuario es demasiado estrecha para justificar escala

## Instrucciones

### Identificar oportunidades de SEO programático

```
Identificar oportunidades de SEO programático para mi negocio.

Tipo de negocio: [describe]
Sitio actual: [URL o descripción]
Productos/servicios: [lista]

Patrones programáticos comunes:
1. Páginas de ubicación: "[Servicio] en [Ciudad]" — funciona para negocios locales, mercados, B2B
2. Categoría × modificador: "[Categoría] para [Audiencia/Caso de uso]"
3. Páginas de comparación: "[Herramienta A] vs [Herramienta B]" — funciona para SaaS, herramientas
4. Páginas de integración: "[Producto] + [Integración]" — estilo Zapier
5. Páginas de plantilla: "[Rol] plantilla de CV", "[Industria] plantilla de factura"
6. Páginas de datos: "estadísticas de [Ciudad] [Métrica]", "informe de [Año] [Industria]"

¿Qué patrones se aplican a mi negocio?
Estimar: ¿cuántas páginas podría generar esto?
¿Qué fuente de datos alimentaría cada una?
```

### Diseñar la estructura de la plantilla

```
Diseñar una plantilla de SEO programático para [tipo de página].

URL de ejemplo: /[ciudad]/[servicio] (ej. /madrid/diseño-web)
Consulta objetivo: "[servicio] en [ciudad]"
Datos que tengo: [listar campos — nombre de ciudad, población, estadísticas locales, etc.]

Secciones de plantilla:
1. H1: [fórmula — ej. "Diseño web en {{ciudad}}"]
2. Párrafo introductorio (único por ciudad — ¿qué varía?)
3. Propuesta de valor principal (estática — idéntica en todas las páginas)
4. Diferenciación local (¿qué hace que la ciudad/categoría sea única?)
5. Testimonios/estudios de caso (filtrar por ubicación si está disponible)
6. Preguntas frecuentes (mezcla de preguntas estáticas + dinámicas específicas de ciudad)
7. CTA

Estrategia de unicidad: ¿qué difiere entre páginas para evitar contenido delgado?
Umbral de contenido mínimo: ¿cuántas palabras de contenido verdaderamente único por página?
```

### Planificación de arquitectura de datos

```
Planificar la arquitectura de datos para SEO programático.

Tipo de página: [describe]
Escala: [X] páginas planeadas

Fuentes de datos a considerar:
- Datos internos (tus datos de producto, datos de cliente, transacciones)
- Conjuntos de datos públicos (Censo, Wikipedia, datos abiertos del gobierno)
- Fuentes de API (Google Places, Yelp, Clima, etc.)
- Datos raspados/agregados (listados de directorios, tableros de empleos)
- Contenido generado por el usuario (reseñas, Q&A)

Para mi caso de uso:
1. ¿Qué datos hacen que cada página sea verdaderamente única?
2. ¿Dónde obtengo esos datos?
3. ¿Cómo los mantengo actualizados? (generación estática vs. dinámica)
4. ¿Cuál es el mínimo de datos por página para evitar contenido delgado?

Resultado: plan de arquitectura de datos con campos por plantilla de página.
```

### Auditoría de contenido delgado

```
Audita estas páginas programáticas para riesgo de contenido delgado.

Páginas de ejemplo: [pega 3-5 URL o describe la plantilla]
Problema observado: [tráfico bajo, acción manual, clasificaciones pobres]

Verificar:
1. Proporción de contenido único: ¿qué % de cada página es único vs. plantilla?
2. Valor del usuario: ¿responde esta página la consulta de búsqueda mejor que una búsqueda de Google?
3. Duplicación: ¿son las páginas demasiado similares entre sí?
4. Señales autogeneradas: ¿parece que fue escrito para motores de búsqueda, no para humanos?
5. Datos de engagement: tasa de rebote, tiempo en la página (si disponible)

Recomendaciones: consolidar / mejorar / eliminar / noindex.
```

### URL y arquitectura del sitio

```
Diseñar estructura de URL y enlaces internos para SEO programático a escala.

Tipo de página: [páginas de ubicación/categoría/comparación]
Escala: [X] páginas

Opciones de estructura URL:
- Plana: /[ciudad]-[servicio] (simple, pierde jerarquía de categorías)
- Anidada: /[servicio]/[ciudad] (mejor para jerarquía facetada)
- Híbrida: /[categoría]/[modificador]-[ubicación]

Estrategia de enlace interno:
1. Páginas de hub: páginas a nivel de categoría que se vinculan a todas las variantes de ubicación
2. Breadcrumbs: mostrar jerarquía para usuario y crawlers
3. Páginas relacionadas: misma ciudad, servicios diferentes / mismo servicio, ciudades cercanas
4. Paginación vs. desplazamiento infinito vs. "cargar más"
5. Segmentación de sitemap XML (sitemap separado para páginas programáticas)

Diseñar la arquitectura para [X] páginas.
```

## Ejemplo

**Usuario:** Gestiono un mercado de freelancers. Quiero construir páginas "[Habilidad] freelancers en [Ciudad]". Tengo 50 habilidades y 200 ciudades = 10.000 páginas. ¿Cómo hago esto sin ser penalizado?

**Plan de Claude:**

**Estrategia de unicidad de datos:**
- Población de la ciudad + industrias notables (Censo + API de Wikipedia)
- Tasas promedio para la habilidad en esa ciudad (de tus propios datos de mercado)
- Número de freelancers verificados en tu plataforma en esa combinación ciudad/habilidad
- Freelancers destacados (dinámico, de tu DB)
- Proyectos completados recientemente en esa ciudad (de tus datos de transacciones)

**Umbral de contenido delgado:** Cada página necesita ≥ 3 puntos de datos verdaderamente únicos (datos de tasa + número de freelancers + perfiles destacados). Las páginas con < 3 freelancers deben ser noindexed hasta completarse.

**Secuencia de lanzamiento:** Comienza con las 20 ciudades principales × las 50 habilidades (1.000 páginas). Valida indexación y desempeño antes de expandir a las 200 ciudades.

**Plantilla H1:** "Encuentra [Habilidad] Freelancers en [Ciudad] — [X] Profesionales Verificados"

---
