# Claudient-skills gebruiken in Cursor, Windsurf, Copilot en Codex

Claudient-skills zijn eenvoudige Markdown-bestanden. Niets in hun formaat is Claude Code-specifiek — geen binaire bestanden, geen propriëtaire syntaxis, geen API-aanroepen. Dit maakt ze draagbaar naar elk belangrijk AI-codeerprogramma met een regel- of contextinjectiemechanisme.

Deze gids behandelt de mechanica van het overbrengen van een Claudient-skill naar Cursor, Windsurf, GitHub Copilot en OpenAI Codex CLI — wat werkt, wat niet werkt en waar de grens te trekken.

---

## Waarom het werkt

Een Claudient-skill bestaat uit vier Markdown-secties: `When to activate`, `When NOT to use`, `Instructions` en `Example`. Het model leest dit als platte tekst en past zijn gedrag dienovereenkomstig aan.

Dit is precies wat elk AI-codeerprogramma doet wanneer u tekst in het regelbestand of instructiebestand plaatst — de tekst wordt onderdeel van de systeemprompt voordat uw verzoek wordt verwerkt. Het skill-formaat is al voor dit doel geoptimaliseerd:

- `When to activate` en `When NOT to use` geven het model bereikbeperkingen die overtoepassing voorkomen
- `Instructions` bevat directieve taal ("altijd X doen", "nooit Y doen") in plaats van documentatietaal
- `Example` verankert het model in de verwachte uitvoerstructuur

Elk model dat een systeemprompt of aangepast instructiebestand accepteert, kan een Claudient-skill zonder wijzigingen gebruiken. U verliest Claude Code-specifieke functies (slash-opdrachtaanroepen, hooktriggers, subagent-delegatie), maar de kerngedragleidraad wordt volledig overgebracht.

---

## Snelle referentie

| Programma | Waar skill te plaatsen |
|---|---|
| Claude Code | `.claude/skills/<skill>.md` (slash-opdracht) of import via `CLAUDE.md` |
| Cursor | `.cursor/rules/<skill>.mdc` (automatisch geladen) of `.cursorrules` (verouderd) |
| Windsurf | `.windsurfrules` in projectwortel |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenAI Codex CLI | `AGENTS.md` in projectwortel, of doorgeven met `--context` vlag |
| Zed | Projectregelbestand (`.zed/settings.json` → sleutel `"system_prompt"`) |
| Continue.dev | `~/.continue/config.json` → veld `"systemMessage"`, of `@Rules` blok |

---

## Cursor

Cursor is het meest voorkomende alternatief voor Claude Code voor teams die VS Code al gebruiken. Het ondersteunt fijnmazige projectspecifieke regels met bereikbesturing.

### Locatie regelbestand

Cursor laadt automatisch regels van `.cursor/rules/`. Elk bestand moet de extensie `.mdc` gebruiken. Cursor leest alle `.mdc`-bestanden in deze map bij opstarten — u hoeft ze niet handmatig aan te duiden.

```
your-project/
├── .cursor/
│   └── rules/
│       ├── fastapi.mdc
│       ├── db-migrations.mdc
│       └── test-coverage.mdc
└── src/
```

### Een Claudient-skill omzetten naar een Cursor-regel

1. Kopieer het `.md`-bestand van `skills/` naar `.cursor/rules/`
2. Wijzig de extensie van `.md` in `.mdc`
3. Voeg bovenaan een MDC-frontmatter-blok toe om bereik te controleren:

```
---
description: FastAPI-eindpuntpatronen — activeren bij het maken of wijzigen van FastAPI-routes
globs: ["**/*.py", "**/routers/**"]
alwaysApply: false
---

# FastAPI CRUD

## When to activate
...
```

Het `globs`-veld geeft Cursor aan deze regel alleen toe te voegen wanneer bestanden die overeenkomen met deze patronen in context zijn geopend. Het `description`-veld wordt gebruikt door Cursors regelafstemmingslogica — kopieer de inhoud van de `When to activate`-sectie van de skill als korte triggerzin.

Instelling `alwaysApply: true` injecteert de regel in elk verzoek ongeacht welk bestand open is. Gebruik dit alleen voor projectbrede coderingsnormen, nooit voor taskspecifieke skills — het verspilt context en verslechtert antwoordkwaliteit op onrelated taken.

### Legacy `.cursorrules`

`.cursorrules` is één bestand in projectwortel. Het wordt voor elk verzoek zonder bereikbeperking geladen. Plak hier alleen volledige skill-inhoud als:

- Het project een enkele dominante technologiestapel heeft
- U wilt dat de skill actief is ongeacht welk bestand open is
- U gebruikt de `.cursor/rules/` mapstructuur nog niet

Voor projecten met meerdere skills is `.cursor/rules/` met aparte `.mdc`-bestanden aanzienlijk beter — elke skill wordt alleen geladen wanneer relevant.

