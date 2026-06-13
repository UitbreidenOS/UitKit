# Vision und Multimodale Workflows in Claude Code

Claude kann Bilder, PDFs, Screenshots und Diagramme als First-Class-Inputs neben Text analysieren. Dieser Guide deckt ab, wie man visuellen Inhalt in Claude Code bringt, was Claude extrahieren kann, und End-to-End-Workflows, die Vision mit Code-Generierung und automatisierten Fixes kombinieren.

---

## Was Claude Sehen Kann

Claude unterstützt vier Bild-Formate:

| Format | Notizen |
|---|---|
| PNG | Verlustlos. Beste für Screenshots, Diagramme, UI-Captures |
| JPEG / JPG | Verlustbehaftet. Akzeptabel für Fotos; vermeide für Text-reiche Bilder |
| GIF | Nur statischer Frame — Claude liest den ersten Frame, nicht Animation |
| WebP | Unterstützt. Beide Verlustlose und Verlustbehaftete Varianten |

**PDFs** werden als Bilder verarbeitet — jede Seite wird rendered und visuell analysiert. Claude parsed PDF-Text-Streams nicht; es liest, was auf der rendered Seite sichtbar ist. Das bedeutet, es kann gescannte PDFs, handgeschriebene Dokumente und gemischte-Inhalts-PDFs gleich wie Bilder handhabt.

**Screenshots** sind der häufigste Multimodal-Input in Claude Code-Workflows. Sie brauchen keine Format-Konvertierung — zieh von jedem Screenshot-Tool oder pipe von einem Capture-Script.

Claude kann nicht verarbeiten:
- Video-Dateien (keine Frame-Extraktion, keine Motion-Analyse)
- Echte-Zeit-Camera-Feeds
- In Mediendateien Embedded-Audio
- Animierte-GIF-Frames jenseits der ersten

---

## Bilder an Claude Code Übergeben

### Drag and Drop im Terminal

In Terminals, die Bild-Rendering unterstützen (iTerm2, Ghostty, Warp, Kitty), ziehe eine Bild-Datei aus Finder direkt in das Terminal-Fenster, wo Claude läuft. Das Bild wird zum aktuellen Turn attached.

```
# macOS — ziehe jede Datei von Finder in die Claude Code Terminal-Sitzung
# Das Bild erscheint als Attachment vor deiner typisierten Nachricht
```

### Paste von Clipboard

Claude Code liest Clipboard-Bilder, wenn du pastest (`Cmd+V` auf macOS, `Ctrl+V` auf Linux). Nach einem Screenshot mit `Cmd+Shift+4` (macOS-Selection-Screenshot) oder `PrintScreen`, paste direkt in das Claude Code-Terminal. Das Bild wird vom Clipboard erfasst und zum aktuellen Message attached.

```bash
# Erfasse eine Region und paste sie in Claude
# macOS: Cmd+Shift+4 → wähle Region → Cmd+V in Claude-Terminal
```

### Referenziere einen Datei-Pfad

Biete einen Absoluten Datei-Pfad in deiner Nachricht an, und Claude Code liest die Datei:

```
Analysiere das Bild unter /tmp/error-screenshot.png. Was ist die Root-Ursache des gezeigten Fehlers?
```

Das funktioniert ohne Drag-and-Drop in Terminals, die Bilder nicht rendern — Claude Code liest die Datei von der Disk, wenn ein Pfad gegeben wird.

### Programmatischer Input via API

Bei direktem Claude-API-Aufruf werden Bilder als strukturierte Content-Blöcke übergeben. Zwei Source-Typen werden unterstützt:

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
      "text": "Welche UI-Komponenten sind in diesem Screenshot sichtbar?"
    }
  ]
}
```

**URL (Remote-Fetch):**
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
      "text": "Konvertiere dieses Architektur-Diagramm in Terraform."
    }
  ]
}
```

Nutze Base64 für Bilder, die nicht öffentlich zugänglich sind (lokale Dateien, interne Screenshots, CI-Artefakte). Nutze URL-Source für Bilder, die bereits gehostet sind und von Anthropic's Servern erreichbar. Übergebe nicht private interne URLs als URL-Source — sie werden stillschweigend fehlschlagen oder einen Fetch-Fehler zurückgeben.

