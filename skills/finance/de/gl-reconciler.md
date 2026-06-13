---
name: gl-reconciler
description: "Hauptbuch-Abstimmung: Kontoabstimmungsverfahren, Überprüfung von Journaleinträgen, Periodenabschlussprüfliste, Abweichungsanalyse und Konzernausgleichungen — für Finanzteams und Fondsverwalter"
---

# GL Reconciler Skill

## Wann aktivieren
- Durchführung von Monatsend- oder Quartalsenhabschlussverfahren
- Abstimmung von Bilanzkonten (Bargeld, Forderungen, Verbindlichkeiten, Anlagevermögen, Rückstellungen)
- Überprüfung von Journaleinträgen auf Genauigkeit und Vollständigkeit
- Untersuchung ungeklärter Abweichungen zwischen Nebenbüchern und dem Hauptbuch
- Erstellung einer Abschluss-Checkliste für das Finanzteam
- Konzernausgleichungen für konsolidierte Berichterstattung

## Wann NICHT verwenden
- Steuererklärungen oder -einreichungen — spezielle Steuer-Skill erforderlich
- Audit-Feldarbeit — Prüferunabhängigkeitsregeln gelten; dies ist ein Management-Tool
- Echtzeit-Transaktionsverarbeitung — dies ist eine Abstimmungs- und Überprüfungs-Skill
- Ersatz eines qualifizierten Buchhalters für wesentliche Korrekturen

## Anleitung

### Monatsend-Abschlussprüfliste

```
Erstellen Sie eine Monatsend-Abschlussprüfliste für [Unternehmen/Entität].

Entitätstyp: [Startup / KMU / Fonds / Konzernsubsidium]
Buchhaltungssystem: [QuickBooks / Xero / NetSuite / Sage / Excel]
Abschluss-Zeitziel: [X Geschäftstage nach Monatsende]
Team: [einzelner Buchhalter / kleines Team / Finanzteam mit Controller]
Schlüsselkonten: [aufzählen wesentlicher Konten — Bargeld, Forderungen, Verbindlichkeiten, Lohn-/Gehalt, aufgeschobene Einnahmen usw.]

Monatsend-Abschlussprüfliste:

TAG 1-2 (nach Monatsende):
□ Bestätigen, dass alle Transaktionen des Monats gebucht sind
□ Kontoauszüge herunterladen und abstimmen (alle Konten)
□ Kreditkartenauszüge verarbeiten und codieren
□ Bestätigung, dass Lohn-/Gehaltseinträge korrekt gebucht sind

TAG 2-3:
□ Nebenbuch der Forderungen mit Hauptbuch abstimmen
   - Entspricht der Altreportausgleich dem Forderungssaldo?
   - Nicht angewendete Zahlungen beglichen?
□ Nebenbuch der Verbindlichkeiten mit Hauptbuch abstimmen
   - Entspricht die Altung der Verbindlichkeiten dem Verbindlichkeitssaldo?
   - Rückgestellt, aber nicht fakturierte Verbindlichkeiten gebucht?
□ Anlagevermögen rollforward — Zugänge, Abgänge, Abschreibungen gebucht?

TAG 3-4:
□ Überprüfung und Buchung von Rückstellungen:
   □ Lohn-/Gehaltsrückstellung (geleistete Arbeitstage, noch nicht bezahlt)
   □ Amortisation von Rechnungsabgrenzungsposten
   □ Umsatzabgrenzung (SaaS: anteilig über Vertragslaufzeit)
   □ Zinsabgrenzung (falls Fremdkapital ausstehend)
   □ Unbewerte Forderungen (erbrachte Dienstleistungen, Rechnung noch nicht versendet)
□ Konzernausgleichungen (falls konsolidiert)

TAG 4-5:
□ Rohbilanzprüfung — gibt es ungewöhnliche Salden?
□ P&L-Flux-Analyse — wesentliche Abweichungen zum Vormonat erklärt?
□ Bilanzbescheinigung — alle Konten abgestimmt?
□ Controller-Überprüfung und Freigabe
□ Abschluss vorbereitet und verteilt

FREIGABEGRANTOR:
Vor Abschluss bestätigen: [MENSCHLICHE GENEHMIGUNG ERFORDERLICH]
Controller / CFO müssen vor Sperrung der Periode genehmigen.

Erstellen Sie eine Abschlussprüfliste für meinen Entitätstyp und mein Buchhaltungssystem.
```

