# Claude für E-Commerce-Betreiber

Alles, was ein E-Commerce-Betreiber für KI-gestützte Produktlistings, Kundendienst, Marketingkampagnen und operatives Reporting benötigt — egal ob du auf Shopify, Amazon, Etsy oder allen dreien tätig bist.

---

## Für wen dieser Leitfaden ist

Du bist E-Commerce-Betreiber, Online-Shop-Inhaber oder Marktplatz-Verkäufer, und deine Arbeit umfasst Produkt, Marketing, Kundendienst und Betrieb. Du schreibst Listings, führst E-Mail-Kampagnen durch, verwaltest Bewertungen, bearbeitest Rücksendungen und überwachst Werbeausgaben — oft alles am selben Tag.

**Vor Claude Code:** Neues Produktlisting: 45 Minuten. Antwort auf eine Kundenbeschwerde: 15 Minuten (und du zweifelst an dir selbst). E-Mail-Kampagne: 2 Stunden. Monatliches Reporting: ein halber Tag.

**Danach:** Produktlisting in 15 Minuten optimiert. Kundenbeschwerde in 3 Minuten behandelt. E-Mail-Kampagne in 30 Minuten geplant und verfasst. Monatsbericht in 20 Minuten abgerufen und formatiert.

---

## 30-Sekunden-Installation

```bash
# Den vollständigen E-Commerce-Stack installieren
npx claudient add skills small-business/shopify-operations
npx claudient add skills small-business/ecommerce-seller
npx claudient add skills small-business/email-campaign
npx claudient add skills small-business/review-response
npx claudient add skills marketing/paid-ads
npx claudient add skills small-business/product-listing-optimizer
npx claudient add skills small-business/returns-handler
npx claudient add agents specialists/ecommerce-specialist
```

---

## Dein Claude Code E-Commerce-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/product-listing-optimizer` | Listings für SEO und Conversion optimieren: Titel, Bullets, Beschreibung, A+ Content, Bild-Brief | Neue Listings, schwach konvertierende SKUs, saisonale Auffrischungen |
| `/ecommerce-seller` | Vollständige Verkäuferoperationen: Preisstrategie, Bestandsentscheidungen, Marktplatztaktiken | Tägliche Verkäuferentscheidungen |
| `/shopify-operations` | Shopify-spezifisch: Shop-Einrichtung, Theme-Entscheidungen, App-Empfehlungen, Checkout-Optimierung | Shopify-Shop-Management |
| `/email-campaign` | Kampagnenplanung, Text, Versandstrategie für E-Mail-Marketing | Promo- und Newsletter-Kampagnen |
| `/review-response` | Auf Kundenbewertungen antworten: positiv, negativ, neutral — alle Kanäle | Tägliche Bewertungs-Triage |
| `/returns-handler` | Rückgabepolitik, Antwortvorlagen, Streitbeilegung, Trendanalyse | Rücksendungs- und Erstattungsmanagement |
| `/paid-ads` | Anzeigentexte, Kampagnenstruktur, Zielgruppen-Targeting, Performance-Analyse | Paid Social und Search |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `ecommerce-specialist` | Sonnet | Komplexe Entscheidungen: Marktplatz-Strategie, saisonale Planung, Kategorieerweiterung |

---

## Täglicher Workflow

### Morgen-Sales-Dashboard (15 Minuten)

Jeden Tag mit einem klaren Performance-Bild beginnen:

```
/ecommerce-seller

Morgen-Check-in für [DATUM]:

Metriken von gestern:
- Umsatz: [$X]
- Bestellungen: [X]
- Durchschnittlicher Bestellwert: [$X]
- Verkaufte Einheiten nach Top-SKU: [Liste]
- Rücksendungsanfragen: [X]
- Neue Bewertungen: [positiv: X / negativ: X]
- Werbeausgaben: [$X] / ROAS: [X]
- Warenkorbabbruchrate: [X %]

Markieren:
- SKUs mit Bestand < 14 Tage bei aktueller Verkaufsgeschwindigkeit
- Werbekampagnen mit ROAS unter Schwellenwert [$X Ziel]
- Negative Bewertungen, die eine Antwort am selben Tag benötigen
- Bestellungen mit Erfüllungsverzögerungsrisiko
```

