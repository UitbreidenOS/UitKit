---
name: sveltekit
description: "SvelteKit full-stack framework: file-based routing, server en universal load functions, form actions met progressive enhancement, hooks, route groups, adapters, en REST endpoints via +server.ts"
---

# SvelteKit Skill

## Wanneer activeren
- Bouwing full-stack SvelteKit applicatie (niet enkel Svelte componenten)
- Setup file-based routing met `+page.svelte`, `+page.server.ts`, `+layout.svelte`
- Schrijven server load functions of universal load functions
- Implementeren form actions (standaard of benoemd) met `use:enhance`
- Schrijven `hooks.server.ts` (`handle`, `handleFetch`, `handleError`)
- Maken REST endpoints via `+server.ts`
- Beschermen routes met route groepen zoals `(auth)`
- Kiezen en configureren adapter (Vercel, Cloudflare, Node)
- Gebruiken `$app/stores` (`page`, `navigating`, `updated`)

## Wanneer NIET gebruiken
- Pure Svelte component vragen geen SvelteKit routing of server context — gebruik svelte skill
- React of Next.js projecten — gebruik nextjs skill
- Statisch sites geen server-side data nodig — gebruik Astro
- Projecten waar team toegewijd React en wissel niet optie

Zie SvelteKit documentatie voor complete implementatie voorbeelden en patterns.

---
