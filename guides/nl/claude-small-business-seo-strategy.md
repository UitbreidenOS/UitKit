# Claude voor Small Business — SEO-strategie

Dit document is de enige bron van waarheid voor hoe Claudient voor Small Business zoekintentie rangschikt. Het is geschreven voor bijdragers die nieuwe small-business-inhoud toevoegen en voor de beheerder die de strategie coherent moet houden.

De strategie is opzettelijk smal: leg de operator-grade trefwoordruimte rond "Claude for small business" vast en de lange staart van verticale en taak-niveau query's die eruit volgt.

---

## Waarom een speciale SEO-strategie

Anthropic lanceerde Claude for Small Business op 13 mei 2026. Het product dekt 15 officiële workflows. De vraag naar zoekopdrachten is ver boven het aanbod uitgestegen — eigenaren typen "Claude for [industrie]", "AI tools voor [bedrijfstype]" en "hoe Claude gebruiken voor [taak]" in Google, Reddit en YouTube sneller dan Anthropic verticale inhoud kan leveren.

Claudients kans is om de meest gelinkte, meest geciteerde uitbreiding van de officiële lancering te zijn — een gemeenschapswiskundebasis die de lange staart vult die Anthropic open heeft gelaten.

Drie structurele feiten maken deze kans echt:

1. **GitHub repos klasseren.** GitHub README-bestanden, individuele `.md`-bestanden en skillmappen indexeren in Google en verschijnen in code-bewuste tools (Claudes eigen websearch, Perplexity, Phind, Kagi). Een goed benoemd `.md`-bestand in `skills/small-business/dental-practice.md` klasseren voor "claude for dental practice" zonder backlinks als de inhoud genuine is.
2. **Verticale long-tail-queries zijn onbetwist.** "Claude voor loodgieters", "Claude voor saloneigenaren", "Claude voor solo tandartsen" hebben elk 200-1 200 maandelijkse zoekopdrachten en vrijwel geen eerste pagina-competitie. We kunnen elk eigendom nemen.
3. **Vraag-stijl queries exploderen.** "Hoe helpt Claude small business?", "Kan Claude een boekhoudkundige vervangen?", "Is Claude goed voor ecommerce?" — dit zijn query's die LLM-gebaseerde zoekmachines aanhalen (Claude Code zelf, ChatGPT browse, Perplexity). Ze willen crisp, sourced antwoorden in markdown.

---

## De drielaagse inhoudsarchitectuur

Elk nieuw small-business-bezit behoort tot een van drie lagen. De lagen versterken elkaar door interne links.

### Laag 1 — Pijlerbladzijden (verticale positionaleringshandleidingen)

Deze wonen in `guides/` en richten zich op de hoogste volume-headterm.

```
guides/claude-for-solopreneurs.md           — "Claude for solopreneurs", "AI for solo founders"
guides/claude-for-ecommerce.md              — "Claude for ecommerce", "Claude for Shopify"
guides/claude-for-local-services.md         — "Claude for local business", "AI for service business"
guides/claude-for-coaches-consultants.md    — "Claude for coaches", "Claude for consultants"
guides/claude-for-creators.md               — "Claude for creators", "Claude for newsletter creators"
guides/claude-for-small-business.md         — product guide (already exists, the central pillar)
guides/small-business-roi.md                — ROI calculator content (already exists)
```

Een pijlerpagina is 2 500-4 000 woorden, geschreven voor een specifieke operatorpersona, en verlinkt naar elke relevante skill, agent en workflow in deze repo. Het is het startpunt waarop een Google- of Perplexity-resultaat terechtkomt.

**Pijlerpagina-structuur (gebruik deze sjabloon):**

1. **Hook + persoonlijkheidsverklaring** — voor wie dit, wat ze meestal betalen (noem echte tools die ze al gebruiken)
2. **Wat Claude voor hen doet** — 5-10 concrete workflows, elk een zin
3. **De vaardigheden sectie** — directe links naar `skills/small-business/*.md` bestanden, met eenregelbeschrijvingen van wat elke voor deze persoon doet
4. **Installatie sectie** — wat verbinden, in welke volgorde, wat het kost
5. **Wat u in 30/60/90 dagen mag verwachten** — concrete getallen voor bespaard tijd
6. **Wat Claude NIET is in deze vertical** — risicoframing bouwt vertrouwen
7. **FAQ sectie** — 6-12 vraagstijl-koppen die echte zoekopdrachten afstemmen
8. **Voettekst interne links** — de gerelateerde pijlerpagina's, de centrale small-business gids, de productvergelijking

