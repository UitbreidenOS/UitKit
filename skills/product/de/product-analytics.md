---
name: product-analytics
description: "Produktanalyse: Metrik-Frameworks definieren, Dashboards erstellen, Feature-Adoption analysieren, Aktivierung und Bindung messen, Daten interpretieren, um Produktentscheidungen zu treffen"
---

# Produktanalyse-Fähigkeit

## Wann zu aktivieren
- Festlegung, welche Metriken für ein Produkt oder eine Funktion verfolgt werden sollen
- Analysieren Sie, warum eine Funktion nach dem Start eine niedrige Akzeptanz hat
- Erstellen eines Produkt-Metrik-Dashboards von Grund auf
- Interpretation von Bindungs- oder Aktivierungsdaten, um Probleme zu finden
- Vorbereitung einer datengesteuerten Produktüberprüfung oder Roadmap-Entscheidung
- Entwerfen eines Metrik-Frameworks (North Star, L1/L2-Hierarchie)

## Wann NICHT verwenden
- Einrichtung der Analytics-Infrastruktur — verwenden Sie die Fähigkeit analytics-tracking
- A/B-Test-Design und Statistiken — verwenden Sie die Fähigkeit experiment-designer
- Marketing-Attributionsanalyse — das ist paid-ads oder analytics-tracking

## Anleitung

### Design des Metrik-Frameworks

```
Entwerfen Sie ein Metrik-Framework für [Produkt].

Produkt: [beschreiben]
Stufe: [vor-PMF / Wachstum / Skalierung]
Geschäftsmodell: [Abonnement / Nutzungsbasiert / Freemium / Marktplatz]
Teamgröße: [1-5 / 6-20 / 20+]

Metrik-Hierarchie:

Stufe 0 — North Star Metrik (1 Metrik):
[Die einzelne Metrik, die den Wert für Benutzer am besten darstellt]
Muss sein: führender Umsatzindikator, messbar, vom Team umsetzbar
Beispiele: DAU, wöchentlich aktive Projekte, gesendete Nachrichten, generierte Berichte

Stufe 1 — Säulenmetriken (3-5 Metriken):
[Die Komponenten, die die North Star Metrik erklären]
Framework: Akquisition, Aktivierung, Bindung, Referral, Umsatz (AARRR)

Stufe 2 — Diagnose-Metriken (für jede Säule):
[Metriken, die helfen zu diagnostizieren, warum sich eine L1-Metrik bewegt]

Beispiel-Framework für ein B2B-SaaS-Tool:
NSM: Wöchentlich aktive Teams (Teams mit ≥ 3 Mitgliedern, die diese Woche die Kernfunktion genutzt haben)
L1: 
  - Neu registrierte Teams (Akquisition)
  - % die in Woche 1 3+ Mitglieder eingeladen haben (Aktivierung)
  - % Bindung in Woche 4 (Bindung)
  - Netto-Umsatz-Retention (Umsatz)
L2 (für Aktivierung):
  - Zeit bis zur ersten Kernaktion
  - % die Onboarding-Checkliste abgeschlossen haben
  - Einladungsversandrate in Sitzung 1

Entwerfen Sie das Framework für mein Produkt. Einschließlich: was Sie NICHT verfolgen sollten (Eitelkeitsmetriken).
```

### Feature-Adoptionsanalyse

