---
description: Generiere ein produktionsreifes Dockerfile für das aktuelle Projekt
argument-hint: "[language/runtime] [optional: base-image]"
---
Analysiere das aktuelle Projekt und generiere ein produktionsreifes Dockerfile. Verwende $ARGUMENTS, um die Zielsprache/Runtime und ein optionales Basis-Image-Override abzuleiten.

Schritte:
1. Inspiziere das Projekt-Root auf Paketmanifeste (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, build.gradle, Gemfile, composer.json, etc.), um den Stack automatisch zu erkennen. Falls $ARGUMENTS eine Sprache oder Runtime bereitstellt, bevorzuge diese.
2. Identifiziere den Anwendungseinstiegspunkt und Build-Schritte.
3. Wähle das kleinste geeignete Basis-Image (alpine, distroless, slim), es sei denn, $ARGUMENTS gibt etwas anderes an.
4. Wende Multi-Stage-Build an, wenn es einen Compile-/Build-Schritt gibt – trenne Builder- und Runtime-Phasen.
5. Setze einen Non-Root-USER. Weise eine explizite numerische UID zu (z. B. 1001) für Kubernetes-Kompatibilität.
6. Kopiere nur das, was die Runtime benötigt; schließe Dev-Abhängigkeiten, Test-Fixtures und Geheimnisse aus.
7. Setze WORKDIR, EXPOSE, ENV und ENTRYPOINT/CMD korrekt.
8. Füge eine HEALTHCHECK-Anweisung mit dem wahrscheinlichen Health-Endpoint der App oder einer einfachen Prozessüberprüfung hinzu.
9. Fixiere alle Basis-Image-Tags auf einen spezifischen Digest oder eine spezifische Version – verwende niemals `latest`.
10. Füge Inline-Kommentare nur dort hinzu, wo die Wahl nicht offensichtlich ist (z. B. warum ein bestimmtes Basis-Image oder Flag gewählt wurde).
11. Gebe eine `.dockerignore`-Datei neben dem Dockerfile aus, die folgendes ausschließt: `.git`, `node_modules`, `__pycache__`, Test-Verzeichnisse, `.env*`, lokale Build-Artefakte.

Nach der Generierung liste alle getroffenen Annahmen auf (z. B. abgeleiteter Port, angenommener Einstiegspunkt) und kennzeichne alle manuellen Schritte, die der Entwickler durchführen muss (z. B. Secret-Injection, Build-Arg-Werte).

Füge keine zwecklose Placeholder-ARGs oder ENV-Variablen hinzu. Gebe keine Marketing-Kommentare oder erklärende Prosa außerhalb von Inline-Code-Kommentaren aus.
