---
name: doc-site-builder
description: "Documentatiesitearchitectuur: informatiehierarchie, navigatiestructuur, inhoudssjablonen, zoekstrategie"
---

# Doc Site Builder Vaardigheid

## Wanneer activeren
- Een nieuwe documentatiesite van begin af aan starten en behoefte aan een informatiearchitectuur
- Documentatie migreren van een wiki (Notion, Confluence) of README-bestanden naar een speciale documentatiesite
- Een bestaande documentatiesite is zijn structuur ontgroeid en heeft een herontwerp van de IA nodig
- Inhoudssjablonen definiëren zodat meerdere bijdragers consistente pagina's produceren
- Een docs-as-code workflow plannen waarbij engineers en schrijvers samenwerken in dezelfde repository

## Wanneer NIET gebruiken
- Individuele documentatiepagina's schrijven — gebruik `/api-doc-writer` of `/readme-generator` voor specifieke inhoud
- Een documentatieplatform kiezen (Docusaurus versus MkDocs versus Mintlify versus GitBook) — deze vaardigheid behandelt architectuur, niet platformselectie; neem die beslissing eerst
- Bestaande documentatiekwaliteit controleren — dit is een structurele en architecturale vaardigheid, geen audiettool
- De technische bouwpijplijn instellen — deze vaardigheid produceert de architectuur; implementatie is een engineering-taak

## Instructies

### Volledige documentatiesitearchitectuur

```
Ontwerp de informatiearchitectuur voor een documentatiesite.

## Context
Product: [naam en beschrijving in 1 zin]
Doelgroep: [wie deze documentatie leest — eindgebruikers / ontwikkelaars / beheerders / alle drie]
Benodigde documentatietypes: [aan de slag / API-referentie / handleidingen / conceptuele gidsen / release-opmerkingen / probleemoplossing / alles]
Huidige staat: [nieuw van begin af aan / migreren van [bron] / herstructureren van bestaande site]
Inhoudsomvang: [geschat aantal pagina's — grove schatting is goed]
Team: [wie schrijft: [N] technische schrijvers / engineers schrijven zelf / gemengd]
Gekozen platform: [Docusaurus / MkDocs / Mintlify / GitBook / Notion / aangepast / nog niet gekozen]

## Produceer:

### 1. Overzicht informatiearchitectuur
Navigatiestructuur op het hoogste niveau met motivering voor elke sectie:

```
/ (Startpagina)
├── Aan de slag/
│   ├── Inleiding
│   ├── Snelstart
│   └── Installatie
├── Gidsen/
│   ├── [Onderwerp 1]
│   └── [Onderwerp 2]
├── Referentie/
│   ├── API-referentie
│   ├── Configuratie
│   └── CLI-referentie
├── Concepten/
│   └── [Uitleg van kernconcepten]
└── Changelog/
```

Voor elke sectie op het hoogste niveau: leg de gebruikersbedoeling uit die het dient en de inhoud die het bevat.

### 2. Inhoudsclassificatie
Definieer de vier Diátaxis-inhoudstypen voor dit product:

**Tutorials** (leergeoriënteerd, begeleide ervaring):
- Wanneer een tutorial te schrijven versus een handleiding
- Sjabloon voor tutorials in deze productcontext
- Voorbeeldtitels van tutorials voor dit product

**Handleidingen** (taakgeoriënteerd, probleemoplossing):
- Wanneer een handleiding te schrijven versus een tutorial
- Sjabloon voor handleidingen
- Voorbeeldtitels van handleidingen voor dit product

**Referentie** (informatiegeoriënteerd, opzoeken):
- Wat in referentie hoort (API-endpoints, configuratiesleutels, CLI-vlaggen, datamodellen)
- Sjabloon voor referentiepagina's
- Hoe referentie automatisch wordt gegenereerd versus handmatig geschreven voor dit product

**Uitleg / Conceptueel** (begripsgeoriënteerd):
- Welke concepten uitlegdocumentatie nodig hebben voor dit product
- Sjabloon voor conceptpagina's
- Voorbeeldconceptonderwerpen voor dit product

### 3. Paginasjablonen
Geef invul-in-de-lege-velden sjablonen voor:

**Aan de slag / Snelstart sjabloon:**
```markdown
# Aan de slag met [Product]

## Wat u gaat bouwen
[1-2 zinnen — het resultaat dat de lezer bereikt]

