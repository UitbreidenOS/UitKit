---
name: student-feedback-analyzer
description: "Schüler-Feedback und Bewertungsergebnisse analysieren: Muster identifizieren, Wissenslücken aufdecken, Unterrichtseffektivität bewerten und Verbesserungsempfehlungen generieren"
---

# Skill: Schüler-Feedback-Analyzer

## Wann aktivieren
- End-of-Lesson- oder End-of-Course-Feedback-Umfragen wurden erhoben
- Bewertungsergebnisse liegen vor und es muss verstanden werden, was Schüler gelernt haben und was nicht
- Qualitatives Feedback (offene Antworten) liegt vor und Themen müssen extrahiert werden
- Planung des nächsten Jahreskurses oder der nächsten Einheit mit datengetriebenen Entscheidungen
- Eine Schüler-Kohorte erbringt unterdurchschnittliche Leistungen und die Ursache muss diagnostiziert werden
- Peer-Review der Unterrichtseffektivität erfordert strukturierte Belege

## Wann NICHT verwenden
- Individuelle Benotung oder Bewertung von Schülern — das erfordert Ihre Fachkompetenz und Kenntnis des Schülers
- Prädiktive Analysen, die statistische Modellierungswerkzeuge erfordern — dafür Python/R verwenden
- Datenschutzrelevante Daten mit personenbezogenen Informationen — vor der Weitergabe an Claude anonymisieren

## Datenschutzhinweis

Niemals Schüler-Feedback mit Namen oder anderen personenbezogenen Informationen einfügen, sofern diese nicht bereits anonymisiert sind. Aggregierte, anonymisierte Antworten sind sicher zu analysieren.

## Anweisungen

### End-of-Course-Feedback-Analyse

```
Analyze this student feedback from [course name / lesson name].

COURSE/LESSON: [title]
INSTRUCTOR: [your name or anonymous]
COHORT: [number of students, grade level or professional context]
RESPONSE RATE: [N responses out of N enrolled]
COLLECTION METHOD: [survey / exit ticket / focus group / written reflection]

QUANTITATIVE RATINGS (paste your data):
[For each rating question: question text + average score + score distribution]
Example:
- "Overall course quality" — avg: 4.2/5 — distribution: 5★: 40%, 4★: 35%, 3★: 18%, 2★: 5%, 1★: 2%
- "Clarity of instruction" — avg: 3.8/5 — distribution: [paste]
- "Relevance to my goals" — avg: 4.5/5 — distribution: [paste]
- [Continue for all rated questions]

OPEN-ENDED RESPONSES (paste all responses — anonymized):
"What worked well?"
[Paste all responses]

"What could be improved?"
[Paste all responses]

"What had the most impact on your learning?"
[Paste all responses]

"Any other comments?"
[Paste all responses]

Analyze and generate:
1. Overall feedback summary (2-3 sentences, honest assessment)
2. Strongest elements (what students consistently valued)
3. Consistent criticisms (patterns in negative feedback — not one-offs)
4. Knowledge or skill gaps implied by the feedback
5. Actionable improvement recommendations (specific, not vague)
6. One surprising finding (something you might not have expected)
7. Suggested changes for the next iteration
```

---

### Analyse von Bewertungsergebnissen

```
Analyze assessment results to identify learning gaps.

ASSESSMENT: [quiz / exam / project / assignment / standardized test]
COURSE/UNIT: [name]
COHORT: [N students]
ASSESSMENT DATE: [date]

OVERALL PERFORMANCE:
- Class average: [X]% / [X]/[total points]
- Median: [X]%
- Standard deviation: [X]
- Score distribution: [e.g., 90-100%: 8 students, 80-89%: 12, 70-79%: 6, below 70%: 4]

QUESTION-LEVEL ANALYSIS (paste for each question):
Question 1: [topic/concept tested] — correct: [X]% — avg score: [X/X]
Question 2: [topic] — correct: [X]% — avg: [X/X]
[Continue for all questions]

LEARNING OBJECTIVE MAPPING:
Objective 1: [text] — assessed by Q[numbers] — average performance: [X]%
Objective 2: [text] — assessed by Q[numbers] — average performance: [X]%
[Continue]

NOTABLE PATTERNS IN WRONG ANSWERS:
[If you tracked common error types, list them: "40% of students chose B instead of D on Q7 — what does that tell us?"]

Generate:
1. Summary of overall performance (was this assessment appropriate difficulty?)
2. Learning objectives that were mastered (≥ 80% average)
3. Learning objectives that are gaps (< 70% average)
4. Specific misconceptions suggested by the wrong answer patterns
5. Questions about your teaching: which concepts need to be retaught or re-explained?
6. Recommendations for reteaching: what approach would address the identified gaps?
7. Differentiation insight: are some students consistently struggling while others thrive? (don't name students)
```

