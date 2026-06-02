---
name: compliance-tracker
description: "Regulatorische Pflichten, Fristen und Nachweisanforderungen über GDPR, SOC2 und ISO27001 hinweg verfolgen"
---

# Compliance-Tracker-Skill

## Wann aktivieren
- Aufbau oder Prüfung eines Compliance-Pflichtregisters über mehrere Rahmenwerke hinweg
- Verfolgung von Fristen zur Beweiserhebung für SOC2-, ISO 27001- oder GDPR-Prüfungen
- Zuordnung, welche Kontrollen für welche Rahmenwerke gelten, um Doppelarbeit zu vermeiden
- Überwachung regulatorischer Fristen (DSAR-Antwortfenster, Fristen für Meldepflichten bei Datenschutzverletzungen, Zertifizierungsverlängerungen)
- Einarbeitung eines neuen Compliance-Officers mit Bestandsaufnahme der aktuellen Pflichten
- Vorbereitung auf eine Prüfung und Bedarf an einer Lückenanalyse gegenüber den geforderten Nachweisen

## Wann NICHT verwenden
- Rechtliche Beratung für spezifische Rechtsgebiete — dieser Skill identifiziert Pflichten, ein Anwalt interpretiert sie
- Echtzeit-Überwachung regulatorischer Änderungen — Claude arbeitet auf Basis bekannter Rahmenwerke, nicht auf Basis von Live-Rechtsquellen
- Erstellung tatsächlicher Einreichungsunterlagen — dies ist ein Tracking- und Planungswerkzeug
- Ersatz einer GRC-Plattform (Vanta, Drata, Secureframe) — diese Plattformen nutzen für automatisierte Beweiserhebung

## WICHTIG

Compliance-Anforderungen ändern sich. Alle Pflichtenlisten müssen gegen die aktuelle Version jedes Standards geprüft werden (GDPR: in der jeweils geltenden Fassung; SOC2: AICPA 2017 Trust Services Criteria; ISO 27001: ISO/IEC 27001:2022). Diesen Output stets mit Rechtsberatern und externen Prüfern validieren, bevor er als verbindlich gilt.

## Anweisungen

### Prompt für das Pflichtregister

```
Erstelle ein Compliance-Pflichtregister für [UNTERNEHMEN].

Unternehmenskontext:
- Branche: [Sektor]
- Rechtsgebiete: [Liste — z.B. EU/EWR, UK, USA, Kalifornien]
- Verarbeitete Datentypen: [personenbezogene Daten / Finanzdaten / Gesundheitsdaten / etc.]
- Geschäftsmodell: [SaaS / Marktplatz / Dienstleistungen / etc.]
- Anwendbare Rahmenwerke: [GDPR / UK GDPR / SOC2 Type II / ISO 27001 / CCPA / HIPAA / PCI-DSS]
- Aktuelle Zertifizierungen: [Liste mit Ablaufdaten oder „keine"]
- Jahresumsatz (für Wesentlichkeitsschwellen): [optional]

Erstelle ein Pflichtregister mit:

Für jedes Rahmenwerk:
1. Wesentliche Pflichten (komprimiert — was getan werden muss, kein vollständiger Regelungstext)
2. Erforderlicher Nachweistyp (Richtlinie / Aufzeichnung / Protokoll / Prüfung / Bericht)
3. Verantwortlicher (Rolle, kein Name)
4. Häufigkeit (laufend / jährlich / ereignisbasiert / anfragebezogen)
5. Frist oder SLA (bei zeitgebundenen Pflichten)
6. Aktueller Status: [Konform / Lücke / In Bearbeitung / Nicht begonnen]

Ausgabeformat: eine Tabelle pro Rahmenwerk.
```

### GDPR-Pflichttracker