### Kontoabstimmungsvorlage

```
Stimmen Sie [Kontoname] für [Periode] ab.

Konto: [z. B. Bargeld, Forderungen, Rückstellungen, Umsatzabgrenzung]
GL-Saldo laut Rohbilanz: $[X]
Nebenbuch- oder externer Saldo: $[X]
Abstimmungsposten (Differenzen): [beschreiben oder unbekannt]

Abstimmungsformat:

KONTO: [Name]
PERIODE: [Monat/Jahr]
Ersteller: [Name] | Datum: [Datum]
Prüfer: [Name — MENSCHLICHE ÜBERPRÜFUNG ERFORDERLICH] | Datum: ___

| | Betrag |
|---|---|
| GL-Saldo laut Rohbilanz | $[X] |
| Weniger: Im GL nicht im Nebenbuch | ($[X]) |
| Zuzüglich: Im Nebenbuch nicht im GL | $[X] |
| Angepasster GL-Saldo | $[X] |
| Nebenbuch- / Externer Saldo | $[X] |
| **Ungeklärte Differenz** | **$[X]** |

ABSTIMMUNGSPOSTEN:
| Posten | Beschreibung | Betrag | Status |
|---|---|---|---|
| [1] | [z. B. Scheckausfall #1234 — noch nicht geräumt] | ($[X]) | Erwartet bis [Datum] zu räumen |
| [2] | [z. B. Einzahlung in Bearbeitung — gebucht [Datum], noch nicht geräumt] | $[X] | Erwartet bis [Datum] zu räumen |
| [3] | [z. B. Bankgebühr noch nicht in GL erfasst] | ($[X]) | Buchung eintragen |

GENEHMIGUNG:
□ Alle Abstimmungsposten identifiziert und erläutert
□ Journaleinträge für Posten vorbereitet, die Buchung erfordern
□ Keine ungeklärte Differenz vorhanden
□ GENEHMIGT VON: ______________ DATUM: ______________

Häufige Abstimmungsposten nach Kontotyp:
- Bargeld: ausgegebene Schecks, Einzahlungen in Bearbeitung, Bankgebühren, unzureichende Deckung
- Forderungen: nicht angewendete Zahlungen, nicht angewendete Gutschriften, Zeitunterschiede
- Verbindlichkeiten: nicht fakturierte Rückstellungen, nicht abgestimmte Bestellungen, Zeitunterschiede
- Umsatzabgrenzung: neue Verträge, realisierte Einnahmen, frühe Beendigung
- Rückstellungen: Lohn-/Gehalts-Timing, nicht in Rechnung gestellte Dienstleistungen

Erstellen Sie die Abstimmungsvorlage für mein spezifisches Konto.
```

### Überprüfung von Journaleinträgen

```
Überprüfen Sie diese Journaleinträge auf Genauigkeit und Vollständigkeit.

Periode: [Monat/Jahr]
Zu überprüfende Einträge: [beschreiben oder auflisten — können Textbeschreibungen von JEs sein]
Rechnungslegungsstandard: [GAAP / IFRS / Kassenbasis]

Überprüfungs-Checkliste für Journaleinträge:

Für jeden Eintrag:
□ Sollten = Haben (grundlegende Gleichgewichtsprüfung)
□ Kontonummern sind für die Art der Transaktion korrekt
□ Beschreibung ist klar genug, damit ein Prüfer ohne Nachfragen verstehen kann
□ Unterstützende Dokumentation beigefügt oder referenziert
□ Korrekte Periode — zur richtigen Zeit gebucht?
□ Von autorisierter Person genehmigt (gemäß Genehmigungsmatrix)
□ Für Storno-Einträge — gibt es die Stornierung im folgenden Zeitraum?

Hochrisiko-Eintragtypen genau prüfen:
🔴 Einträge direkt von Finanzpersonal gebucht (normalen Workflow umgehend)
🔴 Rundbetragseinträge ohne detaillierte Unterstützung
🔴 Einträge am letzten Tag der Periode gebucht (Gewinnmanipulationsrisiko)
🔴 Einträge zwischen verbundenen Parteien oder Konzernunternehmen
🔴 Einträge, die einen früheren ungewöhnlichen Eintrag ausgleichen
🔴 Große Anpassungen mit Beschreibung „je Management" oder „je Controller"

Für jeden gekennzeichneten Eintrag:
Eintrag: [JE-Nummer / Beschreibung]
Problem: [Was ist ungewöhnlich oder fehlend]
Erforderlich: [Zusätzliche Unterstützung / Genehmigung / Erläuterung]
Status: [Geklärt / An Controller eskalieren / Von Ersteller anfordern]

Überprüfen Sie meine Journaleinträge und kennzeichnen Sie diejenigen, die zusätzlich überprüft werden müssen.
[MENSCHLICHE ÜBERPRÜFUNG ERFORDERLICH vor Periodensperre]
```

