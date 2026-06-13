---
name: payload-cms
description: "Payload CMS: TypeScript-first headless CMS, collection schemas, access control, hooks, REST+GraphQL APIs, Next.js App Router integration"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../payload-cms.md).

# Skill: Payload CMS

## Wanneer activeren
- Bouwen van een Next.js-app die een contentmanagementsysteem nodig heeft
- Instellen van getypeerde inhoudsverzamelingen (blogberichten, producten, pagina's)
- Implementeren van toegangscontrole op veldniveau (alleen admin, auteur kan eigen inhoud bewerken)
- Gebruik van Payload-hooks om neveneffecten bij documentwijzigingen te activeren
- Migreren van een SaaS-CMS (Contentful, Sanity) naar een zelf-gehoste oplossing

## Wanneer NIET gebruiken
- Eenvoudige statische sites met markdown-bestanden — gebruik Astro + inhoudsverzamelingen
- Niet-TypeScript-projecten — Payload is TypeScript-first
- Wanneer u een visuele drag-and-drop paginabuilder nodig heeft — gebruik Webflow of Builder.io

## Instructies

### Installatie (met Next.js)

```bash
npx create-payload-app@latest my-app
# Template: Website / E-commerce / Blank
# Database: MongoDB / PostgreSQL
# TypeScript: Yes (default)
```

### Verzamelingsschema

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
    read:   () => true,          // openbaar
    create: isAuthenticated,      // ingelogd
    update: isAuthorOrAdmin,      // eigen berichten of admin
    delete: isAdmin,              // alleen admin
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

### Toegangscontrole-helpers

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
  return { author: { equals: user.id } }  // beperkingsgebaseerde toegang
}
```

### Hooks — neveneffecten activeren

```typescript
// hooks worden voor/na documentoperaties uitgevoerd
export const Posts: CollectionConfig = {
  // ...
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Automatisch slug genereren vanuit titel
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
        // Revalidatie activeren wanneer bericht wordt gepubliceerd
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
        // Gerelateerde inhoud opruimen
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
// of: import { postgresAdapter } from '@payloadcms/db-postgres'
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

### Next.js App Router-integratie

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
    depth: 2,  // relaties oplossen
  })

  if (!docs[0]) notFound()
  const post = docs[0]

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Lexical rich text renderen */}
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

### Lokale API vs. REST vs. GraphQL

```typescript
// Lokale API (snelst — geen HTTP-overhead, gebruik in Server Components)
const payload = await getPayload({ config })
const post = await payload.findByID({ collection: 'posts', id })

// REST API (van client of externe services)
const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts?where[status][equals]=published`)
const { docs } = await res.json()

// GraphQL (voor complexe queries)
const query = `
  query { Posts(where: { status: { equals: published } }) {
    docs { id title slug author { name } }
  }}
`
```

## Voorbeeld

**Gebruiker:** Payload CMS instellen voor een blog — berichtenverzameling met rich text, auteursrelatie, status (concept/gepubliceerd), automatische slug-generatie en een Next.js-pagina die gepubliceerde berichten server-side ophaalt.

**Verwachte output:**
- `collections/Posts.ts` — volledige verzamelingsconfiguratie met alle velden, hooks voor slug, afterChange-revalidatie
- `collections/Users.ts` — rolveld (admin/redacteur/auteur)
- `payload.config.ts` — Postgres-adapter, alle verzamelingen
- `app/(cms)/[[...segments]]/page.tsx` — Payload-beheerderspaneelroute
- `app/(app)/blog/page.tsx` — Server Component met lokale API
- `payload-types.ts` — gegenereerd (uitvoeren: `payload generate:types`)

---
