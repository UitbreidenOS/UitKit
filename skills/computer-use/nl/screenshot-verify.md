---
name: screenshot-verify
description: Screenshot vastleggen en controleren dat een codewijziging correct is weergegeven — de "zien dat het werkt" lus na een bewerking.
---

# Screenshot Verify

## Wanneer activeren

- Gebruiker zegt "controleer of dit er goed uitziet", "controleer dat de wijziging is weergegeven", of "werkt het visueel"
- Je hebt zojuist een codewijziging gemaakt en wilt bevestigen dat de wijziging zichtbaar is in de draaiende app voordat je klaar bent
- Een build is opnieuw geladen en de gebruiker wil bevestigen dat de nieuwe versie live is
- Je moet de lus afsluiten na een CSS-, layout- of componentwijziging — de bewerking alleen is geen bewijs
- De gebruiker vraagt "kun je het werkend zien" of "toon me een screenshot na de fix"
- Debuggen van een wijziging die "zou moeten werken" — bevestigen of de nieuwe code daadwerkelijk wordt uitgevoerd
- Een feature flag, omgevingsvariabele of configuratiewijziging controleren die visueel van kracht is geworden

## Wanneer NIET gebruiken

- De wijziging is puur backend/API zonder visuele uitvoer — gebruik in plaats daarvan test-uitvoering of logs
- De app draait niet en kan niet worden gestart zonder door de gebruiker verstrekte inloggegevens of omgevingsinstellingen
- De visuele status kan niet worden bereikt zonder in te loggen via een gevoelig inlogscherm
- De gebruiker zegt expliciet "voer gewoon de tests uit, controleer niet visueel"
- De wijziging is in een component zonder weergegeven uitvoer (hulpfunctie, typedefinitie, alleen server-side logica)

## Instructies

### De verify lus

De verify lus is de minimale cyclus om de kloof tussen "ik heb een wijziging aangebracht" en "ik kan zien dat de wijziging werkt" te dichten:

```
BEWERKING → HERLADEN → NAVIGEREN → SCREENSHOT → CONTROLEREN → RAPPORTEREN
```

Elke fase wordt hieronder beschreven.

### Fase 1: BEWERKING

Bevestig dat de wijziging op schijf is opgeslagen. Als je de bewerking hebt gemaakt, is deze opgeslagen. Als de gebruiker de bewerking heeft gemaakt, vraag: "Is het bestand opgeslagen?" voordat je doorgaat.

Noteer het exacte bestand en de regel die is gewijzigd, zodat je weet welke visuele uitvoer je kunt verwachten.

### Fase 2: HERLADEN

Trigger het opnieuw laden van de draaiende toepassing:

**Webapp (browser)**:
- Als hot module replacement (HMR) actief is, is de wijziging mogelijk al opnieuw geladen. Controleer de browserconsole op HMR-activiteit.
- Indien niet, trigger een hard reload: Cmd+Shift+R (macOS) of Ctrl+Shift+F5 (Windows).
- Wacht tot de indicator voor netwerkactiviteit stopt voordat je een screenshot maakt.

**Native / Electron app**:
- Controleer of live reload is geconfigureerd. Zo ja, wacht op de reload-indicator.
- Als er geen live reload is, vraag de gebruiker om de app opnieuw te starten of de reload-sneltoets van de app zelf te gebruiken.

**Server-side weergegeven app**:
- Bevestig dat de devserver de wijziging heeft opgepikt (let op bestand wijziging log in terminal).
- Hard reload van de browser.

**Statisch bestand lokaal bediend**:
- Bevestig dat het bestand wordt bediend van schijf (niet een cached versie). Hard reload met cache bypass.

### Fase 3: NAVIGEREN

Navigeer naar de exacte weergave waar de wijziging zichtbaar moet zijn:

1. Noteer de URL of het schermaad voordat je navigeert.
2. Maak een screenshot op de doelweergave voordat je controleert — dit is je bewijs dat het juiste scherm is geladen.
3. Als de wijziging alleen na een gebruikersinteractie wordt weergegeven (klik, zweven, invoer), voer de minimale interactie uit die nodig is om deze op te brengen.

Maak geen screenshot van een pagina die nog aan het laden is — wacht tot de ladingindicator is verdwenen.

### Fase 4: SCREENSHOT

Leg het scherm nauwkeurig vast:

- Scroll naar het gebied waar het gewijzigde element zichtbaar is, indien nodig.
- Als de wijziging zich in een specifiek component bevindt, zoomt u in op dat component na de screenshot van de volledige pagina.
- Maak, indien u een voor-status vergelijkt, een screenshot op dezelfde scroll-positie en viewportbreedte als de screenshot van de voor-status.
- Geef de screenshot een naam met de context: `[component]-[state]-after.png` — gebruik geen generieke namen zoals `screenshot1.png`.

### Fase 5: CONTROLEREN

Onderzoek de screenshot en controleer de specifieke wijziging:

Voor een **CSS-wijziging** (kleur, lettertype, afstand, indeling):
- Is de nieuwe waarde zichtbaar toegepast? Beschrijf wat je ziet.
- Is het consistent op alle exemplaren van het component op dit scherm?
- Zijn er aangrenzende elementen die als bijwerking verbroken lijken?

Voor een **tekst-/inhoudswijziging**:
- Verschijnt de nieuwe tekst precies zoals in de bewerking staat geschreven?
- Bevindt het zich op de juiste locatie (niet verplaatst naar een ander element)?
- Is de oude tekst weg?

Voor een **nieuw component of functie**:
- Wordt het component weergegeven en is het zichtbaar?
- Bevindt het zich op de juiste positie in de indeling?
- Reageert het op de verwachte interactie (zichtbare actieve status, label, pictogram)?