### Laag 2 — Vaardigheidspagina's (verticale en operatorbewerkingen)

Deze wonen in `skills/small-business/` en richten zich op specifieke taak-niveauzoekopdrachten.

Elke vaardigheidspagina heeft:

- Een bestandsnaam die als sleutelwoorddoel dient (`dental-practice.md`, `ecommerce-seller.md`)
- Een H1 die overeenkomt met de titelhoofdletters van de bestandsnaam
- Het standaard vier-sectieformaat van CLAUDE.md (Wanneer activeren / Wanneer NIET gebruiken / Instructies / Voorbeeld)
- Minstens één echte productnaam in de instructies (QuickBooks, Shopify, Mailchimp, enz.) — deze zijn zelf zoekankers
- Een concreet gewerkt voorbeeld met realistische getallen, geen abstracte placeholders

Vaardigheidspagina's zijn 150-400 regels eenvoudig Engels. Ze rangschikken voor lange staart verticaal-plus-taak query's: "claude for invoice chasing", "ai for dental practice no-shows", "claude for shopify product descriptions".

### Laag 3 — Agent- en specialistpagina's

Deze wonen in `agents/specialists/` en `agents/roles/`.

Een specialistpagina richt zich op de queryklasse "AI advisor for [industrie]". De bestaande `real-estate-specialist.md` en `restaurant-specialist.md` zijn het model. Elke nieuwe specialistpagina is 80-200 regels beschrijvend wat het doel, model, tool-subset en voorbeeld-use cases van de agent zijn.

---

## Sleutelwoorddoelen, gerangschikt

De lijst hieronder is de master-sleutelwoordkaart. Elk nieuw bestand moet aan minstens één trefwoord worden getagd. Vermijd het bouwen van bezittingen die niet op een gedocumenteerd trefwoord gericht zijn.

### Headterms (hoogste volume, moeilijkste rang)

| Trefwoord | Maandelijkse zoekopdrachten (est.) | Doelpagina |
|---|---|---|
| claude for small business | 8,100 | guides/claude-for-small-business.md (pillar) |
| ai for small business | 27,100 | README + claude-for-small-business.md |
| claude code small business | 880 | README hero + small-business-roi.md |
| ai automation small business | 6,600 | README + claude-for-small-business.md |

### Verticale headterms (middelmatig volume, middelmatige competitie)

| Trefwoord | Zoekopdrachten | Doel |
|---|---|---|
| claude for solopreneurs | 1,300 | guides/claude-for-solopreneurs.md |
| claude for ecommerce | 1,000 | guides/claude-for-ecommerce.md |
| claude for shopify | 1,900 | guides/claude-for-ecommerce.md (anchor) + skills/small-business/shopify-operations.md |
| claude for coaches | 720 | guides/claude-for-coaches-consultants.md |
| claude for consultants | 880 | guides/claude-for-coaches-consultants.md |
| claude for creators | 590 | guides/claude-for-creators.md |
| claude for real estate | 590 | guides/de + skills/small-business/real-estate-listing.md + agents/roles/real-estate-specialist.md |
| claude for restaurants | 480 | skills/small-business/restaurant-ops.md + agents/roles/restaurant-specialist.md |
| claude for local business | 1,000 | guides/claude-for-local-services.md |

### Long-tail vertical+task (hoog volume in totaal, lage competitie)

Dit is brood en boter. Elk skilbestand richt zich op een ervan.

