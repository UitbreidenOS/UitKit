---
name: editorial-calendar
description: "Maandelijkse redactionele kalender: onderwerpsclusters, publicatieschema, contentmix, distributieplan"
---

# Vaardigheid: Redactionele Kalender

## Wanneer te activeren
- Het plannen van een maand of kwartaal aan content voor een blog, nieuwsbrief of social media
- Onderwerpsclusters koppelen aan zoekwoorden en een samenhangend publicatieschema opbouwen
- Bepalen van de juiste contentmix (how-to, thought leadership, casestudy, vergelijking, etc.)
- Distributieplannen opstellen die het contenttype aan het kanaal koppelen
- Een nieuwe contentmedewerker inwerken die een gestructureerd publicatiesysteem nodig heeft
- Een nieuw merk of nieuwe website lanceren en snel thematisch gezag willen opbouwen

## Wanneer NIET te gebruiken
- Het schrijven van individuele stukken content — gebruik daarvoor `/content-brief`
- SEO-audit van een bestaande site — gebruik daarvoor `/seo-audit`
- Eenmalige social posts zonder strategisch publicatieplan
- Je hebt al een kalender en hoeft alleen contenthiaten op te vullen — begin dan met `/seo-audit` om die hiaten eerst te vinden

## Instructies

### Kernprompt voor het genereren van de kalender

```
Maak een maandelijkse redactionele kalender voor [MERK/PUBLICATIE].

Context:
- Merk: [bedrijfsnaam, een-regelomschrijving]
- Doelgroep: [ICP — functietitel, branche, pijnpunten]
- Primair bedrijfsdoel: [bijv. organisch verkeer, nieuwsbriefabonnees, pipeline-generatie]
- Contentkanalen: [blog, nieuwsbrief, LinkedIn, X, YouTube — vermeld wat van toepassing is]
- Publicatiecadans: [bijv. 2 blogberichten/week, dagelijks LinkedIn, wekelijkse nieuwsbrief]
- Domeinautoriteit / contentvolwassenheid: [nieuwe site / 6-12 maanden oud / gevestigd (DA 40+)]
- Hoofdzoekwoordcluster: [primair onderwerpgebied, bijv. "B2B SaaS onboarding"]
- Concurrent publiceert op: [URL of naam — optioneel]

Lever op:

## 1. Kaart van onderwerpsclusters
Bouw 3-5 pillaronderwerpen met 4-6 subonderwerpen elk:
- Pillar 1: [breed onderwerp] → subonderwerpen: [lijst]
- Pillar 2: [breed onderwerp] → subonderwerpen: [lijst]
...

## 2. Contenttype-mix (% van totale content)
- Educatieve how-to: [X]%
- Thought leadership / opinie: [X]%
- Casestudy / klantverhaal: [X]%
- Vergelijking / versus: [X]%
- Zoekwoord-gericht (onderkant van de funnel): [X]%
- Actuele newsjacking: [X]%

## 3. Maandelijkse kalender — [MAAND JAAR]
Specificeer per week:
- Blogberichten (titel, doelzoekwoord, contenttype, geschat verkeerspotentieel)
- Nieuwsbrief (onderwerpregel, thema, belangrijkste CTA)
- LinkedIn-posts (thema, format: tekst/afbeelding/carrousel/poll/video)
- Content voor andere kanalen

## 4. Distributieplan
Vermeld per gepubliceerd stuk:
- Primair kanaal: [waar het wordt gepubliceerd]
- Hergebruik: [hoe je het binnen 48 uur hergebruikt via kanalen]
- Promotie: [outreach, communities, betaalde versterking indien budget beschikbaar]

## 5. Interne linkingstrategie
Breng in kaart welke nieuwe stukken moeten linken naar bestaande cornerstone-content en naar elkaar.
```

### Framework voor onderwerpsclusters

