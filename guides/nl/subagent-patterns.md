# Subagent-ontwerppatronen

Hoe multi-agent Claude Code-taken structureren voor parallelisme, juistheid en kostenefficiëntie. Elk patroon hieronder heeft een use case profiel, een tekstueel diagram, implementatierichtlijnen en veelgemaakte fouten om te vermijden.

---

## Subagenten in Claude Code begrijpen

Wanneer Claude Code een subagent spawnt, gebruikt het het `Agent`-hulpmiddel om een afzonderlijke Claude-instantie met zijn eigen contextvenster te starten. De parent-agent blijft werken (of wacht, afhankelijk van het patroon). Subagenten kunnen hulpmiddelen gebruiken, bestanden lezen, bestanden schrijven en resultaten naar de parent retourneren.

Sleutel beperkingen:
- Elke subagent heeft zijn eigen tokenbudget — fan-out vermenigvuldigt kosten lineair
- Subagenten kunnen geheugen niet rechtstreeks delen — ze communiceren via bestanden of retourwaarden
- Spawning is asynchroon standaard; de parent kan wachten op resultaten of doorgaan
- Tooltoestemmingen zijn op elke subagent van toepassing

---

## Patroon 1: Fan-Out

**Verzend N agents gelijktijdig, aggregeer resultaten.**

```
Parent
  ├── Agent A (handles shard 1)
  ├── Agent B (handles shard 2)
  ├── Agent C (handles shard 3)
  └── [wait for all]
        └── Parent aggregates results
```

