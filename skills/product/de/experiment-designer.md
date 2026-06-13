---
name: experiment-designer
description: "A/B-Test- und Experimentdesign: Hypothesenschreibung, Stichprobengrößenberechnung, statistische Signifikanz, Experiment-Tracking, Vermeidung häufiger Fallstricke und Ergebnisinterpretation"
---

# Experimentdesigner-Fähigkeit

## Wann zu aktivieren
- Entwerfen eines A/B-Tests oder multivariaten Experiments
- Berechnung der erforderlichen Stichprobengröße vor Durchführung eines Tests
- Interpretation von Experimentergebnissen (ist das signifikant? sollen wir es versenden?)
- Einrichtung eines Experimentierungsframeworks für ein Team
- Vermeidung häufiger Testfehler (Peeking, Neuheitseffekt, mehrfache Vergleiche)
- Entscheidung, ob ein Experiment durchgeführt oder einfach versendet werden soll

## Wann NICHT verwenden
- Wenn Sie < 1.000 Benutzer/Woche haben — nicht genug Traffic für aussagekräftige Tests; verwenden Sie stattdessen qualitativ
- Wenn die Änderung ein Bugfix oder eindeutig gut ist — testen Sie nicht das Offensichtliche, versenden Sie es
- Wenn Sie Ergebnisse in < 1 Woche benötigen — unterversorgte Tests sind schlimmer als keine Tests
- Analytics-Tool-Setup — verwenden Sie die Fähigkeit analytics-tracking

## Anleitung

### Hypothesen- und Experimentdesign

```
Entwerfen Sie einen A/B-Test für [Änderung].

Was wir testen möchten: [beschreiben Sie die Änderung — Kopie, UI, Flow, Funktion]
Warum wir denken, dass es funktionieren wird: [der Einblick oder die Daten hinter dieser Idee]
Primäre Metrik: [die eine Metrik, die wir optimieren]
Sekundäre Metriken: [Metriken, auf die Regressionen zu beachten sind]
Verfügbarer Traffic: [Sessions/Tag oder Benutzer/Woche auf dieser Seite/Fluss]

Experimentdesign:

1. Hypothese (schreiben Sie sie, bevor Sie Code berühren):
   Format: „Wir glauben, dass [Änderung] [Metrik] für [Benutzersegment] verbessern wird, weil [Grund basierend auf Einblick/Daten]."
   
   Schlecht: „Wir glauben, dass eine größere CTA-Schaltfläche die Konversionen erhöht."
   Gut: „Wir glauben, dass die Änderung des CTA-Textes von 'Los geht's' zu 'Kostenlose Testversion starten' die Testanmeldungen für Erstbesucher erhöht, da unsere Interviewdaten zeigen, dass Benutzer nicht realisieren, dass die Testversion kostenlos ist."

2. Varianten:
   - Kontrolle (A): aktueller Status — unverändert
   - Variante B: die Änderung
   - (Optional) Variante C: eine kühnere Version der Änderung
   
   Regel: Testen Sie eine Sache pro Experiment. Zwei Änderungen = Sie wissen nicht, welche das Ergebnis angetrieben hat.

3. Traffic-Aufteilung:
   - 2 Varianten: 50/50 (maximale statistische Aussagekraft)
   - 3 Varianten: 33/33/33 — erfordert mehr Traffic oder längere Tests
   - Ramp-up: beginnen Sie bei 5-10% → bestätigen Sie keine Bugs → vollständige Exposition

4. Primäre Metrik:
   [Name] — gemessen als: [Definition]
   Mindesterkennbarer Effekt: [X% relative Verbesserung, die wir als bedeutsam erachten]
   
5. Erfolgskriterien (entscheiden Sie vor dem Start — keine Zieländerung):
   Gewinnen: p-Wert < 0,05 UND MDE erreicht UND keine signifikante Regression in sekundären Metriken
   Früh anrufen: nur wenn eindeutig schädlich — NICHT bei frühem erfolgreichen Ergebnis stoppen

Generieren Sie das vollständige Experiment-Brief für meinen Test.
```

### Stichprobengrößenrechner

