---
name: programmatic-seo
description: "Programmatische SEO: bouw landingpage-sjablonen op schaal, identificeer gegevensbronnen, ontwerp URL-structuren, vermijd dunne content-straffen"
---

# Programmatische SEO Skill

## Wanneer inschakelen
- Honderden of duizenden locatie-/categorie-/vergelijkingspagina's maken
- Opbouw van een database-aangedreven contentstrategie (bijv. "[Stad] + [Service]"-pagina's)
- Content-productie schalen met sjablonen en gegevensfeeds
- Bestaande programmatische SEO-pagina's controleren op kwaliteitsproblemen
- Een programmatische SEO-strategie plannen voor implementatie

## Wanneer niet gebruiken
- Sites met minder dan 100 mogelijke pagina's — handmatige SEO is beter
- Als je geen echte gegevensbron hebt — zuiver sjabloonspam wordt bestraft
- Als de gebruiksintentie te nauw is voor schaling

## Instructies

### Identificeer programmatische SEO-kansen

```
Identificeer programmatische SEO-kansen voor mijn bedrijf.

Bedrijfstype: [beschrijf]
Huidige site: [URL of beschrijving]
Producten/services: [lijst]

Veelvoorkomende programmatische patronen:
1. Locatiepagina's: "[Service] in [Stad]" — werkt voor lokale bedrijven, marktplaatsen, B2B
2. Categorie × modifier: "[Categorie] voor [Publiek/Use Case]"
3. Vergelijkingspagina's: "[Tool A] vs [Tool B]" — werkt voor SaaS, tools
4. Integratiepagina's: "[Product] + [Integratie]" — Zapier-stijl
5. Sjabloonpagina's: "[Rol] cv-sjabloon", "[Industrie] factuursjabloon"
6. Gegevenspagina's: "[Stad] [Metriek] statistieken", "[Jaar] [Industrie] rapport"

Welke patronen gelden voor mijn bedrijf?
Schatting: hoeveel pagina's zou dit kunnen genereren?
Welke gegevensbron zou elk aansturen?
```

### Ontwerp de sjabloonstructuur

```
Ontwerp een programmatische SEO-sjabloon voor [paginatype].

Voorbeeld-URL: /[stad]/[service] (bijv. /amsterdam/webdesign)
Doelzoeking: "[Service] in [Stad]"
Gegevens die ik heb: [velden opsommen — stadsnaam, bevolking, lokale statistieken, etc.]

Sjabloongedeelten:
1. H1: [formule — bijv. "Webdesign in {{stad}}"]
2. Inleidingsalinea (uniek per stad — wat varieert?)
3. Kernwaardepropositie (statisch — identiek op alle pagina's)
4. Lokale differentiatie (wat maakt de stad/categorie uniek?)
5. Getuigenissen/case studies (filter op locatie indien beschikbaar)
6. Veelgestelde vragen (mix van statische vragen + dynamische stadsspecifieke)
7. CTA

Uniciteit-strategie: wat verschilt tussen pagina's om dunne content te vermeiden?
Minimale content-drempel: hoeveel werkelijk unieke woorden per pagina?
```

### Gegevensarchitectuur-planning

```
Plan de gegevensarchitectuur voor programmatische SEO.

Paginatype: [beschrijf]
Schaal: [X] geplande pagina's

Te overwegen gegevensbronnen:
- Interne gegevens (je productgegevens, klantgegevens, transacties)
- Openbare datasets (Census, Wikipedia, overheidsgegevens)
- API-bronnen (Google Places, Yelp, Weer, etc.)
- Gescraped/geaggregeerde gegevens (mappenlijsten, jobborden)
- Door gebruiker gegenereerde inhoud (reviews, Q&A)

Voor mijn use case:
1. Welke gegevens maken elke pagina werkelijk uniek?
2. Waar krijg ik deze gegevens?
3. Hoe houd ik het actueel? (statische vs dynamische generatie)
4. Wat zijn de minimale gegevens per pagina om dunne content te vermijden?

Resultaat: gegevensarchitectuurplan met velden per paginasjabloon.
```

### Dunne content audit

```
Controleer deze programmatische pagina's op dunne content-risico.

Voorbeeldpagina's: [3-5 URL's plakken of sjabloon beschrijven]
Waargenomen probleem: [laag traffic, handmatige actie, slechte rankings]

Controleer:
1. Unieke content-verhouding: welk % van elke pagina is uniek vs. sjabloon?
2. Gebruikerswaarde: beantwoordt deze pagina de zoekvraag beter dan Google-zoekopdracht?
3. Duplicatie: lijken pagina's te veel op elkaar?
4. Auto-gegenereerde signalen: ziet het eruit alsof het voor zoekmachines is geschreven, niet voor mensen?
5. Engagement-gegevens: bounce rate, tijd op pagina (indien beschikbaar)

Aanbevelingen: consolideer / verbeter / verwijder / noindex.
```

### URL en site-architectuur

```
Ontwerp URL-structuur en interne links voor programmatische SEO op schaal.

Paginatype: [locatie-/categorie-/vergelijkingspagina's]
Schaal: [X] pagina's

URL-structuuropties:
- Plat: /[stad]-[service] (eenvoudig, verliest categoriehiërarchie)
- Genest: /[service]/[stad] (beter voor gefacetteerde hiërarchie)
- Hybride: /[categorie]/[modifier]-[locatie]

Interne linkingstrategie:
1. Hub-pagina's: categorie-level pagina's die naar alle locatievarianten verlinken
2. Breadcrumbs: toon hiërarchie voor gebruiker en crawlers
3. Gerelateerde pagina's: zelfde stad, andere services / zelfde service, nabijgelegen steden
4. Paginering vs. oneindig scrollen vs. "meer laden"
5. XML-sitemap-segmentatie (apart sitemap voor programmatische pagina's)

Ontwerp de architectuur voor [X] pagina's.
```

## Voorbeeld

**Gebruiker:** Ik beheer een freelancer-marktplaats. Ik wil "[Vaardigheid] freelancers in [Stad]"-pagina's bouwen. Ik heb 50 vaardigheden en 200 steden = 10.000 pagina's. Hoe doe ik dit zonder gestraft te worden?

**Claudes plan:**

**Gegevensuniciteitstrategie:**
- Stadsbevolking + opmerkelijke industrieën (Census + Wikipedia API)
- Gemiddelde tarieven voor de vaardigheid in die stad (van je eigen marktplaatsgegevens)
- Aantal geverifieerde freelancers op je platform in die stad/vaardigheid-combinatie
- Uitgelichte freelancers (dynamisch, uit je DB)
- Recent voltooide projecten in die stad (uit je transactiegegevens)

**Dunne content-drempel:** Elke pagina heeft ≥ 3 werkelijk unieke gegevenspunten nodig (tariefsgegevens + freelancer-aantal + uitgelichte profielen). Pagina's met < 3 freelancers moeten noindexed worden tot ingevuld.

**Lancerringsvolgorde:** Begin met de top 20 steden × alle 50 vaardigheden (1.000 pagina's). Valideer indexering en prestaties voordat je naar alle 200 steden uitbreidt.

**H1-sjabloon:** "Zoek [Vaardigheid] Freelancers in [Stad] — [X] Geverifieerde Professionals"

---