## Vereisten
- [vereiste 1]
- [vereiste 2]

## Stap 1: [Eerste actie]
[instructie]

```[taal]
[codevoorbeeld]
```

Verwachte uitvoer:
```
[wat ze zien wanneer het werkt]
```

## Stap 2: [Volgende actie]
[instructie]

## Wat er zojuist is gebeurd
[Korte uitleg van wat de snelstartcode doet — bouwt mentaal model]

## Volgende stappen
- [Link naar volgende tutorial]
- [Link naar relevante handleiding]
- [Link naar referentie]
```

**Handleiding sjabloon:**
```markdown
# Hoe [specifieke taak te volbrengen]

[Één zin: voor wie dit is en wat het bereikt]

## Vereisten
- [Wat ze nodig hebben voor ze beginnen]

## Stappen

### 1. [Eerste stap]
[instructie — gebiedende wijs, tweede persoon]

```[taal]
[code]
```

### 2. [Tweede stap]
[instructie]

## Probleemoplossing
**[Veelvoorkomend probleem]:** [Oplossing]
**[Veelvoorkomende foutmelding]:** [Wat het betekent en hoe het op te lossen]

## Gerelateerd
- [Handleiding die vaak samen met deze wordt gebruikt]
- [Referentiepagina voor de hoofdconfiguratie/API die hier wordt gebruikt]
```

**Referentiepagina sjabloon:**
```markdown
# [Configuratiesleutel / API-endpoint / CLI-opdrachtnaam]

[Één zin die beschrijft wat dit doet]

## Syntaxis / Handtekening
```
[exacte syntaxis]
```

## Parameters / Opties
| Parameter | Type | Vereist | Standaard | Beschrijving |
|---|---|---|---|---|
| `naam` | string | Ja | — | [wat het doet] |
| `timeout` | number | Nee | 30 | [wat het doet] |

## Voorbeeld
```[taal]
[minimaal werkend voorbeeld]
```

## Opmerkingen
[Randgevallen, valkuilen, versiebeperkingen]

## Zie ook
[Gerelateerde referentie-items]
```

### 4. Navigatieontwerp regels
Principes voor de navigatie van deze documentatiesite:

- Maximale diepte: [2 / 3 niveaus — kies één; dieper is bijna altijd slechter]
- Zijbalk: [altijd zichtbaar / samengevouwen op mobiel / sectiegebonden]
- Broodkruimels: [ja / nee — ja voor diepe hiërarchieën]
- Paginalengte: [aanbevolen maximale lengte en wanneer op te splitsen in subpagina's]
- Versiebeheer: [moet de site documentatie versies bijhouden? Strategie hiervoor]

### 5. Zoekstrategie
- Zoektool: [Algolia DocSearch / ingebouwde volledige tekst / pagefind / geen]
- Zoekooptimalisatie: welke metadata toe te voegen aan elke pagina (titel, beschrijving, tags)
- Facetten / filteren: moet de doelgroep kunnen filteren op rol, productlaag of versie?

### 6. Bijdragerworkflow
Hoe engineers en schrijvers samenwerken:

- Bestandsnaamconventie: [kebab-case.md / onderwerp/subonderwerp.md]
- PR-beoordelingsproces: [schrijver beoordeelt alle PR's die documentatie raken / engineer samenvoegen met beoordeling van schrijver]
- Versheidsignaal: last_updated frontmatter op elke pagina
- Gebroken link controleren: [CI-stap — gebruik welke tool]
- Locatie stijlgids: [link of insluiten]

### 7. Lanceerchecklist
- [ ] Startpagina heeft duidelijke paden naar de 3 meest voorkomende gebruikersbedoelingen
- [ ] Elke pagina heeft een titel, beschrijving en last_updated
- [ ] Alle codevoorbeelden zijn getest en uitvoerbaar
- [ ] Zoeken is geconfigureerd en geïndexeerd
- [ ] 404-pagina heeft nuttige navigatie terug naar inhoud
- [ ] Analytics geconfigureerd (paginaweergaven, zoekopdrachten, 404's)
- [ ] Feedbackwidget op elke pagina ("Was dit nuttig?")
- [ ] Gebroken linkcontrole geslaagd in CI
```

### Diátaxis inhoudsclassificatie

