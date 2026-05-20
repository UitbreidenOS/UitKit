---
name: rag-architect
description: "RAG-Systementwurf: Chunking-Strategien, Embedding-Modellauswahl, Vector-Store-Wahl, Abrufmuster, Reranking, Bewertung — produktionsreife Retrieval-Augmented Generation"
---

> 🇩🇪 Deutsche Version. [Englische Version](../rag-architect.md).

# RAG-Architect-Fähigkeit

## Wann aktivieren
- Entwurf eines Retrieval-Augmented Generation Systems von Grund auf
- Auswahl zwischen Chunking-Strategien für Ihren Dokumenttyp
- Auswahl eines Embedding-Modells und Vector Store
- Verbesserung der RAG-Genauigkeit (Reduzierung von Halluzinationen, Verbesserung der Relevanz)
- Einrichtung von Bewertungsmetriken für Ihre RAG-Pipeline
- Entscheidung zwischen naivem RAG vs. fortgeschrittenen Mustern (HyDE, Multi-Query, etc.)

## Wann NICHT verwenden
- Einfache FAQ-Bots mit < 50 Dokumenten — Prompt Engineering ist ausreichend
- Wenn Ihre Daten in das Kontextfenster passen — geben Sie sie einfach ein
- Echtzeitdaten, die sich jede Minute ändern — RAG auf veralteten Indexen hilft nicht

## Anweisungen

### Entwurf der Architektur

```
Entwerfen Sie eine RAG-Architektur für diesen Use-Case:

Daten: [beschreiben — PDFs / Webseiten / Datenbankdatensätze / Code / E-Mails / etc.]
Volumen: [X Dokumente, insgesamt ~XMB/GB]
Abfragetypen: [faktisches Nachschlagen / Synthese / Vergleich / Analyse]
Latenzanforderung: [< Xs Antwortzeit]
Genauigkeitsanforderung: [was kostet eine falsche Antwort?]
Stack: [Python / Node.js / bevorzugte Cloud]
Budget: [selbstgehostet / verwalteter Service / keine Beschränkung]

Entwurf:
1. Erfassungs-Pipeline (wie Daten hineinkommen)
2. Chunking-Strategie (wie Dokumente aufgeteilt werden)
3. Embedding-Modell (was Text in Vektoren konvertiert)
4. Vector Store (wo Vektoren leben)
5. Abrufstrategie (wie relevante Chunks gefunden werden)
6. Reranking (optional aber mächtig)
7. Generierung (Prompt + Modell + Kontext-Zusammensetzung)
8. Bewertung (wie gemessen wird, ob es funktioniert)
```

### Chunking-Strategien

```
Empfehlen Sie eine Chunking-Strategie für diesen Dokumenttyp.

Dokumenttyp: [PDF-Berichte / Code / Rechtsverträge / Chat-Logs / Nachrichtenartikel / technische Dokumentation]
Durchschnittliche Dokumentlänge: [X Seiten / X Wörter]
Abfragemuster: [einfaktisches / Multi-Schritt / erfordert ganzes Dokument Kontext]

Optionen zum Bewerten:
1. Feste Größe: [X Tokens] mit [Y Token] Überlappung
   - Vorteile: einfach, vorhersehbar
   - Nachteile: teilt Sätze/Konzepte mittendurch auf

2. Satz-Aufteilung: Aufteilung an Satzgrenzen
   - Vorteile: bewahrt semantische Einheiten
   - Nachteile: variable Chunk-Größe, manche Chunks zu klein

3. Rekursiver Zeichen-Aufteilung: versucht Absätze → Sätze → Zeichen
   - Beste für: allgemeine Dokumente

4. Semantisches Chunking: Embedding und Aufteilung, wo Kosinus-Ähnlichkeit fällt
   - Beste für: lange Dokumente mit klaren Themawechseln
   - Erfordert: Embedding-Modell zur Erfassungszeit

5. Dokumentspezifisch: Überschriften-Struktur (für PDFs/Docs mit klaren Abschnitten)
   - Beste für: technische Dokumentation, Rechtsverträge, Handbücher

6. Parent-Child / Hierarchisch: kleine Chunks zum Abrufen, Eltern zum Kontext abrufen
   - Beste für: hohe Präzision mit großen Kontextfenstern

Empfehlung für meinen Fall + Implementierungsbeispiel.
```

### Embedding-Modellauswahl

```
Helfen Sie mir, ein Embedding-Modell auszuwählen.

Anwendungsfall: [beschreiben Sie den Inhalt- und Abfragetyp]
Sprache: [nur Englisch / mehrsprachig]
Latenzanforderung: [Echtzeit / Batch OK]
Budget: [Kosten-pro-Token Empfindlichkeit]
Selbst-Hosting erforderlich: [ja / nein]

Vergleichen:
- OpenAI text-embedding-3-small: starke Qualität, billig ($0.02/1M Tokens), gehostet
- OpenAI text-embedding-3-large: beste OpenAI-Qualität, teurer
- Anthropic (Claude via API): Konsistenz verwenden, wenn Claude auch generiert
- Cohere embed-v3: starke Mehrsprachigkeit, 1.024 Dimension Standard
- Voyage AI voyage-3: ausgezeichnet für Code und technische Dokumentation
- Lokal: nomic-embed-text, all-MiniLM-L6-v2 (schnell, frei, niedrigere Qualität)
- Google text-embedding-004: beste mehrsprachig in Skala

Empfehlung basierend auf meinen Beschränkungen.
```

