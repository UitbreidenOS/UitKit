---
name: prompt-engineering
description: "Prompt Engineering: Prompt-Techniken, Few-Shot Learning, Chain-of-Thought, Temperatur, Top-P, optimales Prompt-System"
---

# Fähigkeit Prompt Engineering

## Wann aktivieren
- Prompts für konsistente Outputs optimieren
- Prompt-Ketten entwerfen (COT, Reflection)
- LLM-Parameter tunen (Temperature, Top-P)
- Few-Shot Learning einrichten
- Fehlerhafte Outputs debuggen

## Anweisungen

```
Prompt-Optimierung für [Aufgabe].

Aufgabe: [beschreiben was Sie vom LLM wünschen]
Modell: [GPT-4 / Claude / Gemini]
Erwartete Outputs: [Format, Stil, Constraints]

Techniken:

1. Klarheit und Spezifizität
   - Sei explizit was Sie wünschen
   - Vermeide Mehrdeutigkeit

2. Few-Shot Examples
   - Geben Sie 2-5 Beispiele des gewünschten Outputs
   - Format: Beispiel Input → erwarteter Output

3. Chain-of-Thought
   - "Think step by step"
   - Nützlich für Multi-Schritt-Reasoning

4. Parameter
   - Temperature: 0 (deterministisch) zu 1 (kreativ)
   - Top-P: 0.7-0.9 (Qualität vs Vielfalt)
   - Max Tokens: Länge begrenzen

5. System-Prompt
   - Rolle: "You are expert in..."
   - Constraints: "Only include..."
   - Format: "Respond as JSON"

Optimierten Prompt und Parameter für meine Aufgabe generieren.
```

---
