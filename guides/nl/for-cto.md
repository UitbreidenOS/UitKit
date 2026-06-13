# Claude voor CTO's en Tech Leads

Alles wat een CTO, VP Engineering of Tech Lead nodig heeft voor AI-ondersteund engineering leiderschap — architectuurbeslissingen, engineeringstrategie, technisch aanwerven, teamtopologie, tech debt-prioritering en boardrapportage.

---

## Voor wie is dit bedoeld

Je bent een CTO, VP Engineering, Principal Engineer of Tech Lead wiens taak het is de technische richting van een bedrijf of engineeringorganisatie te bepalen. Je verbindt bedrijfsstrategie met engineeringuitvoering. Je neemt build vs. buy-beslissingen, stelt teamtopologie in, voert incidentreviews uit, evalueert architectuurafwegingen en rapporteert aan het bestuur — vaak in dezelfde week.

**Voor Claude Code:** ADR: 90 minuten. Engineeringstrategiedocument: een week avonden. Interviewkit voor een nieuwe senior hire: 3 uur. Boardrapport over technische gezondheid: een halve dag.

**Na:** ADR in 20 minuten. Engineeringstrategieoverzicht in 45 minuten. Interviewkit in 30 minuten. Board tech-rapport in 25 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer de volledige CTO / tech lead-stack
npx claudient add skills productivity/adr-writer
npx claudient add skills productivity/tech-debt-tracker
npx claudient add skills devops-infra/platform-engineering
npx claudient add skills productivity/vertical-slice-planner
npx claudient add skills productivity/spec-driven-workflow
npx claudient add skills productivity/engineering-strategy
npx claudient add skills productivity/tech-interview-kit
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/vpe-advisor
npx claudient add agents core/architect
```

---

## Jouw Claude Code CTO-stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/engineering-strategy` | Engineeringstrategiedocument: technische visie, build vs. buy, teamtopologie, 12-maands roadmap | Jaarlijkse/halfjaarlijkse planning, boardvoorbereiding, nieuwe CTO-rol |
| `/adr-writer` | Architecture Decision Record — documenteert de beslissing, context, afwegingen, gevolgen | Na elke significante architectuurbesluiting |
| `/tech-interview-kit` | Codeeruitdagingen, systeemontwerpprompts, evaluatierubrieken, nabesprekingssjablonen | Voor elke technische aanwervingsronde |
| `/tech-debt-tracker` | Debt-inventarisatie, prioriteringsraamwerk, investeringsvoorstel voor leiderschap | Kwartaalreviews tech debt |
| `/vertical-slice-planner` | Snijd epics in leverbare verticalen met duidelijke acceptatiecriteria | Sprint- en releaseplanning |
| `/spec-driven-workflow` | Technische specificatieschrijving — probleemstelling, vereisten, ontwerpopties | Voor het bouwen van complexe functies |
| `/platform-engineering` | Platformstrategie, developer experience, CI/CD, interne tooling | Platform-/infrateamwerk |

### Agents

| Agent | Model | Wanneer in te schakelen |
|---|---|---|
| `cto-advisor` | Opus | Strategische beslissingen met hoge inzet — org-design, build vs. buy, technologische keuzes |
| `vpe-advisor` | Sonnet | Uitvoering en teamgezondheid — snelheid, aanwerving, operationele excellence |
| `architect` | Opus | Complex systeemontwerp — gedistribueerde systemen, data-architectuur, schaalbaarheid |

---

## Dagelijkse workflow

### Ochtend engineering-gezondheidscheck (15 minuten)

