---
description: Redactar un correo electrónico profesional basado en un tema, intención y contexto opcional
argument-hint: "[destinatario, propósito, puntos clave]"
---
Redacta un correo electrónico profesional basado en: $ARGUMENTS

Infiere lo siguiente de $ARGUMENTS:
- **Tipo de destinatario**: ejecutivo, ingeniero par, proveedor externo, cliente, reclutador, etc.
- **Intención**: informar, solicitar, escalar, declinar, dar seguimiento, presentar, etc.
- **Tono**: formal, colegiado o directo — por defecto colegiado a menos que el contexto sugiera lo contrario.

Formato de salida:

**Asunto:** [conciso, específico — sin "Seguimiento" o "Una pregunta rápida"]

**Cuerpo:**
[cuerpo del correo]

Reglas para el cuerpo:
- Abre con el punto, no con "Espero que este correo te encuentre bien" o relleno equivalente.
- Establece la solicitud o información clave en las primeras dos oraciones.
- Usa párrafos cortos (máximo 2–4 oraciones). Una idea por párrafo.
- Si hay una acción requerida del destinatario, hazla explícita: qué, para cuándo.
- Cierra con una oración — ya sea un próximo paso claro o un llamado a la acción de bajo fricción.
- Sin lugares comunes de cierre ("No dudes en comunicarte", "Gracias de antemano").
- Marcador de firma: `[Tu nombre]`
- Largo objetivo: 80–200 palabras para la mayoría de correos. Ve más largo solo si el contenido lo requiere.

Calibración de tono por tipo de destinatario:
- Ejecutivo: señal alta, sin relleno, lidera con impacto.
- Par / compañero de equipo: directo, puede usar framing "nosotros", lo conversacional está bien.
- Proveedor externo: profesional pero no rígido; sé específico sobre lo que necesitas.
- Cliente: framing empático, evita jerga interna.
- Reclutador: breve, confiado, sin desesperación.

Si $ARGUMENTS es ambiguo sobre la intención o el destinatario, establece tu suposición en la parte superior en una línea, luego produce el borrador.

Devuelve la línea de asunto, el cuerpo y la nota de suposición si es aplicable. Sin preámbulo.