### Abrufmuster

```
Entwerfen Sie die Abrufstrategie für dieses RAG-System.

Abfragetypen, die wir erhalten: [beschreiben]
Bekannte Fehlermuster bei naivem Abruf: [zu buchstäblich / vermisst Umformulierungen / Multi-Hop-Abfragen]

Grundlegende Muster:
1. Semantische Ähnlichkeit: Abfrage einbetten, Top-k Kosinus-Ähnlichkeit — Baseline
2. MMR (Maximal Marginal Relevance): Diversitäts-aware Abruf, reduziert Redundanz
3. Hybrid (BM25 + semantisch): Schlüsselwort + semantisch, starke Leistung für Benannte Entitäten

Fortgeschrittene Muster:
4. HyDE (Hypothetische Dokument Embeddings): generiert eine "Fake-Antwort" und bettet sie ein
   - Gut für: Abfragen, wo die Frage anders aussieht als die Antwort
5. Multi-Query: generiert 3-5 Umformulierungen, ruft für jede ab, dedupliziert
   - Gut für: mehrdeutige Abfragen, verbessert Recall
6. Kontextuelle Kompression: abrufen → zu relevanten Sätzen komprimieren → generieren
   - Gut für: lange Chunks mit teilweise relevantem Inhalt
7. Schritt-zurück-Prompting: Frage zu höherer Ebene abstrahieren, von dort abrufen
8. FLARE: iterativ generieren, abrufen wenn Konfidenz fällt

Welche Muster gelten für meinen Use-Case? Implementierungsreihenfolge?
```

### Bewertungsrahmen

```
Entwerfen Sie einen RAG-Bewertungsrahmen für dieses System.

Was "gut" für meinen Use-Case bedeutet: [beschreiben — Genauigkeit / Vollständigkeit / Zuverlässigkeit]

Metriken zum Verfolgung:
1. Abruf-Qualität:
   - Precision@k: sind abgerufene Chunks relevant?
   - Recall@k: sind alle relevanten Chunks abgerufen?
   - MRR (Mean Reciprocal Rank): ist der beste Chunk am höchsten rangiert?

2. Generations-Qualität:
   - Zuverlässigkeit: hält sich die Antwort an den abgerufenen Kontext? (keine Halluzination)
   - Antwort-Relevanz: beantwortet die Antwort die Frage?
   - Kontext-Relevanz: werden abgerufene Chunks tatsächlich verwendet?

Bewertungs-Werkzeuge:
- RAGAS: automatisiertes RAG-Bewertungs-Framework (ragas.io)
- LangChain Evaluators: eingebaute Zuverlässigkeits- + Korrektheitsprüfungen
- Manuelle goldene Menge: [X] Frage-Antwort-Paare, Mensch oder Claude als Richter

Erstellen Sie einen Test-Set von [10] Frage-Antwort-Paaren für meine Domäne.
Einrichten: wann scheitert mein RAG und wie erkenne ich das?
```

## Beispiel

**Benutzer:** RAG für eine 5.000-Seite-interne Wissensdatenbank (Notion-Seiten, PDFs, Slack-Threads) aufbauen. Abfragen sind meist "wie mache ich X" und "was ist unsere Richtlinie zu Y."

**Claude's Architektur:**

**Chunking:** Rekursiver Zeichen-Aufteilung mit 512-Token-Chunks und 50-Token-Überlappung. Für Slack-Threads: nach Thread gruppieren (als ein Chunk behandeln), nicht einzelne Nachrichten.

**Embedding:** text-embedding-3-small — ausgewogene Kosten und Qualität, nur Englisch ist hier ok.

**Vector Store:** Qdrant (selbstgehostet) oder Pinecone (verwaltet) — bei 5.000 Seiten (~250K Chunks) handhaben beide das einfach.

**Abruf:** Hybrid BM25 + semantisch. "Richtlinie zu Y" Abfragen profitieren von Schlüsselwort-Übereinstimmung (BM25); "wie mache ich" profitiert von semantisch. Kombinieren mit RRF (Reciprocal Rank Fusion).

**Reranking:** Cohere rerank-v3 — führen Top-20 durch Reranker für Top-5 zur Generierung aus. Größter Qualitätsgewinn für die Anstrengung.

**Bewertung:** Erstellen Sie 50 Gold-Standard Q&A-Paare aus Ihren häufigsten Fragen des Teams. Nutzen Sie RAGAS Zuverlässigkeits-Score — Ziel > 0,85 vor dem Versand.

**Erwartete Genauigkeit:** Hybrid + Reranking erreichen typischerweise 75-85% Antwortgenauigkeit auf internen Wissensdatenbanken. Rein semantisch ohne Reranking: ~55-65%.

---

> **Arbeiten Sie mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
