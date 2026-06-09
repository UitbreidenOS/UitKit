---
description: Duplizierte Logik, Daten oder Strukturen finden und eliminieren
argument-hint: "[file or directory]"
---
Dedupliziere Code in $ARGUMENTS.

1. Durchsuche den Bereich auf Duplikate:
   - Identische oder nahezu identische Funktionsbodies (>5 Zeilen mit trivialen Unterschieden)
   - Copy-Paste-Datenstrukturen oder Konfigurationsblöcke mit geringfügigen Unterschieden
   - Wiederholte Inline-Logik, die einmalig extrahiert werden könnte (z.B. die gleiche Validierung, der gleiche Sortierkomparator, die gleiche Transformation)
   - Duplizierte Typ-Definitionen oder Interface-Deklarationen
   - Mehrere Funktionen, die sich nur durch einen einzelnen Parameterwert unterscheiden — Kandidaten für Parametrisierung

2. Für jeden gefundenen Duplikat-Cluster:
   - Identifiziere die kanonische Version, die beibehalten werden soll (bevorzuge die vollständigste, am besten benannte oder zuletzt geänderte)
   - Bestimme, ob die Kopien sich in den Daten unterscheiden (→ parametrisieren) oder im Verhalten (→ beibehalten, sie sind keine Duplikate)
   - Erstelle eine einzige gemeinsame Implementierung: extrahiere eine Funktion, Konstante oder einen Typ nach Bedarf

3. Ersetze alle duplizierten Stellen durch Aufrufe der gemeinsamen Implementierung. Lasse die alten Kopien nicht an Ort und Stelle.

4. Nach der Ersetzung entferne alle Importe oder Hilfsfunktionen, die nur zur Unterstützung der gelöschten Kopien existierten.

5. Ausgabe: Für jede Deduplizierung liste das erstellte gemeinsame Symbol auf, wie viele Stellen ersetzt wurden, und wo sich jede befand.

Einschränkungen:
- „Ähnlich" ist nicht „dupliziert". Führe nur Code zusammen, der die gleiche Absicht und Semantik hat — erzwinge nicht, verwandte Code-Teile in eine gemeinsame Abstraktion zu zwingen, nur weil sie ähnlich aussehen.
- Führe eine neue Abstraktionsebene (Klasse, Modul, Mixin) nicht nur ein, um ein einzelnes Paar von zwei Funktionen zu deduplizieren. Eine einfache Funktionsextraktion ist ausreichend.
- Bewahre alle vorhandenen Verhaltensweisen. Wenn das Zusammenfassen von Duplikaten subtile Änderungen an einer Aufrufstelle erfordert, markiere diese ausdrücklich.
- Dedupliziere keine Tests — Test-Redundanz ist oft absichtlich.
