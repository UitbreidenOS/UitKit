---
name: candidate-sourcer
description: "Passive Kandidatensuche: LinkedIn-Suchstrings, Boolean-Suche, Outreach-Nachrichtensequenzen und Pipeline-Tracking für Recruiter"
---

# Kandidaten-Sourcing-Skill

## Wann aktivieren
- Du hast eine offene Stelle ohne Bewerber und musst proaktiv suchen
- Die Qualität der eingehenden Bewerbungen ist niedrig und du musst passive Kandidaten finden
- Du benötigst einen Boolean-Suchstring, um spezifische Profile auf LinkedIn Recruiter oder Google zu finden
- Du schreibst die erste Outreach-Nachricht für einen passiven Kandidaten, der nicht aktiv sucht
- Du baust eine Sourcing-Pipeline auf — du musst 50+ Profile finden, mit denen du arbeiten kannst
- Du verfolgst eine Sourcing-Kampagne über mehrere Stellen gleichzeitig

## Wann NICHT verwenden
- Stellenbeschreibung schreiben — verwende dafür `/job-description`
- Kandidaten screenen oder interviewen — verwende `/interview-scorecard`
- Gehaltsangebote — verwende `/comp-benchmarker`
- Interne Mobilität oder Wiedereinstellungssituationen — anderes Gespräch und Prozess

## Anweisungen

### LinkedIn-Suchstring-Generator

```
Erstelle einen LinkedIn-Suchstring, um [Rolle]-Kandidaten zu finden.

Stelle: [Berufsbezeichnung]
Muss-Qualifikationen:
- [Fähigkeit oder Erfahrung 1]
- [Fähigkeit oder Erfahrung 2]
- [Zertifizierung, Tool oder Branchenerfahrung]

Wünschenswert:
- [Unterscheidungsmerkmal 1]
- [Unterscheidungsmerkmal 2]

Zielunternehmen (wo sie aktuell oder früher gearbeitet haben könnten):
- Direkte Wettbewerber: [Liste]
- Angrenzende Unternehmen mit übertragbaren Fähigkeiten: [Liste]
- Branchen, die starke Hintergründe für diese Rolle produzieren: [Liste]

Ausschließen:
- [Unternehmen, von denen du nicht einstellen möchtest — z.B. dein eigenes Unternehmen, Unternehmen mit schlechten Praktiken]
- [Auszuschließende Standorte]

Seniorität / Erfahrungsbereich:
- Jahre Erfahrung: [X-Y Jahre]
- Level: [IC / Manager / Director / VP]

Erstelle:

## LinkedIn Recruiter Boolean-String
(In LinkedIn Recruiter-Suche → Keyword-Feld verwenden)

("Stellenbezeichnung Variante 1" OR "Stellenbezeichnung Variante 2" OR "Stellenbezeichnung Variante 3")
AND ("Fähigkeit 1" OR "Fähigkeit 2")
AND ("Unternehmensname" OR "Unternehmensname 2")
NOT ("auszuschließender Begriff")

## Google X-Ray-Suche
(Zum Finden von LinkedIn-Profilen ohne Recruiter-Zugang)
site:linkedin.com/in "[Berufsbezeichnung]" "[Fähigkeit]" "[Standort]" -intitle:"profiles" -inurl:"dir/"

## Boolean-Logik erklärt
AND verwenden, um beide Begriffe zu verlangen
OR verwenden, um einen der Begriffe zu finden (breiter)
NOT verwenden, um Begriffe auszuschließen
Anführungszeichen für exakte Phrasen verwenden
Klammern zur Gruppierung der Logik verwenden

## Verfeinerungen
Wenn die Suche zu viele Ergebnisse liefert: AND mit einer weiteren erforderlichen Fähigkeit hinzufügen
Wenn zu wenige Ergebnisse: AND durch OR zwischen Schlüsselbegriffen ersetzen oder Unternehmensfilter entfernen
Ziel: 50-200 starke Profile für aktive Sourcing-Kampagne — nicht Tausende

## Parallel auszuführende Suchvariationen
Variation 1: [Fokus auf Berufsbezeichnung]
Variation 2: [Fokus auf Fähigkeiten]
Variation 3: [Fokus auf Unternehmen/Hintergrund]
```

