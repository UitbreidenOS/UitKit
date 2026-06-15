---
name: skill-discovery
description: "Gerelateerde vaardigheden ontdekken via afhankelijkheidsgrafiekanalyse, leerpaden vinden en vaardigheidscluster identificeren"
updated: 2026-06-15
---

# Skill-discovery Vaardigheid

## Wanneer te activeren

- Zoeken naar vaardigheden met betrekking tot een onderwerp (bijv. "Ik moet met RAG werken — welke vaardigheden moet ik lezen?")
- Een leerpad opbouwen (bijv. "Welke vaardigheden leiden naar agentteams?")
- Een vaardigheid vinden op basis van deelbeschrijving
- Vaardigheidscluster en gerelateerde tools binnen een domein identificeren
- Multi-skill workflows plannen en afhankelijkheden kennen
- Debugging: begrijpen waarom een vaardigheid naar een ander verwijst

## Wanneer NIET te gebruiken

- Zoeken naar niet-vaardigheidsresources (gidsen, workflows, agenten, regels)
- Triviale eenmalige vragen
- Generieke vragen over Claude of LLM's niet gerelateerd aan Claudient

## Instructies

### Stap 1 — Een vaardigheid of onderwerp aanvragen

Formuleer uw query als een van de volgende opties:

- "Vaardigheden gerelateerd aan [onderwerp] vinden" → Geeft alle vaardigheden in die categorie
- "Wat leidt naar [vaardigsheidsnaam]?" → Toont vereisten
- "Waarop bouwt [vaardigsheidsnaam] voort?" → Toont volgende stappen
- "Toon me een leerpad voor [doel]" → Bouwt een sequentie op
- "Ik heb een vaardigheid nodig voor [beschrijving]" → Semantische overeenkomst
- "Verwaalde vaardigheden zoeken" → Geeft vaardigheden zonder kruisverwijzingen
- "Wat zijn de meest centrale vaardigheden?" → Geeft knooppunten met hoge graad

### Stap 2 — Afhankelijkheidsgrafiek genereren of ophalen

Voer het afhankelijkheidsgrafiekscript uit:

```bash
node scripts/dependency-graph.js --json
```

Dit levert een aangrenzingslijst op: `{ "skill-name": ["ref1", "ref2", ...], ... }`

Voor statistieken:

```bash
node scripts/dependency-graph.js --stats
```

### Stap 3 — Grafiek analyseren voor uw query

#### Voor "gerelateerde vaardigheden"-query's:

1. Zoek de vaardigheid in de grafiek op naam
2. Geef alle vaardigheden terug waarnaar deze verwijst (uitgaande randen)
3. Zoek alle vaardigheden die ernaar verwijzen (inkomende randen)
4. Groepeer op categorie voor duidelijkheid

#### Voor "leerpad"-query's:

1. Begin met de doelvaardigheid
2. Volg recursief inkomende randen (tot 3 hops)
3. Rangschik op afhankelijkheid: vereisten eerst, doel last
4. Neem korte beschrijvingen op

#### Voor "verwaalde vaardigheden"-query's:

Vergelijk de JSON-grafiekuitvoer met de volledige inventaris

#### Voor "meest centrale vaardigheden"-query's:

1. Tel uitgaande randen per vaardigheid
2. Tel inkomende randen per vaardigheid
3. Geef de top 10–15 op centraliteit terug

### Stap 4 — Resultaten met context presenteren

Voor elk resultaat:

1. **Vaardigsheidsnaam** en **beschrijving**
2. **Locatie** (bijv. `skills/ai-engineering/`)
3. **Relatierichting**
4. **Korte samenvatting** van de relatie
5. **Aanbevolen leesorder**

### Stap 5 — Interactieve verkenning aanbieden

Als de gebruiker dieper wil graven:
- De volledige grafiek visualiseren met het D3.js-visualisatietool
- De buren van een specifieke vaardigheid in detail verkennen
- Referentiepatronen van twee vaardigheden vergelijken
- De volledige auditworkflow uitvoeren

---

## Voorbeeld

**Gebruikersquery:** "Ik wil meer leren over multi-agentworkflows. Waar moet ik beginnen?"

**Resultaat:**
```
Leerpad voor multi-agentworkflows:

1. **session-handoff** — begrijpen hoe agenten staat overbrengen
2. **agent-handoff** — gestructureerde protocollen voor agent-naar-agent overdracht
3. **agent-tracing** — multi-agentuitvoering observeren
4. Kies een:
   - **multi-agent-memory** (gedeelde state tussen agenten)
   - **agent-teams** (gecoördineerde agentgroepen)

Geschatte leesDuur: 20–30 minuten
```

---

## Integratie met de Afhankelijkheidsgrafiek

Deze vaardigheid is afhankelijk van `scripts/dependency-graph.js` en moet worden aangeroepen telkens wanneer een gebruiker een ontdekkingsvraag stelt. De vaardigheid maakt de grafiek in natuurlijke taal bevraagbaar.

Zie de gids op `guides/skill-dependency-graph.md` voor programmatisch gebruik.
