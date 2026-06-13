---
name: 3-statement-model
description: "Dreier-Statement-Finanzmodell: Gewinn- und Verlustrechnung, Bilanz, Kassenflussrechnung — integrierte Modelle erstellen, Statements verlinken, Finanzen projizieren und Annahmen auf Belastung testen"
---

# 3-Statement Model Skill

## Wann aktivieren
- Aufbau eines Finanzmodells, das Gewinn- und Verlustrechnung, Bilanz und Kassenflussrechnung integriert
- Verknüpfung von Finanzaussagen, so dass Änderungen automatisch durchfließen
- Projektion von 3-5 Jahren Finanzen für Planung oder Fundraising
- Aufbau eines Betriebskapital- und Kassenflussmodells
- Belastungstests von Finanzannahmen (Bull/Bär/Basis-Szenarien)

## Wann NICHT verwenden
- DCF-Bewertung — verwenden Sie die dcf-model Skill (die darauf aufbaut)
- Finanzielle Zusammenfassung des Pitch Decks — verwenden Sie die pitch-deck Skill
- Monatliche Buchhaltung oder Abstimmung — verwenden Sie die quickbooks-workflow Skill
- Einfache Umsatzprognosen ohne vollständige Bilanz — ein einfacheres Modell genügt

## Anleitung

### Modellarchitektur

```
Erstellen Sie ein 3-Statement-Finanzmodell für [Unternehmen].

Unternehmenstyp: [SaaS / E-Commerce / Dienstleistungen / Herstellung]
Zeitraum: [3-Jahres- / 5-Jahres-Projektion]
Verfügbare historische Daten: [X Jahre aktuell oder keine]
Zweck: [Fundraising / Vorstandsberichterstattung / interne Planung / M&A]

Modellstruktur:

REGISTERKARTE 1 — Annahmen (alle Eingaben hier, nichts in Formeln hartcodiert):
  Umsatztreiber: [Wachstumsrate / Einheitsvolumen / Preis pro Einheit / Kundenzahl]
  Kostentreiber: [COGS%, Personalplan, Marketingausgaben als % des Umsatzes]
  Bilanzannahmen: [DSO, DPO, Bestandstage, Capex-Plan]
  Steuersatz: [X%]

REGISTERKARTE 2 — Gewinn- und Verlustrechnung (P&L):
  Umsatz
    Weniger: Kosten der verkauften Waren (COGS)
  = Bruttoeinkommen
    Weniger: Betriebsausgaben
      Verkauf & Marketing
      Forschung & Entwicklung
      Allgemein & Verwaltung
  = EBITDA
    Weniger: Abschreibung & Amortisation
  = EBIT (Betriebseinkommen)
    Weniger: Zinsaufwand
  = Einkommen vor Steuern (EBT)
    Weniger: Steuervorsorge
  = Netto-Einkommen

REGISTERKARTE 3 — Bilanz:
  Vermögenswerte:
    Kurzfristig: Bargeld, Debitorenkonten, Lagerbestand, Rechnungsabgrenzungsposten
    Langfristig: PP&E (Netto nach Abschreibung), Immaterielle Vermögenswerte
  Verbindlichkeiten:
    Kurzfristig: Kreditorenkonten, Aufgelaufene Kosten, Aufgeschobene Umsätze
    Langfristig: Langfristiges Darlehen
  Eigenkapital: Gewinnvortrag, eingezahltes Kapital
  CHECK: Vermögenswerte = Verbindlichkeiten + Eigenkapital (muss ausgeglichen sein)

REGISTERKARTE 4 — Kassenflussrechnung:
  Betriebstätigkeiten (indirekte Methode):
    Netto-Einkommen
    + Abschreibung & Amortisation
    ± Änderungen des Betriebskapitals (AR, AP, Lagerbestand)
  = Kassenfluss aus Betrieb
  
  Investitionstätigkeiten:
    - Kapitalausgaben
    ± Akquisitionen / Veräußerungen
  = Kassenfluss aus Investitionen
  
  Finanzierungstätigkeiten:
    + Kreditvergabe / Rückzahlung
    + Eigenkapitalausgabe
    - Dividenden
  = Kassenfluss aus Finanzierung
  
  Netto-Kassenvariationen = Betrieb + Investition + Finanzierung
  Endkasse = Anfangskasse + Netto-Variationen (muss der Bilanzliquidität entsprechen)

Erstellen Sie diese Modellstruktur mit meinen spezifischen Eingaben.
```

