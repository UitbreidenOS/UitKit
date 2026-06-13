---
name: payload-cms
description: "Payload CMS: TypeScript-first headless CMS, collection schemas, access control, hooks, REST+GraphQL APIs, Next.js App Router integration"
---

> 🇪🇸 Versión en español. [Versión en inglés](../payload-cms.md).

# Habilidad Payload CMS

## Cuándo activar
- Construyendo una aplicación Next.js que necesita un sistema de gestión de contenidos
- Configurando colecciones de contenido tipadas (publicaciones de blog, productos, páginas)
- Implementando control de acceso a nivel de campo (solo admin, el autor puede editar sus propios contenidos)
- Usando los hooks de Payload para activar efectos secundarios en cambios de documentos
- Migrando desde un CMS SaaS (Contentful, Sanity) a una solución auto-hospedada

## Cuándo NO usar
- Sitios estáticos simples con archivos markdown — usar Astro + colecciones de contenido
- Proyectos no-TypeScript — Payload es TypeScript-first
- Cuando necesita un constructor de páginas visual de arrastrar y soltar — usar Webflow o Builder.io

## Instrucciones

### Instalación (con Next.js)

```bash
npx create-payload-app@latest my-app
# Template: Website / E-commerce / Blank
# Database: MongoDB / PostgreSQL
# TypeScript: Yes (default)
```

### Esquema de colección

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
    read:   () => true,          // público
    create: isAuthenticated,      // con sesión iniciada
    update: isAuthorOrAdmin,      // propios artículos o admin
    delete: isAdmin,              // solo admin
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

### Helpers de control de acceso

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
  return { author: { equals: user.id } }  // acceso basado en restricciones
}
```

### Hooks — activar efectos secundarios

```typescript
// los hooks se ejecutan antes/después de las operaciones en documentos
export const Posts: CollectionConfig = {
  // ...
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-generar slug desde el título
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
        // Activar revalidación cuando se publica la publicación
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
        // Limpiar contenido relacionado
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
// o: import { postgresAdapter } from '@payloadcms/db-postgres'
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

### Integración con Next.js App Router

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
    depth: 2,  // resolver relaciones
  })

  if (!docs[0]) notFound()
  const post = docs[0]

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Renderizar texto enriquecido Lexical */}
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

### API local vs. REST vs. GraphQL

```typescript
// API local (más rápida — sin sobrecarga HTTP, usar en Server Components)
const payload = await getPayload({ config })
const post = await payload.findByID({ collection: 'posts', id })

// API REST (desde el cliente o servicios externos)
const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts?where[status][equals]=published`)
const { docs } = await res.json()

// GraphQL (para consultas complejas)
const query = `
  query { Posts(where: { status: { equals: published } }) {
    docs { id title slug author { name } }
  }}
`
```

## Ejemplo

**Usuario:** Configurar Payload CMS para un blog — colección de publicaciones con texto enriquecido, relación de autor, estado (borrador/publicado), generación automática de slug y una página Next.js que obtiene publicaciones publicadas en el servidor.

**Resultado esperado:**
- `collections/Posts.ts` — configuración completa de colección con todos los campos, hooks para slug, revalidación afterChange
- `collections/Users.ts` — campo de rol (admin/editor/autor)
- `payload.config.ts` — adaptador Postgres, todas las colecciones
- `app/(cms)/[[...segments]]/page.tsx` — ruta del panel de administración Payload
- `app/(app)/blog/page.tsx` — Server Component usando la API local
- `payload-types.ts` — generado (ejecutar `payload generate:types`)

---
