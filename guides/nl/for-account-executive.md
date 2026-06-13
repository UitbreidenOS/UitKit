# Claude voor Account Executives

Alles wat een Account Executive nodig heeft voor AI-ondersteund dealmanagement — dealreviews, wederzijdse succesplannen, championontwikkeling, RFP-reacties, concurrentiepositioning en forecastbeheer.

---

## Voor wie is dit bedoeld

Je bent een Account Executive (AE) die een pipeline van mid-market of enterprise deals beheert. Je dag bestaat uit dealreviews, klantgesprekken, championmanagement, het schrijven van voorstellen, onderhandelen en forecastgesprekken met je manager. Je besteedt te veel tijd aan procesadministratie — slides bouwen voor dealreviews, RFP-reacties herformatteren, MEDDPICC handmatig scoren en follow-up e-mails schrijven na gesprekken. Claude Code regelt het proces zodat jij je kunt richten op de activiteit die deals werkelijk sluit: praten met kopers.

**Voor Claude Code:** 45 minuten om een dealreviewslide voor te bereiden. 2 uur om een RFP-reactiesectie te schrijven. 30 minuten om een wederzijds succesplan van de grond op te bouwen. Handmatige MEDDPICC-scoring die altijd verouderd is.

**Na:** Dealreview in 15 minuten met MEDDPICC gescoord en risicovlaggen zichtbaar. RFP-reactiesectie in 10 minuten. Wederzijds succesplan in 20 minuten. Champion-enablementpakket in 15 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer alle AE-skills
npx claudient add skills gtm

# Of kies wat je nodig hebt:
npx claudient add skill gtm/deal-review
npx claudient add skill gtm/champion-builder
npx claudient add skill gtm/mutual-success-plan
npx claudient add skill gtm/deal-desk
npx claudient add skill gtm/rfp-responder
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
npx claudient add skill gtm/revenue-operations
npx claudient add agents advisors/cro-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Jouw Claude Code AE-stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/deal-review` | MEDDPICC-scoring, risicovlaggen, forecastcategorie, volgende stappen | Wekelijkse pipelinereview, voor managergesprek |
| `/champion-builder` | Champion-identificatie, enablementpakket, re-engagement scripts | Als de champion zwak is of stil is gevallen |
| `/mutual-success-plan` | Gezamenlijk sluitplan: mijlpalen, stakeholders, wederzijdse verplichtingen | Late-stage deals (Evaluatie → Onderhandeling) |
| `/deal-desk` | Dealstructurering, kortingsgoedkeuring, contractvoorwaardenreview | Complexe voorwaarden, niet-standaard pricing |
| `/rfp-responder` | RFP/RFI-reactiesecties, compliancematrices, managementsamenvatting | Elke ontvangen RFP/RFI |
| `/commercial-forecaster` | Pipeline- en forecastanalyse, dealscore, omzetprognoses | Wekelijkse forecastgesprekken |
| `/crm-hygiene` | Contact-/dealopschoning, verouderde pipeline-audit, deduplicatie | Maandelijkse CRM-gezondheid |
| `/hubspot` | Directe HubSpot CRM lezen/schrijven | Notities loggen, dealfases bijwerken |
| `/revenue-operations` | Pipeline-metrics, stagioconversieratio's, ARR-analyse | QBR's, territoriumplanning |

### Agents

| Agent | Model | Wanneer in te schakelen |
|---|---|---|
| `cro-advisor` | Opus | Complexe deals met meerdere stakeholders, onderhandelingsstrategie, bezwaarafhandeling op directieniveau |
| `competitive-analyst` | Sonnet | Realtime concurrentie-intelligence, positionering tegenover genoemde concurrenten |

---

## Dagelijkse workflow

### Ochtend — Pipelinereview (15-30 minuten)

**1. Prioriteitsdealidentificatie:**
```
/commercial-forecaster

Ochtend pipelinereview. Laat me zien:
- Welke deals staan deze week op Commit?
- Welke Commit-deals hebben het hoogste risico (MEDDPICC-hiaten, verschoven sluitdatum)?
- Welke Best Case-deals zijn de afgelopen 7 dagen voor- of achteruitgegaan?
- Deals die ik al 14+ dagen niet heb aangeraakt?

CRM-data: [plak je open pipeline uit HubSpot/Salesforce, of verbind via MCP]
```

**2. Dealreview voor het managergesprek van deze week:**
```
/deal-review

MEDDPICC-review voor [dealnaam].

Bedrijf: [naam]
Dealgrootte: $[ACV]
Fase: [fase]
Sluitdatum: [datum]

[plak je discoverynotes, e-mailthreads of vergadernotities]

Score elke MEDDPICC-dimensie, geef de top 3 risico's en adviseer een forecastcategorie.
```

---

### Actief dealwerk (het grootste deel van je dag)

**3. Championontwikkeling:**
```
/champion-builder

Beoordeel [contactnaam] als champion voor [deal].

Interacties tot nu toe: [samenvatting van vergaderingen en e-mails]
Championtests: [welk bewijs heb je voor elk van de 4 tests?]

