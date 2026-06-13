---
name: editorial-calendar
description: "Monatlicher Redaktionskalender: Themen-Cluster, Veröffentlichungsplan, Content-Mix, Distributionsplan"
---

# Skill: Redaktionskalender

## Wann aktivieren
- Planung eines Monats oder Quartals an Inhalten für einen Blog, Newsletter oder Social Media
- Themen-Cluster auf Keywords abbilden und einen kohärenten Veröffentlichungsplan erstellen
- Den richtigen Content-Mix festlegen (How-to, Thought Leadership, Fallstudie, Vergleich usw.)
- Distributionspläne erstellen, die den Inhaltstyp dem richtigen Kanal zuordnen
- Einarbeitung einer neuen Content-Stelle mit einem strukturierten Veröffentlichungssystem
- Marke oder Website neu launchen und schnell thematische Autorität aufbauen

## Wann NICHT verwenden
- Einzelne Inhalte verfassen — dafür `/content-brief` verwenden
- Eine bestehende Seite einem SEO-Audit unterziehen — dafür `/seo-audit` verwenden
- Einzelne Social-Posts ohne strategischen Veröffentlichungsplan
- Ein Kalender existiert bereits und es müssen nur Lücken gefüllt werden — zuerst mit `/seo-audit` Lücken identifizieren

## Anweisungen

### Kernprompt zur Kalendererstellung

```
Erstelle einen monatlichen Redaktionskalender für [MARKE/PUBLIKATION].

Kontext:
- Marke: [Unternehmensname, einzeilige Beschreibung]
- Zielgruppe: [ICP — Jobtitel, Branche, Schmerzpunkte]
- Primäres Geschäftsziel: [z. B. organischer Traffic, Newsletter-Abonnenten, Pipeline-Generierung]
- Content-Kanäle: [Blog, Newsletter, LinkedIn, X, YouTube — zutreffendes auflisten]
- Veröffentlichungsrhythmus: [z. B. 2 Blogbeiträge/Woche, täglich LinkedIn, wöchentlicher Newsletter]
- Domain Authority / Content-Reifegrad: [neue Seite / 6-12 Monate alt / etabliert (DA 40+)]
- Haupt-Keyword-Cluster: [primäres Themengebiet, z. B. "B2B SaaS Onboarding"]
- Mitbewerber veröffentlicht unter: [URL oder Name — optional]

Erstelle:

## 1. Themen-Cluster-Karte
3-5 Pillar-Themen mit je 4-6 Unterthemen:
- Pillar 1: [breites Thema] → Unterthemen: [Liste]
- Pillar 2: [breites Thema] → Unterthemen: [Liste]
...

## 2. Content-Typ-Mix (in % des Gesamtinhalts)
- Lehrreiche How-tos: [X]%
- Thought Leadership / Meinung: [X]%
- Fallstudie / Kundenstory: [X]%
- Vergleich / versus: [X]%
- Keyword-gezielt (Bottom of Funnel): [X]%
- Topicales Newsjacking: [X]%

## 3. Monatskalender — [MONAT JAHR]
Für jede Woche angeben:
- Blogbeiträge (Titel, Ziel-Keyword, Content-Typ, geschätztes Traffic-Potenzial)
- Newsletter (Betreffzeile, Thema, zentraler CTA)
- LinkedIn-Posts (Thema, Format: Text/Bild/Karussell/Umfrage/Video)
- Inhalte für andere Kanäle

## 4. Distributionsplan
Für jeden veröffentlichten Beitrag:
- Primärkanal: [wo er lebt]
- Wiederverwendung: [wie er innerhalb von 48 Stunden kanalübergreifend genutzt wird]
- Promotion: [Outreach, Communities, bezahlte Verstärkung wenn Budget vorhanden]

## 5. Interne Verlinkungsstrategie
Abbilden, welche neuen Beiträge auf bestehende Cornerstone-Inhalte und aufeinander verlinken sollen.
```

### Themen-Cluster-Framework

