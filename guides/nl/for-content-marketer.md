# Claude voor Content Marketeers en SEO

Alles wat een Content Marketeer of SEO-specialist nodig heeft om AI-ondersteunde contentstrategie, productie, optimalisatie en distributie uit te voeren in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een content marketeer, SEO-manager of groeimarketeer wiens taak het is een publiek op te bouwen, organisch verkeer te laten groeien en lezers om te zetten in leads of klanten. Je besteedt te veel tijd aan het staren naar lege pagina's, het schrijven van briefings, het herformatteren van content voor verschillende kanalen en het verzamelen van analytics voor rapporten.

**Voor Claude Code:** 90 minuten om een blogpost te onderzoeken en te briefen. 45 minuten om een serie social posts te schrijven. Een halve dag om een maandelijkse redactionele kalender te produceren. Uren achter schrijvers aanzitten voor briefings die nog vaag zijn.

**Na:** Volledige contentbriefing in 5 minuten. Redactionele kalender voor de maand in 15 minuten. Blogpostopzet met concurrentieanalyse in minder dan 10 minuten. Sociale herpublicatie voor één blogpost in 3 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer de volledige content marketing en SEO-stack
npx claudient add skills marketing

# Of kies wat je nodig hebt:
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/content-brief
npx claudient add skill marketing/editorial-calendar
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/ai-seo
npx claudient add skill marketing/programmatic-seo
npx claudient add skill marketing/copywriting
npx claudient add skill marketing/social-media-manager
npx claudient add skill marketing/email-sequence
npx claudient add agents advisors/cmo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Jouw Claude Code content marketing-stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/content-brief` | SEO-geoptimaliseerde contentbriefing: trefwoord, opzet, hiaten, interne links, CTA | Voor elk stuk content |
| `/editorial-calendar` | Maandelijkse kalender: onderwerpsclusters, publicatieschema, contentmix, distributie | Maandelijkse planning |
| `/content-strategy` | Volledige contentstrategie: doelgroep, doelen, kanalen, onderwerpsclusters, KPI's | Kwartaalplanning of bij merkintroductie |
| `/seo-audit` | Technische en on-page SEO-audit: problemen, kansen, geprioriteerde lijst van fixes | Maandelijkse siteaudit |
| `/ai-seo` | SEO in het AI-tijdperk: optimaliseren voor ChatGPT, Perplexity, Bing AI, featured snippets | Bij het vernieuwen van bestaande content |
| `/programmatic-seo` | Programmatische paginasjablonen: schema, N-van-M-patronen, schaalbare productie | Contentproductie opschalen |
| `/copywriting` | Landingspagina's, koppen, CTA's, advertentietekst — gericht op conversie | Alle conversiegerichte tekst |
| `/social-media-manager` | Platform-native postcreatie, planningsstrategie, betrokkenheidsplaybooks | Sociale content en kanaalbeheer |
| `/email-sequence` | Drip-sequenties, nieuwsbrieven, geautomatiseerde flows — volledige copywriting + logica | E-mailcontent en nurture-flows |

### Agents

| Agent | Model | Wanneer in te schakelen |
|---|---|---|
| `cmo-advisor` | Opus | Strategievragen, kanaalprioriteiten, contentpositionering |
| `competitive-analyst` | Sonnet | Concurrent content-audits, gapanalyse, positioneringsintelligentie |

---

## Dagelijkse workflow

### Ochtend — Analytics review (15 minuten)

**1. Performancepuls**
```
/seo-audit

Haal mijn belangrijkste contentmetrics van gisteren op:
- Top 5 pagina's per sessies
- Nieuwe pagina's die verschijnen in Google Search Console
- Pagina's die de afgelopen 7 dagen in ranking zijn gedaald
- Openingsratio van de nieuwsbrief van gisteren

Geef me een 5-puntsbriefing: wat te vieren, wat te onderzoeken, wat vandaag te repareren.
```

**2. Kansenscan**
```
/ai-seo

Welke trefwoorden gerelateerd aan [mijn onderwerpscluster] zijn de afgelopen 7 dagen gestegen?
Zijn er trending vragen in mijn niche die ik vandaag kan oppikken?
Controleer: Google Trends, Reddit, LinkedIn trending topics.
```

---

### Contentcreatie (variabel — 1-4 uur)

**3. Briefing voor een nieuw stuk**
```
/content-brief

Doeltrefwoord: [trefwoord]
Secundaire trefwoorden: [lijst]
Contenttype: [how-to / vergelijking / thought leadership]
Doelgroep: [specifieke persoon met specifiek probleem]
Concurrerende URL's: [top 3 rangschikkende pagina's]
Onze CTA: [wat we willen dat lezers doen]
Doelwoordaantal: [gebaseerd op concurrentieregemiddelde]
```

**4. Content schrijven of reviewen**
```
/copywriting

Schrijf [contenttype] op basis van deze briefing:
[plak briefing van hierboven]

