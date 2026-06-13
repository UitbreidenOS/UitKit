---
name: gdpr-expert
description: "AVG-compliance: codebasis privacyriscoscanning, DPIA-generering (art. 35), gegevenssubjektregulaarvering (art. 15-22), rechtmatigheidevaluatie en gegevensverwerkersovereenkomsten"
---

# AVG Expert-vaardigheid

## Wanneer activeren
- Scanning van een codebasis of systeem op AVG-compliance-risico's
- Genereren van een effectvolevaluatie voor gegevensbescherming (DPIA) onder artikel 35
- Beheer van aanvragen om gegevenssubjekten-rechten (toegang, verwijdering, overdraagbaarheid, bezwaar)
- Beoordeling van rechtmatigheid van een gegevensverwerkingsactiviteit
- Herziening van een gegevensverwerker-overeenkomst (DPA) met een leverancier
- Voorbereiding op een AVG-audit of regelgevingsonderzoek

## Wanneer NIET gebruiken
- Cookie-toestemmingsbannerteksten — implementatie is een dev-taak, gebruik bibliotheekdocs
- CCPA-only (VS) compliance — deze vaardigheid richt zich op AVG; veel principes overlappen maar regels verschillen
- HIPAA-compliance — ander raamwerk, gebruik een specialist
- Vervangen van gekwalificeerde Functionaris Gegevensbescherming (FGB) advies in nieuwe of hoogrisicovolle situaties

## Instructies

### Privacy-risicoscanning

```
Dit systeem scannen op AVG-compliance-risico's.

Systeembeschrijving: [beschrijf wat het systeem doet, welke gegevens het verwerkt]
Technologie stack: [talen, frameworks, databases]
Verwerkte gegevenscategorieën: [opsommen — e-mail, naam, IP, locatie, gezondheid, financieel, biometrisch]
Gebruikers: [EU-bewoners? B2B? B2C?]

AVG-risico-checklist per categorie:

IDENTIFICATIE PERSOONLIJKE GEGEVENS:
□ Welke persoonlijke gegevens worden verzameld? (naam, e-mail, IP, apparaat-ID, locatie, gedragsgegevens)
□ Welke bijzondere gegevenscategorieën worden verwerkt? (gezondheid, biometrisch, politiek, religie, seksuele oriëntatie)
□ Zijn alle verzamelde gegevens echt nodig? (gegevensminimalisatie — artikel 5(1)(c))

RECHTMATIGE GRONDSLAG (Artikel 6):
Voor elke verwerkingsactiviteit de rechtmatige grondslag identificeren:
- Toestemming (art. 6(1)(a)): vrijwillig gegeven, specifiek, geïnformeerd, ondubbelzinnig — niet gekoppeld aan voorwaarden
- Contract (art. 6(1)(b)): verwerking noodzakelijk voor uitvoering contract met betrokkene
- Wettelijke plicht (art. 6(1)(c)): vereist door EU/lidstaat wet
- Gerechtvaardigd belang (art. 6(1)(f)): moet driedeling belangenafweging test doorstaan — geen valstrik
🔴 Rood vlag: « gerechtvaardigd belang » zonder gedocumenteerde interessensafweging

TOESTEMMINGSBEHEER:
□ Wordt toestemming verkregen voor gegevensverzameling (niet erna)?
□ Is toestemming granulair (apart voor elk doel)?
□ Kunnen gebruikers toestemming even makkelijk intrekken als gegeven?
□ Wordt toestemmingsrecord onderhouden met timestamp en versie?

GEGEVENSRETENTIE:
□ Bestaat er een gedocumenteerd retentiebeleid per gegevenscategorie?
□ Worden gegevens automatisch verwijderd of geanonimiseerd na retentieperiode?
🔴 Rood vlag: « we bewaren gegevens oneindig » of « tot gebruiker account verwijdert »

BEVEILIGING (Artikel 32):
□ Zijn persoonlijke gegevens gecodeerd in rust en in transit?
□ Toegangscontroles: kunnen alleen bevoegde medewerkers persoonlijke gegevens openen?
□ Worden persoonlijke gegevens onnodig gelogd (debug-logs met PII)?
□ Pseudonimisering voorkeur waar mogelijk?

GEGEVENSVERWERKERS (Artikel 28):
□ Ondertekende DPA met elke leverancier die persoonlijke gegevens verwerkt?
□ Sub-verwerkers genoteerd en goedgekeurd?
□ Leverancier in derde land? Standaard Contractuele Bepalingen (SCB) aanwezig?

SCHENDINGSMELDINGEN (Artikel 33-34):
□ Kunt u gegevensschending binnen 72 uur detecteren?
□ Is schendingsmeldingsproces gedocumenteerd?
□ Wie is verantwoordelijk voor bevoegde melding?

Uitvoering: risico-register met artikel-referentie, ernst (🔴/🟡/🟢) en aanbevolen fix.
```

