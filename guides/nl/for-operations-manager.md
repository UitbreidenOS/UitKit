# Claude voor Operations Managers en COO's

Alles wat een Operations Manager of COO nodig heeft om AI-ondersteunde operaties te runnen — procesdocumentatie, leveranciersbeheer, OKR-tracking, teamcoordinatie en wekelijkse rapportage — in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een Operations Manager, VP of Operations of COO wiens taak het is het bedrijf soepel te laten draaien. Je bent verantwoordelijk voor processen, tooling, cross-functionele coördinatie en operationele metrieken. Je besteedt te veel tijd aan vergaderingen die geen beslissingen opleveren, aan documenten die verouderd zijn zodra je ze publiceert, en aan leveranciersreviews die nooit een duidelijke aanbeveling hebben.

**Voor Claude Code:** 4 uur om een SOP van nul te schrijven. Een halve dag om een leveranciersvergelijking te maken. Een hele middag om vergadernotities om te zetten naar actiepunten. Wekelijkse rapportage kost maandagochtend.

**Erna:** SOPs opgesteld in 30 minuten. Leveranciersmatrices gebouwd vanuit notities in 20 minuten. Vergadernotities omgezet naar Jira-tickets in 5 minuten. Wekelijkse pulse klaar voordat de koffie koud is.

---

## Installatie in 30 seconden

```bash
# Installeer de volledige operationsstack
npx claudient add skills small-business/sop-writer
npx claudient add skills small-business/weekly-pulse
npx claudient add skills small-business/meeting-to-action
npx claudient add skills gtm/revenue-operations
npx claudient add skills productivity/scrum-master
npx claudient add skills productivity/process-mapper
npx claudient add skills productivity/vendor-evaluator
npx claudient add agents advisors/coo-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Jouw Claude Code operationsstack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/sop-writer` | SOPs opstellen, opmaken en versiebeheren met RACI- en beslissingstabellen | Wanneer een proces gedocumenteerd moet worden |
| `/process-mapper` | Bestaande processen in kaart brengen: stroomdiagram, RACI, knelpuntanalyse, verbeteraanbevelingen | Procesaudits, automatievoorbereiding, cross-team overdrachten |
| `/vendor-evaluator` | RFP-sjablonen, scoringsrubric, vergelijkingsmatrix, aanbevelingsmemo | Elke leveranciersbeslissing > €10.000/jaar |
| `/weekly-pulse` | Wekelijkse OKR-check-in, metriekenDashboard, samenvatting van blokkades | Elke maandagochtend |
| `/meeting-to-action` | Vergadernotities of transcripten omzetten in gestructureerde actiepunten met eigenaren | Na elke significante vergadering |
| `/revenue-operations` | RevOps-rapportage, pijplijnstatus, nauwkeurigheid prognose | GTM/RevOps-werk |
| `/scrum-master` | Sprint-ceremonies, retrospectives, velocity-coaching | Operationeel ritme van het team |

### Agents

| Agent | Model | Wanneer te starten |
|---|---|---|
| `coo-advisor` | Sonnet | Strategische operationele beslissingen, organisatieontwerp-vragen |
| `chief-of-staff` | Sonnet | Cross-functionele coördinatie, stakeholdercommunicatie, prioritering |

---

## Dagelijkse workflow

### Ochtend OKR-pulse (15 minuten)

**Begin elke dag met weten waar je staat met je kernmetrieken.**

```
/weekly-pulse

Datum van vandaag: [datum]
Week: [W van kwartaal]

OKR-status:
Doelstelling 1: [naam] → Kernresultaat: [metriek, huidige waarde vs. doel]
Doelstelling 2: [naam] → Kernresultaat: [metriek, huidige waarde vs. doel]

Noemenswaardige gebeurtenissen van gisteren: [belangrijke genomen beslissingen, gesignaleerde blokkades, behaalde of gemiste mijlpalen]

Wat ik nodig heb van deze check-in:
- Rode vlaggen die vandaag mijn aandacht vereisen
- Elke OKR die (amber) afwijkt en deze week interventie nodig heeft
- Één operationele hefboom die ik vandaag kan inzetten om vooruitgang te boeken
```

---

### Procesdocumentatie (30-60 minuten per proces)

```
/process-mapper

Proces: [naam — bijv. Klant Onboarding, Leveranciersinkoop]
Trigger: [wat dit proces start]
Eindtoestand: [hoe 'klaar' eruit ziet]
Deelnemers: [betrokken rollen]
Tools: [gebruikte systemen]
Huidig pijnpunt: [wat je al weet dat niet goed werkt]

Maak: stap-voor-stap kaart, RACI-matrix, knelpuntanalyse, top 3 verbeteraanbevelingen.
```

