# Bedrijfsintelligentie

## Wanneer activeren

- Gebruiker voorziet een bedrijfsnaam en LinkedIn URL en vraagt om "dit account onderzoeken," "een dossier samenstellen," "besluitvormers vinden," of "pijnsignalen identificeren"
- Gebruiker moet begrijpen wie budgetverantwoordelijkheid heeft, wie invloed uitoefent, en wie blokkeert bij een specifiek bedrijf
- Gebruiker wil uitreikingshaken identificeren vóór koude acquisitie of account mapping
- Gebruiker bereidt zich voor op een discovery call en heeft voorbereidingsintelligentie nodig
- Gebruiker heeft een lijst met doelbedrijven en heeft tiering-gebaseerde onderzoeksdiepte nodig

## Wanneer NIET gebruiken

- Gebruiker stelt algemene B2B-onderzoeksvragen niet gekoppeld aan een specifiek account (gebruik een web research tool)
- Gebruiker wil koude e-mail kopie genereren (Bedrijfsintelligentie voert acquisitie in, maar schrijft het niet)
- Gebruiker onderzoekt een bedrijf voor evaluatie als *leverancier* of *kandidaat* (ander onderzoeksmodel)
- Gebruiker heeft al eigen diepgaand onderzoek voltooid en wil alleen validatie (gebruik code-review of verify)
- Gebruiker wil realtime prijsgegevens of financiële cijfers (deze skill richt zich op besluitvorming en pijnsignalen, niet financiën)

## Instructies

### Het 5-laagse Account Intelligence Model

Elk bedrijfsdossier wordt gebouwd door deze lagen te stapelen. Hogere tiers vereisen alle vijf; lagere tiers vereisen drie.

#### Laag 1: Organisatiestructuur (Besluitvormerskaart)

**Doel:** Identificeer drie roltypen in het bedrijf:
- **Economische koper** — heeft budgetverantwoordelijkheid, P&L verantwoordelijkheid, finaal veto. (CFO, VP Finance, CRO, VPE, VP Ops)
- **Champion** — gebruikt je oplossing dagelijks, heeft persoonlijk voordeel bij aankoop. (Teamlead, IC, manager van de functie die je oplost)
- **Influencer** — vormt perceptie en kan blokkeren of versnellen. (CTO, Chief Product Officer, peer leader, audit functie)

**Bronnen om te controleren:**
- Company LinkedIn pagina: Executive leadership sectie, recente huurlingen in C-suite/VP rollen
- LinkedIn: Zoek "[Company] [Title]" voor elke rol, controleer laatste activiteit (binnen 30 dagen is actief)
- G2/Capterra: Recensenten vermelden vaak hun titel en senioriteit
- Vacatures: Nieuwe huurlingen/rollen onthullen wie welke functie uitbreidt (signaleert prioriteit)

**Beslissingslogica:**
- Als bedrijf <100 medewerkers: Economische koper is vaak oprichter/CEO; Champion is de direct betrokken teamlead
- Als bedrijf 100–1000: Economische koper is VP/CFO van functie; Champion is manager of lead IC; Influencer is CTO of Chief van die functie
- Als bedrijf >1000: Voeg nog één laag toe — vind sponsor (director-level die je kan introduceren bij Economic Buyer)

#### Laag 2: Recente Gebeurtenissen (Momentum Signalen)

**Doel:** Vind de laatste 90 dagen bedrijfsactiviteit die urgentie of context creëert.

**Bronnen om te controleren (in volgorde):**
1. Company LinkedIn: Posts, aangekondigde huurlingen, mijlpalen (funding, IPO, acquisitie, kantoormopening)
2. CEO/VP LinkedIn activiteit: Retweets, shares, article comments — onthult wat hun aandacht heeft
3. Persberichten: Crunchbase, company website, Medium, nieuwsfeeds
4. Financieringsaankondigingen: Crunchbase, TechCrunch, VentureBeat (onthult kapitaal, groeitargets, nieuwe problemen)
5. Productlanceringen: G2 nieuwe features, feature aankondigingen in company newsletter of blog
6. Leiderschapsveranderingen: CEO, CRO, CTO, VP van functie waar je aan verkoopt (onthult prioriteiten, eetlust voor verandering)

**Scoring:**
- Recente financiering (binnen 90 dagen) = hoogste urgentie (geld om uit te geven, druk om het in te zetten)
- Productlancering of marktexpansie = middelmatige urgentie (bouwt nieuwe inkomstenstream, kan tooling nodig hebben)
- Leiderschapsverandering in je functie = middelmatige urgentie (nieuwe leider wil impact maken)
- Nieuws/pers = lage urgentie (context, niet een trigger)

#### Laag 3: Tech Stack & Hiaten (Capabilitysbeoordeling)

**Doel:** Identificeer wat ze gebruiken, wat niet, en wat kapot is.

**Bronnen om te controleren (in volgorde):**
1. BuiltWith: Onthult marketing tech, analytics, CRM, infrastructure, security tools
2. LinkedIn job postings: "Zoekt [tool] expert" of "required: experience with [tool]" = huidige stack; "nice to have: [tool]" = aspirationeel/hiaat
3. G2 reviews: Filter op bedrijfsgrootte en industrie, lees reviewer opmerkingen voor pijn (traagheid, integratiehiaten, kosten)
4. Crunchbase: Company tech integrations als vermeld
5. Company blog/podcast: Tech posts, case studies, architecture decisions onthullen infrastructure keuzes
6. SEC filings (als publiek): Software expense breakdowns soms onthult

**Beslissingslogica:**
- Als ze [Tool A] + [Tool B] gebruiken maar *niet* [Tool C] = waarschijnlijk hiaat of bewuste keuze
- Als meerdere reviews zeggen "[Tool] is traag om te integreren" = pijnproxy
- Als vacature zegt "must know [Tool]" maar je ziet geen gebruik elders = nieuw initiatief dat ze bouwen
- Als ze [Competitor Tool] gebruiken = reference objection om voor te bereiden

#### Laag 4: Pijnproxy's (Vacature + Review Mining)

**Doel:** Extraheer impliciete problemen uit vacatures en gebruikersreviews.

**Methodologie:**

