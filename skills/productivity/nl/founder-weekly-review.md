---
name: founder-weekly-review
description: "Wekelijkse oprichtersbeoordeling: bedrijfsgezondheid, OKR-controle, teamgevoel, prioriteiten voor de volgende week"
---

# Vaardigheid: Wekelijkse Oprichtersbeoordeling

## Wanneer activeren
- Het uitvoeren van je einde- of beginweek bedrijfsbeoordeling
- Voortgang van OKR's controleren ten opzichte van kwartaaldoelstellingen
- Voorbereiding van je wekelijkse all-hands of leiderschapssync-agenda
- Beslissen waar je jezelf de volgende week op wilt richten
- Inschatten of het team overbelast, geblokkeerd of niet op één lijn zit
- Het schrijven van een wekelijks intern updatememo aan het team

## Wanneer NIET gebruiken
- Bestuursvergaderingsvoorbereiding — gebruik de `/board-deck-builder` vaardigheid
- Investeerderupdate — gebruik de `/investor-update` vaardigheid
- Eenmalige strategische beslissingen — dit is een rythmisch hulpmiddel, geen beslissingskader
- Diepgaande financiële analyse — gebruik `/financial-plan` of `/dcf-model`

## Instructies

### Kernprompt voor de wekelijkse beoordeling

```
Voer mijn wekelijkse bedrijfsbeoordeling uit voor de week van [DATUM].

Bedrijfsfase: [Seed / Series A / Series B]
Teamomvang: [N] personen
Belangrijkste OKR's dit kwartaal: [lijst je 3-5 OKR's]

Beschikbare gegevens (plak wat je hebt — kies uit de lijst):
- MRR / ARR: [huidig vs. vorige week]
- Pipeline: [nieuwe pipeline toegevoegd, deals gevorderd, deals verloren]
- Product: [verzonden functies, opgeloste bugs, uptime]
- Team: [nieuwe medewerkers, vertrekken, open rollen, eventuele signalen]
- Klant: [churn, uitbreiding, NPS, supportvolume]
- Burn: [cash out, burn rate vs. plan]

Produceer:

## 1. Bedrijfsgezondheid (stoplicht: Groen / Amber / Rood + één zin waarom)
- Omzet: [status]
- Pipeline: [status]
- Product: [status]
- Team: [status]
- Kas: [status]
- Algemeen: [status]

## 2. OKR-controle
Voor elke OKR: status (op schema / risico / niet op schema), actueel vs. doel, 1 zin over de reden.

## 3. Wat werkte deze week (top 3)
Specifiek, niet generiek. Niet "het team werkte hard." Wat is er concreet vooruitgegaan?

## 4. Wat niet werkte (top 2-3 met hoofdoorzaak)
Geen verwijten. Alleen: wat werd er verwacht, wat gebeurde er werkelijk, en waarom.

## 5. Teamgevoel (1-2 signalen)
Tekenen van overbelasting, ontkoppeling, gebrek aan afstemming of geblokkeerd werk?
Haal deze uit: 1:1-notities, Slack-patronen, gemiste deadlines, directe verzoeken.

## 6. Mijn persoonlijke focus volgende week (tijdsverdeling CEO)
Op basis van bedrijfsgezondheid hierboven: waar moet de CEO tijd aan besteden?
Opties: klantgesprekken, werving, investeerder, product, teamkwesties, fondsenwerving, operationeel.
Aanbevolen verdeling: [top 2 prioriteiten met % van de week]

## 7. De ene beslissing die ik moet nemen (of escaleren)
Het enige meest belangrijke dat een CEO-beslissing vereist deze week.
Geen lijst van 10 — één.
```

### OKR-volgsjabloon

```
Volg OKR's voor [BEDRIJF] — [KWARTAAL].

Formatteer elke OKR als:

DOELSTELLING: [Het kwalitatieve doel]
- Kernresultaat 1: [Metriekdoelstelling] | Huidig: [X] | Voortgang: [X%] | Status: [Op Schema / Risico / Niet op Schema]
- Kernresultaat 2: [Metriekdoelstelling] | Huidig: [X] | Voortgang: [X%] | Status: [...]
- Kernresultaat 3: [Metriekdoelstelling] | Huidig: [X] | Voortgang: [X%] | Status: [...]

Voor elk risico- of niet-op-schema KR:
Hoofdoorzaak: [wat de kloof veroorzaakt — wees specifiek]
Actie eigenaar: [wat de verantwoordelijke persoon zal doen en wanneer]
CEO-actie vereist: [wat ik persoonlijk moet doen, indien van toepassing]

Betrouwbaarheidsscore (1-5): hoe zeker ben je dat we dit KR aan het einde van het kwartaal halen?
1 = geen kans zonder grote interventie
3 = mogelijk met gerichte inspanning
5 = op schema, geen zorgen

Voorbeeld:
DOELSTELLING: De standaardkeuze worden voor enterprise beveiligingsteams
- KR1: $1,2M ARR | Huidig: $890K | Voortgang: 74% | Status: Risico
  Hoofdoorzaak: Twee enterprise deals verschoven naar Q4 (vertragingen juridische beoordeling)
  Actie eigenaar: Customer Success om juridische cyclus te verkorten — sjablooncontract op maandag
  CEO: Inkoopleads direct bellen bij beide accounts deze week
  Betrouwbaarheid: 3/5

- KR2: 3 enterprise logo's gepubliceerd als casestudies | Huidig: 1 | Voortgang: 33% | Status: Risico
  Hoofdoorzaak: Marketing heeft dit niet geprioriteerd — twee klanten gingen akkoord maar papierwerk liep vast
  Actie eigenaar: Marketing sluit beide voor vrijdag
  CEO: Niet nodig
  Betrouwbaarheid: 4/5

Voer dit uit voor mijn OKR's en de gegevens die ik verstrek.
```

