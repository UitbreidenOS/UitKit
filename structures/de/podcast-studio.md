# Podcast Studio-Betrieb — Projektstruktur

> Für Podcast-Ersteller und Multi-Show-Netzwerke, die den gesamten Produktionslebenszyklus verwalten — vom Gäste-Booking und Aufnahme über Bearbeitung, Verteilung, Monetarisierung und Community-Wachstum — in einem einzigen Claude Code-Workspace.

## Stack

- **Remote-Aufnahme:** Riverside.fm (separate Audio-/Videospuren, lokale Aufnahme) oder SquadCast (ähnlich; bevorzugt für reine Audio-Shows)
- **Bearbeitung + Transkription:** Descript (wortbasierte Bearbeitung, Studio Sound, Overdub, Transkript-Export)
- **Hosting + RSS:** Buzzsprout (einzelne Show, Analytik, Spotify/Apple Auto-Submit) oder RSS.com (Multi-Show; unterstützt IAB-zertifizierte Download-Statistiken)
- **Multi-Show-Verwaltung:** Transistor (mehrere Shows unter einem Konto, Teamzugriff, private Podcasts)
- **Website:** Podpage (automatisch aus RSS-Feed generiert; Episode-Seiten, Gäste-Biografien, Hörer-Bewertungen)
- **Verteilung:** Spotify for Podcasters, Apple Podcasts Connect, YouTube (Video-Podcast + Clips)
- **E-Mail-Liste:** ConvertKit (Automatisierungssequenzen, Episode-Broadcasts, Premium-Abonnenten-Segmente)
- **Premium-Inhalte + Zahlungen:** Stripe (Abonnement-Abrechnung für Bonus-Episoden, werbefreie Feeds)
- **Audiogramm / Social Clips:** Descript (Clip-Export), Headliner (Audiogramme mit Wellenform), CapCut (Kurzfilm-Reels)
- **Planung:** Calendly (Gäste-Booking, automatisierte Erinnerungen) verknüpft mit Riverside.fm Session-Einladung
- **Analytik:** Buzzsprout/Transistor integrierte Statistiken, Chartable (plattformübergreifende Zuordnung), Spotify for Podcasters Dashboard

## Verzeichnisbaum

