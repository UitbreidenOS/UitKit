---
name: rag-architect
description: "RAG-systeemontwerp: chunking-strategieën, embedding-modelselectie, vector store-keuze, retrieval-patronen, reranking, evaluatie — productieklaar retrieval-augmented generation"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../rag-architect.md).

# RAG-Architect-vaardigheid

## Wanneer activeren
- Ontwerp van een Retrieval-Augmented Generation systeem van nul af aan
- Keuze tussen chunking-strategieën voor uw documenttype
- Selectie van een embedding-model en vector store
- Verbetering van RAG-nauwkeurigheid (vermindering van hallucinaties, verbetering van relevantie)
- Instellingen van evaluatiegegevens voor uw RAG-pipeline
- Besluit tussen naïef RAG vs. geavanceerde patronen (HyDE, multi-query, enz.)

## Wanneer NIET gebruiken
- Eenvoudige FAQ-bots met < 50 documenten — prompt engineering is voldoende
- Wanneer uw gegevens in het contextvenster passen — geef ze gewoon in
- Real-time gegevens die elke minuut veranderen — RAG op verouderde indexen helpt niet

## Instructies

### Ontwerp de architectuur

```
Ontwerp een RAG-architectuur voor dit use case:

Gegevens: [beschrijf — PDF's / webpagina's / databaserecords / code / e-mails / enz.]
Volume: [X documenten, totaal ~XMB/GB]
Querytypes: [feitecopzoek / synthese / vergelijking / analyse]
Latentievereiste: [< Xs reactietijd]
Nauwkeurigheidsvereiste: [wat is de kosten van een onjuist antwoord?]
Stack: [Python / Node.js / voorkeur cloud]
Budget: [zelfgehost / beheerde service / geen beperking]

Ontwerp:
1. Opname-pipeline (hoe gegevens erin komen)
2. Chunking-strategie (hoe documenten worden opgesplitst)
3. Embedding-model (wat tekst naar vectoren converteert)
4. Vector store (waar vectoren wonen)
5. Ophaalstrategie (hoe relevante chunks worden gevonden)
6. Reranking (optioneel maar krachtig)
7. Generatie (prompt + model + contextsamenstelling)
8. Evaluatie (hoe wordt gemeten of het werkt)
```

### Chunking-strategieën

```
Beveel een chunking-strategie aan voor dit documenttype.

Documenttype: [PDF-rapporten / code / juridische contracten / chatloggen / nieuwsartikelen / technische documentatie]
Gemiddelde documentlengte: [X pagina's / X woorden]
Querypatronen: [eenfactor / multi-stap / vereist hele documentcontext]

Opties om te evalueren:
1. Vaste grootte: [X tokens] met [Y token] overlap
   - Voordelen: eenvoudig, voorspelbaar
   - Nadelen: splitst zinnen/concepten midden-door

2. Zinsplitsing: split op slingrenzen
   - Voordelen: bewaart semantische eenheden
   - Nadelen: variabele chunkgrootte, sommige chunks te klein

3. Recursieve karaktersplitsing: probeert alinea's → zinnen → karakters
   - Beste voor: algemene documenten

4. Semantisch chunking: embed en split waar cosinus-gelijkenis daalt
   - Beste voor: lange documenten met duidelijke onderwerpschuifingen
   - Vereist: embedding-model bij innamestijd

5. Documentspecifiek: koppen-structuur (voor PDF's/docs met duidelijke secties)
   - Beste voor: technische documentatie, juridische contracten, handleidingen

6. Parent-kind / Hiërarchisch: kleine chunks voor ophalen, parent voor context
   - Beste voor: hoge precisie met grote contextvensters

Aanbeveling voor mijn geval + implementatievoorbeeld.
```

### Embedding-modelselectie

```
Help mij een embedding-model te kiezen.

Usecase: [beschrijf het content- en querytype]
Taal: [alleen Engels / meertalig]
Latentievereiste: [real-time / batch OK]
Budget: [per-token kostgevoeligheid]
Zelfhost vereist: [ja / nee]

Vergelijken:
- OpenAI text-embedding-3-small: sterke kwaliteit, goedkoop ($0.02/1M tokens), gehost
- OpenAI text-embedding-3-large: beste OpenAI-kwaliteit, duurder
- Anthropic (Claude via API): gebruik voor consistentie als Claude ook genereert
- Cohere embed-v3: sterke meertaligheid, 1.024 dimensie standaard
- Voyage AI voyage-3: uitstekend voor code en technische documentatie
- Lokaal: nomic-embed-text, all-MiniLM-L6-v2 (snel, gratis, lagere kwaliteit)
- Google text-embedding-004: beste meertalig op schaal

Aanbeveling op basis van mijn beperkingen.
```

