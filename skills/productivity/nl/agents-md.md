---
name: agents-md
description: "Genereer AGENTS.md voor cross-agent portabiliteit (Claude Code, Cursor, Codex, Gemini CLI). Tool-agnostisch repodocument, anders dan CLAUDE.md."
---

# AGENTS.md Writer

## Wanneer activeren

- Gebruiker wil dat de repo consistent werkt op meerdere AI-codeertools (Claude Code, Cursor, Codex, Gemini CLI)
- Een nieuwe repo instellen voor AI-ondersteunde ontwikkeling en behoefte aan één gedeeld contextdocument
- CLAUDE.md bestaat maar is Claude Code-specifiek en andere tools krijgen inconsistente resultaten
- Team standaardiseert op een tool-agnostische AI-contextconventie
- Na een CLAUDE.md-audit wanneer u de tool-agnostische subset wilt extraheren

## Wanneer niet gebruiken

- Het project gebruikt alleen Claude Code — CLAUDE.md is het juiste document, niet AGENTS.md
- De repo heeft een bestaande AGENTS.md die gewoon moet worden bijgewerkt (gebruik de context-auditor-prompt om CLAUDE.md in te korten en wijzigingen te spiegelen)
- MCP-configuraties, hook-scripts of slash command-definities — deze zijn Claude Code-specifiek en horen niet in AGENTS.md

## Instructies

### AGENTS.md vs CLAUDE.md

| CLAUDE.md | AGENTS.md |
|---|---|
| Claude Code-specifiek | Werkt met elk AI-coderingstool |
| Kan hooks, MCP, slash commands referentiëren | Tool-agnostisch — geen Claude-functies |
| Kan uitgebreid zijn (eenmaal per sessie geladen) | Moet beknopt zijn (<400 regels) |
| Projectregels + Claude-gedrag | Projectconventies + agent-veiligheidsregels |
| Eigendom van Claude Code-gebruikers | Eigendom van elk AI-ondersteund team |

De twee bestanden kunnen naast elkaar bestaan. AGENTS.md is de superset van wat alle tools delen; CLAUDE.md voegt Claude Code-specifieke extensies daar bovenop toe.

### AGENTS.md-structuur

Elke AGENTS.md moet deze secties in volgorde bevatten:

**1. Projectoverzicht**
Twee tot vier zinnen. Wat het project doet, wie het bedient, welk probleem het oplost. Geen marketingtaal.

**2. Tech Stack**
Opgesomde lijst: taal + versie, framework + versie, grote bibliotheken, database, hosting/infrastructuur.
Alleen wat eigenlijk in de repo is — geen aspiratieve toevoegingen.

**3. Sleutelconventies**
De regels die elke ontwikkelaar (of AI-agent) moet volgen om acceptabele code te produceren. Trek uit:
- Bestaande CLAUDE.md als aanwezig
- Lint-configuratie (`.eslintrc`, `pyproject.toml`, `rubocop.yml`)
- README
- Patronen waargenomen in bestaande codebase

Includeren: naamconventies, bestandsorganisatie, patronen om te gebruiken, patronen om te vermijden.

**4. Agentgedragsregels**
Instructies speciaal voor AI-agenten:
- Commando's veilig uit te voeren zonder te vragen: tests, linting, formattering, type checking
- Commando's waarvoor menselijke confirmatie nodig is: deploy, migrate, publish, drop, truncate, restart
- Beleid bestandscreatie: vragen voor het maken van nieuwe bestanden vs. eerst bewerken
- Commit-beleid: vragen voor commit vs. autonome commits toegestaan
- Bereikdiscipline: wat de agent NIET moet doen, zelfs als het nuttig lijkt

**5. Bestandsveiligheidstabel**
Een tabel die paden op risico classificeert:

