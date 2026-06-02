---
name: sdr-lead-scorer
description: "ICP-fit + intentiesignaal leadscoring voor SDR's: scoor prospects van 0-100 op basis van je ideale klantprofiel, rangschik lijsten op prioriteit, en leg de redenering achter elke score uit"
---

# SDR Lead Scorer Skill

## Wanneer activeren
- Je hebt een ruwe leadlijst (Apollo-export, LinkedIn Sales Nav, evenementdeelnemerslijst, inkomend formulier) en moet prioriteren
- Een geautomatiseerd lead-routeringsysteem bouwen dat inkomende leads scoort vóór toewijzing
- Kwartaal-ICP-verversing — de database opnieuw scoren op basis van bijgewerkte criteria
- Je wilt aan je manager uitleggen waarom je bepaalde accounts prioriteert
- Een leadscoringmodel bouwen voor een nieuw product of marktsegment

## Wanneer NIET gebruiken
- Diepgaand onderzoek voor één account — gebruik `/sdr-research-brief` daarvoor (meer detail)
- Bestaande pipeline scoren voor forecastdoeleinden — gebruik `/commercial-forecaster`
- Klantgezondheidscoring — gebruik `/customer-success` skill
- Als je minder dan 10 leads hebt — scoor gewoon handmatig, geen systeem nodig

## Instructies

### Leadscoringprompt (batch)

```
Scoor deze leads op basis van mijn ICP.

Mijn product: [wat je verkoopt in één zin]
Mijn ICP:
  - Bedrijfsomvang: [X-Y medewerkers]
  - Sectoren: [lijst]
  - Tech-stacksignalen: [tools die fit aangeven]
  - Te targeten rollen: [specifieke titels]
  - Geografieën: [landen/regio's]
  - Negatieve signalen (GEEN fit als): [lijst — bijv. B2C, <10 medewerkers, concurrent-medewerker]

Leadlijst:
[PLAK LIJST — naam, titel, bedrijf, bedrijfsomvang, sector, tech-stack indien bekend]

Geef per lead een uitvoer:
| Lead | Bedrijf | ICP-score (0-100) | Tier | Topredenen voor score | Topkwalificatiebeletsel (indien aanwezig) |
|---|---|---|---|---|---|

Tier-definities:
- A (80-100): Direct outreach — perfecte fit
- B (60-79): Goede fit — deze week in sequence opnemen
- C (40-59): Marginaal — low-touch sequence of nurture
- D (<40): Geen fit — uitsluiten of archiveren

Na de tabel:
- Totaal A-tier leads: [N]
- Grootste diskwalificerende factor in deze lijst: [meest voorkomende reden voor lage scores]
- Datagat: [welke informatie de scorenauwkeurigheid zou verbeteren]
```

### ICP-scoringkader bouwen

```
Bouw een leadscoringkader voor [PRODUCTNAAM].

Doelmarkt: [beschrijving]
Verkoopmotion: [PLG / inside sales / field sales / partnergestuurd]

Definieer het scoringmodel:

FIRMOGRAFISCHE FIT (50 punten totaal):
- Bedrijfsomvang: [definieer bereiken en puntwaarden]
  bijv. 50-200 medewerkers: 20 ptn | 200-500: 15 ptn | 500-2000: 10 ptn | anders: 0 ptn
- Sector: [lijst doelsectoren en gewichten]
  bijv. SaaS: 15 ptn | FinTech: 12 ptn | eCommerce: 10 ptn | anders: 0 ptn
- Geografie: [regio's en gewichten]
  bijv. VS/VK/CA/AU: 10 ptn | EU: 7 ptn | ROW: 3 ptn
- Tech-stackoverlap: [tools die fit aangeven]
  bijv. Gebruikt Salesforce: +5 | Gebruikt HubSpot: +5 | Gebruikt Segment: +5 (max 15 ptn)

INTENTIESIGNALEN (30 punten totaal):
- Actieve vacatures voor rollen die jouw product helpt: [gewicht]
- Recente financieringsronde (<90 dagen): [gewicht]
- Nieuwe executive-aanstelling in relevante afdeling: [gewicht]
- Aankondiging van productlancering: [gewicht]
- Technologiewijzigingssignalen (overgestapt van X naar Y): [gewicht]
- G2/Capterra-reviewactiviteit: [gewicht]

CONTACTFIT (20 punten totaal):
- Titelovereenkomst met beslisser: [gewichten per titel]
  bijv. VP Sales / CRO: 15 ptn | Director Sales: 12 ptn | Sales Manager: 8 ptn
- Senioriteit: [gewichten]
- LinkedIn-verbindingsgraad: 2e graad: +5 | 3e: +2 | Geen: 0

NEGATIEVE SIGNALEN (aftrekkingen):
- Concurrent-medewerker: -50
- B2C-bedrijf: -30
- <10 medewerkers: -20
- Eerder afgemeld: -100 (nooit contact opnemen)
- Recent verloren deal (< 60 dagen): -20
```