### DPIA-generering (Artikel 35)

```
Effectvolevaluatie voor gegevensbescherming voor [verwerkingsactiviteit] genereren.

Verwerkingsactiviteit: [beschrijf — bijv. « AI-aangedreven medewerkerscontrolesysteem », « gedragsgebaseerde ad-targeting »]
Verwerkingsverantwoordelijke: [organisatienaam]
FGB (indien benoemd): [naam of « niet benoemd »]
Doel: [waarom u gegevens verwerkt]
Gegevenscategorieën: [opsommen]
Ontvangers: [met wie gegevens worden gedeeld]
Overdrachten naar derde landen: [ja/nee — waar]

DPIA vereist (art. 35(3)) wanneer verwerking waarschijnlijk resulteert in HOOG RISICO:
□ Systematische en uitgebreide profilering met aanzienlijke effecten op personen
□ Grootschalige verwerking van bijzondere categorieën (art. 9) of strafgegevens (art. 10)
□ Systematische observatie van openbaar toegankelijke gebieden

WP29 / EDPB voegt 9 criteria toe — DPIA vereist als 2+ van toepassing:
□ Evaluatie of scoring (profilering, kredietwaardigheid)
□ Geautomatiseerde beslissing met juridische of gelijksoortig aanzienlijke gevolgen
□ Systematische observatie
□ Gevoelige of zeer persoonlijke gegevens
□ Grootschalig verwerkte gegevens
□ Gesleutelde of gecombineerde datasets
□ Gegevens over kwetsbare personen (kinderen, werknemers, patiënten)
□ Innovatief gebruik of nieuwe technologische of organisatorische oplossingen
□ Verwerking verhindert personen rechten uit te oefenen of service te gebruiken

DPIA-structuur:

1. BESCHRIJVING VAN VERWERKING:
   - Doelstellingen en rechtmatige grondslag
   - Gegevenscategorieën en betrokkenen
   - Gegevensstromen (verzameling → verwerking → opslag → verwijdering)
   - Betrokken verwerkers en sub-verwerkers
   - Retentietermijnen

2. NOODZAKELIJKHEID EN EVENREDIGHEID:
   - Is verwerking noodzakelijk voor het vastgestelde doel?
   - Zou hetzelfde doel bereikt kunnen worden met minder gegevens?
   - Is de gekozen rechtmatige grondslag geschikt?

3. RISICOBEOORDELING:
   | Risico | Waarschijnlijkheid | Ernst | Restrisico na maatregelen |
   |---|---|---|---|
   | Ongeauthoriseerde toegang tot persoonlijke gegevens | Gemiddeld | Hoog | Laag (codering + toegangscontroles) |
   | Gegevensschending groot aantal personen | Laag | Zeer hoog | Laag (schendingsdetectie + 72u meldingsplan) |
   | Profilering leidt tot discriminatie | Gemiddeld | Hoog | Gemiddeld — vereist toezicht |

4. MAATREGELEN RISICO'S AANPAKKEN:
   - Technische maatregelen: [codering, pseudonimisering, toegangscontroles]
   - Organisatorische maatregelen: [training, beleid, DPA-contracten]
   - Privacy by design: [gegevensminimalisatie, doelbeperking ingebouwd in architectuur]

5. FGB-RAADPLEGING:
   [FGB-herziening en goedkeuring, of reden waarom FGB niet geraadpleegd]

6. TOEZICHTHOUDER-RAADPLEGING:
   Vereist onder art. 36 als restrisico na alle maatregelen HOOG blijft.
   [Besluit: raadplegen / niet vereist — reden]

DPIA voor mijn verwerkingsactiviteit genereren.
[JURIDISCHE HERZIENING VEREIST: FGB of gekwalificeerde privacyraadgeving moet voor finalering herzien]
```

