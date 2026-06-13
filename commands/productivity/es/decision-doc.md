---
description: Redacta un registro de decisión arquitectónica o técnica (ADR) a partir de una descripción
argument-hint: "[tema de decisión y contexto]"
---
Redacta un documento de decisión para lo siguiente: $ARGUMENTS

Usa esta estructura:

**Estado:** Propuesto | Aceptado | Deprecado | Supersedido  
(Por defecto, usa "Propuesto" a menos que $ARGUMENTS especifique lo contrario.)

**Contexto**  
Qué situación fuerza una decisión ahora. Incluye restricciones, arte previo y por qué el status quo es insuficiente. 3–6 oraciones.

**Decisión**  
Un párrafo. Establece la decisión directamente en la primera oración. No entierres la noticia principal.

**Opciones Consideradas**

Para cada opción (2–4 en total, incluyendo la elegida):
- **Opción N: [Nombre]** — descripción de una oración
  - Pro: ...
  - Pro: ...
  - Contra: ...
  - Contra: ...

**Consecuencias**

Consecuencias positivas (qué mejora o se hace posible).  
Consecuencias negativas / compensaciones (qué se vuelve más difícil, qué se pierde).  
Riesgos (qué podría salir mal, y mitigación si se conoce).

**Condiciones para Revisar**  
Lista de puntos: condiciones específicas bajo las cuales esta decisión debe revisarse. Sé concreto — no "si los requisitos cambian" sino "si el volumen de solicitudes excede 10k/s" o "si el proveedor X depreca la API Y."

Reglas:
- Escribe para un lector que encontrará este documento 18 meses después sin otro contexto.
- No recomiendes la opción "obviamente correcta" sin listar contras reales.
- No rellenes con antecedentes que sean conocimiento común para un ingeniero senior.
- Si $ARGUMENTS no proporciona suficiente contexto para nombrar opciones reales, indica las dos alternativas más comunes en la industria y señala que el lector debe validarlas.
- Mantén la longitud total bajo 600 palabras a menos que la decisión sea inusualmente compleja.

Genera solo el documento.
