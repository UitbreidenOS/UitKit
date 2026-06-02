# Claude voor Customer Success Managers

Alles wat een Customer Success Manager nodig heeft voor AI-ondersteunde gezondheidsmonitoring, QBR's, churnpreventie en uitbreidingsgesprekken — zonder uren te besteden aan voorbereiding en rapportage.

---

## Voor wie is dit bedoeld

Je bent een CSM verantwoordelijk voor een portfolio van accounts — ze behouden, uitbreiden en succesvol maken. Je wordt gemeten op Net Revenue Retention en verlengingsratio's. Je besteedt te veel tijd aan QBR-voorbereiding, gezondheidsscorereviews en het schrijven van opvolgingsmails, en te weinig tijd aan het daadwerkelijk opbouwen van klantrelaties.

**Voor Claude Code:** 4-6 uur om een QBR voor te bereiden. 2 uur per week om accountgezondheid handmatig te reviewen. 30 minuten om een opvolgingsmail te schrijven na elk gesprek. Geen consistent uitbreidingsplaybook.

**Na:** QBR volledig voorbereid in 45 minuten. Gezondheidsreview gedaan in 15 minuten met gestructureerde aanbevelingen. Opvolgingsmails in 5 minuten. Uitbreidingskansen proactief geïdentificeerd, niet reactief.

---

## Installatie in 30 seconden

```bash
# Installeer de volledige CS-stack
npx claudient add skill gtm/customer-success
npx claudient add skill gtm/qbr-builder
npx claudient add skill gtm/health-score-analyzer
npx claudient add skill gtm/expansion-playbook
npx claudient add skill marketing/churn-prevention
npx claudient add skill small-business/customer-feedback-synthesizer
npx claudient add skill gtm/revenue-operations
npx claudient add agent advisors/cco-advisor
```

---

## Jouw Claude Code CS-stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/health-score-analyzer` | Score accounts op gebruik, relatie en commerciële signalen; churmrisicobeoordeling | Maandagse portfolioreview |
| `/qbr-builder` | Volledige QBR-voorbereiding: agenda, gespreksonderwerpen, ROI-kwantificatie, uitbreidingsdiscussie | 2 weken voor elke QBR |
| `/expansion-playbook` | Identificeer uitbreidingssignalen, bouw upsell-narratief, behandel prijsgesprekken | Als een account klaar is om te groeien |
| `/customer-success` | Gezondheidsscoremodel-ontwerp, churmsignalen, onboardingplannen | CS-processen opbouwen |
| `/churn-prevention` | At-risk klantanalyse en reddingsplaybooks | RODE accounts die interventie nodig hebben |
| `/customer-feedback-synthesizer` | Synthesiseer feedback van enquêtes, gesprekken en tickets naar thema's | Kwartaal voice of customer |
| `/revenue-operations` | NRR-berekening, verlengingspipeline, CS-metrics en forecasting | CS-operaties en rapportage |

### Agents

| Agent | Model | Wanneer in te schakelen |
|---|---|---|
| `cco-advisor` | Opus | Strategische CS-beslissingen: dekkingsmodellen, tierstrategie, org-design |

---

## Dagelijkse workflow

### Ochtend (20-30 minuten)

**1. Portfoliogezondheidreview — voer elke maandag uit**
```
/health-score-analyzer

Voer mijn portfoliogezondheidreview uit voor de week van [DATUM].

Mijn accounts:
| Account | ARR | Verlenging | Laatste Login | Actieve Seats | Laatste Contact | Problemen |
|---|---|---|---|---|---|---|
| [Bedrijf A] | $48K | 3 maanden | 5 dagen geleden | 12/15 | 7 dagen geleden | Geen |
| [Bedrijf B] | $120K | 6 weken | 22 dagen geleden | 4/20 | 14 dagen geleden | Supportticket open |
| [Bedrijf C] | $24K | 8 maanden | 2 dagen geleden | 8/8 | 3 dagen geleden | Vraag over export |

Geef me:
1. Gezondheidsscore en risicotier voor elk account
2. Interventieprioriteitslijst voor deze week
3. Accounts met churmsignalen die ik moet escaleren
4. Verlengingen in de komende 90 dagen en hun gereedheidssstatus
```

**2. Dagelijkse at-risk check — duurt 5 minuten**
```
/health-score-analyzer

Snelle check: zijn er nieuwe risicosignalen opgedoken in de afgelopen 24-48 uur voor mijn portfolio?

Recente signalen:
- [Bedrijf X] heeft [X dagen] niet ingelogd
- [Bedrijf Y] heeft een supportticket geopend over [onderwerp]
- [Bedrijf Z] — champion [naam] heeft net van baan gewisseld op LinkedIn

Beoordeel risico en geef me de actie voor elk.
```

---

### QBR-voorbereiding (2 weken van tevoren)

