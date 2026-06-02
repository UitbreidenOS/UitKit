---
name: stakeholder-comms
description: "Entwürfe für Stakeholder-Kommunikation: Unternehmensankündigungen, sensible Updates, All-Hands-Vorbereitung, Board-Kommunikation und Krisenmanagement — für EAs und Chiefs of Staff, die Führungskräfte unterstützen"
---

# Skill: Stakeholder-Kommunikation

## Wann aktivieren
- Entwurf einer unternehmensweiten Ankündigung (Umstrukturierung, Führungswechsel, Produktpivot, Richtlinienänderung)
- Verfassen sensibler Kommunikation, die falsch verstanden werden könnte — Entlassungen, schlechte Nachrichten, schwierige Veränderungen
- Vorbereitung der Führungskraft für ein All-Hands-Meeting — Skript, Q&A-Vorbereitung, Kernbotschaften
- Entwurf von Board-Kommunikation — Meeting-Zusammenfassungen, außerordentliche Updates, sensible Anfragen
- Schreiben an Investoren, Partner oder Medien mit Präzision und Sorgfalt
- Jede Kommunikation, bei der das falsche Wort am falschen Platz ein echtes Problem verursacht

## Wann NICHT verwenden
- Routinemäßige interne Kommunikation ohne Risiko — Standard-E-Mail verwenden
- Rechtliche Einreichungen oder behördliche Meldungen — mit Rechtsberatung arbeiten
- Öffentliche Pressemitteilungen, die Media-Relations-Expertise erfordern — mit dem PR-Team koordinieren
- Echtzeit-Krisenkommunikation — dieser Skill hilft beim Entwerfen, nicht beim Echtzeit-Management

## Wichtig

Sensible Kommunikation — insbesondere rund um Entlassungen, Führungsübergänge und finanzielle Leistung — muss vor der Verteilung von Rechts- und HR-Abteilungen geprüft werden. Claude hilft effizient beim Entwerfen und beim Erkennen von Tonproblemen, ersetzt jedoch keine Rechtsprüfung.

## Anweisungen

### Prompt für Unternehmensankündigungen

```
Draft a company-wide announcement from [executive name/title].

ANNOUNCEMENT TYPE: [reorg / leadership change / product change / policy update / milestone / acquisition / partnership]

WHAT IS HAPPENING:
[The factual change — be specific]

WHY IT IS HAPPENING:
[The business rationale — honest, not spin]

WHAT IT MEANS FOR EMPLOYEES:
[How this affects their day-to-day, their teams, their roles — be specific]

WHAT IS NOT CHANGING:
[Anchor employees in stability where possible]

TIMING:
- When this takes effect: [date]
- When employees will hear more: [follow-up communication plan]

SENSITIVE ELEMENTS:
[Anything that needs to be handled carefully — impacted individuals, legal constraints, uncertainty]

AUDIENCE: [all employees / specific team / specific level / global or single region]
TONE: [confident and clear / empathetic and direct / formal / conversational]
LENGTH: [brief — under 300 words / full announcement — 400-600 words]

Draft the announcement. Lead with the news, not the context. People read the first sentence and decide whether to keep reading.
```

---

### Ankündigung eines Führungswechsels

```
Draft a leadership change announcement.

CHANGE TYPE: [new hire / departure / promotion / interim appointment / retirement]
PERSON: [name, current/new title]
EFFECTIVE DATE: [date]

CONTEXT:
- Why this change is happening: [strategic hire / performance / personal decision / retirement / reorg]
- What the person is known for (if external hire): [brief background]
- Where a departing leader is going (if known and they've agreed to disclose): [next step]

MESSAGING GOALS:
- About the departing leader (if applicable): [acknowledge contributions, warm send-off]
- About the incoming leader (if applicable): [establish credibility, inspire confidence]
- About stability: [reassure the team that the business continues well]

INTERNAL VS. EXTERNAL:
- Internal announcement: [honest, warm, includes context]
- External announcement (LinkedIn, press): [brief, positive framing, less internal context]
- Customer communication (if leader had customer-facing role): [reassure on continuity]

Draft all three versions if needed, or specify which.
```

