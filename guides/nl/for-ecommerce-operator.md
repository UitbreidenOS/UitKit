# Claude voor E-commerce Operators

Alles wat een e-commerce operator nodig heeft voor AI-ondersteunde productvermeldingen, klantenservice, marketingcampagnes en operationele rapportage — of je nu op Shopify, Amazon, Etsy of alle drie zit.

---

## Voor wie is dit bedoeld

Je bent een e-commerce operator, online winkelhouder of marktplaatsverkoper wiens werk zich uitstrekt over product, marketing, klantenservice en operaties. Je schrijft vermeldingen, voert e-mailcampagnes uit, beheert reviews, behandelt retouren en monitort advertentie-uitgaven — vaak allemaal op dezelfde dag.

**Voor Claude Code:** Nieuwe productvermelding: 45 minuten. Klachtreactie van klant: 15 minuten (en je twijfelt aan jezelf). E-mailcampagne: 2 uur. Maandelijkse rapportage: een halve dag.

**Na:** Productvermelding geoptimaliseerd in 15 minuten. Klantklacht afgehandeld in 3 minuten. E-mailcampagne gebrieft en geconcept in 30 minuten. Maandrapport opgehaald en opgemaakt in 20 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer de volledige e-commerce stack
npx claudient add skills small-business/shopify-operations
npx claudient add skills small-business/ecommerce-seller
npx claudient add skills small-business/email-campaign
npx claudient add skills small-business/review-response
npx claudient add skills marketing/paid-ads
npx claudient add skills small-business/product-listing-optimizer
npx claudient add skills small-business/returns-handler
npx claudient add agents specialists/ecommerce-specialist
```

---

## Jouw Claude Code e-commerce stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/product-listing-optimizer` | Optimaliseer vermeldingen voor SEO en conversie: titel, bulletpoints, beschrijving, A+ content, afbeeldingsbriefing | Nieuwe vermeldingen, laag-converterende SKU's, seizoensvernieuwingen |
| `/ecommerce-seller` | Volledige verkoopoperaties: prijsstrategie, voorraadbeslissingen, marktplaatsstactieken | Dagelijkse verkopersbeslissingen |
| `/shopify-operations` | Shopify-specifiek: winkelopzet, themabeslissingen, app-aanbevelingen, afrekenoptimalisatie | Shopify-winkelbeheer |
| `/email-campaign` | Campagneplanning, tekst, verzendstrategie voor e-mailmarketing | Promotionele en nieuwsbriefcampagnes |
| `/review-response` | Reageer op klantreviews: positief, negatief, neutraal — alle kanalen | Dagelijkse reviewtriage |
| `/returns-handler` | Retourbel eid, reactiesjablonen, geschiloplossing, trendanalyse | Retour- en terugbetalingsbeheer |
| `/paid-ads` | Advertentietekst, campagnestructuur, doelgroeptargeting, performanceanalyse | Betaalde social en zoekadvertenties |

### Agents

| Agent | Model | Wanneer in te schakelen |
|---|---|---|
| `ecommerce-specialist` | Sonnet | Complexe beslissingen: marktplaatsstrategie, seizoensplanning, categorieuitbreiding |

---

## Dagelijkse workflow

### Ochtend verkoopdashboard (15 minuten)

Begin elke dag met een duidelijk beeld van performance:

```
/ecommerce-seller

Ochtend check-in voor [DATUM]:

Metrics van gisteren:
- Omzet: [$X]
- Bestellingen: [X]
- Gemiddelde bestelwaarde: [$X]
- Verkochte eenheden per top-SKU: [lijst]
- Retouraanvragen: [X]
- Nieuwe reviews: [positief: X / negatief: X]
- Advertentie-uitgaven: [$X] / ROAS: [X]
- Verlaten winkelwagenratio: [X%]

Markeer:
- Elke SKU met voorraad < 14 dagen aanbod bij huidige snelheid
- Elke advertentiecampagne met ROAS onder drempel [$X doel]
- Negatieve reviews die dezelfde dag reactie nodig hebben
- Bestellingen met risico op uitvoeringsvertraging
```

---

### Klantvragen en reviewbeheer (20-30 minuten)

**Negatieve reviewreactie:**

```
/review-response

Platform: [Amazon / Google / Trustpilot / Etsy]
Review: [plak reviewtekst]
Sterrenrating: [1-3]
Product: [naam]
Bestelgegevens die ik heb (indien aanwezig): [plak]

Schrijf een professionele reactie die:
- De specifieke klacht erkent (geen generiek excuus)
- Vermeldt wat we doen om het te verhelpen (of al hebben gedaan)
- Een oplossingspad biedt (vervanging, terugbetaling, direct contact)
- Niet defensief is
- Onder de 100 woorden blijft
```

**Retouraanvraag:**

```
/returns-handler

Scenario: [beschrijf het verzoek — bijv. klant wil laarzen retourneren bewerende dat de zool na 3 weken loslaat]
Bestelgegevens: [datum, product, bedrag]
Binnen beleidsvenster: [ja / nee — en welk beleid van toepassing is]

Schrijf: klantreactie + interne notitie voor logboekregistratie.
```

