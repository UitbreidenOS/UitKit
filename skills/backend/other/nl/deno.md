---
name: deno
description: "Deno 2 runtime: built-in TypeScript, permission model, deno.json config, npm compatibiliteit, standard library, Deno KV, Deno Deploy edge runtime, Fresh framework islands architectuur, en testing met Deno.test"
---

# Deno 2 Skill

## Wanneer activeren
- Startend nieuw TypeScript project en evalueren runtimes
- Bouwing veiligheid-gevoelig service waar granular permissions materie
- Deploy naar Deno Deploy (edge, global distributie)
- Gebruiken Fresh framework (Deno web framework)
- Werkend Deno KV (built-in key-value store, geen externe afhankelijkheid)
- Migreren klein Node.js script naar Deno
- Project gebruik `deno.json` of `import_map.json` in plaats `package.json`
- Gebruiker noem `deno run`, `deno task`, `deno deploy`, of `@std/` imports

## Wanneer NIET gebruiken
- Projecten al gebouwd op Node.js met diep native addon afhankelijkheden — migration kosten hoog
- Bun projecten — ander runtime, gebruik bun skill
- Cloudflare Workers — gebruik hono skill (Workers eigendom runtime)
- Projecten vereisen npm packages native bindings nog niet geport naar Deno
- Wanneer team geen Deno familiarity en deadline strak — Node.js ecosystem groter

Zie Deno documentatie voor complete setup en frameworks guide.

---
