---
description: Generiert eine umfassende README.md für das aktuelle Projekt
argument-hint: "[output-path]"
---
Analysieren Sie dieses Projekt und generieren Sie eine produktionsreife README.md.

Schritte:
1. Scannen Sie die Repository-Struktur: Lesen Sie package.json / pyproject.toml / Cargo.toml / go.mod oder äquivalent, um Sprache, Framework und Abhängigkeiten zu bestimmen.
2. Identifizieren Sie die Entry Points, das Build-System und den Test Runner.
3. Lesen Sie alle vorhandenen README-, CONTRIBUTING- und docs/-Dateien für Kontext — duplizieren Sie nicht, verbessern Sie.
4. Überprüfen Sie die CI-Konfiguration (.github/workflows/, .gitlab-ci.yml, usw.) auf Badges und Workflow-Namen.

Schreiben Sie die README mit diesen Abschnitten (beziehen Sie nur Abschnitte ein, die relevant sind — weglassen leere):

- **Projektname + einzeiliger Tagline** — führen Sie mit Mehrwert an, nicht mit Tech Stack.
- **Badges** — Build-Status, Coverage, Lizenz, Version (verwenden Sie echte Shield-URLs, falls CI vorhanden ist).
- **Überblick** — 2–4 Sätze: welches Problem es löst, für wen es gedacht ist, was es auszeichnet.
- **Anforderungen** — Mindest-Runtime/Compiler-Versionen, Betriebssystem-Constraints.
- **Installation** — genaue Befehle, kopierbar. Decken Sie alle unterstützten Package Manager ab, falls zutreffend.
- **Schnelleinstieg** — der minimale Code oder Befehl, um in unter 2 Minuten ein funktionierendes Ergebnis zu erhalten.
- **Verwendung** — wichtige CLI-Flags, API-Oberfläche oder Konfigurationsoptionen. Verwenden Sie echte Beispiele aus dem Code.
- **Konfiguration** — Umgebungsvariablen, Konfigurationsdateiformat, Standardwerte. Referenzieren Sie tatsächliche Variablennamen aus dem Code.
- **Architektur** (falls nicht trivial) — ein kurzer Absatz oder ASCII-Diagramm mit Hauptkomponenten.
- **Entwicklung** — wie Sie klonen, Dev-Dependencies installieren, Tests ausführen, Linting durchführen und bauen.
- **Beitragen** — Link zu CONTRIBUTING.md, falls vorhanden; ansonsten schreiben Sie zwei Sätze.
- **Lizenz** — Lizenzname und Link zur LICENSE-Datei.

Constraints:
- Jeder Code-Block muss sein Sprach-Fence angeben.
- Erfinden Sie keine Features oder APIs — dokumentieren Sie nur, was in der Codebase vorhanden ist.
- Schreiben Sie für einen Entwickler, der dieses Projekt noch nie gesehen hat.
- Verwenden Sie ATX-Headings (##), nicht Unterstrich-Stil.
- Behalten Sie einen direkten und neutralen Ton bei — kein Marketing-Sprache.

Ausgabepfad: $ARGUMENTS (Standard: README.md im Repo-Root).
Schreiben Sie die Datei. Geben Sie den Inhalt nicht auf dem Terminal aus — bestätigen Sie einfach den geschriebenen Pfad.
