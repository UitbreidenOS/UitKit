---
description: Responsive Layout-Fehler für eine bestimmte Datei oder Komponente identifizieren und beheben
argument-hint: "[Datei] [Breakpoint: sm|md|lg|xl]"
---
Responsive Layout-Probleme beheben in: $ARGUMENTS

Argumente analysieren: Das erste Token ist die Zieldatei; ein optionaler Breakpoint-Name beschränkt den Umfang auf diesen Breakpoint. Wenn kein Breakpoint angegeben ist, werden alle Standard-Breakpoints überprüft.

**Schritt 1 — Breakpoint-System identifizieren**
Durchsuchen Sie das Projekt nach:
- Tailwind-Konfiguration (`tailwind.config.*`) zum Extrahieren benutzerdefinierter Breakpoints
- CSS Custom Properties oder SCSS-Variablen, die Breakpoints definieren
- Media Query-Werte, die in bestehenden Stylesheets verwendet werden
Verwenden Sie die Breakpoint-Namen/Werte des Projekts selbst — erfinden oder überschreiben Sie diese nicht.

**Schritt 2 — Layout an jedem Breakpoint überprüfen**
Suchen Sie nach diesen Fehlmustern:

Overflow und Clipping:
- Feste `width`- oder `height`-Werte in Containern, die flüssig sein sollten
- `min-width` größer als der Viewport bei diesem Breakpoint
- `white-space: nowrap` auf Text, der auf schmalen Bildschirmen überläuft

Flexbox / Grid:
- `flex-wrap: nowrap` verursacht Overflow auf kleinen Bildschirmen
- Grid-Spalten mit `fr`-Einheiten, die auf unlesbare Breiten zusammenbrechen
- Fehlendes `min-width: 0` auf Flex-/Grid-Kindern, die überflüssige Inhalte enthalten

Abstände:
- Feste `padding`- oder `margin`-Werte, die auf dem Mobilgerät überproportional viel Platz verbrauchen
- Absolut positionierte Elemente mit festen Offsets, die ihren Container bei schmalen Breiten verlassen

Typografie:
- `font-size`-Werte, die nicht skalieren — markieren Sie, wenn keine `clamp()`- oder responsive Klasse verwendet wird
- Zeilenlängen (`max-width`), die nicht für kleine Bildschirme angepasst werden

Bilder und Medien:
- Fehlendes `max-width: 100%` auf Bildern in flüssigen Containern
- `aspect-ratio` nicht auf Medien gesetzt, was zu Layout-Verschiebung führt

**Schritt 3 — Fixes anwenden**
Für jeden gefundenen Fehler:
- Bearbeiten Sie die Datei direkt
- Verwenden Sie die responsive Utility-Klassen des Projekts (z. B. Tailwind `sm:`, `md:`) oder Media Queries, die dem bestehenden Muster entsprechen
- Schreiben Sie funktionierenden Code nicht um — nur chirurgische, minimale Bearbeitungen

**Schritt 4 — Bericht**
Nach dem Anwenden der Fixes auflisten: `Datei:Zeile | Breakpoint | Problem | angewendeter Fix`

Wenn die Komponente eine visuelle Überprüfung erfordert, notieren Sie, welche Breakpoints im Browser manuell überprüft werden sollen.
