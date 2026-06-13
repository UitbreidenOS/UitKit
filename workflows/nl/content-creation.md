# Content Creation Workflow

Een herhaalbare end-to-end workflow voor het onderzoeken, briefen, schrijven, optimaliseren en distribueren van een stuk content — van zoekwoord tot gepubliceerde post met volledige distributie.

Deze workflow is ontworpen voor een contentmarketeer die alleen of met een klein team werkt. Gebruik hem voor blogposts, gidsen en long-form content. Pas hem aan voor andere formaten.

---

## Overzicht

```
Keyword research → Competitor analysis → Content brief → Draft → SEO review → Publish → Distribute → Measure
```

Totale doorlooptijd per stuk:
- Alleen brief: 30-45 minuten
- Brief + concept: 90-120 minuten (met Claude als schrijver)
- Brief + menselijke schrijver: 3-5 dagen (met redactie)
- Distributie: 30-45 minuten na publicatie

---

## Stap 1 — Zoekwoordonderzoek en kansenidentificatie

**Doel:** Bevestig dat het zoekwoord de moeite waard is om op te targeten vóór je investeert in een brief.

**Invoer:** Onderwerpidee, doelgroep, bedrijfsdoelstellingen.

```
/seo-audit

Keyword research for: [topic idea]

Give me:
1. Primary keyword — best single target for this topic (volume + difficulty)
2. 5-8 secondary keywords (related, lower difficulty)
3. 3-5 question keywords ("People Also Ask" targets)
4. Search intent: what does someone searching this keyword want to accomplish?
5. Content format that currently ranks: listicle / how-to / opinion / guide / comparison
6. Is there a featured snippet? What format?
7. Traffic potential if we rank position 1: [estimated monthly sessions]
8. Verdict: worth writing or skip?
```

**Beslissingspoort:**
- Verkeerspotentieel < 100 sessies/maand: alleen schrijven bij hoge commerciële intentie of merkwaarde
- Zoekwoordmoeilijkheid > 70 EN DA < 40: zal waarschijnlijk niet ranken; heroverweeg of bouw eerst meer autoriteit op
- Mismatch in zoekintentie: als wat rankt niet overeenkomt met wat je wilt schrijven, heroverweeg het zoekwoord

---

## Stap 2 — Concurrentenanalyse

**Doel:** Begrijp waartegen je concurreert en vind de kloof.

**Invoer:** Primair zoekwoord, top 3-5 rankende URL's.

```
/content-brief

Run competitor analysis for: [primary keyword]

Top ranking URLs:
1. [URL]
2. [URL]
3. [URL]

For each URL:
- Word count and content depth
- Structure (H2s they use)
- What they do well (match or exceed)
- What they miss (your gap)
- Unique angles, data, or examples they use

Output:
- Differentiation matrix: 3 angles none of the top 3 cover
- Recommended word count to outperform the average
- One thing we should own in this piece
```

**Uitvoer:** Een duidelijke invalshoek die dit stuk de moeite waard maakt om te lezen ten opzichte van wat al rankt.

---

## Stap 3 — De contentbrief schrijven

**Doel:** Een brief zo gedetailleerd dat een schrijver (mens of Claude) op de eerste poging een publiceerbaar eerste concept produceert.

```
/content-brief

Generate a full content brief.

Target keyword: [keyword]
Secondary keywords: [list from Step 1]
Target audience: [specific person — job title, problem, awareness stage]
Content type: [how-to / listicle / comparison / guide]
Target word count: [from Step 2 competitor analysis]
Competing URLs to beat: [top 3]
Business CTA: [what we want the reader to do]
Tone: [brand voice]

Include:
- Full H2/H3 outline with word count targets per section
- Featured snippet targeting section
- Internal link plan (links from this piece + pages to update to link here)
- Meta title, description, URL slug
- On-page SEO checklist
- Writer notes for each section
```

**Uitvoer:** Een volledig briefdocument. Sla op in je contentkalendersysteem (Notion, Airtable, Google Sheets).

---

## Stap 4 — Het concept schrijven

### Optie A — AI-ondersteund concept

```
/copywriting

Write this content based on the brief below.

[Paste complete brief from Step 3]

Guidelines:
- Open with a hook (stat, question, or bold claim) — not "In this article"
- Use the target keyword naturally in the first 100 words
- Follow the outline exactly — don't invent new sections
- Every section: specific, actionable, with a real example where indicated in the brief
- Conclusion: summarise 3 key takeaways, include the CTA
- Tone: [brand voice description]
```

**Controleer daarna:**
- Komt het overeen met de brief?
- Is de opening sterk genoeg om lezers voorbij de eerste 200 woorden te houden?
- Zijn er specifieke voorbeelden of datapunten, of is het algemeen advies?
- Beantwoordt de featured snippet-sectie de zoekopdracht direct in 40-60 woorden?

### Optie B — Menselijke schrijver met de brief

Stuur de brief naar je schrijver met deze instructies:
1. Lees de top 3 concurrerende URL's vóór het schrijven — begrijp wat je moet overtreffen
2. Elke sectie moet een echt voorbeeld bevatten — geen abstracte adviezen
3. Geen "In dit artikel gaan we" openingen
4. Lever op: concepttekst + alle afbeeldingsplaatshouders gelabeld + metadatasuggesties

**Redactionele reviewchecklist:**
- [ ] Controleer alle statistieken op feiten — komen ze uit gezaghebbende bronnen, geen secundaire citaten?
- [ ] Staat het primaire zoekwoord in de eerste 100 woorden?
- [ ] Verdiept elke H2 het begrip van de lezer — geen opvullende secties?
- [ ] Zijn er minimaal 3 interne links naar bestaande content?
- [ ] Is de CTA duidelijk en relevant voor de content?