```typescript
interface GDPRObligation {
  article: string             // z.B. "Art. 13", "Art. 30"
  obligation: string          // Beschreibung in einfacher Sprache
  evidenceRequired: string[]  // was den Nachweis der Konformität belegt
  owner: string               // DPO / Legal / IT / HR / Marketing
  frequency: 'ongoing' | 'annual' | 'per-event' | 'per-request'
  sla: string | null          // Zeitlimit, falls zutreffend
  status: 'compliant' | 'gap' | 'in-progress' | 'not-started'
}

const GDPR_CORE_OBLIGATIONS: GDPRObligation[] = [
  {
    article: 'Art. 13-14',
    obligation: 'Provide privacy notices to data subjects at point of collection',
    evidenceRequired: ['Privacy policy', 'Cookie notice', 'Sign-up flow screenshots'],
    owner: 'Legal / Marketing',
    frequency: 'ongoing',
    sla: 'At time of collection',
    status: 'gap', // Platzhalter — auf tatsächlichen Wert aktualisieren
  },
  {
    article: 'Art. 30',
    obligation: 'Maintain Records of Processing Activities (RoPA)',
    evidenceRequired: ['RoPA document', 'Last review date and sign-off'],
    owner: 'DPO / Legal',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
  {
    article: 'Art. 32',
    obligation: 'Implement appropriate technical and organisational measures (TOMs)',
    evidenceRequired: ['Security policy', 'Encryption standards doc', 'Access control records', 'Pen test reports'],
    owner: 'CISO / IT',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
  {
    article: 'Art. 33',
    obligation: 'Report personal data breaches to supervisory authority within 72 hours',
    evidenceRequired: ['Incident response plan', 'Breach notification template', 'Breach log'],
    owner: 'DPO / Legal / IT',
    frequency: 'per-event',
    sla: '72 hours from awareness',
    status: 'gap',
  },
  {
    article: 'Art. 35',
    obligation: 'Conduct DPIA for high-risk processing activities',
    evidenceRequired: ['DPIA register', 'Completed DPIAs for high-risk activities'],
    owner: 'DPO',
    frequency: 'per-event',
    sla: 'Before processing begins',
    status: 'gap',
  },
  {
    article: 'Art. 37',
    obligation: 'Appoint a DPO if required (public authority / large-scale processing)',
    evidenceRequired: ['DPO appointment letter', 'DPO contact published on website'],
    owner: 'Legal',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
]
```

### SOC2-Kontrolltracker

```
Erstelle einen SOC2 Type II-Kontrolltracker.

In den Scope einbezogene Trust Services Criteria: [TSC — Sicherheit (Pflicht) + Datenschutz / Verfügbarkeit / Vertraulichkeit / Verarbeitungsintegrität]

Für jede Kontrollkategorie folgende Angaben:
- Kontrollziel
- Kontrollmaßnahme (was tatsächlich getan wird)
- Nachweistyp (das Artefakt, das ein Prüfer anfordern wird)
- Erhebungsmethode (automatisiert / manuell)
- Häufigkeit
- Verantwortlicher
- Status (vorhanden / teilweise / Lücke)

Häufig zu verfolgende Sicherheitskontrollen:

CC6 — LOGISCHER UND PHYSISCHER ZUGANG:
CC6.1: Logische Zugangssicherheitsmaßnahmen zum Schutz vor Bedrohungen
  Nachweis: Zugangskontrollrichtlinie, SSO/MFA-Screenshots, vierteljährliche Zugangsprüfungen
  Verantwortlicher: IT / Security | Häufigkeit: Laufend + vierteljährliche Überprüfung | Status: [?]

CC6.2: Registrierung und Autorisierung für neue interne Nutzer
  Nachweis: Prozessdokumentation für Benutzerbereitstellung, Jira-Tickets oder HRIS-Einträge
  Verantwortlicher: IT / HR | Häufigkeit: Ereignisbasiert | Status: [?]

CC6.3: Entzug des Zugangs bei fehlender Berechtigung
  Nachweis: Offboarding-Checkliste, Aufzeichnungen zur Zugangsentziehung
  Verantwortlicher: IT / HR | Häufigkeit: Ereignisbasiert | Status: [?]

CC7 — SYSTEMBETRIEB:
CC7.1: Erkennung und Überwachung von Konfigurationsänderungen
  Nachweis: Change-Management-Richtlinie, Änderungsprotokolleinträge, SIEM-Warnmeldungen
  Verantwortlicher: IT / DevOps | Häufigkeit: Laufend | Status: [?]

CC7.2: Überwachung von Systemkomponenten auf Anomalien
  Nachweis: Screenshots von Monitoring-Tools (Datadog, CloudWatch etc.), Warnkonfiguration
  Verantwortlicher: Engineering | Häufigkeit: Laufend | Status: [?]

[Für alle zutreffenden Kontrollen fortsetzen]
```

### ISO 27001-Klausel-Tracker

