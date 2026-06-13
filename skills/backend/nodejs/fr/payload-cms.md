---
name: payload-cms
description: "Payload CMS: TypeScript-first headless CMS, collection schemas, access control, hooks, REST+GraphQL APIs, Next.js App Router integration"
---

> 🇫🇷 Version française. [English version](../payload-cms.md).

# Compétence Payload CMS

## Quand activer
- Construction d'une application Next.js nécessitant un système de gestion de contenu
- Configuration de collections de contenu typées (articles de blog, produits, pages)
- Implémentation du contrôle d'accès au niveau des champs (admin uniquement, l'auteur peut modifier ses propres contenus)
- Utilisation des hooks de Payload pour déclencher des effets de bord lors des changements de documents
- Migration d'un CMS SaaS (Contentful, Sanity) vers une solution auto-hébergée

## Quand NE PAS utiliser
- Sites statiques simples avec des fichiers markdown — utilisez Astro + collections de contenu
- Projets non-TypeScript — Payload est TypeScript-first
- Quand vous avez besoin d'un constructeur de pages visuel glisser-déposer — utilisez Webflow ou Builder.io

## Instructions

### Installation (avec Next.js)

```bash
npx create-payload-app@latest my-app
# Template: Website / E-commerce / Blank
# Database: MongoDB / PostgreSQL
# TypeScript: Yes (default)
```

### Schéma de collection

```typescript
// collections/Posts.ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'updatedAt'],
  },
  access: {
    read:   () => true,          // public
    create: isAuthenticated,      // connecté
    update: isAuthorOrAdmin,      // ses propres articles ou admin
    delete: isAdmin,              // admin uniquement
  },
  fields: [
    { name: 'title',   type: 'text',     required: true },
    { name: 'slug',    type: 'text',     unique: true, admin: { position: 'sidebar' } },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title',       type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
  timestamps: true,
}
```

### Helpers de contrôle d'accès

```typescript
// access/isAdmin.ts
import type { AccessArgs } from 'payload'

export const isAdmin = ({ req: { user } }: AccessArgs) =>
  user?.role === 'admin'

export const isAuthenticated = ({ req: { user } }: AccessArgs) =>
  Boolean(user)

export const isAuthorOrAdmin = ({ req: { user } }: AccessArgs) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { author: { equals: user.id } }  // accès basé sur contrainte
}
```

### Hooks — déclencher des effets de bord

```typescript
// les hooks s'exécutent avant/après les opérations sur les documents
export const Posts: CollectionConfig = {
  // ...
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Générer automatiquement le slug à partir du titre
        if (operation === 'create' && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        // Déclencher la revalidation quand l'article est publié
        if (doc.status === 'published') {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`, {
            method: 'POST',
            headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET! },
            body: JSON.stringify({ slug: doc.slug }),
          })
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        // Nettoyer le contenu associé
        await deleteRelatedMedia(doc.heroImage)
      },
    ],
  },
}
```

### payload.config.ts

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
// ou : import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_APP_URL,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— My CMS' },
  },
  collections: [Posts, Media, Users],
  db: mongooseAdapter({ url: process.env.MONGODB_URI! }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: { outputFile: path.resolve(__dirname, 'payload-types.ts') },
})
```

### Intégration Next.js App Router

```typescript
// app/(app)/blog/[slug]/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug:   { equals: params.slug } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,  // résoudre les relations
  })

  if (!docs[0]) notFound()
  const post = docs[0]

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Rendu du texte enrichi Lexical */}
    </article>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    select: { slug: true },
    pagination: false,
  })
  return docs.map(post => ({ slug: post.slug }))
}
```

### API locale vs REST vs GraphQL

```typescript
// API locale (plus rapide — pas de surcharge HTTP, utiliser dans les Server Components)
const payload = await getPayload({ config })
const post = await payload.findByID({ collection: 'posts', id })

// API REST (depuis le client ou les services externes)
const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts?where[status][equals]=published`)
const { docs } = await res.json()

// GraphQL (pour les requêtes complexes)
const query = `
  query { Posts(where: { status: { equals: published } }) {
    docs { id title slug author { name } }
  }}
`
```

## Exemple

**Utilisateur :** Configurer Payload CMS pour un blog — collection d'articles avec texte enrichi, relation auteur, statut (brouillon/publié), génération automatique de slug, et une page Next.js qui récupère les articles publiés côté serveur.

**Résultat attendu :**
- `collections/Posts.ts` — configuration complète de la collection avec tous les champs, hooks pour le slug, revalidation afterChange
- `collections/Users.ts` — champ rôle (admin/éditeur/auteur)
- `payload.config.ts` — adaptateur Postgres, toutes les collections
- `app/(cms)/[[...segments]]/page.tsx` — route du panneau d'administration Payload
- `app/(app)/blog/page.tsx` — Server Component utilisant l'API locale
- `payload-types.ts` — généré (exécuter `payload generate:types`)

---
