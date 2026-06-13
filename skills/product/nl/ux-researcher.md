---
name: ux-researcher
description: "UX research: user persona generatie, journey mapping, usability test planning, research synthese — vertaal user data in actionable design en product besluiten"
---

# UX Researcher Vaardigheid

## Wanneer activeren
- Creëren van data-backed user personas van research of analytics
- Bouwen van een customer journey map om ervaring gaps te identificeren
- Plannen van een usability test (script, taken, metrieke, steekproef grootte)
- Synthetiseer bevindingen van user interviews of surveys in thema's
- Genereer een empathy map of user needs framework

## Wanneer NIET gebruiken
- Product roadmap besluiten — use the product-discovery vaardigheid
- A/B test design — use the experiment-designer vaardigheid
- Kwantitatieve analytics (funnel analyse, retentie) — use the product-analytics vaardigheid
- Marketing persona voor targeting — ander doel dan UX persona

## Instructies

### User persona generatie

```
Genereer een user persona van [data bron].

Data bron: [user interviews / survey resultaten / analytics / support tickets / alles]
Product: [beschrijf]
Segment om te modelleren: [beschrijf het user type — bijv. "power users die core feature dagelijks gebruiken"]

Persona structuur:

PERSONA NAAM: [archetype naam — descriptief, niet een echte naam]
Tagline: [één zin die hun kern frustratie of doel vastlegt]

DEMOGRAPHICS (breed blijven, stereotypering vermijden):
Rol: [job titel / functie]
Bedrijfsgrootte: [KMO / mid-market / enterprise]
Technische vaardigheid: [laag / gemiddeld / hoog] in [relevant domein]

DOELEN (wat ze proberen te bereiken):
Primair doel: [het hoofd job dat ze proberen te doen]
Secundair doel: [ondersteunend objectief]
Succes ziet er uit als: [observable resultaat waar ze om geven]

FRUSTRATIES (huidi frustration met bestaande oplossingen):
1. [Specifieke frustration met bewijs — quote van interview of stat van data]
2. [Specifieke frustration]
3. [Specifieke frustration]

GEDRAG PATRONEN:
Hoe zij tools ontdekken: [mond tot mond / zoeken / manager mandate / etc.]
Hoe zij evalueren: [eerst proef / peer review / demo / procurement proces]
Hoe zij product gebruiken: [dagelijks / wekelijks / episodisch / in team / solo]

QUOTE (representatieve stem):
"[Letterlijk of parafraseerd quote dat hun wereldbeschouwing vastlegt]"

WAT ZE VAN ONS NODIG HEBBEN:
- [Specifieke behoefte 1]
- [Specifieke behoefte 2]
- [Specifieke behoefte 3]

NIET OPNEMEN: stock foto beschrijving, fictief verhaal, irrelevante demographic (favoriete koffie)
OPNEMEN: alleen wat productbesluiten drijft

Genereer de persona voor [segment] van de data die u verschaft.
```

### Journey map

```
Creëer een customer journey map voor [ervaring].

Ervaring: [beschrijf de end-to-end ervaring — bijv. "eerste setup tot eerste waarde moment"]
User persona: [welke persona deze map vertegenwoordigt]
Touchpoints te dekken: [kanalen — email, product, support, website]

Journey map formaat:

FASEN: [list hoog-level fasen — bijv. Bewustzijn → Overweging → Onboarding → Activering → Habitueel Gebruik]

Voor elke fase:

FASE NAAM: [label]
Entry trigger: [wat verplaatst de user naar deze fase?]
Duur: [typische tijd in deze fase]

User acties:
- [Wat zij doen]
- [Wat zij doen]

Touchpoints:
- [Waar interacteren zij met uw product/merk]

Gedachten (wat zij denken):
- "[Interne monoloog op dit moment]"

Gevoelens: [Gefrustreerd / Nieuwsgierig / Zelfverzekerd / Bezorgd / Verheugd] — met 1-5 stemming score

Pain points:
- 🔴 [Kritische pijn — blokkeert voortgang]
- 🟡 [Merkbare wrijving — vertraagt]

Kansen:
- [Design of product verbetering die de pijn adresseert]

ALGEHELE ERVARINGSCURVE:
Plot stemming (1=zeer negatief, 5=zeer positief) voor elke fase:
[Fase 1]: X/5 → [Fase 2]: X/5 → [Fase 3]: X/5 → ...

Laagste punt in de reis = hoogste prioriteit design kans.

Genereer de journey map voor mijn ervaring en persona.
```

### Usability test plan

