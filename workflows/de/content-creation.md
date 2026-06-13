# Content-Erstellungs-Workflow

Ein wiederholbarer End-to-End-Workflow zum Recherchieren, Briefen, Schreiben, Optimieren und Verbreiten eines Inhalts — vom Keyword bis zum veröffentlichten Beitrag mit vollständiger Distribution.

Dieser Workflow ist für einen Content-Marketer konzipiert, der allein oder mit einem kleinen Team arbeitet. Für Blogbeiträge, Guides und Long-Form-Content verwenden. Für andere Formate anpassen.

---

## Übersicht

```
Keyword research → Competitor analysis → Content brief → Draft → SEO review → Publish → Distribute → Measure
```

Gesamte verstrichene Zeit pro Stück:
- Nur Brief: 30–45 Minuten
- Brief + Entwurf: 90–120 Minuten (mit Claude als Autor)
- Brief + menschlicher Autor: 3–5 Tage (mit Redaktion)
- Distribution: 30–45 Minuten nach Veröffentlichung

---

## Schritt 1 — Keyword-Recherche und Chancenidentifikation

**Ziel:** Bestätigen, dass das Keyword es wert ist, angesteuert zu werden, bevor in einen Brief investiert wird.

**Eingaben:** Themenidee, Zielgruppe, Geschäftsziele.

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

**Entscheidungstor:**
- Traffic-Potenzial < 100 Sitzungen/Monat: nur schreiben bei hoher kommerzieller Absicht oder Markenwert
- Keyword-Schwierigkeit > 70 UND DA < 40: wird wahrscheinlich nicht ranken; neu überdenken oder zuerst mehr Autorität aufbauen
- Suchabsicht stimmt nicht überein: wenn das, was rankt, nicht zum gewünschten Inhalt passt, Keyword überdenken

---

## Schritt 2 — Wettbewerbsanalyse

**Ziel:** Verstehen, womit man es zu tun hat, und die Lücke finden.

**Eingaben:** Primäres Keyword, die 3–5 bestrangierten URLs.

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

**Ausgabe:** Ein klarer Blickwinkel, der diesen Inhalt lesenswerter macht als das, was bereits rankt.

---

## Schritt 3 — Den Content-Brief schreiben

**Ziel:** Ein Brief, der so detailliert ist, dass ein Autor (Mensch oder Claude) beim ersten Durchgang erstveröffentlichungsfähigen Content produziert.

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

**Ausgabe:** Ein vollständiges Brief-Dokument. Im Content-Kalender-System speichern (Notion, Airtable, Google Sheets).

---

## Schritt 4 — Den Content verfassen

### Option A — KI-unterstützter Entwurf

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

**Anschließend prüfen:**
- Entspricht es dem Brief?
- Ist die Eröffnung stark genug, um Leser über die ersten 200 Wörter hinaus zu halten?
- Gibt es spezifische Beispiele oder Datenpunkte, oder handelt es sich um generische Ratschläge?
- Beantwortet der Featured-Snippet-Abschnitt die Suchanfrage direkt in 40–60 Wörtern?

### Option B — Menschlicher Autor mit dem Brief

Den Brief mit diesen Anweisungen an den Autor senden:
1. Die 3 besten Konkurrenz-URLs vor dem Schreiben lesen — verstehen, was übertroffen werden muss
2. Jeder Abschnitt muss ein echtes Beispiel enthalten — keine abstrakten Ratschläge
3. Keine Eröffnungen mit „In diesem Artikel werden wir"
4. Liefern mit: Entwurfstext + alle Bild-Platzhalter beschriftet + Metadaten-Vorschläge

**Redaktionelle Prüf-Checkliste:**
- [ ] Alle Statistiken faktenprüfen — stammen sie aus autoritativen Quellen, nicht aus sekundären Zitaten?
- [ ] Ist das primäre Keyword in den ersten 100 Wörtern?
- [ ] Vertieft jede H2 das Verständnis des Lesers — keine Füllabschnitte?
- [ ] Gibt es mindestens 3 interne Links zu vorhandenen Inhalten?
- [ ] Ist der CTA klar und für den Inhalt relevant?

---

## Schritt 5 — SEO-Überprüfung vor der Veröffentlichung

**Ziel:** Alles vor der Veröffentlichung abfangen — nach der Indexierung ist es 10-mal schwerer zu beheben.

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

## Schritt 6 — Veröffentlichen

**CMS-Veröffentlichungs-Checkliste:**

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

**Unmittelbar nach der Veröffentlichung:**
- URL an Google Search Console zur Indexierung übermitteln
- Bestehende Seiten aktualisieren, die auf diesen neuen Inhalt verlinken sollen (aus dem internen Linkplan)
- Veröffentlichungsdatum im Content-Kalender notieren

---

## Schritt 7 — Distribution

**Ziel:** Den Inhalt innerhalb von 48 Stunden nach der Veröffentlichung auf jedem relevanten Kanal vor die Zielgruppe bringen.

### Innerhalb von 2 Stunden nach der Veröffentlichung

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

### Innerhalb von 24 Stunden

- An den E-Mail-Newsletter senden (entweder als Hauptartikel oder P.S.)
- In 1–3 relevante Communities posten (LinkedIn-Gruppen, Slack-Communities, Reddit-Subreddits), wo es einen Mehrwert bietet — nicht nur Eigenwerbung
- Alle Zitierten, Erwähnten oder Personen, deren Daten verwendet wurden, benachrichtigen — um Teilen bitten, wenn sie es nützlich finden

### Innerhalb von 48 Stunden

- Den Hauptgedanken in ein Kurzfilm-Skript (60 Sekunden) für TikTok/Instagram/YouTube Shorts umwandeln
- Auf relevanten Social-Profilen anpinnen, wenn es ein Kernartikel ist
- Zum Lead-Magnet oder der Willkommens-E-Mail-Sequenz hinzufügen, wenn es ein hochwertiger Guide ist
- Auf Medium, Substack Notes oder LinkedIn Articles syndizieren (mit kanonischem Tag, der auf das Original verweist)

---

## Schritt 8 — 30-Tage-Messung

**Ziel:** Wissen, ob dieser Inhalt funktioniert — und was dagegen zu tun ist.

Nach 7 Tagen:
```
/seo-audit

This piece was published 7 days ago: [URL]
GSC data: [impressions, clicks, average position if available]
Sessions from other sources: [social, email, direct]

Assessment: Is this piece getting any traction? Should I amplify with paid social
or build links to it?
```

Nach 30 Tagen:
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

## Vollständige Workflow-Checkliste (für jedes Stück kopieren)

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
