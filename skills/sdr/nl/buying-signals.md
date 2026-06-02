# Koopsignalen

## Wanneer activeren

Wanneer je B2B SaaS prospect bent, besluit je of en wanneer je contact opneemt met een doelaccount. Activeer deze skill wanneer je beschikt over:
- Een account die wordt geïdentificeerd als geschikt (bedrijfsgrootte, industrie, tech stack match)
- Toegang tot tools voor signaaldetectie (LinkedIn, Crunchbase, job boards, BuiltWith, G2, news APIs)
- De intentie om het antwoordpercentage bij eerste contact en conversieprobabiliteit te maximaliseren
- Een cadence voor monitoring van meerdere signalen (dagelijkse of wekelijkse controles op warme accounts)

Deze skill is operationeel voor SaaS, PaaS, B2B fintech en enterprise software. Werkt het best bij accounts met 50+ werknemers (genoeg signalen om te detecteren, genoeg budget om te sluiten).

## Wanneer NIET gebruiken

- Pas niet toe op B2C of eenpersoonsbedrijven — signalen zijn te schaars en aankoopcommissies bestaan niet
- Gebruik niet als je geen detectietools hebt om signalen betrouwbaar te verifiëren (LinkedIn Premium, BuiltWith, job board toegang)
- Pas niet toe op inside sales outreach waar je al een warme introductie of direct contact hebt — gebruik eerst relatie-gericht, signaal-tweede
- Behandel dit niet als deterministisch — signalen zijn probabilistisch, niet zeker; valideer altijd met onderzoek
- Negeer signaalverval niet; een financieringsronde van 8 maanden geleden heeft nul voorspellende waarde
- Activeer niet op enkelvoudige signalen tenzij signaalrang 1 of 2 is; wacht op stapeling (2+ signalen) voor cold outreach op rangen 3–6

## Instructies

### De 6 Koopsignalen Gerangschikt op Aankoopcorrelatie

**Signaal 1: Voormalige Klant Sluit aan bij Nieuw Bedrijf**
- **Rang:** 1 (hoogste correlatie, ~35% antwoordpercentage vs. 3,4% baseline)
- **Waarom het belangrijk is:** Ze hebben bewezen productkennis, begrijpen ROI, en hebben vaak budgetbevoegdheid bij hun nieuw bedrijf
- **Detectiemethode:**
  - LinkedIn "People Also Viewed" op je klantcontacten
  - LinkedIn Sales Navigator: job change alerts op voormalige buyerprofielen
  - Company exit tracking via Crunchbase (wanneer werknemers massaal vertrekken)
  - Handmatige controle: scan maandelijks klanten LinkedIn-profielen op "nieuw bedrijf" activiteit
- **Vervaldatum:** Maximaal 90 dagen. Na 90 dagen verdwijnen hun initiële autoriteit en mandaat; herprioriseer op basis van rolverandering
- **Ideaal timing eerste contact:** Binnen 14 dagen na hun job change (voordat ze al alternatieven hebben gekocht)
- **Verificatie:** Bevestig dat ze aankoopinvloed hadden bij vorig bedrijf (functietitel, Salesforce rol, budget owner vlag)
- **Trigger message formule:**
  ```
  [Noem het signaal expliciet] "Ik zag dat je zojuist bent toegetreden tot [Bedrijf] als [Rol]"
  [Waarom het belangrijk is] "Wanneer mensen naar een nieuwe organisatie gaan, is het eerste wat ze aanpakken [gemeenschappelijk afdelingsprobleem]"
  [Één open vraag] "Ben je op zoek naar [toolcategorie] om [specifieke pijn] daar op te lossen, of is dat nog geen prioriteit?"
  ```
- **Antwoordpercentage stijging:** +35% vs. 3,4% baseline
- **Voorbeeld trigger:** "Ik zag dat je zojuist bent toegetreden tot Acme als VP of Operations. Wanneer ops-leiders van bedrijf wisselen, willen ze meestal hun analytics stack opschonen. Denk je erover [hudig tool] te vervangen of staat dat op de roadmap?"

---

