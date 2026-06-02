# Claude voor Makelaars

Alles wat een residentieel makelaar nodig heeft om AI-ondersteund listings beheer, koperswerk, CMA-presentaties, outreach en klantcommunicatie uit te voeren in Claude Code.

---

## Voor wie is dit bedoeld

Je bent makelaar — solo of in een team — die verdient door relaties om te zetten naar gesloten transacties. Je tijd wordt opgeslokt door het schrijven van listingbeschrijvingen, het onderzoeken van vergelijkbare woningen, het opstellen van aanbiedings brieven, het opvolgen van leads en het informeren van 20 actieve klanten. Claude Code elimineert het repetitieve schrijfwerk zodat je bij klanten kunt zijn in plaats van achter een toetsenbord.

**Voor Claude Code:** 45 minuten om een CMA-narratief te schrijven. 20 minuten per listingbeschrijving. 15 minuten per bezichtiging-follow-up. Uren marktonderzoek per week.

**Erna:** CMA-narratief in 3 minuten. Listingbeschrijving in 90 seconden. Bezichtiging-follow-up in 60 seconden. Wekelijkse marktupdate in 5 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer alle makelaarsvaardigheden
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/customer-inquiry

# Installeer de makelaarsspecialist-agent
npx claudient add agent roles/real-estate-specialist
```

---

## Jouw Claude Code makelaarsstack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/real-estate-listing` | MLS-beschrijvingen, bezichtiging-follow-ups, lead-nurture-sequenties, social posts — conform Eerlijke Huisvesting | Nieuwe listing, na bezichtiging, social content |
| `/cma-report` | Volledig CMA-narratief: selectie vergelijkbare woningen, aanpassingsanalyse, prijslagen, verkoperspresentatie | Elk listingafspraak |
| `/buyer-offer-writer` | Persoonlijke begeleidingsbrieven en agent-aan-agent-brieven voor aanbiedingen — emotionele en concurrerende scenario's | Elke aanbieding |
| `/cold-outreach` | Farming-brieven, FSBO-outreach, outreach verlopen listings, contacten in invloedssfeer | Prospectiecampagnes |
| `/customer-inquiry` | Reageren op inkomende koper/verkoper-vragen — kwalificeren, koesteren, converteren | Nieuwe leads van Zillow, Realtor.com, verwijzingen |

### Agent

| Agent | Model | Wanneer te starten |
|---|---|---|
| `real-estate-specialist` | Sonnet | Volledige listingvijovooereidingssessies, voorbereiding koperskonsultaties, marktonderzoek |

---

## Dagelijkse workflow

### Ochtend (20-30 minuten)

**1. Lead follow-up — nieuwe vragen 's nachts**
```
/customer-inquiry

Ik heb [X] nieuwe leads van [Zillow / verwijzing / open huis]. Hier zijn de details:

Lead 1:
Naam: [naam]
Bron: [bron]
Bericht: [wat ze zeiden]
Woning waarnaar ze vroegen: [adres of prijsklasse]
Tijdlijn: [wat je weet]

Schrijf reacties voor elk. Warm, professioneel, richting een telefoongesprek of bezichtiging.
```

**2. Bezichtiging-follow-ups — bezichtigingen van gisteren**
```
/real-estate-listing

Follow-up na bezichtiging voor:
- Kopernaam: [naam]
- Woning: [adres]
- Wat ze leuk vonden: [notities van bezichtiging]
- Geuite zorgen: [notities]
- Hun tijdlijn: [X maanden]
- Concurrentie: [andere woningen die ze hebben gezien]

Schrijf een gepersonaliseerde follow-up e-mail. Verwijs naar iets specifieks van de bezichtiging. Zachte volgende stap.
```

---

### Voorbereiding listingafspraak (60-90 minuten van tevoren)

**3. CMA-rapport — volledige verkoperspresentatie**
```
/cma-report

Onderwerp woning: [slaapkamers/badkamers, m², buurt, bouwjaar, renovaties]

Vergelijkbare verkopen:
Comp 1: [details]
Comp 2: [details]
Comp 3: [details]

Actieve concurrentie:
Actief 1: [details]
Actief 2: [details]

Marktcontext: [absorptiepercent, gem. DOM, vraag-tot-verkoop-verhouding]
Tijdlijn verkoper: [X weken]
Mijn aanbevolen prijsklasse: €[X] – €[X]

Genereer het volledige CMA-rapport en het narratief voor de verkoperspresentatie.
```

