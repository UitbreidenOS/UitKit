# SDR Dagelijkse Workflow

## Wanneer uit te voeren
Elke werkdag om 8:00 uur. Ontworpen om een 4,5 uur durende gestructureerde dag in te vullen (8:00 uur–12:15 uur, kort herstart om 16:45–17:00 uur). Handmatig activeren of via geplande hook voor dagelijkse automatisering.

## Vereiste invoer
- **Tier 1 en Tier 2 accountlijsten**: CRM-export of spreadsheet met bedrijfsnamen en belangrijke contacten
- **Vorige dagstatus van sequenties**: actieve accounts, stadium en antwoordgeschiedenis
- **Signaalbronnen**: recente LinkedIn-updates, financieringsaankondigingen, vacatureposten, nieuwsfeeds voor doelaccounts
- **E-mailsjablonen en frameworks**: Short Trigger-sjabloon, multi-touch sequentiesjablonen
- **CRM-verbinding**: toegang om contactgegevens bij te werken en vervolgingstaken aan te maken
- **Gespreksnotities** (indien van toepassing): nachtelijke antwoorden of voicemails die classificatie vereisen

## Stappen

### Stap 1: Ochtendse Signaalreview (30 min, 8:00–8:30 uur)

**Claude-taak:**
"Controleer mijn Tier 1 en Tier 2 accountlijsten op nieuwe signalen. Controleer op: nieuwe leaderschapsaanstellingen, financieringsaankondigingen, tech stack-veranderingen, LinkedIn-activiteiten van doelcontacten, vacatureposten in doeldepartementen. Markeer signalen met hoge prioriteit en beveel acties per account aan."

**Invoer:** Accountlijst (bedrijfsnamen, doelcontacten), signaalbronnen (LinkedIn, Crunchbase, interne nieuwsberichten)

**Besluitvormingspunten:**
- Signaalsterkte: Is dit een sterke trigger voor outreach? (Ja = Tier 1-prioriteit, Misschien = Tier 2, Nee = overslaan)
- Beschikbaarheid contactpersoon: Is de doelbesluitvormer nog steeds de juiste persoon? Werk bij als er een nieuwe aanstelling is.

**Uitvoer:** Geprioriseerde signaallijst (5–15 accounts) met:
- Bedrijfsnaam
- Signaaltype (bv. "Nieuwe VP of Sales aangesteld", "Series B financiering aangekondigd")
- Doelcontactnaam + huidige functie
- Aanbevolen hook (bv. "Feliciteer met aanstelling + vermeld relevante mogelijkheid")
- Prioriteitstier (Hoog/Gemiddeld)

**Succescriteria:** Lijst bevat alleen accounts met bruikbare signalen; geen verouderde leads.

---

### Stap 2: Account Research Sprint (60 min, 8:30–9:30 uur)

**Claude-taak:**
"Voor elk account met sterk signaal van Stap 1: onderzoek en maak een dossier. Formaat: bedrijfsoverzicht, besluitvormerkaart (organigram focus), top 3 pijnsignalen, aanbevolen persoonlijkheids-hook. Gebruik LinkedIn, bedrijfswebsite, recente nieuws en vacatureposten."

**Invoer:** Geprioriseerde signaallijst van Stap 1, bedrijfsonderzoekstools (LinkedIn, Crunchbase, G2, bedrijfswebsites)

**Besluitvormingspunten:**
- Is het bedrijf een goede fit voor onze oplossing? (Ja = doorgaan, Nee = deprioriteren)
- Kun je 2+ besluitvormers identificeren of alleen het initiële doelpersoon? (Meerdere = hoger vertrouwen)
- Wat is het sterkste pijnsignaal voor dit bedrijf? (Technische schuld, schaal, concurrentiële druk, enz.)

