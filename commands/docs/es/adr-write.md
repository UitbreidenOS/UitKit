---
description: Redactar un Registro de Decisiones de Arquitectura para una decisión técnica específica
argument-hint: "[decision topic]"
---
Redactar un Registro de Decisiones de Arquitectura (ADR) para: $ARGUMENTS

Antes de escribir:
1. Busca un directorio `docs/decisions/`, `docs/adr/` o `adr/` para determinar
   la convención de numeración y el esquema de nomenclatura de archivos en uso. Coincide exactamente.
2. Si ya existe una plantilla de ADR en el repositorio, úsala. Si no, usa el formato siguiente.
3. Lee los archivos de código fuente relevantes para fundamentar las secciones "Contexto" y "Consecuencias" en
   código real, no en hipótesis.

Formato del ADR:

# ADR-NNN: [Título — frase nominal que describe la decisión, no el problema]

## Estado
Propuesto | Aceptado | Descontinuado | Reemplazado por ADR-NNN

## Fecha
YYYY-MM-DD

## Contexto
¿Qué situación, restricción o requisito obligó esta decisión?
Incluir: escala, tamaño del equipo, restricciones del sistema existente, requisitos externos.
Mantén los hechos — sin defensa aquí.

## Decisión
Declara la decisión en una frase que comience con "Vamos a…".
Luego explica el mecanismo: qué se construirá, cambiará o adoptará, y cómo.

## Alternativas Consideradas
Para cada alternativa considerada:
- **Nombre de la opción**: qué es, por qué fue considerada, por qué fue rechazada.
Al menos dos alternativas. No enumeres opciones que nunca fueron consideradas seriamente.

## Consecuencias
**Positivas:**
- Beneficios concretos y verificables (rendimiento, simplicidad, coste, velocidad del equipo).

**Negativas:**
- Compensaciones reales aceptadas. No las minimices.

**Riesgos:**
- Qué podría salir mal. Qué activaría reconsiderar esta decisión.

## Referencias
Enlaces a PRs, problemas, pruebas de rendimiento o documentación externa relevante que informaron la decisión.

Reglas de escritura:
- Sé preciso y neutral. Un ADR es un registro histórico, no una presentación de ventas.
- Escribe en tiempo pasado para decisiones aceptadas, futuro para las propuestas.
- Evita adjetivos vagos: "simple", "flexible", "escalable" no significan nada sin evidencia.
- Si $ARGUMENTS es vago, haz una pregunta aclaratoria antes de proceder: ¿qué decisión específica
  necesita ser registrada, y qué fue elegido?
- Escribe el archivo en el directorio ADR correcto con el siguiente número disponible.
  Confirma la ruta de salida completa después de escribir.