---

### Kundenanfragen und Bewertungsmanagement (20–30 Minuten)

**Antwort auf negative Bewertung:**

```
/review-response

Plattform: [Amazon / Google / Trustpilot / Etsy]
Bewertung: [Bewertungstext einfügen]
Sternebewertung: [1–3]
Produkt: [Name]
Bestelldetails (falls vorhanden): [einfügen]

Eine professionelle Antwort schreiben, die:
- Die spezifische Beschwerde anerkennt (keine generische Entschuldigung)
- Angibt, was wir tun, um es zu beheben (oder bereits getan haben)
- Einen Lösungsweg anbietet (Ersatz, Erstattung, direkter Kontakt)
- Nicht defensiv ist
- Unter 100 Wörtern
```

**Rücksendungsanfrage:**

```
/returns-handler

Szenario: [Anfrage beschreiben — z. B. Kunde möchte Stiefel zurückgeben und behauptet, Sohle löst sich nach 3 Wochen]
Bestelldetails: [Datum, Produkt, Betrag]
Innerhalb der Richtlinienfrist: [ja / nein — und welche Richtlinie gilt]

Schreiben: Kundenantwort + interne Notiz für die Protokollierung.
```

---

### Listing-Optimierung (30–60 Minuten)

**Neues Produktlisting:**

```
/product-listing-optimizer

Marktplatz: [Amazon / Shopify / Etsy / eBay]
Produkt: [Name und Beschreibung]
Kategorie: [Kategorie + Unterkategorie]
Preis: [$X]
Zielkunde: [wer kauft das, welches Problem wird gelöst]
Hauptmerkmale: [Liste]
Top-Wettbewerber: [Name oder URL]

Produzieren: Keyword-Recherche, optimierter Titel, 5 Bullets, Beschreibung, Bild-Brief.
```

**Listing-Audit (schwach konvertierende SKU):**

```
/product-listing-optimizer

Audit-Modus.

Aktuelles Listing: [aktuellen Titel + Bullets + Beschreibung einfügen]
Aktuelle Conversion-Rate: [X %] (Kategorie-Durchschnitt: [Y %])
Aktuelles Ranking für Haupt-Keyword: [Position oder unbekannt]

Diagnostizieren: Was schadet der Conversion? Jedes Element bewerten. Die Top-2-Fixes mit höchster Wirkung nennen.
```

---

### Ad-Performance-Review (20 Minuten)

```
/paid-ads

Plattform: [Meta Ads / Google Ads / Amazon PPC]

Performance der letzten 7 Tage:
- Gesamtausgaben: [$X]
- Zugeordneter Umsatz: [$X]
- ROAS: [X]
- CTR: [X %]
- Conversion-Rate: [X %]
- Top-3-Kampagnen: [Name, Ausgaben, ROAS jeweils]
- Bottom-3-Kampagnen: [Name, Ausgaben, ROAS jeweils]

Analyse:
- Welche Kampagnen sind unter Ziel-ROAS? Empfehlung: pausieren / Gebot senken / Creative auffrischen
- Welche Zielgruppen überperformen? Empfehlung: skalieren
- Gibt es Budget-Umverteilungen, die ich heute vornehmen sollte?
```

---

### Bestandsprüfung (10 Minuten, täglich)

```
/ecommerce-seller

Bestandsstatus:

[Bestands-CSV einfügen oder wichtige SKUs auflisten mit: Einheiten auf Lager, tägliche durchschnittliche Verkaufsgeschwindigkeit]

Markieren:
- Ausverkaufsrisiko in < 14 Tagen bei aktueller Geschwindigkeit
- Überbestand (> 90 Tage Vorrat) — Rabatt oder Bundle empfehlen
- Nachbestellempfehlungen: Menge und Zeitpunkt basierend auf Lieferzeit von [X Tagen]

Output: Priorisierte Aktionsliste — was heute bestellen, was rabattieren, was beobachten.
```

---

## Wöchentlicher Rhythmus

