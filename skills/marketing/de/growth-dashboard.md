---
name: growth-dashboard
description: "Wöchentliches Wachstums-Dashboard: Akquisitions-, Aktivierungs-, Bindungs-, Umsatz- und Empfehlungsmetriken mit Trendanalyse und Kommentar für Wachstumsteams"
---

# Skill: Wachstums-Dashboard

## Wann aktivieren
- Wöchentlichen Wachstumsbericht für die Führungsebene oder das Team erstellen
- AARRR-Metriken über Akquisition, Aktivierung, Bindung, Umsatz und Empfehlung zusammenführen
- Diagnostizieren, welcher Wachstumshebel diese Woche im Vergleich zur letzten Woche defekt ist
- Den narrativen Kommentar zu Metriken verfassen — nicht nur die Zahlen
- Ein neues Wachstums-Dashboard in Looker Studio, Metabase oder Notion entwerfen
- Experiment-Portfolio-Gesundheit neben Business-Metriken verfolgen

## Wann NICHT verwenden
- Tiefgehende Analyse einer einzelnen Metrik — das ist ein Synthese-Skill, kein Debugging-Skill
- Analytics-Infrastruktur aufsetzen — `/analytics-tracking` verwenden
- Einzelne Experimente entwerfen — `/experiment-tracker` verwenden
- Finanzmodellierung für Investoren — den Financial-Model-Workflow verwenden

## Anweisungen

### Wöchentlicher Wachstums-Dashboard-Prompt

```
Mein wöchentliches Wachstums-Dashboard für die Woche vom [DATUM] erstellen.

Produkt: [beschreiben — SaaS / Marketplace / Mobile App / E-Commerce]
Phase: [vor PMF / nach PMF / Skalierung]
North-Star-Metrik: [die eine Zahl, die die Unternehmensgesundheit erfasst]

Daten dieser Woche:

AKQUISITION
- Neue Besucher: [N] (vs. [N] letzte Woche, [N] gleicher Zeitraum letzten Monat)
- Neue Anmeldungen / Leads: [N] (vs. [N] LW)
- Anmeldungsrate (Besucher → Anmeldungen): [X%]
- CAC nach Kanal diese Woche: [Google: $X | Meta: $X | Organisch: $X | Empfehlung: $X]
- Bezahlausgaben: $[X] (vs. $[X] LW)

AKTIVIERUNG
- Neue Nutzer, die Aktivierungsevent abgeschlossen haben: [N] / [N] neue Anmeldungen = [X%] Aktivierungsrate
- Aktivierungsdefinition: [was als aktiviert gilt — z. B. „erstes Projekt erstellt"]
- Zeit bis zur Aktivierung (Median): [X Stunden/Tage]

BINDUNG
- DAU / WAU / MAU: [N] / [N] / [N]
- DAU/MAU-Verhältnis (Klebrigkeit): [X%]
- 7-Tage-Bindung (der Kohorten von vor 7 Tagen): [X%]
- 30-Tage-Bindung: [X%]
- Abwanderung diese Woche: [N] Kunden / $[X] MRR

UMSATZ
- MRR: $[X] (vs. $[X] letzte Woche)
- Neuer MRR: $[X]
- Expansions-MRR: $[X]
- Abgewanderter MRR: $[X]
- Netto-Neu-MRR: $[X]
- LTV:CAC-Verhältnis: [X:1]
- Amortisationszeitraum: [X Monate]

EMPFEHLUNG
- Empfehlungsanmeldungen diese Woche: [N]
- Empfehlungsrate: [Empfehlungsanmeldungen / Gesamtanmeldungen]: [X%]
- NPS (falls diese Woche gemessen): [X]

LAUFENDE EXPERIMENTE
[Aktive A/B-Tests auflisten, Laufzeit in Tagen, aktueller Uplift vs. Kontrolle]

---

Wöchentliches Wachstums-Dashboard erstellen mit:
1. Headline-Zahlen (diese Woche vs. letzte Woche vs. 4-Wochen-Durchschnitt)
2. Ampelstatus für jede Metrik (grün / gelb / rot vs. Ziele)
3. Top 3 Beobachtungen — was sich wesentlich verändert hat und warum
4. Eine Hypothese für jeden negativen Trend
5. Empfohlene Maßnahmen für nächste Woche
6. Experiment-Portfolio: welche Tests abschließen, welche verlängern
```

