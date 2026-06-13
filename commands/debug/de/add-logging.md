---
description: Strukturiertes Logging zu einer Datei oder Funktion mit angemessenen Log-Ebenen und Kontext hinzufügen
argument-hint: "[Datei- oder Funktionspfad]"
---
Produktionsreifes strukturiertes Logging zum Zielcode hinzufügen.

Ziel: $ARGUMENTS

Lesen Sie die Zieldatei oder Funktion. Dann:

1. **Bestehendes Logging auditieren** — identifizieren Sie, was bereits protokolliert wird, welche Logging-Bibliothek oder welches Framework verwendet wird (stdlib logging, structlog, Winston, pino, slog, zerolog usw.) und Konventionen des Projekts für Log-Ebenen. Führen Sie keine zweite Logging-Abhängigkeit ein.

2. **Logging-Punkte identifizieren** — bestimmen Sie, wo Logging fehlt oder unzureichend ist:
   - Ein- und Austritt nicht-trivialer Funktionen (mit relevanten Argumenten und Rückgabewerten, redigiert falls sie möglicherweise PII oder Geheimnisse enthalten)
   - Verzweigungsentscheidungen, die das Verhalten beeinflussen (protokollieren Sie, welcher Branch genommen wurde und warum)
   - Externe Aufrufe (HTTP, DB, Queue, Cache) — protokollieren Sie die Absicht vor dem Aufruf und das Ergebnis danach, immer einschließlich Dauer
   - Fehler- und Ausnahmepfade — protokollieren Sie den vollständigen Kontext, nicht nur die Nachricht
   - Zustandsübergänge in langlebigen Objekten oder Zustandsmaschinen

3. **Wählen Sie die richtigen Log-Ebenen** — wenden Sie diese Regeln streng an:
   - DEBUG: interner Zustand, Schleifeniterationen, aufgelöste Konfigurationswerte
   - INFO: aussagekräftige Meilensteine, die ein Bediener in der Produktion sehen möchte
   - WARN: behebbare Anomalien, veraltete Pfade, beeinträchtigtes Verhalten
   - ERROR: Fehler, die Aufmerksamkeit erfordern; immer das Exception-Objekt/Stack einschließen

4. **Strukturierte Felder hinzufügen** — protokollieren Sie Schlüssel=Wert-Paare oder JSON-Felder, keine interpolierten Strings. Einschließen: Request-/Trace-/Korrelations-IDs falls im Scope verfügbar, relevante Entity-IDs, Timing, Umgebungskontext.

5. **Änderungen anwenden** — schreiben Sie die aktualisierte Datei. Ändern Sie nicht die Logik, Formatierung außerhalb der hinzugefügten Zeilen oder Variablennamen. Fügen Sie Importe nur hinzu, falls erforderlich und nicht bereits vorhanden.

6. **Zusammenfassung anzeigen** — liste jede hinzugefügte Log-Anweisung mit ihrer Ebene und einer einzeiligen Begründung auf.

Protokollieren Sie keine Geheimnisse, Token, Passwörter, vollständige Request-Bodies oder PII. Falls solche Werte im Scope sind, protokollieren Sie deren Vorhandensein oder einen Hash, niemals deren Inhalt.