**4. Listing-marketing — MLS-tekst en social**
```
/real-estate-listing

Nieuwe listing — schrijf MLS-beschrijving en social-mediaberichten.

Woning: [slaapkamers/badkamers, m², kernkenmerken, buurt]
Top 5 kenmerken: [lijst]
Doelkoper levensstijl: [beschrijf]
MLS tekenlimiet: [X woorden]
```

---

### Aanbiedingssituaties

**5. Kopersaanbiedingsbrief — concurrerend scenario**
```
/buyer-offer-writer

Koper: [voornamen]
Aanbieding: €[X] op €[X] vraagprijs
Verkopersprofiel: [wat je weet — langdurige eigenaar, geeft om erfenis, etc.]
Wat kopers leuk vinden aan de woning: [specifieke kenmerken]
Koperssterke punten: [voorafgaande goedkeuring, aanbetaling, verzakingen contingentie]
Concurrerende context: [meerdere biedingen verwacht]

Genereer persoonlijke begeleidingsbrief (conform Eerlijke Huisvesting) + agent-begeleidingsbrief.
```

---

### Wekelijkse taken (vrijdag — 30 minuten)

**6. Marktupdate voor actieve klanten**
```
/cold-outreach

Schrijf een wekelijkse marktupdatee-mail voor mijn actieve kopersklanten.

Marktstatistieken deze week:
- Nieuwe listings in hun prijsklasse: [X]
- Prijsverlagingen: [X]
- Verkocht deze week: [X]
- Gemiddelde verkoopprijs: €[X]
- Gemiddelde DOM: [X] dagen
- Renteupdate: [X]%

Zoekcriteria van mijn klanten: [prijsklasse, gebied, woningtype]
Toon: Informatief, deskundig, niet alarmerend. Positioneer mij als hun vertrouwde adviseur.
```

**7. Contact invloedssfeer — maandelijkse farming**
```
/cold-outreach

Maandelijkse farming-e-mail naar mijn invloedssfeer.

Onderwerp deze maand: [marktupdate / onderhoudstip woning / lokaal evenement / listing-aankondiging]
Mijn farm-gebied: [buurt]
Doel: Top of mind blijven, niet verkopen.

Schrijf een e-mail van 150 woorden die persoonlijk klinkt, niet als een nieuwsbrief. Inclusief één nuttig feit en één zachte CTA (koffieafspraak, woningwaardecheck, verwijzingsverzoek).
```

---

## 30-daags opstartplan (nieuwe makelaars of nieuwe markt)

### Week 1 — Installatie en marktkennis
- Installeer alle makelaarsvaardigheden via `npx claudient add skill small-business/[naam]`
- Voer `/cma-report` uit op 5 recente verkopen in je farm-gebied om je vergelijkingslezing te kalibreren
- Gebruik `/real-estate-listing` om 3 van je vroegere listingbeschrijvingen te herschrijven — vergelijk kwaliteit
- Breng je invloedssfeer in kaart: 50 contacten → voer `/cold-outreach` uit voor je eerste aanraking

### Week 2 — Listing- en kopersworkflows
- Voer een volledige listingafspraakoefening uit met `/cma-report` op een nabijgelegen woning (oefening)
- Schrijf je eerste 10 bezichtiging-follow-ups met `/real-estate-listing` — stel een timer in: doel <3 min per stuk
- Bouw een 4-touch koper-nurture-sequentie met `/real-estate-listing` voor een koper met 6 maanden tijdlijn

### Week 3 — Prospectie
- Start je eerste FSBO-outreach-campagne met `/cold-outreach` — 10 FSBO's in je gebied
- Verlopen listings outreach: identificeer 5 recent verlopen listings, stel gepersonaliseerde outreach op
- Voer een geografische farm uit: 100-woningen-gebied, maandelijkse aanraking, bijhouden reactieratio

