# Claude voor Software-engineers

Alles wat een Software-engineer of Full-Stack Developer nodig heeft om AI-ondersteunde functieontwikkeling, codebeoordelingen, foutopsporing, architectuurdocumentatie en technische besluitvorming uit te voeren in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een software-engineer, full-stack developer of technisch lead wiens taak het is om betrouwbare code te leveren — systemen ontwerpen, functies schrijven, PR's beoordelen, bugs oplossen en technische schuld voorkomen dat die zich opstapelt. Je besteedt te veel tijd aan het wisselen van context tussen tools, boilerplate schrijven en handmatig documentatie genereren. Claude Code vermindert die overhead met 20-40x.

**Voor Claude Code:** 45 minuten om een complexe PR te beoordelen. 2 uur om een productieprobleem te debuggen zonder een duidelijke stack trace. Architectuurbeslissingen worden weken later gedocumenteerd, als ze al gedocumenteerd worden. Het inwerken van een nieuw teamlid duurt een volledige week.

**Erna:** PR beoordeeld met inline-opmerkingen in minder dan 5 minuten. Grondoorzaak geïdentificeerd in één debugsessie. ADR's geschreven op het moment van de beslissing. Inwerkdocument gegenereerd vanuit de codebase in 30 seconden.

---

## Installatie in 30 seconden

```bash
# Installeer vaardigheidssets per discipline
npx claudient add skills backend
npx claudient add skills devops-infra
npx claudient add skills ai-engineering
npx claudient add skills database
npx claudient add skills productivity

# Of selecteer wat je nodig hebt:
npx claudient add skill backend/next-js
npx claudient add skill backend/fastapi
npx claudient add skill devops-infra/docker
npx claudient add skill devops-infra/kubernetes
npx claudient add skill devops-infra/terraform
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/pr-review
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/ship-gate
npx claudient add skill productivity/tech-debt-tracker
npx claudient add skill ai-engineering/claude-api
npx claudient add skill ai-engineering/rag-architect
npx claudient add skill ai-engineering/mcp-server-builder
npx claudient add skill database/drizzle
npx claudient add skill database/postgres
```

---

## Jouw Claude Code-engineeringstack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/next-js` | Next.js App Router-scaffolding, RSC-patronen, routering, API-routes, serveracties | Next.js-apps bouwen of uitbreiden |
| `/fastapi` | FastAPI-eindpuntgeneratie, Pydantic-schema's, afhankelijkheidsinjectie, achtergrondtaken | Python API-ontwikkeling |
| `/docker` | Dockerfile-authoring, meertraps-builds, Compose-bestanden, afbeeldingsoptimalisatie | Services containeriseren |
| `/kubernetes` | Manifestgeneratie, implementatiestrategieën, Helm-chart-beoordeling, resourcelimieten | K8s-configuratie en implementatiebeoordelingen |
| `/terraform` | Infrastructure-as-code-modules, planbeoordeling, beheer van status | Cloudinfrstructuur inrichten |
| `/code-review` | Grondige juistheidscontrole: bugs, logische fouten, randgevallen, beveiligingsproblemen | Je eigen code beoordelen voor push |
| `/debug` | Systematische grondoorzaakanalyse — stack traces, logs, hypothesen, reproductiestappen | Elke bug die in 10 minuten niet duidelijk is |
| `/refactor` | Gestructureerde refactoring met een voor/na-diff en testimpactanalyse | Code opschonen zonder gedrag te breken |
| `/pr-review` | PR-samenvatting, risicoclassificatie, generatie van inline-opmerkingen, samenvoegaanbeveling | Inkomende PR's beoordelen |
| `/adr-writer` | Architecture Decision Record genereren vanuit een context en beslissing | Architectuurkeuzes documenteren op het moment van beslissing |
| `/ship-gate` | Checklist vóór samenvoeging: tests, dekking, beveiliging, prestaties, documenten | Definitieve controle vóór samenvoeging naar main |
| `/tech-debt-tracker` | Technische schuld identificeren, categoriseren en prioriteren over een codebase | Kwartaalplanning voor schuld |
| `/claude-api` | Claude API- en Anthropic SDK-integratie met prompt-caching, tool use, streaming | Functies bouwen bovenop Claude |
| `/rag-architect` | RAG-pipeline-ontwerp: chunking, embeddings, ophaling, herordening | Functies voor kennisopvraging bouwen |
| `/mcp-server-builder` | Een Model Context Protocol-server opzetten en koppelen | Claude uitbreiden met aangepaste tools |
| `/drizzle` | Drizzle ORM-schemaontwerp, migraties, querygentratie, relaties | TypeScript-databasewerk |
| `/postgres` | Queryoptimalisatie, schemaontwerp, indexeringsstrategie, EXPLAIN-analyse | PostgreSQL-databasewerk |

### Agents

