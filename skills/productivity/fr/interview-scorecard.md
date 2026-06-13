---
name: interview-scorecard
description: "Grille d'évaluation d'entretien structurée : questions basées sur les compétences, référentiel d'évaluation et modèle de débriefing pour des décisions de recrutement cohérentes et résistantes aux biais"
---

# Compétence : Grille d'Évaluation d'Entretien

## Quand activer
- Vous avez un poste ouvert et avez besoin d'un processus d'entretien structuré avant le premier entretien candidat
- Vous souhaitez réduire la subjectivité des recruteurs et les décisions d'embauche basées sur l'instinct
- Vous devez former de nouveaux intervieweurs à évaluer un poste pour lequel ils n'ont jamais recruté
- Vous préparez un entretien spécifique et souhaitez des questions ciblées en fonction du profil du candidat
- Votre processus de débriefing est incohérent — les gens votent pour ou contre sans apporter de preuves
- Vous construisez un processus de recrutement pour un type de poste jamais pourvu (nouvelle fonction, nouveau niveau de séniorité)

## Quand NE PAS utiliser
- Vous avez seulement besoin d'une fiche de poste — utilisez `/job-description` pour cela
- Sourcing de candidats — utilisez `/candidate-sourcer`
- Analyse comparative des rémunérations — utilisez `/comp-benchmarker`
- Conversations de prise de références — compétence différente
- Lorsque vous avez déjà interviewé le candidat et rédigez une évaluation de mémoire sans notes (ne reconstruire qu'à partir des notes réelles de l'entretien)

## Instructions

### Constructeur de grille d'évaluation

```
Build a structured interview scorecard for [role].

Role: [Job title]
Level: [IC / Manager / Director / VP / C-suite]
Department: [Engineering / Sales / Marketing / CS / Ops / Finance]
Key responsibilities: [top 3-5 things this person will own]
Must-have competencies: [3-5 non-negotiable skills or traits]
Nice-to-have: [2-3 differentiators that separate good from great]
Deal-breakers: [specific backgrounds, signals, or traits that disqualify]

Build a scorecard with:

## Competencies to evaluate (4-6 per role)
For each competency:
- Name: [e.g., "Analytical thinking" / "Executive communication" / "Ownership mentality"]
- Definition: [exactly what does strong look like for this role at this level?]
- Why it matters: [how does this competency directly impact success in the role?]
- 2-3 interview questions:
  Question 1: [behavioural — "Tell me about a time you..."]
  Question 2: [situational — "How would you approach..."]
  Question 3 (optional): [follow-up probe — "What would you do differently?"]
- Evidence to look for in answers:
  Strong signal: [specific language, examples, or behaviour patterns]
  Weak signal: [vague answers, can't give examples, deflects responsibility]
  Red flag: [specific answer patterns that disqualify]

## Scoring rubric (for each competency)
4 — Exceptional: [specific description — goes beyond role requirements]
3 — Strong: [meets and consistently exceeds expectations]
2 — Developing: [inconsistently meets expectations — coaching needed]
1 — Not a fit: [below bar for this role at this level]

## Overall recommendation
Based on scores:
Average ≥ 3.5 → Strong Hire
Average 3.0-3.4 → Hire with reservations (note them)
Average 2.5-2.9 → No Hire (gaps too significant)
Average < 2.5 → Clear No Hire

## Debrief template
After each interview, each interviewer completes:
- Competency assessed: [which of the 4-6 competencies were you evaluating?]
- Evidence collected: [specific examples the candidate gave — quote them]
- Score per competency: [1-4 for each]
- Overall score: [1-4]
- Overall recommendation: [Strong Hire / Hire / No Hire / Strong No Hire]
- Top reason for recommendation: [1-2 sentences, evidence-based]
- Questions for the panel: [anything you want other interviewers to probe on]

Generate the full scorecard for [role].
```

### Bibliothèque de questions basées sur les compétences

