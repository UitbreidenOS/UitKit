# CS QBR-Vorbereitungs-Workflow

Vollständiger Vorbereitungsprozess für ein Quarterly Business Review — von der Datenerfassung bis zum Follow-up nach dem Gespräch — unter Verwendung von Claude Code, um die Vorbereitungszeit von 4–6 Stunden auf unter 60 Minuten zu reduzieren.

---

## Übersicht

Dieser Workflow deckt den vollständigen QBR-Lebenszyklus ab:

1. Datenerfassung (14 Tage vorher)
2. Gesundheitsbewertung und Risikoidentifikation (10 Tage vorher)
3. ROI-Quantifizierung (7 Tage vorher)
4. Präsentation und Gesprächspunkte (5 Tage vorher)
5. Vorbereitung vor dem Gespräch (1 Tag vorher)
6. Follow-up nach dem Gespräch (am selben Tag)

**Gesamte Vorbereitungszeit mit Claude Code:** 60–90 Minuten über die zwei Wochen vor dem QBR

**Wer führt das aus:** CSM, in Abstimmung mit AE und CS-Führung für strategische Accounts

---

## Phase 1 — Datenerfassung (14 Tage vorher)

**Ziel:** Alle Eingaben sammeln, bevor Claude geöffnet wird. Man kann nicht synthetisieren, was man nicht gesammelt hat.

**Checkliste der zu ziehenden Daten:**

**Aus der Produktanalyse:**
- Monatlich aktive Nutzer (letzte 3 Monate, Trend)
- Anmeldehäufigkeit und -aktualität
- Kernfunktions-Nutzung nach Funktion (welche Funktionen, wie oft)
- Seat-Auslastung (aktive Seats / lizenzierte Seats)
- Neu eingeführte Funktionen in diesem Quartal

**Aus dem CRM:**
- Alle Support-Tickets der letzten 90 Tage — Typen, Lösungszeiten, offene Probleme
- Alle CSM-Kontaktpunkte der letzten 90 Tage — Gesprächsnotizen, E-Mail-Threads
- NPS-Score (aktuellster) und Trend
- Stakeholder-Map — wer ist engagiert, wer wurde nicht kontaktiert, Personaländerungen

**Aus dem kommerziellen Bereich:**
- Aktueller ARR und Verlängerungsdatum
- Vertragsbedingungen — was enthalten ist, was gekauft vs. genutzt wurde
- Rechnungsstatus — aktuell oder überfällig
- Expansionsgespräche in diesem Quartal

**Vom Kunden:**
- Ihre angegebenen Erfolgskriterien bei Vertragsabschluss (aus Kickoff-Notizen)
- Aktuelle öffentliche Nachrichten zu ihrem Unternehmen — Mitarbeiterzahl, Produkteinführungen, Finanzierung, Führungswechsel

**Schritt 1.1 — Daten organisieren**

Ein einfaches Dokument mit Abschnitten für jede der obigen Kategorien erstellen. Einfügen, was vorhanden ist. Lücken sichtbar lassen — sie sind Signale, die vor dem QBR gefüllt werden müssen.

Bei Lücken in Produktdaten: 10+ Tage vor dem QBR beim Analyse- oder Datentam anfordern. Kurz vor dem QBR nach Nutzungsdaten zu suchen ist vermeidbar.

---

## Phase 2 — Gesundheitsbewertung und Risikoidentifikation (10 Tage vorher)

**Schritt 2.1 — Gesundheitsanalyse durchführen**

```
/health-score-analyzer

Analyse the health of [Customer Name] ahead of their QBR on [date].

[Paste all data gathered in Phase 1]

Produce:
1. Overall health score and risk tier
2. Top 3 risk signals (ranked by severity)
3. Top 3 positive signals (what's genuinely working)
4. Churn probability: low / medium / high
5. Expansion readiness: ready / not yet / blocked by [issue]
6. What needs to be addressed in the QBR vs. resolved before it
```

**Schritt 2.2 — QBR-Haltung bestimmen**

Basierend auf der Gesundheitsbewertung einen von drei QBR-Modi wählen:

**GRÜNER Account — Partnerschafts-QBR**
Ziel: Erfolge feiern, Beziehung vertiefen, Expansionsgespräch vorbereiten
Ton: kollaborativ, zukunftsorientiert
Expansion: in der Sitzung ansprechen — „Angesichts Ihrer Errungenschaften, was als Nächstes möglich ist"

**GELBER Account — Kurskorrektions-QBR**
Ziel: Die Blocker identifizieren und beheben, die die vollständige Wertschöpfung verhindern
Ton: ehrlich, lösungsorientiert
Expansion: nicht ansprechen, außer die Gesundheit verbessert sich deutlich — Vertrauen gewinnen

