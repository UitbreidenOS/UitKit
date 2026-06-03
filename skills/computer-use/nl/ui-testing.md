---
name: ui-testing
description: Ondersteun native of web UI om gebruikersstromen end-to-end te testen via computergebruik — screenshot, klik, assertion en rapportage.
---

# UI-testing via computergebruik

## Wanneer activeren

- Gebruiker vraagt om een gebruikersstroom in een lopende app (web of native) te testen zonder een bestaande testomgeving
- De app heeft geen testbare API-surface en de UI is de enige interface
- Een Playwright of Cypress suite bestaat maar de gebruiker wil een snelle controle zonder de volledige suite uit te voeren
- Gebruiker zegt "test deze stroom handmatig", "klik door en verifieer" of "zorg dat de UI werkt"
- U moet verifiëren dat een nieuw gedeployde build correct werkt voor een specifieke gebruikersreis
- De app gebruikt een framework dat moeilijk is om te instrumenteren (Electron, Tauri, Qt, native macOS/Windows apps)
- Gebruiker vraagt expliciet om computergebruik boven Playwright te verkiezen om een specifieke reden (snelheid, geen test-infrastructuur, CI niet beschikbaar)

## Wanneer NIET gebruiken

- Een Playwright, Cypress of Selenium suite dekt de stroom al — voer de bestaande tests eerst uit
- De app vereist login met echte referenties opgeslagen in een wachtwoordbeheerder — klik niet in schermen met referenties
- De stroom raakt betalingsformulieren, medische gegevens of enig scherm met PII — stop en vraag de gebruiker
- U bent in een productieomgeving — computergebruik in prod is risicovol; bevestig omgeving eerst
- Het scherm is niet zichtbaar of de app is niet aan het lopen — probeer geen blinde acties
- De gebruiker wil een permanente, reproduceerbare testartefact — schrijf in plaats daarvan een Playwright test

## Instructies

### Pre-flight checklist

1. Bevestig dat de doelapplicatie aan het lopen is en zichtbaar op het scherm voordat u actie onderneemt.
2. Vraag welke omgeving (lokale dev, staging, prod). Als prod, waarschuwen en vereis expliciete bevestiging.
3. Identificeer de gebruikersstroom die u wilt testen: startstatus, reeks acties, succesvoorwaarde.
4. Maak een eerste screenshot om de basisstatus vast te stellen.

### Veiligheidsregels

- Interacteer nooit met schermen die tonen: wachtwoorden, API-sleutels, creditcardvelden, SSN-velden, medische gegevens, banksaldi.
- Voordat u klikt, vertelt u wat u gaat doen en wat u verwacht te gebeuren.
- Na elke actie maakt u een screenshot en verifieert u dat het scherm als verwacht is gewijzigd voordat u doorgaat.
- Als het scherm een onverwachte status toont (fout, verkeerde pagina, modaal), stop en rapporteer — klik niet blind verder.
- Beperk elke testsessie tot één duidelijk begrensde stroom. Koppel geen niet-gerelateerde stromen.

### Testingloop

Voor elke stap in de gebruikersstroom:

1. **Beschrijven** — Geef aan wat u gaat doen en het verwachte resultaat.
2. **Handelen** — Voer de enkele actie uit (klik, typ, scroll, toetsinvoer).
3. **Screenshot** — Leg het scherm vast onmiddellijk na de actie.
4. **Assertion** — Controleer het scherm op de verwachte status:
   - Correcte pagina/weergave geladen
   - Verwachte UI-elementen zichtbaar (knoptekst, koppelingtekst, formulierveld)
   - Geen foutbanners, toast-berichten met foutkopiën of verbroken lay-outs
5. **Registreren** — Noteer slagen/mislukken voor deze stap met de screenshot-referentie.

Herhaal totdat de succesvorigwaarde wordt bereikt of een fout wordt gedetecteerd.

### Wanneer computergebruik boven Playwright te verkiezen

| Situatie | Voorkeur |
|---|---|
| Geen test-infrastructuur bestaat, snelle eenmalige controle | Computergebruik |
| App is Electron / native / geen DOM-toegang | Computergebruik |
| Een layoutfout reproduceren die een gebruiker heeft gerapporteerd | Computergebruik |
| Een deelbare, uitvoerbare testbestand nodig | Playwright |
| Stroom wordt bij elke deployment getest | Playwright |
| CI-pijplijn beschikbaar | Playwright |

### Resultaten rapporteren

Na het voltooien van de stroom, produceer een beknopt rapport:

```
Stroom: [naam]
Omgeving: [lokaal/staging/prod]
Geteste stappen: [n]
Slagen: [n]
Mislukken: [n]

Stap voor stap:
1. [actie] → SLAGEN — [wat werd waargenomen]
2. [actie] → MISLUKKEN — [wat werd waargenomen vs verwacht]

Screenshots: [lijst met vastgelegde screenshots]
Aanbeveling: [repareer X in stap 2 / alles duidelijk]
```

### Veelgemaakte fouten

- Coördinaten klikken die verschuiven bij scrollen — scroll eerst naar element, klik dan
- Animaties vertraging elementweergave — wacht tot het element is gestabiliseerd voordat u assertion doet
- Shadow DOM of canvas-elementen die interactief lijken maar niet zijn — behandel als alleen-lezen visuele controles
- Modalen blokkeren onderliggende UI — sluit of verwerp modalen altijd voordat u paginastatus vaststelt

## Voorbeeld

**Scenario**: Test de aanmeldingsstroom voor een lokale Next.js app op `http://localhost:3000`.

**Stroom gedefinieerd door gebruiker**: Navigate naar /signup, voer e-mailadres en wachtwoord in, klik op "Account aanmaken", verifieer omleiding naar /dashboard met welkomstbericht.

**Uitvoering**:

1. Screenshot nemen — bevestig dat de browser op `/signup` staat, formulier zichtbaar is.
2. Klik op het e-mailpeterveld. Typ `testuser@example.com`. Screenshot — veld bevat e-mail.
3. Klik op het wachtwoordveld. Typ `TestPass123!`. Screenshot — veld toont gemaskeerde tekens.
4. Klik op "Account aanmaken" knop. Screenshot — controleer op laadstatus.
5. Wacht op omleiding. Screenshot — URL-balk toont `/dashboard`.
6. Assertion: koppelingtekst "Welkom, testuser" zichtbaar op scherm. SLAGEN.

**Rapport**:
```
Stroom: Aanmelden → Dashboard
Omgeving: lokaal
Geteste stappen: 5
Slagen: 5 / Mislukken: 0

Alle stappen geslaagd. Gebruiker kan aanmelden voltooien en het dashboard bereiken.
```

Als stap 5 in plaats daarvan een "Er is iets misgegaan" toast toonde, zou het rapport MISLUKKEN markeren bij stap 5 met de screenshot en stoppen — geen verdere klikken.