### Teamgevoel-check

```
Beoordeel de teamgezondheid op basis van deze signalen.

Signalen (deel wat je hebt):
- Zijn er engineers die 2+ weken niet hebben geleverd?
- Zijn er 1:1's waarbij iemand aangaf geblokkeerd of opgebrand te zijn?
- Slack-berichtpatronen: is [persoon/team] ongewoon stil?
- Recente vertrekken of ontslaggesprekken?
- Cross-functionele wrijving (engineering vs. product, verkoop vs. CS)?
- Iemand aangenomen in de afgelopen 90 dagen die lijkt te worstelen?

Teamgevoel-dimensies:
1. Overbelasting: draagt iemand te veel? Tekenen: gemiste deadlines, kortere Slack-berichten, overgeslagen 1:1's
2. Verkeerde afstemming: is het team duidelijk over prioriteiten? Tekenen: verschillende mensen beantwoorden "wat is het #1 ding" anders
3. Ontkoppeling: is iemand afgehaakt? Tekenen: minimale bijdrage, minder ideeën in vergaderingen
4. Conflict: is er onopgeloste spanning? Tekenen: passieve escalaties, "ik dacht dat zij dat afhandelden"
5. Onzekerheid: is het team onduidelijk over de bedrijfsrichting? Tekenen: "waar bouwen we naartoe?" vragen in 1:1's

Voor elke dimensie: signaal (Groen/Amber/Rood), bewijs, en als Rood — de ene actie om deze week te nemen.

Genereer een teamgevoel-beoordeling op basis van de signalen die ik verstrek.
```

### Tijdsverdelingsraamwerk voor CEO

```
Verdeel mijn week als CEO.

Bedrijfssituatie: [beschrijf in 2-3 zinnen — fase, grootste huidige uitdaging]
Beschikbare uren: [N] uur (na terugkerende vergaderingen)

Gedwongen activiteiten van de huidige week (verplicht):
- [Bestuursvergadering / investeerdersgesprek / all-hands / sollicitatiegesprek sleutelmedewerker / etc.]

Tijdsbakken voor een [Seed / Series A / Series B] CEO:

SEED (0-$1M ARR):
- Product: 40% — je bouwt nog steeds wat klanten nodig hebben
- Klanten: 30% — jouw taak is verkoop en feedbacklussen
- Team: 20% — klein team, hoge contextbehoefte
- Administratie: 10% — fondsenwerving, operaties, juridisch

SERIES A ($1M-$5M ARR):
- Omzet: 35% — enterprise deals sluiten, pipeline repareren, verkoop aanwerven
- Product: 25% — nog steeds dicht bij product maar meer delegeren
- Team: 25% — managementlaag wordt gevormd, leiders behouden en aanwerven
- Investeerder: 15% — bestuursvergaderingsvoorbereiding, rapportage, vroege signalen voor volgende ronde

SERIES B ($5M+ ARR):
- Strategie: 30% — visie, positionering, markt
- Omzet: 25% — grote deals, GTM-beweging, partnerschap
- Team: 30% — gezondheid van het uitvoerend team, organisatieontwerp, cultuur
- Investeerder: 15% — bestuur, volgende ronde, secundair

Waar moet ik deze week tijd aan besteden, gezien mijn situatie?
Werkelijke aanbevolen uurverdeling voor elke prioriteit.
```

### Wekelijks all-hands sjabloon

