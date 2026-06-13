---
name: sveltekit
description: "Framework full-stack SvelteKit: enrutamiento basado en archivo, funciones load del servidor y universal, acciones de formulario con mejora progresiva, hooks, grupos de ruta, adaptadores, y puntos finales REST a través de +server.ts"
---

# Habilidad de SvelteKit

## Cuándo activar
- Construyendo una aplicación full-stack SvelteKit (no solo componentes Svelte)
- Configurando enrutamiento basado en archivo con `+page.svelte`, `+page.server.ts`, `+layout.svelte`
- Escribiendo funciones de carga del servidor o funciones de carga universal
- Implementando acciones de formulario (predeterminadas o nombradas) con `use:enhance`
- Escribiendo `hooks.server.ts` (`handle`, `handleFetch`, `handleError`)
- Creando puntos finales REST a través de `+server.ts`
- Protegiendo rutas con grupos de ruta como `(auth)`
- Eligiendo y configurando un adaptador (Vercel, Cloudflare, Node)
- Usando `$app/stores` (`page`, `navigating`, `updated`)

## Cuándo NO usar
- Preguntas de componente Svelte puro sin enrutamiento SvelteKit o contexto de servidor — usa la habilidad svelte
- Proyectos React o Next.js — usa la habilidad nextjs
- Sitios estáticos sin necesidades de datos del lado del servidor — usa Astro
- Proyectos donde el equipo está comprometido a React y cambiar no es una opción

## Instrucciones

### Configuración del proyecto

```bash
npm create svelte@latest my-app
# Elige: aplicación SvelteKit (no librería)
# TypeScript: Sí
# ESLint + Prettier: Sí
cd my-app && npm install && npm run dev
```

### Estructura de enrutamiento basada en archivo

```
src/
├── routes/
│   ├── +layout.svelte          # diseño raíz — envuelve todas las páginas
│   ├── +layout.server.ts       # carga del servidor raíz — ejecuta en cada solicitud
│   ├── +page.svelte            # / (inicio)
│   ├── +page.server.ts         # carga del servidor + acciones para /
│   ├── (auth)/                 # grupo de ruta — no añade segmento de URL
│   │   ├── +layout.server.ts   # guardia: redirige si no está conectado
│   │   ├── dashboard/
│   │   │   └── +page.svelte
│   │   └── settings/
│   │       └── +page.svelte
│   ├── blog/
│   │   ├── +page.svelte        # /blog
│   │   └── [slug]/
│   │       ├── +page.svelte    # /blog/[slug]
│   │       └── +page.server.ts
│   └── api/
│       └── users/
│           └── +server.ts      # punto final REST — no es una página
├── lib/
│   ├── components/
│   ├── server/                 # importaciones solo del servidor (nunca enviadas al cliente)
│   │   ├── db.ts
│   │   └── auth.ts
│   └── utils.ts
└── hooks.server.ts             # middleware de servidor global
```

### Funciones de carga: servidor vs universal

```typescript
// +page.server.ts — CARGA DEL SERVIDOR
// Se ejecuta solo en el servidor. Puede acceder a BD, secretos, cookies.
// El valor de retorno se serializa y se envía a la página.
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
  if (!locals.user) error(401, 'Not authenticated')

  const post = await db.post.findUnique({ where: { slug: params.slug } })
  if (!post) error(404, 'Post not found')

  return { post }   // solo datos serializables — sin instancias de clase, sin funciones
}
```

```typescript
// +page.ts — CARGA UNIVERSAL
// Se ejecuta en servidor (solicitud inicial) Y cliente (navegación).
// No puede acceder a BD o secretos directamente — debe llamar a una API.
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, params }) => {
  const res = await fetch(`/api/posts/${params.slug}`)
  if (!res.ok) throw new Error('Post not found')
  return { post: await res.json() }
}
```

Regla: usa `+page.server.ts` cuando necesites BD o autenticación. Usa `+page.ts` solo cuando tengas una API pública y necesites re-obtención en el cliente en navegación.