### Cursor-specifieke beperking

Cursor ondersteunt geen slash-opdrachtaanroepen van individuele skills op dezelfde manier als Claude Code. Alle `.mdc`-bestanden die overeenkomen met de huidige context worden gelijktijdig geladen. Als u vijf geïnstalleerde skills hebt en alle vijf matchen (bijv. allemaal `alwaysApply: true`), injecteert Cursor alle vijf in de systeemprompt. Houd bereik strak via `globs` en nauwkeurige `description`-waarden om dit te voorkomen.

---

## Windsurf

Windsurf (Codeiums editor) gebruikt één regelbestand per project.

### Locatie regelbestand

Plaats een `.windsurfrules`-bestand in projectwortel:

```
your-project/
├── .windsurfrules
├── src/
└── package.json
```

### Een Claudient-skill omzetten

Plak skill-inhoud rechtstreeks in `.windsurfrules`. Voor meerdere skills voegt u ze samen met een horizontale regel (`---`) als scheidingsteken:

```markdown
# FastAPI CRUD

## When to activate
- Een nieuw FastAPI-eindpunt maken (GET, POST, PUT, DELETE)
...

## Instructions
...

---

# Database Migrations

## When to activate
- Alembic-migraties uitvoeren
...
```

Windsurf laadt het gehele `.windsurfrules`-bestand voor elk verzoek. Er is geen bereikmechanisme per bestand — het model moet de secties `When to activate` en `When NOT to use` gebruiken voor zelf-selectie. Dit werkt, maar grote bestanden (meer dan 3–4 skills) beginnen de aandacht van het model te verminderen. Houd `.windsurfrules` beperkt tot de 2–3 relevantste skills voor de huidige workflow en draai naar behoefte.

---

## GitHub Copilot

Het aangepaste instructiebestand van Copilot is van toepassing op alle Copilot-interacties in een repository.

### Locatie regelbestand

```
your-project/
├── .github/
│   └── copilot-instructions.md
└── src/
```

De bestandsnaam moet precies `copilot-instructions.md` zijn. Copilot leest dit automatisch voor elke repository waar het aanwezig is.

### Een Claudient-skill omzetten

Plak skill-inhoud in `copilot-instructions.md`. Het viersectie-formaat wordt begrepen door GPT-4-klasse-modellen die Copilot aandrijven — de `When NOT to use`-sectie is bijzonder effectief in het voorkomen dat Copilot patronen in verkeerde context toepast.

```markdown
# FastAPI CRUD

## When to activate
- Een nieuw FastAPI-eindpunt maken
- Pydantic-verzoek-/antwoordmodellen toevoegen
- Afhankelijkheidsinjectie implementeren in routes

## When NOT to use
- Bestaande Flask- of Django-projecten
- Eenvoudige scripts zonder API-laag
- gRPC- of GraphQL-API's

## Instructions

Definieer altijd een Pydantic-model voor verzoeklichamen. Accepteer nooit ruwe dicts.
Verhef `HTTPException` met juiste statuscode — 422 voor validatiefouten,
404 voor niet gevonden, 500 alleen voor onverwachte fouten.

## Example

**User:** Voeg een POST-eindpunt toe om een nieuwe gebruiker te maken.

**Expected:**
- `UserCreate` Pydantic-model met `email: EmailStr` en `password: str`
- Route op `POST /users` retournerend `UserResponse` (geen wachtwoordveld)
- `HTTPException(409)` als email al bestaat
```

### Copilot tekenlimieten

Vanaf medio 2025 past Copilot een zachtlimiet toe op per-verzoek geladen `copilot-instructions.md`-inhoud. Bestanden boven circa 8.000 tekens kunnen worden afgekapt. Voor multi-skill-projecten prioriteert u de vaakst geactiveerde skills en houdt u individuele `Instructions`-secties eerder compact dan uitgebreid.

---

## OpenAI Codex CLI

Codex CLI (`codex`-opdracht) gebruikt `AGENTS.md` voor persistente context, gelijkwaardig aan CLAUDE.md in Claude Code.

### Locatie regelbestand

Plaats `AGENTS.md` in projectwortel:

```
your-project/
├── AGENTS.md
└── src/
```

### Een Claudient-skill omzetten

Plak de skill rechtstreeks in `AGENTS.md`. Codex leest dit bestand bij sessiestart en voegt het in voor elk verzoek in die map.

```markdown
# FastAPI CRUD

## When to activate
...

## Instructions
...
```

Voor eenmalige aanroepen zonder `AGENTS.md` aan te passen, geeft u de skill door als contextbestand:

```bash
codex --context skills/backend/python/fastapi.md "POST /users-eindpunt toevoegen"
```

De `--context` vlag accepteert een bestandspad en voegt de inhoud ervan vooraf in voor dat verzoek alleen. Nuttig voor testen van skills vóór commit naar `AGENTS.md`.

### Nesting

