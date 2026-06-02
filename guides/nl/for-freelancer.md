# Claude voor Freelancers en Consultants

Alles wat een freelancer of zelfstandig consultant nodig heeft om AI-ondersteunde klantenwerving, projectbeheer, facturering en bedrijfsontwikkeling uit te voeren in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een freelancer of zelfstandig consultant — ontwerper, ontwikkelaar, schrijver, strateeg, marketeer of specialist — die zijn eigen klantdiensten­bedrijf runt. Je inkomen hangt af van het winnen van projecten, ze goed uitvoeren, betaald worden en de pijplijn continu gevuld houden. Je besteedt 30% van je tijd aan bedrijfsoperaties die geen omzet genereren. Claude Code vermindert die overhead zodat je meer tijd kunt besteden aan declarabele werkzaamheden en bedrijfsontwikkeling.

**Voor Claude Code:** 2 uur om een winnend voorstel te schrijven. 45 minuten om een scope of work op te stellen. 30 minuten per klantstatus­rapport. Uren per maand achter onbetaalde facturen aanjagen.

**Erna:** Voorstel in 20 minuten. Scope of work in 15 minuten. Statusrapport in 8 minuten. Factuur-follow-up opgesteld in 60 seconden.

---

## Installatie in 30 seconden

```bash
# Installeer alle freelancer-vaardigheden
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/agency-operations

# Installeer de CEO-advisor-agent
npx claudient add agent advisors/ceo-advisor
```

---

## Jouw Claude Code-freelancerstack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/freelancer-proposal` | Win meer projecten — voorstelschrijven met duidelijke waardepropositie, prijsredenering en call-to-action | Elke nieuwe projectmogelijkheid |
| `/scope-of-work` | Definieer deliverables, uitsluitingen, tijdlijn, betaling en change order-beleid | Voor het starten van elk project |
| `/client-status-report` | Wekelijkse/maandelijkse klantenupdates — voortgang, blokkades, benodigde beslissingen | Actief projectbeheer |
| `/invoice-chaser` | Professionele betalingsopvolging voor achterstallige facturen — escalerende reeks | Elke achterstallige factuur |
| `/cold-outreach` | Outbound prospectie naar nieuwe klanten — gepersonaliseerd, niet spammig | Bedrijfsontwikkeling |
| `/cash-flow-forecast` | 90-daagse kasprognose — wanneer geld binnenkomt, wanneer rekeningen uitgaan | Maandelijkse financiële planning |
| `/agency-operations` | SOP's, onboarding, teamprocessen als je aan het opschalen bent | Groei voorbij solowerk |

### Agent

| Agent | Model | Wanneer te starten |
|---|---|---|
| `ceo-advisor` | Sonnet | Prijsbeslissingen, moeilijke klantsituaties, bedrijfsstrategie |

---

## Dagelijkse workflow

### Ochtend (15 minuten)

**1. Nieuwe mogelijkheid — scope en reageer**
```
/freelancer-proposal

Nieuwe projectaanvraag ontvangen. Dit vertelden ze me:
[Plak klantbericht of briefing]

Mijn diensten: [wat je doet]
Mijn tarief: $[X]/uur of $[X] voor dit type project
Sleutelvragen die ik heb: [wat je moet weten voordat je een voorstel doet]

Stel een reactie op die:
1. Hun aanvraag erkent
2. 2-3 verduidelijkende vragen stelt (niet 10 — respecteer hun tijd)
3. Een ruwe schatting geeft als ik genoeg weet om dit te doen
4. Een gesprek van 20 minuten voorstelt om te bespreken

Toon: zelfverzekerd, deskundig, warm.
```

**2. Actief project — statusrapport voor klant**
```
/client-status-report

Wekelijkse statusupdate voor [klantnaam] — [projectnaam].

Week van: [datums]
Afgerond: [lijst wat je hebt gedaan]
In uitvoering: [huidig werk]
Geblokkeerd door: [wat je van hen nodig hebt — wees specifiek]
Volgende week: [wat je gaat doen]
```

---

### Bij het winnen van een nieuw project

**3. Winnend voorstel**
```
/freelancer-proposal

Schrijf een voorstel voor deze projectmogelijkheid.

Klant: [bedrijfsnaam, contactnaam]
Wat ze nodig hebben: [projectomschrijving]
Budget (indien bekendgemaakt): $[X]
Tijdlijn die ze noemden: [X weken/maanden]
Hoe ik het ga aanpakken: [jouw methodologie]
Waarom ik de juiste keuze ben: [relevante ervaring, eerdere resultaten]

Mijn voorgestelde prijs: $[X]
```

