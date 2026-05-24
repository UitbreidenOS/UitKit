# Previsualización de Claude Mythos

Una guía para la iniciativa Claude Mythos de Anthropic — un programa de investigación en vista previa que explora capacidades más allá de los despliegues estándar de Claude. Escrito para usuarios avanzados de Claude Code, investigadores de IA y desarrolladores trabajando en la frontera de lo que los sistemas agentic pueden hacer.

---

## Qué es Claude Mythos

Claude Mythos es un programa de investigación en vista previa de Anthropic Labs, anunciado a principios de 2026, enfocado en explorar las capacidades de Claude fuera de los límites del producto estándar y disponible públicamente. No es un lanzamiento de producto — es un programa de acceso estructurado para probar y validar capacidades que aún no están listas para disponibilidad general.

La iniciativa se enfoca en tres clusters de capacidades:

**Extended reasoning chains.** Los modelos estándar de Claude operan dentro de un presupuesto de razonamiento fijo. Las variantes de Mythos pueden mantener cadenas de razonamiento significativamente más largas que el techo de tokens estándar, permitiendo una descomposición más profunda de problemas que requieren muchos pasos de razonamiento antes de llegar a una conclusión accionable. Esto no es simplemente una ventana de contexto más grande — la arquitectura de razonamiento en sí está configurada para permitir más refinamiento iterativo antes de comprometerse con una salida.

**Long-horizon multi-turn tool use.** Las sesiones estándar de Claude Code pueden completar tareas complejas de múltiples pasos, pero la presión de contexto y los límites de profundidad de llamadas de herramientas imponen límites prácticos. Mythos está diseñado para mantener estado de tarea coherente en más de 100 llamadas de herramientas, manteniendo fidelidad de objetivos en una larga secuencia de acciones sin la degradación común en sesiones agentic extendidas.

**Prueba de nuevas capacidades antes del lanzamiento general.** Mythos sirve como una superficie controlada para que Anthropic evalúe capacidades — incluyendo razonamiento multimodal, patrones novedosos de interacción de herramientas y primitivas de coordinación de agentes — antes de que esas capacidades se promuevan a modelos de producción. Los comportamientos observados en Mythos pueden cambiar, ser eliminados o aparecer en forma diferente en lanzamientos generales posteriores.

El acceso es selectivo. Los suscriptores de Pro, Max, Team y Enterprise pueden solicitar acceso temprano a través del programa Anthropic Labs. El acceso se otorga sobre una base continua, priorizando investigadores, usuarios de alto uso y casos de uso que generan señal útil para el trabajo de evaluación de Anthropic.

---

## Cómo difiere del Claude estándar

| Característica | Claude (estándar) | Claude Mythos |
|---|---|---|
| Presupuesto de razonamiento | Hasta ~32K tokens | Extendido — límite de investigación, no publicado |
| Longitud máxima de sesión | Ventana de contexto estándar | Ventana de contexto extendida |
| Profundidad de llamada de herramientas | Límites estándar | Uso de herramientas recursivas más profundo soportado |
| Disponibilidad | Disponible públicamente | Vista previa de Labs — acceso selectivo |
| Identificador de modelo | claude-sonnet-4-6, claude-opus-4-6 | Variante de investigación — ver panel de Labs |
| SLA | Sí (para tiers de API y Enterprise) | Ninguno — modelos de vista previa no tienen SLA |
| Latencia | Estándar | Mayor debido a pasos de razonamiento extendido |
| Preparación para producción | Sí | No — no apto para cargas de trabajo de producción |

El identificador de modelo para variantes de Mythos no se publica en la documentación de API estándar. Si tienes acceso, el ID de modelo correcto aparecerá en el panel de Anthropic Labs. No hardcodees una cadena de modelo asumida — retriévalo del panel y trátalo como sujeto a cambios entre actualizaciones de vista previa.

---

## Accediendo a Mythos

El acceso no es automático, incluso para suscriptores pagadores. El proceso:

1. Navega a `claude.ai/labs` y solicita la vista previa de Mythos.
2. Se requiere una suscripción activa de Pro, Max (5x o 20x), Team o Enterprise. Las cuentas de nivel gratuito no son elegibles.
3. Las solicitudes se revisan sobre una base continua. No hay SLA publicado para cuándo se otorga el acceso. La prioridad se da a casos de uso con valor de investigación claro.
4. Una vez aprobado, el acceso a la API se proporciona a través de un ID de modelo de vista previa separado visible en el panel de Labs. Este ID de modelo es distinto de cualquier ID de modelo de producción y cambia con cada actualización de vista previa.
5. El acceso interactivo de Claude.ai (si se otorga) aparece como un selector de modo separado — no está habilitado por defecto en la interfaz principal.

