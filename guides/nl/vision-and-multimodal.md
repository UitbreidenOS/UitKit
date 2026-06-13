# Vision en Multimodal Workflows in Claude Code

Claude kan afbeeldingen, PDF's, screenshots, en diagrammen analyseren als first-class inputs naast tekst. Deze gids dekt hoe je visuele content in Claude Code krijgt, wat Claude kan extracten, en end-to-end workflows die vision met code generatie en automated fixes combineren.

---

## Wat Claude Kan Zien

Claude ondersteunt vier image formaten:

| Formaat | Opmerkingen |
|---|---|
| PNG | Lossless. Best voor screenshots, diagrammen, UI captures |
| JPEG / JPG | Lossy. Acceptabel voor foto's; vermijd voor text-heavy images |
| GIF | Statische frame alleen — Claude leest eerste frame, niet animatie |
| WebP | Ondersteund. Beide lossless en lossy varianten |

**PDF's** zijn verwerkt als afbeeldingen — elke pagina is gerenderd en geanalyseerd. Claude parseert niet PDF tekst streams; het leest wat zichtbaar op gerenderde pagina. Dit betekent het kan scanned PDF's, handgeschreven documenten, en gemengde content PDF's hetzelfde verwerken als afbeeldingen.

**Screenshots** zijn meest gebruikelijk multimodal input in Claude Code workflows. Ze vereisen geen format conversion — sleep van enig screenshot tool, of pipe van capture script.

Claude kan niet verwerken:
- Video bestanden (geen frame extractie, geen motion analyse)
- Real-time camera feeds
- Audio ingebed in media bestanden
- Animated GIF frames voorbij eerste

---

## Afbeeldingen Naar Claude Code Doorgeven

### Sleep en Drop in Terminal

In terminals die image rendering ondersteunen (iTerm2, Ghostty, Warp, Kitty), sleep image bestand van Finder direct in terminal window waar Claude loopt. Image is geattached aan huidge turn.

```
# macOS — sleep enig bestand van Finder in Claude Code terminal sessie
# Image verschijnt als attachment voordat je getypte bericht
```

### Plak van Clipboard

Claude Code leest clipboard images wanneer je plakt (`Cmd+V` op macOS, `Ctrl+V` op Linux). Na het nemen screenshot met `Cmd+Shift+4` (macOS selection screenshot) of `PrintScreen`, plak direct in Claude Code terminal. Image is vastgelegd van clipboard en geattached naar huidge bericht.

```bash
# Capture regio en plak in Claude
# macOS: Cmd+Shift+4 → selecteer regio → Cmd+V in Claude terminal
```

### Verwijs Bestand Path

Geef absolute bestand path in je bericht en Claude Code leest bestand:

```
Analyseer image op /tmp/error-screenshot.png. Wat is wortelcause fout getoond?
```

Dit werkt zonder sleep-and-drop in terminals die niet images rendeven — Claude Code leest bestand van disk wanneer gegeven path.

### Programmische Input via API

Bij direct Claude API aanroepen, images worden doorgegeven als structured content blokken. Twee bron types ondersteund:

**Base64 (inline):**
```json
{
  "role": "user",
  "content": [
    {
      "type": "image",
      "source": {
        "type": "base64",
        "media_type": "image/png",
        "data": "<base64-encoded-bytes>"
      }
    },
    {
      "type": "text",
      "text": "Welke UI componenten zijn zichtbaar in deze screenshot?"
    }
  ]
}
```

**URL (remote fetch):**
```json
{
  "role": "user",
  "content": [
    {
      "type": "image",
      "source": {
        "type": "url",
        "url": "https://example.com/diagram.png"
      }
    },
    {
      "type": "text",
      "text": "Converteer dit architectuur diagram naar Terraform."
    }
  ]
}
```

Gebruik base64 voor images niet openbaar toegankelijk (lokale bestanden, interne screenshots, CI artefacten). Gebruik URL bron voor images al gehost en bereikbaar van Anthropic servers. Geef geen privé interne URLs als URL bron — zij zullen stil mislukken of fetch error teruggeven.

