# Real-Estate-Agent-Workspace — Projektstruktur

> Für einen Wohn- oder Gewerbeimmobilienmakler, der Angebote, Käufer, Verkäufer, Angebote und Schließungspipelines vom Anfang bis zum abgeschlossenen Geschäft verwaltet — von der ersten Kontaktaufnahme bis zum finanzierten Abschluss — mit Follow Up Boss, DocuSign, MLS/RPR und Google Workspace als operative Infrastruktur.

## Stack

- **Follow Up Boss** oder **Wise Agent** — CRM, Lead-Routing, Pipeline-Stufen, Drip-Kampagnen, Task-Automatisierung
- **Zillow Premier Agent** / **Realtor.com** — Listing-Portale, Lead-Erfassung, Besichtigungsanfragen, Marktpräsenz
- **DocuSign** — Kaufverträge, Maklerverträge, Zusatzvereinbarungen-Routing, eSignature-Audit-Trail
- **Google Workspace** — Gmail (Client-E-Mail-Threads), Google Drive (Dateispeicherung), Google Calendar (Besichtigungen)
- **RPR (Realtors Property Resource)** oder **MLS** — Marktdaten, Vergleichbarkeitsanalysen, CMAs, Nachbarschaftsstatistiken
- **BombBomb** — Video-E-Mail für Listing-Ankündigungen, Käufer-Touren-Zusammenfassungen, Angebotspräsentations-Nachverfolgung
- **Canva** — Neu gelistete Flyer, Social-Media-Grafiken, Käuferpräsentationsdeck, Listing-Broschüren
- **Claude Code** — Listing-Kopie, CMA-Narrativ, Angebotsentwürfe, Client-Nachfolge-E-Mails, Besichtigungszusammenfassungen

## Verzeichnisbaum