---

### Kommunikation bei Entlassungen / Personalabbau

```
Draft layoff communications. This is among the most sensitive communication an executive sends.

CONTEXT:
- Number of employees affected: [N] ([X]% of workforce)
- Roles or teams affected: [describe or "company-wide / select roles"]
- Business reason: [honest, factual — e.g., "need to reduce spend to extend runway," "closing [division]"]
- Severance and benefits: [X weeks severance per year of service / benefits through X date / outplacement support]
- What's happening to impacted employees today: [meeting time, who informs them, how]

AUDIENCE OF THIS COMMUNICATION:
- All-company email: [goes to everyone simultaneously, after impacted employees have been personally notified]
- Manager talking points: [for people managers to use in 1:1 conversations]
- Survivor communication: [for those who are staying — often overlooked]

LEGAL REVIEW:
[Note whether legal has reviewed — this draft should be reviewed by legal/HR before sending]

PRINCIPLES FOR THIS DRAFT:
1. State the news clearly in the first sentence — do not bury it
2. Take responsibility — do not blame market conditions as though the company played no role
3. Be specific about support — severance, benefits, references, outplacement
4. Express genuine appreciation for the people leaving
5. Give the remaining team something to hold onto — why the company will succeed
6. Do not use corporate euphemisms ("parting ways," "letting go") — say "laid off"

Draft: all-company email and manager talking points. Flag any language that should be reviewed by legal.
```

---

### All-Hands-Meeting-Vorbereitung

```
Prepare the executive for an all-hands meeting.

MEETING DATE: [date]
AUDIENCE: [all employees / department / region]
DURATION: [X minutes]
FORMAT: [in-person / virtual / hybrid]

CONTEXT:
- Why this all-hands is happening: [routine quarterly / post-announcement / crisis / milestone]
- What employees are feeling right now: [your read — anxious / excited / frustrated / uncertain]
- Key topics to cover: [list]

EXECUTIVE'S KEY MESSAGES (3-5 max — people remember 3 things):
1. [Most important thing you want them to walk away with]
2. [Second message]
3. [Third message]

TOUGH Q&A (questions the exec will likely face):
[List 5-8 difficult questions employees might ask — especially the ones no one wants to answer]

For each question:
- The honest answer (even if partial)
- If you can't answer: a genuine "here's what I can and can't share, and when you'll know more"
- Never: a non-answer that insults the audience's intelligence

Generate:
1. Opening script (2-3 minutes — how to start the all-hands)
2. Key messages talking points (not a full script — bullets to guide)
3. Closing (how to end — specific and motivating, not generic)
4. Q&A preparation (hard questions + honest answers)
5. Audience read: what does the team need to hear emotionally, not just factually?
```

---

### Board-Kommunikation — außerordentliches Update

```
Draft an off-cycle board communication from the executive.

COMMUNICATION TYPE: [bad news update / milestone announcement / request for approval / strategic change / financial reforecast]
BOARD MEMBERS: [N board members — [lead investor, independent directors]]

THE UPDATE:
- What is happening: [the situation]
- Why you're communicating off-cycle: [urgency or significance]
- What you need from the board: [information only / decision / vote / support]
- Timeline: [when decision is needed, if applicable]

FRAMING:
- Are you in control of the situation? [yes / mostly / no — calibrate tone accordingly]
- What's the business impact? [revenue / runway / legal / reputational]
- What's your plan? [describe your response or plan of action]

Board communications should be:
- Direct — state the news in the first sentence
- Brief — boards want facts and what's needed, not narrative
- Specific — include numbers where relevant
- Action-oriented — what do you need from them and when?

Draft the board update email. Under 400 words. Attach supporting materials if relevant.
```

---

### Zusammenfassung des Board-Meetings

