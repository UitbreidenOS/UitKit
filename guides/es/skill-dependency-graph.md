# Guía del gráfico de dependencias de habilidades

Esta guía explica cómo analizar y visualizar las relaciones entre habilidades y agentes en Claudient usando las herramientas de gráfico de dependencias.

---

## Descripción general

El repositorio Claudient es una red de habilidades y agentes. Con el tiempo, las habilidades se referencian mutuamente — ya sea por nombre, funcionalidad o contexto. Comprender estas dependencias le ayuda a:

- **Identificar clústeres**: qué habilidades trabajan juntas
- **Detectar huérfanos**: habilidades a las que nadie hace referencia (candidatos para archivo)
- **Detectar fragilidad**: habilidades con demasiadas aristas entrantes (ampliamente dependidas, alto riesgo si se cambian)
- **Planificar refactorización**: fusionar o extraer habilidades para reducir el acoplamiento

Las herramientas de gráfico de dependencias escanean todos los archivos `.md` en los directorios `skills/` y `agents/`, detectan referencias cruzadas mediante coincidencia de nombres y producen tres formatos de salida: diagramas Mermaid, listas de adyacencia JSON y estadísticas de resumen.

---

## El script principal: `scripts/dependency-graph.js`

Este script Node.js recorre los directorios `skills/` y `agents/` y construye un gráfico de referencias de habilidad a habilidad y agente a agente.

### Cómo funciona

1. **Recopila todos los nombres**: Lee cada archivo `.md` en `skills/` y `agents/`, extrayendo nombres de archivos (kebab-case, convertidos a minúsculas) como identificadores de nodos.
2. **Encuentra referencias**: Para cada archivo, escanea su contenido (insensible a mayúsculas) para menciones de otras habilidades o agentes usando coincidencia de límite de palabra con regex.
3. **Construye la lista de adyacencia**: Asigna cada habilidad/agente a las habilidades/agentes a las que hace referencia.
4. **Produce salidas**: Genera un diagrama Mermaid, JSON o estadísticas según banderas.

### Uso

```bash
# Diagrama Mermaid (por defecto) — limitado a los 50 principales arcos
node scripts/dependency-graph.js

# Lista de adyacencia JSON — todos los arcos
node scripts/dependency-graph.js --json

# Solo estadísticas
node scripts/dependency-graph.js --stats
```

### Formatos de salida

#### Salida de diagrama Mermaid

```
graph LR
    agent_handoff["agent handoff"] --> session_handoff["session handoff"]
    skill_composition["skill composition"] --> agent_handoff["agent handoff"]
    ...
    %% ... mostrando los 50 principales de 237 arcos
```

Copie y pegue esto en un bloque de código Markdown (use ` ```mermaid ... ``` `) para representar un diagrama de flujo interactivo de izquierda a derecha en GitHub, Obsidian o cualquier visor Markdown con soporte de Mermaid.

**Nota**: La salida Mermaid se limita a 50 arcos para evitar diagramas abrumadores. Use `--json` para el gráfico completo.

#### Salida JSON

```json
{
  "agent-handoff": ["session-handoff", "agent-tracing"],
  "skill-composition": ["agent-handoff"],
  "rag-architect": ["prompt-caching", "llm-eval"],
  ...
}
```

Cada clave es una habilidad/agente; el valor es una matriz ordenada de habilidades/agentes a las que hace referencia. Úselo para análisis programático o para alimentar herramientas de visualización.

#### Salida de estadísticas

```
Estadísticas del gráfico de dependencias:

  Total de habilidades/agentes: 427
  Nodos con referencias: 189
  Total de arcos: 512
  Nodos huérfanos (sin referencias): 238

  Top 10 más conectados:
    prompt-engineering: 24 referencias
    agent-handoff: 18 referencias
    claude-api: 16 referencias
    llm-eval: 14 referencias
    ...
```

Proporciona una vista de resumen: nodos totales, cuántos tienen dependencias, recuento de arcos, recuento de huérfanos y las 10 habilidades/agentes más referenciadas.

---

## Usando el visualizador interactivo: `scripts/visualize-graph.js`

Para la exploración interactiva, use el visualizador de gráfico force-directed de D3.js.

### Uso

```bash
# Generar JSON del gráfico de dependencias, canalizar al visualizador
node scripts/dependency-graph.js --json | node scripts/visualize-graph.js

# O guardar JSON primero, luego visualizar
node scripts/dependency-graph.js --json > /tmp/graph.json
node scripts/visualize-graph.js < /tmp/graph.json
```

Esto genera un archivo HTML independiente con un gráfico force-directed D3.js interactivo. Abra en un navegador web para:

- **Arrastrar nodos** para explorar la red
- **Zoom y panorámica** para navegar
- **Pasar sobre nodos** para resaltar conexiones
- **Hacer clic en nodos** para fijarlos/desfijarlos
- **Ver grado de nodo** (grado entrante y saliente) en información sobre herramientas

El HTML incluye todas las dependencias incrustadas (sin solicitudes externas) y es adecuado para presentaciones o compartir con miembros del equipo.

---

## Flujos de trabajo comunes

### Encontrar todas las habilidades que dependen de una habilidad dada

Consulte la salida JSON:

```bash
node scripts/dependency-graph.js --json | jq 'to_entries[] | select(.value[] == "prompt-caching") | .key'
```

