# RPI — Research, Plan, Implement

De RPI-workflow is een 3-fase multi-agent proces voor feature-ontwikkeling. Elke fase heeft gedefinieerde agents, een concrete output-artefact en een poort die moet slagen voordat de volgende fase start. Het doel is om de twee meest voorkomende verspillende technische inspanningsmodi uit te schakelen: het verkeerde bouwen (overgeslagen onderzoek) en verkeerd bouwen (overgeslagen planning).

---

## Wanneer RPI versus gewoon te coderen

**RPI gebruiken voor:**
- Nieuwe functies die meer dan 1 dag zullen duren
- Wijzigingen die meerdere systemen of teams aanraken
- Werk in een onbekende codebase
- Cross-cutting concerns (auth, caching, observability) waarbij het verkeerd krijgen van de architectuur duur is om te repareren

**RPI overslaan voor:**
- Hotfixes en incident response
- Configuratiewijzigingen zonder logicaimpact
- Taken geschat onder 2 uur
- Zuivere refactors in één goed-begrepen bestand

De overhead van RPI is ruwweg 20–30% van totale tijd. Voor alles onder 2 uur overschrijdt de overhead het voordeel.

---

## Mapstructuur

```
rpi/
└── {feature-slug}/
    ├── RESEARCH.md        ← Phase 1 output
    ├── plan/
    │   ├── pm.md          ← User stories
    │   ├── ux.md          ← User flows
    │   └── eng.md         ← File-by-file implementation plan
    ├── PLAN.md            ← Phase 2 summary (gate artifact)
    └── IMPLEMENT.md       ← Phase 3 decision log
```

Alle RPI-artefacten leven onder `rpi/{feature-slug}/`. Geen onderzoeks- en plandocumenten verspreiden over de codebase.

---

## Fase 1: Research

### Agents

- **requirement-parser**: extraheert functioneel en niet-functioneel vereisten uit het verzoek, identificeert onduidelijkheden en produceert een gestructureerde vereistenlijst
- **codebase-explorer** (Explore tool): wijst de relevante delen van de codebase in kaart — bestaande patronen, invoerpunten, afhankelijkheden, soortgelijke functies al geïmplementeerd
- **product-manager**: controleert de vereistenlijst en codebase bevindingen, vervolgens geeft een GO/NO-GO uitspraak

### Wat wordt geproduceerd

`rpi/{feature-slug}/RESEARCH.md` — gestructureerd document bevat:

```markdown
# Research: {Feature Name}

## Requirements
### Functional
- [list]
### Non-functional
- [latency, security, scale, etc.]

## Ambiguities
- [open questions that need answers before planning]

## Codebase Findings
- [relevant files, patterns, existing abstractions]
- [similar features and how they were built]
- [potential conflict points]

## GO / NO-GO
**Verdict:** GO | NO-GO
**Rationale:** [3–5 sentences]
**Blockers (if NO-GO):** [what must be resolved before re-evaluating]
```

### Wat maakt een goed GO/NO-GO

De PM agent evalueert vier dimensies:

| Dimensie | GO signaal | NO-GO signaal |
|-----------|-----------|--------------|
| Markt nodig | Duidelijke gebruikersbehoefte, ondersteund door gegevens of expliciet verzoek | Vaag of aangenomen behoefte |
| Technische haalbaarheid | Bestaande patronen ondersteunen het; geen onbekende blockers | Vereist tech nog niet geverifieerd |
| Scoop duidelijkheid | Vereisten zijn specifiek en begrensd | Open-ended of uitbreidende scoop |
| Hulpbronkosten | Past in sprintcapaciteit | Vereist meer dan beschikbare capaciteit |

Een NO-GO is geen afwijzing — het is een wacht. De blockers sectie bepaalt wat het oplost.

---

## Fase 2: Plan

**Poort:** RESEARCH.md moet bestaan met GO-uitspraak. Plan nooit zonder onderzoek. Implementeer nooit zonder plan.

### Agents

- **product-manager**: converteert vereisten naar gebruikersverhalen met acceptatiecriteria (`plan/pm.md`)
- **ux-agent**: wijst gebruikersstromen end-to-end in kaart, identificeert edge cases, definieert lege staten en foutstatussen (`plan/ux.md`)
- **engineering-agent**: produceert een bestand-voor-bestand implementatieplan — elk bestand dat wordt gemaakt of gewijzigd, in de volgorde waarop wijzigingen moeten plaatsvinden, met beschrijving van elke wijziging (`plan/eng.md`)
- **cto-advisor**: controleert het engineeringplan op architectuurkwaliteit, schaalbaarheid, en afstemming op bestaande patronen — keurt goed of vraagt herziening

