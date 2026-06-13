---
description: Überprüfe eine Komponente oder Seite auf WCAG 2.1 AA Verstöße und gebe eine priorisierte Behebungsliste aus
argument-hint: "[Datei-oder-Verzeichnis]"
---
Führe eine WCAG 2.1 AA Accessibility-Überprüfung durch auf: $ARGUMENTS

Falls kein Argument gegeben wird, überprüfe die aktuell geöffnete Datei oder das `src/`-Verzeichnis.

Überprüfungs-Checkliste — evaluiere jedes Kriterium und kennzeichne Verstöße mit Datei:Zeile Verweise:

**Wahrnehmbar (Perceivable)**
- 1.1.1 Nicht-Text-Inhalte: jedes `<img>`, `<svg>`, `<canvas>` hat aussagekräftiges `alt` oder `aria-label`; dekorative Bilder verwenden `alt=""`
- 1.3.1 Information und Beziehungen: semantisches HTML (`<nav>`, `<main>`, `<header>`, `<section>`, `<article>`) wird korrekt verwendet; keine Layout-Tabellen
- 1.3.2 Sinnvolle Sequenz: DOM-Reihenfolge stimmt mit visueller Reihenfolge überein; keine CSS-Neuanordnung, die den Screenreader-Fluss unterbricht
- 1.4.1 Farbe: Information wird nicht nur durch Farbe vermittelt
- 1.4.3 Kontrast: Text-Kontrast ≥ 4,5:1 (normal), ≥ 3:1 (groß); überprüfe berechnete Farbwerte
- 1.4.4 Textgröße ändern: Layout funktioniert bei 200% Zoom ohne horizontales Scrollen oder Inhaltsverlust
- 1.4.10 Reflow: kein zweidimensionales Scrollen bei 320px Viewport-Breite

**Bedienbar (Operable)**
- 2.1.1 Tastatur: alle interaktiven Elemente sind nur über Tastatur erreichbar und bedienbar
- 2.1.2 Keine Tastaturfalle: Fokus kann jede Komponente immer verlassen
- 2.4.3 Fokusreihenfolge: logische Tabulatoren-Sequenz stimmt mit visueller Abfolge überein
- 2.4.7 Fokus sichtbar: alle fokussierbaren Elemente haben einen sichtbaren Fokus-Indikator (nicht nur Browser-Standard)
- 2.4.6 Überschriften und Beschriftungen: Überschriften sind hierarchisch korrekt (h1 → h2 → h3); keine übersprungenen Ebenen

**Verständlich (Understandable)**
- 3.1.1 Sprache der Seite: `<html lang="...">` ist korrekt gesetzt
- 3.2.2 Bei Eingabe: keine unerwarteten Kontextwechsel bei Fokus oder Eingabe
- 3.3.1 Fehleridentifikation: Formularfehler werden im Text identifiziert und mittels `aria-describedby` mit dem Feld verknüpft
- 3.3.2 Beschriftungen oder Anweisungen: jedes Formularfeld hat eine sichtbare Beschriftung oder `aria-label`

**Robust (Robust)**
- 4.1.2 Name, Rolle, Wert: benutzerdefinierte interaktive Komponenten zeigen korrekte ARIA-Rolle, -Status und -Eigenschaft
- 4.1.3 Status-Meldungen: dynamischer Inhalt verwendet `aria-live` Regionen angemessen

Ausgabeformat:
1. Zusammenfassungszeile: `N Verstöße gefunden (X kritisch, Y schwerwiegend, Z moderat)`
2. Verstöße-Tabelle: `| Datei:Zeile | Kriterium | Schweregrad | Problem | Behebung |`
3. Nach der Tabelle gebe den behobenen Code für jeden Verstoß inline aus — beschreibe nicht nur Änderungen, wende sie an

Schweregrad-Skala: kritisch (blockiert Screenreader-Nutzer), schwerwiegend (WCAG-Fehler), moderat (Best-Practice-Lücke).
