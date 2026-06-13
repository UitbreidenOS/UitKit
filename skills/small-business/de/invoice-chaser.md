---
name: invoice-chaser
description: "Automatisierung der Debitorenverwaltung: Entwürfe von Mahnschreiben, Eskalationsfolgen, Zahlungsausfallwarnungen — für QuickBooks, Stripe oder ein beliebiges Rechnungstool"
---

# Invoice Chaser Skill

## Wann aktivieren
- Sie haben überfällige Rechnungen und müssen Nachrichtsfolgen verfassen
- Einrichtung einer Multi-Touch-Mahnserie für Schlechtpayer
- Identifizierung von Kunden mit Zahlungsausfallrisiko
- Verfassung von Eskalations-E-Mails, wenn ein Kunde nicht antwortet
- Zusammenfassung Ihrer Debitorenposition

## Wann NICHT verwenden
- Rechnungen, die weniger als 7 Tage überfällig sind — zu früh, schadet Beziehungen
- Streitigkeiten, bei denen der Kunde einen berechtigten Grund geltend gemacht hat — zuerst lösen
- Rechtliche/Inkasso-Verfahren — dies ist nur für vorgerichtliche Kontaktaufnahme

## Anleitung

### Beschreiben Sie Ihre Situation Claude

Beschreiben Sie es einfach auf Englisch:

```
Ich habe 3 überfällige Rechnungen:
- Acme Corp: $4.200 — 14 Tage überfällig
- Smith & Co: $850 — 32 Tage überfällig
- Blue Sky Ltd: $12.000 — 45 Tage überfällig, keine Antwort auf letzte 2 E-Mails

Verfassen Sie angemessene Nachrichtsfolgen für jede.
```

Claude wird:
- Tonstrukturierte Nachrichten verfassen (sanfte Erinnerung bei 14 Tagen, strenger bei 32, förmliches Schreiben bei 45)
- Den genauen Betrag und überfällige Tage referenzieren
- Einen klaren Call-to-Action einschließen (jetzt bezahlen / Empfang bestätigen / kontaktieren Sie uns)
- Den richtigen nächsten Schritt für jede Überfalligkeitsstufe vorschlagen

### Die Eskalationsleiter

| Tage überfällig | Ton | Aktion |
|---|---|---|
| 1–14 | Freundliche Erinnerung | „Ich wollte nur nachfragen — ist das verlorengegangen?" |
| 15–30 | Höfliche Nachverfolgung | „Dies ist jetzt X Tage überfällig, bitte teilen Sie mir mit" |
| 31–60 | Förmliches Schreiben | „Zahlung ist erforderlich innerhalb von 7 Tagen, um Verzugszinsen zu vermeiden" |
| 60+ | Formale Forderung | „Mahnung für Zahlungsverzug — Maßnahme erforderlich" |
| 90+ | Vor-Inkasso | „Letzte Mahnung vor Inkassoübergabe" |

### Einrichtung einer Sequenz

```
Ich möchte eine automatische 4-teilige Sequenz für jede unbezahlte Rechnung einrichten:
- Tag 3 nach Fälligkeit: sanfte Erinnerung
- Tag 14: Nachverfolgung mit Zahlungslink
- Tag 30: förmliches Schreiben mit Erwähnung der Verzugszinsrichtlinie
- Tag 45: letzte Mahnung vor Inkasso

Verfassen Sie Vorlagen für alle 4 Stufen. Mein Unternehmen ist ein Web-Design-Studio, durchschnittliche Rechnung ist $2.000–$8.000.
```

### Analyse Ihrer Debitorenposition

```
Hier sind meine ausstehenden Rechnungen aus QuickBooks [einfügen oder beschreiben]:
- Kunde A: $X, Fälligkeitsdatum, letzter Kontakt
- Kunde B: $X, Fälligkeitsdatum, letzter Kontakt

Kategorisieren Sie nach Risiko (niedrig/mittel/hoch), Gesamtausstände und empfehlen Sie Prioritätsmaßnahmen.
```

### Extraktion aus QuickBooks

```
Ich habe dies aus QuickBooks exportiert [Daten einfügen].
Welche Rechnungen benötigen sofortige Aufmerksamkeit?
Verfassen Sie Erinnerungs-E-Mails für alles über 30 Tage.
```

## Beispiel

**Sie sagen:**
```
Kunde: Johnson Consulting
Rechnung: $6.500 für Website-Überholung
Fällig: vor 28 Tagen
Vorheriger Kontakt: Rechnung gesendet, seitdem keine Antwort
Mein Ton: professionell aber bestimmt
```

**Claude produziert:**
```
Betreff: Rechnung #1042 — Zahlung fällig ($6.500)

Lieber [Name],

Ich hoffe, es geht Ihnen gut. Ich verfasse eine Nachverfolgung zur Rechnung #1042 über $6.500,
die am [Datum] fällig war und nun 28 Tage überfällig ist.

Ich verstehe, dass es hektisch wird — bitte teilen Sie mir mit, wenn Sie Fragen
zur Rechnung haben oder ob es ein Problem gibt, das ich beheben kann.

Falls die Zahlung bereits versendet wurde, ignorieren Sie diese Nachricht bitte und geben Sie
die Referenznummer an, damit ich meine Unterlagen aktualisieren kann.

Sie können hier online bezahlen: [Zahlungslink]

Vielen Dank für Ihre schnelle Aufmerksamkeit.
```

---