**Python helper voor base64 encoding:**
```python
import anthropic
import base64
from pathlib import Path

def image_to_message(path: str, prompt: str) -> dict:
    data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
    ext = Path(path).suffix.lstrip(".")
    media_type = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
                  "gif": "image/gif", "webp": "image/webp"}[ext]
    return {
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": data}},
            {"type": "text", "text": prompt}
        ]
    }

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[image_to_message("/tmp/screenshot.png", "Identificeer alle form fields zichtbaar.")]
)
```

---

## Image Size Limieten en Constraints

| Constraint | Waarde |
|---|---|
| Max bestand size | 5 MB per image |
| Aanbevolen max dimensie | 1568 × 1568 px |
| Absoluut max dimensie | ~8000 px op long edge (internally downscaled) |
| Max images per verzoek | 20 (API); geen afgedwongen limiet in Claude Code sessies |

Images groter dan 1568 × 1568 px zijn downscaled voordat verwerking. Model ziet downscaled versie, niet origineel. Voor images dichte small tekst (receipts, data tabellen, technical diagrammen), houd resolutie dicht bij 1568 px op long edge naar legibility behouden. Verzenden 4K screenshot verbetert nauwkeurigheid niet — het verhoogt alleen base64 payload size en network transfer tijd.

Downscale voordat verzenden wanneer images limiet overschrijden:

```bash
# macOS ImageMagick — resize fit binnen 1568x1568, aspect ratio behouden
magick input.png -resize '1568x1568>' output.png

# Of met sips (geen install vereist op macOS)
sips --resampleHeightWidthMax 1568 input.png --out output.png
```

---

## Token Kosten van Images

Images hebben geen variabele token kosten dat scales met pixel count. Kosten is ongeveer fixed per image ongeacht resolutie (binnen ondersteunde bereik):

| Model | Kosten per image (approx.) |
|---|---|
| Claude Haiku | ~1500 tokens |
| Claude Sonnet | ~1500–1600 tokens |
| Claude Opus | ~1600–2000 tokens |

200 × 200 px thumbnail kost ongeveer hetzelfde als 1568 × 1568 px diagram. Dit betekent:
- Verzend geen meerdere kleine crops wanneer één volledige image duidelijker
- Aaneem niet kleinere images goedkoper
- Voor multi-image workflows (bijv. 10 screenshots), estimate ~15.000–20.000 tokens image overhead voordat enig tekst

PDF's kosten ongeveer 1500–2000 tokens per pagina gerenderd, gebruikend dezelfde fixed-cost model.

---

## Use Case 1: UI/UX Review en Accessibility Audit

Plak screenshot van enig UI en vraag Claude om accessibility issues, layout problemen, of design inconsistenties te identificeren.

**Prompt patroon:**
```
Ik plak screenshot van onze login pagina.

1. List elke WCAG 2.1 AA schending je kunt identificeren — focus op color contrast, missing labels, en keyboard focus indicators.
2. Voor elke schending, citeer specifieke WCAG success criterion (bijv. 1.4.3 Contrast Minimum).
3. Suggereer minimum code wijziging die elk issue fixeert.
```

**Wat dit vangt zonder browser:** missing `aria-label` op icon buttons, laag contrast tekst over background images, form velden geen zichtbare label associatie, touch targets kleiner dan 44 × 44 px, placeholder tekst gebruikt label substitute.

Voor systematische review, capture screenshots op meerdere viewport breedtes en geef in enkel turn:

```python
viewports = [375, 768, 1280]  # mobile, tablet, desktop
screenshots = [f"/tmp/ui-{w}.png" for w in viewports]

content = []
for path in screenshots:
    data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
    content.append({"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": data}})

content.append({"type": "text", "text": "Vergelijk deze drie viewport screenshots. Identificeer layout breaks en accessibility issues op elk width. Groepeer bevindingen op viewport."})
```

---

## Use Case 2: OCR — Text Extractie van Images

Claude extractet tekst van scanned documenten, foto's whiteboards, receipts, business kaarten, en handgeschreven notities. Anders dan traditionele OCR tools, Claude begrijpt context — het kan gestructureerde data van ongestructureerde visuele layouts extracten.

**Receipts en invoices:**
```
Extract alle line items van deze receipt. Retourneer JSON array met velden:
- description (string)
- quantity (number)
- unit_price (number)
- total (number)

Ook includeren: vendor_name, date, subtotal, tax, total_amount.
```

