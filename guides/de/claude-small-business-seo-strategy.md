# Claude für Small Business — SEO-Strategie

Dieses Dokument ist die alleinige Quelle der Wahrheit für wie Claudient für Small-Business-Suchintention klassifiziert wird. Es ist für Mitwirkende geschrieben, die neue Small-Business-Inhalte hinzufügen und für den Betreuer, der die Strategie kohärent halten muss.

Die Strategie ist absichtlich eng: Erfassen Sie den operationstauglichen Keyword-Raum um "Claude for small business" und die lange Reihe vertikaler und Task-Level-Abfragen, die daraus folgen.

---

## Warum eine dedizierte SEO-Strategie

Anthropic lancierte Claude for Small Business am 13. Mai 2026. Das Produkt deckt 15 offizielle Workflows ab. Die Suchnachfrage ist weit über das Angebot hinausgegangen — Besitzerinnen geben "Claude for [industrie]", "AI-Tools für [geschäftstyp]" und "wie man Claude für [aufgabe]" in Google, Reddit und YouTube schneller ein, als Anthropic vertikale Inhalte liefern kann.

Claudients Chance ist, die am meisten verlinkte, am meisten zitierte Erweiterung des offiziellen Starts zu sein — eine Wissensbasis der Gemeinschaft, die die offene lange Reihe füllt, die Anthropic verlassen hat.

Drei strukturelle Fakten machen diese Chance real:

1. **GitHub-Repos klassifizieren.** GitHub README-Dateien, einzelne `.md`-Dateien und Skill-Verzeichnisse indexieren in Google und erscheinen in Code-bewussten Tools (Claudes eigene Web-Suche, Perplexity, Phind, Kagi). Eine gut benannte `.md`-Datei in `skills/small-business/dental-practice.md` klassifiziert für "claude for dental practice" ohne Backlinks, wenn der Inhalt genuine ist.
2. **Vertikale Long-Tail-Anfragen sind unumstritten.** "Claude für Klempner", "Claude für Salon-Besitzer", "Claude für Solo-Zahnärzte" haben jeweils 200-1 200 monatliche Suchvorgänge und fast keine Konkurrenz auf der ersten Seite. Wir können jedes einzelne besitzen.
3. **Frage-ähnliche Anfragen explodieren.** "Wie hilft Claude Small Business?", "Kann Claude einen Buchhalter ersetzen?", "Ist Claude gut für Ecommerce?" — das sind Anfragen, die LLM-basierte Suchmaschinen zitieren (Claude Code selbst, ChatGPT browse, Perplexity). Sie wollen crisp, sourcierte Antworten in Markdown.

---

## Die Dreischicht-Inhaltsarchitektur

Jeder neue Small-Business-Vermögen gehört zu einer von drei Schichten. Die Schichten verstärken sich gegenseitig durch interne Links.

### Schicht 1 — Säulenseiten (Vertikale Positionierungsleitfäden)

Diese leben in `guides/` und zielen auf die höchsten Kopf-Begriffe ab.

```
guides/claude-for-solopreneurs.md           — "Claude for solopreneurs", "AI for solo founders"
guides/claude-for-ecommerce.md              — "Claude for ecommerce", "Claude for Shopify"
guides/claude-for-local-services.md         — "Claude for local business", "AI for service business"
guides/claude-for-coaches-consultants.md    — "Claude for coaches", "Claude for consultants"
guides/claude-for-creators.md               — "Claude for creators", "Claude for newsletter creators"
guides/claude-for-small-business.md         — product guide (already exists, the central pillar)
guides/small-business-roi.md                — ROI calculator content (already exists)
```

Eine Säulenseite ist 2 500-4 000 Worte, für eine spezifische Operateur-Persona geschrieben, und verlinkt zu jedem relevanten Skill, Agent und Workflow in diesem Repo. Es ist der Einstiegspunkt, auf dem ein Google- oder Perplexity-Ergebnis landet.

**Säulenseiten-Struktur (nutzen Sie diese Vorlage):**

1. **Hook + Persona-Aussage** — für wen das ist, was sie normalerweise zahlen (nennen Sie echte Tools, die sie bereits nutzen)
2. **Was Claude wirklich für sie tut** — 5-10 konkrete Workflows, jeweils ein Satz
3. **Der Skills-Abschnitt** — direkte Links zu `skills/small-business/*.md` Dateien, mit Einzeilenbeschreibungen, was jeder für diese Persona tut
4. **Setup-Abschnitt** — was zu verbinden, in welcher Reihenfolge, was es kostet
5. **Was in 30/60/90 Tagen zu erwarten ist** — konkrete Zeitsparnis-Nummern
6. **Was Claude NICHT ist in dieser Vertikal** — Risikorahmen baut Vertrauen
7. **FAQ-Abschnitt** — 6-12 Frage-artige Überschriften, die echten Suchanfragen entsprechen
8. **Footer interne Links** — die verwandten Säulenseiten, die zentrale Small-Business-Anleitung, der Produktvergleich