---

### Extraktion von Themen aus qualitativem Feedback

```
Extract themes from open-ended student feedback.

CONTEXT: [what you asked / what course]
TOTAL RESPONSES: [N]

RAW RESPONSES (anonymized):
[Paste all text responses, one per line or separated by "---"]

Analyze for:

POSITIVE THEMES:
- Identify the top 3-4 things students consistently praised
- Quote 1-2 representative responses per theme
- Estimated frequency: what % of responses mentioned this theme?

IMPROVEMENT THEMES:
- Identify the top 3-4 consistent complaints or suggestions
- Quote 1-2 representative responses per theme
- Estimated frequency
- Distinguish: is this a preference complaint (they wanted more lecture) vs. a genuine gap (they didn't understand X)?

OUTLIER FEEDBACK:
- Responses that don't fit the patterns — highly positive outliers, highly negative outliers, unusual suggestions
- Are any of these actionable even if one person said it?

EMOTIONAL REGISTER:
- Was feedback generally positive, mixed, or negative in tone?
- Any signs of disengagement, frustration, or confusion beyond what the rating scores show?

ACTIONABILITY RATING:
For each theme: [Easy to act on / Requires curriculum change / Structural constraint / Not actionable]
```

---

### Analyse der Unterrichtseffektivität

```
Analyze my teaching effectiveness based on these data sources.

INSTRUCTOR: [you / anonymous]
COURSE: [name, level]
TERM/PERIOD: [when]

DATA SOURCES (provide what you have):
- Student feedback survey ratings: [paste averages per question]
- Assessment performance data: [class averages on key assessments]
- Attendance/completion rates: [X% attendance / X% assignment completion]
- Open-ended feedback themes: [paste or summarize]
- Any peer observation notes: [paste if applicable]

SELF-ASSESSMENT:
What did you feel went well? [your own reflection]
What felt off or difficult? [your reflection]
What would you do differently? [your initial thoughts]

TEACHING GOALS FOR THIS COURSE:
[What were you explicitly trying to do — e.g., "more active learning, fewer lectures" / "improve exam pass rates" / "increase engagement with real-world examples"]

Generate:
1. Strengths analysis: what the evidence says you did well
2. Development areas: what the evidence suggests to improve
3. Alignment check: are students experiencing what you intended to create?
4. Comparison of your self-assessment to student evidence: where do you agree/disagree with your own students?
5. 3 specific development priorities for your next iteration
6. If applicable: professional development recommendation (workshop, coaching, peer observation focus)
```

---

### Schnelle Exit-Ticket-Analyse

Für schnelle Feedback-Verarbeitung zwischen Unterrichtsstunden:

```
Quickly analyze these exit ticket responses. I have 5 minutes between classes.

LESSON TOPIC: [topic]
LEARNING OBJECTIVE: [what students should be able to do]
NUMBER OF RESPONSES: [N]

EXIT TICKET QUESTION 1 (recall/knowledge):
[Paste all responses]

EXIT TICKET QUESTION 2 (application):
[Paste all responses]

EXIT TICKET QUESTION 3 (muddiest point — "what's still unclear?"):
[Paste all responses]

Give me:
1. % who demonstrated mastery on Q1 and Q2 (rough estimate)
2. Top 2-3 things still unclear from Q3
3. What I should address at the START of next class (under 2 minutes)
4. Who might need individual follow-up (based on pattern, not names)

Under 150 words. I need to read this fast.
```

---

### Kohorten-Vergleichsanalyse

