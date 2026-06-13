---
name: cash-flow-forecast
description: "Cashflow-Prognose für 30-90 Tage für kleine Unternehmen: Einnahmen und Ausgaben modellieren, Lücken identifizieren, Gehaltsausfallzeit und Frühwarnungstrigger"
---

# Cash Flow Forecast Skill

## Wann aktivieren
- Sie sind unsicher, ob Sie genug Bargeld haben, um die nächste Gehaltsmasse zu decken
- Planung eines großen Kaufs und Überprüfung des Timings
- Die Nebensaison kommt und Sie möchten voraus planen
- Sie möchten eine einfache 30/60/90-Tage-Geldflussprojektion
- Ihr Buchhalter hat eine Cashflow-Prognose angefordert

## Wann NICHT verwenden
- Formelle Kreditgeberanträge — verwenden Sie Ihren Buchhalter dafür
- Abgerechnete Finanzaufstellungen
- Multi-Jahres-Prognosen für Investorendecks — benötigt professionelle Modellierung

## Anleitung

### Schnelle 30-Tage-Prognose

Beschreiben Sie einfach Ihre Situation:

```
Helfen Sie mir, eine 30-Tage-Cashflow-Prognose zu erstellen.

Aktueller Kontostand: $[X]
Erwartete Einnahmen diesen Monat:
- [Rechnung/Kunde]: $[Betrag], erwartet [Datum]
- [Wiederkehrende Einnahmen]: $[Betrag], kommt [Datum] an
- Sonstiges: $[Betrag]

Festkosten diesen Monat:
- Miete: $[Betrag], fällig [Datum]
- Gehälter: $[Betrag], fällig [Datum]
- Software-Abonnements: ~$[Betrag]

Variable Ausgaben, die ich erwarte:
- [Lieferantenzahlung]: $[Betrag]
- [Sonstiges]: $[Betrag]

Werde ich genug haben? Wann ist mein tiefster Punkt?
```

### Überprüfung der Gehaltslaufdauer

```
Ich habe $[X] auf meinem Geschäftskonto.
Meine monatliche Gehaltsmasse ist $[Y] (gezahlt am [N.] eines jeden Monats).
Mein durchschnittlicher monatlicher Umsatz ist $[Z], aber es ist variabel.
Meine festen monatlichen Kosten ohne Gehältermasse sind $[W].

Wie viele Monate Laufzeit habe ich?
Welcher Kontostand sollte mich anfangen zu beunruhigen?
Was ist das Minimum, das ich als Puffer auf dem Konto halten sollte?
```

### Cashflow-Lücken erkennen

```
Hier ist meine Prognose für die nächsten 3 Monate:

Monat 1: Erwartete Einnahmen $[X], Ausgaben $[Y]
Monat 2: Erwartete Einnahmen $[X], Ausgaben $[Y] (inkl. Jahresversicherung $Z)
Monat 3: Erwartete Einnahmen $[X], Ausgaben $[Y]

Wo sind die Lücken? Was sollte ich tun, bevor sie eintreffen?
```

### Szenarioplanning

```
Mein größter Kunde ($8.000/Monat) hat mir gerade mitgeteilt, dass er 3 Monate pausiert.
Mein aktueller Kontostand ist $14.000.
Meine monatlichen Festkosten sind $6.200.

Führe mich durch:
1. Wie lange kann ich ohne Ersatz dieser Einnahmen operieren?
2. Welche Ausgaben kann ich verzögern oder reduzieren?
3. Welche Einnahmequellen sollte ich zuerst verfolgen?
```

### Saisonale Unternehmensplanung

```
Mein Unternehmen ist saisonal:
- Spitzenmonate (Juni–August): ~$25.000/Monat Umsatz
- Langsame Monate (Nov–Feb): ~$6.000/Monat Umsatz
- Festkosten monatlich: $8.000

Ich bin derzeit in der Hochsaison mit $22.000 auf dem Konto.
Wie viel sollte ich jeden Spitzenmonat beiseite legen, um die Nebensaison zu überstehen?
```

### Frühwarnungssignale

Bitten Sie Claude, Ihnen bei der Überwachungseinrichtung zu helfen:

```
Basierend auf meinen Finanzdaten, welche Frühwarnungssignale sollte ich überwachen,
die anzeigen, dass ein Cashflow-Problem kommt?
Welche Wochenendschilf/monatlichen Zahlen sollte ich überprüfen?
```

## Beispiel

**Sie sagen:**
```
Kontostand: $18.000
Nächste 30 Tage:
- Kunden-Dauerauftrag: $5.000 kommt am 5. an
- Projektrechnung: $3.200, Kunde zahlt normalerweise in 21 Tagen
- Unsicher: neuer Angebot im Wert von $8.000 könnte sich schließen

Festkosten: Miete $2.800, Gehälter $9.500, Software/Tools $400
Variabel: Lieferantenzahlung $1.200 fällig 15.
```

**Claude antwortet:**
- Bestätigtes Bargeld: $23.000 (Saldo + Dauerauftrag)
- Potenzielles Bargeld: $34.200 (wenn Rechnung pünktlich bezahlt wird + neue Deal schließt)
- Schlimmster Fall am Monatsende: +$9.100 (wenn nichts Zusätzliches kommt)
- Risikomarkierung: Gehalt fällt auf den 15. — dem Tag, an dem die Lieferantenzahlung auch fällig ist. Bestätigen Sie, dass die $3.200 Rechnung zuerst kompensiert wird.
- Empfehlung: Verfolgen Sie die $3.200 Rechnung aktiv. Zählen Sie das $8.000 Angebot in der Planung noch nicht.

---
