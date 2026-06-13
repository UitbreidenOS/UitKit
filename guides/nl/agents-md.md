# AGENTS.md Gids

AGENTS.md is een gezelschap voor CLAUDE.md — het maakt je projectinstructies draagbaar naar alle AI-coderingassistenten, niet alleen Claude Code.

## Wat is AGENTS.md?

Terwijl `CLAUDE.md` Claude Code-specifiek is, is `AGENTS.md` een community-conventie voor agentoverschrijdende compatibiliteit. Hetzelfde project kan worden gebruikt met:
- Claude Code (`CLAUDE.md`)
- Cursor (leest `AGENTS.md` of `cursor.md`)
- OpenAI Codex CLI
- Gemini CLI
- Elke agent die de AGENTS.md-conventie volgt

## CLAUDE.md vs AGENTS.md

| | CLAUDE.md | AGENTS.md |
|---|---|---|
| **Leest het** | Alleen Claude Code | Claude Code + Cursor + Codex + andere |
| **Locatie** | Projectroot | Projectroot |
| **Claude Code-prioriteit** | Primair | Secundair (CLAUDE.md heeft voorrang) |
| **Indeling** | Markdown | Markdown |
| **Doel** | Claude-specifieke context | Universele agentcontext |

## AGENTS.md maken

Houd het gericht op wat elke AI-coderingassistent moet kunnen op uw project — geen Claude-specifieke functies:

```markdown
# AGENTS.md

## Projectoverzicht
[2-3 zinnen: wat dit project doet, wie het serveert]

## Tech Stack
- Taal: [TypeScript 5.4]
- Framework: [Next.js 15, App Router]
- Database: [PostgreSQL via Drizzle ORM]
- Auth: [Better Auth]
- Implementatie: [Railway]

## Opdrachten
- Dev: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`
- Lint: `npm run lint`
- DB migratie: `npx drizzle-kit migrate`

## Belangrijke mappen
- `src/app/` — Next.js App Router-pagina's
- `src/components/` — Gedeelde UI-componenten
- `src/lib/` — Hulpprogramma's en helpers
- `src/db/` — Databaseschema en query's

## Codeertconventies
- TypeScript strict mode — geen `any`
- Servercomponenten standaard; `use client` alleen indien nodig
- Conventionele commits: feat/fix/chore/docs/refactor
- Tests vereist voor nieuwe bedrijfslogica

## Niet wijzigen
- `src/db/schema.ts` — coördineer schemawijzigingen met het team
- `.env.example` — bijwerken bij toevoeging van nieuwe env-variabelen
- `src/middleware.ts` — coördineer auth-wijzigingen

## Veel voorkomende taken
- Een API-route toevoegen: maak `src/app/api/[name]/route.ts`
- Een component toevoegen: maak in `src/components/[name].tsx`
- Databasequery: voeg toe aan `src/db/queries/[entity].ts`
```

## Wat op te nemen vs. uit te sluiten

**Opnemen:**
- Build- en testcommando's
- Mappenstructuur en doel
- Codeertconventies die op alle agenten van toepassing zijn
- Bestanden die zonder coördinatie niet mogen worden gewijzigd

**Uitsluiten:**
- Claude Code-specifieke functies (hooks, agenten, `/skills`) → in CLAUDE.md zetten
- Geheimen of inloggegevens → nooit in een gevolgd bestand
- Dingen die al duidelijk zijn uit de code

## AGENTS.md automatisch genereren

Vraag Claude Code om het te genereren:

```
"Lees het project en genereer een AGENTS.md-bestand.
Focus op: tech stack, belangrijke mappen, commando's, conventies en wat niet aan te raken.
Houd het onder 80 regels — beknopt genoeg zodat elke agent het volledig leest."
```

## Het gesynchroniseerd houden

AGENTS.md moet worden bijgewerkt wanneer:
- De tech stack verandert (framework-upgrade, nieuwe service)
- Nieuwe ontwikkelaars of agenten aan het project deelnemen
- Belangrijke mappen worden herstructureerd
- Commando's veranderen (test-runner, buildproces)

Voeg een herinnering toe aan uw CLAUDE.md:
```markdown
## Onderhoud
Bij wijziging van tech stack of commando's: werk zowel CLAUDE.md als AGENTS.md bij
```

## Relatie met CLAUDE.md

Een typisch project heeft beide:
- **AGENTS.md**: universele context (80 regels, gericht op wat elke agent nodig heeft)
- **CLAUDE.md**: Claude-specifieke toevoegingen (te laden hooks, te gebruiken agenten, Claude Code-specifieke patronen)

CLAUDE.md kan naar AGENTS.md verwijzen:
```markdown
# CLAUDE.md

Zie AGENTS.md voor projectoverzicht, stack en commando's.

## Claude Code specifiek
- Laad /skills/backend/nodejs/nextjs bij sessiestart
- Voer /ship-gate uit vóór elke productie-implementatie
- Gebruik /agents/advisors/cto-advisor voor architectuurvragen
```

---
