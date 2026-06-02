# Online-Kurs-Geschäft — Projektstruktur

> Ein Arbeitsbereich für Kursersteller oder Pädagogen zum Entwerfen von Lehrplänen, zum Starten von Wissensprodukt, zur Verwaltung von Schülergemeinden und zum Verfolgung von Anmeldungs-Umsatz — angetrieben durch Schrägstrichbefehle und kontextabhängige Kurse.

## Stack

- **Teachable** / **Kajabi** / **Thinkific** — Kurs-Hosting, Tropfeninhalt, Schülerverfolgung, Zertifikate
- **ConvertKit** / **ActiveCampaign** — E-Mail-Sequenzen, Abonnentenmarkierung, Broadcast-Kampagnen, Automatisierungsregeln
- **Loom** / **Descript** — asynchrone Videoaufzeichnung, Bildschirmerfassung, Transkriptbearbeitung, Overdub-Korrektionen
- **Circle** / **Skool** — Schülergemeinde, Kohortenbereiche, Diskussionsthreads, Meilensteine von Mitgliedern
- **Stripe** — Zahlungsabwicklung, Abonnementabrechnung, Gutscheincodes, Rückerstattungsverwaltung
- **Canva** — Kursgrafiken, Sales-Page-Mockups, Social-Media-Assets, Zertifikatvorlagen
- **Notion** — Lehrplan-Planungsboards, Lektion-Skriptbearbeitung, Startkalender, SOPs
- **Calendly** — 1:1-Coaching-Call-Buchung, Sprechstundenplanung, Onboarding-Anrufe
- **Zapier** — plattformübergreifende Automatisierungen (neuer Kauf → Willkommens-E-Mail, Gemeinschaftseinladung, Tag in ConvertKit)

## Verzeichnisbaum

