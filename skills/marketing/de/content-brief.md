---
name: content-brief
description: "SEO-optimiertes Content-Briefing: Keyword-Targeting, Gliederung, Wettbewerber-Lucken, interne Links, CTA"
---

# Content Brief Skill

## Wann aktivieren
- Einen Autor (Mensch oder KI) briefen, bevor ein Blogbeitrag, eine Landing Page oder ein Leitfaden produziert wird
- Sicherstellen, dass SEO-Grundlagen vor dem Schreiben eingebaut werden, nicht danach
- Identifizieren, was Wettbewerber-Content fehlt, bevor der eigene Ansatz gewahlt wird
- Langform-Inhalte strukturieren, damit sie Featured Snippets gewinnen und ranken
- Brief-Qualitat innerhalb eines Content-Teams standardisieren, damit jedes Stuck dieselbe Messlatte erfullt

## Wann NICHT verwenden
- Kurze Social-Media-Posts — zu leichtgewichtig fur diesen Briefing-Ansatz
- Interne Dokumente, SOPs oder Sales-Decks — andere Struktur, kein SEO-Fokus
- Sie schreiben den Inhalt selbst ohne Briefing — fangen Sie einfach an zu schreiben
- News-Jacking / reaktiver Content — Geschwindigkeit ist hier wichtiger als Briefing-Tiefe

## Anweisungen

### Kern-Content-Brief-Prompt

```
Generiere ein vollstandiges SEO-Content-Briefing fur dieses Stuck.

Ziel-Keyword: [primares Keyword]
Sekundare Keywords: [3-5 verwandte Begriffe auflisten]
Zielgruppe: [spezifische Person — Jobtitel, Kontext, Problem, das sie zu losen versuchen]
Content-Typ: [How-to / Listicle / Vergleich / Case Study / Pillar / Meinung]
Ziel-Wortzahl: [basierend auf Wettbewerberanalyse — Claude um Empfehlung bitten, wenn unsicher]
Veroffentlichung: [Unternehmensblog / Gastbeitrag / Landing Page]
Geschafts-CTA: [was der Leser am Ende tun soll]
Ton: [autoritativ / gesprachig / technisch / zugangig]
Konkurrenz-URLs zum Ubertreffen: [Top 3-5 rankende Seiten fur das primzre Keyword]

Erstellen:

## 1. Keyword-Strategie
- Primares Keyword: [exakte Ubereinstimmung, geschatztes Suchvolumen, Schwierigkeit]
- Semantische Keywords zum Einbinden: [LSI-Begriffe, Fragevarianten, Entity-Erwahnung]
- Featured-Snippet-Moglichkeit: [ja/nein, und welches Format angestrebt werden soll]
- Suchintention: [informational / navigational / kommerziell / transaktional]

## 2. Wettbewerber-Luckenanalyse
Fur jede konkurrierende URL:
- Was sie gut abdecken (nicht ignorieren — erreichen oder ubertreffen)
- Was sie verpassen (Ihr Differenzierungsansatz)
- Wortanzahl und Content-Tiefe
- Einzigartige Daten, Beispiele oder Perspektiven, die fehlen

## 3. Empfohlener Ansatz
Ein Satz: warum dieses Stuck gegenuber den Wettbewerbern ranken UND geteilt werden wird.

## 4. Vollstandige Content-Gliederung
Mit H2s und H3s, geschatzter Wortanzahl pro Abschnitt und Hinweisen fur den Autor.

## 5. Interne Links
- 3-5 Seiten auf unserer Website, die auf dieses Stuck verlinken sollten
- 3-5 bestehende Stuck, auf die dieses neue Stuck verlinken sollte

## 6. Meta-Title, Meta-Description und URL-Slug

## 7. On-Page-SEO-Checkliste
```

### Keyword-Strategie-Rahmen

```typescript
interface ContentBrief {
  keyword: {
    primary: string
    volume: string            // monthly searches (approximate)
    difficulty: number        // 0-100 (Ahrefs KD equivalent)
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
    featuredSnippetFormat: 'paragraph' | 'list' | 'table' | 'none'
  }
  semanticKeywords: string[]  // include naturally in the content
  entityKeywords: string[]    // people, tools, brands to mention for topical depth
  questionKeywords: string[]  // "People Also Ask" targets → answer in H2/H3s

  competitors: Array<{
    url: string
    wordCount: number
    strengths: string[]       // what they do well
    gaps: string[]            // what they miss
    differentiator: string    // how to beat this specific URL
  }>

  brief: {
    recommendedWordCount: number
    sections: Array<{
      heading: string         // H2 or H3
      level: 'H2' | 'H3'
      purpose: string         // what this section accomplishes
      wordCount: number       // target for this section
      writerNote: string      // specific guidance (include stat, example, table, etc.)
    }>
  }
}
```

