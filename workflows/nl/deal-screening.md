# Deal Screening Workflow

Een herhaalbaar, stapsgewijs proces voor het evalueren van inkomende dealflow — van eerste blik tot IC-klare beslissing — met Claude Code-vaardigheden in elke fase.

---

## Overzicht

Deze workflow omvat een volledige dealbeoordelingscyclus: ongeveer 2-3 weken van eerste contact tot IC-beslissing voor een seed/Series A-deal. Stappen zijn ontworpen voor gebruik met Claude Code-vaardigheden in elke fase. Tijdschattingen gaan uit van Claude-augmentatie.

**Totale tijd (met Claude):** 8-12 uur verspreid over 3 weken voor een deal die doorgaat naar IC
**Totale tijd (zonder Claude):** 25-40 uur

---

## Fase 1: Eerste screening (Dag 1 — 30-60 minuten)

### Aanleiding
Inkomende deal van: koude aanpak oprichter, LP-doorverwijzing, mede-investeerder, conferentie, acceleratorbatch, scout.

### Stap 1.1 — Verzamel dealinformatie

Verzamel het volgende voordat je Claude gebruikt:
- Bedrijfsnaam en URL
- Namen van oprichters en LinkedIn-profielen
- Pitch deck of one-pager (indien verstrekt)
- Korte beschrijving van wat ze doen
- Fase en rondgrootte die ze ophalen
- Omzet of ARR (indien bekendgemaakt)

### Stap 1.2 — Snelle screening

```
/deal-screening

Voer een snelle eerste screening uit voor [bedrijfsnaam].

Wat ik weet:
- Bedrijf: [naam], [website]
- Wat ze doen: [plak hun beschrijving]
- Fase: [pre-seed / seed / Series A]
- Ophalen: $[X]M bij $[X]M pre-money (indien bekendgemaakt)
- Omzet/ARR: $[X]M (indien bekendgemaakt)
- Achtergrond oprichter: [korte beschrijving]

Mijn fondsmandaat:
- Doelfase: [seed / Series A]
- Doelsectoren: [lijst]
- Doelchequegrote: $[X]M–$[X]M
- Geografische focus: [US / EU / wereldwijd]

Uitkomstopties: PASS / DECK AANVRAGEN / MEETING AANVRAGEN / MARKEREN VOOR PARTNER
```

### Stap 1.3 — Deallogboekvermelding

Als de uitkomst DECK AANVRAGEN of MEETING AANVRAGEN is, registreer in je pipeline:
- Bedrijfsnaam, sector, fase
- Bron van introductie
- Eerste screeningnotities (2-3 zinnen)
- Volgende actie en eigenaar
- Datum van eerste contact

**Uitkomst van Fase 1:** Pass (geregistreerd als pass met reden) of doorgaan naar Fase 2.

---

## Fase 2: Deck-review en eerste vergadering (Dagen 3-7)

### Stap 2.1 — Deck-analyse

```
/deal-screening

Analyseer dit pitch deck en extraheer de belangrijkste investeringssignalen.

[Plak deckinhoud of kerndia's als tekst]

Extraheer:
1. Welk probleem lossen ze op en voor wie?
2. Wat is de voorgestelde oplossing en het businessmodel?
3. Uitgelichte kernstatistieken: [omzet, groei, klanten, NPS]
4. Marktomvangclaim: [TAM/SAM] — lijkt dit geloofwaardig?
5. Team: [wie ze zijn, wat ze eerder hebben gedaan]
6. Vraag: $[X]M bij $[X]M pre-money — redelijk voor de fase?

Markeer: Eventuele claims die ongewoon, niet verifieerbaar zijn of specifieke vragen rechtvaardigen bij het eerste gesprek.
```

### Stap 2.2 — Voorbereiding eerste vergadering

```
/deal-screening

Bereid 12 vragen voor een eerste gesprek met de oprichters van [bedrijf].

Op basis van het deck/de beschrijving wil ik begrijpen:
- Is de markt echt en groot genoeg?
- Hebben deze oprichters het recht om te winnen?
- Wat betekenen de vroege tractiecijfers werkelijk?
- Welke aannames is het bedrijf op gebouwd die fout kunnen blijken?

Prioriteer voor een gesprek van 45 minuten. De eerste 3 vragen moeten over de oprichters zelf gaan, niet over het bedrijf.
```

### Stap 2.3 — Notities eerste vergadering

Noteer tijdens het gesprek:
- Directe antwoorden op jouw vragen
- Momenten van aarzeling of vage antwoorden (markeren voor due diligence)
- Je gevoel over de oprichters: helderheid, overtuiging, coachbaarheid
- Alles wat ze zeiden dat je verraste (positief of negatief)
- Wat ze niet zeiden (hiaten)

### Stap 2.4 — Deal memo na vergadering

