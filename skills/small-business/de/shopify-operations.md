---
name: shopify-operations
description: "Shopify-Betrieb: Produktbeschreibungen, Bestandsnachbestellungswarnungen, Nachfrageprognosen, E-Mail-Sequenzen für abgebrochene Warenkorbe, Antworten zum Bestellstatus"
---

# Shopify Operations Skill

## Wann aktivieren
- Schreiben oder Verbesserung von Produktbeschreibungen für Ihren Shopify-Shop
- Bestimmung, wann Bestand basierend auf Verkaufsgeschwindigkeit nachgeordert werden muss
- Erstellen von E-Mail-Sequenzen für abgebrochene Warenkorbe
- Beantwortung von Kundenbestellstatus-Fragen
- Analyse, welche Produkte gut funktionieren und welche nicht

## Wann NICHT verwenden
- Erstellen oder Kodieren Ihres Shopify-Shops (verwenden Sie einen Entwickler oder Shopify-Theme-Editor)
- Einrichtung von Shopify-Apps — folgen Sie deren offiziellen Anleitungen
- Verarbeitung von Rückerstattungen oder Streitigkeiten — tun Sie dies direkt in Shopify

## Anleitung

### Produktbeschreibungen schreiben, die konvertieren

```
Schreiben Sie eine Produktbeschreibung für:
Produkt: [Name]
Was es tut: [kurze Beschreibung]
Hauptmerkmale: [Liste]
Für wen: [Zielkunde]
Preispunkt: $[X]
Ton: [professionell/lustig/Premium/beiläufig]
```

Claude schreibt Beschreibungen, die:
- Mit dem Vorteil beginnen, nicht dem Feature
- Natürliche Keywords für SEO einschließen
- Ihre Markenstimme entsprechen
- Mit einer Kaufaufforderung enden

### Massen-Produktbeschreibungen

```
Ich brauche Beschreibungen für 10 Produkte. Hier sind Namen und kurze Notizen zu jedem:
1. [Produktname] — [2-3 Aufzählungspunkte]
2. ...

Schreiben Sie sie alle in einem konsistenten Stil. Ton: [beschreiben Sie Ihre Marke].
```

### Lagernachbestellungsplanung

```
Hier sind meine letzten 3 Monate Shopify-Verkaufsdaten [einfügen oder beschreiben]:
- Produkt A: 45 verkaufte Einheiten, aktueller Bestand: 12
- Produkt B: 8 verkaufte Einheiten, aktueller Bestand: 30
- Produkt C: 120 verkaufte Einheiten, aktueller Bestand: 5

Meine Lieferzeit vom Lieferanten beträgt 3 Wochen.
Welche Produkte muss ich jetzt nachbestellen? Wie viel von jedem?
```

### Nachfrageprognose

```
Mein Shopify-Shop verkauft [Art der Produkte].
Verkäufe des letzten Jahres: [einfügen Sie monatliche Gesamtsummen, falls vorhanden]
Kommende Ereignisse/Saisons: [Black Friday, Weihnachten, etc.]

Was sollte ich für [nächste Saison/Quartal] einkaufen?
Welche Risiken gibt es bei Über- oder Unterbestellungen?
```

### E-Mail-Sequenz für abgebrochene Warenkorbe

```
Ich richte verlassene Warenkorb-E-Mails in Shopify ein.
Mein Shop verkauft [Art der Produkte], durchschnittlicher Bestellwert $[X].
Kunden: [beschreiben — lokal, Altersgruppe, etc.]

Schreiben Sie eine 3-Email-Sequenz für abgebrochene Warenkorbe:
- Email 1: 1 Stunde nach Aufgabe
- Email 2: 24 Stunden nach
- Email 3: 72 Stunden nach (mit kleinem Rabatt)
```

### Kundenbeantwortungs-Vorlagen

```
Schreiben Sie Vorlagen für diese häufigen Kundenanfragen für meinen Shopify-Shop:
1. "Wo ist meine Bestellung?" — versendet, Tracking angehängt
2. "Wo ist meine Bestellung?" — verzögert
3. "Ich möchte das zurückgeben" — innerhalb des Rückgabefensters
4. "Ich möchte das zurückgeben" — außerhalb des Rückgabefensters
5. "Ich habe den falschen Artikel erhalten"

Meine Rückgaberichtlinie ist [beschreiben]. Mein Ton ist [freundlich/professionell].
```

### Verkaufsleistungsanalyse

```
Hier sind meine Shopify-Daten für letzte Monat [einfügen]:
Top-Seller: ...
Langsame Bewegungen: ...
Neue Produkte: ...

Was sagt mir das über meine Bestandsstrategie?
Welche Produkte sollte ich fördern, reduzieren oder einstellen?
```

## Beispiel

**Sie sagen:**
```
Produkt: Handgeferzte Sojabougie, Lavendel + Vanille-Duft
Größe: 8oz, brennt 45 Stunden
Hergestellt: in meiner Küche, kleine Chargen
Preis: 24 $
Zielkunde: Frauen 25-45, Selbstfürsorge-fokussiert
Ton: warm, artisanal, etwas poetisch
```

**Claude schreibt:**
```
Füllen Sie Ihren Raum mit der sanften, erdenden Wärme von Lavendel und Vanille —
von Hand gegossen in kleinen Chargen mit 100% natürlichem Sojawachs.

Jede 8oz-Kerze brennt bis zu 45 Stunden und setzt einen ruhigen, geschichteten Duft frei,
der sich sanft entwickelt, wenn das Wachs schmilzt. Keine scharfen Chemikalien, keine synthetischen Füllstoffe
— nur saubere Zutaten und eine Flamme, die Sie zum Verlangsamen einlädt.

In kleinen Chargen hergestellt, damit jede Kerze die Aufmerksamkeit erhält, die sie verdient.

Perfekt für: Abendentspannung, Geschenke oder jeden Raum in ein Heiligtum verwandeln.
```

---
