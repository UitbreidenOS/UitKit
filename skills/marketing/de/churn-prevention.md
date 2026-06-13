---
name: churn-prevention
description: "Churn-Prävention: Identifizierung gefährdeter Kunden, Interventions-Playbooks, Save-Offer-Design, Exit-Survey-Analyse, Rückgewinnungskampagnen"
---

# Churn-Prävention-Skill

## Wann aktivieren
- Identifizierung von Kunden, die abzuwandern drohen
- Gestaltung einer Intervention, wenn ein Kunde Churn-Signale zeigt
- Analyse von Exit-Survey-Antworten zum Finden von Mustern
- Aufbau einer Rückgewinnungskampagne für kürzlich abgewanderte Kunden
- Berechnung und Reduzierung Ihrer monatlichen Churn-Rate

## Wann nicht verwenden
- Echtzeit-Churn-Vorhersage — benötigt ein dediziertes ML-Modell oder Tool (ChurnZero, Gainsight)
- Customer Success Management für Enterprise-Konten — verwenden Sie dedizierte CS-Plattform

## Anleitung

### Gefährdete Kunden identifizieren

```
Helfen Sie mir, gefährdete Kunden aus diesen Nutzungs-/Engagement-Daten zu identifizieren:

[Signale einfügen oder beschreiben, auf die Sie Zugriff haben]:
- Änderungen der Login-Häufigkeit
- Rückgang der Feature-Nutzung
- Erhöhung des Support-Ticket-Volumes
- Abrechnungsprobleme / fehlgeschlagene Zahlungen
- Ungenutzte Schlüsselfunktionen (besonders wenn dafür bezahlt)
- Niedriger NPS-Score (0-6 = Detraktoren)
- Antwortet nicht auf CS-Outreach

Sagen Sie mir für jedes Signal:
1. Wie stark ist dies ein Churn-Indikator?
2. Welche Intervention sollte ich auslösen?
3. Wie dringend ist das Outreach?
```

### Interventions-Playbook nach Signal

```
Gestalten Sie ein Churn-Interventions-Playbook.

Mein Produkt: [SaaS / Abonnementdienst / Marktplatz]
Kundensegment: [KMU / Mid-Market / Enterprise]
Durchschnittlicher Vertragswert: $[X]/Monat
Churn-Rate: [X]% monatlich

Für jedes Churn-Signal, was sollte ich tun?

Signal: Seit 14 Tagen nicht angemeldet
→ Auslöser: [automatisierte E-Mail / CS-Anruf / In-App-Nachricht]
→ Nachrichtenwinkel: [Wiederengagement / Wert-Erinnerung / Hilfeangebot]
→ Eskalation bei keiner Antwort: [nach X Tagen → machen Y]

Signal: Negativ eingereichte NPS (0-6)
Signal: Support 3+ mal in 30 Tagen kontaktiert
Signal: 3 von 5 Sitzen storniert (Teilstornierung)
Signal: Onboarding nicht abgeschlossen

Erstellen Sie das Playbook mit spezifischen Nachrichtenvorlagen für jeden Trigger.
```

### Save-Offer-Design

```
Gestalten Sie ein Rettungsangebot für Kunden, die die Kündigung eingeleitet haben.

Wenn sie auf "Kündigen" klicken, möchte ich anbieten:
Mein Produktpreis: $[X]/Monat
Churn-Grund (wenn gefragt): [Preis / nicht nutzen / Konkurrenz / fehlende Funktion / Budgetkürzung]

Gestalten Sie Rettungsangebote für jeden Grund:
- Preisbedenken: [X]% Rabatt für [X] Monate / Downgrade-Option / Pause-Option
- Nicht nutzen: kostenlose 1:1-Onboarding-Sitzung + Nutzungscoaching
- Konkurrenz: [was uns besser macht / spezifischer Vergleich]
- Fehlende Funktion: [Roadmap / Workaround / Feedback-Erfassung]
- Budgetkürzung: Pause anstelle Kündigung (Beziehung beibehalten)

Für jeden: Schreiben Sie das Messaging des Rettungsangebots (< 150 Wörter, ehrlich, nicht verzweifelt).
```

