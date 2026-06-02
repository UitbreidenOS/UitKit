# CRM-hygiëne

## Wanneer activeren

Zet deze vaardigheid in werking wanneer:
- Een SDR een uitgaande/inkomende aanraking voltooit (oproep, e-mail, LinkedIn-bericht, voicemail)
- Voordat een AE een vergadering met een prospect bijwoont
- Tijdens pipelinebeoordeling om gegevensintegriteit te waarborgen voordat deals vorderingen
- Wanneer CRM-records onvolledige of verouderde activiteitenlogboeken tonen (>2 uur sinds laatste aanraking)
- Bij het plannen van een overdracht tussen SDR en verkoopteam
- Wanneer een deal tussen pipelinefasen verschuift (vereist voltooiingspoort veld)

## Wanneer NIET gebruiken

Zet deze vaardigheid niet in voor:
- Activiteiten na verkoop voor klantenondersteuning (gebruik sjablonen voor klantenservices in plaats daarvan)
- Interne teamvergaderingen of administratieve activiteiten
- Retrospectieve opschoning van oude records (>90 dagen) zonder expliciete audittrigger
- Niet-klantgerichte activiteiten (bijvoorbeeld onderzoek, teamadministratie)
- Accounts gemarkeerd als DEAD zonder nieuw signaal in 6+ maanden (archiveren in plaats daarvan)

---

## Instructies

### I. Sjabloon voor noten na telefoongesprek

Elk gesprek — inkomend of uitgaand, succesvol of mislukt — moet binnen 2 uur worden geregistreerd met deze velden ingevuld:

#### Verplichte velden

**Wat is er gebeurd**  
Dispositie in exact één zin. Gebruik gestandaardiseerde codes:
- `Connected` — levend persoon antwoord, gesprek vond plaats
- `Left VM` — voicemail opgezegd, gespecificeerde begroeting gehoord (generiek/gepersonaliseerd)
- `No Answer` — ingehaald, geen respons
- `Bad Number` — nummer ongeldig, verbroken of verkeerd persoon bereikt
- `Gatekeeper` — gefilterd door assistent/receptie, geen overdracht naar doel

*Voorbeeld:* "Verbonden met Jennifer Martinez, CMO, voor 12 min. Zij antwoordde rechtstreeks op vraag over X-initiatief."

**Genoemde sleutelprobleem**  
Leg exact taalgebruik van prospect vast in aanhalingstekens. Niet parafraseren — directe citaten zijn goud voor tegenwerping hanteren en personalisatie in toekomstige outreach.

*Voorbeeld:* "Zij zei: 'Wij zitten vast met [Legacy System] en kunnen de kosten van omschakeling niet rechtvaardigen. Onze CFO zal geen uitgaven voor nieuw gereedschap goedkeuren tot volgende fiscaal jaar.'"

**Kwalificatiestatus**  
Kaart naar MEDDPICC-elementen tot nu toe bevestigd:
- **Metrics**: Inkomstenaantal genoemd? Budget gealloceerd?
- **Economic Buyer**: Bereikt/geïdentificeerd? Rol bevestigd?
- **Decision Criteria**: Waarop evalueren zij? Snelheid, kosten, integratie?
- **Decision Process**: Tijdlijn bevestigd? Goedkeuringsniveaus geïdentificeerd?
- **Pain**: Erkend en gekwantificeerd?
- **Identified Champion**: Is er een interne voorvechter?
- **Implications**: Hebben zij bedrijfsconsequentie gearticuleerd?
- **Commitment**: Welke volgende stap hebben zij toegezegd?

Markeer elk als `Confirmed`, `Partial`, of `Missing`. Dit bepaalt gereedheid voor AE-overdracht.

*Voorbeeld:*
```
Metrics: Confirmed (£2M jaarlijks budget genoemd)
Economic Buyer: Missing (sprak met gebruiker, niet CFO/VP Finance)
Decision Criteria: Partial (snelheid genoemd, kostentoleratie onduidelijk)
Pain: Confirmed (exact citaat vastgelegd)
Champion: Missing
```

