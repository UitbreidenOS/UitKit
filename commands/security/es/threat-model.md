---
description: Producir un modelo de amenazas STRIDE para un componente del sistema o la aplicación completa
argument-hint: "[component, feature, or diagram description]"
---
Producir un modelo de amenazas STRIDE para `$ARGUMENTS`. Si no se proporciona argumento, modelar la aplicación completa basándose en la base de código, README y cualquier documentación de arquitectura encontrada en el repositorio.

**Paso 1 — Comprender el sistema**

Antes de modelar, responder estas preguntas a partir del código y la documentación:
- ¿Cuáles son los puntos de entrada? (endpoints HTTP, colas de mensajes, ingesta de archivos, CLI)
- ¿Qué almacenes de datos se utilizan y qué contienen?
- ¿Qué servicios externos llama el sistema?
- ¿Cuáles son los límites de confianza? (accesible desde internet vs interno, usuario vs administrador vs servicio a servicio)
- ¿Cuál es el dato más sensible que maneja el sistema?

Producir un resumen breve del flujo de datos: actores → puntos de entrada → procesamiento → almacenes de datos → servicios externos.

**Paso 2 — Aplicar STRIDE**

Para cada componente o flujo de datos identificado, evaluar cada categoría de amenaza:

| Amenaza | Pregunta a hacer |
|---|---|
| **Suplantación** | ¿Puede un atacante suplantar a un usuario, servicio o componente? |
| **Manipulación** | ¿Se pueden modificar datos en tránsito o en reposo sin detección? |
| **Repudio** | ¿Puede un actor negar haber realizado una acción debido a registros faltantes o atribución débil? |
| **Divulgación de Información** | ¿Pueden filtrarse datos sensibles a través de errores, registros, canales laterales o respuestas de API demasiado amplias? |
| **Denegación de Servicio** | ¿Puede un atacante agotar recursos (CPU, memoria, conexiones, límites de velocidad)? |
| **Elevación de Privilegios** | ¿Puede un actor de menor confianza obtener capacidades reservadas para actores de mayor confianza? |

**Paso 3 — Calificar cada amenaza**

Usar puntuación DREAD simplificada para cada hallazgo:
- **Daño**: 1–3 (impacto bajo / medio / alto si se explota)
- **Reproducibilidad**: 1–3 (difícil / a veces / siempre reproducible)
- **Explotabilidad**: 1–3 (atacante experto / moderado / sin habilidades)
- Puntuación = suma (máximo 9). ≥7 = Crítico, 5–6 = Alto, 3–4 = Medio, ≤2 = Bajo

**Paso 4 — Salida**

```
## Modelo de Amenazas: [Componente/Sistema]

### Descripción General del Sistema
[Resumen del flujo de datos del Paso 1]

### Amenazas

#### [categoría STRIDE] — [título de la amenaza]
Componente: [punto de entrada, flujo de datos o almacén]
Descripción: qué hace el atacante y qué logra
Puntuación DREAD: D=N R=N E=N → Total=N (Severidad)
Mitigaciones:
  - [control actual, si existe]
  - [control recomendado]

### Tabla de Resumen de Riesgos
| # | Amenaza | Severidad | ¿Mitigado? |
```

**Paso 5 — Recomendaciones priorizadas**

Enumerar las 5 mitigaciones principales por puntuación de riesgo, con orientación de implementación específica para esta base de código.