### Gegevensrechten-handler

```
Aanvraag gegevenssubjekten-rechten onder AVG artikel 15-22 afhandelen.

Aanvraagtype:
- Artikel 15: Toegangsrecht (SAR — aanvraag toegang subject)
- Artikel 16: Recht op rectificatie
- Artikel 17: Recht op verwijdering (« recht op vergetelheid »)
- Artikel 18: Recht op beperking verwerking
- Artikel 20: Recht op overdraagbaarheid
- Artikel 21: Objectionrecht
- Artikel 22: Recht niet onderworpen aan geautomatiseerde beslissingen

Aanvrager: [naam, e-mail of referentie]
Ontvangen datum: [datum — antwoord verschuldigd binnen 30 dagen, verlengbaar tot 90 voor complexe]
Identiteit geverifieerd: [ja / nee — niet verwerken tot identiteit bevestigd]

Antwoordworkflow:

STAP 1 — Registreer en bevestig (binnen 72 uur):
« We hebben uw aanvraag onder [Artikel X] van de AVG ontvangen. We zullen binnen 30 dagen antwoorden. Uw referentienummer is DSR-[JJJJ-MM-DD-NNN]. »

STAP 2 — Verifieer identiteit:
Geen persoonlijke gegevens vrijgeven of verwijdering bevestigen zonder identiteitsverificatie.
Acceptabel: regering-ID, accountverificatie, beveiligingsvragen.
Bij twijfel: extra verificatie aanvragen (art. 12(6) staat dit toe).

STAP 3 — Aanvraag verwerken:
Voor artikel 15 (toegang): alle gehouden persoonlijke gegevens verzamelen, inclusief:
  - Gehouden gegevenscategorieën
  - Verwerkingsdoelstellingen
  - Ontvangers en overdrachten naar derde landen
  - Retentietermijn
  - Gegevensbron (indien niet direct van subject)
  - Bestaan van geautomatiseerde beslissing

Voor artikel 17 (verwijdering): verwijderen uit:
  - Primaire database
  - Back-ups (redelijke termijn — back-upverwijderingschema noteren)
  - Derdepart-verwerkers (schriftelijk waarschuwen)
  - Anonimiseer als verwijdering technisch onmogelijk
  
  Uitzonderingen — verwijdering NIET vereist als verwerking nodig voor:
  - Wettelijke verplichting of rechtsvorderingen
  - Vrijheid van meningsuiting en informatie
  - Openbare archiefbewaring

Voor artikel 20 (overdraagbaarheid): gegevens exporteren in machinelesbaar formaat (JSON, CSV).
  Alleen van toepassing op: door subject geleverde gegevens + verwerkt op toestemming of contractbasis.

STAP 4 — Antwoord documenteren:
Log: aanvraagdatum, type, identiteitsverificatie, ondernomen acties, antwoorddatum, ingeroepen uitzonderingen.

STAP 5 — Antwoord binnen 30 dagen:
Indien onmogelijk te handelen: aanvrager waarschuwen met reden (mag tot 90 dagen uitstellen met kennisgeving).
Indien kennelijk ongegrond of excessief: mag redelijk tarief heffen of weigeren (reden documenteren).

Antwoord voor mijn spécifique aanvraagtype opstellen.
```

### Rechtmatigheidsevalaluatie