```
/deal-memo

Schrijf een eerste deal memo op basis van mijn notities van de oprichtersvergadering.

Mijn vergadernotities: [plak notities]
Mijn eerste reactie: [jouw gevoel — wat je enthousiasmeerde, wat je zorgen baarde]

Bouw de deal memo-structuur op. Markeer alles wat ik niet kon verifiëren als [NOG TE CONTROLEREN].
Markeer de 5 belangrijkste vragen die ik nog moet beantwoorden voordat ik een investering kan aanbevelen.
```

**Uitkomst van Fase 2:** Pass (met geregistreerde reden) of doorgaan naar Fase 3. Deel met een partner voor een go/no-go over volledige due diligence.

---

## Fase 3: Due diligence (Dagen 7-21)

### Stap 3.1 — Due diligence-plan

```
/diligence-review

Bouw een due diligence-plan voor [bedrijf].

Investeringsthesis: [wat we moeten geloven om te investeren]
Geïdentificeerde kernrisico's in deal memo: [top 5 noemen]
Beschikbare tijd: [X dagen] voor beslissingsdeadline

Genereer een due diligence-checklist geprioriteerd op:
1. Items die de deal kunnen doen mislukken (eerst doen)
2. Items die de thesis valideren (tweede doen)
3. Items die mooi mee te nemen zijn maar niet blokkeren

Wijs toe: [klantgesprekken / technisch / financieel / juridisch / referentie]
```

### Stap 3.2 — Klantreferentiegesprekken (2-4 gesprekken)

```
/diligence-review

Ik bel een referentieklant van [bedrijf] — [klantnaam, functie, bedrijf].

Investeringsthesis die ik test: [jouw thesis]
Kernrisico's die ik wil verminderen: [3 noemen]

Genereer 12 vragen die:
- Echt productgebruik onderzoeken (geen testimonials)
- Vragen naar het alternatief als ze dit product niet zouden hebben
- Beoordelen hoe ingebed/kleverig het product is
- Testen of de claims van het bedrijf over deze klant kloppen
- Eventuele ontevredenheid blootleggen die ze niet vrijwillig zouden melden
```

Na elk gesprek, registreer:
- Gebruik: hoe intensief ze het gebruiken, hoeveel gebruikers, welke functies
- Overstapkosten: zouden ze opzeggen bij een prijsverhoging van 20%?
- Vergelijking met alternatieven die ze hebben geëvalueerd
- Eventuele klachten of zorgen
- Algeheel NPS-signaal: zouden ze het aan een collega aanbevelen?

### Stap 3.3 — Financiële due diligence

```
/diligence-review

Ik heb financiële data ontvangen van [bedrijf]. Review op consistentie en markeer anomalieën.

VERSTREKTE FINANCIËLE DATA:
[Plak maandelijks resultaat, ARR-overzicht of financiële samenvatting]

Controleer op:
1. Omzetverantwoording: wordt ARR consistent berekend? (geen opgeblazen MRR → ARR-berekening)
2. Brutomarge: wat zit er in COGS? Zijn hostingkosten volledig meegenomen?
3. Verbrandingstempo: klopt het met de bankbalansbeweging?
4. Klantconcentratie: welk % van ARR komt van de top 3 klanten?
5. Churn: hoe wordt bruto vs. netto churn berekend?
6. Liquiditeit: werkelijk banksaldo vs. wat geïmpliceerd wordt door hun verbrandingstempo en financieringsgeschiedenis

Markeer elke statistiek die niet klopt. Genereer vragen voor de CFO/oprichter.
```

### Stap 3.4 — Vergelijkbare bedrijven en waardering

```
/comps-analysis

Voer een vergelijkingsanalyse uit om de waardering van deze deal te benchmarken.

Bedrijf dat wordt geëvalueerd: [naam]
Statistieken: ARR $[X]M, [X]% groei, [X]% brutomarge, NRR [X]%
Dealvoorwaarden: $[X]M ophaling bij $[X]M pre-money = [X]x ARR-multiple

Zoek vergelijkbare beursgenoteerde SaaS-bedrijven en recente privétransacties:
- Zelfde sector of aangrenzend
- Vergelijkbare omzetschaal
- Vergelijkbare groeisnelheid

Met welke EV/ARR-multiple worden vergelijkbare bedrijven gewaardeerd?
Welke premie of korting betalen we?
Bij welke groeisnelheid zou deze waardering gerechtvaardigd zijn?
```

### Stap 3.5 — Technische due diligence (indien van toepassing)

Voor ontwikkelaarstools, infrastructuur, AI, of elk product waarbij de technische architectuur van belang is:

```
Ik moet de technische architectuur en verdedigbaarheid van [bedrijf] begrijpen.

Wat ze me hebben verteld:
- Technische stack: [wat ze gebruiken]
- AI/ML-claims: [indien van toepassing]
- Infrastructuur: [cloudprovider, self-hosted, enz.]
- Slootclaims: [eigen data / algoritmen / integraties]

Genereer een lijst van technische due diligence-vragen voor een gesprek met hun CTO over:
1. Build vs. buy-beslissingen en hun onderbouwing
2. Hoeveel van de kern-IP echt eigen is vs. wrappers
3. Schaalbaarheidsarchitectuur (wat breekt bij 10x huidig volume)
4. Beveiligingshouding en eventuele geschiedenis van inbreuken
5. Sleuteltechnische medewerkers en busfactor (hoeveel mensen bezitten kritieke kennis)
```

