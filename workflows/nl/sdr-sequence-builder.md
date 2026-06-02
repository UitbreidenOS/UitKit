# SDR Sequence Builder

## Wanneer uitvoeren

Deze workflow activeert wanneer u een nieuwe outbound-reeks lanceert die gericht is op een specifiek account-segment. Triggers zijn onder meer:
- Kwartaalcyclus vereist een nieuwe segmentfocus
- Productlancering vereist outbound-activiteit voor nieuwe buyer personas
- Verticale expansiestrategie heeft segment-specifieke reeksen nodig
- Win-loss-analyse identificeert een herhalbaar signaal dat u wilt aanspreken

## Vereiste invoer

Verzamel voordat u begint:
1. **ICP-definitie** — bedrijfsgrootte, industrie, inkomstengrootte, technologiestapel
2. **Signaaltype** — op trigger gebaseerd (financiering, baanwisseling, tech-adoptie) of statische outbound (expansie binnen bestaand segment)
3. **Account-tier** — welke tier(s) u aanvalt (Tier 1 = $10M+, Tier 2 = $1-10M, Tier 3 = <$1M, of uw eigen schaal)
4. **Senioriteitsdoel** — VP-niveau, C-suite, Director, Manager
5. **Accountlijst of gegevensbron** — CSV, Salesforce-queryresultaat of Apollo/Hunter-export (N accounts, doorgaans 50-500)
6. **Messaging framework keuzes** — selecteer uit: Short Trigger, Do the Math, Founder's Story, Compliance + ROI, Community Proof, Feature Parity, DM Social, of aangepast

## Stappen

### Stap 1 — Doelsegment definiëren (15 min)

**Claude-actie:**
Vraag Claude om uw segmentdefinitie te verfijnen. Geef op:
- ICP-definitie (of een ruwe schets)
- Signaaltype (trigger of statisch)
- Account-tier(s)
- Senioriteitsdoel

**Claude-prompt:**
"Help me het segment voor deze reeks te definiëren. ICP: [X]. Signaal: [Y]. Account-tier: [Z]. Seniority: [W]. Welke demografische en technografische filters moet ik gebruiken om deze lijst te verfijnen? Moet ik bepaalde bedrijfstypen, regio's of industrieën uitsluiten?"

**Claude-output:**
- Verfijnd segmentcriteria (5-10 specifieke filters)
- Argumentatie voor elk filter
- Geschatte adresseerbare marktgrootte
- Waarschuw voor eventuele gegevenskwaliteitsproblemen

**Beslissingsmoment:**
Voelt het segment bruikbaar aan (500-2000 accounts) of is het te beperkt (<100) of te breed (>5000)?

---

### Stap 2 — Accountlijst samenstellen en scoren (30 min)

**Uw actie:**
Exporteer uw accountlijst uit uw gegevensbron. Zorg dat deze het volgende bevat:
- Bedrijfsnaam, domein, bedrijfsgrootte, financiering, technologiestapel (indien beschikbaar)
- Contactnamen, titels, e-mailadressen voor 2-4 besluitvormers per account
- Eventuele recente signalen (baanwisseling, financieringsevenement, tech-adoptie) met datums

**Claude-actie:**
Score en tier de accounts. Geef Claude de lijst.

**Claude-prompt:**
"Score deze [N] accounts tegen de ICP. Tier ze 1/2/3 op basis van fit. Markeer welke signalen in de afgelopen 14 dagen hebben gehad. Voor de 20 accounts met de hoogste score in Tier 1, vermeld het signaal (de signalen) en de data. Output als CSV: Account | Tier | Score | Signal | Signal Date."

**Claude-output:**
- Gescoorde accountlijst (gerangschikt op tier en fit-score)
- 20 warme accounts (Tier 1 + recent signaal)
- 20 koude accounts (Tier 1, geen signaal, maar sterke ICP-fit)
- Rode vlaggen (bedrijven om te deprioriteren of te vermijden)

**Beslissingsmoment:**
Hebt u minstens 15 Tier 1-accounts om aan te vallen? Zo niet, verbreid dan het segment of verlaag de tier-drempel.

---

### Stap 3 — Messaging Framework selecteren (10 min)

**Claude-actie:**
Aanbeveel het beste messaging framework voor uw segment.