### Wettbewerber-Luckenanalyse-Prompt

```
Fuhre eine Wettbewerber-Content-Luckenanalyse fur: [PRIMARES KEYWORD] durch

Top-rankende URLs:
1. [URL 1]
2. [URL 2]
3. [URL 3]

Fur jede URL identifizieren:
1. Hauptansatz und These
2. Content-Tiefe (welche Themen werden abgedeckt vs. oberflachlich behandelt)
3. Einzigartige Daten, Recherche oder Beispiele, die zitiert werden
4. Format-Entscheidungen (Tabellen, Listen, Screenshots, Video-Einbettungen)
5. Fehlende Themen, die ein Leser nach dem Lesen noch haben wurde
6. Schwachste Abschnitte (dunner Content, veraltete Infos, generischer Rat)

Dann erstellen:
- Unsere Differenzierungsmatrix: 3 Ansatze, die keiner der Top 3 abdeckt
- Das "eine Ding", das wir in diesem Stuck besitzen sollten, das Wettbewerber nicht haben
- Belege-Typen, die wir einbeziehen sollten (Originaldaten, Expertenaussagen, Case Studies)
- Empfohlene Wortanzahl, um den Durchschnitt der Top 3 zu ubertreffen
```

### Content-Gliederungs-Generator

```
Generiere eine detaillierte Content-Gliederung.

Thema: [Titel oder Arbeitstitel]
Primares Keyword: [Keyword]
Zielgruppe: [Leserprofil]
Ziel des Stucks: [was der Leser durch das vollstandige Lesen erreicht]

GLIEDERUNGSFORMAT:
Fur jeden Abschnitt:
H2: [Abschnittsüberschrift — keyword-bewusst, aber nicht uberladen]
  Zweck: [was dieser Abschnitt fur den Leser bewirkt]
  Schlusspunkte: [2-3 Stichpunkte, die der Autor ansprechen muss]
  Format-Empfehlung: [Absatz / Liste / Tabelle / Beispiel / Screenshot]
  Wortanzahl: [Ziel fur diesen Abschnitt]
  Autorenhinweis: [spezifische Anweisung — z.B. "hier ein echtes Kundenbeispiel einschliessen"]

Anforderungen an die Einleitung:
- Hook im ersten Satz (Statistik, Frage oder kuhne Behauptung)
- Das Problem des Lesers in Satz 2-3 aufzeigen
- Das Ergebnis versprechen ("am Ende wissen Sie...")
- KEINE "In diesem Artikel werden wir..."-Eroffner
- Primares Keyword naturlich in den ersten 100 Wortern einschliessen

Anforderungen an den Schluss:
- Die 3 wichtigsten Erkenntnisse zusammenfassen
- CTA: [spezifisch — "Vorlage herunterladen" / "Demo buchen" / "abonnieren"]
- Verwandte Lekture: [2 interne Links]
```

### On-Page-SEO-Checkliste

```
Vor der Veroffentlichung prufen:

TITLE-TAG (Meta-Title):
- [ ] Enthalt primares Keyword
- [ ] Unter 60 Zeichen
- [ ] Uberzeugend — hat ein Power-Wort (Bestes, Vollstandig, Ultimativ, Leitfaden, etc.)
- [ ] Dupliziert keinen anderen Title auf der Website

META-DESCRIPTION:
- [ ] 150-160 Zeichen
- [ ] Enthalt primares Keyword
- [ ] Hat ein klares Wertangebot oder einen Hook
- [ ] Endet mit einem sanften CTA oder offenen Loop

URL-SLUG:
- [ ] Kurz (2-4 Worter)
- [ ] Enthalt primares Keyword
- [ ] Alles Kleinschreibung, mit Bindestrich, keine Fullworter

H1:
- [ ] Enthalt primares Keyword
- [ ] Andere Formulierung als der Title-Tag (Variation ist OK)
- [ ] Nur ein H1

H2s und H3s:
- [ ] 3-8 H2s (Content-Roadmap fur den Leser)
- [ ] Primares Keyword in mindestens einem H2
- [ ] Sekundare Keywords und Fragen in H2/H3s
- [ ] Kein Keyword-Stuffing — Uberschriften sollen beschreibend sein

BODY-CONTENT:
- [ ] Primares Keyword im ersten Absatz
- [ ] Keyword-Dichte 0,5-1,5% (naturlich, nicht erzwungen)
- [ ] Semantische und LSI-Keywords uberall verteilt
- [ ] Mindestens eine Tabelle, Liste oder strukturiertes Element (Snippet-Ziel)
- [ ] Jedes Bild hat Alt-Text (beschreibend, Keyword wenn naturlich)

INTERNE LINKS:
- [ ] 3-5 Links zu bestehendem Content auf der Website
- [ ] Linktext ist beschreibend (nicht "hier klicken")
- [ ] Mindestens ein Link von einer bestehenden, autoritativen Seite zu diesem Stuck

EXTERNE LINKS:
- [ ] Link zu 2-4 autoritativen Quellen (Statistiken, Recherchen, Tools)
- [ ] Externe Links auf rel="noopener" setzen (nicht nofollow, es sei denn bezahlt/UGC)

SCHEMA-MARKUP:
- [ ] Article-Schema (immer)
- [ ] FAQ-Schema, wenn ein Q&A-Abschnitt vorhanden ist
- [ ] HowTo-Schema, wenn es ein Tutorial/Schritt-fur-Schritt ist
```

