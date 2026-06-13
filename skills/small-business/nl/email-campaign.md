---
name: email-campaign
description: "E-mailmarketing voor kleine bedrijven: campagnestructuur, onderwerpregels, kopievarianten per segment, A/B-testsetup, herengangesequenties en prestatieanalyse"
---

# Email Campaign

## When to activate
- Plannen van een promotiecampagne en bereik van verschillende klantsegmenten met verschillende berichten nodig
- Uw e-mail-openpercentages liggen onder 20% en u wilt begrijpen waarom en repareren
- U hebt een lijst met inactieve abonnees en hebt een herengageringsvolgorde nodig voordat uw volgende campagne
- U wilt een A/B-test instellen, maar weet niet zeker wat u moet testen of hoe u resultaten moet lezen

## When NOT to use
- E-mailplatformconfiguratie, automatiseringsinstelling of sjabloonontwerp — gebruik uw ESP-documentatie (Klaviyo, Mailchimp, ActiveCampaign) daarvoor
- Lijstgroeitstrategie — deze vaardigheid verwerkt wat verzenden, niet hoe u de lijst groeit
- Transactionele e-mails (bestelbevestigingen, wachtwoordresets) — deze hebben verschillende nalevingsvereisten en horen in uw platforms flow builder

## Instructions

### Campaign planning

