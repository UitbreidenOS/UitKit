---
name: quickbooks-workflow
description: "QuickBooks-Monatsabschluss, Bankabstimmung, Ausgabenklassifizierung, Abweichungserkennung und Finanzberichtzusammenfassungen für Kleinunternehmer"
---

# QuickBooks Workflow Skill

## Wann aktivieren
- Durchführung des Monatsabschlusses in QuickBooks
- Abstimmung von Bankkonten und Ermittlung von Abweichungen
- Klassifizierung von Ausgaben und Überprüfung von Transaktionen
- Verständnis dessen, was Ihr Gewinn- und Verlustrechnungsbericht Ihnen sagt
- Vorbereitung von Daten für Ihren Buchhalter oder Steuerbereiter

## Wann NICHT verwenden
- Einreichung tatsächlicher Steuererklärungen — verwenden Sie einen lizenzierten Buchhalter
- Rechtliche Streitigkeiten über Finanzunterlagen — konsultieren Sie einen Fachmann
- Lohnabrechnung — verwenden Sie QuickBooks Payroll oder Gusto direkt

## Anleitung

### Checkliste zum Monatsabschluss

Bitten Sie Claude, Sie schrittweise zu führen:

```
Ich muss meinen Monatsabschluss in QuickBooks für [Monat] durchführen.
Führen Sie mich Schritt für Schritt durch die Checkliste.
Mein Unternehmen ist ein [Art des Unternehmens].
```

Claude führt Sie durch:
1. Alle Verkäufe und Einnahmen erfassen
2. Alle Ausgaben klassifizieren
3. Bankkonten abstimmen
4. Überprüfung der Debitorenbuchhaltung (unbezahlte Rechnungen)
5. Überprüfung der Kreditorenbuchhaltung (unbezahlte Rechnungen)
6. Gewinn- und Verlustrechnungsbericht ausführen
7. Bilanz auf Anomalien prüfen

### Hilfe zur Bankabstimmung

```
Mein QuickBooks-Saldo zeigt $12.340, aber mein Kontoauszug zeigt $11.890.
Es gibt einen Unterschied von 450 $. Hier sind meine letzten Transaktionen: [Liste einfügen]
Helfen Sie mir, die Ursache zu finden.
```

Häufige Ursachen, die Claude Ihnen hilft zu finden:
- Ausstehende Schecks, die noch nicht verrechnet sind
- Hinterlegte Einzahlungen
- Bankgebühren, die nicht in QuickBooks erfasst wurden
- Doppelte Transaktionen
- Transaktionen mit falschen Beträgen eingegeben

### Ausgabenklassifizierung

```
Ich habe diese Transaktionen aus dem letzten Monat, die noch nicht klassifiziert sind:
- 89 $ - Adobe Creative Cloud
- 340 $ - Geschäftsessen im Restaurant
- 1.200 $ - Auftragnehmer Zahlung an John Smith
- 45 $ - Parken in Kundenbüro

Wie sollte ich jede in QuickBooks klassifizieren?
```

Claude ordnet jede dem richtigen QuickBooks-Konto zu (Software/Abonnements, Mahlzeiten & Unterhaltung, Auftragsarbeit, Reisen).

### Gewinn- und Verlustinterpretation

```
Meine QuickBooks Gewinn- und Verlustrechnung für Q1 zeigt:
Umsatz: $84.000
Kosten der verkauften Waren: $31.000
Bruttogewinn: $53.000
Betriebsausgaben: $47.000
Nettogewinn: $6.000

Ist dies gesund für ein [Art des Unternehmens]? Worauf sollte ich achten?
```

### Vor-Buchhalter-Bereinigung

```
Mein Buchhalter verlangt saubere Bücher für das Jahr.
Hier ist, was ich noch sortieren muss: [beschreiben Sie das Durcheinander]
Geben Sie mir eine priorisierte Bereinigungs-Checkliste.
```

### Ihre Zahlen verstehen

```
Meine QuickBooks zeigt, dass ich 145.000 $ Umsatz gemacht habe, aber ich habe nur 12.000 $ auf meinem
Bankkonto. Warum? Führen Sie mich durch, wo das Geld hingeht.
```

## Beispiel

**Sie sagen:**
```
Ich habe gerade meine Dezember-Gewinn- und Verlustrechnung in QuickBooks ausgeführt. Hier sind die Zahlen:
Umsatz: $28.500
Ausgaben: $26.200
Nettogewinn: $2.300
Das fühlt sich niedriger als üblich an. Meine größten Ausgabenkategorien sind:
- Gehälter: $14.000
- Miete: $3.500
- Software: $2.100
- Marketing: $4.200
- Sonstiges: $2.400

Worauf sollte ich zuerst schauen?
```

**Claude antwortet mit:**
Analyse Ihrer Marge (8%), Vergleich mit typischen Benchmarks für Ihren Geschäftstyp, Kennzeichnung der Kategorie "Sonstiges" als überprüfungswürdig für Missklassifizierungen, Anmerkung, dass die Marketingausgaben im Verhältnis zum Umsatz hoch sind und fragt, welche Rendite Sie sehen, schlägt einen Jahresvergleich vor.

---