---

### Vermeldingsoptimalisatie (30-60 minuten)

**Nieuwe productvermelding:**

```
/product-listing-optimizer

Marktplaats: [Amazon / Shopify / Etsy / eBay]
Product: [naam en beschrijving]
Categorie: [categorie + subcategorie]
Prijs: [$X]
Doelklant: [wie dit koopt, welk probleem het oplost]
Kernfuncties: [lijst]
Topconcurrent: [naam of URL]

Produceer: trefwoordonderzoek, geoptimaliseerde titel, 5 bulletpoints, beschrijving, afbeeldingsbriefing.
```

**Vermeldingsaudit (laag-converterende SKU):**

```
/product-listing-optimizer

Auditmodus.

Huidige vermelding: [plak titel + bulletpoints + beschrijving]
Huidige conversieratio: [X%] (categoriegemiddelde: [Y%])
Huidige ranking voor hoofdtrefwoord: [positie of onbekend]

Diagnosticeer: wat schaadt de conversie? Score elk element. Geef me de top 2 hoogst-impact fixes.
```

---

### Advertentieperformancereview (20 minuten)

```
/paid-ads

Platform: [Meta Ads / Google Ads / Amazon PPC]

Performance afgelopen 7 dagen:
- Totale uitgaven: [$X]
- Toegeschreven omzet: [$X]
- ROAS: [X]
- CTR: [X%]
- Conversieratio: [X%]
- Top 3 campagnes: [naam, uitgaven, ROAS elk]
- Bottom 3 campagnes: [naam, uitgaven, ROAS elk]

Analyse:
- Welke campagnes zijn onder doel-ROAS? Aanbeveling: pauzeer / verlaag bod / vernieuw creatief
- Welke doelgroepen presteren bovengemiddeld? Aanbeveling: schaal op
- Zijn er budgetverdelingswijzigingen die ik vandaag moet doorvoeren?
```

---

### Voorraadcheck (10 minuten, dagelijks)

```
/ecommerce-seller

Voorraadstatus:

[Plak je voorraad-CSV of maak een lijst van kern-SKU's met: eenheden voorhanden, dagelijks gemiddeld verkoopsnelheid]

Markeer:
- Uitverkooprisico in < 14 dagen bij huidige snelheid
- Overgestokte items (> 90 dagen aanbod) — aanbeveling: korting of bundel
- Nabestelaanbevelingen: hoeveelheid en timing op basis van levertijd van [X dagen]

Output: geprioriteerde actielijst — wat vandaag bestellen, wat te kortingen, wat te monitoren.
```

---

## Wekelijks ritme

### Maandag — Campagne- en contentplanning

```
/email-campaign

Plan de e-mail van deze week:
- Doelgroepsegment: [segmentnaam, grootte]
- Doelstelling: [omzet genereren / herengageren / product aankondigen]
- Aanbod of contenthoek: [bijv. nieuwe productlancering / 20% uitverkoop / seizoenskenmerk]
- Vorige campagneprestaties: [laatste openingsratio, CTR]

Produceer: campagnebriefing, onderwerpregel (A/B-varianten), e-mailconcept, aanbeveling verzendtijdstip.
```

### Woensdag — Vermeldings- en SEO-check

Voer `/product-listing-optimizer` uit op je laagst-presterende 3 SKU's (op conversieratio).
Eén geoptimaliseerde vermelding per week = significante samengestelde verbetering in 90 dagen.

### Vrijdag — Wekelijks performancerapport

```
/ecommerce-seller

Wekelijks rapport voor [week]:

Omzet: [$X] vs. [$X vorige week] vs. [$X doel]
Bestellingen: [X] / GOW: [$X]
Top 3 producten op omzet: [lijst]
Marketinguitgaven: [$X] / Toegeschreven omzet: [$X] / Gemengde ROAS: [X]
Klantenservice: [X tickets] / [X retouren] / Gemiddelde oplossingstijd: [X uur]
Voorraad: [uitverkoop of overvoorraadrpoblemen?]

Formaat: managementsamenvatting (3 bulletpoints) + gedetailleerde uitsplitsing voor archief.
Waar moet ik volgende week op focussen?
```

---

## Seizoensplanning

Gebruik de `ecommerce-specialist`-agent 60-90 dagen voor grote evenementen:

```
@ecommerce-specialist

Plan onze [Q4 / Prime Day / Black Friday / Valentijnsdag] campagne.

Te featuren producten: [lijst]
Budget: [$X totaal voor marketing]
Tijdlijn: [startdatum tot evenementdatum]
Voorraadpositie: [huidige voorraad + levertijd voor nabestelling]
Resultaten van vorig jaar voor dit evenement (indien van toepassing): [metrics]

Produceer:
- 90-60-30 dagen voorbereiding checklist
- Prijs- en kortingsstrategie
- Campagnekalender (e-mail + betaald)
- Voorraadbestellingshoeveelheden en timing
- Vermeldingsvernieuwingsplan voor gefeatuurde producten
```