| Pad / Patroon | Status | Opmerkingen |
|---|---|---|
| `src/`, `lib/`, `app/` | VEILIG | Functiecode — normaal bewerken |
| `tests/`, `spec/`, `__tests__/` | VEILIG | Tests — vrij wijzigen |
| `docs/` | VEILIG | Documentatie |
| `prisma/migrations/`, `db/migrate/` | VOORZICHTIG | Alleen met goedkeuring uitvoeren |
| `src/auth/`, `src/payments/` | VOORZICHTIG | Beveiligingsgevoelig — markeren voor wijziging |
| `.env`, `*.secret`, `credentials.*` | GEVAARLIJK | Nooit lezen of wijzigen |
| `Dockerfile`, `.github/workflows/` | GEVAARLIJK | Infrastructuur — goedkeuring vereist |
| `dist/`, `build/`, `.next/` | GEVAARLIJK | Gegenereerd — niet rechtstreeks bewerken |

**6. Testcommando's**
Exacte commando's gekopieerd van `package.json`-scripts, Makefile of CI-configuratie. Geen parafrase.

```
Test:    npm test
Lint:    npm run lint
Typecheck: npm run typecheck
Format:  npm run format
```

### Wat van AGENTS.md moet worden uitgesloten

- Claude Code-hooks (`PreToolUse`, `PostToolUse`, `Stop`)
- MCP-serverconfiguraties
- Claude slash command-definities
- Modelrichtlijnen (Haiku vs Sonnet vs Opus)
- Instructies verwijzend naar Claude-specifieke functies (Agent-tool, /compact, geheugenbestanden)
- Interne teamnamen, Jira-ticketnummers, persoonlijke voorkeuren

Deze horen alleen in CLAUDE.md.

### AGENTS.md genereren

Gebruik de prompt `prompts/task-specific/agents-md-generator.md` voor een volledig geautomatiseerde generatiepass. De vaardigheid hier behandelt het formaat; de prompt behandelt de aanroeping.

## Voorbeeld

**Project:** Next.js 14 SaaS-app met Prisma + PostgreSQL, gedeployed op Vercel.

Gegenereerd AGENTS.md-fragment:

```markdown
# AGENTS.md

## Projectoverzicht
Een multi-tenant SaaS-dashboard voor het volgen van softwareleverings metriek.
Gebouwd voor engineeringteams van 5–50 mensen. Kernwaarde: antwoorden op
"hoe snel leveren we en waar zitten we vast" in onder 30 seconden.

## Tech Stack
- TypeScript 5.4
- Next.js 14 (App Router)
- Prisma 5 + PostgreSQL 16
- Tailwind CSS 3.4
- Vercel (hosting + Edge Functions)
- Vitest (unit), Playwright (e2e)

## Sleutelconventies
- Alle componenten: PascalCase, één component per bestand
- Alle hulpprogramma's: camelCase-functies, kebab-case-bestandsnamen
- Geen barrel-exports (geen index.ts re-exports)
- Server Components standaard; voeg 'use client' alleen toe wanneer nodig
- Databasequery's alleen in `src/lib/db/` — nooit rechtstreeks in componenten of API-routes
- Geen `any`-typen — gebruik `unknown` + type guard als vorm onzeker is

## Agentgedragsregels
Veilig autonoom uit te voeren: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format`
Vereist confirmatie: `prisma migrate deploy`, `vercel --prod`, alle `DROP`-SQL
Vragen voor het maken van nieuwe bestanden in: `src/lib/db/`, `prisma/migrations/`
Niet autonoom committen — wijzigingen altijd eerst ter review presenteren

## Bestandsveiligheidstabel
| Pad | Status | Opmerkingen |
|---|---|---|
| `src/components/` | VEILIG | |
| `src/app/` | VEILIG | |
| `src/lib/` | VOORZICHTIG | Kernbedrijfslogica |
| `prisma/migrations/` | GEVAARLIJK | Nooit bestaande migraties wijzigen |
| `.env*` | GEVAARLIJK | Nooit lezen of schrijven |
| `.github/` | GEVAARLIJK | CI/CD — goedkeuring vereist |

## Testcommando's
pnpm test          # Vitest-unit tests
pnpm test:e2e      # Playwright end-to-end
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
```

---
