# Docenten-/Instructeurswerk Ruimte — Projectstructuur

> Een Claude Code werk ruimte voor basisschool- en hogeschoolleraars die dagelijkse lesplanning, curriculumontwerp, gedifferentieerde instructie, toetsing, studentenfeedback en ouder-/beheerdercommunicatie beheren — allemaal aangestuurd door schuine commando's en context op cursusniveau.

## Stack

- **Google Classroom** of **Canvas LMS** — taakdistributie, cijferboek, tracking van studentinzendingen
- **Google Workspace** (Docs, Slides, Forms, Drive) — lesdocumenten, presentatieshows, quizzen, gedeelde bronnen
- **Notion** — curriculumplanningsborden, eenheidskaarten, semestercalendars
- **Turnitin** — controles op academische integriteit van ingediende werk
- **Kahoot** of **Pear Deck** — interactieve formatieve beoordelingen en live polling
- **Slack** of **Microsoft Teams** — personeels- en afdelingscommunicatie
- **Google Meet** of **Zoom** — ouderconferenties, afstandsonderwijs, spreekuren

## Directoryboom

```
educator-workspace/
├── .claude/
│   ├── CLAUDE.md                                    # werkruimteinstructies voor Claude Code
│   ├── settings.json                                # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── lesson-plan.md                           # /lesson-plan <topic> <grade-level> — volledig lesplan met doelstellingen, activiteiten, controles
│       ├── assignment-builder.md                    # /assignment-builder — maakt taakaanwijzing met instructies en indieneningscriteria
│       ├── rubric-creator.md                        # /rubric-creator — genereert scoringsheuristiek voor elk taaktype
│       ├── student-feedback.md                      # /student-feedback <student-id> — genereert gepersonaliseerde geschreven feedback
│       ├── parent-email.md                          # /parent-email <student-id> <topic> — schrijft oudermededelingen naar toon en context
│       ├── differentiation.md                       # /differentiation <lesson-file> — voert getrapte versies van een les voor 3 niveaus uit
│       └── quiz-builder.md                          # /quiz-builder <topic> <num-questions> — maakt quiz met antwoordsleutel en heuristiek
├── curriculum/
│   ├── sy2025-2026/                                 # academisch jaarwortel
│   │   ├── scope-and-sequence.md                   # volledig jaarkaart met normering en tempo
│   │   ├── semester-1/
│   │   │   ├── unit-01-introduction/
│   │   │   │   ├── unit-overview.md                # essentiële vragen, blijvende inzichten, normen (bv. CCSS.ELA-LITERACY.RI.6.1)
│   │   │   │   ├── pacing-guide.md                 # dag-voor-dag schema, referentiepunt controles
│   │   │   │   └── standards-alignment.md          # kaart naar staats-/nationale normen met bewijskoppelingen
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
│   ├── _template/                                   # kopieer dit bij het maken van een nieuwe les
│   │   ├── lesson-plan.md                           # leerdoelen, materialen, procedure, begripscontroles, afsluiting
│   │   ├── slides-outline.md                        # Google Slides deckschets (titel, opwarmers, directe instructie, oefening, afsluitkaartje)
│   │   └── differentiation-notes.md                 # onder-niveau, op-niveau, boven-niveau steunen en uitbreidingen
│   ├── 2026-09-08-intro-to-thesis-statements/
│   │   ├── lesson-plan.md                           # plan voor 50-minblok; norm CCSS.ELA-LITERACY.W.6.1a
│   │   ├── slides-outline.md
│   │   └── differentiation-notes.md                 # zinframes voor ELL-studenten, seminaruitbreiding voor Socrates
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
│   │   ├── unit-01-vocab-quiz.md                    # 15-vragenquiz met antwoordsleutel en Kahoot-importformaat
│   │   ├── unit-02-narrative-elements-quiz.md
│   │   └── unit-03-research-skills-check.md
│   ├── rubrics/
│   │   ├── narrative-essay-rubric.md                # 4-puntsheuristiek: ideeën, organisatie, stem, conventies
│   │   ├── research-paper-rubric.md                 # 4-puntsheuristiek: stelling, bewijs, citatie, mechanica
│   │   ├── participation-rubric.md                  # discussie- en klasparticipatie scoringsgids
│   │   └── presentation-rubric.md                  # mondelinge presentatiecriteria: inhoud, voordracht, visuele elementen
│   └── projects/
│       ├── semester-1-research-project.md           # meerwekenproject met aanwijzing en mijlpaaldatum en heuristiek
│       └── semester-2-argument-essay.md             # culminerende essayaanwijzing met Turnitin-indieneningsinstructies
├── student-data/
│   ├── README.md                                    # nota: alle student-id's zijn geanonimiseerd — geen namen of geboortedatums opgeslagen hier
│   ├── class-roster.md                              # student-id's, periode, IEP/504-vlaggen, ELL-status (geen PII)
│   ├── progress-tracker.md                          # taakafronding en gradenbanden per student-id
│   ├── iep-accommodations.md                        # accommodatietypes per student-id — gebruikt door /differentiation commando
│   └── intervention-log.md                          # gedateerd logboek van interventies per student-id, gebruikte strategie, uitkomst
├── parent-comms/
│   ├── templates/
│   │   ├── positive-update-template.md              # warme uitstekking voor sterke prestatie of groei
│   │   ├── concern-template.md                      # gemeten toon voor academische of gedragsbedenking
│   │   ├── conference-invite-template.md            # ouder-leerare conferentie planningsmail
│   │   └── missing-work-template.md                 # eerste en tweede kennisgeving voor gemiste toewijzingen
│   └── sent-log/
│       ├── 2026-09-log.md                           # gedateerde lijst van verzonden communicatie met student-id en onderwerp
│       └── 2026-10-log.md
├── resources/
│   ├── standards/
│   │   ├── ccss-ela-grade6.md                       # relevante Common Core standaarden uit voor snelle naslag
│   │   └── state-standards-crosswalk.md             # lokale staatsstandaarden tegen CCSS kaart
│   ├── media-links.md                               # samengestelde video-, podcast- en artikelkoppelingen per eenheid
│   └── professional-development/
│       ├── pd-notes-2025-08-15.md                   # aantekeningen van zomerse PD sessie
│       └── instructional-strategies.md              # referentie: UDL, Socrates seminar, denk-paar-deel, puzzelspel
└── feedback/
    ├── templates/
    │   ├── formative-feedback-template.md           # laagrisico geschreven feedback voor concepten en leswerk
    │   ├── summative-feedback-template.md           # feedback aan het einde van taak in lijn met heuristiekcategorieën
    │   └── growth-mindset-feedback-template.md      # inspanningsgerichte taal voor studenten in moeilijkheden
    └── sent/
        ├── 2026-09-narrative-essay-feedback.md      # batch feedbacklogboek: student-id, scorebanden, feedback verzonden
        └── 2026-10-research-draft-feedback.md
```

