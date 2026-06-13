# Vertragsprüfungs-Workflow

Ein wiederholbarer Workflow zum Prüfen, Triagieren und Bearbeiten eingehender Verträge — vom Empfang bis zur Unterzeichnung oder Überarbeitung, mit vollständigem Audit-Trail. Deckt NDAs, Lieferantenverträge, Kundenverträge und Arbeitsangebote ab.

Dieser Workflow ist für eine interne Rechtsabteilung (eine Person bis kleines Team) konzipiert. Schwellenwerte und Eskalationsregeln an die Risikobereitschaft und das Dealvolumen der eigenen Organisation anpassen.

---

## Übersicht

```
Receipt → Triage → Risk classification → Review → Redline / negotiate → Escalate if needed → Sign-off → File
```

Gesamte verstrichene Zeit pro Vertragstyp:
- NDA (Standard): 10–15 Minuten
- NDA (nicht Standard): 30–45 Minuten
- Lieferanten-MSA (geringe Komplexität): 45–60 Minuten
- Lieferanten-MSA (hohe Komplexität): 2–4 Stunden + externer Rechtsbeistand
- Kundenvertrag (Standardvorlage): 20–30 Minuten
- Kundenvertrag (verhandelt): 1–2 Stunden + kommerzielle Prüfung

---

## Schritt 1 — Empfang und Aufnahme

**Ziel:** Jeder Vertrag ist protokolliert, zugewiesen und hat eine Frist, bevor mit der Arbeit begonnen wird.

**Aufnahme-Checkliste:**

```markdown
New Contract Intake — [CONTRACT NAME]

Received from: [name, company, email]
Received date: [date]
Contract type: [NDA / MSA / SOW / employment / lease / other]
Direction: [we are the customer / we are the vendor / mutual]
Commercial context: [deal size, relationship importance, what business decision depends on this]
Signing deadline: [date stated or implied]
Assigned to: [legal team member]
Review deadline: [signing deadline minus 2 days for internal review]
```

**Triage-Faustregel:**
- Unterzeichnungsfrist heute → alles andere liegen lassen
- Unterzeichnungsfrist innerhalb von 3 Tagen → heute prüfen
- Keine Frist angegeben → 5 Werktage annehmen; mit dem Anforderer bestätigen
- Externer Rechtsbeistand erforderlich → sofort kennzeichnen und einleiten; nicht auf vollständige interne Prüfung warten

---

## Schritt 2 — Schnelle Triage (5 Minuten)

**Ziel:** Bestimmen, wie viel Aufmerksamkeit dieser Vertrag benötigt, bevor eine vollständige Prüfung durchgeführt wird.

```
/nda-review

Fast triage for: [CONTRACT TYPE]
[Paste contract text]

Give me in 60 seconds:
1. Contract type: [standard template / custom / unusual]
2. Overall complexity: [low / medium / high]
3. Any immediate red flags visible without a full read: [yes / no — describe]
4. Recommended review depth: [5 min skim / 30 min review / full review + counsel]
5. Does this need external counsel? [yes / no / maybe — reason]
```

**Entscheidungstore:**
- Einfaches NDA, erkennbar als Standard (CDA, MNDA)? → 10-minütige Prüfung mit Schritt 3A
- Komplexe Vereinbarung mit individuellen kommerziellen Bedingungen? → Vollständige Prüfung mit Schritt 3B
- Regulierte Vereinbarung (Finanzdienstleistungen, Gesundheitswesen, regulierte Daten)? → Sofort externer Rechtsbeistand

---

## Schritt 3A — NDA-Prüfung (Schnellverfahren)

**Ziel:** Das NDA in unter 15 Minuten triagieren. Die meisten NDAs bestehen entweder oder haben ein behebbares Problem.

```
/nda-review

Review this NDA fully.

[Paste NDA text]

Our role: [disclosing / receiving / mutual]
Context: [why we're signing — sales conversation / vendor assessment / partnership / M&A]

Produce:
1. NDA type: mutual / one-way (which direction)
2. Term: [duration of confidentiality obligation]
3. Scope: is the definition of Confidential Information too broad? Too narrow?
4. Standard exclusions present: public information, prior knowledge, independent development, compelled disclosure — yes/no for each
5. Red flags: any unusual provisions, overly broad restrictions, perpetual obligations, non-standard remedies
6. Non-compete or non-solicitation buried in the NDA: yes/no
7. Governing law: where? Is it acceptable?
8. Recommendation: sign as-is / request one change / redline / reject / send to counsel
```

