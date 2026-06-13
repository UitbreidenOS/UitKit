---
name: real-estate-listing
description: "Onroerendgoedmakelaartoolkit: MLS-aanbiedingsbeschrijvingen, CMA-samenvattingen, vervolgmails, kopersvoeding sequenties en social media-berichten — allemaal Fair Housing-conform"
---

# Real Estate Listing

## When to activate
- Een nieuw pand komt op de markt en u hebt MLS-kopie plus marketingmaterialen nodig
- U presenteert een CMA aan een verkoper en hebt een schone geschreven vertelling nodig om de cijfers te begeleiden
- Een vertoning is gebeurd en u hebt snel een persoonlijke vervolgmail nodig
- Een leadpagina is stil geworden en u hebt een hernieuwd betrokkenheidsberichten die niet dwingend voelt

## When NOT to use
- Vaststellingsdocumenten of juridische documenten — gebruik uw makelaar-goedgekeurde formulieren en een onroerendgoedadvocaat
- Geautomatiseerde lead-scoring of CRM-workflow — gebruik de ingebouwde tools van uw CRM
- Onroerendgoedschattingen die u als formele waarderingen zult vertegenwoordigen — alleen gelicentieerde taxateurs kunnen deze produceren

## Instructions

### MLS listing descriptions

Geef Claude:
- Adres en basisgegevens: slaapkamers, badkamers, vierkante voeten, lotigrootte, bouwjaar, garage
- Top 5 functies om te benadrukken (wees specifiek — « oorspronkelijke hardhouten vloeren geslepen in 2023 » slaat « mooie vloeren »)
- Buurcontext: wat maakt de locatie waardevol zonder naar scholen, demografie of dichtstbijzijnde religieuze instellingen te verwijzen
- Uw prijs en doelkopersprofiel (beschrijf in lifestyle- of levensfase-termen, niet door kenmerken van beschermde klasse)
- Tekenlimit voor uw MLS-systeem, indien van toepassing

Claude schrijft twee versies: een tekengelimiteerde MLS-beschrijving (meestal 250-500 tekens of 150-250 woorden afhankelijk van uw MLS) en uitgebreide marketingkopie voor uw website, e-mail en sociale media.

Fair Housing compliance: Claude zal geen taal bevatten die de voorkeur voor of tegen koppers of huurders opgeeft op basis van ras, kleur, nationale afkomst, religie, geslacht, familiestatus of handicap. Dit omvat indirecte taal — het vermelden van nabijheid van specifieke religieuze instellingen, buurtdemografie beschrijven of schoolnamen op manieren gebruiken die het kopersprofiel signaleren. Claude zal dergelijke taal vervangen door conforme alternatieven. U bent altijd verantwoordelijk voor eindcontrole voordat u publiceert.

---

### CMA narrative

Plak uw vergelijkbare verkoopgegevens: voor elke comp, adres (of anoniem als « Comp 1 ») opnemen, vierkante voeten, verkoopprijs, dagen op markt, lijstprijs en verkoopdatum.

Zeg Claude:
- De sleutelfei van de onderwerpgoed
- Alle aanpassingen die u hebt gemaakt (toestand, updates, lotprijs, etc.)
- Uw aanbevolen prijsniveaubereik

Claude schrijft een 3-paragraaf CMA-verhaal klaar om aan een verkoper te presenteren:
- Alinea 1: Wat er op dit moment op de markt gebeurt (absorptietarief, prijstrend)
- Alinea 2: Wat de vergelijkbare verkopen ons vertellen, met uw aanpassingsrationale
- Alinea 3: Uw aanbevolen prijsbereik en de redenering

De vertelling is professioneel en duidelijk — ontworpen om hardop te lezen of met de verkoper als een meeneembare te achterlaten.

---

### Showing follow-ups

Na een vertoning zegt u tegen Claude:
- Kopersprofiel: eerstekeerskoper, opkomende koper, belegger of downsizing — en hun tijdlijn
- Wat ze zeiden dat ze leuk vonden aan het pand
- Wat ze zeiden dat ze zich zorgen maakten of onzeker over
- Of ze andere eigendommen hebben gezien die met deze concurreren

