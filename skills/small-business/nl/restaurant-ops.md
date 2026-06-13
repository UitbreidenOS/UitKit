---
name: restaurant-ops
description: "Restaurantbedrijf: menukopie, voedselkostenanalyse, voorrraadprognose, beoordelingresponsen, seizoensspecialiteiten, instellingsposten en trainingsdocumentatie"
---

# Restaurant Operations

## When to activate
- Menubeschrijvingen schrijven of herschrijven, een nieuw gerecht noemen of een seizoensmenu lanceren
- Uw voedselkostenpercentage is hoger dan verwacht en u moet erachter zien te komen waar de winst lekt
- U hebt een stapel Google- of Yelp-beoordelingen om te beantwoorden en u wilt dat elk antwoord persoonlijk is
- Werving voor een druk seizoen en u hebt instellingsposten en een trainingsdocument nodig

## When NOT to use
- Volledige boekhouding of uitbetalingsverwerking — gebruik uw boekhoudkundig en loonverwerker daarvoor
- Gezondheidscodedocumentatie of regelgevingsconformiteit — raadpleeg rechtstreeks uw lokale gezondheidsautoriteit
- Huuronderhandelingen of leveranciercontractbeoordeling — gebruik een advocaat

## Instructions

### Menu engineering

Zeg Claude: de gerechtnaam, voornaamste ingrediënten, kookmethode, prijspunt en restaurantsfeer — ingerent, casual, snel-casual, buurt-diner of gelijks.

Claude schrijft beschrijvingen die verkopen. Specifiek, zintuiglijk en nauwkeurig — geen generieke kopie die op elk restaurant van toepassing zou kunnen zijn. « Zelfgemaakte pasta » wordt « met de hand gerold rigatoni afgewerkt in een 30-minuten Calabrische chilisboterolie. » De beschrijving rechtvaardigt de prijs.

Voor een volledig menuherschrijven plakt u uw huidige menutekst. Zeg Claude de stem die u wilt: warm en toegankelijk, gesofisticeerd en minimaal, familievriendelijk of een referentierestaurant dat u bewondert. Claude herschrijft het volledige menu in die stem terwijl elke beschrijving nauwkeurig blijft voor het werkelijke gerecht.

Voor seizoensspecialiteiten: zeg Claude het superhoeveelstofingredient, het seizoen en uw menuprijspunt. Claude benoemt het gerecht, schrijft de beschrijving en stelt een prijspunt voor die aansluit op uw bestaande menustructuur.

---

### Food cost analysis

Geef Claude voor elk gerecht drie getallen: de menueprijs, de kosten van elk ingrediënt in één portie (wees specifiek — voeg olie, garnituren, saus en elk eiwit exact toe), en alle per-bord variabele kosten (afhaalcontainer, servetten indien relevant).

Claude berekent voedselkostenpercentage: kosten gedeeld door menueprijs. Doelbereik voor meeste categorieën:
- Eiwitten (vlees, vis): 28-35%
- Pasta, graangerechten: 18-25%
- Desserts: 20-28%
- Dranken (niet-alcoholisch): 15-22%
- Cocktails: 18-24%

Claude markeert elk gerecht boven uw drempel en stelt drie opties voor: verhoog de prijs, verminder de portie licht, vervang één ingrediënt of verwijder het gerecht. Claude stelt niet alle drie tegelijk voor — het rangschikt welke benadering past bij het gerecht op basis van zijn menurolerol.

Voor wekelijks inkoopbeoordeling: plak uw leveranciersfacturen van de afgelopen twee weken. Claude identificeert welke ingrediëntkostenverhoging zijn en welke gerechten nu als gevolg boven drempel zijn.

---

### Inventory forecasting

Zeg Claude:
- Couvertsserveerd per dag over de afgelopen 4 weken (of wekelijkse totalen)
- Welke gerechten verkocht en in welk volume (uw POS kan dit uitvoeren)
- Aankomende reserveringen of evenementen deze week
- Vakantiedagen of lokale evenementen die typisch uw volume beïnvloeden

Claude schat hoeveel van elk sleutelingredient de week te bestellen. Schattingen zijn gebaseerd op uw werkelijke per-couvertgebruik, niet generieke benchmarks. Het markeert ook artikelen die u historisch overorderd hebt (gebruikelijk met groenten en verse vis) en stelt voor om iets minder te bestellen om verspilling te verminderen.

