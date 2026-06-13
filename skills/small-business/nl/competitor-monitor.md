---
name: competitor-monitor
description: "Wekelijkse concurrentiële inteligenties: volgen van prijsveranderingen, positioneringsveranderingen, nieuws en vacatures als signalen — synthetiseerd in een eenpagina samenvatting"
---

# Competitor Monitor

## When to activate
- U voert een wekelijkse of tweewekelijkse concurrentiële review uit en u wilt ruwe bevindingen omzetten in duidelijke signalen
- Een concurrent heeft zojuist een grote aankondiging gedaan en u moet begrijpen wat het voor uw bedrijf betekent
- U bereidt een prijsverandering voor en u wilt weten hoe u gepositioneerd bent voordat u beweegt
- U verliest deals en u vermoedt dat een specifieke concurrent de reden is

## When NOT to use
- Diepte concurrentiële research voor een fundraising deck — dat vereist professioneel marktonderzoek
- Juridische of IP-monitoring — gebruik een specialist voor merk-/octrooibewaking
- Geautomatiseerde real-time tracking — deze vaardigheid vereist dat u de wekelijkse controle uitvoert; het synthetiseert wat u vindt, het schraapt niet automatisch

## Instructions

### Set up your competitor list

Houd het op 3-5 concurrenten. Meer dan dat produceert lawaai, geen signaal. Geef Claude voor elk:
- Hun naam en website
- Hun hoofdproduct of service en hoe het overlapt met het uwe
- Hun openbare prijzen (indien beschikbaar) — tiernamen, prijspunten, wat elke tier omvat
- Waar ze om bekend staan — hun belangrijkste differentiator of marketing hoek
- Elk recent nieuws dat u al over hen weet

Doe dit eenmaal. Sla het op als uw concurrentiële contextblok en plak het aan het begin van elke wekelijkse sessie.

### Build your weekly checklist

Vraag Claude om een 15-20 minuten wekelijkse checklist voor uw specifieke concurrentiële set te genereren. Claude past het aan uw industrie aan — een SaaS-concurrentiële checklist verschilt van een restaurant-concurrentiële checklist.

De standaard checklist omvat: prijspagina (is iets veranderd?), productchangelog of blog (nieuwe functies of updates?), jobboard (welke rollen stellen zij in?), review-sites (nieuwe reviews, ratingtrend?), LinkedIn en nieuws (aankondigingen?), en uw eigen verkoopgegevens (verwijst een verloren deal naar deze concurrent?).

U doet de controle. Het duurt 5 minuten per concurrent. Dan plakt u de bevindingen.

### Weekly digest

Plak uw bevindingen uit de checklist. Claude synthetiseert ze in een gestructureerde eenpagina samenvatting:

**Wat is deze week veranderd** — feitelijk overzicht van iets anders dan vorige week

**Wat het signaleert** — Claude interpreteert elke verandering. Een prijsdaling kan signaleren dat ze onder druk staan, niet dat ze winnen. Een instelingsgolf in een bepaalde functie signaleert waar ze volgende investeren. Nieuwe negatieve reviews signaleren support- of kwaliteitsproblemen die u in verkoopgesprekken kunt gebruiken.

**Aanbevolen actie** — één concreet ding dat u zou moeten doen, indien van toepassing. Vaak is het antwoord « controleren — nog geen actie nodig. » Claude creëert geen urgentie.

### Job posting signals

Vacatures zijn een van de meest betrouwbare openbare signalen voor concurrentiële strategie. Claude leest vacatures en vertelt u wat ze betekenen:

- Engineeringsuren in een specifiek gebied: zij bouwen een functie die zij nog niet hebben
- Verkoopurenuren in een specifieke regio: zij breiden daar uit
- Klantsuccesurenuren: zij groeien of zijn aan het verloop — hangt af van context
- C-suite vervangingen: leiderschapsinstabiliteit
- Data- en analyseuururen: zij gaan gegevensgeleide beslissingen nemen, mogelijk prijs gerelateerd

Plak de vacaturetitel en beschrijving. Claude interpreteert het in de context van wat u al over hen weet.

### Pricing change response

Als een concurrent zijn prijs verlaagt, vertel Claude:
- De verandering (oude prijs, nieuwe prijs, welke tier)
- Uw huidige prijzen ten opzichte van de hunne
- Uw win/verlies situatie in recente deals

Claude concept talkingpoints voor uw verkoopgesprekken — geen paniekrespons, maar een rustig, feitelijk antwoord op de vraag « waarom bent u $50 duurder? » die benadrukt op de specifieke dingen die u beter doet.

### Lost deal debrief

Na het verliezen van een deal aan een concurrent, vertel Claude:
- Wat de klant zei was de reden
- Wat u weet over de pitch van uw concurrent
- De dealgrootte en klantenprofiel

Claude identificeert of dit een patroon of uitbijter is en stelt voor of een prijs-, messaging- of productrespons gerechtvaardigd is.

---

### Prompt template

```
Hier is mijn concurrentiële context (maandelijks bijwerken):

Concurrent A: [naam]
- Website: [url]
- Hoofdproduct: [beschrijving]
- Prijzen: [tiers en prijzen]
- Bekend om: [differentiator]

[herhaal voor elke concurrent]

---

Bevindingen van deze week:

Concurrent A:
- [Wat ik op hun prijspagina heb gevonden]
- [Wat ik op hun jobboard heb gevonden]
- [Eventuele nieuws of aankondigingen]
- [Nieuwe reviews of ratingveranderingen]

Concurrent B:
- [bevindingen]

Geef me alstublieft:
1. Wat is deze week veranderd (feitelijk)
2. Wat elke verandering signaleert
3. Één aanbevolen actie, indien van toepassing
```

## Example

U exploiteert een B2B-planningstware bedrijf. U plakt uw wekelijkse bevindingen:

- Concurrent A verlaagde hun Starter-abonnement van $79 naar $49 per maand
- Concurrent B plaatste deze week drie « Gegevensingenieur » rollen op LinkedIn
- Concurrent C ontving deze week 4 nieuwe 1-sterbeoordelingen, allemaal aanhaaldend voor trage ondersteuningsresponstijden

Claude produceert:

Wat is veranderd: Concurrent A verlaagde de starter-prijzen met 38%. Concurrent B bouwt actief interne gegevensinfrastructuur. Concurrent C heeft deze week een zichtbaar ondersteuningskwaliteitsprobleem (4 nieuwe 1-sterbeoordelingen in 7 dagen zijn ongebruikelijk geconcentreerd).

Wat het signaleert: De prijsdaling van Concurrent A weerspiegelt waarschijnlijk druk op hun inlaagverwervingsgetallen, niet sterkte — bedrijven met groeiende omzetverhoging of handhaving van prijzen meestal. Dit is een kans om uw prijzen als premium met sneller onboarding in te kaderen. Concurrent B die interne gegevensengineering bouwt, suggereert dat zij een afhankelijkheid van integratie van derden verminderen — het loont om te volgen welke integratie zij vervangen. De ondersteuningscluster van Concurrent C is een verkoopbezit: vermeld uw SLA en gemiddelde responstijd in uw volgende drie aanbiedingen.

Aanbevolen actie: Werk uw sales one-pager bij om een vergelijking van responstijden toe te voegen. Als een prospect de nieuwe prijs van $49 van Concurrent A aanhaalt, gebruik dit script: « Hun Starter-abonnement op $49 omvat [X beperking]. Ons basisplan op $89 omvat [Y en Z] en een bediend onboarding-gesprek — de meeste klanten heffen dit $40-verschil in de eerste week in. »

---