**Whiteboard notities:**
```
Transcribeer alles geschreven op dit whiteboard. Behoud structuur — als items in lijst, formatteer als lijst. Als er diagrammen labels, beschrijf diagram en extract labels.
```

**Handgeschreven vormen:**
```
Extract alle ingevulde waarden van deze vorm. Retourneer key-value mapping waar key printed form field label en value wat geschreven in.
```

Limieten: Claude kan betrouwbaar niet lezen tekst kleiner dan ongeveer 8–10pt equivalent op 1568 px resolutie. Watermerken, overlappende tekst, en zwaar degraded scans reduceren nauwkeurigheid. Voor kritieke OCR taken (juridische documenten, financial records), valideer extracted waarden tegen verwachte patronen.

---

## Use Case 3: Diagram-to-Code — Architecture Diagrammen naar Infrastructure

Geef architecture diagram (hand-drawn, Lucidchart export, of whiteboard foto) en vraag Claude infrastructure code genereren correspondeerend.

**Prompt:**
```
Dit is architecture diagram voor onze applicatie. Genereer Terraform module dat elke resource getoond provisions.

Vereisten:
- Gebruik AWS provider
- Gebruik variabelen voor environment-specifieke waarden (regio, instance types, CIDR blokken)
- Voeg outputs voor alle resource IDs en ARNs dat downstream modules nodig hebben
- Volg naming convention getoond diagram labels
```

**Wat Claude infer van diagrammen:**
- VPC grenzen en subnet layouts
- Load balancer → target groep → instance relaties
- Database replica configuraties
- Security groep grenzen (dashed lijnen of kleur coding)
- Service namen en instance types als gelabeld

Voor complexe diagrammen overlappende elementen, voeg prompt hint: "Focus op solid arrows — zij vertegenwoordigen network traffic flow. Dashed lijnen vertegenwoordigen management toegang."

---

## Use Case 4: Error Debugging van UI Screenshots

Wanneer bug visueel manifesteert (onverwachte layout, broken staat, error modal), screenshot en geef Claude met relevante code.

**Prompt:**
```
Deze screenshot toont error staat onze gebruikers zien als checkout mislukkt.

Gegeven deze screenshot en error handler beneden, identificeer:
1. Wat triggered deze staat
2. Waarom error bericht afgesneden bottom
3. Welke CSS of state management wijziging fixeert overflow

[plak error handler code]
```

Claude correlateert wat het ziet in screenshot (truncated tekst, misaligned elementen, onverwachte background kleur) met code je geeft. Dit is sneller dan beschrijvende visuele bug in woorden — showing is ondubbelzinnig.

**Voor console errors:** Als browser DevTools console zichtbaar in screenshot, Claude leest error berichten, regel nummers, en stack trace van afbeelding.

---

## Use Case 5: Design Implementatie — Figma Screenshot naar Component

Neem screenshot Figma frame (of enig design mockup) en genereer correspondeerend component.

**Prompt:**
```
Dit screenshot Figma ontwerp voor pricing card component.

Genereer React component matching dit ontwerp exact. Vereisten:
- Gebruik Tailwind CSS voor styling
- Component accepteert props: plan (string), price (number), features (string[]), isPopular (boolean)
- "Popular" badge moet alleen verschijnen wanneer isPopular true
- Match font weights, spacing, en border radius zichtbaar screenshot
- CTA knop moet primary kleur getoond gebruiken
```

**Itereren op output:**
```
Knop tekst is te klein — in screenshot voorkomen ongeveer 16px, matching body tekst size. Update component.
```

Claude kan niet extract exact hex waarden van screenshots betrouwbaar — kleur perceptie van screenshots hangt af monitor calibratie en compression artefacten. Voor precies kleuren, copy ze van Figma direct en plak in prompt: "Primary kleur is #6366F1."

---

## Use Case 6: Chart en Graph Data Extractie

Claude kan waarden lezen van bar grafieken, line grafieken, pie grafieken, en data tabellen getoond als images — nuttig wanneer onderliggende data niet toegankelijk.

**Prompt:**
```
Extract alle data punten van deze bar grafiek. Retourneer JSON array waar elk item:
- label (x-axis categorie)
- value (numerieke y-axis waarde)

Estimate waarden zo nauwkeurig mogelijk van bar hoogte relatief y-axis scale. Includer confidence level (hoog/medium/laag) voor elke waarde.
```

