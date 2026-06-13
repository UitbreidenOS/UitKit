---
description: Entfernen Sie tote CSS, konsolidieren Sie Duplikate, erzwingen Sie Design-Token und beheben Sie Spezifitätsprobleme
argument-hint: "[Datei-oder-Verzeichnis]"
---
CSS/Styles bereinigen in: $ARGUMENTS

Wenn kein Argument angegeben wird, scannen Sie alle `.css`, `.scss`, `.module.css` und Tailwind-Klassenzeichenfolgen in `src/`.

**Schritt 1 — Entfernung von totem Code**
Identifizieren und löschen Sie:
- CSS-Regeln, deren Selektoren mit keinem Element im JSX/HTML in dieser Codebasis übereinstimmen (statische Analyse — kennzeichnen Sie dynamische Klassennamen als unsicher, löschen Sie diese nicht)
- `@keyframes`-Deklarationen, auf die keine `animation`- oder `animation-name`-Eigenschaft verweist
- CSS-Custom Properties (Variablen), die in `:root` oder einem Komponenten-Scope deklariert sind, aber nie über `var(--name)` gelesen werden
- Auskommentierte Regelblöcke, die älter als der umgebende Code sind (verwenden Sie git blame-Heuristik, falls verfügbar)

**Schritt 2 — Konsolidierung von Duplikaten**
- Identische oder nahezu identische Regelsets, die auf verschiedene Selektoren angewendet werden → extrahieren Sie eine gemeinsame Utility-Klasse oder CSS-Custom Property
- Wiederholte `margin`-, `padding`- oder `gap`-Werte, die mit einem vorhandenen Design-Token übereinstimmen → ersetzen Sie mit dem Token
- Media Query-Blöcke mit demselben Breakpoint, die über die Datei verteilt sind → führen Sie sie in einen einzigen Block zusammen

**Schritt 3 — Durchsetzung von Design-Token**
Scannen Sie das Projekt nach einer Token-Quelle: CSS-Custom Properties in `:root`, eine Tailwind-Konfiguration `theme.extend`, eine `tokens.ts` / `theme.ts` Datei oder ein Design System-Import.
Für jeden gefundenen hardcodierten Wert:
- Farben (hex, rgb, hsl): ersetzen Sie mit dem am nächsten übereinstimmenden Token, falls einer innerhalb von 5% Wahrnehmungsdistanz vorhanden ist; kennzeichnen Sie, falls keine Übereinstimmung vorhanden ist
- Abstände (px, rem-Werte): ersetzen Sie mit dem entsprechenden Token der Abstands-Skala
- Schriftgrößen: ersetzen Sie mit dem entsprechenden Token der Typ-Skala
- Ersetzen Sie keine Werte, die kein vernünftiges Token-Äquivalent haben — kennzeichnen Sie diese stattdessen in der Ausgabe

**Schritt 4 — Spezifitäts- und Kaskadenprobleme**
- Selektoren mit Spezifität über `(0, 2, 0)` (zwei Klassen) → vereinfachen oder umstrukturieren
- `!important`-Deklarationen: entfernen Sie jede einzelne und überprüfen Sie, dass die Kaskade ohne sie funktioniert; wenn das Entfernen das Verhalten ändert, notieren Sie es, aber behalten Sie `!important` mit einem erklärenden Kommentar bei
- Tief verschachtelte SCSS (mehr als 3 Ebenen) → vereinfachen Sie zu BEM oder Utility-Klassen, die der Projektkonvention entsprechen
- Universal-Selektor `*` mit Nicht-Reset-Eigenschaften → kennzeichnen Sie zur Überprüfung

**Schritt 5 — Ausgabe**
Wenden Sie alle sicheren Änderungen direkt an (toter Code, Duplikate, Token-Substitutionen).
Geben Sie für destruktive oder unsichere Änderungen (Selektorzustand, der dynamische Klassen beeinflussen kann, `!important`-Entfernung) eine Liste aus:
`Datei:Zeile | Problem | empfohlene Maßnahme | Grund für Nicht-Automatisierung`

Meldetotale: entfernte Zeilen, konsolidierte Regeln, ersetzte Token.