```
online-course-business/
├── .claude/
│   ├── CLAUDE.md                                        # workspace instructions for Claude Code
│   ├── settings.json                                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-course.md                                # /new-course <title> — scaffolds full courses/ subdirectory
│       ├── lesson-script.md                             # /lesson-script <module> <lesson-title> — writes full lesson script with intro hook, teaching points, CTA
│       ├── email-sequence.md                            # /email-sequence <sequence-name> <num-emails> — drafts nurture or launch sequence
│       ├── launch-plan.md                               # /launch-plan <course-slug> <launch-date> — full pre/during/post launch calendar
│       ├── sales-page.md                                # /sales-page <course-slug> — drafts long-form sales page copy from curriculum outline
│       ├── support-reply.md                             # /support-reply <ticket-summary> — drafts empathetic, policy-aligned support response
│       ├── weekly-prompt.md                             # /weekly-prompt <community-platform> — generates this week's community engagement prompt
│       └── revenue-snapshot.md                         # /revenue-snapshot — reads analytics files and summarizes enrollment + revenue trends
├── courses/
│   ├── _template/                                       # copy this directory when creating a new course
│   │   ├── curriculum-outline.md                        # module and lesson map with learning objectives per lesson
│   │   ├── student-guide.md                             # student-facing welcome doc: what to expect, how to navigate, next steps
│   │   ├── assessment-rubric.md                         # grading criteria for any assignments or project submissions
│   │   ├── lesson-scripts/
│   │   │   └── m01-l01-template.md                      # lesson script template: hook, teach, demonstrate, practice, CTA
│   │   └── slides-notes/
│   │       └── m01-l01-slides-notes.md                  # slide-by-slide speaker notes keyed to lesson script
│   ├── accelerate-with-ai/                              # example course: "Accelerate With AI"
│   │   ├── curriculum-outline.md                        # 6-module map: setup → prompting → automation → content → ops → scale
│   │   ├── student-guide.md                             # onboarding doc linked from welcome email
│   │   ├── assessment-rubric.md                         # capstone project rubric: use case clarity, prompt quality, output value
│   │   ├── lesson-scripts/
│   │   │   ├── m01-l01-what-is-ai-for-business.md       # hook: "You're already behind" → context → Claude demo → assignment
│   │   │   ├── m01-l02-setting-up-claude-code.md
│   │   │   ├── m02-l01-prompt-fundamentals.md
│   │   │   ├── m02-l02-chain-of-thought-prompting.md
│   │   │   ├── m02-l03-prompt-templates.md
│   │   │   ├── m03-l01-zapier-ai-automations.md
│   │   │   ├── m03-l02-make-scenarios.md
│   │   │   ├── m04-l01-content-at-scale.md
│   │   │   ├── m04-l02-social-repurposing.md
│   │   │   ├── m05-l01-ai-for-ops.md
│   │   │   └── m06-l01-building-your-ai-stack.md
│   │   └── slides-notes/
│   │       ├── m01-l01-slides-notes.md
│   │       ├── m01-l02-slides-notes.md
│   │       ├── m02-l01-slides-notes.md
│   │       ├── m02-l02-slides-notes.md
│   │       └── m02-l03-slides-notes.md
│   └── freelance-to-agency/                             # second course: "Freelance to Agency"
│       ├── curriculum-outline.md                        # 5-module map: positioning → offers → hiring → systems → scale
│       ├── student-guide.md
│       ├── assessment-rubric.md
│       ├── lesson-scripts/
│       │   ├── m01-l01-positioning-statement.md
│       │   ├── m01-l02-niche-selection-framework.md
│       │   ├── m02-l01-packaging-your-offer.md
│       │   ├── m02-l02-pricing-strategy.md
│       │   ├── m03-l01-your-first-hire.md
│       │   └── m04-l01-client-delivery-sop.md
│       └── slides-notes/
│           ├── m01-l01-slides-notes.md
│           └── m01-l02-slides-notes.md
├── marketing/
│   ├── launch-plan.md                                   # master launch calendar: pre-launch → cart open → cart close → post-launch
│   ├── sales-page-copy.md                               # long-form sales page: headline, VSL script, benefits, FAQs, guarantee, CTAs
│   ├── social-calendar.md                               # 30-day content grid: platform, post type, copy angle, asset needed
│   ├── email-sequences/
│   │   ├── welcome-sequence.md                          # 5-email welcome: day 0 login, day 1 quick win, day 3 module 1, day 7 check-in, day 14 milestone
│   │   ├── pre-launch-waitlist.md                       # 7-email waitlist build: problem agitation → solution teasing → social proof → early-bird CTA
│   │   ├── launch-sequence.md                           # 10-email cart-open sequence: open → value → faq → close → last-chance
│   │   ├── post-purchase-nurture.md                     # 4-email post-buy sequence: confirm → access → first win → upsell to coaching
│   │   ├── re-engagement.md                             # 3-email win-back for subscribers inactive 90+ days
│   │   └── affiliate-onboarding.md                      # 4-email sequence for new affiliates: assets → swipe copy → tracking links → bonus structure
│   └── webinar-scripts/
│       ├── masterclass-free.md                          # free training script: 60-min value-heavy presentation with pitch at minute 45
│       └── sales-webinar.md                             # live launch webinar: backstory → framework → case studies → offer → Q&A
├── community/
│   ├── onboarding-message.md                            # pinned welcome post for Circle/Skool: rules, how to navigate, first post prompt
│   ├── weekly-prompts.md                                # 52-week log of community engagement prompts — one per week
│   ├── member-milestones.md                             # milestone celebration templates: module 1 complete, halfway, graduation, testimonial ask
│   └── moderation-guidelines.md                        # community rules, violation tiers, ban criteria, escalation path
├── operations/
│   ├── student-support-templates.md                     # canned responses: login issues, refund requests, billing questions, access extensions
│   ├── refund-policy.md                                 # 30-day satisfaction guarantee terms, how to request, processing timeline
│   ├── affiliate-program.md                             # commission structure (30%), cookie window, payout schedule, prohibited promo methods
│   ├── pricing-strategy.md                              # tier logic, payment plans, coupon strategy, evergreen vs launch pricing
│   ├── onboarding-sop.md                                # step-by-step: new student → Teachable access → Circle invite → ConvertKit tag → Calendly link
│   └── zapier-automations.md                            # documented Zap inventory: trigger → filter → action for each live automation
├── analytics/
│   ├── enrollment-tracker.md                            # monthly enrollment counts by course, channel, campaign source
│   ├── completion-rates.md                              # module-by-module completion % and drop-off points by cohort
│   ├── revenue-dashboard.md                             # MRR, LTV, refund rate, affiliate payouts — updated monthly
│   └── email-metrics.md                                 # open rates, CTRs, unsubscribes by sequence and broadcast — tracked weekly
└── assets/
    ├── canva-templates.md                               # links to shared Canva library: thumbnails, social posts, certificate, sales-page graphics
    ├── brand-guide.md                                   # hex colors, fonts, logo usage, tone of voice, do/don't examples
    └── loom-recordings-log.md                           # inventory of Loom links by module and lesson with recording date and status
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `.claude/commands/lesson-script.md` | Schrägstrichbefehl, der die Kurs-`curriculum-outline.md` und das Lernziel des Zielmoduls liest, dann ein vollständiges Lesescript mit einem Muster-Interrupt-Hook, drei Unterrichtspunkten, einem Demonstrationssegment, einer Übungsaufgabe und einem klaren CTA schreibt — bereit zur Aufzeichnung in Loom oder Descript |
| `.claude/commands/email-sequence.md` | Akzeptiert einen Sequenznamen und eine E-Mail-Anzahl, liest die passende Gliederung in `courses/` für den Kontext und schreibt jede E-Mail mit Betreffzeile, Vorschautext, Text und CTA — ConvertKit-ready-Formatierung |
| `.claude/commands/sales-page.md` | Liest eine Kurs-`curriculum-outline.md`, `student-guide.md` und `assessment-rubric.md` und schreibt dann eine umfangreiche Sales-Page mit VSL-Skript, Vorteilskugeln, Modulaufschlüsselung nach Modulen, FAQs, Garantieblock und mehreren CTAs |
| `.claude/commands/support-reply.md` | Nimmt eine Ticket-Zusammenfassung, liest `operations/refund-policy.md` und `operations/student-support-templates.md` und schreibt eine richtliniengerechte, empathische Antwort — kennzeichnet Grenzfälle, die menschliche Eskalation benötigen |
| `courses/<slug>/curriculum-outline.md` | Quelle der Wahrheit für jeden Kurs: Modultitel, Lektionstitel und ein einzeiliges Lernziel pro Lektion — alle anderen Befehle lesen diese Datei zuerst |
| `marketing/launch-plan.md` | Master-Startkalender mit Vorstart (30 Tage), Wagen offen (7 Tage) und Nach-Start-Phasen (14 Tage) — jeder Tag hat einen Kanal, eine Aufgabe und einen Textwinkel |
| `operations/zapier-automations.md` | Lebender Bestand jedes aktiven Zaps: Triggerereignis, Filter und Aktionsschritte — verhindert doppelte Automatisierungen und ermöglicht schnelles Debuggen |
| `analytics/revenue-dashboard.md` | Monatliche Umsatzsicht: Bruttoumsatz, Rückerstattungen, Netto, MRR nach Kurs, LTV nach Akquisitionskanal — der Befehl `/revenue-snapshot` liest und fasst dies zusammen |

## Schnell gerüst

```bash
# Create workspace root and Claude config
mkdir -p online-course-business/.claude/commands