**Voor line grafieken meerdere series:**
```
Deze line grafiek toont drie metrieke over tijd. Voor elke series:
1. Identificeer series naam (van legend)
2. Extract approximate waarde op elke gelabelde x-axis tick
3. Identificeer crossover punten tussen series
```

Limieten: Claude estimates waarden door visuele proportie. Op grafiek met y-axis van 0–1.000.000, nauwkeurigheid degraded voor waarden dicht samen. Voor hoge-precisie data extractie, request onderliggende data van bron — visuele extractie van grafieken fallback wanneer bron onbeschikbaar.

---

## Vision Combineren met MCP: Playwright Screenshot Workflow

Meest krachtig multimodal patroon in Claude Code combineert Playwright MCP (neemt programmische screenshots) met Claude vision capaciteiten naar maak closed-loop test-and-fix cyclus.

### Setup

Installeer en configureer Playwright MCP:

```bash
npm install -g @playwright/mcp
```

Voeg toe `.claude/settings.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp", "--browser", "chromium"]
    }
  }
}
```

### Closed-Loop Patroon

```
1. Navigate naar http://localhost:3000/checkout
2. Neem screenshot met Playwright MCP
3. Analyseer screenshot: identificeer enig visueel regressies vergeleken verwachte layout beschreven beneden
4. Mislukking regressies gevonden, lees relevante component bestanden en fixeert ze
5. Neem tweede screenshot na je fix
6. Bevestig regressie resolved door vergelijken voor en na screenshots

Verwachte layout: drie-kolom grid van product kaarten, elk met afbeelding bovenop, titel beneden, prijs bold bottom-left, Add to Cart knop bottom-right.
```

Claude Code voert dit automatisch uit:
- Playwright MCP navigeert browser en capture screenshots
- Claude analyseer elke screenshot
- Claude lees bron bestanden, maakt bewerkingen, en re-screenshot verifiëren

### Multi-Stap Navigation Voorbeeld

```
Gebruiken Playwright MCP:
1. Open http://localhost:3000
2. Screenshot homepage — beschrijf wat je ziet
3. Klik "Sign In" link
4. Screenshot sign-in vorm — list elk form veld aanwezig
5. Vul in email: test@example.com, password: testpass123
6. Klik Submit
7. Screenshot result — login succeed of fail? Welke error, als enig, getoond?
```

---

## PDF Verwerking

Claude verwerkt PDF's pagina voor pagina, behandelend elke pagina als gerenderde image.

**Enkel-pagina PDF:**
```python
with open("invoice.pdf", "rb") as f:
    data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": data
                }
            },
            {"type": "text", "text": "Extract alle line items en totalen van deze invoice."}
        ]
    }]
)
```

**Multi-pagina PDF's:** Claude verwerkt alle pagina's standaard. Voor lange PDF's waar alleen specifieke pagina's relevant, specificeer bereik in prompt: "Focus op pagina's 3–7. Ignoreer appendix."

Token kosten scales met pagina count — een 20-pagina PDF kost ongeveer 20× enkel-image tarief (~30.000–40.000 tokens voor PDF alleen). Voor grote PDF's, extract relevante pagina's voordat verzenden:

```bash
# Extract pagina's 3-7 van PDF (vereist pdftk of ghostscript)
pdftk input.pdf cat 3-7 output extracted.pdf

# Of met ghostscript
gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dFirstPage=3 -dLastPage=7 \
   -sOutputFile=extracted.pdf input.pdf
```

---

## Limieten

| Limitatie | Detail |
|---|---|
| Geen video | Claude kan niet video bestanden verwerken of frames extracten van video |
| Geen real-time camera | Geen live camera feed capaciteit — screenshots zijn altijd statische captures |
| Tiny tekst | Tekst kleiner dan ongeveer 8–10pt equivalent op ondersteunde resolutie onbetrouwbaar |
| Exact kleuren | Kleur hex waarden extracted van screenshots zijn estimates, niet exact |
| Complex overlapping UI | Dense UI's overlappende elementen of transparency effecten reduceren identificatie nauwkeurigheid |
| Handwriting kwaliteit | Zwaar degraded handwriting, non-Latin scripts, of ongewoon lettervormen degraded OCR nauwkeurigheid |
| Chart precisie | Numerieke waarden lezen van grafieken approximaties gebaseerd op visuele proportie |
| Animated content | GIF's lezen als enkel statische frame |

