# Claude Mythos Voorbeeld

Een gids voor het Claude Mythos initiatief van Anthropic — een research preview programma dat mogelijkheden verkennen buiten standaard Claude deployments. Geschreven voor geavanceerde Claude Code gebruikers, AI onderzoekers en developers werkend aan de grens van wat agentic systemen kunnen doen.

---

## Wat is Claude Mythos

Claude Mythos is een Anthropic Labs research preview programma, aangekondigd in vroeg 2026, gericht op het verkennen van Claude's mogelijkheden buiten de grenzen van het standaard, algemeen beschikbare product. Het is geen product release — het is een structured access programma voor het testen en valideren van mogelijkheden die nog niet klaar zijn voor algemene beschikbaarheid.

Het initiatief richt zich op drie mogelijkheidsclusters:

**Extended reasoning chains.** Standaard Claude modellen werken binnen een vast thinking budget. Mythos varianten kunnen reasoning kettingen aanzienlijk langer handhaven dan de standaard token ceiling, wat diepere decompositie van problemen mogelijk maakt die veel reasoning stappen vereisen voordat een actionable conclusie wordt bereikt. Dit is niet gewoon een groter context window — de reasoning architectuur zelf is geconfigureerd om meer iteratieve refinement toe te staan voordat naar een output wordt begaan.

**Long-horizon multi-turn tool use.** Standaard Claude Code sessies kunnen complexe multi-step taken afmaken, maar context pressure en tool call depth limits leggen praktische ceilings op. Mythos is ontworpen om coherente task status vast te houden over 100+ tool calls, goal fidelity te handhaven over een lange sequentie van acties zonder de degradatie die gebruikelijk is in extended agentic sessies.

**Novel capability testing voordat algemene release.** Mythos dient als een controlled surface voor Anthropic om mogelijkheden te evalueren — inclusief multi-modal reasoning, novel tool interaction patterns en agent coordination primitives — voordat die mogelijkheden naar production modellen worden bevorderd. Gedragingen waargenomen in Mythos kunnen veranderen, worden verwijderd of in een ander form in latere releases verschijnen.

Toegang is selectief. Pro, Max, Team en Enterprise abonnees kunnen vroege toegang aanvragen door het Anthropic Labs programma. Toegang wordt verleend op rolling basis, prioriteit gegeven aan onderzoekers, high-usage power users en use cases die nuttig signaal genereren voor Anthropic's evaluatie werk.

---

## Hoe het verschilt van standaard Claude

| Feature | Claude (standaard) | Claude Mythos |
|---|---|---|
| Thinking budget | Tot ~32K tokens | Extended — research limit, niet gepubliceerd |
| Max sessie lengte | Standaard context window | Extended context window |
| Tool call diepte | Standaard limits | Dieper recursive tool use ondersteund |
| Beschikbaarheid | Algemeen beschikbaar | Labs preview — selectieve toegang |
| Model identifier | claude-sonnet-4-6, claude-opus-4-6 | Research variant — zie Labs dashboard |
| SLA | Ja (voor API en Enterprise tiers) | Geen — preview modellen hebben geen SLA |
| Latency | Standaard | Hoger door extended reasoning passes |
| Production readiness | Ja | Nee — niet geschikt voor production workloads |

De model identifier voor Mythos varianten is niet gepubliceerd in de standaard API documentatie. Als je toegang hebt, zal de juiste model ID verschijnen in het Anthropic Labs dashboard. Hardcode geen aangenomen model string — haal het op uit het dashboard en behandel het als onderhevig aan wijziging tussen preview updates.

---

## Mythos benaderen

Toegang is niet automatisch, zelfs niet voor betalende abonnees. Het proces:

1. Navigeer naar `claude.ai/labs` en pas aan voor de Mythos preview.
2. Een actief Pro, Max (5x of 20x), Team of Enterprise abonnement is vereist. Gratis-tier accounts zijn niet geschikt.
3. Applicaties worden op rolling basis beoordeeld. Er is geen gepubliceerde SLA voor wanneer toegang wordt verleend. Prioriteit wordt gegeven aan use cases met duidelijke research value.
4. Eenmaal goedgekeurd, API toegang wordt verstrekt via een aparte preview model ID zichtbaar in het Labs dashboard. Deze model ID is onderscheiden van elke production model ID en verandert bij elke preview update.
5. Claude.ai interactive access (indien verleend) verschijnt als een aparte mode selector — het is niet standaard ingeschakeld in de main interface.