```
podcast-studio/
├── .claude/
│   ├── CLAUDE.md                              # Workspace-Anweisungen für Claude Code
│   ├── settings.json                          # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── new-episode.md                     # /new-episode — Episodenordner + Kurzbeschreibung scaffolden
│       ├── show-notes.md                      # /show-notes — Shownotes aus Transkript generieren
│       ├── social-promo.md                    # /social-promo — plattformeigene Social-Posts erstellen
│       ├── guest-outreach.md                  # /guest-outreach — personalisierte Pitch-E-Mail entwurf
│       ├── sponsor-pitch.md                   # /sponsor-pitch — Sponsoring-Proposal aus Kit schreiben
│       ├── newsletter-episode.md              # /newsletter-episode — Shownotes in ConvertKit-E-Mail konvertieren
│       └── performance-review.md              # /performance-review — Episode-Analytik zusammenfassen
├── episodes/
│   ├── _template/                             # Diesen Ordner kopieren beim Start einer neuen Episode
│   │   ├── brief.md                           # Gäste- + Thema-Kontext, Winkel, Schlüsselfragen
│   │   ├── outline.md                         # Segment-für-Segment Talk-Track (Intro, Fragen, Abschluss)
│   │   ├── shownotes.md                       # Veröffentlichte Shownotes: Zusammenfassung, Links, Kapitel
│   │   ├── transcript.md                      # Descript-exportiertes bereinigtes Transkript
│   │   ├── social-promo.md                    # LinkedIn, Twitter/X, Instagram, YouTube-Beschreibung
│   │   └── performance.md                     # Download-Zahlen, Hörer-Verweildauer, Ratings-Änderung
│   ├── ep001-[guest-slug]/
│   │   ├── brief.md                           # Pre-Call Recherche + Fragen-Stack
│   │   ├── outline.md                         # Segment-Timing, Ad-Placement-Markierungen
│   │   ├── recorded-2026-05-14.md             # Aufnahmesession-Notizen (Tech-Probleme, Schlüssel-Zeitstempel)
│   │   ├── shownotes.md                       # Finale veröffentlichte Shownotes mit Kapitel-Zeitstempel
│   │   ├── transcript.md                      # Volles Descript-Transkript, Sprecher-gekennzeichnet
│   │   ├── social-promo.md                    # Alle Social-Copy-Varianten für Launch-Woche
│   │   └── performance.md                     # 7/30/90-Tage Download-Statistiken + Hörer-Feedback
│   ├── ep002-[guest-slug]/
│   │   ├── brief.md
│   │   ├── outline.md
│   │   ├── recorded-2026-05-28.md
│   │   ├── shownotes.md
│   │   ├── transcript.md
│   │   ├── social-promo.md
│   │   └── performance.md
│   └── ep003-[topic-slug]/                    # Solo-Episode — kein Gast; Brief behandelt nur Recherche
│       ├── brief.md
│       ├── outline.md
│       ├── recorded-2026-06-04.md
│       ├── shownotes.md
│       ├── transcript.md
│       ├── social-promo.md
│       └── performance.md
├── production/
│   ├── recording-sop.md                       # Riverside.fm Session-Checkliste (Mic-Check, Backup-Aufnahme)
│   ├── editing-checklist.md                   # Descript-Bearbeitungsschritte: Bereinigung, Studio Sound, Kapitel, Export
│   ├── distribution-checklist.md              # Buzzsprout-Upload, Spotify/Apple-Submit, Podpage-Aktualisierung
│   ├── thumbnail-specs.md                     # Cover-Art-Größen: 3000x3000px (Podcast), 1280x720px (YT)
│   ├── audio-settings.md                      # Export-Spezifikationen: 128kbps MP3, 44.1kHz, Stereo, -16 LUFS
│   └── release-schedule.md                   # Wöchentlich/zweiwöchentlich Kalender, Episode-Warteschlange, Veröffentlichungszeiten
├── guests/
│   ├── prospect-list.md                       # Eingestufte Liste von Zielgästen mit Kontaktinfo + Notizen
│   ├── outreach-templates.md                  # Cold Pitch, Warm Intro und Follow-up E-Mail-Vorlagen
│   ├── prep-guide.md                          # Gäste-Prep-Dokument: Format, Tech-Setup, Riverside.fm-Link
│   ├── post-interview-followup.md             # Dank-E-Mail + Social-Share-Anfrage-Vorlage
│   ├── booking-tracker.md                     # Pipeline: Prospecting / Pitched / Booked / Recorded / Aired
│   └── past-guests/
│       ├── [guest-slug].md                    # Pro Gast: Bio, Episode-Link, Social Handles, Feedback
│       └── vip-guests.md                      # Hochwertige Gäste wert Wiederbuchung oder Cross-Promotion
├── marketing/
│   ├── social-templates/
│   │   ├── linkedin-episode-launch.md         # LinkedIn-Post-Vorlage für neue Episode-Drops
│   │   ├── twitter-thread-template.md         # Twitter/X Thread-Struktur für Schlüssel-Episode-Takeaways
│   │   ├── instagram-caption-template.md      # IG-Bildunterschrift mit Audiogramm-Kontext + CTA
│   │   ├── youtube-description-template.md    # YT Video-Beschreibung mit Kapiteln + Links
│   │   └── tiktok-hook-template.md            # 3-Sekunden Hook-Skripte für TikTok/Reels-Clips
│   ├── clip-strategy.md                       # Welche Momente clippen, Clip-Länge pro Plattform, Tools
│   ├── newsletter-promo.md                    # ConvertKit Episode-Broadcast-Vorlage + Betreffzeilen
│   ├── cross-promo-tracker.md                 # Gäste-Swaps, Ad-Reads und Co-Marketing-Partnerschaften
│   └── launch-playbook.md                     # Vollständiger Release-Woche-Kampagne: Tag-für-Tag Posting-Plan
├── monetization/
│   ├── sponsor-kit.md                         # One-Pager: Show-Statistiken, Publikum-Demografie, Ad-Formate
│   ├── ad-rates.md                            # Pre-Roll / Mid-Roll / Post-Roll CPM-Raten nach Stufe
│   ├── sponsor-tracker.md                     # Aktive Sponsoren: Vertragsdaten, Liefergegenstände, Zahlungsstatus
│   ├── premium-content.md                     # Stripe-Abonnement-Stufen, Bonus-Episode-Rhythmus, Perks
│   └── affiliate-tracker.md                   # Affiliate-Partner, eindeutige Links, Provisionsraten, Auszahlungen
└── analytics/
    ├── episode-performance.md                 # Pro-Episode-Tabelle: Downloads, Vervollständigungsrate, Bewertungen
    ├── growth-dashboard.md                    # Monatliches Abonnenten-Wachstum, Plattform-Aufschlüsselung, Top-Episodes
    ├── audience-survey-2026-q1.md             # Hörer-Umfrageergebnisse + Schlüssel-Erkenntnisse
    └── benchmarks.md                          # Branche-CPD-Benchmarks, Download-Ziele nach Show-Stufe
```

