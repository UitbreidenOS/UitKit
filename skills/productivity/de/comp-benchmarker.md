---
name: comp-benchmarker
description: "Vergütungs-Benchmarking: Marktdatenanalyse, Gehaltsband-Festlegung, Equity-Richtlinien und Angebotsschreiben-Generierung für wettbewerbsfähige Einstellungen"
---

# Vergütungs-Benchmarker-Skill

## Wann aktivieren
- Du legst eine Gehaltsspanne für eine neue Stelle fest, bevor du die Stelle ausschreibst
- Ein Kandidat hat ein Gegenangebot gemacht und du musst wissen, ob es marktkonform ist
- Du baust Vergütungsbänder für die gesamte Organisation auf oder aktualisierst sie
- Ein aktueller Mitarbeiter bittet um eine Marktanpassung oder Gehaltsüberprüfung
- Du erstellst ein formelles Angebotsschreiben, nachdem ein mündliches Angebot angenommen wurde
- Du entwirfst ein Equity-Programm zum ersten Mal oder aktualisierst ein bestehendes
- Du entscheidest zwischen kassenreicher und equity-reicher Vergütungsstruktur für verschiedene Kandidatenprofile

## Wann NICHT verwenden
- Executive-Vergütungs-Benchmarking (C-Suite) — erfordert einen spezialisierten Vergütungsberater und den Vorstandsgenehmigungsprozess
- Benchmarking in hochregulierten Branchen (Finanzen, Gesundheitswesen), wo Vergütungsvorschriften gelten — lokal verifizieren
- Rechtliche Compliance-Prüfung der Lohngleichheit — einen Arbeitsrechtsanwalt hinzuziehen
- Benefits-Benchmarking — andere Datenquellen und Analyse

## Anweisungen

### Gehaltsband-Builder

```
Gehaltsbänder für [Stelle] in meinem Unternehmen erstellen.

Stelle: [Berufsbezeichnung]
Levels: [Liste — z.B. L1 / L2 / L3 / Senior / Staff / Principal]
Standort: [Stadt, Land / Remote — und ob nach lokalem Markt oder einheitlichem nationalen Satz gezahlt wird]
Unternehmensphase: [Seed / Series A-B / Series C+ / Öffentlich / KMU / Enterprise]
Branche: [SaaS / Fintech / Gesundheitswesen / E-Commerce / Agentur / etc.]
Einstellungsdringlichkeit: [Kann 90 Tage auf die richtige Person warten, oder wird jemand in 30 Tagen benötigt?]

Vergütungsphilosophie (eine wählen oder eigene beschreiben):
- Markt anführen (75. Perzentile+): wir zahlen Marktspitze, um Spitzenkräfte anzuziehen
- Markt entsprechen (50. Perzentile): wettbewerbsfähig, aber nicht der höchste Zahler
- Unterdurchschnittliches Gehalt, überdurchschnittliche Equity: häufig bei frühen Startups
- Geografische Differenzierung: Bezahlung nach lokalen Lebenshaltungskosten

Zu referenzierende Datenquellen (in Prioritätsreihenfolge):
1. Levels.fyi — Software-Engineering und technische Stellen
2. Radford / Mercer — Enterprise-Vergütungsumfragen (falls vorhanden)
3. Glassdoor / LinkedIn Salary Insights — richtungsweisend, selbst gemeldet
4. Peer-Benchmarks — was zahlen ähnliche Unternehmen? (VC fragen, AngelList prüfen)
5. Angebotsdaten von jüngsten Einstellungen im eigenen Unternehmen (interner Anker)

Bandstruktur (für jedes Level):

| Level | Gehaltsspanne | Zielbonos | Equity-Gewährung | OTE (falls zutreffend) |
|---|---|---|---|---|
| [L1] | $[X] - $[Y] | [X%] | [X Aktien / X% des Pools] | $[X] |
| [L2] | $[X] - $[Y] | [X%] | [X Aktien / X% des Pools] | $[X] |
[fortsetzen]

Regeln:
- Kein Band sollte sich um mehr als 20% mit dem Band darüber/darunter überschneiden (verhindert Kompression)
- Mittelpunkt = was eine voll leistende Person auf diesem Level verdienen sollte
- Minimum = Einstellungsgehalt für jemanden, der neu auf dem Level oder im Unternehmen ist
- Maximum = wo jemand das Limit erreicht, bevor er zum nächsten Level befördert wird

Vergütungsrisikobereiche kennzeichnen:
- Wenn [aktuelles Mitarbeitergehalt] > Band-Maximum: Kompressionsproblem — proaktiv angehen
- Wenn die meisten Angebote an der Spitze des Bandes liegen: Band ist zu niedrig für den aktuellen Markt
- Wenn Kandidaten wegen der Vergütung ablehnen: Daten, keine Anekdoten, an die Führung liefern

Vollständige Bandstruktur für [Stelle] mit Marktkontext erstellen.
```

