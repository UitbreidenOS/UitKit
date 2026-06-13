---
name: schema-markup
description: "Schema.org strukturierte Daten: Generieren Sie JSON-LD für Rich Results, validieren Sie Markup, wählen Sie den richtigen Schema-Typ, implementieren Sie über häufige Seitentypen"
---

# Schema-Markup-Skill

## Wann aktivieren
- Hinzufügen strukturierter Daten zur Verbesserung der Rich Results in Google Search
- Generieren von JSON-LD für Artikel, Produkte, FAQs, How-tos, Bewertungen, lokale Unternehmen
- Validierung von Schema-Markup vor der Bereitstellung
- Auswahl des richtigen Schema-Typs für eine Seite
- Debugging, warum Rich Results nicht angezeigt werden

## Wann nicht verwenden
- Schema allein wird Sie nicht ranken — es verbessert vorhandene gute Inhalte
- Gefälschte Bewertungen oder irreführende Daten — Google wird bestrafen
- Für jede Seite auf Ihrer Website — priorisieren Sie zuerst hochwertige Seiten

## Anleitung

### Wählen Sie den richtigen Schema-Typ

```
Welches Schema-Markup sollte ich für diese Seite verwenden?

Seitentyp/Inhalt: [beschreiben Sie, was die Seite enthält]
Ziel: [Rich Snippets / Knowledge Panel / Local Pack / Voice Search]

Häufige Schema-Typen:
- Article / BlogPosting: Nachrichten, Blog-Beiträge, redaktionelle Inhalte
- Product: E-Commerce-Produktseiten mit Preis, Verfügbarkeit, Bewertungen
- LocalBusiness: physische Standorte (enthält Öffnungszeiten, Adresse)
- FAQPage: Seiten mit Q&A-Abschnitten (erscheint als erweiterbar in SERPs)
- HowTo: Schritt-für-Schritt-Anleitung
- Recipe: Kochinhalte mit Zutaten, Schritten, Ernährung
- Event: Konferenzen, Konzerte, Webinare
- JobPosting: Stellenausschreibungen
- Course: Online-Lerninhalt
- SoftwareApplication: Apps und Software-Tools
- Review / AggregateRating: Benutzer- oder Expertenbewertungen
- BreadcrumbList: Navigations-Hierarchie der Website
- Organization: Unternehmensinformationen, Social-Media-Profile
- Person: Autor, Sprecher, professionelle Profile

Welche Typen gelten? Können mehrere Typen kombiniert werden?
```

### Generieren Sie JSON-LD (zum Einfügen bereit)

**Artikel / Blog-Beitrag:**
```
Generieren Sie Article-Schema für:
Titel: [Titel]
Autor: [Name, URL]
Veröffentlicht: [Datum]
Geändert: [Datum]
Bild: [URL]
Verleger: [Unternehmensname, Logo-URL]
URL: [Seiten-URL]
Beschreibung: [Meta-Beschreibung]
```

**LocalBusiness:**
```
Generieren Sie LocalBusiness-Schema für:
Geschäftsname: [Name]
Typ: [Restaurant / MedicalClinic / LegalService / Store / etc.]
Adresse: [Vollständige Adresse]
Telefon: [Nummer]
Website: [URL]
Öffnungszeiten: [Mo-Fr 9-17, Sa 10-15, etc.]
Preisbereich: [$ / $$ / $$$]
Breitengrad/Längengrad: [wenn bekannt]
```

**FAQPage:**
```
Generieren Sie FAQPage-Schema für diese Q&As:
Q1: [Frage]
A1: [Antwort]
Q2: [Frage]
A2: [Antwort]
[so viel hinzufügen wie nötig — 5-10 ist ideal]
Seiten-URL: [URL]
```

**Product:**
```
Generieren Sie Product-Schema für:
Name: [Produktname]
Beschreibung: [Beschreibung]
Bild: [URL]
Marke: [Markenname]
SKU: [SKU, falls verfügbar]
Preis: [Betrag]
Währung: [USD/GBP/EUR]
Verfügbarkeit: InStock / OutOfStock / PreOrder
Bewertung: [Durchschnittswert] von [Anzahl] Bewertungen
```

**HowTo:**
```
Generieren Sie HowTo-Schema für dieses Tutorial:
Titel: [How-to-Titel]
Beschreibung: [was dies unterrichtet]
Gesamtzeit: [PT30M = 30 Minuten]
Schritte:
1. [Schrittname] — [Schrittbeschreibung]
2. [Schrittname] — [Schrittbeschreibung]
[für alle Schritte fortfahren]
```

### Validieren und Debuggen

```
Validieren Sie dieses Schema-Markup:

[JSON-LD-Code einfügen]

Überprüfen:
1. Gültige JSON-Syntax?
2. Erforderliche Felder für diesen Schema-Typ vorhanden?
3. Empfohlene Felder fehlend (die Rich Results aktivieren würden)?
4. Veraltete Eigenschaften?
5. Test-URL: https://search.google.com/test/rich-results

Auch überprüfen: Ist dieser Schema-Typ für Rich Results berechtigt?
(Nicht alle Schema-Typen generieren visuelle Verbesserungen — einige helfen nur beim Verständnis)
```

### Implementierung über Seitentypen

```
Erstellen Sie einen Schema-Markup-Implementierungsplan für Meine Website.

Seitentyp: [Blog / E-Commerce / lokales Unternehmen / SaaS / Marktplatz]
Hauptseitentypen: [Liste: Homepage, Produktseiten, Blog-Beiträge, Kategorieseiten, etc.]

Für jeden Seitentyp:
1. Empfohlene Schema-Typen
2. Einzuschließende Datenfelder
3. Welche Felder sind dynamisch (CMS/DB) vs. statisch
4. Priorität: [hoch — Rich-Result berechtigt / mittel / niedrig]
5. Implementierungsmethode: [HTML-Head / CMS-Plugin / via GTM / server-rendered]

Ergebnis: nach Priorität geordnete Implementierungs-Checkliste.
```

## Beispiel

**Benutzer:** Ich habe einen SaaS-Review-Blog. Jeder Beitrag rezensiert ein Tool. Ich möchte Rich Snippets in Google.

**Claude generiert:**

Für einen Review-Beitrag, `SoftwareApplication` + `Review` kombinieren:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Notion",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web, iOS, Android, macOS, Windows",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "1",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Your Name" },
    "datePublished": "2026-05-20",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.6",
      "bestRating": "5"
    },
    "reviewBody": "First sentence of your review summary..."
  }
}
```

Rich-Result-Berechtigung: ✅ Produkt-Rich-Snippets (Sternbewertungen in SERPs)

---
