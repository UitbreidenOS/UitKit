# Kriterien für die Zertifizierung von Marketplace Stacks

Diese Anleitung erläutert die quantifizierten Kriterien, Qualitätsrubriken und Messmethoden für die Claudient Stack-Zertifizierung.

## Übersicht

Die Stack-Zertifizierung hat drei Stufen: Bronze, Silber und Gold. Jede Stufe hat messbare Kriterien über fünf Dimensionen: Codequalität, Benutzerakzeptanz, Benutzerzufriedenheit, Wartung und Dokumentation.

---

## Berechnung der Qualitätsbewertung

Jeder Stack erhält eine zusammengesetzte Qualitätsbewertung (0-100), berechnet als:

```
Quality Score = (0.20 × Code Quality) + (0.20 × Adoption) + (0.20 × Satisfaction) + (0.20 × Maintenance) + (0.20 × Documentation)
```

Bewertungsbereiche:
- 80-100: Gold-Kandidat
- 60-79: Silber-Kandidat
- 40-59: Bronze-Kandidat
- Unter 40: Nicht zur Zertifizierung berechtigt

---

## 1. Codequalität (20%)

**Messung:** Testabdeckung, Linting-Konformität, Abhängigkeitsfraîcheur, Sicherheitsprüfungsergebnisse.

| Metrik | Ausgezeichnet (90-100) | Gut (70-89) | Akzeptabel (50-69) | Schwach (Unter 50) |
|--------|-------------------|--------------|-------------------|-----------------|
| **Testabdeckung** | 80%+ | 60-79% | 40-59% | Unter 40% |
| **Linting** | Keine Probleme | ≤2 kleinere Probleme | 3-5 kleinere Probleme | 6+ Probleme oder kritische Probleme |
| **Abhängigkeiten** | Alle aktuell; automatische Updates | 1-2 veraltet; Aktualisierungsplan vorhanden | 3+ veraltet; Plan erforderlich | 5+ stark veraltet; kritische Sicherheitslücken |
| **Sicherheit** | Jährliche Prüfung; keine Probleme | Keine bekannten Schwachstellen | 1-2 gering schwerwiegende Probleme | Ungepatschte Sicherheitslücken |

**Bronze-Anforderung:** 50+ (akzeptabel) in jeder Metrik
**Silber-Anforderung:** 70+ (gut) in jeder Metrik
**Gold-Anforderung:** 90+ (ausgezeichnet) in jeder Metrik

---

## 2. Benutzerakzeptanz (20%)

**Messung:** Installationszahl, wöchentlich aktive Benutzer, Trend-Geschwindigkeit, Befehlsnutzung.

| Metrik | Gold | Silber | Bronze |
|--------|------|--------|--------|
| **Gesamtinstallationen (90-Tage-Fenster)** | 200+ | 50+ | 10+ |
| **Wöchentlich aktive Benutzer** | 25+ | 10+ | 3+ |
| **Trend-Geschwindigkeit** | +20% Woche für Woche | +10% Woche für Woche | Stabil oder wachsend |
| **Befehls-/Skillnutzung** | 70%+ Features regelmäßig genutzt | 50%+ Features regelmäßig genutzt | 30%+ Features genutzt |

**Akzeptanzwert = (Installationen / Ziel) × 25 + (WAU / Ziel) × 25 + (Trend-Bonus) + (Nutzungsbonus)**

Zielinstallationen: Bronze=10, Silber=50, Gold=200. Falls überschritten, auf 100 Punkte begrenzt.

---

## 3. Benutzerzufriedenheit (20%)

**Messung:** Durchschnittliche Bewertung, Stimmung der Bewertungen, Problemlösungsquote, NPS.

| Metrik | Gold | Silber | Bronze |
|--------|------|--------|--------|
| **Durchschnittliche Bewertung** | 4.5+ | 4.0+ | 3.5+ |
| **Bewertungsanzahl** | 20+ Bewertungen | 10+ Bewertungen | 5+ Bewertungen |
| **Problemlösungsquote** | 95%+ gelöste Probleme | 85%+ gelöste Probleme | 70%+ gelöste Probleme |
| **Stimmung (Positive Bewertungen)** | 80%+ positiv | 70%+ positiv | 60%+ positiv |
| **NPS (falls vorhanden)** | 50+ | 40+ | 30+ |