Toon: [conversationeel / gezaghebbend / technisch]
Merkstem: [korte beschrijving — of plak merkrichtlijnen]
Moet bevatten: [specifieke punten, data of voorbeelden]
```

---

### SEO-optimalisatie (20-30 minuten, meerdere keren per week)

**5. On-page optimalisatie**
```
/seo-audit

Review dit concept voor publicatie:
[plak content]

Doeltrefwoord: [trefwoord]
Controleer: titeltag, metabeschrijving, H1, H2-structuur, interne links,
featured snippet-kans, alt-tekst afbeeldingen, schema-markup.
Geef me een publicatiechecklist: wat is goed, wat te repareren.
```

---

### Sociale planning (15-30 minuten, dagelijks of wekelijks gebundeld)

**6. Gepubliceerde content herpubliceren**
```
/social-media-manager

Ik heb zojuist gepubliceerd: [URL of plak content]

Maak:
- 3 LinkedIn-posts (alleen tekst, carrouselconcept en een poll)
- 5 X/Twitter-posts (inclusief een thread en 4 zelfstandige)
- 1 Instagram-bijschrift
- 1 short-form videoscript (60 seconden)

Herpubliceer het kernidee voor het native formaat van elk platform.
Kopieer niet zomaar de blogintro — haal het meest deelbare enkelvoudige idee uit elke sectie.
```

---

### Performancerapportage (30-60 minuten, wekelijks)

**7. Wekelijks contentrapport**
```
/content-strategy

Wekelijkse performancereview:
- Deze week gepubliceerd: [lijst]
- Best presterende content (sessies, tijd op pagina, conversies): [data]
- Nieuwsbriefstatistieken: [verzendingen, openingsratio, CTR]
- Sociale statistieken: [impressies, betrokkenheid, volgersdelta]

Vat samen: wat werkte, wat niet en wat ik volgende week meer van moet produceren.
Maak een 1-pagina rapport dat ik met mijn manager kan delen.
```

---

## Maandelijkse planningsworkflow

### Einde van de maand: plan de kalender van volgende maand (60-90 minuten)

**Stap 1 — Review vorige maand**
```
/content-strategy

Content-audit van vorige maand:
- Welke stukken leverden het meeste organische verkeer op?
- Welke leverden de meeste leads/conversies op?
- Welke hadden de hoogste betrokkenheid op sociale media?
- Content die onderpresteerde ondanks hoge inspanning?

Geef me: verdubbel-lijst (meer content zoals dit), stop-lijst (stop dit formaat) en 3 nieuwe ideeën op basis van wat werkte.
```

**Stap 2 — Bouw de kalender voor volgende maand**
```
/editorial-calendar

Bouw de redactionele kalender voor [volgende maand].

Merk: [bedrijfsnaam + één regel beschrijving]
Doelgroep: [ICP-beschrijving]
Doel: [verkeer / leads / merk]
Kanalen: [blog / nieuwsbrief / LinkedIn / X]
Publicatiecadans: [X/week blog, dagelijks LinkedIn, wekelijkse nieuwsbrief]
Huidig top trefwoordcluster: [hoofd onderwerpsgebied]
```

**Stap 3 — Brief elk stuk**
```
/content-brief

[Voer uit voor elk gepland stuk in de kalender]
```

---

## 30-daags inwerklist (nieuwe content marketeers)

### Week 1 — Controleer en begrijp
- Installeer alle marketing-skills: `npx claudient add skills marketing`
- Voer `/seo-audit` uit op je hele site — weet wat je hebt voordat je meer publiceert
- Voer `/competitive-analyst` uit op je top 3 concurrenten — waar schrijven zij over dat jij niet doet?
- Controleer je e-maillijst: openingsratio's, klikratio's, uitschrijvingen — welke content presteert?
- Breng je onderwerpsclusters in kaart: gebruik `/content-strategy` om je 3 pijlers te definiëren

### Week 2 — Systeem opzetten
- Bouw je eerste redactionele kalender met `/editorial-calendar`
- Maak briefingssjablonen voor je 3 meest voorkomende contenttypes
- Stel je distributiechecklist in (elke post = 5-kanaaldistributie)
- Definieer je interne linkkaart: welke 10 stukken zijn je cornerstone content?

### Week 3 — Productielancering
- Brief en produceer je eerste 4 stukken met `/content-brief` + `/copywriting`
- Gebruik `/social-media-manager` om elk stuk over kanalen te herpubliceren
- Stel je wekelijkse e-mail in met `/email-sequence`
- Publiceer, distribueer, volg resultaten

### Week 4 — Analyseer en optimaliseer
- Voer `/seo-audit` uit — wat is verbeterd? Welke nieuwe kansen zijn er?
- Identificeer je best presterende stuk en gebruik `/content-brief` om 3 vergelijkbare te produceren
- Stel maandelijks analyticsrapportagesjabloon in
- Presenteer je eerste maandelijkse contentstrategie-rapport

---

## Tool-integraties

### Ahrefs / Semrush

```
Plak trefwoorddata direct in Claude:
1. Exporteer trefwoordrapport uit Ahrefs → Kopieer de top 100 rijen
2. /seo-audit: plak de data en vraag om geprioriteerde kanselijst
3. Gebruik /content-brief met de geïdentificeerde trefwoorden

