# Documentatiesite (Astro + Starlight) — Projectstructuur

> Voor developer documentatieteams die MDX-gebaseerde referentiedocumentatie uitbrengen op Astro 4 + Starlight, geoptimaliseerd voor de schrijf-preview-implementeer workflow met full-text zoeken en geautomatiseerde linkverificatie.

## Stack

- **Framework:** Astro 4.x met Starlight 0.23+ (documentatiethema)
- **Taal:** TypeScript 5.4+
- **Inhoudsformaat:** MDX (`.mdx`) met Astro content collections
- **Zoeken:** Algolia DocSearch (crawler-gebaseerd, gratis voor openbare docs)
- **Pakketbeheerder:** npm 10+ (of pnpm 9+)
- **Implementatie:** Vercel (statische site-uitvoer, edge CDN)
- **CI/CD:** GitHub Actions (`build-check.yml`, `broken-links.yml`)
- **Linkverificatie:** Playwright 1.44+ (crawlt gerenderde site op 404-fouten)
- **Componentbibliotheek:** Aangepaste MDX-componenten — `Callout`, `CodeTabs`, `Steps`, `ApiRef`
- **Syntaxaccentuering:** Shiki (ingebouwd in Starlight) met aangepast thema
- **Sitemap:** `@astrojs/sitemap` (automatisch gegenereerd, gebruikt door Algolia-crawler)

## Mapstructuur

