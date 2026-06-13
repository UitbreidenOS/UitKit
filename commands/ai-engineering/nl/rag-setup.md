---
description: Bouw een RAG-pipeline klaar voor productie op basis van een gegeven gegevensbron en stack
argument-hint: "[beschrijving van de gegevensbron en voorkeur voor stack]"
---
U ontwerpt een retrieval-augmented generation pipeline op basis van: $ARGUMENTS

Als geen stack-voorkeur wordt gegeven, gebruik dan standaard: Python, LangChain, pgvector (PostgreSQL), `claude-sonnet-4-6` voor generatie, `text-embedding-3-small` via OpenAI voor embeddings (wissel naar Voyage AI als gebruiker alleen Anthropic aangeeft).

**Stap 1 — Begrijp de gegevens**

Identificeer uit $ARGUMENTS:
- Brontype: PDF's, webpagina's, databaserijen, codebestanden, Notion/Confluence, e-mails, of gemengd
- Updatefrequentie: statische corpus, alleen toevoegingen, of regelmatig veranderd
- Grootte-schatting: <1 k documenten, 1 k–100 k, of 100 k+
- Gevoeligheid: PII aanwezig? Air-gapped vereist?

Vermeld uw aannames expliciet indien niet gegeven.

**Stap 2 — Kies een chunking-strategie**

Selecteer en rechtvaardig één van de volgende:
- Vaste grootte met overlap (snel, standaard)
- Semantisch / sentence-window (betere coherentie voor proza)
- Recursief splitsen op tekst op basis van docstructuur (code, markdown)
- Parent-document retriever (klein chunk ophalen, context van parent retourneren)

Toon de exacte chunker-configuratie: `chunk_size`, `chunk_overlap`, scheidingstekenlijst.

**Stap 3 — Genereer de opnamepipeline**

Schrijf een Python-script (`ingest.py`) dat:
- Documenten uit het hierboven geïdentificeerde brontype laadt
- Tekst schoonmaakt en normaliseert (verwijder sjablooncode, normaliseer witruimte, verwerk codering)
- Documenten met de gekozen strategie in chunks splitst
- Chunks in batches insluit (max 512 per API-aanroep)
- In de vectorstore insluit met metadata: `source`, `chunk_index`, `ingested_at`
- Idempotent is — opnieuw uitvoeren op ongewijzigde documenten leidt niet tot opnieuw insluiten

**Stap 4 — Genereer de retrieval + generatie-chain**

Schrijf een Python-module (`rag_chain.py`) die:
- Een querystring van de gebruiker accepteert
- De query insluit en top-K chunks ophaalt (standaard K=5) met MMR-herrangschikking
- Een systeemprompt construeert die het model instructie geeft om alleen uit opgehaalde context te antwoorden en bronnen te citeren met het metadata-veld `source`
- `claude-sonnet-4-6` aanroept met prompt caching op het contextblok (gebruik `cache_control: {"type": "ephemeral"}` op de contextberichten)
- Retourneert: `{"answer": str, "sources": list[str], "tokens_used": int}`

**Stap 5 — Operationele checklist**

Lijst als selectievakjes:
- [ ] Strategie voor indexverversing (geplande opnieuw insluiten vs. webhook-trigger)
- [ ] Versieafzetting van insluitingsmodel
- [ ] Metrische gegevens voor ophaalkwaliteit om bij te houden (MRR, recall@K)
- [ ] Fallback wanneer ophaalprecisie laag is
- [ ] PII-reiniging indien van toepassing

Output: `ingest.py`, `rag_chain.py`, operationele checklist. Geen stubs.
