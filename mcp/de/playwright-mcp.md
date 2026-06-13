# MCP: Playwright

Steuere einen echten Browser direkt von Claude Code aus. Playwright MCP lässt Claude Seiten navigieren, Elemente anklicken, Formulare ausfüllen, Screenshots machen und Inhalte extrahieren — und macht Browser-Automation aus einer natürlichen Konversation statt eine Scripting-Übung.

## Warum du das brauchst

Browser-basierte Aufgaben zwingen dich normalerweise aus dem Terminal: öffne einen Browser, klicke manuell herum, copy-paste Ergebnisse zurück. Mit Playwright MCP:
- Claude kann UI-Flows End-to-End testen ohne dich die Maus anzufassen
- Screenshots geben Claude visuelle Bestätigung, wie die Seite tatsächlich aussieht
- Formular-Ausfüllung, Login-Flows und Multi-Step-Interaktionen laufen in einem einzelnen Prompt
- Scraping und Content-Extraktion werden zu One-Linern statt Scripts
- Funktioniert Headless in CI oder mit Kopf lokal zum Debuggen

## Installation

```bash
# Installiere den MCP-Server
npm install -g @playwright/mcp

# Installiere den Chromium-Browser-Binary (erforderlich)
npx playwright install chromium
```

## Konfiguration

Füge zu `~/.claude.json` oder project `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

Für Headed-Modus (sichtbares Browser-Fenster, nützlich zum Debuggen):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false"
      }
    }
  }
}
```

## Schlüssel-Tools

- `browser_navigate` — gehe zu einer URL
- `browser_screenshot` — erfasse die aktuelle Seite als Bild
- `browser_click` — klicke ein Element per CSS-Selector oder Koordinaten
- `browser_type` — schreibe Text in ein Input-Feld
- `browser_select_option` — wähle einen Wert aus einem Dropdown
- `browser_scroll` — scrolle die Seite um eine Pixel-Menge oder zu einem Element
- `browser_evaluate` — führe JavaScript im Seiten-Kontext aus und gib das Ergebnis zurück
- `browser_get_text` — extrahiere sichtbaren Text von der Seite oder einem bestimmten Element
- `browser_wait_for` — warte, bis ein Element erscheint, Netzwerk idle wird oder ein Timeout auftritt

## Verwendungsbeispiele

```
Navigiere zur Login-Seite, fülle die Test-Credentials ein, sende das Formular,
und mache einen Screenshot, damit ich verifizieren kann, dass das Dashboard korrekt lädt.
```

```
Gehe zu unserer Staging-Umgebung bei https://staging.myapp.com/dashboard,
extrahiere allen Text von Error-Message-Elementen und gib ihn als Liste zurück.
```

```
Teste den Checkout-Flow: navigiere zur Produkt-Seite, füge das erste Item
zum Warenkorb hinzu, gehe zum Checkout und verifiziere die Order-Zusammenfassung
zeigt das richtige Item und Preis.
```

```
Schraube die Pricing-Seite bei https://myapp.com/pricing — extrahiere die Plan-Namen,
Preise und Feature-Listen und gib alles als strukturiertes JSON zurück.
```

```
Mache einen Screenshot von jeder Seite in der Haupt-Navigation und speichere sie
in /screenshots mit Dateinamen, die den Nav-Labels entsprechen.
```

## Authentifizierung

Kein API-Schlüssel erforderlich. Der Browser läuft lokal auf deiner Maschine. Für Sites, die Login brauchen:
- Verwende `browser_navigate` + `browser_type` + `browser_click`, um dich als Teil des Prompts zu authentifizieren
- Für persistente Sessions, verwende `browser_evaluate`, um Auth-Cookies direkt einzuspritzen:
  ```
  Setze das Auth-Cookie: document.cookie = "session=abc123; path=/"
  ```

## Tipps

**Headless vs Headed:** Standard ist Headless — schneller und CI-sicher. Wechsle zu `PLAYWRIGHT_HEADLESS=false`, wenn ein Flow fehlschlägt und du sehen möchtest, was Claude anklickt.

**Viewport-Größe:** Wenn sich eine Seite bei Mobile vs Desktop-Breiten unterschiedlich verhält, spezifiziere das im Prompt: `"Setze den Viewport auf 375x812 vor dem Screenshot"`.

**Warte auf Inhalte:** Dynamische Seiten, die Daten asynchron laden, können `browser_get_text` täuschen. Bitte Claude, `browser_wait_for` mit einer Network-Idle-Bedingung zu verwenden, bevor Inhalte extrahiert werden.

**Playwright MCP vs Playwright-Test-Skripte:** Verwende dieses MCP für explorative, einmalige oder konversationale Automation. Schreibe ein eigentliches Playwright-Test-Skript, wenn du wiederholbare, Versions-kontrollierte Tests brauchst, die in CI bei jedem Push laufen.

**Multi-Step-Flows:** Verkette Tools natürlich in einem einzelnen Prompt. Claude wird `navigate → wait → type → click → screenshot` in der richtigen Reihenfolge sequenzieren ohne, dass du jeden Schritt einzeln spezifizierst.

---