Vacature Patroonmatching:
- "Zoekt [role] om/to build/improve [function]" → Ze investeren in dat gebied
- "5+ years of experience with [specific hard skill]" → Het is vandaag een knelpunt
- "Must have experience with scale/growth/automation" → Ze treffen wrijving
- "We're looking for someone to streamline [X]" → Huidige proces is traag of manueel
- "Help us migrate from [Old System] to [New System]" → Legacy schuld, vendor evaluatie gaande
- "Build dashboards/reporting for [department]" → Geen zichtbaarheid vandaag

G2 Review Patroonmatching (filter op je bedrijfsgrootte/industrie):
- "Slow to implement" → Verkoopscyclus lengte + deployment wrijving
- "Missing [feature]" → Feature hiaat dat je kan vullen
- "Expensive" → Kostenobjection, budget gevoeligheid
- "Poor integration with [tool]" → Integration nightmare = sales hook
- "Love it but can't scale beyond X" → Groeipin, acquisition opportunity

**Scoring:** Tel pijnsignalen. 3+ duidelijke signalen over reviews + vacatures = sterke kwalificatie.

#### Laag 5: Sociale Voetafdruk (Betrokkenheid & Gedachtelederschao)

**Doel:** Begrijp hoe zichtbaar en actief de besluitvormers zijn; wat hen interesseert.

**Bronnen om te controleren:**
1. CEO/VP LinkedIn activiteit: Posts (niet alleen re-shares), betrokkenheid, article reads, comments op industry trends
2. Company LinkedIn: Organisch engagement rate (comments, shares, reactions); industry onderwerpen die zij kampioenen
3. CEO Twitter/X: Als actief, onthult realtime prioriteiten, filosofie, besluitvorming
4. Company newsletter: Als ze er een publiceren, toont wat zij investeren
5. Podcast/webinar verschijningen: Spreekengegevens onthullen positionering en publiek

**Scoring:**
- Actief (posts 2–4x per week, engageert met comments) = zichtbare leider, responsief op inbound, kan koude acquisitie lezen
- Dormant (<1 post per month, geen engagement) = minder waarschijnlijk koude acquisitie te zien, kan warm intro nodig hebben
- Gedachtelederschao (speaking, writing, cited as expert) = geloofwaardige leider, gemakkelijker flattery-based hook

---

### Onderzoeksdiepte naar Tier

Alle tiers gebruiken het 5-laag model, maar onderzoeksintensiteit en output detail verschillen.

#### Tier 1 — Volledig Dossier (20 minuten)
**Wanneer gebruiken:** High-value account (named deal, enterprise ACV >$100k, C-list target, strategic partnership)
**Onderzoeksdiepte:**
- Laag 1: Vind 3 besluitvormers op naam, titel, huidige LinkedIn activiteit, laatste postdatum
- Laag 2: Extraheer 3–5 recente events met datums, link naar elk (funding, hires, launches, leadership changes)
- Laag 3: Vermeld 10+ tools in hun stack, identificeer 2–3 hiaten, citeer bron voor elk tool
- Laag 4: Mijn 5+ vacatures + 8–10 G2 reviews, extraheer 5+ pijnsignalen met voorbeelden
- Laag 5: Profiel CEO + 2 VPs — activiteitsfrequentie, laatste postdatum, engagement stijl

**Output:** Volledig Account Dossier (template hieronder)
**Tijdschatting:** 18–22 minuten (4–5 min per laag + 2 min synthese)

#### Tier 2 — Medium Brief (10 minuten)
**Wanneer gebruiken:** Mid-market account (ACV $20k–$100k), account list, early prospecting
**Onderzoeksdiepte:**
- Laag 1: Vind 2 besluitvormers (economic buyer + champion), alleen namen + titels
- Laag 2: Extraheer 2–3 recente events (meest recent alleen)
- Laag 3: Vermeld 5–7 sleuteltools, 1–2 hiaten
- Laag 4: Mijn 3–4 vacatures + 4–5 reviews, extraheer 3–4 pijnsignalen met lichte voorbeelden
- Laag 5: Alleen CEO activiteitsniveau (actief/dormant/thought leader)

**Output:** Afgekort dossier (1 pagina)
**Tijdschatting:** 8–11 minuten

#### Tier 3 — Minimaal Profiel (3 minuten)
**Wanneer gebruiken:** High-volume list onderzoek, snelle kwalificatie, social selling
**Onderzoeksdiepte:**
- Laag 1: Vind CEO naam + titel alleen
- Laag 2: Één recent signaal (funding, nieuws, of recente hire)
- Laag 3: Één opmerkelijk tool of hiaat
- Laag 4: Één pijnsignaal (uit vacature of review)
- Laag 5: Overgeslagen

**Output:** Eenparagraaf bedrijfsrapportage
**Tijdschatting:** 2–4 minuten

---

### Account Dossier Output Template

Gebruik deze exacte indeling voor Tier 1 onderzoek. Pas aan voor Tier 2/3 door secties [T1 only] te verwijderen.

