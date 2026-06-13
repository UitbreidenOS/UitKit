---
name: vendor-contract-review
description: "Anbietervertragsüberprüfung: Identifizieren Sie riskante Klauseln in SaaS-, Service- und Beschaffungsverträgen — Haftungsgrenzen, Entschädigung, Datenverarbeitung, Kündigungsrechte und Erneuerungsfallen"
---

# Anbietervertragsüberprüfungs-Skill

## Wann aktivieren
- Überprüfung eines Vertrags vor Unterzeichnung mit einem neuen Anbieter
- Identifizierung ungünstiger Klauseln in SaaS- oder Softwarevereinbarungen
- Überprüfung einer Dienstleistungsvereinbarung, MSA oder SOW für Ihr Unternehmen
- Überprüfung einer Erneuerung vor automatischer Verlängerung einer großen Ausgabe
- Kennzeichnung von Datenverarbeitungs- und Haftungsrisiken in Anbieterverträgen

## Wann NICHT verwenden
- Verhandlung Ihrer eigenen Kundenverträge (unterschiedliche Risikopriorit äten)
- Arbeitsverträge — anderer rechtlicher Rahmen
- Immobilien- oder Sachvermögensvereinbarungen — außerhalb des Umfangs
- Verträge, die eine Konformitätsanalyse erfordern (FDA, Bankwesen) — benötigt qualifizierten Rechtsrat
- Ersatz für Anwalt bei hochriskanten Verträgen (> 500 K$ oder erhebliche Haftungsbelastung)

## Anweisungen

### Standard-Anbietervertragsüberprüfung

```
Überprüfen Sie diesen Anbietervertrag und kennzeichnen Sie riskante Klauseln.

Vertragstyp: [SaaS-Abonnement / Professionelle Dienstleistungen / MSA + SOW / Beschaffung / NDA]
Anbieter: [Name]
Jahreswe rt: $[X]
Laufzeit: [X Monate / jährlich]
Erneuerung: [automatisch / manuell]
Ihre Rolle: [Käufer, der den Service erhält]

Überprüfen Sie diese Klauseln in Prioritätsreihenfolge:

1. HAFTUNGSGRENZE (höchste Priorität):
   - Wie hoch ist die maximale Haftung des Anbieters gegenüber Ihnen?
   - Rotes Warnzeichen: Grenze gleich oder unter 1× monatliche Gebühren
   - Standard: 12× monatliche Gebühren (1 Jahr Vertra gswert)
   - Best: unbegrenzt für Vorsatz, Betrug, Tod/Verletzung, Patentver letzung, Datenpanne

2. ENTSCHÄDIGUNG:
   - Wer entschädigt wen für was?
   - Rotes Warnzeichen: Sie entschädigen Anbieter für Ihre "Missbrauch" (zu breit)
   - Standard: gegenseitige Entschädigung für Patentverletzung, Fahrlässigkeit
   - Beachten: Entschädigungsausschlüsse, die Ihren Schutz zunichte machen

3. DATEN UND DATENSCHUTZ:
   - Wer besitzt die Daten, die Sie eingeben oder generieren?
   - Ist ein DPA (Datenschutzvereinbarung) angehängt oder referenziert?
   - Rotes Warnzeichen: Anbieter kann Ihre Daten zur Produktverbesserung ohne Zustimmung nutzen
   - DSGVO / CCPA: Wenn Sie EU/CA-Personendaten verarbeiten, ist DPA rechtlich erforderlich
   - Beachten: Rückgabe-/Löschungsrechte der Daten bei Kündigung

4. KÜNDIGUNGSRECHTE:
   - Können Sie aus Kulanzgründen (ohne Grund) kündigen?
   - Erforderliche Kündigungsfrist: [X Tage]
   - Rotes Warnzeichen: keine Kündigung aus Kulanzgründen / Kündigung erfordert 90+ Tage Kündigungsfrist
   - Recht zur Kündigung bei Wesentlicher Verstoß: wie lange zur Abhilfe?

5. AUTOMATISCHE ERNEUERUNG:
   - Erneuert sich der Vertrag automatisch?
   - Wie lange im Voraus müssen Sie eine Kündigungsmitteilung geben? [X Tage]
   - Rotes Warnzeichen: automatische Erneuerung mit > 60-Tage-Mitteilungsfenster (leicht zu verpassen)
   - Best Practice: Kalendererin nerung 90 Tage vor Erneuerungsdatum

6. PREISGESTALTUNG UND PREISERHÖHUNGEN:
   - Kann der Anbieter den Preis bei Verlängerung erhöhen?
   - Obergrenze für jährliche Preiserhöhungen? [X%]
   - Rotes Warnzeichen: unbegrenzte Preiserhöhungen bei Verlängerung

7. SLA UND SERVICE-GUTHABEN:
   - Welche Verfügbarkeit ist garantiert? [X%]
   - Was sind die Abhilfemittel bei SLA-Verletzung?
   - Rotes Warnzeichen: SLA-Guthaben ist Ihr einziger Rückgriff (begrenzt Ihre Rückforderung)
   - Beachten: nur Guthaben, kein Kündigungsrecht für wiederholte SLA-Verstöße

8. GEISTIGES EIGENTUM:
   - Wer besitzt Arbeitsprodukte oder Anpassungen?
   - Rotes Warnzeichen: Anbieter behält das geistige Eigentum für Arbeiten, die Sie bezahlt haben
   - Standard: Sie besitzen kundenspezifische Arbeiten; Anbieter behält sein vorhandenes geistiges Eigentum

Kennzeichnen Sie jede Klausel als: GRÜN (günstig) / GELB (zu verhandeln) / ROT (ablehnen oder zu Rechtlichem eskalieren)
```