**Signaal 2: Nieuw C-Suite of VP Leiderschap Aangenomen Binnen Laatste 90 Dagen**
- **Rang:** 2 (tweede-hoogste correlatie, ~28% antwoordpercentage)
- **Waarom het belangrijk is:** Nieuwe executives moeten zich snel bewijzen (100-daags mandaat); ze staan open voor leveranciersgesprekken en hebben budget voor snelle wins
- **Detectiemethode:**
  - LinkedIn bedrijfspagina: controleer "Recent hires" sectie op C-level of VP-level rollen
  - Crunchbase: volg leiderswisselingen via "People" tab
  - Bedrijfspersbericht (news API of handmatige controle)
  - Job board API: filter op C-level/VP postingen op doelaccounts
  - LinkedIn Sales Navigator: stel alert in op "[Bedrijf] heeft nieuwe [C-suite/VP] ingehuurd"
- **Vervaldatum:** 90 dagen. Na dag 90 verzwakt de mandaatdruk; ze bevinden zich in steady state
- **Ideaal timing eerste contact:** Binnen 30 dagen na aanstellingsaankondiging (dag 1–30 = hoogste urgentie)
- **Verificatie:** Bevestig rol en rapportlijn (moet direct P&L eigenaar of functionele VP zijn, geen staffunctie)
- **Trigger message formule:**
  ```
  [Noem het signaal expliciet] "Gefeliciteerd met [Nieuwe VP/CRO] die zich aansluit bij [Bedrijf]"
  [Waarom het belangrijk is] "[Rol] leiders besteden hun eerste 90 dagen doorgaans aan [gemeenschappelijk initiatief]; dat vereist meestal [oplossingscategorie]"
  [Één open vraag] "Bouwt [Bedrijf] [relevante mogelijkheid] dit kwartaal uit, of staat dat verder op de roadmap?"
  ```
- **Antwoordpercentage stijging:** +28% vs. baseline
- **Voorbeeld trigger:** "Gefeliciteerd met het binnenhalen van een nieuwe VP of Sales. De meeste VP's of Sales gaan snel aan de slag in hun eerste 90 dagen—meestal het herstructureren van compensatie en sales tooling. Staat dat op je programma, of is je playbook al vastgesteld?"

---

**Signaal 3: Hoog-Intent Websiteactiviteit (Pricing Page, Demo Page, 3+ Bezoeken in 7 Dagen)**
- **Rang:** 3 (actieve evaluatie gaande, ~18% antwoordpercentage)
- **Waarom het belangrijk is:** Ze evalueren actief oplossingen; je bevindt je nu in hun evaluatievenster
- **Detectiemethode:**
  - Website analytics: HubSpot, Segment, of custom UTM tracking
  - Intent data platform: 6sense, ZoomInfo, Demandbase (meest betrouwbaar voor B2B SaaS)
  - Drift/Intercom on-site tracking: markeer accounts die pricing of demo page bezoeken
  - LinkedIn comment activiteit op je product posts (sterk intent signaal)
  - G2 review reads (als je pixel-based tracking hebt; de meesten niet)
- **Vervaldatum:** Maximaal 7 dagen. Na 7 dagen zonder vervolgactiviteit, neem aan dat ze in een ander leverancierspijplijntje zitten
- **Ideaal timing eerste contact:** Binnen 24 uur na derde bezoek of demo page view (same-day outreach verdubbelt antwoordpercentage)
- **Verificatie:** Bevestig accountgrootte en rol van bezoeker (indien beschikbaar via intent tool); verwerp als bezoeker freelancer of buiten aankoopcommissie is
- **Trigger message formule:**
  ```
  [Noem het signaal expliciet] "Ik zag dat je deze week op onze [pricing/demo] pagina bent geweest"
  [Waarom het belangrijk is] "Meestal betekent dat je in actieve evaluatie bent. De meeste teams van jouw grootte besteden [X weken] aan vergelijken—ik kan die tijdlijn helpen verkorten"
  [Één open vraag] "Ben je ons aan het vergelijken met [bekende concurrent], of kijk je naar een paar opties in [categorie]?"
  ```
- **Antwoordpercentage stijging:** +18% vs. baseline
- **Voorbeeld trigger:** "Ik zag dat je deze week drie keer op onze pricing page bent geweest. Meestal betekent dat je actief aan het evalueren bent—ik wil ervoor zorgen dat je niets mist. Ben je ons aan het vergelijken met Concurrent X, of verken je nog steeds wat er nog meer is?"

---