**Volgende stap**  
Specifieke, gedateerde actie met eigenaar. Niet vaag. Inclusief:
- Wat: exact volgende actie (oproep, e-mail met bron, vergadering)
- Eigenaar: SDR-naam of AE-naam bij overdracht
- Datum: kalenderdatum, niet "volgende week"
- Contingentie: wat gebeurt er als zij niet binnen 5 dagen reageren?

*Voorbeeld:* "SDR (Sarah) stuurt 3-min productoverzichtsvideo op 2026-06-05. Indien geen reactie op 2026-06-10, escaleren naar AE vervolgstap."

**Gemaakte bezwaren**  
Log elk bezwaar woordelijk. Voeg uw antwoord toe indien gegeven. Ga niet ervan uit dat dit dealbreakers zijn — het zijn gegevens voor AE-voorbereiding.

*Voorbeeld:*
```
Bezwaar: "We hebben een zittende leverancier en zitten vast tot Q3 2027."
Gegeven antwoord: "Begrepen. Wanneer Q3 nadert, zou het zin hebben om opties 90 dagen eerder te evalueren?"
Vervolgvlag: Ja — cycle terug 2026-04-01 als contractvernieuwing nadert.
```

---

### II. Standaarden voor activiteitenregistratie

**Timing**: Registreer elke activiteit binnen 2 uur na voltooiing. Geen batchverzending einde dag.

**Dekking**: Registreer elke aanraking, inclusief:
- Telefoongesprekken (inkomend/uitgaand)
- Voicemails opgezegd
- E-mails verzonden (inclusief onderwerplinesnippet)
- LinkedIn-berichten, verbindingsverzoeken, profielweergaven op actieve accounts
- Demo's, webinardeelname, inhoudsdownloads
- Taakvoltooing (vervolgafspraak gepland, bron verzonden)

**Dispositioncodes (gestandaardiseerd)**

| Activiteitstype | Code | Definitie |
|---|---|---|
| Oproep | Connected | Live gesprek met doel |
| Oproep | Left VM | Voicemail opgezegd; begroetingsstijl registreren |
| Oproep | No Answer | Ingehaald, geen keuze, geen VM; opnieuw proberen |
| Oproep | Bad Number | Ongeldig, verkeerde persoon of weigeringskeuze |
| E-mail | Sent | Timestamp wanneer ingezonden; onderwerp registreren |
| E-mail | Opened | Volgen via pixel of antwoordaanname |
| E-mail | Replied | Antwoordsentiment noteren (positief/neutraal/negatief) |
| E-mail | Bounced | Niet aflebaar; markeer voor re-sourcing |
| LinkedIn | Message Sent | Niveaupersonalisatie noteren |
| LinkedIn | Profile View | Alleen registreren als account ACTIVE-tier is (zie tags) |
| Overig | Task Completed | Bron verzonden, oproep gepland, vervolgstap geregistreerd |

---

### III. Taxonomie voor pipelinetags

**Elke loodsrecord moet alle vier taglayers hebben.** Gebruik deze exacte tags; verzin geen varianten.

#### Lead Source Tag (één vereist)
- `INBOUND` — inkomende vraag, formulierindeling, aanbeveling, evenementbijsteller
- `POSTBOUND` — na-event-nurture, webinarbijsteller, blogdownloader
- `BRIDGEBOUND` — warme introductie, wederzijdse connectief verwijzing
- `OUTBOUND` — koude outreach, LinkedIn-bericht, aankoop van e-maillijst

#### Signal Tag (wat heeft outreach geactiveerd)
Leg de specifieke reden voor engagement vast:
- `Hiring_Spree` — LinkedIn toont nieuwe personeelssterkte (wervingspagina, baanaanbiedingen)
- `Funding_Event` — Series A/B-sluiting, persvermelding, Crunchbase-signaal
- `Leadership_Change` — nieuwe CMO, CFO, VP Engineering aangesteld (LinkedIn)
- `Integration_Partnership` — aangekondigd partnerschap met tool-ecosysteem
- `Compliance_Change` — nieuwe regelgeving die hun branche beïnvloedt (SOC 2, HIPAA, GDPR)
- `Earnings_Call` — openbare inkomstencall vermeldt pijnpunt
- `RFP_Issued` — prospect stelde RFP in (soms zichtbaar in inkoopforums)
- `Contract_Renewal` — geschatte verlengingsdatum voor zittende benadering (onderzoeksgebaseerd)
- `Dormant_Account` — vorige contact inactief 12+ maanden, nieuw signaal gearriveerd
- `Generic_Outreach` — geen specifieke trigger; algemeen prospecting

