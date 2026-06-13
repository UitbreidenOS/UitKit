# Extended Thinking / Reasoning Mode

Hoe je Claude's interne chain-of-thought mogelijkheden gebruikt — wanneer je het moet inschakelen, hoe je het token budget beheert, en hoe je vermijdt dat je betaalt voor verwerkingstijd die je niet nodig hebt.

---

## Wat extended thinking is

Extended thinking geeft Claude een notitieblok dat het gebruikt voordat het een respons produceert. De thinking content is een chain-of-thought — Claude werkt het probleem stap voor stap door voordat het zich aan een antwoord committeert. Je ziet de thinking output in het antwoord (als een `thinking` blok), en het uiteindelijke antwoord weerspiegelt die redenering.

Dit is structureel anders dan standaard generatie. In standaard modus produceert Claude tokens van links naar rechts, en elke token wordt toegezegd terwijl deze wordt gegenereerd. In thinking modus reserveert Claude eerst een budget van interne tokens om het probleem door te denken, en synthetiseert vervolgens een uiteindelijk antwoord uit die redenering. Het uiteindelijke antwoord is meestal nauwkeuriger, vollediger, en minder waarschijnlijk dat het een duidelijk verkeerde eerste stap neemt waarop het vervolgens dubbel gaat inzetten.

De belangrijkste trade-offs:

| Eigenschap | Standaard modus | Extended thinking |
|---|---|---|
| Latentie | Laag (eerste token snel) | Hoger (thinking loopt eerst) |
| Kosten | Alleen output tokens | Thinking tokens + output tokens |
| Nauwkeurigheid op complexe taken | Baseline | Significant beter |
| Nauwkeurigheid op eenvoudige taken | Baseline | Marginaal beter, zelden waard |
| Response coherentie | Goed | Beter op multi-stap taken |
| Streaming | Onmiddellijk | Thinking blokken streamen apart |

Extended thinking is geen magische verbetering — het verwisselt kosten en latentie voor nauwkeurigheid op taken die doelbewuste redenering vereisen. Gebruik het wanneer de redeneringscomplexiteit de trade-off rechtvaardigt.

---

## Model ondersteuning

Extended thinking is beschikbaar op:

| Model | Thinking ondersteuning | Opmerkingen |
|---|---|---|
| Claude Opus 4.7 | Volledige ondersteuning | Beste redeneerkwaliteit; hoogste kosten |
| Claude Sonnet 4.6 | Volledige ondersteuning | Beste kosten/performance verhouding voor meeste taken |
| Claude Haiku 3.5 | Niet ondersteund | Gebruik voor snelle, goedkope taken zonder thinking |
| Eerdere modellen | Niet ondersteund | Opus 4 en eerder ondersteunen `thinking` niet |

Voor meeste production use cases presteert Sonnet 4.6 met thinking ingeschakeld beter dan Opus 4 tegen lagere kosten. Reserveer Opus 4.7 met maximaal thinking budget voor de moeilijkste taken — architectuurontwerp onder complexe constraints, proof verificatie, algoritmische correctheid over edge cases.

---

## Extended thinking inschakelen

### Claude Code: `/effort` commando

In een Claude Code sessie controleert de `/effort` parameter thinking modus:

```
/effort low       # Standaard modus — geen extended thinking
/effort medium    # Licht thinking; geschikt voor matig complexe taken
/effort high      # Volledige thinking ingeschakeld; ~16K thinking token budget
/effort max       # Maximaal thinking budget; gebruik voor de moeilijkste problemen
```

`/effort` is sessie-bereikt. Het instellen één keer is van toepassing op alle volgende turns totdat je het wijzigt of een nieuwe sessie start.

**Gedrag op elk niveau:**

| Niveau | Thinking ingeschakeld | Geschat token budget | Use case |
|---|---|---|---|
| `low` | Nee | 0 | Boilerplate, eenvoudige bewerkingen, lookups |
| `medium` | Soms | ~4,000 | Code review, matige refactors |
| `high` | Ja | ~16,000 | Complexe logica, architectuurbesluiten |
| `max` | Ja | ~32,000+ | Research-grade problemen, proofs, diep design |