**Python-Helper für Base64-Encoding:**
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
    messages=[image_to_message("/tmp/screenshot.png", "Identifiziere alle sichtbaren Form-Felder.")]
)
```

---

## Bild-Größe-Limits und Constraints

| Constraint | Wert |
|---|---|
| Max-Dateigröße | 5 MB pro Bild |
| Empfohlene Max-Dimension | 1568 × 1568 px |
| Absolutes Max-Dimension | ~8000 px auf der Langen Kante (intern Downscaled) |
| Max-Bilder pro Request | 20 (API); keine Durchgesetzte Limit in Claude Code-Sitzungen |

Bilder größer als 1568 × 1568 px werden vor Processing Downscaled. Das Modell sieht die Downscaled-Version, nicht das Original. Für Bilder mit dichtem kleinem Text (Quittungen, Datentabellen, technische Diagramme), halte die Auflösung nah bei 1568 px auf der Langen Kante, um Lesbarkeit zu bewahren. Das Senden eines 4K-Screenshots verbessert nicht die Genauigkeit — es erhöht nur Base64-Payload-Größe und Network-Transfer-Zeit.

Downscale, bevor gesendet wird, wenn Bilder das Limit übersteigen:

```bash
# macOS ImageMagick — Größe ändern auf Passfähigkeit mit 1568x1568, bewahre Aspect Ratio
magick input.png -resize '1568x1568>' output.png

# Oder mit sips (keine Installation erforderlich auf macOS)
sips --resampleHeightWidthMax 1568 input.png --out output.png
```

---

## Token-Kosten von Bildern

Bilder haben keine Variable Token-Kosten, die mit Pixel-Count skalieren. Die Kosten sind ungefähr fest pro Bild, unabhängig von Auflösung (innerhalb des unterstützten Bereichs):

| Modell | Kosten pro Bild (ungefähr) |
|---|---|
| Claude Haiku | ~1500 Tokens |
| Claude Sonnet | ~1500–1600 Tokens |
| Claude Opus | ~1600–2000 Tokens |

Ein 200 × 200 px Thumbnail kostet ungefähr gleich wie ein 1568 × 1568 px Diagramm. Das bedeutet:
- Sende nicht mehrere kleine Crops, wenn ein voller Bild klarer ist
- Nimm nicht an, dass kleinere Bilder billiger sind
- Für Multi-Bild-Workflows (z.B. 10 Screenshots), schätze ~15,000–20,000 Tokens Bild-Overhead, bevor jeglicher Text

PDFs kosten ungefähr 1500–2000 Tokens pro Seite rendered, nutzend das gleiche Fixed-Cost-Modell.

---

## Anwendungsfall 1: UI/UX Review und Accessibility Audit

Paste einen Screenshot jeder UI, und frage Claude, um Accessibility-Probleme, Layout-Probleme oder Design-Inkonsistenzen zu identifizieren.

**Prompt-Pattern:**
```
Ich paste einen Screenshot unserer Login-Seite.

1. Listiere jeden WCAG 2.1 AA Violation, den du identifizieren kannst — fokus auf Color-Contrast, fehlende Labels und Keyboard-Focus-Indikatoren.
2. Für jeden Violation, zitiere das spezifische WCAG-Success-Kriterium (z.B. 1.4.3 Contrast Minimum).
3. Schlag die Mindest-Code-Änderung vor, die jeden Issue repariert.
```

**Was das erfasst ohne einen Browser:** fehlende `aria-label` auf Icon-Buttons, niedriger Contrast-Text über Hintergrund-Bildern, Form-Felder ohne sichtbare Label-Assoziation, Touch-Targets kleiner als 44 × 44 px, Placeholder-Text, der als Label-Ersatz genutzt wird.

Für systematisches Review, erfasse Screenshots bei mehreren Viewport-Breiten und übergebe sie in einem einzelnen Turn:

```python
viewports = [375, 768, 1280]  # mobile, tablet, desktop
screenshots = [f"/tmp/ui-{w}.png" for w in viewports]

content = []
for path in screenshots:
    data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
    content.append({"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": data}})

