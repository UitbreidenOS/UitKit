---
name: product-discovery
description: "Productontdekking: klantgesprekken, probleemvalidatie, opportuniteitsscore, Jobs-to-be-Done-framework, bepalen wat volgende gebouwd moet worden en waarom"
---

# Competentie Productontdekking

## Wanneer activeren
- Bepalen wat volgende met weinig bewijs gebouwd moet worden
- Een productidee vóór investering in ontwikkeling valideren
- Klantgesprekken voeren en inzichten synthetiseren
- Jobs-to-be-Done (JTBD) framework toepassen om gebruikersmotieven te begrijpen
- Een probleemverklaring of opportuniteitsbrief schrijven
- Backlog van mogelijke functies scoren en prioriteren

## Wanneer niet gebruiken
- Na de beslissing om te bouwen — dat is productspecificatie en levering
- UX/UI-ontwerp — een ontwerphulpmiddel of design-sprint-proces gebruiken
- A/B-testontwerp — de experiment-designer competentie gebruiken
- Marktgroottebepaling voor beleggers — dat is een financieel model, geen ontdekking

## Instructies

### Handleiding voor klantgesprek

```
Schrijf een handleiding voor klantgesprekken voor [probleemgebied/productgebied].

Wat willen we leren: [specifieke onzekerheid of hypothese om te valideren]
Interview-doel: [wie interviewen — rol, bedrijfstype, context]
Geplande aantal interviews: [X]

Interview-structuur (45-60 minuten):

1. Opwarmfase (5 min):
   - „Vertel me over uw rol en hoe een typische [week / project] eruitziet"
   - „Hoe lang doe je dit al?"
   - Doel: rapport opbouwen, context begrijpen — stel NU GEEN vragen over het product

2. Huidige situatie (10 min):
   - „Doorloop de vorige keer dat je [het ding dat we oplossen] moest doen"
   - „Hoe ziet dit proces vandaag eruit?"
   - „Wie is er verder bij betrokken?"
   - Regel: vraag naar gedrag uit het verleden, niet hypothetisch toekomstig gedrag

3. Pijn en wrijving (15 min):
   - „Wat is het moeilijkste deel van dit proces?"
   - „Hoeveel tijd kost het? Hoe vaak?"
   - „Wat heb je geprobeerd om dit te repareren? Wat gebeurde er?"
   - „Hoe los je dit vandaag op? Wat is er mis met die oplossing?"

4. Motivatie en uitkomst (10 min):
   - „Waarom is dit belangrijk voor u / uw team / uw bedrijf?"
   - „Wat zou anders zijn als dit volledig opgelost was?"
   - „Wat kost het om dit niet op te lossen?" (tijd, geld, risico, emotie)

5. Afsluiting (5 min):
   - „Is er iets wat ik niet heb gevraagd dat me zou helpen dit beter te begrijpen?"
   - „Met wie moet ik spreken?"

Regels:
- Vraag nooit "Zou je X gebruiken?" — mensen zeggen ja op alles hypothetisch
- Toon nooit het product of mockup voordat je het probleem begrijpt
- Vraag voortdurend "Vertel me meer" en "Waarom"
- Noteer exacte woorden (vocabulaire is belangrijk voor messaging)

Genereer de gids voor mijn specifieke probleemgebied met aangepaste vragen.
```

### Jobs-to-be-Done-analyse

```
Pas het Jobs-to-be-Done framework toe om [product/functie] te begrijpen.

Context: [beschrijf het product en de gebruiker die de taak doet]

JTBD-framework:

1. Definieer de taak:
   Indeling: Wanneer [situatie], wil ik [motivatie], zodat ik [uitkomst].
   
   Voorbeeld: „Wanneer ik een nieuwe ingenieur in de codebase integreer, wil ik hem snel productief maken, zodat ik de teamsnelheid kan handhaven zonder een knelpunt te worden."
   
   Taak voor mijn context: [schrijf de taakaanduiding]

2. Zet de taak uiteen in stappen (taakkaart):
   Stap 1 — Definieer: wat doet de gebruiker om de taak in te kaderen of af te bakenen?
   Stap 2 — Lokaliseer: welke informatie of resources moet hij/zij vinden?
   Stap 3 — Voorbereiding: hoe bereidt hij/zij zich voor om de taak te doen?
   Stap 4 — Voer uit: wat is de kernactie van de taak?
   Stap 5 — Monitor: hoe volgt hij/zij voortgang of kwaliteit?
   Stap 6 — Wijzig: wat stelt hij/zij bij als dingen niet volgens plan gaan?
   Stap 7 — Concludeer: hoe beëindigt en geeft hij/zij over?

3. Identificeer uitkomsten (waarmee de gebruiker succes meet):
   - Snelheid: hoe snel kan hij/zij [stap X] doen?
   - Nauwkeurigheid: hoe betrouwbaar produceert [stap X] het juiste resultaat?
   - Inspanning: hoeveel cognitieve/fysieke inspanning vereist [stap X]?
   - Risico: hoe zeker is hij/zij dat [stap X] niet zal mislukken?

4. Vind ondergebruikte uitkomsten (de gelegenheid):
   Score elke uitkomst: belang vs. huidige tevredenheid (1-10 schaal)
   Opportuniteitsscore = belang + (belang - tevredenheid)
   Score > 10: sterke gelegenheid om aan te pakken

Pas toe voor: [specifieke gebruiker en taak in mijn product].
```

### Opportuniteitsscore

