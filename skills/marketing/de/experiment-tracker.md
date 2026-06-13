---
name: experiment-tracker
description: "A/B-Test-Tracker: Hypothesenformulierung, Stichprobengrößenrechner, Ergebnisanalyse und Interpretation statistischer Signifikanz für Wachstumsexperimente"
---

# Skill: Experiment-Tracker

## Wann aktivieren
- Einen A/B-Test durchführen und eine strukturierte Hypothese sowie Erfolgsmetriken vor dem Start benötigen
- Stichprobengröße und Testdauer berechnen, bevor ein Experiment beginnt
- Testergebnisse analysieren und feststellen, ob statistische Signifikanz erreicht wurde
- Experiment-Erkenntnisse für das Team oder das Experiment-Protokoll dokumentieren
- Priorisieren, welche Experimente als nächstes anhand von ICE- oder RICE-Bewertung durchgeführt werden sollen
- Ein Test wurde abgeschlossen und es muss entschieden werden: deployen, verwerfen oder iterieren

## Wann NICHT verwenden
- Vollständiges Experiment-Design von Grund auf — dafür `/experiment-designer` verwenden
- Analytics-Setup und Event-Tracking — `/analytics-tracking` verwenden
- Interpretation qualitativer Forschung oder Nutzerinterviews — andere Methodik
- Wenn die Stichprobengröße zu klein ist für einen gültigen Test (< 100 erwartete Conversions pro Variante)

## Anweisungen

### Framework zur Hypothesenformulierung

```
Strukturierte Experiment-Hypothese für meinen A/B-Test formulieren.

Testidee: [die gewünschte Änderung beschreiben]
Seite / Feature: [wo im Produkt oder Funnel]
Aktueller Zustand: [was heute existiert]
Vorgeschlagene Änderung: [was getestet werden soll]

Hypothese in diesem Format erstellen:

Wir glauben, dass [ÄNDERUNG]
für [ZIELGRUPPEN-SEGMENT]
zu [ERWARTETEM ERGEBNIS] führen wird,
weil [MECHANISMUS / BEGRÜNDUNG]
Wir wissen, dass das wahr ist, wenn [MESSBARE ERFOLGSKRITERIEN]
und der Test [MINDEST-STICHPROBENGRÖSSE] Conversions pro Variante erreicht hat
mit [95%] statistischer Konfidenz.

Außerdem erstellen:
- Primärmetrik: [die eine Metrik, die Gewinn/Verlust bestimmt]
- Sekundärmetriken: [Absicherungsmetriken — dürfen nicht zurückgehen]
- Mindestens erkennbarer Effekt (MDE): [kleinste Verbesserung, die ein Deployen rechtfertigt]
- Risiko: [was schiefgehen könnte — Neuheitseffekt, Segment-Interaktion usw.]
```

### Stichprobengrößenrechner

```
Benötigte Stichprobengröße für meinen A/B-Test berechnen.

Testtyp: [Conversion-Rate / Umsatz pro Nutzer / Bindung / Engagement]
Aktuelle Basis-Rate: [X%] (z. B. aktuelle Conversion-Rate)
Mindestens erkennbarer Effekt (MDE): [X%] (relative Verbesserung, die es wert ist zu erkennen)
  — Konservativ: 5-10% relativer Uplift (große Stichprobe nötig)
  — Moderat: 15-20% relativer Uplift (typisch)
  — Aggressiv: 30%+ relativer Uplift (kleine Stichprobe, nur große Änderungen erkennen)
Statistische Signifikanz: [95%] (Standard) oder [90%] (akzeptabel für Tests mit niedrigem Einsatz)
Statistische Teststärke: [80%] (Standard) oder [90%] (Tests mit hohem Einsatz)
Anzahl Varianten: [2] (A vs. B) oder [3+] (multi-variant — durch n-1 dividieren)

Berechnung:

Für Conversion-Rate-Tests den Zwei-Proportionen-z-Test verwenden:

Benötigtes n pro Variante = (z_α/2 + z_β)² × [p1(1-p1) + p2(1-p2)] / (p1 - p2)²

Wobei:
- p1 = Basis-Rate
- p2 = Basis-Rate × (1 + MDE)
- z_α/2 = 1,96 (95% Signifikanz)
- z_β = 0,842 (80% Teststärke)

Ausgabe:
- Benötigte Conversions pro Variante: [N]
- Benötigte Besucher pro Variante (bei aktueller Conversion-Rate): [N]
- Erwartete Testdauer bei [aktuellem Traffic] pro Tag: [X Tage / Wochen]
- Warnung bei Dauer > 8 Wochen (saisonale Effekte verfälschen Ergebnisse)
- Warnung bei Conversions pro Variante < 100 (Test ist unterstärkt — MDE erhöhen oder warten)

Die Zahlen für meinen Test anzeigen.
```

