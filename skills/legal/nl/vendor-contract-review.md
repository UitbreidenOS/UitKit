---
name: vendor-contract-review
description: "Leverancierscontractbeoordeling: identificeer riskante clausules in SaaS-, service- en inkoopcontracten — aansprakelijkheidsgrenzen, schadevergoeding, gegevensverwerking, beëindigingsrechten en automatische vernieuwingsvallen"
---

# Leverancierscontractbeoordeling Skill

## Wanneer activeren
- Beoordeling van een contract vóór ondertekening met een nieuwe leverancier
- Identificatie van nadelige clausules in SaaS- of softwareovereenkomsten
- Beoordeling van een dienstenovereenkomst, MSA of SOW voor uw bedrijf
- Controle van een vernieuwing vóór automatische verlenging van grote uitgaven
- Vlag van gegevensverwerking en aansprakelijkheidsrisico's in leverancierscontracten

## Wanneer NIET gebruiken
- Onderhandeling over uw eigen klantcontracten (verschillende risicoprioriteiten)
- Arbeidscontracten — ander rechtskader
- Onroerend goed of fysieke activaovereenkomsten — buiten bereik
- Contracten die regelgeving vereisen (FDA, bankwezen) — vereist gekwalificeerd juridisch advies
- Vervanging van advocaat voor hoog-risico-contracten (> 500K$ of aanzienlijke aansprakelijkheidsblootstelling)

## Instructies

### Standaard leverancierscontractbeoordeling

```
Beoordeel dit leverancierscontract en vlag riskante clausules.

Contracttype: [SaaS-abonnement / Professionele diensten / MSA + SOW / Inkoop / NDA]
Leverancier: [naam]
Jaarlijkse waarde: $[X]
Duur: [X maanden / jaarlijks]
Vernieuwing: [automatisch / handmatig]
Uw rol: [koper die de service ontvangt]

Beoordeel deze clausules in prioriteitsvolgorde:

1. AANSPRAKELIJKHEIDSPLAFOND (hoogste prioriteit):
   - Wat is de maximale aansprakelijkheid van de leverancier jegens u?
   - Rood waarschuwingsteken: plafond gelijk aan of kleiner dan 1× maandelijkse kosten
   - Standaard: 12× maandelijkse kosten (1 jaar contractwaarde)
   - Best: onbeperkt voor opzet, fraude, dood/letsel, inbreukontwaar, gegevensschending

2. SCHADEVERGOEDING:
   - Wie vergoedt wie voor wat?
   - Rood waarschuwingsteken: u vergoedt leverancier voor uw "misbruik" (te breed)
   - Standaard: wederzijdse schadevergoeding voor inbreuk op octrooien, nalatigheid
   - Let op: schadevergoedingsuitsluitingen die uw bescherming ondermijnen

3. GEGEVENS EN PRIVACY:
   - Wie is eigenaar van gegevens die u invoert of genereert?
   - Is er een DPA (Data Processing Agreement) bijgevoegd of ernaar verwezen?
   - Rood waarschuwingsteken: leverancier kan uw gegevens voor productverbetering zonder toestemming gebruiken
   - GDPR / CCPA: als u EU/CA persoonsgegevens verwerkt, is DPA wettelijk vereist
   - Let op: gegevensretour-/verwijderingsrechten bij beëindiging

4. BEËINDIGINGSRECHTEN:
   - Kunt u om redenen van geschiktheid (zonder reden) opzeggen?
   - Vereiste opzegtermijn: [X dagen]
   - Rood waarschuwingsteken: geen opzegging uit geschiktheid / opzegging vereist 90+ dagen opzeggingstermijn
   - Recht om op te zeggen wegens materiële inbreuk: hoeveel tijd om te herstellen?

5. AUTOMATISCHE VERNIEUWING:
   - Vernieuwt het contract automatisch?
   - Hoeveel tijd van tevoren moet u opzegging geven? [X dagen]
   - Rood waarschuwingsteken: automatische vernieuwing met > 60-daags meldingsvenster (gemakkelijk te missen)
   - Best practice: kalherinnering 90 dagen vóór vernieuwingsdatum

6. PRIJSSTELLING EN PRIJSVERHOGINGEN:
   - Kan leverancier de prijs bij verlenging verhogen?
   - Plafond op jaarlijkse prijsverhogingen? [X%]
   - Rood waarschuwingsteken: onbeperkte prijsverhogingen bij verlenging

7. SLA EN SERVICETEGOED:
   - Welke uptime wordt gegarandeerd? [X%]
   - Wat zijn de vervangingsmiddelen bij SLA-schending?
   - Rood waarschuwingsteken: SLA-tegoeden zijn uw enige mogelijkheid (beperkt uw terugvordering)
   - Let op: alleen tegoeden, geen recht om op te zeggen wegens herhaalde SLA-inbreuken

8. INTELLECTUEEL EIGENDOM:
   - Wie is eigenaar van werkproducten of aanpassingen?
   - Rood waarschuwingsteken: leverancier behoudt IE voor werk dat u betaald heeft
   - Standaard: u bent eigenaar van aangepast werk; leverancier behoudt zijn bestaande IE

Vlag elke clausule als: GROEN (gunstig) / GEEL (onderhandelen) / ROOD (afwijzen of escaleren naar juridisch)
```

