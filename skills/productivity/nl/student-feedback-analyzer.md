---
name: student-feedback-analyzer
description: "Analyseer studentenfeedback en beoordelingsresultaten: patronen identificeren, kennislacunes blootleggen, onderwijseffectiviteit evalueren en verbeteraanbevelingen genereren"
---

# Vaardigheid: Studentenfeedback Analysator

## Wanneer activeren
- Feedbackenquêtes aan het einde van een les of cursus zijn verzameld
- Beoordelingsresultaten zijn binnen en je moet begrijpen wat studenten wel en niet hebben geleerd
- Je hebt kwalitatieve feedback (open antwoorden) en thema's moeten worden geëxtraheerd
- Plannen voor het volgende jaar of de volgende eenheid en data wilt gebruiken om beslissingen te sturen
- Een studentcohort presteert ondermaats en je moet diagnosticeren waarom
- Collegiale beoordeling van onderwijseffectiviteit vereist gestructureerd bewijs

## Wanneer NIET gebruiken
- Individueel studentcijfers of beoordeling — dat vereist jouw vakexpertise en kennis van de student
- Voorspellende analyses die statistische modelleertools vereisen — gebruik Python/R voor dat niveau van analyse
- Privacybeschermd data met persoonlijk identificeerbare informatie — anonimiseer vóór het doorgeven aan Claude

## Privacyopmerking

Plak nooit studentenfeedback met namen of andere persoonlijk identificeerbare informatie tenzij het al geanonimiseerd is. Geaggregeerde, geanonimiseerde antwoorden zijn veilig om te analyseren.

## Instructies

### Analyse van eindefeedback van de cursus

```
Analyseer deze studentenfeedback van [cursusnaam / lesnaam].

CURSUS/LES: [titel]
INSTRUCTEUR: [jouw naam of anoniem]
COHORT: [aantal studenten, leerjaar of professionele context]
RESPONSPERCENTAGE: [N reacties van N ingeschreven]
VERZAMELINGSMETHODE: [enquête / uitgangsticket / focusgroep / schriftelijke reflectie]

KWANTITATIEVE BEOORDELINGEN (plak je data):
[Voor elke beoordelingsvraag: vraagtekst + gemiddelde score + scoreverdeling]
Voorbeeld:
- "Algemene cursuskwaliteit" — gem: 4,2/5 — verdeling: 5★: 40%, 4★: 35%, 3★: 18%, 2★: 5%, 1★: 2%
- "Duidelijkheid van instructie" — gem: 3,8/5 — verdeling: [plak]
- "Relevantie voor mijn doelen" — gem: 4,5/5 — verdeling: [plak]
- [Ga door voor alle beoordeelde vragen]

OPEN ANTWOORDEN (plak alle reacties — geanonimiseerd):
"Wat werkte goed?"
[Plak alle reacties]

"Wat kan worden verbeterd?"
[Plak alle reacties]

"Wat had de meeste impact op je leren?"
[Plak alle reacties]

"Overige opmerkingen?"
[Plak alle reacties]

Analyseer en genereer:
1. Algemene feedbacksamenvatting (2-3 zinnen, eerlijke beoordeling)
2. Sterkste elementen (wat studenten consistent waardeerden)
3. Consistente kritieken (patronen in negatieve feedback — geen eenmalige)
4. Kennis- of vaardigheidslacunes geïmpliceerd door de feedback
5. Uitvoerbare verbeteraanbevelingen (specifiek, niet vaag)
6. Eén verrassende bevinding (iets wat je misschien niet had verwacht)
7. Voorgestelde wijzigingen voor de volgende iteratie
```

---

### Analyse van beoordelingsresultaten

```
Analyseer beoordelingsresultaten om leerlacunes te identificeren.

BEOORDELING: [quiz / examen / project / opdracht / gestandaardiseerde test]
CURSUS/EENHEID: [naam]
COHORT: [N studenten]
BEOORDELINGSDATUM: [datum]

ALGEHELE PRESTATIES:
- Klasgemiddelde: [X]% / [X]/[totaal punten]
- Mediaan: [X]%
- Standaarddeviatie: [X]
- Scoreverdeling: [bijv. 90-100%: 8 studenten, 80-89%: 12, 70-79%: 6, onder 70%: 4]

VRAAGNIVEAU ANALYSE (plak voor elke vraag):
Vraag 1: [getest onderwerp/concept] — correct: [X]% — gem score: [X/X]
Vraag 2: [onderwerp] — correct: [X]% — gem: [X/X]
[Ga door voor alle vragen]

LEERDOELKOPPELING:
Doel 1: [tekst] — beoordeeld door V[nummers] — gemiddelde prestatie: [X]%
Doel 2: [tekst] — beoordeeld door V[nummers] — gemiddelde prestatie: [X]%
[Ga door]

OPVALLENDE PATRONEN IN FOUTE ANTWOORDEN:
[Als je veelvoorkomende fouttypes bijhield, lijst ze: "40% van de studenten koos B in plaats van D bij V7 — wat zegt dat ons?"]

Genereer:
1. Samenvatting van algehele prestaties (was deze beoordeling passende moeilijkheidsgraad?)
2. Leerdoelen die beheerst werden (≥ 80% gemiddeld)
3. Leerdoelen die lacunes zijn (< 70% gemiddeld)
4. Specifieke misvattingen gesuggereerd door de verkeerde antwoordpatronen
5. Vragen over je onderwijs: welke concepten moeten opnieuw worden onderwezen of uitgelegd?
6. Aanbevelingen voor herinstructie: welke aanpak zou de geïdentificeerde lacunes aanpakken?
7. Differentiatie-inzicht: worstelen sommige studenten consistent terwijl anderen floreren? (geen namen noemen)
```