### AARRR-Framework-Builder

```
Vollständiges AARRR-Metriken-Framework für [Produkt] entwerfen.

Produktphase: [vor Launch / früh / Wachstum / Skalierung]
Geschäftsmodell: [Abonnement / transaktional / nutzungsbasiert / Freemium]
Primärkanal: [Content / bezahlt / PLG / Sales]

Metriken für jede Phase erstellen:

AKQUISITION — Wie finden uns Menschen?
Primärmetriken:
- Gesamte neue Besucher / Leads / Anmeldungen nach Kanal
- CAC nach Kanal (Ausgaben / neue Kunden aus diesem Kanal)
- Organisch vs. bezahlt Aufteilung
- Kanaleffizienz-Score: [Conversion-Rate × Durchschnitt-LTV / CAC]

Benchmarks:
- Guter CAC-Amortisationszeitraum: < 12 Monate für SMB, < 18 Monate für Mid-Market
- Organisch sollte im Zeitverlauf als % des Gesamts wachsen (nicht flach oder schrumpfend)

AKTIVIERUNG — Erhalten neue Nutzer Mehrwert?
Primärmetriken:
- Aktivierungsrate: % der Anmeldungen, die [Aha-Moment-Event] abschließen
- Zeit bis zur Aktivierung (Median in Tagen)
- Aha-Moment-Abschluss nach Akquisitionskanal (organische Nutzer aktivieren anders als bezahlte)

Benchmarks:
- < 20% Aktivierungsrate: großes Onboarding-Problem
- 20-40%: Verbesserungsmöglichkeit
- 40-60%: gesund für komplexe Produkte
- > 60%: stark für einfache Tools

BINDUNG — Kommen Nutzer zurück?
Primärmetriken:
- D1 / D7 / D30-Bindung (% der Nutzer, die an diesem Tag zurückkehren)
- Wöchentliche / monatliche Kohorte-Bindungskurven
- DAU/MAU-Klebrigkeit-Verhältnis
- Feature-Adoptionstiefe (Nutzer, die 1 Feature vs. 3+ Features verwenden)

Benchmarks:
- D7-Bindung > 25%: tragfähig (B2C), > 40%: tragfähig (B2B SaaS)
- D30 > 15% (B2C), > 35% (B2B)
- DAU/MAU > 20%: engagiertes Produkt

UMSATZ — Monetarisieren wir effektiv?
Primärmetriken:
- MRR / ARR und Wachstumsrate (WoW, MoM)
- ARPU / ARPA (pro Nutzer / pro Account)
- LTV (durchschnittlicher Vertrag × Bruttomarge / Abwanderungsrate)
- LTV:CAC-Verhältnis
- Amortisationszeitraum
- Netto-Umsatz-Bindung (NRR): [Expansion - Abwanderung] / Anfangs-MRR

Benchmarks:
- LTV:CAC > 3:1: gesund
- Amortisationszeitraum < 12 Monate: gut, < 18 Monate: akzeptabel
- NRR > 100%: Expansion gleicht Abwanderung aus (Best-in-class > 120%)

EMPFEHLUNG — Erzählen Nutzer anderen davon?
Primärmetriken:
- Viraler Koeffizient: neue Nutzer pro bestehenden Nutzer pro Zeitraum
- Empfehlungsrate: % der Anmeldungen aus Empfehlungen
- NPS und Promoter-Prozentsatz
- Generierte Bewertungen / Fallstudien

Benchmarks:
- Viraler Koeffizient > 0,5: bedeutende Mundpropaganda
- > 1,0: Viralität (selten, oft kurzlebig)
- NPS > 40: promoter-dominierte Basis

Dashboard-Vorlage für [Produkt] mit allen 15 Kernmetriken, Zielen und Datenquellen erstellen.
```

### Generator für Wachstumsnarrativ

