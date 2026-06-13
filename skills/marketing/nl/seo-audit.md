---
name: seo-audit
description: "SEO-audit: technische problemen, on-page factoren, backlink-profiel, Core Web Vitals, gestructureerde gegevens, geprioriteerde oplossingenlijst met geschat traffic-effect"
---

# SEO-Audit Skill

## Wanneer inschakelen
- Een uitgebreid SEO-audit op een website uitvoeren
- Onderzoeken waarom organisch traffic is gedaald
- Technische SEO-problemen identificeren die crawlen of indexering blokkeren
- SEO-strategie van een concurrent controleren
- SEO-fixes prioriteren op basis van geschat traffic-effect

## Wanneer niet gebruiken
- Real-time rankingtracking — gebruik Ahrefs, SEMrush of Google Search Console
- Link building-uitvoering — vereist outreach-tools
- Betaalde zoekopdrachten (Google Ads) — volledig ander kanaal

## Instructies

### Technisch SEO-audit

```
Voer een technisch SEO-audit uit. Lever:

Website-URL: [URL]
Beschikbare tools: [Google Search Console / Screaming Frog / Ahrefs / SEMrush / PageSpeed Insights]

Controleer deze technische factoren:

CRAWLEN & INDEXERING
- Is de website indexeerbaar? Controleer robots.txt en meta robots-tags
- Zijn er noindex-tags die belangrijke pagina's blokkeren?
- XML-sitemap: aanwezig, ingediend bij GSC, fouten?
- Crawlfouten in Google Search Console?
- Canonicale tags: correct, geen self-referencing-problemen?

TECHNISCHE PRESTATIES
- Core Web Vitals (LCP, FID/INP, CLS): geslaagd/niet geslaagd?
- Paginasnelheid: mobiele en desktopscores (PageSpeed Insights)
- Mobiel-vriendelijk: behaalt Googles mobiele gebruikstest?
- HTTPS: alle pagina's, geen gemengde inhoud?

SITESTRUCTUUR
- URL-structuur: schoon, beschrijvend, geen dubbele parameters?
- Interne links: weesspagina's? Diepe pagina's (> 3 klikken vanaf startpagina)?
- Paginering: rel prev/next of gebruik van canonical?
- Site-architectuur: logische categorieën, passende breadcrumbs?

Voor elk gevonden probleem:
- Ernst: Kritiek / Hoog / Gemiddeld / Laag
- Geschat traffic-effect
- Fix-aanbeveling
- Implementatiepoging: Eenvoudig / Gemiddeld / Moeilijk
```

### On-page SEO-audit

```
Controleer on-page SEO voor [URL of paginatype]:

INHOUD
- Title-tags: uniek, onder 60 tekens, bevat primair trefwoord?
- Meta-beschrijvingen: overtuigend, onder 160 tekens, uniek?
- H1: één per pagina, bevat trefwoord?
- Headerstructuur: logische H1→H2→H3-hiërarchie?
- Inhoudsdiepte: behandelt het onderwerp uitgebreid vs. topgerangschikte pagina's?
- Trefwoordgebruik: natuurlijk, geen vulling, LSI-termen opgenomen?
- Content-versheid: updatedatum, verouderde inhoud?

MEDIA
- Afbeeldingen: alt-tekst aanwezig, beschrijvend, niet met trefwoorden volgestopt?
- Afbeeldingsbestandsgroottes: gecomprimeerd voor prestaties?
- Video's: transcripties, schemamarkering?

GESTRUCTUREERDE GEGEVENS
- Schemamarkering aanwezig? (Article, Product, FAQ, How-to, Review, LocalBusiness)
- Geldig volgens Googles Rich Results Test?
- Ontbrekende schemamogelijkheden?

Lever een geprioriteerde oplossingenlijst.
```

### Concurrentie-SEO-analyse

```
Analyseer [concurrent-URL] versus mijn site [mijn URL]:

TREFWOORD-GAP
- Voor welke trefwoorden ranken zij en ik niet?
- Wat is hun geschat organisch traffic?
- Welke van hun toppagina's genereren het meeste traffic?

INHOUD-GAP
- Welke inhoud hebben zij die ik niet heb?
- Welke onderwerpen in ons veld beheersen zij?

BACKLINK-GAP
- Domain Authority-vergelijking
- Hoeveel verwijzende domeinen hebben zij versus ik?
- Hun beste backlink-bronnen (voor outreach-onderzoek)

Prioriteer: Welke gaps kan ik in de komende 90 dagen het meest haalbaar sluiten?
```

### Core Web Vitals fix-prioriteiten

```
Mijn Core Web Vitals-scores:
- LCP (Largest Contentful Paint): [Xs] — doel < 2,5s
- INP (Interaction to Next Paint): [Xms] — doel < 200ms
- CLS (Cumulative Layout Shift): [X] — doel < 0,1

Website-technologie: [Next.js / WordPress / Shopify / ander]

Voor elke faalde metric:
1. Wat is de meest waarschijnlijke oorzaak op mijn tech-stack?
2. Wat zijn de top 3 fixes om eerst te implementeren?
3. Geschat verbeteringspotentieel van elke fix?
```

### SEO-auditrapport

```
Genereer een SEO-auditoverzicht voor [site].

Auditbevindingen: [geplakte sleutelproblèmen gevonden]

Formaat:
1. Algehele SEO-gezondheidsscore (1-10) met motivering
2. Kritieke problemen (moeten worden opgelost — blokkeren traffic of indexering)
3. Hoog-prioritaire kansen (grootste geschatte traffic-winsten)
4. Quick wins (gemakkelijk te implementeren, onmiddellijke impact)
5. 90-daagse SEO-routekaart met prioriteiten
```

## Voorbeeld

**Gebruiker:** Het traffic van mijn blog is na Googles maart 2026 core update met 40% gedaald. Voer een audit uit.

**Claudes auditframework:**
1. Google Search Console controleren op handmatige acties of dekkingsproblemen
2. Bepaal welke pagina's rangen hebben verloren (positieveranderingenrapport)
3. Controleer of verlorenpagina's dunne inhoud, zwakke E-E-A-T-signalen of gedupliceerde inhoud hebben
4. Analyseer top-performende pagina's die hebben overleefd — wat hebben ze dat verloren pagina's niet hebben?
5. Site-breed beoordelen: te veel geoptimaliseerde ankertekst? Dunne affiliate-inhoud? AI-gegenereerde inhoud zonder menselijke expertisesignalen?
6. Genereer geprioriteerde oplossingenlijst met geschat hersteltijdlijn per fix-categorie

---