**Claude-prompt:**
"Gegeven dit segment: Tier 1-accounts, [seniority target], [signal type], in [industry/use case], welk van deze 8 frameworks past het best en waarom? Frameworks: (1) Short Trigger, (2) Do the Math, (3) Founder's Story, (4) Compliance + ROI, (5) Community Proof, (6) Feature Parity, (7) DM Social, (8) Custom. Rechtvaardigen uw keuze met 2-3 redenen."

**Claude-output:**
- Aanbevolen framework met rechtvaarding
- Belangrijke hooks en pijnpunten om te benadrukken
- 3 voorbeeld-openingslijnen uniek voor dit framework
- Alternatief framework als de primaire niet aanslaat

**Beslissingsmoment:**
Sluit het framework aan bij uw verkoopsplaybook en de messaging van uw team? Zo niet, stel een ander framework voor.

---

### Stap 4 — De reeks schrijven (45 min)

**Claude-actie:**
Genereer de 4-email-reeks voor 3-5 voorbeeld-accounts.

**Claude-prompt:**
"Schrijf de 4-email-reeks voor deze 3 voorbeeld-accounts met behulp van het [Framework] framework. Details: Doeltitel [X], company tier [Y], signaal: [Z]. E-mail 1: hook + specifieke signaalreferentie, onder 100 woorden. E-mail 2: pijnpunt + relevant KPI, 120-150 woorden. E-mail 3: delegatie/social proof + soft ask, 100-140 woorden. E-mail 4: break-up + value reminder, 80-100 woorden. Voeg onderwerpen toe. Voor elke e-mail toon je 2 variaties (Versie A en B) zodat ik kan A/B-testen."

**Claude-output:**
Voor elk van 3 accounts:
- E-mail 1 (2 versies): Hook + Signal
- E-mail 2 (2 versies): Pain + KPI
- E-mail 3 (2 versies): Delegation + Ask
- E-mail 4 (2 versies): Break-up
- Aanbevolen verzendfrequentie (dagen tussen elke e-mail)

**Beslissingsmoment:**
Voelen alle 4 e-mails gepersonaliseerd en geloofwaardig voor uw team? Vermijden ze product pitch in e-mail 1?

---

### Stap 5 — QA-controle (15 min)

**Claude-actie:**
QA-beoordeling op basis van de 5-punts-kwaliteitschecklist.

**Claude-prompt:**
"QA deze 12 e-mails op basis van de messaging-regels. Voor elke e-mail controleren: (1) Onder woordlimiet (E-mail 1: <100w, E-mail 2: <150w, E-mail 3: <140w, E-mail 4: <100w)? (2) Specifieke personalisatie (noemt signaal, bedrijf of use case, niet generiek)? (3) E-mail 1 heeft geen product pitch? (4) Duidelijke CTA (specifieke ask, niet 'laten we chatten')? (5) Geen spamwoorden? Schend vlaggen. Stel 1 fix per probleem voor."

**Claude-output:**
- QA pass/fail voor elke e-mail
- Gemarkeerde schendingen met specifieke fixes
- Herziene e-mails (indien nodig)
- Goedkeuring om door te gaan naar CRM-belasting

**Beslissingsmoment:**
Zijn alle 4 e-mails goedgekeurd? Zo niet, herzien en controleer opnieuw.

---

### Stap 6 — CRM-belasting en reeksconfiguratie (20 min)

**Uw actie:**
1. Tag alle contacten in uw doellijst met: `[Sequence Name] - Active` en tags voor account-tier
2. Log in op uw outreach-tool (Salesforce/Outreach/Instantly/etc.)
3. Maak de reeks aan met gestaffelde startdata
4. Configureer verzendfrequentie:
   - E-mail 1: Dag 0 (onmiddellijk, 9 uur ontvanger-tijdzone)
   - E-mail 2: Dag 2 (48 uur later, 10 uur)
   - E-mail 3: Dag 5 (3 dagen na e-mail 2, 14 uur)
   - E-mail 4: Dag 9 (4 dagen na e-mail 3, 11 uur)
5. Blast nooit alle contacten op dezelfde dag — staffel over 5 dagen
6. Stuur reply-tracking en auto-stop op positieve reply in

**Claude-actie:**
Hulp bij reekslogica indien nodig.

**Claude-prompt:**
"Help me deze reeks in [tool name] in te stellen. Ik wil 250 accounts over 5 dagen staffelen, 50 per dag. Moet ik randomiseren binnen elke dag of een vaste tijd gebruiken? Wat is de beste auto-stop-logica: reply ontvangen, kalendervergadering geboekt of beide?"

