# Claude voor Oprichters en CEO's

Alles wat een startup­oprichter nodig heeft om AI-ondersteunde bedrijfsoperaties te voeren — investeerdersupdates, boardvoorbereiding, OKR-beoordelingen, aanwervings­beslissingen, financiële modellering, concurrentie-intelligentie en het wekelijkse ritme dat een bedrijf in beweging houdt.

---

## Voor wie is dit bedoeld

Je bent een oprichter of CEO bij een venture-backed startup, van pre-seed tot en met Series B. Je doet 15 taken tegelijk: strategie, fondsenwerving, teammanagement, productbeslissingen, klantgesprekken en investeerders­relaties. Claude Code verlaagt de tijdkosten van elk met 5-20x.

**Voor Claude Code:** 3 uur om een boardpresentatie te schrijven. 45 minuten per investeerdersupdate. Een halve dag om een financieel model te bouwen. Diepgaand concurrentie­onderzoek dat een week van contextomschakeling kost.

**Erna:** Boardpresentatie gestructureerd in 30 minuten, ingevuld in 2 uur. Investeerdersupdate in 10-15 minuten. Financieel model iteratief gebouwd in een sessie. Concurrentie-analyse in een uur.

---

## Installatie in 30 seconden

```bash
# Installeer het volledige oprichterspakket
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/board-deck-builder
npx claudient add skill gtm/revenue-operations
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill finance/dcf-model
npx claudient add agents advisors/ceo-advisor
npx claudient add agents advisors/cfo-advisor
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Jouw Claude Code-oprichtersstack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/founder-weekly-review` | Bedrijfsgezondheid, OKR-check, teampuls, CEO-prioriteiten voor volgende week | Elke zondag of maandagochtend |
| `/investor-update` | Maandelijkse investeerders-e-mail: MRR, burn, hoogtepunten, dieptepunten, verzoek | Eerste week van elke maand |
| `/board-deck-builder` | Kwartaalboardpresentatie: statistieken, narratief, slecht nieuws, fondsenwerving | 2 weken voor boardvergadering |
| `/revenue-operations` | Pijplijn­gezondheid, verkoop­statistieken, prognose­nauwkeurigheid, GTM-hefbomen | Wekelijks met je CRO/hoofd verkoop |
| `/commercial-forecaster` | Omzetprognose: bottoms-up en tops-down, scenario­modellering | Maandelijks of vóór fondsenwerving |
| `/pitch-deck` | Investeerders­pitch­narratief voor fondsenwerving nieuwe ronde | Series A / B-voorbereiding |
| `/financial-plan` | Operationeel model, personeelsplan, scenario­planning, kasbeheer | Per kwartaal of vóór fondsenwerving |
| `/dcf-model` | Verdisconteerde kasstroomwaardering, vergelijkings­analyse, cap table-modellering | M&A, secondary, fondsenwerving |

### Agents

| Agent | Model | Wanneer te starten |
|---|---|---|
| `ceo-advisor` | Opus | Strategische beslissingen, org-ontwerp, fondsenwervings­strategie, moeilijke keuzes |
| `cfo-advisor` | Sonnet | Financiële modellering, burn-analyse, cap table, term sheets |
| `cto-advisor` | Sonnet | Technische schuld­beslissingen, aanwervings­lat, bouwen vs. kopen, architectuurrisico |
| `chief-of-staff` | Sonnet | Cross-functionele coördinatie, boardvoorbereiding, all-hands, OKR-tracking |

---

## Dagelijkse workflow

### Ochtendpuls bedrijf (15 minuten)

```
/founder-weekly-review

Ochtend­pulscheck — [DATUM]:
- Wat zijn de 3 belangrijkste dingen die vandaag in het bedrijf gebeuren?
- Eventuele branden van de nacht (klantescalatie, teamkwestie, pers)?
- Wat is mijn meest waardevolle tijdsbesteding vandaag?

Beschikbare data: [plak Slack-samenvatting / MRR-beweging / eventuele nachtelijke updates]
```

### Investeerders- en boardcommunicatie (indien nodig)

```
/investor-update

Stel mijn [maandelijkse update / halverwege­notitie / ad-hoc update] op:
Maand: [MAAND]
Kernstatistiekbeweging: [MRR- of ARR-wijziging]
Nieuws in deze periode: [winsten, uitdagingen, vertrek CTO, nieuwe aanwerving, etc.]
Verzoek: [wat ik deze maand van investeerders nodig heb]
```

### Financiële beoordeling (wekelijks, 30 minuten)

```
/financial-plan

Wekelijkse financiële check:
- Kas: [$X] | Burn: [$X/maand] | Looptijd: [X maanden]
- MRR deze week: [$X] | vs. vorige week: [$X]
- Onverwachte kosten deze week?

Hoe zien de volgende 90 dagen eruit op de huidige koers?
Wat zou nodig zijn om de looptijd met 2 maanden te verlengen zonder te werven?
```

### Wekelijkse planning (vrijdagmiddag of zondag)