```
Snelle engineering org-gezondheidscheck voor [DATUM]:

Metrics van gisteren:
- Deploys naar productie: [X] (doel: [N per dag])
- Mislukte deploys / rollbacks: [X]
- Open incidenten: [X] / P1-incidenten in de afgelopen 7 dagen: [X]
- P1-reactietijd (laatste incident): [X minuten] (doel: < 30 min)
- Samengevoegde pull requests: [X] / open > 5 dagen: [X] (langlopende PR's = samenvoegrisico)
- On-call escalaties: [X]

Teampuls:
- Engineeer geblokkeerd voor > 1 dag? [ja/nee + wie]
- Team onder 70% sprintbelofte tracking? [ja/nee]
- Komende kritieke deadlines in de volgende 14 dagen? [lijst]

Markeer: wat vereist vandaag mijn aandacht (gesorteerd op urgentie × impact)?
```

---

### Architectuur en ontwerpwerk

**Voor elke significante technische beslissing:**

```
/adr-writer

Beslissing: [wat beslissen we?]
Context: [waarom is deze beslissing nu nodig? Wat is de zakelijke of technische aanleiding?]
Overwogen opties:
1. [Optie A naam]: [korte beschrijving]
2. [Optie B naam]: [korte beschrijving]
3. [Optie C naam of "niets doen"]

Beperkingen: [budget, tijdlijn, afhankelijkheden van bestaande stack, teamexpertise]
Criteria voor evaluatie: [wat het meest telt — prestaties / onderhoudbaarheid / kosten / snelheid van levering]

Schrijf een volledige ADR met: status, context, beslissing, gevolgen en afwegingen.
```

**Voor complexe nieuwe functies:**

```
/spec-driven-workflow

Functie: [naam]
Zakelijk doel: [welke uitkomst dit dient]
Probleemstelling: [welk gebruikers- of systeemprobleem we oplossen]
Beperkingen: [technisch, tijdlijn, teamcapaciteit]

Produceer: technische specificatie met probleemstelling, vereisten (functioneel + niet-functioneel), ontwerpopties met afwegingsanalyse, aanbevolen aanpak en open vragen die opgelost moeten worden voor het werk begint.
```

---

### Team 1:1's en coaching

Gebruik de `vpe-advisor`-agent om je voor te bereiden op moeilijke engineering management-gesprekken:

```
@vpe-advisor

Ik heb morgen een 1:1 met [rol, senioriteit].
Context: [wat er speelt — prestaties, loopbaanontwikkeling, teamfrictie, scopevraag]

Help me:
- Het gesprek productief te kadreren (niet als klacht of prestatiewaarschuwing)
- Vragen te stellen die me echte informatie geven
- Een reactie voor te bereiden als ze [specifieke zorg] aankaarten
- Een concrete uitkomst voor het gesprek te bepalen
```

---

### Board en leiderschap rapportage

```
/engineering-strategy

Schrijf de engineeringsectie van het boarddeck voor [KWARTAAL/MAAND].

Doelgroep: board en C-suite (niet-technisch, gericht op risico en ROI)
Belangrijkste te rapporteren metrics:
- Deployfrequentie: [huidig vs. vorig kwartaal vs. doel]
- Betrouwbaarheid (uptime): [huidig vs. doel]
- Beveiliging: [eventuele incidenten, verholpen kwetsbaarheden]
- Engineering-snelheid: [hoog niveau: versnellen we of vertragen we?]
- Headcount: [huidig / geplande aanwervingen / verloop]
- Tech debt-investering: [% van sprintcapaciteit dedicated dit kwartaal]

Hoogtepunten: [grote dingen die we hebben opgeleverd]
Risico's: [wat engineering in de komende 90 dagen kan ontsporen]
Verzoeken: [wat je van het board nodig hebt — budget, beslissingen, ondersteuning]

Formaat: 3-5 slides aan content (directiesamenvatting + details). Duidelijke taal, geen jargon.
```

---

### Tech debt-prioritering