### Ophaalpatronen

```
Ontwerp de ophaalstrategie voor dit RAG-systeem.

Querytypes die we ontvangen: [beschrijf]
Bekende foutpatronen in naïef opzoeken: [te letterlijk / mist herformuleringen / multi-hop queries]

Basispatronen:
1. Semantische gelijkenis: queryinbedding, top-k cosinusgelijkenis — baseline
2. MMR (Maximal Marginal Relevance): diversiteitsbewuste ophaling, vermindert redundantie
3. Hybride (BM25 + semantisch): sleutelwoord + semantisch, sterke prestatie voor benoemde entiteiten

Geavanceerde patronen:
4. HyDE (Hypothetische Document Embeddings): genereert een "nep-antwoord" en bettedt het in
   - Goed voor: queries waar de vraag anders uitziet dan het antwoord
5. Multi-query: genereert 3-5 herformuleringen, haalt op voor elk, dedupliceer
   - Goed voor: ambigue queries, verbetert recall
6. Contextuele compressie: haal op → comprimeer naar relevante zinnen → genereer
   - Goed voor: lange chunks met gedeeltelijk relevante inhoud
7. Stap-achteruit-prompting: vraag naar hoger niveau abstraheren, haalt daarvan op
8. FLARE: iteratief genereren, ophalen wanneer vertrouwen daalt

Welke patronen gelden voor mijn usecase? Implementatievolgorde?
```

### Evaluatiekader

```
Ontwerp een RAG-evaluatiekader voor dit systeem.

Wat "goed" betekent voor mijn usecase: [beschrijf — nauwkeurigheid / volledigheid / trouwheid]

Metriek om bij te houden:
1. Ophaalkwaliteit:
   - Precisie@k: zijn opgehaalde chunks relevant?
   - Recall@k: zijn alle relevante chunks opgehaald?
   - MRR (Mean Reciprocal Rank): is de beste chunk het hoogst gerangschikt?

2. Generatiekwaliteit:
   - Trouw: houdt het antwoord zich aan de opgehaalde context? (geen hallucinatie)
   - Antwoord relevantie: beantwoordt het antwoord de vraag?
   - Context relevantie: worden opgehaalde chunks daadwerkelijk gebruikt?

Evaluatietools:
- RAGAS: geautomatiseerd RAG-evaluatiekader (ragas.io)
- LangChain Evaluators: ingebouwde trouw + correctnesscontroles
- Handmatige gouden set: [X] vraag-antwoordparen, mens of Claude als rechter

Maak een testset van [10] vraag-antwoordparen voor mijn domein.
Instellen: wanneer mislukt mijn RAG en hoe weet ik dat?
```

## Voorbeeld

**Gebruiker:** RAG voor 5.000-pagina interne kennisdatabase (Notion-pagina's, PDF's, Slack-threads) bouwen. Queries zijn meestal "hoe doe ik X" en "wat is ons beleid over Y."

**Claude's architectuur:**

**Chunking:** Recursieve karaktersplitsing met 512-token chunks en 50-token overlap. Voor Slack-threads: groepeer per thread (behandel als één chunk), niet individuele berichten.

**Embedding:** text-embedding-3-small — uitgebalanceerde kosten en kwaliteit, alleen Engels is hier ok.

**Vector store:** Qdrant (zelfgehost) of Pinecone (beheerd) — op 5.000 pagina's (~250K chunks) hanteren beide dit gemakkelijk.

**Ophaling:** Hybride BM25 + semantisch. "Beleid over Y" queries profiteren van sleutelwoordmatch (BM25); "hoe doe ik" profiteert van semantisch. Combineer met RRF (Reciprocal Rank Fusion).

**Reranking:** Cohere rerank-v3 — voer top-20 door reranker voor top-5 naar generatie. Grootste kwaliteitswinst voor de moeite.

**Evaluatie:** Maak 50 gouden standaard Q&A-paren van uw teams meest voorkomende vragen. Gebruik RAGAS trouwheidsscore — richt op > 0,85 voor verzending.

**Verwachte nauwkeurigheid:** Hybride + reranking bereiken typisch 75-85% antwoordnauwkeurigheid op interne kennisdatabases. Puur semantisch zonder reranking: ~55-65%.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
