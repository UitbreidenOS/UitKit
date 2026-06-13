---
name: restaurant-ops
description: "Restaurant operations: menu copy, food cost analysis, inventory forecasting, review responses, seasonal specials, hiring posts, and training documentation"
updated: 2026-06-13
---

# Restaurant Operations

## When to activate
- Writing or rewriting menu descriptions, naming a new special, or launching a seasonal menu
- Your food cost percentage is higher than expected and you need to find where the margin is leaking
- You have a stack of Google or Yelp reviews to respond to and want each response to feel personal
- Staffing up for a busy season and need job postings and a training document

## When NOT to use
- Full accounting or payroll — use your bookkeeper and payroll processor for that
- Health code or regulatory compliance documentation — consult your local health authority directly
- Lease negotiations or vendor contract review — use a lawyer

## Instructions

### Menu engineering

Tell Claude: the dish name, main ingredients, cooking method, price point, and your restaurant's vibe — upscale, casual, fast-casual, neighborhood diner, or similar.

Claude writes descriptions that sell. Specific, sensory, and accurate — not generic copy that could apply to any restaurant. "House-made pasta" becomes "hand-rolled rigatoni finished in a 30-minute Calabrian chili butter." The description earns the price.

For a full menu rewrite, paste your current menu text. Tell Claude the voice you want: warm and approachable, sophisticated and minimal, family-friendly, or a reference restaurant you admire. Claude rewrites the full menu in that voice while keeping every description accurate to the actual dish.

For seasonal specials: tell Claude the hero ingredient, the season, and your menu's price tier. Claude names the dish, writes the description, and suggests a price point that fits your existing menu architecture.

---

### Food cost analysis

For each dish, give Claude three numbers: the menu price, the cost of every ingredient in one serving (be specific — include oil, garnishes, sauce, and any protein exactly), and any per-plate variable cost (takeout container, napkins if relevant).

Claude calculates food cost percentage: cost divided by menu price. Target range for most categories:
- Proteins (meat, fish): 28-35%
- Pasta, grain dishes: 18-25%
- Desserts: 20-28%
- Beverages (non-alcohol): 15-22%
- Cocktails: 18-24%

Claude flags any dish above your threshold and suggests three options: raise the price, reduce the portion slightly, substitute one ingredient, or remove the dish. Claude does not suggest all three simultaneously — it ranks which approach fits the dish based on its menu role.

For weekly purchase review: paste your supplier invoices from the last two weeks. Claude identifies which ingredient costs have increased and which dishes are now above threshold as a result.

---

### Inventory forecasting

Tell Claude:
- Covers served per day over the last 4 weeks (or weekly totals)
- What dishes sold and in what volume (your POS can export this)
- Upcoming reservations or events this week
- Any holidays or local events that typically affect your volume

Claude estimates how much of each key ingredient to order for the week. It bases estimates on your actual per-cover usage, not generic benchmarks. It also flags items you have historically over-ordered (common with produce and fresh fish) and suggests ordering slightly less to reduce waste.

For event prep: tell Claude the event type, expected covers, and your planned menu. Claude produces an ingredient pull list with quantities.

---

### Review responses

Paste your reviews — positive and negative together. Tell Claude your restaurant's name and your general voice (warm and personal, professional, relaxed and casual).

For each review, Claude drafts a response. Negative reviews get: acknowledgment of the specific issue, no deflection or excuse, and one concrete resolution ("please reach out directly — we want to make this right"). The tone stays calm and professional even for unfair or hostile reviews.

Positive reviews get warm, specific responses. Claude reads what the reviewer praised and reflects it back — not a generic "Thank you for visiting!" copied nine times. Each response references something specific from that review.

You edit and personalize before posting. Claude handles the first draft; you add the human touch.

---

### Hiring posts

Tell Claude: the role, the key daily responsibilities, what makes your restaurant a good place to work (culture, schedule, team dynamic, benefits), and the wage range.

Claude writes a job posting that describes the actual job clearly and honestly. It does not use hollow phrases like "passionate about hospitality" or "team player" without substance. It tells applicants exactly what their days look like and why someone good would want to work there.

---

### Training documentation

Tell Claude: the role you're training (line cook, server, host, barista), the specific skill or process to document, and any house standards or preferences.

Claude produces a clear step-by-step training document written for someone new to your operation — not generic, but specific to what you tell it. Useful for onboarding and for standardizing execution across your team.

---

### Prompt template — food cost

```
Please analyze food cost for my dishes.

Restaurant type: [casual/upscale/fast-casual]
Food cost target: [X]%

Dish 1: [name]
- Menu price: $[X]
- Ingredient cost per plate: $[Y] (breakdown: protein $X, veg $X, sauce $X, starch $X, garnish $X)
- Monthly covers sold: [number]

Dish 2: [name]
- Menu price: $[X]
- Ingredient cost per plate: $[Y]

For each dish over my target: suggest the best single adjustment (price, portion, substitution, or remove).
```

## Example

You paste 12 Google reviews: 9 positive and 3 negative. You tell Claude your restaurant is a casual Italian spot with a warm, neighborhood voice.

Claude produces 12 draft responses.

The 3 negatives each get a specific, direct reply:
- A complaint about a 40-minute wait on Saturday: "Saturday evenings have been running longer than we want — we're sorry yours did. We've added a text notification when your table is ready. If you come back, ask for [manager name] and we'll take care of you."
- A complaint about a cold pasta dish: "That should not have left the kitchen that way. Please email us directly — we'd like to send you back properly."
- A complaint about noise: "We know Friday nights get loud — it's part of the energy, but we hear you. We've added some sound panels on the east wall this month and we're curious if you notice a difference."

The 9 positives each get a different response, each reflecting something specific that reviewer mentioned — the tiramisu, a particular server, a birthday dinner. None repeat the same opening line.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
