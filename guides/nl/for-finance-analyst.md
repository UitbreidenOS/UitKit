# Claude voor Financieel Analisten en CFO's

Alles wat een Financieel Analist, FP&A-manager of CFO nodig heeft om AI-ondersteunde financiële modellering, rapportage, boardpakketvoorbereiding en investeerdercommunicatie uit te voeren in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een financieprofessional — FP&A-analist, financieel manager, VP Finance of CFO — wiens taak het is om cijfers om te zetten in beslissingen. Je bouwt modellen, sluit de boeken, verklaart afwijkingen, bereidt boardmaterialen voor en beheert investeerders. Je verdrinkt in spreadsheets en besteedt te veel tijd aan opmaak in plaats van analyse.

**Voor Claude Code:** 3 uur om een eerste DCF te bouwen. Een halve dag om het managementcommentaar voor het boardpakket te schrijven. Een volledige dag om een budget-versus-actuele-presentatie met afwijkings­verklaringen te produceren. Nachten doorwerken voor boardvergaderingen.

**Erna:** DCF-kader in 20 minuten. Boardpakketnarratief in 45 minuten. BvA-afwijkings­commentaar in 15 minuten. Scenarioanalyse op elk model in minder dan 10 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer de volledige financiële stack
npx claudient add skills finance
npx claudient add skills gtm/commercial-forecaster
npx claudient add skills gtm/revenue-operations
npx claudient add agents advisors/cfo-advisor
npx claudient add agents roles/quant-analyst

# Of selectief kiezen:
npx claudient add skill finance/dcf-model
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/financial-plan
npx claudient add skill finance/ic-memo
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/budget-vs-actual
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/revenue-operations
```

---

## Jouw Claude Code financiële stack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/board-pack-builder` | Volledig boardpakket: financiën, KPI's, strategische initiatieven, risico's, verzoeken | Maandelijkse/kwartaalboardvergaderingen |
| `/budget-vs-actual` | BvA-analyse: afwijkingstabellen, commentaar, trend, herprognose | Maandelijkse afsluiting |
| `/dcf-model` | DCF-waardering: WACC, FCF-projecties, eindwaarde, gevoeligheid | Waarderingswerk, deals |
| `/3-statement-model` | Geïntegreerd W&V-rekening, balans, kasstroommodel | Financiële planning, fondsenwerving |
| `/financial-plan` | Jaarlijks operationeel plan: personeelsbezetting, omzet, kostenopbouw, scenario's | Jaarlijkse planningscyclus |
| `/ic-memo` | Investment Committee-memo: alle 9 secties, rendementsanalyse | PE/VC-dealdocumentatie |
| `/pitch-deck` | Fondsenwerving-pitchpresentatie: structuur, narratief, statistieken, verhaal | Fondsenwerving bij investeerders |
| `/gl-reconciler` | GL-afstemming: rekeninganalyse, afwijkingstracing, journaalposting-checks | Maandafsluiting |
| `/commercial-forecaster` | Omzetprognose: pipeline-gedreven, cohortanalyse, scenario's | Gezamenlijke planning verkoop en financiën |
| `/revenue-operations` | RevOps-analyse: ARR-waterval, NRR-decompositie, churntoewijzing | SaaS/abonnements­bedrijven |

### Agents

| Agent | Model | Wanneer te starten |
|---|---|---|
| `cfo-advisor` | Opus | Strategische financiële vragen, investeerdersnarratief, positonering voor fondsenwerving |
| `quant-analyst` | Sonnet | Statistische analyse, financiële modellering, kwantitatief onderzoek |

---

## Dagelijkse workflow

### Ochtend — Financiële datapull (15-30 minuten)

**1. Dagelijkse financiële puls**
```
/budget-vs-actual

Haal de ochtendmoment­opname op:
- Kaspositie vs. gisteren
- Betalingen of ontvangsten boven $[drempel] verwerkt 's nachts
- MTD-omzet vs. budget (indien beschikbaar vanuit systeem)
- Elke afwijking die een verklaring nodig heeft voor de 9-uur standup

Geef me een 5-punts ochtendupdate.
```

**2. Modelupdates**
```
/commercial-forecaster

Werk mijn omzetprognose bij met de actuele gegevens van gisteren:
- Nieuwe boekingen: $[X]
- Verloren MRR: $[X]
- Uitbreiding: $[X]

Hoe verhoudt de huidige maand zich tot het budget? Trends die een herprognose vereisen?
```

---

### Modelwerk (variabel — 1-4 uur)

