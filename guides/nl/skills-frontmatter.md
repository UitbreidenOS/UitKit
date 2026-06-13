# Vaardigheidsfrontmatter-referentie

Volledige referentie voor alle YAML-frontmattersvelden in Claude Code-vaardigheidbestanden. Frontmatter controleert activeringsovereenkomst, auto-invokatie, inspanningsstandaarden, en of de vaardigheid een modeloproep op alle wijzen activeert.

---

## Verplichte velden

### `name`

**Type :** `string` (kebab-case)
**Verplicht :** Ja

De identificatie die de schuine opdrachtcommando wordt. `name: fastapi-crud` → `/fastapi-crud`.

```yaml
name: fastapi-crud
```

Regels:
- Moet uniek zijn over alle vaardigheidbestanden in bereik (project + globaal)
- Alleen kebab-case — geen underscores, geen punten
- Hou het kort genoeg om in te typen zonder autocompletiewrijving

---

### `description`

**Type :** `string`
**Verplicht :** Ja
**Tekenlimiet :** Telt mee naar gedeelde limiet van 1.536 tekens met `when_to_use`

Het primaire signaal dat Claude gebruikt voor semantische matching — zowel voor auto-invokatie als voor reactie op gebruikers-schuine opdrachten. Schrijf dit als een expliciete activeringsvoorwaarde, niet als een mogelijkheidssamenvatting.

```yaml
description: "FastAPI-eindpuntopstelling met Pydantic-validatie, asynchrone route-handlers en afhankelijkheidsinjectie. Activeer voor nieuwe API-routes, request-modeldefinities of background-taaksetup."
```

Slecht: `"Een vaardigheid voor FastAPI."` — te vaag, slecht matchingssignaal.
Goed: het voorbeeld hierboven — technologie + taaktype + specifieke subtaken.

---

## Optionele velden

### `when_to_use`

**Type :** `string`
**Tekenlimiet :** Gedeelde limiet van 1.536 tekens met `description`

Aanvullende activeringscontext toegevoegd aan `description` in de vaardigheidvermeling. Gebruik voor triggervoorwaarden die te uitgebreid zijn voor de beschrijving, maar de matchingsnauwkeurigheid verbeteren.

```yaml
when_to_use: "Activeer wanneer de gebruiker FastAPI, async Python API, Pydantic-modellen vermeldt, of in een project werkt met main.py met app = FastAPI() gedefinieerd."
```

Behandel `description` als de kop en `when_to_use` als de uitgebreide matchingscontext. Beide tellen mee naar dezelfde limiet van 1.536 tekens — plan dienovereenkomstig.

---

### `paths`

**Type :** `array` van globtekenreeksen
**Standaard :** Geen (vaardigheid wordt nooit automatisch door bestandscontext geactiveerd)

Auto-activeert de vaardigheid wanneer Claude een bestand aanraakt dat overeenkomt met een geliste patroon. Handig voor testprogramma's, config-bestandshulpmiddelen, en schematools die stil zouden moeten worden geladen wanneer Claude specifieke bestanden opent.

```yaml
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "tests/**"
  - "**/jest.config.*"
```

Opmerkingen:
- Matching is tegen het bestandspad dat Claude momenteel leest of bewerkt, niet tegen de werkmap
- Vaardigheden met `paths:` activeren stil — de gebruiker ziet geen schuine opdrachtinvokatie
- Meerdere vaardigheden kunnen tegelijkertijd via `paths:` activeren — er is geen conflictresolutie; alle geactiveerde vaardigheden worden geladen

---

### `effort`

**Type :** `string` — `"low"` | `"medium"` | `"high"` | `"xhigh"`
**Standaard :** Erft van de actieve inspanningsinstelling van de sessie

Overschrijft het inspanningsniveau voor sessies waar deze vaardigheid actief is. Gebruik `"xhigh"` voor vaardigheden die beveiligingsanalyse, architectuurbesluiten of elke taak inhouden waarbij het missen van een subtiele beperking echte gevolgen heeft.

```yaml
effort: xhigh
```

| Waarde | Geschikt voor |
|---|---|
| `"low"` | Herformattering, hernoemen, boilerplate-generering, eenvoudige classificatie |
| `"medium"` | Routinefeature-implementatie, eenvoudige refactors |
| `"high"` | Complexe functiewerk, wijzigingen van meerdere bestanden met afhankelijkheden |
| `"xhigh"` | Beveiligingsbeoordeling, architectuurbesluiten, debugging van diepe problemen |

