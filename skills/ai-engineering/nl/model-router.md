---
name: model-router
updated: 2026-06-23
---

# Model Router — Mixture of Experts Routering

## When to activate

- Gebruiker vraagt welk Claude-model voor een taak moet worden gebruikt ("Moet ik Opus of Haiku gebruiken?")
- Kosten optimaliseren door routering naar het goedkoopste capabele model-niveau
- Een multi-agent workflow bouwen en modeltiers aan subtaken toewijzen
- Gebruiker noemt "MoE", "model routing", "tier selection", "kostenoptimalisatie", "intelligente modelkeuze"
- Debuggen van een workflow waar het verkeerde model voor een taak was geselecteerd
- Grenzen van mogelijkheden van Haiku/Sonnet/Opus begrijpen en wanneer ertussen te wisselen
- Sessie heeft tokenbudget-beperkingen en heeft dynamische routering nodig

## When NOT to use

- Model is al expliciet door de gebruiker opgegeven (geen routering nodig)
- Enkel kort interactief gesprek waarbij overhead voordeel overstijgt
- Taak is duidelijk alleen Opus (veiligheidsarchitectuurreview, dreigingsmodellering) — routering overslaan
- Kwaliteit is enige zorg en kosten zijn onbeperkt — standaard naar Opus
- Gebruiker stelt algemene vragen over Claudes mogelijkheden (niet taakspecifieke routering)

## Instructions

### Routing Mode 1: Tier Router (Task Classification)

Analyseert taaktekst op complexiteitssignalen — trefwoorden, woordaantal, domeinhinten.

**Logica voor tiertoewijzing:**
- **Opus tier** geactiveerd door trefwoorden: architect, architecture, security, threat, exploit, vulnerability, design system, reasoning, planning, explore, critique, ambiguous, tradeoff, evaluate options, decide, strategy, complex decision, deep dive, analysis
- **Haiku tier** geactiveerd door trefwoorden: format, lint, rename, translate, classify, extract, boilerplate, generate stub, template, sort, list, summarize short, count, convert, reformat, cleanup, validation, parsing, simple task
- **Sonnet tier** is standaard fallback voor algemeen werk (codering, refactorisering, schrijven, orchestratie)

**Betrouwbaarheidsscore**: Hogere betrouwbaarheid (0.7+) wanneer meerdere trefwoorden overeenkomen. Lagere betrouwbaarheid (0.4) wanneer taakbeschrijving vaag of zeer kort is.

**Wanneer te gebruiken**: Snelle, automatische tierselectie wanneer u direct zonder complexe redeneringen moet routeren.

### Routing Mode 2: Cascade Escalator (Progressive Refinement)

Begint met het goedkoopste capabele model, escaleert naar hogere tiers alleen wanneer betrouwbaarheid onvoldoende is.

**Stroom:**
1. Initiële classificatie levert een tier + betrouwbaarheidsscore op
2. Wenn betrouwbaarheid < drempel (standaard 0.65), escaleer een tier hoger (Haiku → Sonnet → Opus)
3. Stop bij Opus of wanneer betrouwbaarheidsdrempel is bereikt
4. Maximale escalaties standaard op 2 (voorkomt ongecontroleerde escalatie)

**Wanneer te gebruiken**: Onzekere taakgrenzen waarbij u liever goedkoop begint en naar behoefte escaleert. Balanceert kosten met veiligheid.

**Configuratie:**
- `--confidence-threshold`: Herclassificeren bij hogere tier als hieronder (standaard 0.65)
- Maximale escalaties beperkt tot 2

### Routing Mode 3: Parallel Expert Panel (Multi-Model Voting)

Voert dezelfde taakprompt tegen alle 3 modeltiers gelijktijdig uit, aggregeert resultaten via stemming.

**Stemstrategieën:**
- **Majority**: Tier gekozen door de meeste experts wint (bijv. 2/3 stemmen voor Sonnet)
- **Confidence-weighted**: Score elke tier op gemiddelde betrouwbaarheid; tier met hoogste betrouwbaarheid wint
- **Synthesis**: Alle 3 resultaten retourneren aan extern jurytier (Sonnet) om consensus te synthetiseren

**Wanneer te gebruiken**: Kritieke beslissingen (beveiligingsontwerpen, architectuurkeuzes) waarbij u consensus van diverse modelkrachten wilt. Kost 3x meer tokens vooraf, maar reduceert escalatie-/pogingrisk.

### Routing Mode 4: Domain Expert Router (Path-Based Routing)

Routeert op basis van bestandspaden en taakdomein, zonder taaktekst diepgaand te inspecteren.

**Domeinregels** (gecontroleerd in prioriteitsvolgorde):
| Padpatroon | Domein | Tier | Redenering |
|---|---|---|---|
| `security/`, `auth`, `credentials`, `secrets`, `cors` | Beveiliging | **Opus** | Hoog risico, exploit-gerelateerd |
| `architecture/`, `.yaml`, `.yml`, `.tf` | Infra/Architectuur | **Opus** | Systeemontwerp-beslissingen |
| `data/`, `ml/`, `.py` | Data/ML | **Sonnet** | Complex maar niet architecturaal |
| `.ts`, `.tsx`, `.js`, `.jsx` | Broncode | **Sonnet** | Coderingwerk, evenwichtige redenering |
| `.md`, `.txt` | Documentatie | **Haiku** | Alleen tekstopmaak |
| (geen paden opgegeven) | Task classification | Per Tier Router | Valt terug op trefwoordanalyse |