```
Plan een usability test voor [product/feature].

Wat testen: [specifieke flow, feature of design]
User type: [wie recruteren]
Test format: [gemodereerd remote / gemodereerd in-person / ongemodereerd]
Aantal deelnemers: [typisch 5-8 voor kwalitatief; 20+ voor kwantitatief]
Sleutel vragen: [wat wilt u leren?]

Test plan:

DOEL:
[Welke specifieke vraag zal deze test beantwoorden?]
Succes criteria: [hoe zult u weten dat de test nuttig was?]

DEELNEMER CRITERIA:
Screener vragen: [3-5 vragen om deelnemers te kwalificeren]
Moet hebben: [vereiste 1] + [vereiste 2]
Mag niet hebben: [exclusie criteria]
Prikkel: [$X giftcard / gratis product credit / ander]

TASK DESIGN (5-7 taken per sessie):
Taken moeten zijn:
- Scenario-based ("u wilt X doen...") niet instructies ("klik op Y")
- Observable — kunt u zien of zij slaagden?
- Representatief van echte user doelen

Task 1: [scenario]
Voltooiings criteria: [hoe ziet succes er uit?]
Tijdslimiet: [X minuten]

Task 2: [scenario]
Voltooiings criteria: [...]

METRIEKEN:
Kwantitatief:
- Task completion rate: % die elke taak zonder hulp compleet maken
- Tijd per taak: mediaan seconden per taak
- Fout rate: fouten per taak
- SUS score (System Usability Scale): 0-100 samengsteld

Kwalitatief:
- Think-aloud observaties: wat zeggen users als zij navigeren?
- Verwarring punten: waar zijzelf pauzeren, teruggaan of vragen stellen?
- Emotionele signalen: waar tonen zij frustratie of vreugde?

SESSIE GIDS:
Introductie (5 min): leg think-aloud uit, geen goed of fout antwoord
Taken (30-40 min): presenteer elke taak, observeer en noteer
Debriefing (10 min): open vragen over de algemene ervaring

ANALYSE FRAMEWORK:
Na [N] sessies:
- Affiniteit map: groep observaties per thema
- Severity rating: Kritisch (blokkeert voltooiing) / Groot (frustreert) / Klein (cosmetisch)
- Frequentie: hoeveel deelnemers raakten dit probleem?
- Prioriteit score: Severity × Frequentie

Genereer de test plan voor mijn specifieke feature en user type.
```

### Research synthese

```
Synthetiseer user research bevindingen van [bron].

Research type: [user interviews / usability test / survey / support tickets / alles]
Aantal sessies/reacties: [X]
Ruwe bevindingen: [plak sleutel observaties, quotes of thema's]

Synthese framework:

Stap 1 — Observatie clustering (affinity mapping):
Groepeer individuele observaties in thema's.
Groepeer niet per research vraag — groepeer per wat users werkelijk zeiden en deden.
Goed thema: "Users konden filter functionaliteit niet vinden" (specifiek, observable)
Slecht thema: "Navigatie problemen" (te vaag)

Stap 2 — Thema priorisering:
Voor elk thema:
| Thema | Frequentie (X van N deelnemers) | Severity | Bewijs |
|---|---|---|---|
| [Thema 1] | [X/N] | Kritisch / Groot / Klein | [quote of observatie] |

Stap 3 — Insight generatie:
Insight = thema + implicatie (niet alleen "users deden X" maar "users deden X, wat betekent dat we Y moeten doen")

Format: "Wanneer [context], users [gedrag]. Dit suggereert [product/design implicatie]."

Voorbeeld: "Wanneer users het dashboard eerste bereiken, zoeken zij naar een search bar voordat zij het filter panel in de zijbalk opmerken. Dit suggereert dat het primaire ontdekking mechanisme naar een prominenter plaats moet verplaatsen of dat search als primaire navigatie mode moet worden toegevoegd."

Stap 4 — Aanbevelingen (besteld per impact):
🔴 P1 — Kritisch (repareer voor launch): [specifieke aanbeveling + bewijs]
🟡 P2 — Belangrijk (repareer binnenkort): [specifieke aanbeveling + bewijs]
🟢 P3 — Leuk om te hebben: [specifieke aanbeveling]

Stap 5 — Wat wij nog niet weten:
[Vragen die deze research niet kon beantwoorden — design de volgende research om deze vragen te beantwoorden]

Synthetiseer mijn research bevindingen in geprioritiseerde insights en aanbevelingen.
```

## Voorbeeld

**User:** Wij deden 6 user interviews over ons project management tool. Hoofd bevindingen: users houden van de timeline view maar kunnen niet uitfiguren hoe zij dependencies tussen taken toevoegen. Drie users gaven op en zeiden "ik zal Notion gebruiken." Hoe zet ik dit in actie?

**Claude's synthese:**

**Sleutel insight:**
"Wanneer users gerelateerde taken willen verbinden, kunnen zij de dependency-creation UI niet vinden zonder hulp. Dit is geen feature gap — de feature bestaat — het is een discoverability en interaction design probleem."

Bewijs: 3/6 users gaven op; alle 6 noemden de timeline als het sterkste deel van het tool. Niemand suggereerde dat zij een ander feature nodig hadden — zij hadden het bestaande feature nodig om ontdekbaar te zijn.

**Implicaties:**

🔴 P1 — Dependency creation UX is kapot (repareer voor groei):
Het ingang punt voor het toevoegen van dependencies is onzichtbaar. Users zoeken naar een drag-connect interactie (zoals Miro/Linear) of een right-click context menu. Als uw huidge flow een settings panel of een aparte click-add-link knop vereist, dat is de mismatch.

Aanbeveling: In de timeline view, voeg een visuele affordance toe wanneer hoveren over een task (een connector handle of "add dependency" knop op hover). Beschouw een right-click context menu met "Add dependency naar..."

🟡 P2 — Lege state / onboarding voor dependencies:
Als users de timeline bereiken zonder dependencies ingesteld, is er geen hint dat het feature bestaat. Voeg een tooltip of empty-state prompt: "Verbind taken door van een naar ander te slepen" met een 3-seconden demo animatie.

🟢 P3 — Help documentatie:
"Task dependencies" is begraven in docs. Verplaats naar een "Aan de slag met timelines" gids die contextueel verschijnt wanneer user eerste de timeline opent.

**Deze research heeft niet beantwoord:**
- Willen users dat dependencies automatisch cascade (als A vertraagd, doet B shift)?
- Zijn er power users die dependencies vandaag hebben gevonden en gebruiken? Wat maakte hen voor hen ontdekbaar?

Run een 15-minuten vervolgzitting met 3 users: toon waar het dependency feature is, vraag hen het gebruiken, observeer — is de interactie zelf duidelijk eenmaal gevonden?

---
