# Incrementele constructie met bevestigingspoorten

Construeert een functie stap voor stap met verplichte mensenrevisie tussen elke fase. Claude voert zich vast aan fasegrenzen voordat deze begint en kan het bereik niet halverwege de fase vergroten. Voorkomt bereikverspreiding, vangt integratieprobleem vroeg en houdt mensen in controle over de constructierichting.

---

## Wanneer te gebruiken

- Een functie construeren die meer dan drie bestanden of twee subsystemen raakt
- Hoogrisicofuncties waar gedeeltelijke voltooiing erger is dan geen voltooiing (authenticatie, facturering, migraties)
- Collaboratieve bouw waar een niet-technische belanghebbende elke toename moet herzien
- Elke taak waar u eerder Claude zag iets correct construeren maar niet wat u wilde

---

## Fasen

### Fase 0 — Fasebepaling (verplichte eerste stap)

Voordat code wordt geschreven, definieert Claude het volledige faseplan. Dit is het contract.

```
Ik wil construeren: [beschrijf de functie]

Voordat u code schrijft, maakt u een faseplan.

Voor elke fase:
  - Fasenaam (bijv. "Fase 1: Gegevensmodel")
  - Bereik: precies wat zal worden gemaakt of gewijzigd (bestandsnamen, geen beschrijvingen)
  - Uitvoer: wat de gebruiker aan het einde van deze fase zal zien of kan verifiëren
  - Succescriteria: hoe we weten dat deze fase correct is voltooid (testcommando, handmatige controle, enz.)
  - Herstelplan: hoe deze fase ongedaan maken als we deze afwijzen (tabel laten vallen, bestanden verwijderen, commit terugdraaien)
  - Expliciete bereiksgrens: wat NIET in deze fase is opgenomen

Regels voor het faseplan:
  - Geen fase mag meer dan 5 bestanden aanraken
  - Elke fase moet onafhankelijk herzienbaar zijn zonder de volgende fase te vereisen
  - Fasegrenzen moeten op natuurlijke naden liggen (gegevensmodel, API, UI — niet "halve API")
  - Geen fase mag "en ook" bevatten — als u verzocht bent bereik toe te voegen, maakt u een nieuwe fase

Presenteer het faseplan. Niet met codering beginnen tot ik het goed heb gekeurd.
```

Gebruiker herzie en keurt goed, wijst af of herstructureert het faseplan voordat werk begint. Dit is de enige keer om bereik opnieuw in te delen.

---

### Fase 1–N — Uitvoeringspatroon

Elke fase volgt dezelfde structuur. Vervang `[N]` en `[fasenaam]` dienovereenkomstig.

**Fasestarten:**
```
Begin fase [N]: [fasenaam].

Bereiksherinnering: [plak het bereik van het goedgekeurde plan]
Bereiksgrens: [plak wat NIET is opgenomen]

Implementeer alleen wat in bereik valt. Als u iets vindt dat nodig lijkt maar buiten bereik valt, STOP en vertel het me — voeg het niet eenzijdig toe. Ik zal bepalen of ik deze fase uitbreid of fase [N+1] toevoeg.
```

**Tijdens fase:**
- Claude schrijft code en voert tests alleen uit voor het bereik van deze fase
- Als Claude een bereiksafhankelijkheid ontdekt (Fase 2 vereist iets uit Fase 3), stopt het en meldt het in plaats van vooruit te gaan
- Geen commits tot gebruiker herzien

**Herinnering voor einde van fase:**
```
Fase [N] is voltooid. Voordat ik herzie:

1. Lijst alle bestanden op die u hebt gemaakt of gewijzigd
2. Toon de uitvoer die ik moet verifiëren (testresultaten, serverreactie, UI-schermafbeeldingsverzoek, enz.)
3. Bevestig de succescriteria uit het plan: [plak criteria]
4. Markeer alle afwijkingen van het goedgekeurde bereik (ook klein)

Begin fase [N+1] niet tot ik expliciet "verder gaan" zeg.
```

**Poortbeslissing:**

| Beslissing | Actie |
|---|---|
| "Doorgaan" | Claude begint fase N+1 met hetzelfde uitvoeringspatroon |
| "Fase [N] herhalen" | Claude gaat terug naar de toestand vóór fase N begon (met herstelplan) en probeert opnieuw |
| "Bereik wijzigen" | Pauze — gebruiker en Claude onderhandelen bereik van fase N+1 opnieuw voordat u doorgaat |
| "Hier stoppen" | Workflow eindigt; Claude documenteert wat compleet is en wat blijft |

---

### Laatste fase — Integratiecontrole

Na individuele goedkeuring van alle fasen voert u een integratiecontrole uit.

```
Alle fasen zijn voltooid. Voer integratiecontrole uit:

1. Voer volledige testsuite uit (niet alleen nieuwe tests)
2. Lijst testfouten, waarschuwingen of typefouten op die door deze build zijn geïntroduceerd
3. Controleer dat herstelplannen voor elke fase nog geldig zijn (niet ongeldig gemaakt door latere fasen)
4. Maak een eenparagraaffsamenvatting van wat gebouwd is en wat de gebruiker nu kan doen

Repareer integratiefouten niet eenzijdig — rapporteer ze en wacht op instructie.
```

---

## Antibereikverspreiding Regels

Deze regels gelden voor Claude in de gehele workflow. Plak ze in CLAUDE.md als u ze projectwijd wilt afdwingen:

```
Tijdens incrementele constructie:
- Voeg nooit code toe buiten het bereik van de huidige fase, ook al lijkt het duidelijk nodig
- Voer nooit "terwijl ik in dit bestand ben" aanvullende wijzigingen uit
- Maak nooit bestanden die niet in het goedgekeurde faseplan staan
- Als iets in het plan ontbreekt maar vereist is, STOP en rapporteer — voeg het niet stilzwijgend toe
- Commits vinden plaats aan fasegrenzen, niet halverwege de fase
```

---

## Voorbeeld

Functie: "E-mailmelding toevoegen wanneer een bestelling wordt verzonden"

Faseplan (uitvoer van Fase 0):
- **Fase 1: E-mailsjabloon** — Maak `emails/order-shipped.html` en `emails/order-shipped.txt`. Succes: sjabloon wordt weergegeven met testgegevens. Herstel: verwijder beide bestanden.
- **Fase 2: E-mailserviceintegratie** — Voeg `sendOrderShippedEmail(orderId)` toe aan `services/email.ts`. Geen UI, geen triggers. Succes: `npm run test:email` slaagt. Herstel: draai `services/email.ts` terug.
- **Fase 3: Trigger bij verzending** — Verbind de serviceoproep in `handlers/shipment.ts` wanneer status in `shipped` verandert. Succes: end-to-end-test slaagt. Herstel: draai `handlers/shipment.ts` terug.

Gebruiker keurt plan goed. Claude voert Fase 1 uit. Gebruiker herzie sjabloon, zegt "doorgaan". Claude voert Fase 2 uit. Tijdens Fase 2 merkt Claude op dat de e-mailservice een API-sleutel nodig heeft die niet in config zit — het stopt en meldt dit in plaats van eenzijdig de configsleutel toe te voegen. Gebruiker voegt sleutel toe, zegt "doorgaan". Fase 3 voltooid. Integratiecontrole geslaagd.

---