---

### Thema-extractie uit kwalitatieve feedback

```
Extraheer thema's uit open studentenfeedback.

CONTEXT: [wat je vroeg / welke cursus]
TOTAAL REACTIES: [N]

RUWE REACTIES (geanonimiseerd):
[Plak alle tekstreacties, één per regel of gescheiden door "---"]

Analyseer op:

POSITIEVE THEMA'S:
- Identificeer de top 3-4 dingen die studenten consistent prezen
- Citeer 1-2 representatieve reacties per thema
- Geschatte frequentie: welk % van de reacties noemde dit thema?

VERBETERINGSTHEMA'S:
- Identificeer de top 3-4 consistente klachten of suggesties
- Citeer 1-2 representatieve reacties per thema
- Geschatte frequentie
- Onderscheid: is dit een voorkeurklacht (ze wilden meer college) vs. een echte lacune (ze begrepen X niet)?

UITBIJTER FEEDBACK:
- Reacties die niet passen in de patronen — sterk positieve uitbijters, sterk negatieve uitbijters, ongewone suggesties
- Zijn er uitvoerbare ook al zei slechts één persoon het?

EMOTIONELE REGISTER:
- Was feedback over het algemeen positief, gemengd of negatief van toon?
- Tekenen van ontkoppeling, frustratie of verwarring buiten wat de beoordelingsscores tonen?

UITVOERBAARHEIDSBEOORDELING:
Voor elk thema: [Gemakkelijk uit te voeren / Vereist curriculumwijziging / Structurele beperking / Niet uitvoerbaar]
```

---

### Analyse van onderwijseffectiviteit

```
Analyseer mijn onderwijseffectiviteit op basis van deze databronnen.

INSTRUCTEUR: [jij / anoniem]
CURSUS: [naam, niveau]
TERMIJN/PERIODE: [wanneer]

DATABRONNEN (verstrek wat je hebt):
- Beoordelingen feedbackenquête studenten: [plak gemiddelden per vraag]
- Beoordelingsprestatiedata: [klasgemiddelden op sleutelbeoordelingen]
- Aanwezigheids-/voltooiingspercentages: [X% aanwezigheid / X% opdrachtvoltooiing]
- Open feedbackthema's: [plak of vat samen]
- Eventuele collegiale observatienotities: [plak indien van toepassing]

ZELFBEOORDELING:
Wat vond je goed gaan? [jouw eigen reflectie]
Wat voelde moeilijk of off? [jouw reflectie]
Wat zou je anders doen? [jouw initiële gedachten]

ONDERWIJSDOELEN VOOR DEZE CURSUS:
[Wat probeerde je expliciet te doen — bijv. "meer actief leren, minder colleges" / "examengeslaagdpercentages verbeteren" / "betrokkenheid bij real-world voorbeelden vergroten"]

Genereer:
1. Sterktesanalyse: wat het bewijs zegt dat je goed deed
2. Ontwikkelingsgebieden: wat het bewijs suggereert om te verbeteren
3. Afstemmingscheck: ervaren studenten wat je bedoelde te creëren?
4. Vergelijking van jouw zelfbeoordeling met studentenbewijs: waar ben je het eens/oneens met je eigen studenten?
5. 3 specifieke ontwikkelingsprioriteiten voor jouw volgende iteratie
6. Indien van toepassing: professionele ontwikkelingsaanbeveling (workshop, coaching, collegiale observatiefocus)
```

---

### Snelle uitgangsticket analyse

Voor snelle verwerking van feedback in de klas:

```
Analyseer snel deze uitgangsticketreacties. Ik heb 5 minuten tussen lessen.

LESONDERWERP: [onderwerp]
LEERDOEL: [wat studenten moeten kunnen doen]
AANTAL REACTIES: [N]

UITGANGSTICKETVRAAG 1 (herinnering/kennis):
[Plak alle reacties]

UITGANGSTICKETVRAAG 2 (toepassing):
[Plak alle reacties]

UITGANGSTICKETVRAAG 3 (troebels punt — "wat is nog onduidelijk?"):
[Plak alle reacties]

Geef me:
1. % dat beheersing aantoonde op V1 en V2 (ruwe schatting)
2. Top 2-3 dingen die nog onduidelijk zijn op basis van V3
3. Wat ik aan het BEGIN van de volgende les moet aanpakken (onder 2 minuten)
4. Wie mogelijk individuele opvolging nodig heeft (op basis van patroon, geen namen)

Onder 150 woorden. Ik moet dit snel kunnen lezen.
```