**Signaal 4: Tech Stack Verandering Gedetecteerd (Concurrent Verwijderd of Complementair Tool Toegevoegd)**
- **Rang:** 4 (adoptiemomentum, ~16% antwoordpercentage)
- **Waarom het belangrijk is:** Ze hervormen actief hun tech stack; je product lost aangrenzende pijn op; timing is belangrijk
- **Detectiemethode:**
  - BuiltWith: monitor doelaccounts op verwijderde concurrenten, nieuwe tool adoptie
  - Datanyze: volg stack wijzigingen met API of handmatige wekelijkse audits
  - G2 review reads en koopsignalen (nieuwe leveranciers voegen reviews toe = nieuwe adoptie)
  - LinkedIn job postingen die nieuwe tool requirements noemen
  - ZoomInfo tech stack module
- **Vervaldatum:** 14 dagen. Stack wijzigingen vereisen 1–2 weken om te stabiliseren; na 14 dagen zijn ze verder gegaan
- **Ideaal timing eerste contact:** Binnen 7 dagen na stack change detectie (vang ze mid-evaluation)
- **Verificatie:** Bevestig dat wijziging recent is (binnen 30 dagen) en opzettelijke adoptie vertegenwoordigt, geen onopzettelijke verwijdering
- **Trigger message formule:**
  ```
  [Noem het signaal expliciet] "Ik zag dat [Bedrijf] deze maand [nieuw tool] aan je stack heeft toegevoegd"
  [Waarom het belangrijk is] "[Nieuw tool] brengt meestal problemen met [gerelateerd proces] aan het licht. Teams ontdekken meestal dat ze [jouw oplossing] nodig hebben binnen weken"
  [Één open vraag] "Ben je van plan dat te integreren met [bestaand tool], of refactor je die workflow helemaal?"
  ```
- **Antwoordpercentage stijging:** +16% vs. baseline
- **Voorbeeld trigger:** "Ik zag dat je zojuist Segment aan je stack hebt toegevoegd. De meeste bedrijven die naar Segment migreren ontdekken ook dat ze betere downstream data governance nodig hebben—dat is wat wij doen. Denk je aan dat stuk, of is dat fase twee?"

---

**Signaal 5: Financiering, Acquisitie, Nieuwe Markttoetredingsof Personeelsgroei van 20%+**
- **Rang:** 5 (budgetbeschikbaarheid, ~12% antwoordpercentage)
- **Waarom het belangrijk is:** Ze hebben kapitaal, groeimandaat, en waarschijnlijk nieuw budget om uit te geven aan tools ter ondersteuning van expansie
- **Detectiemethode:**
  - Crunchbase: financieringsaankondigingen en acquisitie tracking
  - LinkedIn bedrijfspagina: personeelsverandering over 90-daags venster (vergelijk met vorig kwartaal)
  - LinkedIn job board API: piek in job postingen (proxy voor personeelsgroei)
  - News APIs: M&A, nieuwe marktlanceringen, IPO indieningen
  - 6sense of ZoomInfo: "High growth" account vlaggen
- **Vervaldatum:** 120 dagen. Na 4 maanden is het groeikaal toegewezen; budgetten zijn vastgesteld
- **Ideaal timing eerste contact:** Binnen 30 dagen na aankondiging (dag 1–30: kapitaal is toebedeeld; dag 31–90: budgetten worden toegewezen)
- **Verificatie:** Bevestig dat groei echt is (niet boekhoudkundige herclassificatie of eenmalig evenement); cross-check Crunchbase, LinkedIn, en nieuwsbronnen
- **Trigger message formule:**
  ```
  [Noem het signaal expliciet] "Gefeliciteerd met Series [X] / [X personeelsgroei] / acquisitie van [Bedrijf]"
  [Waarom het belangrijk is] "Die groei triggert meestal [gemeenschappelijk operationeel knelpunt]. De meeste teams van jouw grootte lossen dat op door [oplossingscategorie]"
  [Één open vraag] "Plant je [relevant team] personeelsuitbreiding dit kwartaal, of concentreer je je eerst op efficiëntie?"
  ```
- **Antwoordpercentage stijging:** +12% vs. baseline
- **Voorbeeld trigger:** "Gefeliciteerd met Series C. Meestal betekent die groei dat je je engineering team opschaalt. De meeste bedrijven die engineering in jouw tempo opschalen maken binnen 6 maanden CI/CD knelpunten tegen—zie je dat al, of is de infrastructuur nog steeds stabiel?"