content.append({"type": "text", "text": "Vergleiche diese drei Viewport-Screenshots. Identifiziere Layout-Breaks und Accessibility-Issues bei jeder Breite. Gruppiere Befunde nach Viewport."})
```

---

## Anwendungsfall 2: OCR — Text-Extraktion aus Bildern

Claude extrahiert Text aus gescannten Dokumenten, Whiteboard-Fotos, Quittungen, Business-Cards und handgeschriebenen Notizen. Anders als traditionelle OCR-Tools, versteht Claude Kontext — es kann strukturierte Daten aus unstrukturierten visuellen Layouts extrahieren.

**Quittungen und Rechnungen:**
```
Extrahiere alle Positionen aus dieser Quittung. Gebe ein JSON-Array mit Feldern zurück:
- description (string)
- quantity (number)
- unit_price (number)
- total (number)

Schließe auch ein: vendor_name, date, subtotal, tax, total_amount.
```

**Whiteboard-Notizen:**
```
Transkribiere alles, das auf diesem Whiteboard geschrieben ist. Bewahre die Struktur — wenn Elemente in einer Liste sind, formatiere sie als Liste. Wenn es Diagramme mit Labels gibt, beschreibe das Diagramm und extrahiere die Labels.
```

**Handgeschriebene Formulare:**
```
Extrahiere alle ausgefüllten Werte von diesem Formular. Gebe ein Key-Value-Mapping, wo der Schlüssel das Feld-Label ist, das auf dem Formular gedruckt ist und der Wert, was darin geschrieben war.
```

Limits: Claude kann nicht zuverlässig Text kleiner als ungefähr 8–10pt Äquivalent bei 1568 px Auflösung lesen. Wasserzeichen, überlappender Text und stark degradierte Scans reduzieren Genauigkeit. Für kritische OCR-Aufgaben (rechtliche Dokumente, finanzielle Aufzeichnungen), validiere extrahierte Werte gegen erwartete Patterns.

---

## Anwendungsfall 3: Diagramm-zu-Code — Architektur-Diagramme zu Infrastruktur

Übergebe ein Architektur-Diagramm (Hand-drawn, Lucidchart-Export oder Whiteboard-Foto), und frage Claude, um den entsprechenden Infrastruktur-Code zu generieren.

**Prompt:**
```
Dies ist ein Architektur-Diagramm für unsere Anwendung. Generiere ein Terraform-Modul, das jeden gezeigten Resource bereitstellt.

Anforderungen:
- Nutze AWS-Provider
- Nutze Variablen für Environment-Spezifische Werte (Region, Instance-Typen, CIDR-Blöcke)
- Füge Outputs für alle Resource-IDs und ARNs hinzu, die Downstream-Module bräuchten
- Folge der Naming-Konvention, gezeigt in den Diagramm-Labels
```

**Was Claude von Diagrammen ableitet:**
- VPC-Grenzen und Subnet-Layouts
- Load-Balancer → Target-Group → Instance-Beziehungen
- Datenbank-Replika-Konfigurationen
- Security-Group-Grenzen (gestrichene Linien oder Farb-Codierung)
- Service-Namen und Instance-Typen, wenn gelabelt

Für komplexe Diagramme mit überlappenden Elementen, füge einen Prompt-Hinweis hinzu: "Fokus auf die Durchgehend-Pfeile — sie repräsentieren Network-Traffic-Flow. Gestrichene Linien repräsentieren Management-Zugriff."

---

## Anwendungsfall 4: Error-Debugging von UI-Screenshots

Wenn ein Bug visuell manifestiert (unerwartetes Layout, ein broken-State, ein Error-Modal), screenshot es, und übergebe es Claude mit dem relevanten Code.

**Prompt:**
```
Dieser Screenshot zeigt den Error-State, den unsere Nutzer sehen, wenn Checkout scheitert.

Gegebenen diesen Screenshot und den Error-Handler unten, identifiziere:
1. Was triggerte diesen State
2. Warum die Error-Nachricht am Bottom abgeschnitten ist
3. Welche CSS oder State-Management-Änderung den Overflow repariert