| Agent | Model | Wanneer inzetten |
|---|---|---|
| `core/architect` | Opus | Systeemontwerpbeslissingen, cross-service-architectuur, grote refactors |
| `core/code-reviewer` | Sonnet | Grondige PR-beoordeling, juistheidsaudits, logicaverificatie |
| `core/security-reviewer` | Sonnet | Beveiligingsaudits, afhankelijkheidsbeoordeling, dreigingsmodellering |
| `core/planner` | Sonnet | Epics opsplitsen in taken, sprintplanning, schatting |
| `roles/senior-backend` | Sonnet | Backend-implementatie, API-ontwerp, prestatieafstemming |
| `roles/senior-frontend` | Sonnet | UI/UX-implementatie, componentarchitectuur, toegankelijkheid |
| `roles/fullstack-developer` | Sonnet | Functies die frontend en backend overspannen met gedeelde types |
| `build-resolvers/typescript-resolver` | Haiku | TypeScript-compilatiefouten, type-inferentiefouten, tsconfig-problemen |
| `build-resolvers/python-resolver` | Haiku | Python-importfouten, afhankelijkheidsconflicten, virtual environment-problemen |

---

## Dagelijkse werkstroom

### Ochtend — context laden (10-15 minuten)

**1. Oriënteer je op wat er 's nachts is veranderd**
```
/pr-review

Geef een lijst van alle open PR's op main. Voor elk:
- Samenvatting van één regel van wat het doet
- Risicoclassificatie (laag / gemiddeld / hoog)
- Of het vandaag mijn beoordeling nodig heeft
```

**2. Laad context over je huidige functietak**
```
/adr-writer

Ik pak werk op aan [functienaam].
Hier is de tak-diff: [plak git diff of beschrijf de staat]

Vat samen wat er besloten is, wat er nog open staat,
en markeer beslissingen die ik moet nemen voordat ik meer code schrijf.
```

---

### Functieontwikkeling (doorlopend)

**3. Maak een nieuw eindpunt of component aan**
```
/fastapi

Voeg een POST /api/v1/documents/ingest eindpunt toe:
- Auth: Bearer token, valideren tegen gebruikerstabel
- Body: { source_url: str, metadata: dict }
- Achtergrondtaak: inhoud ophalen, chunken, embedden, opslaan in pgvector
- Antwoord: { job_id: uuid, status: "queued" }

Gebruik het bestaande afhankelijkheidsinjectiepatroon in app/dependencies.py.
```

**4. Beoordeel je eigen code voor het pushen**
```
/code-review

[plak de diff of beschrijf het bestand]

Controleer op:
- Juistheidsbugs en randgevallen
- SQL-injectie- of auth-bypass-risico's
- N+1-queries of ontbrekende indexen
- Ontbrekende foutafhandeling
- Elke logica die zal breken bij gelijktijdigheid
```

---

### PR-beoordeling (5-10 minuten per PR)

**5. Beoordeel een inkomende PR**
```
/pr-review

PR: [titel of link]
Auteur: [naam]
Diff:
[plak diff]

Geef me:
- Wat deze PR doet in 2-3 zinnen
- Risicoclassificatie en waarom
- Eventuele bugs of juistheidsproblemen
- Inline-opmerkingen die ik moet plaatsen
- Samenvoegaanbeveling
```

---

### Foutopsporing (op aanvraag)

**6. Diagnosticeer een bug systematisch**
```
/debug

Fout:
[plak stack trace of beschrijf het symptoom]

Context:
- Omgeving: [productie / staging / lokaal]
- Wanneer het begon: [implementatie, configuratiewijziging, datagebeurtennis]
- Frequentie: [elk verzoek / intermitterend / onder belasting]
- Wat ik al heb gecontroleerd: [lijst]

Begeleid me stap voor stap door de isolatie van de grondoorzaak.
```

---

### Architectuur en documentatie

**7. Documenteer een beslissing op het moment dat je die neemt**
```
/adr-writer

Beslissing: Overstap van REST naar tRPC voor interne servicecommunicatie
Context: We hebben 4 services die TypeScript-types delen. REST veroorzaakt drift.
Overwogen alternatieven: GraphQL, gRPC, gewone REST met gedeeld typespakket
Beslissing: tRPC — zelfde taal, nul schema-drift, type-veiligheid end-to-end
Gevolgen: Frontend-team moet bijwerken, alle bestaande REST-clients worden afgeschaft

Schrijf de ADR in standaardformaat.
```

**8. Wekelijkse sessie voor technische schuld**
```
/tech-debt-tracker

Scan de volgende bestanden/mappen op technische schuld:
[plak bestandslijst of beschrijf het gebied]

Categoriseer op:
- Juistheidsrisico (zal dit breken?)
- Snelheidsvertraging (vertraagt dit de ontwikkeling?)
- Beveiligingsblootstelling
- Onderhoudskosten

Geef voor elk item een geprioriteerde achterstandsvermelding.
```

---

## 30-daags ingroeiplan (engineers die nieuw zijn bij Claude Code)