**3. Volledige QBR-builder**
```
/qbr-builder

Bouw mijn QBR voor [klantnaam].

Klant: [Bedrijf]
ARR: $[X]
Verlenging: [datum]
Aanwezigen: [hun titel, hun titel] + [mijn titel, AE-naam]
Duur: [60 minuten]
Doel: [behouden en uitbreiding instellen / relatieherstel]

Hun context:
- Succescriteria van kickoff: [X, Y, Z]
- Primaire use case: [beschrijf]
- Zakelijke veranderingen dit kwartaal: [wijzigingen in hun team, budget, strategie]
- Gebruiksdata: [samenvatten — inloggen, actieve seats, gebruikte kernfuncties]
- Open problemen: [niet-opgeloste supporttickets of klachten]

Commercieel:
- Gezondheid: [GROEN / GEEL / ROOD]
- Uitbreidingskans: [seats / tier / add-on] — $[X] potentieel
- Concurrentiedreiging: [ja/nee — beschrijf indien ja]

Bouw: volledige agenda, gespreksonderwerpen per sectie, ROI-slide-inhoud,
uitbreidingsgesprekraamwerk en 3 bezwaarresponsen.
```

---

### Uitbreidingsgesprekken

**4. Identificatie van uitbreidingssignalen en narratief**
```
/expansion-playbook

Identificeer uitbreidingskans voor [Bedrijf].

Huidig contract: $[X] ARR, [N] seats, [plan/tier]
Gebruikssignalen:
- Seat-gebruik: [X van N seats actief]
- Nieuwe use case waargenomen: [beschrijf]
- Groeisignalen: [hun headcount stijgt X%, nieuw team vermeld, etc.]

Uitbreidingskans: [extra seats / tier-upgrade / add-on]
Potentieel extra ARR: $[X]
Gezondheid: [GROEN — vereist]

Bouw:
1. Welke signalen duiden op gereedheid (en welke zijn nog te zwak om op te handelen)
2. Het uitbreidingsnarratief voor mijn volgende gesprek
3. Prijsgesprekraamwerk en 3 bezwaarscripts
4. Of dit in CS af te handelen is of dat AE erbij moet worden gehaald
```

---

### Klantescalaties

**5. Churnpreventie — RODE accounts**
```
/churn-prevention

Deze klant loopt serieus churnrisico. Bouw me een reddingsplan.

Klant: [Bedrijf]
ARR: $[X]
Verlenging: [X weken/maanden weg]
Risicosignalen: [beschrijf ze allemaal — gebruik, relatie, commercieel]
Hoofdoorzaakhypothese: [wat denk je dat er echt mis is?]
Wat er al is geprobeerd: [eerdere outreachpogingen en uitkomsten]

Produceer:
- Herstel-QBR-structuur (wie mee te nemen, hoe te openen)
- Specifieke aanbiedingen of acties die te ondernemen
- Escalatiepad als standaardreddingspoging niet werkt
- Ga/geen-ga bij reddingspoging: is dit account te redden, of is churn waarschijnlijk ongeacht?
```

---

### Klantfeedbacksynthese (kwartaal)

**6. Voice of customer**
```
/customer-feedback-synthesizer

Synthesiseer klantfeedback van vorig kwartaal.

Bronnen:
- NPS-enquêtes: [plak resultaten of vat thema's samen]
- Supportticketcategorieën: [beschrijf meest voorkomende tickettypen en volume]
- QBR-notities: [plak kernthema's uit klantgesprekken]
- Churnredenen: [waarom gingen churned klanten weg?]

Benodigde output:
- Top 3 pijnpunten die klanten ervaren
- Top 3 dingen die klanten zeggen te waarderen
- Productgaten die het vaakst worden genoemd
- Uitvoerbare aanbevelingen voor: productteam, CS-team, leiderschap
- NPS-trend en wat promoters vs. detractors aandrijft
```

---

## 30-daags inwerklist (nieuwe CSM's)

### Week 1 — Ken je portfolio
- Installeer alle CS-skills
- Voer `/health-score-analyzer` uit voor elk account — stel je baseline-portfoliogezondheidkaart in
- Lees elk open supportticket in je portfolio — weet wat er brand voor je klanten ontmoet
- Plan introductiegesprekken met elk account in je eerste 30 dagen (ook gezonde accounts)

### Week 2 — Eerste klantgesprekken
- Gebruik `/qbr-builder` om zelfs voor informele check-in gesprekken voor te bereiden — de vragen zijn hetzelfde
- Na elk gesprek: schrijf opvolgingsmail en CRM-notitie met Claude in minder dan 10 minuten
- Gebruik `/expansion-playbook` om in kaart te brengen welke accounts uitbreidingspotentieel hebben — ook als je er nog niet op handelt
- Identificeer je top 3 meest risicovolle accounts voor einde week 2

### Week 3 — Gezondheidsscore en proces
- Gebruik `/health-score-analyzer` om elk account formeel te scoren — documenteer in CRM
- Stel je wekelijkse gezondheidsreviewritme in
- Review het gezondheidsscoremodel met je CS-manager — stem af op de tiers en scoringsgewichten
- Voer je eerste at-risk account door `/churn-prevention` — ook als het slechts een oefening is

