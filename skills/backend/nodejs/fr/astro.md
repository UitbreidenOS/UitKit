---
name: astro
description: "Astro framework: content-first sites, islands architecture, MDX collections, Cloudflare Workers/Pages deployment, View Transitions, SEO"
---

> 🇫🇷 Version française. [English version](../astro.md).

# Compétence Astro

## Quand activer
- Construction d'un site de contenu, blog, site de documentation ou site marketing
- Souhaiter zéro JavaScript par défaut avec des îles interactives optionnelles
- Déploiement sur Cloudflare Pages ou Workers pour des performances en périphérie mondiale
- Construction avec des collections de contenu MDX (frontmatter typé)
- Ajout de View Transitions pour une navigation fluide de type SPA sur un site statique

## Quand NE PAS utiliser
- Applications hautement interactives (tableaux de bord, interfaces SaaS) — utilisez Next.js ou SvelteKit
- Quand vous avez besoin de sessions côté serveur ou d'une authentification complexe — Next.js est mieux adapté
- Fonctionnalités en temps réel — Astro est orienté statique/SSG

## Instructions

### Configuration du projet

```bash
npm create astro@latest my-site
# Options: Blog / Documentation / Empty
# TypeScript: Strict recommended
# Dependencies: Yes

# Ajouter des intégrations
npx astro add tailwind react cloudflare
```

### Structure de fichiers

```
src/
├── content/
│   ├── config.ts          # schémas de collection
│   └── blog/              # fichiers .md / .mdx
│       └── hello-world.md
├── layouts/
│   └── BlogPost.astro
├── pages/
│   ├── index.astro        # devient /
│   ├── blog/
│   │   ├── index.astro    # /blog
│   │   └── [slug].astro   # /blog/[slug]
│   └── rss.xml.ts         # flux RSS
├── components/
│   ├── Header.astro       # rendu côté serveur
│   └── Counter.tsx        # île React (client:load)
└── styles/
    └── global.css
```

### Collections de contenu (MDX typé)

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

### Architecture en îles — hydratation sélective

```astro
---
// Composants Astro : zéro JS (HTML rendu côté serveur uniquement)
// Composants React/Vue/Svelte : hydrater si nécessaire
---

<!-- Rendu côté serveur — aucun JS envoyé -->
<Header />
<ArticleContent />

<!-- Hydrater immédiatement au chargement de la page -->
<SearchBar client:load />

<!-- Hydrater quand visible (lazy) -->
<CommentsSection client:visible />

<!-- Hydrater uniquement lors d'une interaction -->
<ShareMenu client:idle />

<!-- Ne jamais hydrater (statique) -->
<StaticWidget />
```

### Déploiement Cloudflare Pages

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
  output: 'server',   // ou 'hybrid' — statique + serveur à la demande
  adapter: cloudflare({
    mode: 'directory',  // Cloudflare Pages Functions
    // ou 'advanced' pour Cloudflare Workers
  }),
})
```

```bash
# Déployer sur Cloudflare Pages
npm run build
# Puis connecter le dépôt au tableau de bord Cloudflare Pages
# Commande de build : npm run build
# Répertoire de sortie : dist/
```

**Cloudflare Workers (SSR en périphérie) :**
```typescript
// src/middleware.ts — s'exécute en périphérie
import type { MiddlewareHandler } from 'astro'

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Accéder aux liaisons Cloudflare : KV, R2, D1, AI
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
<!-- Transition personnalisée par élément -->
<h1 transition:name="hero-title">Blog Post Title</h1>
<img transition:name="hero-image" src={heroImage} />
<!-- Les éléments avec des noms correspondants s'animent entre les pages -->
```

### Modèles SEO

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

### Flux RSS

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

## Exemple

**Utilisateur :** Construire un blog pour développeurs avec Astro — articles MDX avec coloration syntaxique, filtrage par tags, mode sombre, flux RSS, et déploiement sur Cloudflare Pages.

**Résultat attendu :**
- `src/content/config.ts` — collection blog avec schéma title, description, pubDate, tags, draft
- `src/pages/blog/[slug].astro` — page d'article dynamique avec `getStaticPaths`
- `src/pages/blog/[tag].astro` — page de filtrage par tag
- `src/components/SEO.astro` — balises OG, URL canonique
- `src/pages/rss.xml.ts` — endpoint de flux RSS
- `astro.config.mjs` — adaptateur Cloudflare, Tailwind, MDX, coloration syntaxique

---