```
/founder-weekly-review

Einde-van-week-beoordeling voor week van [DATUM].

[Plak: MRR, pijplijnupdates, teamnieuws, OKR-check, eventuele branden]

Produceer: bedrijfsgezondheids­stoplicht, OKR-status, 3 winsten, 2 dieptepunten, CEO-prioriteiten voor volgende week, de ene beslissing die ik moet nemen.
```

---

## Sleutelworkflows per scenario

### Fondsenwerving

```
1. Onderzoek de ronde:
/dcf-model + /financial-plan
Welke ARR en statistieken heb ik nodig om te werven bij [doelwaardering]?

2. Bouw het narratief:
/pitch-deck
Series [X] narratief — huidige ARR, groeipercentage, gebruik van middelen, marktthesis.

3. Investeerdersgesprekken voorbereiden:
/ceo-advisor (agent)
Help me de 10 moeilijkste vragen te anticiperen die een [tier-1 VC] zal stellen.

4. Volgen en sluiten:
/commercial-forecaster
Modelleer mijn fondsenwerving­pijplijn: [N investeerders in welke fase] → verwachte sluitingsdatum.
```

### Een sleutel­executive aanwerven

```
/ceo-advisor

Ik werf een [VP Sales / CTO / CFO]. Help me:
1. Het profiel definiëren (must-haves vs. nice-to-haves voor onze fase)
2. De scorecard schrijven (5-7 dimensies, elk met een rubriek)
3. Het sollicitatieproces structureren (wie interviewt, in welke volgorde, wat elke persoon beoordeelt)
4. Drie rode vlaggen identificeren om op te screenen
5. De offer letter-framing opstellen (belonings­filosofie, equity, verwachtingen)

Bedrijfscontext: [fase, ARR, teamgrootte, grootste uitdaging die deze aanwerving oplost]
```

### Concurrentie-intelligentie

```
/ceo-advisor

Diepgaande concurrentieanalyse van [concurrent]:
- Waar zijn ze echt goed in? Wat vinden klanten geweldig aan hen?
- Waar zijn ze zwak? Wat zeggen hun vertrokken klanten?
- Hoe zijn ze gepositioneerd vs. ons — prijs, ICP, GTM?
- Wat zouden ze doen als we [functie/zet] lanceren?
- Wat is het ene ding waar we ons het meest zorgen over moeten maken?

Te controleren bronnen: G2-recensies, vacatures, hun blog, recente financiering, LinkedIn-aanwervingen.
```

### Boardvoorbereiding

```
/board-deck-builder

Kwartaalboardvergadering — [KWARTAAL]:

Statistieken: [ARR, groei, NRR, burn, personeelsbezetting]
Speciale onderwerpen: [iets ongewoons — pivot, vertrek sleutelpersoon, fondsenwerving, grote win]
Beslissingen die van de board nodig zijn: [lijst items die goedkeuring of input vereisen]

Bouw de presentatiestructuur. Ik vul het narratief voor elke sectie in.
```

---

## 30-dagenplan (oprichter die Claude Code voor het eerst gebruikt)

### Week 1 — Fundament
- Installeer alle oprichtervaardig­heden via de bovenstaande commando's
- Voer `/founder-weekly-review` uit voor deze week — maak je vertrouwd met het format
- Voer `/financial-plan` uit met je huidige actuelen — bouw je basis­operationeel model
- Voer `/investor-update` uit voor vorige maand — stuur het naar je investeerders

### Week 2 — Ritme
- Gebruik `/founder-weekly-review` als je maandagochtend­ritueel (30 minuten)
- Gebruik `/ceo-advisor` voor één strategische beslissing die je al lang uitstelt
- Bouw je OKR-tracking­sjabloon — voer het vanaf nu wekelijks uit

### Week 3 — Fondsenwerving en communicatie
- Voer `/pitch-deck` of `/board-deck-builder` uit voor je volgende aankomende evenement
- Stel een `CLAUDE.md` in in je root met je bedrijfscontext (fase, ARR, team, investeerders) zodat Claude altijd context heeft
- Voer één `/commercial-forecaster`-sessie uit om je omzettraject te begrijpen

### Week 4 — Volledige integratie
- Elke investeerdersupdate opgesteld met `/investor-update`
- Elke boardvergadering voorbereid met `/board-deck-builder`
- Elke grote aanwerving doorlopen met `/ceo-advisor` voor scorecard­ontwerp
- Elke week beoordeeld met `/founder-weekly-review`

---

## CLAUDE.md voor oprichters

Maak een `CLAUDE.md` in je homedirectory of projectroot zodat Claude altijd je bedrijfscontext kent:

```markdown
# Bedrijfscontext

Bedrijf: [NAAM]
Fase: [Seed / Series A / Series B]
ARR: [$X]
MRR-groeipercentage: [X% MoM]
Burnpercentage: [$X/maand]
Looptijd: [X maanden]
Personeelsbezetting: [N]
Sleutelinvesteerders: [lijst]
Fondsenwervings­status: [niet wervend / aan het voorbereiden / op de markt / gesloten]

## Top 3 prioriteiten dit kwartaal
1. [Prioriteit 1 — bijv. Series A sluiten]
2. [Prioriteit 2 — bijv. $1,2M ARR bereiken]
3. [Prioriteit 3 — bijv. Head of Sales aanwerven]

## Team
CEO: [naam]
CTO: [naam]
Head of Product: [naam]
Head of Sales: [naam]

## Sleutel­statistieken om te kennen
NRR: [X%]
Brutomarge: [X%]
CAC-terugverdientijd: [X maanden]
Churn: [X% maandelijks]

## ICP
[2 zinnen die de ideale klant beschrijven — omvang, verticaal, rol, pijn]
```

Met dit aanwezig heeft elke Claude-sessie volledige context zonder opnieuw te hoeven uitleggen.

---

## Integraties met hulpmiddelen

### Notion (voor OKR's en boarddocumenten)

```json
// Voeg toe aan ~/.claude/settings.json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-notion"],
      "env": {
        "NOTION_API_TOKEN": "your-token"
      }
    }
  }
}
```

Hiermee verbonden kan Claude je OKR-tracker, boardvoorbereidingsdocumenten en investeerderspijplijn lezen en bijwerken.

### Linear (voor engineering OKR's)

Verbind Linear via MCP om sprint­data direct in je wekelijkse beoordeling te trekken. Claude kan je vertellen wat er geleverd is, wat uitgesteld is en wat op risico staat — zonder dat je CTO een rapport hoeft samen te stellen.

### QuickBooks / Xero

Exporteer je W&V en kasstroom als CSV. Plak in `/financial-plan` voor burn-analyse en scenario­modellering. Voor oprichters met een real-time verbinding geeft de QuickBooks MCP Claude live financiële data.

---

## Statistieken om op te focussen (per fase)

### Seed

| Statistiek | Doel | Waarom |
|---|---|---|
| Tijd tot eerste betalende klant | <90 dagen | Valideert bereidheid tot betalen |
| Week-2-retentie | >30% | PMF-signaal |
| NPS | >40 | Signaal van productliefde |
| Burn multiple | <5x | Vroegstadium kapitaalefficiëntie |
| Oprichter: klantgesprekken per week | 5+ | Dicht bij de klant blijven |

### Series A

| Statistiek | Doel | Waarom |
|---|---|---|
| MoM ARR-groei | >15% | Aantoonbare snelheid |
| NRR | >110% | Land and expand werkt |
| CAC-terugverdientijd | <18 maanden | Unit economics haalbaar |
| Burn multiple | <3x | Efficiënte groei |
| Pijplijndekking | >3x doel | Voorspelbare omzet |
| Tijd tot quota (verkoopmedewerkers) | <4 maanden | GTM is herhaalbaar |

### Series B

| Statistiek | Doel | Waarom |
|---|---|---|
| YoY ARR-groei | >100% | Rule of 40-component |
| Brutomarge | >70% | Software-niveau marge |
| NRR | >120% | Uitbreidingsgedreven groei |
| Burn multiple | <2x | Kapitaalefficiëntie |
| CAC-terugverdientijd | <12 maanden | Bewezen unit economics |

---

## Veelgemaakte oprichtersfouten die Claude Code helpt te vermijden

**Fout 1: Investeerdersupdates laten slip­pen**
Stel een maandelijkse herinnering in. `/investor-update` verlaagt de tijdkosten naar 10-15 minuten. Consistente updates bouwen vertrouwen, zelfs wanneer de cijfers moeilijk zijn.

**Fout 2: Verrassingen in boardvergaderingen**
Gebruik het slechte-nieuws-kader van `/board-deck-builder`. Bel elk boardlid individueel voor de vergadering als je moeilijk nieuws brengt. Laat de presentatie nooit de eerste keer zijn dat ze iets moeilijks horen.

**Fout 3: OKR's vastgesteld in januari, beoordeeld in december**
`/founder-weekly-review` bevat een OKR-check elke week. Achterlopende KR's worden opgemerkt in week 5, niet week 13.

**Fout 4: Aanwerven op intuïtie, niet op scorecard**
Gebruik `/ceo-advisor` om een scorecard te bouwen voor elke senior aanwerving. Documenteer de rubriek. Bespreek elk panel na aan de hand van de rubriek.

**Fout 5: Financieel model alleen voor fondsenwerving**
Je operationeel model moet een levend document zijn. Gebruik `/financial-plan` maandelijks. Ken je looptijd binnen 2 weken, niet binnen 2 maanden.

---

## Bronnen

- [Aan de slag met Claude Code](getting-started.md)
- [Oprichter wekelijkse workflow](../workflows/founder-weekly.md)
- [Boardpresentatiebouwer-vaardigheid](../skills/productivity/board-deck-builder.md)
- [Investeerdersupdate-vaardigheid](../skills/productivity/investor-update.md)
- [Financieel plan-vaardigheid](../skills/finance/financial-plan.md)
- [CEO-advisor-agent](../agents/advisors/ceo-advisor.md)

---