### Featured-Snippet-Targeting

```
Diesen Content optimieren, um das Featured Snippet fur: [KEYWORD] zu gewinnen

Aktueller Snippet-Inhaber (falls vorhanden): [URL und Snippet-Text]

Featured-Snippet-Formate nach Keyword-Typ:
- "Wie man [Aufgabe]" → Schritt-fur-Schritt-nummerierte Liste mit einem H2, der genau die Frage ist
- "Was ist [Begriff]" → 2-3-Satz-Definitions-Absatz unter einem H2, der die Frage spiegelt
- "Beste [Tools/Optionen]" → Tabelle mit Name/Funktion/Preis-Spalten, oder geordnete Liste
- "[Begriff] vs [Begriff]" → Vergleichstabelle, dann Prosa-Erklarung

Anweisungen fur Snippet-Targeting-Struktur:
1. Die genaue Frage als H2-Uberschrift verwenden
2. Direkt und vollstandig in den ersten 40-60 Wortern darunter antworten
3. Fur Listen-Snippets: <ol> oder <ul> sofort nach der Uberschrift verwenden
4. Fur Tabellen-Snippets: eine richtige HTML-Tabelle mit Kopfzeilen verwenden
5. Dann mit Detail-Absatzen erweitern (Claude liest uber den Snippet hinaus)
6. Die Antwort NICHT vergraben — zuerst antworten, dann erklaren

Den optimierten H2-Titel und den eroffnenden Abschnitt schreiben:
```

### Brief-Vorlage (fur Autoren zum Kopieren)

```markdown
# Content-Briefing: [TITEL]

**Primares Keyword:** [Keyword] | Volumen: [X/Monat] | Schwierigkeit: [X/100]
**Sekundare Keywords:** [Liste]
**Ziel-Wortanzahl:** [X Worter]
**Ziel-Veroffentlichungsdatum:** [Datum]
**Autor:** [Name]
**Redakteurspruifung bis:** [Datum]

## Zielgruppe
[Jobtitel], [Unternehmensgrosse], [spezifisches Problem, das sie mit dieser Suche losen].
Sie befinden sich im [Bewusstseinstadium: problem-bewusst / losung-bewusst / produkt-bewusst].

## Suchintention
[Was mochte der Leser durch die Suche nach diesem Keyword erreichen? Welches Format erwarten sie?]

## Empfohlener Ansatz
[Ein Satz — warum unser Stuck besser sein wird als die aktuellen Top-3-Ergebnisse]

## Gliederung

### Einleitung (~150 Worter)
Hook mit: [Statistik / Frage / kuhne Behauptung]
Problem aufzeigen: [womit der Leser kampft]
Ergebnis versprechen: [was er am Ende wissen wird]

### H2: [Abschnittstitel 1] (~300 Worter)
[Schlusspunkte, die der Autor abdecken muss]
[Format: Absatz/Liste/Tabelle]
[Autorenhinweis: spezifische Anweisung]

### H2: [Abschnittstitel 2] (~400 Worter)
...

### Schluss (~200 Worter)
Zusammenfassung: [3 wesentliche Erkenntnisse]
CTA: [spezifische Aktion]
Verwandte Lekture: [2 interne Links]

## SEO-Anforderungen
- [ ] Primares Keyword in den ersten 100 Wortern
- [ ] H2, das eine "People Also Ask"-Frage ist
- [ ] Eine Tabelle oder nummerierte Liste (Snippet-Ziel)
- [ ] 4+ interne Links
- [ ] Alle Bilder mit beschreibendem Alt-Text

## Meta
**Title-Tag:** [max. 60 Zeichen] [ENTWURF]
**Meta-Description:** [max. 155 Zeichen] [ENTWURF]
**URL-Slug:** /[slug]

## Interne Link-Planung
Von diesem Stuck verlinken auf:
- [URL 1] — Ankertext: [Text]
- [URL 2] — Ankertext: [Text]

Auf dieses Stuck verlinken von:
- [URL 1] — diese Seite aktualisieren, um hier einen Link hinzuzufugen
- [URL 2] — kontextuellen Link hinzufugen
```

## Beispiel

**Benutzer:** Schreibe ein Content-Briefing fur "content marketing strategy", das auf B2B-Marketing-Manager ausgerichtet ist.

