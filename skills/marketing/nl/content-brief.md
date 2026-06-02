---
name: content-brief
description: "SEO-geoptimaliseerde contentbrief: zoekwoordtargeting, outline, concurrentenhiaten, interne links, CTA"
---

# Content Brief Vaardigheid

## Wanneer activeren
- Een schrijver (mens of AI) briefen voor het produceren van een blogpost, landingspagina of gids
- Zorgen dat SEO-fundamenten zijn ingebakken voor het schrijven begint, niet erna
- Identificeren wat concurrerende content mist voor je je invalshoek kiest
- Langvormige content structureren zodat het featured snippets verdient en rankt
- Briefkwaliteit standaardiseren in een contentteam zodat elk stuk dezelfde lat haalt

## Wanneer NIET gebruiken
- Korte social media posts — te lichtgewicht om zo te briefen
- Interne documenten, SOP's of verkoopdecks — andere structuur, niet SEO-gedreven
- Je schrijft de content zelf zonder brief — begin gewoon met schrijven
- News-jacking / reactieve content — snelheid is hier belangrijker dan briefdiepte

## Instructies

### Kern content brief prompt

```
Genereer een volledige SEO-contentbrief voor dit stuk.

Doelzoekwoord: [primair zoekwoord]
Secundaire zoekwoorden: [noem 3-5 gerelateerde termen]
Doelgroep: [specifieke persoon — functietitel, context, probleem dat ze proberen op te lossen]
Contenttype: [hoe-te / lijstartikel / vergelijking / case study / pijlerpagina / opinie]
Beoogd aantal woorden: [op basis van concurrentieanalyse — vraag Claude te adviseren indien onzeker]
Publicatie: [bedrijfsblog / gastpost / landingspagina]
Zakelijke CTA: [wat we willen dat de lezer aan het einde doet]
Toon: [gezaghebbend / conversationeel / technisch / toegankelijk]
Concurrerende URL's om te verslaan: [top 3-5 rankende pagina's voor het primaire zoekwoord]

Produceer:

## 1. Zoekwoordstrategie
- Primair zoekwoord: [exacte overeenkomst, geschat zoekvolume, moeilijkheidsgraad]
- Op te nemen semantische zoekwoorden: [LSI-termen, vraagvarianten, entiteitsvermeldingen]
- Featured snippet kans: [ja/nee, en welk formaat het moet targeten]
- Zoekintentie: [informatief / navigerend / commercieel / transactioneel]

## 2. Concurrentenhiatenanalyse
Voor elke concurrerende URL:
- Wat ze goed doen (negeer het niet — overeenkom of overtrof)
- Wat ze missen (jouw differentiatieinvalshoek)
- Aantal woorden en contentdiepte
- Unieke data, voorbeelden of perspectieven die ze missen

## 3. Aanbevolen invalshoek
Één zin: waarom dit stuk rankt EN gedeeld wordt boven de concurrenten.

## 4. Volledige content-outline
Met H2's en H3's, geschat aantal woorden per sectie, en notities voor de schrijver.

## 5. Interne links
- 3-5 pagina's op onze site die naar dit stuk moeten linken
- 3-5 bestaande stukken waarnaar dit nieuwe stuk moet linken

## 6. Metatitel, metabeschrijving en URL-slug

## 7. On-page SEO checklist
```

### Zoekwoordstrategiekader

```typescript
interface ContentBrief {
  keyword: {
    primary: string
    volume: string            // monthly searches (approximate)
    difficulty: number        // 0-100 (Ahrefs KD equivalent)
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
    featuredSnippetFormat: 'paragraph' | 'list' | 'table' | 'none'
  }
  semanticKeywords: string[]  // include naturally in the content
  entityKeywords: string[]    // people, tools, brands to mention for topical depth
  questionKeywords: string[]  // "People Also Ask" targets → answer in H2/H3s

  competitors: Array<{
    url: string
    wordCount: number
    strengths: string[]       // what they do well
    gaps: string[]            // what they miss
    differentiator: string    // how to beat this specific URL
  }>

  brief: {
    recommendedWordCount: number
    sections: Array<{
      heading: string         // H2 or H3
      level: 'H2' | 'H3'
      purpose: string         // what this section accomplishes
      wordCount: number       // target for this section
      writerNote: string      // specific guidance (include stat, example, table, etc.)
    }>
  }
}
```

### Concurrentenhiatenanalyse prompt

