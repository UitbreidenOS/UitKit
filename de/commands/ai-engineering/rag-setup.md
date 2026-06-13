---
description: Gerüst für eine produktionsreife RAG-Pipeline für eine bestimmte Datenquelle und einen bestimmten Stack
argument-hint: "[Datenquellenbeschreibung und bevorzugter Stack]"
---
Sie entwerfen eine Retrieval-Augmented-Generation-Pipeline basierend auf: $ARGUMENTS

Wenn keine Stack-Präferenz angegeben ist, standard mäßig auf: Python, LangChain, pgvector (PostgreSQL), `claude-sonnet-4-6` für die Generierung, `text-embedding-3-small` über OpenAI für Embeddings (wechseln Sie zu Voyage AI, wenn der Benutzer nur Anthropic angibt).

**Schritt 1 — Verstehen Sie die Daten**

Identifizieren Sie aus $ARGUMENTS:
- Quellentyp: PDFs, Webseiten, Datenbankzeilen, Codedateien, Notion/Confluence, E-Mails oder gemischt
- Aktualisierungshäufigkeit: statisches Corpus, nur zum Hinzufügen oder häufig mutiert
- Größenschätzung: <1 k Dokumente, 1 k–100 k oder 100 k+
- Empfindlichkeit: Sind personenbezogene Daten vorhanden? Luftgapped erforderlich?

Geben Sie Ihre Annahmen explizit an, falls nicht angegeben.

**Schritt 2 — Wählen Sie die Chunking-Strategie**

Wählen und begründen Sie eine:
- Feste Größe mit Überlappung (schnell, Grundlage)
- Semantisch / Sentence-Window (bessere Kohärenz für Prosa)
- Rekursives Zeichenteilen nach Dokumentstruktur (Code, Markdown)
- Parent-Document Retriever (kleine Chunk abrufen, übergeordnete Kontex zurückgeben)

Zeigen Sie die genaue Chunker-Konfiguration: `chunk_size`, `chunk_overlap`, Trennerliste.

**Schritt 3 — Generieren Sie die Ingestion-Pipeline**

Schreiben Sie ein Python-Skript (`ingest.py`), das:
- Dokumente aus dem oben identifizierten Quellentyp lädt
- Text bereinigt und normalisiert (boilerplate entfernen, Leerzeichen normalisieren, Codierung handhaben)
- Dokumente mit der gewählten Strategie chunkt
- Chunks in Batches einbettet (max. 512 pro API-Aufruf)
- In den Vektor-Store mit Metadaten hochfährt: `source`, `chunk_index`, `ingested_at`
- Ist idempotent — das erneute Ausführen auf unveränderten Dokumenten bettes nicht erneut ein

**Schritt 4 — Generieren Sie die Abruf- und Generierungskette**

Schreiben Sie ein Python-Modul (`rag_chain.py`), das:
- Eine Benutzerabfragzeichenkette akzeptiert
- Die Abfrage einbettet und Top-K-Chunks abruft (Standard K=5) mit MMR-Neusortierung
- Ein Systemprompt erstellt, das das Modell anweist, nur aus abgerufenem Kontext zu antworten und Quellen nach `source`-Metadatenfeld zu zitieren
- `claude-sonnet-4-6` mit Prompt-Caching im Kontextblock aufruft (verwenden Sie `cache_control: {"type": "ephemeral"}` in den Kontextmeldungen)
- Gibt zurück: `{"answer": str, "sources": list[str], "tokens_used": int}`

**Schritt 5 — Operationale Checkliste**

Liste als Kontrollkästchen:
- [ ] Indexaktualisierungsstrategie (geplante Neuaufnahme gegenüber Webhook-Auslöser)
- [ ] Versionsfixierung des Embedding-Modells
- [ ] Abrufqualitätsmetriken zum Nachverfolgen (MRR, recall@K)
- [ ] Fallback bei niedriger Abrufzuversicht
- [ ] PII-Scrubbing falls zutreffend

Ausgabe: `ingest.py`, `rag_chain.py`, operationale Checkliste. Keine Stubs.