#### Sequence Stage (één vereist)
- `ACTIVE` — in actieve cadence, aanraking verwacht in volgende 7 dagen
- `PAUSED` — in pauze (wachten op antwoord, afwezig, slechte timing); hervatsingsdatum ingesteld
- `COMPLETED` — cadence voltooid; geen verdere aanrakingen tenzij nieuw signaal
- `CONVERTED` — verplaatst naar kans, nu eigendom van AE
- `DEAD` — onwelkom, niet-responsief of expliciet gediskwalificeerd; geen verder contact

#### Tier Tag (één vereist)
- `T1` — economische koper bevestigd, MEDDPICC 80%+ voltooid, deal nabij (AE-eigendom)
- `T2` — beïnvloeder of gebruiker geïdentificeerd, pijn bevestigd, 60%+ voltooid, meer kwalificatie nodig
- `T3` — vroeg-stadium lead, pijnoppervlak, 30%+ voltooid, high-volume prospectpool

---

### IV. Korte handoff vóór vergadering (SDR → AE)

Maak dit document in Slack, Notion of CRM wanneer een vergadering naar AE wordt overgedragen. Geschatte leestijd: 2 minuten. Gebruik deze exacte structuur:

#### 1. Accountachtergrond (maximaal 2 zinnen)
- Bedrijfsgrootte, sector, inkomstenbereik
- Wat zij doen; waarom we denken dat zij een passende paring zijn

*Voorbeeld:* "Revolve is een £180M mid-market SaaS-leverancier in verticale HR. Zij hebben net Series C ingezameld en schalen van 3 naar 8 oplossingen in productportfolio."

#### 2. Contactprofiel (rol, ambtsduur, pijn)
- Titel en exacte rol (LinkedIn-titel gebruiken indien beschikbaar)
- Ambtsduur in bedrijf (invloedsniveau)
- Hun specifieke pijnpunt en citaat

*Voorbeeld:* "Jennifer Martinez, CMO, 2,4 jaar ambtsduur. Verantwoordelijk voor marketing tech stack en personalisatie. Pijn: 'We zitten vast met legacy MarTech en verliezen feature pariteit vs. concurrenten. Elke nieuwe tool die we kopen vereist 4 weken integratie.'"

#### 3. MEDDPICC-score en hiaten
- Totaalscore (0–100%); uitsplitsing per element
- Kritische hiaten die AE in deze vergadering moet aanpakken

*Voorbeeld:*
```
Totale kwalificatie: 68%
- Metrics: 75% (budget genoemd)
- Economic Buyer: 40% (sprak met CMO, niet CFO)
- Decision Criteria: 80% (snelheid + integratiediepte)
- Pain: 85% (citaat vastgelegd)
- Champion: 0% (moet identificeren)

Kritisch hiaat: Moet economische koper en CFO-betrokkenheid bepalen aan het einde van vergadering.
```

#### 4. Berichtensequentie (wat is gezegd)
- Gebruikte personalisatiehaakjes (bedrijfsonderzoek, aankondiging, referentienaam)
- Opgeworpen bezwaren (herhaal ze niet; markeer ze)
- Gesprekstoon (ontvankelijk, sceptisch, afgeleid)

*Voorbeeld:* "Gebruikte hun Series C-aankondiging om te openen. Zij was ontvankelijk voor snelheid/integratie hoek maar sceptisch op kosten. Vermeld ROI in eerste 90 dagen; zij zal erom vragen."

#### 5. Waarom zij hebben ingestemd met een vergadering
- Wat specifiek resoneerde; wat hen van 'nee' naar 'ja' verplaatste
- Wat zij in dit gesprek willen leren

*Voorbeeld:* "Zij stelde in toen ik zei 'We zouden een 60-daags implementatieplan aangebracht naar uw stapel lopen.' Zij wil zien of we hun snelheidsvereisten kunnen afstemmen zonder 4-weken integraties."

---

### V. Deduplicatieregels

**Voordat u een nieuw contact in CRM registreert, controleer:**