```
docs-site/                                    # Astro + Starlight documentatiewortel
├── .claude/
│   ├── CLAUDE.md                             # Instructies op reponiteau voor Claude Code
│   ├── settings.json                         # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── new-doc.md                        # /new-doc — steigers een nieuwe MDX-pagina met frontmatter
│       ├── add-callout.md                    # /add-callout — voeg getypte callout-blok in op cursor
│       ├── check-links.md                    # /check-links — voer Playwright-linkchecker lokaal uit
│       ├── rebuild-index.md                  # /rebuild-index — trigger Algolia-crawler via API
│       └── update-sidebar.md                 # /update-sidebar — voeg navigatie-ingang toe aan astro.config.mjs
├── .github/
│   └── workflows/
│       ├── build-check.yml                   # Bouw Astro-site op elke PR; faalt op TS-fouten
│       └── broken-links.yml                  # Playwright-crawl van preview-URL; blokkeert merge op 404-fouten
├── src/
│   ├── content/
│   │   ├── config.ts                         # Astro content collection-schemadefinities
│   │   └── docs/                             # Alle documentatiepagina's leven hier
│   │       ├── getting-started/
│   │       │   ├── index.mdx                 # Landingspagina: wat het product is + quickstart
│   │       │   ├── installation.mdx          # Installatiesstappen met CodeTabs voor npm/pnpm/yarn
│   │       │   ├── authentication.mdx        # Auth-instelling — API-sleutels, OAuth, omgevingsvars
│   │       │   └── first-request.mdx         # End-to-end hello-world met uitvoerbaar fragment
│   │       ├── guides/
│   │       │   ├── index.mdx                 # Gidsen-landingspagina met kaartrooster
│   │       │   ├── error-handling.mdx
│   │       │   ├── pagination.mdx
│   │       │   ├── rate-limiting.mdx
│   │       │   ├── webhooks.mdx
│   │       │   └── sdk-migration.mdx         # Bijwerken tussen SDK-grote versies
│   │       ├── api-reference/
│   │       │   ├── index.mdx                 # API-overzicht: basis-URL, versiebeheer, auth-koptekst
│   │       │   ├── endpoints/
│   │       │   │   ├── users.mdx             # /users — CRUD-bewerkingen met request/response-tabbladen
│   │       │   │   ├── organizations.mdx
│   │       │   │   ├── webhooks.mdx
│   │       │   │   └── events.mdx
│   │       │   ├── objects/
│   │       │   │   ├── user-object.mdx       # Volledige veld-voor-veld-referentie met types
│   │       │   │   ├── error-object.mdx
│   │       │   │   └── pagination-object.mdx
│   │       │   └── errors.mdx                # Volledige HTTP-foutcodestabel
│   │       └── tutorials/
│   │           ├── index.mdx                 # Tutorials-landingspagina
│   │           ├── build-a-dashboard.mdx     # Multi-stap met Steps-component
│   │           ├── sync-with-webhook.mdx
│   │           └── migrate-from-v1.mdx       # Migratiegids met diff-stijlcodeblokken
│   ├── components/
│   │   ├── Callout.astro                     # Getypte callout-rendering: note | warning | danger | tip
│   │   ├── CodeTabs.astro                    # Taalwisselaar-codeblok (npm/pnpm/curl enz.)
│   │   ├── Steps.astro                       # Genummerde stappenlijst met automatische teller
│   │   ├── ApiRef.astro                      # Eindpuntsignatuurblok: methodebadge + URL
│   │   ├── ParamTable.astro                  # Request/response-parametertabel met types
│   │   └── VersionBadge.astro                # "Toegevoegd in v2.3" badge-component
│   ├── assets/
│   │   ├── diagrams/
│   │   │   ├── auth-flow.svg                 # Auth-sequencediagram (bewerkbaar in Excalidraw)
│   │   │   ├── webhook-lifecycle.svg
│   │   │   └── data-model.svg
│   │   └── screenshots/
│   │       ├── dashboard-overview.png
│   │       └── api-key-screen.png
│   └── styles/
│       └── custom.css                        # CSS-aangepaste eigenschappen die Starlight-thema overschrijven
├── public/
│   ├── favicon.svg
│   ├── robots.txt                            # Sta alles toe; wijst naar sitemap.xml
│   └── og-image.png                          # OpenGraph-afbeelding voor sociaal delen
├── tests/
│   └── links/
│       ├── broken-links.spec.ts              # Playwright: crawl sitemap, beweer geen 404/500
│       └── playwright.config.ts              # baseURL uit PLAYWRIGHT_BASE_URL omgevingsvar
├── scripts/
│   └── trigger-algolia-crawl.ts             # Raakt Algolia Crawler API aan om opnieuw in te dexen; uitvoeren post-deploy
├── astro.config.mjs                          # Starlight-config: zijbalk, Algolia, sociale links, i18n
├── tsconfig.json                             # Strikte TypeScript; padaliassen @components, @assets
├── package.json                              # Scripts: dev, build, preview, typecheck, test:links
├── .env.example                              # ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME
└── .env.local                                # Lokale overschrijvingen (gitignored)
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `astro.config.mjs` | Enige bron van waarheid voor Starlight: zijbalkboom, Algolia DocSearch-configuratiesleutels, sociale links, favicon, standaardlocale; zijbalkitems moeten overeenkomen met bestandsnamen in `src/content/docs/` |
| `src/content/config.ts` | Definieert het `docs` content collection-schema met `docsSchema()` van `@astrojs/starlight/schema`; breid hier uit om aangepaste frontmatter-velden toe te voegen zoals `version`, `status` of `apiMethod` |
| `src/components/Callout.astro` | Rendert gestileerde callout-blokken; accepteert `type` prop (`note` \| `warning` \| `danger` \| `tip`); gebruikt in MDX als `<Callout type="warning">tekst</Callout>` |
| `src/components/CodeTabs.astro` | Tabel-schakelend codeblok; accepteert een reeks `{ label, lang, code }` objecten; behoudt tabselectie in localStorage via `data-persist-tab`-attribuut |
| `src/components/Steps.astro` | Geordende lijst met CSS-teller reset; kinderen zijn gewone sleufinhoud; vermijdt handmatige nummering in MDX |
| `tests/links/broken-links.spec.ts` | Haalt `sitemap.xml`, extraheert alle `<loc>` URL's, bezoekt elk met Playwright, beweert `response.status() < 400`; voert uit tegen Vercel-preview-URL in CI |
| `scripts/trigger-algolia-crawl.ts` | POSTs naar `https://crawler.algolia.com/api/1/crawlers/{crawlerId}/reindex` met basisauthentificatie met `ALGOLIA_APP_ID` + `ALGOLIA_API_KEY`; voert uit na elke productie-implementatie |
| `.github/workflows/broken-links.yml` | Geactiveerd op `pull_request`; implementeert in Vercel preview via `vercel deploy --prebuilt`, stelt `PLAYWRIGHT_BASE_URL` in, voert `npm run test:links` uit; post resultaten als PR-controle |

## Snelle steiger