### Pre-Launch-Checkliste

```
Pre-Launch-Check meines A/B-Tests vor dem Start durchführen.

Testname: [Name]
Tool: [Optimizely / VWO / LaunchDarkly / GrowthBook / custom]
Hypothese: [aus dem Hypothesen-Framework oben]
Benötigte Stichprobengröße: [N pro Variante]
Erwarteter Traffic pro Tag: [N Besucher]
Erwartete Testdauer: [X Tage]

Pre-Launch-Checkliste:

TRACKING
□ Primärmetrik wird korrekt erfasst (Event feuert bei Conversion, nicht bei Seitenaufruf)
□ Sekundär-/Absicherungsmetriken werden erfasst (Umsatz, Sitzungsdauer, Fehlerrate)
□ Test-Zuweisungs-Event wird erfasst (um in Analytics nach Variante zu segmentieren)
□ Keine bestehenden Funnel-Brüche oder Bugs in der Kontrolle — kaputte Baseline testen = ungültige Ergebnisse
□ QA in Staging: Variante wird korrekt in Browsern + Mobilgeräten angezeigt

SETUP
□ Traffic-Split bestätigt: [50/50 oder X/Y — Split dokumentieren]
□ Targeting-Regeln dokumentiert: [wer eingeschlossen / ausgeschlossen ist]
□ Gegenseitiger Ausschluss: kollidiert dieser Test mit einem anderen laufenden Test?
□ Holdback falls nötig: wenn Test den Umsatz wesentlich beeinflusst, 5-10% aus allen Tests heraushalten

DAUER
□ Mindestens 2 vollständige Geschäftszyklen laufen (mindestens 2 Wochen — niemals bei erster Signifikanz stoppen)
□ Nicht täglich reinschauen und früh stoppen — das erhöht die falsch-positiv-Rate
□ Hartes Stopp-Datum setzen: [Datum] — ohne dokumentierten Grund nicht verlängern

RISIKO
□ Kann die Variante sofort zurückgerollt werden, wenn eine Absicherungsmetrik abstürzt?
□ Gibt es ein Neuheitseffekt-Risiko? (Neue UI = kurzfristiger Uplift, der nicht anhält)
□ Interagiert dieser Test mit einem anderen Test? Testmatrix abbilden.

Abhaken wenn alle Punkte geprüft.
```

### Ergebnisanalyse