## Erklärung wichtiger Dateien

| Pfad | Zweck |
|---|---|
| `episodes/_template/brief.md` | Pre-Recording Recherche-Dokument: Gäste-Bio, frühere Inhalte, Gesprächspunkte, 10-12 Interview-Fragen organisiert nach Segment; vor jeder Aufnahme in neuen Episode-Ordner kopieren |
| `episodes/_template/shownotes.md` | Veröffentlichte Shownotes-Vorlage mit Zusammenfassungs-Absatz, Schlüssel-Takeaways, Gäste-Bio-Block, Ressourcen-Links, Kapitel-Zeitstempel und Transkript-Link; treibt Buzzsprout Episode-Beschreibung |
| `production/recording-sop.md` | Schritt-für-Schritt Riverside.fm Session-Checkliste mit Mic-Pegel, lokale Aufnahme-Sicherung, Netzwerk-Test, Berechtigungen und Notfallplan falls Gäste-Verbindung unterbrochen wird |
| `production/editing-checklist.md` | Descript Bearbeitungs-Workflow: Füllwörter entfernen, Studio Sound anwenden, Kapitel-Markierungen setzen, Intro/Outro-Musik hinzufügen, in korrektem LUFS exportieren und zu Buzzsprout hochladen |
| `production/distribution-checklist.md` | Post-Edit Publish-Checkliste: Buzzsprout Upload-Einstellungen, Spotify/Apple Submit-Bestätigung, Podpage Cache-Aktualisierung, YouTube-Upload und Newsletter-Trigger in ConvertKit |
| `guests/prospect-list.md` | Bewertete Liste von Zielgästen mit Spalte für Relevanz, Publikumsgröße, Beziehungswärme und Outreach-Status — die einzige Wahrheitsquelle für Gäste-Pipeline |
| `monetization/sponsor-kit.md` | Pitch Deck in Markdown: Show-Beschreibung, Hörer-Demografie (Alter, Rolle, Einkommen), Download-Statistiken, Ad-Format-Optionen, Beispiel Ad-Skripte und Testimonials von früheren Sponsoren |
| `analytics/growth-dashboard.md` | Monatliche Momentaufnahme von Gesamt-Abonnenten, Pro-Plattform Download-Aufschlüsselung, Top 5 Episodes, durchschnittliche Downloads pro Episode in ersten 7 Tagen und MoM-Wachstumsprozentsatz |

## Schnell-Scaffold

