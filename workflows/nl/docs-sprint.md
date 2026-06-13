# Documentatie Sprint Workflow

Een stapsgewijze workflow voor een gerichte documentatiesprint — van inhoudsaudit tot schrijven, review en publicatie — met Claude Code-vaardigheden door het hele proces.

---

## Wanneer deze workflow uitvoeren

- Een nieuw product of functie wordt uitgebracht en heeft documentatie nodig voor de aankondiging
- Je hebt een documentatiehiaat geïdentificeerd vanuit analyses (hoge exitpercentages, mislukte zoekopdrachten, correlatie met supporttickets)
- Kwartaalmatig: geplande documentatieverbetering-sprint om de supportlast te verminderen
- Migratie: verplaatsen van een wiki naar een toegewijde documentatiesite

---

## Sprint-overzicht

Een standaard documentatiesprint is 1 week voor een gerichte scope (5-10 pagina's):

| Dag | Activiteit |
|---|---|
| Dag 1 | Inhoudsaudit en scopedefinitie |
| Dag 2 | Architectuur en sjablonen |
| Dagen 3-4 | Schrijfsprint |
| Dag 5 | Review, publiceer en feedbackopzet |

Voor een grotere scope (20+ pagina's), voer dit uit als een sprint van 2 weken met dezelfde structuur.

---

## Stap 1 — Inhoudsaudit (Dag 1, ochtend)

Voordat je iets schrijft, begrijp je de staat van wat er bestaat.

**Auditprompt:**
```
/doc-site-builder

Voer een inhoudsaudit uit voor onze documentatiesite.

Product: [naam]
Huidige documentatie-inventaris (plak paginatitels en URL's of beschrijvingen):
[lijst alle bestaande pagina's]

Productwijzigingen in de afgelopen [90 dagen / 6 maanden]:
[plak recente release notes, changelog, of functieaankondigingen]

Analysedata (indien beschikbaar):
- Top 10 pagina's op paginaweergaven: [plak]
- Top 10 zoekopdrachten met 0 resultaten: [plak — dit is je lijst met inhoudskloven]
- Pagina's met het hoogste exitpercentage: [plak]

Classificeer elke bestaande pagina op Diátaxis-type: Tutorial / Hoe-te / Referentie / Uitleg.
Markeer pagina's van gemengd type (pagina's die twee typen tegelijk proberen te zijn — splits deze).
Markeer verouderde pagina's (inhoud die waarschijnlijk is gewijzigd met recente productupdates).
Markeer ontbrekende inhoud (onderwerpen die zouden moeten bestaan op basis van het product en gebruikersbehoeften maar dat niet doen).

Uitvoer: geprioriteerde inhoudsbacklog voor deze sprint.
```

**Scopebeslissing:** Selecteer uit de audituitvoer 5-10 pagina's om te schrijven of bij te werken in deze sprint. Wees streng over scope — 5 uitstekende pagina's zijn meer waard dan 15 middelmatige.

---

## Stap 2 — Sprintscope en prioritering (Dag 1, middag)

**Prioriteer de backlog:**

| Prioriteit | Inhoudstype | Wanneer als eerste schrijven |
|---|---|---|
| P1 | Ontbrekende Aan de slag / Snelstart | Gebruikers mislukken bij hun eerste contactpunt |
| P1 | Gebroken of verouderde referentie-inhoud | Foute docs zijn erger dan geen docs |
| P2 | Ontbrekende hoe-te-handleidingen voor veelvoorkomende taken | Hoog volume supportvragen |
| P2 | Nieuwe functiedocumentatie | Functie verscheept zonder docs |
| P3 | Conceptuele / uitlegdocs | Gebruikers hebben een mentaal model nodig, niet alleen instructies |
| P3 | Cosmetische verbeteringen | Lage impact — doe geen sprint hierop |

**Sprintbacklogformat:**

```markdown
## Documentatie Sprint — [Datum] — Backlog

| Prioriteit | Pagina | Type | Huidige staat | Waarom nu |
|---|---|---|---|---|
| P1 | Aan de slag / Snelstart | Tutorial | Ontbreekt | Drop-off bij eerste contact |
| P1 | Authenticatiehandleiding | Hoe-te | Verouderd (v1 → v2-migratie heeft het gebroken) | Volumeondersteuningstickets |
| P2 | POST /v1/events eindpunt | Referentie | Onvolledig (geen voorbeelden) | Nieuw eindpunt verscheept |
| P2 | Webhooks instellen | Hoe-te | Ontbreekt | Populairste mislukte zoekopdracht |
| P3 | Wat is [kernconcept] | Uitleg | Ontbreekt | Gebruikers vragen dit in support |
```

---

## Stap 3 — Architectuurafstemming (Dag 2, ochtend)

Als deze sprint de navigatiestructuur wijzigt of nieuwe secties toevoegt, stem dan af over IA voor het schrijven.

```
/doc-site-builder

Stel een bijgewerkte navigatiestructuur voor voor deze nieuwe pagina's.

Bestaande navigatie: [plak huidige navigatiestructuur]
Nieuwe pagina's toe te voegen: [lijst van sprintbacklog]

Beperkingen:
- Maximale navigatiediepte: 2 niveaus (maak geen nieuwe topniveausecties tenzij noodzakelijk)
- Platform: [Docusaurus / MkDocs / Mintlify]
- Doelgroep: [ontwikkelaars / eindgebruikers / beheerders]

Aanbeveling: waar elke nieuwe pagina te plaatsen, of nieuwe secties moeten worden aangemaakt,
en of bestaande pagina's moeten worden verplaatst.

Inclusief: een voor/na-navigatievergelijking.
```

---

## Stap 4 — Sjabloonselectie (Dag 2, middag)

Gebruik het juiste sjabloon voor elk Diátaxis-inhoudstype. Haal op uit `/doc-site-builder` of gebruik deze:

**Tutorial (Aan de slag):**
- Opening: wat je zult bouwen / bereiken — de eindtoestand, 1-2 zinnen
- Vereisten: genummerde lijst — wees expliciet over versies
- Stappen: genummerd, elk één dat een zichtbaar resultaat oplevert
- Verifieer of het werkte: het commando of de controle die het succes bevestigt bij elke stap
- Wat er net is gebeurd: 1-2 zinnen die uitleggen wat de tutorial heeft bereikt
- Volgende stappen: maximaal 3 links — waar te gaan vanaf hier

**Hoe-te-handleiding:**
- Titel: "Hoe [taak uitvoeren]" — moet actiegericht zijn
- Opening: 1 zin — voor wie dit is en wat het bereikt
- Vereisten
- Stappen: gebiedende wijs ("Voer het commando uit", niet "De gebruiker moet het commando uitvoeren")
- Probleemoplossing: de 2-3 meest waarschijnlijke fouten en hun oplossingen
- Gerelateerd: 2-3 links naar gerelateerde hoe-te's en referentie

**Referentiepagina:**
- Wat dit is (1 zin)
- Syntaxis / handtekening
- Alle parameters / opties in een tabel
- Minimaal werkend voorbeeld
- Notities / randgevallen
- Zie ook

**Uitleg / Concept:**
- Wat dit is en waarom het bestaat
- Hoe het werkt (mentaal model, diagram indien nuttig)
- Wanneer het te gebruiken vs. alternatieven
- Veelvoorkomende misvattingen
- Gerelateerde referentie

---

## Stap 5 — Schrijfsprint (Dagen 3-4)

**Voor API-documentatie:**
```
/api-doc-writer

Documenteer dit API-eindpunt.

[plak de route handler-code, OpenAPI-fragment, of eindpuntbeschrijving]

Uitvoer: volledige referentiedoc met:
- Tabel verzoekparameters (pad, query, body)
- Tabel antwoordvelden
- Alle foutcodes met uitleg
- Codevoorbeelden in curl, Python, TypeScript
- Valkuilen en randgevallen (indien bekend)
```

**Voor README of Aan de slag:**
```
/readme-generator

Schrijf een Aan de slag-handleiding voor [product/bibliotheek].

Product: [naam en beschrijving van 1 zin]
Gebruikerstype: [ontwikkelaars / niet-technische gebruikers]
Beginpunt: [wat ze hebben als ze beginnen]
Eindtoestand: [wat ze hebben als deze handleiding klaar is — het waardemoment]

Inclusief: vereisten, installatie, eerste werkend voorbeeld, veelvoorkomende configuratie,
en 3 links naar volgende stappen.

Taal: [TypeScript / Python / elk — pas bij de primaire SDK]
```

**Voor operationele runbooks:**
```
/runbook-generator

Schrijf een runbook voor [proces of incidenttype].

Proces / incidenttype: [beschrijf]
Doelgroep: piketingenieur die dit misschien nog nooit eerder heeft gezien
Aanleiding: [welke conditie zorgt ervoor dat dit runbook nodig is]

Inclusief:
- Symptomen en detectie
- Diagnosestappen (geordend — begin met de meest waarschijnlijke oorzaak)
- Herstelstappen (exacte commando's, met verwachte uitvoer)
- Escalatie: wie te pageren als dit niet oploste in X minuten
- Preventie: wat te controleren om dit de volgende keer te voorkomen
```

**Voor changelogs:**
```
/changelog-writer

Schrijf de changelog voor [versie / releasenaam].

git log:
[plak git log --oneline voor deze release]

Doelgroep: [ontwikkelaars / eindgebruikers]
Filter eruit: interne wijzigingen, afhankelijkheidsupgrades, alleen-test-wijzigingen.
Groepeer: Brekende wijzigingen → Nieuw → Verbeteringen → Oplossingen.
Inclusief: links naar docs voor elke nieuwe functie als docs bestaan.
```

---

## Stap 6 — Engineering review (Dag 4, middag)

Elke technische documentatiepagina moet worden beoordeeld door een engineer voor publicatie. De review vangt op:
- Onjuiste technische details (verkeerde parameternamen, verouderde syntaxis)
- Ontbrekende stappen (iets dat de schrijver als vanzelfsprekend beschouwde maar dat niet is)
- Codevoorbeelden die niet werken (de meest voorkomende en schadelijke documentatiefout)

**Reviewverzoeksjabloon:**

```markdown
Hallo [naam engineer],

Ik heb documentatie opgesteld voor [functie/eindpunt]. Kun je reviewen op technische nauwkeurigheid?

Specifiek:
1. Zijn alle parameternamen en typen correct?
2. Werken de codevoorbeelden echt? (Als je ze kunt uitvoeren, doe dat dan — ze moeten de gedocumenteerde uitvoer produceren.)
3. Mis ik eventuele belangrijke foutgevallen of randgevallen?
4. Is het beschreven gedrag nauwkeurig voor de huidige versie?

[Link naar concept of plak concept hier]

ETA benodigd: [datum]. Dit blokkeert publicatie.
```

Doel: 24-uurs doorlooptijd van engineers. Als een pagina meer dan 2 rondes technische review nodig heeft, plan dan een gesprek van 30 minuten in.

---

## Stap 7 — Stijlreview (Dag 5, ochtend)

```
Beoordeel deze documentatiepagina op stijl en duidelijkheid.

Pagina: [plak inhoud]

Controleer:
1. Is de titel actiegericht / beschrijvend — komt het overeen met wat een gebruiker zou zoeken?
2. Begint het met gebruikersvoordeel, niet productbeschrijving?
3. Zijn alle codevoorbeelden uitvoerbaar (geen tijdelijke aanduidingen die ze breken)?
4. Is het geschreven in de tweede persoon ("je") — geen "de gebruiker" of passieve stem?
5. Zijn zinnen gemiddeld onder de 25 woorden?
6. Is er iets dat kan worden weggelaten zonder betekenis te verliezen?
7. Worden foutmeldingen uitgelegd met oorzaak + oplossing?

Uitvoer: specifieke bewerkingen op regelniveau. Geen algemene feedback — alleen specifieke wijzigingen.
```

---

## Stap 8 — Publicatie en feedbackopzet (Dag 5, middag)

**Checklist voor publicatie:**
- [ ] Technische review goedgekeurd door engineer
- [ ] Alle codevoorbeelden getest en produceren de gedocumenteerde uitvoer
- [ ] Alle interne links geverifieerd (geen 404's)
- [ ] Frontmatter volledig: title, description, last_updated, tags
- [ ] Pagina verschijnt correct in navigatie
- [ ] Zoekindex bijgewerkt (herbouw indien gebruik wordt gemaakt van Algolia, pagefind, of vergelijkbaar)

**Feedbackinstrumentatie:**

Voeg een "Was dit nuttig?"-widget toe aan elke nieuwe pagina. De minimale implementatie:

```html
<!-- Minimale feedbackwidget — onderaan elke pagina -->
<div class="feedback">
  <p>Was this page helpful?</p>
  <button onclick="sendFeedback('yes')">Yes</button>
  <button onclick="sendFeedback('no')">No</button>
</div>
```

Volg: positief percentage per pagina. Doel: >70% positief. Pagina's onder 50% vereisen onderzoek.

---

## Stap 9 — Sprint retrospectief (Einde Dag 5)

```
Beoordeel deze documentatiesprint en identificeer verbeteringen voor de volgende keer.

Geschreven pagina's: [lijst]
Niet voltooide pagina's: [lijst met reden]
Reviewrondes per pagina: [gemiddelde]
Blokkerende problemen: [lijst — bijv. "2 dagen gewacht op API-specificatie", "geen stagingomgeving om voorbeelden te verifiëren"]
Tijd per paginatype: [Tutorial: Xu, Hoe-te: Xu, Referentie: Xu]

Te beantwoorden vragen:
1. Welke pagina's duurden langer dan verwacht — waarom?
2. Welke reviewknelpunten kunnen worden geëlimineerd met proceswijzigingen?
3. Welke inhoud had in scope moeten zijn maar dat niet was?
4. Wat is de volgende sprint met de hoogste impact?
```

---

## Tijdkaders regels

- Inhoudsaudit: maximaal 3 uur. Gebruik de analysedata om te prioriteren — beoordeel niet elke pagina afzonderlijk.
- Per pagina schrijven (met Claude Code): Tutorial: 90 min | Hoe-te: 45 min | Referentie: 60 min | Uitleg: 60 min
- Engineering review: SLA van 24 uur van engineers. Als het uitloopt, escaleer of plan een synchronisatiegesprek.
- Codevoorbeeldtesten: niet onderhandelbaar. Elk codevoorbeeld moet worden uitgevoerd voor publicatie.
- Sprintscope: 5-10 pagina's per week. Meer betekent dat de scope te breed is.

---

## Docs-as-code CI-opzet

Voeg deze toe aan je repo om kwaliteit af te dwingen bij elke PR:

```yaml
# .github/workflows/docs-quality.yml
name: Docs Quality

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Markdown lint
        uses: DavidAnson/markdownlint-cli2-action@v14
        
      - name: Spell check
        uses: streetsidesoftware/cspell-action@v6
        
      - name: Check broken links
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress './docs/**/*.md'
          
      - name: Check frontmatter
        run: |
          # Verify all .md files have required frontmatter: title, description, last_updated
          python scripts/check_frontmatter.py docs/
```

Dit dwingt consistentie af zonder een stijlgidereview te vereisen voor elke PR.

---
