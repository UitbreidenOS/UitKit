---
description: Erklären Sie eine Fehlermeldung oder Ausnahme mit Grundursachenanalyse und Lösungsvorgaben
argument-hint: "[Fehlermeldung oder Paste]"
---
Ihnen wird ein Fehler oder eine Ausnahme gegeben. Analysieren Sie ihn gründlich und erstellen Sie eine strukturierte Erklärung.

Zu analysierende Fehler oder Ausnahme:
$ARGUMENTS

Folgen Sie diesem Prozess:

1. **Fehlertyp identifizieren** — klassifizieren Sie ihn (Laufzeit, Kompilierung, Netzwerk, Berechtigung, Logik, OOM usw.) und benennen Sie die genaue Fehlerklasse oder den Fehlercode, falls vorhanden.

2. **Grundursachenanalyse** — erklären Sie, was auf mechanischer Ebene wirklich schief gelaufen ist. Bleiben Sie nicht bei der oberflächlichen Meldung stehen; verfolgen Sie die zugrunde liegende Ursache. Falls der Fehler einen Stack-Trace enthält, folgen Sie jedem Frame und identifizieren Sie den ursprünglichen Aufruf.

3. **Kontexthinweise** — extrahieren Sie alle Dateipfade, Zeilennummern, Modulnamen, Versionszeichenfolgen oder Umgebungshinweise, die in den Fehler eingebettet sind. Erklären Sie, was jeder uns sagt.

4. **Häufige Auslöser** — listen Sie die 3–5 wahrscheinlichsten Szenarien auf, die diesen exakten Fehler erzeugen, nach Häufigkeit geordnet. Geben Sie für jedes an, wie man es bestätigt oder ausschließt.

5. **Lösungsstrategie** — geben Sie für jede wahrscheinliche Ursache die konkrete Lösung an. Seien Sie spezifisch: geben Sie Konfigurationsschlüssel, Code-Muster, Befehle oder Dateiänderungen nach Bedarf an. Bevorzugen Sie die minimale korrekte Lösung vor umfassenden Umschreibungen.

6. **Prävention** — wenn diese Fehlerklasse systematisch vermeidbar ist (z. B. mit einer Linter-Regel, einer Typ-Annotation, einer Wiederholungsrichtlinie, einer Null-Überprüfung), erwähnen Sie dies kurz.

Einschränkungen:
- Polstern Sie nicht mit generischen Ratschlägen, die für jeden Fehler gelten.
- Wenn der Fehlertext mehrdeutig oder unvollständig ist, geben Sie an, welcher zusätzliche Kontext Ihre Analyse ändern würde und wie.
- Wenn die Fehlerbehebung Code-Änderungen beinhaltet, zeigen Sie ein Diff vor/nach oder ein konkretes Snippet, keine Beschreibung eines Snippets.
- Halten Sie die Antwort dicht. Senior Engineers lesen schnell.
