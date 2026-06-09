---
description: Identifizieren und Löschen von unerreichbarem, unbenutztem oder veraltetes Code
argument-hint: "[file or directory]"
---
Führen Sie einen Dead-Code-Entfernungspass auf $ARGUMENTS durch.

1. Lesen Sie jede Datei im Scope. Erstellen Sie eine mentale Karte von:
   - Exportierten vs. internen Symbolen
   - Funktionen, Variablen, Typen, Konstanten, Importe, die deklariert, aber nie referenziert werden
   - Branches, die nie erreicht werden können (z.B. Code nach unconditional return, Bedingungen, die aufgrund konstanter Werte immer true/false sind)
   - Feature Flags oder Umgebungsvariablenschutzvorrichtungen, die dauerhaft an oder aus sind, gegeben den aktuellen Zustand der Codebasis
   - Kommentierte Code-Blöcke — entfernen Sie diese, es sei denn, sie enthalten einen datierten Rationale-Kommentar

2. Für jedes tote Symbol oder Block, das gefunden wurde:
   - Bestätigen Sie, dass es nicht über dynamische Zuordnung, Reflection, stringbasierte Suche oder einen externen Anrufer außerhalb des gescannten Scope referenziert wird. Im Zweifelsfall sagen Sie dies und überspringen Sie.
   - Löschen Sie die Deklaration und alle damit verbundenen lokalen Gerüste (zugehörige Typ-Aliase, Hilfsvariablen, die nur von ihr verwendet werden, Re-Exporte, die nur ihr Exposé sind).

3. Entfernen Sie nach jeder Löschung alle Importe oder Requires, die jetzt unbenutz sind.

4. Formatieren, benennen oder strukturieren Sie nichts anderes um. Nur Dead-Code-Entfernung.

5. Geben Sie eine Liste jedes entfernten Elements aus: Symbolname, Datei, Zeilenbereich und Grund (unbenutz / unerreichbar / ersetzt).

6. Wenn ein Symbol tot aussieht, aber einen Kommentar für zukünftige Verwendung hat oder Teil eines öffentlichen API-Vertrags ist (z.B. aus einer Bibliotheks-Index-Datei exportiert), kennzeichnen Sie ihn statt ihn zu löschen.

Constraints:
- Entfernen Sie keinen Code nur, weil er redundant aussieht — er muss nachweislich nicht referenziert oder erreichbar sein.
- Berühren Sie Test-Dateien nicht, es sei denn, das Argument schließt sie explizit ein.
- Wenn eine Entfernung das beobachtbare Verhalten ändern würde (z.B. ein Effekt-vollständiger Import), kennzeichnen Sie es und löschen Sie es nicht.