### Outreach-Nachrichtenvorlagen

```
Outreach-Nachrichten für passives Kandidaten-Sourcing schreiben.

Stelle: [Berufsbezeichnung]
Unternehmen: [Dein Unternehmensname]
Was diese Stelle attraktiv macht: [3 spezifische Dinge — nicht generisch]
Kandidatenhintergrund: [Beschreibe, an wen du diese sendest — wahrscheinlicher Hintergrund und aktuelle Stelle]
Kanal: [LinkedIn InMail / E-Mail / Einführung durch gemeinsamen Kontakt]
Ton: [professionell / konversationell — passend zur Seniorität der Stelle]

Nachrichtenrahmen:

STRUKTUR (in dieser Reihenfolge):
1. Aufmerksamkeitsbrecher — nicht mit "Hallo, ich bin [Recruiter] von [Unternehmen]" beginnen
2. Relevanzsignal — warum genau diese Person
3. Stellen-Hook — 1 spezifisch überzeugendes Element der Stelle
4. Leichte Anfrage — niedrigschwelliger nächster Schritt, nicht "Haben Sie Interesse zu bewerben?"

---

VORLAGE A — LinkedIn InMail (unter 150 Wörter — direkt auf den Punkt kommen)

Betreff: [Stelle] bei [Unternehmen] — Ihre Arbeit bei [Ihr Unternehmen] aufgefallen

Hallo [Name],

[Spezifische Beobachtung zu ihrem Hintergrund — "Ihre Erfahrung bei [X] bei [Unternehmen] hat meine Aufmerksamkeit erregt, weil..."] — nicht "Ich bin auf Ihr Profil gestoßen."

Wir bauen [ein überzeugender Satz über das, was das Unternehmen tut — Phase, Mission, Dynamik].

Die [Stelle], an der ich arbeite, würde [spezifisch wirkungsvolles Element] übernehmen, und angesichts Ihres Hintergrunds in [spezifische Übereinstimmung] denke ich, dass es ein Gespräch wert ist.

Würde ein 20-minütiger Anruf diese Woche Sinn ergeben, um zu sehen, ob es eine Übereinstimmung gibt?

[Dein Name]

---

VORLAGE B — Warme Einführung durch gemeinsamen Kontakt (E-Mail)

Betreff: [Gemeinsamer Kontakt] hat mir empfohlen, Sie zu kontaktieren

Hallo [Name],

[Gemeinsamer Kontakt] erwähnte, dass Sie möglicherweise offen dafür wären, zu hören, was wir bei [Unternehmen] aufbauen — ich hoffe, es ist in Ordnung, dass ich mich direkt melde.

[Ein Satz zum Unternehmen — spezifisch, kein Standardtext.]

Die [Stelle], die ich besetzen möchte, ist [spezifischer Pitch — was sie übernehmen würden, mit wem sie arbeiten würden, warum jetzt].

Ich weiß, dass diese Gespräche am besten funktionieren, wenn es auf beiden Seiten eine echte Übereinstimmung gibt, also würde ich lieber sprechen, bevor ich etwas Formales sende. Würden 20 Minuten diese Woche passen?

[Dein Name]

---

VORLAGE C — Nachfassen (wenn nach 7 Tagen keine Antwort auf die erste Nachricht)

Hallo [Name],

Ich weiß, dass Sie nicht den ganzen Tag auf InMail starren — ich wollte dies nur einmal nach oben bringen, falls es vergraben war.

Wenn der Zeitpunkt nicht stimmt, kein Problem. Wenn Sie neugierig sind, was wir aufbauen, teile ich gerne mehr Kontext, bevor wir irgendein formales Gespräch beginnen.

[Dein Name]

---

Regeln:
- Die erste Zeile personalisieren — wenn du nichts Spezifisches über sie sagen kannst, nicht senden
- Eine klare Anfrage am Ende — 20-minütiger Anruf, nicht "Lassen Sie mich Ihre Gedanken wissen"
- Nie eine Stellenbeschreibung in der ersten Nachricht anhängen — das signalisiert Serienbrief
- Einmal nachfassen — danach weitergehen

Outreach-Nachrichten für [Stelle] generieren, zugeschnitten auf den [Kandidatentyp], den ich anspreche.
```