Vertel me:
- Is deze persoon een sterke champion, een passief contact of een coach?
- Welk bewijs onderbouwt de beoordeling?
- Welke specifieke actie moet ik vandaag ondernemen om de champion te versterken of een betere te vinden?
```

**4. Wederzijds succesplan (late-stage deals):**
```
/mutual-success-plan

Maak een wederzijds succesplan voor [deal].

Koper: [bedrijf], Champion: [naam/titel], Economische koper: [naam/titel]
Dealgrootte: $[ACV], Beoogde sluiting: [datum]
Huidige fase: Evaluatie → overgang naar Onderhandeling
Resterende stappen voor ondertekening: [wat je weet dat er nog overblijft]

Produceer een volledig MSP-document dat ik vandaag met de champion kan delen.
Inclusief: succesdefinitie, mijlpalentabel, wederzijdse verplichtingen, risicoregister.
```

**5. RFP-reactie:**
```
/rfp-responder

Reageer op deze RFP-sectie.

RFP-vraag: [plak de vraag]
Ons product: [één alinea beschrijving]
Onze differentiators voor deze koper: [specifiek voor dit account en hun criteria]
Woordlimiet: [indien opgegeven]

Schrijf een reactie die direct antwoord geeft, geschiktheid aantoont en geen opvullende zinnen gebruikt.
```

---

### Na het gesprek — Loggen en opvolging (10-15 minuten)

**6. Gespreksnabespreking en CRM-update:**
```
Ik ben net klaar met een gesprek met [naam, titel] bij [bedrijf].

Belangrijkste takeaways:
[opsommingstekens van wat er is besproken — neem direct na het gesprek 2 minuten de tijd voor ruwe notities]

