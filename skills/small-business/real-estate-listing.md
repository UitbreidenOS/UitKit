---
name: real-estate-listing
description: "Real estate agent toolkit: MLS listing descriptions, CMA summaries, showing follow-up emails, buyer nurture sequences, and social media posts — all Fair Housing compliant"
updated: 2026-06-13
---

# Real Estate Listing

## When to activate
- A new listing is coming to market and you need MLS copy plus marketing materials
- You are presenting a CMA to a seller and need a clean written narrative to accompany the numbers
- A showing happened and you need a personalized follow-up email drafted quickly
- A lead has gone quiet and you need a re-engagement message that does not feel pushy

## When NOT to use
- Contract or legal document drafting — use your broker-approved forms and a real estate attorney
- Automated lead scoring or CRM workflow — use your CRM's built-in tools for that
- Property valuations you will represent as formal appraisals — only licensed appraisers can produce those

## Instructions

### MLS listing descriptions

Give Claude:
- Address and basic facts: beds, baths, square footage, lot size, year built, garage
- The top 5 features you want to highlight (be specific — "original hardwood floors refinished in 2023" beats "nice floors")
- Neighborhood context: what makes the location valuable without referencing schools, demographics, or proximity to religious institutions
- Your price and target buyer profile (describe in terms of lifestyle or life stage, not protected class characteristics)
- Character limit for your MLS system, if applicable

Claude writes two versions: a character-limited MLS description (typically 250-500 characters or 150-250 words depending on your MLS) and expanded marketing copy for your website, email, and social media.

Fair Housing compliance: Claude will not include language that implies preference for or against buyers or renters based on race, color, national origin, religion, sex, familial status, or disability. This includes indirect language — mentioning proximity to specific religious institutions, describing neighborhood demographics, or using school names in ways that signal buyer profile. Claude will replace any such language with compliant alternatives. You are always responsible for final review before publishing.

---

### CMA narrative

Paste your comparable sales data: for each comp, include address (or anonymized as "Comp 1"), square footage, sale price, days on market, list price, and sale date.

Tell Claude:
- The subject property's key facts
- Any adjustments you've made (condition, updates, lot premium, etc.)
- Your recommended list price range

Claude writes a 3-paragraph CMA narrative ready to present to a seller:
- Paragraph 1: What's happening in the market right now (absorption rate, price trend)
- Paragraph 2: What the comparable sales tell us, with your adjustment rationale
- Paragraph 3: Your recommended price range and the reasoning

The narrative is professional and plain-language — designed to be read aloud or left with the seller as a takeaway.

---

### Showing follow-ups

After a showing, tell Claude:
- Buyer profile: first-time buyer, move-up buyer, investor, or downsizing — and their timeline
- What they said they liked about the property
- What they said they were concerned about or unsure of
- Whether they've seen other properties competing with this one

Claude drafts a personalized email that:
- Opens by referencing something specific they said during the showing
- Addresses one of their concerns directly with a fact or resource
- Provides one piece of relevant market context (if useful)
- Proposes a soft next step — not "are you ready to make an offer?" but something lower-friction like "I can pull the HOA documents if you'd like to review them"

For buyers who stop responding: Claude drafts a check-in message that acknowledges their timeline, offers something useful, and does not pressure.

---

### Lead nurturing sequences

For buyers who are 3-6 months out from purchasing, a 4-touch email sequence keeps you relevant without being intrusive.

Tell Claude: buyer profile, price range, property type, desired area, and their stated timeline.

Claude builds:
- Touch 1 (week 1): A market update relevant to their specific search — not a generic newsletter
- Touch 2 (week 3): A relevant new listing or recently sold property with a note about what it tells them
- Touch 3 (week 6): An educational piece — one specific thing about the buying process in your market that affects their situation
- Touch 4 (week 10): A soft re-engagement — "Just checking in on your timeline, no pressure" — with one fresh piece of information

---

### Social media

Tell Claude: the property's top 3 features, target buyer lifestyle, your personal brand tone (professional, warm, energetic, local-expert), and which platform.

Claude writes platform-appropriate posts:
- Instagram: visual-first caption, hooks in the first line, location hashtags, ends with a question or CTA
- Facebook: slightly longer, community-focused framing, works with or without the character pressure of Instagram
- LinkedIn: used for investment properties or commercial listings — professional, ROI-oriented framing

---

### Prompt template — MLS description

```
Please write an MLS listing description. Fair Housing compliant.

Property facts:
- Address: [city and state only, or omit]
- Beds/baths: [X] bed / [X] bath
- Square footage: [X] sq ft, lot [X] sq ft
- Year built: [X]
- Garage: [yes/no, attached/detached, spaces]

Top features to highlight:
1. [specific feature + any relevant detail]
2. [specific feature]
3. [specific feature]
4. [specific feature]
5. [specific feature]

Neighborhood notes (no schools, no demographics, no religious institutions):
[walkable, near shops, quiet street, mountain views, etc.]

Price: $[X]
Target buyer lifestyle: [describe in lifestyle terms — e.g., "buyers looking for a lock-and-leave home near downtown dining"]
MLS character limit: [X words or characters, or "no limit"]

Please write:
1. MLS-compliant short description ([X] words)
2. Expanded marketing copy for website (300-400 words)
```

## Example

You say: "3BR/2BA craftsman bungalow in Oak Park, 1,850 sq ft, fully updated kitchen with quartz counters and new appliances in 2024, original 1928 character details, detached garage, walkable neighborhood with coffee shops and boutiques within two blocks, $485K, targeting buyers who want character and walkability over a cookie-cutter suburb."

Claude writes the MLS description and the expanded marketing copy. It includes "two blocks from local coffee shops and boutiques" and "walkable neighborhood" and excludes any mention of the nearby elementary school (which you had mentioned in passing). Claude flags this in a note: "I removed the school reference for Fair Housing compliance — replaced with 'walkable neighborhood with local shops' to keep the lifestyle context without implying buyer profile."

The MLS description: 148 words. The expanded version: 340 words with a headline, three feature-benefit callouts, and a neighborhood paragraph.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