[paste Error-Handler-Code]
```

Claude korreliert, was es im Screenshot sieht (abgeschnittener Text, fehlausgerichtete Elemente, unerwartete Background-Farbe) mit dem Code, den du providest. Das ist schneller als die visuellen Bugs in Worten zu beschreiben — zeigen ist unmissverständlich.

**Für Console-Errors:** Wenn die Browser-DevTools-Konsole im Screenshot sichtbar ist, liest Claude die Error-Nachrichten, Zeilennummern und Stack-Trace aus dem Bild.

---

## Anwendungsfall 5: Design-Implementierung — Figma-Screenshot zu Komponente

Nimm einen Screenshot eines Figma-Frames (oder jedes Design-Mockup), und generiere die entsprechende Komponente.

**Prompt:**
```
Dies ist ein Screenshot einer Figma-Design für eine Pricing-Card-Komponente.

Generiere eine React-Komponente, die diesen Design exakt matched. Anforderungen:
- Nutze Tailwind CSS für Styling
- Die Komponente akzeptiert diese Props: plan (string), price (number), features (string[]), isPopular (boolean)
- Das "Popular"-Badge sollte nur erscheinen, wenn isPopular true ist
- Matched die Font-Weights, Spacing und Border-Radius sichtbar im Screenshot
- Der CTA-Button sollte die primäre Farbe nutzen, gezeigt
```

**Auf dem Output Iterieren:**
```
Der Button-Text ist zu klein — im Screenshot erscheint er ungefähr 16px, matching die Body-Text-Größe. Aktualisiere die Komponente.
```

Claude kann Hex-Werte nicht zuverlässig aus Screenshots extrahieren — Color-Wahrnehmung von Screenshots hängt von Monitor-Kalibrierung und Compression-Artefakten ab. Für präzise Farben, kopiere sie direkt von Figma und paste ins Prompt: "Die primäre Farbe ist #6366F1."

---

## Anwendungsfall 6: Chart- und Graph-Daten-Extraktion

Claude kann Werte aus Bar-Charts, Line-Graphs, Pie-Charts und Datentabellen lesen, gezeigt als Bilder — nützlich, wenn die zugrunde liegenden Daten nicht zugänglich sind.

**Prompt:**
```
Extrahiere alle Datenpunkte aus diesem Bar-Chart. Gebe ein JSON-Array, wo jedes Elemente hat:
- label (die X-Achse Kategorie)
- value (der numerische Y-Achsen-Wert)

Schätze Werte so präzise wie möglich aus den Bar-Höhen relativ zur Y-Achse-Skalierung. Schließe dein Confidence-Level (high/medium/low) für jeden Wert ein.
```

**Für Line-Graphs mit mehreren Series:**
```
Dieser Line-Graph zeigt drei Metriken über Zeit. Für jede Serie:
1. Identifiziere den Seriennamen (von der Legende)
2. Extrahiere die ungefähre Wert bei jedem gelabelten X-Achsen-Tick
3. Identifiziere jeden Crossover-Punkt zwischen Series
```

Limits: Claude schätzt Werte durch visuelle Proportion. Auf einem Chart mit Y-Achse von 0 zu 1,000,000 wird die Genauigkeit für nahe beieinander liegende Werte degradiert. Für High-Precision-Daten-Extraktion, fordere die zugrunde liegenden Daten vom Data-Source an — visuelle Extraktion von Charts ist ein Fallback, wenn die Source nicht verfügbar ist.

---

## Vision mit MCP kombinieren: Playwright-Screenshot-Workflow

Das leistungsfähigste Multimodal-Pattern in Claude Code kombiniert Playwright MCP (das programmatische Screenshots nimmt) mit Claudes Vision-Fähigkeiten, um einen Closed-Loop Test-und-Fix-Cycle zu schaffen.

### Setup

Installiere und konfiguriere Playwright MCP:

```bash
npm install -g @playwright/mcp
```

Füge zu `.claude/settings.json` hinzu:
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

### Das Closed-Loop-Pattern

```
1. Navigiere zu http://localhost:3000/checkout
2. Nimm einen Screenshot mit Playwright MCP
3. Analysiere den Screenshot: identifiziere jede visuelle Regression im Vergleich zur erwarteten Layout, die unten beschrieben wird
4. Wenn Regressions gefunden werden, lese die relevanten Komponenten-Dateien und repariere sie
5. Nimm einen zweiten Screenshot nach deiner Reparatur
6. Bestätige, dass die Regression durch das Vergleichen der Before- und After-Screenshots aufgelöst wird

