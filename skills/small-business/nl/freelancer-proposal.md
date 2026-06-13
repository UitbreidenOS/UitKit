---
name: freelancer-proposal
description: "Zzelfstandige toolkit: projectvoorstellen, prijsrichtlijnen, vervolgvolgsequenties, eenvoudige projectcontracten en dokumten voor afbouw van klanten"
---

# Freelancer Proposal

## When to activate
- Een prospect heeft om een voorstel gevraagd en u moet er vandaag een uit krijgen
- U bent onzeker hoe u een project moet prijzen — uur tegen vast, welk tarief, hoeveel buffer
- Een klantfactuur is achterstallig en u moet navolggen zonder de relatie te beschadigen
- U beëindigt een project en hebt een schone leverings- en afsluitingsprocedure nodig

## When NOT to use
- Formele juridische contracten voor hoge waarde of hoog risico engagementen — zorg dat alles boven $25K of met ongebruikelijke IP-voorwaarden door een advocaat wordt herzien
- Belasting- of financieel advies — gebruik een accountant voor driemaandelijkse schattingen, aftrekken en bedrijfsstructuur
- Geautomatiseerde facturering of betalingsverwerking — gebruik FreshBooks, Wave of QuickBooks daarvoor

## Instructions

### Proposals (90 seconds)

Zeg Claude:
- Wat de klant wil bereiken — in hun woorden als u ze hebt
- Uw begrip van de werkingsomvang: wat u zult leveren, wat niet in bereik is
- Uw tarief (uurloon of op project gebaseerd) en tijdschatting
- Alle bekende beperkingen: hun deadline, hun budgetbereik als ze hebben gedeeld, alle technische of logistieke grenzen

Claude schrijft een compleet voorstelldocument:

**Samenvatting** — 2-3 zinnen die hun probleem en uw oplossing heraffirmeren. Geschreven uit hun perspectief, niet het uwe. Begint met hun doel, niet uw referenties.

**Werkingsomvang** — wat expliciet is opgenomen (leverables, herzieningen ronde, vergaderingen, formaten). Dan: wat expliciet niet is opgenomen. Deze sectie voorkomt Scope Creep meer dan enig contractbepaald. Claude is streng op de « niet opgenomen »-lijst.

**Tijdlijnt** — fasen met geschatte voltooiingsdatums, op basis van uw schatting. Claude markeert afhankelijkheden: « Fase 2 begint nadat de klant de fase 1 leverables heeft goedgekeurd » — dus vertragingen aan hun kant drukken uw tijdlijnt niet samen.

**Investering** — uw prijs, betalingsschema en wat elke betaling triggert. Voor vaste kosten projecten voegt Claude een buffer van 20% toe aan uw ruwe schatting en laat u zien hoe u het netjes aan de klant presenteert.

**Volgende stappen** — één duidelijke actie voor de klant om te nemen (ondertekenen, antwoorden om te bevestigen, storting betalen).

---

### Pricing guidance

Zeg Claude:
- Het type project (logo-ontwerp, website-bouw, marketing strategie, boekhouding, copywriting, etc.)
- Uw doeluurloon
- Uw geschatte uren voor dit project
- Uw markt (VS, VK, EU, etc.) en uw ervaringsniveau (1-3 jaar, 5+ jaar, specialist)
- Heeft de klant een aangegeven budget?

Claude berekent uw projecttarief, controleert of het aansluit met marktbenchmarks voor uw categorie en beveelt aan of u voor dit type werk per uur of vast moet citeren.

Wanneer vast aan te bieden: projecten met duidelijke leverables en gedefinieerde omvang. Wanneer uur aan te bieden: advies, strategie of alles waar de omvang verkennend is.

De 20% bufferregel: Claude voegt het toe aan uw ruwe schatting bij het genereren van vaste prijs en legt uit hoe u het klanten presenteert die een uitsplitsing vragen. Het kader is: dit verantwoordelijkheden revisiecycli, overhead van klantcommunicatie en technische onbekenden. De meeste klanten accepteren het als het wordt uitgelegd.

---

### Invoice follow-up

Zeg Claude:
- Het factuurbedrag en vervaldatum
- Hoeveel dagen achterstallig het is
- Uw relatie met deze klant (lange termijn vs. eerste project, vriendelijk vs. professionele afstand)
- Welke communicatie al heeft plaatsgehad (hebt u de factuur verzonden? eventuele reacties?)

Claude stelt het vervolgbericht op dat geschikt is voor de fase. Driestapts escalatie:

**Fase 1 — 3 dagen achterstallig:** Vriendelijk, gaat ervan uit dat het een fout is. Geen vermelding van late fees. « Gewoon controleren dat dit niet in uw inbox verloren is gegaan. »