# Create course template
mkdir -p online-course-business/courses/_template/lesson-scripts
mkdir -p online-course-business/courses/_template/slides-notes

# Create example course directories
mkdir -p online-course-business/courses/accelerate-with-ai/lesson-scripts
mkdir -p online-course-business/courses/accelerate-with-ai/slides-notes
mkdir -p online-course-business/courses/freelance-to-agency/lesson-scripts
mkdir -p online-course-business/courses/freelance-to-agency/slides-notes

# Create marketing directories
mkdir -p online-course-business/marketing/email-sequences
mkdir -p online-course-business/marketing/webinar-scripts

# Create community, operations, analytics, and assets directories
mkdir -p online-course-business/community
mkdir -p online-course-business/operations
mkdir -p online-course-business/analytics
mkdir -p online-course-business/assets

# Stub out slash commands
touch online-course-business/.claude/commands/new-course.md
touch online-course-business/.claude/commands/lesson-script.md
touch online-course-business/.claude/commands/email-sequence.md
touch online-course-business/.claude/commands/launch-plan.md
touch online-course-business/.claude/commands/sales-page.md
touch online-course-business/.claude/commands/support-reply.md
touch online-course-business/.claude/commands/weekly-prompt.md
touch online-course-business/.claude/commands/revenue-snapshot.md

