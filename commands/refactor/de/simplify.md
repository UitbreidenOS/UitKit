---
description: Vereinfache übermäßig komplexe Ausdrücke, Bedingungen und Kontrollfluss ohne das Verhalten zu ändern
argument-hint: "[file oder file:line-range]"
---
Du führst einen Vereinfachungspass auf $ARGUMENTS durch. Das Ziel ist, die kognitive Last zu reduzieren, ohne das Verhalten zu verändern.

Arbeite die folgenden Kategorien nacheinander ab. Wende jede Änderung direkt an — stelle keine Vorschläge auf.

**Ausdrucksvereinfachung**
- Reduziere doppelte Negationen (`!!x` → `Boolean(x)` oder nur `x` wo Truthy-Check ausreicht; `!(a !== b)` → `a === b`)
- Reduziere Ternäre, die mehr als eine Ebene tief verschachtelt sind, zu frühen Returns oder benannten Variablen
- Ersetze manuelle Array-/Objektkonstruktion mit idiomatischen Äquivalenten (Spreads, Comprehensions, Destructuring)
- Reduziere verkettete `.filter().map()` wo ein einzelnes `.reduce()` oder `.flatMap()` sauberer ist — nur wenn es wirklich Zeilen spart und noch lesbar ist

**Bedingungsvereinfachung**
- Konvertiere `if (x) return true; else return false;` → `return x;` (und typisierte Varianten)
- Führe Guard-Klauseln zusammen: mehrere `if (!a || !b || !c) throw` Muster in eine einzelne Guard
- Ersetze Switch-/If-Else-Leitern über ein Enum/String mit einer Lookup-Tabelle, wo die Branches einfache Value-Returns sind
- Entferne redundantes `else` nach `return`, `throw`, `continue` oder `break`

**Kontrollflussvereinfachung**
- Flache unnötige Verschachtelung: wenn der äußere `if`-Body nur ein `if` enthält, invertiere die Bedingung und early-return
- Entferne No-Op-Branches (`if (x) { /* nichts */ }`)
- Ersetze gezählte `for`-Schleifen, die ein Array erstellen, mit idiomatischem map/fill/from, wo idiomatisch in der Sprache

**Variablenvereinfachung**
- Inline Single-Use-Variablen, die keine Klarheit hinzufügen (`const x = a + b; return x;` → `return a + b;`)
- Entferne Zwischenvariablen, die nur eine andere Variable aliasen ohne Transformation

Wende alle sicheren Änderungen an. Ändere keine Logik. Benenne Symbole nicht um, es sei denn, ein Name ist aktiv irreführend. Formatiere keinen Code neu, der nicht mit den Vereinfachungen zusammenhängt.

Gib ein einheitliches Diff aller vorgenommenen Änderungen aus.