Als je op een Team of Enterprise plan bent, kan access management vereisen dat een admin Mythos inschakelt voor specifieke seats. Controleer met je organisatie's Anthropic account contact.

Er is geen self-serve upgrade pad naar Mythos. Het is een application-gated programma.

---

## Wat je kunt doen met Mythos in Claude Code

De volgende use cases profiteren materieel van Mythos mogelijkheden versus standaard Claude Code:

**Long-horizon codebase refactors.** Taken zoals het migreren van een volledige codebase van het ene framework naar een ander, of het afdwingen van een nieuw architecturaal patroon in honderden bestanden, vereist het handhaven van een consistent model van de target state terwijl tientallen bestandsedits worden uitgevoerd. Mythos' extended context en tool call depth support maakt deze taken betrouwbaarder — minder mid-sessie context collapses, betere goal retention over veel sub-steps.

**Complex multi-step research tasks.** Wanneer een taak veel documenten lezen vereist, informatie over bronnen synthetiseren, hypotheses vormen, ze tegen aanvullende bronnen testen en reviseren, maakt het extended reasoning budget meer grondige reasoning traces mogelijk voordat conclusies worden vastgesteld. Dit is onderscheiden van simpelweg meer context hebben — het verandert de kwaliteit van intermediate reasoning stappen.

**Extended autonomous sessions.** Standaard agentic sessies in Claude Code zijn praktisch voor taken die in tientallen stappen compleet worden. Mythos is ontworpen om sessies te ondersteunen die aanzienlijk langer lopen zonder de typische degradatie in task coherence. Dit is relevant voor volledig autonome agents die lange build-test-fix cycli of multi-phase workflows uitvoeren.

**Novel agent coordination patterns.** Mythos is de geschikte surface voor het testen van orchestration patronen die een coordinator vereisen om status vast te houden over veel spawned subagent calls. Als je een multi-agent systeem ontwikkelt dat tegen standaard coordination limits duwt, biedt Mythos een context waarin die limits voldoende entspannen om nieuwe patronen te verkennen — met het inzicht dat wat in preview werkt aanpassingen kan vereisen wanneer het patroon naar production modellen gaat.

---

## Extended Reasoning Modus

Als je Mythos access hebt, is extended thinking geconfigureerd op API level wanneer calls naar het preview model worden gemaakt.

**Extended thinking budget inschakelen in API calls.** In de Anthropic SDK, accepteert de `thinking` parameter een `budget_tokens` waarde. Voor standaard modellen, is de gedocumenteerde ceiling van toepassing. Voor Mythos preview modellen, is de effective ceiling hoger — de exact limit is gedocumenteerd in het Labs dashboard voor je access tier en onderhevig aan verandering tussen preview updates.

```python
response = client.messages.create(
    model="<mythos-model-id-from-labs-dashboard>",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 80000  # voorbeeld — verifieer je tier's limit in het dashboard
    },
    messages=[{"role": "user", "content": your_prompt}]
)
```

Neem geen specifieke `budget_tokens` ceiling aan. Haal de limit op uit het Labs dashboard. Het overschrijden van de ondersteunde limit resulteert in een API error, niet stille truncation.

**De thinking trace lezen.** Het response object bevat een `thinking` content block naast de `text` block. De thinking trace is het interne reasoning van het model — het weerspiegelt de stappen genomen voordat de finale answer wordt geproduceerd. In extended reasoning modus kan deze trace aanzienlijk langer zijn dan in standaard modus. Behandel het als diagnostic output in plaats van user-facing content. Het is nuttig voor het begrijpen waarom het model tot een bepaalde conclusie kwamm, identificatie van waar reasoning in een mislukte taak mis ging en kalibratie of extended reasoning value voor een gegeven task class oplevert.

**Wanneer extended reasoning helpt.** Extended reasoning is het waardevol voor taken waar het juiste antwoord niet onmiddellijk afleidbaar is — problemen die het verkennen van meerdere approaches vereisen, taken met veel interdependente constraints die gelijktijdig moeten worden voldaan en research taken waar de vraag zelf voordat een answer meaningful is vereenvoudigd moet worden. In deze gevallen maakt het extended budget het model mogelijk meer van de problem space uit te putten voordat het begaat.