### Stap 3.6 — Due diligence-synthese

```
/diligence-review

Synthetiseer alle due diligence-bevindingen voor [bedrijf] in een pre-IC-samenvatting.

Klantgesprekken (N=X):
[Vat de belangrijkste thema's samen]

Financiële review:
[Vat bevindingen, markeringen, schone items samen]

Technische review:
[Vat samen indien van toepassing]

Referentiegesprekken:
[Vat oprichterreferenties samen]

Voor elk oorspronkelijk risico uit de deal memo:
[Risico] | [Status: Verminderd / Nog open / Bevestigd als probleem]

Aanbevelingsupdate: [investeer / pass / voorwaardelijk] op basis van due diligence. Is er iets veranderd ten opzichte van de initiële deal memo? Wat zijn de resterende openstaande kwesties?
```

**Uitkomst van Fase 3:** Beslissing om te investeren of te passen. Als investeren, ga verder naar Fase 4.

---

## Fase 4: IC-voorbereiding (Dagen 18-22)

### Stap 4.1 — IC-memo

```
/ic-memo

Zet de deal memo en due diligence-bevindingen om in een volledige IC-memo voor [bedrijf].

Deal memo: [plak of vat samen]
Samenvatting due diligence-bevindingen: [plak]
Voorgestelde voorwaarden: $[X]M bij $[X]M pre-money, [X]% eigendom

Genereer alle 9 secties. Markeer [VERIFIEER] bij alles wat niet bevestigd is in due diligence.
Benadruk openstaande punten waarover IC moet beslissen of ze acceptabele risico's zijn.
```

### Stap 4.2 — IC-vergadervoorbereiding

Bereid je voor om de aanbeveling te verdedigen:

```
/deal-memo

Ik presenteer [bedrijf] aan IC. Help me voorbereiden op moeilijke vragen.

Mijn aanbeveling: [investeer / pass]
IC-leden en hun bekende zorgen: [lijst partners en hun typische aandachtsgebieden]

Genereer de 10 moeilijkste vragen die ik zal krijgen en stel mijn antwoorden op op basis van wat ik weet.
Markeer de 2-3 vragen waarbij ik geen sterk antwoord heb en me verder op moet voorbereiden.
```

### Stap 4.3 — IC-beslissingslog

Na IC:
- Registreer de beslissing: investeer / pass / meer due diligence
- Als investeren: registreer voorgestelde voorwaarden, tijdlijn, wie het termsheet opstelt
- Als pass: registreer de primaire reden (nuttig voor oprichtersfeedback en fondsleren)
- Als meer due diligence: registreer specifieke openstaande punten en wie verantwoordelijk is voor de oplossing

**Uitkomst van Fase 4:** Investeringsbeslissing met gedocumenteerde onderbouwing.

---

## Fase 5: Post-investeringsopzet (Week 4+)

### Stap 5.1 — Portfoliobewaking opzetten

Zodra de investering is gesloten:

```
/portfolio-monitor

Stel een bewakingskader op voor [bedrijf].

Investeringsthesis: [wat we geloofden]
Verwachte kernmijlpalen in Jaar 1: [3-5 noemen]
Maandelijks bij te houden KPI's: [ARR, verbrandingstempo, NRR, personeelsbestand, brutomarge]
Bestuursvergaderingschema: [maandelijks / kwartaal]

Genereer een bedrijfsprofielkaart voor ons portfoliobeheerssysteem.
```

### Stap 5.2 — Eerste bestuursvergadering

Voer binnen 60 dagen na sluiting een bestuurskickoff uit:

```
/portfolio-monitor

Bereid me voor op de eerste bestuursvergadering met [bedrijf].

Recente sluiting: [datum]
Investeringsthesis: [jouw thesis]
Oprichtersprioriteiten gedeeld bij sluiting: [wat ze zeiden dat ze willen focussen]
Mijn prioriteiten als bestuurslid: [wat ik wil volgen]

Genereer: voorstel bestuursvergaderingsagenda, initiële KPI-dashboardstructuur, eerste 90-dagenplan om met oprichters door te nemen.
```

---

## Te volgen statistieken (over je dealspijplijn)

| Statistiek | Wekelijks volgen |
|---|---|
| Gescreende deals | Totaal, uitsplitsing per bron |
| Passpercentage per fase | Fase 1 / 2 / 3 / 4 |
| Bronkwaliteit | Welke doorverwijzingsbronnen leiden tot deals in IC-fase |
| IC-conversie | Gepresenteerde vs. goedgekeurde deals |
| Dealsnelheid | Dagen van eerste contact tot IC |
| Inzichten referentiegesprekken | % deals waarbij klantgesprekken je inzicht veranderden |

---