### Output structuur

**`plan/pm.md`:**
```markdown
# User Stories

## Story 1: {title}
As a {role}, I want {capability} so that {benefit}.

**Acceptance criteria:**
- [ ] criterion 1
- [ ] criterion 2
```

**`plan/ux.md`:**
```markdown
# User Flows

## Happy path
[step-by-step flow]

## Edge cases
- [empty state: what user sees]
- [error state: what user sees]
- [loading state]
```

**`plan/eng.md`:**
```markdown
# Engineering Plan

## Files to create
1. `src/features/payments/charge.ts` — new charge handler implementing X interface
2. `src/api/routes/payments.ts` — new route, delegates to charge handler

## Files to modify
3. `src/api/router.ts` — register new payments route
4. `src/types/index.ts` — add ChargeRequest and ChargeResponse types

## Implementation order
Execute in the order listed. File 4 (types) before files 1 and 2.

## Dependencies
- Requires: Stripe SDK already installed (verify first)
- Creates: no new external dependencies
```

**`PLAN.md`** — een 1-pagina samenvatting die alle drie plandocumenten consolideert. De CTO-adviseur goedkeuring gaat hier. Dit is de poort-artefact.

### Poortregel

Implementatie begint niet totdat `PLAN.md` bestaat en de CTO-raadsman het heeft goedgekeurd. Als de raadsman wijzigingen aanvraagt, herzien `plan/eng.md` en herbouw `PLAN.md`. Geen uitzonderingen — implementatie starten vóór PLAN.md goedkeurig is de primaire bron van rework in agentische ontwikkeling.

---

## Fase 3: Implement

**Poort:** PLAN.md moet goedgekeurd zijn.

### Hoe eng.md te volgen

Voer wijzigingen uit in de exacte volgorde in `plan/eng.md` vermeld. Herorder niet op basis van wat gemakkelijk lijkt — de volgorde weerspiegelt afhankelijkheid volgorde en bouw stabiliteit op elk moment.

Voor elk bestand:
1. Lees de beschrijving in eng.md
2. Implementeer de wijziging
3. Voer alle relevante tests uit
4. Controleer het bestand in eng.md af (markeer `[x]`)

### Code-reviewer-poort

Na het voltooien van 3–5 bestanden (of op een natuurlijke grens zoals het voltooien van een laag), spawn u een code-reviewer agent om het voltooide werk tegen acceptatiecriteria in pm.md en engineeringplan in eng.md controleren. Wacht niet tot volledige implementatie — problemen vinden laat is duur.

De reviewer voert eenvoudig pass/fail uit met specifieke lijnfeedback. Bij mislukking, fix voordat u doorgaat.

### Beslissingslogboek

`IMPLEMENT.md` vat besluiten vast die tijdens implementatie zijn genomen die afwijken van het plan of ambiguïteiten niet behandeld in planning oplossen:

```markdown
# Implementation Log: {Feature Name}

## Decisions

### [2026-05-23] Changed charge handler interface
Plan specified X interface. During implementation found X conflicts with existing session middleware.
Decision: used Y interface instead. Updated plan/eng.md to reflect change.

### [2026-05-23] Added retry logic not in plan
Found Stripe SDK throws intermittent 503s. Added exponential backoff (3 retries).
No plan change needed — this is additive and within scope.
```

Besluiten die de scoop of design wijzigen, moeten worden teruggemarkeerd naar de engineeringagent voor planherziening voordat deze worden geïmplementeerd. Besluiten die zuiver implementatiedetails zijn, gaan in IMPLEMENT.md zonder planupdate nodig.

---

## RPI aanpassen aan Solo versus Team

| Fase | Solo | Team |
|------|------|------|
| Research | Run requirement-parser + explorer; skip PM if feature is your own | All agents; PM agent output reviewed by a human PM |
| Plan | Skip UX agent for backend-only features | All agents; eng.md reviewed by a second engineer |
| Implement | Single engineer follows eng.md | Assign files to engineers by eng.md section; reviewer agent runs after each section |

De kernregel blijft hetzelfde in beide gevallen: geen fasen overslaan en geen implementatie zonder ondertekend plan. Solo-ontwikkeling is geen reden om onderzoek over te slaan — het is de primaire reden om ernstiger erover te zijn.

---