```
real-estate-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace-Anweisungen (fügen Sie die Vorlage unten ein)
│   ├── settings.json                          # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── listing-create.md                  # /listing-create — MLS-ready Beschreibung + Marketing-Kopie aus Immobiliendaten
│       ├── cma-report.md                      # /cma-report — Vergleichbarkeitsanalyse-Narrativ + Preisempfehlung
│       ├── offer-draft.md                     # /offer-draft — Kaufvertrag-Cover-E-Mail + Angebotsstrategie-Zusammenfassung
│       ├── client-followup.md                 # /client-followup — Personalisierte Nachfolge-E-Mail aus CRM-Notizen
│       ├── showing-notes.md                   # /showing-notes — strukturiertes Besichtigungsfeedback aus rohen Notizen
│       ├── market-update.md                   # /market-update — Nachbarschafts-Markt-Snapshot für Client-Nurturing
│       └── buyer-package.md                   # /buyer-package — Käuferpräsentations-Deck-Übersicht + Suchkriterien-Dokument
├── listings/
│   ├── active/
│   │   ├── _template/                         # Leerer Listing-Ordner — kopieren, wenn ein neues Listing live geht
│   │   │   ├── mls-data.md                    # MLS-Eingabeblatt: Schlafzimmer, Badezimmer, Quadratmeter, Grundstück, Baujahr, Ausstattungen
│   │   │   ├── marketing-copy.md              # Überschrift, MLS-Beschreibung, Social-Caption, E-Mail-Betreffzeilen-Varianten
│   │   │   ├── showing-feedback/              # Ordner für pro-Besichtigung Feedback-Dateien
│   │   │   │   └── .gitkeep
│   │   │   ├── photos/                        # Fotodatei-Index und Bildunterschriften (Dateinamen, keine Binärdaten)
│   │   │   │   └── photo-index.md
│   │   │   └── price-history.md               # Listenpreis, Änderungsdatum, Grund für Änderung
│   │   ├── 42-maple-st-springfield/
│   │   │   ├── mls-data.md
│   │   │   ├── marketing-copy.md
│   │   │   ├── price-history.md               # $489K → $475K am 2026-05-10 (Tage auf dem Markt: 21)
│   │   │   ├── listing-agreement.md           # Vereinbarungsdatum, Ablaufdatum, Provisionsaufteilung, Doppelmaklerei-Klausel
│   │   │   ├── showing-feedback/
│   │   │   │   ├── 2026-05-03-showing.md      # Makler des Käufers, Käuferreaktion, Einwände, Interessensstufe
│   │   │   │   ├── 2026-05-07-showing.md
│   │   │   │   └── 2026-05-14-showing.md
│   │   │   └── photos/
│   │   │       └── photo-index.md
│   │   └── 110-river-rd-unit-4b/
│   │       ├── mls-data.md
│   │       ├── marketing-copy.md
│   │       ├── price-history.md
│   │       ├── listing-agreement.md
│   │       └── showing-feedback/
│   │           └── .gitkeep
│   └── past/
│       ├── 2025-closed/
│       │   ├── 78-elm-ave-westfield/
│       │   │   ├── mls-data.md
│       │   │   ├── final-sale-price.md        # Listenpreis, Verkaufspreis, Tage auf dem Markt, Zugeständnisse
│       │   │   └── closing-notes.md           # Titelgesellschaft, Schließungsdatum, Netto für Verkäufer, Lektionen
│       │   └── 203-birch-ln-lakewood/
│       │       ├── mls-data.md
│       │       ├── final-sale-price.md
│       │       └── closing-notes.md
│       └── 2024-closed/
│           └── .gitkeep
├── buyers/
│   ├── _template/
│   │   ├── buyer-profile.md                   # Namen, Kontaktinformationen, Kreditgeber, Vorabgenehmigungsbetrag, Zeitleiste
│   │   ├── search-criteria.md                 # Schlafzimmer, Badezimmer, Preisrange, Nachbarschaften, Must-Haves, Deal-Breaker
│   │   ├── showing-history.md                 # Protokoll der gezeigten Häuser: Adresse, Datum, Reaktion, Ranking
│   │   └── offer-history.md                   # Eingereichte Angebote: Adresse, Betrag, Bedingungen, Ergebnis
│   ├── chen-family/
│   │   ├── buyer-profile.md                   # Vorabgenehmigt $620K, konventionell, 20% Anzahlung, Kreditgeber: First National
│   │   ├── search-criteria.md                 # 3BR+ Northside/Eastbrook, Schulbezirk-Priorität, Garage erforderlich
│   │   ├── showing-history.md
│   │   │   # 2026-05-01 — 42 Maple St: mochte das Layout, protestierte gegen Hinterhofgröße
│   │   │   # 2026-05-09 — 18 Oak Ct: starkes Interesse, HOA-Bedenken
│   │   └── offer-history.md
│   │       # 2026-05-12 — 18 Oak Ct: $598K, 10-Tage-Inspektion, vom Verkäufer abgelehnt
│   ├── rodriguez-patricia/
│   │   ├── buyer-profile.md
│   │   ├── search-criteria.md
│   │   ├── showing-history.md
│   │   └── offer-history.md
│   └── kim-david/
│       ├── buyer-profile.md
│       ├── search-criteria.md
│       ├── showing-history.md
│       └── offer-history.md
├── sellers/
│   ├── _template/
│   │   ├── seller-profile.md                  # Namen, Kontaktinformationen, Verkaufsmotiv, Zeitleiste, Eigenkapitalschätzung
│   │   ├── cma.md                             # Vergleichbarkeitsanalyse: aktiv, ausstehend, verkauft + Preisempfehlung
│   │   ├── listing-agreement.md               # Vereinbarungsbedingungen, Ablaufdatum, Ausschlüsse, Doppelmaklerei-Offenlegung
│   │   └── price-change-history.md            # Protokoll der Listenpreisreduktionen mit Daten und Begründung
│   ├── johnson-mark-and-linda/
│   │   ├── seller-profile.md                  # 42 Maple St — relokation, muss bis 1. August schließen
│   │   ├── cma.md                             # CMA-Analyse 2026-04-20, empfohlen $489K–$499K
│   │   ├── listing-agreement.md
│   │   └── price-change-history.md
│   └── torres-carlos/
│       ├── seller-profile.md
│       ├── cma.md
│       ├── listing-agreement.md
│       └── price-change-history.md
├── templates/
│   ├── listing-description-template.md        # Überschrift + Formel für MLS, Zillow und Social Media
│   ├── buyer-offer-letter-template.md         # Persönlicher Angebots-Brief des Käufers — baut emotionale Verbindung auf
│   ├── neighborhood-summary-template.md       # Begehbare Annehmlichkeiten, Schulbewertungen, Pendlerverkehr, Markttrend-Snapshot
│   ├── market-update-template.md              # Monatliche E-Mail: neue Listings, durchschn. DOM, List-to-Sale-Verhältnis, Prognose
│   ├── showing-feedback-request-template.md   # E-Mail an Makler des Käufers mit Aufforderung zu spezifischem Feedback nach der Besichtigung
│   ├── price-reduction-announcement.md        # E-Mail + Social-Kopie für Listenpreisreduktions-Mitteilung
│   └── open-house-followup-template.md        # Nachverfolgung am selben Tag für Open-House-Besucher mit CTA
├── contracts/
│   ├── purchase-agreements/
│   │   ├── residential-purchase-agreement-ca.md    # California RPA — Schlüsselfelder, Kontingenzausfallwerte, Zeitleiste
│   │   ├── residential-purchase-agreement-tx.md    # Texas TREC One-to-Four Family Residential — Schlüsselfelder
│   │   └── commercial-purchase-agreement.md        # LOI zu PSA Flow, Due-Diligence-Standardwerte
│   ├── addenda/
│   │   ├── inspection-contingency-removal.md       # Kontingenz-Entfernungs-Timing und Standardsprache
│   │   ├── loan-contingency-addendum.md            # Kredittyp, LTV, Zinsobergrenze, Entfernungsfrist
│   │   ├── seller-rent-back-addendum.md            # Rückmiete-Bedingungen, Tagessatz, Kaution
│   │   └── as-is-addendum.md                       # As-is-Offenlegung, Käufer-Akzeptanzsprache
│   └── disclosure-packets/
│       ├── seller-property-questionnaire.md        # SPQ-Schlüsselbereiche zur Überprüfung mit Verkäufer vor dem Listing
│       └── transfer-disclosure-statement.md        # TDS-Felder, Rote-Flaggen-Checkliste für Makler
├── marketing/
│   ├── email-templates/
│   │   ├── just-listed-announcement.md        # An Sphäre + alte Clients — Ankündigung neues Listing
│   │   ├── under-contract-social-proof.md     # Ankündigung an Sphäre, um Momentum aufzubauen
│   │   ├── just-sold-case-study.md            # Post-Close-E-Mail mit Verkaufspreis, DOM, Lektionen
│   │   └── quarterly-market-report-email.md   # Q[X] Marktstatistiken + Ihre Produktionszusammenfassung
│   ├── social-posts/
│   │   ├── listing-launch-post.md             # Instagram/Facebook-Caption für neues Listing
│   │   ├── sold-announcement-post.md          # Social-Proof-Post mit Agent-Statistiken
│   │   └── market-tip-series.md              # 5-teilige pädagogische Post-Serie für Nurturing
│   └── video-scripts/
│       ├── listing-tour-intro.md              # BombBomb-Skript — Immobilien-Intro für Käufer-Interessenten
│       ├── offer-presentation-script.md       # Video für Verkäufer mit Angebots-Bedingungen und Empfehlung
│       └── buyer-check-in-script.md           # Wöchentliche Video-Touchpoint für aktive Käufer-Clients
├── reports/
│   ├── monthly-production-report.md           # Geschlossenes Volumen, aktive Listings, Käufer-Clients, durchschn. DOM, Provision
│   ├── pipeline-tracker.md                    # Alle aktiven Käufer + Listings nach Stufe: aktiv, unter Vertrag, ausstehend
│   ├── lead-source-tracker.md                 # Leads nach Quelle (Zillow, Referral, Open House) und Konversionsrate
│   └── quarterly-review.md                    # Q[X] Ziele vs. Ergebnisse, Top-Erfolge, Anpassungen für nächstes Quartal
└── scratch/
    ├── weekly-priorities.md                   # Montags-Entwurf: Top-3-Listings, Top-3-Käufer, fällige Nachverfolgungen
    └── call-notes-staging.md                  # Rohe Post-Call-Notizen vor der Ablage in Käufer- oder Verkäufer-Ordner
```