### Geautomatiseerde leadscoring (codepatroon)

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const LeadScore = z.object({
  score: z.number().min(0).max(100),
  tier: z.enum(['A', 'B', 'C', 'D']),
  topReasons: z.array(z.string()).max(3),     // waarom deze score
  disqualifiers: z.array(z.string()).max(3),  // rode vlaggen
  recommendedAction: z.enum([
    'outreach_immediately',
    'add_to_sequence_this_week',
    'add_to_nurture',
    'disqualify',
    'needs_more_data',
  ]),
  missingData: z.array(z.string()),           // welke data de nauwkeurigheid zou verbeteren
  confidenceLevel: z.enum(['high', 'medium', 'low']),
})

async function scoreLead(lead: RawLead, icp: ICPDefinition): Promise<ScoredLead> {
  // Eerst: regelgebaseerde harde filters (directe diskwalificatie)
  if (icp.negativeSignals.competitorDomains.includes(getDomain(lead.email))) {
    return { ...lead, score: 0, tier: 'D', topReasons: ['Competitor employee'], recommendedAction: 'disqualify' }
  }

  if (lead.optedOut) {
    return { ...lead, score: 0, tier: 'D', topReasons: ['Opted out'], recommendedAction: 'disqualify' }
  }

  // Dan: Claude-gebaseerde scoring voor genuanceerde fit
  const { object } = await generateObject({
    model: anthropic('claude-haiku-4-5-20251001'), // Haiku — snel en goedkoop voor bulkscoring
    schema: LeadScore,
    system: `You are a B2B sales qualification expert. Score leads 0-100 against the ICP.
Be precise. Reference specific firmographic and intent data.
A score should reflect BOTH fit (will they buy?) AND timing (will they buy NOW?).`,
    prompt: `Score this lead against our ICP.

ICP: ${JSON.stringify(icp, null, 2)}

Lead:
- Name: ${lead.name}
- Title: ${lead.title}
- Company: ${lead.company}
- Employees: ${lead.employees}
- Industry: ${lead.industry}
- Tech stack: ${lead.techStack?.join(', ') ?? 'unknown'}
- Geography: ${lead.country}
- LinkedIn: ${lead.linkedInUrl ?? 'unknown'}
- Recent signals: ${lead.signals?.map(s => s.description).join('; ') ?? 'none identified'}
- Last contacted: ${lead.lastContactedDaysAgo ? `${lead.lastContactedDaysAgo} days ago` : 'never'}`,
  })

  return { ...lead, ...object }
}

// Batchscoring — verwerk 100 leads gelijktijdig (met snelheidslimiet)
async function scoreLeadList(leads: RawLead[], icp: ICPDefinition): Promise<ScoredLead[]> {
  const BATCH_SIZE = 10
  const results: ScoredLead[] = []

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE)
    const scored = await Promise.all(batch.map(lead => scoreLead(lead, icp)))
    results.push(...scored)
    console.log(`Scored ${Math.min(i + BATCH_SIZE, leads.length)}/${leads.length}`)
    await new Promise(r => setTimeout(r, 500)) // snelheidslimiet
  }

  return results.sort((a, b) => b.score - a.score)
}
```

### Inkomende lead-routering (realtime scoring)

```typescript
// Webhook: wordt geactiveerd wanneer een nieuwe lead een formulier invult
app.post('/webhooks/new-lead', async (req, res) => {
  const formData = req.body // e-mail, bedrijf, naam, formuliervelden

  // 1. Verrijk de lead
  const enriched = await enrichLead(formData.email) // Apollo/Clearbit

  // 2. Scoor op basis van ICP
  const scored = await scoreLead(enriched, ICP_CONFIG)

  // 3. Route op basis van tier
  switch (scored.tier) {
    case 'A':
      // Onmiddellijk: wijs toe aan senior SDR, activeer Slack-melding
      await assignToSDR(scored, 'senior', priority: 'immediate')
      await postSlackAlert('#sdr-hot-inbound', scored)
      break

    case 'B':
      // Vandaag: voeg toe aan SDR-wachtrij, schrijf automatisch in voor sequence
      await assignToSDR(scored, 'standard', priority: 'today')
      await enrolInSequence(scored.email, 'inbound-b-tier')
      break

    case 'C':
      // Nurture: marketingautomatisering neemt het over
      await enrolInSequence(scored.email, 'nurture-long')
      break

    case 'D':
      // Diskwalificeer: log reden, geen outreach
      await markDisqualified(scored.email, scored.topReasons)
      break
  }

  // 4. Werk CRM bij
  await upsertHubSpotContact(scored.email, {
    icp_score: scored.score,
    icp_tier: scored.tier,
    qualification_reason: scored.topReasons.join('; '),
    lead_source: 'inbound_form',
  })

  res.json({ ok: true, tier: scored.tier, score: scored.score })
})
```

### ICP-score interpretatie

```
SCORE 90-100 — Leg alles neer. Onderzoek dit account vandaag.
Deze accounts hebben bijna perfecte fit EN actieve aanleidingen.
Regel: outreach binnen 24 uur. Deze vensters sluiten.

