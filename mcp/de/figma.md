# MCP: Figma

Lese Figma-Designs direkt in Claude Code. Extrahiere Komponenten-Specs, Farb-Tokens, Typografie-Skalen, Layer-Struktur und exportiere Assets — und generiere dann sofort Code, der dem Design entspricht, ohne zwischen Browser-Tabs und Terminal zu wechseln.

## Warum du das brauchst

Die Lücke zwischen Design und Implementierung ist, wo Konsistenz zusammenbricht. Mit Figma MCP:
- Claude liest die tatsächliche Spezifikation, statt sich auf deine Beschreibung davon zu verlassen
- Farb-Tokens, Spacing-Werte und Typografie-Skalen kommen direkt aus der Source of Truth
- Komponenten werden mit den richtigen Dimensionen generiert, nicht Approximationen
- Design-Kommentare (offene Fragen, Redline-Notizen) sind programmgesteuert zugänglich
- Du kannst eine Live-Implementierung gegen die Figma-Spezifikation in einer einzelnen Frage vergleichen

## Installation

```bash
npm install -g figma-mcp
```

## Konfiguration

Füge zu `~/.claude.json` oder project `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["figma-mcp"],
      "env": {
        "FIGMA_API_TOKEN": "your-figma-personal-access-token"
      }
    }
  }
}
```

## Schlüssel-Tools

- `get_file` — hole die vollständige Struktur einer Figma-Datei (alle Frames, Komponenten und Layers)
- `get_node` — hole einen bestimmten Frame, eine Komponente oder einen Layer nach Node-ID
- `get_styles` — extrahiere alle Farb-, Typografie- und Effekt-Stile, die in der Datei definiert sind
- `get_components` — liste jede Komponente in der Datei mit ihren Eigenschaften auf
- `get_comments` — lese Design-Kommentare, nützlich zum Markieren offener Fragen oder ausstehender Entscheidungen
- `export_node` — exportiere jeden Node als PNG, SVG oder PDF bei einer bestimmten Skalierung
- `get_file_versions` — zeige die Versionsverlauf einer Datei an

## Verwendungsbeispiele

```
Lese das Design für die Checkout-Seite (Node-ID: 123:456) und generiere
die React-Komponente mit Tailwind-Klassen, die den Spacing,
Farben und Typografie in der Spezifikation genau entsprechen.
```

```
Extrahiere alle Farb-Stile aus unserer Design-System-Datei
(Datei-Schlüssel: aBcDeFgHiJkL) und generiere eine Tailwind-Theme-Konfiguration
mit den richtigen Hex-Werten und Token-Namen.
```

```
Hole die Typografie-Skala aus unserer Figma-Design-Datei und erstelle
ein CSS-Custom-Properties-Sheet mit --font-size-xs bis --font-size-4xl.
```

```
Liste alle offenen Design-Kommentare in der Datei auf und erstelle ein GitHub-Issue
für jeden, getaggt mit dem Label 'design-feedback'.
```

```
Vergleiche die Button-Komponente in der Figma-Datei mit unserer aktuellen
Implementierung in src/components/Button.tsx und liste visuelle
Unterschiede in Spacing, Farbe oder Font-Weight auf.
```

## Authentifizierung

1. Melde dich in Figma an und öffne **Account settings** (klicke auf deinen Avatar → Settings)
2. Navigiere zu **Security** → **Personal access tokens**
3. Klicke auf **Generate new token**, gib ihm einen Namen ein und kopiere den Wert
4. Ein Read-only-Token reicht für alle Lese-/Export-Operationen aus — keine Write-Scopes nötig, es sei denn, du möchtest Kommentare erstellen

Setze das Token als `FIGMA_API_TOKEN` im Konfig-Block oben. Committe es nicht in Version Control.

## Tipps

**Finde Datei-Schlüssel und Node-IDs:** Der Datei-Schlüssel ist der String zwischen `/file/` und dem nächsten `/` in der Figma-URL. Die Node-ID ist der Wert des `node-id`-Query-Parameters (z.B. `node-id=123-456` → verwende `123:456` mit Doppelpunkt).

**Rate Limits:** Die Figma REST API erlaubt 600 Requests pro Minute. Für große Design-Systeme mit Hunderten von Komponenten, batch deine Abfragen, statt über jeden Node einzeln zu loopen.

**Exportiere Assets:** `export_node` gibt Binärdaten zurück. Sage Claude, wohin die Datei geschrieben werden soll: `"Exportiere Node 123:456 als SVG und speichere es in src/assets/icons/arrow.svg"`.

**Kombiniere Tools:** Verwende zuerst `get_styles`, um deine Token-Map zu bauen, dann `get_node` für einzelne Komponenten. Das verhindert redundante API-Aufrufe beim Generieren eines vollständigen Design-Systems.

**Visual-Diff-Workflow:** Mache einen Screenshot der implementierten Komponente mit Playwright MCP, hole dann die Figma-Spezifikation mit diesem Server. Bitte Claude, die beiden nebeneinander zu vergleichen und Unterschiede aufzulisten.

---