## Wichtigste Dateien erklärt

| Pfad | Zweck |
|---|---|
| `.claude/commands/listing-create.md` | Slash-Befehl, der rohe Immobiliendaten (Schlafzimmer, Badezimmer, Ausstattungen, Verkaufsargumente) nimmt und MLS-ready Beschreibung, Überschrift-Varianten und Social-Captions in einem Durchgang zurückgibt |
| `.claude/commands/cma-report.md` | Slash-Befehl, der Vergleichbarkeiten aus RPR oder MLS nimmt und ein strukturiertes CMA-Narrativ mit Preisempfehlung und Konfidenzlevel zurückgibt |
| `.claude/commands/offer-draft.md` | Slash-Befehl, der Käuferprofil, Zielimmobilie und Angebotsbedingungen nimmt und eine Cover-E-Mail, persönlichen Angebots-Brief und Makler-zu-Makler-Nachricht für Einreichung zurückgibt |
| `.claude/commands/client-followup.md` | Slash-Befehl, der einen Käufer- oder Verkäufernamen, letzte Interaktion und nächsten Schritt nimmt und dann eine personalisierte Nachfolge-E-Mail in der Stimme des Maklers entwirft |
| `.claude/commands/showing-notes.md` | Slash-Befehl, der rohe Post-Besichtigungs-Notizen in eine strukturierte Feedback-Datei mit Käuferreaktion, Einwänden, Interessensscore und empfohlenem nächsten Schritt konvertiert |
| `listings/active/_template/` | Kanonische Ordnerstruktur zum Kopieren, wenn ein neues Listing aktiv geht — stellt sicher, dass jedes Listing MLS-Daten, Marketing-Kopie, Besichtigungsfeedback und Preishistorie an einem Ort hat |
| `sellers/<name>/cma.md` | CMA-Analyse für jeden Verkäufer-Client — speichert Vergleichbarkeitsauswahl, Preisrange-Rationale und abschließende Empfehlung; wird aktualisiert, wenn sich Marktbedingungen vor der Preisbestimmung ändern |
| `reports/pipeline-tracker.md` | Einzige Informationsquelle für alle aktiven Deals nach Stufe — jeden Montagmorgen überprüft, um Nachverfolgungen zu priorisieren und Deals zu kennzeichnen, die aus dem Verkehr gezogen werden können |