**Claude-output:**
- Configuratiechecklist
- Aanbevolen staffel-strategie
- Auto-stop-omstandigheden

**Beslissingsmoment:**
Wordt de reeks live uitgezonden en stromen contacten door? Controleer of 2-3 contacten e-mail 1 hebben ontvangen voordat u doorgaat.

---

### Stap 7 — Performance Review Gate (na 7 dagen)

**Claude-actie:**
Analyseer 7-daagse metriek en beveel optimalisaties aan.

**Claude-prompt:**
"Hier zijn de metriek voor deze reeks na 7 dagen: Open Rate [X]%, Reply Rate [Y]%, Click Rate [Z]%, Unsubscribe Rate [W]%. Vergelijking: Bedrijfsgemiddelde is [A]% open, [B]% reply. Signaalcijfer (Tier 1 vs Tier 2): [breakdown]. Framework-prestaties: [framework] vs [alternative]. Wat zouden we moeten veranderen en waarom? Prioriteer de top 3 aanpassingen."

**Claude-output:**
- Benchmarkvergelijking (versus uw basislijn)
- Analyse van basisoorzaken (bericht, lijstkwaliteit, timing of targeting)
- Top 3 optimalisatieaanbevelingen:
  1. E-mail copy tweaks (specifieke regel of hook)
  2. Timing of cadence aanpassing
  3. Targeting of list refinement
- Beslissing: Doorgaan as-is, pauzeren + herzien, of uitbreiden naar nieuw segment?

**Beslissingsmoment:**
Rechtvaardigt de prestatie schaling naar meer accounts? Als de metriek zwak is, implementeer Claude's aanbevolen aanpassingen en test opnieuw in een nieuw micro-segment voordat u uitbreid.

---

## Output

Een productie-klare outbound-reeks bestaande uit:
1. **Segmentdefiniëringsdocument** — ICP-filters, tier-verdeling, adresseerbare markt
2. **Gescoorde accountlijst** — 250-500 accounts gerangschikt op fit en signaalrecency
3. **4-email reeks (8 variaties)** — 2 A/B versies per e-mail, 4 verzendfrequenties, messaging framework duidelijk vermeld
4. **QA-rapport** — Alle e-mails passeren kwaliteitschecklist, geen spamvlaggen, personalisatie bevestigd
5. **Reeksconfiguratie** — Live in CRM/outreach-tool, gestaffelde over 5 dagen, auto-stop-regels geconfigureerd
6. **7-daagse prestatiesnapshot** — Metrieken, benchmarks en top 3 optimalisatieaanbevelingen

---

## Voorbeeld

**Scenario:** U bent Account Executive bij een B2B SaaS-bedrijf dat data-infrastructuur verkoopt. U wilt mid-market bedrijven (Tier 1: $10-50M) in FinTech aanvallen die onlangs een concurrerend data-tool hebben aangenomen.

### Stap 1 — Segment definiëren
- **ICP:** FinTech, $10-50M ARR, opgericht 2015+, technical co-founder nog steeds in het bedrijf
- **Signaal:** Databricks of Snowflake in de afgelopen 30 dagen geïnstalleerd (op trigger gebaseerd)
- **Seniority:** VP Engineering, VP Data
- **Claude-output:** "Filter toevoegen: moet 50+ engineering-personeelsleden hebben. Sluit pure-play traders uit (zij zijn niet eigenaar van infrastructuur). Target 8 sleutelmetro's: NYC, SF, LA, Boston, Austin, Chicago, Londen, Singapore."

### Stap 2 — Samenstellen en scoren
- **Invoer:** 300 FinTech-bedrijven uit G2/Crunchbase + Salesforce-installatiedata
- **Claude-output:** 
  - 45 Tier 1-accounts (sterke ICP, $20-50M, >50 engineers)
  - 15 van die 45 met Snowflake/Databricks signaal in afgelopen 14 dagen (warm)
  - 30 zonder signaal maar sterke ICP-fit (koud)

### Stap 3 — Framework selecteren
- **Segment:** Tier 1, VP Engineering, trigger-gebaseerd (recente Databricks-installatie)
- **Claude-aanbeveling:** "**Do the Math** — best fit. Deze VP's evalueren infrastructuurkosten. Hook op de ROI-kloof tussen Databricks + uw tool versus legacy-stacks. Begin met de trigger (we zien dat u Databricks hebt geïnstalleerd) + onmiddellijke waarde (30% lagere computekosten)."