**ROTER Account — Erholungs-QBR**
Ziel: Problem anerkennen, konkrete Lösung präsentieren, Vertrauen wiederherstellen
Ton: direkt, verantwortungsbewusst — nicht mit guten Nachrichten beginnen, wenn die Beziehung beschädigt ist
Expansion: vollständig vom Tisch — auf Rettung des Accounts konzentrieren
Besondere Vorbereitung erforderlich: VP CS oder Führungskraft einbeziehen; Service-Gutschrift oder Abhilfeangebot vorbereiten, falls nötig

---

## Phase 3 — ROI-Quantifizierung (7 Tage vorher)

**Dies ist die wichtigste Folie in jedem QBR. Es werden spezifische Zahlen benötigt, keine vagen Aussagen.**

**Schritt 3.1 — Den ROI-Fall aufbauen**

```
/qbr-builder

Quantify the ROI [Customer Name] has received from our product this quarter.

Customer use case: [specific workflow they use our product for]
Contract value: $[X] ARR

Available data:
- Usage: [describe what you have — feature usage counts, user sessions, etc.]
- Success criteria from kickoff: [paste what was agreed at contract start]
- Any outcomes they've mentioned on calls: [paste relevant call notes]
- Industry benchmarks for this use case (if known): [X hours saved / X% efficiency gain]

ROI dimensions to quantify:
1. Time savings: [how much time does this use case save per user per week?]
2. Error reduction: [if applicable]
3. Revenue impact: [if their use of our product influences their revenue]
4. Headcount avoided: [if applicable]

Produce: ROI statement suitable for a QBR slide — specific numbers, their language, not product feature language.
```

**Regeln für die ROI-Folie:**
- Ihre Zahlen verwenden, nicht unsere. Ihre prozentuale Verbesserung ist wichtiger als unsere Funktionsliste.
- Wenn nicht quantifizierbar, ihre Worte verwenden. Zitate aus Gesprächsnotizen oder Support-Tickets sind gültig.
- Nie sagen „wir haben Ihnen geholfen, X zu tun." Sagen: „Sie haben X erreicht." Sie sind der Protagonist.
- Eine Folie, maximal drei Punkte. Den ROI nicht in einer Datenwand begraben.

**Schritt 3.2 — Nutzungsdaten für die Präsentation aufbereiten**

Eine saubere Datenzusammenfassung für das QBR-Deck erstellen:

| Metrik | Letztes Quartal | Dieses Quartal | Trend |
|---|---|---|---|
| Aktive Nutzer | [N] | [N] | [gestiegen/gleich/gesunken X%] |
| Kernfunktions-Nutzung | [N Mal] | [N Mal] | [Trend] |
| Seat-Auslastung | [X%] | [X%] | [Trend] |

---

## Phase 4 — Präsentation und Gesprächspunkte (5 Tage vorher)

**Schritt 4.1 — QBR-Struktur aufbauen**

```
/qbr-builder

Build the complete QBR structure for [Customer Name].

QBR date: [date]
Duration: [60 minutes]
Attendees (customer): [exec title, champion title, others]
Attendees (us): [CSM, AE if applicable]
QBR mode: [GREEN partnership / YELLOW course correction / RED recovery]
Primary goal: [retain / expand / relationship reset]

Context:
- Health score: [X/100]
- ROI delivered (from Phase 3): [paste ROI summary]
- Open issues to address: [list]
- Expansion opportunity (if GREEN): $[X], based on [signal]
- Competitive threat (if any): [describe]

Produce:
1. Full 60-minute agenda with time blocks
2. Talking points for each section — what to say and what to listen for
3. Questions to ask in each section (listen > talk)
4. How to handle if they raise [most likely objection or concern]
5. Expansion discussion framework (if GREEN account)
6. Renewal discussion timing and approach
```

**Schritt 4.2 — Agenda senden (5 Tage vorher)**

Die Agenda mindestens 5 Tage vor dem Termin an den Kunden senden — nicht am Vorabend.

E-Mail-Vorlage:
```
Subject: [Company] + [Your Company] — QBR Agenda, [Date]

Hi [Name],

Looking forward to our QBR on [date]. Sharing the agenda in advance so we can make the most of our time together.

[TIME] — [Topic 1]
[TIME] — [Topic 2]
[TIME] — [Topic 3]
[TIME] — [Topic 4: Next quarter goals and action items]

Before we meet, one question for you:
What would make this the most valuable [60] minutes for your team this quarter?

Feel free to add anything you'd like us to cover. See you on [date].

[CSM Name]
```

---

## Phase 5 — Vorbereitung vor dem Gespräch (1 Tag vorher)

**Schritt 5.1 — Das interne Team briefen**

Wenn der AE oder VP teilnimmt, vor dem Gespräch briefen:

```
/qbr-builder

Write an internal briefing for the [AE / VP CS] joining the QBR with [Customer Name] tomorrow.

Key points they need to know:
- Account health and the reason for the current rating
- Commercial situation: ARR, renewal date, churn risk if any
- The primary goal of this QBR
- One thing they should NOT bring up
- One thing they should reinforce if it comes up naturally
- Expansion opportunity (if applicable) — what it is and whether to raise it in this session

Keep it to half a page — they need context, not a full history.
```

**Schritt 5.2 — Die schwierige Frage antizipieren**

Jedes QBR hat ein unangenehmes Thema. Es identifizieren und die Antwort bereithalten.

Sich fragen: „Was ist das Eine, das ich hoffe, dass sie nicht ansprechen?" — genau dafür sollte man sich vorbereiten.

Die Antwort mit `/qbr-builder` vorbereiten und vor dem Gespräch laut üben.

**Schritt 5.3 — Abschlusskontrolle**

- Präsentation ist fertig und getestet (Bildschirmfreigabe funktioniert, Links sind aktiv)
- Alle Daten sind gezogen und formatiert
- Produktdemo (falls enthalten) ist geskriptet und wenn möglich auf der Kundenumgebung getestet
- Das Verlängerungsdatum des Kunden bis zur Woche bekannt — nicht ungefähr
- Bekannt ist, wer der wirtschaftliche Käufer ist und ob er im Gespräch sein wird

---

## Phase 6 — Während des QBR

**Goldenes Verhältnis: 40% Reden, 60% Zuhören.**

Wenn mehr als 40% der Zeit geredet wird, wird präsentiert — kein QBR geführt.

**Kritische Regeln:**
- Mit einer Frage eröffnen, nicht mit der Agenda
- Wenn sie eine Priorität oder Sorge nennen, diese sichtbar aufschreiben — es signalisiert, dass man es gehört hat
- Nicht defensiv auf Kritik reagieren — anerkennen, fragen, verstehen
- Den Abschnitt mit den Aktionspunkten nicht überspringen — immer mit dokumentierten nächsten Schritten, Verantwortlichen und Terminen schließen

**Wenn das Gespräch vom Thema abkommt:**
„Das ist wirklich wichtig — ich möchte sicherstellen, dass wir es richtig ansprechen. Können wir es parken und in den letzten 10 Minuten darauf zurückkommen? Ich möchte ihm die Zeit geben, die es verdient."

---

## Phase 7 — Follow-up nach dem Gespräch (am selben Tag, innerhalb von 2 Stunden)

**Schritt 7.1 — Follow-up-E-Mail**

```
/qbr-builder

Write the post-QBR follow-up email for [Customer Name].

The call was: [45/60/90 minutes] with [attendees]
What we covered:
- Key topics discussed: [list]
- Value delivered recap: [1-2 sentences]
- Issues raised by them: [describe]
- How I responded or what we committed to: [describe]
- Expansion discussion: [did it happen? What was the outcome?]
- Renewal: [what was discussed? Timeline?]

Action items agreed:
- [Action]: Owner [who], due [date]
- [Action]: Owner [who], due [date]

Next touchpoint: [date and format]

Write: professional, warm follow-up email that recaps the session, documents all commitments,
and confirms next steps. Send same day.
```

**Schritt 7.2 — CRM-Update**

Den Account im CRM innerhalb von 24 Stunden nach dem QBR aktualisieren:
- Health-Score (wenn nötig basierend auf dem Gespräch überarbeitet)
- Letztes QBR-Datum
- Nächstes Verlängerungsdatum bestätigt
- Expansionsmöglichkeit notiert (Betrag, Zeitplan, Status)
- Aktionspunkte als Aufgaben mit Fälligkeitsdaten
- Wichtige Zitate oder Signale vom Kunden

**Schritt 7.3 — Internes Debriefing**

Wenn ein Exec oder AE teilgenommen hat, eine 3-Zeilen-interne Zusammenfassung senden:
- Was gut gelaufen ist
- Welche Bedenken aufkamen
- Was der vereinbarte nächste Schritt ist

---

## QBR-Qualitätsbenchmarks

| Maßnahme | Grün | Gelb | Rot |
|---|---|---|---|
| QBR-Abschlussrate (% der berechtigten Accounts) | 100% | 75–99% | < 75% |
| Verlängerungsgespräch im QBR abgeschlossen | Ja | - | Nein (wird bei Verlängerung hektisch) |
| Aktionspunkte dokumentiert | Alle | Die meisten | Keine („tolles Gespräch!") |
| Follow-up am selben Tag gesendet | Ja | Nächster Tag | Später oder nie |
| Kunde bestätigt Datum vor Ablauf | 5+ Tage vorher | 1–4 Tage | Spontan am selben Tag |
| Identifizierte Expansionsmöglichkeiten | ≥ 1 pro GRÜNEM Account | - | Keine erkundet |

---