Esto devuelve todas las habilidades que hacen referencia a `prompt-caching`.

### Identificar nodos altamente conectados (habilidades del hub)

```bash
node scripts/dependency-graph.js --json | jq 'to_entries | map({name: .key, count: (.value | length)}) | sort_by(.count) | reverse | .[0:10]'
```

Top 10 habilidades por referencias salientes.

### Encontrar habilidades huérfanas (sin dependencias)

```bash
node scripts/dependency-graph.js --json | jq 'to_entries[] | select(.value | length == 0) | .key'
```

Estos pueden ser habilidades independientes, habilidades especializadas de dominio o candidatos para archivo si no se mantienen activamente.

### Verificar dependencias circulares

Inspeccione manualmente el gráfico o use el visualizador interactivo para detectar ciclos. Nota: la implementación actual solo detecta referencias directas; la verdadera detección de dependencias circulares (A → B → A) requeriría un recorrido de gráfico.

---

## Interpretando resultados

### Grado de salida alto (muchos arcos salientes)

Una habilidad que hace referencia a muchas otras. Ejemplos:
- `agent-handoff` (referencias `session-handoff`, `agent-tracing`, etc.) — una habilidad que combina múltiples conceptos
- `skill-composition` — una guía o meta-habilidad que describe cómo combinar otras habilidades

**Acción**: Verifique que las referencias sean necesarias. Consolide si hay duplicación.

### Grado de entrada alto (muchos arcos entrantes)

Una habilidad a la que muchas otras hacen referencia. Ejemplos:
- `prompt-engineering` (referenciado por muchas habilidades de nivel superior)
- `claude-api` (fundamental para habilidades de SDK)

**Acción**: Trate como infraestructura central estable. Los cambios aquí tienen un amplio impacto — revise cuidadosamente.

### Nodos aislados (cero arcos)

Una habilidad sin referencias cruzadas a otras habilidades. Ejemplos:
- Habilidades específicas de dominio (p. ej., `photography-studio` en `skills/small-business/`)
- Habilidades recién agregadas aún no integradas
- Tutoriales independientes

**Acción**: No necesariamente malo. El aislamiento puede indicar especialización en el dominio. Pero si es una habilidad de utilidad, considere si debería referenciarse en otros lugares.

---

## Actualizar dependencias (Manual)

El gráfico se construye a partir de **referencias textuales** en el contenido del archivo. Cuando usted:

1. **Renombra un archivo de habilidad** (p. ej., `foo.md` → `bar.md`): Todas las referencias existentes a "foo" se rompen automáticamente. Actualice cualquier archivo que mencione `foo` para usar `bar`.
2. **Agrega una nueva referencia**: Mencione la otra habilidad por nombre en el contenido de su archivo. La siguiente compilación de gráfico la detectará.
3. **Elimina una referencia**: Elimine la mención. La siguiente compilación de gráfico eliminará el arco.

No se requiere un manifiesto de dependencia explícito — el gráfico se deduce del contenido.

---

## Integración con CI/CD

Agregue una verificación pre-commit o CI para validar el gráfico de dependencias:

```bash
# Detectar dependencias circulares o habilidades aisladas
node scripts/dependency-graph.js --stats | grep "Orphan nodes"
```

O use el flujo de trabajo `/skill-audit` (ver `workflows/skill-audit.md`) para ejecutar una auditoría de dependencia completa como parte de su proceso de revisión.

---

## Ejemplo: Análisis de la composición de habilidades

Suponga que desea comprender la estructura de la guía `skill-composition`:

```bash
node scripts/dependency-graph.js --json | jq '.["skill-composition"]'
```

Salida:
```json
["agent-handoff", "agent-memory", "llm-eval", "prompt-engineering"]
```

La guía `skill-composition` hace referencia a cuatro habilidades principales. Ahora conoce el camino de aprendizaje: lea esas cuatro habilidades, luego regrese a `skill-composition` para saber cómo combinarlas.

---

## Solución de problemas

**El gráfico está vacío o tiene muy pocos arcos**: Asegúrese de ejecutar desde la raíz del repositorio (`/Users/tushar/Desktop/Claudient`). El script busca `skills/` y `agents/` relativos a la raíz del repositorio.

**Falsos positivos (referencias incorrectamente detectadas)**: La coincidencia no distingue mayúsculas de minúsculas y usa límites de palabra. Cadenas como "agent" coinciden con "agent-handoff" (correcto) pero también podrían coincidir con "agent_supervisor" si no es cuidadoso. Revise el contenido actual del archivo de habilidad para confirmar que la referencia es intencional.

**Falta una habilidad en el gráfico**: El script solo indexa archivos `.md` en los directorios `skills/` y `agents/`. Las guías, flujos de trabajo y otros directorios no se indexan (esto es intencional — el gráfico se enfoca en el núcleo de habilidades/agentes). Si falta una habilidad, verifique que esté en el directorio correcto.

---

## Pasos siguientes

- Ejecute `/skill-discovery` (ver `skills/ai-engineering/skill-discovery.md`) para encontrar habilidades relacionadas de forma interactiva.
- Ejecute el flujo de trabajo `skill-audit` (`workflows/skill-audit.md`) para identificar brechas de cobertura y nodos sobre-conectados.
- Use el visualizador interactivo (`scripts/visualize-graph.js`) para explorar la red en tiempo real.
