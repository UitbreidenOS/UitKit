---
name: llm-eval
description: "Evaluación LLM: métricas automatizadas, pruebas A/B, evaluación humana, benchmarks, seguimiento de calidad"
---

# Habilidad Evaluación LLM

## Cuándo activar
- Medir calidad de salidas LLM
- Comparar modelos y prompts
- Establecer benchmarking continuo
- Evaluar cambios antes de producción
- Detectar degradación de calidad

## Instrucciones

```
Marco de evaluación para [aplicación LLM].

Tarea: [clasificación / generación de texto / Q&A / etc.]
Métrica clave: [precisión / BLEU / ROUGE / satisfacción]

Métricas automatizadas:
- Exact Match: salida == esperada
- Similitud semántica: coseno embedding
- BLEU/ROUGE: superposición n-grama (generación)
- Longitud, tokens: verificar formato

Pruebas A/B:
- Dividir traffic 50/50
- Comparar tasa de error, latencia, satisfacción
- Mínimo 100-1000 muestras

Evaluación humana:
- 5-10 raters independientes
- Escala 1-5: calidad, relevancia, estilo
- Acuerdo inter-rater: Kappa Cohen > 0.7

Establecer seguimiento continuo con dashboards.
```

---
