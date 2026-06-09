---
description: Strukturiertes Logging zu einer Datei oder Funktion mit angemessenen Log-Levels und Kontext hinzufügen
argument-hint: "[file or function path]"
---
Fügen Sie produktionsreifes strukturiertes Logging zum Zielcode hinzu.

Target: $ARGUMENTS

Lesen Sie die Zieldatei oder Funktion. Dann:

1. **Audit bestehendes Logging** — identifizieren Sie, was bereits geloggt wird, welche Log-Bibliothek oder welches Framework verwendet wird (stdlib logging, structlog, Winston, pino, slog, zerolog, etc.), und beachten Sie die Log-Level-Konventionen des Projekts. Führen Sie keine zweite Logging-Abhängigkeit ein.

2. **Identify Log Points** — bestimmen Sie, wo Logging fehlend oder unzureichend ist:
   - Ein- und Ausstieg nicht trivialer Funktionen (mit relevanten Argumenten und Rückgabewerten, maskiert wenn sie PII oder Secrets enthalten könnten)
   - Verzweigungsentscheidungen, die das Verhalten beeinflussen (loggen Sie welcher Branch genommen wurde und warum)
   - Externe Aufrufe (HTTP, DB, Queue, Cache) — loggen Sie die Absicht vor dem Aufruf und das Ergebnis danach, immer einschließlich der Dauer
   - Fehler- und Ausnahmepfade — loggen Sie den vollständigen Kontext, nicht nur die Nachricht
   - Statusübergänge in langlebigen Objekten oder State Machines

3. **Wählen Sie die richtigen Log-Levels** — wenden Sie diese Regeln streng an:
   - DEBUG: interner Status, Schleifeniteration, aufgelöste Konfigurationswerte
   - INFO: aussagekräftige Meilensteine, die ein Operator in der Produktion sehen möchte
   - WARN: behebbare Anomalien, veraltete Pfade, verschlechtertes Verhalten
   - ERROR: Fehler, die Aufmerksamkeit erfordern; immer das Exception-Objekt/Stack einbeziehen

4. **Fügen Sie strukturierte Felder hinzu** — loggen Sie Schlüssel=Wert-Paare oder JSON-Felder, keine interpolierten Strings. Beinhalten Sie: Request/Trace/Correlation IDs wenn im Scope verfügbar, relevante Entity IDs, Zeitangaben, Umgebungskontext.

5. **Wenden Sie die Änderungen an** — schreiben Sie die aktualisierte Datei. Ändern Sie nicht die Logik, Formatierung außerhalb der hinzugefügten Zeilen oder Variablennamen. Fügen Sie Imports nur hinzu, wenn erforderlich und noch nicht vorhanden.

6. **Zeigen Sie eine Zusammenfassung** — listen Sie jede hinzugefügte Log-Aussage mit ihrem Level und einer einzeiligen Begründung auf.

Loggen Sie keine Secrets, Tokens, Passwörter, vollständige Request-Bodys oder PII. Wenn solche Werte im Scope sind, loggen Sie deren Existenz oder einen Hash, niemals deren Inhalt.