Si estás en un plan Team o Enterprise, la gestión de acceso puede requerir que un administrador habilite Mythos para seats específicos. Consulta con tu contacto de cuenta de Anthropic de la organización.

No hay una ruta de actualización de autoservicio a Mythos. Es un programa cerrado por aplicación.

---

## Qué puedes hacer con Mythos en Claude Code

Los siguientes casos de uso se benefician materialmente de las capacidades de Mythos versus Claude Code estándar:

**Refactorizaciones de codebase de largo horizonte.** Tareas como migrar una codebase completa de un framework a otro, o hacer cumplir un nuevo patrón arquitectónico en cientos de archivos, requieren mantener un modelo consistente del estado objetivo mientras se ejecutan docenas de ediciones de archivos. El soporte extendido de contexto y profundidad de llamada de herramientas de Mythos hace que estas tareas sean más confiables — menos colapsos de contexto a mitad de sesión, mejor retención de objetivos en muchos sub-pasos.

**Tareas complejas de investigación multisalto.** Cuando una tarea requiere leer muchos documentos, sintetizar información entre fuentes, formar hipótesis, probarlas contra fuentes adicionales y revisar, el presupuesto de razonamiento extendido permite trazas de razonamiento más exhaustivas antes de comprometerse con conclusiones. Esto es distinto de simplemente tener más contexto — cambia la calidad de los pasos de razonamiento intermedios.

**Sesiones autónomas extendidas.** Las sesiones agentic estándar en Claude Code son prácticas para tareas que se completan en docenas de pasos. Mythos está diseñado para respaldar sesiones que se ejecutan significativamente más tiempo sin la degradación típica en coherencia de tareas. Esto es relevante para agentes completamente autónomos que ejecutan ciclos de construcción-prueba-corrección largos o flujos de trabajo multifase.

**Patrones novedosos de coordinación de agentes.** Mythos es la superficie apropiada para probar patrones de orquestación que requieren que un coordinador mantenga estado en muchas llamadas de subagentes generados. Si estás desarrollando un sistema multiagente que presiona contra límites estándar de coordinación, Mythos proporciona un contexto donde esos límites se relajan lo suficiente para explorar nuevos patrones — con el entendimiento de que lo que funciona en vista previa puede requerir ajuste cuando el patrón se mueve a modelos de producción.

---

## Modo de razonamiento extendido

Si tienes acceso a Mythos, el razonamiento extendido se configura a nivel de API al hacer llamadas al modelo de vista previa.

**Habilitar presupuesto de razonamiento extendido en llamadas de API.** En el SDK de Anthropic, el parámetro `thinking` acepta un valor `budget_tokens`. Para modelos estándar, se aplica el techo documentado. Para modelos de vista previa de Mythos, el techo efectivo es más alto — el límite exacto está documentado en el panel de Labs para tu tier de acceso y está sujeto a cambios entre actualizaciones de vista previa.

```python
response = client.messages.create(
    model="<mythos-model-id-from-labs-dashboard>",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 80000  # ejemplo — verifica el límite de tu tier en el panel
    },
    messages=[{"role": "user", "content": your_prompt}]
)
```

No asumas ningún techo de `budget_tokens` específico. Recupera el límite del panel de Labs. Exceder el límite soportado resultará en un error de API, no truncación silenciosa.

**Leyendo la traza de razonamiento.** El objeto de respuesta incluye un bloque de contenido `thinking` junto al bloque `text`. La traza de razonamiento es el razonamiento interno del modelo — refleja los pasos tomados antes de producir la respuesta final. En modo de razonamiento extendido, esta traza puede ser sustancialmente más larga que en modo estándar. Trátala como salida de diagnóstico en lugar de contenido orientado al usuario. Es útil para entender por qué el modelo llegó a una conclusión particular, identificar dónde el razonamiento salió mal en una tarea fallida y calibrar si el razonamiento extendido proporciona valor para una clase de tarea dada.

**Cuándo el razonamiento extendido ayuda.** El razonamiento extendido es más valioso para tareas donde la respuesta correcta no es inmediatamente derivable — problemas que requieren explorar múltiples enfoques, tareas con muchas restricciones interdependientes que deben satisfacerse simultáneamente y tareas de investigación donde la pregunta misma necesita refinamiento antes de que una respuesta sea significativa. En estos casos, el presupuesto extendido permite al modelo agotar más del espacio de problemas antes de comprometerse.