---

### `shell`

**Type :** `string`
**Standaard :** `"bash"`

Overschrijft de shell-interpreter voor scriptblokken binnen de vaardigheid. Relevant alleen voor Windows-specifieke vaardigheden waarbij PowerShell vereist is.

```yaml
shell: powershell
```

Laat dit ongesteld voor elke vaardigheid gericht op macOS, Linux, of cross-platform-omgevingen.

---

### `disable-model-invocation`

**Type :** `boolean`
**Standaard :** `false`

Wanneer `true`, triggeert het activeren van de vaardigheid geen modelrespons. De vaardigheidstekst wordt als directief in context geladen en het model past het toe op volgende interacties in plaats van een onmiddellijke respons te genereren.

```yaml
disable-model-invocation: true
```

Gebruik voor:
- Vaardigheden die gedrag configureren zonder te hoeven "reageren" (bijvoorbeeld richtlijnen van het stijltype `always-use-typescript`)
- Vaardigheden die context passief injecteren (bijvoorbeeld een vaardigheid die projectconventies in context laadt zonder erop in te werken)

---

## Tekenbegroting

De vaardigheidvermeling die voor auto-invokatie-matching wordt gebruikt, heeft een harde limiet:

| Veld | Begroting |
|---|---|
| `description` + `when_to_use` gecombineerd | 1.536 tekens |
| Volledige vaardigheidstekst (geladen bij match) | ~15.000 tekens |

**Strategie :** Zet dichte, trefwoordrijke activeringstriggers in `description` en `when_to_use`. Zet gedetailleerde instructies, codevoorbeelden en patronen in de vaardigheidstekst. De tekst wordt pas na de match geladen — dit beïnvloedt de matchingsprestaties niet.

---

## Monorepo-detectie

Vaardigheden gaan **niet** de directoryboom op. Dit is de meest voorkomende bron van verwarring bij migratie van CLAUDE.md-patronen.

| Functionaliteit | Gaat boom op? |
|---|---|
| `CLAUDE.md` | Ja — gaat op van huidig bestand naar repo-wortel |
| `.claude/rules/` | Nee — gebruikt `paths:` frontmatterovereenkomst |
| `.claude/skills/` | Nee — alleen vaardigheden in het dichtstbijzijnde `.claude/skills/` zijn actief |
| `~/.claude/skills/` | Altijd actief ongeacht directory |

In een monorepo:
- Globale vaardigheden (`~/.claude/skills/`) zijn overal beschikbaar
- Root-level `.claude/skills/` vaardigheden zijn alleen vanuit de repo-wortel beschikbaar
- Package-level `.claude/skills/` mappen zijn nodig voor pakketspecifieke vaardigheden

---

## Volledig Frontmatter-voorbeeld

```yaml
---
name: drizzle-orm
description: "Drizzle ORM schemagdefinitie, query-bouwing en Neon Postgres-integratie in TypeScript. Activeer voor databaseschemawerk, ORM-querypatronen of migratieontwerp."
when_to_use: "Gebruik wanneer u werkt met drizzle.config.ts, schema.ts-bestanden, db/-directory, of wanneer de gebruiker Drizzle, Neon of databasemigraties in een TypeScript-project vermeldt."
paths:
  - "**/schema.ts"
  - "**/drizzle.config.ts"
  - "db/**"
  - "**/migrations/**"
effort: high
---

# Drizzle ORM

## Wanneer activeren
...
```

---

## Veldcompatibiliteitsoverzicht

| Veld | Verplicht | Auto-invokatie-effect | Handleiding invokatie-effect |
|---|---|---|---|
| `name` | Ja | Opdrachtnaam schuine streep | Primaire identificatie |
| `description` | Ja | Primair matchingssignaal | Weergegeven in vaardigheidvermeling |
| `when_to_use` | Nee | Secundair matchingssignaal | Weergegeven in vaardigheidvermeling |
| `paths` | Nee | Bestandsgebaseerde auto-activering | Geen effect |
| `effort` | Nee | Stelt inspanning in wanneer vaardigheid activeert | Stelt inspanning in wanneer vaardigheid activeert |
| `shell` | Nee | Geen effect op matching | Wijzigt scriptinterpreter |
| `disable-model-invocation` | Nee | Geen respons gegenereerd | Geen respons gegenereerd |

---
