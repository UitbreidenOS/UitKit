---
name: customer-feedback-synthesizer
description: "Wandeln Sie 50-200+ Bewertungen, Umfrageantworten oder Support-Tickets in priorisierte Schmerzpunkte, Funktionswünsche, Stimmungstrends und einen konkreten Aktionsplan um"
---

# Customer Feedback Synthesizer

## When to activate
- Sie haben mehr Bewertungen, als Sie Zeit haben zu lesen, und benötigen die Themen schnell
- Eine vierteljährliche Geschäftsprüfung steht an und Sie benötigen eine datengestützte Kundenzusammenfassung
- Sie haben gerade ein Produkt oder eine Funktion gestartet und möchten wissen, wie es angekommen ist
- Sie bereiten einen Kundenbericht für Ihr Team, Investoren oder einen Beirat vor

## When NOT to use
- Sie haben weniger als 10 Bewertungen — lesen Sie sie selbst, Muster benötigen Volumen
- Sie benötigen eine statistisch rigorose NPS- oder CSAT-Analyse — verwenden Sie ein dediziertes Umfragetool
- Sie möchten ein wörtliches Protokoll jeder Beschwerde — diese Kompetenz synthetisiert, archiviert aber nicht

## Instructions

### What to give Claude

Fügen Sie Ihre Bewertungen direkt ein. Kopieren Sie von Google, Yelp, Trustpilot, App Store oder G2. Fügen Sie Zusammenfassungen von Support-Tickets ein. Fügen Sie offene Umfrageantworten ein. Keine Formatierung erforderlich — einfach Rohtext, eine Bewertung nach der anderen. Claude kann 200+ in einem Durchgang verarbeiten.

Wenn Sie eine CSV exportiert haben, fügen Sie nur die Spalte mit Bewertungstext ein. Sie müssen sie nicht bereinigen.

Sagen Sie Claude:
- Den Zeitraum der Bewertungen (z.B. „letzte 3 Monate" oder „seit unserem Start im Januar")
- Ihren Geschäftstyp (Restaurant, SaaS, Einzelhandel, Service), damit Claude Kontext hat
- Jede spezifische Frage, die Sie beantwortet haben möchten (z.B. „warum sinken unsere Bewertungen?" oder „was möchten die Leute, dass wir hinzufügen?")

### What Claude produces

Claude produziert fünf Dinge:

**1. Top 5 Schmerzpunkte** — geordnet danach, wie viele Bewertungen sie erwähnen, mit einer Häufigkeitszählung und der typischen emotionalen Intensität (frustriert vs. leicht genervt vs. wütend)

**2. Top 5 Funktions- oder Produktanfragen** — geordnet danach, wie viele Personen gefragt haben, mit der genauen Sprache, die Kunden am häufigsten verwenden (nützlich für Ihre eigene Kopie und Roadmap-Argumente)

**3. Stimmungstrend** — verbessernd, stabil oder rückläufig — basierend auf dem Ton über den Zeitraum, den Sie angegeben haben. Wenn Sie Claude Bewertungen aus zwei Zeiträumen geben, vergleicht er sie direkt.

**4. Top 3 „Was funktioniert" Highlights** — was Kunden am meisten loben, was genauso wichtig ist wie das, was sie kritisieren. Nützlich für Marketing-Kopie und um zu wissen, was nicht zu ändern ist.

**5. Dringlichkeitsmatrix** — jeder Schmerzpunkt klassifiziert als:
- Kritisch: viele Personen erwähnen es, starke negative Emotion, beeinträchtigt das Kernerlebnis
- Wichtig: häufig, moderate Frustration, lohnt sich diese Quartal zu beheben
- Überwachen: gelegentlich, leicht, noch nicht würdig zu handeln, aber es lohnt sich zu verfolgen

### Suggested fixes

Fragen Sie Claude für jeden Schmerzpunkt in den kritischen und wichtigen Kategorien: „Schlagen Sie für jedes Problem eine konkrete Maßnahme vor, die ich ergreifen könnte." Claude produziert für jedes Element eine kurze Aktion — kein Strategiedokument, nur der nächste Schritt.

### Monthly cadence

Führen Sie dies einmal im Monat aus. Speichern Sie jedes Ergebnis (kopieren Sie es in ein Dokument). Nach drei Monaten fügen Sie alle drei Ergebnisse ein und fragen Claude: „Verbessern sich die kritischen Probleme des ersten Monats?" Dies verfolgt, ob Ihre Korrektionen tatsächlich funktionieren.

---

### Prompt template

```
Ich werde [Anzahl] Bewertungen von [Plattform] aus [Zeitraum] einfügen.
Mein Geschäft ist ein(e) [Geschäftstyp].

Bitte geben Sie mir:
1. Top 5 Schmerzpunkte mit Häufigkeitszählung und emotionaler Intensität
2. Top 5 Funktions- oder Produktanfragen, geordnet danach, wie viele Personen gefragt haben
3. Stimmungstrend: verbessernd, stabil oder rückläufig
4. Top 3 Dinge, die Kunden am meisten loben
5. Eine Dringlichkeitsmatrix, die jeden Schmerzpunkt als kritisch, wichtig oder zu überwachen klassifiziert
6. Für kritische und wichtige Elemente: eine konkrete Maßnahme, die ich für jeden ergreifen könnte

Hier sind die Bewertungen:
[Bewertungen einfügen]
```

## Example

Sie besitzen ein Restaurant und fügen 80 Google-Bewertungen aus den letzten 3 Monaten ein. Sie sagen Claude, dass Ihr Geschäft ein lässiges Restaurant mit Tischbedienung ist.

Claude identifiziert:

Schmerzpunkte:
1. Wartezeit (34 Bewertungen, starke Frustration) — Kritisch
2. Inkonsistente Portionsgrößen (18 Bewertungen, moderate Frustration) — Wichtig
3. Parken (11 Bewertungen, leichte Verärgerung) — Überwachen
4. Lautstärkepegel am Wochenende (9 Bewertungen, moderat) — Überwachen
5. Begrenzte vegetarische Optionen (7 Bewertungen, leicht) — Überwachen

Funktionsanfragen:
1. Online-Bestellung oder Reservierungen (22 Bewertungen)
2. Größere Portionen im Mittagsmenü (14 Bewertungen)
3. Ein Treueprogramm (8 Bewertungen)

Stimmungstrend: Rückläufig — Bewertungen aus den Monaten 1-2 zeigten wärmere Sprache; Monat 3 zeigt mehr Frustration speziell um Wartezeiten, zeitlich zusammenfallend mit Ihren neuen Wochenendstunden.

Was funktioniert: Freundlichkeit des Personals (positiv erwähnt in 61 von 80 Bewertungen), Lebensmittelqualität bei den Kerngerichten und Preis-Leistungs-Verhältnis.

Aktionen der Dringlichkeitsmatrix:
- Wartezeit (Kritisch): Claude schlägt vor, ein SMS-Benachrichtigungssystem hinzuzufügen, wenn Tische bereit sind, und geschätzte Wartezeiten an der Tür anzuzeigen
- Portionsgrößen (Wichtig): Claude schlägt vor, die Mittagsplatte zu standardisieren mit einem dokumentierten Portionsleitfaden für Küchenpersonal

Gesamtzeit: weniger als 2 Minuten, um von rohem Einfügen zu diesem Ergebnis zu gelangen.

---
