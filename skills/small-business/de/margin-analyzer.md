---
name: margin-analyzer
description: "Berechnen Sie die Bruttomarge nach Produktlinie, Kundensegment und Kanal; kennzeichnen Sie Artikel mit niedriger Marge; finden Sie heraus, wo Sie wirklich Geld verdienen"
---

# Margin Analyzer

## When to activate
- Sie erwägen eine Preisänderung und möchten die Auswirkungen kennen, bevor Sie sich festlegen
- Sie entscheiden, welche Produkte Sie in einer Kampagne bewerben möchten, und möchten die rentabelsten vorantreiben
- Vierteljährliche Geschäftsprüfung und Sie vermuten, dass einige Produkte oder Kundentypen Ihnen Geld verlieren
- Ihre Einnahmen steigen, aber Ihr Gewinn nicht — Sie müssen das Leck finden

## When NOT to use
- Vollständige GuV-Analyse einschließlich Overhead-Zuordnung — verwenden Sie Ihren Buchhalter dafür
- Mehrjährige Finanzprognosen für Investoren oder Kreditgeber
- Automatische Verfolgung von Margen im Zeitverlauf — dies ist eine Momentaufnahme-Analyse, kein Live-Dashboard

## Instructions

### What to give Claude

Für jedes Produkt oder jede Dienstleistung geben Sie drei Zahlen an:
1. Verkaufspreis (was Sie dem Kunden berechnen)
2. Lieferkosten (alles, was erforderlich ist, um diese eine Einheit herzustellen oder zu erfüllen)
3. Volumen (wie viel Sie pro Monat verkaufen)

Die Lieferkosten müssen spezifisch sein, um nützlich zu sein. Einzubeziehen: Materialien, Verpackung, Lieferantenkosten, Arbeitskosten pro Einheit (Stunden × Ihre Arbeitskostenrate pro Stunde), Plattform- oder Marktplatzgebühren, Zahlungsverarbeitungsgebühren, Versand falls übernommen. Wenn Sie eine Dienstleistung verkaufen, schätzen Sie die Stunden pro Auftrag × Ihre gemischte Stundensatzkosten.

Wenn Sie über mehrere Kanäle verkaufen — Ihre eigene Website, Amazon, ein Großhandelskonto — geben Sie Claude Preis und Kosten pro Kanal separat. Plattformgebühren und Versand variieren so sehr, dass die Kanalenmarge oft sehr unterschiedlich von Ihrer Headline-Marge ist.

### What Claude computes

Bruttomarge pro Produkt: (Verkaufspreis minus Lieferkosten) geteilt durch Verkaufspreis, ausgedrückt als Prozentsatz.

Claude ordnet jedes Produkt von höchster zu niedrigster Marge und kennzeichnet alles unter Ihrer festgelegten Grenze. Wenn Sie keine Grenze setzen, verwendet Claude 20% als Standard-Minimum — darunter decken die meisten Unternehmen nicht die Overhead-Beiträge.

Claude produziert auch:
- Ihre umsatzgewichtete durchschnittliche Marge (nicht nur einfacher Durchschnitt — gewichtet nach wie viel Sie tatsächlich von jedem Artikel verkaufen)
- Welche Produkte den meisten Rohgewinn in Dollar-Begriffen generieren, nicht nur in Prozenten (ein 70%-Margenprodukt, das Sie 5-mal verkaufen, ist weniger wert als ein 35%-Margenprodukt, das Sie 200-mal verkaufen)
- Wo die Preisgestaltung nicht mit Kostensteigerungen Schritt gehalten hat (wenn Sie Claude sagen, was Ihre Kosten vor einem Jahr waren vs. jetzt)

### Customer segment analysis

Wenn Sie verschiedene Kundentypen haben — Individual vs. Geschäft, klein vs. Unternehmen, einmalig vs. wiederkehrend — teilen Sie Claude die Einnahmen und Servicekosten pro Segment mit. Die Servicekosten umfassen: Zeit für Support, Onboarding, Kontoverwaltung, Rücksendungen oder Überarbeitungen.

Kleine Kunden kosten oft mehr pro Dollar Umsatz als große. Claude zeigt Ihnen, wo dies geschieht, und quantifiziert den Unterschied.

