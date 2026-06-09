---
description: Audit eines Components oder einer Seite auf WCAG 2.1 AA-Verstöße und Ausgabe einer priorisierten Reparaturliste
argument-hint: "[file-or-directory]"
---
Führe eine WCAG 2.1 AA Barrierefreiheits-Audit durch für: $ARGUMENTS

Wenn kein Argument angegeben ist, audite die aktuell geöffnete Datei oder das `src/`-Verzeichnis.

Audit-Checkliste — überprüfe jedes Kriterium und markiere Verstöße mit Datei:Zeile-Referenzen:

**Wahrnehmbar**
- 1.1.1 Nicht-Text-Inhalte: jedes `<img>`, `<svg>`, `<canvas>` hat bedeutungsvolles `alt` oder `aria-label`; dekorative Bilder verwenden `alt=""`
- 1.3.1 Info und Beziehungen: semantisches HTML (`<nav>`, `<main>`, `<header>`, `<section>`, `<article>`) korrekt verwendet; keine Layout-Tabellen
- 1.3.2 Aussagekräftige Sequenz: DOM-Reihenfolge entspricht visueller Reihenfolge; keine CSS-basierte Neuordnung, die den Screen-Reader-Fluss unterbricht
- 1.4.1 Farbnutzung: Informationen werden nicht nur durch Farbe vermittelt
- 1.4.3 Kontrast: Textkontrast ≥ 4,5:1 (normal), ≥ 3:1 (groß); überprüfe berechnete Farbwerte
- 1.4.4 Textgröße anpassen: Layout bleibt bei 200% Zoom ohne horizontalen Scroll oder Inhaltsverlust erhalten
- 1.4.10 Reflow: kein zwei-dimensionales Scrollen bei 320px Viewport-Breite

**Bedienbar**
- 2.1.1 Tastatur: alle interaktiven Elemente erreichbar und bedienbar nur über die Tastatur
- 2.1.2 Keine Tastaturfalle: Fokus kann immer jedes Component verlassen
- 2.4.3 Fokusreihenfolge: logische Tab-Sequenz entspricht visuellem Fluss
- 2.4.7 Fokus sichtbar: alle fokussierbaren Elemente haben einen sichtbaren Fokus-Indikator (nicht nur Browser-Standard)
- 2.4.6 Überschriften und Labels: Überschriften sind hierarchisch korrekt (h1 → h2 → h3); keine übersprungenen Ebenen

**Verständlich**
- 3.1.1 Sprache der Seite: `<html lang="...">` ist korrekt gesetzt
- 3.2.2 Bei Eingabe: keine unerwarteten Kontextwechsel beim Fokus oder bei der Eingabe
- 3.3.1 Fehleridentifikation: Formulärfehler werden in Text identifiziert und via `aria-describedby` dem Feld zugeordnet
- 3.3.2 Labels oder Anweisungen: jedes Formularfeld hat ein sichtbares Label oder `aria-label`

**Robust**
- 4.1.2 Name, Rolle, Wert: benutzerdefinierte interaktive Components geben korrekte ARIA-Rolle, Status und Eigenschaft preis
- 4.1.3 Statusmeldungen: dynamischer Inhalt nutzt `aria-live`-Regionen angemessen

Ausgabeformat:
1. Zusammenfassungszeile: `N Verstöße gefunden (X kritisch, Y schwerwiegend, Z moderat)`
2. Verstöße-Tabelle: `| file:line | criterion | severity | issue | fix |`
3. Nach der Tabelle die reparierte Code für jeden Verstoß inline ausgeben — nicht nur Änderungen beschreiben, sondern anwenden

Schweregrad-Skala: kritisch (blockiert Screen-Reader-Benutzer), schwerwiegend (WCAG-Fehler), moderat (Best-Practice-Lücke).
