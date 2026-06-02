# ICP-scoring

## Wanneer activeren

U bent bedrijven in de B2B SaaS-sector aan het benaderen en moet leads kwalificeren tegen een gedefinieerd ideaalprofiel (ICP). Activeer dit wanneer: u een nieuwe lead scoort voor outreach-tier, een prospectlijst priorisert, contact diepte voor een bedrijf bepaalt, of fit valideert voordat u het naar verkoop doorgeeft.

## Wanneer NIET gebruiken

- U hebt al een lead binnen een customer success/retention workflow — gebruik in plaats daarvan churn prevention frameworks.
- Prospect is al een klant of actieve opportunity in uw CRM — dit is alleen voor nieuwe prospecting.
- U doet lead generation sourcing (het vinden van *welke* bedrijven u moet benaderen) — dit is voor het *kwalificeren* van bedrijven die u al hebt geïdentificeerd.
- Het doelbedrijf heeft minder dan 10 werknemers of bevindt zich in een rigide disqualificerende sector — scoring is zinloos; markeer als do-not-contact.

## Instructies

### ICP-definitie in 3 lagen

Elk ICP wordt gedefinieerd over drie orthogonale dimensies. Score elk afzonderlijk en combineer vervolgens.

**Laag 1: Firmographische fit (0–40 punten)**

Objectieve bedrijfskenmerken die bepalen of het bedrijf structureel kan kopen.

| Attribuut | Doel | Punten |
|---|---|---|
| **Industrietak** | Primair (bijvoorbeeld SaaS, FinTech, Healthcare Tech) | 20 |
| Secundaire fit (aangrenzend, bewezen use case) | 10 |
| Verkeerde sector (disqualificatie) | 0 |
| **Aantal werknemers** | 50–500 | 15 |
| 25–49 of 501–1.000 | 8 |
| 10–24 of 1.001+ | 2 |
| Minder dan 10 | 0 (hard disqualificatie) |
| **Annual Recurring Revenue (ARR)** | $5M–$100M | 5 |
| $2M–$4,9M of $100M–$500M | 3 |
| Minder dan $2M of meer dan $500M | 0 |
| **Geografie** | VS, UK, Canada, West-Europa (primair) | Inbegrepen hierboven; secundaire markten scoren op 80% |

*Firmographische plafond: 40 punten. Een bedrijf dat perfect scoort op alle kenmerken haalt 40 punten.*

**Laag 2: Technographische fit (0–30 punten)**

Signalen van tech stack en infrastructuur die product fit aangeven of disqualificatie veroorzaken.

Score op basis van *aanwezigheid* van signalen (niet afwezigheid). Controleer: publieke tech stacks (StackShare, LinkedIn, vacatures, funding decks), GitHub publieke repositories, vacatures voor tech-rollen, oprichtings-/funding-aankondigingen.

| Signaaltype | Voorbeelden | Punten |
|---|---|---|
| **Core fit** (uw oplossing past rechtstreeks in hun stack) | Node.js, PostgreSQL, Kubernetes gebruiken; "DevOps Engineer" aannemen; microservices publiek bespreken | 15 |
| **Secundaire fit** (sterke nabijheid) | Cloud infrastructure (AWS, GCP, Azure); CI/CD-vermeldingen; data pipeline investeringen | 10 |
| **Zwak signaal** (algemene moderne technologie, niet specifiek voor uw ICP) | Standaard SaaS stack (React, Python, typische AWS); geen rode vlaggen maar geen sterke fit | 5 |
| **Hard disqualificatie** | Vastgelopen in tech stack van concurrent; alleen legacy mainframe; volledig incompatibele vendor | 0 |

*Selecteer de hoogst scorende signaalpingcategorie. Technographische plafond: 30 punten.*

**Laag 3: Gedragspatronen (0–20 punten)**

Recente momentum- en groeipatronen die koopintentie en budgetboeking aangeven.

| Signaal | Recency | Punten |
|---|---|---|
| **Financieringsronde** (Series A of later, niet seed) | Laatste 12 maanden | 8 |
| 13–24 maanden geleden | 5 |
| Meer dan 24 maanden | 2 |
| **Aanstellingsspurt** (publiek 5+ vacatures in uw doelafdelingen: engineering, data, product) | Laatste 30 dagen | 8 |
| 31–90 dagen geleden | 5 |
| Meer dan 90 dagen | 2 |
| **Expansiesignalen** (nieuw kantoor, nieuw productlancering, nieuwe marktingang, nieuw integratie-ecosysteem) | Laatste 90 dagen | 4 |

*Gedragsplafond: 20 punten. Meerdere signalen zijn additief tot 20.*

### Recency Decay (0–10 punten bonus/penalty)

Alle firmographische gegevens worden verouderd. Pas de uiteindelijke score aan op basis van gegevensfrisheid.

| Gegevensfrisheid | Aanpasssing |
|---|---|
| Alle ICP-kenmerken geverifieerd in laatste 30 dagen | +10 |
| Geverifieerd 31–90 dagen geleden | +5 |
| Geverifieerd 91–180 dagen geleden | 0 |
| Meer dan 180 dagen oud (geen recente verificatie) | –5 |