```svelte
<!-- +page.svelte — consumiendo datos de carga -->
<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<h1>{data.post.title}</h1>
<p>{data.post.body}</p>
```

### Acciones de formulario

```typescript
// src/routes/posts/new/+page.server.ts
import type { Actions, PageServerLoad } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(10),
})

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(303, '/login')
  return {}
}

export const actions: Actions = {
  // Acción predeterminada — se llama cuando el formulario no tiene atributo `action`
  default: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { message: 'Not authenticated' })

    const data = Object.fromEntries(await request.formData())
    const parsed = PostSchema.safeParse(data)

    if (!parsed.success) {
      return fail(422, {
        errors: parsed.error.flatten().fieldErrors,
        values: data,      // devuelve valores para que el formulario pueda rellenarse
      })
    }

    const post = await db.post.create({
      data: { ...parsed.data, authorId: locals.user.id },
    })

    redirect(303, `/blog/${post.slug}`)
  },

  // Acción nombrada — <form action="?/draft">
  draft: async ({ request, locals }) => {
    const data = Object.fromEntries(await request.formData())
    await db.post.create({ data: { ...data, published: false, authorId: locals.user.id } })
    return { saved: true }
  },
}
```

```svelte
<!-- src/routes/posts/new/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms'
  let { form } = $props()
</script>

<!-- use:enhance — mejora progresiva: funciona sin JS, se mejora con ello -->
<form method="POST" use:enhance>
  <label>
    Title
    <input name="title" value={form?.values?.title ?? ''} />
    {#if form?.errors?.title}
      <span class="error">{form.errors.title[0]}</span>
    {/if}
  </label>

  <label>
    Body
    <textarea name="body">{form?.values?.body ?? ''}</textarea>
    {#if form?.errors?.body}
      <span class="error">{form.errors.body[0]}</span>
    {/if}
  </label>

  <button type="submit">Publish</button>
  <button type="submit" formaction="?/draft">Save draft</button>
</form>
```

`use:enhance` intercepta el envío del formulario, maneja la respuesta a través de JavaScript y actualiza el prop `form` — sin recarga de página completa. Vuelve a envío de formulario nativo si JS no está disponible.

### Hooks: hooks.server.ts

```typescript
// src/hooks.server.ts
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

// handle — se ejecuta en cada solicitud del servidor (como middleware)
const authHandle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session')

  if (token) {
    const user = await validateSession(token)
    event.locals.user = user ?? null
  } else {
    event.locals.user = null
  }

  return resolve(event)
}

const corsHandle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)
  // Agrega encabezados a todas las respuestas
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  return response
}

// sequence() encadena múltiples funciones handle
export const handle = sequence(authHandle, corsHandle)

// handleFetch — intercepta llamadas fetch del lado del servidor (p. ej. en funciones load)
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
  // Adjunta autenticación a llamadas fetch del lado del servidor saliente
  request.headers.set('Authorization', `Bearer ${process.env.INTERNAL_API_KEY}`)
  return fetch(request)
}

// handleError — se llama cuando un error inesperado alcanza el servidor
export const handleServerError: HandleServerError = async ({ error, event }) => {
  console.error('Unhandled error:', error, event.url.pathname)
  return { message: 'An unexpected error occurred' }
}
```

Declara el tipo `locals` en `src/app.d.ts`:

```typescript
// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      user: { id: string; email: string; role: string } | null
    }
    interface Error {
      message: string
    }
  }
}
export {}
```

### Grupos de ruta: rutas protegidas (auth)

```typescript
// src/routes/(auth)/+layout.server.ts
// Cada ruta dentro de (auth)/ hereda esta guardia
import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(303, '/login')
  return { user: locals.user }
}
```

El nombre de la carpeta `(auth)` no aparece en la URL. `/dashboard`, `/settings` y `/profile` están todos protegidos sin ningún boilerplate por página.

### Puntos finales REST: +server.ts

