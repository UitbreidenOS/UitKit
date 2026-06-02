---
name: health-score-analyzer
description: "Analyse van klantgezondheidsscores: gebruikssignalen, relatiesignalen, commerciële signalen, verlooprisicobeoordeling en aanbevolen CS-interventie per account"
---

# Health Score Analyzer Vaardigheid

## Wanneer activeren
- Je voert je wekelijkse risico-klantreview uit en hebt een gestructureerde analyse nodig
- Je hebt ruwe productgebruiksdata en wilt die vertalen naar een gezondheidsscore
- Een klant is stil geworden of vertoont ongewoon gedrag en je wilt een risicobeoordeling
- Je bouwt of hercalibreeert je gezondheidsscore-model na een golf van onverwacht verloop
- Je bereidt de portfolioreview van je CS-team voor de week voor — welke accounts hebben aandacht nodig?
- Je wilt een account scoren voor een verlenging- of uitbreidingsgesprek

## Wanneer NIET gebruiken
- Het initiële gezondheidsscore-systeem vanaf nul opbouwen — gebruik `/customer-success` voor het modelontwerp
- Diepgaande productanalyse voor interne productbeslissingen — andere functie
- Bepalen of een klant klaar is als referentie of case study — apart signaal
- Verkoopkwalificatiescoring voor prospects — dat is lead-scoring terrein

## Instructies

### Gezondheidsanalyse voor één account

```
Analyseer de gezondheid van dit klantenaccount en geef me een risicobeoordeling.

Klant: [Bedrijfsnaam]
ARR: $[X]
Verlenging: [datum / X maanden weg]
Contracttype: [maandelijks / jaarlijks / meerjarig]
CSM: [naam]
Tenure: [X maanden / jaren als klant]

GEBRUIKSSIGNALEN — haal uit je productanalyse:
- Laatste login (team): [datum — hoeveel dagen geleden?]
- Loginfrequentie deze maand: [X logins] vs. vorige maand: [X logins]
- Kernfunctiegebruik: [wat is hun primaire gebruiksscenario, en gebruiken ze het?]
  - Functie A: [X keer deze maand / niet gebruikt]
  - Functie B: [X keer deze maand / niet gebruikt]
- Actieve gebruikers: [N van N gelicenseerde seats] = [X%] seatbezetting
- Gebruikstrend: [groeiend / stabiel / dalend — over afgelopen 3 maanden]
- Laatste productactie: [beschrijf wat ze recentelijk hebben gedaan]

RELATIESIGNALEN:
- Laatste CSM-contactmoment: [datum — X dagen geleden] [gesprek / e-mail / meeting]
- Kampionstatus: [sterk / zwak / geen kampioen geïdentificeerd / kampioen vertrokken]
- Uitvoerende sponsor: [betrokken / niet betrokken / onbekend]
- NPS-score: [X — promoter / passief / detractor] [datum laatste enquête]
- Supporttickets afgelopen 90 dagen: [N tickets] — typen: [beschrijf]
- Tickets over data-export, API-toegang, of vermeldingen van concurrenten? [ja/nee]
- Reactietijd op CSM-outreach: [snel / langzaam / niet-responsief]

COMMERCIËLE SIGNALEN:
- Factuurstatus: [actueel / X dagen achterstallig]
- Toegepaste korting: [X% — hogere korting = lagere overstapkosten]
- Contractgroeitrend: [uitgebreid / stabiel / ingekrompen sinds begin]
- Stabiliteit stakeholders: [zijn er sleutelcontacten vertrokken?]
- Budgetsignalen: [tekenen van budgetdruk of reorganisatie?]

CONCURRENTIESIGNALEN (indien bekend):
- Concurrent vermeld in supporttickets of gesprekken? [ja/nee — welke concurrent]
- RFP of verzoek om prijsvergelijking? [ja/nee]
- LinkedIn-activiteit kampioen: [pleit nog steeds voor jouw product / stil / vertrokken]

---

Produceer:

GEZONDHEIDSSCORE: [0-100]
Gezondheidsklasse: [GROEN 70-100 / GEEL 40-69 / ROOD 0-39]
Verloopwaarschijnlijkheid: [LAAG / GEMIDDELD / HOOG / KRITIEK]

Top 3 risicosignalen (belangrijkste eerst):
1. [Signaal] — [ernst] — [wat het betekent]
2. [Signaal] — [ernst] — [wat het betekent]
3. [Signaal] — [ernst] — [wat het betekent]

Top 2 positieve signalen:
1. [Signaal]
2. [Signaal]

Aanbevolen interventie:
- [Actie 1 — wie doet het, wanneer]
- [Actie 2 — wie doet het, wanneer]
- Escalatie nodig? [ja / nee — en op welk niveau]

Verlengingsprognose: [waarschijnlijk verlengen / risico / waarschijnlijk verlopen]
Uitbreidingspotentieel: [geen / mogelijk over X maanden / klaar om nu te bespreken]
```