### Exit-Survey-Analyse

```
Analysieren Sie diese Exit-Survey-Antworten und identifizieren Sie Muster:

[Antworten einfügen oder Verteilung beschreiben]
Wichtigste genannte Gründe: [Liste]
Wörtliche Kommentare: [Beispiel einfügen]

Aus dieser Analyse:
1. Was sind die Top 3 vermeidbaren Churn-Gründe?
2. Welche Produkt- oder Prozessänderungen würden jede ansprechen?
3. Welche abgewanderten Kunden sind am wahrscheinlichsten zurückzugewinnen?
4. Was sollte ich in meinem Onboarding ändern, um diesen Churn zu verhindern?
```

### Rückgewinnungskampagne

```
Gestalten Sie eine Rückgewinnungs-E-Mail-Kampagne für Kunden, die vor [X] Monaten abgewandert sind.

Churn-Grund (falls bekannt): [beschreiben]
Was sich seit ihrem Weggang geändert hat: [neue Features / Preisänderung / Verbesserungen]
Anreiz, den ich anbieten kann: [Rabatt / erweiterte Testversion / neuer Feature-Zugriff]

Schreiben Sie eine 3-E-Mail-Rückgewinnungssequenz:
E-Mail 1 (Woche 4 nach Churn): Check-in — "Wie geht es dir?"
E-Mail 2 (Woche 8): "Hier ist, was sich seit deinem Weggang geändert hat"
E-Mail 3 (Monat 6): Endgültiges Rückgewinnungsangebot mit Anreiz

Jede E-Mail sollte sich persönlich und unverbindlich anfühlen.
```

### Churn-Rate-Analyse

```
Helfen Sie mir, meine Churn-Rate zu verstehen und zu reduzieren.

Aktuelle Metriken:
- Monatliche Churn-Rate: [X]%
- Durchschnittliche Kundenlebensdauer: [X] Monate
- Kunden-LTV: $[X]
- CAC: $[X]

Wenn ich Churn um 1% reduziere:
- Neue monatliche Churn-Rate: [X]%
- Auswirkung auf LTV: $[X] → $[X]
- Auswirkung auf Umsatz bei [X] Kunden: $[X]/Monat Verbesserung

Was sind die hochgradig wirksamen Veränderungen, die ich in den nächsten 90 Tagen durchführen kann, um Churn um 1% zu reduzieren?
```

## Beispiel

**Benutzer:** 8% monatliche Churn bei einem $49/Monat SaaS-Tool. Exit-Surveys zeigen 42% sagen "nutze es nicht genug".

**Claudes Analyse:**

Grundursache: Aktivierungsversagen, kein Produktversagen. "Nutze es nicht genug" = nicht zum Wert gekommen.

**Top 3 Interventionen:**

1. **Onboarding beheben (höchster Hebel):** 42% Churn aufgrund von Nicht-Aktivierung ist ein Onboarding-Problem. Einen verbindlichen "ersten Wertmoment" vor Testende hinzufügen — lassen Sie sie eine Kernaktion abschließen, die den Produktwert zeigt. Ziel: Dieses Segment auf 20% reduzieren.

2. **Verwendungs-ausgelöster Outreach am Tag 7:** Wenn ein Benutzer die Kernaction am Tag 7 des Tests nicht abgeschlossen hat, senden Sie eine automatisierte "stuck?"-E-Mail mit einem kurzen Loom-Video oder 15-Minuten-Anrufsangebot. Nicht warten, bis sie aufhören zu nutzen.

3. **Pause-Option bei Kündigung:** "Nutze es nicht genug" bedeutet oft beschäftigt, nicht desinteressiert. Eine 1-Monats-Pause (kostenfrei, Abonnement auf Eis) konvertiert 15-25% der potenziellen Churner zu behaltenen Kunden.

**Projizierte Auswirkung:** Diese 3 Änderungen könnten das Segment "nutze es nicht genug" von 42% um die Hälfte reduzieren = ~1,6% Reduzierung der Gesamt-Monats-Churn-Rate.

---
