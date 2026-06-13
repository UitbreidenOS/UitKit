---
name: astro
description: "Astro framework: content-first sites, islands architecture, MDX collections, Cloudflare Workers/Pages deployment, View Transitions, SEO"
---

> 🇪🇸 Versión en español. [Versión en inglés](../astro.md).

# Habilidad Astro

## Cuándo activar
- Construyendo un sitio de contenido, blog, sitio de documentación o sitio de marketing
- Desear cero JavaScript por defecto con islas interactivas opcionales
- Desplegando en Cloudflare Pages o Workers para rendimiento edge global
- Construyendo con colecciones de contenido MDX (frontmatter tipado)
- Agregando View Transitions para navegación fluida tipo SPA en un sitio estático

## Cuándo NO usar
- Apps altamente interactivas (dashboards, UI SaaS) — usar Next.js o SvelteKit
- Cuando necesita sesiones del lado del servidor o autenticación compleja — Next.js es más adecuado
- Funcionalidades en tiempo real — Astro es estático/SSG-first

## Instrucciones

### Configuración del proyecto

```bash
npm create astro@latest my-site
# Options: Blog / Documentation / Empty
# TypeScript: Strict recommended
# Dependencies: Yes

# Agregar integraciones
npx astro add tailwind react cloudflare
```

### Estructura de archivos

```
src/
├── content/
│   ├── config.ts          # esquemas de colección
│   └── blog/              # archivos .md / .mdx
│       └── hello-world.md
├── layouts/
│   └── BlogPost.astro
├── pages/
│   ├── index.astro        # se convierte en /
│   ├── blog/
│   │   ├── index.astro    # /blog
│   │   └── [slug].astro   # /blog/[slug]
│   └── rss.xml.ts         # feed RSS
├── components/
│   ├── Header.astro       # renderizado en servidor
│   └── Counter.tsx        # isla React (client:load)
└── styles/
    └── global.css
```

### Colecciones de contenido (MDX tipado)

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    pubDate:     z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage:   z.string().optional(),
    tags:        z.array(z.string()).default([]),
    draft:       z.boolean().default(false),
  }),
})

export const collections = { blog }
```

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content'
import BlogLayout from '../../layouts/BlogPost.astro'

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }))
}

const post = Astro.props
const { Content } = await post.render()
---

<BlogLayout frontmatter={post.data}>
  <Content />
</BlogLayout>
```

### Arquitectura de islas — hidratación selectiva

```astro
---
// Componentes Astro: cero JS (solo HTML renderizado en servidor)
// Componentes React/Vue/Svelte: hidratar cuando sea necesario
---

<!-- Renderizado en servidor — no se envía JS -->
<Header />
<ArticleContent />

<!-- Hidratar inmediatamente al cargar la página -->
<SearchBar client:load />

<!-- Hidratar cuando sea visible (lazy) -->
<CommentsSection client:visible />

<!-- Hidratar solo en interacción -->
<ShareMenu client:idle />

<!-- Nunca hidratar (estático) -->
<StaticWidget />
```

### Despliegue en Cloudflare Pages

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
  output: 'server',   // o 'hybrid' — estático + servidor bajo demanda
  adapter: cloudflare({
    mode: 'directory',  // Cloudflare Pages Functions
    // o 'advanced' para Cloudflare Workers
  }),
})
```

```bash
# Desplegar en Cloudflare Pages
npm run build
# Luego conectar el repositorio al panel de Cloudflare Pages
# Comando de build: npm run build
# Directorio de salida: dist/
```

**Cloudflare Workers (SSR en el edge):**
```typescript
// src/middleware.ts — se ejecuta en el edge
import type { MiddlewareHandler } from 'astro'

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Acceder a bindings de Cloudflare: KV, R2, D1, AI
  const { env } = context.locals.runtime
  const cache = await env.MY_KV.get('cached-data')
  return next()
}
```

### View Transitions

```astro
---
// src/layouts/Base.astro
import { ViewTransitions } from 'astro:transitions'
---

<html>
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

```astro
<!-- Transición personalizada por elemento -->
<h1 transition:name="hero-title">Blog Post Title</h1>
<img transition:name="hero-image" src={heroImage} />
<!-- Los elementos con nombres coincidentes se animan entre páginas -->
```

### Patrones SEO

```astro
---
// components/SEO.astro
const {
  title,
  description,
  image = '/og-default.png',
  canonicalURL = Astro.url,
} = Astro.props
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.site)} />
<meta property="og:url" content={canonicalURL} />
<meta name="twitter:card" content="summary_large_image" />
```

### Feed RSS

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const posts = await getCollection('blog', p => !p.data.draft)
  return rss({
    title: 'My Blog',
    description: 'Latest posts',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  })
}
```

## Ejemplo

**Usuario:** Construir un blog para desarrolladores con Astro — artículos MDX con resaltado de código, filtrado por etiquetas, modo oscuro, feed RSS y despliegue en Cloudflare Pages.

**Resultado esperado:**
- `src/content/config.ts` — colección blog con esquema de title, description, pubDate, tags, draft
- `src/pages/blog/[slug].astro` — página de artículo dinámico con `getStaticPaths`
- `src/pages/blog/[tag].astro` — página de filtrado por etiquetas
- `src/components/SEO.astro` — etiquetas OG, URL canónica
- `src/pages/rss.xml.ts` — endpoint de feed RSS
- `astro.config.mjs` — adaptador Cloudflare, Tailwind, MDX, resaltado de sintaxis

---
