# Claude Design — Visual Design Agent by Anthropic Labs

Claude Design ist ein visueller Design Agent — kein traditionelles Design-Tool — der polierte visuelle Arbeiten aus Textbeschreibungen generiert. Er liest Ihr bestehendes Design-System, Ihre Codebase und Brand-Dateien, um brandkonforme Ausgaben zu produzieren, und packt das Ergebnis dann als Handoff-Bundle, mit dem Claude Code direkt arbeiten kann.

---

## Was Claude Design ist

- **Text-to-Design**: Beschreiben Sie, was Sie benötigen, Claude erstellt eine erste Version
- **Design System-bewusst**: Liest Ihre Codebase und Design-Dateien, um Farben, Typografie und vorhandene Komponenten automatisch anzuwenden
- **Conversational Refinement**: Inline-Kommentare, direkte Bearbeitungen, benutzerdefinierte Anpassungsschieber
- **Multi-Format Export**: Interne URLs, Canva, PDF, PPTX, HTML
- **Claude Code Handoff-Bundle**: Packt das Design in ein Entwicklungs-Bundle, das Claude Code verwenden kann
- **Verfügbarkeit**: Forschungsvorschau für Pro-, Max-, Team- und Enterprise-Abonnenten (ab 17. April 2026)

---

## Wie es in einen Claude Code Workflow passt

1. Beginnen Sie in Claude Design — beschreiben Sie das benötigte UI oder visuelle Asset
2. Fügen Sie Ihre Design-System-Token an (Farben, Typografie, Komponentenbibliothek)
3. Verfeinern Sie conversational, bis die Ausgabe Ihrer Absicht entspricht
4. Exportieren → "Send to Claude Code" generiert ein Handoff-Bundle
5. In Claude Code: Referenzieren Sie das Handoff-Bundle, um das Design als Code zu implementieren

Das Handoff-Bundle enthält Layout-Spezifikationen, extrahierte Design-Token, Komponenten-Annotationen und Responsive-Breakpoint-Hinweise — genug für Claude Code, um ohne weitere Design-Interpretation zu implementieren.

---

## Design→Code Handoff Pattern

```bash
# Exportieren Sie aus Claude Design, dann:
unzip checkout-v2.bundle -d design-handoffs/checkout-v2/

# Öffnen Sie Claude Code und referenzieren Sie das Bundle
claude "Implement the checkout page from design-handoffs/checkout-v2/ using shadcn/ui components"
```

Empfohlene Projektstruktur:

```
project-root/
├── design-handoffs/
│   ├── checkout-v2/
│   │   ├── layout.json          # Component tree and positioning
│   │   ├── tokens.json          # Colors, spacing, typography
│   │   ├── components.md        # Component annotations
│   │   └── preview.png          # Visual reference
│   └── landing-v1/
└── src/
```

---

## Design-System anfügen

Claude Design liest Design-Kontext aus drei Quellen:

| Quelle | Wie man anfügt | Was Claude liest |
|--------|---|---|
| Token-Datei | Laden Sie `tokens.json` hoch oder fügen Sie CSS-Variablen ein | Farben, Abstände, Radii, Schriftskalen |
| Komponentenbibliothek | Link zur Storybook-URL oder laden Sie Komponentenscreenshots hoch | Vorhandene Komponentennamen und Varianten |
| Brand-Datei | Brand-PDF oder Style-Guide hochladen | Logo-Nutzung, Typografie-Hierarchie, Ton |
| Codebase | `tailwind.config.js` oder Theme-Datei einfügen | Utility-Klassen-Mappings, Breakpoints |

Je mehr Kontext Sie bereitstellen, desto weniger Korrekturen erfordert die Verfeinerungsschleife.

---

## Anwendungsfälle

- Produkt-Mockups und interaktive Prototypen vor der Sprint-Planung
- Pitch-Decks und Investorenmaterialien ohne Designer im Team
- Marketing-Materialien: One-Pager, Landing-Page-Konzepte, Social Cards
- UI-Exploration vor vollständiger Implementierung — erkunden Sie 3 Richtungen kostengünstig
- Schnelle markengerechte visuelle Assets für Teams ohne dedizierten Designer
- Schnelle Onboarding-Screens, Empty States und Error-State-Designs

---

## Conversational Refinement

Claude Design unterstützt natürlichsprachige Bearbeitungen während der Verfeinerung:

```
"Move the CTA button above the fold"
"Make the heading larger and use our primary brand color"
"Try a version with less whitespace — this is for a dense data dashboard"
"Add a dark mode variant"
"Match the typography from the homepage we uploaded"
```

Jede Anweisung produziert eine neue Version; frühere Versionen werden in der Versionshistorie beibehalten.

---

## Export-Formate

| Format | Am besten für |
|--------|---|
| Handoff-Bundle (`.bundle`) | Claude Code-Implementierung |
| HTML | Statisches Mockup im Browser |
| PDF | Stakeholder-Überprüfung, Druck |
| PPTX | Pitch-Decks, Präsentationen |
| Canva Export | Marketing-Team-Bearbeitung |
| Interne URL | Freigabe in claude.ai |

---

## Einschränkungen (Forschungsvorschau)

- Forschungsvorschau-Status — Funktionen und Export-Formate können sich ohne Vorankündigung ändern
- Kein Vektor-Editor — keine Figma-äquivalente Knoten-Manipulation oder Präzisions-Layout-Tools
- Handoff-Bundle ist eine Entwicklungshilfe, keine Pixel-Perfect-Spezifikation; Claude Code muss das Layout möglicherweise für Responsivität anpassen
- Erfordert claude.ai-Konto für Pro-, Max-, Team- oder Enterprise-Plan
- Nicht geeignet als einzige Quelle der Wahrheit für Produktions-Design-Systeme
- Komplexe Designs mit vielen benutzerdefinierten Komponenten erfordern möglicherweise erhebliche Prompt-Verfeinerung

---