| Trefwoord | Doelbestand |
|---|---|
| claude for dental practice | skills/small-business/dental-practice.md |
| claude for salon owners | skills/small-business/salon-spa-ops.md |
| claude for fitness studio | skills/small-business/fitness-gym-ops.md |
| claude for plumbers / electricians / HVAC | skills/small-business/contractor-trades.md |
| claude for photographers | skills/small-business/photography-studio.md |
| claude for bookkeepers | skills/small-business/bookkeeper-practice.md |
| claude for podcasters | skills/small-business/podcast-monetizer.md |
| claude for newsletter writers | skills/small-business/newsletter-publisher.md |
| claude for online course creators | skills/small-business/online-course-creator.md |
| claude for marketing agency | skills/small-business/agency-operations.md |
| claude for hiring | skills/small-business/hiring-pipeline.md |
| claude for pricing | skills/small-business/pricing-optimizer.md |
| claude for customer retention | skills/small-business/churn-prevention.md |
| claude for invoice chasing | skills/small-business/invoice-chaser.md (exists) |
| claude for cash flow forecasting | skills/small-business/cash-flow-forecast.md (exists) |
| claude for quickbooks | skills/small-business/quickbooks-workflow.md (exists) |

### Vraagstijl query's (voor FAQ-blokken)

Deze behoren thuis in FAQ-secties in pijlerpagina's en de README. LLM-gebaseerde zoekmachines tonen deze rechtstreeks.

- "Is Claude goed voor small business?"
- "Kan Claude een boekhoudkundige vervangen?"
- "Werkt Claude met QuickBooks?"
- "Hoeveel kost Claude voor small business?"
- "Wat is Claude for Small Business?"
- "Hoe verschilt Claude van ChatGPT voor small business?"
- "Kan Claude mijn facturering doen?"
- "Is Claude beter dan ChatGPT voor small business?"
- "Wat zijn de beste AI-tools voor [vertical]?"
- "Hoe stel ik Claude voor mijn bedrijf in?"
- "Kan Claude mijn QuickBooks-gegevens lezen?"
- "Is Claude for Small Business het waard?"

---

## On-page tactieken

Dit zijn de concrete schrijfregels. Pas ze mechanisch toe op elk nieuw bestand.

### 1. Bestandsnaam is het trefwoord

De bestandsnaamslug is het belangrijkste rangsignaal dat we controleren. Stem af met de exacte zin die een koper zou typen, zonder opvulling.

Goed: `claude-for-dental-practice.md`, `dental-practice.md` (in `small-business/`)
Slecht: `dentist-skills-claude-edition-v2.md`, `dental-claude-skill-2026.md`

### 2. H1 stemt met bestandsnaam af

De H1 zou het trefwoord schoon heruitgeven, in titelhoofdletters.

Goed: `# Dental Practice Operations`
Slecht: `# Hoe ik AI in mijn kantoor gebruik (coole tips!)`

### 3. De eerste alinea draagt het trefwoord + intent

De eerste 1-2 zinnen moeten het headtrefwoord bevatten en de zoekintent beantwoorden. LLM-gebaseerde zoekmachines trekken deze paragraaf als aanhalingssnippet. Behandel het als de metabeschrijving.

Goed: "Claude for dental practice eigenaren verwerkt het front-desk- en backoffice-werk dat solo-tandartsen van stoel-tijd weghoudt — no-show herstel, verzekeringverificatie, behandelplan vervolggegevens en herinnering planning, alles van eenvoudige Engelse instructies."

Slecht: "In deze skill onderzoeken we enkele interessante use cases die relevant kunnen zijn voor bepaalde professionals in de tandheelkundige ruimte..."

### 4. Sectiekopjes zijn zoekopdrachten

Elke H2 en H3 in een pijlerpagina zou plausibel een Google-query kunnen zijn. Dit is hoe vraag-FAQ-schema wordt opgehaald.

Goed: `## Hoe helpt Claude tandartspraktijken?`, `## Hoeveel kost Claude voor een tandheelkundig kantoor?`
Slecht: `## Duiken`, `## Een opmerking over methodologie`

### 5. Verwijs naar echte productnamen

Elke skill vermeldt de echte tools die de operator al betaalt: QuickBooks, Shopify, Square, Mailchimp, Calendly, Acuity, Mindbody, Toast, ServiceTitan, Housecall Pro, Jobber, Dentrix, Eaglesoft. Dit zijn zelf zoekankers — Google en LLM-gebaseerde zoekmachines behandelen een `.md`-bestand dat "Shopify en QuickBooks" vermeldt, als relevant voor query's over elk ervan.