### Angebotspaket-Builder

```
Ein Vergütungsangebot für diesen Kandidaten erstellen.

Stelle: [Titel, Level]
Kandidat: [Beschreiben — Jahre Erfahrung, aktuelle Vergütung, Konkurrenzangebote falls bekannt]
Standort: [Stadt, Land]
Mein Band für diese Stelle: [$X - $Y Grundgehalt]
Ziel im Band: [unten / Mittelpunkt / oben — und warum]

Aktuelle Situation des Kandidaten:
- Aktuelles Grundgehalt: $[X]
- Aktueller Bonus (erwartet): $[X]
- Aktuelle Equity (nicht eingezogen, Wert): $[X] (das ist, was du sie bittest aufzugeben)
- Konkurrenzangebot: [Unternehmen, $X Grundgehalt, $X Equity — falls bekannt]
- Kündigungsfrist: [X Wochen]

Dein Angebot:

GRUNDGEHALT: $[X]
Begründung: [warum diese Zahl — X% Aufschlag auf aktuelles, Y. Perzentile des Bandes, etc.]

BONUS / VARIABLE:
- Typ: [Jahreszielbonus / Provision / Spot-Bonus]
- Ziel: $[X] bei [X%] des Grundgehalts on-target
- Struktur: [wie wird er gemessen und ausgezahlt?]

EQUITY:
- Typ: [ISO-Optionen / RSUs / SAFEs in früher Phase]
- Gewährungsgröße: [X Aktien / $X Wert bei aktueller 409A / X% vollständig verwässert]
- Vesting: [Standard: 4 Jahre, 1-Jahres-Cliff — Abweichungen vermerken]
- Geschätzter aktueller Wert: $[X] (409A oder FMV)
- Hinweis bei öffentlichen Unternehmen: aktueller Wert / Hinweis, dass er sinken kann
- Cliff- und Beschleunigungsbestimmungen (falls vorhanden)

BENEFITS:
- Gesundheit: [100% / X% unternehmensbezahlte Kranken-, Zahn-, Sehversicherung]
- 401K: [X% Match bis Y%]
- Urlaub: [X Tage / unbegrenzt / flexibel]
- Ausstattung: [$X Zuschuss / Unternehmensausstattung]
- Remote/Flex: [Richtlinie beschreiben]
- Sonstiges: [Lernbudget, Elternzeit, Equity-Refresh-Richtlinie]

STARTDATUM: [vorgeschlagenes Datum, mit Flexibilität für Kündigungsfrist]

ANGEBOTSFRIST: [5-7 Werktage geben — angemessen, nicht unter Druck setzend]

Gesamtvergütungsübersicht:
- Jährliches Grundgehalt: $[X]
- Zielbonus: $[X]
- Equity (jährlicher Wertschätzung): $[X]
- Gesamtes Barziel: $[X]
- Gesamtvergütung einschließlich Equity: $[X]

Konkurrenzangebotsanalyse (falls zutreffend):
Wenn sie ein Konkurrenzangebot von [Wettbewerber] haben:
[Dein Angebot nach Bargeld, Equity-Upside, Risiko, Stellenqualität, Wachstum vergleichen — nicht nur die Zahlen]

Vollständiges Angebotspaket und eine Vergleichsnarration für das Kandidatengespräch erstellen.
```

