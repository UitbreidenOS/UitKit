---
name: svelte
description: "SvelteKit: file-based routing, server/client load functions, form actions, stores, Cloudflare Workers deployment, component patterns"
---

> 🇫🇷 Version française. [English version](../svelte.md).

# Compétence SvelteKit

## Quand activer
- Construction d'une application SvelteKit (full-stack ou statique)
- Écriture de composants Svelte (déclarations réactives, stores, animations)
- Configuration des fonctions de chargement serveur et des actions de formulaire
- Déploiement de SvelteKit sur Cloudflare Workers ou Vercel
- Choix entre SvelteKit et Next.js pour un projet

## Quand NE PAS utiliser
- Projets de l'écosystème React — utilisez la compétence React
- Quand votre équipe est entièrement React et que le changement serait coûteux
- Applications d'entreprise complexes où le support de l'écosystème Next.js compte davantage

## Instructions

### Configuration du projet

```bash
npm create svelte@latest my-app
# Options: SvelteKit demo / Skeleton / Library
# TypeScript: Yes
# ESLint + Prettier: Yes

npm install
npm run dev
```

### Structure de fichiers

```
src/
├── routes/
│   ├── +layout.svelte        # mise en page racine
│   ├── +layout.server.ts     # chargement serveur racine
│   ├── +page.svelte          # route /
│   ├── +page.server.ts       # chargement serveur + actions pour /
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
└── app.html                  # structure HTML
```

### Composants Svelte

```svelte
<!-- Counter.svelte -->
<script lang="ts">
  // Déclarations réactives
  let count = $state(0)               // Svelte 5 : runes
  let doubled = $derived(count * 2)  // calculé

  // Ou style Svelte 4 :
  // let count = 0
  // $: doubled = count * 2

  function increment() { count++ }
</script>

<button onclick={increment}>
  Count: {count} (doubled: {doubled})
</button>
```

### Fonctions de chargement serveur

```typescript
// src/routes/blog/[slug]/+page.server.ts
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals }) => {
  const post = await db.posts.findBySlug(params.slug)
  if (!post) error(404, 'Post not found')

  return {
    post,
    // N'exposer que ce dont la page a besoin — ne pas retourner de données sensibles
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

### Actions de formulaire (mutations)

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

### Stores (état partagé)

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

### Endpoints API

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

### Déploiement Cloudflare Workers

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
// src/hooks.server.ts — accéder aux liaisons Cloudflare
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // Accéder à KV, R2, D1 depuis Cloudflare Workers
  const { env } = event.platform ?? {}
  event.locals.kv = env?.MY_KV

  return resolve(event)
}
```

## Exemple

**Utilisateur :** Construire une application SvelteKit avec authentification (via locals), un tableau de bord protégé, un formulaire de contact avec validation côté serveur, et déploiement sur Cloudflare Pages.

**Résultat attendu :**
- `src/hooks.server.ts` — validation de session depuis cookie, définir `locals.user`
- `src/routes/dashboard/+layout.server.ts` — rediriger vers /login si pas d'utilisateur
- `src/routes/contact/+page.server.ts` — action de formulaire avec validation Zod + fail()
- `svelte.config.js` — adaptateur Cloudflare
- `src/routes/+layout.svelte` — navigation avec vérification `$page.data.user`

---