### SaaS-specifieke clausulebeoordeling

```
Beoordeel deze SaaS-overeenkomst op veelvoorkomende softwarespecifieke risico's.

SaaS-product leverancier: [beschrijven]
Gebruikers: [X zetels / onbeperkt]
Gegevens opgeslagen in product: [gevoeligheid beschrijven — PII / financieel / eigendom]

SaaS-specifieke clausules ter controle:

AANVAARDBAAR GEBRUIKSBELEID (AUP):
- Welk gebruik is verboden?
- Rood waarschuwingsteken: brede "naar goeddunken van leverancier" opschortingsrechten
- Let op: vage AUP die uw legitieme gebruiksscenario kan beïnvloeden

GEGEVENSPORTABILITEIT EN EXPORT:
- Kunt u uw gegevens op elk moment exporteren?
- In welk formaat? (machine-leesbare CSV/JSON is standaard)
- Wat gebeurt er met gegevens na beëindiging? 30-daags venster voor export is standaard.
- Rood waarschuwingsteken: geen gegevensexport / propriëtair formaat / gegevens verwijderd bij beëindiging zonder respijt

BESCHIKBAARHEID EN ONDERHOUD:
- Telt gepland onderhoud mee voor uptime SLA?
- Hoeveel kennisgeving voor geplande downtime?
- Noodonderhoud: wat is het proces?

ONDERAANNEMERS EN DERDE DIENSTEN:
- Gebruikt leverancier onderaannemers die uw gegevens raken?
- Zijn ze vermeld? Kunt u bezwaar maken tegen nieuwe?
- GDPR-vereiste: moet klanten op de hoogte stellen van wijzigingen in onderaannemer

BEVEILIGINGSVERPLICHTINGEN:
- Welke beveiligingsnormen verbindt leverancier zich? (SOC 2, ISO 27001)
- Incidentmelding: hoe snel moeten zij u van een inbreuk melden?
- Standaard: 72 uur (GDPR-vereiste); Let op: > 72 uur of geen toezegging

WIJZIGINGEN IN SERVICE:
- Kan leverancier functies wijzigen of verwijderen?
- Kennisgeving vereist voor materiële wijzigingen? (30-90 dagen is standaard)
- Rood waarschuwingsteken: leverancier kan service eenzijdig zonder kennisgeving wijzigen

Resultaat: gemarkeerde clausulelijst + aanbevolen onderhandelingsverzoeken voor elke RODE/GELE clausule.
```

### Contractonderhandelings playbook

```
Bouw een onderhandelingsstrategie voor [contract].

Contractwaarde: $[X/jaar]
Machtsmiddel leverancier: [hoog / gemiddeld / laag — zijn er alternatieven?]
Uw machtsmiddel: [hoog / gemiddeld / laag — grootte van uw uitgaven ten opzichte van leverancier]
Moet-winnen clausules: [lijst de 2-3 belangrijkste om op te lossen]
Nice-to-have: [secundaire verzoeken oplijsten]

Onderhandelings playbook:

Prioriteer: kies je 3 gevechten, laat de rest los.
Leveranciers verwachten onderhandeling — ze zullen niet uit een belangrijk akkoord gaan vanwege redelijke verzoeken.

Voor elke RODE clausule:

Clausule: [naam]
Probleem: [wat de huidige formulering zegt, waarom het nadelig is]
Uw verzoek: [de specifieke taalwijziging die u wilt]
Uw terugval: [minimaal aanvaardbare taal als zij tegensputteren]
Rechtvaardiging: [waarom dit een redelijk zakelijk verzoek is]

Hefboommtactiek:
- Meerjarig engagement: "We tekenen 3 jaar als u de aansprakelijkheidsgrens oplost"
- Volumeengagement: "We breiden uit naar 500 zetels als u gegevensportabiliteit oplost"
- Timelineurgentie: "We moeten dit tegen [datum] opgelost hebben om door te gaan"
- Concurrentie: "Het contract van uw concurrent bevat al deze bescherming"

Escalatiepad:
- Niveau 1: standaard wijzigingen van hun AE
- Niveau 2: juridische onderhandeling
- Niveau 3: bestuurlijke escalatie (alleen voor strategische deals)

Genereer het onderhandelings playbook voor mijn specifieke wijzigingen.
```