```bash
# Vereisten: Node 20+, npm 10+

# Maak Astro + Starlight project
npm create astro@latest docs-site -- --template starlight
cd docs-site

# Installeer Playwright voor linkcontrole
npm install --save-dev @playwright/test
npx playwright install chromium

# Installeer Algolia search (Starlight plugin)
npm install @astrojs/starlight

# Installeer sitemap-integratie (nodig voor Algolia-crawler en Playwright)
npm install @astrojs/sitemap

# Maak inhoudsmapstructuur
mkdir -p src/content/docs/getting-started
mkdir -p src/content/docs/guides
mkdir -p src/content/docs/api-reference/endpoints
mkdir -p src/content/docs/api-reference/objects
mkdir -p src/content/docs/tutorials

# Maak componentbestanden
mkdir -p src/components src/assets/diagrams src/assets/screenshots src/styles

touch src/components/Callout.astro
touch src/components/CodeTabs.astro
touch src/components/Steps.astro
touch src/components/ApiRef.astro
touch src/components/ParamTable.astro
touch src/components/VersionBadge.astro
touch src/styles/custom.css

# Maak Playwright-teststructuur
mkdir -p tests/links
touch tests/links/broken-links.spec.ts
touch tests/links/playwright.config.ts

# Maak post-deploy-scripts
mkdir -p scripts
touch scripts/trigger-algolia-crawl.ts

# Maak GitHub Actions-workflows
mkdir -p .github/workflows
touch .github/workflows/build-check.yml
touch .github/workflows/broken-links.yml

# Maak openbare assets
touch public/robots.txt public/og-image.png

# Maak Claude Code-config
mkdir -p .claude/commands
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-doc.md
touch .claude/commands/add-callout.md
touch .claude/commands/check-links.md
touch .claude/commands/rebuild-index.md
touch .claude/commands/update-sidebar.md

# Maak env-bestanden
touch .env.example .env.local

# Installeer Claudient-vaardigheden
npx claudient add skill productivity/doc-site-builder
npx claudient add skill devops-infra/cicd
npx claudient add skill devops-infra/vercel

echo "Astro + Starlight docs-site gesteigers. Voer uit: npm run dev"
```

## CLAUDE.md-sjabloon

