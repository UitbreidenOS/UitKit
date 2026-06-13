# Trigger Finder

## Wanneer activeren
Dagelijkse prospectingworkflow bij het opbouwen van event-triggered sequences, prioritering van wie de volgende 24 uur moet worden benaderd, of operationalisering van signalen voor aankoopintentie in een herhaalbare outreach cadence.

## Wanneer NIET te gebruiken
Cold outreach zonder trigger — gebruik in plaats daarvan de Personalization skill voor statische ICP outreach. Gebruik Trigger Finder niet voor warme inbound leads (ze hebben al intentie) of account-based sales waar relaties al zijn vastgesteld.

## Instructies

### De 4 Trigger Categorieën

**1. Bedrijfsgebeurtenissen** — directe organisatorische verschuivingen die budget en urgentie creëren
- Financieringsronde (Series A/B/C, seed) — kapitaalinjectie triggert aanwervingen, toolexpansie, infrastructuuroverhaul
- Aanwervingsspurt (3+ vacatures in 90 dagen) — nieuw team = nieuwe toolbudgetten, skill gaps, procesproblemen
- M&A activiteit (verwerving of worden verworven) — integratiechallenges, systeemconsolidatie, legacy platform vervanging
- Leiderschapswisseling (nieuwe CTO, VP Engineering, CMO) — nieuwe executives brengen verse vendor relaties en mandaat voor verbetering mee

**2. Gedragsignalen** — intentie-onthullende activiteiten die actieve evaluatie aangeven
- Content downloads (whitepapers, gidsen, ROI calculators) — zelfonderwijs fase, opties vergelijken
- Webinar/demo bezoek (events van uw concurrenten, industrie conferenties) — koopmode, benchmark verzameling
- Review site activiteit (G2, Capterra, Trustpilot — site bezoeken, vergelijkingsweergaven, demo aanvragen) — laat-fase evaluatie
- Vacatureposten vermelding van skill gaps of nieuwe initiatieven — aanwerving voor mogelijkheden die ze niet in-house hebben

**3. Tech Stack wijzigingen** — platform adoptie en churn die spend en prioriteitsschuivingen onthullen
- Nieuwe tool installaties (via BuiltWith, LinkedIn vacatureposten die "ervaring met X" vermelden) — actieve stack expansie, budget gealloceerd
- Aankondigingen van concurrent tool verwijdering/discontinuatie — actieve vervangingszoeking gaande
- Competitor adoptie door hun peers (case study zichtbaarheid, verlies van social proof) — FOMO, angst om achter te blijven
- Stack consolidatie of modernisering initiatieven (afgeleid uit vacatureposten, LinkedIn content, engineering blogs) — platform rationalisering = RFP window

**4. Externe gebeurtenissen** — macro triggers die schaal aankoopurgentie verschuiven
- Regelgevingswijziging (GDPR, SOC2, data residency wetten, AI compliance) — geforceerde compliance spend
- Competitor falen of marktcontractie — vertrouwensverlies, alternatief-zoekgedrag
- Marktshift of industrie disruptie (AI, API-first, serverless adoptie) — categorie creatie, nieuwe categorie adoptie

### Signaal bronnen: De Stack

**Gratis of lage kosten bronnen:**
1. **LinkedIn** (gratis) — vacatureposten, bedrijfsupdates, leiderschapswisselingen, founder posts over financiering
2. **G2/Capterra** (gratis) — competitor review activiteit, download counts, demo request pieken
3. **Crunchbase** (gratis tier, alerts via email) — financiering aankondigingen, aanwervingsgegevens, bedrijfsnieuws
4. **BuiltWith** (gratis/betaald) — identificeer wie specifieke tech gebruikt, set up tracking voor concurrenten of ICP profielen
5. **Google Alerts** (gratis) — set up alerts voor bedrijven, concurrenten, regelgevingssleutelwoorden, industrie termen
6. **Job posting aggregators** (gratis: LinkedIn, Indeed, Ashby) — proxy voor aanwervingssnelheid, pijnpunten, budgetrichting
7. **Bedrijf careers pagina** (gratis) — actieve aanwervingsspurts, nieuwe teamvorming
8. **Zapier/Make templates** (betaald, $10–50/mo) — automatiseer dagelijkse signaalverzameling in uw CRM

**Premium bronnen** (optioneel voor schaaloperaties):
- Apollo.io, Hunter.io, of ZoomInfo — trigger alerts, intent data overlays
- 6sense, Demandbase, Terminus — account-level intent signalen

### Trigger Scoring Framework

Wijs elk signaal een score toe die reactiesnelheid bepaalt:

**Hoog (Reageer binnen 24 uur)**
- Actieve financiering aankondiging (binnen 7 dagen)
- Vacaturepost die expliciet uw productcategorie of concurrentiele gap vermeldt
- G2 competitor review (demo aanvraag, bewegende reviews, vervolgactiviteit)
- Leiderschapswisseling in doelrol (CTO, VP Eng, CMO)
- Bedrijfsnieuws over productpivot, expansie, of M&A (verworven of verwerving)

**Gemiddeld (Reageer binnen 1 week)**
- Content download van uw site of competitor's site
- Webinar bezoek (uw eigen of competitor events)
- Aanwervingen van 2+ rollen die capability gaps suggereren
- Tech stack verandering duiding modernisering initiatief
- Regelgevingsaankondiging die hun industrie treft

**Laag (Park voor toekomstige sequence)**
- Algemene vacaturepost (geen rol-specifiek pijnpunt)
- Kwartaal earnings vermelding van strategisch initiatief
- Peer adoptie (interessant maar niet directe intentie)
- Industrie trend (macro, niet bedrijfsspecifiek)
Score lage signalen en voeg toe aan een nurture sequence; herzieking als een hoger-score trigger verschijnt.

### De Trigger Message Formula

Uw openingsbericht moet exact drie elementen in deze volgorde bevatten:

1. **[Noem de specifieke trigger]** — Wees expliciet over wat je hebt waargenomen
   - ✓ "Ik zag uw Series B aankondiging vorige dinsdag"
   - ✗ "Ik merkte op dat je groeit"

2. **[Waarom het voor hen specifiek belangrijk is]** — Verbind de trigger met een concreet zakelijke impact
   - ✓ "Series B betekent meestal 2–3 nieuwe aanwervingsdoelen, en dat is waar onboarding friction snelheid doodt"
   - ✗ "Series B bedrijven moeten schalen"

3. **[Een vraag]** — Open-ended, geen ja/nee, die hen uitnodigt hun specifieke uitdaging te delen
   - ✓ "Wat is de grootste pijn bij onboarding van uw nieuwe medewerkers op dit moment?"
   - ✗ "Bent u geïnteresseerd in beter onboarden?"

**Voorbeeld formula in actie:**
> "Hallo [Naam], ik zag dat [Bedrijf] uw Series B heeft gesloten — gefeliciteerd. De meeste teams in uw positie worstelen met snel onboarden van nieuwe engineers, wat TTM vertraagt. Wat is voor u het knelpunt geweest?"

### Het opbouwen van uw Trigger Monitoring Stack

