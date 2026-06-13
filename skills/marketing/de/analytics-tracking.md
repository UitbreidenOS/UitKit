---
name: analytics-tracking
description: "Analytics-Implementierung: GA4, Mixpanel, Amplitude, PostHog Event-Tracking, Trichteranalyse, Benutzeraufbewahrungskohorten und Attributionsmodellierung"
---

# Analytics Tracking Skill

## Wann aktivieren
- Einrichten von Event-Tracking für eine Web-App oder Marketing-Website
- Entwerfen eines Messplans vor der Implementierung von Analytics
- Debugging von unterbrochenen oder fehlenden Analytics-Daten
- Erstellen von Trichtern zum Auffinden von Konversionsabfällen
- Analysieren von Benutzeraufbewahrungskohorten zum Verstehen von Churn
- Wahl zwischen Analytics-Tools (GA4, Mixpanel, Amplitude, PostHog)

## Wann NICHT verwenden
- Business Intelligence oder SQL-Level Data Warehouse Abfragen — das ist eine Daten-ML-Aufgabe
- A/B-Test-Framework-Setup — verwende den experiment-designer Skill
- Datenschutz-/GDPR-Compliance-Audits für Tracking — verwende den privacy-pia Skill

## Anweisungen

### Messplan

```
Erstelle einen Messplan für [Produkt/Website].

Produkttyp: [SaaS / Ecommerce / Content-Website / Mobile-App]
Geschäftsziele: [welche Ergebnisse wichtig sind — Registrierungen, Käufe, Aufbewahrung, Engagement]
Aktuelles Analytics-Setup: [GA4 / Mixpanel / Amplitude / PostHog / keine]
Team: [Entwickler + Analyst / Solo / Marketing-Team]

Messplan-Struktur:

1. North Star Metric:
   [Die eine Zahl, die die Produktgesundheit am besten erfasst]
   z.B. Weekly Active Users / MRR / Aktivierungsrate

2. Unterstützende Metriken (Ebene 2):
   [3-5 Metriken, die die North Star erklären]

3. Wichtige zu verfolggende Benutzerereignisse:
   Für jedes Ereignis:
   - Ereignisname: [snake_case, konsistente Benennung]
   - Trigger: [welche Benutzeraktion löst dies aus]
   - Eigenschaften: [Schlüsselattribute zum Erfassen — Plan: String, Betrag: Zahl, etc.]
   - Warum: [welche Geschäftsfrage beantwortet dies?]

4. Zu messende Trichter:
   - [Akquisitionstrichter: Quelle → Registrierung → Aktivierung]
   - [Kern-Produkt-Trichter: Anmelden → Wichtigste Aktion → Wertvoll Moment]
   - [Monetarisierungs-Trichter: Test → Upgrade → Aufbewahrung]

5. Benötigte Dashboards:
   - [Leitungsebene: MRR, Churn, NPS]
   - [Produkt: Aktivierungsrate, Feature-Adoption, Aufbewahrung]
   - [Marketing: Traffic, Konversion, CAC nach Kanal]

Geben Sie den Event-Tracking-Plan als Tabelle aus:
Event | Trigger | Eigenschaften | Priorität | Dashboard
```

### GA4-Implementierung