**Ausgabe:**
```markdown
# Content-Briefing: The B2B Content Marketing Strategy Guide (2026)

**Primares Keyword:** content marketing strategy | Volumen: ~18.000/Monat | Schwierigkeit: 68/100
**Sekundare Keywords:** b2b content strategy, content marketing framework, content strategy template, how to build a content strategy
**Ziel-Wortanzahl:** 3.800 Worter (Wettbewerber avg 3.100 — bei Rahmen und Vorlagen tiefer gehen)
**Suchintention:** Informational — Leser mochte einen schrittweisen Prozess mit Vorlagen zum Anpassen

## Zielgruppe
B2B-Marketing-Manager bei einem 50-500-Personen-SaaS- oder Dienstleistungsunternehmen. Hat gerade die Verantwortung fur Content ubernommen. Muss innerhalb von 30 Tagen eine Strategie seinem/ihrem VP Marketing prasentieren. Sucht bei der Arbeit, am Desktop, wahrend eines Planungszyklus.

## Empfohlener Ansatz
Die meisten Leitfaden listen Taktiken auf. Dieser Leitfaden baut einen echten Strategie-Rahmen in einer schrittweisen Sequenz mit einer herunterladbaren Vorlage auf — der Leser beendet das Lesen mit einem vollstandigen 90-Tage-Plan, nicht nur mit Inspiration.

## Gliederung

### Einleitung (~200 Worter)
Hook: "Die meisten Content-Strategien scheitern in den ersten 90 Tagen — nicht weil das Schreiben schlecht ist, sondern weil es nie eine echte Strategie gab."
Problem: Teams produzieren Content ohne Zielgruppenforschung, Keyword-Mapping oder Distributionsplane.
Versprechen: "Am Ende dieses Leitfadens haben Sie eine 90-Tage-Content-Strategie, die Sie diese Woche prasentieren konnen."

### H2: What a B2B Content Marketing Strategy Actually Is (~300 Worter)
[Featured-Snippet-Ziel — "Was ist"-Frage in 50 Wortern zuerst beantworten]
Definieren: Strategie vs. Taktiken vs. Kalender
Die 5 Komponenten einer echten Strategie: Zielgruppe, Ziele, Kanal-Mix, Produktionssystem, Messung

### H2: Step 1 — Define Your Content Goals (~400 Worter)
Ubersetzungstabelle Geschaftsziele → Content-Ziele
Traffic, Leads, Pipeline, Marke: welche Metriken welchem Ziel entsprechen
Autorenhinweis: Ein echtes B2B-Beispiel einbeziehen, das zeigt, wie ein SaaS-Unternehmen Content-KPIs gesetzt hat

### H2: Step 2 — Audience and Keyword Research (~500 Worter)
ICP → Keyword-Intention-Mapping
Tools: Ahrefs, Semrush, Answer the Public, interne Sales-Call-Notizen
Autorenhinweis: Den Keyword-Recherche-Prozess als schrittweise Liste zeigen (Snippet-Ziel)

### H2: Step 3 — Build Your Topic Clusters (~400 Worter)
Pillar/Spoke-Modell mit Diagrammbeschreibung
Wie man Pfeiler basierend auf Geschaftszielen wahlt, nicht nur Volumen
Interner Link: [/editorial-calendar blog post]

### H2: Step 4 — Choose Your Content Mix (~400 Worter)
Content-Typ-Mix-Tabelle: [Typ | % | Wann verwenden | Beispiel]
Mix eines fruhen Unternehmens vs. reifes Unternehmen unterscheidet sich — beides zeigen

### H2: Step 5 — Build a Production System (~400 Worter)
Brief → Entwurf → Bearbeitung → Veroffentlichung → Distribution-Workflow
Rollen: Wer macht was (auch wenn es eine Person ist)
Tools: Notion, Airtable oder eine einfache Google-Sheet-Vorlage

### H2: Step 6 — Measure and Iterate (~400 Worter)
Metriken nach Ziel (Traffic / Leads / Marke)
Monatliche Content-Review-Vorlage
Wie "Erfolg" bei 30/60/90 Tagen aussieht

### Schluss (~200 Worter)
Erkenntnisse: 3 Dinge, die diese Woche zu tun sind
CTA: 90-Tage-Content-Strategie-Vorlage herunterladen
Verwandte Lekture: Link zu /seo-audit, /editorial-calendar

## Meta
**Title-Tag:** B2B Content Marketing Strategy: The 2026 Step-by-Step Guide
**Meta-Description:** Build a B2B content strategy that drives real pipeline. 6-step framework, templates, and a 90-day plan you can present this week.
**URL-Slug:** /content-marketing-strategy
```

---

> **Arbeiten Sie mit uns:** Claudient wird unterstuetzt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Losungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
