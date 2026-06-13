---
name: doc-site-builder
description: "Dokumentationsseiten-Architektur: Informationshierarchie, Navigationsstruktur, Inhaltsvorlagen, Suchstrategie"
---

# Dokumentationsseiten-Builder-Skill

## Wann aktivieren
- Du startest eine neue Dokumentationsseite von Grund auf und benötigst eine Informationsarchitektur
- Du migrierst Dokumente aus einem Wiki (Notion, Confluence) oder README-Dateien auf eine dedizierte Dokumentationsseite
- Eine bestehende Dokumentationsseite ist über ihre Struktur hinausgewachsen und benötigt ein IA-Redesign
- Du musst Inhaltsvorlagen definieren, damit mehrere Mitwirkende konsistente Seiten erstellen
- Du planst einen Docs-as-Code-Workflow, bei dem Ingenieure und Autoren im selben Repo zusammenarbeiten

## Wann NICHT verwenden
- Du musst einzelne Dokumentationsseiten schreiben — verwende `/api-doc-writer` oder `/readme-generator` für spezifische Inhalte
- Du wählst eine Dokumentationsplattform (Docusaurus vs. MkDocs vs. Mintlify vs. GitBook) — dieser Skill deckt Architektur ab, keine Plattformauswahl; triff diese Entscheidung zuerst
- Du möchtest bestehende Dokumentationsqualität prüfen — dies ist ein struktureller und architektonischer Skill, kein Audit-Tool
- Du musst die technische Build-Pipeline einrichten — dieser Skill erstellt die Architektur; die Implementierung ist eine Engineering-Aufgabe

## Anweisungen

### Vollständige Dokumentationsseiten-Architektur

```
Die Informationsarchitektur für eine Dokumentationsseite entwerfen.

## Kontext
Produkt: [Name und 1-Satz-Beschreibung]
Zielgruppe: [wer diese Dokumentation liest — Endnutzer / Entwickler / Admins / alle drei]
Benötigte Dokumentationstypen: [Einstieg / API-Referenz / Anleitungen / Konzeptleitfäden / Release-Notes / Fehlerbehebung / alle]
Aktueller Stand: [neu von Grund auf / Migrating von [Quelle] / Umstrukturierung bestehender Seite]
Inhaltsvolumen: [ungefähre Seitenanzahl — grobe Schätzung genügt]
Team: [wer schreibt: [N] technische Redakteure / Ingenieure schreiben selbst / gemischt]
Gewählte Plattform: [Docusaurus / MkDocs / Mintlify / GitBook / Notion / benutzerdefiniert / noch nicht gewählt]

## Erstellen:

### 1. Informationsarchitektur-Übersicht
Übergeordnete Navigationsstruktur mit Begründung für jeden Abschnitt:

```
/ (Startseite)
├── Einstieg/
│   ├── Einführung
│   ├── Schnellstart
│   └── Installation
├── Leitfäden/
│   ├── [Thema 1]
│   └── [Thema 2]
├── Referenz/
│   ├── API-Referenz
│   ├── Konfiguration
│   └── CLI-Referenz
├── Konzepte/
│   └── [Grundlegende Konzepterklärungen]
└── Changelog/
```

Für jeden übergeordneten Abschnitt: die Benutzerabsicht erklären, die er bedient, und den Inhalt, den er enthält.

### 2. Inhaltliche Taxonomie
Die vier Diátaxis-Inhaltstypen für dieses Produkt definieren:

**Tutorials** (lernorientiert, geführte Erfahrung):
- Wann ein Tutorial vs. eine Anleitung schreiben
- Vorlage für Tutorials in diesem Produktkontext
- Beispiel-Tutorial-Titel für dieses Produkt

**Anleitungen** (aufgabenorientiert, problemlösend):
- Wann eine Anleitung vs. ein Tutorial schreiben
- Vorlage für Anleitungen
- Beispiel-Anleitungstitel für dieses Produkt

**Referenz** (informationsorientiert, Nachschlagewerk):
- Was zur Referenz gehört (API-Endpunkte, Konfigurationsschlüssel, CLI-Flags, Datenmodelle)
- Vorlage für Referenzseiten
- Wie Referenzen für dieses Produkt automatisch generiert vs. manuell geschrieben werden

**Erklärung / Konzeptuell** (verständnisorientiert):
- Welche Konzepte für dieses Produkt Erklärungsdokumentation benötigen
- Vorlage für Konzeptseiten
- Beispiel-Konzeptthemen für dieses Produkt

### 3. Seitenvorlagen
Ausfüllbare Vorlagen bereitstellen für:

**Einstieg / Schnellstart-Vorlage:**
```markdown
# Einstieg mit [Produkt]

