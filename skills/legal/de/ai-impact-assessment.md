---
name: ai-impact-assessment
description: "KI-Auswirkungsprüfung (AIA): EU-KI-Gesetz-Klassifizierung, Risikospur, Use-Case-Triage, Richtlinienkonsistenz, Anbieter-KI-Überprüfung — für Rechts- und Compliance-Teams"
---

> 🇩🇪 Deutsche Version. [Englische Version](../ai-impact-assessment.md).

# Fähigkeit zur KI-Auswirkungsprüfung

## Wann aktivieren
- Ihre Organisation implementiert ein neues KI-System oder einen Use-Case
- Sie müssen ein KI-System unter dem EU-KI-Gesetz klassifizieren
- Durchführung einer Anbieter-KI-Überprüfung vor der Beschaffung eines KI-Produkts
- Überprüfung bestehender KI-Implementierungen auf Compliance-Lücken
- Erstellung eines KI-Auswirkungsprüfungsdokuments für interne Governance

## Wann NICHT verwenden
- Ersatz für eine formale Datenschutz-Folgenabschätzung (DPIA) — führen Sie bei Bedarf beide durch
- Rechtsberatung zu KI-Gesetz-Verpflichtungen — konsultieren Sie spezialisierte Rechtsberatung
- Echtzeit-KI-Systemüberwachung — benötigt dedizierte Werkzeuge

## Wichtig

Das EU-KI-Gesetz trat im August 2026 vollständig in Kraft. Hochrisiko-KI-Systeme erfordern obligatorische Konformitätsprüfungen und Registrierung. Claude strukturiert die Prüfung — Ihr Datenschutzbeauftragter und die Rechtsberatung müssen vor formalen Einreichungen überprüfen.

## Anweisungen

### Schritt 1 — Use-Case-Aufnahme

```
Neues KI-System/Use-Case zur Prüfung:

Name: [System- oder Use-Case-Name]
Beschreibung: [was es tut, in einfacher Sprache]
Anbieter/Entwickler: [bauen wir das oder beschaffen wir es?]
Benutzer: [Mitarbeiter / Kunden / Dritte / Öffentlichkeit]
Ausgabetyp: [Entscheidung / Empfehlung / Inhalt / Klassifizierung / Vorhersage]
Konsequente Ergebnisse: [was passiert auf Basis der KI-Ausgabe?]
Dateneingaben: [persönliche Daten / biometrisch / sensitive Kategorien?]
Skala: [wie viele Menschen sind betroffen?]
```

### Schritt 2 — EU-KI-Gesetz-Klassifizierung

```
Klassifizieren Sie dieses KI-System unter dem EU-KI-Gesetz:

VERBOTEN (Artikel 5) — zuerst prüfen:
- Soziale Bewertung durch öffentliche Behörden
- Echtzeit-Fernbiometrische Identifizierung im öffentlichen Raum
- Unterschwellige Manipulation
- Ausnutzung von Personengruppen
- Rückschluss politischer/religiöser/rassischer Merkmale aus biometrischen Daten

Falls keine der obigen zutreffen, nach Risikostufe klassifizieren:

HOCHRISIKO (Anlage III) — obligatorische Konformitätsprüfung erforderlich:
- Biometrische Identifizierung/Kategorisierung
- Verwaltung kritischer Infrastruktur
- Ergebnisse in Bildung/Berufsausbildung
- Beschäftigungs-/HR-Entscheidungen
- Zugang zu wesentlichen Dienstleistungen (Kredit, Versicherung, Gesundheitswesen)
- Strafverfolgung
- Migration/Grenzschutz
- Rechtsschutz und Justiz

BEGRENZTE RISIKEN:
- Chatbots und Konversations-KI (Transparenzverpflichtung)
- Emotionserkennung (Offenlegung erforderlich)
- KI-generierte Inhalte (Wasserzeichen)
- Allgemeine KI-Modelle

MINIMALE RISIKEN:
- KI in Spielen
- Anti-Spam-Filter
- KI-gestützte Suche

[VERIFY] Klassifizierung mit Rechtsberatung, bevor Sie darauf vertrauen.
```

### Schritt 3 — Risikospur (Fast vs. vollständige Prüfung)

```
Basierend auf der Klassifizierung:

FAST TRACK (minimales/begrenztes Risiko):
- Dokumentieren Sie das System und seinen Zweck
- Implementieren Sie erforderliche Transparenzmaßnahmen
- Protokollieren Sie die Prüfung im KI-Bestandsverzeichnis

FULL TRACK (Hochrisiko):
Erforderliche Dokumentation:
1. Technische Dokumentation (Art. 11)
2. Konformitätsprüfung (Art. 43)
3. Registrierung in EU-Datenbank (Art. 71)
4. Überwachungsplan nach der Markteinführung (Art. 72)
5. Verfahren für ernsthafte Vorfallmeldung (Art. 73)

Auch erforderlich bei Beteiligung persönlicher Daten:
- Datenschutz-Folgenabschätzung (DPIA) unter DSGVO
- Datenminimierings-Überprüfung
- Prüfung der Zweckbindung

Welche Spur gilt für dieses System?
```