### Equity-Richtlinien

```
Equity-Richtlinien für [Unternehmen / Stellenlevel] entwerfen.

Unternehmenstyp: [Pre-Seed / Seed / Series A / Series B / Series C+]
Option-Pool-Größe: [X% der vollständig verwässerten Aktien]
Aktuelle Bewertung: $[X] (oder 409A-Preis: $[X/Aktie])

Equity-Gewährungs-Benchmarks nach Level und Phase:

PRE-SEED / SEED (erste 10-20 Mitarbeiter):
| Level | Spanne (% vollständig verwässert) |
|---|---|
| VP / C-Suite | 0,5% - 2,0% |
| Senior IC / Director | 0,2% - 0,75% |
| Mid-Level IC | 0,05% - 0,25% |
| Berufseinsteiger / Junior | 0,01% - 0,1% |

SERIES A-B (20-100 Mitarbeiter):
| Level | Spanne (% vollständig verwässert) |
|---|---|
| VP / C-Suite (Neueinstellung) | 0,15% - 0,75% |
| Director | 0,1% - 0,3% |
| Senior IC | 0,05% - 0,15% |
| Mid-Level IC | 0,02% - 0,08% |
| Junior IC | 0,005% - 0,025% |

SERIES C+ (100+ Mitarbeiter, vor Börsengang):
Wechsel zu RSUs zu Dollar-Zielwerten (Aktienkursvolatilität macht %-Gewährungen schwer vergleichbar):
| Level | Jährliche Gewährungsspanne |
|---|---|
| VP | $150K - $500K in RSUs |
| Director | $75K - $200K in RSUs |
| Senior IC | $40K - $100K in RSUs |
| Mid-Level IC | $15K - $50K in RSUs |

Vesting-Standards:
- Standard: 4-Jahres-Vest, 1-Jahres-Cliff
- Beschleunigtes Vesting bei Übernahme (Single Trigger): ungewöhnlich, aber manchmal Führungskräften angeboten
- Refresh-Gewährungen: nach 2 Jahren für behaltene Top-Performer anbieten (verhindert nicht eingezogenen Cliff-Effekt in Jahr 4)

Equity gegenüber Kandidaten darstellen:
Nicht: "Du bekommst X.000 Optionen im Wert von $Y heute."
Ja: "Bei unserem aktuellen 409A von $X/Aktie ist deine Gewährung heute $Y wert. Wenn wir unser Ziel [Series C / Börsengang] von $Z/Aktie erreichen, ist deine Gewährung $W wert. Das setzt [10x / 20x / spezifischen Meilenstein] voraus."
Über Verwässerungsrisiko bei jeder zukünftigen Runde ehrlich sein.

Equity-Richtlinien für die Phase und den Option-Pool meines Unternehmens erstellen.
```

### Angebotsschreiben-Generator

