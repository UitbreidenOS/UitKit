---
description: Einen Speicherleck diagnostizieren und lokalisieren basierend auf einer Symptombeschreibung oder einem Code-Pfad
argument-hint: "[symptom description, file, or function name]"
---
Untersuchen Sie einen Speicherleck auf Grundlage von: $ARGUMENTS

Arbeiten Sie systematisch vor. Spekulieren Sie nicht — verfolgen Sie Allokationspfade.

1. **Etablieren Sie die Leck-Signatur**
   - Wächst die Heap-Auslastung unbegrenzt, oder handelt es sich um einen einmaligen Spitzenwert, der sich nie freimacht?
   - Ist das Leck prozessübergreifend oder auf ein Subsystem beschränkt (z.B. ein Request-Handler, ein Worker-Thread)?
   - Beachten Sie die Sprache/Laufzeit — GC-Sprachen (JS, Python, Go, JVM) haben Lecks anders als manuelle Speicherverwaltungssprachen (C, C++, Rust unsafe).

2. **Identifizieren Sie Kandidatenstellen** — durchsuchen Sie den Code-Pfad in $ARGUMENTS nach:
   - Langlebigen Sammlungen (Caches, Registries, Event-Listener-Maps), die ohne Eviction wachsen
   - Closures oder Lambdas, die große Objekte erfassen, die ihre nützliche Lebensdauer überdauern
   - Zirkulären Referenzen, die Reference-Counting-GCs besiegen (Python, Swift, ObjC)
   - Finalizern oder Destruktoren, die nie aufgerufen werden (Ressourcen-Handles, Datei-Deskriptoren, Sockets)
   - `static` oder Modul-Level-Status, der sich über Requests/Aufrufe hinweg akkumuliert
   - Puffern oder Streams, die allokiert, aber nie geschlossen/geleert werden

3. **Instrumentieren Sie zur Verifizierung** — bevor Sie behaupten, es ist behoben:
   - Fügen Sie einen Heap-Snapshot oder Allokationszähler an der vermuteten Stelle hinzu
   - Schreiben Sie eine Schleife, die den verdächtigen Pfad N mal ausübt und behaupten Sie, dass das Heap-Wachstum begrenzt ist
   - In GC-Sprachen erzwingen Sie eine Collection vor der Messung, um falsche Positive zu vermeiden

4. **Pinnen Sie die verweilende Referenz fest** — folgen Sie der Referenzkette vom durchgesickerten Objekt zurück zu einer GC-Root:
   - Was hält eine Referenz zum durchgesickerten Objekt?
   - Ist sie beabsichtigt (Cache) oder unbeabsichtigt (vergessener Listener, veraltete Closure)?

5. **Schlagen Sie die Reparatur vor** — sobald Sie die verweilende Referenz haben:
   - Begrenzter Cache mit LRU/TTL-Eviction
   - Expliziter Deregister/Cleanup-Aufruf in einem finally/defer/destructor
   - WeakRef oder WeakMap wo starke Eigenschaft nicht benötigt wird
   - Scope-Reduktion, damit das Objekt am Ende des Blocks freigegeben wird

6. **Schreiben Sie einen Regressions-Test** — ein Test, der N mal allokiert/freimacht und behauptet, dass der Peak-RSS oder die Objektanzahl flach bleibt. Instabile Leck-Tests sind schlechter als keine; machen Sie es deterministisch.

Output: die vermuteten Leck-Stelle(n) mit file:line-Referenzen, die verweilende Referenzkette,
und die vorgeschlagene Reparatur. Wenn Sie ohne Code-Ausführung nicht bestätigen können, sagen Sie das explizit.
