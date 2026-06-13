---
name: product-manager-toolkit
description: "Produktmanager-Toolkit: RICE-Priorisierung, PRD-Vorlagen, Funktionsspezifikationen, Stakeholder-Alignment, Go-to-Market-Checkliste und Discovery-to-Delivery-Workflow"
---

# Produktmanager-Toolkit-Fähigkeit

## Wann zu aktivieren
- Priorisierung eines Funktionsproduktes mit einem strukturierten Framework
- Schreiben eines PRD (Product Requirements Document) oder einer Funktionsspezifikation
- Vorbereitung eines Go-to-Market-Plans für einen neuen Funktionsstart
- Durchführung einer Stakeholder-Alignment-Sitzung vor der Erstellung
- Synthese der Kundenentdeckung in umsetzbare Anforderungen
- Schreiben von Benutzergeschichten mit geeigneten Akzeptanzkriterien

## Wann NICHT verwenden
- Strategische Produkt-Roadmap — verwenden Sie die Fähigkeit product-roadmap
- Benutzerforschung und Persona-Erstellung — verwenden Sie die Fähigkeit ux-researcher
- A/B-Test-Design — verwenden Sie die Fähigkeit experiment-designer
- Jira-Setup und Sprint-Planung — verwenden Sie die Fähigkeit jira-expert

## Anleitung

### RICE-Priorisierung

```
Priorisieren Sie dieses Produktrückstand mit RICE-Bewertung.

Funktionen zur Bewertung: [Liste]
Team-Kapazität: [X Ingenieur-Wochen pro Sprint]
Zeithorizont: [dieses Quartal / dieser Sprint / dieser Monat]

RICE-Formel:
Score = (Reach × Impact × Confidence) / Effort

REACH — betroffene Benutzer pro Quartal:
- Zählen Sie die Benutzer, die diese Funktion tatsächlich in einem 3-Monats-Fenster nutzen
- Nicht: "alle Benutzer könnten theoretisch davon profitieren"
- Ja: "23 % unserer DAU, die den Zahlungsfluss verwenden"
- Ausdrücken als Zahl (z. B. 1.500 Benutzer)

IMPACT — Auswirkungen pro Benutzer (Skala 1-3):
- 3: Massiv — ändert grundlegend, wie Benutzer mit dem Produkt arbeiten
- 2: Hoch — signifikante Verbesserung eines wichtigen Arbeitsablaufs
- 1: Mittel — bemerkenswerte Verbesserung
- 0,5: Gering — geringfügige Komfortverbesserung
- 0,25: Minimal — nur kosmetisch oder Grenzfall

CONFIDENCE — wie sicher Sie sind (0-100%):
- 100%: Validiert mit Daten und Forschung
- 80%: Einige Forschungen, angemessene Annahmen
- 50%: Bauchgefühl, noch keine Forschung
- 20%: Reine Hypothese, ungetestet

EFFORT — Ingenieur-Wochen zum Bauen (einschließlich Design, Test, Bereitstellung):
- Seien Sie ehrlich. Verdoppeln Sie Ihre erste Schätzung.
- Einschließlich: Design, Entwicklung, Tests, Dokumentation, Analytics-Instrumentierung

Bewertungstabelle:
| Funktion | Reach | Impact | Confidence | Effort | RICE Score | Notizen |
|---|---|---|---|---|---|---|
| [Funktion A] | 2500 | 2 | 80% | 3w | (2500×2×0,8)/3 = 1333 | |
| [Funktion B] | 800 | 3 | 50% | 6w | (800×3×0,5)/6 = 200 | |

Ausgabe: sortierte Liste + Top 3 zum Bauen diesen Sprint bei [X] Kapazität.
```

### PRD-Vorlage