### Week 4 — Concurrerende situaties
- Oefen `/buyer-offer-writer` op de volgende aanbieding van je koper vóór indiening
- Voer de escalatieclausule-prompt uit — begrijp de mechanica voordat je ze in het moment nodig hebt
- Bijhouden je metrieken: bezichtigingen per listing, follow-up reactieratio, CMA-afspraakconversie

---

## Tool-integraties

### Je CRM

```json
// Voeg toe aan ~/.claude/settings.json voor CRM-verbonden workflow
// De meeste makelaars gebruiken Follow Up Boss, LionDesk of KVCore
{
  "mcpServers": {
    "followupboss": {
      "command": "npx",
      "args": ["-y", "@followupboss/mcp-server"],
      "env": {
        "FUB_API_KEY": "your-key-here"
      }
    }
  }
}
```

Met CRM verbonden kan Claude:
- De volledige geschiedenis van een contact ophalen voordat je een follow-up schrijft
- Interacties loggen na elke klantcommunicatie
- Contacten markeren die al 30+ dagen niet zijn aangeraakt

### MLS-data
Exporteer je vergelijkingsdata als CSV of plak rechtstreeks vanuit je MLS → Claude leest het en formatteert voor CMA-analyse. Geen speciale integratie nodig.

### DocuSign / DotLoop
Claude schrijft de tekst en gespreksonderwerpen — je plakt in je transactiebeheerplatform. Toekomst: webhook-triggers om automatisch te schrijven wanneer een formulier wordt geopend.

### Canva / marketingmateriaal
Gebruik Claude om de tekst te genereren → plak in Canva-sjablonen voor listingflyers, social posts en farming-mailings. Claude past tekenlimiter aan wanneer je die specificeert.

---

## Bij te houden metrieken

| Metriek | Baseline (handmatig) | Doel met Claude |
|---|---|---|
| Tijd per listingbeschrijving | 45 min | 5 min |
| Tijd per CMA-narratief | 60 min | 10 min |
| Tijd per bezichtiging-follow-up | 15 min | 3 min |
| Aanraakfrequentie invloedssfeer | Maandelijks (als je eraan denkt) | Wekelijks (geautomatiseerde concepten) |
| Listingafspraak-conversie | Bijhouden vanaf eerste CMA | Benchmark na 10 CMA's |
| Aanbiedinggodkeuring (koperskant) | Bijhouden | Bijhouden brief vs. geen brief |

---

## Veelgemaakte fouten (en hoe Claude Code ze voorkomt)

**Fout 1: Eerlijke Huisvesting-schendingen in listingtekst**
Claude markeert en verwijdert automatisch taal over beschermde klassen. Je doet altijd een eindreview — Claude is een bescherming, geen garantie.

**Fout 2: Generieke bezichtiging-follow-ups die genegeerd worden**
`/real-estate-listing` vereist dat je specifieke notities van de bezichtiging verstrekt. Geen notities = geen e-mail. Dwingt je te luisteren tijdens bezichtigingen.

**Fout 3: Een CMA presenteren zonder narratief**
Verkopers onthouden geen data — ze onthouden verhalen. `/cma-report` genereert het narratief dat je hardop voorleest. Het is het verschil tussen een prijs en een gesprek.

**Fout 4: Een kopersbrief te veel personaliseren en aansprakelijkheid voor Eerlijke Huisvesting triggeren**
`/buyer-offer-writer` controleert op taal over beschermde klassen voordat je indient.

**Fout 5: Contacten in invloedssfeer koud laten worden**
Stel een wekelijkse herinnering in → `/cold-outreach` → maandelijkse aanraking invloedssfeer in 5 minuten.

---

## Bronnen

- [Aan de slag met Claude Code](getting-started.md)
- [Real estate listing-vaardigheid](../skills/small-business/real-estate-listing.md)
- [CMA-rapport-vaardigheid](../skills/small-business/cma-report.md)
- [Kopersaanbiedingsschrijver-vaardigheid](../skills/small-business/buyer-offer-writer.md)
- [Cold outreach-vaardigheid](../skills/small-business/cold-outreach.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