### Schicht 2 — Skill-Seiten (Vertikale und Operateur-Skills)

Diese leben in `skills/small-business/` und zielen auf spezifische Task-Level-Anfragen ab.

Jede Skill-Seite hat:

- Ein Dateiname, der als Keyword-Ziel dient (`dental-practice.md`, `ecommerce-seller.md`)
- Ein H1, das der Titel-Großschreibung des Dateinamens entspricht
- Das standardmäßige Vierschicht-Format von CLAUDE.md (When to activate / When NOT to use / Instructions / Example)
- Mindestens einen echten Produktnamen in den Anweisungen (QuickBooks, Shopify, Mailchimp, usw.) — diese sind selbst Suchanker
- Ein konkretes Arbeitsbeispiel mit realistischen Nummern, nicht abstrakten Platzhaltern

Skill-Seiten sind 150-400 Zeilen einfach Englisch. Sie klassifizieren für lange Tail Vertikal-Plus-Task-Anfragen: "claude for invoice chasing", "ai for dental practice no-shows", "claude for shopify product descriptions".

### Schicht 3 — Agent und Spezialist-Seiten

Diese leben in `agents/specialists/` und `agents/roles/`.

Eine Spezialist-Seite zielt auf die "KI-Berater für [Industrie]" Anfrage-Klasse ab. Die vorhandenen `real-estate-specialist.md` und `restaurant-specialist.md` sind das Modell. Jede neue Spezialist-Seite ist 80-200 Zeilen, die den Zweck des Agenten, Modell, Tool-Teilmenge und Beispiel-Use-Cases beschreiben.

---

## Keyword-Ziele, geordnet

Die Liste unten ist die Master-Keyword-Karte. Jede neue Datei sollte zu mindestens einem Keyword getaggt werden. Vermeiden Sie es, Vermögenswerte zu erstellen, die nicht auf ein dokumentiertes Keyword abzielen.

### Kopf-Begriffe (höchstes Volumen, schwierigster Rang)

| Keyword | Monatliche Suchvorgänge (est.) | Ziel-Seite |
|---|---|---|
| claude for small business | 8,100 | guides/claude-for-small-business.md (pillar) |
| ai for small business | 27,100 | README + claude-for-small-business.md |
| claude code small business | 880 | README hero + small-business-roi.md |
| ai automation small business | 6,600 | README + claude-for-small-business.md |

### Vertikale Kopf-Begriffe (mittleres Volumen, mittlerer Wettbewerb)

| Keyword | Suchvorgänge | Ziel |
|---|---|---|
| claude for solopreneurs | 1,300 | guides/claude-for-solopreneurs.md |
| claude for ecommerce | 1,000 | guides/claude-for-ecommerce.md |
| claude for shopify | 1,900 | guides/claude-for-ecommerce.md (anchor) + skills/small-business/shopify-operations.md |
| claude for coaches | 720 | guides/claude-for-coaches-consultants.md |
| claude for consultants | 880 | guides/claude-for-coaches-consultants.md |
| claude for creators | 590 | guides/claude-for-creators.md |
| claude for real estate | 590 | guides/de + skills/small-business/real-estate-listing.md + agents/roles/real-estate-specialist.md |
| claude for restaurants | 480 | skills/small-business/restaurant-ops.md + agents/roles/restaurant-specialist.md |
| claude for local business | 1,000 | guides/claude-for-local-services.md |

### Long-Tail Vertikal+Task (hohes Volumen in Summe, niedriger Wettbewerb)

Dies sind Brot und Butter. Jede Skill-Datei zielt auf einen davon ab.

