# Claude für Gesundheitsadministratoren

Alles, was ein Gesundheitsadministrator oder Praxismanager benötigt, um KI-gestützte Patientenkommunikation, SOPs, Compliance-Tracking, Personalplanung und Abrechnungsverwaltung in Claude Code durchzuführen.

---

## Für wen dieser Leitfaden gedacht ist

Du bist Praxismanager, Klinikadministrator oder medizinischer Bürokoordinator. Deine Aufgabe ist es, die Praxis am Laufen zu halten — Patientenplanung, Personaldienstplanung, Abrechnung, Compliance-Dokumentation, Lieferantenkommunikation — während das klinische Personal sich auf die Versorgung konzentriert. Du hast zu viele offene Punkte und zu wenig Zeit.

**Vor Claude Code:** 45 Minuten, um eine Patientenkommunikationsrichtlinie zu entwerfen. 30 Minuten pro SOP-Aktualisierung. Manuelle Nachverfolgung offener Rechnungen. Compliance-Checklisten in Tabellenkalkulationen verwaltet. Stellenbeschreibungen von Grund auf neu geschrieben.

**Danach:** Patientenkommunikations-Templates in 2 Minuten. SOP-Erstentwürfe in 5 Minuten. Abrechnungs-Follow-up-E-Mails in 30 Sekunden entworfen. Compliance-Gap-Analyse aus einem Richtliniendokument in unter einer Minute. Stellenbeschreibungen mit allen erforderlichen Angaben in 3 Minuten.

---

## Wichtiger Haftungsausschluss — vor dem Start lesen

Claude Code unterstützt ausschließlich **administrative Arbeit**.

- Claude Code nicht für klinische Entscheidungen jeglicher Art verwenden, informieren oder vorschlagen
- Keine identifizierbaren Patientendaten in einen Prompt einfügen — keine Namen, Geburtsdaten, NHS-/Versicherungsnummern, Adressen, Kontaktdaten oder Kombinationen, die eine reale Person identifizieren könnten
- Platzhaltername verwenden (z.B. Patient A, Herr X) und anonymisierte Referenzen in allen Beispielen
- Alle Ausgaben müssen von einem qualifizierten Menschen überprüft werden, bevor sie an Patienten gesendet oder in regulierten Prozessen verwendet werden
- Nichts in diesem Leitfaden stellt rechtliche, klinische oder regulatorische Beratung dar

Claude Code ist keine HIPAA-abgedeckte Einheit und sollte nicht als Teil der konformen Dateninfrastruktur behandelt werden. Wenn Daten verarbeitet werden, die HIPAA, DSGVO oder gleichwertigen Rahmenwerken unterliegen, die Datenschutzrichtlinie der Organisation überprüfen, bevor KI-Werkzeuge verwendet werden. Im Zweifelsfall den Datenschutzbeauftragten oder Rechtsberater konsultieren.

---

## 30-Sekunden-Installation

```bash
# Alle Healthcare-Admin-Skills und Agents installieren
npx claudient add skill ops/dental-practice
npx claudient add skill ops/sop-writer
npx claudient add skill hr/hiring-pipeline
npx claudient add skill hr/job-description
npx claudient add skill compliance/gdpr-expert
npx claudient add skill compliance/privacy-pia

# Oder vollständige Ops-, Compliance- und HR-Bundles installieren:
npx claudient add skills ops
npx claudient add skills compliance
npx claudient add skills hr
```

---

## Dein Claude Code Healthcare-Admin-Stack

### Skills (Slash-Befehle)