```typescript
// src/routes/api/users/+server.ts
import type { RequestHandler } from './$types'
import { json, error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) error(401, 'Unauthorized')

  const page = Number(url.searchParams.get('page') ?? 1)
  const users = await db.user.findMany({ skip: (page - 1) * 20, take: 20 })
  return json({ users, page })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  if (locals.user?.role !== 'admin') error(403, 'Forbidden')

  const body = await request.json()
  const user = await db.user.create({ data: body })
  return json(user, { status: 201 })
}
```

### Tiendas SvelteKit ($app/stores)

```svelte
<script lang="ts">
  import { page, navigating, updated } from '$app/stores'

  // page — URL actual, ruta, params, datos, estado, formulario
  $: currentPath = $page.url.pathname
  $: user = $page.data.user          // datos desde carga de diseño raíz
  $: routeId = $page.route.id        // p. ej. '/blog/[slug]'

  // navigating — no nulo mientras una navegación está en progreso
  $: isLoading = $navigating !== null

  // updated — verdadero cuando una nueva versión de aplicación se implementa
  // Encuesta: updated.check() — devuelve verdadero si existe una nueva versión
</script>

{#if $navigating}
  <div class="progress-bar" />
{/if}

<nav>
  <a href="/" class:active={currentPath === '/'}>Home</a>
  {#if $page.data.user}
    <a href="/dashboard">Dashboard</a>
  {:else}
    <a href="/login">Login</a>
  {/if}
</nav>
```

### Adaptadores

```bash
# Vercel (auto-detecta proyectos SvelteKit)
npm install -D @sveltejs/adapter-vercel

# Cloudflare Pages
npm install -D @sveltejs/adapter-cloudflare

# Node.js (auto-alojado, Docker)
npm install -D @sveltejs/adapter-node
```

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel'    // cambia según sea necesario
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // Vercel: sin configuración
    // Cloudflare: adapter({ routes: { include: ['/*'], exclude: ['<all>'] } })
    // Node: adapter({ out: 'build' }) — luego `node build`
  },
}
```

El adaptador de Cloudflare da acceso a vinculaciones de Workers:

```typescript
// src/hooks.server.ts (Cloudflare)
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const { env } = event.platform ?? {}    // vinculaciones de Cloudflare
  event.locals.kv = env?.MY_KV
  event.locals.db = env?.MY_D1
  return resolve(event)
}
```

## Ejemplo

**Usuario:** Construye una aplicación de blog CRUD autenticada en SvelteKit. Los usuarios deben iniciar sesión para crear o editar publicaciones. La lista de publicaciones es pública. Usa acciones de formulario con validación, no fetch del lado del cliente.

**Salida esperada:**

- `src/hooks.server.ts` — lee cookie de sesión, configura `locals.user`
- `src/app.d.ts` — declara `App.Locals` con tipo `user`
- `src/routes/(auth)/+layout.server.ts` — redirige usuarios no autenticados a `/login`
- `src/routes/login/+page.server.ts` — acción predeterminada: verifica credenciales, configura cookie, redirige
- `src/routes/login/+page.svelte` — formulario de inicio de sesión con `use:enhance`, muestra errores desde `form`
- `src/routes/blog/+page.server.ts` — carga del servidor devolviendo todas las publicaciones publicadas (público)
- `src/routes/blog/+page.svelte` — renderiza lista de publicaciones, muestra enlace "Nueva publicación" si `$page.data.user`
- `src/routes/(auth)/blog/new/+page.server.ts` — carga (guardia de autenticación heredada), acción `default` con validación Zod + `fail()`, en éxito `redirect(303, '/blog')`
- `src/routes/(auth)/blog/new/+page.svelte` — formulario con `use:enhance`, vuelve a rellenar valores y muestra errores de campo desde `form`
- `src/routes/(auth)/blog/[id]/edit/+page.server.ts` — carga obtiene publicación y verifica propiedad, acciones nombradas `update` y `delete`
- `svelte.config.js` — adapter-vercel (o adapter-node para Docker)

---
