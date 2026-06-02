# Educator / Teacher Workspace — Project Structure

> A Claude Code workspace for K-12 teachers and university instructors managing daily lesson planning, curriculum design, differentiated instruction, assessment creation, student feedback, and parent/admin communication — all driven by slash commands and course-level context.

## Stack

- **Google Classroom** or **Canvas LMS** — assignment distribution, grade book, student submission tracking
- **Google Workspace** (Docs, Slides, Forms, Drive) — lesson documents, slide decks, quizzes, shared resources
- **Notion** — curriculum planning boards, unit maps, semester calendars
- **Turnitin** — academic integrity checks on submitted work
- **Kahoot** or **Pear Deck** — interactive formative assessments and live polling
- **Slack** or **Microsoft Teams** — staff and department communication
- **Google Meet** or **Zoom** — parent conferences, remote instruction, office hours

## Directory tree

```
educator-workspace/
├── .claude/
│   ├── CLAUDE.md                                    # workspace instructions for Claude Code
│   ├── settings.json                                # MCP servers, hooks, permissions
│   └── commands/
│       ├── lesson-plan.md                           # /lesson-plan <topic> <grade-level> — full lesson plan with objectives, activities, checks
│       ├── assignment-builder.md                    # /assignment-builder — creates assignment prompt with instructions and submission criteria
│       ├── rubric-creator.md                        # /rubric-creator — generates scored rubric for any assignment type
│       ├── student-feedback.md                      # /student-feedback <student-id> — generates personalized written feedback
│       ├── parent-email.md                          # /parent-email <student-id> <topic> — drafts parent communication by tone and context
│       ├── differentiation.md                       # /differentiation <lesson-file> — produces tiered versions of a lesson for 3 levels
│       └── quiz-builder.md                          # /quiz-builder <topic> <num-questions> — creates quiz with answer key and rubric
├── curriculum/
│   ├── sy2025-2026/                                 # academic year root
│   │   ├── scope-and-sequence.md                   # full-year unit map with standards alignment and pacing
│   │   ├── semester-1/
│   │   │   ├── unit-01-introduction/
│   │   │   │   ├── unit-overview.md                # essential questions, enduring understandings, standards (e.g., CCSS.ELA-LITERACY.RI.6.1)
│   │   │   │   ├── pacing-guide.md                 # day-by-day schedule, benchmark checkpoints
│   │   │   │   └── standards-alignment.md          # mapped to state/national standards with evidence links
│   │   │   ├── unit-02-narrative-writing/
│   │   │   │   ├── unit-overview.md
│   │   │   │   ├── pacing-guide.md
│   │   │   │   └── standards-alignment.md
│   │   │   └── unit-03-research-skills/
│   │   │       ├── unit-overview.md
│   │   │       ├── pacing-guide.md
│   │   │       └── standards-alignment.md
│   │   └── semester-2/
│   │       ├── unit-04-argumentative-writing/
│   │       │   ├── unit-overview.md
│   │       │   ├── pacing-guide.md
│   │       │   └── standards-alignment.md
│   │       └── unit-05-literature-circles/
│   │           ├── unit-overview.md
│   │           ├── pacing-guide.md
│   │           └── standards-alignment.md
├── lessons/
│   ├── _template/                                   # copy this when creating a new lesson
│   │   ├── lesson-plan.md                           # learning objectives, materials, procedure, checks for understanding, closure
│   │   ├── slides-outline.md                        # Google Slides deck outline (title, warm-up, direct instruction, practice, exit ticket)
│   │   └── differentiation-notes.md                 # below-grade, on-grade, above-grade scaffolds and extensions
│   ├── 2026-09-08-intro-to-thesis-statements/
│   │   ├── lesson-plan.md                           # 50-min block plan; standard CCSS.ELA-LITERACY.W.6.1a
│   │   ├── slides-outline.md
│   │   └── differentiation-notes.md                 # sentence frames for ELL students, Socratic seminar extension
│   ├── 2026-09-15-evidence-based-claims/
│   │   ├── lesson-plan.md
│   │   ├── slides-outline.md
│   │   └── differentiation-notes.md
│   └── 2026-10-01-peer-review-workshop/
│       ├── lesson-plan.md
│       ├── slides-outline.md
│       └── differentiation-notes.md
├── assessments/
│   ├── quizzes/
│   │   ├── unit-01-vocab-quiz.md                    # 15-question quiz with answer key and Kahoot import format
│   │   ├── unit-02-narrative-elements-quiz.md
│   │   └── unit-03-research-skills-check.md
│   ├── rubrics/
│   │   ├── narrative-essay-rubric.md                # 4-point rubric: ideas, organization, voice, conventions
│   │   ├── research-paper-rubric.md                 # 4-point rubric: thesis, evidence, citation, mechanics
│   │   ├── participation-rubric.md                  # discussion and class participation scoring guide
│   │   └── presentation-rubric.md                  # oral presentation criteria: content, delivery, visuals
│   └── projects/
│       ├── semester-1-research-project.md           # multi-week project prompt with milestone dates and rubric
│       └── semester-2-argument-essay.md             # culminating essay prompt with Turnitin submission instructions
├── student-data/
│   ├── README.md                                    # note: all student IDs are anonymized — no names or DOBs stored here
│   ├── class-roster.md                              # student IDs, period, IEP/504 flags, ELL status (no PII)
│   ├── progress-tracker.md                          # assignment completion rates and grade bands by student ID
│   ├── iep-accommodations.md                        # accommodation types by student ID — used by /differentiation command
│   └── intervention-log.md                          # dated log of interventions by student ID, strategy used, outcome
├── parent-comms/
│   ├── templates/
│   │   ├── positive-update-template.md              # warm outreach for strong performance or growth
│   │   ├── concern-template.md                      # measured tone for academic or behavioral concern
│   │   ├── conference-invite-template.md            # parent-teacher conference scheduling email
│   │   └── missing-work-template.md                 # first and second notice for missing assignments
│   └── sent-log/
│       ├── 2026-09-log.md                           # dated list of sent communications with student ID and topic
│       └── 2026-10-log.md
├── resources/
│   ├── standards/
│   │   ├── ccss-ela-grade6.md                       # relevant Common Core standards extracted for quick reference
│   │   └── state-standards-crosswalk.md             # local state standards mapped against CCSS
│   ├── media-links.md                               # curated video, podcast, and article links by unit
│   └── professional-development/
│       ├── pd-notes-2025-08-15.md                   # notes from summer PD session
│       └── instructional-strategies.md              # reference: UDL, Socratic seminar, think-pair-share, jigsaw
└── feedback/
    ├── templates/
    │   ├── formative-feedback-template.md           # low-stakes written feedback for drafts and in-class work
    │   ├── summative-feedback-template.md           # end-of-assignment feedback aligned to rubric categories
    │   └── growth-mindset-feedback-template.md      # effort-focused language for struggling students
    └── sent/
        ├── 2026-09-narrative-essay-feedback.md      # batch feedback log: student ID, score band, feedback sent
        └── 2026-10-research-draft-feedback.md
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/lesson-plan.md` | Slash command that accepts `$ARGUMENTS` as `<topic> <grade-level>`, reads the relevant unit overview and standards alignment, and generates a complete 50-min lesson plan with objectives, warm-up, direct instruction, guided practice, and exit ticket |
| `.claude/commands/differentiation.md` | Reads a lesson-plan.md file and the matching student IEP accommodations, then produces three tiered versions: below-grade with sentence frames, on-grade as written, above-grade with extension tasks |
| `.claude/commands/student-feedback.md` | Takes a student ID, reads their progress-tracker entry and the relevant rubric, and generates specific written feedback with next-step language — never generic praise |
| `.claude/commands/parent-email.md` | Takes student ID and topic type (positive/concern/missing-work), reads the sent-log to avoid duplication, selects the correct template, and drafts a ready-to-send email |
| `curriculum/sy2025-2026/scope-and-sequence.md` | Full-year unit map with standards alignment and pacing — the source of truth all lesson plans and assessments reference |
| `student-data/iep-accommodations.md` | Accommodation types indexed by student ID — read by the `/differentiation` command to produce correctly scaffolded materials without exposing student PII |
| `assessments/rubrics/` | Scored rubrics for all major assignment types — referenced by `/rubric-creator`, `/student-feedback`, and `/quiz-builder` to ensure feedback is rubric-aligned |
| `parent-comms/sent-log/` | Monthly log of all parent communications with student ID and topic — prevents duplicate outreach and provides audit trail for admin review |