| Skill | Was er macht | Wann verwenden |
|---|---|---|
| `/dental-practice` | Praxisoperations-Templates — Terminerinnerungen, Recall-Briefe, Einwilligungsformular-Formulierungen, Empfangsskripte | Tägliche Patientenkommunikations-Administration |
| `/sop-writer` | SOP-Erstentwürfe aus Stichpunkten — formatiert, versioniert, review-bereit | Klinische Adminprozeduren aktualisieren oder erstellen |
| `/hiring-pipeline` | End-to-End-Einstellungsworkflow — Stellenausschreibung, Screening, Interviewfragen, Angebot | Verwaltungs-, Empfangs- oder klinisches Unterstützungspersonal rekrutieren |
| `/job-description` | Konforme Stellenbeschreibungen mit erforderlichen Angaben für Gesundheitsrollen | Jede neue Einstellungsanforderung |
| `/gdpr-expert` | DSGVO-Compliance-Q&A, Entwürfe für Betroffenenanfragen, Aufbewahrungsplan-Review | Datenschutz, Patientendatenanfragen, Richtlinien-Review |
| `/privacy-pia` | Datenschutz-Folgenabschätzungs-Scaffolding für neue Systeme oder Prozessänderungen | Vor der Einführung neuer Software oder Datenflüsse |
| `/invoice-chaser` | Entwürfe für überfällige Rechnungs-Follow-up-E-Mails mit eskalierendem Ton | Ausstehende Zahlungen von Versicherern oder Lieferanten nachverfolgen |
| `/expense-audit` | Anomalien markieren, Ausgaben kategorisieren, Richtlinienausnahmen kennzeichnen | Monatlicher Ausgaben- und Beschaffungs-Review |
| `/customer-inquiry` | Patientenanfrage-Antwort-Templates — Terminanfragen, Serviceinformationen, Beschwerden | Antworten auf Patientenanfragen entwerfen (anonymisiert) |
| `/review-response` | Professionelle Antworten auf Online-Patientenbewertungen entwerfen | Google-, NHS-Choices- oder Trustpilot-Bewertungsmanagement |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `roles/healthcare-admin` | Sonnet | Vollständige administrative Sessions — Planung, Kommunikation, Abrechnungskoordination |
| `advisors/general-counsel` | Opus | Compliance-Fragen, Vertragsformulierungen, Datenschutz, regulatorische Interpretation |
| `advisors/chro-advisor` | Sonnet | Personal-HR — Einstellung, Disziplinarverfahren, Verträge, Abwesenheitsmanagement |

---

## Täglicher Workflow

### Morgens — Patiententerminplan-Review (15-20 Minuten)

**1. Tagesvorbereitung — was braucht heute Aufmerksamkeit**
```
/dental-practice

Heutige Admin-Prioritäten:
- Wir haben [N] Termine. Markiere alle, die Pre-Termin-Bestätigungsanrufe benötigen.
- Entwurf einer Same-Day-Erinnerungsnachricht für Nachmittagstermine (anonymisiertes Template).
- Recall-Briefe, die diese Woche fällig sind — entwurf das Template für [Recall-Typ].

Platzhalterpatienten-Namen durchgehend verwenden.
```

**2. Patientenanfragen-Triage**
```
/customer-inquiry

Antworten auf folgende heute Morgen eingegangene Anfrage-Typen entwerfen:
1. Patient möchte Termin verschieben — wünscht frühestmöglichen Slot
2. Patient fragt nach [Dienstleistungstyp] und Kosten
3. Patientenbeschwerde über Wartezeiten beim letzten Besuch

Alle Antworten professionell, freundlich und unter 150 Wörter halten.
Keine echten Patientendetails einfügen — Namen werden manuell vor dem Senden hinzugefügt.
```

---

### Mittags — Abrechnung und Administration (20-30 Minuten)

**3. Rechnungs-Follow-up**
```
/invoice-chaser

Follow-up-E-Mails für folgende ausstehende Rechnungen entwerfen:
- Rechnung [Ref]: [Lieferanten-/Versicherungsname], fällig seit [N] Tagen, Betrag [X]
- Rechnung [Ref]: [Lieferanten-/Versicherungsname], fällig seit [N] Tagen, Betrag [X]

Ton für 15 Tage überfällig: höfliche Erinnerung.
Ton für 30+ Tage überfällig: bestimmt, mit Verweis auf Zahlungsbedingungen.
Keine echten Patientendaten in Rechnungsreferenzen einschließen.
```

**4. Ausgaben-Review**
```
/expense-audit

Hier ist die monatliche Ausgabenzusammenfassung nach Kategorie:
[Anonymisierte Ausgabendaten einfügen — keine Patienten-Identifikatoren]

Alles kennzeichnen, das ungewöhnlich, über dem Budget oder außerhalb der Richtlinien aussieht.
Für den Monatsbericht des Praxismanagers zusammenfassen.
```

---

### Nachmittags — Compliance und Dokumentation (20-30 Minuten)

**5. SOP-Aktualisierung**
```
/sop-writer

Ich benötige einen Erstentwurf einer SOP für:
[Thema — z.B. "Bearbeitung von Datenschutz-Auskunftsersuchen der Patienten"]

Schlüsselschritte, die abgedeckt sein müssen:
- [Schritt 1]
- [Schritt 2]
- [Schritt 3]

Format: nummerierte Schritte, Verantwortlicher für jeden Schritt, Review-Häufigkeit, Versionsfeld oben.
Lücken kennzeichnen, wo der Datenschutzbeauftragte oder das Rechtsteam konsultiert werden muss.
```

