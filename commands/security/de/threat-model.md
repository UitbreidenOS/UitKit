---
description: Erstelle ein STRIDE-Threat-Model für eine Systemkomponente oder die vollständige Anwendung
argument-hint: "[component, feature, or diagram description]"
---
Erstelle ein STRIDE-Threat-Model für `$ARGUMENTS`. Wenn kein Argument gegeben ist, modelliere die vollständige Anwendung basierend auf der Codebasis, README und allen Architektur-Dokumentationen im Repository.

**Schritt 1 — Das System verstehen**

Bevor du das Modell erstellst, beantworte diese Fragen anhand des Codes und der Dokumentation:
- Was sind die Eingangspunkte? (HTTP-Endpoints, Message Queues, Datei-Erfassung, CLI)
- Welche Datenspeicher werden verwendet und was enthalten sie?
- Welche externen Dienste ruft das System auf?
- Was sind die Vertrauensgrenzen? (Internet-zugänglich vs. intern, Benutzer vs. Admin vs. Service-zu-Service)
- Welche sind die sensitivsten Daten, die das System verarbeitet?

Erstelle eine kurze Datenflusszusammenfassung: Akteure → Eingangspunkte → Verarbeitung → Datenspeicher → externe Dienste.

**Schritt 2 — STRIDE anwenden**

Für jede identifizierte Komponente oder jeden Datenfluss, bewerte jede Bedrohungskategorie:

| Bedrohung | Zu stellende Frage |
|---|---|
| **Spoofing** | Kann ein Angreifer einen Benutzer, Dienst oder eine Komponente nachahmen? |
| **Tampering** | Können Daten während der Übertragung oder in Ruhe ohne Erkennung verändert werden? |
| **Repudiation** | Kann ein Akteur eine Aktion aufgrund fehlender Protokolle oder schwacher Zuordnung leugnen? |
| **Information Disclosure** | Können sensible Daten durch Fehler, Protokolle, Seitenpfade oder zu breite API-Antworten lecken? |
| **Denial of Service** | Kann ein Angreifer Ressourcen erschöpfen (CPU, Speicher, Verbindungen, Ratenlimits)? |
| **Elevation of Privilege** | Kann ein Actor mit niedrigerem Vertrauen Fähigkeiten erlangen, die für Actoren mit höherem Vertrauen reserviert sind? |

**Schritt 3 — Jede Bedrohung bewerten**

Verwende DREAD-lite-Bewertung für jeden Fund:
- **Damage**: 1–3 (niedriger / mittlerer / hoher Einfluss bei Ausnutzung)
- **Reproducibility**: 1–3 (schwer / manchmal / immer reproduzierbar)
- **Exploitability**: 1–3 (Experte / moderat / ungeschickter Angreifer)
- Score = Summe (max 9). ≥7 = Kritisch, 5–6 = Hoch, 3–4 = Mittel, ≤2 = Niedrig

**Schritt 4 — Ausgabe**

```
## Bedrohungsmodell: [Komponente/System]

### Systemübersicht
[Datenflusszusammenfassung aus Schritt 1]

### Bedrohungen

#### [STRIDE-Kategorie] — [Bedrohungstitel]
Komponente: [Eingangspunkt, Datenfluss oder Speicher]
Beschreibung: Was der Angreifer tut und erreicht
DREAD-Score: D=N R=N E=N → Gesamt=N (Schweregrad)
Mitigationen:
  - [vorhandene Kontrolle, falls vorhanden]
  - [empfohlene Kontrolle]

### Risikozusammenfassungstabelle
| # | Bedrohung | Schweregrad | Mitigiert? |
```

**Schritt 5 — Priorisierte Empfehlungen**

Liste die Top 5 Mitigationen nach Risiko-Score auf, mit spezifischer Implementierungsleitfaden für diese Codebasis.