### Abweichungsanalyse

```
Erklären Sie die Abweichung im [Konto / P&L-Zeile] für [Periode].

Konto: [Name]
Budget / Vorherige Periode: $[X]
Ist: $[X]
Abweichung: $[X] ([X]% ungünstig / günstig)

Abweichungsanalyse-Framework:

Schritt 1 — Nach Treiber quantifizieren:
Preis-/Satzabweichung: [gleiche Menge, unterschiedlicher Preis oder Stückkosten]
Mengenabweichung: [gleicher Satz, unterschiedliche Menge]
Mischungsabweichung: [Zusammensetzungsänderung — z. B. mehr Enterprise- vs. KMU-Kunden]
Zeitabweichung: [einmaliger Posten oder Periodenverschebung]

Schritt 2 — Jeden Treiber untersuchen:
- Transaktionsdetail für das Konto abrufen
- Top 3-5 Transaktionen identifizieren, die die Abweichung treiben
- Jede klassifizieren: wiederkehrend / einmalig / Fehler / Timing

Schritt 3 — Abweichungserklärung entwerfen:
Format für Vorstand-/Managementberichte:
„[Konto] betrug $[X] gegenüber Budget von $[X], eine ungünstige Abweichung von $[X]. Haupttreiber:
1. [Treiber 1] — $[X] Auswirkung — [kurze Erklärung]
2. [Treiber 2] — $[X] Auswirkung — [kurze Erklärung]
[X] der Abweichung wird sich voraussichtlich in [nächstem Monat/Quartal] [umkehren/fortsetzen]."

Warnsignale in der Abweichungsanalyse:
- Abweichung, die sich über Konten „ausgleicht" (Fehlerausgleich)
- Abweichung konsistent in gleicher Richtung für 3+ Monate (strukturelles Problem, nicht Timing)
- Abweichung ohne klare geschäftliche Erklärung (auf Fehler oder Betrug überprüfen)

[ALLE ZAHLEN MIT QUELLDATEN ÜBERPRÜFEN, bevor Sie in Managementberichte aufnehmen]
Analysieren Sie meine Abweichung und formulieren Sie die Managementerklärung.
```

### Konzernabstimmung

```
Stimmen Sie Konzernkonten für [konsolidierte Entität] ab.

Mutterunternehmen: [Name]
Tochterunternehmen: [aufzählen]
Buchhaltungssystem: [gleich für alle / separate Systeme]
Periode: [Monat/Jahr]
Konzerngeschäfte dieser Periode: [beschreiben — Darlehen, Verwaltungsgebühren, gemeinsame Dienstleistungen, Verkäufe]

Konzernabstimmungsprozess:

Schritt 1 — Konzernkonten abbilden:
Für jedes Unternehmenpaar bestätigen:
Unternehmen A → Unternehmen B: $[X] (Unternehmen A: Verbindlichkeit oder Forderung?)
Unternehmen B → Unternehmen A: $[X] (sollte die Umkehrung des obigen sein)

Schritt 2 — Unstimmigkeiten identifizieren:
| Unternehmen A | Unternehmen B | Saldo A | Saldo B | Differenz | Grund |
|---|---|---|---|---|---|
| Mutter | Tochter 1 | $[X] | $[X] | $[X] | [Timing / Fehler / Währung] |

Häufige Unstimmigkeitsgründe:
- Timing: Ein Unternehmen hat in der Periode gebucht, das andere noch nicht
- Währung: Unternehmen in unterschiedlichen Währungen — notieren Sie, welcher Satz verwendet wurde
- Fehlender Eintrag: Eine Seite der Transaktion noch nicht erfasst
- Umstrittener Betrag: Unternehmen sind sich über den Transaktionsbetrag uneinig

Schritt 3 — Ausgleichungseinträge:
Für die Konsolidierung alle Konzernkonten ausgleichen:
Dr. Konzernverbindlichkeit $[X] (bei Mutter)
Cr. Konzernforderung $[X] (bei Tochter 1)
[MENSCHLICHE ÜBERPRÜFUNG ERFORDERLICH vor Buchung von Ausgleichungseinträgen]

Schritt 4 — Ausgleichungsvollständigkeit bestätigen:
Nach Ausgleichungen sollten Konzernforderung und -verbindlichkeit sich aufheben.
Restbetrag = Fehler oder nicht abgestimmter Posten → vor Abschluss untersuchen.

Erstellen Sie die Konzernabstimmungsvorlage für meine Unternehmensstruktur.
```