```
Voer een concurrenten-contenthiatenanalyse uit voor: [PRIMAIR ZOEKWOORD]

Toprangschikkende URL's:
1. [URL 1]
2. [URL 2]
3. [URL 3]

Identificeer voor elke URL:
1. Hoofdinvalshoek en these
2. Contentdiepte (welke onderwerpen worden behandeld vs. oppervlakkig)
3. Unieke data, onderzoek of voorbeelden die ze citeren
4. Formaatkeuzes (tabellen, lijsten, screenshots, video-embeds)
5. Ontbrekende onderwerpen die een lezer nog steeds zou willen na het lezen
6. Zwakste secties (dunne content, verouderde info, generiek advies)

Produceer dan:
- Onze differentiatiematrix: 3 invalshoeken die geen van de top 3 dekt
- Het "ene ding" dat we in dit stuk moeten bezitten wat concurrenten niet hebben
- Bewijstypen die we moeten opnemen (originele data, expertcitaten, case studies)
- Aanbevolen aantal woorden om het gemiddelde van de top 3 te overtreffen
```

### Content-outline generator

```
Genereer een gedetailleerde content-outline.

Onderwerp: [titel of werktitel]
Primair zoekwoord: [zoekwoord]
Doelgroep: [lezersprofiel]
Doel van het stuk: [wat de lezer bereikt door van begin tot eind te lezen]

OUTLINEFORMAAT:
Voor elke sectie:
H2: [Sectietitel — zoekwoordbewust maar niet gevuld]
  Doel: [wat deze sectie bereikt voor de lezer]
  Kernpunten: [2-3 bullets die de schrijver moet behandelen]
  Formaataanbeveling: [paragraaf / lijst / tabel / voorbeeld / screenshot]
  Aantal woorden: [doel voor deze sectie]
  Schrijversnotitie: [specifieke instructie — bijv. "voeg hier een echt klantenvoorbeeld toe"]

Introductievereisten:
- Hook in de eerste zin (statistiek, vraag of gedurfde claim)
- Vestig het probleem van de lezer in zin 2-3
- Beloof het resultaat ("aan het einde hiervan weet je...")
- GEEN "In dit artikel zullen we..." openers
- Primair zoekwoord op natuurlijke wijze in de eerste 100 woorden opnemen

Conclusievereisten:
- Vat de 3 belangrijkste inzichten samen
- CTA: [specifiek — "sjabloon downloaden" / "demo boeken" / "abonneren"]
- Gerelateerde lectuur: [2 interne links]
```

### On-page SEO checklist

```
Controleer voor publicatie:

TITELMARKERING (metatitel):
- [ ] Bevat primair zoekwoord
- [ ] Onder 60 tekens
- [ ] Overtuigend — heeft een krachtig woord (Beste, Compleet, Ultiem, Gids, enz.)
- [ ] Dupliceert geen andere titel op de site

METABESCHRIJVING:
- [ ] 150-160 tekens
- [ ] Bevat primair zoekwoord
- [ ] Heeft een duidelijke waardepropositie of hook
- [ ] Eindigt met een zachte CTA of open lus

URL-SLUG:
- [ ] Kort (2-4 woorden)
- [ ] Bevat primair zoekwoord
- [ ] Volledig kleine letters, afgestreept, geen stopwoorden

H1:
- [ ] Bevat primair zoekwoord
- [ ] Andere formulering dan de titelmarkering (OK om te variëren)
- [ ] Slechts één H1

H2's en H3's:
- [ ] 3-8 H2's (contentroadmap voor de lezer)
- [ ] Primair zoekwoord in ten minste één H2
- [ ] Secundaire zoekwoorden en vragen in H2/H3's
- [ ] Geen zoekwoordvulling — koppen moeten beschrijvend zijn

BODYCONTENT:
- [ ] Primair zoekwoord in eerste paragraaf
- [ ] Zoekwoorddichtheid 0,5-1,5% (natuurlijk, niet geforceerd)
- [ ] Semantische en LSI-zoekwoorden verspreid door de tekst
- [ ] Ten minste één tabel, lijst of gestructureerd element (snippet-doel)
- [ ] Elke afbeelding heeft alt-tekst (beschrijvend, zoekwoord waar natuurlijk)

INTERNE LINKS:
- [ ] 3-5 links naar bestaande content op de site
- [ ] Linktekst is beschrijvend (niet "klik hier")
- [ ] Ten minste één link van een bestaande hoog-autoriteit pagina naar dit stuk

EXTERNE LINKS:
- [ ] Link naar 2-4 gezaghebbende bronnen (statistieken, onderzoek, tools)
- [ ] Stel externe links in op rel="noopener" (niet nofollow tenzij betaald/UGC)

SCHEMA-OPMAAK:
- [ ] Artikel-schema (altijd)
- [ ] FAQ-schema als je een Q&A-sectie hebt
- [ ] HowTo-schema als het een tutorial/stapsgewijze uitleg is
```