### Statement-Verknüpfungen

```
Erklären und richten Sie die kritischen Verknüpfungen im 3-Statement-Modell ein.

Die 3 Statements sind integriert — eine Änderung in einem propagiert durch alle drei.

Wichtige zu implementierende Verknüpfungen:

P&L → Bilanz:
  Netto-Einkommen → Gewinnvortrag (Eigenkapitalsektion)
  Formel: Gewinnvortrag (Ende) = Gewinnvortrag (Anfang) + Netto-Einkommen - Dividenden
  
  Abschreibung (P&L-Aufwand) → PP&E-Reduktion (Bilanz)
  Formel: PP&E (Ende) = PP&E (Anfang) + Capex - Abschreibung

P&L → Kassenfluss:
  Netto-Einkommen ist der Ausgangspunkt des Kassenflusses aus Betrieb
  Abschreibung zugerechnet (nicht-liquide Ausgabe)
  
Bilanz → Kassenfluss (Betriebskapitaländerungen):
  Wenn AR erhöht → verwendet Bargeld (Operating CF sinkt)
  Wenn AP erhöht → liefert Bargeld (Operating CF erhöht)
  Formel: ΔAR = AR(Ende) - AR(Anfang) → vom Operating CF subtrahieren
  Formel: ΔAP = AP(Ende) - AP(Anfang) → zum Operating CF addieren

Kassenfluss → Bilanz:
  Endkasse auf Kassenflussrechnung = Bargeld auf Bilanz
  Dies ist die « Zirkelprüfung » — wenn sie nicht übereinstimmen, ist das Modell fehlerhaft

Capex-Verknüpfung:
  Capex auf Kassenfluss → erhöht PP&E auf Bilanz
  Abschreibung auf P&L → reduziert PP&E auf Bilanz

Ausgleichsprüfungsformel:
  =WENN(Vermögenswerte = Verbindlichkeiten + Eigenkapital, « AUSGEWOGEN », « FEHLER PRÜFEN »)
  Fügen Sie dies zu jeder Jahresspalte hinzu — wenn es je einen Fehler zeigt, finden Sie den Bruch.

Implementieren Sie diese Verknüpfungen für mein Modell in [Excel / Google Sheets].
```

### Betriebskapitalmodell

```
Erstellen Sie den Betriebskapitalbereich für [Unternehmen].

Betriebskapital = Kurzfristige Vermögenswerte - Kurzfristige Verbindlichkeiten
Wichtige Treiber: DSO (Forderungen), DIO (Lagerbestand), DPO (Verbindlichkeiten)

Betriebskapitalmetriken:
DSO (Days Sales Outstanding):
  Formel: (Debitorenkonten / Umsatz) × 365
  Benchmark: SaaS: 30-45 Tage / B2B-Services: 45-60 Tage / Enterprise: 60-90 Tage
  Modell: AR = (DSO / 365) × Umsatz

DIO (Days Inventory Outstanding) — nur Herstellung/E-Commerce:
  Formel: (Lagerbestand / COGS) × 365
  Modell: Lagerbestand = (DIO / 365) × COGS

DPO (Days Payable Outstanding):
  Formel: (Kreditorenkonten / COGS) × 365
  Höherer DPO = bessere Kassakonvertierung (Lieferanten später zahlen)
  Modell: AP = (DPO / 365) × COGS

Cash Conversion Cycle = DSO + DIO - DPO
  Positiv = Bargeld in Operationen gebunden (benötigt Betriebskapitalfinanzierung)
  Negativ = Lieferanten finanzieren Ihre Betriebe (Amazon-Stil negativer CCC)

Betriebskapitaländerung (für Kassenflussrechnung):
  ΔBetriebskapital = BK(Ende) - BK(Anfang)
  Zunahme des BK = Kassenaustritt (verwendet Bargeld)
  Abnahme des BK = Kasseneingang (liefert Bargeld)

Erstellen Sie den Betriebskapitalplan mit meinen Brancheneingaben.
```