### Montag — Kampagnen- und Content-Planung

```
/email-campaign

Diese Wochen-E-Mail planen:
- Zielgruppensegment: [Segmentname, Größe]
- Ziel: [Umsatz generieren / reaktivieren / Produkt ankündigen]
- Angebot oder Content-Winkel: [z. B. neuer Produktlaunch / 20 %-Rabatt / saisonales Feature]
- Vorherige Kampagnen-Performance: [letzte Öffnungsrate, CTR]

Produzieren: Kampagnen-Brief, Betreffzeile (A/B-Varianten), E-Mail-Entwurf, Versandzeitempfehlung.
```

### Mittwoch — Listing- und SEO-Check

`/product-listing-optimizer` für deine 3 am schlechtesten konvertierenden SKUs (nach Conversion-Rate) ausführen.
Ein optimiertes Listing pro Woche = bedeutende kumulative Verbesserung in 90 Tagen.

### Freitag — Wöchentlicher Performance-Bericht

```
/ecommerce-seller

Wochenbericht für [Woche]:

Umsatz: [$X] vs. [$X Vorwoche] vs. [$X Ziel]
Bestellungen: [X] / AOV: [$X]
Top-3-Produkte nach Umsatz: [Liste]
Marketingausgaben: [$X] / Zugeordneter Umsatz: [$X] / Gemischter ROAS: [X]
Kundendienst: [X Tickets] / [X Rücksendungen] / Durchschnittliche Lösungszeit: [X Stunden]
Bestand: [Ausverkäufe oder Überbestand-Probleme?]

Format: Executive Summary (3 Punkte) + detaillierte Aufschlüsselung für Aufzeichnungen.
Was muss ich nächste Woche priorisieren?
```

---

## Saisonale Planung

Den `ecommerce-specialist`-Agenten 60–90 Tage vor großen Events einsetzen:

```
@ecommerce-specialist

Unsere [Q4 / Prime Day / Black Friday / Valentinstag]-Kampagne planen.

Vorgestellte Produkte: [Liste]
Budget: [$X gesamt für Marketing]
Timeline: [Startdatum bis Event-Datum]
Bestandsposition: [aktueller Bestand + Lieferzeit für Nachbestellung]
Vorjahresergebnisse für dieses Event (falls zutreffend): [Metriken]

Produzieren:
- 90-60-30-Tage-Vorbereitungs-Checkliste
- Preis- und Rabattstrategie
- Kampagnenkalender (E-Mail + Paid)
- Bestellmengen und Timing für Nachbestellungen
- Listing-Auffrischungsplan für vorgestellte Produkte
```

---

## 30-Tage-Einarbeitungsplan

### Woche 1 — Baseline prüfen

- Alle E-Commerce-Skills installieren
- `/product-listing-optimizer` im Audit-Modus für deine Top-10-Umsatz-SKUs ausführen
- Aktuelle Rückgabepolitik mit `/returns-handler` prüfen — schützt sie dich rechtlich und hält sie Kunden?
- 30-Tage-Ad-Performance-Daten abrufen und Lückenanalyse mit `/paid-ads` durchführen
- Tägliches Dashboard-Template in `/ecommerce-seller` einrichten

### Woche 2 — Listings und Bewertungen überarbeiten

- Die 3 am schlechtesten konvertierenden Listings mit `/product-listing-optimizer` neu schreiben
- Auf jede unbeantwortete Bewertung der letzten 90 Tage mit `/review-response` antworten
- Bewertungs-Monitoring-Workflow einrichten: tägliche Bewertungs-Triage als Teil der Morgenroutine

### Woche 3 — Marketing und Kundendienst

- Erste KI-erstellte E-Mail-Kampagne mit `/email-campaign` planen und starten
- Rückgabepolitik und Antwortvorlagen mit `/returns-handler` neu schreiben
- Creative-Auffrischung mit `/paid-ads` für Top-Ausgabenkampagnen durchführen

### Woche 4 — Systematisieren