**Fase 2 — 14 dagen achterstallig:** Direct. Verwijzingen naar de oorspronkelijke factuur. Merkt uw beleid voor late fees op als u er een hebt. Stelt een specifieke betaaldatum voor. Nog steeds professioneel, niet bedreigend.

**Fase 3 — 30 dagen achterstallig:** Definitieve kennisgeving. Duidelijke verklaring van volgende stappen als betaling niet tegen een specifieke datum wordt ontvangen. Als u late fees in uw contract hebt, is dit bericht van toepassing. Toon: feitelijk, niet emotioneel.

---

### Project contracts

Zeg Claude:
- Werktype en leverables
- Projectduur en betalingsschema (storting + mijlpalen, of storting + definitief)
- Uw herzieningsbeleid (hoeveel ronden zijn inbegrepen voordat aanvullende kosten in rekening worden gebracht)
- IP-eigendom: bezit de klant het werk na uiteindelijke betaling, of behoudt u iets?
- Kill fee: wat u in rekening brengt als de klant halverwege het project annuleert (typisch 25-50% van het resterende saldo)
- Uw jurisdictie (staat of land, voor de bepaald regelgeving)

Claude produceert een project overeenkomst in gewone taal. Geen juridisch jargon — volledige zinnen die beide partijen werkelijk begrijpen. Dekt: omvang, tijdschema, betaling, revisies, IP-overdracht, kill fee, wat er gebeurt als een van de partijen een pauze nodig heeft, en basisgeschillenregeling.

Dit is een startpunt, geen juridisch advies. Voor contracten boven $25K, complexe IP-situaties of elke klant in een ander rechtsgebied, zorg dat een advocaat het herziet.

---

### Client offboarding

Zeg Claude:
- Projectnaam en wat is afgeleverd
- Elke lopende relatie (retainer, ondersteuningsperiode, verwijzingsregeling)
- Wilt u om een testimonium of referentie vragen?

Claude produceert een schoon offboarding-pakket:
- Afleverings-e-mail met handuitsamenvatting — wat is afgeleverd, waar bestanden staan, alle referenties of toegang in overdracht
- Slotfactuur (als niet al verzonden)
- Sprachsoort ondersteuningsaanbieding van 30 dagen (als u er een wilt opnemen)
- Testimoniumverzoek — een specifiek, laagwrijvings verzoek dat de klant precies vertelt wat u hem wilt spreken

---

### Prompt template — proposal

```
Schrijf alstublieft een klantvoorstel.

Klantdoel: [wat ze willen bereiken]
Werkingsomvang:
- Opgenomen: [leverables, herzieningen ronde, vergaderingen]
- Niet opgenomen: [expliciet buiten bereik]

Mijn tarief: $[X] [uurloon/op project gebaseerd]
Tijdschatting: [X] weken
Betalingsvoorwaarden: [storting % + mijlsteenstructuur]
Deadline: [klant aangegeven deadline, indien van toepassing]

Gelieve een buffer van 20% in de vaste prijs op te nemen en laat me zien hoe ik het presenteer.
Schrijf in een [professionele/warme/directe] toon.
```

## Example

Een webontwerper ontvangt een vaag onderzoek: « Kunt u ons een website bouwen? Budget rond $5K. »

De designer zegt Claude: de klant is een lokale boekhoudkundige die een 5-pagina site met contactformulier nodig heeft, hun huidige merkingactiva bestaan (logo, kleuren), ze willen starten voor het belastingseizoen, en de ontwerper schat 40 uur werk op $120/uur.

Claude produceert:

Ruwe schatting: 40 uur x $120 = $4.800. Met 20% buffer: $5.760. Claude rondt af naar $6.200 en concepten de presentatie: « Dit project wordt aangeboden voor vast bedrag van $6.200. Dit omvat tot twee herzoeningsrondes op elke pagina, alle mobiele optimalisatie en een 30-daags ondersteunguenstersvenster na lancering. Het omvat geen copywriting, fotografie of lopende hosting — deze kunnen indien nodig worden toegevoegd. »

De werkingsomvang omvat precies: 5 pagina's (Home, Over, Services, FAQ, Contact), contactformulier met e-mailmelding, basale SEO-setup op pagina, mobiel-responsive design, 2 herzoeningsrondes per pagina.

Niet opgenomen: aangepaste illustraties, blog of content management systeem, Google Ads-instelling, integreatie van sociale media voorbij icoonkoppeling, domeinkaloop of hosting-opstellling.

Tijdlijn: 4 weken vanaf contractondertekening en stortingsontvangst.

---
