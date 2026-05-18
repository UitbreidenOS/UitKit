> 🇳🇱 Nederlandse versie. [Engelse versie](../claude-md-architecture.md).

# CLAUDE.md-architectuurgids

Hoe `CLAUDE.md` te structureren voor projecten van elke omvang — van solo-repositories tot grote monorepos met meerdere teams.

---

## Waarvoor CLAUDE.md is

`CLAUDE.md` is het projectgeheugen van Claude Code. Het laadt automatisch in elke sessie en vertelt Claude:
- Wat deze codebase is en hoe deze gestructureerd is
- Hoe deze te draaien, testen en deployen
- Regels en conventies die altijd van toepassing zijn
- Wat NIET te doen

Een goede `CLAUDE.md` elimineert herhaalde instructies. Een slechte wordt genegeerd, is te lang of weerspreekt wat Claude al weet.

---

## De drie niveaus

Claude Code leest drie CLAUDE.md-bestanden, samengevoegd in volgorde (later overschrijft eerder):

```
~/.claude/CLAUDE.md           # User-level: your personal preferences across all projects
{project-root}/CLAUDE.md      # Project-level: checked into the repo, applies to everyone
{project-root}/.claude/       # Local-level (gitignored): your overrides for this project
```

**Gebruikersniveau** — uw persoonlijke regels: gewenste antwoordstijl, tools die u altijd wilt, opmaakvoorkeuren. Niet ingecheckt.

**Projectniveau** — de gedeelde regels van het team: hoe het project te draaien, coderingconventies, verboden gebieden. Ingecheckt in git.

**Lokaal niveau** — uw persoonlijke overschrijvingen voor dit specifieke project: persoonlijke API-sleutels, work-in-progress-instructies, dingen die nog niet klaar zijn om met het team te delen.

---

## CLAUDE.md-sjabloon

Dit is de structuur die voor de meeste projecten werkt. Kopieer en vul uw details in.

```markdown
# {Project Name}

{One sentence describing what this project does and who it's for.}

---

## Architecture

{Describe the high-level architecture in 3–5 sentences. What are the main components? How do they interact?}

### Directory structure
{Show the important directories and what lives there. Skip boilerplate.}

---

## Key commands

{The commands developers run every day. Be exact — copy-paste ready.}

\`\`\`bash
{dev-start}   # Start development server
{test}        # Run the test suite
{lint}        # Run linter
{build}       # Production build
\`\`\`

---

## Conventions

### Code style
{Describe the style conventions that aren't enforced by the linter — naming patterns, file organisation, patterns to follow.}

### Patterns to use
{Describe the architectural patterns in use. E.g., "Use the repository pattern for all data access" or "Server Components by default, Client Components only when interactive."}

### Patterns to avoid
{Describe common mistakes or anti-patterns that apply to this specific codebase. E.g., "Never call the DB from a route handler — use a service layer."}

---

## What not to touch

{List files, directories, or systems Claude should not modify without explicit instruction.}

- `migrations/` — never edit migration files; create new ones with the migration CLI
- `public/vendor/` — third-party files, don't edit

---

## Testing

{Describe how tests are organised and what kind of coverage is expected.}

\`\`\`bash
{test-unit}          # Run unit tests
{test-integration}   # Run integration tests
{test-e2e}           # Run end-to-end tests
\`\`\`

Test files live next to source files: `foo.ts` → `foo.test.ts`.

---

## Environment

{List required env vars and how to get them.}

\`\`\`bash
DATABASE_URL=...   # PostgreSQL connection string — see 1Password > {vault name}
API_KEY=...        # {service name} API key — see .env.example
\`\`\`

Start local services: \`docker compose up -d\`
```

---

## Maatgevingsgids

| Projectomvang | CLAUDE.md-omvang | Wat op te nemen |
|---|---|---|
| Solo, eenvoudig | 20–50 regels | Sleutelbevelen, hoofdconventies, "niet aanraken"-lijst |
| Team, enkele service | 50–150 regels | Volledig sjabloon hierboven |
| Multi-service | 150–300 regels | Architectuuroverzicht + aanwijzers per service |
| Monorepo | 100–200 regels in root + CLAUDE.md per pakket | Root = globale regels, pakketten = lokale regels |