# Stub out course template files
touch online-course-business/courses/_template/curriculum-outline.md
touch online-course-business/courses/_template/student-guide.md
touch online-course-business/courses/_template/assessment-rubric.md
touch online-course-business/courses/_template/lesson-scripts/m01-l01-template.md
touch online-course-business/courses/_template/slides-notes/m01-l01-slides-notes.md

# Stub out marketing files
touch online-course-business/marketing/launch-plan.md
touch online-course-business/marketing/sales-page-copy.md
touch online-course-business/marketing/social-calendar.md
touch online-course-business/marketing/email-sequences/welcome-sequence.md
touch online-course-business/marketing/email-sequences/pre-launch-waitlist.md
touch online-course-business/marketing/email-sequences/launch-sequence.md
touch online-course-business/marketing/email-sequences/post-purchase-nurture.md
touch online-course-business/marketing/email-sequences/re-engagement.md
touch online-course-business/marketing/email-sequences/affiliate-onboarding.md
touch online-course-business/marketing/webinar-scripts/masterclass-free.md
touch online-course-business/marketing/webinar-scripts/sales-webinar.md

# Stub out community files
touch online-course-business/community/onboarding-message.md
touch online-course-business/community/weekly-prompts.md
touch online-course-business/community/member-milestones.md
touch online-course-business/community/moderation-guidelines.md

# Stub out operations files
touch online-course-business/operations/student-support-templates.md
touch online-course-business/operations/refund-policy.md
touch online-course-business/operations/affiliate-program.md
touch online-course-business/operations/pricing-strategy.md
touch online-course-business/operations/onboarding-sop.md
touch online-course-business/operations/zapier-automations.md

# Stub out analytics files
touch online-course-business/analytics/enrollment-tracker.md
touch online-course-business/analytics/completion-rates.md
touch online-course-business/analytics/revenue-dashboard.md
touch online-course-business/analytics/email-metrics.md

# Stub out assets files
touch online-course-business/assets/canva-templates.md
touch online-course-business/assets/brand-guide.md
touch online-course-business/assets/loom-recordings-log.md

# Install relevant skills
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/de/stakeholder-report
```

## CLAUDE.md-Vorlage

```markdown
# Online-Kurs-Geschäft — Claude Code Anweisungen

## Was das ist

Dies ist ein Arbeitsbereich für Kursersteller. Es enthält Lehrpläne für mehrere Kurse, Marketing-Kopien und E-Mail-Sequenzen, Inhalte zur Verwaltung von Gemeinschaften, Operationen zur Schülerunterstützung und Umsatzanalysen. Claude Code funktioniert hier als Curriculum-Schreiber, Launch-Copywriter, Support-Drafter und Analytics-Zusammenfasser — liest immer einen Kurs-Kontext, bevor Sie eine Ausgabe generieren.

Erfinden Sie niemals Curriculum-Struktur. Lesen Sie immer die relevante curriculum-outline.md zuerst.

## Stack

