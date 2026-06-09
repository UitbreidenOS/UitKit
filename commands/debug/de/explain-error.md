---
description: Fehlermeldung oder Ausnahme mit Root-Cause-Analyse und Lösungsvorgaben erklären
argument-hint: "[error message or paste]"
---
Dir wird eine Fehlermeldung oder Ausnahme gegeben. Analysiere sie gründlich und erstelle eine strukturierte Erklärung.

Fehler oder Ausnahme zur Analyse:
$ARGUMENTS

Befolge diesen Prozess:

1. **Fehlertyp identifizieren** — klassifiziere ihn (Laufzeitfehler, Compilerfehler, Netzwerkfehler, Berechtigungsfehler, Logikfehler, OOM usw.) und benenne die genaue Fehlerklasse oder den Code, falls vorhanden.

2. **Root-Cause-Analyse** — erkläre, was tatsächlich auf mechanischer Ebene schief gelaufen ist. Bleibe nicht an der oberflächlichen Nachricht stehen; verfolge die zugrunde liegende Ursache. Falls der Fehler einen Stack Trace beinhaltet, folge jedem Frame und identifiziere den ursprünglichen Aufruf.

3. **Kontexthinweise** — extrahiere alle Dateipfade, Zeilennummern, Modulnamen, Versionszeichenfolgen oder Umgebungshinweise, die in den Fehler eingebettet sind. Erkläre, was jeder Hinweis uns sagt.

4. **Häufige Auslöser** — liste die 3–5 wahrscheinlichsten Szenarios auf, die diesen genauen Fehler verursachen, nach Häufigkeit sortiert. Gebe für jedes an, wie man es bestätigt oder ausschließt.

5. **Lösungsstrategie** — gebe für jede wahrscheinliche Ursache die konkrete Lösung an. Sei spezifisch: beziehe Konfigurationsschlüssel, Code-Muster, Befehle oder Dateiänderungen ein. Bevorzuge die minimale korrekte Lösung gegenüber umfangreichen Umschreibungen.

6. **Prävention** — falls diese Fehlerklasse systematisch vermeidbar ist (z. B. mit einer Linter-Regel, einer Typannotation, einer Wiederholungsrichtlinie, einer Null-Prüfung), erwähne es kurz.

Einschränkungen:
- Fülle die Antwort nicht mit generischen Ratschlägen auf, die für jeden Fehler gelten.
- Falls der Fehlertext mehrdeutig oder unvollständig ist, gebe an, welcher zusätzliche Kontext deine Analyse ändern würde und wie.
- Falls die Lösung Code-Änderungen beinhaltet, zeige ein Diff vor/nach oder ein konkretes Code-Snippet, keine Beschreibung eines Snippets.
- Halte die Antwort prägnant. Erfahrene Ingenieure lesen schnell.