```
Rechtmatigheid beoordelen voor [verwerkingsactiviteit].

Verwerkingsactiviteit: [precies beschrijven — welke gegevens, welk doel, welk resultaat]
Betrokkenen: [consumenten / werknemers / B2B-contacten / minderjarigen]
Relatie tot betrokkenen: [klant / werknemer / prospect / publiek]

Rechtmatigheidsopties onder artikel 6:

TOESTEMMING (Art. 6(1)(a)):
Voorwaarden: vrijwillig gegeven, specifiek, geïnformeerd, ondubbelzinnig, apart van andere voorwaarden
Beste voor: nieuwsbriefabonnementen, niet-essentiële cookies, marketingcommunicatie
Zwakheid: kan op elk moment worden ingetrokken → verwerking moet stoppen
🔴 Niet geldig als: gekoppeld aan contract, vooringevulde vakjes, aan service-toegang gebonden

CONTRACT (Art. 6(1)(b)):
Voorwaarden: verwerking strikt noodzakelijk voor uitvoering contract MET betrokkene
Beste voor: verwerking klantbestelling, betaalde servicelevering
🔴 Niet geldig voor: marketing bestaande klanten, analyses, fraudepreventie

WETTELIJKE PLICHT (Art. 6(1)(c)):
Voorwaarden: EU of lidstaatwet vereist verwerking
Beste voor: belastingrecords, arbeidsrechtsvereisten, AML/KYC
🔴 Moet specifieke wet aanvoeren — « we zijn wettelijk verplicht » is onvoldoende

VITALE BELANGEN (Art. 6(1)(d)):
Voorwaarden: leven van betrokkene of ander persoon beschermen
Alleen noodbasis — zelden van toepassing op commerciële verwerking

OPENBARE TAAK (Art. 6(1)(e)):
Voor openbare autoriteiten en die openbare functies uitvoeren. Zelden van toepassing op private bedrijven.

GERECHTVAARDIGD BELANG (Art. 6(1)(f)):
Voorwaarden: driedeling belangenafweging-test moet slagen:
  1. Doeltest: is het belang gerechtvaardigd?
  2. Noodzakelijkheidstest: is verwerking voor dat belang noodzakelijk?
  3. Afwegingstest: overwiegen interessen gegevensrechten?

Beste voor: fraudepreventie, netwerkbeveiliging, B2B-marketing, intra-groeptransfers
🔴 KAN NIET gebruikt worden: door openbare autoriteiten; wanneer grondrechten overheersen; voor medewerkerstoezicht

Voor mijn activiteit beoordelen welke grondslag van toepassing en zwakten identificeren.
[JURIDISCHE HERZIENING VEREIST voordat u op beoordeling vertrouwt]
```

## Voorbeeld

**Gebruiker:** We bouwen een SaaS-product dat AI gebruikt om gebruikersgedragspatronen te analyseren en klantgezondheid voor onze B2B-klanten te scoren. Hun eindgebruikergegevens stromen door ons systeem. Wat is onze AVG-blootstelling?

**Analystse van Claude:**

U bent een **gegevensverwerker** (artikel 4(8)) — uw B2B-klanten zijn verantwoordelijken. Dit heeft onmiddellijke gevolgen:

**Uw verplichtingen als verwerker (artikel 28):**
- Ondertekende DPA met elke B2B-klant voor verwerking van hun gebruikersgegevens
- Gegevens alleen verwerken op gedocumenteerde instructies van elke verantwoordelijke
- Geschikte technische en organisatorische veiligheidsmaatregelen implementeren
- Verantwoordelijken ondersteunen bij het nacom hun AVG-verplichtingen (SAR's, DPIA's, breaches)
- Alle gegevens verwijderen of terugkeren bij contracteinde

**DPIA-activeringscheck:**
Uw AI-gedragsscoringsysteem activeert waarschijnlijk DPIA-vereiste omdat het combineert:
- Systematische evaluatie/profilering van personen (WP29-criterium 1)
- Innovatieve technologie (nieuw AI-gebaseerd scoring) (WP29-criterium 9)
- Potentieel grote schaal (als B2B-klanten veel eindgebruikers hebben)

Verantwoordelijken (uw B2B-klanten) zijn verantwoordelijk voor DPIA — maar ze hebben uw technische documentatie nodig hoe AI werkt. Proactief een « verwerkersbijdrage aan DPIA »-document voorbereiden.

**Hoogste risicobereiken voor u:**
1. 🔴 Sub-verwerkersketen — elk tool voor AI-bediening (AWS, ML-platform, monitoring) is sub-verwerkers. Alle opsommen. Uw DPA moet ze noemen of goedkeuringproces beschrijven.
2. 🔴 Derde-landsoverdrachten — als uw servers of ML-infrastructuur in USA, benodigd u SCB's of EU-US Dataprivacy Framework.
3. 🟡 Transparantie — eindgebruikers weten waarschijnlijk niet dat gedrag wordt gescored. Uw klanten (verantwoordelijken) moeten hun vertellen.

---
