---
name: astro
description: "Astro framework: content-first sites, islands architecture, MDX collections, Cloudflare Workers/Pages deployment, View Transitions, SEO"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../astro.md).

# Skill: Astro

## Wanneer activeren
- Bouwen van een contentsite, blog, documentatiesite of marketingsite
- Standaard geen JavaScript gewenst met optionele interactieve eilanden
- Deployen naar Cloudflare Pages of Workers voor wereldwijde edge-prestaties
- Bouwen met MDX-inhoudsverzamelingen (type-veilige frontmatter)
- View Transitions toevoegen voor vloeiende SPA-achtige navigatie op een statische site

## Wanneer NIET gebruiken
- Sterk interactieve apps (dashboards, SaaS-UI's) — gebruik Next.js of SvelteKit
- Wanneer u server-side sessies of complexe authenticatie nodig heeft — Next.js is beter geschikt
- Real-time functies — Astro is statisch/SSG-first

## Instructies

### Projectopzet

```bash
npm create astro@latest my-site
# Options: Blog / Documentation / Empty
# TypeScript: Strict recommended
# Dependencies: Yes

# Integraties toevoegen
npx astro add tailwind react cloudflare
```

### Bestandsstructuur

```
src/
├── content/
│   ├── config.ts          # verzameling-schema's
│   └── blog/              # .md / .mdx bestanden
│       └── hello-world.md
├── layouts/
│   └── BlogPost.astro
├── pages/
│   ├── index.astro        # wordt /
│   ├── blog/
│   │   ├── index.astro    # /blog
│   │   └── [slug].astro   # /blog/[slug]
│   └── rss.xml.ts         # RSS-feed
├── components/
│   ├── Header.astro       # server-gerenderd
│   └── Counter.tsx        # React-eiland (client:load)
└── styles/
    └── global.css
```

### Inhoudsverzamelingen (type-veilige MDX)

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

### Eilandenarchitectuur — selectieve hydratatie

```astro
---
// Astro-componenten: geen JS (alleen server-gerenderde HTML)
// React/Vue/Svelte-componenten: hydrateren wanneer nodig
---

<!-- Server-gerenderd — geen JS verzonden -->
<Header />
<ArticleContent />

<!-- Direct hydrateren bij het laden van de pagina -->
<SearchBar client:load />

<!-- Hydrateren wanneer zichtbaar (lazy) -->
<CommentsSection client:visible />

<!-- Alleen hydrateren bij interactie -->
<ShareMenu client:idle />

<!-- Nooit hydrateren (statisch) -->
<StaticWidget />
```

### Cloudflare Pages implementatie

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
  output: 'server',   // of 'hybrid' — statisch + server op aanvraag
  adapter: cloudflare({
    mode: 'directory',  // Cloudflare Pages Functions
    // of 'advanced' voor Cloudflare Workers
  }),
})
```

```bash
# Deployen naar Cloudflare Pages
npm run build
# Vervolgens repository verbinden met Cloudflare Pages dashboard
# Build-commando: npm run build
# Uitvoermap: dist/
```

**Cloudflare Workers (edge SSR):**
```typescript
// src/middleware.ts — draait op de edge
import type { MiddlewareHandler } from 'astro'

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Toegang tot Cloudflare bindings: KV, R2, D1, AI
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
<!-- Aangepaste overgang per element -->
<h1 transition:name="hero-title">Blog Post Title</h1>
<img transition:name="hero-image" src={heroImage} />
<!-- Elementen met overeenkomende namen animeren tussen pagina's -->
```

### SEO-patronen

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

### RSS-feed

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

## Voorbeeld

**Gebruiker:** Een ontwikkelaarsblog bouwen met Astro — MDX-artikelen met code-highlighting, tagfiltering, donkere modus, RSS-feed en deployment naar Cloudflare Pages.

**Verwachte output:**
- `src/content/config.ts` — blogverzameling met title, description, pubDate, tags, draft schema
- `src/pages/blog/[slug].astro` — dynamische artikelpagina met `getStaticPaths`
- `src/pages/blog/[tag].astro` — tagfilterpagina
- `src/components/SEO.astro` — OG-tags, canonieke URL
- `src/pages/rss.xml.ts` — RSS-feed-endpoint
- `astro.config.mjs` — Cloudflare-adapter, Tailwind, MDX, syntaxmarkering

---