### Stap 4 — Reeks schrijven
**Voorbeeld-account:** Prism Analytics, NYC, VP Eng met naam Sarah Chen, Databricks 8 dagen geleden geïnstalleerd.

**E-mail 1 (Hook + Signal):**
> Subject: One thing the Databricks install at Prism is missing
> 
> Sarah,
> 
> Noticed your team deployed Databricks last week. Smart move—queries are 10x faster out of the box.
> 
> Here's what we usually see next: infrastructure costs balloon when query volume scales. Curious if that's on your roadmap to solve?
> 
> Worth a 10-min call?
> 
> [Name]

**E-mail 2 (Pain + KPI):**
> Subject: Re: One thing the Databricks install...
> 
> Sarah,
> 
> Data teams running Databricks typically hit a cost wall at ~3M daily queries. At that scale, compute bills often double quarter-over-quarter.
> 
> Most teams we talk to weren't prepared for that. Few have a cost governance strategy built in from day one.
> 
> This is something we've solved for teams like Ramp and Stripe—both cut their Databricks costs 35% in Q1 without losing query speed.
> 
> If cost optimization is on your roadmap, happy to walk through what that looked like for them.
> 
> [Name]

**E-mail 3 (Delegation + Ask):**
> Subject: Spotted your VP Data on LinkedIn—figured they'd care about this
> 
> Sarah,
> 
> Just published a 1-pager on "Databricks Cost Patterns at Scale" based on 200+ deployments. Your VP Data might find it useful for planning.
> 
> I'll send it over if it's helpful.
> 
> [Name]

**E-mail 4 (Break-up):**
> Subject: Last note—Prism's Databricks opportunity
> 
> Sarah,
> 
> I'll step back, but one last resource: our ROI calculator shows companies similar to Prism save ~$2.1M annually with smart cost controls.
> 
> If that changes your thinking, I'm here.
> 
> [Name]

### Stap 5 — QA-controle
- **E-mail 1:** ✓ 47 woorden, ✓ specifiek signaal (Databricks vorige week ingezet), ✓ geen product pitch, ✓ duidelijke CTA (10 min gesprek), ✓ geen spamwoorden. **PASS**
- **E-mail 2:** ✓ 91 woorden, ✓ specifieke KPI (3M queries, 35% besparingswinst), ✓ social proof (Ramp, Stripe), ✓ duidelijke ask, ✓ geen spam. **PASS**
- **E-mail 3:** ✓ 43 woorden, ✓ gepersonaliseerde delegatie, ✓ duidelijke CTA, ✓ geen spam. **PASS**
- **E-mail 4:** ✓ 44 woorden, ✓ calculator referentie is waarde-add geen pitch, ✓ schone break-up, ✓ deur open. **PASS**

### Stap 6 — CRM-belasting
- 45 Tier 1 FinTech-accounts getagd: `Databricks-Sequence-2024Q2`, `Tier1`, `VP-Eng`
- Reeks aangemaakt in Outreach
- Cadence: E-mail 1 (Dag 0, 9 uur PT), E-mail 2 (Dag 2, 10 uur PT), E-mail 3 (Dag 5, 14 uur PT), E-mail 4 (Dag 9, 11 uur PT)
- 45 contacten gestaffeled over 5 dagen: 9 per dag, gerandomiseerd binnen elke dag
- Auto-stop: Reply ontvangen of kalendervergadering geboekt

### Stap 7 — Prestatie (7-daagse snapshot)
- **Metrieken:** 34% open rate, 8,2% reply rate, 1,1% unsubscribe
- **Benchmark:** Bedrijfsgemiddelde 28% open, 6% reply
- **Tier 1 vs Tier 2:** Tier 1-accounts: 41% open, 12% reply (signaal = kwaliteit)
- **Claude-aanbeveling:** "U slaat benchmarks. 12% reply op warme Tier 1 is uitstekend. Breid dit uit naar de 30 koude Tier 1-accounts (geen recent signaal) en A/B test de hook—probeer 'We helped [competitor] cut Databricks costs' versus huidige 'one thing missing' versie op volgende 50 accounts."
- **Beslissing:** Schaal naar koude Tier 1-cohort en test hook-variatie.

---

**Gemaakt:** 2026-06-02
**Laatst bijgewerkt:** 2026-06-02