```
Schreiben Sie ein PRD für [Funktion].

Funktion: [beschreiben]
Problem, das es löst: [das Benutzerproblem, nicht die Funktionsbeschreibung]
Wer hat es angefordert: [Kunden / intern / datengesteuert]
Priorität: [P0 kritisch / P1 hoch / P2 mittel]
Zielveröffentlichung: [Sprint / Quartal]

PRD-Struktur:

## Überblick
**Funktion:** [Name]
**Autor:** [PM-Name] | **Datum:** [Datum] | **Status:** [Entwurf / Überprüfung / Genehmigt]
**Engineering-Besitzer:** [Name] | **Design-Besitzer:** [Name]

## Problemaussage
[2-3 Sätze: Wer hat dieses Problem, welche Kosten das Problem verursacht und warum es jetzt wichtig ist, es zu lösen. Keine Lösungssprache hier.]

## Erfolgsmesswerte
Primäre Metrik: [die eine KPI, die sich ändert, wenn dies versendet wird]
Sekundäre Metriken: [1-2 unterstützende Metriken]
Gegenmetriken: [was wir überwachen, um sicherzustellen, dass wir nichts anderes brechen]

## Benutzergeschichten
Format: "Als [Benutzertyp] möchte ich [Aktion], damit [Ergebnis]."

Glücklicher Weg:
- Als [Benutzer] möchte ich [Kernaktion], damit [Kernwert].

Grenzfälle:
- Als [Benutzer], wenn [Grenzbedingung], möchte ich [Aktion], damit [Ergebnis].

Fehlerzustände:
- Als [Benutzer], wenn [Fehler auftritt], möchte ich [Feedback], damit [Wiederherstellungsaktion].

## Akzeptanzkriterien
□ [Spezifische, testbare Bedingung — muss binär bestanden/nicht bestanden sein]
□ [Eine andere Bedingung]
□ [Fehlerbehandlungsbedingung]

## Umfang

Im Umfang:
- [Spezifisches Verhalten 1]
- [Spezifisches Verhalten 2]

Außerhalb des Umfangs (ausdrücklich):
- [Etwas, das wir in dieser Version NICHT bauen]
- [Grenzfall auf v2 verschoben]

## Design- und technische Notizen
[Link zu Figma / Design-Spezifikation]
[Alle technischen Einschränkungen, die dem PM bekannt sind]
[API- oder Datenmodellauswirkungen]

## Offene Fragen
- [ ] [Frage, die vor Baubeginn beantwortet werden muss] — Besitzer: [Name] — Fällig: [Datum]

## Startplan
- [ ] Analytics-Instrumentierung: [zu zündende Ereignisse]
- [ ] Feature-Flag: [ja — Rollout-Plan / nein]
- [ ] Kommunikation: [kundengerichtet? / nur intern?]
- [ ] Dokumentation-Update erforderlich: [ja/nein]

Generieren Sie das PRD für meine Funktion mit dieser Struktur.
```

### Funktionsspezifikation

```
Schreiben Sie eine detaillierte Funktionsspezifikation für [Funktion].

Funktion: [Name]
PRD: [Link oder Schlüsselanforderungen einfügen]
Publikum: [Engineering-Team]

Spezifikationsstruktur (technischer als PRD):

## Funktion: [Name]
**Version:** 1.0 | **Status:** Bereit für Entwicklung

## Funktionale Anforderungen

### [Unterfunktion oder Benutzerfluss-Name]
**Auslöser:** [was diesen Fluss initiiert]
**Akteur:** [wer führt diese Aktion aus]

Schritte:
1. Benutzer [Aktion] → System [Antwort]
2. Benutzer [Aktion] → System [Antwort]

Datenanforderungen:
- Eingabe: [welche Daten sind erforderlich]
- Ausgabe: [welche Daten werden zurückgegeben/gespeichert]
- Validierung: [Regeln, die gültige Eingaben regeln]

**Fehlerzustände:**
| Bedingung | Systemantwort | Benutzer sieht |
|---|---|---|
| [Fehlerzustand] | [was passiert] | [Fehlermeldung] |

## Nicht-funktionale Anforderungen
- Performance: [Antwortzeitziel, z. B. < 200 ms p99]
- Verfügbarkeit: [gleiche SLA wie Rest des Produkts]
- Datenspeicherung: [wie lange werden diese Daten gespeichert?]
- Sicherheit: [Authentication, Berechtigung oder PII-Überlegungen]

## API-Design (falls zutreffend)
Endpunkt: [METHODE /Pfad]
Anfragekörper: [Schema]
Antwort: [Schema]
Fehlercodes: [Liste]

## Zu zündende Analyticereignisse
| Ereignis | Wenn | Eigenschaften |
|---|---|---|
| [event_name] | [wenn es zündet] | [Schlüsseleigenschaften] |

## Rollout-Plan
- [ ] Feature-Flag-Schlüssel: [feature.flag.name]
- [ ] Interner Test: [welches Team + wann]
- [ ] Kerze: [X% der Benutzer, beginnend wann]
- [ ] Vollständige Freigabe: [Datum oder Sprint]

Schreiben Sie die Spezifikation für meine Funktion.
```

### Go-to-Market-Checkliste

