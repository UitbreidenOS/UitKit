---
name: programmatic-seo
description: "Programmatische SEO: Erstellen Sie Landing-Page-Vorlagen im Maßstab, identifizieren Sie Datenquellen, entwerfen Sie URL-Strukturen, vermeiden Sie Dünn-Content-Strafen"
---

# Programmatische SEO-Skill

## Wann aktivieren
- Erstellen von Hunderten oder Tausenden von Standort-/Kategorie-/Vergleichsseiten
- Aufbau einer datenbankgesteuerten Inhaltsstrategie (z.B. "[Stadt] + [Service]"-Seiten)
- Skalierung der Content-Produktion mit Vorlagen und Datenfeeds
- Audit vorhandener programmatischer SEO-Seiten auf Qualitätsprobleme
- Planung einer programmatischen SEO-Strategie vor der Implementierung

## Wann nicht verwenden
- Sites mit weniger als 100 potenziellen Seiten — manuelle SEO ist besser
- Wenn Sie keine echte Datenquelle haben — reiner Template-Spam wird bestraft
- Wenn die Benutzerintention zu eng ist, um Skalierung zu rechtfertigen

## Anleitung

### Identifizieren Sie programmatische SEO-Möglichkeiten

```
Identifizieren Sie programmatische SEO-Möglichkeiten für mein Unternehmen.

Geschäftstyp: [beschreiben]
Aktuelle Website: [URL oder Beschreibung]
Produkte/Dienstleistungen: [Liste]

Häufige programmatische Muster:
1. Standortseiten: "[Service] in [Stadt]" — funktioniert für lokale Unternehmen, Marktplätze, B2B
2. Kategorie × Modifikator: "[Kategorie] für [Publikum/Use Case]"
3. Vergleichsseiten: "[Tool A] vs [Tool B]" — funktioniert für SaaS, Tools
4. Integrationsseiten: "[Produkt] + [Integration]" — Zapier-Stil
5. Vorlagensei: "[Rolle] Lebenslaufvorlage", "[Branche] Rechnungsvorlage"
6. Datenseiten: "[Stadt] [Metrik] Statistiken", "[Jahr] [Branche] Bericht"

Welche Muster gelten für mein Unternehmen?
Schätzung: Wie viele Seiten könnte dies generieren?
Welche Datenquelle würde jede antreiben?
```

### Entwerfen Sie die Vorlagenstruktur

```
Entwerfen Sie eine programmatische SEO-Vorlage für [Seitentyp].

Beispiel-URL: /[stadt]/[service] (z.B. /london/web-design)
Zielabfrage: "[Service] in [Stadt]"
Daten, die ich habe: [Felder auflisten — Stadtname, Bevölkerung, lokale Statistiken, etc.]

Vorlagenabschnitte:
1. H1: [Formel — z.B. "Web-Design in {{Stadt}}"]
2. Einleitungsabsatz (eindeutig pro Stadt — was variiert?)
3. Kern-Wertproposition (statisch — identisch auf allen Seiten)
4. Lokale Differenzierung (was macht die Stadt/Kategorie einzigartig?)
5. Testimonials/Fallstudien (nach Standort filtern, wenn verfügbar)
6. FAQ (Mischung aus statischen Fragen + dynamischen stadtspezifischen)
7. CTA

Eindeutigkeitsstrategie: Was unterscheidet sich zwischen Seiten, um Dünn-Content zu vermeiden?
Minimale Inhaltsschwelle: Wie viele wirklich einzigartige Wörter pro Seite?
```

### Datenarchitektur-Planung

```
Planen Sie die Datenarchitektur für programmatische SEO.

Seitentyp: [beschreiben]
Maßstab: [X] geplante Seiten

Zu berücksichtigende Datenquellen:
- Interne Daten (Ihre Produktdaten, Kundendaten, Transaktionen)
- Öffentliche Datensätze (Census, Wikipedia, staatliche offene Daten)
- API-Quellen (Google Places, Yelp, Wetter, etc.)
- Gescraped/aggregierte Daten (Verzeichniseinträge, Stellenausschreibungen)
- Benutzer generierte Inhalte (Bewertungen, Q&A)

Für meinen Anwendungsfall:
1. Welche Daten machen jede Seite wirklich einzigartig?
2. Woher bekomme ich diese Daten?
3. Wie halte ich sie aktuell? (statische vs dynamische Generierung)
4. Was ist die Mindestmenge an Daten pro Seite, um Dünn-Content zu vermeiden?

Ergebnis: Datenarchitektur-Plan mit Feldern pro Seitenvorlage.
```

