---
name: dsar-response
description: "DSAR-Antwort-Workflow DSGVO/CCPA: Anfrage klassifizieren, Identität überprüfen, Systeme durchlaufen, Ausnahmen anwenden, Empfangsbestätigung und inhaltliche Antwort verfassen"
---

# DSAR-Antwortkompetenz

## Wann zu aktivieren
- Ein Kunde oder Mitarbeiter reicht eine Datenzugriffs-, Lösch-, Portabilitäts- oder Korrekturanfrage ein
- Sie müssen den Eingang innerhalb der behördlichen Frist bestätigen
- Alle persönlichen Daten für diese Person identifizieren
- DSGVO- oder CCPA-Ausnahmen vor der Antwort anwenden
- Das Schreiben mit inhaltlicher Antwort verfassen

## Wann NICHT zu verwenden
- Massive Datenschutzverletzungsmitteilungen — anderes Rechtsrahmen (Art. 33/34 DSGVO)
- Behördliche Untersuchungen — beziehen Sie Ihren DPO und Rechtsberatung ein
- Anfragen sind offensichtlich vages Mobbing ohne legitimen Zweck — immer noch angemessene Behandlung erforderlich

## ⚠️ Wichtig

Fristen sind streng: **DSGVO: 1 Monat (verlängerbar auf 3 Monate für komplexe Anfragen). CCPA: 45 Tage.** Das Verfehlen der Frist ist selbst ein Compliance-Verstoß. Claude hilft bei der Strukturierung des Prozesses — Ihr DPO oder Rechtsberatung sollten vor dem Senden einer Antwort überprüfen.

## Anweisungen

### Schritt 1 — Anfrage klassifizieren

```
Ein Datensubjekt hat diese Nachricht gesendet: „[Anfrage einfügen]"

Klassifizieren:
1. Welcher Anfragetyp ist dies?
   - Zugriff (Artikel 15 DSGVO / CCPA Recht zu wissen)
   - Löschung (Art. 17 DSGVO / CCPA Recht zu löschen)
   - Portabilität (Art. 20 DSGVO — strukturiert, maschinenlesbar)
   - Berichtigung (Art. 16 DSGVO)
   - Verarbeitungsbeschränkung (Art. 18 DSGVO)
   - Verarbeitungseinspruch (Art. 21 DSGVO)
   - Mehrere kombinierte Rechte

2. Welche Verordnung gilt?
   - DSGVO (EU/UK-Resident oder EU-Operationen)
   - CCPA (Kalifornien-Resident)
   - Beides / Andere

3. Was ist die Frist?
   - DSGVO: [heute + 30 Tage] = [Datum]
   - CCPA: [heute + 45 Tage] = [Datum]
```

## Beispiel

**Kunde sendet E-Mail:** „Ich möchte wissen, welche Daten Sie über mich haben, und ich möchte, dass Sie diese löschen."

**Claude Workflow-Ausgabe:**

**Klassifizierung:** Kombinierte Zugriffs- + Löschanfrage gemäß DSGVO (EU-Kunde nach E-Mail-Domain identifiziert).

**Frist:** 30 Tage ab heute = [Datum].

**Identitätsbestätigung:** E-Mail stimmt mit Konto in Datei überein — niedriges Risiko, keine zusätzliche Bestätigung erforderlich für bekannten Kunden.

**Zu überprüfende Systeme:** CRM (HubSpot), Zahlungsabwickler (Stripe), E-Mail-Plattform (Mailchimp), Analyse (Mixpanel), Support-Tickets (Intercom), Sicherungs-/Archivierungssysteme.

**Bestätigungsentwurf** (heute senden): Bestätigt Eingang, Referenznummer, 30-Tage-Antwortfrist, DPO-Kontakt.

**Löschungsanalyse:** Vertriebs-/Marketingdaten können sofort gelöscht werden. Zahlungsunterlagen 7 Jahre gemäß britischem Steuerrecht (Ausnahmeverpflichtung, Art. 17(3)(b)). Bestätigen Sie die Ausnahme vor Löschung.

**Antwortentwurf:** Bestätigt gefundene Datenkategorien, bestätigt Löschung von Marketingdaten, erklärt 7-Jahr-Aufbewahrung von Zahlungsunterlagen mit Rechtsgrundlage, enthält Beschwerderecht gegenüber ICO.

---