---

## 30-daags inwerklist

### Week 1 — Controleer je baseline

- Installeer alle e-commerce skills
- Voer `/product-listing-optimizer` uit in auditmodus op je top 10 omzet-SKU's
- Controleer je huidige retourbel eid met `/returns-handler` — beschermt het je juridisch en behoudt het klanten?
- Haal 30-dagen advertentieperformancedata op en voer een gapanalyse uit met `/paid-ads`
- Stel je dagelijkse dashboardsjabloon in in `/ecommerce-seller`

### Week 2 — Vermeldings- en reviewsvernieuwing

- Herschrijf je 3 laagst-converterende vermeldingen met `/product-listing-optimizer`
- Reageer op elke onbeantwoorde review van de afgelopen 90 dagen met `/review-response`
- Stel een reviewmonitoringworkflow in: dagelijkse reviewtriage als onderdeel van ochtendroutine

### Week 3 — Marketing en klantenservice

- Plan en lanceer je eerste AI-geconcept e-mailcampagne met `/email-campaign`
- Herschrijf je retourbel eid en reactiesjablonen met `/returns-handler`
- Voer een `/paid-ads` creatieve vernieuwing uit op je hoogst-bestedende campagnes

### Week 4 — Systematiseer

- Bouw je wekelijkse rapportagesjabloon met `/ecommerce-seller`
- Train teamleden of VA's op het gebruik van de skills voor dagelijkse triage
- Identificeer je volgende seizoensevenement en begin met 60-daagse planning
- Review maand-over-maand performance: welke metrics verbeterden het meest?

---

## Tool-integraties

### Shopify (winkelbeheer)

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/mcp-server"],
      "env": {
        "SHOPIFY_ACCESS_TOKEN": "your-token",
        "SHOPIFY_STORE_DOMAIN": "yourstore.myshopify.com"
      }
    }
  }
}
```

Met Shopify verbonden: Claude kan bestellingen, productdata en voorraad direct lezen.

### Klaviyo (e-mailmarketing)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

Gebruik voor: segmentanalyse, campagneperformancedata, flowoptimalisatie.

### Google Analytics / GA4

Exporteer je productperformance en verkeersdata als CSV → plak in `/ecommerce-seller` voor analyse.

### n8n (automatisering)

```
Automatiseer de reviewreactielus:
Nieuwe review → classificeer sentiment → stel reactie op → Slack-alert voor menselijke goedkeuring → post

Automatiseer voorraadaringen:
Dagelijkse voorraadcheck → als voorraad < 14 dagen → maak nabestelttaak in je projecttool
```

---

## Te volgen metrics

| Metric | Doel | Rode vlag |
|---|---|---|
| Conversieratio (productpagina) | > 3% (Shopify gem.) / > 15% (Amazon) | < 1,5% |
| Retourrate | < 10% (algemeen) / < 20% (kleding) | > 25% |
| ROAS (betaalde advertenties) | > 3x (minimum) / > 5x (gezond) | < 2x |
| E-mail openingsratio | > 25% | < 15% |
| Review-reactierate | 100% van negatieve reviews | Elke onbeantwoorde negatieve |
| Reactietijd klantvragen | < 4 uur | > 24 uur |
| Uitverkooprate | < 2% van SKU's op elk moment | > 5% |
| GOW (gemiddelde bestelwaarde) | Maand-over-maand groeiend | Dalend 2+ opeenvolgende maanden |

---

## Veelgemaakte fouten en hoe Claude Code helpt ze te vermijden

**Fout 1: Generieke productvermelding die niet rankt**
`/product-listing-optimizer` dwingt trefwoordonderzoek voor het schrijven. Geen trefwoorden = geen ranking = geen verkeer.

**Fout 2: Negatieve reviews negeren**
`/review-response` maakt reageren een taak van 3 minuten. Elke onbeantwoorde negatieve review kost toekomstige conversies.

**Fout 3: Hetzelfde creatief onbeperkt blijven gebruiken**
`/paid-ads` detecteert creatieve vermoeidheid voor je het in ROAS merkt. Vernieuwingssignalen komen van CTR-trends, niet alleen van ROAS.

**Fout 4: Retourbel eid als bijzaak**
`/returns-handler` bouwt beleid dat klanten behoudt en je beschermt tegen fraude. "Neem contact op om te retourneren" is een beleid — het is gewoon het slechtste.

**Fout 5: Voorraad kopen op gevoel**
`/ecommerce-seller` vertaalt je snelheidsdata naar een nabestelaanbeveling. Uitverkoop en overvoorraadrpoblemen zijn allebei duur.

---

## Bronnen

- [Aan de slag met Claude Code](./getting-started.md)
- [Shopify operations skill](../skills/small-business/shopify-operations.md)
- [Product listing optimizer](../skills/small-business/product-listing-optimizer.md)
- [Returns handler](../skills/small-business/returns-handler.md)
- [E-commerce wekelijkse workflow](../workflows/ecommerce-weekly.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