Voor evenementvoorbereiding: zeg Claude het evenementtype, verwachte couverts en uw geplande menu. Claude produceert een ingrediëntpicklijst met hoeveelheden.

---

### Review responses

Plak uw beoordelingen — positief en negatief samen. Zeg Claude uw restaurantnaam en uw algemene stem (warm en persoonlijk, professioneel, ontspannen en casual).

Voor elke beoordeling concepten Claude een antwoord. Negatieve beoordelingen krijgen: erkenning van het specifieke probleem, geen deflectie of excuus, en één concrete resolutie (« neem alstublieft rechtstreeks contact op — we willen dit rechtzetten »). De toon blijft kalm en professioneel zelfs voor oneerlijke of vijandige beoordelingen.

Positieve beoordelingen krijgen warme, specifieke antwoorden. Claude leest wat de recensent prezen en spiegelt het — geen generieke « Dank u voor uw bezoek! » negen keer gekopieerd. Elk antwoord verwijst naar iets specifiek uit die beoordeling.

U bewerkt en personaliseert voor het posten. Claude verwerkt het eerste concept; u voegt de menselijke aanraking toe.

---

### Hiring posts

Zeg Claude: de rol, de voornaamste dagelijkse verantwoordelijkheden, wat uw restaurant een goede plaats maakt om te werken (cultuur, schema, teamdynamica, voordelen) en het loonbereik.

Claude schrijft een stellenopstelling die de werkelijke baan duidelijk en eerlijk beschrijft. Het gebruikt geen holle zinnen zoals « passioneerde over gastvrijheid » of « teamspeler » zonder inhoud. Het vertelt kandidaten exact hoe hun dagen eruitzien en waarom iemand goed daar zou willen werken.

---

### Training documentation

Zeg Claude: de rol die u traint (lijnkok, serveerster, gastheer, barista), de specifieke vaardigheid of proces om te documenteren en alle huisstandaard of voorkeur.

Claude produceert een duidelijk stap-voor-stap trainingsdocument geschreven voor iemand die nieuw is in uw bedrijf — niet generiek, maar specifiek voor wat u het vertelt. Handig voor onboarding en voor het standaardiseren van uitvoering in uw team.

---

### Prompt template — food cost

```
Analyseer alstublieft voedselkosten voor mijn gerechten.

Restauranttype: [casual/ingerent/snel-casual]
Voedselkostendoel: [X]%

Gerecht 1: [naam]
- Menueprijs: $[X]
- Ingrediëntkostenperbordje: $[Y] (uitsplitsing: eiwit $X, groente $X, saus $X, zetmeel $X, garnitur $X)
- Maandelijkse couverts verkocht: [getal]

Gerecht 2: [naam]
- Menueprijs: $[X]
- Ingrediëntkostenperbordje: $[Y]

Voor elk gerecht boven mijn doel: stel de beste enkele aanpassing voor (prijs, portie, vervanging of verwijdering).
```

## Example

U plakt 12 Google-beoordelingen: 9 positief en 3 negatief. U zegt Claude dat uw restaurant een casual Italiaans lokaal is met een warme buurtsten.

Claude produceert 12 antwoordconcepten.

De 3 negatief krijgen elk een specifiek, direct antwoord:
- Een klacht over een 40-minuten wachtoplicht op zaterdag: « Zaterdagavonden lopen langer dan we willen — het spijt ons van de uwe. We hebben een sms-melding toegevoegd wanneer uw tafel klaar is. Als u terugkomt, vraag naar [managernaam] en we zorgen voor u. »
- Een klacht over een koud pastagerecht: « Dat mag de keuken op deze manier niet verlaten. Stuur ons alstublieft rechtstreeks e-mail — we willen het u goed sturen. »
- Een klacht over lawaai: « We weten dat vrijdagavonden luid worden — het is de energie, maar we horen u. We hebben deze maand geluidspanelen aan de oostwand toegevoegd en we zijn benieuwd of u een verschil merkt. »

De 9 positief krijgen elk een ander antwoord, elk weerspiegelend iets specifiek dat de recensent noemde — de tiramisu, een bepaalde serveerstster, een verjaardagsdiner. Geen herhaalt dezelfde openingsregel.

---
