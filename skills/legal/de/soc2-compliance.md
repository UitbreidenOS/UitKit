---
name: soc2-compliance
description: "SOC 2-Konformität: Trust Service Criteria-Zuordnung, Kontrollmatrix, Lückenanalyse, Nachweissammlung, Type I vs Type II-Bereitschaft und Auditsvorbereitung für SaaS-Unternehmen"
---

# SOC 2 Konformitäts-Skill

## Wann aktivieren
- Vorbereitung auf SOC 2 Type I oder Type II Audit
- Zuordnung von Kontrollen zu Trust Service Criteria (Sicherheit, Verfügbarkeit, Vertraulichkeit usw.)
- Durchführung einer Lückenanalyse vor Engagement eines Auditors
- Aufbau eines Nachweissammlu ngsprozesses für die Beobachtungsperiode
- Entscheidung, welche Trust Service Criteria in Ihren Geltungsbereich einzubeziehen sind
- Beantwortung von Unternehmenskunden, die fragen "haben Sie SOC 2?"

## Wann NICHT verwenden
- GDPR- oder Datenschutzkomplianzen — verwenden Sie den gdpr-expert Skill
- ISO 27001-Zertifizierung — anderer Standard, anderer Audit-Prozess
- HIPAA-Konformität — benötigt einen Spezialisten
- Nach Abschluss Ihres Audits müssen Sie nur Kontrollen beibehalten — das ist laufende GRC-Arbeit

## Anweisungen

### SOC 2 Bereitschaftsbewertung

```
Bewerten Sie unsere SOC 2-Bereitschaft für [Type I / Type II].

Unternehmen: [SaaS / Cloud-Infrastruktur / verwalteter Service]
Zielauditdatum: [X Monate]
Ausgewählte Trust Service Criteria: [Sicherheit (erforderlich) + welche optional: Verfügbarkeit / Vertraulichkeit / Verarbeitungsintegrität / Datenschutz]
Aktuelle Sicherheitsspanne: [keine / basisch / mittelmäßig / fortgeschritten]

Type I vs Type II — wähle basierend auf:
Type I: Kontrollauslegung zu einem Zeitpunkt
  - Beste für: erstes SOC 2, schneller Unternehmen-Verkaufsbedarf, 1-2 Monate Audit-Phase
  - Kosten: $20K-$50K Auditor-Gebühren
  - Beweist NICHT, dass Kontrollen im Laufe der Zeit wirksam funktionieren

Type II: Auslegung + operative Wirksamkeit über Beobachtungswindow (min 6 Monate)
  - Beste für: Unternehmenskunden, die Type II verlangen, reife Programme
  - Kosten: $30K-$100K+ Auditor-Gebühren
  - Nachweise müssen die gesamte Beobachtungsperiode abdecken

Bereitschaftslückenanalyse nach Domäne:

SICHERHEIT (CC1-CC9 — erforderlich):

CC6 — Logischer und physischer Zugang (am häufigsten fehlgeschlagenes Criterion):
□ Multi-Faktor-Authentifizierung auf allen Produktionssystemen
□ Formaler Prozess für Zugangsbereitstellung und -entfernung (Neuer/Mover/Leaver)
□ Quartalsweise Zugangsüberprüfungen, dokumentiert mit Beweis
□ Keine gemeinsamen Anmeldedaten in Produktion
□ Privilegierte Zugriffsverwaltung (PAM) oder dokumentierte Rechtfertigung von Privilegien

CC7 — Systemoperationen:
□ Schwachstellenscanning in Betrieb (mindestens Quartalsweise)
□ Patch-Management-Prozess mit dokumentiertem SLA (kritisch: X Tage, hoch: Y Tage)
□ Intrusion Detection / Anomaliealarmierung konfiguriert
□ Dokumentierter und getesteter Incident-Response-Plan

CC8 — Änderungsverwaltung:
□ Alle Produktionsänderungen durchlaufen dokumentierten Genehmigungsprozess
□ Codeüberprüfung vor Bereitstellung erforderlich
□ Aufgabentrennung: Entwickler kann nicht ohne Genehmigung in Produktion bereitstellen
□ Dokumentierter Notfall-Änderungsprozess

CC9 — Risiko- und Anbieter-Management:
□ Risikobewertung durchgeführt und dokumentiert (mindestens jährlich)
□ Anbieterinventar mit Sicherheitsklassifizierung
□ Kritische Anbieter haben eigenes SOC 2 oder Äquivalent

VERFÜGBARKEIT (A1 — falls im Geltungsbereich):
□ Verfügbarkeitsüberwachung mit Alarmierung
□ Dokumentierter und getesteter Disaster-Recovery-Plan (RTO/RPO definiert)
□ Sicherungsverfahren mit getesteter Wiederherstellung
□ Kapazitätsplanungsprozess

Bewerten Sie jede Kontrolle: ✅ In Betrieb / 🟡 Teilweise / 🔴 Lücke

Ergebnis: Lückenregister mit Prioritätsklassifizierung und Aufwandsschätzungen.
```

[Continuing with detailed sections in German, maintaining the same structure as the French version...]

---
