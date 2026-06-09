# Dokumentationsregeln

Anwenden beim Schreiben oder Überprüfen von README-Dateien, API-Dokumentation, Leitfäden oder Inline-Dokumentation.

## Was zu dokumentieren ist

- Dokumentiere das *Warum*, nicht das *Was* — Code zeigt, was getan wird; Dokumentation erklärt Absicht, Einschränkungen und Tradeoffs
- Jede öffentliche API-Oberfläche benötigt eine Beschreibung, Parametertypen, Rückgabetyp und mindestens ein Beispiel
- Dokumentiere nicht offensichtliches Verhalten explizit: Ratenlimits, eventuelle Konsistenz, Bestellgarantien, bekannte Fehlermodi
- Architecture Decision Records (ADRs) für alle Entscheidungen, die länger als einen Tag dauerten — der Kontext geht sonst verloren

## Was nicht zu dokumentieren ist

- Nicht wiederholen, was der Code bereits klar aussagt: `// erhöht Zähler um 1` auf `counter++` ist Rauschen
- Dokumentiere keine temporären Zustände („dies ist eine Workaround, bis X behoben ist") — das gehört zum Issue-Tracker
- Schreibe keine spekulativen Dokumentationen für Features, die es noch nicht gibt

## READMEs

Jedes Projekt-README muss diese Fragen in dieser Reihenfolge beantworten:

1. Was macht dieses Projekt? (ein Satz)
2. Wie führe ich es lokal aus? (genaue Befehle, keine Annahmen)
3. Wie führe ich die Tests aus?
4. Welche wichtigsten Umgebungsvariablen gibt es?
5. Wo finde ich weitere Details? (Links zu weiteren Dokumentationen)

Eine README, bei der es länger als 5 Minuten dauert, von Null zu einer laufenden lokalen Umgebung zu gelangen, ist zu lang oder es fehlen Schritte.

## API-Dokumentation

- Halten Sie API-Dokumentation neben dem Code — Dokumentationen in einem separaten Repository driften ab
- Verwenden Sie OpenAPI/Swagger für REST; SDL + Beschreibungen für GraphQL; generieren Sie aus der Quelle, wo möglich
- Jeder Endpoint dokumentiert: Authentifizierungsanforderungen, Request-/Response-Schema, Fehlercodes, Ratenlimits
- Stellen Sie ausführbare Beispiele bereit (curl, SDK-Snippets) — abstrakte Beschreibungen ohne Beispiele sind nicht nützlich

## Schreibstil

- Schreiben Sie für einen Leser, der kompetent, aber mit diesem spezifischen System nicht vertraut ist
- Kurze Sätze, aktive Stimme, Imperativmodus für Anweisungen
- Nutzen Sie konkrete Beispiele statt abstrakter Beschreibungen: Zeigen Sie einen echten Request/Response, nicht nur ein Schema-Diagramm
- Tabellen für Referenzmaterial; Prosa für Erklärungen; nummerierte Listen für sequenzielle Schritte

## Wartung

- Dokumentationen, die falsch sind, sind schlimmer als keine Dokumentation — behandeln Sie veraltete Dokumentation als Fehler
- Aktualisieren Sie die Dokumentation in demselben PR wie die Codeänderung; hinterlassen Sie niemals eine „Dokumentations-PR wird folgen"
- Fügen Sie ein `last-verified`-Datum zu umfangreichen Leitfäden hinzu, damit Leser die Aktualität beurteilen können
- Verlinken Sie zur kanonischen Quelle der Wahrheit; kopieren Sie keinen Inhalt ein, der abweichen wird
