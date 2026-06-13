# Flux de travail de création de contenu

Un flux de travail reproductible de bout en bout pour rechercher, rédiger, écrire, optimiser et distribuer un contenu — du mot-clé à l'article publié avec une distribution complète.

Ce flux de travail est conçu pour un responsable marketing de contenu travaillant seul ou avec une petite équipe. Utilisez-le pour des articles de blog, des guides et du contenu longue forme. Adaptez-le à d'autres formats.

---

## Vue d'ensemble

```
Keyword research → Competitor analysis → Content brief → Draft → SEO review → Publish → Distribute → Measure
```

Temps total écoulé par contenu :
- Brief uniquement : 30-45 minutes
- Brief + rédaction : 90-120 minutes (avec Claude pour la rédaction)
- Brief + rédacteur humain : 3-5 jours (avec révision éditoriale)
- Distribution : 30-45 minutes après la publication

---

## Étape 1 — Recherche de mots-clés et identification des opportunités

**Objectif :** Confirmer que le mot-clé mérite d'être ciblé avant d'investir dans un brief.

**Données d'entrée :** Idée de sujet, audience cible, objectifs commerciaux.

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

**Porte de décision :**
- Potentiel de trafic < 100 sessions/mois : à rédiger uniquement si forte intention commerciale ou valeur de marque
- Difficulté du mot-clé > 70 ET DA < 40 : peu de chances de se classer ; reconsidérer ou renforcer l'autorité d'abord
- Inadéquation de l'intention de recherche : si ce qui se classe ne correspond pas à ce que vous souhaitez rédiger, reconsidérez le mot-clé

---

## Étape 2 — Analyse des concurrents

**Objectif :** Comprendre ce à quoi vous faites face et trouver l'angle différenciateur.

**Données d'entrée :** Mot-clé principal, 3-5 URLs les mieux classées.

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

**Résultat :** Un angle clair qui rend ce contenu plus pertinent à lire que ce qui est déjà classé.

---

## Étape 3 — Rédiger le brief de contenu

**Objectif :** Un brief si détaillé qu'un rédacteur (humain ou Claude) produit un contenu publiable dès le premier passage.

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

**Résultat :** Un document de brief complet. À enregistrer dans votre système de calendrier éditorial (Notion, Airtable, Google Sheets).

---

## Étape 4 — Rédiger le contenu

### Option A — Brouillon assisté par IA

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

**Puis réviser :**
- Correspond-il au brief ?
- L'introduction est-elle suffisamment forte pour retenir les lecteurs au-delà des 200 premiers mots ?
- Y a-t-il des exemples ou des données spécifiques, ou s'agit-il de conseils génériques ?
- La section d'extrait vedette répond-elle directement à la requête en 40-60 mots ?

### Option B — Rédacteur humain avec le brief

Envoyez le brief à votre rédacteur avec ces instructions :
1. Lisez les 3 URLs concurrentes avant de rédiger — comprenez ce que vous devez surpasser
2. Chaque section doit comporter un exemple concret — pas de conseils abstraits
3. Pas d'introductions du type « Dans cet article, nous allons »
4. Livrer avec : texte du brouillon + tous les espaces réservés pour les images étiquetés + suggestions de métadonnées

**Liste de contrôle éditoriale :**
- [ ] Vérifier tous les chiffres — proviennent-ils de sources faisant autorité, et non de citations secondaires ?
- [ ] Le mot-clé principal figure-t-il dans les 100 premiers mots ?
- [ ] Chaque H2 fait-il avancer la compréhension du lecteur — aucune section de remplissage ?
- [ ] Y a-t-il au moins 3 liens internes vers du contenu existant ?
- [ ] Le CTA est-il clair et pertinent par rapport au contenu ?

---

## Étape 5 — Révision SEO avant publication

**Objectif :** Tout vérifier avant la publication — c'est 10 fois plus difficile à corriger après l'indexation.

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

## Étape 6 — Publication

**Liste de contrôle de publication CMS :**

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

**Immédiatement après la publication :**
- Soumettre l'URL à Google Search Console pour l'indexation
- Mettre à jour les pages existantes qui devraient pointer vers ce nouveau contenu (selon votre plan de liens internes)
- Noter la date de publication dans votre calendrier éditorial

---

## Étape 7 — Distribution

**Objectif :** Diffuser le contenu auprès de votre audience sur tous les canaux pertinents dans les 48 heures suivant la publication.

### Dans les 2 heures suivant la publication

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

### Dans les 24 heures

- Envoyer à votre newsletter par e-mail (soit comme article vedette, soit en P.S.)
- Publier dans 1-3 communautés pertinentes (groupes LinkedIn, communautés Slack, subreddits Reddit) où cela apporte de la valeur — pas seulement de l'autopromotion
- Notifier toute personne citée, mentionnée ou dont vous avez utilisé les données — demandez-leur de partager si cela leur semble utile

### Dans les 48 heures

- Convertir l'insight principal en script de vidéo courte (60 secondes) pour TikTok/Instagram/YouTube Shorts
- Épingler sur les profils sociaux pertinents s'il s'agit d'un contenu de référence
- Ajouter à votre lead magnet ou à votre séquence d'e-mails de bienvenue s'il s'agit d'un guide à forte valeur ajoutée
- Syndiquer sur Medium, Substack Notes ou LinkedIn Articles (avec une balise canonique pointant vers l'original)

---

## Étape 8 — Mesure à 30 jours

**Objectif :** Savoir si ce contenu fonctionne — et quoi en faire.

À 7 jours :
```
/seo-audit

This piece was published 7 days ago: [URL]
GSC data: [impressions, clicks, average position if available]
Sessions from other sources: [social, email, direct]

Assessment: Is this piece getting any traction? Should I amplify with paid social
or build links to it?
```

À 30 jours :
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

## Liste de contrôle complète du flux de travail (à copier pour chaque contenu)

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
