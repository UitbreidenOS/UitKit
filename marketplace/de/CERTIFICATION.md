# Claudient Stack-Zertifizierungs-Stufen

Dieses Dokument definiert die Zertifizierungsstufen für Stacks im Claudient Marketplace. Zertifizierte Stacks haben quantifizierte Qualitätsstandards und Wartungsverpflichtungen erfüllt.

## Zertifizierungsstufen

### Bronze-Stufe

**Kriterien:**
- Besteht alle automatisierten Validierungsprüfungen
- Schließt menschliche Überprüfung ohne Blockaden ab
- Autor verpflichtet sich zu 6-monatiger Wartungsfrist

**Vorteile:**
- Bronze-Zertifizierungsabzeichen im Marketplace angezeigt
- Stack im zertifizierten Stacks-Index aufgelistet
- Priorität in Suchergebnissen
- In Featured-Rotationen enthalten

**Wartungs-SLA:**
- Antwortet auf kritische Bug-Berichte innerhalb von 2 Wochen
- Adressiert Breaking Dependency Updates innerhalb von 1 Monat
- Aktualisiert Dokumentation für API-Änderungen innerhalb von 2 Wochen

**Ablauf:** 6 Monate nach Zertifizierungsdatum

---

### Silber-Stufe

**Kriterien:**
- Erfüllt alle Bronze-Stufe-Anforderungen
- Mindestens 50 Installationen über 90 Tage
- Durchschnittliche Benutzer-Bewertung von 4.0 oder höher
- Keine kritischen Probleme, die länger als 1 Monat ausstehen
- Letzte Aktualisierung innerhalb von 6 Monaten vor Zertifizierungsanfrage

**Vorteile:**
- Silber-Zertifizierungsabzeichen (höhere Prominenz)
- In den Kategorien "Trending" und "Empfohlen" vorgestellt
- Im Silber-Tier zertifizierten Stacks-Index aufgelistet
- Berechtigung für Partnerschaftsmöglichkeiten
- Co-Wartungs-Angebot des Kernteams (optional)

**Wartungs-SLA:**
- Antwortet auf alle Probleme innerhalb von 1 Woche
- Kritische Fehler gelöst innerhalb von 2 Wochen
- Dependency Updates in 2 Wochen bewertet und angewendet
- Regelmäßige Aktualisierungen (mindestens monatliche Aktivität)

**Ablauf:** 12 Monate nach Zertifizierungsdatum

---

### Gold-Stufe

**Kriterien:**
- Erfüllt alle Silber-Stufe-Anforderungen
- Mindestens 200 Installationen über 180 Tage
- Durchschnittliche Benutzer-Bewertung von 4.5 oder höher
- Offizielle Betreuer-Billigung (offizieller Claudient-Team-Mitglied oder verifizierten Community-Betreuer mit Erfolgsbilanz)
- Umfassende Dokumentation und Beispiele
- Multi-Sprachen-Support (Minimum: Englisch + 1 zusätzliche Sprache)

**Vorteile:**
- Gold-Zertifizierungsabzeichen (höchste Prominenz)
- Auf der Marketplace-Startseite prominent vorgestellt
- Im Gold-Tier zertifizierten Stacks-Index aufgelistet
- Ausschließliches Marketing- und Promotions-Support
- Direkter Zugang zu Kernteam für Feature-Anfragen und Support
- Berechtigung für Umsatzaufteilung (falls zutreffend)

**Wartungs-SLA:**
- Antwortet auf alle Probleme innerhalb von 48 Stunden
- Kritische Fehler gelöst innerhalb von 5 Geschäftstagen
- Dependency Updates in 1 Woche bewertet und angewendet
- Vierteljährliche Aktualisierungen (Minimum)
- Proaktive Sicherheitsprüfungen (jährlich)

**Ablauf:** 24 Monate nach Zertifizierungsdatum

---

## Qualitätswert-Berechnung

Jeder Stack erhält einen zusammengesetzten Qualitätswert (0-100) basierend auf:

| Metrik | Gewicht | Messung |
|--------|--------|-------------|
| Codequalität | 20% | Testabdeckung, Linting, Dokumentations-Vollständigkeit |
| Benutzer-Akzeptanz | 20% | Installationszahl, wöchentlich aktive Benutzer, Trend-Geschwindigkeit |
| Benutzerzufriedenheit | 20% | Durchschnittliche Bewertung, Bewertungs-Stimmung, Problemlösungsquote |
| Wartung | 20% | Tage seit letztem Update, Dependency-Fraîcheur, Problem-Reaktionszeit |
| Dokumentation | 20% | Vollständigkeit, Klarheit, Beispiel-Qualität, Genauigkeit |

**Wert-Interpretation:**
- 80-100: Gold-Stufe-Kandidat
- 60-79: Silber-Stufe-Kandidat
- 40-59: Bronze-Stufe-Kandidat
- Unter 40: Nicht zur Zertifizierung berechtigt

---

## Rezertifizierung

Alle zertifizierten Stacks unterliegen jährlicher Rezertifizierung:

**Bronze-Stacks:**
- Müssen minimale Installationszahl halten (10)
- Durchschnittliche Bewertung bleibt über 3.5
- Keine ungelösten kritischen Probleme
- Autor bestätigt Wartungsabsicht

**Silber-Stacks:**
- Müssen minimale Installationszahl halten (50)
- Durchschnittliche Bewertung bleibt über 4.0
- Vierteljährliche Updates erforderlich
- Problem-Antwort SLA eingehalten

**Gold-Stacks:**
- Müssen minimale Installationszahl halten (200)
- Durchschnittliche Bewertung bleibt über 4.5
- Monatliche Updates erforderlich
- Problem-Antwort SLA eingehalten
- Betreuer-Billigung erneuert

Falls ein Stack die Rezertifizierung nicht besteht, wird es um eine Stufe herabgestuft. Falls es auf Bronze-Stufe fehlschlägt, wird die Zertifizierung widerrufen.

---

## Entzug der Zertifizierung

Die Zertifizierung wird sofort widerrufen, wenn:

1. **Code-of-Conduct-Verstoß:** Verbotener Inhalt in Stack oder Autor-Verhalten entdeckt
2. **Kritisches Sicherheitsproblem:** Ungepatchte Schwachstelle, die Benutzersysteme beeinflusst
3. **Lizenz-Verstoß:** Verwendung von inkompatiblen oder nicht offengelegten Lizenzen
4. **Aufgegeben:** Keine Autor-Antwort für 3 Monate nach Rezertifizierungs-Überprüfung
5. **Feindselige Wartung:** Autor verhindert aktiv Verbesserungen oder ignoriert kritische Probleme

Widerrufene Stacks werden aus zertifizierten Indizes entfernt, bleiben aber im Marketplace (falls keine Verstöße). Autoren können nach 6 Monaten Verbesserungen eine Rezertifizierung beantragen.

---

## Zertifizierungsprozess

Siehe [becoming-certified.md](../guides/marketplace/becoming-certified.md) für den Schritt-für-Schritt-Zertifizierungs-Workflow.

Siehe [certification-criteria.md](../guides/marketplace/certification-criteria.md) für detaillierte Qualitätsrubriken und Messmethoden.

---

**Zuletzt aktualisiert:** 15. Juni 2026
