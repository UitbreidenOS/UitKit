---
description: Entfernen Sie tote CSS, konsolidieren Sie Duplikate, erzwingen Sie Design-Token und beheben Sie Spezifitätsprobleme
argument-hint: "[file-or-directory]"
---
CSS/Styles bereinigen in: $ARGUMENTS

Wenn kein Argument angegeben wird, scannen Sie alle `.css`, `.scss`, `.module.css` und Tailwind-Klassennamen in `src/`.

**Schritt 1 — Entfernung von totem Code**
Identifizieren und löschen Sie:
- CSS-Regeln, deren Selektoren kein Element im JSX/HTML in dieser Codebasis entsprechen (statische Analyse — markieren Sie dynamische Klassennamen als unsicher, löschen Sie sie nicht)
- `@keyframes` Deklarationen, die von keiner `animation` oder `animation-name` Eigenschaft referenziert werden
- CSS benutzerdefinierte Eigenschaften (Variablen), die in `:root` oder einem Komponentenbereich deklariert, aber nie über `var(--name)` gelesen werden
- Auskommentierte Regelblöcke, die älter als der umgebende Code sind (verwenden Sie git blame Heuristik, falls verfügbar)

**Schritt 2 — Konsolidierung von Duplikaten**
- Identische oder nahezu identische Regelmengen, die auf verschiedene Selektoren angewendet werden → extrahieren Sie eine gemeinsame Utility-Klasse oder CSS benutzerdefinierte Eigenschaft
- Wiederholte `margin`, `padding` oder `gap` Werte, die mit einem vorhandenen Design-Token übereinstimmen → ersetzen Sie sie mit dem Token
- Media-Query-Blöcke mit demselben Breakpoint, die über die Datei verteilt sind → führen Sie sie in einen einzigen Block zusammen

**Schritt 3 — Erzwingung von Design-Tokens**
Scannen Sie das Projekt nach einer Token-Quelle: CSS benutzerdefinierte Eigenschaften in `:root`, eine Tailwind-Konfiguration `theme.extend`, eine `tokens.ts` / `theme.ts` Datei oder ein Design-System-Import.
Für jeden gefundenen hart codierten Wert:
- Farben (hex, rgb, hsl): ersetzen Sie diese mit dem nächstliegenden übereinstimmenden Token, falls vorhanden, innerhalb von 5% Wahrnehmungsentfernung; kennzeichnen Sie, falls kein Match vorhanden ist
- Spacing (px, rem Werte): ersetzen Sie diese mit dem übereinstimmenden Spacing-Scale-Token
- Schriftgrößen: ersetzen Sie diese mit dem übereinstimmenden Type-Scale-Token
- Ersetzen Sie keine Werte, die kein angemessenes Token-Äquivalent haben — kennzeichnen Sie diese stattdessen in der Ausgabe

**Schritt 4 — Spezifitäts- und Kaskadenfragen**
- Selektoren mit Spezifität über `(0, 2, 0)` (zwei Klassen) → vereinfachen oder umstrukturieren
- `!important` Deklarationen: entfernen Sie jede und überprüfen Sie, dass die Kaskade ohne sie funktioniert; wenn die Entfernung das Verhalten ändert, notieren Sie es, aber lassen Sie `!important` mit einem erklärenden Kommentar an Ort und Stelle
- Tief verschachteltes SCSS (mehr als 3 Ebenen) → vereinfachen Sie es zu BEM oder Utility-Klassen, die der Projektkonvention entsprechen
- Universal-Selektor `*` mit Nicht-Reset-Eigenschaften → kennzeichnen Sie zur Überprüfung

**Schritt 5 — Ausgabe**
Wenden Sie alle sicheren Änderungen (toter Code, Duplikate, Token-Substitutionen) direkt an.
Für destruktive oder unsichere Änderungen (Selektor-Löschung, die dynamische Klassen beeinflussen könnte, `!important` Entfernung), geben Sie eine Liste aus:
`file:line | issue | recommended action | reason not auto-applied`

Melden Sie Summen: entfernte Zeilen, konsolidierte Regeln, ersetzte Tokens.