### Portfoliogezondheidsreview

```
Voer een portfoliogezondheidsreview uit over mijn klantenaccounts.

CSM: [naam]
Totaal accounts: [N]
Totaal beheerd ARR: $[X]

[Plak accountdata in dit formaat, één rij per klant:]

| Account | ARR | Verlenging | Laatste Login | Actieve Seats | NPS | Laatste Contact | Problemen |
|---|---|---|---|---|---|---|---|
| Bedrijf A | $24K | 2 maanden | 12 dagen geleden | 8/10 | 42 | 8 dagen geleden | Geen |
| Bedrijf B | $60K | 5 maanden | 45 dagen geleden | 3/10 | 18 | 21 dagen geleden | Open supportticket |
| Bedrijf C | $12K | 1 maand | 3 dagen geleden | 10/10 | 67 | 5 dagen geleden | Geen |
[ga door voor alle accounts]

Produceer:

## Samenvatting portfoliogezondheid
- Totaal ARR op risico (Rode accounts): $[X] ([X%] van portfolio)
- Totaal ARR in geel: $[X]
- Totaal ARR gezond (Groen): $[X]
- Accounts die directe actie vereisen: [N]

## Account-risicoklassen

ROOD — Directe actie vereist:
| Account | ARR | Verlenging | Risicosignaal | Actie |
|---|---|---|---|---|
| [Bedrijf] | $[X] | [X maanden] | [hoofdrisico] | [specifieke actie] |

GEEL — Actieve monitoring:
[zelfde tabel]

GROEN — Gezond / uitbreidingsklaar:
[zelfde tabel]

## CS-prioriteitenlijst deze week
1. [Account] — [waarom urgent] — [specifieke actie]
2. [Account] — [waarom urgent] — [specifieke actie]
3. [Account] — [waarom urgent] — [specifieke actie]

## Verlengingen in de komende 60 dagen — verlengingsgereedheid:
| Account | ARR | Verlengingsdatum | Gezondheid | Benodigde actie |
|---|---|---|---|---|
[tabel]

## ARR op risico dit kwartaal: $[X]
Conservatieve herstelschatting (als acties worden ondernomen): $[X]
```

### Detectie van verloopsignalen

```
Analyseer deze klantensignalen en vertel me het verlooprisico.

Klant: [Bedrijf]
Contract: $[X] ARR, verlengt [datum]

Te evalueren signalen:
[Beschrijf wat je hebt geobserveerd — plak e-mails, samenvattingen van supporttickets, gebruiksdata of notities van gesprekken]

Gebruik dit verloopsignaal-scoringskader:

GEBRUIKSVERSLECHTERING (meest voorspellend):
- Logins daalden > 30% MoM: HOOG risicosignaal
- Kernfunctie niet gebruikt in > 30 dagen: HOOG risicosignaal
- Seatbezetting gedaald onder 40%: GEMIDDELD risicosignaal
- Geen nieuwe gebruikers toegevoegd in > 60 dagen: GEMIDDELD risicosignaal

BETROKKENHEIDSVERSLECHTERING:
- CSM-outreach niet beantwoord in > 7 dagen: HOOG risicosignaal
- Uitvoerende sponsor donker geworden: HOOG risicosignaal
- Kampioen het bedrijf verlaten: KRITIEK — behandel als nieuwe deal
- Klant mist of annuleert geplande gesprekken: HOOG risicosignaal
- NPS gedaald van Promoter naar Passief of Passief naar Detractor: GEMIDDELD risicosignaal

COMMERCIËLE SIGNALEN:
- Factuur > 30 dagen achterstallig: HOOG risicosignaal
- Gevraagd naar contractvoorwaarden, opzeggingsproces of data-export: KRITIEK
- Korting gevraagd zonder vermelde uitbreidingsreden: GEMIDDELD risicosignaal
- Personeelsreductie of budgetbevriezing bij hun bedrijf: GEMIDDELD risicosignaal

CONCURRENTIESIGNALEN:
- Concurrent bij naam genoemd: HOOG risicosignaal
- Prijsvergelijking of RFP gevraagd: KRITIEK
- LinkedIn toont kampioen die nu concurrent product gebruikt: KRITIEK

Scoor de signalen en produceer:
- Verloopwaarschijnlijkheid: [X%] — afgeleid van aantal en ernst van signalen
- Tijdshorizon: waarschijnlijk te verlopen in [30 / 60 / 90+ dagen]
- Hypothese over oorzaak: [waarom dit gebeurt — productfit / support / zakelijke verandering / verkeerd verkocht]
- Opslaanplaybook: [specifieke reeks acties voor dit specifieke risicoprofiel]
- Escalatie: [wie er nog meer bij betrokken moet worden en waarom]
```