**4. Scope of work — bescherm jezelf**
```
/scope-of-work

Schrijf een scope of work voor het project dat we zojuist hebben overeengekomen.

Klant: [naam]
Project: [beschrijving]
Deliverables: [specifieke lijst]
Uitsluitingen: [wat ik niet doe]
Tijdlijn: [datums]
Betaling: $[X], [X]% vooraf, [X]% bij oplevering
Revisies: [X ronden inbegrepen]
Change order-tarief: $[X]/uur
```

---

### Wanneer je niet betaald bent

**5. Factuur-follow-up**
```
/invoice-chaser

Factuur #[X] voor $[X] is [X] dagen achterstallig.

Klant: [naam]
Factuurdatum: [datum]
Vervaldatum: [datum]
Betalingsvoorwaarden: [Netto 15 / Netto 30]
Contact: [naam, e-mail]
Eerdere follow-ups: [geen / gemaild op [datum] / gebeld op [datum]]

Stel een follow-up op die passend escaleert voor [X] dagen achterstallig.
Houd de deur open voor betaling terwijl je duidelijk bent over de ernst.
```

---

### Bedrijfsontwikkeling (wekelijks)

**6. Outbound prospectie**
```
/cold-outreach

Onderzoek en stel outreach op naar een potentiële klant.

Doel: [bedrijfsnaam of type bedrijf]
Contact: [naam, titel indien bekend]
Waarom ze mij nodig zouden kunnen hebben: [jouw inschatting]
Mijn relevante ervaring: [wat ik heb gedaan dat relevant is]
Wat ik aanbied: [wat je voor hen zou doen]

Schrijf een gepersonaliseerde outreach-e-mail. Geen verkooppraatje — meer als een professionele introductie met een specifieke observatie over hun bedrijf.
```

---

### Maandelijkse financiële beoordeling

**7. Kasprognose**
```
/cash-flow-forecast

90-daagse kasprognose voor mijn freelance-bedrijf.

Huidige kas: $[X]
Ondertekende contracten met aankomende betalingen:
- [Klant A]: $[X] te voldoen op [datum]
- [Klant B]: $[X] te voldoen op [datum]

Uitstaande facturen (nog niet betaald):
- Factuur #[X] — [klant] — $[X] — [X] dagen achterstallig

Maandelijkse uitgaven:
- [Software/tools]: $[X]/maand
- [Boekhouding/admin]: $[X]/maand
- [Overige]: $[X]/maand

Aankomende uitgaven (eenmalig):
- [Item]: $[X] in [maand]

Pijplijn (nog niet ondertekend):
- [Prospect A]: $[X] — kans [hoog/gemiddeld/laag]
- [Prospect B]: $[X] — kans [gemiddeld]

Laat me zien: maand-voor-maand kasstroom, wanneer ik mogelijk een tekort heb, wat dit veroorzaakt.
```

---

## 30-dagenplan (nieuwe freelancers of nieuwe markt)

### Week 1 — Bedrijfsinfrastructuur
- Installeer alle freelancer­vaardigheden: `npx claudient add skill small-business/[naam]`
- Schrijf je standaard voorstelsjabloon met `/freelancer-proposal` — personaliseer voor jouw diensten
- Schrijf je hoofd-scope-of-work-sjabloon met `/scope-of-work` — gebruik het voor elk toekomstig project
- Definieer je prijsstelling: uurtarief, projecttarieven, retainer­tarieven — documenteer ze

### Week 2 — Actief klantbeheer
- Gebruik `/client-status-report` op alle actieve projecten — stel een wekelijks vrijdagritme in
- Gebruik `/invoice-chaser` op elke achterstallige factuur — laat het niet voorbij 7 dagen gaan
- Voer `/cash-flow-forecast` uit om je 90-daagse positie te begrijpen

### Week 3 — Bedrijfsontwikkeling
- Identificeer 10 potentiële klanten via je bestaande netwerk
- Gebruik `/cold-outreach` om gepersonaliseerde berichten voor elk op te stellen — besteed 5 minuten aan personalisatie per bericht
- Volg reacties — welke haak werkt het beste voor jouw markt?

### Week 4 — Systematiseer
- Gebruik `/agency-operations` om je onboarding­proces te documenteren (wat nieuwe klanten in week 1 ontvangen)
- Schrijf een klant-FAQ met Claude — vermindert de tijd besteed aan het beantwoorden van dezelfde vragen
- Beoordeel je tarieven: houd je tijd nauwkeurig bij? Ben je te laag geprijsd?

---

## Prijsstelling en bedrijfsstrategie

Gebruik de CEO-advisor-agent voor moeilijke bedrijfsbeslissingen:

