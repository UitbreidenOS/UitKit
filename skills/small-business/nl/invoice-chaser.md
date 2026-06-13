---
name: invoice-chaser
description: "Automatiseer debiteuren: concept aanmaningsschrijven, escalatiesequenties, wanbetaalrisicowaarschuwingen — voor QuickBooks, Stripe of elk factureringshulpmiddel"
---

# Invoice Chaser Skill

## Wanneer activeren
- U heeft achterstallige facturen en heeft vervolgberichten nodig
- Een multi-touch herinnersingssequentie voor slechte betalers opzetten
- Klanten met betalingsrisico identificeren
- Escalatie-e-mails opstellen wanneer een klant niet reageert
- Uw debiteupositie samenvatten

## Wanneer NIET gebruiken
- Facturen minder dan 7 dagen achterstallig — te vroeg, schadelijk voor relaties
- Geschillen waar de klant een geldig bezwaar heeft geuit — eerst oplossen
- Juridische/incassoprocedures — dit is alleen voor pre-juridische benadering

## Instructies

### Beschrijf uw situatie aan Claude

Beschrijf het gewoon in duidelijk Engels:

```
Ik heb 3 achterstallige facturen:
- Acme Corp: $4.200 — 14 dagen achterstallig
- Smith & Co: $850 — 32 dagen achterstallig
- Blue Sky Ltd: $12.000 — 45 dagen achterstallig, geen reactie op laatste 2 e-mails

Stel passende vervolgberichten op voor elk.
```

Claude zal:
- Toon-passende berichten schrijven (vriendelijke herinnering na 14 dagen, strenger na 32, formeel schrijven na 45)
- Het specifieke bedrag en achterstallige dagen refereren
- Een duidelijke call-to-action opnemen (nu betalen / ontvangstbevestiging / contacteer ons)
- De juiste volgende stap voor elk achterstand-niveau voorstellen

### De escalatieladder

| Dagen achterstallig | Toon | Actie |
|---|---|---|
| 1–14 | Vriendelijke herinnering | "Ik wilde even checken — is dit kwijt?" |
| 15–30 | Beleefd vervolgbericht | "Dit is nu X dagen achterstallig, alstublieft bericht" |
| 31–60 | Formeel schrijven | "Betaling is vereist binnen 7 dagen om rente te vermijden" |
| 60+ | Formele vordering | "Bericht van achterstallige betaling — actie vereist" |
| 90+ | Pre-incasso | "Laatste bericht voor doorverwijzing naar incasso" |

### Een sequentie instellen

```
Ik wil een automatische 4-staps sequentie instellen voor elke onbetaalde factuur:
- Dag 3 na vervaldatum: zachte herinnering
- Dag 14: vervolgbericht met betalingslink
- Dag 30: formeel schrijven met vermelding van rentebeleid
- Dag 45: laatste bericht voor incasso

Schrijf sjablonen voor alle 4 fasen. Mijn bedrijf is een webdesignstudio, gemiddelde factuur is $2.000–$8.000.
```

### Uw debiteupositie analyseren

```
Hier zijn mijn openstaande facturen van QuickBooks [plakken of beschrijven]:
- Klant A: $X, vervaldatum, laatste contact
- Klant B: $X, vervaldatum, laatste contact

Categoriseer op risico (laag/gemiddeld/hoog), totaal ausstanden, en beveel prioriteitsacties aan.
```

### Extraction uit QuickBooks

```
Ik heb dit uit QuickBooks geëxporteerd [data plakken].
Welke facturen hebben onmiddellijke aandacht nodig?
Stel aanmaningsberichten op voor alles boven 30 dagen.
```

## Voorbeeld

**U zegt:**
```
Klant: Johnson Consulting
Factuur: $6.500 voor websiteherziening
Vervallen: 28 dagen geleden
Vorig contact: Factuur verzonden, sindsdien geen reactie
Mijn toon: professioneel maar beslist
```

**Claude produceert:**
```
Onderwerp: Factuur #1042 — Betaling verschuldigd ($6.500)

Hallo [Naam],

Ik hoop dat het goed gaat. Ik volg Factuur #1042 voor $6.500 op,
die op [datum] verschuldigd was en nu 28 dagen achterstallig is.

Ik begrijp dat het druk wordt — laat me weten als u vragen hebt
over de factuur of als er een probleem is dat ik kan helpen oplossen.

Mocht de betaling al zijn verzonden, neger dit bericht dan en deel
het referentienummer zodat ik mijn gegevens kan bijwerken.

U kunt hier online betalen: [betalingslink]

Dank je voor je snelle aandacht.
```

---