1. **E-mailkoppeling**: Zoek op werkdomein van e-mail + voornaam/achternaam. Indien gevonden, records samenvoegen; geen duplicaat maken.
2. **LinkedIn URL-koppeling**: Indien twee records dezelfde LinkedIn-profiel-URL hebben, zijn zij dezelfde persoon.
3. **Telefoonnummerkoppeling**: Exact telefoonnummerkoppeling OF hetzelfde bedrijf + dezelfde naam = dezelfde persoon. Samenvoegen.
4. **Account-level dedup**: Indien contact al onder correct accountrecord is geregistreerd, gebruik bestaand record in plaats van verweesing.

**Samenvoegingsprotocol:**
- Behoud alle activiteitengeschiedenis van beide records
- Bewaar originele contactdatum
- Combineer aantekeningen (voorafgegaan met timestamp)
- Archiveer het duplicaatrecord met samenvoegingnota

---

### VI. Gegevenskwaliteitspoorten (voordat vergadering wordt geregistreerd)

**Een vergadering kan niet worden geregistreerd als "gepland" totdat alle poorten slagen:**

1. **Voltooiing van contactveld**:
   - Voornaam: vereist
   - Achternaam: vereist
   - Werkmail: vereist
   - LinkedIn-profiel-URL: vereist
   - Functietitel: vereist

2. **Voltooiing van accountveld**:
   - Bedrijfsnaam: vereist (exacte rechtspersoon, geen bijnaam)
   - Branche: vereist
   - Bedrijfsgrootte (personeelssterkte): vereist
   - Jaarlijkse inkomsten of financieringstadium: vereist

3. **Kwalificatiepoort**:
   - Leadtier toegewezen (T1, T2, T3)
   - Ten minste één MEDDPICC-element bevestigd
   - Pijnstelling vastgelegd (minimaal één zin)

4. **Activiteitenspoor poort**:
   - Ten minste één geregistreerde activiteit (oproep, e-mail, LinkedIn-bericht) in afgelopen 30 dagen
   - Volgende stap gedocumenteerd
   - Geen verweesde contacten (moet aan correct accountrecord worden gekoppeld)

**Gevolg**: Indien poorten mislukken, wordt vergadering als "in behandeling goedkeuring" in CRM gemarkeerd. AE kan deal niet vooruit brengen totdat SDR gegevens herstelt.

---

### VII. Controlelijst CRM-veldvoltooiing

**Minimaal vereiste velden per stadium:**

**Leadstadium (prospect geïdentificeerd, niet gekwalificeerd)**
- Contact: voornaam, achternaam, e-mail, telefoon, titel, bedrijf, LinkedIn-URL
- Account: bedrijfsnaam, branche, grootte, inkomsten, locatie
- Activiteit: oproepsdispositie of e-mail verzonden (afgelopen 30 dagen)
- Tags: loodsbron, signaalinductor, sequencestadium (ACTIVE/PAUSED)

**Gekwalificeerde lead (MEDDPICC 50%+, pijn bevestigd)**
- Alle bovenstaande velden, plus:
- MEDDPICC-uitsplitsing (één zin per element)
- Pijnstelling (exact citaat, indien mogelijk)
- Volgende stap (gedateerd, met eigenaar)
- Contactbezwaren (indien aanwezig)
- Tier-tag toegewezen (T1/T2/T3)

**Vergadering gepland (bevestigd met prospect)**
- Alle bovenstaande velden, plus:
- Vergaderingsdatum/tijd/deelnemers (bevestigd)
- Vergaderingsagenda (één-regel samenvatting)
- Korte handoff vóór vergadering (5-puntsdocument)
- AE-toewijzing bevestigd
- Vervolgstaak ingevoerd voor dag na vergadering

**Kans (AE-eigendom, deal in cycli)**
- Alle bovenstaande velden, plus:
- Dealwaarde (ARR/eenmalige vergoeding)
- Sluitingsdatum (realistisch)
- Primaire besluitvormer bevestigd
- Economische koper bevestigd
- Goedkeuringsketen geïdentificeerd (CEO, CFO, VP, enz.)

---

## Voorbeeld

