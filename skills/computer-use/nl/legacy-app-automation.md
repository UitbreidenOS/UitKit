---
name: legacy-app-automation
description: Automatiseer desktop- of legacy-apps zonder API via computer use — langzame, geverifieerde, veilige interactie met Win32, VB6, mainframe en thick-client apps.
---

# Legacy App Automation via Computer Use

## Wanneer activeren

- De doeltoepassing heeft geen API, geen CLI, geen scriptable interface en geen webfrontend
- App is een native desktop-app: Win32, MFC, VB6, Delphi, PowerBuilder, Java Swing, legacy Electron
- Gebruiker moet gegevens uit een app extraheren die deze alleen op het scherm weergeeft
- Automatisering van repetitieve formulierinvoer in een thick-client ERP, CRM of line-of-business app
- Gebruiker zegt "er is geen ander manier om dit te doen" of "de leverancier heeft geen API"
- Mainframe-terminal (3270/5250) automatisering waar geen moderne connector bestaat
- Gegevens migreren uit een legacy-systeem dat alleen via UI-gestuurde dialogen kan exporteren

## Wanneer NIET gebruiken

- De app heeft een API, databaseverbinding of exportfunctie — gebruik deze in plaats daarvan; computer use is het laatste redmiddel
- De automatisering vereist interactie met schermen voor invoer van gegevens (aanmelden met wachtwoord, MFA-codes) — stop en vraag de gebruiker om handmatig eerst te verifiëren
- Het scherm bevat dialogen ter bevestiging van financiële transacties (geldtransfers, betalingsverzendingen) — vereisen expliciete per-actie gebruikersbevestiging
- De app is onstabiel of staat bekend om crashes — automatiseer geen onstabiele software; het risico dat gegevens in een corrupte status achterblijven is te hoog
- Je kunt de uitkomst van elke actie niet verifiëren (de app geeft geen visuele feedback) — blindelings klikken is niet acceptabel
- De taak vereist snelheid boven veiligheid — legacy app automatisering moet langzaam en geverifieerd zijn; als snelheid prioriteit heeft, zoek een ander benadering

## Instructies

### Basisbeoordeling

Voordat je iets aanraakt:

1. Maak een volledige schermafbeelding van de app in zijn starttoestand.
2. Identificeer en documenteer:
   - App-naam en versie (zichtbaar in titelbalk of Over-dialoog)
   - Huidig scherm/weergave
   - Wat is het doel van de gegevens of actie
   - Eventuele waarschuwingsdialogen of bevestigingsprompts die kunnen verschijnen
3. Vraag de gebruiker: "Ben je al ingelogd? Zijn er bevestigingsprompts waarvan ik me bewust moet zijn?"
4. Stel een herstelplan op: wat doet de gebruiker als de automatisering de app in een slechte toestand achterlaat?

### Het principe van langzaam en geverifieerd

Legacy-apps zijn fragiel. Een klik op het verkeerde element, een toetsaanslag die aankomt terwijl een dialoog nog wordt geladen, of een focusgebeurtenis op het verkeerde veld kan gegevens corrumperen of onherroepbare acties triggeren.

Elke actie volgt deze volgorde — geen uitzonderingen:

```
1. OBSERVEER  — schermafbeelding, bevestig dat de app in de verwachte toestand is
2. LOKALISEER — identificeer het exacte doelelement (op label, positie, tabvolgorde)
3. VERTEL    — zeg wat je gaat doen en wat het resultaat zou moeten zijn
4. HANDELEN  — voer de enkele, minimale actie uit
5. WACHT     — pauze opdat de app kan reageren (legacy-apps zijn vaak langzaam; wacht op visuele verandering)
6. VERIFIEER — schermafbeelding, bevestig dat het resultaat verwachting matchte
7. LOG       — noteer het stapresultaat voordat je doorgaat
```

Kettening twee acties nooit zonder het verificatiestap van de eerste af te maken.

### Interactiepatronen voor legacy-apps

**Keyboard-first-benadering**: Veel legacy-apps hebben onbetrouwbare muisklikdoelen. Geef voorkeur aan toetsbordnavigatie:
- Tab om door velden te bladeren
- Enter om te bevestigen
- Alt+[onderstreepte letter] voor menuvisualisators
- F-toetsen voor veelgebruikte acties (F3 zoeken, F4 nieuw, F8 indienen — varieert per app)

**Timing**: Voeg bewuste pauzes in na:
- Een nieuw scherm openen (wacht tot het scherm volledig is weergegeven)
- Een record opslaan (wacht op de bevestigingsindicator)
- Een query of zoeking uitvoeren (wacht tot resultaten zijn geladen)
- Elke netwerkoproep (statusbalk toont vaak activiteit)

**Veldinvoerdiscipline**:
1. Klik of tab naar het veld.
2. Drievoudig klikken om bestaande inhoud te selecteren (ga niet uit van lege veld).
3. Typ de nieuwe waarde.
4. Schermafbeelding om te bevestigen dat de waarde correct is ingevoerd voordat je doorgaat.

