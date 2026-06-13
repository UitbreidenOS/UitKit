---
name: email-ab-tester
description: "E-Mail-A/B-Test-Design und -Analyse: Hypothese, Varianten, Stichprobengröße, Ergebnisinterpretation"
---

# Skill: E-Mail-A/B-Tester

## Wann aktivieren
- Öffnungsrate, Klickrate oder Conversion einer E-Mail-Kampagne verbessern
- Zwischen zwei Betreffzeilen, CTAs oder E-Mail-Strukturen wählen
- Ergebnisse eines Split-Tests vorliegen und deren statistische Aussagekraft beurteilt werden soll
- Langfristiges Optimierungsbacklog an E-Mail-Hypothesen aufbauen
- Ein A/B-Test wurde durchgeführt und es ist unklar, wie „Gewinner" vs. „Rauschen" zu interpretieren ist

## Wann NICHT verwenden
- Die Liste hat unter 1.000 Abonnenten — ohne ausreichendes Volumen wird keine statistische Signifikanz erreicht; stattdessen qualitative Methoden zur Optimierung nutzen
- Vollständig unterschiedliche Kampagnen testen (unterschiedliche Angebote, unterschiedliche Zielgruppen) — das ist eine Strategieänderung, kein A/B-Test
- Mehr als eine Variable gleichzeitig testen (außer ein multivariater Test ist ausdrücklich gewünscht) — Variable isolieren, sonst sind die Ergebnisse nicht interpretierbar
- Du weißt bereits, was funktioniert — nicht testen, um zu bestätigen, sondern um zu lernen

## Anweisungen

### A/B-Test-Design-Prompt

```
Entwirf einen A/B-Test für meine E-Mail-Kampagne.

Kampagnentyp: [Newsletter / Werbung / automatisierte Sequenz / transaktional]
Für den Test verfügbare Listengröße: [X Abonnenten]
Primäres Ziel: [Öffnungsrate / Klickrate / Conversion / Umsatz pro E-Mail]
Was ich testen möchte: [Betreffzeile / Absendername / Sendezeitpunkt / CTA / E-Mail-Länge / Format / Angebotsgestaltung]

Aktuelle Benchmark:
- Durchschnittliche Öffnungsrate: [X%]
- Durchschnittliche Klickrate: [X%]
- Durchschnittliche Conversion-Rate: [X%]

Was ich für wahr halte (Hypothese): [z. B. „Eine neugierbasierte Betreffzeile wird eine direkte Nutzen-Betreffzeile für dieses Segment übertreffen, weil unsere Zielgruppe forschungsorientiert ist"]

Test entwerfen:

## Hypothese
Wenn/Dann/Weil-Struktur:
Wenn [Änderung], Dann wird [Metrik] um [X%] [steigen/sinken], Weil [Begründung basierend auf Kenntnissen über die Zielgruppe].

Warum dieses Format wichtig ist: „Einfach verschiedene Betreffzeilen ausprobieren" ist keine Hypothese — das ist zufällige Variation. Eine ordentliche Hypothese zwingt dazu, zu verstehen, warum etwas funktionieren könnte, sodass man auch beim Scheitern des Tests lernt.

## Zu testende Variable (EINE isolieren)
Was sich genau zwischen A und B ändert:
Variante A (Kontrolle): [aktuelle Version / spezifischer Text]
Variante B (Herausforderer): [neue Version / spezifischer Text]

Was identisch bleibt:
- Sendezeitpunkt: gleich
- Absendername: gleich
- E-Mail-Inhalt: gleich
- Zielgruppensegment: gleich
- Alles andere: gleich

## Stichprobengrößenberechnung
Bei einem Konfidenzniveau von 95% und 80% statistischer Teststärke:

Basis-Conversion-Rate (aktuelle Metrik): [X%]
Mindestens erkennbarer Effekt (MDE): [% Verbesserung, die eine Maßnahme rechtfertigt — z. B. 10% relative Verbesserung]
Benötigte Stichprobe pro Variante: [berechnen oder Claude berechnet]
Benötigte Gesamtabonnenten: [2 × Stichprobe pro Variante]
Hinweis: Ist die Liste kleiner, kann der Test zu schwach sein.

Schnellreferenz (für Öffnungsraten-Tests, Baseline 25%):
Zur Erkennung einer 10% relativen Verbesserung (25% → 27,5%): ~3.800 pro Variante
Zur Erkennung einer 20% relativen Verbesserung (25% → 30%): ~950 pro Variante
Zur Erkennung einer 30% relativen Verbesserung (25% → 32,5%): ~430 pro Variante

## Testdurchführungsplan
1. Testzielgruppe zufällig segmentieren (nicht nach Engagement — das verzerrt die Ergebnisse)
2. Beide Varianten gleichzeitig versenden (gleiche Zeit, gleicher Tag — oder innerhalb von 1 Stunde)
3. Auf statistische Signifikanz warten, bevor ein Gewinner bestimmt wird
4. Nicht frühzeitig auf Basis von 4-Stunden-Daten einen Gewinner ausrufen — das erhöht falsch-positive Ergebnisse

## Was gemessen wird
Primärmetrik: [die eine Metrik, auf die sich die Hypothese bezieht]
Sekundärmetriken: [beobachten, aber keine Entscheidungen allein darauf basieren]
Absicherungsmetriken: [Metriken, die nicht verschlechtert werden dürfen — z. B. Abmelderate]

## Entscheidungsregel
Wenn Variante B Variante A um den MDE bei 95% Konfidenz übertrifft → B übernehmen
Wenn Ergebnis nicht signifikant → Test ist nicht eindeutig — nicht als Unentschieden werten
Wenn Variante A gewinnt → verstehen, warum B gescheitert ist, bevor ein anderer Herausforderer getestet wird
```

