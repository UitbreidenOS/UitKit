---
name: astro
description: "Astro framework: content-first sites, islands architecture, MDX collections, Cloudflare Workers/Pages deployment, View Transitions, SEO"
---

> 🇩🇪 Deutsche Version. [Englische Version](../astro.md).

# Skill: Astro

## Wann aktivieren
- Erstellen einer Inhaltswebsite, eines Blogs, einer Docs-Site oder Marketing-Site
- Standardmäßig kein JavaScript gewünscht mit optionalen interaktiven Inseln
- Deployment auf Cloudflare Pages oder Workers für globale Edge-Performance
- Erstellen mit MDX-Inhaltssammlungen (typsicheres Frontmatter)
- Hinzufügen von View Transitions für flüssige SPA-ähnliche Navigation auf einer statischen Site

## Wann NICHT verwenden
- Hochinteraktive Apps (Dashboards, SaaS-UIs) — Next.js oder SvelteKit verwenden
- Wenn Sie serverseitige Sessions oder komplexe Authentifizierung benötigen — Next.js ist besser geeignet
- Echtzeit-Features — Astro ist statisch/SSG-first

## Anweisungen

### Projekt-Setup

```bash
npm create astro@latest my-site
# Options: Blog / Documentation / Empty
# TypeScript: Strict recommended
# Dependencies: Yes

# Integrationen hinzufügen
npx astro add tailwind react cloudflare
```

### Dateistruktur

```
src/
├── content/
│   ├── config.ts          # Sammlungs-Schemata
│   └── blog/              # .md / .mdx Dateien
│       └── hello-world.md
├── layouts/
│   └── BlogPost.astro
├── pages/
│   ├── index.astro        # wird zu /
│   ├── blog/
│   │   ├── index.astro    # /blog
│   │   └── [slug].astro   # /blog/[slug]
│   └── rss.xml.ts         # RSS-Feed
├── components/
│   ├── Header.astro       # serverseitig gerendert
│   └── Counter.tsx        # React-Insel (client:load)
└── styles/
    └── global.css
```

### Inhaltssammlungen (typsicheres MDX)

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

### Insel-Architektur — selektive Hydratation

```astro
---
// Astro-Komponenten: kein JS (nur serverseitig gerendertes HTML)
// React/Vue/Svelte-Komponenten: bei Bedarf hydratisieren
---

<!-- Serverseitig gerendert — kein JS ausgeliefert -->
<Header />
<ArticleContent />

<!-- Sofort beim Laden der Seite hydratisieren -->
<SearchBar client:load />

<!-- Hydratisieren wenn sichtbar (lazy) -->
<CommentsSection client:visible />

<!-- Nur bei Interaktion hydratisieren -->
<ShareMenu client:idle />

<!-- Nie hydratisieren (statisch) -->
<StaticWidget />
```

### Cloudflare Pages Deployment

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
  output: 'server',   // oder 'hybrid' — statisch + Server auf Anfrage
  adapter: cloudflare({
    mode: 'directory',  // Cloudflare Pages Functions
    // oder 'advanced' für Cloudflare Workers
  }),
})
```

```bash
# Auf Cloudflare Pages deployen
npm run build
# Dann Repository mit Cloudflare Pages Dashboard verbinden
# Build-Befehl: npm run build
# Ausgabeverzeichnis: dist/
```

**Cloudflare Workers (Edge SSR):**
```typescript
// src/middleware.ts — läuft am Edge
import type { MiddlewareHandler } from 'astro'

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Auf Cloudflare Bindings zugreifen: KV, R2, D1, AI
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
<!-- Benutzerdefinierte Übergang pro Element -->
<h1 transition:name="hero-title">Blog Post Title</h1>
<img transition:name="hero-image" src={heroImage} />
<!-- Elemente mit übereinstimmenden Namen animieren zwischen Seiten -->
```

### SEO-Muster

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

### RSS-Feed

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

## Beispiel

**Benutzer:** Einen Entwickler-Blog mit Astro erstellen — MDX-Artikel mit Code-Highlighting, Tag-Filterung, Dunkelmodus, RSS-Feed und Deployment auf Cloudflare Pages.

**Erwartete Ausgabe:**
- `src/content/config.ts` — Blog-Sammlung mit title, description, pubDate, tags, draft Schema
- `src/pages/blog/[slug].astro` — dynamische Artikel-Seite mit `getStaticPaths`
- `src/pages/blog/[tag].astro` — Tag-Filterseite
- `src/components/SEO.astro` — OG-Tags, kanonische URL
- `src/pages/rss.xml.ts` — RSS-Feed-Endpoint
- `astro.config.mjs` — Cloudflare-Adapter, Tailwind, MDX, Syntax-Highlighting

---