```
Generate competency-based interview questions for [competency].

Competency: [e.g., "Customer obsession" / "Data-driven decision making" / "Cross-functional influence"]
Role level: [IC / Manager / Senior IC / Director]
Function: [Sales / Engineering / Product / Marketing / Operations]

Question format: always behavioural STAR-format (Situation, Task, Action, Result)

Generate:
- 3 primary questions (open-ended, behavioural, specific to this competency)
- 2 follow-up probes (dig deeper when answers are vague or too high-level)
- 1 situational/hypothetical (for roles where candidates lack direct experience)

For each question, provide:
What you're testing: [the specific sub-skill within this competency]
Strong answer looks like: [concrete, specific, owns the outcome, quantifies if possible]
Weak answer looks like: [vague, says "we" not "I", no clear outcome, blame-shifts]
Red flag in this answer: [avoids the question, makes up a story, contradicts resume]

Common competencies for SaaS/tech roles:
- Problem-solving under ambiguity
- Stakeholder communication and influence
- Data-driven decision making
- Customer empathy and obsession
- Ownership and accountability
- Learning agility and growth mindset
- Collaboration and conflict resolution
- Execution and delivery under pressure
- Strategic thinking and prioritisation
- Building and developing teams (manager-level)

Generate the question library for [competency].
```

### Conception du panel d'entretien

```
Design the interview panel structure for [role].

Role: [title]
Total interview stages: [X] (recommend 3-5 stages — more than 5 loses candidates)
Interview format: [remote / in-person / hybrid]
Decision-maker: [hiring manager]
Time to fill target: [X weeks]

Recommended panel design:

STAGE 1 — Recruiter screen (20-30 min, phone)
Purpose: Qualify basics — compensation, availability, motivation, communication
Who: Recruiter
Evaluates: culture fit baseline, communication, deal-breakers

STAGE 2 — Hiring manager screen (30-45 min, video)
Purpose: Assess technical competency and role fit at a high level
Who: Hiring manager
Evaluates: [top 2 competencies for this role]
Outputs: decision to advance or pass — no ambiguous "maybes" without specifics

STAGE 3 — Technical / skills assessment (varies)
Purpose: Role-specific evaluation — presentation, case study, take-home, live exercise
Who: Hiring manager + 1-2 domain experts
Format: [choose — live case / take-home with debrief / work sample / portfolio review]
Rule: Make it realistic and relevant — no trick questions, nothing that takes > 2 hours

STAGE 4 — Panel interviews (60-90 min total, 2-3 interviews back-to-back)
Purpose: Assess breadth of competencies from multiple perspectives
Who: 2-3 team members from relevant functions
Each interviewer gets assigned 1-2 competencies to evaluate — no overlap
Interviewers do NOT share impressions before debrief

STAGE 5 — Executive / leadership interview (30-45 min, optional for senior roles)
Purpose: Culture, leadership values, strategic fit
Who: Hiring manager's manager or C-suite
Evaluates: Vision alignment, communication at executive level, ambition

DEBRIEF PROCESS:
- Each interviewer submits scorecard within 24 hours of interview
- Debrief meeting: 30-45 min with all panel members
- Structured: each person shares score + evidence before any discussion
- No one changes their score because of group pressure — note disagreements
- Decision: Hire / No Hire / Extend process

Design the interview panel for [role].
```

### Guide de facilitation du débriefing

```
Facilitate the interview debrief for [candidate] for [role].

Candidate: [Name]
Role: [Title]
Interview panel:
- [Interviewer 1] — evaluated [competency A, B]
- [Interviewer 2] — evaluated [competency C, D]
- [Interviewer 3] — evaluated [competency E, F]

Debrief structure (follow this order — do NOT allow free-form discussion to start):

RULE: Scores and evidence before opinions. No one should influence others before sharing their own assessment.

1. Go around: each interviewer shares score per competency and overall recommendation
   - "My overall is [Strong Hire / Hire / No Hire / Strong No Hire] because [1 specific piece of evidence]"
   - No commentary from others until all scores are on the table

2. Note disagreements
   - If two interviewers differ by more than 1 point on the same competency: discuss
   - "You scored data-driven decision making a 4; I scored it a 2. Let's share what we observed."
   - Goal: reach evidence-based consensus, not averaging or deferring to seniority

3. Aggregate scores
   - Average per competency across all interviewers
   - Overall average
   - Hiring bar: [your threshold — e.g., 3.0+ overall]

4. Explicit decision discussion
   - If strong consensus → move to offer or rejection
   - If split panel → the hiring manager makes the call and documents the reason
   - Never leave debrief with "let me think about it" — commit to a decision

5. If hire: What onboarding needs does this candidate have?
   - Gaps to address in 30-60-90 plan
   - Who should be their early mentor or buddy?

6. If no hire: feedback to recruiter
   - Which competency was the disqualifier?
   - Is this candidate worth keeping in pipeline for a different role?
   - Was there a sourcing/screening issue upstream?

Produce debrief summary and hiring decision.
```