---

## Stap 5 — SEO-review vóór publicatie

**Doel:** Alles opvangen vóór publicatie — het is 10x moeilijker te herstellen na indexering.

```
/seo-audit

Review this draft before publishing:

[Paste full draft]

Primary keyword: [keyword]

Check and give me a publish checklist:
1. Title tag: keyword present, under 60 characters, compelling
2. Meta description: keyword, 155 chars, value proposition
3. H1: keyword, different wording from title tag
4. H2s: primary keyword in at least one, secondary keywords distributed
5. First 100 words: primary keyword present
6. Featured snippet: is there a direct answer to the query in 40-60 words?
7. Internal links: 3-5 to existing content with descriptive anchor text
8. Images: all have descriptive alt text
9. Schema opportunity: FAQ, HowTo, or Article schema
10. URL slug: short, keyword-containing, no stop words

Output: green (ready to publish) / amber (small fixes) / red (rewrite needed)
```

---

## Stap 6 — Publiceren

**CMS-publicatiechecklist:**

```
Before hitting publish:
- [ ] Title tag and meta description entered in SEO plugin (Yoast, RankMath, or equivalent)
- [ ] URL slug confirmed (no automatic /date/ or /category/ prefixes you don't want)
- [ ] Featured image uploaded with descriptive alt text and file name
- [ ] Canonical URL set (especially for content also published elsewhere)
- [ ] No-index is NOT checked (a common mistake)
- [ ] Internal links confirmed live (click through all links)
- [ ] Schema markup added if applicable
- [ ] Publish date set correctly
- [ ] Author set correctly
- [ ] Category and tags applied (consistent with your taxonomy)
```

**Direct na publicatie:**
- Dien de URL in bij Google Search Console voor indexering
- Werk bestaande pagina's bij die naar dit nieuwe stuk moeten linken (uit je interne linkplan)
- Noteer de publicatiedatum in je contentkalender

---

## Stap 7 — Distributie

**Doel:** Het stuk binnen 48 uur na publicatie onder de aandacht brengen van je publiek op elk relevant kanaal.

### Binnen 2 uur na publicatie

```
/social-media-manager

I just published: [URL]
Title: [title]
Core insight: [the most shareable idea in the piece — 1 sentence]
Audience: [who reads this]

Create:
1. LinkedIn post — native text post (not link preview) — lead with the insight, link in comments
2. X/Twitter thread — 5-7 tweets unpacking the key points
3. LinkedIn carousel concept — 5-7 slide outline with talking points

Keep each format native to the platform — don't just share the link.
```

### Binnen 24 uur

- Stuur naar je e-mailnieuwsbrief (als uitgelicht verhaal of P.S.)
- Post in 1-3 relevante communities (LinkedIn-groepen, Slack-communities, Reddit-subreddits) waar het waarde toevoegt — niet alleen zelfpromotie
- Informeer iedereen die geciteerd, vermeld of wiens gegevens je hebt gebruikt — vraag hen te delen als ze het nuttig vinden

### Binnen 48 uur

- Zet het belangrijkste inzicht om in een kort videoscript (60 seconden) voor TikTok/Instagram/YouTube Shorts
- Pin op relevante sociale profielen als het een hoeksteen-stuk is
- Voeg toe aan je leadmagneet of welkomst-e-mailsequentie als het een waardevolle gids is
- Syndiceer naar Medium, Substack Notes of LinkedIn Articles (met canonicaltag die wijst naar het origineel)

---

## Stap 8 — Meting na 30 dagen

**Doel:** Weet of dit stuk werkt — en wat je eraan moet doen.

Na 7 dagen:
```
/seo-audit

This piece was published 7 days ago: [URL]
GSC data: [impressions, clicks, average position if available]
Sessions from other sources: [social, email, direct]

Assessment: Is this piece getting any traction? Should I amplify with paid social
or build links to it?
```

Na 30 dagen:
```
/seo-audit

30-day review for: [URL]
Traffic to date: [sessions]
Rankings: [position for primary keyword, secondary keywords]
Conversions: [email signups, demo requests, etc.]

Is this piece performing as expected?
- If ranking page 1-3: great — now optimise for CTR (title/meta)
- If ranking page 4-10: update the piece, add internal links, consider link building
- If not ranking at all: was the keyword too competitive? Does the piece match intent?

Next action recommendation:
```

---

## Volledige workflow-checklist (kopieer dit voor elk stuk)

```markdown
# Content Piece Checklist: [TITLE]

**Keyword:** [primary keyword]
**Assigned to:** [writer]
**Target publish date:** [date]

## Research
- [ ] Keyword confirmed (volume, difficulty, intent)
- [ ] Top 3 competitors reviewed
- [ ] Differentiation angle identified

## Brief
- [ ] Full brief written with /content-brief
- [ ] Outline approved
- [ ] Internal link plan documented
- [ ] Metadata drafted (title, description, slug)

## Draft
- [ ] First draft received
- [ ] Editorial review complete
- [ ] Fact-check complete
- [ ] SEO review passed with /seo-audit

## Publish
- [ ] All metadata entered in CMS
- [ ] Internal links live
- [ ] Schema markup added
- [ ] Submitted to GSC for indexing

## Distribute
- [ ] LinkedIn post published
- [ ] X/Twitter thread published
- [ ] Newsletter mention
- [ ] Communities posted
- [ ] Link-back pages updated

## Measure
- [ ] 7-day check
- [ ] 30-day check and optimisation decision
```

---