Gebruik daarna `/sop-writer` om de kaart om te zetten naar een opgemaakte SOP met versiebeheer:

```
/sop-writer

Procesnaam: [naam]
Versie: 1.0
Eigenaar: [rol]
Laatste update: [datum]
Reviewfrequentie: [kwartaalsgewijs]

Op basis van deze proceskaart: [plak de output van process-mapper]

Schrijf een volledige SOP in ons standaardformaat met:
- Doel en scope
- Rollen en verantwoordelijkheden (RACI)
- Stap-voor-stap instructies
- Beslissingsregels (wanneer te escaleren)
- Metrieken en succescriteria
- Wijzigingslog
```

---

### Leveranciersbeheer

**Vóór elke significante leveranciersbeslissing:**

```
/vendor-evaluator

Ik moet leveranciers evalueren voor: [categorie]
Budget: [€X]
Tijdlijn: [wanneer we moeten beslissen]
Leveranciers die ik overweeg: [namen]
Vereisten: [lijst]
Wensen: [lijst]

Maak: scoringsrubric, RFP-vragen, vergelijkingsmatrix-sjabloon.
```

**Na het verzamelen van offertes:**

```
/vendor-evaluator

Bouw een vergelijkingsmatrix op basis van deze offertes.

Leverancier A notities: [plak je notities]
Leverancier B notities: [plak je notities]
Leverancier C notities: [plak je notities]

Scoringscriteria waarover we overeenstemming hebben: [uit de rubric]

Maak: gewogen vergelijkingstabel, 3-jaarse TCO-schatting, risicoregister, aanbevelingsmemo voor het leiderschapsteam.
```

---

### Vergaderbeheer

**Na elke significante vergadering:**

```
/meeting-to-action

[Plak vergadernotities of transcript]

Vergadertype: [beslissing / brainstorm / status / escalatie]
Aanwezigen: [lijst met rollen]
Datum: [datum]
Context: [wat deze vergadering probeerde te bereiken]

Extraheer:
- Genomen beslissingen (elke met eigenaar)
- Actiepunten (eigenaar, vervaldatum, deliverable — één regel per punt)
- Open vragen die follow-up vereisen
- Toezeggingen waarvan anderen afhankelijk zijn
- Parkeerplaats-items (aangekaart maar niet opgelost)

Formateer output als Slack-klare samenvatting en een aparte Jira/Linear takenlijst.
```

---

### Cross-functionele coördinatie

Gebruik de `chief-of-staff`-agent voor complexe coördinatie:

```
@chief-of-staff

Ik moet [initiatief] coördineren over [teams].

Stakeholders:
- [Team/Persoon 1]: [wat ze bezitten, wat ze van anderen nodig hebben]
- [Team/Persoon 2]: [wat ze bezitten, wat ze van anderen nodig hebben]

Huidige blokkades: [lijst]
Tijdlijn: [kernmijlpalen]

Help me: [het coördinatieplan opstellen / de stakeholderupdate schrijven / het kritieke pad identificeren]
```

---

## Wekelijks ritme

### Maandag — OKR-pulse en weekplanning

```
/weekly-pulse

Week: [W van kwartaal]
OKR-status voor elk kernresultaat: [huidige waarde / doel / trend]
Top 3 prioriteiten deze week: [lijst]
Afhankelijkheden van andere teams deze week: [lijst]
Vergaderingen deze week die voorbereiding vereisen: [lijst]

Output: éénpagina wekelijkse brief die ik kan delen met mijn CEO bij de maandag check-in.
```

### Woensdag — Midweekse check

```
Snelle midweekse check:
- Welke prioriteiten liggen op schema?
- Wat riskeert te laat te zijn deze week?
- Welke beslissingen zijn in behandeling en blokkeren voortgang?
- Moet ik iets escaleren?

Geef me een 5-punts Slack-bericht om naar mijn directe rapporten te sturen.
```

### Vrijdag — Wekelijks operationeel rapport

```
/weekly-pulse

Wekelijks operationeel rapport voor: [einddatum week]

Metriekenupdate:
[Plak data van je dashboards — of beschrijf metrieken en hun waarden]

Successen van deze week: [lijst]
Gemiste doelen van deze week: [lijst + oorzaak voor elk]
Prioriteiten volgende week: [top 3]
Beslissingen die leiderschap nodig heeft voor maandag: [lijst]

Formaat: managementsamenvatting (3 bullets) + gedetailleerde sectie voor het operationele team.
```

---

## 30-daags opstartplan

### Week 1 — Audit en baseline

