---
description: Eine produktionsreife RAG-Pipeline für eine bestimmte Datenquelle und einen Stack aufbauen
argument-hint: "[data source description and preferred stack]"
---
Sie entwerfen eine Retrieval-Augmented-Generation-Pipeline auf Basis von: $ARGUMENTS

Falls keine Stack-Präferenz angegeben wird, verwenden Sie als Standard: Python, LangChain, pgvector (PostgreSQL), `claude-sonnet-4-6` für die Generierung, `text-embedding-3-small` über OpenAI für Embeddings (wechseln Sie zu Voyage AI, falls der Benutzer Anthropic-only anfordert).

**Schritt 1 — Die Daten verstehen**

Identifizieren Sie aus $ARGUMENTS:
- Quellentyp: PDFs, Webseiten, Datenbankzeilen, Code-Dateien, Notion/Confluence, E-Mails oder gemischt
- Update-Häufigkeit: statisches Korpus, nur anhängend, oder häufig mutiert
- Größenschätzung: <1 k Dokumente, 1 k–100 k, oder 100 k+
- Sensibilität: Enthält PII? Luftgap erforderlich?

Legen Sie Ihre Annahmen explizit dar, falls nicht angegeben.

**Schritt 2 — Chunking-Strategie wählen**

Wählen Sie eine aus und begründen Sie:
- Feste Größe mit Überlap (schnell, Baseline)
- Semantisch / Satz-Fenster (bessere Kohärenz für Prosa)
- Rekursives Zeichen-Splitting nach Dokumentstruktur (Code, Markdown)
- Parent-Document Retriever (kleinen Chunk abrufen, übergeordneten Kontext zurückgeben)

Zeigen Sie die genaue Chunker-Konfiguration: `chunk_size`, `chunk_overlap`, Trennzeichenliste.

**Schritt 3 — Die Ingestion-Pipeline generieren**

Schreiben Sie ein Python-Skript (`ingest.py`), das:
- Dokumente aus dem oben identifizierten Quellentyp lädt
- Text bereinigt und normalisiert (Boilerplate entfernt, Whitespace normalisiert, Encoding handhabt)
- Dokumente mit der gewählten Strategie in Chunks aufteilt
- Chunks in Batches einbettet (max. 512 pro API-Aufruf)
- In den Vector Store mit Metadaten upsert: `source`, `chunk_index`, `ingested_at`
- Idempotent ist — das erneute Ausführen auf unveränderten Dokumenten führt zu keinem erneuten Embedding

**Schritt 4 — Die Retrieval- + Generierungskette generieren**

Schreiben Sie ein Python-Modul (`rag_chain.py`), das:
- Eine Benutzer-Query-Zeichenkette akzeptiert
- Die Query einbettet und Top-K-Chunks abruft (Standard K=5) mit MMR-Reranking
- Einen System-Prompt konstruiert, der das Modell anweist, nur aus abgerufenem Kontext zu antworten und Quellen anhand des `source`-Metadatenfelds zu zitieren
- `claude-sonnet-4-6` mit Prompt-Caching im Kontextblock aufruft (verwenden Sie `cache_control: {"type": "ephemeral"}` in den Kontextnachrichten)
- Zurückgibt: `{"answer": str, "sources": list[str], "tokens_used": int}`

**Schritt 5 — Checkliste für den Betrieb**

Listen Sie als Kontrollkästchen auf:
- [ ] Index-Aktualitätsstrategie (geplantes erneutes Ingestion vs. Webhook-Trigger)
- [ ] Pinning der Embedding-Modellversion
- [ ] Retrieval-Qualitätsmetriken zum Verfolgen (MRR, recall@K)
- [ ] Fallback, wenn Abruf-Konfidenz niedrig ist
- [ ] PII-Entfernung, falls zutreffend

Ausgabe: `ingest.py`, `rag_chain.py`, Checkliste für den Betrieb. Keine Stubs.
