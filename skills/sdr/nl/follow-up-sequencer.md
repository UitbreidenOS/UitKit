# Vervolgstap-Sequencer

## Wanneer activeren

Wanneer u SDR- of verkoopsequenties beheert waarbij u prospectinteracties via deterministische takken moet routeren op basis van antwoordtype, gestandaardiseerde vervolgstap-cadansen toepast en herbetrokkenheids­beslissingen maakt. Activeer: (1) initiële outreach-e-mail verzonden en bijgehouden, (2) antwoord gedetecteerd (positief, negatief of nul), of (3) herbetrokkenheids­beslissing op het 60+ daagse punt. Gebruik dit om ad-hoc vervolgstap-logica te vervangen en zorg voor consistente timing, berichten en inwerpbehandeling over het pipelinevolume heen.

## Wanneer NIET gebruiken

Gebruik dit niet voor: single-threaded eenmalige interacties, interne teamcommunicatie, na-vergaderings-verzorging­sequenties (die gebruiken andere logica — zie post-discovery-werkstromen), of "altijd actieve" broadcast­campagnes. Pas geen sequencing-logica toe op warme inbound-leads of SQLs die al zijn gekwalificeerd door verkoopsontwikkeling. Comprimeer tijdlijn­en niet of sla takken niet over omdat "we willen snellere conversie" — takvertijding is gekalibreerd voor afleverbarheid, betrokkenheid en inwerp­overtuiging.

## Instructies

### Kernsequencing-logica: Drie Takken

#### Tak A: Positief Antwoord (Actie Vereist Dezelfde Dag)

Wanneer een prospect antwoordt met interesse, betrokkenheidssignaal of vraag:

1. **Sluit de sequence onmiddellijk af** — verwijder prospect uit automatische vervolgstappen.
2. **Classificeer antwoordtemperatuur** (heet/warm/koud):
   - **HEET**: Expliciet verzoek voor vergadering, budgetvermelding, urgent pijnsignaal, leidinggevende toon, specifieke use-case-vraag → vergaderingsintent is duidelijk.
   - **WARM**: Geïnteresseerd maar voorwaardelijk ("Vertel me meer over X", "Hoe verschilt dit van Y?", "Stuur me info"), timing niet gespecificeerd, of je kennis testen → heeft verduidelijking­s­oproep of waarde-demo nodig.
   - **KOUD**: Beleefde nee ("dank je, maar niet op dit moment"), inwerp gesteld, omleiding ("praat met mijn team"), of generieke hoffelijkheid → classificeer inwerp­tak (Tak C).

3. **Dezelfde-dag-antwoord­cadans**:
   - **HEET antwoord**: Antwoord binnen 2 uur. Bericht: bevestig vergader­tijd, verwijder wrijving (agenda­link, Zoom), zeg hun probleem in je woorden, éénliner over wederzijds voordeel. Doel: boek binnen 48 uur. Leg niet uit of pitch niet te veel.
   - **WARM antwoord**: Antwoord binnen 4 uur. Bericht: beantwoord hun specifieke vraag in 1–2 zinnen, voeg één bewijs­punt toe (case study­snippet, stat, of feature-demo), zachte CTA ("Ik stuur je snel een Loom" of "laten we spreken om het te onderzoeken"). Plan discovery-oproep voor 3–7 dagen.

4. **Na-antwoord-verzorging**:
   - **HEET → Vergadering geboekt**: Verplaats naar vergaderingsprep-werkstroom. Pauzeer vervolgstap-sequencing tot na vergadering.
   - **WARM → Vervolgstap in 30 dagen**: Als geen vergadering geboekt na initiële discovery-oproep of -antwoord, herbetrokkenheid na precies 30 dagen met specifieke context­notitie: "Vorige keer spraken we over [X]. Hier is wat ik heb geleerd..." Dit houdt het gesprek warm zonder churn.

---

#### Tak B: Geen Antwoord (Multi-Touch, Gekadanseerde Afname)

Wanneer prospect niet antwoordt binnen het monitoringvenster:

**Dag 0**: Initiële e-mail verzonden (E-mail 1: Probleemherkennings­haak).

**Dag 3**: Verzend E-mail 2 — Pijnlijkheidsframing.
- Premisse: Je Dag 0-e-mail bereikte inbox maar triggerde geen antwoord (lage betrokkenheids­drempel).
- Bericht: Verschuif van "je zou je ervan bewust moeten zijn" naar "hier is wat stuk gaat voor bedrijven als jij." Gebruik data, probleemstelling of proces­gat gebonden aan hun bedrijf/rol. Introduceer sociaal bewijs (klantgetuigenis, trend, stat). Houd onderwerpregel anders dan Dag 0 (vermijd "vervolgstap"-taal).
- CTA: Zachter dan Dag 0 — "Als dit aanslaat, laten we praten" in plaats van "laten we een oproep inplannen."