```markdown
# Documentatiesite

Astro 4 + Starlight developer-documentatiesite. Inhoud leeft in src/content/docs/
als MDX-bestanden. Zijbalknavigatie is gedefinieerd in astro.config.mjs. Zoeken wordt aangedreven door
Algolia DocSearch (crawler-gebaseerd). Geïmplementeerd naar Vercel van de main-tak via GitHub Actions.

## Stack

- Astro 4.x + Starlight 0.23+ (documentatiethema)
- TypeScript 5.4 (strikte modus)
- MDX-inhoud met Astro content collections
- Aangepaste Astro-componenten: Callout, CodeTabs, Steps, ApiRef, ParamTable, VersionBadge
- Algolia DocSearch (index opnieuw opgebouwd via crawler API post-deploy)
- Vercel (statische uitvoer, preview-implementaties per PR)
- GitHub Actions: build-check.yml (TS + Astro build), broken-links.yml (Playwright)
- Playwright 1.44+ voor linkverificatie tegen preview-URL's

## Een nieuwe documentatiepagina toevoegen — exacte stappen

1. Maak het MDX-bestand in de juiste onderwerpmap onder src/content/docs/:
   - Concepten aan de slag → getting-started/
   - How-to gidsen → guides/
   - Eindpunt- en objectreferentie → api-reference/endpoints/ of api-reference/objects/
   - Stap-voor-stapwalkthroughs → tutorials/
2. Voeg vereiste frontmatter toe: title, description, sidebar.order (indien volgorde van belang is)
3. Voeg een zijbalkitem toe in astro.config.mjs onder starlight > sidebar > items
4. Gebruik de /new-doc schuine opdracht om frontmatter en sectiestructuur in te stellen
5. Voer npm run dev uit en verifieer dat pagina op het verwachte URL-pad wordt weergegeven
6. Voer npm run typecheck uit om TypeScript-fouten in MDX-componenten te detecteren

## MDX-componentbibliotheek

Alle componenten worden bovenaan het MDX-bestand geïmporteerd:
  import Callout from '@components/Callout.astro'
  import CodeTabs from '@components/CodeTabs.astro'
  import Steps from '@components/Steps.astro'

Callout-types: note | warning | danger | tip
  <Callout type="warning">Dit werkt niet in v2 — migreer vóór upgrade.</Callout>

CodeTabs — taalgelabelde tabbladen voor multi-taal-fragmenten:
  <CodeTabs tabs={[
    { label: "npm", lang: "bash", code: "npm install @acme/sdk" },
    { label: "pnpm", lang: "bash", code: "pnpm add @acme/sdk" },
    { label: "curl", lang: "bash", code: "curl https://api.acme.com/v1/users" }
  ]} />

Steps — auto-genummerde geordende lijst:
  <Steps>
    <p>Installeer de SDK.</p>
    <p>Stel uw API-sleutel in de omgeving in.</p>
    <p>Maak uw eerste verzoek.</p>
  </Steps>

ApiRef — eindpuntsignatuurkoptekst:
  <ApiRef method="POST" path="/v1/users" />

Gebruik GEEN onbewerkte HTML-geordende lijsten voor stappenreeksen — gebruik Steps.
Schrijf GEEN <div class="callout"> handmatig — gebruik Callout.

## Zijbalknavigatie-config

Zijbalk is geconfigureerd in astro.config.mjs binnen de starlight()-plugin:

  starlight({
    sidebar: [
      {
        label: 'Getting Started',
        items: [
          { label: 'Overview', link: '/getting-started/' },
          { label: 'Installation', link: '/getting-started/installation/' },
        ],
      },
      {
        label: 'API Reference',
        autogenerate: { directory: 'api-reference' },
      },
    ],
  })

Gebruik autogenerate voor grote secties (api-reference, tutorials).
Gebruik expliciete items[] voor secties waar volgorde van belang is (getting-started, guides).
sidebar.order frontmatter-veld regelt autogenerate-sorteer volgorde.

## Opdrachten uitvoeren

# Lokale dev-server met hot reload
npm run dev

# Volledige productie-build (vangt verbroken imports en TS-fouten)
npm run build

# Preview productie-build lokaal
npm run preview

# Type-controle zonder bouwen
npm run typecheck

# Voer Playwright broken-link checker uit tegen lokale preview
PLAYWRIGHT_BASE_URL=http://localhost:4321 npm run test:links

# Trigger Algolia reindex (vereist ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_CRAWLER_ID)
npx tsx scripts/trigger-algolia-crawl.ts

## Algolia-indexherstel

De Algolia DocSearch-index wordt opnieuw opgebouwd via de Algolia Crawler-API, niet de JavaScript-client.
Triggervoorwaarden:
- Automatisch: scripts/trigger-algolia-crawl.ts wordt uitgevoerd in broken-links.yml na productie-implementatie
- Handmatig: voer de /rebuild-index schuine opdracht uit of roep het script rechtstreeks aan
- Push inhoud NIET rechtstreeks naar de Algolia-index — laat de crawler het doen vanuit de live-site

Vereiste omgevingsvariabelen voor het script:
  ALGOLIA_APP_ID=xxx
  ALGOLIA_API_KEY=xxx          # Crawler API-sleutel, NIET de search-only frontend-sleutel
  ALGOLIA_CRAWLER_ID=xxx       # Gevonden in Algolia Crawler-dashboard
  ALGOLIA_INDEX_NAME=docs

## Implementatie

- Elke push naar main triggert automatisch Vercel-productie-implementatie
- Elke PR krijgt een Vercel preview-implementatie URL
- broken-links.yml wacht op preview-implementatie, voert dan Playwright tegen uit
- Merge een PR NIET als broken-links.yml faalt
- Productie-URL is ingesteld in PLAYWRIGHT_BASE_URL in broken-links.yml workflow

## Frontmatter-conventies

Elke pagina moet hebben:
  ---
  title: "Titel zoals deze in zijbalk en <h1> verschijnt"
  description: "Eén zin — weergegeven in zoekresultaten en OG-meta"
  ---

Optioneel:
  sidebar:
    order: 2                   # Regelt positie in autogenerate-groepen
    label: "Korte Zijbalknaam"  # Indien anders dan titel
  version: "2.1"               # API-versie die deze pagina documenteert

## Wat niet te doen

- Voeg GEEN zijbalkitems toe zonder een overeenkomend MDX-bestand — Starlight gooit op build
- Schrijf GEEN onbewerkte HTML-tabellen voor parameterdocs — gebruik ParamTable-component
- Plaats afbeeldingen NIET in src/content/ — plaats ze in src/assets/ en importeer ze in MDX
- Commit GEEN .env.local of bestand met echte Algolia API-sleutels
- Bewerk NIET handmatig de Algolia-index — alleen de crawler moet ernaar schrijven
```

## MCP-servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/docs-site/src"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

## Aanbevolen hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == *.mdx || \"$f\" == *.md ]]; then npx prettier --write --parser mdx \"$f\" 2>/dev/null || true; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */astro.config.mjs ]]; then echo \"[HOOK] astro.config.mjs changed — verify sidebar matches files in src/content/docs/ and run: npm run build\" >&2; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -q \"trigger-algolia-crawl\"; then echo \"[HOOK] Algolia reindex triggered — ensure the site is deployed and ALGOLIA_CRAWLER_ID is set\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden om te installeren

```bash
npx claudient add skill productivity/doc-site-builder
npx claudient add skill devops-infra/cicd
npx claudient add skill devops-infra/vercel
npx claudient add skill testing/playwright
```

## Verwant

- [Technisch Schrijven Gids](../guides/technical-writing.md)
- [Documentatie Workflow](../workflows/doc-publishing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