```
Richten Sie GA4-Event-Tracking für [Website/App] ein.

Website-Typ: [Marketing-Website / Web-App / Ecommerce]
Framework: [Next.js / React / Vanilla JS / WordPress]
Ziele: [Verfolge diese Konversionen — Liste]

Implementierungsplan:

1. Basis-Setup:
   - Installiere GA4 über gtag.js oder GTM (nutze GTM, wenn Marketer später Tags hinzufügen müssen)
   - Konfiguriere Datenstrom und Measurement ID
   - Aktiviere Enhanced Measurement für: Scrolls, ausgehende Klicks, Datei-Downloads, Website-Suche

2. Zu implementierende benutzerdefinierte Ereignisse:
   Ereignis: [Name]
   Code:
   gtag('event', '[event_name]', {
     event_category: '[category]',
     event_label: '[label]',
     value: [optionaler numerischer Wert],
     [custom_parameter]: '[value]'
   });
   Wo auszulösen: [Komponente / Seite / Aktion]

3. Konversionsereignisse:
   Markiere diese als Konversionen in GA4 Admin:
   - [signup_complete]
   - [purchase]
   - [demo_requested]
   Markiere in: Admin → Events → Mark as conversion

4. Zielgruppen für Remarketing:
   - Test-Nutzer, die nicht konvertiert haben (besuchten /pricing 2+ mal)
   - High-Intent-Besucher (3+ Seiten, 2+ Minuten)

5. Debuggen und Verifizieren:
   - GA4 DebugView: Aktiviere Debug-Modus in GTM oder füge ?debug_mode=1 hinzu
   - Echtzeit-Bericht: Bestätige Events, die live ausgelöst werden
   - Prüfe auf doppelte Ereignisse (einmal auslösen, nicht bei jedem Re-Render)

Generiere den Implementierungscode für mein Framework.
```

### Trichteranalyse

```
Analysiere meinen Konversionstrichter und identifiziere Abfälle.

Trichterschritte: [liste jeden Schritt der Reihe nach auf]
Beispiel: Homepage → Anmeldeseite → E-Mail bestätigt → Dashboard → Feature verwendet → Upgrade

Aktuelle Konversionsraten pro Schritt (falls bekannt): [X%]
Analytics-Tool: [GA4 / Mixpanel / Amplitude / PostHog]
Zeitrahmen: [letzte 30 / 60 / 90 Tage]
Zu vergleichende Segmente: [mobil vs. Desktop / Kanal / Plan-Typ]

Analysestruktur:
1. Gesamttrichter-Konversion (erster Schritt → letzter Schritt): [X%]
2. Schritt-für-Schritt-Abfall:
   Schritt 1 → 2: [X% Abfall — hoch/mittel/niedrig im Vergleich zu Benchmarks]
   Schritt 2 → 3: [X% Abfall]
   [fortfahren für jeden Schritt]

3. Schlechtester Abfall-Schritt: [welcher Schritt verliert am meisten Menschen]
   Hypothesen für das Warum:
   - [Reibung in der Benutzeroberfläche?]
   - [Fehlende Informationen?]
   - [Technischer Fehler?]
   - [Erwartungskonflikt?]

4. Experimente zum Durchführen:
   - [eine Änderung pro Hypothese, messbar in Analytics]

5. Segmentierungseinsicht:
   - Fallen mobile Benutzer bei einem anderen Schritt ab als Desktop?
   - Konvertieren Paid-Ad-Besucher anders als organisch?

Abfrage zum Ausführen in [Tool]: [schreibe die Trichter-Abfrage oder Schritte zum Einrichten]
```

### Benutzeraufbewahrungskohorten-Analyse

```
Führe eine Benutzeraufbewahrungskohorten-Analyse für [Produkt] durch.

Analytics-Tool: [Mixpanel / Amplitude / PostHog / GA4 / Raw SQL]
Aufbewahrungsdefinition: [Benutzer kehrte zurück und führte X innerhalb von Y Tagen aus]
Zeitfenster: [wöchentlich / monatlich Kohorten]
Produktalter: [X Monate verfügbarer Daten]

Kohorten-Analyse-Setup:
1. Definiere Aufbewahrungsereignis: [die Aktion, die als "aufbewahrt" zählt]
   - Nicht nur "angemeldet" — definiere aussagekräftiges Engagement
   - z.B. "Kern-Feature verwendet", "Element erstellt", "Nachricht gesendet"

2. Kohorte-Tabelle bauen:
   - Zeilen: Anmeldung-Kohorten (Woche oder Monat der ersten Nutzung)
   - Spalten: Tag 1, Tag 7, Tag 14, Tag 30, Tag 60, Tag 90
   - Zelle: % der Benutzer, die an diesem Tag zurückkehrten

3. Interpretiere die Form:
   - Flache Kurve nach Tag 14: Produkt hat seine Aufbewahrungsgrenze gefunden (gut)
   - Kontinuierlicher Rückgang ohne Boden: Produktmarkt-Fit-Problem
   - Steiler Tag-1-Abfall: Onboarding-Problem, nicht Aufbewahrung
   - Neuere Kohorten besser als ältere: Verbesserungstrend (gut)

4. Identifiziere, welche Kohorten am besten beibehalten werden:
   - Nach Akquisitionskanal (organisch vs. bezahlt)
   - Nach in erster Sitzung verwendetem Anmeldungs-Feature
   - Nach Plan oder Segment

5. Interventionsexperiment:
   Basierend auf Abfall am Tag [X], teste: [E-Mail / In-App-Nudge / Feature-Highlight]

Schreibe die Abfrage für [Tool] und interpretiere die Ergebnisse.
```

