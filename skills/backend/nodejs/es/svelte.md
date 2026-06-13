---
name: svelte
description: "SvelteKit: file-based routing, server/client load functions, form actions, stores, Cloudflare Workers deployment, component patterns"
---

> 🇪🇸 Versión en español. [Versión en inglés](../svelte.md).

# Habilidad SvelteKit

## Cuándo activar
- Construyendo una aplicación SvelteKit (full-stack o estática)
- Escribiendo componentes Svelte (declaraciones reactivas, stores, animaciones)
- Configurando funciones de carga de servidor y acciones de formulario
- Desplegando SvelteKit en Cloudflare Workers o Vercel
- Eligiendo entre SvelteKit y Next.js para un proyecto

## Cuándo NO usar
- Proyectos del ecosistema React — usar la habilidad React
- Cuando su equipo es completamente React y cambiar sería costoso
- Aplicaciones empresariales complejas donde el soporte del ecosistema Next.js importa más

## Instrucciones

### Configuración del proyecto

```bash
npm create svelte@latest my-app
# Options: SvelteKit demo / Skeleton / Library
# TypeScript: Yes
# ESLint + Prettier: Yes

npm install
npm run dev
```

### Estructura de archivos

```
src/
├── routes/
│   ├── +layout.svelte        # layout raíz
│   ├── +layout.server.ts     # carga de servidor raíz
│   ├── +page.svelte          # ruta /
│   ├── +page.server.ts       # carga de servidor + acciones para /
│   ├── blog/
│   │   ├── +page.svelte      # /blog
│   │   └── [slug]/
│   │       ├── +page.svelte  # /blog/[slug]
│   │       └── +page.server.ts
│   └── api/
│       └── users/
│           └── +server.ts    # endpoint API
├── lib/
│   ├── components/
│   ├── stores/
│   └── utils/
└── app.html                  # estructura HTML
```

### Componentes Svelte

```svelte
<!-- Counter.svelte -->
<script lang="ts">
  // Declaraciones reactivas
  let count = $state(0)               // Svelte 5: runes
  let doubled = $derived(count * 2)  // calculado

  // O estilo Svelte 4:
  // let count = 0
  // $: doubled = count * 2

  function increment() { count++ }
</script>

<button onclick={increment}>
  Count: {count} (doubled: {doubled})
</button>
```

### Funciones de carga de servidor

```typescript
// src/routes/blog/[slug]/+page.server.ts
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals }) => {
  const post = await db.posts.findBySlug(params.slug)
  if (!post) error(404, 'Post not found')

  return {
    post,
    // Solo exponer lo que la página necesita — no devolver datos sensibles
  }
}
```

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<article>
  <h1>{data.post.title}</h1>
  <div>{@html data.post.content}</div>
</article>
```

### Acciones de formulario (mutaciones)

```typescript
// src/routes/contact/+page.server.ts
import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
})

export const actions: Actions = {
  default: async ({ request }) => {
    const data = Object.fromEntries(await request.formData())
    const parsed = schema.safeParse(data)

    if (!parsed.success) {
      return fail(422, { errors: parsed.error.flatten(), values: data })
    }

    await sendEmail(parsed.data)
    redirect(303, '/thank-you')
  },
}
```

```svelte
<!-- src/routes/contact/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms'
  let { form } = $props()
</script>

<form method="POST" use:enhance>
  <input name="email" type="email" />
  {#if form?.errors?.fieldErrors?.email}
    <p class="error">{form.errors.fieldErrors.email}</p>
  {/if}
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>
```

### Stores (estado compartido)

```typescript
// src/lib/stores/cart.ts
import { writable, derived } from 'svelte/store'

interface CartItem { id: string; name: string; price: number; qty: number }

function createCart() {
  const { subscribe, update, set } = writable<CartItem[]>([])

  return {
    subscribe,
    addItem: (item: CartItem) => update(items => {
      const existing = items.find(i => i.id === item.id)
      if (existing) {
        return items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...items, { ...item, qty: 1 }]
    }),
    removeItem: (id: string) => update(items => items.filter(i => i.id !== id)),
    clear: () => set([]),
  }
}

export const cart = createCart()
export const cartTotal = derived(cart, $cart =>
  $cart.reduce((sum, item) => sum + item.price * item.qty, 0)
)
```

### Endpoints de API

```typescript
// src/routes/api/users/+server.ts
import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.session) return json({ error: 'Unauthorized' }, { status: 401 })

  const page = parseInt(url.searchParams.get('page') ?? '1')
  const users = await db.users.findMany({ skip: (page - 1) * 20, take: 20 })
  return json({ users })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const body = await request.json()
  const user = await db.users.create({ data: body })
  return json(user, { status: 201 })
}
```

### Despliegue en Cloudflare Workers

```bash
npm install -D @sveltejs/adapter-cloudflare
```

```typescript
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ routes: { include: ['/*'], exclude: ['<all>'] } }),
  },
}
```

```typescript
// src/hooks.server.ts — acceder a bindings de Cloudflare
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // Acceder a KV, R2, D1 desde Cloudflare Workers
  const { env } = event.platform ?? {}
  event.locals.kv = env?.MY_KV

  return resolve(event)
}
```

## Ejemplo

**Usuario:** Construir una app SvelteKit con autenticación (usando locals), un panel protegido, un formulario de contacto con validación del lado del servidor y despliegue en Cloudflare Pages.

**Resultado esperado:**
- `src/hooks.server.ts` — validación de sesión desde cookie, establecer `locals.user`
- `src/routes/dashboard/+layout.server.ts` — redirigir a /login si no hay usuario
- `src/routes/contact/+page.server.ts` — acción de formulario con validación Zod + fail()
- `svelte.config.js` — adaptador Cloudflare
- `src/routes/+layout.svelte` — navegación con verificación de `$page.data.user`

---