---

### Cohort-vergelijkingsanalyse

```
Vergelijk prestaties en feedback over twee versies of cohorten van dezelfde cursus.

CURSUS: [naam]
COHORT A: [beschrijving — termijn, formaat, cohortkenmerken]
COHORT B: [beschrijving]

KWANTITATIEVE VERGELIJKING:
| Metriek | Cohort A | Cohort B | Verschil |
|---|---|---|---|
| Gem beoordelingsscore | [X]% | [X]% | [+/-X%] |
| Feedbackbeoordeling (algemeen) | [X]/5 | [X]/5 | [+/-] |
| Voltooiingspercentage | [X]% | [X]% | [+/-] |
| [Andere metriek] | [X] | [X] | [+/-] |

WAT IS VERANDERD TUSSEN COHORTEN:
[Lijst eventuele onderwijsveranderingen, curriculumveranderingen, formaatveranderingen of cohortsverschillen]

KWALITATIEVE VERGELIJKING (thema's):
Sterkste feedbackthema's cohort A: [lijst]
Sterkste feedbackthema's cohort B: [lijst]
Grootste klachten cohort A: [lijst]
Grootste klachten cohort B: [lijst]

Analyseer:
1. Hebben de aangebrachte wijzigingen de leeruitkomsten verbeterd? (welk bewijs ondersteunt dit)
2. Wat anders de verschillen kan verklaren (cohortkenmerken, externe factoren)
3. Wat te behouden uit de wijzigingen
4. Wat terug te draaien of anders te proberen
```

---

### Cursusverbeteringsrapport

```
Genereer een cursusverbeteringsrapport op basis van alle beschikbare data.

CURSUS: [naam en versie]
INSTRUCTEUR: [naam]
TERMIJN: [periode]

DATASAMENVATTING:
- Studentenfeedback (algehele beoordeling): [X/5]
- Beoordelingsgemiddelde: [X]%
- Voltooiingspercentage: [X]%
- Top positieve feedbackthema's: [lijst]
- Top verbeteringsfeedbackthema's: [lijst]
- Geïdentificeerde kernkennislacunes: [lijst]

ONDERWIJSWIJZIGINGEN DIE IK DEZE TERMIJN HEB AANGEBRACHT (vs. vorige versie):
[Lijst eventuele doelbewuste wijzigingen]

MIJN REFLECTIE:
[Jouw eerlijke beoordeling van wat werkte en wat niet]

Genereer een gestructureerd cursusverbeteringsrapport:

## Prestatiesamenvatting
[2-3 zinnen over algemene uitkomsten]

## Wat Werkte (Behouden)
[Op bewijs gebaseerde lijst van te behouden elementen]

## Wat Niet Werkte (Wijzigen)
[Op bewijs gebaseerde lijst met specifieke vervangingsstrategieën]

## Plan voor het Aanpakken van Kennislacunes
[Voor elke geïdentificeerde lacune: hoe dit in de volgende iteratie aan te pakken]

## 3 Prioriteitswijzigingen voor de Volgende Iteratie
[Specifieke, uitvoerbare wijzigingen gerangschikt op verwachte impact]

## Open Vragen
[Dingen die de data aan de orde stelde die je nog steeds niet weet hoe je moet beantwoorden]
```

## Voorbeeld

**Gebruiker:** Eindefeedbackenquête van een 20-persoons bedrijfstraining over "Stakeholdercommunicatie." Kwantitatief: algemene kwaliteit 4,1/5, inhoudsrelevantie 4,6/5, tempo 3,4/5 (laagste), activiteiten 4,3/5, instructieduidelijkheid 3,9/5. Open "wat kan worden verbeterd": 8 reacties noemen "te veel inhoud voor de tijd", 5 noemen "wilde meer oefenscenario's", 2 noemen "de ochtendsessies waren te lang", 1 noemt dat dia's moeilijk te lezen waren. Open "wat het beste werkte": 12 noemen de casestudy-oefening, 7 noemen de kleine groepsdiscussies, 3 noemen specifieke voorbeelden uit hun branche.

**Verwachte uitvoer:** Samenvatting — de inhoud was zeer relevant maar het tempo was de duidelijke zwakheid. Sterkste elementen: de casestudy en kleine groepsdiscussie. Top kritieken: inhoudsdikte ten opzichte van tijd (40% van de respondenten), onvoldoende oefening (25%). Uitvoerbare aanbevelingen: 20% van de inhoud inkorten om ademruimte te laten (de relevantiebeoordeling toont dat de juiste inhoud er is — het probleem is volume), een tweede oefenscenario toevoegen ter vervanging van wat college-tijd, de ochtend opsplitsen in twee kortere blokken met een pauze. Eén inzicht: het tempoprobleem en de wens voor meer oefening zijn hetzelfde probleem — wanneer de planning te krap is, wordt oefening ingekort. Het ene oplossen lost het andere op.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