```
Erstelle einen ISO 27001:2022-Compliance-Tracker.

Anwendbare Anhang-A-Kontrollen: [alle verwenden / oder bestimmte Domänen im Scope auflisten]

Format für jede Klausel:

Klausel [X.X]: [Klauselname]
Anforderung: [In einfacher Sprache — was ISO verlangt]
Lückenanalyse: [Ist-Zustand vs. Anforderung]
Erforderliche Nachweise: [Richtlinie / Verfahren / Aufzeichnung / technische Kontrolle]
Verantwortlicher: [Rolle]
Zieldatum: [Wann wird dies abgeschlossen sein]
Status: [Konform / In Bearbeitung / Lücke]

Prioritäre zu verfolgende Klauseln (ISO 27001:2022):

A.5 — Informationssicherheitsrichtlinien:
  A.5.1: Richtlinien für Informationssicherheit → Nachweis: IS-Richtlinie unterzeichnet durch das Top-Management, jährliche Überprüfung
  A.5.2: Rollen und Verantwortlichkeiten für Informationssicherheit → Nachweis: RACI, Organigramm mit Sicherheitszuständigkeiten

A.6 — Personenbezogene Kontrollen:
  A.6.1: Überprüfung → Nachweis: Prozess für Hintergrundprüfungen, Aufzeichnungen (DSGVO-konform)
  A.6.3: Sensibilisierung für Informationssicherheit → Nachweis: Schulungsnachweise, Abschlussquoten

A.8 — Technologische Kontrollen:
  A.8.2: Privilegierte Zugriffsrechte → Nachweis: Inventar privilegierter Konten, PAM-Tool-Screenshots
  A.8.5: Sichere Authentifizierung → Nachweis: MFA-Durchsetzungsrichtlinie, SSO-Konfiguration
  A.8.8: Verwaltung technischer Schwachstellen → Nachweis: Schwachstellenscan-Berichte, Patch-Aufzeichnungen
  A.8.24: Einsatz von Kryptografie → Nachweis: Verschlüsselungsstandards-Dokument, Schlüsselverwaltungsverfahren
  A.8.29: Sicherheitstests in der Entwicklung → Nachweis: SAST/DAST-Konfiguration, Penetrationstest-Berichte

[Verbleibende Klauseln basierend auf dem Scope generieren]
```

### Prompt für die Lückenanalyse

```
Führe eine Compliance-Lückenanalyse durch.

Rahmenwerk: [GDPR / SOC2 / ISO 27001 / CCPA / HIPAA]
Bestätigte vorhandene Nachweise: [Liste der vorhandenen Elemente]
Bekannte Lücken: [Liste der bekanntermaßen fehlenden Elemente]
Prüfungsdatum: [Wann findet die nächste Prüfung / Zertifizierung statt]

Erstelle:
1. Lückenliste — was fehlt gegenüber den Anforderungen des Rahmenwerks
2. Aufwandsschätzung — wie lange das Schließen jeder Lücke dauert (Tage/Wochen)
3. Priorisierung — welche Lücken bei Nichtschließung zum Prüfungsversagen führen würden
4. Empfehlungen für Verantwortliche — welches Team jede Lücke schließen sollte
5. Sanierungsplan — eine nach Priorität geordnete 90-Tage-Aktionsliste

Format als:
| Lücke | Rahmenwerk | Schweregrad | Aufwand | Verantwortlicher | Zieldatum | Status |
|---|---|---|---|---|---|---|
| [Lücke] | [Rahmenwerk] | [Kritisch/Hoch/Mittel/Niedrig] | [X Tage] | [Rolle] | [Datum] | [Offen] |
```

### Prompt für den Fristentracker

```
Erstelle einen Compliance-Fristentracker.

Alle zeitkritischen Pflichten aus den anwendbaren Rahmenwerken einbeziehen:

REGULATORISCHE FRISTEN (nicht verhandelbar):
- GDPR Art. 33: Personenbezogene Datenschutzverletzung → Aufsichtsbehörde: 72 Stunden ab Kenntnis
- GDPR Art. 34: Datenschutzverletzung → hochriskante Personen: „ohne unangemessene Verzögerung"
- GDPR Art. 12: DSAR-Antwort: 30 Tage (mit Benachrichtigung auf 90 Tage verlängerbar)
- UK GDPR: Identisch mit GDPR (72-Stunden-Meldung, 30-Tage-DSAR)
- CCPA: DSAR-Antwort: 45 Tage (auf 90 verlängerbar)
- HIPAA-Verletzung (>500 Personen): 60 Tage ab Entdeckung; HHS + Medien benachrichtigen
- HIPAA-Verletzung (<500): Jahresbericht an HHS (innerhalb von 60 Tagen nach Jahresende)

ZERTIFIZIERUNGSFRISTEN:
- SOC2 Type II: Jährliches Berichtsfenster — [unser Prüfungsstartdatum]: [Datum]
- ISO 27001: Überwachungsaudit: [Datum] | Rezertifizierung: [Datum]
- PCI-DSS: Jährliche Bewertung fällig: [Datum]

INTERNE FRISTEN:
- Vierteljährliche Zugangsprüfungen: [nächstes Datum]
- Jährliche Richtlinienprüfungen: [nächstes Datum]
- Sicherheitsschulung für Mitarbeiter: [Abschlussfrist]
- Lieferanten-Risikobewertungen: [nächste Charge fällig]

Format als Kalenderansicht nach Quartal mit RAG-Status:
🔴 Rot: <30 Tage verbleibend
🟡 Gelb: 30–90 Tage verbleibend
🟢 Grün: >90 Tage verbleibend
```