### Contractcontrolelijst

```
Genereer een beoordeling controlelijst voor leverancierscontract voor [bedrijf/team].

Gebruiksscenario: [alle nieuwe leveranciers / leveranciers boven $X uitgave / alleen SaaS-tools]
Risicotolerantie: [conservatief / matig / standaard startup]

Snelle controle checklist (voor contracten < 50K$/jaar):
□ Aansprakelijkheidsgrens ≥ 12 maanden kosten?
□ Automatische vernieuwingsopzeggingstermijn ≤ 60 dagen?
□ Gegevensexportrechten inbegrepen?
□ Opzegging voor geschiktheid beschikbaar met ≤ 30 dagen opzegtermijn?
□ Geen ongewone IP-toewijzingsclausules?
→ Als alles groen: onderteken. Als rood: escaleer.

Volledige controle checklist (contracten > 50K$/jaar of met gevoelige gegevens):
□ Aansprakelijkheidsgrens en uitzonderingen beoordeeld
□ Schadevergoedingsumfang begrepen
□ DPA bijgevoegd (als gegevensverwerking)
□ SLA beoordeeld en vervangingsmiddelen zijn adequaat
□ Beëindigingsrechten (wegens inbreuk en uit geschiktheid)
□ Automatische vernieuwingsvoorwaarden in agenda
□ Prijsesculatieclausule beoordeeld
□ Gegevensportabiliteit en verwijderingsrechten bevestigd
□ Beveiligingscertificeringsvereisten ingevuld
□ Toepasselijk recht en jurisdictie aanvaardbaar
→ Interne juridische beoordeling vereist voor RODE items

Genereer de specifieke checklist voor het contractbeoordelingsproces van mijn bedrijf.
```

## Voorbeeld

**Gebruiker:** Een nieuwe SaaS-leverancier heeft ons een contract gestuurd. Jaarlijkse uitgave: 84K$. Hun aansprakelijkheidsgrens is "een maand betaalde kosten." Automatische vernieuwing met 90-daagse kennisgeving vereist. Geen DPA bijgevoegd, hoewel we klanten-e-mailadressen opslaan. Waartoe moet ik om wijzigingen vragen?

**Prioritaire herzieningen van Claude:**

Drie moet-reparatie kwesties vóór ondertekening:

**1. Aansprakelijkheidsgrens (ROOD — afwijzen zoals geschreven):**
Huidigen: 1 maand kosten = $7.000 maximale aansprakelijkheid (u betaalt 84K$/jaar)
Uw verzoek: "Minimaal 12 maanden kosten betaald in voorgaande 12 maanden (84.000 $)"
Terugval: "6 maanden kosten (42.000 $) met onbeperkte uitzonderingen voor gegevensschending en fraude"
Waarom zij akkoord gaan: Dit is een redelijk industriestandardverzoek. Elke reputable leverancier gaat van 1 maand af.

**2. Kennisgeving automatische vernieuwing (GEEL — onderhandelen):**
Huidigen: 90-daags kennisgevingsvenster — gemakkelijk te missen, vooral als de ondertekenaar vertrekt
Uw verzoek: "60 dagen of minder"
Terugval: "90 dagen aanvaardbaar als contract schriftelijke herinnering van leverancier bij 120 dagen omvat"
Praktische oplossing: Stel onmiddellijk een terugkerende herinneringskalender in voor [vernieuwingsdatum - 100 dagen] ongeacht wat in het contract staat.

**3. DPA / gegevensprivacy (ROOD — vereist, niet optioneel):**
Huidigen: Geen DPA bijgevoegd, toch verwerkt u klanten-e-mailadressen (persoonsgegevens)
Uw verzoek: "Voer standaard DPA leverancier uit vóór lancering, als addendum bij deze overeenkomst"
Waarom niet onderhandelbaar: Als u onder GDPR of CCPA valt, bent u wettelijk verplicht een DPA met elke verwerker te hebben die persoonsgegevens behandelt. De meeste leveranciers hebben een standaard DPA — vraag er gewoon om. Als zij er geen hebben, is dat een rood waarschuwingsteken over hun gegevenspraktijken.

**Wat los te laten:** SLA-tegoed, IP-clausules (aangenomen geen aangepaste ontwikkeling) en toepasselijk recht zijn op dit uitgavenniveau lager prioriteit.

---