- Kurs-Plattform: Teachable / Kajabi / Thinkific — Hosting, Tropfeninhalt, Schülerverfolgung
- E-Mail: ConvertKit / ActiveCampaign — Sequenzen, Broadcasts, Abonnenten-Tagging
- Video: Loom / Descript — Lektionsaufzeichnung, Transkriptbearbeitung, Overdub
- Gemeinde: Circle / Skool — Diskussionen, Kohortenbereiche, Meilensteine
- Zahlungen: Stripe — Einmalige, Zahlungspläne, Abonnements, Rückerstattungen
- Grafiken: Canva — Thumbnails, Sales-Assets, Zertifikate
- Planung: Notion — Curriculum-Boards, Startkalender, SOPs
- Planung: Calendly — Coaching-Anrufe, Sprechstunden, Onboarding-Anrufe
- Automatisierung: Zapier — plattformübergreifende Trigger (Kauf → Zugriff → E-Mail → Gemeinde)

## Häufige Aufgaben und genaue Befehle

Gerüst für einen neuen Kurs:
  /new-course <title>
  → Erstellt courses/<slug>/ mit curriculum-outline.md, student-guide.md, assessment-rubric.md,
    lesson-scripts/ und slides-notes/ aus dem _template-Verzeichnis

Schreibe ein Lesescript:
  /lesson-script <course-slug> <module-number> <lesson-title>
  → Liest courses/<slug>/curriculum-outline.md für das Lernziel der Lektion und schreibt dann ein vollständiges
    Skript: Muster-Interrupt-Hook, drei Unterrichtspunkte, Demo, Übungsaufgabe, CTA

Entwerfe eine E-Mail-Sequenz:
  /email-sequence <sequence-name> <num-emails>
  → Liest relevante Kurs-Gliederung für den Kontext; schreibt jede E-Mail mit Betreff, Vorschautext,
    Text und CTA in ConvertKit-kompatiblem Format

Schreiben Sie einen Startplan:
  /launch-plan <course-slug> <launch-date>
  → Liest marketing/launch-plan.md für Struktur; gibt einen datierten Vorstart/Wagen-offen/
    Nach-Start-Kalender mit Aufgabe, Kanal und Textwinkel für jeden Tag aus

Entwerfe eine Sales-Page:
  /sales-page <course-slug>
  → Liest curriculum-outline.md, student-guide.md; schreibt umfangreiche Kopie mit VSL-Skript,
    Vorteilskugeln, Modulaufschlüsselung, FAQs, Garantieblock und CTAs

Antwort auf ein Support-Ticket:
  /support-reply <ticket-summary>
  → Liest operations/refund-policy.md und operations/student-support-templates.md; entwirft eine
    richtliniengerechte empathische Antwort; kennzeichnet Eskalationsauslöser

Generiere eine Gemeinschafts-Aufforderung:
  /weekly-prompt <platform>
  → platform ist eines von: circle / skool / slack
  → Schreibt die Aufforderung dieser Woche mit Bezug zur Kursphase der Gemeinde

Zusammenfassen des Umsatzes:
  /revenue-snapshot
  → Liest analytics/revenue-dashboard.md, analytics/enrollment-tracker.md; gibt eine saubere
    MRR/Anmeldungs-/Rückerstattungszusammenfassung mit Trend-Callouts aus

## Curriculum-Design-Workflow

1. Entwerfe curriculum-outline.md — Module, Lektionen, einzeiliges Ziel pro Lektion
2. Schreibe lesson-scripts/ in Ordnung — verwende /lesson-script für jede Lektion
3. Füge slides-notes/ Zeile für Zeile für das Lesescript hinzu
4. Schreibe student-guide.md — Navigation, Erwartungen, schnelle Gewinn erste Schritte
5. Schreibe assessment-rubric.md — Kriterien und Punktgewichte für Aufgaben
6. Aufzeichnung in Loom oder Descript — Linklog in assets/loom-recordings-log.md

## Bestellungsreihenfolge

1. marketing/email-sequences/pre-launch-waitlist.md — aktivieren 30 Tage vor offenem Wagen
2. marketing/webinar-scripts/masterclass-free.md — führe 7 Tage vor offenem Wagen aus
3. marketing/sales-page-copy.md — auf Wagen-Öffnungstag veröffentlichen
4. marketing/email-sequences/launch-sequence.md — auf Wagen-Öffnung aktivieren
5. marketing/launch-plan.md — tägliche Aufgabenausführung durch Wagen-Schließung
6. marketing/email-sequences/post-purchase-nurture.md — aktiviere bei Kauftrigger in Stripe/Zapier

