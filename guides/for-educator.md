# Claude for Educators and Course Creators

Everything a teacher, professor, instructional designer, or course creator needs to run AI-augmented lesson planning, curriculum development, student feedback analysis, assessment design, and content creation in Claude Code.

---

## Who this is for

You are a teacher, lecturer, instructional designer, L&D professional, or independent course creator. You spend enormous time planning lessons, writing assessments, creating content, and interpreting student feedback — work that happens before and after class, rarely during paid hours. Claude Code compresses the preparation work so you can spend more time on what only you can do: actual teaching, mentoring, and responding to learners in the moment.

**Before Claude Code:** 3 hours to plan a well-structured lesson from scratch. 2 hours to create a quiz with quality questions. 90 minutes to make sense of 30 open-ended feedback surveys.

**After:** Lesson plan in 20 minutes. Quiz with answer key in 15 minutes. Feedback synthesis in 10 minutes.

---

## 30-second install

```bash
# Install educator skills
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill small-business/online-course-creator
npx claudient add skill small-business/newsletter-publisher
npx claudient add skill productivity/lit-review

# Install the scientific researcher agent
npx claudient add agent roles/scientific-researcher
```

---

## Your Claude Code educator stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/lesson-planner` | Full lesson plan: objectives, activities, assessments, differentiation, materials | Any new lesson or adaptation |
| `/student-feedback-analyzer` | Analyze survey results and assessment data: themes, gaps, improvements | After feedback collection, after assessments |
| `/online-course-creator` | Full course structure: modules, learning paths, video scripts, quizzes, sales copy | Building a course for a platform (Teachable, Thinkific, etc.) |
| `/newsletter-publisher` | Course newsletter or email sequence for learners — drip content, engagement | Community building, ongoing learner communication |
| `/lit-review` | Literature and research review for course content — evidence-based teaching | Academic courses, research-backed curriculum |

### Agent

| Agent | Model | When to spawn |
|---|---|---|
| `scientific-researcher` | Opus | Deep literature review, evidence-based curriculum development, academic research |

---

## Daily workflow

### Before class (20-30 minutes prep)

**1. Lesson plan — preparing a new lesson**
```
/lesson-planner

Build a lesson on [topic] for [audience].

Duration: [X minutes]
Format: [in-person / online / hybrid]
Prior knowledge: [what they already know]
Objectives: [what they'll be able to do after — or let Claude draft these]
Key constraints: [technology available, class size, any accessibility needs]

Generate the full lesson plan with timing, activities, and an exit ticket.
```

**2. Assessment design — for tomorrow's quiz or project brief**
```
/lesson-planner

Design an assessment for [lesson topic].

Learning objectives: [list from the lesson plan]
Assessment type: [quiz / short answer / project / presentation rubric]
Time allowed: [X minutes / X days]
Bloom's level: [recall / application / analysis / evaluation]

Generate questions with an answer key, and a rubric for any open-ended components.
```

---

### After class / end of unit

**3. Feedback analysis — making sense of survey data**
```
/student-feedback-analyzer

Analyze feedback from [course/lesson name].

Quantitative ratings: [paste your survey averages]
Open-ended responses (anonymized): [paste all responses]

What patterns are there? What should I change next time? What worked?
```

**4. Assessment debrief — what the results tell you**
```
/student-feedback-analyzer

My class just completed [assessment name].

Class average: [X]%
Score distribution: [paste]
Question-by-question breakdown: [paste correct-rate per question]
Objectives assessed: [list]

Where are the learning gaps? What do I reteach? What was mastered?
```

---

### Course development (longer-term work)

**5. Online course structure**
```
/online-course-creator

Build the course structure for a course on [topic].

Target audience: [who they are, prior knowledge]
Format: [self-paced video / cohort-based / bootcamp]
Length: [X weeks / X hours of content]
Platform: [Teachable / Thinkific / Udemy / internal LMS]
Learning goals: [main transformation — what can they do after?]

Generate: module outline, lesson sequence, assessment points, completion activities.
```

**6. Literature review for course content**
```
/lit-review

Research the evidence base for [teaching methodology / topic area].

I'm designing a course on [topic] and want to make sure the curriculum is evidence-based.
What does the research say about [specific aspect of your curriculum]?
Any landmark papers or consensus findings I should know?
```

---

### Community and learner engagement

**7. Learner email sequence**
```
/newsletter-publisher

Write an email sequence for enrolled learners in [course name].

Sequence purpose: [onboarding / weekly check-in / re-engagement / celebration]
Tone: [encouraging / professional / conversational]
Key messages for [this email or this week]: [describe]
Length: [short — 150 words / full — 300 words]
```

---

## 30-day ramp plan (new educators or new course)

### Week 1 — Lesson planning foundation
- Install all educator skills: `npx claudient add skill productivity/[name]`
- Use `/lesson-planner` to plan your next 3 lessons — compare to what you'd normally do
- Run the learning objectives writer on each lesson — sharpen vague goals into measurable outcomes
- Build your first exit ticket and use it in class

### Week 2 — Assessment and feedback
- Use `/lesson-planner` to design one assessment — generate the questions and rubric
- After the assessment, paste results into `/student-feedback-analyzer` — practice interpreting data
- Run one exit ticket analysis — what should you address at the start of next class?