**Wanneer te gebruiken**: Codebases met duidelijke domeinstructuur. Automatische routering zonder inspectie-overhead. Ideaal voor high-volume pipelines.

### Routing Mode 5: Budget Governor (Token Ratio Thresholds)

Routeert dynamisch op basis van resterende tokenbudget als percentage van totaal sessiebudget.

**Drempels:**
- Wenn `remaining / total < 15%`: Force Haiku (sparingsmodus; tokens voor kritieke taken behouden)
- Wenn `remaining / total >= 50%` EN taak geclassificeerd als Opus: Gebruik Opus (budgettoestemmend)
- Anders: Gebruik Tier Router-classificatie

**Budgetverhoudingsdrempels:**
- Onder 15%: "budget kritiek" → Alleen Haiku
- 15–50%: "matig budget" → Sonnet of Haiku
- 50%+: "gezond budget" → Elke tier toegestaan

**Wanneer te gebruiken**: Langlopende sessies met vaste tokenlimieten. Zorgt ervoor dat u geen tokentekort krijgt tijdens de sessie door automatische complexiteitsverlaging onder budgetdruk.

**Configuratie:**
- `totalBudget`: Sessie-tokenbudget (standaard 100000)
- `opusThreshold`: Opus gebruiken alleen wanneer >= 50% overblijft (standaard 0.5)
- `haikuThreshold`: Force Haiku wanneer < 15% overblijft (standaard 0.15)

### Using the CLI

**Taak classificeren:**
```bash
claudient moe classify "Format the JSON output"
# → Tier: HAIKU, Confidence: 85%, Reasoning: 2 haiku keywords detected
```

**Escalatiepad weergeven:**
```bash
claudient moe cascade "Design a distributed system" --confidence-threshold=0.7
# → Original Tier: SONNET, Escalations: 1, Final Tier: OPUS
```

**Expertstemming ophalen:**
```bash
claudient moe panel "Review this code" --strategy=majority
# Toont Haiku, Sonnet, Opus meningen + stemmingsconsensus
```

**Routeren op bestandsdomein:**
```bash
claudient moe domain "src/security/auth.ts,src/security/jwt.ts" "security audit"
# → Domain: security, Routed Tier: OPUS
```

**Budgetbewuste routering:**
```bash
claudient moe budget "write unit tests" --remaining 25000 --total 100000
# → Budget Ratio: 25%, Routed Tier: SONNET
```

**Systeemstatus:**
```bash
claudient moe status
# Drukt actieve routeringsmodi, drempels, tierkosten af
```

### Programmatic Usage

```javascript
import MoeRouter, { classifyTask, routeByDomain, budgetGovernedRouter } from './lib/moe-router.js';

// Tier Router
const result = classifyTask('Design a microservices architecture');
console.log(result.tier, result.confidence);  // claude-opus-4-7, 0.85

// Domain Router
const domainRoute = routeByDomain(['src/security/auth.ts'], 'refactor');
console.log(domainRoute.tier);  // claude-opus-4-7

// Budget Governor
const governor = budgetGovernedRouter({ totalBudget: 50000 });
const budgetRoute = governor.route('write tests', 7500);  // 15% remaining
console.log(budgetRoute.tier);  // claude-haiku-4-5 (forced)
```

## Example

**Scenario**: Taak is "Refactor the authentication module in `src/security/auth.ts`". Sessie heeft 60.000 tokens resterend van 100.000 totaal.

**Tier Router analyseert:** Trefwoord "refactor" suggereert Sonnet → betrouwbaarheid 0.62

**Domain Router controleert:** Bestandspad bevat "security/" → Opus-kandidaat → hoge betrouwbaarheid

**Budget Governor ziet:** 60% budget resterend >= drempel 50% → Opus toegestaan

**Beslissing:** Domeinsignaal overschrijft tiersignaal. Beveiligingsbestanden routeren altijd naar Opus voor maximale controle.

**Finale selectie:** `claude-opus-4-7`

**CLI-commando:**
```bash
claudient moe domain "src/security/auth.ts" "Refactor the authentication module"
# → Detected Domain: security
# → Routed Tier: OPUS
# → Reasoning: security-sensitive file detected
```

**Budgetimpact:** Met 60% budget resterend is deze Opus-taak aanvaardbaar. Wanneer budget 12% resterend was, zou Budget Governor Haiku hebben geforceerd ondanks beveiligingsdomein (sparingsmodus).

---

## Tier Reference

| Model | Kosten | Snelheid | Redenering | Wanneer te gebruiken |
|---|---|---|---|---|
| **Haiku** | 1x | Snelste | Beperkte redenering | Opmaak, classificatie, sjabloon, boilerplate, eenvoudige extractie |
| **Sonnet** | 12x | Snel | Goede redenering | Algemene codering, refactorisering, documentatie, orchestratie, reviews |
| **Opus** | 300x | Matig | Diepe redenering | Architectuur, beveiliging, dubbelzinnige beslissingen, dreigingsmodellering, complexe planning |

**Kostenopmerking**: Haiku in plaats van Opus kiezen bespaart ~300x tokens voor eenvoudige taken. Cascade Escalator voorkomt overbetaling voor gemakkelijk werk en beschermt tegen onderspecificatie van moeilijke problemen.