### Generator für Betreffzeilen-A/B-Varianten

```
Generiere A/B-Test-Varianten für Betreffzeilen.

E-Mail-Inhalt: [beschreiben, worum es in der E-Mail geht]
Zielgruppe: [wer sie sind und was sie interessiert]
Markenstimme: [formal / konversationell / verspielt / direkt]
Aktuell beste Betreffzeile: [einfügen — oder beschreiben, was bisher versucht wurde]

5 Paare von Betreffzeilen-Varianten generieren, je einen anderen psychologischen Hebel testend:

Paar 1 — Direkter Nutzen vs. Neugier
A: [nennt den Nutzen klar]
B: [erzeugt eine Neugier-Lücke oder offene Schleife]

Paar 2 — Personalisierung vs. Sozialer Beweis
A: [verwendet Empfängername oder Segment]
B: [verweist auf eine Menge oder Autorität]

Paar 3 — Spezifische Zahl vs. Konzeptionelle Überschrift
A: [spezifischer Datenpunkt oder Zahl]
B: [Nutzen ohne die Zahl]

Paar 4 — Frage vs. Aussage
A: [stellt dem Leser eine Frage]
B: [macht eine direkte Behauptung]

Paar 5 — Kurz (< 35 Zeichen) vs. Beschreibend (40-55 Zeichen)
A: [prägnant, unter 35 Zeichen]
B: [beschreibender, unter 55 Zeichen]

Für jedes Paar angeben:
- Welche Hypothese es testet
- Was ein Sieg für A im Vergleich zu einem Sieg für B für die künftige Strategie bedeutet
- Vorschautext zum Kombinieren mit jeder Betreffzeile
```

### Ergebnis-Interpreter für A/B-Tests