Voordat u één woord schrijft, definieert u de campagnestructuur. Zeg tegen Claude:
- De aanbieding of het nieuws dat u wilt communiceren (wees specifiek — « 20% korting op alle schoenen dit weekend » is bruikbaar; « we hebben een uitverkoop » niet)
- Uw lijstsegmenten (nieuwe abonnees, recente kopers, slapende klanten, VIP's, etc.)
- Het campagnedoel — één doel, niet drie (aankopen aansturen, afspraken boeken, RSVP's krijgen, nieuws aankondigen)
- Uw tijdlijn (lanceringsdatum, einddatum als het een uitverkoop is)
- Hoeveel e-mails u bereid bent voor deze campagne te verzenden (meeste kleine bedrijfscampagnes zijn 2-3 e-mails)

Claude bouwt de campagnekaart: welke e-mails naar welke segmenten, wat is de taak van elke e-mail, voorgestelde verzendtijden gebaseerd op publiekstype, en de logica van de sequentie (bijv. « e-mail 2 gaat alleen naar openers van e-mail 1, of naar iedereen? »).

---

### Subject lines

Onderwerpregels bepalen de openingsgraad meer dan enig ander factor. Zeg tegen Claude:
- De inhoud van de e-mail
- Het doelsegment
- Het campagnedoel
- Uw merktem (speels, direct, warm, professioneel)

Claude genereert 8 onderwerprigelopties over vier stijlen:
- 2 direct: gewoon verklaring van de aanbieding of het nieuws
- 2 nieuwsgierigheid-aangedreven: open een lus die de e-mail sluit
- 2 urgentie-gebaseerd: deadline of schaarste framing (gebruik deze alleen als de urgentie echt is)
- 2 voordeel-gericht: leid met wat de lezer wint

Claude markeert welke twee tot A/B testen. Meestal de meest eenvoudigste directe optie versus de sterkste nieuwsgierigheid of voordeeloption. Test twee vergelijkbare stijlen niet — test werkelijk verschillende benaderingen om iets nuttigs te leren.

Benchmarks: openingspercentages boven 20% zijn gezond voor meeste kleine bedrijven. Boven 28% is sterk. Onder 15% betekent dat uw onderwerpregels of afzenderreputatie werk nodig hebben. Als uw lijst niet langer dan 12 maanden geleden is opgeschoond, kunnen lage openingspercentages een bezorgdsheidsprobleem zijn, geen kopieprobleem.

---

### Email copy

Één e-mail, één taak. Zeg tegen Claude:
- De onderwerprijel die u hebt gekozen
- Het doelsegment en wat ze over u weten
- De aanbieding of het bericht
- De enkele call to action (een link of knop, niet drie)

Claude schrijft drie secties:

**Haak** — de eerste 1-2 zinnen van de e-mailhoofdtekst. Dit is wat in het voorbeeldvenster naast de onderwerprijel verschijnt. Het moet de klik verdienen. Claude schrijft het om het momentum van de onderwerprijel voort te zetten, niet het te herhalen.

**Lichaam** — 3-4 korte paragrafen. De meeste kleine bedrijfse-mails worden in minder dan 30 seconden gelezen. Claude schrijft voor scanners: korte paragrafen, concrete taal, geen opvulling.

**CTA** — één duidelijke actie met specifieke knop- of linktekst. « Koop de uitverkoop » is beter dan « Klik hier. » « Boek uw gratis gesprek » is beter dan « Meer informatie. »

Segmentvarianten: loyale klanten krijgen waarderingsframing (« U bent van het begin af bij ons, dus u krijgt vroege toegang... »). Nieuwe abonnees krijgen voordeel framing (« Dit is wat we hebben beloofd toen u zich aanmeldde... »). Slapende klanten krijgen eerlijke herengageringframing (« Het is een tijdje geleden. Dit is wat er is veranderd. »).

---

### A/B test setup

Zeg tegen Claude wat u wilt testen. Één variabele per test — onderwerprijel versus CTA in dezelfde test testen vertelt u niets.

Goede dingen om voor kleine bedrijfs e-maillijsten te testen:
- Onderwerprijel (meest impactvol, beïnvloedt openingsgraad)
- CTA-tekst (beïnvloedt klikgraad)
- E-maillengte — kort (150 woorden) versus medium (350 woorden)
- Verzendtijd — dinsdag ochtend versus donderdag namiddag

Claude schrijft beide varianten en zegt u: wat is het verschil tussen hen, welke metrie om te bekijken, welke steekproefomvang u nodig hebt om een betekenisvol resultaat te zien, en hoe lang u de test moet uitvoeren voordat u die leest.

Na de test: plak uw resultaten (Variant A open rate X%, Variant B open rate Y%, verzendgrootte Z). Claude zegt u wat de resultaten betekenen, of het verschil betekenisvol of ruis is, en wat volgende moet doen.

---

### Re-engagement sequences

Voor abonnees die 90 of meer dagen niet hebben geopend.

Zeg tegen Claude: uw lijstgrootte, hoeveel inactief zijn (90+ dagen geen open), wat u het laatst aan hen hebt verzonden, en wat uw bedrijf nu aanbiedt dat herenagagement waard is.

Claude schrijft een 3-e-mailsequentie:

**E-mail 1 — « Nog daar? »** Erkende het stilzwijgen, bied iets werkelijk nuttigs aan (een gratis resource, vroege toegang, een relevant update). Geen schuld, geen manipulatie.

**E-mail 2 — Waardeverinnering.** Waar ze zich aanmeldden en waarom het nog steeds de moeite waard is om op uw lijst te staan. Een concreet bewijs: een recent klantresultaat, een populair inhoudsstuk, een product dat ze mogelijk hebben gemist.

**E-mail 3 — Finaal uitschakelaanbod.** Eerlijk framing: « Als dit niet meer relevant is, geen probleem — meld u hieronder af. Als u wilt blijven, hoeft u niets te doen. » Dit is de zonsondergangstap.

Na de sequentie: zeg tegen Claude hoeveel opnieuw hebben ingeseeld (hebben geopend of op een van de 3 e-mails geklikt). Claude stelt het definitieve bericht op voor iedereen die niet — een schone uitschakellingsbevestiging. Verwijderen van inactieve abonnees verbetert bezorgdheid voor iedereen anders.

---

### Performance analysis

Na een campagne, plak uw statistieken: verzendgrootte, openingsgraad, klikgraad, uitschakelen, gegenereerde inkomsten (indien traceerbaar). Zeg tegen Claude wat u verwachte.

Claude zegt u:
- Of elke metrie boven of onder de benchmark voor uw industrie en lijstgrootte ligt
- Wat het patroon betekent (hoge open, lage klik = onderwerprijel werkt, maar e-mail niet leveren; lage open, hoge klik tussen openers = onderwerprijelproblem, geen kopieproblem)
- Één specifiek iets om in uw volgende campagne te veranderen op basis van de gegevens

---

### Prompt template — campaign

```
Gelieve een [X]-emailcampagne in te plannen.

Aanbieding: [specifieke aanbieding, met datums indien van toepassing]
Doel: [één doel]
Segmenten:
- [Segment 1]: [grootte, relatie met uw bedrijf]
- [Segment 2]: [grootte]

Tijdlijn: [lanceringsdatum] tot [einddatum]
Merktem: [speels/direct/warm/professioneel]

Gelieve me:
1. Campagnekaart geven (welke e-mail naar welk segment, in welke volgorde)
2. 8 onderwerprigelopties voor de eerste e-mail (2 direct, 2 nieuwsgierigheid, 2 urgentie, 2 voordeel)
3. Markeer welke 2 tot A/B testen
4. Eerste e-mailconcept voor [primair segment]
```

## Example

Een damesmodewinkel voert een 3-daagse zomeraankoop uit. De eigenaar zegt Claude de aanbieding (25% korting op alle zomerjurken), de lijst (2.400 totaal: 800 gekocht in afgelopen 60 dagen, 1.100 gekocht 61-180 dagen geleden, 500 inactief 180+ dagen) en het doel (aankopen rijden voor de uitverkoop eindigt zondag).

Claude bouwt:

Campagnekaart: E-mail 1 (donderdag, volledige lijst) — aankoop-aankondiging, alle segmenten. E-mail 2 (vrijdag, openers van e-mail 1 alleen) — best-sellers met sociaal bewijs gehoekt. E-mail 3 (zondagochtend, niet-kopers die een van beide e-mails hebben geopend) — laatste kans, einde-dag urgentie.

Onderwerpregels voor E-mail 1 (direct): « 25% korting op zomerjurken — dit weekend alleen. » (Nieuwsgierigheid): « Uw kast mist iets. » (Urgentie): « 3 dagen. 25% korting. Geen code nodig. » (Voordeel): « De jurk waar u op hebt gehoopt is zojuist goedkoper geworden. »

A/B-testaanbeveling: « 25% korting op zomerjurken — dit weekend alleen » versus « De jurk waar u op hebt gehoopt is zojuist goedkoper geworden » — direct framing versus voordeel framing.

Resultaten na het uitvoeren van de campagne: 31% openingsgraad op e-mail 1, 8,2% klikgraad, $4.100 in getraceerde inkomsten naar campagne. Vorige campagnes gemiddeld 19% open en 4,1% klik. Claude-analyse: de onderwerprijel met voordeel framing overtrof de directe versie met 4 procentpunten in openingsgraad — gebruik voordeel framing als standaard voor promotiecampagnes vooruit.

---
