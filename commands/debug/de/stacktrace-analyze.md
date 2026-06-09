---
description: Stack Trace analysieren, um Grundursache, Call Chain und umsetzbare Lösung zu identifizieren
argument-hint: "[paste stack trace]"
---
Analysieren Sie den folgenden Stack Trace und erstellen Sie eine präzise, umsetzbare Diagnose.

Stack Trace:
$ARGUMENTS

Arbeiten Sie systematisch vor:

1. **Trace analysieren** — identifizieren Sie die Sprache und Laufzeit (Python, JVM, Go, Node, Rust, .NET, etc.). Beachten Sie den Exception-/Fehlertyp und die Nachricht oben im Trace.

2. **Call Chain nachvollziehen** — beginnend mit dem ursprünglichen Wurfpunkt (tiefster relevanter Frame), arbeiten Sie sich aufwärts durch jeden Frame:
   - Unterscheiden Sie zwischen Anwendungscode, Framework-/Bibliotheks- und Laufzeit-Internals
   - Konzentrieren Sie die Analyse auf die Anwendungs-Frames — hier sitzt der Bug
   - Für jeden Anwendungs-Frame: Geben Sie an, wofür diese Funktion zuständig ist und warum sie in dieser Call Chain ist

3. **Ursprung ermitteln** — identifizieren Sie den einzelnen Frame, an dem die Kontrolle vom korrekten Pfad abweichen sollte. Dies ist nicht immer der tiefste Frame; es ist der Frame, in dem eine falsche Annahme, fehlende Überprüfung oder ungültiger Zustand eingeführt wurde.

4. **Quellcode lesen** — wenn die Dateipfade im Trace in diesem Repository vorhanden sind, lesen Sie die relevanten Zeilen. Vergleichen Sie die Zeilennummern im Trace mit dem tatsächlichen Code. Verlassen Sie sich nicht nur auf den Trace.

5. **Grundursache diagnostizieren** — geben Sie genau an, welche Bedingung diesen Trace ausgelöst hat. Seien Sie spezifisch über Variablenwerte, Objektzustände oder Zeitpunkte, die hier führten, falls sie ableitbar sind.

6. **Rote Heringe ausschließen** — wenn Frames Rauschen sind (Async-Wrapper, Middleware, Retry-Schleifen), sagen Sie es explizit, damit der Leser nicht hinterher läuft.

7. **Behebung** — stellen Sie die konkrete Code-Änderung bereit, die diesen Fehlerpfad beseitigt. Zeigen Sie den genauen Ort (Datei, Funktion, Zeilenbereich) und die Änderung vorher/nachher. Falls die Behebung das Verständnis des externen Zustands erfordert, geben Sie an, was überprüft werden sollte und wie.

8. **Regressionssicherung** — schlagen Sie den minimalen Test vor, der dies gefangen hätte, bevor es in die Produktion ging.
