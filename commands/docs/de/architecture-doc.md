---
description: Erstellen Sie ein strukturiertes Architekturdokument für eine Codebasis oder ein Modul
argument-hint: "[Pfad oder Modulname]"
---
Erstellen Sie ein umfassendes Architekturdokument für: $ARGUMENTS

Schritte:
1. Erkunden Sie das Ziel — lesen Sie Einstiegspunkte, Konfigurationsdateien und Verzeichnisstruktur. Überspringen Sie nicht versteckte Verzeichnisse wie `.claude/` oder `infra/`.
2. Identifizieren und benennen Sie die obersten Komponenten: Services, Layer, Stores, Queues, externe Integrationen.
3. Für jede Komponente, geben Sie an:
   - Verantwortlichkeit (ein Satz)
   - Technologie / Sprache / Framework
   - Eingehende und ausgehende Abhängigkeiten
   - Daten, die es besitzt oder durchleitet
4. Zeichnen Sie den Laufzeit-Datenfluss als ASCII-Diagramm. Beschriften Sie die Aufrufrichtung mit Pfeilen. Schließen Sie asynchrone Grenzen ein.
5. Identifizieren Sie domänenübergreifende Belange: Authentifizierung, Logging, Fehlerbehandlung, Feature Flags, Caching.
6. Führen Sie bekannte Constraints oder nicht offensichtliche Entscheidungen auf (z. B. „verwendet Polling statt Webhooks, da die Anbieter-API schreibgeschützt ist").
7. Identifizieren Sie Lücken: undokumentierte Teile, fehlende Tests, unklar Besitz.

Ausgabeformat:
- H2-Überschriften für jeden Abschnitt
- Tabellen für Komponentenlisten (Komponente | Verantwortlichkeit | Tech | Abhängig von)
- ASCII-Diagramm inline unter „Datenfluss"
- Aufzählungslisten für domänenübergreifende Belange und Lücken
- Keine Einleitung — beginnen Sie mit der Komponentenentabelle

Genauigkeitsregeln:
- Verankern Sie jeden Anspruch in tatsächlichen Dateien. Wenn Sie einen Anspruch nicht überprüfen können, markieren Sie ihn `[unverified]`.
- Erfinden Sie keine Integrationen oder Layer, die nicht im Code vorhanden sind.
- Wenn $ARGUMENTS leer ist, dokumentieren Sie das gesamte Repository-Root.
