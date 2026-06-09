---
description: Erstelle ein strukturiertes Architekturdokument für eine Codebasis oder ein Modul
argument-hint: "[path or module name]"
---
Erstelle ein umfassendes Architekturdokument für: $ARGUMENTS

Schritte:
1. Erkunde das Ziel — lies Entry Points, Konfigurationsdateien und Verzeichnisstruktur. Überspringe keine verborgenen Verzeichnisse wie `.claude/` oder `infra/`.
2. Identifiziere und benenne die Top-Level-Komponenten: Services, Layer, Stores, Queues, externe Integrationen.
3. Für jede Komponente, gib an:
   - Verantwortung (ein Satz)
   - Technologie / Sprache / Framework
   - Ein- und ausgehende Abhängigkeiten
   - Daten, die es besitzt oder durchleitet
4. Zeichne den Runtime-Datenfluss als ASCII-Diagramm. Bezeichne Aufrufrichtung mit Pfeilen. Beziehe asynchrone Grenzen ein.
5. Identifiziere querschnittliche Belange: Authentifizierung, Logging, Fehlerbehandlung, Feature Flags, Caching.
6. Liste bekannte Einschränkungen oder nicht offensichtliche Entscheidungen auf (z. B. „verwendet Polling statt Webhooks, da die Vendor-API schreibgeschützt ist").
7. Identifiziere Lücken: nicht dokumentierte Teile, fehlende Tests, unklar Eigentumsrecht.

Ausgabeformat:
- H2-Überschriften für jeden Abschnitt
- Tabellen für Komponentenlisten (Komponente | Verantwortung | Tech | Abhängig von)
- ASCII-Diagramm inline unter „Datenfluss"
- Aufzählungslisten für querschnittliche Belange und Lücken
- Keine Einleitungs-Fluff — beginne mit der Komponententabelle

Genauigkeitsregeln:
- Begründe jeden Anspruch in tatsächlichen Dateien. Wenn du einen Anspruch nicht verifizieren kannst, markiere ihn `[unverified]`.
- Erfinde keine Integrationen oder Layer, die nicht im Code vorhanden sind.
- Wenn $ARGUMENTS leer ist, dokumentiere das gesamte Repository-Stammverzeichnis.