```
Ein Angebotsschreiben für [Kandidat] für [Stelle] erstellen.

Unternehmen: [Unternehmensname]
Kandidat: [Vollständiger Name]
Stelle: [Berufsbezeichnung]
Abteilung: [Abteilung]
Berichtet an: [Name des Vorgesetzten, Titel]
Startdatum: [Datum]
Standort: [Stadt / Bundesland / Remote]

Vergütung:
- Grundgehalt: $[X] pro [Jahr / Stunde]
- Bonus: [Ziel X% des Grundgehalts, gezahlt [jährlich / vierteljährlich], abhängig von Leistung]
- Equity: [X Stammaktien, 4-Jahres-Vest, 1-Jahres-Cliff, abhängig von Vorstandsgenehmigung]

Benefits: [beschreiben]

Beschäftigungsart: [Vollzeit / Teilzeit / Vertrag]
Arbeit nach Belieben: [Ja / Nein — Rechtszuständigkeit prüfen]
Angebotsfrist: [Datum]

Erforderliche Anhänge:
- Mitarbeiter-Erfindungsabtretungs- und Vertraulichkeitsvereinbarung (PIIA/CIIA)
- Einwilligungsformular zur Hintergrundprüfung (falls zutreffend)
- I-9-Beschäftigungsberechtigungsverifizierung

Ein formelles Angebotsschreiben erstellen mit:
- Professionellem Ton — warm aber formal
- Allen klar angegebenen Vergütungsdetails
- Equity mit Hinweis beschrieben, dass sie von Vorstandsgenehmigung und 409A abhängig ist
- Arbeit-nach-Belieben-Klausel (falls in dieser Rechtszuständigkeit anwendbar)
- Bestätigungsanweisungen — wie anzunehmen (E-Mail / DocuSign-Link)
- Frist vermerkt
- Kontakt für Fragen

Hinweis: Dies ist eine Vorlage — vor dem Versenden von einem Rechtsanwalt prüfen lassen. Arbeitsrecht variiert nach Rechtszuständigkeit.
```

## Beispiel

**Benutzer:** Ich stelle einen Senior Product Manager in London ein. Mein Series-B-Startup, ~80 Personen. Was sollte das Gehaltsband sein und wie strukturiere ich das Angebot?

**Claudes Benchmark:**

**Senior Product Manager — London — Series B**

**Marktkontext (2025-2026):**
Der Londoner PM-Markt ist eng, besonders für Senior ICs mit B2B-SaaS-Erfahrung. Series-B-Unternehmen positionieren sich typischerweise auf der 50. bis 65. Perzentile, um wettbewerbsfähig zu bleiben, ohne den Option-Pool zu verbrennen.

**Gehaltsband — Senior PM, London:**
| Komponente | Spanne | Anmerkungen |
|---|---|---|
| Grundgehalt | £85.000 - £115.000 | Mittelpunkt ~£100K für einen 5-7-jährigen PM |
| Bonus (Ziel) | 10-15% des Grundgehalts | Typischerweise an Unternehmens-OKRs gebunden, nicht individuell |
| Equity | 0,05-0,1% vollständig verwässert | ~£40-80K bei aktueller Bewertung wenn Series B bei £80M |

**Wo ein bestimmter Kandidat platziert wird:**
- Wechsel aus einer eng verwandten Stelle oder einem Unternehmen: unteres Bandende (£85-90K)
- 5-7 Jahre PM-Erfahrung, Domain-Match: Mittelpunkt (£95-105K)
- 8+ Jahre, hat einen Produktbereich mit Umsatzverantwortung geleitet: oberes Bandende (£108-115K)
- Nicht über das Band gehen — die Vergütungsphilosophie vertreten, keine individuelle Verhandlung

**Equity-Struktur für dieses Level (Series B):**
- 0,075% typisch für eine starke Senior-PM-Einstellung
- Bei £80M Bewertung: ~£60K aktueller Wert
- Vesting: 4 Jahre, 1-Jahres-Cliff — Standard
- Bei der Darstellung: "Wenn wir Series C bei £250M erreichen, ist diese Gewährung ~£190K wert"

**Konkurrenz gegen größere Tech-Unternehmen:**
Wenn sie ein Amazon/Google-Angebot mit RSUs haben, kannst du beim Bargeld nicht mithalten. Konkurrieren auf: Umfang (sie werden einen vollständigen Produktbereich besitzen, kein Feature), Geschwindigkeit (sie werden in Wochen, nicht Quartalen liefern) und Upside (Equity kann ein Vielfaches einer öffentlichen RSU wert sein).

---