```
Classificeer deze inhoud op Diátaxis-type en vertel me wat er ontbreekt.

Ik heb de volgende documentatiepagina's (geef titels en een beschrijving van 1 regel):
[geef uw bestaande pagina's op]

Voor elke pagina:
1. Classificeer als: Tutorial / Handleiding / Referentie / Uitleg / Onduidelijk / Gemengd (markeer gemengd als een probleem)
2. Markeer pagina's die "gemengd" type zijn — die moeten worden opgesplitst
3. Identificeer welke Diátaxis-kwadranten inhoudslacunes hebben voor dit product

Analyse van lacunes uitvoer:
| Diátaxis-type | Dekking | Ontbrekende onderwerpen |
|---|---|---|
| Tutorial | Goed / Dun / Geen | [wat er ontbreekt] |
| Handleiding | Goed / Dun / Geen | [wat er ontbreekt] |
| Referentie | Goed / Dun / Geen | [wat er ontbreekt] |
| Uitleg | Goed / Dun / Geen | [wat er ontbreekt] |

Aanbevolen prioriteit: [welk type eerst meer van te schrijven, en waarom]
```

### Interpretatie van documentatiesite-analytics

```
Interpreteer documentatiesite-analytics en breng inhoudsproblemen aan het licht.

Analyticsbron: [Google Analytics / Plausible / Posthog / aangepast]

Beschikbare gegevens:
- Top 10 pagina's op paginaweergaven: [plak]
- Top 10 zoekopdrachten: [plak]
- Pagina's met hoogste uitstappercentage: [plak]
- 404-fouten (top gebroken paden): [plak]

Analyseer:
1. ZOEKOPDRACHTEN DIE NIETS VINDEN: zoekopdrachten in het zoeklogboek met 0 resultaten = inhoudslacune. Geef ze op.
2. PAGINA'S MET HOOG UITSTAPPERCENTAGE: pagina's met een zeer hoog uitstappercentage lukken er mogelijk niet in de vraag van de gebruiker te beantwoorden. Diagnosticeer de top 3.
3. ONTBREKENDE PAGINA'S (404's): geef gebroken paden op — welke hiervan vertegenwoordigen echte inhoud die zou moeten bestaan?
4. ONDERPRESTERENDE PAGINA'S: pagina's die veel bezoekers zouden moeten hebben maar die niet hebben. Wat zou de kloof verklaren?

Uitvoer: geprioriteerde inhoudsachterstand op basis van analyticsbewijzen.
```

## Voorbeeld

**Gebruiker:** Ik bouw documentatie voor een op ontwikkelaars gerichte webhookintegratiebibliotheek. Gebruikers zijn engineers die onze API integreren. Ik moet van 3 README-bestanden naar een juiste documentatiesite op Docusaurus. Verwacht: ~40 pagina's totaal.

**Uitvoer (fragment):**

```markdown
## Informatiearchitectuur: Webhook Bibliotheek Documentatie

### Navigatie op het hoogste niveau

```
/ (Startpagina)
├── Aan de slag/
│   ├── Inleiding (wat de bibliotheek doet; 2 minuten lezen)
│   ├── Snelstart (werkende webhook in 5 minuten)
│   └── Installatie (alle pakketbeheerders)
├── Gidsen/
│   ├── Webhooks ontvangen
│   ├── Handtekeningen valideren
│   ├── Nieuwe pogingen en idempotentie afhandelen
│   ├── Webhooks lokaal testen
│   └── Migreren van directe HTTP-afhandeling
├── Referentie/
│   ├── Clientopties
│   ├── Eventtypen
│   ├── Foutcodes
│   └── Changelog
└── Concepten/
    ├── Hoe webhookbezorging werkt
    ├── Diepgaand handtekeningverificatie
    └── Garanties voor nieuwe pogingen en volgorde
```

### Analyse van inhoudslacunes
Uw 3 README-bestanden behandelen waarschijnlijk: installatie, basisgebruik en enige API-referentie.

Ontbrekend (hoge prioriteit):
- Tutorial: "Ontvang uw eerste webhook in 5 minuten" — dit is het beginpunt voor alle nieuwe gebruikers
- Handleiding: "Webhooks lokaal testen met ngrok of Cloudflare Tunnel" — meest voorkomend wrijvingspunt voor ontwikkelaars
- Concept: "Garanties voor nieuwe pogingen en volgorde" — engineers hebben dit nodig voor gebruik in productie
- Referentie: Catalogus van eventtypen — moet automatisch gegenereerd worden vanuit uw schema, niet handmatig geschreven
```

---