**Dagelijkse workflow:**
1. Elke ochtend run queries over uw bronnen (of set up Zapier/Make automaties om 's nachts uit te voeren)
2. Verzamel signalen in één intake document of CRM weergave
3. Score elk signaal (hoog/gemiddeld/laag)
4. Route hoog-score signalen naar uw dagelijkse outreach lijst
5. Voeg gemiddelde en lage signalen toe aan uw CRM met een vervolgdatum van 7–14 dagen

**Automatie patroon (Zapier/Make):**
- Trigger: "Nieuwe vacaturepost overeenkomend met sleutelwoorden [uw ICP]" OF "Financiering aankondiging voor [bedrijfslijst]" OF "G2 review gepost op [competitor]"
- Actie: Maak een nieuwe rij aan in uw CRM (Salesforce, HubSpot, Pipedrive) met signaaltype, score, datum, en link
- Frequentie: Dagelijks 8 AM uw tijd
- Kosten: ~$20–50/maand voor 3–5 trigger automatie

**Voorbeeld Zapier setup:**
1. LinkedIn vacaturepost trigger → Filter op sleutelwoorden ("aanwervingen," "engineer," "full-stack") + bedrijf ICP
2. Crunchbase financiering trigger → Voeg "Series A, B, C" filter toe
3. Actie: Maak/update deal aan in HubSpot met pipeline "Trigger Queue," set score tag
4. Melding: Slack dagelijkse digest van hoog-score signalen voor uw team

### Het 14-dag Verval Raam

**Kritieke regel: De meeste triggers verliezen relevantie na 14 dagen.**

- Een financiering aankondiging op Dag 1 is vers en urgent (budget wordt gealloceerd)
- Op Dag 14 zijn procurementcycli aangetrokken; op Dag 30 is het raam gesloten
- Vacatureposten pieken in relevantie tijdens weken 2–3 (actief werving, onvervulde posities = pijn)
- Leiderschapswisselingen hebben hoogste intentie op dagen 1–7; na 30 dagen zijn ze in hun rol opgesteld
- Regelgevingsaankondigingen hebben een langer raam (60–90 dagen) maar stapelen met andere signalen

**Implicaties:**
- Zit niet stil op hoog-score triggers. Outreach op dag 1 of 2
- Gemiddelde-score triggers kunnen 3–5 dagen wachten maar niet langer
- Na 14 dagen, move een signaal naar "nurture" (lagere cadence, voeg toe aan email sequence)
- Track response rates per trigger age; u ziet scherpe daling na dag 10–14

### Operationalisering: Van Signaal naar Sequence

1. **Identificeer** — Run uw dagelijkse bronnen, capture signaal
2. **Score** — Hoog/gemiddeld/laag framework hierboven
3. **Bericht** — Gebruik de trigger formula; personaliseer in 2 minuten
4. **Timing** — Hoog = vandaag, Gemiddeld = deze week, Laag = nurture
5. **Track** — Log trigger type, datum, score, en response in CRM voor voorspellend scoring
6. **Verval** — Archiveer of nurture na 14 dagen als geen response

### Trigger Message Templates per Categorie

**Bedrijfsgebeurtenissen:**
> "Ik zag [Bedrijf] [Naam] aangenomen als [Titel] vorige maand. Leiders in die rol reshape meestal de [function] stack. Wat is het mandaat van uw leiderschap geweest rond [thema]?"

**Gedragsignalen:**
> "Ik merkte op dat je onze '[Resource]' gids vorige week downloadde. De teams die het het meest gebruiken pakken [specifieke pijn] aan. Waar ben je het meest geblokkeerd op dit moment?"

**Tech Stack Wijzigingen:**
> "Ik zag [Bedrijf] [Tool] onlangs aan uw stack toevoegen. Veel teams doen dat wanneer [zakelijke reden]. Herbouwt u [systeem] deze cycle?"

**Externe Gebeurtenissen:**
> "Met [regulatie] die van kracht wordt in [tijdlijn], herzien teams als u [categorie] oplossingen. Wat is uw prioriteit—compliance of performance?"

## Voorbeeld

**Scenario:** U verkoopt developer onboarding automatisering aan engineering teams bij Series A/B startups.

**Vandaag's signaal intake:**

| Bedrijf | Trigger | Score | Bron | Vandaag's Bericht | Response |
|---------|---------|-------|--------|-----------------|----------|
| TechCorp Labs | Series B, $25M ronde (aangekondigd 2 dagen geleden) | Hoog | Crunchbase | "Gefeliciteerd met de Series B sluiting. De meeste teams in dit stadium huren 5–8 nieuwe engineers in het volgende kwartaal aan, wat onboarding breekt. Wat is uw huidige TTM voor een nieuwe medewerker?" | Lees (2u later): "Ha, we zitten op 6 weken. Eens dat het klote is." |
| Aurora Systems | VP Engineering aangenomen (LinkedIn post, 3 dagen geleden) | Hoog | LinkedIn | "Zag dat u [Naam] als VP Eng aannahm—sterke hire. Nieuwe leiders willen meestal TTM halveren. Kijkt u deze cycle naar onboarding tools?" | Lees (volgende dag): "Eigenlijk ja, we evalueren nu." |
| Vertex AI | 4 vacatureposten voor "Senior Backend Engineer" gepost in 7 dagen | Gemiddeld | LinkedIn vacaturezoeking + Crunchbase | "Ik zie dat u agressief voor backend aanwerft. Wanneer u het eng team zo snel schaalt, stapelen onboarding knelpunten op. Snelle vraag—hoe schaalt u onboarding processen om bij te houden?" | Nog geen response (park voor 5-dag vervolgactie) |
| Momentum Inc | Uw "Onboarding Metrics" gids gedownload (email getraceerd) | Gemiddeld | Email tracking | "Bedankt voor het downloaden van de metrics gids. De meeste teams vinden hun TTM 40% van de manier naar industrie best practice. Wat is uw baseline nu?" | Lees (dezelfde dag): "Rond 6 weken, kijken om in te korten naar 3" |
| Scale Ventures | Series A gesloten 8 weken geleden; geen recent signaal | Laag | CRM history | [Geen outreach vandaag; voeg toe aan nurture email sequence] | — |

**Resultaat van één ochtend's werk:** 2 hoog-score gesprekken dezelfde dag geopend, 1 gemiddeld verplaatst naar vervolgactie, 1 warm inbound gegenereerd uit email touch.

**Belangrijke observatie:** De VP Engineering hire en Series B aankondiging zetten de naald het snelst in beweging omdat ze vers besluitvormer + vers budget signaleren. De onboarding gids download was lagere snelheid maar gaf actieve evaluatie aan. Vacatureposten zijn lagging indicatoren (pijn bestond al; nu werven ze aan om het op te lossen).

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