```
## [COMPANY NAME] — Account Intelligence Dossier

### Bedrijfsoverzicht (2 zinnen)
[1 zin over wat ze doen + markt]
[1 zin over recente traction of context die relevant is voor je pitch]

### Besluitvormerskaart
[Format: Naam (Titel, Laatste LinkedIn Activiteit) — Rol & Invloed]

**Economische Koper:** [Naam], [Titel]
- P&L eigenaar: [specifieke functie: Sales, Engineering, Finance, Ops]
- Laatst actief op LinkedIn: [datum]
- Signaal: [korte context, bijv. "Posted about hiring for team expansion" of "No activity in 60 days"]

**Champion:** [Naam], [Titel]
- Gebruikt je solution category dagelijks
- Laatst actief op LinkedIn: [datum]
- Signaal: [vacature bewijs of review waarbij deze rol de pijn beschreef]

**Influencer:** [Naam], [Titel]
- Kan blokkeren/versnellen: [waarom: CTO, Chief Product Officer, peer leader in hun functie]
- Laatst actief op LinkedIn: [datum]
- Signaal: [recente activiteit die relevantie bewijst: post over tech choices, hiring, M&A]

[T1 only] **Sponsor (optional):** [Naam], [Titel]
- Brug naar economic buyer (als bedrijf >1000 medewerkers)

### Laag 2: Recente Gebeurtenissen (Momentum Signalen)
[3–5 events, meest recent eerst, met datums en links]

- **[Datum, Event Type]:** [Wat gebeurde] → Implicatie voor je pitch
  - Bron: [Link]

### Laag 3: Tech Stack & Hiaten
[Vermeld huidige tools; identificeer hiaten en aspiraties]

**Huidige Stack (geverifieerd):**
- [Category]: [Tool 1], [Tool 2]
- [Category]: [Tool]

**Geïdentificeerde Hiaten:**
- [Hiaat 1]: Gebruiken [Old Tool], vacatures tonen interesse in [New Category] → Migration opportunity
- [Hiaat 2]: [Probleem], niet opgelost door huidige stack → Direct pijn

**Integratiewrijving:**
- [Tool A] + [Tool B] opgemerkt als "moeilijk te synchroniseren" in 3 reviews → Integration selling point

### Laag 4: Pijnsignalen (Top 3)
[Rangschik op bewijskracht: vacatures > meerdere reviews > enkele review > inferentie]

**Signaal #1: [Probleemstelling]**
- Bewijs: [2–3 vacatures of review citaten]
- Frequentie: Vermeld in [X] vacatures / [X] reviews
- Urgentie: [High/Medium/Low — afgeleid uit recency en job posting level]
- Je hook: [Hoe je product dit in één zin oplost]

**Signaal #2: [Probleemstelling]**
- Bewijs: [2–3 vacatures of review citaten]
- Frequentie: Vermeld in [X] vacatures / [X] reviews
- Urgentie: [High/Medium/Low]
- Je hook: [Één zin]

**Signaal #3: [Probleemstelling]**
- Bewijs: [Vacature of review citaat]
- Frequentie: Vermeld in [X] vacatures / [X] reviews
- Urgentie: [High/Medium/Low]
- Je hook: [Één zin]

### Beste Personalisatie Hook
[Eén specifieke, geloofwaardige hoek om mee te beginnen. Format: "Gebruik [Signal/Event/Person] als de hook. Voorbeeld opener: '...'" ]

Voorbeeldformaten:
- News hook: "[CEO Name]'s post about [topic] on [date] suggests they're prioritizing X. We help companies like [similar company] solve that by..."
- Pain hook: "I noticed 5 of your recent job postings mention [skill]. That usually means..."
- Tech hook: "You're using [Tool A] but job posts show you're hiring for [new area]. We specialize in..."
- Leadership hook: "[New Hire Name] just joined as [role]. Based on her background in [area], she likely owns..."

### Aanbevolen Eerste Kanaal
[Kies één; leg uit waarom]

- **LinkedIn InMail to [Economic Buyer]?** — If active, <5 contacts in role, high trust signal
- **LinkedIn message to [Champion]?** — If they're visible, less threatening than direct to buyer, easier to warm
- **Email (warm intro)?** — If you have a mutual connection (check LinkedIn "People you know")
- **Email (cold)?** — If pain is acute enough, company is hiring (visible on LinkedIn)
- **LinkedIn outreach to [Influencer]?** — If they're highly active and thought leader (easier to get meeting)

**Waarom:** [Rechtvaardigen op basis van hun activiteitsniveau, org grootte, pijn urgentie]

### Aanbevolen Framework
[Kies één; leg uit waarom]

- **"By the way" framework** — Best if: Pain is obvious, champion is receptive, goal is warm intro
- **MEDDIC / BANT qualification** — Best if: Enterprise deal, complex buying process, multiple decision-makers
- **ROI/efficiency hook** — Best if: Finance buyer is target, pain is cost or manual work, you have benchmarks
- **Event-triggered** — Best if: Recent funding or hire suggests receptivity; use news as proof of change appetite
- **Peer social proof** — Best if: [Competitor or similar company] is customer; drop name contextually

**Waarom:** [Leg fit uit]

### Data Kwaliteit & Vertrouwensscoring
[T1 only]

- **Data freshness:** Laatste research update [datum]
- **Vertrouwen in besluitvormer nauwkeurigheid:** [High/Medium/Low — gebaseerd op bevestiging van 2+ bronnen]
- **Pijnsignaalsterkte:** [High/Medium/Low — gebaseerd op frequentie vermeldingen + recency]
- **Aanbevolen volgende stap:** [Directe acquisitie / Warm intro nodig / Te rommelig, onderzoek meer / Klaar om pitch]
```

---

### Prompt Template

**Prompt om te gebruiken bij het starten van onderzoek:**

```
Act as a B2B account intelligence specialist. I'm researching [COMPANY NAME] to prepare for outreach.

Depth: [Tier 1 / Tier 2 / Tier 3]

Company Info:
- Company: [COMPANY NAME]
- LinkedIn URL: [LINKEDIN_URL]
- Industry: [If known — optional]
- Company Size: [If known — optional]
- Your product: [Brief 1-sentence description of what you sell]

For Tier 1: Use all 5 layers (org structure, recent events, tech stack, pain signals, social footprint). Find 3 named decision-makers with current LinkedIn activity. Extract 3–5 pain signals from job postings and G2 reviews. Provide a complete Account Dossier using the template.

For Tier 2: Focus on layers 1–4. Find 2 key decision-makers. Extract 3–4 pain signals. Provide a 1-page abbreviated dossier.

For Tier 3: Quick snapshot only. CEO name, one recent signal, one pain signal, one tool/gap.

Research checklist:
- [ ] Company LinkedIn page reviewed (leadership, recent activity, headcount)
- [ ] CEO/VP LinkedIn activity checked (last 30 days)
- [ ] 3+ job postings analyzed (if available)
- [ ] G2/Capterra reviews mined (industry/size filter applied)
- [ ] BuiltWith tech stack verified
- [ ] Recent press/news checked (funding, hires, product launches)

Output format: Use the Account Dossier template provided. Be specific — cite sources, dates, and names. No vague claims.
```

---

### Beslissingsbomen & Logica

#### Moet ik dit account onderzoeken?

```
Heb je een bedrijfsnaam + LinkedIn URL?
├─ Ja
│  ├─ Is het een Tier 1 account (high-value, strategic, named deal)?
│  │  └─ Ja → Investeer 20 min in volledig dossier (Tier 1)
│  └─ Is het Tier 2 (mid-market, account list)?
│     └─ Ja → 10-min medium brief (Tier 2)
│  └─ Is het volume prospecting of quick-qualify?
│     └─ Ja → 3-min snapshot (Tier 3)
└─ Nee → Vraag om bedrijfsnaam + LinkedIn URL vóór het starten
```