```
Berechnen Sie die erforderliche Stichprobengröße für [Experiment].

Primärer Metriktyp: [Konversionsrate / Durchschnittswert / Anteil]
Aktuelle Baseline: [X% Konversionsrate / $X Durchschnitt / X% der Benutzer]
Mindesterkennbarer Effekt (MDE): [X% relative Änderung — der kleinste Sieg, für den es sich lohnt zu versenden]
Statistische Aussagekraft: [80% Standard / 90% für kritische Experimente]
Signifikanzniveau: [α = 0,05 Standard / α = 0,01 für hohe Einsätze]
Anzahl der Varianten: [2 / 3 / 4]

Stichprobengrößenformel (für Anteile):
n = 2 × (z_α/2 + z_β)² × p(1-p) / δ²

wobei:
- z_α/2 = 1,96 (für α=0,05, zweiseitig)
- z_β = 0,84 (für 80% Aussagekraft)
- p = Baseline-Konversionsrate
- δ = absoluter Unterschied (Baseline × MDE)

Für Ihre Eingaben:
Baseline: [X%]
MDE: [X% relativ] = [Y% absolut]
Erforderlich n pro Variante: [berechnet]
Gesamtstichprobe: [n × Anzahl der Varianten]

Bei Ihrem Traffic-Niveau ([X Besucher/Tag]):
Benötigte Test-Dauer: [X Tage]

Warnsignale:
- Wenn Dauer > 4 Wochen: Test umgestalten (MDE erhöhen oder auf mehr Traffic warten)
- Wenn MDE < 1%: wahrscheinlich nicht wert zu testen — schwer, Signifikanz zu erreichen
- Wenn MDE > 30%: sehr optimistisch — verifizieren Sie, dass der Business Case real ist

Berechnen Sie für meine spezifischen Eingaben und bestätigen Sie, dass die Dauer machbar ist.
```

### Häufige Experimentfehler

```
Überprüfen Sie mein Experimentdesign und kennzeichnen Sie potenzielle Probleme.

Experimentbeschreibung: [beschreiben Sie den Test, den Sie planen]
Geplante Dauer: [X Tage]
Traffic-Quelle: [gesamter Traffic / Segment / spezifische Seite]

Häufige Fehler zu prüfen:

□ SPIONIEREN: Einen Test früh stoppen, weil die Ergebnisse gut aussehen
  Risiko: Falscher positiver Anstieg skyrockets — Gewinner-Variante ist oft ein Zufall
  Fix: Entscheiden Sie die Laufdauer vor dem Start und halten Sie sie ein (oder verwenden Sie Sequential Testing)

□ MEHRFACHE VERGLEICHE: Testen von 5 Varianten = 5 Chancen, einen falschen positiven Wert zu finden
  Risiko: bei α=0,05 laufen 5 Tests → erwarteter 0,25 falscher positiver pro Batch
  Fix: Verwenden Sie Bonferroni-Korrektur (α/n) oder begrenzen Sie auf 2-3 Varianten

□ NEUHEITSEFFEKT: Erstbenutzer reagieren auf alles Neue
  Risiko: anfängliche Steigerung verschwindet nach der ersten Exposition
  Fix: Test für vollständige 2+ Geschäftszyklen durchführen (normalerweise mindestens 2 Wochen)

□ STICHPROBENVERHALB-MISMATCH: Ungleicher Traffic zu Varianten
  Risiko: Randomisierung ist unterbrochen — Ergebnisse sind ungültig
  Fix: Zeichnen Sie kumulatives Zuweisungsverhältnis täglich auf; Warnung, wenn > 5% von Ziel

□ NETZWERKEFFEKTE: Benutzer interagieren miteinander
  Risiko: Kontroll- und Variantengruppen sind nicht unabhängig
  Fix: Cluster-Randomisierung nach Team/Konto, nicht nach einzelnem Benutzer

□ ÜBERLEBENSVORGÄNGE-BIAS: Nur Messung engagierter Benutzer
  Risiko: Auftrieb sieht großartig aus, aber nur für Benutzer, die sowieso konvertiert hätten
  Fix: Alle berechtigten Benutzer einbeziehen, nicht nur diejenigen, die sich mit der Variante „engagiert" haben

□ INSTRUMENTIERUNGS-LAG: Metrik-Berechnung hinter dem Experiment hinterherhinken
  Risiko: frühe Ergebnisse zeigen aufgeblasene oder deflationierte Zahlen
  Fix: Fügen Sie 24-48 Stunden hinzu, bevor Sie Ergebnisse lesen; verifizieren Sie das Ereignisschießen im Debug-Modus

Kennzeichnen Sie, welche auf mein geplantes Experiment zutreffen + spezifische Fixes.
```