**Dag 7**: Verzend E-mail 3 — Delegering­vraag.
- Premisse: Twee touches, geen antwoord. Prospect kan geïnteresseerd zijn maar niet de juiste persoon, of te druk.
- Bericht: "Ik kan het verkeerde contact hebben — wie in je team is verantwoordelijk voor [proces/budget/besluit] voor [specifieke uitkomst]?" Verwijdert jezelf uit de vergelijking en biedt gemakkelijke uitweg (stuur door naar collega).
- CTA: Geen. Verwacht doorsturen, omleiding of voortdurende stilte.

**Dag 12**: Verzend E-mail 4 — Afscheid (Finale Sequence-e-mail).
- Premisse: Vier touches over 12 dagen signaleert lage intent of slechte fit.
- Bericht: Non-verkoops, authentiek klinkend afscheid. "Ik zal een stap terugnemen — het lijkt niet het juiste moment. Als [specifieke trigger] verandert (nieuwe aanstelling, budgetbeoordeling, technische schuld­piek), zou ik je graag herbetrekken."
- CTA: Geen vraag. Sluit lus netjes af.

**Na Dag 12**: Park prospect voor 60 dagen.
- Stel een taak in om NIET te e-mailen. Verplaats prospect naar "koud" segment in CRM.
- Stel herbetrokkenheids­controlepoint in op Dag 72 (60 dagen + 12 dagen verstreken).

---

#### Tak C: Negatief Antwoord (Inwerp-Routering)

Wanneer prospect expliciet nee zegt, bezwaar maakt of negatieve intentie signaleert:

1. **Classificeer inwerp**:
   - **"Nee dank je" / "Niet geïnteresseerd"**: Beleefde afwijzing, laag overtuigings­signaal.
   - **"We gebruiken al [concurrent]"**: Legitiem alternatief op zijn plaats.
   - **"Ons budget is bevroren"**: Timing­inwerp (kan ontdooien).
   - **"Dit is nu geen prioriteit"**: Lage urgentie, geen actieve pijn.
   - **"Je bent niet de juiste fit"**: Expliciet mismatch op product/markt.
   - **"Bereikt op verkeerd moment/persoon"**: Routerings­probleem, niet product­probleem.

2. **Slechts één herformulering­poging**:
   - Antwoord binnen 24 uur.
   - Pak de kern van de inwerp en herformuleer: "Dat begrijp ik dat je [concurrent] gebruikt. We werken *anders* omdat [sleutel­verschil gebonden aan hun use case]."
   - Voeg bewijs toe: klantcitaat van iemand in dezelfde situatie, of specifiek uitkomst­verschil.
   - Recht NIET tegen. Pitch NIET harder.
   - Enkelvoudige CTA: "Geen druk — als [specifieke voorwaarde verandert], stuur ik je wat ik heb geleerd. Oké?"

3. **Uiteindelijke beslissing na herformulering**:
   - **Prospect gaat akkoord met herbetrokkenheids­voorwaarde**: Stel taak in voor herbetrokkenheids­controlepoint (60 dagen).
   - **Prospect weigert herformulering of negeert deze**: Pensioneer prospect voor 6 maanden.
     - Tag in CRM met reden (concurrerende oplossing, budget, geen fit, timing, etc.).
     - Stel taak in: "Herbekijk als [trigger­voorwaarde]" (bijv. "als Serie B aangekondigd", "als vervang [concurrent]", "als huur verkoops­leider").
     - Neem GEEN contact op totdat die trigger afvuurt of op 6-maands­punt (wat het eerst is).

---

### Herbetrokkenheids­regels

Pas deze regels alleen toe voor prospects in de 60+ dag park of 6-maands­pensioen­fase:

1. **Minimale verstreken tijd**: 60 dagen sinds laatste touch (Tak B) of 6 maanden (Tak C). Comprimeer niet.