*Voorbeeld: Een lead van 75 punten met 6 maanden oude bedrijfsgrootte-gegevens wordt 70 punten.*

### Volledig scoring model: 0–100

**Formule:**
```
SCORE = Firmographic (0–40) + Technographic (0–30) + Behavioural (0–20) + Recency (–5 to +10)
RANGE: 0–100
```

### Hard disqualificaties (Score = 0, sla alle tiers over)

Zelfs als andere dimensies hoog scoren, markeer de lead **do-not-contact** als een van deze van toepassing is:

1. **Concurrent** — Ze bouwen/verkopen een concurrerend product.
2. **Bestaande klant** — Al in uw klantenbasis of actieve trial.
3. **Verkeerde industrietak** — Buiten uw gedefinieerde primaire/secundaire sectoren (bijvoorbeeld overheidsaannemer wanneer u SaaS aanwijst).
4. **Aantal werknemers onder 10** — Te klein voor inkoopproces of budget.
5. **Expliciete disqualificatiesignalen** — Publieke uitspraken tegen uw categorie; uitsluitend incompatibele vendor gebruiken; faillissements-/afsluitingsaankondigingen die budgetbevriezing aangeven.

### Tierdefinities en actionable playbooks

Na scoring (en confirmatie dat geen hard disqualificaties gelden), route naar outreach-tier:

#### Tier 1 (80–100 punten)
**Kenmerken:** Perfecte of bijna perfecte fit. ICP-match op 2+ dimensies. Recente signalen.

**Outreach playbook:**
- Manueel dieponderzoek: Lees laatste 3 earnings calls (als openbaar), recente blogberichten, CEO Twitter, LinkedIn vacatures, recente financieringsaankondiging.
- Identificeer 2–3 specifieke, gepersonaliseerde hooks (bijvoorbeeld "Ik zag dat u vorige maand 7 engineering-rollen hebt geplaatst; we helpen teams zoals de uwe onboardingtijd met 40% te verminderen").
- Gepersonaliseerde email-sequentie: 5-touch, 21-daags tempo. Aangepaste hook in email 1. Referentie specifieke bedrijfsmijlpaal in email 3. Social touch (LinkedIn opmerking op recente post) als touch 4.
- Verkoopbetrokkenheid: Toewijzen aan benoemde account executive. Gebruik volledige sales development playbook.

**Benchmarkantwoordpercentage:** 8–12% antwoordpercentage (met personalisatie).

#### Tier 2 (50–79 punten)
**Kenmerken:** Sterke fit op 1 dimensie, adequate fit op anderen. Duidelijke ICP-match maar mist mogelijk recent momentum.

**Outreach playbook:**
- Template email met 1 personalisatiehook (bijvoorbeeld "Uw team nam vorig kwartaal 6 engineers aan; we helpen teams zoals [soortgelijk bedrijf] [resultaat] te bereiken").
- Standaard 3-touch sequentie in 14 dagen: Email → 5-daags wacht → LinkedIn bericht → 3-daags wacht → Definitieve email.
- Geen manueel dieponderzoek; gebruik alleen openbare signalen (LinkedIn, StackShare, financieringsaankondigingen).
- Lichte verkoopbetrokkenheid: Alleen SDR, geen AE-toewijzing.

**Benchmarkantwoordpercentage:** 4–6% antwoordpercentage.

#### Tier 3 (20–49 punten)
**Kenmerken:** Gedeeltelijke fit. Overeenkomst met ICP slechts op één dimensie, of zwakke signalen over meerdere dimensies.

**Outreach playbook:**
- Template email (geen personalisatie). Slechts één touch.
- Batch-and-blast: Verzend in bulk campagnes. Geen vervolgsequentie.
- Gebruik voor lijstopbouw en merkbekendheid, niet voor directe verkoop.
- Geen verkoopbetrokkenheid.

**Benchmarkantwoordpercentage:** 1–2% antwoordpercentage (verwacht lage betrokkenheid).

#### Onder 20 punten
**Actie:** Niet contacteren. Verplaats naar "nurture" segment alleen voor toekomstige campagnes. Herdefinieer jaarlijks opnieuw.

---

### Scoring prompt template

Gebruik deze promptstructuur om een lead met Claude te scoren:

```
Score dit bedrijf tegen onze ICP met behulp van het bijgevoegde 0–100 model.

COMPANY: [Company name]
INDUSTRY: [Industry]
HEADCOUNT: [Number] (source: [LinkedIn/PitchBook/etc])
ARR: [Estimated or public $] (source: [how you know])
GEOGRAPHY: [Country/region]

TECH STACK SIGNALS:
- [Tool/platform 1] (source: [job post/StackShare/GitHub])
- [Tool/platform 2]
- [Tool/platform 3]

BEHAVIOURAL SIGNALS:
- Funding: [Series X, $Y, date] (source: [Crunchbase/press release])
- Hiring: [Number of open roles in target department, dates posted] (source: [LinkedIn jobs])
- Expansion: [New market/office/product launch] (source: [announcement])

DATA FRESHNESS: All data verified [date range]

TASK:
1. Score each dimension independently (Firmographic, Technographic, Behavioural, Recency).
2. Identify any hard disqualifiers.
3. Return: TOTAL SCORE, TIER, RECOMMENDATION (contact depth + sequence type).
4. List the top 2 personalization hooks (if Tier 1 or 2).

Format response as:
---
**SCORE: [0-100]**
**TIER: [1/2/3/Do Not Contact]**
**DISQUALIFIERS:** [None / List any found]
**FIRMOGRAPHIC:** [X points] — [reasoning]
**TECHNOGRAPHIC:** [X points] — [reasoning]
**BEHAVIOURAL:** [X points] — [reasoning]
**RECENCY ADJUSTMENT:** [+/- X points]

**TOP PERSONALIZATION HOOKS:**
1. [Hook 1 — specific, time-bound]
2. [Hook 2 — specific, time-bound]

**RECOMMENDATION:** [Outreach playbook and next step]
---
```

---

## Voorbeeld

### Scenario: TechVentures Inc. scoren (Hypothetisch FinTech SaaS)

**Verzamelde ruwe gegevens:**

| Attribuut | Waarde | Bron |
|---|---|---|
| Bedrijf | TechVentures Inc. | Crunchbase |
| Industrie | FinTech (betalingsverwerking) | Website, LinkedIn |
| Aantal werknemers | 180 | LinkedIn Company Page (2 weken geleden bijgewerkt) |
| ARR | $18M | Crunchbase financiering + burn calc |
| Geografie | San Francisco, CA (VS) | Company website |
| Tech stack | Python, PostgreSQL, AWS, Kubernetes, Node.js microservices | Vacatures (Aug 2026), GitHub publieke repositories |
| Financiering | Series B, $45M, aangebracht maart 2026 | Crunchbase, TechCrunch |
| Aanstellingen | 12 open Engineering rollen (geplaatst laatste 30 dagen) | LinkedIn vacaturepagina |
| Expansie | Aangekondigd UK-expansie (jul 2025) | Company blog |
| Gegevens geverifieerd | Jun 2026 | Deze scoring-sessie |

### Scoring:

**FIRMOGRAPHISCH (max 40):**
- Industrie fit (FinTech primaire sector): 20 punten
- Aantal werknemers (180, in bereik 50–500): 15 punten
- ARR ($18M, in bereik $5M–$100M): 5 punten
- **Subtotaal: 40 punten** ✓

**TECHNOGRAPHISCH (max 30):**
- Core fit: PostgreSQL + Python microservices op AWS/Kubernetes past bij moderne SaaS-infrastructuur (15 punten).
- Geen disqualificatiesignalen.
- **Subtotaal: 15 punten** ✓

**GEDRAGSMATIG (max 20):**
- Financiering (Series B, $45M, maart 2026 = 3 maanden geleden): 8 punten
- Aanstellingsspurt (12 Engineering-rollen, geplaatst <30 dagen): 8 punten
- Expansie (UK-kantoor aangekondigd, maar 11+ maanden geleden): 2 punten
- **Subtotaal: 18 punten** ✓

**RECENCY (±10):**
- Alle gegevens geverifieerd in laatste 30 dagen: +10 punten

---

### UITEINDELIJKE SCORE: 40 + 15 + 18 + 10 = **83 punten**

### TIER: **Tier 1 (80–100)**

### DISQUALIFICATIES: Geen

### AANBEVELING:

**Outreach Playbook — Tier 1:**

**Personalisatiehooks:**
1. "U haalde $45M op in Series B (maart 2026) en werft agressief aan (12 engineering-rollen open). We helpen FinTech-platforms die op AWS/Kubernetes schalen de complexiteit van infrastructuur met 35% te verminderen—direct relevant terwijl u naar UK uitbreidt en personeelslid toevoegt."
2. "U bouwde op PostgreSQL + microservices, wat precies is waar [onze oplossing] de meeste waarde levert. Teams zoals Stripe en Wise gebruiken ons om implementatiecycli te versnellen wanneer zij over regio's schalen."

**Email-sequentie (5 touches, 21 dagen):**
- **Dag 1:** Gepersonaliseerde email. Onderwerp: "[CTO name], TechVentures' groeibaan + microservices stack." Inclusief financieringsaankondigingsuithangbord + 1 personalisatiehook.
- **Dag 6:** Vervolgmail. "Raakte mijn vorige email over UK-expansie-uitdagingen je?"
- **Dag 10:** LinkedIn bericht aan CTO/VP Engineering (ander messaging hoek).
- **Dag 14:** Value-add touch: Deel relevante casestudy (FinTech-bedrijf, soortgelijk ARR, scalingscenario).
- **Dag 21:** Definitieve breakup email. "Laatste kans: Laten we praten over uw Q3 infrastructuurdoelstellingen."

**Verkoopbetrokkenheid:** Toewijzen aan benoemde AE. 30-min discovery call target.

**Verwachte resultaat:** 8–12% antwoordpercentage. Doel voor directe verkoopkwalificatie.

---

**Einde scoring voorbeeld. TechVentures Inc. is goedgekeurd voor Tier 1 intensiteit outreach.**