## Verklaring van sleutelbestanden

| Pad | Doel |
|---|---|
| `.claude/commands/lesson-plan.md` | Schuine commando dat `$ARGUMENTS` accepteert als `<topic> <grade-level>`, het relevante eenheidsoverzicht en normering leest, en een volledig 50-minlesplan genereert met doelstellingen, opwarmer, directe instructie, geleide oefening en afsluitkaartje |
| `.claude/commands/differentiation.md` | Leest een lesson-plan.md bestand en de bijbehorende student IEP accommodaties, en voert vervolgens drie getrapte versies uit: onder-niveau met zinframes, op-niveau als geschreven, boven-niveau met uitbreidingstaken |
| `.claude/commands/student-feedback.md` | Neemt een student-id, leest hun progress-tracker invoer en de relevante heuristiek, en genereert specifieke geschreven feedback met volgende-stapentaal — nooit generieke lofbetuiging |
| `.claude/commands/parent-email.md` | Neemt student-id en onderwerptype (positief/bezorgdheid/gemiste werk), leest het sent-log om dubbel werk te vermijden, selecteert de juiste sjabloon en stelt een kant-en-klaar e-mailontwerp op |
| `curriculum/sy2025-2026/scope-and-sequence.md` | Volledig jaarkaart met normering en tempo — de waarheid alle lesplannen en beoordelingen verwijzen naar |
| `student-data/iep-accommodations.md` | Accommodatietypes geïndexeerd per student-id — gelezen door de `/differentiation` commando om correct ondersteunde materialen te voeren zonder student PII bloot te stellen |
| `assessments/rubrics/` | Scoringsheurisieken voor alle grote taaktypes — waarnaar verwezen wordt door `/rubric-creator`, `/student-feedback` en `/quiz-builder` om ervoor te zorgen dat feedback heuristiek-afgestemd is |
| `parent-comms/sent-log/` | Maandelijks logboek van alle oudermededelingen met student-id en onderwerp — voorkomt dubbele uitstekking en biedt controlepad voor beheerderoverzicht |