## Was du aufbauen wirst
[1-2 Sätze — das Ergebnis, das der Leser erreicht]

## Voraussetzungen
- [Anforderung 1]
- [Anforderung 2]

## Schritt 1: [Erste Aktion]
[Anweisung]

```[sprache]
[Code-Beispiel]
```

Erwartete Ausgabe:
```
[Was sie sehen, wenn es funktioniert]
```

## Schritt 2: [Nächste Aktion]
[Anweisung]

## Was gerade passiert ist
[Kurze Erklärung, was der Schnellstart-Code tut — baut mentales Modell auf]

## Nächste Schritte
- [Link zum nächsten Tutorial]
- [Link zur relevanten Anleitung]
- [Link zur Referenz]
```

**Anleitungs-Vorlage:**
```markdown
# So [spezifische Aufgabe durchführen]

[Ein Satz: für wen dies ist und was es erreicht]

## Voraussetzungen
- [Was sie brauchen, bevor sie beginnen]

## Schritte

### 1. [Erster Schritt]
[Anweisung — imperativische Stimme, zweite Person]

```[sprache]
[Code]
```

### 2. [Zweiter Schritt]
[Anweisung]

## Fehlerbehebung
**[Häufiges Problem]:** [Lösung]
**[Häufige Fehlermeldung]:** [Was sie bedeutet und wie zu beheben]

## Verwandt
- [Anleitungsleitfaden, der häufig mit diesem kombiniert wird]
- [Referenzseite für die hier verwendete Hauptkonfiguration/API]
```

**Referenzseitenvorlage:**
```markdown
# [Konfigurationsschlüssel / API-Endpunkt / CLI-Befehlsname]

[Ein Satz, der beschreibt, was dies tut]

## Syntax / Signatur
```
[genaue Syntax]
```

## Parameter / Optionen
| Parameter | Typ | Erforderlich | Standard | Beschreibung |
|---|---|---|---|---|
| `name` | string | Ja | — | [was es tut] |
| `timeout` | number | Nein | 30 | [was es tut] |

## Beispiel
```[sprache]
[minimales funktionierendes Beispiel]
```

## Hinweise
[Randfälle, Fallstricke, Versionsbeschränkungen]

## Siehe auch
[Verwandte Referenzelemente]
```

### 4. Navigationsdesignregeln
Grundsätze für die Navigation dieser Dokumentationsseite:

- Maximale Tiefe: [2 / 3 Ebenen — eine wählen; tiefer ist fast immer schlechter]
- Seitenleiste: [immer sichtbar / auf Mobilgeräten eingeklappt / abschnittsbezogen]
- Breadcrumbs: [ja / nein — ja für tiefe Hierarchien]
- Seitenlänge: [empfohlene Maximallänge und wann in Unterseiten aufgeteilt werden soll]
- Versionierung: [muss die Seite Dokumentationsversionen haben? Strategie dafür]

### 5. Suchstrategie
- Suchwerkzeug: [Algolia DocSearch / eingebaute Volltextsuche / pagefind / keine]
- Suchoptimierung: welche Metadaten zu jeder Seite hinzugefügt werden (Titel, Beschreibung, Tags)
- Facetten / Filterung: muss die Zielgruppe nach Rolle, Produktebene oder Version filtern?

### 6. Mitwirkenden-Workflow
Wie Ingenieure und Redakteure zusammenarbeiten:

- Dateibenennungskonvention: [kebab-case.md / thema/unterthema.md]
- PR-Überprüfungsprozess: [Redakteur prüft alle PRs mit Dokumentationsänderungen / Ingenieur merged selbst mit Überprüfung durch Redakteur]
- Aktualitätssignal: last_updated-Frontmatter auf jeder Seite
- Überprüfung auf defekte Links: [CI-Schritt — welches Tool verwenden]
- Stilführerstandort: [Link oder einbetten]

### 7. Launch-Bereitschafts-Checkliste
- [ ] Startseite hat klare Pfade zu den 3 häufigsten Benutzerabsichten
- [ ] Jede Seite hat einen Titel, eine Beschreibung und ein last_updated
- [ ] Alle Code-Beispiele sind getestet und ausführbar
- [ ] Suche ist konfiguriert und indiziert
- [ ] 404-Seite hat nützliche Navigation zurück zum Inhalt
- [ ] Analytics konfiguriert (Seitenaufrufe, Suchanfragen, 404er)
- [ ] Feedback-Widget auf jeder Seite ("War das hilfreich?")
- [ ] Überprüfung auf defekte Links besteht in CI
```

### Diátaxis-Inhaltsklassifizierung