```
Analysieren Sie die Übernahme für [Funktion].

Funktion: [beschreiben Sie, was sie tut]
Startdatum: [vor X Wochen/Monaten]
Aktuelle Adoptionsrate: [X% der berechtigten Benutzer haben sie verwendet]
Ziel-Adoptionsrate: [X%]
Analytics-Tool: [Mixpanel / Amplitude / PostHog / GA4]

Framework für die Adoptionsanalyse:

1. Definieren Sie "übernommen":
   □ Erste Verwendung? (Bewusstsein) — zu locker
   □ X-mal verwendet? (Engagement) — besser
   □ In X% der Sitzungen verwendet? (Gewohnheit) — am besten
   [Legen Sie vor der Analyse einen klaren Adoptionsschwellenwert fest]

2. Trichter von der Feature-Entdeckung zur Übernahme:
   - Feature-Einstiegspunkt gesehen: [X%]
   - Geklickt / initiiert: [X%]
   - Erste Verwendung abgeschlossen: [X%]
   - Zurückgekehrt und erneut verwendet: [X%]
   - "Übernommen" (nach Ihrer Definition): [X%]

3. Segmentierung (welche Benutzer nehmen an oder nicht):
   - Nach Benutzerrolle / Plan / Unternehmensgröße
   - Nach Aktivierungskohorte (neuere vs. ältere Benutzer)
   - Nach primärem Anwendungsfall oder Arbeitsablauf

4. Hindernisse für die Übernahme (qualitativ):
   - Ist die Funktion auffindbar? (Überprüfen: Wissen Benutzer überhaupt, dass es existiert?)
   - Ist der Wert sofort klar? (Erlebnis der ersten Verwendung)
   - Erfordert es Setup oder einen Vorbereitungszustand?
   - Gibt es einen konkurrierenden Workflow, der bereits verwendet wird?

5. Empfehlungen nach Abbruchpunkt:
   - Niedriges Bewusstsein → In-App-Ankündigung, Tooltip, E-Mail
   - Niedrige Abschlussquote der ersten Verwendung → UI vereinfachen oder geführtes Setup hinzufügen
   - Niedrige Wiederverwendung → Überprüfen Sie, ob der Kernwert beim ersten Gebrauch geliefert wurde

Abfrage zum Ausführen in [Analytics-Tool] + Interpretation der Ergebnisse.
```

### Bindungsanalyse

```
Analysieren Sie Bindungsdaten und identifizieren Sie Verbesserungsmöglichkeiten.

Produkt: [beschreiben]
Bindungsdefinition: [Benutzer hat X innerhalb von Y Tagen getan]
Aktuelle D1/D7/D14/D30 Bindung: [X% / X% / X% / X%]
Benchmark für Ihre Kategorie: [Schauen Sie sich Ihre Branche an — variiert stark]
Analytics-Tool: [Tool]

Schritte der Bindungsanalyse:

1. Formanalyse:
   - Abflachende Kurve: Bindung erreicht einen Boden → Produkt hat Kernbindung (gut)
   - Kontinuierlicher Rückgang: keine Bindungsgrenze → PMF-Problem, kein Optimierungsproblem
   - Stufenrückgang an einem bestimmten Tag: etwas passiert in diesem Moment (Testversion abgelaufen? E-Mail stoppt? Funktionslimit erreicht?)

2. Vergleich von Kohorten:
   - Vergleichen Sie wöchentliche Kohorten — halten neuere Kohorten besser als ältere?
   - Verbesserung: Ihre Änderungen funktionieren
   - Rückgang: etwas ist rückläufig (Funktion degradiert, Konkurrenz verbessert sich)
   - Flach: keine Verbesserung, keine Regression

3. Segment-Bindung:
   Welche Benutzer halten am besten fest?
   - Kanal (organisch vs. bezahlt — organisch bindet normalerweise 2-3x besser)
   - Feature-Nutzung (Benutzer, die Feature X genutzt haben, halten sich bei Y% gegenüber Z% für Nicht-Benutzer)
   - Onboarding-Pfad (Checkliste abgeschlossen oder nicht)
   - Unternehmensgröße oder Plan

4. Identifizieren Sie die "Aktivierungsfunktion":
   Finden Sie das Ereignis/die Funktion, die am höchsten mit der Bindung am Tag 30 korreliert.
   Ausführen: Ereigniskorrelation → Bindungsanalyse in Amplitude oder Mixpanel
   Machen Sie diese Funktion zu einem Teil des Onboarding-Flows.

5. Interventionsdesign:
   D1-Fall (< 40% kehren Tag 1 zurück): Onboarding-Problem
   D7-Fall: Gewöhnungsbildungsproblem (Push-Benachrichtigungen, E-Mail, In-App-Nudge)
   D30-Fall: Wertvertiefungsproblem (neue Funktionen, Integrationen, Team-Expansion)

Analysieren Sie meine Bindungsdaten und empfehlen Sie die Intervention mit dem höchsten Hebel.
```

### Produktüberprüfungs-Dashboard

