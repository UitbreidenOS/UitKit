---
name: schema-markup
description: "Schema.org gestructureerde gegevens: genereer JSON-LD voor rijke resultaten, valideer markup, kies het juiste schematype, implementeer over gemeenschappelijke paginatypen"
---

# Schema-markering Skill

## Wanneer inschakelen
- Gestructureerde gegevens toevoegen om rijke resultaten in Google Search te verbeteren
- JSON-LD genereren voor artikelen, producten, FAQ's, how-to's, reviews, lokale bedrijven
- Schema-markup valideren voor implementatie
- Het juiste schematype voor een pagina kiezen
- Debuggen waarom rijke resultaten niet verschijnen

## Wanneer niet gebruiken
- Schema alleen zal je niet ranken — het verbetert bestaande goede inhoud
- Nep-reviews of misleidende gegevens — Google zal bestraffen
- Voor elke pagina op je site — prioriteer eerst pagina's met hoge waarde

## Instructies

### Kies het juiste schematype

```
Welke schemamarkering moet ik voor deze pagina gebruiken?

Paginatype/inhoud: [beschrijf wat de pagina bevat]
Doel: [rijke snippets / kennispaneel / lokaal pakket / spraakzoekopdracht]

Veelvoorkomende schematypes:
- Article / BlogPosting: nieuws, blogposts, redactionele inhoud
- Product: e-commerce productpagina's met prijs, beschikbaarheid, reviews
- LocalBusiness: fysieke locaties (bevat openingstijden, adres)
- FAQPage: pagina's met Q&A-secties (verschijnt als uitbreidbaar in SERPs)
- HowTo: stap-voor-stap instructies
- Recipe: kookinhoud met ingrediënten, stappen, voeding
- Event: conferenties, concerten, webinars
- JobPosting: vacatures
- Course: online leerinhoud
- SoftwareApplication: apps en softwaretools
- Review / AggregateRating: gebruikers- of expertreviews
- BreadcrumbList: navigatiehiërarchie van site
- Organization: bedrijfsinformatie, socialeprofielprofielen
- Person: auteur, spreker, beroepsprofielen

Welke typen gelden? Kunnen meerdere typen gecombineerd worden?
```

### Genereer JSON-LD (plak-klaar)

**Artikel / Blogpost:**
```
Genereer Article-schema voor:
Titel: [titel]
Auteur: [naam, URL]
Gepubliceerd: [datum]
Gewijzigd: [datum]
Afbeelding: [URL]
Uitgever: [bedrijfsnaam, logo-URL]
URL: [pagina-URL]
Beschrijving: [meta-beschrijving]
```

**LocalBusiness:**
```
Genereer LocalBusiness-schema voor:
Bedrijfsnaam: [naam]
Type: [Restaurant / MedicalClinic / LegalService / Store / etc.]
Adres: [volledig adres]
Telefoon: [nummer]
Website: [URL]
Uren: [maa-vrij 9-17, zat 10-15, etc.]
Prijsbereik: [$ / $$ / $$$]
Breedtegraad/Lengtegraad: [indien bekend]
```

**FAQPage:**
```
Genereer FAQPage-schema voor deze Q&A's:
V1: [vraag]
A1: [antwoord]
V2: [vraag]
A2: [antwoord]
[toevoegen naar wens — 5-10 is ideaal]
Pagina-URL: [URL]
```

**Product:**
```
Genereer Product-schema voor:
Naam: [productnaam]
Beschrijving: [beschrijving]
Afbeelding: [URL]
Merk: [merknaam]
SKU: [SKU indien beschikbaar]
Prijs: [bedrag]
Valuta: [USD/GBP/EUR]
Beschikbaarheid: InStock / OutOfStock / PreOrder
Rating: [gemiddelde score] van [aantal] reviews
```

**HowTo:**
```
Genereer HowTo-schema voor deze tutorial:
Titel: [how-to titel]
Beschrijving: [wat dit onderwijst]
Totale tijd: [PT30M = 30 minuten]
Stappen:
1. [stapnaam] — [stapdescriptie]
2. [stapnaam] — [stapdescriptie]
[doorgaan voor alle stappen]
```

### Valideer en debug

```
Valideer deze schemamarkering:

[plak JSON-LD-code]

Controleer:
1. Geldige JSON-syntaxis?
2. Vereiste velden aanwezig voor dit schematype?
3. Aanbevolen velden ontbreken (die rijke resultaten zouden inschakelen)?
4. Verouderde eigenschappen?
5. Test-URL: https://search.google.com/test/rich-results

Ook controleren: is dit schematype geschikt voor rijke resultaten?
(Niet alle schematypes genereren visuele verbeteringen — sommige helpen alleen begrijpen)
```

### Implementatie over paginatypen

```
Maak een implementatieplan voor schemamarkering voor mijn site.

Sitetype: [blog / e-commerce / lokaal bedrijf / SaaS / marktplaats]
Hoofpaginatypen: [lijst: homepage, productpagina's, blogposts, categoriepagina's, etc.]

Voor elk paginatype:
1. Aanbevolen schematype(s)
2. Op te nemen gegevensvelden
3. Welke velden zijn dynamisch (CMS/DB) vs. statisch
4. Prioriteit: [hoog — rijke resultaten geschikt / gemiddeld / laag]
5. Implementatiemethode: [HTML-kop / CMS-plugin / via GTM / server-rendered]

Resultaat: naar prioriteit georderde implementatie-checklist.
```

## Voorbeeld

**Gebruiker:** Ik heb een SaaS-reviewblog. Elke post beoordeelt een tool. Ik wil rijke snippets in Google.

**Claude genereert:**

Voor een review-post, `SoftwareApplication` + `Review` combineren:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Notion",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web, iOS, Android, macOS, Windows",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "1",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Your Name" },
    "datePublished": "2026-05-20",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.6",
      "bestRating": "5"
    },
    "reviewBody": "First sentence of your review summary..."
  }
}
```

Geschiktheid rijke resultaten: ✅ Product-rijke snippets (sterrencijfers in SERPs)

---