### Week 1 — Installatie en eerste winsten
- Installeer alle vaardigheidssets: `npx claudient add skills backend devops-infra productivity`
- Configureer GitHub MCP (zie tool-integraties hieronder)
- Voer `/pr-review` uit op de laatste 5 samengevoegde PR's in je repository — kalibreer op de patronen van je codebase
- Gebruik `/debug` op de meest recente bug die je handmatig hebt opgelost — zie wat het sneller had kunnen oppakken
- Gebruik `/code-review` op je volgende PR voor het pushen — vind ten minste één probleem dat je had gemist

### Week 2 — Integratie in dagelijkse werkstroom
- Begin elke ochtend met een PR-wachtrij-scan met `/pr-review`
- Gebruik `/fastapi` of `/next-js` voor elk nieuw eindpunt of pagina-scaffold — geen leeg-pagina-syndroom
- Schrijf je eerste ADR met `/adr-writer` — elke beslissing die deze week wordt genomen, telt
- Voer `/ship-gate` uit op je volgende PR voor het aanvragen van beoordeling

### Week 3 — Diepere automatisering
- Stel de Sentry-hook in (zie tool-integraties hieronder) zodat bugcontext automatisch in Claude aankomt
- Voer `/tech-debt-tracker` uit op het deel van de codebase dat jij beheert
- Gebruik `core/architect` voor elke ontwerpbeslissing waarbij meer dan 2 services betrokken zijn
- Zet `build-resolvers/typescript-resolver` in voor de volgende TypeScript-buildfout — stop met handmatig rode tekst lezen

### Week 4 — Teamhefboom
- Voer `/pr-review` uit op elke PR voor goedkeuring — post door Claude gegenereerde inline-opmerkingen direct
- Gebruik `core/planner` om je volgende epic op te splitsen in een sprintgrote takenlijst
- Plan een kwartaalsessie voor technische schuld met `/tech-debt-tracker` over de hele repository
- Meet: volg PR-beoordelingstijd, tijd voor bugoplossing en documentatiedekking voor en na

---

## Tool-integraties

### GitHub MCP (aanbevolen)

```json
// Toevoegen aan ~/.claude/settings.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Hiermee verbonden kan Claude:
- PR-diffs, opmerkingen en beoordelingsthreads lezen zonder kopiëren en plakken
- Inline-beoordelingsopmerkingen direct op GitHub plaatsen
- Probleembeschrijvingen lezen en deze koppelen aan codewijzigingen
- CI-status controleren en uitvoer van mislukte tests weergeven

### Jira / Linear MCP

```json
// Linear — toevoegen aan ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

Hiermee verbonden kan Claude:
- Ticketbeschrijvingen lezen bij het plannen van implementatie
- Ticketstatus bijwerken en engineeringnotities toevoegen
- PR's automatisch koppelen aan problemen tijdens `/pr-review`-sessies
- Sprintsamenvattingen genereren vanuit afgeronde tickets

### Sentry-hook (geautomatiseerde bugcontext)

Stel een hook in die Sentry-meldingscontext in Claude invoert voor een `/debug`-sessie:

```json
// Toevoegen aan .claude/settings.json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "sentry",
        "command": "python .claude/hooks/sentry-context.py"
      }
    ]
  }
}
```

De hook haalt de volledige Sentry-gebeurtenis op — stack trace, breadcrumbs, tags, getroffen gebruikers — en voegt die automatisch toe aan je `/debug`-sessie. Geen handmatig kopiëren en plakken vanuit het Sentry-dashboard.

---

## Benchmarks

Dit zijn waargenomen uitkomsten van engineeringteams die de volledige Claudient-stack gebruiken. Individuele resultaten variëren met de complexiteit van de codebase en werkstroomadoptie.

| Statistiek | Voor Claude Code | Na Claude Code |
|---|---|---|
| PR-beoordelingstijd (gemiddeld) | 35-50 min | 5-8 min |
| Tijd voor bugoplossing (P2) | 2-4 uur | 25-45 min |
| ADR-dekking (gedocumenteerde beslissingen) | 20-30% | 85-95% |
| Tijd om een nieuw eindpunt te bouwen | 20-30 min | 3-5 min |
| Inwerkperiode (nieuwe engineer naar eerste PR) | 5-7 dagen | 2-3 dagen |
| Geïdentificeerde technische schulditems per kwartaal | 10-20 (handmatig) | 60-100 (geautomatiseerde scan) |
| Tijd voor oplossing van buildfouten | 15-30 min | 3-8 min |

---

## Bronnen

- [Aan de slag met Claude Code](./getting-started.md)
- [GitHub MCP-installatie](../mcp/github.md)
- [Jira MCP-installatie](../mcp/jira.md)
- [Workflow voor codebeoordelingen](../workflows/code-review.md)
- [ADR writer skill](../skills/productivity/adr-writer.md)
- [RAG architecture skill](../skills/ai-engineering/rag-architect.md)
- [MCP server builder skill](../skills/ai-engineering/mcp-server-builder.md)

---
