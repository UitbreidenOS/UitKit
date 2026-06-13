---
description: Eine umfassende README.md für das aktuelle Projekt generieren
argument-hint: "[output-path]"
---
Analysieren Sie dieses Projekt und generieren Sie eine produktionsreife README.md.

Schritte:
1. Scannen Sie die Repo-Struktur: Lesen Sie package.json / pyproject.toml / Cargo.toml / go.mod oder äquivalente Dateien, um Sprache, Framework und Abhängigkeiten zu bestimmen.
2. Identifizieren Sie die Entry-Point(s), das Build-System und den Test-Runner.
3. Lesen Sie alle vorhandenen README-, CONTRIBUTING- und docs/-Dateien für den Kontext — duplizieren Sie nicht, verbessern Sie.
4. Überprüfen Sie die CI-Konfiguration (.github/workflows/, .gitlab-ci.yml, usw.) auf Badges und Workflow-Namen.

Schreiben Sie die README mit diesen Abschnitten (beziehen Sie nur relevante Abschnitte ein — lassen Sie leere Abschnitte weg):

- **Projektname + ein Satz Tagline** — beginnen Sie mit dem Mehrwert, nicht dem Tech-Stack.
- **Badges** — Build-Status, Coverage, Lizenz, Version (verwenden Sie echte Shield-URLs, wenn CI vorhanden ist).
- **Übersicht** — 2–4 Sätze: welches Problem es löst, für wen es ist, was es unterscheidet.
- **Anforderungen** — minimale Runtime-/Compiler-Versionen, OS-Einschränkungen.
- **Installation** — genaue Befehle, kopierbar. Decken Sie alle unterstützten Package Manager ab, falls zutreffend.
- **Schnellstart** — der minimale Code oder Befehl, um ein funktionierendes Ergebnis in weniger als 2 Minuten zu erhalten.
- **Verwendung** — wichtige CLI-Flags, API-Oberfläche oder Konfigurationsoptionen. Verwenden Sie echte Beispiele aus der Codebase.
- **Konfiguration** — Umgebungsvariablen, Konfigurationsdateiformat, Standardwerte. Referenzieren Sie tatsächliche Variablennamen aus dem Code.
- **Architektur** (falls nicht trivial) — ein kurzer Absatz oder ASCII-Diagramm, das wichtige Komponenten zeigt.
- **Entwicklung** — wie Sie klonen, Entwicklungs-Deps installieren, Tests ausführen, linting durchführen und erstellen.
- **Beitragen** — Link zu CONTRIBUTING.md, falls vorhanden; andernfalls schreiben Sie zwei Sätze.
- **Lizenz** — Lizenzname und Link zur LICENSE-Datei.

Einschränkungen:
- Jeder Code-Block muss sein Sprachen-Fence angeben.
- Erfinden Sie keine Features oder APIs — dokumentieren Sie nur, was in der Codebase vorhanden ist.
- Schreiben Sie für einen Entwickler, der dieses Projekt noch nie gesehen hat.
- Verwenden Sie ATX-Überschriften (##), nicht Unterstrich-Stil.
- Halten Sie den Ton direkt und neutral — keine Marketingsprache.

Ausgabepfad: $ARGUMENTS (Standard: README.md im Repo-Root).
Schreiben Sie die Datei. Geben Sie den Inhalt nicht auf dem Terminal aus — bestätigen Sie nur den geschriebenen Pfad.
