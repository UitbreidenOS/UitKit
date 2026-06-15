---
name: content-freshness
description: "SLA de mantenimiento, umbrales de obsolescencia y procedimientos de actualización de contenido de Claudient"
updated: 2026-06-15
---

# SLA de actualización de contenido de Claudient

Estándares de mantenimiento y procedimientos para mantener el contenido de Claudient actual y preciso. Esta guía define umbrales de obsolescencia, qué verificar por tipo de contenido y el proceso de actualización del frontmatter.

---

## Umbrales de obsolescencia

Un archivo se considera **obsoleto** cuando su fecha `updated` en el frontmatter YAML es más antiguo que el umbral para su tipo:

| Tipo de contenido | Umbral | Razón |
|---|---|---|
| Habilidades (productividad central, testing, debugging) | 6 meses | Los patrones centrales cambian frecuentemente con actualizaciones del modelo Claude |
| Habilidades (específicas del dominio: backend, frontend, etc.) | 6 meses | Las herramientas y mejores prácticas evolucionan rápidamente |
| Agentes (roles centrales: debugger, reviewer, etc.) | 6 meses | Las capacidades del agente dependen de las capacidades del modelo Claude |
| Guías (introducción, conceptual) | 9 meses | El material de referencia es más estable que el cómo hacerlo |
| Guías (específicas de herramienta/framework) | 6 meses | Las herramientas y APIs cambian más rápido que los conceptos |
| Flujos de trabajo (tácticos: bug-investigation, code-review) | 6 meses | Estos reflejan prácticas y herramientas actuales |
| Flujos de trabajo (estratégicos: onboarding, planning) | 9 meses | Los procesos a largo plazo son más estables |
| Prompts | 6 meses | La efectividad del prompt se degrada a medida que cambia el comportamiento del modelo |
| ADRs / Reglas (decisiones documentadas) | 12 meses | Las decisiones se pretenden que sean duraderas; revise solo cuando cambie el contexto |

**Regla global:** Si tiene una fecha `updated` y es más antigua que 6 meses, agréguelo a la cola de actualización. Use umbrales más largos (9–12 meses) solo para contenido verdaderamente no técnico (ejemplos históricos, guías archivadas).

---

## Indicadores de contenido obsoleto

Un archivo es funcionalmente obsoleto incluso si su fecha es reciente, si se aplica alguno de estos:

### Habilidades
- Ejemplos de sintaxis de comando que ya no funcionan (prueba en Claude Code)
- Nombres de herramientas que han sido renombrados o eliminados
- Referencia de captura de pantalla o UI obsoleta
- Condiciones de activación de gancho que ya no existen
- Ejemplo que se rompe en Claude Code actual
- Menciona una característica o nombre de modelo en desuso

### Agentes
- Describe herramientas a las que el agente ya no tiene acceso
- Hace referencia a una versión de modelo que ya no está disponible
- Las afirmaciones de capacidad ya no coinciden con la realidad
- Ejemplos de prompt que reflejan el comportamiento antiguo de la API

### Guías
- Tabla de comparación de características que ha cambiado (p. ej., precios del modelo, ventanas de contexto)
- Instrucciones de instalación para una herramienta con una nueva versión principal
- Pasos de flujo de trabajo que dependen de una característica eliminada
- Referencia de captura de pantalla o interfaz obsoleta
- Hace referencia a una estructura o convención de nomenclatura de proyecto antiguo

### Flujos de trabajo
- Hace referencia a una herramienta o habilidad que ha sido eliminada
- Los pasos paralelos dependen de herramientas que ya no están disponibles
- El ejemplo asume una estructura de base de código que ya no se recomienda
- Métrica o SLA que ya no es relevante (tamaños de equipo obsoletos, niveles de tráfico)

### Todos los tipos de contenido
- Enlaces muertos (404s a recursos externos)
- Referencias a características "próximas" que se enviaron hace mucho tiempo
- Ejemplos que utilizan versiones de lenguaje/framework obsoletas
- Afirmaciones ambiguas sin evidencia de apoyo

---

## Formato del frontmatter

Cada archivo en `skills/`, `agents/`, `guides/`, `workflows/`, `rules/` y `prompts/` debe tener un bloque de frontmatter YAML al inicio:

```yaml
---
name: the-skill-name
description: "Propósito de una línea de este archivo"
updated: 2026-06-15
---
```

### Reglas del frontmatter

- **name:** kebab-case, coincide con el nombre de archivo (sin `.md`)
- **description:** ~50 caracteres, cabe en una línea, no incluye el título
- **updated:** Fecha ISO 8601 (`YYYY-MM-DD`), actualizada a hoy siempre que modifique el archivo

**Ejemplo (archivo de habilidad):**
```yaml
---
name: freshness-auditor
description: "Ejecutar auditorías de actualización y generar listas de actualización priorizadas"
updated: 2026-06-15
---
```