## Schnelle Gerüste

```bash
# Workspace-Root erstellen
mkdir -p real-estate-workspace

# .claude-Struktur mit Befehlen erstellen
mkdir -p real-estate-workspace/.claude/commands

# Listings-Struktur erstellen
mkdir -p real-estate-workspace/listings/active/_template/showing-feedback
mkdir -p real-estate-workspace/listings/active/_template/photos
mkdir -p real-estate-workspace/listings/active/42-maple-st-springfield/showing-feedback
mkdir -p real-estate-workspace/listings/active/42-maple-st-springfield/photos
mkdir -p real-estate-workspace/listings/active/110-river-rd-unit-4b/showing-feedback
mkdir -p real-estate-workspace/listings/past/2025-closed/78-elm-ave-westfield
mkdir -p real-estate-workspace/listings/past/2025-closed/203-birch-ln-lakewood
mkdir -p real-estate-workspace/listings/past/2024-closed

# Käufer-Struktur erstellen
mkdir -p real-estate-workspace/buyers/_template
mkdir -p real-estate-workspace/buyers/chen-family
mkdir -p real-estate-workspace/buyers/rodriguez-patricia
mkdir -p real-estate-workspace/buyers/kim-david

# Verkäufer-Struktur erstellen
mkdir -p real-estate-workspace/sellers/_template
mkdir -p real-estate-workspace/sellers/johnson-mark-and-linda
mkdir -p real-estate-workspace/sellers/torres-carlos

# Templates, Contracts, Marketing, Reports, Scratch erstellen
mkdir -p real-estate-workspace/templates
mkdir -p real-estate-workspace/contracts/purchase-agreements
mkdir -p real-estate-workspace/contracts/addenda
mkdir -p real-estate-workspace/contracts/disclosure-packets
mkdir -p real-estate-workspace/marketing/email-templates
mkdir -p real-estate-workspace/marketing/social-posts
mkdir -p real-estate-workspace/marketing/video-scripts
mkdir -p real-estate-workspace/reports
mkdir -p real-estate-workspace/scratch

# Seed .gitkeep-Platzhalter
touch real-estate-workspace/listings/active/_template/showing-feedback/.gitkeep
touch real-estate-workspace/listings/past/2024-closed/.gitkeep
touch real-estate-workspace/buyers/_template/.gitkeep
touch real-estate-workspace/sellers/_template/.gitkeep

# Real-Estate-Skills installieren
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer
npx claudient add skill marketing/email-sequence
npx claudient add skill gtm/crm-hygiene

# Command-Stubs in .claude/commands/ kopieren
npx claudient add skill small-business/real-estate-listing --output real-estate-workspace/.claude/commands/listing-create.md
npx claudient add skill small-business/cma-report --output real-estate-workspace/.claude/commands/cma-report.md
npx claudient add skill small-business/buyer-offer-writer --output real-estate-workspace/.claude/commands/offer-draft.md
npx claudient add skill marketing/email-sequence --output real-estate-workspace/.claude/commands/client-followup.md
```

