---
description: Redacta un Registro de Decisión Arquitectónica para una decisión técnica específica
argument-hint: "[tema de decisión]"
---
Redacta un Registro de Decisión Arquitectónica (ADR) para: $ARGUMENTS

Antes de escribir:
1. Verifica si existe un directorio `docs/decisions/`, `docs/adr/`, o `adr/` para determinar
   la convención de numeración y el esquema de nombres de archivo en uso. Coincide exactamente.
2. Si ya existe una plantilla ADR en el repositorio, úsala. Si no, usa el formato a continuación.
3. Lee los archivos fuente relevantes para fundamentar las secciones "Contexto" y "Consecuencias" en
   código real, no en hipotéticos.

Formato ADR:

# ADR-NNN: [Título — frase nominal describiendo la decisión, no el problema]

## Estado
Propuesto | Aceptado | Deprecado | Reemplazado por ADR-NNN

## Fecha
YYYY-MM-DD

## Contexto
¿Qué situación, restricción o requisito obligó esta decisión?
Incluye: escala, tamaño del equipo, restricciones del sistema existente, requisitos externos.
Mantén solo hechos — sin defensa aquí.

## Decisión
Declara la decisión en una oración comenzando con "Decidimos…".
Luego explica el mecanismo: qué se construirá, cambiará o adoptará, y cómo.

## Alternativas Consideradas
Para cada alternativa considerada:
- **Nombre de la opción**: qué es, por qué fue considerada, por qué fue rechazada.
Al menos dos alternativas. No listes opciones que nunca fueron seriamente consideradas.

## Consecuencias
**Positivas:**
- Beneficios concretos y verificables (desempeño, simplicidad, costo, velocidad del equipo).

**Negativas:**
- Compromisos reales aceptados. No los minimices.

**Riesgos:**
- Qué podría salir mal. Qué dispararía reconsiderar esta decisión.

## Referencias
Enlaces a PRs relevantes, issues, benchmarks, o documentos externos que informaron la decisión.

Reglas de escritura:
- Sé preciso y neutral. Un ADR es un registro histórico, no un argumento de venta.
- Escribe en pasado para decisiones aceptadas, futuro para propuestas.
- Evita adjetivos vagos: "simple", "flexible", "escalable" no significan nada sin evidencia.
- Si $ARGUMENTS es vago, haz una pregunta aclaratoria antes de proceder: ¿qué decisión específica
  necesita ser registrada, y qué fue elegido?
- Escribe el archivo en el directorio ADR correcto con el siguiente número disponible.
  Confirma la ruta de salida completa después de escribir.