**6. Compliance-Prüfung**
```
/gdpr-expert

Wir planen die Einführung einer neuen [Software/Prozess], die [Datentyp] verarbeitet.
Die Fragen durchgehen, die vor der Freigabe beantwortet werden müssen:
- Ist eine Datenschutz-Folgenabschätzung erforderlich?
- Welche Datenverarbeitungsverträge werden benötigt?
- Wie sollte der Aufbewahrungsplan aussehen?

Keine echten Patientendaten — dies ist eine Planungsübung.
```

---

### Personalkoordination (nach Bedarf)

**7. Einstellung — neue Stelle**
```
/job-description

Stelle: [Bezeichnung — z.B. Rezeptionistin / Praxiskoordinatorin / Medizinsekretärin]
Umfeld: [Hausarztpraxis / Zahnarztpraxis / Fachklinik]
Stunden: [Vollzeit / Teilzeit]
Hauptaufgaben: [Stichpunktliste]
Erforderliche Qualifikationen: [Liste]
Erforderliche Angaben: Erweitertes Führungszeugnis erforderlich, Arbeitsberechtigung

Konforme Stellenbeschreibung und kurze Stellenanzeige für NHS Jobs / Indeed entwerfen.
```

**8. Bewerbungsprozess**
```
/hiring-pipeline

Wir stellen eine/n [Stelle] ein. Wir haben [N] Kandidaten in der Screening-Phase.

Entwerfen:
1. Strukturierter Interview-Fragenkatalog (8-10 Fragen, kompetenzbasiert)
2. Bewertungsrubrik für jede Frage
3. Standard-Ablehnungs-E-Mail-Template
4. Angebotsbrief-Entwurf (spezifische Bedingungen werden vor dem Senden hinzugefügt)
```

---

### Wöchentlich — Review und Berichterstattung (Freitag, 30 Minuten)

**9. Online-Bewertungs-Antwort**
```
/review-response

Wir haben folgende Online-Bewertung erhalten:
[Bewertung einfügen — Details entfernen, die den Patienten identifizieren könnten]

Professionelle Antwort entwerfen, die:
- Den Bewerter dankt
- Das Anliegen anerkennt ohne Haftung einzugestehen
- Zur direkten Kontaktaufnahme mit der Praxis einlädt
- Unter 100 Wörtern bleibt
```

**10. Wöchentliche Admin-Zusammenfassung**
```
/dental-practice

Wöchentliche Admin-Zusammenfassung für den Praxisinhaber entwerfen:
- Termine diese Woche: [N]
- Eingegangene Beschwerden: [N]
- Ausstehende Rechnungen: [N], Gesamt [X]
- Aktualisierte SOPs: [Liste]
- Offene Compliance-Maßnahmen: [Liste]
- Personalprobleme: [Beschreibung]

Einseitiges Format. Punkte kennzeichnen, die Zustimmung des Inhabers erfordern.
```

---

## 30-Tage-Einarbeitungsplan (Administratoren, die Claude Code neu kennenlernen)

### Woche 1 — Einrichtung und Orientierung
- Alle Skills installieren via `npx claudient add skills ops compliance hr`
- Den Haftungsausschluss vollständig lesen — das Team darüber informieren, was nicht in Prompts eingefügt werden darf
- `/sop-writer` für die drei meistgenutzten Verfahren ausführen — mit der Ausgabequalität vertraut machen, bevor darauf vertraut wird
- `/gdpr-expert` verwenden, um einen bestehenden eigenen Datenprozess zu prüfen
- Erstes Patientenkommunikations-Template mit `/dental-practice` entwerfen — mit aktuellen Templates vergleichen
- Die Datenschutzrichtlinie der Organisation lesen, bevor Claude Code für administrative Live-Aufgaben verwendet wird

### Woche 2 — Kommunikation und Abrechnung
- `/customer-inquiry` verwenden, um eine Bibliothek mit 10 Standard-Patientenanfrage-Antwort-Templates zu erstellen
- Alle überfälligen Rechnungs-Follow-ups mit `/invoice-chaser` entwerfen — Antwortrate mit dem Vormonat vergleichen
- `/expense-audit` für die Ausgaben des letzten Monats ausführen — Ergebnisse dem Vorgesetzten präsentieren
- Zeit für Kommunikations-Administration vs. Baseline vor Claude Code verfolgen beginnen