Voor een **bugfix**:
- Is de eerder verbroken status weg?
- Is de gecorrigeerde status aanwezig?
- Beschrijf zowel het oude probleem als de nieuwe status in de controle.

Voor een **config- of feature flag-wijziging**:
- Wordt de voorwaardelijke inhoud naar behoren weergegeven/verborgen?
- Controleer ook de tegenovergestelde voorwaarde als mogelijk — bevestig dat deze niet wordt weergegeven wanneer dit niet zou moeten.

### Fase 6: RAPPORTEREN

Maak een beknopte verificatiestelling na de screenshot-controle:

**Pass-indeling**:
```
Geverifieerd: [wat is gewijzigd]
Screenshot toont: [specifieke waarneming die de wijziging bevestigt]
Geen regressies opgemerkt in aangrenzende elementen.
Status: BEVESTIGD
```

**Fail-indeling**:
```
Verificatie mislukt: [wat is gewijzigd]
Verwacht: [wat de screenshot zou moeten tonen]
Waargenomen: [wat de screenshot werkelijk toont]
Mogelijke oorzaak: [meest waarschijnlijke reden — verkeerd bestand opgeslagen, verkeerde selector, HMR niet actief, cached build]
Volgende stap: [specifieke actie voor onderzoek]
Status: NIET BEVESTIGD
```

### Veelvoorkomende faalmodi en hoe u deze kunt diagnosticeren

| Symptoom | Waarschijnlijke oorzaak | Controleer |
|---|---|---|
| Wijziging niet zichtbaar na reload | Bestand niet opgeslagen of verkeerd bestand bewerkt | Bevestig bestandspad en inhoud |
| Oude versie nog steeds zichtbaar | Browsercache | Hard reload met Cmd+Shift+R |
| Wijziging zichtbaar op verkeerde plek | CSS-selector te breed | Inspecteer selectorbereik |
| Component niet geheel weergegeven | Importfout, voorwaardelijke rendering, feature flag uit | Controleer browserconsole op fouten |
| Wijziging zichtbaar in dev maar niet na build | Buildstap nodig, niet alleen devserver | Voer de buildstap uit |
| App toont leeg scherm na bewerking | Syntaxfout in bewerkt bestand | Controleer terminal/console op compilatiefout |

### Verificatie in meerdere staten

Sommige wijzigingen worden alleen in specifieke staten weergegeven. Voer voor elke relevante staat de verify-lus onafhankelijk uit:

- **Standaardstaat** — initiële rendering zonder gebruikersinteractie
- **Actieve/hover-staat** — na muisinteractie (maak screenshot terwijl je zweeft, indien mogelijk)
- **Foutstaat** — met ongeldige invoer of mislukte fetch
- **Lege staat** — zonder geladen gegevens
- **Laadstaat** — onmiddellijk na het triggeren van een gegevensfetch

### Veiligheidsregels

- Interactie met geen enkel formulier dat gegevens zou kunnen indienen als bijeffect van navigatie om een visuele wijziging te controleren.
- Als het navigatiepad om de gewijzigde weergave te bereiken via een gevoelig scherm loopt (betaling, auth, gezondheid), stop en vraag de gebruiker om daar handmatig heen te navigeren en maak vervolgens een screenshot.
- Verificatie is read-only observatie — maak geen aanvullende bewerkingen tijdens een verify-lus. Als een regressie wordt opgemerkt, meld deze en wacht op instructie.

## Voorbeeld

**Scenario**: Developer veranderde de primaire knopkleur van blauw naar indigo in een Tailwind config. Wil bevestiging dat de wijziging live is in de app.

**Bewerking gemaakt**: `tailwind.config.js` — `primary` kleur bijgewerkt van `#3B82F6` naar `#6366F1`.

**Verify lus**:

1. **HERLADEN**: Browser HMR is actief. Controleer terminal — "Tailwind config changed, rebuilding..." bericht zichtbaar. Wacht tot rebuild compleet bericht.

2. **NAVIGEREN**: Ga naar `http://localhost:3000` — startpagina met zichtbare knop "Get Started" primair.

3. **SCREENSHOT**: Volledige pagina vastleggen. Let op de primaire knop.

4. **CONTROLEREN**: Knopachtergrondkleur is visueel indigo (paars-hellend) niet blauw. Overeenkomstig met de verwachte `#6366F1` toon. Geen andere elementen lijken verbroken. Aangrenzende secundaire knoppen nog steeds grijs.

5. Navigeer naar `/pricing` — een ander primair CTA-knop aanwezig. Screenshot. Dezelfde indigokleur toegepast. Consistent.

**Rapportage**:
```
Geverifieerd: Wijziging primaire knopkleur van blauw (#3B82F6) naar indigo (#6366F1)
Screenshot toont: Zowel homepage CTA als pricing page CTA geven de nieuwe indigokleur weer
Geen regressies opgemerkt — secundaire en tertiaire knoppen ongewijzigd
Status: BEVESTIGD
```

**Als de knop nog steeds blauw was**:
```
Verificatie mislukt: Wijziging primaire knopkleur
Verwacht: Indigo (#6366F1) knopachtergrond
Waargenomen: Knop nog steeds blauw (#3B82F6)
Mogelijke oorzaak: Tailwind JIT heeft config wijziging niet opgepikt, of browser heeft oude CSS gecacht
Volgende stap: Controleer terminal op rebuild fouten; probeer hard reload met Cmd+Shift+R; bevestig dat tailwind.config.js in de content paden staat
Status: NIET BEVESTIGD
```