### Sourcing-Pipeline-Tracker

```
Sourcing-Pipeline-Tracker für [Stelle] erstellen.

Stelle: [Berufsbezeichnung]
Sourcing-Ziel: [X qualifizierte Kandidaten in der Pipeline, um 1 Einstellung zu erzielen]
Zieldatum für erste Einstellung: [Datum]

Pipeline-Mathematik (Faustregel für Recruiting-Konversionsraten):
- Identifizierte Profile → Versendete Outreach-Nachrichten: 30-50% (vor Outreach nach Qualität filtern)
- Versendete Outreach-Nachrichten → Antworten: 15-30% (passive Kandidaten haben niedrige Antwortquoten)
- Antworten → Interesse an Gespräch: 50-70% (von denjenigen, die antworten, sind die meisten neugierig)
- Bestandenes Telefonscreening → Weiter zum Panel: 40-60%
- Panel → Angebot: 30-50%
- Angebot → Annahme: 70-90%

Für 1 Einstellung rückwärts rechnen:
Zieldatum in [X Wochen]
Zu unterbreitende Angebote: ~1,5 (1 Ablehnung einplanen)
Bestandene Panel-Runden: ~3-4
Telefonscreenings: ~7-10
Interessierte Antworten: ~12-15
Versendete Outreach-Nachrichten: ~50-80
Identifizierte und qualifizierte Profile: ~100-150

Pipeline-Phasen-Tracker (in Notion, Airtable oder Google Sheets erstellen):

| Kandidat | Unternehmen | Stelle | Quelle | Phase | Letzter Kontakt | Nächste Aktion | Notizen |
|---|---|---|---|---|---|---|---|
| [Name] | [Unternehmen] | [Titel] | [LinkedIn / Empfehlung / Jobbörse] | [Identifiziert / Outreach gesendet / Geantwortet / Screening / Panel / Angebot / Abgelehnt / Eingestellt] | [Datum] | [Aktion + Datum] | [Notizen] |

Phasendefinitionen:
1. Identifiziert — auf LinkedIn gefunden, noch nicht kontaktiert
2. Outreach gesendet — erste Nachricht gesendet, auf Antwort wartend
3. Geantwortet — sie haben geantwortet, positiv oder um mehr Infos bittend
4. Telefonscreening — geplant oder abgeschlossen
5. Weitergekommen — zum Panel-Interview weitergeleitet
6. Panel — im Interviewprozess
7. Angebot — Angebot unterbreitet
8. Eingestellt / Abgelehnt / Pausiert

Wöchentlicher Sourcing-Rhythmus:
- Montag: Pipeline überprüfen, veraltete Kandidaten voranbringen oder schließen
- Dienstag bis Donnerstag: Neue Outreach-Nachrichten — 15-20 Nachrichten stapelweise senden
- Freitag: Nicht-Antworter nachfassen (nur 1 Nachfassen, nach 7 Tagen)

Sourcing-Plan mit Zeitplan, Pipeline-Zielen und Outreach-Zeitplan erstellen.
```

### Kandidaten-Recherchebriefing