```
Diesen Inhalt nach Diátaxis-Typ klassifizieren und mir sagen, was fehlt.

Ich habe folgende Dokumentationsseiten (Titel und 1-Zeilen-Beschreibung auflisten):
[bestehende Seiten auflisten]

Für jede Seite:
1. Als klassifizieren: Tutorial / Anleitung / Referenz / Erklärung / Unklar / Gemischt (Gemischt als Problem kennzeichnen)
2. Seiten kennzeichnen, die "gemischt" sind — sie müssen aufgeteilt werden
3. Identifizieren, welche Diátaxis-Quadranten Inhaltslücken für dieses Produkt aufweisen

Lückenanalyse-Ausgabe:
| Diátaxis-Typ | Abdeckung | Fehlende Themen |
|---|---|---|
| Tutorial | Gut / Dünn / Keine | [was fehlt] |
| Anleitung | Gut / Dünn / Keine | [was fehlt] |
| Referenz | Gut / Dünn / Keine | [was fehlt] |
| Erklärung | Gut / Dünn / Keine | [was fehlt] |

Empfohlene Priorität: [welchen Typ zuerst mehr schreiben und warum]
```

### Analytics-Interpretation der Dokumentationsseite

```
Dokumentationsseiten-Analytics interpretieren und Inhaltsprobleme aufdecken.

Analytics-Quelle: [Google Analytics / Plausible / Posthog / benutzerdefiniert]

Verfügbare Daten:
- Top-10-Seiten nach Seitenaufrufen: [einfügen]
- Top-10-Suchanfragen: [einfügen]
- Seiten mit höchster Absprungrate: [einfügen]
- 404-Fehler (häufigste defekte Pfade): [einfügen]

Analysieren:
1. SUCHANFRAGEN, DIE NICHTS FINDEN: Anfragen im Suchprotokoll mit 0 Ergebnissen = Inhaltslücke. Auflisten.
2. SEITEN MIT HOHER ABSPRUNGRATE: Seiten mit sehr hoher Absprungrate könnten die Frage des Nutzers nicht beantworten. Top 3 diagnostizieren.
3. FEHLENDE SEITEN (404er): Defekte Pfade auflisten — welche davon repräsentieren echte Inhalte, die existieren sollten?
4. UNTERDURCHSCHNITTLICHE SEITEN: Seiten, die viel Traffic haben sollten, aber nicht. Was könnte die Lücke erklären?

Ausgabe: priorisierter Inhalts-Backlog basierend auf Analytics-Belegen.
```

## Beispiel

**Benutzer:** Ich baue Dokumentation für eine entwicklerorientierte Webhook-Integrationsbibliothek. Die Nutzer sind Ingenieure, die unsere API integrieren. Ich muss von 3 README-Dateien zu einer richtigen Dokumentationsseite auf Docusaurus wechseln. Erwartet: ~40 Seiten insgesamt.

**Ausgabe (Auszug):**

```markdown
## Informationsarchitektur: Webhook-Bibliotheks-Dokumentation

### Übergeordnete Navigation

```
/ (Startseite)
├── Einstieg/
│   ├── Einführung (was die Bibliothek tut; 2-Minuten-Lektüre)
│   ├── Schnellstart (funktionierender Webhook in 5 Minuten)
│   └── Installation (alle Paketmanager)
├── Leitfäden/
│   ├── Webhooks empfangen
│   ├── Signaturen verifizieren
│   ├── Wiederholungsversuche und Idempotenz handhaben
│   ├── Webhooks lokal testen
│   └── Migration von direkter HTTP-Verarbeitung
├── Referenz/
│   ├── Client-Optionen
│   ├── Ereignistypen
│   ├── Fehlercodes
│   └── Changelog
└── Konzepte/
    ├── Wie Webhook-Zustellung funktioniert
    ├── Signaturverifizierung vertieft
    └── Wiederholungs- und Reihenfolgegarantien
```

### Inhaltslückenanalyse
Deine 3 README-Dateien decken wahrscheinlich ab: Installation, grundlegende Nutzung und etwas API-Referenz.

Fehlend (hohe Priorität):
- Tutorial: "Deinen ersten Webhook in 5 Minuten empfangen" — das ist der Einstiegspunkt für alle neuen Nutzer
- Anleitung: "Webhooks lokal mit ngrok oder Cloudflare Tunnel testen" — häufigster Reibungspunkt für Entwickler
- Konzept: "Wiederholungs- und Reihenfolgegarantien" — Ingenieure werden das brauchen, bevor sie es in der Produktion einsetzen
- Referenz: Ereignistypen-Katalog — sollte aus deinem Schema automatisch generiert werden, nicht manuell geschrieben
```

---