**Tarieven verhogen:**
```
/ceo-advisor

Ik wil mijn tarieven verhogen van $[X]/uur naar $[X]/uur. Mijn huidige klanten betalen $[X]. Ik ben [X] jaar freelancer. Mijn pijplijn is vol.

Help me nadenken over:
- Hoe de tariefverhoging te communiceren aan bestaande klanten
- Of bestaande contracten te grandfather­en of onmiddellijk toe te passen
- Hoe mijn nieuwe tarief te positioneren voor nieuwe klanten
- Of over te stappen op projectprijzen in plaats van uurtarief
```

**Een slechte klant ontslaan:**
```
/ceo-advisor

Ik heb een klant die [beschrijf het probleem: betaalt te laat, constante scope creep, respectloos, niet winstgevend]. Ze vertegenwoordigen [X]% van mijn maandelijkse omzet.

Help me nadenken over:
- Of ik ze moet ontslaan of proberen de relatie te repareren
- Als ik ze moet ontslaan, hoe dit professioneel te doen
- Hoe de omzet te vervangen
```

**Een retaineraanbod evalueren:**
```
/ceo-advisor

Een klant wil me op een maandelijkse retainer zetten voor $[X]/maand voor [X] uur. Mijn huidige dagtarief is $[X].

Is dit een goede deal? Hoe moeten de retainervoorwaarden eruitzien? Wat zijn de risico's?
```

---

## Integraties met hulpmiddelen

### Facturering (Wave, FreshBooks, Bonsai)
Claude stelt je professionele voorstel en scope of work op → je plakt ze in je facturerings­tool om het project aan te maken en facturen te genereren. Gebruik voor factuur­opvolging `/invoice-chaser` om e-mails op te stellen → verstuur vanuit je facturerings­tool of direct.

### Tijdregistratie (Toggl, Harvest, Clockify)
Registreer tijd in je tool → exporteer wekelijkse totalen → plak in `/client-status-report` om je deliverables te contextualiseren met bestede tijd (handig voor uurtarief­transparantie).

### Contractondertekening (DocuSign, PandaDoc, HelloSign)
Claude genereert de SOW-tekst → plak in je e-handtekeningtool → stuur ter ondertekening. Sla voor terugkerende klanten je Claude-gegenereerde sjablonen op in PandaDoc of Bonsai.

### CRM / pijplijn (HubSpot gratis, Notion, Airtable)
Gebruik een eenvoudig Kanban voor je pijplijn: Prospect → Voorstel verstuurd → Onderhandelen → Actief → Gefactureerd → Betaald. Claude helpt bij elke fase — `/cold-outreach` voor Prospect, `/freelancer-proposal` voor Voorstel verstuurd, `/scope-of-work` voor Actief.

---

## Bij te houden statistieken

| Statistiek | Doel | Maandelijks bijhouden |
|---|---|---|
| Winpercentage op voorstellen | >35% | Verstuurde voorstellen / gewonnen projecten |
| Gemiddelde projectwaarde | [jouw doel] | Groeiend of stagnerend? |
| Dagen tot betaling | <15 dagen | Markeer klanten die traag betalen |
| Benutting­spercentage | 70-80% van werkuren declarabel | Boven 80% = tarieven verhogen of aanwerven |
| Omzet per klant | Volg top 3 klanten | Laat geen enkele klant >40% van omzet vertegenwoordigen |
| Uren bedrijfsontwikkeling | 5-10% van je tijd | Als nul, heb je een feast/famine-cyclus |
| Netto-inkomstenmarge | >50% (diensten­bedrijf) | Jouw aandeel na tools, belastingen, admin |

---

## Veelgemaakte fouten (en hoe Claude Code ze voorkomt)

**Fout 1: Vage scope = scope creep**
`/scope-of-work` dwingt je om elke deliverable op te sommen en elke uitsluiting te vermelden. Geen vage scope toegestaan.

**Fout 2: Geen change order-proces**
`/scope-of-work` bevat de change order-clausule. Elk aanvullend verzoek triggert dit — geen gratis werk meer.

**Fout 3: Geen follow-up op achterstallige facturen**
`/invoice-chaser` maakt follow-up 60 seconden werk. Geen "ik doe het als ik even tijd heb" meer.

**Fout 4: Voorstellen die proces beschrijven in plaats van uitkomsten**
`/freelancer-proposal` begint met klantuitkomsten. Je proces is secundair aan hun resultaten.

**Fout 5: Verrassingen in kasstroom**
`/cash-flow-forecast` elke maand. Ken je 90-daagse positie voordat het een crisis wordt.

---

## Bronnen

- [Aan de slag met Claude Code](getting-started.md)
- [Scope of work-vaardigheid](../skills/small-business/scope-of-work.md)
- [Klientstatusrapport-vaardigheid](../skills/small-business/client-status-report.md)
- [Factuurachtervolger-vaardigheid](../skills/small-business/invoice-chaser.md)
- [Freelancer wekelijkse workflow](../workflows/freelancer-weekly.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