```bash
# Workspace-Root erstellen
mkdir -p podcast-studio && cd podcast-studio

# Claude Code Verzeichnisse
mkdir -p .claude/commands

# Episode-Vorlage
mkdir -p episodes/_template
touch episodes/_template/brief.md
touch episodes/_template/outline.md
touch episodes/_template/shownotes.md
touch episodes/_template/transcript.md
touch episodes/_template/social-promo.md
touch episodes/_template/performance.md

# Erste drei Episode-Stubs
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

# Gäste-Pipeline
mkdir -p guests/past-guests
touch guests/prospect-list.md
touch guests/outreach-templates.md
touch guests/prep-guide.md
touch guests/post-interview-followup.md
touch guests/booking-tracker.md
touch guests/past-guests/vip-guests.md

# Marketing-Assets
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

# Monetarisierung
mkdir -p monetization
touch monetization/sponsor-kit.md
touch monetization/ad-rates.md
touch monetization/sponsor-tracker.md
touch monetization/premium-content.md
touch monetization/affiliate-tracker.md

# Analytik
mkdir -p analytics
touch analytics/episode-performance.md
touch analytics/growth-dashboard.md
touch analytics/benchmarks.md

# Konfigurationsdateien initialisieren
touch .claude/CLAUDE.md
touch .claude/settings.json

# Podcast-Produktions-Skills installieren
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/doc-site-builder
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill marketing/social-media-manager
npx claudient add skill small-business/content-repurposer

# Benutzerdefinierte Slash-Befehle hinzufügen
npx claudient add command new-episode
npx claudient add command show-notes
npx claudient add command social-promo
npx claudient add command guest-outreach
npx claudient add command sponsor-pitch
npx claudient add command newsletter-episode
npx claudient add command performance-review

echo "Podcast Studio-Workspace bereit."
```

## CLAUDE.md-Vorlage