## Beispiel

**Benutzer:** Unser Monatsabschluss dauert 12 Geschäftstage, was zu lange ist. Finanzteam: 1 Controller, 2 Buchhalter. Buchhaltungssystem: NetSuite. Wie erreiche ich 5 Tage?

**Beschleunigungsplan für Claudes Abschluss:**

12 Tage → 5 Tage sind mit NetSuite durch Prozessänderungen erreichbar. Der Schuldige ist fast immer sequenzielle Abhängigkeiten, die parallel laufen könnten, und manuelle Aufgaben, die automatisiert werden könnten.

**Diagnose — wo die Tage hingehen:**
- Tage 1-3: Warten auf Kontoauszüge, Kreditkartendateien, Gehaltsberichte (externe Abhängigkeiten)
- Tage 4-6: Manuelle Abstimmung von Forderungen und Verbindlichkeiten (keine automatische Zuordnung)
- Tage 7-9: Rückstellungen und Anpassungseinträge (Überprüfungs-Engpass)
- Tage 10-12: Controller-Überprüfung und Überarbeitungszyklen

**5-Tage-Abschlussplan:**

*Vor Monatsende (letzte 2 Tage des Monats):*
- Vor-Abschluss: Lohn-/Gehalt rückstellen, Abschreibung buchen, vorherige Monatrückstellungen stornieren — alles automatisiert in NetSuite über wiederkehrende JE-Vorlagen
- Vor-Abstimmung Forderungen: Täglich Forderungsalterungsbericht ausführen, offene Posten kennzeichnen, nicht auf Tag 1 warten

*Tag 1:*
- Bankfeeds werden automatisch in NetSuite importiert → automatische Abgleichsregeln handhaben >80% der Transaktionen
- Kreditkartentransaktionen per CSV importiert — 1 Buchhalter verantwortlich, 2-3 Stunden
- Gehalts-JE von Gehaltsprovider-Export gebucht

*Tag 2:*
- Nebenbuch Forderungen-Abstimmung (automatischer Abgleich in NetSuite)
- Offene Posten Verbindlichkeiten geklärt
- Anlagevermögen-Abschreibung bestätigt (NetSuite berechnet automatisch)

*Tag 3:*
- Alle Rückstellungen gebucht (JE-Vorlagen verwenden — jeden Monat identisch, nur Beträge aktualisieren)
- Konzernausgleichungen (falls zutreffend)

*Tag 4:*
- Rohbilanz-Flux-Überprüfung — Controller überprüft Abweichungen >5% und >$5K
- Anpassungen gebucht

*Tag 5:*
- Endgültige Controller-Freigabe
- Abschluss verteilt

**Schlüsseltreiber:**
1. NetSuite Bank-Feed + automatische Abgleichsregeln (reduziert Tag 1 von 2 Tagen auf 2 Stunden)
2. Wiederkehrende JE-Vorlagen für alle Standard-Rückstellungen (keine manuelle Buchung = keine zu korrigierenden Fehler)
3. Parallele Spuren: Forderungs- und Verbindlichkeits-Buchhalter arbeiten gleichzeitig an Tag 2
4. „Beim ersten Mal richtig"-Kultur: Controller überprüft während des Monats, nicht nur beim Abschluss

---