2. **Nieuw signaal­vereiste** — Een van:
   - Financieringsaankondiging (Serie A, B, of groetronde).
   - Functie­verandering (prospect bevorderd, verplaatst naar ander bedrijf, of rol verschoven naar hogere senioriteit).
   - Technologie­verandering (platforms gewisseld, nieuwe stack aangenomen, of nieuwe initiatief aangekondigd).
   - Openbaar nieuws (expansie, nieuw kantoor, nieuw product, strategische draai, overname, leiderschap­verandering).
   - Inbound-gedrag (website bezocht, marketing-e-mail geopend, LinkedIn-inhoud aangeklikt).

3. **Bericht­structuur** (referentie aan de kloof):
   - Opener: "We spraken enkele maanden geleden over [hun gesteld probleem]. Ik merkte op dat je [nieuw signaal]. Dacht dat dit nu wellicht relevant zou zijn."
   - Premisse: Ander perspectief dan originele sequence. Als Dag 0 "snelheidsprobleem" was, herneem met "schaal­probleem" of "team­efficiëntie." Herhaald origineel pitch NIET.
   - Bewijs: Nieuwe klantwinst, product­functie, of benchmark die direct het *nieuwe* signaal aanpakt.
   - CTA: "Benieuwd of dit het gesprek verandert. Kunnen we 20 minuten nemen?" (Minder wrijving dan origineel verzoek.)

4. **Cadans na herbetrokkenheid**: Behandel als nieuwe sequence. Pas Tak B-logica toe (Dag 3, Dag 7, Dag 12) alleen als herbetrokkenheids­e-mail geen antwoord krijgt. Hergebruik oude e-mailkopie NIET.

---

### Sequence-prestatie­diagnostieken

Volg deze statistieken op *sequence­niveau* (niet campagne­breed) om knelpunten te identificeren en op te lossen:

#### Diagnostiek 1: Openingspercentage < 30%
**Probleem**: Inboxplaatsing of onderwerplijnjastheid.

- **Fix 1 (Afleverbarheid)**: Controleer DKIM/SPF/DMARC­uitlijning. Verifieer dat e-maildomein niet op spamlijsten staat (controleer MXToolbox). Draaie verzend-IP of domein als percentage aanhoudt.
- **Fix 2 (Onderwerpbalk)**: A/B-test onderwerpslijnen bij volgende zending. Lagere prestaties als:
  - Alles hoof­lettersof te veel leestekens (triggert spamfilters).
  - Generiek ("Vervolgstap", "Snelle vraag") vs. gepersonaliseerd ("Ik zag dat je 3 ingenieurs aanstelde — hier is wat dat betekent voor Infra").
  - Geen nieuwsgierigheid­kloof of relevantie voor rol.

**Doel**: 40–50% openingspercentage is sterk voor koude outreach; 30% is minimum leefbaar.

---

#### Diagnostiek 2: Openingspercentage > 30%, Antwoordpercentage < 2%
**Probleem**: Betrokkenheid konverteert niet naar antwoord. Inhoud of CTA onduidelijk.

- **Fix 1 (Inhoud)**: Is de waardeproposie duidelijk in eerste 2 regels? Prospect zou "waarom gaat dit over mij?" in < 10 seconden moeten beantwoorden. Herschrijf om:
  - Begin met hun probleem (niet je oplossing).
  - Gebruik 1–2 statistieken van hun industrie (toont onderzoek).
  - Houd lichaamslengte tot max 100 woorden.
  
- **Fix 2 (CTA)**: Is de vraag te groot? "Laten we een 30-minuten discovery-oproep inplannen" heeft meer wrijving dan "Kan ik je één snelle vraag stellen?" Verklein vraaggrootte:
  - Dag 0: "Snelle vraag" of "Één gedachte."
  - Dag 3: "Slaat dit aan?"
  - Dag 7: "Met wie moet ik praten?"

**Doel**: 2–4% antwoordpercentage voor koude B2B-sequenties. Onder 1% signaleert verbroken inhoud of lijstkwaliteit.

---

#### Diagnostiek 3: Antwoordpercentage > 2%, Vergaderingspercentage < 30%
**Probleem**: Antwoorden bestaan maar konverteren niet naar vergaderingen. Discovery-oproep of antwoord-CTA is onduidelijk.

- **Fix 1 (Antwoord­bericht)**: Wanneer je antwoordt op een positief antwoord, is de CTA expliciet? Vaag ("Laten we snel praten") vs. expliciet ("Ik heb dinsdag 14:00 en donderdag 10:00 beschikbaar — wat werkt voor jou?"). Gebruik agenda­koppelingen (Calendly, Chili Piper). Verminder wrijving.

