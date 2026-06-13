# 30-50% tokenkostverlaging

Praktische strategieën voor het knippen van Claude Code- en Claude API-tokenuitgaven, elk met het mechanisme, implementatiestappen en realistische besparing schatting. Geen speculatief advies — elke strategie hier heeft meetbaar effect.

---

## Basislijn: waar tokens heen gaan

Voordat u optimaliseert, weet wat u betaalt. Tokenuitgaven in een typische Claude Code-sessie:

| Bron | Geschatte aandeel |
|---|---|
| System prompt + CLAUDE.md (elke beurt) | 10–30% |
| Gespreksgeschiedenis (groeit per beurt) | 20–40% |
| Bestandinhoud gelezen in context | 20–40% |
| Output tokens | 10–20% |

De strategieën met de hoogste hefboom richten zich eerst op de grootste categorieën.

---

## Strategie 1: prompt caching

**Mechanisme:** markeer statische inhoud (systeemaanwijzing, CLAUDE.md, grote referentiedocumenten) als cacheable. Claude slaat dit op voor 5 minuten (efemeer) of 1 uur (uitgebreid). Cache hits kosten 0,1× de normale invoerprijs.

**Besparing:** 60–90% op tokens in cache voor herhaalde oproepen. In de praktijk, 20–40% van totale sessiekosten.

**Implementatie (API):**

```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: largeSystemPrompt,
      cache_control: { type: 'ephemeral' }  // 5-minute TTL
    }
  ],
  messages: conversationHistory
})
```

**Cache breekpuntplaatsing:**
- Plaats breekpunten aan het einde van inhoud die statisch blijft tussen beurten
- Systeemaanwijzing → altijd cacheable
- CLAUDE.md inhoud geïnjecteerd als context → cacheable
- Bestandinhoud die niet deze sessie zal veranderen → cacheable
- Gespreksgeschiedenis → cache NIET (wijzigingen elke beurt)

**Uitgebreide cache (1-uur TTL):** Gebruik `{ type: 'ephemeral', ttl: 3600 }` voor documenten waarnaar over meerdere sessies wordt verwezen (grote codebases, lange specificaties).

**Gotchas:**
- Minimum cacheabele blok is 1024 tokens (Haiku) of 2048 tokens (Sonnet/Opus)
- Cache is per-model — schakelen models ongeldig de cache
- Inhoud moet byte-identiek zijn om cache te raken — zelfs spatie veranderingmisses

---

## Strategie 2: Haiku voor mechanische taken

**Mechanisme:** Haiku kost ruwweg 60% minder dan Sonnet per token. Taken waarvoor mechanische transformatie vereist is (vertaling, classificatie, extractie, opmaak) produceren gelijkwaardige kwaliteit op Haiku zonder betekenisvolle degradatie.

**Besparing:** 50–65% op taaktypen hieronder versus ze op Sonnet uit te voeren.

**Haiku gebruiken voor:**
- Vertalingen (taal lokalisering — zie Claudients vertalingspijplijn)
- Een taak of routering naar specialist classificeren
- Gestructureerde gegevens extraheren uit tekst (JSON uit ongestructureerde inhoud)
- Eenvoudige herformattering (markdown → HTML, JSON → CSV)
- Watchdog agents (observeren, niet redeneren)
- Test gegevens of fixture bestanden genereren

**Sonnet gebruiken voor:**
- Code generatie en review
- Architectuur redenering
- Debuggen niet-triviale fouten
- Elke taak waarvoor oordeel over trade-offs nodig is

**Opus gebruiken voor:**
- Transacties met hoog inzet die duur zijn om om te zetten
- Complexe multi-stap redenering over grote codebases
- Onderzoek waarvoor diepe synthese vereist is

**Implementatie in Claude Code:**

Stel model per agent in uw workflow:
```
Spawn translation agent using claude-haiku-4-5:
  Translate the following file into French...
```

Of configureer in `settings.json` voor specifieke slash-opdrachten die standaard Haiku gebruiken.

