---
name: model-tiering
description: "Enrutamiento y categorización automática de prompts de desarrollo entre Opus, Sonnet y Haiku según las características de la tarea"
updated: 2026-06-23
---

# Competencia de Categorización Automática de Modelos

## Cuándo activar

- Optimizar costos de tokens durante la ejecución de un agente de codificación de múltiples pasos.
- Asignación dinámica de pesos de modelos durante grandes ejecuciones de refactorización.
- Resolver tareas complejas de planificación antes de generar código de implementación.
- Activar configuraciones de respaldo cuando las tareas de razonamiento complejo fallan en modelos más pequeños.

## Cuándo NO usar

- Chats interactivos rápidos donde cambiar de modelo agrega una latencia perceptible.
- Sobrescrituras explícitas de modelos por parte del desarrollador (ej. `--model sonnet`).

## Instrucciones

Para enrutar tareas dinámicamente, clasifique las consultas de desarrollo en uno de los siguientes tres niveles:

### 1. El Nivel de Razonamiento (Opus / Modelo de Pensamiento)
- **Alcance**: Cambios arquitectónicos grandes, auditorías de seguridad, diseños de algoritmos complejos, preocupaciones transversales.
- **Criterio**: Alto riesgo estructural, requiere razonamiento sobre grandes ventanas de contexto.

### 2. El Nivel de Planificación (Sonnet)
- **Alcance**: APIs de nivel medio, refactorización de funciones locales, diseños de maquetación y creación de tareas de implementación paso a paso.
- **Criterio**: Complejidad media, sigue patrones de arquitectura existentes.

### 3. El Nivel de Codificación (Haiku)
- **Alcance**: Escribir código repetitivo (boilerplate), documentación, pruebas unitarias simples, modificaciones de scripts.
- **Criterio**: Cambios en un solo archivo, baja complejidad arquitectónica, patrones de código repetibles.