**3. Een financieel model bouwen of bijwerken**
```
/3-statement-model

Bouw een 3-state­ments-model voor [bedrijf].

Historische data (laatste 3 jaar of plak wat je hebt):
[W&V, balans, kasstroomdata]

Kernassumptie voor projectie:
- Omzetgroeipercentage: [X]% per jaar
- Brutomarge: [X]%
- OpEx als % van omzet: [X]%
- CapEx: [X]% van omzet
- Werkkapitaalwijzigingen: [kort]

Projecteer 3 jaar vooruit. Bouw basis/opwaarts/neerwaarts-scenario's.
```

**4. Afwijkingsanalyse**
```
/budget-vs-actual

Voer de maandelijkse BvA uit voor [MAAND].

[Plak actuele vs. budgetdata voor elke W&V-regel]

Context:
- Waarom omzet gemist werd: [kort]
- Waarom V&M onderbesteed was: [aanwerving langzamer dan gepland]
- Eenmalige posten: [beschrijf]

Produceer: afwijkingstabel, managementcommentaar, herprognose-implicatie.
```

---

### Rapportage en stakeholdercommunicatie (variabel)

**5. Boardpakketvoorbereiding**
```
/board-pack-builder

Bouw het boardpakket van deze maand voor [bedrijf].

[Geef alle 7 invoersecties: financiële data, KPI's, strategische updates, risico's, verzoeken]

Boardsamenstelling: [investeerders + onafhankelijken]
Laatste boardvergadering: [datum, besproken kernpunten]
Hoofdnarratief deze maand: [wat is het verhaal — op schema / vooruit / achter en waarom]
```

**6. Investeerdersupdate**
```
/cfo-advisor

Stel de maandelijkse investeerdersupdate-e-mail op voor [bedrijf].

Doelgroep: [VC-investeerders / angels / strategische investeerders]
Te behandelen kernstatistieken: [ARR, groei, burn, looptijd, belangrijkste mijlpalen]
Wat goed ging: [lijst]
Wat niet: [lijst + korte uitleg]
Wat we van investeerders nodig hebben: [introducties / advies / goedkeuringen]

Toon: Transparant, zelfverzekerd, beknopt. Geen spin — investeerders waarderen eerlijkheid.
```

---

### Wekelijkse en maandelijkse cyclus

**7. Maandafsluitchecklist**
Zie de volledige workflow op [workflows/finance-month-end.md](../workflows/finance-month-end.md).

**8. Herprognose**
```
/budget-vs-actual

[Na maandafsluiting] Voer volledige jaarherprognose uit.

YTD-actuelen (plak):
[data]

Kernassumptie­wijzigingen ten opzichte van origineel budget:
- Omzet: [wat veranderd is en waarom]
- Personeelsbezetting: [actueel vs. gepland]
- Eenmalige posten: [lijst]

Produceer: herziene jaarprognose, 3 scenario's (basis/opwaarts/neerwaarts),
herziene kaslooptijd per scenario.
```

---

## 30-dagenplan (nieuwe financieel analisten)

### Week 1 — Ken het bedrijf
- Installeer alle financiële vaardigheden: `npx claudient add skills finance`
- Voer `/gl-reconciler` uit op de afsluiting van vorige maand — begrijp het rekeningschema
- Voer `/budget-vs-actual` uit op de laatste 3 maanden actuelen — herken de patronen
- Lees de laatste 3 boardpakketten — begrijp het narratief dat de CFO heeft verteld
- Breng het financiële model in kaart: waar komt de omzet vandaan? Wat drijft de brutomarge? Wat is discretionair OpEx?

### Week 2 — Bezit het afsluitproces
- Begeleiding bij of uitvoering van de maandafsluiting met `/gl-reconciler`
- Bouw je afwijkingscommentaarsjabloon met `/budget-vs-actual`
- Begrijp het budget: wat waren de aannames? Waar presteren we ten opzichte van het plan?
- Stel je financiële dashboard in in je favoriete BI-tool (Looker, Metabase of zelfs Google Sheets)

### Week 3 — Bouw het model
- Bouw of beoordeel het volledige 3-statements-model met `/3-statement-model`
- Voer een DCF uit op het bedrijf (zelfs als je het nog niet nodig hebt — waarderingsdrijfkrachten begrijpen is belangrijk)
- Bouw een gevoeligheidsanalyse: welke ene variabele heeft de meeste impact op de kaslooptijd?
- Produceer je eerste boardpakketconcept met `/board-pack-builder`

### Week 4 — Stuur beslissingen aan
- Presenteer je eerste maandelijkse BvA aan de CEO of CFO
- Gebruik `/commercial-forecaster` om een pipeline-gekoppelde omzetprognose te bouwen
- Identificeer het ene financiële risico dat niet wordt besproken — breng het ter sprake
- Stel je maandafsluitkalender in: wat sluit wanneer, wie is verantwoordelijk

---

## Integraties met hulpmiddelen

### QuickBooks / Xero / NetSuite