```typescript
interface TopicCluster {
  pillar: {
    title: string
    targetKeyword: string
    searchVolume: string      // from Ahrefs/Semrush or estimated
    difficulty: number        // 0-100
    format: 'ultimate-guide' | 'hub-page' | 'long-form'
    wordCount: number         // target
  }
  spokes: Array<{
    title: string
    targetKeyword: string
    searchVolume: string
    intent: 'informational' | 'navigational' | 'commercial' | 'transactional'
    format: 'how-to' | 'listicle' | 'comparison' | 'case-study' | 'opinion'
    linksToPillar: boolean    // always true for hub-and-spoke
    priority: 'high' | 'medium' | 'low'
  }>
}

// Regeln für Pillar-Inhalte:
// - Auf Head-Keywords abzielen (1-2 Wörter), hohes Volumen, hohe Schwierigkeit
// - 3.000-8.000 Wörter — umfassend, zieht Links an
// - Vierteljährlich aktualisieren
//
// Regeln für Spoke-Inhalte:
// - Auf Long-Tail-Keywords abzielen (3-5 Wörter), moderates Volumen, niedrige bis mittlere Schwierigkeit
// - 1.200-2.500 Wörter — spezifisch, umsetzbar
// - Immer zurück zum Pillar und auf 2-3 verwandte Spokes verlinken
```

### Content-Mix-Rechner

```
Optimalen Content-Mix für meine Situation berechnen:

Unternehmensphase: [früh / Wachstum / reif]
Ziel: [Traffic / Leads / Marke / Community]
Veröffentlichungsfrequenz: [X Stücke/Monat]
Teamgröße: [solo / 1-2 Autoren / kleines Team / Agentur]

Frühe Phase + Traffic-Ziel:
- 60% informatives SEO (Top of Funnel, lehrreich)
- 20% kommerzielles SEO (Vergleich, Best-of, Alternativen)
- 20% Thought Leadership (baut Autorität auf + wird geteilt)
- Newsletter: wöchentliches Roundup, 500-800 Wörter, hoher Kurations-Wert

Wachstumsphase + Pipeline-Ziel:
- 40% informatives SEO
- 30% kommerzielles/transaktionales SEO (Bottom of Funnel)
- 20% Fallstudien + Kundenstorys
- 10% Thought Leadership zu Käufer-Schmerzpunkten
- Newsletter: wöchentliche Einblicke + ein Produkt-CTA

Reife Phase + Markenziel:
- 30% SEO-Pflege (Top-Performer aktualisieren)
- 40% Thought Leadership + Originalrecherche
- 20% Community/Publikumszusammenarbeit
- 10% experimentelle Formate (Video, Audio, interaktiv)
```

### Wöchentlicher Content-Produktionsplan

```markdown
# Vorlage für wöchentliche Content-Produktion

## Montag — Planung
- [ ] Analytik der letzten Woche auswerten (Sitzungen, Verweildauer, Conversions pro Beitrag)
- [ ] Bestätigen, dass die Beiträge dieser Woche gebrieft und zugewiesen sind
- [ ] Trending-Themen im eigenen Bereich prüfen (Twitter/LinkedIn, Google Trends, Feedly)
- [ ] Reaktive Beiträge briefen (Newsjacking-Möglichkeiten)

## Dienstag–Mittwoch — Produktion
- [ ] Autor reicht Entwürfe ein
- [ ] Redaktionsreview: Genauigkeit, Struktur, SEO, CTA
- [ ] Interne Verlinkungsprüfung (verlinkt jeder Beitrag auf 3+ andere?)
- [ ] Meta-Titel und -Beschreibung finalisieren

## Donnerstag — Veröffentlichung & Distribution
- [ ] Blogbeitrag veröffentlichen (kanonische URL, Schema, OG-Tags prüfen)
- [ ] Newsletter senden bei wöchentlichem Rhythmus
- [ ] LinkedIn-Post aus Blog erstellen — als Karussell oder Textpost formatieren
- [ ] Bei relevanten Communities einreichen (HN Show, Reddit, Slack-Gruppen)

## Freitag — Wiederverwendung
- [ ] Blog-Abschnitte in 3-5 LinkedIn-Posts umwandeln (für nächste 2 Wochen einplanen)
- [ ] Zitate für X/Twitter-Thread extrahieren
- [ ] Redaktionskalender mit tatsächlichen Veröffentlichungsdaten und Analyse-Platzhaltern aktualisieren
- [ ] Veröffentlichten Beitrag für künftige interne Verlinkungen im Backlog eintragen
```