### Ergebnisinterpretation

```
Interpretieren Sie meine Experimentergebnisse.

Experiment: [beschreiben Sie den Test]
Dauer: [X Tage]
Stichprobengröße pro Variante: [X Kontroll / X Variante]
Primäre Metrik:
  Kontrolle: [X%]
  Variante: [X%]
  Relativer Auftrieb: [+X%]
  P-Wert: [X]
  Konfidenzintervall: [X% bis X%]
Sekundäre Metriken: [Liste und ob sie sich verschoben haben]

Interpretations-Framework:

Statistisch signifikant + praktisch signifikant: VERSENDEN
  Beide p < 0,05 UND relativer Auftrieb ≥ MDE → klarer Sieg, versenden

Statistisch signifikant + NICHT praktisch signifikant: NICHT VERSENDEN
  p < 0,05 aber Auftrieb 0,3% bei 2% Baseline → real aber nicht wert der Unterhaltskosten

NICHT signifikant + direktional positiv: VERLÄNGERN ODER UMGESTALTEN
  p = 0,12 mit positivem Trend → unterversorgt; verlängern wenn Kosten niedrig; umgestalten wenn teuer

NICHT signifikant + flach: WEITERMACHEN
  p > 0,5, Effekt nahe Null → die Idee hat nicht funktioniert; schnell scheitern und nächste Hypothese versuchen

Signifikante Regression in sekundärer Metrik: STOPPEN, NICHT VERSENDEN
  Auch wenn primäre Metrik gewonnen, überwiegt Regression in Umsatz oder Bindung

Für meine Ergebnisse:
1. Statistische Schlussfolgerung: [signifikant / nicht signifikant / Grenzfall]
2. Praktische Signifikanz: [bedeutsam / nicht bedeutsam]
3. Bewertung sekundärer Metriken: [irgendwelche Regressionen?]
4. Entscheidung: [versenden / nicht versenden / verlängern / umgestalten]
5. Was wir gelernt haben (auch wenn wir nicht versenden): [der Einblick, der den nächsten Test besser macht]
```

## Beispiel

**Benutzer:** Wir testen einen neuen Checkout-Flow. Baseline-Konversion beträgt 3,2%. Wir möchten eine 15%ige relative Verbesserung (auf 3,68%) erkennen. Wir erhalten 500 Besucher/Tag zum Checkout. Wie lange sollten wir laufen?

**Claudios Berechnung:**

**Stichprobengrößenberechnung:**
- Baseline: 3,2%
- Ziel: 3,68% (15% relativer Auftrieb = 0,48% absolut)
- α = 0,05 (zweiseitig), Aussagekraft = 80%
- Erforderlich n pro Variante ≈ **4.950 Benutzer**
- Gesamtstichprobe benötigt: **9.900 Benutzer** (beide Varianten)

**Bei 500 Besuchern/Tag:**
- 9.900 ÷ 500 = **~20 Tage Minimum**

**Meine Empfehlung: Laufen Sie für 28 Tage (4 volle Wochen)**

Warum 4 Wochen, nicht 20 Tage:
1. Erfasst vollständige wöchentliche Saisonalität (Checkout-Verhalten unterscheidet sich Wochentag vs. Wochenende)
2. Puffer für Neuheitseffekt — neue Checkout-UI kann in Woche 1 künstlich gut aussehen
3. Ermöglicht 4 vollständige Geschäftszyklen (Montag-Sonntag)

**Vor dem Start:**
- Bestätigen Sie, dass Ihr Analytics-Tool die Ereignisse „Checkout besucht" und „Kauf abgeschlossen" separat und korrekt aufzeichnet
- Legen Sie jetzt Ihre Erfolgskriterien fest: „Wir versenden, wenn p < 0,05 UND Auftrieb ≥ 15% UND keine Regression beim durchschnittlichen Bestellwert"
- Schauen Sie sich die Ergebnisse nicht an, bis Tag 28

**Eine Vorsichtsmaßnahme:** Wenn Ihre 500-Besucher-/Tag-Zahl Mobil- und Desktop-Benutzer umfasst, segmentieren Sie die Ergebnisse nach Gerät. Checkout-Flows verhalten sich auf Mobil- vs. Desktop-Geräten sehr unterschiedlich — ein gewinnender Gesamtergebnis könnte eine Regression auf einer Plattform maskieren.

---