Net als CLAUDE.md ondersteunt `AGENTS.md` mapniveau-overrides. Een bestand op `services/api/AGENTS.md` geldt alleen wanneer Codex binnen die substructuur werkt, wat per-service skill-toewijzing in een monorepo mogelijk maakt.

---

## Zed en Continue.dev

### Zed

Zeds AI-context wordt geconfigureerd in `.zed/settings.json`. Plak skill-inhoud in het `"system_prompt"` veld:

```json
{
  "assistant": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-5"
    },
    "system_prompt": "# FastAPI CRUD\n\n## When to activate\n..."
  }
}
```

Voor multi-skill-setups voegt u skills samen als één string. Zed ondersteunt geen regelimports op bestandsbasis, dus de gehele context moet inline in `settings.json` staan.

### Continue.dev

Continue ondersteunt zowel globale als projectbezorgde systeemberichtoverrides. In `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Claude Sonnet",
      "provider": "anthropic",
      "model": "claude-sonnet-4-5",
      "systemMessage": "# FastAPI CRUD\n\n## When to activate\n..."
    }
  ]
}
```

Voor projectbezorgde regels ondersteunt Continue `@Rules`-blokken in `.continue/rules.md` (versie 0.9+). Plak skill-inhoud daar — Continue injecteert het naast het systeembericht van het model voor verzoeken in dat project.

---

## Wat goed overdraagt

**De Instructions-sectie** — directieve taal werkt identiek over modellen. "Definieer altijd een Pydantic-model voor verzoeklichamen. Accepteer nooit ruwe dicts." is ondubbelzinnig voor GPT-4o, Claude, Gemini en elk ander model met instructievolging.

**De Example-sectie** — few-shot verankering is modelonafhankelijk. Een voorbeeld met de verwachte uitvoerstructuur verbetert naleving op alle modellen, niet alleen Claude.

**De When NOT to use-sectie** — negatieve beperkingen zijn in de meeste regelbestanden onderbenut. Deze sectie is vaak het verschil tussen een skill die helpt en één die onrelated werk verstoort.

**Bestand-scoped regels (Cursor globs)** — het Cursor `.mdc`-formaat met `globs` reproduceert Claude Codes `paths`-frontmatter-veld. Skills die bestandspatronen opgeven in hun `When to activate`-sectie vertalen natuurlijk naar Cursors `globs` — automatiseer de conversie.

---

## Wat niet overdraagt

**Slash-opdrachtaanroeping** — `/skill-name` is Claude Code-specifiek. Andere programma's laden skills passief van hun regelbestand; u kunt een skill niet op dezelfde manier mid-sessie activeren.

**Hooks** — `.claude/settings.json` hooks (`PreToolUse`, `PostToolUse`, `Notification`, `Stop`) zijn alleen Claude Code. Shell-scripts geactiveerd op tool-events hebben geen equivalent in Cursor, Windsurf of Copilot. Probeer niet hookbestanden te vertalen.

**Subagent-delegatie** — Skills die Claude instrueren een subagent te spawnen (Tool `Task`, `subagent_type` verwijzingen) zullen niet in andere programma's uitvoeren. Het model leest de instructie en doet niets zinvols ermee, of probeert het gedrag in één contextvenster na te bootsen.

**MCP-tool-verwijzingen** — Instructies die specifieke MCP-tools refereren (`mcp__tool_name`) werken alleen in Claude Code met geconfigureerde MCP-server. Verwijder deze van skills vóór gebruik in andere programma's, of vervang door gelijkwaardige native toolinstructies voor doelplatform.

**`!command` runtimeinjectie** — De syntaxis `!git branch --show-current` voor het inbedden van shell-output in skillcontext bij activatie is Claude Code-specifiek. Andere programma's voeren deze inline-opdrachten niet uit. Vervang door statische tekst of verwijder geheel bij overdracht.

---

## Praktische workflow voor overdracht van skill

1. Open skillbestand van `skills/`
2. Verwijder alle `!command` inline-injecties
3. Verwijder of herschrijf secties die Claude Code-agents, hooks of MCP-tools refereren
4. Bepaal doelprogramma en doelbestand (zie tabel bovenaan)
5. Voor Cursor: voeg MDC-frontmatter-blok toe; extraheer `When to activate`-inhoud als `description`-waarde; wijs bestandspatronen toe aan `globs`
6. Voor eenmalige bestandsbestemmingen (Windsurf, Copilot, Codex): plak als-is met scheidingsteken als meerdere skills gecombineerd
7. Test met taak die `When to activate` matched — verifieer model past `Instructions`-patronen toe
8. Test met taak die `When NOT to use` matched — verifieer model past patronen niet toe

De viersectie-structuur was ontworpen om zelfstandig te zijn. Een goed geschreven Claudient-skill zou minder dan 10 minuten moeten vergen om naar elk van deze programma's overgedragen te worden.

---
