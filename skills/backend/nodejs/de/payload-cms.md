---
name: payload-cms
description: "Payload CMS: TypeScript-first headless CMS, collection schemas, access control, hooks, REST+GraphQL APIs, Next.js App Router integration"
---

> 🇩🇪 Deutsche Version. [Englische Version](../payload-cms.md).

# Skill: Payload CMS

## Wann aktivieren
- Erstellen einer Next.js-App, die ein Content-Management-System benötigt
- Einrichten typisierter Inhaltssammlungen (Blog-Artikel, Produkte, Seiten)
- Implementieren von feldbasierter Zugriffskontrolle (nur Admin, Autor kann eigene Inhalte bearbeiten)
- Verwenden von Payload-Hooks, um Nebeneffekte bei Dokumentänderungen auszulösen
- Migration von einem SaaS-CMS (Contentful, Sanity) zu einer selbst gehosteten Lösung

## Wann NICHT verwenden
- Einfache statische Sites mit Markdown-Dateien — Astro + Inhaltssammlungen verwenden
- Nicht-TypeScript-Projekte — Payload ist TypeScript-first
- Wenn Sie einen visuellen Drag-and-Drop-Seitenersteller benötigen — Webflow oder Builder.io verwenden

## Anweisungen

### Installation (mit Next.js)

```bash
npx create-payload-app@latest my-app
# Template: Website / E-commerce / Blank
# Database: MongoDB / PostgreSQL
# TypeScript: Yes (default)
```

### Sammlungsschema

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
    read:   () => true,          // öffentlich
    create: isAuthenticated,      // eingeloggt
    update: isAuthorOrAdmin,      // eigene Artikel oder Admin
    delete: isAdmin,              // nur Admin
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

### Zugriffssteuerungs-Helfer

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
  return { author: { equals: user.id } }  // einschränkungsbasierter Zugriff
}
```

### Hooks — Nebeneffekte auslösen

```typescript
// Hooks laufen vor/nach Dokumentoperationen
export const Posts: CollectionConfig = {
  // ...
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Slug automatisch aus dem Titel generieren
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
        // Revalidierung auslösen, wenn Artikel veröffentlicht wird
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
        // Verwandte Inhalte bereinigen
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
// oder: import { postgresAdapter } from '@payloadcms/db-postgres'
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

### Next.js App Router Integration

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
    depth: 2,  // Beziehungen auflösen
  })

  if (!docs[0]) notFound()
  const post = docs[0]

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Lexical-Rich-Text rendern */}
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
// Lokale API (am schnellsten — kein HTTP-Overhead, in Server Components verwenden)
const payload = await getPayload({ config })
const post = await payload.findByID({ collection: 'posts', id })

// REST API (vom Client oder externen Diensten)
const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts?where[status][equals]=published`)
const { docs } = await res.json()

// GraphQL (für komplexe Abfragen)
const query = `
  query { Posts(where: { status: { equals: published } }) {
    docs { id title slug author { name } }
  }}
`
```

## Beispiel

**Benutzer:** Payload CMS für einen Blog einrichten — Artikelsammlung mit Rich Text, Autorenbeziehung, Status (Entwurf/veröffentlicht), automatische Slug-Generierung und eine Next.js-Seite, die veröffentlichte Artikel serverseitig abruft.

**Erwartete Ausgabe:**
- `collections/Posts.ts` — vollständige Sammlungskonfiguration mit allen Feldern, Hooks für Slug, afterChange-Revalidierung
- `collections/Users.ts` — Rollenfeld (admin/Redakteur/Autor)
- `payload.config.ts` — Postgres-Adapter, alle Sammlungen
- `app/(cms)/[[...segments]]/page.tsx` — Payload-Admin-Panel-Route
- `app/(app)/blog/page.tsx` — Server Component mit lokaler API
- `payload-types.ts` — generiert (Befehl ausführen: `payload generate:types`)

---
