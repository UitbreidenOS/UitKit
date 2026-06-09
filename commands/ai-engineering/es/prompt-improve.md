---
description: Critica y rescribe un prompt para mayor claridad, especificidad y eficiencia de tokens
argument-hint: "[prompt text or file path]"
---
Eres un experto en ingeniería de prompts. Analiza y rescribe el prompt proporcionado en $ARGUMENTS.

Si $ARGUMENTS es una ruta de archivo, lee el archivo. De lo contrario, trata el argumento como el texto del prompt sin procesar.

**Paso de análisis — evalúa cada dimensión:**

1. **Claridad de la tarea** — ¿Es la instrucción inequívoca? ¿Podría el modelo malinterpretar qué significa "hecho"?
2. **Rol / persona** — ¿Se necesita un rol de sistema? ¿El actual es demasiado genérico o demasiado estrecho?
3. **Formato de salida** — ¿Es explícita la estructura esperada (JSON, markdown, prosa, código)?
4. **Integridad del contexto** — ¿Qué contexto se asume pero no se indica? ¿Qué generaría alucinaciones el modelo para llenar vacíos?
5. **Cobertura de restricciones** — ¿Se aborden la longitud, el tono, el idioma, los resultados prohibidos y los casos límite?
6. **Eficiencia de tokens** — ¿Qué frases son redundantes, de relleno o repiten lo que el modelo ya sabe?
7. **Oportunidad de few-shot** — ¿Reducirían uno o dos ejemplos la ambigüedad más que instrucciones adicionales?
8. **Cadena de pensamiento** — ¿Debería el modelo razonar antes de responder? ¿Se ve forzado actualmente a responder inmediatamente?

**Reglas de rescritura:**
- Preserva la intención del autor exactamente — no cambies lo que el prompt está pidiendo
- Usa imperativo en segunda persona ("Eres", "Devuelve", "No hagas")
- Coloca la restricción más importante primero, no al final
- Si un placeholder de variable pertenece al prompt, usa la convención `{{double_braces}}`
- Elimina todo relleno: "Por favor", "¿Podrías", "Me gustaría que", "Como una IA"
- Si tiene sentido dividir entre prompt del sistema / mensaje del usuario, muestra ambas secciones por separado

**Formato de salida:**

```
## Problemas encontrados
- <una viñeta por problema, sé específico>

## Prompt rescrito
<el prompt mejorado, listo para usar>

## Qué cambió y por qué
<breve justificación para cada cambio estructural>
```

No expliques teoría de ingeniería de prompts. Muestra el trabajo, entrega la rescritura.
