> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../ai-product.md).

# CLAUDE.md Starter — AI-product

Zet dit in de `CLAUDE.md` van je project en vul de secties tussen haakjes in.

---

```markdown
# [Projectnaam] — Claude Code Instructies

## Wat dit is
[Eén alinea: wat het AI-product doet, welk model het gebruikt, wie de gebruikers zijn]

## Stack
- Taal: [TypeScript / Python]
- Framework: [Next.js / FastAPI]
- AI: [Claude API via Anthropic SDK / OpenAI / Gemini]
- Model: [claude-sonnet-4-6 / claude-opus-4-7 / claude-haiku-4-5]
- Database: [PostgreSQL / Supabase]
- Vector DB: [Pinecone / pgvector / Weaviate] (indien van toepassing)
- Deployment: [Vercel / AWS / Railway]

## Projectstructuur
src/
├── app/          ← Next.js app router / FastAPI routes
├── ai/           ← Alle AI-gerelateerde code: prompts, ketens, tools
│   ├── prompts/  ← Systeemprompts en promptsjablonen
│   ├── tools/    ← Tooldefinities voor function calling
│   └── agents/   ← Agentdefinities en orkestratie
├── db/           ← Databasequeries en migraties
├── services/     ← Bedrijfslogica
└── utils/        ← Pure hulpprogramma's

## AI-conventies
- Alle systeemprompts staan in src/ai/prompts/ — nooit inline in route-handlers
- Pin altijd de modelversie — gebruik nooit de alias "latest"
- Schakel altijd prompt-caching in op systeemprompts (cache_control: ephemeral)
- Log tokengebruik per verzoek voor kostentracking
- Streamingantwoorden: gebruik SSE voor antwoorden > 1000 tokens
- Geef nooit gebruikers-PII door aan het model tenzij de feature dit expliciet vereist
- Tooldefinities staan in src/ai/tools/ — één bestand per tool

## Prompt-caching instelling
- Systeemprompts moeten cache_control gebruiken om caching in te schakelen
- Cache-lezen = $0.30/MTok vs niet gecachet = $3/MTok — cache altijd
- Invalideer cache wanneer systeemprompt verandert (automatisch bij inhoudswijziging)

## Kostencontroles
- Standaardmodel: [claude-haiku-4-5] voor eenvoudige taken, [claude-sonnet-4-6] voor complex
- Max tokens: stel expliciete max_tokens in op elk verzoek — nooit onbeperkt
- Rate limit: [X] verzoeken per gebruiker per minuut
- Budgetalert: log wanneer een enkele sessie $[X] overschrijdt

## Beslissingen (niet opnieuw bespreken)
- [Modelkeuze-redenering]
- [Waarom streaming vs. niet-streaming]
- [Contextvenster-strategie: samenvatten bij N tokens]
- [Tool calling vs. directe generatie voor gestructureerde output]

## Testen
- Unittests voor promptconstructie en outputparsing
- Integratietests met opgenomen API-antwoorden (VCR / fixtures)
- Doe nooit echte API-aanroepen in tests — kost geld en is traag
- Test vijandige invoer: prompt-injectie, jailbreak-pogingen, randgevallen

## Commando's
- [dev commando]
- [test commando]
- [deploy commando]

## Nooit doen
- Nooit systeemprompts inline in route-handlers plaatsen
- Nooit onbegrensde AI-aanroepen doen zonder max_tokens
- Nooit volledige AI-antwoorden loggen in productie (kan gebruikers-PII bevatten)
- Nooit API-sleutels hardcoderen — gebruik omgevingsvariabelen
- Nooit het AI-model direct aanroepen vanuit UI-componenten
```

---
