---
name: user-story-writer
description: "Zet ruwe functie-ideeën om in goed gestructureerde gebruikersverhalen met acceptatiecriteria en randgevallen"
---

# Vaardigheid: Gebruikersverhaal schrijver

## Wanneer activeren
- Een ruw functieverzoek of idee omzetten in een gestructureerd gebruikersverhaal
- Acceptatiecriteria schrijven voor een verhaal dat al in de backlog staat
- Randgevallen en foutstatussen identificeren die engineering moet afhandelen
- Een epic opsplitsen in sprint-formaat verhalen
- Een vaag stakeholdersverzoek verfijnen tot iets dat een developer kan bouwen
- De "definition of done" schrijven voor een functie

## Wanneer NIET gebruiken
- Volledig PRD schrijven — gebruik `/code-to-prd` voor het converteren van bestaande code, of schrijf het van scratch
- Beslissingen op hoog niveau over de roadmap — gebruik `/product-roadmap`
- Discovery voordat de functie is gedefinieerd — gebruik eerst `/product-discovery`
- API-contract of technische specificatie — dat is engineering, niet PM

## Instructies

### Kernprompt voor het schrijven van verhalen

```
Schrijf een gebruikersverhaal voor dit functie-idee: [BESCHRIJF HET IDEE IN JE EIGEN WOORDEN]

Context:
- Product: [voor welk product dit is]
- Gebruikerstype: [wie de primaire gebruiker is — rol, context, technisch niveau]
- Waarom het belangrijk is: [bedrijfs- of gebruikersresultaat dat dit mogelijk maakt]
- Gerelateerde bestaande functies: [wat er al bestaat waar dit mee verbindt]
- Bekende beperkingen: [technische, ontwerp-, juridische of zakelijke beperkingen om te respecteren]

Produceer het volledige gebruikersverhaal:

## Verhaalstitel
[Actiegericht, specifiek — niet "Exporteer implementeren" maar "Rapportgegevens exporteren naar CSV voor analyse in Excel"]

## Gebruikersverhaal
Als een [specifiek gebruikerstype — niet "gebruiker" maar "enterprise-beheerder" of "data-analist"],
wil ik [specifieke actie met voldoende detail om te bouwen],
zodat [resultaat — wat ze nu kunnen doen wat ze voorheen niet konden].

## Context en motivatie
[2-4 zinnen: waarom heeft deze gebruiker deze behoefte? Wat proberen ze te bereiken? Wat werkt er vandaag niet zonder dit?]

## Acceptatiecriteria
Formaat: Gegeven [voorwaarde] / Wanneer [actie] / Dan [resultaat]

Schrijf voldoende AC om volledig het gewenste pad ÉN de voornaamste foutstatussen te specificeren.
Minimaal 5, maximaal 12 criteria. Als je meer dan 12 nodig hebt, is het verhaal te groot — splits het.

Gewenst pad AC:
- Gegeven [...]  / Wanneer [...] / Dan [...]
- [...]

Fout / randgeval AC:
- Gegeven [...]  / Wanneer [...] / Dan [...]
- [...]

## Randgevallen en foutstatussen
Maak expliciet een lijst (als opsommingspunten) van wat mis kan gaan:
- Wat als [toestand X]? Verwacht gedrag: [Y]
- Wat als de data [leeg / misvormd / te groot] is? Verwacht: [Y]
- Wat gebeurt er als de gebruiker [uitgelogd / geen toestemming / op mobiel] is?

## Buiten bereik (expliciet)
Wat is NIET inbegrepen in dit verhaal wat iemand zou kunnen aannemen:
- [Uitsluiting 1]
- [Uitsluiting 2]

## Definition of done
Het verhaal is klaar wanneer:
- [ ] Alle acceptatiecriteria slagen
- [ ] Unit tests dekken het gewenste pad en de top 2 foutgevallen
- [ ] Ontwerp beoordeeld en goedgekeurd
- [ ] Werkt op [mobiel / desktop / beide] op [schermgrootte]
- [ ] Toegankelijkheid: [toetsenbordnavigeerbaar / schermlezer getest / WCAG-niveau]
- [ ] Product beoordeeld en goedgekeurd vóór merge

## Verhaalgrootteschatting
Complexiteit: [XS / S / M / L / XL]
Ruwe story points: [1 / 2 / 3 / 5 / 8 / 13]
Redenering: [waarom deze grootte — wat het complex of eenvoudig maakt]
```