## CLAUDE.md-Vorlage

```markdown
# Real-Estate-Agent-Workspace — Claude-Code-Anweisungen

## Was das ist

Dies ist das Arbeitsverzeichnis für einen Immobilienmakler, der aktive Listings, Käufer-Clients,
Verkäufer-Clients, Verträge und Marketing verwaltet. Listings leben in listings/, Käuferdateien in buyers/,
Verkäuferdateien in sellers/ und wiederverwendbare Assets in templates/ und contracts/.
Alle Listing-Kopie, CMAs, Angebotsentwürfe, Client-Nachverfolgungen und Marktupdates laufen durch Claude-Code-Skills.

## Stack

- Follow Up Boss — CRM of Record (Leads, Pipeline-Stufen, Drip-Kampagnen, Tasks)
- DocuSign — Vertrags-Routing; verfolgen Sie Umschlag-IDs im relevanten Listing- oder Käuferpordner
- RPR / MLS — Marktdaten; fügen Sie Vergleichbarkeitstabellen in die relevante cma.md vor der Ausführung von /cma-report ein
- Google Drive — Langzeit-Dateispeicherung; synchronisieren Sie geschlossene Deal-Ordner nach der Finanzierung
- BombBomb — Video-E-Mail; Skripte leben in marketing/video-scripts/
- Canva — Marketing-Grafiken; referenzieren Sie Design-Namen in marketing/social-posts/
- Zillow / Realtor.com — Listing-Portale; notieren Sie Portal-IDs in mls-data.md für jedes Listing

## Häufige Aufgaben und exakte Befehle

### Neue Listing-Beschreibung erstellen
```
/listing-create

Address: [Straßenadresse]
Property type: [Einfamilienhaus / Eigentumswohnung / Mehrfamilienhaus / gewerblich]
Beds: [N] | Baths: [N] | Sqft: [N] | Lot: [N Quadratmeter oder Acres] | Year built: [YYYY]
Garage: [ja/nein, N-platz] | Pool: [ja/nein] | HOA: [ja/nein, $X/Monat]
Upgrades: [Schlüsselsanierungen oder Ausstattungen auflisten]
Selling points: [Standortvorteil, Schulbezirk, Pendlerverkehr, Lebensstil]
Price: $[X]
Tone: [Luxus / familienfreundlich / Investition / Starter-Home]
```

### CMA durchführen und Preisempfehlung erhalten
```
/cma-report

Subject property: [Adresse, Schlafzimmer, Badezimmer, Quadratmeter, Grundstück, Baujahr, Zustand]
Active comps: [2-4 auflisten mit Adresse, Listenpreis, Schlafzimmer/Badezimmer/Quadratmeter, DOM]
Pending comps: [1-3 auflisten mit Adresse, Listenpreis, Schlafzimmer/Badezimmer/Quadratmeter]
Sold comps (last 90 days): [3-5 auflisten mit Adresse, Verkaufspreis, Schließungsdatum, Schlafzimmer/Badezimmer/Quadratmeter, DOM]
Adjustments needed: [Pool, Garage, Zustand, Grundstückgröße — notieren Sie Unterschiede]
Market trend: [Wertsteigerung / flach / abschwächend — und um wie viel pro Monat]
```

### Angebots-Einreichungspaket entwerfen
```
/offer-draft

Property: [Adresse]
Buyer: [Vornamen für persönlichen Brief]
Offer price: $[X] | List price: $[Y]
Down payment: [%] | Loan type: [konventionell / FHA / VA / bar]
Earnest money: $[X]
Inspection contingency: [ja/nein, N Tage]
Loan contingency: [ja/nein, N Tage]
Appraisal contingency: [ja/nein]
Close of escrow: [Datum oder N Tage]
Seller rent-back: [ja/nein, N Tage bei $X/Tag]
Personal letter angle: [etwas Echtes über den Käufer und warum er dieses Haus liebt]
Competing offers: [ja/nein — passen Sie die Dringlichkeit entsprechend an]
```

### Client-Nachfolge-E-Mail schreiben
```
/client-followup

Client: [Name(n)]
Client type: [Käufer / Verkäufer]
Last interaction: [Datum und was passiert ist — Besichtigung, Telefonanruf, Angebot eingereicht, usw.]
Their current status: [aktiv suchend / unter Vertrag / Listing-Vorbereitung / auf Angebot warten]
Next step needed: [was Sie sie tun lassen müssen oder was Sie sie wissen lassen möchten]
Tone: [beruhigend / aufgeregt / informativ / dringend]
```

### Besichtigungs-Notizen protokollieren und strukturieren
```
/showing-notes

