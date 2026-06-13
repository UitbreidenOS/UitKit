# Team Onboarding

## Wanneer activeren

- Gebruiker voert `/team-onboarding` uit
- Gebruiker vraagt om een onboarding-document te genereren voor een nieuw teamlid of contractant
- Gebruiker wil projectcontext vastleggen voor een ontwikkelaar die bij het project aansluit
- Gebruiker wil een "begin hier"-document dat setup tot eerste implementatie behandelt
- AI-ondersteunde onboarding instellen voor een team waar nieuwe leden Claude Code gebruiken

## Wanneer niet gebruiken

- Het project heeft al een actuele `ONBOARDING.md` of equivalent — bestaand document updaten in plaats van opnieuw genereren
- Het verzoek betreft algemeen HR-onboarding van bedrijven — deze vaardigheid dekt alleen technische project-onboarding
- Gebruiker wil een README — een README is openbaar ; onboarding-documenten zijn intern, opinieërd, en veronderstellen dat de lezer repo-toegang heeft

## Instructies

### Wat te genereren

Het onboarding-document dekt alles wat een ontwikkelaar moet weten om van nul tot eerste commit te gaan. Secties:

1. **Projectoverzicht** — Wat het doet, wie het gebruikt, en waarom het bestaat (max 2–4 zinnen)
2. **Tech Stack** — Framework, taal, runtime, database, cache, queue — met exacte versienummers uit `package.json`, `pyproject.toml`, `go.mod`, of equivalent
3. **Lokale setup** — Stap-voor-stap commando's om te klonen, installeren, env configureren, gegevens laden, en dev-server uit te voeren ; elk commando moet kopieerbaar zijn
4. **Sleutel bestandslocaties** — Waar de belangrijke dingen zich bevinden: entry points, configuratie, routes, db-schema, tests, CI-configuratie
5. **Testen** — Hoe tests uit te voeren (unit, integration, e2e), wat de coverage-drempel is, hoe een enkel testbestand uit te voeren
6. **Implementatie** — Hoe staging- en productie-implementaties werken, wie ze kan triggeren, wat de rollback-procedure is
7. **Teamconventies** — Branch-naming, commit-formaat, PR-proces, wie wat beoordeelt, code-stijlafdwinging
8. **Claude Code-configuratie** — Welke vaardigheden actief zijn in `.claude/skills/`, welke agents beschikbaar zijn, welke MCP-servers zijn geconfigureerd, nuttige slash commands voor dit project

### Hoe informatie in te winnen

Deze bestanden lezen voordat u genereert:

```
README.md                  — projectbeschrijving, snelstart
package.json / pyproject.toml / go.mod / Cargo.toml — versies, scripts, afhankelijkheden
CLAUDE.md                  — teamconventies, Claude-configuratie
Makefile                   — beschikbare commando's
docker-compose.yml         — services, poorten, omgeving
.env.example               — vereiste omgevingsvariabelen
.github/workflows/         — CI/CD-pipeline, testcommando's, deployment-triggers
src/ of app/               — entry points, structuur op topniveau
```

Geen informatie verzinnen. Als het bronbestand van een sectie niet bestaat of de relevante informatie niet bevat, een placeholder schrijven als `[TODO: deploymentproces toevoegen]` in plaats van raden.

### Uitvoerformaat

Uitvoer: één Markdown-document. Geen HTML, geen front matter.

Structuur:
```markdown
# Projectnaam — Developer Onboarding

> Een-zins beschrijving van wat het project doet.

## Vereisten
## Lokale setup
## Tech Stack
## Sleutel bestandslocaties
## Tests uitvoeren
## Implementatie
## Teamconventies
## Claude Code-configuratie
## Hulp krijgen
```

Scanbaar houden. Code-blokken voor elk commando gebruiken. Tabellen voor tech stack en bestandslocaties gebruiken. Doelduur: 2–4 pagina's bij afdrukken.

### Waar op te slaan

In deze volgorde controleren:
1. Als `docs/`-directory bestaat → opslaan in `docs/onboarding.md`
2. Als `ONBOARDING.md` al bestaat → ter plaatse bijwerken
3. Standaard → opslaan als `ONBOARDING.md` bij projectwortel

Na opslaan, de gebruiker het bestandspad vertellen en suggereren het toe te voegen aan controlelijst voor nieuwe medewerkers of een gepinde Slack/Notion-link.

### De Claude Code Config-sectie invullen

`.claude/` lezen om deze sectie in te vullen:

```bash
ls .claude/skills/     # actieve vaardigheden weergeven → slash commands documenteren
ls .claude/agents/     # agents weergeven → documenteren wanneer elk agent te gebruiken
cat .claude/settings.json  # MCP-servers, hooks, auto-goedkeuringen
```

Formatteren als snelle referentietabel:

| Slash-commando | Wat het doet |
|---|---|
| `/graphql-client` | Apollo Client met codegen instellen |
| `/db-specialist` | Complexe queryoptimalisatie delegeren naar DB-agent |
| `/pr-review` | Geautomatiseerde PR-review uitvoeren voor samensmelting |

## Voorbeeld

`/team-onboarding` uitvoeren op een Next.js + Drizzle + Vercel-project.

Claude leest: `package.json` (Next.js 15, Drizzle ORM 0.30, TypeScript 5.4), `docker-compose.yml` (PostgreSQL 16 op poort 5432), `.env.example` (DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY), `Makefile` (dev, test, migrate, seed-targets), `.github/workflows/deploy.yml` (Vercel-preview op PR, productie op samensmelting naar main), `CLAUDE.md` (squash-merge-beleid, conventionele commits, PR vereist 1 goedkeuring).

Gegenereerde `docs/onboarding.md` bevat:

```markdown
# Acme App — Developer Onboarding

> B2B SaaS voor factuurbeheer — Next.js 15 frontend, Drizzle ORM + PostgreSQL backend, geïmplementeerd op Vercel.

## Vereisten
- Node.js 20+
- Docker Desktop (voor lokale PostgreSQL)
- Vercel CLI: `npm i -g vercel`

## Lokale setup
\`\`\`bash
git clone git@github.com:org/acme-app.git
cd acme-app
npm install
cp .env.example .env.local        # DATABASE_URL en NEXTAUTH_SECRET invullen
docker compose up -d               # start PostgreSQL op localhost:5432
npm run db:migrate                 # alle migrations toepassen
npm run db:seed                    # dev-fixtures laden
npm run dev                        # http://localhost:3000
\`\`\`

## Tech Stack
| Laag | Technologie | Versie |
|---|---|---|
| Framework | Next.js (App Router) | 15.1.0 |
| Taal | TypeScript | 5.4.5 |
| ORM | Drizzle ORM | 0.30.9 |
| Database | PostgreSQL | 16 |
| Auth | NextAuth.js | 5.0.0-beta |
| Email | Resend | 3.2.0 |
| Implementatie | Vercel | — |

...
```

Het volledige document loopt ongeveer 3 pagina's en behandelt alles van eerste kloon tot eerste samengesmolten PR.

---
