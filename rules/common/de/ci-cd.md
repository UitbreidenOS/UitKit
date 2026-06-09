# CI/CD-Regeln

Anwenden beim Schreiben oder Überprüfen von Pipeline-Konfigurationen, Bereitstellungsskripten oder Release-Prozessen.

## Pipeline-Design

- Jede Pipeline-Ausführung muss reproduzierbar sein: gleiche Eingaben → gleiche Ausgaben, unabhängig davon, wann oder wo sie ausgeführt wird
- Pinnen Sie Action-Versionen und Basis-Images auf Digests, nicht auf Floating Tags: `actions/checkout@v4` ist akzeptabel; `actions/checkout@latest` ist nicht
- Trennen Sie Stufen: Lint → Test → Build → Veröffentlichung → Bereitstellung; Überspringen Sie niemals Stufen im Hauptzweig
- Fehler schnell erkennen: Führen Sie die billigsten, schnellsten Prüfungen zuerst aus, um den Entwicklern Feedback in unter 2 Minuten zu geben
- Parallelisieren Sie unabhängige Jobs; verketten Sie keine Jobs, die keine echte Abhängigkeit haben

## Testing-Gates

- `main`/`master`-Merges erfordern: alle Tests bestanden, Lint sauber, keine neuen Sicherheitslücken
- Die Abdeckung darf nicht unter den konfigurierten Schwellenwert fallen — erzwingen Sie dies als Pipeline-Gate, nicht als höfliche Prüfung
- Integrations- und End-to-End-Test-Suites laufen bei jedem PR; lang laufende Suites können bei Bedarf nachts laufen
- Führen Sie niemals einen PR zusammen, der die Test-Pipeline umgeht, außer im dokumentierten Notfall mit einem nachfolgenden Ticket

## Geheimnisse und Umgebung

- Pipeline-Geheimnisse befinden sich im Secrets-Store der CI-Plattform — niemals in Pipeline-YAML oder committed `.env`-Dateien
- Drucken Sie niemals Geheimnisse in Pipeline-Protokollen; fügen Sie `::add-mask::` (GitHub Actions) oder das Äquivalent hinzu, bevor Sie sie verwenden
- Verwenden Sie separate Anmeldedaten für jede Zielumgebung; der Staging-Bereitsteller kann die Produktion nicht berühren

## Build-Artefakte

- Bauen Sie einmal, befördern Sie das gleiche Artefakt durch Umgebungen — bauen Sie nicht neu für Staging vs. Produktion
- Markieren Sie Container-Images und Build-Artefakte mit dem Git-Commit-SHA, nicht mit einem veränderlichen Tag wie `latest`
- Speichern Sie Artefakte in einer versionierten Registry (ECR, Artifact Registry, GitHub Packages) — nicht als Pipeline-Anhänge
- Scannen Sie Artefakte auf Sicherheitslücken, bevor Sie die Promotion in die Produktion durchführen

## Bereitstellung

- Verwenden Sie eine Bereitstellungsstrategie, die Rollback ermöglicht: Blau/Grün, Canary oder Rolling mit Rollback-Schritt
- Smoke-Test die Bereitstellung automatisch, bevor Sie sie als erfolgreich kennzeichnen
- Datenbankmigrationen und Code-Bereitstellungen sind separate Schritte — stellen Sie zuerst rückwärtskompatiblen Code bereit, dann migrieren Sie
- Die Bereitstellung in der Produktion erfordert explizite Genehmigung oder ist an ein Zeitfenster gebunden — keine versehentlichen Pushes

## Wartung

- Halten Sie die Pipeline-Konfiguration TROCKEN: extrahieren Sie gemeinsame Schritte in wiederverwendbare Workflows oder zusammengesetzte Aktionen
- Jeder Pipeline-Schritt hat einen Namen, der das Protokoll lesbar macht, ohne sich in die Konfiguration zu graben
- Benachrichtigung für Pipeline-Fehler an den Team-Kanal — verlassen Sie sich nicht darauf, dass Einzelne das Dashboard überprüfen
- Überprüfen und aktualisieren Sie angeheftete Versionen monatlich; veraltete Werkzeuge sind ein Sicherheitsrisiko
