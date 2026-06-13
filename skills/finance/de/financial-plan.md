---
name: financial-plan
description: "Vermögensplanungsfinanzen: Cashflow-Analyse, Rentenprognosen, Bildungsfinanzierung, Nachlasscheckliste — für Einzelpersonen und Familien"
---

# Finanzplanungskompetenz

## Wann zu aktivieren
- Aufbau eines umfassenden Finanzplans für einen Kunden oder sich selbst
- Durchführung einer Rentensparprojekt (wie viel ist genug?)
- Modellierung der Bildungsfinanzierung (529-Pläne, Zielbeträge)
- Überprüfung von Versicherungslücken
- Erstellung einer Nachlassplanungs-Checkliste
- Stresstest eines Finanzplans gegen Markteinbrüche oder Jobverlust

## Wann NICHT zu verwenden
- Spezifische Anlageempfehlungen — erfordert einen lizenzierten Finanzberater
- Steuererklärung oder Steuerberatung — konsultieren Sie einen CPA oder Steueranwalt
- Rechtliche Dokumente (Testamente, Trusts) — erfordert einen Nachlassanwalt

## ⚠️ Wichtig

Finanzplanungsprognosen basieren auf Annahmen über Renditen, Inflation und Lebensereignisse. Alle Prognosen sind mit materieller Unsicherheit behaftet. `[ÜBERPRÜFEN]` Sie alle Ausgaben mit einem lizenzierten Finanzplaner. Claude hilft bei der Strukturierung der Analyse — er gibt keine geregelten Finanzberatung.

## Anweisungen

### Schritt 1 — Finanzielle Momentaufnahme

```
Finanzielle Momentaufnahme für:

Aktuelle Situation:
- Alter: [X], Zielrenteneintrittsalter: [X]
- Aktuelles Einkommen: [X] $/Jahr brutto, [X] $/Jahr Netto
- Partnereinkommen (falls zutreffend): [X]
- Aktuelle Ersparnisse:
  - 401(k)/IRA: [X]
  - Steuerpflichtiges Maklerkonto: [X]
  - Bargeld/Notfallfonds: [X]
  - Sonstiges: [X]
- Monatliche Ausgaben: [X] (oder listen Sie die wichtigsten Kategorien auf)
- Monatliche Sparquote: [X]
- Aktuelle Schulden: Hypothek [X], Studentendarlehen [X], sonstige [X]
- Eigenheim-Eigenkapital: [X]

Ziele:
- Ruhestand mit [X] Jahren
- Finanzierung des Hochschulabschlusses der Kinder: [X] Kinder, Alter [X, X]
- Größere Anschaffungen: [auflisten]
- Sonstige Ziele: [beschreiben]
```

### Schritt 2 — Rentenprognose

```
Ruhestands-Bereitschaft prognostizieren.

Eingaben:
- Aktuelles Alter: [X], Renteneintrittsalter: [X] = [X] Jahre bis zur Rente
- Aktuelle Renteneinsparungen: [X]
- Monatliche Beiträge: [X]
- Erwartete jährliche Rendite: [X]% (konservativ 6-7% für langfristiges Aktienvermögen verwenden)
- Erwartete Inflation: 3%
- Geschätzte Sozialversicherung bei Renteneintritt: [X]$/Monat (siehe SSA.gov)
- Erwartete Renteneinkommen: [X]$/Monat in heutigen Dollar

Prognose:
1. Zukunftswert der aktuellen Ersparnisse bei Renteneintritt
2. Zukunftswert der laufenden Beiträge
3. Gesamtrentenvermögen bei [Renteneintrittsalter]
4. Nachhaltige Abhebungsquote (4%-Regel: Vermögen × 4% = Jahreseinkommen)
5. Vergleich mit Ziel: Lücke oder Überschuss?
6. Monte Carlo: Mit welcher Wahrscheinlichkeit läuft mir das Geld nicht aus?

[ÜBERPRÜFEN] Sie Prognosen mit einem lizenzierten Finanzplaner.
```

### Schritt 3 — Bildungsfinanzierung

```
Bildungsfinanzierung für [X] Kinder modellieren.

Kind 1: Alter [X], geschätztes Hochschulstartdatum: [Jahr]
Ziel: [Öffentliche Universität im Bundesstaat / Privat / Ivy League]
Aktuelle Kosten (in heutigen Dollar): [im Bundesstaat ~25-30 K$/Jahr, privat ~60-80 K$/Jahr, Ivy ~85 K+$/Jahr]
4-Jahres-Summe (in heutigen Dollar): [X]
Bildungsinflationsrate: ~5% pro Jahr

Aktueller 529-Saldo: [X]
Monatliche Beiträge zum 529: [X]
Angenommene Rendite im 529: [X]% (typischerweise 6-8% aktienorientiert, wenn das Kind jung ist)

Berechnen:
1. Prognostizierte 4-Jahres-Kosten, wenn das Kind mit der Hochschule beginnt
2. Prognostizierter 529-Saldo bei Hochschulstart
3. Finanzierungslücke (falls vorhanden)
4. Monatlicher Beitrag, der erforderlich ist, um vollständig zu finanzieren

[ÜBERPRÜFEN] Sie Prognosen mit einem Spezialisten für Hochschulplanung.
```