**Bevestigingsdialogen**: Wanneer een bevestigingsdialoog verschijnt:
- Maak er onmiddellijk een schermafbeelding van.
- Lees de exacte tekst van de dialoog — ga niet uit van iets.
- Als de dialoog voor een destructieve of onherroepbare actie is, stop en vraag de gebruiker om te bevestigen voordat je OK klikt.

### Veiligheidsregels — verplicht

- **Automatiseer nooit financiële transacties** (betalingen, geldtransfers, journaalposten, facturen) zonder dat de gebruiker elke transactie expliciet bevestigt voordat je OK/Indienen klikt.
- **Voer nooit gegevens in of communiceer met gegevensvelden** (wachtwoorden, tokens, PINs). Vraag de gebruiker om handmatig in te loggen voordat je begint.
- **Interactie met schermen met gezondheidgegevens** (patiëntenverslagen, labuitslagen, recepten) — bevestig dat de gebruiker de juiste toestemming heeft en dat de omgeving geschikt is.
- **Stop op onverwachte schermen**: als een scherm verschijnt dat niet onderdeel was van de geplande flow (fout, onverwachte dialoog, verkeerde weergave), stop volledig, maak een schermafbeelding en rapporteer aan de gebruiker voordat je iets anders doet.
- **Geen bulk onherroepbare acties**: automatiseer massaverwijderingen, bulkupdates of batchverzendingen niet zonder een menselijk controlekader na een kleine pilotbatch.

### Gegevensextractiepatroon

Wanneer het doel is om gegevens uit een legacy-app te lezen/exporteren:

1. Navigeer naar de gegevensweergave.
2. Maak schermafbeeldingen van elk scherm met gegevens.
3. Als de app een afdruk- of exportfunctie heeft (zelfs naar een afdrukdialoog), gebruik deze — een PDF-export is veiliger dan handmatige transcriptie.
4. Als transcriptie onvermijdelijk is, transcribeer zichtbare velden één record tegelijk, schermafbeelding elk record als bewijs.
5. Na extractie, valideer een monster van geëxtraheerde waarden tegen de bronweerergave op het scherm.

### Formulierinvoerpatroon

Wanneer het doel is om gegevens in de legacy-app in te voeren:

1. Gebruiker verschaft de gegevens in een gestructureerde indeling (CSV, lijst, JSON) voordat automatisering begint.
2. Verwerk één record tegelijk.
3. Nadat elk record is opgeslagen, schermafbeelding de bevestiging en log de record-ID of bevestigingsbericht.
4. Als een record mislukt, stop de batch, rapporteer de fout en wacht op gebruikersinstructie voordat je doorgaat.

### Herstel en foutafhandeling

Als de app een onverwachte toestand aanneemt:

1. Klik niet op iets. Maak eerst een schermafbeelding.
2. Zoek naar een Escape-toets of Annuleren-knop om de huidige bewerking veilig af te sluiten.
3. Controleer of de bewerking al is ingediend (zoek naar een succes-/foutstatus-bericht).
4. Rapporteer exacte schermtoestand aan de gebruiker en vraag om begeleiding.
5. Probeer een onbekende toestand niet "op te lossen" door te gissen — stop en rapporteer.

## Voorbeeld

**Scenario**: Exporteer 50 klantenrecords uit een legacy VB6 CRM die geen exportfunctie heeft. Elk record moet afzonderlijk worden geopend en sleutelgegevens worden getranscribeerd.

**App**: "CustomerBase 2.4" — VB6-app, lijstweergave toont klant-ID's, dubbelklik opent detailscherm.

**Uitvoering**:

1. Schermafbeelding: Bevestig dat de app is geopend in de klantlijstweergave. 50 records zichtbaar.
2. Dubbelklik op eerste record (Klant-ID: 10042). Wacht op detailscherm.
3. Schermafbeelding: Detailscherm geladen — Naam, Telefoon, E-mail, Accounttype zichtbaar.
4. Transcribeer: `{"id": "10042", "name": "Acme Corp", "phone": "555-0192", "email": "billing@acme.com", "type": "Enterprise"}`.
5. Schermafbeelding: Bevestig dat getranscribeerde waarden op-scherm waarden matchen.
6. Druk Escape om terug te keren naar lijst. Schermafbeelding: Lijstweergave hersteld.
7. Herhaal voor record 10043.

Na 5 records, valideer de geëxtraheerde gegevens tegen schermafbeeldingen — controleer op transcriptiefouten voordat je de batch doorzet.

Na alle 50 records:
- Geef de gestructureerde gegevens aan de gebruiker.
- Voeg een monster schermafbeeldingen als bewijs van nauwkeurigheid bij.
- Noteer alle records waarbij gegevens onduidelijk waren of velden leeg waren.

**Wat zou een stop veroorzaken**:
- Detailscherm opent naar een "Betalingsgeschiedenis"-tabblad met invoebedragen — stop, rapporteer, vraag of dit scherm in bereik is.
- Een dialoog "Record verwijderen" bevestiging verschijnt onverwacht — stop onmiddellijk, klik niet op iets, schermafbeelding en rapporteer.
- De app wordt onresponsief na het openen van record 23 — stop, rapporteer de toestand, retry niet zonder gebruikersbevestiging.