## Quick scaffold

```bash
# Create workspace root and Claude config
mkdir -p educator-workspace/.claude/commands

# Create curriculum tree for current school year
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-1/unit-01-introduction
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-1/unit-02-narrative-writing
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-1/unit-03-research-skills
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-2/unit-04-argumentative-writing
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-2/unit-05-literature-circles

# Create lessons directory with template
mkdir -p educator-workspace/lessons/_template

# Create assessments directories
mkdir -p educator-workspace/assessments/quizzes
mkdir -p educator-workspace/assessments/rubrics
mkdir -p educator-workspace/assessments/projects

# Create student data directory
mkdir -p educator-workspace/student-data

# Create parent comms directories
mkdir -p educator-workspace/parent-comms/templates
mkdir -p educator-workspace/parent-comms/sent-log

# Create resources directories
mkdir -p educator-workspace/resources/standards
mkdir -p educator-workspace/resources/professional-development

# Create feedback directories
mkdir -p educator-workspace/feedback/templates
mkdir -p educator-workspace/feedback/sent

# Stub out slash command files
touch educator-workspace/.claude/commands/lesson-plan.md
touch educator-workspace/.claude/commands/assignment-builder.md
touch educator-workspace/.claude/commands/rubric-creator.md
touch educator-workspace/.claude/commands/student-feedback.md
touch educator-workspace/.claude/commands/parent-email.md
touch educator-workspace/.claude/commands/differentiation.md
touch educator-workspace/.claude/commands/quiz-builder.md

# Stub out lesson template files
touch educator-workspace/lessons/_template/lesson-plan.md
touch educator-workspace/lessons/_template/slides-outline.md
touch educator-workspace/lessons/_template/differentiation-notes.md

# Stub out student data files
touch educator-workspace/student-data/README.md
touch educator-workspace/student-data/class-roster.md
touch educator-workspace/student-data/progress-tracker.md
touch educator-workspace/student-data/iep-accommodations.md
touch educator-workspace/student-data/intervention-log.md

# Stub out parent comms templates
touch educator-workspace/parent-comms/templates/positive-update-template.md
touch educator-workspace/parent-comms/templates/concern-template.md
touch educator-workspace/parent-comms/templates/conference-invite-template.md
touch educator-workspace/parent-comms/templates/missing-work-template.md

# Stub out feedback templates
touch educator-workspace/feedback/templates/formative-feedback-template.md
touch educator-workspace/feedback/templates/summative-feedback-template.md
touch educator-workspace/feedback/templates/growth-mindset-feedback-template.md

# Stub out curriculum anchor files
touch educator-workspace/curriculum/sy2025-2026/scope-and-sequence.md

# Install educator skills
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/rubric-creator
npx claudient add skill productivity/assignment-builder
npx claudient add skill productivity/differentiation
npx claudient add skill productivity/parent-email
```