### Werkzeugauswahlführer

```
Hilf mir, das richtige Analytics-Tool zu wählen.

Produktstadium: [Vor-Launch / Frühwachstum / Skalierung]
Team: [Solo / 2-5 / 5+]
Technische Ressourcen: [Verfügbarer Entwickler / Nur No-Code]
Budget: $[X/Monat]
Primäre Notwendigkeit: [Produktanalyse / Marketing-Attribution / Ecommerce / BI]
Datenschutzanforderungen: [GDPR / HIPAA / keine besonderen Anforderungen]

Vergleiche:

GA4 — Am besten für: Marketing-Websites, Ecommerce, Google Ads Integration. Kostenlos. Begrenzte Produktanalyse-Tiefe.

Mixpanel — Am besten für: SaaS-Produktanalyse, Trichter- und Aufbewahrungsanalyse. Startet kostenlos (begrenzte Ereignisse).

Amplitude — Am besten für: größere Produkt-Teams, Kohorten-Analyse, prädiktive Analytik. Kostenlos verfügbar.

PostHog — Am besten für: selbst gehostet, Feature Flags + Analytics in einem, Open Source. Kostenlos bis zu 1M Ereignisse/Monat.

Plausible / Fathom — Am besten für: Datenschutz-freundlich, keine Cookie-Zustimmung nötig, einfache Traffic-Metriken. $9-14/Monat.

Heap — Am besten für: rückwirkende Event-Erfassung (kein Voraus-Planning nötig), Enterprise.

Empfehlung für meine Situation: [Tool + Warum + Kosten in meinem Umfang]
```

## Beispiel

**Nutzer:** Unser SaaS hat eine 23%ige Test-zu-bezahlt-Konversion, aber wir wissen nicht, wo Menschen abfallen. Wir verwenden PostHog. Hilf mir, das Trichter-Tracking einzurichten.

**Claudes Plan:**

**In PostHog zu erstellender Trichter:**
1. Test-Anmeldung abgeschlossen → 2. Dashboard erstes Laden → 3. Kern-Feature verwendet (definieren: "Projekt erstellt") → 4. Teamdaten eingeladen → 5. Upgrade auf bezahlt

**PostHog Trichter-Setup:**
In PostHog: Insights → Funnels → füge diese 5 Schritte der Reihe nach hinzu. Setze Konversionsfenster: 14 Tage (Länge deiner Test-Zeit).

**Vorhersage, wo du den Abfall sehen wirst:**
- Schritt 1→2 (Anmeldung → Dashboard): normalerweise 85-95%. Wenn niedriger, ist E-Mail-Bestätigung unterbrochen oder langsam.
- Schritt 2→3 (Dashboard → erste Aktion): Dies ist typischerweise der größte Abfall (40-60%). Leerer-Zustand-Reibung.
- Schritt 3→4 (Alleinige Nutzung → Team einladen): 15-30% Einladungsrate ist normal für Team-Tools.
- Schritt 4→5 (Aktiv → bezahlt): Wenn Aktivierung (Schritte 1-4) abgeschlossen ist, sollten 50-70% konvertieren.

**Erstes Experiment:** Füge eine "Schnellstart"-Checkliste im leeren Dashboard-Zustand mit 3 Aufgaben hinzu. Jede Aufgaben-Abschluss-Ereignis = verfolgt. Leerer Zustand ist der #1 Hebel bei Schritt 2→3.

---