Produceer:
1. Een CRM-notitie (3-4 alinea's — wat er besproken werd, wat we hebben geleerd, afgesproken vervolgstappen)
2. Een opvolgingsmail die vandaag verstuurd moet worden
3. MEDDPICC-update: welke dimensies zijn veranderd op basis van wat ik hoorde?
4. Het belangrijkste dat ik moet doen voor het volgende gesprek met dit account

/hubspot — Log de CRM-notitie voor [contactnaam] bij [bedrijf].
```

---

### Einde van de week — Forecast en pipeline-hygiëne

**7. Forecastvoorbereiding:**
```
/commercial-forecaster

Bereid mijn wekelijkse forecast voor.

Mijn deals:
[plak je pipelinelijst met fase, ACV, sluitdatum en huidige forecastcategorie]

Voor elke Commit-deal: score vertrouwen 1-10 met toelichting.
Voor elke Best Case-deal: wat zou er moeten gebeuren om deze week naar Commit te gaan?
Voor elke deal die ik uit de forecast zou moeten verwijderen: markeer deze.

Mijn wekelijks quotum: $[X] in nieuwe ARR.
```

**8. Pipeline-hygiëne:**
```
/crm-hygiene

Controleer mijn pipeline op verouderde en onjuiste data.

Mijn open pipeline: [plak deallijst met datum laatste activiteit, fase, sluitdatum]

Markeer:
- Deals met een sluitdatum in het verleden die niet Closed Won of Lost zijn
- Deals zonder activiteit in 30+ dagen (per fasenorm: Discovery >30 dagen, Evaluatie >45 dagen)
- Deals waarbij fase niet overeenkomt met MEDDPICC-score
- Dubbele contact- of bedrijfsrecords

Voor elke verouderde deal: adviseer actie — bijwerken / deactiveren / onderzoeken.
```

---

## 30-daags inwerklist (nieuwe AE's of overstap naar een nieuw segment)

### Week 1 — Setup en dealinventarisatie
- Installeer alle GTM-skills: `npx claudient add skills gtm`
- Verbind HubSpot via MCP (zie tool-integraties hieronder)
- Voer `/deal-review` uit voor elke deal in je overgeerfde pipeline — bepaal een basis MEDDPICC-score
- Voer `/commercial-forecaster` uit op je volledige pipeline — identificeer welke deals reëel zijn en welke verouderd

### Week 2 — Discovery en championontwikkeling
- Voer `/champion-builder`-beoordeling uit op je top 3 deals — wie is je echte champion?
- Gebruik de `/cro-advisor`-agent voor je hoogst-waardige deal — ontwikkel een strategie voor elk MEDDPICC-hiaat
- Schaduw of review RFP-reacties voor je product met `/rfp-responder` als oefening
- Stel je dealreviewsjabloon in zodat voorbereiding voor managergesprekken minder dan 15 minuten duurt

### Week 3 — Late-stage en sluitingsmechanismen
- Gebruik `/mutual-success-plan` voor elke deal in Evaluatie of later — maak een sluitplan
- Voer `/deal-desk` uit voor elke deal met niet-standaard voorwaarden — begrijp je kortingsbevoegdheid
- Oefen met `/competitive-analyst` voor je top 2-3 genoemde concurrenten — weet hoe je de vergelijking wint
- Review je forecastnauwkeurigheid van weken 1-2 versus werkelijke uitkomsten

### Week 4 — Optimalisatie en rapportage
- QBR-voorbereiding: gebruik `/revenue-operations` om je pipeline-metrics en conversieratio's op te halen
- Identificeer je zwakste MEDDPICC-dimensie over alle deals — welke dimensie doodt je deals het vaakst?
- Gebruik `/crm-hygiene` om de geerfde pipeline op te schonen — verwijder dode deals, werk fases bij
- Voer een championbeoordeling uit voor elke actieve deal — breng in kaart waar je blootgesteld bent

---

## Tool-integraties

### HubSpot (aanbevolen CRM)

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

Met HubSpot MCP verbonden:
- Log gespreksnotities direct: `Claude, log deze gespreksnotitie voor [contact] bij [bedrijf] in HubSpot`
- Werk dealfase bij: `Verplaats [dealnaam] naar Onderhandeling in HubSpot`
- Haal open pipeline op: `Haal alle openstaande deals in HubSpot op, inclusief fase, ACV en sluitdatum`
- Maak opvolgingstaak: `Maak een HubSpot-taak voor me om op te volgen met [contact] op [datum]`

### Gong / Chorus (gespreksopname)

Plak gespreksscripts in Claude Code voor:
- MEDDPICC-update na het gesprek
- Conceptopvolgingsmail
- Championbeoordelingsupdate op basis van wat je hoorde
- CRM-notitieverwerking

```
Hier is het script van mijn gesprek met [contact] bij [bedrijf]:
[plak Gong-script]

Haal op:
1. Welke MEDDPICC-dimensies werden bevestigd of bijgewerkt
2. Rode vlaggen die ik aan mijn manager moet melden
3. De opvolgingsmail die vandaag verstuurd moet worden
4. De CRM-notitie om in te loggen
```

### Salesforce

Plak Salesforce opportunity-data in elke `/deal-review`- of `/commercial-forecaster`-prompt. Voor directe Salesforce-integratie, configureer de Salesforce MCP-server indien beschikbaar in jouw stack.

### DocuSign / PandaDoc (contractbeheer)

Gebruik `/deal-desk` om commerciële voorwaarden te reviewen voordat je ze naar juridische zaken stuurt. Plak de belangrijkste clausules in `/deal-desk` voor een risicobeoordeling voor de definitieve goedkeuring.

### Slack (dealruimtekanalen)

Voor grote deals, onderhoudt een `#deal-[bedrijf]` Slack-kanaal. Plak updates uit dat kanaal in `/deal-review` voor een snelle deal-gezondheidscheck voor een managergesprek.

---

## Te volgen metrics

Haal deze wekelijks op uit HubSpot of Salesforce met `/revenue-operations`:

| Metric | Doel (inwerken AE) | Doel (vol quotum) |
|---|---|---|
| Deals met volledig MEDDPICC | >80% van actieve pipeline | 100% |
| MSP aanwezig voor late-stage deals | >90% van Evaluatie+ | 100% |
| Forecastnauwkeurigheid (Commit → Won) | >60% | >80% |
| Gemiddelde dealcyclustijd | Vergelijk met teamgemiddelde | Op of onder teamgemiddelde |
| Sluitingsratio (Evaluatie → Won) | Vergelijk met cohort | Op of boven cohort |
| Activiteit per deal per week | 2+ betekenisvolle contactmomenten | 2+ betekenisvolle contactmomenten |
| Pipelinedekking (vs. quotum) | 3x | 4x |
| CRM-updaterate (gelogde notities) | 90% binnen 24u | 100% |

---

## Veelgemaakte fouten (en hoe Claude Code helpt ze te vermijden)

**Fout 1: Deals vooruitschuiven zonder bevestigde economische koper**
`/deal-review` markeert een ontbrekende economische koper als een Kritisch MEDDPICC-hiaat. Het laat je een deal niet Commit noemen zonder dit.

**Fout 2: Een passief contact behandelen als een champion**
`/champion-builder` voert de vier championtests uit. Een contact die je geen toegang heeft gegeven tot de economische koper is een coach, geen champion. De skill vertelt je dit expliciet.

**Fout 3: Een wederzijds succesplan bouwen dat de koper nooit ziet**
Een MSP werkt alleen als beide partijen het erover eens zijn. De skill bevat een e-mailsjabloon om het naar je champion te sturen voor review voordat de economische koper het ziet.

**Fout 4: Verouderde deals laten zitten in Commit**
`/commercial-forecaster` markeert deals met laatste activiteit >14 dagen. Commit-deals zonder activiteit zijn forecastinflatie, geen pipeline.

**Fout 5: RFP-reacties die de eigenlijke vraag niet beantwoorden**
`/rfp-responder` beantwoordt eerst de specifieke RFP-vraag en ondersteunt daarna met bewijs — het begraaft het antwoord niet in een marketingalinea.

---

## Bronnen

- [Aan de slag met Claude Code](../getting-started.md)
- [AE dealcyclus workflow](../workflows/ae-deal-cycle.md)
- [Deal desk skill](../skills/gtm/deal-desk.md)
- [RFP responder skill](../skills/gtm/rfp-responder.md)
- [CRO Advisor agent](../agents/advisors/cro-advisor.md)
- [Competitive analyst agent](../agents/roles/competitive-analyst.md)

---