**Häufige NDA-Probleme, auf die zu achten ist:**
- Definition von vertraulichen Informationen umfasst „alle geteilten Informationen" ohne Ausnahmen
- Keine Standardausnahmen (öffentliche Domäne, Vorwissen, unabhängige Entwicklung)
- Ewige Geheimhaltungspflicht (Marktstandard sind 3–5 Jahre)
- Verbietet uns, ihre Mitarbeiter ohne Gegenseitigkeit einzustellen
- Gerichtsstand in einem Bundesstaat/Land, wo Streitigkeiten für uns unpraktisch wären
- Einseitiges NDA, wo ein gegenseitiges angemessener wäre

---

## Schritt 3B — Vollständige Vertragsprüfung

**Ziel:** Systematische Abdeckung aller wesentlichen Bestimmungen mit ROT/GELB/GRÜN-Klassifizierung.

```
/contract-review

Full contract review for: [CONTRACT TYPE]
[Paste full contract text]

Our role: [customer / vendor / licensor / licensee]
Our concerns: [IP protection / data security / payment terms / liability / termination]
Our company: [size, stage, industry — for context on market standards]
Deal value: $[X] over [term]

Produce a structured review:

RED (blocking — must fix before signing):
For each: [clause name] | [section] | [exact clause language] | [issue] | [impact] | [suggested fix]

YELLOW (negotiate — push back but not a dealbreaker):
For each: [same format]

GREEN (acceptable — standard market terms):
[Brief summary — "payment terms, IP ownership, and governing law are all market standard"]

MISSING CLAUSES:
[List clauses that should be present but are absent]

OVERALL RISK: [HIGH / MEDIUM / LOW]
RECOMMENDATION: [sign / redline and return / reject / send to counsel]
```

**Universelle Checkliste — jeden Vertrag auf Folgendes prüfen:**

```typescript
const UNIVERSAL_CONTRACT_CHECKS = [
  // LIABILITY
  'Is liability capped? At what amount? Is the cap adequate for the deal size?',
  'Are consequential damages excluded? Any carve-outs (IP breach, data breach, fraud)?',
  'Is indemnification mutual? Capped? Any uncapped indemnification obligations?',

  // IP
  'Who owns IP created under this agreement? Work for hire?',
  'Are input materials (our data, tools, content) protected?',
  'Any IP license granted? Scope — exclusive/non-exclusive, perpetual, irrevocable?',

  // TERMINATION
  'Can either party terminate for convenience? Notice period?',
  'What happens to our data on termination? Export window? Deletion timeline?',
  'Any termination fees or lock-in beyond notice period?',

  // DATA AND PRIVACY
  'Is personal data involved? Is there a DPA or data processing annex?',
  'Sub-processor restrictions: can they use our data with third parties?',
  'Data breach notification: do they commit to notifying us? Timeframe?',

  // PAYMENT
  'Payment terms: net-30, net-60, or other?',
  'Late payment penalties: interest rate, suspension of service?',
  'Price change provisions: unilateral right to increase pricing?',
  'Auto-renewal: notice period to cancel? Sufficient lead time?',

  // GOVERNING LAW AND DISPUTE RESOLUTION
  'Governing law jurisdiction: is it acceptable? Is it the same for both parties?',
  'Dispute resolution: litigation, arbitration, or mediation first?',
  'Any class action waiver or limitation on remedies?',
]
```

---

## Schritt 4 — Redlines erstellen

**Ziel:** Eine klar markierte überarbeitete Version, die die Gegenpartei prüfen und darauf reagieren kann.

```
/contract-review

Produce a redline for this contract based on these required changes:

RED issues to fix:
[List each RED issue with the proposed replacement language]

YELLOW issues — proposed positions:
[For each YELLOW: our preferred position, acceptable fallback, walk-away point]

Additional missing clauses to add:
[List each missing clause with proposed draft language]

Format output as:
For each change:
- Section reference
- Original language: [exact quote]
- Redlined to: [replacement language]
- Rationale (1 sentence): [why we need this]

This rationale is for internal use — do not include in the document sent to the counterparty.
```