```
Score en prioriteer productopportunititeiten.

Te evalueren opportuniteiten: [lijst — kunnen functies, op te lossen problemen of segmenten zijn]
Beschikbare gegevens: [klantgesprekken / supporttickets / NPS-opmerkingen / analytiek / geen]

Opportuniteitsscore-framework (RICE of gewogen criteria):

RICE-score:
Reach: hoeveel betroffene gebruikers per kwartaal? [X]
Impact: hoeveel verbetert het hun uitkomst? [massief=3 / hoog=2 / gemiddeld=1 / laag=0.5]
Confidence: hoe zeker zijn we over bereik en impact? [hoog=100% / gemiddeld=80% / laag=50%]
Effort: engineeringweken om te bouwen? [X]
RICE = (Reach × Impact × Confidence) / Effort

Alternatief: gewogen criteria (als u strategische pasvorm wilt opnemen):
| Opportuniteit | Gebruikerslast (30%) | Strategische Fit (20%) | Frequentie (20%) | Inspanning (30%) | Totaal |
|---|---|---|---|---|---|
| [A] | 8 | 7 | 9 | 5 | 7.2 |
| [B] | 6 | 9 | 4 | 8 | 6.8 |

Wat in de scoring op te nemen:
- Ernst van gebruikerslast: hoe erg is het probleem vandaag?
- Frequentie: hoe vaak treft de gebruiker dit?
- Strategische afstemming: bevordert dit onze kernthese?
- Haalbaarheid: kunnen we het werkelijk goed bouwen?
- Marktdifferentiatie: doet een concurrent dit al goed?

Score mijn [X] opportuniteiten en produceer een geprioriteerde lijst met onderbouwing.
```

### Probleembrief

```
Schrijf een probleembrief voor [opportuniteit].

Context: [wat we over dit probleem uit onderzoek weten]
Bewijs: [interviewcitaten, volume supporttickets, analytiekgegevens]
Getroffen segment: [wie dit ervaart, hoeveel gebruikers]

Probleembrief-structuur:

## Het Probleem
[2-3 zinnen die de specifieke situatie, wrijving en impact beschrijven. Nog geen oplossing.]

## Wie het ervaart
[Gebruiker-persona + kwantificering: „X% van onze [segment] gebruikers ondervinden dit wanneer..."]

## Bewijs
- Interieur-inzicht: „[Exact citaat van een gebruiker]" — [Rol, Bedrijf]
- Analytiek: [relevant gegevenspunt]
- Ondersteuning: [volume of patroon van ondersteuning]

## Huidige Workarounds
[Hoe gebruikers dit vandaag oplossen — en waarom deze oplossingen ontoereikend zijn]

## Waarom dit belangrijk is
[Zakelijk geval: impact op behoud, verwerving, inkomsten of strategische positie]

## Hoe Succes eruitziet
[Meetbare uitkomst — niet een functie, maar het gewijzigde gedrag of resultaat van de gebruiker]

## Wat dit NIET is
[Beperkingen en verduidelijkingen buiten bereik — wat we niet zullen proberen op te lossen]

---
Open vragen voordat we gaan bouwen:
- [Vraag 1 — wat weten we nog niet?]
- [Vraag 2]
Eigenaar ontdekking: [naam]
Volgende stap: [X meer interviews / prototypetest / bouwen?]

Schrijf een probleembrief voor mijn opportuniteit met behulp van het bewijs dat ik geef.
```

## Voorbeeld

**Gebruiker:** We zijn een projectmanagementtool voor engineeringteams. We horen voortdurend "onze engineers updaten tickets niet." Moeten we betere Jira-synchronisatie, meer herinneringen of afdwinging van ticketupdates bouwen? Eerst ontdekking.

**Claudees ontdekkingsplan:**

Bouw nog niet. „Engineers updaten tickets niet" is een symptoom met minstens 3 verschillende basisoorzaken — elk vereist een ander oplossing.

**3 hypothesen om in interviews te testen:**
1. **Wrijving-hypothese:** Engineers weten dat ze moeten updaten, maar de workflow is te langzaam (→ oplossen met betere UI, toetsenbordsnelkoppelingen, Slack-integratie)
2. **Vertrouwen-hypothese:** Engineers denken dat ticketgegevens niet uitmaken omdat PM's deze niet echt lezen (→ oplossen met betere zichtbaarheidstools voor PM's, niet engineer-flows)
3. **Irrelevantie-hypothese:** Tickets verouderen omdat vereisten veranderen tijdens de sprint en niemand de bron van waarheid bijwerkt (→ oplossen met lichte herplanningsflow, niet herinneringen)

**5 interviewvragen om te stellen (aan engineers, niet PM's):**
1. "Doorloop het vorige ticket waaraan je hebt gewerkt — wanneer heb je het eerst bekeken, wanneer voor het laatst bijgewerkt?"
2. "Wat doe je als volgende wanneer je een taak afrondt?" (Luisteren: noemen tickets nooit)
3. "Wat gebeurt er als je je ticket niet bijwerkt?" (Luisteren: niets / PM vraagt mij / sprintbeoordeling is verwarrend)
4. "Hebt je ooit een ticket bijgewerkt en gebeurde er niets?" (Valideert vertrouwen-hypothese)
5. "Wat zou je werkelijk willen updaten?" (Open, luisteren zonder te projiceren)

Voer 5 interviews uit. Je weet welke hypothese waar is — en je spaart waarschijnlijk 2-3 maanden door het verkeerde te bouwen.

---