Voor concurrent content-gap:
1. Voer "Content Gap"-rapport uit in Ahrefs tegen top 3 concurrenten
2. Plak de gaptrefwoorden in /editorial-calendar
3. Koppel trefwoorden aan onderwerpsclusters en bouw de kalender
```

### Google Search Console

```bash
# Verbind GSC-data met Claude via MCP
# Voeg toe aan ~/.claude/settings.json:
{
  "mcpServers": {
    "google-search-console": {
      "command": "npx",
      "args": ["-y", "@anthropic/gsc-mcp"],
      "env": {
        "GSC_CREDENTIALS": "path/to/credentials.json",
        "GSC_SITE_URL": "https://yourdomain.com"
      }
    }
  }
}
```

Hiermee kan Claude:
- Je topquery's en -pagina's direct ophalen
- Trefwoorden identificeren die rangschikken op positie 11-20 (snelle winst-optimalisatiedoelen)
- Impressies vs. klikken bijhouden om CTR-kansen te vinden
- Rankingdalingen in je content monitoren

### HubSpot / Marketo (contentattributie)

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

Hiermee:
- Vraag Claude welke blogposts de meeste contactconversies genereren
- Identificeer welke content je beste leads consumeerden voor ze converteerden
- Bouw UTM-getrackte distributieplannen gekoppeld aan dealinvloed

### Notion / Airtable (redactionele kalender)

```
Exporteer je contentkalender uit Notion of Airtable als CSV of markdown.
Plak in Claude met:
"/editorial-calendar — hier is mijn huidige kalender. Identificeer hiaten in onderwerpdekking,
over-indexering op één contenttype en stukken die een prioriteitsvernieuwing nodig hebben."
```

### n8n / Make (automatisering)

```
Automatiseer de contentproductielus:
- Nieuw Ahrefs-trefwoordalert → /content-brief automatisch gegenereerd → Notion-pagina aangemaakt
- Gepubliceerde blogpost → /social-media-manager → posts gepland in Buffer/Hootsuite
- E-mail verzonden → openingsratio onder drempel → /email-sequence → onderwerpregelsvarianten gegenereerd
- Maandelijks: Google Analytics-rapport → /content-strategy → maandelijks reviewdocument aangemaakt
```

---

## Te volgen benchmarks

Haal deze wekelijks op uit Google Analytics, GSC en je e-mailplatform:

| Metric | Vroege fase | Groeifase | Volwassen |
|---|---|---|---|
| Organische sessies/maand | 1.000 | 10.000 | 50.000+ |
| MoM organische groei | >10% | 5-10% | 2-5% |
| Gepubliceerde stukken/maand | 8 | 16 | 25+ |
| E-mail openingsratio | >25% | >30% | >35% |
| E-mail CTR | >2% | >3% | >4% |
| Sociale betrokkenheidsratio (LinkedIn) | >2% | >3% | >4% |
| Content-gerelateerde leads/maand | 5 | 25 | 100+ |
| Tijd per contentbriefing | <30 min | <15 min | <10 min |

---

## Veelgemaakte fouten (en hoe Claude Code helpt ze te vermijden)

**Fout 1: Schrijven zonder een briefing**
`/content-brief` duurt 5 minuten. Het overslaan kost je 3 uur aan herschrijven als het stuk de intentie mist.

**Fout 2: Content produceren zonder distributieplan**
`/editorial-calendar` bouwt het distributieplan in de kalender. Elk stuk heeft een 5-kanaalplan voor het wordt geschreven.

**Fout 3: Publiceren zonder interne links**
`/content-brief` brengt interne links in kaart als onderdeel van de briefing. Geen weesinhadcontent meer.

**Fout 4: Contentverval negeren**
`/seo-audit` toont pagina's die rangschikten maar zijn gedaald. Vernieuwen is beter dan nieuwe content publiceren voor gevestigde sites.

**Fout 5: Sociale posts die alleen de link delen**
`/social-media-manager` herschrijft content als platform-native posts. LinkedIn-carrousels, Twitter-threads, Instagram-bijschriften — allemaal uniek ten opzichte van de blog.

---

## Bronnen

- [Aan de slag met Claude Code](../getting-started.md)
- [Content creatie workflow](../workflows/content-creation.md)
- [SEO audit skill](../skills/marketing/seo-audit.md)
- [Content brief skill](../skills/marketing/content-brief.md)
- [Editorial calendar skill](../skills/marketing/editorial-calendar.md)
- [Email sequence skill](../skills/marketing/email-sequence.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
