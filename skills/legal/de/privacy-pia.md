---
name: privacy-pia
description: "Datenschutz-Folgenabschätzung (PIA/DPIA): Verarbeitungstätigkeits-Aufnahme, Rechtmäßigkeitsprüfung, DPIA-Notwendigkeitsprüfung, Risikoregister, Datenschutzbeauftragten-Übergabe — DSGVO Artikel 35 Workflow"
---

> 🇩🇪 Deutsche Version. [Englische Version](../privacy-pia.md).

# Datenschutz-PIA-Fähigkeit

## Wann aktivieren
- Einführung einer neuen Produktfunktion, die persönliche Daten verarbeitet
- Aufnahme eines neuen Anbieters, der persönliche Daten verarbeitet
- Änderung der Verwendung bestehender persönlicher Daten (neuer Zweck, neue Weitergabe)
- Obligatorische DPIA gemäß DSGVO Artikel 35 (systematische Profilierung, großflächige Verarbeitung, öffentliche Überwachung)
- Vorbereitung Ihrer Datenschutz-Governance-Dokumentation für eine Compliance-Überprüfung

## Wann NICHT verwenden
- Reaktion auf einen aktiven Datenschutzverstoß — anderer Prozess (DSGVO Art. 33/34)
- Datenanforderungsanfragen von Personen — verwenden Sie die DSAR-Fähigkeit
- Formale rechtliche Einreichungen bei Aufsichtsbehörden — benötigt Ihren Datenschutzbeauftragten + Anwalt

## Wichtig

Eine DPIA ist obligatorisch gemäß DSGVO Art. 35, bevor Verarbeitung, die "wahrscheinlich zu hohem Risiko führt", stattfindet. Das Scheitern, eine erforderliche DPIA durchzuführen, ist selbst eine Verletzung. Claude strukturiert die Prüfung — Ihr Datenschutzbeauftragter muss überprüfen und absegnen, bevor die Verarbeitungstätigkeit beginnt.

## Anweisungen

### Schritt 1 — Verarbeitungstätigkeits-Aufnahme

```
Dokumentieren Sie diese Verarbeitungstätigkeit:

Aktivitätsname: [was Sie bauen oder ändern]
Zweck: [warum Sie diese Daten verarbeiten — seien Sie spezifisch]
Betroffene Personen: [wer — Kunden / Mitarbeiter / Benutzer / Öffentlichkeit]
Personaldaten-Kategorien:
- Standard: [Name, E-Mail, Adresse, Telefon, etc.]
- Spezielle Kategorien (DSGVO Art. 9): [Gesundheit / biometrisch / ethnische Herkunft / politisch / religiös / sexuelle Orientierung / Strafverkehrungen]
Verantwortlicher: [Ihre Organisation]
Gemeinsame Verantwortliche (falls vorhanden): [andere Organisationen mit Entscheidungskompetenz]
Auftragsverarbeiter: [Anbieter / Werkzeuge, die Daten in Ihrem Namen verarbeiten]
Beteiligung Länder: [wo Daten gespeichert / übertragen werden]
Aufbewahrungsdauer: [wie lange Sie die Daten aufbewahren]
```

### Schritt 2 — Rechtmäßigkeitsgrundlage

```
Identifizieren Sie die Rechtmäßigkeitsgrundlage für diese Verarbeitungstätigkeit.

DSGVO Artikel 6 Rechtmäßigkeitsgründe (wählen Sie einen):
1. Einwilligung (Art. 6(1)(a)): frei gegeben, spezifisch, informiert, unmissverständlich — kann widerrufen werden
2. Vertrag (Art. 6(1)(b)): notwendig für einen Vertrag mit der betroffenen Person
3. Rechtliche Verpflichtung (Art. 6(1)(c)): erforderlich durch EU/Mitgliedstaat Gesetz
4. Lebenswichtige Interessen (Art. 6(1)(d)): Leben schützen
5. Öffentliche Aufgabe (Art. 6(1)(e)): öffentliches Interesse oder offizielle Behörde
6. Berechtigte Interessen (Art. 6(1)(f)): Ihre Interessen vs. Rechte betroffener Personen (LIA erforderlich)

Für spezielle Kategoriendaten, AUCH einen Art. 9(2) Grund benötigen:
- Ausdrückliche Einwilligung
- Arbeitsrechts-Verpflichtung
- Lebenswichtige Interessen (handlungsunfähige Person)
- Rechtmäßige Aktivitäten einer Nichtregierungsorganisation
- Öffentlich gemacht
- Rechtliche Ansprüche
- Wesentliches öffentliches Interesse
- Gesundheit/Soziales
- Öffentliche Gesundheit
- Archivierung/Forschung

Dokumentieren Sie die Rechtmäßigkeitsgrundlage und warum sie gilt.
[VERIFY] mit Datenschutzbeauftragten — die Wahl der falschen Grundlage ist ein Compliance-Problem.
```

### Schritt 3 — DPIA-Notwendigkeitsprüfung