```
Interpretiere meine A/B-Testergebnisse.

Testdetails:
- Was getestet wurde: [Betreffzeile / CTA / Sendezeitpunkt / usw.]
- Variante A (Kontrolle): [Beschreibung]
- Variante B (Herausforderer): [Beschreibung]
- Stichprobengröße: Variante A: [X E-Mails], Variante B: [X E-Mails]
- Ergebnis:
  - Variante A: [Metrik, z. B. 24,3% Öffnungsrate]
  - Variante B: [Metrik, z. B. 27,1% Öffnungsrate]
- Testdauer: [X Stunden / X Tage]
- Von der Plattform gemeldetes Konfidenzniveau (falls vorhanden): [X%]

Interpretieren:

## Ist dieses Ergebnis statistisch signifikant?
Berechnen (oder Berechnung der Plattform verifizieren):
- Relative Verbesserung: ([B - A] / A) × 100 = X%
- Zwei-Proportionen-z-Test:
  p1 = Rate Variante A, n1 = Sendungen Variante A
  p2 = Rate Variante B, n2 = Sendungen Variante B
- Interpretation des p-Werts:
  p < 0,05: statistisch signifikant bei 95% Konfidenz → sicher zu handeln
  p 0,05-0,10: marginal signifikant → mit Vorsicht fortfahren, erneut testen
  p > 0,10: nicht signifikant → auf Basis dieses Ergebnisses nicht handeln

## Praktische Signifikanz
Selbst wenn statistisch signifikant: ist die Verbesserung bedeutsam?
- Wie viele zusätzliche Öffnungen/Klicks pro 1.000 Sendungen?
- Welche projizierte Jahresauswirkung hat das auf das gesamte Programm?

## Häufige Interpretationsfehler
1. Zu frühes Ausrufen des Gewinners: Viele Plattformen zeigen innerhalb von Stunden einen „Gewinner". Ignorieren bis zur vollständigen Auswertung.
2. Zeitliche Verfälschung: Ging A am Montag früh und B am Freitagnachmittag raus? Zeitunterschiede machen Ergebnisse ungültig.
3. Stichprobenkontamination: Haben manche Abonnenten beide Varianten erhalten? Das passiert bei Reaktivierungssegmenten.
4. Problem des multiplen Testens: Wurden 10 Betreffzeilen getestet und ein „Gewinner gefunden", ist die Wahrscheinlichkeit eines falsch-positiven Ergebnisses hoch. Dafür korrigieren.

## Was mit diesem Ergebnis tun
Wenn B gewinnt (signifikant): [konkrete Maßnahme — Vorlage aktualisieren, lernbares Prinzip dokumentieren, auf nächste Kampagne anwenden]
Wenn nicht eindeutig: [was als nächstes testen — größere Stichprobe, größerer Variantenunterschied, andere Metrik]
Wenn A gewinnt (B ist schlechter): [dokumentieren, WARUM — was sagt das über die Zielgruppe? Welches Prinzip wird bestätigt oder widerlegt?]

## Zu dokumentierende Erkenntnis
Jedes A/B-Testergebnis — gewonnen, verloren oder nicht eindeutig — sollte der E-Mail-Wissensbasis hinzugefügt werden:
Getestete Hypothese: [Hypothese wiederholen]
Ergebnis: [was passiert ist]
Extrahiertes Prinzip: [1-Satz-Verallgemeinerung, z. B. „Unsere Zielgruppe reagiert auf Spezifität — Zahlen übertreffen konzeptionelle Aussagen"]
Gilt für: [Betreffzeilen / CTAs / Fließtext / gesamte E-Mail]
```

### Backlog-Builder für E-Mail-A/B-Tests

```
Erstelle einen 90-Tage-A/B-Test-Backlog für mein E-Mail-Programm.

Mein aktuelles E-Mail-Programm:
- Listengröße: [X]
- Sendefrequenz: [X E-Mails/Woche oder Monat]
- Durchschnittliche Öffnungsrate: [X%]
- Durchschnittliche Klickrate: [X%]
- Durchschnittliche Conversion-Rate: [X%]
- Größte Lücke: [Öffnungsrate / Klickrate / Conversion — wo wird am meisten verloren?]

Priorisierten Backlog mit 10 Tests generieren, geordnet nach:
1. Potenzielle Auswirkung auf die größte Lücke
2. Leichtigkeit der Durchführung
3. Lernwert (auch wenn das Ergebnis negativ ist)

Für jeden Test:
- Testname und Hypothese
- Zielmetrik
- Benötigte Stichprobengröße
- Laufzeit
- Was unabhängig vom Ergebnis gelernt wird

Priorisierungsregel:
- Zuerst den Trichtereingang optimieren (Öffnungsrate), bevor Mid-Funnel (Klickrate) optimiert wird,
  weil eine 10%ige Steigerung der Öffnungsrate alle nachgelagerten Metriken automatisch verbessert
- Pro Sendung eine Variable testen — keine Betreffzeilen- und CTA-Änderungen im selben Test mischen
- Tests mindestens 2 Wochen auseinanderhalten, um Lernkontamination zu vermeiden

Ausgabe als Kalender:
Monat 1 (Grundlage): Öffnungsraten-Variablen testen
Monat 2 (Engagement): Klickraten-Variablen testen
Monat 3 (Conversion): Landing/Conversion-Variablen testen
```

### Leitfaden für multivariate Tests (Fortgeschrittene)