```
/tech-debt-tracker

Huidige tech debt-inventarisatie:
[Lijst of beschrijf je bekende debitems — of plak uit een document/Jira]

Voor elk item: naam, wat het vertraagt, geschatte kosten om op te lossen, risico als onbehandeld

Prioriteringsraamwerk:
Score elk item:
- Zakelijke impact als NIET opgelost: 1-5 (5 = existentieel risico)
- Developer snelheidsbelasting: 1-5 (5 = team besteedt > 20% tijd aan werkomheen)
- Inspanning om op te lossen: 1-5 (1 = snelle fix, 5 = multi-sprint inspanning)

Prioriteitsscore = (zakelijke impact + snelheidsbelasting) / inspanning

Produceer:
- Gerangschikte lijst met scores
- Top 3 items om volgend kwartaal aan te pakken met zakelijk argument voor elk
- Voorgestelde capaciteitstoewijzing (% van sprintcapaciteit voor tech debt)
- Directievriendelijke samenvatting: "Dit is wat onze technische schuld ons kost en wat het oplossen ervan oplevert"
```

---

## Wekelijks ritme

### Maandag — Engineering-strategieafstemming

```
/engineering-strategy

Wekelijkse afstemmingscheck:
- Voeren we de 12-maandsstrategie uit? Wat loopt er uit de hand?
- Welke OKR's lopen dit kwartaal risico?
- Werkt de teamtopologie? Coördinatieproblemen die ik moet aanpakken?
- Belangrijkste beslissingen die ik deze week moet nemen: [lijst]

Geef me een 5-puntswekelijkse focusmemo die ik met mijn teamleads kan delen.
```

### Woensdag — Technische aanwervingsreview

Gebruik `/tech-interview-kit` wanneer een aanwerving loopt:

```
/tech-interview-kit

Ik heb een [NIVEAU] [ROL] interviewlus lopen.
Interviewers: [lijst + welke fase elk bezit]

Help me:
- De interviewfases reviewen op hiaten (testen we de juiste dingen voor dit niveau?)
- Nabesprekingssjabloon voorbereiden voor vrijdag
- Kalibreren hoe "de lat" eruitziet voor deze specifieke rol vs. algemene rubrieken

[Als een take-home is ingediend: plak de indiening en vraag om een reviewraamwerk]
```

### Vrijdag — Build vs. buy-review en stakeholdercommunicatie

```
@cto-advisor

Build vs. buy-beslissing waar ik mee worstel: [beschrijf de capability, opties, tijdlijn, kosten]

Mijn beperkingen:
- Engineering-bandbreedte: [huidig gebruik — zitten we op capaciteit?]
- Budget: [beschikbaar voor tooling/diensten]
- Tijdlijn: [wanneer we deze capability nodig hebben]
- Expertise van ons team in dit domein: [sterk / zwak / geen]
- Strategisch belang: [is dit een differentiator of commodity?]

Geef me een aanbeveling met je sterkste 3 redenen, en wat je van mening zou doen veranderen.
```

---

## 30-daags inwerklist (nieuwe CTO)

### Week 1 — Luister en diagnosticeer

- Installeer alle CTO-skills en configureer je tooling
- Voer `/engineering-strategy` uit in auditiemodus: "Beschrijf de huidige staat van engineering hier. Wat werkt? Wat is kapot? Wat zijn de belangrijkste risico's?"
- Identificeer de top 3 technische pijnpunten van het team (vraag, neem niet aan)
- Breng de huidige teamtopologie in kaart — wie bezit wat, waar zijn handoffs traag
- Lees de laatste 12 maanden ADR's (als ze bestaan) om eerdere beslissingen te begrijpen

### Week 2 — Documenteer reeds genomen beslissingen

- Schrijf ADR's voor niet-gedocumenteerde architectuurbesluiten die je ontdekt
- Voer `/tech-debt-tracker` uit — krijg een baseline-inventarisatie, ook als die onvolledig is
- Review de aanwervingspipeline — zijn er open rollen en welke niveaulat is gesteld?
- Check DORA-metrics-baseline (deployfrequentie, MTTR, change failure rate)

### Week 3 — Eerste strategische communicatie

