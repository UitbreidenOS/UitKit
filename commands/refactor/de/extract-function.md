---
description: Extrahieren Sie einen hervorgehobenen Block oder beschriebene Logik in eine benannte Funktion mit korrekter Signatur und Aufrufstelle-Aktualisierungen
argument-hint: "[file] [line-range or description]"
---
Sie führen einen chirurgischen Extract-Function-Refactor auf $ARGUMENTS durch.

Schritte:
1. Lesen Sie die Zieldatei. Identifizieren Sie den zu extrahierenden Code-Block — entweder der angegebene Zeilenbereich oder die Logik, die der Beschreibung entspricht.
2. Bestimmen Sie den minimalen Satz von Eingaben, die die extrahierte Funktion benötigt (Parameter) und was sie zurückgeben muss (Rückgabewerte oder Mutationen).
3. Wählen Sie einen Namen, der präzise und verbfirst ist (z.B. `computeRetryDelay`, `parseHeaderToken`, `buildQueryString`). Verwenden Sie keine vagen Namen wie `helper` oder `util`.
4. Schreiben Sie die extrahierte Funktion mit:
   - Der korrekten Signatur, die den Konventionen der Host-Sprache entspricht (Typ-Annotationen, falls die Sprache diese unterstützt)
   - Nur einem einzeiligen Docstring/Kommentar, wenn der Zweck nicht offensichtlich ist
   - Keinen Nebenwirkungen über das hinaus, was der ursprüngliche Code hatte
5. Ersetzen Sie den ursprünglichen Block mit einem Aufruf der neuen Funktion, indem Sie die identifizierten Argumente übergeben und Rückgabewerte erfassen.
6. Überprüfen Sie:
   - Die Aufrufstelle kompiliert/parsed sauber (Überprüfung auf unbenutzte Variablen, die zurückbleiben, fehlende Returns, unterbrochene Kontrollflüsse)
   - Keine Variable aus dem äußeren Bereich wird jetzt in der Funktion referenziert, die nicht explizit übergeben wurde
   - Wenn die Sprache typisiert ist, sind die Typen durchgehend konsistent
7. Wenn die extrahierte Logik an mehreren anderen Stellen in der Datei vorkommt, ersetzen Sie auch diese Vorkommen und notieren Sie, wie viele Aufrufstellen aktualisiert wurden.
8. Geben Sie den Diff aus. Schreiben Sie keinen unabhängigen Code um.

Einschränkungen:
- Bewahren Sie das bestehende Verhalten genau — dies ist ein Refactor, keine Umschreibung.
- Ändern Sie die Logik des extrahierten Blocks nicht, nur seinen Ort und die Aufrufweise.
- Wenn die Extraktion nicht sicher ist (z.B. mutiert der Block mehrere äußere Variablen auf verflochtene Weise), erklären Sie warum und schlagen Sie stattdessen eine sicherere Grenze vor.