### SaaS-spezifische Klauselüberprüfung

```
Überprüfen Sie diese SaaS-Vereinbarung auf häufige softwarespezifische Risiken.

SaaS-Produkt des Anbieters: [beschreiben]
Benutzer: [X Plätze / unbegrenzt]
Im Produkt gespeicherte Daten: [Sensibilität beschreiben — PII / Finanzen / Eigentum]

SaaS-spezifische Klauseln zur Überprüfung:

AKZEPTABLE NUTZUNGSRICHTLINIE (AUP):
- Welche Nutzungen sind verboten?
- Rotes Warnzeichen: breite "nach Ermessen des Anbieters" Suspendierungsrechte
- Beachten: vage AUP, die Ihren legitimen Anwendungsfall beeinflussen könnte

DATENPORTABILITÄT UND EXPORT:
- Können Sie Ihre Daten jederzeit exportieren?
- In welchem Format? (maschinenlesbares CSV/JSON ist Standard)
- Was passiert mit Daten nach Beendigung? 30-Tage-Fenster zum Export ist Standard.
- Rotes Warnzeichen: kein Datenexport / proprietäres Format / Daten werden bei Beendigung ohne Übergangsfrist gelöscht

VERFÜGBARKEIT UND WARTUNG:
- Zählt geplante Wartung zur SLA-Verfügbarkeit?
- Wie viel Ankündigung für geplante Ausfallzeiten?
- Notfallwartung: Was ist der Prozess?

UNTERAUFTRAGNEHMER UND DRITTANBIETER-DIENSTE:
- Nutzt der Anbieter Unterauftragnehmer, die Ihre Daten berühren?
- Sind sie aufgelistet? Können Sie gegen neue Einspruch erheben?
- DSGVO-Anforderung: muss Kunden über Unterauftragnehmeränderungen benachrichtigen

SICHERHEITSVERPFLICHTUNGEN:
- Welchen Sicherheitsstandards verpflichtet sich der Anbieter? (SOC 2, ISO 27001)
- Vorfallmitteilung: wie schnell müssen sie Sie benachrichtigen?
- Standard: 72 Stunden (DSGVO-Anforderung); Beachten: > 72 Stunden oder keine Verpflichtung

ÄNDERUNGEN DES DIENSTES:
- Kann der Anbieter Funktionen ändern oder entfernen?
- Benachrichtigung für wesentliche Änderungen erforderlich? (30-90 Tage ist Standard)
- Rotes Warnzeichen: Anbieter kann den Service einseitig ohne Benachrichtigung ändern

Ergebnis: gekennzeichnete Klauselliste + empfohlene Verhandlungsanfragen für jede ROTE/GELBE Klausel.
```

### Vertragsverhandlungs-Playbook

```
Entwickeln Sie eine Verhandlungsstrategie für [Vertrag].

Vertra gswert: $[X/Jahr]
Hebelwirkung des Anbieters: [hoch / mittel / niedrig — gibt es Alternativen?]
Ihre Hebelwirkung: [hoch / mittel / niedrig — Größe Ihrer Ausgaben im Verhältnis zum Anbieter]
Muss-Gewinnen-Klauseln: [listet die 2-3 wichtigsten zu behebenden auf]
Schön-zu-haben: [sekundäre Anfragen auflisten]

Verhandlungs-Playbook:

Priorisieren: Wählen Sie Ihre 3 Kämpfe, lassen Sie den Rest los.
Anbieter erwarten Verhandlung — sie werden nicht aus einem wesentlichen Deal wegen vernünftiger Anfragen aussteigen.

Für jede ROTE Klausel:

Klausel: [Name]
Problem: [Was die aktuelle Sprache sagt, warum es ungünstig ist]
Ihre Anfrage: [die spezifische Sprachänderung, die Sie wollen]
Ihr Fallback: [minimale akzeptable Sprache, wenn sie zurückschieben]
Begründung: [warum dies eine angemessene geschäftliche Anfrage ist]

Hebelwirkungstaktiken:
- Mehrzahlenvertrag: "Wir unterzeichnen 3 Jahre, wenn Sie die Haftungsgrenze beheben"
- Volumenengagement: "Wir erweitern auf 500 Plätze, wenn Sie die Datenportabilität beheben"
- Zeitmangel: "Wir brauchen dies bis [Datum] gelöst, um fortzufahren"
- Wettbewerb: "Der Vertrag Ihres Konkurrenten umfasst bereits diesen Schutz"

Eskalationsweg:
- Stufe 1: Standardkorrektionen von ihrem AE
- Stufe 2: Juridische Verhandlung
- Stufe 3: Executive-Eskalation (nur für strategische Deals)

Generieren Sie das Verhandlungs-Playbook für meine spezifischen Korrektionen.
```

