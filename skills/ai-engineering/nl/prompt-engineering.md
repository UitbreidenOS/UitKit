---
name: prompt-engineering
description: "Prompt engineering: prompt-technieken, few-shot learning, chain-of-thought, temperatuur, top-p, optimaal prompt-systeem"
---

# Vaardigheid Prompt Engineering

## Wanneer activeren
- Prompts voor consistente outputs optimaliseren
- Prompt-ketens ontwerpen (COT, Reflection)
- LLM-parameters tunen (Temperature, Top-P)
- Few-Shot Learning instellen
- Foutieve outputs debuggen

## Instructies

```
Prompt-optimalisering voor [taak].

Taak: [beschrijf wat u van de LLM wilt]
Model: [GPT-4 / Claude / Gemini]
Verwachte outputs: [format, stijl, constraints]

Technieken:

1. Duidelijkheid en specificiteit
   - Wees expliciet wat u wilt
   - Vermijd ambiguïteit

2. Few-Shot Examples
   - Geef 2-5 voorbeelden van de gewenste output
   - Format: Voorbeeld input → verwachte output

3. Chain-of-Thought
   - "Denk stap voor stap"
   - Nuttig voor multi-stap redenering

4. Parameters
   - Temperature: 0 (deterministisch) tot 1 (creatief)
   - Top-P: 0.7-0.9 (kwaliteit vs diversiteit)
   - Max Tokens: lengte beperken

5. Systeemprompt
   - Rol: "You are expert in..."
   - Constraints: "Only include..."
   - Format: "Respond as JSON"

Geoptimaliseerde prompt en parameters voor mijn taak genereren.
```

---