### Epic-opsplitsing

```
Splits deze epic op in sprint-formaat gebruikersverhalen.

Epic: [beschrijf de epic — functie of initiatief op hoog niveau]
Epic-doel: [welk resultaat bereikt deze epic wanneer volledig klaar?]
Sprint-snelheid team: [X story points per sprint]
Beoogde oplevering: [datum of sprint-doel]

Regels voor epic-opsplitsing:
- Elk verhaal moet binnen één sprint afrondbaar zijn (bij voorkeur ≤ 5 story points)
- Elk verhaal moet zelfstandig leverbaar zijn (kan naar productie zonder het volgende)
- Verhalen moeten het verticale schijf-patroon volgen — dunne end-to-end schijven, geen horizontale lagen
  (maak geen "backend API" en "frontend UI" als aparte verhalen — dat is een technische splitsing, geen gebruikerswaarde-splitsing)
- Orden verhalen op waarde: welk verhaal levert op zichzelf de meeste gebruikerswaarde?

Voor elk verhaal in de epic:
1. Verhaalstitel en gebruikersverhaalformaat
2. 3-5 acceptatiecriteria (verkort — volledige AC komt bij sprint planning)
3. Story points schatting
4. Afhankelijkheden van andere verhalen (indien aanwezig)
5. Kan dit verhaal naar productie zonder het volgende? (Ja / Nee — indien Nee, leg uit)

Produceer de verhaalkaart: [Epic] → [Verhalen in prioriteitsvolgorde]
Identificeer de MVP-schijf: de minimale set verhalen die de epic bruikbaar maakt.
```

### Generator voor acceptatiecriteria

```
Schrijf acceptatiecriteria voor dit verhaal: [PLAK BESTAAND VERHAAL]

Regels voor goede AC:
- Geschreven in Gegeven/Wanneer/Dan-formaat (Gherkin-compatibel indien Cucumber wordt gebruikt)
- Test één ding tegelijk — niet "gebruiker kan X en Y en Z doen"
- Specifiek genoeg zodat twee engineers hetzelfde bouwen
- Dekt: gewenst pad, validatiefouten, lege statussen, toestemmingsrandgevallen, laadstatussen
- Vermijdt implementatiedetails: "de knop wordt groen" is slecht; "de gebruiker ziet een succesbevestiging" is goed

Kwaliteitschecklist AC — elke AC moet slagen:
✅ Kan een QA-engineer een test schrijven op basis van alleen deze AC? Zo nee, te vaag.
✅ Is het verwachte resultaat observeerbaar (zichtbaar, meetbaar, testbaar)? Zo nee, herschrijf.
✅ Legt deze AC een gebruikersgedrag vast, geen implementatiekeuze? Zo nee, herformuleer.
✅ Kunnen twee engineers dit anders interpreteren? Zo ja, voeg specificiteit toe.

Genereer [N] acceptatiecriteria voor mijn verhaal, inclusief:
- Gewenst pad (hoofdsucces-scenario)
- Invoervalidatie (slechte data, ontbrekende verplichte velden)
- Randgevallen (lege staat, maximale limieten, gelijktijdige acties)
- Foutafhandeling (wat er gebeurt als de backend faalt)
- Toestemming / auth-statussen (indien relevant)
```

### Technieken voor verhaalopsplitsing