```typescript
interface TopicCluster {
  pillar: {
    title: string
    targetKeyword: string
    searchVolume: string      // from Ahrefs/Semrush or estimated
    difficulty: number        // 0-100
    format: 'ultimate-guide' | 'hub-page' | 'long-form'
    wordCount: number         // target
  }
  spokes: Array<{
    title: string
    targetKeyword: string
    searchVolume: string
    intent: 'informational' | 'navigational' | 'commercial' | 'transactional'
    format: 'how-to' | 'listicle' | 'comparison' | 'case-study' | 'opinion'
    linksToPillar: boolean    // always true for hub-and-spoke
    priority: 'high' | 'medium' | 'low'
  }>
}

// Regels voor pillar-content:
// - Richt op hoofd-zoekwoorden (1-2 woorden), hoog volume, hoge moeilijkheidsgraad
// - 3.000-8.000 woorden — volledig, verdient backlinks
// - Elk kwartaal bijgewerkt
//
// Regels voor spoke-content:
// - Richt op long-tail-zoekwoorden (3-5 woorden), gemiddeld volume, lage-gemiddelde moeilijkheidsgraad
// - 1.200-2.500 woorden — specifiek, uitvoerbaar
// - Link altijd terug naar pillar en naar 2-3 gerelateerde spokes
```

### Calculator voor contentmix

```
Bereken de optimale contentmix voor mijn situatie:

Bedrijfsfase: [vroeg / groei / volwassen]
Doel: [verkeer / leads / merk / community]
Publicatiefrequentie: [X stukken/maand]
Teamgrootte: [solo / 1-2 schrijvers / klein team / bureau]

Vroege fase + verkeersdoel:
- 60% informatieve SEO (bovenkant funnel, educatief)
- 20% commerciële SEO (vergelijking, beste van, alternatieven)
- 20% thought leadership (bouwt autoriteit + wordt gedeeld)
- Nieuwsbrief: wekelijkse samenvatting, 500-800 woorden, hoge curationewaarde

Groeifase + pipeline-doel:
- 40% informatieve SEO
- 30% commerciële/transactionele SEO (onderkant funnel)
- 20% casestudies + klantverhalen
- 10% thought leadership over koperspijnpunten
- Nieuwsbrief: wekelijks inzicht + één product-CTA

Volwassen fase + merkdoel:
- 30% SEO-onderhoud (toppresteerders bijwerken)
- 40% thought leadership + origineel onderzoek
- 20% community/doelgroepsamenwerking
- 10% experimentele formats (video, audio, interactief)
```

### Wekelijks productieschema voor content

```markdown
# Wekelijks Contentproductiesjabloon

## Maandag — Planning
- [ ] Haal de analytics van afgelopen week op (sessies, tijd op pagina, conversies per stuk)
- [ ] Bevestig dat de stukken van deze week zijn gebrieft en toegewezen
- [ ] Controleer trending onderwerpen in jouw branche (Twitter/LinkedIn, Google Trends, Feedly)
- [ ] Brief eventuele reactieve stukken (newsjacking-kansen)

## Dinsdag–woensdag — Productie
- [ ] Schrijver dient concepten in
- [ ] Redacteursbeoordeling: nauwkeurigheid, structuur, SEO, CTA
- [ ] Audit interne linking (heeft elk stuk links naar 3+ andere stukken?)
- [ ] Metatitel en omschrijving afgerond

## Donderdag — Publicatie & Distributie
- [ ] Blogbericht publiceren (bevestig canonieke URL, schema, OG-tags)
- [ ] Nieuwsbrief versturen indien wekelijkse cadans
- [ ] LinkedIn-post opgesteld op basis van blog — format als carrousel of tekstpost
- [ ] Indienen bij relevante communities (HN Show, Reddit, Slack-groepen)

## Vrijdag — Hergebruik
- [ ] Blogsecties omzetten in 3-5 LinkedIn-posts (inplannen voor de komende 2 weken)
- [ ] Citaten extraheren voor X/Twitter-thread
- [ ] Redactionele kalender bijwerken met werkelijke publicatiedatums en analytics-placeholders
- [ ] Gepubliceerd stuk toevoegen aan de interne linking-backlog voor toekomstige stukken
```

