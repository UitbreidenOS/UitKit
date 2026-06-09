---
description: Genereer een testraamwerk om een LLM-prompt of -keten tegen een dataset te evalueren
argument-hint: "[prompt file or description of the task being evaluated]"
---
Je bent een LLM-evaluatieraamwerk aan het bouwen voor de taak beschreven in $ARGUMENTS.

Lees alle gegeven bestandspaden. Als een losse beschrijving wordt gegeven, maak de taak hieruit af.

**Stap 1 — Identificeer evaluatievereisten**

Bepaal:
- Taaktype: classificatie, extractie, generatie, RAG, tool-gebruik, meerdere beurten, of ander
- Hoe "correct" eruitziet: exacte match, semantische match, rubric-score, gestructureerde schemavalidatie, of menselijke tussenkomst
- Foutmodi die het waard zijn om af te vangen: hallucinatie, weigering, formaatschending, latentie, tokenoverloop

**Stap 2 — Ontwerp het testdatasetschema**

Voer een JSONL-schema voor testgevallen uit. Elke record moet bevatten:
- `id`: unieke tekenreeks
- `input`: het gebruikersbericht of volledige promptcontext (inclusief systeemprompt indien relevant)
- `expected`: grondwaarheid of rubric (pas vorm aan op taaktype)
- `tags`: array van tekenreeksen voor filtering (bijvoorbeeld `["edge-case", "language:fr"]`)

Toon 3–5 representatieve voorbeeldrecords die betrekking hebben op: blij pad, edge case, adversariële invoer.

**Stap 3 — Genereer het raamwerkscript**

Schrijf een zelfstandig Python-script met behulp van de Anthropic SDK (`anthropic`-pakket). Vereisten:
- Laad testgevallen uit `evals.jsonl`
- Roep het model aan voor elk geval (standaard: `claude-sonnet-4-6`, overschrijfbaar via `--model`)
- Score elk resultaat met behulp van de geschikte evaluator:
  - Exacte/regex-match voor gestructureerde outputs
  - Inbeddings cosinus-similariteit voor semantische taken (gebruik `sentence-transformers` indien beschikbaar, anders overslaan)
  - LLM-als-rechter rubric-scoring voor open-ended generatie (zelfstandig, gebruik `claude-haiku-4-5-20251001`)
- Voer een resulaten JSONL en een samenvattingstabel uit naar stdout
- Ondersteun `--sample N`-vlag om op N willekeurige gevallen uit te voeren
- Gebruik `asyncio` + `AsyncAnthropic` voor parallelle uitvoering met een instelbare gelijktijdigheidsgrens

**Stap 4 — CI-integratieknipsel**

Toon een GitHub Actions-stap die:
- Het raamwerk bij elke PR uitvoert
- De controle mislukt als de slaagpercentage onder een instelbare drempel (standaard 90%) daalt
- Een samenvattingscommentaar met opsplitsingen per tag plaatst

**Uitvoerindeling:**
1. Dataset schema + voorbeeldrecords (JSONL)
2. Volledig Python-raamwerk (`eval_harness.py`)
3. GitHub Actions YAML-knipsel
4. Eenregelige `README`-gebruiksblok

Geen vervangingscommentaren. Elke functie moet worden geïmplementeerd.