### Schritt 4 — Versicherungslückenanalyse

```
Überprüfen Sie meine Versicherungsabdeckung auf Lücken:

Aktuelle Abdeckung:
- Lebensversicherung: [X] (Laufzeit / Lebensversicherung, Laufzeit endet [Jahr])
- Berufsunfähigkeitsversicherung: [X]% Einkommensersatz, [X]-Tage-Selbstbehalt
- Krankenversicherung: [Selbstbeteiligung], [maximales Selbstzahlungslimit]
- Wohngebäude-/Mietversicherung: [X] Deckung
- Dachversicherung: [X] oder keine
- Pflegezusatzversicherung: ja/nein

Profil:
- Unterhaltsberechtigte: [X]
- Einkommen: [X]
- Schulden: [X]
- Vermögenswerte: [X]

Identifizieren:
1. Angemessenheit der Lebensversicherung (Faustregel: 10-12x Einkommen)
2. Berufsunfähigkeitsversicherung (habe ich genug?)
3. Langzeitpflegebedarf (typischerweise ab 50+ Jahren relevant)
4. Dachversicherungsbedarf (typischerweise: wenn Nettovermögen > 500 K$ oder Berufsrisiko)
```

### Schritt 5 — Nachlassplanungs-Checkliste

```
Überprüfen Sie meinen Nachlassplanungsstatus:

Aktuelle Dokumente:
- Testament: [ja/nein/veraltet]
- Lebender Trust: [ja/nein]
- Vollmacht: [ja/nein]
- Healthcare Directive / Patientenverfügung: [ja/nein]
- Begünstigtenbenennung überprüft: [ja/nein, zuletzt aktualisiert: Jahr]
- Lebensversicherung zahlbar an: [Nachlass / Trust / benannte Begünstigte]

Familiensituation:
- Verheiratet: [ja/nein], Ehepartner US-Bürger: [ja/nein]
- Minderjährige Kinder: [ja/nein]
- Blended Family / Stiefkinder: [ja/nein]
- Unterhaltsberechtigte mit besonderen Bedürfnissen: [ja/nein]
- Geschätzter Nachlass: [X]

Flagge:
1. Was fehlt und warum es wichtig ist
2. Erbschaftsteuergefährdung (Bund: Nachlässe > ~13 M$; einige Bundesstaaten niedriger)
3. Ob ein Trust gerechtfertigt ist
4. Unstimmigkeiten bei der Begünstigtenbenennung

[ÜBERPRÜFEN] Sie mit einem Nachlassplanungsanwalt.
```

## Beispiel

**Benutzer:** Alter 38, verheiratet, zwei Kinder (6 und 4), 180 K$ Haushaltseinkommen, 250 K$ in 401(k), 0 $ in 529, Hypothek 400 K$, möchte mit 62 in den Ruhestand gehen.

**Analyse von Claude:**

**Ruhestand (24 Jahre):**
250 K$ mit 7% wachsend + 1.500 $/Monat Beiträge → ~2,1 M$ bei 62 [ÜBERPRÜFEN]
4%-Regel → 84 K$/Jahr + Sozialversicherung → wahrscheinlich ausreichend für 120 K$ Zielausgaben

**Bildung (12 und 14 Jahre):**
2 Kinder × 400 K$ (projizierte Privatuniversität) = 800 K$ benötigt [ÜBERPRÜFEN]
0 $ in 529 + 12-14 Jahre → benötigen ~1.400 $/Monat in 529 für beide Kinder
Oder: 700 $/Monat pro Kind ab jetzt

**Priorität Ruhestand vs. Bildung:**
Beide sind bei aktuellem Einkommen erreichbar. Priorität: 401(k)-Arbeitgeberzuschuss zuerst maximieren, dann 529, dann zusätzliche Renteneinsparungen.

**Sofortmaßnahmen:**
1. Diese Woche 529er für beide Kinder eröffnen
2. Lebensversicherung überprüfen (aktuell: unbekannt — prüfen Sie, ob 10x Einkommen = 1,8 M$ gedeckt ist)
3. Testament und Vollmacht verfassen (kein Dokument erwähnt — kritisch bei minderjährigen Kindern)

---