```
Entwirf einen multivariaten E-Mail-Test.

WICHTIG: Multivariate Tests benötigen mindestens das 10-fache der Stichprobengröße eines einfachen A/B-Tests.
Nur verwenden bei sehr großer Liste (> 100.000 verfügbare Sendungen) und Toleranz für die Komplexität.

Zu testende Variablen:
Variable 1: [z. B. Betreffzeile — 2 Varianten]
Variable 2: [z. B. CTA-Text — 2 Varianten]
Variable 3: [z. B. Hero-Bild — 2 Varianten]

Anzahl der Kombinationen: 2³ = 8 Testzellen
Mindeststichprobe pro Zelle: [berechnet anhand von Basismetrik und MDE]
Benötigte Gesamtstichprobe: [8 × Minimum pro Zelle]

Erklären, warum die meisten Teams KEINE multivariaten Tests durchführen sollten:
1. Stichprobengrößenanforderung ist für die meisten Listen unerschwinglich
2. Wechselwirkungen zwischen Variablen sind schwer zu interpretieren
3. Die Gewinnerzelle lässt sich möglicherweise nicht verallgemeinern — was den Sieg verursacht hat, lässt sich nicht isolieren
4. Besser 3 sequenzielle A/B-Tests als 1 multivariater Test
   (Sequenzielle Tests verlieren etwas Geschwindigkeit, gewinnen aber Interpretierbarkeit)

Empfohlene Alternative: Faktorielles A/B-Testing (Sequenz von 3 Tests, Gewinner jeweils anwenden).
```

### Referenz: Rechner für statistische Signifikanz

```typescript
// Zwei-Proportionen-z-Test für E-Mail-A/B-Ergebnisse
function calculateSignificance(
  variantARate: number,   // e.g., 0.243 for 24.3%
  variantASize: number,   // e.g., 5000
  variantBRate: number,   // e.g., 0.271
  variantBSize: number    // e.g., 5000
): { zScore: number; pValue: number; significant: boolean } {

  const pCombined = (variantARate * variantASize + variantBRate * variantBSize)
    / (variantASize + variantBSize)

  const standardError = Math.sqrt(
    pCombined * (1 - pCombined) * (1/variantASize + 1/variantBSize)
  )

  const zScore = (variantBRate - variantARate) / standardError
  // Convert zScore to p-value using normal distribution
  // |z| > 1.96 = p < 0.05 = 95% confidence
  // |z| > 2.576 = p < 0.01 = 99% confidence

  return {
    zScore,
    pValue: /* normal CDF calculation */ 0,
    significant: Math.abs(zScore) > 1.96
  }
}

// Minimum detectable effect (MDE) at 95% confidence, 80% power
function minimumSampleSize(
  baselineRate: number,
  mde: number  // relative improvement as decimal, e.g., 0.10 for 10%
): number {
  const p1 = baselineRate
  const p2 = baselineRate * (1 + mde)
  // Standard formula: n = 16 * p(1-p) / (p2-p1)^2 (approximate)
  return Math.ceil(16 * p1 * (1 - p1) / Math.pow(p2 - p1, 2))
}
```

## Beispiel

**Nutzer:** Mein Betreffzeilen-Test hatte 5.200 Sendungen pro Variante. Variante A (direkt): „Your Q4 results are ready" erzielte 24,8% Öffnungsrate. Variante B (Neugier): „We found something surprising in your data" erzielte 28,2% Öffnungsrate. Ist das real?

**Interpretation:**

```
## Ergebniszusammenfassung
Relative Verbesserung: (28,2 - 24,8) / 24,8 = +13,7%
Absolute Verbesserung: +3,4 Prozentpunkte

## Statistischer Test
n = 5.200 pro Variante
Kombinierte Rate: (0,248 × 5200 + 0,282 × 5200) / 10400 = 0,265
Standardfehler = √(0,265 × 0,735 × (1/5200 + 1/5200)) = 0,00869
z-Score = (0,282 - 0,248) / 0,00869 = 3,91

p < 0,0001 — hochsignifikant. Das ist kein Rauschen.

## Praktische Signifikanz
Bei 5.200 Sendungen: +177 zusätzliche Öffnungen pro Kampagne
Auf die gesamte Liste angewendet (angenommen 20.000 Sendungen/Kampagne): +680 Öffnungen
Bei 2% CTR auf Öffnungen ergibt das +14 zusätzliche Klicks pro Kampagne.

## Entscheidung
Variante B für diesen E-Mail-Typ übernehmen: Rahmung „etwas Unerwartetes in deinen Daten".
Das ist ein Neugier-Lücken-Muster — die Antwort wird in der Betreffzeile nicht gegeben.

## Zu dokumentierendes Prinzip
„Neugier-Lücken-Betreffzeilen übertreffen direkte Nutzen-Betreffzeilen um ~14%
bei Daten-/Ergebnis-E-Mails. Die Zielgruppe möchte wissen, was überraschend war —
die unbeantwortete Frage treibt die Öffnung."

## Vorbehalt
Das war ein einzelner Test. Mit einem zweiten Test in einer anderen Kampagne validieren, bevor
dies als universelle Regel behandelt wird. Prinzipien verallgemeinern sich; einzelne Testergebnisse möglicherweise nicht.
```

---