```
Wachstumskommentar für meinen wöchentlichen/monatlichen Bericht verfassen.

Zielgruppe: [CEO / Vorstand / Wachstumsteam / gesamtes Unternehmen]
Ton: [analytisch / Executive Summary / konversationell]

Performance dieser Periode:
- [Schlüsselmetrik]: [Ergebnis vs. Ziel — war es über/unter/auf Zielwert?]
- [Schlüsselmetrik]: [Ergebnis]
- [Schlüsselmetrik]: [Ergebnis]

Einzubettender Kontext:
- Welche externen Faktoren haben die Ergebnisse beeinflusst? [Saisonalität / Wettbewerberaktion / Makro]
- Welche internen Änderungen haben stattgefunden? [gestartete Kampagnen / Produktänderungen / Preisänderungen]
- Welche Experimente wurden abgeschlossen? [Ergebnisse]
- Was läuft gut? [1-2 Dinge, die funktionieren]
- Was ist das Risiko? [1 Sache, die besorgt]
- Fokus nächste Woche: [der eine Hebel, der gezogen wird]

200-300-Wort-Narrativ verfassen, das:
1. Mit der North-Star-Metrik-Bewegung führt — positiv oder negativ, klar benennen
2. Die Bewegung 1-2 spezifischen Ursachen zuschreibt (nicht vage — „der bezahlte CAC stieg um 18%, weil iOS-18-Änderungen die Meta-Signalqualität reduzierten")
3. Die eine Metrik identifiziert, die diese Woche am wichtigsten ist und warum
4. Eine konkrete Maßnahme angibt — nicht „wir werden beobachten" sondern „wir werden X bis Freitag tun"
5. Mit der Aussicht endet: Sind wir auf Kurs für den Monat?

Nicht schreiben: „Wir sahen gemischte Ergebnisse." Die Ergebnisse klar benennen.
```

### Kohorte-Umsatzanalyse

```
Meine Umsatz-Kohorten analysieren, um LTV und Amortisation zu verstehen.

Produkt: [Abonnement-SaaS / transaktional]
Kohorte-Definition: [Monat der ersten Zahlung]
Verfügbare Daten: [Monate Verlaufsdaten]

Kohorte-Tabellenformat:
Monat | Start-MRR | Monat 1 MRR | Monat 3 | Monat 6 | Monat 12 | LTV-Schätzung

Daten für jede Kohorte angeben: [CSV oder Tabelle einfügen]

Analysieren:
1. Bindung nach Kohorte — welche Kohorten binden am besten und warum?
   (Fragen: Was hat sich in Akquisition, Aktivierung oder Produkt rund um das Startdatum dieser Kohorte geändert?)

2. Expansionsumsatz — expandieren überlebende Kunden?
   NRR = (Anfangs-MRR + Expansion - Abwanderung - Kontraktion) / Anfangs-MRR
   NRR > 100%: jede Kohorte wird über die Zeit wertvoller (Best-in-class: 120-140%)

3. LTV-Berechnung:
   Durchschnittlicher monatlicher Umsatz pro Kunde: $[X]
   Durchschnittliche Kundenlebensdauer: 1 / monatliche Abwanderungsrate = [X Monate]
   LTV = Durchschnitt monatl. Umsatz × Durchschnitt Lebensdauer × Bruttomarge %
   LTV = $[X] × [X] × [X%] = $[X]

4. Amortisationszeitraum:
   CAC / (ARPU × Bruttomarge %) = [X Monate]
   Mit durchschnittlicher Kundenlebensdauer vergleichen — wenn Amortisation > Lebensdauer, ist man im Minus

5. Welcher Kanal produziert Kunden mit dem höchsten LTV?
   LTV nach Akquisitionskanal aufschlüsseln: [bezahlt / organisch / Empfehlung / Sales]
   Das zeigt, wo CAC-Investitionen verdoppelt werden sollten

Ausgabe: LTV-nach-Kohorte-Diagramm, Amortisationsanalyse und Kanal-LTV-Vergleichstabelle.
```

### Kanalaufteilungs-Optimierung