**Scenario**: Sarah (SDR) voltooit een koude oproep naar Marcus Chen, VP of Product bij een mid-market fintech-startup. Hij neemt op, hoort de presentatie, maar zegt dat zij in hun huidige leverancier zijn vastgezet. Sarah documenteert de oproep en geeft inzichten door aan haar AE, James.

**Noot na oproep (Sarah registreert binnen 45 min)**

```
Activiteitstype: Telefoongesprek
Contact: Marcus Chen
Bedrijf: PaymentFlow (£80M inkomsten, fintech)
Datum: 2026-06-02, 10:15 AM
Duur: 7 min

WAT IS ER GEBEURD
Verbonden met Marcus Chen, VP of Product, voor 7 minuten. Hij antwoordde rechtstreeks en was betrokken bij hele presentatie.

GENOEMDE SLEUTELPROBLEEM
"Onze huidige leverancier is degelijk maar voegt voortdurend bulk toe. Elke update heeft features die we niet nodig hebben. We besteden 20% van engineeringtijd aan integratie van hun rommel."

KWALIFICATIESTATUS
Metrics: Partial (inkomsten genoemd, budget niet)
Economic Buyer: Missing (sprak met gebruiker, CFO nodig)
Decision Criteria: Confirmed (leveranciersbulk, integratielast)
Pain: Confirmed (exact citaat vastgelegd)
Champion: Partial (Marcus is interne voorvechter, nog niet bevestigd)
Timeline: Missing
Implications: Partial (tijdskosten genoemd, bedrijfsimpact onduidelijk)
Commitment: Geen nog (luisterhouding alleen)

VOLGENDE STAP
Sarah stuurt 4-min demovideo (integratie-voorbeelden) op 2026-06-04.
Indien bekeken, plan 30-min technisch deep-dive met Marcus + 1 ingenieur op 2026-06-08.
Indien geen respons op 2026-06-08, pauzeer reeks en herzie Q4 2026 (contractverlengingscyclus).

OPGEWORPEN BEZWAREN
Bezwaar: "We zitten vast in onze zittende leverancier tot eind 2027."
Gegeven antwoord: "Begrepen. We stellen gewoonlijk een zaak op om bij vernieuwing aan te dragen. Zou het zin hebben om omstreeks april 2027, 9 maanden eerder, opnieuw te spreken?"
Zijn antwoord: "Misschien. Stuur me eerst iets."
Vervolgvlag: JA — voeg toe aan contractverlengingsreeks, cycle 2027-04-01.

TOEGEWEZEN TAGS
Loodsbron: OUTBOUND
Signaalinductor: Earnings_Call (recente fintech-financieringsronde aankondiging)
Sequencestadium: ACTIVE (demovideo in behandeling)
Tier: T2 (beïnvloeder, pijn bevestigd, budget/timeline ontbreekt)

HANDOFF NAAR AE (Nog niet nodig; zal maken voordat vergadering gepland.)
```

---

**Korte handoff vóór vergadering (Gemaakt 3 dagen later toen Marcus akkoord gaat met vergadering)**