### Woche 3 — Compliance und Dokumentation
- `/privacy-pia` für die nächste System- oder Prozessänderung in der Pipeline ausführen
- `/gdpr-expert` verwenden, um eine ausstehende Compliance-Frage zu beantworten, die das Team aufgeschoben hat
- Mindestens zwei SOPs mit `/sop-writer` aktualisieren — beide zur klinischen oder Management-Überprüfung einsenden
- Die volumenstärkste wiederkehrende Admin-Aufgabe identifizieren und ein wiederverwendbares Template dafür erstellen

### Woche 4 — Personal und Berichterstattung
- `/hiring-pipeline` und `/job-description` für die nächste offene Stelle verwenden — eingesparte Zeit vs. vorheriger Einstellung messen
- `/review-response` für die letzten fünf unbeantworteten Online-Bewertungen ausführen
- Monatlichen Admin-Bericht mit Claude Code erstellen — benötigte Zeit mit vorherigen Monaten vergleichen
- Eine Prozessverbesserung dem Praxisinhaber präsentieren, mit Zeitersparnisdaten belegt

---

## HIPAA-Bewusstsein und Datenverarbeitung

Wenn die Praxis HIPAA (USA), DSGVO (UK/EU) oder gleichwertigen Rahmenwerken unterliegt, diese Regeln ohne Ausnahme befolgen:

- **Niemals einen echten Patientennamen, ein Geburtsdatum, eine Adresse, Telefonnummer, E-Mail oder Versicherungs-/NHS-Nummer in einen Prompt einfügen**
- Platzhalter verwenden: "Patient A", "Herr X", "Geburtsdatum: [geschwärzt]", "Anspruchsreferenz: [Ref]"
- Claude Code wie jedes Drittanbieter-SaaS-Tool behandeln — keine Daten teilen, die nicht ohne unterzeichneten Datenverarbeitungsvertrag mit einem externen Anbieter geteilt würden
- Ein Protokoll führen, welche administrativen Prozesse mit Claude Code durchgeführt werden — der Datenschutzbeauftragte benötigt dies möglicherweise für ein Verarbeitungsverzeichnis
- Bei einem Datenschutz-Auskunftsersuchen (DSAR) `/gdpr-expert` verwenden, um die Prozesscheckliste zu erstellen, aber die eigentlichen Patientendaten vollständig außerhalb von Claude Code verwalten

Im Zweifelsfall das Template mit einem fiktiven Beispiel erstellen und testen, dann manuell auf echte Daten im Praxisverwaltungssystem anwenden.

---

## Benchmarks

Diese monatlich verfolgen, um dem Praxisinhaber den Wert zu demonstrieren:

| Kennzahl | Vor Claude Code | Ziel mit Claude Code |
|---|---|---|
| Eingesparte Admin-Stunden pro Woche | Baseline | 4-8 Stunden |
| Zeit zum Entwerfen eines Patientenkommunikations-Templates | 30-45 Min. | Unter 5 Min. |
| Zeit für einen SOP-Erstentwurf | 45-60 Min. | Unter 10 Min. |
| Antwortzeit auf Patientenanfragen | 24-48 Stunden | Selber Tag |
| Bearbeitungszeit ausstehender Rechnungen | 14+ Tage | 7-10 Tage |
| Zeit für Stellenbeschreibungsentwurf | 60-90 Min. | Unter 15 Min. |
| Online-Bewertungs-Antwortrate | Variabel | 100% innerhalb von 5 Tagen |
| Fristgerecht abgeschlossene Compliance-Aufgaben | Manuell verfolgen | Um 30% verbessern |

In Woche 1 eine Basismessung durchführen, bevor Claude Code im großen Maßstab eingesetzt wird. Nach 30 und 90 Tagen überprüfen.

---

## Ressourcen

- [Getting started with Claude Code](../getting-started.md)
- [SOP writer skill](../skills/ops/sop-writer.md)
- [GDPR expert skill](../skills/compliance/gdpr-expert.md)
- [Privacy PIA skill](../skills/compliance/privacy-pia.md)
- [Hiring pipeline skill](../skills/hr/hiring-pipeline.md)
- [Invoice chaser skill](../skills/finance/invoice-chaser.md)

---