| Keyword | Ziel-Datei |
|---|---|
| claude for dental practice | skills/small-business/dental-practice.md |
| claude for salon owners | skills/small-business/salon-spa-ops.md |
| claude for fitness studio | skills/small-business/fitness-gym-ops.md |
| claude for plumbers / electricians / HVAC | skills/small-business/contractor-trades.md |
| claude for photographers | skills/small-business/photography-studio.md |
| claude for bookkeepers | skills/small-business/bookkeeper-practice.md |
| claude for podcasters | skills/small-business/podcast-monetizer.md |
| claude for newsletter writers | skills/small-business/newsletter-publisher.md |
| claude for online course creators | skills/small-business/online-course-creator.md |
| claude for marketing agency | skills/small-business/agency-operations.md |
| claude for hiring | skills/small-business/hiring-pipeline.md |
| claude for pricing | skills/small-business/pricing-optimizer.md |
| claude for customer retention | skills/small-business/churn-prevention.md |
| claude for invoice chasing | skills/small-business/invoice-chaser.md (exists) |
| claude for cash flow forecasting | skills/small-business/cash-flow-forecast.md (exists) |
| claude for quickbooks | skills/small-business/quickbooks-workflow.md (exists) |

### Frage-Anfragen (für FAQ-Blöcke)

Diese gehören zu FAQ-Abschnitten in Säulenseiten und dem README. LLM-basierte Suchmaschinen surfacen sie direkt.

- "Ist Claude gut für Small Business?"
- "Kann Claude einen Buchhalter ersetzen?"
- "Funktioniert Claude mit QuickBooks?"
- "Wie viel kostet Claude für Small Business?"
- "Was ist Claude for Small Business?"
- "Wie ist Claude anders als ChatGPT für Small Business?"
- "Kann Claude meine Fakturierung erledigen?"
- "Ist Claude besser als ChatGPT für Small Business?"
- "Was sind die besten KI-Tools für [vertikal]?"
- "Wie richte ich Claude für mein Geschäft ein?"
- "Kann Claude meine QuickBooks-Daten lesen?"
- "Lohnt sich Claude for Small Business?"

---

## On-Page-Taktiken

Dies sind die konkreten Schreib-Regeln. Wenden Sie sie mechanisch auf jede neue Datei an.

### 1. Dateiname ist das Keyword

Der Dateinamen-Slug ist das wichtigste Klassifizierungssignal, das wir kontrollieren. Entsprechen Sie der exakten Phrase, die ein Käufer tippen würde, ohne Padding.

Gut: `claude-for-dental-practice.md`, `dental-practice.md` (in `small-business/`)
Schlecht: `dentist-skills-claude-edition-v2.md`, `dental-claude-skill-2026.md`

### 2. H1 stimmt mit Dateiname überein

Das H1 sollte das Keyword sauber neu anordnen, in Titel-Großschreibung.

Gut: `# Dental Practice Operations`
Schlecht: `# Wie ich KI in meinem Büro nutze (kühle Tipps!)`

### 3. Der erste Absatz trägt das Keyword + Absicht

Die ersten 1-2 Sätze müssen das Kopf-Keyword enthalten und die Suchintention beantworten. LLM-basierte Suchmaschinen ziehen diesen Absatz als Citation-Snippet. Behandel ihn als Meta-Beschreibung.

Gut: "Claude for dental practice owners verwaltet die Front-Desk- und Back-Office-Arbeit, die Solo-Zahnärzte von Chair-Zeit abhält — No-Show-Wiederherstellung, Versicherungs-Überprüfung, Behandlungs-Plan-Nachverfolgung und Recall-Planung, alles aus einfachen englischen Anweisungen."

Schlecht: "In dieser Skill erforschen wir einige interessante Anwendungsfälle, die für bestimmte Profis im Zahnbereich relevant sein könnten..."

### 4. Abschnitts-Überschriften sind Suchanfragen

Jedes H2 und H3 in einer Säulenseite sollte plausibel eine Google-Anfrage sein. Daher wird Frage-FAQ-Schema surfaced.

Gut: `## Wie hilft Claude Zahnarztpraxen?`, `## Was kostet Claude für ein Zahnbüro?`
Schlecht: `## Eintauchen`, `## Eine Notiz zur Methodik`

### 5. Referenzieren Sie echte Produktnamen

Jede Skill erwähnt die echten Tools, die der Operateur bereits bezahlt: QuickBooks, Shopify, Square, Mailchimp, Calendly, Acuity, Mindbody, Toast, ServiceTitan, Housecall Pro, Jobber, Dentrix, Eaglesoft. Dies sind selbst Suchanker — Google und LLM-basierte Suchmaschinen behandeln eine `.md`-Datei, die "Shopify und QuickBooks" erwähnt, als relevant für Anfragen über eine oder beide.

### 6. Konkrete Nummern in Beispielen