```
Schrijf de agenda en gespreksonderwerpen voor mijn wekelijkse all-hands.

Duur: [20 / 30 / 45] minuten
Teamomvang: [N]
Formaat: [async Loom + live Q&A / volledig live / alleen async memo]

All-hands raamwerk voor startup-oprichters:

1. BEDRIJFSPOLS (3-5 min — gegevens, geen spin):
   - Één metriek die de beste vertegenwoordiger is van hoe het ons gaat deze week
   - Beter of slechter dan vorige week? Waarom?
   - Wees specifiek: "$820K ARR, +$30K ten opzichte van vorige week — Acme-deal gesloten op vrijdag"
   - Niet: "We maken vooruitgang!" of "Goede week in het algemeen"

2. OVERWINNINGEN VAN DE WEEK (3-5 min — specifieke attributie):
   - Maximaal 3 overwinningen. Één zin elk. Noem de persoon/het team.
   - "Maria heeft de CSV-export verzonden waar 4 enterprise klanten op wachtten."
   - Niet: "Het team deed geweldig werk deze week op alle fronten."

3. EERLIJKE UPDATE OVER WAAR WE WORSTELEN (3-5 min):
   - Het ding dat de meeste oprichters niet zeggen in all-hands — maar wel zouden moeten
   - Het team respecteert openheid, niet positief theater
   - "We lopen achter op de Series A-pipeline. Ik besteed volgende week aan 8 investeerdersgesprekken."
   - Niet: "Veel opwindende kansen voor ons!"

4. FOCUS VOLGENDE WEEK — HET ENE DING (2 min):
   - Wat is de meest belangrijke stap van het bedrijf volgende week?
   - "Deze week: sluit de Stripe-integratie af. Al het andere is secundair."

5. TEAMSPOTLIGHT (optioneel, 2-3 min):
   - Één persoon, één specifieke bijdrage, waarom het ertoe deed

6. OPEN Q&A (resterende tijd):
   - Geen soft vragen uitgezaaid — laat echte vragen opkomen
   - Als er geen vragen zijn: "Wat is het ene ding waarover je het meest onzeker bent?"

Genereer mijn all-hands script met de gegevens die ik verstrek.
```

## Voorbeeld

**Gebruiker:** Week eindigend 1 juni. ARR $890K (up $22K). Eén deal van $12K ACV gesloten, één deal van $8K verloren aan concurrent. API rate limiting-functie verzonden. Eén engineer was stil in 1:1 en zei dat hij zich "uitgeput" voelt. Q2 OKR voor $1,1M ARR op 30 juni — nu in gevaar. Kas: $1,1M over, burn $95K/maand.

**Uitvoer:**

```markdown
# Wekelijkse Oprichtersbeoordeling — Week Eindigend 1 Juni

## Bedrijfsgezondheid
- Omzet: AMBER — $890K ARR, up $22K. Op tempo voor $945K op 30 juni vs. doel $1,1M. Kloof: $155K.
- Pipeline: AMBER — Netto neutrale week. Eén winst, één verlies. Competitief verlies om te beoordelen.
- Product: GROEN — API rate limiting verzonden; deblokkeer enterprise klanten.
- Team: AMBER — Signaal van overbelasting aan de engineeringkant (zie hieronder).
- Kas: ROOD — 11,6 maanden startbaan bij huidige burn. Onder de drempel van 12 maanden.
- Algemeen: AMBER. Omzettraject en kaspositie zijn de dubbele drukpunten.

## OKR-controle
- OKR: $1,1M ARR op 30 juni | Huidig: $890K | Kloof: $210K | 29 dagen over
  Status: IN GEVAAR — zou ~$7K/dag netto nieuwe ARR vereisen vanaf vandaag.
  Hoofdoorzaak: Dealsnelheid is 2-3 weken achter op plan. Drie deals van $40K+ verwacht in mei verschoven.
  CEO-actie: Wat is er met de drie verschoven deals? Bel elk volgende week.

## Wat werkte
1. API rate limiting verzonden — 3 enterprise trials waren hierdoor geblokkeerd. Verwacht conversiesignalen.
2. $12K ACV deal gesloten — eerste klant in de logistieke verticaal, nieuw ICP-signaal.
3. Deelname aan wekelijkse all-hands gestegen naar 94% (van 78%) — team is betrokken.

## Wat niet werkte
1. $8K deal verloren aan [concurrent]. Reden opgegeven: "betere Slack-integratie." Dit is de derde keer
   dit kwartaal dat we verliezen op integratiekwaliteit. Niet eenmalig — vereist een productbeslissing.
2. Series A-pipeline zou op 15 gekwalificeerde investeerders moeten staan. Momenteel op 9.
   Hoofdoorzaak: Outbound investeerderscontact gedeprioriteerd in mei tijdens enterprise push.

## Teamgevoel
- AMBER: Eén engineer gaf "uitgeput" aan in 1:1. Kruiscontrole: hebben ze sprint-verplichtingen gemist?
  Zo ja — verdeel scope opnieuw deze week. Zo nee — 1:1 om te begrijpen wat "uitgeput" voor hen betekent.
- Bekijk sprint-allocatie: wie draagt momenteel de meeste gelijktijdige projecten?

## CEO-prioriteit volgende week
1. Sluit de drie verschoven $40K+ deals (gesprekken maandag/dinsdag) — $120K ARR potentieel
2. Heractiveer investeerderscontact — 6 meer gekwalificeerde vergaderingen nodig voor juli

## De Ene Beslissing
Investeren we in Slack-integratiekwaliteit om dealverlies hierop te stoppen, of betwisten we de verliessreden
en kijken we of integratie een excuus is voor een prijs-/waardeobjectie?
Beslissingseigenaar: CEO + CTO — deadline: woensdag standup.
```

---