### Checkliste für die Beweiserhebung

```
Erstelle eine Beweiserhebungs-Checkliste für die [RAHMENWERK]-Prüfungsvorbereitung.

Für jedes erforderliche Nachweiselement:
- Was es ist (in einfacher Sprache)
- Wo es zu erhalten ist (System, Tool oder Prozessverantwortlicher)
- Format, das Prüfer erwarten (Screenshot / Export / unterzeichnetes Dokument / Log-Datei)
- Erforderliche Aufbewahrungsfrist
- Wer für die Erhebung verantwortlich ist

Nach Kontrollkategorie gruppieren. Elemente kennzeichnen, die Automatisierung vs. manuelle Erhebung erfordern.

Beispiel-Ausgabeformat:
| Nachweis | Quelle | Format | Verantwortlicher | Aufbewahrung | Erhebungsmethode |
|---|---|---|---|---|---|
| MFA-Durchsetzungs-Screenshot | Okta Admin-Konsole | PNG, datiert | IT | 12 Monate | Manuell, monatlich |
| Zugangsprüfungs-Abschlussnachweis | HRIS + Jira | Unterzeichnetes PDF | IT + HR | 12 Monate | Manuell, vierteljährlich |
| Schwachstellenscan-Bericht | Qualys / Nessus | PDF-Export | Security | 12 Monate | Automatisiert, monatlich |
```

## Beispiel

**Nutzer:** Wir sind ein Series-B-SaaS-Unternehmen, das personenbezogene EU-Daten verarbeitet. GDPR gilt, wir arbeiten auf SOC2 Type II hin. Unsere Prüfung ist in 4 Monaten. Was sind unsere 10 kritischsten Compliance-Lücken?

**Erwartete Ausgabe:**
```markdown
# Top 10 kritische Compliance-Lücken — GDPR + SOC2 Type II-Vorbereitung
[GEGEN aktuelle Rahmenwerk-Versionen und Rechtsberater VALIDIEREN]

Priorität | Lücke | Rahmenwerk | Prüfungsrisiko | Aufwand | Verantwortlicher
---|---|---|---|---|---
1 | Kein Verzeichnis von Verarbeitungstätigkeiten (VVT) | GDPR Art.30 | Hoch — Prüfer fordern dies zuerst an | 3–5 Tage | DPO/Legal
2 | Keine AVVs mit Drittverarbeitern | GDPR Art.28 | Hoch — vertragliche Pflicht | 1–2 Wochen | Legal
3 | Fehlende Datenschutzhinweise an Erhebungspunkten | GDPR Art.13 | Hoch — für Prüfer sichtbar | 3–5 Tage | Legal + Marketing
4 | Kein formaler Zugangsprüfungsprozess (vierteljährlich) | SOC2 CC6.3 | Hoch — für gesamten Zeitraum geprüft | 2 Wochen zur Einführung | IT
5 | Kein Change-Management-Protokoll für Produktivsysteme | SOC2 CC7.1 | Hoch — benötigt 12-Monats-Sample | Sofort — jetzt beginnen | DevOps
6 | Incident-Response-Plan nicht getestet (kein Tabletop) | SOC2 CC7.3 / GDPR Art.33 | Mittel — Testnachweis erforderlich | 1 Tag Tabletop | DPO + IT
7 | Kein formales DSFA für Hochrisikoverarbeitung (ML-Modell) | GDPR Art.35 | Mittel | 1–2 Wochen | DPO
8 | Sicherheitsbewusstseinstraining nicht dokumentiert | SOC2 CC2.2 | Mittel — Abschlussnachweise erforderlich | 2–3 Tage | HR + IT
9 | Verschlüsselung im Ruhezustand für alle Datenspeicher nicht bestätigt | SOC2 CC6.7 | Mittel — technischer Nachweis | 1–2 Tage Prüfung | Engineering
10 | Kein Schwachstellenmanagementprogramm (Scan + Patch-SLA) | SOC2 CC7.1 | Mittel — regelmäßige Nachweise erforderlich | 2 Wochen zur Einführung | Security
```

---

> **Arbeite mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