- **Fix 2 (Discovery-oproep­scripting)**: Verkennen je discovery-oproepen *hun* probleem of pitch? Audit oproepen voor: openen met gedempt microfoon/camera? Zelf spreken eerst? Niet naar timeline vragen? Vervang door:
  - "Wat bracht je ertoe om te antwoorden?"
  - "Als ik een toverstaf kon zwaaien op [probleem], hoe zou het eruitzien?"
  - "Wanneer hoopte je dit opgelost te hebben?"

**Doel**: 30–50% van antwoorden moet naar vergaderingen omzetten (hangt af van antwoord­temperatuur en je kwalificatie).

---

### Multi-Channel Sequence-Overlay

E-mail alleen heeft 30–40% openingspercentages. Stapel kanalen voor 2–3x vergader­conversie:

```
Dag 0: E-mail 1 (Probleemhaak)
         ↓
Dag 1: LinkedIn profiel bekijken + nog geen bericht (passief signaal)
         ↓
Dag 3: E-mail 2 (Pijnlijkheidsframing)
         ↓
Dag 5: LinkedIn direct bericht (geen verbindingsverzoek)
         Bericht: "Zag je profiel — snelle gedachte op [hun recente baan/bedrijf­verhuizing/inhoud]."
         Zend E-mailkopie NIET opnieuw.
         ↓
Dag 7: E-mail 3 (Delegering­vraag)
         ↓
Dag 7 (zelfde dag): Telefoon­oproep poging (optioneel, high-touch)
         Spreukelvoicemail als geen antwoord: "Hallo [naam], dit is [jouw naam] van [bedrijf]. Ik had een gedachte over [probleem] — bel me terug op [nummer]. Ik stuur je ook een e-mail."
         ↓
Dag 12: E-mail 4 (Afscheid)
```

**Kanaal­specifieke regels**:
- **E-mail**: Autoriteit, context, bewijs. Gebruik voor probleemstelling en herformuleringen.
- **LinkedIn­bericht**: Nieuwsgierigheid, beknopt, gepersonaliseerd naar hun openbare activiteit. "Ik merkte op dat je schreef over [onderwerp] — we zien [gerelateerde trend] met [vergelijkbaar bedrijf]."
- **Telefoon**: Warmte, urgentie, discovery. Gebruik voicemail om e-mail-vervolgstap in te brengen. Als persoon opneemt, vraag, pitch niet. "Is dit een slecht moment?" Luister eerst.

**Multi-channel voordeel**: Als e-mail stuitert of in spam wordt gezet, LinkedIn of telefoon creëert back-uptouchpoint. Als ze reactief zijn op e-mail maar niet telefoon, heb je voorkeur geleerd.

---

### Dagelijkse Taak­structuur voor het Beheren van Meerdere Sequenties

Om meerdere actieve sequenties (50–100 prospects) operationaliseren zonder handmatige drift:

#### Ochtend­review (10 min)
1. Controleer antwoorden van gisteren's verzenden (E-mail 1, 2, 3, 4 over actieve sequenties).
2. Classificeer elk antwoord: Heet/Warm/Koud of Inwerp.
3. Maak taken voor dagelijkse antwoorden (Hete antwoorden krijgen 2-uur timer, Warme antwoorden krijgen 4-uur timer).
4. Markeer alle nieuwe positieve signalen (financiering, functie­verandering) voor herbetrokkenheids­prospects in park.

#### Verzend­blok (per cadans)
- **Dag 0 verzenden**: Batch 20–30 E-mail 1 verzenden in ochtendblok (8–9 uur). Stel timer in voor Dag 3-e-mail (stel in op auto-verzenden of herinnering).
- **Dag 3 verzenden**: Auto-verzend E-mail 2 naar niet-antwoorders van Dag 0-batch. Handmatig review: opens die toch niet antwoordden? (Mogelijk knelpunt.)
- **Dag 7 verzenden**: Auto-verzend E-mail 3. Handmatig controleren: iemand die tussen Dag 3–7 antwoordde? Sluit hen af uit sequence, verplaats naar Tak A-werkstroom.
- **Dag 12 verzenden**: Auto-verzend E-mail 4. Review: iemand verplaatst naar Tak C (inwerpingen)? Routeer ze naar herformulerings­werkstroom.

#### Middag­review (10 min)
1. Controleer op nieuwe antwoorden op vandaag's verzendingen (minder waarschijnlijk maar mogelijk).
2. Log alle herbetrokkenheids­signalen (financiering, aanstellingen, enz.). Tag voor 60-dag­herbetrokkenheids­lijst.
3. Bevestig dat volgende dag's verzendtaken in de wachtrij staan (of stel auto-verzenden in).