### Channel analysis

Fügen Sie Ihre kanalspezifischen Nummern ein. Claude zeigt Ihnen, was Sie nach Plattformgebühren auf jedem Kanal netto verdienen:

- Direktverkäufe (Ihre Website): keine Marktplatzgebühr, aber Sie zahlen für Traffic
- Marktplatz (Amazon, Etsy, eBay): 8-15% Gebühr plus Erfüllung
- Großhandel: 40-50% Rabatt vom Einzelhandelspreis, aber keine Kundendienst-Kosten
- App Stores: 15-30% Plattformgebühr

Der Kanal, der die meisten Einnahmen generiert, ist oft nicht der rentabelste Kanal. Claude macht dies deutlich.

### Pricing gap check

Sagen Sie Claude Ihre aktuellen Kosten und Ihren aktuellen Preis. Dann sagen Sie Claude, was diese Kosten vor 12 Monaten waren. Claude berechnet, wie viel Marge Sie durch Kosteinflation verloren haben, und welche Preiserhöhung sie wiederherstellen würde — ausgedrückt als Dollar-Betrag, nicht nur als Prozentsatz, damit Sie sehen können, ob es eine vertretbare Preisänderung ist.

---

### Prompt template

```
Bitte analysieren Sie meine Margen. Hier sind meine Produkte/Dienstleistungen:

Produkt 1: [Name]
- Verkaufspreis: $[X]
- Lieferkosten: $[Y] (Aufschlüsselung: Materialien $X, Arbeit $X, Plattformgebühr $X)
- Monatliches Volumen: [Einheiten]

Produkt 2: [Name]
- Verkaufspreis: $[X]
- Lieferkosten: $[Y]
- Monatliches Volumen: [Einheiten]

[für jedes Produkt wiederholen]

Meine Margengrenze ist [X]% — kennzeichnen Sie alles unter dieser.

Auch: Ich verkaufe über [Kanäle]. Hier sind die kanalspezifischen Zahlen: [Details]

Fragen:
1. Welches Produkt sollte ich in meiner nächsten Marketingkampagne priorisieren?
2. Welche Produkte sind Kandidaten für eine Preiserhöhung?
3. Welche ist meine umsatzgewichtete durchschnittliche Marge?
```

## Example

Sie betreiben einen Shopify-Shop mit drei Produktlinien. Sie geben Claude Preise und Kosten (einschließlich Shopify-Zahlungsgebühr von 2,9% + $0,30 pro Transaktion) sowie monatliches Verkaufsvolumen.

Claude gibt aus:

| Produkt | Verkaufspreis | COGS | Bruttomarge | Monatliche Einheiten | Monatlicher Rohgewinn |
|---|---|---|---|---|---|
| Handgemachte Kerzen | $42 | $13,50 | 68% | 90 Einheiten | $2 565 |
| White-Label-Diffusoren | $65 | $46,80 | 28% | 140 Einheiten | $2 548 |
| Digitale Duftanleitungen | $12 | $1,05 | 91% | 55 Einheiten | $598 |

Umsatzgewichtete durchschnittliche Marge: 51%

Claude kennzeichnet: White-Label-Diffusoren liegen über der 20%-Grenze, sind aber weit unter Ihrer handgemachten Kerzenmarge. Bei 140 Einheiten pro Monat generieren sie fast den gleichen Rohgewinn wie Ihr 68%-Margenprodukt — aber sie binden Bestandskapital und erfordern Erfüllungsarbeit. Wenn die Lieferantenkosten um 5% steigen, fallen Diffusoren auf 28% Marge, und eine weitere Kostensteigerung bringt sie unter die Grenze.

Empfehlung: Verlagern Sie Paid-Ad-Ausgaben auf handgemachte Kerzen (höchste Marge %) und digitale Anleitungen (höchste Marge %, keine Erfüllung). Überprüfen Sie die Diffusor-Preisgestaltung — eine Preiserhöhung von $7 bringt die Marge auf 37% und wird das Volumen angesichts Ihrer aktuellen Preisposition wahrscheinlich nicht erheblich senken.

---