In de praktijk dekt `high` de meerderheid van taken waar thinking waarde toevoegt. `max` is voor problemen waar je echt Claude meerdere oplossingstrategieën moet laten onderzoeken voordat het zich committeert.

**Huidig effort level controleren:**

```bash
# Het huidige /effort level wordt weergegeven in de sessie statusbalk.
# Om terug te zetten naar standaard (standaard modus):
/effort low
```

### API: `thinking` parameter

Bij direct API-aanroepen geef je een `thinking` blok in het verzoek:

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 16000,
  "thinking": {
    "type": "thinking",
    "budget_tokens": 10000
  },
  "messages": [
    {
      "role": "user",
      "content": "Ontwerp een gedistribueerde rate limiter die 1M RPS verwerkt met sub-milliseconde p99 latentie. Overweeg Redis, token buckets, sliding windows, en gossip protocollen. Rechtvaardigen elke trade-off."
    }
  ]
}
```

**Regels voor `budget_tokens`:**

- Minimum: `1024` — alles lager wordt afgewezen
- Typisch bereik: `8,000–16,000` voor meeste complexe taken
- Hoog-complexiteit bereik: `16,000–32,000`
- Harde limiet: model-afhankelijk; Opus 4.7 ondersteunt tot `32,000+`; controleer modeldocs voor huidige limieten
- `budget_tokens` moet kleiner zijn dan `max_tokens`

Claude kan minder tokens gebruiken dan het budget. Het budget is een plafond, geen garantie.

---

## Het API-antwoord: thinking blokken

Als thinking is ingeschakeld, bevat het antwoord een `thinking` blok vóór de tekstblok:

```json
{
  "id": "msg_01XFDUDYJgAACTu2zCjM9e64",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "thinking",
      "thinking": "Laat me de rate limiter ontwerp systematisch doorwerken. De kernconstraint is 1M RPS met sub-milliseconde p99...\n\nOptie 1: Redis met token bucket...\nVoordelen: Eenvoudig, algemeen begrepen\nNadelen: Redis wordt een bottleneck op 1M RPS — single-threaded command execution, network RTT voegt latentie toe...\n\nOptie 2: In-process sliding window met gossip sync...\n[Claude gaat door met redenering over opties, vervolgens synthetiseert]\n\nConclusie: Hybrid aanpak — in-process counters met async gossip voor cross-node coördinatie..."
    },
    {
      "type": "text",
      "text": "## Gedistribueerd Rate Limiter Ontwerp\n\nVoor 1M RPS op sub-milliseconde p99, is Redis alleen onvoldoende als primaire counter store..."
    }
  ],
  "usage": {
    "input_tokens": 147,
    "output_tokens": 2341,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0
  }
}
```

Het `thinking` veld is de ruwe notitieblok content. Het is menselijk leesbaar maar niet het gepolijste antwoord — verwacht exploratieve taal, doodlopende steegjes die Claude opgeeft, en voorlopige conclusies herzien mid-gedachte. Het uiteindelijke `text` blok is het daadwerkelijke antwoord.

---

## Kostenmodel

Thinking tokens worden gefactureerd tegen dezelfde snelheid als output tokens. Ze zijn niet korting.

```
Totale kosten = (input_tokens × input_tarief) + (thinking_tokens × output_tarief) + (output_tokens × output_tarief)
```

**Voorbeeld op Sonnet 4.6 prijzen (illustratief, verifieer huidige tarieven op anthropic.com):**

| Component | Tokens | Tarief (per 1M) | Kosten |
|---|---|---|---|
| Input | 500 | $3.00 | $0.0015 |
| Thinking | 8,000 | $15.00 | $0.12 |
| Output | 800 | $15.00 | $0.012 |
| **Totaal** | | | **$0.1335** |

Zonder thinking:

| Component | Tokens | Tarief (per 1M) | Kosten |
|---|---|---|---|
| Input | 500 | $3.00 | $0.0015 |
| Output | 800 | $15.00 | $0.012 |
| **Totaal** | | | **$0.0135** |

Extended thinking kost ongeveer 10× meer op deze voorbeeldtaak. Die vermenigvuldiger is de juiste grootte voor typisch gebruik. Wanneer je een moeilijk probleem eenmaal oplost, zijn die kosten triviaal. Wanneer je het in een loop aanroept over duizenden inputs die geen redenering vereisen, is het een significante regressie.

**Thinking tokens profiteren niet van prompt caching.** Input tokens vóór het thinking blok kunnen in cache worden opgeslagen, maar de thinking output zelf niet. Structureer verzoeken zodat stabiele systeemaanwijzingen en context gepositioneerd zijn om van caching te profiteren vóór het `thinking` blok.

---

## Streaming met thinking

Bij het streamen van een thinking-enabled respons, streamen `thinking` blokken en `text` blokken apart. Het thinking blok is voltooid voordat het tekstblok in meeste clients begint.

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "thinking",
        "budget_tokens": 8000
    },
    messages=[{"role": "user", "content": "..."}]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if event.content_block.type == "thinking":
                print("[Thinking gestart]")
            elif event.content_block.type == "text":
                print("[Respons gestart]")
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                # Raw thinking tokens streamen
                pass  # Onderdruk als je het niet wilt weergeven
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

In gebruikersgerichte producten kun je het thinking blok volledig verbergen en alleen het `text` blok streamen. De latentie naar eerste teksttoken is hoger met thinking ingeschakeld — kalibreer je UX loading states dienovereenkomstig.

---

## Standaard vs thinking modus: dezelfde prompt, verschillende outputs

**Prompt:** "Een functie loopt in O(n log n) gemiddelde geval. Je moet 10M items in minder dan 2 seconden op een machine met 8 cores verwerken. Is dit haalbaar? Wat zijn de faalzones?"

**Standaard modus antwoord (afgekort):**

> O(n log n) op 10M items is ongeveer 10M × 23 ≈ 230M operaties. Bij 1 miljard operaties/seconde per core, dat is 0,23 seconden single-threaded. Met 8 cores ben je goed in de buurt van 2 seconden. Hoofdfaalzones: geheugen bandbreedte, cache misses, en thread synchronisatie overhead.

Correct op oppervlakteniveau. Mist verscheidene betekenisvolle faalzones.

**Thinking modus antwoord (afgekort, uit werkelijk thinking blok):**

*Thinking:* "Laat me voorzichtig zijn hier. O(n log n) gemiddeld geval — wat is het slechtste geval? Niet gespecificeerd. Wat is de constante factor? Niet gespecificeerd. Geheugen toegangspatroon? Niet gespecificeerd. 'Functie' — is dit vergelijkingsgebaseerde sort? Graafalgoritme? Het raamwerk is ambigu..."

*Antwoord:*

> Haalbaarheid hangt af van factoren die de vraag open laat. Hier is wat je moet vastpinnen voordat je op dit ontwerp committeert:
>
> **De wiskunde op gezicht waarde:** 10M × log₂(10M) ≈ 230M operaties. Bij realistische IPC op modern hardware (~2–4 effectieve ops/cycle op 3GHz), heb je ongeveer 6–12 miljard "operation slots" per seconde per core. Single-threaded, dit is triviaal snel. Maar deze berekening verbergt de ware risico's.
>
> **Faalzones die je werkelijk zullen bijten:**
>
> 1. **Constante factor:** O(n log n) met grote constante (bijv. cache-unfriendly geheugen toegang) kan 10–100× langzamer zijn dan de theoretische ondergrens. Een sort met goede cache localiteit verslaat een theoretisch equivalent algoritme met pointer chasing elke keer.
>
> 2. **Worst-case degeneratie:** Als het gemiddelde geval O(n log n) is maar worst case is O(n²) (bijv. naïeve quicksort op adversarial input), production data zal het uiteindelijk raken.
>
> 3. **Parallelisering overhead:** Splitting 10M items over 8 cores introduceert synchronisatie op merge punten. Voor algoritmen waar de merge stap O(n) is, kun je meeste van je parallelisering gain verliezen.
>
> 4. **Geheugen bandbreedte plafond:** Op 10M items × 8 bytes elk = 80MB. Dat past in L3 op meeste server chips, maar alleen net. Als de working set niet past, geheugen bandbreedte (niet compute) wordt de bottleneck, en core count stopt met helpen.
>
> 5. **Het 2-seconde budget is de verkeerde metriek:** p99 of p999 latentie is wat je zal paged worden. Als het gemiddelde 1,8 seconden is maar p99 is 4,1 seconden, ben je over budget wanneer het ertoe doet.

Het thinking modus antwoord surfacet wat de vraag werkelijk vroeg — niet alleen een berekening, maar een volledige haalbaarheidsanalyse. Dit is het patroon waarbij extended thinking betaalt: problemen waarbij een ondiep antwoord technisch correct is maar operationeel onbruikbaar.

---

## Wanneer extended thinking gebruiken

Gebruik extended thinking wanneer de taak één of meer van deze eigenschappen heeft:

**Multi-stap dependency chains.** Elke stap's correctheid hangt af van een vorige stap. Een fout in stap 2 verspreidt zich en corrumpeert stappen 3–10. Lineaire generatie is broos hier; thinking modus stelt Claude in staat tussentijdse stappen te verifiëren voordat het zich committeert.

**Ambigueuze of ondergespecificeerde vereisten.** Als de vraag verborgen aannames of meerdere geldige interpretaties bevat, thinking modus laat Claude interpretaties inventariseren en bewust kiezen in plaats van zich aan de eerste plausibele lezing te committeren.

**Wiskundige of logische correctheid.** Proof verificatie, algoritmische correctheidsanalyse, complexiteitsgrenzen. Deze vereisen het controleren van meerdere gevallen en het volgen van constraints — lineaire generatie neigt edge cases over te slaan.

**Architectuurbesluiten met niet-voor-de-hand-liggende trade-offs.** Systeemontwerp, datamodel keuzes, API contract ontwerp. Het juiste antwoord hangt af van constraints die op niet-voor-de-hand-liggende manieren interacteren. Thinking modus maakt de constraint analyse expliciet.

**Debugging complexe systeeminteracties.** Als een bug's wortelcause meerdere systemen overspant en redenering over timing, staat, en bijwerkingen gelijktijdig vereist.

**Veiligheids-gevoelige logica.** Auth flows, permission modellen, cryptografische protocol implementatie. De kosten van een fout zijn hoog; de extra latentie en kosten van thinking is goedkoop ter vergelijking.

---

## Wanneer extended thinking NIET gebruiken

Extended thinking verspilt geld en voegt latentie toe met geen kwaliteitsvoordeel op:

**Eenvoudige CRUD en boilerplate.** Het genereren van een REST endpoint, schrijven van een modelklasse, scaffolding een component. Deze taken hebben één duidelijke structuur. Thinking verbetert ze niet.

**Vertaling en lokalisatie.** Het converteren van content naar een ander taal. De taak is token-voor-token mapping, niet redenering. Thinking modus op vertaling brandt output token budget voor geen voordeel.

**Lookups en samenvatting.** "Wat doet deze functie?" of "Vat dit bestand samen." Het antwoord is in de input. Geen redenering vereist.

**High-volume loops.** Als je de API aanroept in batch over duizenden soortgelijke inputs, thinking modus vermenigvuldigt je kosten met 5–15×. Reserveer thinking voor de planning fase; gebruik standaard modus voor uitvoering.

**Tijdgevoelige interactieve flows.** Autocomplete, inline suggesties, chat responses waar de gebruiker een sub-secondaire respons verwacht. De thinking latentie voelt kapot.

**Iteratieve drafting.** Eerste-draft generatie, brainstorming, speculatieve verkenning. Je wilt volume en variëteit, niet rigeur. Gebruik standaard modus en itereer.

---

## Claude Code integratie: `/effort` in praktijk

Als je `/effort high` of `/effort max` instelt in een Claude Code sessie, veranderen verscheidene gedragingen:

- **Tool call planning verbetert.** Voordat het een reeks van reads, edits, en bash aanroepen uitgeeft, zal Claude intern door het volledige plan redeneren in plaats van zich aan de eerste plausibele actie te committeren. Dit reduceert mid-sequence backtracking.

- **Multi-file operaties zijn coherenter.** Als een taak wijzigingen over verscheidene bestanden vereist die consistent moeten blijven, helping thinking modus Claude alle constraints gelijktijdig in scope houden.

- **Ambigueuze task decompositie verbetert.** Als je task beschrijving is ondergespecificeerd, Claude is meer waarschijnlijk de ambiguïteit te oppervlakken en vragen, in plaats van te raden en onjuist verder te gaan.

- **Error recovery is beter.** Als een tool aanroep een onverwacht resultaat terugeeft, thinking modus maakt Claude meer waarschijnlijk door redeneering wat fout ging in plaats van dezelfde actie opnieuw te proberen.

**Aanbevolen sessie patroon:**

```
# Start van complexe taak
/effort high

