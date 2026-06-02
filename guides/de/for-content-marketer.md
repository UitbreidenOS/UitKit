# Claude für Content Marketer und SEO

Alles, was ein Content Marketer oder SEO-Spezialist benötigt, um KI-gestützte Content-Strategie, -Produktion, -Optimierung und -Distribution in Claude Code umzusetzen.

---

## Für wen dieser Leitfaden ist

Du bist Content Marketer, SEO-Manager oder Growth Marketer und hast die Aufgabe, eine Zielgruppe aufzubauen, organischen Traffic zu steigern und Leser in Leads oder Kunden umzuwandeln. Du verlierst zu viel Zeit mit dem Starren auf leere Seiten, dem Schreiben von Briefings, dem Umformatieren von Inhalten für verschiedene Kanäle und dem Zusammenführen von Analysen in Berichte.

**Vor Claude Code:** 90 Minuten für Recherche und Briefing eines Blog-Beitrags. 45 Minuten für eine Social-Media-Post-Serie. Ein halber Tag für einen monatlichen Redaktionskalender. Stundenlang Autoren hinterherjagen für Briefings, die immer noch vage sind.

**Danach:** Vollständiges Content-Briefing in 5 Minuten. Redaktionskalender für den Monat in 15 Minuten. Blog-Beitrags-Outline mit Wettbewerbsanalyse in unter 10 Minuten. Social-Media-Repurposing für einen einzelnen Blog-Beitrag in 3 Minuten.

---

## 30-Sekunden-Installation

```bash
# Den vollständigen Content-Marketing- und SEO-Stack installieren
npx claudient add skills marketing

# Oder einzeln auswählen:
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/content-brief
npx claudient add skill marketing/editorial-calendar
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/ai-seo
npx claudient add skill marketing/programmatic-seo
npx claudient add skill marketing/copywriting
npx claudient add skill marketing/social-media-manager
npx claudient add skill marketing/email-sequence
npx claudient add agents advisors/cmo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Dein Claude Code Content-Marketing-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/content-brief` | SEO-optimiertes Content-Briefing: Keyword, Outline, Lücken, interne Links, CTA | Vor jedem Inhaltsstück |
| `/editorial-calendar` | Monatlicher Kalender: Themen-Cluster, Veröffentlichungsplan, Content-Mix, Distribution | Monatliche Planung |
| `/content-strategy` | Vollständige Content-Strategie: Zielgruppe, Ziele, Kanäle, Themen-Cluster, KPIs | Quartalsplanung oder bei Markteinführung |
| `/seo-audit` | Technisches und On-Page-SEO-Audit: Probleme, Chancen, priorisierte Behebungsliste | Monatliches Site-Audit |
| `/ai-seo` | SEO im KI-Zeitalter: Optimierung für ChatGPT, Perplexity, Bing AI, Featured Snippets | Bei der Auffrischung bestehender Inhalte |
| `/programmatic-seo` | Programmatische Seitenvorlagen: Schema, N-von-M-Muster, skalierbare Produktion | Skalierung der Content-Produktion |
| `/copywriting` | Landing Pages, Headlines, CTAs, Anzeigentexte — conversion-fokussiert | Alle conversion-kritischen Texte |
| `/social-media-manager` | Plattform-native Post-Erstellung, Planungsstrategie, Engagement-Playbooks | Social-Content und Kanalmanagement |
| `/email-sequence` | Drip-Sequenzen, Newsletter, automatisierte Flows — vollständiges Copywriting und Logik | E-Mail-Content und Nurture-Flows |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `cmo-advisor` | Opus | Strategiefragen, Kanal-Priorisierung, Content-Positionierung |
| `competitive-analyst` | Sonnet | Wettbewerber-Content-Audits, Lückenanalyse, Positionierungs-Intelligence |

---

## Täglicher Workflow

### Morgen — Analytics-Review (15 Minuten)