#### Hoe vind ik de besluitvormers?

```
Begin met company LinkedIn pagina:
├─ Vermeldt het C-suite/VP?
│  ├─ Ja → Noteer namen, controleer hun individuele LinkedIn profielen voor recente activiteit
│  └─ Nee → Bedrijf kan <50 medewerkers zijn; neem aan CEO is economic buyer
├─ Controleer "People" tab op company pagina
│  └─ Filter op titel (VP Finance, VP Sales, CTO, Chief Product Officer)
├─ Cross-check op vacatures
│  └─ "Reporting to [Naam]" in vacature = bevestigt rol + naam
└─ Zoek Google + LinkedIn voor "[Bedrijf] [Rol]"
   └─ Gebruik laatste activiteitsdatum om engagement in te schatten
```

#### Hoe extraheer ik pijnsignalen?

```
Vacatures (hoogste fideliteit):
├─ Lees 3–5 postings voor je functie
├─ Extraheer patronen: "seeking X to fix Y"
├─ Noteer urgentie (hiring at manager/director level = high priority)
├─ Noteer context (hiring for new function = expansion; reqs = problems)

G2 Reviews (validatie):
├─ Filter op bedrijfsgrootte + industrie
├─ Lees 4–6 reviews, zoek naar trefwoorden: "slow," "integration," "lack," "need," "expensive"
├─ Tel frequentie (3+ reviews mention same pain = strong signal)
└─ Prioriteer recente reviews (< 6 maanden oud)

LinkedIn Vacatures:
├─ Zoek "[Bedrijfsnaam] hiring"
├─ Sorteer op meest recent
├─ Extraheer 3–5 open rollen + hun beschrijvingen
└─ Noteer: Stack van titels onthult org prioriteiten (bijv. 5 sales rollen open = growth mode)
```

#### Hoe kies ik de onderzoekstier?

```
Tier 1 Criteria (Volledig Dossier — 20 min):
├─ ACV of deal size >$100k
├─ Named deal or strategic account
├─ C-suite target or enterprise buying process
└─ Can invest time for high-precision research

Tier 2 Criteria (Medium Brief — 10 min):
├─ ACV $20k–$100k
├─ Account on list of 10–50 targets
├─ Sales development (SDR) lead generation
└─ Need signal before first touchpoint

Tier 3 Criteria (Minimum Profile — 3 min):
├─ ACV <$20k or volume prospecting
├─ Account list of 100+
├─ Social selling or rapid qualification
└─ Quick decision: fit or skip
```

---

### Onderzoeksbenchmarks & Tijdtoewijzing

**Tier 1 Breakdown (20 min):**
- Laag 1 (Org Structure): 5 min
- Laag 2 (Recent Events): 3 min
- Laag 3 (Tech Stack): 4 min
- Laag 4 (Pain Signals): 6 min
- Laag 5 (Social): 1 min
- Synthese + Dossier schrijven: 1 min

**Tier 2 Breakdown (10 min):**
- Lagen 1–4: 9 min (skipping depth on Layer 5)
- Dossier schrijven: 1 min

**Tier 3 Breakdown (3 min):**
- Snelle scan van company pagina: 1 min
- Één pijnsignaal: 1 min
- Paragraaf schrijven: 1 min

**Inspanningstips voor reductie:**
- BuiltWith vóór LinkedIn (10 sec to reveal 80% of stack)
- G2 review search: filter op bedrijfsgrootte eerst (spaar 3 min van irrelevante reviews)
- Vacatures: lees alleen de eerste 5 (diminishing returns after 5)
- LinkedIn: controleer alleen laatste 30 dagen activiteit (oudere posts irrelevant voor huidige prioriteiten)

---

### Anti-Patronen om te Vermijden

1. **Onderzoeken zonder hypothese** — Begin niet met Laag 4 (pain) zonder Laag 3 (tech stack); je mist signalen.
2. **Over-onderzoeken Tier 3** — Als je alleen 3 minuten hebt, besteed niet 5 aan het lezen van reviews. Kies één signaal en ga verder.
3. **Verwarren van oprichter/CEO activiteit met bedrijfsactiviteit** — Een CEO die stil is op LinkedIn ≠ bedrijf is dormant. Controleer company pagina + pers onafhankelijk.
4. **G2 reviews voor face value nemen** — Controleer altijd: (a) reviewer titel (IC vs. decision-maker), (b) review datum (60+ dagen oud = minder relevant), (c) bedrijfsgroottematching.
5. **De "waarom" missen in tech stack** — Vermeld niet alleen tools. Vraag: Waarom dit tool? Welk probleem lost het op? Is het een hiaat of sterkte?
6. **Nieuwheid prioriteren boven relevantie** — Een 3-maanden-oude financieringsronde is geen hook als hun pijnsignaal 2 jaar oud en onopgelost is (suggereert verschillende prioriteiten).
7. **Eenbronwaarheden** — Vacature zegt "growth" ≠ automatische high-urgency signaal. Cross-check met recent nieuws of review consensus.

---

## Voorbeeld

### Scenario: Tier 1 Onderzoek op [REAL EXAMPLE COMPANY]

**Brief:** Je bent een account executive voor een data pipeline platform (zoals Fivetran, Airbyte, of dbt Cloud). Je bedrijf specialiseert zich in het automatiseren van data ingestie en transformatie. Je hebt een mid-market e-commerce bedrijf geïdentificeerd, [TechRetail Inc.], als doelwit. Je hebt een volledig Account Dossier nodig vóór je eerste call met hun VP of Data.

**Bedrijf:** TechRetail Inc. (fictief voorbeeld)
**LinkedIn:** linkedin.com/company/techretail-inc
**Je product:** Automated data pipeline orchestration + data quality monitoring
**Tier:** Tier 1 (named deal, enterprise ACV)

---

### Onderzoeksproces (volgende 5 lagen)

#### Laag 1: Organisatiestructuur

**Company LinkedIn pagina review:**
- Headcount: ~450 (uit "About" sectie)
- Leiderschap: CEO [Sarah Chen], CTO [Marcus Williams], VP Finance [David Park], VP Sales [Jessica Liu]

**Zoekresultaten:** "[TechRetail VP Data]" → Gevonden [Alex Rodriguez], VP of Data & Analytics, LinkedIn URL [link], laatste post 1 juni 2026 (actief, 3-4 posts per week)