```
NAAR: James (AE) | VAN: Sarah (SDR) | DATUM: 2026-06-05
VERGADERING: Marcus Chen, PaymentFlow | GEPLAND: 2026-06-09, 2:00 PM

1. ACCOUNTACHTERGROND
PaymentFlow is een £80M mid-market fintech-platform voor KMO's. Zij hebben recent financiering gesloten en schalen engineering om snellere featuresnelheid te ondersteunen. Integratieoverhead is een groeiend wrijvingspunt.

2. CONTACTPROFIEL
Marcus Chen, VP of Product, 2,3 jaar ambtsduur. Rechtstreekse invloed op leveranciersstapel. Pijn (woordelijk): "Elke update heeft features die we niet nodig hebben. We besteden 20% van engineeringtijd aan integratie van hun rommel."

3. MEDDPICC-SCORE
Totaal: 58%
- Metrics: Partial (inkomsten gekend, budget niet; raming nodig)
- Economic Buyer: Missing (sprak alleen met gebruiker; CFO nog niet contact)
- Decision Criteria: Confirmed (eenvoud + lage integratielast)
- Pain: Confirmed (leveranciersbulk, tijdverspilling)
- Champion: Partial (Marcus zal voorstander, maar peer-confirmatie nodig)
- Implications: Missing (bedrijfsimpact van bulk niet gekwantificeerd)
- Commitment: Geen nog

Kritisch hiaat: Moet economische koper (CFO?) identificeren en kostenintegratie van engineeringoverhead in £/uren kwantificeren.

4. BERICHTENSEQUENTIE
Openhaakje: Verwezen naar hun fintech-financieringsronde en scaling engineering-narrative (van Crunchbase).
Hij was sterk betrokken bij "integratielast" hoek.
Aarzeling: Zittende lock-in tot eind 2027. Positioneerde vernieuwingsgesprek als 9-maandvenster.

5. WAAROM ZIJ HEBBEN INGESTEMD
Resonantiepunt: "We zullen doorlopen hoe andere fintech-platforms integratieoverhead met 60% hebben verminderd."
Hij wil zien: Bewijs van vergelijkbare bedrijven; lage-touch integratie-voorbeelden.

---

VOLGENDE STAPPEN VOOR JAMES:
- Leid met concurrentvergelijking (vergelijkbare fintech use case).
- Vraag naar integratiegeleidersgrootte; quantificeer huidigen kosten.
- Economische kopervraag identificeren: "Wie goedkeurt leveranciersveranderingen hier?"
- Stellen verwachting: Lus Marcus's CEO/CFO in als deal vooruit gaat.
```

---

**CRM-velden voltooid (screenshot-equivalent uitvoer)**

```
CONTACTRECORD: Marcus Chen
Voornaam: Marcus
Achternaam: Chen
E-mail: marcus.chen@paymentflow.io
Telefoon: +44 20 XXXX XXXX
Titel: VP of Product
LinkedIn-URL: linkedin.com/in/marcuschen-fintech
Bedrijf: PaymentFlow

ACCOUNTRECORD: PaymentFlow
Juridische naam: PaymentFlow Ltd.
Branche: Financial Services / Fintech
Personeelssterkte: 240
Jaarlijkse inkomsten: £80M (geschat van Crunchbase)
Financieringsstadium: Series B/C (recente ronde)
Hoofdkantoor: Londen, VK
Website: paymentflow.com

ACTIVITEITENLOGBOEK: Afgelopen 30 dagen
- 2026-06-02, 10:15 AM | Telefoongesprek | Connected (7 min) | Sarah
- 2026-06-04, 2:30 PM | E-mail verzonden | Demovideo-link | Sarah
- 2026-06-05, 11:00 AM | E-mail geopend | Marcus opende demovideo
- 2026-06-05, 1:45 PM | E-mail beantwoord | "Interessant. Laten we praten." | Marcus
- 2026-06-09, 2:00 PM | Vergadering gepland | James (AE) + Marcus + 1 ingenieur

TAGS
Loodsbron: OUTBOUND
Signaalinductor: Earnings_Call / Fintech Expansion
Sequencestadium: CONVERTED (nu in AE-pijplijn)
Tier: T2

KWALIFICATIE
Pijn (exact citaat): "Elke update heeft features die we niet nodig hebben. We besteden 20% van engineeringtijd aan integratie van hun rommel."
MEDDPICC totaal: 58% (economische koper ontbreekt, implicaties ontbreekt)
Volgende stap: Vergadering 2026-06-09; AE om CFO/economische koper te identificeren
```

---

## Benchmarks & normen

- **Registratietarget**: 95%+ van activiteiten geregistreerd binnen 2 uur. Wekelijks audit.
- **Handoff-kwaliteit**: AE mag nooit vragen "Wie is dit?" of "Wat hebben zij gezegd?" — alle context in korte handoff.
- **Dedup-tarief**: <2% duplicaatrecords per 100 nieuwe leads. Maandelijks samenvoegen.
- **Gegevenspoort slaagpercentage**: 90%+ van geplande vergaderingen voldoen aan alle veldvoltoeiingpoorten voordat ze worden geregistreerd als "bevestigd."
- **MEDDPICC-gemiddelde op T1-handoff**: 80%+ op zes elementen (exclusief tijdlijn/implicaties indien nog niet besproken).
- **Activiteitenregistratie-SLA**: 95% binnen 2 uur; 99% binnen 4 uur. Nul registraties ouder dan einde werkdag.