#### Wekelijkse Review (20 min)
- **Statistieken check**: Openingspercentage, antwoordpercentage, vergaderingspercentage voor sequenties van de week. Diagnostieken geactiveerd (< 30% open, < 2% antwoord, < 30% vergader­conversie)?
- **Park­lijst review**: Zijn 60-dag of 6-maands­parkde prospects klaar voor herbetrokkenheid? Controleer op nieuwe signalen.
- **Inwerp­triage**: Iemand in inwerp­herformulering? Controleer of ze op herformulering hebben geantwoord (binnen 5 dagen). Zo niet, verplaats naar 6-maands­pensioen, tag reden.

#### Hulpmiddelen/Automatisering
- **CRM-taak­automatisering**: Stel regels in zodat Dag 3, 7, 12-e-mails automatisch triggeren tenzij prospect antwoordde (sluit af uit sequence bij antwoord).
- **Slack/e-mail herinneringen**: Stel dagelijkse 10:00 samenvatting in: "20 prospects hebben dezelfde-dag-antwoorden nodig. 5 sequenties treffen diagnostieken. 3 klaar voor herbetrokkenheid."
- **Spreadsheet of Airtable**: Volg elke sequence: verzenddatum, opens, antwoorden, vergadering geboekt, reden voor park/pensioen.

---

## Voorbeeld

### Reëel Scenario: Enterprise SaaS SDR het Beheren van 60 Actieve Prospects

**Bedrijf**: Gegevens­integratie­platform (enterprise). **SDR**: Alex. **Prospect­pool**: 60 mid-market DevOps-leiders (VP/Director-niveau).

---

**Week 1: Initiële Outreach (Dag 0-batch)**

Alex verzendt 20 E-mail 1's over twee dagen:
- Onderwerp: "Ingenieurs­schuld bij [bedrijf]?"
- Lichaamsinhoud: "Ik merkte op dat [bedrijf] je data engineering-team in het afgelopen jaar 2x uitbreidde. Veel bedrijven waarmee we werken raken een schaal­muur als ze dat doen. Benieuwd of het op je routekaart staat."
- CTA: "Één snelle vraag — is data pipeline-complexiteit een probleem voor je team?"

**Dag 0 statistieken**: 12 van 20 opens (60% openingspercentage). ✅ Goed.

---

**Dag 3: Pijnlijkheidsframing (Tak B, geen antwoord­cohort)**

Alex verzendt E-mail 2 naar de 8 die niet antwoordden:
- Onderwerp: "Re: Ingenieurs­schuld bij [bedrijf]?" (ander onderwerp dan E-mail 1).
- Lichaamsinhoud: "Vervolgstap — ik zie een trend. Bedrijven die schalen van 1 naar 2 ETL-hulpmiddelen eindigen meestal met een broze data-platform. Hier is wat het kost (case study): gemiddelde hersteltijd is 6+ uur als storingen gebeuren. Twee vragen: (1) Hoe schaalt je huidige setup? (2) Wie is daarvoor verantwoordelijk in je team?"
- CTA: "Stel snel antwoord op prijs — of wijs me op de juiste persoon als dat jij bent."

**Observatie**: 2 van 8 opens E-mail 2, geen antwoordt. 6 van 8 openen niet. → Afleverbarheid­probleem gemarkeerd. (Controleer domein DKIM; E-mail 1 liep waarschijnlijk naar spam.)

---

**Dag 3: Tak A (Positief antwoord)**

Van de 12 die E-mail 1 openden:
- 1 prospect antwoord: "We beoordelen oplossingen. Kun je een demo sturen?"
- 1 prospect antwoord: "Dank je maar we zijn niet op de markt op dit moment."

**Prospect A (positief)**: HEET. Antwoord binnen 2 uur.
- Bericht: "Geweldig — laten we 30 min volgende week inplannen. Ik stuur je een Loom van hoe je use case eruitziet. Dinsdag 14:00 of donderdag 10:00?" (Expliciete CTA, agenda­link.)
- **Uitkomst**: Prospect boekt donderdag vergadering. Sluit af uit sequence, verplaats naar vergaderingsprep.