**Verhandlungshaltung nach Problemtyp:**

| Problemtyp | Unsere Forderung | Akzeptabler Rückfall | Abbruchpunkt |
|---|---|---|---|
| Unbegrenzte Entschädigung | Deckelung auf 12 Monate Gebühren | Deckelung auf Deal-Wert | Keine Deckelung — muss behoben werden |
| Gerichtsstand (falscher Ort) | Unser Gerichtsstand | Gegenseitiger Gerichtsstand (z. B. England) | Gerichtsstand der Gegenpartei, wenn nachteilig |
| IP-Eigentum an unseren Eingaben | Ausdrückliche Ausnahme unserer Daten | „Außer Materialien, die wir bereitstellen" | Übertragung unseres geistigen Eigentums — muss behoben werden |
| Datenlöschung bei Kündigung | 30-Tage-Fenster + Zertifizierung | 60-Tage-Fenster | Kein Löschrecht — DPA-Ergänzung erforderlich |
| Kündigungsfrist bei automatischer Verlängerung | 60 Tage | 30 Tage | < 14 Tage (unzureichende Frist) |

---

## Schritt 5 — Eskalation und externer Rechtsbeistand

**An externen Rechtsbeistand eskalieren, wenn:**
- Jeder Vertrag mit einem Wert > $[eigener Schwellenwert, z. B. 250.000 $] jährlich
- Jede Vereinbarung mit regulierten Tätigkeiten (Finanzdienstleistungen, Gesundheitswesen, Daten als Dienstleistung)
- Rechtsstreitrisiko vorhanden (Entschädigungsansprüche, IP-Streit)
- Unbekannter Gerichtsstand (außerhalb der Expertise des Teams)
- Vergleichs-, M&A- oder Finanzierungsdokumente
- Jede Bestimmung, bei der nach Verwendung von Claude Unsicherheit besteht — immer Unsicherheit eskalieren

**Briefing für externen Rechtsbeistand:**

```
External counsel brief for: [CONTRACT NAME]

Business context:
- What we are trying to do: [deal description]
- Why this is important: [commercial importance]
- Signing deadline: [date]
- Our preferred outcome: [sign / negotiate specific points / walk away]

What we've done:
- RED issues identified: [list]
- YELLOW issues identified: [list]
- Our proposed positions: [list]

What we need from counsel:
- [Specific legal questions — e.g. "Is this indemnification clause enforceable in California?"]
- [Risk assessment: "How much exposure does the uncapped indemnification create?"]
- [Redline review: "Are our proposed redlines market standard and reasonable?"]

Budget: [X hours at $Y/hour]
Deadline: [when we need the advice]
```

---

## Schritt 6 — Genehmigung und Ausführung

**Checkliste vor der Unterzeichnung:**

```
Before any contract is signed:
- [ ] All RED issues resolved (either fixed or signed off by authorised person with documented reason)
- [ ] YELLOW issues: either negotiated to acceptable position, or business sponsor accepted the risk in writing
- [ ] Governing law confirmed acceptable
- [ ] Signatories confirmed: do we and the counterparty have the right people signing?
  - Check signatory authority limits (who can bind the company at what dollar amount)
  - Board approval required? (check your authorisation matrix)
- [ ] Execution method: DocuSign / wet ink / notarised — confirmed correct for this jurisdiction and contract type
- [ ] Final version confirmed — no version control confusion
- [ ] Date of signing confirmed — any deferred effective date?
```

**Unterschriftsberechtigungs-Matrix (Vorlage — an das eigene Unternehmen anpassen):**

| Vertragswert | Wer kann unterzeichnen |
|---|---|
| < 10.000 $ | Abteilungsleiter |
| 10.000 $ – 50.000 $ | VP / Direktor |
| 50.000 $ – 250.000 $ | CFO oder CEO |
| > 250.000 $ | CEO + Vorstandsgenehmigung |
| Jede IP-Abtretung oder Exklusivität | CEO + Rechtsprüfung |
| Arbeitsverträge | HR-Direktor + CEO |

---

## Schritt 7 — Ablegen und Nachverfolgen

**Ziel:** Jeder unterzeichnete Vertrag ist abgelegt, durchsuchbar und hat Verlängerungs-/Kündigungsdaten nachverfolgt.