- Installeer alle operationsvaardigheden en configureer je primaire tools (Jira/Linear MCP indien van toepassing)
- Voer `/process-mapper` uit op je top 3 meest pijnlijke processen
- Documenteer welke processen geen SOP hebben (dit zijn je risicobereiken)
- Stel je OKR-trackingsjabloon in in `/weekly-pulse`
- Identificeer je top 2 leveranciersbeslissingen in de komende 90 dagen

### Week 2 — Documentatiesprint

- Gebruik `/sop-writer` om SOPs te ontwerpen voor de top 3 processen die vorige week in kaart zijn gebracht
- Voer `/meeting-to-action` uit op je 5 meest recente vergadernotities (met terugwerkende kracht)
- Begin `/meeting-to-action` te gebruiken voor elke vergadering vanaf nu
- Stel de wekelijkse pulse in als een maandagochtend-ritueel

### Week 3 — Leveranciers- en cross-functioneel werk

- Start je eerste leveranciersevaluatie met `/vendor-evaluator`
- Gebruik de `chief-of-staff`-agent om je eerste cross-functionele coördinatieplan op te stellen
- Voer een retrospective uit op één team met `/scrum-master`
- Identificeer je meest risicovolle OKR en ontwerp een interventie

### Week 4 — Rapportage en optimalisatie

- Maak je eerste volledige wekelijkse operationeel rapport met `/weekly-pulse`
- Bekijk je proceskaarten — welke knelpunten kun je elimineren?
- Lever het leveranciersaanbevelingsmemo van Week 3 op
- Bijhouden bespaarde tijd deze maand versus voor Claude Code (doel: 8-12 uur/week)

---

## Tool-integraties

### Jira / Linear (projecttracking)

```json
// Voeg toe aan ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Hiermee verbonden kan `/meeting-to-action` taken rechtstreeks aanmaken in je projectboard.

### Notion (documentatie)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-integration-token"
      }
    }
  }
}
```

Gebruik voor: SOPs, proceskaarten, leveranciersvergelijkingsmatrices, wekelijkse rapporten.

### Slack (asynchrone communicatie)

Formatteer alle `/weekly-pulse`- en `/meeting-to-action`-outputs voor Slack door toe te voegen:
"Formatteer dit als een Slack-bericht — geen markdown-koppen, gebruik bullets en vetgedrukt voor nadruk."

### Google Sheets / Airtable (metriekentracking)

Exporteer OKR-data als CSV → plak in `/weekly-pulse` voor analyse en trendrapportage.

---

## Bij te houden metrieken

Gebruik Claude Code om deze maandelijks te analyseren:

| Metriek | Doel | Rode vlag |
|---|---|---|
| OKR-voltooiingspercentage (kwartaal) | > 70% | < 50% |
| Dekking procesdocumentatie | > 80% van kritieke processen | < 60% |
| Voltooiingspercentage actiepunten vergaderingen | > 85% binnen vervaldatum | < 70% |
| Doorlooptijd leveranciersbeslissing | < 30 dagen voor grote beslissingen | > 60 dagen |
| Wekelijkse rapportagetijd (minuten) | < 30 minuten | > 90 minuten |
| Oplostijd cross-team blokkades | < 3 werkdagen | > 7 dagen |

---

## Veelgemaakte fouten en hoe Claude Code ze helpt vermijden

**Fout 1: SOPs die genegeerd worden**
Claude Code maakt SOPs met duidelijke eigenaren, beslissingsregels en reviewdata. Zonder die elementen worden SOPs archiefdocumenten.

**Fout 2: Leveranciersbeslissingen gebaseerd op demo's, niet op data**
`/vendor-evaluator` vereist een scoringsrubric vóór de demo, zodat je niet appels met peren vergelijkt met een verkooppresentatie.

**Fout 3: Vergaderingen die gesprekken opleveren, geen beslissingen**
`/meeting-to-action` is onmisbaar na elke beslissingsvergadering. Voer het uit binnen 30 minuten of de context vervaagt.

**Fout 4: OKRs kwartaalsgewijs bijgehouden in plaats van wekelijks**
`/weekly-pulse` draait maandagochtend. OKRs die wekelijks afdrijven sterven aan het einde van het kwartaal.

**Fout 5: Ongedocumenteerde processen = afhankelijkheid van sleutelpersonen**
Wanneer de persoon die "gewoon weet hoe het werkt" vertrekt, heb je geen proces. `/process-mapper` is hoe je single points of failure elimineert.

---

## Bronnen

- [Procesdocumentatiegids](./sop-writing-guide.md)
- [Leveranciersevaluatie-playbook](../skills/productivity/vendor-evaluator.md)
- [Wekelijkse OKR-workflow](../workflows/ops-weekly.md)
- [COO-adviseur-agent](../agents/advisors/coo-advisor.md)
- [Aan de slag met Claude Code](./getting-started.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
