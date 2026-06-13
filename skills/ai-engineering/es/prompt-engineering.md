---
name: prompt-engineering
description: "Prompt engineering: técnicas de prompt, few-shot learning, chain-of-thought, temperatura, top-p, sistema de prompt óptimo"
---

# Habilidad Prompt Engineering

## Cuándo activar
- Optimizar prompts para salidas consistentes
- Diseñar cadenas de prompts (COT, Reflection)
- Sintonizar parámetros LLM (Temperature, Top-P)
- Configurar few-shot learning
- Depurar salidas incorrectas

## Instrucciones

```
Optimización de prompt para [tarea].

Tarea: [describir qué quiere del LLM]
Modelo: [GPT-4 / Claude / Gemini]
Salidas esperadas: [formato, estilo, restricciones]

Técnicas:

1. Claridad y especificidad
   - Sea explícito sobre lo que quiere
   - Evite ambigüedad

2. Few-Shot Examples
   - Proporcione 2-5 ejemplos de la salida deseada
   - Formato: Entrada de ejemplo → salida esperada

3. Chain-of-Thought
   - "Piense paso a paso"
   - Útil para razonamiento multi-paso

4. Parámetros
   - Temperature: 0 (determinista) a 1 (creativo)
   - Top-P: 0.7-0.9 (calidad vs diversidad)
   - Max Tokens: limitar longitud

5. Prompt de Sistema
   - Rol: "You are expert in..."
   - Restricciones: "Only include..."
   - Formato: "Respond as JSON"

Genere prompt optimizado y parámetros para mi tarea.
```

---