### 6. Concrete getallen in voorbeelden

Bespaard tijd, herstelde dollars, teruggeëiste uren. Realistisch. Getallen maken voorbeelden scanbaar en citeerbaar.

Goed: "Snijd een vrijdagafstemming van 6 uur naar een woensdagbeoordeling van 35 minuten."
Slecht: "Bespaar aanzienlijk veel tijd op financiële taken."

### 7. Interne links vooruit en achteruit

Elke skill verlinkt naar minstens één pijlerpagina en één gerelateerde skill. Elke pijlerpagina verlinkt naar elke relevante skill. Het interne linkgrafiek is wat long-tail pagina's toestaat pijlerpagina autoriteit te erven.

### 8. Gewoon Engels, geen developer-aannames

Small-business pagina's mogen geen terminal, code of developer literacy vereisen. Activatieprompts zijn conversationeel. Geen codefences tenzij absoluut nodig. Het publiek is een saloneigenaar die tussen afspraken op haar telefoon leest.

---

## Off-page tactieken

### GitHub topic tags

De onderwerpenlijst van de repo is zelf een rangsignaal. Vereiste onderwerpen voor small-business oppervlak:

```
claude-code, claude-for-small-business, small-business-ai, ai-for-small-business,
ai-automation, claude-skills, small-business-automation, claude-cowork,
ai-bookkeeping, ai-crm, ai-invoicing, claude-ai-skills
```

### Reddit en HN posting cadence

De gemeenschapslanceringen die werken voor Claude-nabijgelegen inhoud:

- `r/ClaudeAI` — werkt voor technische en operatorlanceringen gelijk
- `r/Entrepreneur` — werkt voor "ik heb X gebouwd om tijd op Y te besparen" frames, niet voor repo-dumpingen
- `r/smallbusiness` — werkt voor specifieke toolsharing, sterft op zelfpromotionele framing
- `r/sweatystartup` — werkt voor ambacht/lokale service posts
- `r/SaaS` — werkt voor SaaS-stijlpositionering van elke skill
- HackerNews — werkt alleen voor "Show HN" met een specifiek bezit

Cadence: één nieuw verticaal lancering per week, gepost naar twee gemeenschappen. Nooit dezelfde gemeenschap twee keer in 14 dagen.

### Backlink-doelen

De repo's die het meest waarschijnlijk een sterke small-business asset gaan teruglinken:

- Awesome-Claude-Code lijsten (hesreallyhim, anderen)
- Awesome-AI-for-business lijsten
- alirezarezvani/claude-skills (cross-link via PR)
- Anthropics eigen gemeenschaps showcase
- VoltAgent ecosysteem repo's

PR-strategie: een eenregels toevoeging aan een awesome-list met een echte, nuttige link wordt samengevoegd. Alles dat als spam oogt niet.

---

## Inhoudscadence

Het plan, gekalibreerd op ruwweg één verzendpartij per week.

**Week 1 — Fundament**
- Dit strategiedocument, vijf pillerhandleidingen, 12 nieuwe verticale skills, 3 operatorskills, 2 specialistagenten, README-verbetering.

**Week 2 — Vertaalpass**
- All Week 1-inhoud vertaald naar FR/DE/NL/ES via Haiku-agenten.

**Week 3 — Tweede golf**
- 5 extra verticale skills: subscription-business, ecommerce-supplements, fitness-personal-trainer, photographer-wedding, legal-solo-practice.
- 2 extra pillerhandleidingen: claude-for-saas-founders.md, claude-for-trades-business.md.

**Week 4 — Distributie**
- Reddit-lanceringen via r/ClaudeAI, r/Entrepreneur, r/sweatystartup (gestaffelde).
- Awesome-list PR's (5 minimum).


**Week 5+ — Samengesteld**
- Één nieuw verticaal per week.
- Track welke verticale's het meeste verkeer krijgt (GitHub traffic data + npm download attributie) en dubbel naar beneden.