---

**Signaal 6: Strategische Wervingspatronen (5+ Job Postingen in Doelafdeeling Binnen 30 Dagen)**
- **Rang:** 6 (budget goedgekeurd en onderweg, ~10% antwoordpercentage)
- **Waarom het belangrijk is:** Meerdere openstaande rollen = goedgekeurd budget + actieve werving = tool spending staat op het punt voor die afdeling
- **Detectiemethode:**
  - LinkedIn job board API: filter op bedrijf + afdeling + geplaatst datum (laatste 30 dagen)
  - Indeed, Greenhouse, ATS board API: tel openstaande rollen per afdeling
  - Bedrijf careers pagina: handmatige audit van openstaande rollen
  - ZoomInfo hiring tracker
  - Persado: hiring intent signalen
- **Vervaldatum:** 45 dagen. Na 6 weken zijn rollen ingevuld of wervingsmomentum stopt; budgetvenster sluit
- **Ideaal timing eerste contact:** Binnen 14 dagen na 5e rol posting (wanneer duidelijk is dat dit een echte wervingsstuwing is, geen lawaai)
- **Verificatie:** Bevestig dat 5+ rollen in dezelfde afdeling zijn (niet verspreid over bedrijf); controleer jobbeschrijvingen op senioriteit mix (geeft aan echte investering)
- **Trigger message formule:**
  ```
  [Noem het signaal expliciet] "Ik zag dat [Bedrijf] deze maand 5+ openstaande rollen in [afdeling] heeft"
  [Waarom het belangrijk is] "Wanneer teams zo agressief werven, hebben ze meestal [toolcategorie] nodig om nieuwe hires snel aan boord te nemen en te ondersteunen"
  [Één open vraag] "Wordt die wervingsstuwing gedreven door [bekend initiatief], of breid je de scope van dat team uit?"
  ```
- **Antwoordpercentage stijging:** +10% vs. baseline
- **Voorbeeld trigger:** "Ik zag dat je deze maand 6 openstaande rollen in engineering hebt. Meestal wanneer teams zo agressief werven, ondervinden ze velocity problemen in de eerste 30 dagen—ze hebben betere code review of CI tooling nodig. Is dat iets waar je lead eng aan denkt?"

---

### Signal Stacking Logica

**Doe geen cold-outreach op een enkel signaal (rangen 3–6) alleen.** Wacht op signaalstapeling.

**Signaalstapeling regels:**
- **2+ signalen gedetecteerd (any rang) = prioriteit outreach binnen 24 uur**
  - Voorbeeld: Signaal 3 (website bezoek) + Signaal 5 (financiering) = hoog-urgentie multi-touch
  - Voorbeeld: Signaal 4 (tech verandering) + Signaal 6 (werving) = plan multi-touch
- **Signalen 1 of 2 alleen = onmiddellijke outreach (binnen 1 dag)** — wacht niet op stapeling
- **Enkelvoudige signalen 3–6 = voeg toe aan nurture cadence, niet prioriteit outreach** — controleer wekelijks tot signaal stapelt of vervalt
- **3+ signalen = kernoptie** — executive outreach, gepersonaliseerde demo aanbod, 2-uur response SLA

**Stapeling voorbeeld:**
```
Maandag: Signaal 3 gedetecteerd (website bezoek)
  → Voeg toe aan nurture list, 1x/week check-in
Woensdag: Signaal 6 gedetecteerd (4 nieuwe job postingen in sales)
  → NU: 2+ signalen. Trigger prioriteit outreach binnen 24u
  → Bericht: "Ik zag dat je sales aan het uitbreiden bent EN ons platform deze week verkent"
Vrijdag: Signaal 5 gedetecteerd (Crunchbase toont Series B)
  → 3 signalen. Escalate: oproep van founder of head of sales
```

---

### Signal Monitoring Stack

**Dagelijkse controles (accounts in actieve evaluatie):**
- LinkedIn Sales Navigator: job change alerts op target personas en warme leads
- Intent data dashboard (6sense, Demandbase): website activiteit, score threshold >60%
- Drift/Intercom: realtime notifications op pricing page of demo page views

