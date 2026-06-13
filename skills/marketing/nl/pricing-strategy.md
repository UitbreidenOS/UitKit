---
name: pricing-strategy
description: "Prijsstrategie: modelanalyse (op waarde gebaseerd, kostprijs-plus, competitief), tier-ontwerp, freemium vs. proefversie, prijsstijgingsbenadering, onderzoek naar betalingsbereidheid"
---

# Prijsstrategie-vaardigheid

## Wanneer activeren
- Prijsstelling instellen voor een nieuw product of service
- Kiezen tussen prijsmodellen (abonnement, op gebruik gebaseerd, eenmalig, freemium)
- Ontwerpen van prijsniveaus (hoeveel, wat is inbegrepen, hoe onderscheiden)
- Verhogen van prijzen voor bestaande klanten
- Een onderzoek naar betalingsbereidheid uitvoeren

## Wanneer NIET gebruiken
- Prijzen voor gereglementeerde producten — vereist compliance beoordeling
- Onderhandelingen over aangepaste Enterprise-prijzen — ander proces
- Financiële modellering voor investeerders — gebruik de financiële-plan vaardigheid

## Instructies

### Kies een prijsmodel

```
Help me het juiste prijsmodel voor mijn product te kiezen.

Product: [beschrijf — software / service / fysiek product / marktplaats]
Klanten: [wie koopt, bedrijfsgrootte, budgetbereik]
Hoe ze het gebruiken: [frequentie, volume, intensiteit]
Onze kostenstructuur: [ongeveer — hoge of lage vaste kosten? Variabel per klant?]
Concurrentiemodellen: [wat berekenen ze en hoe]

Evalueer deze modellen voor mijn situatie:
1. Vast tarief (enkele prijs) — eenvoudig, voorspelbaar, goed voor eenvoudige producten
2. Gestaffelde abonnementen — goed, beter en beste, meest voorkomende SaaS-model
3. Op gebruik gebaseerd / gemeten — berekening per API-aanroep, zetel, transactie, GB
4. Freemium — gratis permanent niveau + betaald voor meer functies/limieten
5. Gratis proefperiode — volledige toegang voor X dagen, vervolgens betalen
6. Per zetel — prijzen per gebruiker, goed voor teamtools
7. Op waarde gebaseerd — prijs verankerd in klant-ROI (ideaal maar moeilijk af te dwingen)
8. Eenmalige betaling — goed voor tools zonder doorlopende waarde, doelgroepen die abonnementen haten

Aanbeveling: welke modellen passen bij mijn product en waarom?
```

### Ontwerp prisniveaus

```
Ontwerp prijsniveaus voor [product].

Doel: [conversie maximaliseren / inkomsten maximaliseren / opschalen]
Klantsegmenten die ik wil bedienen: [beschrijf elk — bijv. eenmanszaak / klein team / onderneming]
Belangrijkste waarde drivers: [welke functies/limieten klanten het meest interesseren]
Concurrentie prijzen: [wat anderen berekenen, indien bekend]

Ontwerp 3 niveaus:
- Niveau 1 (invoer / zelf-service): limieten, functies, prijs, doelklant
- Niveau 2 (midden / meest populair): limieten, functies, prijs, doelklant
- Niveau 3 (pro / teams): limieten, functies, prijs, doelklant

Optioneel: Niveau 0 (gratis) en Niveau 4 (onderneming / aangepast)

Regels voor goed tier-ontwerp:
- Elk niveau zou duidelijk het waard moeten voelen om naar te upgraden
- Plaats 1-2 functies die mensen echt willen achter betaalde gates
- Het meest populaire niveau moet in het midden staan (lokaas prijzen)
- Jaarlijks versus maandelijks: hoeveel % korting bieden voor jaarlijks?
```

### Freemium vs. gratis proefversie

