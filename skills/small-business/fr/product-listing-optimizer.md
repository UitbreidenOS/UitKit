---
name: product-listing-optimizer
description: "Optimiser les fiches produit pour le référencement et la conversion : titre, points clés, description, contenu A+, brief images"
---

# Compétence Optimiseur de Fiches Produit

## Quand activer
- Lancement d'un nouveau produit sur Amazon, Shopify, Etsy, eBay ou d'autres places de marché
- Une fiche existante a un faible taux de conversion, un taux de rebond élevé ou un mauvais classement en recherche
- Préparation de fiches saisonnières (T4, Prime Day, Black Friday) pour des performances maximales
- Réécriture de fiches héritées qui ont été rédigées sans intention SEO ou CRO
- Construction de contenu A+ / Enhanced Brand Content pour une marque Amazon
- Création d'un brief pour un photographe de produit afin que les images soutiennent le texte

## Quand NE PAS utiliser
- Optimisation en masse de 500+ SKUs en une seule fois — décomposez en lots de 20-30, priorisez par chiffre d'affaires
- Produits numériques/de service — la structure des fiches diffère significativement
- Produits de catalogue B2B où votre acheteur est un service des achats et non un consommateur
- Quand vous n'avez pas encore le produit en main — le texte sans connaissance du produit produit du remplissage générique

## Instructions

### Invite d'optimisation complète de fiche

```
Optimise this product listing for [MARKETPLACE — Amazon / Shopify / Etsy / eBay / other].

Product: [product name]
Category: [main category and subcategory]
Price point: [$X]
Target customer: [who buys this — demographics, intent, pain point solved]
Key features: [list the most important product specs and features]
Main competitors (if known): [names or ASIN/URLs]
Keywords I want to rank for: [if you have research — or ask Claude to suggest]
Current listing performance (if any): [conversion rate, click rate, ranking position]
Top customer complaints on competitor reviews: [what buyers hate about similar products]

Produce:

## 1. Primary keyword research
Top 5-10 keywords to target by search volume + intent:
- Short-tail (1-2 words): [for impressions and brand awareness]
- Mid-tail (2-3 words): [for ranking and relevance]
- Long-tail (3+ words): [for conversion — specific buyer intent]

## 2. Optimised product title
Amazon format: [Brand] + [Product Type] + [Key Feature] + [Size/Colour/Model] + [Benefit]
Shopify format: [Product Type] + [Key Differentiator] — [Brand]
Rules: primary keyword in first 60 chars, under 200 chars total, no keyword stuffing

## 3. Five bullet points
Each bullet:
- Leads with ALL-CAPS benefit label (not feature)
- Feature supporting the benefit (1 sentence)
- Social proof or spec that proves it
- 150-250 characters per bullet

Structure:
BULLET 1: Main problem solved / headline benefit
BULLET 2: Key differentiating feature
BULLET 3: Quality / materials / certifications
BULLET 4: Compatibility or versatility
BULLET 5: Guarantee / customer promise / what's in the box

## 4. Product description (HTML-formatted for marketplace)
Structure:
- Hook paragraph: problem → solution in 2-3 sentences
- Feature block: 3-4 key features with short descriptions
- Use case section: 2-3 specific use cases/scenarios
- Social proof: reviews reference or results claim
- Close: CTA or guarantee

## 5. Backend keywords (Amazon) / meta description (Shopify)
- Amazon: 250-byte string of relevant keywords NOT in title/bullets
- Shopify: 155-char meta description with primary keyword near the front

## 6. A+ Content / Enhanced Brand Content outline
If brand-registered on Amazon or using Shopify sections:
- Module 1: Brand story or hero image with tagline
- Module 2: Feature breakdown with icons/images (3-4 features)
- Module 3: Comparison chart (your product vs. category standard)
- Module 4: Use case lifestyle imagery with copy
- Module 5: FAQ or testimonial block

## 7. Image brief
6-7 image slots with direction for each:
Image 1 (Main): [white background, product front, primary keyword visible if apparel]
Image 2 (Lifestyle): [product in use — show the customer, not just the product]
Image 3 (Feature callout): [annotated diagram with 3-4 key features labelled]
Image 4 (Benefit): [before/after or result — show the outcome the product delivers]
Image 5 (Scale/Size): [next to a familiar object or on a person for scale]
Image 6 (Social proof): [review stars, "bestseller" badge, media mentions if applicable]
Image 7 (What's in the box): [all components, clean white background]
```

### Invite de recherche de mots-clés

```
Research keywords for [PRODUCT] on [MARKETPLACE].

Seed keywords: [2-3 terms that describe the product]
Competitor ASINs or URLs: [optional — to mine their keywords]

Find and rank:
1. High-volume broad terms (> 10k searches/month) — brand awareness, harder to rank
2. Mid-volume conversion terms (1k-10k/month) — balance of volume and intent
3. Long-tail buyer-intent terms (< 1k/month) — easier to rank, higher CVR

For each keyword:
- Estimated search volume (use realistic estimates)
- Competition level (high / medium / low)
- Buyer intent signal (informational vs. transactional)
- Where to place it (title / bullet / description / backend)

Output as a prioritised table: Keyword | Volume | Competition | Intent | Placement
```

### Moteur de réécriture des points clés