```
Meine A/B-Testergebnisse analysieren und sagen, was zu tun ist.

Test: [Name]
Dauer: [X Tage]
Tool: [Analyse-Plattform]

Ergebnisse:
Kontrolle (A):
- Besucher: [N]
- Conversions: [N]
- Conversion-Rate: [X%]
- Umsatz pro Besucher (falls zutreffend): $[X]

Variante (B):
- Besucher: [N]
- Conversions: [N]
- Conversion-Rate: [X%]
- Umsatz pro Besucher (falls zutreffend): $[X]

Relativer Uplift: [(B-A)/A × 100]%
p-Wert: [X] (vom Test-Tool)
Konfidenz: [X%]
Statistische Signifikanz erreicht: [Ja / Nein]

Analyse:

ENTSCHEIDUNGS-FRAMEWORK:
1. Ist das Ergebnis statistisch signifikant bei 95%?
   JA → zur Geschäftsauswirkungsanalyse übergehen
   NEIN → prüfen: wurde die benötigte Stichprobengröße erreicht?
     - Wenn ja + keine Signifikanz: der Effekt ist kleiner als MDE → wahrscheinlich nicht deploywürdig
     - Wenn nein: Test verlängern oder akzeptieren, dass ein so kleiner Effekt nicht erkennbar ist

2. Ist der Uplift in Dollar-Beträgen bedeutsam?
   Jährliche Umsatzauswirkung dieses Uplifts = [Berechnung]:
   Uplift × tägliche Conversions × durchschnittlicher Bestellwert × 365 = $[X]/Jahr
   Wenn Jahresauswirkung < Implementierungskosten, überdenken.

3. Haben Absicherungsmetriken sich verschlechtert?
   Umsatz pro Besucher, Sitzungsdauer, Fehlerrate, Support-Anfragen?
   Wenn ja: NICHT deployen, auch wenn Primärmetrik positiv ist. Ein Uplift bei Anmeldungen, der den Support verdoppelt, ist kein Gewinn.

4. Segmentanalyse — gilt der Uplift für:
   - Mobil vs. Desktop?
   - Neue vs. wiederkehrende Nutzer?
   - Traffic-Quelle (bezahlt vs. organisch)?
   - Geografie?
   Wesentliche Interaktionseffekte deuten darauf hin, dass die Variante für ein Segment, nicht universell funktioniert.

ENTSCHEIDUNG: [DEPLOYEN / VERWERFEN / SEGMENT-DEPLOYEN / ITERIEREN]
Begründung: [spezifisch, basierend auf den Zahlen]
Nächstes Experiment: [was als nächstes basierend auf diesen Ergebnissen testen]
```

### Experiment-Protokoll-Vorlage

```
Dieses Experiment für das Team-Experiment-Protokoll dokumentieren.

Experiment: [Name — suchbar, beschreibend]
Datum: [Start] → [Ende]
Verantwortlich: [Name]
Team: [Wachstum / Produkt / Marketing]
Status: [läuft / abgeschlossen]

## Hypothese
[Aus dem Hypothesen-Framework]

## Setup
- Tool: [Optimizely / VWO / custom]
- Traffic-Split: [50/50]
- Zielgruppe: [alle Nutzer / neue Nutzer / mobil / usw.]
- Targeting: [URL, Segment, Feature-Flag]

## Ergebnisse
| Metrik | Kontrolle | Variante | Uplift | Signifikanz |
|---|---|---|---|---|
| Primär: [Metrik] | [X%] | [X%] | [+X%] | [95%] |
| Absicherung: [Metrik] | [X] | [X] | [+/-X%] | [N/A] |
| Absicherung: [Metrik] | [X] | [X] | [+/-X%] | [N/A] |

Stichprobe: [N] pro Variante | Dauer: [X Tage] | p-Wert: [X]

## Entscheidung
[DEPLOYED / VERWORFEN / ITERIERT]
Begründung: [warum]

## Erkenntnis
[Was uns das über das Nutzerverhalten sagt — nicht nur „Variante hat gewonnen"]
[Was als nächstes testen]

## Jahresauswirkung (falls deployed)
$[X] inkrementeller Umsatz oder [X%] Metrikverbesserung
```

### Experiment-Priorisierung