# ... werk door het complexe design/architectuur ...

# Switch terug bij verplaatsen naar implementatie
/effort low

# ... genereer de boilerplate, schrijf de tests, etc. ...

# Switch terug voor enig hard debugging of cross-cutting concerns
/effort high
```

Laat `/effort high` niet voor een hele lange sessie. Je betaalt thinking token tarieven op elke turn, inclusief "ok, lees dit bestand" en "nu voer de tests uit" turns die niets van redenering winnen.

---

## Echte use cases

### 1. Database schema migratie onder constraints

**Prompt:**
```
We migreren van een single-tenant Postgres schema (één DB per klant) naar
een multi-tenant schema (rij-level isolatie via tenant_id). We hebben 47 tabellen,
verscheidene met cross-table foreign keys. We kunnen geen downtime veroorloven. We verwerken
8.000 schrijftransacties/minuut op piek. Ontwerp de migratiestrategie.
```

**Waarom thinking helpt:** De migratie moet foreign key constraints, backfill ordering, index wijzigingen, en zero-downtime cutover gelijktijdig verwerken. Deze constraints interacteren — een ordering die foreign keys bevredigt kan met backfill performance conflicteren. Lineaire generatie kiest één constraint op te lossen eerst en retrofit vervolgens de anderen, vaak producerend een plan met een stille faalmode. Thinking modus laat Claude constraint interacties inventariseren voordat het zich aan een plan committeert.

---

### 2. Compiler bug wortelcause analyse

**Prompt:**
```
Onze Rust binaire compileert schoon maar segfaults op runtime alleen wanneer gecompileerd
met --release en alleen op ARM64. De crash is in een hot loop die byte arrays verwerkt.
Geen unsafe code in onze codebase. Hier is het relevante assembly diff
tussen debug en release: [...]
```

**Waarom thinking helpt:** De wortelcause betreft LLVM optimalisatie pass interacties, alignment veronderstellingen, en undefined behavior in safe-looking Rust code. Diagnosering vereist meerdere hypothesen gelijktijdig houden en redenering welke assembly patronen overeenkomen met welke source-level constructies. Dit is een klassieke thinking-mode taak.

---

### 3. API contract ontwerp voor backwards compatibiliteit

**Prompt:**
```
We moeten paginering aan een API endpoint toevoegen dat momenteel alle resultaten retourneert.
Onze API heeft 200+ externe consumers. We kunnen bestaande integraties niet breken.
Het huiselijke response schema is: { "results": [...] }. Ontwerp de versieing
en migratie pad.
```

**Waarom thinking helpt:** Het ontwerp moet nieuwe consumers (die paginering nodig hebben) bevredigen, oude consumers (die de flat array verwachten), en de transitie periode (waar beide bestaan). Deze constraints suggereren verschillende benaderingen die wederzijds exclusief zijn zonder voorzichtig ontwerp. Thinking modus kaart de constraint ruimte in kaart voordat het een structuur stelt.

---

### 4. Gedistribueerde systemen correctheid verificatie

**Prompt:**
```
Dit is ons leader election algoritme. Identificeer alle condities waaronder
twee nodes gelijktijdig geloven dat zij de leader zijn.
[algoritme pseudocode volgt]
```

**Waarom thinking helpt:** Safety property schendingen in gedistribueerde algoritmes vereisen exhaustief controleren van alle interleavings van gelijktijdige events. Lineaire generatie controleert de duidelijke gevallen en stopt. Thinking modus is waarschijnlijker de systematische geval analyse construeren die subtiele races vindt.

---

### 5. Security model review

**Prompt:**
```
Hier is ons permission model voor een multi-tenant SaaS. Gebruikers behoren tot
organisaties. Organisaties hebben rollen. Resources behoren tot organisaties.
Gebruikers kunnen resources cross-organisatie delen met expliciete grants.
Identificeer privilege escalatie paden. [schema en permission check code volgt]
```

**Waarom thinking helpt:** Privilege escalatie kwetsbaarheid leven op de kruising van meerdere permission regels. Hun vinden vereist de volle permission model in gedachten houden terwijl redenering over reeksen van geldige-uitziende operaties die in een ongeldig staat componeren. Dit is precies het type van multi-constraint redenering waar thinking modus nauwkeurigheid verbetert.

---

## Token budget sizing gids

Het kiezen van de juiste `budget_tokens` waarde gaat niet om maximalisering — het gaat om matching de complexiteit van de taak.

| Task complexiteit | Aanbevolen budget | Voorbeelden |
|---|---|---|
| Matig | 4,000–6,000 | Code review, single-functie debugging, datamodel vragen |
| Hoog | 8,000–12,000 | Architectuurbesluiten, multi-file refactors, algoritme ontwerp |
| Zeer hoog | 16,000–24,000 | Systeemontwerp onder harde constraints, security reviews |
| Maximaal | 32,000+ | Compiler correctheid, formele verificatie, proof analyse |

Start op 8.000 en verhoog alleen als je truncated redenering observeert. Tekens dat het budget te klein is:

- Het thinking blok eindigt abrupt mid-analyse
- Het uiteindelijke antwoord mist constraints die zichtbaar waren in het prompt
- Het antwoord haagt zwaai waar een doelbewust antwoord mogelijk was

Tekens het budget is te groot:

- Het thinking blok is repetitief — Claude onderzoekt dezelfde branch meerdere malen
- Het uiteindelijke antwoord verbetert niet significant over wat een 4.000-token budget produceerde
- Latentie is hoog maar het antwoord is een eenvoudige aanbeveling

---

## Extended thinking checklist

Gebruik dit voordat je thinking modus inschakelt. Als minder dan 3 items van toepassing zijn, gebruik standaard modus.

- [ ] De taak heeft meer dan 2 sequentiële afhankelijkheden (stap A moet correct zijn voordat stap B kan vooruitgaan)
- [ ] De taak bevat expliciete of verborgen constraint conflicten die resolutie vereisen
- [ ] Een onjuist antwoord zou duur zijn om te vinden en te fixeren (production bug, security issue, irreversibele migratie)
- [ ] De taak betreft een correctheid eigenschap, niet alleen stijl of structuur voorkeur
- [ ] Je bent teleurgesteld door een standaard-modus antwoord op een soortgelijke taak eerder
- [ ] Het prompt is ambigu op een manier die interpretatie voordat het antwoord vereist
- [ ] De taak vereist cases inventariseren (alle error condities, alle interleavings, alle edge cases)
- [ ] De taak overspant meerdere systemen of bestanden die wederzijds consistent moeten blijven
- [ ] De taak is een eenmalige beslissing (niet een high-volume batch operatie)
- [ ] Je hebt tijd voor de latentie — dit is geen gebruikersgerichte synchrone aanroep

---

## Gewone fouten

**`/effort max` instellen voor een hele sessie.** De kosten vermenigvuldiger is van toepassing op elke turn, inclusief triviale. Gebruik gerichte effort verhoging voor de moeilijke onderdelen, val terug naar `low` voor uitvoering.

**Thinking modus op creatieve taken gebruiken.** Extended thinking verbetert niet proza, design brainstorming, of content generatie. De kwaliteitsverbetering is specifiek voor taken logische correctheid vereisen.

**Het thinking blok ignoren in debugging.** Als thinking modus een fout antwoord produceert, lees het thinking blok eerst. Het openbaart meestal exact waar de redenering fout ging, dat is het meest directe pad naar het fixeren van je prompt.

**`budget_tokens` als kwaliteit dial behandelen.** De budget verdubbelen verdubbelt niet betrouwbaar de kwaliteit. Voorbij een task-passende plafond, extra budget produceert repetitieve redenering zonder betere conclusies. Start op 8.000 en valideer voordat je hoger gaat.

**Thinking op streaming endpoints met nauwe latentie budgets inschakelen.** Thinking modus vertraagt de eerste text token door de volle duur van de thinking fase. Als je UI een typing indicator toont en gebruikers een respons verwachten binnen 1–2 seconden, dit voelt kapot. Ofwel verberg de thinking fase achter een doelbewuste loading state ofwel schakel thinking op dat endpoint uit.

---
