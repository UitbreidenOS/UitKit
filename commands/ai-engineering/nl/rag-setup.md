---
description: Stel een production-ready RAG-pijplijn in voor een gegeven gegevensbron en stack
argument-hint: "[data source description and preferred stack]"
---
U ontwerpt een retrieval-augmented generation-pijplijn op basis van: $ARGUMENTS

Indien geen stack-voorkeur is gegeven, gebruik de standaard: Python, LangChain, pgvector (PostgreSQL), `claude-sonnet-4-6` voor generatie, `text-embedding-3-small` via OpenAI voor embeddings (vervang door Voyage AI als gebruiker Anthropic-only aangeeft).

**Stap 1 — Begrijp de gegevens**

Identificeer uit $ARGUMENTS:
- Brontype: PDF's, webpagina's, databaserijen, codebestanden, Notion/Confluence, e-mails of gemengd
- Updatefrequentie: statische corpus, alleen toevoegen of regelmatig gewijzigd
- Grootteschatting: <1 k documenten, 1 k–100 k of 100 k+
- Gevoeligheid: PII aanwezig? Air-gapped vereist?

Vermeld je aannames expliciet indien niet gegeven.

**Stap 2 — Kies chunking-strategie**

Selecteer en rechtvaardigen één van:
- Vaste grootte met overlap (snel, basisversion)
- Semantisch / sentence-window (betere samenhang voor proza)
- Recursieve karaktersplitsing op documentstructuur (code, markdown)
- Parent-document retriever (kleine chunk ophalen, parentcontext retourneren)

Toon de exacte chunker-configuratie: `chunk_size`, `chunk_overlap`, scheidingstekens.

**Stap 3 — Genereer de ingestie-pijplijn**

Schrijf een Python-script (`ingest.py`) dat:
- Documenten van het hierboven geïdentificeerde brontype laadt
- Tekst reinigt en normaliseert (verwijder boilerplate, normaliseer witruimte, verwerk codering)
- Documenten chunked met de gekozen strategie
- Chunks in batches insluit (max 512 per API-aanroep)
- Upserts in de vectorstore met metadata: `source`, `chunk_index`, `ingested_at`
- Is idempotent — herrun op ongewijzigde docs embeddt niet opnieuw in

**Stap 4 — Genereer de retrieval + generatie-keten**

Schrijf een Python-module (`rag_chain.py`) dat:
- Een query-tekenreeks van gebruikers accepteert
- De query insluit en top-K chunks (standaard K=5) ophaalt met MMR-herschikking
- Een systeemaanwijzing samenstelt die het model instrueert alleen uit opgehaalde context te antwoorden en bronnen op te geven via `source` metagegevensveld
- Aanroepen `claude-sonnet-4-6` met prompt caching op het contextblok (gebruik `cache_control: {"type": "ephemeral"}` op de contextberichten)
- Retourneert: `{"answer": str, "sources": list[str], "tokens_used": int}`

**Stap 5 — Operationele checklist**

Lijst als selectievakjes:
- [ ] Indexversheid-strategie (geplande herbewerkingsingestie vs. webhook-trigger)
- [ ] Versie-vastlegging van insluitingsmodel
- [ ] Metrische gegevens voor ophaaldetectiekwaliteit (MRR, recall@K)
- [ ] Terugval wanneer ophaalbewegingsvertrouwen laag is
- [ ] PII-scrubbing indien van toepassing

Uitvoer: `ingest.py`, `rag_chain.py`, operationele checklist. Geen stubs.