- Stel je eerste engineeringstrategiedocument op met `/engineering-strategy`
- Valideer het met je 2-3 meest senior engineers voor publicatie
- Presenteer aan de CEO of leiderschap: dit is wat ik zie, dit is mijn plan voor 12 maanden
- Voer je eerste technisch interview uit met de nieuwe kit van `/tech-interview-kit`

### Week 4 — Proces en ritme

- Stel de engineering-gezondheidscheck in als dagelijks ritueel van 15 minuten
- Start een tech debt-prioriteringssessie met teamleads
- Stel je DORA-metricdoelen in en publiceer ze naar het team
- Lever eerste board engineering-rapport

---

## Tool-integraties

### GitHub (code en PR's)

```bash
# Claude Code heeft native GitHub-integratie via gh CLI
# Bekijk PR-reviews, codekwaliteit, deploystatus direct

gh pr list --state open
gh run list --limit 10  # CI/CD pipeline-status
```

### Linear / Jira (engineering-planning)

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-api-key"
      }
    }
  }
}
```

Gebruik voor: sprintplanning met `/vertical-slice-planner`, tech debt-tracking, roadmapzichtbaarheid.

### Datadog / Honeycomb (observability)

Exporteer incidentdata en DORA-metrics → plak in engineering-gezondheidscheck-prompt voor trendanalyse.

### Notion / Confluence (documentatie)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-token"
      }
    }
  }
}
```

Gebruik voor: engineeringstrategiedocumenten, ADR's, teamtopologie, tech debt-backlog.

---

## Te volgen metrics

| Metric | Doel (groeifase) | Rode vlag |
|---|---|---|
| Deployfrequentie | Dagelijks of meerdere keren per week | < 1/week |
| Doorlooptijd voor wijzigingen | < 1 dag | > 1 week |
| Change failure rate | < 10% | > 20% |
| MTTR (gemiddelde hersteltijd) | < 1 uur | > 4 uur |
| Engineering-beschikbaarheid (team) | > 85% | < 70% |
| Tech debt % van sprintcapaciteit | 15-20% | > 30% of < 10% |
| Time-to-hire (eng-rollen) | < 45 dagen | > 90 dagen |
| Acceptatiegraad aanbieding | > 80% | < 60% |
| Tijd nieuwe engineer tot eerste PR | < 3 dagen | > 1 week |

---

## Veelgemaakte fouten en hoe Claude Code helpt ze te vermijden

**Fout 1: Architectuurbesluiten verbaal genomen, nooit opgeschreven**
`/adr-writer` duurt 20 minuten per beslissing. Zonder ADR's wordt stamkennis technische schuld.

**Fout 2: Aanwerven zonder gekalibreerde rubrieken**
`/tech-interview-kit` dwingt kalibratie voor de eerste kandidaat. Interviewers die het niet eens zijn over wat "goed" is, werven inconsistent aan.

**Fout 3: Tech debt reactief aanpakken (alleen als het iets kapotmaakt)**
`/tech-debt-tracker` maakt van schuld een zakelijk argument. Leiderschap financiert wat een gedefinieerde kosten en ROI heeft.

**Fout 4: Engineeringstrategie die alleen als een slidedeck bestaat**
`/engineering-strategy` produceert een levend document met metrics. Revisit het per kwartaal.

**Fout 5: Board engineering-rapporten die aanvoelen als een vreemde taal**
Gebruik `/engineering-strategy` om voor niet-technische doelgroepen te schrijven. DORA-metrics hebben een vertaalzin nodig voor ze iets betekenen voor een board.

---

## Bronnen

- [Architecture Decision Records gids](./adr-writing.md)
- [Engineering strategy skill](../skills/productivity/engineering-strategy.md)
- [Tech interview kit](../skills/productivity/tech-interview-kit.md)
- [Tech debt tracker](../skills/productivity/tech-debt-tracker.md)
- [CTO wekelijkse workflow](../workflows/cto-weekly.md)
- [Aan de slag met Claude Code](./getting-started.md)

---