```
Entwerfen Sie ein wöchentliches Produktüberprüfungs-Dashboard für [Produkt/Team].

Team: [Produkt / Ingenieurwesen / Gesamtes Unternehmen]
Häufigkeit: [wöchentlich / alle zwei Wochen]
Ziele: [Roadmap-Entscheidungen treffen / Regressionen identifizieren / OKR-Fortschritt verfolgen]

Dashboard-Abschnitte:

1. North Star Metrik (Woche um Woche):
   [Metrikname]: [aktueller Wert] vs [letzte Woche] vs [letzte Woche im Monat]
   Trend: ↑/↓ [X%] — [liegt dies im erwarteten Bereich?]

2. Akquisition:
   Neue Anmeldungen: [X] (Woche) / [X] (Monat) / [X Ziel]
   CAC nach Kanal: [organisch / bezahlt / Referral]

3. Aktivierung:
   Aktivierungsrate (definiert als [X]): [X%] vs Ziel [X%]
   Aktivierungszeit: p50 [Xh] / p90 [Xh]

4. Bindung:
   D7-Bindung: [X%] / D30-Bindung: [X%]
   Trend der wöchentlich aktiven Benutzer: [Sparkline-Daten]

5. Umsatz:
   MRR: $[X] — [+/-X% WoW]
   Neuer MRR: $[X] / Expansion: $[X] / Churn: $[X]
   Netto-MRR-Änderung: $[X]

6. Produktgesundheit:
   Top-Funktion nach Verwendung diese Woche: [X]
   Feature-Adoption auf kürzlichen Starts: [Namen + %]
   Support-Volumen: [X Tickets] — [Trend]

7. Experimente:
   Laufen: [Testname] — [Tage verbleibend] — [aktuelles Ergebnis]
   Diese Woche abgeschlossen: [Testname] — [Ergebnis] — [Entscheidung]

8. Wichtige Fragen für diese Woche:
   - [Was hat sich geändert und warum?]
   - [Was braucht eine Entscheidung?]
   - [Was wissen wir noch nicht?]

Erstellen Sie dieses Dashboard in [Mixpanel / Amplitude / PostHog / Metabase / Notion].
```

## Beispiel

**Benutzer:** Unser SaaS (B2B-Teamkollaborationswerkzeug) hat 35% D30-Bindung. Wir denken, es ist ein Aktivierungsproblem. Analytics in Mixpanel. Was sollten wir untersuchen?

**Analysisplan von Claude:**

35% D30 für ein B2B-Kollaborationswerkzeug liegt unter dem typischen (45-60% für die Kategorie). Aber "Aktivierungsproblem" ist eine Hypothese — lassen Sie uns sie validieren, bevor wir reparieren.

**Schritt 1 — Bestätigen Sie den Abfallort in Mixpanel:**
Erstellen Sie diesen Trichter: Anmeldung → Erste Anmeldung → Team-Einladung gesendet → Kernfunktion 3x verwendet → D30 beibehalten.

Wenn die Bindungsquote für Benutzer, die alle Trichterschritte abschließen, > 60% beträgt, ist das Problem AKTIVIERUNG (nicht Produktwert). Sie haben ein gutes Produkt, das die meisten Benutzer nie erleben.

**Schritt 2 — Suchen Sie den Aktivierungsprädiktor:**
In Mixpanel: Bindung → Vergleich nach "Hast du Event X in den ersten 7 Tagen getan". Testen Sie diese Ereignisse:
- Hat ein Teamkollege eingeladen → bei D30 beibehalten?
- Verwendet [Kernfunktion] 3+ Mal → bei D30 beibehalten?
- Hat eine Integration verbunden → bei D30 beibehalten?

Das Ereignis mit der höchsten D30-Bindungskorrelation = Ihr Aha-Moment. Machen Sie dies zum Aktivierungsziel.

**Schritt 3 — Suchen Sie die Barriere:**
Wenn das Aktivierungsereignis "Team-Einladung gesendet" ist und nur 22% der Anmeldungen eine in Woche 1 senden, lautet die Frage: Warum laden sie ihr Team nicht ein?

Segmentieren nach: Solo-Anmeldungen vs. Team-Anmeldungen. Wenn Solo-Anmeldungen bei 15% und Team-Anmeldungen bei 58% beibehalten werden, liegt das Problem darin, dass Sie zu viele Solo-Benutzer erwerben, nicht dass Ihr Aktivierungsfluss unterbrochen ist.

**Ausgabe des Entscheidungsbaums:**
- Niedrige Aktivierungsrate + hohe postaktiverungsgebundene → Aktivierungsfluss reparieren
- Hohe Aktivierungsrate + niedrige Bindung → Produktwert oder Zielgruppe reparieren
- Niedrige Aktivierung + niedrige Bindung nach Aktivierung → tiefere Entdeckung notwendig

---