**1. Performance-Puls**
```
/seo-audit

Meine wichtigsten Content-Metriken von gestern abrufen:
- Top-5-Seiten nach Sessions
- Neue Seiten in der Google Search Console
- Seiten, die in den letzten 7 Tagen im Ranking gesunken sind
- Newsletter-Öffnungsrate des gestrigen Versands

5-Punkte-Briefing: Was feiern, was untersuchen, was heute beheben.
```

**2. Chancen-Scan**
```
/ai-seo

Welche Keywords rund um [mein Themen-Cluster] haben in den letzten 7 Tagen zugelegt?
Gibt es aktuell trendende Fragen in meiner Nische, die ich heute aufgreifen sollte?
Prüfen: Google Trends, Reddit, LinkedIn Trending Topics.
```

---

### Content-Erstellung (variabel — 1–4 Stunden)

**3. Neues Stück briefen**
```
/content-brief

Ziel-Keyword: [Keyword]
Sekundär-Keywords: [Liste]
Content-Typ: [How-to / Vergleich / Thought Leadership]
Zielgruppe: [konkrete Person mit konkretem Problem]
Konkurrierende URLs: [Top-3-Ranking-Seiten]
Unser CTA: [was wir von Lesern wollen]
Wortanzahl-Ziel: [basierend auf Wettbewerber-Durchschnitt]
```

**4. Content schreiben oder prüfen**
```
/copywriting

Schreibe [Content-Typ] auf Basis dieses Briefings:
[Briefing von oben einfügen]

Ton: [conversational / autoritativ / technisch]
Markenstimme: [kurze Beschreibung — oder Markenrichtlinien einfügen]
Muss enthalten: [spezifische Punkte, Daten oder Beispiele]
```

---

### SEO-Optimierung (20–30 Minuten, mehrmals pro Woche)

**5. On-Page-Optimierung**
```
/seo-audit

Diesen Entwurf vor der Veröffentlichung prüfen:
[Inhalt einfügen]

Ziel-Keyword: [Keyword]
Prüfen: Title-Tag, Meta-Description, H1, H2-Struktur, interne Links,
Featured-Snippet-Möglichkeit, Bild-Alt-Text, Schema-Markup.
Veröffentlichungs-Checkliste ausgeben: was gut ist, was zu korrigieren ist.
```

---

### Social-Scheduling (15–30 Minuten, täglich oder gebündelt wöchentlich)

**6. Veröffentlichte Inhalte weiterverwerten**
```
/social-media-manager

Ich habe gerade veröffentlicht: [URL oder Inhalt einfügen]

Erstelle:
- 3 LinkedIn-Posts (nur Text, Karussell-Konzept und eine Umfrage)
- 5 X/Twitter-Posts (inklusive einem Thread und 4 eigenständigen)
- 1 Instagram-Caption
- 1 Kurzform-Videoskript (60 Sekunden)

Die Kernaussage für das native Format jeder Plattform aufbereiten.
Nicht einfach die Blog-Einleitung kopieren — die einprägsamste Einzelidee aus jedem Abschnitt extrahieren.
```

---

### Performance-Reporting (30–60 Minuten, wöchentlich)

**7. Wöchentlicher Content-Bericht**
```
/content-strategy

Wöchentliche Performance-Review:
- Diese Woche veröffentlicht: [Liste]
- Bester Content (Sessions, Verweildauer, Conversions): [Daten]
- Newsletter-Stats: [Versendungen, Öffnungsrate, CTR]
- Social-Stats: [Impressionen, Engagements, Follower-Änderung]

Zusammenfassen: Was hat funktioniert, was nicht, was sollte ich nächste Woche mehr produzieren.
Einen einseitigen Bericht ausgeben, den ich mit meiner Führungskraft teilen kann.
```

---

## Monatlicher Planungsworkflow

### Monatsende: Nächsten Monatskalender planen (60–90 Minuten)

**Schritt 1 — Letzten Monat rückblicken**
```
/content-strategy

Content-Audit des letzten Monats:
- Welche Stücke haben den meisten organischen Traffic gebracht?
- Welche haben die meisten Leads/Conversions generiert?
- Welche hatten das höchste Engagement in sozialen Medien?
- Inhalte, die trotz hohem Aufwand unterdurchschnittlich abgeschnitten haben?

Ausgeben: Verdoppeln-Liste (mehr davon), Streich-Liste (dieses Format einstellen) und 3 neue Ideen auf Basis des Erfolgreichen.
```

