---
name: seo-audit
description: "SEO-Audit: technische Probleme, On-Page-Faktoren, Backlink-Profil, Core Web Vitals, strukturierte Daten, priorisierte Behebensliste mit geschätztem Traffic-Impact"
---

# SEO-Audit-Skill

## Wann aktivieren
- Durchführung eines umfassenden SEO-Audits für eine Website
- Untersuchung eines Rückgangs des organischen Traffics
- Identifizierung von technischen SEO-Problemen, die das Crawling oder die Indizierung blockieren
- Überprüfung der SEO-Strategie eines Konkurrenten
- Priorisierung von SEO-Fixes nach geschätztem Traffic-Impact

## Wann nicht verwenden
- Echtzeit-Ranking-Verfolgung — nutze Ahrefs, SEMrush oder Google Search Console
- Linkaufbau-Ausführung — benötigt Outreach-Tools
- Bezahlte Suche (Google Ads) — völlig anderer Kanal

## Anleitung

### Technisches SEO-Audit

```
Führen Sie ein technisches SEO-Audit durch. Liefern Sie:

Website-URL: [URL]
Verfügbare Tools: [Google Search Console / Screaming Frog / Ahrefs / SEMrush / PageSpeed Insights]

Überprüfen Sie diese technischen Faktoren:

CRAWLING & INDEXIERUNG
- Ist die Website indizierbar? Überprüfen Sie robots.txt und Meta-Robots-Tags
- Gibt es noindex-Tags, die wichtige Seiten blockieren?
- XML-Sitemap: vorhanden, bei GSC eingereicht, Fehler?
- Crawl-Fehler in Google Search Console?
- Canonical-Tags: korrekt, keine Self-Referencing-Probleme?

TECHNISCHE LEISTUNG
- Core Web Vitals (LCP, FID/INP, CLS): bestanden/nicht bestanden?
- Seitengeschwindigkeit: Mobile- und Desktop-Scores (PageSpeed Insights)
- Mobile-freundlich: besteht Googles Mobil-Usability-Test?
- HTTPS: alle Seiten, kein gemischter Inhalt?

SITESTRUKTUR
- URL-Struktur: sauber, aussagekräftig, keine doppelten Parameter?
- Interne Verlinkung: verwaiste Seiten? Tiefe Seiten (> 3 Klicks von der Startseite)?
- Pagination: rel prev/next oder Verwendung von Canonical?
- Sitearchitektur: logische Kategorien, angemessene Breadcrumbs?

Für jedes gefundene Problem:
- Schweregrad: Kritisch / Hoch / Mittel / Niedrig
- Geschätzter Traffic-Impact
- Fix-Empfehlung
- Implementierungsaufwand: Einfach / Mittel / Schwierig
```

### On-Page SEO-Audit

```
Audit der On-Page SEO für [URL oder Seitentyp]:

INHALT
- Title-Tags: eindeutig, unter 60 Zeichen, enthält Haupt-Keyword?
- Meta-Beschreibungen: überzeugend, unter 160 Zeichen, eindeutig?
- H1: eine pro Seite, enthält Keyword?
- Header-Struktur: logische H1→H2→H3-Hierarchie?
- Inhaltstiefe: deckt das Thema umfassend ab vs. Top-Ranking-Seiten?
- Keyword-Verwendung: natürlich, kein Stuffing, LSI-Begriffe enthalten?
- Content-Frische: Aktualisierungsdatum, veralteter Inhalt?

MEDIEN
- Bilder: Alt-Text vorhanden, aussagekräftig, nicht mit Keywords vollgestopft?
- Bilddateigröße: komprimiert für Performance?
- Videos: Transkripte, Schema-Markup?

STRUKTURIERTE DATEN
- Schema-Markup vorhanden? (Article, Product, FAQ, How-to, Review, LocalBusiness)
- Gültig laut Googles Rich Results Test?
- Fehlende Schema-Möglichkeiten?

Bereitstellung einer priorisierten Fehlerliste.
```

### Konkurrenz-SEO-Analyse

```
Analysieren Sie [Konkurrenz-URL] vs. meine Website [meine URL]:

KEYWORD-GAP
- Welche Keywords ranken sie für, nicht ich?
- Wie ist ihr geschätzter organischer Traffic?
- Welche ihrer Top-Seiten generieren die meisten Traffic?

INHALTS-GAP
- Welche Inhalte haben sie, die ich nicht habe?
- Welche Themen in unserem Bereich beherrschen sie?

BACKLINK-GAP
- Vergleich der Domain Authority
- Wie viele verweisende Domains haben sie vs. ich?
- Ihre besten Backlink-Quellen (für Outreach-Recherche)

Priorisieren Sie: Welche Gaps kann ich in den nächsten 90 Tagen am ehesten schließen?
```

### Core Web Vitals Fix-Prioritäten

```
Meine Core Web Vitals Scores:
- LCP (Largest Contentful Paint): [Xs] — Ziel < 2,5s
- INP (Interaction to Next Paint): [Xms] — Ziel < 200ms
- CLS (Cumulative Layout Shift): [X] — Ziel < 0,1

Website-Tech-Stack: [Next.js / WordPress / Shopify / sonstiges]

Für jede fehlgeschlagene Metrik:
1. Wie ist die wahrscheinlichste Ursache auf meinem Tech-Stack?
2. Was sind die Top 3 Fixes zum Implementieren?
3. Geschätzte Verbesserung durch jeden Fix?
```

### SEO-Audit-Bericht

```
Generieren Sie eine SEO-Audit-Zusammenfassung für [Website].

Audit-Ergebnisse: [wichtige gefundene Probleme einfügen]

Format:
1. Gesamtgesundheitsscore für SEO (1-10) mit Begründung
2. Kritische Probleme (müssen behoben werden — blockieren Traffic oder Indexierung)
3. Hochpriorisierte Möglichkeiten (größte geschätzte Traffic-Gewinne)
4. Quick Wins (einfach zu implementieren, sofortige Auswirkungen)
5. 90-Tage-SEO-Roadmap mit Prioritäten
```

## Beispiel

**Benutzer:** Der Traffic meines Blogs ist nach Googles März 2026 Core Update um 40% gesunken. Führen Sie ein Audit durch.

**Claudes Audit-Framework:**
1. Google Search Console auf manuelle Maßnahmen oder Abdeckungsprobleme überprüfen
2. Identifizieren Sie, welche Seiten Rankings verloren haben (Positionsänderungsbericht)
3. Überprüfen Sie, ob verlorene Seiten dünne Inhalte, schwache E-E-A-T-Signale oder duplizierte Inhalte haben
4. Top-Performing-Seiten analysieren, die überlebt haben — was haben sie, das verlorene Seiten nicht haben?
5. Website-weit überprüfen: zu sehr optimierter Ankertext? Dünne Affiliate-Inhalte? KI-generierter Inhalt ohne menschliche Expertise-Signale?
6. Priorisierte Fehlerliste mit geschätztem Wiederherstellungszeitrahmen pro Fix-Kategorie generieren

---