Claude concepten een persoonlijke e-mail die:
- Opent door iets spécifieks te refereren wat ze tijdens de vertoning zeiden
- Rechtstreeks een van hun bezorgdheid aanpakt met een feit of hulpbron
- Geeft relevante marktcontexten (indien nuttig)
- Stelt een zachte volgende stap voor — niet « bent u klaar om een ​​aanbod te doen? » maar iets minder wrijvings als « ik kan HOA-documenten trekken als u deze wilt beoordelen »

Voor koppers die niet meer antwoorden: Claude concept een check-in-bericht dat hun tijdlijn erkent, iets nuttigs aanbiedt en niet onder druk zet.

---

### Lead nurturing sequences

Voor koppers die 3-6 maanden weg zijn van aankoop, houdt u een 4-touch e-mailreeks relevant zonder opdringerig te zijn.

Zeg Claude: kopersprofiel, prijsbereik, eigendomstype, gewenst gebied en hun aangegeven tijdlijn.

Claude bouwt:
- Touch 1 (week 1): een marktupdate relevant voor hun specifieke zoeken — niet een generieke nieuwsbrief
- Touch 2 (week 3): een relevant nieuw aanbod of onlangs verkochte eigendom met een opmerking over wat het hen vertelt
- Touch 3 (week 6): een educatief stuk — één specifiek ding over het koopproces in uw markt dat hun situatie beïnvloedt
- Touch 4 (week 10): een zachte hernuwde betrokkenheid — « gewoon controleren op uw tijdlijn, geen druk » — met één vers stuk informatie

---

### Social media

Zeg Claude: de top 3 functies van het pand, doelkoperlevensstijl, uw persoonlijke merktem (professioneel, warm, energiek, plaatselijke expert) en welk platform.

Claude schrijft platformgeschikte berichten:
- Instagram: visueel-eerste onderschrift, haken in de eerste regel, locatiehashtags, eindigt met een vraag of CTA
- Facebook: iets langer, communitygerichte framing, werkt met of zonder de tekendruk van Instagram
- LinkedIn: gebruikt voor investeringseigendommen of commerciële aanbiedingen — professioneel, ROI-georiënteerd framing

---

### Prompt template — MLS description

```
Schrijf alstublieft een MLS-aanbiedingsbeschrijving. Fair Housing-conform.

Eigenschapgegevens:
- Adres: [stad en staat alleen, of omitting]
- Slaapkamers/badkamers: [X] slaapkamer / [X] badkamer
- Vierkante voeten: [X] sq ft, lot [X] sq ft
- Bouwjaar: [X]
- Garage: [ja/nee, aangebouwd/los, spaties]

Top-functies om te benadrukken:
1. [specifieke functie + alle relevante details]
2. [specifieke functie]
3. [specifieke functie]
4. [specifieke functie]
5. [specifieke functie]

Buurnoten (geen scholen, geen demografie, geen religieuze instellingen):
[beloopbaar, dicht bij winkels, stille straat, bergzicht, etc.]

Prijs: $[X]
Doelkoperlevensstijl: [beschrijf in levensstufen — bijv., « koperszoeken naar een slot-en-gaan-huis dicht bij downtown dining »]
MLS-tekenlimit: [X woorden of tekens, of « geen limiet »]

Schrijf alstublieft:
1. MLS-conforme korte beschrijving ([X] woorden)
2. Uitgebreide marketingkopie voor website (300-400 woorden)
```

## Example

U zegt: « 3BR/2BA craftsman bungalow in Oak Park, 1.850 sq ft, volledig bijgewerkte keuken met kwartscounterstops en nieuwe apparaten in 2024, originele 1928 karakterdetails, los garage, beloopbare buurt met koffieshops en boetiekjes binnen twee blokken, $485K, gericht op kopersdie karakter en beloopbaarheid willen boven een cookie-cutter buitenwijk. »

Claude schrijft de MLS-beschrijving en uitgebreide marketingkopie. Het omvat « twee blokken van lokale koffieshops en boetiekjes » en « beloopbare buurt » en sluit verwijzing naar de nabijgelegen basisschool uit (die u in voorbijgaan hebt genoemd). Claude markeert dit in een notitie: « Ik heb de schoolreferentie voor Fair Housing compliance verwijderd — vervangen door « beloopbare buurt met lokale winkels » om de levensstijlcontext te behouden zonder het kopersprofiel in te sinueren. »

MLS-beschrijving: 148 woorden. Uitgebreide versie: 340 woorden met kopal, drie functie-voordeel-aanbiedingen en een buurtalinea.

---