### Distributionsstrategie nach Content-Typ

```
Jeden Content-Typ seiner optimalen Distribution zuordnen:

HOW-TO / TUTORIAL:
Primär: Blog (SEO) + YouTube (falls videogeeignet)
Wiederverwenden: LinkedIn-Karussell → X-Thread → Newsletter-Snippet → Reddit-Tutorial
Bezahlte Verstärkung: Nur wenn auf Seite 2 und ein Push nötig ist

THOUGHT LEADERSHIP / MEINUNG:
Primär: LinkedIn (nativer Longform performt gut) + Blog-Crosspost
Wiederverwenden: Newsletter-Aufmacher → X-Thread → Podcast-Diskussionsthema
Verstärkung: Erwähnte Personen taggen, Kommentare in den ersten 60 Minuten beantworten

FALLSTUDIE / KUNDENSTORY:
Primär: Blog (Cornerstone, optional mit Gate) + Verkaufsunterlagen
Wiederverwenden: LinkedIn-Kundenschwerpunkt → E-Mail an ähnliche Prospects → Folie im Sales-Deck
Verstärkung: Kunden zum Teilen einladen — deren Publikumsvertrauen > eigenes

VERGLEICH / VERSUS:
Primär: Blog (Bottom of Funnel, hohe Kaufabsicht)
Wiederverwenden: Sales-E-Mail-Anhang → Chatbot-Antwort → PPC-Landingpage
Verstärkung: NICHT in sozialen Medien teilen — wirkt eigennützig; SEO übernehmen lassen

NEWSJACKING / TREND:
Primär: LinkedIn (innerhalb von 2 Stunden nach Nachrichtenbruch veröffentlichen) + X
Wiederverwenden: Newsletter-P.S.-Abschnitt → kurzer Blogbeitrag am nächsten Tag
Verstärkung: Geschwindigkeit ist die Verstärkung; sofort distribuieren oder überspringen
```

### Redaktionskalender-Vorlage (zum Kopieren)

```markdown
# Redaktionskalender — [MONAT JAHR]

## Ziele diesen Monat
- Traffic-Ziel: [X Sitzungen]
- Newsletter-Ziel: [X Abonnenten / X% Öffnungsrate]
- Pipeline-Ziel: [X content-generierte Leads]
- Autoritätsziel: [X Backlinks / Y DA-Verbesserung]

## Woche 1 ([Datumsbereich])

| Tag | Kanal | Titel / Betreff | Typ | Keyword | CTA |
|---|---|---|---|---|---|
| Mo | Blog | [Titel] | How-to | [Keyword] | [abonnieren / Demo / Download] |
| Mi | Newsletter | [Betreffzeile] | Roundup | — | [CTA] |
| Do | LinkedIn | [Post-Thema] | Karussell | — | [interagieren / besuchen] |
| Fr | LinkedIn | [Post-Thema] | Text | — | — |

## Woche 2 ([Datumsbereich])
...

## Woche 3 ([Datumsbereich])
...

## Woche 4 ([Datumsbereich])
...

## Evergreen-Backlog (veröffentlichen, wenn Kapazität vorhanden)
- [Titel] — [Keyword] — [Priorität: H/M/N]
- [Titel] — [Keyword] — [Priorität: H/M/N]

## Content-Audits fällig diesen Monat
- [URL] — zuletzt aktualisiert [Datum] — Maßnahme: [auffrischen / konsolidieren / löschen]
```

### Quartalsplanungs-Prompt