**Uitvoer:** Bedrijfsdossier per account (1–2 pagina's elk):
```
[Bedrijfsnaam]

**Overzicht**
- Industrie, grootte, financieringsstadium, groeipercentage
- Huidige product-/servicefocus
- Recente aankondigingen of nieuws

**Besluitvormerkaart**
- CEO / Oprichter: [Naam, LinkedIn]
- VP van [Relevante Functie]: [Naam, LinkedIn]
- [Andere invloedsrijke personen]: [Namen, functies]

**Top 3 Pijnsignalen**
1. [Pijnsignaal + bewijs van vacaturepost / LinkedIn / nieuws]
2. [Pijnsignaal + bewijs]
3. [Pijnsignaal + bewijs]

**Aanbevolen Persoonlijkheids-Hook**
[Specifieke, concrete reden om contact op te nemen gekoppeld aan signaal + onze oplossing]
```

**Succescriteria:** Elk dossier is 80% compleet; je hebt duidelijke vervolgstappen voor outreach.

---

### Stap 3: Outreach Batch (90 min, 9:30–11:00 uur)

**Claude-taak:**
"Schrijf E-mail 1 (Onderwerp + Tekst) voor elk doelprospect met het Short Trigger-framework. Houd het lichaam onder 50 woorden. Schrijf vervolgens sequentiestappen 2–4 voor accounts al in actieve sequenties (op dagen 3, 7, 12 ritme)."

**Invoer:** Bedrijfsdossiers van Stap 2, e-mailsjablonen, Short Trigger-framework, actieve sequentielijst van CRM

**Besluitvormingspunten:**
- Is dit een nieuw bereik (E-mail 1) of vervolgstap in actieve sequentie? (Paden verschillen)
- Heeft dit prospect al gereageerd? (Ja = sla sequencing over, ga naar Stap 4)
- Moeten we een oproep, video of e-mail als stap 2 gebruiken? (Hangt af van betrokkenheidssignalen)

**Uitvoer:**
1. **E-mail 1 (Nieuwe Outreach)** voor elk doel:
   - Onderwerpregel (onder 10 woorden, verwijzing naar het signaal)
   - Tekst (onder 50 woorden, Short Trigger-framework: context + probleem + oproep tot actie)
   - Bijlage/aanbeveling voor bezit (indien van toepassing)

2. **Sequentiestappen 2–4** voor actieve sequenties:
   - Vervolgstap dag 3: [E-mail of taaaktype]
   - Vervolgstap dag 7: [E-mail, stembereik of LinkedIn-betrokkenheid]
   - Vervolgstap dag 12: [E-mail of slottik, mogelijk pivot naar nieuw signaal]

**Succescriteria:** E-mails zijn gepersonaliseerd, onder 50 woorden en verwijzen naar het signaal. Sequenties volgen ritme en escalatielogica.

---

### Stap 4: Vervolgingsblok (45 min, 11:00–11:45 uur)

**Claude-taak:**
"Classificeer alle nachtelijke antwoorden en voicemails. Verdeel ze: (1) Positieve betrokkenheid, (2) Behoefte aan verduidelijking, (3) Niet geïnteresseerd, (4) Spam. Schrijf antwoorden voor antwoorden met hoge prioriteit. Voor elk warm prospect: beslis: e-mail, vandaag bellen of vervolgsequentie?"

**Invoer:** Nachtelijke e-mail/Slack-antwoorden, voicemail-transcripten, actieve prospectlijst van CRM

**Besluitvormingspunten:**
- Antwoordsentiment: Positief (vandaag antwoorden), neutraal (verduidelijken + sequentie), negatief (loggen + verder gaan)
- Gespreksgereedheid: Is dit prospect klaar voor een oproep? (Sterke signalen = ja)
- Sequentievervolging: Moeten we de sequentie voortzetten of draaien naar ander hook?

**Uitvoer:**
1. **Tabel voor antwoordclassificatie:**
   - Naam prospect | Bedrijf | Antwoordinhoud | Bucket | Aanbevolen actie | Urgentie
2. **Antwoordconcepten** voor Buckets 1 & 2 (klaar om te verzenden of aan te passen)
3. **Bellijst** voor vandaag met gespreksonderwerpen

**Succescriteria:** Alle antwoorden geclassificeerd; warme leads krijgen dezelfde dag aandacht; geen leads vallen door mand.

---

### Stap 5: CRM-update (11:45 uur–12:15 uur)

**Claude-taak:**
"Zet gespreksnotities, e-mailberzendingen en antwoorden om in gestructureerde CRM-updates. Voor elk contactpersoon: werk datum van laatste activiteit bij, voeg gespreksuitkomst toe (indien van toepassing), creëer vervolgingstaken met vervaldatums, werk kansstadium bij, log signalen."

**Invoer:** Gespreksnotities van Stap 4, e-mailverzendingslogboek van Stap 3, antwoordclassificatie van Stap 4, huidige CRM-records

**Besluitvormingspunten:**
- Moet deze lead naar een nieuw kansstadium gaan? (Gekwalificeerd → In Gesprek, enz.)
- Wat is de volgende taak en wanneer vervalt die? (Vandaag, morgen, over 3 dagen?)
- Moeten we een nieuwe contactpersoon of bedrijf aan de database toevoegen?

**Uitvoer:**
1. **Instructies voor CRM bulk-update** (klaar om in je CRM in te plakken):
   - Contactnaam | Activiteittype | Activiteitdatum | Opmerking bij uitkomst | Volgende taak | Vervaldatum | Kansstadium
2. **Toevoegingen voor nieuwe contactpersoon/bedrijf** (indien van toepassing)
3. **Samenvatting vervolgingstaken** (aantal taken per persoon aangemaakt)

**Succescriteria:** Alle activiteiten geregistreerd; geen dubbel werk; vervolgingstaken zijn specifiek en gedateerd.

---

### Stap 6: Einde-Dag Review (15 min, 16:45–17:00 uur)

**Claude-taak:**
"Vat vandaag's metrieke en morgen's prioriteiten samen. Hoeveel nieuwe accounts heb ik toegevoegd? Hoeveel sequenties zijn actief? Welke signalen moet ik morgen controleren? Moet ik mijn doelaccountlijst aanpassen?"

**Invoer:** CRM dashboard snapshot, signaalbronnen, actief sequentieaantal, vandaag's workflow-uitvoer

**Besluitvormingspunten:**
- Zijn we op schema voor wekelijkse/maandelijkse doelstellingen? (Ja = handhaven, Nee = escaleren)
- Moeten we accounts aan onze Tier 1/2 lijsten toevoegen of verwijderen? (Koude prestatiesgegevens)
- Hebben we genoeg accounts met hoog signaal voor morgen, of moeten we nieuwe accounts zoeken?

**Uitvoer:**
1. **Dagelijkse metrieke:**
   - Nieuwe accounts toegevoegd
   - Nieuwe sequenties gestart
   - Antwoorden ontvangen + antwoordtempo %
   - Geboekte oproepen / geplande vergaderingen
   - Actieve sequenties (lopend totaal)

2. **Morgen's prioriteiten:**
   - Accounts om onderzoek te doen
   - Sequenties waarop vervolgd moet worden
   - Te monitoren signalen
   - Eventuele dringende oproepen of vervolgstappen

3. **Wekelijkse trend** (als het vrijdag is):
   - Totale aangeraakt accounts
   - Conversietempo (sequentie → vergadering)
   - Best presterende signalen
   - Aanbevelingen voor volgende week

**Succescriteria:** Metrieke zijn nauwkeurig; prioriteiten zijn duidelijk; je kunt morgen beginnen zonder opstart-tijd.

---

## Uitvoer

Een volledige SDR dagelijkse uitvoering die oplevert:

1. **Ochtendse signaallijst** (Stap 1): 5–15 geprioriseerde accounts klaar om onderzoek te doen
2. **Bedrijfsdossiers** (Stap 2): Volledig onderzoek + besluitvormerkaart + pijnsignalen voor elk account
3. **Outreach e-mails** (Stap 3): E-mail 1 + sequentiestappen 2–4, klaar om in de wachtrij te zetten
4. **Antwoordclassificatie** (Stap 4): Alle nachtelijke antwoorden gesorteerd + warme leads met conceptantwoorden
5. **CRM-updates** (Stap 5): Bulk activiteitenlogboek + vervolgingstaken, klaar om hocheladen
6. **Dagelijkse snapshot** (Stap 6): Metrieke + morgen's agenda

**Tijdtoewijzing:**
- Blok 1 (Signaalreview): 30 min
- Blok 2 (Onderzoek): 60 min
- Blok 3 (Outreach batch): 90 min
- Blok 4 (Vervolgstap): 45 min
- Blok 5 (CRM-update): 30 min
- Blok 6 (Einde-dag): 15 min
- **Totaal: 4,5 uur** (8:00 uur–12:15 uur, + 15 min om 16:45–17:00 uur)

---

## Voorbeeld

**Dag: Maandag, 2 juni 2026**

### Stap 1: Ochtendse Signaalreview (8:00–8:30 uur)

Gebruiker levert:
- Tier 1 accountlijst: Acme Corp, BuildCo, DataDrive Inc, TechScale Ltd
- Signaalbronnen: LinkedIn feed, Crunchbase e-mail, vacaturebord

**Claude identificeert:**
1. **Acme Corp** — Nieuwe VP of Sales aangesteld (LinkedIn-post, 2 dagen geleden) → **HOOG**
2. **BuildCo** — Series B financiering $15M aangekondigd → **HOOG**
3. **DataDrive Inc** — 3 data engineers in aanstelling (LinkedIn-vacatureposten) → **GEMIDDELD**
4. **TechScale Ltd** — Nieuwe productlancering aangekondigd op hun blog → **GEMIDDELD**

**Uitvoer:**
```
SIGNAALPRIORIJTEITSLIJST — Maandag, 2 juni

🔴 HOGE PRIORITEIT
1. Acme Corp | Signaal: Nieuwe VP of Sales (2 dagen geleden) | Contactpersoon: TBD (onderzoek) | Hook: Felicitaties met aanstelling + ons verkoopsefficiëntieplatform
2. BuildCo | Signaal: Series B $15M | Contactpersoon: Bestaande CEO-contactpersoon | Hook: Help hen met verkoopsgroei na financiering

🟡 GEMIDDELDE PRIORITEIT
3. DataDrive Inc | Signaal: 3 data engineers in aanstelling | Contactpersoon: Aanstellingsmanager TBD | Hook: Data team schaal = infrastructuuruitdagingen
4. TechScale Ltd | Signaal: Nieuwe productlancering | Contactpersoon: Bestaande productlead-contactpersoon | Hook: Analyseer marktrespons + verkoopsstrategie
```

---

### Stap 2: Account Research Sprint (8:30–9:30 uur)

Gebruiker levert: LinkedIn-profielen, bedrijfswebsites, Crunchbase-links

**Claude maakt dossiers:**

```
ACME CORP

**Overzicht**
- Industrie: B2B SaaS (verkoopsondersteuning)
- Grootte: 150 werknemers
- Financiering: Series A ($8M, 2023)
- Recent: Nieuwe VP of Sales aangesteld (30 mei 2026)

**Besluitvormerkaart**
- CEO: Jane Smith (LinkedIn: /in/janesmith) — oprichter bedrijf
- VP of Sales: Michael Johnson (LinkedIn: /in/mjohnson) — NIEUWE AANSTELLING
- CRO-functie: TBD (waarschijnlijk creëert VP Sales-functie voor groei)

**Top 3 Pijnsignalen**
1. Nieuwe verkoopsleiding → verkoopsteam uitbreiden, behoefte aan infrastructuur/tools
2. Series A gefinancierd 2+ jaar geleden → waarschijnlijk Serie B plannen, noodzaak om inkomsten te schalen
3. 150 personen → gaan naar scale-up-fase, verkoopsoperaties worden kritiek

**Aanbevolen Hook**
"Hoi Michael, ik zag dat je Michael als VP of Sales bij Acme bent gaan werken — gefeliciteerd! Verkoopsoperaties zijn tijdens opstart moeilijk. We helpen teams zoals jij om onboarding van 60 naar 30 dagen te verkorten. Snel gesprek deze week?"
```

```
BUILDCO

**Overzicht**
- Industrie: DevOps-infrastructuur
- Grootte: 45 werknemers
- Financiering: Series B ($15M, 1 juni 2026) — NET AANGEKONDIGD
- Groeipercentage: 3x YoY (per Crunchbase)

**Besluitvormerkaart**
- CEO: Alex Chen (bestaande contactpersoon, betrokken)
- VP of Product: Sarah Lee (LinkedIn: /in/sarahlee)
- VP of Sales: [Nog niet aangesteld — groeikans]

**Top 3 Pijnsignalen**
1. Series B financiering → 3x personeelsgroei verwacht, verkoop zal exploderen
2. 45 → ~150 personen in 12 maanden → massale operationele schaaluitdaging
3. Product-led groei waarschijnlijk → behoefte aan verkoopsinfrastructuur om inbound om te zetten

**Aanbevolen Hook**
"Alex, gefeliciteerd met BuildCo's Series B-afsluiting! Met 3x groei vooruit zal je verkoopsoperatie de beperking zijn. Laten we koffie drinken en praten over hoe je veel voorkomende schaalfouten voorkomt."
```

---

### Stap 3: Outreach Batch (9:30–11:00 uur)

Gebruiker zet e-mails in om te verzenden

**Claude maakt:**

```
E-MAIL 1 — Acme Corp / Michael Johnson (NIEUWE OUTREACH)

Onderwerp: Verkoopsoperaties voor Acme's volgende fase

Tekst:
Hoi Michael,

Gefeliciteerd met je VP-functie. Verkoopsteams groeien snelst wanneer operaties bijhouden.

We verkorten onboarding van 60 naar 30 dagen. Het waard een snel gesprek?

Met vriendelijke groeten,
[Naam]
[Jouw Bedrijf]

---

E-MAIL 1 — BuildCo / Alex Chen (NIEUWE OUTREACH)

Onderwerp: BuildCo's operaties na Series B

Tekst:
Alex,

Zag Series B sluiten. Gefeliciteerd. 3x groei vooruit betekent dat verkoopsoperaties je beperking zijn.

15 min deze week?

Met vriendelijke groeten,
[Naam]
[Jouw Bedrijf]

---

SEQUENTIESTAPPEN 2–4 (Voorbeeld: DataDrive Inc prospect al in sequentie, dag 1 verzonden)

Vervolgstap dag 3: E-mail
Onderwerp: Snelle gedachte over aanstellingen

Tekst: "Hoi [Naam], vervolgstap op mijn e-mail dinsdag. Als je je datateam schaal, wordt verkoop kritiek. De meeste teams falen hier. Laten we ervoor zorgen dat jij niet faal. Snel gesprek?"

Vervolgstap dag 7: LinkedIn-betrokkenheid
Actie: Opmerking op hun recente aanstellingsbericht + bericht verzenden: "Zag je teamgroeiplannen. Laten we synchroniseren over het operationaliseren van verkoop voor datateams."

Vervolgstap dag 12: E-mail (slottik)
Onderwerp: Laatste gedachte

Tekst: "Hoi [Naam], ik zal je inbox na dit alleen laten. Maar als je ooit wilt praten over verkoopsgroei zonder chaos, je weet waar je me kunt vinden."
```

---

### Stap 4: Vervolgingsblok (11:00–11:45 uur)

Gebruiker levert nachtelijke antwoorden (voorbeeld):

**Claude classificeert:**

```
NACHTELIJKE ANTWOORDEN CLASSIFICATIE

Prospect: John Doe (BuildCo)
Antwoord: "Hé, dit ziet er interessant uit. Kun je een demolink sturen?"
Bucket: 1 — Positieve betrokkenheid
Actie: Demolink verzenden + vandaag bellen
Urgentie: HOOG

Prospect: Sarah Chen (Acme Corp)
Antwoord: "Waarscheer de opmerking. We kijken nu niet naar toolwijzigingen."
Bucket: 3 — Niet geïnteresseerd
Actie: Loggen, niet vervolgstap; herbekijken over 90 dagen
Urgentie: LAAG

Prospect: Mike Peters (DataDrive Inc)
Antwoord: "Hoe zit het met je prijzen?"
Bucket: 2 — Behoefte aan verduidelijking
Actie: Verduidelijking van prijzen + waardestellingvoorstel in e-mail + beldeling
Urgentie: GEMIDDELD

---

ANTWOORDCONCEPT VOOR ANTWOORDEN MET HOGE PRIORITEIT

Aan: John Doe (BuildCo)
Onderwerp: Antwoord: Demolink

Hoi John,

Hier is de demo: [link]. Het is een 15 minuten durende wandeling; de meeste mensen kijken met 2x snelheid.

Gratis 30 min gesprek deze woensdag of donderdag?

Met vriendelijke groeten,
[Naam]

---

BELLIJST VANDAAG
1. John Doe (BuildCo) — Demo verzonden, warm prospect
   Gespreksonderwerpen: Zijn functie, tijdsplan voor verkoopsgroei, huideige tools pijn
```

---

### Stap 5: CRM-update (11:45 uur–12:15 uur)

**Claude maakt bulk CRM-update:**

```
CRM BULK UPDATE — Maandag, 2 juni

Contactnaam | Activiteittype | Datum | Opmerking | Volgende taak | Vervaldatum | Kansstadium
John Doe | E-mail verzonden | 2/6 | Demolink verzonden | Bellen | 2/6 | In Gesprek
Michael Johnson | E-mail verzonden | 2/6 | VP nieuwe aanstellinguitreach | Vervolgstap | 5/6 | Prospect
Alex Chen | E-mail verzonden | 2/6 | Series B felicitaties | Bellen | 3/6 | Prospect
Sarah Chen | E-mail ontvangen | 2/6 | Nu niet geïnteresseerd | Herbekijken | 90 dagen | Niet Gekwalificeerd
Mike Peters | E-mail ontvangen | 2/6 | Prijsvraag | Verduidelijking in e-mail | 2/6 | In Gesprek

---

NIEUWE VERVOLGINGSTAKEN AANGEMAAKT
- John Doe: Bellen (vandaag, 14:00 uur) — BuildCo demolink vervolgstap
- Mike Peters: Prijzen e-mail verzenden (vandaag, 13:00 uur) — antwoord op vraag
- Alex Chen: Bellen (woensdag, 09:00 uur) — Series B debriefing
- Michael Johnson: E-mail vervolgstap (donderdag, 08:00 uur) — interesse controleren
```

---

### Stap 6: Einde-Dag Review (16:45–17:00 uur)

**Claude maakt:**

```
DAGELIJKSE METRIEKE — Maandag, 2 juni

✅ Aangeraakt accounts: 4
✅ Nieuwe sequenties gestart: 2 (Acme Corp, BuildCo)
✅ Antwoorden ontvangen: 3 (antwoordtempo: TBD, klein voorbeeld)
✅ Geboekte oproepen: 1 (John Doe, 14:00 uur vandaag)
✅ Actieve sequenties: 7

---

MORGEN'S PRIORITEITEN (Dinsdag, 3 juni)

🔴 VANDAAG DRINGENDE TAKEN
- Bel John Doe om 14:00 uur vandaag (demolink vervolgstap)
- E-mail Mike Peters voor EOD (prijsverduidelijking)

🟡 DINSDAG AGENDA
- Onderzoek 3 nieuwe accounts met hoog signaal (signaalreview opnieuw uitvoeren)
- Vervolgstap dag 7 op 2 bestaande sequenties
- Bel Alex Chen (Series B debriefing) — 09:00 uur
- Monitor antwoorden, zelf dag van gelden antwoorden

🟢 WEEK OUTLOOK
- 15–20 nieuwe accounts om onderzoek te doen
- 3–4 oproepen geboekt ideaal
- 2–3 vergaderingen gepland tegen vrijdag
- Doorgaan met dagelijks start om 08:00 uur voor consistentie
```

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**

📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