```markdown
# Podcast Studio — Claude-Anweisungen

## Was ist das

Dieser Workspace verwaltet End-to-End Podcast-Betrieb: Gäste-Prospecting, Pre-Interview-
Recherche, Recording Session-Vorbereitung, Bearbeitungs-Workflow, Shownotes-Produktion, Multi-
Plattform-Verteilung, Social-Clip-Strategie, E-Mail-Marketing, Sponsoring-Verkauf und Analytik.

Die Show wird wöchentlich veröffentlicht. Alle Episode-Arbeiten leben in episodes/<ep-slug>/. Drafts 
außerhalb dieser Struktur nicht eintragen.

## Stack

- Remote-Aufnahme: Riverside.fm — separate Audio-/Videospuren, lokale Backup aktiviert
- Bearbeitung + Transkription: Descript — wortbasierte Bearbeitung, Studio Sound Rauschentfernung
- Hosting: Buzzsprout — RSS-Feed, Spotify/Apple Auto-Verteilung, Download-Analytik
- Website: Podpage — automatisch aus Buzzsprout RSS generiert; nach jedem Publish aktualisieren
- E-Mail: ConvertKit — Episode-Broadcast-Sequenz, Premium-Abonnenten-Segment (Tag: premium)
- Zahlungen: Stripe — 9 $/Monat Premium-Stufe (Bonus-Episoden, werbefreier Feed)
- Verteilung: Spotify for Podcasters, Apple Podcasts Connect, YouTube (Video-Podcast)
- Clips: Descript (Clip-Export), Headliner (Audiogramme), CapCut (Reels/TikTok)
- Analytik: Buzzsprout-Statistiken + Chartable (plattformübergreifende Zuordnung)

## Verzeichnis-Konventionen

- episodes/<ep-slug>/ — ein Ordner pro Episode; kopieren aus episodes/_template/
- episodes/_template/ — Master-Vorlage; niemals direkt von diesem Ordner veröffentlichen
- production/ — SOPs und Checklisten; aktualisieren wenn Workflow sich ändert, nicht pro Episode
- guests/ — Prospect-Pipeline und Vorlagen; past-guests/ für archivierte Pro-Gast-Datensätze
- marketing/social-templates/ — wiederverwendbare Frameworks; Pro Episode im Episode-Ordner ausfüllen
- monetization/ — live Sponsor-Verträge in sponsor-tracker.md; Raten in ad-rates.md
- analytics/ — update episode-performance.md am Tag 7 und Tag 30 nach Publish

## Episode-Ordner-Bennung

Format: ep<NNN>-<guest-or-topic-slug>
Beispiele: ep042-sarah-jones, ep043-ai-in-healthcare, ep044-solo-q-and-a

## Allgemeine Aufgaben — genaue Befehle

**Scaffold einen neuen Episode-Ordner:**
/new-episode number=043 guest="First Last" topic="[topic]" record-date="YYYY-MM-DD"

**Shownotes aus Transkript generieren:**
/show-notes transcript=episodes/ep043-[slug]/transcript.md guest="First Last" links="[comma-separated URLs]"

**Launch-Woche Social-Copy erstellen:**
/social-promo episode=episodes/ep043-[slug]/shownotes.md platforms="linkedin,twitter,instagram,youtube"

**Gäste Outreach-E-Mail entwurf:**
/guest-outreach guest="First Last" company="[Company]" topic="[pitch angle]" warm="[mutual contact or no]"

**Sponsoring-Proposal schreiben:**
/sponsor-pitch sponsor="[Brand]" format="mid-roll" episodes=4 rate=episodes

**ConvertKit Episode-E-Mail generieren:**
/newsletter-episode shownotes=episodes/ep043-[slug]/shownotes.md subject-variants=3

**Episode Performance Summary abrufen:**
/performance-review episode=episodes/ep043-[slug]/performance.md period=30d

## Aufnahme-Konventionen

- Riverside.fm: immer lokale Aufnahme-Sicherung aktivieren vor Beginn; Gäste-Mic in
  ersten 30 Sekunden überprüfen; stoppen und neu aufnehmen wenn Audio unter -24 LUFS Peak
- Audio-Export von Descript: 128kbps MP3, 44.1kHz, Stereo, -16 LUFS integriert
- Episode-Datei-Bennung für Buzzsprout-Upload: show-name-ep043-guest-slug.mp3
- Zeitstempel in transcript.md verwenden HH:MM:SS Format; Kapitel-Markierungen passen zu shownotes.md

## Shownotes-Konventionen

- Zusammenfassung: 3-4 Sätze, kein Fluff, Gäste-Haupterkenntnisse vorstellen
- Schlüssel-Takeaways: 3-5 Punkte, jeder actionable oder zitierbar
- Gäste-Bio: 2 Sätze max, Link zu ihrer Website und LinkedIn
- Ressourcen: jeder in der Episode erwähnte Link, klar gekennzeichnet
- Kapitel-Zeitstempel: jede Segment-Grenze, mindestens 5 Kapitel pro Episode
- CTA: ein primärer CTA (abonnieren, bewerten oder premium) — niemals drei CTAs stapeln

## Verteilungs-Checkliste (nach Buzzsprout-Upload ausführen)

1. Bestätigen Spotify Auto-Submit innerhalb 4 Stunden nach Publish erfolgt
2. An Apple Podcasts Connect einreichen wenn manuelle Genehmigung erforderlich
3. Podpage aktualisieren (Settings > Refresh Feed)
4. Video-Version zu YouTube hochladen mit Beschreibung aus social-promo.md
5. ConvertKit-Broadcast für 8 AM Hörer-Zeitzone planen (Dienstag bevorzugt)
6. Social-Clips posten: LinkedIn selber Tag, Twitter/X Thread Tag 2, Instagram Tag 3
7. Episode in analytics/episode-performance.md protokollieren

## Monetarisierungs-Konventionen

- Ad-Platzierungen: Pre-Roll 60s (max), Mid-Roll 90s bei 20-Minuten-Mark, Post-Roll 30s
- Nur Host-gelesene Ads — keine dynamisch eingefügten Ads unter 10k Downloads/Episode
- Sponsor-Copy lebt in Episode outline.md unter "AD BREAK" Markierungen
- Neue Sponsor-Raten benötigen Genehmigung; verwende ad-rates.md Stufen, verhandle nie unter Floor
- Jeden Liefergegenstand und Zahlung in monetization/sponsor-tracker.md selber Tag protokollieren

## Analytik-Rhythmus

- Tag 7 nach Publish: Downloads in analytics/episode-performance.md protokollieren
- Tag 30: aktualisieren mit 30-Tage-Gesamten und Vervollständigungsrate von Spotify for Podcasters
- Monatlich: analytics/growth-dashboard.md mit Abonnenten-Anzahl und MoM-Delta aktualisieren
- Vierteljährlich: Hörer-Umfrage durchführen; Ergebnisse in analytics/audience-survey-YYYY-QN.md archivieren
```

## MCP-Server

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

## Skills zu installieren

```bash
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill marketing/social-media-manager
npx claudient add skill small-business/content-repurposer
```

## Verwandt

- [Leitfaden: Claude für Content Creator](../guides/for-content-marketer.md)
- [Workflow: Content Creation End-to-End](../workflows/content-creation.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