### Vertrags-Checkliste

```
Generieren Sie eine Anbietervertragsüberprüfungs-Checkliste für [Unternehmen/Team].

Anwendungsfall: [alle neuen Anbieter / Anbieter über $X Ausgabe / nur SaaS-Tools]
Risikobereitschaft: [konservativ / moderat / standard Startup]

Schnelle Überprüfungs-Checkliste (für Verträge < 50 K$/Jahr):
□ Haftungsgrenze ≥ 12 Monate Gebühren?
□ Kündigungsmitteilungsfrist bei automatischer Erneuerung ≤ 60 Tage?
□ Datenexportrechte inbegriffen?
□ Beendigung für Kulanz verfügbar mit ≤ 30 Tagen Kündigungsfrist?
□ Keine ungewöhnlichen IP-Zuordnungsklauseln?
→ Wenn alles grün: unterzeichnen. Wenn rot: eskalieren.

Vollständige Überprüfungs-Checkliste (Verträge > 50 K$/Jahr oder mit sensiblen Daten):
□ Haftungsgrenze und Ausschlüsse überprüft
□ Umfang der Entschädigung verstanden
□ DPA angehängt (wenn Personendatenverarbeitung)
□ SLA überprüft und Abhilfemittel sind adäquat
□ Kündigungsrechte (aus Grund und aus Kulanz)
□ Automatische Erneuerungsbedingungen kalenderisiert
□ Preiseskalationsklausel überprüft
□ Datenportabilität und Löschungsrechte bestätigt
□ Anforderungen zu Sicherheitszertifizierungen erfüllt
□ Anwendbares Recht und Gerichtsbarkeit sind akzeptabel
→ Interne Rechtsüberprüfung erforderlich für ROTE Elemente

Generieren Sie die spezifische Checkliste für den Vertragsüberprüfungsprozess meines Unternehmens.
```

## Beispiel

**Benutzer:** Ein neuer SaaS-Anbieter hat uns einen Vertrag geschickt. Jahresusgabe: 84 K$. Ihre Haftungsgrenze ist "ein Monat bezahlter Gebühren." Automatische Erneuerung mit 90-Tage-Benachrichtigung erforderlich. Keine DPA angehängt, obwohl wir Kunden-E-Mail-Adressen speichern. Wo soll ich Korrektionen einfordern?

**Vorrangige Korrektionen von Claude:**

Drei muss-beheben-Probleme vor Unterzeichnung:

**1. Haftungsgrenze (ROT — ablehnen wie geschrieben):**
Aktuell: 1 Monat Gebühren = 7.000 $ maximale Haftung (Sie zahlen 84 K$/Jahr)
Ihre Anfrage: "Mindestens 12 Monate Gebühren in den vorangegangenen 12 Monaten bezahlt (84.000 $)"
Fallback: "6 Monate Gebühren (42.000 $) mit unbegrenzten Ausschlüssen für Datenpanne und Betrug"
Warum sie zustimmen: Dies ist eine angemessene Industriestandardanfrage. Jeder seriöse Anbieter wird von 1 Monat abweichen.

**2. Benachrichtigung bei automatischer Erneuerung (GELB — zu verhandeln):**
Aktuell: 90-Tage-Mitteilungsfenster — leicht zu verpassen, besonders wenn die unterzeichnende Person geht
Ihre Anfrage: "60 Tage oder weniger"
Fallback: "90 Tage akzeptabel, wenn der Vertrag schriftliche Erinnerung vom Anbieter bei 120 Tagen umfasst"
Praktischer Fix: Stellen Sie sofort eine wiederkehrende Kalendererin nerung für [Verlängerungsdatum - 100 Tage] unabhängig davon, was im Vertrag steht.

**3. DPA / Datenschutz (ROT — erforderlich, nicht optional):**
Aktuell: Keine DPA angehängt, doch Sie verarbeiten Kunden-E-Mail-Adressen (Personendaten)
Ihre Anfrage: "Führen Sie die Standard-DPA des Anbieters vor Markteinführung aus, als Nachtrag zu dieser Vereinbarung"
Warum nicht verhandelbar: Wenn Sie DSGVO oder CCPA unterliegen, sind Sie gesetzlich verpflichtet, eine DPA mit jedem Verarbeiter zu haben, der Personendaten behandelt. Die meisten Anbieter haben eine Standard-DPA — fragen Sie einfach danach. Wenn sie keine haben, ist das ein rotes Warnzeichen über ihre Datenpraktiken.

**Was man weglassen sollte:** SLA-Guthaben, IP-Klauseln (vorausgesetzt kein kundenspezifische Entwicklung) und Anwendbares Recht sind auf diesem Ausgabenniveau niederrangiger.

---