Erwartete Layout: Drei-Spalten-Grid von Produktkarten, jede mit Bild oben, Titel unten, Preis in Fett am Unten-Links, Add to Cart-Button am Unten-Rechts.
```

Claude Code führt das autonom aus:
- Playwright MCP navigiert den Browser und erfasst Screenshots
- Claude analysiert jeden Screenshot
- Claude liest Source-Dateien, macht Edits und re-screenshots zum Verifizieren

### Multi-Step-Navigation-Beispiel

```
Nutzen Playwright MCP:
1. Öffne http://localhost:3000
2. Screenshot die Homepage — beschreibe, was du siehst
3. Klick den "Sign In" Link
4. Screenshot das Sign-In-Formular — liste jedes Form-Feld auf, das anwesend ist
5. Fülle aus: Email: test@example.com, Password: testpass123
6. Klick Submit
7. Screenshot das Ergebnis — hat Login erfolgreich oder fehlgeschlagen? Welcher Error, wenn überhaupt, wird angezeigt?
```

---

## PDF-Verarbeitung

Claude verarbeitet PDFs Seite-für-Seite, jede Seite als ein Rendered-Bild behandelnd.

**Einzeln-Seite-PDF:**
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
            {"type": "text", "text": "Extrahiere alle Positionen und Totals aus dieser Rechnung."}
        ]
    }]
)
```

**Multi-Seite-PDFs:** Claude verarbeitet alle Seiten standardmäßig. Für lange PDFs, wo nur spezifische Seiten relevant sind, spezifiziere den Range im Prompt: "Fokus auf Seiten 3–7. Ignoriere den Anhang."

Token-Kosten skalieren mit Seiten-Count — ein 20-Seiten-PDF kostet ungefähr 20× die Single-Image-Rate (~30,000–40,000 Tokens für das PDF allein). Für große PDFs, extrahiere die relevanten Seiten, bevor gesendet:

```bash
# Extrahiere Seiten 3-7 von einem PDF (erfordert pdftk oder ghostscript)
pdftk input.pdf cat 3-7 output extracted.pdf

# Oder mit ghostscript
gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dFirstPage=3 -dLastPage=7 \
   -sOutputFile=extracted.pdf input.pdf
```

---

## Limits

| Limit | Detail |
|---|---|
| Kein Video | Claude kann Video-Dateien nicht verarbeiten oder Frames extrahieren |
| Keine Echte-Zeit-Camera | Es gibt keine Live-Camera-Feed-Fähigkeit — Screenshots sind immer statische Captures |
| Tiny-Text | Text kleiner als ungefähr 8–10pt Äquivalent bei unterstützter Auflösung ist unzuverlässig |
| Exact-Colors | Hex-Werte, die aus Screenshots extrahiert werden, sind Schätzungen, nicht exakt |
| Komplexe überlappt UI | Dense UIs mit überlappenden Elementen oder Transparency-Effekten reduzieren Identifizierungs-Genauigkeit |
| Handschrift-Qualität | Stark degradierte Handschrift, Nicht-Latein-Skripte oder ungewöhnliche Letterformen degradieren OCR-Genauigkeit |
| Chart-Präzision | Numerische Werte, die von Charts gelesen werden, sind Näherungen basierend auf visueller Proportion |
| Animierter Inhalt | GIFs werden als einzelner statischer Frame gelesen |

---

## Prompt-Patterns für Vision-Aufgaben

Nutze diese als Starttemplates, passe das Output-Format für deine Downstream-Nutzung an.

**Generelle Beschreibung:**
```
Beschreibe, was du in diesem Bild siehst. Sei spezifisch — liste UI-Komponenten, Text-Inhalt, Farben, Layout-Struktur und jede sichtbare State (Error, Loading, Empty, Active) auf.
```

**Text-Extraktion:**
```
Extrahiere alle in diesem Bild sichtbaren Texte. Bewahre die Lese-Order. Nutze Markdown-Formatierung, um visuelle Hierarchie zu reflektieren — Headings als ##, Listen als Bullet-Points, Fett wo Text Fett erscheint.
```

**Komponenten-Inventur:**
```
Identifiziere jede UI-Komponente in diesem Screenshot. Für jede Komponente, biete:
- Komponenten-Typ (Button, Input, Modal, Card, etc.)
- Sichtbarer Text oder Label
- Ungefähre Position (Oben-Links, Mitte, Unten-Rechts, etc.)
- Scheinbare State (Active, Disabled, Selected, Error)
```