## Snel steigerwerk

```bash
# Werkruimtewortel en Claude-configuratie maken
mkdir -p educator-workspace/.claude/commands

# Curriculumboom voor huidig schooljaar maken
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-1/unit-01-introduction
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-1/unit-02-narrative-writing
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-1/unit-03-research-skills
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-2/unit-04-argumentative-writing
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-2/unit-05-literature-circles

# Lessenmap met sjabloon maken
mkdir -p educator-workspace/lessons/_template

# Beoordelingsdirectories maken
mkdir -p educator-workspace/assessments/quizzes
mkdir -p educator-workspace/assessments/rubrics
mkdir -p educator-workspace/assessments/projects

# Studentengegevensdirectory maken
mkdir -p educator-workspace/student-data

# Parent comms directories maken
mkdir -p educator-workspace/parent-comms/templates
mkdir -p educator-workspace/parent-comms/sent-log

# Bronnendirectories maken
mkdir -p educator-workspace/resources/standards
mkdir -p educator-workspace/resources/professional-development

# Feedbackdirectories maken
mkdir -p educator-workspace/feedback/templates
mkdir -p educator-workspace/feedback/sent

# Schuine commando bestanden achterhalen
touch educator-workspace/.claude/commands/lesson-plan.md
touch educator-workspace/.claude/commands/assignment-builder.md
touch educator-workspace/.claude/commands/rubric-creator.md
touch educator-workspace/.claude/commands/student-feedback.md
touch educator-workspace/.claude/commands/parent-email.md
touch educator-workspace/.claude/commands/differentiation.md
touch educator-workspace/.claude/commands/quiz-builder.md

# Lessjabloonbestanden achterhalen
touch educator-workspace/lessons/_template/lesson-plan.md
touch educator-workspace/lessons/_template/slides-outline.md
touch educator-workspace/lessons/_template/differentiation-notes.md

# Studentengegevensbestanden achterhalen
touch educator-workspace/student-data/README.md
touch educator-workspace/student-data/class-roster.md
touch educator-workspace/student-data/progress-tracker.md
touch educator-workspace/student-data/iep-accommodations.md
touch educator-workspace/student-data/intervention-log.md

# Ouderkommunicatiesjablonen achterhalen
touch educator-workspace/parent-comms/templates/positive-update-template.md
touch educator-workspace/parent-comms/templates/concern-template.md
touch educator-workspace/parent-comms/templates/conference-invite-template.md
touch educator-workspace/parent-comms/templates/missing-work-template.md

# Feedbacksjablonen achterhalen
touch educator-workspace/feedback/templates/formative-feedback-template.md
touch educator-workspace/feedback/templates/summative-feedback-template.md
touch educator-workspace/feedback/templates/growth-mindset-feedback-template.md

# Curriculumanchorbestanden achterhalen
touch educator-workspace/curriculum/sy2025-2026/scope-and-sequence.md

# Docentenvaardigheden installeren
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/rubric-creator
npx claudient add skill productivity/assignment-builder
npx claudient add skill productivity/differentiation
npx claudient add skill productivity/parent-email
```

## CLAUDE.md sjabloon