### Distributiestrategie per contenttype

```
Wijs elk contenttype toe aan de optimale distributie:

HOW-TO / TUTORIAL:
Primair: Blog (SEO) + YouTube (indien geschikt voor video)
Hergebruik: LinkedIn-carrousel → X-thread → nieuwsbriefsnippet → Reddit-tutorial
Betaalde versterking: Alleen als je op pagina 2 staat en een push nodig hebt

THOUGHT LEADERSHIP / OPINIE:
Primair: LinkedIn (native long-form presteert goed) + Blog cross-post
Hergebruik: Nieuwsbrief-leadstory → X-thread → Podcastdiscussieonderwerp
Versterking: Tag vermelde personen, reageer op reacties binnen de eerste 60 minuten

CASESTUDY / KLANTVERHAAL:
Primair: Blog (cornerstone, optioneel achter registratie) + Verkoopmateriaal
Hergebruik: LinkedIn-klantspotlight → E-mail aan vergelijkbare prospects → Dia in verkoopdeck
Versterking: Stuur naar de klant zodat zij het kunnen delen — hun publiek vertrouwt hen meer dan jou

VERGELIJKING / VERSUS:
Primair: Blog (onderkant funnel, hoge koopintentie)
Hergebruik: Bijlage bij verkoop-e-mail → chatbot-antwoord → PPC-landingspagina
Versterking: NIET op social media delen — komt zelfpromotioneel over; laat SEO het werk doen

NEWSJACKING / TREND:
Primair: LinkedIn (publiceer binnen 2 uur na het nieuws) + X
Hergebruik: Nieuwsbrief P.S.-sectie → kort blogbericht de volgende dag
Versterking: Snelheid is de versterking; distribueer onmiddellijk of sla over
```

### Redactionele kalendersjabloon (kopieer en plak)

```markdown
# Redactionele Kalender — [MAAND JAAR]

## Doelen deze maand
- Verkeersdoel: [X sessies]
- Nieuwsbriefsdoel: [X abonnees / X% open rate]
- Pipeline-doel: [X content-gegenereerde leads]
- Autoriteitsdoel: [X backlinks / Y DA-verbetering]

## Week 1 ([Datumrange])

| Dag | Kanaal | Titel / Onderwerp | Type | Zoekwoord | CTA |
|---|---|---|---|---|---|
| Ma | Blog | [Titel] | How-to | [zoekwoord] | [abonneer / demo / download] |
| Wo | Nieuwsbrief | [Onderwerpregel] | Samenvatting | — | [CTA] |
| Do | LinkedIn | [Postthema] | Carrousel | — | [betrek / bezoek] |
| Vr | LinkedIn | [Postthema] | Tekst | — | — |

## Week 2 ([Datumrange])
...

## Week 3 ([Datumrange])
...

## Week 4 ([Datumrange])
...

## Evergreen-backlog (publiceer wanneer capaciteit het toelaat)
- [Titel] — [Zoekwoord] — [Prioriteit: H/M/L]
- [Titel] — [Zoekwoord] — [Prioriteit: H/M/L]

## Contentaudits die deze maand vervallen
- [URL] — laatst bijgewerkt [datum] — actie: [vernieuwen / samenvoegen / verwijderen]
```

### Kwartaalplanningsprompt