**Ejemplo (archivo de flujo de trabajo):**
```yaml
---
name: freshness-refresh
description: "Sprint de mantenimiento trimestral para auditar y actualizar contenido obsoleto"
updated: 2026-06-15
---
```

### Cómo actualizar el frontmatter

Cuando modifique un archivo:
1. Encuentre el bloque `---` en la parte superior
2. Cambie el valor `updated:` a la fecha de hoy en formato ISO
3. No cambie `name` o `description` (estos son identificadores estables)
4. Confirme el archivo con la fecha actualizada

Si un archivo es obsoleto pero aún es preciso, actualice solo la fecha `updated:` para restablecer el contador de obsolescencia. Esto indica "actualización confirmada — contenido verificado como actual."

---

## Qué verificar por tipo de habilidad

### Habilidades de productividad
- Ejecute todos los ejemplos de comando en una sesión real de Claude Code — ¿funciona?
- Si la habilidad llama a una slash command (p. ej., `/code-review`), verifique que ese comando aún exista
- Si la habilidad hace referencia a un gancho o configuración (p. ej., configuración de `settings.json`), verifique que sea válido
- Verifique que los enlaces de herramientas externas (npm, GitHub, docs) no den 404

### Habilidades de dominio (backend, frontend, ML, etc.)
- Verifique que las recomendaciones de versión de framework/librería sean actuales
- Ejecute ejemplos de código (si son independientes) para asegurar que la sintaxis sea válida
- Verifique si la herramienta o framework ha lanzado una versión principal y cambió el comportamiento
- Verifique que los nombres de paquetes y rutas de importación no hayan cambiado

### Habilidades y guías conceptuales
- Relca el contenido con ojos frescos — ¿es la explicación aún clara y precisa?
- Verifique links externos (tutoriales, especificaciones, estándares) para 404
- Si la habilidad compara dos opciones, verifique que ambas sigan en uso común
- Si la habilidad describe una "mejor práctica", verifique que se alinee con el consenso actual de la industria

### Agentes
- Verifique que la recomendación de modelo del agente (Haiku/Sonnet/Opus) sea apropiada para la tarea
- Verifique que el `tools:` enumerado aún exista en Claude Code
- Relca la sección `model guidance` — ¿se aplica aún al modelo Claude actual?
- Verifique que las capacidades asumidas del agente no hayan sido eliminadas

### Flujos de trabajo
- Lea los pasos del flujo de trabajo — ¿están todas las herramientas, comandos y características referenciadas aún disponibles?
- Verifique si algún paso depende de comportamiento obsoleto
- Verifique que las métricas o SLAs mencionadas sean realistas
- Si el flujo de trabajo genera agentes, asegúrese de que las definiciones de agentes aún existan y sus roles no hayan cambiado

### Reglas
- Verifique que la regla aún se siga en la base de código
- Si la regla hace referencia a una herramienta o característica, verifique que aún exista
- Relca la justificación — ¿es aún válida?

---

## Flujo de trabajo de verificación de actualización (Para colaboradores individuales)

Al agregar o modificar un archivo:

1. **Actualice el frontmatter:**
   ```yaml
   updated: [LA FECHA DE HOY EN FORMATO YYYY-MM-DD]
   ```

2. **Pruebe si aplica:**
   - Si el archivo incluye comandos, ejecútelos
   - Si el archivo incluye código, valide la sintaxis
   - Si el archivo hace referencia a una característica, verifique que exista

3. **Verificar links:**
   - Las URLs externas en el archivo no deben dar 404
   - Los links internos (a otros archivos en Claudient) deben hacer referencia a archivos existentes

4. **Confirme:**
   ```bash
   git add path/to/file.md
   git commit -m "chore: refresh [filename] — verify accuracy and update date"
   ```

---

## Sprint de actualización trimestral

Cada 3 meses, ejecute el flujo de trabajo completo `/workflows/freshness-refresh`:

1. **Genere un informe:** `node scripts/generate-refresh-report.js`
2. **Clasifique archivos** por edad e importancia
3. **Genere agentes de revisión** para verificar la precisión del contenido
4. **Aplique actualizaciones** desde informes de agentes
5. **Confirme el lote** y restablezca el contador de obsolescencia

---

## Objetivos SLA

- **Habilidades de productividad central:** 95% actualizado (< 6 meses)
- **Todo otro contenido:** 85% actualizado
- **Fechas de frontmatter faltantes:** 0 (todos los archivos deben tener un campo `updated:`)
- **Links rotos:** 0 (verificación CI señalada inmediatamente)

Supervise estas métricas en el informe de actualización generado trimestralmente.

---

## Contenido relacionado

- `/workflows/freshness-refresh` — procedimiento del sprint de mantenimiento trimestral
- `/skills/productivity/freshness-auditor` — ejecute una auditoría de actualización a demanda
- `/scripts/check-freshness.js` — herramienta CLI para detectar archivos obsoletos
- `/scripts/generate-refresh-report.js` — genere un informe de actualización detallado

---