### Targeting van featured snippets

```
Optimaliseer deze content om de featured snippet te veroveren voor: [ZOEKWOORD]

Huidige snippet-houder (indien aanwezig): [URL en snippet-tekst]

Featured snippet-formaten per zoekwoordtype:
- "Hoe [taak]" → Genummerde stap-voor-stap lijst met een H2 die de exacte vraag is
- "Wat is [term]" → 2-3 zinnen definitieparagraaf onder een H2 die de vraag weerspiegelt
- "Beste [tools/opties]" → Tabel met naam/functie/prijs kolommen, of geordende lijst
- "[Term] vs [Term]" → Vergelijkingstabel, dan proza-uitleg

Instructies voor snippet-targeting structuur:
1. Gebruik de exacte vraag als H2-kop
2. Beantwoord het direct en volledig in de eerste 40-60 woorden onder die kop
3. Voor lijstsnippets: gebruik <ol> of <ul> direct na de kop
4. Voor tabelsnippets: gebruik een juiste HTML-tabel met headers
5. Breid dan uit met detailparagrafen (Claude leest voorbij de snippet)
6. Begraaf het antwoord NIET — zet het eerst, leg daarna uit

Schrijf de geoptimaliseerde H2-kop en openingssectie:
```

### Briefsjabloon (kopiëren-plakken voor schrijvers)

```markdown
# Contentbrief: [TITEL]

**Primair zoekwoord:** [zoekwoord] | Volume: [X/maand] | Moeilijkheidsgraad: [X/100]
**Secundaire zoekwoorden:** [lijst]
**Beoogd aantal woorden:** [X woorden]
**Beoogde publicatiedatum:** [datum]
**Schrijver:** [naam]
**Redactiedeadline:** [datum]

## Doelgroep
[Functietitel], [bedrijfsgrootte], [specifiek probleem dat ze oplossen met deze zoekopdracht].
Ze bevinden zich in [bewustzijnsfase: probleem-bewust / oplossing-bewust / product-bewust].

## Zoekintentie
[Wat wil de lezer bereiken door dit zoekwoord te zoeken? Welk formaat verwachten ze?]

## Aanbevolen invalshoek
[Één zin — waarom ons stuk beter zal zijn dan de huidige top 3 resultaten]

## Outline

### Introductie (~150 woorden)
Hook met: [statistiek / vraag / gedurfde claim]
Vestig probleem: [waar de lezer mee worstelt]
Beloof resultaat: [wat ze aan het einde zullen weten]

### H2: [Sectie 1 titel] (~300 woorden)
[Kernpunten die de schrijver moet behandelen]
[Formaat: paragraaf/lijst/tabel]
[Schrijversnotitie: specifieke instructie]

### H2: [Sectie 2 titel] (~400 woorden)
...

### Conclusie (~200 woorden)
Samenvatting: [3 kernpunten]
CTA: [specifieke actie]
Gerelateerd: [2 interne links]

## SEO-vereisten
- [ ] Primair zoekwoord in eerste 100 woorden
- [ ] H2 die een "People Also Ask"-vraag is
- [ ] Één tabel of genummerde lijst (snippet-doel)
- [ ] 4+ interne links
- [ ] Alle afbeeldingen met beschrijvende alt-tekst

## Meta
**Titelmarkering:** [max 60 tekens] [CONCEPT]
**Metabeschrijving:** [max 155 tekens] [CONCEPT]
**URL-slug:** /[slug]

## Plan voor interne links
Vanuit dit stuk linken naar:
- [URL 1] — ankertekst: [tekst]
- [URL 2] — ankertekst: [tekst]

Naar dit stuk linken vanuit:
- [URL 1] — die pagina bijwerken om hier een link toe te voegen
- [URL 2] — contextuele link toevoegen
```

## Voorbeeld

**Gebruiker:** Schrijf een contentbrief voor "content marketing strategy" gericht op B2B-marketingmanagers.