```
Draft a post-board-meeting summary to distribute to the board.

BOARD MEETING DATE: [date]
ATTENDEES: [list]

DECISIONS MADE:
[List each decision with specifics — who approved what]

KEY DISCUSSIONS:
[Bullet points for major topics discussed — not a transcript, the substance]

ACTION ITEMS:
| Action | Owner | Due Date |
|---|---|---|
| [action 1] | [name] | [date] |
| [action 2] | [name] | [date] |

NEXT BOARD MEETING: [date, format, location]

MATERIALS DISTRIBUTED:
[List all materials shared at or before the meeting]

Draft the board meeting summary. Professional, factual. Under 300 words excluding the action items table.
```

---

### Sensible 1:1-Kommunikation — Führungskraft an direkten Mitarbeiter

```
Draft a sensitive communication from an executive to a direct report.

SITUATION: [performance conversation / role change / compensation decision / difficult feedback / recognition]
EXECUTIVE: [name, title]
RECIPIENT: [name, title]
RELATIONSHIP: [long-tenured / new hire / high performer / performance managed]

THE MESSAGE:
- What needs to be communicated: [the substance]
- Tone: [supportive / firm / celebratory / corrective]
- What the person needs to hear: [the emotional reality — are they surprised? expecting this? resilient?]
- What the exec wants as an outcome: [behavior change / retention / clarity / acknowledgment]

CONSTRAINTS:
[Legal constraints, HR involvement, anything that must be included or excluded]

Draft the written version of this communication (email or talking points for a conversation). 
Do not make it clinical or cold. Do not make it so soft the message is unclear.
Strike the balance: direct, specific, professional, and human.
```

---

### Interne Krisenkommunikation

```
Draft internal crisis communication.

CRISIS TYPE: [data breach / product outage / legal action / regulatory action / reputational / financial]
SEVERITY: [1 = existential / 2 = significant but manageable / 3 = contained]
CURRENT STATUS: [what is known vs. unknown right now]

FACTS (only confirmed — mark anything uncertain):
- What happened: [confirmed facts]
- When: [timeline]
- Who is affected: [employees / customers / partners / public]
- Current status: [contained / ongoing / under investigation]
- What we are doing: [response actions underway]

WHAT WE DON'T KNOW YET:
[Be explicit — employees trust leaders who acknowledge uncertainty over those who fake certainty]

AUDIENCE: [all employees / leadership team / customer-facing teams]

FIRST COMMUNICATION GOALS:
1. Acknowledge the situation honestly
2. State what we know and don't know
3. Describe what we're doing
4. Tell people where to direct questions
5. Commit to a follow-up communication by [time]

Draft the initial internal communication. Under 300 words. Clear, calm, factual.
Draft talking points for managers who will receive questions from their teams.
```

## Beispiel

**Nutzer:** Unser CEO muss ankündigen, dass wir unser Londoner Büro schließen und den 12 Mitarbeitern anbieten, remote zu arbeiten oder freiwillig aus dem Unternehmen auszuscheiden. Das Unternehmen ist profitabel, aber das Büro kostet 40.000 £/Monat und das Team ist seit COVID ohnehin größtenteils remote. Wir brauchen eine E-Mail an alle Mitarbeiter, Gesprächsleitfaden für den Londoner Manager und eine Nachricht speziell an die 12 betroffenen Mitarbeiter.

**Erwartete Ausgabe:** Drei Dokumente. E-Mail an alle Mitarbeiter: beginnt im ersten Satz mit „wir schließen das Londoner Büro", erklärt die Begründung (Kosteneffizienz, Team arbeitet bereits erfolgreich remote), nennt das Datum des Inkrafttretens, beschreibt, was das für die 12 Betroffenen bedeutet (freiwilliges Ausscheiden oder formale Remote-Regelungen), und was sich für alle anderen ändert (nichts — business as usual). Gesprächsleitfaden für den Londoner Manager: Was zu sagen ist, wenn Teammitglieder fragen „warum jetzt", wie mit emotionalen Reaktionen umzugehen ist, wie der Prozess für freiwilliges Ausscheiden aussieht. Direkte Nachricht an die 12 Betroffenen: wärmerer Ton, konkret zu ihren Optionen, konkret zum Unterstützungspaket, drückt aufrichtige Wertschätzung aus, nennt den HR-Kontakt für Fragen.

---

> **Mit uns arbeiten:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
