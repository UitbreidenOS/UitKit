---
description: Vereinfachen Sie übermäßig komplexe Ausdrücke, Bedingungen und Kontrollfluss ohne Verhaltensänderungen
argument-hint: "[file or file:line-range]"
---
Sie führen einen Vereinfachungsdurchgang auf $ARGUMENTS durch. Das Ziel ist es, die kognitive Last zu reduzieren, ohne das Verhalten zu ändern.

Arbeiten Sie die folgenden Kategorien der Reihe nach ab. Für jede Änderung wenden Sie sie direkt an – listen Sie keine Vorschläge auf.

**Ausdrucksvereinfachung**
- Doppelte Negationen zusammenfassen (`!!x` → `Boolean(x)` oder nur `x`, wenn eine Wahrheitsprüfung ausreicht; `!(a !== b)` → `a === b`)
- Ternäre Operatoren, die tiefer als eine Ebene verschachtelt sind, in frühe Rückgaben oder benannte Variablen reduzieren
- Manuelle Array-/Objektkonstruktion durch idiomatische Äquivalente ersetzen (Spreads, Comprehensions, Destructuring)
- Verkettete `.filter().map()` wo ein einzelnes `.reduce()` oder `.flatMap()` sauberer ist – nur wenn es wirklich Zeilen reduziert und noch lesbar ist

**Bedingungsvereinfachung**
- Konvertieren Sie `if (x) return true; else return false;` → `return x;` (und typisierte Varianten)
- Zusammenführen von Guard-Klauseln: mehrere `if (!a || !b || !c) throw` Muster in eine einzelne Guard
- Ersetzen Sie Switch-/If-Else-Leitern über ein Enum/String mit einer Nachschlagetabelle, wo die Branches einfache Wert-Rückgaben sind
- Entfernen Sie redundante `else` nach `return`, `throw`, `continue` oder `break`

**Kontrollfluss-Vereinfachung**
- Flachen Sie unnötige Verschachtelung ab: wenn der äußere `if` Body nur eine `if` enthält, invertieren Sie die Bedingung und früh-rückgabe
- Entfernen Sie No-Op-Branches (`if (x) { /* nothing */ }`)
- Ersetzen Sie gezählte `for` Schleifen, die ein Array erstellen, mit idiomatischem map/fill/from, wo idiomatisch in der Sprache

**Variablenvereinfachung**
- Inlinen Sie Single-Use-Variablen, die keine Klarheit hinzufügen (`const x = a + b; return x;` → `return a + b;`)
- Entfernen Sie Zwischenvariablen, die nur eine andere Variable aliasieren, ohne Umwandlung

Wenden Sie alle sicheren Änderungen an. Ändern Sie nicht die Logik. Benennen Sie Symbole nicht um, es sei denn, ein Name ist aktiv irreführend. Formatieren Sie Code nicht um, der nicht mit den Vereinfachungen zusammenhängt.

Geben Sie einen einheitlichen Diff aller vorgenommenen Änderungen aus.