---

## Strategie 3: Batch API

**Mechanisme:** De Anthropic Batch API verwerkt aanvragen asynchroon met 50% korting. Aanvragen worden binnen 24 uur voltooid (meestal veel sneller).

**Besparing:** 50% vaste korting op batchgeschikt werk.

**Wanneer te gebruiken:**
- Bulkvertaling van veel bestanden
- Het uitvoeren van dezelfde prompt over veel invoer (analyseren 100 PR's, samenvatten 50 tickets)
- Niet-tijdsgevoelige gegevensextractie
- Het genereren van test fixtures of zaadgegevens op schaal

**Wanneer NIET te gebruiken:**
- Interactieve sessies (u hebt nu een antwoord nodig)
- Taken waarbij de uitvoer van één aanvraag de volgende voedt
- Enkele aanvragen — batch overhead is niet de moeite waard onder ~10 aanvragen

**Implementatie:**
```python
batch = anthropic.messages.batches.create(
  requests=[
    {
      "custom_id": f"translate-{filename}",
      "params": {
        "model": "claude-haiku-4-5",
        "max_tokens": 4096,
        "messages": [{"role": "user", "content": file_content}]
      }
    }
    for filename, file_content in files_to_translate.items()
  ]
)
# poll batch.id until complete, then retrieve results
```

---

## Strategie 4: programmatische tooloproepen (PTC)

**Mechanisme:** wanneer een agent meerdere opeenvolgende tooloproepen maakt, bevat elke retourrit de volledige gespreksgeschiedenis. PTC (ook wel tool streaming of parallelle tool-calling) batcht meerdere tooloproepen in één beurt, waardoor het aantal geschiedenisdragers retourritten wordt verminderd.

**Besparing:** tot 37% minder invoertokens voor multi-tool workflows.

**Wanneer dit van toepassing is:**
- Agents die 3+ bestanden lezen voordat ze iets doen
- Onderzoekstaken die meerdere gegevensbronnen doorzoeken
- Elke workflow met een "gather then act" structuur

**Implementatie:**
```typescript
// Instead of: read file A → get result → read file B → get result → read file C
// Use: request all three reads in one turn
const tools = [readFileTool, readFileTool, readFileTool]
// Claude returns all three in a single response; you process them together
```

In Claude Code, wordt dit automatisch afgehandeld wanneer u Claude instrukt om meerdere bestanden gelijktijdig in plaats van één tegelijk te lezen:
```
Read all of the following files before responding: [list files]
```

---

## Strategie 5: Uitgestelde tool-lading

**Mechanisme:** in plaats van elke tool-schema-schaal aan het begin van een sessie te laden, load alleen de schema's die nodig zijn voor de huidige taak. Tool-schemas verbruiken invoertokens bij elke beurt.

**Besparing:** 85% verlaging in tool-schema-tokenoverhead voor grote toolcatalogi.

**Is van toepassing wanneer:** u hebt 10+ MCP tools geregistreerd of een grote aangepaste toolcatalogus.

**Implementatie met ToolSearch:**
```
Do not load all tools at session start.
Load only [specific tools] for this task.
When the task changes, load [different tool set].
```

In MCP config vermijdt u elke server globaal te registreren — gebruik project-niveau MCP configs zodat alleen relevante tools per project actief zijn.

---

## Strategie 6: uitvoerlengtebeheer

**Mechanisme:** uitvoertokens kosten hetzelfde als invoertokens (of meer op sommige modellen). Breedvoerige antwoorden verspillen geld en vertragen sessies.

**Besparing:** 15–30% op output-zware sessies.

**CLAUDE.md instructies toevoegen:**
```
When responding to me:
- Give me the answer, not the reasoning, unless I ask for reasoning
- No preamble ("Sure, I'll help you with that...")
- No summary at the end repeating what was just done
- Code blocks: no prose before or after unless the prose adds information
- Lists: use when there are 3+ items; prose for 1-2
- One sentence is better than one paragraph when both convey the same information
```

**API-niveau controle:**
```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,  // set an upper bound appropriate to the task
  system: "Be concise. Answer directly. No preamble.",
  messages: [...]
})
```

---

## Strategie 7: context pruning

**Mechanisme:** gespreksgeschiedenis groeit bij elke beurt. Na een lange sessie kan geschiedenis invoertokentellingen domineren.

**Tactieken:**

`/compact` met een tip (Claude Code ingebouwd):
```
/compact Focus on the authentication changes we made — discard everything about the UI discussion
```

Subagent isolatie — spawn u een subagent voor een deeltaak zodat het met een vers contextvenster start:
```
The parent agent passes only a one-paragraph summary of the session to the subagent,
not the full history. Subagent does its work and returns results to parent.
```

Expliciete context dropt:
```
Forget the file analysis we did on orders.ts — it's no longer relevant. 
Proceeding focus on the payments module only.
```

---

## Strategie 8: CLAUDE.md grootte-impact

**Mechanisme:** CLAUDE.md wordt bij het begin van elke Claude Code-sessie geladen. Elke regel die u toevoegt kost tokens bij elke sessie start, voor elke gebruiker.

**Besparing:** varieert met bestandsgrootte. Een 300-regel CLAUDE.md getrimmd naar 150 regels bespaart ~150 tokens × sessies per maand.

**Doel:** Houd CLAUDE.md onder 2000 tokens (ruwweg 150–180 regels dichte proza of 250 regels gemengde inhoud).

**Gebruik de context-auditor prompt** (`prompts/task-specific/context-auditor.md`) om uw CLAUDE.md te trimmen zonder unieke begeleiding te verliezen.

**Regels voor CLAUDE.md economie:**
- Één instructie per regel indien mogelijk
- Geen verklaringen waarom een conventie bestaat (alleen de conventie)
- Geen instructies Claude volgt standaard (geen "schrijf schone code")
- Gebruik links naar externe docs in plaats van in te bedden

---

## Kostencalculatorverwijzing

Geschatte kosten bij mei 2026 prijzen. Controleer Anthropic's prijspagina voor huidige tarieven.

| Model | Invoer ($/MTok) | Uitvoer ($/MTok) | Cache hit ($/MTok) |
|---|---|---|---|
| Haiku 4.5 | ~€0,80 | ~€4,00 | ~€0,08 |
| Sonnet 4.6 | ~€3,00 | ~€15,00 | ~€0,30 |
| Opus 4.7 | ~€15,00 | ~€75,00 | ~€1,50 |

**Voorbeeld sessie-kostenberekening:**

10 beurten, 5k tokens invoer per beurt (inclusief 2k gecachte systeemaanwijzing), 500 tokens uitvoer per beurt, Sonnet:

- Zonder caching: 10 × 5000 × €0,000003 + 10 × 500 × €0,000015 = €0,15 + €0,075 = **€0,225**
- Met caching (2k tokens gecached): 10 × 3000 × €0,000003 + 10 × 2000 × €0,0000003 + 10 × 500 × €0,000015 = €0,09 + €0,006 + €0,075 = **€0,171** — 24% besparing

**Gecombineerde strategie-impact:**

| Strategie | Besparing | Complexiteit |
|---|---|---|
| Prompt caching | 20–40% | Laag |
| Haiku voor mechanische taken | 50–65% op geschikt taken | Laag |
| Batch API | 50% vaste | Middelmatig |
| PTC / parallelle tooloproepen | Tot 37% op tool-zware sessies | Laag |
| Uitgestelde toolladung | Tot 85% op schema overhead | Middelmatig |
| Uitvoerlengtebeheer | 15–30% | Laag |
| Context pruning | 10–25% op lange sessies | Laag |
| CLAUDE.md trimming | 5–15% | Eenmalig |

Het toepassen van alle lage-complexiteitsstrategieën samen levert meestal 30–50% totale kostverlaging op zonder de kwaliteit van resultaten te veranderen.

---