Property shown: [Adresse]
Buyer: [Name]
Date: [YYYY-MM-DD]
Raw notes: [fügen Sie Ihre Sprachmemo-Transkription oder Bullet-Notizen wörtlich ein]
Buyer's agent feedback (if received): [fügen Sie ein oder fassen Sie zusammen]
```

### Marktupdate für Client-Nurturing entwerfen
```
/market-update

Neighborhood: [Name]
Date range: [z.B. Mai 2026]
New listings: [N bei durchschn. $X]
Sold: [N bei durchschn. $X, durchschn. DOM Y Tage]
List-to-sale ratio: [X%]
Inventory level: [N Monate Vorrat]
Trend: [Käufermarkt / ausgeglichen / Verkäufermarkt]
Audience: [alte Clients / aktive Käufer / Einflussssphäre]
```

### Käuferpräsentationspaket erstellen
```
/buyer-package

Buyer names: [Vornamen]
Pre-approval: $[X] | Lender: [Name]
Target neighborhoods: [Liste]
Search criteria: [Schlafzimmer, Badezimmer, Must-Haves, Deal-Breaker]
Timeline: [wann sie einziehen möchten]
First-time buyer: [ja/nein]
```

## Konventionen zum Befolgen

- Jedes aktive Listing muss mls-data.md und marketing-copy.md haben, bevor es live auf MLS geht
- Jede Besichtigung erhält eine Feedback-Datei in listings/active/<address>/showing-feedback/ mit Namen YYYY-MM-DD-showing.md
- Jeder Käufer-Client muss buyer-profile.md, search-criteria.md, showing-history.md und offer-history.md haben
- CMA-Dateien leben in sellers/<name>/cma.md — fügen Sie einen neuen Abschnitt an, wenn eine Neuanalyse erforderlich ist; überschreiben Sie nicht
- Listing-Preisänderungen werden in listings/active/<address>/price-history.md mit Datum und Grund protokolliert
- Geschlossene Deals werden von listings/active/ zu listings/past/YYYY-closed/ innerhalb von 5 Tagen nach der Finanzierung verschoben
- Angebots-Einreichungen werden in buyers/<name>/offer-history.md protokolliert — geben Sie Adresse, Betrag, Bedingungen und Ergebnis an
- pipeline-tracker.md wird jeden Montag überprüft und mit der aktuellen Stufe für jedes aktive Listing aktualisiert
- Alle Vertrags-Zusätze werden in contracts/addenda/ gespeichert und nach Namen im relevanten Deal-Ordner referenziert
```

## MCP-Server

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-gdrive"],
      "env": {
        "GDRIVE_CLIENT_ID": "your-google-oauth-client-id",
        "GDRIVE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GDRIVE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "gmail": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-gmail"],
      "env": {
        "GMAIL_CLIENT_ID": "your-google-oauth-client-id",
        "GMAIL_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GMAIL_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/real-estate-workspace"
      ]
    }
  }
}
```

## Empfehlenswerte Hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"showing-feedback\"; then echo \"[hook] Besichtigungs-Notizen gespeichert — denken Sie daran, Käuferreaktion in buyers/<name>/showing-history.md zu protokollieren und innerhalb von 24 Stunden nachzuverfolgen\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"offer-history\"; then echo \"[hook] Angebot protokolliert — aktualisieren Sie pipeline-tracker.md Stufe und setzen Sie eine Nachfolge-Aufgabe in Follow Up Boss\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Monday\" ]; then echo \"[reminder] Montag — überprüfen Sie reports/pipeline-tracker.md und aktualisieren Sie jedes aktive Listing und jeden Käufer zur aktuellen Stufe\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills zu installieren

```bash
# Kern-Real-Estate-Skills
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer

# Marketing- und Nurture-Skills
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/social-content-writer
npx claudient add skill marketing/video-script-writer

# CRM- und Operations-Skills
npx claudient add skill gtm/crm-hygiene
npx claudient add skill productivity/client-followup
npx claudient add skill productivity/weekly-review
```

## Verwandt

- [Real-Estate-Agent-Anleitung](../guides/for-real-estate-agent.md)
- [Listing-Launch-Workflow](../workflows/listing-launch.md)
- [Käufer-Tour-Workflow](../workflows/buyer-tour-cycle.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