```
Diesen Kandidaten recherchieren, bevor ich ihn kontaktiere oder interviewe.

Kandidat: [Name]
Aktuelles Unternehmen: [Unternehmen]
Aktuelle Stelle: [Titel]
LinkedIn: [URL oder Profildetails]

Kandidatenbriefing erstellen:

HINTERGRUNDÜBERSICHT
- Aktuelle Stelle und Betriebszugehörigkeit: [X Jahre bei Unternehmen — ist das eine typische oder ungewöhnlich kurze/lange Betriebszugehörigkeit?]
- Karriereweg: [Bewegt sich diese Person nach oben, seitwärts oder nach unten in der Seniorität?]
- Branchenerfahrung: [In welchen Branchen haben sie gearbeitet?]
- Unternehmenstypen: [Startup / Scale-up / Enterprise / Agentur — welche Umgebungen kennen sie?]
- Fähigkeiten und Tools: [Welche technischen oder fachlichen Fähigkeiten sind aus dem Profil ersichtlich?]

STELLENEIGNUNGSSIGNALE
- Relevante Erfahrung für [deine offene Stelle]: [stark / teilweise / Lücke]
- Im Interview zu schließende Lücke: [Was kann man dem Profil nicht entnehmen?]
- Mögliche Bedenken: [Gibt es etwas im Werdegang, das einer Erklärung bedarf?]

PERSONALISIERUNGSHAKEN FÜR OUTREACH
- Etwas Spezifisches zu erwähnen: [aktueller Beitrag / Unternehmensmeilenstein / Karriereschritt / gemeinsamer Kontakt]
- Was sie jetzt empfänglich machen könnte: [Ihr Unternehmen hat gerade entlassen / sie wurden gerade befördert — neue Stelle = wahrscheinlich bald nicht wechselnd]
- Was ihnen wahrscheinlich wichtig ist: [Karrierefortschritt / technische Herausforderung / Mission / Vergütung — aus dem Werdegang ableiten]

ERKENNTNISSE FÜR DAS INTERVIEW
- Worüber nachzufragen ist: [spezifische Übergänge oder Lücken im Profil]
- Wahrscheinliche Motivationen: [Warum könnten sie offen für einen Wechsel sein?]
- Wahrscheinliche Konkurrenzangebote: [Wer könnte sonst gerade ähnliche Profile einstellen?]

Kandidatenbriefing für [Name] erstellen.
```

## Beispiel

**Benutzer:** Ich suche einen Growth Marketing Manager für mein B2B-SaaS-Unternehmen in Amsterdam. Sie müssen Erfahrung mit bezahlter Akquisition (Google/Meta) und etwas SEO haben und idealerweise aus einem SaaS-Hintergrund kommen. Hilf mir, meine Suche und mein Outreach aufzubauen.

**Claudes Sourcing-Plan:**

**LinkedIn Boolean-Suche:**

```
("Growth Marketing Manager" OR "Performance Marketing Manager" OR "Digital Marketing Manager" OR "Growth Manager")
AND ("Google Ads" OR "paid acquisition" OR "PPC" OR "SEM")
AND ("SaaS" OR "B2B" OR "software")
AND (Amsterdam OR Netherlands OR "The Netherlands")
```

**Google X-Ray (ohne LinkedIn Recruiter):**
```
site:linkedin.com/in "growth marketing" ("google ads" OR "paid acquisition") "saas" "amsterdam"
```

**Zielunternehmen für die Suche:**
Unternehmen in Amsterdam mit SaaS-Geschäftsmodellen, aus denen Growth Marketer häufig stammen: Booking.com (Performance-Marketing-Talente), Adyen, MessageBird (jetzt Bird), Sendcloud, Picnic, Mews — auch Amsterdamer Agenturen, die bezahlte Werbung für SaaS-Kunden machen.

**Outreach-Nachricht — LinkedIn InMail:**

Betreff: Growth-Marketing-Stelle in Amsterdam — Ihr SaaS-Hintergrund ist aufgefallen

Hallo [Name],

Ihre Zeit bei [Ihrem Unternehmen] mit der Leitung von [spezifischem Kanal] hat meine Aufmerksamkeit erregt — insbesondere [spezifisches Element, das sie gemacht haben, wenn im Profil sichtbar].

Wir skalieren das Wachstum bei [Ihrem Unternehmen] — [Ein-Satz-Pitch: "ein B2B-SaaS-Tool, das von 2.000+ Logistikunternehmen in ganz Europa genutzt wird"] — und ich suche einen Growth Marketing Manager, der unsere bezahlte Akquisition und SEO-Aktivität vollständig übernimmt. Echte Eigenverantwortung, keine Ausführung für eine Agentur.

Würde ein 20-minütiger Anruf Sinn ergeben, um zu sehen, ob es hier etwas gibt?

[Name]

**Pipeline-Ziel:**
- Diese Woche 80-100 Profile identifizieren
- 30-40 Outreach-Nachrichten senden (vor dem Senden nach Qualität filtern)
- In 2 Wochen 6-10 Antworten erwarten
- 5-7 telefonisch screenen, 2-3 zum Panel weiterleiten
- In 6-8 Wochen ab Beginn des aktiven Sourcings 1 einstellen

---