```
Voer een kwartaalplanning voor content uit.

Prestaties afgelopen kwartaal:
- Top 5 stukken naar verkeer: [lijst]
- Top 5 stukken naar conversies: [lijst]
- Onderste 5 stukken (laag verkeer, geen conversies): [lijst]
- Nieuwe zoekwoorden die op pagina 1 ranken: [lijst]
- Zoekwoorden die van pagina 1 zijn gevallen: [lijst]

Prioriteiten dit kwartaal:
1. Verdubbelen op: [wat werkte] — meer content produceren in deze clusters
2. Vernieuwen: [wat gedaald is] — bijwerken, heroptimaliseren, interne links toevoegen
3. Samenvoegen: [dunne content] — samenvoegen tot één sterk stuk
4. Aanvallen: [nieuw cluster] — nieuw onderwerpgebied om autoriteit in op te bouwen
5. Verwijderen: [onomkeerbare achterblijvers] — 301-redirect naar gerelateerde sterke content

Opleveren:
- Clusterprioriteiten voor Q[X]
- Een 13-weken publicatieroadmap
- Teamindeling: [X stukken/schrijver/week]
- Kostenraming bij uitbesteding: [X stukken × $[Y]/stuk]
```

## Voorbeeld

**Gebruiker:** Maak een maandelijkse redactionele kalender voor een B2B SaaS-startup (projectmanagementtool) gericht op operationele leiders bij bedrijven van 50-500 medewerkers. Publicatie: 2 blogs/week, wekelijkse nieuwsbrief, dagelijks LinkedIn. Maand is juni.

**Resultaat:**
```markdown
# Redactionele Kalender — Juni 2026
**Merk:** [Project Management SaaS] | **Doelgroep:** Ops Directors, Chiefs of Staff | **Doel:** Organisch verkeer + nieuwsbriefgroei

## Onderwerpsclusters
**Pillar 1:** Operationele efficiëntie → spokes: workflows voor remote teams, procesbeschrijving, vergadercadanssjablonen, OKR-tracking
**Pillar 2:** Projectmanagement → spokes: resourceplanning, afhankelijkheidskaarten, cross-functionele projecten, statusrapportage
**Pillar 3:** Operationele opschaling → spokes: SOP's voor opschaling, draaiboek voor ops-aanwerving, tech stack-audit, ops-KPI's

## Contentmix
60% educatieve SEO | 20% thought leadership | 15% casestudies | 5% vergelijking

## Week 1 (1-7 juni)
| Dag | Kanaal | Titel | Type | Zoekwoord | CTA |
|---|---|---|---|---|---|
| Ma 2 | Blog | "How to Run a Weekly Ops Review That Actually Works" | How-to | "ops review meeting" | Nieuwsbriefabonnement |
| Wo 4 | Nieuwsbrief | "The 5-meeting week that runs itself" | Inzicht | — | Lees de blog |
| Do 5 | LinkedIn | Carrousel over vergaderoverbelasting: 5 ops-vergadersjablonen | Carrousel | — | DM voor sjabloon |
| Za 7 | LinkedIn | "Unpopular opinion: most project management tools don't solve the real problem" | Tekst | — | Reageer |

## Week 2 (8-14 juni)
| Dag | Kanaal | Titel | Type | Zoekwoord | CTA |
|---|---|---|---|---|---|
| Ma 9 | Blog | "Asana vs Monday vs [Your Tool]: Which Fits Ops Teams?" | Vergelijking | "asana vs monday for operations" | Gratis proefperiode |
| Wo 11 | Nieuwsbrief | "How [Customer] cut their weekly reporting time by 70%" | Casestudysnippet | — | Lees het volledige verhaal |
| Do 12 | LinkedIn | 5-dia carrousel: "Our customer's ops transformation in 90 days" | Carrousel | — | Link in reacties |
| Vr 13 | LinkedIn | "3 signs your project management tool is holding you back" | Tekst | — | — |

## Distributieregels
- Elk blogbericht → LinkedIn-carrousel binnen 48 uur
- Elke casestudy → Verkoopteam krijgt de link voor hun pipeline
- Nieuwsbriefabonnee-klik → Getagd in HubSpot als "engaged content lead"
```

---

> **Werk met ons samen:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarscommunities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