```
Dit verhaal is te groot (geschat [X] punten). Help me het op te splitsen.

Te splitsen verhaal: [PLAK VERHAAL]
Teambeperking: verhalen moeten ≤ [3 / 5] story points zijn

Opsplitsingsmethoden (kies de juiste op basis van het verhaal):

1. PER WERKSTROOM-STAP:
   Als het verhaal meerdere stappen in een stroom omvat, splits per stap.
   Voorbeeld: "Gebruiker kan onboarding voltooien" →
   - Verhaal 1: Gebruiker kan naam en e-mail invoeren (stap 1)
   - Verhaal 2: Gebruiker kan e-mailadres verifiëren (stap 2)
   - Verhaal 3: Gebruiker kan abonnement selecteren (stap 3)

2. PER BEDRIJFSREGEL:
   Als het verhaal meerdere regels of condities heeft, splits per regel.
   Voorbeeld: "Beheerder kan gebruikers filteren op meerdere criteria" →
   - Verhaal 1: Filteren op status (actief / inactief)
   - Verhaal 2: Filteren op rol
   - Verhaal 3: Filteren op aanmelddatumbereik

3. GEWENST PAD EERST:
   Bouw het gewenste pad, sla foutafhandeling en randgevallen over.
   Voorbeeld: "Exporteer naar CSV met volledige validatie" →
   - Verhaal 1: Exporteer naar CSV (alleen gewenst pad, geen validatie)
   - Verhaal 2: Voeg validatie toe — wat als er geen data is? Te veel rijen? Export in uitvoering?

4. PER DATAVARIATIE:
   Als het verhaal anders werkt voor verschillende datatypes, splits per type.
   Voorbeeld: "Gebruiker kan een document uploaden" →
   - Verhaal 1: PDF uploaden
   - Verhaal 2: DOCX en XLSX uploaden
   - Verhaal 3: Te grote bestanden en formaatfouten afhandelen

5. PER CRUD-BEWERKINGEN:
   Splits Aanmaken / Lezen / Bijwerken / Verwijderen in aparte verhalen indien groot.
   Doe dit alleen als elke bewerking onafhankelijke gebruikerswaarde heeft.

Aanbevolen beste opsplitsing voor mijn verhaal en produceer de sub-verhalen.
```

### Verhaalskwaliteitscontrole

```
Beoordeel dit gebruikersverhaal op kwaliteit. [PLAK VERHAAL]

Voer deze checklist uit:

VERHAALFORMAAT:
✅ Is er een duidelijk "Als een [gebruiker], wil ik [actie], zodat [resultaat]" formaat?
✅ Is het gebruikerstype specifiek (niet alleen "gebruiker" of "beheerder")?
✅ Is het "zodat" een resultaat (geen functie)?

ACCEPTATIECRITERIA:
✅ Zijn er ten minste 4 AC?
✅ Gebruikt elke AC Gegeven/Wanneer/Dan of een gelijkwaardig gestructureerd formaat?
✅ Zijn de AC testbaar en specifiek genoeg om een geautomatiseerde test te schrijven?
✅ Dekt ten minste één AC een fout of randgeval?
✅ Zijn er AC die verwijzen naar UI-implementatiedetails die verwijderd moeten worden?

GROOTTE:
✅ Is het verhaal ≤ 5 story points (2-3 dagen werk)?
✅ Als > 5 punten, is er een duidelijke reden waarom het niet gesplitst kan worden?

DEFINITION OF DONE:
✅ Is er een expliciete definition of done?
✅ Omvat het: tests, ontwerpbeoordeling, toegankelijkheid, product-goedkeuring?

ONAFHANKELIJKHEID:
✅ Kan dit verhaal gebouwd en gedeployed worden zonder op een ander verhaal te wachten?
✅ Zo nee, is de afhankelijkheid expliciet vermeld?

BUITEN BEREIK:
✅ Is er een expliciete sectie "buiten bereik" of "niet inbegrepen"?

Beoordeel het verhaal: [Klaar voor sprint / Verfijning nodig / Significant herwerk nodig]
Geef de top 3 wijzigingen om het sprint-klaar te maken.
```

## Voorbeeld

**Gebruiker:** We hebben een manier nodig voor gebruikers om hun data te exporteren. Er zijn veel verzoeken om. Onze gebruikers zijn voornamelijk data-analisten die cijfers willen verwerken in Excel.

**Uitvoer:**