## Exemple

**Utilisateur :** Je recrute un Responsable Customer Success. Il gérera 3 CSM et supervisera un portefeuille de 4 M$ ARR. Quelle grille d'évaluation dois-je utiliser ?

**Grille d'évaluation de Claude :**

**Responsable Customer Success — Grille d'Évaluation d'Entretien**

**Compétences à évaluer :**

**1. Sens commercial (pilotage du Net Revenue Retention)**
Questions :
- « Parlez-moi d'une fois où vous avez élaboré une stratégie de renouvellement pour un client à risque. Quel a été le résultat ? »
- « Comment pensez-vous à l'équilibre entre la santé client et les objectifs d'expansion — et comment avez-vous géré cette tension ? »
Question de suivi : « Que feriez-vous différemment si vous deviez mener à nouveau ce renouvellement ? »
Point fort : Parle spécifiquement du NRR comme indicateur, montre qu'il comprend l'économie de l'expansion, pas seulement de « rendre les clients heureux »
Signal d'alarme : Définit le succès CS uniquement par la satisfaction/NPS sans contribution au chiffre d'affaires

**2. Management et développement de l'équipe**
Questions :
- « Parlez-moi d'un CSM que vous avez développé alors qu'il était en sous-performance. Qu'avez-vous fait et que s'est-il passé ? »
- « Comment structurez-vous les 1:1 et vous assurez-vous que votre équipe se développe professionnellement, au-delà de l'atteinte de leurs chiffres ? »
Point fort : Personne précise, action de coaching précise, résultat avant/après. Montre qu'il peut distinguer le coaching du licenciement.
Signal d'alarme : « Je fixe des attentes claires et je tiens les gens responsables » — décrit les résultats, pas le comportement managérial réel.

**3. Gestion des relations avec les dirigeants**
Questions :
- « Parlez-moi d'un dirigeant chez un client qui était mécontent de votre produit. Comment avez-vous géré cela ? »
- « Comment obtenez-vous et conservez-vous l'engagement des sponsors exécutifs sur des comptes où votre produit est utilisé opérationnellement mais pas stratégiquement ? »
Point fort : A agi de manière proactive, a pris en charge la relation, a escaladé en interne si nécessaire, résultat clair.
Signal d'alarme : A géré toutes les escalades via le champion plutôt qu'en s'engageant directement avec le dirigeant.

**4. Opérations CS pilotées par les données**
Questions :
- « Décrivez le modèle de score de santé que vous avez construit ou amélioré. Quels signaux avez-vous utilisés et comment l'avez-vous validé ? »
- « Comment priorisez-vous le temps de votre équipe sur un portefeuille de 50+ comptes ? »
Point fort : Peut nommer des signaux précis, expliquer les compromis, décrire comment il a mesuré la précision prédictive.
Signal d'alarme : Le score de santé se base sur le « ressenti » + la fréquence de connexion uniquement. Pas de mention de validation ou d'itération.

**5. Influence transversale (Produit et Ingénierie)**
Question : « Parlez-moi d'une fois où vous avez plaidé pour un besoin client en interne et où vous avez soit gagné, soit perdu. Quel était le processus et que feriez-vous différemment ? »
Point fort : A construit un argumentaire avec des données de revenus, a collaboré avec le Produit plutôt que de l'exiger, a influencé sans autorité directe.
Signal d'alarme : Se plaint que « le Produit n'écoute jamais le CS ». Ne décrit pas son propre rôle dans la dynamique.

**Seuil global : moyenne de 3,0+ pour recruter à ce niveau.**

---