```
Quartalsweise Content-Planungssitzung durchführen.

Performance letztes Quartal:
- Top 5 Beiträge nach Traffic: [Liste]
- Top 5 Beiträge nach Conversions: [Liste]
- Schwächste 5 Beiträge (geringer Traffic, keine Conversions): [Liste]
- Neue Keywords auf Seite 1: [Liste]
- Keywords die von Seite 1 gefallen sind: [Liste]

Prioritäten dieses Quartal:
1. Verdoppeln bei: [was gut lief] — mehr Inhalte in diesen Clustern produzieren
2. Auffrischen: [was gefallen ist] — aktualisieren, re-optimieren, interne Links hinzufügen
3. Konsolidieren: [dünne Inhalte] — zu einem starken Beitrag zusammenführen
4. Angreifen: [neuer Cluster] — neues Themengebiet für Autoritätsaufbau
5. Kürzen: [unwiderrufliche Underperformer] — 301-Weiterleitung auf verwandten starken Inhalt

Ausgabe:
- Cluster-Prioritäten für Q[X]
- Ein 13-wöchiger Veröffentlichungs-Roadmap
- Teamzuteilung: [X Beiträge/Autor/Woche]
- Budgetschätzung bei Outsourcing: [X Beiträge × $[Y]/Beitrag]
```

## Beispiel

**Nutzer:** Erstelle einen monatlichen Redaktionskalender für ein B2B-SaaS-Startup (Projektmanagement-Tool), das sich an Operations-Leiter in Unternehmen mit 50-500 Mitarbeitern richtet. Veröffentlichung: 2 Blogs/Woche, wöchentlicher Newsletter, täglich LinkedIn. Monat ist Juni.

**Ausgabe:**
```markdown
# Redaktionskalender — Juni 2026
**Marke:** [Projektmanagement-SaaS] | **Zielgruppe:** Ops-Direktoren, Chiefs of Staff | **Ziel:** Organischer Traffic + Newsletter-Wachstum

## Themen-Cluster
**Pillar 1:** Operative Effizienz → Spokes: Remote-Team-Workflows, Prozessdokumentation, Meeting-Rhythmus-Vorlagen, OKR-Tracking
**Pillar 2:** Projektmanagement → Spokes: Ressourcenplanung, Abhängigkeitskartierung, abteilungsübergreifende Projekte, Statusberichte
**Pillar 3:** Operations skalieren → Spokes: SOPs für Skalierung, Einstellungs-Ops-Playbook, Tech-Stack-Audit, Operations-KPIs

## Content-Mix
60% lehrreiches SEO | 20% Thought Leadership | 15% Fallstudien | 5% Vergleich

## Woche 1 (1.-7. Juni)
| Tag | Kanal | Titel | Typ | Keyword | CTA |
|---|---|---|---|---|---|
| Mo 2 | Blog | "How to Run a Weekly Ops Review That Actually Works" | How-to | "ops review meeting" | Newsletter abonnieren |
| Mi 4 | Newsletter | "The 5-meeting week that runs itself" | Einblick | — | Blog lesen |
| Do 5 | LinkedIn | Meeting-Overload-Karussell: 5 Ops-Meeting-Vorlagen | Karussell | — | DM für Vorlage |
| Sa 7 | LinkedIn | "Unpopular opinion: most project management tools don't solve the real problem" | Text | — | Kommentar |

## Woche 2 (8.-14. Juni)
| Tag | Kanal | Titel | Typ | Keyword | CTA |
|---|---|---|---|---|---|
| Mo 9 | Blog | "Asana vs Monday vs [Your Tool]: Which Fits Ops Teams?" | Vergleich | "asana vs monday for operations" | Kostenloser Test |
| Mi 11 | Newsletter | "How [Customer] cut their weekly reporting time by 70%" | Fallstudien-Snippet | — | Vollständige Story lesen |
| Do 12 | LinkedIn | 5-Folien-Karussell: "Ops-Transformation unseres Kunden in 90 Tagen" | Karussell | — | Link in Kommentaren |
| Fr 13 | LinkedIn | "3 Anzeichen, dass dein Projektmanagement-Tool dich ausbremst" | Text | — | — |

## Distributionsregeln
- Jeder Blogbeitrag → LinkedIn-Karussell innerhalb von 48 Stunden
- Jede Fallstudie → Sales-Team erhält den Link für ihre Pipeline
- Newsletter-Abonnenten-Klick → In HubSpot als "engagierter Content-Lead" getaggt
```

---
