---
description: Identifizieren und Beheben von Responsive-Layout-Fehlern für eine bestimmte Datei oder Komponente
argument-hint: "[file] [breakpoint: sm|md|lg|xl]"
---
Responsive Layout Probleme beheben in: $ARGUMENTS

Argumente parsen: Das erste Token ist die Zieldatei; ein optionaler Breakpoint-Name begrenzt den Umfang auf diesen Breakpoint. Wenn kein Breakpoint angegeben wird, werden alle Standard-Breakpoints überprüft.

**Schritt 1 — Breakpoint-System identifizieren**
Projekt scannen auf:
- Tailwind Config (`tailwind.config.*`) um benutzerdefinierte Breakpoints zu extrahieren
- CSS Custom Properties oder SCSS-Variablen, die Breakpoints definieren
- Media Query Werte, die in bestehenden Stylesheets verwendet werden
Die Breakpoint-Namen und Werte des Projekts konsistent verwenden — nicht erfinden oder überschreiben.

**Schritt 2 — Layout bei jedem Breakpoint überprüfen**
Auf diese Fehlermuster prüfen:

Überlauf und Abschnitt:
- Feste `width` oder `height` Werte auf Containern, die fluid sein sollten
- `min-width` größer als das Viewport bei diesem Breakpoint
- `white-space: nowrap` auf Text, der auf schmalen Bildschirmen überläuft

Flexbox / Grid:
- `flex-wrap: nowrap` verursacht Überlauf auf kleinen Bildschirmen
- Grid-Spalten mit `fr` Einheiten, die auf unlesbare Breiten zusammenfallen
- Fehlende `min-width: 0` auf Flex/Grid-Kindern, die überlauffähigen Inhalt enthalten

Abstände:
- Feste `padding` oder `margin` Werte, die disproportionalen Platz auf mobilen Geräten verbrauchen
- Absolut positionierte Elemente mit festen Offsets, die ihren Container bei schmalen Breiten verlassen

Typografie:
- `font-size` Werte, die nicht skaliert werden — Flagge, falls keine `clamp()` oder responsive Klasse verwendet wird
- Zeilenlängen (`max-width`) nicht an kleine Bildschirme angepasst

Bilder und Medien:
- Fehlende `max-width: 100%` auf Bildern in fluid Containern
- `aspect-ratio` nicht gesetzt auf Medien, die Layout-Verschiebung verursachen

**Schritt 3 — Fixes anwenden**
Für jedes gefundene Problem:
- Datei direkt bearbeiten
- Responsive Utility-Klassen des Projekts verwenden (z.B. Tailwind `sm:`, `md:`) oder Media Queries, die dem bestehenden Muster entsprechen
- Funktionierenden Code nicht umschreiben — nur chirurgische, minimale Änderungen

**Schritt 4 — Bericht**
Nach dem Anwenden von Fixes: `file:line | breakpoint | issue | fix applied`

Wenn die Komponente visuelle Verifizierung benötigt, notieren Sie, welche Breakpoints manuell im Browser überprüft werden sollten.