---

## Prompt Patronen voor Vision Taken

Gebruik dit als startsjablonen, aanpassend output formaat voor je downstream gebruik.

**Algemene beschrijving:**
```
Beschrijf wat je ziet in deze image. Wees specifiek — list UI componenten, tekst content, kleuren, layout structuur, en enig zichtbare staat (error, loading, empty, active).
```

**Text extractie:**
```
Extract alle tekst zichtbaar in deze image. Behoud reading order. Gebruik markdown formatting reflecteren visuele hiërarchie — headings als ##, lists bullet punten, bold waar tekst bold voorkomen.
```

**Component inventaris:**
```
Identificeer elk UI component in deze screenshot. Voor elk component, geef:
- Component type (button, input, modal, card, etc.)
- Zichtbare tekst of label
- Approximate positie (top-left, center, bottom-right, etc.)
- Apparent staat (active, disabled, selected, error)
```

**Gestructureerde data extractie:**
```
Extract data getoond in deze [tabel/grafiek/vorm] als JSON. Gebruik kolom headers als keys. Includer alle rijen zichtbaar.
```

**Code generatie van visueel:**
```
Implementeer dit ontwerp als [React component / HTML+CSS / SwiftUI view]. Match visuele structuur exact. Gebruik [Tailwind / inline styles / CSS modules] voor styling. Component moet self-contained zijn met geen externe afhankelijkheden voorbij gespecificeerde styling systeem.
```

**Diff vergelijking:**
```
Ik geef je twee screenshots — voor en na wijziging. List elk visueel verschil je kunt identificeren, hoe klein. Groepeer verschillen op categorie: layout, kleur, typografie, content, spacing.
```

---

## Volledige Workflow Voorbeeld: Screenshot naar Code Wijziging

Dit end-to-end voorbeeld neemt bug report screenshot en produceert committed fix.

**Setup:** Gebruiker rapporteert notification badge overlapt avatar in header op mobile.

**Stap 1 — Capture en analyseer:**
```
Ik heb screenshot van mobile header bug op /tmp/header-bug.png.

Beschrijf exact wat je ziet — waar is notification badge relatief avatar? Wat is overlap?
```

Claude antwoord: "Notification badge (rood cirkel, top-right avatar) gepositioneerd op `top: -4px; right: -4px` maar avatar container heeft `overflow: hidden`, clipping badge."

**Stap 2 — Lokaliseer bron:**
```
Gegeven analyse, vind avatar component in deze codebase. Zoek component die circular avatar met notification badge overlay rendert.
```

Claude zoekt en vindt `src/components/Avatar/Avatar.tsx`.

**Stap 3 — Genereer fix:**
```
Lees Avatar.tsx en fixeert overflow issue. Badge moet volledig zichtbaar zijn — clip het niet. Behoud alle bestaande prop types en gedrag.
```

Claude bewerkt bestand, wijzigend `overflow: hidden` op container naar `overflow: visible` en adjusting parent wrapper handle border-radius clipping apart.

**Stap 4 — Verifiëer:**
```
Gebruiken Playwright MCP, navigate naar http://localhost:3000 op 375px viewport width screenshot header. Voorkomen badge volledig zichtbaar en unclipped?
```

Claude neemt screenshot, analyseer dit, en bevestigt fix of itereert.

---

## Decision Tabel

| Taak | Aanpak |
|---|---|
| Screenshot UI bug → wortelcause | Plak screenshot, beschrijf verwachte gedrag, vraag code fix |
| Figma mockup → component | Screenshot Figma frame, specificeer framework en styling systeem |
| Scanned PDF → gestructureerde data | Base64 encode, gebruik document content blok, specificeer output schema |
| Architecture diagram → Terraform | Screenshot diagram, vraag provider-specifieke IaC output |
| Chart → CSV | Screenshot grafiek, vraag JSON/CSV met confidence niveaus |
| Automated visueel regressie | Playwright MCP screenshot → Claude analyse → automated edit loop |
| Grote PDF (10+ pagina's) | Extract relevante pagina's voordat verzenden; estimate ~1500 tokens/pagina |
| Meerdere UI staten | Verzend alle screenshots enkel turn; vraag Claude vergelijken over hen |

---