- Wöchentliche Reporting-Vorlage mit `/ecommerce-seller` erstellen
- Team-Mitglieder oder VAs im Umgang mit Skills für tägliche Triage schulen
- Nächstes saisonales Event identifizieren und 60-Tage-Planung beginnen
- Monat-über-Monat-Performance prüfen: welche Metriken haben sich am meisten verbessert?

---

## Tool-Integrationen

### Shopify (Shop-Management)

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/mcp-server"],
      "env": {
        "SHOPIFY_ACCESS_TOKEN": "your-token",
        "SHOPIFY_STORE_DOMAIN": "yourstore.myshopify.com"
      }
    }
  }
}
```

Mit Shopify verbunden: Claude kann Bestellungen, Produktdaten und Bestand direkt lesen.

### Klaviyo (E-Mail-Marketing)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

Verwenden für: Segmentanalyse, Kampagnen-Performance-Daten, Flow-Optimierung.

### Google Analytics / GA4

Produkt-Performance- und Traffic-Daten als CSV exportieren → in `/ecommerce-seller` zur Analyse einfügen.

### n8n (Automatisierung)

```
Den Bewertungs-Antwort-Kreislauf automatisieren:
Neue Bewertung → Sentiment klassifizieren → Antwort entwerfen → Slack-Alert für menschliche Genehmigung → posten

Bestandsalerts automatisieren:
Tägliche Bestandsprüfung → wenn Bestand < 14 Tage → Nachbestellungsaufgabe in Projekttool erstellen
```

---

## Zu verfolgende Metriken

| Metrik | Ziel | Warnsignal |
|---|---|---|
| Conversion-Rate (Produktseite) | > 3 % (Shopify-Durchschnitt) / > 15 % (Amazon) | < 1,5 % |
| Rücksendungsrate | < 10 % (allgemein) / < 20 % (Bekleidung) | > 25 % |
| ROAS (Paid Ads) | > 3x (Minimum) / > 5x (gesund) | < 2x |
| E-Mail-Öffnungsrate | > 25 % | < 15 % |
| Bewertungs-Antwortrate | 100 % der negativen Bewertungen | Jede unbeantwortete negative Bewertung |
| Antwortzeit bei Kundenanfragen | < 4 Stunden | > 24 Stunden |
| Ausverkaufsrate | < 2 % der SKUs zu jedem Zeitpunkt | > 5 % |
| AOV (durchschnittlicher Bestellwert) | Monat für Monat wachsend | 2+ aufeinanderfolgende Monate rückläufig |

---

## Häufige Fehler und wie Claude Code hilft, sie zu vermeiden

**Fehler 1: Generische Produktlistings, die nicht ranken**
`/product-listing-optimizer` erzwingt Keyword-Recherche vor dem Schreiben. Keine Keywords = kein Ranking = kein Traffic.

**Fehler 2: Negative Bewertungen ignorieren**
`/review-response` macht das Antworten zur 3-Minuten-Aufgabe. Jede unbeantwortete negative Bewertung kostet zukünftige Conversions.

**Fehler 3: Dasselbe Creative unbegrenzt laufen lassen**
`/paid-ads` zeigt Creative-Ermüdung auf, bevor du sie im ROAS siehst. Auffrischungssignale kommen aus CTR-Trends, nicht nur aus ROAS.

**Fehler 4: Rückgabepolitik als Nachgedanke**
`/returns-handler` erstellt Richtlinien, die Kunden halten und dich vor Betrug schützen. "Kontaktiere uns für Rücksendungen" ist eine Richtlinie — sie ist nur die schlechteste.

**Fehler 5: Bestand nach Gefühl kaufen**
`/ecommerce-seller` verwandelt deine Geschwindigkeitsdaten in Nachbestellempfehlungen. Ausverkäufe und Überbestand sind beide teuer.

---

## Ressourcen

- [Erste Schritte mit Claude Code](./getting-started.md)
- [Shopify-Operations-Skill](../skills/small-business/shopify-operations.md)
- [Product-Listing-Optimizer](../skills/small-business/product-listing-optimizer.md)
- [Returns-Handler](../skills/small-business/returns-handler.md)
- [E-Commerce-Wochen-Workflow](../workflows/ecommerce-weekly.md)

---
