# Online Cursusverkoop — Projectstructuur

> Een werkruimte voor cursusauteurs of educatoren voor het ontwerpen van leerplannen, het lanceren van kennisproducten, het beheren van studentengemeenschappen en het volgen van inschrijvingsomzet — aangestuurd door schuine opdrachten en cursusspecifieke context.

## Stack

- **Teachable** / **Kajabi** / **Thinkific** — cursushosting, drip-inhoud, voortgang van studenten volgen, certificaten
- **ConvertKit** / **ActiveCampaign** — e-mailreeksen, abonnees taggen, broadcast-campagnes, automatiseringsregels
- **Loom** / **Descript** — asynchrone video-opname, schermafbeelding, transcriptbewerking, overdub-correcties
- **Circle** / **Skool** — studentengemeenschap, cohorträimtes, discussiedraden, ledenmijlpalen
- **Stripe** — betalingsverwerking, abonnementsfacturering, couponcodes, restitutiebeheer
- **Canva** — cursusgrafische afbeeldingen, verkooppagina-mockups, social media-assets, certificaatsjablonen
- **Notion** — leerplanningsborden, lessenscriptschrijving, lanceercalendars, SOP's
- **Calendly** — 1:1 coachingoproepboeking, kantooruurbepaling, onboarding-oproepen
- **Zapier** — cross-platform-automatiseringen (nieuw aankoop → welkomste-mail, communityuitnodiging, tag in ConvertKit)

## Mappenstructuur