```
Contract filing record:

Contract name: [company — contract type — date]
Counterparty: [company name, registered address, contact]
Type: [NDA / MSA / SOW / employment / other]
Effective date: [date]
Term: [X years / until terminated]
Auto-renewal: [yes / no — if yes, notice period and next renewal date]
Termination date / notice by: [date]
Value: $[X] [one-time / annual / monthly]
Governing law: [jurisdiction]
Key obligations on us: [2-3 bullets]
Key rights for us: [2-3 bullets]
Filed in: [contract management system / Notion / Google Drive — exact path]
Reviewed by: [legal team member]
```

**Verlängerungs-Tracking:**
- Kalendererinnerung 90 Tage vor jeder Frist zur Kündigung einer automatischen Verlängerung setzen
- Kalendererinnerung 30 Tage vor Vertragsablauf für Neuverhandlungen setzen
- Jeder Vertrag mit einer Verlängerung in den nächsten 6 Monaten: aktuelle Konditionen und kommerziellen Bedarf vor dem Verlängerungsdatum prüfen

---

## Schnellreferenz nach Vertragstyp

### NDAs
- Schnellverfahren: Schritt 3A
- Zielprüfungszeit: 10–15 Minuten
- Häufigstes Problem: ewige Geheimhaltung + keine Standardausnahmen
- Wann externen Rechtsbeistand einschalten: wenn Wettbewerbsverbote, Abwerbungsverbote oder IP-Bestimmungen enthalten sind, die für ein NDA ungewöhnlich sind

### Lieferanten-MSAs (SaaS, Dienste, professionelle Dienste)
- Vollständige Prüfung: Schritte 3B + 4
- Zielprüfungszeit: 45–90 Minuten
- Häufigste Probleme: Datenverarbeitung (kein DPA), automatische Verlängerung, unbegrenzte Entschädigung
- Externer Rechtsbeistand: Verträge > $[Schwellenwert] oder regulierter Dienst

### Kundenverträge (wir sind der Lieferant/Anbieter)
- Variantenprüfung: mit unserer Standardvorlage vergleichen
- Zielprüfungszeit: 20–30 Minuten bei naher Vorlage; länger bei überarbeiteten Versionen
- Häufigste Probleme: Kunden fügen belastende SLAs hinzu, IP-Eigentum an unserer Plattform, Datenportabilitätsanforderungen
- Externer Rechtsbeistand: Enterprise-Verträge > $[Schwellenwert] oder öffentlicher Sektor

### Arbeitsverträge
- Gegen lokale arbeitsrechtliche Anforderungen prüfen
- Häufigste Probleme: Durchsetzbarkeit von Wettbewerbsverboten variiert je nach Staat/Land, Umfang der IP-Abtretung, Kündigungsfristen
- Externer Rechtsbeistand: immer bei leitenden Neueinstellungen; zumindest stichprobenweise bei Junior-Einstellungen in neuen Gerichtsbarkeiten

---

## Master-Vertragsprüfungs-Checkliste

```markdown
# Contract Review: [CONTRACT NAME — DATE]

**Received:** [date]
**Deadline:** [date]
**Assigned:** [legal team member]
**Status:** [ ] Received | [ ] Triaged | [ ] Reviewed | [ ] Redlined | [ ] Negotiated | [ ] Signed | [ ] Filed

## Triage
- [ ] Contract type identified
- [ ] Signing deadline confirmed
- [ ] External counsel needed: yes / no / TBD
- [ ] Business sponsor identified and briefed

## Review
- [ ] Full /contract-review run
- [ ] RED issues: [number] identified
- [ ] YELLOW issues: [number] identified
- [ ] Missing clauses: [list]

## Redline
- [ ] RED issues: all proposed fixes drafted
- [ ] YELLOW issues: positions documented (ask / fallback / walk-away)
- [ ] Redlined version sent to counterparty
- [ ] Counterparty response received and reviewed

## Sign-off
- [ ] All RED issues resolved or accepted risk documented
- [ ] Signatory authority confirmed
- [ ] Final version confirmed — no further changes
- [ ] Signed by authorised person on our side
- [ ] Countersigned received and confirmed authentic

## Filing
- [ ] Signed copy filed in [location]
- [ ] Contract record created in tracker
- [ ] Renewal/termination calendar reminders set
- [ ] Business team notified of key obligations
```

---
