# MCP: Pensamiento secuencial

Un servidor de razonamiento estructurado paso a paso que obliga a Claude a pensar metódicamente a través de problemas complejos antes de responder, reduciendo significativamente los errores en tareas multietapa.

## Por qué lo necesitas

El comportamiento predeterminado de Claude en problemas difíciles es responder inmediatamente, lo que puede producir un razonamiento que suena confiado pero incompleto. El Pensamiento Secuencial cambia la mecánica:
- Cada paso de razonamiento es explícito, numerado y se basa en el anterior
- El modelo puede revisar pasos anteriores si descubre una contradicción — el razonamiento no está bloqueado
- Las decisiones arquitectónicas complejas, las cadenas de depuración y los planes de migración se benefician de esta restricción
- El resultado estructurado es auditable — puedes ver exactamente dónde fue el razonamiento y cuestionar cualquier paso

## Instalación

```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
```

## Configuración

Añade a `~/.claude.json` o al archivo `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

Sin variables de entorno ni claves API requeridas.

## Herramientas clave / Qué hace

**`sequentialThinking`** — la única herramienta que expone este servidor. Impulsa un proceso estructurado de cadena de pensamiento.

Parámetros:
- `thought` — el contenido del paso de razonamiento actual
- `nextThoughtNeeded` — booleano; `true` si se necesitan más pasos, `false` cuando se alcanza la conclusión
- `thoughtNumber` — el índice del paso actual (basado en 1)
- `totalThoughts` — pasos totales estimados (se pueden revisar durante el proceso)
- `isRevision` — booleano opcional; marca un paso como corrección de uno anterior
- `revisesThought` — opcional; el número de paso que se revisa

El servidor gestiona la cadena y devuelve el razonamiento acumulado en cada paso. Claude lo usa internamente para trabajar a través de problemas antes de presentar una respuesta.

## Ejemplos de uso

```
Usa el pensamiento secuencial para planificar la migración de nuestro sistema de autenticación
de JWT a tokens basados en sesiones. Considera la estrategia de reversión,
opciones de almacenamiento de sesiones y compatibilidad hacia atrás.
```

```
Piensa paso a paso: ¿debería este servicio ser un microservicio separado
o un módulo dentro del monolito? Considera el tamaño del equipo, la frecuencia de implementación,
el acoplamiento de datos y el aislamiento de fallos.
```

```
Pensamiento secuencial: ¿cuáles son todos los casos límite que necesitamos manejar
para el flujo de procesamiento del webhook de pago? Incluye lógica de reintento,
idempotencia, fallos parciales y desfase de reloj.
```

```
Trabaja a través de los pasos de depuración para esta falla de prueba intermitente
que solo aparece en CI. Comienza con lo que sabemos y razona sobre qué podría diferir
entre entornos locales y CI.
```

```
Usa el pensamiento secuencial para revisar este cambio de esquema de base de datos
e identifica todo sistema descendente que necesitará actualización.
```

## Autenticación

Sin autenticación requerida. El Pensamiento Secuencial es un proceso local — se ejecuta completamente en tu máquina y no realiza ninguna llamada API externa. La única actividad de red en tu sesión son las llamadas API normales de Claude.

## Consejos

**Mejores casos de uso:** Decisiones arquitectónicas, depuración compleja, planificación de migraciones, análisis de riesgos y cualquier tarea donde "¿qué me estoy perdiendo?" es una preocupación real. El resultado estructurado facilita detectar brechas.

**Se empareja con prompts explícitos:** Combina con frases como "piensa paso a paso antes de responder" o "considera todos los casos límite" para máximo efecto. El servidor fuerza la estructura; tu prompt guía qué razonar.

**Compensación de latencia:** El pensamiento secuencial añade 2–5 segundos por cadena de razonamiento dependiendo de la complejidad. Resérvalo para problemas donde la corrección importa más que la velocidad — no lo uses para búsquedas simples o tareas de un solo paso.

**Los pasos de revisión son valiosos:** Cuando Claude marca un paso como revisión, presta atención. Significa que el razonamiento descubrió un error o contradicción a mitad de cadena. A menudo son los insights más importantes.

**Salida legible:** Pide a Claude que presente la cadena de razonamiento final como una lista numerada después de que la herramienta termine. La salida bruta de la herramienta es JSON estructurado — la versión reformateada es más fácil de revisar y compartir.

**No es un sustituto del conocimiento de dominio:** El Pensamiento Secuencial mejora la estructura e integridad del razonamiento. No añade información que Claude no tiene. Si el problema requiere datos externos actuales, emparéjalo con búsqueda web o herramientas de recuperación.

---