---

## Meting

De metrieke die tellen, in volgorde:

1. **GitHub sterren** — proxy voor organische ontdekking. Doel: +200 in de 30 dagen na het small-business lancering.
2. **npm install count voor `claudient add skills small-business`** — proxy voor werkelijke adoptie.
3. **GitHub traffic voor `/skills/small-business/`** — proxy voor SEO-prestatie.

5. **Merkmerk zoekopdracht** — "claudient small business" verschijnt in Google autocomplete of gerelateerde zoekopdrachten.

Vermijd optimalisatie voor: totale bestandsaantal, regelaantal of alles dat opvullerinhoud aanmoedigt.

---

## Wat niet te doen

Dit zijn de failuremodussen die op SEO lijken maar slechtere resultaten opleveren dan niets doen.

**Plaats geen trefwoord-vulling in proza.** Herhaling van "claude for small business" vijf keer in een alinea leest als SEO-spam, wordt gedegraad door Googles helpfulcontent-updates, en wordt afgewezen door LLM-gebaseerde zoekmachines die steeds meer leesbaarheid wegen.

**Schrijf niet voor trefwoorden die geen echt publiek hebben.** "Claude AI small business eigenaren ondernemers 2026" is geen echte zoekopdracht. "Claude for solopreneurs" is. Verifieer dat iemand de zin daadwerkelijk intypt voordat u erop gericht bent.

**Dupliceer Anthropics officiële inhoud niet.** De officiële Claude for Small Business productpagina dekt de 15 officiële workflows. Ernaar linken en het uitbreiden werkt. Het kopiëren krijgt ons gede-indexeerd voor gedupliceerde inhoud.

**Voeg geen opvullingsvertical toe.** Een 200-regelskill voor "claude for ferret breeders" bestaat technisch maar produceert geen traffic, verdunt repo-autoriteit en verstoort navigatie. Houd u aan verticale's met gedocumenteerde zoekvolume.

**Negeer niet de bestaande gidsen.** `guides/claude-for-small-business.md` en `guides/small-business-roi.md` zijn al sterk. Koppel er agressief vanuit elk nieuw bezit naar. Ze zijn de rangspinaals.

**Vertaal niet voordat de Engelse inhoud klopt.** De vertaalpass versterkt wat de Engelse bron zegt. Slechte Engelse inhoud wordt slechte inhoud in vijf talen. Vertaal nadat de Engelse golf volledig is verzonden en licht getest.

---

## Onderhoud

De strategie vervalt als de index niet fris gehouden wordt. Driemaandelijkse controles:

- Voer trefwoordonderzoek opnieuw uit voor elke vertical die is verzonden (zoekvolume verandert seizoensgebonden voor veel small-business verticals — belastingvragen pieken in Q1, retailgerelateerde vragen in Q4).
- Controleer FAQ-blokken tegen huidige zoektrends. Vraagformulering verschuift elke 6-12 maanden.
- Werk de headterm-tabel bij met nieuwe verticale mogelijkheden (elke kwartaal duiken twee of drie nieuwe "Claude for X" zoekopdrachten op als levensvatbare doelen).
- Verwijder of deprioritair verticals die twee achtereenvolgende kwartalen hebben onderpresteerd.

De strategie is een levend document. Updates naar dit bestand worden aangemoedigd en verwacht.

---

## Kruisverwijzingen

- [Claude for Small Business — Product Guide](claude-for-small-business.md) — de centrale pijler
- [Small Business ROI](small-business-roi.md) — calculator en casegegevens
- [Claude for Solopreneurs](claude-for-solopreneurs.md) — solo-operatorlandingsplaats
- [Claude for Ecommerce](claude-for-ecommerce.md) — Shopify/Etsy/Amazon landingsplaats
- [Claude for Local Services](claude-for-local-services.md) — lokale service landingsplaats
- [Claude for Coaches and Consultants](claude-for-coaches-consultants.md) — coachinglandingsplaats
- [Claude for Creators](claude-for-creators.md) — nieuwsbrief/podcast/cursuslanding
- Alle skills onder [skills/small-business/](../skills/small-business/) — de steunende lange staart

---