```markdown
# Verhaal: Dashboarddata exporteren naar CSV voor offline analyse

## Gebruikersverhaal
Als een **data-analist** die het dashboard gebruikt om campagneprestaties bij te houden,
wil ik **de data van de huidige weergave exporteren naar een CSV-bestand**,
zodat **ik het kan laden in Excel of Google Sheets voor aangepaste analyse en stakeholdersrapporten**.

## Context en motivatie
Data-analisten moeten regelmatig prestatiedata delen met stakeholders die geen dashboardtoegang hebben, of analyses uitvoeren waarvoor formules en aangepaste berekeningen nodig zijn die het dashboard niet ondersteunt. Tegenwoordig maken ze screenshots van tabellen of kopiëren ze data handmatig in spreadsheets — dit is foutgevoelig en tijdrovend voor grote datasets.

## Acceptatiecriteria

**Gewenst pad:**
- Gegeven ik een datatable bekijk op het dashboard / Wanneer ik op "Exporteer naar CSV" klik / Dan wordt een CSV-bestand binnen 3 seconden naar mijn computer gedownload
- Gegeven de geëxporteerde CSV / Wanneer ik deze open in Excel of Google Sheets / Dan komen alle kolomnamen overeen met de tabelkoppen en zijn alle zichtbare rijen aanwezig met correcte datatypes (getallen als getallen, datums als datums, niet als tekenreeksen)
- Gegeven filters zijn toegepast op de tabel / Wanneer ik exporteer / Dan worden alleen de gefilterde (zichtbare) rijen geëxporteerd, niet de volledige dataset
- Gegeven op de tabel kolomsortering is toegepast / Wanneer ik exporteer / Dan behoudt de CSV de in de UI getoonde sorteervolgorde

**Validatie en randgevallen:**
- Gegeven de tabel leeg is (geen data komt overeen met de huidige filters) / Wanneer ik op Exporteer klik / Dan zie ik een bericht: "Geen data om te exporteren — probeer je filters aan te passen" en er wordt geen bestand gedownload
- Gegeven de tabel meer dan 50.000 rijen heeft / Wanneer ik op Exporteer klik / Dan zie ik een waarschuwing: "Deze export bevat 50.000+ rijen en kan tot 30 seconden duren. Doorgaan?" met Annuleer- en Exporteer-opties
- Gegeven ik op Exporteer klik op een tabel met 50.000+ rijen en bevestig / Wanneer de export wordt verwerkt / Dan zie ik een voortgangsindicator en kan ik het dashboard blijven gebruiken terwijl het wordt voorbereid
- Gegeven de export mislukt door een serverfout / Dan zie ik: "Export mislukt — probeer het opnieuw of neem contact op met ondersteuning als dit aanhoudt" en ik kan het opnieuw proberen zonder de pagina te vernieuwen

**Toestemmingen:**
- Gegeven ik een Gratis abonnement heb / Wanneer ik probeer te exporteren / Dan zie ik een upgrade-prompt: "CSV-export is beschikbaar op Pro en hoger" met een upgradelink

## Buiten bereik
- Exporteren naar Excel (.xlsx) formaat — alleen CSV in dit verhaal
- Geplande of geautomatiseerde exports — alleen handmatig
- Exporteren van grafieken of visualisaties — alleen datatables
- Specifieke kolommen selecteren om te exporteren — alle zichtbare kolommen worden geëxporteerd

## Definition of done
- [ ] Alle 8 acceptatiecriteria slagen
- [ ] Unit tests dekken het gewenste pad en het "lege staat" randgeval
- [ ] E2E-test dekt downloadstroom in Chrome en Firefox
- [ ] Ontwerp beoordeeld — plaatsing exportknop goedgekeurd
- [ ] Werkt op desktop (1280px+) — mobiel niet vereist voor dit verhaal
- [ ] Product goedgekeurd vóór merge

## Verhaalgrootte: Gemiddeld — 3 story points
Redenering: De kern exportlogica is eenvoudig; de afhandeling van 50.000+ rijen voegt een betekenisvol asynchroon patroon toe dat engineers zorgvuldig moeten ontwerpen.
```

---