### Schritt 4 — Richtlinien-Konsistenzprüfung

```
Prüfen Sie diesen KI-Use-Case gegen unsere internen Richtlinien:

Use-Case: [beschreiben]
Unsere KI-Richtlinie sagt: [relevanter Richtlinientext einfügen oder beschreiben]

Ist dieser Use-Case konsistent mit:
1. Unserer Acceptable Use Policy für KI?
2. Unseren Datenbearbeitungsstandards?
3. Unserem Vendor-Genehmigungsprozess?
4. Unserer Risikotoleranz-Erklärung?

Identifizieren Sie Lücken zwischen dem Use-Case und unseren erklärten Richtlinien.
Erstellen Sie einen Ausnahmeanfrage-Antrag, falls eine Lücke vorhanden ist, der Use-Case aber dennoch gerechtfertigt ist.
```

### Schritt 5 — Anbieter-KI-Überprüfung

```
Wir beschaffen ein KI-Produkt von [Anbieter-Name].
Produkt: [was es tut]
Ihre KI-Ansprüche: [was sie über ihre KI-Fähigkeiten sagen]

Überprüfen Sie diesen Anbieter auf KI-Governance:
1. Veröffentlichen sie eine Modellkarte oder Systemkarte?
2. Offenbaren sie Trainings-Datenquellen?
3. Haben sie Bias-Test-Ergebnisse?
4. Haben sie eine Responsible-AI-Richtlinie?
5. Welche Daten nutzen sie von unseren Eingaben, um zukünftige Modelle zu trainieren?
6. EU-KI-Gesetz-Compliance-Status?
7. Wichtige Vertragsbestimmungen, die wir fordern sollten?

Flaggen Sie alle roten Flaggen, die die Beschaffung ohne weitere Überprüfung blockieren sollten.
```

### Schritt 6 — Generate the AIA-Dokument

```
Erstellen Sie ein formales KI-Auswirkungsprüfungsdokument.

System: [Name]
Klassifizierung: [Hochrisiko / begrenzt / minimal]
Zusammenfassung der Prüfung: [Befunde aus den Schritten 1-4 einfügen]

Dokumentabschnitte:
1. Systembeschreibung und Zweck
2. Risikoclassifizierung und Begründung
3. Dateneingaben und Prüfung personaler Daten
4. Potenzielle Schäden und betroffene Gruppen
5. Bias- und Fairness-Überlegungen
6. Mechanismen menschlicher Aufsicht
7. Governance und Verantwortlichkeit
8. Restrisiken und Mitigation Maßnahmen
9. Bedingungen für die Bereitstellung
10. Überprüfungszeitplan

[VERIFY] mit Datenschutzbeauftragter und Rechtsberatung vor Finalisierung.
```

## Beispiel

**Use-Case:** Ein HR-Team möchte ein KI-Tool verwenden, das CVs überprüft und Kandidaten bewertet, bevor eine menschliche Überprüfung stattfindet.

**Claude's Prüfung:**

**Klassifizierung: HOCHRISIKO** — Anlage III, Abschnitt 4: KI-Systeme für Beschäftigung und Arbeitnehmerführung, einschließlich Rekrutierung, Auswahl und Bewertung von Kandidaten.

**Erforderlich vor Bereitstellung:**
- Vollständige technische Dokumentation (Art. 11)
- Konformitätsprüfung oder Audit durch Dritte
- Registrierung in EU-KI-Gesetz-Datenbank
- DPIA (verarbeitet biometrisch ähnliche Daten — Fotos, Altersrückschluss)

**Wichtigste Risiken:**
- Proxy-Diskriminierung: Modell kann für geschützte Merkmale via Postleitzahl, Name, Absolvent*innenjahr stellvertreten
- Trainings-Daten-Bias: falls auf historischen Einstellungen trainiert, repliziert historische Verzerrungen
- Mangelnde Transparenz: Kandidat*innen haben Recht auf aussagekräftige Erklärung automatisierter Entscheidungen (DSGVO Art. 22)

**Erforderliche Schutzmaßnahmen:**
- Menschliche Überprüfung obligatorisch vor jeder Ablehnung
- Kandidat*innen-Offenlegung, dass KI beim Screening verwendet wird
- Bias-Tests zu geschützten Merkmalen vor Bereitstellung
- Recht auf menschliche Überprüfung auf Anfrage
- Regelmäßige Bias-Audits nach Bereitstellung

**Empfohlen:** Die Beschaffung sollte davon abhängig sein, dass der Anbieter Konformitätsprüfungs-Dokumentation bereitstellt und sich auf vertragliche Audit-Rechte einigt.

---
