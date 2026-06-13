# Barrierefreiheit-Regeln

## Anwendungsbereich
Gesamter UI-Code — HTML, JSX, TSX, Template-Engines, Design-System-Komponenten.

## Regeln

1. **Semantisches HTML zuerst** — verwenden Sie `<button>`, `<nav>`, `<main>`, `<article>`, `<header>` vor `<div>` + ARIA. Das richtige Element vermittelt Rolle, Status und Tastaturverhalten automatisch.

2. **Jedes interaktive Element muss tastaturgesteuert sein** — fokussierbar, aktivierbar mit Eingabe/Leerzeichen, navigierbar mit Tab/Shift-Tab. Unterdrücken Sie die Fokus-Kontur niemals ohne einen gleichwertigen visuellen Indikator.

3. **Alle Bilder benötigen `alt`-Text** — dekorative Bilder verwenden `alt=""`. Aussagekräftige Bilder beschreiben den Inhalt, nicht das Aussehen: `alt="Fehler: Formularübermittlung fehlgeschlagen"` nicht `alt="rotes Symbol"`.

4. **Farbe allein kann keine Bedeutung vermitteln** — kombinieren Sie Farbe mit Text, Symbol oder Muster. Ein roter Rahmen bei einem ungültigen Feld benötigt eine Fehlermeldung. Diagramme benötigen beschriftete Datenpunkte oder Muster.

5. **Mindestkontrastverhältnis: 4,5:1 für normalen Text, 3:1 für großen Text und UI-Komponenten** — testen Sie mit einem Tool (axe, Lighthouse, Stark). Niemals den Kontrast schätzen.

6. **Beschriften Sie jedes Formularsteuerelement** — verwenden Sie `<label for="id">` oder `aria-label` oder `aria-labelledby`. Platzhaltertext ist keine Beschriftung — er verschwindet und hat niedrigenkontrast.

7. **Kündigen Sie Änderungen an dynamischen Inhalten an** — wenn sich der Inhalt ohne Neuladen der Seite aktualisiert, verwenden Sie `aria-live="polite"` für nicht dringende Updates, `aria-live="assertive"` nur für Fehler oder zeitgebundene Warnungen.

8. **Entfernen Sie `tabindex="-1"` niemals, um Elemente von der Tastatur zu verbergen, ohne sie auch visuell zu verbergen** — verwenden Sie `display: none` oder `visibility: hidden` oder das `hidden`-Attribut, um sie gleichzeitig aus der Fokusreihenfolge und aus dem visuellen Fluss zu entfernen.

9. **Benutzerdefinierte Widgets müssen das ARIA Authoring Practices-Muster implementieren** — modale Fenster fangen den Fokus ein. Menüs verwenden Pfeiltasten. Akkordeons verwenden Eingabe/Leerzeichen. Erfinden Sie nicht Ihre eigenen Interaktionsmodelle.

10. **Testen Sie mit einem Bildschirmleser vor dem Versand der interaktiven UI** — VoiceOver (macOS/iOS) oder NVDA (Windows). Automatisierte Tools erfassen etwa 30 % der Probleme; manuelle Tests sind unabdingbar für kritische Abläufe.

11. **Überschriften bilden eine logische Gliederung, überspringen Sie niemals Ebenen** — `h1` → `h2` → `h3`. Überschriften vermitteln die Dokumentstruktur, nicht die visuelle Größe. Verwenden Sie CSS für die Größe.

12. **Fehlermeldungen sind spezifisch und dem Feld zugeordnet** — „Erforderlich" ist unzureichend. „E-Mail-Adresse ist erforderlich" kombiniert mit `aria-describedby`, das auf das Fehlerelement verweist, ist korrekt.

13. **Stellen Sie Audio- oder Videowiedergabe mit Ton nicht automatisch ab** — stellen Sie Wiedergabe-/Pausenschaltflächen bereit. Blitzende Inhalte über 3 Hz können Anfälle auslösen — vermeiden Sie sie oder geben Sie eine Warnung aus.

14. **Touch-Ziele mindestens 44 × 44 CSS-Pixel** — gilt für mobile und Touch-Schnittstellen. Kleine Ziele scheitern bei Benutzern mit Motorischen Beeinträchtigungen und Daumen.

15. **Führen Sie `axe-core` oder `eslint-plugin-jsx-a11y` in CI aus** — erfassen Sie Rückgänge automatisch. Null Barrierefreiheitsverstöße bei automatisierten Überprüfungen ist das Minimum, nicht die Obergrenze.


---