### Week 3 — Feedback and improvement
- Send a mid-course feedback survey (5 questions max)
- Use `/student-feedback-analyzer` to analyze the results
- Make at least one visible change based on feedback — and tell students you made it (builds trust and response rates for future surveys)

### Week 4 — Course development
- Use `/online-course-creator` if you're building a course, or use `/lesson-planner` to map out the next unit
- Use `/lit-review` to verify one major teaching approach in your curriculum is evidence-based
- Track time: how long does lesson planning take now vs. before Claude?

---

## Content creation workflows

### Building a quiz (end-to-end)

```
/lesson-planner

Design a quiz for [lesson/unit topic].

Learning objectives being assessed:
1. [Objective]
2. [Objective]
3. [Objective]

Question types needed: [MCQ / short answer / true-false / fill-in-the-blank / case-based]
Difficulty level: [introductory / intermediate / advanced]
Total questions: [N]
Time allowed: [X minutes]
Bloom's levels to cover: [recall: X questions / application: X questions / analysis: X questions]

Generate: the quiz with answer key, distractors for MCQs that target common misconceptions, and a grading rubric for open-ended questions.
```

### Building a rubric

```
/lesson-planner

Design a grading rubric for [assignment type: essay / project / presentation / lab report].

Learning objectives this assesses: [list]
Assignment description: [brief description of what students submit]
Point scale: [4-point / percentage / letter grade / standards-based]

Generate a rubric with:
- 4-5 dimensions (criteria)
- 4 performance levels per dimension (excellent / proficient / developing / beginning)
- Clear, behavioral descriptors for each cell — not vague language like "shows understanding"
```

### Writing slide deck talking points

```
I have a presentation on [topic] with these slides:

Slide 1: [title and key point]
Slide 2: [title and key point]
[Continue]

For each slide, write:
- 2-3 sentences of talking points (what to say, not what's on the slide)
- One discussion question to ask the class after this slide
- One common misconception to preemptively address
```

### Workshop facilitation guide

```
Write a facilitation guide for a [X-hour] workshop on [topic].

Audience: [who they are]
Goal: [what they should leave able to do or think about differently]
Format: [in-person / virtual / hybrid]
Group size: [N participants]

Generate:
1. Pre-work to assign (if any)
2. Room/platform setup instructions
3. Icebreaker or opener (connects to the workshop theme)
4. Main activities with facilitation notes
5. Discussion questions for each segment
6. Common facilitation challenges and how to handle them
7. Closing reflection and action commitment
8. Post-workshop email to send participants
```

---

## Tool integrations

### Google Classroom / Canvas / Blackboard
Claude generates lesson plans, quiz questions, rubrics, and announcements as text → you paste into your LMS. For quiz questions specifically, format Claude's output as numbered questions → import using your LMS bulk import feature.

### Google Forms / Microsoft Forms
Claude writes your feedback survey questions → paste into Forms → collect → export CSV → paste responses back into `/student-feedback-analyzer`. The full loop takes about 15 minutes once data is collected.

### Notion (for course organization)
Build your course structure in Notion — one page per lesson. Claude generates lesson plan content → paste into each page. Use Notion's database to track which lessons have exit ticket data and feedback collected.

### Canva (for visual materials)
Claude writes the content of slides, handouts, and infographics → you design in Canva. Use Claude to write specific, clear bullet points — Canva works best when the copy is already tight.

### Zoom / Google Meet
After online synchronous sessions, paste chat transcripts or session notes into `/meeting-to-action` to extract discussion points and unanswered questions for follow-up.

---

## Metrics to track

| Activity | Manual time | With Claude |
|---|---|---|
| Lesson plan (new topic) | 3 hours | 20-30 min |
| Quiz with answer key | 90 min | 15 min |
| Assignment rubric | 45 min | 10 min |
| Feedback survey analysis | 90 min | 15 min |
| Assessment data analysis | 60 min | 20 min |
| Workshop facilitation guide | 3 hours | 30 min |

**What to do with time saved:** More one-on-one student support, more responsive feedback on student work, deeper lesson personalization, professional reading and development.

---

## Common mistakes (and how Claude Code prevents them)

**Mistake 1: Vague learning objectives**
`/lesson-planner` forces Bloom's taxonomy verbs — no more "understand" or "appreciate." Objectives become measurable.

**Mistake 2: Assessments that test recall when objectives require application**
`/lesson-planner` maps assessment questions to objectives by Bloom's level. Misalignment is visible.

**Mistake 3: Feedback data that never leads to changes**
`/student-feedback-analyzer` ends with specific actionable recommendations. The output is a to-do list, not a report.

**Mistake 4: Lessons with no check for understanding**
Every lesson plan from `/lesson-planner` includes an exit ticket. If the lesson is too short, it's a formative question embedded in the activity.

**Mistake 5: Teaching the same way year after year because redesign takes too long**
With Claude, a course refresh that used to take a week takes a day. The activation energy for improvement drops dramatically.

---

## Resources

- [Getting started with Claude Code](getting-started.md)
- [Lesson planner skill](../skills/productivity/lesson-planner.md)
- [Student feedback analyzer skill](../skills/productivity/student-feedback-analyzer.md)
- [Online course creator skill](../skills/small-business/online-course-creator.md)
- [Literature review skill](../skills/productivity/lit-review.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