**Wekelijkse controles (accounts in pijplijn of watchlist):**
- BuiltWith API: tech stack wijzigingen (Signaal 4)
- Bedrijfsnieuws alerts (Crunchbase, Google News API): financiering, M&A, executive hires (Signalen 2, 5)
- LinkedIn bedrijfspagina: job postingen aantal in target afdelingen (Signaal 6)
- Job board scraping: Indeed, Lever, Greenhouse voor bedrijf werving (Signaal 6)
- G2 bedrijfsprofiel: review activiteit spike = interest signaal (proxy voor Signaal 3)

**Maandelijkse audits (terugblik en verval):**
- Spreadsheet of CRM: markeer signaal datum, vervaldatum, outreach status
- Prune vervallen signalen (ouder dan 90 dagen voor Signalen 1–2, ouder dan 14 dagen voor Signaal 3, ouder dan 14 dagen voor Signaal 4, ouder dan 120 dagen voor Signaal 5, ouder dan 45 dagen voor Signaal 6)
- Score accounts op signaaltelweging en urgentie tier

---

### 14-Daagse Vervalregel (Universeel)

Alle signalen vervallen. De industriestandaard is:
- **Signaal 1 & 2:** Bruikbaar voor 90 dagen, prioriteit daalt na dag 30
- **Signaal 3:** Bruikbaar voor 7 dagen (website activiteit is tijdgebonden), cold touch na dag 7 is 60% minder effectief
- **Signaal 4:** Bruikbaar voor 14 dagen, verouderd daarna
- **Signaal 5:** Bruikbaar voor 120 dagen, prioriteit daalt na dag 30
- **Signaal 6:** Bruikbaar voor 45 dagen, momentum stopt na dag 45

**Implementatie:**
1. Tag elk signaal met detectiedatum in CRM of spreadsheet
2. Bereken vervaldatum (zie vensters hierboven)
3. Automatiseer met Zapier, Make, of in-house script: if (today > signal_date + decay_window), verwijder uit prioriteit list, verplaats naar nurture
4. Doe nooit cold-outreach op een vervallen signaal; controleer opnieuw als nieuw signaal verschijnt

---

### Eerste-Contact Message Formule (Operationeel)

Elk eerste contact moet deze 3-delige structuur volgen (max 3 zinnen):

**[Deel 1: Noem het signaal expliciet]**
- Maakt de outreach geloofwaardig en specifiek (niet spray-en-bid)
- Voorbeeld: "Ik zag dat je zojuist bent toegetreden tot Acme als VP van Ops" OF "Ik zag dat je deze week drie keer op onze demo page bent geweest"

**[Deel 2: Waarom het voor hen belangrijk is (niet voor jou)]**
- Articulate het bedrijfsprobleem dat ze waarschijnlijk ondervinden *omdat* van dat signaal
- Voorbeeld: "Wanneer ops-leiders naar een nieuw bedrijf gaan, is het eerste wat ze meestal aanpakken supply chain visibility" (Signaal 1)
- Voorbeeld: "Wanneer je een data warehouse toevoegt, ontdek je meestal data quality problemen downstream" (Signaal 4)

**[Deel 3: Één open vraag (geen pitch)]**
- Toont dat je nieuwsgierig bent, niet aan het verkopen
- Maakt antwoord gemakkelijker (binair/specifiek, niet open-ended)
- Voorbeeld: "Ben je op zoek naar [categorie] om dat op te lossen, of is visibility geen probleem voor je nog?"
- Voorbeeld: "Denkt je team al na over data governance, of is dat fase twee?"

**Template:**
```
[Signaal] "Ik merkte op dat [specifiek signaal]"
[Probleem] "[Rol/situatie] betekent meestal [zakelijke implicatie]"
[Vraag] "Denk je aan [relevant oplossingebied], of staat dat niet op de roadmap?"
```

---

### Antwoordpercentage Benchmarks (Baseline vs. Signaal)

| Signaal | Baseline | Met Signaal | Stijging |
|---------|----------|------------|---------|
| Geen signaal (cold email) | 3,4% | — | — |
| Signaal 1 (voormalige klant) | 3,4% | 35% | +10,3x |
| Signaal 2 (nieuw C-suite/VP) | 3,4% | 28% | +8,2x |
| Signaal 3 (website activiteit) | 3,4% | 18% | +5,3x |
| Signaal 4 (tech verandering) | 3,4% | 16% | +4,7x |
| Signaal 5 (financiering/groei) | 3,4% | 12% | +3,5x |
| Signaal 6 (werving) | 3,4% | 10% | +2,9x |
| 2+ signalen (gestapeld) | 3,4% | 42–58% | +12–17x |

