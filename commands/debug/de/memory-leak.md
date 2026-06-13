---
description: Diagnose und lokalisiere ein Speicherleck basierend auf einer Symptombeschreibung oder Code-Pfad
argument-hint: "[Symptombeschreibung, Datei oder Funktionsname]"
---
Untersuche ein Speicherleck basierend auf: $ARGUMENTS

Arbeite systematisch vor. Nicht raten — trace Allokationspfade.

1. **Etabliere die Leck-Signatur**
   - Wächst die Heap-Nutzung unbegrenzt, oder ist es ein einmaliger Spike, der nie freigegeben wird?
   - Ist das Leck prozessweit oder isoliert auf ein Subsystem (z.B. ein Request-Handler, ein Worker-Thread)?
   - Notiere die Sprache/Runtime — GC-Sprachen (JS, Python, Go, JVM) lecken anders als manuelle Speicherverwaltungssprachen (C, C++, Rust unsafe).

2. **Identifiziere Kandidatenstellen** — scanne den Code-Pfad in $ARGUMENTS nach:
   - Langlebige Sammlungen (Caches, Registrare, Event-Listener-Maps), die ohne Ausviction wachsen
   - Closures oder Lambdas, die große Objekte erfassen, die ihren nützlichen Umfang überleben
   - Zirkelbezüge, die Reference-Counting-GCs besiegen (Python, Swift, ObjC)
   - Finalizer oder Destruktoren, die nie aufgerufen werden (Ressourcen-Handles, Datei-Deskriptoren, Sockets)
   - `static` oder Modul-Level-Status, der über Requests/Aufrufe hinweg akkumuliert
   - Buffer oder Streams, die allokiert aber nie geschlossen/geleert werden

3. **Instrumentiere zur Verifizierung** — bevor du behauptest, es ist behoben:
   - Füge einen Heap-Snapshot oder Allokations-Zähler an der verdächtigen Stelle hinzu
   - Schreibe eine Schleife, die den verdächtigen Pfad N-mal ausführt und bestätige, dass das Heap-Wachstum begrenzt ist
   - In GC-Sprachen erzwinge eine Kollektion vor dem Messen, um falsche Positive zu vermeiden

4. **Pinpoint die beibehaltende Referenz** — folge der Referenzkette vom geleakten Objekt zurück zu einer GC-Root:
   - Was hält eine Referenz zum geleakten Objekt?
   - Ist es beabsichtigt (Cache) oder unbeabsichtigt (vergessener Listener, abgelaufener Closure)?

5. **Schlag die Behebung vor** — sobald du die beibehaltende Referenz hast:
   - Begrenzter Cache mit LRU/TTL-Ausviction
   - Expliziter Deregister/Cleanup-Aufruf in einem finally/defer/Destruktor
   - WeakRef oder WeakMap, wo starke Eigentumsrechte nicht nötig sind
   - Scope-Reduzierung, damit das Objekt am Ende des Blocks freigegeben wird

6. **Schreibe einen Regressions-Test** — ein Test, der N-mal allokiert/freigibt und bestätigt, dass Peak-RSS oder
   Objektanzahl flach bleibt. Flaky Leak-Tests sind schlimmer als keine; mache sie deterministisch.

Output: die verdächtige(n) Leck-Stelle(n) mit file:line Referenzen, die beibehaltende Referenzkette,
und die vorgeschlagene Behebung. Falls du nicht ohne Ausführung des Codes bestätigen kannst, sage es explizit.