**Prospect B (negatief)**: KOUD. Verplaats naar Tak C (inwerp).
- Herformulerings­poging binnen 24 uur: "Dat begrijp ik — de meeste teams beoordelen wanneer ze een breekpunt raken (meestal wanneer pipelines in productie mislukken). Als dat verandert, stuur ik je een benchmark over wat typisch is voor bedrijven in jouw schaal."
- Stel herbetrokkenheids­voorwaarde in: "Als je hiervoor aanstelt of een evaluatie start, laat het me weten."
- **Uitkomst**: Prospect antwoord niet. Verplaats naar 6-maands­pensioen. Tag: "Niet op markt." Controlepoint: 6 maanden of wanneer Serie B aangekondigd.

---

**Dag 7: Delegering­vraag (Tak B, voortdurend)**

E-mail 3 verzonden naar resterende 6 (die E-mail 2 niet openden):
- Onderwerp: "Snelle vraag — wie is verantwoordelijk voor data-architectuur bij [bedrijf]?"
- Lichaamsinhoud: "Ik kan het verkeerde contact hebben. Als je niet de juiste fit bent, kun je doorsturen naar wie data pipeline-architectuur bezit?"
- CTA: Geen.

**Uitkomst**: 1 prospect antwoord, doorgestuurd naar collega (Data Engineering Lead). Voeg nieuw contact aan sequence toe, herstart op Dag 0.

---

**Dag 12: Afscheid**

E-mail 4 verzonden naar 5 resterende niet-antwoorders:
- Onderwerp: "Geen druk — stap terugnemen"
- Lichaamsinhoud: "Ik zal hier afronden. Het lijkt niet het juiste moment te zijn. Als je een data platform-breekpunt raakt of een migratie aankomt, zou ik je graag herbetrekken. Veel sterkte met het team schalen."
- CTA: Geen.

**Uitkomst**: Alle 5 verplaatst naar 60-dag park. Stel herbetrokkenheids­controlepoint in: Dag 72.

---

**Samenvatting na Dag 12-batch**:

| Uitkomst | Aantal | Status |
|---------|-------|--------|
| Vergadering geboekt | 1 | Actief (vergaderingsprep) |
| Naar inwerp­herformulering verplaatst | 1 | 6-maands­pensioen |
| Doorgestuurd (nieuw contact) | 1 | Herstart sequence |
| Geparkt 60 dagen | 5 | Taak ingesteld voor Dag 72 |
| **Totaal betrokken** | **8 / 20** | **40% betrokkenheid** |

---

**Week 4: Herbetrokkenheid (Dag 72-controlepoint)**

Alex controleert 5 geparkte prospects op nieuwe signalen:
- **Prospect C**: Financieringsronde aangekondigd (Serie B, $40M). Nieuw signaal gedetecteerd.
  - Herbetrokkenheids­e-mail: "We spraken enkele weken geleden over je data schalen. Ik merkte op dat de Serie B — gefeliciteerd. Dit is meestal wanneer data platform-beslissingen versnellen. Ander perspectief op het probleem: hier is hoe 3 bedrijven op jouw nieuwe schaal hun data stack afhandelden. Kunnen we 20 min nemen?"
  - CTA: Agenda­link.
  
- **Prospects D, E**: Geen nieuwe signalen. Park voor nog 30 dagen voorzetten.

**Uitkomst**: Prospect C opent herbetrokkenheids­e-mail, antwoord met interesse. Sluit af uit sequence, verplaats naar vergaderingsprep. Prospects D, E blijven geparkt.

---

**Diagnostieken Toegepast (Week 4 review)**

Alex merkte op:
- **Openingspercentage Dag 0**: 60% (goed). **Openingspercentage Dag 3**: 25% (slecht). → **Fix**: Afleverbarheid­probleem (domein DKIM was niet uitgelijnd). DMARC-record toegevoegd.
- **Antwoordpercentage totaal**: 3 antwoorden uit 20 Dag 0-verzendingen = 15% (sterk voor koude B2B-data engineering).
- **Vergaderingspercentage van antwoorden**: 2 vergaderingen uit 3 antwoorden = 67% (hoog omdat HETE antwoorden snel waren gekwalificeerd, inwerp was vroeg geparkt).

**Aanpassingen voor volgende batch**:
- Realign DKIM voordat volgende 20 E-mail 1's verzenden.
- A/B-test onderwerpslijnen (huidige "Ingenieurs­schuld" werkt; test "Team schalen raakt muur?" op volgende cohort).
- Houd delegering­vraag (Dag 7) als-is — het genereert doorsturen.

---

Dit scenario laat zien hoe de drie takken (A: heet/warm afsluit en verzorging; B: geen antwoord cadans; C: inwerp park) tegelijk werken over 20 prospects over 12 dagen, met statistieken-diagnostieken die echte aanpassingen triggeren.