### Week 4 — QBR en uitbreiding
- Voer je eerste QBR uit met `/qbr-builder` — laat een senior CSM je voorbereiding schaduwen of reviewen
- Identificeer 2-3 accounts die klaar zijn voor een uitbreidingsgesprek — presenteer het plan eerst aan je manager
- Review je CRM-hygiëne: zijn alle accounts bijgewerkt met gezondheidsscores, laatste contactdatums, verlengingsdatums?
- Rapporteer aan je manager: portfoliogezonheid, ARR in risico, topkansen

---

## Tool-integraties

### HubSpot CRM (aanbevolen)

```json
// Voeg toe aan ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Met HubSpot verbonden kan Claude:
- Accountgezondheidsvelden, laatste contactdatums en verlengingsdatums direct lezen
- Accountgezondheidsscores bijwerken na je portfolioreview
- Opvolgingstaken aanmaken vanuit QBR-actiepunten
- Verlengingspipeline-rapporten ophalen

### Gainsight / ChurnZero / Totango

Als je team een dedicated CS-platform gebruikt, exporteer accountgezondheidsdata als CSV → plak in `/health-score-analyzer` voor analyse en aanbevelingen. Claude werkt met de output van elk CS-platform.

### Gong / Chorus (gespreksopname)

Haal gespreksscript op → vraag Claude om te extraheren:
- Kernthema's uit het klantgesprek
- Actiepunten met eigenaren
- Gezondheidssignalen (positieve en negatieve vermeldingen)
- CRM-notitie en concept-opvolgingsmail

```
Hier is het script van mijn gesprek met [Klant] vandaag:
[plak script]

Extraheer:
1. CRM-updatenotitie (2-3 zinnen: wat er besproken is, gezondheidssignalen, vervolgstappen)
2. Opvolgingsmail die vandaag verstuurd moet worden
3. Actiepunten: eigenaar + vervaldatum voor elk
4. Churmsignalen of uitbreidingssignalen die ik moet markeren
```

### Notion / Confluence (QBR-sjablonen)

Genereer QBR-deckoverzicht met `/qbr-builder` → bouw slides in Google Slides of Notion → gebruik Claude om het narratief te verfijnen tijdens de voorbereiding.

---

## Te volgen metrics

| Metric | Definitie | Groen | Geel | Rood |
|---|---|---|---|---|
| Net Revenue Retention | (MRR + uitbreiding - churn) / begin-MRR | > 110% | 95-110% | < 95% |
| Gross Revenue Retention | Verlengingsratio excl. uitbreiding | > 90% | 80-90% | < 80% |
| Gemiddelde gezondheidsscore | Portfoliogemiddelde gezondheidsbeoordeling | > 70/100 | 55-70 | < 55 |
| ARR in risico | % van portfolio in ROOD gezondheid | < 10% | 10-20% | > 20% |
| QBR-voltooiingsratio | % in aanmerking komende accounts met voltooide QBR in kwartaal | 100% | 75-99% | < 75% |
| Dagen sinds laatste contact | Portfoliogemiddelde | < 30 dagen | 30-60 dagen | > 60 dagen |
| Uitbreiding ARR gesourced door CS | Upsell en uitbreiding gesourced zonder AE-betrokkenheid | Volg en groei elk kwartaal |

---

## Veelgemaakte CS-fouten (en hoe Claude Code helpt ze te vermijden)

**Fout 1: Geen proactieve gezondheidsmonitoring**
`/health-score-analyzer` elke maandag dwingt een gestructureerde portfolioreview af. Je vindt problemen voordat klanten je dat vertellen — niet nadat ze de beslissing hebben genomen om te vertrekken.

**Fout 2: QBR's die productdemo's zijn**
`/qbr-builder` opent elke QBR met de zakelijke prioriteiten van de klant, niet een productrondleiding. Klanten verlengen niet vanwege een goede demo — ze verlengen omdat jij hen hebt geholpen iets te bereiken.

**Fout 3: Uitbreidingsgesprekken die beginnen met pricing**
`/expansion-playbook` bouwt het waardenarratief op voor elke commerciële discussie. Een prijs pitchen voor de behoefte is vastgesteld is de snelste weg naar een nee.

**Fout 4: Reactief churnbeheer**
De gezondheidsscore en signaaldetectie in `/health-score-analyzer` identificeert at-risk accounts 60-90 dagen voor verlenging — wanneer je nog tijd hebt om te interveniëren. Wachten tot de klant je vertelt dat ze vertrekken is te laat.

**Fout 5: ROI niet kwantificeren**
Elke QBR heeft een ROI-slide nodig. `/qbr-builder` dwingt je de klantresultaten te kwantificeren — niet in productfuncties, maar in zakelijke uitkomsten. "Je bespaarde 12 uur per week per teamlid" is een verlengingsargument. "We hebben 4 nieuwe functies opgeleverd" is dat niet.

---

## Bronnen

- [Aan de slag met Claude Code](./getting-started.md)
- [QBR builder skill](../skills/gtm/qbr-builder.md)
- [Health score analyzer skill](../skills/gtm/health-score-analyzer.md)
- [Expansion playbook skill](../skills/gtm/expansion-playbook.md)
- [CS QBR prep workflow](../workflows/cs-qbr-prep.md)
- [Churn prevention skill](../skills/marketing/churn-prevention.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