## CLAUDE.md template

```markdown
# Educator Workspace — Claude Code Instructions

## What this is

This is a K-12 / university instructor workspace. It contains curriculum plans, individual
lesson plans, assessments, student progress data, and parent communication templates.
Claude Code operates here as a curriculum and instruction assistant — reading course context
to generate standards-aligned, differentiated, and rubric-referenced educational materials.

All student data is anonymized. Student IDs are used throughout — never use real student
names in generated content or stored files.

## Stack

- LMS: Google Classroom or Canvas — assignment distribution, grade book, submissions
- Documents: Google Workspace (Docs, Slides, Forms) — lesson materials, assessments
- Planning: Notion — curriculum boards, unit calendars, pacing guides
- Academic integrity: Turnitin — submitted essays and research papers
- Interactive: Kahoot, Pear Deck — formative checks and live polling
- Staff comms: Slack or Microsoft Teams — department and admin coordination
- Conferences: Google Meet or Zoom — parent meetings and remote office hours

## Common tasks and exact commands

Create a lesson plan:
  /lesson-plan <topic> <grade-level>
  → Reads unit overview and standards alignment; outputs full 50-min lesson plan

Build an assignment prompt:
  /assignment-builder
  → Prompts for assignment type, topic, and grade level; generates student-facing prompt

Create a scoring rubric:
  /rubric-creator
  → Prompts for assignment type and criteria; generates 4-point rubric ready to paste into Google Classroom

Write student feedback:
  /student-feedback <student-id>
  → Reads progress-tracker.md and the relevant rubric; writes specific, rubric-aligned feedback

Draft a parent email:
  /parent-email <student-id> <topic>
  → topic is one of: positive / concern / missing-work / conference-invite
  → Reads sent-log to avoid duplicate outreach; selects correct template; drafts the email

Differentiate a lesson:
  /differentiation <path-to-lesson-plan.md>
  → Reads iep-accommodations.md; produces below-grade, on-grade, and above-grade versions

Build a quiz:
  /quiz-builder <topic> <num-questions>
  → Generates multiple-choice or short-answer quiz with answer key and Kahoot-import format

## Workspace conventions

- All lesson plans live in lessons/ named YYYY-MM-DD-<slug>.md
- All lesson plans are created from lessons/_template/ — never start from scratch
- Rubrics live in assessments/rubrics/ and are referenced by name in lesson plans and assignment prompts
- Student data files use student IDs only — no names, dates of birth, or contact information
- Parent emails are logged in parent-comms/sent-log/<YYYY-MM>-log.md after sending
- Curriculum files reference standards by code (e.g., CCSS.ELA-LITERACY.W.6.1a), not by paraphrase

## Standards alignment

Default standard set: Common Core State Standards (CCSS) ELA
State crosswalk: resources/standards/state-standards-crosswalk.md
When generating lesson plans or assessments, always cite the specific standard code addressed.

## Differentiation levels

Below grade: sentence frames, word banks, graphic organizers, reduced complexity
On grade: lesson as designed — no modification
Above grade: extension tasks, Socratic seminar prompts, independent research options
IEP/504 accommodations: read student-data/iep-accommodations.md before generating any
differentiated materials — accommodations in that file take precedence over defaults.

## Do not

- Do not use real student names in any generated file — student IDs only
- Do not generate rubric scores or grades — Claude suggests language; teacher assigns scores
- Do not send parent emails without teacher review — /parent-email drafts only
- Do not create lesson plans without referencing the relevant unit-overview.md first
- Do not commit student-data/ to any remote git repository
```

## MCP servers

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@googleapis/mcp-server-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/$USER/educator-workspace/curriculum",
        "/Users/$USER/educator-workspace/lessons",
        "/Users/$USER/educator-workspace/assessments",
        "/Users/$USER/educator-workspace/feedback"
      ]
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'lessons/'; then echo '[educator-workspace] Lesson written — confirm standards code is cited and differentiation-notes.md exists alongside this file.'; fi"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'student-data/'; then echo '[educator-workspace] Writing to student-data/ — verify no student names or PII are included, student IDs only.'; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[educator-workspace] Session ended. Reminder: log any parent emails sent this session in parent-comms/sent-log/ and update progress-tracker.md if assessments were graded.'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/rubric-creator
npx claudient add skill productivity/assignment-builder
npx claudient add skill productivity/differentiation
npx claudient add skill productivity/parent-email
npx claudient add skill productivity/quiz-builder
```

## Related

- [Educator Guide](../guides/for-educator.md)
- [Lesson Planning Workflow](../workflows/lesson-planning.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