**Strukturierte Daten-Extraktion:**
```
Extrahiere die Daten, gezeigt in diesem [Tabelle/Chart/Formular] als JSON. Nutze die Spalten-Headers als Schlüssel. Schließe alle sichtbaren Reihen ein.
```

**Code-Generierung von Visueller:**
```
Implementiere diesen Design als [React-Komponente / HTML+CSS / SwiftUI-View]. Matched die Visuelle Struktur exakt. Nutze [Tailwind / Inline-Styles / CSS-Module] für Styling. Die Komponente sollte Self-Contained sein ohne externe Dependencies jenseits des spezifizierten Styling-System.
```

**Diff-Vergleich:**
```
Ich gebe dir zwei Screenshots — Before und After einer Änderung. Liste jede visuelle Unterschied auf, den du identifizieren kannst, egal wie klein. Gruppiere Unterschiede nach Kategorie: Layout, Farbe, Typographie, Inhalt, Spacing.
```

---

## Vollständiges Workflow-Beispiel: Screenshot zu Code-Änderung

Dies ist ein End-to-End-Beispiel, das einen Bug-Report-Screenshot nimmt und eine committed-Reparatur produziert.

**Setup:** Ein Nutzer meldet, dass das Notification-Badge den Avatar im Header auf Mobile überlappt.

**Schritt 1 — Erfasse und Analysiere:**
```
Ich habe einen Screenshot eines Mobile-Header-Bugs unter /tmp/header-bug.png.

Beschreibe genau, was du siehst — wo ist das Notification-Badge relativ zum Avatar? Was ist der Overlap?
```

Claude antwortet: "Das Notification-Badge (roter Circle, Oben-Rechts des Avatar) ist bei `top: -4px; right: -4px` positioniert, aber der Avatar-Container hat `overflow: hidden`, das Badge clippend."

**Schritt 2 — Finde die Source:**
```
Basiert auf dieser Analyse, finde die Avatar-Komponente in diesem Codebase. Suche nach einer Komponente, die einen Circular-Avatar mit einem Notification-Badge-Overlay rendert.
```

Claude sucht und findet `src/components/Avatar/Avatar.tsx`.

**Schritt 3 — Generiere die Reparatur:**
```
Lese Avatar.tsx und repariere den Overflow-Issue. Das Badge sollte voll sichtbar sein — clipp es nicht. Bewahre alle existierenden Prop-Typen und Verhalten.
```

Claude editet die Datei, ändert `overflow: hidden` auf dem Container zu `overflow: visible` und adjustiert den Parent-Wrapper, um Border-Radius-Clipping separat zu handhabt.

**Schritt 4 — Verifiziere:**
```
Nutze Playwright MCP, navigiere zu http://localhost:3000 bei 375px Viewport-Breite und screenshot den Header. Erscheint das Badge voll sichtbar und nicht geclippt?
```

Claude nimmt den Screenshot, analysiert ihn und bestätigt die Reparatur oder iteriert.

---

## Entscheidungs-Tabelle

| Aufgabe | Ansatz |
|---|---|
| Screenshot von UI-Bug → Root-Cause | Paste Screenshot, beschreibe erwartetes Verhalten, fordere Code-Reparatur |
| Figma-Mockup → Komponente | Screenshot Figma-Frame, spezifiziere Framework und Styling-System |
| Gescanntes PDF → Strukturierte Daten | Base64 Encode, nutze Document-Content-Block, spezifiziere Output-Schema |
| Architektur-Diagramm → Terraform | Screenshot Diagramm, fordere Provider-Spezifischen IaC-Output |
| Chart → CSV | Screenshot Chart, fordere JSON/CSV mit Confidence-Levels |
| Automatisierte Visual-Regression | Playwright MCP Screenshot → Claude Analysis → Automatisierter Edit-Loop |
| Large PDF (10+ Seiten) | Extrahiere relevante Seiten, bevor gesendet; schätze ~1500 Tokens/Seite |
| Mehrere UI-States | Sende alle Screenshots in einem Turn; fordere Claude, sie zu vergleichen |

---