SCORE 75-89 — Sterk. Voeg deze week toe aan sequence.
Goede fit, enige tijdsonzekerheid. 10 minuten onderzoek.
Regel: in sequence binnen 3 werkdagen.

SCORE 60-74 — Solide. De moeite waard, niet urgent.
Redelijke fit, heeft een aanleiding nodig om hoger te komen.
Regel: voeg toe aan geautomatiseerde sequence, prioriteer wanneer aanleidingen verschijnen.

SCORE 40-59 — Marginaal. Alleen low-touch.
Enkele ICP-signalen maar belangrijke criteria ontbreken.
Regel: alleen geautomatiseerde sequence. Geen handmatig onderzoek.

SCORE <40 — Geen fit. Geen contact opnemen.
Te veel ICP-criteria ontbreken. Outreach zou ieders tijd verspillen.
Regel: archiveren, niet in sequence opnemen, niet bellen.
```

### Datakwaliteitscheck (voor scoring)

```
Beoordeel de datakwaliteit voordat je deze leadlijst scoort.

[PLAK LEADLIJST]

Uitvoer:
- Totaal leads: [N]
- Leads met e-mail: [N] ([%])
- Leads met bedrijfsomvang: [N] ([%])
- Leads met sector: [N] ([%])
- Leads met tech-stack: [N] ([%])
- Leads met titel: [N] ([%])

Datagaten die de scorenauwkeurigheid het meest beïnvloeden:
1. [Meest voorkomend ontbrekend veld + hoe dit de score beïnvloedt]
2. [Op één na meest voorkomend]

Aanbeveling:
- Verrijk [X] leads via [Apollo / Clearbit / handmatig] voor scoring
- Score onmiddellijk met beschikbare data: [Y leads]
- Kan niet betrouwbaar scoren: [Z leads — reden]
```

## Voorbeeld

**Gebruiker:** Ik heb 47 inkomende leads van een webinar. Scoor ze en vertel me welke ik vandaag moet bellen.

**Invoer (voorbeeld):**
```
Jane Smith, VP Operations, Acme Corp, 450 medewerkers, B2B SaaS, gebruikt Salesforce + Slack
Bob Lee, IT Manager, Local Bakery, 12 medewerkers, Voeding & Drank, onbekende stack
Carol Wu, Head of Sales Ops, TechCo, 800 medewerkers, FinTech, gebruikt HubSpot + Intercom
```

**Uitvoer:**
| Lead | Bedrijf | Score | Tier | Reden | Actie |
|---|---|---|---|---|---|
| Carol Wu | TechCo | 88 | A | FinTech + 800 medewerkers + HubSpot-gebruiker + Head of Sales Ops = perfecte ICP | Vandaag bellen |
| Jane Smith | Acme Corp | 74 | B | Goede omvang en SaaS-verticaal, Salesforce-gebruiker, maar Operations-rol = niet primaire koper | Deze week in sequence opnemen |
| Bob Lee | Local Bakery | 12 | D | <50 medewerkers, verkeerde sector, verkeerde rol | Diskwalificeren |

**De bellijst van vandaag (A-tier):** 8 leads → bellen voor 11:00. Carol Wu is #1.
**Sequences van deze week (B-tier):** 23 leads → inschrijven vóór vrijdag.
**Gediskwalificeerd (D-tier):** 11 leads → gearchiveerd.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
