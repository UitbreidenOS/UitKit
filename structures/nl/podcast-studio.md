# Podcast Studio Operations — Projectstructuur

> Voor podcastmakers en multi-show-netwerken die de volledige productiecyclus beheren — van gastboeking en opnames via bewerking, distributie, monetisering en community-groei — in één Claude Code-werkruimte.

## Stack

- **Remote recording:** Riverside.fm (aparte audio/video tracks, lokale opnames) of SquadCast (vergelijkbaar; aanbevolen voor audio-only shows)
- **Bewerking + transcriptie:** Descript (woord-gebaseerde bewerking, Studio Sound, overdub, transcript export)
- **Hosting + RSS:** Buzzsprout (enkele show, analytics, Spotify/Apple auto-submit) of RSS.com (multi-show; ondersteunt IAB-gecertificeerde download-statistieken)
- **Multi-show management:** Transistor (meerdere shows onder één account, teamtoegang, private podcasts)
- **Website:** Podpage (automatisch gegenereerd uit RSS-feed; afleveringspagina's, gastbiografia, luisteraarreviews)
- **Distributie:** Spotify for Podcasters, Apple Podcasts Connect, YouTube (videopodcast + clips)
- **E-maillijst:** ConvertKit (automatiseringsequenties, afleveringuitzendingen, premium abonnee-segmenten)
- **Premium-inhoud + betalingen:** Stripe (abonnementsfacturering voor bonusafleveringen, ad-free feeds)
- **Audiogram / social clips:** Descript (clip export), Headliner (audiograms met golfvorm), CapCut (short-form video reels)
- **Planning:** Calendly (gastboeking, geautomatiseerde herinneringen) gekoppeld aan Riverside.fm sessie-uitnodiging
- **Analytics:** Buzzsprout/Transistor ingebouwde statistieken, Chartable (platformoverschrijdende attributie), Spotify for Podcasters dashboard

## Mappenstructuur

```
podcast-studio/
├── .claude/
│   ├── CLAUDE.md                              # Werkruimte-instructies voor Claude Code
│   ├── settings.json                          # MCP servers, hooks, machtigingen
│   └── commands/
│       ├── new-episode.md                     # /new-episode — scaffold afleveringsmap + brief
│       ├── show-notes.md                      # /show-notes — genereer shownotes uit transcript
│       ├── social-promo.md                    # /social-promo — maak platformnative social posts
│       ├── guest-outreach.md                  # /guest-outreach — conceptpersonaliseerde pitch e-mail
│       ├── sponsor-pitch.md                   # /sponsor-pitch — schrijf sponsorvoorstel uit kit
│       ├── newsletter-episode.md              # /newsletter-episode — converteer shownotes naar ConvertKit e-mail
│       └── performance-review.md              # /performance-review — samenvat afleveringsanalytics
├── episodes/
│   ├── _template/                             # Kopieer deze map bij het starten van een nieuwe aflevering
│   │   ├── brief.md                           # Gast + onderwerpcontext, hoek, sleutelvragen
│   │   ├── outline.md                         # Segment-per-segment talk track (intro, vragen, close)
│   │   ├── shownotes.md                       # Gepubliceerde shownotes: samenvatting, links, hoofdstukken
│   │   ├── transcript.md                      # Descript-geëxporteerd schoon transcript
│   │   ├── social-promo.md                    # LinkedIn, Twitter/X, Instagram, YouTube-beschrijving
│   │   └── performance.md                     # Downloadtellers, luisteraarretentie, ratingsdelta
│   ├── ep001-[guest-slug]/
│   │   ├── brief.md                           # Pre-call onderzoeks- + vraagstack
│   │   ├── outline.md                         # Segment timing, ad placement markers
│   │   ├── recorded-2026-05-14.md             # Opnamesessieopmerkingen (technische problemen, sleuteltijdstempels)
│   │   ├── shownotes.md                       # Uiteindelijke gepubliceerde shownotes met hoofdstuktijdstempels
│   │   ├── transcript.md                      # Volledig Descript-transcript, spreker-gelabeld
│   │   ├── social-promo.md                    # Alle social copy-varianten voor lanceringsweek
│   │   └── performance.md                     # 7/30/90-dag downloadstatistieken + luisteraarfeedback
│   ├── ep002-[guest-slug]/
│   │   ├── brief.md
│   │   ├── outline.md
│   │   ├── recorded-2026-05-28.md
│   │   ├── shownotes.md
│   │   ├── transcript.md
│   │   ├── social-promo.md
│   │   └── performance.md
│   └── ep003-[topic-slug]/                    # Solo-aflevering — geen gast; brief dekt alleen onderzoek
│       ├── brief.md
│       ├── outline.md
│       ├── recorded-2026-06-04.md
│       ├── shownotes.md
│       ├── transcript.md
│       ├── social-promo.md
│       └── performance.md
├── production/
│   ├── recording-sop.md                       # Riverside.fm sessie checklist (miccheck, backup rec)
│   ├── editing-checklist.md                   # Descript bewerk stappen: schoon, Studio Sound, hoofdstukken, export
│   ├── distribution-checklist.md              # Buzzsprout upload, Spotify/Apple submit, Podpage refresh
│   ├── thumbnail-specs.md                     # Cover art maten: 3000x3000px (podcast), 1280x720px (YT)
│   ├── audio-settings.md                      # Export specs: 128kbps MP3, 44.1kHz, stereo, -16 LUFS
│   └── release-schedule.md                    # Wekelijks/tweewekelijks kalender, afleveringsrij, publicatietijden
├── guests/
│   ├── prospect-list.md                       # Gerangschikte lijst met gastdoelwitten, contactgegevens + notities
│   ├── outreach-templates.md                  # Cold pitch, warm intro en vervolgings-e-mailsjablonen
│   ├── prep-guide.md                          # Gastvoorbereidingsdoc: formaat, technische instellingen, Riverside.fm-link
│   ├── post-interview-followup.md             # Dank je-e-mail + social share ask-sjabloon
│   ├── booking-tracker.md                     # Pipeline: prospecting / pitched / booked / recorded / aired
│   └── past-guests/
│       ├── [guest-slug].md                    # Per-gast: bio, afleveringslink, social handles, feedback
│       └── vip-guests.md                      # Waardevol gasten die waard zijn om opnieuw in te boeken of cross-promotie
├── marketing/
│   ├── social-templates/
│   │   ├── linkedin-episode-launch.md         # LinkedIn post-sjabloon voor nieuwe afleveringen
│   │   ├── twitter-thread-template.md         # Twitter/X thread structuur voor sleuteltakeaways afleveringen
│   │   ├── instagram-caption-template.md      # IG-bijschrift met audiogram-context + CTA
│   │   ├── youtube-description-template.md    # YT-videobeschrijving met hoofdstukken + links
│   │   └── tiktok-hook-template.md            # 3-seconden hook scripts voor TikTok/Reels clips
│   ├── clip-strategy.md                       # Welke momenten clippen, cliplengte per platform, tools
│   ├── newsletter-promo.md                    # ConvertKit afleveringsuitzendingssjabloon + onderwerpslinies
│   ├── cross-promo-tracker.md                 # Gastswaps, ad reads, en co-marketingpartnerschappen
│   └── launch-playbook.md                     # Volledige lanceringsweek-campagne: dagelijks posting schema
├── monetization/
│   ├── sponsor-kit.md                         # One-pager: show-statistieken, doelgroepdemografie, ad-formaten
│   ├── ad-rates.md                            # Pre-roll / mid-roll / post-roll CPM-tarieven per tier
│   ├── sponsor-tracker.md                     # Actieve sponsors: contractdata, leveringsplichtingen, betalingsstatus
│   ├── premium-content.md                     # Stripe abonnementstiers, bonusafleveringscadans, perks
│   └── affiliate-tracker.md                   # Affiliatepartners, unieke links, commissarissen, payouts
└── analytics/
    ├── episode-performance.md                 # Per-afleveringstabel: downloads, voltooiingspercentage, ratings
    ├── growth-dashboard.md                    # Maandelijkse abonneegroeaangroei, platformuitsplitsing, toppafleveringen
    ├── audience-survey-2026-q1.md             # Luisteraaronderzoeksresultaten + sleutelinzichten
    └── benchmarks.md                          # Industrie CPD benchmarks, downloadtargets per show tier
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `episodes/_template/brief.md` | Vooropnamings-researchdocument: gastbio, voorbije inhoud, gespreksonderwerpen, 10-12 interviewvragen georganiseerd op segment; kopieer naar nieuwe afleveringsmap vóór elke opname |
| `episodes/_template/shownotes.md` | Gepubliceerde shownotes sjabloon met samenvattingsparagraaf, sleutelgeheimen, gastbioblock, resourcelinks, hoofdstuktijdstempels en transcriptlink; stuurt Buzzsprout afleveringsbeschrijving |
| `production/recording-sop.md` | Stap-voor-stap Riverside.fm sessie checklist met micniveaus, lokale opname backup, netwerktest, machtigingen en contingentie als gastverbinding valt uit |
| `production/editing-checklist.md` | Descript bewerkingsworkflow: verwijder vulwoorden, pas Studio Sound toe, stel hoofdstukermerkers in, voeg intro/outro-muziek toe, exporteer op correcte LUFS en upload naar Buzzsprout |
| `production/distribution-checklist.md` | Post-edit publiceer checklist: Buzzsprout upload instellingen, Spotify/Apple submit confirmatie, Podpage cache vernieuwen, YouTube upload en newsletter trigger in ConvertKit |
| `guests/prospect-list.md` | Gescoorde lijst gastdoelwitten met kolom voor relevantie, publieksgrootte, relatieverwarming en outreach-status — de enige bron van waarheid voor gastpipeline |
| `monetization/sponsor-kit.md` | Pitch deck in Markdown: show-beschrijving, luisteraardemografie (leeftijd, rol, inkomsten), downloadstatistieken, ad-formaatopties, voorbeeldscripts voor advertenties en testimonials van voorbije sponsors |
| `analytics/growth-dashboard.md` | Maandelijkse snapshot van totale abonnees, per-platform downloadopsplitsing, top 5 afleveringen, gemiddelde downloads per aflevering in eerste 7 dagen en MoM groeipercentage |

## Snelle scaffolding

```bash
# Create workspace root
mkdir -p podcast-studio && cd podcast-studio

# Claude Code directories
mkdir -p .claude/commands

# Episode template
mkdir -p episodes/_template
touch episodes/_template/brief.md
touch episodes/_template/outline.md
touch episodes/_template/shownotes.md
touch episodes/_template/transcript.md
touch episodes/_template/social-promo.md
touch episodes/_template/performance.md

# First three episode stubs
for ep in ep001-guest-placeholder ep002-guest-placeholder ep003-solo-placeholder; do
  mkdir -p "episodes/$ep"
  for f in brief.md outline.md shownotes.md transcript.md social-promo.md performance.md; do
    touch "episodes/$ep/$f"
  done
done

# Production SOPs
mkdir -p production
touch production/recording-sop.md
touch production/editing-checklist.md
touch production/distribution-checklist.md
touch production/thumbnail-specs.md
touch production/audio-settings.md
touch production/release-schedule.md

# Guest pipeline
mkdir -p guests/past-guests
touch guests/prospect-list.md
touch guests/outreach-templates.md
touch guests/prep-guide.md
touch guests/post-interview-followup.md
touch guests/booking-tracker.md
touch guests/past-guests/vip-guests.md

# Marketing assets
mkdir -p marketing/social-templates
touch marketing/social-templates/linkedin-episode-launch.md
touch marketing/social-templates/twitter-thread-template.md
touch marketing/social-templates/instagram-caption-template.md
touch marketing/social-templates/youtube-description-template.md
touch marketing/social-templates/tiktok-hook-template.md
touch marketing/clip-strategy.md
touch marketing/newsletter-promo.md
touch marketing/cross-promo-tracker.md
touch marketing/launch-playbook.md

# Monetization
mkdir -p monetization
touch monetization/sponsor-kit.md
touch monetization/ad-rates.md
touch monetization/sponsor-tracker.md
touch monetization/premium-content.md
touch monetization/affiliate-tracker.md

# Analytics
mkdir -p analytics
touch analytics/episode-performance.md
touch analytics/growth-dashboard.md
touch analytics/benchmarks.md

# Initialize config files
touch .claude/CLAUDE.md
touch .claude/settings.json

# Install podcast production skills
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/doc-site-builder
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill marketing/social-media-manager
npx claudient add skill small-business/content-repurposer

# Add custom slash commands
npx claudient add command new-episode
npx claudient add command show-notes
npx claudient add command social-promo
npx claudient add command guest-outreach
npx claudient add command sponsor-pitch
npx claudient add command newsletter-episode
npx claudient add command performance-review

echo "Podcast studio workspace ready."
```

## CLAUDE.md sjabloon

```markdown
# Podcast Studio — Claude Instructies

## Wat dit is

Deze werkruimte beheert end-to-end podcastoperaties: gastprospecting, pre-interview
onderzoek, voorbereiding recordingsessie, bewerkingsworkflow, shownotes productie, multi-platform
distributie, social clip strategie, email-marketing, sponsorverkoop, en analytics.

De show wordt wekelijks gepubliceerd. Al afleveringswerk leeft in episodes/<ep-slug>/. Maak geen concepten
buiten die structuur.

## Stack

- Remote recording: Riverside.fm — aparte audio/video tracks, lokale backup ingeschakeld
- Bewerking + transcriptie: Descript — woord-gebaseerde bewerking, Studio Sound ruisverwijdering
- Hosting: Buzzsprout — RSS-feed, Spotify/Apple auto-distributie, downloadanalytics
- Website: Podpage — automatisch gegenereerd uit Buzzsprout RSS; vernieuw na elke publicatie
- E-mail: ConvertKit — afleveringuitzendingsreeks, premium abonnee-segment (tag: premium)
- Betalingen: Stripe — $9/maand premium tier (bonusafleveringen, ad-free feed)
- Distributie: Spotify for Podcasters, Apple Podcasts Connect, YouTube (videopodcast)
- Clips: Descript (clip export), Headliner (audiograms), CapCut (Reels/TikTok)
- Analytics: Buzzsprout stats + Chartable (platformoverschrijdende attributie)

## Mappenconventies

- episodes/<ep-slug>/ — één map per aflevering; kopieer uit episodes/_template/
- episodes/_template/ — meestersjabloon; nooit rechtstreeks van deze map publiceren
- production/ — SOPs en checklists; update wanneer workflow verandert, niet per aflevering
- guests/ — gastprospect-pijplijn en sjablonen; past-guests/ voor gearchiveerde per-gastrecords
- marketing/social-templates/ — herbruikbare frameworks; vullen per aflevering in afleveringsmap
- monetization/ — live sponsorcontracten in sponsor-tracker.md; tarieven in ad-rates.md
- analytics/ — update episode-performance.md op dag 7 en dag 30 na publicatie

## Naamgeving afleveringsmap

Formaat: ep<NNN>-<guest-or-topic-slug>
Voorbeelden: ep042-sarah-jones, ep043-ai-in-healthcare, ep044-solo-q-and-a

## Veelgestelde taken — exacte opdrachten

**Scaffold een nieuwe afleveringsmap:**
/new-episode number=043 guest="First Last" topic="[topic]" record-date="YYYY-MM-DD"

**Genereer shownotes uit transcript:**
/show-notes transcript=episodes/ep043-[slug]/transcript.md guest="First Last" links="[comma-separated URLs]"

**Maak lanceringsweek social copy:**
/social-promo episode=episodes/ep043-[slug]/shownotes.md platforms="linkedin,twitter,instagram,youtube"

**Concept een gastuitreik-e-mail:**
/guest-outreach guest="First Last" company="[Company]" topic="[pitch angle]" warm="[mutual contact or no]"

**Schrijf een sponsorvoorstel:**
/sponsor-pitch sponsor="[Brand]" format="mid-roll" episodes=4 rate=episodes

**Genereer ConvertKit afleveringse-mail:**
/newsletter-episode shownotes=episodes/ep043-[slug]/shownotes.md subject-variants=3

**Trekkingssammenfatting afleveringsprestaties:**
/performance-review episode=episodes/ep043-[slug]/performance.md period=30d

## Opnameconventies

- Riverside.fm: altijd lokale opname backup inschakelen vóór start; controleer gastmic in
  eerste 30 seconden; stop en maak opnieuw op als audio lager is dan -24 LUFS peak
- Audio export uit Descript: 128kbps MP3, 44.1kHz, stereo, -16 LUFS geïntegreerd
- Afleveringsbestandsnaming voor Buzzsprout upload: show-name-ep043-guest-slug.mp3
- Tijdstempels in transcript.md gebruiken HH:MM:SS formaat; hoofdstukermerkers komen overeen met shownotes.md

## Shownotes-conventies

- Samenvatting: 3-4 zinnen, geen fluff, gast's belangrijkste inzicht vooraan
- Sleutelgeheimen: 3-5 bullet points, elk activeerbaar of aanhalingsteken waardig
- Gastbio: max 2 zinnen, link naar hun site en LinkedIn
- Resources: elke link die in de aflevering wordt genoemd, duidelijk gelabeld
- Hoofdstuktijdstempels: elke segmentgrens, minimum 5 hoofdstukken per aflevering
- CTA: één primaire CTA (abonneer, review, of premium) — nooit stapel drie CTA's

## Distributie checklist (voer uit na Buzzsprout upload)

1. Bevestig Spotify auto-submit bezorgd binnen 4 uur na publicatie
2. Indienen bij Apple Podcasts Connect indien handmatige goedkeuring vereist
3. Podpage vernieuwen (Instellingen > Feed vernieuwen)
4. Upload videoversie naar YouTube met beschrijving uit social-promo.md
5. Plan ConvertKit uitzending voor 8.00 uur luisteraartijdzone (dinsdag aanbevolen)
6. Plaats social clips: LinkedIn dezelfde dag, Twitter/X thread dag 2, Instagram dag 3
7. Logaflevering in analytics/episode-performance.md

## Monetisatieconventies

- Ad plaatsen: pre-roll 60s (max), mid-roll 90s op het 20 minuten merk, post-roll 30s
- Alleen hostgelezen advertenties — geen dynamisch ingevoegde advertenties onder 10k downloads/aflevering
- Sponsorcopy leeft in de afleveringsoverzicht.md onder "AD BREAK" markeringen
- Nieuwe sponsortarieven vereisen goedkeuring; gebruik ad-rates.md tiers, onderhandel nooit onder vloer
- Log elke verzending en betaling in monetization/sponsor-tracker.md dezelfde dag

## Analytics cadence

- Dag 7 na publicatie: log downloads in analytics/episode-performance.md
- Dag 30: update met 30-daagse totaal en voltooiingspercentage van Spotify for Podcasters
- Maandelijks: update analytics/growth-dashboard.md met abonneeaantal en MoM delta
- Per kwartaal: voer luisteraaronderzoek uit; archief resultaten in analytics/audience-survey-YYYY-QN.md
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/podcast-studio"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
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
      "args": ["-y", "@stripe/agent-toolkit"],
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */episodes/*/shownotes.md ]]; then echo \"[hook] Show notes saved: $FILE — run /social-promo and /newsletter-episode before publishing\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */monetization/sponsor-tracker.md ]]; then echo \"[hook] Sponsor tracker updated: verify ad-rates.md alignment and confirm deliverable dates\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && MISSING=$(find episodes/ -mindepth 2 -name \"transcript.md\" -empty 2>/dev/null | wc -l | tr -d \" \"); [ \"$MISSING\" -gt 0 ] && echo \"[reminder] $MISSING episode(s) have empty transcript.md — export from Descript and paste in\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Te installeren skills

```bash
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill marketing/social-media-manager
npx claudient add skill small-business/content-repurposer
```

## Gerelateerd

- [Guide: Claude for Content Creators](../guides/for-content-marketer.md)
- [Workflow: Content Creation end-to-end](../workflows/content-creation.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