**Wanneer te gebruiken:**
- Onafhankelijke werkunitseenheden die geen staat delen
- Een lijst verwerken (bestanden, repo's, endpoints, test cases) waarbij elk item zelfstandig is
- Elke taak waarbij opeenvolgende uitvoering N× langer zou duren zonder kwaliteitsbaat

**Wanneer NIET te gebruiken:**
- Taken met gedeelde veranderbare staat (gelijktijdige bestandschrijvingen veroorzaken conflicten)
- Wanneer shardresultaten van elkaar afhangen
- Wanneer tokenkosten een bezorgdheid zijn en kwaliteit-per-token belangrijker is dan snelheid

**Implementatie:**
```
Spawn 4 agents in parallel. Each agent handles one service directory:
  - Agent 1: audit /services/auth/
  - Agent 2: audit /services/payments/
  - Agent 3: audit /services/notifications/
  - Agent 4: audit /services/reporting/

Each agent writes its findings to /tmp/audit-[service].json.
After all 4 complete, read all four files and produce a consolidated report.
```

**Veelgemaakte fouten:**
- Geen uniek uitvoerpad geven voor elke agent (zij overschrijven elkaar)
- Meer agents spawnen dan er betekenisvolle werkunitsen zijn (een 3-regel bestand hoeft geen eigen agent)
- Aggregeren vóór alle agents klaar zijn (controleer op alle uitvoerbestanden voordat u consolideren)

---

## Patroon 2: Validatieketen

**Agent A → poort → Agent B → poort → Agent C. Elke agent kan progressie blokkeren.**

```
Input → Agent A → [GATE: pass/fail?] → Agent B → [GATE: pass/fail?] → Agent C → Output
                        │                               │
                      STOP                            STOP
                  (fix required)                 (fix required)
```

**Wanneer te gebruiken:**
- Kwaliteitshandhavingspijplijnen (schrijven → review → goedkeuren)
- Beveiligings-sensitieve workflows waarbij een ongecontroleerde stap erger is dan geen stap
- Wanneer elke fase een getransformeerde artefact produceert die de volgende fase nodig heeft
- De `workflows/pre-human-review.md` workflow gebruikt dit patroon

**Wanneer NIET te gebruiken:**
- Wanneer fasen onafhankelijk zijn en parallel zouden kunnen draaien (use fan-out in plaats daarvan)
- Wanneer alle agents waarschijnlijk slagen (drie agents review een twee-regel wijziging is over-engineering)
- Wanneer de kosten van de volledige keten de kosten van een enkele voorzichtige agent overschrijden

**Implementatie:**
```
Chain: simplifier → security reviewer → code reviewer

After each agent, check its output for a PASS/FAIL signal before spawning the next.
If any agent returns FAIL, halt the chain and surface the issues.
Only spawn the next agent after explicit PASS.

Never batch the chain into a single agent call — the gate logic must be enforced by the parent.
```

**Veelgemaakte fouten:**
- Poorten te losjes definiëren (elke agent slaagt, de keten biedt geen waarde)
- Poorten te streng definiëren (één mineure waarschuwing halt alles)
- Agents laten weten wat daarna komt (zij moeten onafhankelijk evalueren, niet afstemmen op volgende fase)

---

## Patroon 3: specialistroutering

**Classificeer de taak, route naar de juiste expert-agent.**

```
Input → Classifier → router decision
                          ├── [type: security] → Security Specialist
                          ├── [type: database] → DB Specialist
                          ├── [type: frontend] → UI Specialist
                          └── [type: unknown]  → General Agent
```

**Wanneer te gebruiken:**
- Een heterogene wachtrij van taken die verschillende expertise vereisen
- Een algemeen-doel agent vermijden die aan alles middelmatig is
- Wanneer specialistagenten domein-specifieke instructies dragen die de algemene agent niet zou moeten belasten

**Wanneer NIET te gebruiken:**
- Taken die duidelijk één type zijn — geen behoefte aan classificatie wat u al weet
- Wanneer de classificatie zelf duur is (classificeren van een één-regel bug fix met Sonnet-oproep verspilt tokens)

**Implementatie:**
```
Step 1 — Classify (use Haiku for cost):
  "Read this task description and return one word: security | database | frontend | backend | unknown"

Step 2 — Route based on classification:
  if security → spawn agents/security-reviewer.md
  if database → spawn agents/db-specialist.md
  if frontend → spawn agents/ui-reviewer.md
  else        → spawn general agent

Step 3 — Return specialist's result to the user.
```

**Veelgemaakte fouten:**
- Sonnet of Opus gebruiken voor classificatie — Haiku classificeert net zo nauwkeurig voor een fractie van de kosten
- Naar een specialist routeren maar de volledige context van de classificatie niet geven
- Over-segmentering (10 specialistagenten voor een app die slechts 2 ervan ooit nodig heeft)

---

## Patroon 4: Watchdog

**Een monitorsagent observeert en kan interveniëren op een lange-werkende worker-agent.**

```
Worker Agent ──── progress updates ───→ Watchdog Agent
     │                                        │
     │                                  [monitors for]
     │                                  - stuck loops
     └── [watchdog can signal halt] ←── - dangerous actions
                                        - quality degradation
```

**Wanneer te gebruiken:**
- Lange autonome sessies waarbij off-rails gaan duur is
- Wanneer de worker-agent hulpmiddelen met echte wereld neveneffecten gebruikt (bestandschrijvingen, API-oproepen, deployments)
- Nacht- of onbewakte runs waar u een circuitonderbreker nodig hebt

**Wanneer NIET te gebruiken:**
- Korte taken (< 5 minuten) — de watchdog-overhead is niet de moeite waard
- Alleen-lezen verkenningstaken waarbij het slechtste resultaat een verkeerd antwoord is

**Implementatie:**
```
Spawn watchdog with these triggers:
  HALT if: worker attempts to write to /etc/, run rm -rf, or access .env files
  WARN if: worker has made the same tool call 3+ times without progress
  WARN if: worker output size exceeds 50k tokens (likely looping)
  REPORT at: task completion or halt

Watchdog cannot override the worker directly — it signals the parent, which decides whether to halt.
```

**Veelgemaakte fouten:**
- De watchdog te gevoelig maken (het stopt bij de eerste herpoging, verslaat het doel)
- De watchdog te permissief maken (het vuur nooit, wat valse veiligheid biedt)
- Watchdog op hetzelfde model als de worker (gebruik Haiku voor de watchdog — het observeert, niet redeneren)

---

## Patroon 5: Parallelle onderzoek

**Meerdere agents testen verschillende hypothesen tegelijkertijd; eerste juiste resultaat wint (of alle resultaten worden vergeleken).**

```
Hypothesis 1 → Agent A ─────┐
Hypothesis 2 → Agent B ─────┼──→ Parent compares results → best answer
Hypothesis 3 → Agent C ─────┘
```

**Wanneer te gebruiken:**
- Debuggen waarbij de hoofdoorzaak onduidelijk is en meerdere theorieën zijn aannemelijk
- Onderzoekstaken waarbij verschillende zoekstrategieën verschillende bevindingen kunnen opleveren
- Elke taak waarbij de beste aanpak werkelijk onzeker is vooraf

**Wanneer NIET te gebruiken:**
- Taken waar één duidelijk juiste benadering is
- Kostengevoelige situaties — dit patroon is het duurste per juist antwoord
- Wanneer hypothesen niet onafhankelijk zijn (Agent A's resultaat verandert of Hypothese B geldig is)

**Implementatie:**
```
Spawn 3 agents with different hypotheses for why the database is slow:
  - Agent A: investigate query plans and missing indexes
  - Agent B: investigate connection pool exhaustion
  - Agent C: investigate lock contention

Each agent writes its findings and confidence level to /tmp/hypothesis-[A/B/C].md.
After all complete, compare findings and return the most likely root cause with evidence.
```

**Veelgemaakte fouten:**
- Hypothesen zo gelijk inlijsten dat agents bijna identieke resultaten produceren
- Geen betrouwbaarheidsscore opnemen — zonder deze kunt u niet kiezen tussen conflicterende bevindingen
- Te veel hypothesen uitvoeren (3-4 is meestal juist; voorbij dat, kosten overschrijden het marginale voordeel van nog een theorie)

---

## Token-kostenvergelijking

| Patroon | Relatieve kosten | Beste kostenverheffing |
|---|---|---|
| Fan-out (N agents) | N × single agent | Wanneer N taken volledig paralleliseerbaar zijn |
| Validatieketen (3 agents) | 3× als alles slaagt, minder als vroeg halt | Wanneer vroeg-halt courant is |
| Specialistroutering | ~1× (classificatie is Haiku) | Bijna altijd goedkoper dan general + post-hoc fix |
| Watchdog | ~1.05–1.1× (Haiku watchdog) | Lange autonome sessies |
| Parallelle onderzoek | N× zonder vroeg beëindiging | Alleen wanneer onzekerheid hoog is en fouten duur zijn |

**Kostenbegeleiding:**
- Haiku gebruiken voor: classificaties, watchdogs, vertalingsagents, elke agent waarbij mechanische transformatie optreedt
- Sonnet gebruiken voor: specialisten, reviewers, agents waarvoor oordeel nodig is
- Opus gebruiken voor: transacties met hoog inzet, complexe architectuuranalyse — niet voor ondersteunende rollen

---