**Schritt 2 — Nächsten Monatskalender erstellen**
```
/editorial-calendar

Redaktionskalender für [nächsten Monat] erstellen.

Marke: [Unternehmensname + einzeilige Beschreibung]
Zielgruppe: [ICP-Beschreibung]
Ziel: [Traffic / Leads / Marke]
Kanäle: [Blog / Newsletter / LinkedIn / X]
Veröffentlichungsrhythmus: [X/Woche Blog, täglich LinkedIn, wöchentlich Newsletter]
Aktuelles Top-Keyword-Cluster: [Hauptthemenbereich]
```

**Schritt 3 — Jedes Stück briefen**
```
/content-brief

[Für jedes geplante Stück im Kalender ausführen]
```

---

## 30-Tage-Einarbeitungsplan (neue Content Marketer)

### Woche 1 — Prüfen und verstehen
- Alle Marketing-Skills installieren: `npx claudient add skills marketing`
- `/seo-audit` für die gesamte Website ausführen — verstehen, was vorhanden ist, bevor mehr veröffentlicht wird
- `/competitive-analyst` für die Top-3-Wettbewerber ausführen — was schreiben sie, das du nicht schreibst?
- E-Mail-Liste prüfen: Öffnungsraten, Klickraten, Abmeldungen — welcher Content performt?
- Themen-Cluster kartieren: `/content-strategy` verwenden, um 3 Säulen zu definieren

### Woche 2 — Systemaufbau
- Ersten Redaktionskalender mit `/editorial-calendar` erstellen
- Briefing-Vorlagen für die 3 häufigsten Content-Typen erstellen
- Content-Distributions-Checkliste einrichten (jeder Post = 5-Kanal-Distribution)
- Interne Verlinkungskarte definieren: welche 10 Stücke sind dein Cornerstone-Content?

### Woche 3 — Produktionsstart
- Erste 4 Stücke mit `/content-brief` + `/copywriting` briefen und produzieren
- `/social-media-manager` verwenden, um jedes Stück kanalübergreifend weiterzuverwerten
- Wöchentlichen E-Mail mit `/email-sequence` einrichten
- Veröffentlichen, distribuieren, Ergebnisse tracken

### Woche 4 — Analysieren und optimieren
- `/seo-audit` ausführen — was hat sich verbessert? Welche neuen Chancen sind aufgetaucht?
- Das beste Stück identifizieren und `/content-brief` verwenden, um 3 ähnliche zu produzieren
- Monatliche Analytics-Reporting-Vorlage einrichten
- Ersten monatlichen Content-Strategiebericht vorstellen

---

## Tool-Integrationen

### Ahrefs / Semrush

```
Keyword-Daten direkt in Claude einfügen:
1. Keyword-Bericht aus Ahrefs exportieren → Top-100-Zeilen kopieren
2. /seo-audit: Daten einfügen und nach priorisierter Chancenliste fragen
3. /content-brief mit den identifizierten Keywords verwenden

Für Wettbewerber-Content-Lücken:
1. "Content Gap"-Bericht in Ahrefs gegen Top-3-Wettbewerber ausführen
2. Lücken-Keywords in /editorial-calendar einfügen
3. Keywords Themen-Clustern zuordnen und Kalender erstellen
```

### Google Search Console

```bash
# GSC-Daten per MCP mit Claude verbinden
# Zu ~/.claude/settings.json hinzufügen:
{
  "mcpServers": {
    "google-search-console": {
      "command": "npx",
      "args": ["-y", "@anthropic/gsc-mcp"],
      "env": {
        "GSC_CREDENTIALS": "path/to/credentials.json",
        "GSC_SITE_URL": "https://yourdomain.com"
      }
    }
  }
}
```

Mit dieser Verbindung kann Claude:
- Deine Top-Suchanfragen und Seiten direkt abrufen
- Keywords mit Ranking 11–20 identifizieren (Quick-Win-Optimierungsziele)
- Impressionen vs. Klicks vergleichen, um CTR-Chancen zu finden
- Ranking-Rückgänge im Content beobachten