```
Erstellen Sie eine Go-to-Market-Checkliste für [Funktionsstart].

Funktion: [beschreiben]
Starttyp: [groß / klein / intern]
Publikum: [alle Benutzer / Segment / neue Anmeldungen / B2B-Kunden]
Startdatum: [Ziel]

Go-to-Market-Checkliste nach Rolle:

PRODUKT (Besitzer):
□ Funktion vollständig getestet und fehlerfrei auf Staging
□ Analyticereignisse werden korrekt ausgelöst (im Debug-Modus überprüfen)
□ Feature-Flag mit korrektem Rollout-Prozentsatz konfiguriert
□ Rollback-Plan dokumentiert (wie man das Flag bei Problemen deaktiviert)
□ A/B-Test eingerichtet (falls zutreffend)

ENGINEERING (Leitung):
□ Alle Akzeptanzkriterien erfüllt
□ Performance bei erwarteter Last getestet
□ Fehlerüberwachung für neue Code-Pfade eingerichtet
□ Datenbankmigrationen abgeschlossen und getestet
□ Feature-Flag-Killswitch getestet

DESIGN:
□ Endgültige Designs richtig implementiert (Stichprobe mit Designer)
□ Mobile Reaktionsfähigkeit überprüft
□ Barrierefreiheitsprüfung bestanden
□ Leere und Fehlerzustände implementiert

MARKETING (falls kundengerichtet):
□ In-App-Ankündigung oder Tooltip geschrieben und überprüft
□ E-Mail an betroffene Benutzer entworfen (falls erforderlich)
□ Blog-Post oder Änderungsprotokoll-Eintrag bereit zur Veröffentlichung
□ Hilfe-Dokumentation aktualisiert oder geschrieben
□ Sales-Team auf neue Fähigkeit briefiert

CUSTOMER SUCCESS (falls Enterprise):
□ CSMs über Funktion und wichtige Anwendungsfälle briefiert
□ High-Touch-Kunden im Voraus benachrichtigt
□ FAQs für Support-Team vorbereitet

STARTTAG:
□ Feature-Flag bei [X]% aktiviert (oder 100% für kleinere)
□ Monitor: Fehlerquote auf neuen Endpunkten für erste 30 Min
□ Monitor: p99 Latenz unverändert
□ Ankündigung veröffentlicht (In-App / E-Mail / Blog)
□ Slack #launches Update gepostet

POST-START (1 Woche):
□ Primäre Metrik: [X]% Verbesserung gegenüber Baseline
□ Fehlerquote: wieder normal
□ Support-Ticket-Volumen: kein Anstieg bei dieser Funktion
□ Qualitativ: Benutzer-Feedback zur Funktion?

Generieren Sie die Checkliste für Ihren Starttyp und Ihre Team-Struktur.
```

## Beispiel

**Benutzer:** PM bei einem SaaS-Unternehmen. Engineering fordert mich auf, zu priorisieren: (A) CSV-Export, (B) Slack-Integration, (C) dunkler Modus, (D) benutzerdefinierte Webhooks. Wir haben 4 Ingenieur-Wochen nächster Sprint. Wie entscheide ich?

**Claude's RICE-Analyse:**

Ich werde diese in Ihrem Namen mit angemessenen Annahmen bewerten — Sie müssen die Zahlen validieren, aber diese Struktur macht die Entscheidung verteidigbar.

**Annahmen, die ich mache (korrigieren Sie mich, wenn ich falsch liege):**
- Sie sind B2B SaaS, ~500 MAU, die die fraglichen Funktionen nutzen
- Keine vorherige Forschung oder Daten zu diesen spezifisch

| Funktion | Reach | Impact | Confidence | Effort | RICE | Verdict |
|---|---|---|---|---|---|---|
| CSV-Export | 400 | 2 | 70% | 1w | 560 | **Bauen** |
| Slack-Integration | 200 | 3 | 60% | 3w | 120 | Vielleicht |
| Dunkler Modus | 500 | 0,5 | 50% | 2w | 62 | Aufschieben |
| Benutzerdefinierte Webhooks | 80 | 3 | 80% | 4w | 48 | Aufschieben |

**Empfehlung: CSV-Export diesen Sprint, Rest aufschieben.**

**Warum CSV-Export gewinnt:** Fast jeder Benutzer in einem B2B-Produkt braucht irgendwann Datenenport. Hohe Reichweite, schnell zu bauen, hohes Vertrauen, dass es benötigt wird (wenn Kunden es nicht schon fragen, werden sie es innerhalb von 6 Monaten der Produktreife tun).

**Warum Slack-Integration niedrig wertet:** Die Integration selbst kann 3 Wochen dauern, aber die Slack-zu-Wert-Reise ist lang — Benutzer müssen sie einrichten, Benachrichtigungen konfigurieren und Gewohnheiten ändern. Die echte Reichweite ist wahrscheinlich 30-40% Ihrer Schätzung, sobald Adoption berücksichtigt wird. Tischen Sie sie, bis Sie Kundenvalidierung haben.

**Warum dunkler Modus niedrig wertet:** Es ist ein Standard-Feature, das fast nie der Grund ist, warum jemand kauft oder aussteigt. Versenden Sie es irgendwann, aber nicht auf Kosten von Beibehaltungs- oder Akquisitionsfunktionen.

**Warum benutzerdefinierte Webhooks niedrig wertet:** Hohe Auswirkungen pro Benutzer, aber nur Power-Benutzer brauchen sie. Die 80 Benutzer, die sie brauchen, sind wahrscheinlich laut, repräsentieren aber einen kleinen Teil Ihres Wachstumshebels.

---