**Wanneer extended reasoning overkill is.** Simpele, goed gespecificeerde taken profiteren niet van extended thinking budgets. Een request om een bestand op te maken, een unit test voor een duidelijk gedefinieerde function te schrijven of een waarde in een document op te zoeken verbetert niet met meer reasoning tokens — het kost alleen meer en duurt langer. Gebruik extended thinking alleen voor taken waar de reasoning complexiteit de kosten en latency rechtvaardigt.

**Kosten.** Extended thinking tokens worden gefactureerd tegen het thinking-token rate, welke verschilt van de standaard input/output token rate. Thinking tokens accumuleren snel in extended reasoning modus. Voor kostendetails, zie [guides/billing-and-pricing.md](billing-and-pricing.md). Controleer je usage tijdens Mythos sessies — de preview modellen kunnen zeer grote thinking traces genereren op complexe taken.

---

## Beperkingen en kanttekeningen

Mythos is een preview programma. Die aanduiding heeft specifieke, niet-onderhandelbare implicaties:

**Gedrag verandert tussen updates.** Anthropic werkt preview modellen vaker bij dan production modellen en zonder de stability guarantees die van toepassing zijn op GA releases. Een gedrag dat je vandaag op vertrouwt kan in de volgende preview update veranderen. Bouw geen production systemen op Mythos model identifiers of gedragingen.

**Niet alle Claude Code features zijn gevalideerd met Mythos varianten.** Features zoals hooks, bepaalde MCP server integraties en specifieke tool call patronen worden getest tegen production modellen. Compatibiliteit met Mythos varianten is niet gegarandeerd en issues waargenomen kunnen niet prioriteit gegeven worden voor fixes gegeven de preview status.

**Hogere latency.** Extended reasoning passes nemen tijd. Taken die in seconden op standaard modellen compleet worden kunnen minuten op Mythos duren wanneer volledig reasoning budget wordt geëngageerd. Dit is expected gedrag, niet een bug, maar het diskwalificeert Mythos uit latency-gevoelige use cases.

**Niet geschikt voor production workloads.** De afwezigheid van een SLA is het expliciete signaal hier. Als een workload betrouwbaarheid guarantees vereist, gebruik GA modellen. Mythos bestaat voor research en exploratie, niet voor het bedienen van eindgebruikers.

**Toegang kan worden ingetrokken.** Als een preview programma, behoudt Anthropic zich het recht voor om access aan te passen, terms te wijzigen of de preview zonder advance notice te beëindigen. Plan dienovereenkomstig — bouw geen critical infrastructure op preview access.

**Beperkte documentatie.** Mythos mogelijkheden zijn opzettelijk onder-gedocumenteerd in public channels. Het Labs dashboard is de authoritative bron voor je access tier's limits, model IDs en ondersteunde features. Vertrouw niet op third-party documentatie als primaire referentie.

---

## Blijf aktueel

Mythos evolueert sneller dan het standaard product. De volgende bronnen zijn de authoritative references:

- `anthropic.com/research` — Anthropic's primair channel voor het aankondigen van research directions, nieuwe mogelijkheden en program updates. Dit is waar Mythos-level developments eerst publiekelijk worden besproken.
- `claude.ai/labs` — De access portal en dashboard voor Labs programma's inclusief Mythos. Model IDs, tier limits en feature beschikbaarheid zijn hier gedocumenteerd voor ingeschreven gebruikers.
- `anthropic.com/claude/changelog` — De public changelog voor Claude model en product veranderingen. Preview model updates kunnen hier verschijnen met minder detail dan production model veranderingen, maar significante updates worden vermeld.

Er is geen dedicated mailing list of RSS feed voor Mythos-specifieke updates vanaf mei 2026. Controleer de bovenstaande channels en let op het Labs dashboard — updates naar je beschikbare model ID of budget limits zullen hier verschijnen voordat ze ergens anders verschijnen.

---

## Gerelateerde gidsen

- [guides/billing-and-pricing.md](billing-and-pricing.md) — Token rates voor thinking tokens, plan limits en de June 15 billing verandering die van invloed is op hoe extended reasoning kosten voor Pro en Max abonnementen worden verantwoord.
- [guides/context-management.md](context-management.md) — Strategieën voor het beheren van extended context windows, relevant voor Mythos sessies waar context use aanzienlijk hoger is dan in standaard sessies.