### HubSpot / Marketo (Content-Attribution)

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

Mit dieser Verbindung:
- Claude fragen, welche Blog-Beiträge die meisten Kontakt-Conversions generieren
- Identifizieren, welchen Content deine besten Leads vor der Conversion konsumiert haben
- UTM-getrackte Distributionspläne mit Deal-Einfluss verknüpfen

### Notion / Airtable (Redaktionskalender)

```
Content-Kalender aus Notion oder Airtable als CSV oder Markdown exportieren.
In Claude einfügen mit:
"/editorial-calendar — hier ist mein aktueller Kalender. Themenabdeckungs-Lücken identifizieren,
Übergewichtung auf einen Content-Typ erkennen und Stücke, die einen Prioritäts-Refresh benötigen."
```

### n8n / Make (Automatisierung)

```
Den Content-Produktionskreislauf automatisieren:
- Neuer Ahrefs-Keyword-Alert → /content-brief automatisch generiert → Notion-Seite erstellt
- Blog-Beitrag veröffentlicht → /social-media-manager → Posts in Buffer/Hootsuite eingeplant
- E-Mail versendet → Öffnungsrate unter Schwellenwert → /email-sequence → Betreffzeilen-Varianten generiert
- Monatlich: Google-Analytics-Bericht → /content-strategy → monatliches Review-Dokument erstellt
```

---

## Zu verfolgende Benchmarks

Diese Metriken wöchentlich aus Google Analytics, GSC und deiner E-Mail-Plattform abrufen:

| Metrik | Frühphase | Wachstumsphase | Reife |
|---|---|---|---|
| Organische Sessions/Monat | 1.000 | 10.000 | 50.000+ |
| MoM-organisches Wachstum | >10 % | 5–10 % | 2–5 % |
| Veröffentlichte Stücke/Monat | 8 | 16 | 25+ |
| E-Mail-Öffnungsrate | >25 % | >30 % | >35 % |
| E-Mail-CTR | >2 % | >3 % | >4 % |
| Social-Engagement-Rate (LinkedIn) | >2 % | >3 % | >4 % |
| Content-attributierte Leads/Monat | 5 | 25 | 100+ |
| Zeit pro Content-Briefing | <30 Min | <15 Min | <10 Min |

---

## Häufige Fehler (und wie Claude Code hilft, sie zu vermeiden)

**Fehler 1: Schreiben ohne Briefing**
`/content-brief` dauert 5 Minuten. Das Überspringen kostet 3 Stunden Überarbeitungen, wenn das Stück am Ziel vorbeigeht.

**Fehler 2: Content ohne Distributionsplan produzieren**
`/editorial-calendar` baut den Distributionsplan in den Kalender ein. Jedes Stück hat einen 5-Kanal-Plan, bevor es geschrieben wird.

**Fehler 3: Ohne interne Links veröffentlichen**
`/content-brief` kartiert interne Links als Teil des Briefings. Kein Veröffentlichen von Orphan-Content mehr.

**Fehler 4: Content-Verfall ignorieren**
`/seo-audit` zeigt Seiten, die rankten, aber abgerutscht sind. Auffrischen schlägt neuen Content für etablierte Sites.

**Fehler 5: Social-Posts, die nur den Link teilen**
`/social-media-manager` schreibt Content als plattform-native Posts um. LinkedIn-Karussells, Twitter-Threads, Instagram-Captions — alle verschieden vom Blog.

---

## Ressourcen

- [Erste Schritte mit Claude Code](../getting-started.md)
- [Content-Erstellungs-Workflow](../workflows/content-creation.md)
- [SEO-Audit-Skill](../skills/marketing/seo-audit.md)
- [Content-Brief-Skill](../skills/marketing/content-brief.md)
- [Redaktionskalender-Skill](../skills/marketing/editorial-calendar.md)
- [E-Mail-Sequenz-Skill](../skills/marketing/email-sequence.md)

---

> **Arbeite mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