```
Moet ik freemium of een gratis proefversie gebruiken?

Mijn product: [beschrijf]
Tijd tot waarde: [hoe lang tot gebruikers betekenisvolle waarde krijgen?]
Gebruikersverwerving: [inbound / betaald / mond-tot-mond]
Doelmarkt: [KMO zelf-service / onderneming / consument]
Conversiestreven: [X% proef-naar-betaald doel]

Freemium voor- en nadelen voor mijn situatie:
- Voordeel: lagere wrijving, viral/mond-tot-mond, bouwt gebruikersbasis
- Nadeel: hoge ondersteuningskosten voor niet-betalende gebruikers, onduidelijke upgrade-motivatie

Gratis proefversie voor- en nadelen voor mijn situatie:
- Voordeel: duidelijke urgentie, vangt gecommitteerde gebruikers, eenvoudiger product
- Nadeel: wrijving bij inschrijving, gebruiker moet voor deadline handelen

Aanbeveling + de sleutelvariabele die de beslissing voor mijn geval bepaalt.
```

### Prijsstijgingsstrategie

```
Ik wil prijzen verhogen. Help me dit zonder klantenverlies te doen.

Huidige prijzen: $[X]/maand
Voorgestelde prijzen: $[X]/maand (verhoging: [X]%)
Reden: [waarde geleverd, inflatie, marktherpositionering]
Klantenbestand: [X] klanten, gemiddelde ambt [X] maanden

Ontwerp het rollout:
1. Wie krijgt ouderrecht (bestaande klanten houden oude prijs hoe lang?)
2. Wie eerst migreren (nieuwe klanten onmiddellijk, bestaande na X maanden?)
3. Communicatievolgorde (wanneer melding, wat zeggen, wie ondertekent de e-mail)
4. Bezwaren behandelen (wat zeggen tegen "uw concurrent is goedkoper")
5. Verwachte churn-rate en inkomsten impact model
6. Concept van prijsverhogings-e-mail

Historische benchmark: goed uitgevoerde SaaS-prijsstijgingen zien 2-8% churn, netto positieve inkomsten.
```

### Onderzoek naar betalingsbereidheid

```
Ontwerp een onderzoeks proces naar betalingsbereidheid voor [product].

Doelsegment: [wie interviewen/enquêteren]
Prijsbereik dat ik overweeg: $[X] tot $[X]

Onderzoeksmethoden (in volgorde van inspanning):
1. Van Westendorp-prijsgevoeligheidsmeter (4-vragenenquête):
   - Bij welke prijs is dit te goedkoop om te vertrouwen?
   - Bij welke prijs is dit een koopje?
   - Bij welke prijs is dit duur maar zou je het toch kopen?
   - Bij welke prijs is dit te duur?

2. Klantinterviews (5-10 bestaande of potentiële klanten):
   - Wat betaal je momenteel voor alternatieven?
   - Welk rendement krijg je uit het oplossen van dit probleem?
   - Loop me door je aankoopproces voor tools zoals deze

3. Prijspagina A/B-test:
   - Verdeel verkeer over verschillende prijspunten
   - Meet conversie en churn tegen elk prijspunt

Ontwerp de Van Westendorp-enquête en interviewscript voor mijn product.
```

## Voorbeeld

**Gebruiker:** Ik heb een SaaS-tool voor $29/maand vast bedrag. Opbrengsten gaan goed maar ik verdenk dat ik geld op tafel laat liggen. Wat moet ik doen?

**Claude analyse:**

Vast tarief tegen $29 is klassieke early-stage eenvoud — slim voor validatie, beperkend voor schaal.

**Het probleem:** $29 vangt dezelfde prijs van een freelancer die uw tool 2 uur/week gebruikt en een team van 10 personen dat het hele dag gebruikt. Je ondermonetiseert het segment met hoge waarde.

**Aanbevolen zet: herstructurering met 3 niveaus**

| Niveau | Prijs | Voor | Sleutellimits |
|---|---|---|---|
| Solo | $29/mnd | Freelancers, zelfstandigen | 1 gebruiker, 100 items |
| Team | $79/mnd | Kleine teams | 5 gebruikers, 1.000 items |
| Zakelijk | $199/mnd | Groeiende bedrijven | 20 gebruikers, onbeperkt |

**Migrationsstrategie voor bestaande $29-klanten:**
- Ouderrecht tegen $29 voor 12 maanden (loyaliteitsbeloning)
- Na 12 maanden: uitnodigen om nieuw niveau te kiezen op basis van gebruik
- Niet verontschuldigen — waardestijging uitleggen

**Geprojecteerde impact:** Als 20% van bestaande klanten upgraden naar Team ($79) en 5% naar Business ($199), stijgt maandelijkse inkomsten ~35% met hetzelfde aantal klanten.

---