**Uitvoer:**
```markdown
# Contentbrief: De B2B Content Marketing Strategy Gids (2026)

**Primair zoekwoord:** content marketing strategy | Volume: ~18.000/maand | Moeilijkheidsgraad: 68/100
**Secundaire zoekwoorden:** b2b content strategy, content marketing framework, content strategy template, how to build a content strategy
**Beoogd aantal woorden:** 3.800 woorden (concurrenten gemiddeld 3.100 — ga dieper in op kaders en sjablonen)
**Zoekintentie:** Informatief — lezer wil een stap-voor-stap proces volgen, met sjablonen om aan te passen

## Doelgroep
B2B Marketing Manager bij een SaaS- of dienstverlenersbedrijf van 50-500 personen. Heeft net eigenaarschap van content overgenomen. Moet binnen 30 dagen een strategie presenteren aan hun VP Marketing. Zoekt op het werk, op desktop, tijdens een planningscyclus.

## Aanbevolen invalshoek
De meeste gidsen sommen tactieken op. Deze gids bouwt een echt strategiekader in een stapsgewijze volgorde met een downloadbaar sjabloon — de lezer eindigt met een compleet 90-dagenplan, niet alleen inspiratie.

## Outline

### Introductie (~200 woorden)
Hook: "De meeste contentstrategieën mislukken in de eerste 90 dagen — niet omdat het schrijven slecht is, maar omdat er nooit een echte strategie was."
Probleem: Teams produceren content zonder doelgroeponderzoek, zoekwoordmapping of distributieplannen.
Belofte: "Aan het einde van deze gids heb je een 90-dagenstrategie die je deze week kunt presenteren."

### H2: Wat een B2B Content Marketing Strategie Eigenlijk Is (~300 woorden)
[Featured snippet-doel — beantwoord de "wat is" in 50 woorden eerst]
Definieer: strategie vs. tactieken vs. kalender
De 5 componenten van een echte strategie: doelgroep, doelen, kanaalsamenstelling, productiesysteem, meting

### H2: Stap 1 — Definieer je Contentdoelen (~400 woorden)
Vertaaltabel bedrijfsdoelen → contentdoelen
Verkeer, leads, pipeline, merk: welke metrics welk doel mappen
Schrijversnotitie: Voeg een echt B2B-voorbeeld toe dat toont hoe een SaaS-bedrijf content-KPI's heeft gesteld

### H2: Stap 2 — Doelgroep- en Zoekwoordonderzoek (~500 woorden)
ICP → zoekwoordintentiemapping
Tools: Ahrefs, Semrush, Answer the Public, interne verkoopgespreknotities
Schrijversnotitie: Toon het zoekwoordonderzoeksproces als een stap-voor-stap lijst (snippet-doel)

### H2: Stap 3 — Bouw je Onderwerpenclusters (~400 woorden)
Pijler/spaakmodel met diagrambeschrijving
Hoe pijlers te kiezen op basis van bedrijfsdoelen, niet alleen volume
Interne link: [/editorial-calendar blogpost]

### H2: Stap 4 — Kies je Contentmix (~400 woorden)
Contenttype-mixtabel: [Type | % | Wanneer te gebruiken | Voorbeeld]
Mix vroeg stadium vs. volwassen bedrijf verschilt — toon beide

### H2: Stap 5 — Bouw een Productiesysteem (~400 woorden)
Brief → concept → bewerken → publiceren → distribueren workflow
Rollen: wie doet wat (zelfs als het één persoon is)
Tools: Notion, Airtable, of een eenvoudig Google Sheets-sjabloon

### H2: Stap 6 — Meten en Itereren (~400 woorden)
Metrics per doel (verkeer / leads / merk)
Maandelijks contentreviewsjabloon
Hoe "succes" eruitziet op 30/60/90 dagen

### Conclusie (~200 woorden)
Kernpunten: 3 dingen om deze week te doen
CTA: Download het 90-dagen contentstrategie-sjabloon
Gerelateerd: Link naar /seo-audit, /editorial-calendar

## Meta
**Titelmarkering:** B2B Content Marketing Strategie: De 2026 Stap-voor-Stap Gids
**Metabeschrijving:** Bouw een B2B-contentstrategie die echte pipeline drijft. 6-staps kader, sjablonen en een 90-dagenplan dat je deze week kunt presenteren.
**URL-slug:** /content-marketing-strategy
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