**Zoekresultaten:** "[TechRetail Director Engineering]" → Gevonden [Jamie Kim], Director of Data Engineering, LinkedIn URL [link], laatste post 28 mei 2026 (actief, replyes op comments)

**Cross-check op LinkedIn "People" tab:**
- [Alex Rodriguez]: VP of Data & Analytics — direct report to VP Sales (Jessica Liu) per profiel
- [Jamie Kim]: Director of Data Engineering — direct report to CTO (Marcus Williams)
- [Sarah Chen]: CEO — occasionally posts about company culture + growth

**Besluitvormerskaart:**
- **Economische Koper:** [David Park], VP Finance (eigenaar van data infrastructure budget, P&L voor tech spend)
- **Champion:** [Alex Rodriguez], VP of Data (dagelijks gebruiker van pipeline tools, heeft KPIs gebonden aan data quality + velocity)
- **Influencer:** [Marcus Williams], CTO (kan blokkeren als architecture past niet in engineering practices; kan versnellen als hij het champioenen)

---

#### Laag 2: Recente Gebeurtenissen

**Company LinkedIn pagina:**
- 15 mei 2026: Geposte aankondiging: "We've raised $25M in Series B funding to fuel our expansion into EU markets and strengthen our data infrastructure." [Link]
- 22 mei 2026: "Excited to announce [Jamie Kim] as our new Director of Data Engineering! Jamie brings 10 years of building data platforms at [Previous Company]."
- 8 mei 2026: Geposte case study: "How we reduced data processing time by 40% through [internal initiative]."

**CEO (Sarah Chen) LinkedIn:**
- 1 juni 2026: Reposted a TechCrunch article on "The Future of Customer Data Platforms" with comment: "This resonates—our roadmap is heavily data-first."
- 25 mei 2026: Posted about attending a data engineering conference, mentioned "impressed by new tools in the orchestration space."

**Pers/Nieuws:**
- Crunchbase: Series B funding, $25M, led by [VC Name], 15 mei 2026
- VentureBeat: "TechRetail Lands $25M to Expand Data-Driven Personalization" (artikel bevestigt focus op customer data + personalization)

**Vertaling:** Bedrijf heeft kapitaal, investeert in data team (nieuwe director hire suggereert urgentie), CEO zoekt actief naar nieuwe data tools, en VP Finance (budget eigenaar) post actief over finance/ops onderwerpen (responsief signaal).

**Recency scoring:**
- Series B funding (mei) = hoogste urgentie (capital to deploy, 90-day spending window)
- New Data Engineering hire (mei) = medium-high (scaling the team, likely will evaluate tooling)
- CEO tool research (juni) = medium (signals openness to new solutions)

---

#### Laag 3: Tech Stack & Hiaten