```
Compare performance and feedback across two versions or cohorts of the same course.

COURSE: [name]
COHORT A: [description — term, format, cohort characteristics]
COHORT B: [description]

QUANTITATIVE COMPARISON:
| Metric | Cohort A | Cohort B | Difference |
|---|---|---|---|
| Avg assessment score | [X]% | [X]% | [+/-X%] |
| Feedback rating (overall) | [X]/5 | [X]/5 | [+/-] |
| Completion rate | [X]% | [X]% | [+/-] |
| [Other metric] | [X] | [X] | [+/-] |

WHAT CHANGED BETWEEN COHORTS:
[List any teaching changes, curriculum changes, format changes, or cohort differences]

QUALITATIVE COMPARISON (themes):
Cohort A strongest feedback themes: [list]
Cohort B strongest feedback themes: [list]
Cohort A biggest complaints: [list]
Cohort B biggest complaints: [list]

Analyze:
1. Did the changes you made improve learning outcomes? (what evidence supports this)
2. What else might explain the differences (cohort characteristics, external factors)
3. What to keep from the changes
4. What to revert or try differently
```

---

### Kursverbesserungsbericht

```
Generate a course improvement report based on all available data.

COURSE: [name and version]
INSTRUCTOR: [name]
TERM: [period]

DATA SUMMARY:
- Student feedback (overall rating): [X/5]
- Assessment average: [X]%
- Completion rate: [X]%
- Top positive feedback themes: [list]
- Top improvement feedback themes: [list]
- Key knowledge gaps identified: [list]

TEACHING CHANGES I MADE THIS TERM (vs. prior version):
[List any deliberate changes]

MY REFLECTION:
[Your honest assessment of what worked and what didn't]

Generate a structured course improvement report:

## Performance Summary
[2-3 sentences on overall outcomes]

## What Worked (Keep)
[Evidence-based list of elements to retain]

## What Didn't Work (Change)
[Evidence-based list with specific replacement strategies]

## Knowledge Gap Remediation Plan
[For each identified gap: how to address it in the next iteration]

## 3 Priority Changes for Next Iteration
[Specific, actionable changes ranked by expected impact]

## Open Questions
[Things the data raised that you still don't know how to answer]
```

## Beispiel

**Nutzer:** End-of-Course-Umfrage aus einem 20-köpfigen Unternehmens-Training zu „Stakeholder-Kommunikation." Quantitativ: Gesamtqualität 4,1/5, Inhaltsrelevanz 4,6/5, Tempo 3,4/5 (niedrigster Wert), Aktivitäten 4,3/5, Instruktionsklarheit 3,9/5. Offene Antworten auf „Was könnte verbessert werden": 8 Antworten erwähnen „zu viel Inhalt für die Zeit", 5 erwähnen „wollte mehr Übungsszenarien", 2 erwähnen „die Vormittagssitzungen waren zu lang", 1 erwähnt, Folien waren schwer zu lesen. Offene Antworten auf „Was hat am besten funktioniert": 12 erwähnen die Fallstudienübung, 7 die Kleingruppendisskussionen, 3 konkrete Beispiele aus ihrer Branche.

**Erwartete Ausgabe:** Zusammenfassung — der Inhalt war hochrelevant, aber das Tempo war die klare Schwäche. Stärkste Elemente: die Fallstudie und die Kleingruppendisskussion. Häufigste Kritik: Inhaltsdichte im Verhältnis zur Zeit (40 % der Teilnehmer), unzureichende Übung (25 %). Handlungsempfehlungen: 20 % des Inhalts kürzen, um Luft zu lassen (die Relevanz-Bewertung zeigt, dass der richtige Inhalt vorhanden ist — das Problem ist das Volumen), ein zweites Übungsszenario hinzufügen, das einen Teil der Vorlesungszeit ersetzt, den Vormittag in zwei kürzere Blöcke mit einer Pause aufteilen. Eine Erkenntnis: Das Tempo-Problem und der Wunsch nach mehr Übung sind dasselbe Problem — wenn der Zeitplan zu eng ist, wird die Übung gestrichen. Eines lösen, löst beide.

---