**Cuándo el razonamiento extendido es excesivo.** Las tareas simples y bien especificadas no se benefician de presupuestos de razonamiento extendido. Una solicitud para formatear un archivo, escribir una prueba unitaria para una función claramente definida o buscar un valor en un documento no mejora con más tokens de razonamiento — solo cuesta más y toma más tiempo. Usa razonamiento extendido solo para tareas donde la complejidad de razonamiento justifica el costo y la latencia.

**Costo.** Los tokens de razonamiento extendido se facturan a la tasa de token de razonamiento, que difiere de la tasa de token de entrada/salida estándar. Los tokens de razonamiento se acumulan rápidamente en modo de razonamiento extendido. Para detalles de costos, ver [guides/billing-and-pricing.md](billing-and-pricing.md). Monitorea tu uso durante sesiones de Mythos — los modelos de vista previa pueden generar trazas de razonamiento muy grandes en tareas complejas.

---

## Limitaciones y advertencias

Mythos es un programa de vista previa. Esa designación tiene implicaciones específicas y no negociables:

**Los cambios de comportamiento entre actualizaciones.** Anthropic actualiza modelos de vista previa más frecuentemente que modelos de producción y sin las garantías de estabilidad que se aplican a los lanzamientos de GA. Un comportamiento en el que confías hoy puede cambiar en la próxima actualización de vista previa. No construyas sistemas de producción en identificadores de modelos de Mythos o comportamientos.

**No todas las características de Claude Code se validan con variantes de Mythos.** Las características como hooks, ciertas integraciones de servidores MCP y patrones específicos de llamada de herramientas se prueban contra modelos de producción. La compatibilidad con variantes de Mythos no está garantizada y es posible que los problemas encontrados no sean priorizados para correcciones dado el estado de vista previa.

**Latencia más alta.** Los pasos de razonamiento extendido toman tiempo. Las tareas que se completan en segundos en modelos estándar pueden tomar minutos en Mythos cuando el presupuesto de razonamiento completo se utiliza. Esto es comportamiento esperado, no un error, pero descalifica a Mythos de cualquier caso de uso sensible a la latencia.

**No apto para cargas de trabajo de producción.** La ausencia de un SLA es la señal explícita aquí. Si una carga de trabajo requiere garantías de confiabilidad, usa modelos de GA. Mythos existe para investigación y exploración, no para servir a usuarios finales.

**El acceso puede ser revocado.** Como programa de vista previa, Anthropic se reserva el derecho de ajustar el acceso, modificar términos o discontinuar la vista previa sin previo aviso. Planifica en consecuencia — no construyas infraestructura crítica en acceso de vista previa.

**Documentación limitada.** Las capacidades de Mythos están intencionalmente subdocumentadas en canales públicos. El panel de Labs es la fuente autorizada para los límites, IDs de modelo y características soportadas de tu tier de acceso. No confíes en documentación de terceros como referencia principal.

---

## Mantente actualizado

Mythos evoluciona más rápido que el producto estándar. Las siguientes fuentes son las referencias autorizadas:

- `anthropic.com/research` — Canal principal de Anthropic para anunciar direcciones de investigación, nuevas capacidades y actualizaciones de programas. Aquí es donde se discuten por primera vez públicamente los desarrollos a nivel de Mythos.
- `claude.ai/labs` — El portal de acceso y panel para programas de Labs incluyendo Mythos. Los IDs de modelo, límites de tier y disponibilidad de características se documentan aquí para usuarios inscritos.
- `anthropic.com/claude/changelog` — El registro de cambios público para cambios de modelo y producto de Claude. Es posible que las actualizaciones del modelo de vista previa aparezcan aquí con menos detalle que los cambios del modelo de producción, pero las actualizaciones significativas se anotan.

No hay una lista de correo dedicada o feed RSS para actualizaciones específicas de Mythos a partir de mayo de 2026. Monitorea los canales anteriores y presta atención al panel de Labs — las actualizaciones a tu ID de modelo disponible o límites de presupuesto aparecerán aquí antes de aparecer en cualquier otro lugar.

---

## Guías relacionadas

- [guides/billing-and-pricing.md](billing-and-pricing.md) — Tasas de tokens para tokens de razonamiento, límites de plan y el cambio de facturación del 15 de junio que afecta cómo se contabilizan los costos de razonamiento extendido en suscripciones Pro y Max.
- [guides/context-management.md](context-management.md) — Estrategias para gestionar ventanas de contexto extendidas, relevantes para sesiones de Mythos donde el uso de contexto es sustancialmente más alto que en sesiones estándar.