*Bron: ColdIQ research (2024). Benchmarks gaan ervan uit B2B SaaS, 50–1000 werknemeraccounts, senior/mid-market personas. YMMV.*

---

## Voorbeeld

**Scenario: VP Sales bij Acme Corp**

**Dag 1 — Maandag 9 AM**
- LinkedIn alert: Sarah Chen voegt zich aan bij Acme Corp als VP of Sales (Signaal 2)
- Verificatie: Controleer LinkedIn, bevestig rol is VP-level, rapporteert aan CRO, bedrijfsgrootte = 350 werknemers, SaaS-gerelateerd
- Beslissing: Signaal 2 alleen = onmiddellijke outreach (rang 2, geen stapeling nodig)
- Vervaldatum: 90 dagen, prioriteit outreach dag 1–30

**Eerste-contact email (verzonden 9:15 AM dezelfde dag):**
```
Onderwerp: Gefeliciteerd met de VP rol bij Acme

Sarah,

Gefeliciteerd met je toetreding tot Acme als VP of Sales—opgewonden om vers leiderschap daar te zien.

De meeste VP of Sales besteden hun eerste 90 dagen aan twee dingen: comp restructurering en tools modernisering.
Meestal rond maand 2 evalueren ze CRM workflows of sales engagement stacks om hun ramp targets sneller te halen.

Is je playbook al ingesteld daar, of denk je nog na over dat stuk?

Groeten,
[Naam]
```

**Vervaldatum tracking:**
- Email verzonden: Dag 0 (Maandag)
- Vervolgstap 1: Dag 3 (Donderdag) als geen antwoord
- Vervolgstap 2: Dag 7 (volgende Maandag) als geen antwoord
- Vervolgstap 3: Dag 14 als geen antwoord
- Signaal deprecatie: Dag 90 (als geen antwoord tegen die tijd, verwijder uit actieve pijplijn)

---

**Dag 3 — Woensdag 10 AM**
- Intent data alert: Acme.com bezocht je demo page (Signaal 3)
- Handmatige verificatie: Drift toont bezoek van [sarah.chen@acme.com](mailto:sarah.chen@acme.com) — dezelfde persoon
- Beslissing: 2+ signalen nu (Signaal 2 + Signaal 3) = escalate naar prioriteit outreach binnen 24u
- Onmiddellijke actie:

**Tweede-contact (prioriteit oproep aanbod, verzonden 10:30 AM dezelfde dag):**
```
Onderwerp: Re: Gefeliciteerd met de VP rol bij Acme—snelle vraag

Sarah,

Zag je onze demo page vanmorgen checken. Gezien je timing bij Acme, gok ik dat je in
de evaluatiefase bent voor sales tools.

In plaats van nog een email, zou 15 min van je tijd beter zijn? Blij om je door te nemen hoe we
meestal de specifieke workflows aanpakken die Acme waarschijnlijk ondergaat.

Laat me weten wat je beschikbaarheid is deze week of volgende?

Groeten,
[Naam]
```

**Uitkomst:** Als Sarah antwoordt op beide emails, verplaats haar naar demo/conversation track. Als geen antwoord tegen dag 14, heroverweeg: is Signaal 3 (website activiteit) vervallen? (Ja, 7 dagen max—Signaal 3 is verouderd.) Controleer op nieuwe signalen. Als geen nieuwe signalen verschijnen, zet nurture cadence voort, 1x/week, tot dag 90.

---

**Real-world vervalvoorbeeld (wat NIET te doen):**
- Dag 1: Signaal 5 gedetecteerd—Acme haalt Series B op (financiering)
- Dag 60: Je stuurt cold email over de financiering
  - ❌ Fout: 60 dagen is voorbij het prioriteitsvenster (dag 1–30); budget is al toegewezen
  - ✓ Juist: Gebruik het als zachte context ("Ik zag dat Acme Series B eerder deze lente ophaalde"), maar begin met een nieuw, actueel signaal

---
