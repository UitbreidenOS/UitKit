---
description: Race Conditions in nebenläufigem oder asynchronem Code identifizieren und beheben
argument-hint: "[file, function, or symptom description]"
---
Analysiere auf Race Conditions: $ARGUMENTS

Race Conditions sind Fehler, die von der Ausführungsreihenfolge abhängen. Betrachte dies als Beweis-Problem, nicht als Vermutung.

1. **Gemeinsamen Zustand abbilden**
   - Listet jede Variable, Datenstruktur oder Ressource auf, auf die von mehr als einer Goroutine/Thread/Async-Kette zugegriffen wird
   - Für jeden: Identifiziere alle Lesezugriffe und alle Schreibzugriffe
   - Notiere, ob Zugriffe bewacht sind (Lock, Atomic, Channel, Mutex, Semaphore) oder unbewacht

2. **Gefahrentyp identifizieren**
   - Read-Write-Race: ein Schreiber, ein oder mehrere gleichzeitige Leser, keine Synchronisierung
   - Write-Write-Race: zwei Schreiber, keine Synchronisierung
   - Check-then-Act: Bedingung wird geprüft, dann Aktion ausgeführt, mit einem Fenster dazwischen (klassisches TOCTOU)
   - ABA-Problem: Wert wird geprüft, extern geändert, dann zurückgeändert — Prüfung scheint zu bestehen, aber Zustand ist falsch
   - Initialisierungs-Race: Lazy-Init-Muster ohne Once-Guard

3. **Konkrete Verschachtelung konstruieren** — schreibe die spezifische Thread/Task-Verschachtelung auf, die den Fehler verursacht:
   ```
   Thread A                    Thread B
   reads x == 0
                               writes x = 1
   writes x = 0 (stale read)
   ```
   Wenn du keine konkrete Verschachtelung konstruieren kannst, hast du das Race nicht gefunden.

4. **Sprachspezifische Fallen prüfen**
   - JS/TS: Async-Lücken zwischen `await`-Punkten sind Verschachtelungsfenster — jeder gemeinsame Zustand, der über Awaits mutiert wird, ist verdächtig
   - Go: Map-Lese-/Schreibzugriffe sind nicht gleichzeitig sicher; Goroutine-Closures, die Schleifenvariablen erfassen
   - Python: GIL schützt nicht zusammengesetzte Operationen; `asyncio`-Lücken zwischen `await`-Punkten
   - Java/Kotlin: Sichtbarkeitsprobleme (nicht-volatile Felder), Double-Checked-Locking-Antimuster

5. **Fix vorschlagen** — passe den Fix an die Gefahr an:
   - Read-Write / Write-Write: Mutex, RWMutex, Atomic CAS oder Channel
   - Check-then-Act: verschiebe die Prüfung in das Lock oder nutze Atomic Compare-and-Swap
   - Initialisierung: `sync.Once`, `std::call_once`, Modul-Level-Init oder Lock um Lazy Init
   - Async-Lücken: halte alle gemeinsamen Zustände in lokalen Variablen vor dem ersten Await oder nutze unveränderliche Snapshots

6. **Stress-Test schreiben** — ein Test, der den gleichzeitigen Pfad unter hoher Contention ausführt (z.B. 100 Goroutines, enge Schleife) mit `-race` / Thread Sanitizer / Helgrind aktiviert. Bestätige, dass es sauber besteht.

Ausgabe: die gemeinsame Zustandskarte, die konkrete fehlerhafte Verschachtelung, der Fix mit Datei:Zeile-Edits und der Test. Schlag nicht „eine Verzögerung hinzufügen" oder „Retry" als Fixes vor — diese maskieren Races.