**Zufriedenheitswert = (Bewertung × 25) + (Lösungsquote × 25) + (Stimmung × 25) + (NPS-Bonus × 25)**

---

## 4. Wartung (20%)

**Messung:** Aktualität der Updates, Abhängigkeitsfraîcheur, Problemreaktionszeit, Commit-Häufigkeit.

| Metrik | Gold | Silber | Bronze |
|--------|------|--------|--------|
| **Tage seit letztem Update** | 30 Tage | 90 Tage | 180 Tage |
| **Abhängigkeitsalter** | 90% aktuelle Versionen | 80% aktuelle Versionen | 70% aktuelle Versionen |
| **Durchschnittliche Problemreaktionszeit** | 48 Stunden | 1 Woche | 2 Wochen |
| **Commit-Häufigkeit** | Monatlich oder öfter | Vierteljährlich oder öfter | Halbjährlich oder öfter |
| **Kritische offene Probleme** | 0 | 0 | 0 (älter als 60 Tage) |

**Wartungswert = (Aktualitäts-Bonus × 25) + (Abhängigkeitsfraîcheur × 25) + (Reaktionszeit × 25) + (Commit-Häufigkeit × 25)**

Reaktionszeitpunktwertung:
- ≤48 Stunden: 100 Punkte
- ≤1 Woche: 80 Punkte
- ≤2 Wochen: 60 Punkte
- >2 Wochen: 40 Punkte

---

## 5. Dokumentation (20%)

**Messung:** README-Vollständigkeit, Beispielqualität, Inline-Kommentare, Klarheit, Genauigkeit.

| Komponente | Ausgezeichnet (90-100) | Gut (70-89) | Akzeptabel (50-69) | Schwach (Unter 50) |
|-----------|-------------------|--------------|-------------------|-----------------|
| **README** | Vollständige Abschnitte; klare Anwendungsfälle; Installation 5 min | Meiste Abschnitte vorhanden; einige Lücken; 10 min Installation | Grundlegende Informationen vorhanden; unklare Abschnitte; 15+ min Installation | Unvollständig; verwirrend; nicht funktionsfähig |
| **Beispiele** | 3+ umfassende Beispiele mit Erklärungen | 2 funktionierende Beispiele; einige Erklärungen | 1 Beispiel; minimale Erklärung | Beispiele fehlen oder nicht funktionsfähig |
| **CLAUDE.md** | Klare Anweisungen; alle Features erklärt | Meiste Anweisungen vorhanden; einige Lücken | Grundlegende Anweisungen; unvollständig | Fehlt oder unklar |
| **Code-Kommentare** | Funktionen/Algorithmen dokumentiert; Absicht klar | Wichtigste Abschnitte kommentiert | Spärliche Kommentare | Keine aussagekräftigen Kommentare |
| **Genauigkeit** | Aktuelle Best Practices; keine Fehler | Geringfügig veraltete Elemente; größtenteils genau | Einige veraltete Muster; geringfügige Ungenauigkeiten | Erheblich veraltet; große Fehler |

**Dokumentationswert = (README × 25) + (Beispiele × 25) + (CLAUDE.md × 25) + (Kommentare × 15) + (Genauigkeit × 10)**

---

## Nutzungsschwellwerte

### Installationsminimums

Die Zertifizierung erfordert eine minimale Installationszahl über ein Messfenster:

**Bronze:** 10+ Installationen (beliebiger Zeitraum)
**Silber:** 50+ Installationen über 90 Tage
**Gold:** 200+ Installationen über 180 Tage

Installationen werden verfolgt über:
- npm-Paketdownloads (für CLI-basierte Stacks)
- GitHub-Repository-Klone
- Claude Code Marketplace-Installationsverfolgung
- Von Autor gemeldete Installationen (mit Verifikation)

### Bewertungsminimums

**Bronze:** 3.5+ Durchschnitt (5+ Bewertungen erforderlich für Berechnung)
**Silber:** 4.0+ Durchschnitt (10+ Bewertungen erforderlich für Berechnung)
**Gold:** 4.5+ Durchschnitt (20+ Bewertungen erforderlich für Berechnung)