```
Mein Experiment-Backlog anhand von ICE-Bewertung priorisieren.

Meine Experiment-Ideen:
1. [Idee 1]
2. [Idee 2]
3. [Idee 3]
[beliebig viele hinzufügen]

Jede anhand von ICE bewerten:

IMPACT (1-10): Wenn das funktioniert mit dem erwarteten Uplift, wie groß ist die Umsatz-/Metrik-Auswirkung?
- 10: >100.000 $ Jahresauswirkung oder >20% Uplift bei einer Schlüsselmetrik
- 7: 20.000-100.000 $ oder 10-20% Uplift
- 4: 5.000-20.000 $ oder 5-10% Uplift
- 1: <5.000 $ oder <5% Uplift

CONFIDENCE (1-10): Wie sicher sind wir, dass das funktioniert?
- 10: Frühere Daten, Nutzerforschung und bewährte Beispiele woanders deuten alle darauf hin
- 7: Starkes qualitatives Signal oder ähnlicher Test hat in angrenzenden Bereichen funktioniert
- 4: Theoriebasiert, kein direkter Beweis
- 1: Reines Bauchgefühl

EASE (1-10): Wie schnell können wir diesen Test durchführen?
- 10: Nur Textänderung, kein Dev nötig, in 1 Tag live
- 7: Kleine Frontend-Änderung, 1-2 Tage Dev
- 4: Backend- oder Logikänderung, 1 Woche Dev
- 1: Architekturänderung, 4+ Wochen Dev

ICE-Score = (Impact + Confidence + Ease) / 3

Alle Ideen nach ICE-Score ranken. Alle markieren, die >2 Wochen Engineering benötigen, als Hoher Aufwand — prüfen, ob sie stattdessen in den Produkt-Backlog gehören.

Gerankten Experimentkalender für die nächsten 4 Wochen erstellen.
```

## Beispiel

**Nutzer:** Ich möchte testen, ob wir den CTA unserer Preisseite von „Start Free Trial" auf „See Pricing" ändern, weil ich denke, dass Nutzer die Zahlen sehen wollen, bevor sie sich verpflichten. Baseline-Conversion ist 3,2%. Wie groß muss die Stichprobe sein und wie richte ich das ein?

**Ausgabe von Claude:**

**Hypothese:**
Wir glauben, dass die Änderung des primären CTA von „Start Free Trial" zu „See Pricing"
für alle Besucher auf /pricing
zu einer höheren Klickrate zur Checkout- oder Planauswahl-Seite führen wird,
weil Nutzer in einer Preisvergleichs-Denkweise die Zahlen sehen möchten, bevor sie sich auf eine „Trial"-Formulierung einlassen.
Wir wissen, dass das wahr ist, wenn die CTA-Klickrate um ≥ 15% (relativ) steigt
mit 95% statistischer Konfidenz und 80% Teststärke.

**Stichprobengrößenberechnung:**
- Baseline: 3,2% CTA-Klickrate
- MDE: 15% relativ = 3,68% Zielrate
- Benötigt: **2.843 Besucher pro Variante** (5.686 gesamt)
- Bei 500 Besuchern/Tag auf der Preisseite: **12-tägiger Test**
- Bei 200 Besuchern/Tag: **29-tägiger Test** — durchführen, es lohnt sich

**Pre-Launch:**
- CTA-Klick-Event in Analytics bestätigen (nicht Seitenaufruf)
- Verfolgen: Seitenaufrufe der Planauswahl (Absicherung — sollte nicht sinken)
- Verfolgen: Trial-Anmeldungen (die eigentliche nachgelagerte Metrik — nach Variante in Analytics segmentieren)
- Nicht früh stoppen — auch wenn in Woche 1 Signifikanz erreicht wird, 2 volle Wochen laufen lassen

**Worauf achten:**
Wenn „See Pricing" bei Klicks gewinnt, aber Trial-Anmeldungen nicht steigen, sind Nutzer neugieriger, aber nicht stärker committet. Das ist ein Problem mit der Preisklarheit, kein CTA-Problem — nächster Test ist die Preisseite selbst.

---