### Dünn-Content-Audit

```
Überprüfen Sie diese programmatischen Seiten auf Dünn-Content-Risiko.

Beispielseiten: [3-5 URLs einfügen oder Vorlage beschreiben]
Beobachtetes Problem: [niedriger Traffic, manuelle Aktion, schlechte Rankings]

Überprüfung:
1. Eindeutiger Content-Anteil: Welcher % jeder Seite ist eindeutig vs. Vorlage?
2. Benutzerwert: Beantwortet diese Seite die Suchanfrage besser als Google-Suche?
3. Vervielfältigung: Sind Seiten zu ähnlich zueinander?
4. Auto-generierte Signale: Sieht es so aus, als wäre es für Suchmaschinen geschrieben, nicht Menschen?
5. Engagement-Daten: Absprungrate, Zeit auf Seite (falls verfügbar)

Empfehlungen: konsolidieren / verbessern / löschen / noindex.
```

### URL und Site-Architektur

```
Entwerfen Sie URL-Struktur und interne Verlinkung für programmatische SEO im Maßstab.

Seitentyp: [Standort-/Kategorie-/Vergleichsseiten]
Maßstab: [X] Seiten

URL-Strukturoptionen:
- Flach: /[stadt]-[service] (einfach, verliert Kategoriehierarchie)
- Verschachtelt: /[service]/[stadt] (besser für facettierte Hierarchie)
- Hybrid: /[kategorie]/[modifikator]-[standort]

Interne Verlinkungsstrategie:
1. Hub-Seiten: Kategoriestufenseiten, die auf alle Standortvarianten verlinken
2. Breadcrumbs: Zeige Hierarchie für Benutzer und Crawler
3. Verwandte Seiten: gleiche Stadt, verschiedene Services / gleicher Service, nahe Städte
4. Paginierung vs. unendliches Scrollen vs. "mehr laden"
5. XML-Sitemap-Segmentierung (separate Sitemap für programmatische Seiten)

Entwerfen Sie die Architektur für [X] Seiten.
```

## Beispiel

**Benutzer:** Ich führe einen Freelancer-Marktplatz. Ich möchte "[Fähigkeit] Freelancer in [Stadt]"-Seiten erstellen. Ich habe 50 Fähigkeiten und 200 Städte = 10.000 Seiten. Wie mache ich das ohne bestraft zu werden?

**Claudes Plan:**

**Dateneinzigkeitsstrategie:**
- Stadtbevölkerung + bemerkenswerte Industrien (Census + Wikipedia-API)
- Durchschnittliche Sätze für die Fähigkeit in dieser Stadt (aus Ihren eigenen Marktplatzdaten)
- Anzahl verifizierter Freelancer auf Ihrer Plattform in diesem Stadt/Fähigkeits-Combo
- Featured Freelancer (dynamisch, aus Ihrer DB)
- Kürzlich durchgeführte Projekte in dieser Stadt (aus Ihren Transaktionsdaten)

**Dünn-Content-Schwelle:** Jede Seite benötigt ≥ 3 wirklich einzigartige Datenpunkte (Satzdaten + Freelancer-Anzahl + Featured-Profile). Seiten mit < 3 Freelancers sollten noindexiert werden, bis gefüllt.

**Startreihenfolge:** Beginnen Sie mit den Top 20 Städten × alle 50 Fähigkeiten (1.000 Seiten). Validieren Sie Indexierung und Leistung, bevor Sie auf alle 200 Städte erweitern.

**Vorlage H1:** "Find [Fähigkeit] Freelancer in [Stadt] — [X] Verifizierte Profis"

---