Bewertungen werden auf eine 5-Punkte-Skala normalisiert. Die Bewertungsanzahl muss das Minimum erfüllen, bevor die Punktzahl gültig ist.

### Aktivitätsschwellwerte

**Bronze:** Aktualisiert innerhalb von 6 Monaten
**Silber:** Aktualisiert innerhalb von 3 Monaten
**Gold:** Aktualisiert innerhalb von 1 Monat

Updates umfassen:
- Code-Commits zum Hauptbranch
- Dokumentationsupdates
- Abhängigkeitserhöhungen
- Problemantworten

---

## Wartungs-SLAs

### Bronze SLA

- Antwortet auf alle Probleme innerhalb von 2 Wochen
- Behebt kritische Fehler innerhalb von 2 Wochen
- Wendet Breaking Dependency Updates innerhalb von 1 Monat an
- Aktualisiert Dokumentation für API-Änderungen innerhalb von 2 Wochen

### Silber SLA

- Antwortet auf alle Probleme innerhalb von 1 Woche
- Behebt kritische Fehler innerhalb von 2 Wochen
- Wertet alle Abhängigkeitsupdates innerhalb von 2 Wochen aus
- Hält die Dokumentation aktuell mit Feature-Änderungen
- Monatliche oder vierteljährliche Releases

### Gold SLA

- Antwortet auf alle Probleme innerhalb von 48 Stunden
- Behebt kritische Fehler innerhalb von 5 Geschäftstagen
- Wertet alle Abhängigkeitsupdates innerhalb von 1 Woche aus und wendet sie an
- Hält die Dokumentation mit dem Code synchronisiert (innerhalb von 1 Woche)
- Monatliche Releases oder aktive Entwicklung
- Proaktive Sicherheitsprüfungen (mindestens jährlich)

---

## Messzeitraum

**Erstzertifizierung:** Basierend auf den letzten 90 Tagen der Aktivität
**Rezertifizierung:** Basierend auf einem gleitenden 365-Tage-Fenster

---

## Spezialfälle

### Neue Stacks

Stacks unter 90 Tagen können Bronze-Zertifizierung anfordern, wenn:
- Codequalitätswert ist 50+
- Dokumentation ist vollständig
- Manuelle Überprüfung bestätigt Qualität

Installationsbasierte Kriterien sind für die ersten 90 Tage aufgehoben.

### Sprache und Lokalisierung

Die Dokumentation in englischer Sprache ist für alle Stufen erforderlich.

**Silber und Gold:** Erfordern mindestens eine zusätzliche Sprache (FR, DE, ES oder NL)

### Community vs. Offizielle Stacks

Die Zertifizierungskriterien sind unabhängig vom Wartungsmodell identisch. Der offizielle Status (tushar2704-Betreuer) gewährt keine automatische Zertifizierung.

---

## Audit und Verifikation

Das Kernteam führt regelmäßige Audits durch:
- Herunterfahren und Testen der Stack-Funktionalität
- Verifikation der Installationszahl und Bewertungen
- Überprüfung der neuesten Commits und Problemantworten
- Bestätigung der Dokumentationsgenauigkeit
- Sicherheitsscan auf häufige Sicherheitslücken

Audits finden statt:
- Vor der Genehmigung der Erstzertifizierung
- Vierteljährlich für Gold-Tier-Stacks
- Jährlich für Silber-Tier-Stacks
- Alle 18 Monate für Bronze-Tier-Stacks

---

## Einsprüche

Wenn ein Stack abgelehnt oder herabgestuft wird:

1. Autor kann um Erklärung ersuchen (innerhalb von 1 Woche)
2. Kernteam bietet detaillierte Wertaufschlüsselung
3. Autor kann nach Behebung identifizierter Probleme erneut beantragen (nach 2 Wochen)
4. Bei Unzufriedenheit mit dem Feedback können Sie das Kernteam für unabhängige Überprüfung eskalieren zu marketplace@claudient.dev

---

**Zuletzt aktualisiert:** 15. Juni 2026
