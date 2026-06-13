# Claude Design Integration

## Wann aktivieren

- Benutzer hat ein Handoff-Bundle aus Claude Design exportiert und möchte es als Code implementieren
- Benutzer möchte einen Design→Code-Workflow mit Claude Design-Ausgabe einrichten
- Benutzer fragt, wie man einen Claude Design Export in React, HTML oder Framework-Komponenten umwandelt
- Benutzer möchte Design-Token (Farben, Abstände, Typografie) aus einem Claude Design Bundle extrahieren
- Benutzer ordnet Claude Design Component-Anmerkungen einer UI-Bibliothek zu (shadcn/ui, MUI, Tailwind, Radix)

## Wann NICHT verwenden

- UI von Grund auf ohne Design-Eingabe erstellen — verwenden Sie stattdessen einen Code-First-Ansatz
- Mit Figma, Sketch oder anderen Vector-Design-Tools arbeiten — diese Skill ist Claude Design-spezifisch
- Reine Refaktorisierung oder Logik-Arbeit ohne Komponente des visuellen Designs
- Benutzer hat einen Screenshot oder Bild aber kein Claude Design Bundle — handhaben als Standard-Visual-Prompt

## Anweisungen

### Handoff-Bundle empfangen

Bitten Sie den Benutzer, den Bundle-Inhalt vor dem Implementierungsstart zu bestätigen :

```bash
unzip design-handoffs/checkout.bundle -d design-handoffs/checkout/
ls design-handoffs/checkout/
# Erwartet: layout.json, tokens.json, components.md, preview.png
```

Falls das Bundle `tokens.json` enthält, laden Sie es zuerst. Design-Token definieren den gesamten visuellen Vertrag — Farben, Abstände, Schriftgrößen, Kantenradii. Codieren Sie niemals hart Werte, die in der Token-Datei erscheinen.

### Bundle-Dateien platzieren

Standardisieren Sie diesen Ort, um Pfaddrift zwischen Projekten zu vermeiden :

```
project-root/
└── design-handoffs/
    └── <feature-name>/
        ├── layout.json
        ├── tokens.json
        ├── components.md
        └── preview.png
```

Platzieren Sie Bundle-Dateien niemals in `src/` oder neben Anwendungscode.

### Design-Token extrahieren und anwenden

Konvertieren Sie `tokens.json` in das Token-Format des Projekts, bevor Sie Komponenten schreiben :

```typescript
// tokens.json (Claude Design Output)
{
  "color": {
    "primary": "#1A56DB",
    "surface": "#F9FAFB",
    "text-primary": "#111928"
  },
  "spacing": {
    "4": "1rem",
    "6": "1.5rem"
  },
  "radius": {
    "md": "0.5rem"
  }
}
```

Mapping-Beispiele :

| Claude Design Token | Tailwind Klasse | CSS-Variable | shadcn/ui Token |
|--------------------|---------------|--------------|-----------------|
| `color.primary` | `bg-blue-600` | `--color-primary` | `--primary` |
| `spacing.4` | `p-4` | `--spacing-4` | direkte Werte |
| `radius.md` | `rounded-md` | `--radius-md` | `--radius` |

Wenn das Projekt Tailwind verwendet, erweitern Sie `tailwind.config.js` mit extrahierten Token statt Inline-Anwendung.

### Component-Anmerkungen lesen

Öffnen Sie `components.md` vor dem Schreiben von Komponenten-Code. Es listet auf :
- Komponenten-Namen und ihre Design-System-Äquivalente
- Varianten-Namen (z.B. `Button/primary`, `Card/elevated`)
- State-Anmerkungen (hover, focus, disabled, loading)
- Responsive-Verhaltens-Notizen (Stack auf Mobile, Seite-an-Seite auf Desktop)

Prompt-Muster für Component-Implementierung :

```
"Implementiere das [ComponentName] in design-handoffs/checkout/components.md beschrieben.
Nutze shadcn/ui als Basis. Passe die Token-Werte in tokens.json exakt an.
Die Layout-Spezifikation ist in layout.json — nutze es nur für Abstände und Positionierung,
nicht als Pixel-Perfect-Zwang."
```

### Responsive Breakpoints handhaben

Claude Design Bundles enthalten Breakpoint-Anmerkungen in `layout.json`. Ordne sie zu :

```json
// layout.json Breakpoint Sektion
"breakpoints": {
  "mobile": "< 768px",
  "tablet": "768px – 1024px",
  "desktop": "> 1024px"
}
```

In Tailwind : `sm:` ordnet zu Tablet, `lg:` ordnet zu Desktop. Überprüfen Sie dies gegen des Projekts `tailwind.config.js` — Custom Breakpoints können unterscheiden.

### Exakt anpassen vs. als Inspiration nutzen

Nutze explizite Prompt-Formulierungen um den Implementierungs-Vertrag zu setzen :

| Intention | Prompt-Formulierung |
|--------|----------------|
| Exakte Übereinstimmung | "Implementiere dieses Design so nah an Pixel-Perfect, wie die Komponenten-Bibliothek erlaubt. Kennzeichne jede Abweichung." |
| Inspiriert von | "Nutze dieses Design als Referenz für Layout und Farb-Richtung. Adaptiere nach Bedarf für unsere Komponenten-Bibliothek Konventionen." |
| Token-nur | "Ignoriere das Layout; wende nur Design-Token aus tokens.json auf unsere bestehenden Komponenten an." |

Standard auf "inspiriert von" es sei denn, der Benutzer spezifiziert sonst — exakte Übereinstimmungen sind zwischen Design-Tools und UI-Bibliotheken selten erreichbar und produzieren oft brüchiges CSS.

### Implementierung gegen Preview validieren

Nach Komponenten-Generierung, verlange Claude zu vergleichen gegen `preview.png`:

```
"Vergleiche die generierte Komponente gegen design-handoffs/checkout/preview.png.
Listiere alle visuellen Unterschiede — Layout, Farbe, Abstand oder Typografie — und behebendie."
```

## Beispiel

```
Benutzer : "Ich habe eine Checkout-Seite aus Claude Design exportiert. Das Bundle ist in
design-handoffs/checkout-v2.bundle. Generiere die React-Komponente mit
shadcn/ui um sie anzupassen."

Claude Code Workflow :
1. Entzippe Bundle zu design-handoffs/checkout-v2/
2. Lese tokens.json → erweitere tailwind.config.js mit extrahierten Token
3. Lese components.md → identifiziere : CheckoutForm, OrderSummary, PaymentInput Komponenten
4. Lese layout.json → notiere zwei-Spalten-Layout kollapst zu einzelner Spalte auf Mobile
5. Generiere CheckoutPage.tsx using Card, Input, Button von shadcn/ui
6. Wende Token-Klassen an (bg-primary, text-primary, rounded-md) von Tailwind-Erweiterung
7. Verifiziere gegen preview.png, behebe Abstands-Abweichung in OrderSummary Padding
```

---