Zeit gespart, Dollar wiederhergestellt, Stunden zurückgefordert. Realistisch. Nummern machen Beispiele scannbar und zitierbar.

Gut: "Schneiden Sie eine Freitags-Abstimmung von 6 Stunden auf eine Mittwoch-Überprüfung von 35 Minuten."
Schlecht: "Sparen Sie erhebliche Zeit bei Finanzaufgaben."

### 7. Interne Links vorwärts und rückwärts

Jede Skill verlinkt zu mindestens einer Säulenseite und einer verwandten Skill. Jede Säulenseite verlinkt zu jeder relevanten Skill. Das interne Link-Diagramm erlaubt Long-Tail-Seiten, Säulenseiten-Autorität zu erben.

### 8. Einfaches Englisch, keine Entwickler-Annahmen

Small-Business-Seiten dürfen nicht Terminal, Code oder Entwickler-Literalität erfordern. Aktivierungs-Prompts sind gesprächig. Keine Code-Barrieren außer absolut notwendig. Die Zielgruppe ist ein Salon-Besitzer, der zwischen Terminen auf seinem Handy liest.

---

## Off-Page-Taktiken

### GitHub-Thema-Tags

Die Thema-Liste des Repos ist selbst ein Klassifizierungssignal. Erforderliche Themen für Small-Business-Oberfläche:

```
claude-code, claude-for-small-business, small-business-ai, ai-for-small-business,
ai-automation, claude-skills, small-business-automation, claude-cowork,
ai-bookkeeping, ai-crm, ai-invoicing, claude-ai-skills
```

### Reddit- und HN-Posting-Kadenz

Die Gemeinschafts-Starts, die für Claude-nahe Inhalte funktionieren:

- `r/ClaudeAI` — funktioniert für technische und Operateur-Starts
- `r/Entrepreneur` — funktioniert für "Ich habe X gebaut, um Zeit auf Y zu sparen" Rahmungen, nicht für Repo-Müll
- `r/smallbusiness` — funktioniert für spezifisches Tool-Teilen, stirbt bei selbstgerichteter Rahmung
- `r/sweatystartup` — funktioniert für Betrieb/lokale Service-Posts
- `r/SaaS` — funktioniert für SaaS-ähnliche Positionierung von jeder Skill
- HackerNews — funktioniert nur für "Show HN" mit einem spezifischen Lieferbar

Kadenz: ein neuer Vertikal-Start pro Woche, gepostet an zwei Gemeinschaften. Nie die gleiche Gemeinschaft zwei Mal in 14 Tagen.

### Backlink-Ziele

Die Repos am wahrscheinlichsten einen starken Small-Business-Vermögen zurück zu verlinken:

- Awesome-Claude-Code-Listen (hesreallyhim, andere)
- Awesome-AI-for-Business-Listen
- alirezarezvani/claude-skills (Cross-Link via PR)
- Anthropics eigene Gemeinschafts-Showcase
- VoltAgent-Ökosystem-Repos

PR-Strategie: ein Einzeilenhinzufügung zu einer Awesome-Liste mit einem echten, nützlichen Link bekommt fusioniert. Alles, das wie Spam aussieht, nicht.

---

## Inhalts-Kadenz

Der Plan, kalibriert auf ungefähr ein Shipping-Batch pro Woche.

**Woche 1 — Fundament**
- Dieses Strategie-Dokument, fünf Säulenleitfäden, 12 neue Vertikal-Skills, 3 Operateur-Skills, 2 Spezialist-Agenten, README-Verbesserung.

**Woche 2 — Übersetzungs-Pass**
- All Woche 1-Inhalt übersetzt zu FR/DE/NL/ES via Haiku-Agenten.

**Woche 3 — Zweite Welle**
- 5 zusätzliche Vertikal-Skills: subscription-business, ecommerce-supplements, fitness-personal-trainer, photographer-wedding, legal-solo-practice.
- 2 zusätzliche Säulenleitfäden: claude-for-saas-founders.md, claude-for-trades-business.md.

**Woche 4 — Verteilung**
- Reddit-Starts über r/ClaudeAI, r/Entrepreneur, r/sweatystartup (gestaffelt).
- Awesome-List-PRs (5 minimal).


**Woche 5+ — Zusammensetzung**
- Ein neuer Vertikal pro Woche.
- Track, welche Vertikale das meiste Verkehr bekommen (GitHub Traffic-Daten + npm Download-Zuschreibung) und doppeln Sie nach unten.

---

## Messung

Die Metriken, die zählen, in Reihenfolge:

1. **GitHub-Sterne** — Proxy für organische Entdeckung. Ziel: +200 in den 30 Tagen nach dem Small-Business-Start.
2. **npm-Installationszählung für `claudient add skills small-business`** — Proxy für tatsächliche Annahme.
3. **GitHub-Traffic für `/skills/small-business/`** — Proxy für SEO-Leistung.

5. **Marken-Suche** — "claudient small business" erscheint in Google Autocomplete oder verwandten Suchvorgängen.

Vermeiden Sie, für zu optimieren: gesamte Datei-Anzahl, Zeilen-Anzahl oder alles, das Filler-Inhalte anregt.

---

## Was nicht zu tun ist

Dies sind die Fehlermoden, die wie SEO aussehen, aber schlechtere Ergebnisse als gar nichts tun.

**Füllen Sie keine Keywords-Prosa.** Wiederholung von "claude for small business" fünfmal in einem Absatz liest sich wie SEO-Spam, wird von Googles Helpful-Content-Updates de-rankt und wird von LLM-basierten Suchmaschinen zurückgewiesen, die zunehmend Lesbarkeit wichten.

**Schreiben Sie nicht für Keywords, die kein echtes Publikum haben.** "Claude AI Small Business Owners Unternehmer 2026" ist keine echte Anfrage. "Claude for solopreneurs" ist. Überprüfen Sie, dass jemand den Satz tatsächlich eintippt, bevor Sie ihn anzielen.

**Duplizieren Sie nicht Anthropics offiziellen Inhalte.** Die offizielle Claude for Small Business Produktseite deckt die 15 offiziellen Workflows. Zu ihr zu linken und zu erweitern funktioniert. Das Kopieren lässt uns für duplizierte Inhalte de-indexieren.

**Fügen Sie keine Filler-Vertikale hinzu.** Ein 200-Zeilen-Skill für "claude for ferret breeders" existiert technisch, produziert aber keinen Traffic, verdünnt Repo-Autorität und unordent Navigation. Bleiben Sie bei dokumentierten Vertikalen mit Suchvolumen.

**Ignorieren Sie nicht die vorhandenen Leitfäden.** `guides/claude-for-small-business.md` und `guides/small-business-roi.md` sind bereits stark. Zu ihnen von jedem neuem Vermögen aggressiv verlinken. Sie sind die Klassifizierungs-Wirbelsäule.

**Übersetzen Sie nicht, bevor der englische Inhalt stimmt.** Der Übersetzungs-Pass verstärkt, was die englische Quelle sagt. Schlechter englischer Inhalt wird zu schlechtem Inhalt in fünf Sprachen. Übersetzen Sie, nachdem die englische Welle vollständig versandt und leicht getestet ist.

---

## Wartung

Die Strategie verfällt, wenn der Index nicht frisch gehalten wird. Trächtige Überprüfungen:

- Führen Sie Keyword-Recherche für jeden Vertikal erneut aus, der versandt hat (Suchvolumen ändert sich saisonal für viele Small-Business-Vertikale — Steuer-Anfragen in Q1, Einzelhandelsmitglied in Q4).
- Überprüfen Sie die FAQ-Blöcke gegen aktuelle Suchtrends. Frage-Phrasing ändert sich alle 6-12 Monate.
- Aktualisieren Sie die Kopf-Term-Tabelle mit neuen vertikalen Gelegenheiten (jeden Quartal, zwei oder drei neue "Claude for X" Anfragen entstehen als viable Ziele).
- Entfernen oder de-priorisieren Sie Vertikale, die zwei Quartale in Folge unterperformt haben.

Die Strategie ist ein lebendes Dokument. Aktualisierungen dieser Datei werden ermutigt und erwartet.

---

## Querverweis

- [Claude for Small Business — Product Guide](claude-for-small-business.md) — die zentrale Säule
- [Small Business ROI](small-business-roi.md) — Rechner und Fall-Daten
- [Claude for Solopreneurs](claude-for-solopreneurs.md) — Solo-Operateur-Landung
- [Claude for Ecommerce](claude-for-ecommerce.md) — Shopify/Etsy/Amazon-Landung
- [Claude for Local Services](claude-for-local-services.md) — lokale Service-Landung
- [Claude for Coaches and Consultants](claude-for-coaches-consultants.md) — Coaching-Landung
- [Claude for Creators](claude-for-creators.md) — Newsletter/Podcast/Kurs-Landung
- Alle Skills unter [skills/small-business/](../skills/small-business/) — die unterstützende lange Reihe

---