**BuiltWith check:**
- Analytics: Mixpanel, Segment, Google Analytics
- CRM: Salesforce
- Data Warehouse: Snowflake (confirmed in job posting + press materials)
- BI: Looker (mentioned in [Jamie Kim]'s LinkedIn as "worked with Looker at previous company")
- ETL/Data Pipeline: [Not clearly listed]

**LinkedIn Vacatures (laatste 5):**
1. "Senior Data Engineer" (geposte 20 mei): "Required: SQL, Python, Airflow or similar orchestration tool. Nice to have: dbt experience."
   - Vertaling: Momenteel Airflow gebruiken, geïnteresseerd in dbt; waarschijnlijk orchestration improvements evalueren
2. "Analytics Engineer" (geposte 28 mei): "Build transformations and data models. Experience with SQL, dbt, Snowflake required."
   - Vertaling: Actief huren voor dbt/analytics engineering; earlier-stage capability ze toevoegen
3. "Data Quality Engineer" (geposte 1 juni): "Own data quality and testing. We're building new monitoring processes."
   - Vertaling: Data quality is een *nieuw probleem* dat ze oplossen; infrastructure investment bevestigd
4. "Data Infrastructure Lead" (geposte 10 mei): "Owner of our data platform roadmap. Must have experience scaling Snowflake clusters + reducing costs."
   - Vertaling: Kosten + schaal pijn; infrastructure efficiency is belangrijk

**G2 Reviews (gefilterd op 100–1000 headcount, e-commerce):**
- Review 1 (mei 2026, Sr. Data Analyst): "Snowflake is solid, but our transformation layer is fragmented. We have scripts in Python, dbt models, and Airflow DAGs—hard to track dependencies. Integration between these tools needs improvement."
  - Pijn: Multi-tool orchestration is gefragmenteerd; dependency tracking kapot
- Review 2 (juni 2026, Analytics Manager): "We're hitting scaling issues with Airflow. Deployments take 2+ hours, and debugging failed jobs is painful."
  - Pijn: Airflow scalability + operational overhead
- Review 3 (april 2026, Data Engineering Lead): "Transitioning from custom scripts to Airflow, but the learning curve is steep and we lack good monitoring. Looking for solutions that simplify this."
  - Pijn: Airflow adoption + monitoring
- Review 4 (mei 2026, VP Analytics, ander bedrijf, maar zelfde grootte): "Our data pipeline is a bottleneck. We want to move to a managed solution to reduce ops overhead, but we're locked into Airflow."
  - Inferentie: Tech Retail waarschijnlijk hetzelfde probleem (Airflow lock-in)

**Tech Stack Samenvatting:**

Huidige tools:
- Warehouse: Snowflake
- Orchestration: Airflow (primary), custom Python scripts
- Transformation: dbt (being adopted)
- Analytics: Looker, Mixpanel, Segment
- No evidence of managed data pipeline solution (Fivetran, Airbyte, etc.)

Hiaten geïdentificeerd:
1. **Orchestration scalability:** Airflow deployment times traag (2+ hours per hiring manager review), no monitoring strategy, multi-tool integration fragmented
2. **Data transformation governance:** Multiple transformation layers (dbt + Python scripts) not integrated; dependency tracking missing
3. **Data quality/observability:** New hire (Data Quality Engineer) suggests this is newly prioritized; no established solution yet

Integratiewrijving:
- Airflow + Snowflake + dbt = manual integration work (reviewed in G2 as "fragmented")
- Cost optimization (hiring for "reducing Snowflake costs") suggests they're hitting bill shock from scaling

---

#### Laag 4: Pijnsignalen (Top 3)

**Signaal #1: Airflow Operational Overhead + Scalability Bottleneck**

Bewijs:
- Vacature: "Data Infrastructure Lead" explicitly mentions "reducing operational overhead," "scaling Snowflake clusters," posted 10 mei
- G2 reviews: "Deployments take 2+ hours," "debugging failed jobs is painful" (juni 2026), "steep learning curve + lack of monitoring" (april 2026)
- New hire: Jamie Kim (Director of Data Engineering, ex-[Previous Company], 22 mei) likely brought in to solve ops/scaling issues

Frequentie: 3 vacatures mention orchestration/airflow, 3 G2 reviews mention operational pain
Urgentie: **High** — New director hire (signal company prioritizes this now), Series B capital to invest, recent job postings (hiring to fix)
Je hook (Fivetran/Airbyte angle): "Your job postings show you're scaling Airflow, but the real unlock is reducing ops overhead. A managed pipeline platform lets your team focus on analytics, not infrastructure."

---

**Signaal #2: Multi-Tool Data Stack + Integration Fragmentation**

Bewijs:
- Vacature: "Analytics Engineer" (28 mei) requires dbt; simultaneously, job for "Senior Data Engineer" (20 mei) requires Airflow + "nice to have: dbt"
  - Vertaling: Ze adopteren dbt maar hebben het nog niet volledig geïntegreerd met orchestration
- G2 review: "We have scripts in Python, dbt models, and Airflow DAGs—hard to track dependencies"
- Tech stack: Snowflake + Looker + Mixpanel + Segment + custom Python + Airflow + dbt = 7 tools, loosely connected

Frequentie: Mentioned in 2 vacatures, 1 review, inferred from tech stack
Urgentie: **Medium-High** — They're actively hiring to solve this (Analytics Engineer role), but not yet critical
Je hook (dbt Cloud / orchestration platform): "You're building a modern data stack (Snowflake + dbt), but your orchestration layer isn't built to handle it. A platform that syncs Airflow + dbt + Snowflake reduces your integration debt by 60%."

---

**Signaal #3: Data Quality + Observability (Nieuwe Prioriteit)**

Bewijs:
- Vacature: "Data Quality Engineer" (geposte 1 juni) — *nieuwe rol*, explicitly says "We're building new monitoring processes"
  - Vertaling: Data quality is nu een business priority (likely triggered by Series B, customer-facing data accuracy)
- G2 review: "We lack good monitoring" (april 2026)
- Implicatie: Series B expansion = EU markets + personalization strategy = data accuracy becomes critical

Frequentie: 1 new job posting + 1 review mention
Urgentie: **Medium** — Newly prioritized, but not yet mature (hiring for it now)
Je hook (dbt + data quality tools): "You just hired for data quality. The hardest part isn't monitoring—it's having a system that *prevents* bad data from entering your pipeline. [Your tool] catches issues before they hit Snowflake."

---

#### Laag 5: Sociale Voetafdruk

**CEO (Sarah Chen) LinkedIn activiteit:**
- Activiteitsniveau: 2–3 posts per week (high engagement)
- Content: Company milestones (funding, hires), industry trends (data platforms, personalization), culture
- Engagement: ~100–200 likes per post, comments from industry figures
- Laatste activiteit: 1 juni 2026 (active today)
- Verdict: **Thought leader, highly visible, responsive to industry trends**

**VP Data (Alex Rodriguez) LinkedIn:**
- Activiteitsniveau: 3–4 posts per week (very active)
- Content: Data engineering, career advice, Snowflake/dbt tips, personal takes on data tooling
- Engagement: ~50–150 likes, replies to comments
- Laatste activiteit: 1 juni 2026 (active)
- Connections: ~2,500 (industry network strong)
- Verdict: **Highly engaged in data engineering community, likely receptive to inbound from thought leaders**

**CTO (Marcus Williams) LinkedIn:**
- Activiteitsniveau: 1 post per month (less visible)
- Content: Engineering wins, hiring announcements
- Laatste activiteit: 28 mei 2026
- Verdict: **Less visible, but replies to comments (not dormant)**

---

### Account Dossier Output

```
## TechRetail Inc. — Account Intelligence Dossier

### Bedrijfsoverzicht
TechRetail Inc. is a ~450-person e-commerce platform specializing in customer data and personalization, with customers across retail and CPG sectors. They just closed a $25M Series B (mei 2026) to expand into EU markets and strengthen their data infrastructure—creating an active 90-day capital deployment window.

### Besluitvormerskaart

**Economische Koper:** David Park, VP Finance
- P&L eigenaar: Data infrastructure budget + tech spend
- Laatst actief op LinkedIn: 30 mei 2026 (posts 1–2x per month on finance/ops)
- Signaal: Active enough to see cold outreach; Finance controls data/infrastructure budget

**Champion:** Alex Rodriguez, VP of Data & Analytics
- Uses orchestration + data transformation tools daily; OKRs tied to data pipeline velocity + quality
- Laatst actief op LinkedIn: 1 juni 2026 (posts 3–4x per week, very engaged)
- Signaal: Highly engaged in data engineering community; will likely read inbound from peers or vendors; can influence buying decision upward to Finance

**Influencer:** Marcus Williams, CTO
- Can block/accelerate: Architecture decisions, engineering practices; final say on platform integration
- Laatst actief op LinkedIn: 28 mei 2026 (lower activity, but engaged when active)
- Signaal: Recent data engineering director hire (Jamie Kim) reports to him; his buy-in is required for implementation

---

### Laag 2: Recente Gebeurtenissen (Momentum Signalen)

- **15 mei 2026 (Series B Funding):** $25M Series B funding to expand EU + strengthen data infrastructure
  - Implicatie: Capital allocated for infrastructure investment; 90-day spending window likely active; budget cycle reset
  - Bron: [company-linkedin-post]

- **22 mei 2026 (Director Hire):** Jamie Kim hired as Director of Data Engineering (ex-[Previous Company], 10-year data platform background)
  - Implicatie: Company is accelerating data platform development; ops/scaling issues being directly addressed; new director will evaluate tooling
  - Bron: [alex-rodriguez-linkedin-post]

- **1 juni 2026 (New Data Quality Role):** Data Quality Engineer role posted; job description says "We're building new monitoring processes"
  - Implicatie: Data quality is now a business-critical priority (likely EU expansion + data accuracy for personalization); monitoring stack being built now
  - Bron: [techretail-careers-page]

- **8 mei 2026 (Internal Success):** Posted case study on reducing data processing time by 40%
  - Implicatie: Company is data-first; publicly celebrating efficiency wins; open to process improvements
  - Bron: [company-blog]

- **1 juni 2026 (CEO Tool Research):** Sarah Chen (CEO) reposted TechCrunch article on "Future of Customer Data Platforms" with comment: "This resonates—our roadmap is heavily data-first"
  - Implicatie: CEO is actively researching data platform trends; data infrastructure is strategic priority
  - Bron: [sarah-chen-linkedin]

---

### Laag 3: Tech Stack & Hiaten

**Huidige Stack (verified by BuiltWith + vacatures + LinkedIn):**
- **Data Warehouse:** Snowflake (primary)
- **Orchestration:** Apache Airflow (primary), custom Python scripts
- **Transformation:** dbt (recently adopted; hiring for "Analytics Engineer" role)
- **Analytics/BI:** Looker
- **Customer Data:** Segment, Mixpanel
- **CRM:** Salesforce

**Geïdentificeerde Hiaten:**

1. **Orchestration scalability + operations:** Using open-source Airflow with heavy operational overhead. Job posting for "Data Infrastructure Lead" explicitly mentions "reducing operational overhead" and "scaling Snowflake clusters." G2 reviews from similar companies note "2+ hour deployments" and "monitoring gaps." No managed orchestration solution in place (no Fivetran, Airbyte, Prefect, Dagster, or dbt Cloud observed).
   - Gap implicatie: They're building it in-house today; Series B capital makes them a buyer now

2. **dbt integration + governance:** Recently hired for "Analytics Engineer" role, but dbt is not yet integrated with Airflow at scale. G2 review notes "fragments of Python scripts + dbt models + Airflow DAGs—hard to track dependencies."
   - Gap implicatie: Multi-tool data stack requires integration layer; dependency tracking broken

3. **Data quality observability:** New "Data Quality Engineer" role; job posting explicitly says "building new monitoring processes." G2 review notes "lack of good monitoring."
   - Gap implicatie: Data quality is newly prioritized; monitoring stack being built; buyer for observability tools now

**Integratiewrijving:**
- Snowflake + Airflow: Manual integration, monitoring via Airflow logs (limited)
- Airflow + dbt: No native integration; requires custom orchestration
- dbt + Snowflake: Works, but scaling requires governance (model tracking, lineage)

---

### Laag 4: Pijnsignalen (Top 3)

**Pijnsignaal #1: Airflow Operational Overhead + Scalability**

Bewijs:
- Vacature (20 mei): "Senior Data Engineer required: Airflow or similar orchestration. Nice to have: dbt experience" → signals current Airflow use, interest in alternatives
- Vacature (10 mei): "Data Infrastructure Lead — Owner of data platform roadmap. Must have experience scaling Snowflake clusters + reducing costs" → explicit cost + scaling pain
- G2 reviews (gefilterd op bedrijfsgrootte + e-commerce):
  - Mei 2026: "Deployments take 2+ hours, debugging failed jobs is painful"
  - April 2026: "Steep learning curve, lack of monitoring"
- New hire context: Jamie Kim (Director of Data Engineering, hired 22 mei) background in "scaling data platforms" at previous company → signals this pain was a hiring requirement

Frequentie: Mentioned across 3 vacatures + 2 G2 reviews = high consensus
Urgentie: **High** — Newly hired director to fix; Series B capital allocated; recent job posts
Je hook: "Your Series B math doesn't work if 2 hours of each deployment day is spent on Airflow ops. Your new Director of Data Engineering (Jamie Kim, based on her background) will likely evaluate orchestration solutions that cut operational overhead by 50%+ within Q3. A managed platform lets your team focus on data strategy, not infra."

---

**Pijnsignaal #2: Multi-Tool Data Stack Fragmentation + Dependency Tracking**

Bewijs:
- Vacature (28 mei): "Analytics Engineer — Transform data using SQL, dbt, Snowflake" → signals dbt adoption but not yet mature
- Vacature (20 mei): "Senior Data Engineer — Airflow or similar + nice to have dbt" → signals co-existence of two transformation approaches
- G2 review (mei 2026): "We have Python scripts, dbt models, and Airflow DAGs—hard to track dependencies. Integration between tools needs improvement"
- Vacature (1 juni, Data Quality Engineer): "Own data quality and testing" → signals they want to centralize quality, but current stack is fragmented

Frequentie: Multiple job postings + 1 detailed review = clear pattern
Urgentie: **Medium-High** — They're actively hiring to solve (Analytics Engineer role), but not yet critical path
Je hook: "You're building a modern stack (dbt + Snowflake), but your orchestration layer wasn't built for it. You have transformation logic scattered across Python scripts, dbt, and Airflow. Consolidating onto a platform that syncs all three cuts your dependency tracking burden by 70% and makes your data governance scalable."

---

**Pijnsignaal #3: Data Quality + Observability (Nieuwe Business-Critical Prioriteit)**

Bewijs:
- Vacature (1 juni): "Data Quality Engineer — We're building new monitoring processes" (new role, recent post)
- G2 review (april 2026): "We lack good monitoring. Transitioning to Airflow, but monitoring strategy not established"
- Context: Series B expansion into EU + personalization focus = data accuracy directly impacts customer experience + revenue
- CEO signaal (1 juni): "Our roadmap is heavily data-first" → investment in data quality is strategic

Frequentie: 1 recent job posting + 1 review + strategic context = emerging priority
Urgentie: **Medium** — Newly prioritized (hiring today), but not yet mature; however, will become critical within 60 days
Je hook: "You just added a Data Quality Engineer role. That means data accuracy is now on the executive agenda (probably triggered by your EU expansion + personalization roadmap). The hardest part of data quality isn't monitoring—it's preventing bad data from entering your pipeline in the first place. Most platforms add monitoring after the fact. [Your tool] prevents issues upstream."

---

### Beste Personalisatie Hook

**Gebruik de Series B capital + new director hire als de entry vector. Lead with Jamie Kim's background as social proof.**

**Aanbevolen opener:**
"Alex, I noticed TechRetail just brought Jamie Kim on as Director of Data Engineering (congratulations to the team). Her background at [Previous Company] was building data platforms that scaled from Airflow to 10B+ events/day. I'm guessing that was part of why she's here—to tackle the same scaling challenges you're hitting post-Series B. We help engineering teams like yours cut Airflow operational overhead by 50%+ while keeping your dbt + Snowflake investments intact. I'd love to share how [similar company of his size] solved this in Q2. Do you have 20 minutes next week?"

**Alternatieve hooks (in prioriteitsvolgorde):**
1. **News hook:** "Series B expansion into EU requires data accuracy at scale. Your new Data Quality Engineer role confirms that's on your agenda. Here's how [company] handles data quality checks upstream..."
2. **Tech hook:** "Your job postings show you're hiring for dbt + Airflow. The tricky part—and the reason most teams hit scaling walls—is integrating the two without hiring a platform team. [Your tool] solves that..."
3. **Cost hook:** "Your 'Data Infrastructure Lead' role mentions reducing Snowflake costs. Most teams hit a wall: Airflow deployments get slower, dbt queries run longer, costs climb. [Your tool] is built to run both efficiently..."

---

### Aanbevolen Eerste Kanaal

**LinkedIn InMail to Alex Rodriguez, VP of Data**

**Waarom:** 
- He's highly active (3–4 posts per week, last activity today), so likely to open + read InMail
- As VP of Data, he owns the day-to-day pain (orchestration ops, transformation governance)
- He's *not* the economic buyer (David Park, VP Finance is), but he's the Champion who can get a meeting scheduled and influence upward
- Direct to Economic Buyer (David Park) skips the champion; less warm, requires CEO-level social proof
- Email (cold) is possible, but his LinkedIn engagement suggests InMail will outperform

**Waarom niet alternatieven:**
- Email (warm intro): Faster if you have a mutual connection, but no evidence of one; LinkedIn InMail is warmer
- LinkedIn message: InMail is higher-intent from vendor perspective; shows you respect their time
- Influencer outreach (Marcus Williams, CTO): He's less active; Alex is the more receptive audience

---

### Aanbevolen Framework

**"Event-triggered" framework with peer social proof**

**Waarom dit framework:**
1. **Event trigger:** Series B + new director hire = proof of change appetite and budget allocation
2. **Peer social proof:** You have a customer of similar size/stage in e-commerce or data infrastructure who solved this post-Series B; that company becomes your reference
3. **Credibility:** New director (Jamie Kim) will want to evaluate solutions quickly; having case studies from her peer network accelerates deal cycle

**Execution:**
- **First touch (InMail to Alex):** News hook (Series B) + new director hire as proof they care about this problem + reference customer case study (if you have one in e-commerce/data infrastructure at similar scale)
  - Message length: 40 words max + one link to case study
  - Goal: Get 20-minute discovery call
- **Discovery call with Alex + Jamie Kim:** MEDDIC framework (understand budget, stakeholders, timeline tied to Series B capital window)
  - Key: Jamie Kim will likely own evaluation; align on technical proof (demo dbt + Snowflake scenario)
- **Close:** ROI framework (reduce ops overhead + Snowflake costs)
  - Benchmark: "Most customers see 50%+ ops overhead reduction in first 90 days + 20–30% Snowflake cost savings"

---

### Data Kwaliteit & Vertrouwensscoring

- **Data freshness:** Research completed 2 juni 2026 (current as of today)
- **Vertrouwen in besluitvormerskaart:** **High**
  - Alex Rodriguez confirmed via LinkedIn as VP of Data (multiple sources: company page, personal LinkedIn, job posting context)
  - David Park confirmed via LinkedIn as VP Finance (company page + financial posting patterns)
  - Marcus Williams confirmed as CTO (company page, Jamie Kim reports to him)
  - All three confirmed active within last 3 days
- **Vertrouwen in pijnsignaalsterkte:** **High**
  - Airflow pain: 3 job postings + 2 recent G2 reviews + recent director hire = very high confidence
  - dbt integration pain: 2 job postings + 1 review + hiring signal = high confidence
  - Data quality pain: 1 recent job posting + 1 review + strategic context (EU expansion) = medium-high confidence
- **Aanbevolen volgende stap:** **Ready for warm outreach**
  - Series B timing + recent hires + active decision-makers = high-intent window (30–60 days before capital is deployed elsewhere)
  - Priority: InMail to Alex Rodriguez within 48 hours
  - Secondary: Get warm intro to Jamie Kim via mutual connection if available (de-risks the technical conversation)
```

---

## Aantekeningen voor Beoefenaars

1. **Tier 1 onderzoek op enterprise schaal:** Als bedrijf >2,000 medewerkers, moet je misschien een "Sponsor" laag toevoegen (Director-level introducer naar Economic Buyer). Op die schaal, cold reaching the CFO directly is minder effectief dan via een trusted sponsor.

2. **Pas het dossier template aan je product aan:** Het template hierboven is generiek. Voor je use case (whatever product you sell), vervang de "Your hook" bullets met je specifieke value prop. Voorbeelden:
   - Als je data platform verkoopt (Fivetran): Benadruk "managed orchestration + cost reduction"
   - Als je dbt Cloud verkoopt: Benadruk "dbt governance + dependency tracking"
   - Als je data quality tools verkoopt (dbt tests + Great Expectations): Benadruk "preventing bad data upstream"

3. **Wanneer te herhalen-onderzoeken:** Update dit dossier als (a) bedrijf nieuwe financiering opheft, (b) sleutelbesluiter verlaat/joins, (c) nieuwe productlancering of pivot, (d) groot nieuws (acquisitie, public filing). Anders is dossier geldig voor 60 dagen.

4. **Single-company vs. account list:** Gebruik Tier 1 voor named deals; gebruik Tier 2/3 voor account lists. Als je door een lijst van 100 accounts gaat, run alle 100 op Tier 3 eerst (identificeert low-hanging fruit), dan tier up de top 10–15 naar Tier 1 voor dieper onderzoek.

5. **Onderzoeken als kwalificatie:** Pijnsignalen moeten kwalificatielogica informeren. Als je <3 pijnsignalen ziet na Laag 4 mining, het bedrijf kan poor fit zijn (hitting not the problems your product solves). Overweeg deprioritizing totdat signalen duidelijker worden.
