---
name: svelte
description: "SvelteKit: file-based routing, server/client load functions, form actions, stores, Cloudflare Workers deployment, component patterns"
---

> 🇩🇪 Deutsche Version. [Englische Version](../svelte.md).

# Skill: SvelteKit

## Wann aktivieren
- Erstellen einer SvelteKit-Anwendung (full-stack oder statisch)
- Schreiben von Svelte-Komponenten (reaktive Deklarationen, Stores, Animationen)
- Einrichten von Server-Load-Funktionen und Formular-Actions
- Deployment von SvelteKit auf Cloudflare Workers oder Vercel
- Auswahl zwischen SvelteKit und Next.js für ein Projekt

## Wann NICHT verwenden
- React-Ökosystem-Projekte — die React-Kompetenz verwenden
- Wenn Ihr Team vollständig React ist und ein Wechsel kostspielig wäre
- Komplexe Enterprise-Apps, wo Next.js-Ökosystem-Unterstützung wichtiger ist

## Anweisungen

### Projekt-Setup

```bash
npm create svelte@latest my-app
# Options: SvelteKit demo / Skeleton / Library
# TypeScript: Yes
# ESLint + Prettier: Yes

npm install
npm run dev
```

### Dateistruktur

```
src/
├── routes/
│   ├── +layout.svelte        # Root-Layout
│   ├── +layout.server.ts     # Root-Server-Load
│   ├── +page.svelte          # / Route
│   ├── +page.server.ts       # Server-Load + Actions für /
│   ├── blog/
│   │   ├── +page.svelte      # /blog
│   │   └── [slug]/
│   │       ├── +page.svelte  # /blog/[slug]
│   │       └── +page.server.ts
│   └── api/
│       └── users/
│           └── +server.ts    # API-Endpoint
├── lib/
│   ├── components/
│   ├── stores/
│   └── utils/
└── app.html                  # HTML-Hülle
```

### Svelte-Komponenten

```svelte
<!-- Counter.svelte -->
<script lang="ts">
  // Reaktive Deklarationen
  let count = $state(0)               // Svelte 5: Runes
  let doubled = $derived(count * 2)  // berechnet

  // Oder Svelte-4-Stil:
  // let count = 0
  // $: doubled = count * 2

  function increment() { count++ }
</script>

<button onclick={increment}>
  Count: {count} (doubled: {doubled})
</button>
```

### Server-Load-Funktionen

```typescript
// src/routes/blog/[slug]/+page.server.ts
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals }) => {
  const post = await db.posts.findBySlug(params.slug)
  if (!post) error(404, 'Post not found')

  return {
    post,
    // Nur zurückgeben, was die Seite braucht — keine sensiblen Daten
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

### Formular-Actions (Mutationen)

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

### Stores (gemeinsamer Zustand)

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

### API-Endpoints

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

### Cloudflare Workers Deployment

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
// src/hooks.server.ts — auf Cloudflare Bindings zugreifen
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // Auf KV, R2, D1 von Cloudflare Workers zugreifen
  const { env } = event.platform ?? {}
  event.locals.kv = env?.MY_KV

  return resolve(event)
}
```

## Beispiel

**Benutzer:** Eine SvelteKit-App mit Authentifizierung (über locals), einem geschützten Dashboard, einem Kontaktformular mit serverseitiger Validierung und Deployment auf Cloudflare Pages erstellen.

**Erwartete Ausgabe:**
- `src/hooks.server.ts` — Session-Validierung aus Cookie, `locals.user` setzen
- `src/routes/dashboard/+layout.server.ts` — Weiterleitung zu /login wenn kein Benutzer
- `src/routes/contact/+page.server.ts` — Formular-Action mit Zod-Validierung + fail()
- `svelte.config.js` — Cloudflare-Adapter
- `src/routes/+layout.svelte` — Navigation mit `$page.data.user`-Prüfung

---