```
online-course-business/
├── .claude/
│   ├── CLAUDE.md                                        # werkruimte-instructies voor Claude Code
│   ├── settings.json                                    # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── new-course.md                                # /new-course <title> — stelt volledige courses/ submap in
│       ├── lesson-script.md                             # /lesson-script <module> <lesson-title> — schrijft volledige lesscript met intro-hook, onderwijspunten, CTA
│       ├── email-sequence.md                            # /email-sequence <sequence-name> <num-emails> — ontwerpt voedings- of lanceringsvolgorde
│       ├── launch-plan.md                               # /launch-plan <course-slug> <launch-date> — volledige voor/tijdens/na lanceercalendar
│       ├── sales-page.md                                # /sales-page <course-slug> — ontwerpt langformige verkooppagina-kopie uit leerplanschema
│       ├── support-reply.md                             # /support-reply <ticket-summary> — ontwerpt begripvol, beleidsafstemde ondersteuningsantwoord
│       ├── weekly-prompt.md                             # /weekly-prompt <community-platform> — genereert deze week's communityengagementprompt
│       └── revenue-snapshot.md                         # /revenue-snapshot — leest analysebestanden en vat inschrijvings- en omzettendensen samen
├── courses/
│   ├── _template/                                       # kopieer deze map als je een nieuwe cursus maakt
│   │   ├── curriculum-outline.md                        # module- en leschema met leerdoelstellingen per les
│   │   ├── student-guide.md                             # studentenvoorkant welkomdoc: wat te verwachten, navigeren, volgende stappen
│   │   ├── assessment-rubric.md                         # beoordelingscriteria voor opdrachten of projectindieningen
│   │   ├── lesson-scripts/
│   │   │   └── m01-l01-template.md                      # lesscriptsjabloon: hook, leren, demonstreren, oefenen, CTA
│   │   └── slides-notes/
│   │       └── m01-l01-slides-notes.md                  # dia-voor-dia sprekeraantekeningen gekoppeld aan lesscript
│   ├── accelerate-with-ai/                              # voorbeeldcursus: "Accelerate With AI"
│   │   ├── curriculum-outline.md                        # 6-module kaart: instellen → vragen stellen → automatisering → inhoud → ops → schaal
│   │   ├── student-guide.md                             # onboarding-doc gekoppeld vanuit welkomstige-mail
│   │   ├── assessment-rubric.md                         # eindproject rubrica: Use-case helderheid, vraagkwaliteit, outputwaarde
│   │   ├── lesson-scripts/
│   │   │   ├── m01-l01-what-is-ai-for-business.md       # hook: "U bent al achter" → context → Claude-demonstratie → opdracht
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
│   └── freelance-to-agency/                             # tweede cursus: "Freelance to Agency"
│       ├── curriculum-outline.md                        # 5-module kaart: positionering → aanbiedingen → inhuren → systemen → schaal
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
│   ├── launch-plan.md                                   # meesterlanceercalendar: voor lancering → winkelwagen open → winkelwagen gesloten → na lancering
│   ├── sales-page-copy.md                               # langformige verkooppagina: kop, VSL-script, voordelen, FAQ's, garantie, CTA's
│   ├── social-calendar.md                               # 30-daags inhoudgrid: platform, posttype, kophoek, benodigde asset
│   ├── email-sequences/
│   │   ├── welcome-sequence.md                          # 5-email welkom: dag 0 aanmelden, dag 1 snelle overwinning, dag 3 module 1, dag 7 check-in, dag 14 mijlpaal
│   │   ├── pre-launch-waitlist.md                       # 7-email wachtlijstbouw: probleemagitatie → oplossingsteasing → sociaal bewijs → early-bird CTA
│   │   ├── launch-sequence.md                           # 10-email winkelwagen-open volgorde: open → waarde → faq → sluit → laatste kans
│   │   ├── post-purchase-nurture.md                     # 4-email post-aankoop volgorde: bevestig → access → eerste overwinning → upsell naar coaching
│   │   ├── re-engagement.md                             # 3-email terugwinnen voor abonnees inactief 90+ dagen
│   │   └── affiliate-onboarding.md                      # 4-email volgorde voor nieuwe partners: assets → swipe-kopie → traceerlinks → bonusstructuur
│   └── webinar-scripts/
│       ├── masterclass-free.md                          # gratis trainingsscript: 60-min waarderijke presentatie met pitch op minuut 45
│       └── sales-webinar.md                             # live lanceringwebinar: achtergrondverhaal → raamwerk → casestudies → aanbod → Vragen en Antwoorden
├── community/
│   ├── onboarding-message.md                            # vastgemaakte welkomstbericht voor Circle/Skool: regels, navigeren, eerste post-prompt
│   ├── weekly-prompts.md                                # 52-weekenlogboek van communityengagementprompten — één per week
│   ├── member-milestones.md                             # sjablonen voor mijlpaalviering: module 1 voltooid, halfweg, afstuderen, getuigenisverzoek
│   └── moderation-guidelines.md                        # communityregels, schendingsniveaus, verbanningscriteriums, escalatiepad
├── operations/
│   ├── student-support-templates.md                     # stereotiepaantwoorden: inlogproblemen, restitutieaanvragen, factureringsvragen, toegangsverlenging
│   ├── refund-policy.md                                 # 30-daagse tevredenheidgarantie voorwaarden, hoe aan te vragen, verwerkingstijdlijn
│   ├── affiliate-program.md                             # commissiestructuur (30%), cookie-venster, uitbetalingsschema, verboden promotiemethoden
│   ├── pricing-strategy.md                              # tiered-logica, betalingsplannen, coupon-strategie, eeuwigdurend versus lanceringsprijzen
│   ├── onboarding-sop.md                                # stap-voor-stap: nieuwe student → Teachable-access → Circle-uitnodiging → ConvertKit-tag → Calendly-link
│   └── zapier-automations.md                            # gedocumenteerde Zap-inventaris: trigger → filter → actie voor elke live automatisering
├── analytics/
│   ├── enrollment-tracker.md                            # maandelijkse inschrijvingstellers per cursus, kanaal, campagnegegevensbron
│   ├── completion-rates.md                              # voltooiingspercentage module-voor-module en uitvaltpunten per cohort
│   ├── revenue-dashboard.md                             # MRR, LTV, terugbetalingspercentage, partnerutbetalingen — maandelijks bijgewerkt
│   └── email-metrics.md                                 # openingspercentages, KVR's, afmelding per volgorde en broadcast — wekelijks bijgehouden
└── assets/
    ├── canva-templates.md                               # links naar gedeelde Canva-bibliotheek: miniaturen, socialeposts, certificaat, verkooppagina-graphics
    ├── brand-guide.md                                   # hex-kleuren, lettertypen, logobeheer, toon, ja/nee voorbeelden
    └── loom-recordings-log.md                           # inventaris van Loom-links per module en les met opnamedatum en status
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/lesson-script.md` | Schuine opdracht die de cursus `curriculum-outline.md` leest en het leerdoel van de doelmodule, schrijft vervolgens een volledig lesscript met een patroononderbreking hook, drie onderwijspunten, een demonstratiesegment, een oefenopgave, en een duidelijke CTA — klaar om op te nemen in Loom of Descript |
| `.claude/commands/email-sequence.md` | Accepteert een volgordenaam en e-mailnummer, leest de overeenkomstige `courses/` schets voor context, en ontwerpt elke e-mail met onderwerpregel, voorbeeldtekst, body, en CTA — ConvertKit-compatible opmaak |
| `.claude/commands/sales-page.md` | Leest een cursus `curriculum-outline.md`, `student-guide.md`, en `assessment-rubric.md`, ontwerpt vervolgens een langformige verkooppagina met VSL-script, voordelbullets, module-voor-module uitsplitsing, FAQ's, garantieblok, en meerdere CTA's |
| `.claude/commands/support-reply.md` | Neemt een ticketsamenvatting, leest `operations/refund-policy.md` en `operations/student-support-templates.md`, en ontwerpt een beleidsconforme, begripvolle reactie — markeert rand gevallen die menselijke escalatie nodig hebben |
| `courses/<slug>/curriculum-outline.md` | Waarheidsgetrouwe bron voor elke cursus: moduletitels, lestitel, en een enkele doelstelling per les — alle andere opdrachten lezen dit bestand eerst |
| `marketing/launch-plan.md` | Meesterlanceercalendar met pre-lancering (30 dagen), winkelwagen open (7 dagen), en post-lancering (14 dagen) fasen — elke dag heeft een kanaal, taak, en kophoek |
| `operations/zapier-automations.md` | Levende inventaris van elke actieve Zap: triggeragselectie, filters, en actiestappen — voorkomt dubbele automatiseringen en maakt debugging snel |
| `analytics/revenue-dashboard.md` | Maandelijkse omzet snapshot: bruto omzet, restituties, netto, MRR per cursus, LTV per verwervingskanaal — de `/revenue-snapshot` opdracht leest en vat dit samen |