## Triage für Schülersupport

Stufe 1 — Self-Service (verwende /support-reply): Login-Probleme, Zugriffsverzögerungen, Abrechnungsquittungen,
  Fragen zum Navigieren → Matching mit der Konservenreaktion in operations/student-support-templates.md

Stufe 2 — Urteil erforderlich (Entwurf + Markierung für Review): Rückerstattungsanfragen innerhalb des 30-Tage-Fensters,
  Zugriffserweiterungsanfragen, technische Wiedergabeprobleme → read refund-policy.md vor dem Entwerfen

Stufe 3 — sofort eskalieren (nicht entwerfen): Chargebacks, rechtliche Beschwerden, Belästigung
  Berichte, Affiliate-Betrug → Notiz im Ticket und Route zum Menschen

## Workspace-Konventionen

- Kurs-Verzeichnisse werden mit Kebab-Case-Slugs benannt, die dem Teachable/Kajabi-URL-Slug entsprechen
- Lesescripte heißen m<module-number>-l<lesson-number>-<slug>.md (z. B. m02-l03-prompt-templates.md)
- Slides-Notizen sind identisch mit Lesescripten mit -slides-notes-Suffix
- E-Mail-Sequenzen verwenden nummerierte Präfixe, wenn die Reihenfolge wichtig ist: 01-day0-welcome.md, 02-day1-quick-win.md
- Alle Startdaten in marketing/ verwenden ISO 8601 (YYYY-MM-DD) — keine mehrdeutigen Datumsformate
- Protokollieren Sie jede neue Zapier-Automatisierung in operations/zapier-automations.md an dem Tag, an dem sie live geht

## Nicht tun

- Schreiben Sie keine Lesescripte, ohne zuerst die curriculum-outline.md für diesen Kurs zu lesen
- Entwerfe keine Sales-Page, ohne zu lesen, was der Kurs tatsächlich lehrt — keine erfundenen Behauptungen
- Genehmige keine Rückerstattungen oder gewähre Zugriffserweiterungen — /support-reply nur Entwürfe, Mensch sendet
- Speichern Sie keine E-Mail-Adressen von Schülern, Stripe-Kunden-IDs oder Zahlungsdaten in einer Workspace-Datei
- Begehen Sie keine Analytics-Dateien mit einzelnen Schülerdatensätzen in ein Remote-Repository
```

## MCP-Server

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/$USER/online-course-business/courses",
        "/Users/$USER/online-course-business/marketing",
        "/Users/$USER/online-course-business/operations",
        "/Users/$USER/online-course-business/analytics"
      ]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "convertkit": {
      "command": "npx",
      "args": ["-y", "@convertkit/mcp-server"],
      "env": {
        "CONVERTKIT_API_KEY": "${CONVERTKIT_API_KEY}",
        "CONVERTKIT_API_SECRET": "${CONVERTKIT_API_SECRET}"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    }
  }
}
```

## Empfohlene Hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'lesson-scripts/'; then echo '[course-business] Lesson script written — confirm a matching slides-notes/ file exists and the Loom recording is logged in assets/loom-recordings-log.md.'; fi"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'email-sequences/'; then echo '[course-business] Email sequence written — verify subject lines are under 50 characters and each email has a single clear CTA before loading into ConvertKit.'; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[course-business] Session ended. Reminder: update analytics/enrollment-tracker.md if any new enrollments were processed, and log any new Zapier automations in operations/zapier-automations.md.'"
          }
        ]
      }
    ]
  }
}
```

## Zu installierende Fertigkeiten

```bash
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill data-ml/stakeholder-report
```

## Verwandt

- [Course Creator Guide](../guides/for-course-creator.md)
- [Course Launch Workflow](../workflows/course-launch.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