### Szenarioanalyse

```
Erstellen Sie Szenarioanalyse für [Finanzmodell].

Basis-Annahmen: [aktuelles Modell]
Zu modellierende Szenarien: [Bull / Base / Bär] oder [Aufwärts / Abwärts / Stress]

Szenario-Designprinzipien:
- Ändern Sie 1-3 Schlüsselannahmen pro Szenario (nicht alles)
- Ankern Sie an realen Ereignissen: « Bärenszenario = Rezession + 20% Druckbelastung »
- Jedes Szenario sollte intern konsistent sein (nicht nur Umsatz kürzen)

Für ein SaaS-Unternehmen:
Bullenszenario: 40% YoY Wachstum, 120% NRR, CAC bleibt gleich
  → Umsatz: $Xm (Bull) vs $Xm (Basis)

Basisszenario: 25% YoY Wachstum, 110% NRR
  → Umsatz: $Xm

Bärenszenario: 15% YoY Wachstum, 100% NRR, CAC erhöht 20%
  → Umsatz: $Xm, Kassenausgeglichenheit verzögert um X Monate

Stresstest: 0% Wachstum für 12 Monate (COVID-artiger Schock)
  → Wie viele Monate der Laufzeit zum aktuellen Burn?
  → Welche Personalabbau ist erforderlich, um 18 Monate zu überleben?

Modellstruktur mit INDEX/MATCH-Szenarioumschalter:
  Zelle A1: Szenariowahlschalter [Bull / Basis / Bär]
  Umsatzformel: =INDEX(Szenario-Tabelle, MATCH(A1, Szenario-Namen, 0), MATCH(Jahr, Jahr-Reihe, 0))
  
Oder verwenden Sie benannte Bereiche in separaten Szenario-Registerkarten und verlinken Sie zur Ausgabe-Registerkarte.

Erstellen Sie die Szenarioanalysstruktur für mein Modell.
```

## Beispiel

**Benutzer:** Ich baue ein 3-Jahres-Modell für ein B2B-SaaS-Unternehmen. Jahr 1 ARR: $800K, wächst mit 80% YoY. Bruttomarge: 72%. Brände: $200K/Monat. Wie richte ich die P&L ein?

**Claudes P&L-Struktur:**

```
                    Jahr 1      Jahr 2      Jahr 3
Umsatz (ARR)        $800K      $1,440K     $2,592K     [+80% pro Jahr]
  MRR Durchschnitt  $667K      $1,200K     $2,160K     [ARR ÷ 12, vereinfacht]

Umsatz              $800K      $1,440K     $2,592K

COGS
  Infrastruktur     $96K       $158K       $259K       [12% des Umsatzes]
  Kundenbetreuung   $128K      $202K       $311K       [16% des Umsatzes]
Total COGS          $224K      $360K       $570K       [28% des Umsatzes]

Bruttoeinkommen     $576K      $1,080K     $2,022K     [72% Bruttomarge]

OpEx
  Verkauf & Mktg    $600K      $900K       $1,200K     [sinkend als % des Umsatzes]
  R&D               $480K      $600K       $720K       [personalbasiert]
  G&A               $240K      $288K       $346K       [30% Wachstum, langsamer]
Total OpEx          $1,320K    $1,788K     $2,266K

EBITDA              ($744K)    ($708K)     ($244K)     [nähert sich der Gewinnschwelle Jahr 3]

Implizite monatliche Verbrennung: $62K/Monat (Jahr 1), $59K/Monat (Jahr 2), $20K/Monat (Jahr 3)
Kassenerschöpfung bei aktuellem Burn: [basierend auf aktuellem Kassenstand berechnen]

Wichtige Beobachtungen:
- Sie erreichen EBITDA-Gewinnschwelle zwischen Jahr 3 und 4 bei diesen Wachstumsraten
- Verkauf & Marketing-Ausgaben sind Ihr größter Hebel — modellieren Sie sowohl 50% als auch 75% der Umsatzszenarios
- Build Headcount Tab → steht R&D und G&A genauer, als % des Umsatzes
```

---