```
Exporteer proefbalans of W&V uit je boekhoud­systeem als CSV of Excel.
Plak in Claude:

"/gl-reconciler — hier is de proefbalans voor [maand]. Identificeer rekeningen
met ongebruikelijke saldi, grote MoM-schommelingen of items die afstemming nodig hebben."

"/budget-vs-actual — hier is de management W&V-export. Produceer een BvA tegen
dit budget [plak budget]. Schrijf het managementcommentaar."
```

### Excel / Google Sheets

```python
# Voor Python-gebaseerde analisten — verbind Claude met je spreadsheetdata
import anthropic
import pandas as pd

client = anthropic.Anthropic()

# Laad je financiële data
df = pd.read_excel('monthly_financials.xlsx')

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    system="You are a financial analyst. Analyse the provided financial data and identify variances, trends, and anomalies. All figures are in USD thousands. Mark any calculations that need verification with [VERIFY].",
    messages=[{
        "role": "user",
        "content": f"""Run a budget vs actuals analysis on this data:

{df.to_markdown()}

Produce: variance table, management commentary, reforecast recommendation."""
    }]
)
```

### Salesforce / HubSpot (omzetprognose)

```json
// Verbind CRM met Claude voor pipeline-gedreven prognoses
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@anthropic/salesforce-mcp"],
      "env": {
        "SF_USERNAME": "your-username",
        "SF_PASSWORD": "your-password",
        "SF_TOKEN": "your-security-token"
      }
    }
  }
}
```

Met CRM verbonden:
- Trek pijplijn per fase en vraag Claude om een bottoms-up omzetprognose
- Vergelijk pijplijndekking met quota: "hebben we genoeg pijplijn om het doel te halen?"
- Identificeer deals die risico lopen op basis van datum laatste activiteit

### Notion / Confluence (boardpakketdistributie)

```
Na het bouwen van je boardpakket met /board-pack-builder:
1. Exporteer als markdown
2. Plak in Notion of Confluence
3. Deel alleen-lezen­link met boardleden voor de vergadering
4. Gebruik Claude tijdens de vergadering om "wat als"-vragen over het model te beantwoorden
```

---

## Bij te houden benchmarks

| Statistiek | Vroegstadium startup | Groeifase | Publiek / volwassen |
|---|---|---|---|
| Dagen tot afsluiting (maandeinde) | 10-15 | 5-7 | 3-5 |
| Boardpakket gedistribueerd voor vergadering | 48 uur | 72 uur | 5 dagen |
| Prognosenauwkeurigheid (omzet) | ±20% | ±10% | ±5% |
| Budgetafwijking verklaard (% van W&V-regels) | 60% | 85% | 95% |
| Kaslooptijdzichtbaarheid | 3 maanden | 6 maanden | 12+ maanden |
| Tijd om BvA-analyse te produceren | 4 uur | 2 uur | 1 uur |
| Tijd om financieel model bij te werken | 2 uur | 45 minuten | 30 minuten |

---

## Veelgemaakte fouten (en hoe Claude Code ze voorkomt)

**Fout 1: Narratieven zonder cijfers**
Boardpakketten die een verhaal vertellen zonder specifieke cijfers te noemen verliezen geloofwaardigheid. `/board-pack-builder` bouwt eerst de financiële tabellen en genereert vervolgens narratief gekoppeld aan specifieke cijfers.

**Fout 2: Onverklaarbare afwijkingen**
"Omzet was onder budget" is geen commentaar. `/budget-vs-actual` structureert de grondoorzaakanalyse zodat je altijd *waarom* uitlegt, niet alleen *wat*.

**Fout 3: Prognoses met één scenario**
Elke prognose moet drie scenario's hebben. `/3-statement-model` en `/budget-vs-actual` bouwen standaard scenarioanalyse in.

**Fout 4: Overpromising aan de board**
`/board-pack-builder` genereert de sectie "verzoeken" — helder en specifiek over wat je van de board nodig hebt, in plaats van verzoeken in slides te begraven.

**Fout 5: Niet-gedisclosede aannames**
Alle Claude-financiële uitvoer is gemarkeerd met `[VERIFY]`. Deze discipline dwingt je terug te gaan en elk cijfer te bevestigen voordat je publiceert — cruciaal voor boardmaterialen.

---

## Bronnen

- [Aan de slag met Claude Code](../getting-started.md)
- [Finance maandeinde-workflow](../workflows/finance-month-end.md)
- [DCF-model-vaardigheid](../skills/finance/dcf-model.md)
- [Boardpakketbouwer-vaardigheid](../skills/finance/board-pack-builder.md)
- [Budget vs. actuelen-vaardigheid](../skills/finance/budget-vs-actual.md)
- [3-statements-model-vaardigheid](../skills/finance/3-statement-model.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
