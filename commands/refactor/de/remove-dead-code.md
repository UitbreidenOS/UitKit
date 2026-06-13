---
description: Unerreichbaren, ungenutzten oder veralteten Code identifizieren und löschen
argument-hint: "[Datei oder Verzeichnis]"
---
Führe einen Dead-Code-Entfernungs-Durchgang auf $ARGUMENTS durch.

1. Lese jede Datei im Geltungsbereich. Erstelle eine mentale Karte von:
   - Exportierten vs. internen Symbolen
   - Funktionen, Variablen, Typen, Konstanten, Imports, die deklariert, aber nie referenziert werden
   - Branches, die nie erreicht werden können (z.B. Code nach bedingungslosem Return, Bedingungen, die aufgrund von Constantwerten immer wahr/falsch sind)
   - Feature Flags oder Umgebungsvariablen-Guards, die dauerhaft ein oder aus sind, je nach aktuellem Zustand der Codebasis
   - Auskommentierte Code-Blöcke — entferne sie, es sei denn, sie enthalten einen Kommentar mit Datumsbezug

2. Für jedes tote Symbol oder jeden toten Block, der gefunden wird:
   - Bestätige, dass es nicht über dynamisches Dispatching, Reflection, stringbasierte Lookups oder einen externen Aufrufer außerhalb des gescannten Bereichs referenziert wird. Falls unsicher, gib das an und überspringe es.
   - Lösche die Deklaration und alle zugehörige lokale Gerüste (zugehörige Type Aliases, Hilfsvariablen, die nur von ihr verwendet werden, Re-Exports, die nur sie freilegen).

3. Nach jeder Löschung entferne alle Imports oder Requires, die nun ungenutzt sind.

4. Formatiere, benenne oder strukturiere nichts anderes um. Nur Dead-Code-Entfernung.

5. Gib eine Liste aller entfernten Elemente aus: Symbolname, Datei, Zeilenbereich und Grund (ungenutzt / unerreichbar / überholt).

6. Falls ein Symbol tot zu sein scheint, aber einen Kommentar zur zukünftigen Verwendung enthält oder Teil eines öffentlichen API-Vertrags ist (z.B. aus einer Index-Datei einer Bibliothek exportiert), markiere es statt es zu löschen.

Einschränkungen:
- Entferne Code nicht nur, weil er redundant aussieht — er muss nachweislich unreferenziert oder unerreichbar sein.
- Berühre Test-Dateien nicht, es sei denn, das Argument schließt sie explizit ein.
- Falls die Entfernung beobachtbares Verhalten ändern würde (z.B. ein Import mit Nebenwirkungen), markiere es und lösche es nicht.