```
Meinen Marketing-Kanalmix für Wachstum optimieren.

Aktuelle Kanal-Performance:
| Kanal | Ausgaben | Neue Kunden | CAC | Durchschnitt-LTV | LTV:CAC | Amortisation |
|---|---|---|---|---|---|---|
| Google Ads | $[X] | [N] | $[X] | $[X] | [X:1] | [X Mo] |
| Meta Ads | $[X] | [N] | $[X] | $[X] | [X:1] | [X Mo] |
| Content/SEO | $[X] | [N] | $[X] | $[X] | [X:1] | [X Mo] |
| Empfehlung | $[X] | [N] | $[X] | $[X] | [X:1] | [X Mo] |
| Outbound Sales | $[X] | [N] | $[X] | $[X] | [X:1] | [X Mo] |

Gesamtbudget: $[X]/Monat
Wachstumsziel: [X neue Kunden/Monat oder $X neuer MRR]

Analyse:
1. Kanäle nach LTV:CAC ranken — mehr in Kanäle mit Verhältnis > 3:1 investieren
2. Gesättigte Kanäle identifizieren — wenn CAC MoM auf einem Kanal steigt, wird die Skalierungsgrenze erreicht
3. Unterinvestierte Kanäle identifizieren — Organisch/Empfehlung hat oft besten LTV, aber niedrigste Investition
4. Grenzökonomie: Bei 2-fachem Ausgaben auf [Kanal], was passiert mit dem CAC? (steigt typischerweise)
5. Mindestausgaben — manche Kanäle (z. B. SEO, Community) benötigen Schwelleninvestition für Ergebnisse

Budgetumverteilungsempfehlung:
- Erhöhen: [Kanal] — höchstes LTV:CAC, noch nicht gesättigt
- Beibehalten: [Kanal] — performt auf Ziel, stabiler CAC
- Reduzieren: [Kanal] — CAC steigt, LTV:CAC unter 2:1
- Experimentieren: [Kanal] — ungetestet, geringe Validierungskosten

Neue Budgetaufteilung: [Tabelle Vorher vs. Nachher]
Projizierte Auswirkung: [X mehr Kunden/Monat bei aktuellen Conversion-Raten]
```

## Beispiel

**Nutzer:** Hier sind unsere Wochenzahlen. Sag mir, was passiert und was zu tun ist. Anmeldungen: 342 (runter von 410 letzte Woche). Aktivierung: 31% (runter von 35%). MRR: $48.200 (rauf $1.100 von letzter Woche). Abwanderung: 2 Kunden ($400 MRR). Bezahlausgaben: $12.000.

**Dashboard-Ausgabe von Claude:**

**Woche vom [DATUM] — Wachstums-Dashboard**

**North Star: MRR $48.200 (+$1.100 WoW) — auf Kurs**

| Metrik | Diese Woche | Letzte Woche | Trend |
|---|---|---|---|
| Anmeldungen | 342 | 410 | -17% |
| Aktivierungsrate | 31% | 35% | -4pp |
| Neuer MRR | $1.500 | $1.800 | -17% |
| Abgewanderter MRR | $400 | $300 | +33% |
| Netto-Neu-MRR | $1.100 | $1.500 | -27% |
| CAC (gemischt) | $35 | $29 | +21% |

**Top 3 Beobachtungen:**

1. Anmeldungsvolumen um 17% gesunken — bei gleichbleibenden Ausgaben von $12.000 stieg der CAC von $29 auf $35. Das ist ein Problem mit der bezahlten Akquisitions-Signalqualität, kein Budgetproblem. Google Ads-Suchanfragen-Berichte und Meta-Anzeigenfrequenz prüfen — wahrscheinlich Zielgruppen-Erschöpfung.

2. Aktivierung um 4 Punkte gesunken — 342 Anmeldungen × 4pp-Rückgang = ~14 weniger Aktivierungen als erwartet. Zu unserer typischen Conversion von Aktivierung zu Bezahlung entspricht das ~$700 gefährdetem Umsatz in den nächsten 30 Tagen. Im Onboarding-Flow hat sich diese Woche etwas geändert oder ist kaputt — prüfen, ob UI-/Produktänderungen deployed wurden.

3. MRR ist noch positiv, weil die Expansion gehalten hat — upgraden de Kunden haben den Rückgang bei Neukunden ausgeglichen. Das ist fragil; Expansion kann das Unternehmen nicht tragen, wenn der Neukunden-Zufluss weiter sinkt.

**Maßnahmen für nächste Woche:**
- Bezahlt: Meta-Frequenzbericht ziehen; wenn Frequenz > 4 pro Person, neues Creative-Set launchen
- Aktivierung: Session-Recordings auf dem Anmelde- → Aha-Moment-Pfad ausführen (Hotjar/FullStory) — den Drop finden
- Abwanderung: Die 2 abgewanderten Kunden diese Woche anrufen; verstehen ob Produkt, Preis oder Wettbewerber

---