## Snel steiger

```bash
# Werkruimtewortels en Claude-config aanmaken
mkdir -p online-course-business/.claude/commands

# Cursussjabloon aanmaken
mkdir -p online-course-business/courses/_template/lesson-scripts
mkdir -p online-course-business/courses/_template/slides-notes

# Voorbeeldcursusmap aanmaken
mkdir -p online-course-business/courses/accelerate-with-ai/lesson-scripts
mkdir -p online-course-business/courses/accelerate-with-ai/slides-notes
mkdir -p online-course-business/courses/freelance-to-agency/lesson-scripts
mkdir -p online-course-business/courses/freelance-to-agency/slides-notes

# Marketingmappen aanmaken
mkdir -p online-course-business/marketing/email-sequences
mkdir -p online-course-business/marketing/webinar-scripts

# Gemeenschaps-, bedrijfsvoerings-, analyse- en assetmap aanmaken
mkdir -p online-course-business/community
mkdir -p online-course-business/operations
mkdir -p online-course-business/analytics
mkdir -p online-course-business/assets

# Schuine opdrachten inzetten
touch online-course-business/.claude/commands/new-course.md
touch online-course-business/.claude/commands/lesson-script.md
touch online-course-business/.claude/commands/email-sequence.md
touch online-course-business/.claude/commands/launch-plan.md
touch online-course-business/.claude/commands/sales-page.md
touch online-course-business/.claude/commands/support-reply.md
touch online-course-business/.claude/commands/weekly-prompt.md
touch online-course-business/.claude/commands/revenue-snapshot.md

# Cursussjabloonbestanden inzetten
touch online-course-business/courses/_template/curriculum-outline.md
touch online-course-business/courses/_template/student-guide.md
touch online-course-business/courses/_template/assessment-rubric.md
touch online-course-business/courses/_template/lesson-scripts/m01-l01-template.md
touch online-course-business/courses/_template/slides-notes/m01-l01-slides-notes.md

# Marketingbestanden inzetten
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

# Gemeenschapsbestanden inzetten
touch online-course-business/community/onboarding-message.md
touch online-course-business/community/weekly-prompts.md
touch online-course-business/community/member-milestones.md
touch online-course-business/community/moderation-guidelines.md

# Bedrijfsvoeringsbestanden inzetten
touch online-course-business/operations/student-support-templates.md
touch online-course-business/operations/refund-policy.md
touch online-course-business/operations/affiliate-program.md
touch online-course-business/operations/pricing-strategy.md
touch online-course-business/operations/onboarding-sop.md
touch online-course-business/operations/zapier-automations.md

# Analysebestanden inzetten
touch online-course-business/analytics/enrollment-tracker.md
touch online-course-business/analytics/completion-rates.md
touch online-course-business/analytics/revenue-dashboard.md
touch online-course-business/analytics/email-metrics.md

# Assetbestanden inzetten
touch online-course-business/assets/canva-templates.md
touch online-course-business/assets/brand-guide.md
touch online-course-business/assets/loom-recordings-log.md

# Relevante vaardigheden installeren
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/de/stakeholder-report
```