```
Bestimmen Sie, ob eine vollständige DPIA (Datenschutz-Folgenabschätzung) obligatorisch ist.

DPIA ist obligatorisch, wenn Verarbeitung "wahrscheinlich zu hohem Risiko führt". Überprüfen Sie:

Obligatorische Auslöser (Art. 35(3) und EDPB-Richtlinien):
- Systematische und umfangreiche automatisierte Profilierung mit Rechts-/erheblichen Auswirkungen? [ja/nein]
- Großflächige Verarbeitung spezieller Kategoriendaten (Gesundheit, biometrisch, etc.)? [ja/nein]
- Systematische Überwachung eines öffentlich zugänglichen Bereichs? [ja/nein]

EDPB-Kriterien (2+ = DPIA wahrscheinlich erforderlich):
- Bewertung/Bewertung von Einzelnen? [ja/nein]
- Automatische Entscheidungsfindung mit Rechts-/erheblichen Auswirkungen? [ja/nein]
- Systematische Überwachung? [ja/nein]
- Sensible Daten oder Daten persönlicher Art? [ja/nein]
- Großflächige Verarbeitung? [ja/nein]
- Abgleich oder Kombination von Datensätzen? [ja/nein]
- Daten über vulnerable Subjekte? [ja/nein]
- Innovative Nutzung oder Anwendung neuer technologischer/organisatorischer Lösungen? [ja/nein]
- Verhindert betroffene Personen die Ausübung ihrer Rechte? [ja/nein]

Empfehlung: [DPIA obligatorisch / DPIA empfohlen / DPIA nicht erforderlich — dokumentieren Sie Begründung]
```

### Schritt 4 — Risikoregister

```
Identifizieren und bewerten Sie Datenschutzrisiken für diese Verarbeitungstätigkeit.

Für jedes Risiko: [Risiko] | [Wahrscheinlichkeit: Hoch/Mittel/Niedrig] | [Schweregrad: Hoch/Mittel/Niedrig] | [Mitigation] | [Restrisiko nach Mitigation]

Häufige Risiken zur Bewertung:
1. Unbefugter Zugriff / Datenschutzverstoß
2. Daten über Zweck hinaus genutzt (Zweckentfremdung)
3. Exzessive Erfassung (Datenminimierungsverstoß)
4. Ungenaue Daten, die betroffener Person schaden
5. Aufbewahrung über notwendigen Zeitraum hinaus
6. Übertragung in Drittland ohne angemessene Schutzmaßnahmen
7. Verweigerung von Rechten (Zugang, Löschung, Portabilität)
8. Diskriminierende Ergebnisse aus automatisierter Verarbeitung
9. Re-Identifizierung pseudonymisierter Daten
10. Ausfall von Anbieter/Auftragsverarbeiter

Ist das Restrisiko nach Minderungsmaßnahmen akzeptabel?
Wenn HOHES Restrisiko bleibt — muss Datenschutzbehörde konsultieren, bevor Sie fortfahren (Art. 36).
```

### Schritt 5 — Datenschutzbeauftragten-Übergabe-Zusammenfassung

```
Generieren Sie eine Zusammenfassung für die Übergabe an den Datenschutzbeauftragten für diese PIA/DPIA.

Einbeziehen:
- Aktivitätsbeschreibung (ein Absatz)
- Rechtmäßigkeitsgrundlage und Begründung
- DPIA erforderlich? Ja/Nein — Begründung
- Top 3 Risiken und Minderungen
- Offene Fragen, die Datenschutzbeauftragten-Leitfaden benötigen
- Empfohlene Genehmigung: [genehmigen / mit Bedingungen genehmigen / ablehnen / Datenschutzbehörde konsultieren]

[VERIFY] mit Datenschutzbeauftragtem, bevor Verarbeitung beginnt.
```

## Beispiel

**Neue Funktion:** Eine App möchte Standortdaten + Kaufhistorie verwenden, um Benutzerprofile für personalisierte Werbung aufzubauen.

**Claude's Bewertung:**

**Verarbeitungstätigkeit:** Kombination von Standortdaten und Kaufhistorie für profilbasierte personalisierte Werbung.

**Rechtmäßigkeitsgrundlage:** Einwilligung (Art. 6(1)(a)) erforderlich — berechtigte Interessen wahrscheinlich unzureichend, um Aufdringlichkeit der Standortverfolgung zu überwiegen.

**DPIA obligatorisch:** JA — systematische Profilierung (Auslöser 1), Abgleich mehrerer Datensätze (EDPB-Kriterium 6), und spezielle Natur von Standortdaten (persistente Verfolgung). 3+ Kriterien erfüllt.

**Top-Risiken:**
- Hoch: Profildaten über Werbungszweck hinaus genutzt (Zweckentfremdung) — Mitigation: vertragliche Zweckbeschränkung + technische Durchsetzung
- Hoch: Standortdaten offenbaren sensible Informationen (Gesundheit, religiöse Praktiken, Gewerkschaftstätigkeit) — Mitigation: Aggregation + minimale Präzision
- Mittel: Einwilligung nicht frei gegeben, wenn Feature-gated — Mitigation: echte Opt-in, keine Strafe für Ablehnung

**Datenschutzbeauftragten-Empfehlung:** DPIA obligatorisch vor Start. Datenschutzbehörde konsultieren, wenn Restrisiko nach Minderung hoch bleibt.

---