**Harde limiet:** Houd CLAUDE.md onder de 500 regels. Daarboven wordt het ruis. Regels die niet worden gevolgd, helpen niet.

---

## Monorepo-structuur

Gebruik voor monorepos meerdere CLAUDE.md-bestanden — een in de root en een in elk pakket met eigen conventies.

```
repo/
├── CLAUDE.md                 # Global: shared conventions, monorepo tooling, workspace commands
├── packages/
│   ├── api/
│   │   └── CLAUDE.md         # API-specific: FastAPI patterns, DB access, auth
│   ├── web/
│   │   └── CLAUDE.md         # Frontend-specific: Next.js patterns, component rules
│   └── shared/
│       └── CLAUDE.md         # Shared lib: what this exports, how to add to it
└── infra/
    └── CLAUDE.md             # Infra-specific: Terraform conventions, cloud setup
```

**Root-CLAUDE.md** behandelt:
- Wat de monorepo bevat en hoe pakketten zich verhouden
- Workspace-commando's (`npm run build --workspace=api`)
- Gedeelde conventies (commit-formaat, branch-naamgeving, PR-proces)
- Pakketoverschrijdende afhankelijkheden en wat is toegestaan

**Pakket-CLAUDE.md** behandelt:
- Alleen wat verschilt van de root
- Pakketspecifieke patronen en anti-patronen
- Lokale commando's en teststrategie

---

## Regels die werken

### Schrijf regels als beperkingen, niet als verzoeken
```markdown
# Bad (ignored)
Please try to use the service layer for database access.

# Good (followed)
Never call the database from a controller or route handler.
All DB access must go through a service in src/services/.
```

### Wees specifiek, niet generiek
```markdown
# Bad (Claude already knows this)
Write clean, readable code.
Follow best practices.
Use meaningful variable names.

# Good (project-specific)
Use snake_case for Python, camelCase for TypeScript.
All public functions must have type annotations.
Never use `Any` — use `Unknown` or define the type.
```

### Leg het *waarom* uit voor niet-vanzelfsprekende regels
```markdown
# Bad (mysterious)
Don't use the UserService from the AuthModule.

# Good (explains the constraint)
Don't import from AuthModule in other modules — it creates circular dependencies.
Use the shared UserRepository from @/shared/db instead.
```

### De "niet aanraken"-lijst is dragend
```markdown
## Do not modify
- `src/generated/` — auto-generated from the OpenAPI spec, run `npm run generate` to update
- `migrations/` — create new migrations with `npm run migration:create`, never edit existing ones
- `public/service-worker.js` — generated by the build, do not edit directly
```

---

## Anti-patronen

**Te lang.** Als uw CLAUDE.md 500+ regels heeft, behandelt Claude de onderste helft als context met lage prioriteit. Meedogenloos snoeien — elke regel moet dragend zijn.

**Dupliceren van wat de linter afdwingt.** Geen regels documenteren die ESLint of Prettier al afdwingen. Als de tool het opvangt, hoeft Claude het niet te weten.

**Generiek advies.** "Schrijf tests voor alle nieuwe features" — Claude weet dit al. Schrijf regels die specifiek zijn voor de conventies van *uw* project.

**Verouderde instructies.** Een verouderde CLAUDE.md die beschrijft hoe het project *vroeger* werkte is erger dan geen CLAUDE.md. Herzie het bij grote refactors.

**Tegenstrijdige regels.** "Gebruik altijd TypeScript" in de root-CLAUDE.md en "Python heeft de voorkeur" in de service-CLAUDE.md zal Claude verwarren. Maak de hiërarchie duidelijk.

---

## CLAUDE.md bijwerken

**Na een refactor:** de sectie directorystructuur bijwerken en alle anti-patronen die zijn veranderd.

**Na het inwerken van een nieuw teamlid:** vraag wat hen in verwarring bracht. Hun verwarringspunten wijzen op ontbrekende CLAUDE.md-inhoud.

**Na een herhaalde fout:** als u Claude tweemaal voor hetzelfde corrigeert, voeg een regel toe. Als u een regel toevoegt en deze opnieuw wordt overtreden, maak haar sterker — verplaats naar boven, maak het een beperking in plaats van een voorkeur.

**Kwartaalreview:** lees het hele bestand, verwijder alles wat verouderd is, voeg alles toe uit recente sessies dat u blijft herhalen.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