## CLAUDE.md-sjabloon

```markdown
# Online Cursusverkoop — Claude Code-instructies

## Wat dit is

Dit is een werkruimte voor cursusauteurs. Deze bevat leerplannen voor meerdere cursussen, marketingkopie en e-mailreeksen, communitybeheersinhoud, ondersteuning van studentenoperaties, en inschrijvingsanalytics. Claude Code functioneert hier als curriculum writer, lanceringscopywriter, ondersteuningsconcept-drafter, en analyticssamenvatting — leest altijd cursusspecifieke context voordat je uitvoer genereert.

Verzin nooit leerplanstructuur. Lees altijd eerst het relevante curriculum-outline.md.

## Stack

- Cursusplatform: Teachable / Kajabi / Thinkific — hosting, drip, voortgang volgen
- E-mail: ConvertKit / ActiveCampaign — volgorde, broadcasts, abonnee tagging
- Video: Loom / Descript — les opname, transcript bewerking, overdub
- Gemeenschap: Circle / Skool — discussies, cohorträimtes, mijlpalen
- Betalingen: Stripe — eenmalig, betalingsplannen, abonnementen, restituties
- Grafische afbeeldingen: Canva — miniaturen, verkoopassets, certificaten
- Planning: Notion — leerplanningsborden, lanceercalendars, SOP's
- Planning: Calendly — coachingoproepen, kantooruren, onboarding-oproepen
- Automatisering: Zapier — cross-platform triggers (aankoop → access → e-mail → gemeenschap)

## Gemeenschappelijke taken en exacte opdrachten

Scaffold een nieuwe cursus:
  /new-course <title>
  → Maakt courses/<slug>/ aan met curriculum-outline.md, student-guide.md, assessment-rubric.md,
    lesson-scripts/, en slides-notes/ uit de _template-map

Schrijf een lesscript:
  /lesson-script <course-slug> <module-number> <lesson-title>
  → Leest courses/<slug>/curriculum-outline.md voor het leerdoel, schrijft vervolgens een volledig
    script: hook voor patroononderbreking, drie onderwijspunten, demo, oefenopgave, CTA

Ontwerp een e-mailvolgorde:
  /email-sequence <sequence-name> <num-emails>
  → Leest relevant cursusschema voor context; ontwerpt elke e-mail met onderwerp, voorbeeldtekst,
    body, en CTA in ConvertKit-compatible opmaak

Schrijf een lanceringplan:
  /launch-plan <course-slug> <launch-date>
  → Leest marketing/launch-plan.md voor structuur; voert een gedateerde voor-lancering/winkelwagen-open/
    post-lancering-calendar uit met taak, kanaal, en kophoek voor elke dag

Ontwerp een verkooppagina:
  /sales-page <course-slug>
  → Leest curriculum-outline.md, student-guide.md; schrijft langformige kopie met VSL-script,
    voordelbullets, moduleuitsplitsing, FAQ's, garantieblok, en CTA's

Beantwoord een ondersteuningsticket:
  /support-reply <ticket-summary>
  → Leest operations/refund-policy.md en operations/student-support-templates.md; ontwerpt een
    beleidsconforme begripvolle reactie; markeert escalatigetriggers

Genereer een communityprompt:
  /weekly-prompt <platform>
  → platform is een van: circle / skool / slack
  → Schrijft deze week's engagementprompt met verwijzing naar huidige cursasfase van de gemeenschap

Vat omzet samen:
  /revenue-snapshot
  → Leest analytics/revenue-dashboard.md, analytics/enrollment-tracker.md; voert een schone
    MRR/inschrijvings/restitutiesamenvatting uit met trendaantekeningen

## Leerplanontwerp workflow

1. Conceptcurriculum-outline.md — modules, lessen, één-regel doelstelling per les
2. Schrijf lesson-scripts/ in volgorde — gebruik /lesson-script voor elke les
3. Voeg slides-notes/ toe gekoppeld aan het lesscript regel voor regel
4. Schrijf student-guide.md — navigatie, verwachtingen, snelle winnende eerste stap
5. Schrijf assessment-rubric.md — criteria en puntgewichten voor opdrachten
6. Opnamen in Loom of Descript — log link in assets/loom-recordings-log.md

## Lancering volgordeorder

1. marketing/email-sequences/pre-launch-waitlist.md — activeert 30 dagen vóór open winkelwagen
2. marketing/webinar-scripts/masterclass-free.md — voert uit 7 dagen vóór open winkelwagen
3. marketing/sales-page-copy.md — publiceer op winkelwagen open dag
4. marketing/email-sequences/launch-sequence.md — activeert bij winkelwagen open
5. marketing/launch-plan.md — dagelijkse taakuitvoering tot winkelwagen sluiten
6. marketing/email-sequences/post-purchase-nurture.md — activeert op aankooptrigger in Stripe/Zapier

## Ondersteuning studententriaging

Niveau 1 — zelfbediening (gebruik /support-reply): inlogproblemen, toegangsvertragingen, factureringskwitanties,
  navigatievragen → match met operations/student-support-templates.md stereotiepaantwoorden

Niveau 2 — oordeelsvermogen vereist (concept + vlag voor beoordeling): restitutieaanvragen binnen 30-daags venster,
  toegangsverlenging aanvragen, technische playback-problemen → lees refund-policy.md voordat je concepten maakt

Niveau 3 — escaleer onmiddellijk (geen concept): chargebacks, juridische klachten, intimidatie
  rapporten, partneerfraude → noteer in ticket en routeer naar menselijk

## Werkruimte conventies

- Cursusmap hebben kebab-case slugs die overeenkomen met de Teachable/Kajabi URL-slug
- Lesscripten heten m<module-number>-l<lesson-number>-<slug>.md (bijv. m02-l03-prompt-templates.md)
- Dia-aantekeningen heten identiek aan lesscripten met -slides-notes suffix
- E-mailvolgordes gebruiken genummerde voorvoegsels als volgorde van belang is: 01-dag0-welkom.md, 02-dag1-snelle-overwinning.md
- Alle lanceerdatums in marketing/ gebruiken ISO 8601 (JJJJ-MM-DD) — geen dubbel zinnige datumaanduiding
- Log elke nieuwe Zapier-automatisering in operations/zapier-automations.md op de dag van lancering

## Niet doen

- Schrijf geen lesscripten zonder eerst het curriculum-outline.md voor die cursus te lezen
- Ontwerp geen verkooppagina zonder te lezen wat de cursus werkelijk onderwijst — geen verzonnen beweringen
- Goedkeuren van restituties of verlengen van toegang — /support-reply ontwerpt alleen, mens verzendt
- Sla studentene-mailadressen, Stripe klantnummers, of betalingsgegevens niet op in werkruimtebestanden
- Commit analysebestanden met afzonderlijke studentenrecords niet op enige externe opslagplaats
```

## MCP-servers

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
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'lesson-scripts/'; then echo '[course-business] Lesscript geschreven — bevestig dat een overeenkomstig slides-notes/ bestand bestaat en dat de Loom-opname is geregistreerd in assets/loom-recordings-log.md.'; fi"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'email-sequences/'; then echo '[course-business] E-mailvolgorde geschreven — controleer dat onderwerpregels korter zijn dan 50 karakters en elk e-mailbericht heeft één duidelijke CTA voordat u in ConvertKit laadt.'; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[course-business] Sessie beëindigd. Herinnering: werk analytics/enrollment-tracker.md bij als er nieuwe inschrijvingen zijn verwerkt, en registreer nieuwe Zapier-automatiseringen in operations/zapier-automations.md.'"
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
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill data-ml/stakeholder-report
```

## Gerelateerd

- [Cursusauteur Gids](../guides/for-course-creator.md)
- [Cursus Lancerings Workflow](../workflows/course-launch.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
