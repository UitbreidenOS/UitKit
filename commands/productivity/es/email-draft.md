---
description: Redacta un correo electrónico profesional basado en un tema, intención y contexto opcional
argument-hint: "[recipient, purpose, key points]"
---
Redacta un correo electrónico profesional basado en: $ARGUMENTS

Infiere lo siguiente de $ARGUMENTS:
- **Tipo de destinatario**: ejecutivo, ingeniero colega, proveedor externo, cliente, reclutador, etc.
- **Intención**: informar, solicitar, escalar, declinar, dar seguimiento, presentar, etc.
- **Tono**: formal, colegiado o directo — por defecto colegiado a menos que el contexto sugiera lo contrario.

Formato de salida:

**Asunto:** [conciso, específico — sin "Seguimiento" o "Pregunta rápida"]

**Cuerpo:**
[cuerpo del correo]

Reglas para el cuerpo:
- Abre con el punto, no con "Espero que este correo te encuentre bien" o equivalentes de relleno.
- Establece la solicitud o información clave en las primeras dos oraciones.
- Usa párrafos cortos (2–4 oraciones máximo). Una idea por párrafo.
- Si se requiere una acción del destinatario, hazlo explícito: qué, para cuándo.
- Cierra con una oración — ya sea un paso siguiente claro o una llamada a la acción sin fricción.
- Sin lugares comunes de cierre ("No dudes en comunicarte", "Gracias de antemano").
- Marcador de firma: `[Your name]`
- Longitud objetivo: 80–200 palabras para la mayoría de correos. Alarga solo si el contenido lo requiere.

Calibración de tono por tipo de destinatario:
- Ejecutivo: alta señal, sin relleno, lídera con impacto.
- Colega / compañero de equipo: directo, puedes usar framing de "nosotros", lo conversacional está bien.
- Proveedor externo: profesional pero no rígido; sé específico sobre lo que necesitas.
- Cliente: framing empático, evita jerga interna.
- Reclutador: breve, confiado, sin desesperación.

Si $ARGUMENTS es ambiguo sobre la intención o destinatario, establece tu suposición en la parte superior en una línea, luego produce el borrador.

Produce la línea de asunto, cuerpo y nota de suposición si corresponde. Sin preámbulo.