```
Rewrite these bullet points for better conversion.

Current bullets:
[paste existing bullets]

Product: [describe briefly]
Target customer: [who they are and what they care about]
Top 3 customer objections: [what holds buyers back]

Rules for rewrite:
- Lead with the BENEFIT (what the customer gains), not the feature (what the product has)
- Each bullet must contain: benefit label + supporting feature + proof element
- No generic language ("high quality", "easy to use", "perfect for all occasions")
- Address at least one objection implicitly per bullet
- Under 250 characters each

Produce: 5 rewritten bullets + 1-sentence explanation of what changed and why for each
```

### Analyse des lacunes concurrentielles

```
Analyse this competitor listing and find gaps I can exploit.

Competitor URL / ASIN: [link or paste listing content]
My product: [describe]

Find:
1. Keywords they're NOT targeting that I should (check their bullets + backend via tool)
2. Customer complaints in their reviews (1-3 stars) that my product solves
3. Features they highlight that I also have but under-communicate
4. Visual gaps — what lifestyle images or use cases are they missing?
5. Price anchoring opportunity — are they priced identically to me? How do I justify my price?

Produce:
- Keyword gap list (5-10 terms they miss)
- Top 3 buyer pain points from their negative reviews → how my listing should address them
- Differentiation angles I should emphasise
```

### Audit du taux de conversion

```
Audit this listing for conversion rate problems.

[Paste full listing: title, bullets, description, note current CVR if known]

My marketplace average CVR for this category: [X%]
My product CVR: [X%]
Price vs. category average: [above / at / below]

Check for:
1. Title: Is the primary keyword in the first 60 characters? Does it read naturally?
2. Bullets: Do they lead with benefits or features? Are they under 250 chars? Do they address objections?
3. Description: Is there a hook? Does it close with a CTA or guarantee?
4. Images: (based on alt text or your description) — are lifestyle and feature images present?
5. Price: Is there a visible anchor (was/now) or a quantity pack option to shift value perception?
6. Reviews: What's the star rating and review count? Social proof threshold: 4.0+, 50+ reviews
7. Q&A: Are the top 3 buyer questions answered in the listing body?

Score each element 1-5 and identify the top 2 highest-impact fixes.
```

### Rafraîchissement de fiche saisonnière

```
Refresh this product listing for [SEASON / EVENT — Q4 / Prime Day / Black Friday / Valentine's Day].

Current listing: [paste or describe]
Sale price (if applicable): [$X off / X% off]
Inventory available: [X units — helps set urgency messaging]
Key seasonal keywords: [e.g., "Christmas gift for dad", "stocking stuffer under $20"]

Changes to make:
1. Title: Add seasonal keyword without making it permanent-sounding
2. Bullet 1: Add seasonal gift angle or seasonal use case
3. Description: Add seasonal hook paragraph at the top
4. Backend keywords: Add seasonal terms that only apply during this window
5. Coupons/deals: Recommend pricing strategy (% off coupon, subscribe & save, bundle)

Note: flag which changes to revert after the seasonal window ends.
```

## Exemple

**Utilisateur :** Optimise ma fiche Amazon pour une bouteille d'eau isotherme en acier inoxydable. Elle fait 32 oz, maintient les boissons froides pendant 24 h, et possède un couvercle anti-fuite. Le principal concurrent est Hydro Flask. Prix : 28 $. Client cible : amateurs de plein air et sportifs.

**Résultat :**

```
## Primary Keywords
| Keyword | Volume | Intent | Placement |
|---|---|---|---|
| insulated water bottle | 180k/mo | High | Title |
| 32oz water bottle | 45k/mo | High | Title |
| stainless steel water bottle | 85k/mo | High | Title |
| leak proof water bottle | 22k/mo | Purchase | Bullet 1 |
| water bottle keeps cold 24 hours | 8k/mo | Purchase | Bullet 2 |
| hydro flask alternative | 5k/mo | Purchase | Backend |

## Optimised Title
[YourBrand] Insulated Water Bottle 32oz — Stainless Steel, Leak-Proof Lid, Keeps Cold 24 Hours — BPA-Free

## Bullets
LEAK-PROOF GUARANTEE: The triple-seal lid locks tight at any angle — no drips in your gym bag, trail pack, or car cup holder. Tested to [X PSI] internal pressure.

STAYS COLD 24 HOURS, HOT 12: Double-wall vacuum insulation keeps ice water cold through a full summer hike. No condensation on the outside, no sweating on your hands.

DURABLE STAINLESS STEEL, NOT PLASTIC: 18/8 food-grade stainless steel resists dents, rust, and odour — outlasts plastic alternatives by years. BPA-free, phthalate-free.

FITS YOUR LIFE: 32oz capacity powers through a full workout or trail. Fits most car cup holders. Wide-mouth opening takes standard ice cubes and cleaning brushes.

OUR PROMISE: If it leaks, dents, or disappoints in the first year — we replace it free, no questions asked. That's confidence in the build.

## Image Brief
Image 1: White background, bottle front-facing, brand logo visible
Image 2: Lifestyle — athlete pouring into mouth on a trail, visible sweat on face
Image 3: Feature callout — annotated diagram showing lid seal, vacuum layer, wide mouth
Image 4: Ice cubes visible through open lid, moisture-free exterior in 90°F setting
Image 5: Bottle in car cup holder + next to a laptop for scale
Image 6: "4.8 stars, 2,400+ reviews" overlay on lifestyle shot
Image 7: Bottle + lid + cleaning brush on white background
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
