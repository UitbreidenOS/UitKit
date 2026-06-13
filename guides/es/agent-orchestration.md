# Guía de orquestación de agentes

Cómo delegar, paralelizar y especializar trabajo usando el sistema de sub-agentes de Claude Code.

---

## Qué son los sub-agentes

Un sub-agente es una instancia Claude separada iniciada por la sesión padre para manejar una tarea específica y acotada. Obtiene:
- Una ventana de contexto fresca (sin historial de sesión)
- Un subconjunto específico de herramientas (si está configurado)
- Una selección de modelo (puede diferir del padre)
- Un prompt que escribes explícitamente

Los sub-agentes no son magia — son una herramienta específica para problemas específicos.

---

## Cuándo usar un sub-agente

Usa un sub-agente cuando la tarea tiene **entradas claras** y **salidas claras** y es **independiente del estado de sesión actual**.

**Buenos candidatos:**
- Revisar 10 archivos en busca de problemas de seguridad
- Ejecutar una búsqueda específica en el código para localizar un patrón
- Generar boilerplate para un nuevo módulo dado un spec
- Analizar un archivo de log y devolver un resumen

**Malos candidatos:**
- Tareas que requieren el contexto completo de la sesión
- Tareas que requieren ida y vuelta — los sub-agentes son de una sola pasada
- Tareas donde el overhead de lanzamiento supera el trabajo

---

## 1. Patrón de delegación

La sesión padre identifica una tarea acotada y la entrega.

**Regla clave:** El prompt del sub-agente debe ser autónomo. No tiene acceso a lo que la sesión padre ha estado haciendo. Briéfalo como un colega que acaba de entrar a la sala.

**Qué incluir en el prompt del sub-agente:**
- Qué estás intentando lograr y por qué
- Los archivos o directorios específicos
- El formato de resultado deseado
- Decisiones ya tomadas

---

## 2. Patrón de paralelización

Múltiples sub-agentes ejecutándose simultáneamente en tareas independientes.

**Cuándo paralelizar:**
- La misma operación debe aplicarse a muchos archivos/módulos
- Dos tareas genuinamente independientes deben completarse ambas
- Tareas de investigación que cubren diferentes áreas

**Usando git worktrees para cambios de código paralelos:**
```bash
git worktree add ../feature-branch-a feature-a
git worktree add ../feature-branch-b feature-b
```

**Anti-patrones de paralelización:**
- Paralelizar tareas que comparten estado (conflictos de escritura)
- Tareas paralelas donde una depende de la salida de la otra

---

## 3. Patrón de especialización (cavecrew)

Adapta el modelo y las herramientas del sub-agente a la naturaleza de la tarea. Inspirado en el patrón **cavecrew** (fuente: [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)) — ahorra ~60% de tokens comparado con usar Opus para cada sub-agente.

| Rol | Modelo | Herramientas | Usar cuando |
|---|---|---|---|
| Investigador | Haiku 4.5 | Read, Bash (solo grep/find) | Localizar cosas en el código — solo lectura, rápido |
| Constructor | Sonnet 4.6 | Read, Edit, Write, Bash | Cambios quirúrgicos de 1–2 archivos |
| Revisor | Haiku 4.5 | Read | Revisar un diff o conjunto de archivos |
| Orquestador | Opus 4.7 | Todos | Coordinación compleja multi-paso, decisiones de arquitectura |

---

## 4. Patrón de traspaso de contexto

Cuando una sesión ha acumulado contexto significativo y necesitas traspasar el trabajo a un nuevo agente.

**Estructura del prompt de traspaso:**
```
## Context
[Qué hace este proyecto, brevemente]
[En qué estábamos trabajando]
[Decisiones tomadas durante esta sesión]

## Files modified
[Lista con breve razón para cada cambio]

## Current state
[Qué está hecho, qué no, qué bloquea]

## Your task
[Tarea específica y acotada para el nuevo agente]

## Constraints
[Decisiones tomadas que no deben revisarse]
```

---

## 5. Dependencias duras vs. suaves

**Dependencia dura:** La tarea aguas abajo falla explícitamente sin la configuración aguas arriba.
- Señálalo explícitamente: "Esta skill requiere configuración — ejecuta `/setup` primero."

**Dependencia suave:** La tarea funciona pero produce salida de menor calidad sin configuración.
- No detener. Degradar graciosamente y anotar la brecha.

---

## 6. Control de alcance para sub-agentes

Cada sub-agente debe tener un límite de alcance explícito.

**Incluir en cada prompt de sub-agente:**
```
## Scope
- Read: yes
- Write/Edit: [solo archivos específicos O no]
- Shell commands: [comandos específicos permitidos O ninguno]
- Network: [sí/no]

## Do not
- Do not modify files outside [directory]
- Do not make git commits
- Do not install packages
```

---

## 7. Devolver resultados de sub-agentes

**Preferir archivos para:**
- Listas de hallazgos sobre las que el padre iterará
- Código generado que el padre revisará
- Informes referenciados múltiples veces

**Preferir mensajes de retorno para:**
- Respuestas simples sí/no
- Datos estructurados cortos
- Informes de estado

---

## Referencia rápida

| Objetivo | Patrón |
|---|---|
| Tarea acotada y autónoma | Delegación |
| Misma tarea en muchos archivos | Paralelización |
| Búsqueda/localización solo lectura | Investigador (Haiku) |
| Cambio de código quirúrgico | Constructor (Sonnet) |
| Revisión de diff/archivo | Revisor (Haiku) |
| Coordinación compleja multi-paso | Orquestador (Opus) |
| Traspaso de sesión | Patrón de traspaso de contexto |
| Salida grande de sub-agente | Escribir a archivo, padre lo lee |
| Resultado estructurado corto | Mensaje de retorno |

---

## Trabaja con nosotros