### Kalibratie van gezondheidsscore-model

```
Help me mijn gezondheidsscore-model kalibreren op basis van recente verlooopdata.

Context:
- Verlopen accounts afgelopen kwartaal: [N accounts, totaal $X ARR]
- Wat hadden de verlopen accounts gemeen? [beschrijf patronen die je hebt geobserveerd]
- Wat was hun gezondheidsscore de maand voor ze verliepen? [als je het bijhield]
- Accounts die onverwacht verlengden ondanks lage gezondheid: [voorbeelden?]

Te beoordelen gezondheidsscore-model:
Huidige gewichten:
- Gebruikssignalen: [X%]
- Relatiesignalen: [X%]
- Commerciële signalen: [X%]
- Uitkomstsignalen: [X%]

Huidige signaaldefinities:
[beschrijf wat je meet voor elk]

Kalibratieanalyse:

1. Welke signalen waren voorlopende indicatoren (verschenen voor verloop)?
   De beste gezondheidssignalen voorspellen verloop 60-90 dagen van tevoren — niet 2 weken eerder.

2. Welke signalen waren achterblijvend (alleen zichtbaar bij verloop, te laat om te handelen)?
   Achterstallige factuur en opzeggingsverzoeken zijn achterblijvend — dan is het crisismode, geen preventie.

3. Valse positieven — accounts die rood scoorden maar verlengden:
   Wat was er anders aan hen? Pas weging aan om valse alarm-vermoeidheid te verminderen.

4. Valse negatieven — accounts die groen scoorden maar verliepen:
   Welk signaal miste je? Voeg het toe of verhoog het gewicht.

5. Aanbevolen gewichtsaanpassing:
   Voor: [huidige gewichten]
   Na: [aanbevolen gewichten op basis van voorspellende nauwkeurigheid]
   Motivering: [waarom elke wijziging]

6. Toe te voegen nieuwe signalen:
   - [Signaal] — gegevensbron: [waar te vinden] — voorlopend/achterblijvend: [type]

Produceer bijgewerkt gezondheidsscore-model met hergewogen gewichten en signaaldefinities.
```

## Voorbeeld

**Gebruiker:** Een van mijn $85K ARR-accounts is stil geworden. De kampioen heeft in 3 weken niet gereageerd op twee e-mails. Gebruik ziet er oppervlakkig goed uit (ze loggen in) maar het is slechts één persoon. Ze verlengen over 8 weken. Wat doe ik?

**Claude's gezondheidsanalyse:**

**Gezondheidsscore: 34/100 — ROOD**
**Verloopwaarschijnlijkheid: HOOG — risico materialiseert zich nu**

**Wat je beschrijft is een klassiek vals-positief gebruikssignaal:**
Eén persoon logt in om het account "actief" te houden terwijl de aankoopbeslissing achter de schermen plaatsvindt. Echte adoptie is 1 persoon, geen team. Dat is geen gebruikssignaal — dat is een aansprakelijkheidssignaal.

**Actieve risicosignalen:**
1. Kampioen niet-responsief x 2 pogingen (HOOG) — ofwel zijn ze niet langer je kampioen, of het gesprek is boven hun loonschaal terechtgekomen
2. Enkelvoudige gebruikersadoptie (HOOG) — product heeft nooit teamadoptie bereikt; geen interne stakeholders met een belang
3. 8 weken tot verlenging zonder betrokkenheid (KRITIEK) — je hebt geen tijd meer voor normale CS-bewegingen

**Aanbevolen interventie — doe dit deze week, niet volgende week:**

1. **Omzeil de kampioen.** Zoek hun manager of de economische koper op LinkedIn. Stuur een korte, directe e-mail: "Ik heb geprobeerd [Naam] te bereiken en heb niets gehoord. Ik wil ervoor zorgen dat [Bedrijf] volledige waarde haalt uit jullie investering bij ons richting verlenging — kunnen we 20 minuten verbinden deze maand?"

2. **Gebruik productdata als haak.** E-mail de kampioen (één laatste poging): "Ik heb de gebruiksdata van jullie team gepulled voor jullie verlenging en merkte op dat we [functie] sterk onderbenut gebruiken, wat typisch [specifiek resultaat] drijft voor teams als het jouwe. Ik zou je graag willen laten zien wat andere [sector] bedrijven doen — 15 minuten deze week?"

3. **Brief je AE nu.** Verras ze niet 2 weken voor verlenging. Ze hebben mogelijk een relatie op uitvoerend niveau.

**Als je in 5 dagen geen reactie krijgt:** Escaleer intern. Laat je VP een directe e-mail sturen aan degene die het oorspronkelijke contract heeft ondertekend. Kader het als een zakelijke review, niet als een verlengingsdruk.

**Uitbreidingspotentieel: Geen totdat gezondheid is hersteld.**

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