```markdown
# Docenten-/Instructeurswerk Ruimte — Claude Code Instructies

## Wat dit is

Dit is een basisschool-/hogeschoolleraars werk ruimte. Het bevat curriculumplannen, individuele
lesplannen, beoordelingen, studentenvoortgangsgegevens en ouderkommunicatiesjablonen.
Claude Code werkt hier als een curriculum- en instructie-assistent — een cursuscontext lezen
om normen-afgestemde, gedifferentieerde en heuristiek-verwezen onderwijsmaterialen te genereren.

Alle studentengegevens zijn geanonimiseerd. Student-id's worden overal gebruikt — nooit echte studentennamen gebruiken
in gegenereerde inhoud of opgeslagen bestanden.

## Stack

- LMS: Google Classroom of Canvas — taakdistributie, cijferboek, inzendingen
- Documenten: Google Workspace (Docs, Slides, Forms) — lesmateriaal, beoordelingen
- Planning: Notion — curriculumborden, eenheidskalenders, tempohandleidingen
- Academische integriteit: Turnitin — ingediende essays en onderzoekspapers
- Interactief: Kahoot, Pear Deck — formatieve controles en live polling
- Personeelscomms: Slack of Microsoft Teams — afdeling en beheerdercoördinatie
- Conferenties: Google Meet of Zoom — oudervergaderingen en afstandsspreekuren

## Veelgestelde taken en exacte commando's

Maak een lesplan:
  /lesson-plan <topic> <grade-level>
  → Leest eenheidsoverzicht en normering; voert volledig 50-minlesplan uit

Bouw een taakaanwijzing:
  /assignment-builder
  → Geeft vragen voor taaktype, onderwerp en gradesniveau; genereert studentengericht aanwijzing

Maak een scoringsheuristiek:
  /rubric-creator
  → Geeft vragen voor taaktype en criteria; genereert 4-puntsheuristiek klaar om in Google Classroom in te plakken

Schrijf studentenfeedback:
  /student-feedback <student-id>
  → Leest progress-tracker.md en de relevante heuristiek; schrijft specifieke, heuristiek-afgestemde feedback

Schrijf een oudermail:
  /parent-email <student-id> <topic>
  → onderwerp is een van: positief / bezorgdheid / gemiste werk / conferentie-uitnodiging
  → Leest sent-log om dubbele uitstekking te vermijden; selecteert juiste sjabloon; stelt e-mail op

Differentieer een les:
  /differentiation <path-to-lesson-plan.md>
  → Leest iep-accommodations.md; voert onder-niveau, op-niveau en boven-niveau versies uit

Bouw een quiz:
  /quiz-builder <topic> <num-questions>
  → Genereert meerkeuzige of korte-antwoordquiz met antwoordsleutel en Kahoot-importformaat

## Werkruimteconventies

- Alle lesplannen wonen in lessens/ genoemd JJJJ-MM-DD-<slug>.md
- Alle lesplannen worden gemaakt van lessons/_template/ — nooit helemaal van nul af starten
- Heursieken wonen in assessments/rubrics/ en waarnaar verwezen wordt op naam in lesplannen en taakaanwijzingen
- Studentengegevensbestanden gebruiken alleen student-id's — geen namen, geboortedatums of contactgegevens
- Oudermails worden geregistreerd in parent-comms/sent-log/<JJJJ-MM>-log.md na verzending
- Curriculumbestanden verwijzen naar normen op code (bv. CCSS.ELA-LITERACY.W.6.1a), niet op parafrase

## Normering afstemming

Standaardnormset: Common Core State Standards (CCSS) ELA
Staatscrosswalk: resources/standards/state-standards-crosswalk.md
Bij het genereren van lesplannen of beoordelingen, altijd de specifieke normcode citeren.

## Differentiatieniveaus

Onder niveau: zinframes, woordbanken, grafische organisatoren, verminderde complexiteit
Op niveau: les zoals ontworpen — geen wijziging
Boven niveau: uitbreidingstaken, Socratische seminaaraanwijzingen, onafhankelijke onderzoeksopties
IEP/504 accommodaties: lees student-data/iep-accommodations.md voordat je gedifferentieerde materialen genereert — accommodaties in dat bestand hebben voorrang op standaarden.

## Niet doen

- Gebruik geen echte studentennamen in gegenereerde bestanden — alleen student-id's
- Genereer geen heuristiekscores of cijfers — Claude stelt taal voor; leraar wijst scores toe
- Stuur geen oudermails zonder leraarsbeoordeling — /parent-email schrijft alleen voorstel
- Maak geen lesplannen zonder eerst het relevante unit-overview.md te raadplegen
- Maak student-data/ niet van commit naar enig afgelegen git-repository
```

## MCP-servers

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

## Aanbevolen hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'lessons/'; then echo '[educator-workspace] Les geschreven — controleer of normcode wordt aangehaald en differentiation-notes.md naast dit bestand bestaat.'; fi"
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
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'student-data/'; then echo '[educator-workspace] Schrijven naar student-data/ — verifieer dat geen studentennamen of PII zijn opgenomen, alleen student-id's.'; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[educator-workspace] Sessie beëindigd. Herinnering: registreer alle oudermails verzonden deze sessie in parent-comms/sent-log/ en werk progress-tracker.md bij als beoordelingen werden nageleefd.'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden om te installeren

```bash
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/rubric-creator
npx claudient add skill productivity/assignment-builder
npx claudient add skill productivity/differentiation
npx claudient add skill productivity/parent-email
npx claudient add skill productivity/quiz-builder
```

## Gerelateerd

- [Docentengids](../guides/for-educator.md)
- [Lesplanningworkflow](../workflows/lesson-planning.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
